// Polymer molar mass averages: Mn, Mw, Mz, Mp and dispersity from a list of chains or a GPC/SEC trace with a
// calibration curve (log M against retention, fitted to standards). Slice method: detector signal ∝ mass in slice.

export type Averages = { Mn: number; Mw: number; Mz: number; D: number };
/** Averages from molar masses M and mass amounts w (any scale). */
export function averages(M: number[], w: number[]): Averages {
  let sw = 0, swm = 0, swm2 = 0, swOverM = 0;
  M.forEach((m, i) => { sw += w[i]; swm += w[i] * m; swm2 += w[i] * m * m; swOverM += w[i] / m; });
  const Mn = sw / swOverM, Mw = swm / sw;
  return { Mn, Mw, Mz: swm2 / swm, D: Mw / Mn };
}
/** Same from numbers of chains N (mass = N·M). */
export const averagesFromNumbers = (M: number[], N: number[]) => averages(M, M.map((m, i) => m * N[i]));

/** Least-squares polynomial (coefficients from the constant up) with R². */
export function polyfit(x: number[], y: number[], deg: number) {
  const n = deg + 1, A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  const xm = x.reduce((a, b) => a + b, 0) / x.length, xs = Math.max(...x.map((v) => Math.abs(v - xm))) || 1; // scale for conditioning
  const u = x.map((v) => (v - xm) / xs);
  for (let k = 0; k < x.length; k++) for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += u[k] ** (i + j); A[i][n] += y[k] * u[k] ** i; }
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    if (Math.abs(A[c][c]) < 1e-14) throw new Error('singular');
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let j = c; j <= n; j++) A[r][j] -= f * A[c][j]; }
  }
  const b = A.map((row, i) => row[n] / A[i][i]);
  const f = (t: number) => { const v = (t - xm) / xs; return b.reduce((s, c, i) => s + c * v ** i, 0); };
  const df = (t: number) => { const v = (t - xm) / xs; return b.reduce((s, c, i) => s + (i ? (i * c * v ** (i - 1)) / xs : 0), 0); };
  const ym = y.reduce((a, c) => a + c, 0) / y.length, ssr = y.reduce((s, yi, i) => s + (yi - f(x[i])) ** 2, 0), sst = y.reduce((s, yi) => s + (yi - ym) ** 2, 0);
  return { f, df, r2: sst ? 1 - ssr / sst : 1, rms: Math.sqrt(ssr / y.length) };
}

/** Analyse a trace (retention t, signal h) between lo and hi with a straight baseline joining the window ends. */
export function analyseTrace(t: number[], h: number[], logM: (t: number) => number, dlogM: (t: number) => number, lo: number, hi: number) {
  const idx = t.map((_, i) => i).filter((i) => t[i] >= lo && t[i] <= hi);
  if (idx.length < 5) throw new Error('Fewer than 5 points inside the window.');
  const a = idx[0], b = idx[idx.length - 1], base = (x: number) => h[a] + ((h[b] - h[a]) * (x - t[a])) / (t[b] - t[a]);
  const M: number[] = [], w: number[] = [], ts: number[] = [];
  let peak = -Infinity, Mp = NaN;
  for (const i of idx) {
    const y = h[i] - base(t[i]); if (y <= 0) continue;
    const m = 10 ** logM(t[i]); if (!(m > 0) || !Number.isFinite(m)) continue;
    // Slices may be unevenly spaced: weight each by its width.
    const dt = ((t[Math.min(i + 1, b)] - t[Math.max(i - 1, a)]) / 2) || 0;
    M.push(m); w.push(y * Math.abs(dt)); ts.push(t[i]);
    if (y > peak) { peak = y; Mp = m; }
  }
  if (M.length < 3) throw new Error('No signal above the baseline inside the window.');
  // Distribution against log M: w(log M) = signal / |d log M / dt|.
  const dist = ts.map((x, k) => ({ logM: Math.log10(M[k]), w: w[k] / Math.abs(((t[1] - t[0]) || 1) * dlogM(x)) }));
  return { ...averages(M, w), Mp, slices: M.length, base: [t[a], h[a], t[b], h[b]] as const, dist };
}

/** A log-normal GPC example: Mw and dispersity D, calibration log10 M = c0 + c1·t, linear baseline drift. */
export function exampleTrace(Mw = 100000, D = 2, c0 = 10.5, c1 = -0.3, t0 = 13, t1 = 27, step = 0.02) {
  const s2 = Math.log(D), mu = Math.log(Mw) - s2 / 2, rows: [number, number][] = [];
  for (let t = t0; t <= t1 + 1e-9; t += step) {
    const lnM = (c0 + c1 * t) * Math.LN10;
    rows.push([+t.toFixed(3), +(100 * Math.exp(-((lnM - mu) ** 2) / (2 * s2)) + 0.5 + 0.02 * t).toFixed(4)]);
  }
  return rows;
}
