import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
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
import { PasosPostulante } from "@/components/postulante/PasosPostulante";

export default function CargaDocumentos() {
  const navigate = useNavigate();
  const caso = useAppStore(selCasoActivoDelUsuario);
  const actualizarDocumento = useAppStore((s) => s.actualizarDocumento);
  const agregarEventoTrazabilidad = useAppStore((s) => s.agregarEventoTrazabilidad);
  const [analizandoId, setAnalizandoId] = useState<string | null>(null);

  const pipeline = useSimulacionIA(ejecutarPipelineIA);

  const documentosPendientes = useMemo(
    () => caso?.documentos.filter((d) => d.estado === "cargado") ?? [],
    [caso]
  );

  if (!caso) {
    return <SinCasoActivo />;
  }

  const casoActivo = caso;
  const casoId = casoActivo.id;

  async function simularCarga(doc: Documento) {
    setAnalizandoId(doc.id);
    actualizarDocumento(casoId, doc.id, { estado: "analizando" });
    try {
      const res = await pipeline.ejecutar({
        nombreArchivo: doc.nombreArchivo,
        tipoDocumento: doc.tipo,
        institucionOrigen: casoActivo.institucionOrigen,
        carreraDestino: casoActivo.carreraDestino,
      });
      const rechazado = res.resultadoVerificacion.anomalias.length > 0 && res.resultadoVerificacion.esCapturaPantalla;
      actualizarDocumento(casoId, doc.id, {
        estado: rechazado ? "rechazado-requiere-reemplazo" : "verificado",
        resultadoVerificacion: res.resultadoVerificacion,
      });
      agregarEventoTrazabilidad(casoId, {
        actor: "plataforma-ia",
        descripcion: `Analizó documento "${doc.nombreArchivo}"${res.resultadoVerificacion.anomalias.length ? " y detectó anomalías" : ""}`,
        fecha: new Date().toISOString(),
      });
    } finally {
      setAnalizandoId(null);
    }
  }

  const todosVerificados = caso.documentos.every((d) => d.estado === "verificado");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PasosPostulante estadoCaso={caso.estado} />

      <TituloPagina
        rotulo="Paso 2 de 4"
        titulo="Carga de documentos"
        descripcion="Simula la carga de los documentos de Camila Fuentes. Cada documento pasa por el motor de verificación de la plataforma: legibilidad, firma, timbre y códigos de validación."
      />

      {documentosPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documentos por simular carga</CardTitle>
            <CardDescription>Haz clic para simular la subida de cada archivo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {documentosPendientes.map((doc) => (
              <Button
                key={doc.id}
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={analizandoId !== null}
                onClick={() => simularCarga(doc)}
              >
                <Upload className="h-3.5 w-3.5" />
                Simular carga de {doc.nombreArchivo}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {caso.documentos
          .filter((d) => d.estado !== "cargado")
          .map((doc) => (
            <TarjetaDocumento
              key={doc.id}
              documento={doc}
              analizando={analizandoId === doc.id}
              onReemplazar={() => {
                actualizarDocumento(casoId, doc.id, { estado: "cargado", resultadoVerificacion: undefined });
              }}
            />
          ))}
      </div>

      <div className="flex justify-end">
        <Button disabled={!todosVerificados} onClick={() => navigate("/postulante/seguimiento")}>
          Continuar al seguimiento
        </Button>
      </div>
    </div>
  );
}
