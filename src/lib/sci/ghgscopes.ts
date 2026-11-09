// Small-organisation greenhouse gas inventory arithmetic in the GHG Protocol's structure: activity rows ×
// emission factors the user types, grouped into Scope 1 (direct), Scope 2 (purchased energy, location- and
// market-based) and Scope 3 (other indirect, by category), totals per year, intensity per employee and per
// revenue, and year-on-year change. No factors are built in as data. Plain TypeScript, no DOM.
import { num } from './num.ts';

/** Split CSV/TSV text into rows of cells, with quoted fields ("a, b" and "" for a quote). Tabs win if any
 *  line has one, then semicolons if the first line has one and no comma, else commas. */
export function splitTable(text: string): string[][] {
  const t = text.replace(/\r\n?/g, '\n');
  const first = t.split('\n').find((l) => l.trim()) ?? '';
  const sep = t.includes('\t') ? '\t' : first.includes(';') && !first.includes(',') ? ';' : ',';
  const out: string[][] = [];
  let row: string[] = [], cell = '', inQ = false, quoted = false;
  const endCell = () => { row.push(quoted ? cell : cell.trim()); cell = ''; quoted = false; };
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (inQ) {
      if (ch === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += ch;
    } else if (ch === '"' && cell.trim() === '') { inQ = true; quoted = true; cell = ''; }
    else if (ch === sep) endCell();
    else if (ch === '\n') { endCell(); out.push(row); row = []; }
    else cell += ch;
  }
  endCell(); out.push(row);
  return out.filter((r) => r.some((c) => c.trim() !== ''));
}

export type Scope = 1 | 2 | 3;
export type ActType = { id: string; scope: Scope; category: string; unit: string; factorHelp: string };
/** Activity types. Scope 3 category numbers follow the GHG Protocol Corporate Value Chain (Scope 3) Standard. */
export const TYPES: ActType[] = [
  { id: 'stationary', scope: 1, category: 'Stationary combustion', unit: 'kWh', factorHelp: 'kg CO₂e per unit of fuel' },
  { id: 'mobile', scope: 1, category: 'Mobile combustion', unit: 'L', factorHelp: 'kg CO₂e per unit of fuel' },
  { id: 'refrigerant', scope: 1, category: 'Fugitive (refrigerant leaks)', unit: 'kg', factorHelp: 'GWP (kg CO₂e per kg of gas)' },
  { id: 'process', scope: 1, category: 'Process emissions', unit: 'unit', factorHelp: 'kg CO₂e per unit' },
  { id: 'electricity', scope: 2, category: 'Purchased electricity', unit: 'kWh', factorHelp: 'kg CO₂e per kWh (grid average); market factor from your supplier or residual mix' },
  { id: 'heat', scope: 2, category: 'Purchased heat, steam and cooling', unit: 'kWh', factorHelp: 'kg CO₂e per kWh' },
  { id: 'goods', scope: 3, category: '1 Purchased goods and services', unit: 'spend', factorHelp: 'kg CO₂e per unit of currency (spend-based) or per item' },
  { id: 'capital', scope: 3, category: '2 Capital goods', unit: 'spend', factorHelp: 'kg CO₂e per unit of currency' },
  { id: 'fuel-energy', scope: 3, category: '3 Fuel- and energy-related activities', unit: 'kWh', factorHelp: 'kg CO₂e per kWh (upstream and losses)' },
  { id: 'freight', scope: 3, category: '4 Upstream transportation', unit: 't·km', factorHelp: 'kg CO₂e per tonne-km' },
  { id: 'waste', scope: 3, category: '5 Waste generated in operations', unit: 't', factorHelp: 'kg CO₂e per tonne' },
  { id: 'travel', scope: 3, category: '6 Business travel', unit: 'km', factorHelp: 'kg CO₂e per passenger-km, night or unit spent' },
  { id: 'commuting', scope: 3, category: '7 Employee commuting', unit: 'km', factorHelp: 'kg CO₂e per km' },
];
const byKey = new Map<string, ActType>();
for (const t of TYPES) { byKey.set(t.id, t); byKey.set(t.category.toLowerCase(), t); byKey.set(t.category.replace(/^\d+ /, '').toLowerCase(), t); }
export const typeOf = (s: string) => byKey.get(s.trim().toLowerCase());

export type Row = { year: number; type: ActType; desc: string; amount: number; unit: string; factor: number; market: number | null };
export const HEADER = ['year', 'type', 'description', 'amount', 'unit', 'factor_kg_co2e_per_unit', 'market_factor_kg_co2e_per_unit'];

