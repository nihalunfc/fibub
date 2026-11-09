// Shared statistics for the epidemiology tools: confidence intervals for proportions and Poisson counts,
// the chi-square distribution, Fisher's exact test and exact (conditional) odds ratio intervals.
// Plain functions, no DOM.
// Methods: incomplete gamma by series and continued fraction (Numerical Recipes, 3rd ed., section 6.2);
// Clopper and Pearson (1934); Wilson (1927); Garwood (1936) exact Poisson limits; Fisher (1935) exact test
// with the two-sided p as the sum of tables no more likely than the one seen (as R and SciPy do);
// conditional maximum likelihood odds ratio and exact or mid-p limits from the noncentral hypergeometric
// distribution (Cornfield 1956; Rothman, Greenland and Lash, Modern Epidemiology, 3rd ed.).
import { logGamma, ibeta, normInv, normCdf } from './stats.ts';

/** Regularised lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (!(x > 0)) return 0;
  if (!Number.isFinite(x)) return 1;
  const gln = logGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 1000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return Math.min(1, sum * Math.exp(-x + a * Math.log(x) - gln));
  }
  const FPMIN = 1e-300;
  let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.max(0, 1 - Math.exp(-x + a * Math.log(x) - gln) * h);
}
/** Upper tail Q(a, x) = 1 − P(a, x), computed directly where it is small. */
export function gammaQ(a: number, x: number): number {
  if (!(x > 0)) return 1;
  if (x < a + 1) return 1 - gammaP(a, x);
  const gln = logGamma(a), FPMIN = 1e-300;
  let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.exp(-x + a * Math.log(x) - gln) * h;
}
export const chi2Cdf = (x: number, k: number) => gammaP(k / 2, x / 2);
export const chi2Sf = (x: number, k: number) => gammaQ(k / 2, x / 2);
/** Quantile of the chi-square distribution with k (any positive) degrees of freedom. */
export function chi2Inv(p: number, k: number): number {
  if (!(k > 0)) return NaN;
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  let lo = 0, hi = Math.max(1, k);
  while (chi2Cdf(hi, k) < p) hi *= 2;
  for (let i = 0; i < 300 && hi - lo > 1e-14 * Math.max(1, hi); i++) {
    const mid = (lo + hi) / 2;
    if (chi2Cdf(mid, k) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
/** Quantile of the beta distribution, by bisection on the incomplete beta function. */
export function betaInv(p: number, a: number, b: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 200 && hi - lo > 1e-15; i++) {
    const mid = (lo + hi) / 2;
    if (ibeta(mid, a, b) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export const zFor = (conf = 0.95) => normInv(1 - (1 - conf) / 2);
export type CI = [number, number];

/** Exact (Clopper-Pearson) interval for x successes out of n. */
export function clopperPearson(x: number, n: number, conf = 0.95): CI {
  const a = (1 - conf) / 2;
  if (!(n > 0)) return [NaN, NaN];
  return [x <= 0 ? 0 : betaInv(a, x, n - x + 1), x >= n ? 1 : betaInv(1 - a, x + 1, n - x)];
}
/** Wilson score interval for x successes out of n. */
export function wilson(x: number, n: number, conf = 0.95): CI {
  if (!(n > 0)) return [NaN, NaN];
  const z = zFor(conf), p = x / n, z2 = z * z, den = 1 + z2 / n;
  const mid = (p + z2 / (2 * n)) / den, half = (z / den) * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n));
  return [Math.max(0, mid - half), Math.min(1, mid + half)];
}
export type PropMethod = 'exact' | 'wilson';
export const propCI = (x: number, n: number, m: PropMethod, conf = 0.95) => (m === 'exact' ? clopperPearson(x, n, conf) : wilson(x, n, conf));

/** Exact (Garwood) limits for a Poisson count x: [χ²(α/2, 2x)/2, χ²(1−α/2, 2x+2)/2]. */
export function poissonCI(x: number, conf = 0.95): CI {
  const a = (1 - conf) / 2;
  return [x <= 0 ? 0 : chi2Inv(a, 2 * x) / 2, chi2Inv(1 - a, 2 * x + 2) / 2];
}

/** A ratio and its interval from the standard error of its logarithm. */
export function logCI(est: number, seLog: number, conf = 0.95): CI {
  const z = zFor(conf);
  return [est * Math.exp(-z * seLog), est * Math.exp(z * seLog)];
}
/** Two-sided p from a z statistic. */
export const pFromZ = (z: number) => 2 * normCdf(-Math.abs(z));

// ---------- 2 × 2 tables: a b / c d ----------
const lchoose = (n: number, k: number) => logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);

/** The support and log probabilities of the cell a given the margins (central hypergeometric). */
function hyper(a: number, b: number, c: number, d: number) {
  const m = a + b, n = c + d, t = a + c, lo = Math.max(0, t - n), hi = Math.min(t, m);
  const xs: number[] = [], lp: number[] = [];
  for (let x = lo; x <= hi; x++) { xs.push(x); lp.push(lchoose(m, x) + lchoose(n, t - x) - lchoose(m + n, t)); }
  return { xs, lp, lo, hi };
}

/** Fisher's exact test: two-sided p (sum of tables as likely or less likely), and each one-sided p. */
export function fisherExact(a: number, b: number, c: number, d: number) {
  const { xs, lp } = hyper(a, b, c, d), i0 = xs.indexOf(a), p0 = lp[i0];
  let two = 0, less = 0, greater = 0;
  xs.forEach((x, i) => {
    const p = Math.exp(lp[i]);
    if (lp[i] <= p0 + 1e-7 * Math.abs(p0) + 1e-12) two += p;
    if (x <= a) less += p;
    if (x >= a) greater += p;
  });
  return { p: Math.min(1, two), less: Math.min(1, less), greater: Math.min(1, greater) };
}

/** Pearson's chi-square for a 2 × 2 table, with or without Yates' continuity correction. */
export function chi2x2(a: number, b: number, c: number, d: number, yates = false) {
  const n = a + b + c + d, r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d;
  if (!(r1 > 0 && r2 > 0 && c1 > 0 && c2 > 0)) return { chi2: NaN, p: NaN, minExpected: NaN };
  let diff = Math.abs(a * d - b * c);
  if (yates) diff = Math.max(0, diff - n / 2);
  const chi2 = (n * diff * diff) / (r1 * r2 * c1 * c2);
  const minExpected = Math.min(r1 * c1, r1 * c2, r2 * c1, r2 * c2) / n;
  return { chi2, p: chi2Sf(chi2, 1), minExpected };
}

/** Noncentral hypergeometric distribution of a with odds ratio psi: probabilities over the support. */
function ncProbs(xs: number[], lp: number[], psi: number) {
  const lw = xs.map((x, i) => lp[i] + x * Math.log(psi)), mx = Math.max(...lw);
  const w = lw.map((v) => Math.exp(v - mx)), s = w.reduce((t, v) => t + v, 0);
  return w.map((v) => v / s);
}
/** Find psi on a log scale where f(psi) crosses target; f must be monotone increasing in psi. */
function solveLogPsi(f: (psi: number) => number, target: number) {
  let lo = -50, hi = 50;
  for (let i = 0; i < 200 && hi - lo > 1e-12; i++) {
    const mid = (lo + hi) / 2;
    if (f(Math.exp(mid)) < target) lo = mid; else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
/**
 * Conditional maximum likelihood odds ratio (as R's fisher.test) with exact limits (each tail ≤ α/2)
 * and mid-p limits (half the probability of the observed table counted in each tail).
 */
export function exactOR(a: number, b: number, c: number, d: number, conf = 0.95) {
  const { xs, lp, lo, hi } = hyper(a, b, c, d), alpha = (1 - conf) / 2;
  const mean = (psi: number) => ncProbs(xs, lp, psi).reduce((s, p, i) => s + p * xs[i], 0);
  // P(X >= a) and P(X <= a) as functions of psi, each optionally counting half of P(X = a).
  const upper = (psi: number, mid: boolean) => { const p = ncProbs(xs, lp, psi); let s = 0; xs.forEach((x, i) => { if (x > a) s += p[i]; else if (x === a) s += mid ? p[i] / 2 : p[i]; }); return s; };
  const lower = (psi: number, mid: boolean) => { const p = ncProbs(xs, lp, psi); let s = 0; xs.forEach((x, i) => { if (x < a) s += p[i]; else if (x === a) s += mid ? p[i] / 2 : p[i]; }); return s; };
  const or = a === lo ? 0 : a === hi ? Infinity : solveLogPsi(mean, a);
  const lim = (mid: boolean): CI => [
    a === lo ? 0 : solveLogPsi((psi) => upper(psi, mid), alpha),
    a === hi ? Infinity : solveLogPsi((psi) => -lower(psi, mid), -alpha),
  ];
  // Mid-p two-sided p for OR = 1: twice the smaller one-sided mid-p.
  const midP = Math.min(1, 2 * Math.min(upper(1, true), lower(1, true)));
  return { or, exact: lim(false), midp: lim(true), midP };
}

/** Group counts and the usual measures for a 2 × 2 table, exposed (a, b) over unexposed (c, d). */
export function table2x2(a: number, b: number, c: number, d: number, conf = 0.95) {
  const n1 = a + b, n0 = c + d;
  const r1 = a / n1, r0 = c / n0, rr = r1 / r0, or = (a * d) / (b * c);
  const seLogRR = Math.sqrt(1 / a - 1 / n1 + 1 / c - 1 / n0), seLogOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
  const rd = r1 - r0, seRD = Math.sqrt((r1 * (1 - r1)) / n1 + (r0 * (1 - r0)) / n0), z = zFor(conf);
  return { r1, r0, rr, rrCI: logCI(rr, seLogRR, conf), seLogRR, or, orCI: logCI(or, seLogOR, conf), seLogOR, rd, rdCI: [rd - z * seRD, rd + z * seRD] as CI, seRD };
}

/** True when every value is a whole number of zero or more. */
export const counts = (...v: number[]) => v.every((x) => Number.isInteger(x) && x >= 0);
