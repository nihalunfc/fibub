// Bomb calorimeter virtual practical (Class 11 chemistry, thermodynamics): calibrate with benzoic acid, burn a
// sample at constant volume, get ΔU from q = C·ΔT, then ΔH = ΔU + Δn(gas)·RT. Energies in kJ, C in kJ/K.
// Plain maths, no DOM.

export const R = 8.314462618; // J/(K·mol), CODATA 2018
/** Rounded energy released per gram of benzoic acid burned at constant volume (calibration standard), kJ/g. */
export const BENZOIC_KJ_PER_G = 26.43;

export type Sample = { id: string; name: string; formula: string; M: number; dU: number; dng: number; eq: string };
/** ΔU (kJ/mol, constant volume) from rounded standard enthalpies of combustion at 298 K: ΔU = ΔH − Δn·RT. */
export const SAMPLES: Sample[] = [
  { id: 'glucose', name: 'Glucose', formula: 'C₆H₁₂O₆', M: 180.16, dU: -2803, dng: 0, eq: 'C₆H₁₂O₆(s) + 6O₂(g) → 6CO₂(g) + 6H₂O(l)' },
  { id: 'sucrose', name: 'Sucrose (table sugar)', formula: 'C₁₂H₂₂O₁₁', M: 342.30, dU: -5640, dng: 0, eq: 'C₁₂H₂₂O₁₁(s) + 12O₂(g) → 12CO₂(g) + 11H₂O(l)' },
  { id: 'naphthalene', name: 'Naphthalene', formula: 'C₁₀H₈', M: 128.17, dU: -5152, dng: -2, eq: 'C₁₀H₈(s) + 12O₂(g) → 10CO₂(g) + 4H₂O(l)' },
  { id: 'benzoic', name: 'Benzoic acid', formula: 'C₇H₆O₂', M: 122.12, dU: -(BENZOIC_KJ_PER_G * 122.12), dng: -0.5, eq: 'C₇H₆O₂(s) + 7½O₂(g) → 7CO₂(g) + 3H₂O(l)' },
  { id: 'urea', name: 'Urea', formula: 'CH₄N₂O', M: 60.06, dU: -633, dng: 0.5, eq: 'CH₄N₂O(s) + 1½O₂(g) → CO₂(g) + 2H₂O(l) + N₂(g)' },
];

/** Heat capacity of the calorimeter (kJ/K) from burning `mass` g of benzoic acid that raised the temperature by dT. */
export const heatCapacity = (mass: number, dT: number) => (mass * BENZOIC_KJ_PER_G) / dT;
/** Temperature rise when q kJ is released into a calorimeter of heat capacity C kJ/K. */
export const rise = (q: number, C: number) => q / C;
/** ΔU per mole (kJ/mol, negative for heat given out) from the heat q (kJ) released by `mass` g of molar mass M. */
export const molarU = (q: number, mass: number, M: number) => (-q * M) / mass;
/** ΔH = ΔU + Δn(gas)·R·T, kJ/mol. */
export const enthalpy = (dU: number, dng: number, T = 298) => dU + (dng * R * T) / 1000;

/** Simulated thermometer reading (°C) at t minutes: flat, then rises by dT after firing at t = 5 with a time
 *  constant of 0.8 min. */
export const reading = (t: number, T0: number, dT: number) => (t < 5 ? T0 : T0 + dT * (1 - Math.exp(-(t - 5) / 0.8)));
