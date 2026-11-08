// Faraday's laws of electrolysis: mass, plating thickness, time, current and gas volumes from charge.
// Molar masses: IUPAC; densities: CRC Handbook (room temperature, pure metal).

export const F = 96485.33212; // C/mol
export const R = 8.314462618;

/** n = electrons per atom deposited (or per gas molecule), M in g/mol, rho in g/cm³ (metals only). */
export type Sub = { id: string; name: string; n: number; M: number; rho?: number; gas?: boolean; note: string };
export const SUBSTANCES: Sub[] = [
  { id: 'Cu', name: 'Copper', n: 2, M: 63.546, rho: 8.96, note: 'acid sulfate bath, Cu²⁺' },
  { id: 'Ni', name: 'Nickel', n: 2, M: 58.693, rho: 8.908, note: 'Watts bath, Ni²⁺' },
  { id: 'Zn', name: 'Zinc', n: 2, M: 65.38, rho: 7.14, note: 'Zn²⁺' },
  { id: 'Cr', name: 'Chromium (hard chrome)', n: 6, M: 51.996, rho: 7.19, note: 'from Cr(VI); real efficiency is only 10–25 %' },
  { id: 'Ag', name: 'Silver', n: 1, M: 107.868, rho: 10.49, note: 'Ag⁺ (cyanide bath)' },
  { id: 'Au', name: 'Gold', n: 1, M: 196.967, rho: 19.3, note: 'Au(I) cyanide bath' },
  { id: 'Sn', name: 'Tin', n: 2, M: 118.71, rho: 7.265, note: 'acid bath, Sn²⁺' },
  { id: 'Pb', name: 'Lead', n: 2, M: 207.2, rho: 11.34, note: 'Pb²⁺' },
  { id: 'Fe', name: 'Iron', n: 2, M: 55.845, rho: 7.874, note: 'Fe²⁺' },
  { id: 'Co', name: 'Cobalt', n: 2, M: 58.933, rho: 8.9, note: 'Co²⁺' },
  { id: 'Pd', name: 'Palladium', n: 2, M: 106.42, rho: 12.02, note: 'Pd²⁺' },
  { id: 'Rh', name: 'Rhodium', n: 3, M: 102.906, rho: 12.41, note: 'Rh³⁺' },
  { id: 'H2', name: 'Hydrogen gas', n: 2, M: 2.016, gas: true, note: '2H⁺ + 2e⁻ → H₂ (cathode)' },
  { id: 'O2', name: 'Oxygen gas', n: 4, M: 31.998, gas: true, note: '2H₂O → O₂ + 4H⁺ + 4e⁻ (anode)' },
  { id: 'Cl2', name: 'Chlorine gas', n: 2, M: 70.9, gas: true, note: '2Cl⁻ → Cl₂ + 2e⁻ (anode)' },
];
export const sub = (id: string) => SUBSTANCES.find((x) => x.id === id);

/** Moles of product from charge Q (C) at current efficiency eff (0–1). */
export const moles = (Q: number, n: number, eff = 1) => (Q * eff) / (n * F);
/** Mass (g) from current I (A) for time t (s). */
export const mass = (I: number, t: number, s: { n: number; M: number }, eff = 1) => moles(I * t, s.n, eff) * s.M;
/** Thickness (µm) of a deposit of mass m (g) over area A (cm²). */
export const thickness = (m: number, rho: number, A: number) => (m / (rho * A)) * 1e4;
/** Deposition rate (µm/h) at current density j (A/cm²). */
export const rate = (j: number, s: { n: number; M: number; rho?: number }, eff = 1) => ((j * eff * s.M) / (s.n * F * s.rho!)) * 3600 * 1e4;
/** Time (s) for a thickness d (µm) at current I (A) over A (cm²). */
export const timeFor = (d: number, I: number, A: number, s: { n: number; M: number; rho?: number }, eff = 1) => ((d / 1e4) * s.rho! * A * s.n * F) / (I * s.M * eff);
/** Current (A) for a thickness d (µm) in time t (s) over A (cm²). */
export const currentFor = (d: number, t: number, A: number, s: { n: number; M: number; rho?: number }, eff = 1) => ((d / 1e4) * s.rho! * A * s.n * F) / (t * s.M * eff);
/** Ideal gas volume (L) of n mol at T (K) and P (kPa). */
export const gasVolume = (n: number, T: number, P: number) => (n * R * T) / P;
