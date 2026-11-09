// D2Q9 lattice Boltzmann solver, BGK collision, halfway bounce-back on solid cells, forces by momentum exchange.
// Lattice units throughout (cell size 1, time step 1, sound speed 1/√3). References: Krüger et al. (2017),
// The Lattice Boltzmann Method: Principles and Practice; Ladd (1994) for the momentum-exchange force.

export const CX = [0, 1, 0, -1, 0, 1, -1, -1, 1];
export const CY = [0, 0, 1, 0, -1, 1, 1, -1, -1];
export const W = [4 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 36, 1 / 36, 1 / 36, 1 / 36];
export const OPP = [0, 3, 4, 1, 2, 7, 8, 5, 6];

export type Mode = 'tunnel' | 'channel';

export class Lbm {
  nx: number; ny: number; N: number; tau: number; u0: number; mode: Mode; gx: number;
  f: Float32Array; fn: Float32Array; solid: Uint8Array; rho: Float32Array; ux: Float32Array; uy: Float32Array;
  fx = 0; fy = 0; t = 0;

  /** tunnel: uniform inflow u0 on the left, top and bottom, open outlet on the right. channel: periodic in x, walls top and bottom, body force gx. */
  constructor(nx: number, ny: number, tau: number, u0: number, mode: Mode = 'tunnel', gx = 0) {
    this.nx = nx; this.ny = ny; this.N = nx * ny; this.tau = tau; this.u0 = u0; this.mode = mode; this.gx = gx;
    this.f = new Float32Array(9 * this.N); this.fn = new Float32Array(9 * this.N);
    this.solid = new Uint8Array(this.N); this.rho = new Float32Array(this.N).fill(1);
    this.ux = new Float32Array(this.N).fill(mode === 'tunnel' ? u0 : 0); this.uy = new Float32Array(this.N);
    if (mode === 'channel') for (let x = 0; x < nx; x++) { this.solid[x] = 1; this.solid[(ny - 1) * nx + x] = 1; }
    for (let n = 0; n < this.N; n++) this.setEq(n, 1, this.solid[n] ? 0 : this.ux[n], 0);
  }
  setEq(n: number, r: number, u: number, v: number, arr = this.f) {
    const uu = 1.5 * (u * u + v * v), N = this.N;
    for (let i = 0; i < 9; i++) { const cu = CX[i] * u + CY[i] * v; arr[i * N + n] = W[i] * r * (1 + 3 * cu + 4.5 * cu * cu - uu); }
  }
  /** Mark a cell solid (true) or fluid (false); a cell turned back to fluid starts at rest. */
  setSolid(x: number, y: number, s: boolean) {
    if (x < 0 || y < 0 || x >= this.nx || y >= this.ny) return;
    if (this.mode === 'channel' && (y === 0 || y === this.ny - 1)) return;
    const n = y * this.nx + x;
    if (!!this.solid[n] === s) return;
    this.solid[n] = s ? 1 : 0;
    this.rho[n] = 1; this.ux[n] = 0; this.uy[n] = 0; this.setEq(n, 1, 0, 0);
  }
  clearSolids() { for (let y = 0; y < this.ny; y++) for (let x = 0; x < this.nx; x++) this.setSolid(x, y, this.mode === 'channel' && (y === 0 || y === this.ny - 1)); }

