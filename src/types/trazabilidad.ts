export type ActorTrazabilidad = "plataforma-ia" | "persona-iacc" | "sistema-externo";

export interface EventoTrazabilidad {
  id: string;
  actor: ActorTrazabilidad;
  nombreActor?: string;
  rolActor?: string;
  descripcion: string;
  fecha: string;
}
