// Sample size and power: t tests (exact, with the noncentral t, as R's power.t.test), two
// proportions (normal approximation, as R's power.prop.test) and survey margins of error.
import { normCdf, normInv, tInv, logGamma } from './stats.ts';

/**
 * P(T' > c) for a noncentral t with df degrees of freedom and noncentrality ncp. T' = (Z + ncp) / S
 * with S = sqrt(V/df), V chi-square: integrate P(Z > c·s − ncp) over the density of S (Simpson's rule).
 */
export function nctUpper(c: number, df: number, ncp: number): number {
  const sd = 1 / Math.sqrt(2 * df), lo = Math.max(0, 1 - 14 * sd), hi = 1 + 14 * sd + (df < 4 ? 30 : 0);
  // log density of S: f(s) = 2 df s · chi2pdf(df s²)
  const k = df / 2, lnC = Math.log(2 * df) - k * Math.LN2 - logGamma(k);
  const dens = (s: number) => (s <= 0 ? 0 : Math.exp(lnC + Math.log(s) + (k - 1) * Math.log(df * s * s) - (df * s * s) / 2));
  const N = 4000, h = (hi - lo) / N;
  let sum = 0;
  for (let i = 0; i <= N; i++) {
    const s = lo + i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
    sum += w * dens(s) * (1 - normCdf(c * s - ncp));
  }
  return (sum * h) / 3;
}

export type TDesign = 'two-sample' | 'paired' | 'one-sample';
/** Power of a two-sided t test at level alpha, effect size d (difference / SD), n per group (or pairs). */
export function powerT(n: number, d: number, alpha = 0.05, design: TDesign = 'two-sample'): number {
  if (!(n >= 2) || !(d > 0)) return NaN;
  const df = design === 'two-sample' ? 2 * (n - 1) : n - 1;
  const ncp = design === 'two-sample' ? d * Math.sqrt(n / 2) : d * Math.sqrt(n);
  const c = tInv(1 - alpha / 2, df);
  return nctUpper(c, df, ncp);
}

/** Power of a two-sided test of two proportions, n per group (R power.prop.test). */
export function powerProp(n: number, p1: number, p2: number, alpha = 0.05): number {
  if (!(n > 0) || !(p1 > 0 && p1 < 1 && p2 > 0 && p2 < 1) || p1 === p2) return NaN;
  const q = normInv(1 - alpha / 2), q1 = 1 - p1, q2 = 1 - p2;
  return normCdf((Math.sqrt(n) * Math.abs(p1 - p2) - q * Math.sqrt(((p1 + p2) * (q1 + q2)) / 2)) / Math.sqrt(p1 * q1 + p2 * q2));
}

/** Smallest (continuous) n with power(n) ≥ target, by bisection; NaN if not reachable below 1e7. */
export function solveN(power: (n: number) => number, target: number, nMin = 2): number {
  let lo = nMin, hi = nMin * 2;
  if (power(lo) >= target) return lo;
  while (power(hi) < target) { hi *= 2; if (hi > 1e7) return NaN; }
  for (let i = 0; i < 100 && hi - lo > 1e-7 * hi; i++) { const m = (lo + hi) / 2; if (power(m) < target) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Survey sample size for margin of error E at confidence conf, expected proportion p, population N (Infinity if large). */
export function surveyN(E: number, conf = 0.95, p = 0.5, N = Infinity): number {
  const z = normInv(1 - (1 - conf) / 2), n0 = (z * z * p * (1 - p)) / (E * E);
  return Number.isFinite(N) ? n0 / (1 + (n0 - 1) / N) : n0;
}
/** Margin of error of a survey of n from a population N. */
export function surveyMargin(n: number, conf = 0.95, p = 0.5, N = Infinity): number {
  const z = normInv(1 - (1 - conf) / 2), fpc = Number.isFinite(N) ? Math.sqrt((N - n) / (N - 1)) : 1;
  return z * Math.sqrt((p * (1 - p)) / n) * fpc;
}
