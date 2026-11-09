// Pattern formation: a morphogen gradient (source, diffusion, decay) with French-flag thresholds, and two
// reaction-diffusion systems on a square grid with wrap-around edges: Gray-Scott and Gierer-Meinhardt (with optional
// saturation). Explicit Euler steps, 5-point Laplacian, grid spacing 1. Plain maths, no DOM.
import { rng } from './spectro.ts';

// ---------- Morphogen gradient ----------
/** Decay length λ = √(D/k). */
export const decayLength = (D: number, k: number) => Math.sqrt(D / k);
/**
 * Steady-state concentration at x for a source held at C0 at x = 0, diffusion D and first-order decay k.
 * Open-ended tissue: C0·e^(−x/λ). Tissue of length L with a sealed far end: C0·cosh((L − x)/λ) / cosh(L/λ).
 */
export function gradient(x: number, C0: number, lambda: number, L: number | null = null): number {
  if (L == null) return C0 * Math.exp(-x / lambda);
  // cosh ratio written with exponentials that cannot overflow.
  const a = Math.exp(-x / lambda), b = Math.exp(-(2 * L - x) / lambda), c = 1 + Math.exp(-2 * L / lambda);
  return (C0 * (a + b)) / c;
}
/** Where the steady-state gradient falls to the threshold T (NaN if it never does within L). */
export function thresholdPosition(T: number, C0: number, lambda: number, L: number | null = null): number {
  if (!(T > 0) || T >= C0) return T >= C0 ? 0 : NaN;
  if (L == null) return lambda * Math.log(C0 / T);
  if (gradient(L, C0, lambda, L) > T) return NaN;
  let a = 0, b = L;
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (gradient(m, C0, lambda, L) > T) a = m; else b = m; }
  return (a + b) / 2;
}
/** Time-dependent 1-D solution by explicit finite differences (C0 held at x = 0, sealed far end), for checking. */
export function relaxGradient(C0: number, D: number, k: number, L: number, cells: number, time: number): Float64Array {
  const dx = L / (cells - 1), dt = Math.min(0.2 * dx * dx / D, 0.1 / k), steps = Math.ceil(time / dt), h = time / steps;
  let c = new Float64Array(cells), nxt = new Float64Array(cells);
  for (let s = 0; s < steps; s++) {
    c[0] = C0;
    for (let i = 1; i < cells; i++) { const r = i === cells - 1 ? c[i - 1] : c[i + 1]; nxt[i] = c[i] + h * (D * (c[i - 1] - 2 * c[i] + r) / (dx * dx) - k * c[i]); }
    nxt[0] = C0; [c, nxt] = [nxt, c];
  }
  return c;
}

// ---------- Reaction-diffusion ----------
export type GS = { model: 'gs'; Du: number; Dv: number; F: number; k: number; dt: number };
export type GM = { model: 'gm'; Da: number; Dh: number; rho: number; mua: number; muh: number; kappa: number; sigma: number; dt: number };
export type Params = GS | GM;

/** Pearson (1993) diffusion constants on a 256 × 256 grid of side 2.5, in grid units: 2·10⁻⁵ ÷ (2.5/256)². */
export const PEARSON_DU = 2e-5 / (2.5 / 256) ** 2, PEARSON_DV = PEARSON_DU / 2;
export const PRESETS: Record<string, { name: string; p: Params; steps: number }> = {
  'gs-spots': { name: 'Gray-Scott: dividing spots', p: { model: 'gs', Du: PEARSON_DU, Dv: PEARSON_DV, F: 0.0367, k: 0.0649, dt: 1 }, steps: 6000 },
  'gs-stripes': { name: 'Gray-Scott: stripes (maze)', p: { model: 'gs', Du: PEARSON_DU, Dv: PEARSON_DV, F: 0.029, k: 0.057, dt: 1 }, steps: 8000 },
  'gm-spots': { name: 'Gierer-Meinhardt: spots', p: { model: 'gm', Da: 0.02, Dh: 1, rho: 0.01, mua: 0.01, muh: 0.02, kappa: 0, sigma: 0, dt: 0.2 }, steps: 20000 },
  'gm-stripes': { name: 'Gierer-Meinhardt: stripes (saturation)', p: { model: 'gm', Da: 0.02, Dh: 1, rho: 0.01, mua: 0.01, muh: 0.02, kappa: 0.05, sigma: 0, dt: 0.2 }, steps: 20000 },
};

