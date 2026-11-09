// Helical springs of round wire: compression, extension and torsion. Units: mm, N, MPa (N/mm²), N·mm.

export type Ends = 'plain' | 'plain-ground' | 'squared' | 'squared-ground';
/** Total coils and solid height for each end type (the usual end-condition formulas). */
export function endCoils(ends: Ends, Na: number, d: number): { Nt: number; Ls: number } {
  const Nt = ends === 'plain' ? Na : ends === 'plain-ground' ? Na + 1 : Na + 2;
  const Ls = ends === 'plain' || ends === 'squared' ? d * (Nt + 1) : d * Nt;
  return { Nt, Ls };
}
/** Spring index C = D/d. */
export const index = (D: number, d: number) => D / d;
/** Wahl factor (curvature plus direct shear). */
export const wahl = (C: number) => (4 * C - 1) / (4 * C - 4) + 0.615 / C;
/** Bergsträsser factor, a close and simpler alternative. */
export const bergstrasser = (C: number) => (4 * C + 2) / (4 * C - 3);
/** Rate of a helical spring in tension or compression: k = G d⁴ / (8 D³ Na). */
export const rate = (G: number, d: number, D: number, Na: number) => (G * d ** 4) / (8 * D ** 3 * Na);
/** Corrected shear stress τ = K 8 F D / (π d³). */
export const shear = (K: number, F: number, D: number, d: number) => (K * 8 * F * D) / (Math.PI * d ** 3);
/** Steel buckling limit for free length (Shigley): stable if L0 < 2.63 D / α, α = 0.5 for both ends on parallel
 * flat plates, 0.707 one end pivoted, 1 both pivoted, 2 one end free. */
export const bucklingLength = (D: number, alpha: number) => (2.63 * D) / alpha;
/** Lowest surge frequency (Hz) of a spring between flat plates: f = ½ √(k / m), m the mass of the active coils. k in
 * N/mm, dimensions in mm, density in kg/m³. */
export function surge(k: number, d: number, D: number, Na: number, rho: number) {
  const m = ((Math.PI ** 2 * d * d * D * Na) / 4) * 1e-9 * rho; // kg
  return 0.5 * Math.sqrt((k * 1000) / m);
}

export type Compression = { d: number; D: number; Na: number; G: number; ends: Ends; L0: number; F?: number; y?: number; tauAllow: number; alpha: number; rho: number };
export function compression(s: Compression) {
  if (!(s.d > 0 && s.D > s.d && s.Na > 0 && s.G > 0)) throw new Error('Give the wire diameter, a larger mean coil diameter, the active coils and G.');
  const C = index(s.D, s.d), Kw = wahl(C), KB = bergstrasser(C), k = rate(s.G, s.d, s.D, s.Na);
  const { Nt, Ls } = endCoils(s.ends, s.Na, s.d);
  if (!(s.L0 > Ls)) throw new Error(`The free length must be more than the solid height (${+Ls.toFixed(3)} mm).`);
  const y = s.y ?? (s.F ?? 0) / k, F = s.F ?? k * y, Fs = k * (s.L0 - Ls);
  const tau = shear(Kw, F, s.D, s.d), tauS = shear(Kw, Fs, s.D, s.d);
  const Lcrit = bucklingLength(s.D, s.alpha);
  return {
    C, Kw, KB, k, Nt, Ls, F, y, L: s.L0 - y, Fs, tau, tauS,
    pitch: s.ends === 'plain' ? (s.L0 - s.d) / s.Na : s.ends === 'plain-ground' ? s.L0 / (s.Na + 1) : s.ends === 'squared' ? (s.L0 - 3 * s.d) / s.Na : (s.L0 - 2 * s.d) / s.Na,
    clash: y > s.L0 - Ls, nWork: s.tauAllow / tau, nSolid: s.tauAllow / tauS,
    Lcrit, stable: s.L0 < Lcrit, fn: surge(k, s.d, s.D, s.Na, s.rho), wireLength: Math.PI * s.D * Nt,
    mass: ((Math.PI * s.d * s.d) / 4) * Math.PI * s.D * Nt * 1e-9 * s.rho,
  };
}

