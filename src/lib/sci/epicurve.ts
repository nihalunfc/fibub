// Outbreak epidemic curves and food-history attack rates. Plain functions, no DOM.
// Dates are read as UTC so that daylight saving never moves a case into another bin.
// Methods: histogram of onset times in equal bins (CDC, Principles of Epidemiology in Public Health Practice,
// 3rd ed., lesson 6); attack rates and the attack-rate (risk) ratio with the log interval of Katz et al. (1978,
// Biometrics 34:469); Fisher's (1935) exact test.
import { table2x2, fisherExact, type CI } from './epistat.ts';

const DAY = 86400000, HOUR = 3600000;
export type Onset = { t: number; n: number; line: number };

/** A date "2026-06-10", "2026/06/10", optionally with a time "2026-06-10 14:30" or "2026-06-10T14:30", as UTC ms. */
export function parseDate(s: string): number {
  const m = s.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?Z?$/);
  if (!m) return NaN;
  const [y, mo, d, h = '0', mi = '0', se = '0'] = m.slice(1);
  const t = Date.UTC(+y, +mo - 1, +d, +h, +mi, +se);
  const back = new Date(t);
  if (back.getUTCMonth() !== +mo - 1 || back.getUTCDate() !== +d || +h > 23 || +mi > 59) return NaN;
  return t;
}

/** Onsets from text: one date per line, or "date, count". A first line without digits is a header. */
export function parseOnsets(text: string) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const onsets: Onset[] = [], errors: string[] = [];
  let first = true, timed = false;
  lines.forEach((raw, i) => {
    const l = raw.trim();
    if (!l || l.startsWith('#')) return;
    const cells = l.split(/\s*[,;\t]\s*/);
    // A date and time separated by a space stays one cell; a date and a count separated by spaces are split.
    let dateTxt = cells[0], countTxt = cells[1];
    if (cells.length === 1) { const sp = l.split(/\s+/); if (sp.length === 2 && /^\d+$/.test(sp[1])) { dateTxt = sp[0]; countTxt = sp[1]; } }
    const t = parseDate(dateTxt);
    if (!Number.isFinite(t)) { if (!first || /\d/.test(dateTxt)) errors.push(`Line ${i + 1}: "${l.slice(0, 40)}" is not a date (use YYYY-MM-DD).`); first = false; return; }
    first = false;
    const n = countTxt === undefined || countTxt === '' ? 1 : Number(countTxt);
    if (!(Number.isInteger(n) && n >= 0)) { errors.push(`Line ${i + 1}: the count "${countTxt}" must be a whole number.`); return; }
    if (/[T ]\d{1,2}:\d{2}/.test(dateTxt)) timed = true;
    onsets.push({ t, n, line: i + 1 });
  });
  return { onsets, errors, timed };
}

export type Bin = { kind: 'hours' | 'days' | 'week-mon' | 'week-sun'; size: number };
/** The start of the bin that holds time t. Hour bins are counted from midnight of the first case's day. */
function binStart(t: number, b: Bin, origin: number) {
  if (b.kind === 'week-mon' || b.kind === 'week-sun') {
    const day = Math.floor(t / DAY) * DAY, dow = new Date(day).getUTCDay();
    return day - (b.kind === 'week-mon' ? (dow + 6) % 7 : dow) * DAY;
  }
  const w = b.kind === 'hours' ? b.size * HOUR : b.size * DAY;
  return origin + Math.floor((t - origin) / w) * w;
}
export const binWidth = (b: Bin) => (b.kind === 'hours' ? b.size * HOUR : b.kind === 'days' ? b.size * DAY : 7 * DAY);

/**
 * Counts in equal, contiguous bins from the first case to the last, zeros included. `include` (such as an
 * exposure time) widens the range so that time has a bin too.
 */
export function epiCurve(onsets: Onset[], b: Bin, maxBins = 2000, include?: number) {
  const cases = onsets.filter((o) => o.n > 0);
  if (!cases.length) return { bins: [] as { start: number; end: number; count: number }[], total: 0 };
  const extra = include !== undefined && Number.isFinite(include) ? [include] : [];
  const tMin = Math.min(...cases.map((o) => o.t), ...extra), tMax = Math.max(...cases.map((o) => o.t), ...extra);
  const origin = Math.floor(tMin / DAY) * DAY, w = binWidth(b);
  const s0 = binStart(tMin, b, origin), s1 = binStart(tMax, b, origin), nb = Math.round((s1 - s0) / w) + 1;
  if (nb > maxBins) throw new Error(`That makes ${nb} bins; choose wider bins (at most ${maxBins}).`);
  const bins = Array.from({ length: nb }, (_, i) => ({ start: s0 + i * w, end: s0 + (i + 1) * w, count: 0 }));
  for (const o of cases) bins[Math.round((binStart(o.t, b, origin) - s0) / w)].count += o.n;
  return { bins, total: cases.reduce((s, o) => s + o.n, 0) };
}

/** Summary of onsets: first, last, median (weighted by counts), and incubation from an exposure time. */
export function summary(onsets: Onset[], exposure?: number) {
  const s = onsets.filter((o) => o.n > 0).sort((a, b) => a.t - b.t);
  const total = s.reduce((t, o) => t + o.n, 0);
  const at = (k: number) => { let c = 0; for (const o of s) { c += o.n; if (c >= k) return o.t; } return NaN; };
  const median = total % 2 ? at((total + 1) / 2) : (at(total / 2) + at(total / 2 + 1)) / 2;
  const out = { total, first: s[0]?.t ?? NaN, last: s.at(-1)?.t ?? NaN, median, incubation: null as null | { min: number; median: number; max: number; before: number } };
  if (exposure !== undefined && Number.isFinite(exposure) && total) {
    out.incubation = { min: out.first - exposure, median: median - exposure, max: out.last - exposure, before: s.filter((o) => o.t < exposure).reduce((t, o) => t + o.n, 0) };
  }
  return out;
}

export type FoodRow = { name: string; ateIll: number; ateWell: number; notIll: number; notWell: number };
/** Attack rates among those who ate and did not eat an item, the attack-rate ratio with its interval, and Fisher's p. */
export function attackRates(rows: FoodRow[], conf = 0.95) {
  return rows.map((r) => {
    const ate = r.ateIll + r.ateWell, not = r.notIll + r.notWell;
    const t = table2x2(r.ateIll, r.ateWell, r.notIll, r.notWell, conf);
    const ok = r.ateIll > 0 && r.notIll > 0 && ate > 0 && not > 0;
    return { ...r, ate, not, arAte: r.ateIll / ate, arNot: r.notIll / not, rr: t.rr, rrCI: (ok ? t.rrCI : [NaN, NaN]) as CI, p: fisherExact(r.ateIll, r.ateWell, r.notIll, r.notWell).p };
  });
}

/** "2026-06-10" (or with "14:00" when the bins are hours) for a UTC time. */
export function fmtDate(t: number, withTime = false) {
  const iso = new Date(t).toISOString();
  return withTime ? `${iso.slice(0, 10)} ${iso.slice(11, 16)}` : iso.slice(0, 10);
}
