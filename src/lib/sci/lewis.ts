// Lewis structures for small molecules and ions: count valence electrons, put bonds on a skeleton, place lone
// pairs, work out formal charges, check octets and find the resonance forms. Plain maths, no DOM.
// Used by the #1102 Lewis structure tool.

export const VALENCE: Record<string, number> = { H: 1, He: 2, Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8, Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8, Se: 6, Br: 7, Kr: 8, I: 7, Xe: 8 };
// Pauling electronegativities (general chemistry facts), used to put negative formal charge on the atom that
// holds electrons best and to fill outer atoms first.
export const EN: Record<string, number> = { H: 2.2, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.9, P: 2.19, S: 2.58, Cl: 3.16, Se: 2.55, Br: 2.96, Kr: 3.0, I: 2.66, Xe: 2.6 };
/** Atoms that may stop short of 8 electrons (electron-deficient): B, Be, Al. */
export const SHORT_OK = new Set(['Be', 'B', 'Al']);
/** Period 2 atoms never hold more than 8; from period 3 down they can (expanded octet). */
export const PERIOD2 = new Set(['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne']);

export type Atom = { el: string; x: number; y: number };
export type Mol = { id: string; name: string; atoms: Atom[]; bonds: [number, number][]; charge: number; note?: string };
export type Eval = {
  valence: number;          // total valence electrons
  orders: number[];
  lone: number[];           // lone (non-bonding) electrons on each atom
  fc: number[];             // formal charge on each atom
  shell: number[];          // electrons around each atom (bonding pairs × 2 + lone)
  left: number;             // electrons not placed (should be 0)
  problems: string[];       // octet problems, one line each
  ok: boolean;              // every rule met (octets, no electrons left over, none missing)
  sumFC: number;            // Σ|formal charge|
  enScore: number;          // Σ formal charge × electronegativity (lower is better: minus on electronegative atoms)
  expanded: boolean;        // some atom has more than 8
};

export const totalValence = (m: Mol) => m.atoms.reduce((s, a) => s + VALENCE[a.el], 0) - m.charge;
const target = (el: string) => (el === 'H' || el === 'He' || el === 'Li' ? 2 : 8);

/** Place lone pairs for given bond orders and work out formal charges and octets. */
export function evaluate(m: Mol, orders: number[]): Eval {
  const n = m.atoms.length, V = totalValence(m);
  const bondE = new Array(n).fill(0);
  m.bonds.forEach(([a, b], k) => { bondE[a] += 2 * orders[k]; bondE[b] += 2 * orders[k]; });
  let left = V - orders.reduce((s, o) => s + 2 * o, 0);
  const lone = new Array(n).fill(0);
  const degree = new Array(n).fill(0); m.bonds.forEach(([a, b]) => { degree[a]++; degree[b]++; });
  const byEN = (list: number[]) => list.sort((a, b) => (EN[m.atoms[b].el] ?? 2) - (EN[m.atoms[a].el] ?? 2) || a - b);
  const outer = byEN([...Array(n).keys()].filter((i) => degree[i] <= 1)), inner = byEN([...Array(n).keys()].filter((i) => degree[i] > 1));
  // Fill outer atoms to their octet first, then the inner ones; whole pairs, plus one single electron if odd.
  for (const group of [outer, inner]) for (const i of group) {
    const need = Math.max(0, target(m.atoms[i].el) - bondE[i]);
    const g = Math.max(0, Math.min(need, left));
    lone[i] += g; left -= g;
  }
  // Electrons still left go to inner atoms that can hold more than 8 (period 3 and below), then any atom that can.
  if (left > 0) for (const i of [...inner, ...outer]) {
    if (PERIOD2.has(m.atoms[i].el)) continue;
    lone[i] += left; left = 0; break;
  }
  const shell = bondE.map((b, i) => b + lone[i]);
  const fc = m.atoms.map((a, i) => VALENCE[a.el] - lone[i] - bondE[i] / 2);
  const problems: string[] = [];
  let odd = 0;
  m.atoms.forEach((a, i) => {
    const t = target(a.el), s = shell[i];
    if (s > t && PERIOD2.has(a.el)) problems.push(`${a.el}${n > 1 ? ` (atom ${i + 1})` : ''} has ${s} electrons: more than ${t} is impossible for a period 2 atom.`);
    if (s < t) {
      if (s === t - 1 && V % 2 === 1 && odd === 0) { odd++; return; }
      if (SHORT_OK.has(a.el)) return;
      problems.push(`${a.el} (atom ${i + 1}) has only ${s} electrons; it needs ${t}.`);
    }
  });
  if (left > 0) problems.push(`${left} electrons are left over with nowhere to go.`);
  if (left < 0) problems.push(`The bonds use ${-left} more electrons than the molecule has.`);
  const sumFC = fc.reduce((s, f) => s + Math.abs(f), 0);
  const enScore = Math.round(fc.reduce((s, f, i) => s + f * (EN[m.atoms[i].el] ?? 2), 0) * 1000) / 1000;
  const expanded = shell.some((s, i) => s > target(m.atoms[i].el));
  return { valence: V, orders: orders.slice(), lone, fc, shell, left, problems, ok: problems.length === 0, sumFC, enScore, expanded };
}

