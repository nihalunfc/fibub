// Number systems translator (#1235): Roman, Egyptian, Mayan, Babylonian, any base 2 to 16, and Indian place value
// with lakh and crore names. Plain TypeScript, no DOM.

const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];

/** Roman numeral pieces for 1 to 3999, largest first, e.g. 1994 → [[1000,'M'],[900,'CM'],[90,'XC'],[4,'IV']]. */
export function romanParts(n: number): [number, string][] {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return [];
  const out: [number, string][] = [];
  for (const [v, s] of ROMAN) while (n >= v) { out.push([v, s]); n -= v; }
  return out;
}
export const toRoman = (n: number) => romanParts(n).map((p) => p[1]).join('');

/** Read a Roman numeral (standard form only). Returns NaN for anything that is not written the standard way. */
export function fromRoman(s: string): number {
  const t = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(t)) return NaN;
  const val: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let n = 0;
  for (let i = 0; i < t.length; i++) { const a = val[t[i]], b = val[t[i + 1]] ?? 0; n += a < b ? -a : a; }
  return n >= 1 && n <= 3999 && toRoman(n) === t ? n : NaN;
}

/** Digits of n in base b, most significant first. 0 → [0]. */
export function toBase(n: number, b: number): number[] {
  if (n === 0) return [0];
  const d: number[] = [];
  while (n > 0) { d.unshift(n % b); n = Math.floor(n / b); }
  return d;
}
export const DIGITS = '0123456789ABCDEF';
export const baseText = (n: number, b: number) => toBase(n, b).map((x) => DIGITS[x]).join('');

/** Read digits in base b (2 to 16). NaN if a digit is not allowed in that base. */
export function fromBase(s: string, b: number): number {
  const t = s.trim().toUpperCase();
  if (!t) return NaN;
  let n = 0;
  for (const c of t) { const v = DIGITS.indexOf(c); if (v < 0 || v >= b) return NaN; n = n * b + v; }
  return n;
}

/** Egyptian: how many of each sign, from 1 (index 0) to 1,000,000 (index 6). n up to 9,999,999. */
export const egyptian = (n: number) => [0, 1, 2, 3, 4, 5, 6].map((k) => Math.floor(n / 10 ** k) % 10);

/** Mayan levels (base 20), highest first, each split into bars (5) and dots (1). */
export const mayan = (n: number) => toBase(n, 20).map((v) => ({ v, bars: Math.floor(v / 5), dots: v % 5 }));

/** Babylonian places (base 60), highest first, each split into tens (chevrons) and ones (wedges). */
export const babylonian = (n: number) => toBase(n, 60).map((v) => ({ v, tens: Math.floor(v / 10), ones: v % 10 }));

/** Indian place names for the digits of n, ones first. */
export const INDIAN_PLACES = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Lakhs', 'Ten lakhs', 'Crores', 'Ten crores', 'Arabs'];

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const two = (n: number) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
const three = (n: number) => [n >= 100 ? `${ONES[Math.floor(n / 100)]} hundred` : '', n % 100 ? two(n % 100) : ''].filter(Boolean).join(' ');

/** A whole number from 0 to 99,99,99,999 in words, the Indian way (crore, lakh, thousand). */
export function indianWords(n: number): string {
  if (n === 0) return 'zero';
  const crore = Math.floor(n / 1e7), lakh = Math.floor(n / 1e5) % 100, thou = Math.floor(n / 1000) % 100, rest = n % 1000;
  return [crore ? `${crore < 100 ? two(crore) : three(crore)} crore` : '', lakh ? `${two(lakh)} lakh` : '', thou ? `${two(thou)} thousand` : '', rest ? three(rest) : ''].filter(Boolean).join(' ');
}

/** The same number in words, the international way (million, thousand). */
export function intlWords(n: number): string {
  if (n === 0) return 'zero';
  const mil = Math.floor(n / 1e6), thou = Math.floor(n / 1000) % 1000, rest = n % 1000;
  return [mil ? `${three(mil)} million` : '', thou ? `${three(thou)} thousand` : '', rest ? three(rest) : ''].filter(Boolean).join(' ');
}
