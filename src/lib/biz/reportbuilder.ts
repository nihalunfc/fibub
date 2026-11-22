// Report builder maths: read any table with a date column, find the numbers and the groups, add them up
// for a period and write plain notes. No DOM here; the page draws it (src/tools/report-builder).
import { parseDate, parseTable, pad, addDays, dayDiff, DOW } from './common.ts';
import { ranges, PERIODS } from './dash.ts';
import type { Figure } from '../report.ts';

export type Col = { i: number; name: string; kind: 'date' | 'number' | 'text'; distinct: number; sample: string };
export type Profile = { head: string[]; body: string[][]; cols: Col[]; dmy: boolean; error?: string };

/** A typed number: 1,234.50 or (12.00) or $5 or 12%. Returns null when the cell is not a number. */
export function num(v: unknown): number | null {
  let s = String(v ?? '').trim();
  if (!s) return null;
  let neg = false;
  if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
  s = s.replace(/^[-−]/, () => { neg = !neg; return ''; }).replace(/[$£€₹¥%\s]|[A-Z]{3}$|^[A-Z]{3}/g, '').replace(/,(?=\d{3}(\D|$))/g, '');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(s)) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? (neg ? -n : n) : null;
}

const NAMEISH = /(^|[\s_-])(id|no|number|code|ref|reference|invoice|phone|zip|postcode|year)($|[\s_-])/i;

/** Guess which column is a date, which are numbers and which are labels. */
export function profile(text: string, dmyChoice: 'auto' | 'dmy' | 'mdy' = 'auto'): Profile {
  const t = parseTable(text);
  if (t.length < 3) return { head: [], body: [], cols: [], dmy: false, error: 'Needs a heading row and at least two rows of data.' };
  const head = t[0].map((h, i) => h.trim() || `Column ${i + 1}`);
  const body = t.slice(1).map((r) => head.map((_, i) => String(r[i] ?? '').trim()));
  // Day-first or month-first: look for a part above 12.
  let dmy = dmyChoice === 'dmy';
  if (dmyChoice === 'auto') {
    let a = 0, b = 0;
    for (const r of body.slice(0, 500)) for (const c of r) { const m = c.match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{2,4}/); if (m) { if (+m[1] > 12) a++; if (+m[2] > 12) b++; } }
    dmy = a > b;
  }
  const sampleRows = body.slice(0, 800);
  const cols: Col[] = head.map((name, i) => {
    const vals = sampleRows.map((r) => r[i]).filter((v) => v !== '');
    const n = Math.max(1, vals.length);
    const dates = vals.filter((v) => parseDate(v, dmy) != null).length;
    const nums = vals.filter((v) => num(v) != null).length;
    const plainInts = vals.every((v) => /^\d{4,}$/.test(v));
    const kind: Col['kind'] = dates / n >= 0.8 && !/^\d{5}$/.test(vals[0] ?? '') ? 'date' : nums / n >= 0.8 && !plainInts ? 'number' : 'text';
    return { i, name, kind, distinct: new Set(vals).size, sample: vals[0] ?? '' };
  });
  if (!cols.some((c) => c.kind === 'date')) {
    // Excel day numbers read as numbers; offer a number column that looks like a date serial.
    const c = cols.find((x) => body.slice(0, 50).every((r) => /^\d{5}(\.\d+)?$/.test(r[x.i] ?? '') && +r[x.i] > 40000 && +r[x.i] < 60000));
    if (c) c.kind = 'date';
  }
  return { head, body, cols, dmy };
}

const WANT = /revenue|sales|amount|cost|total|value|net|income|spend|hours|qty|quantity|units|sold|covers|count|loss/i;
const AVERAGEISH = /rate|%|percent|adr|price|average|avg|occupancy|score|temperature|temp/i;
const GROUPISH = /dept|department|category|type|site|property|location|vendor|supplier|product|region|channel|branch|team|name|source|status|centre|center|class|group|hotel|store|shop/i;

export type Setup = { date: number; measure: number; group: number; agg: 'sum' | 'avg'; period: string; dmy: boolean };

