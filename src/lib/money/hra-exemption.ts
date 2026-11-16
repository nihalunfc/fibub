// HRA exemption (#1743), old tax regime only. Plain TypeScript, no DOM.
// Exempt HRA is the least of: (1) HRA received, (2) rent paid minus 10% of salary, (3) 50% of salary in the
// listed cities or 40% elsewhere. Salary here = Basic + DA (where DA counts for retirement benefits)
// + commission as a fixed % of turnover.
export const METRO_OLD = ['mumbai', 'delhi', 'kolkata', 'chennai'];
export const METRO_NEW = [...METRO_OLD, 'bengaluru', 'hyderabad', 'pune', 'ahmedabad']; // Income-tax Rules 2026, from FY 2026-27

export type HraIn = { salary: number; hra: number; rent: number; city: string; fy2026: boolean };
export type HraOut = { limits: [number, number, number]; pct: number; exempt: number; taxable: number; which: 0 | 1 | 2; fullRent: number };

export function hraExempt(raw: HraIn): HraOut {
  const clean = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);
  const a = { ...raw, salary: clean(raw.salary), hra: clean(raw.hra), rent: clean(raw.rent) };
  const pct = (a.fy2026 ? METRO_NEW : METRO_OLD).includes(a.city) ? 50 : 40;
  const limits: [number, number, number] = [a.hra, Math.max(0, a.rent - 0.1 * a.salary), (pct / 100) * a.salary];
  const exempt = Math.max(0, Math.min(...limits));
  const which = limits.indexOf(Math.min(...limits)) as 0 | 1 | 2;
  return { limits, pct, exempt, taxable: Math.max(0, a.hra - exempt), which, fullRent: a.hra + 0.1 * a.salary };
}

// ---- Extras: yearly view, tax saved, rent what-if ----
const pos = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);
export const CESS = 0.04; // health and education cess on income tax
/** Yearly figures: months with rent get the monthly exemption, other months' HRA is fully taxable. */
export function hraYear(a: HraIn, months: number) {
  const m = Math.min(12, Math.max(0, Math.floor(pos(months))));
  const o = hraExempt(a);
  return { exempt: o.exempt * m, taxable: o.taxable * m + pos(a.hra) * (12 - m), rentYear: pos(a.rent) * m };
}
/** Income tax saved by the exemption at a slab rate (for example 0.20), with 4% cess. Ignores surcharge. */
export const taxSaved = (exemptYear: number, slabRate: number) => Math.round(pos(exemptYear) * pos(slabRate) * (1 + CESS));
/** Exemption (a month) with a different rent, everything else the same. */
export const withRent = (a: HraIn, rent: number) => hraExempt({ ...a, rent: pos(rent) });
/** True when yearly rent is over Rs 1,00,000: employers ask for the landlord's PAN. */
export const needsLandlordPan = (rentYear: number) => rentYear > 100000;
