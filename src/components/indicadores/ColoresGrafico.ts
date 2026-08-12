/**
 * Colores fijos para recharts, derivados de los tokens HSL de src/index.css
 * (recharts no siempre resuelve bien `hsl(var(--x))` dentro de <svg>, por lo
 * que se fijan los valores equivalentes en hex).
 */
export const COLOR_PRIMARIO = "#8CC63F"; // --primary
export const COLOR_EXITO = "#22a06b"; // --exito
export const COLOR_ADVERTENCIA = "#e6a919"; // --advertencia
export const COLOR_DESTRUCTIVO = "#d3342d"; // --destructive
export const COLOR_MUTED = "#a3a3a3";

export const PALETA_VIAS = [COLOR_PRIMARIO, "#5b8fd1"];
export const PALETA_CONFIANZA = [COLOR_EXITO, COLOR_ADVERTENCIA, COLOR_DESTRUCTIVO];
