// Limiting reagent (school level): which of two reactants runs out first, the theoretical yield, what is left over
// and the percent yield, with the working written as lines of text. Pure functions, no DOM.
// Molar masses come from the shared element data (IUPAC standard atomic weights), or rounded school masses on request.
import { molar } from './molebridge.ts';
import { sci } from './phscale.ts';

export type Sp = { f: string; c: number };
export type Rx = { id: string; name: string; a: Sp; b: Sp; p: Sp[] };

/** Ready-made reactions. The first four keep the order the page always had. */
export const RXS: Rx[] = [
  { id: 'water', name: 'Making water', a: { f: 'H2', c: 2 }, b: { f: 'O2', c: 1 }, p: [{ f: 'H2O', c: 2 }] },
  { id: 'ammonia', name: 'Making ammonia', a: { f: 'N2', c: 1 }, b: { f: 'H2', c: 3 }, p: [{ f: 'NH3', c: 2 }] },
  { id: 'methane', name: 'Burning methane', a: { f: 'CH4', c: 1 }, b: { f: 'O2', c: 2 }, p: [{ f: 'CO2', c: 1 }, { f: 'H2O', c: 2 }] },
  { id: 'magnesium', name: 'Burning magnesium', a: { f: 'Mg', c: 2 }, b: { f: 'O2', c: 1 }, p: [{ f: 'MgO', c: 2 }] },
  { id: 'propane', name: 'Burning propane', a: { f: 'C3H8', c: 1 }, b: { f: 'O2', c: 5 }, p: [{ f: 'CO2', c: 3 }, { f: 'H2O', c: 4 }] },
  { id: 'aluminium', name: 'Aluminium and chlorine', a: { f: 'Al', c: 2 }, b: { f: 'Cl2', c: 3 }, p: [{ f: 'AlCl3', c: 2 }] },
  { id: 'iron', name: 'Iron and sulfur', a: { f: 'Fe', c: 1 }, b: { f: 'S', c: 1 }, p: [{ f: 'FeS', c: 1 }] },
  { id: 'zinc', name: 'Zinc and hydrochloric acid', a: { f: 'Zn', c: 1 }, b: { f: 'HCl', c: 2 }, p: [{ f: 'ZnCl2', c: 1 }, { f: 'H2', c: 1 }] },
  { id: 'chalk', name: 'Limestone and hydrochloric acid', a: { f: 'CaCO3', c: 1 }, b: { f: 'HCl', c: 2 }, p: [{ f: 'CaCl2', c: 1 }, { f: 'H2O', c: 1 }, { f: 'CO2', c: 1 }] },
  { id: 'salt', name: 'Sodium and chlorine', a: { f: 'Na', c: 2 }, b: { f: 'Cl2', c: 1 }, p: [{ f: 'NaCl', c: 2 }] },
];

const SUB = '₀₁₂₃₄₅₆₇₈₉';
export const subs = (f: string) => f.replace(/\d/g, (d) => SUB[+d]);
export const eqText = (rx: { a: Sp; b: Sp; p: Sp | Sp[] }) => {
  const t = (s: Sp) => `${s.c === 1 ? '' : s.c + ' '}${subs(s.f)}`;
  return `${t(rx.a)} + ${t(rx.b)} → ${(Array.isArray(rx.p) ? rx.p : [rx.p]).map(t).join(' + ')}`;
};

export type Unit = 'g' | 'mg' | 'kg' | 'mol';
export type Amount = { value: number; unit: Unit };
const num = (x: number, n = 4) => sci(x, n);

export type Solved = {
  MA: number; MB: number; MP: number; nA: number; nB: number; xA: number; xB: number;
  limiter: 'a' | 'b' | 'both'; extent: number; productMol: number; productG: number;
  leftSpecies: 'a' | 'b' | null; leftMol: number; leftG: number; percentYield: number | null; steps: string[];
};

