// Periodic table facts: position (group, period, block), ground-state electron configurations by the Aufbau
// (Madelung) rule with the known exceptions, noble-gas notation, ion configurations, unpaired electrons, common
// oxidation states, Pauling electronegativity and first ionisation energy. Pure functions, no DOM.
// Names, symbols and standard atomic weights come from elements.ts (IUPAC/CIAAW). Electronegativity, ionisation
// energies and oxidation states are general textbook facts, rounded: see the notes by each list.
import { ELEMENTS } from './chem.ts';

export const NOBLE = [2, 10, 18, 36, 54, 86, 118];
const L = 'spdfghi';

export type Subshell = { n: number; l: number; e: number };
/** Subshells in Madelung order: by n + l, then by n. */
export const MADELUNG: { n: number; l: number }[] = (() => {
  const out: { n: number; l: number }[] = [];
  for (let n = 1; n <= 8; n++) for (let l = 0; l < Math.min(n, 4); l++) out.push({ n, l });
  return out.sort((a, b) => a.n + a.l - (b.n + b.l) || a.n - b.n);
})();
export const cap = (l: number) => 2 * (2 * l + 1);
export const label = (s: { n: number; l: number }) => `${s.n}${L[s.l]}`;

/** Configuration by the Aufbau rule alone, for any number of electrons. */
export function aufbau(electrons: number): Subshell[] {
  const out: Subshell[] = [];
  let left = electrons;
  for (const s of MADELUNG) { if (left <= 0) break; const e = Math.min(left, cap(s.l)); out.push({ ...s, e }); left -= e; }
  return out;
}

/** Ground-state configurations of neutral atoms that differ from the Aufbau rule: subshell counts that change.
 *  Z ≤ 103 are the measured ground states (as in the NIST Atomic Spectra Database); heavier atoms are not listed
 *  because predictions disagree, so the Aufbau result is shown and marked as predicted. */
export const EXCEPTIONS: Record<number, Record<string, number>> = {
  24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 },
  41: { '5s': 1, '4d': 4 }, 42: { '5s': 1, '4d': 5 }, 44: { '5s': 1, '4d': 7 }, 45: { '5s': 1, '4d': 8 }, 46: { '5s': 0, '4d': 10 }, 47: { '5s': 1, '4d': 10 },
  57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '6s': 1, '5d': 9 }, 79: { '6s': 1, '5d': 10 },
  89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 },
  103: { '6d': 0, '7p': 1 },
};

const byNL = (a: Subshell, b: Subshell) => a.n - b.n || a.l - b.l;
const madIndex = (s: { n: number; l: number }) => MADELUNG.findIndex((m) => m.n === s.n && m.l === s.l);
const byFill = (a: Subshell, b: Subshell) => madIndex(a) - madIndex(b);

/** Ground-state configuration of the neutral atom (exceptions applied), subshells in n, l order. */
export function configuration(z: number): Subshell[] {
  const map = new Map(aufbau(z).map((s) => [label(s), s]));
  for (const [k, e] of Object.entries(EXCEPTIONS[z] ?? {})) {
    const n = Number(k[0]), l = L.indexOf(k[1]);
    if (e === 0) map.delete(k); else map.set(k, { n, l, e });
  }
  return [...map.values()].sort(byNL);
}

/** Electrons the neutral atom puts in each subshell beyond the Aufbau rule, or null if it follows the rule. */
export const isException = (z: number) => z in EXCEPTIONS;

/** Text such as "1s2 2s2 2p6" (sup = superscript digits). Order 'shell' (n then l) or 'fill' (Madelung). */
export function configText(c: Subshell[], opts: { sup?: boolean; order?: 'shell' | 'fill' } = {}): string {
  const s = [...c].sort(opts.order === 'fill' ? byFill : byNL);
  const num = (e: number) => (opts.sup ? String(e).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]) : String(e));
  return s.map((x) => label(x) + num(x.e)).join(' ');
}

/** The noble gas below an electron count (0 if none). */
export const coreOf = (electrons: number, orEqual = false) => [...NOBLE].reverse().find((n) => n < electrons || (orEqual && n === electrons)) ?? 0;

/** Noble-gas notation: the core and the subshells outside it. With `ion`, a configuration that is exactly a noble
 *  gas's is written as that gas ("[Xe]" for Ce⁴⁺); a neutral noble gas is written on the gas before it. */
