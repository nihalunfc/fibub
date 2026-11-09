// Chirality and R/S for one carbon with four groups, school level: CIP priorities (atomic number, then the next
// atoms out, with a double bond counted as two single bonds to duplicate atoms), whether the carbon is a
// stereocentre, and R or S from the 3D arrangement. Plain maths, no DOM. Used by the #1107 chirality checker.

export type Node = { el: string; kids: Node[] };
const Z: Record<string, number> = { H: 1, C: 6, N: 7, O: 8, F: 9, Cl: 17, Br: 35, I: 53, dup: 0 };
export const atomicNumber = (el: string) => Z[el.replace(/\*$/, '')] ?? 0;

// Compact notation: "C(H,H,H)". A trailing * marks a duplicate atom (from a double or triple bond): it has the
// element's atomic number but only phantom (zero) atoms beyond it.
export function parse(s: string): Node {
  let i = 0;
  const node = (): Node => {
    let el = ''; while (i < s.length && /[A-Za-z*]/.test(s[i])) el += s[i++];
    const kids: Node[] = [];
    if (s[i] === '(') { i++; for (;;) { kids.push(node()); if (s[i] === ',') { i++; continue; } if (s[i] === ')') { i++; break; } throw new Error('bad group ' + s); } }
    return { el, kids };
  };
  return node();
}

export type Group = { id: string; label: string; tree: string };
export const GROUPS: Group[] = [
  { id: 'H', label: 'H', tree: 'H' },
  { id: 'D', label: 'D', tree: 'H' },
  { id: 'F', label: 'F', tree: 'F' },
  { id: 'Cl', label: 'Cl', tree: 'Cl' },
  { id: 'Br', label: 'Br', tree: 'Br' },
  { id: 'I', label: 'I', tree: 'I' },
  { id: 'OH', label: 'OH', tree: 'O(H)' },
  { id: 'OCH3', label: 'OCH₃', tree: 'O(C(H,H,H))' },
  { id: 'NH2', label: 'NH₂', tree: 'N(H,H)' },
  { id: 'CH3', label: 'CH₃', tree: 'C(H,H,H)' },
  { id: 'C2H5', label: 'C₂H₅', tree: 'C(C(H,H,H),H,H)' },
  { id: 'C3H7', label: 'CH₂CH₂CH₃', tree: 'C(C(C(H,H,H),H,H),H,H)' },
  { id: 'iPr', label: 'CH(CH₃)₂', tree: 'C(C(H,H,H),C(H,H,H),H)' },
  { id: 'CH2OH', label: 'CH₂OH', tree: 'C(O(H),H,H)' },
  { id: 'CH2Cl', label: 'CH₂Cl', tree: 'C(Cl,H,H)' },
  { id: 'CHO', label: 'CHO', tree: 'C(O,O*,H)' },
  { id: 'COOH', label: 'COOH', tree: 'C(O,O*,O(H))' },
  { id: 'CN', label: 'CN', tree: 'C(N,N*,N*)' },
  { id: 'vinyl', label: 'CH=CH₂', tree: 'C(C(H,H,C*),C*,H)' },
];
export const groupById = (id: string) => GROUPS.find((g) => g.id === id)!;

/** Compare two branches by CIP rules: > 0 if a ranks higher. Isotopes: D beats H (mass), checked only at the first atom. */
export function cmp(a: Node, b: Node): number {
  const za = atomicNumber(a.el), zb = atomicNumber(b.el);
  if (za !== zb) return za - zb;
  const ka = a.kids.slice().sort((x, y) => cmp(y, x)), kb = b.kids.slice().sort((x, y) => cmp(y, x));
  const n = Math.max(3, ka.length, kb.length);
  // First the set of atoms one step further out (highest first), then explore branch by branch.
  for (let i = 0; i < n; i++) { const d = (ka[i] ? atomicNumber(ka[i].el) : 0) - (kb[i] ? atomicNumber(kb[i].el) : 0); if (d) return d; }
  for (let i = 0; i < n; i++) { if (!ka[i] || !kb[i]) continue; const d = cmp(ka[i], kb[i]); if (d) return d; }
  return 0;
}

const setText = (n: Node) => { const k = n.kids.slice().sort((x, y) => cmp(y, x)).map((x) => x.el.replace('*', '')); while (k.length < 3 && n.el !== 'H' && atomicNumber(n.el) > 1 && n.kids.length) k.push('0'); return `{${k.join(', ')}}`; };

export type Ranking = { order: number[]; ties: [number, number][]; chiral: boolean; steps: string[] };

