// Crude rates, risks and prevalence with intervals, and direct and indirect age standardisation.
// Plain functions, no DOM.
// Methods: exact Poisson limits for a count (Garwood 1936, Biometrika); Wilson (1927) and Clopper-Pearson
// (1934) intervals for proportions; directly standardised rate with the gamma interval of Fay and Feuer (1997,
// Stat Med 16:791) or a normal approximation; standardised mortality (or incidence) ratio with exact Poisson
// limits and an exact two-sided Poisson test (Breslow and Day 1987, IARC Sci Publ 82).
import { poissonCI, propCI, chi2Inv, gammaP, gammaQ, zFor, type CI, type PropMethod } from './epistat.ts';
import { logGamma } from './stats.ts';

export type Kind = 'rate' | 'risk' | 'prevalence';

/** A crude rate (events per person-time) or a proportion (risk, prevalence), scaled by `per`. */
export function crude(events: number, denom: number, kind: Kind, per = 1, conf = 0.95, method: PropMethod = 'wilson') {
  const est = events / denom;
  const ci: CI = kind === 'rate' ? (poissonCI(events, conf).map((x) => x / denom) as CI) : propCI(events, denom, method, conf);
  return { est: est * per, ci: [ci[0] * per, ci[1] * per] as CI };
}

export type DirectRow = { name: string; events: number; pop: number; std: number };
/** Directly standardised rate per `per`, with gamma (Fay-Feuer) or normal limits. */
export function direct(rows: DirectRow[], per = 1e5, conf = 0.95, method: 'gamma' | 'normal' = 'gamma') {
  const W = rows.reduce((s, r) => s + r.std, 0);
  const w = rows.map((r) => r.std / W);
  const dsr = rows.reduce((s, r, i) => s + (w[i] * r.events) / r.pop, 0);
  const v = rows.reduce((s, r, i) => s + (w[i] * w[i] * r.events) / (r.pop * r.pop), 0);
  const wm = Math.max(...rows.map((r, i) => w[i] / r.pop));
  const a = (1 - conf) / 2;
  let ci: CI;
  if (method === 'normal') { const z = zFor(conf), se = Math.sqrt(v); ci = [Math.max(0, dsr - z * se), dsr + z * se]; }
  else {
    const lo = dsr > 0 && v > 0 ? (v / (2 * dsr)) * chi2Inv(a, (2 * dsr * dsr) / v) : 0;
    const hi = ((v + wm * wm) / (2 * (dsr + wm))) * chi2Inv(1 - a, (2 * (dsr + wm) ** 2) / (v + wm * wm));
    ci = [lo, hi];
  }
  const events = rows.reduce((s, r) => s + r.events, 0), pop = rows.reduce((s, r) => s + r.pop, 0);
  return {
    dsr: dsr * per, ci: [ci[0] * per, ci[1] * per] as CI, se: Math.sqrt(v) * per,
    crude: (events / pop) * per, events, pop,
    groups: rows.map((r, i) => ({ ...r, weight: w[i], rate: (r.events / r.pop) * per, expected: (r.events / r.pop) * r.std })),
  };
}

/** Poisson P(X ≤ k) and P(X ≥ k) for mean mu. */
export function poissonTails(k: number, mu: number) {
  const le = k < 0 ? 0 : gammaQ(k + 1, mu); // P(X ≤ k) = Q(k + 1, mu)
  const ge = k <= 0 ? 1 : gammaP(k, mu); // P(X ≥ k) = P(k, mu)
  return { le, ge, pmf: k < 0 ? 0 : Math.exp(-mu + k * Math.log(mu) - logGamma(k + 1)) };
}

export type IndirectRow = { name: string; pop: number; rate: number };
/** SMR (observed / expected) with exact Poisson limits; `rate` is per `per`. */
export function indirect(rows: IndirectRow[], observed: number, per = 1e5, conf = 0.95) {
  const groups = rows.map((r) => ({ ...r, expected: (r.pop * r.rate) / per }));
  const E = groups.reduce((s, g) => s + g.expected, 0);
  const [l, u] = poissonCI(observed, conf);
  const t = poissonTails(observed, E);
  return { observed, expected: E, smr: observed / E, ci: [l / E, u / E] as CI, p: Math.min(1, 2 * Math.min(t.le, t.ge)), groups, excess: observed - E };
}
