// Time series maths for the time series analyser: classical and STL decomposition, differencing, ACF and PACF with
// confidence bands, the Ljung-Box test, and ARIMA(p, d, q) fitted by exact Gaussian maximum likelihood (Kalman
// filter) with forecasts and intervals. Plain TypeScript, no DOM.
// STL is a line-by-line port of Cleveland, Cleveland, McRae and Terpenning's (1990) Fortran routines (stl.f, as used by
// R and statsmodels); classical decomposition follows statsmodels' seasonal_decompose. Checked against statsmodels.
import { parseTable, num } from './num.ts';
import { DIST, normPpf } from './distributions.ts';

// ---------- Reading ----------
export type Series = { labels: string[]; x: number[]; header: string | null };
/** One column of values, or two (time label, value). A first row that is not a number is a header. Gaps are refused. */
export function readSeries(text: string): Series {
  const rows = parseTable(text).filter((r) => r.some((c) => c !== ''));
  if (!rows.length) throw new Error('Paste a series: one value per line, or two columns (time, value).');
  const two = rows.filter((r) => r.length >= 2).length >= rows.length / 2;
  const vi = two ? 1 : 0;
  let header: string | null = null, body = rows;
  if (Number.isNaN(num(rows[0][vi] ?? ''))) { header = rows[0][vi] ?? null; body = rows.slice(1); }
  const labels: string[] = [], x: number[] = [];
  body.forEach((r, i) => {
    const v = num(r[vi] ?? '');
    if (!Number.isFinite(v)) throw new Error(`Row ${i + 1 + (header ? 1 : 0)} has no number (“${r[vi] ?? ''}”). Fill gaps first: decomposition and ARIMA need evenly spaced values with none missing.`);
    labels.push(two ? r[0] : String(i + 1)); x.push(v);
  });
  return { labels, x, header };
}

// ---------- Summaries ----------
const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
const variance = (a: number[]) => { const f = a.filter(Number.isFinite), m = mean(f); return f.reduce((s, v) => s + (v - m) ** 2, 0) / (f.length - 1); };

// ---------- Classical decomposition ----------
export type Decomp = { trend: number[]; seasonal: number[]; resid: number[]; type: 'additive' | 'multiplicative'; seasonalIndex: number[] };
/** Centred moving average (2 x m for even m), NaN at the ends, as statsmodels seasonal_decompose. */
export function centredMA(x: number[], m: number): number[] {
  const f = m % 2 === 0 ? [0.5, ...new Array(m - 1).fill(1), 0.5].map((v) => v / m) : new Array(m).fill(1 / m);
  const h = Math.floor(f.length / 2), n = x.length;
  return x.map((_, t) => { if (t - h < 0 || t + h >= n) return NaN; let s = 0; for (let k = 0; k < f.length; k++) s += f[k] * x[t - h + k]; return s; });
}
export function classical(x: number[], m: number, type: 'additive' | 'multiplicative' = 'additive'): Decomp {
  const n = x.length;
  if (n < 2 * m) throw new Error(`Classical decomposition needs at least two full cycles (${2 * m} values); there are ${n}.`);
  if (type === 'multiplicative' && x.some((v) => v <= 0)) throw new Error('Multiplicative decomposition needs every value above zero.');
  const trend = centredMA(x, m);
  const det = x.map((v, i) => (type === 'additive' ? v - trend[i] : v / trend[i]));
  const avg = Array.from({ length: m }, (_, i) => { const a: number[] = []; for (let t = i; t < n; t += m) if (Number.isFinite(det[t])) a.push(det[t]); return mean(a); });
  const c = mean(avg), idx = avg.map((v) => (type === 'additive' ? v - c : v / c));
  const seasonal = x.map((_, t) => idx[t % m]);
  const resid = det.map((v, t) => (type === 'additive' ? v - seasonal[t] : v / seasonal[t]));
  return { trend, seasonal, resid, type, seasonalIndex: idx };
}

