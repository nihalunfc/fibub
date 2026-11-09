// Heat conduction: steady layered walls, transient 1D slabs (Crank-Nicolson with an exact series to compare),
// transient 2D plates (ADI), straight and pin fins, and insulated pipes with the critical radius. SI units. No DOM.

/** Rounded general properties: conductivity k (W/m·K), density (kg/m³), specific heat (J/kg·K). Editable on the page. */
export const MATERIALS: { id: string; name: string; k: number; rho: number; cp: number }[] = [
  { id: 'copper', name: 'Copper', k: 400, rho: 8960, cp: 385 },
  { id: 'aluminium', name: 'Aluminium', k: 205, rho: 2700, cp: 900 },
  { id: 'steel', name: 'Carbon steel', k: 50, rho: 7850, cp: 490 },
  { id: 'stainless', name: 'Stainless steel', k: 16, rho: 8000, cp: 500 },
  { id: 'glass', name: 'Glass', k: 1, rho: 2500, cp: 840 },
  { id: 'concrete', name: 'Concrete', k: 1.4, rho: 2300, cp: 880 },
  { id: 'brick', name: 'Brick', k: 0.7, rho: 1800, cp: 840 },
  { id: 'plaster', name: 'Plasterboard', k: 0.25, rho: 800, cp: 1000 },
  { id: 'wood', name: 'Softwood', k: 0.12, rho: 500, cp: 1600 },
  { id: 'water', name: 'Water (still)', k: 0.6, rho: 1000, cp: 4180 },
  { id: 'wool', name: 'Mineral wool', k: 0.04, rho: 30, cp: 840 },
  { id: 'eps', name: 'Polystyrene foam', k: 0.035, rho: 20, cp: 1300 },
];

// ---------- Steady layered wall ----------
export type Layer = { name: string; L: number; k: number };
/** Plane wall of layers between two fluids. hi, ho in W/m²K (Infinity for a fixed surface temperature). */
export function wall(layers: Layer[], Ti: number, To: number, hi: number, ho: number) {
  const Rs = [1 / hi, ...layers.map((l) => l.L / l.k), 1 / ho];
  const Rtot = Rs.reduce((s, r) => s + r, 0), q = (Ti - To) / Rtot;
  const temps = [Ti]; let T = Ti;
  for (const r of Rs) { T -= q * r; temps.push(T); }
  return { Rs, Rtot, U: 1 / Rtot, q, temps }; // temps: Ti, inside surface, interfaces..., outside surface, To
}

// ---------- Tridiagonal solver ----------
export function thomas(a: Float64Array, b: Float64Array, c: Float64Array, d: Float64Array, x: Float64Array) {
  const n = b.length, cp = new Float64Array(n), dp = new Float64Array(n);
  cp[0] = c[0] / b[0]; dp[0] = d[0] / b[0];
  for (let i = 1; i < n; i++) { const m = b[i] - a[i] * cp[i - 1]; cp[i] = c[i] / m; dp[i] = (d[i] - a[i] * dp[i - 1]) / m; }
  x[n - 1] = dp[n - 1];
  for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
}

// ---------- Transient 1D slab ----------
export type Bc = { type: 'fixed'; T: number } | { type: 'conv'; h: number; Tinf: number } | { type: 'insulated' };
/**
 * Slab of thickness L, conductivity k, diffusivity alpha, uniform initial T0, faces with boundary conditions.
 * Crank-Nicolson on n nodes (the first two steps backward Euler to damp the start-up jump). Returns the profile at
 * each requested time and the history at the two faces and the middle.
 */
