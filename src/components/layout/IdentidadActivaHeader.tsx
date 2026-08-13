import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { selEstudiantePorId } from "@/store/selectors";

const ETIQUETA_TIPO: Record<string, string> = {
  postulante: "Postulante",
  estudiante: "Estudiante IACC",
  staff: "Equipo IACC",
};

/**
 * Muestra la identidad mock activa (avatar con iniciales + nombre corto) en
 * el header, con un botón para cerrar la sesión mock y volver a la
 * selección de identidad. No representa autenticación real.
 */
export function IdentidadActivaHeader() {
  const navigate = useNavigate();
  const tipoUsuarioActivo = useAppStore((s) => s.tipoUsuarioActivo);
  const usuarioActivoId = useAppStore((s) => s.usuarioActivoId);
  const cerrarSesionMock = useAppStore((s) => s.cerrarSesionMock);

  if (!tipoUsuarioActivo) return null;

  const estudiante = selEstudiantePorId(usuarioActivoId ?? undefined);
  const nombre = estudiante?.nombreCompleto ?? ETIQUETA_TIPO[tipoUsuarioActivo];
  const primerNombre = nombre.split(" ").slice(0, 2).join(" ");
  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 sm:pl-2 sm:border-l" data-tour="identidad-activa">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-xs bg-secondary text-primary font-medium">
          {iniciales}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-muted-foreground">{primerNombre}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => {
          cerrarSesionMock();
          navigate("/");
        }}
      >
        <LogOut className="h-3.5 w-3.5" />
        Cambiar usuario
      </Button>
    </div>
  );
}
