// A home weather observer's daily log: entries, monthly summaries, records, unit changes and CSV in and out.
// Written by fibub. No DOM and no storage here (the page keeps the log in the browser's localStorage).

export type Entry = {
  date: string;                 // YYYY-MM-DD
  tmax: number | null; tmin: number | null;
  rain: number | null; snow: number | null;
  wind: number | null; dir: string;        // speed; direction as a compass point, "Calm" or ""
  pres: number | null; cloud: number | null; // pressure; cloud cover in oktas 0 to 8
  notes: string;
};
export type Units = { t: 'C' | 'F'; r: 'mm' | 'in'; s: 'cm' | 'in'; w: 'km/h' | 'mph' | 'm/s' | 'kn'; p: 'hPa' | 'inHg' };
export const DEFAULT_UNITS: Units = { t: 'C', r: 'mm', s: 'cm', w: 'km/h', p: 'hPa' };
export const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
/** Convert one value between units (unchanged when the unit is the same). */
export function conv(kind: 't' | 'r' | 's' | 'w' | 'p', x: number, from: string, to: string): number {
  if (from === to) return x;
  if (kind === 't') return from === 'C' ? x * 1.8 + 32 : (x - 32) / 1.8;
  if (kind === 'r') return from === 'mm' ? x / 25.4 : x * 25.4;
  if (kind === 's') return from === 'cm' ? x / 2.54 : x * 2.54;
  if (kind === 'p') return from === 'hPa' ? x / 33.8638866667 : x * 33.8638866667;
  const ms: Record<string, number> = { 'km/h': 1 / 3.6, mph: 0.44704, 'm/s': 1, kn: 1852 / 3600 };
  return (x * ms[from]) / ms[to];
}
/** Decimal places kept for each kind in each unit. */
export const places = (kind: 't' | 'r' | 's' | 'w' | 'p', u: string) => (kind === 'p' ? (u === 'inHg' ? 2 : 1) : kind === 'r' ? (u === 'in' ? 2 : 1) : kind === 's' ? (u === 'in' ? 1 : 1) : kind === 'w' ? 1 : 1);
/** The whole log in other units, kept to 8 significant figures so that converting back gives the typed values. */
export function convertLog(log: Entry[], from: Units, to: Units): Entry[] {
  const c = (kind: keyof Units, x: number | null) => (x == null ? null : +conv(kind, x, from[kind], to[kind]).toPrecision(8));
  return log.map((e) => ({ ...e, tmax: c('t', e.tmax), tmin: c('t', e.tmin), rain: c('r', e.rain), snow: c('s', e.snow), wind: c('w', e.wind), pres: c('p', e.pres) }));
}

/** Check one entry; returns a problem in plain words, or ''. */
export function problem(e: Entry, u: Units): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date + 'T00:00:00Z')) || new Date(e.date + 'T00:00:00Z').toISOString().slice(0, 10) !== e.date) return 'Pick a real date.';
  if (e.tmax != null && e.tmin != null && e.tmin > e.tmax) return 'The minimum is above the maximum.';
  const tLim = u.t === 'C' ? [-90, 60] : [-130, 140];
  for (const t of [e.tmax, e.tmin]) if (t != null && (t < tLim[0] || t > tLim[1])) return `Temperatures must be between ${tLim[0]} and ${tLim[1]} °${u.t}.`;
  for (const [x, name] of [[e.rain, 'Rain'], [e.snow, 'Snow'], [e.wind, 'Wind speed']] as const) if (x != null && x < 0) return `${name} cannot be negative.`;
  if (e.pres != null) { const [lo, hi] = u.p === 'hPa' ? [850, 1090] : [25.1, 32.2]; if (e.pres < lo || e.pres > hi) return `Pressure must be between ${lo} and ${hi} ${u.p} (sea-level pressure).`; }
  if (e.cloud != null && !(Number.isInteger(e.cloud) && e.cloud >= 0 && e.cloud <= 8)) return 'Cloud cover is a whole number of oktas from 0 to 8.';
  if (e.dir && e.dir !== 'Calm' && !POINTS.includes(e.dir)) return 'Wind direction must be a compass point such as NE, or Calm.';
  return '';
}

/** Add or replace (same date) an entry; the log stays sorted by date. */
export function upsert(log: Entry[], e: Entry): { log: Entry[]; replaced: boolean } {
  const i = log.findIndex((x) => x.date === e.date), out = log.slice();
  if (i >= 0) out[i] = e; else out.push(e);
  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return { log: out, replaced: i >= 0 };
}

