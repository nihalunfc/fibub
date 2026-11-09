// Band structure toy models: tight-binding chains, the square lattice, graphene and the Kronig-Penney
// model, with densities of states. Plain maths, no DOM. Energies in eV, lengths in nm.

/** ħ²/(2 mₑ) in eV·nm² (CODATA, rounded to 6 figures). */
export const HB2M = 0.0380998;
/** ħ in eV·s. */
export const HBAR_EVS = 6.582119569e-16;

export type TB =
  | { kind: 'chain'; t: number; tp: number }
  | { kind: 'diatomic'; t: number; delta: number }
  | { kind: 'square'; t: number; tp: number }
  | { kind: 'graphene'; t: number; delta: number };

/** Band energies (eV) at a wavevector given in units of 1/a (a: lattice constant; for graphene the C–C distance). */
export function tbBands(m: TB, kx: number, ky = 0): number[] {
  switch (m.kind) {
    case 'chain': return [-2 * m.t * Math.cos(kx) - 2 * m.tp * Math.cos(2 * kx)];
    case 'diatomic': {
      // Two sites per cell of length a, on-site ±Δ/2, equal hopping t: E = ±√(Δ²/4 + 2t²(1 + cos ka)).
      const r = Math.sqrt((m.delta * m.delta) / 4 + 2 * m.t * m.t * (1 + Math.cos(kx)));
      return [-r, r];
    }
    case 'square': return [-2 * m.t * (Math.cos(kx) + Math.cos(ky)) - 4 * m.tp * Math.cos(kx) * Math.cos(ky)];
    case 'graphene': {
      // a1 = (3/2, √3/2), a2 = (3/2, −√3/2) in units of the C–C distance; f = 1 + e^{ik·a1} + e^{ik·a2}.
      const p1 = 1.5 * kx + (Math.sqrt(3) / 2) * ky, p2 = 1.5 * kx - (Math.sqrt(3) / 2) * ky;
      const re = 1 + Math.cos(p1) + Math.cos(p2), im = Math.sin(p1) + Math.sin(p2);
      const r = Math.sqrt((m.delta * m.delta) / 4 + m.t * m.t * (re * re + im * im));
      return [-r, r];
    }
  }
}

export type PathPoint = { x: number; kx: number; ky: number };
export type KPath = { pts: PathPoint[]; ticks: { at: number; label: string }[]; length: number };

/** The usual path through the Brillouin zone for each model, n points per segment. */
export function tbPath(m: TB, n = 80): KPath {
  const P = Math.PI;
  let corners: [string, number, number][];
  if (m.kind === 'chain' || m.kind === 'diatomic') corners = [['−π/a', -P, 0], ['Γ', 0, 0], ['π/a', P, 0]];
  else if (m.kind === 'square') corners = [['Γ', 0, 0], ['X', P, 0], ['M', P, P], ['Γ', 0, 0]];
  else corners = [['Γ', 0, 0], ['K', (2 * P) / 3, (2 * P) / (3 * Math.sqrt(3))], ['M', (2 * P) / 3, 0], ['Γ', 0, 0]];
  const pts: PathPoint[] = [], ticks: { at: number; label: string }[] = [];
  let x = 0;
  for (let s = 0; s < corners.length - 1; s++) {
    const [la, ax, ay] = corners[s], [, bx, by] = corners[s + 1], len = Math.hypot(bx - ax, by - ay);
    ticks.push({ at: x, label: la });
    for (let i = s ? 1 : 0; i <= n; i++) { const f = i / n; pts.push({ x: x + f * len, kx: ax + f * (bx - ax), ky: ay + f * (by - ay) }); }
    x += len;
  }
  ticks.push({ at: x, label: corners[corners.length - 1][0] });
  return { pts, ticks, length: x };
}

