import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectorRolBackoffice } from "@/components/casos/SelectorRolBackoffice";
import { PanelDocumentos } from "@/components/detalle-caso/PanelDocumentos";
import { PanelEquivalencias } from "@/components/detalle-caso/PanelEquivalencias";
import { PanelTrazabilidad } from "@/components/detalle-caso/PanelTrazabilidad";
import { useAppStore } from "@/store/useAppStore";
import { estudiantesSeed } from "@/lib/mock-data";
import { REGLA_APROBACION_HUMANA } from "@/lib/motor-ia/enrutamiento";
import { toast } from "sonner";

export default function DetalleCaso() {
  const { casoId } = useParams<{ casoId: string }>();
  const navigate = useNavigate();
  const rolBackoffice = useAppStore((s) => s.rolBackoffice);
  const caso = useAppStore((s) => s.casos.find((c) => c.id === casoId));
  const confirmarResolucion = useAppStore((s) => s.confirmarResolucion);

  if (!rolBackoffice) {
    return <SelectorRolBackoffice />;
  }

  if (!caso) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No se encontró el caso solicitado.</p>
        <Button variant="outline" onClick={() => navigate("/backoffice/casos")}>Volver a la bandeja</Button>
      </div>
    );
  }

  const estudiante = estudiantesSeed.find((e) => e.id === caso.estudianteId);

  const verDocumentos = rolBackoffice === "registro-curricular" || rolBackoffice === "analista-diferenciados";
  const verEquivalencias = rolBackoffice === "coordinador-academico" || rolBackoffice === "analista-diferenciados";
  const verTodo = rolBackoffice === "analista-diferenciados";

  const todasEquivalenciasResueltas = caso.equivalencias.length > 0 && caso.equivalencias.every((eq) => eq.decisionRevisor);
  const resuelto = caso.estado === "resuelto-reconocido" || caso.estado === "resuelto-rechazado" || caso.estado === "cerrado";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/backoffice/casos")}>
        <ChevronLeft className="h-4 w-4" /> Volver a la bandeja
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3" data-tour="backoffice-detalle-caso">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{caso.numeroCaso}</h1>
          <p className="text-muted-foreground mt-1">
            {estudiante?.nombreCompleto ?? "Estudiante sin registro"} · {caso.institucionOrigen} → {caso.carreraDestino}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{caso.via === "via5-rfcp" ? "Vía 5 — RFCP" : "Vía 6 — Convalidación"}</Badge>
          <Badge variant="secondary">{caso.estado}</Badge>
          {caso.responsableActual && <Badge variant="outline">Responsable: {caso.responsableActual}</Badge>}
        </div>
      </div>

      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>{REGLA_APROBACION_HUMANA}</AlertDescription>
      </Alert>

      {caso.autorizacionJefeDisciplinar && (
        <Alert variant="advertencia">
          <AlertDescription>
            Requiere autorización de jefe disciplinar — motivo:{" "}
            {caso.autorizacionJefeDisciplinar.motivo === "titulo-mas-10-anios"
              ? "título con más de 10 años de antigüedad"
              : "carrera fuera de directrices académicas"}
            . Estado: {caso.autorizacionJefeDisciplinar.estado}.
          </AlertDescription>
        </Alert>
      )}

      <div className={verDocumentos && verEquivalencias ? "grid grid-cols-1 xl:grid-cols-2 gap-6 items-start" : "space-y-6"}>
        {verDocumentos && (
          <PanelDocumentos caso={caso} permitirAcciones={rolBackoffice === "registro-curricular"} />
        )}
        {verEquivalencias && (
          <PanelEquivalencias caso={caso} permitirAcciones={rolBackoffice === "coordinador-academico" || verTodo} />
        )}
      </div>

      {verTodo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confirmar resolución</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-muted-foreground flex-1">
              {todasEquivalenciasResueltas
                ? "Todas las equivalencias tienen una decisión registrada. Puedes confirmar la resolución y generar el acta."
                : "Aún hay equivalencias sin decisión del revisor."}
            </p>
            <Button
              disabled={resuelto || (caso.equivalencias.length > 0 && !todasEquivalenciasResueltas)}
              onClick={() => {
                confirmarResolucion(caso.id);
                toast.success("Resolución confirmada", { description: "Se generó el acta y se registró en la trazabilidad." });
              }}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Confirmar resolución
            </Button>
          </CardContent>
        </Card>
      )}

      <PanelTrazabilidad eventos={caso.trazabilidad} />

      {!verDocumentos && !verEquivalencias && (
        <p className="text-sm text-muted-foreground">
          Tu rol actual no tiene paneles configurados para este caso.{" "}
          <Link to="/backoffice/casos" className="text-primary underline">Volver a la bandeja</Link>.
        </p>
      )}
    </div>
  );
}
