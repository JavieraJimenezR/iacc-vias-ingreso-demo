import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorialGuiado } from "@/hooks/use-tutorial-guiado";

/**
 * Botón de header que inicia el tour guiado de la sección actual según la
 * ruta. Siempre relanzable manualmente, sin importar si ya se vio.
 */
export function BotonTutorial() {
  const { seccionActual, relanzarTourActual } = useTutorialGuiado();

  if (!seccionActual) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={relanzarTourActual}
    >
      <HelpCircle className="h-3.5 w-3.5" />
      Tutorial
    </Button>
  );
}
