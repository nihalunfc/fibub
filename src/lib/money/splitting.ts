// Sharing maths for the bill splitter, trip splitter and net worth tools. Plain TypeScript, no DOM.
// Money is worked out in whole cents so the shares always add up to the exact amount.

export const toCents = (x: number) => Math.round((Number.isFinite(x) ? x : 0) * 100);

/** Split an amount (in cents) by weights. Shares add up exactly; leftover cents go to the biggest remainders. */
export function splitCents(total: number, weights: number[]): number[] {
  const w = weights.map((x) => (x > 0 && Number.isFinite(x) ? x : 0));
  const sum = w.reduce((a, b) => a + b, 0);
  if (!w.length) return [];
  if (sum <= 0) return w.map(() => 0);
  const raw = w.map((x) => (total * x) / sum);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - out[i], i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; left > 0 && order.length; k++, left--) out[order[k % order.length][1]]++;
  return out;
}

export type SplitBy = 'equal' | 'share' | 'room' | 'income';
export interface Housemate { name: string; share: number; room: number; income: number }
export interface HouseBill { name: string; amount: number; by: SplitBy }

/** One row per bill, one column per person (cents), plus each person's total. */
export function splitBills(people: Housemate[], bills: HouseBill[]) {
  const key = (p: Housemate, by: SplitBy) => (by === 'equal' ? 1 : by === 'share' ? p.share : by === 'room' ? p.room : p.income);
  const rows = bills.map((b) => splitCents(toCents(b.amount), people.map((p) => key(p, b.by))));
  const totals = people.map((_, i) => rows.reduce((a, r) => a + (r[i] || 0), 0));
  return { rows, totals, grand: totals.reduce((a, b) => a + b, 0) };
}

export interface TripExpense { what: string; payer: number; amount: number; forWho: number[] }

/** Net balance per person in cents: positive = is owed money, negative = owes. */
export function tripBalances(n: number, expenses: TripExpense[]) {
  const bal = new Array(n).fill(0);
  const spent = new Array(n).fill(0);
  for (const e of expenses) {
    const c = toCents(e.amount);
    const who = e.forWho.filter((i) => i >= 0 && i < n);
    if (!(c > 0) || !who.length || e.payer < 0 || e.payer >= n) continue;
    bal[e.payer] += c;
    spent[e.payer] += c;
    splitCents(c, who.map(() => 1)).forEach((s, k) => (bal[who[k]] -= s));
  }
  return { bal, spent };
}

/** Fewest-practical transfers: biggest debtor pays biggest creditor until all are square (at most people - 1). */
export function settle(bal: number[]) {
  const b = bal.slice();
  const t: { from: number; to: number; cents: number }[] = [];
  for (let guard = 0; guard < 1000; guard++) {
    let lo = 0, hi = 0;
    b.forEach((v, i) => { if (v < b[lo]) lo = i; if (v > b[hi]) hi = i; });
    if (b[lo] >= 0 || b[hi] <= 0) break;
    const c = Math.min(-b[lo], b[hi]);
    t.push({ from: lo, to: hi, cents: c });
    b[lo] += c; b[hi] -= c;
  }
  return t;
}

export interface NwItem { name: string; cat: string; amount: number; kind: 'asset' | 'debt' }
export function netWorth(items: NwItem[]) {
  const byCat = new Map<string, number>();
  let assets = 0, debts = 0;
  for (const it of items) {
    const a = Math.abs(it.amount) || 0;
    if (it.kind === 'asset') assets += a; else debts += a;
    byCat.set(it.kind + ':' + it.cat, (byCat.get(it.kind + ':' + it.cat) || 0) + a);
  }
  return { assets, debts, net: assets - debts, byCat };
}
