// Chaos in a few classic systems: a 1D map x → f(x, r) (the logistic map by default) with its cobweb, orbit
// diagram, period, Lyapunov exponent and period-doubling (Feigenbaum) points; the Lorenz and Rössler flows with
// their full Lyapunov spectrum (Benettin's method with QR re-orthonormalisation); the Hénon map and its two
// Lyapunov exponents. Plain TypeScript, no DOM.
import { parse, compile, variables } from './expr.ts';

export type Map1 = (x: number, r: number) => number;

/** Compile a typed map in x and r, such as "r*x*(1 - x)". */
export function parseMap(src: string): Map1 {
  let node;
  try { node = parse(src); } catch (e) { throw new Error(`The map: ${(e as Error).message}.`); }
  const bad = variables(node).find((v) => v !== 'x' && v !== 'r');
  if (bad) throw new Error(`The map may use only x and r, not ${bad}.`);
  const g = compile(node, ['x', 'r']), v = new Float64Array(2);
  return (x, r) => { v[0] = x; v[1] = r; return g(v); };
}
export const logistic: Map1 = (x, r) => r * x * (1 - x);

/** Derivative of the map in x, by central differences (exact for a quadratic map up to rounding). */
export const dmap = (f: Map1, x: number, r: number) => { const h = 1e-6 * Math.max(1, Math.abs(x)); return (f(x + h, r) - f(x - h, r)) / (2 * h); };

export function orbit(f: Map1, r: number, x0: number, n: number): number[] {
  const out = [x0]; let x = x0;
  for (let i = 0; i < n; i++) { x = f(x, r); out.push(x); if (!Number.isFinite(x)) break; }
  return out;
}

/** Cobweb path: (x0, 0), (x0, x1), (x1, x1), (x1, x2), ... */
export function cobweb(xs: number[]): [number, number][] {
  const p: [number, number][] = [[xs[0], 0]];
  for (let i = 0; i < xs.length - 1; i++) { p.push([xs[i], xs[i + 1]]); p.push([xs[i + 1], xs[i + 1]]); }
  return p;
}

/** Lyapunov exponent of a 1D map: mean of ln|f'(x)| along the orbit after a transient. */
export function lyapunov1(f: Map1, r: number, x0 = 0.2, n = 20000, transient = 1000, df?: (x: number, r: number) => number): number {
  let x = x0;
  for (let i = 0; i < transient; i++) x = f(x, r);
  let s = 0;
  for (let i = 0; i < n; i++) {
    const d = Math.abs(df ? df(x, r) : dmap(f, x, r));
    s += Math.log(Math.max(d, 1e-300));
    x = f(x, r);
    if (!Number.isFinite(x)) return NaN;
  }
  return s / n;
}

/** Period of the orbit after a transient (1 to maxP), or 0 when no period up to maxP is found (chaos or escape). */
export function period(f: Map1, r: number, x0 = 0.2, transient = 5000, maxP = 64, tol = 1e-7): number {
  let x = x0;
  for (let i = 0; i < transient; i++) { x = f(x, r); if (!Number.isFinite(x)) return 0; }
  const xs = [x];
  for (let i = 0; i < 2 * maxP; i++) { x = f(x, r); xs.push(x); }
  const sc = Math.max(1, Math.abs(xs[0]));
  for (let p = 1; p <= maxP; p++) {
    let ok = true;
    for (let i = 0; i + p < xs.length && ok; i++) if (Math.abs(xs[i + p] - xs[i]) > tol * sc) ok = false;
    if (ok) return p;
  }
  return 0;
}

/** Orbit diagram: for each r, the values visited after a transient. */
export function orbitDiagram(f: Map1, r0: number, r1: number, nr: number, x0 = 0.2, transient = 600, keep = 200): { r: number[]; x: number[] } {
  const R: number[] = [], X: number[] = [];
  for (let k = 0; k < nr; k++) {
    const r = r0 + ((r1 - r0) * k) / Math.max(1, nr - 1);
    let x = x0, ok = true;
    for (let i = 0; i < transient; i++) { x = f(x, r); if (!Number.isFinite(x) || Math.abs(x) > 1e12) { ok = false; break; } }
    if (!ok) continue;
    for (let i = 0; i < keep; i++) { x = f(x, r); if (!Number.isFinite(x) || Math.abs(x) > 1e12) break; R.push(r); X.push(x); }
  }
  return { r: R, x: X };
}

