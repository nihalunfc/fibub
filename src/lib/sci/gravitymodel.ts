// Gravity model of spatial interaction (trade, migration, commuting): F = k · Mo^a · Md^b / d^c.
// Predict flows from chosen parameters, or estimate them from observed flows by log-linear least squares
// (zero flows dropped) and by Poisson pseudo-maximum likelihood (PPML, Santos Silva and Tenreyro 2006),
// which keeps the zeros. Distances come from coordinates (great circle, haversine) or are given.
import { invSPD } from './fit.ts';
import { tTwoSided, normCdf } from './stats.ts';

/** Mean Earth radius in km (IUGG). */
export const EARTH_KM = 6371.0088;

/** Great-circle distance in km between two points given in decimal degrees (haversine formula). */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number, R = EARTH_KM): number {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Predicted flow k · Mo^a · Md^b / d^c. */
export const predict = (p: { k: number; a: number; b: number; c: number }, mo: number, md: number, d: number) => p.k * mo ** p.a * md ** p.b / d ** p.c;

export type Coef = { name: string; est: number; se: number; stat: number; p: number };
export type OlsFit = { coefs: Coef[]; n: number; df: number; r2: number; adjR2: number; sigma: number; dropped: number; fitted: number[] };
export type PpmlFit = { coefs: Coef[]; n: number; iterations: number; converged: boolean; pseudoR2: number; deviance: number; fitted: number[]; seKind: 'HC0' };

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);

/** Ordinary least squares with an intercept column already in X. */
export function ols(X: number[][], y: number[], names: string[]): Omit<OlsFit, 'dropped'> {
  const n = y.length, k = X[0].length, df = n - k;
  if (df < 1) throw new Error(`Need more than ${k} usable flows to fit ${k} parameters`);
  const XtX = names.map((_, i) => names.map((_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const inv = invSPD(XtX);
  if (!inv) throw new Error('The variables are collinear (for example every place has the same mass or every distance is the same), so the parameters cannot be told apart');
  const Xty = names.map((_, i) => X.reduce((s, r, t) => s + r[i] * y[t], 0));
  const beta = inv.map((row) => dot(row, Xty));
  const fitted = X.map((r) => dot(r, beta));
  const sse = y.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0), ybar = y.reduce((s, v) => s + v, 0) / n;
  const sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0), s2 = sse / df;
  const coefs = beta.map((b, i) => { const se = Math.sqrt(s2 * inv[i][i]), t = b / se; return { name: names[i], est: b, se, stat: t, p: tTwoSided(t, df) }; });
  const r2 = 1 - sse / sst;
  return { coefs, n, df, r2, adjR2: 1 - (1 - r2) * (n - 1) / df, sigma: Math.sqrt(s2), fitted };
}

/**
 * Poisson pseudo-maximum likelihood by iteratively reweighted least squares (log link). Standard errors
 * are heteroskedasticity-robust (Huber-White sandwich, HC0), as PPML needs.
 */
export function ppml(X: number[][], y: number[], names: string[], start?: number[]): Omit<PpmlFit, never> {
  const n = y.length, k = X[0].length;
  if (n - k < 1) throw new Error(`Need more than ${k} flows to fit ${k} parameters`);
  if (y.some((v) => v < 0)) throw new Error('Flows cannot be negative');
  if (!y.some((v) => v > 0)) throw new Error('All flows are zero');
  // Start from the log-linear fit of log(y + mean) on X: close enough for IRLS to converge quickly.
  const ym = y.reduce((s, v) => s + v, 0) / n;
  let beta = start ?? ols(X, y.map((v) => Math.log(v + ym)), names).coefs.map((c) => c.est);
  let mu = X.map((r) => Math.exp(dot(r, beta))), dev = Infinity, it = 0, converged = false;
  const deviance = (m: number[]) => 2 * y.reduce((s, v, i) => s + (v > 0 ? v * Math.log(v / m[i]) : 0) - (v - m[i]), 0);
  for (it = 1; it <= 100; it++) {
    const z = X.map((r, i) => dot(r, beta) + (y[i] - mu[i]) / mu[i]);
    const A = names.map((_, a) => names.map((_, b) => X.reduce((s, r, i) => s + mu[i] * r[a] * r[b], 0)));
    const inv = invSPD(A);
    if (!inv) throw new Error('The PPML fit failed: the variables are collinear');
    const rhs = names.map((_, a) => X.reduce((s, r, i) => s + mu[i] * r[a] * z[i], 0));
    let next = inv.map((row) => dot(row, rhs));
    // Step halving if the deviance gets worse.
    let m2 = X.map((r) => Math.exp(dot(r, next))), d2 = deviance(m2);
    for (let h = 0; h < 30 && !(d2 <= dev * (1 + 1e-12)) && Number.isFinite(dev); h++) { next = next.map((v, i) => (v + beta[i]) / 2); m2 = X.map((r) => Math.exp(dot(r, next))); d2 = deviance(m2); }
    if (!m2.every(Number.isFinite)) throw new Error('The PPML fit did not converge (flows grow without limit)');
    const change = Math.abs(d2 - dev) / (Math.abs(d2) + 0.1);
    beta = next; mu = m2; dev = d2;
    if (change < 1e-12) { converged = true; break; }
  }
  // Sandwich: (X'WX)^-1 X' diag((y − mu)²) X (X'WX)^-1.
  const bread = invSPD(names.map((_, a) => names.map((_, b) => X.reduce((s, r, i) => s + mu[i] * r[a] * r[b], 0))))!;
  const meat = names.map((_, a) => names.map((_, b) => X.reduce((s, r, i) => s + (y[i] - mu[i]) ** 2 * r[a] * r[b], 0)));
  const V = bread.map((row) => bread[0].map((_, j) => row.reduce((s, x, t) => s + x * meat[t].reduce((u, m, q) => u + m * bread[q][j], 0), 0)));
  const coefs = beta.map((b, i) => { const se = Math.sqrt(V[i][i]), z = b / se; return { name: names[i], est: b, se, stat: z, p: 2 * (1 - normCdf(Math.abs(z))) }; });
  const my = y.reduce((s, v) => s + v, 0) / n, mm = mu.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (y[i] - my) * (mu[i] - mm); sxx += (y[i] - my) ** 2; syy += (mu[i] - mm) ** 2; }
  return { coefs, n, iterations: it, converged, pseudoR2: sxy * sxy / (sxx * syy), deviance: dev, fitted: mu, seKind: 'HC0' };
}

