// Insect degree-days from daily minimum and maximum temperatures (plain maths, no DOM).
// Methods: simple average and single sine (Baskerville and Emin 1969), with a lower threshold and an
// optional upper threshold cut off horizontally or vertically (Zalom et al. 1983, UC IPM). Units follow
// the temperatures given (°C or °F); thresholds must use the same unit.

export type DDMethod = 'average' | 'sine';
export type Cutoff = 'horizontal' | 'vertical';

/**
 * Degree-days for one day.
 * - average: (Tmax + Tmin)/2 − L, never below 0. With an upper threshold U, Tmax (and Tmin) above U are
 *   set to U first (the horizontal cutoff); a vertical cutoff gives 0 for a day whose mean is above U.
 * - sine: the day's temperature follows one sine wave from Tmin to Tmax and back; degree-days are the
 *   area between the curve and L (above U the area is capped at U − L for horizontal, or left out for vertical).
 */
export function dailyDD(tmin: number, tmax: number, lower: number, upper: number | null, method: DDMethod, cutoff: Cutoff = 'horizontal'): number {
  if (!Number.isFinite(tmin) || !Number.isFinite(tmax)) return NaN;
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
  const U = upper != null && Number.isFinite(upper) ? upper : Infinity;
  if (method === 'average') {
    if (cutoff === 'vertical') { const m = (tmin + tmax) / 2; return m > U ? 0 : Math.max(0, m - lower); }
    const hi = Math.min(tmax, U), lo = Math.min(tmin, U);
    return Math.max(0, (hi + lo) / 2 - lower);
  }
  return sineDD(tmin, tmax, lower, U, cutoff);
}

/** Single sine, worked out over the rising half-cycle θ in [−π/2, π/2], where T = M + A sin θ. */
function sineDD(tmin: number, tmax: number, L: number, U: number, cutoff: Cutoff): number {
  if (tmax <= L) return 0;
  const M = (tmax + tmin) / 2, A = (tmax - tmin) / 2;
  if (A === 0) return M >= U ? (cutoff === 'horizontal' ? U - L : 0) : Math.max(0, M - L);
  const ang = (T: number) => (T <= tmin ? -Math.PI / 2 : T >= tmax ? Math.PI / 2 : Math.asin((T - M) / A));
  const t1 = ang(L), t2 = Number.isFinite(U) ? ang(U) : Math.PI / 2;
  // Between L and U: ∫ (M − L + A sin θ) dθ from θ1 to θ2.
  let s = (M - L) * (t2 - t1) + A * (Math.cos(t1) - Math.cos(t2));
  if (cutoff === 'horizontal' && Number.isFinite(U)) s += (U - L) * (Math.PI / 2 - t2);
  return Math.max(0, s / Math.PI);
}

export type Day = { date: string; tmin: number; tmax: number };
export type DDRow = Day & { dd: number; cum: number };

/** Daily and cumulative degree-days, counting from the first day on or after `start` (an ISO date, optional). */
export function accumulate(days: Day[], lower: number, upper: number | null, method: DDMethod, cutoff: Cutoff, start = ''): DDRow[] {
  let cum = 0;
  const out: DDRow[] = [];
  for (const d of days) {
    if (start && d.date < start) continue;
    const dd = dailyDD(d.tmin, d.tmax, lower, upper, method, cutoff);
    cum += dd;
    out.push({ ...d, dd, cum });
  }
  return out;
}

const DAY = 86400000;
export const addDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10);

/**
 * When the running total reaches `target`: the first day it is reached, or, if the data stop short,
 * a projection that assumes the coming days give the mean degree-days of the last `recent` days.
 */
export function predictDate(rows: DDRow[], target: number, recent = 7): { date: string; reached: boolean; perDay?: number; daysAhead?: number } | null {
  if (!rows.length || !(target > 0)) return null;
  const hit = rows.find((r) => r.cum >= target);
  if (hit) return { date: hit.date, reached: true };
  const last = rows.slice(-recent), perDay = last.reduce((s, r) => s + r.dd, 0) / last.length;
  if (!(perDay > 0)) return { date: '', reached: false, perDay: 0 };
  const left = target - rows[rows.length - 1].cum, daysAhead = Math.ceil(left / perDay - 1e-9);
  return { date: addDays(rows[rows.length - 1].date, daysAhead), reached: false, perDay, daysAhead };
}

/** A date as typed: 2026-05-01, 2026/5/1, 1/5/2026 (day first) or 5/1/2026 with `mdy`. ISO date or ''. */
export function readDate(s: string, mdy = false): string {
  const t = s.trim();
  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  let y: number, mo: number, d: number;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else if ((m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/))) { y = +m[3]; mo = mdy ? +m[1] : +m[2]; d = mdy ? +m[2] : +m[1]; }
  else return '';
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return '';
  return dt.toISOString().slice(0, 10);
}