// ---------- STL (port of the Fortran stl.f) ----------
// Arrays below are 1-based (index 0 unused) to keep the port line-for-line checkable.
function stlest(y: number[], n: number, len: number, ideg: number, xs: number, nleft: number, nright: number, w: number[], userw: boolean, rw: number[]): number | null {
  const range = n - 1;
  let h = Math.max(xs - nleft, nright - xs);
  if (len > n) h += Math.floor((len - n) / 2);
  const h9 = 0.999 * h, h1 = 0.001 * h;
  let a = 0;
  for (let j = nleft; j <= nright; j++) {
    w[j] = 0;
    const r = Math.abs(j - xs);
    if (r <= h9) {
      w[j] = r <= h1 ? 1 : (1 - (r / h) ** 3) ** 3;
      if (userw) w[j] *= rw[j];
      a += w[j];
    }
  }
  if (a <= 0) return null;
  for (let j = nleft; j <= nright; j++) w[j] /= a;
  if (h > 0 && ideg > 0) {
    a = 0;
    for (let j = nleft; j <= nright; j++) a += w[j] * j;
    let b = xs - a, c = 0;
    for (let j = nleft; j <= nright; j++) c += w[j] * (j - a) * (j - a);
    if (Math.sqrt(c) > 0.001 * range) {
      b /= c;
      for (let j = nleft; j <= nright; j++) w[j] *= b * (j - a) + 1;
    }
  }
  let ys = 0;
  for (let j = nleft; j <= nright; j++) ys += w[j] * y[j];
  return ys;
}
function stless(y: number[], n: number, len: number, ideg: number, njump: number, userw: boolean, rw: number[], ys: number[], off: number, res: number[]) {
  // ys is written at ys[off + i] for i = 1..n.
  if (n < 2) { ys[off + 1] = y[1]; return; }
  const newnj = Math.min(njump, n - 1);
  let nleft = 0, nright = 0;
  const est = (i: number) => { const v = stlest(y, n, len, ideg, i, nleft, nright, res, userw, rw); ys[off + i] = v === null ? y[i] : v; };
  if (len >= n) {
    nleft = 1; nright = n;
    for (let i = 1; i <= n; i += newnj) est(i);
  } else if (newnj === 1) {
    const nsh = Math.floor((len + 1) / 2);
    nleft = 1; nright = len;
    for (let i = 1; i <= n; i++) {
      if (i > nsh && nright !== n) { nleft++; nright++; }
      est(i);
    }
  } else {
    const nsh = Math.floor((len + 1) / 2);
    for (let i = 1; i <= n; i += newnj) {
      if (i < nsh) { nleft = 1; nright = len; }
      else if (i >= n - nsh + 1) { nleft = n - len + 1; nright = n; }
      else { nleft = i - nsh + 1; nright = len + i - nsh; }
      est(i);
    }
  }
  if (newnj !== 1) {
    for (let i = 1; i <= n - newnj; i += newnj) {
      const delta = (ys[off + i + newnj] - ys[off + i]) / newnj;
      for (let j = i + 1; j <= i + newnj - 1; j++) ys[off + j] = ys[off + i] + delta * (j - i);
    }
    const k = Math.floor((n - 1) / newnj) * newnj + 1;
    if (k !== n) {
      est(n);
      if (k !== n - 1) {
        const delta = (ys[off + n] - ys[off + k]) / (n - k);
        for (let j = k + 1; j <= n - 1; j++) ys[off + j] = ys[off + k] + delta * (j - k);
      }
    }
  }
}
function stlss(y: number[], n: number, np: number, ns: number, isdeg: number, nsjump: number, userw: boolean, rw: number[], season: number[]) {
  // season is 1-based with n + 2 np values.
  for (let j = 1; j <= np; j++) {
    const k = Math.floor((n - j) / np) + 1;
    const w1 = [0], w3 = [0], w2 = new Array(k + 3).fill(0), w4 = new Array(k + 2).fill(0);
    for (let i = 1; i <= k; i++) w1[i] = y[(i - 1) * np + j];
    if (userw) for (let i = 1; i <= k; i++) w3[i] = rw[(i - 1) * np + j];
    stless(w1, k, ns, isdeg, nsjump, userw, w3, w2, 1, w4);
    let nright = Math.min(ns, k);
    let v = stlest(w1, k, ns, isdeg, 0, 1, nright, w4, userw, w3);
    w2[1] = v === null ? w2[2] : v;
    const nleft = Math.max(1, k - ns + 1);
    nright = k;
    v = stlest(w1, k, ns, isdeg, k + 1, nleft, nright, w4, userw, w3);
    w2[k + 2] = v === null ? w2[k + 1] : v;
    for (let m = 1; m <= k + 2; m++) season[(m - 1) * np + j] = w2[m];
  }
}
function stlma(x: number[], n: number, len: number, ave: number[]) {
  const newn = n - len + 1;
  let v = 0;
  for (let i = 1; i <= len; i++) v += x[i];
  ave[1] = v / len;
  if (newn > 1) {
    let k = len, m = 0;
    for (let j = 2; j <= newn; j++) { k++; m++; v = v - x[m] + x[k]; ave[j] = v / len; }
  }
}
function stlfts(x: number[], n: number, np: number, trend: number[], work: number[]) {
  stlma(x, n, np, trend);
  stlma(trend, n - np + 1, np, work);
  stlma(work, n - 2 * np + 2, 3, trend);
}
export type StlOpts = { seasonal?: number; trend?: number; lowPass?: number; robust?: boolean; seasonalDeg?: number; trendDeg?: number; lowPassDeg?: number; inner?: number; outer?: number };
/** STL decomposition with statsmodels' defaults: seasonal window 7, trend window the next odd number above 1.5 np / (1 - 1.5/ns), low-pass window the next odd number above np, jumps of 1. */
export function stl(x: number[], period: number, o: StlOpts = {}): Decomp & { weights: number[] } {
  const n = x.length, np = period;
  if (np < 2) throw new Error('The season length must be at least 2.');
  if (n < 2 * np) throw new Error(`STL needs at least two full cycles (${2 * np} values); there are ${n}.`);
  let ns = o.seasonal ?? 7;
  if (ns < 3 || ns % 2 === 0) throw new Error('The seasonal window must be an odd whole number of 3 or more.');
  let nt = o.trend ?? Math.ceil((1.5 * np) / (1 - 1.5 / ns)); if (nt % 2 === 0) nt++;
  let nl = o.lowPass ?? np + 1; if (nl % 2 === 0) nl++;
  if (nt < 3 || nt % 2 === 0 || nt <= np) throw new Error('The trend window must be an odd whole number above the season length.');
  if (nl < 3 || nl % 2 === 0 || nl <= np) throw new Error('The low-pass window must be an odd whole number above the season length.');
  const isdeg = o.seasonalDeg ?? 1, itdeg = o.trendDeg ?? 1, ildeg = o.lowPassDeg ?? 1;
  const robust = o.robust ?? false, ni = o.inner ?? (robust ? 2 : 5), no = o.outer ?? (robust ? 15 : 0);
  const y = [0, ...x], trend = new Array(n + 1).fill(0), season = new Array(n + 1).fill(0), rw = new Array(n + 1).fill(1);
  let userw = false;
  const step = () => {
    const w1 = new Array(n + 2 * np + 1).fill(0), w2 = new Array(n + 2 * np + 1).fill(0), w3 = new Array(n + 2 * np + 1).fill(0), w5 = new Array(n + 2 * np + 1).fill(0);
    for (let it = 0; it < ni; it++) {
      for (let i = 1; i <= n; i++) w1[i] = y[i] - trend[i];
      stlss(w1, n, np, ns, isdeg, 1, userw, rw, w2);
      stlfts(w2, n + 2 * np, np, w3, w1);
      stless(w3, n, nl, ildeg, 1, false, w5, w1, 0, w5.slice());
      for (let i = 1; i <= n; i++) season[i] = w2[np + i] - w1[i];
      for (let i = 1; i <= n; i++) w1[i] = y[i] - season[i];
      stless(w1, n, nt, itdeg, 1, userw, rw, trend, 0, w3);
    }
  };
  for (let k = 0; ; k++) {
    step();
    if (k + 1 > no) break;
    // Robustness weights: bisquare of residuals over six median absolute residuals.
    const r = x.map((v, i) => Math.abs(v - trend[i + 1] - season[i + 1])), s = [...r].sort((a, b) => a - b);
    const m1 = Math.floor(n / 2) + 1, m2 = n - m1 + 1, cmad = 3 * (s[m1 - 1] + s[m2 - 1]), c9 = 0.999 * cmad, c1 = 0.001 * cmad;
    r.forEach((v, i) => { rw[i + 1] = v <= c1 ? 1 : v <= c9 ? (1 - (v / cmad) ** 2) ** 2 : 0; });
    userw = true;
  }
  if (no <= 0) rw.fill(1);
  const T = trend.slice(1), S = season.slice(1);
  const idx = Array.from({ length: np }, (_, i) => { const a: number[] = []; for (let t = i; t < n; t += np) a.push(S[t]); return mean(a); });
  return { trend: T, seasonal: S, resid: x.map((v, i) => v - T[i] - S[i]), type: 'additive', seasonalIndex: idx, weights: rw.slice(1) };
}
/** Strength of trend and seasonality (Wang, Smith and Hyndman 2006), from 0 (none) to 1. */
export function strength(d: Decomp): { trend: number; seasonal: number } {
  const ok = d.resid.map((r, i) => Number.isFinite(r) && Number.isFinite(d.trend[i]));
  const add = d.type === 'additive';
  const R = d.resid.filter((_, i) => ok[i]).map((r) => (add ? r : Math.log(r)));
  const TR = d.resid.map((r, i) => (add ? d.trend[i] + r : Math.log(d.trend[i] * r))).filter((_, i) => ok[i]);
  const SR = d.resid.map((r, i) => (add ? d.seasonal[i] + r : Math.log(d.seasonal[i] * r))).filter((_, i) => ok[i]);
  const vr = variance(R);
  return { trend: Math.max(0, 1 - vr / variance(TR)), seasonal: Math.max(0, 1 - vr / variance(SR)) };
}

