// Plain maths and text helpers for the medical money tools (bill checker, expense tax helper, claim packet).
// No DOM. Nothing here gives tax, billing or legal advice: it adds up what the person typed and lists questions.

export type DateOrder = 'dmy' | 'mdy';
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const pad = (n: number) => String(n).padStart(2, '0');
const valid = (y: number, m: number, d: number) => { const t = new Date(Date.UTC(y, m - 1, d)); return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d; };

/** One date at the start of a text -> ISO 'YYYY-MM-DD', or ''. Handles 2026-03-14, 14/03/2026, 3/14/26, 14 Mar 2026, Mar 14, 2026. */
export function toIso(s: string, order: DateOrder = 'dmy'): string {
  s = s.trim();
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return valid(+m[1], +m[2], +m[3]) ? `${m[1]}-${pad(+m[2])}-${pad(+m[3])}` : '';
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/);
  if (m) {
    let a = +m[1], b = +m[2], y = +m[3]; if (m[3].length === 2) y += 2000;
    let d = order === 'dmy' ? a : b, mo = order === 'dmy' ? b : a;
    if (mo > 12 && d <= 12) [d, mo] = [mo, d];
    return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : '';
  }
  m = s.match(/^(\d{1,2})[ -]([A-Za-z]{3})[a-z]*\.?,?[ -](\d{4})$/);
  if (m) { const mo = MONTHS.indexOf(m[2].toLowerCase()) + 1; return mo && valid(+m[3], mo, +m[1]) ? `${m[3]}-${pad(mo)}-${pad(+m[1])}` : ''; }
  m = s.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2}),? (\d{4})$/);
  if (m) { const mo = MONTHS.indexOf(m[1].toLowerCase()) + 1; return mo && valid(+m[3], mo, +m[2]) ? `${m[3]}-${pad(mo)}-${pad(+m[2])}` : ''; }
  return '';
}

/** Find the first date written anywhere in a text (used to guess a receipt's date from its PDF text). */
export function findDate(text: string, order: DateOrder = 'dmy'): string {
  const pats = [
    /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b/g,
    /\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g,
    /\b\d{1,2}[ -][A-Za-z]{3,9}\.?,?[ -]\d{4}\b/g,
    /\b[A-Za-z]{3,9}\.? \d{1,2},? \d{4}\b/g,
  ];
  let best = { at: Infinity, iso: '' };
  for (const p of pats) for (const m of text.matchAll(p)) {
    const iso = toIso(m[0], order);
    if (iso && (m.index ?? 0) < best.at) best = { at: m.index ?? 0, iso };
  }
  return best.iso;
}

/** Number from '1,234.50', '(12.00)', '$12', '12.00-' ; NaN when it is not a number. */
export function toNum(s: string): number {
  let t = s.trim().replace(/^(?:CAD|USD|INR|GBP|AED|Rs\.?|[$£€₹])\s*/i, '').replace(/\s/g, '');
  let neg = false;
  if (/^\(.*\)$/.test(t)) { neg = true; t = t.slice(1, -1); }
  if (t.endsWith('-')) { neg = true; t = t.slice(0, -1); }
  if (t.startsWith('-')) { neg = !neg; t = t.slice(1); }
  if (!/^(\d{1,3}(,\d{2,3})*|\d+)(\.\d+)?$/.test(t)) return NaN;
  const v = parseFloat(t.replace(/,/g, ''));
  return neg ? -v : v;
}
export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Split a CSV / tab line into cells (quotes understood). */
export function splitCells(line: string): string[] {
  const d = line.includes('\t') ? '\t' : ',';
  const out: string[] = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === d) { out.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  out.push(cur.trim());
  return out;
}

// ---------- Bill lines ----------
export interface BillLine { date: string; code: string; desc: string; qty: number | null; unit: number | null; amount: number; notRecv?: boolean }

const CODE = /^(?=[A-Z0-9.\-]*\d)[A-Z0-9][A-Z0-9.\-]{3,9}$/;

