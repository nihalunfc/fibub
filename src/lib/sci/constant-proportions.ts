// Law of constant proportions (and, for Class 11, multiple proportions): a compound always has the same elements in
// the same ratio by mass, wherever the sample came from. Masses use the standard atomic weights in chem.ts.
// Plain TypeScript, no DOM.
import { parseFormula, composition } from './chem.ts';

export type Compound = { id: string; name: string; formula: string; order: string[]; sources: string[] };
export const COMPOUNDS: Compound[] = [
  { id: 'water', name: 'Water', formula: 'H2O', order: ['H', 'O'], sources: ['Rain water (filtered and distilled)', 'River water (distilled)', 'Sea water (distilled)', 'Melted ice', 'Made in the lab by burning hydrogen'] },
  { id: 'co2', name: 'Carbon dioxide', formula: 'CO2', order: ['C', 'O'], sources: ['Burning charcoal', 'Breathed-out air (purified)', 'Limestone + acid', 'Baking soda heated'] },
  { id: 'mgo', name: 'Magnesium oxide', formula: 'MgO', order: ['Mg', 'O'], sources: ['Magnesium ribbon burnt in air', 'Magnesium carbonate heated', 'Bought from a supplier'] },
  { id: 'nh3', name: 'Ammonia', formula: 'NH3', order: ['N', 'H'], sources: ['Made from nitrogen and hydrogen', 'Ammonium chloride + lime, heated'] },
  { id: 'nacl', name: 'Sodium chloride', formula: 'NaCl', order: ['Na', 'Cl'], sources: ['Sea salt (purified)', 'Rock salt (purified)', 'Made from sodium hydroxide + hydrochloric acid'] },
  { id: 'caco3', name: 'Calcium carbonate', formula: 'CaCO3', order: ['Ca', 'C', 'O'], sources: ['Chalk (purified)', 'Marble (purified)', 'Egg shell (purified)'] },
];
export const byId = (id: string) => COMPOUNDS.find((c) => c.id === id)!;

/** Mass of each element in m grams of the compound, in the compound's own order. */
export function split(c: Compound, m: number): { symbol: string; name: string; mass: number; percent: number }[] {
  const comp = composition(parseFormula(c.formula));
  return c.order.map((s) => { const e = comp.find((x) => x.symbol === s)!; return { symbol: s, name: e.name, mass: (m * e.percent) / 100, percent: e.percent }; });
}

/** Ratio by mass with the first element as 1: water → [1, 7.94]. */
export function ratio(masses: number[]): number[] {
  return masses.map((x) => x / masses[0]);
}

/** Smallest whole-number ratio close to the given one (within tol), e.g. [1, 2.667] → [3, 8]. Tries multipliers 1..12. */
export function wholeRatio(r: number[], tol = 0.03): number[] | null {
  for (let k = 1; k <= 12; k++) {
    const v = r.map((x) => x * k);
    if (v.every((x) => Math.abs(x - Math.round(x)) <= tol * Math.max(1, x) && Math.round(x) > 0)) return v.map(Math.round);
  }
  return null;
}

/** Pairs of compounds of the same two elements, for the law of multiple proportions. */
export const PAIRS: { a: string; b: string; fixed: string; other: string; formulas: string[]; names: string[] }[] = [
  { a: 'C', b: 'O', fixed: 'C', other: 'O', formulas: ['CO', 'CO2'], names: ['Carbon monoxide', 'Carbon dioxide'] },
  { a: 'H', b: 'O', fixed: 'H', other: 'O', formulas: ['H2O', 'H2O2'], names: ['Water', 'Hydrogen peroxide'] },
  { a: 'S', b: 'O', fixed: 'S', other: 'O', formulas: ['SO2', 'SO3'], names: ['Sulfur dioxide', 'Sulfur trioxide'] },
  { a: 'N', b: 'O', fixed: 'N', other: 'O', formulas: ['N2O', 'NO', 'NO2'], names: ['Dinitrogen oxide', 'Nitrogen monoxide', 'Nitrogen dioxide'] },
  { a: 'Fe', b: 'O', fixed: 'Fe', other: 'O', formulas: ['FeO', 'Fe2O3'], names: ['Iron(II) oxide', 'Iron(III) oxide'] },
];

/** Grams of `other` that combine with 1 g of `fixed` in each formula, and the simple whole-number ratio between them. */
export function multiple(p: typeof PAIRS[number]): { per1: number[]; simple: number[] | null } {
  const per1 = p.formulas.map((f) => { const c = composition(parseFormula(f)); const mf = c.find((x) => x.symbol === p.fixed)!.mass, mo = c.find((x) => x.symbol === p.other)!.mass; return mo / mf; });
  return { per1, simple: wholeRatio(ratio(per1), 0.01) };
}

/** A reading on a balance that shows 0.01 g: the true mass rounded, plus at most one step of wobble. */
export const reading = (m: number, wobble: number) => Math.round(m * 100 + wobble) / 100;

/** School rounded atomic masses (H = 1, C = 12, ...), for the "about" ratio quoted in textbooks. */
export const ROUNDED: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, Cl: 35.5, Ca: 40, Fe: 56 };
/** The whole-number mass ratio from rounded atomic masses: H2O → [1, 8], CO2 → [3, 8], NaCl → [46, 71]. */
export function roundedRatio(c: Compound): number[] {
  const counts = parseFormula(c.formula).counts;
  const m = c.order.map((s) => 2 * ROUNDED[s] * (counts.get(s) ?? 0));
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const d = m.reduce(g);
  return m.map((x) => x / d);
}
