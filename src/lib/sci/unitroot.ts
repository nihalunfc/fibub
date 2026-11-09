// Unit-root and cointegration tests: augmented Dickey-Fuller (lag by AIC or BIC), KPSS, and the
// Engle-Granger two-step test. The statistics follow statsmodels' adfuller, kpss and coint step by step.
// Critical values and p-values are NOT taken from published tables: they come from a seeded Monte Carlo
// simulation of each statistic under its null hypothesis, for the same sample size and settings.
// Plain functions, no DOM.
import { inv, crossprod } from './econometrics.ts';

export type Trend = 'n' | 'c' | 'ct';
type Fit = { b: number[]; se: number[]; ssr: number; n: number; k: number };

/** Least squares with standard errors (classical). X is n × k. */
function fit(y: number[], X: number[][]): Fit {
  const n = y.length, k = X[0]?.length ?? 0;
  const A = inv(crossprod(X, X));
  if (!A) throw new Error('The regression is singular: the series may be constant or too short.');
  const Xty = crossprod(X, y.map((v) => [v])).map((r) => r[0]);
  const b = A.map((r) => r.reduce((s, a, j) => s + a * Xty[j], 0));
  let ssr = 0;
  for (let i = 0; i < n; i++) { let f = 0; for (let j = 0; j < k; j++) f += X[i][j] * b[j]; ssr += (y[i] - f) ** 2; }
  const s2 = ssr / (n - k);
  return { b, se: A.map((r, j) => Math.sqrt(r[j] * s2)), ssr, n, k };
}
const llf = (f: Fit) => (-f.n / 2) * (Math.log(2 * Math.PI) + Math.log(f.ssr / f.n) + 1);
const aic = (f: Fit) => -2 * llf(f) + 2 * f.k;
const bic = (f: Fit) => -2 * llf(f) + Math.log(f.n) * f.k;
const nTrend = (t: Trend) => (t === 'n' ? 0 : t === 'c' ? 1 : 2);
const det = (t: Trend, i: number) => (t === 'n' ? [] : t === 'c' ? [1] : [1, i + 1]);

export type AdfOpts = { regression?: Trend; autolag?: 'aic' | 'bic' | null; maxlag?: number };
export type AdfResult = { stat: number; usedLag: number; nobs: number; maxlag: number; ic: number | null; gamma: number; seGamma: number };

/** Schwert's rule used by statsmodels for the largest lag: ceil(12 (n/100)^(1/4)). */
export const schwert = (n: number) => Math.ceil(12 * Math.pow(n / 100, 1 / 4));

/**
 * Augmented Dickey-Fuller test of a unit root (statsmodels adfuller): Δx_t on x_{t−1}, lagged Δx and the
 * deterministic terms; the statistic is the t ratio of x_{t−1}. With autolag, every lag 0..maxlag is fitted on
 * the same sample and the lowest AIC or BIC wins; the chosen model is then refitted on all usable rows.
 */
export function adf(x: number[], o: AdfOpts = {}): AdfResult {
  const reg = o.regression ?? 'c', auto = o.autolag === undefined ? 'aic' : o.autolag, n = x.length, nt = nTrend(reg);
  if (x.some((v) => !Number.isFinite(v))) throw new Error('The series has blanks or text in it.');
  let maxlag: number;
  if (o.maxlag == null) {
    maxlag = Math.min(Math.floor(n / 2) - nt - 1, schwert(n));
    if (maxlag < 0) throw new Error('The series is too short for this test.');
  } else {
    maxlag = o.maxlag;
    if (maxlag > Math.floor(n / 2) - nt - 1) throw new Error(`The largest lag must be at most ${Math.floor(n / 2) - nt - 1} for ${n} observations.`);
    if (maxlag < 0) throw new Error('The number of lags cannot be negative.');
  }
  const dx = x.slice(1).map((v, i) => v - x[i]);
  // Rows for lag L: t runs over positions where Δx_t and L lags exist. xdiff index j = 0..n−2.
  const design = (L: number, start: number, prepend: boolean) => {
    const rows: number[][] = [], y: number[] = [];
    for (let j = start; j < dx.length; j++) {
      const lags = Array.from({ length: L }, (_, l) => dx[j - l - 1]);
      const d = det(reg, j - start);
      rows.push(prepend ? [...d, x[j], ...lags] : [x[j], ...lags, ...d]);
      y.push(dx[j]);
    }
    return { rows, y };
  };
  let used = maxlag, ic: number | null = null;
  if (auto) {
    const { rows, y } = design(maxlag, maxlag, true);
    let best = Infinity, bestLag = 0;
    for (let L = 0; L <= maxlag; L++) {
      const f = fit(y, rows.map((r) => r.slice(0, nt + 1 + L)));
      const v = auto === 'aic' ? aic(f) : bic(f);
      if (v < best) { best = v; bestLag = L; }
    }
    used = bestLag; ic = best;
  }
  const { rows, y } = design(used, used, false);
  const f = fit(y, rows);
  return { stat: f.b[0] / f.se[0], usedLag: used, nobs: y.length, maxlag, ic, gamma: f.b[0], seGamma: f.se[0] };
}

