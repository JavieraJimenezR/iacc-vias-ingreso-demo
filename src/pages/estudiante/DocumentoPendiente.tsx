import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TarjetaDocumento } from "@/components/documentos/TarjetaDocumento";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario } from "@/store/selectors";
import { useSimulacionIA } from "@/hooks/use-simulacion-ia";
import { ejecutarPipelineIA } from "@/lib/motor-ia/pipeline";
import type { Documento } from "@/types";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";
import { TituloPagina } from "@/components/layout/TituloPagina";

const NOMBRE_ARCHIVO = "Certificado_Titulo_Legalizado_Rodrigo_Salas.pdf";

export default function DocumentoPendiente() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);
  const agregarDocumento = useAppStore((s) => s.agregarDocumento);
  const actualizarDocumento = useAppStore((s) => s.actualizarDocumento);
  const levantarBloqueoDocumento = useAppStore((s) => s.levantarBloqueoDocumento);
  const [docId, setDocId] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const pipeline = useSimulacionIA(ejecutarPipelineIA);

  if (!caso) {
    return <SinCasoActivo />;
  }

  const nuevoDoc = caso.documentos.find((d) => d.id === docId);
  const casoActivo = caso;
  const casoId = casoActivo.id;

  async function simularCarga() {
    const id = "rod-doc-pendiente";
    setDocId(id);
    const doc: Documento = {
      id,
      tipo: "certificado-titulo",
      nombreArchivo: NOMBRE_ARCHIVO,
      estado: "analizando",
      subidoEn: new Date().toISOString(),
    };
    agregarDocumento(casoId, doc);

    const res = await pipeline.ejecutar({
      nombreArchivo: NOMBRE_ARCHIVO,
      tipoDocumento: "certificado-titulo",
      institucionOrigen: casoActivo.institucionOrigen,
      carreraDestino: casoActivo.carreraDestino,
    });

    actualizarDocumento(casoId, id, {
      estado: "verificado",
      resultadoVerificacion: res.resultadoVerificacion,
    });
    levantarBloqueoDocumento(casoId);
    setCompletado(true);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TituloPagina
        titulo="Subir documento pendiente"
        descripcion="Sube el certificado de título legalizado ante notario para regularizar tu inscripción."
      />

      {!nuevoDoc && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certificado de título legalizado</CardTitle>
            <CardDescription>Simula la carga del documento físico ya legalizado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="gap-1.5" onClick={simularCarga} disabled={pipeline.estado === "analizando"}>
              <Upload className="h-4 w-4" />
              Simular carga de {NOMBRE_ARCHIVO}
            </Button>
          </CardContent>
        </Card>
      )}

      {nuevoDoc && (
        <TarjetaDocumento documento={nuevoDoc} analizando={pipeline.estado === "analizando"} />
      )}

      {completado && (
        <Card className="border-exito">
          <CardContent className="pt-6 flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-exito shrink-0" />
            <div>
              <p className="font-medium text-foreground">Bloqueo levantado</p>
              <p className="text-sm text-muted-foreground">
                Tu documento fue verificado y el bloqueo de inscripción se levantó. Ya puedes
                inscribir asignaturas con normalidad.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {completado && (
        <div className="flex justify-end">
          <Button onClick={() => navigate("/estudiante")}>Volver a mi portal</Button>
        </div>
      )}
    </div>
  );
}
