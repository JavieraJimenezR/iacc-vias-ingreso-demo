export type TipoEstudiante = "postulante" | "matriculado";

export interface AsignaturaMalla {
  codigo: string;
  nombre: string;
  semestre: number;
  creditos: number;
  reconocida?: boolean;
}

export interface Estudiante {
  id: string;
  nombreCompleto: string;
  rut: string;
  edad: number;
  tipo: TipoEstudiante;

  carreraOrigen?: string;
  institucionOrigen?: string;
  semestresCursadosOrigen?: number;

  carrera: string;
  cicloActual?: number;
  avanceCurricularPorcentaje?: number;
  malla: AsignaturaMalla[];

  casoActivoId?: string;
}