/** Where the p-cycle loses stability by period doubling: solve f^p(x) = x and (f^p)'(x) = −1 for (x, r) by Newton. */
export function doublingPoint(f: Map1, p: number, x: number, r: number): { r: number; x: number } | null {
  const G = (x: number, r: number): [number, number] => {
    let y = x, d = 1;
    for (let i = 0; i < p; i++) { d *= dmap(f, y, r); y = f(y, r); }
    return [y - x, d + 1];
  };
  for (let it = 0; it < 60; it++) {
    const g = G(x, r);
    if (!g.every(Number.isFinite)) return null;
    if (Math.abs(g[0]) < 1e-13 && Math.abs(g[1]) < 1e-10) return { r, x };
    const hx = 1e-7 * Math.max(1, Math.abs(x)), hr = 1e-7 * Math.max(1, Math.abs(r));
    const gx = G(x + hx, r), gr = G(x, r + hr);
    const a = (gx[0] - g[0]) / hx, b = (gr[0] - g[0]) / hr, c = (gx[1] - g[1]) / hx, d = (gr[1] - g[1]) / hr;
    const det = a * d - b * c;
    if (!(Math.abs(det) > 1e-300)) return null;
    let dx = (-g[0] * d + b * g[1]) / det, dr = (-a * g[1] + c * g[0]) / det;
    const big = Math.max(Math.abs(dr) / 0.01, 1); dx /= big; dr /= big;
    x += dx; r += dr;
  }
  const g = G(x, r);
  return Math.abs(g[0]) < 1e-10 && Math.abs(g[1]) < 1e-7 ? { r, x } : null;
}

/**
 * The first period-doubling points in [r0, r1]: a scan finds where the period goes 1 → 2 → 4 ..., Newton refines
 * each, and later ones are guessed from the ratio of the gaps (Feigenbaum's δ ≈ 4.669) and refined.
 */
export function doublings(f: Map1, r0: number, r1: number, x0 = 0.2, max = 7): { p: number; r: number }[] {
  const out: { p: number; r: number }[] = [];
  const N = 800;
  let prev = period(f, r0, x0), lastR = r0;
  // Coarse scan for the first two doublings. lastR is the last r where the old period was still seen.
  for (let k = 1; k <= N && out.length < 2; k++) {
    const r = r0 + ((r1 - r0) * k) / N, p = period(f, r, x0);
    if (prev > 0 && p === 2 * prev && (!out.length || prev === 2 * out[out.length - 1].p)) {
      let x = x0; for (let i = 0; i < 5000; i++) x = f(x, lastR);
      const d = doublingPoint(f, prev, x, lastR);
      const w = 0.02 * Math.abs(r1 - r0);
      out.push({ p: prev, r: d && d.r >= lastR - w && d.r <= r + w ? d.r : (lastR + r) / 2 });
    }
    if (p > 0) { prev = p; lastR = r; }
  }
  while (out.length >= 2 && out.length < max) {
    const a = out[out.length - 2], b = out[out.length - 1], p = 2 * b.p;
    const guess = b.r + (b.r - a.r) / 4.669;
    if (guess > r1) break;
    // Start x from the orbit at the guess (on or near the 2p-cycle, close to the p-cycle near the doubling).
    let x = x0; for (let i = 0; i < 20000; i++) x = f(x, guess);
    const d = doublingPoint(f, p, x, guess);
    if (!d || !(d.r > b.r) || d.r > r1 || Math.abs(d.r - guess) > 0.5 * (b.r - a.r)) break;
    out.push({ p, r: d.r });
  }
  return out;
}

// ---------- Flows: Lorenz and Rössler ----------

export type Flow = { f: (s: number[]) => number[]; J: (s: number[]) => number[][] };
export const lorenz = (sigma: number, rho: number, beta: number): Flow => ({
  f: ([x, y, z]) => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z],
  J: ([x, y, z]) => [[-sigma, sigma, 0], [rho - z, -1, -x], [y, x, -beta]],
});
export const rossler = (a: number, b: number, c: number): Flow => ({
  f: ([x, y, z]) => [-y - z, x + a * y, b + z * (x - c)],
  J: ([x, , z]) => [[0, -1, -1], [1, a, 0], [z, 0, x - c]],
});