export function nobleGas(c: Subshell[], opts: { sup?: boolean; order?: 'shell' | 'fill'; ion?: boolean } = {}): string {
  const total = c.reduce((a, s) => a + s.e, 0);
  let core = coreOf(total, opts.ion);
  if (core === total && configText(aufbau(core)) !== configText(c)) core = coreOf(total);
  if (!core) return configText(c, opts);
  const coreCfg = new Map(aufbau(core).map((s) => [label(s), s.e]));
  const rest = c.map((s) => ({ ...s, e: s.e - (coreCfg.get(label(s)) ?? 0) })).filter((s) => s.e > 0);
  const sym = ELEMENTS[core - 1].symbol;
  return `[${sym}]` + (rest.length ? ' ' + configText(rest, opts) : '');
}

/** Configuration of an ion. Electrons are removed from the highest n first (and the highest l within it), so a
 *  transition metal loses its s electrons before d; added electrons go into the next Aufbau subshells. */
export function ionConfiguration(z: number, charge: number): { config: Subshell[]; intoCore: boolean } {
  const electrons = z - charge;
  if (electrons < 0) throw new Error('More electrons removed than the atom has.');
  let c = configuration(z).map((s) => ({ ...s }));
  let intoCore = false;
  if (charge > 0) {
    // Electrons outside the noble-gas core go first (highest n, then highest l); only then the core itself.
    const coreCfg = new Map(aufbau(coreOf(z)).map((s) => [label(s), s.e]));
    const outside = (s: Subshell) => s.e - (coreCfg.get(label(s)) ?? 0);
    const order = (a: Subshell, b: Subshell) => b.n - a.n || b.l - a.l;
    for (let k = 0; k < charge; k++) {
      const val = c.filter((s) => outside(s) > 0).sort(order);
      if (val.length) { val[0].e--; continue; }
      intoCore = true;
      c.filter((s) => s.e > 0).sort(order)[0].e--;
    }
    c = c.filter((s) => s.e > 0);
  } else if (charge < 0) {
    let add = -charge;
    for (const m of MADELUNG) {
      if (!add) break;
      let s = c.find((x) => x.n === m.n && x.l === m.l);
      if (!s) { s = { ...m, e: 0 }; c.push(s); }
      const room = cap(m.l) - s.e, put = Math.min(room, add);
      s.e += put; add -= put;
    }
    c = c.filter((s) => s.e > 0).sort(byNL);
  }
  return { config: c, intoCore };
}

/** Unpaired electrons by Hund's rule (each subshell filled singly first). */
export const unpaired = (c: Subshell[]) => c.reduce((a, s) => { const m = 2 * s.l + 1; return a + (s.e <= m ? s.e : 2 * m - s.e); }, 0);

/** Period (row) of an element. */
export const periodOf = (z: number) => NOBLE.findIndex((n) => z <= n) + 1;

/** IUPAC group 1–18, or null for the f-block (La–Yb, Ac–No). This table puts Lu and Lr in group 3. */
export function groupOf(z: number): number | null {
  if (z === 1) return 1;
  if (z === 2) return 18;
  const p = periodOf(z), pos = z - NOBLE[p - 2];
  if (p <= 3) return pos <= 2 ? pos : pos + 10;
  if (p <= 5) return pos;
  if (pos <= 2) return pos;
  if (pos <= 16) return null;
  return pos - 14;
}

/** Block from the last subshell filled by the Aufbau rule (helium: s, though it sits in group 18). */
export function blockOf(z: number): 's' | 'p' | 'd' | 'f' {
  const a = aufbau(z);
  return L[a[a.length - 1].l] as 's' | 'p' | 'd' | 'f';
}

/** Where an element sits on the drawn table: row 1–7 for the main table, 9 and 10 for the f-block rows; column 1–18
 *  (f-block rows use columns 3–16). */
export function cellOf(z: number): { row: number; col: number } {
  const g = groupOf(z), p = periodOf(z);
  if (g !== null) return { row: p, col: g };
  const pos = z - NOBLE[p - 2]; // 3..16
  return { row: p + 3, col: pos };
}

