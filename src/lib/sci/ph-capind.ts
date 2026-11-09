// Capacitance and inductance of common shapes: parallel plates (with stacked dielectric layers), coaxial
// cable, concentric spheres, twin wires, a wire over a ground plane, solenoids (with Nagaoka's
// correction for short coils) and toroids. SI units. No DOM.
import { ellipKE, MU0 } from './ph-coil.ts';

export const EPS0 = 8.8541878188e-12; // F/m, CODATA 2022
export { MU0 };

/** Parallel plates of area A with dielectric layers in series (thickness d_i, permittivity εr_i): C = ε0 A / Σ(d_i/εr_i). */
export function plates(A: number, layers: { d: number; er: number }[]): number {
  return (EPS0 * A) / layers.reduce((s, l) => s + l.d / l.er, 0);
}
/** Field in each layer of a parallel-plate stack at voltage V: the displacement D = CV/A is the same in every layer, E_i = D/(ε0 εr_i). */
export function plateFields(A: number, layers: { d: number; er: number }[], V: number): number[] {
  const D = (plates(A, layers) * V) / A;
  return layers.map((l) => D / (EPS0 * l.er));
}
/** Coaxial capacitor per metre: 2π ε0 εr / ln(b/a), a = inner radius, b = outer radius. */
export const coaxC = (a: number, b: number, er: number) => (2 * Math.PI * EPS0 * er) / Math.log(b / a);
/** Coax inductance per metre between the conductors (high frequency, current on the surfaces): μ0 μr ln(b/a) / 2π. */
export const coaxL = (a: number, b: number, mr: number) => ((MU0 * mr) / (2 * Math.PI)) * Math.log(b / a);
/** Extra inductance per metre inside a solid round inner conductor at low frequency (uniform current): μ0/8π. */
export const internalL = MU0 / (8 * Math.PI);
/** Concentric spheres a < b: 4π ε0 εr ab/(b − a); b = Infinity gives an isolated sphere 4π ε0 εr a. */
export const spheres = (a: number, b: number, er: number) => (Number.isFinite(b) ? (4 * Math.PI * EPS0 * er * a * b) / (b - a) : 4 * Math.PI * EPS0 * er * a);
/** Two parallel round wires of radius a, centres D apart: C per metre π ε0 εr / acosh(D/2a); L per metre (μ0 μr/π) acosh(D/2a). */
export const twinC = (a: number, D: number, er: number) => (Math.PI * EPS0 * er) / Math.acosh(D / (2 * a));
export const twinL = (a: number, D: number, mr: number) => ((MU0 * mr) / Math.PI) * Math.acosh(D / (2 * a));
/** A round wire of radius a with its centre h above a ground plane: C per metre 2π ε0 εr / acosh(h/a); L per metre (μ0 μr/2π) acosh(h/a). */
export const planeC = (a: number, h: number, er: number) => (2 * Math.PI * EPS0 * er) / Math.acosh(h / a);
export const planeL = (a: number, h: number, mr: number) => ((MU0 * mr) / (2 * Math.PI)) * Math.acosh(h / a);

/**
 * Nagaoka's coefficient for a single-layer solenoid (uniform current sheet) of diameter D and length l:
 * K = 4/(3π k') [ (k'²/k²)(K(k) − E(k)) + E(k) − k ], k² = D²/(D² + l²). It tends to 1 for a long coil.
 */
export function nagaoka(D: number, l: number): number {
  const m = (D * D) / (D * D + l * l), k = Math.sqrt(m), kp = Math.sqrt(1 - m), { K, E } = ellipKE(m);
  return (4 / (3 * Math.PI * kp)) * (((kp * kp) / m) * (K - E) + E - k);
}
/** Solenoid inductance μ0 μr N² A / l, times Nagaoka's coefficient if `short` (air core only: a core changes the field shape). */
export function solenoid(N: number, D: number, l: number, mr: number, short = true): number {
  const A = (Math.PI * D * D) / 4;
  return ((MU0 * mr * N * N * A) / l) * (short ? nagaoka(D, l) : 1);
}
/** Toroid with a rectangular cross-section (inner radius a, outer b, height h): μ0 μr N² h ln(b/a) / 2π. */
export const toroidRect = (N: number, a: number, b: number, h: number, mr: number) => (MU0 * mr * N * N * h * Math.log(b / a)) / (2 * Math.PI);
/** Toroid with a round cross-section (tube radius r, centre of the tube at radius R): μ0 μr N² (R − √(R² − r²)). */
export const toroidRound = (N: number, R: number, r: number, mr: number) => MU0 * mr * N * N * (R - Math.sqrt(R * R - r * r));

/** Characteristic impedance √(L/C) and speed 1/√(LC) of a line from its per-metre L and C. */
export const line = (L: number, C: number) => ({ z0: Math.sqrt(L / C), v: 1 / Math.sqrt(L * C) });
