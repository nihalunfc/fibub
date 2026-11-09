// Electrospray adducts and neutral losses for a neutral molecule given as a formula or a monoisotopic mass, and
// matching of observed m/z values within a ppm tolerance. Masses from the element data in chem.ts. No DOM.
import { parseFormula, monoMass, ELECTRON } from './chem.ts';

export type AdductDef = { id: string; label: string; mode: '+' | '-'; mult: number; add: string; remove: string; z: number };

/** Common ESI adducts (positive and negative), written as formula changes to n·M. */
export const ADDUCT_LIST: AdductDef[] = [
  { id: 'M+H', label: '[M+H]+', mode: '+', mult: 1, add: 'H', remove: '', z: 1 },
  { id: 'M+NH4', label: '[M+NH4]+', mode: '+', mult: 1, add: 'NH4', remove: '', z: 1 },
  { id: 'M+Na', label: '[M+Na]+', mode: '+', mult: 1, add: 'Na', remove: '', z: 1 },
  { id: 'M+K', label: '[M+K]+', mode: '+', mult: 1, add: 'K', remove: '', z: 1 },
  { id: 'M+Li', label: '[M+Li]+', mode: '+', mult: 1, add: 'Li', remove: '', z: 1 },
  { id: 'M+H-H2O', label: '[M+H−H2O]+', mode: '+', mult: 1, add: 'H', remove: 'H2O', z: 1 },
  { id: 'M+CH3OH+H', label: '[M+CH3OH+H]+', mode: '+', mult: 1, add: 'CH5O', remove: '', z: 1 },
  { id: 'M+ACN+H', label: '[M+ACN+H]+', mode: '+', mult: 1, add: 'C2H4N', remove: '', z: 1 },
  { id: 'M+2Na-H', label: '[M+2Na−H]+', mode: '+', mult: 1, add: 'Na2', remove: 'H', z: 1 },
  { id: 'M+2H', label: '[M+2H]2+', mode: '+', mult: 1, add: 'H2', remove: '', z: 2 },
  { id: 'M+H+Na', label: '[M+H+Na]2+', mode: '+', mult: 1, add: 'HNa', remove: '', z: 2 },
  { id: 'M+3H', label: '[M+3H]3+', mode: '+', mult: 1, add: 'H3', remove: '', z: 3 },
  { id: '2M+H', label: '[2M+H]+', mode: '+', mult: 2, add: 'H', remove: '', z: 1 },
  { id: '2M+Na', label: '[2M+Na]+', mode: '+', mult: 2, add: 'Na', remove: '', z: 1 },
  { id: '2M+NH4', label: '[2M+NH4]+', mode: '+', mult: 2, add: 'NH4', remove: '', z: 1 },
  { id: 'M-H', label: '[M−H]−', mode: '-', mult: 1, add: '', remove: 'H', z: -1 },
  { id: 'M-H-H2O', label: '[M−H−H2O]−', mode: '-', mult: 1, add: '', remove: 'H3O', z: -1 },
  { id: 'M+Cl', label: '[M+Cl]−', mode: '-', mult: 1, add: 'Cl', remove: '', z: -1 },
  { id: 'M+Br', label: '[M+Br]−', mode: '-', mult: 1, add: 'Br', remove: '', z: -1 },
  { id: 'M+HCOO', label: '[M+HCOO]− (formate)', mode: '-', mult: 1, add: 'CHO2', remove: '', z: -1 },
  { id: 'M+CH3COO', label: '[M+CH3COO]− (acetate)', mode: '-', mult: 1, add: 'C2H3O2', remove: '', z: -1 },
  { id: 'M+Na-2H', label: '[M+Na−2H]−', mode: '-', mult: 1, add: 'Na', remove: 'H2', z: -1 },
  { id: 'M-2H', label: '[M−2H]2−', mode: '-', mult: 1, add: '', remove: 'H2', z: -2 },
  { id: 'M-3H', label: '[M−3H]3−', mode: '-', mult: 1, add: '', remove: 'H3', z: -3 },
  { id: '2M-H', label: '[2M−H]−', mode: '-', mult: 2, add: '', remove: 'H', z: -1 },
];

/** Common neutral losses seen in MS/MS and in-source fragmentation. */
export const LOSSES: { id: string; label: string; formula: string }[] = [
  { id: 'H2O', label: 'Water', formula: 'H2O' },
  { id: 'NH3', label: 'Ammonia', formula: 'NH3' },
  { id: 'CO', label: 'Carbon monoxide', formula: 'CO' },
  { id: 'CO2', label: 'Carbon dioxide', formula: 'CO2' },
  { id: 'HCOOH', label: 'Formic acid', formula: 'CH2O2' },
  { id: 'CH3OH', label: 'Methanol', formula: 'CH4O' },
  { id: 'C2H4O2', label: 'Acetic acid', formula: 'C2H4O2' },
  { id: 'H3PO4', label: 'Phosphoric acid', formula: 'H3PO4' },
  { id: 'HPO3', label: 'Metaphosphoric acid', formula: 'HPO3' },
  { id: 'SO3', label: 'Sulfur trioxide (sulfate)', formula: 'SO3' },
  { id: 'C6H10O5', label: 'Hexose (sugar) residue', formula: 'C6H10O5' },
  { id: 'C6H8O6', label: 'Glucuronic acid residue', formula: 'C6H8O6' },
  { id: 'C5H8O4', label: 'Pentose residue', formula: 'C5H8O4' },
];

/** Monoisotopic mass of a formula string (neutral). */
export const formulaMass = (s: string) => (s ? monoMass(parseFormula(s)) : 0);

/** m/z of an adduct of a neutral molecule of monoisotopic mass M: (n·M + Δadd − Δremove − z·mₑ)/|z|. */
export function adductMz(M: number, a: AdductDef) {
  return (a.mult * M + formulaMass(a.add) - formulaMass(a.remove) - a.z * ELECTRON) / Math.abs(a.z);
}

/** Neutral mass from an observed m/z, assuming an adduct (the inverse of adductMz). */
export function neutralFrom(mz: number, a: AdductDef) {
  return (mz * Math.abs(a.z) + a.z * ELECTRON - formulaMass(a.add) + formulaMass(a.remove)) / a.mult;
}

/** m/z after a neutral loss of mass `loss` from an ion of m/z `mz` and charge z. */
export const afterLoss = (mz: number, z: number, loss: number) => mz - loss / Math.abs(z);

export const ppmError = (observed: number, theory: number) => ((observed - theory) / theory) * 1e6;

export type Candidate = { label: string; mz: number; z: number; loss?: string };

/** Observed m/z values matched to candidate ions within tolerance (ppm, or an absolute mDa floor), nearest first. */
export function matchList(observed: number[], cands: Candidate[], tolPpm: number, tolMda = 0) {
  return observed.map((o) => {
    const hits = cands
      .map((c) => ({ ...c, ppm: ppmError(o, c.mz), mda: (o - c.mz) * 1000 }))
      .filter((h) => Math.abs(h.ppm) <= tolPpm || Math.abs(h.mda) <= tolMda)
      .sort((p, q) => Math.abs(p.ppm) - Math.abs(q.ppm));
    return { observed: o, hits };
  });
}
