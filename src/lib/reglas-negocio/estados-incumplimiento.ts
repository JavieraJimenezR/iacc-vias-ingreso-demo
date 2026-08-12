export type EstadoIncumplimiento = "ok" | "bloqueado" | "eliminado";

/**
 * Vía 5: si el certificado no llega durante el segundo ciclo se bloquea la
 * inscripción; tras dos ciclos sin regularizar, el caso se elimina.
 */
export function calcularEstadoIncumplimiento(ciclosSinDocumento: number): EstadoIncumplimiento {
  if (ciclosSinDocumento >= 2) return "eliminado";
  if (ciclosSinDocumento >= 1) return "bloqueado";
  return "ok";
}
