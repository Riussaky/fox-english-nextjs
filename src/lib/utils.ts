export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Mismo esquema de puntaje que ingles-kids-app/app.js: 3 si no hubo errores,
 * 2 si hubo pocos, 1 si hubo varios. */
export function starsForScore(mistakes: number, total: number): 1 | 2 | 3 {
  if (mistakes <= 0) return 3;
  if (mistakes <= Math.max(1, Math.ceil(total * 0.3))) return 2;
  return 1;
}