/** Read rows "year, type, description, amount, unit, factor[, market factor]". A header row is skipped. */
export function readRows(text: string): { rows: Row[]; errors: string[] } {
  const rows: Row[] = [], errors: string[] = [];
  splitTable(text).forEach((cells, i) => {
    const at = `Row ${i + 1}`;
    const year = num(cells[0] ?? '');
    if (i === 0 && !Number.isFinite(year)) return; // header
    if (cells.length < 6) { errors.push(`${at}: needs year, type, description, amount, unit and factor (and a market factor for Scope 2).`); return; }
    const type = typeOf(cells[1]);
    if (!Number.isInteger(year) || year < 1900 || year > 2200) { errors.push(`${at}: "${cells[0]}" is not a year.`); return; }
    if (!type) { errors.push(`${at}: unknown type "${cells[1]}". Use one of: ${TYPES.map((t) => t.id).join(', ')}.`); return; }
    const amount = num(cells[3]), factor = num(cells[5]);
    const mtxt = (cells[6] ?? '').trim(), market = mtxt === '' ? null : num(mtxt);
    if (!Number.isFinite(amount) || amount < 0) { errors.push(`${at}: the amount "${cells[3]}" must be a number, 0 or more.`); return; }
    if (!Number.isFinite(factor) || factor < 0) { errors.push(`${at}: the factor "${cells[5]}" must be a number, 0 or more.`); return; }
    if (market != null && (!Number.isFinite(market) || market < 0)) { errors.push(`${at}: the market factor "${mtxt}" must be a number, 0 or more, or empty.`); return; }
    rows.push({ year, type, desc: cells[2].trim(), amount, unit: cells[4].trim() || type.unit, factor, market: type.scope === 2 ? market : null });
  });
  return { rows, errors };
}

export const rowKg = (r: Row) => r.amount * r.factor;
/** Market-based kg: Scope 2 rows use their market factor, or the location factor when none is given. */
export const rowKgMarket = (r: Row) => (r.type.scope === 2 && r.market != null ? r.amount * r.market : r.amount * r.factor);

export type YearTotals = {
  year: number; s1: number; s2loc: number; s2mkt: number; s3: number; totalLoc: number; totalMkt: number;
  /** kg by category (location-based for Scope 2), in TYPES order. */
  byCat: Map<string, number>;
  /** Scope 2 rows with no market factor (the location factor was used). */
  s2NoMarket: number;
};
export function totals(rows: Row[]): YearTotals[] {
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
  return years.map((year) => {
    const ys = rows.filter((r) => r.year === year);
    const sum = (f: (r: Row) => number, scope: Scope) => ys.filter((r) => r.type.scope === scope).reduce((a, r) => a + f(r), 0);
    const s1 = sum(rowKg, 1), s2loc = sum(rowKg, 2), s2mkt = sum(rowKgMarket, 2), s3 = sum(rowKg, 3);
    const byCat = new Map<string, number>();
    for (const t of TYPES) { const v = ys.filter((r) => r.type === t).reduce((a, r) => a + rowKg(r), 0); if (ys.some((r) => r.type === t)) byCat.set(t.category, v); }
    return { year, s1, s2loc, s2mkt, s3, totalLoc: s1 + s2loc + s3, totalMkt: s1 + s2mkt + s3, byCat, s2NoMarket: ys.filter((r) => r.type.scope === 2 && r.market == null).length };
  });
}

/** Intensity in tonnes CO₂e per employee and per million of revenue. */
export function intensity(kg: number, employees: number, revenue: number) {
  return { perEmployee: employees > 0 ? kg / 1000 / employees : NaN, perMillion: revenue > 0 ? kg / 1000 / (revenue / 1e6) : NaN };
}
/** Change from a to b: absolute and as a fraction of a. */
export const change = (a: number, b: number) => ({ abs: b - a, rel: a > 0 ? (b - a) / a : NaN });

/** CSV rows of the input with the computed kg added. */
export function exportRows(rows: Row[]): (string | number)[][] {
  const r3 = (x: number) => Math.round(x * 1000) / 1000;
  return [[...HEADER, 'scope', 'category', 'kg_co2e_location', 'kg_co2e_market'],
    ...rows.map((r) => [r.year, r.type.id, r.desc, r.amount, r.unit, r.factor, r.market ?? '', r.type.scope, r.type.category, r3(rowKg(r)), r3(rowKgMarket(r))])];
}

/** A made-up small business over two years. All factors are rounded examples, not official values. */
export const EXAMPLE = `year,type,description,amount,unit,factor,market factor
2024,stationary,Natural gas for heating,60000,kWh,0.2,
2024,mobile,Diesel for 2 vans,5000,L,2.7,
2024,refrigerant,Air conditioning top-up,2,kg,2000,
2024,electricity,Office and workshop,80000,kWh,0.4,0.45
2024,goods,Office supplies and materials,150000,spend,0.3,
2024,travel,Flights,40000,km,0.15,
2024,commuting,Staff commuting,120000,km,0.12,
2024,waste,Mixed waste to landfill,8,t,500,
2025,stationary,Natural gas for heating,52000,kWh,0.2,
2025,mobile,Diesel for 2 vans,4600,L,2.7,
2025,refrigerant,Air conditioning top-up,1,kg,2000,
2025,electricity,Office and workshop,76000,kWh,0.38,0.05
2025,goods,Office supplies and materials,160000,spend,0.3,
2025,travel,Flights,30000,km,0.15,
2025,commuting,Staff commuting,125000,km,0.12,
2025,waste,Mixed waste to landfill,6,t,500,`;
