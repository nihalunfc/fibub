// Bioaccumulation: the first-order one-compartment fish model behind a flow-through bioconcentration test (constant
// water concentration during uptake, clean water after), fitted to the fish concentrations by least squares to give the
// uptake rate k1, the depuration rate k2 and the kinetic BCF k1/k2, with growth and lipid corrections; and the trophic
// magnification factor from a regression of log concentration on trophic level. No DOM.
import { tInv, tTwoSided } from './stats.ts';

/** Fish concentration at time t (exposure Cw until tu, clean water after), starting from c0 at t = 0. */
export function model(t: number, k1: number, k2: number, Cw: number, tu: number, c0 = 0) {
  const tt = Math.min(t, tu), up = (k1 / k2) * Cw * (1 - Math.exp(-k2 * tt)) + c0 * Math.exp(-k2 * tt);
  return t <= tu ? up : up * Math.exp(-k2 * (t - tu));
}

/** Starting values, the sequential way: k2 from the log-linear fall after uptake, k1 from the uptake points. */
export function sequential(t: number[], c: number[], Cw: number, tu: number) {
  const di = t.map((_, i) => i).filter((i) => t[i] > tu && c[i] > 0);
  let k2 = NaN;
  if (di.length >= 2) {
    const x = di.map((i) => t[i]), y = di.map((i) => Math.log(c[i])), mx = x.reduce((a, b) => a + b) / x.length, my = y.reduce((a, b) => a + b) / y.length;
    let sxx = 0, sxy = 0; x.forEach((v, k) => { sxx += (v - mx) ** 2; sxy += (v - mx) * (y[k] - my); });
    k2 = sxx > 0 ? -sxy / sxx : NaN;
  }
  if (!(k2 > 0)) k2 = 3 / Math.max(tu, 1e-9);
  // Least squares k1 for fixed k2 (the model is linear in k1).
  const ui = t.map((_, i) => i).filter((i) => t[i] <= tu);
  let num = 0, den = 0; ui.forEach((i) => { const g = (Cw / k2) * (1 - Math.exp(-k2 * t[i])); num += g * c[i]; den += g * g; });
  return { k1: den > 0 ? num / den : NaN, k2 };
}

export type KinFit = { k1: number; k2: number; se1: number; se2: number; cov: number; rss: number; n: number; df: number; bcf: number; seBcf: number; converged: boolean; fitted: number[] };

/** Fit k1 and k2 (Levenberg–Marquardt). log = true fits ln concentrations (multiplicative error); points ≤ 0 are then dropped. */
export function fitKinetic(t: number[], c: number[], Cw: number, tu: number, log = true, c0 = 0): KinFit {
  const idx = t.map((_, i) => i).filter((i) => (log ? c[i] > 0 : Number.isFinite(c[i])));
  const T = idx.map((i) => t[i]), C = idx.map((i) => c[i]), n = T.length;
  const f = (k1: number, k2: number, x: number) => model(x, k1, k2, Cw, tu, c0);
  const res = (k1: number, k2: number) => T.map((x, j) => (log ? Math.log(C[j]) - Math.log(f(k1, k2, x)) : C[j] - f(k1, k2, x)));
  const ss = (r: number[]) => r.reduce((a, b) => a + b * b, 0);
  // Work on ln k so both rates stay positive.
  let { k1, k2 } = sequential(T, C, Cw, tu), lam = 1e-3, it = 0, conv = false;
  let r = res(k1, k2), S = ss(r);
  const jac = (a: number, b: number) => {
    const h = 1e-7, r0 = res(a, b), ra = res(a * Math.exp(h), b), rb = res(a, b * Math.exp(h));
    return r0.map((_, j) => [-(ra[j] - r0[j]) / h, -(rb[j] - r0[j]) / h]); // d(model term)/d ln k
  };
  for (; it < 200; it++) {
    const J = jac(k1, k2);
    let a11 = 0, a12 = 0, a22 = 0, g1 = 0, g2 = 0;
    J.forEach(([p, q], j) => { a11 += p * p; a12 += p * q; a22 += q * q; g1 += p * r[j]; g2 += q * r[j]; });
    let improved = false;
    for (let k = 0; k < 30; k++) {
      const b11 = a11 * (1 + lam), b22 = a22 * (1 + lam), det = b11 * b22 - a12 * a12;
      const d1 = (b22 * g1 - a12 * g2) / det, d2 = (b11 * g2 - a12 * g1) / det;
      const n1 = k1 * Math.exp(d1), n2 = k2 * Math.exp(d2), rn = res(n1, n2), Sn = ss(rn);
      if (Number.isFinite(Sn) && Sn <= S) {
        const done = Math.abs(d1) < 1e-12 && Math.abs(d2) < 1e-12 || S - Sn < 1e-15 * (1 + S);
        k1 = n1; k2 = n2; r = rn; S = Sn; lam = Math.max(1e-12, lam / 10); improved = true;
        if (done) conv = true;
        break;
      }
      lam *= 10;
    }
    if (!improved || conv) { conv = true; break; }
  }
  // Covariance of (k1, k2) from the Jacobian in the rates themselves.
  const h1 = 1e-6 * k1, h2 = 1e-6 * k2, r0 = res(k1, k2), ra = res(k1 + h1, k2), rb = res(k1, k2 + h2);
  let a11 = 0, a12 = 0, a22 = 0;
  r0.forEach((_, j) => { const p = -(ra[j] - r0[j]) / h1, q = -(rb[j] - r0[j]) / h2; a11 += p * p; a12 += p * q; a22 += q * q; });
  const df = n - 2, s2 = df > 0 ? S / df : NaN, det = a11 * a22 - a12 * a12;
  const v11 = (s2 * a22) / det, v22 = (s2 * a11) / det, v12 = (-s2 * a12) / det;
  const bcf = k1 / k2, seBcf = bcf * Math.sqrt(v11 / (k1 * k1) + v22 / (k2 * k2) - (2 * v12) / (k1 * k2));
  return { k1, k2, se1: Math.sqrt(v11), se2: Math.sqrt(v22), cov: v12, rss: S, n, df, bcf, seBcf, converged: conv, fitted: t.map((x) => f(k1, k2, x)) };
}

/** Growth-corrected depuration rate from fish weight at two times (exponential growth). */
export const growthRate = (w1: number, w2: number, dt: number) => Math.log(w2 / w1) / dt;

/** Normalise a BCF to a reference lipid content (both in %). */
export const lipidNorm = (bcf: number, lipidPct: number, refPct = 5) => (bcf * refPct) / lipidPct;

/** Trophic magnification factor: TMF = 10^slope of log10 concentration on trophic level, with a t-based interval. */
export function tmf(tl: number[], c: number[], conf = 0.95) {
  const n = tl.length, y = c.map((v) => Math.log10(v)), mx = tl.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
  let sxx = 0, sxy = 0, syy = 0; tl.forEach((x, i) => { sxx += (x - mx) ** 2; sxy += (x - mx) * (y[i] - my); syy += (y[i] - my) ** 2; });
  const b = sxy / sxx, a = my - b * mx, rss = Math.max(0, syy - b * sxy), df = n - 2, se = Math.sqrt(rss / df / sxx);
  const tq = tInv(1 - (1 - conf) / 2, df), t = b / se;
  return { slope: b, icept: a, se, r2: syy > 0 ? 1 - rss / syy : 1, df, p: tTwoSided(t, df), tmf: 10 ** b, lo: 10 ** (b - tq * se), hi: 10 ** (b + tq * se) };
}
