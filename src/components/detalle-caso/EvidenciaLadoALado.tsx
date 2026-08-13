import { Link } from "react-router-dom";
import { History, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { AsignaturaEquivalencia } from "@/types";

interface EvidenciaLadoALadoProps {
  equivalencia: AsignaturaEquivalencia | null;
  onOpenChange: (open: boolean) => void;
}

export function EvidenciaLadoALado({ equivalencia, onOpenChange }: EvidenciaLadoALadoProps) {
  return (
    <Dialog open={!!equivalencia} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {equivalencia && (
          <>
            <DialogHeader>
              <DialogTitle>Evidencia comparada</DialogTitle>
              <DialogDescription>
                {equivalencia.asignaturaExternaNombre} vs. {equivalencia.asignaturaIaccNombre} — {equivalencia.porcentajeCoincidencia}% de coincidencia
              </DialogDescription>
            </DialogHeader>

            {equivalencia.propuestaIA !== "reconocer" && equivalencia.motivoNoReconocimiento && (
              <div className="flex items-start gap-2 rounded-md bg-advertencia/15 border border-advertencia/40 px-3 py-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-advertencia shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    Por qué la plataforma derivó esta asignatura a revisión
                  </p>
                  <p className="text-muted-foreground">{equivalencia.motivoNoReconocimiento}</p>
                </div>
              </div>
            )}

            {equivalencia.casoPrevioReferenciaId && (
              <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
                <History className="h-4 w-4 text-primary" />
                <span>Caso ya resuelto anteriormente:</span>
                <Link
                  to={`/backoffice/casos/${equivalencia.casoPrevioReferenciaId}`}
                  className="text-primary underline underline-offset-2 font-medium"
                >
                  {equivalencia.casoPrevioReferenciaNumero}
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Badge variant="outline" className="mb-2">Documento externo</Badge>
                <p className="text-sm text-foreground">{equivalencia.fragmentoExterno ?? "Sin fragmento disponible."}</p>
                {equivalencia.fragmentoExternoFuente && (
                  <p className="text-xs text-muted-foreground mt-2">Fuente: {equivalencia.fragmentoExternoFuente}</p>
                )}
              </div>
              <div>
                <Badge className="mb-2">Malla IACC</Badge>
                <p className="text-sm text-foreground">{equivalencia.fragmentoIacc ?? "Sin fragmento disponible."}</p>
                {equivalencia.fragmentoIaccFuente && (
                  <p className="text-xs text-muted-foreground mt-2">Fuente: {equivalencia.fragmentoIaccFuente}</p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
