import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineaTiempoSeguimiento } from "@/components/seguimiento/LineaTiempoSeguimiento";
import { useAppStore } from "@/store/useAppStore";

const CASO_ID = "caso-camila";

export default function Seguimiento() {
  const navigate = useNavigate();
  const caso = useAppStore((s) => s.casos.find((c) => c.id === CASO_ID));
  const avanzarProcesoCaso = useAppStore((s) => s.avanzarProcesoCaso);

  if (!caso) {
    return <p className="text-muted-foreground">No hay un caso activo de postulante en esta demo.</p>;
  }

  const resuelto = caso.estado === "resuelto-reconocido" || caso.estado === "resuelto-rechazado";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Seguimiento de tu solicitud</h1>
        <p className="text-muted-foreground mt-1">Caso {caso.numeroCaso} — {caso.carreraDestino}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Tiempo estimado de respuesta</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-foreground">3 a 5 días hábiles</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Días transcurridos</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-foreground">{caso.antiguedadDias} días</CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <LineaTiempoSeguimiento estadoActual={caso.estado} creadoEn={caso.creadoEn} />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" onClick={() => avanzarProcesoCaso(CASO_ID)} disabled={resuelto}>
          Avanzar el proceso (demo)
        </Button>
        {resuelto && <Button onClick={() => navigate("/postulante/resultado")}>Ver resultado</Button>}
      </div>
    </div>
  );
}
