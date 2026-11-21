// Plain maths behind the ML foundations course simulations (src/courses/ml-foundations/). No DOM, so the
// same functions run in the browser and in tests/ml.mjs, which checks them against worked examples.

/** A seeded random number generator (mulberry32), so a simulation shows the same data on every visit. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare: number | null = null;
  /** A normal (bell curve) random number with this mean and standard deviation (Box-Muller). */
  const normal = (mu = 0, sd = 1) => {
    if (spare !== null) { const s = spare; spare = null; return mu + sd * s; }
    let u = 0; while (u === 0) u = next();
    const v = next(), m = Math.sqrt(-2 * Math.log(u));
    spare = m * Math.sin(2 * Math.PI * v);
    return mu + sd * m * Math.cos(2 * Math.PI * v);
  };
  const uniform = (lo = 0, hi = 1) => lo + (hi - lo) * next();
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  /** A new array with the items in random order (Fisher-Yates). */
  const shuffle = <T>(xs: T[]) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { next, normal, uniform, int, shuffle };
}
export type Rng = ReturnType<typeof rng>;

export const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
export const mean = (xs: number[]) => (xs.length ? sum(xs) / xs.length : NaN);
/** Variance. sample = true divides by n − 1 (an estimate from a sample), false by n (the whole population). */
export function variance(xs: number[], sample = false) {
  const m = mean(xs);
  return sum(xs.map((x) => (x - m) ** 2)) / (xs.length - (sample ? 1 : 0));
}
export const sd = (xs: number[], sample = false) => Math.sqrt(variance(xs, sample));
export function median(xs: number[]) {
  const a = xs.slice().sort((p, q) => p - q), n = a.length;
  return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
}
/** Quantile by linear interpolation between sorted values (the default in Excel's PERCENTILE.INC and NumPy). */
export function quantile(xs: number[], q: number) {
  const a = xs.slice().sort((p, r) => p - r), h = (a.length - 1) * q, lo = Math.floor(h);
  return lo + 1 < a.length ? a[lo] + (h - lo) * (a[lo + 1] - a[lo]) : a[lo];
}
export function covariance(xs: number[], ys: number[], sample = false) {
  const mx = mean(xs), my = mean(ys);
  return sum(xs.map((x, i) => (x - mx) * (ys[i] - my))) / (xs.length - (sample ? 1 : 0));
}
/** Pearson correlation r, between −1 and 1. */
export function correlation(xs: number[], ys: number[]) {
  return covariance(xs, ys) / (sd(xs) * sd(ys));
}

/** Least-squares straight line y = m·x + c (the formulas derived in lesson 3.2). */
export function fitLine(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i] - my))), sxx = sum(xs.map((x) => (x - mx) ** 2));
  const m = sxx === 0 ? 0 : sxy / sxx;
  return { m, c: my - m * mx };
}
/** Mean squared error of the line y = m·x + c on these points. */
export const mse = (xs: number[], ys: number[], m: number, c: number) => mean(xs.map((x, i) => (ys[i] - (m * x + c)) ** 2));
export const rmse = (ys: number[], preds: number[]) => Math.sqrt(mean(ys.map((y, i) => (y - preds[i]) ** 2)));
/** R²: the share of the spread in y that the predictions explain (1 is perfect, 0 is no better than the mean). */
export function r2(ys: number[], preds: number[]) {
  const my = mean(ys);
  return 1 - sum(ys.map((y, i) => (y - preds[i]) ** 2)) / sum(ys.map((y) => (y - my) ** 2));
}

export const dot = (a: number[], b: number[]) => sum(a.map((x, i) => x * b[i]));
export const norm = (a: number[]) => Math.sqrt(dot(a, a));
/** Angle between two vectors in degrees. */
export const angleDeg = (a: number[], b: number[]) => (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (norm(a) * norm(b))))) * 180) / Math.PI;

/** Slope of f at x by a central difference (what a derivative is, numerically). */
export const slopeAt = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
/** One gradient descent step on a 1-D function: x − rate · f′(x). */
export const descendStep = (f: (x: number) => number, x: number, rate: number) => x - rate * slopeAt(f, x);

/** Normal (bell curve) density. */
export const normalPdf = (x: number, mu = 0, s = 1) => Math.exp(-0.5 * ((x - mu) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
/** Normal cumulative probability, P(X ≤ x) (Abramowitz and Stegun 7.1.26 erf, error under 1.5e-7). */
export function normalCdf(x: number, mu = 0, s = 1) {
  const z = (x - mu) / (s * Math.SQRT2), t = 1 / (1 + 0.3275911 * Math.abs(z));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + (z >= 0 ? y : -y));
}

/** Counts of xs in equal bins from lo to hi. Values outside are left out. */
export function histogram(xs: number[], lo: number, hi: number, bins: number) {
  const out = new Array(bins).fill(0), w = (hi - lo) / bins;
  for (const x of xs) { const i = Math.floor((x - lo) / w); if (i >= 0 && i < bins) out[i]++; else if (x === hi) out[bins - 1]++; }
  return out;
}

/** Standardise (z-scores): subtract the mean, divide by the standard deviation. */
export function standardise(xs: number[]) { const m = mean(xs), s = sd(xs); return xs.map((x) => (s ? (x - m) / s : 0)); }
/** Min-max scale to 0..1. */
export function minMax(xs: number[]) { const lo = Math.min(...xs), hi = Math.max(...xs); return xs.map((x) => (hi > lo ? (x - lo) / (hi - lo) : 0)); }

/** Points that fall outside Tukey's fences, Q1 − k·IQR and Q3 + k·IQR (k = 1.5 is the usual box-plot rule). */
export function tukeyOutliers(xs: number[], k = 1.5) {
  const q1 = quantile(xs, 0.25), q3 = quantile(xs, 0.75), iqr = q3 - q1;
  return { q1, q3, lo: q1 - k * iqr, hi: q3 + k * iqr, out: xs.filter((x) => x < q1 - k * iqr || x > q3 + k * iqr) };
}

/** Pairs with roughly this correlation r: y = r·x + √(1 − r²)·noise, both standard normal. */
export function correlatedPairs(n: number, r: number, R: Rng) {
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i < n; i++) { const x = R.normal(), e = R.normal(); xs.push(x); ys.push(r * x + Math.sqrt(Math.max(0, 1 - r * r)) * e); }
  return { xs, ys };
}

/** Shuffle the indexes 0..n−1 and cut them into train, validation and test parts. */
export function splitIndexes(n: number, testShare: number, valShare: number, R: Rng) {
  const idx = R.shuffle([...Array(n).keys()]);
  const nt = Math.round(n * testShare), nv = Math.round(n * valShare);
  return { test: idx.slice(0, nt), val: idx.slice(nt, nt + nv), train: idx.slice(nt + nv) };
}
