// Estimating nitrogen in an organic compound (Class 11 chemistry, quantitative analysis): Dumas method (N₂ gas
// collected, reduced to STP) and Kjeldahl method (NH₃ caught in acid, direct or back titration). School values:
// N = 14 g/mol, N₂ = 28 g/mol, 22 400 mL per mole of gas at STP (273 K, 760 mm Hg). Plain maths, no DOM.

export type Dumas = { pDry: number; v0: number; nN2: number; massN: number; pct: number };
/** m g of compound gives V mL of N₂ at T K and P mm Hg; aq = aqueous tension (mm Hg) if collected over water. */
export function dumas(m: number, V: number, T: number, P: number, aq = 0): Dumas {
  const pDry = P - aq;
  const v0 = (pDry * V * 273) / (760 * T);
  const nN2 = v0 / 22400, massN = 28 * nN2;
  return { pDry, v0, nN2, massN, pct: (massN / m) * 100 };
}

export type Kjeldahl = { mmolAcid: number; mmolBase: number; mmolNH3: number; massN: number; pct: number };
/** m g of compound; the NH₃ is caught in Va mL of Ma mol/L acid with `basicity` H⁺ per formula (2 for H₂SO₄,
 *  1 for HCl). If a base was used to titrate the acid left over (back titration), give Vb mL of Mb mol/L NaOH. */
export function kjeldahl(m: number, Ma: number, Va: number, basicity: number, Mb = 0, Vb = 0): Kjeldahl {
  const mmolAcid = basicity * Ma * Va, mmolBase = Mb * Vb, mmolNH3 = mmolAcid - mmolBase;
  const massN = (14 * mmolNH3) / 1000;
  return { mmolAcid, mmolBase, mmolNH3, massN, pct: (massN / m) * 100 };
}

/** Percent nitrogen from a formula: nN nitrogen atoms in molar mass M (school masses). */
export const pctFromFormula = (nN: number, M: number) => ((14 * nN) / M) * 100;

export const COMPOUNDS = [
  { name: 'Urea, CO(NH₂)₂', nN: 2, M: 60 },
  { name: 'Acetamide, CH₃CONH₂', nN: 1, M: 59 },
  { name: 'Glycine, H₂NCH₂COOH', nN: 1, M: 75 },
  { name: 'Aniline, C₆H₅NH₂', nN: 1, M: 93 },
  { name: 'Thiourea, CS(NH₂)₂', nN: 2, M: 76 },
];