export type KpssOpts = { regression?: 'c' | 'ct'; nlags?: 'auto' | 'legacy' | number };
export type KpssResult = { stat: number; lags: number; nobs: number };

function kpssResid(x: number[], reg: 'c' | 'ct') {
  if (reg === 'c') { const m = x.reduce((s, v) => s + v, 0) / x.length; return x.map((v) => v - m); }
  const f = fit(x, x.map((_, i) => [1, i + 1]));
  return x.map((v, i) => v - f.b[0] - f.b[1] * (i + 1));
}
function kpssStat(e: number[], lags: number) {
  const n = e.length;
  let cs = 0, eta = 0;
  for (const v of e) { cs += v; eta += cs * cs; }
  eta /= n * n;
  let s = e.reduce((a, v) => a + v * v, 0);
  for (let i = 1; i <= lags; i++) { let p = 0; for (let t = i; t < n; t++) p += e[t] * e[t - i]; s += 2 * p * (1 - i / (lags + 1)); }
  return eta / (s / n);
}
/** Hobijn, Franses and Ooms (1998) automatic bandwidth, as statsmodels computes it. */
function kpssAutolag(e: number[]) {
  const n = e.length, cov = Math.floor(Math.pow(n, 2 / 9));
  let s0 = e.reduce((a, v) => a + v * v, 0) / n, s1 = 0;
  for (let i = 1; i <= cov; i++) { let p = 0; for (let t = i; t < n; t++) p += e[t] * e[t - i]; p /= n / 2; s0 += p; s1 += i * p; }
  const sh = s1 / s0;
  return Math.floor(1.1447 * Math.pow(sh * sh, 1 / 3) * Math.pow(n, 1 / 3));
}
/** KPSS test of (level or trend) stationarity, the null being stationarity (statsmodels kpss). */
export function kpss(x: number[], o: KpssOpts = {}): KpssResult {
  const reg = o.regression ?? 'c', n = x.length;
  if (x.some((v) => !Number.isFinite(v))) throw new Error('The series has blanks or text in it.');
  if (n < 4) throw new Error('The series is too short for this test.');
  const e = kpssResid(x, reg);
  const nl = o.nlags ?? 'auto';
  let lags: number;
  if (nl === 'legacy') lags = Math.min(schwert(n), n - 1);
  else if (nl === 'auto') lags = Math.min(kpssAutolag(e), n - 1);
  else { lags = nl; if (lags >= n || lags < 0) throw new Error(`The number of lags must be between 0 and ${n - 1}.`); }
  return { stat: kpssStat(e, lags), lags, nobs: n };
}

export type EgResult = AdfResult & { coefs: number[]; resid: number[]; kVars: number; trend: Trend };
/**
 * Engle-Granger two-step test (statsmodels coint, method 'aeg'): regress y on the other series plus the
 * deterministic terms, then an ADF test without constant on the residuals. The null is no cointegration.
 */
export function engleGranger(y: number[], X: number[][], o: { trend?: 'c' | 'ct'; autolag?: 'aic' | 'bic' | null; maxlag?: number } = {}): EgResult {
  const trend = o.trend ?? 'c', n = y.length;
  if (!X.length || !X[0].length) throw new Error('Choose at least one other series.');
  const rows = y.map((_, i) => [...X[i], ...det(trend, i)]);
  const f = fit(y, rows);
  const resid = y.map((v, i) => v - rows[i].reduce((s, a, j) => s + a * f.b[j], 0));
  const ybar = y.reduce((s, v) => s + v, 0) / n, tss = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  if (1 - f.ssr / tss > 1 - 100 * Math.sqrt(2.220446049250313e-16)) throw new Error('The series are (almost) perfectly collinear, so the test is not reliable.');
  const a = adf(resid, { regression: 'n', autolag: o.autolag === undefined ? 'aic' : o.autolag, maxlag: o.maxlag });
  return { ...a, coefs: f.b, resid, kVars: X[0].length + 1, trend };
}

// ---------- Monte Carlo null distributions ----------

