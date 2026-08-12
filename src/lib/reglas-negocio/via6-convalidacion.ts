export type ModoAnalisisVia6 = "memoria-de-casos" | "comparacion-programas";

/**
 * Vía 6: si no hay programas académicos (o el envío es parcial), se recurre
 * a la memoria de convalidaciones ya resueltas. Si hay programas, se hace
 * comparación semántica contra la malla IACC.
 */
export function determinarModoAnalisisVia6(tieneProgramasAcademicos: boolean): ModoAnalisisVia6 {
  return tieneProgramasAcademicos ? "comparacion-programas" : "memoria-de-casos";
}

export const DESCRIPCION_MODO_ANALISIS_VIA6: Record<ModoAnalisisVia6, string> = {
  "memoria-de-casos":
    "No se presentaron programas académicos (o el envío fue parcial): la plataforma consulta su memoria de convalidaciones ya resueltas por la escuela y, si encuentra un caso previo con el mismo criterio, lo aplica sin exigir los programas.",
  "comparacion-programas":
    "Se presentaron los programas académicos: la plataforma compara el contenido del programa externo contra la malla IACC y calcula un porcentaje de coincidencia.",
};
