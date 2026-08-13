import { useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenciaLadoALado } from "./EvidenciaLadoALado";
import { AccionesRevisor } from "./AccionesRevisor";
import type { AsignaturaEquivalencia, Caso } from "@/types";
import { cn } from "@/lib/utils";

interface PanelEquivalenciasProps {
  caso: Caso;
  permitirAcciones: boolean;
}

const ETIQUETAS_PROPUESTA: Record<string, string> = {
  reconocer: "Reconocer",
  "no-reconocer": "No reconocer",
  revisar: "Revisar",
};

function colorConfianza(nivel: string) {
  if (nivel === "alta") return "bg-exito text-exito-foreground";
  if (nivel === "media") return "bg-advertencia text-advertencia-foreground";
  return "bg-destructive text-destructive-foreground";
}

export function PanelEquivalencias({ caso, permitirAcciones }: PanelEquivalenciasProps) {
  const [equivalenciaEvidencia, setEquivalenciaEvidencia] = useState<AsignaturaEquivalencia | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Equivalencias propuestas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {caso.equivalencias.map((eq) => (
          <div key={eq.id} className="rounded-md border p-3 space-y-2.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="text-sm">
                <p className="font-medium text-foreground">{eq.asignaturaExternaNombre}</p>
                <p className="text-muted-foreground">
                  → {eq.asignaturaIaccModificadaCodigo ?? eq.asignaturaIaccCodigo} — {eq.asignaturaIaccNombre}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold">{eq.porcentajeCoincidencia}%</span>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", colorConfianza(eq.nivelConfianza))}>
                  {eq.nivelConfianza}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={eq.propuestaIA === "reconocer" ? "outline" : "secondary"}>
                Propuesta IA: {ETIQUETAS_PROPUESTA[eq.propuestaIA]}
              </Badge>
              {eq.decisionRevisor && (
                <span className="text-xs text-muted-foreground">Decisión: {eq.decisionRevisor}</span>
              )}
              <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setEquivalenciaEvidencia(eq)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> Ver evidencia
              </Button>
            </div>

            {eq.propuestaIA !== "reconocer" && eq.motivoNoReconocimiento && (
              <p className="text-xs text-advertencia-foreground bg-advertencia/15 border border-advertencia/40 rounded-md px-2.5 py-2">
                {eq.motivoNoReconocimiento}
              </p>
            )}

            {permitirAcciones && (
              <div className="pt-1 border-t">
                <AccionesRevisor casoId={caso.id} equivalencia={eq} />
              </div>
            )}
          </div>
        ))}
        {caso.equivalencias.length === 0 && (
          <p className="text-center text-muted-foreground py-6">
            Este caso aún no tiene equivalencias calculadas.
          </p>
        )}
      </CardContent>

      <EvidenciaLadoALado equivalencia={equivalenciaEvidencia} onOpenChange={(open) => !open && setEquivalenciaEvidencia(null)} />
    </Card>
  );
}