export type Category = 'alkali metal' | 'alkaline earth metal' | 'transition metal' | 'lanthanoid' | 'actinoid' | 'post-transition metal' | 'metalloid' | 'reactive nonmetal' | 'halogen' | 'noble gas' | 'superheavy (little known)';
export const CATEGORIES: Category[] = ['alkali metal', 'alkaline earth metal', 'transition metal', 'lanthanoid', 'actinoid', 'post-transition metal', 'metalloid', 'reactive nonmetal', 'halogen', 'noble gas', 'superheavy (little known)'];
const METALLOID = new Set([5, 14, 32, 33, 51, 52]);
const NONMETAL = new Set([1, 6, 7, 8, 15, 16, 34]);
const HALOGEN = new Set([9, 17, 35, 53, 85]);
/** The usual textbook grouping. Borderline cases differ between books (polonium, astatine, the metalloid list). */
export function categoryOf(z: number): Category {
  if (z >= 57 && z <= 71) return 'lanthanoid';
  if (z >= 89 && z <= 103) return 'actinoid';
  if (z >= 104) return 'superheavy (little known)';
  if (NOBLE.includes(z)) return 'noble gas';
  if (HALOGEN.has(z)) return 'halogen';
  if (NONMETAL.has(z)) return 'reactive nonmetal';
  if (METALLOID.has(z)) return 'metalloid';
  const g = groupOf(z)!;
  if (g === 1) return 'alkali metal';
  if (g === 2) return 'alkaline earth metal';
  if (g >= 3 && g <= 12) return 'transition metal';
  return 'post-transition metal';
}

/** Pauling electronegativity (Allred's 1961 update of Pauling's scale, the values most textbooks print), rounded.
 *  NaN where no value is generally given (He, Ne, Ar and the heaviest elements). */
export const PAULING: number[] = [
  2.20, NaN, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, NaN,
  0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, NaN,
  0.82, 1.00, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.00,
  0.82, 0.95, 1.22, 1.33, 1.6, 2.16, 1.9, 2.2, 2.28, 2.20, 1.93, 1.69, 1.78, 1.96, 2.05, 2.1, 2.66, 2.6,
  0.79, 0.89, 1.10, 1.12, 1.13, 1.14, 1.13, 1.17, 1.2, 1.20, 1.1, 1.22, 1.23, 1.24, 1.25, 1.1, 1.27,
  1.3, 1.5, 2.36, 1.9, 2.2, 2.20, 2.28, 2.54, 2.00, 1.62, 2.33, 2.02, 2.0, 2.2, 2.2,
  0.7, 0.9, 1.1, 1.3, 1.5, 1.38, 1.36, 1.28, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3,
  ...Array(15).fill(NaN),
];

/** First ionisation energy in eV, rounded to 0.01 eV, from the NIST Atomic Spectra Database (measured or evaluated
 *  values). NaN from rutherfordium on, where only calculations exist. */
export const IE1: number[] = [
  13.6, 24.59, 5.39, 9.32, 8.3, 11.26, 14.53, 13.62, 17.42, 21.56, 5.14, 7.65, 5.99, 8.15, 10.49, 10.36, 12.97, 15.76,
  4.34, 6.11, 6.56, 6.83, 6.75, 6.77, 7.43, 7.9, 7.88, 7.64, 7.73, 9.39, 6, 7.9, 9.79, 9.75, 11.81, 14,
  4.18, 5.69, 6.22, 6.63, 6.76, 7.09, 7.12, 7.36, 7.46, 8.34, 7.58, 8.99, 5.79, 7.34, 8.61, 9.01, 10.45, 12.13,
  3.89, 5.21, 5.58, 5.54, 5.47, 5.53, 5.58, 5.64, 5.67, 6.15, 5.86, 5.94, 6.02, 6.11, 6.18, 6.25, 5.43,
  6.83, 7.55, 7.86, 7.83, 8.44, 8.97, 8.96, 9.23, 10.44, 6.11, 7.42, 7.29, 8.42, 9.32, 10.75,
  4.07, 5.28, 5.38, 6.31, 5.89, 6.19, 6.27, 6.03, 5.97, 5.99, 6.2, 6.28, 6.37, 6.5, 6.58, 6.63, 4.96,
  ...Array(15).fill(NaN),
];

