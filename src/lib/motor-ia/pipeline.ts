import type { Documento, PropuestaIA, ResultadoVerificacion } from "@/types";
import { delay, conJitter } from "./delay";
import { ocrExtraerCampos } from "./ocr.mock";
import { verificarAutenticidad } from "./verificacion";
import { calcularCoincidencia } from "./comparacion-semantica";
import { enrutarPropuesta } from "./enrutamiento";
import { buscarEnMemoriaCasos } from "@/lib/mock-data/memoria-casos.seed";
import { buscarMallaPorCarrera } from "@/lib/mock-data/mallas.seed";

export interface EntradaPipelineIA {
  nombreArchivo: string;
  tipoDocumento: Documento["tipo"];
  institucionOrigen: string;
  carreraDestino: string;
  /** Contenidos declarados de la asignatura externa, si se conocen (demo). */
  contenidosAsignaturaExterna?: string[];
  horasAsignaturaExterna?: number;
}

export interface ResultadoPipelineIA {
  resultadoVerificacion: ResultadoVerificacion;
  coincidencia?: {
    porcentaje: number;
    confianza: "alta" | "media" | "baja";
    fragmentoExterno: string;
    fragmentoIacc: string;
    asignaturaIaccCodigo: string;
    asignaturaIaccNombre: string;
  };
  matchMemoriaCasos?: {
    casoIdReferencia: string;
    casoNumeroReferencia: string;
    asignaturaIaccCodigo: string;
    asignaturaIaccNombre: string;
  };
  propuestaIA: PropuestaIA;
}

/**
 * Orquesta el "motor de IA" completo: OCR -> verificación de autenticidad ->
 * memoria de casos -> comparación semántica -> enrutamiento por umbral.
 * Se fuerza una duración total de 2 a 3 segundos para que la carga de
 * documentos "se sienta" trabajando, tal como pide el brief.
 */
export async function ejecutarPipelineIA(input: EntradaPipelineIA): Promise<ResultadoPipelineIA> {
  const inicio = Date.now();

  const ocr = await ocrExtraerCampos(input.nombreArchivo);

  const resultadoVerificacion = verificarAutenticidad({
    tipo: input.tipoDocumento,
    tieneFirma: ocr.tieneFirma,
    tieneTimbre: ocr.tieneTimbre,
    tieneCodigoValidable: ocr.tieneCodigoValidable,
    codigoVencido: ocr.codigoVencido,
    esCapturaPantalla: ocr.esCapturaPantalla,
    legible: ocr.legible,
    datosExtraidos: ocr.datosExtraidos,
  });

  let matchMemoriaCasos: ResultadoPipelineIA["matchMemoriaCasos"];
  let coincidencia: ResultadoPipelineIA["coincidencia"];
  let propuestaIA: PropuestaIA = "revisar";

  const asignaturaExterna = ocr.datosExtraidos?.asignatura;

  if (resultadoVerificacion.anomalias.length > 0 && resultadoVerificacion.esCapturaPantalla) {
    propuestaIA = "no-reconocer";
  } else if (asignaturaExterna) {
    const memoria = buscarEnMemoriaCasos(input.institucionOrigen, asignaturaExterna);
    if (memoria) {
      matchMemoriaCasos = {
        casoIdReferencia: memoria.casoIdReferencia,
        casoNumeroReferencia: memoria.casoNumeroReferencia,
        asignaturaIaccCodigo: memoria.asignaturaIaccCodigo,
        asignaturaIaccNombre: memoria.asignaturaIaccNombre,
      };
      propuestaIA = "reconocer";
    } else {
      const malla = buscarMallaPorCarrera(input.carreraDestino);
      const asignaturaIacc = malla?.asignaturas.find(
        (a) => a.nombre.toLowerCase() === asignaturaExterna.toLowerCase()
      ) ?? malla?.asignaturas[0];

      if (asignaturaIacc) {
        const resultado = calcularCoincidencia(
          {
            nombre: asignaturaExterna,
            horas: input.horasAsignaturaExterna ?? ocr.datosExtraidos?.horas ?? 60,
            contenidos: input.contenidosAsignaturaExterna ?? asignaturaIacc.contenidos.slice(0, 2),
          },
          { nombre: asignaturaIacc.nombre, horas: asignaturaIacc.horas, contenidos: asignaturaIacc.contenidos }
        );
        coincidencia = {
          ...resultado,
          asignaturaIaccCodigo: asignaturaIacc.codigo,
          asignaturaIaccNombre: asignaturaIacc.nombre,
        };
        propuestaIA = enrutarPropuesta(resultado.porcentaje);
      }
    }
  }

  const transcurrido = Date.now() - inicio;
  const objetivo = conJitter(2000, 1000); // 2 a 3 segundos totales
  if (transcurrido < objetivo) {
    await delay(objetivo - transcurrido);
  }

  return { resultadoVerificacion, coincidencia, matchMemoriaCasos, propuestaIA };
}
