export interface EntradaMemoriaCasos {
  institucionOrigen: string;
  asignaturaExterna: string;
  asignaturaIaccCodigo: string;
  asignaturaIaccNombre: string;
  casoIdReferencia: string;
  casoNumeroReferencia: string;
}

/**
 * Simula la "memoria de convalidaciones ya resueltas": cuando un caso de
 * vía 6 no trae programas académicos, el coordinador consulta este índice
 * para ver si la escuela ya resolvió esa asignatura antes con el mismo
 * criterio, en vez de exigir los programas de nuevo.
 */
export const memoriaCasosSeed: EntradaMemoriaCasos[] = [
  {
    institucionOrigen: "Instituto Profesional Los Andes del Sur",
    asignaturaExterna: "Contabilidad General",
    asignaturaIaccCodigo: "CON-1201",
    asignaturaIaccNombre: "Fundamentos de Contabilidad",
    casoIdReferencia: "caso-004",
    casoNumeroReferencia: "IACC-2025-0104",
  },
  {
    institucionOrigen: "CFT Valle Central",
    asignaturaExterna: "Administración General",
    asignaturaIaccCodigo: "ADM-1101",
    asignaturaIaccNombre: "Fundamentos de Administración",
    casoIdReferencia: "caso-007",
    casoNumeroReferencia: "IACC-2025-0107",
  },
  {
    institucionOrigen: "Instituto Profesional Cordillera",
    asignaturaExterna: "Higiene y Seguridad Laboral",
    asignaturaIaccCodigo: "PRI-1101",
    asignaturaIaccNombre: "Fundamentos de Prevención de Riesgos",
    casoIdReferencia: "caso-009",
    casoNumeroReferencia: "IACC-2025-0109",
  },
];

export function buscarEnMemoriaCasos(
  institucionOrigen: string,
  asignaturaExterna: string
): EntradaMemoriaCasos | undefined {
  return memoriaCasosSeed.find(
    (e) =>
      e.institucionOrigen === institucionOrigen &&
      e.asignaturaExterna.toLowerCase() === asignaturaExterna.toLowerCase()
  );
}
