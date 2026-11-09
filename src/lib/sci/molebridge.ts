// Mole bridge (school level): mass ↔ moles ↔ particles ↔ gas volume at STP, the empirical (and molecular) formula
// from percentage composition, and the limiting reactant for a few simple reactions. Pure functions, no DOM.
import { parseFormula, byElement, BY_SYMBOL, AVOGADRO } from './chem.ts';
import { SCHOOL_MASS } from './formulawriter.ts';

export const NA = AVOGADRO;
export const R = 8.314462618; // J/(mol K), CODATA (exact)
/** Molar volume of an ideal gas at 0 °C: 1 atm (older books, 22.4 L) or 1 bar (IUPAC STP since 1982, 22.7 L). */
export const VM = { atm: (R * 273.15) / 101325 * 1000, bar: (R * 273.15) / 100000 * 1000 };

export type MassRow = { symbol: string; name: string; count: number; mass: number; subtotal: number; school: boolean };
/** Molar mass, element by element: school rounded masses where they exist (school = true), else IUPAC weights. */
export function molar(formula: string, school: boolean): { rows: MassRow[]; M: number } {
  const counts = byElement(parseFormula(formula));
  const rows = [...counts].map(([symbol, count]) => {
    const el = BY_SYMBOL.get(symbol)!, sm = SCHOOL_MASS[symbol];
    const useSchool = school && sm != null, mass = useSchool ? sm : el.weight;
    return { symbol, name: el.name, count, mass, subtotal: mass * count, school: useSchool };
  });
  return { rows, M: rows.reduce((a, r) => a + r.subtotal, 0) };
}

export type Unit = 'g' | 'mol' | 'N' | 'L';
export type Amounts = { g: number; mol: number; N: number; L: number };
/** Convert one amount to all four (L = gas volume at 0 °C with molar volume vm in litres). */
export function bridge(from: Unit, value: number, M: number, vm: number): Amounts {
  if (!(value >= 0) || !Number.isFinite(value)) throw new Error('Type an amount of zero or more.');
  if (!(M > 0)) throw new Error('Molar mass must be above zero.');
  const mol = from === 'g' ? value / M : from === 'mol' ? value : from === 'N' ? value / NA : value / vm;
  return { g: mol * M, mol, N: mol * NA, L: mol * vm };
}

export type EmpRow = { symbol: string; pct: number; mass: number; mol: number; ratio: number; whole: number };
/** Empirical formula from mass percentages: moles in 100 g, divide by the smallest, then scale (×1 to ×6) until all
 *  ratios are within 0.1 of whole numbers. */
export function empirical(items: { symbol: string; pct: number }[], school = false): { rows: EmpRow[]; factor: number; formula: string; M: number; sum: number } {
  if (items.length < 2) throw new Error('Give at least two elements.');
  const seen = new Set<string>();
  for (const it of items) {
    if (!BY_SYMBOL.has(it.symbol)) throw new Error(`"${it.symbol}" is not an element symbol.`);
    if (seen.has(it.symbol)) throw new Error(`${it.symbol} is listed twice.`);
    seen.add(it.symbol);
    if (!(it.pct > 0)) throw new Error(`Give a percentage above zero for ${it.symbol}.`);
  }
  const sum = items.reduce((a, b) => a + b.pct, 0);
  const base = items.map((it) => { const mass = school && SCHOOL_MASS[it.symbol] != null ? SCHOOL_MASS[it.symbol] : BY_SYMBOL.get(it.symbol)!.weight; return { symbol: it.symbol, pct: it.pct, mass, mol: it.pct / mass }; });
  const min = Math.min(...base.map((b) => b.mol));
  const ratios = base.map((b) => b.mol / min);
  let factor = 0;
  for (let k = 1; k <= 6 && !factor; k++) if (ratios.every((r) => Math.abs(r * k - Math.round(r * k)) <= 0.1 * Math.max(1, k / 2))) factor = k;
  if (!factor) throw new Error('These percentages do not give a simple whole-number ratio. Check them.');
  const rows = base.map((b, i) => ({ ...b, ratio: ratios[i], whole: Math.round(ratios[i] * factor) }));
  const formula = rows.map((r) => r.symbol + (r.whole === 1 ? '' : r.whole)).join('');
  return { rows, factor, formula, M: rows.reduce((a, r) => a + r.mass * r.whole, 0), sum };
}

/** Molecular formula: the empirical formula times n = molar mass ÷ empirical formula mass (rounded). */
export function molecular(emp: { rows: EmpRow[]; M: number }, M: number): { n: number; formula: string } {
  if (!(M > 0)) throw new Error('Molar mass must be above zero.');
  const n = Math.round(M / emp.M);
  if (n < 1 || Math.abs(M / emp.M - n) > 0.05 * n) throw new Error(`${M} g/mol is not a whole-number multiple of the empirical formula mass ${emp.M.toFixed(2)} g/mol.`);
  return { n, formula: emp.rows.map((r) => r.symbol + (r.whole * n === 1 ? '' : r.whole * n)).join('') };
}

export type Reaction = { id: string; a: [number, string]; b: [number, string]; p: [number, string][]; text: string };
export const REACTIONS: Reaction[] = [
  { id: 'water', a: [2, 'H2'], b: [1, 'O2'], p: [[2, 'H2O']], text: '2H₂ + O₂ → 2H₂O' },
  { id: 'ammonia', a: [1, 'N2'], b: [3, 'H2'], p: [[2, 'NH3']], text: 'N₂ + 3H₂ → 2NH₃' },
  { id: 'mgo', a: [2, 'Mg'], b: [1, 'O2'], p: [[2, 'MgO']], text: '2Mg + O₂ → 2MgO' },
  { id: 'methane', a: [1, 'CH4'], b: [2, 'O2'], p: [[1, 'CO2'], [2, 'H2O']], text: 'CH₄ + 2O₂ → CO₂ + 2H₂O' },
  { id: 'hcl', a: [1, 'H2'], b: [1, 'Cl2'], p: [[2, 'HCl']], text: 'H₂ + Cl₂ → 2HCl' },
];

/** Limiting reactant for moles of A and B: the one that would make less product. */
export function limiting(r: Reaction, molA: number, molB: number) {
  if (!(molA >= 0 && molB >= 0)) throw new Error('Amounts must be zero or more.');
  const extentA = molA / r.a[0], extentB = molB / r.b[0], extent = Math.min(extentA, extentB);
  const lim: 'a' | 'b' | 'both' = Math.abs(extentA - extentB) <= 1e-12 * Math.max(extentA, extentB, 1) ? 'both' : extentA < extentB ? 'a' : 'b';
  return { extent, lim, leftA: molA - extent * r.a[0], leftB: molB - extent * r.b[0], products: r.p.map(([c, f]) => ({ f, mol: extent * c })) };
}