// ---------- Differencing, ACF, PACF, Ljung-Box ----------
/** Apply d ordinary and D seasonal (lag m) differences. */
export function difference(x: number[], d: number, D = 0, m = 1): number[] {
  let y = x.slice();
  for (let k = 0; k < D; k++) y = y.slice(m).map((v, i) => v - y[i]);
  for (let k = 0; k < d; k++) y = y.slice(1).map((v, i) => v - y[i]);
  return y;
}
/** Sample autocorrelations r_0..r_nlags (mean removed, divisor n), as statsmodels acf. */
export function acf(x: number[], nlags: number): number[] {
  const n = x.length, m = mean(x), y = x.map((v) => v - m), c0 = y.reduce((s, v) => s + v * v, 0) / n, out = [1];
  for (let k = 1; k <= nlags; k++) { let s = 0; for (let i = 0; i < n - k; i++) s += y[i] * y[i + k]; out.push(s / n / c0); }
  return out;
}
/** Bartlett's band half-width at each lag: z sqrt((1 + 2 sum_{j<k} r_j^2)/n), as statsmodels acf(alpha=...). */
export function bartlett(r: number[], n: number, conf = 0.95): number[] {
  const z = normPpf(1 - (1 - conf) / 2); let s = 0;
  return r.map((_, k) => { if (k === 0) return 0; const v = (1 + 2 * s) / n; s += r[k] ** 2; return z * Math.sqrt(v); });
}
/** Partial autocorrelations from the sample ACF by Durbin-Levinson (Yule-Walker with divisor n, statsmodels method 'ywm'). */
export function pacf(x: number[], nlags: number): number[] {
  const r = acf(x, nlags), out = [1];
  let phi: number[] = [];
  for (let k = 1; k <= nlags; k++) {
    let num_ = r[k], den = 1;
    for (let j = 1; j < k; j++) { num_ -= phi[j - 1] * r[k - j]; den -= phi[j - 1] * r[j]; }
    const a = num_ / den;
    phi = [...phi.map((p, j) => p - a * phi[k - 2 - j]), a];
    out.push(a);
  }
  return out;
}
/** Ljung-Box Q at lag h with h - modelDf degrees of freedom. */
export function ljungBox(x: number[], h: number, modelDf = 0) {
  const n = x.length, r = acf(x, h);
  let q = 0; for (let k = 1; k <= h; k++) q += (r[k] * r[k]) / (n - k);
  q *= n * (n + 2);
  const df = h - modelDf;
  return { q, df, p: df > 0 ? DIST.chi2.sf(q, { k: df }) : NaN };
}

