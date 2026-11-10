// Standard form (scientific notation) ladder (#1237): exact decimal-string conversion to and from a × 10ⁿ,
// significant figures, order of magnitude, and sizes of things for the powers-of-ten ladder. Plain TypeScript, no DOM.

export type Std = {
  neg: boolean;
  digits: string;   // significant digits, e.g. "345" for 345000 or "120" for 0.000120
  exp: number;      // n in a × 10ⁿ
  mant: string;     // a as text, e.g. "3.45"
  sig: number;      // significant figures (trailing zeros of a whole number with no point are not counted)
  zero: boolean;
};

/** Read "345000", "0.000120", "1.2e5", "1.2 × 10^5", "1,20,000", "−4.5x10^-3". Returns null if not a number. */
export function parseStd(s: string): Std | null {
  const t = s.trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (c) => (c === '⁻' ? '-' : String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)))).replace(/[\s,_]/g, '').replace(/[−–]/g, '-').replace(/(?:×|x|X|\*)10\^?\(?([+-]?\d+)\)?$/, 'e$1');
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(t);
  if (!m || (!m[2] && !m[3])) return null;
  const int = m[2] ?? '', frac = m[3] ?? '', e = m[4] ? Number(m[4]) : 0, dot = m[3] !== undefined;
  const all = int + frac, f = all.search(/[1-9]/);
  if (f < 0) return { neg: false, digits: '0', exp: 0, mant: '0', sig: 1, zero: true };
  let digits = all.slice(f);
  if (!dot) digits = digits.replace(/0+$/, '') || '0';
  const exp = int.length + e - f - 1;
  const mant = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
  return { neg: m[1] === '-', digits, exp, mant, sig: digits.length, zero: false };
}

/** Write significant digits × 10^exp as an ordinary decimal, e.g. ("345", 5) → "345000", ("72", −4) → "0.00072". */
export function plain(digits: string, exp: number, neg = false): string {
  const p = exp + 1; // digits before the point
  let s: string;
  if (p <= 0) s = '0.' + '0'.repeat(-p) + digits;
  else if (p >= digits.length) s = digits + '0'.repeat(p - digits.length);
  else s = digits.slice(0, p) + '.' + digits.slice(p);
  return (neg ? '−' : '') + s;
}

/** Order of magnitude: the power of ten nearest on a log scale (a ≥ √10 ≈ 3.162 rounds up). */
export const orderOfMagnitude = (x: number) => Math.round(Math.log10(Math.abs(x)));

/** Sizes of things in metres (well-known round figures) for the ladder. */
export const THINGS: { name: string; say: string; m: number }[] = [
  { name: 'proton', say: 'a proton', m: 1.7e-15 },
  { name: 'atom', say: 'an atom', m: 1e-10 },
  { name: 'virus', say: 'a virus', m: 1e-7 },
  { name: 'red blood cell', say: 'a red blood cell', m: 8e-6 },
  { name: 'hair width', say: 'the width of a hair', m: 1e-4 },
  { name: 'ant', say: 'an ant', m: 3e-3 },
  { name: 'person', say: 'a person', m: 1.7 },
  { name: 'Qutub Minar', say: 'the Qutub Minar', m: 73 },
  { name: 'Mount Everest', say: 'Mount Everest', m: 8849 },
  { name: 'Earth (across)', say: 'the Earth (across)', m: 1.274e7 },
  { name: 'Earth to Moon', say: 'the Earth to Moon distance', m: 3.844e8 },
  { name: 'Sun (across)', say: 'the Sun (across)', m: 1.392e9 },
  { name: 'Earth to Sun', say: 'the Earth to Sun distance', m: 1.496e11 },
  { name: 'light year', say: 'a light year', m: 9.461e15 },
  { name: 'Milky Way (across)', say: 'the Milky Way (across)', m: 1e21 },
  { name: 'observable universe', say: 'the observable universe', m: 8.8e26 },
];
