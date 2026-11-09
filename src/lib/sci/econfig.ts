// Electron configuration filler (school level, up to krypton): orbital boxes filled by the Aufbau order, Pauli's
// exclusion rule and Hund's rule, the quantum numbers of every electron, the chromium and copper exceptions, and a
// checker for boxes filled by hand. Configurations themselves come from ptable.ts. Pure functions, no DOM.
import { MADELUNG, aufbau, configuration, configText, nobleGas, unpaired, label, cap, type Subshell } from './ptable.ts';

export const MAX_Z = 36;
/** Subshells used here (1s to 4p) in filling order. */
export const ORDER = MADELUNG.slice(0, 8);
const L = 'spdf';

/** One box (orbital) holds up to two electrons: spin up first, then spin down. */
export type Box = { up: boolean; down: boolean };
export type Boxes = Record<string, Box[]>; // by subshell label, ml from −l to +l

export const emptyBoxes = (): Boxes => Object.fromEntries(ORDER.map((s) => [label(s), Array.from({ length: 2 * s.l + 1 }, () => ({ up: false, down: false }))]));

/** Boxes for a configuration filled by Hund's rule: one spin-up electron in each box first, then spin-down. */
export function boxesFor(c: Subshell[]): Boxes {
  const b = emptyBoxes();
  for (const s of c) {
    const row = b[label(s)]; if (!row) throw new Error(`Subshell ${label(s)} is beyond 4p.`);
    for (let j = 0; j < s.e; j++) { if (j < row.length) row[j].up = true; else row[j - row.length].down = true; }
  }
  return b;
}

export type Electron = { k: number; sub: string; n: number; l: number; ml: number; ms: 0.5 | -0.5; box: number };

/** Every electron of a configuration with its four quantum numbers, in filling order (box j has ml = j − l;
 *  the first electron in a box is spin up, ms = +½). */
export function electrons(c: Subshell[]): Electron[] {
  const by = new Map(c.map((s) => [label(s), s.e]));
  const out: Electron[] = [];
  for (const s of ORDER) {
    const e = by.get(label(s)) ?? 0, m = 2 * s.l + 1;
    for (let j = 0; j < e; j++) {
      const box = j < m ? j : j - m;
      out.push({ k: out.length + 1, sub: label(s), n: s.n, l: s.l, ml: box - s.l, ms: j < m ? 0.5 : -0.5, box });
    }
  }
  return out;
}

/** Quantum numbers for a box and spin. */
export function quantum(sub: string, box: number, up: boolean) {
  const n = Number(sub[0]), l = L.indexOf(sub[1]);
  return { n, l, ml: box - l, ms: (up ? 0.5 : -0.5) as 0.5 | -0.5 };
}

export const msText = (ms: number) => (ms > 0 ? '+½' : '−½');
export const signed = (x: number) => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : '0');

/** The configuration shown for z electrons: the real ground state for a neutral atom (Cr and Cu differ from Aufbau). */
export function forAtom(z: number): { real: Subshell[]; aufbau: Subshell[]; exception: boolean } {
  if (!Number.isInteger(z) || z < 0 || z > MAX_Z) throw new Error(`Electrons must be a whole number from 0 to ${MAX_Z}.`);
  const real = configuration(z), auf = aufbau(z);
  return { real, aufbau: auf, exception: configText(real) !== configText(auf) };
}

const countIn = (b: Boxes, sub: string) => b[sub].reduce((a, x) => a + (x.up ? 1 : 0) + (x.down ? 1 : 0), 0);
export const total = (b: Boxes) => ORDER.reduce((a, s) => a + countIn(b, label(s)), 0);
export function toConfig(b: Boxes): Subshell[] { return ORDER.map((s) => ({ ...s, e: countIn(b, label(s)) })).filter((s) => s.e > 0); }

export type Placement = { ok: true; up: boolean } | { ok: false; rule: 'Aufbau' | 'Pauli' | 'Hund'; why: string };

/** Can the next electron go into this box (filled by hand)? Checks the three rules in turn. */
export function place(b: Boxes, sub: string, box: number): Placement {
  const idx = ORDER.findIndex((s) => label(s) === sub);
  if (idx < 0) throw new Error('Unknown subshell.');
  const lower = ORDER.slice(0, idx).find((s) => countIn(b, label(s)) < cap(s.l));
  if (lower) return { ok: false, rule: 'Aufbau', why: `Aufbau principle: fill ${label(lower)} first. It is lower in energy (n + l = ${lower.n + lower.l}) than ${sub} (n + l = ${ORDER[idx].n + ORDER[idx].l}) and still has room.` };
  const cell = b[sub][box];
  if (cell.up && cell.down) return { ok: false, rule: 'Pauli', why: 'Pauli exclusion principle: one box (orbital) holds at most two electrons, and they must have opposite spins.' };
  if (cell.up && b[sub].some((x) => !x.up)) return { ok: false, rule: 'Hund', why: `Hund's rule: put one electron in each empty ${sub} box first (all with the same spin) before pairing any up.` };
  return { ok: true, up: !cell.up };
}

/** Does a subshell end up exactly half full or full (the extra stability behind Cr and Cu)? */
export const halfOrFull = (s: Subshell) => s.e === cap(s.l) || s.e === cap(s.l) / 2;

/** Normalise a typed configuration ("1s2 2s2 2p6 3s1", "1s² 2s²…", "[Ne] 3s1") to "1s2 2s2 …" in n, l order. */
export function parseConfig(text: string): Subshell[] | null {
  let t = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (d) => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d))).replace(/\^/g, '').trim();
  const core = /^\[(He|Ne|Ar|Kr)\]/i.exec(t);
  const out = new Map<string, Subshell>();
  if (core) {
    const z = { he: 2, ne: 10, ar: 18, kr: 36 }[core[1].toLowerCase() as 'he']!;
    for (const s of aufbau(z)) out.set(label(s), { ...s });
    t = t.slice(core[0].length);
  }
  t = t.replace(/[\s,.;]+/g, '');
  if (!t && !core) return null;
  let i = 0;
  while (i < t.length) {
    const m = /^(\d)([spdf])(\d)(\d)?/i.exec(t.slice(i)); if (!m) return null;
    const n = Number(m[1]), l = L.indexOf(m[2].toLowerCase());
    let e = Number(m[3]), len = 3;
    if (m[4] !== undefined && Number(m[3] + m[4]) <= cap(l) && m[3] !== '0') { e = Number(m[3] + m[4]); len = 4; }
    if (l >= n || e < 1 || e > cap(l)) return null;
    const k = `${n}${L[l]}`; if (out.has(k) && !core) return null;
    out.set(k, { n, l, e }); i += len;
  }
  return [...out.values()].sort((a, b) => a.n - b.n || a.l - b.l);
}

export { configText, nobleGas, unpaired, label, cap };
