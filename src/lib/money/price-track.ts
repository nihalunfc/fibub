// Price tracker maths (#T950): is a sale price really lower than what you saw before? Plain TypeScript, no DOM.

export type Seen = { date: string; price: number }; // date as YYYY-MM-DD
export type Verdict = 'deal' | 'same' | 'worse' | 'none';

const DAY = 86400000;
const t = (d: string) => Date.parse(d + 'T00:00:00Z');

/** Sorted copy, oldest first, dropping rows without a date or a positive price. */
export const clean = (s: Seen[]) => s.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date) && x.price > 0).sort((a, b) => t(a.date) - t(b.date));

export const median = (v: number[]) => {
  if (!v.length) return NaN;
  const s = [...v].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Compare the newest price with the prices you logged in the `days` before it.
 * - low: the lowest earlier price in the window; typical: their median; high: the highest.
 * - realOff: percent below the typical price (negative = above it).
 * - claimedOff: percent below the store's "was" price, if one was given; inflated when that "was" price is above
 *   every price you saw in the window (the usual trick of a made-up reference price).
 */
export function check(seen: Seen[], days = 90, was = 0) {
  const s = clean(seen);
  const now = s[s.length - 1];
  const empty = { now, verdict: 'none' as Verdict, low: NaN, typical: NaN, high: NaN, count: 0, realOff: NaN, vsLow: NaN, claimedOff: NaN, inflated: false };
  if (!now) return empty;
  const from = t(now.date) - days * DAY;
  const before = s.slice(0, -1).filter((x) => t(x.date) >= from && t(x.date) < t(now.date)).map((x) => x.price);
  const claimedOff = was > 0 ? (1 - now.price / was) * 100 : NaN;
  if (!before.length) return { ...empty, claimedOff };
  const low = Math.min(...before), high = Math.max(...before), typical = median(before);
  const realOff = (1 - now.price / typical) * 100;
  const vsLow = (1 - now.price / low) * 100; // positive = cheaper than your lowest earlier price
  // within half a percent of the earlier low counts as the same price
  const verdict: Verdict = vsLow > 0.5 ? 'deal' : vsLow >= -0.5 ? 'same' : 'worse';
  const inflated = was > 0 && was > high * 1.005;
  return { now, verdict, low, typical, high, count: before.length, realOff, vsLow, claimedOff, inflated };
}

/** Basket: newest prices of the items you plan to buy, the typical total and the money saved, against a budget. */
export function basket(items: { seen: Seen[]; qty: number; buy: boolean }[], days = 90, budget = 0) {
  let total = 0, typicalTotal = 0;
  for (const it of items) {
    if (!it.buy) continue;
    const c = check(it.seen, days);
    if (!c.now) continue;
    const q = it.qty > 0 ? it.qty : 1;
    total += c.now.price * q;
    typicalTotal += (Number.isFinite(c.typical) ? c.typical : c.now.price) * q;
  }
  return { total, typicalTotal, saved: typicalTotal - total, left: budget > 0 ? budget - total : NaN };
}

/** CSV with one row per logged price. */
export function toCsv(items: { name: string; store: string; was: number; seen: Seen[] }[]) {
  const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = ['item,store,date,price,was_price'];
  for (const it of items) for (const s of clean(it.seen)) rows.push([q(it.name), q(it.store), s.date, s.price.toFixed(2), it.was > 0 ? it.was.toFixed(2) : ''].join(','));
  return rows.join('\n') + '\n';
}
