import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Caso,
  Documento,
  EstadoCaso,
  EventoTrazabilidad,
  RolBackoffice,
} from "@/types";
import type { DecisionRevisor } from "@/types";
import { casosSeed } from "@/lib/mock-data";

export type Perspectiva = "portada" | "postulante" | "estudiante" | "backoffice" | "flujo-completo";

export type TipoUsuarioActivo = "postulante" | "estudiante" | "staff" | null;

interface AppState {
  perspectiva: Perspectiva;
  rolBackoffice: RolBackoffice | null;
  casos: Caso[];
  tipoUsuarioActivo: TipoUsuarioActivo;
  usuarioActivoId: string | null;
  setPerspectiva: (p: Perspectiva) => void;
  setRolBackoffice: (rol: RolBackoffice | null) => void;
  setUsuarioActivo: (tipo: TipoUsuarioActivo, usuarioId: string | null) => void;
  cerrarSesionMock: () => void;
  avanzarProcesoCaso: (casoId: string) => void;
  actualizarDocumento: (casoId: string, documentoId: string, patch: Partial<Documento>) => void;
  agregarDocumento: (casoId: string, doc: Documento) => void;
  resolverFilaEquivalencia: (
    casoId: string,
    equivalenciaId: string,
    decision: DecisionRevisor,
    comentario?: string,
    codigoModificado?: string
  ) => void;
  confirmarResolucion: (casoId: string) => void;
  agregarEventoTrazabilidad: (casoId: string, evento: Omit<EventoTrazabilidad, "id">) => void;
  levantarBloqueoDocumento: (casoId: string) => void;
  reiniciarDemo: () => void;
}

/** Orden lógico de avance para el botón de demo "Avanzar el proceso". */
const SECUENCIA_ESTADOS: EstadoCaso[] = [
  "documentos-pendientes",
  "en-verificacion",
  "en-revision-humana",
  "resuelto-reconocido",
];

function siguienteEstado(actual: EstadoCaso): EstadoCaso {
  const idx = SECUENCIA_ESTADOS.indexOf(actual);
  if (idx === -1 || idx === SECUENCIA_ESTADOS.length - 1) return actual;
  return SECUENCIA_ESTADOS[idx + 1];
}

function nuevoIdEvento(caso: Caso): string {
  return `${caso.id}-tz-${caso.trazabilidad.length + 1}-${Date.now()}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      perspectiva: "portada",
      rolBackoffice: null,
      casos: structuredClone(casosSeed),
      tipoUsuarioActivo: null,
      usuarioActivoId: null,

      setPerspectiva: (p) => set({ perspectiva: p }),
      setRolBackoffice: (rol) => set({ rolBackoffice: rol }),

      setUsuarioActivo: (tipo, usuarioId) =>
        set({
          tipoUsuarioActivo: tipo,
          usuarioActivoId: usuarioId,
          perspectiva:
            tipo === "postulante"
              ? "postulante"
              : tipo === "estudiante"
              ? "estudiante"
              : tipo === "staff"
              ? "backoffice"
              : "portada",
        }),

      cerrarSesionMock: () =>
        set({
          tipoUsuarioActivo: null,
          usuarioActivoId: null,
          rolBackoffice: null,
          perspectiva: "portada",
        }),

      avanzarProcesoCaso: (casoId) =>
        set((state) => ({
          casos: state.casos.map((c) => {
            if (c.id !== casoId) return c;
            const nuevoEstado = siguienteEstado(c.estado);
            if (nuevoEstado === c.estado) return c;
            const evento: EventoTrazabilidad = {
              id: nuevoIdEvento(c),
              actor: "plataforma-ia",
              descripcion: `Avance de demostración: estado cambió a "${nuevoEstado}"`,
              fecha: new Date().toISOString(),
            };
            return { ...c, estado: nuevoEstado, trazabilidad: [...c.trazabilidad, evento] };
          }),
        })),

      actualizarDocumento: (casoId, documentoId, patch) =>
        set((state) => ({
          casos: state.casos.map((c) =>
            c.id !== casoId
              ? c
              : {
                  ...c,
                  documentos: c.documentos.map((d) => (d.id === documentoId ? { ...d, ...patch } : d)),
                }
          ),
        })),

      agregarDocumento: (casoId, doc) =>
        set((state) => ({
          casos: state.casos.map((c) =>
            c.id !== casoId ? c : { ...c, documentos: [...c.documentos, doc] }
          ),
        })),

      resolverFilaEquivalencia: (casoId, equivalenciaId, decision, comentario, codigoModificado) =>
        set((state) => ({
          casos: state.casos.map((c) => {
            if (c.id !== casoId) return c;
            return {
              ...c,
              equivalencias: c.equivalencias.map((eq) =>
                eq.id !== equivalenciaId
                  ? eq
                  : {
                      ...eq,
                      decisionRevisor: decision,
                      comentarioRevisor: comentario,
                      asignaturaIaccModificadaCodigo: codigoModificado,
                    }
              ),
            };
          }),
        })),

      confirmarResolucion: (casoId) =>
        set((state) => ({
          casos: state.casos.map((c) => {
            if (c.id !== casoId) return c;
            const hayRechazos = c.equivalencias.some((eq) => eq.decisionRevisor === "rechazado");
            const todasResueltas = c.equivalencias.every((eq) => eq.decisionRevisor);
            const nuevoEstado: EstadoCaso =
              todasResueltas && !hayRechazos ? "resuelto-reconocido" : "resuelto-rechazado";
            const evento: EventoTrazabilidad = {
              id: nuevoIdEvento(c),
              actor: "persona-iacc",
              descripcion: "Confirmó la resolución del caso y generó acta de reconocimiento",
              fecha: new Date().toISOString(),
              rolActor: state.rolBackoffice ?? undefined,
            };
            return { ...c, estado: nuevoEstado, trazabilidad: [...c.trazabilidad, evento] };
          }),
        })),

      agregarEventoTrazabilidad: (casoId, evento) =>
        set((state) => ({
          casos: state.casos.map((c) => {
            if (c.id !== casoId) return c;
            const nuevoEvento: EventoTrazabilidad = { ...evento, id: nuevoIdEvento(c) };
            return { ...c, trazabilidad: [...c.trazabilidad, nuevoEvento] };
          }),
        })),

      levantarBloqueoDocumento: (casoId) =>
        set((state) => ({
          casos: state.casos.map((c) => {
            if (c.id !== casoId) return c;
            const evento: EventoTrazabilidad = {
              id: nuevoIdEvento(c),
              actor: "plataforma-ia",
              descripcion: "Documento pendiente recibido y verificado: se levantó el bloqueo de inscripción",
              fecha: new Date().toISOString(),
            };
            return {
              ...c,
              estado: "resuelto-reconocido",
              ciclosSinDocumento: 0,
              trazabilidad: [...c.trazabilidad, evento],
            };
          }),
        })),

      reiniciarDemo: () =>
        set({
          casos: structuredClone(casosSeed),
          perspectiva: "portada",
          rolBackoffice: null,
          tipoUsuarioActivo: null,
          usuarioActivoId: null,
        }),
    }),
    {
      name: "iacc-vias-ingreso-demo",
      version: 2,
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as Partial<AppState>;
        if (version < 2) {
          state.tipoUsuarioActivo = state.tipoUsuarioActivo ?? null;
          state.usuarioActivoId = state.usuarioActivoId ?? null;
        }
        return state as AppState;
      },
    }
  )
);

export type { AppState };
