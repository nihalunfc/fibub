// Skin depth, surface resistance and the AC resistance of round wires, sheets and coax. SI units. No DOM.
import { EPS0, MU0 } from './ph-capind.ts';

/**
 * Skin depth δ = 1/α for a plane wave in a medium of resistivity ρ (Ω m), relative permeability μr and
 * permittivity εr at frequency f (Hz), from the exact attenuation constant
 * α = ω √(με/2) √(√(1 + (σ/ωε)²) − 1). For good conductors this is √(2ρ/(ωμ)).
 */
export function skinDepth(rho: number, f: number, mr = 1, er = 1): number {
  const w = 2 * Math.PI * f, mu = MU0 * mr, eps = EPS0 * er, x = 1 / (rho * w * eps);
  // √(1 + x²) − 1 written to keep precision when x is small or huge.
  const s = x > 1e-4 ? Math.sqrt(1 + x * x) - 1 : (x * x) / 2;
  return 1 / (w * Math.sqrt((mu * eps) / 2) * Math.sqrt(s));
}
/** The good-conductor approximation √(2ρ/(ωμ)). */
export const skinDepthGood = (rho: number, f: number, mr = 1) => Math.sqrt((2 * rho) / (2 * Math.PI * f * MU0 * mr));
/** Surface resistance of a thick good conductor, Rs = √(ωμρ/2) = ρ/δ (Ω per square). */
export const surfaceR = (rho: number, f: number, mr = 1) => Math.sqrt((2 * Math.PI * f * MU0 * mr * rho) / 2);

type C = [number, number];
const cdiv = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];

/** J1(z)/J0(z) for complex z by the continued fraction J_n/J_{n−1} = 1/(2n/z − J_{n+1}/J_n) (modified Lentz). */
export function besselRatio(z: C): C {
  // J0/J1 = g = b1 + a2/(b2 + a3/(b3 + ...)), with b_n = 2n/z and a_n = −1; evaluated by modified Lentz.
  const tiny = 1e-150, inv = cdiv([1, 0], z), b = (n: number): C => [2 * n * inv[0], 2 * n * inv[1]];
  let f: C = b(1);
  if (Math.hypot(f[0], f[1]) < tiny) f = [tiny, 0];
  let Cc: C = f, D: C = [0, 0];
  for (let n = 2; n < 20000; n++) {
    const bn = b(n);
    D = [bn[0] - D[0], bn[1] - D[1]];
    if (Math.hypot(D[0], D[1]) < tiny) D = [tiny, 0];
    const ic = cdiv([1, 0], Cc);
    Cc = [bn[0] - ic[0], bn[1] - ic[1]];
    if (Math.hypot(Cc[0], Cc[1]) < tiny) Cc = [tiny, 0];
    D = cdiv([1, 0], D);
    const delta = cmul(Cc, D);
    f = cmul(f, delta);
    if (Math.hypot(delta[0] - 1, delta[1]) < 1e-16) break;
  }
  return cdiv([1, 0], f);
}

/**
 * Internal impedance of a straight round wire of radius a, relative to its DC resistance:
 * Z/R_dc = (ka/2) J0(ka)/J1(ka), with k = (1 − j)/δ. The real part is R_ac/R_dc; the imaginary part is
 * ωL_int/R_dc (L_int falls from μ/8π per metre at DC as the current moves to the surface).
 */
export function wireRatio(a: number, delta: number): { r: number; x: number } {
  const z: C = [a / delta, -a / delta];
  const ratio = besselRatio(z); // J1/J0
  const zr = cdiv([z[0] / 2, z[1] / 2], ratio);
  return { r: zr[0], x: zr[1] };
}

/** DC resistance per metre of a round wire of radius a. */
export const wireRdc = (rho: number, a: number) => rho / (Math.PI * a * a);

/** Resistance per square of a flat sheet of thickness t carrying current along it, fed from one side: Re[ρ k coth(k t)] (k = (1 + j)/δ). */
export function sheetR(rho: number, t: number, delta: number): number {
  // coth((1+j)u) with u = t/δ; Re[(1+j) coth((1+j)u)] (ρ/δ) = (ρ/δ)(sinh 2u + sin 2u)/(cosh 2u − cos 2u).
  const u = t / delta;
  if (u > 40) return rho / delta;
  return (rho / delta) * (Math.sinh(2 * u) + Math.sin(2 * u)) / (Math.cosh(2 * u) - Math.cos(2 * u));
}

/** Absorption loss of a metal shield of thickness t: 20 log10(e^{t/δ}) = 8.686 t/δ dB (plane wave; reflection loss not included). */
export const absorptionDb = (t: number, delta: number) => (20 / Math.LN10) * (t / delta);

/** Conductor attenuation of an air- or dielectric-filled coax, Rs (1/a + 1/b) / (2 η ln(b/a)) nepers per metre, η = η0 √(μr/εr) of the filling. */
export function coaxLoss(Rs: number, a: number, b: number, er: number): number {
  const eta = Math.sqrt(MU0 / (EPS0 * er));
  return (Rs * (1 / a + 1 / b)) / (2 * eta * Math.log(b / a));
}
export const NP_TO_DB = 20 / Math.LN10;
