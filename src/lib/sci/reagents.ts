// Reagent inventory: dates on labels, expiry (from the label or from a "use within N days of opening" rule),
// expiring-soon and low-stock flags, searching, and reading and writing spreadsheet rows. Plain TypeScript, no DOM.
// Dates are calendar days (YYYY-MM-DD), counted in whole days with no time zone, so "expires today" never
// depends on the hour or on daylight saving.

export type Reagent = {
  id: string;
  name: string;
  cas: string;        // CAS number or catalogue number (free text)
  location: string;   // fridge, shelf, cabinet …
  amount: number;     // NaN when not known
  unit: string;
  min: number;        // reorder level: flag as low at or below this amount (NaN or 0: no flag)
  lot: string;
  supplier: string;
  opened: string;     // YYYY-MM-DD or ''
  expiry: string;     // YYYY-MM-DD or ''
  useDays: number;    // use within this many days of opening (NaN: no rule)
  notes: string;
};

export type DateOrder = 'dmy' | 'mdy';

/** Day number (days since 1970-01-01) of a YYYY-MM-DD date. NaN for '' or a bad date. */
export function dayNum(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return NaN;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) return NaN;
  return Date.UTC(y, mo - 1, d) / 864e5;
}

/** YYYY-MM-DD of a day number. */
export function isoDay(n: number): string {
  return new Date(n * 864e5).toISOString().slice(0, 10);
}

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const pad = (n: number) => String(n).padStart(2, '0');
const mk = (y: number, m: number, d: number) => {
  if (y < 100) y += 2000;
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
};
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * A date as written on a label or in a spreadsheet, as YYYY-MM-DD. Accepts 2027-03-31, 2027/3/31, 31/03/2027 or
 * 03/31/2027 (by `order`), 31.03.2027, 31 Mar 2027, Mar 2027, 2027-03 and 03/2027. A month with no day (common for
 * expiry dates) means the last day of that month. Returns '' for an empty cell and null when it cannot be read.
 */
export function parseDate(s: string, order: DateOrder = 'dmy'): string | null {
  const t = (s ?? '').trim().toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ');
  if (!t) return '';
  let m;
  if ((m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ t].*)?$/.exec(t))) return mk(+m[1], +m[2], +m[3]);
  if ((m = /^(\d{4})[-/.](\d{1,2})$/.exec(t))) return mk(+m[1], +m[2], daysInMonth(+m[1], +m[2]) || 1);
  if ((m = /^(\d{1,2})[-/.](\d{4})$/.exec(t))) return +m[1] >= 1 && +m[1] <= 12 ? mk(+m[2], +m[1], daysInMonth(+m[2], +m[1])) : null;
  if ((m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/.exec(t))) {
    const a = +m[1], b = +m[2], y = +m[3];
    return order === 'dmy' ? mk(y, b, a) : mk(y, a, b);
  }
  const mon = (w: string) => { const i = MONTHS.indexOf(w.slice(0, 3)); return i < 0 ? 0 : i + 1; };
  if ((m = /^(\d{1,2})[ -]([a-z]{3,9})\.?[ -](\d{2}|\d{4})$/.exec(t)) && mon(m[2])) return mk(+m[3], mon(m[2]), +m[1]);
  if ((m = /^([a-z]{3,9})\.? (\d{1,2}) (\d{4})$/.exec(t)) && mon(m[1])) return mk(+m[3], mon(m[1]), +m[2]);
  if ((m = /^([a-z]{3,9})\.?[ -](\d{4})$/.exec(t)) && mon(m[1])) { const y = +m[2], mo = mon(m[1]); return mk(y, mo, daysInMonth(y, mo)); }
  return null;
}

export type Expiry = { day: number; iso: string; from: 'label' | 'opened' | 'none' };

/** The date a reagent should be used by: the label's expiry, or the opening date plus the use-within rule, whichever is sooner. */
export function effectiveExpiry(r: Pick<Reagent, 'expiry' | 'opened' | 'useDays'>): Expiry {
  const lab = dayNum(r.expiry);
  const op = dayNum(r.opened);
  const rule = Number.isFinite(op) && Number.isFinite(r.useDays) && r.useDays >= 0 ? op + Math.round(r.useDays) : NaN;
  if (Number.isFinite(rule) && (!Number.isFinite(lab) || rule < lab)) return { day: rule, iso: isoDay(rule), from: 'opened' };
  if (Number.isFinite(lab)) return { day: lab, iso: isoDay(lab), from: 'label' };
  return { day: NaN, iso: '', from: 'none' };
}

