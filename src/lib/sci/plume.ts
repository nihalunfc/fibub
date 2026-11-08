// Gaussian plume dispersion from a continuous point source (a chimney or vent), with ground reflection, an optional
// mixing lid, Pasquill-Gifford stability classes, Briggs (1973) dispersion curves for open country and cities,
// a power-law wind profile and Briggs buoyant plume rise. Plain maths; no DOM.

export type Terrain = 'rural' | 'urban';
export const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type Cls = (typeof CLASSES)[number];
export const CLASS_NAMES: Record<Cls, string> = {
  A: 'very unstable', B: 'moderately unstable', C: 'slightly unstable', D: 'neutral', E: 'slightly stable', F: 'moderately stable',
};

/** Briggs (1973) sigma-y and sigma-z in metres at x metres downwind, for one class. Fitted for about 100 m to 10 km. */
export function sigmas(x: number, c: Cls, t: Terrain): { sy: number; sz: number } {
  if (t === 'rural') {
    const ky = { A: 0.22, B: 0.16, C: 0.11, D: 0.08, E: 0.06, F: 0.04 }[c];
    const sy = (ky * x) / Math.sqrt(1 + 0.0001 * x);
    const sz = c === 'A' ? 0.2 * x : c === 'B' ? 0.12 * x : c === 'C' ? (0.08 * x) / Math.sqrt(1 + 0.0002 * x)
      : c === 'D' ? (0.06 * x) / Math.sqrt(1 + 0.0015 * x) : c === 'E' ? (0.03 * x) / (1 + 0.0003 * x) : (0.016 * x) / (1 + 0.0003 * x);
    return { sy, sz };
  }
  const g = c === 'A' || c === 'B' ? 0 : c === 'C' ? 1 : c === 'D' ? 2 : 3;
  const sy = ([0.32, 0.22, 0.16, 0.11][g] * x) / Math.sqrt(1 + 0.0004 * x);
  const sz = g === 0 ? 0.24 * x * Math.sqrt(1 + 0.001 * x) : g === 1 ? 0.2 * x : g === 2 ? (0.14 * x) / Math.sqrt(1 + 0.0003 * x) : (0.08 * x) / Math.sqrt(1 + 0.0015 * x);
  return { sy, sz };
}

/** A class may be a pair such as "AB" (between A and B); the sigmas are then the average of the two. */
export function sigmasFor(x: number, cls: string, t: Terrain) {
  const cs = [...cls].filter((ch) => (CLASSES as readonly string[]).includes(ch)) as Cls[];
  if (!cs.length) throw new Error(`Unknown stability class "${cls}"`);
  const all = cs.map((c) => sigmas(x, c, t));
  return { sy: all.reduce((a, s) => a + s.sy, 0) / all.length, sz: all.reduce((a, s) => a + s.sz, 0) / all.length };
}

/** Wind-profile exponents p in u(z) = u10 (z / 10)^p, as used in US EPA regulatory models (ISC3). */
export const WIND_P: Record<Terrain, Record<Cls, number>> = {
  rural: { A: 0.07, B: 0.07, C: 0.1, D: 0.15, E: 0.35, F: 0.55 },
  urban: { A: 0.15, B: 0.15, C: 0.2, D: 0.25, E: 0.3, F: 0.3 },
};
const firstClass = (cls: string) => ([...cls].find((ch) => (CLASSES as readonly string[]).includes(ch)) ?? 'D') as Cls;
/** Wind speed at height z (m) from the 10 m wind; heights below 10 m use the 10 m wind. */
export const windAt = (u10: number, z: number, cls: string, t: Terrain) => {
  const cs = [...cls].filter((ch) => (CLASSES as readonly string[]).includes(ch)) as Cls[];
  const p = cs.length ? cs.reduce((a, c) => a + WIND_P[t][c], 0) / cs.length : WIND_P[t].D;
  return u10 * Math.pow(Math.max(z, 10) / 10, p);
};

/**
 * Pasquill's class from the 10 m wind (m/s) and the sky, as in Turner's table.
 * sky: 'strong' | 'moderate' | 'slight' sunshine by day, 'overcast' (day or night), 'night-cloudy' (at least 4/8 low cloud), 'night-clear' (3/8 or less).
 */
export type Sky = 'strong' | 'moderate' | 'slight' | 'overcast' | 'night-cloudy' | 'night-clear';
export function pasquillClass(u10: number, sky: Sky): string {
  if (sky === 'overcast') return 'D';
  const row = u10 < 2 ? 0 : u10 < 3 ? 1 : u10 < 5 ? 2 : u10 < 6 ? 3 : 4;
  const T: Record<Exclude<Sky, 'overcast'>, string[]> = {
    strong: ['A', 'AB', 'B', 'C', 'C'], moderate: ['AB', 'B', 'BC', 'CD', 'D'], slight: ['B', 'C', 'C', 'D', 'D'],
    'night-cloudy': ['E', 'E', 'D', 'D', 'D'], 'night-clear': ['F', 'F', 'E', 'D', 'D'],
  };
  return T[sky][row];
}

