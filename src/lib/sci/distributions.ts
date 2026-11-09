// Probability distributions for the distribution explorer: density or mass, cumulative and survival
// functions, quantiles, moments and seeded random samples for 35 common distributions.
// Plain TypeScript, no DOM. Methods: Catherine Loader's saddle-point forms for binomial and Poisson
// probabilities (as in R's dbinom/dpois), Numerical Recipes series and continued fractions (modified
// Lentz) for the incomplete gamma and beta functions, Gauss-Legendre quadrature for Rice and von Mises.
// Checked against scipy.stats (tests/sci-tools/distribution-explorer.mjs).
import { logGamma } from './stats.ts';

export const lgamma = logGamma;
const LN_SQRT_2PI = 0.9189385332046727, SQRT2 = Math.SQRT2, EULER = 0.5772156649015329;

// ---------- Saddle-point pieces (Loader 2000) ----------
/** stirlerr(n) = log(n!) - log(sqrt(2 pi n) (n/e)^n). */
export function stirlerr(n: number): number {
  if (n <= 15) return lgamma(n + 1) - (n + 0.5) * Math.log(n) + n - LN_SQRT_2PI;
  const nn = n * n;
  const S0 = 1 / 12, S1 = 1 / 360, S2 = 1 / 1260, S3 = 1 / 1680, S4 = 1 / 1188;
  if (n > 500) return (S0 - S1 / nn) / n;
  if (n > 80) return (S0 - (S1 - S2 / nn) / nn) / n;
  if (n > 35) return (S0 - (S1 - (S2 - S3 / nn) / nn) / nn) / n;
  return (S0 - (S1 - (S2 - (S3 - S4 / nn) / nn) / nn) / nn) / n;
}
/** bd0(x, m) = x log(x/m) + m - x, without cancellation when x is near m. */
export function bd0(x: number, m: number): number {
  if (Math.abs(x - m) < 0.1 * (x + m)) {
    let v = (x - m) / (x + m), s = (x - m) * v;
    let ej = 2 * x * v; v *= v;
    for (let j = 1; j < 1000; j++) {
      ej *= v; const s1 = s + ej / (2 * j + 1);
      if (s1 === s) return s1;
      s = s1;
    }
    return s;
  }
  return x * Math.log(x / m) + m - x;
}
/** Poisson-type density x^... : m^x e^-m / Gamma(x+1) for real x >= 0. */
export function dpoisRaw(x: number, m: number): number {
  if (m === 0) return x === 0 ? 1 : 0;
  if (!Number.isFinite(m)) return 0;
  if (x < 0) return 0;
  if (x <= m * Number.MIN_VALUE) return Math.exp(-m);
  if (m < x * Number.MIN_VALUE) return Math.exp(-m + x * Math.log(m) - lgamma(x + 1));
  return Math.exp(-stirlerr(x) - bd0(x, m)) / Math.sqrt(2 * Math.PI * x);
}
/** Binomial-type density Gamma(n+1)/(Gamma(x+1)Gamma(n-x+1)) p^x q^(n-x) for real x, n. */
export function dbinomRaw(x: number, n: number, p: number, q: number): number {
  if (p === 0) return x === 0 ? 1 : 0;
  if (q === 0) return x === n ? 1 : 0;
  if (x === 0) return n === 0 ? 1 : Math.exp(p < 0.1 ? n * Math.log1p(-p) : n * Math.log(q));
  if (x === n) return Math.exp(q < 0.1 ? n * Math.log1p(-q) : n * Math.log(p));
  if (x < 0 || x > n) return 0;
  const lc = stirlerr(n) - stirlerr(x) - stirlerr(n - x) - bd0(x, n * p) - bd0(n - x, n * q);
  const lf = Math.log(2 * Math.PI) + Math.log(x) + Math.log1p(-x / n);
  return Math.exp(lc - 0.5 * lf);
}

// ---------- Incomplete gamma and beta ----------
const TINY = 1e-300;
/** Regularised lower and upper incomplete gamma, [P(a, x), Q(a, x)], each to full relative precision. */
export function gammaPQ(a: number, x: number): [number, number] {
  if (!(x > 0)) return [0, 1];
  if (!Number.isFinite(x)) return [1, 0];
  if (x < a + 1) {
    // Series: P = x^a e^-x / Gamma(a+1) * sum x^n / ((a+1)...(a+n)).
    let term = 1, sum = 1;
    for (let n = 1; n < 1e6; n++) { term *= x / (a + n); sum += term; if (term < sum * 1e-17) break; }
    const P = dpoisRaw(a, x) * sum;
    return [P, 1 - P];
  }
  // Continued fraction for Q (modified Lentz).
  let b = x + 1 - a, c = 1 / TINY, d = 1 / b, h = d;
  for (let i = 1; i < 1e6; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < TINY) d = TINY;
    c = b + an / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  const Q = a * dpoisRaw(a, x) * h; // x^a e^-x / Gamma(a) * h
  return [1 - Q, Q];
}
function betacf(a: number, b: number, x: number): number {
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d; let h = d;
  for (let m = 1; m < 100000; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return h;
}
/** Regularised incomplete beta, [I_x(a, b), 1 - I_x(a, b)], with y = 1 - x given exactly by the caller. */
export function betaPQ(x: number, y: number, a: number, b: number): [number, number] {
  if (x <= 0) return [0, 1];
  if (y <= 0) return [1, 0];
  // x^a y^b / B(a, b), through the saddle-point binomial form so large a and b stay accurate.
  const bt = dbinomRaw(a, a + b, x, y) * (a * b) / (a + b);
  if (x < (a + 1) / (a + b + 2)) { const I = (bt * betacf(a, b, x)) / a; return [I, 1 - I]; }
  const J = (bt * betacf(b, a, y)) / b;
  return [1 - J, J];
}
export const lbeta = (a: number, b: number) => lgamma(a) + lgamma(b) - lgamma(a + b);

/** erfc to full relative precision, through Q(1/2, x^2). */
export function erfc(x: number): number {
  if (x < 0) return 2 - erfc(-x);
  if (x === 0) return 1;
  return gammaPQ(0.5, x * x)[1];
}
export const erf = (x: number) => (Math.abs(x) < 0.5 ? (x < 0 ? -1 : 1) * gammaPQ(0.5, x * x)[0] : 1 - erfc(x));
/** log(erfc(x)), also far out in the tail where erfc underflows. */
export function logErfc(x: number): number {
  if (x < 25) return Math.log(erfc(x));
  const u2 = 1 / (x * x);
  return -x * x - Math.log(x * Math.sqrt(Math.PI)) + Math.log1p(u2 * (-0.5 + u2 * (0.75 + u2 * (-1.875 + u2 * 6.5625))));
}
export const normCdf = (z: number) => 0.5 * erfc(-z / SQRT2);
export const normPdf = (z: number) => Math.exp(-0.5 * z * z - LN_SQRT_2PI);
/** Standard normal quantile: Acklam's start, polished by Halley steps on the accurate CDF. */
export function normPpf(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p > 0.5) return -normPpfLower(1 - p, p);
  return normPpfLower(p, 1 - p);
}
function normPpfLower(p: number, _q: number): number {
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  let x: number;
  if (p < 0.02425) { const q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else { const q = p - 0.5, r = q * q; x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  for (let i = 0; i < 3; i++) {
    const e = normCdf(x) - p, u = e / normPdf(x);
    if (!Number.isFinite(u)) break;
    x -= u / (1 + (x * u) / 2);
  }
  return x;
}

// ---------- Bessel I0 (exponentially scaled) and quadrature ----------
/** I0(z) e^-|z|. */
export function i0e(z: number): number {
  z = Math.abs(z);
  if (z <= 30) {
    const q = (z * z) / 4; let term = 1, sum = 1;
    for (let k = 1; k < 500; k++) { term *= q / (k * k); sum += term; if (term < sum * 1e-17) break; }
    return sum * Math.exp(-z);
  }
  let term = 1, sum = 1;
  for (let k = 1; k < 60; k++) { const next = (term * (2 * k - 1) ** 2) / (8 * k * z); if (next > term) break; term = next; sum += term; if (term < sum * 1e-17) break; }
  return sum / Math.sqrt(2 * Math.PI * z);
}
/** I1(z) e^-|z| for z >= 0 (for the circular variance of von Mises). */
export function i1e(z: number): number {
  z = Math.abs(z);
  if (z <= 30) {
    const q = (z * z) / 4; let term = z / 2, sum = term;
    for (let k = 1; k < 500; k++) { term *= q / (k * (k + 1)); sum += term; if (term < sum * 1e-17) break; }
    return sum * Math.exp(-z);
  }
  let term = 1, sum = 1;
  for (let k = 1; k < 60; k++) { const next = (-term * (4 - (2 * k - 1) ** 2)) / (8 * k * z); if (Math.abs(next) > Math.abs(term)) break; term = next; sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-17) break; }
  return sum / Math.sqrt(2 * Math.PI * z);
}
const GL = (() => {
  const n = 20, x: number[] = [], w: number[] = [];
  for (let i = 1; i <= n / 2; i++) {
    let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = (n * (z * p1 - p2)) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp;
      if (Math.abs(z - z1) < 1e-16) break;
    }
    x.push(z, -z); const wi = 2 / ((1 - z * z) * pp * pp); w.push(wi, wi);
  }
  return { x, w };
})();
/** Integral of f over [a, b] by composite 20-point Gauss-Legendre, panels at most `h` wide. */
export function integrate(f: (x: number) => number, a: number, b: number, h: number): number {
  if (!(b > a)) return 0;
  const n = Math.max(1, Math.ceil((b - a) / h)), w = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const m = a + (i + 0.5) * w, r = w / 2;
    for (let j = 0; j < GL.x.length; j++) s += GL.w[j] * f(m + r * GL.x[j]);
  }
  return (s * w) / 2;
}