export type State = 'expired' | 'soon' | 'ok' | 'none';
export type Status = { state: State; days: number; exp: Expiry; low: boolean; empty: boolean };

/**
 * Where a reagent stands on `today` (a day number). Expired: the use-by day has passed (a reagent may be used on
 * its expiry day itself). Soon: it expires within `soonDays` days, counting today. Low: the amount is at or below
 * the reorder level. Empty: the amount is zero.
 */
export function status(r: Reagent, today: number, soonDays = 30): Status {
  const exp = effectiveExpiry(r);
  const days = exp.day - today;
  const state: State = !Number.isFinite(days) ? 'none' : days < 0 ? 'expired' : days <= soonDays ? 'soon' : 'ok';
  const empty = Number.isFinite(r.amount) && r.amount <= 0;
  const low = Number.isFinite(r.amount) && Number.isFinite(r.min) && r.min > 0 && r.amount <= r.min;
  return { state, days, exp, low: low || empty, empty };
}

/** Plain words for the days left: "expired 3 days ago", "expires today", "12 days left". */
export function daysText(days: number): string {
  if (!Number.isFinite(days)) return 'no expiry date';
  if (days < -1) return `expired ${-days} days ago`;
  if (days === -1) return 'expired yesterday';
  if (days === 0) return 'expires today';
  if (days === 1) return 'expires tomorrow';
  return `${days} days left`;
}

export type Filter = 'all' | 'expired' | 'soon' | 'attention' | 'low' | 'opened' | 'unopened';
export type Sort = 'expiry' | 'name' | 'location' | 'amount';

/** Reagents matching a search (every word must appear in name, CAS, location, lot, supplier or notes) and a filter, sorted. */
export function select(list: Reagent[], query: string, filter: Filter, sort: Sort, today: number, soonDays = 30): Reagent[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const keep = list.filter((r) => {
    const hay = [r.name, r.cas, r.location, r.lot, r.supplier, r.notes].join(' ').toLowerCase();
    if (!words.every((w) => hay.includes(w))) return false;
    const s = status(r, today, soonDays);
    switch (filter) {
      case 'expired': return s.state === 'expired';
      case 'soon': return s.state === 'soon';
      case 'attention': return s.state === 'expired' || s.state === 'soon' || s.low;
      case 'low': return s.low;
      case 'opened': return !!r.opened;
      case 'unopened': return !r.opened;
      default: return true;
    }
  });
  const by = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true });
  const exp = (r: Reagent) => { const d = effectiveExpiry(r).day; return Number.isFinite(d) ? d : Infinity; };
  return keep.sort((a, b) => {
    if (sort === 'name') return by(a.name, b.name) || by(a.location, b.location);
    if (sort === 'location') return by(a.location, b.location) || by(a.name, b.name);
    if (sort === 'amount') {
      const fa = Number.isFinite(a.min) && a.min > 0 ? a.amount / a.min : Infinity, fb = Number.isFinite(b.min) && b.min > 0 ? b.amount / b.min : Infinity;
      return fa - fb || by(a.name, b.name);
    }
    return exp(a) - exp(b) || by(a.name, b.name);
  });
}

export type Summary = { total: number; expired: number; soon: number; low: number; empty: number; noDate: number };
export function summary(list: Reagent[], today: number, soonDays = 30): Summary {
  const s: Summary = { total: list.length, expired: 0, soon: 0, low: 0, empty: 0, noDate: 0 };
  for (const r of list) {
    const t = status(r, today, soonDays);
    if (t.state === 'expired') s.expired++;
    if (t.state === 'soon') s.soon++;
    if (t.state === 'none') s.noDate++;
    if (t.low) s.low++;
    if (t.empty) s.empty++;
  }
  return s;
}

