// Oxidation numbers (school rules, applied in a fixed order, with the rule used for each element) and redox
// equations balanced by the half-reaction (ion-electron) method in acid or base. Pure functions, no DOM.
import { parseFormula, byElement, BY_SYMBOL } from './chem.ts';
import { groupOf, PAULING } from './ptable.ts';

export type ONRow = { symbol: string; count: number; on: number; rule: string; average: boolean };
export type ONResult = { formula: string; charge: number; rows: ONRow[]; estimated: boolean; note: string };

/** Read a formula with an optional charge. "Fe3+" (one element, digit, sign) is read as Fe³⁺, not Fe₃⁺. */
export function readFormula(text: string) {
  let t = text.trim().replace(/[−–]/g, '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, (c) => ({ '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-' } as Record<string, string>)[c]);
  const ion = /^([A-Z][a-z]?)(\d)([+-])$/.exec(t);
  if (ion) t = `${ion[1]}^${ion[2]}${ion[3]}`;
  const f = parseFormula(t);
  return { counts: byElement(f), charge: f.charge };
}

const G1 = new Set(['Li', 'Na', 'K', 'Rb', 'Cs']), G2 = new Set(['Be', 'Mg', 'Ca', 'Sr', 'Ba']);
const isMetal = (s: string) => { const z = BY_SYMBOL.get(s)!.z, g = groupOf(z); return !['H', 'B', 'C', 'N', 'O', 'F', 'Si', 'P', 'S', 'Cl', 'As', 'Se', 'Br', 'Te', 'I', 'At', 'He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'].includes(s) && g !== 18; };
const en = (s: string) => PAULING[BY_SYMBOL.get(s)!.z - 1];
/** Usual negative oxidation number of a non-metal: its group number minus 18 (N −3, S −2, Cl −1, C −4). */
const usualNegative = (s: string) => { const g = groupOf(BY_SYMBOL.get(s)!.z) ?? 0; return g >= 13 ? g - 18 : -1; };

export const RULES = [
  'An element on its own (not combined) has oxidation number 0.',
  'In a simple ion of one element, the oxidation number equals the charge.',
  'Fluorine is always −1 in compounds.',
  'Group 1 metals are +1, group 2 metals +2, aluminium +3 in compounds.',
  'Hydrogen is +1, except with metals only (metal hydrides such as NaH), where it is −1.',
  'Oxygen is −2, except in peroxides (−1), superoxides (−½) and with fluorine (OF₂, +2).',
  'The oxidation numbers of all the atoms add up to the overall charge (0 for a compound).',
];

/** Oxidation number of every element in a formula, by the school rules in order. */
export function oxidationNumbers(text: string): ONResult {
  const { counts, charge } = readFormula(text);
  const syms = [...counts.keys()];
  const known = new Map<string, { on: number; rule: string }>();
  if (syms.length === 1) {
    const s = syms[0], n = counts.get(s)!;
    const on = charge / n;
    return { formula: text, charge, estimated: false, note: '', rows: [{ symbol: s, count: n, on, rule: charge === 0 ? RULES[0] : n === 1 ? RULES[1] : RULES[6], average: !Number.isInteger(on) }] };
  }
  for (const s of syms) {
    if (s === 'F') known.set(s, { on: -1, rule: RULES[2] });
    else if (G1.has(s)) known.set(s, { on: 1, rule: RULES[3] });
    else if (G2.has(s)) known.set(s, { on: 2, rule: RULES[3] });
    else if (s === 'Al') known.set(s, { on: 3, rule: RULES[3] });
  }
  if (counts.has('H')) {
    const others = syms.filter((s) => s !== 'H');
    known.set('H', others.every(isMetal) ? { on: -1, rule: RULES[4] } : { on: 1, rule: RULES[4] });
  }
  const unknown = () => syms.filter((s) => !known.has(s));
  const sumKnown = () => [...known].reduce((a, [s, k]) => a + k.on * counts.get(s)!, 0);
  // Oxygen: −2 when something else is still unknown; if it is the only unknown, it is worked out (peroxides, OF₂).
  if (counts.has('O') && !known.has('O') && unknown().length > 1) known.set('O', { on: -2, rule: RULES[5] });
  let estimated = false, note = '';
  // Cyanide groups (CN⁻): carbon +2, nitrogen −3.
  if (!known.has('C') && !known.has('N') && counts.get('C') === counts.get('N') && !counts.has('O') && !counts.has('H') && unknown().length > 2) {
    known.set('C', { on: 2, rule: 'In the cyanide group CN⁻, carbon is +2 and nitrogen −3.' }); known.set('N', { on: -3, rule: 'In the cyanide group CN⁻, carbon is +2 and nitrogen −3.' });
  }
  // More than one unknown left: give the most electronegative its usual negative value (an estimate).
  while (unknown().length > 1) {
    const s = unknown().sort((a, b) => en(b) - en(a))[0];
    known.set(s, { on: usualNegative(s), rule: `No fixed rule: ${BY_SYMBOL.get(s)!.name.toLowerCase()} is the most electronegative element left, so it is given its usual value ${usualNegative(s)}.` });
    estimated = true;
  }
  const u = unknown();
  if (u.length === 1) {
    const s = u[0], on = (charge - sumKnown()) / counts.get(s)!;
    known.set(s, { on, rule: RULES[6] + (s === 'O' ? ' (here oxygen is not −2: ' + (Math.abs(on + 1) < 1e-9 ? 'a peroxide' : Math.abs(on + 0.5) < 1e-9 ? 'a superoxide' : 'bonded to fluorine') + ')' : '') });
  }
  const rows = syms.map((s) => { const k = known.get(s)!; return { symbol: s, count: counts.get(s)!, on: k.on, rule: k.rule, average: !Number.isInteger(Math.round(k.on * 1e9) / 1e9) }; });
  if (rows.some((r) => r.average)) note = 'A fraction means an average: the atoms of that element are not all in the same state (for example Fe₃O₄ holds Fe²⁺ and Fe³⁺).';
  if (rows.some((r) => Math.abs(r.on) > 8)) note = (note ? note + ' ' : '') + 'An oxidation number above 8 is impossible: check the formula.';
  if (estimated) note = (note ? note + ' ' : '') + 'Two or more elements had no fixed rule, so the values are an estimate; the sum is still right.';
  return { formula: text, charge, rows, estimated, note };
}

/** Oxidation number as text: +6, −2, 0, +8/3, −½. */
export function onText(x: number): string {
  if (Math.abs(x) < 1e-9) return '0';
  const sign = x > 0 ? '+' : '−', a = Math.abs(x);
  if (Number.isInteger(Math.round(a * 1e9) / 1e9)) return sign + Math.round(a);
  if (Math.abs(a - 0.5) < 1e-9) return sign + '½';
  for (let d = 2; d <= 8; d++) { const n = Math.round(a * d); if (Math.abs(n / d - a) < 1e-9) return `${sign}${n}/${d}`; }
  return sign + a.toFixed(2);
}

// ---------- half-reactions ----------
type Side = Map<string, number>; // species text → coefficient
export type Half = { left: Side; right: Side; electrons: number; kind: 'oxidation' | 'reduction'; steps: string[]; key: string; from: number; to: number };

const atomsOf = (sp: string) => (sp === 'e-' ? { counts: new Map<string, number>(), charge: -1 } : readFormula(sp));
const add = (m: Side, k: string, v: number) => { if (v) m.set(k, (m.get(k) ?? 0) + v); };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
function count(side: Side, el: string) { let t = 0; for (const [sp, c] of side) t += (atomsOf(sp).counts.get(el) ?? 0) * c; return t; }
function chargeOf(side: Side) { let t = 0; for (const [sp, c] of side) t += atomsOf(sp).charge * c; return t; }

export const SUBD = '₀₁₂₃₄₅₆₇₈₉', SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** "Cr2O7^2-" → "Cr₂O₇²⁻", "e-" → "e⁻". */
export function pretty(sp: string): string {
  if (sp === 'e-') return 'e⁻';
  const m = /^(.*?)(?:\^(\d*)([+-])|([+-]))?$/.exec(sp)!;
  const body = m[1].replace(/\d/g, (d) => SUBD[+d]);
  const sign = m[3] ?? m[4];
  const ch = sign ? (m[2] && m[2] !== '1' ? m[2].replace(/\d/g, (d) => SUPD[+d]) : '') + (sign === '+' ? '⁺' : '⁻') : '';
  return body + ch;
}
export const sideText = (s: Side) => [...s].filter(([, c]) => c > 0).map(([sp, c]) => `${c === 1 ? '' : c}${pretty(sp)}`).join(' + ');
export const eqText = (l: Side, r: Side) => `${sideText(l)} → ${sideText(r)}`;

/** Balance one half-reaction "from → to" by the ion-electron method. */
export function halfReaction(from: string, to: string, medium: 'acid' | 'base'): Half {
  const A = atomsOf(from), B = atomsOf(to);
  const main = [...A.counts.keys()].filter((e) => e !== 'O' && e !== 'H');
  const key = main[0] ?? 'O';
  if (main.length > 1) throw new Error('Each side of a half-reaction should have one main element besides O and H.');
  const ca = A.counts.get(key) ?? 0, cb = B.counts.get(key) ?? 0;
  if (!ca || !cb) throw new Error(`Both species need ${key}.`);
  const g = gcd(ca, cb), a = cb / g, b = ca / g;
  const left: Side = new Map(), right: Side = new Map(), steps: string[] = [];
  add(left, from, a); add(right, to, b);
  const onA = oxidationNumbers(from).rows.find((r) => r.symbol === key)!.on, onB = oxidationNumbers(to).rows.find((r) => r.symbol === key)!.on;
  steps.push(`Balance ${key}: ${eqText(left, right)}`);
  const dO = count(right, 'O') - count(left, 'O');
  if (dO) { add(dO > 0 ? left : right, 'H2O', Math.abs(dO)); steps.push(`Balance O with H₂O: ${eqText(left, right)}`); }
  const dH = count(right, 'H') - count(left, 'H');
  if (dH) { add(dH > 0 ? left : right, 'H+', Math.abs(dH)); steps.push(`Balance H with H⁺: ${eqText(left, right)}`); }
  const dq = chargeOf(left) - chargeOf(right); // electrons go on the side with more positive charge
  if (dq > 0) add(left, 'e-', dq); else if (dq < 0) add(right, 'e-', -dq);
  steps.push(`Balance charge with electrons: ${eqText(left, right)}`);
  if (medium === 'base') {
    const h = (left.get('H+') ?? 0) + (right.get('H+') ?? 0);
    if (h) {
      const side = left.has('H+') ? left : right, other = side === left ? right : left;
      side.delete('H+'); add(side, 'H2O', h); add(other, 'OH-', h);
      const wl = left.get('H2O') ?? 0, wr = right.get('H2O') ?? 0, w = Math.min(wl, wr);
      if (w) { left.set('H2O', wl - w); right.set('H2O', wr - w); if (!left.get('H2O')) left.delete('H2O'); if (!right.get('H2O')) right.delete('H2O'); }
      steps.push(`In base, add ${h} OH⁻ to both sides (H⁺ + OH⁻ → H₂O) and cancel water: ${eqText(left, right)}`);
    }
  }
  const electrons = (left.get('e-') ?? 0) + (right.get('e-') ?? 0);
  return { left, right, electrons, kind: left.has('e-') ? 'reduction' : 'oxidation', steps, key, from: onA, to: onB };
}

/** Add an oxidation and a reduction half so the electrons cancel. */
export function combine(ox: Half, red: Half): { left: Side; right: Side; mOx: number; mRed: number } {
  if (ox.kind !== 'oxidation' || red.kind !== 'reduction') throw new Error('Pick one oxidation and one reduction.');
  const l = (ox.electrons * red.electrons) / gcd(ox.electrons, red.electrons), mOx = l / ox.electrons, mRed = l / red.electrons;
  const left: Side = new Map(), right: Side = new Map();
  for (const [h, m] of [[ox, mOx], [red, mRed]] as const) { for (const [s, c] of h.left) add(left, s, c * m); for (const [s, c] of h.right) add(right, s, c * m); }
  for (const s of new Set([...left.keys(), ...right.keys()])) {
    const a = left.get(s) ?? 0, b = right.get(s) ?? 0, k = Math.min(a, b);
    if (k) { left.set(s, a - k); right.set(s, b - k); }
    if (!left.get(s)) left.delete(s); if (!right.get(s)) right.delete(s);
  }
  // reduce by a common factor if any
  const g = [...left.values(), ...right.values()].reduce((a, b) => gcd(a, b));
  if (g > 1) { for (const m of [left, right]) for (const [s, c] of m) m.set(s, c / g); }
  return { left, right, mOx, mRed };
}

/** Atoms and charge on each side (to check a balanced equation). */
export function tally(s: Side) { const atoms = new Map<string, number>(); for (const [sp, c] of s) for (const [e, n] of atomsOf(sp).counts) atoms.set(e, (atoms.get(e) ?? 0) + n * c); return { atoms, charge: chargeOf(s) }; }

export type Couple = { id: string; from: string; to: string };
/** Ready-made couples, written as the change that happens (from → to). */
export const COUPLES: Couple[] = [
  { id: 'MnO4-Mn2', from: 'MnO4-', to: 'Mn^2+' },
  { id: 'MnO4-MnO2', from: 'MnO4-', to: 'MnO2' },
  { id: 'Cr2O7-Cr3', from: 'Cr2O7^2-', to: 'Cr^3+' },
  { id: 'H2O2-H2O', from: 'H2O2', to: 'H2O' },
  { id: 'NO3-NO', from: 'NO3-', to: 'NO' },
  { id: 'Cl2-Cl', from: 'Cl2', to: 'Cl-' },
  { id: 'Cu2-Cu', from: 'Cu^2+', to: 'Cu' },
  { id: 'Fe2-Fe3', from: 'Fe^2+', to: 'Fe^3+' },
  { id: 'I-I2', from: 'I-', to: 'I2' },
  { id: 'I-IO3', from: 'I-', to: 'IO3-' },
  { id: 'C2O4-CO2', from: 'C2O4^2-', to: 'CO2' },
  { id: 'H2O2-O2', from: 'H2O2', to: 'O2' },
  { id: 'SO3-SO4', from: 'SO3^2-', to: 'SO4^2-' },
  { id: 'Zn-Zn2', from: 'Zn', to: 'Zn^2+' },
];
