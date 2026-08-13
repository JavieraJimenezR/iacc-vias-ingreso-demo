import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MallaVisual } from "@/components/malla/MallaVisual";
import { LineaTiempoSeguimiento } from "@/components/seguimiento/LineaTiempoSeguimiento";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario, selEstudiantePorId } from "@/store/selectors";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";

export default function Portal() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);
  const usuarioActivoId = useAppStore((s) => s.usuarioActivoId);
  const estudiante = selEstudiantePorId(usuarioActivoId ?? undefined);

  if (!caso || !estudiante) {
    return <SinCasoActivo />;
  }

  const bloqueado = caso.estado === "bloqueado-documento-pendiente";
  const iniciales = estudiante.nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4" data-tour="estudiante-encabezado">
        <Avatar className="h-14 w-14 border-2 border-primary/30">
          <AvatarFallback className="bg-secondary text-primary font-semibold text-lg">
            {iniciales}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hola, {estudiante.nombreCompleto.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">
            {estudiante.carrera} · Ciclo {estudiante.cicloActual}
          </p>
        </div>
      </div>

      {bloqueado && caso && (
        <Alert variant="destructive" data-tour="estudiante-alerta-bloqueo">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Inscripción bloqueada por documento pendiente</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Tu certificado de título legalizado ante notario no llegó durante el plazo del
              segundo ciclo. Tienes hasta el{" "}
              <strong>{new Date(caso.plazoDocumentoPendiente ?? "").toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}</strong>{" "}
              para regularizarlo.
            </p>
            <p>
              Mientras el documento esté pendiente, no podrás inscribir asignaturas. Si completas
              dos ciclos sin regularizar, tu caso pasará a estado "eliminado por documento
              pendiente".
            </p>
            <Button size="sm" onClick={() => navigate("/estudiante/documento-pendiente")}>
              Subir documento pendiente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-tour="estudiante-ficha">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Carrera</CardTitle>
          </CardHeader>
          <CardContent className="font-medium">{estudiante.carrera}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ciclo actual</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-foreground">{estudiante.cicloActual}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avance curricular</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-primary">{estudiante.avanceCurricularPorcentaje}%</CardContent>
        </Card>
      </div>

      <Card data-tour="estudiante-malla">
        <CardHeader>
          <CardTitle className="text-base">Tu malla académica</CardTitle>
        </CardHeader>
        <CardContent>
          <MallaVisual malla={estudiante.malla} />
        </CardContent>
      </Card>

      <Card data-tour="estudiante-linea-tiempo">
        <CardHeader>
          <CardTitle className="text-base">Estado de tu caso</CardTitle>
        </CardHeader>
        <CardContent>
          <LineaTiempoSeguimiento estadoActual={caso.estado} creadoEn={caso.creadoEn} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate("/estudiante/solicitudes")}>
          Ver solicitudes académicas
        </Button>
      </div>
    </div>
  );
}
