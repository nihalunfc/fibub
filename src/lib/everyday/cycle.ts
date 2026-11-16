// Pure date and time maths for the sleep, due date and ovulation tools. No DOM. Checked in tests/everyday.mjs.
export const DAY = 86400000;

// ---- Sleep --------------------------------------------------------------
/** Minute of day for n cycles: going to bed (back = false) gives the wake time; back = true gives the bedtime for a wake time t. */
export const sleepTime = (t: number, n: number, cycle: number, fall: number, back: boolean) => {
  const at = back ? t - n * cycle - fall : t + fall + n * cycle;
  return ((Math.round(at) % 1440) + 1440) % 1440;
};
/** Whole-cycle counts whose sleep fits inside lo..hi hours (largest first); falls back to 6, 5, 4. */
export const cyclesFor = (loH: number, hiH: number, cycle: number) => {
  const out: number[] = [];
  for (let n = Math.ceil((loH * 60 - 1e-9) / cycle); n * cycle <= hiH * 60 + 1e-9 && n <= 12; n++) if (n >= 1) out.unshift(n);
  return out.length ? out : [6, 5, 4];
};
export const AGES: Record<string, [string, number, number]> = {
  inf: ['4 to 12 months', 12, 16], tod: ['1 to 2 years', 11, 14], pre: ['3 to 5 years', 10, 13], sch: ['6 to 12 years', 9, 12],
  teen: ['13 to 18 years', 8, 10], adult: ['Adults 18 to 64', 7, 9], senior: ['65 and over', 7, 8],
};

// ---- Due date -----------------------------------------------------------
/** Days from the known date to the due date, by method. */
export const ADD: Record<string, number> = { lmp: 280, con: 266, d3: 263, d5: 261 };
/** Due date (ms, UTC midnight) from a known date. For scan: scan date and age on that date in days. */
export const dueDate = (method: string, t: number, cycleDays = 28, scanAgeDays = 0) =>
  method === 'scan' ? t + (280 - scanAgeDays) * DAY : t + (ADD[method] + (method === 'lmp' ? cycleDays - 28 : 0)) * DAY;
/** Whole days pregnant on a date, counted from the date that is 280 days before the due date. */
export const gaDays = (due: number, on: number) => Math.floor((on - (due - 280 * DAY)) / DAY);
/** Progress through the 40 weeks, 0 to 100. */
export const progressPct = (ga: number) => Math.max(0, Math.min(100, (ga / 280) * 100));

// ---- Ovulation ----------------------------------------------------------
/** Ovulation is taken as `luteal` days before the next period, which starts `c` days after this one. */
export const ovulationDay = (periodStart: number, c: number, luteal = 14) => periodStart + (c - luteal) * DAY;
/** Calendar (Knaus-Ogino) range from the shortest and longest recent cycles: first fertile day = shortest - 18, last = longest - 11, counting the first day of the period as day 1. Returns [first, last] dates. */
export const calendarRange = (periodStart: number, shortest: number, longest: number): [number, number] => [periodStart + (shortest - 19) * DAY, periodStart + (longest - 12) * DAY];
/** Cycle day (1 = first day of period) on a date for a list of period starts; 0 when before the first. */
export const cycleDay = (starts: number[], on: number) => {
  let d = 0; for (const s of starts) if (on >= s) d = Math.floor((on - s) / DAY) + 1;
  return d;
};
