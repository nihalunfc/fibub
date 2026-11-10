// #1298 Esterification: carboxylic acid + alcohol ⇌ ester + water (warm, a few drops of conc. H₂SO₄). Names
// (alkyl alkanoate), condensed formulas, molar masses from IUPAC atomic weights, the limiting reagent and the
// theoretical and equilibrium amounts (equilibrium constant about 4, the classic value for ethanoic acid +
// ethanol, used here for all pairs as an approximation). Pure maths, no DOM.

const C = 12.011, H = 1.008, O = 15.999;
const STEM = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct'];
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) => (n === 1 ? '' : String(n).split('').map((d) => SUBS[+d]).join(''));
/** Alkyl group CₙH₂ₙ₊₁ as text: "CH₃", "C₂H₅". */
export const alkyl = (n: number) => `C${sub(n)}H${sub(2 * n + 1)}`;

export type Acid = { c: number; name: string; formula: string };
export type Alcohol = { c: number; name: string; formula: string };
export const ACIDS: Acid[] = [1, 2, 3, 4].map((c) => ({ c, name: `${STEM[c]}anoic acid`, formula: c === 1 ? 'HCOOH' : `${alkyl(c - 1)}COOH` }));
export const ALCOHOLS: Alcohol[] = [1, 2, 3, 4, 5, 8].map((c) => ({ c, name: c <= 2 ? `${STEM[c]}anol` : `${STEM[c]}an-1-ol`, formula: `${alkyl(c)}OH` }));

export const molarAcid = (a: Acid) => a.c * C + 2 * a.c * H + 2 * O;
export const molarAlcohol = (b: Alcohol) => b.c * C + (2 * b.c + 2) * H + O;
export const WATER = 2 * H + O;
/** Ester CₙH₂ₙO₂ with n = acid carbons + alcohol carbons. */
export const molarEster = (a: Acid, b: Alcohol) => (a.c + b.c) * C + 2 * (a.c + b.c) * H + 2 * O;
export const esterName = (a: Acid, b: Alcohol) => `${STEM[b.c]}yl ${STEM[a.c]}anoate`;
export const esterFormula = (a: Acid, b: Alcohol) => `${a.c === 1 ? 'H' : alkyl(a.c - 1)}COO${alkyl(b.c)}`;
export const molecularFormula = (a: Acid, b: Alcohol) => `C${sub(a.c + b.c)}H${sub(2 * (a.c + b.c))}O₂`;

/** How the ester is commonly described to smell (general descriptions; many esters just smell "fruity"). */
export function smell(a: Acid, b: Alcohol): string {
  const k = `${a.c}-${b.c}`;
  const S: Record<string, string> = {
    '2-2': 'sweet, like nail-polish remover or pear drops', '2-5': 'banana', '2-8': 'orange', '2-3': 'pear', '2-4': 'apple, sweet',
    '4-1': 'apple and pineapple', '4-2': 'pineapple', '1-2': 'rum, a little like raspberry', '2-1': 'sweet, like glue', '3-2': 'fruity, like pineapple', '4-5': 'apricot, pear',
  };
  return S[k] ?? 'fruity';
}

/** Moles, the limiting reagent and the theoretical (complete) and equilibrium (K) amounts of ester. */
export function yieldOf(a: Acid, b: Alcohol, gAcid: number, gAlc: number, K = 4) {
  const nA = gAcid / molarAcid(a), nB = gAlc / molarAlcohol(b), nMax = Math.min(nA, nB);
  // x² / ((nA − x)(nB − x)) = K  →  (1 − K)x² + K(nA + nB)x − K nA nB = 0, root in [0, nMax].
  let x: number;
  if (Math.abs(K - 1) < 1e-12) x = (nA * nB) / (nA + nB);
  else { const A = 1 - K, B = K * (nA + nB), Cc = -K * nA * nB, d = Math.sqrt(B * B - 4 * A * Cc); const r1 = (-B + d) / (2 * A), r2 = (-B - d) / (2 * A); x = [r1, r2].find((r) => r >= -1e-12 && r <= nMax + 1e-12) ?? NaN; }
  return { nA, nB, limiting: nA < nB ? 'acid' : nB < nA ? 'alcohol' : 'neither', nMax, gMax: nMax * molarEster(a, b), nEq: x, gEq: x * molarEster(a, b), pctEq: nMax > 0 ? (100 * x) / nMax : 0 };
}
