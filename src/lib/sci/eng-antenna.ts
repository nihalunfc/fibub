// Antenna sizes: half-wave dipole, quarter-wave monopole, rectangular microstrip patch (transmission-line model as in
// Balanis, Antenna Theory, chapter 14, with the edge conductance, mutual conductance and inset feed), and Yagi-Uda
// element lengths from common rules of thumb. Plain TypeScript, no DOM; checked in tests/sci-tools/antenna-calculator.mjs.

export const C0 = 299792458; // speed of light, m/s (exact)

export const wavelength = (f: number) => C0 / f;

/** Half-wave dipole: free-space λ/2 and the cut length with a shortening (end-effect) factor k. */
export function dipole(f: number, k = 0.95) {
  const lam = wavelength(f);
  return { lambda: lam, half: lam / 2, length: (k * lam) / 2, leg: (k * lam) / 4, R: 73.13, gainDbi: 2.15 };
}
/** Quarter-wave monopole over a ground plane: λ/4 and the cut length. */
export function monopole(f: number, k = 0.95) {
  const lam = wavelength(f);
  return { lambda: lam, quarter: lam / 4, length: (k * lam) / 4, R: 36.56, gainDbi: 5.15 };
}

/** Bessel function J0 by its integral form (1/π)∫₀^π cos(x sin t) dt, Simpson's rule. */
export function besselJ0(x: number, n = 400): number {
  const h = Math.PI / n;
  let s = 1 + Math.cos(x * Math.sin(Math.PI));
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * Math.cos(x * Math.sin(i * h));
  return (s * h) / 3 / Math.PI;
}
/** Simpson's rule on [a, b] with n (even) intervals. */
function simpson(fn: (x: number) => number, a: number, b: number, n = 2000) {
  const h = (b - a) / n;
  let s = fn(a) + fn(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * fn(a + i * h);
  return (s * h) / 3;
}
const sinc = (a: number, c: number) => (Math.abs(c) < 1e-12 ? a : Math.sin(a * c) / c);

export type Patch = {
  W: number; L: number; eeff: number; dL: number; Leff: number; lambda0: number; lambdag: number;
  G1: number; G12: number; Rin: number; inset: number | null; groundW: number; groundL: number; fCheck: number;
};
/**
 * Rectangular microstrip patch by the transmission-line model (Balanis): width for good radiation efficiency,
 * effective permittivity, fringing length extension ΔL (Hammerstad), physical length, the radiating-slot conductance
 * G1 and mutual conductance G12 (numerical integrals), edge resistance Rin = 1/(2(G1+G12)) and the inset depth
 * y0 = (L/π)·acos(√(Z0/Rin)) that matches Z0. Units: f in Hz, h in m; lengths returned in m.
 */
export function patch(f: number, er: number, h: number, z0 = 50, Wgiven?: number): Patch {
  const lam = wavelength(f), k0 = (2 * Math.PI) / lam;
  const W = Wgiven ?? (C0 / (2 * f)) * Math.sqrt(2 / (er + 1));
  const eeff = (er + 1) / 2 + ((er - 1) / 2) / Math.sqrt(1 + (12 * h) / W);
  const dL = 0.412 * h * ((eeff + 0.3) * (W / h + 0.264)) / ((eeff - 0.258) * (W / h + 0.8));
  const L = C0 / (2 * f * Math.sqrt(eeff)) - 2 * dL;
  const a = (k0 * W) / 2;
  // G1 = I1/(120π²), I1 = ∫₀^π [sin(k0W cosθ/2)/cosθ]² sin³θ dθ ; G12 adds J0(k0 L sinθ) inside.
  const I1 = simpson((t) => sinc(a, Math.cos(t)) ** 2 * Math.sin(t) ** 3, 0, Math.PI);
  const G1 = I1 / (120 * Math.PI ** 2);
  const G12 = simpson((t) => sinc(a, Math.cos(t)) ** 2 * besselJ0(k0 * L * Math.sin(t)) * Math.sin(t) ** 3, 0, Math.PI, 1000) / (120 * Math.PI ** 2);
  const Rin = 1 / (2 * (G1 + G12));
  const inset = z0 > 0 && z0 <= Rin ? (L / Math.PI) * Math.acos(Math.sqrt(z0 / Rin)) : null;
  return { W, L, eeff, dL, Leff: L + 2 * dL, lambda0: lam, lambdag: lam / Math.sqrt(eeff), G1, G12, Rin, inset, groundW: W + 6 * h, groundL: L + 6 * h, fCheck: C0 / (2 * (L + 2 * dL) * Math.sqrt(eeff)) };
}

export type YagiElement = { name: string; length: number; position: number };
/**
 * A starting Yagi-Uda layout from common rules of thumb (all in wavelengths): reflector 0.495 λ, driven element 0.473 λ
 * (a resonant half-wave dipole shortened for end effect), directors starting at 0.440 λ and each about 0.005 λ shorter,
 * reflector spacing 0.2 λ and director spacing 0.25 λ. Approximate only.
 */
export function yagi(f: number, directors: number, opts: { refl?: number; driven?: number; dir1?: number; taper?: number; sRefl?: number; sDir?: number } = {}): { lambda: number; elements: YagiElement[]; boom: number } {
  const lam = wavelength(f), o = { refl: 0.495, driven: 0.473, dir1: 0.44, taper: 0.005, sRefl: 0.2, sDir: 0.25, ...opts };
  const el: YagiElement[] = [{ name: 'Reflector', length: o.refl * lam, position: 0 }, { name: 'Driven element', length: o.driven * lam, position: o.sRefl * lam }];
  for (let i = 0; i < directors; i++) el.push({ name: `Director ${i + 1}`, length: (o.dir1 - i * o.taper) * lam, position: (o.sRefl + (i + 1) * o.sDir) * lam });
  return { lambda: lam, elements: el, boom: el[el.length - 1].position };
}
