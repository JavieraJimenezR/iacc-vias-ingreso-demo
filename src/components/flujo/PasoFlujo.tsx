import { Bot, ServerCog, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActorPaso = "plataforma-ia" | "persona-iacc" | "sistema-externo";

export interface DatoPasoFlujo {
  titulo: string;
  descripcion: string;
  actor: ActorPaso;
}

const CONFIG_ACTOR: Record<ActorPaso, { icono: typeof Bot; etiqueta: string; color: string }> = {
  "plataforma-ia": { icono: Bot, etiqueta: "Plataforma IA", color: "border-primary text-primary bg-primary/10" },
  "persona-iacc": { icono: UserRound, etiqueta: "Persona IACC", color: "border-advertencia text-advertencia bg-advertencia/10" },
  "sistema-externo": { icono: ServerCog, etiqueta: "Sistema externo", color: "border-muted-foreground text-muted-foreground bg-muted" },
};

interface PasoFlujoProps {
  paso: DatoPasoFlujo;
  activo: boolean;
}

export function PasoFlujo({ paso, activo }: PasoFlujoProps) {
  const config = CONFIG_ACTOR[paso.actor];
  const Icono = config.icono;

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 transition-all",
        activo ? "border-primary shadow-md scale-[1.02]" : "border-border opacity-70"
      )}
    >
      <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium mb-2", config.color)}>
        <Icono className="h-3 w-3" />
        {config.etiqueta}
      </div>
      <h3 className="font-medium text-foreground text-sm">{paso.titulo}</h3>
      <p className="text-xs text-muted-foreground mt-1">{paso.descripcion}</p>
    </div>
  );
}
