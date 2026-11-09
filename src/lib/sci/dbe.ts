// Degree of unsaturation (rings plus double bonds) from a molecular formula or a SMILES string: the formula check
// (electron parity, nitrogen rule), exact and nominal masses, the ring/π-bond combinations a value allows, and a small
// SMILES reader (organic subset, brackets, charges, isotopes, rings, branches, aromatic atoms, implicit hydrogens).
// Pure functions, no DOM.
import { parseFormula, monoMass, nominalMass, molarMass, byElement, hill, BY_SYMBOL, type Formula, FormulaError } from './chem.ts';

/** Valence used in the formula, and electrons each atom brings to the valence shell. */
export const VALENCE: Record<string, number> = { H: 1, Li: 1, Na: 1, K: 1, B: 3, Al: 3, C: 4, Si: 4, Ge: 4, Sn: 4, N: 3, P: 3, As: 3, Sb: 3, O: 2, S: 2, Se: 2, Te: 2, F: 1, Cl: 1, Br: 1, I: 1 };
const VALENCE_E: Record<string, number> = { H: 1, Li: 1, Na: 1, K: 1, B: 3, Al: 3, C: 4, Si: 4, Ge: 4, Sn: 4, N: 5, P: 5, As: 5, Sb: 5, O: 6, S: 6, Se: 6, Te: 6, F: 7, Cl: 7, Br: 7, I: 7 };
export const SUPPORTED = Object.keys(VALENCE);

export type DbeResult = {
  formula: Formula; hill: string; counts: Map<string, number>; charge: number;
  rdbe: number;                     // 1 + ½ Σ n(v − 2), charge ignored
  valenceElectrons: number;          // Σ n × valence electrons − charge
  evenElectron: boolean;
  /** Rings + π bonds for an ion: charge on a heteroatom (onium N⁺, O⁺ or an O⁻, N⁻ anion) or on carbon (carbocation, carbanion). */
  ionOnium: number; ionCarbon: number;
  mono: number; nominal: number; average: number;
  nitrogen: number; nitrogenRule: { expectOdd: boolean; ok: boolean; text: string };
  problems: string[]; notes: string[];
};

/** Rings plus double bonds from a parsed formula. `valence` overrides (e.g. { S: 6, P: 5 }). */
export function dbeOf(f: Formula, valence: Record<string, number> = {}): DbeResult {
  const counts = byElement(f);
  const bad = [...counts.keys()].filter((k) => !(k in VALENCE));
  if (bad.length) throw new FormulaError(`${bad.join(', ')} ${bad.length > 1 ? 'are' : 'is'} not covered. The degree of unsaturation is for covalent molecules made of ${SUPPORTED.filter((s) => !['Li', 'Na', 'K', 'Al'].includes(s)).join(', ')}.`);
  const v = (k: string) => valence[k] ?? VALENCE[k];
  let sum = 0, ve = 0, atoms = 0, heavy = 0;
  for (const [k, n] of counts) { sum += n * (v(k) - 2); ve += n * VALENCE_E[k]; atoms += n; if (k !== 'H') heavy += n; }
  const rdbe = 1 + sum / 2;
  const z = f.charge;
  const valenceElectrons = ve - z;
  const evenElectron = Number.isInteger(valenceElectrons / 2);
  const N = counts.get('N') ?? 0;
  const nominal = nominalMass(f);
  // Nitrogen rule: for the usual elements the mass number and the valence electrons have the same parity, except N
  // (14 and 5), so nominal mass ≡ valence electrons + charge + N (mod 2). A neutral even-electron molecule (and its
  // radical cation M⁺•) has an odd nominal mass exactly when it has an odd number of N; for a singly charged
  // even-electron ion ([M+H]⁺, [M−H]⁻) the parity flips. Isotope labels (13C, D) break the pattern.
  const ion = z !== 0;
  const labelled = [...f.counts.keys()].some((k) => /^\d/.test(k));
  const expectOdd = (N + Math.abs(z) + (evenElectron ? 0 : 1)) % 2 === 1;
  const ok = labelled || (nominal % 2 === 1) === expectOdd;
  const kind = !ion ? (evenElectron ? 'a neutral molecule' : 'a neutral radical') : evenElectron ? 'an even-electron ion' : 'a radical ion (such as M⁺•)';
  const nrText = labelled ? `Nominal mass ${nominal}. The formula has isotope labels, so the nitrogen rule does not apply directly.` : `${N} nitrogen${N === 1 ? '' : 's'} (${N % 2 ? 'odd' : 'even'}) in ${kind}${ion ? ` of charge ${z > 0 ? '+' : '−'}${Math.abs(z)}` : ''}: the nominal mass is ${expectOdd ? 'odd' : 'even'} (${nominal}).`;
  const problems: string[] = [], notes: string[] = [];
  if (!counts.size) problems.push('The formula has no atoms.');
  if (!ion && !Number.isInteger(rdbe)) problems.push(`Rings plus double bonds is ${rdbe}, not a whole number: as a neutral molecule this formula has an odd number of electrons (a radical). Check the hydrogen count.`);
  if (!ion && rdbe < 0) problems.push(`Rings plus double bonds is ${rdbe}: too many hydrogens or halogens for the other atoms to hold.`);
  if (ion && Math.max(rdbe + z / 2, rdbe - Math.abs(z) / 2) < 0) problems.push(`Rings plus double bonds is ${rdbe}, below zero even for an ion: too many hydrogens or halogens.`);
  if (heavy === 0 && atoms > 2) problems.push('Only hydrogen: H₂ is the only neutral molecule.');
  if (ion && !evenElectron) notes.push('An odd number of electrons: a radical ion, as made by electron ionisation (M⁺•). Its rings plus double bonds are the value shown.');
  if (ion && evenElectron) notes.push(`An even-electron ion, such as [M+H]⁺ or [M−H]⁻${Number.isInteger(rdbe) ? '' : ' (the value ends in .5)'}. Its rings plus π bonds depend on where the charge sits: see the two lines below.`);
  return {
    formula: f, hill: hill(f), counts, charge: z, rdbe, valenceElectrons, evenElectron,
    ionOnium: rdbe + z / 2, ionCarbon: rdbe - Math.abs(z) / 2,
    mono: monoMass(f), nominal, average: molarMass(f), nitrogen: N, nitrogenRule: { expectOdd, ok, text: nrText }, problems, notes,
  };
}