/** Bending stress factor at the inside of a hook or a torsion-spring coil: (4C² − C − 1) / (4C(C − 1)). */
export const kInner = (C: number) => (4 * C * C - C - 1) / (4 * C * (C - 1));

export type Extension = { d: number; D: number; Nb: number; G: number; E: number; Fi: number; F: number; r2: number; tauAllow: number; sigmaAllow: number; rho: number };
/** Extension spring with initial tension and full-loop hooks: active coils Na = Nb + G/E, body length d(Nb + 1),
 * hook bending at A (r1 = D/2) and torsion at B (bend radius r2). */
export function extension(s: Extension) {
  if (!(s.d > 0 && s.D > s.d && s.Nb > 0 && s.G > 0 && s.E > 0)) throw new Error('Give the wire diameter, a larger mean coil diameter, the body coils, G and E.');
  if (!(s.Fi >= 0 && s.F >= s.Fi)) throw new Error('The working force must be at least the initial tension.');
  const C = index(s.D, s.d), Na = s.Nb + s.G / s.E, k = rate(s.G, s.d, s.D, Na), y = (s.F - s.Fi) / k;
  const Kw = wahl(C), tau = shear(Kw, s.F, s.D, s.d), tauI = shear(Kw, s.Fi, s.D, s.d);
  const C1 = s.D / s.d, KA = kInner(C1), sigmaA = s.F * (KA * 16 * s.D / (Math.PI * s.d ** 3) + 4 / (Math.PI * s.d * s.d));
  const C2 = (2 * s.r2) / s.d, KBh = (4 * C2 - 1) / (4 * C2 - 4), tauB = (KBh * 8 * s.F * s.D) / (Math.PI * s.d ** 3);
  const Lb = s.d * (s.Nb + 1), L0 = Lb + 2 * (s.D - s.d);
  return { C, Na, k, y, Lb, L0, L: L0 + y, Kw, tau, tauI, KA, sigmaA, KBh, tauB, nBody: s.tauAllow / tau, nHookA: s.sigmaAllow / sigmaA, nHookB: s.tauAllow / tauB, fn: surge(k, s.d, s.D, Na, s.rho) };
}

export type Torsion = { d: number; D: number; Nb: number; E: number; l1: number; l2: number; M: number; sigmaAllow: number };
/** Torsion spring: legs add Ne = (l1 + l2)/(3πD) active coils. Rate per radian d⁴E/(64 D Na) (k per turn × 2π) and
 * the common 10.8 form with an allowance for coil friction, bending stress Ki 32 M / (π d³) at the inside, and the
 * coil diameter at that load D' = D Nb / (Nb + θ turns). */
export function torsion(s: Torsion) {
  if (!(s.d > 0 && s.D > s.d && s.Nb > 0 && s.E > 0)) throw new Error('Give the wire diameter, a larger mean coil diameter, the body coils and E.');
  if (!(s.l1 >= 0 && s.l2 >= 0)) throw new Error('Give the leg lengths (0 or more).');
  const C = index(s.D, s.d), Na = s.Nb + (s.l1 + s.l2) / (3 * Math.PI * s.D);
  const kRad = (s.d ** 4 * s.E) / (64 * s.D * Na), kTurn = (s.d ** 4 * s.E) / (10.8 * s.D * Na);
  const turns = s.M / kTurn, Ki = kInner(C), sigma = (Ki * 32 * s.M) / (Math.PI * s.d ** 3);
  const Dp = (s.D * s.Nb) / (s.Nb + turns);
  return { C, Na, kRad, kTurn, turns, deg: turns * 360, Ki, sigma, n: s.sigmaAllow / sigma, Dp, Dinner: Dp - s.d };
}
