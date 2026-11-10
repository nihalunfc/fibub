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
