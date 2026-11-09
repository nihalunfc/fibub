// Effect sizes for comparing groups and measuring learning: Cohen's d, Hedges' g, Glass's delta, paired d
// (dz and dav), with confidence intervals (exact ones from the noncentral t distribution where they exist), and
// Hake's normalised gain (class-average and average of individual gains).
import { logGamma, normCdf, normInv, ibeta, tTwoSided } from './stats.ts';

/** P(T ≤ t) for the noncentral t distribution with df degrees of freedom and noncentrality delta (Lenth 1989, AS 243). */
export function nctCdf(t: number, df: number, delta: number): number {
  if (!(df > 0) || !Number.isFinite(t) || !Number.isFinite(delta)) return NaN;
  if (Math.abs(delta) > 36) {
    // Far tails of the Poisson weights underflow; use the normal approximation of Abramowitz and Stegun 26.7.10.
    return normCdf((t * (1 - 1 / (4 * df)) - delta) / Math.sqrt(1 + (t * t) / (2 * df)));
  }
  let tt = t, del = delta, neg = false;
  if (t < 0) { tt = -t; del = -delta; neg = true; }
  let tnc = 0;
  const x = (tt * tt) / (tt * tt + df);
  if (x > 0) {
    const lambda = del * del;
    let p = 0.5 * Math.exp(-0.5 * lambda), q = Math.sqrt(2 / Math.PI) * p * del, s = -0.5 * Math.expm1(-0.5 * lambda);
    let a = 0.5;
    const b = 0.5 * df, rxb = Math.pow(1 - x, b), albeta = logGamma(a) + logGamma(b) - logGamma(a + b);
    let xodd = ibeta(x, a, b), godd = 2 * rxb * Math.exp(a * Math.log(x) - albeta), xeven = 1 - rxb, geven = b * x * rxb;
    tnc = p * xodd + q * xeven;
    for (let en = 1; en <= 5000; en++) {
      a += 1;
      xodd -= godd; xeven -= geven;
      godd *= (x * (a + b - 1)) / a; geven *= (x * (a + b - 0.5)) / (a + 0.5);
      p *= lambda / (2 * en); q *= lambda / (2 * en + 1); s -= p;
      tnc += p * xodd + q * xeven;
      if (Math.abs(2 * s * (xodd - godd)) < 1e-14 && en > 2) break;
    }
  }
  tnc += normCdf(-del);
  const r = neg ? 1 - tnc : tnc;
  return Math.min(1, Math.max(0, r));
}

