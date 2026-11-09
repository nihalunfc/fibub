// Occupational exposure averages for teaching: 8-hour time-weighted average from sampled periods, the highest
// 15-minute average (for a STEL), an excursion check, and reduced limits for long shifts (Brief and Scala;
// the OSHA model). Times in minutes, concentrations in any one unit (ppm or mg/m³). Plain maths, no DOM.
import { parseTable, num } from './num.ts';

export interface Period { start: number; end: number; conc: number; label: string }

const TIME = /^(\d{1,2})[:h.](\d{2})$/;
const toMin = (s: string) => { const m = TIME.exec(s.trim()); if (!m) return NaN; const h = +m[1], mi = +m[2]; return h <= 24 && mi < 60 ? h * 60 + mi : NaN; };
export const clock = (min: number) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

/**
 * Sampled periods, one per line: either "start end concentration [note]" with clock times (07:00 09:30 12),
 * or "minutes concentration [note]" for back-to-back periods. A header line is skipped.
 */
export function parsePeriods(text: string): { periods: Period[]; clockTimes: boolean } {
  const rows = parseTable(text), out: Period[] = [];
  let mode: 'clock' | 'dur' | null = null, t = 0, offset = 0, lastEnd = -Infinity;
  rows.forEach((r, i) => {
    const isClock = r.length >= 3 && Number.isFinite(toMin(r[0])) && Number.isFinite(toMin(r[1]));
    const isDur = !isClock && r.length >= 2 && Number.isFinite(num(r[0])) && Number.isFinite(num(r[1]));
    if (!isClock && !isDur) {
      if (i === 0 && /[a-z]/i.test(r.join(''))) return; // header
      throw new Error(`Line ${i + 1} ("${r.join(' ').slice(0, 40)}") should be "start end concentration" (07:00 09:30 12) or "minutes concentration" (150 12).`);
    }
    const m = isClock ? 'clock' : 'dur';
    if (mode && m !== mode) throw new Error(`Line ${i + 1}: use clock times on every line, or minutes on every line, not both.`);
    mode = m;
    if (isClock) {
      const c = num(r[2]);
      if (!Number.isFinite(c)) throw new Error(`Line ${i + 1}: the concentration is not a number.`);
      let a = toMin(r[0]) + offset, b = toMin(r[1]) + offset;
      if (a < lastEnd - 720) { a += 1440; b += 1440; offset += 1440; } // a new day after midnight
      if (b <= a) b += 1440; // this period crosses midnight
      if (a < lastEnd) throw new Error(`Line ${i + 1}: this period starts before the previous one ends.`);
      if (c < 0) throw new Error(`Line ${i + 1}: a concentration cannot be negative.`);
      out.push({ start: a, end: b, conc: c, label: r.slice(3).join(' ') });
      lastEnd = b;
    } else {
      const d = num(r[0]), c = num(r[1]);
      if (!(d > 0)) throw new Error(`Line ${i + 1}: the duration must be above zero minutes.`);
      if (c < 0) throw new Error(`Line ${i + 1}: a concentration cannot be negative.`);
      out.push({ start: t, end: t + d, conc: c, label: r.slice(2).join(' ') });
      t += d;
    }
  });
  if (!out.length) throw new Error('Add at least one sampled period.');
  if (out.length > 500) throw new Error('Up to 500 periods, please.');
  return { periods: out, clockTimes: mode === 'clock' };
}

/** Highest average over any window of `w` minutes, gaps counting as zero. Exact for step-shaped profiles. */
export function maxWindowAverage(p: Period[], w = 15): { avg: number; start: number } {
  const t0 = Math.min(...p.map((x) => x.start)), t1 = Math.max(...p.map((x) => x.end));
  const integral = (a: number, b: number) => p.reduce((s, x) => s + x.conc * Math.max(0, Math.min(b, x.end) - Math.max(a, x.start)), 0);
  if (t1 - t0 <= w) return { avg: integral(t0, t1) / w, start: t0 };
  const cand = new Set<number>();
  for (const x of p) for (const b of [x.start, x.end]) for (const s of [b, b - w]) cand.add(Math.min(t1 - w, Math.max(t0, s)));
  let best = { avg: -Infinity, start: t0 };
  for (const s of cand) { const a = integral(s, s + w) / w; if (a > best.avg + 1e-12) best = { avg: a, start: s }; }
  return best;
}

export type Model = 'none' | 'bs-daily' | 'bs-weekly' | 'osha-daily' | 'osha-weekly';
export const MODEL_NAMES: Record<Model, string> = { 'none': 'No adjustment', 'bs-daily': 'Brief and Scala, daily', 'bs-weekly': 'Brief and Scala, weekly', 'osha-daily': 'OSHA model, daily (8 ÷ h)', 'osha-weekly': 'OSHA model, weekly (40 ÷ h)' };
/** Reduction factor for a limit set for 8 h a day, 40 h a week; never above 1. */
export function reductionFactor(model: Model, hoursPerDay: number, hoursPerWeek: number): number {
  let rf = 1;
  if (model === 'bs-daily') rf = (8 / hoursPerDay) * ((24 - hoursPerDay) / 16);
  if (model === 'bs-weekly') rf = (40 / hoursPerWeek) * ((168 - hoursPerWeek) / 128);
  if (model === 'osha-daily') rf = 8 / hoursPerDay;
  if (model === 'osha-weekly') rf = 40 / hoursPerWeek;
  return Math.min(1, rf);
}

