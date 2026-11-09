// Heating, cooling and growing degree days from daily temperatures (plain maths, no DOM).
// A day's temperature curve is modelled in one of four ways and the degree days are the area between the
// curve and a base temperature, divided by the length of the day (so the unit is "degree × day"):
// - mean: the day is flat at its mean temperature ((min + max) / 2 when both are given);
// - modified average (growing degree days only): min and max are first clipped to the band [base, upper],
//   then averaged; heating and cooling use the plain mean under this method;
// - single sine (Baskerville and Emin 1969): one sine wave from the minimum to the maximum and back;
// - single triangle: a straight rise from the minimum to the maximum over half the day and a straight fall back.
// Above-base areas are worked out from the geometry of each curve; below-base (heating) areas follow from
// below(B) = (B − mean) + above(B), because max(0, B − T) − max(0, T − B) = B − T and both curves average to the mean.
// Growing degree days with an upper cutoff U use a horizontal cutoff: above(B) − above(U).
import { readDate, addDays } from './degdays.ts';

export { readDate, addDays };
export type Method = 'mean' | 'modified' | 'sine' | 'triangle';
export type Day = { date: string; tmin: number; tmax: number; mean: number; filled?: boolean };

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Area above base B per day for the single sine curve between tmin and tmax. */
export function sineAbove(tmin: number, tmax: number, B: number): number {
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
  const M = (tmin + tmax) / 2, A = (tmax - tmin) / 2;
  if (B >= tmax) return 0;
  if (B <= tmin) return M - B;
  // T = M + A sin θ over θ in [−π/2, π/2] (the rising half; the falling half is its mirror image).
  // The curve is above B for θ > θ1, θ1 = asin((B − M)/A); ∫ (M − B + A sin θ) dθ from θ1 to π/2, over π.
  const t1 = Math.asin(clamp((B - M) / A, -1, 1));
  return ((M - B) * (Math.PI / 2 - t1) + A * Math.cos(t1)) / Math.PI;
}

/** Area above base B per day for the single triangle curve between tmin and tmax. */
export function triangleAbove(tmin: number, tmax: number, B: number): number {
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
  if (B >= tmax) return 0;
  if (B <= tmin) return (tmin + tmax) / 2 - B;
  // Above B for a fraction (tmax − B)/(tmax − tmin) of the day, a triangle of height tmax − B.
  return (tmax - B) ** 2 / (2 * (tmax - tmin));
}

const above = (d: { tmin: number; tmax: number; mean: number }, B: number, method: Method) =>
  method === 'sine' ? sineAbove(d.tmin, d.tmax, B) : method === 'triangle' ? triangleAbove(d.tmin, d.tmax, B) : Math.max(0, d.mean - B);

/** Cooling degree days for one day: time spent above the base, weighted by how far above. */
export function cooling(d: { tmin: number; tmax: number; mean: number }, base: number, method: Method): number {
  return above(d, base, method);
}

/** Heating degree days for one day: time spent below the base, weighted by how far below. */
export function heating(d: { tmin: number; tmax: number; mean: number }, base: number, method: Method): number {
  if (method === 'mean' || method === 'modified') return Math.max(0, base - d.mean);
  const curveMean = (d.tmin + d.tmax) / 2;
  return Math.max(0, base - curveMean + above(d, base, method));
}

/** Growing degree days for one day, with an optional upper cutoff (null for none). */
export function growing(d: { tmin: number; tmax: number; mean: number }, base: number, upper: number | null, method: Method): number {
  const U = upper != null && Number.isFinite(upper) && upper > base ? upper : Infinity;
  if (method === 'mean') return Math.max(0, Math.min(d.mean, U) - base);
  if (method === 'modified') return (clamp(d.tmax, base, U) + clamp(d.tmin, base, U)) / 2 - base;
  return Math.max(0, above(d, base, method) - (Number.isFinite(U) ? above(d, U, method) : 0));
}

export type Settings = { heatBase: number; coolBase: number; growBase: number; growUpper: number | null; method: Method };
export type DayOut = Day & { hdd: number; cdd: number; gdd: number; chdd: number; ccdd: number; cgdd: number };

/** Daily values and running totals for every day. */
export function degreeDays(days: Day[], s: Settings): DayOut[] {
  let ch = 0, cc = 0, cg = 0;
  return days.map((d) => {
    const hdd = heating(d, s.heatBase, s.method), cdd = cooling(d, s.coolBase, s.method), gdd = growing(d, s.growBase, s.growUpper, s.method);
    ch += hdd; cc += cdd; cg += gdd;
    return { ...d, hdd, cdd, gdd, chdd: ch, ccdd: cc, cgdd: cg };
  });
}

