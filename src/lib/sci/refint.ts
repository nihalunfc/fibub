// Reference intervals from local data: CLSI EP28-A3c nonparametric rank method with rank-based 90 % CIs, the
// parametric (Gaussian) method on raw, log or Box-Cox transformed data with exact CIs of the limits, Tukey and
// Dixon (Reed) outlier screens, and the Harris-Boyd test for whether two subgroups need separate intervals.
// Sources: CLSI EP28-A3c (2008/2010); Reed AH, Henry RJ, Mason WB (1971) Clin Chem 17:275; Horn PS et al (1998)
// Clin Chem 44:622; Harris EK, Boyd JC (1990) Clin Chem 36:265; Box GEP, Cox DR (1964) JRSS B 26:211.
import { ibeta, mean, normInv, quantileSorted, sd } from './stats.ts';
import { quantileCiExact } from './nct.ts';

/** Binomial P(B <= k) for B ~ Bin(n, p). */
export function binomCdf(k: number, n: number, p: number): number {
  if (k < 0) return 0;
  if (k >= n) return 1;
  return ibeta(1 - p, n - k, k + 1);
}

/** CLSI rank percentile: rank r = p(n + 1), interpolated between order statistics (as R type 6 / numpy 'weibull'). NaN when r is outside 1..n. */
export function rankPercentile(sorted: number[], p: number): number {
  const n = sorted.length, r = p * (n + 1);
  if (r < 1 - 1e-12 || r > n + 1e-12) return NaN;
  const i = Math.floor(r + 1e-12), f = r - i;
  return i >= n ? sorted[n - 1] : sorted[i - 1] + f * (sorted[i] - sorted[i - 1]);
}

/**
 * Ranks (1-based) of the order statistics that bound a conf-level CI of the p-quantile: the largest r with
 * P(B <= r - 1) <= (1 - conf)/2 and the smallest s with P(B <= s - 1) >= 1 - (1 - conf)/2, B ~ Bin(n, p).
 * Null when n is too small for such an interval.
 */
export function rankCi(n: number, p: number, conf = 0.9): [number, number] | null {
  const a = (1 - conf) / 2;
  let r = 0;
  for (let k = 1; k <= n; k++) { if (binomCdf(k - 1, n, p) <= a) r = k; else break; }
  let s = 0;
  for (let k = 1; k <= n; k++) if (binomCdf(k - 1, n, p) >= 1 - a) { s = k; break; }
  if (r < 1 || s < 1 || s > n) return null;
  return [r, s];
}

export type Transform = 'none' | 'log' | 'boxcox';
/** Box-Cox log-likelihood (as scipy.stats.boxcox_llf). */
export function boxcoxLlf(x: number[], lambda: number): number {
  const n = x.length, y = x.map((v) => bc(v, lambda)), m = mean(y);
  const v = y.reduce((s, t) => s + (t - m) ** 2, 0) / n;
  return -(n / 2) * Math.log(v) + (lambda - 1) * x.reduce((s, t) => s + Math.log(t), 0);
}
export const bc = (x: number, l: number) => (Math.abs(l) < 1e-12 ? Math.log(x) : (x ** l - 1) / l);
export const bcInv = (y: number, l: number) => { if (Math.abs(l) < 1e-12) return Math.exp(y); const b = l * y + 1; return b > 0 ? b ** (1 / l) : NaN; };
/** Lambda maximising the Box-Cox likelihood, by golden-section search on [-5, 5]. */
export function boxcoxLambda(x: number[]): number {
  let a = -5, b = 5;
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a), d = a + g * (b - a), fc = boxcoxLlf(x, c), fd = boxcoxLlf(x, d);
  for (let i = 0; i < 200 && b - a > 1e-10; i++) {
    if (fc > fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = boxcoxLlf(x, c); }
    else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = boxcoxLlf(x, d); }
  }
  return (a + b) / 2;
}

/** Tukey fences on the analysis scale: values below Q1 - k IQR or above Q3 + k IQR (quartiles by R type 7). */
export function tukey(values: number[], k = 1.5): { lo: number; hi: number; flagged: number[] } {
  const s = [...values].sort((a, b) => a - b);
  const q1 = quantileSorted(s, 0.25), q3 = quantileSorted(s, 0.75), iqr = q3 - q1;
  const lo = q1 - k * iqr, hi = q3 + k * iqr;
  return { lo, hi, flagged: values.map((v, i) => (v < lo || v > hi ? i : -1)).filter((i) => i >= 0) };
}

