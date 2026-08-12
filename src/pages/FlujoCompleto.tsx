import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasoFlujo, type DatoPasoFlujo } from "@/components/flujo/PasoFlujo";
import { REGLA_APROBACION_HUMANA } from "@/lib/motor-ia/enrutamiento";

const PASOS_POSTULANTE: DatoPasoFlujo[] = [
  { titulo: "Elige su vía de ingreso", descripcion: "El postulante indica si viene por RFCP (título previo) o convalidación de asignaturas.", actor: "persona-iacc" },
  { titulo: "Carga documentos", descripcion: "Sube certificados, concentración de notas o programas académicos.", actor: "persona-iacc" },
  { titulo: "OCR y verificación", descripcion: "La plataforma extrae los datos y verifica firma, timbre y códigos de validación.", actor: "plataforma-ia" },
  { titulo: "Consulta memoria y compara malla", descripcion: "Se busca un criterio previo o se calcula el % de coincidencia contra la malla IACC.", actor: "plataforma-ia" },
  { titulo: "Enrutamiento por umbral", descripcion: "Sobre el umbral, propone reconocer; bajo el umbral, deriva a revisión humana.", actor: "plataforma-ia" },
  { titulo: "Revisión académica", descripcion: "Una persona del equipo IACC aprueba, rechaza o modifica cada propuesta, con evidencia citada.", actor: "persona-iacc" },
  { titulo: "Resolución y acta", descripcion: "Se genera el acta de reconocimiento y la malla ajustada del postulante.", actor: "plataforma-ia" },
];

const PASOS_ESTUDIANTE: DatoPasoFlujo[] = [
  { titulo: "Matrícula por RFCP", descripcion: "El estudiante ingresa a 3er año reconociendo los dos primeros por título previo.", actor: "persona-iacc" },
  { titulo: "Declaración jurada y plazo", descripcion: "Si no hay código de validación, firma declaración jurada con plazo de entrega notarial.", actor: "plataforma-ia" },
  { titulo: "Seguimiento de plazo", descripcion: "La plataforma vigila el plazo; si vence, bloquea la inscripción del ciclo siguiente.", actor: "plataforma-ia" },
  { titulo: "Sincronización con sistemas académicos", descripcion: "El estado del caso se refleja en los sistemas de inscripción del estudiante.", actor: "sistema-externo" },
  { titulo: "Regularización", descripcion: "El estudiante sube el documento legalizado; la plataforma levanta el bloqueo automáticamente.", actor: "plataforma-ia" },
];

export default function FlujoCompleto() {
  const [pasoActivo, setPasoActivo] = useState(0);
  const totalPasos = Math.max(PASOS_POSTULANTE.length, PASOS_ESTUDIANTE.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Flujo completo del sistema</h1>
        <p className="text-muted-foreground mt-1">
          Dos rutas en paralelo: postulante nuevo y estudiante ya matriculado. Navega paso a paso.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={() => setPasoActivo((p) => Math.max(0, p - 1))} disabled={pasoActivo === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <span className="text-sm text-muted-foreground">Paso {pasoActivo + 1} de {totalPasos}</span>
        <Button variant="outline" size="sm" onClick={() => setPasoActivo((p) => Math.min(totalPasos - 1, p + 1))} disabled={pasoActivo === totalPasos - 1}>
          Siguiente <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ruta: Postulante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PASOS_POSTULANTE.map((paso, idx) => (
              <PasoFlujo key={idx} paso={paso} activo={idx === pasoActivo} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ruta: Estudiante matriculado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PASOS_ESTUDIANTE.map((paso, idx) => (
              <PasoFlujo key={idx} paso={paso} activo={idx === pasoActivo} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-center text-muted-foreground">
          {REGLA_APROBACION_HUMANA}
        </CardContent>
      </Card>
    </div>
  );
}
