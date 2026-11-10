// #1739 CPP start age: plain maths, no DOM. Rules checked on canada.ca 2026-11-10.
export const CPP_EARLY = 0.006, CPP_LATE = 0.007, OAS_LATE = 0.006, OAS_75 = 0.10;
export const OAS_MAX_65 = 762.50; // Oct to Dec 2026, age 65 to 74
export const OAS_THRESHOLD = 95323, OAS_CLAW = 0.15; // 2026 income year

/** Share of the age-65 CPP pension paid when it starts at `age` (60 to 70, any number of months). */
export function cppFactor(age: number): number {
  const m = Math.round((Math.min(70, Math.max(60, age)) - 65) * 12);
  return 1 + (m < 0 ? CPP_EARLY : CPP_LATE) * m;
}
/** Share of the age-65 OAS pension paid when it starts at `age` (65 to 70). */
export function oasFactor(age: number): number {
  return 1 + OAS_LATE * Math.round((Math.min(70, Math.max(65, age)) - 65) * 12);
}
/** Age at which starting at `b` (later) has paid as much in total as starting at `a` (earlier). */
export function breakEven(a: number, fa: number, b: number, fb: number): number | null {
  if (fb <= fa) return null;
  return (fb * b - fa * a) / (fb - fa);
}
/** Total paid from `start` up to `until` (no indexing), with OAS's 10% rise at 75 if `oas`. */
export function totalTo(monthly: number, start: number, until: number, oas = false): number {
  if (until <= start) return 0;
  if (!oas || until <= 75) return monthly * 12 * (until - start);
  const pre = Math.max(0, 75 - start);
  return monthly * 12 * pre + monthly * (1 + OAS_75) * 12 * (until - Math.max(75, start));
}
/** Yearly OAS recovery tax ("clawback"): 15% of net income above the threshold, never more than the OAS paid. */
export function clawback(income: number, yearlyOas: number, threshold = OAS_THRESHOLD): number {
  return Math.min(yearlyOas, Math.max(0, (income - threshold) * OAS_CLAW));
}
/** Break-even for OAS, which also rises 10% at 75: first month (as an age) when the later start has paid as much in total. */
export function breakEvenOas(a: number, fa: number, b: number, fb: number): number | null {
  if (fb <= fa) return null;
  for (let m = b * 12; m <= 120 * 12; m++) if (totalTo(fb, b, m / 12, true) >= totalTo(fa, a, m / 12, true) - 1e-9) return m / 12;
  return null;
}
