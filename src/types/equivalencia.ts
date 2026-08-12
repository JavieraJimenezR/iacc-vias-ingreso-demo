import type { NivelConfianza } from "./caso";

export type PropuestaIA = "reconocer" | "no-reconocer" | "revisar";
export type DecisionRevisor = "aprobado" | "rechazado" | "modificado";

export interface AsignaturaEquivalencia {
  id: string;
  asignaturaExternaNombre: string;
  asignaturaExternaHoras: number;
  asignaturaIaccCodigo: string;
  asignaturaIaccNombre: string;
  asignaturaIaccSemestre: string;
  asignaturaIaccCreditos: number;

  porcentajeCoincidencia: number;
  nivelConfianza: NivelConfianza;
  propuestaIA: PropuestaIA;
  motivoNoReconocimiento?: string;

  decisionRevisor?: DecisionRevisor;
  comentarioRevisor?: string;
  asignaturaIaccModificadaCodigo?: string;

  fragmentoExterno?: string;
  fragmentoExternoFuente?: string;
  fragmentoIacc?: string;
  fragmentoIaccFuente?: string;

  casoPrevioReferenciaId?: string;
  casoPrevioReferenciaNumero?: string;
}
