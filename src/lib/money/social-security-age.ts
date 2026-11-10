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
