// Growth curves from weigh records: average daily gain per interval, and Gompertz, logistic and von Bertalanffy
// curves fitted by nonlinear least squares (Levenberg-Marquardt), with body condition score trend. No DOM.
import { levenbergMarquardt, fitLine, type NlFit } from './fit.ts';
import { dayOf, iso } from './breeding.ts';

export type Rec = { animal: string; t: number; date?: string; w: number; bcs?: number };
export type ModelId = 'gompertz' | 'logistic' | 'vonb';
/** W(t) with p = [A, b, k]: A is the mature (asymptotic) weight, k the rate per day, b sets the start. */
export const MODELS: Record<ModelId, { name: string; formula: string; f: (t: number, p: number[]) => number; b0: (A: number, w0: number) => number; infl: (p: number[]) => { t: number; w: number } }> = {
  gompertz: { name: 'Gompertz', formula: 'W = A·exp(−b·e^(−k·t))', f: (t, [A, b, k]) => A * Math.exp(-b * Math.exp(-k * t)), b0: (A, w0) => Math.log(A / w0), infl: ([A, b, k]) => ({ t: Math.log(b) / k, w: A / Math.E }) },
  logistic: { name: 'Logistic', formula: 'W = A / (1 + b·e^(−k·t))', f: (t, [A, b, k]) => A / (1 + b * Math.exp(-k * t)), b0: (A, w0) => A / w0 - 1, infl: ([A, b, k]) => ({ t: Math.log(b) / k, w: A / 2 }) },
  vonb: { name: 'von Bertalanffy', formula: 'W = A·(1 − b·e^(−k·t))³', f: (t, [A, b, k]) => A * (1 - b * Math.exp(-k * t)) ** 3, b0: (A, w0) => 1 - Math.cbrt(w0 / A), infl: ([A, b, k]) => ({ t: Math.log(3 * b) / k, w: (8 / 27) * A }) },
};

export type Fit = { model: ModelId; A: number; b: number; k: number; se: number[]; sse: number; rse: number; r2: number; aic: number; n: number; inflT: number; inflW: number; converged: boolean };

/** Fits one model, trying a few starting values and keeping the best. Throws if fewer than 4 points. */
export function fitGrowth(t: number[], w: number[], model: ModelId): Fit {
  const n = t.length;
  if (n < 4) throw new Error('Need at least 4 weighings to fit a growth curve.');
  const M = MODELS[model];
  const wMax = Math.max(...w), i0 = t.indexOf(Math.min(...t)), w0 = Math.max(w[i0], wMax * 1e-3), span = Math.max(...t) - Math.min(...t) || 1;
  let best: NlFit | null = null;
  for (const aF of [1.1, 1.5, 2.5]) for (const kF of [1, 3, 8]) {
    const A = wMax * aF, k = kF / span, tmin = t[i0];
    // Start b so the curve passes near the first point: b' = b0·e^(k·tmin).
    const b = M.b0(A, w0) * Math.exp(k * tmin);
    if (!(b > 0) || !Number.isFinite(b)) continue;
    try {
      const f = levenbergMarquardt(M.f, t, w, [A, b, k], { maxIter: 400 });
      if (f.p.every(Number.isFinite) && f.p[0] > 0 && f.p[2] > 0 && (!best || f.sse < best.sse)) best = f;
    } catch { /* try the next start */ }
  }
  if (!best) throw new Error(`The ${M.name} curve could not be fitted to these weights.`);
  const [A, b, k] = best.p, infl = M.infl(best.p);
  return { model, A, b, k, se: best.se, sse: best.sse, rse: best.s, r2: best.r2, aic: n * Math.log(best.sse / n) + 2 * 4, n, inflT: infl.t, inflW: infl.w, converged: best.converged };
}

export type Gain = { animal: string; from: number; to: number; days: number; gain: number; adg: number; fromDate?: string; toDate?: string };
/** Average daily gain between successive weighings of each animal (kg/day if weights are kg). */
export function gains(recs: Rec[]): Gain[] {
  const out: Gain[] = [];
  for (const a of animals(recs)) {
    const r = recs.filter((x) => x.animal === a).sort((p, q) => p.t - q.t);
    for (let i = 1; i < r.length; i++) {
      const days = r[i].t - r[i - 1].t; if (days <= 0) continue;
      out.push({ animal: a, from: r[i - 1].t, to: r[i].t, days, gain: r[i].w - r[i - 1].w, adg: (r[i].w - r[i - 1].w) / days, fromDate: r[i - 1].date, toDate: r[i].date });
    }
  }
  return out;
}
export const animals = (recs: Rec[]) => [...new Set(recs.map((r) => r.animal))];