/** Rank four groups (by id) 1 to 4 by CIP priority. `order[k]` = index of the group with priority k + 1. */
export function rank(ids: string[]): Ranking {
  const trees = ids.map((id) => parse(groupById(id).tree)), labels = ids.map((id) => groupById(id).label);
  const isoKey = (i: number) => (ids[i] === 'D' ? 1 : 0);
  const c = (i: number, j: number) => cmp(trees[i], trees[j]) || isoKey(i) - isoKey(j);
  const order = [0, 1, 2, 3].sort((i, j) => c(j, i));
  const ties: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (c(i, j) === 0) ties.push([i, j]);
  const steps: string[] = [];
  steps.push(`First atoms: ${order.map((i) => `${labels[i]} → ${trees[i].el} (${atomicNumber(trees[i].el)})`).join(', ')}.`);
  for (let k = 0; k < 3; k++) {
    const i = order[k], j = order[k + 1];
    if (atomicNumber(trees[i].el) === atomicNumber(trees[j].el) && c(i, j) !== 0) {
      if (ids[i] === 'D' || ids[j] === 'D') steps.push(`${labels[i]} beats ${labels[j]}: same element, but deuterium is heavier.`);
      else steps.push(`Tie on ${trees[i].el} between ${labels[i]} and ${labels[j]}: look one atom further. ${labels[i]} has ${setText(trees[i])}, ${labels[j]} has ${setText(trees[j])}${(() => { const a = trees[i].kids.slice().sort((x, y) => cmp(y, x)).map((x) => atomicNumber(x.el)).join(), b = trees[j].kids.slice().sort((x, y) => cmp(y, x)).map((x) => atomicNumber(x.el)).join(); return a === b ? ': still equal, so go further along the highest branch' : ''; })()}, so ${labels[i]} wins.`);
    }
  }
  if (ids.some((id) => ['CHO', 'COOH', 'CN', 'vinyl'].includes(id))) steps.push('A double bond counts as two single bonds: C=O is read as C joined to O and O again; C≡N as N three times.');
  const chiral = ties.length === 0;
  if (chiral) steps.push(`Priorities: 1 ${labels[order[0]]}, 2 ${labels[order[1]]}, 3 ${labels[order[2]]}, 4 ${labels[order[3]]}.`);
  else steps.push(`${labels[ties[0][0]]} and ${labels[ties[0][1]]} are the same group, so this carbon is not a stereocentre (not chiral).`);
  return { order, ties, chiral, steps };
}

export type V = [number, number, number];
/** Tetrahedral sites: site 0 straight up, then three round the bottom. */
export const SITES: V[] = [[0, 1, 0], [0.9428, -1 / 3, 0], [-0.4714, -1 / 3, 0.8165], [-0.4714, -1 / 3, -0.8165]];

const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** R or S for groups placed at `pos` (pos[i] = direction of group i), with priorities from `order`. */
export function descriptor(pos: V[], order: number[]): 'R' | 'S' {
  const [a, b, c, d] = order.map((i) => pos[i]);
  const n = cross(sub(b, a), sub(c, a));
  // Seen from the side away from the lowest priority group, 1 → 2 → 3 is clockwise exactly when n points towards d.
  return dot(n, d) > 0 ? 'R' : 'S';
}

/** Mirror image: reflect through the yz plane (x → −x). */
export const mirror = (pos: V[]): V[] => pos.map((p) => [-p[0], p[1], p[2]]);

export type Preset = { id: string; name: string; groups: string[]; note?: string };
// Groups listed in site order (site 0 up, then round the bottom).
export const PRESETS: Preset[] = [
  { id: 'chfclbr', name: 'Bromochlorofluoromethane, CHFClBr', groups: ['H', 'Br', 'Cl', 'F'] },
  { id: 'butan2ol', name: 'Butan-2-ol', groups: ['H', 'OH', 'CH3', 'C2H5'] },
  { id: 'chlorobutane', name: '2-Chlorobutane', groups: ['H', 'Cl', 'C2H5', 'CH3'] },
  { id: 'lactic', name: 'Lactic acid (2-hydroxypropanoic acid)', groups: ['H', 'OH', 'COOH', 'CH3'] },
  { id: 'alanine', name: 'Alanine (2-aminopropanoic acid)', groups: ['H', 'NH2', 'CH3', 'COOH'] },
  { id: 'glyceraldehyde', name: 'Glyceraldehyde (2,3-dihydroxypropanal)', groups: ['H', 'OH', 'CHO', 'CH2OH'] },
  { id: 'methylhexane', name: '3-Methylhexane (carbon 3)', groups: ['H', 'CH3', 'C2H5', 'C3H7'] },
  { id: 'butenol', name: 'But-3-en-2-ol', groups: ['H', 'OH', 'vinyl', 'CH3'] },
  { id: 'propan2ol', name: 'Propan-2-ol (not chiral)', groups: ['H', 'OH', 'CH3', 'CH3'] },
  { id: 'dichloro', name: 'Dichloromethane (not chiral)', groups: ['H', 'Cl', 'Cl', 'H'] },
];
