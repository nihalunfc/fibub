// Daily demand forecast from your own history: a weekday pattern, a seasonal base (same time last year when there are
// 14 months of history, otherwise a smoothed recent level), a growth trend, special days, and a range taken from
// how wrong the method would have been on your own past (rolling back-tests). Bookings already on the books are blended in.
import { addDays, dowOf, iso, pad, parseDate, parseTable, toNum } from './common.ts';

// ---------- special days (busy days or the night before a holiday) ----------
export type Region = 'none' | 'ca' | 'us' | 'uk';
export const REGIONS: Record<Region, string> = { none: 'None', ca: 'Canada (Ontario)', us: 'United States', uk: 'United Kingdom' };
export function easter(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${pad(mo)}-${pad(da)}`;
}
const nthDow = (y: number, mo: number, dow: number, n: number) => { const d = new Date(y, mo - 1, 1, 12); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return iso(d); };
const lastDow = (y: number, mo: number, dow: number) => { const d = new Date(y, mo, 0, 12); while (d.getDay() !== dow) d.setDate(d.getDate() - 1); return iso(d); };
const victoria = (y: number) => { const d = new Date(y, 4, 24, 12); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return iso(d); }; // Monday before 25 May
/** Dates to treat as special in a year: the evening before a holiday Monday, and fixed or Easter holidays themselves.
 *  Statutory rules as widely published (Ontario Employment Standards, US federal holidays, UK bank holidays); check the official source. */
export function specialDays(y: number, region: Region): Set<string> {
  const s = new Set<string>();
  if (region === 'ca') {
    [nthDow(y, 2, 1, 3), victoria(y), nthDow(y, 8, 1, 1), nthDow(y, 9, 1, 1), nthDow(y, 10, 1, 2)].forEach((d) => s.add(addDays(d, -1)));
    s.add(easter(y)); s.add(`${y}-06-30`); s.add(`${y}-12-31`);
  } else if (region === 'us') {
    [nthDow(y, 1, 1, 3), nthDow(y, 2, 1, 3), lastDow(y, 5, 1), nthDow(y, 9, 1, 1), nthDow(y, 10, 1, 2)].forEach((d) => s.add(addDays(d, -1)));
    s.add(`${y}-07-03`); s.add(nthDow(y, 11, 4, 4)); s.add(`${y}-12-31`);
  } else if (region === 'uk') {
    [nthDow(y, 5, 1, 1), lastDow(y, 5, 1), lastDow(y, 8, 1)].forEach((d) => s.add(addDays(d, -1)));
    s.add(easter(y)); s.add(`${y}-12-23`); s.add(`${y}-12-31`);
  }
  return s;
}
export type Specials = (d: string) => boolean;
/** Builds the "is this a special day" test from a region and your own extra dates (YYYY-MM-DD). */
export function specials(region: Region, extra: string[] = []): Specials {
  const cache: Record<number, Set<string>> = {}, mine = new Set(extra);
  return (d) => mine.has(d) || (region !== 'none' && (cache[+d.slice(0, 4)] ??= specialDays(+d.slice(0, 4), region)).has(d));
}

// ---------- the method ----------
export function ma7(y: number[]) {
  const n = y.length, m = new Array<number>(n);
  for (let t = 0; t < n; t++) { let s = 0, c = 0; for (let k = t - 3; k <= t + 3; k++) if (k >= 0 && k < n) { s += y[k]; c++; } m[t] = s / c; }
  return m;
}
export function holt(series: number[], a: number, b: number, phi: number) {
  let L = series[0], T = 0;
  for (let i = 1; i < series.length; i++) { const pL = L; L = a * series[i] + (1 - a) * (L + phi * T); T = b * (L - pL) + (1 - b) * phi * T; }
  return { L, T, at: (h: number) => { let s = 0, p = 1; for (let i = 1; i <= h; i++) { p *= phi; s += p; } return L + T * s; } };
}
export function fitForecast(d: string[], y: number[], H: number, isSpecial: Specials) {
  const n = y.length, m = ma7(y);
  const from = Math.max(0, n - 364), sum = Array(7).fill(0), cnt = Array(7).fill(0);
  for (let t = from; t < n; t++) { if (isSpecial(d[t])) continue; if (m[t] > 0) { const w = dowOf(d[t]); sum[w] += y[t] / m[t]; cnt[w]++; } }
  let idx: number[] = sum.map((s, i) => (cnt[i] ? s / cnt[i] : 1)); const mean = idx.reduce((a, b) => a + b, 0) / 7; idx = idx.map((v) => v / mean);
  let hol = 1, holN = 0, s = 0;
  for (let t = 0; t < n; t++) if (isSpecial(d[t]) && m[t] > 0) { s += y[t] / (m[t] * idx[dowOf(d[t])]); holN++; }
  if (holN) hol = Math.max(1, Math.min(1.6, s / holN));
  const yearly = n >= 420;
  let growth: ReturnType<typeof holt> | null = null, levelFn: (h: number) => number;
  if (yearly) {
    const r: number[] = []; for (let t = Math.max(364, n - 182); t < n; t++) if (m[t - 364] > 0) r.push(m[t] / m[t - 364]);
    growth = holt(r.length ? r : [1], 0.15, 0.05, 0.95);
    levelFn = (h) => m[n - 1 + h - 364] * Math.max(0.5, Math.min(2, growth!.at(h)));
  } else {
    const lv = holt(m.slice(Math.max(0, n - 182)), 0.2, 0.05, 0.98);
    levelFn = (h) => Math.max(0, lv.at(h));
  }
  const out: { date: string; f: number }[] = [];
  for (let h = 1; h <= H; h++) { const date = addDays(d[n - 1], h); out.push({ date, f: Math.max(0, levelFn(h) * idx[dowOf(date)] * (isSpecial(date) ? hol : 1)) }); }
  return { out, idx, hol, holN, yearly, growth: growth ? growth.L : null, trend: growth ? growth.T : null };
}
export function quantile(arr: number[], q: number) { if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b), p = (s.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p); return s[lo] + (s[hi] - s[lo]) * (p - lo); }
export const BUCKETS = [[1, 14], [15, 30], [31, 60], [61, 90]] as const;
export type HistRow = [string, number, number, number | null]; // date, sold, capacity, revenue

export type ForecastIn = { rows: HistRow[]; capacity: number; horizon: number; s30: number; isSpecial: Specials; otb: Record<string, number | ''> };
export function analyse(x: ForecastIn) {
  const { rows, otb: otbIn } = x, d = rows.map((r) => r[0]), y = rows.map((r) => r[1]), n = rows.length;
  const capOf = (i: number) => rows[i][2] || x.capacity;
  const H = x.horizon, fit = fitForecast(d, y, H, x.isSpecial);
  const errs: number[][] = BUCKETS.map(() => []), allErr: number[] = [];
  let bt: null | { pts: { date: string; f: number; a: number }[]; mape: number; mae: number; bias: number; within: number } = null;
  for (let o = 0; o < 8; o++) {
    const k = n - 56 - 28 * o; if (k < 56) break;
    const h = Math.min(90, n - k);
    const f = fitForecast(d.slice(0, k), y.slice(0, k), h, x.isSpecial).out;
    f.forEach((p, j) => { const a = y[k + j]; if (a > 0 && p.f > 0) { const e = Math.log(a / p.f); allErr.push(e); errs[BUCKETS.findIndex((b) => j + 1 <= b[1])].push(e); } });
    if (o === 0) {
      const pts = f.slice(0, 56).map((p, j) => ({ date: p.date, f: Math.min(capOf(k + j), p.f), a: y[k + j] }));
      const ok = pts.filter((p) => p.a > 0);
      bt = { pts, mape: ok.reduce((s, p) => s + Math.abs(p.a - p.f) / p.a, 0) / ok.length, mae: ok.reduce((s, p) => s + Math.abs(p.a - p.f), 0) / ok.length, bias: ok.reduce((s, p) => s + (p.f - p.a), 0) / ok.reduce((s, p) => s + p.a, 0), within: 0 };
    }
  }
  const band = BUCKETS.map((_, i) => {
    let e = errs[i];
    if (e.length < 20) { const prev = errs.slice(0, i + 1).flat(); e = prev.length >= 20 ? prev : allErr; }
    if (e.length < 20) return { lo: -0.15 - 0.06 * i, hi: 0.15 + 0.06 * i, fallback: true };
    return { lo: Math.min(-0.02, quantile(e, 0.1)), hi: Math.max(0.02, quantile(e, 0.9)), fallback: false };
  });
  for (let i = 1; i < band.length; i++) { band[i].lo = Math.min(band[i].lo, band[i - 1].lo); band[i].hi = Math.max(band[i].hi, band[i - 1].hi); }
  const futCap = x.capacity || rows[n - 1][2];
  const s30 = Math.max(0.05, Math.min(0.95, x.s30 / 100)), kk = 15;
  const share = (h: number) => 1 - ((1 - s30) * (1 - Math.exp(-h / kk))) / (1 - Math.exp(-30 / kk));
  const lyIdx: Record<string, number> = {}; d.forEach((v, i) => (lyIdx[v] = i));
  const fc = fit.out.map((p, j) => {
    const h = j + 1, b = band[BUCKETS.findIndex((B) => h <= B[1])];
    const model = Math.min(futCap, p.f);
    let lo = Math.min(futCap, p.f * Math.exp(b.lo)), hi = Math.min(futCap, p.f * Math.exp(b.hi));
    const raw = otbIn[p.date], otb = raw == null || raw === '' ? null : Math.max(0, Math.min(futCap, +raw));
    let fin = model, w = 0;
    if (otb != null) {
      w = share(j); const est = otb / w;
      fin = Math.min(futCap, Math.max(otb, w * est + (1 - w) * model));
      const r = model > 0 ? fin / model : 1; lo = Math.max(otb, Math.min(futCap, lo * r)); hi = Math.min(futCap, Math.max(fin, hi * r));
      if (lo > fin) lo = fin;
    }
    const li = lyIdx[addDays(p.date, -364)];
    return { date: p.date, model, lo, hi, otb, fin, w, cap: futCap, ly: li != null ? y[li] : null, lyCap: li != null ? capOf(li) : null, lyRev: li != null ? rows[li][3] : null };
  });
  if (bt) { const B = bt; B.within = B.pts.filter((p, j) => { const bd = band[BUCKETS.findIndex((q) => j + 1 <= q[1])]; return p.a >= p.f * Math.exp(bd.lo) && p.a <= p.f * Math.exp(bd.hi); }).length / B.pts.length; }
  return { rows, d, y, n, fit, bt, band, fc, hasRev: rows.some((r) => r[3] != null && (r[3] as number) > 0) };
}

// ---------- reading a history file ----------
export type Import = { rows: HistRow[]; notes: string[]; error?: string };
/** Reads rows of date, sold, (capacity), (revenue) from a pasted or opened table. Headings are found by name. */
export function importHistory(text: string, capacity: number): Import {
  const rows = parseTable(text);
  if (!rows.length) return { rows: [], notes: [], error: 'The data looks empty. Use two or more columns: a date and the number sold that day.' };
  const hasHead = !parseDate(rows[0][0]) && rows[0].some((c) => /[a-z]/i.test(c));
  let ix = { date: 0, sold: 1, cap: -1, rev: -1 };
  if (hasHead) {
    const h = rows.shift()!.map((c) => String(c).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
    const find = (re: RegExp, not?: RegExp) => h.findIndex((c) => re.test(c) && !(not && not.test(c)));
    ix = { date: find(/date|day|night|stay/), sold: find(/sold|booked|occupied|used|units|covers|sales|orders|appointments|visits|rooms|demand|quantity|count/, /rev|income|amount|capacity|available/), cap: find(/capacity|available|supply|seats|total/), rev: find(/rev|income|amount|takings/) };
    if (ix.date < 0) return { rows: [], notes: [], error: 'No date column found. Name the first column "date".' };
    if (ix.sold < 0) ix.sold = h.findIndex((_, i) => i !== ix.date && i !== ix.cap && i !== ix.rev);
    if (ix.sold < 0) return { rows: [], notes: [], error: 'No column for the number sold each day. Name it "sold".' };
  }
  const dmy = rows.some((r) => { const m = String(r[ix.date] || '').trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{2,4}/); return m && +m[1] > 12; });
  const byDate = new Map<string, HistRow>(); let skipped = 0, dups = 0;
  rows.forEach((r) => {
    const dt = parseDate(r[ix.date], dmy), sold = toNum(r[ix.sold]);
    if (!dt || sold === '' || sold < 0) { skipped++; return; }
    const cap = ix.cap >= 0 ? toNum(r[ix.cap]) : '', rev = ix.rev >= 0 ? toNum(r[ix.rev]) : '';
    if (byDate.has(dt)) dups++;
    byDate.set(dt, [dt, sold, cap === '' || cap <= 0 ? capacity : cap, rev === '' ? null : rev]);
  });
  const list = [...byDate.values()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const notes: string[] = [];
  if (skipped) notes.push(`${skipped} row${skipped > 1 ? 's' : ''} without a readable date or number were skipped.`);
  if (dups) notes.push(`${dups} repeated date${dups > 1 ? 's' : ''} (kept the last).`);
  if (list.length < 60) return { rows: [], notes, error: `Only ${list.length} usable days. The forecast needs at least 60 days of history (two years is best).` };
  // fill gaps by carrying the average of the day before and after, so the weekly pattern stays in step
  const filled: HistRow[] = []; let gaps = 0;
  for (let i = 0; i < list.length; i++) {
    filled.push(list[i]);
    const next = list[i + 1]; if (!next) break;
    let dt = addDays(list[i][0], 1);
    while (dt < next[0]) { filled.push([dt, Math.round((list[i][1] + next[1]) / 2), list[i][2], null]); gaps++; dt = addDays(dt, 1); if (gaps > 2000) break; }
  }
  if (gaps) notes.push(`${gaps} missing day${gaps > 1 ? 's were' : ' was'} filled with the average of the days either side.`);
  return { rows: filled, notes };
}

// ---------- a made-up history for the example ----------
function hashRng(str: string) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
/** Two years of invented daily sales for a seaside business: busy summers, weekend peaks, holiday weekends and everyday noise. */
export function sampleHistory(end: string, cap = 120, isSpecial: Specials = () => false): HistRow[] {
  const rows: HistRow[] = [];
  const mOcc = [0.42, 0.5, 0.52, 0.56, 0.68, 0.82, 0.93, 0.95, 0.78, 0.71, 0.6, 0.55];
  const dowF = [0.86, 0.78, 0.8, 0.85, 0.93, 1.16, 1.3];
  for (let i = 729; i >= 0; i--) {
    const d = addDays(end, -i), dt = new Date(d + 'T12:00:00'), R = hashRng('sample' + d);
    const doy = (dt.getTime() - new Date(dt.getFullYear(), 0, 1).getTime()) / 864e5, pos = doy / 30.44 - 0.5;
    const m0 = ((Math.floor(pos) % 12) + 12) % 12, m1 = (m0 + 1) % 12, fr = pos - Math.floor(pos), w = (1 - Math.cos(Math.PI * fr)) / 2;
    const season = mOcc[m0] * (1 - w) + mOcc[m1] * w;
    const growth = 1 + 0.035 * ((730 - i) / 365 - 1);
    const noise = 1 + ((R() + R() + R()) / 3 - 0.5) * 0.16;
    let occ = season * dowF[dt.getDay()] * growth * noise;
    if (isSpecial(d)) occ *= 1.28;
    if (d.slice(5) === '12-24' || d.slice(5) === '12-25') occ *= 0.7;
    const sold = Math.max(Math.round(cap * 0.07), Math.min(cap, Math.round(cap * occ)));
    const price = (22 + 24 * (season - 0.42) + (dt.getDay() >= 5 ? 6 : 0) + (sold > cap * 0.95 ? 4 : 0)) * growth * (0.97 + R() * 0.06);
    rows.push([d, sold, cap, Math.round(sold * price)]);
  }
  return rows;
}