export type Month = { month: string; days: number; filled: number; hdd: number; cdd: number; gdd: number; cgdd: number };
/** Totals per calendar month (YYYY-MM), in date order. */
export function monthly(rows: DayOut[]): Month[] {
  const out: Month[] = [];
  for (const r of rows) {
    const m = r.date.slice(0, 7);
    let cur = out[out.length - 1];
    if (!cur || cur.month !== m) { cur = { month: m, days: 0, filled: 0, hdd: 0, cdd: 0, gdd: 0, cgdd: 0 }; out.push(cur); }
    cur.days++; if (r.filled) cur.filled++;
    cur.hdd += r.hdd; cur.cdd += r.cdd; cur.gdd += r.gdd; cur.cgdd = r.cgdd;
  }
  return out;
}

export type Gaps = { missing: number; longest: number; dates: string[] };
/**
 * Puts the days in order and deals with dates that are missing between the first and last day:
 * 'interp' fills each with a straight line between the nearest days either side (min, max and mean),
 * 'skip' leaves them out (they then add nothing to any total).
 */
export function fillGaps(days: Day[], how: 'interp' | 'skip'): { days: Day[]; gaps: Gaps } {
  const s = [...days].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const out: Day[] = [], gaps: Gaps = { missing: 0, longest: 0, dates: [] };
  for (let i = 0; i < s.length; i++) {
    if (i) {
      const prev = s[i - 1], cur = s[i];
      const n = Math.round((Date.parse(cur.date) - Date.parse(prev.date)) / 864e5) - 1;
      if (n > 0) {
        gaps.missing += n; gaps.longest = Math.max(gaps.longest, n);
        for (let k = 1; k <= n; k++) {
          const date = addDays(prev.date, k);
          gaps.dates.push(date);
          if (how === 'interp') {
            const f = k / (n + 1), lerp = (a: number, b: number) => a + (b - a) * f;
            out.push({ date, tmin: lerp(prev.tmin, cur.tmin), tmax: lerp(prev.tmax, cur.tmax), mean: lerp(prev.mean, cur.mean), filled: true });
          }
        }
      }
    }
    out.push(s[i]);
  }
  return { days: out, gaps };
}

export type Parsed = { days: Day[]; hasMinMax: boolean; bad: number; dup: string };
/**
 * Reads pasted rows: date, min, max (three or more columns) or date, mean (two columns). The layout is
 * decided by the first readable row. Rows with a date but no temperatures count as missing days (left out
 * here; fillGaps sees the hole). A header row is skipped.
 */
export function readDays(rows: string[][], num: (s: string) => number, mdy = false): Parsed {
  const days: Day[] = [];
  let hasMinMax: boolean | null = null, bad = 0;
  for (const r of rows) {
    const date = readDate(r[0] ?? '', mdy);
    const a = num(r[1] ?? ''), b = num(r[2] ?? '');
    if (!date) { if (/\d/.test(r[0] ?? '') && (Number.isFinite(a) || Number.isFinite(b))) bad++; continue; }
    if (hasMinMax == null) { if (Number.isFinite(a) && Number.isFinite(b)) hasMinMax = true; else if (Number.isFinite(a) && r.slice(2).every((c) => !c)) hasMinMax = false; else continue; }
    if (hasMinMax) {
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue; // a missing day
      const lo = Math.min(a, b), hi = Math.max(a, b);
      days.push({ date, tmin: lo, tmax: hi, mean: (lo + hi) / 2 });
    } else {
      if (!Number.isFinite(a)) continue;
      days.push({ date, tmin: a, tmax: a, mean: a });
    }
  }
  const sorted = [...days].map((d) => d.date).sort();
  let dup = '';
  for (let i = 1; i < sorted.length; i++) if (sorted[i] === sorted[i - 1]) { dup = sorted[i]; break; }
  return { days, hasMinMax: !!hasMinMax, bad, dup };
}

/**
 * A made-up year of daily minimum and maximum temperatures (°C) for a temperate place, as tab-separated
 * text with a header. Deterministic (a fixed pseudo-random sequence), so the page and the tests agree.
 * One day (14 March) is left out on purpose to show how missing days are handled.
 */
export function exampleYear(): string {
  let seed = 20250101;
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const lines = ['date\tmin\tmax'];
  let anomaly = 0;
  for (let i = 0; i < 365; i++) {
    const date = addDays('2025-01-01', i);
    anomaly = 0.7 * anomaly + (rnd() - 0.5) * 4;
    const mean = 11 - 11.5 * Math.cos((2 * Math.PI * (i - 18)) / 365) + anomaly;
    const range = 9 + 3 * Math.sin((2 * Math.PI * (i - 100)) / 365) + (rnd() - 0.5) * 4;
    if (date === '2025-03-14') continue;
    lines.push(`${date}\t${(mean - range / 2).toFixed(1)}\t${(mean + range / 2).toFixed(1)}`);
  }
  return lines.join('\n');
}

export const cToF = (c: number) => c * 1.8 + 32;
export const fToC = (f: number) => (f - 32) / 1.8;