  step() {
    const { nx, ny, N, f, fn, solid, rho, ux, uy } = this;
    const om = 1 / this.tau, gx = this.gx;
    let FX = 0, FY = 0;
    // Collide (in place) then push to neighbours; links that hit a solid cell bounce back.
    for (let n = 0; n < N; n++) {
      if (solid[n]) continue;
      let r = 0, mx = 0, my = 0;
      for (let i = 0; i < 9; i++) { const v = f[i * N + n]; r += v; mx += CX[i] * v; my += CY[i] * v; }
      // Guo-style half-force shift keeps the forced flow second-order accurate.
      const u = (mx + 0.5 * gx * r) / r, v = my / r;
      rho[n] = r; ux[n] = u; uy[n] = v;
      const uu = 1.5 * (u * u + v * v);
      for (let i = 0; i < 9; i++) {
        const cu = CX[i] * u + CY[i] * v, k = i * N + n;
        let post = f[k] + om * (W[i] * r * (1 + 3 * cu + 4.5 * cu * cu - uu) - f[k]);
        if (gx) post += (1 - 0.5 * om) * W[i] * r * gx * (3 * (CX[i] - u) + 9 * cu * CX[i]);
        f[k] = post;
      }
    }
    for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
      const n = y * nx + x; if (solid[n]) continue;
      for (let i = 0; i < 9; i++) {
        let tx = x + CX[i], ty = y + CY[i];
        if (tx < 0) tx += nx; else if (tx >= nx) tx -= nx;
        if (ty < 0) ty += ny; else if (ty >= ny) ty -= ny;
        const m = ty * nx + tx, v = f[i * N + n];
        if (solid[m]) { fn[OPP[i] * N + n] = v; FX += 2 * CX[i] * v; FY += 2 * CY[i] * v; }
        else fn[i * N + m] = v;
      }
    }
    this.f = fn; this.fn = f;
    if (this.mode === 'tunnel') {
      for (let y = 0; y < ny; y++) {
        const a = y * nx, b = y * nx + nx - 1, c = y * nx + nx - 2;
        if (!solid[a]) this.setEq(a, 1, this.u0, 0);
        if (!solid[b]) for (let i = 0; i < 9; i++) this.f[i * N + b] = this.f[i * N + c];
      }
      for (let x = 0; x < nx; x++) { if (!solid[x]) this.setEq(x, 1, this.u0, 0); const t = (ny - 1) * nx + x; if (!solid[t]) this.setEq(t, 1, this.u0, 0); }
    }
    // Momentum exchange counts the wall walls too in channel mode; report only the force on inner solids there.
    this.fx = FX; this.fy = FY; this.t++;
    if (this.mode === 'channel') { this.fx = 0; this.fy = 0; }
  }
  /** Vorticity ∂v/∂x − ∂u/∂y by central differences (0 on edges and solids). */
  vorticity(out = new Float32Array(this.N)) {
    const { nx, ny, ux, uy, solid } = this;
    out.fill(0);
    for (let y = 1; y < ny - 1; y++) for (let x = 1; x < nx - 1; x++) {
      const n = y * nx + x; if (solid[n]) continue;
      out[n] = 0.5 * (uy[n + 1] - uy[n - 1]) - 0.5 * (ux[n + nx] - ux[n - nx]);
    }
    return out;
  }
  /** Size of the solid body across the flow (cells), the length used in Re, Cd and St. */
  frontalHeight(): number {
    let lo = Infinity, hi = -Infinity;
    for (let y = 0; y < this.ny; y++) for (let x = 0; x < this.nx; x++) if (this.solid[y * this.nx + x]) { if (this.mode === 'channel' && (y === 0 || y === this.ny - 1)) continue; lo = Math.min(lo, y); hi = Math.max(hi, y); }
    return hi >= lo ? hi - lo + 1 : 0;
  }
}

/** Relaxation time for a Reynolds number: ν = U L / Re, τ = 3ν + ½. */
export const tauFor = (Re: number, U: number, L: number) => 3 * ((U * L) / Re) + 0.5;

/** Shapes, drawn into the solid mask. cx, cy, size in cells; angle in degrees (for the plate and airfoil). */
export type Shape = 'cylinder' | 'square' | 'plate' | 'airfoil' | 'none';
export function drawShape(s: Lbm, shape: Shape, cx: number, cy: number, size: number, angleDeg = 0) {
  const a = (angleDeg * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a), r = size / 2;
  for (let y = 0; y < s.ny; y++) for (let x = 0; x < s.nx; x++) {
    const dx = x - cx, dy = y - cy;
    // Rotate into the body frame (positive angle tilts the nose up, as an angle of attack).
    const bx = dx * ca - dy * sa, by = dx * sa + dy * ca;
    let inside = false;
    if (shape === 'cylinder') inside = dx * dx + dy * dy <= r * r;
    else if (shape === 'square') inside = dx + r >= 0 && dx + r < size && dy + r >= 0 && dy + r < size;
    else if (shape === 'plate') inside = Math.abs(bx) <= Math.max(1, size * 0.06) && Math.abs(by) <= r;
    else if (shape === 'airfoil') { // NACA 0012, chord = size, leading edge at cx - size/2
      const xc = (bx + r) / size;
      if (xc >= 0 && xc <= 1) { const t = 0.6 * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc ** 2 + 0.2843 * xc ** 3 - 0.1036 * xc ** 4); inside = Math.abs(-by) <= Math.max(0.5, t * size); }
    }
    if (inside) s.setSolid(x, y, true);
  }
}

/** Strouhal number from a lift history (lattice steps): mean-removed zero crossings over the given tail. */
export function strouhal(lift: number[], D: number, U: number, tail = lift.length): number {
  const xs = lift.slice(-tail); if (xs.length < 10) return NaN;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const cross: number[] = [];
  for (let i = 1; i < xs.length; i++) if (xs[i - 1] - m < 0 && xs[i] - m >= 0) cross.push(i - 1 + (m - xs[i - 1]) / (xs[i] - xs[i - 1]));
  if (cross.length < 3) return NaN;
  const period = (cross[cross.length - 1] - cross[0]) / (cross.length - 1);
  return D / (period * U);
}