/** Starting choices: first date column, the most "money-like" number, and a tidy grouping column. */
export function defaults(p: Profile): Setup {
  const date = p.cols.find((c) => c.kind === 'date')?.i ?? -1;
  const nums = p.cols.filter((c) => c.kind === 'number' && !NAMEISH.test(c.name));
  const first = (re: RegExp) => nums.find((c) => re.test(c.name));
  const measure = (first(/revenue|sales|amount|income|spend|cost|total|value|net/i) ?? nums.find((c) => WANT.test(c.name)) ?? nums[nums.length - 1] ?? p.cols.find((c) => c.kind === 'number'))?.i ?? -1;
  const texts = p.cols.filter((c) => c.kind === 'text' && c.distinct >= 2 && c.distinct <= 40);
  const group = (texts.find((c) => GROUPISH.test(c.name) && !/name$/i.test(c.name) && !/employee|server|reported/i.test(c.name)) ?? texts.sort((a, b) => a.distinct - b.distinct)[0])?.i ?? -1;
  return { date, measure, group, agg: measure >= 0 && AVERAGEISH.test(p.head[measure]) ? 'avg' : 'sum', period: 'all', dmy: p.dmy };
}

export type Rec = { d: string; v: number; g: string };
export type Prepared = { recs: Rec[]; skipped: { noDate: number; noNumber: number }; min: string; max: string };

/** Turn rows into dated records for the chosen measure (measure -1 counts rows). */
export function prepare(p: Profile, s: Setup): Prepared {
  const recs: Rec[] = []; let noDate = 0, noNumber = 0;
  for (const r of p.body) {
    const d = s.date >= 0 ? parseDate(r[s.date], s.dmy) : null;
    if (!d) { noDate++; continue; }
    const v = s.measure >= 0 ? num(r[s.measure]) : 1;
    if (v == null) { noNumber++; continue; }
    recs.push({ d, v, g: s.group >= 0 ? (r[s.group] || '(blank)') : '' });
  }
  recs.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
  return { recs, skipped: { noDate, noNumber }, min: recs[0]?.d ?? '', max: recs[recs.length - 1]?.d ?? '' };
}

export type Agg = { total: number; n: number; value: number };
export const aggregate = (recs: Rec[], agg: 'sum' | 'avg', from = '', to = '9999', g?: string): Agg => {
  let t = 0, n = 0;
  for (const r of recs) if (r.d >= from && r.d <= to && (g == null || r.g === g)) { t += r.v; n++; }
  return { total: t, n, value: agg === 'avg' ? (n ? t / n : NaN) : t };
};

export const PERIOD_LIST: Record<string, string> = { all: 'All the data', ...PERIODS };