/** Reaction terms f(u, v), g(u, v) of each model. */
export function reaction(p: Params, u: number, v: number): [number, number] {
  if (p.model === 'gs') { const uvv = u * v * v; return [-uvv + p.F * (1 - u), uvv - (p.F + p.k) * v]; }
  const a2 = u * u;
  return [(p.rho * a2) / ((1 + p.kappa * a2) * v) - p.mua * u + p.sigma, p.rho * a2 - p.muh * v];
}

/** The uniform steady state that patterns grow from: Gray-Scott's non-trivial one (if it exists) or Gierer-Meinhardt's. */
export function steadyState(p: Params): [number, number] | null {
  if (p.model === 'gs') {
    // Besides u = 1, v = 0: v = F(1 − u)/(F + k) and u·v = F + k, so u² − u + (F + k)²/F = 0. The root with the smaller u.
    const s = p.F + p.k, disc = 1 - (4 * s * s) / p.F;
    if (disc < 0) return null;
    const u = (1 - Math.sqrt(disc)) / 2; return [u, (p.F * (1 - u)) / s];
  }
  // Gierer-Meinhardt: h = ρa²/μh, then a solves κ μa a³ + μa a − μh − σ(1 + κ a²) = 0 (Newton from μh/μa).
  let a = (p.muh + p.sigma) / p.mua;
  for (let i = 0; i < 100; i++) { const f = p.kappa * p.mua * a ** 3 + p.mua * a - p.muh - p.sigma * (1 + p.kappa * a * a), d = 3 * p.kappa * p.mua * a * a + p.mua - 2 * p.sigma * p.kappa * a; a -= f / d; }
  return [a, (p.rho * a * a) / p.muh];
}

/**
 * Linear (Turing) stability of the uniform state: the Jacobian, whether the state is stable without diffusion, and the
 * band of wavenumbers q that grow with diffusion; the fastest-growing wavelength 2π/q in grid cells.
 */
export function turingAnalysis(p: Params) {
  const ss = steadyState(p);
  if (!ss) return null;
  const [u, v] = ss, e = 1e-6;
  const f0 = reaction(p, u, v), fu = reaction(p, u + e, v), fv = reaction(p, u, v + e);
  const J = [[(fu[0] - f0[0]) / e, (fv[0] - f0[0]) / e], [(fu[1] - f0[1]) / e, (fv[1] - f0[1]) / e]];
  const [d1, d2] = p.model === 'gs' ? [p.Du, p.Dv] : [p.Da, p.Dh];
  const tr = J[0][0] + J[1][1], det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  const growth = (q2: number) => { const a = J[0][0] - d1 * q2, d = J[1][1] - d2 * q2, t = a + d, dd = a * d - J[0][1] * J[1][0], disc = t * t - 4 * dd; return disc >= 0 ? (t + Math.sqrt(disc)) / 2 : t / 2; };
  let best = 0, bq = 0, lo = NaN, hi = NaN;
  for (let i = 1; i <= 4000; i++) { const q = (i / 4000) * Math.PI, g = growth(q * q); if (g > 0) { if (Number.isNaN(lo)) lo = q; hi = q; } if (g > best) { best = g; bq = q; } }
  return { u, v, J, stableUniform: tr < 0 && det > 0, unstableBand: Number.isNaN(lo) ? null : [lo, hi] as [number, number], fastest: bq ? (2 * Math.PI) / bq : NaN, growth: best };
}

