// Mark-recapture population estimates for a closed population: Lincoln-Petersen, Chapman's correction with
// Seber's variance, three kinds of confidence interval, and the Schnabel estimator for several occasions.
import { normInv, tInv } from './stats.ts';
import { poissonCI } from './ecoopt.ts';

export type CiKind = 'lognormal' | 'normal' | 'poisson';
export type TwoSample = {
  M: number; C: number; R: number;
  /** Lincoln-Petersen M·C/R (Infinity when R = 0). */
  lp: number;
  /** Chapman (M+1)(C+1)/(R+1) − 1. */
  chapman: number;
  /** Seber (1970) variance of the Chapman estimate. */
  variance: number; se: number; cv: number;
  /** Different animals actually handled, M + C − R: the population cannot be smaller. */
  seen: number;
  lo: number; hi: number; kind: CiKind; conf: number;
  /** Robson and Regier: the Chapman estimate is close to unbiased when R ≥ 7. */
  enough: boolean;
};

/** Lincoln-Petersen and Chapman estimates from M marked, C caught in the second sample, R of them marked. */
export function twoSample(M: number, C: number, R: number, kind: CiKind = 'lognormal', conf = 0.95): TwoSample {
  if (!(M > 0 && C > 0) || R < 0 || R > M || R > C) throw new Error('Need M > 0 and C > 0, with 0 ≤ R ≤ M and R ≤ C.');
  const lp = R > 0 ? (M * C) / R : Infinity;
  const chapman = ((M + 1) * (C + 1)) / (R + 1) - 1;
  const variance = ((M + 1) * (C + 1) * (M - R) * (C - R)) / ((R + 1) ** 2 * (R + 2));
  const se = Math.sqrt(variance), seen = M + C - R, z = normInv(1 - (1 - conf) / 2);
  let lo: number, hi: number;
  if (kind === 'normal') { lo = Math.max(seen, chapman - z * se); hi = chapman + z * se; }
  else if (kind === 'poisson') {
    // Treat R as Poisson (fine when R is small relative to C) and put its limits into the Chapman formula.
    const [rl, rh] = poissonCI(R, conf);
    lo = Math.max(seen, ((M + 1) * (C + 1)) / (rh + 1) - 1); hi = ((M + 1) * (C + 1)) / (rl + 1) - 1;
  } else {
    // Log-normal interval on the animals not seen (Chao 1987; Burnham et al. 1987), never below those seen.
    const f0 = chapman - seen;
    if (f0 <= 0 || variance === 0) { lo = hi = Math.max(seen, chapman); }
    else { const k = Math.exp(z * Math.sqrt(Math.log(1 + variance / (f0 * f0)))); lo = seen + f0 / k; hi = seen + f0 * k; }
  }
  return { M, C, R, lp, chapman, variance, se, cv: se / chapman, seen, lo, hi, kind, conf, enough: R >= 7 };
}

export type Occasion = { C: number; R: number; U: number; Mt: number };
export type Schnabel = {
  rows: Occasion[]; sumCM: number; sumR: number; sumC: number;
  /** Schnabel (1938) ΣC·M / ΣR. */
  N: number;
  /** Seber's (1982) adjusted form ΣC·M / (ΣR + 1). */
  Nadj: number;
  lo: number; hi: number; method: 'poisson' | 't'; conf: number;
};

/**
 * Schnabel estimate from several sampling occasions. Each occasion catches C animals, R of them already
 * marked, and releases U newly marked ones (by default C − R). Mt is the marked animals at large before it.
 * Limits follow Krebs (Ecological Methodology): Poisson limits on ΣR when ΣR < 50, otherwise a t interval
 * on 1/N with S − 1 degrees of freedom.
 */
export function schnabel(occ: { C: number; R: number; U?: number }[], conf = 0.95): Schnabel {
  if (occ.length < 2) throw new Error('Give at least two sampling occasions.');
  let Mt = 0; const rows: Occasion[] = [];
  occ.forEach((o, i) => {
    const U = o.U ?? o.C - o.R;
    if (!(o.C >= 0) || !(o.R >= 0) || o.R > o.C) throw new Error(`Occasion ${i + 1}: recaptures must be between 0 and the number caught.`);
    if (o.R > Mt) throw new Error(`Occasion ${i + 1}: ${o.R} recaptures, but only ${Mt} marked animals were at large.`);
    if (!(U >= 0)) throw new Error(`Occasion ${i + 1}: the number newly marked cannot be negative.`);
    rows.push({ C: o.C, R: o.R, U, Mt }); Mt += U;
  });
  const sumCM = rows.reduce((s, r) => s + r.C * r.Mt, 0), sumR = rows.reduce((s, r) => s + r.R, 0), sumC = rows.reduce((s, r) => s + r.C, 0);
  if (!(sumCM > 0)) throw new Error('No marked animals were at large when later samples were taken.');
  const N = sumR > 0 ? sumCM / sumR : Infinity, Nadj = sumCM / (sumR + 1);
  let lo: number, hi: number, method: 'poisson' | 't';
  if (sumR < 50) { method = 'poisson'; const [a, b] = poissonCI(sumR, conf); lo = sumCM / b; hi = a > 0 ? sumCM / a : Infinity; }
  else {
    method = 't';
    const inv = sumR / sumCM, se = Math.sqrt(sumR) / sumCM, t = tInv(1 - (1 - conf) / 2, rows.length - 1);
    lo = 1 / (inv + t * se); hi = inv - t * se > 0 ? 1 / (inv - t * se) : Infinity;
  }
  return { rows, sumCM, sumR, sumC, N, Nadj, lo, hi, method, conf };
}
