// eˣ and ln x for school: why e is special. For y = aˣ the slope at any point is (slope ratio) × height, where the
// ratio is lim (aʰ − 1)/h = ln a; it is exactly 1 only when a = e. Also e as the limit of (1 + 1/n)ⁿ and as
// Σ 1/k!, and ln x as the mirror image of eˣ in y = x with slope 1/x. Plain TypeScript, no DOM.
// Checked against sympy 1.14 / mpmath in tests/sci-tools/e-and-ln.mjs.

/** Slope ÷ height for y = aˣ measured with a step h: (aʰ − 1)/h. Tends to ln a as h → 0. */
export const ratioAt = (a: number, h: number) => (Math.pow(a, h) - 1) / h;
/** The exact ratio, ln a. */
export const ratio = (a: number) => Math.log(a);
/** Slope of aˣ at x: aˣ ln a. */
export const slopeExp = (a: number, x: number) => Math.pow(a, x) * Math.log(a);
/** The base whose ratio is 1, found by halving the interval on (aʰ − 1)/h = 1 with a small h (it lands on e). */
export function findE(h = 1e-7, lo = 2, hi = 3, steps = 60): number {
  for (let i = 0; i < steps; i++) { const m = (lo + hi) / 2; if (ratioAt(m, h) < 1) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** (1 + 1/n)ⁿ: a deposit of 1 at 100 % a year, added n times a year. */
export const compound = (n: number) => Math.exp(n * Math.log1p(1 / n));
/** Partial sums 1 + 1 + 1/2! + … + 1/k! for k = 0 … K. */
export function seriesE(K: number): number[] {
  const out: number[] = []; let s = 0, term = 1;
  for (let k = 0; k <= K; k++) { if (k > 0) term /= k; s += term; out.push(s); }
  return out;
}
/** Slope of ln x at x (x > 0): 1/x. */
export const slopeLn = (x: number) => (x > 0 ? 1 / x : NaN);
/** log to any base by the change-of-base rule: ln x / ln b. */
export const logBase = (x: number, b: number) => Math.log(x) / Math.log(b);
