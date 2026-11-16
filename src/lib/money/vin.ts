// VIN checks: pure maths, no DOM, no lookups.
const TR: Record<string, number> = {};
'0123456789'.split('').forEach((c, i) => (TR[c] = i));
'ABCDEFGH'.split('').forEach((c, i) => (TR[c] = i + 1));
'JKLMN'.split('').forEach((c, i) => (TR[c] = i + 1));
TR.P = 7; TR.R = 9;
'STUVWXYZ'.split('').forEach((c, i) => (TR[c] = i + 2));
export const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const YEAR_CODES = 'ABCDEFGHJKLMNPRSTUVWXY123456789';

export function cleanVin(s: string) { return s.toUpperCase().replace(/[\s-]/g, ''); }
export function badChars(v: string) { return [...new Set(v.split('').filter((c) => !/[A-HJ-NPR-Z0-9]/.test(c)))]; }
export function checkDigit(v: string): string | null {
  if (v.length !== 17 || badChars(v).length) return null;
  const sum = v.split('').reduce((a, c, i) => a + TR[c] * WEIGHTS[i], 0);
  const r = sum % 11; return r === 10 ? 'X' : String(r);
}
export function region(c: string) {
  if (/[A-H]/.test(c)) return 'Africa';
  if (/[J-R]/.test(c)) return 'Asia';
  if (/[S-Z]/.test(c)) return 'Europe';
  if (/[1-5]/.test(c)) return 'North America';
  if (/[67]/.test(c)) return 'Oceania';
  if (/[89]/.test(c)) return 'South America';
  return 'Unknown';
}
export function years(c: string): [number, number] | null {
  const i = YEAR_CODES.indexOf(c); return i < 0 ? null : [1980 + i, 2010 + i];
}
export function analyse(raw: string) {
  const v = cleanVin(raw);
  const bad = badChars(v);
  const out: any = { vin: v, length: v.length, bad, okLength: v.length === 17 };
  if (!out.okLength || bad.length) return out;
  out.expected = checkDigit(v); out.actual = v[8]; out.valid = out.expected === out.actual;
  out.region = region(v[0]); out.years = years(v[9]); out.plant = v[10];
  out.checkRequired = /[1-5]/.test(v[0]);
  return out;
}

// ---- added 2026-11-16 ----
/** Country from the first characters (ISO 3779 blocks). Only blocks we are sure of; null otherwise. */
export function country(v: string): string | null {
  const a = v[0], b = v[1] ?? '';
  if (/[145]/.test(a)) return 'United States';
  if (a === '2') return 'Canada';
  if (a === '3') return /[A-W]/.test(b) ? 'Mexico' : null;
  if (a === '6') return /[A-W]/.test(b) ? 'Australia' : null;
  if (a === 'J') return 'Japan';
  if (a === 'L') return 'China';
  if (a === 'W') return 'Germany';
  if (a === 'K') return /[L-R]/.test(b) ? 'South Korea' : null;
  if (a === 'M') return /[A-E]/.test(b) ? 'India' : null;
  if (a === 'S') return /[A-M]/.test(b) ? 'United Kingdom' : null;
  if (a === 'V') return /[F-R]/.test(b) ? 'France' : /[S-W]/.test(b) ? 'Spain' : null;
  if (a === 'Z') return /[A-R]/.test(b) ? 'Italy' : null;
  return null;
}
/** North American cars: position 7 a letter means the 2010 to 2039 cycle, a digit the 1980 to 2009 cycle. Null if it does not apply. */
export function likelyYear(v: string): number | null {
  if (v.length !== 17 || !/[1-5]/.test(v[0])) return null;
  const y = years(v[9]); if (!y) return null;
  return /[A-Z]/.test(v[6]) ? y[1] : y[0];
}
/** Each position's value, weight and product for the check digit sum. */
export function workings(v: string) {
  if (v.length !== 17 || badChars(v).length) return null;
  const rows = v.split('').map((c, i) => ({ pos: i + 1, ch: c, value: TR[c], weight: WEIGHTS[i], product: TR[c] * WEIGHTS[i] }));
  const sum = rows.reduce((a, r) => a + r.product, 0);
  return { rows, sum, rest: sum % 11 };
}
/** Typing fixes for the letters I, O and Q (never used in a VIN): I becomes 1, O and Q become 0. Returns the fixed VIN and whether its check digit then works. */
export function suggestFix(v: string): { vin: string; valid: boolean } | null {
  if (v.length !== 17 || !/[IOQ]/.test(v)) return null;
  const f = v.replace(/[IO]/g, (c) => (c === 'I' ? '1' : '0')).replace(/Q/g, '0');
  const d = checkDigit(f);
  return d ? { vin: f, valid: d === f[8] } : null;
}
