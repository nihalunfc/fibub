// Shared by the KPI dashboard and the revenue dashboard: daily rows in, periods, comparisons and small SVG charts out.
// Plain TypeScript with no DOM, so tests/tools/kpi-dashboard.mjs can check it against hand-worked numbers.
import { addDays, parseDate, parseTable, toNum, dowOf, pad } from './common.ts';

export type Row = { d: string; site: string; ch: string; cap: number; sold: number; rev: number; tot: number | null; profit: number | null; canc: number };
export type Sum = { cap: number; sold: number; rev: number; tot: number; profit: number; hasTot: boolean; hasProfit: boolean; canc: number; days: number };

const KEYS: [string, RegExp][] = [
  ['d', /^(date|day|business ?date)/i], ['site', /^(site|location|branch|store|shop|property|hotel|outlet|restaurant|clinic)/i],
  ['ch', /^(channel|source|segment)/i], ['cap', /(available|capacity|places|seats|rooms|slots|units ?avail)/i],
  ['canc', /(cancel)/i], ['tot', /^(total ?rev|total ?sales|all ?rev)/i], ['profit', /(profit|gop|margin ?amount|contribution)/i],
  ['rev', /(revenue|sales|income|takings|value)/i], ['sold', /(sold|booked|used|covers|bookings|orders|units|nights|appointments|transactions)/i],
];
export type Imp = { rows: Row[]; notes: string[]; error?: string };

/** Reads pasted or opened rows. `order` says which columns to expect when there is no heading row. */
export function importRows(text: string, order: string[], defCap = 0): Imp {
  const t = parseTable(text), notes: string[] = [];
  if (t.length < 2) return { rows: [], notes, error: 'Paste at least two rows: a date and some numbers on each.' };
  let map: Record<string, number> = {}, start = 0;
  if (parseDate(t[0][0]) == null && t[0].some((c) => /[a-z]/i.test(c))) {
    start = 1;
    t[0].forEach((h, i) => { for (const [k, re] of KEYS) if (re.test(h.trim()) && map[k] == null && !Object.values(map).includes(i)) { map[k] = i; break; } });
    if (map.d == null) return { rows: [], notes, error: 'No date column found. Name the first column "date".' };
    if (map.sold == null || map.rev == null) return { rows: [], notes, error: 'Needs a column for the number sold and one for revenue. Headings are matched by name, for example "sold" and "revenue".' };
    notes.push('Columns read from your headings.');
  } else { order.forEach((k, i) => (map[k] = i)); notes.push('No heading row, so columns were read in this order: ' + order.join(', ') + '.'); }
  const rows: Row[] = []; let bad = 0, neg = 0, dup = 0; const seen = new Set<string>();
  for (const r of t.slice(start)) {
    const d = parseDate(r[map.d]); const sold = toNum(r[map.sold]), rev = toNum(r[map.rev]);
    if (!d || sold === '' || rev === '') { bad++; continue; }
    if (sold < 0 || rev < 0) { neg++; continue; }
    const site = (map.site != null ? String(r[map.site] ?? '').trim() : '') || 'All', ch = (map.ch != null ? String(r[map.ch] ?? '').trim() : '') || 'All';
    const key = d + '|' + site + '|' + ch; if (seen.has(key)) { dup++; continue; } seen.add(key);
    const cap = map.cap != null ? toNum(r[map.cap]) : '';
    const tot = map.tot != null ? toNum(r[map.tot]) : '', pr = map.profit != null ? toNum(r[map.profit]) : '', canc = map.canc != null ? toNum(r[map.canc]) : '';
    rows.push({ d, site, ch, cap: cap === '' ? defCap : cap, sold, rev, tot: tot === '' ? null : tot, profit: pr === '' ? null : pr, canc: canc === '' ? 0 : canc });
  }
  if (bad) notes.push(`${bad} row${bad > 1 ? 's' : ''} skipped: no readable date, sold or revenue.`);
  if (neg) notes.push(`${neg} row${neg > 1 ? 's' : ''} skipped: negative numbers.`);
  if (dup) notes.push(`${dup} repeated date${dup > 1 ? 's' : ''} for the same site and channel skipped (the first one is kept).`);
  if (rows.length < 7) return { rows: [], notes, error: 'Fewer than 7 usable rows. Check the columns and dates.' };
  if (rows.some((r) => !(r.cap > 0))) notes.push('Some rows have no places available, so use and revenue per place are left out for them.');
  rows.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
  return { rows, notes };
}

