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
