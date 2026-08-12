import type { DatosExtraidos, ResultadoVerificacion, TipoDocumento } from "@/types";

export interface InsumoVerificacion {
  tipo: TipoDocumento;
  tieneFirma: boolean;
  tieneTimbre: boolean;
  tieneCodigoValidable: boolean;
  codigoVencido?: boolean;
  esCapturaPantalla: boolean;
  legible: boolean;
  datosExtraidos?: DatosExtraidos;
}

/**
 * Reglas de autenticidad del brief: los programas deben tener firma y timbre;
 * la concentración de notas necesita firma, timbre y código validable.
 * Se rechazan capturas de pantalla y documentos sin código, firma ni timbre.
 */
export function verificarAutenticidad(insumo: InsumoVerificacion): ResultadoVerificacion {
  const anomalias: string[] = [];

  if (!insumo.legible) anomalias.push("Documento ilegible");
  if (insumo.esCapturaPantalla) anomalias.push("Es una captura de pantalla de un sistema en línea, no un documento oficial");
  if (!insumo.tieneTimbre) anomalias.push("No se detectó timbre de la institución de origen");
  if (!insumo.tieneFirma) anomalias.push("No se detectó firma");
  if (!insumo.tieneCodigoValidable && (insumo.tipo === "concentracion-notas" || insumo.tipo === "certificado-titulo")) {
    anomalias.push("No se encontró código de validación");
  }
  if (insumo.codigoVencido) anomalias.push("El código de validación está vencido");

  return {
    legible: insumo.legible,
    tieneFirma: insumo.tieneFirma,
    tieneTimbre: insumo.tieneTimbre,
    tieneCodigoValidable: insumo.tieneCodigoValidable,
    codigoVencido: insumo.codigoVencido,
    esCapturaPantalla: insumo.esCapturaPantalla,
    anomalias,
    datosExtraidos: insumo.datosExtraidos,
  };
}
