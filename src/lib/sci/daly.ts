// DALYs, QALYs and cost-effectiveness ratios for teaching.
// DALY = YLL + YLD: Murray (1994), Bulletin of the World Health Organization 72: 429-445; Murray and Lopez (1996),
// The Global Burden of Disease. Continuous discounting without age weighting, ∫ e^(−rt) dt = (1 − e^(−rL)) / r:
// Fox-Rushby and Hanson (2001), Health Policy and Planning 16: 326-331. QALYs and the ICER: Drummond et al. (2015),
// Methods for the Economic Evaluation of Health Care Programmes, 4th ed., Oxford University Press.
import { num } from './num.ts';

/** Discounted length of a stretch of time from `start` to `start + years`, at continuous rate r (0.03 = 3 %). */
export function disc(years: number, r: number, start = 0): number {
  if (!(years > 0)) return 0;
  if (!(r > 0)) return years;
  return (Math.exp(-r * start) - Math.exp(-r * (start + years))) / r;
}

export type BurdenRow = { name: string; deaths: number; yearsLost: number; cases: number; weight: number; duration: number };
export type BurdenOut = BurdenRow & { yll: number; yld: number; daly: number };

export function burden(rows: BurdenRow[], r: number): { rows: BurdenOut[]; yll: number; yld: number; daly: number } {
  const out = rows.map((b) => {
    const yll = b.deaths * disc(b.yearsLost, r), yld = b.cases * b.weight * disc(b.duration, r);
    return { ...b, yll, yld, daly: yll + yld };
  });
  const sum = (k: 'yll' | 'yld' | 'daly') => out.reduce((s, o) => s + o[k], 0);
  return { rows: out, yll: sum('yll'), yld: sum('yld'), daly: sum('daly') };
}

/** Read burden rows: name, deaths, years lost per death, cases, disability weight, years lived with it. */
export function parseBurden(table: string[][]): { rows: BurdenRow[]; error: string | null } {
  const rows: BurdenRow[] = [];
  for (const r of table) {
    if (!r.length || r.every((c) => !c.trim())) continue;
    const v = r.slice(1, 6).map((c) => num(c));
    if (v.length < 5 || v.some((x) => !Number.isFinite(x))) {
      if (!rows.length && v.some((x) => !Number.isFinite(x))) continue; // a header line
      return { rows, error: `Could not read the row "${r.join(', ')}". Each row needs a name and five numbers.` };
    }
    const [deaths, yearsLost, cases, weight, duration] = v;
    if (deaths < 0 || yearsLost < 0 || cases < 0 || duration < 0) return { rows, error: `"${r[0]}": numbers cannot be negative.` };
    if (weight < 0 || weight > 1) return { rows, error: `"${r[0]}": the disability weight must be from 0 (full health) to 1 (as bad as death).` };
    rows.push({ name: r[0].trim() || `Row ${rows.length + 1}`, deaths, yearsLost, cases, weight, duration });
  }
  if (!rows.length) return { rows, error: 'Add at least one row: a name and five numbers.' };
  if (rows.length > 200) return { rows, error: 'Up to 200 rows.' };
  return { rows, error: null };
}

export type Stage = { utility: number; years: number; weight?: number };
export type ArmOut = { qaly: number; daly: number; years: number; undiscountedQaly: number };

/**
 * QALYs and DALYs for one arm, from a health profile of consecutive stages (utility, years), after which the person
 * dies. DALYs are the gap to full health up to the horizon: the stage's disability weight for each year lived (1 − utility
 * when no weight is given, a teaching simplification), plus every year from death to the horizon.
 */
export function arm(stages: Stage[], r: number, horizon: number): ArmOut {
  let t = 0, qaly = 0, daly = 0, und = 0;
  for (const s of stages) {
    const d = disc(s.years, r, t);
    qaly += s.utility * d; daly += (s.weight ?? 1 - s.utility) * d; und += s.utility * s.years; t += s.years;
  }
  if (horizon > t) daly += disc(horizon - t, r, t);
  return { qaly, daly, years: t, undiscountedQaly: und };
}

export function parseStages(text: string): { stages: Stage[]; error: string | null } {
  const stages: Stage[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const l = raw.trim(); if (!l || l.startsWith('#')) continue;
    const p = l.split(/[\s,;\t]+/).filter(Boolean).map(num);
    if (p.length < 2 || p.length > 3 || p.some((x) => !Number.isFinite(x))) return { stages, error: `Could not read "${l}". Write: utility, years, and optionally a disability weight.` };
    const [utility, years, weight] = p;
    if (weight !== undefined && (weight < 0 || weight > 1)) return { stages, error: `"${l}": the disability weight must be from 0 to 1.` };
    if (utility > 1 || utility < -1) return { stages, error: `"${l}": utility must be from −1 to 1 (1 = full health, 0 = dead).` };
    if (!(years > 0)) return { stages, error: `"${l}": years must be above 0.` };
    stages.push(weight === undefined ? { utility, years } : { utility, years, weight });
  }
  if (!stages.length) return { stages, error: 'Add at least one stage: utility, years.' };
  return { stages, error: null };
}

export type Quadrant = 'dominant' | 'dominated' | 'more-cost-more-effect' | 'less-cost-less-effect' | 'no-difference';
export type Icer = { dCost: number; dQaly: number; dDaly: number; perQaly: number; perDaly: number; quadrant: Quadrant; nmb?: number };

/** Incremental cost-effectiveness: new arm (1) against the comparator (0). DALYs averted = DALY0 − DALY1. */
export function icer(cost0: number, a0: ArmOut, cost1: number, a1: ArmOut, wtp?: number): Icer {
  const dCost = cost1 - cost0, dQaly = a1.qaly - a0.qaly, dDaly = a0.daly - a1.daly;
  const eps = 1e-12;
  const quadrant: Quadrant = Math.abs(dQaly) < eps ? 'no-difference'
    : dQaly > 0 ? (dCost <= 0 ? 'dominant' : 'more-cost-more-effect')
    : (dCost >= 0 ? 'dominated' : 'less-cost-less-effect');
  const out: Icer = { dCost, dQaly, dDaly, perQaly: Math.abs(dQaly) < eps ? NaN : dCost / dQaly, perDaly: Math.abs(dDaly) < eps ? NaN : dCost / dDaly, quadrant };
  if (wtp !== undefined && Number.isFinite(wtp)) out.nmb = wtp * dQaly - dCost;
  return out;
}