/** Every band energy on a uniform grid of the Brillouin zone (n points per direction, or n points in 1D). */
export function tbSamples(m: TB, n: number): Float64Array {
  const out: number[] = [];
  const P = Math.PI;
  if (m.kind === 'chain' || m.kind === 'diatomic') {
    for (let i = 0; i < n; i++) out.push(...tbBands(m, -P + (2 * P * (i + 0.5)) / n));
  } else if (m.kind === 'square') {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out.push(...tbBands(m, -P + (2 * P * (i + 0.5)) / n, -P + (2 * P * (j + 0.5)) / n));
  } else {
    // Graphene: sample the reciprocal cell spanned by b1, b2 (b1 = 2π/3 (1, √3), b2 = 2π/3 (1, −√3)).
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const u = (i + 0.5) / n, v = (j + 0.5) / n;
      out.push(...tbBands(m, ((2 * P) / 3) * (u + v), ((2 * P) / 3) * Math.sqrt(3) * (u - v)));
    }
  }
  return Float64Array.from(out);
}

export type Dos = { e: number[]; g: number[]; lo: number; hi: number; de: number };

/**
 * Density of states per eV per cell per spin from a set of sampled energies (histogram of `bins` bins,
 * each sample weighing 1/samplesPerBand). The area under g is the number of bands.
 */
export function dosFromSamples(E: Float64Array | number[], perBand: number, bins = 200, lo?: number, hi?: number): Dos {
  let a = Infinity, b = -Infinity;
  for (const x of E) { if (x < a) a = x; if (x > b) b = x; }
  lo ??= a; hi ??= b;
  if (!(hi > lo)) { lo -= 0.5; hi += 0.5; }
  const pad = (hi - lo) * 0.02; lo -= pad; hi += pad;
  const de = (hi - lo) / bins, g = new Array(bins).fill(0);
  for (const x of E) { const i = Math.min(bins - 1, Math.max(0, Math.floor((x - lo) / de))); g[i] += 1; }
  return { e: g.map((_, i) => lo! + (i + 0.5) * de), g: g.map((c) => c / perBand / de), lo, hi, de };
}

/** Fermi energy for a filling of n electrons per cell (both spins: 0 to 2 per band), from sorted samples. */
export function fermiLevel(E: Float64Array | number[], perBand: number, n: number): number {
  const s = Float64Array.from(E).sort();
  const states = n / 2 * perBand; // per spin
  if (states <= 0) return s[0];
  if (states >= s.length) return s[s.length - 1];
  const i = Math.floor(states);
  // Midpoint between the last filled and the first empty sample.
  return i <= 0 ? s[0] : i >= s.length ? s[s.length - 1] : (s[i - 1] + s[i]) / 2;
}

/** Exact density of states of the 1D chain with nearest-neighbour hopping only (per eV per site per spin). */
export const chainDosExact = (E: number, t: number) => (Math.abs(E) < 2 * Math.abs(t) ? 1 / (Math.PI * Math.sqrt(4 * t * t - E * E)) : 0);

