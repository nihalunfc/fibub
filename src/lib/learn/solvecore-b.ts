// "Solve my numbers" engine for Learn tools, pure part (no DOM): reads typed numbers with units, checks them, calls a
// tool's own maths and returns one plain answer sentence, the working and a common-mistake tip. The DOM part is
// solvecard-b.ts. Plain TypeScript so the maths can be checked with node --experimental-strip-types.
import { num } from '../sci/num.ts';

export type Unit = [label: string, factor: number];
export type Ctx = { find: string; ch: Record<string, string> };
export type SField = {
  k: string; label: string;
  /** num (default): one number; list: several numbers; choice: a pick-one. */
  kind?: 'num' | 'list' | 'choice';
  units?: Unit[]; options?: [value: string, label: string][];
  /** Starting choice (choice fields) or text. */
  def?: string; optional?: boolean; ph?: string;
  /** The number may be negative (or a list): the phone keyboard then needs the full layout, not the decimal pad. */
  neg?: boolean;
  show?: (c: Ctx) => boolean;
};
/** A typed value: v is in base units (typed number × unit factor); typed and u are what the student wrote. */
export type SIn = { v: number; typed: number; u: string; list: number[]; typedList: number[]; blank: boolean };
export type SOut = { answer?: string; lines?: string[]; tip?: string; error?: string; idle?: string };
export type SPreset = { name: string; find: string; vals: Record<string, string | [string, string]>; ch?: Record<string, string> };
export type SSpec = {
  id: string;
  /** What can be found: [key, label]. A field with the same key is hidden while it is the unknown. */
  finds: [string, string][];
  fields: SField[];
  presets: SPreset[];
  solve: (i: Record<string, SIn>, c: Ctx) => SOut;
};
export type SState = { find: string; text: Record<string, string>; unit: Record<string, string>; ch: Record<string, string> };

/** Read a typed number: 4.7, 1,5, 2.5e-3, 1.5 × 10^-7, 3/4. NaN if it cannot be read. */
export function readTyped(s: string): number {
  const t = (s ?? '').trim().replace(/[−–]/g, '-');
  if (!t) return NaN;
  const n = num(t);
  if (Number.isFinite(n)) return n;
  const m = t.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
  if (m && Number(m[2]) !== 0) return Number(m[1]) / Number(m[2]);
  return NaN;
}
const readList = (s: string) => s.split(/[,;\s+]+/).filter(Boolean).map(readTyped);

const PREF: [number, string][] = [[1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
const sg = (x: number, n = 3) => {
  if (!Number.isFinite(x)) return '–';
  return x === 0 ? '0' : (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-4 ? sigExp(x, n) : trim(x, n));
};
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function sigExp(x: number, n: number) {
  const [m, e] = x.toExponential(n - 1).split('e');
  return `${m.replace(/\.?0+$/, '').replace('-', '−')} × 10${String(Number(e)).split('').map((c) => SUP[c] ?? c).join('')}`;
}
function trim(x: number, n: number) {
  const d = Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(x))));
  return x.toFixed(Math.min(d, 12)).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '').replace('-', '−');
}
/** n significant figures, plain text, exponent only for very big or small numbers. */
export const sf = sg;
/** A number with an SI prefix chosen to read well: eng(0.0025, 'A') is "2.5 mA". Zero gives "0 A". */
export function eng(x: number, unit: string, n = 3): string {
  if (!Number.isFinite(x)) return `– ${unit}`;
  if (x === 0) return `0 ${unit}`;
  const a = Math.abs(x);
  const [f, p] = PREF.find(([f]) => a >= f * 0.9995) ?? PREF[PREF.length - 1];
  return `${sg(x / f, n)} ${p}${unit}`;
}

/** Read the form state, check it, and call the tool's maths. Never returns NaN or Infinity text. */
export function evaluate(spec: SSpec, st: SState): SOut {
  const ctx: Ctx = { find: st.find, ch: st.ch };
  const inp: Record<string, SIn> = {};
  const missing: string[] = [], bad: string[] = [];
  for (const f of spec.fields) {
    if (f.k === st.find || (f.show && !f.show(ctx)) || f.kind === 'choice') continue;
    const units = f.units ?? [['', 1]], ui = Math.max(0, units.findIndex((u) => u[0] === st.unit[f.k])), [ul, fac] = units[ui];
    const txt = (st.text[f.k] ?? '').trim();
    if (f.kind === 'list') {
      const raw = txt ? readList(txt) : [];
      if (!txt) { if (!f.optional) missing.push(f.label); inp[f.k] = { v: NaN, typed: NaN, u: ul, list: [], typedList: [], blank: true }; continue; }
      if (raw.some((x) => !Number.isFinite(x))) { bad.push(f.label); continue; }
      inp[f.k] = { v: NaN, typed: NaN, u: ul, list: raw.map((x) => x * fac), typedList: raw, blank: false };
    } else {
      if (!txt) { if (!f.optional) missing.push(f.label); inp[f.k] = { v: NaN, typed: NaN, u: ul, list: [], typedList: [], blank: true }; continue; }
      const x = readTyped(txt);
      if (!Number.isFinite(x)) { bad.push(f.label); continue; }
      inp[f.k] = { v: x * fac, typed: x, u: ul, list: [], typedList: [], blank: false };
    }
  }
  const label = spec.finds.find((x) => x[0] === st.find)?.[1] ?? '';
  if (bad.length) return { error: `I cannot read ${bad.join(' and ')}. Type a plain number such as 4.7, 2.5e-3 or 1/3.` };
  if (missing.length) return { idle: `Fill in ${missing.join(', ')} to find ${label}.` };
  let out: SOut;
  try { out = spec.solve(inp, ctx); } catch { return { error: 'Something about those numbers does not work. Check them and try again.' }; }
  if (out.answer && /NaN|Infinity|undefined/.test(out.answer + (out.lines ?? []).join(' '))) return { error: 'Those numbers do not give a sensible answer. Check them and try again.' };
  return out;
}
