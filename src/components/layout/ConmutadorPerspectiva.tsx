import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore, type Perspectiva, type TipoUsuarioActivo } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const OPCIONES: { perspectiva: Perspectiva; etiqueta: string; ruta: string; tipoUsuario: TipoUsuarioActivo; usuarioId: string | null }[] = [
  { perspectiva: "postulante", etiqueta: "Postulante", ruta: "/postulante", tipoUsuario: "postulante", usuarioId: "est-camila" },
  { perspectiva: "estudiante", etiqueta: "Estudiante IACC", ruta: "/estudiante", tipoUsuario: "estudiante", usuarioId: "est-rodrigo" },
  { perspectiva: "backoffice", etiqueta: "Equipo IACC", ruta: "/backoffice", tipoUsuario: "staff", usuarioId: null },
  { perspectiva: "flujo-completo", etiqueta: "Flujo completo", ruta: "/flujo-completo", tipoUsuario: null, usuarioId: null },
];

export function ConmutadorPerspectiva() {
  const navigate = useNavigate();
  const location = useLocation();
  const setPerspectiva = useAppStore((s) => s.setPerspectiva);
  const setUsuarioActivo = useAppStore((s) => s.setUsuarioActivo);

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
              if (op.tipoUsuario !== null || op.perspectiva === "backoffice") {
                setUsuarioActivo(op.tipoUsuario, op.usuarioId);
              }
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
