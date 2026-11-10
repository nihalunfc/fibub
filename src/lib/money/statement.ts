// Read a bank or card export (CSV, OFX, QIF), sort the spending into categories and find repeating charges.
// Plain TypeScript, no DOM. Spending is negative, money in is positive.

export interface Txn { date: string; desc: string; amount: number; cat?: string }

/** Split CSV text into rows. Handles quotes, and , ; tab or | separators. */
export function parseCsv(text: string): string[][] {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/).find((l) => l.trim()) || '';
  const count = (c: string) => { let n = 0, q = false; for (const ch of first) { if (ch === '"') q = !q; else if (ch === c && !q) n++; } return n; };
  const delim = [',', ';', '\t', '|'].map((c) => [c, count(c)] as const).sort((a, b) => b[1] - a[1])[0];
  const d = delim[1] ? delim[0] : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === d) { row.push(cell.trim()); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell.trim()); cell = ''; if (row.some((c) => c)) rows.push(row); row = []; }
    else cell += ch;
  }
  row.push(cell.trim()); if (row.some((c) => c)) rows.push(row);
  return rows;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const p2 = (n: number) => String(n).padStart(2, '0');
function iso(y: number, m: number, d: number): string {
  if (y < 100) y += y > 70 ? 1900 : 2000;
  if (m < 1 || m > 12 || d < 1 || d > 31) return '';
  return `${y}-${p2(m)}-${p2(d)}`;
}
/** Which order do slash dates use? Looks at every value: a first part above 12 means day first. */
export function dateOrder(values: string[]): 'dmy' | 'mdy' {
  let dmy = false, mdy = false;
  for (const v of values) {
    const m = v.trim().match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
    if (!m) continue;
    if (+m[1] > 12) dmy = true; if (+m[2] > 12) mdy = true;
  }
  return mdy && !dmy ? 'mdy' : 'dmy';
}
/** Date text to YYYY-MM-DD, or '' when it is not a date. */
export function parseDate(s: string, order: 'dmy' | 'mdy' = 'dmy'): string {
  s = s.trim(); let m;
  if ((m = s.match(/^(\d{4})[\/.\-]?(\d{2})[\/.\-]?(\d{2})(?!\d)/))) return iso(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/))) return order === 'dmy' ? iso(+m[3], +m[2], +m[1]) : iso(+m[3], +m[1], +m[2]);
  if ((m = s.match(/^(\d{1,2})[ \-]([A-Za-z]{3})[a-z]*[ \-,.]+(\d{2,4})/))) { const mo = MONTHS.indexOf(m[2].toLowerCase()) + 1; return mo ? iso(+m[3], mo, +m[1]) : ''; }
  if ((m = s.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2})(?:st|nd|rd|th)?,? (\d{2,4})/))) { const mo = MONTHS.indexOf(m[1].toLowerCase()) + 1; return mo ? iso(+m[3], mo, +m[2]) : ''; }
  return '';
}

/** "$1,234.56", "(45.00)", "45,00-", "1.234,56", "12.50 CR" to a number; NaN when empty or not a number. */
export function parseAmount(s: string): number {
  let t = (s || '').trim(); if (!t) return NaN;
  let neg = false;
  if (/^\(.*\)$/.test(t)) { neg = true; t = t.slice(1, -1); }
  if (/(\bDR|-)\s*$/i.test(t)) neg = true;
  if (/^[-−]/.test(t) || /^[^\d]*[-−]\d/.test(t)) neg = true;
  const cr = /\bCR\s*$/i.test(t);
  t = t.replace(/[^\d.,]/g, '');
  if (!/\d/.test(t)) return NaN;
  const lc = t.lastIndexOf(','), ld = t.lastIndexOf('.');
  if (lc > ld && t.length - lc - 1 <= 2 && t.length - lc - 1 > 0) t = t.replace(/\./g, '').replace(',', '.');
  else t = t.replace(/,/g, '');
  const v = parseFloat(t); if (isNaN(v)) return NaN;
  return neg && !cr ? -v : v;
}

export interface Mapping { header: boolean; date: number; desc: number; amount: number; debit: number; credit: number }

