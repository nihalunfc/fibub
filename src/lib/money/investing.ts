// Plain maths for return-calculator, rebalance-portfolio, dividend-calculator and capital-gains. No DOM.

/** Compound annual growth rate, as a fraction. */
export const cagr = (start: number, end: number, years: number) => (start > 0 && end > 0 && years > 0 ? Math.pow(end / start, 1 / years) - 1 : NaN);

export type Flow = { date: number; amount: number }; // date = ms since epoch (UTC)
const DAY = 86400000;

/** Parse "date, amount" lines. Dates as YYYY-MM-DD, DD/MM/YYYY is not guessed (ambiguous), so use ISO. */
export function parseFlows(text: string): { flows: Flow[]; error: string } {
  const flows: Flow[] = [];
  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s*[,;\t ]\s*(-?[\d,]*\.?\d+)$/);
    if (!m) return { flows: [], error: `Line ${i + 1} should look like 2024-03-15, -1000 (year-month-day, then the amount).` };
    const d = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    if (Number.isNaN(d)) return { flows: [], error: `Line ${i + 1} has a date that does not exist.` };
    flows.push({ date: d, amount: parseFloat(m[4].replace(/,/g, '')) });
  }
  return { flows, error: '' };
}

/** XIRR: yearly rate (fraction) where the net present value of dated flows is zero. NaN if none exists. */
export function xirr(flows: Flow[]): number {
  if (flows.length < 2 || !flows.some((f) => f.amount > 0) || !flows.some((f) => f.amount < 0)) return NaN;
  const t0 = Math.min(...flows.map((f) => f.date));
  const npv = (r: number) => flows.reduce((s, f) => s + f.amount / Math.pow(1 + r, (f.date - t0) / DAY / 365), 0);
  let lo = -0.999999, hi = 1;
  while (npv(hi) * npv(lo) > 0 && hi < 1e6) hi *= 2;
  if (npv(hi) * npv(lo) > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

export type Holding = { name: string; value: number; target: number };
export type Trade = { name: string; value: number; target: number; targetValue: number; trade: number; after: number };

/**
 * Rebalance. Targets are percentages (they are scaled if they do not add to 100).
 * buyOnly: new cash is spread over the holdings that are furthest below target, nothing is sold.
 */
export function rebalance(h: Holding[], cash: number, buyOnly: boolean): Trade[] {
  const tsum = h.reduce((s, x) => s + x.target, 0) || 1;
  const w = h.map((x) => x.target / tsum);
  const total = h.reduce((s, x) => s + x.value, 0) + cash;
  let level = total;
  if (buyOnly) {
    // find level L so that the money needed to lift every holding below L*weight up to it equals the cash
    let lo = 0, hi = total + 1;
    const need = (L: number) => h.reduce((s, x, i) => s + Math.max(0, L * w[i] - x.value), 0);
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (need(mid) > cash) hi = mid; else lo = mid; }
    level = lo;
  }
  return h.map((x, i) => {
    const targetValue = total * w[i];
    const trade = buyOnly ? Math.max(0, level * w[i] - x.value) : targetValue - x.value;
    return { name: x.name, value: x.value, target: w[i] * 100, targetValue, trade, after: x.value + trade };
  });
}

export type DivIn = { shares: number; cost: number; price: number; dps: number; divGrowth: number; priceGrowth: number; years: number; drip: boolean };
export type DivYear = { year: number; shares: number; price: number; income: number; value: number; dps: number };

/** Yearly projection. Dividends are paid during the year on the shares held at its start; with DRIP they buy more shares at the year-end price. */
export function dividends(a: DivIn): DivYear[] {
  const rows: DivYear[] = [];
  let shares = a.shares, price = a.price, dps = a.dps;
  for (let y = 1; y <= a.years; y++) {
    const income = shares * dps;
    price *= 1 + a.priceGrowth / 100;
    if (a.drip && price > 0) shares += income / price;
    rows.push({ year: y, shares, price, income, value: shares * price, dps });
    dps *= 1 + a.divGrowth / 100;
  }
  return rows;
}

export type Tx = { date: string; symbol: string; side: 'buy' | 'sell'; qty: number; price: number; fee: number };
export type Sale = { date: string; symbol: string; qty: number; proceeds: number; cost: number; gain: number; /** per-unit average cost used (average method) or cost per unit sold */ unitCost?: number; /** lot methods only: gain on units held more than a year / a year or less */ longGain?: number; shortGain?: number };

/** Lines: date, symbol, buy|sell, quantity, price, fee (fee optional). */
export function parseTx(text: string): { tx: Tx[]; error: string } {
  const tx: Tx[] = [];
  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || /^date\b/i.test(line)) continue;
    const p = line.split(/\s*[,;\t]\s*/);
    const side = (p[2] || '').toLowerCase();
    const n = (s?: string) => (s === undefined || s === '' ? 0 : parseFloat(s.replace(/,/g, '')));
    if (p.length < 5 || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(p[0]) || (side !== 'buy' && side !== 'sell') || !(n(p[3]) > 0) || !(n(p[4]) >= 0) || n(p[5]) < 0 || Number.isNaN(n(p[5])))
      return { tx: [], error: `Line ${i + 1} should look like 2024-03-15, ABC, buy, 100, 10.50, 5 (date, name, buy or sell, quantity, price, fee).` };
    tx.push({ date: p[0], symbol: p[1], side, qty: n(p[3]), price: n(p[4]), fee: n(p[5]) });
  }
  tx.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)); // stable: same-day lines keep their order
  return { tx, error: '' };
}