// ---- Summaries ------------------------------------------------------------------------------------------------
export type Stat = { n: number; mean: number | null; min: number | null; max: number | null; sum: number };
function stat(xs: (number | null)[]): Stat {
  const v = xs.filter((x): x is number => x != null);
  return { n: v.length, mean: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null, min: v.length ? Math.min(...v) : null, max: v.length ? Math.max(...v) : null, sum: v.reduce((a, b) => a + b, 0) };
}
export type MonthSum = {
  key: string; days: number; tmax: Stat; tmin: Stat; tmean: number | null; rain: Stat; rainDays: number; snow: Stat; snowDays: number;
  wind: Stat; pres: Stat; cloud: Stat; frost: number; dir: string;
};
/** One row per calendar month with any entry. rainDay: rain at or above this amount counts as a rain day. */
export function monthly(log: Entry[], u: Units, rainDay = 1): MonthSum[] {
  const by = new Map<string, Entry[]>();
  for (const e of log) { const k = e.date.slice(0, 7); (by.get(k) ?? by.set(k, []).get(k)!).push(e); }
  const freeze = u.t === 'C' ? 0 : 32;
  return [...by.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([key, es]) => {
    const both = es.filter((e) => e.tmax != null && e.tmin != null).map((e) => (e.tmax! + e.tmin!) / 2);
    const dirs = new Map<string, number>();
    for (const e of es) if (e.dir) dirs.set(e.dir, (dirs.get(e.dir) ?? 0) + 1);
    let dir = '', best = 0; for (const [d, n] of dirs) if (n > best) { best = n; dir = d; }
    return {
      key, days: es.length, tmax: stat(es.map((e) => e.tmax)), tmin: stat(es.map((e) => e.tmin)),
      tmean: both.length ? both.reduce((a, b) => a + b, 0) / both.length : null,
      rain: stat(es.map((e) => e.rain)), rainDays: es.filter((e) => e.rain != null && e.rain >= rainDay - 1e-9).length,
      snow: stat(es.map((e) => e.snow)), snowDays: es.filter((e) => e.snow != null && e.snow > 0).length,
      wind: stat(es.map((e) => e.wind)), pres: stat(es.map((e) => e.pres)), cloud: stat(es.map((e) => e.cloud)),
      frost: es.filter((e) => e.tmin != null && e.tmin < freeze).length, dir,
    };
  });
}

export type Rec = { label: string; value: number; dates: string[] };
/** Records over the log: the extreme value of each field and every date it happened. */
export function records(log: Entry[]): Rec[] {
  const pick = (label: string, f: (e: Entry) => number | null, hi: boolean): Rec | null => {
    let best: number | null = null, dates: string[] = [];
    for (const e of log) {
      const x = f(e); if (x == null) continue;
      if (best == null || (hi ? x > best : x < best)) { best = x; dates = [e.date]; } else if (x === best) dates.push(e.date);
    }
    return best == null ? null : { label, value: best, dates };
  };
  return [
    pick('Highest maximum', (e) => e.tmax, true), pick('Lowest maximum', (e) => e.tmax, false),
    pick('Highest minimum', (e) => e.tmin, true), pick('Lowest minimum', (e) => e.tmin, false),
    pick('Wettest day', (e) => (e.rain != null && e.rain > 0 ? e.rain : null), true), pick('Most snow in a day', (e) => (e.snow != null && e.snow > 0 ? e.snow : null), true),
    pick('Windiest day', (e) => e.wind, true), pick('Highest pressure', (e) => e.pres, true), pick('Lowest pressure', (e) => e.pres, false),
  ].filter((x): x is Rec => x != null);
}