export const sumRows = (rows: Row[], from: string, to: string, site = ''): Sum => {
  const s: Sum = { cap: 0, sold: 0, rev: 0, tot: 0, profit: 0, hasTot: false, hasProfit: false, canc: 0, days: 0 }; const days = new Set<string>();
  for (const r of rows) {
    if (r.d < from || r.d > to || (site && r.site !== site)) continue;
    s.cap += r.cap; s.sold += r.sold; s.rev += r.rev; s.canc += r.canc; days.add(r.d);
    if (r.tot != null) { s.tot += r.tot; s.hasTot = true; } else s.tot += r.rev;
    if (r.profit != null) { s.profit += r.profit; s.hasProfit = true; }
  }
  s.days = days.size; return s;
};
export const use = (s: Sum) => (s.cap > 0 ? s.sold / s.cap : NaN);
export const price = (s: Sum) => (s.sold > 0 ? s.rev / s.sold : NaN);
export const perPlace = (s: Sum) => (s.cap > 0 ? s.rev / s.cap : NaN);
/** Percent change, or NaN when the earlier number is zero or missing. */
export const change = (now: number, before: number) => (Number.isFinite(now) && Number.isFinite(before) && before !== 0 ? now / before - 1 : NaN);

export const shiftYear = (s: string, n: number) => { const d = new Date(s + 'T12:00:00'); const day = d.getDate(); d.setDate(1); d.setFullYear(d.getFullYear() + n); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const PERIODS: Record<string, string> = { d7: 'Last 7 days', d28: 'Last 28 days', d90: 'Last 90 days', mtd: 'Month to date', ytd: 'Year to date', ltm: 'Last 12 months' };
export type Range = [string, string];
/** Current, previous and same-time-last-year ranges, counted back from the latest date in the data. */
export function ranges(end: string, p: string): { cur: Range; prev: Range; ly: Range } {
  let a: string;
  if (p === 'mtd') a = end.slice(0, 7) + '-01'; else if (p === 'ytd') a = end.slice(0, 4) + '-01-01';
  else if (p === 'ltm') a = addDays(shiftYear(end, -1), 1); else a = addDays(end, -(({ d7: 7, d28: 28, d90: 90 } as Record<string, number>)[p] - 1));
  const cur: Range = [a, end], ly: Range = [shiftYear(a, -1), shiftYear(end, -1)];
  let prev: Range;
  if (p === 'mtd') { const pm = addDays(a, -1); const pa = pm.slice(0, 7) + '-01'; const dim = new Date(+pm.slice(0, 4), +pm.slice(5, 7), 0).getDate(); prev = [pa, pm.slice(0, 7) + '-' + pad(Math.min(+end.slice(8), dim))]; }
  else if (p === 'ytd' || p === 'ltm') prev = ly;
  else { const n = Math.round((new Date(end + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 864e5) + 1; prev = [addDays(a, -n), addDays(a, -1)]; }
  return { cur, prev, ly };
}
export const monthKey = (d: string) => d.slice(0, 7);
export function monthly(rows: Row[], site = '') {
  const m = new Map<string, Sum>();
  for (const r of rows) { if (site && r.site !== site) continue; const k = monthKey(r.d); const s = m.get(k) || { cap: 0, sold: 0, rev: 0, tot: 0, profit: 0, hasTot: false, hasProfit: false, canc: 0, days: 0 }; s.cap += r.cap; s.sold += r.sold; s.rev += r.rev; s.tot += r.tot ?? r.rev; s.canc += r.canc; m.set(k, s); }
  return [...m.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

/** A short, plain-language note on what changed. */
export function note(unit: string, labels: { use: string; price: string }, cur: Sum, prev: Sum, ly: Sum, fmt: (v: number) => string): string {
  const out: string[] = [], pc = change(cur.rev, prev.rev), pl = change(cur.rev, ly.rev);
  if (Number.isFinite(pc)) out.push(`Revenue is ${fmt(Math.abs(cur.rev - prev.rev))} (${Math.abs(pc * 100).toFixed(1)}%) ${pc >= 0 ? 'up' : 'down'} on the previous period.`);
  if (Number.isFinite(pc)) {
    const du = use(cur) - use(prev), dp = change(price(cur), price(prev));
    if (Number.isFinite(du) && Number.isFinite(dp)) {
      const useBig = Math.abs(du) * 100 >= Math.abs(dp) * 100;
      out.push(useBig ? `The main reason is ${labels.use.toLowerCase()}: ${(Math.abs(du) * 100).toFixed(1)} points ${du >= 0 ? 'higher' : 'lower'}.` : `The main reason is the ${labels.price.toLowerCase()}: ${Math.abs(dp * 100).toFixed(1)}% ${dp >= 0 ? 'higher' : 'lower'}.`);
    }
  }
  if (Number.isFinite(pl)) out.push(`Against the same time last year it is ${Math.abs(pl * 100).toFixed(1)}% ${pl >= 0 ? 'ahead' : 'behind'}.`);
  return out.join(' ');
}

// ----- sample data (made up) -----
export function rng(seed: number) { let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
const WK = [0.88, 0.8, 0.82, 0.88, 1.0, 1.18, 1.14]; // Sunday first
export type SiteDef = { name: string; cap: number; base: number; price: number };
/** Two years of made-up daily rows ending at `end`, for each site. Channels split each site's sales when `channels` is given. */
export function sampleRows(end: string, sites: SiteDef[], channels?: { name: string; share: number; priceMul: number; canc: number }[], seed = 7): Row[] {
  const rnd = rng(seed), out: Row[] = [], total = 731;
  for (let i = 0; i < total; i++) {
    const d = addDays(end, i - (total - 1)), m = +d.slice(5, 7), yr = i / 365;
    const season = 1 + 0.16 * Math.sin(((m - 4) / 12) * Math.PI * 2) + (m === 12 ? 0.08 : 0);
    for (const s of sites) {
      const dem = s.base * season * WK[dowOf(d)] * (1 + 0.04 * yr) * (0.93 + rnd() * 0.14);
      const sold = Math.round(Math.min(s.cap, dem)), unit = s.price * (0.92 + 0.12 * (sold / s.cap)) * (1 + 0.03 * yr);
      if (!channels) { out.push({ d, site: s.name, ch: 'All', cap: s.cap, sold, rev: Math.round(sold * unit), tot: Math.round(sold * unit * 1.28), profit: Math.round(sold * unit * (0.30 + 0.08 * (sold / s.cap))), canc: 0 }); continue; }
      let left = sold;
      channels.forEach((c, j) => {
        const n = j === channels.length - 1 ? left : Math.round(sold * c.share * (0.9 + rnd() * 0.2)); const k = Math.max(0, Math.min(left, n)); left -= k;
        out.push({ d, site: s.name, ch: c.name, cap: s.cap, sold: k, rev: Math.round(k * unit * c.priceMul), tot: null, profit: null, canc: Math.round(k * c.canc * (0.7 + rnd() * 0.6)) });
      });
    }
  }
  return out;
}

// ----- small SVG charts, drawn with the page's colour variables -----
export type Series = { name: string; v: (number | null)[]; color: string; dash?: boolean };
const nice = (mx: number) => { if (!(mx > 0)) return 1; const e = Math.pow(10, Math.floor(Math.log10(mx))), f = mx / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * e; };
export function lineSvg(series: Series[], labels: string[], fmt: (v: number) => string, W = 700, H = 220): string {
  const L = 52, R = 10, T = 10, B = 24, N = labels.length; if (N < 2) return '';
  const all = series.flatMap((s) => s.v).filter((v): v is number => v != null && Number.isFinite(v)); const mx = nice(Math.max(...all, 0) * 1.02), mn = 0;
  const x = (i: number) => L + (i / (N - 1)) * (W - L - R), y = (v: number) => T + (1 - (v - mn) / (mx - mn)) * (H - T - B);
  let s = '';
  for (let k = 0; k <= 4; k++) { const v = mn + ((mx - mn) * k) / 4; s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`; }
  [0, Math.floor((N - 1) / 3), Math.floor(((N - 1) * 2) / 3), N - 1].forEach((i) => (s += `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === N - 1 ? 'end' : 'middle'}">${labels[i]}</text>`));
  for (const se of series) {
    let p = '', pen = false; se.v.forEach((v, i) => { if (v == null || !Number.isFinite(v)) { pen = false; return; } p += (pen ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); pen = true; });
    s += `<path d="${p}" fill="none" stroke="${se.color}" stroke-width="2" ${se.dash ? 'stroke-dasharray="5 4"' : ''}/>`;
  }
  return s;
}
export function barSvg(vals: number[], labels: string[], fmt: (v: number) => string, W = 700, H = 200, color = 'var(--accent)'): string {
  const L = 52, R = 10, T = 10, B = 24, N = vals.length; if (!N) return '';
  const mx = nice(Math.max(...vals, 0) * 1.02), bw = (W - L - R) / N, y = (v: number) => T + (1 - v / mx) * (H - T - B);
  let s = ''; for (let k = 0; k <= 4; k++) { const v = (mx * k) / 4; s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`; }
  const every = Math.ceil(N / 10);
  vals.forEach((v, i) => { s += `<rect x="${(L + i * bw + bw * 0.15).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(bw * 0.7).toFixed(1)}" height="${Math.max(0, H - B - y(v)).toFixed(1)}" fill="${color}" rx="2"/>`; if (i % every === 0) s += `<text x="${(L + i * bw + bw / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${labels[i]}</text>`; });
  return s;
}
