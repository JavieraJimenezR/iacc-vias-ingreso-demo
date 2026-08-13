import { useNavigate } from "react-router-dom";
import { ArrowRight, FileCheck2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LineaTiempoSeguimiento } from "@/components/seguimiento/LineaTiempoSeguimiento";
import { TarjetaDocumento } from "@/components/documentos/TarjetaDocumento";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario, selEstudiantePorId } from "@/store/selectors";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";
import type { ViaIngreso } from "@/types";

const ETIQUETAS_VIA: Record<ViaIngreso, string> = {
  "via5-rfcp": "Vía 5 — Reconocimiento por carrera previa terminada (RFCP)",
  "via6-convalidacion": "Vía 6 — Convalidación de asignaturas",
};

export default function MiPostulacion() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);
  const usuarioActivoId = useAppStore((s) => s.usuarioActivoId);
  const estudiante = selEstudiantePorId(usuarioActivoId ?? undefined);

  if (!caso || !estudiante) {
    return <SinCasoActivo />;
  }

  const primerNombre = estudiante.nombreCompleto.split(" ")[0];
  const iniciales = estudiante.nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const documentosCargados = caso.documentos.filter((d) => d.estado === "cargado");
  const quedanDocumentosPorCargar = documentosCargados.length > 0;
  const resuelto = caso.estado === "resuelto-reconocido" || caso.estado === "resuelto-rechazado";
  const enRevision = caso.estado === "en-revision-humana";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4" data-tour="postulante-encabezado">
        <Avatar className="h-14 w-14 border-2 border-primary/30">
          <AvatarFallback className="bg-secondary text-primary font-semibold text-lg">
            {iniciales}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hola, {primerNombre}</h1>
          <p className="text-muted-foreground mt-1">
            {caso.carreraOrigen} → {caso.carreraDestino}
          </p>
        </div>
      </div>

      <Card data-tour="postulante-via">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {caso.via === "via5-rfcp" ? (
              <GraduationCap className="h-6 w-6 text-primary mt-0.5" />
            ) : (
              <FileCheck2 className="h-6 w-6 text-primary mt-0.5" />
            )}
            <div>
              <CardTitle className="text-base">Tu vía de ingreso</CardTitle>
              <CardDescription>{ETIQUETAS_VIA[caso.via]}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/postulante/via")}>
            Revisar opciones
          </Button>
        </CardHeader>
      </Card>

      <Card data-tour="postulante-resumen-estado">
        <CardHeader>
          <CardTitle className="text-base">Estado de tu solicitud</CardTitle>
          <CardDescription>Caso {caso.numeroCaso}</CardDescription>
        </CardHeader>
        <CardContent>
          <LineaTiempoSeguimiento estadoActual={caso.estado} creadoEn={caso.creadoEn} />
        </CardContent>
      </Card>

      <Card data-tour="postulante-documentos">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">Tus documentos</CardTitle>
            <CardDescription>
              {caso.documentos.length} documento{caso.documentos.length !== 1 ? "s" : ""} en tu caso.
            </CardDescription>
          </div>
          {quedanDocumentosPorCargar && (
            <Button size="sm" onClick={() => navigate("/postulante/documentos")}>
              Continuar carga de documentos
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {caso.documentos.map((doc) => (
            <TarjetaDocumento key={doc.id} documento={doc} analizando={false} />
          ))}
        </CardContent>
      </Card>

      <Card data-tour="postulante-proximos-pasos">
        <CardHeader>
          <CardTitle className="text-base">Próximos pasos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {caso.estado === "documentos-pendientes" && (
            <p className="text-sm text-muted-foreground">
              Aún tienes documentos por cargar y verificar. Completa la carga para que la
              plataforma pueda analizar tus equivalencias.
            </p>
          )}
          {caso.estado === "en-verificacion" && (
            <p className="text-sm text-muted-foreground">
              Tus documentos están siendo verificados por la plataforma. Vuelve pronto para ver el
              avance.
            </p>
          )}
          {enRevision && (
            <p className="text-sm text-muted-foreground">
              Tu caso está en revisión académica. El tiempo estimado de respuesta es de 3 a 5 días
              hábiles.
            </p>
          )}
          {resuelto && (
            <p className="text-sm text-muted-foreground">
              Tu solicitud ya tiene resultado disponible, con el detalle de las asignaturas
              reconocidas.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {quedanDocumentosPorCargar && (
              <Button className="gap-1.5" onClick={() => navigate("/postulante/documentos")}>
                Completar carga de documentos <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {!quedanDocumentosPorCargar && !resuelto && (
              <Button className="gap-1.5" onClick={() => navigate("/postulante/seguimiento")}>
                Ver seguimiento detallado <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {resuelto && (
              <Button className="gap-1.5" onClick={() => navigate("/postulante/resultado")}>
                Ver resultado <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
