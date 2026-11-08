// Diatomic molecule spectroscopy: vibrational levels (anharmonic oscillator), the Morse potential, rotational
// constants and bond length, pure rotational and rovibrational (P and R branch) line positions with Boltzmann
// intensities, isotope scaling, and a Birge–Sponer style fit of ωe and ωexe from measured band origins.
import { fitLine } from './fit.ts';

export const H = 6.62607015e-34, C_CM = 2.99792458e10, KB = 1.380649e-23, AMU = 1.6605390666e-27;
/** hc/k in cm·K (second radiation constant). */
export const C2 = 1.438776877;
/** 1 cm⁻¹ in eV and kJ/mol. */
export const CM_EV = 1.239841984e-4, CM_KJ = 0.01196266;

/** Spectroscopic constants in cm⁻¹ (re in Å) for the main isotopologue, from Huber and Herzberg (NIST Chemistry WebBook). */
export type Constants = { we: number; wexe: number; Be: number; ae: number; De?: number; re: number };
export const MOLECULES: { id: string; name: string; atoms: [string, string]; k: Constants; D0eV?: number }[] = [
  { id: 'HCl', name: 'H³⁵Cl', atoms: ['1H', '35Cl'], k: { we: 2990.95, wexe: 52.82, Be: 10.5934, ae: 0.3072, De: 5.32e-4, re: 1.27455 }, D0eV: 4.434 },
  { id: 'CO', name: '¹²C¹⁶O', atoms: ['12C', '16O'], k: { we: 2169.81, wexe: 13.29, Be: 1.93128, ae: 0.01750, De: 6.12e-6, re: 1.12832 }, D0eV: 11.09 },
  { id: 'H2', name: 'H₂', atoms: ['1H', '1H'], k: { we: 4401.21, wexe: 121.34, Be: 60.853, ae: 3.062, De: 0.0471, re: 0.74144 }, D0eV: 4.478 },
  { id: 'N2', name: '¹⁴N₂', atoms: ['14N', '14N'], k: { we: 2358.57, wexe: 14.32, Be: 1.99824, ae: 0.017318, De: 5.76e-6, re: 1.09768 }, D0eV: 9.759 },
  { id: 'O2', name: '¹⁶O₂', atoms: ['16O', '16O'], k: { we: 1580.19, wexe: 11.98, Be: 1.44563, ae: 0.0159, De: 4.84e-6, re: 1.20752 }, D0eV: 5.116 },
  { id: 'HF', name: 'HF', atoms: ['1H', '19F'], k: { we: 4138.32, wexe: 89.88, Be: 20.9557, ae: 0.798, De: 2.151e-3, re: 0.91680 }, D0eV: 5.869 },
  { id: 'I2', name: '¹²⁷I₂', atoms: ['127I', '127I'], k: { we: 214.50, wexe: 0.614, Be: 0.03737, ae: 0.000114, De: 4.5e-9, re: 2.666 }, D0eV: 1.542 },
];

/** Reduced mass in u. */
export const reducedMass = (m1: number, m2: number) => (m1 * m2) / (m1 + m2);

/** Rescale constants for another isotopologue: ρ = √(μ/μ′); ωe ∝ ρ, ωexe ∝ ρ², Be ∝ ρ², αe ∝ ρ³, D ∝ ρ⁴. */
export function isotopeScale(k: Constants, mu: number, muNew: number): Constants {
  const r = Math.sqrt(mu / muNew);
  return { we: k.we * r, wexe: k.wexe * r * r, Be: k.Be * r * r, ae: k.ae * r ** 3, De: k.De !== undefined ? k.De * r ** 4 : undefined, re: k.re };
}