export type Sim = { n: number; u: Float32Array; v: Float32Array; p: Params; t: number; steps: number; seed: number };
/** A new field: Gray-Scott starts at u = 1, v = 0 with random seeded squares; Gierer-Meinhardt at its uniform state ±1 %. */
export function createSim(p: Params, n: number, seed: number): Sim {
  const r = rng(seed), N = n * n, u = new Float32Array(N), v = new Float32Array(N);
  if (p.model === 'gs') {
    u.fill(1);
    const blobs = Math.max(3, Math.round(N / 1600)), s = Math.max(6, Math.round(n / 16));
    for (let b = 0; b < blobs; b++) {
      const cx = Math.floor(r() * n), cy = Math.floor(r() * n);
      for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { const i = ((cy + y) % n) * n + ((cx + x) % n); u[i] = 0.5; v[i] = 0.25; }
    }
    for (let i = 0; i < N; i++) { u[i] += 0.02 * (r() - 0.5); v[i] = Math.max(0, v[i] + 0.02 * (r() - 0.5)); }
  } else {
    const [a, h] = steadyState(p)!;
    for (let i = 0; i < N; i++) { u[i] = a * (1 + 0.02 * (r() - 0.5)); v[i] = h; }
  }
  return { n, u, v, p, t: 0, steps: 0, seed };
}

/** Sum of the 5-point Laplacian with wrap-around edges (it is exactly zero for any field: diffusion moves, never makes). */
export function laplacianSum(f: Float32Array | Float64Array, n: number): number {
  let s = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const i = y * n + x; s += f[y * n + ((x + 1) % n)] + f[y * n + ((x + n - 1) % n)] + f[((y + 1) % n) * n + x] + f[((y + n - 1) % n) * n + x] - 4 * f[i]; }
  return s;
}

let bufU: Float32Array | null = null, bufV: Float32Array | null = null;
/** Advance the field by `count` explicit Euler steps of size p.dt. */
export function step(sim: Sim, count: number) {
  const { n, p } = sim, N = n * n, dt = p.dt;
  if (!bufU || bufU.length !== N) { bufU = new Float32Array(N); bufV = new Float32Array(N); }
  let u = sim.u, v = sim.v, nu = bufU, nv = bufV!;
  const [d1, d2] = p.model === 'gs' ? [p.Du, p.Dv] : [p.Da, p.Dh];
  const gs = p.model === 'gs';
  for (let c = 0; c < count; c++) {
    for (let y = 0; y < n; y++) {
      const up = ((y + n - 1) % n) * n, dn = ((y + 1) % n) * n, row = y * n;
      for (let x = 0; x < n; x++) {
        const i = row + x, l = row + ((x + n - 1) % n), r = row + ((x + 1) % n);
        const U = u[i], V = v[i];
        const lu = u[l] + u[r] + u[up + x] + u[dn + x] - 4 * U, lv = v[l] + v[r] + v[up + x] + v[dn + x] - 4 * V;
        let fu: number, fv: number;
        if (gs) { const uvv = U * V * V; fu = -uvv + (p as GS).F * (1 - U); fv = uvv - ((p as GS).F + (p as GS).k) * V; }
        else { const q = p as GM, a2 = U * U; fu = (q.rho * a2) / ((1 + q.kappa * a2) * Math.max(V, 1e-9)) - q.mua * U + q.sigma; fv = q.rho * a2 - q.muh * V; }
        nu[i] = U + dt * (d1 * lu + fu); nv[i] = V + dt * (d2 * lv + fv);
      }
    }
    [u, nu] = [nu, u]; [v, nv] = [nv, v];
  }
  // Keep the caller's arrays as the current field.
  if (u !== sim.u) { sim.u.set(u); sim.v.set(v); }
  sim.t += count * dt; sim.steps += count;
}

/** Simple pattern measures: mean, spread, and the share of cells above the mean (to tell spots from stripes). */
export function fieldStats(f: Float32Array) {
  let m = 0, lo = Infinity, hi = -Infinity; for (const x of f) { m += x; if (x < lo) lo = x; if (x > hi) hi = x; } m /= f.length;
  let s = 0, above = 0; for (const x of f) { s += (x - m) ** 2; if (x > m) above++; }
  return { mean: m, sd: Math.sqrt(s / f.length), min: lo, max: hi, above: above / f.length };
}
