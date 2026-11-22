// Maths for the end-of-day close: balancing the takings, the day's figures and month and year to date. No DOM.
import { toNum } from './common.ts';

export type Line = { who: string; type: string; expected: string; counted: string; note: string };
export type Status = 'ok' | 'tol' | 'bad' | 'open';
const n = (v: unknown) => { const x = toNum(v); return x === '' ? NaN : x; };
export const status = (diff: number, tol: number): Status => (!Number.isFinite(diff) ? 'open' : Math.abs(diff) < 0.005 ? 'ok' : Math.abs(diff) <= tol + 1e-9 ? 'tol' : 'bad');

/** Over (counted more than expected) is positive, short is negative. A line is open until both numbers are typed. */
export function reconcile(lines: Line[], tol: number) {
  const rows = lines.map((l) => { const e = n(l.expected), c = n(l.counted), diff = Number.isFinite(e) && Number.isFinite(c) ? Math.round((c - e) * 100) / 100 : NaN; return { ...l, e, c, diff, st: status(diff, tol) }; });
  const done = rows.filter((r) => Number.isFinite(r.diff));
  const sum = (f: (r: (typeof rows)[0]) => number) => done.reduce((a, r) => a + f(r), 0);
  const by = new Map<string, { who: string; e: number; c: number; diff: number }>();
  done.forEach((r) => { const k = r.who.trim() || 'Unnamed', x = by.get(k) || { who: k, e: 0, c: 0, diff: 0 }; x.e += r.e; x.c += r.c; x.diff = Math.round((x.diff + r.diff) * 100) / 100; by.set(k, x); });
  return { rows, expected: sum((r) => r.e), counted: sum((r) => r.c), diff: Math.round(sum((r) => r.diff) * 100) / 100, bad: rows.filter((r) => r.st === 'bad').length, tolN: rows.filter((r) => r.st === 'tol').length, open: rows.filter((r) => r.st === 'open').length, byWho: [...by.values()] };
}

export type Figs = { sold: string; avail: string; main: string; other: { label: string; amount: string }[]; tax: string };
export function figures(f: Figs) {
  const sold = n(f.sold), avail = n(f.avail), main = n(f.main) || 0, other = f.other.reduce((a, o) => a + (n(o.amount) || 0), 0), tax = n(f.tax) || 0, sales = main + other;
  return { sold: Number.isFinite(sold) ? sold : 0, avail: Number.isFinite(avail) ? avail : 0, main, other, sales, tax, takings: sales + tax, use: avail > 0 && Number.isFinite(sold) ? sold / avail : NaN, price: sold > 0 ? main / sold : NaN, perPlace: avail > 0 ? main / avail : NaN };
}

export type Day = { date: string; sold: number; avail: number; main: number; sales: number; tax: number; diff: number; done: number; steps: number };
/** Today's figures plus the closed days of the same month and year before it. Ratios come from the totals, not an average of daily ratios. */
export function toDate(history: Day[], today: Day) {
  const add = (xs: Day[]) => xs.reduce((a, d) => ({ sold: a.sold + d.sold, avail: a.avail + d.avail, main: a.main + d.main, sales: a.sales + d.sales, tax: a.tax + d.tax, diff: a.diff + d.diff, days: a.days + 1 }), { sold: 0, avail: 0, main: 0, sales: 0, tax: 0, diff: 0, days: 0 });
  const before = history.filter((d) => d.date < today.date);
  const mk = (s: ReturnType<typeof add>) => ({ ...s, use: s.avail > 0 ? s.sold / s.avail : NaN, price: s.sold > 0 ? s.main / s.sold : NaN, perPlace: s.avail > 0 ? s.main / s.avail : NaN });
  return { today: mk(add([today])), mtd: mk(add([...before.filter((d) => d.date.slice(0, 7) === today.date.slice(0, 7)), today])), ytd: mk(add([...before.filter((d) => d.date.slice(0, 4) === today.date.slice(0, 4)), today])) };
}
