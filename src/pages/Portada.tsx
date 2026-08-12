import { useNavigate } from "react-router-dom";
import { GraduationCap, UserRound, Building2, Waypoints } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore, type Perspectiva } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface TarjetaPortada {
  perspectiva: Perspectiva;
  ruta: string;
  titulo: string;
  descripcion: string;
  icono: React.ComponentType<{ className?: string }>;
}

const TARJETAS: TarjetaPortada[] = [
  {
    perspectiva: "postulante",
    ruta: "/postulante/via",
    titulo: "Soy postulante",
    descripcion: "Quiero convalidar o reconocer estudios previos antes de matricularme.",
    icono: UserRound,
  },
  {
    perspectiva: "estudiante",
    ruta: "/estudiante",
    titulo: "Soy estudiante IACC",
    descripcion: "Ya estoy matriculado y quiero revisar mis solicitudes académicas.",
    icono: GraduationCap,
  },
  {
    perspectiva: "backoffice",
    ruta: "/backoffice",
    titulo: "Soy del equipo IACC",
    descripcion: "Reviso, verifico y resuelvo casos de vías de ingreso.",
    icono: Building2,
  },
  {
    perspectiva: "flujo-completo",
    ruta: "/flujo-completo",
    titulo: "Ver el flujo completo",
    descripcion: "Recorre paso a paso cómo opera el sistema de punta a punta.",
    icono: Waypoints,
  },
];

export default function Portada() {
  const navigate = useNavigate();
  const setPerspectiva = useAppStore((s) => s.setPerspectiva);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Sistema de Automatización de Vías de Ingreso
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Una plataforma con inteligencia artificial que propone reconocimientos de aprendizajes
          previos, siempre con aprobación humana final. Explora la demo desde distintas
          perspectivas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TARJETAS.map((t) => {
          const Icono = t.icono;
          return (
            <Card
              key={t.perspectiva}
              className={cn(
                "cursor-pointer transition-shadow hover:shadow-lg border-2 hover:border-primary"
              )}
              onClick={() => {
                setPerspectiva(t.perspectiva);
                navigate(t.ruta);
              }}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                  <Icono className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.titulo}</CardTitle>
                <CardDescription>{t.descripcion}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
