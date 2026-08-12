import { Bot, ServerCog, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ActorTrazabilidad, EventoTrazabilidad } from "@/types";

const CONFIG_ACTOR: Record<ActorTrazabilidad, { icono: typeof Bot; color: string; etiqueta: string }> = {
  "plataforma-ia": { icono: Bot, color: "text-primary", etiqueta: "Plataforma IA" },
  "persona-iacc": { icono: UserRound, color: "text-advertencia", etiqueta: "Persona IACC" },
  "sistema-externo": { icono: ServerCog, color: "text-muted-foreground", etiqueta: "Sistema externo" },
};

function formatearEvento(evento: EventoTrazabilidad): string {
  const fecha = new Date(evento.fecha);
  const hora = fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  const actor = evento.nombreActor ? `${evento.nombreActor}${evento.rolActor ? ` (${evento.rolActor})` : ""}` : CONFIG_ACTOR[evento.actor].etiqueta;
  return `${hora} · ${actor} · ${evento.descripcion}`;
}

interface PanelTrazabilidadProps {
  eventos: EventoTrazabilidad[];
}

export function PanelTrazabilidad({ eventos }: PanelTrazabilidadProps) {
  const ordenados = [...eventos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Trazabilidad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ordenados.map((evento) => {
          const config = CONFIG_ACTOR[evento.actor];
          const Icono = config.icono;
          return (
            <div key={evento.id} className="flex items-start gap-2.5">
              <Icono className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
              <p className="text-sm text-foreground">
                {new Date(evento.fecha).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })} ·{" "}
                {formatearEvento(evento)}
              </p>
            </div>
          );
        })}
        {ordenados.length === 0 && <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>}
      </CardContent>
    </Card>
  );
}