// ---------- ARMA likelihood (Kalman filter) ----------
/** Polynomial coefficients from partial autocorrelations in (-1, 1), so AR parts stay stationary (Durbin-Levinson). */
export function fromPacf(r: number[]): number[] {
  let phi: number[] = [];
  r.forEach((a, k) => { phi = [...phi.map((p, j) => p - a * phi[k - 1 - j]), a]; });
  return phi;
}
/** The inverse: partial autocorrelations of an AR polynomial (NaN if it is not stationary). */
export function toPacf(phi: number[]): number[] {
  let a = phi.slice(); const out: number[] = [];
  for (let k = a.length; k >= 1; k--) {
    const rk = a[k - 1]; out.unshift(rk);
    if (Math.abs(rk) >= 1) return phi.map(() => NaN);
    a = a.slice(0, k - 1).map((p, j) => (p + rk * a[k - 2 - j]) / (1 - rk * rk));
  }
  return out;
}
function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}
function invert(A: number[][]): number[][] {
  const n = A.length;
  return Array.from({ length: n }, (_, j) => solve(A, A.map((_, i) => (i === j ? 1 : 0)))).reduce((M, col, j) => { col.forEach((v, i) => (M[i][j] = v)); return M; }, Array.from({ length: n }, () => new Array(n).fill(0)));
}
type SS = { r: number; T: number[][]; R: number[]; P0: number[][] };
function stateSpace(phi: number[], theta: number[]): SS {
  const r = Math.max(phi.length, theta.length + 1);
  const T = Array.from({ length: r }, (_, i) => Array.from({ length: r }, (_, j) => (j === 0 ? phi[i] ?? 0 : j === i + 1 ? 1 : 0)));
  const R = Array.from({ length: r }, (_, i) => (i === 0 ? 1 : theta[i - 1] ?? 0));
  // Stationary covariance: (I - T (x) T) vec(P) = vec(R R^T).
  const r2 = r * r, A = Array.from({ length: r2 }, () => new Array(r2).fill(0)), b = new Array(r2).fill(0);
  for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) {
    const row = i * r + j; A[row][row] += 1; b[row] = R[i] * R[j];
    for (let k = 0; k < r; k++) for (let l = 0; l < r; l++) A[row][k * r + l] -= T[i][k] * T[j][l];
  }
  const v = solve(A, b);
  const P0 = Array.from({ length: r }, (_, i) => Array.from({ length: r }, (_, j) => v[i * r + j]));
  return { r, T, R, P0 };
}
type Filter = { v: number[]; F: number[]; a: number[]; P: number[][]; ss: SS };
/** Kalman filter for w - mu ~ ARMA(phi, theta) with unit innovation variance. Returns innovations, their variances and the predicted state after the last value. */
function kalman(w: number[], mu: number, phi: number[], theta: number[]): Filter {
  const ss = stateSpace(phi, theta), { r, T, R } = ss;
  let a = new Array(r).fill(0), P = ss.P0.map((row) => row.slice());
  const v: number[] = [], F: number[] = [];
  for (const y of w) {
    const vt = y - mu - a[0], Ft = P[0][0];
    v.push(vt); F.push(Ft);
    // Update.
    const k = P.map((row) => row[0] / Ft);
    const au = a.map((ai, i) => ai + k[i] * vt);
    const Pu = P.map((row, i) => row.map((pij, j) => pij - k[i] * P[0][j]));
    // Predict.
    a = T.map((row) => row.reduce((s, tij, j) => s + tij * au[j], 0));
    const TP = T.map((row) => Pu[0].map((_, j) => row.reduce((s, tik, kk) => s + tik * Pu[kk][j], 0)));
    P = TP.map((row, i) => T.map((trow, j) => row.reduce((s, v2, kk) => s + v2 * trow[kk], 0) + R[i] * R[j]));
  }
  return { v, F, a, P, ss };
}
/** Exact Gaussian log-likelihood of an ARMA model with mean mu and innovation variance sigma2. */
export function armaLoglik(w: number[], mu: number, phi: number[], theta: number[], sigma2: number): number {
  const { v, F } = kalman(w, mu, phi, theta);
  let ll = 0; for (let t = 0; t < w.length; t++) ll -= 0.5 * (Math.log(2 * Math.PI * sigma2 * F[t]) + (v[t] * v[t]) / (sigma2 * F[t]));
  return ll;
}
function concentrated(w: number[], mu: number, phi: number[], theta: number[]) {
  const f = kalman(w, mu, phi, theta), n = w.length;
  let s = 0, lf = 0; for (let t = 0; t < n; t++) { s += (f.v[t] * f.v[t]) / f.F[t]; lf += Math.log(f.F[t]); }
  const sigma2 = s / n;
  return { ll: -0.5 * n * (Math.log(2 * Math.PI * sigma2) + 1) - 0.5 * lf, sigma2, f };
}

