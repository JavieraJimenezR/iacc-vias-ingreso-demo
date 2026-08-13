interface TituloPaginaProps {
  rotulo?: string;
  titulo: string;
  descripcion?: string;
}

/**
 * Encabezado estándar de página: rótulo pequeño opcional, título y
 * descripción. Reemplaza el patrón de encabezado repetido en casi todas
 * las páginas de la demo para dar una jerarquía tipográfica consistente.
 */
export function TituloPagina({ rotulo, titulo, descripcion }: TituloPaginaProps) {
  return (
    <div>
      {rotulo && (
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{rotulo}</p>
      )}
      <h1 className="text-2xl font-bold text-foreground">{titulo}</h1>
      {descripcion && <p className="text-muted-foreground mt-1">{descripcion}</p>}
    </div>
  );
}
