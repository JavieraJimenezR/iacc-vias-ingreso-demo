import { CheckCircle2, FileText, Loader2, ShieldAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Documento } from "@/types";

interface TarjetaDocumentoProps {
  documento: Documento;
  analizando: boolean;
  onReemplazar?: () => void;
}

const ETIQUETAS_TIPO: Record<Documento["tipo"], string> = {
  "concentracion-notas": "Concentración de notas",
  "programa-asignatura": "Programa de asignatura",
  "acta-convalidacion": "Acta de convalidación",
  "certificado-titulo": "Certificado de título",
  "declaracion-jurada": "Declaración jurada",
  "codigo-validacion": "Código de validación",
};

export function TarjetaDocumento({ documento, analizando, onReemplazar }: TarjetaDocumentoProps) {
  const rechazado = documento.estado === "rechazado-requiere-reemplazo";
  const resultado = documento.resultadoVerificacion;

  return (
    <Card className={cn(rechazado && "border-destructive")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium text-sm break-all">{documento.nombreArchivo}</div>
              <div className="text-xs text-muted-foreground">{ETIQUETAS_TIPO[documento.tipo]}</div>
            </div>
          </div>
          {analizando ? (
            <Badge variant="secondary" className="animate-pulse-analisis gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Analizando
            </Badge>
          ) : rechazado ? (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" /> Rechazado
            </Badge>
          ) : documento.estado === "verificado" ? (
            <Badge className="gap-1 bg-exito text-exito-foreground hover:bg-exito/90">
              <CheckCircle2 className="h-3 w-3" /> Verificado
            </Badge>
          ) : (
            <Badge variant="outline">Cargado</Badge>
          )}
        </div>
      </CardHeader>
      {resultado && !analizando && (
        <CardContent className="pt-0 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <EstadoCampo label="Legible" ok={resultado.legible} />
            <EstadoCampo label="Firma" ok={resultado.tieneFirma} />
            <EstadoCampo label="Timbre" ok={resultado.tieneTimbre} />
            <EstadoCampo label="Código" ok={resultado.tieneCodigoValidable} />
          </div>

          {resultado.datosExtraidos && (
            <div className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1.5">
              {resultado.datosExtraidos.asignatura && <div>Asignatura: {resultado.datosExtraidos.asignatura}</div>}
              {resultado.datosExtraidos.institucion && <div>Institución: {resultado.datosExtraidos.institucion}</div>}
              {resultado.datosExtraidos.horas && <div>Horas: {resultado.datosExtraidos.horas}</div>}
              {resultado.datosExtraidos.cantidadAsignaturas && (
                <div>Asignaturas detectadas: {resultado.datosExtraidos.cantidadAsignaturas}</div>
              )}
            </div>
          )}

          {resultado.anomalias.length > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-2.5 py-2 text-xs text-destructive">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Se detectaron anomalías:</div>
                <ul className="list-disc ml-4">
                  {resultado.anomalias.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {rechazado && onReemplazar && (
            <Button size="sm" variant="destructive" onClick={onReemplazar} className="mt-1">
              Reemplazar documento
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function EstadoCampo({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={cn("flex items-center gap-1", ok ? "text-exito" : "text-destructive")}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </div>
  );
}