// ---------- Optimiser ----------
function bfgs(f: (x: number[]) => number, x0: number[], maxIter = 300): { x: number[]; fx: number; iterations: number } {
  const n = x0.length;
  if (!n) return { x: [], fx: f([]), iterations: 0 };
  const grad = (x: number[]) => x.map((_, i) => { const h = 1e-6 * Math.max(1, Math.abs(x[i])); const a = x.slice(), b = x.slice(); a[i] += h; b[i] -= h; return (f(a) - f(b)) / (2 * h); });
  let x = x0.slice(), fx = f(x), g = grad(x);
  let H = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  let it = 0;
  for (; it < maxIter; it++) {
    if (Math.sqrt(g.reduce((s, v) => s + v * v, 0)) < 1e-7) break;
    let d = H.map((row) => -row.reduce((s, h, j) => s + h * g[j], 0));
    let slope = d.reduce((s, v, i) => s + v * g[i], 0);
    if (!(slope < 0)) { H = H.map((row, i) => row.map((_, j) => (i === j ? 1 : 0))); d = g.map((v) => -v); slope = -g.reduce((s, v) => s + v * v, 0); }
    let t = 1, xn = x, fn = fx;
    for (let k = 0; k < 60; k++) { xn = x.map((v, i) => v + t * d[i]); fn = f(xn); if (Number.isFinite(fn) && fn <= fx + 1e-4 * t * slope) break; t /= 2; }
    if (!(fn < fx)) break;
    const gn = grad(xn), s = xn.map((v, i) => v - x[i]), y = gn.map((v, i) => v - g[i]);
    const sy = s.reduce((a, v, i) => a + v * y[i], 0);
    if (sy > 1e-12) {
      const Hy = H.map((row) => row.reduce((a, h, j) => a + h * y[j], 0)), yHy = y.reduce((a, v, i) => a + v * Hy[i], 0);
      H = H.map((row, i) => row.map((h, j) => h + ((sy + yHy) * s[i] * s[j]) / (sy * sy) - (Hy[i] * s[j] + s[i] * Hy[j]) / sy));
    }
    const done = Math.abs(fx - fn) < 1e-12 * (Math.abs(fx) + 1);
    x = xn; fx = fn; g = gn;
    if (done) { it++; break; }
  }
  return { x, fx, iterations: it };
}

// ---------- ARIMA ----------
export type ArimaFit = {
  p: number; d: number; q: number; mean: boolean; n: number; nEff: number;
  mu: number; phi: number[]; theta: number[]; sigma2: number; llf: number; aic: number; aicc: number; bic: number;
  names: string[]; est: number[]; se: number[]; z: number[]; pv: number[];
  resid: number[]; fitted: number[]; x: number[]; filter: Filter; iterations: number; warnings: string[];
};
/** Starting values: long autoregression residuals, then least squares on lagged values and residuals (Hannan-Rissanen). */
function hannanRissanen(w: number[], p: number, q: number): { phi: number[]; theta: number[] } {
  const n = w.length, m = mean(w), y = w.map((v) => v - m);
  let e = new Array(n).fill(0);
  if (q > 0) {
    const L = Math.min(Math.max(p + q + 3, Math.round(Math.log(n) ** 2)), Math.floor(n / 3));
    const r = acf(y, L), pa = pacf(y, L).slice(1), ar = fromPacf(pa);
    void r;
    e = y.map((v, t) => (t < L ? 0 : v - ar.reduce((s, a, k) => s + a * y[t - k - 1], 0)));
  }
  const start = Math.max(p, q) + (q > 0 ? Math.min(Math.max(p + q + 3, Math.round(Math.log(n) ** 2)), Math.floor(n / 3)) : 0);
  const rows: number[][] = [], tgt: number[] = [];
  for (let t = start; t < n; t++) { const row: number[] = []; for (let k = 1; k <= p; k++) row.push(y[t - k]); for (let k = 1; k <= q; k++) row.push(e[t - k]); rows.push(row); tgt.push(y[t]); }
  if (!rows.length || rows.length <= p + q) return { phi: new Array(p).fill(0), theta: new Array(q).fill(0) };
  const XtX = Array.from({ length: p + q }, (_, i) => Array.from({ length: p + q }, (_, j) => rows.reduce((s, r) => s + r[i] * r[j], 0)));
  const Xty = Array.from({ length: p + q }, (_, i) => rows.reduce((s, r, k) => s + r[i] * tgt[k], 0));
  const b = solve(XtX, Xty);
  return { phi: b.slice(0, p), theta: b.slice(p) };
}
const clipPacf = (r: number[]) => r.map((v) => (Number.isFinite(v) ? Math.max(-0.95, Math.min(0.95, v)) : 0));

