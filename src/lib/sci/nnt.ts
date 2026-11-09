// Number needed to treat (or harm) from events and totals in a treated and a control group, with the risk
// difference, relative risk, relative risk reduction and their intervals. Plain functions, no DOM.
// Methods: Wald and Newcombe hybrid score (method 10; Newcombe 1998, Stat Med 17:873) intervals for the
// risk difference; log method for the relative risk (Katz et al. 1978, Biometrics); NNT = 1/|ARR| with
// limits from the risk difference limits (Laupacis, Sackett and Roberts 1988, N Engl J Med 318:1728), shown
// as "NNTB x to ∞ to NNTH y" when the interval for the difference includes zero (Altman 1998, BMJ 317:1309);
// patient-specific NNT = 1/(baseline risk × RRR) (Straus and Sackett, Evidence-Based Medicine).
import { wilson, zFor, logCI, chi2x2, type CI } from './epistat.ts';

export type RDMethod = 'wald' | 'newcombe';
export type NNTInterval =
  | { kind: 'benefit' | 'harm'; lo: number; hi: number }
  | { kind: 'cross'; nntb: number; nnth: number };

/** Risk difference limits, treated (x1 of n1) minus control (x2 of n2). */
export function rdCI(x1: number, n1: number, x2: number, n2: number, method: RDMethod = 'newcombe', conf = 0.95): CI {
  const p1 = x1 / n1, p2 = x2 / n2, d = p1 - p2;
  if (method === 'wald') { const z = zFor(conf), se = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2); return [d - z * se, d + z * se]; }
  const [l1, u1] = wilson(x1, n1, conf), [l2, u2] = wilson(x2, n2, conf);
  return [d - Math.sqrt((p1 - l1) ** 2 + (u2 - p2) ** 2), d + Math.sqrt((u1 - p1) ** 2 + (p2 - l2) ** 2)];
}

/**
 * NNT and its interval from a risk change toward benefit (positive = benefit) and its limits.
 * `ben` is the absolute benefit (ARR for a harmful outcome, ABI for a good one).
 */
export function nntFrom(ben: number, ci: CI): { nnt: number; kind: 'benefit' | 'harm' | 'none'; ci: NNTInterval } {
  const kind = ben > 0 ? 'benefit' : ben < 0 ? 'harm' : 'none';
  const [L, U] = ci;
  let iv: NNTInterval;
  if (L > 0) iv = { kind: 'benefit', lo: 1 / U, hi: 1 / L };
  else if (U < 0) iv = { kind: 'harm', lo: 1 / -L, hi: 1 / -U };
  else iv = { kind: 'cross', nntb: U > 0 ? 1 / U : Infinity, nnth: L < 0 ? 1 / -L : Infinity };
  return { nnt: ben === 0 ? Infinity : 1 / Math.abs(ben), kind, ci: iv };
}

/**
 * Everything for a two-group comparison. `outcome` says whether the event is bad (death, relapse) or good
 * (cure): for a bad event a fall in risk is a benefit, for a good event a rise is.
 */
export function compare(x1: number, n1: number, x2: number, n2: number, opts: { outcome?: 'bad' | 'good'; method?: RDMethod; conf?: number } = {}) {
  const { outcome = 'bad', method = 'newcombe', conf = 0.95 } = opts;
  const p1 = x1 / n1, p2 = x2 / n2, rd = p1 - p2, rdLim = rdCI(x1, n1, x2, n2, method, conf);
  const rr = p1 / p2, seLogRR = Math.sqrt(1 / x1 - 1 / n1 + 1 / x2 - 1 / n2);
  const rrLim: CI = x1 > 0 && x2 > 0 && Number.isFinite(seLogRR) ? logCI(rr, seLogRR, conf) : [NaN, NaN];
  const rrr = 1 - rr, rrrLim: CI = [1 - rrLim[1], 1 - rrLim[0]];
  const or = (x1 * (n2 - x2)) / (x2 * (n1 - x1)), seLogOR = Math.sqrt(1 / x1 + 1 / (n1 - x1) + 1 / x2 + 1 / (n2 - x2));
  const orLim: CI = Number.isFinite(seLogOR) && or > 0 && Number.isFinite(or) ? logCI(or, seLogOR, conf) : [NaN, NaN];
  // Benefit on the absolute scale: ARR = control − treated for a bad outcome, treated − control for a good one.
  const sign = outcome === 'bad' ? -1 : 1, ben = sign * rd, benLim: CI = sign > 0 ? rdLim : [-rdLim[1], -rdLim[0]];
  const chi = chi2x2(x1, n1 - x1, x2, n2 - x2);
  return { p1, p2, p1CI: wilson(x1, n1, conf), p2CI: wilson(x2, n2, conf), rd, rdCI: rdLim, rr, rrCI: rrLim, rrr, rrrCI: rrrLim, or, orCI: orLim, ben, benCI: benLim, nnt: nntFrom(ben, benLim), chi2: chi.chi2, p: chi.p };
}

/** NNT for a patient whose baseline (untreated) risk differs from the control group, from the RRR and its limits. */
export function patientNNT(baseline: number, rrr: number, rrrCI: CI, outcome: 'bad' | 'good' = 'bad') {
  // For a bad outcome the risk falls by baseline × RRR; for a good one it rises by baseline × (RR − 1) = −baseline × RRR.
  const s = outcome === 'bad' ? 1 : -1, ben = s * baseline * rrr;
  const lims = [s * baseline * rrrCI[0], s * baseline * rrrCI[1]].sort((a, b) => a - b) as CI;
  return { ben, ...nntFrom(ben, lims) };
}
