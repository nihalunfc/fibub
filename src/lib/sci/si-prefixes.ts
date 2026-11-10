// SI prefixes for school: convert between prefixes by moving the decimal point (done on the digits as text, so
// 0.1 + nothing is lost to rounding), and add two measurements only when they measure the same kind of thing.
// Prefix values from the SI Brochure (BIPM, 9th edition). Plain TypeScript, no DOM.

export type Prefix = { sym: string; name: string; exp: number };
export const PREFIXES: Prefix[] = [
  { sym: 'T', name: 'tera', exp: 12 }, { sym: 'G', name: 'giga', exp: 9 }, { sym: 'M', name: 'mega', exp: 6 }, { sym: 'k', name: 'kilo', exp: 3 },
  { sym: 'h', name: 'hecto', exp: 2 }, { sym: 'da', name: 'deca', exp: 1 }, { sym: '', name: '(none)', exp: 0 }, { sym: 'd', name: 'deci', exp: -1 },
  { sym: 'c', name: 'centi', exp: -2 }, { sym: 'm', name: 'milli', exp: -3 }, { sym: 'µ', name: 'micro', exp: -6 }, { sym: 'n', name: 'nano', exp: -9 },
  { sym: 'p', name: 'pico', exp: -12 },
];

export type Unit = { sym: string; name: string; kind: string };
export const UNITS: Unit[] = [
  { sym: 'm', name: 'metre', kind: 'length' }, { sym: 'g', name: 'gram', kind: 'mass' }, { sym: 's', name: 'second', kind: 'time' },
  { sym: 'L', name: 'litre', kind: 'volume' }, { sym: 'A', name: 'ampere', kind: 'current' }, { sym: 'V', name: 'volt', kind: 'voltage' },
  { sym: 'W', name: 'watt', kind: 'power' }, { sym: 'J', name: 'joule', kind: 'energy' }, { sym: 'Hz', name: 'hertz', kind: 'frequency' },
  { sym: 'Pa', name: 'pascal', kind: 'pressure' }, { sym: 'N', name: 'newton', kind: 'force' }, { sym: 'mol', name: 'mole', kind: 'amount of substance' },
];

/** The seven SI base units (a general fact). */
export const BASE = [
  ['length', 'metre', 'm'], ['mass', 'kilogram', 'kg'], ['time', 'second', 's'], ['electric current', 'ampere', 'A'],
  ['temperature', 'kelvin', 'K'], ['amount of substance', 'mole', 'mol'], ['luminous intensity', 'candela', 'cd'],
] as const;

/** Read a plain decimal like "3.25", "-0.004", "12". Null if it isn't one. */
export function readDecimal(s: string): { neg: boolean; digits: string; point: number } | null {
  const t = s.trim().replace(/[−–]/g, '-').replace(/,/g, '');
  const m = /^([-+]?)(\d*)(?:\.(\d*))?$/.exec(t);
  if (!m || (m[2] + (m[3] ?? '')) === '') return null;
  return { neg: m[1] === '-', digits: m[2] + (m[3] ?? ''), point: m[2].length };
}

/** Move the decimal point k places (right if k > 0) on the text, exactly. "3.25", 3 → "3250"; "45", −6 → "0.000045". */
export function shift(s: string, k: number): string {
  const d = readDecimal(s);
  if (!d) return 'NaN';
  let digits = d.digits, point = d.point + k;
  if (point < 0) { digits = '0'.repeat(-point) + digits; point = 0; }
  if (point > digits.length) digits = digits + '0'.repeat(point - digits.length);
  let int = digits.slice(0, point).replace(/^0+(?=\d)/, ''), frac = digits.slice(point).replace(/0+$/, '');
  if (int === '') int = '0';
  const out = frac ? `${int}.${frac}` : int;
  return (d.neg && /[1-9]/.test(out) ? '−' : '') + out;
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export const pow10 = (e: number) => '10' + String(e).split('').map((c) => SUP[c]).join('');

/** Convert v (text) from prefix exponent e1 to e2: multiply by 10^(e1 − e2). */
export function convert(v: string, e1: number, e2: number): { out: string; k: number; words: string } {
  const k = e1 - e2, out = shift(v, k);
  const words = k === 0 ? 'Same prefix: nothing to do.' : `Multiply by ${pow10(k)}: move the decimal point ${Math.abs(k)} place${Math.abs(k) === 1 ? '' : 's'} to the ${k > 0 ? 'right' : 'left'}.`;
  return { out, k, words };
}

/** Add two measurements: only when the units measure the same thing. The answer is in the smaller prefix. */
export function addUp(v1: string, e1: number, u1: string, v2: string, e2: number, u2: string): { ok: true; out: string; e: number; a: string; b: string } | { ok: false; why: string } {
  const U1 = UNITS.find((u) => u.sym === u1), U2 = UNITS.find((u) => u.sym === u2);
  if (!U1 || !U2) return { ok: false, why: 'Unknown unit.' };
  if (U1.kind !== U2.kind) return { ok: false, why: `You can't add a ${U1.kind} (${U1.name}s) to a ${U2.kind} (${U2.name}s): they measure different things.` };
  if (!readDecimal(v1) || !readDecimal(v2)) return { ok: false, why: 'Type plain numbers like 2.5 or 0.04.' };
  const e = Math.min(e1, e2), a = shift(v1, e1 - e), b = shift(v2, e2 - e);
  return { ok: true, out: addText(a, b), e, a, b };
}

/** Exact sum of two decimal texts (which may start with −). */
export function addText(a: string, b: string): string {
  const A = readDecimal(a.replace('−', '-'))!, B = readDecimal(b.replace('−', '-'))!;
  const fa = A.digits.length - A.point, fb = B.digits.length - B.point, f = Math.max(fa, fb);
  const ia = BigInt(A.digits + '0'.repeat(f - fa)) * (A.neg ? -1n : 1n), ib = BigInt(B.digits + '0'.repeat(f - fb)) * (B.neg ? -1n : 1n);
  const s = ia + ib, neg = s < 0n, abs = (neg ? -s : s).toString().padStart(f + 1, '0');
  const txt = f ? `${abs.slice(0, abs.length - f)}.${abs.slice(abs.length - f)}` : abs;
  return shift((neg ? '-' : '') + txt, 0);
}

/** Scientific form of a decimal text: "0.000045" → { m: "4.5", e: −5 }. */
export function sci(v: string): { m: string; e: number } | null {
  const d = readDecimal(v.replace('−', '-'));
  if (!d) return null;
  const i = d.digits.search(/[1-9]/);
  if (i < 0) return { m: '0', e: 0 };
  const e = d.point - i - 1;
  return { m: (d.neg ? '−' : '') + shift(d.digits.slice(i), 1 - (d.digits.length - i)), e };
}
