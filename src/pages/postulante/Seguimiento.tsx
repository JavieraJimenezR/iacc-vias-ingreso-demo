import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineaTiempoSeguimiento } from "@/components/seguimiento/LineaTiempoSeguimiento";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario } from "@/store/selectors";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";
import { TituloPagina } from "@/components/layout/TituloPagina";
import { PasosPostulante } from "@/components/postulante/PasosPostulante";

export default function Seguimiento() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);
  const avanzarProcesoCaso = useAppStore((s) => s.avanzarProcesoCaso);

  if (!caso) {
    return <SinCasoActivo />;
  }

  const resuelto = caso.estado === "resuelto-reconocido" || caso.estado === "resuelto-rechazado";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PasosPostulante estadoCaso={caso.estado} />

      <TituloPagina
        rotulo="Paso 3 de 4"
        titulo="Seguimiento de tu solicitud"
        descripcion={`Caso ${caso.numeroCaso} — ${caso.carreraDestino}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-tour="postulante-seguimiento-tiempos">
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
        <Button
          variant="outline"
          onClick={() => avanzarProcesoCaso(caso.id)}
          disabled={resuelto}
          data-tour="postulante-avanzar-proceso"
        >
          Avanzar el proceso (demo)
        </Button>
        {resuelto && <Button onClick={() => navigate("/postulante/resultado")}>Ver resultado</Button>}
      </div>
    </div>
  );
}
