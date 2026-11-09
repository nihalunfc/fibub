// Heritage climate and mould risk: reads a data-logger series (time, temperature, RH), and works out dew point
// (Magnus formula), time above or below thresholds, daily RH swings, the longest damp spell, and a time-weighted
// preservation index from an Arrhenius rate with a user-set activation energy. Plain maths, no DOM.

/** Magnus formula coefficients over water (b, c in °C), as given in the WMO guide (Sonntag 1990). */
export const MAGNUS = { b: 17.62, c: 243.12 };
/** Dew point (°C) from temperature (°C) and relative humidity (%), Magnus formula. */
export function dewPoint(t: number, rh: number): number {
  const a = Math.log(rh / 100) + (MAGNUS.b * t) / (MAGNUS.c + t);
  return (MAGNUS.c * a) / (MAGNUS.b - a);
}

export type Reading = { t: number; temp: number; rh: number }; // t in ms (clock time read as UTC)
export type DateOrder = 'auto' | 'dmy' | 'mdy' | 'ymd';

/** A logger time stamp to ms. ISO dates, d/m/y or m/d/y with / . or -, optional seconds and AM/PM, or an Excel day number. */
export function parseTime(s: string, order: DateOrder = 'auto'): number {
  const t = s.trim().replace(/^"|"$/g, '');
  if (/^\d{5}(\.\d+)?$/.test(t)) { const v = Number(t); if (v > 20000 && v < 80000) return Math.round((v - 25569) * 86400000); }
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T ]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*([AaPp][Mm])?)?\s*(Z|[+-]\d{2}:?\d{2})?$/.exec(t);
  let y: number, mo: number, d: number;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else {
    m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})(?:[T ,]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*([AaPp][Mm])?)?$/.exec(t);
    if (!m) return NaN;
    const a = +m[1], b = +m[2];
    y = +m[3]; if (y < 100) y += 2000;
    const mdy = order === 'mdy' || (order === 'auto' && b > 12 && a <= 12);
    [d, mo] = mdy ? [b, a] : [a, b];
  }
  let hh = m[4] ? +m[4] : 0; const mi = m[5] ? +m[5] : 0, ss = m[6] ? +m[6] : 0;
  if (m[7]) { const pm = /p/i.test(m[7]); if (hh === 12) hh = pm ? 12 : 0; else if (pm) hh += 12; }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || hh > 24 || mi > 59 || ss > 60) return NaN;
  return Date.UTC(y, mo - 1, d, hh, mi, ss);
}

/** Guess which columns hold the time (and a separate date), temperature and RH from the header row. */
export function guessColumns(head: string[]): { date: number; time: number; temp: number; rh: number } {
  const h = head.map((x) => x.toLowerCase());
  const find = (re: RegExp, not: number[] = []) => h.findIndex((x, i) => re.test(x) && !not.includes(i));
  let rh = find(/\brh\b|humid|%\s*rh|rh\s*%|feuchte/);
  let temp = find(/temp|°c|°f|deg\s*c|\bt\b|celsius|fahrenheit/, [rh]);
  const date = find(/date|datum/), timeOnly = find(/time|zeit|timestamp/, [date]);
  let time = date >= 0 ? date : timeOnly;
  const sepDate = date >= 0 && timeOnly >= 0 && timeOnly !== date ? date : -1;
  if (sepDate >= 0) time = timeOnly;
  if (time < 0) time = 0;
  const free = h.map((_, i) => i).filter((i) => i !== time && i !== sepDate);
  if (temp < 0) temp = free.find((i) => i !== rh && i > time) ?? free[0] ?? 1;
  if (rh < 0) rh = free.find((i) => i !== temp && i > temp) ?? free.find((i) => i !== temp) ?? 2;
  return { date: sepDate, time, temp, rh };
}