export function arima(x: number[], p: number, d: number, q: number, includeMean = d === 0): ArimaFit {
  const w = difference(x, d), n = w.length, warnings: string[] = [];
  const k = p + q + (includeMean ? 1 : 0) + 1;
  if (n < k + 5 || n < 10) throw new Error(`After differencing there are ${n} values: too few for ${k} parameters. Use a smaller model or a longer series.`);
  const m0 = mean(w), s0 = Math.sqrt(variance(w)) || 1;
  // Unconstrained parameters: [scaled mean], atanh(PACF of AR), atanh(PACF of -MA).
  const unpack = (u: number[]) => {
    let i = 0;
    const mu = includeMean ? m0 + s0 * u[i++] : 0;
    const phi = fromPacf(u.slice(i, i + p).map(Math.tanh)); i += p;
    const theta = fromPacf(u.slice(i, i + q).map(Math.tanh)).map((v) => -v);
    return { mu, phi, theta };
  };
  const obj = (u: number[]) => { const z = unpack(u); const c = concentrated(w, z.mu, z.phi, z.theta); return Number.isFinite(c.ll) ? -c.ll : 1e300; };
  const pack = (phi: number[], theta: number[]) => [...(includeMean ? [0] : []), ...clipPacf(toPacf(phi)).map(Math.atanh), ...clipPacf(toPacf(theta.map((v) => -v))).map(Math.atanh)];
  const starts = [pack(new Array(p).fill(0), new Array(q).fill(0))];
  try { const hr = hannanRissanen(w, p, q); starts.push(pack(hr.phi, hr.theta)); } catch { /* keep zeros */ }
  let best = { x: starts[0], fx: Infinity, iterations: 0 };
  for (const s of starts) { const r = bfgs(obj, s); if (r.fx < best.fx) best = r; }
  // A last polish from the best point.
  { const r = bfgs(obj, best.x); if (r.fx <= best.fx) best = { ...r, iterations: best.iterations + r.iterations }; }
  const { mu, phi, theta } = unpack(best.x);
  const c = concentrated(w, mu, phi, theta);
  const names = [...(includeMean ? ['mean'] : []), ...phi.map((_, i) => `ar.L${i + 1}`), ...theta.map((_, i) => `ma.L${i + 1}`), 'sigma2'];
  const est = [...(includeMean ? [mu] : []), ...phi, ...theta, c.sigma2];
  // Standard errors from the numerical Hessian of the full log-likelihood in these parameters.
  const full = (v: number[]) => { let i = 0; const m = includeMean ? v[i++] : 0; const ph = v.slice(i, i + p); i += p; const th = v.slice(i, i + q); i += q; return armaLoglik(w, m, ph, th, v[i]); };
  const K = est.length, H = Array.from({ length: K }, () => new Array(K).fill(0)), hs = est.map((v) => 1e-4 * Math.max(1e-2, Math.abs(v)));
  const at = (dv: [number, number][]) => { const v = est.slice(); for (const [i, dd] of dv) v[i] += dd; return full(v); };
  const f0 = full(est);
  for (let i = 0; i < K; i++) for (let j = i; j < K; j++) {
    const hi = hs[i], hj = hs[j];
    const val = i === j ? (at([[i, hi]]) - 2 * f0 + at([[i, -hi]])) / (hi * hi) : (at([[i, hi], [j, hj]]) - at([[i, hi], [j, -hj]]) - at([[i, -hi], [j, hj]]) + at([[i, -hi], [j, -hj]])) / (4 * hi * hj);
    H[i][j] = H[j][i] = val;
  }
  let se = new Array(K).fill(NaN);
  try { const cov = invert(H.map((r) => r.map((v) => -v))); se = cov.map((r, i) => Math.sqrt(r[i])); } catch { /* singular */ }
  if (se.some((v) => !Number.isFinite(v))) warnings.push('Some standard errors could not be worked out: the model may have more terms than the data support.');
  const z = est.map((v, i) => v / se[i]), pv = z.map((v) => 2 * DIST.normal.sf(Math.abs(v), { mu: 0, sigma: 1 }));
  const nearUnit = (r: number[]) => r.some((v) => !(Math.abs(v) <= 0.98));
  if (nearUnit(toPacf(phi))) warnings.push('The AR part is close to a unit root: try one more difference (d).');
  if (q && nearUnit(toPacf(theta.map((v) => -v)))) warnings.push('The MA part is close to non-invertible: the series may be over-differenced; try one difference fewer.');
  const llf = c.ll, kk = K;
  const fitted = w.map((v, t) => v - c.f.v[t]);
  return {
    p, d, q, mean: includeMean, n: x.length, nEff: n, mu, phi, theta, sigma2: c.sigma2, llf,
    aic: -2 * llf + 2 * kk, aicc: -2 * llf + 2 * kk + (2 * kk * (kk + 1)) / Math.max(1, n - kk - 1), bic: -2 * llf + kk * Math.log(n),
    names, est, se, z, pv, resid: c.f.v, fitted, x, filter: c.f, iterations: best.iterations, warnings,
  };
}
/** Forecasts of the original series h steps ahead, with standard errors (state-space, including the differencing). */
export function forecast(f: ArimaFit, h: number): { mean: number[]; se: number[] } {
  const { ss, a, P } = f.filter, r = ss.r, d = f.d;
  // Differencing polynomial (1 - B)^d = sum c_k B^k.
  const c = [1]; for (let k = 0; k < d; k++) { c.push(0); for (let j = c.length - 1; j > 0; j--) c[j] -= c[j - 1]; }
  // Augmented state [alpha (r), y_{t-1}, ..., y_{t-d}].
  const m = r + d, x = f.x, n = x.length;
  let mean = [...a, ...Array.from({ length: d }, (_, k) => x[n - 1 - k])];
  let S = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (i < r && j < r ? P[i][j] * f.sigma2 : 0)));
  const H = [1, ...new Array(r - 1).fill(0), ...c.slice(1).map((v) => -v)];
  const F = Array.from({ length: m }, (_, i) => new Array(m).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) F[i][j] = ss.T[i][j];
  if (d > 0) { H.forEach((v, j) => (F[r][j] = v)); for (let k = 1; k < d; k++) F[r + k][r + k - 1] = 1; }
  const G = [...ss.R, ...new Array(d).fill(0)];
  const outM: number[] = [], outS: number[] = [];
  for (let s = 0; s < h; s++) {
    const yhat = H.reduce((acc, v, j) => acc + v * mean[j], 0) + f.mu;
    const v = H.reduce((acc, hi, i) => acc + hi * H.reduce((b, hj, j) => b + S[i][j] * hj, 0), 0);
    outM.push(yhat); outS.push(Math.sqrt(Math.max(0, v)));
    // Next state. The level part takes the forecast of y (with the mean) as its newest lag.
    const nm = F.map((row) => row.reduce((acc, fij, j) => acc + fij * mean[j], 0));
    if (d > 0) nm[r] += f.mu;
    const FS = F.map((row) => S[0].map((_, j) => row.reduce((acc, fik, k) => acc + fik * S[k][j], 0)));
    S = FS.map((row, i) => F.map((frow, j) => row.reduce((acc, v2, k) => acc + v2 * frow[k], 0) + G[i] * G[j] * f.sigma2));
    mean = nm;
  }
  return { mean: outM, se: outS };
}
/** Try p and q from 0 to maxPQ with the given d and keep the lowest AICc. */
export function autoArima(x: number[], d: number, maxPQ = 3, includeMean = d === 0): { best: ArimaFit; table: { p: number; q: number; aicc: number; aic: number }[] } {
  const table: { p: number; q: number; aicc: number; aic: number }[] = [];
  let best: ArimaFit | null = null;
  for (let p = 0; p <= maxPQ; p++) for (let q = 0; q <= maxPQ; q++) {
    try { const f = arima(x, p, d, q, includeMean); table.push({ p, q, aicc: f.aicc, aic: f.aic }); if (!best || f.aicc < best.aicc) best = f; } catch { /* too many terms */ }
  }
  if (!best) throw new Error('No model could be fitted.');
  return { best, table: table.sort((a, b) => a.aicc - b.aicc) };
}