export interface TwaOptions {
  shiftHours: number; unsampled: 'zero' | 'average';
  limit?: number; stel?: number;
  excursion?: { times: number; minutes: number; never: number };
  model?: Model; hoursPerWeek?: number;
}
export interface TwaResult {
  sampledMin: number; dose: number; sampledAvg: number; unsampledMin: number;
  twa8: number; shiftAvg: number; peak: number; stel15: { avg: number; start: number }; shortSamples: boolean;
  rf: number; adjLimit: number | null;
  verdicts: { name: string; value: number; limit: number; ratio: number; ok: boolean }[];
  excursion: { aboveMin: number; maxRatio: number; ok: boolean; text: string } | null;
  notes: string[];
}

export function exposureTwa(p: Period[], o: TwaOptions): TwaResult {
  if (!(o.shiftHours > 0 && o.shiftHours <= 24)) throw new Error('The shift length should be between 0 and 24 hours.');
  const shiftMin = o.shiftHours * 60;
  const sampledMin = p.reduce((s, x) => s + (x.end - x.start), 0);
  if (sampledMin > shiftMin + 1e-9) throw new Error(`The sampled periods add up to ${+(sampledMin / 60).toFixed(2)} h, longer than the ${o.shiftHours} h shift. Make the shift longer.`);
  const dose = p.reduce((s, x) => s + x.conc * (x.end - x.start), 0);
  const sampledAvg = dose / sampledMin, unsampledMin = shiftMin - sampledMin;
  const total = dose + (o.unsampled === 'average' ? sampledAvg * unsampledMin : 0);
  const twa8 = total / 480, shiftAvg = total / shiftMin;
  const peak = Math.max(...p.map((x) => x.conc));
  const stel15 = maxWindowAverage(p, 15);
  const shortSamples = p.some((x) => x.end - x.start <= 15);
  const notes: string[] = [];
  if (!shortSamples) notes.push('Every sample is longer than 15 minutes, so the 15-minute figure is the highest of these averages; a real 15-minute peak inside a sample could be higher. Take short samples during peak tasks.');
  if (unsampledMin > 0) notes.push(o.unsampled === 'zero' ? `${+(unsampledMin).toFixed(1)} minutes of the shift were not sampled and count as zero exposure. Use this only if there truly was no exposure then.` : `${+(unsampledMin).toFixed(1)} minutes of the shift were not sampled and are assumed to be at the sampled average (${+sampledAvg.toPrecision(4)}).`);

  const model = o.model ?? 'none', hpw = o.hoursPerWeek ?? o.shiftHours * 5;
  if (!(hpw > 0 && hpw <= 168)) throw new Error('Hours per week should be between 0 and 168.');
  const rf = model === 'none' ? 1 : reductionFactor(model, o.shiftHours, hpw);
  const verdicts: TwaResult['verdicts'] = [];
  let adjLimit: number | null = null;
  if (o.limit !== undefined) {
    if (!(o.limit > 0)) throw new Error('The 8-hour limit must be above zero.');
    verdicts.push({ name: '8-hour TWA', value: twa8, limit: o.limit, ratio: twa8 / o.limit, ok: twa8 <= o.limit });
    if (model !== 'none') {
      adjLimit = o.limit * rf;
      verdicts.push({ name: `Shift average (${o.shiftHours} h), adjusted limit`, value: shiftAvg, limit: adjLimit, ratio: shiftAvg / adjLimit, ok: shiftAvg <= adjLimit });
    }
  }
  if (o.stel !== undefined) {
    if (!(o.stel > 0)) throw new Error('The short-term limit must be above zero.');
    verdicts.push({ name: '15-minute peak, STEL', value: stel15.avg, limit: o.stel, ratio: stel15.avg / o.stel, ok: stel15.avg <= o.stel });
  }
  let excursion: TwaResult['excursion'] = null;
  if (o.limit !== undefined && o.excursion) {
    const { times, minutes, never } = o.excursion;
    if (!(times >= 1 && never >= times && minutes >= 0)) throw new Error('Excursion rule: the multiples should be 1 or more, with the "never above" multiple at least as big.');
    const aboveMin = p.filter((x) => x.conc > times * o.limit!).reduce((s, x) => s + x.end - x.start, 0);
    const maxRatio = peak / o.limit;
    const ok = aboveMin <= minutes && maxRatio <= never;
    excursion = { aboveMin, maxRatio, ok, text: `${+aboveMin.toFixed(1)} min above ${times} × the limit (allowed ${minutes} min); highest level ${+maxRatio.toFixed(2)} × the limit (never above ${never} ×).` };
  }
  return { sampledMin, dose, sampledAvg, unsampledMin, twa8, shiftAvg, peak, stel15, shortSamples, rf, adjLimit, verdicts, excursion, notes };
}
