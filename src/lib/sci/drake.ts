// Drake equation N = R* · fp · ne · fl · fi · fc · L with a range for each factor. Each factor is drawn
// log-uniformly between its low and high values (equal chance for every factor of ten), so log10 N is a sum of
// uniform variables: Monte Carlo for the picture, and exact formulas for its mean, spread and P(N < x).
import { wfRng } from './wrightfisher.ts';

export type Factor = { key: string; label: string; unit: string; max?: number };
export const FACTORS: Factor[] = [
  { key: 'R', label: 'R*: new stars per year in the galaxy', unit: 'per year' },
  { key: 'fp', label: 'fp: share of stars with planets', unit: 'fraction', max: 1 },
  { key: 'ne', label: 'ne: habitable planets per planetary system', unit: 'per system' },
  { key: 'fl', label: 'fl: share of those where life starts', unit: 'fraction', max: 1 },
  { key: 'fi', label: 'fi: share of life that becomes intelligent', unit: 'fraction', max: 1 },
  { key: 'fc', label: 'fc: share that sends detectable signals', unit: 'fraction', max: 1 },
  { key: 'L', label: 'L: years a civilisation keeps signalling', unit: 'years' },
];
export type Range = { lo: number; hi: number };

/** N at the middle of every range on a log scale (the geometric mean of low and high). */
export const pointN = (r: Range[]) => r.reduce((p, f) => p * Math.sqrt(f.lo * f.hi), 1);

/** Exact mean and variance of log10 N, and each factor's share of that variance. */
export function logMoments(r: Range[]) {
  const w = r.map((f) => Math.log10(f.hi) - Math.log10(f.lo)), v = w.map((x) => (x * x) / 12), V = v.reduce((a, b) => a + b, 0);
  return { mean: r.reduce((s, f) => s + (Math.log10(f.lo) + Math.log10(f.hi)) / 2, 0), var: V, share: v.map((x) => (V > 0 ? x / V : 0)) };
}

/**
 * Exact P(log10 N ≤ x): the distribution of a sum of independent uniforms on [aᵢ, aᵢ + wᵢ],
 * (1 / (m! Π wᵢ)) Σ over subsets S (−1)^|S| (x − Σa − Σ_S w)₊^m. Factors with no range are constants.
 * Fine for the seven Drake factors unless a width is tiny next to the others (then use the Monte Carlo).
 */
export function exactCdf(r: Range[], x: number) {
  let shift = 0; const w: number[] = [];
  for (const f of r) { const a = Math.log10(f.lo), d = Math.log10(f.hi) - a; shift += a; if (d > 1e-9) w.push(d); }
  const y = x - shift, m = w.length;
  if (m === 0) return y >= 0 ? 1 : 0;
  if (y <= 0) return 0;
  if (y >= w.reduce((a, b) => a + b, 0)) return 1;
  let s = 0, fact = 1, prod = 1;
  for (let i = 2; i <= m; i++) fact *= i;
  for (const d of w) prod *= d;
  for (let mask = 0; mask < 1 << m; mask++) {
    let t = y, bits = 0;
    for (let i = 0; i < m; i++) if (mask & (1 << i)) { t -= w[i]; bits++; }
    if (t > 0) s += (bits & 1 ? -1 : 1) * t ** m;
  }
  return Math.min(1, Math.max(0, s / (fact * prod)));
}

/** Monte Carlo: `n` draws of log10 N, sorted, with the same draws for the same seed. */
export function sampleLogN(r: Range[], n: number, seed: number) {
  const u = wfRng(seed), a = r.map((f) => Math.log10(f.lo)), w = r.map((f) => Math.log10(f.hi) - Math.log10(f.lo));
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < a.length; j++) s += a[j] + w[j] * u(); out[i] = s; }
  return out.sort();
}

/** Quantile of sorted values (linear between order statistics, as numpy's default). */
export function quantile(sorted: ArrayLike<number>, p: number) {
  const h = (sorted.length - 1) * p, lo = Math.floor(h), hi = Math.ceil(h);
  return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo]);
}

/** Share of sorted values below x. */
export function shareBelow(sorted: ArrayLike<number>, x: number) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] < x) lo = m + 1; else hi = m; }
  return lo / sorted.length;
}

/** Illustrative ranges only: made up for teaching, not taken from any published estimate. */
export const PRESETS: Record<string, { name: string; ranges: [number, number][] }> = {
  wide: { name: 'Very uncertain (illustrative)', ranges: [[1, 10], [0.2, 1], [0.01, 1], [1e-6, 1], [1e-4, 1], [0.01, 1], [100, 1e7]] },
  hopeful: { name: 'Hopeful (illustrative)', ranges: [[2, 10], [0.5, 1], [0.2, 1], [0.1, 1], [0.05, 1], [0.1, 1], [1e3, 1e6]] },
  cautious: { name: 'Cautious (illustrative)', ranges: [[1, 3], [0.2, 0.8], [0.01, 0.3], [1e-9, 0.01], [1e-5, 0.01], [0.01, 0.2], [100, 1e4]] },
};