export type CostMethod = 'average' | 'fifo' | 'lifo' | 'hifo';
function daysBetween(a: string, b: string): number {
  const t = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return Date.UTC(y, m - 1, dd); };
  return Math.round((t(b) - t(a)) / DAY);
}

/** Gains per sale by average cost (Canada's ACB), FIFO, LIFO or highest-cost-first. Buying fees join the cost, selling fees reduce the proceeds.
 *  Lot methods also split each gain into long (held over 365 days) and short. */
export function gains(tx: Tx[], method: CostMethod): { sales: Sale[]; error: string } {
  const sales: Sale[] = [];
  const books = new Map<string, { lots: { qty: number; cost: number; date: string }[] }>();
  for (const t of tx) {
    const b = books.get(t.symbol) || { lots: [] };
    books.set(t.symbol, b);
    if (t.side === 'buy') { b.lots.push({ qty: t.qty, cost: t.qty * t.price + t.fee, date: t.date }); continue; }
    const held = b.lots.reduce((s, l) => s + l.qty, 0);
    if (t.qty > held + 1e-9) return { sales: [], error: `${t.symbol}: you sell ${t.qty} on ${t.date} but only hold ${Math.round(held * 1e6) / 1e6} by then.` };
    const proceeds = t.qty * t.price - t.fee;
    let cost = 0, longGain: number | undefined, shortGain: number | undefined;
    if (method === 'average') {
      const totalCost = b.lots.reduce((s, l) => s + l.cost, 0), frac = t.qty / held;
      cost = totalCost * frac;
      b.lots = b.lots.map((l) => ({ ...l, qty: l.qty * (1 - frac), cost: l.cost * (1 - frac) }));
    } else {
      const order = b.lots.slice();
      if (method === 'lifo') order.reverse();
      if (method === 'hifo') order.sort((x, y) => y.cost / y.qty - x.cost / x.qty);
      let left = t.qty; longGain = 0; shortGain = 0;
      for (const l of order) {
        if (left <= 1e-12) break;
        const take = Math.min(left, l.qty), c = l.cost * (take / l.qty);
        const g = (proceeds * take) / t.qty - c;
        if (daysBetween(l.date, t.date) > 365) longGain += g; else shortGain += g;
        cost += c; l.cost -= c; l.qty -= take; left -= take;
      }
      b.lots = b.lots.filter((l) => l.qty > 1e-12);
    }
    sales.push({ date: t.date, symbol: t.symbol, qty: t.qty, proceeds, cost, gain: proceeds - cost, unitCost: cost / t.qty, longGain, shortGain });
  }
  return { sales, error: '' };
}

export type GainYear = { year: string; sales: number; proceeds: number; cost: number; gain: number; longGain?: number; shortGain?: number; taxable: number; estTax: number | null };
/** Yearly totals. taxFree = a yearly tax-free amount taken off a net gain (0 if none); inclPct = taxable share of the rest;
 *  ratePct = optional tax rate (null = leave the estimate out). A net loss gives a taxable part of 0. */
export function summarize(sales: Sale[], inclPct: number, taxFree = 0, ratePct: number | null = null): { years: GainYear[]; total: GainYear } {
  const mk = (year: string, a: Sale[]): GainYear => {
    const sum = (k: 'proceeds' | 'cost' | 'gain') => a.reduce((s, x) => s + x[k], 0);
    const lots = a.every((x) => x.longGain !== undefined) && a.length > 0;
    const gain = sum('gain');
    const taxable = (Math.max(0, gain - Math.max(0, taxFree)) * inclPct) / 100;
    return { year, sales: a.length, proceeds: sum('proceeds'), cost: sum('cost'), gain,
      longGain: lots ? a.reduce((s, x) => s + (x.longGain || 0), 0) : undefined,
      shortGain: lots ? a.reduce((s, x) => s + (x.shortGain || 0), 0) : undefined,
      taxable, estTax: ratePct === null || !(ratePct >= 0) ? null : (taxable * ratePct) / 100 };
  };
  const ys = [...new Set(sales.map((s) => s.date.slice(0, 4)))];
  const years = ys.map((y) => mk(y, sales.filter((s) => s.date.startsWith(y))));
  const total: GainYear = { ...mk('All', sales), taxable: years.reduce((s, y) => s + y.taxable, 0), estTax: ratePct === null || !(ratePct >= 0) ? null : years.reduce((s, y) => s + (y.estTax || 0), 0) };
  return { years, total };
}

// ---- upgrade additions (2026-11-16) ----
/** Shares and money needed to receive `monthly` income from dividends of `dps` a share a year. */
export function sharesForIncome(monthly: number, dps: number, price: number) {
  if (!(monthly > 0) || !(dps > 0)) return { shares: NaN, capital: NaN };
  const shares = (monthly * 12) / dps;
  return { shares, capital: shares * price };
}
/** End value that gives a yearly return `rate` (%) over `years`. */
export const endForReturn = (start: number, rate: number, years: number) => (start > 0 && years > 0 && rate > -100 ? start * Math.pow(1 + rate / 100, years) : NaN);
/** Years to grow from start to end at `rate` % a year. */
export const yearsToReach = (start: number, end: number, rate: number) => (start > 0 && end > 0 && rate > -100 && rate !== 0 && end / start > 0 ? Math.log(end / start) / Math.log(1 + rate / 100) : NaN);
/** Drift of each holding from its target, in percentage points, and whether it is outside the band. */
export function drift(trades: Trade[], band: number) {
  const total = trades.reduce((s, x) => s + x.value, 0) || 1;
  return trades.map((x) => { const d = (x.value / total) * 100 - x.target; return { name: x.name, drift: d, outside: Math.abs(d) > band + 1e-9 }; });
}
