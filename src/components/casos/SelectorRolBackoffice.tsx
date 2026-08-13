import { BookUser, FileSearch, Scale } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import type { RolBackoffice } from "@/types";

const ROLES: { rol: RolBackoffice; titulo: string; descripcion: string; icono: React.ComponentType<{ className?: string }> }[] = [
  {
    rol: "registro-curricular",
    titulo: "Registro Curricular",
    descripcion: "Valida o rechaza la autenticidad de los documentos entregados.",
    icono: FileSearch,
  },
  {
    rol: "coordinador-academico",
    titulo: "Coordinador académico",
    descripcion: "Aprueba, rechaza o modifica las equivalencias propuestas por la plataforma.",
    icono: BookUser,
  },
  {
    rol: "analista-diferenciados",
    titulo: "Analista de Ingresos Diferenciados",
    descripcion: "Ve el caso completo y confirma la resolución final.",
    icono: Scale,
  },
];

export function SelectorRolBackoffice() {
  const setRolBackoffice = useAppStore((s) => s.setRolBackoffice);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">¿Con qué rol quieres ingresar?</h1>
        <p className="text-muted-foreground mt-1">
          El backoffice muestra distintos paneles según el rol de quien revisa el caso.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-tour="backoffice-selector-rol">
        {ROLES.map((r) => {
          const Icono = r.icono;
          return (
            <Card
              key={r.rol}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-shadow"
              onClick={() => setRolBackoffice(r.rol)}
            >
              <CardHeader>
                <Icono className="h-7 w-7 text-primary mb-2" />
                <CardTitle className="text-base">{r.titulo}</CardTitle>
                <CardDescription>{r.descripcion}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