// ---------- Types ----------
export type Params = Record<string, number>;
export type ParamDef = { k: string; label: string; help: string; def: number; min?: number; minOpen?: boolean; max?: number; maxOpen?: boolean; int?: boolean };
/** Mean, variance, skewness and excess kurtosis. NaN means undefined; Infinity means infinite. */
export type Moments = { mean: number; variance: number; skewness: number; kurtosis: number };
export type Dist = {
  id: string; name: string; discrete: boolean; group: 'Continuous' | 'Discrete';
  about: string; params: ParamDef[];
  /** Extra rules between parameters; returns a message or null. */
  check?: (p: Params) => string | null;
  support: (p: Params) => [number, number];
  pdf: (x: number, p: Params) => number;
  cdf: (x: number, p: Params) => number;
  sf: (x: number, p: Params) => number;
  ppf?: (q: number, p: Params) => number;
  moments: (p: Params) => Moments;
  /** Optional direct random draw from a uniform source. */
  draw?: (p: Params, u: () => number) => number;
  /** A middle point and a spread, used to bracket quantiles. */
  center: (p: Params) => number;
  scale: (p: Params) => number;
  /** The same distribution in scipy.stats, for anyone checking. */
  scipy: string;
};

const fromRaw = (m1: number, m2: number, m3: number, m4: number): Moments => {
  const v = m2 - m1 * m1, c3 = m3 - 3 * m1 * m2 + 2 * m1 ** 3, c4 = m4 - 4 * m1 * m3 + 6 * m1 * m1 * m2 - 3 * m1 ** 4;
  return { mean: m1, variance: v, skewness: c3 / v ** 1.5, kurtosis: c4 / (v * v) - 3 };
};
const NONE: Moments = { mean: NaN, variance: NaN, skewness: NaN, kurtosis: NaN };
const pos = (k: string, label: string, help: string, def: number, extra: Partial<ParamDef> = {}): ParamDef => ({ k, label, help, def, min: 0, minOpen: true, ...extra });
const real = (k: string, label: string, help: string, def: number): ParamDef => ({ k, label, help, def });
const prob = (k: string, label: string, help: string, def: number, open: [boolean, boolean] = [false, false]): ParamDef => ({ k, label, help, def, min: 0, max: 1, minOpen: open[0], maxOpen: open[1] });
const MU = real('mu', 'Location μ', 'Shifts the whole curve left or right.', 0);
const SIG = pos('sigma', 'Scale σ', 'Stretches the curve; larger is wider.', 1);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Helpers shared by several families.
const gammaCdf = (x: number, k: number, th: number) => (x <= 0 ? 0 : gammaPQ(k, x / th)[0]);
const gammaSf = (x: number, k: number, th: number) => (x <= 0 ? 1 : gammaPQ(k, x / th)[1]);
function gammaPdf(x: number, k: number, th: number): number {
  if (x < 0) return 0;
  if (x === 0) return k < 1 ? Infinity : k === 1 ? 1 / th : 0;
  return k < 1 ? (dpoisRaw(k, x / th) * k) / x : dpoisRaw(k - 1, x / th) / th;
}
function tParts(z: number, nu: number): [number, number] {
  // [P(T <= z), P(T > z)] for standard t.
  const t2 = z * z, [I] = betaPQ(nu / (nu + t2), t2 / (nu + t2), nu / 2, 0.5);
  const tail = 0.5 * I;
  return z < 0 ? [tail, 1 - tail] : [1 - tail, tail];
}

