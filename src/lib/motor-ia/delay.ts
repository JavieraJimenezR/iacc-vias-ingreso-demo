export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function conJitter(baseMs: number, jitterMs: number) {
  return baseMs + Math.floor(Math.random() * jitterMs);
}
