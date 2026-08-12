export type TipoDocumento =
  | "concentracion-notas"
  | "programa-asignatura"
  | "acta-convalidacion"
  | "certificado-titulo"
  | "declaracion-jurada"
  | "codigo-validacion";

export interface DatosExtraidos {
  institucion?: string;
  carrera?: string;
  asignatura?: string;
  nota?: number;
  horas?: number;
  semestre?: string;
  cantidadAsignaturas?: number;
}

export interface ResultadoVerificacion {
  legible: boolean;
  tieneFirma: boolean;
  tieneTimbre: boolean;
  tieneCodigoValidable: boolean;
  codigoVencido?: boolean;
  esCapturaPantalla: boolean;
  anomalias: string[];
  datosExtraidos?: DatosExtraidos;
}

export type EstadoDocumento =
  | "cargado"
  | "analizando"
  | "verificado"
  | "rechazado-requiere-reemplazo";

export interface Documento {
  id: string;
  tipo: TipoDocumento;
  nombreArchivo: string;
  estado: EstadoDocumento;
  resultadoVerificacion?: ResultadoVerificacion;
  subidoEn: string;
}