/** BCS trend: straight line through the scores, slope per 30 days. Null with fewer than 3 scores. */
export function bcsTrend(recs: Rec[]) {
  const r = recs.filter((x) => x.bcs !== undefined && Number.isFinite(x.bcs));
  if (r.length < 3 || new Set(r.map((x) => x.t)).size < 2) return null;
  const f = fitLine(r.map((x) => x.t), r.map((x) => x.bcs!));
  return { per30: f.slope * 30, slope: f.slope, intercept: f.intercept, n: r.length, first: Math.min(...r.map((x) => x.t)), last: Math.max(...r.map((x) => x.t)) };
}

/**
 * Weigh records from rows: animal, date (2026-03-14) or age in days, weight, and optional body condition score.
 * With dates, t is days since that animal's first weighing; with numbers it is the age you give.
 */
export function readRecords(rows: string[][], num: (s: string) => number): { recs: Rec[]; errors: string[]; byDate: boolean } {
  const errors: string[] = [], raw: { animal: string; d: number; date?: string; w: number; bcs?: number }[] = [];
  let byDate: boolean | null = null;
  rows.forEach((r, k) => {
    if (k === 0 && Number.isNaN(num(r[2] ?? '')) && Number.isNaN(dayOf(r[1] ?? '')) && Number.isNaN(num(r[1] ?? ''))) return; // header
    if (r.length < 3) { errors.push(`Row ${k + 1}: give the animal, the date (or age in days) and the weight.`); return; }
    const asDay = dayOf(r[1]), asNum = num(r[1]), w = num(r[2]), bcs = r[3] !== undefined && r[3] !== '' ? num(r[3]) : undefined;
    const isDate = !Number.isNaN(asDay);
    if (!isDate && Number.isNaN(asNum)) { errors.push(`Row ${k + 1}: "${r[1]}" is neither a date (2026-03-14) nor an age in days.`); return; }
    if (byDate === null) byDate = isDate;
    if (byDate !== isDate) { errors.push(`Row ${k + 1}: mix of dates and ages; use one or the other.`); return; }
    if (!(w > 0)) { errors.push(`Row ${k + 1}: the weight must be a number above 0.`); return; }
    if (bcs !== undefined && Number.isNaN(bcs)) { errors.push(`Row ${k + 1}: the body condition score "${r[3]}" is not a number.`); return; }
    raw.push({ animal: r[0] || 'Animal', d: isDate ? asDay : asNum, date: isDate ? iso(asDay) : undefined, w, bcs });
  });
  const first = new Map<string, number>();
  for (const r of raw) first.set(r.animal, Math.min(first.get(r.animal) ?? Infinity, r.d));
  const recs = raw.map((r) => ({ animal: r.animal, t: byDate ? r.d - first.get(r.animal)! : r.d, date: r.date, w: r.w, bcs: r.bcs }));
  return { recs, errors, byDate: !!byDate };
}

/** Made-up weigh records for two calves (typed by fibub to look like a growing calf; not real animals). */
export const EXAMPLE = `Animal, Date, Weight kg, BCS
Calf 41, 2025-03-01, 42, 3.0
Calf 41, 2025-04-15, 83, 3.0
Calf 41, 2025-06-01, 128, 3.25
Calf 41, 2025-07-20, 172, 3.25
Calf 41, 2025-09-05, 214, 3.0
Calf 41, 2025-10-25, 258, 3.0
Calf 41, 2025-12-15, 296, 2.75
Calf 41, 2026-02-01, 330, 2.75
Calf 41, 2026-03-20, 365, 3.0
Calf 41, 2026-05-10, 398, 3.25
Calf 41, 2026-07-01, 420, 3.25
Calf 41, 2026-08-20, 444, 3.5
Calf 52, 2025-03-10, 39, 3.0
Calf 52, 2025-05-01, 85, 3.0
Calf 52, 2025-06-20, 126, 3.25
Calf 52, 2025-08-10, 171, 3.0
Calf 52, 2025-10-01, 215, 3.0
Calf 52, 2025-11-20, 249, 2.75
Calf 52, 2026-01-15, 287, 2.75
Calf 52, 2026-03-05, 322, 3.0
Calf 52, 2026-04-25, 352, 3.0
Calf 52, 2026-06-15, 381, 3.25
Calf 52, 2026-08-05, 404, 3.25`;
