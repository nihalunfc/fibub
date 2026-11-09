// Unit hydrographs: synthetic ones (a gamma-shaped curve set by a peak rate factor, as in the SCS/NRCS method, or a
// Nash cascade of linear reservoirs), convolution with an excess-rainfall series to get a storm hydrograph, and deriving
// a unit hydrograph from an observed storm (baseflow separation, φ-index losses, non-negative least squares). No DOM.
// Units: area km², time h, rain mm per step, flow m³/s. One mm over A km² is 1000·A m³.
import { gammaP } from './floodfreq.ts';

const lgamma = (x: number): number => {
  // Lanczos approximation (g = 7), accurate to ~1e-13 for x > 0.
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1; let a = c[0]; const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};

/** Area under q/qp = (t/Tp)^m e^{m(1 − t/Tp)} in units of Tp: e^m Γ(m+1) / m^{m+1}. */
export const gammaShapeArea = (m: number) => Math.exp(m + lgamma(m + 1) - (m + 1) * Math.log(m));
/** Peak rate factor (US units: qp in ft³/s = PRF · A mi² · Q in / Tp h) of a gamma unit hydrograph with shape m. */
export const prfOf = (m: number) => 645.33 / gammaShapeArea(m);
/** Shape m for a peak rate factor (bisection; PRF rises with m). */
export function shapeFor(prf: number) {
  let lo = 0.05, hi = 200;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (prfOf(mid) < prf) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

export type UH = { dt: number; q: number[]; peak: number; tPeak: number };

/** Rescale ordinates so that Σ q · dt · 3600 = 1000 A m³ exactly (one mm of runoff). */
function toVolume(q: number[], dt: number, A: number) {
  const v = q.reduce((s, x) => s + x, 0) * dt * 3600, f = v > 0 ? (1000 * A) / v : 0;
  return q.map((x) => x * f);
}
const wrap = (q: number[], dt: number): UH => { let k = 0; q.forEach((x, i) => { if (x > q[k]) k = i; }); return { dt, q, peak: q[k], tPeak: k * dt }; };

/** Gamma-shaped D-hour unit hydrograph with time to peak Tp (h) and shape m, sampled every dt hours. */
export function gammaUH(A: number, Tp: number, m: number, dt: number): UH {
  const qp = (1000 * A) / (3600 * Tp * gammaShapeArea(m)), q: number[] = [];
  for (let i = 0; ; i++) {
    const t = i * dt, r = t / Tp, v = t === 0 ? 0 : qp * Math.exp(m * (Math.log(r) + 1 - r));
    q.push(v);
    if ((t > Tp && v < 1e-4 * qp) || i > 5000) break;
  }
  return wrap(toVolume(q, dt, A), dt);
}

/** Nash cascade: n equal linear reservoirs with storage constant k (h); D-hour unit hydrograph from the S-curve. */
export function nashUH(A: number, n: number, k: number, D: number, dt: number): UH {
  const S = (t: number) => (t <= 0 ? 0 : gammaP(n, t / k)), q: number[] = [];
  for (let i = 0; ; i++) {
    const t = i * dt, v = ((S(t) - S(t - D)) / D) * ((1000 * A) / 3600);
    q.push(v);
    if ((t > D && S(t - D) > 1 - 1e-5) || i > 5000) break;
  }
  return wrap(toVolume(q, dt, A), dt);
}

/** Direct runoff (m³/s) from excess rain P (mm in each step of length dt) and unit hydrograph ordinates U (m³/s per mm). */
export function convolve(P: number[], U: number[]) {
  const out = new Array(P.length + U.length - 1).fill(0);
  P.forEach((p, i) => U.forEach((u, j) => { out[i + j] += p * u; }));
  return out;
}

/** Baseflow: a straight line from the first to the last flow (or a constant at the first flow), never above the flow. */
export function baseflow(Q: number[], method: 'line' | 'constant') {
  const n = Q.length, a = Q[0], b = method === 'constant' ? Q[0] : Q[n - 1];
  return Q.map((q, i) => Math.min(q, a + ((b - a) * i) / Math.max(1, n - 1)));
}

/** φ-index (mm per step): the constant loss that leaves exactly `depth` mm of excess rain. Returns φ and the excess. */
export function phiIndex(P: number[], depth: number) {
  const total = P.reduce((s, x) => s + Math.max(0, x), 0);
  if (!(depth > 0) || depth >= total) return { phi: depth >= total ? 0 : Math.max(...P), excess: depth >= total ? P.map((x) => Math.max(0, x)) : P.map(() => 0) };
  let lo = 0, hi = Math.max(...P);
  const ex = (phi: number) => P.reduce((s, x) => s + Math.max(0, x - phi), 0);
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (ex(mid) > depth) lo = mid; else hi = mid; }
  const phi = (lo + hi) / 2;
  return { phi, excess: P.map((x) => Math.max(0, x - phi)) };
}

