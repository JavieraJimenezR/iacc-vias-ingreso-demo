import type { NivelConfianza } from "@/types";
import { calcularNivelConfianza } from "@/lib/reglas-negocio/umbrales";

export interface AsignaturaComparable {
  nombre: string;
  horas: number;
  contenidos: string[];
}

export interface ResultadoComparacion {
  porcentaje: number;
  confianza: NivelConfianza;
  fragmentoExterno: string;
  fragmentoIacc: string;
}

/**
 * Comparación semántica determinística: el porcentaje de coincidencia se
 * calcula por intersección de contenidos declarados en el seed, no por
 * azar, para que la demo sea reproducible al reiniciarse.
 */
export function calcularCoincidencia(
  asignaturaExterna: AsignaturaComparable,
  asignaturaIacc: AsignaturaComparable
): ResultadoComparacion {
  const contenidosExterno = new Set(asignaturaExterna.contenidos.map((c) => c.toLowerCase().trim()));
  const contenidosIacc = new Set(asignaturaIacc.contenidos.map((c) => c.toLowerCase().trim()));

  const coincidentes = [...contenidosExterno].filter((c) => contenidosIacc.has(c));
  const total = Math.max(contenidosIacc.size, 1);
  const porcentaje = Math.round((coincidentes.length / total) * 100);

  return {
    porcentaje,
    confianza: calcularNivelConfianza(porcentaje),
    fragmentoExterno: asignaturaExterna.contenidos.join("; "),
    fragmentoIacc: asignaturaIacc.contenidos.join("; "),
  };
}