/** Turn pasted bill text or CSV rows into lines. Lines without an amount are skipped (headings, addresses). */
export function parseBill(text: string, order: DateOrder = 'dmy'): BillLine[] {
  const out: BillLine[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue;
    const delimited = line.includes('\t') || (line.match(/,/g) || []).length >= 2 && !/\d,\d{3}\b/.test(line.replace(/"[^"]*"/g, '')) || /^"/.test(line);
    let toks = delimited ? splitCells(line).filter((t) => t !== '') : line.split(/\s{2,}|\t|\s(?=[$£€₹]?\(?-?\d)/).flatMap((x) => x.split(/\s+/)).filter(Boolean);
    if (!delimited) toks = line.split(/\s+/);
    let date = '';
    if (toks.length) { const d = toIso(toks[0], order); if (d) { date = d; toks.shift(); } else if (toks.length > 2) { const d3 = toIso(toks.slice(0, 3).join(' '), order); if (d3) { date = d3; toks = toks.slice(3); } } }
    const nums: number[] = [];
    while (toks.length > 1 && nums.length < 3 && !isNaN(toNum(toks[toks.length - 1]))) nums.unshift(toNum(toks.pop()!));
    if (!nums.length) continue;
    let code = '';
    if (toks.length > 1 && CODE.test(toks[0]) && !/^\d{1,3}$/.test(toks[0])) code = toks.shift()!;
    const desc = toks.join(' ').trim();
    if (!desc && !code) continue;
    let qty: number | null = null, unit: number | null = null;
    const amount = nums[nums.length - 1];
    if (nums.length === 3) { qty = nums[0]; unit = nums[1]; }
    else if (nums.length === 2) { qty = nums[0]; }
    out.push({ date, code, desc, qty, unit, amount });
  }
  return out;
}

export interface Flag { kind: 'duplicate' | 'math' | 'total' | 'dates' | 'unsure' | 'round'; rows: number[]; text: string }
export interface CheckOpts { admit?: string; discharge?: string; printedTotal?: number | null; money?: (n: number) => string }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const dayDiff = (a: string, b: string) => Math.abs(Date.parse(a + 'T00:00:00Z') - Date.parse(b + 'T00:00:00Z')) / 864e5;
const label = (l: BillLine) => (l.desc || l.code) + (l.date ? ` (${l.date})` : '');
const MISC = /\b(misc|miscellaneous|sundry|sundries|other charges?|general charges?|supplies|adjustment)\b/i;

/** Run the checks. Each flag is a question to ask the billing office, never a ruling. */
export function checkBill(lines: BillLine[], o: CheckOpts = {}): Flag[] {
  const money = o.money ?? ((n: number) => n.toFixed(2));
  const flags: Flag[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    if (seen.has(i)) continue;
    const a = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      if (seen.has(j)) continue;
      const b = lines[j];
      const same = (a.code && a.code === b.code) || (norm(a.desc) && norm(a.desc) === norm(b.desc));
      if (!same) continue;
      if (a.date === b.date && Math.abs(a.amount - b.amount) < 0.005) {
        seen.add(j);
        flags.push({ kind: 'duplicate', rows: [i, j], text: `"${label(a)}" for ${money(a.amount)} appears twice with the same date and amount. Is it two separate services?` });
      } else if (a.date === b.date) {
        flags.push({ kind: 'duplicate', rows: [i, j], text: `"${label(a)}" appears twice on the same date with different amounts (${money(a.amount)} and ${money(b.amount)}). Can you explain the difference?` });
      } else if (a.date && b.date && Math.abs(a.amount - b.amount) < 0.005 && dayDiff(a.date, b.date) <= 3) {
        seen.add(j);
        flags.push({ kind: 'duplicate', rows: [i, j], text: `"${a.desc || a.code}" for ${money(a.amount)} appears on ${a.date} and again on ${b.date}. Is it two separate services?` });
      }
    }
  }
  lines.forEach((l, i) => {
    if (l.qty != null && l.unit != null && Math.abs(l.qty * l.unit - l.amount) > 0.015)
      flags.push({ kind: 'math', rows: [i], text: `"${label(l)}": ${l.qty} x ${money(l.unit)} is ${money(round2(l.qty * l.unit))}, but the amount shown is ${money(l.amount)}. Can you explain how it was worked out?` });
  });
  if (o.admit || o.discharge) lines.forEach((l, i) => {
    if (!l.date) return;
    if ((o.discharge && l.date > o.discharge) || (o.admit && l.date < o.admit))
      flags.push({ kind: 'dates', rows: [i], text: `"${label(l)}" is dated outside the stay (${o.admit || '...'} to ${o.discharge || '...'}). Is the date right, or was this before or after the stay?` });
  });
  lines.forEach((l, i) => { if (l.notRecv) flags.push({ kind: 'unsure', rows: [i], text: `I do not recall receiving "${label(l)}" (${money(l.amount)}). Can you tell me what it was for and who provided it?` }); });
  lines.forEach((l, i) => {
    if (l.notRecv) return;
    if (MISC.test(l.desc) || (l.amount >= 100 && l.amount % 100 === 0 && !(l.qty != null && l.unit != null)))
      flags.push({ kind: 'round', rows: [i], text: `"${label(l)}" for ${money(l.amount)} is a general or round-number line. What does it cover?` });
  });
  if (o.printedTotal != null && !isNaN(o.printedTotal)) {
    const sum = round2(lines.reduce((s, l) => s + l.amount, 0));
    if (Math.abs(sum - o.printedTotal) > 0.015)
      flags.push({ kind: 'total', rows: [], text: `The lines add up to ${money(sum)}, but the total printed on the bill is ${money(o.printedTotal)} (a difference of ${money(round2(Math.abs(sum - o.printedTotal)))}). Can you explain the difference?` });
  }
  return flags;
}

export function billLetter(flags: Flag[], f: { name?: string; ref?: string; provider?: string; today?: string }): string {
  const q = flags.map((x, i) => `${i + 1}. ${x.text}`).join('\n');
  return [
    f.today || '[date]', '',
    `To the billing office${f.provider ? ' of ' + f.provider : ''},`, '',
    `I am writing about my bill${f.ref ? ' (reference ' + f.ref + ')' : ''}. I would like to understand a few items, and I would be grateful if you could send me a fully itemised bill and an explanation of the following:`, '',
    q || '(no questions listed yet)', '',
    'Please also let me know whether any of these lines will change, and what the corrected total would be. I would like to hear from you before I make a payment, and I would be glad to talk about a payment plan once I understand the bill.', '',
    'Thank you for your help.', '', f.name || '[your name]',
  ].join('\n');
}

// ---------- Medical expense tax ----------
export interface Expense { date: string; person: string; what: string; amount: number; reimbursed: number }
export const net = (e: Expense) => round2(Math.max(0, e.amount - e.reimbursed));

/** Parse a CSV of expenses: date, person, what, amount, reimbursed (header row optional, columns found by name when present). */
export function parseExpenses(text: string, order: DateOrder = 'dmy'): Expense[] {
  const rows = text.split(/\r?\n/).filter((r) => r.trim()).map(splitCells);
  if (!rows.length) return [];
  let idx = { date: 0, person: 1, what: 2, amount: 3, reimbursed: 4 };
  const h = rows[0].map((c) => c.toLowerCase());
  if (h.some((c) => /date|amount|person|what/.test(c)) && isNaN(toNum(rows[0][3] ?? ''))) {
    const find = (re: RegExp, d: number) => { const i = h.findIndex((c) => re.test(c)); return i >= 0 ? i : d; };
    idx = { date: find(/date/, 0), person: find(/person|patient|name/, 1), what: find(/what|desc|item|expense/, 2), amount: find(/^amount|cost|paid|total/, 3), reimbursed: find(/reimb|insur|covered|refund/, 4) };
    rows.shift();
  }
  const out: Expense[] = [];
  for (const r of rows) {
    const date = toIso(r[idx.date] ?? '', order), amount = toNum(r[idx.amount] ?? '');
    if (!date || isNaN(amount)) continue;
    const rb = toNum(r[idx.reimbursed] ?? '');
    out.push({ date, person: r[idx.person] ?? '', what: r[idx.what] ?? '', amount, reimbursed: isNaN(rb) ? 0 : rb });
  }
  return out;
}

const addMonths = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z'); const day = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d.toISOString().slice(0, 10);
};
const dayBefore = (iso: string) => new Date(Date.parse(iso + 'T00:00:00Z') - 864e5).toISOString().slice(0, 10);

