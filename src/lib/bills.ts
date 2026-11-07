// Bill and expense calendar: bills, income and repeating items on dates, with paid ticks and a
// running balance so you can see what is due before the next pay day.
import { iso, fromIso, addDays } from './planner';

export type Repeat = 'none' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
export type Item = {
  id: string; title: string; amount: number; kind: 'bill' | 'income'; cat: string; date: string;
  repeat: Repeat; until: string; note: string; paid: Record<string, true>; skip: Record<string, true>;
};
export type State = { v: 1; currency: string; weekStart: number; start: number; startDate: string; items: Item[] };

export const CATS = [
  { id: 'housing', name: 'Rent and housing', c: '#3b82f6' }, { id: 'bills', name: 'Bills and utilities', c: '#0891b2' },
  { id: 'groceries', name: 'Groceries', c: '#16a34a' }, { id: 'transport', name: 'Transport', c: '#d97706' },
  { id: 'subs', name: 'Subscriptions', c: '#7c3aed' }, { id: 'food', name: 'Eating out', c: '#e11d48' },
  { id: 'health', name: 'Health', c: '#0d9488' }, { id: 'shopping', name: 'Shopping', c: '#db2777' },
  { id: 'debt', name: 'Loans and cards', c: '#475569' }, { id: 'kids', name: 'Children and school', c: '#ca8a04' },
  { id: 'home', name: 'Family back home', c: '#9333ea' }, { id: 'other', name: 'Other', c: '#94a3b8' },
];
export const INCOME = { id: 'income', name: 'Income', c: '#137a3e' };
export const catOf = (id: string) => (id === 'income' ? INCOME : CATS.find((c) => c.id === id) ?? CATS[CATS.length - 1]);
export const REPEATS: [Repeat, string][] = [['none', 'Does not repeat'], ['weekly', 'Every week'], ['biweekly', 'Every 2 weeks'], ['monthly', 'Every month'], ['quarterly', 'Every 3 months'], ['yearly', 'Every year']];

const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
/** The dates (YYYY-MM-DD) an item falls on between from and to (inclusive). Monthly items on the 31st fall on the last day of shorter months. */
export function occurrences(it: Item, from: string, to: string): string[] {
  const out: string[] = [];
  const start = fromIso(it.date), end = it.until && it.until < to ? it.until : to;
  if (it.date > end) return out;
  const push = (d: Date) => { const s = iso(d); if (s >= from && s <= end && s >= it.date && !it.skip[s]) out.push(s); };
  if (it.repeat === 'none') { push(start); return out; }
  if (it.repeat === 'weekly' || it.repeat === 'biweekly') {
    const step = it.repeat === 'weekly' ? 7 : 14;
    const f = fromIso(from);
    let k = Math.max(0, Math.floor((f.getTime() - start.getTime()) / 864e5 / step) - 1);
    for (let d = addDays(start, k * step); iso(d) <= end; d = addDays(start, ++k * step)) push(d);
    return out;
  }
  const months = it.repeat === 'monthly' ? 1 : it.repeat === 'quarterly' ? 3 : 12;
  const day = start.getDate();
  const f = fromIso(from);
  let k = Math.max(0, Math.floor(((f.getFullYear() - start.getFullYear()) * 12 + f.getMonth() - start.getMonth()) / months) - 1);
  for (;; k++) {
    const y = start.getFullYear(), m = start.getMonth() + k * months;
    const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
    const d = new Date(yy, mm, Math.min(day, daysIn(yy, mm)));
    if (iso(d) > end) break;
    push(d);
  }
  return out;
}

export type Occ = { it: Item; date: string; paid: boolean };
export function inRange(items: Item[], from: string, to: string): Occ[] {
  const out: Occ[] = [];
  for (const it of items) for (const d of occurrences(it, from, to)) out.push({ it, date: d, paid: !!it.paid[d] });
  return out.sort((a, b) => a.date.localeCompare(b.date) || (a.it.kind === 'income' ? -1 : 1) || b.it.amount - a.it.amount);
}

/** Money in hand at the end of each day from the start date, counting every item (paid or not). */
export function balances(s: State, from: string, to: string): Map<string, number> {
  const map = new Map<string, number>();
  if (!s.startDate) return map;
  const begin = s.startDate < from ? s.startDate : from;
  const occ = inRange(s.items, s.startDate, to);
  let bal = s.start, i = 0;
  for (let d = fromIso(begin); iso(d) <= to; d = addDays(d, 1)) {
    const day = iso(d);
    if (day >= s.startDate) while (i < occ.length && occ[i].date === day) { bal += occ[i].it.kind === 'income' ? occ[i].it.amount : -occ[i].it.amount; i++; }
    if (day >= from) map.set(day, day >= s.startDate ? bal : NaN);
  }
  return map;
}

