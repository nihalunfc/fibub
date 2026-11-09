// Weather station data: read a table of time-stamped records (temperature, humidity, pressure, wind speed and
// direction, rain), find the recording interval and the gaps, sum it up by day and month, and bin the wind into a
// wind rose. Times are used as written in the file (no time-zone change); a day is a calendar day in that time.
// Checked against pandas (resample by day and month, gaps from diff) and the windrose package (16-sector binning).
import type { Painter } from './plot.ts';

export type Var = 'T' | 'RH' | 'P' | 'WS' | 'WD' | 'R';
export const VARS: Var[] = ['T', 'RH', 'P', 'WS', 'WD', 'R'];
export const VAR_NAMES: Record<Var, string> = { T: 'Temperature', RH: 'Humidity', P: 'Pressure', WS: 'Wind speed', WD: 'Wind direction', R: 'Rain' };
export type Rec = { t: number } & Partial<Record<Var, number>>;
/** Column numbers (−1 = none). With a separate date column, `time` is the time of day; otherwise it holds date and time. */
export type Mapping = { time: number; date: number; clock: number } & Record<Var, number>;
export type DateOrder = 'ymd' | 'dmy' | 'mdy';

const DAY = 86400000;
const pad = (n: number, w = 2) => String(n).padStart(w, '0');
/** "2026-03-04 05:06" from a time in ms (the file's own clock). */
export const fmtTime = (t: number) => { const d = new Date(t); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}${d.getUTCSeconds() ? ':' + pad(d.getUTCSeconds()) : ''}`; };
export const fmtDay = (t: number) => fmtTime(t).slice(0, 10);
export const fmtMonth = (t: number) => fmtTime(t).slice(0, 7);
/** A duration in plain words: "10 min", "1 h", "2 days 3 h". */
export function fmtDur(ms: number) {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), mm = m % 60;
  if (h < 48) return mm ? `${h} h ${mm} min` : `${h} h`;
  const d = Math.floor(h / 24), hh = h % 24;
  return hh ? `${d} days ${hh} h` : `${d} days`;
}

/**
 * A date and time as written, to ms on the file's own clock (read as if it were UTC), or null. Takes ISO dates
 * (2026-03-04, 2026-03-04T05:06:07, with any Z or offset ignored), slashed or dotted dates in the given order
 * (04/03/2026, 3.4.2026), optional AM/PM, and an optional separate time of day.
 */
export function parseTime(s: string, order: DateOrder = 'ymd', clock?: string): number | null {
  let str = (s ?? '').trim().replace(/^"|"$/g, '');
  if (clock != null && clock.trim()) str += ' ' + clock.trim();
  if (!str) return null;
  const m = str.match(/^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})(?:[ T]+(\d{1,2})(?::(\d{2}))?(?::(\d{2})(?:\.\d+)?)?\s*([AaPp][Mm])?)?\s*(?:Z|[+-]\d{2}:?\d{2})?$/);
  if (!m) return null;
  let y: number, mo: number, d: number;
  const a = +m[1], b = +m[2], c = +m[3];
  if (m[1].length === 4) { y = a; mo = b; d = c; }
  else if (order === 'mdy') { mo = a; d = b; y = c; }
  else if (order === 'dmy') { d = a; mo = b; y = c; }
  else return null; // a year-first order needs a four-digit year first
  if (m[3].length === 2 && m[1].length !== 4) y += y < 70 ? 2000 : 1900;
  let h = m[4] ? +m[4] : 0;
  const mi = m[5] ? +m[5] : 0, se = m[6] ? +m[6] : 0;
  if (m[7]) { const pm = /p/i.test(m[7]); if (h < 1 || h > 12) return null; h = (h % 12) + (pm ? 12 : 0); }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 24 || mi > 59 || se > 59) return null;
  const t = Date.UTC(y, mo - 1, d, h, mi, se);
  if (new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d) return null;
  return t;
}

const PATTERNS: [keyof Mapping, RegExp][] = [
  ['WD', /\b(wind ?dir|wdir|wd|dir|direction|wind direction|winddir|dd)\b/i],
  ['WS', /\b(wind ?speed|wspd|ws|wind|speed|windspeed|ff|wind_speed|wind spd)\b/i],
  ['RH', /\b(rh|humidity|relative humidity|hum|rel\.? ?hum)\b/i],
  ['P', /\b(pressure|press|baro|barometer|slp|mslp|qfe|qnh|stn ?press|p)\b/i],
  ['R', /\b(rain|precip|precipitation|prcp|rainfall|rr|ppt)\b/i],
  ['T', /\b(temp|temperature|air ?temp|tair|t|ta|tmp|air temperature)\b/i],
];
/** Guess which column holds what from the header names; -1 where nothing fits. */
export function guessColumns(headers: string[]): Mapping {
  const h = headers.map((x) => x.toLowerCase().replace(/[_()[\]°%]/g, ' ').replace(/\s+/g, ' ').trim());
  const out: Mapping = { time: -1, date: -1, clock: -1, T: -1, RH: -1, P: -1, WS: -1, WD: -1, R: -1 };
  const used = new Set<number>();
  const find = (re: RegExp) => h.findIndex((x, i) => !used.has(i) && re.test(x));
  const take = (k: keyof Mapping, re: RegExp) => { const i = find(re); if (i >= 0) { out[k] = i; used.add(i); } };
  take('time', /\b(date ?time|datetime|timestamp|time stamp|obs ?time|valid)\b/i);
  if (out.time < 0) {
    // A date column and a separate time-of-day column: time holds the clock, date the day.
    take('date', /\b(date|day)\b/i); take('clock', /\b(time|hour|clock)\b/i);
    if (out.clock >= 0) { out.time = out.clock; out.clock = -1; } else if (out.date >= 0) { out.time = out.date; out.date = -1; }
  }
  // Gusts and dew points are not the mean wind or the air temperature.
  for (const [k, re] of PATTERNS) { const i = h.findIndex((x, j) => !used.has(j) && re.test(x) && !/gust|max|min|dew|chill|index|feels|soil|inside|indoor/.test(x)); if (i >= 0) { out[k] = i; used.add(i); } }
  return out;
}

export type RainMode = 'amount' | 'total';
export type Loaded = { recs: Rec[]; badTime: number; dupes: number; unordered: boolean; rows: number; firstBad: string; resets: number };
/** Records from table rows (without the header), sorted by time; later duplicates of a time are dropped. */
export function loadRecords(rows: string[][], map: Mapping, toNum: (s: string) => number, order: DateOrder = 'ymd', rain: RainMode = 'amount'): Loaded {
  const raw: Rec[] = [];
  let badTime = 0, firstBad = '';
  for (const r of rows) {
    const t = map.date >= 0 ? parseTime(r[map.date] ?? '', order, r[map.time] ?? '') : parseTime(r[map.time] ?? '', order);
    if (t == null) { badTime++; if (!firstBad) firstBad = map.date >= 0 ? `${r[map.date] ?? ''} ${r[map.time] ?? ''}` : r[map.time] ?? ''; continue; }
    const rec: Rec = { t };
    for (const v of VARS) if (map[v] >= 0) { const x = toNum(r[map[v]] ?? ''); if (Number.isFinite(x)) rec[v] = x; }
    raw.push(rec);
  }
  let unordered = false;
  for (let i = 1; i < raw.length; i++) if (raw[i].t < raw[i - 1].t) { unordered = true; break; }
  const sorted = unordered ? raw.map((r, i) => [r, i] as const).sort((a, b) => a[0].t - b[0].t || a[1] - b[1]).map((x) => x[0]) : raw;
  const recs: Rec[] = []; let dupes = 0;
  for (const r of sorted) { if (recs.length && recs[recs.length - 1].t === r.t) { dupes++; continue; } recs.push(r); }
  // A running rain total becomes amounts per record; a drop means the counter was reset, so the new value is new rain.
  let resets = 0;
  if (rain === 'total') {
    let prev: number | null = null;
    for (const r of recs) {
      if (r.R == null) continue;
      const cur = r.R;
      if (prev == null) r.R = 0; else if (cur >= prev) r.R = cur - prev; else { r.R = cur; resets++; }
      prev = cur;
    }
  }
  // Wind direction: 360 is north; anything outside 0 to 360 is dropped.
  for (const r of recs) if (r.WD != null) { if (r.WD < 0 || r.WD > 360) delete r.WD; else if (r.WD === 360) r.WD = 0; }
  return { recs, badTime, dupes, unordered, rows: rows.length, firstBad, resets };
}

/** The usual time step: the most common difference between neighbouring records (the smaller one on a tie). */
export function interval(recs: Rec[]) {
  const c = new Map<number, number>();
  for (let i = 1; i < recs.length; i++) { const d = recs[i].t - recs[i - 1].t; c.set(d, (c.get(d) ?? 0) + 1); }
  let best = 0, n = -1;
  for (const [d, k] of c) if (k > n || (k === n && d < best)) { best = d; n = k; }
  return best;
}

export type Gap = { from: number; to: number; missing: number };
/** Gaps: neighbouring records more than 1.5 steps apart. `missing` is the number of whole steps left out. */
export function gaps(recs: Rec[], step: number): Gap[] {
  const out: Gap[] = [];
  if (!(step > 0)) return out;
  for (let i = 1; i < recs.length; i++) {
    const d = recs[i].t - recs[i - 1].t;
    if (d > 1.5 * step) out.push({ from: recs[i - 1].t, to: recs[i].t, missing: Math.round(d / step) - 1 });
  }
  return out;
}

export type Stat = { n: number; min: number; mean: number; max: number; sum: number };
const stat = (xs: number[]): Stat | null => {
  if (!xs.length) return null;
  let mn = Infinity, mx = -Infinity, s = 0;
  for (const x of xs) { if (x < mn) mn = x; if (x > mx) mx = x; s += x; }
  return { n: xs.length, min: mn, mean: s / xs.length, max: mx, sum: s };
};
/** Vector-mean wind direction (degrees, 0 = north) of the records with both speed and direction; null if calm or none. */
export function vectorDir(recs: Rec[]) {
  let u = 0, v = 0, n = 0;
  for (const r of recs) if (r.WD != null && r.WS != null) { const a = (r.WD * Math.PI) / 180; u += r.WS * Math.sin(a); v += r.WS * Math.cos(a); n++; }
  if (!n || Math.hypot(u, v) < 1e-9) return null;
  return ((Math.atan2(u, v) * 180) / Math.PI + 360) % 360;
}

export type Summary = { key: string; start: number; n: number; complete: number | null } & Partial<Record<Var, Stat | null>> & { dir: number | null };
/** Summaries by calendar day or month: count, completeness against the usual step, and min/mean/max/sum per variable. */
export function summarise(recs: Rec[], by: 'day' | 'month', step: number): Summary[] {
  const groups = new Map<string, Rec[]>();
  for (const r of recs) { const k = by === 'day' ? fmtDay(r.t) : fmtMonth(r.t); let g = groups.get(k); if (!g) { g = []; groups.set(k, g); } g.push(r); }
  const out: Summary[] = [];
  for (const [key, g] of groups) {
    const start = Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, by === 'day' ? +key.slice(8, 10) : 1);
    const len = by === 'day' ? DAY : Date.UTC(+key.slice(0, 4), +key.slice(5, 7), 1) - start;
    const s: Summary = { key, start, n: g.length, complete: step > 0 ? Math.min(1, (g.length * step) / len) : null, dir: vectorDir(g) };
    for (const v of VARS) if (v !== 'WD') s[v] = stat(g.map((r) => r[v]).filter((x): x is number => x != null));
    out.push(s);
  }
  return out;
}

export type Rose = { sectors: number; edges: number[]; counts: number[][]; calm: number; total: number; noDir: number; noSpeed: number };
/**
 * Wind rose: records with speed below `calm` are calms (no direction); the rest go into `sectors` direction bins
 * centred on north (for 16: N is 348.75 to 11.25°, a boundary belongs to the sector clockwise of it) and speed classes
 * [edges[i], edges[i+1]) with the last class open. Records with a speed but no direction are left out and counted.
 */
export function windRose(recs: Rec[], edges: number[], calm: number, sectors = 16): Rose {
  const w = 360 / sectors, counts = Array.from({ length: sectors }, () => edges.map(() => 0));
  let nCalm = 0, total = 0, noDir = 0, noSpeed = 0;
  for (const r of recs) {
    if (r.WS == null) { if (r.WD != null) noSpeed++; continue; }
    if (r.WS < calm) { nCalm++; total++; continue; }
    if (r.WD == null) { noDir++; continue; }
    const s = Math.floor((((r.WD + w / 2) % 360) + 360) % 360 / w) % sectors;
    let c = edges.length - 1; while (c > 0 && r.WS < edges[c]) c--;
    counts[s][c]++; total++;
  }
  return { sectors, edges, counts, calm: nCalm, total, noDir, noSpeed };
}
export const SECTOR16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export const sectorName = (i: number, n: number) => (n === 16 ? SECTOR16[i] : n === 8 ? SECTOR16[i * 2] : n === 4 ? SECTOR16[i * 4] : `${Math.round((i * 360) / n)}°`);

/** Made-up example data: hourly records with a daily cycle, passing weather systems, showers, one gap and a few blanks. */
export function example(days = 61, startIso = '2026-03-01'): string {
  let s = 20260301;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const t0 = Date.parse(startIso + 'T00:00:00Z'), lines = ['Time,Temperature (°C),Humidity (%),Pressure (hPa),Wind speed (m/s),Wind direction (°),Rain (mm)'];
  for (let h = 0; h < days * 24; h++) {
    const t = t0 + h * 3600000, day = h / 24, hod = h % 24;
    if (day >= 20 && day < 21.5) continue; // a logger outage
    const front = Math.sin((2 * Math.PI * day) / 6.5), season = day * 0.12;
    const T = 6 + season + 5 * Math.sin((2 * Math.PI * (hod - 9)) / 24) - 2.5 * front + (rnd() - 0.5) * 1.6;
    const RH = Math.max(25, Math.min(100, 72 - 14 * Math.sin((2 * Math.PI * (hod - 9)) / 24) + 12 * front + (rnd() - 0.5) * 8));
    const P = 1012 - 9 * front + (rnd() - 0.5) * 0.8;
    const calm = rnd() < 0.06;
    const WS = calm ? +(rnd() * 0.4).toFixed(1) : Math.max(0.5, 3.2 + 2.5 * front + 1.5 * Math.sin((2 * Math.PI * (hod - 10)) / 24) + (rnd() - 0.3) * 3);
    const WD = ((front > 0 ? 225 : 300) + (rnd() - 0.5) * 120 + 360) % 360;
    const R = front > 0.5 && rnd() < 0.35 ? +(rnd() * 3).toFixed(1) : 0;
    const blank = rnd() < 0.004;
    lines.push([fmtTime(t), blank ? '' : T.toFixed(1), RH.toFixed(0), P.toFixed(1), WS.toFixed(1), calm ? '0' : WD.toFixed(0), R.toFixed(1)].join(','));
  }
  return lines.join('\n');
}

/** Label of speed class i, such as "2–4" or "≥ 8". */
export const classLabel = (edges: number[], i: number) => (i === edges.length - 1 ? `≥ ${edges[i]}` : `${edges[i]}–${edges[i + 1]}`);

/** Percent of all used records (calms included) in each sector and class. */
export const rosePct = (r: Rose) => r.counts.map((c) => c.map((n) => (r.total ? (100 * n) / r.total : 0)));

/**
 * Draws the wind rose with any painter: wedges stacked by speed class from the centre outwards, rings in percent of
 * all used records, the calm percentage in the middle and a legend below.
 */
export function drawRose(Pt: Painter, r: Rose, w: number, h: number, c: { ink: string; muted: string; grid: string; bg: string; colors: string[]; unit: string; calm: number }) {
  const legendH = 22 * Math.ceil((r.edges.length + 1) / 3) + 8;
  const cx = w / 2, cy = (h - legendH) / 2 + 4, R = Math.min(w, h - legendH) / 2 - 26, hole = 16;
  if (c.bg) Pt.poly([[0, 0], [w, 0], [w, h], [0, h]], c.bg, null);
  const pct = rosePct(r), tot = pct.map((s) => s.reduce((a, b) => a + b, 0));
  const max = Math.max(...tot, 1e-9);
  const ringStep = [1, 2, 2.5, 5, 10, 20, 25, 50].find((s) => max / s <= 5) ?? 50;
  const top = Math.ceil(max / ringStep - 1e-9) * ringStep;
  const rad = (p: number) => hole + ((R - hole) * p) / top;
  const pt = (a: number, rr: number): [number, number] => [cx + rr * Math.sin((a * Math.PI) / 180), cy - rr * Math.cos((a * Math.PI) / 180)];
  const circle = (rr: number) => Array.from({ length: 73 }, (_, i) => pt(i * 5, rr));
  for (let p = ringStep; p <= top + 1e-9; p += ringStep) Pt.line(circle(rad(p)), c.grid, 0.8);
  for (let i = 0; i < 8; i++) Pt.line([pt(i * 45, hole), pt(i * 45, R)], c.grid, 0.8);
  const sw = 360 / r.sectors, half = (sw / 2) * 0.88;
  r.counts.forEach((_, s) => {
    let acc = 0;
    pct[s].forEach((p, k) => {
      if (p <= 0) return;
      const r0 = rad(acc), r1 = rad(acc + p), a0 = s * sw - half, a1 = s * sw + half, pts: [number, number][] = [];
      for (let j = 0; j <= 8; j++) pts.push(pt(a0 + ((a1 - a0) * j) / 8, r1));
      for (let j = 8; j >= 0; j--) pts.push(pt(a0 + ((a1 - a0) * j) / 8, r0));
      Pt.poly(pts, c.colors[k % c.colors.length], c.bg || null, 0.5);
      acc += p;
    });
  });
  Pt.line(circle(hole), c.muted, 1);
  const calmPct = r.total ? (100 * r.calm) / r.total : 0;
  Pt.text(cx, cy, `${calmPct.toFixed(calmPct < 10 ? 1 : 0)}%`, 10, c.ink, 'middle', 'middle', 0, true);
  for (let p = ringStep; p <= top + 1e-9; p += ringStep) { const [x, y] = pt(67.5, rad(p)); Pt.text(x + 2, y, `${p}%`, 10, c.muted, 'start', 'bottom'); }
  ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].forEach((lab, i) => { const [x, y] = pt(i * 45, R + 13); Pt.text(x, y, lab, 12, c.ink, 'middle', 'middle', 0, lab.length === 1); });
  // Legend.
  const items = [...r.edges.map((_, i) => ({ col: c.colors[i % c.colors.length], lab: `${classLabel(r.edges, i)} ${c.unit}` })), { col: '', lab: `Calm < ${c.calm} ${c.unit}` }];
  const colW = w / 3;
  items.forEach((it, i) => {
    const x = 10 + (i % 3) * colW, y = h - legendH + 6 + Math.floor(i / 3) * 22;
    if (it.col) Pt.poly([[x, y + 2], [x + 12, y + 2], [x + 12, y + 14], [x, y + 14]], it.col, null);
    else Pt.circle(x + 6, y + 8, 6, null, c.muted, 1);
    Pt.text(x + 17, y + 8, it.lab, 11, c.ink, 'start', 'middle');
  });
}
