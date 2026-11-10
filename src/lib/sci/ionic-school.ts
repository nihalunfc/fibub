// School chemistry: ionic bonds by electron transfer, drawn with dots and crosses (Class 10 metals and
// non-metals, Class 11 bonding). Elements 1 to 20 fill shells 2, 8, 8, 2 as in school books. A metal atom gives
// its outer electrons to non-metal atoms until every ion has a full outer shell; the formula comes from the
// smallest whole numbers of atoms that balance the electrons. No DOM.
import { gcd } from './smath.ts';

export type El = { sym: string; name: string; z: number; ion: string };
export const METALS: El[] = [
  { sym: 'Li', name: 'Lithium', z: 3, ion: 'Lithium' }, { sym: 'Na', name: 'Sodium', z: 11, ion: 'Sodium' },
  { sym: 'K', name: 'Potassium', z: 19, ion: 'Potassium' }, { sym: 'Mg', name: 'Magnesium', z: 12, ion: 'Magnesium' },
  { sym: 'Ca', name: 'Calcium', z: 20, ion: 'Calcium' }, { sym: 'Al', name: 'Aluminium', z: 13, ion: 'Aluminium' },
];
export const NONMETALS: El[] = [
  { sym: 'F', name: 'Fluorine', z: 9, ion: 'fluoride' }, { sym: 'Cl', name: 'Chlorine', z: 17, ion: 'chloride' },
  { sym: 'O', name: 'Oxygen', z: 8, ion: 'oxide' }, { sym: 'S', name: 'Sulfur', z: 16, ion: 'sulfide' },
  { sym: 'N', name: 'Nitrogen', z: 7, ion: 'nitride' },
];

/** School shell filling for Z ≤ 20: 2, 8, 8, 2. */
export function shells(z: number): number[] {
  const cap = [2, 8, 8, 2], out: number[] = [];
  let left = z;
  for (const c of cap) { if (left <= 0) break; const k = Math.min(c, left); out.push(k); left -= k; }
  return out;
}
export const valence = (z: number) => shells(z).at(-1)!;
/** Electrons lost (metal, positive) or gained (non-metal, negative) to reach a full shell. */
export function charge(z: number, metal: boolean): number {
  const v = valence(z);
  return metal ? v : -(8 - v);
}
/** Shells after gaining or losing electrons. */
export function ionShells(z: number, metal: boolean): number[] {
  const s = shells(z);
  if (metal) return s.slice(0, -1);
  return [...s.slice(0, -1), 8];
}

/** How many metal and non-metal atoms balance (smallest whole numbers). */
export function ratio(m: El, x: El): { nm: number; nx: number; electrons: number } {
  const lose = charge(m.z, true), gain = -charge(x.z, false), l = (lose * gain) / gcd(lose, gain);
  return { nm: l / lose, nx: l / gain, electrons: l };
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => SUB[+d]));
export function formula(m: El, x: El): string { const r = ratio(m, x); return `${m.sym}${sub(r.nm)}${x.sym}${sub(r.nx)}`; }
export function ionText(sym: string, q: number): string {
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', a = Math.abs(q);
  return `${sym}${a === 1 ? '' : String(a).replace(/\d/g, (d) => SUP[+d])}${q > 0 ? '⁺' : '⁻'}`;
}
export const compoundName = (m: El, x: El) => `${m.ion} ${x.ion}`;

/** Transfer order: electron k (0-based) goes from metal atom i to non-metal atom j. */
export function transfers(m: El, x: El): { from: number; to: number }[] {
  const r = ratio(m, x), lose = charge(m.z, true), gain = -charge(x.z, false), out: { from: number; to: number }[] = [];
  for (let k = 0; k < r.electrons; k++) out.push({ from: Math.floor(k / lose), to: Math.floor(k / gain) });
  return out;
}
