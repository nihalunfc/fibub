// Physical presence for a Canadian citizenship grant, following IRCC (checked 2026-11-10):
// - Check if you are eligible: https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/adult-minor/who/check-adult-eligibility.html
//   1,095 days in the 5 years before you apply; days as a temporary resident or protected person before PR count
//   as half days, up to 365 days of credit.
// - Physical presence calculator form CIT 0407: https://www.canada.ca/content/dam/ircc/documents/pdf/english/kits/forms/cit0407/01-05-2019/cit0407e.pdf
//   only full days outside Canada are absences (the day you left and the day you returned count as days in Canada);
//   the period runs from 5 years before the signing date up to, but not including, the signing date.
// Not affiliated with IRCC: check the official source.

export const NEED = 1095;
export const CREDIT_CAP = 365;
const DAY = 86400000;
/** 'YYYY-MM-DD' -> whole days since 1970-01-01 (UTC), or NaN. */
export const toDay = (s: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY : NaN; };
export const fromDay = (d: number) => new Date(d * DAY).toISOString().slice(0, 10);
/** The same date 5 years earlier (29 February becomes 1 March). */
const fiveBefore = (d: number) => { const x = new Date(d * DAY); return Date.UTC(x.getUTCFullYear() - 5, x.getUTCMonth(), x.getUTCDate()) / DAY; };

export type Trip = { left: number; back: number };
/** Full days outside Canada on one trip. */
export const tripDays = (t: Trip) => Math.max(0, t.back - t.left - 1);

export type Count = { sign: number; from: number; prDays: number; prAway: number; trDays: number; trAway: number; credit: number; total: number };

export function count(sign: number, pr: number, trStart: number | null, away: Set<number>): Count {
  const from = fiveBefore(sign);
  let prDays = 0, prAway = 0, trDays = 0, trAway = 0;
  for (let d = Math.max(pr, from); d < sign; d++) { if (away.has(d)) prAway++; else prDays++; }
  if (trStart !== null) for (let d = Math.max(trStart, from); d < Math.min(pr, sign); d++) { if (away.has(d)) trAway++; else trDays++; }
  const credit = Math.min(CREDIT_CAP, trDays / 2);
  return { sign, from, prDays, prAway, trDays, trAway, credit, total: prDays + credit };
}

export function awaySet(trips: Trip[]) {
  const s = new Set<number>();
  for (const t of trips) for (let d = t.left + 1; d < t.back; d++) s.add(d);
  return s;
}

/** Earliest signing date with at least 1,095 days, assuming you are in Canada apart from the trips listed. */
export function earliest(pr: number, trStart: number | null, trips: Trip[]): Count | null {
  const away = awaySet(trips);
  for (let s = pr + NEED - CREDIT_CAP; s < pr + 365 * 20; s++) { const c = count(s, pr, trStart, away); if (c.total >= NEED) return c; }
  return null;
}