/** A seeded generator of standard normal numbers (mulberry32 and Box-Muller), so every run gives the same answer. */
export function normalRng(seed: number) {
  let a = seed >>> 0, spare: number | null = null;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (((t ^ (t >>> 14)) >>> 0) + 0.5) / 4294967296; };
  return () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    const r = Math.sqrt(-2 * Math.log(u())), th = 2 * Math.PI * u();
    spare = r * Math.sin(th); return r * Math.cos(th);
  };
}

/** Dickey-Fuller t ratio without augmentation lags, on a series of length T + 1. Fast: no matrices beyond 3 × 3. */
function dfStat(x: number[], reg: Trend) {
  const T = x.length - 1, nt = nTrend(reg), k = nt + 1;
  const S = Array.from({ length: k }, () => new Array(k).fill(0)), r = new Array(k).fill(0);
  let yy = 0;
  const v = new Array(k);
  for (let j = 0; j < T; j++) {
    v[0] = x[j]; if (nt >= 1) v[1] = 1; if (nt === 2) v[2] = j + 1;
    const d = x[j + 1] - x[j];
    for (let a = 0; a < k; a++) { r[a] += v[a] * d; for (let c = a; c < k; c++) S[a][c] += v[a] * v[c]; }
    yy += d * d;
  }
  for (let a = 0; a < k; a++) for (let c = 0; c < a; c++) S[a][c] = S[c][a];
  const A = inv(S);
  if (!A) return NaN;
  const b = A.map((row) => row.reduce((s, q, j) => s + q * r[j], 0));
  const ssr = yy - b.reduce((s, bj, j) => s + bj * r[j], 0);
  return b[0] / Math.sqrt((A[0][0] * ssr) / (T - k));
}

export type NullSpec =
  | { test: 'adf'; regression: Trend; T: number }
  | { test: 'kpss'; regression: 'c' | 'ct'; n: number; lags: number }
  | { test: 'eg'; trend: 'c' | 'ct'; n: number; k: number };

/**
 * `reps` draws of the statistic under the null:
 * ADF — a Gaussian random walk with T + 1 points, Dickey-Fuller t ratio with the same deterministic terms
 * (T is the number of rows in the data's final ADF regression, as in MacKinnon's response surfaces);
 * KPSS — Gaussian white noise of length n, same detrending and the same number of lags;
 * Engle-Granger — k independent Gaussian random walks of length n, the same first-step regression, then the
 * Dickey-Fuller t ratio without constant on its residuals.
 */
export function simulateNull(spec: NullSpec, reps: number, rand: () => number): number[] {
  const out: number[] = [];
  for (let r = 0; r < reps; r++) {
    if (spec.test === 'adf') {
      const x = new Array(spec.T + 1); x[0] = 0;
      for (let i = 1; i <= spec.T; i++) x[i] = x[i - 1] + rand();
      out.push(dfStat(x, spec.regression));
    } else if (spec.test === 'kpss') {
      const e = Array.from({ length: spec.n }, rand);
      out.push(kpssStat(kpssResid(e, spec.regression), spec.lags));
    } else {
      const W = Array.from({ length: spec.k }, () => { const w = new Array(spec.n); w[0] = rand(); for (let i = 1; i < spec.n; i++) w[i] = w[i - 1] + rand(); return w; });
      const y = W[0], X = y.map((_, i) => [...W.slice(1).map((w) => w[i]), ...det(spec.trend, i)]);
      const f = fit(y, X);
      const e = y.map((v, i) => v - X[i].reduce((s, a, j) => s + a * f.b[j], 0));
      out.push(dfStat(e, 'n'));
    }
  }
  return out;
}

/** Quantile of sorted draws (type 7). */
export function quantile(sorted: number[], p: number) {
  const h = (sorted.length - 1) * p, i = Math.floor(h);
  return i + 1 < sorted.length ? sorted[i] + (h - i) * (sorted[i + 1] - sorted[i]) : sorted[sorted.length - 1];
}
/**
 * Simulated p-value with the usual +1 correction, (1 + #draws as extreme) / (1 + R), and its Monte Carlo
 * standard error. ADF and Engle-Granger reject for small (very negative) values, KPSS for large ones.
 */
export function simPValue(draws: number[], stat: number, lowerTail: boolean) {
  const R = draws.length, hit = draws.reduce((s, d) => s + ((lowerTail ? d <= stat : d >= stat) ? 1 : 0), 0);
  const p = (1 + hit) / (1 + R);
  return { p, se: Math.sqrt((p * (1 - p)) / R) };
}
/** Critical values at the usual levels from sorted draws. */
export function criticalValues(sorted: number[], lowerTail: boolean, levels = [0.01, 0.025, 0.05, 0.1]) {
  return levels.map((a) => ({ level: a, value: quantile(sorted, lowerTail ? a : 1 - a) }));
}
