// Training load: session RPE, Banister and Edwards TRIMP, acute:chronic workload ratio (rolling and EWMA),
// monotony and strain. Plain maths, no DOM.

export type Session = { date: string; day: number; minutes: number; rpe: number | null; hr: number | null; zones: number[] | null; note: string };
export type Metric = 'srpe' | 'banister' | 'edwards';
export type Hr = { rest: number; max: number; female: boolean };

/** Session RPE load (Foster et al. 2001): RPE (0–10) × minutes, in arbitrary units. */
export const srpe = (rpe: number, minutes: number) => rpe * minutes;
/** Banister TRIMP: minutes × HRr × k × e^(b × HRr), HRr = fraction of heart rate reserve; k, b = 0.64, 1.92 (men) or 0.86, 1.67 (women). */
export function banister(minutes: number, hrAvg: number, hr: Hr): number {
  const x = (hrAvg - hr.rest) / (hr.max - hr.rest);
  const [k, b] = hr.female ? [0.86, 1.67] : [0.64, 1.92];
  return minutes * x * k * Math.exp(b * x);
}
/** Edwards TRIMP: minutes in zones 1–5 (50–60 … 90–100 % HRmax) weighted 1 to 5. */
export const edwards = (zones: number[]) => zones.reduce((a, m, i) => a + m * (i + 1), 0);

/** Day number (days since 1970-01-01, UTC) from YYYY-MM-DD, or NaN. */
export function dayNum(s: string): number {
  const m = s.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return NaN;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d), dt = new Date(t);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return NaN;
  return t / 864e5;
}
export const dayStr = (n: number) => new Date(n * 864e5).toISOString().slice(0, 10);

/** One CSV or TSV line into cells, with "quoted, cells". */
export function splitLine(line: string): string[] {
  const sep = line.includes('\t') ? '\t' : line.includes(';') && !line.includes(',') ? ';' : ',';
  const out: string[] = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === sep) { out.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  out.push(cur.trim());
  return out;
}

export const HEADER = ['date', 'minutes', 'rpe', 'avg_hr', 'z1', 'z2', 'z3', 'z4', 'z5', 'note'];

/** Sessions from CSV text: a header row naming the columns (date and minutes needed), or the columns in HEADER order. */
export function parseSessions(text: string): Session[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (!lines.length) return [];
  let cols = HEADER, start = 0;
  const first = splitLine(lines[0]).map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (first.includes('date')) {
    const alias: Record<string, string> = { date: 'date', minutes: 'minutes', min: 'minutes', duration: 'minutes', durationmin: 'minutes', rpe: 'rpe', avghr: 'avg_hr', hr: 'avg_hr', heartrate: 'avg_hr', z1: 'z1', z2: 'z2', z3: 'z3', z4: 'z4', z5: 'z5', note: 'note', notes: 'note' };
    cols = first.map((c) => alias[c] ?? '');
    if (!cols.includes('minutes')) throw new Error('The header row needs a "minutes" column.');
    start = 1;
  }
  const out: Session[] = [];
  for (let i = start; i < lines.length; i++) {
    const cells = splitLine(lines[i]), get = (k: string) => { const j = cols.indexOf(k); return j < 0 ? '' : (cells[j] ?? '').trim(); };
    const where = `Line ${i + 1}`;
    const day = dayNum(get('date'));
    if (!Number.isFinite(day)) throw new Error(`${where}: "${get('date')}" is not a date. Use YYYY-MM-DD, such as 2026-09-07.`);
    const minutes = Number(get('minutes'));
    if (!(minutes > 0 && minutes <= 1440)) throw new Error(`${where}: minutes must be between 0 and 1440.`);
    const opt = (k: string, lo: number, hi: number, name: string) => {
      const s = get(k); if (s === '') return null;
      const v = Number(s); if (!(Number.isFinite(v) && v >= lo && v <= hi)) throw new Error(`${where}: ${name} must be between ${lo} and ${hi}.`);
      return v;
    };
    const rpe = opt('rpe', 0, 10, 'RPE'), hr = opt('avg_hr', 30, 230, 'average heart rate');
    const zs = ['z1', 'z2', 'z3', 'z4', 'z5'].map((k) => opt(k, 0, 1440, `minutes in ${k}`));
    const zones = zs.some((z) => z !== null) ? zs.map((z) => z ?? 0) : null;
    if (zones && zones.reduce((a, b) => a + b, 0) > minutes + 1e-9) throw new Error(`${where}: the zone minutes add up to more than the session.`);
    out.push({ date: dayStr(day), day, minutes, rpe, hr, zones, note: get('note') });
  }
  return out.sort((a, b) => a.day - b.day);
}

