import type { AppState } from "./useAppStore";
import { estudiantesSeed } from "@/lib/mock-data";
import type { Caso } from "@/types";

export const selCasoPorId = (casoId: string | undefined) => (state: AppState): Caso | undefined =>
  casoId ? state.casos.find((c) => c.id === casoId) : undefined;

export const selCasos = (state: AppState) => state.casos;

/**
 * Bandeja del backoffice: casos con confianza bajo el umbral y más antiguos
 * primero, para que el equipo priorice lo que necesita más atención humana.
 */
export function ordenarCasosBandeja(casos: Caso[]): Caso[] {
  return [...casos].sort((a, b) => {
    const aPrioridad = a.porcentajeConfianza < 80 ? 0 : 1;
    const bPrioridad = b.porcentajeConfianza < 80 ? 0 : 1;
    if (aPrioridad !== bPrioridad) return aPrioridad - bPrioridad;
    return b.antiguedadDias - a.antiguedadDias;
  });
}

export function selEstudiantePorId(estudianteId: string | undefined) {
  return estudianteId ? estudiantesSeed.find((e) => e.id === estudianteId) : undefined;
}

/** Estudiante activo según la perspectiva actual (demo fija: Camila / Rodrigo). */
export function selEstudianteActivo(perspectiva: AppState["perspectiva"]) {
  if (perspectiva === "postulante") return estudiantesSeed.find((e) => e.id === "est-camila");
  if (perspectiva === "estudiante") return estudiantesSeed.find((e) => e.id === "est-rodrigo");
  return undefined;
}
