// Molecular clock: distances with their sampling variance (p, Jukes-Cantor, Kimura 2-parameter; Kimura 1980,
// Nei and Kumar 2000), divergence time T = d / 2r or rate r = d / 2T with first-order error propagation, and
// Tajima's (1993) relative rate test for two sequences and an outgroup. Plain TypeScript, no DOM.
import { countPair, type Model } from './treebuild.ts';
import { erfc } from './stats.ts';

export type Dist = { d: number; se: number; p: number; sites: number; diff: number; ts: number; tv: number };

/** Distance and its standard error from site counts. NaN when the correction is undefined. */
export function distWithSE(sites: number, ts: number, tv: number, model: Model): Dist {
  const diff = ts + tv, p = diff / sites, P = ts / sites, Q = tv / sites, base = { p, sites, diff, ts, tv };
  if (!(sites > 0)) return { d: NaN, se: NaN, ...base };
  if (model === 'p') return { d: p, se: Math.sqrt((p * (1 - p)) / sites), ...base };
  if (model === 'jc') {
    const x = 1 - (4 * p) / 3;
    if (!(x > 0)) return { d: NaN, se: NaN, ...base };
    return { d: -0.75 * Math.log(x), se: Math.sqrt((p * (1 - p)) / (sites * x * x)), ...base };
  }
  const a = 1 - 2 * P - Q, b = 1 - 2 * Q;
  if (!(a > 0 && b > 0)) return { d: NaN, se: NaN, ...base };
  const c1 = 1 / a, c2 = 1 / b, c3 = (c1 + c2) / 2;
  const v = (c1 * c1 * P + c3 * c3 * Q - (c1 * P + c3 * Q) ** 2) / sites;
  return { d: -0.5 * Math.log(a) - 0.25 * Math.log(b), se: Math.sqrt(Math.max(0, v)), ...base };
}

/** Distance between two aligned sequences (columns with a gap or N in either are skipped). */
export function seqDist(a: string, b: string, model: Model): Dist {
  const c = countPair(a, b);
  return distWithSE(c.sites, c.ts, c.tv, model);
}

export type Est = { value: number; se: number; lo: number; hi: number };
const z95 = 1.959963984540054;
/** x / y with first-order (delta-method) error propagation and a normal 95 % range (not below 0). */
export function ratio(x: number, sx: number, y: number, sy: number, k = 1): Est {
  const value = x / (k * y), rel = Math.sqrt((sx / x) ** 2 + (sy / y) ** 2), se = Math.abs(value) * rel;
  return { value, se, lo: Math.max(0, value - z95 * se), hi: value + z95 * se };
}
/** Divergence time from distance d (± sd) and rate r (± sr). perLineage: r is per lineage, so T = d / 2r;
 *  otherwise r is the pairwise divergence rate and T = d / r. */
export const divergenceTime = (d: number, sd: number, r: number, sr: number, perLineage = true) => ratio(d, sd, r, sr, perLineage ? 2 : 1);
/** Rate per lineage (or pairwise) from distance d and calibration time T. */
export const clockRate = (d: number, sd: number, T: number, sT: number, perLineage = true) => ratio(d, sd, T, sT, perLineage ? 2 : 1);

/** Upper tail of chi-square with 1 degree of freedom. */
export function chi2sf1(x: number) { return x <= 0 ? 1 : erfc(Math.sqrt(x / 2)); }
/** Tajima's relative rate test: sequences a and b, outgroup c. m1 = sites where only a differs, m2 = only b. */
export function tajima(a: string, b: string, c: string) {
  const ok = (x: string) => x === 'A' || x === 'C' || x === 'G' || x === 'T';
  let m1 = 0, m2 = 0, m3 = 0, sites = 0, other = 0;
  const L = Math.min(a.length, b.length, c.length);
  for (let i = 0; i < L; i++) {
    const x = a[i], y = b[i], z = c[i];
    if (!ok(x) || !ok(y) || !ok(z)) continue;
    sites++;
    if (x === y && y === z) continue;
    if (y === z) m1++; else if (x === z) m2++; else if (x === y) m3++; else other++;
  }
  const chi2 = m1 + m2 > 0 ? (m1 - m2) ** 2 / (m1 + m2) : 0;
  return { m1, m2, m3, other, sites, chi2, p: chi2sf1(chi2) };
}