/** Vibrational term G(v) in cm⁻¹. */
export const G = (k: Constants, v: number) => k.we * (v + 0.5) - k.wexe * (v + 0.5) ** 2;
/** Rotational constant in level v. */
export const Bv = (k: Constants, v: number) => k.Be - k.ae * (v + 0.5);
/** Rotational term F(J) in level v, with centrifugal distortion if D is known. */
export const F = (k: Constants, v: number, J: number) => Bv(k, v) * J * (J + 1) - (k.De ?? 0) * (J * (J + 1)) ** 2;
/** Bond length (Å) from a rotational constant (cm⁻¹) and reduced mass (u). */
export const bondLength = (B: number, mu: number) => Math.sqrt(H / (8 * Math.PI ** 2 * C_CM * mu * AMU * B)) * 1e10;
/** Rotational constant (cm⁻¹) from a bond length (Å). */
export const rotConstant = (r: number, mu: number) => H / (8 * Math.PI ** 2 * C_CM * mu * AMU * (r * 1e-10) ** 2);

/** Morse parameters: well depth De (cm⁻¹), force constant k (N/m), a (1/Å), last bound level, D0 (cm⁻¹). */
export function morse(k: Constants, mu: number) {
  const De = k.we ** 2 / (4 * k.wexe);
  const kf = mu * AMU * (2 * Math.PI * C_CM * k.we) ** 2;
  const a = Math.sqrt(kf / (2 * De * H * C_CM)) * 1e-10;
  const vmax = Math.floor(k.we / (2 * k.wexe) - 0.5);
  return { De, kf, a, vmax, D0: De - G(k, 0) };
}
/** Morse potential (cm⁻¹ above the minimum) at r (Å). */
export const morseV = (De: number, a: number, re: number, r: number) => De * (1 - Math.exp(-a * (r - re))) ** 2;

export type Line = { branch: 'P' | 'R' | 'Q' | 'rot'; J: number; nu: number; intensity: number };

/** Rovibrational lines v → v+dv (P: J → J−1 written P(J) from lower J; R: R(J) from lower J), Boltzmann weighted at T (K). */
export function rovibLines(k: Constants, T: number, v0 = 0, dv = 1, Jmax = 40): Line[] {
  const band = G(k, v0 + dv) - G(k, v0), out: Line[] = [];
  const pop = (J: number) => (2 * J + 1) * Math.exp((-C2 * F(k, v0, J)) / T);
  for (let J = 0; J <= Jmax; J++) {
    out.push({ branch: 'R', J, nu: band + F(k, v0 + dv, J + 1) - F(k, v0, J), intensity: pop(J) });
    if (J >= 1) out.push({ branch: 'P', J, nu: band + F(k, v0 + dv, J - 1) - F(k, v0, J), intensity: pop(J) });
  }
  const m = Math.max(...out.map((l) => l.intensity));
  return out.map((l) => ({ ...l, intensity: l.intensity / m })).sort((a, b) => a.nu - b.nu);
}
/** Pure rotational lines J → J+1 in level v. */
export function rotLines(k: Constants, T: number, v = 0, Jmax = 30): Line[] {
  const out: Line[] = [];
  for (let J = 0; J <= Jmax; J++) out.push({ branch: 'rot', J, nu: F(k, v, J + 1) - F(k, v, J), intensity: (2 * J + 1) * Math.exp((-C2 * F(k, v, J)) / T) * ((F(k, v, J + 1) - F(k, v, J)) ** 1) });
  const m = Math.max(...out.map((l) => l.intensity));
  return out.map((l) => ({ ...l, intensity: l.intensity / m }));
}
/** J of the most populated rotational level at T. */
export const jMax = (B: number, T: number) => Math.max(0, Math.round(Math.sqrt(T / (2 * C2 * B)) - 0.5));

/** Fit ωe and ωexe from band origins ν(0 → v): ν/v = ωe − ωexe(v + 1). */
export function fitAnharmonic(v: number[], nu: number[]) {
  const fl = fitLine(v.map((x) => x + 1), nu.map((y, i) => y / v[i]));
  return { we: fl.intercept, wexe: -fl.slope, seWe: fl.seIntercept, seWexe: fl.seSlope, r2: fl.r2 };
}