/** Example series. All made up for this tool (simulated with fixed seeds); not real data. */
export const EXAMPLES: { id: string; name: string; period: number; text: string }[] = [
 {
  "id": "monthly",
  "name": "Monthly sales of a shop, 8 years (made up)",
  "period": 12,
  "text": "month,sales\n2017-01,117.9\n2017-02,121.7\n2017-03,129.5\n2017-04,126.4\n2017-05,129.6\n2017-06,131.3\n2017-07,131.5\n2017-08,126.0\n2017-09,111.6\n2017-10,109.9\n2017-11,126.4\n2017-12,134.0\n2018-01,134.2\n2018-02,139.7\n2018-03,139.7\n2018-04,137.5\n2018-05,147.3\n2018-06,148.3\n2018-07,145.5\n2018-08,130.6\n2018-09,126.5\n2018-10,124.6\n2018-11,123.9\n2018-12,138.0\n2019-01,144.6\n2019-02,152.2\n2019-03,154.7\n2019-04,162.5\n2019-05,161.4\n2019-06,160.6\n2019-07,151.0\n2019-08,145.7\n2019-09,129.5\n2019-10,127.9\n2019-11,134.3\n2019-12,144.4\n2020-01,149.8\n2020-02,158.0\n2020-03,157.6\n2020-04,164.0\n2020-05,164.1\n2020-06,155.6\n2020-07,156.5\n2020-08,153.1\n2020-09,144.2\n2020-10,142.0\n2020-11,143.3\n2020-12,153.9\n2021-01,166.8\n2021-02,165.7\n2021-03,164.6\n2021-04,169.7\n2021-05,168.2\n2021-06,174.3\n2021-07,172.5\n2021-08,161.3\n2021-09,151.5\n2021-10,151.5\n2021-11,151.2\n2021-12,166.3\n2022-01,174.6\n2022-02,186.2\n2022-03,177.2\n2022-04,186.1\n2022-05,182.5\n2022-06,192.2\n2022-07,183.6\n2022-08,173.2\n2022-09,165.0\n2022-10,158.7\n2022-11,162.2\n2022-12,174.9\n2023-01,189.1\n2023-02,192.3\n2023-03,184.6\n2023-04,190.2\n2023-05,199.4\n2023-06,205.5\n2023-07,203.6\n2023-08,197.8\n2023-09,184.7\n2023-10,171.2\n2023-11,174.9\n2023-12,186.2\n2024-01,202.4\n2024-02,208.9\n2024-03,203.6\n2024-04,212.6\n2024-05,215.6\n2024-06,208.7\n2024-07,204.9\n2024-08,194.0\n2024-09,181.5\n2024-10,178.2\n2024-11,189.1\n2024-12,203.9"
 },
 {
  "id": "daily",
  "name": "Daily museum visitors, 10 weeks (made up)",
  "period": 7,
  "text": "day,visitors\n1,141\n2,160\n3,175\n4,192\n5,232\n6,276\n7,266\n8,160\n9,188\n10,188\n11,199\n12,230\n13,318\n14,245\n15,163\n16,180\n17,201\n18,202\n19,240\n20,338\n21,272\n22,155\n23,193\n24,209\n25,227\n26,256\n27,334\n28,281\n29,170\n30,200\n31,227\n32,214\n33,274\n34,356\n35,268\n36,179\n37,198\n38,215\n39,242\n40,283\n41,395\n42,300\n43,196\n44,207\n45,218\n46,238\n47,271\n48,383\n49,346\n50,203\n51,218\n52,225\n53,245\n54,327\n55,417\n56,353\n57,217\n58,210\n59,255\n60,245\n61,293\n62,400\n63,347\n64,200\n65,214\n66,243\n67,267\n68,321\n69,429\n70,352"
 },
 {
  "id": "sensor",
  "name": "Sensor readings with no season (made up)",
  "period": 0,
  "text": "reading\n17.73\n17.12\n17.91\n20.89\n23.65\n21.81\n18.64\n17.92\n18.62\n20.61\n20.48\n19.29\n19.78\n20.49\n21.12\n20.12\n19.69\n20.09\n21.33\n21.89\n23.31\n22.39\n21.11\n20.16\n17.58\n16.43\n17.98\n18.97\n20.24\n20.04\n19.18\n19.27\n19.11\n19.36\n19.51\n17.34\n17.75\n19.97\n23.21\n24.19\n21.18\n18.42\n19.67\n19.19\n20.98\n22.95\n20.40\n16.95\n18.81\n21.58\n20.66\n20.16\n21.70\n21.09\n19.34\n19.32\n19.77\n21.59\n20.43\n18.58\n18.97\n19.91\n21.01\n21.12\n21.79\n21.60\n19.35\n19.81\n19.26\n19.57\n21.37\n23.47\n25.27\n23.01\n21.04\n20.55\n18.93\n19.99\n20.52\n18.89\n19.94\n20.18\n19.64\n19.71\n19.78\n19.65\n19.95\n19.85\n18.90\n19.77\n19.11\n19.89\n21.01\n19.59\n20.99\n21.94\n21.37\n20.81\n18.67\n18.79\n19.32\n19.21\n18.36\n18.06\n18.28\n18.26\n17.68\n19.42\n21.10\n20.17\n18.47\n19.36\n20.98\n20.23\n18.07\n17.94\n19.88\n19.22\n19.29\n19.56\n19.13\n19.46\n20.03\n20.99\n20.57\n19.67\n18.74\n19.49\n21.55\n20.61\n19.42\n19.34\n19.19\n18.90\n19.37\n20.27\n21.18\n21.60\n19.85\n18.70\n18.63\n20.38\n21.85\n22.26\n20.78\n19.31\n17.01\n16.85\n19.73\n19.89"
 }
];