/** Lawson–Hanson non-negative least squares: min ‖Ax − b‖ with x ≥ 0. A is m × n (rows). */
export function nnls(A: number[][], b: number[], maxIter = 500) {
  const m = A.length, n = A[0].length, x = new Array(n).fill(0), P = new Array(n).fill(false);
  const grad = () => { const r = b.map((bi, i) => bi - A[i].reduce((s, a, j) => s + a * x[j], 0)); return Array.from({ length: n }, (_, j) => A.reduce((s, row, i) => s + row[j] * r[i], 0)); };
  const lsq = (idx: number[]) => {
    // Normal equations on the passive set, Cholesky-free Gaussian elimination with pivoting.
    const k = idx.length, M = idx.map((p) => idx.map((q) => A.reduce((s, row) => s + row[p] * row[q], 0))), v = idx.map((p) => A.reduce((s, row, i) => s + row[p] * b[i], 0));
    for (let c = 0; c < k; c++) {
      let piv = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      [M[c], M[piv]] = [M[piv], M[c]]; [v[c], v[piv]] = [v[piv], v[c]];
      if (Math.abs(M[c][c]) < 1e-300) continue;
      for (let r = c + 1; r < k; r++) { const f = M[r][c] / M[c][c]; for (let s = c; s < k; s++) M[r][s] -= f * M[c][s]; v[r] -= f * v[c]; }
    }
    const z = new Array(k).fill(0);
    for (let r = k - 1; r >= 0; r--) { let s = v[r]; for (let q = r + 1; q < k; q++) s -= M[r][q] * z[q]; z[r] = Math.abs(M[r][r]) < 1e-300 ? 0 : s / M[r][r]; }
    return z;
  };
  const tol = 1e-10 * Math.max(1, ...b.map(Math.abs)) * m;
  for (let it = 0; it < maxIter; it++) {
    const w = grad();
    let j = -1, best = tol;
    for (let t = 0; t < n; t++) if (!P[t] && w[t] > best) { best = w[t]; j = t; }
    if (j < 0) break;
    P[j] = true;
    for (let inner = 0; inner < 3 * n; inner++) {
      const idx = P.map((p, t) => (p ? t : -1)).filter((t) => t >= 0), z = lsq(idx);
      if (z.every((v) => v > 0)) { idx.forEach((t, i) => { x[t] = z[i]; }); break; }
      let alpha = Infinity;
      idx.forEach((t, i) => { if (z[i] <= 0) alpha = Math.min(alpha, x[t] / (x[t] - z[i])); });
      idx.forEach((t, i) => { x[t] += alpha * (z[i] - x[t]); if (x[t] <= 1e-14) { x[t] = 0; P[t] = false; } });
    }
  }
  return x;
}

/** Unit hydrograph of nU ordinates from excess rain Pe (mm per step) and direct runoff Qd (m³/s), by NNLS. */
export function deriveUH(Pe: number[], Qd: number[], nU: number) {
  const A = Qd.map((_, i) => Array.from({ length: nU }, (_, j) => (i - j >= 0 && i - j < Pe.length ? Pe[i - j] : 0)));
  const U = nnls(A, Qd), fit = convolve(Pe, U).slice(0, Qd.length);
  const ssr = Qd.reduce((s, q, i) => s + (q - fit[i]) ** 2, 0), sst = Qd.reduce((s, q) => s + q * q, 0);
  return { U, fit, nse: 1 - ssr / Math.max(1e-300, Qd.reduce((s, q) => s + (q - Qd.reduce((a, b) => a + b, 0) / Qd.length) ** 2, 0)), rel: Math.sqrt(ssr / Math.max(1e-300, sst)) };
}

/** Area (km²) implied by a unit hydrograph: its volume is one mm over the catchment. */
export const impliedArea = (U: number[], dt: number) => (U.reduce((s, x) => s + x, 0) * dt * 3600) / 1000;