/** The spreadsheet columns, in order, with the header names people commonly use for each. */
export const COLUMNS: { key: keyof Reagent; head: string; aliases: string[] }[] = [
  { key: 'name', head: 'Name', aliases: ['name', 'reagent', 'chemical', 'item', 'product', 'description', 'compound', 'substance'] },
  { key: 'cas', head: 'CAS or cat. no.', aliases: ['cas', 'cas no', 'cas number', 'cat no', 'catalogue number', 'catalog number', 'catalogue no', 'catalog no', 'cat', 'product number', 'code', 'cas or cat no'] },
  { key: 'location', head: 'Location', aliases: ['location', 'where', 'storage', 'place', 'shelf', 'stored', 'room'] },
  { key: 'amount', head: 'Amount', aliases: ['amount', 'quantity', 'qty', 'amount left', 'stock', 'remaining', 'size', 'volume', 'mass'] },
  { key: 'unit', head: 'Unit', aliases: ['unit', 'units', 'uom'] },
  { key: 'min', head: 'Reorder at', aliases: ['reorder at', 'reorder', 'reorder level', 'min', 'minimum', 'min stock', 'low stock', 'reorder point', 'par'] },
  { key: 'lot', head: 'Lot', aliases: ['lot', 'lot no', 'lot number', 'batch', 'batch no', 'batch number'] },
  { key: 'supplier', head: 'Supplier', aliases: ['supplier', 'vendor', 'manufacturer', 'brand', 'maker', 'company'] },
  { key: 'opened', head: 'Opened', aliases: ['opened', 'date opened', 'open date', 'opened on', 'first opened'] },
  { key: 'expiry', head: 'Expiry', aliases: ['expiry', 'expiry date', 'expiration', 'expiration date', 'exp', 'exp date', 'expires', 'use by', 'best before', 'retest date'] },
  { key: 'useDays', head: 'Use within days of opening', aliases: ['use within days of opening', 'use within', 'days after opening', 'shelf life after opening', 'use within days', 'open life'] },
  { key: 'notes', head: 'Notes', aliases: ['notes', 'note', 'comments', 'comment', 'remarks', 'hazard', 'hazards'] },
];

