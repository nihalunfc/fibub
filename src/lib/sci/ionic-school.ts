// #1295 Ionic bond builder: metal atoms give their outer electrons to non-metal atoms until every ion has a full
// outer shell. Shells (2, 8, 8, 2 filling for Z ≤ 20), ion charges, the formula from the lowest common multiple,
// and the order electrons move in for the dot-and-cross picture. Pure maths, no DOM.

export type Atom = { sym: string; name: string; Z: number; ion: string };
export const METALS: Atom[] = [
  { sym: 'Li', name: 'lithium', Z: 3, ion: 'lithium' }, { sym: 'Na', name: 'sodium', Z: 11, ion: 'sodium' }, { sym: 'K', name: 'potassium', Z: 19, ion: 'potassium' },
  { sym: 'Mg', name: 'magnesium', Z: 12, ion: 'magnesium' }, { sym: 'Ca', name: 'calcium', Z: 20, ion: 'calcium' }, { sym: 'Al', name: 'aluminium', Z: 13, ion: 'aluminium' },
];
export const NONMETALS: Atom[] = [
  { sym: 'F', name: 'fluorine', Z: 9, ion: 'fluoride' }, { sym: 'Cl', name: 'chlorine', Z: 17, ion: 'chloride' }, { sym: 'O', name: 'oxygen', Z: 8, ion: 'oxide' },
  { sym: 'S', name: 'sulfur', Z: 16, ion: 'sulfide' }, { sym: 'N', name: 'nitrogen', Z: 7, ion: 'nitride' },
];

/** Electrons in each shell (K, L, M, N) for Z up to 20, the school 2, 8, 8 filling. */
export function shells(Z: number): number[] {
  const cap = [2, 8, 8, 2], out: number[] = []; let left = Z;
  for (const c of cap) { if (left <= 0) break; const n = Math.min(c, left); out.push(n); left -= n; }
  return out;
}
export const valence = (Z: number) => { const s = shells(Z); return s[s.length - 1]; };
/** Electrons a metal gives (its outer electrons) or a non-metal takes (to reach 8; 2 for a first-shell atom). */
export const gives = (m: Atom) => valence(m.Z);
export const takes = (n: Atom) => 8 - valence(n.Z);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** How many of each atom make a neutral compound. */
export function counts(m: Atom, n: Atom): { metal: number; non: number; electrons: number } {
  const g = gives(m), t = takes(n), L = (g * t) / gcd(g, t);
  return { metal: L / g, non: L / t, electrons: L };
}
const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS: Record<string, string> = { 1: '', 2: '²', 3: '³' };
const sub = (k: number) => (k === 1 ? '' : String(k).split('').map((d) => SUBS[+d]).join(''));
export const formula = (m: Atom, n: Atom) => { const c = counts(m, n); return `${m.sym}${sub(c.metal)}${n.sym}${sub(c.non)}`; };
export const plainFormula = (m: Atom, n: Atom) => { const c = counts(m, n); return `${m.sym}${c.metal === 1 ? '' : c.metal}${n.sym}${c.non === 1 ? '' : c.non}`; };
export const cation = (m: Atom) => `${m.sym}${SUPS[gives(m)]}⁺`;
export const anion = (n: Atom) => `${n.sym}${SUPS[takes(n)]}⁻`;
export const compoundName = (m: Atom, n: Atom) => `${m.ion} ${n.ion}`;
/** Shells of the ion: a metal loses its outer shell; a non-metal fills its outer shell to 8. */
export const ionShells = (a: Atom, metal: boolean) => { const s = shells(a.Z); if (metal) return s.slice(0, -1); return [...s.slice(0, -1), s[s.length - 1] + takes(a)]; };
/** Electron moves in order: [metal index, non-metal index], each metal giving to the non-metal that still needs most. */
export function moves(m: Atom, n: Atom): [number, number][] {
  const c = counts(m, n), give = Array(c.metal).fill(gives(m)), need = Array(c.non).fill(takes(n)), out: [number, number][] = [];
  for (let i = 0; i < c.metal; i++) while (give[i] > 0) {
    let j = 0; for (let k = 1; k < c.non; k++) if (need[k] > need[j]) j = k;
    out.push([i, j]); give[i]--; need[j]--;
  }
  return out;
}
