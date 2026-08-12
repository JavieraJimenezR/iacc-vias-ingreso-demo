import { useCallback, useState } from "react";

export type EstadoSimulacionIA = "idle" | "analizando" | "listo" | "error";

/**
 * Envuelve una llamada asíncrona (ej. el pipeline de IA sobre un documento
 * recién cargado) exponiendo un estado simple para animar el análisis de
 * 2 a 3 segundos en la UI.
 */
export function useSimulacionIA<TInput, TResultado>(
  tarea: (input: TInput) => Promise<TResultado>
) {
  const [estado, setEstado] = useState<EstadoSimulacionIA>("idle");
  const [resultado, setResultado] = useState<TResultado | null>(null);
  const [error, setError] = useState<unknown>(null);

  const ejecutar = useCallback(
    async (input: TInput) => {
      setEstado("analizando");
      setError(null);
      try {
        const res = await tarea(input);
        setResultado(res);
        setEstado("listo");
        return res;
      } catch (err) {
        setError(err);
        setEstado("error");
        throw err;
      }
    },
    [tarea]
  );

  const reiniciar = useCallback(() => {
    setEstado("idle");
    setResultado(null);
    setError(null);
  }, []);

  return { estado, resultado, error, ejecutar, reiniciar };
}
