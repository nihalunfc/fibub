// Calendar maker maths (#1231): how a calendar of whole days and whole months slips against the seasons. A year of
// seasons is about 365.2422 days and a month of Moon phases about 29.5306 days, and neither divides evenly, so
// calendars add leap days (solar) or an extra month, adhik maas (lunisolar). Mean values; no DOM.

export const TROPICAL = 365.24219;     // days, equinox to equinox (mean)
export const SYNODIC = 29.530589;      // days, new moon to new moon (mean)
export const LUNAR_YEAR = 12 * SYNODIC; // 354.367 days

export const isLeapGregorian = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const isLeapJulian = (y: number) => y % 4 === 0;

/** Leap years from year a to year b inclusive (Gregorian rule). */
export function leapsBetween(a: number, b: number): number {
  const f = (y: number) => Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
  return a > b ? 0 : f(b) - f(a - 1);
}

export type Kind = 'plain' | 'julian' | 'gregorian' | 'lunar' | 'lunisolar';
export const KINDS: Record<Kind, { name: string; year: number }> = {
  plain: { name: '365 days, no leap years', year: 365 },
  julian: { name: 'Julian: leap every 4 years', year: 365.25 },
  gregorian: { name: 'Gregorian: skip 3 leaps in 400 years', year: 365.2425 },
  lunar: { name: '12 Moon months (like the Hijri calendar)', year: LUNAR_YEAR },
  lunisolar: { name: 'Moon months + adhik maas (like Indian calendars)', year: NaN },
};

/** Lunisolar calendar with the simple rule "add a 13th month whenever the calendar has fallen more than half a month behind
 *  the seasons". Returns the months used, the adhik maas years (1-based) and how far behind it ends, in days. */
export function lunisolar(years: number): { months: number; adhik: number[]; lag: number } {
  let months = 0; const adhik: number[] = [];
  for (let y = 1; y <= years; y++) {
    months += 12;
    if (y * TROPICAL - months * SYNODIC > SYNODIC / 2) { months++; adhik.push(y); }
  }
  return { months, adhik, lag: years * TROPICAL - months * SYNODIC };
}

/** After `years` calendar years, how many days later in the calendar the seasons arrive (positive) or earlier
 *  (negative) than at the start. A calendar year shorter than the true year makes the seasons come later. */
export function slip(kind: Kind, years: number): number {
  if (kind === 'lunisolar') return lunisolar(years).lag;
  return years * (TROPICAL - KINDS[kind].year);
}

/** Years until a calendar is a whole `days` out. */
export const yearsToSlip = (kind: Exclude<Kind, 'lunisolar'>, days: number) => days / Math.abs(TROPICAL - KINDS[kind].year);

/** The Metonic cycle: 19 years of seasons are almost exactly 235 Moon months (7 of them extra). */
export const metonic = () => ({ years: 19 * TROPICAL, months: 235 * SYNODIC, diffHours: (19 * TROPICAL - 235 * SYNODIC) * 24 });