export const dbeFromFormula = (s: string, valence: Record<string, number> = {}) => dbeOf(parseFormula(s), valence);

export type Combo = { rings: number; double: number; triple: number };
/** Ways to make d rings + π bonds: rings + double + 2 × triple = d, limited by the number of heavy atoms. */
export function combinations(d: number, heavy: number, max = 200): Combo[] {
  const out: Combo[] = [];
  if (!Number.isInteger(d) || d < 0) return out;
  const maxRings = heavy >= 3 ? heavy - 2 : 0; // a ring needs at least 3 atoms; each extra ring needs at least one more
  for (let t = 0; 2 * t <= d; t++) for (let r = Math.min(maxRings, d - 2 * t); r >= 0; r--) {
    const dbl = d - 2 * t - r;
    if (t > Math.floor(heavy / 2) || dbl + t > Math.max(0, 2 * heavy - 2)) continue;
    out.push({ rings: r, double: dbl, triple: t });
    if (out.length >= max) return out;
  }
  return out.sort((a, b) => b.rings - a.rings || a.triple - b.triple);
}

// ---------------- SMILES ----------------

export class SmilesError extends Error {}
export type SAtom = { el: string; aromatic: boolean; iso?: number; hExplicit?: number; charge: number; bracket: boolean; implicitH: number; bonds: number[] };
export type SBond = { a: number; b: number; order: 1 | 2 | 3 | 4 | 1.5 };
export type SmilesMol = { atoms: SAtom[]; bonds: SBond[]; components: number };

