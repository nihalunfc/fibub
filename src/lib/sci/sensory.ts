// Discrimination (difference) tests in sensory science: triangle, duo-trio, 2-AFC and tetrad. Exact one-sided
// binomial p-values, the fewest correct answers needed, Thurstonian d′ (psychometric functions as in Ennis 1993
// and the sensR package, written out independently here), proportion of distinguishers, power and sample size.
import { ibeta, normCdf } from './stats.ts';

export type Method = 'triangle' | 'duotrio' | 'twoAFC' | 'tetrad';
export const METHODS: Record<Method, { name: string; p0: number; note: string }> = {
  triangle: { name: 'Triangle', p0: 1 / 3, note: 'three samples, two the same: pick the odd one out' },
  duotrio: { name: 'Duo-trio', p0: 1 / 2, note: 'a reference, then two samples: pick the one that matches' },
  twoAFC: { name: '2-AFC (paired comparison)', p0: 1 / 2, note: 'two samples: pick the one with more of a named attribute' },
  tetrad: { name: 'Tetrad (unspecified)', p0: 1 / 3, note: 'four samples, two of each: sort them into two pairs' },
};

/** P(X ≥ x) for X ~ Binomial(n, p): the exact one-sided p-value for x or more correct. */
export function binomSf(x: number, n: number, p: number): number {
  if (x <= 0) return 1;
  if (x > n) return 0;
  return ibeta(p, x, n - x + 1);
}

/** Fewest correct out of n for significance at alpha (one-sided), or null if even n of n is not enough. */
export function minCorrect(n: number, p0: number, alpha: number): number | null {
  for (let x = Math.ceil(n * p0); x <= n; x++) if (binomSf(x, n, p0) <= alpha) return x;
  return null;
}

const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
/** Simpson's rule with m (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, m = 2000): number {
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/** Probability of a correct answer for a panelist with sensitivity d′ (the psychometric function). */
export function pCorrect(method: Method, d: number): number {
  if (d <= 0) return METHODS[method].p0;
  switch (method) {
    case 'twoAFC': return normCdf(d / Math.SQRT2);
    case 'duotrio': { const a = normCdf(d / Math.SQRT2), b = normCdf(d / Math.sqrt(6)); return 1 - a - b + 2 * a * b; }
    case 'triangle': {
      const r3 = Math.sqrt(3), k = d * Math.sqrt(2 / 3);
      return 2 * simpson((z) => phi(z) * (normCdf(-z * r3 + k) + normCdf(-z * r3 - k)), 0, 9);
    }
    case 'tetrad':
      return 1 - 2 * simpson((z) => { const c = normCdf(z - d); return phi(z) * (2 * normCdf(z) * c - c * c); }, -9, 9 + d);
  }
}

/** d′ for an observed proportion correct (0 at or below chance; Infinity when pc is 1). */
export function dPrime(method: Method, pc: number): number {
  const p0 = METHODS[method].p0;
  if (pc <= p0) return 0;
  if (pc >= 1) return Infinity;
  let lo = 0, hi = 1;
  while (pCorrect(method, hi) < pc) { hi *= 2; if (hi > 64) return Infinity; }
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (pCorrect(method, m) < pc) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Proportion of distinguishers (guessing model): pd = (pc − p0) / (1 − p0), floored at 0. */
export const pdFrom = (pc: number, p0: number) => Math.max(0, (pc - p0) / (1 - p0));
export const pcFromPd = (pd: number, p0: number) => p0 + pd * (1 - p0);

export type Analysis = {
  method: Method; n: number; x: number; p0: number; pc: number; pValue: number; alpha: number; significant: boolean;
  needed: number | null; pd: number; sePd: number; d: number; seD: number;
};

/** The full analysis of x correct out of n. Standard errors by the delta method from the binomial SE of pc. */
export function analyse(method: Method, n: number, x: number, alpha = 0.05): Analysis {
  if (!Number.isInteger(n) || n < 1) throw new Error('The number of answers must be a whole number of 1 or more.');
  if (!Number.isInteger(x) || x < 0 || x > n) throw new Error(`Correct answers must be a whole number from 0 to ${n}.`);
  if (!(alpha > 0 && alpha < 1)) throw new Error('Alpha must be between 0 and 1.');
  const p0 = METHODS[method].p0, pc = x / n, sePc = Math.sqrt((pc * (1 - pc)) / n);
  const pValue = binomSf(x, n, p0), d = dPrime(method, pc);
  let seD = NaN;
  if (d > 0 && Number.isFinite(d)) { const h = 1e-4 * Math.max(1, d); seD = sePc / ((pCorrect(method, d + h) - pCorrect(method, d - h)) / (2 * h)); }
  return { method, n, x, p0, pc, pValue, alpha, significant: pValue <= alpha, needed: minCorrect(n, p0, alpha), pd: pdFrom(pc, p0), sePd: sePc / (1 - p0), d, seD };
}

/** Power: chance of a significant result with n answers when the true chance of a correct answer is pA. */
export function power(n: number, p0: number, pA: number, alpha: number): number {
  const c = minCorrect(n, p0, alpha);
  return c === null ? 0 : binomSf(c, n, pA);
}

/** Smallest n (up to max) with at least the target power. Power zig-zags with n, so later n can dip below again. */
export function sampleSize(p0: number, pA: number, alpha: number, target: number, max = 5000): number | null {
  if (!(pA > p0)) return null;
  for (let n = 2; n <= max; n++) if (power(n, p0, pA, alpha) >= target) return n;
  return null;
}

/** Table of the fewest correct answers for significance, for n from n1 to n2 and each alpha. */
export function criticalTable(method: Method, n1: number, n2: number, alphas: number[]): { n: number; c: (number | null)[] }[] {
  const p0 = METHODS[method].p0, out = [];
  for (let n = n1; n <= n2; n++) out.push({ n, c: alphas.map((a) => minCorrect(n, p0, a)) });
  return out;
}
