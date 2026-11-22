// Northbay Goods: the made-up retail chain used all through the Power BI and DAX course.
// Seeded, so every learner (and every test) sees exactly the same numbers. The same tables can be
// downloaded as CSV files and loaded into Power BI Desktop (src/courses/power-bi/figures/NorthbayData.astro).
//
// Star schema: Sales (fact, one row per order line) → Product, Store, Date (dimensions), plus a
// Targets table at month × store grain for the planning lessons. Dates are ISO strings ('2025-03-01').
import type { ModelSpec } from './engine';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const PRODUCTS: [number, string, string, number, number][] = [
  // key, product, category, unit price, unit cost
  [1, 'Coffee beans 1 kg', 'Grocery', 18, 10.5],
  [2, 'Maple syrup 500 ml', 'Grocery', 12, 6.8],
  [3, 'Oat milk 6-pack', 'Grocery', 15, 9.2],
  [4, 'Bath towel set', 'Home', 45, 22],
  [5, 'Desk lamp', 'Home', 38, 17],
  [6, 'Storage boxes', 'Home', 24, 11],
  [7, 'Wireless earbuds', 'Electronics', 89, 52],
  [8, 'Phone charger', 'Electronics', 25, 9],
  [9, 'Smart plug', 'Electronics', 30, 14],
  [10, 'Camping chair', 'Outdoor', 55, 28],
  [11, 'Water bottle', 'Outdoor', 20, 7.5],
  [12, 'Snow shovel', 'Outdoor', 35, 16],
];
export const STORES: [number, string, string, string, string][] = [
  // key, store, city, region, open date
  [1, 'Falls Centre', 'Niagara Falls', 'West', '2019-04-01'],
  [2, 'Harbour Front', 'Hamilton', 'West', '2020-09-15'],
  [3, 'Queen Street', 'Toronto', 'Central', '2018-02-01'],
  [4, 'Rideau', 'Ottawa', 'East', '2021-06-01'],
  [5, 'Forks Market', 'London', 'West', '2025-03-01'],
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** All the tables as plain rows (first row of each = column names), for the CSV download and the model. */
export function northbayTables() {
  const R = rng(2025);
  const product = [['ProductKey', 'Product', 'Category', 'UnitPrice', 'UnitCost'], ...PRODUCTS.map((p) => [...p])];
  const store = [['StoreKey', 'Store', 'City', 'Region', 'OpenDate'], ...STORES.map((s) => [...s])];
  const date: (string | number)[][] = [['Date', 'Year', 'Quarter', 'MonthNo', 'Month', 'YearMonth', 'Day', 'Weekday']];
  const sales: (string | number)[][] = [['OrderLine', 'Date', 'StoreKey', 'ProductKey', 'Quantity', 'UnitPrice', 'UnitCost', 'Amount']];
  const targets: (string | number)[][] = [['YearMonth', 'StoreKey', 'Target']];
  // Seasonality per category by month (Outdoor peaks in summer, snow shovels in winter, Electronics in Nov-Dec).
  const season = (cat: string, m: number, pk: number) => {
    if (pk === 12) return [2.2, 1.6, 0.8, 0.2, 0, 0, 0, 0, 0.1, 0.4, 1.4, 2.4][m];
    if (cat === 'Outdoor') return [0.5, 0.5, 0.8, 1.1, 1.4, 1.6, 1.7, 1.5, 1.1, 0.8, 0.6, 0.7][m];
    if (cat === 'Electronics') return [0.8, 0.7, 0.8, 0.8, 0.9, 0.9, 0.9, 1, 1, 1, 1.6, 1.9][m];
    if (cat === 'Home') return [1.1, 0.9, 0.9, 1, 1, 0.9, 0.9, 1.2, 1.2, 1, 1.1, 1.3][m];
    return 1;
  };
  const storeSize = [0, 1.0, 0.8, 1.4, 0.9, 0.6];
  let line = 0;
  const monthTotals = new Map<string, number>();
  for (let t = Date.UTC(2024, 0, 1); t <= Date.UTC(2025, 11, 31); t += 86400000) {
    const d = new Date(t), y = d.getUTCFullYear(), m = d.getUTCMonth(), dow = d.getUTCDay(), ds = iso(d);
    const ym = `${y}-${String(m + 1).padStart(2, '0')}`;
    date.push([ds, y, `Q${Math.floor(m / 3) + 1}`, m + 1, MONTHS[m], ym, d.getUTCDate(), DAYS[dow]]);
    const busy = (dow === 0 || dow === 6 ? 1.35 : 1) * (y === 2025 ? 1.08 : 1);
    for (const [sk, , , , open] of STORES) {
      if (ds < open) continue;
      // Each store sells a handful of order lines a day; bigger stores and weekends sell more.
      const n = Math.round((2 + R() * 2.5) * storeSize[sk] * busy);
      for (let i = 0; i < n; i++) {
        const p = PRODUCTS[Math.floor(R() * PRODUCTS.length)];
        if (R() > season(p[2], m, p[0]) / 1.6) continue;
        const qty = 1 + Math.floor(R() * R() * 5);
        // 2025 prices are about 4 % higher (rounded to the cent).
        const price = y === 2025 ? Math.round(p[3] * 104) / 100 : p[3];
        sales.push([++line, ds, sk, p[0], qty, price, p[4], Math.round(qty * price * 100) / 100]);
        const k = `${ym}|${sk}`; monthTotals.set(k, (monthTotals.get(k) ?? 0) + qty * price);
      }
    }
  }
  // Targets: last year's month plus 6 % for 2025 (rounded to 100); 2024 targets are flat estimates.
  for (const [k, v] of [...monthTotals].sort()) {
    const [ym, sk] = k.split('|');
    if (ym.startsWith('2025')) {
      const prev = monthTotals.get(`2024${ym.slice(4)}|${sk}`);
      targets.push([ym, +sk, Math.round(((prev ?? v * 0.95) * 1.06) / 100) * 100]);
    } else targets.push([ym, +sk, Math.round((v * (0.95 + R() * 0.1)) / 100) * 100]);
  }
  return { Sales: sales, Product: product, Store: store, Date: date, Targets: targets };
}

/** The model the DAX editor runs on: tables, relationships and the marked date table. */
export function northbayModel(): ModelSpec {
  const t = northbayTables();
  return {
    tables: Object.entries(t).map(([name, rows]) => ({ name, cols: rows[0] as string[], rows: rows.slice(1) as (string | number)[][] })),
    relationships: [
      { many: 'Sales', fk: 'ProductKey', one: 'Product', pk: 'ProductKey' },
      { many: 'Sales', fk: 'StoreKey', one: 'Store', pk: 'StoreKey' },
      { many: 'Sales', fk: 'Date', one: 'Date', pk: 'Date' },
      { many: 'Targets', fk: 'StoreKey', one: 'Store', pk: 'StoreKey' },
    ],
    dateTable: { table: 'Date', col: 'Date' },
  };
}

/** One table as CSV text (for "Download the data"). */
export function toCsv(rows: (string | number)[][]) {
  return rows.map((r) => r.map((v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : String(v))).join(',')).join('\r\n') + '\r\n';
}
