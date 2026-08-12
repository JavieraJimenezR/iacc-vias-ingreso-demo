import type { AsignaturaMalla } from "@/types";
import { cn } from "@/lib/utils";

interface MallaVisualProps {
  malla: AsignaturaMalla[];
}

export function MallaVisual({ malla }: MallaVisualProps) {
  const semestres = [...new Set(malla.map((a) => a.semestre))].sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {semestres.map((sem) => (
          <div key={sem} className="w-40 sm:w-auto flex-shrink-0">
            <div className="text-xs font-semibold text-muted-foreground mb-2 text-center">
              Semestre {sem}
            </div>
            <div className="flex flex-col gap-1.5">
              {malla
                .filter((a) => a.semestre === sem)
                .map((a) => (
                  <div
                    key={a.codigo}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-xs",
                      a.reconocida
                        ? "bg-primary/15 border-primary text-foreground font-medium"
                        : "bg-muted border-border text-muted-foreground"
                    )}
                    title={a.nombre}
                  >
                    <div className="truncate">{a.nombre}</div>
                    <div className="text-[10px] opacity-70">{a.codigo}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-primary/15 border border-primary inline-block" />
          Reconocida
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-muted border border-border inline-block" />
          Por cursar
        </span>
      </div>
    </div>
  );
}
