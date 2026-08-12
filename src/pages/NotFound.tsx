import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Esta página no existe en la demo.</p>
      <Button asChild>
        <Link to="/">Volver a la portada</Link>
      </Button>
    </div>
  );
}