/**
 * Briggs buoyant plume rise. Stack gas exit speed vs (m/s), inner diameter d (m), gas and air temperatures in K,
 * wind at stack top u (m/s). Returns the buoyancy flux F (m⁴/s³), the final rise and the distance it is reached,
 * and a function for the gradual rise 1.6 F^(1/3) x^(2/3) / u up to that final value.
 */
export function plumeRise(vs: number, d: number, Ts: number, Ta: number, u: number, cls: string) {
  const g = 9.80665;
  const F = Ts > Ta ? (g * vs * d * d * (Ts - Ta)) / (4 * Ts) : 0;
  const c = firstClass(cls);
  let dh: number, xf: number;
  if (F <= 0) { dh = 0; xf = 0; }
  else if (c === 'E' || c === 'F') {
    const dtheta = c === 'E' ? 0.02 : 0.035; // K/m, potential temperature gradient
    const s = (g * dtheta) / Ta;
    dh = 2.6 * Math.cbrt(F / (u * s));
    xf = (2.0715 * u) / Math.sqrt(s);
  } else if (F < 55) { dh = (21.425 * Math.pow(F, 0.75)) / u; xf = 49 * Math.pow(F, 5 / 8); }
  else { dh = (38.71 * Math.pow(F, 0.6)) / u; xf = 119 * Math.pow(F, 0.4); }
  const gradual = (x: number) => (F <= 0 ? 0 : Math.min(dh, (1.6 * Math.cbrt(F) * Math.pow(Math.max(x, 0), 2 / 3)) / u));
  return { F, dh, xf, gradual };
}

/** The vertical term: the plume and its mirror images in the ground and, if L is given, in the lid at height L. */
export function vertical(z: number, H: number, sz: number, L?: number): number {
  const g = (d: number) => Math.exp(-(d * d) / (2 * sz * sz));
  if (!L || !(L > 0)) return g(z - H) + g(z + H);
  if (H > L || z > L) return 0; // above the lid the model has no answer at the ground; the plume is treated as trapped aloft
  if (sz > 1.6 * L) return (Math.sqrt(2 * Math.PI) * sz) / L; // well mixed below the lid
  let s = 0;
  const k = Math.min(200, Math.ceil((4 * sz) / L) + 2);
  for (let n = -k; n <= k; n++) s += g(z - H - 2 * n * L) + g(z + H - 2 * n * L);
  return s;
}

export type Source = {
  /** Emission rate, g/s. */ Q: number;
  /** Wind at the stack top (or at the effective height), m/s. */ u: number;
  /** Effective release height, m (stack plus plume rise). */ H: number;
  cls: string; terrain: Terrain;
  /** Mixing height, m (optional). */ L?: number;
};

/** Concentration in g/m³ at (x downwind, y crosswind, z height), metres. Zero upwind. */
export function conc(s: Source, x: number, y = 0, z = 0, Hx?: number): number {
  if (!(x > 0)) return 0;
  const { sy, sz } = sigmasFor(x, s.cls, s.terrain);
  const H = Hx ?? s.H;
  return (s.Q / (2 * Math.PI * s.u * sy * sz)) * Math.exp(-(y * y) / (2 * sy * sy)) * vertical(z, H, sz, s.L);
}

/** Highest ground-level centreline concentration between xMin and xMax, and where. Hx(x) gives the plume height at x. */
export function groundMax(s: Source, xMin = 100, xMax = 50000, Hx?: (x: number) => number): { x: number; c: number } {
  const f = (lx: number) => { const x = Math.exp(lx); return conc(s, x, 0, 0, Hx ? Hx(x) : s.H); };
  const a = Math.log(xMin), b = Math.log(xMax), N = 400;
  let bi = 0, bc = -1;
  for (let i = 0; i <= N; i++) { const c = f(a + ((b - a) * i) / N); if (c > bc) { bc = c; bi = i; } }
  let lo = a + ((b - a) * Math.max(0, bi - 1)) / N, hi = a + ((b - a) * Math.min(N, bi + 1)) / N;
  for (let k = 0; k < 60; k++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) lo = m1; else hi = m2;
  }
  const lx = (lo + hi) / 2, c = f(lx);
  return c >= bc ? { x: Math.exp(lx), c } : { x: Math.exp(a + ((b - a) * bi) / N), c: bc };
}

/** Crosswind width (m) at x where the ground-level concentration is at least `frac` of the centreline value. */
export const halfWidth = (x: number, cls: string, t: Terrain, frac = 0.1) => sigmasFor(x, cls, t).sy * Math.sqrt(-2 * Math.log(frac));
