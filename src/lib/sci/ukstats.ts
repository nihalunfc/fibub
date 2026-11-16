// Normal and binomial probabilities for the school statistics tools (A-level maths, GCSE probability).
// Plain TypeScript, no DOM. Checked against published values in tests/sci.mjs.

import { normCdf, normInv } from './stats.ts';
export { normCdf, normInv };
/** P(X < x) for X ~ N(mu, sigma squared). */
export const normalCdf = (x: number, mu: number, sigma: number) => normCdf((x - mu) / sigma);
export const normalPdf = (x: number, mu: number, sigma: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

/** P(X = k) for X ~ B(n, p). */
export function binomPmf(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  let lc = 0;
  for (let i = 1; i <= k; i++) lc += Math.log((n - k + i) / i);
  return Math.exp(lc + k * Math.log(p) + (n - k) * Math.log(1 - p));
}
/** P(X <= k) for X ~ B(n, p). */
export function binomCdf(n: number, p: number, k: number): number {
  let s = 0;
  for (let i = 0; i <= Math.min(k, n); i++) s += binomPmf(n, p, i);
  return Math.min(1, s);
}
/** P(X >= k). */
export const binomUpper = (n: number, p: number, k: number) => (k <= 0 ? 1 : 1 - binomCdf(n, p, k - 1));
/** Smallest c with P(X >= c) <= alpha (upper critical value), or n + 1 when none. */
export function criticalUpper(n: number, p: number, alpha: number): number {
  for (let c = 0; c <= n; c++) if (binomUpper(n, p, c) <= alpha) return c;
  return n + 1;
}
/** Largest c with P(X <= c) <= alpha (lower critical value), or -1 when none. */
export function criticalLower(n: number, p: number, alpha: number): number {
  let c = -1;
  for (let k = 0; k <= n; k++) { if (binomCdf(n, p, k) <= alpha) c = k; else break; }
  return c;
}
