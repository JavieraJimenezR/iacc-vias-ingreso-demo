import { useNavigate } from "react-router-dom";
import { FileCheck2, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { REGLA_APROBACION_HUMANA } from "@/lib/motor-ia/enrutamiento";

export default function SeleccionVia() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">¿Qué quieres hacer?</h1>
        <p className="text-muted-foreground mt-1">
          Elige la opción que mejor describe tu situación. Camila Fuentes, nuestra postulante de
          ejemplo, viene de un Técnico en Administración y quiere convalidar asignaturas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:border-primary hover:shadow-md transition-shadow">
          <CardHeader>
            <FileCheck2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Convalidar asignaturas de una carrera que cursé</CardTitle>
            <CardDescription>
              Vía 6 — Convalidación. Necesitarás tu concentración de notas, los programas
              académicos de las asignaturas y, si corresponde, un acta de convalidación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/postulante/documentos")}>
              Continuar con convalidación
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary hover:shadow-md transition-shadow">
          <CardHeader>
            <GraduationCap className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Reconocimiento por carrera previa terminada</CardTitle>
            <CardDescription>
              Vía 5 — RFCP. Si ya tienes un título o egreso de una carrera afín, puedes entrar
              directo a 3er año. Necesitarás tu certificado de título (con o sin código de
              validación).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => navigate("/postulante/documentos")}>
              Continuar con RFCP
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertDescription>{REGLA_APROBACION_HUMANA}</AlertDescription>
      </Alert>
    </div>
  );
}
