// Formula writer (school level): a cation and an anion, their valencies swapped ("criss-cross") and reduced to the
// simplest whole-number ratio, the compound's name, and its formula unit mass with the rounded atomic masses school
// books use or the IUPAC standard atomic weights. Pure functions, no DOM.
import { parseFormula, byElement, BY_SYMBOL } from './chem.ts';

export type Ion = { id: string; f: string; name: string; v: number; poly: boolean };

/** Common school ions. f is the formula without charge; poly marks groups that need brackets when more than one. */
export const CATIONS: Ion[] = [
  { id: 'H', f: 'H', name: 'hydrogen', v: 1, poly: false },
  { id: 'Na', f: 'Na', name: 'sodium', v: 1, poly: false },
  { id: 'K', f: 'K', name: 'potassium', v: 1, poly: false },
  { id: 'Ag', f: 'Ag', name: 'silver', v: 1, poly: false },
  { id: 'NH4', f: 'NH4', name: 'ammonium', v: 1, poly: true },
  { id: 'Cu1', f: 'Cu', name: 'copper(I)', v: 1, poly: false },
  { id: 'Mg', f: 'Mg', name: 'magnesium', v: 2, poly: false },
  { id: 'Ca', f: 'Ca', name: 'calcium', v: 2, poly: false },
  { id: 'Ba', f: 'Ba', name: 'barium', v: 2, poly: false },
  { id: 'Zn', f: 'Zn', name: 'zinc', v: 2, poly: false },
  { id: 'Fe2', f: 'Fe', name: 'iron(II)', v: 2, poly: false },
  { id: 'Cu2', f: 'Cu', name: 'copper(II)', v: 2, poly: false },
  { id: 'Pb', f: 'Pb', name: 'lead(II)', v: 2, poly: false },
  { id: 'Al', f: 'Al', name: 'aluminium', v: 3, poly: false },
  { id: 'Fe3', f: 'Fe', name: 'iron(III)', v: 3, poly: false },
];
export const ANIONS: Ion[] = [
  { id: 'F', f: 'F', name: 'fluoride', v: 1, poly: false },
  { id: 'Cl', f: 'Cl', name: 'chloride', v: 1, poly: false },
  { id: 'Br', f: 'Br', name: 'bromide', v: 1, poly: false },
  { id: 'I', f: 'I', name: 'iodide', v: 1, poly: false },
  { id: 'OH', f: 'OH', name: 'hydroxide', v: 1, poly: true },
  { id: 'NO3', f: 'NO3', name: 'nitrate', v: 1, poly: true },
  { id: 'NO2', f: 'NO2', name: 'nitrite', v: 1, poly: true },
  { id: 'HCO3', f: 'HCO3', name: 'hydrogencarbonate', v: 1, poly: true },
  { id: 'O', f: 'O', name: 'oxide', v: 2, poly: false },
  { id: 'S', f: 'S', name: 'sulfide', v: 2, poly: false },
  { id: 'SO4', f: 'SO4', name: 'sulfate', v: 2, poly: true },
  { id: 'SO3', f: 'SO3', name: 'sulfite', v: 2, poly: true },
  { id: 'CO3', f: 'CO3', name: 'carbonate', v: 2, poly: true },
  { id: 'N', f: 'N', name: 'nitride', v: 3, poly: false },
  { id: 'PO4', f: 'PO4', name: 'phosphate', v: 3, poly: true },
];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const part = (ion: Ion, k: number) => (k === 1 ? ion.f : ion.poly ? `(${ion.f})${k}` : `${ion.f}${k}`);

export type Compound = { cat: Ion; an: Ion; x: number; y: number; formula: string; name: string; swapped: [number, number]; reduced: boolean };

/** Criss-cross: cation count = anion valency, anion count = cation valency, then divide by the common factor. */
export function crissCross(cat: Ion, an: Ion): Compound {
  const g = gcd(cat.v, an.v), x = an.v / g, y = cat.v / g;
  const name = cat.id === 'H' && an.id === 'OH' ? 'water' : `${cat.name} ${an.name}`;
  return { cat, an, x, y, formula: cat.id === 'H' && an.id === 'OH' ? 'H2O' : part(cat, x) + part(an, y), name, swapped: [an.v, cat.v], reduced: g > 1 };
}

/** Rounded atomic masses used in school books (u). */
export const SCHOOL_MASS: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207 };

export type MassRow = { symbol: string; name: string; count: number; mass: number; subtotal: number };
/** Formula unit (or molecular) mass of a formula such as "Al2(SO4)3", element by element. */
export function formulaMass(formula: string, school: boolean): { rows: MassRow[]; total: number } {
  const counts = byElement(parseFormula(formula));
  const order = [...counts.keys()];
  const rows = order.map((symbol) => {
    const el = BY_SYMBOL.get(symbol)!;
    const mass = school ? SCHOOL_MASS[symbol] : el.weight;
    if (mass == null) throw new Error(`No rounded school mass for ${symbol}.`);
    const count = counts.get(symbol)!;
    return { symbol, name: el.name, count, mass, subtotal: mass * count };
  });
  return { rows, total: rows.reduce((a, r) => a + r.subtotal, 0) };
}

/** Atoms of each kind in one formula unit, e.g. Al2(SO4)3 → Al 2, S 3, O 12. */
export const atomsIn = (formula: string) => byElement(parseFormula(formula));
