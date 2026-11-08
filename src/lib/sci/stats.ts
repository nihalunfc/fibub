// Small, dependable statistics helpers for the science tools: distributions, quantiles and
// summaries. Plain functions, no DOM, so they run in tests, pages and workers alike.
// Methods: Lanczos log-gamma, continued-fraction incomplete beta (Numerical Recipes, 3rd ed.,
// section 6.4), Acklam's normal quantile refined by one Halley step.

const LANCZOS = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
export function logGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - logGamma(1 - x);
  x -= 1;
  let a = 0.99999999999980993;
  const t = x + 7.5;
  for (let i = 0; i < 8; i++) a += LANCZOS[i] / (x + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function betacf(a: number, b: number, x: number) {
  const FPMIN = 1e-300, EPS = 1e-15;
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
/** Regularised incomplete beta function I_x(a, b). */
export function ibeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** Student's t cumulative distribution P(T <= t) with df degrees of freedom. */
export function tCdf(t: number, df: number): number {
  const p = 0.5 * ibeta(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? 1 - p : p;
}
/** Two-sided p-value for a t statistic. */
export const tTwoSided = (t: number, df: number) => ibeta(df / (df + t * t), df / 2, 0.5);

/** Standard normal cumulative distribution. */
export const normCdf = (z: number) => 0.5 * erfc(-z / Math.SQRT2);
/** Complementary error function: a Maclaurin series below 2 (machine precision), Numerical Recipes' erfcc above (relative error under 1.2e-7). */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  let r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  if (z < 2) {
    // Maclaurin series for erf is accurate to machine precision here.
    let sum = z, term = z;
    for (let n = 1; n < 60; n++) { term *= (-z * z) / n; const add = term / (2 * n + 1); sum += add; if (Math.abs(add) < 1e-17) break; }
    r = 1 - (2 / Math.sqrt(Math.PI)) * sum;
  }
  return x >= 0 ? r : 2 - r;
}

/** Inverse of the standard normal CDF (Acklam, refined by one Halley step). */
export function normInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let x: number;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else if (p > 1 - pl) { const q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else { const q = p - 0.5, r = q * q; x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  const e = normCdf(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

/** Quantile of Student's t: the t with P(T <= t) = p. */
export function tInv(p: number, df: number): number {
  if (!(df > 0)) return NaN;
  if (df > 1e7) return normInv(p);
  if (p === 0.5) return 0;
  // Bracket and bisect on the CDF (monotone), then polish with Newton steps.
  let lo = -1, hi = 1;
  while (tCdf(lo, df) > p) lo *= 2;
  while (tCdf(hi, df) < p) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-13 * Math.max(1, Math.abs(hi)); i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
export function sd(a: number[]) {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
}
/** Quantile of sorted data, linear interpolation between order statistics (type 7, the default in R and Excel). */
export function quantileSorted(s: ArrayLike<number>, p: number) {
  const n = s.length;
  if (!n) return NaN;
  const h = (n - 1) * p, i = Math.floor(h);
  return i + 1 < n ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[n - 1];
}

/** F distribution P(F <= x) with d1 and d2 degrees of freedom. */
export function fCdf(x: number, d1: number, d2: number): number {
  if (!(x > 0)) return 0;
  return ibeta((d1 * x) / (d1 * x + d2), d1 / 2, d2 / 2);
}
/** Quantile of the F distribution, by bisection on log x. */
export function fInv(p: number, d1: number, d2: number): number {
  if (!(d1 > 0 && d2 > 0) || !(p > 0 && p < 1)) return NaN;
  let lo = 1e-12, hi = 1;
  while (fCdf(hi, d1, d2) < p && hi < 1e12) hi *= 2;
  for (let i = 0; i < 200 && hi / lo > 1 + 1e-13; i++) {
    const mid = Math.sqrt(lo * hi);
    if (fCdf(mid, d1, d2) < p) lo = mid; else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
/** Upper tail P(F > x). */
export const fSf = (x: number, d1: number, d2: number) => (x > 0 ? ibeta(d2 / (d2 + d1 * x), d2 / 2, d1 / 2) : 1);
