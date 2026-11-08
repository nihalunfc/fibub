// Colligative properties: freezing point depression, boiling point elevation, vapour pressure lowering (Raoult)
// and osmotic pressure (van 't Hoff), and molar mass from a measured change.

/** L·bar/(mol·K). */
export const R_BAR = 0.08314462618;

export type Solvent = { id: string; name: string; Kf?: number; Kb?: number; Tf: number; Tb: number; M: number };
/** Cryoscopic and ebullioscopic constants (K·kg/mol), normal melting and boiling points (°C), molar mass (g/mol). Common textbook values (Atkins; CRC Handbook). */
export const SOLVENTS: Solvent[] = [
  { id: 'water', name: 'Water', Kf: 1.86, Kb: 0.512, Tf: 0, Tb: 100, M: 18.015 },
  { id: 'benzene', name: 'Benzene', Kf: 5.12, Kb: 2.53, Tf: 5.5, Tb: 80.1, M: 78.11 },
  { id: 'cyclohexane', name: 'Cyclohexane', Kf: 20.0, Kb: 2.79, Tf: 6.5, Tb: 80.7, M: 84.16 },
  { id: 'acetic', name: 'Acetic acid', Kf: 3.90, Kb: 3.07, Tf: 16.6, Tb: 117.9, M: 60.05 },
  { id: 'camphor', name: 'Camphor', Kf: 40, Tf: 179, Tb: 204, M: 152.23 },
  { id: 'naphthalene', name: 'Naphthalene', Kf: 6.94, Kb: 5.80, Tf: 80.2, Tb: 218, M: 128.17 },
  { id: 'phenol', name: 'Phenol', Kf: 7.27, Kb: 3.04, Tf: 40.9, Tb: 181.7, M: 94.11 },
  { id: 'ccl4', name: 'Carbon tetrachloride', Kf: 30, Kb: 4.95, Tf: -22.9, Tb: 76.7, M: 153.82 },
  { id: 'chloroform', name: 'Chloroform', Kf: 4.68, Kb: 3.63, Tf: -63.5, Tb: 61.2, M: 119.38 },
  { id: 'ethanol', name: 'Ethanol', Kf: 1.99, Kb: 1.22, Tf: -114.1, Tb: 78.4, M: 46.07 },
  { id: 'cs2', name: 'Carbon disulfide', Kf: 3.8, Kb: 2.37, Tf: -111.6, Tb: 46.2, M: 76.14 },
];

/** Ideal van 't Hoff factors (ions per formula unit); real strong electrolytes give a little less (NaCl about 1.9 in dilute water). */
export const SOLUTES = [
  { label: 'Non-electrolyte (sugar, urea, most organics)', i: 1 },
  { label: 'NaCl, KCl, KNO₃ (2 ions)', i: 2 },
  { label: 'CaCl₂, MgCl₂, Na₂SO₄ (3 ions)', i: 3 },
  { label: 'AlCl₃, K₃PO₄ (4 ions)', i: 4 },
];

/** mol/kg from grams of solute, its molar mass and grams of solvent. */
export const molality = (gSolute: number, M: number, gSolvent: number) => gSolute / M / (gSolvent / 1000);
/** ΔT = i·K·m (freezing depression with Kf, boiling elevation with Kb). */
export const deltaT = (i: number, K: number, m: number) => i * K * m;
/** Molar mass from a measured ΔT: M = i·K·g / (ΔT·kg solvent). */
export const molarMassFromDT = (i: number, K: number, gSolute: number, gSolvent: number, dT: number) => (i * K * gSolute) / (dT * (gSolvent / 1000));
/** Apparent van 't Hoff factor from a measured ΔT. */
export const iFromDT = (dT: number, K: number, m: number) => dT / (K * m);
/** Osmotic pressure (bar) π = i·c·R·T, c in mol/L, T in K. */
export const osmotic = (i: number, c: number, T: number) => i * c * R_BAR * T;
/** Molar mass from osmotic pressure (bar) of a solution of known mass concentration (g/L): M = i·ρ·R·T/π. */
export const molarMassFromOsmotic = (gPerL: number, piBar: number, T: number, i = 1) => (i * gPerL * R_BAR * T) / piBar;
/** Raoult's law: solvent mole fraction, vapour pressure and lowering for i·n solute particles in n_solvent. */
export function raoult(gSolute: number, M: number, gSolvent: number, Msolvent: number, P0: number, i = 1) {
  const ns = (i * gSolute) / M, nv = gSolvent / Msolvent, x = nv / (nv + ns);
  return { x, P: x * P0, lowering: (1 - x) * P0 };
}
