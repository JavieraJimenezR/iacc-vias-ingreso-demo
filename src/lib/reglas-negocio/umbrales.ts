export const UMBRAL_CONFIANZA_ALTA = 85;
export const UMBRAL_CONFIANZA_MEDIA = 70;
export const UMBRAL_COINCIDENCIA_MIN = 80;

export function calcularNivelConfianza(porcentaje: number): "alta" | "media" | "baja" {
  if (porcentaje >= UMBRAL_CONFIANZA_ALTA) return "alta";
  if (porcentaje >= UMBRAL_CONFIANZA_MEDIA) return "media";
  return "baja";
}