/** Guess which column is which from the header names, or from what the values look like. */
export function guessMapping(rows: string[][]): Mapping {
  const n = Math.max(0, ...rows.slice(0, 20).map((r) => r.length));
  const m: Mapping = { header: false, date: -1, desc: -1, amount: -1, debit: -1, credit: -1 };
  const h = rows[0] || [];
  const isHead = h.length > 0 && h.every((c) => !parseDate(c) && isNaN(parseAmount(c)));
  m.header = isHead;
  if (isHead) {
    h.forEach((c, i) => {
      const t = c.toLowerCase();
      if (m.date < 0 && /date/.test(t) && !/value date/.test(t)) m.date = i;
      else if (m.desc < 0 && /descr|detail|narrat|payee|memo|particular|merchant|name|reference/.test(t)) m.desc = i;
      else if (m.debit < 0 && /debit|withdraw|paid out|money out|\bout\b/.test(t)) m.debit = i;
      else if (m.credit < 0 && /credit|deposit|paid in|money in|\bin\b/.test(t)) m.credit = i;
      else if (m.amount < 0 && /amount|value|sum/.test(t)) m.amount = i;
    });
  }
  const body = rows.slice(isHead ? 1 : 0, 30);
  const col = (i: number) => body.map((r) => r[i] || '');
  if (m.date < 0) for (let i = 0; i < n; i++) if (col(i).filter((v) => parseDate(v)).length >= Math.max(1, body.length * 0.7)) { m.date = i; break; }
  if (m.amount < 0 && m.debit < 0) for (let i = n - 1; i >= 0; i--) if (i !== m.date && col(i).filter((v) => !isNaN(parseAmount(v))).length >= Math.max(1, body.length * 0.7)) { m.amount = i; break; }
  if (m.desc < 0) { let best = -1, len = 0; for (let i = 0; i < n; i++) { if ([m.date, m.amount, m.debit, m.credit].includes(i)) continue; const l = col(i).reduce((a, v) => a + (isNaN(parseAmount(v)) ? v.length : 0), 0); if (l > len) { len = l; best = i; } } m.desc = best; }
  return m;
}

/** Apply a column mapping. `spendPositive` flips signs for cards that show spending as positive. */
export function rowsToTxns(rows: string[][], m: Mapping, order: 'dmy' | 'mdy', spendPositive = false): Txn[] {
  const out: Txn[] = [];
  for (const r of rows.slice(m.header ? 1 : 0)) {
    const date = m.date >= 0 ? parseDate(r[m.date] || '', order) : ''; if (!date) continue;
    let amt = NaN;
    if (m.amount >= 0) amt = parseAmount(r[m.amount] || '');
    else {
      const d = m.debit >= 0 ? parseAmount(r[m.debit] || '') : NaN, c = m.credit >= 0 ? parseAmount(r[m.credit] || '') : NaN;
      if (!isNaN(d) && d !== 0) amt = -Math.abs(d); else if (!isNaN(c)) amt = Math.abs(c);
    }
    if (isNaN(amt)) continue;
    out.push({ date, desc: (m.desc >= 0 ? r[m.desc] || '' : '').replace(/\s+/g, ' ').trim(), amount: spendPositive && m.amount >= 0 ? -amt : amt });
  }
  return out;
}

export function parseOfx(text: string): Txn[] {
  const out: Txn[] = [];
  for (const blk of text.split(/<STMTTRN>/i).slice(1)) {
    const g = (tag: string) => (blk.match(new RegExp(`<${tag}>([^<\\r\\n]*)`, 'i')) || [])[1]?.trim() || '';
    const dt = g('DTPOSTED').match(/^(\d{4})(\d{2})(\d{2})/), amount = parseFloat(g('TRNAMT').replace(',', '.'));
    if (!dt || isNaN(amount)) continue;
    out.push({ date: iso(+dt[1], +dt[2], +dt[3]), desc: [g('NAME'), g('MEMO')].filter(Boolean).join(' ').replace(/\s+/g, ' '), amount });
  }
  return out;
}