export interface Window { start: string; end: string; total: number; count: number }
const dayAfter = (iso: string) => new Date(Date.parse(iso + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10);
/** Canada: best 12-month period that ends in the tax year. Any 12 months ending in the year may be used. */
export function bestWindow(list: Expense[], taxYear: number): Window {
  const yEnd = `${taxYear}-12-31`, yStart = `${taxYear}-01-01`;
  const ends = new Set<string>([yEnd]); // candidate end dates: year end, 12 months after each expense, each expense date
  for (const e of list) {
    const end1 = dayBefore(addMonths(e.date, 12));
    if (end1 >= yStart && end1 <= yEnd) ends.add(end1);
    if (e.date >= yStart && e.date <= yEnd) ends.add(e.date);
  }
  let best: Window | null = null;
  for (const end of [...ends].sort()) {
    const start = dayAfter(addMonths(end, -12));
    let total = 0, count = 0;
    for (const e of list) if (e.date >= start && e.date <= end) { total += net(e); count++; }
    total = round2(total);
    if (!best || total > best.total) best = { start, end, total, count };
  }
  return best!;
}

export interface CaRates { creditRate: number; threshold: number }
/** Federal medical expense tax credit: claim = costs minus the lesser of 3% of net income or the fixed threshold; credit = claim x rate. */
export function canadaMetc(costs: number, netIncome: number, r: CaRates) {
  const reduce = round2(Math.min(0.03 * netIncome, r.threshold));
  const claim = round2(Math.max(0, costs - reduce));
  return { reduce, claim, credit: round2(claim * r.creditRate) };
}
/** USA: itemised deduction = costs minus 7.5% of AGI (never below zero). */
export function usDeduction(costs: number, agi: number, pct = 0.075) {
  const floor = round2(agi * pct);
  return { floor, deduction: round2(Math.max(0, costs - floor)) };
}
/** India 80DDB: costs minus insurance reimbursement, capped at the limit. */
export function indiaDdb(costs: number, reimbursed: number, senior: boolean, lim = { normal: 40000, senior: 100000 }) {
  const limit = senior ? lim.senior : lim.normal;
  const after = round2(Math.max(0, costs - reimbursed));
  return { limit, after, deduction: Math.min(limit, after), capped: after > limit };
}

// ---------- Claim packet ----------
export interface Receipt { date: string; provider: string; patient: string; service: string; paid: number; claimed: number }
export function claimTotals(rs: Receipt[]) {
  const by = new Map<string, { patient: string; service: string; paid: number; claimed: number; n: number }>();
  for (const r of rs) {
    const k = (r.patient || '(no patient)') + '|' + (r.service || '(no service)');
    const g = by.get(k) ?? { patient: r.patient || '(no patient)', service: r.service || '(no service)', paid: 0, claimed: 0, n: 0 };
    g.paid = round2(g.paid + r.paid); g.claimed = round2(g.claimed + r.claimed); g.n++; by.set(k, g);
  }
  const paid = round2(rs.reduce((s, r) => s + r.paid, 0)), claimed = round2(rs.reduce((s, r) => s + r.claimed, 0));
  const dates = rs.map((r) => r.date).filter(Boolean).sort();
  return { groups: [...by.values()].sort((a, b) => a.patient.localeCompare(b.patient) || a.service.localeCompare(b.service)), paid, claimed, toClaim: round2(paid - claimed), from: dates[0] ?? '', to: dates[dates.length - 1] ?? '' };
}

export const CURRENCIES: Record<string, { sym: string; locale: string }> = {
  CAD: { sym: 'CA$', locale: 'en-CA' }, USD: { sym: '$', locale: 'en-US' }, INR: { sym: '₹', locale: 'en-IN' }, GBP: { sym: '£', locale: 'en-GB' }, AED: { sym: 'AED ', locale: 'en-AE' },
};
export function moneyFmt(code: string) {
  const c = CURRENCIES[code] ?? CURRENCIES.CAD;
  return (n: number) => c.sym + n.toLocaleString(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
