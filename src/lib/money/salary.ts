// Salary converter maths (#1728). Plain TypeScript, no DOM.
export type Unit = 'hour' | 'day' | 'week' | 'biweek' | 'month' | 'year';
export type Hours = { hours: number; days: number; weeks: number };
/** Hourly pay from an amount in any unit. */
export function toHourly(unit: Unit, amt: number, h: Hours): number {
  switch (unit) {
    case 'hour': return amt;
    case 'day': return (amt * h.days) / h.hours;
    case 'week': return amt / h.hours;
    case 'biweek': return amt / 2 / h.hours;
    case 'month': return (amt * 12) / (h.weeks * h.hours);
    default: return amt / (h.weeks * h.hours);
  }
}
/** Pay for one week of `weekPay` in every unit: hour, day, week, two weeks, month, year. */
export const perUnits = (weekPay: number, h: Hours) => ({ hour: weekPay / h.hours, day: weekPay / h.days, week: weekPay, biweek: weekPay * 2, month: (weekPay * h.weeks) / 12, year: weekPay * h.weeks });
/** Take-home after a flat tax percent (0 to 100). */
export const afterFlatTax = (gross: number, taxPct: number) => gross * (1 - Math.min(100, Math.max(0, taxPct)) / 100);