/** Noncentrality values whose distributions put t at the upper and lower (1 − level)/2 tails: the CI for the ncp. */
export function ncpInterval(t: number, df: number, level = 0.95): [number, number] {
  const a = (1 - level) / 2;
  const find = (target: number) => {
    // nctCdf falls as delta grows; bracket and bisect.
    let lo = t - 10, hi = t + 10;
    while (nctCdf(t, df, lo) < target) lo -= 10 + Math.abs(lo);
    while (nctCdf(t, df, hi) > target) hi += 10 + Math.abs(hi);
    for (let i = 0; i < 200 && hi - lo > 1e-12 * Math.max(1, Math.abs(lo)); i++) { const mid = (lo + hi) / 2; if (nctCdf(t, df, mid) > target) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  return [find(1 - a), find(a)];
}

/** Hedges' small-sample correction J(df) = Γ(df/2) / (√(df/2) Γ((df − 1)/2)). */
export const hedgesJ = (df: number) => Math.exp(logGamma(df / 2) - 0.5 * Math.log(df / 2) - logGamma((df - 1) / 2));

export type Groups = { m1: number; s1: number; n1: number; m2: number; s2: number; n2: number };
/** Two independent groups; group 2 is the control (Glass's delta uses its SD). */
export function independent(g: Groups, level = 0.95) {
  const { m1, s1, n1, m2, s2, n2 } = g;
  if (!(n1 >= 2 && n2 >= 2)) throw new Error('Each group needs at least 2 people');
  if (!(s1 > 0 && s2 > 0)) throw new Error('Standard deviations must be above 0');
  const df = n1 + n2 - 2, sp = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / df), diff = m1 - m2;
  const d = diff / sp, k = Math.sqrt(1 / n1 + 1 / n2), t = d / k, J = hedgesJ(df);
  const [L, U] = ncpInterval(t, df, level);
  const z = normInv(1 - (1 - level) / 2);
  const delta = diff / s2, seDelta = Math.sqrt((n1 + n2) / (n1 * n2) + (delta * delta) / (2 * (n2 - 1)));
  const seD = Math.sqrt((n1 + n2) / (n1 * n2) + (d * d) / (2 * (n1 + n2)));
  return {
    diff, sp, df, t, p: tTwoSided(t, df), J,
    d, dCi: [L * k, U * k] as [number, number], seD,
    g: d * J, gCi: [L * k * J, U * k * J] as [number, number],
    delta, deltaCi: [delta - z * seDelta, delta + z * seDelta] as [number, number],
  };
}

export type Paired = { m1: number; s1: number; m2: number; s2: number; n: number; r?: number; sdiff?: number };
/** Before (1) and after (2) on the same people. Positive values mean the second mean is higher. */
export function paired(o: Paired, level = 0.95) {
  const { m1, s1, m2, s2, n } = o;
  if (!(n >= 3)) throw new Error('Need at least 3 people');
  if (!(s1 > 0 && s2 > 0)) throw new Error('Standard deviations must be above 0');
  let sdiff = o.sdiff, r = o.r;
  if (sdiff === undefined || !Number.isFinite(sdiff)) {
    if (r === undefined || !(r > -1 && r < 1)) throw new Error('Give the correlation between the two measurements (between −1 and 1) or the SD of the differences');
    sdiff = Math.sqrt(s1 * s1 + s2 * s2 - 2 * r * s1 * s2);
  } else if (r === undefined || !Number.isFinite(r)) r = (s1 * s1 + s2 * s2 - sdiff * sdiff) / (2 * s1 * s2);
  if (!(sdiff > 0)) throw new Error('The SD of the differences must be above 0');
  const diff = m2 - m1, df = n - 1, dz = diff / sdiff, t = dz * Math.sqrt(n), J = hedgesJ(df);
  const [L, U] = ncpInterval(t, df, level);
  const dav = diff / ((s1 + s2) / 2), z = normInv(1 - (1 - level) / 2);
  // Approximate variance of a repeated-measures d (Borenstein et al. 2009, eq. 4.28).
  const seDav = Math.sqrt((1 / n + (dav * dav) / (2 * n)) * 2 * (1 - (r as number)));
  return {
    diff, sdiff, r: r as number, df, t, p: tTwoSided(t, df), J,
    dz, dzCi: [L / Math.sqrt(n), U / Math.sqrt(n)] as [number, number], gz: dz * J,
    dav, davCi: [dav - z * seDav, dav + z * seDav] as [number, number], gav: dav * J,
  };
}

/** Hake's normalised gain from each student's pre and post scores out of `max`. */
export function hake(pre: number[], post: number[], max: number) {
  if (pre.length !== post.length || !pre.length) throw new Error('Need pre and post scores for the same students');
  if (!(max > 0)) throw new Error('The maximum score must be above 0');
  for (const v of [...pre, ...post]) if (v < 0 || v > max) throw new Error(`Scores must be between 0 and the maximum (${max})`);
  const n = pre.length, mPre = pre.reduce((s, x) => s + x, 0) / n, mPost = post.reduce((s, x) => s + x, 0) / n;
  const gi = pre.map((p, i) => (p < max ? (post[i] - p) / (max - p) : NaN)), ok = gi.filter(Number.isFinite);
  return {
    n, mPre, mPost, classGain: hakeClass(mPre, mPost, max), individual: gi,
    averageGain: ok.length ? ok.reduce((s, x) => s + x, 0) / ok.length : NaN, excluded: n - ok.length,
  };
}
export function hakeClass(mPre: number, mPost: number, max: number) {
  if (!(mPre < max)) throw new Error('The pre-test mean must be below the maximum score');
  return (mPost - mPre) / (max - mPre);
}
export const gainBand = (g: number) => (g < 0.3 ? 'low' : g <= 0.7 ? 'medium' : 'high');
export const dBand = (d: number) => { const a = Math.abs(d); return a < 0.2 ? 'negligible' : a < 0.5 ? 'small' : a < 0.8 ? 'medium' : 'large'; };