export type Bucket = { key: string; label: string; v: number };
const weekStart = (d: string) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`; };
const lastOfMonth = (k: string) => { const d = new Date(+k.slice(0, 4), +k.slice(5, 7), 0); return `${k}-${pad(d.getDate())}`; };
const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const niceDay = (d: string) => `${+d.slice(8)} ${SHORT[+d.slice(5, 7) - 1]}`;
export const niceDayY = (d: string) => `${niceDay(d)} ${d.slice(0, 4)}`;

/** Days, weeks or months, whichever keeps the chart readable. */
export function buckets(recs: Rec[], agg: 'sum' | 'avg', from: string, to: string): { unit: 'day' | 'week' | 'month'; list: Bucket[] } {
  const span = dayDiff(from, to) + 1;
  const unit = span <= 45 ? 'day' : span <= 200 ? 'week' : 'month';
  const m = new Map<string, { t: number; n: number }>();
  for (const r of recs) {
    if (r.d < from || r.d > to) continue;
    const k = unit === 'day' ? r.d : unit === 'week' ? weekStart(r.d) : r.d.slice(0, 7);
    const e = m.get(k) ?? { t: 0, n: 0 }; e.t += r.v; e.n++; m.set(k, e);
  }
  let entries = [...m.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  // Leave out part weeks and part months at the edges when enough whole ones remain, so they do not look like dips.
  if (unit !== 'day') {
    const whole = entries.filter(([k]) => (unit === 'week' ? k >= from && addDays(k, 6) <= to : k + '-01' >= from && lastOfMonth(k) <= to));
    if (whole.length >= 3) entries = whole;
  }
  const list = entries.map(([key, e]) => ({
    key, v: agg === 'avg' ? e.t / e.n : e.t,
    label: unit === 'month' ? `${SHORT[+key.slice(5, 7) - 1]} ${key.slice(2, 4)}` : niceDay(key),
  }));
  return { unit, list };
}

export type Group = { name: string; value: number; prev: number; share: number };
export function groups(recs: Rec[], agg: 'sum' | 'avg', cur: [string, string], prev: [string, string] | null): Group[] {
  const names = [...new Set(recs.filter((r) => r.d >= cur[0] && r.d <= cur[1]).map((r) => r.g))];
  const all = aggregate(recs, 'sum', cur[0], cur[1]).total;
  return names.map((name) => {
    const a = aggregate(recs, agg, cur[0], cur[1], name), b = prev ? aggregate(recs, agg, prev[0], prev[1], name) : null;
    return { name, value: a.value, prev: b && b.n ? b.value : NaN, share: agg === 'sum' && all ? a.total / all : NaN };
  }).sort((x, y) => y.value - x.value);
}

export const pct = (v: number, dp = 1) => (Number.isFinite(v) ? `${v >= 0 ? '+' : '-'}${Math.abs(v * 100).toFixed(dp)}%` : 'n/a');
export const chg = (a: number, b: number) => (Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b - 1 : NaN);

export type Built = {
  from: string; to: string; prev: [string, string] | null; label: string;
  cur: Agg; before: Agg | null; buckets: { unit: 'day' | 'week' | 'month'; list: Bucket[] };
  groups: Group[]; notes: string[];
};

/** Everything the report shows, for one chosen period. */
export function build(pr: Prepared, s: Setup, measureName: string, groupName: string, fmt: (v: number) => string): Built | null {
  if (!pr.recs.length) return null;
  let from = pr.min, to = pr.max, prev: [string, string] | null = null;
  if (s.period !== 'all') {
    const r = ranges(pr.max, s.period); from = r.cur[0] < pr.min ? pr.min : r.cur[0]; to = r.cur[1];
    prev = r.prev[1] >= pr.min ? r.prev : null;
  }
  const cur = aggregate(pr.recs, s.agg, from, to);
  if (!cur.n) return null;
  const before = prev ? aggregate(pr.recs, s.agg, prev[0], prev[1]) : null;
  const b = buckets(pr.recs, s.agg, from, to);
  const gs = s.group >= 0 ? groups(pr.recs, s.agg, [from, to], prev) : [];
  const word = s.agg === 'avg' ? `Average ${measureName.toLowerCase()}` : `Total ${measureName.toLowerCase()}`;
  const notes: string[] = [];
  notes.push(`${word} was ${fmt(cur.value)} across ${cur.n.toLocaleString('en')} rows from ${niceDayY(from)} to ${niceDayY(to)}.`);
  if (before && before.n) {
    const c = chg(cur.value, before.value);
    if (Number.isFinite(c)) notes.push(`That is ${pct(Math.abs(c)).slice(1)} ${c >= 0 ? 'up' : 'down'} on the previous ${PERIOD_LIST[s.period].toLowerCase().replace(/^last /, '')} (${niceDay(prev![0])} to ${niceDay(prev![1])}, ${fmt(before.value)}).`);
  } else if (s.period !== 'all') notes.push('There is not enough earlier data to compare with the previous period.');
  const L = b.list;
  if (L.length >= 3) {
    const hi = L.reduce((a, x) => (x.v > a.v ? x : a)), lo = L.reduce((a, x) => (x.v < a.v ? x : a));
    const u = b.unit, lab = (x: Bucket) => (u === 'week' ? 'the week of ' + x.label : x.label);
    notes.push(`The highest ${u} was ${lab(hi)} (${fmt(hi.v)}) and the lowest was ${lab(lo)} (${fmt(lo.v)}).`);
    const mean = L.reduce((a, x) => a + x.v, 0) / L.length, sd = Math.sqrt(L.reduce((a, x) => a + (x.v - mean) ** 2, 0) / L.length);
    const odd = sd > 0 ? L.filter((x) => Math.abs(x.v - mean) > 3 * sd) : [];
    if (odd.length) notes.push(`${odd.length === 1 ? 'One ' + (b.unit === 'month' ? 'month looks' : b.unit === 'week' ? 'week looks' : 'day looks') : odd.length + ' periods look'} unusual (${odd.slice(0, 3).map((x) => x.label).join(', ')}); check the data for mistakes before you rely on them.`);
    const half = Math.floor(L.length / 2), a1 = L.slice(0, half).reduce((a, x) => a + x.v, 0) / half, a2 = L.slice(-half).reduce((a, x) => a + x.v, 0) / half;
    const tr = chg(a2, a1);
    if (Number.isFinite(tr) && Math.abs(tr) >= 0.05) notes.push(`Across the period the trend is ${tr > 0 ? 'upward' : 'downward'}: the later half averages ${Math.abs(tr * 100).toFixed(0)}% ${tr > 0 ? 'more' : 'less'} per ${b.unit} than the earlier half.`);
  }
  if (b.unit === 'day' && L.length >= 14) {
    const dw = Array.from({ length: 7 }, () => ({ t: 0, n: 0 }));
    for (const x of L) { const k = new Date(x.key + 'T12:00:00').getDay(); dw[k].t += x.v; dw[k].n++; }
    const av = dw.map((x, i) => ({ d: DOW[i], v: x.n ? x.t / x.n : NaN })).filter((x) => Number.isFinite(x.v));
    if (av.length >= 5) { const hi = av.reduce((a, x) => (x.v > a.v ? x : a)), lo = av.reduce((a, x) => (x.v < a.v ? x : a)); notes.push(`By weekday, ${hi.d} is usually the strongest and ${lo.d} the weakest.`); }
  }
  if (gs.length >= 2) {
    if (s.agg === 'sum' && gs[0].share > 0) {
      const top3 = gs.slice(0, 3).reduce((a, x) => a + x.share, 0);
      notes.push(`${gs[0].name} is the biggest ${groupName.toLowerCase()} at ${(gs[0].share * 100).toFixed(0)}% of the total${gs.length > 3 ? `; the top three make up ${(top3 * 100).toFixed(0)}%` : ''}.`);
    } else notes.push(`${gs[0].name} has the highest ${groupName.toLowerCase()} figure (${fmt(gs[0].value)}) and ${gs[gs.length - 1].name} the lowest (${fmt(gs[gs.length - 1].value)}).`);
    const mv = gs.filter((x) => Number.isFinite(x.prev)).map((x) => ({ n: x.name, d: x.value - x.prev })).sort((a, c) => Math.abs(c.d) - Math.abs(a.d))[0];
    if (mv && mv.d !== 0) notes.push(`The biggest mover against the previous period is ${mv.n}, ${mv.d > 0 ? 'up' : 'down'} ${fmt(Math.abs(mv.d))}.`);
  }
  const { noDate, noNumber } = pr.skipped;
  if (noDate || noNumber) notes.push(`${noDate + noNumber} row${noDate + noNumber === 1 ? ' was' : 's were'} left out: ${[noDate ? `${noDate} without a readable date` : '', noNumber ? `${noNumber} without a number in ${measureName}` : ''].filter(Boolean).join(' and ')}.`);
  return { from, to, prev, label: PERIOD_LIST[s.period], cur, before, buckets: b, groups: gs, notes };
}

/** All the number columns at a glance (total, average, smallest, largest) for the period. */
export function overview(p: Profile, s: Setup, from: string, to: string, fmt: (v: number) => string): string[][] {
  const out: string[][] = [];
  for (const c of p.cols.filter((x) => x.kind === 'number' && !NAMEISH.test(x.name)).slice(0, 8)) {
    let t = 0, n = 0, lo = Infinity, hi = -Infinity;
    for (const r of p.body) { const d = s.date >= 0 ? parseDate(r[s.date], s.dmy) : null; if (!d || d < from || d > to) continue; const v = num(r[c.i]); if (v == null) continue; t += v; n++; lo = Math.min(lo, v); hi = Math.max(hi, v); }
    if (n) out.push([c.name, fmt(t), fmt(t / n), fmt(lo), fmt(hi)]);
  }
  return out;
}

/** A neat number: 1,234 or 12.5 or 1.2M. */
export function fmtNum(v: number, prefix = ''): string {
  if (!Number.isFinite(v)) return 'n/a';
  const a = Math.abs(v), sign = v < 0 ? '-' : '';
  const s = a >= 1e7 ? (a / 1e6).toFixed(1) + 'M' : a >= 1000 ? Math.round(a).toLocaleString('en') : a >= 100 ? a.toFixed(1).replace(/\.0$/, '') : a.toFixed(2).replace(/\.?0+$/, '');
  return sign + prefix + s;
}
const compact = (v: number, prefix: string) => { const a = Math.abs(v); const s = a >= 1e6 ? +(a / 1e6).toFixed(1) + 'M' : a >= 1e3 ? +(a / 1e3).toFixed(1) + 'k' : String(+a.toFixed(a < 10 ? 2 : 0)); return (v < 0 ? '-' : '') + prefix + s; };

// ---------- figures for report.ts (drawn on the page and in the downloads) ----------
type Ctx = CanvasRenderingContext2D;
const font = (ctx: Ctx, px: number, w = 400) => { ctx.font = `${w} ${px}px system-ui, -apple-system, "Segoe UI", sans-serif`; };

export function lineFigure(list: Bucket[], prefix: string, title: string): Figure {
  const W = 640, H = 240;
  return {
    w: W, h: H, alt: title,
    draw(ctx, w, h, pal) {
      const L = 54, R = 12, T = 14, B = 30, iw = w - L - R, ih = h - T - B;
      const vs = list.map((x) => x.v), lo = Math.min(0, ...vs), hi = Math.max(...vs, lo + 1e-9);
      const step = (hi - lo) / 4;
      font(ctx, 11); ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const y = T + ih - (i / 4) * ih;
        ctx.fillStyle = pal.grid; ctx.fillRect(L, y, iw, 1);
        ctx.fillStyle = pal.muted; ctx.fillText(compact(lo + step * i, prefix), L - 6, y);
      }
      const x = (i: number) => L + (list.length === 1 ? iw / 2 : (i / (list.length - 1)) * iw), y = (v: number) => T + ih - ((v - lo) / (hi - lo)) * ih;
      ctx.strokeStyle = pal.accent; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
      list.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p.v)) : ctx.moveTo(x(i), y(p.v)))); ctx.stroke();
      if (list.length <= 40) { ctx.fillStyle = pal.accent; list.forEach((p, i) => { ctx.beginPath(); ctx.arc(x(i), y(p.v), 2.5, 0, 7); ctx.fill(); }); }
      ctx.fillStyle = pal.muted; ctx.textBaseline = 'top';
      const n = Math.min(6, list.length);
      for (let k = 0; k < n; k++) { const i = n === 1 ? 0 : Math.round((k / (n - 1)) * (list.length - 1)); ctx.textAlign = k === 0 ? 'left' : k === n - 1 ? 'right' : 'center'; ctx.fillText(list[i].label, x(i), h - B + 8); }
    },
  };
}

export function barFigure(items: { name: string; value: number }[], prefix: string, title: string): Figure {
  const rows = items.slice(0, 10), W = 640, H = 28 + rows.length * 26;
  return {
    w: W, h: H, alt: title,
    draw(ctx, w, h, pal) {
      const L = 150, R = 80, T = 8, rh = 26, iw = w - L - R, hi = Math.max(...rows.map((r) => r.value), 1e-9);
      rows.forEach((r, i) => {
        const y = T + i * rh, bw = Math.max(1, (Math.max(r.value, 0) / hi) * iw);
        font(ctx, 12); ctx.textBaseline = 'middle'; ctx.textAlign = 'right'; ctx.fillStyle = pal.ink;
        let name = r.name; while (name.length > 3 && ctx.measureText(name).width > L - 10) name = name.slice(0, -2);
        ctx.fillText(name === r.name ? name : name.trimEnd() + '…', L - 8, y + rh / 2);
        ctx.fillStyle = pal.accent; ctx.fillRect(L, y + 4, bw, rh - 9);
        ctx.fillStyle = pal.muted; ctx.textAlign = 'left'; ctx.fillText(compact(r.value, prefix), L + bw + 6, y + rh / 2);
      });
    },
  };
}

/** Tiny made-up example so the tool shows a report before any file is opened. */
export function sampleCsv(kind: 'sales' | 'costs'): string {
  let seed = kind === 'sales' ? 11 : 29;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const end = '2026-10-31', rows: string[] = [];
  if (kind === 'sales') {
    rows.push('Date,Branch,Product line,Units,Sales');
    const lines: [string, number][] = [['Hot drinks', 4.1], ['Cold drinks', 3.4], ['Bakery', 5.2], ['Lunch', 11.5]], br: [string, number][] = [['Harbour', 1.25], ['Station', 1], ['Market', 0.8]];
    for (let i = 119; i >= 0; i--) {
      const d = addDays(end, -i), dow = new Date(d + 'T12:00:00').getDay(), wk = dow === 0 || dow === 6 ? 1.35 : 1, tr = 1 + (119 - i) / 600;
      for (const [b, bm] of br) for (const [l, price] of lines) { const u = Math.round((38 + rnd() * 24) * bm * wk * tr * (l === 'Lunch' ? 0.8 : 1)); rows.push(`${d},${b},${l},${u},${(u * price).toFixed(2)}`); }
    }
  } else {
    rows.push('Invoice date,Supplier,Category,Amount');
    const sup: [string, string, number][] = [['Fresh Farms Ltd', 'Food', 900], ['Northern Dairy', 'Food', 520], ['CleanCo Supplies', 'Cleaning', 240], ['City Power', 'Utilities', 610], ['Print and Pack', 'Packaging', 180]];
    for (let i = 89; i >= 0; i -= 1) { const d = addDays(end, -i); if (new Date(d + 'T12:00:00').getDay() === 0) continue; for (const [s, c, base] of sup) if (rnd() < 0.55) rows.push(`${d},${s},${c},${(base * (0.6 + rnd() * 0.8)).toFixed(2)}`); }
  }
  return rows.join('\n');
}