export function monthTotals(occ: Occ[]) {
  let bills = 0, income = 0, paid = 0;
  const byCat = new Map<string, number>();
  for (const o of occ) {
    if (o.it.kind === 'income') { income += o.it.amount; continue; }
    bills += o.it.amount; if (o.paid) paid += o.it.amount;
    byCat.set(o.it.cat, (byCat.get(o.it.cat) ?? 0) + o.it.amount);
  }
  return { bills, income, paid, left: bills - paid, byCat: [...byCat].sort((a, b) => b[1] - a[1]) };
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function sample(today: Date): Item[] {
  const y = today.getFullYear(), m = today.getMonth();
  const on = (d: number) => iso(new Date(y, m, d));
  const mk = (title: string, amount: number, cat: string, date: string, repeat: Repeat, kind: 'bill' | 'income' = 'bill'): Item => ({ id: uid(), title, amount, kind, cat: kind === 'income' ? 'income' : cat, date, repeat, until: '', note: '', paid: {}, skip: {} });
  return [
    mk('Pay day', 2100, 'income', on(1), 'biweekly', 'income'), mk('Rent', 1450, 'housing', on(1), 'monthly'), mk('Phone', 55, 'bills', on(8), 'monthly'),
    mk('Internet', 70, 'bills', on(12), 'monthly'), mk('Hydro and gas', 120, 'bills', on(18), 'monthly'), mk('Groceries', 95, 'groceries', on(3), 'weekly'),
    mk('Transit pass', 156, 'transport', on(1), 'monthly'), mk('Streaming', 17, 'subs', on(21), 'monthly'), mk('Credit card', 200, 'debt', on(25), 'monthly'),
    mk('Car insurance', 480, 'transport', on(15), 'quarterly'),
  ];
}

/** Bills and income as CSV rows: one row per item (with its repeat rule). */
export function itemsCsv(items: Item[]) {
  const cell = (v: string) => (/[",\r\n]/.test(v) || /^[=+@]/.test(v) ? `"${(/^[=+@]/.test(v) ? "'" : '') + v.replace(/"/g, '""')}"` : v);
  const head = ['title', 'amount', 'type', 'category', 'first_date', 'repeats', 'until', 'note'];
  return [head.join(','), ...items.map((i) => [i.title, String(i.amount), i.kind, catOf(i.cat).name, i.date, i.repeat, i.until, i.note].map(cell).join(','))].join('\r\n') + '\r\n';
}

const REPEAT_IDS = new Set(REPEATS.map((r) => r[0]));
const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d\d-\d\d$/.test(s);
const dateSet = (o: unknown): Record<string, true> => {
  const out: Record<string, true> = {};
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (isDate(k) && v) out[k] = true;
  return out;
};
/**
 * Reads a backup file: this tool's own backups, and plain (not passcode-locked) backups from the
 * older expense calendar on nihalsulaiman.com, whose items have `done` dates for repeating bills
 * and a single `paid` flag for one-off ones. Returns null when it is neither.
 */
export function fromBackup(j: any): State | null {
  if (!j || typeof j !== 'object' || !Array.isArray(j.items)) return null;
  const items: Item[] = [];
  for (const x of j.items) {
    if (!x || typeof x.title !== 'string' || !isDate(x.date) || !Number.isFinite(+x.amount)) continue;
    const repeat: Repeat = REPEAT_IDS.has(x.repeat) ? x.repeat : 'none';
    const kind = x.kind === 'income' ? 'income' : 'bill';
    const paid = dateSet(x.paid && typeof x.paid === 'object' ? x.paid : x.done);
    if (x.paid === true && repeat === 'none') paid[x.date] = true;
    items.push({
      id: typeof x.id === 'string' && x.id ? x.id.slice(0, 40) : uid(), title: x.title.slice(0, 80), amount: Math.abs(+x.amount), kind,
      cat: kind === 'income' ? 'income' : catOf(String(x.cat)).id, date: x.date, repeat, until: repeat !== 'none' && isDate(x.until) ? x.until : '',
      note: typeof x.note === 'string' ? x.note.slice(0, 200) : '', paid, skip: dateSet(x.skip),
    });
  }
  const start = j.start == null || j.start === '' ? NaN : +j.start;
  return {
    v: 1, currency: typeof j.currency === 'string' && /^[A-Z]{3}$/.test(j.currency) ? j.currency : 'USD', weekStart: j.weekStart === 0 ? 0 : 1,
    start: Number.isFinite(start) ? start : NaN, startDate: isDate(j.startDate) ? j.startDate : '', items,
  };
}