export type Parsed = { readings: Reading[]; bad: number; firstBad: string; headers: string[]; cols: ReturnType<typeof guessColumns> };
/** Read a pasted or opened logger table. `cols` overrides the guessed columns; °F temperatures are turned into °C. */
export function parseLog(text: string, o: { order?: DateOrder; fahrenheit?: boolean; cols?: Partial<ReturnType<typeof guessColumns>> } = {}): Parsed {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const sample = lines.slice(0, 20).join('\n');
  const sep = sample.includes('\t') ? /\t/ : sample.includes(';') ? /;/ : /,/;
  const rows = lines.map((l) => l.split(sep).map((c) => c.trim().replace(/^"(.*)"$/, '$1')));
  const numv = (s: string | undefined) => { const x = (s ?? '').replace(/[−–]/g, '-').replace(/\s/g, ''); return x === '' ? NaN : Number(sep.source === ',' ? x : x.replace(',', '.')); };
  // Header rows: anything before the first row whose would-be temperature and RH cells are numbers.
  let start = 0;
  while (start < rows.length && start < 30 && rows[start].filter((c) => Number.isFinite(numv(c))).length < 2) start++;
  const headers = start > 0 ? rows[start - 1] : (rows[0] ?? []).map((_, i) => `Column ${i + 1}`);
  const cols = { ...guessColumns(start > 0 ? headers : []), ...Object.fromEntries(Object.entries(o.cols ?? {}).filter(([, v]) => v != null && Number.isFinite(v))) } as Parsed['cols'];
  if (start === 0 && !o.cols) { // no header: time, temperature, RH, after any leading index column
    const r = rows[0] ?? [];
    const firstTime = r.findIndex((c) => Number.isFinite(parseTime(c, o.order ?? 'auto')) && !/^\d{1,4}$/.test(c));
    if (firstTime >= 0) { cols.time = firstTime; cols.temp = firstTime + 1; cols.rh = firstTime + 2; cols.date = -1; }
  }
  const readings: Reading[] = []; let bad = 0, firstBad = '';
  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const ts = cols.date >= 0 ? `${r[cols.date]} ${r[cols.time]}` : r[cols.time] ?? '';
    const t = parseTime(ts, o.order ?? 'auto');
    let temp = numv(r[cols.temp]); const rh = numv(r[cols.rh]);
    if (o.fahrenheit) temp = ((temp - 32) * 5) / 9;
    if (Number.isFinite(t) && Number.isFinite(temp) && rh > 0 && rh <= 100 && temp > -80 && temp < 80) readings.push({ t, temp, rh });
    else { bad++; if (!firstBad) firstBad = `line ${i + 1} ("${lines[i].slice(0, 50)}")`; }
  }
  readings.sort((a, b) => a.t - b.t);
  return { readings, bad, firstBad, headers, cols };
}

/** Median spacing between readings (ms). */
export function medianStep(r: Reading[]): number {
  const d = r.slice(1).map((x, i) => x.t - r[i].t).filter((x) => x > 0).sort((a, b) => a - b);
  return d.length ? d[Math.floor((d.length - 1) / 2)] : 0;
}
/** How long each reading stands for (ms): until the next one, or one usual step for the last one; gaps over 3 steps count only one step. */
export function weights(r: Reading[]): number[] {
  const step = medianStep(r);
  return r.map((x, i) => { const d = i + 1 < r.length ? r[i + 1].t - x.t : step; return d > 3 * step ? step : d; });
}

export type Options = { rhHigh: number; rhLow: number; tHigh: number; tLow: number; mouldRh: number; swing: number; ea: number; tRef: number; rhRef: number; rhExp: number };
export type DaySwing = { day: number; min: number; max: number; range: number; n: number };
export type Result = {
  n: number; start: number; end: number; step: number; gaps: number; hours: number;
  temp: { min: number; max: number; mean: number }; rh: { min: number; max: number; mean: number }; dew: { min: number; max: number; mean: number };
  hoursRhHigh: number; hoursRhLow: number; hoursTHigh: number; hoursTLow: number; hoursMould: number;
  longest: { hours: number; from: number; to: number }; days: DaySwing[]; daysOverSwing: number; maxSwing: DaySwing | null; meanSwing: number;
  /** Rate of decay relative to the reference conditions, time-weighted (1 = as at the reference). */
  rate: number; twpi: number; dewPts: number[];
};

const R_GAS = 8.314462618;
/** Relative rate of chemical decay at (T, RH) against the reference: Arrhenius in T, (RH/RHref)^n in humidity. */
export const relRate = (temp: number, rh: number, o: Pick<Options, 'ea' | 'tRef' | 'rhRef' | 'rhExp'>) =>
  Math.exp(((o.ea * 1000) / R_GAS) * (1 / (o.tRef + 273.15) - 1 / (temp + 273.15))) * (rh / o.rhRef) ** o.rhExp;

