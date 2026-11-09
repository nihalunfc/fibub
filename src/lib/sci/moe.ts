// Margin of exposure: point of departure (NOAEL, LOAEL or BMDL) divided by an estimated daily exposure, with
// exposure from concentration × intake ÷ body weight for several scenarios, and a target MOE built from the
// user's own uncertainty factors. Plain maths, no DOM.
import { parseTable, num } from './num.ts';

/** Unit factors: concentration in mg per kg (or mg per L), intake in kg (or L) per day, dose in mg/kg bw/day. */
export const CONC_UNITS: Record<string, number> = { 'mg/kg': 1, 'µg/kg': 1e-3, 'ng/g': 1e-3, 'mg/L': 1, 'µg/L': 1e-3 };
export const INTAKE_UNITS: Record<string, number> = { 'g/day': 1e-3, 'kg/day': 1, 'mL/day': 1e-3, 'L/day': 1 };
export const DOSE_UNITS: Record<string, number> = { 'mg/kg bw/day': 1, 'µg/kg bw/day': 1e-3 };

export interface Scenario { name: string; conc: number; intake: number; bw: number }
export interface Factor { name: string; value: number }
export interface ScenarioResult extends Scenario { exposure: number; moe: number; meets: boolean; maxConc: number }

/** Scenario rows: name, concentration, intake, body weight. A header row is skipped. */
export function parseScenarios(text: string): Scenario[] {
  const rows = parseTable(text), out: Scenario[] = [];
  rows.forEach((r, i) => {
    const vals = r.slice(1, 4).map(num);
    if (i === 0 && vals.some((v) => Number.isNaN(v)) && r.slice(1).some((c) => /[a-z]/i.test(c))) return; // header
    if (r.length < 4 || vals.some((v) => !Number.isFinite(v))) throw new Error(`Line ${i + 1} ("${r.join(' ').slice(0, 40)}") needs a name, then concentration, intake and body weight as numbers.`);
    const [conc, intake, bw] = vals;
    if (conc < 0 || intake < 0) throw new Error(`Line ${i + 1}: concentration and intake cannot be negative.`);
    if (!(bw > 0)) throw new Error(`Line ${i + 1}: body weight must be above zero.`);
    out.push({ name: r[0] || `Scenario ${out.length + 1}`, conc, intake, bw });
  });
  if (!out.length) throw new Error('Add at least one scenario: a name, concentration, intake and body weight.');
  if (out.length > 200) throw new Error('Up to 200 scenarios, please.');
  return out;
}

/** Uncertainty factors, one per line: a name and a number ("Between species, 10"). */
export function parseFactors(text: string): Factor[] {
  const out: Factor[] = [];
  text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).forEach((l, i) => {
    const m = /^(.*?)[\s,;:\t=×x]*([-+]?[\d.,]+(?:e[-+]?\d+)?)\s*$/i.exec(l);
    const v = m ? num(m[2]) : NaN;
    if (!m || !Number.isFinite(v)) throw new Error(`Factor line ${i + 1} ("${l.slice(0, 40)}") needs a name and a number, such as "Between species, 10".`);
    if (!(v >= 1)) throw new Error(`Factor line ${i + 1}: a factor should be 1 or more.`);
    out.push({ name: m[1].trim() || `Factor ${i + 1}`, value: v });
  });
  return out;
}

export const exposure = (conc: number, intake: number, bw: number) => (conc * intake) / bw;

export function marginOfExposure(pod: number, sc: Scenario[], target: number, u: { conc: string; intake: string; dose: string }) {
  if (!(pod > 0)) throw new Error('Enter the point of departure as a number above zero.');
  if (!(target >= 1)) throw new Error('The target MOE (product of the factors) should be 1 or more.');
  const cf = CONC_UNITS[u.conc], inf = INTAKE_UNITS[u.intake], df = DOSE_UNITS[u.dose];
  if (!cf || !inf || !df) throw new Error('Unknown unit.');
  const podMg = pod * df;
  const rows: ScenarioResult[] = sc.map((s) => {
    const e = exposure(s.conc * cf, s.intake * inf, s.bw); // mg/kg bw/day
    const moe = e > 0 ? podMg / e : Infinity;
    // Concentration (in the user's unit) at which this scenario would just meet the target.
    const maxConc = s.intake > 0 ? ((podMg / target) * s.bw) / (s.intake * inf) / cf : Infinity;
    return { ...s, exposure: e / df, moe, meets: moe >= target, maxConc };
  });
  return { rows, target, tolerable: pod / target, lowest: rows.reduce((a, b) => (b.moe < a.moe ? b : a)) };
}
