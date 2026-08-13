import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineaTiempoSeguimiento } from "@/components/seguimiento/LineaTiempoSeguimiento";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario } from "@/store/selectors";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";
import { TituloPagina } from "@/components/layout/TituloPagina";

const ETIQUETAS_ESTADO: Record<string, string> = {
  "documentos-pendientes": "Documentos pendientes",
  "en-verificacion": "En verificación",
  "en-revision-humana": "En revisión académica",
  "bloqueado-documento-pendiente": "Bloqueado por documento pendiente",
  "eliminado-documento-pendiente": "Eliminado por documento pendiente",
  "resuelto-reconocido": "Resuelto — reconocido",
  "resuelto-rechazado": "Resuelto — rechazado",
  cerrado: "Cerrado",
};

export default function SolicitudesAcademicas() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);

  if (!caso) {
    return <SinCasoActivo mensaje="No encontramos solicitudes académicas activas para esta sesión de demo." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <TituloPagina
        titulo="Solicitudes académicas"
        descripcion="Historial de tus solicitudes de reconocimiento."
      />

      <Card
        className="cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all"
        onClick={() => navigate("/estudiante")}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{caso.numeroCaso}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {caso.carreraOrigen} → {caso.carreraDestino}
            </p>
          </div>
          <Badge variant={caso.estado === "bloqueado-documento-pendiente" ? "destructive" : "secondary"}>
            {ETIQUETAS_ESTADO[caso.estado] ?? caso.estado}
          </Badge>
        </CardHeader>
        <CardContent>
          <LineaTiempoSeguimiento estadoActual={caso.estado} creadoEn={caso.creadoEn} />
        </CardContent>
      </Card>
    </div>
  );
}