/** Common oxidation states, as textbooks list them (many elements reach others in rarer compounds). */
export const OXIDATION: number[][] = [
  [-1, 1], [], [1], [2], [3], [-4, 2, 4], [-3, 3, 5], [-2], [-1], [],
  [1], [2], [3], [-4, 4], [-3, 3, 5], [-2, 4, 6], [-1, 1, 3, 5, 7], [],
  [1], [2], [3], [2, 3, 4], [2, 3, 4, 5], [2, 3, 6], [2, 3, 4, 6, 7], [2, 3], [2, 3], [2], [1, 2], [2], [3], [2, 4], [-3, 3, 5], [-2, 4, 6], [-1, 1, 3, 5], [2],
  [1], [2], [3], [4], [3, 5], [4, 6], [4, 7], [3, 4], [3], [2, 4], [1], [2], [1, 3], [2, 4], [-3, 3, 5], [-2, 4, 6], [-1, 1, 3, 5, 7], [2, 4, 6],
  [1], [2], [3], [3, 4], [3], [3], [3], [2, 3], [2, 3], [3], [3, 4], [3], [3], [3], [3], [2, 3], [3],
  [4], [5], [4, 6], [4, 7], [4, 8], [3, 4], [2, 4], [1, 3], [1, 2], [1, 3], [2, 4], [3, 5], [2, 4], [-1, 1], [],
  [1], [2], [3], [4], [5], [3, 4, 5, 6], [3, 4, 5, 6], [3, 4, 5, 6], [3], [3], [3, 4], [3], [3], [3], [2, 3], [2, 3], [3],
  [4], [5], [6], [7], [8], [], [], [], [], [], [], [], [], [], [],
];

export type ElementInfo = {
  z: number; symbol: string; name: string; weight: number; radioactive: boolean;
  group: number | null; period: number; block: 's' | 'p' | 'd' | 'f'; category: Category;
  config: Subshell[]; exception: boolean; predicted: boolean; unpaired: number;
  en: number; ie: number; oxidation: number[];
};

export const TABLE: ElementInfo[] = ELEMENTS.map((e) => {
  const config = configuration(e.z);
  return {
    z: e.z, symbol: e.symbol, name: e.name, weight: e.weight, radioactive: e.radioactive,
    group: groupOf(e.z), period: periodOf(e.z), block: blockOf(e.z), category: categoryOf(e.z),
    config, exception: isException(e.z), predicted: e.z >= 104, unpaired: unpaired(config),
    en: PAULING[e.z - 1], ie: IE1[e.z - 1], oxidation: OXIDATION[e.z - 1],
  };
});

/** Find an element by atomic number, symbol or name (any case). */
export function findElement(q: string): ElementInfo | undefined {
  const s = q.trim();
  if (!s) return undefined;
  if (/^\d+$/.test(s)) return TABLE[Number(s) - 1];
  const low = s.toLowerCase();
  const alias: Record<string, string> = { aluminum: 'aluminium', cesium: 'caesium', sulphur: 'sulfur' };
  return TABLE.find((e) => e.symbol.toLowerCase() === low) ?? TABLE.find((e) => e.name.toLowerCase() === (alias[low] ?? low));
}

export const oxText = (o: number[]) => (o.length ? o.map((x) => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : '0')).join(', ') : 'none common');
export const weightText = (e: { weight: number; radioactive: boolean }) => (e.radioactive ? `[${e.weight}]` : String(e.weight));

export type Property = { id: string; name: string; kind: 'number' | 'category'; unit?: string; get: (e: ElementInfo) => number | string };
export const PROPERTIES: Property[] = [
  { id: 'category', name: 'Category', kind: 'category', get: (e) => e.category },
  { id: 'block', name: 'Block (s, p, d, f)', kind: 'category', get: (e) => e.block },
  { id: 'en', name: 'Electronegativity (Pauling)', kind: 'number', get: (e) => e.en },
  { id: 'ie', name: 'First ionisation energy', kind: 'number', unit: 'eV', get: (e) => e.ie },
  { id: 'weight', name: 'Atomic weight', kind: 'number', unit: 'g/mol', get: (e) => e.weight },
  { id: 'unpaired', name: 'Unpaired electrons (atom)', kind: 'number', get: (e) => e.unpaired },
  { id: 'maxox', name: 'Highest common oxidation state', kind: 'number', get: (e) => (e.oxidation.length ? Math.max(...e.oxidation) : NaN) },
];

/** One row per element for a CSV. */
export function csvRows(): (string | number)[][] {
  return [
    ['Z', 'symbol', 'name', 'atomic_weight', 'radioactive_mass_number', 'group', 'period', 'block', 'category', 'configuration', 'noble_gas_notation', 'aufbau_exception', 'unpaired_electrons', 'common_oxidation_states', 'pauling_electronegativity', 'first_ionisation_energy_eV'],
    ...TABLE.map((e) => [e.z, e.symbol, e.name, e.weight, e.radioactive ? 'yes' : 'no', e.group ?? '', e.period, e.block, e.category, configText(e.config), nobleGas(e.config), e.exception ? 'yes' : e.predicted ? 'predicted' : 'no', e.unpaired, e.oxidation.join(' '), Number.isFinite(e.en) ? e.en : '', Number.isFinite(e.ie) ? e.ie : '']),
  ];
}