/** Every allowed set of bond orders (1 to 3; bonds to H stay single). */
function* orderSets(m: Mol): Generator<number[]> {
  const k = m.bonds.length, max = m.bonds.map(([a, b]) => (['H', 'Li'].includes(m.atoms[a].el) || ['H', 'Li'].includes(m.atoms[b].el) ? 1 : 3));
  const o = new Array(k).fill(1);
  for (;;) {
    yield o.slice();
    let i = 0;
    while (i < k && o[i] === max[i]) { o[i] = 1; i++; }
    if (i === k) return;
    o[i]++;
  }
}

export type Solution = { forms: Eval[]; others: Eval[]; valence: number; resonance: boolean };

/**
 * The best Lewis structure(s): every rule met, smallest total formal charge, then minus charges on the more
 * electronegative atoms. Forms with the same total formal charge on the same kinds of atoms are the resonance forms.
 * With `expand` false, a period 3 atom only gets more than 8 electrons when the skeleton forces it (PCl₅, SF₆,
 * XeF₂); with `expand` true, double bonds to it may also be used to lower formal charges (the expanded octet view).
 */
export function solve(m: Mol, expand = false): Solution {
  const V = totalValence(m);
  const valid: Eval[] = [];
  for (const o of orderSets(m)) {
    if (o.reduce((s, x) => s + 2 * x, 0) > V) continue;
    const e = evaluate(m, o);
    if (!e.ok) continue;
    if (!expand && e.expanded) {
      // Only allowed when every bond on the expanded atom is single (the skeleton forces it).
      const bad = e.shell.some((s, i) => s > 8 && m.bonds.some(([a, b], k) => (a === i || b === i) && o[k] > 1));
      if (bad) continue;
    }
    valid.push(e);
  }
  valid.sort((a, b) => a.sumFC - b.sumFC || a.enScore - b.enScore || b.orders.reduce((s, x) => s + x, 0) - a.orders.reduce((s, x) => s + x, 0));
  if (!valid.length) return { forms: [], others: [], valence: V, resonance: false };
  // Resonance forms: the same smallest total formal charge, placed on the same kinds of atoms (equal score).
  const b0 = valid[0];
  const forms = valid.filter((e) => e.sumFC === b0.sumFC && Math.abs(e.enScore - b0.enScore) < 1e-6);
  // Other octet-obeying forms: minor contributors with more, or worse placed, formal charge.
  const others = valid.filter((e) => !forms.includes(e)).slice(0, 6);
  return { forms, others, valence: V, resonance: forms.length > 1 };
}

/** Bond order of each bond averaged over the resonance forms (e.g. 4/3 for N–O in nitrate). */
export function averageOrders(forms: Eval[]) {
  if (!forms.length) return [];
  return forms[0].orders.map((_, k) => forms.reduce((s, f) => s + f.orders[k], 0) / forms.length);
}

// Skeleton builder for AXₙ: central atom in the middle, outer atoms round it.
export function star(id: string, name: string, centre: string, outer: string[], charge = 0): Mol {
  const n = outer.length;
  const atoms: Atom[] = [{ el: centre, x: 0, y: 0 }];
  const start = n === 2 ? 0 : n === 3 ? 90 : n === 4 ? 0 : 90;
  outer.forEach((el, i) => { const a = ((start + (360 * i) / n) * Math.PI) / 180; atoms.push({ el, x: Math.round(Math.cos(a) * 1000) / 1000, y: Math.round(-Math.sin(a) * 1000) / 1000 }); });
  if (n === 2) { atoms[1].x = -1; atoms[1].y = 0; atoms[2].x = 1; atoms[2].y = 0; }
  return { id, name, atoms, bonds: outer.map((_, i) => [0, i + 1] as [number, number]), charge };
}
const chain = (id: string, name: string, atoms: [string, number, number][], bonds: [number, number][], charge = 0, note?: string): Mol => ({ id, name, atoms: atoms.map(([el, x, y]) => ({ el, x, y })), bonds, charge, note });

