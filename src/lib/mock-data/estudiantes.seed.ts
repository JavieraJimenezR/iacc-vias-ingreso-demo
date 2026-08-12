import type { Estudiante } from "@/types";
import { buscarMallaPorCarrera } from "./mallas.seed";

function mallaConReconocidas(carrera: string, codigosReconocidos: string[]): Estudiante["malla"] {
  const malla = buscarMallaPorCarrera(carrera);
  if (!malla) return [];
  return malla.asignaturas.map((a) => ({
    codigo: a.codigo,
    nombre: a.nombre,
    semestre: a.semestre,
    creditos: a.creditos,
    reconocida: codigosReconocidos.includes(a.codigo),
  }));
}

export const estudianteCamila: Estudiante = {
  id: "est-camila",
  nombreCompleto: "Camila Fuentes Aravena",
  rut: "19.842.375-6",
  edad: 29,
  tipo: "postulante",
  carreraOrigen: "Técnico en Administración",
  institucionOrigen: "Instituto Profesional Los Andes del Sur",
  semestresCursadosOrigen: 4,
  carrera: "Ingeniería en Administración de Empresas",
  malla: mallaConReconocidas("Ingeniería en Administración de Empresas", [
    "ADM-1101",
    "CON-1201",
    "ADM-2102",
    "ADM-2103",
    "ADM-2301",
    "ADM-1301",
  ]),
  casoActivoId: "caso-camila",
};

export const estudianteRodrigo: Estudiante = {
  id: "est-rodrigo",
  nombreCompleto: "Rodrigo Salas Miranda",
  rut: "16.398.204-1",
  edad: 34,
  tipo: "matriculado",
  carreraOrigen: "Técnico en Prevención de Riesgos",
  institucionOrigen: "CFT Valle Central",
  carrera: "Ingeniería en Prevención de Riesgos",
  cicloActual: 5,
  avanceCurricularPorcentaje: 58,
  malla: mallaConReconocidas("Ingeniería en Prevención de Riesgos", ["PRI-1101", "PRI-1201"]),
  casoActivoId: "caso-rodrigo",
};

export const estudiantesSeed: Estudiante[] = [estudianteCamila, estudianteRodrigo];