const ORGANIC = ['Cl', 'Br', 'B', 'C', 'N', 'O', 'P', 'S', 'F', 'I'];
const DEFAULT_VAL: Record<string, number[]> = { B: [3], C: [4], N: [3, 5], O: [2], P: [3, 5], S: [2, 4, 6], F: [1], Cl: [1], Br: [1], I: [1] };
const BOND: Record<string, 1 | 2 | 3 | 4 | 1.5> = { '-': 1, '=': 2, '#': 3, '$': 4, ':': 1.5, '/': 1, '\\': 1 };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Read a SMILES string (OpenSMILES subset: no reaction arrows; stereo marks are read and ignored). */
export function parseSmiles(input: string): SmilesMol {
  const s = input.trim();
  if (!s) throw new SmilesError('Type a SMILES string, such as c1ccccc1 for benzene.');
  if (/\s/.test(s)) throw new SmilesError('A SMILES string has no spaces. Remove anything after the first space (often a name).');
  const atoms: SAtom[] = [], bonds: SBond[] = [];
  const stack: number[] = [];
  const rings = new Map<number, { atom: number; order?: number; pos: number }>();
  let prev = -1, pending: number | undefined, dot = false, i = 0;
  const err = (msg: string) => { throw new SmilesError(`${msg} (at position ${i + 1}).`); };
  const addBond = (a: number, b: number, order?: number) => {
    if (a === b) err('An atom cannot bond to itself');
    if (bonds.some((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a))) err('Two bonds join the same pair of atoms');
    const o = (order ?? (atoms[a].aromatic && atoms[b].aromatic ? 1.5 : 1)) as SBond['order'];
    bonds.push({ a, b, order: o }); atoms[a].bonds.push(bonds.length - 1); atoms[b].bonds.push(bonds.length - 1);
  };
  const place = (atom: SAtom) => {
    atoms.push(atom);
    const k = atoms.length - 1;
    if (prev >= 0 && !dot) addBond(prev, k, pending);
    else if (pending !== undefined) err('A bond symbol has no atom before it');
    prev = k; pending = undefined; dot = false;
  };
  while (i < s.length) {
    const c = s[i];
    if (c === '[') {
      const end = s.indexOf(']', i);
      if (end < 0) err('A "[" is never closed');
      const m = /^(\d+)?([A-Z][a-z]?|se|as|[bcnops]|\*)(@@|@(?:TH|AL|SP|TB|OH)?\d*)?(H\d*)?((?:\+\d+|-\d+|\++|-+))?(?::\d+)?$/.exec(s.slice(i + 1, end));
      if (!m) err(`"[${s.slice(i + 1, end)}]" is not a bracket atom this reader understands`);
      const aromatic = /^[a-z]/.test(m![2]);
      const el = m![2] === '*' ? '*' : aromatic ? cap(m![2]) : m![2];
      if (el === '*') err('Wildcard atoms (*) have no formula');
      if (!BY_SYMBOL.has(el)) err(`"${el}" is not an element`);
      let charge = 0;
      const cs = m![5];
      if (cs) charge = /^[+-]\d+$/.test(cs) ? Number(cs) : (cs[0] === '+' ? 1 : -1) * cs.length;
      place({ el, aromatic, iso: m![1] ? Number(m![1]) : undefined, hExplicit: m![4] ? (m![4].length > 1 ? Number(m![4].slice(1)) : 1) : 0, charge, bracket: true, implicitH: 0, bonds: [] });
      i = end + 1; continue;
    }
    const org = ORGANIC.find((o) => s.startsWith(o, i));
    if (org) { place({ el: org, aromatic: false, charge: 0, bracket: false, implicitH: 0, bonds: [] }); i += org.length; continue; }
    if ('bcnops'.includes(c)) { place({ el: c.toUpperCase(), aromatic: true, charge: 0, bracket: false, implicitH: 0, bonds: [] }); i++; continue; }
    if (c in BOND) { if (pending !== undefined) err('Two bond symbols in a row'); pending = BOND[c]; i++; continue; }
    if (c === '(') { if (prev < 0) err('A branch "(" needs an atom before it'); stack.push(prev); i++; continue; }
    if (c === ')') { if (!stack.length) err('A ")" has no matching "("'); if (pending !== undefined) err('A bond symbol before ")" has no atom after it'); prev = stack.pop()!; i++; continue; }
    if (c === '.') { if (pending !== undefined) err('A bond symbol before "." has no atom after it'); dot = true; i++; continue; }
    if (/\d|%/.test(c)) {
      let n: number;
      if (c === '%') { const m = /^%(\d\d)/.exec(s.slice(i)); if (!m) err('A "%" ring number needs two digits, such as %10'); n = Number(m![1]); i += 3; } else { n = Number(c); i++; }
      if (prev < 0) err('A ring number needs an atom before it');
      const open = rings.get(n);
      if (open) {
        if (open.order !== undefined && pending !== undefined && open.order !== pending) err(`Ring ${n} has two different bond symbols`);
        addBond(open.atom, prev, pending ?? open.order); rings.delete(n);
      } else rings.set(n, { atom: prev, order: pending, pos: i });
      pending = undefined; continue;
    }
    if (c === 'H') err('SMILES adds hydrogens by itself (C is methane); write H only inside brackets, such as [H] or [CH4]');
    err(`"${c}" is not allowed in SMILES here`);
  }
  if (pending !== undefined) err('The string ends with a bond symbol');
  if (stack.length) { i = s.length - 1; err('A "(" branch is never closed'); }
  if (rings.size) throw new SmilesError(`Ring number${rings.size > 1 ? 's' : ''} ${[...rings.keys()].join(', ')} ${rings.size > 1 ? 'are' : 'is'} opened but never closed.`);
  // Implicit hydrogens for atoms outside brackets: the lowest normal valence that fits the bonds. An aromatic atom
  // uses its lowest valence and keeps one for its share of the π system (benzene c: one H; pyridine n and the
  // three-bonded n of caffeine: none). Pyrrole-type N-H must be written [nH].
  for (const [k, a] of atoms.entries()) {
    if (a.bracket) { a.implicitH = a.hExplicit ?? 0; continue; }
    const sum = a.bonds.reduce((t, b) => t + (bonds[b].order === 1.5 ? 1 : bonds[b].order), 0);
    const vals = DEFAULT_VAL[a.el];
    if (sum > vals[vals.length - 1]) throw new SmilesError(`${a.el} atom ${k + 1} has ${sum} bonds, more than ${a.el} normally makes (${vals.join(' or ')}). Use brackets for a charged or unusual atom, such as [N+].`);
    a.implicitH = a.aromatic ? Math.max(0, vals[0] - sum - 1) : vals.find((x) => x >= sum)! - sum;
  }
  // Connected parts (union-find)
  const par = atoms.map((_, k) => k);
  const find = (x: number): number => (par[x] === x ? x : (par[x] = find(par[x])));
  for (const b of bonds) par[find(b.a)] = find(b.b);
  const components = new Set(atoms.map((_, k) => find(k))).size;
  return { atoms, bonds, components };
}

