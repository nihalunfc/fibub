// Quantal dose–response (LC50 / EC50) by maximum likelihood: r of n organisms respond at each concentration, and
//   P(x) = c + (1 − c) F(a + b x),  x = log10(concentration),  F = standard normal (probit) or logistic (logit) CDF,
// where c is the natural (control) response, fixed from the control group (Abbott's correction) or 0. Fisher scoring,
// then LCp with Fieller (fiducial) limits; when the Pearson χ² shows more scatter than binomial, the covariance is
// scaled by χ²/df and t replaces z (Finney's heterogeneity factor). No DOM.
import { normCdf, normInv, tInv } from './stats.ts';
import { gammaP } from './floodfreq.ts';

export type Link = 'probit' | 'logit';
export type Group = { conc: number; n: number; r: number };

const F = (l: Link, e: number) => (l === 'probit' ? normCdf(e) : 1 / (1 + Math.exp(-e)));
const f = (l: Link, e: number) => (l === 'probit' ? Math.exp(-0.5 * e * e) / Math.sqrt(2 * Math.PI) : (() => { const p = 1 / (1 + Math.exp(-e)); return p * (1 - p); })());
const Finv = (l: Link, p: number) => (l === 'probit' ? normInv(p) : Math.log(p / (1 - p)));
export const chi2Sf = (x: number, df: number) => (x <= 0 ? 1 : 1 - gammaP(df / 2, x / 2));

export type Fit = {
  a: number; b: number; cov: [[number, number], [number, number]]; c: number; link: Link;
  chi2: number; df: number; pChi: number; hetero: boolean; factor: number; logLik: number; iter: number; converged: boolean;
  groups: (Group & { x: number; expected: number })[];
};

/** Maximum-likelihood fit to the treated groups (concentration > 0). c is the fixed natural response (0 to 1). */
export function fitQuantal(groups: Group[], link: Link, c = 0, hetAlpha = 0.05): Fit {
  const g = groups.filter((d) => d.conc > 0 && d.n > 0).map((d) => ({ ...d, x: Math.log10(d.conc) }));
  // Start from a straight-line fit to the transformed, clipped proportions.
  const tr = g.map((d) => { const p = Math.min(0.98, Math.max(0.02, (d.r / d.n - c) / (1 - c))); return Finv(link, p); });
  const xm = g.reduce((s, d) => s + d.x, 0) / g.length, ym = tr.reduce((s, v) => s + v, 0) / g.length;
  let sxx = 0, sxy = 0; g.forEach((d, i) => { sxx += (d.x - xm) ** 2; sxy += (d.x - xm) * (tr[i] - ym); });
  let b = sxx > 0 ? sxy / sxx || 1 : 1, a = ym - b * xm, it = 0, converged = false;
  let I11 = 0, I12 = 0, I22 = 0;
  const loglik = (a2: number, b2: number) => g.reduce((s, d) => { const P = Math.min(1 - 1e-15, Math.max(1e-15, c + (1 - c) * F(link, a2 + b2 * d.x))); return s + d.r * Math.log(P) + (d.n - d.r) * Math.log(1 - P); }, 0);
  for (it = 0; it < 200; it++) {
    let s1 = 0, s2 = 0; I11 = 0; I12 = 0; I22 = 0;
    for (const d of g) {
      const e = a + b * d.x, P = Math.min(1 - 1e-12, Math.max(1e-12, c + (1 - c) * F(link, e))), dP = (1 - c) * f(link, e), w = (d.n * dP * dP) / (P * (1 - P)), u = ((d.r - d.n * P) * dP) / (P * (1 - P));
      s1 += u; s2 += u * d.x; I11 += w; I12 += w * d.x; I22 += w * d.x * d.x;
    }
    const det = I11 * I22 - I12 * I12;
    if (!(det > 0)) break;
    let da = (I22 * s1 - I12 * s2) / det, db = (I11 * s2 - I12 * s1) / det;
    // Step halving keeps the likelihood rising.
    const L0 = loglik(a, b); let k = 0;
    while (loglik(a + da, b + db) < L0 - 1e-12 && k < 30) { da /= 2; db /= 2; k++; }
    a += da; b += db;
    if (Math.abs(da) < 1e-11 * (1 + Math.abs(a)) && Math.abs(db) < 1e-11 * (1 + Math.abs(b))) { converged = true; break; }
  }
  // Information at the estimate.
  I11 = 0; I12 = 0; I22 = 0; let chi2 = 0;
  const out = g.map((d) => {
    const e = a + b * d.x, P = c + (1 - c) * F(link, e), dP = (1 - c) * f(link, e), w = (d.n * dP * dP) / (P * (1 - P));
    I11 += w; I12 += w * d.x; I22 += w * d.x * d.x; chi2 += (d.r - d.n * P) ** 2 / (d.n * P * (1 - P));
    return { ...d, expected: d.n * P };
  });
  const det = I11 * I22 - I12 * I12, df = g.length - 2, pChi = df > 0 ? chi2Sf(chi2, df) : 1, hetero = df > 0 && pChi < hetAlpha, factor = hetero ? chi2 / df : 1;
  const cov: [[number, number], [number, number]] = [[(factor * I22) / det, (-factor * I12) / det], [(-factor * I12) / det, (factor * I11) / det]];
  return { a, b, cov, c, link, chi2, df, pChi, hetero, factor, logLik: loglik(a, b), iter: it, converged, groups: out };
}

/** Concentration killing (or affecting) a fraction p beyond the natural response, with fiducial limits (Fieller). */
export function lcp(fit: Fit, p: number, conf = 0.95) {
  const yp = Finv(fit.link, p), { a, b } = fit, [[v11, v12], [, v22]] = fit.cov;
  const t = fit.hetero ? tInv(1 - (1 - conf) / 2, fit.df) : normInv(1 - (1 - conf) / 2);
  const m = (yp - a) / b, g = (t * t * v22) / (b * b);
  // Solve (yp − a − b x)² = t² (v11 + 2 x v12 + x² v22) for x.
  const A = b * b - t * t * v22, B = -2 * (b * (yp - a) + t * t * v12), C = (yp - a) ** 2 - t * t * v11, D = B * B - 4 * A * C;
  let lo = NaN, hi = NaN;
  if (A > 0 && D >= 0) { const r1 = (-B - Math.sqrt(D)) / (2 * A), r2 = (-B + Math.sqrt(D)) / (2 * A); lo = Math.min(r1, r2); hi = Math.max(r1, r2); }
  return { p, logC: m, conc: 10 ** m, lo: 10 ** lo, hi: 10 ** hi, g, defined: A > 0 && D >= 0 };
}

/** Abbott's correction of an observed proportion for a natural response c. */
export const abbott = (p: number, c: number) => (c < 1 ? (p - c) / (1 - c) : NaN);

/** Fitted response probability at a concentration. */
export const predict = (fit: Fit, conc: number) => (conc > 0 ? fit.c + (1 - fit.c) * F(fit.link, fit.a + fit.b * Math.log10(conc)) : fit.c);
