import { useState } from "react";
import { CheckCircle2, Pencil, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import type { AsignaturaEquivalencia } from "@/types";

interface AccionesRevisorProps {
  casoId: string;
  equivalencia: AsignaturaEquivalencia;
}

export function AccionesRevisor({ casoId, equivalencia }: AccionesRevisorProps) {
  const resolverFilaEquivalencia = useAppStore((s) => s.resolverFilaEquivalencia);
  const [comentario, setComentario] = useState(equivalencia.comentarioRevisor ?? "");
  const [mostrarComentario, setMostrarComentario] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        <Button
          size="sm"
          variant={equivalencia.decisionRevisor === "aprobado" ? "default" : "outline"}
          onClick={() => resolverFilaEquivalencia(casoId, equivalencia.id, "aprobado", comentario)}
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Aprobar
        </Button>
        <Button
          size="sm"
          variant={equivalencia.decisionRevisor === "rechazado" ? "destructive" : "outline"}
          onClick={() => resolverFilaEquivalencia(casoId, equivalencia.id, "rechazado", comentario)}
        >
          <XCircle className="h-3.5 w-3.5 mr-1" /> Rechazar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setMostrarComentario((v) => !v)}>
          <Pencil className="h-3.5 w-3.5 mr-1" /> Comentar
        </Button>
      </div>
      {mostrarComentario && (
        <Textarea
          placeholder="Comentario del revisor (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          onBlur={() => {
            if (equivalencia.decisionRevisor) {
              resolverFilaEquivalencia(casoId, equivalencia.id, equivalencia.decisionRevisor, comentario);
            }
          }}
          className="text-xs min-h-[60px]"
        />
      )}
    </div>
  );
}