/** Complete elliptic integral of the first kind K(m), parameter m = k², by the arithmetic-geometric mean. */
export function ellipK(m: number): number {
  let a = 1, b = Math.sqrt(1 - m);
  for (let i = 0; i < 40 && Math.abs(a - b) > 1e-15 * a; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return Math.PI / (2 * a);
}
/** Exact DOS of the square lattice with nearest-neighbour hopping t (per eV per site per spin). */
export function squareDosExact(E: number, t: number): number {
  const x = E / (4 * Math.abs(t));
  if (Math.abs(x) >= 1 || x === 0) return x === 0 ? Infinity : 0;
  return ellipK(1 - x * x) / (2 * Math.PI * Math.PI * Math.abs(t));
}

/** Effective mass (in electron masses) at the bottom of a cosine band E = −2t cos(ka): m* = ħ²/(2 t a²). */
export const tbMass = (t: number, aNm: number) => HB2M / (Math.abs(t) * aNm * aNm);
/** Graphene Fermi velocity v = 3 t d / (2ħ) in m/s (d: C–C distance in nm). */
export const grapheneVF = (t: number, dNm: number) => (3 * Math.abs(t) * dNm * 1e-9) / (2 * HBAR_EVS);

// ---------------- Kronig-Penney ----------------
export type KP = { V0: number; w: number; b: number; mass: number };

/**
 * The right-hand side of the Kronig-Penney condition cos(k(w + b)) = F(E) for a well of width w (V = 0) and
 * barrier of width b and height V0 (nm, eV), with effective mass `mass` × mₑ. |F| ≤ 1 means E is allowed.
 */
export function kpF(E: number, p: KP): number {
  const c = HB2M / p.mass;
  if (E <= 0) return NaN;
  const al = Math.sqrt(E / c);
  if (p.b === 0 || p.V0 === 0) return Math.cos(al * (p.w + p.b));
  if (Math.abs(E - p.V0) < 1e-12 * Math.max(1, p.V0)) {
    // Limit E = V0: barrier wavevector 0, so cos(αw) − (α b / 2) sin(αw).
    return Math.cos(al * p.w) - ((al * p.b) / 2) * Math.sin(al * p.w);
  }
  if (E < p.V0) {
    const ka = Math.sqrt((p.V0 - E) / c);
    return Math.cos(al * p.w) * Math.cosh(ka * p.b) + ((ka * ka - al * al) / (2 * al * ka)) * Math.sin(al * p.w) * Math.sinh(ka * p.b);
  }
  const be = Math.sqrt((E - p.V0) / c);
  return Math.cos(al * p.w) * Math.cos(be * p.b) - ((al * al + be * be) / (2 * al * be)) * Math.sin(al * p.w) * Math.sin(be * p.b);
}

/** The first `n` allowed bands [bottom, top] in eV, found by scanning and bisection. */
export function kpBands(p: KP, n = 4): [number, number][] {
  const L = p.w + p.b, c = HB2M / p.mass;
  // Free-electron energy of the n-th zone boundary sets the scan range, with margin.
  const Emax = Math.max(p.V0, 0) + c * Math.pow(((n + 1) * Math.PI) / L, 2) * 1.2;
  if (p.V0 === 0 || p.b === 0) return Array.from({ length: n }, (_, i) => [c * Math.pow((i * Math.PI) / L, 2), c * Math.pow(((i + 1) * Math.PI) / L, 2)] as [number, number]);
  const steps = 20000, dE = Emax / steps;
  const ok = (E: number) => Math.abs(kpF(E, p)) <= 1;
  const edge = (a: number, b: number) => { const oa = ok(a); for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (ok(m) === oa) a = m; else b = m; } return (a + b) / 2; };
  const out: [number, number][] = [];
  let prevE = dE * 1e-3, prev = ok(prevE), start = prev ? prevE : NaN;
  for (let i = 1; i <= steps && out.length < n; i++) {
    const E = i * dE, o = ok(E);
    if (o !== prev) {
      const x = edge(prevE, E);
      if (o) start = x; else out.push([start, x]);
    }
    prev = o; prevE = E;
  }
  return out;
}

/** Points (k in 1/nm, reduced to −π/L…π/L, E in eV) along each Kronig-Penney band, for plotting. */
export function kpCurve(p: KP, bands: [number, number][], per = 120): { k: number; E: number; band: number }[] {
  const L = p.w + p.b, out: { k: number; E: number; band: number }[] = [];
  bands.forEach(([lo, hi], bi) => {
    for (let i = 0; i <= per; i++) {
      // Cluster points near the band edges, where E(k) is flat.
      const f = 0.5 - 0.5 * Math.cos((Math.PI * i) / per), E = lo + f * (hi - lo);
      const F = Math.max(-1, Math.min(1, kpF(E, p))), k = Math.acos(F) / L;
      out.push({ k, E, band: bi }, { k: -k, E, band: bi });
    }
  });
  return out;
}

/** Kronig-Penney DOS per eV per nm of length per spin: g = (1/π)|dk/dE|, on a grid inside each band. */
export function kpDos(p: KP, bands: [number, number][], bins = 240): Dos {
  const L = p.w + p.b, lo = 0, hi = bands.length ? bands[bands.length - 1][1] * 1.02 : 1, de = (hi - lo) / bins;
  const e: number[] = [], g: number[] = [];
  const kOf = (E: number) => Math.acos(Math.max(-1, Math.min(1, kpF(E, p)))) / L;
  for (let i = 0; i < bins; i++) {
    const a = lo + i * de, b = a + de;
    let s = 0;
    // Integrate |dk| over the bin piecewise inside each band (exact up to the arccos), then divide by width.
    for (const [x0, x1] of bands) { const u = Math.max(a, x0), v = Math.min(b, x1); if (v > u) s += Math.abs(kOf(v) - kOf(u)); }
    e.push(a + de / 2); g.push(s / Math.PI / de);
  }
  return { e, g, lo, hi, de };
}
