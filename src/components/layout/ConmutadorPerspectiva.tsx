import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore, type Perspectiva } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const OPCIONES: { perspectiva: Perspectiva; etiqueta: string; ruta: string }[] = [
  { perspectiva: "postulante", etiqueta: "Postulante", ruta: "/postulante/via" },
  { perspectiva: "estudiante", etiqueta: "Estudiante IACC", ruta: "/estudiante" },
  { perspectiva: "backoffice", etiqueta: "Equipo IACC", ruta: "/backoffice" },
  { perspectiva: "flujo-completo", etiqueta: "Flujo completo", ruta: "/flujo-completo" },
];

export function ConmutadorPerspectiva() {
  const navigate = useNavigate();
  const location = useLocation();
  const setPerspectiva = useAppStore((s) => s.setPerspectiva);

  return (
    <nav className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Cambiar perspectiva">
      {OPCIONES.map((op) => {
        const activo = location.pathname.startsWith(op.ruta.split("/").slice(0, 2).join("/"));
        return (
          <button
            key={op.perspectiva}
            type="button"
            onClick={() => {
              setPerspectiva(op.perspectiva);
              navigate(op.ruta);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border",
              activo
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            )}
          >
            {op.etiqueta}
          </button>
        );
      })}
    </nav>
  );
}