// ---- CSV ------------------------------------------------------------------------------------------------------
export const CSV_HEAD = ['Date', 'Max temp', 'Min temp', 'Rain', 'Snow', 'Wind speed', 'Wind direction', 'Pressure', 'Cloud (oktas)', 'Notes'];
/** Match imported headers to fields by name; -1 when absent. */
export function guess(h: string[]): Record<keyof Entry, number> {
  const f = (re: RegExp, not?: RegExp) => h.findIndex((x) => re.test(x) && !(not && not.test(x)));
  return {
    date: f(/date|day/i), tmax: f(/max|high|tx\b/i), tmin: f(/min|low|tn\b/i), rain: f(/rain|precip|ppt/i), snow: f(/snow/i),
    wind: f(/wind|gust/i, /dir/i), dir: f(/dir/i), pres: f(/press|baro|mslp|hpa/i), cloud: f(/cloud|okta/i), notes: f(/note|remark|comment/i),
  };
}
/** Read rows (first row headers) into entries; reports how many were skipped and why. */
export function fromRows(rows: string[][], u: Units, num: (s: string) => number): { entries: Entry[]; skipped: { line: number; why: string }[] } {
  const g = guess(rows[0] ?? []), entries: Entry[] = [], skipped: { line: number; why: string }[] = [];
  if (g.date < 0) return { entries, skipped: [{ line: 1, why: 'No Date column.' }] };
  const n = (row: string[], i: number) => { if (i < 0) return null; const s = (row[i] ?? '').trim(); if (!s || s === '-' || s.toLowerCase() === 'na') return null; const x = s.toLowerCase() === 'tr' || s.toLowerCase() === 'trace' ? 0 : num(s); return Number.isFinite(x) ? x : NaN; };
  rows.slice(1).forEach((row, k) => {
    const date = normDate(row[g.date] ?? '');
    const e: Entry = { date, tmax: n(row, g.tmax), tmin: n(row, g.tmin), rain: n(row, g.rain), snow: n(row, g.snow), wind: n(row, g.wind), dir: normDir(g.dir >= 0 ? row[g.dir] ?? '' : ''), pres: n(row, g.pres), cloud: n(row, g.cloud), notes: g.notes >= 0 ? (row[g.notes] ?? '').trim() : '' };
    const bad = (['tmax', 'tmin', 'rain', 'snow', 'wind', 'pres', 'cloud'] as const).find((k2) => Number.isNaN(e[k2] as number));
    const why = bad ? `"${row[g[bad]]}" is not a number.` : problem(e, u);
    if (why) skipped.push({ line: k + 2, why }); else entries.push(e);
  });
  return { entries, skipped };
}
function normDate(s: string): string {
  const t = s.trim(), m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : t;
}
function normDir(s: string): string {
  const t = s.trim().toUpperCase();
  if (!t) return '';
  if (t === 'CALM' || t === 'C') return 'Calm';
  const deg = Number(t);
  if (t !== '' && Number.isFinite(deg)) return POINTS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
  return POINTS.includes(t) ? t : s.trim();
}
export function toRows(log: Entry[]): (string | number)[][] {
  const v = (x: number | null) => (x == null ? '' : x);
  return [CSV_HEAD, ...log.map((e) => [e.date, v(e.tmax), v(e.tmin), v(e.rain), v(e.snow), v(e.wind), e.dir, v(e.pres), v(e.cloud), e.notes])];
}

// ---- Made-up example ------------------------------------------------------------------------------------------
/** Made-up three months (August to October 2026) in °C, mm, cm, km/h, hPa. Not real observations. */
export function example(): Entry[] {
  let s = 2026;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const out: Entry[] = [];
  const d0 = Date.UTC(2026, 7, 1), days = 92;
  let p = 1015, carry = 0;
  for (let i = 0; i < days; i++) {
    const date = new Date(d0 + i * 86400000).toISOString().slice(0, 10);
    if (i === 40 || i === 41) continue; // two days away: not logged
    const season = 22 - 19 * (i / days);
    carry = 0.6 * carry + 4 * (rnd() - 0.5);
    p = Math.max(975, Math.min(1040, p + 6 * (rnd() - 0.5) + (1015 - p) * 0.1));
    const wet = rnd() < 0.35 + (1015 - p) / 60;
    const tmax = r(season + 5 + carry - (wet ? 2 : 0), 1), tmin = r(Math.min(tmax - 2, season - 4 + carry + 2 * rnd()), 1);
    const rain = wet ? r(rnd() ** 2 * 25, 1) : rnd() < 0.15 ? 0.2 : 0;
    const snow = tmin < 0.5 && wet ? r(rnd() * 3, 1) : 0;
    const wind = r(5 + rnd() * 20 + (wet ? 8 : 0), 0);
    const dir = wind < 6 ? 'Calm' : POINTS[Math.floor(rnd() * 16)];
    out.push({ date, tmax, tmin, rain, snow, wind, dir, pres: r(p, 1), cloud: Math.min(8, Math.floor(wet ? 6 + rnd() * 3 : rnd() * 7)), notes: i === 9 ? 'Thunder in the evening' : '' });
  }
  const frost = out.find((e) => e.tmin != null && e.tmin < 0);
  if (frost) frost.notes = 'First frost on the car';
  return out;
}
