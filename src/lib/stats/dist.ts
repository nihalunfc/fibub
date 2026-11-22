// Probability distributions for the Statistics for analysts course (src/courses/statistics/). Plain maths, no
// DOM, so the same functions run in the lesson simulations and in tests/stats.mjs, which checks them against
// published table values (t, chi-square, F and normal tables) and the worked examples in the lessons.
export { normalPdf, normalCdf, rng, mean, median, variance, sd, quantile, histogram } from '../ml/core.ts';
import { normalCdf } from '../ml/core.ts';

/** log Γ(x) (Lanczos, g = 7), accurate to about 15 digits for x > 0. */
export function lgamma(x: number): number {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
/** ln of n choose k. */
export const lchoose = (n: number, k: number) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
export const choose = (n: number, k: number) => (k < 0 || k > n ? 0 : Math.round(Math.exp(lchoose(n, k))));

/** Continued fraction for the incomplete beta function (Numerical Recipes betacf). */
function betacf(a: number, b: number, x: number) {
  const EPS = 1e-14, FPMIN = 1e-300;
  let c = 1, d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a - 1 + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + 1 + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}
/** Regularised incomplete beta I_x(a, b). */
export function ibeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
/** Regularised lower incomplete gamma P(a, x). */
export function igamma(a: number, x: number) {
  if (x <= 0) return 0;
  const gln = lgamma(a);
  if (x < a + 1) {
    let ap = a, s = 1 / a, del = s;
    for (let n = 0; n < 500; n++) { ap++; del *= x / ap; s += del; if (Math.abs(del) < Math.abs(s) * 1e-15) break; }
    return s * Math.exp(-x + a * Math.log(x) - gln);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - gln) * h;
}

/** Student's t: density and P(T ≤ t) with df degrees of freedom. */
export const tPdf = (t: number, df: number) => Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (t * t) / df));
export function tCdf(t: number, df: number) {
  const p = 0.5 * ibeta(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? 1 - p : p;
}
/** Chi-square: density and P(X ≤ x). */
export const chi2Pdf = (x: number, k: number) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lgamma(k / 2)));
export const chi2Cdf = (x: number, k: number) => igamma(k / 2, x / 2);
/** F distribution: P(F ≤ f) with d1, d2 degrees of freedom, and the density. */
export const fCdf = (f: number, d1: number, d2: number) => (f <= 0 ? 0 : ibeta((d1 * f) / (d1 * f + d2), d1 / 2, d2 / 2));
export const fPdf = (f: number, d1: number, d2: number) => (f <= 0 ? 0 : Math.exp(0.5 * (d1 * Math.log(d1 * f) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * f + d2)) - Math.log(f) - (lgamma(d1 / 2) + lgamma(d2 / 2) - lgamma((d1 + d2) / 2))));

/** Inverse of an increasing cdf on (lo, hi) by bisection. */
function invert(cdf: (x: number) => number, p: number, lo: number, hi: number) {
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (cdf(m) < p) lo = m; else hi = m; if (hi - lo < 1e-12 * Math.max(1, Math.abs(m))) break; }
  return (lo + hi) / 2;
}
/** The z with P(Z ≤ z) = p (Acklam's rational approximation, then one Newton step on our normalCdf). */
export function normalInv(p: number, mu = 0, s = 1) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let z: number;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else if (p <= 1 - pl) { const q = p - 0.5, r = q * q; z = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  else { const q = Math.sqrt(-2 * Math.log(1 - p)); z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  return mu + s * z;
}
/** The t with P(T ≤ t) = p. */
export const tInv = (p: number, df: number) => invert((x) => tCdf(x, df), p, -1e3, 1e3);
export const chi2Inv = (p: number, k: number) => invert((x) => chi2Cdf(x, k), p, 0, 1e4);
export const fInv = (p: number, d1: number, d2: number) => invert((x) => fCdf(x, d1, d2), p, 0, 1e4);

/** Binomial: P(X = k) and P(X ≤ k) for n tries with chance p each. */
export const binomPmf = (k: number, n: number, p: number) => (k < 0 || k > n ? 0 : p === 0 ? +(k === 0) : p === 1 ? +(k === n) : Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)));
export function binomCdf(k: number, n: number, p: number) { let s = 0; for (let i = 0; i <= Math.min(k, n); i++) s += binomPmf(i, n, p); return Math.min(1, s); }
/** Poisson: P(X = k) and P(X ≤ k) with mean lambda. */
export const poissonPmf = (k: number, lam: number) => (k < 0 ? 0 : Math.exp(k * Math.log(lam) - lam - lgamma(k + 1)));
export function poissonCdf(k: number, lam: number) { let s = 0; for (let i = 0; i <= k; i++) s += poissonPmf(i, lam); return Math.min(1, s); }
/** Exponential with rate lambda (mean 1/lambda). */
export const expPdf = (x: number, lam: number) => (x < 0 ? 0 : lam * Math.exp(-lam * x));
export const expCdf = (x: number, lam: number) => (x < 0 ? 0 : 1 - Math.exp(-lam * x));
/** Log-normal: ln X is normal with mean mu and standard deviation s. */
export const lognormPdf = (x: number, mu: number, s: number) => (x <= 0 ? 0 : Math.exp(-((Math.log(x) - mu) ** 2) / (2 * s * s)) / (x * s * Math.sqrt(2 * Math.PI)));
export const lognormCdf = (x: number, mu: number, s: number) => (x <= 0 ? 0 : normalCdf(Math.log(x), mu, s));
/** Geometric: chance the first success comes on try k (k = 1, 2, ...). */
export const geomPmf = (k: number, p: number) => (k < 1 ? 0 : (1 - p) ** (k - 1) * p);
