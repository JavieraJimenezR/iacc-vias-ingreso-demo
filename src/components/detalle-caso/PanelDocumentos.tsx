import { CheckCircle2, FileText, ShieldAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import type { Caso } from "@/types";

const ETIQUETAS_TIPO: Record<string, string> = {
  "concentracion-notas": "Concentración de notas",
  "programa-asignatura": "Programa de asignatura",
  "acta-convalidacion": "Acta de convalidación",
  "certificado-titulo": "Certificado de título",
  "declaracion-jurada": "Declaración jurada",
  "codigo-validacion": "Código de validación",
};

interface PanelDocumentosProps {
  caso: Caso;
  permitirAcciones: boolean;
}

export function PanelDocumentos({ caso, permitirAcciones }: PanelDocumentosProps) {
  const actualizarDocumento = useAppStore((s) => s.actualizarDocumento);
  const agregarEventoTrazabilidad = useAppStore((s) => s.agregarEventoTrazabilidad);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {caso.documentos.map((doc) => {
          const resultado = doc.resultadoVerificacion;
          const rechazado = doc.estado === "rechazado-requiere-reemplazo";
          return (
            <div key={doc.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{doc.nombreArchivo}</div>
                    <div className="text-xs text-muted-foreground">{ETIQUETAS_TIPO[doc.tipo]}</div>
                  </div>
                </div>
                <Badge variant={rechazado ? "destructive" : doc.estado === "verificado" ? "outline" : "secondary"}>
                  {rechazado ? "Rechazado" : doc.estado === "verificado" ? "Verificado" : doc.estado}
                </Badge>
              </div>

              {resultado && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <CampoEstado label="Legible" ok={resultado.legible} />
                  <CampoEstado label="Firma" ok={resultado.tieneFirma} />
                  <CampoEstado label="Timbre" ok={resultado.tieneTimbre} />
                  <CampoEstado label="Código" ok={resultado.tieneCodigoValidable} />
                </div>
              )}

              {resultado && resultado.anomalias.length > 0 && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-2.5 py-2 text-xs text-destructive">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <ul className="list-disc ml-4">
                    {resultado.anomalias.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {permitirAcciones && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actualizarDocumento(caso.id, doc.id, { estado: "verificado" });
                      agregarEventoTrazabilidad(caso.id, {
                        actor: "persona-iacc",
                        descripcion: `Validó documento "${doc.nombreArchivo}"`,
                        fecha: new Date().toISOString(),
                        rolActor: "Registro Curricular",
                      });
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Validar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      actualizarDocumento(caso.id, doc.id, { estado: "rechazado-requiere-reemplazo" });
                      agregarEventoTrazabilidad(caso.id, {
                        actor: "persona-iacc",
                        descripcion: `Rechazó documento "${doc.nombreArchivo}"`,
                        fecha: new Date().toISOString(),
                        rolActor: "Registro Curricular",
                      });
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Rechazar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {caso.documentos.length === 0 && (
          <p className="text-sm text-muted-foreground">Este caso no tiene documentos cargados.</p>
        )}
      </CardContent>
    </Card>
  );
}

function CampoEstado({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-1 ${ok ? "text-exito" : "text-destructive"}`}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </div>
  );
}
