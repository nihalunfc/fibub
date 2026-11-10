// School kinetic-theory maths for the Learn tools equipartition and mean-free-path. Plain maths, no DOM.
export const R = 8.314462618;          // J/(mol K), CODATA 2018 (exact product of N_A and k)
export const kB = 1.380649e-23;        // J/K, exact (SI 2019)
export const NA = 6.02214076e23;       // 1/mol, exact (SI 2019)
export const AMU = 1.66053906660e-27;  // kg, CODATA 2018

export type Shape = 'mono' | 'di' | 'lin3' | 'nonlin';
/** Atoms in the example molecule of each shape (He; N₂; CO₂; H₂O). */
export const ATOMS: Record<Shape, number> = { mono: 1, di: 2, lin3: 3, nonlin: 3 };
/** Degrees of freedom: translational, rotational and vibrational modes (each vibration counts twice: KE and PE). */
export function freedoms(shape: Shape, vib: boolean, atoms = ATOMS[shape]) {
  const trans = 3, rot = shape === 'mono' ? 0 : shape === 'nonlin' ? 3 : 2;
  const modes = shape === 'mono' ? 0 : 3 * atoms - trans - rot;     // number of vibration modes
  const v = vib ? 2 * modes : 0;
  return { trans, rot, modes, vib: v, f: trans + rot + v };
}
/** Molar heat capacities and γ from f degrees of freedom (ideal gas). */
export function heatCaps(f: number) {
  const Cv = (f / 2) * R, Cp = Cv + R;
  return { Cv, Cp, gamma: Cp / Cv };
}
/** Internal energy of n mol with f degrees of freedom at temperature T: U = (f/2) n R T. */
export const internalEnergy = (n: number, f: number, T: number) => (f / 2) * n * R * T;
/** Mixture of n₁ mol with f₁ and n₂ mol with f₂: Cv and γ of the mix. */
export function mix(n1: number, f1: number, n2: number, f2: number) {
  const Cv = (n1 * (f1 / 2) * R + n2 * (f2 / 2) * R) / (n1 + n2), Cp = Cv + R;
  return { Cv, Cp, gamma: Cp / Cv };
}

// ---- Mean free path ----
/** Number of molecules per m³ at pressure p (Pa) and temperature T (K): n = p / kT. */
export const numberDensity = (p: number, T: number) => p / (kB * T);
/** Mean free path λ = kT / (√2 π d² p) (m), for molecules of diameter d (m). */
export const meanFreePath = (p: number, T: number, d: number) => (kB * T) / (Math.SQRT2 * Math.PI * d * d * p);
/** Mean speed of molecules of mass m (kg): √(8kT / πm). */
export const meanSpeed = (T: number, m: number) => Math.sqrt((8 * kB * T) / (Math.PI * m));
/** Collisions per second for one molecule: mean speed / λ. */
export const collisionRate = (p: number, T: number, d: number, m: number) => meanSpeed(T, m) / meanFreePath(p, T, d);
/** Mean free path of hard disks in a flat (2-D) box: λ = 1 / (2√2 n d), n per unit area. */
export const meanFreePath2D = (nArea: number, d: number) => 1 / (2 * Math.SQRT2 * nArea * d);
