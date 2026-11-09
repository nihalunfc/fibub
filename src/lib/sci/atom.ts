// Build an atom (school level): protons, neutrons and electrons give the element, mass number, charge, isotope,
// the Bohr shell picture (2, 8, 8, 2 for the first 20 electrons) and the combining capacity (valency).
// Pure functions, no DOM.
import { ELEMENTS, type Element } from './chem.ts';

export const MAX_P = 20, MAX_N = 30, MAX_E = 20;
export const SHELL_NAMES = ['K', 'L', 'M', 'N'];
const CAP = [2, 8, 8, 2]; // school (Bohr–Bury) filling for up to 20 electrons: K, L, M, then N

/** Electrons per shell for e electrons (0 to 20), filling K, L, M, N in order as taught for the first 20 elements. */
export function shells(e: number): number[] {
  if (!Number.isInteger(e) || e < 0 || e > MAX_E) throw new Error('Electrons must be a whole number from 0 to 20.');
  const out: number[] = []; let left = e;
  for (const c of CAP) { if (left <= 0) break; const k = Math.min(c, left); out.push(k); left -= k; }
  return out;
}

/** Valence electrons: electrons in the outermost shell (0 for no electrons). */
export const valenceElectrons = (e: number) => { const s = shells(e); return s.length ? s[s.length - 1] : 0; };

/** Valency of a neutral atom with z electrons: valence electrons if 4 or fewer, else 8 minus them; 0 for a full shell. */
export function valency(z: number): number {
  const s = shells(z); if (!s.length) return 0;
  const v = s[s.length - 1], full = s.length === 1 ? 2 : 8;
  if (v === full) return 0;
  if (s.length === 1) return v; // hydrogen: 1 (helium has a full K shell)
  return v <= 4 ? v : 8 - v;
}

export type Isotope = { natural: boolean; abundance: number; note: string };

/** Is this nucleus one found in nature? Uses the isotope list (stable and long-lived isotopes with their abundance). */
export function isotope(el: Element, a: number): Isotope {
  const iso = el.isotopes.find((i) => i.a === a);
  if (iso && iso.abundance > 0) return { natural: true, abundance: iso.abundance, note: `found in nature: ${fmtPct(iso.abundance)} of natural ${el.name.toLowerCase()} atoms` };
  if (el.z === 1 && a === 3) return { natural: false, abundance: 0, note: 'tritium: radioactive, half-life about 12 years' };
  if (el.z === 6 && a === 14) return { natural: false, abundance: 0, note: 'radioactive (half-life about 5700 years); tiny traces in living things, used in carbon dating' };
  return { natural: false, abundance: 0, note: 'not found in nature: a nucleus with this many neutrons is radioactive or falls apart at once' };
}
const fmtPct = (x: number) => { const p = x * 100; return p === 100 ? '100 %' : p >= 10 ? `${p.toFixed(1)} %` : p >= 0.01 ? `${p.toPrecision(2)} %` : `${p.toExponential(1).replace('e', ' × 10^')} %`; };

export type Atom = {
  p: number; n: number; e: number; A: number; charge: number;
  el: Element | null; kind: 'atom' | 'cation' | 'anion' | 'nothing';
  shells: number[]; valence: number; valency: number | null; iso: Isotope | null;
  symbolText: string; // e.g. "²³Na⁺"
};

const SUPD: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻' };
export const supText = (s: string) => s.split('').map((c) => SUPD[c] ?? c).join('');
/** Charge as written on an ion: "+", "2+", "−", "3−" ("" for zero). */
export const chargeLabel = (q: number) => (q === 0 ? '' : `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`);

export function build(p: number, n: number, e: number): Atom {
  for (const [v, max, what] of [[p, MAX_P, 'Protons'], [n, MAX_N, 'Neutrons'], [e, MAX_E, 'Electrons']] as const)
    if (!Number.isInteger(v) || v < 0 || v > max) throw new Error(`${what} must be a whole number from 0 to ${max}.`);
  const el = p > 0 ? ELEMENTS[p - 1] : null, A = p + n, charge = p - e;
  const kind = !el ? 'nothing' : charge === 0 ? 'atom' : charge > 0 ? 'cation' : 'anion';
  const sh = shells(e);
  return {
    p, n, e, A, charge, el, kind, shells: sh, valence: sh.length ? sh[sh.length - 1] : 0,
    valency: el ? valency(p) : null, iso: el ? isotope(el, A) : null,
    symbolText: el ? `${supText(String(A))}${el.symbol}${supText(chargeLabel(charge))}` : '',
  };
}

/** Name of the particle: "sodium-23 atom", "chloride ion"... kept simple for school use. */
export function describe(a: Atom): string {
  if (!a.el) return a.n ? 'a lone neutron (no protons, so no element)' : 'nothing yet: add a proton';
  const iso = `${a.el.name.toLowerCase()}-${a.A}`;
  if (a.kind === 'atom') return `${iso} atom`;
  return `${iso} ion with charge ${a.charge > 0 ? '+' : '−'}${Math.abs(a.charge)}`;
}
