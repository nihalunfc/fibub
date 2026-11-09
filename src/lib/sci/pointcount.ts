// Point counting (modal analysis): where to put the points, and the statistics of the counts. Proportions
// with binomial standard errors, the 2σ of Van der Plas and Tobi (1965), Wilson and Clopper-Pearson (exact)
// confidence intervals, and the number of points needed for a target precision. Plain TypeScript, no DOM.
import { ibeta, normInv } from './stats.ts';

/** mulberry32: a small seeded random generator, so random points come out the same for the same seed. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pt = { x: number; y: number };
/** A rows × cols grid of points at cell centres, as fractions (0 to 1) of the width and height, row by row. */
export function gridPoints(rows: number, cols: number, margin = 0): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) out.push({ x: margin + ((1 - 2 * margin) * (j + 0.5)) / cols, y: margin + ((1 - 2 * margin) * (i + 0.5)) / rows });
  return out;
}
/** n uniform random points (fractions), from a seed; sorted row-wise in bands so the count walks across the image. */
export function randomPoints(n: number, seed: number, margin = 0): Pt[] {
  const r = mulberry32(seed), pts: Pt[] = [];
  for (let k = 0; k < n; k++) { const x = r(), y = r(); pts.push({ x: margin + (1 - 2 * margin) * x, y: margin + (1 - 2 * margin) * y }); }
  const bands = Math.max(1, Math.round(Math.sqrt(n)));
  return pts.map((p, i) => ({ p, i, b: Math.min(bands - 1, Math.floor(((p.y - margin) / (1 - 2 * margin || 1)) * bands)) }))
    .sort((a, b) => a.b - b.b || (a.b % 2 ? b.p.x - a.p.x : a.p.x - b.p.x) || a.i - b.i).map((o) => o.p);
}

/** Inverse of the regularised incomplete beta I_x(a, b) in x, by bisection (to about 1e-15). */
export function betaInv(p: number, a: number, b: number): number {
  let lo = 0, hi = 1;
  for (let i = 0; i < 200 && hi - lo > 1e-16; i++) { const m = (lo + hi) / 2; if (ibeta(m, a, b) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

export type ClassStat = { n: number; p: number; se: number; twoSigma: number; normal: [number, number]; wilson: [number, number]; exact: [number, number] };
/** Statistics for one class: k points of N. `conf` is the confidence level for the intervals (0.95). */
export function classStat(k: number, N: number, conf = 0.95): ClassStat {
  const p = N ? k / N : NaN, se = N ? Math.sqrt((p * (1 - p)) / N) : NaN, z = normInv(1 - (1 - conf) / 2), a = 1 - conf;
  const den = 1 + (z * z) / N, c = (p + (z * z) / (2 * N)) / den, h = (z * Math.sqrt((p * (1 - p)) / N + (z * z) / (4 * N * N))) / den;
  const exact: [number, number] = [k === 0 ? 0 : betaInv(a / 2, k, N - k + 1), k === N ? 1 : betaInv(1 - a / 2, k + 1, N - k)];
  return { n: k, p, se, twoSigma: 2 * se, normal: [Math.max(0, p - z * se), Math.min(1, p + z * se)], wilson: [c - h, c + h], exact };
}
/** Points needed so that 2σ ≤ e (both as fractions), for a true proportion p: N = 4p(1 − p)/e². */
export const pointsNeeded = (p: number, e: number) => Math.ceil((4 * p * (1 - p)) / (e * e) - 1e-9);
/** 2σ (as a fraction) for proportion p after N points: the Van der Plas and Tobi chart line. */
export const twoSigma = (p: number, N: number) => 2 * Math.sqrt((p * (1 - p)) / N);
