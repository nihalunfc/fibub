// HRA exemption (#1743), old tax regime only. Plain TypeScript, no DOM.
// Exempt HRA is the least of: (1) HRA received, (2) rent paid minus 10% of salary, (3) 50% of salary in the
// listed cities or 40% elsewhere. Salary here = Basic + DA (where DA counts for retirement benefits)
// + commission as a fixed % of turnover.
export const METRO_OLD = ['mumbai', 'delhi', 'kolkata', 'chennai'];
export const METRO_NEW = [...METRO_OLD, 'bengaluru', 'hyderabad', 'pune', 'ahmedabad']; // Income-tax Rules 2026, from FY 2026-27

export type HraIn = { salary: number; hra: number; rent: number; city: string; fy2026: boolean };
export type HraOut = { limits: [number, number, number]; pct: number; exempt: number; taxable: number; which: 0 | 1 | 2; fullRent: number };

export function hraExempt(a: HraIn): HraOut {
  const pct = (a.fy2026 ? METRO_NEW : METRO_OLD).includes(a.city) ? 50 : 40;
  const limits: [number, number, number] = [a.hra, Math.max(0, a.rent - 0.1 * a.salary), (pct / 100) * a.salary];
  const exempt = Math.max(0, Math.min(...limits));
  const which = limits.indexOf(Math.min(...limits)) as 0 | 1 | 2;
  return { limits, pct, exempt, taxable: Math.max(0, a.hra - exempt), which, fullRent: a.hra + 0.1 * a.salary };
}