export type Pair = { o: string; d: string; mo: number; md: number; dist: number; flow: number };

/**
 * Fit the gravity model to pairs. sameMass: one exponent for Mo × Md. Returns OLS (on positive flows) and
 * PPML (all flows), each with k = exp(intercept), a, b and the distance-decay exponent c = −(coefficient of ln d).
 */
export function fitGravity(pairs: Pair[], sameMass = false) {
  for (const p of pairs) {
    if (!(p.mo > 0) || !(p.md > 0)) throw new Error(`Masses must be above zero (${p.o} → ${p.d})`);
    if (!(p.dist > 0)) throw new Error(`Distance must be above zero (${p.o} → ${p.d}); leave out flows within one place`);
    if (!(p.flow >= 0)) throw new Error(`Flow ${p.o} → ${p.d} must be a number of zero or more`);
  }
  const names = sameMass ? ['ln k', 'ln(Mo·Md)', 'ln d'] : ['ln k', 'ln Mo', 'ln Md', 'ln d'];
  const row = (p: Pair) => (sameMass ? [1, Math.log(p.mo * p.md), Math.log(p.dist)] : [1, Math.log(p.mo), Math.log(p.md), Math.log(p.dist)]);
  const pos = pairs.filter((p) => p.flow > 0);
  const o = ols(pos.map(row), pos.map((p) => Math.log(p.flow)), names);
  const pp = ppml(pairs.map(row), pairs.map((p) => p.flow), names);
  const params = (c: Coef[]) => ({ k: Math.exp(c[0].est), a: c[1].est, b: sameMass ? c[1].est : c[2].est, c: -c[c.length - 1].est });
  // Back-transformed OLS predictions (no smearing correction), for all pairs.
  const pOls = params(o.coefs);
  return {
    names,
    ols: { ...o, dropped: pairs.length - pos.length, params: pOls, predicted: pairs.map((p) => predict(pOls, p.mo, p.md, p.dist)) },
    ppml: { ...pp, params: params(pp.coefs), predicted: pp.fitted },
  };
}