export function slab1D(o: { L: number; k: number; alpha: number; T0: number; left: Bc; right: Bc; tEnd: number; n?: number; steps?: number; times: number[] }) {
  const n = o.n ?? 101, steps = o.steps ?? 2000, dx = o.L / (n - 1), dt = o.tEnd / steps;
  let T = new Float64Array(n).fill(o.T0);
  const x = Array.from({ length: n }, (_, i) => i * dx);
  // dT/dt = α/dx² (A T + g): rows of A and g for each node.
  const lo = new Float64Array(n), di = new Float64Array(n), up = new Float64Array(n), g = new Float64Array(n), fixed = new Array<number | null>(n).fill(null);
  for (let i = 1; i < n - 1; i++) { lo[i] = 1; di[i] = -2; up[i] = 1; }
  const face = (i: number, nb: number, bc: Bc) => {
    if (bc.type === 'fixed') { fixed[i] = bc.T; return; }
    // Ghost node mirrored across the face: insulated adds nothing, convection adds 2 dx h/k (T∞ − T).
    const bi = bc.type === 'conv' ? (2 * dx * bc.h) / o.k : 0;
    di[i] = -2 - bi; if (nb > i) up[i] = 2; else lo[i] = 2;
    g[i] = bc.type === 'conv' ? bi * bc.Tinf : 0;
  };
  face(0, 1, o.left); face(n - 1, n - 2, o.right);
  for (let i = 0; i < n; i++) if (fixed[i] !== null) T[i] = fixed[i]!;
  const a = new Float64Array(n), b = new Float64Array(n), c = new Float64Array(n), d = new Float64Array(n), nx = new Float64Array(n);
  const want = [...o.times].sort((p, q) => p - q), profiles: { t: number; T: number[] }[] = [];
  const hist = { t: [0], left: [T[0]], mid: [T[(n - 1) >> 1]], right: [T[n - 1]] };
  let wi = 0;
  while (wi < want.length && want[wi] <= 0) { profiles.push({ t: want[wi], T: Array.from(T) }); wi++; }
  for (let s = 1; s <= steps; s++) {
    const th = s <= 2 ? 1 : 0.5, r = (o.alpha * dt) / (dx * dx);
    for (let i = 0; i < n; i++) {
      if (fixed[i] !== null) { a[i] = 0; b[i] = 1; c[i] = 0; d[i] = fixed[i]!; continue; }
      a[i] = -th * r * lo[i]; b[i] = 1 - th * r * di[i]; c[i] = -th * r * up[i];
      const AT = di[i] * T[i] + (i > 0 ? lo[i] * T[i - 1] : 0) + (i < n - 1 ? up[i] * T[i + 1] : 0);
      d[i] = T[i] + (1 - th) * r * AT + r * g[i];
    }
    thomas(a, b, c, d, nx); T = Float64Array.from(nx);
    const t = s * dt;
    if (s % Math.max(1, Math.round(steps / 400)) === 0 || s === steps) { hist.t.push(t); hist.left.push(T[0]); hist.mid.push(T[(n - 1) >> 1]); hist.right.push(T[n - 1]); }
    while (wi < want.length && want[wi] <= t + 1e-9 * o.tEnd) { profiles.push({ t: want[wi], T: Array.from(T) }); wi++; }
  }
  return { x, profiles, hist, final: Array.from(T) };
}

/** Roots ζ of ζ tan ζ = Bi (first n), for the plane-wall series solution. Bi = Infinity gives (2j − 1)π/2. */
export function zetas(Bi: number, n = 60) {
  const out: number[] = [];
  for (let j = 0; j < n; j++) {
    if (!Number.isFinite(Bi)) { out.push((j + 0.5) * Math.PI); continue; }
    let lo = j * Math.PI + 1e-12, hi = j * Math.PI + Math.PI / 2 - 1e-12;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (m * Math.tan(m) < Bi) lo = m; else hi = m; }
    out.push((lo + hi) / 2);
  }
  return out;
}
/**
 * Exact series for a plane wall of half-thickness Lh, initially Ti, both faces suddenly exposed to a fluid at Tinf
 * through h (h = Infinity: faces held at Tinf). xs is the distance from the centre plane.
 */
export function wallSeries(Lh: number, k: number, alpha: number, h: number, Ti: number, Tinf: number, t: number, xs: number, terms = 60) {
  const Bi = (h * Lh) / k, z = zetas(Bi, terms), Fo = (alpha * t) / (Lh * Lh);
  let s = 0;
  for (const zn of z) { const C = (4 * Math.sin(zn)) / (2 * zn + Math.sin(2 * zn)); s += C * Math.exp(-zn * zn * Fo) * Math.cos((zn * xs) / Lh); }
  return Tinf + (Ti - Tinf) * s;
}

