import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TarjetaDocumento } from "@/components/documentos/TarjetaDocumento";
import { useAppStore } from "@/store/useAppStore";
import { useSimulacionIA } from "@/hooks/use-simulacion-ia";
import { ejecutarPipelineIA } from "@/lib/motor-ia/pipeline";
import type { Documento } from "@/types";

const CASO_ID = "caso-rodrigo";
const NOMBRE_ARCHIVO = "Certificado_Titulo_Legalizado_Rodrigo_Salas.pdf";

export default function DocumentoPendiente() {
  const navigate = useNavigate();
  const caso = useAppStore((s) => s.casos.find((c) => c.id === CASO_ID));
  const agregarDocumento = useAppStore((s) => s.agregarDocumento);
  const actualizarDocumento = useAppStore((s) => s.actualizarDocumento);
  const levantarBloqueoDocumento = useAppStore((s) => s.levantarBloqueoDocumento);
  const [docId, setDocId] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const pipeline = useSimulacionIA(ejecutarPipelineIA);

  if (!caso) {
    return <p className="text-muted-foreground">No hay un caso activo.</p>;
  }

  const nuevoDoc = caso.documentos.find((d) => d.id === docId);
  const casoActivo = caso;

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
    agregarDocumento(CASO_ID, doc);

    const res = await pipeline.ejecutar({
      nombreArchivo: NOMBRE_ARCHIVO,
      tipoDocumento: "certificado-titulo",
      institucionOrigen: casoActivo.institucionOrigen,
      carreraDestino: casoActivo.carreraDestino,
    });

    actualizarDocumento(CASO_ID, id, {
      estado: "verificado",
      resultadoVerificacion: res.resultadoVerificacion,
    });
    levantarBloqueoDocumento(CASO_ID);
    setCompletado(true);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subir documento pendiente</h1>
        <p className="text-muted-foreground mt-1">
          Sube el certificado de título legalizado ante notario para regularizar tu inscripción.
        </p>
      </div>

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
