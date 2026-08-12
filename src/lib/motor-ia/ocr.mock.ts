import type { DatosExtraidos } from "@/types";
import { delay, conJitter } from "./delay";

export interface ResultadoOcr {
  datosExtraidos: DatosExtraidos;
  legible: boolean;
  tieneFirma: boolean;
  tieneTimbre: boolean;
  tieneCodigoValidable: boolean;
  codigoVencido?: boolean;
  esCapturaPantalla: boolean;
}

/**
 * OCR simulado y determinístico: el resultado depende de patrones conocidos
 * en el nombre de archivo, para que la demo sea reproducible.
 */
export async function ocrExtraerCampos(nombreArchivo: string): Promise<ResultadoOcr> {
  await delay(conJitter(800, 400));

  const nombre = nombreArchivo.toLowerCase();

  const esCaptura = nombre.includes("captura") || nombre.endsWith(".png") || nombre.endsWith(".jpg") || nombre.endsWith(".jpeg");
  const sinTimbre = nombre.includes("sin_timbre") || nombre.includes("sintimbre");
  const sinFirma = nombre.includes("sin_firma") || nombre.includes("sinfirma");
  const sinCodigo = nombre.includes("sin_codigo") || nombre.includes("sincodigo");
  const codigoVencido = nombre.includes("vencido");
  const ilegible = nombre.includes("ilegible") || nombre.includes("borroso");

  if (esCaptura) {
    return {
      datosExtraidos: { institucion: "No identificable", cantidadAsignaturas: undefined },
      legible: true,
      tieneFirma: false,
      tieneTimbre: false,
      tieneCodigoValidable: false,
      esCapturaPantalla: true,
    };
  }

  // Diccionario mock: nombres de asignatura plausibles según patrones del nombre de archivo.
  const asignaturasConocidas: Record<string, DatosExtraidos> = {
    contabilidad: { asignatura: "Contabilidad General", horas: 72, semestre: "2" },
    matematicas: { asignatura: "Matemática Financiera", horas: 54, semestre: "2" },
    administracion: { asignatura: "Administración General", horas: 68, semestre: "1" },
    marketing: { asignatura: "Fundamentos de Marketing", horas: 60, semestre: "3" },
    costos: { asignatura: "Costos Empresariales", horas: 60, semestre: "4" },
    logistica: { asignatura: "Logística Empresarial", horas: 50, semestre: "4" },
    proyectos: { asignatura: "Gestión de Proyectos I", horas: 40, semestre: "5" },
    higiene: { asignatura: "Higiene y Seguridad Laboral", horas: 64, semestre: "2" },
    titulo: { institucion: "Institución de origen", carrera: "Carrera técnica" },
    concentracion: { cantidadAsignaturas: 8 },
  };

  let datosExtraidos: DatosExtraidos = { institucion: "Institución de origen", cantidadAsignaturas: 1 };
  for (const [clave, datos] of Object.entries(asignaturasConocidas)) {
    if (nombre.includes(clave)) {
      datosExtraidos = datos;
      break;
    }
  }

  return {
    datosExtraidos,
    legible: !ilegible,
    tieneFirma: !sinFirma,
    tieneTimbre: !sinTimbre,
    tieneCodigoValidable: !sinCodigo,
    codigoVencido: codigoVencido ? true : undefined,
    esCapturaPantalla: false,
  };
}