// ---------- Transient 2D plate (ADI) ----------
/**
 * Rectangle W × H with edges held at fixed temperatures [top, right, bottom, left], interior initially T0.
 * Peaceman-Rachford ADI on an nx × ny grid. Returns the field (row 0 = bottom) at the end time, or the steady state
 * when t is Infinity (iterated until it stops changing).
 */
export function plate2D(o: { W: number; H: number; alpha: number; T0: number; edges: [number, number, number, number]; t: number; nx?: number; ny?: number; steps?: number }) {
  const nx = o.nx ?? 41, ny = o.ny ?? 41, dx = o.W / (nx - 1), dy = o.H / (ny - 1);
  const [Tt, Tr, Tb, Tl] = o.edges, F = new Float64Array(nx * ny).fill(o.T0);
  const id = (i: number, j: number) => j * nx + i;
  for (let i = 0; i < nx; i++) { F[id(i, 0)] = Tb; F[id(i, ny - 1)] = Tt; }
  for (let j = 0; j < ny; j++) { F[id(0, j)] = Tl; F[id(nx - 1, j)] = Tr; }
  F[id(0, 0)] = (Tb + Tl) / 2; F[id(nx - 1, 0)] = (Tb + Tr) / 2; F[id(0, ny - 1)] = (Tt + Tl) / 2; F[id(nx - 1, ny - 1)] = (Tt + Tr) / 2;
  const steady = !Number.isFinite(o.t);
  // For the steady state, use big pseudo-time steps cycling through a range (fast ADI convergence).
  const steps = steady ? 4000 : o.steps ?? 200, dtFix = steady ? 0 : o.t / steps;
  const half = new Float64Array(nx * ny);
  const m = Math.max(nx, ny), a = new Float64Array(m), b = new Float64Array(m), c = new Float64Array(m), d = new Float64Array(m), x = new Float64Array(m);
  const sweepX = (src: Float64Array, dst: Float64Array, rx: number, ry: number) => {
    const n = nx - 2;
    for (let j = 1; j < ny - 1; j++) {
      for (let k = 0; k < n; k++) {
        const i = k + 1;
        a[k] = k === 0 ? 0 : -rx; c[k] = k === n - 1 ? 0 : -rx; b[k] = 1 + 2 * rx;
        d[k] = src[id(i, j)] + ry * (src[id(i, j - 1)] - 2 * src[id(i, j)] + src[id(i, j + 1)]);
        if (k === 0) d[k] += rx * src[id(0, j)];
        if (k === n - 1) d[k] += rx * src[id(nx - 1, j)];
      }
      thomas(a.subarray(0, n), b.subarray(0, n), c.subarray(0, n), d.subarray(0, n), x.subarray(0, n));
      for (let k = 0; k < n; k++) dst[id(k + 1, j)] = x[k];
    }
  };
  const sweepY = (src: Float64Array, dst: Float64Array, rx: number, ry: number) => {
    const n = ny - 2;
    for (let i = 1; i < nx - 1; i++) {
      for (let k = 0; k < n; k++) {
        const j = k + 1;
        a[k] = k === 0 ? 0 : -ry; c[k] = k === n - 1 ? 0 : -ry; b[k] = 1 + 2 * ry;
        d[k] = src[id(i, j)] + rx * (src[id(i - 1, j)] - 2 * src[id(i, j)] + src[id(i + 1, j)]);
        if (k === 0) d[k] += ry * src[id(i, 0)];
        if (k === n - 1) d[k] += ry * src[id(i, ny - 1)];
      }
      thomas(a.subarray(0, n), b.subarray(0, n), c.subarray(0, n), d.subarray(0, n), x.subarray(0, n));
      for (let k = 0; k < n; k++) dst[id(i, k + 1)] = x[k];
    }
  };
  half.set(F);
  let done = 0;
  for (let s = 0; s < steps; s++) {
    let dt = dtFix;
    if (steady) { const lo = Math.min(dx, dy) ** 2 / o.alpha, hi = Math.max(o.W, o.H) ** 2 / o.alpha; dt = lo * Math.pow(hi / lo, (s % 12) / 11) * 0.25; }
    const rx = (o.alpha * dt) / (2 * dx * dx), ry = (o.alpha * dt) / (2 * dy * dy);
    const old = steady ? Float64Array.from(F) : null;
    sweepX(F, half, rx, ry); sweepY(half, F, rx, ry);
    done = s + 1;
    if (old && s % 12 === 11) { let mx = 0; for (let k = 0; k < F.length; k++) mx = Math.max(mx, Math.abs(F[k] - old[k])); if (mx < 1e-10 * (Math.max(...o.edges.map(Math.abs), Math.abs(o.T0)) || 1)) break; }
  }
  return { nx, ny, F, steps: done };
}

