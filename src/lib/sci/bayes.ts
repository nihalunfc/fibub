// Bayesian A/B testing with beta-binomial models, and conjugate prior updates (beta-binomial, gamma-Poisson,
// normal-normal with known sigma). Plain functions, no DOM. P(B > A) by the exact sum for whole-number
// posterior parameters (Evan Miller, "Formulas for Bayesian A/B testing", 2015) and otherwise by Gauss-Legendre
// quadrature; expected loss, and intervals for the difference and lift, by quadrature over the posteriors.
import { logGamma, normInv } from './stats.ts';
import { gammaQ, gaussLegendre } from './hyptest.ts';

const lbeta = (a: number, b: number) => logGamma(a) + logGamma(b) - logGamma(a + b);

/** Continued fraction for the incomplete beta (Numerical Recipes 6.4), with enough steps for parameters into the millions. */
function betacf(a: number, b: number, x: number) {
  const FPMIN = 1e-300, EPS = 1e-15;
  let c = 1, d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d; let h = d;
  for (let m = 1; m <= 50000; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a - 1 + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + 1 + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}
/** Regularised incomplete beta I_x(a, b) = Beta(a, b) CDF at x. */
export function betaCdf(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(-lbeta(a, b) + a * Math.log(x) + b * Math.log1p(-x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
export const betaPdf = (x: number, a: number, b: number) => (x <= 0 || x >= 1 ? (x === 0 && a === 1 ? b : x === 1 && b === 1 ? a : 0) : Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log1p(-x) - lbeta(a, b)));
/** Quantile of Beta(a, b), by bisection on the CDF. */
export function betaInv(p: number, a: number, b: number) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 100 && hi - lo > 1e-15; i++) { const m = (lo + hi) / 2; if (betaCdf(m, a, b) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Gamma(shape k, rate r): CDF, density and quantile. */
export const gammaCdf = (x: number, k: number, r: number) => (x <= 0 ? 0 : 1 - gammaQ(k, r * x));
export const gammaPdf = (x: number, k: number, r: number) => (x <= 0 ? 0 : Math.exp(k * Math.log(r) + (k - 1) * Math.log(x) - r * x - logGamma(k)));
export function gammaInv(p: number, k: number, r: number) {
  if (p <= 0) return 0;
  let lo = 0, hi = Math.max(1, (k + 10 * Math.sqrt(k) + 10) / r);
  while (gammaCdf(hi, k, r) < p) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-14 * hi; i++) { const m = (lo + hi) / 2; if (gammaCdf(m, k, r) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Integrate f over where Beta(a, b) has its mass (from its 1e-13 to 1 − 1e-13 quantiles). */
function overBeta(f: (x: number) => number, a: number, b: number, panels = 48) {
  const lo = betaInv(1e-13, a, b), hi = betaInv(1 - 1e-13, a, b);
  return gaussLegendre((x) => betaPdf(x, a, b) * f(x), lo, hi, panels);
}

export type Arm = { a: number; b: number };
/** P(p_B > p_A) for independent Beta posteriors: exact sum when b's first parameter is a whole number, else quadrature. */
export function probBBeatsA(A: Arm, B: Arm): { p: number; method: 'exact' | 'quadrature' } {
  if (Number.isInteger(B.a) && B.a <= 2e6) {
    let s = 0;
    const c = lbeta(A.a, A.b);
    for (let i = 0; i < B.a; i++) s += Math.exp(lbeta(A.a + i, A.b + B.b) - Math.log(B.b + i) - lbeta(1 + i, B.b) - c);
    return { p: Math.min(1, Math.max(0, s)), method: 'exact' };
  }
  return { p: Math.min(1, Math.max(0, overBeta((x) => betaCdf(x, A.a, A.b), B.a, B.b))), method: 'quadrature' };
}
/**
 * Expected loss E[max(p_A − p_B, 0)]: how much conversion rate you expect to give up by choosing B if A is in
 * fact better. Uses E[(p_A − y)+] = μ_A (1 − I_y(a_A + 1, b_A)) − y (1 − I_y(a_A, b_A)).
 */
export function expectedLoss(A: Arm, B: Arm) {
  const mA = A.a / (A.a + A.b);
  return Math.max(0, overBeta((y) => mA * (1 - betaCdf(y, A.a + 1, A.b)) - y * (1 - betaCdf(y, A.a, A.b)), B.a, B.b));
}
/** CDF of the difference D = p_B − p_A at d. */
export const diffCdf = (A: Arm, B: Arm, d: number) => overBeta((x) => betaCdf(x + d, B.a, B.b), A.a, A.b);
/** CDF of the relative lift L = p_B / p_A − 1 at l. */
export const liftCdf = (A: Arm, B: Arm, l: number) => overBeta((x) => betaCdf(x * (1 + l), B.a, B.b), A.a, A.b);
function invert(cdf: (v: number) => number, p: number, lo: number, hi: number) {
  while (cdf(lo) > p) lo = lo - (hi - lo);
  while (cdf(hi) < p) hi = hi + (hi - lo);
  for (let i = 0; i < 60 && hi - lo > 1e-10 * Math.max(1, Math.abs(hi)); i++) { const m = (lo + hi) / 2; if (cdf(m) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
export const betaMean = (s: Arm) => s.a / (s.a + s.b);
export const betaSd = (s: Arm) => Math.sqrt((s.a * s.b) / ((s.a + s.b) ** 2 * (s.a + s.b + 1)));

export type AbResult = {
  A: Arm; B: Arm; pB: number; method: string; lossB: number; lossA: number;
  ciA: [number, number]; ciB: [number, number]; diffMean: number; diffCi: [number, number]; liftMedian: number; liftCi: [number, number];
};
/** Beta-binomial A/B test with a Beta(prior.a, prior.b) prior on both conversion rates. */
export function abTest(sA: number, nA: number, sB: number, nB: number, prior: Arm = { a: 1, b: 1 }, cred = 0.95): AbResult {
  for (const [s, n, w] of [[sA, nA, 'A'], [sB, nB, 'B']] as [number, number, string][]) {
    if (!(Number.isInteger(n) && n >= 1)) throw new Error(`Visitors for ${w} must be a whole number of 1 or more.`);
    if (!(Number.isInteger(s) && s >= 0 && s <= n)) throw new Error(`Conversions for ${w} must be a whole number from 0 to its visitors.`);
    if (n > 1e6) throw new Error('This tool takes up to 1,000,000 visitors per variant.');
  }
  if (!(prior.a > 0 && prior.b > 0)) throw new Error('The prior parameters must be above zero.');
  const A = { a: prior.a + sA, b: prior.b + nA - sA }, B = { a: prior.a + sB, b: prior.b + nB - sB };
  const t = (1 - cred) / 2, { p, method } = probBBeatsA(A, B);
  const sdD = Math.sqrt(betaSd(A) ** 2 + betaSd(B) ** 2), mD = betaMean(B) - betaMean(A);
  const dq = (q: number) => invert((d) => diffCdf(A, B, d), q, mD - 8 * sdD, mD + 8 * sdD);
  const lq = (q: number) => invert((l) => liftCdf(A, B, l), q, Math.max(-1, mD / betaMean(A) - 8 * sdD / betaMean(A)), mD / betaMean(A) + 8 * sdD / betaMean(A));
  return {
    A, B, pB: p, method, lossB: expectedLoss(A, B), lossA: expectedLoss(B, A),
    ciA: [betaInv(t, A.a, A.b), betaInv(1 - t, A.a, A.b)], ciB: [betaInv(t, B.a, B.b), betaInv(1 - t, B.a, B.b)],
    diffMean: mD, diffCi: [dq(t), dq(1 - t)], liftMedian: lq(0.5), liftCi: [lq(t), lq(1 - t)],
  };
}

// ---------- conjugate updates ----------
export type Dist = { kind: 'beta' | 'gamma' | 'normal'; p1: number; p2: number };
export type Summary = { mean: number; sd: number; mode: number; ci: [number, number]; median: number };
export function summarize(d: Dist, cred = 0.95): Summary {
  const t = (1 - cred) / 2;
  if (d.kind === 'beta') {
    const { p1: a, p2: b } = d;
    return { mean: a / (a + b), sd: betaSd({ a, b }), mode: a > 1 && b > 1 ? (a - 1) / (a + b - 2) : a <= 1 && b > 1 ? 0 : a > 1 && b <= 1 ? 1 : NaN, ci: [betaInv(t, a, b), betaInv(1 - t, a, b)], median: betaInv(0.5, a, b) };
  }
  if (d.kind === 'gamma') {
    const { p1: k, p2: r } = d;
    return { mean: k / r, sd: Math.sqrt(k) / r, mode: k >= 1 ? (k - 1) / r : 0, ci: [gammaInv(t, k, r), gammaInv(1 - t, k, r)], median: gammaInv(0.5, k, r) };
  }
  const { p1: m, p2: s } = d, z = -normInv(t);
  return { mean: m, sd: s, mode: m, ci: [m - z * s, m + z * s], median: m };
}
export function pdf(d: Dist, x: number) {
  if (d.kind === 'beta') return betaPdf(x, d.p1, d.p2);
  if (d.kind === 'gamma') return gammaPdf(x, d.p1, d.p2);
  return Math.exp(-0.5 * ((x - d.p1) / d.p2) ** 2) / (d.p2 * Math.sqrt(2 * Math.PI));
}
/** Beta prior + k successes in n trials. */
export function updateBeta(a: number, b: number, k: number, n: number): Dist {
  if (!(a > 0 && b > 0)) throw new Error('The prior a and b must be above zero.');
  if (!(Number.isInteger(n) && n >= 0 && Number.isInteger(k) && k >= 0 && k <= n)) throw new Error('Successes and trials must be whole numbers, with successes no more than trials.');
  return { kind: 'beta', p1: a + k, p2: b + n - k };
}
/** Gamma(shape, rate) prior on a Poisson rate + a total count over an exposure (number of intervals, area, time). */
export function updateGamma(shape: number, rate: number, total: number, exposure: number): Dist {
  if (!(shape > 0 && rate > 0)) throw new Error('The prior shape and rate must be above zero.');
  if (!(Number.isInteger(total) && total >= 0)) throw new Error('The total count must be a whole number of 0 or more.');
  if (!(exposure > 0)) throw new Error('The exposure (number of intervals) must be above zero.');
  return { kind: 'gamma', p1: shape + total, p2: rate + exposure };
}
/** Normal prior N(mu0, tau0²) on a mean + n observations with mean xbar and known SD sigma. */
export function updateNormal(mu0: number, tau0: number, n: number, xbar: number, sigma: number): Dist {
  if (!(tau0 > 0 && sigma > 0)) throw new Error('The prior SD and the known SD must be above zero.');
  if (!(Number.isInteger(n) && n >= 0)) throw new Error('n must be a whole number of 0 or more.');
  if (!Number.isFinite(mu0) || (n > 0 && !Number.isFinite(xbar))) throw new Error('Type the prior mean and the data mean.');
  const prec = 1 / tau0 ** 2 + n / sigma ** 2;
  return { kind: 'normal', p1: (mu0 / tau0 ** 2 + (n ? (n * xbar) / sigma ** 2 : 0)) / prec, p2: Math.sqrt(1 / prec) };
}