const add = (a: number[], b: number[], k: number) => a.map((v, i) => v + k * b[i]);
function rk4step(F: (s: number[]) => number[], s: number[], h: number): number[] {
  const k1 = F(s), k2 = F(add(s, k1, h / 2)), k3 = F(add(s, k2, h / 2)), k4 = F(add(s, k3, h));
  return s.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/** A path of the flow by RK4 with step h; every `every`-th point is kept. */
export function trajectory(fl: Flow, s0: number[], T: number, h: number, every = 1): number[][] {
  const n = Math.round(T / h), out = [s0.slice()];
  let s = s0.slice();
  for (let i = 1; i <= n; i++) {
    s = rk4step(fl.f, s, h);
    if (!s.every(Number.isFinite) || s.some((v) => Math.abs(v) > 1e9)) break;
    if (i % every === 0) out.push(s);
  }
  return out;
}

/** Modified Gram-Schmidt on the columns of an n×n matrix (as columns list): returns orthonormal columns and the norms. */
function gramSchmidt(cols: number[][]): { Q: number[][]; R: number[] } {
  const Q: number[][] = [], R: number[] = [];
  for (const c of cols) {
    let v = c.slice();
    for (const q of Q) { const d = v.reduce((s, x, i) => s + x * q[i], 0); v = v.map((x, i) => x - d * q[i]); }
    const n = Math.hypot(...v); R.push(n); Q.push(v.map((x) => x / n));
  }
  return { Q, R };
}

/**
 * Full Lyapunov spectrum of a 3D flow (Benettin et al. 1980; Shimada and Nagashima 1979): integrate the path and
 * three tangent vectors (the variational equations) with RK4, re-orthonormalise every step, and average the logs
 * of the stretching. `transient` time is run first and not counted.
 */
export function flowLyapunov(fl: Flow, s0: number[], T: number, h = 0.01, transient = 20): { exps: number[]; history: { t: number; l: number[] }[] } {
  let s = s0.slice();
  for (let i = 0, n = Math.round(transient / h); i < n; i++) s = rk4step(fl.f, s, h);
  // State: 3 path values plus three tangent vectors (columns).
  let V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const F = (u: number[]) => {
    const x = u.slice(0, 3), J = fl.J(x), out = fl.f(x);
    for (let k = 0; k < 3; k++) { const v = u.slice(3 + 3 * k, 6 + 3 * k); for (let i = 0; i < 3; i++) out.push(J[i][0] * v[0] + J[i][1] * v[1] + J[i][2] * v[2]); }
    return out;
  };
  const sum = [0, 0, 0], history: { t: number; l: number[] }[] = [];
  const n = Math.round(T / h), every = Math.max(1, Math.floor(n / 400));
  for (let i = 1; i <= n; i++) {
    const u = rk4step(F, [...s, ...V.flat()], h);
    s = u.slice(0, 3);
    const { Q, R } = gramSchmidt([0, 1, 2].map((k) => u.slice(3 + 3 * k, 6 + 3 * k)));
    V = Q;
    for (let k = 0; k < 3; k++) sum[k] += Math.log(R[k]);
    if (!s.every(Number.isFinite)) return { exps: [NaN, NaN, NaN], history };
    if (i % every === 0) history.push({ t: i * h, l: sum.map((v) => v / (i * h)) });
  }
  return { exps: sum.map((v) => v / (n * h)), history };
}

/** Kaplan-Yorke (Lyapunov) dimension from exponents sorted high to low. */
export function kaplanYorke(l: number[]): number {
  let s = 0, j = 0;
  for (; j < l.length; j++) { if (s + l[j] < 0) break; s += l[j]; }
  if (j === 0) return 0;
  if (j === l.length) return l.length;
  return j + s / Math.abs(l[j]);
}

// ---------- Hénon map ----------

export function henon(a: number, b: number, x0: number, y0: number, n: number, transient = 100): { x: number[]; y: number[]; escaped: boolean } {
  let x = x0, y = y0;
  const X: number[] = [], Y: number[] = [];
  for (let i = 0; i < transient + n; i++) {
    const xn = 1 - a * x * x + y; y = b * x; x = xn;
    if (!Number.isFinite(x) || Math.abs(x) > 1e6) return { x: X, y: Y, escaped: true };
    if (i >= transient) { X.push(x); Y.push(y); }
  }
  return { x: X, y: Y, escaped: false };
}

/** Both Lyapunov exponents of the Hénon map, from products of Jacobians with QR (Gram-Schmidt) each step. */
export function henonLyapunov(a: number, b: number, x0: number, y0: number, n: number, transient = 1000): number[] {
  let x = x0, y = y0;
  for (let i = 0; i < transient; i++) { const xn = 1 - a * x * x + y; y = b * x; x = xn; }
  let V = [[1, 0], [0, 1]];
  const sum = [0, 0];
  for (let i = 0; i < n; i++) {
    // Jacobian at (x, y): [[-2 a x, 1], [b, 0]].
    const J = [[-2 * a * x, 1], [b, 0]];
    const W = V.map((v) => [J[0][0] * v[0] + J[0][1] * v[1], J[1][0] * v[0] + J[1][1] * v[1]]);
    const { Q, R } = gramSchmidt(W);
    V = Q; sum[0] += Math.log(R[0]); sum[1] += Math.log(R[1]);
    const xn = 1 - a * x * x + y; y = b * x; x = xn;
    if (!Number.isFinite(x) || Math.abs(x) > 1e6) return [NaN, NaN];
  }
  return sum.map((v) => v / n);
}

/** Orthographic view of 3D points, turned by yaw (about the vertical z axis) then pitch (tilt). */
export function project(p: number[], yaw: number, pitch: number): [number, number, number] {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = cy * p[0] - sy * p[1], y1 = sy * p[0] + cy * p[1], z1 = p[2];
  // Screen: across = x1; up = z tilted by pitch; depth = y tilted.
  return [x1, cp * z1 - sp * y1, sp * z1 + cp * y1];
}
