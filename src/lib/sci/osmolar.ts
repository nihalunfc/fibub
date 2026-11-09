// Osmolarity of a solution from its solutes (concentration × van 't Hoff factor i × osmotic coefficient φ),
// van 't Hoff osmotic pressure, and osmotic / tonic comparison against a reference. Molar masses come from the
// formula and the standard atomic weights in chem.ts, so no table of molar masses is copied.
import { parseFormula, molarMass } from './chem.ts';

export const R_GAS = 8.314462618; // J/(mol·K), CODATA
export const KPA_ATM = 101.325, KPA_MMHG = 0.133322387415;

/** A solute: i is the ideal number of particles per formula unit; penetrating solutes cross most cell membranes. */
export type Solute = { id: string; name: string; formula: string; i: number; penetrating?: boolean };
/** General chemistry: dissociation into ions (ideal i) and whether the solute crosses cell membranes freely. */
export const SOLUTES: Solute[] = [
  { id: 'NaCl', name: 'Sodium chloride', formula: 'NaCl', i: 2 },
  { id: 'KCl', name: 'Potassium chloride', formula: 'KCl', i: 2 },
  { id: 'CaCl2', name: 'Calcium chloride', formula: 'CaCl2', i: 3 },
  { id: 'CaCl2.2H2O', name: 'Calcium chloride dihydrate', formula: 'CaCl2·2H2O', i: 3 },
  { id: 'MgCl2', name: 'Magnesium chloride', formula: 'MgCl2', i: 3 },
  { id: 'MgSO4', name: 'Magnesium sulfate', formula: 'MgSO4', i: 2 },
  { id: 'NaHCO3', name: 'Sodium bicarbonate', formula: 'NaHCO3', i: 2 },
  { id: 'Na2HPO4', name: 'Disodium phosphate', formula: 'Na2HPO4', i: 3 },
  { id: 'NaH2PO4', name: 'Monosodium phosphate', formula: 'NaH2PO4', i: 2 },
  { id: 'KH2PO4', name: 'Monopotassium phosphate', formula: 'KH2PO4', i: 2 },
  { id: 'Na2SO4', name: 'Sodium sulfate', formula: 'Na2SO4', i: 3 },
  { id: 'glucose', name: 'Glucose', formula: 'C6H12O6', i: 1 },
  { id: 'sucrose', name: 'Sucrose', formula: 'C12H22O11', i: 1 },
  { id: 'mannitol', name: 'Mannitol', formula: 'C6H14O6', i: 1 },
  { id: 'urea', name: 'Urea', formula: 'CH4N2O', i: 1, penetrating: true },
  { id: 'glycerol', name: 'Glycerol', formula: 'C3H8O3', i: 1, penetrating: true },
  { id: 'ethanol', name: 'Ethanol', formula: 'C2H6O', i: 1, penetrating: true },
];
export const solute = (id: string) => SOLUTES.find((s) => s.id === id);
export const formulaMass = (f: string) => molarMass(parseFormula(f));

export type Unit = 'mM' | 'M' | 'gL' | 'pct' | 'mgdL';
export const UNITS: { id: Unit; label: string; needsMass: boolean }[] = [
  { id: 'mM', label: 'mmol/L', needsMass: false },
  { id: 'M', label: 'mol/L', needsMass: false },
  { id: 'gL', label: 'g/L (= mg/mL)', needsMass: true },
  { id: 'pct', label: '% w/v (g/100 mL)', needsMass: true },
  { id: 'mgdL', label: 'mg/dL', needsMass: true },
];
/** A concentration in mmol/L. molar mass in g/mol (only for the mass units). */
export function toMmolL(v: number, unit: Unit, M = NaN): number {
  switch (unit) {
    case 'mM': return v;
    case 'M': return v * 1000;
    case 'gL': return (v / M) * 1000;
    case 'pct': return ((v * 10) / M) * 1000;
    case 'mgdL': return ((v / 100) / M) * 1000;
  }
}

export type Row = { name: string; mmolL: number; i: number; phi: number; penetrating: boolean };
export type Osm = { total: number; effective: number; parts: { name: string; mOsm: number; penetrating: boolean }[] };
/** Osmolarity (mOsm/L) = Σ c × i × φ; effective osmolarity (tonicity) leaves out solutes that cross membranes. */
export function osmolarity(rows: Row[]): Osm {
  const parts = rows.map((r) => ({ name: r.name, mOsm: r.mmolL * r.i * r.phi, penetrating: r.penetrating }));
  return { total: parts.reduce((s, p) => s + p.mOsm, 0), effective: parts.filter((p) => !p.penetrating).reduce((s, p) => s + p.mOsm, 0), parts };
}

/** van 't Hoff: π = c R T, with c in mOsm/L (= osmol/m³). Returns kPa. */
export const osmoticKPa = (mOsmL: number, tC: number) => (mOsmL * R_GAS * (tC + 273.15)) / 1000;

export type Compare = 'hypo' | 'iso' | 'hyper';
export const compare = (v: number, ref: number, tol: number): Compare => (v < ref - tol ? 'hypo' : v > ref + tol ? 'hyper' : 'iso');
