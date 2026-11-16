// #1787 Social Security age: retirement benefit by claiming age from your PIA (the amount at full retirement age).
// Pure maths, no DOM, checked in tests/tools/social-security-age.mjs against SSA's own table (ssa.gov/oact/ProgData/ar_drc.html).
// Rules (ssa.gov, checked 2026-11-10): full retirement age by birth year (ssa.gov/oact/progdata/nra.html); early: 5/9 of 1%
// a month for the first 36 months, 5/12 of 1% for each month beyond (ssa.gov/oact/quickcalc/early_late.html); delayed
// retirement credits 8% a year (2/3 of 1% a month) for births 1943 and later, up to age 70. Born on 1 January: use the year before.

/** Full retirement age in months for a birth year (1943 or later). */
export function fraMonths(birthYear: number, bornJan1 = false): number {
  const y = bornJan1 ? birthYear - 1 : birthYear;
  if (y <= 1954) return 66 * 12;
  if (y >= 1960) return 67 * 12;
  return 66 * 12 + 2 * (y - 1954);
}
export const fraLabel = (m: number) => `${Math.floor(m / 12)}${m % 12 ? ` and ${m % 12} months` : ''}`;

/** Share of the PIA paid when benefits start at `ageMonths` (62 to 70, in months). */
export function factor(ageMonths: number, fra: number): number {
  const a = Math.min(70 * 12, Math.max(62 * 12, Math.round(ageMonths)));
  const early = fra - a;
  if (early > 0) return 1 - (5 / 9 / 100) * Math.min(early, 36) - (5 / 12 / 100) * Math.max(0, early - 36);
  return 1 + (8 / 12 / 100) * (a - fra);
}
/** Monthly benefit: SSA rounds the payment down to the whole dollar. */
export const benefit = (pia: number, ageMonths: number, fra: number) => Math.floor(pia * factor(ageMonths, fra) + 1e-9);

/** Age (years) at which starting later at `b` (months) has paid as much in total as starting at `a`. */
export function breakEven(pia: number, a: number, b: number, fra: number): number | null {
  const ma = benefit(pia, a, fra), mb = benefit(pia, b, fra);
  if (b <= a || mb <= ma) return null;
  return (mb * b - ma * a) / (mb - ma) / 12;
}
/** Total paid from starting age `start` (months) to age `until` (years), in today's dollars. */
export const totalTo = (pia: number, start: number, until: number, fra: number) => Math.max(0, until * 12 - start) * benefit(pia, start, fra);

/**
 * Same as totalTo, but with a yearly cost-of-living adjustment (COLA) added from the year you turn 62
 * (SSA applies each COLA to everyone getting or eligible for benefits). cola 0 gives the same as totalTo.
 * fibub's own simple model: a yearly percentage that you choose, not a forecast.
 */
export function totalToCola(pia: number, start: number, until: number, fra: number, cola: number): number {
  const base = benefit(pia, start, fra), end = Math.round(until * 12);
  let t = 0;
  for (let m = Math.round(start); m < end; m++) t += base * Math.pow(1 + cola, Math.max(0, Math.floor(m / 12) - 62));
  return t;
}
/** Cumulative benefits paid by each whole age from 62 to `maxAge` (index 0 = age 62). */
export function cumulativeByAge(pia: number, start: number, fra: number, cola: number, maxAge: number): number[] {
  const out: number[] = [];
  for (let a = 62; a <= maxAge; a++) out.push(totalToCola(pia, start, a, fra, cola));
  return out;
}
/** Age (years) when starting later at `b` has caught up with starting at `a`, scanning month by month up to age 110; null if never. */
export function breakEvenCola(pia: number, a: number, b: number, fra: number, cola: number): number | null {
  if (b <= a) return null;
  const ba = benefit(pia, a, fra), bb = benefit(pia, b, fra);
  if (bb <= ba) return null;
  let ca = 0, cb = 0;
  for (let m = Math.round(a); m < 110 * 12; m++) {
    const g = Math.pow(1 + cola, Math.max(0, Math.floor(m / 12) - 62));
    ca += ba * g; if (m >= b) cb += bb * g;
    if (m >= b && cb >= ca) return (m + 1) / 12;
  }
  return null;
}
