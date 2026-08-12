export interface AsignaturaMallaIacc {
  codigo: string;
  nombre: string;
  semestre: number;
  creditos: number;
  horas: number;
  contenidos: string[];
}

export interface MallaCarrera {
  carrera: string;
  asignaturas: AsignaturaMallaIacc[];
}

export const mallasSeed: MallaCarrera[] = [
  {
    carrera: "Ingeniería en Administración de Empresas",
    asignaturas: [
      {
        codigo: "ADM-1101",
        nombre: "Fundamentos de Administración",
        semestre: 1,
        creditos: 6,
        horas: 68,
        contenidos: ["planificación estratégica", "proceso administrativo", "organización empresarial", "toma de decisiones"],
      },
      {
        codigo: "CON-1201",
        nombre: "Fundamentos de Contabilidad",
        semestre: 1,
        creditos: 6,
        horas: 72,
        contenidos: ["contabilidad general", "estados financieros", "libro diario", "balance general", "principios contables"],
      },
      {
        codigo: "ADM-1301",
        nombre: "Matemática Financiera",
        semestre: 2,
        creditos: 5,
        horas: 54,
        contenidos: ["interés simple", "interés compuesto", "anualidades", "valor presente", "valor futuro"],
      },
      {
        codigo: "ADM-2102",
        nombre: "Gestión de Recursos Humanos",
        semestre: 3,
        creditos: 5,
        horas: 60,
        contenidos: ["reclutamiento y selección", "capacitación", "evaluación de desempeño", "clima organizacional"],
      },
      {
        codigo: "ADM-2103",
        nombre: "Marketing Estratégico",
        semestre: 3,
        creditos: 5,
        horas: 60,
        contenidos: ["segmentación de mercado", "mix de marketing", "posicionamiento", "comportamiento del consumidor"],
      },
      {
        codigo: "ADM-2201",
        nombre: "Gestión Logística",
        semestre: 4,
        creditos: 5,
        horas: 60,
        contenidos: ["cadena de suministro", "gestión de inventarios", "distribución", "logística de abastecimiento"],
      },
      {
        codigo: "ADM-2301",
        nombre: "Costos y Presupuestos",
        semestre: 4,
        creditos: 6,
        horas: 68,
        contenidos: ["costos fijos y variables", "punto de equilibrio", "presupuesto operacional", "análisis de costos"],
      },
      {
        codigo: "ADM-3101",
        nombre: "Gestión de Proyectos",
        semestre: 5,
        creditos: 5,
        horas: 60,
        contenidos: ["planificación de proyectos", "carta gantt", "gestión de riesgos", "seguimiento y control"],
      },
    ],
  },
  {
    carrera: "Ingeniería en Prevención de Riesgos",
    asignaturas: [
      {
        codigo: "PRI-1101",
        nombre: "Fundamentos de Prevención de Riesgos",
        semestre: 1,
        creditos: 6,
        horas: 68,
        contenidos: ["higiene ocupacional", "seguridad laboral", "accidentabilidad", "normativa legal vigente"],
      },
      {
        codigo: "PRI-1201",
        nombre: "Legislación en Seguridad y Salud Laboral",
        semestre: 1,
        creditos: 5,
        horas: 54,
        contenidos: ["ley 16.744", "reglamento interno", "organismos administradores", "fiscalización"],
      },
      {
        codigo: "PRI-2101",
        nombre: "Higiene Industrial",
        semestre: 3,
        creditos: 6,
        horas: 68,
        contenidos: ["agentes físicos", "agentes químicos", "evaluación ambiental", "límites de exposición"],
      },
      {
        codigo: "PRI-2201",
        nombre: "Ergonomía",
        semestre: 3,
        creditos: 5,
        horas: 60,
        contenidos: ["análisis ergonómico", "puestos de trabajo", "trastornos musculoesqueléticos", "evaluación postural"],
      },
      {
        codigo: "PRI-2301",
        nombre: "Gestión de Riesgos Operacionales",
        semestre: 4,
        creditos: 6,
        horas: 68,
        contenidos: ["identificación de peligros", "matriz de riesgos", "planes de emergencia", "investigación de accidentes"],
      },
    ],
  },
  {
    carrera: "Ingeniería en Informática",
    asignaturas: [
      {
        codigo: "INF-1101",
        nombre: "Fundamentos de Programación",
        semestre: 1,
        creditos: 6,
        horas: 68,
        contenidos: ["algoritmos", "estructuras de control", "variables y tipos de datos", "lógica de programación"],
      },
      {
        codigo: "INF-1201",
        nombre: "Base de Datos",
        semestre: 2,
        creditos: 6,
        horas: 68,
        contenidos: ["modelo relacional", "sql", "normalización", "diseño de bases de datos"],
      },
      {
        codigo: "INF-2101",
        nombre: "Redes de Computadores",
        semestre: 3,
        creditos: 5,
        horas: 60,
        contenidos: ["modelo osi", "protocolos de red", "direccionamiento ip", "topologías de red"],
      },
      {
        codigo: "INF-2201",
        nombre: "Desarrollo Web",
        semestre: 4,
        creditos: 6,
        horas: 68,
        contenidos: ["html y css", "javascript", "arquitectura cliente-servidor", "apis rest"],
      },
    ],
  },
  {
    carrera: "Trabajo Social",
    asignaturas: [
      {
        codigo: "TRS-1101",
        nombre: "Fundamentos del Trabajo Social",
        semestre: 1,
        creditos: 6,
        horas: 68,
        contenidos: ["intervención social", "modelos de trabajo social", "ética profesional", "política social"],
      },
      {
        codigo: "TRS-1201",
        nombre: "Psicología Social",
        semestre: 2,
        creditos: 5,
        horas: 54,
        contenidos: ["dinámica de grupos", "procesos de socialización", "identidad social", "conducta colectiva"],
      },
      {
        codigo: "TRS-2101",
        nombre: "Familia y Sociedad",
        semestre: 3,
        creditos: 5,
        horas: 60,
        contenidos: ["dinámica familiar", "intervención familiar", "vulnerabilidad social", "redes de apoyo"],
      },
    ],
  },
];

export function buscarMallaPorCarrera(carrera: string): MallaCarrera | undefined {
  return mallasSeed.find((m) => m.carrera === carrera);
}
