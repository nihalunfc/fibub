// School chemistry: esterification (Class 10 carbon compounds; Class 12 carboxylic acids; Class 11 equilibrium).
// Carboxylic acid + alcohol ⇌ ester + water, with a few drops of concentrated sulfuric acid. The ester is named
// alkyl alkanoate. Molar masses use rounded atomic masses (C 12, H 1, O 16). The equilibrium example uses the
// classic textbook constant K ≈ 4 for ethanoic acid + ethanol (a round teaching value). No DOM.

export type Acid = { id: string; name: string; c: number; stem: string; condensed: string; aromatic?: boolean };
export type Alcohol = { id: string; name: string; c: number; alkyl: string; condensed: string };

export const ACIDS: Acid[] = [
  { id: 'methanoic', name: 'Methanoic acid (formic acid)', c: 1, stem: 'methanoate', condensed: 'HCOOH' },
  { id: 'ethanoic', name: 'Ethanoic acid (acetic acid, in vinegar)', c: 2, stem: 'ethanoate', condensed: 'CH₃COOH' },
  { id: 'propanoic', name: 'Propanoic acid', c: 3, stem: 'propanoate', condensed: 'CH₃CH₂COOH' },
  { id: 'butanoic', name: 'Butanoic acid', c: 4, stem: 'butanoate', condensed: 'CH₃CH₂CH₂COOH' },
  { id: 'benzoic', name: 'Benzoic acid', c: 7, stem: 'benzoate', condensed: 'C₆H₅COOH', aromatic: true },
];
export const ALCOHOLS: Alcohol[] = [
  { id: 'methanol', name: 'Methanol', c: 1, alkyl: 'methyl', condensed: 'CH₃OH' },
  { id: 'ethanol', name: 'Ethanol', c: 2, alkyl: 'ethyl', condensed: 'CH₃CH₂OH' },
  { id: 'propanol', name: 'Propan-1-ol', c: 3, alkyl: 'propyl', condensed: 'CH₃CH₂CH₂OH' },
  { id: 'butanol', name: 'Butan-1-ol', c: 4, alkyl: 'butyl', condensed: 'CH₃(CH₂)₃OH' },
  { id: 'pentanol', name: 'Pentan-1-ol', c: 5, alkyl: 'pentyl', condensed: 'CH₃(CH₂)₄OH' },
  { id: 'octanol', name: 'Octan-1-ol', c: 8, alkyl: 'octyl', condensed: 'CH₃(CH₂)₇OH' },
];

/** Familiar smells of some simple esters (common kitchen-chemistry knowledge; smell is subjective). */
export const SMELLS: Record<string, string> = {
  'ethanoic+ethanol': 'sweet and fruity, like nail-polish remover or pear drops',
  'ethanoic+pentanol': 'banana',
  'ethanoic+octanol': 'orange',
  'ethanoic+propanol': 'pear',
  'butanoic+ethanol': 'pineapple',
  'butanoic+methanol': 'apple',
  'butanoic+pentanol': 'apricot',
  'methanoic+ethanol': 'rum-like',
  'benzoic+methanol': 'sweet, floral',
  'ethanoic+methanol': 'sweet, glue-like',
  'propanoic+ethanol': 'fruity, like rum and pineapple',
};

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => SUB[+d]));
export const formulaText = (f: { C: number; H: number; O: number }) => `C${sub(f.C)}H${sub(f.H)}O${sub(f.O)}`;
export const mass = (f: { C: number; H: number; O: number }) => 12 * f.C + f.H + 16 * f.O;

export const acidFormula = (a: Acid) => (a.aromatic ? { C: 7, H: 6, O: 2 } : { C: a.c, H: 2 * a.c, O: 2 });
export const alcoholFormula = (r: Alcohol) => ({ C: r.c, H: 2 * r.c + 2, O: 1 });
/** Ester = acid + alcohol − water. */
export function esterFormula(a: Acid, r: Alcohol) {
  const A = acidFormula(a), R = alcoholFormula(r);
  return { C: A.C + R.C, H: A.H + R.H - 2, O: A.O + R.O - 1 };
}
export const esterName = (a: Acid, r: Alcohol) => `${r.alkyl} ${a.stem}`;
export function esterCondensed(a: Acid, r: Alcohol): string {
  const acidPart = a.condensed.replace(/COOH$/, 'COO');
  const alk = r.c === 1 ? 'CH₃' : r.c === 2 ? 'CH₂CH₃' : r.c === 3 ? 'CH₂CH₂CH₃' : `(CH₂)${sub(r.c - 1)}CH₃`;
  return acidPart + alk;
}

/** Moles of ester at equilibrium from a mol acid, b mol alcohol, with optional starting ester e and water w. */
export function equilibrium(a: number, b: number, K = 4, e = 0, w = 0): number {
  // (e + x)(w + x) = K (a − x)(b − x)  →  (1 − K)x² + (e + w + K(a + b))x + (ew − Kab) = 0
  const A = 1 - K, B = e + w + K * (a + b), C = e * w - K * a * b;
  const lo = -Math.min(e, w), hi = Math.min(a, b);
  const roots = Math.abs(A) < 1e-12 ? [-C / B] : [(-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A), (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A)];
  const ok = roots.filter((x) => x >= lo - 1e-9 && x <= hi + 1e-9);
  return ok.length ? Math.max(lo, Math.min(hi, ok[0])) : NaN;
}
