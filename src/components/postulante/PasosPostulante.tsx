import { useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EstadoCaso } from "@/types";

interface PasoPostulante {
  clave: string;
  ruta: string;
  titulo: string;
}

const PASOS: PasoPostulante[] = [
  { clave: "via", ruta: "/postulante/via", titulo: "Vía de ingreso" },
  { clave: "documentos", ruta: "/postulante/documentos", titulo: "Documentos" },
  { clave: "seguimiento", ruta: "/postulante/seguimiento", titulo: "Seguimiento" },
  { clave: "resultado", ruta: "/postulante/resultado", titulo: "Resultado" },
];

/** Índice del paso ya alcanzado según el estado real del caso (no solo la ruta visitada). */
function indicePasoAlcanzado(estado: EstadoCaso | undefined): number {
  if (!estado) return 0;
  switch (estado) {
    case "documentos-pendientes":
      return 0;
    case "en-verificacion":
      return 1;
    case "en-revision-humana":
    case "bloqueado-documento-pendiente":
      return 2;
    case "resuelto-reconocido":
    case "resuelto-rechazado":
    case "cerrado":
    case "eliminado-documento-pendiente":
      return 3;
    default:
      return 0;
  }
}

interface PasosPostulanteProps {
  estadoCaso?: EstadoCaso;
}

/** Stepper horizontal de 4 pasos del flujo del postulante. */
export function PasosPostulante({ estadoCaso }: PasosPostulanteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const idxActivo = PASOS.findIndex((p) => location.pathname === p.ruta);
  const idxAlcanzado = indicePasoAlcanzado(estadoCaso);

  return (
    <ol className="flex items-center gap-2 sm:gap-4" data-tour="postulante-stepper">
      {PASOS.map((paso, idx) => {
        const activo = idx === idxActivo;
        const completado = idx < idxAlcanzado || (idx <= idxAlcanzado && idx < idxActivo);
        return (
          <li key={paso.clave} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => navigate(paso.ruta)}
              className="flex items-center gap-2 group"
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  activo
                    ? "bg-primary border-primary text-primary-foreground"
                    : completado
                    ? "bg-primary/15 border-primary text-primary"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {completado && !activo ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <span
                className={cn(
                  "hidden sm:inline text-sm font-medium transition-colors",
                  activo ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {paso.titulo}
              </span>
            </button>
            {idx < PASOS.length - 1 && (
              <span className={cn("h-px flex-1", completado ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