/** Solve one reaction. rx.p is the product being asked about (one species). actualG: grams actually obtained. */
export function solveLimiting(rx: { a: Sp; b: Sp; p: Sp }, A: Amount, B: Amount, school = false, actualG = NaN): Solved {
  for (const [name, x] of [['the first reactant', A], ['the second reactant', B]] as const) {
    if (!Number.isFinite(x.value)) throw new Error(`Type an amount for ${name}.`);
    if (!(x.value > 0)) throw new Error(`The amount of ${name} must be above zero.`);
  }
  for (const s of [rx.a, rx.b, rx.p]) if (!(s.c > 0) || !Number.isFinite(s.c)) throw new Error('Every coefficient must be a number above zero.');
  const mass = (f: string) => { const M = molar(f, school).M; if (!(M > 0)) throw new Error(`Could not work out the molar mass of ${f}.`); return M; };
  const MA = mass(rx.a.f), MB = mass(rx.b.f), MP = mass(rx.p.f);
  const steps: string[] = [`Molar masses: ${subs(rx.a.f)} = ${num(MA, 5)} g/mol, ${subs(rx.b.f)} = ${num(MB, 5)} g/mol, ${subs(rx.p.f)} = ${num(MP, 5)} g/mol.`];
  const toMol = (a: Amount, M: number, f: string) => {
    if (a.unit === 'mol') return a.value;
    const g = a.unit === 'g' ? a.value : a.unit === 'mg' ? a.value / 1000 : a.value * 1000;
    const n = g / M;
    steps.push(`${subs(f)}: moles = mass ÷ molar mass = ${num(g)} g ÷ ${num(M, 5)} g/mol = ${num(n)} mol.`);
    return n;
  };
  const nA = toMol(A, MA, rx.a.f), nB = toMol(B, MB, rx.b.f);
  const xA = nA / rx.a.c, xB = nB / rx.b.c;
  const tie = Math.abs(xA - xB) <= 1e-9 * Math.max(xA, xB);
  const limiter: 'a' | 'b' | 'both' = tie ? 'both' : xA < xB ? 'a' : 'b';
  const extent = Math.min(xA, xB);
  steps.push(`Divide by the coefficients: ${subs(rx.a.f)} ${num(nA)} ÷ ${rx.a.c} = ${num(xA)}; ${subs(rx.b.f)} ${num(nB)} ÷ ${rx.b.c} = ${num(xB)}. The smaller number is the limiting reagent: ${limiter === 'both' ? 'neither, they run out together' : subs(limiter === 'a' ? rx.a.f : rx.b.f)}.`);
  const productMol = extent * rx.p.c, productG = productMol * MP;
  steps.push(`Product: ${num(extent)} × ${rx.p.c} = ${num(productMol)} mol ${subs(rx.p.f)}, × ${num(MP, 5)} g/mol = ${num(productG)} g (the theoretical yield).`);
  const leftSpecies = limiter === 'both' ? null : limiter === 'a' ? 'b' : 'a';
  let leftMol = 0, leftG = 0;
  if (leftSpecies) {
    const sp = leftSpecies === 'a' ? rx.a : rx.b, n = leftSpecies === 'a' ? nA : nB, M = leftSpecies === 'a' ? MA : MB;
    leftMol = Math.max(0, n - extent * sp.c); leftG = leftMol * M;
    steps.push(`Left over: ${subs(sp.f)} used ${num(extent * sp.c)} mol, so ${num(n)} − ${num(extent * sp.c)} = ${num(leftMol)} mol = ${num(leftG)} g.`);
  }
  let percentYield: number | null = null;
  if (Number.isFinite(actualG) && actualG > 0 && productG > 0) {
    percentYield = (100 * actualG) / productG;
    steps.push(`Percent yield = actual ÷ theoretical × 100 = ${num(actualG)} ÷ ${num(productG)} × 100 = ${num(percentYield, 3)} %.${percentYield > 100 ? ' A yield above 100 % means the product is wet or impure, or there was a mistake.' : ''}`);
  }
  return { MA, MB, MP, nA, nB, xA, xB, limiter, extent, productMol, productG, leftSpecies, leftMol, leftG, percentYield, steps };
}
