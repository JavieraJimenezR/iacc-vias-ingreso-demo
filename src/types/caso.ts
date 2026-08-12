import type { Documento } from "./documento";
import type { AsignaturaEquivalencia } from "./equivalencia";
import type { EventoTrazabilidad } from "./trazabilidad";

export type ViaIngreso = "via5-rfcp" | "via6-convalidacion";

export type EstadoCaso =
  | "documentos-pendientes"
  | "en-verificacion"
  | "en-revision-humana"
  | "bloqueado-documento-pendiente"
  | "eliminado-documento-pendiente"
  | "resuelto-reconocido"
  | "resuelto-rechazado"
  | "cerrado";

export type NivelConfianza = "alta" | "media" | "baja";

export type CasuisticaVia5 =
  | "con-codigo-validacion"
  | "sin-codigo-validacion"
  | "titulo-iacc-afin"
  | "requiere-autorizacion-jefe-disciplinar";

export type RolBackoffice =
  | "registro-curricular"
  | "coordinador-academico"
  | "analista-diferenciados";

export interface AutorizacionJefeDisciplinar {
  motivo: "carrera-fuera-directrices" | "titulo-mas-10-anios";
  estado: "pendiente" | "aprobada" | "rechazada";
  comentario?: string;
}

export interface Caso {
  id: string;
  numeroCaso: string;
  estudianteId: string;
  via: ViaIngreso;
  casuisticaVia5?: CasuisticaVia5;
  esPreConvalidacion?: boolean;
  tieneProgramasAcademicos?: boolean;

  carreraOrigen: string;
  institucionOrigen: string;
  carreraDestino: string;

  estado: EstadoCaso;
  nivelConfianzaGlobal: NivelConfianza;
  porcentajeConfianza: number;

  creadoEn: string;
  antiguedadDias: number;
  responsableActual?: string;
  responsableRol?: RolBackoffice;

  documentos: Documento[];
  equivalencias: AsignaturaEquivalencia[];
  trazabilidad: EventoTrazabilidad[];

  ciclosSinDocumento?: number;
  plazoDocumentoPendiente?: string;
  autorizacionJefeDisciplinar?: AutorizacionJefeDisciplinar;

  anomaliaDocumental?: boolean;
}
