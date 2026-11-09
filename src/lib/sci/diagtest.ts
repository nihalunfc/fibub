// Diagnostic test accuracy from a 2 × 2 table (test result against the true condition), or from a
// sensitivity, specificity and prevalence, plus Bayes' theorem from pre-test to post-test probability
// and the geometry of Fagan's nomogram. Plain functions, no DOM.
// Methods: Altman and Bland (1994, BMJ) for sensitivity, specificity and predictive values;
// likelihood ratio limits by the log method of Simel, Samsa and Matchar (1991, J Clin Epidemiol);
// diagnostic odds ratio by Woolf's log method (Glas et al. 2003, J Clin Epidemiol); Youden (1950);
// Fagan (1975, N Engl J Med) for the nomogram.
import { propCI, logCI, type CI, type PropMethod } from './epistat.ts';

export type Measure = { key: string; name: string; est: number; ci: CI; kind: 'prop' | 'ratio' | 'diff' };

/** Measures from TP (a), FP (b), FN (c) and TN (d). */
export function fromTable(a: number, b: number, c: number, d: number, method: PropMethod = 'exact', conf = 0.95) {
  const n = a + b + c + d, dis = a + c, healthy = b + d;
  const p = (x: number, m: number, key: string, name: string): Measure => ({ key, name, est: m > 0 ? x / m : NaN, ci: m > 0 ? propCI(x, m, method, conf) : [NaN, NaN], kind: 'prop' });
  const sens = dis > 0 ? a / dis : NaN, spec = healthy > 0 ? d / healthy : NaN;
  const lrp = sens / (1 - spec), lrn = (1 - sens) / spec;
  const seP = Math.sqrt(1 / a - 1 / dis + 1 / b - 1 / healthy), seN = Math.sqrt(1 / c - 1 / dis + 1 / d - 1 / healthy);
  const dor = (a * d) / (b * c), seD = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
  const ratio = (est: number, se: number, key: string, name: string): Measure => ({ key, name, est, ci: Number.isFinite(est) && est > 0 && Number.isFinite(se) ? logCI(est, se, conf) : [NaN, NaN], kind: 'ratio' });
  const list: Measure[] = [
    p(a, dis, 'sens', 'Sensitivity'),
    p(d, healthy, 'spec', 'Specificity'),
    p(a, a + b, 'ppv', 'Positive predictive value'),
    p(d, c + d, 'npv', 'Negative predictive value'),
    ratio(lrp, seP, 'lrp', 'Positive likelihood ratio'),
    ratio(lrn, seN, 'lrn', 'Negative likelihood ratio'),
    p(a + d, n, 'acc', 'Accuracy'),
    p(dis, n, 'prev', 'Prevalence in this sample'),
    ratio(dor, seD, 'dor', 'Diagnostic odds ratio'),
    { key: 'youden', name: "Youden's index", est: sens + spec - 1, ci: [NaN, NaN], kind: 'diff' },
  ];
  return { n, list, get: (k: string) => list.find((m) => m.key === k)! };
}

/** Predictive values and likelihood ratios from sensitivity, specificity and prevalence (all 0 to 1). */
export function fromRates(sens: number, spec: number, prev: number, per = 1000) {
  const tp = sens * prev, fp = (1 - spec) * (1 - prev), fn = (1 - sens) * prev, tn = spec * (1 - prev);
  return {
    ppv: tp / (tp + fp), npv: tn / (tn + fn), lrp: sens / (1 - spec), lrn: (1 - sens) / spec, youden: sens + spec - 1,
    // Expected people in a group of `per`.
    tp: tp * per, fp: fp * per, fn: fn * per, tn: tn * per,
  };
}

/** Post-test probability from a pre-test probability (0 to 1) and a likelihood ratio. */
export function postTest(pre: number, lr: number) {
  if (pre <= 0) return 0;
  if (pre >= 1) return 1;
  const odds = (pre / (1 - pre)) * lr;
  return Number.isFinite(odds) ? odds / (1 + odds) : 1;
}

const logit = (p: number) => Math.log(p / (1 - p));
/**
 * Fagan's nomogram: three parallel scales. On the left, pre-test probability at height −logit(p);
 * in the middle, the likelihood ratio at ln(LR)/2; on the right, post-test probability at logit(p).
 * A straight line through the pre-test point and the LR then meets the post-test probability.
 */
export const fagan = {
  left: (p: number) => -logit(p),
  mid: (lr: number) => Math.log(lr) / 2,
  right: (p: number) => logit(p),
};
