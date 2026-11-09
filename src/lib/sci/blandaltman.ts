// Bland-Altman agreement between two measurement methods, plus Lin's concordance correlation coefficient.
// Methods: Bland and Altman (1986, Lancet; 1999, Stat Methods Med Res), exact limits by the noncentral t
// (Carkeet 2015, Optom Vis Sci), Lin (1989, Biometrics; corrigendum 2000) for the CCC and its z-transform interval.
import { mean, normInv, tInv, tTwoSided } from './stats.ts';
import { quantileCiExact } from './nct.ts';

export type BaScale = 'diff' | 'percent' | 'ratio';
export type BaCi = 'exact' | 'approx';
export type BaX = 'mean' | 'b';

export type BlandAltman = {
  n: number; scale: BaScale; ciMethod: BaCi; conf: number; loaLevel: number; z: number;
  /** Per pair: the x position on the plot and the difference on the analysis scale (ln ratio for 'ratio'). */
  x: number[]; d: number[];
  bias: number; sd: number; lower: number; upper: number;
  biasCi: [number, number]; lowerCi: [number, number]; upperCi: [number, number];
  /** Proportional bias: least squares line of the difference on the x value. */
  slope: number; intercept: number; slopeSe: number; slopeCi: [number, number]; slopeP: number; r2: number;
  outside: number;
  /** For 'ratio' every number above is on the log scale; `back` turns one into a ratio. */
  back: (v: number) => number;
};

/** Differences and the plot's x values, on the chosen scale. Throws a plain message on bad input. */
export function blandAltman(a: number[], b: number[], opt: { scale?: BaScale; ci?: BaCi; conf?: number; loa?: number; x?: BaX } = {}): BlandAltman {
  const scale = opt.scale ?? 'diff', ciMethod = opt.ci ?? 'exact', conf = opt.conf ?? 0.95, loaLevel = opt.loa ?? 0.95, xs = opt.x ?? 'mean';
  if (a.length !== b.length) throw new Error('Both methods need the same number of results.');
  const n = a.length;
  if (n < 3) throw new Error('Give at least 3 pairs of results (30 or more is better).');
  if (scale === 'ratio' && a.some((v, i) => !(v > 0 && b[i] > 0))) throw new Error('The ratio (log) scale needs every result above zero.');
  const x = a.map((v, i) => (xs === 'b' ? b[i] : (v + b[i]) / 2));
  if (scale === 'percent' && a.some((v, i) => (v + b[i]) / 2 === 0)) throw new Error('The percentage scale divides by the mean of each pair, so no pair may average zero.');
  const d = a.map((v, i) => (scale === 'diff' ? v - b[i] : scale === 'percent' ? (100 * (v - b[i])) / ((v + b[i]) / 2) : Math.log(v / b[i])));
  const bias = mean(d);
  const sd = Math.sqrt(d.reduce((s, v) => s + (v - bias) ** 2, 0) / (n - 1));
  const z = normInv(1 - (1 - loaLevel) / 2), t = tInv(1 - (1 - conf) / 2, n - 1);
  const lower = bias - z * sd, upper = bias + z * sd;
  const seBias = sd / Math.sqrt(n);
  const biasCi: [number, number] = [bias - t * seBias, bias + t * seBias];
  let lowerCi: [number, number], upperCi: [number, number];
  if (ciMethod === 'approx') {
    // Bland and Altman (1999): var(limit) is about (1/n + z^2 / (2(n - 1))) s^2.
    const se = sd * Math.sqrt(1 / n + (z * z) / (2 * (n - 1)));
    lowerCi = [lower - t * se, lower + t * se]; upperCi = [upper - t * se, upper + t * se];
  } else if (sd > 0) {
    upperCi = quantileCiExact(bias, sd, n, z, conf);
    const u = quantileCiExact(-bias, sd, n, z, conf);
    lowerCi = [-u[1], -u[0]];
  } else { lowerCi = [lower, lower]; upperCi = [upper, upper]; }
  // Regression of the difference on x (proportional bias).
  const mx = mean(x);
  const sxx = x.reduce((s, v) => s + (v - mx) ** 2, 0), sxy = x.reduce((s, v, i) => s + (v - mx) * (d[i] - bias), 0);
  const slope = sxx > 0 ? sxy / sxx : NaN, intercept = bias - slope * mx;
  const sse = d.reduce((s, v, i) => s + (v - intercept - slope * x[i]) ** 2, 0), syy = d.reduce((s, v) => s + (v - bias) ** 2, 0);
  const slopeSe = n > 2 && sxx > 0 ? Math.sqrt(sse / (n - 2) / sxx) : NaN;
  const t2 = tInv(1 - (1 - conf) / 2, n - 2);
  const slopeP = slopeSe > 0 ? tTwoSided(slope / slopeSe, n - 2) : slopeSe === 0 && slope !== 0 ? 0 : 1;
  const r2 = syy > 0 ? 1 - sse / syy : 0;
  const outside = d.filter((v) => v < lower - 1e-12 * Math.abs(lower) || v > upper + 1e-12 * Math.abs(upper)).length;
  return {
    n, scale, ciMethod, conf, loaLevel, z, x, d, bias, sd, lower, upper, biasCi, lowerCi, upperCi,
    slope, intercept, slopeSe, slopeCi: [slope - t2 * slopeSe, slope + t2 * slopeSe], slopeP, r2, outside,
    back: scale === 'ratio' ? Math.exp : (v: number) => v,
  };
}

export type Ccc = { ccc: number; ci: [number, number]; r: number; cb: number; shift: number; scaleShift: number };

/** Lin's concordance correlation coefficient with its interval from Fisher's z transform (as R's DescTools::CCC). */
export function lin(a: number[], b: number[], conf = 0.95): Ccc {
  const n = a.length;
  const ma = mean(a), mb = mean(b);
  const saa = a.reduce((s, v) => s + (v - ma) ** 2, 0) / n, sbb = b.reduce((s, v) => s + (v - mb) ** 2, 0) / n;
  const sab = a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0) / n;
  const ccc = (2 * sab) / (saa + sbb + (ma - mb) ** 2);
  const r = sab / Math.sqrt(saa * sbb);
  const shift = (ma - mb) / Math.sqrt(Math.sqrt(saa * sbb)), scaleShift = Math.sqrt(saa) / Math.sqrt(sbb);
  const p = ccc, u = shift;
  const varZ = (1 / (n - 2)) * (((1 - r * r) * p * p) / ((1 - p * p) * r * r) + (2 * p ** 3 * (1 - p) * u * u) / (r * (1 - p * p) ** 2) - (p ** 4 * u ** 4) / (2 * r * r * (1 - p * p) ** 2));
  const zc = Math.atanh(p), k = normInv(1 - (1 - conf) / 2) * Math.sqrt(varZ);
  const ci: [number, number] = n > 2 && varZ > 0 && Math.abs(p) < 1 ? [Math.tanh(zc - k), Math.tanh(zc + k)] : [NaN, NaN];
  return { ccc, ci, r, cb: ccc / r, shift, scaleShift };
}
