import { useLocation } from "react-router-dom";

/**
 * Envuelve el contenido principal y aplica una animación de entrada suave
 * cada vez que cambia la ruta, usando las utilidades ya provistas por el
 * plugin tailwindcss-animate (sin agregar una librería de animación nueva).
 * La key ligada a la ruta fuerza a React a remontar el nodo y reproducir
 * la animación en cada navegación.
 */
export function TransicionPagina({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      {children}
    </div>
  );
}
