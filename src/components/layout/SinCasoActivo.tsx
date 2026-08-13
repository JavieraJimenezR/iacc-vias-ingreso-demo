import { useNavigate } from "react-router-dom";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SinCasoActivoProps {
  mensaje?: string;
}

/**
 * Se muestra cuando alguien navega a una ruta profunda de postulante o
 * estudiante sin haber pasado por el selector de identidad (por ejemplo,
 * recargando la página directamente en /postulante/seguimiento). No es
 * autenticación real, solo continuidad narrativa de la demo.
 */
export function SinCasoActivo({ mensaje }: SinCasoActivoProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2">
            <UserX className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle>No hay una identidad activa</CardTitle>
          <CardDescription>
            {mensaje ??
              "No encontramos un caso asociado a esta sesión de demo. Vuelve a la selección de identidad para continuar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/")}>Ir a selección de identidad</Button>
        </CardContent>
      </Card>
    </div>
  );
}
