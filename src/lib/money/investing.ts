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
export type Sale = { date: string; symbol: string; qty: number; proceeds: number; cost: number; gain: number };

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

/** Gains per sale by average cost (Canada's ACB) or FIFO. Buying fees join the cost, selling fees reduce the proceeds. */
export function gains(tx: Tx[], method: 'average' | 'fifo'): { sales: Sale[]; error: string } {
  const sales: Sale[] = [];
  const books = new Map<string, { lots: { qty: number; cost: number }[] }>();
  for (const t of tx) {
    const b = books.get(t.symbol) || { lots: [] };
    books.set(t.symbol, b);
    if (t.side === 'buy') { b.lots.push({ qty: t.qty, cost: t.qty * t.price + t.fee }); continue; }
    const held = b.lots.reduce((s, l) => s + l.qty, 0);
    if (t.qty > held + 1e-9) return { sales: [], error: `${t.symbol}: you sell ${t.qty} on ${t.date} but only hold ${Math.round(held * 1e6) / 1e6} by then.` };
    let cost = 0;
    if (method === 'average') {
      const totalCost = b.lots.reduce((s, l) => s + l.cost, 0), frac = t.qty / held;
      cost = totalCost * frac;
      b.lots = b.lots.map((l) => ({ qty: l.qty * (1 - frac), cost: l.cost * (1 - frac) }));
    } else {
      let left = t.qty;
      for (const l of b.lots) {
        if (left <= 1e-12) break;
        const take = Math.min(left, l.qty), c = l.cost * (take / l.qty);
        cost += c; l.cost -= c; l.qty -= take; left -= take;
      }
      b.lots = b.lots.filter((l) => l.qty > 1e-12);
    }
    const proceeds = t.qty * t.price - t.fee;
    sales.push({ date: t.date, symbol: t.symbol, qty: t.qty, proceeds, cost, gain: proceeds - cost });
  }
  return { sales, error: '' };
}
