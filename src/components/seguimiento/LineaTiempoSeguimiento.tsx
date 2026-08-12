import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EstadoCaso } from "@/types";

interface PasoSeguimiento {
  clave: string;
  titulo: string;
  descripcion: string;
}

const PASOS: PasoSeguimiento[] = [
  { clave: "recibida", titulo: "Solicitud recibida", descripcion: "Registramos tu solicitud y los documentos que enviaste." },
  { clave: "verificados", titulo: "Documentos verificados", descripcion: "Revisamos que tus documentos sean legibles, tengan firma, timbre y códigos válidos." },
  { clave: "analisis", titulo: "Análisis de equivalencia", descripcion: "La plataforma compara tus asignaturas con la malla de la carrera IACC." },
  { clave: "revision", titulo: "En revisión académica", descripcion: "Una persona del equipo académico revisa y aprueba las propuestas de la plataforma." },
  { clave: "resuelto", titulo: "Resuelto", descripcion: "Tu resultado está disponible, con el detalle de asignaturas reconocidas." },
];

/** Mapea el estado real del caso al índice del paso (0 a 4) de la línea de tiempo. */
function indicePasoActual(estado: EstadoCaso): number {
  switch (estado) {
    case "documentos-pendientes":
      return 0;
    case "en-verificacion":
      return 1;
    case "en-revision-humana":
    case "bloqueado-documento-pendiente":
      return 3;
    case "resuelto-reconocido":
    case "resuelto-rechazado":
    case "cerrado":
    case "eliminado-documento-pendiente":
      return 4;
    default:
      return 0;
  }
}

interface LineaTiempoSeguimientoProps {
  estadoActual: EstadoCaso;
  creadoEn: string;
}

export function LineaTiempoSeguimiento({ estadoActual, creadoEn }: LineaTiempoSeguimientoProps) {
  const idxActual = indicePasoActual(estadoActual);

  return (
    <ol className="relative border-l-2 border-border ml-3 space-y-6">
      {PASOS.map((paso, idx) => {
        const completado = idx < idxActual || (idx === idxActual && idxActual === PASOS.length - 1);
        const activo = idx === idxActual && idxActual !== PASOS.length - 1;

        return (
          <li key={paso.clave} className="ml-5 relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2",
                completado
                  ? "bg-primary border-primary text-primary-foreground"
                  : activo
                  ? "bg-background border-primary text-primary animate-pulse"
                  : "bg-background border-border text-muted-foreground"
              )}
            >
              {completado ? <Check className="h-3.5 w-3.5" /> : activo ? <Clock className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
            </span>
            <h3 className={cn("font-medium", activo ? "text-primary" : "text-foreground")}>{paso.titulo}</h3>
            <p className="text-sm text-muted-foreground">{paso.descripcion}</p>
            {idx === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(creadoEn).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