export const EXAMPLES: Mol[] = [
  chain('h2', 'H₂', [['H', -0.5, 0], ['H', 0.5, 0]], [[0, 1]]),
  chain('cl2', 'Cl₂', [['Cl', -0.5, 0], ['Cl', 0.5, 0]], [[0, 1]]),
  chain('o2', 'O₂', [['O', -0.5, 0], ['O', 0.5, 0]], [[0, 1]], 0, 'The Lewis structure pairs every electron, but O₂ is attracted by a magnet: it has two unpaired electrons. Molecular orbital theory explains this.'),
  chain('n2', 'N₂', [['N', -0.5, 0], ['N', 0.5, 0]], [[0, 1]]),
  chain('hcl', 'HCl', [['H', -0.5, 0], ['Cl', 0.5, 0]], [[0, 1]]),
  star('h2o', 'H₂O', 'O', ['H', 'H']),
  star('nh3', 'NH₃', 'N', ['H', 'H', 'H']),
  star('ch4', 'CH₄', 'C', ['H', 'H', 'H', 'H']),
  star('co2', 'CO₂', 'C', ['O', 'O']),
  chain('hcn', 'HCN', [['H', -1, 0], ['C', 0, 0], ['N', 1, 0]], [[0, 1], [1, 2]]),
  chain('co', 'CO', [['C', -0.5, 0], ['O', 0.5, 0]], [[0, 1]]),
  chain('ch2o', 'CH₂O (methanal)', [['C', 0, 0], ['O', 1, 0], ['H', -0.6, -0.8], ['H', -0.6, 0.8]], [[0, 1], [0, 2], [0, 3]]),
  chain('c2h4', 'C₂H₄ (ethene)', [['C', -0.5, 0], ['C', 0.5, 0], ['H', -1.1, -0.8], ['H', -1.1, 0.8], ['H', 1.1, -0.8], ['H', 1.1, 0.8]], [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]]),
  chain('c2h2', 'C₂H₂ (ethyne)', [['H', -1.5, 0], ['C', -0.5, 0], ['C', 0.5, 0], ['H', 1.5, 0]], [[0, 1], [1, 2], [2, 3]]),
  chain('ch3oh', 'CH₃OH (methanol)', [['C', -0.5, 0], ['O', 0.5, 0], ['H', -1.3, 0], ['H', -0.5, -0.9], ['H', -0.5, 0.9], ['H', 1.2, -0.6]], [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5]]),
  star('o3', 'O₃', 'O', ['O', 'O']),
  star('so2', 'SO₂', 'S', ['O', 'O']),
  star('no3', 'NO₃⁻', 'N', ['O', 'O', 'O'], -1),
  star('co3', 'CO₃²⁻', 'C', ['O', 'O', 'O'], -2),
  star('so4', 'SO₄²⁻', 'S', ['O', 'O', 'O', 'O'], -2),
  star('nh4', 'NH₄⁺', 'N', ['H', 'H', 'H', 'H'], 1),
  chain('n2o', 'N₂O', [['N', -1, 0], ['N', 0, 0], ['O', 1, 0]], [[0, 1], [1, 2]]),
  chain('cn', 'CN⁻', [['C', -0.5, 0], ['N', 0.5, 0]], [[0, 1]], -1),
  chain('hno3', 'HNO₃', [['N', 0, 0], ['O', 0, -1], ['O', 0.87, 0.5], ['O', -0.87, 0.5], ['H', -1.6, 0]], [[0, 1], [0, 2], [0, 3], [3, 4]]),
  star('bf3', 'BF₃', 'B', ['F', 'F', 'F'], 0),
  star('no2', 'NO₂', 'N', ['O', 'O']),
  star('pcl5', 'PCl₅', 'P', ['Cl', 'Cl', 'Cl', 'Cl', 'Cl']),
  star('sf6', 'SF₆', 'S', ['F', 'F', 'F', 'F', 'F', 'F']),
  star('xef4', 'XeF₄', 'Xe', ['F', 'F', 'F', 'F']),
];
EXAMPLES.find((e) => e.id === 'bf3')!.note = 'Boron is happy with 6 electrons here: a double bond B=F would give F a + charge, which is worse.';
EXAMPLES.find((e) => e.id === 'no2')!.note = 'An odd number of electrons (17): one atom must have 7. Molecules like this are called free radicals.';

/** Formal charge as text: "+1", "−1", "0". */
export const fcText = (f: number) => (f > 0 ? `+${f}` : f < 0 ? `−${-f}` : '0');
