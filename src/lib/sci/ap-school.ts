// School maths: arithmetic progressions (Class 10): terms, the nth term a + (n − 1)d, the sum of the first n terms
// n/2 [2a + (n − 1)d] = n/2 (first + last), and which term has a given value. No DOM.

export const nth = (a: number, d: number, n: number) => a + (n - 1) * d;
export const terms = (a: number, d: number, n: number) => Array.from({ length: n }, (_, i) => a + i * d);
export const sum = (a: number, d: number, n: number) => (n / 2) * (2 * a + (n - 1) * d);

/** Which term equals `value`? Returns n (a whole number ≥ 1) or null if no term equals it. */
export function whichTerm(a: number, d: number, value: number): number | null {
  if (d === 0) return value === a ? 1 : null;
  const n = (value - a) / d + 1;
  return Math.abs(n - Math.round(n)) < 1e-9 && Math.round(n) >= 1 ? Math.round(n) : null;
}

/** How many terms are needed for the sum to reach at least `target` (d > 0 or a > 0), up to `max`. */
export function termsToReach(a: number, d: number, target: number, max = 10000): number | null {
  let s = 0;
  for (let n = 1; n <= max; n++) { s += nth(a, d, n); if (s >= target) return n; }
  return null;
}

// ---- Added 2026-11-16: solve from clues (two terms, first and last term, how many terms for a sum). No DOM. ----

const isInt = (x: number) => Number.isFinite(x) && Math.abs(x - Math.round(x)) < 1e-9;

/** The p-th term is x and the q-th term is y: find a and d. Null when p = q or a position is not a whole number ≥ 1. */
export function fromTwoTerms(p: number, x: number, q: number, y: number): { a: number; d: number } | null {
  if (!isInt(p) || !isInt(q) || p < 1 || q < 1 || p === q || ![x, y].every(Number.isFinite)) return null;
  const d = (y - x) / (q - p);
  return { a: x - (p - 1) * d, d };
}

/** First term a, last term l and d: how many terms (null if l is not reached exactly) and their sum. */
export function countTerms(a: number, l: number, d: number): { n: number; sum: number } | null {
  if (d === 0) return null;
  const n = (l - a) / d + 1;
  return isInt(n) && Math.round(n) >= 1 ? { n: Math.round(n), sum: (Math.round(n) * (a + l)) / 2 } : null;
}

/** Difference and sum from the first term, last term and number of terms. */
export function fromFirstLast(a: number, l: number, n: number): { d: number; sum: number } | null {
  if (!isInt(n) || n < 2) return null;
  return { d: (l - a) / (n - 1), sum: (n * (a + l)) / 2 };
}

/**
 * How many terms add up to S? Solves d n² + (2a − d) n − 2S = 0. Returns the whole-number answers (n ≥ 1) and the
 * other root if it is not usable, so the page can say why it is left out.
 */
export function termsForSum(a: number, d: number, S: number): { ns: number[]; other: number[] } {
  if (d === 0) { if (a === 0) return { ns: [], other: [] }; const n = S / a; return isInt(n) && n >= 1 ? { ns: [Math.round(n)], other: [] } : { ns: [], other: [n] }; }
  const B = 2 * a - d, D = B * B + 8 * d * S;
  if (D < -1e-9) return { ns: [], other: [] };
  const r = Math.sqrt(Math.max(0, D)), roots = [(-B + r) / (2 * d), (-B - r) / (2 * d)].map((v) => Math.round(v * 1e9) / 1e9);
  const uniq = [...new Set(roots)].sort((u, v) => u - v);
  return { ns: uniq.filter((v) => isInt(v) && v >= 1).map(Math.round), other: uniq.filter((v) => !(isInt(v) && v >= 1)) };
}