const norm = (h: string) => h.toLowerCase().replace(/[._()#:/-]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Number from a cell; "500 mL" gives 500 (and the unit, see splitAmount). */
export function splitAmount(s: string): { amount: number; unit: string } {
  const t = (s ?? '').trim().replace(',', '.');
  const m = /^(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)\s*(.*)$/i.exec(t);
  if (!m) return { amount: NaN, unit: t };
  return { amount: Number(m[1]), unit: m[2].trim() };
}

export type ImportResult = { items: Reagent[]; problems: string[]; mapped: string[]; unmapped: string[] };

/**
 * Reagents from table rows (first row = headers). Headers are matched to columns by common names; a table with
 * no recognisable headers is read in the column order of COLUMNS. Rows with no name are skipped with a message.
 */
export function fromTable(rows: string[][], order: DateOrder = 'dmy', newId: () => string = randomId): ImportResult {
  const problems: string[] = [];
  rows = rows.filter((r) => r.some((c) => (c ?? '').trim() !== ''));
  if (!rows.length) return { items: [], problems: ['There are no rows to read.'], mapped: [], unmapped: [] };
  const head = rows[0].map(norm);
  const idx = new Map<keyof Reagent, number>();
  const mapped: string[] = [], unmapped: string[] = [];
  head.forEach((h, i) => {
    const c = COLUMNS.find((c) => !idx.has(c.key) && (c.aliases.includes(h) || norm(c.head) === h));
    if (c) { idx.set(c.key, i); mapped.push(`${rows[0][i].trim()} → ${c.head}`); } else if (h) unmapped.push(rows[0][i].trim());
  });
  let body = rows.slice(1);
  if (!idx.has('name')) {
    // No header row we know: read the columns in the standard order.
    idx.clear(); mapped.length = 0; unmapped.length = 0;
    COLUMNS.forEach((c, i) => idx.set(c.key, i));
    body = rows;
  }
  const get = (r: string[], k: keyof Reagent) => (idx.has(k) ? (r[idx.get(k)!] ?? '').trim() : '');
  const items: Reagent[] = [];
  body.forEach((r, n) => {
    const line = n + (body === rows ? 1 : 2);
    const name = get(r, 'name');
    if (!name) { problems.push(`Row ${line}: no name, skipped.`); return; }
    const a = splitAmount(get(r, 'amount'));
    let unit = get(r, 'unit') || a.unit;
    const date = (k: 'opened' | 'expiry') => {
      const v = parseDate(get(r, k), order);
      if (v === null) { problems.push(`Row ${line} (${name}): could not read the ${k === 'opened' ? 'opened' : 'expiry'} date "${get(r, k)}", left empty.`); return ''; }
      return v;
    };
    const minS = splitAmount(get(r, 'min')), useS = splitAmount(get(r, 'useDays'));
    if (get(r, 'amount') && !Number.isFinite(a.amount)) problems.push(`Row ${line} (${name}): the amount "${get(r, 'amount')}" is not a number, left empty.`);
    items.push({
      id: newId(), name, cas: get(r, 'cas'), location: get(r, 'location'), amount: a.amount, unit,
      min: minS.amount, lot: get(r, 'lot'), supplier: get(r, 'supplier'), opened: date('opened'), expiry: date('expiry'),
      useDays: useS.amount, notes: get(r, 'notes'),
    });
  });
  return { items, problems, mapped, unmapped };
}

const cell = (x: number) => (Number.isFinite(x) ? String(x) : '');
/** Rows for a CSV file: the header row, then one row per reagent (dates as YYYY-MM-DD). */
export function toTable(list: Reagent[], today?: number, soonDays = 30): string[][] {
  const extra = today !== undefined;
  const head = COLUMNS.map((c) => c.head).concat(extra ? ['Use by', 'Status'] : []);
  return [head, ...list.map((r) => {
    const row = COLUMNS.map((c) => { const v = r[c.key]; return typeof v === 'number' ? cell(v) : String(v ?? ''); });
    if (extra) {
      const s = status(r, today!, soonDays);
      row.push(s.exp.iso, [s.state === 'expired' ? 'Expired' : s.state === 'soon' ? 'Expiring soon' : s.state === 'ok' ? 'OK' : 'No date', s.empty ? 'Empty' : s.low ? 'Low stock' : ''].filter(Boolean).join('; '));
    }
    return row;
  })];
}

/** Check a JSON backup and turn it back into reagents. Throws with a plain message if it is not one. */
export function fromJson(text: string, newId: () => string = randomId): Reagent[] {
  let d: unknown;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  const arr = Array.isArray(d) ? d : (d as { reagents?: unknown })?.reagents;
  if (!Array.isArray(arr)) throw new Error('This JSON file has no list of reagents (expected { "reagents": [...] }).');
  const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const n = (v: unknown) => (typeof v === 'number' ? v : v === '' || v == null ? NaN : Number(v));
  const day = (v: unknown) => { const p = parseDate(s(v)); return p ?? ''; };
  return arr.filter((x) => x && typeof x === 'object' && s((x as Reagent).name).trim()).map((x) => {
    const r = x as Record<string, unknown>;
    return { id: s(r.id) || newId(), name: s(r.name).trim(), cas: s(r.cas), location: s(r.location), amount: n(r.amount), unit: s(r.unit), min: n(r.min), lot: s(r.lot), supplier: s(r.supplier), opened: day(r.opened), expiry: day(r.expiry), useDays: n(r.useDays), notes: s(r.notes) };
  });
}

/** JSON backup text (NaN written as null). */
export const toJson = (list: Reagent[]) => JSON.stringify({ app: 'fibub reagent inventory', version: 1, reagents: list }, (_k, v) => (typeof v === 'number' && !Number.isFinite(v) ? null : v), 1);

export function randomId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** A made-up example inventory, with dates placed relative to `today` so the flags always show. */
export function exampleList(today: number): Reagent[] {
  const d = (k: number) => isoDay(today + k);
  const r = (name: string, cas: string, location: string, amount: number, unit: string, min: number, lot: string, supplier: string, opened: string, expiry: string, useDays: number, notes = ''): Reagent =>
    ({ id: 'ex' + name.replace(/\W/g, '').slice(0, 8).toLowerCase(), name, cas, location, amount, unit, min, lot, supplier, opened, expiry, useDays, notes });
  return [
    r('Tris base', '77-86-1', 'Shelf B2', 450, 'g', 100, 'TB-0412', 'Supplier A', d(-120), d(600), NaN),
    r('Sodium chloride', '7647-14-5', 'Shelf B2', 80, 'g', 250, 'NC-2207', 'Supplier A', d(-300), d(900), NaN, 'Reorder soon'),
    r('Ethanol, absolute', '64-17-5', 'Flammables cabinet', 1.5, 'L', 1, 'ET-9931', 'Supplier B', d(-40), d(400), NaN, 'Flammable'),
    r('Trypsin-EDTA 0.25 %', '', 'Freezer −20 °C, box 3', 4, 'aliquots', 2, 'TE-5520', 'Supplier C', '', d(12), NaN),
    r('DMEM, high glucose', '', 'Fridge 2, door', 2, 'bottles', 1, 'DM-1187', 'Supplier C', d(-10), d(150), 28, 'Use within 4 weeks of opening'),
    r('Bradford reagent', '', 'Fridge 1', 0, 'mL', 50, 'BR-3301', 'Supplier D', d(-200), d(-15), NaN, 'Empty, bottle kept for lot record'),
    r('Ampicillin stock 100 mg/mL', '69-52-3', 'Freezer −20 °C, box 1', 12, 'aliquots', 4, 'made 2026', 'Made in lab', d(-5), d(170), NaN),
    r('Hydrogen peroxide 30 %', '7722-84-1', 'Fridge 1', 400, 'mL', 100, 'HP-0028', 'Supplier B', d(-170), d(220), 180, 'Oxidiser; use within 6 months of opening'),
  ];
}