export function toCsv(s: Session[]): string {
  const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [HEADER.join(','), ...s.map((x) => [x.date, x.minutes, x.rpe ?? '', x.hr ?? '', ...(x.zones ?? ['', '', '', '', '']), q(x.note)].join(','))].join('\n') + '\n';
}

/** Load of one session in a metric, or null when the session lacks the data. */
export function sessionLoad(s: Session, m: Metric, hr: Hr): number | null {
  if (m === 'srpe') return s.rpe === null ? null : srpe(s.rpe, s.minutes);
  if (m === 'edwards') return s.zones ? edwards(s.zones) : null;
  return s.hr === null ? null : banister(s.minutes, s.hr, hr);
}

export type Daily = { day: number; load: number; acute: number; chronic: number; acwr: number; ewmaA: number; ewmaC: number; ewmaRatio: number };

/**
 * Daily loads from the first to the last session (days without a session are 0), with:
 * rolling acute = 7-day sum, chronic = 28-day sum / 4 (both include today; NaN until 7 or 28 days exist),
 * ACWR = acute / chronic (coupled, as Hulin et al. 2014; Gabbett 2016);
 * EWMA with λ = 2/(N+1), N = 7 and 28 (Williams et al. 2017), started at the first day's load.
 */
export function daily(sessions: Session[], m: Metric, hr: Hr): Daily[] {
  if (!sessions.length) return [];
  const d0 = sessions[0].day, d1 = sessions[sessions.length - 1].day, n = d1 - d0 + 1;
  const load = new Array(n).fill(0);
  for (const s of sessions) load[s.day - d0] += sessionLoad(s, m, hr) ?? 0;
  const la = 2 / (7 + 1), lc = 2 / (28 + 1);
  const out: Daily[] = [];
  let ea = load[0], ec = load[0];
  for (let i = 0; i < n; i++) {
    if (i > 0) { ea = load[i] * la + (1 - la) * ea; ec = load[i] * lc + (1 - lc) * ec; }
    const sum = (k: number) => (i + 1 >= k ? load.slice(i + 1 - k, i + 1).reduce((a, b) => a + b, 0) : NaN);
    const acute = sum(7), chronic = sum(28) / 4;
    out.push({ day: d0 + i, load: load[i], acute, chronic, acwr: chronic > 0 ? acute / chronic : NaN, ewmaA: ea, ewmaC: ec, ewmaRatio: ec > 0 ? ea / ec : NaN });
  }
  return out;
}

export type Week = { start: number; days: number; sessions: number; total: number; mean: number; sd: number; monotony: number; strain: number };

/**
 * Monday-to-Sunday weeks (Foster 1998): monotony = mean daily load / SD of daily load (sample SD, n − 1, over
 * all 7 days, rest days as 0), strain = weekly total × monotony. Days before the first or after the last
 * session in a week count as rest days.
 */
export function weeks(sessions: Session[], m: Metric, hr: Hr): Week[] {
  if (!sessions.length) return [];
  const monday = (d: number) => d - ((new Date(d * 864e5).getUTCDay() + 6) % 7);
  const w0 = monday(sessions[0].day), w1 = monday(sessions[sessions.length - 1].day);
  const out: Week[] = [];
  for (let w = w0; w <= w1; w += 7) {
    const days = new Array(7).fill(0); let count = 0;
    for (const s of sessions) if (s.day >= w && s.day < w + 7) { days[s.day - w] += sessionLoad(s, m, hr) ?? 0; count++; }
    const total = days.reduce((a, b) => a + b, 0), mean = total / 7;
    const sd = Math.sqrt(days.reduce((a, b) => a + (b - mean) ** 2, 0) / 6);
    const monotony = sd > 0 ? mean / sd : NaN;
    out.push({ start: w, days: 7, sessions: count, total, mean, sd, monotony, strain: total * monotony });
  }
  return out;
}