export function parseQif(text: string): Txn[] {
  const out: Txn[] = []; let cur: any = {};
  const dates: string[] = [];
  for (const l of text.split(/\r?\n/)) if (l[0] === 'D') dates.push(l.slice(1));
  const order = dateOrder(dates.map((d) => d.replace(/'/g, '/')));
  for (const l of text.split(/\r?\n/)) {
    const c = l[0], v = l.slice(1).trim();
    if (c === '^') { if (cur.date && !isNaN(cur.amount)) out.push({ date: cur.date, desc: cur.desc || '', amount: cur.amount }); cur = {}; }
    else if (c === 'D') cur.date = parseDate(v.replace(/'/g, '/').replace(/\s+/g, ''), order);
    else if (c === 'T' || c === 'U') cur.amount = parseAmount(v);
    else if (c === 'P') cur.desc = v; else if (c === 'M' && !cur.desc) cur.desc = v;
  }
  return out;
}

export const sniff = (text: string): 'ofx' | 'qif' | 'csv' => /<STMTTRN>|<OFX>/i.test(text) ? 'ofx' : /^!Type:/im.test(text) ? 'qif' : 'csv';

// ---- categories ----
export const DEFAULT_RULES = `Groceries: grocery, supermarket, walmart, costco, tesco, aldi, lidl, loblaws, kroger, safeway, whole foods, carrefour, lulu, big basket, bigbasket, dmart, no frills
Eating out: restaurant, cafe, coffee, starbucks, mcdonald, burger, pizza, kfc, subway, tim hortons, uber eats, doordash, deliveroo, zomato, swiggy, domino
Transport: uber, lyft, taxi, fuel, petrol, gas station, shell, esso, transit, metro, train, bus, parking, ola, careem, railway
Housing: rent, mortgage, landlord, property tax, hoa
Bills and utilities: electric, hydro, water, internet, broadband, phone, mobile, insurance, council tax, utility, airtel, jio, rogers, bell, vodafone, verizon
Subscriptions: netflix, spotify, disney, prime, youtube, apple.com, icloud, google one, subscription, gym, adobe, microsoft 365, dropbox, patreon
Shopping: amazon, ebay, target, ikea, flipkart, argos, mall, store, shop
Health: pharmacy, chemist, doctor, dental, clinic, hospital, optical, boots
Travel: airline, airways, hotel, airbnb, booking.com, expedia, flight
Cash: atm, cash withdrawal
Fees and interest: fee, interest charge, overdraft, service charge
Transfers: transfer, e-transfer, etransfer, payment thank you, credit card payment, zelle, venmo
Income: salary, payroll, wages, direct deposit, deposit, refund, dividend, interest paid, interest earned`;

export interface Rule { cat: string; words: string[] }
export function parseRules(text: string): Rule[] {
  return text.split(/\r?\n/).map((l) => { const i = l.indexOf(':'); if (i < 1) return null; const words = l.slice(i + 1).split(',').map((w) => w.trim().toLowerCase()).filter(Boolean); return words.length ? { cat: l.slice(0, i).trim(), words } : null; }).filter(Boolean) as Rule[];
}
/** First rule with a matching keyword wins. Money in with no match is Income; money out with no match is Other. */
export function categorise(t: Txn, rules: Rule[]): string {
  const d = t.desc.toLowerCase();
  for (const r of rules) if (r.words.some((w) => d.includes(w))) return r.cat;
  return t.amount >= 0 ? 'Income' : 'Other';
}

// ---- merchants and repeating charges ----
export function merchant(desc: string): string {
  let s = desc.toLowerCase().replace(/\b(pos|purchase|debit card|card|visa|mastercard|payment to|payment|ach|pre-?authorized|recurring|online|www|http|com)\b/g, ' ').replace(/[#*]+\S*/g, ' ').replace(/[\d_/\\.,:;@()+\-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const w = s.split(' ').filter((x) => x.length > 1).slice(0, 2).join(' ');
  return w || desc.toLowerCase().slice(0, 20);
}
const dayNum = (d: string) => Math.round(Date.parse(d + 'T00:00:00Z') / 864e5);

export interface Repeat { merchant: string; amount: number; every: string; times: number; perYear: number; yearly: number; last: string }
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

/** Same shop, about the same amount, about the same gap each time. */
export function findRepeats(txns: Txn[]): Repeat[] {
  const by = new Map<string, Txn[]>();
  for (const t of txns) if (t.amount < 0) { const k = merchant(t.desc); (by.get(k) || by.set(k, []).get(k)!).push(t); }
  const out: Repeat[] = [];
  for (const [k, list] of by) {
    // group by amount within 10% (or 1.00) of the group's first charge
    const groups: Txn[][] = [];
    for (const t of list) { const g = groups.find((g) => Math.abs(Math.abs(g[0].amount) - Math.abs(t.amount)) <= Math.max(1, Math.abs(g[0].amount) * 0.1)); g ? g.push(t) : groups.push([t]); }
    for (const g of groups) {
      const days = g.map((t) => dayNum(t.date)).sort((a, b) => a - b);
      if (g.length < 2) continue;
      const gaps = days.slice(1).map((d, i) => d - days[i]), mg = median(gaps);
      const kinds: [string, number, number, number, number][] = [['weekly', 6, 8, 52, 3], ['every 2 weeks', 13, 15, 26, 3], ['monthly', 26, 35, 12, 3], ['quarterly', 85, 97, 4, 2], ['yearly', 350, 380, 1, 2]];
      const kind = kinds.find((x) => mg >= x[1] && mg <= x[2] && g.length >= x[4]);
      if (!kind) continue;
      if (gaps.filter((x) => x >= kind[1] - 3 && x <= kind[2] + 3).length < gaps.length * 0.75) continue;
      const amt = median(g.map((t) => Math.abs(t.amount)));
      out.push({ merchant: k, amount: round2(amt), every: kind[0], times: g.length, perYear: kind[3], yearly: round2(amt * kind[3]), last: g.map((t) => t.date).sort().pop()! });
    }
  }
  return out.sort((a, b) => b.yearly - a.yearly);
}

// ---- summaries ----
export const round2 = (n: number) => Math.round(n * 100 + (n < 0 ? -1e-9 : 1e-9)) / 100;
export interface Summary {
  months: string[]; income: number; spending: number; net: number;
  cats: { cat: string; total: number; share: number; count: number }[];
  byMonth: Record<string, Record<string, number>>; monthSpend: Record<string, number>; monthIncome: Record<string, number>;
  merchants: { name: string; total: number; count: number }[]; repeats: Repeat[]; from: string; to: string; count: number;
}
export function summarise(txns: Txn[]): Summary {
  const byMonth: Record<string, Record<string, number>> = {}, monthSpend: Record<string, number> = {}, monthIncome: Record<string, number> = {};
  const cat = new Map<string, { total: number; count: number }>(), mer = new Map<string, { total: number; count: number }>();
  let income = 0, spending = 0;
  for (const t of txns) {
    const mo = t.date.slice(0, 7), c = t.cat || 'Other';
    if (t.amount >= 0) { if (c === 'Transfers') continue; income += t.amount; monthIncome[mo] = (monthIncome[mo] || 0) + t.amount; continue; }
    if (c === 'Transfers') continue;
    const v = -t.amount; spending += v; monthSpend[mo] = (monthSpend[mo] || 0) + v;
    (byMonth[mo] ||= {})[c] = (byMonth[mo][c] || 0) + v;
    const a = cat.get(c) || { total: 0, count: 0 }; a.total += v; a.count++; cat.set(c, a);
    const k = merchant(t.desc), b = mer.get(k) || { total: 0, count: 0 }; b.total += v; b.count++; mer.set(k, b);
  }
  const dates = txns.map((t) => t.date).sort();
  const months = [...new Set(txns.map((t) => t.date.slice(0, 7)))].sort();
  return {
    months, income: round2(income), spending: round2(spending), net: round2(income - spending),
    cats: [...cat].map(([c, v]) => ({ cat: c, total: round2(v.total), share: spending ? v.total / spending : 0, count: v.count })).sort((a, b) => b.total - a.total),
    byMonth, monthSpend, monthIncome,
    merchants: [...mer].map(([name, v]) => ({ name, total: round2(v.total), count: v.count })).sort((a, b) => b.total - a.total).slice(0, 10),
    repeats: findRepeats(txns.filter((t) => t.cat !== 'Transfers')), from: dates[0] || '', to: dates[dates.length - 1] || '', count: txns.length,
  };
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map((v) => { const s = String(v); return /[",\r\n;]/.test(s) || /^[=+\-@]/.test(s) && isNaN(Number(s)) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n') + '\r\n';
}