/** Molecular formula of a SMILES molecule (isotope-labelled atoms keep their label). */
export function smilesFormula(m: SmilesMol): Formula {
  const counts = new Map<string, number>();
  const add = (k: string, n: number) => { if (n) counts.set(k, (counts.get(k) ?? 0) + n); };
  for (const a of m.atoms) { add(a.iso ? `${a.iso}${a.el}` : a.el, 1); add('H', a.implicitH); }
  return { counts, charge: m.atoms.reduce((t, a) => t + a.charge, 0) };
}

export type SmilesSummary = {
  formula: Formula; atoms: number; heavy: number; bonds: number; rings: number; components: number;
  double: number; triple: number; aromaticAtoms: number; aromaticBonds: number; charge: number;
};
/** Ring count (bonds − atoms + parts, among heavy atoms) and the bonds written in the string. */
export function smilesSummary(m: SmilesMol): SmilesSummary {
  const heavyIdx = m.atoms.map((a, k) => (a.el === 'H' ? -1 : k)).filter((k) => k >= 0);
  const heavyBonds = m.bonds.filter((b) => m.atoms[b.a].el !== 'H' && m.atoms[b.b].el !== 'H');
  const par = new Map(heavyIdx.map((k) => [k, k]));
  const find = (x: number): number => (par.get(x) === x ? x : (par.set(x, find(par.get(x)!)), par.get(x)!));
  for (const b of heavyBonds) par.set(find(b.a), find(b.b));
  const parts = new Set(heavyIdx.map(find)).size;
  return {
    formula: smilesFormula(m), atoms: m.atoms.length + m.atoms.reduce((t, a) => t + a.implicitH, 0), heavy: heavyIdx.length,
    bonds: m.bonds.length, rings: heavyBonds.length - heavyIdx.length + parts, components: m.components,
    double: m.bonds.filter((b) => b.order === 2).length, triple: m.bonds.filter((b) => b.order === 3).length,
    aromaticAtoms: m.atoms.filter((a) => a.aromatic).length, aromaticBonds: m.bonds.filter((b) => b.order === 1.5).length,
    charge: m.atoms.reduce((t, a) => t + a.charge, 0),
  };
}

export const EXAMPLES: { name: string; formula: string; smiles: string }[] = [
  { name: 'Caffeine', formula: 'C8H10N4O2', smiles: 'Cn1cnc2c1c(=O)n(C)c(=O)n2C' },
  { name: 'Aspirin', formula: 'C9H8O4', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
  { name: 'Benzonitrile', formula: 'C7H5N', smiles: 'N#Cc1ccccc1' },
  { name: 'Chloroform', formula: 'CHCl3', smiles: 'ClC(Cl)Cl' },
  { name: 'Cyclohexene', formula: 'C6H10', smiles: 'C1CCC=CC1' },
  { name: 'Pyridinium ion', formula: 'C5H6N+', smiles: 'c1cc[nH+]cc1' },
];
