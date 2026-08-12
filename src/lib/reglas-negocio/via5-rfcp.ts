import type { CasuisticaVia5, Documento } from "@/types";

interface DatosTituloPrevio {
  tieneCodigoValidacion: boolean;
  esTituloIacc: boolean;
  esAfinAlPrograma: boolean;
  carreraDentroDirectrices: boolean;
  antiguedadTituloAnios: number;
}

/**
 * Determina la casuística de la vía 5 (RFCP) según el título/egreso previo.
 * El orden de evaluación importa: título IACC afín es automático y prima
 * sobre cualquier otra condición.
 */
export function determinarCasuisticaVia5(datos: DatosTituloPrevio): CasuisticaVia5 {
  if (datos.esTituloIacc && datos.esAfinAlPrograma) {
    return "titulo-iacc-afin";
  }
  if (!datos.carreraDentroDirectrices || datos.antiguedadTituloAnios > 10) {
    return "requiere-autorizacion-jefe-disciplinar";
  }
  if (datos.tieneCodigoValidacion) {
    return "con-codigo-validacion";
  }
  return "sin-codigo-validacion";
}

export function documentosExigidosVia5(casuistica: CasuisticaVia5): Documento["tipo"][] {
  switch (casuistica) {
    case "titulo-iacc-afin":
      return [];
    case "con-codigo-validacion":
      return ["certificado-titulo"];
    case "sin-codigo-validacion":
      return ["certificado-titulo", "declaracion-jurada"];
    case "requiere-autorizacion-jefe-disciplinar":
      return ["certificado-titulo", "declaracion-jurada"];
  }
}

export const DESCRIPCION_CASUISTICA_VIA5: Record<CasuisticaVia5, string> = {
  "con-codigo-validacion":
    "El certificado tiene código de validación: el sistema lo valida contra el registro de la institución emisora y el reconocimiento procede.",
  "sin-codigo-validacion":
    "El certificado no tiene código de validación: debes enviar el documento físico legalizado ante notario y firmar una declaración jurada de título, comprometiéndote a entregarlo antes del cierre del tercer ciclo.",
  "titulo-iacc-afin":
    "Tu título previo fue obtenido en IACC y es afín al programa: el reconocimiento es automático, sin documentación adicional.",
  "requiere-autorizacion-jefe-disciplinar":
    "Tu carrera de origen está fuera de las directrices académicas de matrícula, o tu título tiene más de 10 años: se requiere autorización del jefe disciplinar.",
};
