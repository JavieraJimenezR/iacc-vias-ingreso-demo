import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MallaVisual } from "@/components/malla/MallaVisual";
import { useAppStore } from "@/store/useAppStore";
import { estudianteRodrigo } from "@/lib/mock-data";

const CASO_ID = "caso-rodrigo";

export default function Portal() {
  const navigate = useNavigate();
  const caso = useAppStore((s) => s.casos.find((c) => c.id === CASO_ID));

  const bloqueado = caso?.estado === "bloqueado-documento-pendiente";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hola, {estudianteRodrigo.nombreCompleto.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">
          {estudianteRodrigo.carrera} · Ciclo {estudianteRodrigo.cicloActual}
        </p>
      </div>

      {bloqueado && caso && (
        <Alert variant="destructive">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Carrera</CardTitle>
          </CardHeader>
          <CardContent className="font-medium">{estudianteRodrigo.carrera}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ciclo actual</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-foreground">{estudianteRodrigo.cicloActual}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avance curricular</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-primary">{estudianteRodrigo.avanceCurricularPorcentaje}%</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu malla académica</CardTitle>
        </CardHeader>
        <CardContent>
          <MallaVisual malla={estudianteRodrigo.malla} />
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
