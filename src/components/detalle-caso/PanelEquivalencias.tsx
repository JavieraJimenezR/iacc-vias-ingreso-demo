import { useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      <CardContent className="overflow-x-auto space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asignatura externa</TableHead>
              <TableHead>Asignatura IACC</TableHead>
              <TableHead>% coincidencia</TableHead>
              <TableHead>Confianza</TableHead>
              <TableHead>Propuesta IA</TableHead>
              <TableHead>Evidencia</TableHead>
              {permitirAcciones && <TableHead>Decisión</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {caso.equivalencias.map((eq) => (
              <TableRow key={eq.id}>
                <TableCell className="text-sm">{eq.asignaturaExternaNombre}</TableCell>
                <TableCell className="text-sm">
                  {eq.asignaturaIaccModificadaCodigo ?? eq.asignaturaIaccCodigo} — {eq.asignaturaIaccNombre}
                </TableCell>
                <TableCell>{eq.porcentajeCoincidencia}%</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", colorConfianza(eq.nivelConfianza))}>
                    {eq.nivelConfianza}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={eq.propuestaIA === "reconocer" ? "outline" : "secondary"}>
                    {ETIQUETAS_PROPUESTA[eq.propuestaIA]}
                  </Badge>
                  {eq.decisionRevisor && (
                    <div className="text-xs text-muted-foreground mt-1">Decisión: {eq.decisionRevisor}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => setEquivalenciaEvidencia(eq)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> Ver evidencia
                  </Button>
                </TableCell>
                {permitirAcciones && (
                  <TableCell>
                    <AccionesRevisor casoId={caso.id} equivalencia={eq} />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {caso.equivalencias.length === 0 && (
              <TableRow>
                <TableCell colSpan={permitirAcciones ? 7 : 6} className="text-center text-muted-foreground py-6">
                  Este caso aún no tiene equivalencias calculadas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <EvidenciaLadoALado equivalencia={equivalenciaEvidencia} onOpenChange={(open) => !open && setEquivalenciaEvidencia(null)} />
    </Card>
  );
}
