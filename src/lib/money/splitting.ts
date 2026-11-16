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

/** Tax and tip as percentages added on top of every bill's amount (both worked out on the amount before either). */
export interface Extras { tax?: number; tip?: number }
const pct = (x: number | undefined) => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? Math.min(x, 1000) : 0);
/** A bill amount in cents with tax and tip added. Negative or unusable amounts count as 0. */
export const withExtras = (amount: number, e: Extras = {}) => {
  const base = Math.max(0, Number.isFinite(amount) ? amount : 0);
  return toCents(base) + Math.round((base * (pct(e.tax) + pct(e.tip))) );
};

/** One row per bill, one column per person (cents), plus each person's total. Optional tax and tip are added to every bill. */
export function splitBills(people: Housemate[], bills: HouseBill[], extras: Extras = {}) {
  const key = (p: Housemate, by: SplitBy) => (by === 'equal' ? 1 : by === 'share' ? p.share : by === 'room' ? p.room : p.income);
  const billCents = bills.map((b) => withExtras(b.amount, extras));
  const rows = bills.map((b, i) => splitCents(billCents[i], people.map((p) => key(p, b.by))));
  const totals = people.map((_, i) => rows.reduce((a, r) => a + (r[i] || 0), 0));
  return { rows, totals, billCents, grand: totals.reduce((a, b) => a + b, 0) };
}

/**
 * Who owes whom. `payers[i]` is the index of the person who paid bill i (or -1 if not tracked).
 * Each tracked bill credits its payer and debits everyone's share of it; the balances then go through `settle`.
 * Returns balances (cents, positive = is owed) and the transfers.
 */
export function settleUp(n: number, rows: number[][], payers: number[]) {
  const bal: number[] = new Array(n).fill(0);
  rows.forEach((r, i) => {
    const p = payers[i];
    if (!(p >= 0 && p < n)) return;
    const total = r.reduce((a, b) => a + b, 0);
    bal[p] += total;
    r.forEach((c, k) => { bal[k] -= c; });
  });
  return { bal, transfers: settle(bal) };
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

export interface TripExpenseW extends TripExpense { rate?: number }

/**
 * Like tripBalances, but each person has a share weight (1 = one adult, 2 = a couple, 0.5 = a child)
 * and an expense can be in another currency: `rate` is how many base-currency units one unit of it is worth.
 * Everything is converted to base-currency cents first, then split by weight, so balances still add to zero.
 */
export function tripBalancesW(n: number, expenses: TripExpenseW[], weights: number[] = []) {
  const bal = new Array(n).fill(0);
  const spent = new Array(n).fill(0);
  for (const e of expenses) {
    const rate = typeof e.rate === 'number' && e.rate > 0 && Number.isFinite(e.rate) ? e.rate : 1;
    const c = Math.round(toCents(e.amount) * rate);
    const who = e.forWho.filter((i) => i >= 0 && i < n);
    if (!(c > 0) || !who.length || e.payer < 0 || e.payer >= n) continue;
    bal[e.payer] += c;
    spent[e.payer] += c;
    let w = who.map((i) => (weights[i] > 0 && Number.isFinite(weights[i]) ? weights[i] : weights[i] === undefined ? 1 : 0));
    if (!w.some((x) => x > 0)) w = who.map(() => 1);
    splitCents(c, w).forEach((s, k) => (bal[who[k]] -= s));
  }
  return { bal, spent };
}

/** Parse lines like "EUR 1.08" or "EUR=1.08" into a code to rate map. Bad lines are skipped. */
export function parseRates(text: string): { code: string; rate: number }[] {
  const out: { code: string; rate: number }[] = [];
  for (const line of text.split(/\n|;/)) {
    const m = line.trim().match(/^([A-Za-z$€£₹]{1,6})\s*[=:\s]\s*([0-9]*\.?[0-9]+)$/);
    if (m && +m[2] > 0 && !out.some((o) => o.code === m[1].toUpperCase())) out.push({ code: m[1].toUpperCase(), rate: +m[2] });
  }
  return out;
}

/** Plain-text summary to paste into a group chat. */
export function settleText(names: string[], pays: { from: number; to: number; cents: number }[], cur = ''): string {
  const f = (c: number) => (c / 100).toFixed(2) + (cur ? ' ' + cur : '');
  if (!pays.length) return 'Everyone is square. Nobody owes anything.';
  return ['To settle up:', ...pays.map((p) => `- ${names[p.from]} pays ${names[p.to]} ${f(p.cents)}`)].join('\n');
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

/** Simple balance-sheet ratios. Ratios are null when there is nothing to divide by. */
export function nwRatios(items: NwItem[]) {
  const r = netWorth(items);
  const liquid = items.filter((i) => i.kind === 'asset' && (i.cat === 'Cash and bank' || i.cat === 'Savings and investments')).reduce((a, i) => a + (Math.abs(i.amount) || 0), 0);
  return {
    debtToAsset: r.assets > 0 ? r.debts / r.assets : null,
    liquidShare: r.assets > 0 ? liquid / r.assets : null,
    liquid,
    liquidMinusDebts: liquid - r.debts,
  };
}

/** Change between the newest saved snapshot and today's net worth. Null when no snapshot. */
export function sinceSnapshot(net: number, snaps: { date: string; assets: number; debts: number }[]) {
  if (!snaps.length) return null;
  const last = snaps[snaps.length - 1];
  const before = last.assets - last.debts;
  return { date: last.date, change: net - before, pct: before !== 0 ? ((net - before) / Math.abs(before)) * 100 : null };
}