/** Exact steady state of a rectangle with the top edge at T1 and the other three at T0 (Fourier series). */
export function plateSteadyExact(W: number, H: number, T1: number, T0: number, x: number, y: number, terms = 401) {
  let s = 0;
  for (let n = 1; n <= terms; n += 2) {
    const a = (n * Math.PI) / W;
    // sinh(a y)/sinh(a H) written to avoid overflow.
    const ratio = Math.exp(a * (y - H)) * (1 - Math.exp(-2 * a * y)) / (1 - Math.exp(-2 * a * H));
    s += (4 / (n * Math.PI)) * Math.sin(a * x) * ratio;
  }
  return T0 + (T1 - T0) * s;
}

// ---------- Fins ----------
/** Straight rectangular fin (thickness t, width w) or pin fin (diameter D), length L, with a convective or adiabatic tip. */
export function fin(o: { shape: 'rect' | 'pin'; k: number; h: number; L: number; t?: number; w?: number; D?: number; Tb: number; Tinf: number; tip: 'conv' | 'adiabatic' }) {
  const Ac = o.shape === 'rect' ? o.w! * o.t! : (Math.PI * o.D! ** 2) / 4, P = o.shape === 'rect' ? 2 * (o.w! + o.t!) : Math.PI * o.D!;
  const m = Math.sqrt((o.h * P) / (o.k * Ac)), th = o.Tb - o.Tinf, M = Math.sqrt(o.h * P * o.k * Ac) * th, mL = m * o.L, hm = o.tip === 'conv' ? o.h / (m * o.k) : 0;
  const den = Math.cosh(mL) + hm * Math.sinh(mL);
  const q = (M * (Math.sinh(mL) + hm * Math.cosh(mL))) / den;
  const Af = P * o.L + (o.tip === 'conv' ? Ac : 0);
  const T = (x: number) => o.Tinf + (th * (Math.cosh(m * (o.L - x)) + hm * Math.sinh(m * (o.L - x)))) / den;
  return { Ac, P, m, mL, q, eta: q / (o.h * Af * th), eff: q / (o.h * Ac * th), Af, T, Ttip: T(o.L), Rfin: th / q };
}

// ---------- Insulated pipe ----------
/** Heat loss per metre of a pipe (radii ri < ro, wall k) with insulation of thickness s (k_ins), inside film hi (Infinity = none), outside film ho. */
export function pipe(o: { ri: number; ro: number; kp: number; s: number; kins: number; hi: number; ho: number; Tin: number; Tinf: number }) {
  const r2 = o.ro + o.s, tp = 2 * Math.PI;
  const R = { inside: Number.isFinite(o.hi) ? 1 / (o.hi * tp * o.ri) : 0, wall: Math.log(o.ro / o.ri) / (tp * o.kp), ins: Math.log(r2 / o.ro) / (tp * o.kins), outside: 1 / (o.ho * tp * r2) };
  const Rt = R.inside + R.wall + R.ins + R.outside, Q = (o.Tin - o.Tinf) / Rt;
  return { R, Rt, Q, Tsurf: o.Tinf + Q * R.outside, Tpipe: o.Tin - Q * (R.inside + R.wall), rcrit: o.kins / o.ho, r2 };
}
/** Insulation thickness that brings the outer surface down to Tmax (bisection; null if not possible below 2 m). */
export function thicknessFor(o: Parameters<typeof pipe>[0], Tmax: number) {
  const f = (s: number) => pipe({ ...o, s }).Tsurf - Tmax;
  const hot = o.Tin > o.Tinf;
  const sign = (v: number) => (hot ? v : -v);
  if (sign(f(0)) <= 0) return 0;
  let lo = 0, hi = 2;
  if (sign(f(hi)) > 0) return null;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (sign(f(m)) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
