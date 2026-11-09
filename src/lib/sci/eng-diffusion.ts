// One-group (and optional two-group) neutron diffusion in a bare homogeneous reactor, for study: geometric buckling,
// k_eff, critical size, flux shapes, and a 1D finite-volume solve with power iteration to check the analytic answer.
// Plain TypeScript, no DOM. Example materials are made up for fibub.

export type Geometry =
  | { kind: 'slab'; a: number }
  | { kind: 'sphere'; R: number }
  | { kind: 'cylinder'; R: number; H?: number } // H omitted (or 0): infinitely tall
  | { kind: 'cuboid'; a: number; b: number; c: number };

/** First zero of J0. */
export const J0_ZERO = 2.404825557695773;
/** Bessel J0 by its power series (accurate to 1e-15 for |x| ≤ 6). */
export function besselJ0(x: number): number {
  const y = (x * x) / 4;
  let term = 1, sum = 1;
  for (let k = 1; k < 60; k++) { term *= -y / (k * k); sum += term; if (Math.abs(term) < 1e-17 * Math.abs(sum)) break; }
  return sum;
}

/** Extrapolation distance used: 2.13 D (≈ 0.71 transport mean free paths). */
export const extrap = (D: number) => 2.13 * D;

/** Geometry with every outer dimension grown by the extrapolation distance d on each side. */
export function extrapolated(g: Geometry, d: number): Geometry {
  if (g.kind === 'slab') return { kind: 'slab', a: g.a + 2 * d };
  if (g.kind === 'sphere') return { kind: 'sphere', R: g.R + d };
  if (g.kind === 'cylinder') return { kind: 'cylinder', R: g.R + d, H: g.H ? g.H + 2 * d : 0 };
  return { kind: 'cuboid', a: g.a + 2 * d, b: g.b + 2 * d, c: g.c + 2 * d };
}

/** Geometric buckling B² (1/cm²) of a bare reactor whose flux is zero on the given (already extrapolated) boundary. */
export function buckling(g: Geometry): number {
  const p2 = Math.PI ** 2;
  if (g.kind === 'slab') return p2 / g.a ** 2;
  if (g.kind === 'sphere') return p2 / g.R ** 2;
  if (g.kind === 'cylinder') return (J0_ZERO / g.R) ** 2 + (g.H ? p2 / g.H ** 2 : 0);
  return p2 * (1 / g.a ** 2 + 1 / g.b ** 2 + 1 / g.c ** 2);
}

export type OneGroup = { D: number; sigA: number; nuSigF: number };
export const kInf = (m: OneGroup) => m.nuSigF / m.sigA;
export const L2 = (m: OneGroup) => m.D / m.sigA;
export const keff1 = (m: OneGroup, B2: number) => kInf(m) / (1 + L2(m) * B2);
/** Material buckling: the B² that makes k_eff = 1. Negative when k∞ < 1 (no size is critical). */
export const materialB2 = (m: OneGroup) => (kInf(m) - 1) / L2(m);

export type TwoGroup = { D1: number; sigR1: number; sigA1: number; D2: number; sigA2: number; nuSigF2: number };
/** Two-group bare reactor with fission from thermal neutrons only: k∞ = νΣf2·Σ12 / (ΣR1·Σa2), Σ12 = ΣR1 − Σa1. */
export function twoGroup(m: TwoGroup) {
  const s12 = m.sigR1 - m.sigA1, k = (m.nuSigF2 * s12) / (m.sigR1 * m.sigA2), l1 = m.D1 / m.sigR1, l2 = m.D2 / m.sigA2;
  // (1 + L1² B²)(1 + L2² B²) = k∞ → L1² L2² B⁴ + (L1² + L2²) B² + 1 − k∞ = 0
  const a = l1 * l2, b = l1 + l2, c = 1 - k, B2c = k > 1 ? (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a) : NaN;
  return { kInf: k, L1sq: l1, L2sq: l2, M2: l1 + l2, keff: (B2: number) => k / ((1 + l1 * B2) * (1 + l2 * B2)), B2c, sig12: s12 };
}

/**
 * Critical size for buckling B2c (1/cm²), returned as the physical size (extrapolation distance d taken off).
 * Cylinder: give hOverD (height ÷ diameter of the extrapolated core) or 0 for infinitely tall.
 * Cuboid: a cube when no ratios are given.
 */
export function criticalSize(kind: Geometry['kind'], B2c: number, d = 0, hOverD = 0): Geometry | null {
  if (!(B2c > 0)) return null;
  const B = Math.sqrt(B2c);
  if (kind === 'slab') return { kind, a: Math.PI / B - 2 * d };
  if (kind === 'sphere') return { kind, R: Math.PI / B - d };
  if (kind === 'cylinder') {
    if (!hOverD) return { kind, R: J0_ZERO / B - d, H: 0 };
    // H = 2R·hOverD: (j/R)² + (π/(2R·h))² = B² → R = sqrt(j² + (π/2h)²)/B
    const R = Math.sqrt(J0_ZERO ** 2 + (Math.PI / (2 * hOverD)) ** 2) / B;
    return { kind, R: R - d, H: 2 * R * hOverD - 2 * d };
  }
  const a = (Math.sqrt(3) * Math.PI) / B; // cube
  return { kind: 'cuboid', a: a - 2 * d, b: a - 2 * d, c: a - 2 * d };
}

