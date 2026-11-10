// Plain maths for the small-business money tools (no DOM).

export type FreelanceIn = { take: number; exp: number; tax: number; off: number; hrs: number; days: number };
/** Hourly and day rate that leave `take` after `tax` % and `exp` business costs. */
export function freelanceRate(a: FreelanceIn) {
  const gross = a.take / (1 - a.tax / 100) + a.exp;
  const weeks = 52 - a.off, hours = weeks * a.hrs;
  const hourly = gross / hours;
  return { gross, weeks, hours, hourly, day: hourly * (a.hrs / a.days) };
}

export type RunwayIn = { cash: number; revenue: number; costs: number; revGrowth: number; costGrowth: number; maxMonths?: number };
export type RunwayRow = { month: number; revenue: number; costs: number; net: number; cash: number };
/** Month by month cash. `months` is how long the cash lasts (fractional), or null if it never runs out within the limit. */
export function runway(a: RunwayIn) {
  const max = a.maxMonths ?? 120, rows: RunwayRow[] = [];
  let cash = a.cash, months: number | null = null;
  for (let m = 1; m <= max; m++) {
    const revenue = a.revenue * Math.pow(1 + a.revGrowth / 100, m - 1), costs = a.costs * Math.pow(1 + a.costGrowth / 100, m - 1);
    const net = revenue - costs;
    if (cash + net <= 1e-9) {
      months = net < 0 ? m - 1 + cash / -net : m - 1;
      rows.push({ month: m, revenue, costs, net, cash: Math.max(0, cash + net) });
      break;
    }
    cash += net;
    rows.push({ month: m, revenue, costs, net, cash });
  }
  return { months, rows };
}

export type DepIn = { cost: number; salvage: number; life: number; method: 'sl' | 'db' | 'syd' | 'units'; rate?: number; units?: number[]; totalUnits?: number; finish?: boolean };
export type DepRow = { year: number; dep: number; accumulated: number; book: number };
export function depreciation(a: DepIn): DepRow[] {
  const base = a.cost - a.salvage, rows: DepRow[] = [];
  let acc = 0;
  const n = a.method === 'units' ? (a.units?.length ?? 0) : Math.round(a.life);
  for (let y = 1; y <= n; y++) {
    const book = a.cost - acc;
    let d = 0;
    if (a.method === 'sl') d = base / n;
    else if (a.method === 'syd') d = (base * (n - y + 1)) / ((n * (n + 1)) / 2);
    else if (a.method === 'units') d = (base * (a.units![y - 1] || 0)) / (a.totalUnits || 1);
    else {
      const r = (a.rate ?? (2 / n) * 100) / 100;
      d = book * r;
      if (a.finish !== false && y === n) d = book - a.salvage;
    }
    d = Math.max(0, Math.min(d, book - a.salvage));
    acc += d;
    rows.push({ year: y, dep: d, accumulated: acc, book: a.cost - acc });
  }
  return rows;
}