// ---------- The distributions ----------
export const DISTS: Dist[] = [
  {
    id: 'normal', name: 'Normal (Gaussian)', discrete: false, group: 'Continuous', scipy: 'norm(loc=μ, scale=σ)',
    about: 'The bell curve: sums and averages of many small effects, measurement error, heights.',
    params: [real('mu', 'Mean μ', 'The centre of the bell.', 0), pos('sigma', 'Standard deviation σ', 'The spread: about 68 % of values lie within ±σ of the mean.', 1)],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => normPdf((x - p.mu) / p.sigma) / p.sigma,
    cdf: (x, p) => normCdf((x - p.mu) / p.sigma),
    sf: (x, p) => normCdf(-(x - p.mu) / p.sigma),
    ppf: (q, p) => p.mu + p.sigma * normPpf(q),
    moments: (p) => ({ mean: p.mu, variance: p.sigma ** 2, skewness: 0, kurtosis: 0 }),
    center: (p) => p.mu, scale: (p) => p.sigma,
  },
  {
    id: 't', name: "Student's t", discrete: false, group: 'Continuous', scipy: 't(ν, loc=μ, scale=σ)',
    about: 'A bell with heavier tails: the mean of a small sample divided by its estimated standard error.',
    params: [pos('nu', 'Degrees of freedom ν', 'Usually the sample size minus one. Large ν looks normal.', 5), MU, SIG],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => { const z = (x - p.mu) / p.sigma, n = p.nu; return Math.exp(lgamma((n + 1) / 2) - lgamma(n / 2) - 0.5 * Math.log(n * Math.PI) - ((n + 1) / 2) * Math.log1p((z * z) / n)) / p.sigma; },
    cdf: (x, p) => tParts((x - p.mu) / p.sigma, p.nu)[0],
    sf: (x, p) => tParts((x - p.mu) / p.sigma, p.nu)[1],
    moments: (p) => { const n = p.nu; return { mean: n > 1 ? p.mu : NaN, variance: n > 2 ? (p.sigma ** 2 * n) / (n - 2) : n > 1 ? Infinity : NaN, skewness: n > 3 ? 0 : NaN, kurtosis: n > 4 ? 6 / (n - 4) : n > 2 ? Infinity : NaN }; },
    center: (p) => p.mu, scale: (p) => p.sigma * (p.nu > 2 ? Math.sqrt(p.nu / (p.nu - 2)) : 2),
  },
  {
    id: 'chi2', name: 'Chi-squared (χ²)', discrete: false, group: 'Continuous', scipy: 'chi2(k)',
    about: 'The sum of k squared standard normal values: variance tests, goodness of fit, contingency tables.',
    params: [pos('k', 'Degrees of freedom k', 'The number of squared normal values added up.', 3)],
    support: () => [0, Infinity],
    pdf: (x, p) => gammaPdf(x, p.k / 2, 2), cdf: (x, p) => gammaCdf(x, p.k / 2, 2), sf: (x, p) => gammaSf(x, p.k / 2, 2),
    moments: (p) => ({ mean: p.k, variance: 2 * p.k, skewness: Math.sqrt(8 / p.k), kurtosis: 12 / p.k }),
    draw: (p, u) => 2 * gammaDraw(p.k / 2, u),
    center: (p) => p.k, scale: (p) => Math.sqrt(2 * p.k),
  },
  {
    id: 'f', name: 'F (Fisher–Snedecor)', discrete: false, group: 'Continuous', scipy: 'f(d1, d2)',
    about: 'The ratio of two scaled chi-squared values: ANOVA and comparing two variances.',
    params: [pos('d1', 'Numerator df d₁', 'Degrees of freedom on top (for ANOVA, groups minus one).', 5), pos('d2', 'Denominator df d₂', 'Degrees of freedom below (for ANOVA, the residual df).', 10)],
    support: () => [0, Infinity],
    pdf: (x, p) => {
      if (x < 0) return 0;
      const a = p.d1 / 2, b = p.d2 / 2;
      if (x === 0) return a < 1 ? Infinity : a === 1 ? 1 : 0;
      const s = p.d1 * x + p.d2;
      // Beta(a, b) density at y = d1 x / s times dy/dx = y (1 - y) / x.
      return (dbinomRaw(a, a + b, (p.d1 * x) / s, p.d2 / s) * (a * b)) / (a + b) / x;
    },
    cdf: (x, p) => (x <= 0 ? 0 : betaPQ((p.d1 * x) / (p.d1 * x + p.d2), p.d2 / (p.d1 * x + p.d2), p.d1 / 2, p.d2 / 2)[0]),
    sf: (x, p) => (x <= 0 ? 1 : betaPQ((p.d1 * x) / (p.d1 * x + p.d2), p.d2 / (p.d1 * x + p.d2), p.d1 / 2, p.d2 / 2)[1]),
    moments: (p) => {
      const a = p.d1, b = p.d2;
      return {
        mean: b > 2 ? b / (b - 2) : Infinity,
        variance: b > 4 ? (2 * b * b * (a + b - 2)) / (a * (b - 2) ** 2 * (b - 4)) : b > 2 ? Infinity : NaN,
        skewness: b > 6 ? ((2 * a + b - 2) * Math.sqrt(8 * (b - 4))) / ((b - 6) * Math.sqrt(a * (a + b - 2))) : b > 4 ? Infinity : NaN,
        kurtosis: b > 8 ? (12 * (a * (5 * b - 22) * (a + b - 2) + (b - 4) * (b - 2) ** 2)) / (a * (b - 6) * (b - 8) * (a + b - 2)) : b > 4 ? Infinity : NaN,
      };
    },
    draw: (p, u) => (gammaDraw(p.d1 / 2, u) / p.d1) / (gammaDraw(p.d2 / 2, u) / p.d2),
    center: (p) => 1, scale: () => 1,
  },
  {
    id: 'beta', name: 'Beta', discrete: false, group: 'Continuous', scipy: 'beta(α, β)',
    about: 'Values between 0 and 1: proportions, probabilities, and Bayesian beliefs about a rate.',
    params: [pos('a', 'Shape α', 'Think of it as successes + 1. Larger pushes the curve to the right.', 2), pos('b', 'Shape β', 'Think of it as failures + 1. Larger pushes the curve to the left.', 5)],
    support: () => [0, 1],
    pdf: (x, p) => {
      if (x < 0 || x > 1) return 0;
      if (x === 0) return p.a < 1 ? Infinity : p.a === 1 ? p.b : 0;
      if (x === 1) return p.b < 1 ? Infinity : p.b === 1 ? p.a : 0;
      return (dbinomRaw(p.a, p.a + p.b, x, 1 - x) * (p.a * p.b)) / (p.a + p.b) / (x * (1 - x));
    },
    cdf: (x, p) => betaPQ(x, 1 - x, p.a, p.b)[0], sf: (x, p) => betaPQ(x, 1 - x, p.a, p.b)[1],
    moments: (p) => { const a = p.a, b = p.b, s = a + b; return { mean: a / s, variance: (a * b) / (s * s * (s + 1)), skewness: (2 * (b - a) * Math.sqrt(s + 1)) / ((s + 2) * Math.sqrt(a * b)), kurtosis: (6 * ((a - b) ** 2 * (s + 1) - a * b * (s + 2))) / (a * b * (s + 2) * (s + 3)) }; },
    draw: (p, u) => { const x = gammaDraw(p.a, u), y = gammaDraw(p.b, u); return x / (x + y); },
    center: (p) => p.a / (p.a + p.b), scale: (p) => Math.sqrt((p.a * p.b) / ((p.a + p.b) ** 2 * (p.a + p.b + 1))),
  },
  {
    id: 'gamma', name: 'Gamma', discrete: false, group: 'Continuous', scipy: 'gamma(k, scale=θ)',
    about: 'Waiting time for k events, rainfall amounts, insurance claims: positive and right-skewed.',
    params: [pos('k', 'Shape k', 'The number of events waited for (any positive number). Small k is very skewed.', 2), pos('theta', 'Scale θ', 'The mean time between events. Rate = 1/θ.', 2)],
    support: () => [0, Infinity],
    pdf: (x, p) => gammaPdf(x, p.k, p.theta), cdf: (x, p) => gammaCdf(x, p.k, p.theta), sf: (x, p) => gammaSf(x, p.k, p.theta),
    moments: (p) => ({ mean: p.k * p.theta, variance: p.k * p.theta ** 2, skewness: 2 / Math.sqrt(p.k), kurtosis: 6 / p.k }),
    draw: (p, u) => p.theta * gammaDraw(p.k, u),
    center: (p) => p.k * p.theta, scale: (p) => Math.sqrt(p.k) * p.theta,
  },
  {
    id: 'exponential', name: 'Exponential', discrete: false, group: 'Continuous', scipy: 'expon(scale=1/λ)',
    about: 'Time until the next event when events happen at a steady rate: radioactive decay, arrivals.',
    params: [pos('lambda', 'Rate λ', 'Events per unit time. The mean wait is 1/λ.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 ? 0 : p.lambda * Math.exp(-p.lambda * x)),
    cdf: (x, p) => (x <= 0 ? 0 : -Math.expm1(-p.lambda * x)), sf: (x, p) => (x <= 0 ? 1 : Math.exp(-p.lambda * x)),
    ppf: (q, p) => -Math.log1p(-q) / p.lambda,
    moments: (p) => ({ mean: 1 / p.lambda, variance: 1 / p.lambda ** 2, skewness: 2, kurtosis: 6 }),
    center: (p) => 1 / p.lambda, scale: (p) => 1 / p.lambda,
  },
  {
    id: 'weibull', name: 'Weibull', discrete: false, group: 'Continuous', scipy: 'weibull_min(k, scale=λ)',
    about: 'Lifetimes and wind speeds. Shape below 1: early failures; 1: random failures; above 1: wear-out.',
    params: [pos('k', 'Shape k', 'Below 1 the failure rate falls with age, above 1 it rises.', 1.5), pos('lambda', 'Scale λ', 'The characteristic life: 63.2 % have failed by then.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => { if (x < 0) return 0; if (x === 0) return p.k < 1 ? Infinity : p.k === 1 ? 1 / p.lambda : 0; const z = x / p.lambda; return (p.k / p.lambda) * z ** (p.k - 1) * Math.exp(-(z ** p.k)); },
    cdf: (x, p) => (x <= 0 ? 0 : -Math.expm1(-((x / p.lambda) ** p.k))), sf: (x, p) => (x <= 0 ? 1 : Math.exp(-((x / p.lambda) ** p.k))),
    ppf: (q, p) => p.lambda * (-Math.log1p(-q)) ** (1 / p.k),
    moments: (p) => { const g = (r: number) => Math.exp(lgamma(1 + r / p.k)) * p.lambda ** r; return fromRaw(g(1), g(2), g(3), g(4)); },
    center: (p) => p.lambda, scale: (p) => p.lambda,
  },
  {
    id: 'lognormal', name: 'Log-normal', discrete: false, group: 'Continuous', scipy: 'lognorm(s=σ, scale=exp(μ))',
    about: 'A value whose logarithm is normal: incomes, particle sizes, concentrations, stock prices.',
    params: [real('mu', 'Log mean μ', 'The mean of ln(X). The median of X is e^μ.', 0), pos('sigma', 'Log SD σ', 'The standard deviation of ln(X). Larger is more skewed.', 0.5)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x <= 0 ? 0 : normPdf((Math.log(x) - p.mu) / p.sigma) / (p.sigma * x)),
    cdf: (x, p) => (x <= 0 ? 0 : normCdf((Math.log(x) - p.mu) / p.sigma)), sf: (x, p) => (x <= 0 ? 1 : normCdf(-(Math.log(x) - p.mu) / p.sigma)),
    ppf: (q, p) => Math.exp(p.mu + p.sigma * normPpf(q)),
    moments: (p) => { const w = Math.exp(p.sigma ** 2); return { mean: Math.exp(p.mu + p.sigma ** 2 / 2), variance: Math.expm1(p.sigma ** 2) * Math.exp(2 * p.mu + p.sigma ** 2), skewness: (w + 2) * Math.sqrt(w - 1), kurtosis: w ** 4 + 2 * w ** 3 + 3 * w ** 2 - 6 }; },
    center: (p) => Math.exp(p.mu), scale: (p) => Math.exp(p.mu) * p.sigma,
  },
  {
    id: 'cauchy', name: 'Cauchy (Lorentzian)', discrete: false, group: 'Continuous', scipy: 'cauchy(loc=x₀, scale=γ)',
    about: 'Spectral line shapes and resonance. Tails so heavy that it has no mean or variance.',
    params: [real('x0', 'Location x₀', 'The peak (and median).', 0), pos('gamma', 'Scale γ', 'Half the width at half the peak height.', 1)],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => { const z = (x - p.x0) / p.gamma; return 1 / (Math.PI * p.gamma * (1 + z * z)); },
    cdf: (x, p) => { const z = (x - p.x0) / p.gamma; return z < -1 ? Math.atan(-1 / z) / Math.PI : 0.5 + Math.atan(z) / Math.PI; },
    sf: (x, p) => { const z = (x - p.x0) / p.gamma; return z > 1 ? Math.atan(1 / z) / Math.PI : 0.5 - Math.atan(z) / Math.PI; },
    ppf: (q, p) => (q === 0.5 ? p.x0 : p.x0 - p.gamma / Math.tan(Math.PI * q)),
    moments: () => NONE,
    center: (p) => p.x0, scale: (p) => p.gamma,
  },
  {
    id: 'logistic', name: 'Logistic', discrete: false, group: 'Continuous', scipy: 'logistic(loc=μ, scale=s)',
    about: 'Like the normal but with heavier tails; its CDF is the logistic (sigmoid) curve.',
    params: [MU, pos('s', 'Scale s', 'The SD is s·π/√3, about 1.81 s.', 1)],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => { const z = -Math.abs((x - p.mu) / p.s), e = Math.exp(z); return e / (p.s * (1 + e) ** 2); },
    cdf: (x, p) => 1 / (1 + Math.exp(-(x - p.mu) / p.s)), sf: (x, p) => 1 / (1 + Math.exp((x - p.mu) / p.s)),
    ppf: (q, p) => p.mu + p.s * Math.log(q / (1 - q)),
    moments: (p) => ({ mean: p.mu, variance: (p.s * Math.PI) ** 2 / 3, skewness: 0, kurtosis: 1.2 }),
    center: (p) => p.mu, scale: (p) => p.s,
  },
  {
    id: 'gumbel', name: 'Gumbel (largest extreme)', discrete: false, group: 'Continuous', scipy: 'gumbel_r(loc=μ, scale=β)',
    about: 'The largest of many values: yearly maximum floods, wind gusts, loads.',
    params: [real('mu', 'Location μ', 'The most likely value (the mode).', 0), pos('beta', 'Scale β', 'The spread; the SD is β·π/√6.', 1)],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => { const z = (x - p.mu) / p.beta; return Math.exp(-z - Math.exp(-z)) / p.beta; },
    cdf: (x, p) => Math.exp(-Math.exp(-(x - p.mu) / p.beta)), sf: (x, p) => -Math.expm1(-Math.exp(-(x - p.mu) / p.beta)),
    ppf: (q, p) => p.mu - p.beta * Math.log(-Math.log(q)),
    moments: (p) => ({ mean: p.mu + EULER * p.beta, variance: (Math.PI * p.beta) ** 2 / 6, skewness: (12 * Math.sqrt(6) * 1.2020569031595942) / Math.PI ** 3, kurtosis: 2.4 }),
    center: (p) => p.mu, scale: (p) => p.beta,
  },
  {
    id: 'pareto', name: 'Pareto', discrete: false, group: 'Continuous', scipy: 'pareto(α, scale=xₘ)',
    about: 'Power-law tails: city sizes, wealth, file sizes. The "80/20 rule" is α ≈ 1.16.',
    params: [pos('xm', 'Minimum xₘ', 'The smallest possible value.', 1), pos('alpha', 'Tail index α', 'Smaller α means a heavier tail. The mean is infinite for α ≤ 1.', 3)],
    support: (p) => [p.xm, Infinity],
    pdf: (x, p) => (x < p.xm ? 0 : (p.alpha * p.xm ** p.alpha) / x ** (p.alpha + 1)),
    cdf: (x, p) => (x <= p.xm ? 0 : -Math.expm1(p.alpha * Math.log(p.xm / x))), sf: (x, p) => (x <= p.xm ? 1 : (p.xm / x) ** p.alpha),
    ppf: (q, p) => p.xm * Math.exp(-Math.log1p(-q) / p.alpha),
    moments: (p) => {
      const a = p.alpha, x = p.xm;
      return {
        mean: a > 1 ? (a * x) / (a - 1) : Infinity,
        variance: a > 2 ? (x * x * a) / ((a - 1) ** 2 * (a - 2)) : a > 1 ? Infinity : NaN,
        skewness: a > 3 ? ((2 * (1 + a)) / (a - 3)) * Math.sqrt((a - 2) / a) : a > 2 ? Infinity : NaN,
        kurtosis: a > 4 ? (6 * (a ** 3 + a * a - 6 * a - 2)) / (a * (a - 3) * (a - 4)) : a > 2 ? Infinity : NaN,
      };
    },
    center: (p) => p.xm * 2 ** (1 / p.alpha), scale: (p) => p.xm,
  },
  {
    id: 'uniform', name: 'Uniform (continuous)', discrete: false, group: 'Continuous', scipy: 'uniform(loc=a, scale=b−a)',
    about: 'Every value between a and b equally likely: rounding error, a random point on a line.',
    params: [real('a', 'Lower a', 'The smallest value.', 0), real('b', 'Upper b', 'The largest value.', 1)],
    check: (p) => (p.b > p.a ? null : 'The upper limit b must be above a.'),
    support: (p) => [p.a, p.b],
    pdf: (x, p) => (x < p.a || x > p.b ? 0 : 1 / (p.b - p.a)),
    cdf: (x, p) => clamp01((x - p.a) / (p.b - p.a)), sf: (x, p) => clamp01((p.b - x) / (p.b - p.a)),
    ppf: (q, p) => p.a + q * (p.b - p.a),
    moments: (p) => ({ mean: (p.a + p.b) / 2, variance: (p.b - p.a) ** 2 / 12, skewness: 0, kurtosis: -1.2 }),
    center: (p) => (p.a + p.b) / 2, scale: (p) => p.b - p.a,
  },
  {
    id: 'triangular', name: 'Triangular', discrete: false, group: 'Continuous', scipy: 'triang(c=(m−a)/(b−a), loc=a, scale=b−a)',
    about: 'A quick model from a minimum, most likely and maximum guess (project estimates, PERT-style).',
    params: [real('a', 'Minimum a', 'The smallest value.', 0), real('c', 'Most likely c', 'The peak; between a and b.', 1), real('b', 'Maximum b', 'The largest value.', 4)],
    check: (p) => (p.b > p.a && p.c >= p.a && p.c <= p.b ? null : 'Need a ≤ c ≤ b with b above a.'),
    support: (p) => [p.a, p.b],
    pdf: (x, p) => { const { a, b, c } = p; if (x < a || x > b) return 0; if (x < c) return (2 * (x - a)) / ((b - a) * (c - a)); if (x === c) return 2 / (b - a); return (2 * (b - x)) / ((b - a) * (b - c)); },
    cdf: (x, p) => { const { a, b, c } = p; if (x <= a) return 0; if (x >= b) return 1; return x <= c ? (x - a) ** 2 / ((b - a) * (c - a)) : 1 - (b - x) ** 2 / ((b - a) * (b - c)); },
    sf: (x, p) => { const { a, b, c } = p; if (x <= a) return 1; if (x >= b) return 0; return x <= c ? 1 - (x - a) ** 2 / ((b - a) * (c - a)) : (b - x) ** 2 / ((b - a) * (b - c)); },
    ppf: (q, p) => { const { a, b, c } = p, f = (c - a) / (b - a); return q < f ? a + Math.sqrt(q * (b - a) * (c - a)) : b - Math.sqrt((1 - q) * (b - a) * (b - c)); },
    moments: (p) => { const { a, b, c } = p, s = a * a + b * b + c * c - a * b - a * c - b * c; return { mean: (a + b + c) / 3, variance: s / 18, skewness: (SQRT2 * (a + b - 2 * c) * (2 * a - b - c) * (a - 2 * b + c)) / (5 * s ** 1.5), kurtosis: -0.6 }; },
    center: (p) => p.c, scale: (p) => p.b - p.a,
  },
  {
    id: 'laplace', name: 'Laplace (double exponential)', discrete: false, group: 'Continuous', scipy: 'laplace(loc=μ, scale=b)',
    about: 'A sharp peak with exponential tails each side: differences of exponential waits, robust (L1) errors.',
    params: [MU, pos('b', 'Scale b', 'The mean absolute distance from μ.', 1)],
    support: () => [-Infinity, Infinity],
    pdf: (x, p) => Math.exp(-Math.abs(x - p.mu) / p.b) / (2 * p.b),
    cdf: (x, p) => (x < p.mu ? 0.5 * Math.exp((x - p.mu) / p.b) : 1 - 0.5 * Math.exp(-(x - p.mu) / p.b)),
    sf: (x, p) => (x > p.mu ? 0.5 * Math.exp(-(x - p.mu) / p.b) : 1 - 0.5 * Math.exp((x - p.mu) / p.b)),
    ppf: (q, p) => (q < 0.5 ? p.mu + p.b * Math.log(2 * q) : p.mu - p.b * Math.log(2 * (1 - q))),
    moments: (p) => ({ mean: p.mu, variance: 2 * p.b * p.b, skewness: 0, kurtosis: 3 }),
    center: (p) => p.mu, scale: (p) => p.b,
  },
  {
    id: 'rayleigh', name: 'Rayleigh', discrete: false, group: 'Continuous', scipy: 'rayleigh(scale=σ)',
    about: 'The length of a 2-D vector with independent normal parts: wind speed, wave height, signal noise.',
    params: [pos('sigma', 'Scale σ', 'The SD of each of the two normal parts; also the mode.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 ? 0 : (x / p.sigma ** 2) * Math.exp(-(x * x) / (2 * p.sigma ** 2))),
    cdf: (x, p) => (x <= 0 ? 0 : -Math.expm1(-(x * x) / (2 * p.sigma ** 2))), sf: (x, p) => (x <= 0 ? 1 : Math.exp(-(x * x) / (2 * p.sigma ** 2))),
    ppf: (q, p) => p.sigma * Math.sqrt(-2 * Math.log1p(-q)),
    moments: (p) => ({ mean: p.sigma * Math.sqrt(Math.PI / 2), variance: ((4 - Math.PI) / 2) * p.sigma ** 2, skewness: (2 * Math.sqrt(Math.PI) * (Math.PI - 3)) / (4 - Math.PI) ** 1.5, kurtosis: -(6 * Math.PI ** 2 - 24 * Math.PI + 16) / (4 - Math.PI) ** 2 }),
    center: (p) => p.sigma, scale: (p) => p.sigma,
  },
  {
    id: 'rice', name: 'Rice (Rician)', discrete: false, group: 'Continuous', scipy: 'rice(ν/σ, scale=σ)',
    about: 'The length of a 2-D vector with a fixed part ν plus normal noise: radio fading, MRI magnitude images.',
    params: [{ k: 'nu', label: 'Signal ν', help: 'The length of the fixed part. ν = 0 gives the Rayleigh distribution.', def: 2, min: 0 }, pos('sigma', 'Noise σ', 'The SD of the noise in each direction.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => ricePdf(x, p.nu, p.sigma),
    cdf: (x, p) => riceCdfSf(x, p.nu, p.sigma)[0], sf: (x, p) => riceCdfSf(x, p.nu, p.sigma)[1],
    moments: (p) => numericMoments((x) => ricePdf(x, p.nu, p.sigma), Math.max(0, p.nu - 40 * p.sigma), p.nu + 40 * p.sigma, p.sigma / 2),
    draw: (p, u) => Math.hypot(p.nu + p.sigma * normPpf(u()), p.sigma * normPpf(u())),
    center: (p) => Math.hypot(p.nu, p.sigma), scale: (p) => p.sigma,
  },
  {
    id: 'vonmises', name: 'von Mises (circular normal)', discrete: false, group: 'Continuous', scipy: 'vonmises(κ, loc=μ)',
    about: 'Angles and directions (in radians): wind direction, time of day, animal headings. Wraps around at ±π.',
    params: [real('mu', 'Mean direction μ', 'In radians, between −π and π (−3.1416 to 3.1416).', 0), { k: 'kappa', label: 'Concentration κ', help: 'Zero is uniform round the circle; large κ is tightly bunched (SD about 1/√κ).', def: 2, min: 0, minOpen: true, max: 1e6 }],
    check: (p) => (Math.abs(p.mu) <= Math.PI + 1e-9 ? null : 'Give the mean direction in radians, between −π and π.'),
    support: (p) => [p.mu - Math.PI, p.mu + Math.PI],
    pdf: (x, p) => vmPdf(x, p.mu, p.kappa),
    cdf: (x, p) => vmCdfSf(x, p.mu, p.kappa)[0], sf: (x, p) => vmCdfSf(x, p.mu, p.kappa)[1],
    moments: (p) => { const [lo, hi] = vmRange(p.mu, p.kappa), m = numericMoments((x) => vmPdf(x, p.mu, p.kappa), lo, hi, vmStep(p.kappa)); return { mean: p.mu, variance: m.variance, skewness: 0, kurtosis: m.kurtosis }; },
    draw: (p, u) => vmDraw(p.mu, p.kappa, u),
    center: (p) => p.mu, scale: (p) => Math.min(1, 1 / Math.sqrt(p.kappa)),
  },
  {
    id: 'chi', name: 'Chi (χ)', discrete: false, group: 'Continuous', scipy: 'chi(k)',
    about: 'The length of a vector of k independent standard normal parts (the square root of a χ² value).',
    params: [pos('k', 'Degrees of freedom k', 'The number of normal parts. k = 2 is Rayleigh, k = 3 is Maxwell.', 3)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 ? 0 : x === 0 ? (p.k < 1 ? Infinity : p.k === 1 ? Math.sqrt(2 / Math.PI) : 0) : 2 * x * gammaPdf(x * x, p.k / 2, 2)),
    cdf: (x, p) => gammaCdf(x * x * Math.sign(x), p.k / 2, 2), sf: (x, p) => gammaSf(x * x * Math.sign(x), p.k / 2, 2),
    moments: (p) => { const m = (j: number) => 2 ** (j / 2) * Math.exp(lgamma((p.k + j) / 2) - lgamma(p.k / 2)); return fromRaw(m(1), m(2), m(3), m(4)); },
    draw: (p, u) => Math.sqrt(2 * gammaDraw(p.k / 2, u)),
    center: (p) => Math.sqrt(p.k), scale: () => 0.7,
  },
  {
    id: 'maxwell', name: 'Maxwell–Boltzmann', discrete: false, group: 'Continuous', scipy: 'maxwell(scale=a)',
    about: 'Speeds of molecules in a gas. a = √(kT/m).',
    params: [pos('a', 'Scale a', 'a = √(kT/m): the SD of each velocity component.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => { if (x < 0) return 0; const z = x / p.a; return (Math.sqrt(2 / Math.PI) * z * z * Math.exp(-(z * z) / 2)) / p.a; },
    cdf: (x, p) => gammaCdf(((x * x) / (p.a * p.a)) * Math.sign(x), 1.5, 2), sf: (x, p) => gammaSf(((x * x) / (p.a * p.a)) * Math.sign(x), 1.5, 2),
    moments: (p) => ({ mean: 2 * p.a * Math.sqrt(2 / Math.PI), variance: (p.a * p.a * (3 * Math.PI - 8)) / Math.PI, skewness: (2 * SQRT2 * (16 - 5 * Math.PI)) / (3 * Math.PI - 8) ** 1.5, kurtosis: (4 * (-96 + 40 * Math.PI - 3 * Math.PI ** 2)) / (3 * Math.PI - 8) ** 2 }),
    draw: (p, u) => p.a * Math.sqrt(2 * gammaDraw(1.5, u)),
    center: (p) => 1.6 * p.a, scale: (p) => 0.67 * p.a,
  },
  {
    id: 'invgamma', name: 'Inverse gamma', discrete: false, group: 'Continuous', scipy: 'invgamma(α, scale=β)',
    about: 'One over a gamma value: a common Bayesian prior for a variance.',
    params: [pos('alpha', 'Shape α', 'The mean exists for α > 1, the variance for α > 2.', 3), pos('beta', 'Scale β', 'Stretches the curve.', 2)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x <= 0 ? 0 : (gammaPdf(p.beta / x, p.alpha, 1) * p.beta) / (x * x)),
    cdf: (x, p) => (x <= 0 ? 0 : gammaPQ(p.alpha, p.beta / x)[1]), sf: (x, p) => (x <= 0 ? 1 : gammaPQ(p.alpha, p.beta / x)[0]),
    moments: (p) => {
      const a = p.alpha, b = p.beta;
      return { mean: a > 1 ? b / (a - 1) : Infinity, variance: a > 2 ? (b * b) / ((a - 1) ** 2 * (a - 2)) : a > 1 ? Infinity : NaN, skewness: a > 3 ? (4 * Math.sqrt(a - 2)) / (a - 3) : a > 2 ? Infinity : NaN, kurtosis: a > 4 ? (30 * a - 66) / ((a - 3) * (a - 4)) : a > 2 ? Infinity : NaN };
    },
    draw: (p, u) => p.beta / gammaDraw(p.alpha, u),
    center: (p) => p.beta / p.alpha, scale: (p) => p.beta / p.alpha,
  },
  {
    id: 'halfnormal', name: 'Half-normal', discrete: false, group: 'Continuous', scipy: 'halfnorm(scale=σ)',
    about: 'The size of a normal error, ignoring its sign.',
    params: [pos('sigma', 'Scale σ', 'The SD of the normal it folds.', 1)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 ? 0 : (2 * normPdf(x / p.sigma)) / p.sigma),
    cdf: (x, p) => (x <= 0 ? 0 : erf(x / (p.sigma * SQRT2))), sf: (x, p) => (x <= 0 ? 1 : erfc(x / (p.sigma * SQRT2))),
    ppf: (q, p) => p.sigma * normPpf((1 + q) / 2),
    moments: (p) => ({ mean: p.sigma * Math.sqrt(2 / Math.PI), variance: p.sigma ** 2 * (1 - 2 / Math.PI), skewness: (SQRT2 * (4 - Math.PI)) / (Math.PI - 2) ** 1.5, kurtosis: (8 * (Math.PI - 3)) / (Math.PI - 2) ** 2 }),
    center: (p) => 0.67 * p.sigma, scale: (p) => p.sigma,
  },
  {
    id: 'gev', name: 'Generalised extreme value (GEV)', discrete: false, group: 'Continuous', scipy: 'genextreme(c=−ξ, loc=μ, scale=σ)',
    about: 'Block maxima (yearly floods, storms). ξ = 0 is Gumbel, ξ > 0 Fréchet (heavy tail), ξ < 0 reversed Weibull (an upper limit).',
    params: [MU, SIG, real('xi', 'Shape ξ', 'Tail shape: positive is a heavy tail, negative gives an upper limit μ − σ/ξ.', 0.1)],
    support: (p) => (p.xi > 0 ? [p.mu - p.sigma / p.xi, Infinity] : p.xi < 0 ? [-Infinity, p.mu - p.sigma / p.xi] : [-Infinity, Infinity]),
    pdf: (x, p) => { const t = gevT(x, p); if (!(t > 0) || !Number.isFinite(t)) return 0; return (t ** (p.xi + 1) * Math.exp(-t)) / p.sigma; },
    cdf: (x, p) => { const t = gevT(x, p); return Math.exp(-t); }, sf: (x, p) => { const t = gevT(x, p); return -Math.expm1(-t); },
    ppf: (q, p) => { const L = -Math.log(q); return Math.abs(p.xi) < 1e-12 ? p.mu - p.sigma * Math.log(L) : p.mu + (p.sigma * Math.expm1(-p.xi * Math.log(L))) / p.xi; },
    moments: (p) => {
      const xi = p.xi, s = p.sigma;
      if (Math.abs(xi) < 1e-7) return { mean: p.mu + EULER * s, variance: (Math.PI * s) ** 2 / 6, skewness: (12 * Math.sqrt(6) * 1.2020569031595942) / Math.PI ** 3, kurtosis: 2.4 };
      const g = (k: number) => Math.exp(lgamma(1 - k * xi));
      const v = g(2) - g(1) ** 2;
      return {
        mean: xi < 1 ? p.mu + (s * (g(1) - 1)) / xi : Infinity,
        variance: xi < 0.5 ? (s * s * v) / (xi * xi) : xi < 1 ? Infinity : NaN,
        skewness: xi < 1 / 3 ? (Math.sign(xi) * (g(3) - 3 * g(1) * g(2) + 2 * g(1) ** 3)) / v ** 1.5 : xi < 0.5 ? Infinity : NaN,
        kurtosis: xi < 0.25 ? (g(4) - 4 * g(1) * g(3) + 6 * g(2) * g(1) ** 2 - 3 * g(1) ** 4) / (v * v) - 3 : xi < 0.5 ? Infinity : NaN,
      };
    },
    center: (p) => p.mu, scale: (p) => p.sigma,
  },
  {
    id: 'genpareto', name: 'Generalised Pareto', discrete: false, group: 'Continuous', scipy: 'genpareto(c=ξ, loc=μ, scale=σ)',
    about: 'How far values go past a high threshold (peaks over threshold). ξ = 0 is exponential.',
    params: [real('mu', 'Threshold μ', 'The smallest value.', 0), SIG, real('xi', 'Shape ξ', 'Positive is a heavy tail; negative gives an upper limit μ − σ/ξ.', 0.2)],
    support: (p) => [p.mu, p.xi < 0 ? p.mu - p.sigma / p.xi : Infinity],
    pdf: (x, p) => { const z = (x - p.mu) / p.sigma; if (z < 0 || (p.xi < 0 && z > -1 / p.xi)) return 0; return Math.abs(p.xi) < 1e-12 ? Math.exp(-z) / p.sigma : Math.exp(-(1 / p.xi + 1) * Math.log1p(p.xi * z)) / p.sigma; },
    cdf: (x, p) => 1 - gpSf(x, p), sf: (x, p) => gpSf(x, p),
    ppf: (q, p) => (Math.abs(p.xi) < 1e-12 ? p.mu - p.sigma * Math.log1p(-q) : p.mu + (p.sigma * Math.expm1(-p.xi * Math.log1p(-q))) / p.xi),
    moments: (p) => {
      const x = p.xi, s = p.sigma;
      return {
        mean: x < 1 ? p.mu + s / (1 - x) : Infinity,
        variance: x < 0.5 ? (s * s) / ((1 - x) ** 2 * (1 - 2 * x)) : x < 1 ? Infinity : NaN,
        skewness: x < 1 / 3 ? (2 * (1 + x) * Math.sqrt(1 - 2 * x)) / (1 - 3 * x) : x < 0.5 ? Infinity : NaN,
        kurtosis: x < 0.25 ? (3 * (1 - 2 * x) * (2 * x * x + x + 3)) / ((1 - 3 * x) * (1 - 4 * x)) - 3 : x < 0.5 ? Infinity : NaN,
      };
    },
    center: (p) => p.mu + p.sigma, scale: (p) => p.sigma,
  },
  {
    id: 'invgauss', name: 'Inverse Gaussian (Wald)', discrete: false, group: 'Continuous', scipy: 'invgauss(μ/λ, scale=λ)',
    about: 'The first time a drifting random walk reaches a level: reaction times, failure by wear.',
    params: [pos('mu', 'Mean μ', 'The average.', 1), pos('lambda', 'Shape λ', 'Larger λ is less skewed. The variance is μ³/λ.', 2)],
    support: () => [0, Infinity],
    pdf: (x, p) => (x <= 0 ? 0 : Math.sqrt(p.lambda / (2 * Math.PI * x ** 3)) * Math.exp(-(p.lambda * (x - p.mu) ** 2) / (2 * p.mu * p.mu * x))),
    cdf: (x, p) => igCdfSf(x, p.mu, p.lambda)[0], sf: (x, p) => igCdfSf(x, p.mu, p.lambda)[1],
    moments: (p) => ({ mean: p.mu, variance: p.mu ** 3 / p.lambda, skewness: 3 * Math.sqrt(p.mu / p.lambda), kurtosis: (15 * p.mu) / p.lambda }),
    draw: (p, u) => { const v = normPpf(u()) ** 2, m = p.mu, l = p.lambda; const x = m + (m * m * v) / (2 * l) - (m / (2 * l)) * Math.sqrt(4 * m * l * v + m * m * v * v); return u() <= m / (m + x) ? x : (m * m) / x; },
    center: (p) => p.mu, scale: (p) => Math.sqrt(p.mu ** 3 / p.lambda),
  },
  {
    id: 'loglogistic', name: 'Log-logistic (Fisk)', discrete: false, group: 'Continuous', scipy: 'fisk(β, scale=α)',
    about: 'A positive, skewed value whose log is logistic: incomes, river flows, survival times.',
    params: [pos('alpha', 'Scale α', 'The median.', 1), pos('beta', 'Shape β', 'Larger is less spread. The mean needs β > 1, the variance β > 2.', 4)],
    support: () => [0, Infinity],
    pdf: (x, p) => { if (x < 0) return 0; if (x === 0) return p.beta < 1 ? Infinity : p.beta === 1 ? 1 / p.alpha : 0; const z = (x / p.alpha) ** p.beta; return (p.beta / x) * z / (1 + z) ** 2; },
    cdf: (x, p) => (x <= 0 ? 0 : 1 / (1 + (x / p.alpha) ** -p.beta)), sf: (x, p) => (x <= 0 ? 1 : 1 / (1 + (x / p.alpha) ** p.beta)),
    ppf: (q, p) => p.alpha * (q / (1 - q)) ** (1 / p.beta),
    moments: (p) => {
      const b = p.beta, m = (k: number) => (k < b ? p.alpha ** k * ((k * Math.PI) / b) / Math.sin((k * Math.PI) / b) : Infinity);
      if (b <= 1) return { mean: Infinity, variance: NaN, skewness: NaN, kurtosis: NaN };
      if (b <= 2) return { mean: m(1), variance: Infinity, skewness: NaN, kurtosis: NaN };
      const r = fromRaw(m(1), m(2), b > 3 ? m(3) : 0, b > 4 ? m(4) : 0);
      return { mean: r.mean, variance: r.variance, skewness: b > 3 ? r.skewness : Infinity, kurtosis: b > 4 ? r.kurtosis : Infinity };
    },
    center: (p) => p.alpha, scale: (p) => p.alpha / p.beta * 2,
  },
  // ---------- Discrete ----------
  {
    id: 'bernoulli', name: 'Bernoulli', discrete: true, group: 'Discrete', scipy: 'bernoulli(p)',
    about: 'One yes/no trial: 1 with probability p, 0 otherwise.',
    params: [prob('p', 'Probability p', 'The chance of a 1 (success).', 0.3)],
    support: () => [0, 1],
    pdf: (x, p) => (x === 0 ? 1 - p.p : x === 1 ? p.p : 0),
    cdf: (x, p) => (x < 0 ? 0 : x < 1 ? 1 - p.p : 1), sf: (x, p) => (x < 0 ? 1 : x < 1 ? p.p : 0),
    moments: (p) => { const q = 1 - p.p, v = p.p * q; return { mean: p.p, variance: v, skewness: (q - p.p) / Math.sqrt(v), kurtosis: (1 - 6 * v) / v }; },
    center: (p) => p.p, scale: () => 1,
  },
  {
    id: 'binomial', name: 'Binomial', discrete: true, group: 'Discrete', scipy: 'binom(n, p)',
    about: 'The number of successes in n independent yes/no trials with the same chance p.',
    params: [{ k: 'n', label: 'Trials n', help: 'How many trials (a whole number).', def: 20, min: 0, int: true, max: 1e7 }, prob('p', 'Probability p', 'The chance of success in each trial.', 0.3)],
    support: (p) => [0, p.n],
    pdf: (x, p) => (x < 0 || x > p.n || x !== Math.floor(x) ? 0 : dbinomRaw(x, p.n, p.p, 1 - p.p)),
    cdf: (x, p) => { const k = Math.floor(x); if (k < 0) return 0; if (k >= p.n) return 1; return betaPQ(1 - p.p, p.p, p.n - k, k + 1)[0]; },
    sf: (x, p) => { const k = Math.floor(x); if (k < 0) return 1; if (k >= p.n) return 0; return betaPQ(1 - p.p, p.p, p.n - k, k + 1)[1]; },
    moments: (p) => { const v = p.n * p.p * (1 - p.p); return { mean: p.n * p.p, variance: v, skewness: (1 - 2 * p.p) / Math.sqrt(v), kurtosis: (1 - 6 * p.p * (1 - p.p)) / v }; },
    center: (p) => p.n * p.p, scale: (p) => Math.sqrt(p.n * p.p * (1 - p.p)) || 1,
  },
  {
    id: 'poisson', name: 'Poisson', discrete: true, group: 'Discrete', scipy: 'poisson(λ)',
    about: 'Counts of rare, independent events in a fixed time or space: decays per second, calls per hour, typos per page.',
    params: [pos('lambda', 'Mean λ', 'The average count.', 4, { max: 1e7 })],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 || x !== Math.floor(x) ? 0 : dpoisRaw(x, p.lambda)),
    cdf: (x, p) => { const k = Math.floor(x); return k < 0 ? 0 : gammaPQ(k + 1, p.lambda)[1]; },
    sf: (x, p) => { const k = Math.floor(x); return k < 0 ? 1 : gammaPQ(k + 1, p.lambda)[0]; },
    moments: (p) => ({ mean: p.lambda, variance: p.lambda, skewness: 1 / Math.sqrt(p.lambda), kurtosis: 1 / p.lambda }),
    center: (p) => p.lambda, scale: (p) => Math.sqrt(p.lambda),
  },
  {
    id: 'nbinom', name: 'Negative binomial', discrete: true, group: 'Discrete', scipy: 'nbinom(r, p)',
    about: 'The number of failures before the r-th success. Also used for over-dispersed counts (variance above the mean).',
    params: [pos('r', 'Successes r', 'How many successes to wait for (may be a fraction for count models).', 5, { max: 1e7 }), prob('p', 'Probability p', 'The chance of success in each trial.', 0.4, [true, false])],
    support: () => [0, Infinity],
    pdf: (x, p) => (x < 0 || x !== Math.floor(x) ? 0 : p.p === 1 ? (x === 0 ? 1 : 0) : (p.r / (p.r + x)) * dbinomRaw(p.r, x + p.r, p.p, 1 - p.p)),
    cdf: (x, p) => { const k = Math.floor(x); return k < 0 ? 0 : betaPQ(p.p, 1 - p.p, p.r, k + 1)[0]; },
    sf: (x, p) => { const k = Math.floor(x); return k < 0 ? 1 : betaPQ(p.p, 1 - p.p, p.r, k + 1)[1]; },
    moments: (p) => { const q = 1 - p.p; return { mean: (p.r * q) / p.p, variance: (p.r * q) / p.p ** 2, skewness: (2 - p.p) / Math.sqrt(p.r * q), kurtosis: 6 / p.r + p.p ** 2 / (p.r * q) }; },
    center: (p) => (p.r * (1 - p.p)) / p.p, scale: (p) => Math.sqrt(p.r * (1 - p.p)) / p.p || 1,
  },
  {
    id: 'geometric', name: 'Geometric', discrete: true, group: 'Discrete', scipy: 'geom(p)',
    about: 'The number of trials up to and including the first success (1, 2, 3, …).',
    params: [prob('p', 'Probability p', 'The chance of success in each trial.', 0.25, [true, false])],
    support: () => [1, Infinity],
    pdf: (x, p) => (x < 1 || x !== Math.floor(x) ? 0 : p.p * Math.exp((x - 1) * Math.log1p(-p.p))),
    cdf: (x, p) => { const k = Math.floor(x); return k < 1 ? 0 : -Math.expm1(k * Math.log1p(-p.p)); },
    sf: (x, p) => { const k = Math.floor(x); return k < 1 ? 1 : Math.exp(k * Math.log1p(-p.p)); },
    moments: (p) => { const q = 1 - p.p; return { mean: 1 / p.p, variance: q / p.p ** 2, skewness: (2 - p.p) / Math.sqrt(q), kurtosis: 6 + p.p ** 2 / q }; },
    center: (p) => 1 / p.p, scale: (p) => Math.sqrt(1 - p.p) / p.p || 1,
  },
  {
    id: 'hypergeom', name: 'Hypergeometric', discrete: true, group: 'Discrete', scipy: 'hypergeom(M=N, n=K, N=n)',
    about: 'Successes in n draws without putting back, from N items of which K are successes: card hands, lot sampling, capture–recapture.',
    params: [{ k: 'N', label: 'Population N', help: 'How many items in all.', def: 50, min: 1, int: true, max: 1e6 }, { k: 'K', label: 'Successes in it K', help: 'How many of them count as a success.', def: 10, min: 0, int: true }, { k: 'n', label: 'Draws n', help: 'How many items are drawn, without putting back.', def: 12, min: 0, int: true }],
    check: (p) => (p.K > p.N ? 'K cannot be more than the population N.' : p.n > p.N ? 'You cannot draw more than the population N.' : null),
    support: (p) => [Math.max(0, p.n + p.K - p.N), Math.min(p.n, p.K)],
    pdf: (x, p) => hgPmf(x, p.N, p.K, p.n),
    cdf: (x, p) => hgCdfSf(x, p)[0], sf: (x, p) => hgCdfSf(x, p)[1],
    moments: (p) => {
      const { N, K, n } = p, mean = (n * K) / N, v = n * (K / N) * ((N - K) / N) * ((N - n) / (N - 1));
      if (!(v > 0)) return { mean, variance: 0, skewness: NaN, kurtosis: NaN };
      const sk = ((N - 2 * K) * Math.sqrt(N - 1) * (N - 2 * n)) / (Math.sqrt(n * K * (N - K) * (N - n)) * (N - 2));
      const ku = ((N - 1) * N * N * (N * (N + 1) - 6 * K * (N - K) - 6 * n * (N - n)) + 6 * n * K * (N - K) * (N - n) * (5 * N - 6)) / (n * K * (N - K) * (N - n) * (N - 2) * (N - 3));
      return { mean, variance: v, skewness: N > 2 ? sk : NaN, kurtosis: N > 3 ? ku : NaN };
    },
    center: (p) => (p.n * p.K) / p.N, scale: (p) => Math.sqrt((p.n * p.K * (p.N - p.K)) / (p.N * p.N)) || 1,
  },
  {
    id: 'dunif', name: 'Uniform (whole numbers)', discrete: true, group: 'Discrete', scipy: 'randint(a, b+1)',
    about: 'Every whole number from a to b equally likely: a fair die is a = 1, b = 6.',
    params: [{ k: 'a', label: 'Lowest a', help: 'The smallest whole number.', def: 1, int: true }, { k: 'b', label: 'Highest b', help: 'The largest whole number.', def: 6, int: true }],
    check: (p) => (p.b >= p.a ? null : 'The highest b must be at least the lowest a.'),
    support: (p) => [p.a, p.b],
    pdf: (x, p) => (x < p.a || x > p.b || x !== Math.floor(x) ? 0 : 1 / (p.b - p.a + 1)),
    cdf: (x, p) => clamp01((Math.floor(x) - p.a + 1) / (p.b - p.a + 1)), sf: (x, p) => clamp01((p.b - Math.floor(x)) / (p.b - p.a + 1)),
    moments: (p) => { const n = p.b - p.a + 1; return { mean: (p.a + p.b) / 2, variance: (n * n - 1) / 12, skewness: n > 1 ? 0 : NaN, kurtosis: n > 1 ? (-6 * (n * n + 1)) / (5 * (n * n - 1)) : NaN }; },
    center: (p) => (p.a + p.b) / 2, scale: (p) => p.b - p.a + 1,
  },
  {
    id: 'betabinom', name: 'Beta-binomial', discrete: true, group: 'Discrete', scipy: 'betabinom(n, α, β)',
    about: 'Binomial counts when the success chance itself varies from group to group (over-dispersed proportions).',
    params: [{ k: 'n', label: 'Trials n', help: 'How many trials (a whole number).', def: 20, min: 0, int: true, max: 1e5 }, pos('a', 'Shape α', 'With β, sets how the success chance varies. Mean chance α/(α+β).', 2), pos('b', 'Shape β', 'Smaller α + β means more variation between groups.', 3)],
    support: (p) => [0, p.n],
    pdf: (x, p) => bbPmf(x, p.n, p.a, p.b),
    cdf: (x, p) => finiteCdfSf(x, p, bbDist)[0], sf: (x, p) => finiteCdfSf(x, p, bbDist)[1],
    moments: (p) => finiteMoments(p, bbDist),
    center: (p) => (p.n * p.a) / (p.a + p.b), scale: (p) => Math.sqrt(p.n) || 1,
  },
];
export const DIST = Object.fromEntries(DISTS.map((d) => [d.id, d])) as Record<string, Dist>;

// ---------- Helpers for the numeric families ----------
function gevT(x: number, p: Params): number {
  const z = (x - p.mu) / p.sigma;
  if (Math.abs(p.xi) < 1e-12) return Math.exp(-z);
  const u = 1 + p.xi * z;
  if (u <= 0) return p.xi > 0 ? Infinity : 0;
  return Math.exp((-1 / p.xi) * Math.log(u));
}
function gpSf(x: number, p: Params): number {
  const z = (x - p.mu) / p.sigma;
  if (z <= 0) return 1;
  if (Math.abs(p.xi) < 1e-12) return Math.exp(-z);
  const u = 1 + p.xi * z;
  if (u <= 0) return 0;
  return Math.exp((-1 / p.xi) * Math.log1p(p.xi * z));
}
function igCdfSf(x: number, mu: number, lam: number): [number, number] {
  if (x <= 0) return [0, 1];
  const r = Math.sqrt(lam / x), a = r * (x / mu - 1), b = r * (x / mu + 1);
  // e^(2 lam/mu) Phi(-b), in logs so it never overflows.
  const second = Math.exp((2 * lam) / mu + Math.log(0.5) + logErfc(b / SQRT2));
  const cdf = normCdf(a) + second, sf = normCdf(-a) - second;
  return cdf < 0.5 ? [cdf, 1 - cdf] : [1 - sf, sf];
}
function ricePdf(x: number, nu: number, s: number): number {
  if (x <= 0) return 0;
  const s2 = s * s;
  return (x / s2) * Math.exp(-((x - nu) ** 2) / (2 * s2)) * i0e((x * nu) / s2);
}
function riceCdfSf(x: number, nu: number, s: number): [number, number] {
  if (x <= 0) return [0, 1];
  const lo = Math.max(0, nu - 40 * s), hi = nu + 40 * s;
  if (x <= lo) return [0, 1];
  if (x >= hi) return [1, 0];
  const f = (t: number) => ricePdf(t, nu, s);
  if (x < Math.hypot(nu, s)) { const c = integrate(f, lo, x, s / 2); return [c, 1 - c]; }
  const q = integrate(f, x, hi, s / 2); return [1 - q, q];
}
const vmStep = (k: number) => Math.min(Math.PI / 8, 0.5 / Math.sqrt(k));
const vmRange = (mu: number, k: number): [number, number] => { const w = Math.min(Math.PI, 40 / Math.sqrt(k)); return [mu - w, mu + w]; };
function vmPdf(x: number, mu: number, k: number): number {
  if (x < mu - Math.PI || x > mu + Math.PI) return 0;
  return Math.exp(k * (Math.cos(x - mu) - 1)) / (2 * Math.PI * i0e(k));
}
function vmCdfSf(x: number, mu: number, k: number): [number, number] {
  const [lo, hi] = vmRange(mu, k);
  if (x <= lo) return [0, 1];
  if (x >= hi) return [1, 0];
  const f = (t: number) => vmPdf(t, mu, k);
  if (x <= mu) { const c = integrate(f, lo, x, vmStep(k)); return [c, 1 - c]; }
  const q = integrate(f, x, hi, vmStep(k)); return [1 - q, q];
}
/** Best and Fisher's (1979) rejection sampler, then wrapped into (μ − π, μ + π]. */
function vmDraw(mu: number, k: number, u: () => number): number {
  if (k < 1e-8) return mu - Math.PI + 2 * Math.PI * u();
  const a = 1 + Math.sqrt(1 + 4 * k * k), b = (a - Math.sqrt(2 * a)) / (2 * k), r = (1 + b * b) / (2 * b);
  for (;;) {
    const z = Math.cos(Math.PI * u()), f = (1 + r * z) / (r + z), c = k * (r - f), u2 = u();
    if (c * (2 - c) - u2 > 0 || Math.log(c / u2) + 1 - c >= 0) {
      const th = (u() > 0.5 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, f)));
      return mu + th;
    }
  }
}
/** Mean, variance, skewness and excess kurtosis of a density by quadrature on [a, b]. */
export function numericMoments(f: (x: number) => number, a: number, b: number, h: number): Moments {
  const m0 = integrate(f, a, b, h);
  const m1 = integrate((x) => x * f(x), a, b, h) / m0;
  const c = (k: number) => integrate((x) => (x - m1) ** k * f(x), a, b, h) / m0;
  const v = c(2);
  return { mean: m1, variance: v, skewness: c(3) / v ** 1.5, kurtosis: c(4) / (v * v) - 3 };
}
function hgPmf(x: number, N: number, K: number, n: number): number {
  if (x !== Math.floor(x) || x < Math.max(0, n + K - N) || x > Math.min(n, K)) return 0;
  // R's dhyper: p = n/N, product of three binomial terms.
  const p = n / N, q = (N - n) / N;
  const p1 = dbinomRaw(x, K, p, q), p2 = dbinomRaw(n - x, N - K, p, q), p3 = dbinomRaw(n, N, p, q);
  return (p1 * p2) / p3;
}
function hgCdfSf(x: number, p: Params): [number, number] {
  const lo = Math.max(0, p.n + p.K - p.N), hi = Math.min(p.n, p.K), k = Math.floor(x);
  if (k < lo) return [0, 1];
  if (k >= hi) return [1, 0];
  const mean = (p.n * p.K) / p.N;
  if (k < mean) { let s = 0; for (let i = lo; i <= k; i++) s += hgPmf(i, p.N, p.K, p.n); return [s, 1 - s]; }
  let s = 0; for (let i = k + 1; i <= hi; i++) s += hgPmf(i, p.N, p.K, p.n); return [1 - s, s];
}
function bbPmf(x: number, n: number, a: number, b: number): number {
  if (x !== Math.floor(x) || x < 0 || x > n) return 0;
  return Math.exp(lgamma(n + 1) - lgamma(x + 1) - lgamma(n - x + 1) + lbeta(x + a, n - x + b) - lbeta(a, b));
}
const bbDist = { pmf: (x: number, p: Params) => bbPmf(x, p.n, p.a, p.b), lo: () => 0, hi: (p: Params) => p.n, mean: (p: Params) => (p.n * p.a) / (p.a + p.b) };
type Finite = typeof bbDist;
function finiteCdfSf(x: number, p: Params, d: Finite): [number, number] {
  const lo = d.lo(), hi = d.hi(p), k = Math.floor(x);
  if (k < lo) return [0, 1];
  if (k >= hi) return [1, 0];
  let s = 0;
  if (k < d.mean(p)) { for (let i = lo; i <= k; i++) s += d.pmf(i, p); return [s, 1 - s]; }
  for (let i = k + 1; i <= hi; i++) s += d.pmf(i, p); return [1 - s, s];
}
function finiteMoments(p: Params, d: Finite): Moments {
  let m1 = 0; const lo = d.lo(), hi = d.hi(p);
  for (let i = lo; i <= hi; i++) m1 += i * d.pmf(i, p);
  let c2 = 0, c3 = 0, c4 = 0;
  for (let i = lo; i <= hi; i++) { const w = d.pmf(i, p), e = i - m1; c2 += w * e * e; c3 += w * e ** 3; c4 += w * e ** 4; }
  return { mean: m1, variance: c2, skewness: c3 / c2 ** 1.5, kurtosis: c4 / (c2 * c2) - 3 };
}

// ---------- Random numbers ----------
/** A small, fast, seeded generator (sfc32, seeded by splitmix32); returns uniforms in (0, 1) with 53 bits. */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  const split = () => { s = (s + 0x9e3779b9) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b); z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35); return (z ^ (z >>> 16)) >>> 0; };
  let a = split(), b = split(), c = split(), d = split();
  const next = () => { const t = (((a + b) >>> 0) + d) >>> 0; d = (d + 1) >>> 0; a = b ^ (b >>> 9); b = (c + (c << 3)) >>> 0; c = ((c << 21) | (c >>> 11)) >>> 0; c = (c + t) >>> 0; return t; };
  for (let i = 0; i < 12; i++) next();
  return () => ((next() >>> 5) * 67108864 + (next() >>> 6) + 0.5) / 9007199254740992;
}
/** Marsaglia and Tsang's gamma generator (shape k, scale 1). */
export function gammaDraw(k: number, u: () => number): number {
  if (k < 1) return gammaDraw(k + 1, u) * u() ** (1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do { x = normPpf(u()); v = 1 + c * x; } while (v <= 0);
    v = v * v * v; const w = u();
    if (w < 1 - 0.0331 * x ** 4 || Math.log(w) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

// ---------- Working with any distribution ----------
export function defaults(d: Dist): Params { return Object.fromEntries(d.params.map((q) => [q.k, q.def])); }
/** Check a parameter set; returns a plain message or null. */
export function validate(d: Dist, p: Params): string | null {
  for (const q of d.params) {
    const v = p[q.k], name = q.label;
    if (!Number.isFinite(v)) return `Type a number for ${name}.`;
    if (q.int && v !== Math.round(v)) return `${name} must be a whole number.`;
    if (q.min != null && (q.minOpen ? v <= q.min : v < q.min)) return `${name} must be ${q.minOpen ? 'above' : 'at least'} ${q.min}.`;
    if (q.max != null && (q.maxOpen ? v >= q.max : v > q.max)) return `${name} must be ${q.maxOpen ? 'below' : 'at most'} ${q.max.toLocaleString('en')}.`;
  }
  return d.check?.(p) ?? null;
}

/**
 * Quantile (inverse CDF). Continuous: the x with F(x) = q. Discrete: the smallest whole number k with
 * F(k) >= q (the same rule as scipy's ppf).
 */
export function quantile(d: Dist, p: Params, q: number): number {
  const [lo, hi] = d.support(p);
  if (!(q >= 0 && q <= 1)) return NaN;
  if (q === 0) return d.discrete ? lo : lo;
  if (q === 1) return hi;
  if (d.discrete) return discreteQuantile(d, p, q, lo, hi);
  if (d.ppf) return d.ppf(q, p);
  // Solve F(x) = q (or S(x) = 1 - q in the upper half, for precision), bracketing then Newton with bisection.
  const upper = q > 0.5, target = upper ? 1 - q : q;
  const g = (x: number) => (upper ? target - d.sf(x, p) : d.cdf(x, p) - target); // increasing in x
  const c = Math.min(Math.max(d.center(p), lo), hi), s = d.scale(p);
  let a: number, b: number;
  if (g(c) < 0) {
    a = c; let step = s; b = Math.min(hi, c + step);
    while (g(b) < 0 && b < hi) { a = b; step *= 2; b = Math.min(hi, c + step); if (!Number.isFinite(b)) break; }
  } else {
    b = c; let step = s; a = Math.max(lo, c - step);
    while (g(a) > 0 && a > lo) { b = a; step *= 2; a = Math.max(lo, c - step); if (!Number.isFinite(a)) break; }
  }
  let x = (a + b) / 2;
  for (let i = 0; i < 300; i++) {
    const gx = g(x);
    if (gx === 0) return x;
    if (gx < 0) a = x; else b = x;
    const f = d.pdf(x, p);
    let nx = f > 0 && Number.isFinite(f) ? x - gx / f : NaN;
    if (!(nx > a && nx < b)) nx = a > 0 && b / a > 4 ? Math.sqrt(a * b) : (a + b) / 2;
    if (Math.abs(nx - x) <= 1e-15 * Math.max(1e-300, Math.abs(x)) || b - a <= 2e-16 * Math.max(Math.abs(a), Math.abs(b))) return nx;
    x = nx;
  }
  return x;
}
function discreteQuantile(d: Dist, p: Params, q: number, lo: number, hi: number): number {
  const ok = (k: number) => d.cdf(k, p) >= q;
  let a = lo - 1, b: number;
  if (Number.isFinite(hi)) b = hi;
  else { let step = Math.max(1, Math.ceil(d.scale(p))); b = Math.max(lo, Math.ceil(d.center(p))); while (!ok(b)) { a = b; b += step; step *= 2; } }
  // Invariant: ok(b), not ok(a) (a may be lo - 1).
  if (ok(lo)) return lo;
  a = Math.max(a, lo);
  while (b - a > 1) { const m = Math.floor((a + b) / 2); if (ok(m)) b = m; else a = m; }
  return b;
}

export type Region = 'between' | 'below' | 'above' | 'outside';
/**
 * Probability of a region. Continuous: a < X < b (end points do not matter). Discrete: the end points
 * are included, so "between" is P(a <= X <= b), "below" P(X <= b), "above" P(X >= a), "outside" P(X < a or X > b).
 */
export function regionProb(d: Dist, p: Params, region: Region, a: number, b: number): number {
  if (d.discrete) {
    const below = (v: number) => d.cdf(v, p), aboveEq = (v: number) => d.sf(Math.ceil(v) - 1, p); // P(X >= v)
    if (region === 'below') return below(b);
    if (region === 'above') return aboveEq(a);
    const inside = b < a ? 0 : Math.max(0, d.cdf(b, p) - d.cdf(Math.ceil(a) - 1, p));
    if (region === 'between') return betweenPrecise(d, p, Math.ceil(a) - 1, b, inside);
    return d.cdf(Math.ceil(a) - 1, p) + d.sf(b, p);
  }
  if (region === 'below') return d.cdf(b, p);
  if (region === 'above') return d.sf(a, p);
  if (region === 'between') return b <= a ? 0 : betweenPrecise(d, p, a, b, d.cdf(b, p) - d.cdf(a, p));
  return b <= a ? 1 : d.cdf(a, p) + d.sf(b, p);
}
// P(lo < X <= hi): in the upper tail S(lo) - S(hi) keeps more digits than F(hi) - F(lo).
function betweenPrecise(d: Dist, p: Params, lo: number, hi: number, viaCdf: number): number {
  const sl = d.sf(lo, p);
  if (sl < 0.5) return Math.max(0, sl - d.sf(hi, p));
  return Math.max(0, viaCdf);
}

/** n random values with a fixed seed: direct generators where they exist, otherwise the quantile of a uniform. */
export function sample(d: Dist, p: Params, n: number, seed: number): number[] {
  const u = rng(seed), out: number[] = [];
  if (d.discrete) {
    // Inverse CDF through a table of cumulative probabilities over the practical range.
    const lo = quantile(d, p, 1e-14), hi = quantile(d, p, 1 - 1e-14);
    if (hi - lo <= 2e6) {
      const cum: number[] = []; let s = 0;
      for (let k = lo; k <= hi; k++) { s = k === lo ? d.cdf(k, p) : s + d.pdf(k, p); cum.push(s); }
      for (let i = 0; i < n; i++) {
        const v = u() * cum[cum.length - 1];
        let a = 0, b = cum.length - 1;
        while (a < b) { const m = (a + b) >> 1; if (cum[m] >= v) b = m; else a = m + 1; }
        out.push(lo + a);
      }
      return out;
    }
    for (let i = 0; i < n; i++) out.push(quantile(d, p, u()));
    return out;
  }
  for (let i = 0; i < n; i++) out.push(d.draw ? d.draw(p, u) : quantile(d, p, u()));
  return out;
}

/** The median. */
export const median = (d: Dist, p: Params) => quantile(d, p, 0.5);

/** A sensible x range to draw: the 0.1 % to 99.9 % quantiles, inside the support. */
export function plotRange(d: Dist, p: Params): [number, number] {
  const [lo, hi] = d.support(p);
  let a = quantile(d, p, 0.001), b = quantile(d, p, 0.999);
  if (d.discrete) { a = Math.max(lo, a - 1); b = Math.min(hi, b + 1); if (b - a < 4) { a = Math.max(lo, a - 2); b = Math.min(hi, b + 2); } return [a, b]; }
  if (Number.isFinite(lo) && (a - lo) < 0.15 * (b - a)) a = lo;
  if (Number.isFinite(hi) && (hi - b) < 0.15 * (b - a)) b = hi;
  if (!(b > a)) { a -= 1; b += 1; }
  return [a, b];
}