/** Dixon's rule as used by Reed et al: an extreme value is an outlier when its gap to the next value is over 1/3 of the range. Repeated until none is found. Returns indexes. */
export function dixon(values: number[]): number[] {
  const idx = values.map((v, i) => i).sort((a, b) => values[a] - values[b]);
  const out: number[] = [];
  while (idx.length >= 3) {
    const lo = values[idx[0]], hi = values[idx[idx.length - 1]], R = hi - lo;
    if (!(R > 0)) break;
    const dLo = values[idx[1]] - lo, dHi = hi - values[idx[idx.length - 2]];
    if (dHi / R > 1 / 3 && dHi >= dLo) out.push(idx.pop()!);
    else if (dLo / R > 1 / 3) out.push(idx.shift()!);
    else break;
  }
  return out;
}

export type RefInterval = {
  n: number; coverage: number; ciConf: number;
  nonpar: { lower: number; upper: number; lowerCi: [number, number] | null; upperCi: [number, number] | null; ranks: [number, number] | null } | null;
  par: { transform: Transform; lambda: number; mean: number; sd: number; lower: number; upper: number; lowerCi: [number, number]; upperCi: [number, number] };
  skew: number; kurt: number;
};

/** Sample skewness (adjusted Fisher-Pearson, as Excel SKEW) and excess kurtosis (as Excel KURT). */
export function shape(x: number[]): { skew: number; kurt: number } {
  const n = x.length, m = mean(x), s = sd(x);
  const m3 = x.reduce((a, v) => a + ((v - m) / s) ** 3, 0), m4 = x.reduce((a, v) => a + ((v - m) / s) ** 4, 0);
  const skew = n > 2 ? (n / ((n - 1) * (n - 2))) * m3 : NaN;
  const kurt = n > 3 ? ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * m4 - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3)) : NaN;
  return { skew, kurt };
}

export function referenceInterval(values: number[], opt: { coverage?: number; ciConf?: number; transform?: Transform; lambda?: number } = {}): RefInterval {
  const coverage = opt.coverage ?? 0.95, ciConf = opt.ciConf ?? 0.9, tr = opt.transform ?? 'none';
  const n = values.length;
  if (n < 10) throw new Error('Give at least 10 results (CLSI asks for 120 for the nonparametric method).');
  if (tr !== 'none' && values.some((v) => !(v > 0))) throw new Error('Log and Box-Cox transforms need every result above zero.');
  const s = [...values].sort((a, b) => a - b), pl = (1 - coverage) / 2, pu = 1 - pl;
  let nonpar: RefInterval['nonpar'] = null;
  const lower = rankPercentile(s, pl), upper = rankPercentile(s, pu);
  if (Number.isFinite(lower) && Number.isFinite(upper)) {
    const ranks = rankCi(n, pl, ciConf);
    nonpar = {
      lower, upper, ranks,
      lowerCi: ranks ? [s[ranks[0] - 1], s[ranks[1] - 1]] : null,
      upperCi: ranks ? [s[n - ranks[1]], s[n - ranks[0]]] : null,
    };
  }
  const lambda = tr === 'boxcox' ? (opt.lambda ?? boxcoxLambda(values)) : tr === 'log' ? 0 : 1;
  const fwd = (v: number) => (tr === 'none' ? v : bc(v, lambda)), back = (v: number) => (tr === 'none' ? v : bcInv(v, lambda));
  const y = values.map(fwd), m = mean(y), sdv = sd(y), z = normInv(pu);
  const lc = quantileCiExact(-m, sdv, n, z, ciConf), uc = quantileCiExact(m, sdv, n, z, ciConf);
  const par = {
    transform: tr, lambda, mean: m, sd: sdv, lower: back(m - z * sdv), upper: back(m + z * sdv),
    lowerCi: [back(-lc[1]), back(-lc[0])] as [number, number], upperCi: [back(uc[0]), back(uc[1])] as [number, number],
  };
  return { n, coverage, ciConf, nonpar, par, ...shape(y) };
}

/** Harris and Boyd (1990): do two subgroups need separate reference intervals? */
export function harrisBoyd(a: number[], b: number[]) {
  const n1 = a.length, n2 = b.length, m1 = mean(a), m2 = mean(b), s1 = sd(a), s2 = sd(b);
  const z = Math.abs(m1 - m2) / Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2);
  const zStar = 3 * Math.sqrt((n1 + n2) / 2 / 120);
  const sdRatio = Math.max(s1, s2) / Math.min(s1, s2);
  return { n1, n2, m1, m2, s1, s2, z, zStar, sdRatio, partition: z > zStar || sdRatio > 1.5 };
}
