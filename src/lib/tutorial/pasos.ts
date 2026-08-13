import type { DriveStep } from "driver.js";

export type SeccionTutorial = "portada" | "postulante" | "estudiante" | "backoffice";

/**
 * Pasos del tour guiado por sección. Cada paso apunta a un elemento
 * anotado con un atributo data-tour dedicado (en vez de clases de estilo),
 * para mantener el acoplamiento del tour mínimo y explícito.
 */
export const PASOS_TUTORIAL: Record<SeccionTutorial, DriveStep[]> = {
  portada: [
    {
      element: '[data-tour="portada-tarjetas"]',
      popover: {
        title: "Elige quién eres",
        description:
          "Esta demo tiene 3 identidades de ejemplo: Camila (postulante), Rodrigo (estudiante ya matriculado) y el equipo IACC. Cada tarjeta te lleva a un dashboard con el estado real de ese caso.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="portada-flujo-completo"]',
      popover: {
        title: "Flujo completo",
        description:
          "Si prefieres ver el proceso completo de punta a punta sin entrar a un caso específico, este enlace abre un diagrama educativo con los pasos de postulante y estudiante en paralelo.",
        side: "top",
      },
    },
    {
      element: '[data-tour="header-controles"]',
      popover: {
        title: "Controles de la demo",
        description:
          "Desde aquí puedes cambiar de perspectiva rápidamente o reiniciar la demo para volver todos los casos a su estado inicial.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="flujo-completo-rutas"]',
      popover: {
        title: "Flujo completo (si lo visitas)",
        description:
          "Este diagrama educativo muestra los pasos generales de postulante y estudiante en paralelo. No representa un caso específico, sino el proceso en general.",
        side: "top",
      },
    },
  ],
  postulante: [
    {
      element: '[data-tour="postulante-encabezado"]',
      popover: {
        title: "Tu postulación",
        description: "Este es tu dashboard de aterrizaje: resume tu vía de ingreso, tus documentos y el estado de tu caso.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="postulante-resumen-estado"]',
      popover: {
        title: "Estado de tu solicitud",
        description: "Esta línea de tiempo muestra en qué etapa real está tu caso: documentos, verificación, revisión académica o resolución.",
        side: "top",
      },
    },
    {
      element: '[data-tour="postulante-documentos"]',
      popover: {
        title: "Tus documentos",
        description: "Aquí ves el estado de cada documento cargado. Si te faltan documentos por subir, puedes continuar la carga desde este botón.",
        side: "top",
      },
    },
    {
      element: '[data-tour="postulante-proximos-pasos"]',
      popover: {
        title: "Próximos pasos",
        description: "Este bloque te dice qué sigue según tu estado actual, y te lleva directo al siguiente paso del proceso.",
        side: "top",
      },
    },
  ],
  estudiante: [
    {
      element: '[data-tour="estudiante-encabezado"]',
      popover: {
        title: "Tu portal de estudiante",
        description: "Aquí ves un resumen de tu situación académica actual como estudiante ya matriculado en IACC.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="estudiante-ficha"]',
      popover: {
        title: "Ficha académica",
        description: "Carrera, ciclo actual y avance curricular de tu proceso.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="estudiante-malla"]',
      popover: {
        title: "Tu malla académica",
        description: "Las asignaturas resaltadas ya fueron reconocidas por convalidación o RFCP; el resto las cursas con normalidad.",
        side: "top",
      },
    },
    {
      element: '[data-tour="estudiante-linea-tiempo"]',
      popover: {
        title: "Estado de tu caso",
        description: "La misma línea de tiempo que usa el postulante, aplicada a tu caso de reconocimiento ya resuelto o en curso.",
        side: "top",
      },
    },
  ],
  backoffice: [
    {
      element: '[data-tour="backoffice-selector-rol"]',
      popover: {
        title: "Elige tu rol",
        description: "El backoffice muestra distintos paneles según el rol de quien revisa el caso: registro curricular, coordinación académica o análisis de ingresos diferenciados.",
        side: "bottom",
      },
    },
    {
      element: '[data-tour="backoffice-bandeja"]',
      popover: {
        title: "Bandeja de casos",
        description: "Los casos se ordenan priorizando menor confianza y mayor antigüedad, para que el equipo revise primero lo que más lo necesita.",
        side: "top",
      },
    },
  ],
};
