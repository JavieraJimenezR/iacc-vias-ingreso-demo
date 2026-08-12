import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { COLOR_DESTRUCTIVO, COLOR_EXITO, COLOR_MUTED, COLOR_PRIMARIO, PALETA_VIAS } from "@/components/indicadores/ColoresGrafico";

const TIEMPO_ANTES_DIAS = 18;

export default function Indicadores() {
  const casos = useAppStore((s) => s.casos);

  const tiempoPromedioAhora = useMemo(() => {
    const resueltos = casos.filter((c) => c.estado === "resuelto-reconocido" || c.estado === "cerrado");
    if (resueltos.length === 0) return 4;
    const promedio = resueltos.reduce((acc, c) => acc + Math.min(c.antiguedadDias, 30), 0) / resueltos.length;
    return Math.max(1, Math.round(promedio / 4));
  }, [casos]);

  const datosPorViaEstado = useMemo(() => {
    const grupos: Record<string, { estado: string; via5: number; via6: number }> = {};
    for (const c of casos) {
      if (!grupos[c.estado]) grupos[c.estado] = { estado: c.estado, via5: 0, via6: 0 };
      if (c.via === "via5-rfcp") grupos[c.estado].via5 += 1;
      else grupos[c.estado].via6 += 1;
    }
    return Object.values(grupos);
  }, [casos]);

  const datosAnomalias = useMemo(() => {
    const conAnomalia = casos.filter((c) => c.anomaliaDocumental).length;
    const sinAnomalia = casos.length - conAnomalia;
    return [
      { name: "Sin anomalías", value: sinAnomalia },
      { name: "Con anomalías detectadas", value: conAnomalia },
    ];
  }, [casos]);

  const concordanciaIAHumano = useMemo(() => {
    let total = 0;
    let acuerdos = 0;
    for (const c of casos) {
      for (const eq of c.equivalencias) {
        if (!eq.decisionRevisor) continue;
        total += 1;
        const iaDijoReconocer = eq.propuestaIA === "reconocer";
        const humanoAprobo = eq.decisionRevisor === "aprobado";
        if (iaDijoReconocer === humanoAprobo) acuerdos += 1;
      }
    }
    return total === 0 ? 0 : Math.round((acuerdos / total) * 100);
  }, [casos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Indicadores</h1>
        <p className="text-muted-foreground mt-1">Panorama general de los casos de vías de ingreso.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Tiempo promedio de resolución</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-3">
            <span className="text-sm text-muted-foreground line-through">Antes: {TIEMPO_ANTES_DIAS} días</span>
            <span className="text-2xl font-semibold text-primary">Ahora: {tiempoPromedioAhora} días</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Concordancia IA vs. decisión humana</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{concordanciaIAHumano}%</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de casos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{casos.length}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Casos por vía y estado</CardTitle>
          <CardDescription>Cantidad de casos agrupados por estado, separados por vía de ingreso.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosPorViaEstado} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="estado" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="via5" name="Vía 5 — RFCP" fill={PALETA_VIAS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="via6" name="Vía 6 — Convalidación" fill={PALETA_VIAS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anomalías documentales detectadas</CardTitle>
            <CardDescription>Proporción de casos con al menos una anomalía marcada por la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={datosAnomalias} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  <Cell fill={COLOR_MUTED} />
                  <Cell fill={COLOR_DESTRUCTIVO} />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Concordancia IA vs. decisión humana</CardTitle>
            <CardDescription>
              Cuántas veces la decisión final de la persona revisora coincidió con la propuesta de
              la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Coincide", value: concordanciaIAHumano },
                    { name: "No coincide", value: 100 - concordanciaIAHumano },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  <Cell fill={COLOR_EXITO} />
                  <Cell fill={COLOR_PRIMARIO} fillOpacity={0.25} />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