export function analyse(r: Reading[], o: Options): Result {
  const w = weights(r), step = medianStep(r), H = 3600000, total = w.reduce((s, x) => s + x, 0);
  const sumIf = (f: (x: Reading) => boolean) => r.reduce((s, x, i) => s + (f(x) ? w[i] : 0), 0) / H;
  const stats = (v: number[]) => ({ min: Math.min(...v), max: Math.max(...v), mean: v.reduce((s, x, i) => s + x * w[i], 0) / total });
  const dewPts = r.map((x) => dewPoint(x.temp, x.rh));
  // Longest unbroken run of readings at or above the mould-risk RH (a gap over 3 steps breaks it).
  let best = { hours: 0, from: NaN, to: NaN }, runStart = -1, runH = 0;
  r.forEach((x, i) => {
    const broken = i > 0 && x.t - r[i - 1].t > 3 * step;
    if (x.rh >= o.mouldRh && (runStart < 0 || !broken)) { if (runStart < 0) { runStart = i; runH = 0; } runH += w[i] / H; }
    else if (x.rh >= o.mouldRh) { runStart = i; runH = w[i] / H; }
    else runStart = -1;
    if (runStart >= 0 && runH > best.hours) best = { hours: runH, from: r[runStart].t, to: x.t + w[i] };
  });
  // Calendar days (the logger's clock).
  const map = new Map<number, DaySwing>();
  for (const x of r) { const d = Math.floor(x.t / 86400000); const s = map.get(d); if (!s) map.set(d, { day: d * 86400000, min: x.rh, max: x.rh, range: 0, n: 1 }); else { s.min = Math.min(s.min, x.rh); s.max = Math.max(s.max, x.rh); s.n++; } }
  const days = [...map.values()].map((s) => ({ ...s, range: s.max - s.min }));
  const full = days.filter((d) => d.n >= Math.max(2, Math.round((0.75 * 86400000) / (step || 86400000))));
  const rate = r.reduce((s, x, i) => s + relRate(x.temp, x.rh, o) * w[i], 0) / total;
  return {
    n: r.length, start: r[0].t, end: r[r.length - 1].t, step, gaps: r.slice(1).filter((x, i) => x.t - r[i].t > 3 * step).length, hours: total / H,
    temp: stats(r.map((x) => x.temp)), rh: stats(r.map((x) => x.rh)), dew: stats(dewPts),
    hoursRhHigh: sumIf((x) => x.rh > o.rhHigh), hoursRhLow: sumIf((x) => x.rh < o.rhLow), hoursTHigh: sumIf((x) => x.temp > o.tHigh), hoursTLow: sumIf((x) => x.temp < o.tLow), hoursMould: sumIf((x) => x.rh >= o.mouldRh),
    longest: best, days, daysOverSwing: full.filter((d) => d.range > o.swing).length,
    maxSwing: full.length ? full.reduce((m, d) => (d.range > m.range ? d : m)) : null, meanSwing: full.length ? full.reduce((s, d) => s + d.range, 0) / full.length : NaN,
    rate, twpi: 1 / rate, dewPts,
  };
}

/** Made-up logger data: 30 days, hourly, a room with a daily cycle and a damp spell in the middle. */
export function exampleLog(): string {
  let seed = 11; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 - 0.5; };
  const out = ['Time,Temperature (°C),RH (%)'], t0 = Date.UTC(2026, 5, 1);
  for (let i = 0; i < 30 * 24; i++) {
    const day = i / 24, hr = i % 24, cyc = Math.sin(((hr - 9) / 24) * 2 * Math.PI);
    const damp = day > 12 && day < 17 ? 27 * Math.min(1, 2 * Math.sin(((day - 12) / 5) * Math.PI)) : 0;
    const temp = 19 + 0.08 * day + 1.6 * cyc + 0.3 * rnd();
    const rh = Math.min(98, 52 - 3.5 * cyc + damp + 1.2 * rnd());
    const d = new Date(t0 + i * 3600000).toISOString();
    out.push(`${d.slice(0, 10)} ${d.slice(11, 16)},${temp.toFixed(1)},${rh.toFixed(1)}`);
  }
  return out.join('\n');
}

/** Thin a long series for drawing: keeps each bucket's lowest and highest point, in time order. */
export function thin(x: number[], y: number[], max = 4000): { x: number[]; y: number[] } {
  if (x.length <= max) return { x, y };
  const b = Math.ceil(x.length / (max / 2)), ox: number[] = [], oy: number[] = [];
  for (let i = 0; i < x.length; i += b) {
    let lo = i, hi = i;
    for (let j = i; j < Math.min(x.length, i + b); j++) { if (y[j] < y[lo]) lo = j; if (y[j] > y[hi]) hi = j; }
    for (const k of lo <= hi ? [lo, hi] : [hi, lo]) { ox.push(x[k]); oy.push(y[k]); if (lo === hi) break; }
  }
  return { x: ox, y: oy };
}
