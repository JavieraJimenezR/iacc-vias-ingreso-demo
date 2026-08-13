import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectorRolBackoffice } from "@/components/casos/SelectorRolBackoffice";
import { useAppStore } from "@/store/useAppStore";
import { ordenarCasosBandeja } from "@/store/selectors";
import { estudiantesSeed } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Caso, EstadoCaso, NivelConfianza } from "@/types";

const ETIQUETAS_ESTADO: Record<EstadoCaso, string> = {
  "documentos-pendientes": "Documentos pendientes",
  "en-verificacion": "En verificación",
  "en-revision-humana": "En revisión académica",
  "bloqueado-documento-pendiente": "Bloqueado",
  "eliminado-documento-pendiente": "Eliminado",
  "resuelto-reconocido": "Resuelto — reconocido",
  "resuelto-rechazado": "Resuelto — rechazado",
  cerrado: "Cerrado",
};

const NOMBRES_RELLENO: Record<string, { nombre: string; rut: string }> = {
  "est-003": { nombre: "Valentina Soto Muñoz", rut: "18.221.043-5" },
  "est-004": { nombre: "Francisco Araya Contreras", rut: "17.556.902-8" },
  "est-005": { nombre: "Paulina Reyes Ibarra", rut: "16.884.221-3" },
  "est-006": { nombre: "Matías González Peña", rut: "19.003.774-2" },
  "est-007": { nombre: "Daniela Espinoza Rojas", rut: "15.667.330-9" },
  "est-008": { nombre: "Cristóbal Vidal Sepúlveda", rut: "20.114.882-6" },
  "est-009": { nombre: "Antonia Bravo Fuentes", rut: "17.998.204-1" },
  "est-010": { nombre: "Sebastián Morales Díaz", rut: "14.552.671-0" },
  "est-011": { nombre: "Javiera Cortés Lagos", rut: "18.776.093-4" },
  "est-012": { nombre: "Ignacio Vergara Toro", rut: "16.223.457-7" },
  "est-013": { nombre: "Constanza Herrera Silva", rut: "19.441.086-3" },
};

function datosEstudiante(estudianteId: string) {
  const seed = estudiantesSeed.find((e) => e.id === estudianteId);
  if (seed) return { nombre: seed.nombreCompleto, rut: seed.rut };
  return NOMBRES_RELLENO[estudianteId] ?? { nombre: "Estudiante sin registro", rut: "—" };
}

function colorConfianza(nivel: NivelConfianza) {
  if (nivel === "alta") return "bg-exito text-exito-foreground";
  if (nivel === "media") return "bg-advertencia text-advertencia-foreground";
  return "bg-destructive text-destructive-foreground";
}

export default function BandejaCasos() {
  const navigate = useNavigate();
  const rolBackoffice = useAppStore((s) => s.rolBackoffice);
  const casos = useAppStore((s) => s.casos);

  const [filtroVia, setFiltroVia] = useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroConfianza, setFiltroConfianza] = useState<string>("todas");

  const casosFiltrados = useMemo(() => {
    let resultado: Caso[] = casos;
    if (filtroVia !== "todas") resultado = resultado.filter((c) => c.via === filtroVia);
    if (filtroEstado !== "todos") resultado = resultado.filter((c) => c.estado === filtroEstado);
    if (filtroConfianza !== "todas") resultado = resultado.filter((c) => c.nivelConfianzaGlobal === filtroConfianza);
    return ordenarCasosBandeja(resultado);
  }, [casos, filtroVia, filtroEstado, filtroConfianza]);

  if (!rolBackoffice) {
    return <SelectorRolBackoffice />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bandeja de casos</h1>
        <p className="text-muted-foreground mt-1">
          {casos.length} casos en total. Ordenados por menor confianza y mayor antigüedad primero.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={filtroVia} onValueChange={setFiltroVia}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Vía" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las vías</SelectItem>
              <SelectItem value="via5-rfcp">Vía 5 — RFCP</SelectItem>
              <SelectItem value="via6-convalidacion">Vía 6 — Convalidación</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
                <SelectItem key={valor} value={valor}>{etiqueta}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroConfianza} onValueChange={setFiltroConfianza}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Confianza" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda confianza</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card data-tour="backoffice-bandeja">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° de caso</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Vía</TableHead>
                <TableHead>Carrera origen → destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Confianza</TableHead>
                <TableHead>Antigüedad</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {casosFiltrados.map((c) => {
                const { nombre, rut } = datosEstudiante(c.estudianteId);
                return (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/backoffice/casos/${c.id}`)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        {c.numeroCaso}
                        {c.anomaliaDocumental && (
                          <Badge variant="destructive" className="gap-1 px-1.5">
                            <AlertTriangle className="h-3 w-3" /> Anomalía
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{rut}</TableCell>
                    <TableCell>{c.via === "via5-rfcp" ? "Vía 5 — RFCP" : "Vía 6 — Convalidación"}</TableCell>
                    <TableCell className="text-sm">
                      {c.carreraOrigen} → {c.carreraDestino}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ETIQUETAS_ESTADO[c.estado]}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", colorConfianza(c.nivelConfianzaGlobal))}>
                        {c.porcentajeConfianza}%
                      </span>
                    </TableCell>
                    <TableCell>{c.antiguedadDias} días</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.responsableActual ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
              {casosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No hay casos que coincidan con estos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
