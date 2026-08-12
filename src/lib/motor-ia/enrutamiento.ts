import type { PropuestaIA } from "@/types";
import { UMBRAL_COINCIDENCIA_MIN } from "@/lib/reglas-negocio/umbrales";

/**
 * Sobre el umbral la IA propone reconocer; bajo el umbral deriva a revisión
 * humana. Nunca decide de forma automática: la propuesta siempre pasa por
 * la aprobación de una persona responsable.
 */
export function enrutarPropuesta(porcentajeCoincidencia: number): PropuestaIA {
  return porcentajeCoincidencia >= UMBRAL_COINCIDENCIA_MIN ? "reconocer" : "revisar";
}

export const REGLA_APROBACION_HUMANA =
  "Ninguna asignatura se reconoce sin evidencia y sin la aprobación de una persona responsable. La IA propone y sustenta; la persona resuelve.";
