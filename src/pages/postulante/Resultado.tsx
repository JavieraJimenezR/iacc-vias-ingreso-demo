import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MallaVisual } from "@/components/malla/MallaVisual";
import { useAppStore } from "@/store/useAppStore";
import { selCasoActivoDelUsuario, selEstudiantePorId } from "@/store/selectors";
import { SinCasoActivo } from "@/components/layout/SinCasoActivo";
import { TituloPagina } from "@/components/layout/TituloPagina";
import { PasosPostulante } from "@/components/postulante/PasosPostulante";

export default function Resultado() {
  const caso = useAppStore(selCasoActivoDelUsuario);
  const usuarioActivoId = useAppStore((s) => s.usuarioActivoId);
  const estudiante = selEstudiantePorId(usuarioActivoId ?? undefined);

  if (!caso || !estudiante) {
    return <SinCasoActivo />;
  }

  const reconocidas = caso.equivalencias.filter((eq) => eq.decisionRevisor === "aprobado" || (eq.propuestaIA === "reconocer" && !eq.decisionRevisor));
  const noReconocidas = caso.equivalencias.filter((eq) => !reconocidas.includes(eq));

  const totalAsignaturasMalla = estudiante.malla.length;
  const reconocidasCount = estudiante.malla.filter((a) => a.reconocida).length;
  const semestresAcortados = Math.round(reconocidasCount / 5);

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:max-w-full">
      <div className="print:hidden">
        <PasosPostulante estadoCaso={caso.estado} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <TituloPagina
          rotulo="Paso 4 de 4"
          titulo="Resultado de tu solicitud"
          descripcion={`Caso ${caso.numeroCaso} — ${caso.carreraOrigen} → ${caso.carreraDestino}`}
        />
        <Button variant="outline" onClick={() => window.print()} className="print:hidden">
          Descargar carta de resolución (PDF)
        </Button>
      </div>

      {caso.esPreConvalidacion && (
        <Alert variant="advertencia">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Resultado preliminar</AlertTitle>
          <AlertDescription>
            Este resultado corresponde a una preconvalidación previa a la matrícula. Es preliminar
            y queda sujeto a la revisión final de los programas académicos originales.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Asignaturas reconocidas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">{reconocidasCount} de {totalAsignaturasMalla}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Semestres que se acortan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{semestresAcortados}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Asignaturas por cursar</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{totalAsignaturasMalla - reconocidasCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asignaturas reconocidas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Créditos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconocidas.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.asignaturaIaccCodigo}</TableCell>
                  <TableCell>{eq.asignaturaIaccNombre}</TableCell>
                  <TableCell>{eq.asignaturaIaccSemestre}</TableCell>
                  <TableCell>{eq.asignaturaIaccCreditos}</TableCell>
                </TableRow>
              ))}
              {reconocidas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Aún no hay asignaturas reconocidas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {noReconocidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asignaturas no reconocidas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asignatura externa</TableHead>
                  <TableHead>Asignatura IACC referencia</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noReconocidas.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell>{eq.asignaturaExternaNombre}</TableCell>
                    <TableCell>{eq.asignaturaIaccNombre}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {eq.motivoNoReconocimiento ?? "Pendiente de revisión académica."}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu malla ajustada</CardTitle>
        </CardHeader>
        <CardContent>
          <MallaVisual malla={estudiante.malla} />
        </CardContent>
      </Card>

      <style>{`
        @media print {
          header, footer, nav, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
