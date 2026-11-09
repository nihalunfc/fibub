// Video motion analysis: pixel clicks to metres (two-point scale, chosen origin, y up), velocity and acceleration by
// finite differences (second-order central differences on uneven spacing, like numpy.gradient), and least-squares fits
// of constant velocity and constant acceleration with standard errors. No DOM.

export type Pt = { t: number; x: number; y: number };

/** Metres per pixel from two clicked points a known distance apart. */
export const metresPerPixel = (x1: number, y1: number, x2: number, y2: number, dist: number) => dist / Math.hypot(x2 - x1, y2 - y1);

/** Pixel points to metres: origin at (ox, oy) in pixels, x to the right and y upwards. */
export function toWorld(px: Pt[], ox: number, oy: number, s: number): Pt[] {
  return px.map((p) => ({ t: p.t, x: (p.x - ox) * s, y: (oy - p.y) * s }));
}

/** d f / d t at every sample: second-order central differences inside (uneven spacing allowed), one-sided at the ends. */
export function gradient(t: number[], f: number[]): number[] {
  const n = t.length, g = new Array(n).fill(NaN);
  if (n < 2) return g;
  g[0] = (f[1] - f[0]) / (t[1] - t[0]);
  g[n - 1] = (f[n - 1] - f[n - 2]) / (t[n - 1] - t[n - 2]);
  for (let i = 1; i < n - 1; i++) {
    const h1 = t[i] - t[i - 1], h2 = t[i + 1] - t[i];
    g[i] = (-h2 / (h1 * (h1 + h2))) * f[i - 1] + ((h2 - h1) / (h1 * h2)) * f[i] + (h1 / (h2 * (h1 + h2))) * f[i + 1];
  }
  return g;
}

/** Least-squares polynomial of degree 1 or 2 in (t − t0), with standard errors from the residual scatter. */
export function polyFit(t: number[], y: number[], deg: 1 | 2, t0 = t[0]) {
  const n = t.length, k = deg + 1, X = t.map((ti) => Array.from({ length: k }, (_, j) => (ti - t0) ** j));
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const b = Array.from({ length: k }, (_, i) => X.reduce((s, r, m) => s + r[i] * y[m], 0));
  const inv = invert(A), c = inv.map((row) => row.reduce((s, v, j) => s + v * b[j], 0));
  const resid = y.map((yi, m) => yi - X[m].reduce((s, v, j) => s + v * c[j], 0)), dof = n - k;
  const s2 = dof > 0 ? resid.reduce((s, r) => s + r * r, 0) / dof : NaN;
  const se = inv.map((row, i) => Math.sqrt(s2 * row[i]));
  const my = y.reduce((s, v) => s + v, 0) / n, sst = y.reduce((s, v) => s + (v - my) ** 2, 0);
  return { c, se, rms: Math.sqrt(resid.reduce((s, r) => s + r * r, 0) / n), r2: sst > 0 ? 1 - resid.reduce((s, r) => s + r * r, 0) / sst : 1, dof };
}
function invert(A: number[][]): number[][] {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-300) throw new Error('singular');
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; for (let k = 0; k < 2 * n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r) => r.slice(n));
}

/** Everything for one tracked object: positions in metres, velocities, accelerations and the model fits. */
export function analyse(w: Pt[]) {
  const pts = [...w].sort((a, b) => a.t - b.t), t = pts.map((p) => p.t), x = pts.map((p) => p.x), y = pts.map((p) => p.y);
  const vx = gradient(t, x), vy = gradient(t, y), ax = gradient(t, vx), ay = gradient(t, vy);
  const fit = (f: number[]) => ({ lin: t.length >= 3 ? polyFit(t, f, 1) : null, quad: t.length >= 4 ? polyFit(t, f, 2) : null });
  return { t, x, y, vx, vy, ax, ay, speed: vx.map((v, i) => Math.hypot(v, vy[i])), fx: fit(x), fy: fit(y) };
}
