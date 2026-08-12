import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

export function BotonReiniciarDemo() {
  const reiniciarDemo = useAppStore((s) => s.reiniciarDemo);
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => {
        reiniciarDemo();
        navigate("/");
        toast.success("Demo reiniciada", {
          description: "Todos los casos volvieron a su estado inicial.",
        });
      }}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Reiniciar demo
    </Button>
  );
}
