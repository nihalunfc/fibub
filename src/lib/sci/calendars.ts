// Historic calendar conversions through the Julian Day Number (JDN: the day count whose day 0 is 1 January 4713 BC,
// Julian calendar; noon-based JD rounded to the civil day). Years are astronomical (0 = 1 BC, −1 = 2 BC).
// Algorithms: Fliegel and Van Flandern (1968) / Richards (Explanatory Supplement, 2013) for Gregorian and Julian;
// the arithmetic (tabular) Islamic calendar with leap years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 of each
// 30-year cycle and epoch 16 July 622 (Julian); the arithmetic Hebrew calendar as in Dershowitz and Reingold,
// "Calendrical Calculations". Plain TypeScript, no DOM.

const fl = Math.floor;
export type YMD = { y: number; m: number; d: number };

export function gregorianToJdn(y: number, m: number, d: number): number {
  const a = fl((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3;
  return d + fl((153 * M + 2) / 5) + 365 * Y + fl(Y / 4) - fl(Y / 100) + fl(Y / 400) - 32045;
}
export function julianToJdn(y: number, m: number, d: number): number {
  const a = fl((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3;
  return d + fl((153 * M + 2) / 5) + 365 * Y + fl(Y / 4) - 32083;
}
function fromC(c: number, b: number): YMD {
  const d = fl((4 * c + 3) / 1461), e = c - fl((1461 * d) / 4), m = fl((5 * e + 2) / 153);
  return { y: b + d - 4800 + fl(m / 10), m: m + 3 - 12 * fl(m / 10), d: e - fl((153 * m + 2) / 5) + 1 };
}
export function jdnToGregorian(j: number): YMD {
  const a = j + 32044, b = fl((4 * a + 3) / 146097), c = a - fl((146097 * b) / 4);
  return fromC(c, 100 * b);
}
export function jdnToJulian(j: number): YMD { return fromC(j + 32082, 0); }

export const isGregorianLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const isJulianLeap = (y: number) => ((y % 4) + 4) % 4 === 0;
export const monthDays = (y: number, m: number, julian = false) => [31, (julian ? isJulianLeap(y) : isGregorianLeap(y)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

/** 0 = Sunday … 6 = Saturday. */
export const weekday = (j: number) => (((j + 1) % 7) + 7) % 7;
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Islamic (tabular, civil epoch: 1 Muharram AH 1 = Friday 16 July 622 Julian = JDN 1948440).
export const ISLAMIC_EPOCH = 1948440;
export const isIslamicLeap = (y: number) => (((14 + 11 * y) % 30) + 30) % 30 < 11;
export function islamicToJdn(y: number, m: number, d: number): number {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + fl((3 + 11 * y) / 30) + ISLAMIC_EPOCH - 1;
}
export function jdnToIslamic(j: number): YMD {
  const y = fl((30 * (j - ISLAMIC_EPOCH) + 10646) / 10631);
  const m = Math.min(12, Math.ceil((j - 29 - islamicToJdn(y, 1, 1)) / 29.5) + 1);
  return { y, m, d: j - islamicToJdn(y, m, 1) + 1 };
}
export const islamicMonthDays = (y: number, m: number) => (m % 2 === 1 || (m === 12 && isIslamicLeap(y)) ? 30 : 29);
export const ISLAMIC_MONTHS = ['Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani", 'Jumada al-ula', 'Jumada al-akhirah', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];

// Hebrew (arithmetic). Months are numbered from Nisan = 1; the year number changes at Tishri = 7. Adar II = 13.
const RD_TO_JDN = 1721425, HEBREW_EPOCH_RD = -1373427;
export const isHebrewLeap = (y: number) => (((7 * y + 1) % 19) + 19) % 19 < 7;
function elapsed(y: number): number {
  const months = fl((235 * y - 234) / 19), parts = 12084 + 13753 * months, day = 29 * months + fl(parts / 25920);
  return (((3 * (day + 1)) % 7) + 7) % 7 < 3 ? day + 1 : day;
}
function newYearRd(y: number): number {
  const a = elapsed(y - 1), b = elapsed(y), c = elapsed(y + 1);
  return HEBREW_EPOCH_RD + b + (c - b === 356 ? 2 : b - a === 382 ? 1 : 0);
}
export const hebrewYearDays = (y: number) => newYearRd(y + 1) - newYearRd(y);
export function hebrewMonthDays(y: number, m: number): number {
  const len = hebrewYearDays(y);
  if ([2, 4, 6, 10, 13].includes(m) || (m === 12 && !isHebrewLeap(y)) || (m === 8 && len % 10 !== 5) || (m === 9 && len % 10 === 3)) return 29;
  return 30;
}
export const hebrewMonths = (y: number) => (isHebrewLeap(y) ? 13 : 12);
function hebrewToRd(y: number, m: number, d: number): number {
  let r = newYearRd(y) + d - 1;
  if (m < 7) { for (let k = 7; k <= hebrewMonths(y); k++) r += hebrewMonthDays(y, k); for (let k = 1; k < m; k++) r += hebrewMonthDays(y, k); }
  else for (let k = 7; k < m; k++) r += hebrewMonthDays(y, k);
  return r;
}
export const hebrewToJdn = (y: number, m: number, d: number) => hebrewToRd(y, m, d) + RD_TO_JDN;
export function jdnToHebrew(j: number): YMD {
  const rd = j - RD_TO_JDN;
  const approx = fl((rd - HEBREW_EPOCH_RD) / (35975351 / 98496)) + 1;
  let y = approx - 1;
  while (newYearRd(y + 1) <= rd) y++;
  let m = rd < hebrewToRd(y, 1, 1) ? 7 : 1;
  while (rd > hebrewToRd(y, m, hebrewMonthDays(y, m))) m++;
  return { y, m, d: rd - hebrewToRd(y, m, 1) + 1 };
}
export const hebrewMonthName = (y: number, m: number) => (m === 12 && isHebrewLeap(y) ? 'Adar I' : ['Nisan', 'Iyyar', 'Sivan', 'Tammuz', 'Av', 'Elul', 'Tishri', 'Marheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Adar II'][m - 1]);
/** Hebrew months in the order of the year (Tishri first). */
export const hebrewMonthOrder = (y: number) => [7, 8, 9, 10, 11, 12, ...(isHebrewLeap(y) ? [13] : []), 1, 2, 3, 4, 5, 6];

export type CalendarId = 'gregorian' | 'julian' | 'islamic' | 'hebrew';
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function toJdn(cal: CalendarId, y: number, m: number, d: number): number {
  return cal === 'gregorian' ? gregorianToJdn(y, m, d) : cal === 'julian' ? julianToJdn(y, m, d) : cal === 'islamic' ? islamicToJdn(y, m, d) : hebrewToJdn(y, m, d);
}
export function fromJdn(cal: CalendarId, j: number): YMD {
  return cal === 'gregorian' ? jdnToGregorian(j) : cal === 'julian' ? jdnToJulian(j) : cal === 'islamic' ? jdnToIslamic(j) : jdnToHebrew(j);
}
export function monthCount(cal: CalendarId, y: number) { return cal === 'hebrew' ? hebrewMonths(y) : 12; }
export function daysIn(cal: CalendarId, y: number, m: number) {
  return cal === 'gregorian' ? monthDays(y, m) : cal === 'julian' ? monthDays(y, m, true) : cal === 'islamic' ? islamicMonthDays(y, m) : hebrewMonthDays(y, m);
}
export function monthName(cal: CalendarId, y: number, m: number) {
  return cal === 'islamic' ? ISLAMIC_MONTHS[m - 1] : cal === 'hebrew' ? hebrewMonthName(y, m) : MONTHS[m - 1];
}
/** A message if the date does not exist in that calendar, else ''. */
export function invalid(cal: CalendarId, y: number, m: number, d: number): string {
  if (![y, m, d].every(Number.isInteger)) return 'Year, month and day must be whole numbers.';
  if (Math.abs(y) > 100000) return 'Keep the year within ±100,000.';
  if (cal === 'hebrew' && y < 1) return 'Hebrew years start at 1 AM (7 October 3761 BC, Julian).';
  if (cal === 'islamic' && y < 1) return 'Islamic years start at AH 1 (16 July 622, Julian).';
  if (m < 1 || m > monthCount(cal, y)) return cal === 'hebrew' && m === 13 ? `${y} AM is not a leap year, so it has no Adar II.` : 'That month does not exist.';
  const n = daysIn(cal, y, m);
  if (d < 1 || d > n) return `${monthName(cal, y, m)} ${y} has ${n} days.`;
  return '';
}
/** Years for display: Julian and Gregorian as AD / BC, Islamic AH, Hebrew AM. */
export function yearLabel(cal: CalendarId, y: number): string {
  if (cal === 'islamic') return `${y} AH`;
  if (cal === 'hebrew') return `${y} AM`;
  return y > 0 ? `${y}` : `${1 - y} BC`;
}
export const format = (cal: CalendarId, v: YMD) => `${v.d} ${monthName(cal, v.y, v.m)} ${yearLabel(cal, v.y)}`;
/** The date as used in most of Europe at the time: Julian before 15 October 1582, Gregorian from then on. */
export const historicalIsGregorian = (j: number) => j >= 2299161;
