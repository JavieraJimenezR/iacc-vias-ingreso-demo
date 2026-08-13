import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { PASOS_TUTORIAL, type SeccionTutorial } from "@/lib/tutorial/pasos";

const CLAVE_ALMACENAMIENTO = "iacc-vias-ingreso-tutorial-visto";

type RegistroTutorialVisto = Partial<Record<SeccionTutorial, boolean>>;

function leerRegistro(): RegistroTutorialVisto {
  try {
    const raw = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return raw ? (JSON.parse(raw) as RegistroTutorialVisto) : {};
  } catch {
    return {};
  }
}

function marcarComoVisto(seccion: SeccionTutorial) {
  try {
    const registro = leerRegistro();
    registro[seccion] = true;
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(registro));
  } catch {
    // Si el almacenamiento local no está disponible, simplemente no se persiste.
  }
}

function yaFueVisto(seccion: SeccionTutorial): boolean {
  return leerRegistro()[seccion] === true;
}

/** Determina la sección de tutorial correspondiente a la ruta actual. */
export function seccionTutorialPorRuta(pathname: string): SeccionTutorial | null {
  if (pathname === "/" || pathname === "/flujo-completo") return "portada";
  if (pathname.startsWith("/postulante")) return "postulante";
  if (pathname.startsWith("/estudiante")) return "estudiante";
  if (pathname.startsWith("/backoffice")) return "backoffice";
  return null;
}

/**
 * Envuelve driver.js para exponer un tour guiado por sección (portada,
 * postulante, estudiante o backoffice). Usa una clave de almacenamiento
 * local separada de la del store de Zustand para registrar qué tutoriales
 * ya se vieron, sin forzar una migración de versión del store por esto.
 */
export function useTutorialGuiado() {
  const location = useLocation();
  const driverRef = useRef<Driver | null>(null);

  const iniciarTour = useCallback((seccion: SeccionTutorial) => {
    const pasos = PASOS_TUTORIAL[seccion];
    if (!pasos || pasos.length === 0) return;

    driverRef.current?.destroy();
    // Filtra pasos cuyo elemento anotado no existe en la página actual (por
    // ejemplo, el paso de "flujo completo" no aplica si aún no se visitó esa
    // ruta), para no dejar burbujas apuntando a elementos inexistentes.
    const pasosDisponibles = pasos.filter((paso) => {
      if (typeof paso.element !== "string") return true;
      return document.querySelector(paso.element) !== null;
    });
    if (pasosDisponibles.length === 0) return;

    const instancia = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.6,
      progressText: "Paso {{current}} de {{total}}",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      doneBtnText: "Listo",
      steps: pasosDisponibles,
    });
    driverRef.current = instancia;
    instancia.drive();
    marcarComoVisto(seccion);
  }, []);

  // Autolanzado no intrusivo: al entrar por primera vez a una sección, si no
  // se ha visto su tutorial, se lanza tras un pequeño retraso. En visitas
  // repetidas no se vuelve a lanzar solo.
  useEffect(() => {
    const seccion = seccionTutorialPorRuta(location.pathname);
    if (!seccion || yaFueVisto(seccion)) return;

    const timeoutId = window.setTimeout(() => {
      iniciarTour(seccion);
    }, 600);

    return () => window.clearTimeout(timeoutId);
    // Solo se re-evalúa cuando cambia de sección lógica, no en cada sub-ruta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccionTutorialPorRuta(location.pathname)]);

  useEffect(() => {
    return () => driverRef.current?.destroy();
  }, []);

  const seccionActual = seccionTutorialPorRuta(location.pathname);

  return {
    seccionActual,
    iniciarTour,
    /** Relanza manualmente el tour de la sección actual, sin importar si ya se vio. */
    relanzarTourActual: () => {
      if (seccionActual) iniciarTour(seccionActual);
    },
  };
}
