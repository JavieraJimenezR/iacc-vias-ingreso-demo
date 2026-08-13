import { useNavigate } from "react-router-dom";
import { GraduationCap, UserRound, Building2, Waypoints } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore, type TipoUsuarioActivo } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface TarjetaIdentidad {
  tipoUsuario: Exclude<TipoUsuarioActivo, null>;
  usuarioId: string | null;
  ruta: string;
  titulo: string;
  nombre: string;
  iniciales: string;
  descripcion: string;
  icono: React.ComponentType<{ className?: string }>;
}

const TARJETAS: TarjetaIdentidad[] = [
  {
    tipoUsuario: "postulante",
    usuarioId: "est-camila",
    ruta: "/postulante",
    titulo: "Soy postulante",
    nombre: "Camila Fuentes",
    iniciales: "CF",
    descripcion: "Quiero convalidar o reconocer estudios previos antes de matricularme.",
    icono: UserRound,
  },
  {
    tipoUsuario: "estudiante",
    usuarioId: "est-rodrigo",
    ruta: "/estudiante",
    titulo: "Soy estudiante IACC",
    nombre: "Rodrigo Salas",
    iniciales: "RS",
    descripcion: "Ya estoy matriculado y quiero revisar mis solicitudes académicas.",
    icono: GraduationCap,
  },
  {
    tipoUsuario: "staff",
    usuarioId: null,
    ruta: "/backoffice",
    titulo: "Soy del equipo IACC",
    nombre: "Equipo IACC",
    iniciales: "IA",
    descripcion: "Reviso, verifico y resuelvo casos de vías de ingreso.",
    icono: Building2,
  },
];

export default function Portada() {
  const navigate = useNavigate();
  const setUsuarioActivo = useAppStore((s) => s.setUsuarioActivo);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Sistema de Automatización de Vías de Ingreso
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Una plataforma con inteligencia artificial que propone reconocimientos de aprendizajes
          previos, siempre con aprobación humana final. Elige quién eres para explorar la demo
          desde esa perspectiva.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-tour="portada-tarjetas">
        {TARJETAS.map((t) => {
          const Icono = t.icono;
          return (
            <Card
              key={t.tipoUsuario}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              tabIndex={0}
              role="button"
              onClick={() => {
                setUsuarioActivo(t.tipoUsuario, t.usuarioId);
                navigate(t.ruta);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setUsuarioActivo(t.tipoUsuario, t.usuarioId);
                  navigate(t.ruta);
                }
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarFallback className="bg-secondary text-primary font-semibold">
                      {t.iniciales}
                    </AvatarFallback>
                  </Avatar>
                  <Icono className="h-6 w-6 text-primary shrink-0" />
                </div>
                <CardTitle>{t.titulo}</CardTitle>
                <p className="text-sm font-medium text-primary">{t.nombre}</p>
                <CardDescription>{t.descripcion}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
          onClick={() => navigate("/flujo-completo")}
          data-tour="portada-flujo-completo"
        >
          <Waypoints className="h-3.5 w-3.5" />
          Ver el flujo completo del sistema
        </button>
      </div>
    </div>
  );
}