/** Volume (cm³) of a physical geometry; an infinite cylinder or slab gives Infinity. */
export function volume(g: Geometry): number {
  if (g.kind === 'sphere') return (4 / 3) * Math.PI * g.R ** 3;
  if (g.kind === 'cylinder') return g.H ? Math.PI * g.R ** 2 * g.H : Infinity;
  if (g.kind === 'cuboid') return g.a * g.b * g.c;
  return Infinity;
}

/** Analytic flux shape along the main direction, 0 at the centre, normalised to 1 there. x in cm from the centre. */
export function shape(g: Geometry, x: number): number {
  if (g.kind === 'slab') return Math.cos((Math.PI * x) / g.a);
  if (g.kind === 'sphere') { const B = Math.PI / g.R; return x === 0 ? 1 : Math.sin(B * x) / (B * x); }
  if (g.kind === 'cylinder') return besselJ0((J0_ZERO * x) / g.R);
  return Math.cos((Math.PI * x) / g.a);
}

export type FdResult = { k: number; x: number[]; phi: number[]; iterations: number; converged: boolean };
/**
 * 1D finite-volume solve with power iteration, from the centre (reflective) to the extrapolated edge (flux 0).
 * The main direction is x for a slab or cuboid (other two sides add transverse buckling), r for a sphere, and
 * r for a cylinder (its height adds transverse buckling). Returns k_eff and the flux normalised to 1 at the centre.
 */
export function fdSolve(m: OneGroup, gExt: Geometry, n = 200, tol = 1e-12, maxIt = 20000): FdResult {
  let edge: number, power: number, Bt2 = 0;
  if (gExt.kind === 'slab') { edge = gExt.a / 2; power = 0; }
  else if (gExt.kind === 'cuboid') { edge = gExt.a / 2; power = 0; Bt2 = Math.PI ** 2 * (1 / gExt.b ** 2 + 1 / gExt.c ** 2); }
  else if (gExt.kind === 'sphere') { edge = gExt.R; power = 2; }
  else { edge = gExt.R; power = 1; Bt2 = gExt.H ? (Math.PI / gExt.H) ** 2 : 0; }
  const h = edge / n, A = (r: number) => r ** power, V = (r0: number, r1: number) => (r1 ** (power + 1) - r0 ** (power + 1)) / (power + 1);
  // Tridiagonal: lo[i] φ[i−1] + di[i] φ[i] + up[i] φ[i+1] = (1/k) νΣf V_i φ_i
  const lo = new Float64Array(n), di = new Float64Array(n), up = new Float64Array(n), vol = new Float64Array(n), x: number[] = [];
  for (let i = 0; i < n; i++) {
    const r0 = i * h, r1 = (i + 1) * h; x.push((i + 0.5) * h); vol[i] = V(r0, r1);
    const cin = i > 0 ? (m.D * A(r0)) / h : 0, cout = i < n - 1 ? (m.D * A(r1)) / h : (m.D * A(r1)) / (h / 2);
    lo[i] = -cin; up[i] = i < n - 1 ? -cout : 0; di[i] = cin + cout + (m.sigA + m.D * Bt2) * vol[i];
  }
  const solveTri = (rhs: Float64Array) => {
    const c = new Float64Array(n), d = new Float64Array(n), out = new Float64Array(n);
    c[0] = up[0] / di[0]; d[0] = rhs[0] / di[0];
    for (let i = 1; i < n; i++) { const w = di[i] - lo[i] * c[i - 1]; c[i] = up[i] / w; d[i] = (rhs[i] - lo[i] * d[i - 1]) / w; }
    out[n - 1] = d[n - 1]; for (let i = n - 2; i >= 0; i--) out[i] = d[i] - c[i] * out[i + 1];
    return out;
  };
  let phi = new Float64Array(n).fill(1), k = 1, it = 0, converged = false;
  const src = (p: Float64Array) => { const s = new Float64Array(n); for (let i = 0; i < n; i++) s[i] = m.nuSigF * vol[i] * p[i]; return s; };
  let S = src(phi), sum = S.reduce((a, b) => a + b, 0);
  while (it < maxIt) {
    it++;
    const next = solveTri(S.map((v) => v / k) as Float64Array), S2 = src(next), sum2 = S2.reduce((a, b) => a + b, 0);
    const k2 = (k * sum2) / sum;
    phi = next; S = S2; sum = sum2;
    const done = Math.abs(k2 - k) < tol * k2; k = k2;
    if (done) { converged = true; break; }
  }
  const c0 = phi[0]; // centre value by extrapolating the first two cells to r = 0 (zero slope there)
  const centre = c0 + (c0 - phi[1]) / 8;
  return { k, x, phi: Array.from(phi, (v) => v / centre), iterations: it, converged };
}

export const EXAMPLE_ONE: OneGroup = { D: 0.9, sigA: 0.0195, nuSigF: 0.0245 };
export const EXAMPLE_TWO: TwoGroup = { D1: 1.3, sigR1: 0.024, sigA1: 0.002, D2: 0.45, sigA2: 0.08, nuSigF2: 0.115 };
