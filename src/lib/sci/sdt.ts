// Signal detection theory: d′, criterion c, β, A′ and B″ from a yes/no table of hits, misses, false alarms
// and correct rejections, and ROC curves from confidence-rating data (z-ROC line and the unequal-variance
// Gaussian model fitted by maximum likelihood, Dorfman and Alf 1969). Plain maths, no DOM.
import { normCdf, normInv, logGamma } from './stats.ts';
import { nelderMead, hessian, invert } from './sdt-optim.ts';

export type Correction = 'none' | 'loglinear' | 'half';
export type YesNo = { hits: number; misses: number; fas: number; crs: number };
export type SdtResult = {
  H: number; F: number; rawH: number; rawF: number; nS: number; nN: number; corrected: boolean;
  zH: number; zF: number; dprime: number; c: number; cRel: number; beta: number; lnBeta: number;
  aPrime: number; bDoublePrime: number; azEqual: number; pc: number; se: number; ci: [number, number];
};

const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/**
 * Hit and false-alarm rates with an optional correction for rates of 0 or 1:
 * 'loglinear' adds 0.5 to every cell (Hautus 1995), applied to all data; 'half' replaces 0 by 0.5/N and
 * 1 by 1 − 0.5/N (Macmillan and Kaplan 1985), applied only where needed; 'none' leaves them as they are.
 */
export function rates(t: YesNo, corr: Correction) {
  const nS = t.hits + t.misses, nN = t.fas + t.crs;
  const rawH = t.hits / nS, rawF = t.fas / nN;
  let H = rawH, F = rawF, corrected = false;
  if (corr === 'loglinear') { H = (t.hits + 0.5) / (nS + 1); F = (t.fas + 0.5) / (nN + 1); corrected = true; }
  else if (corr === 'half') {
    if (H === 0) { H = 0.5 / nS; corrected = true; } else if (H === 1) { H = 1 - 0.5 / nS; corrected = true; }
    if (F === 0) { F = 0.5 / nN; corrected = true; } else if (F === 1) { F = 1 - 0.5 / nN; corrected = true; }
  }
  return { H, F, rawH, rawF, nS, nN, corrected };
}

/** Yes/no signal detection measures. d′ = z(H) − z(F), c = −(z(H) + z(F))/2, ln β = d′·c. */
export function yesNo(t: YesNo, corr: Correction = 'loglinear'): SdtResult {
  for (const v of [t.hits, t.misses, t.fas, t.crs]) if (!(v >= 0) || !Number.isFinite(v)) throw new Error('Counts must be numbers of zero or more.');
  if (t.hits + t.misses <= 0) throw new Error('There must be at least one signal trial (hits + misses).');
  if (t.fas + t.crs <= 0) throw new Error('There must be at least one noise trial (false alarms + correct rejections).');
  const r = rates(t, corr), { H, F } = r;
  const zH = normInv(H), zF = normInv(F);
  const dprime = zH - zF, c = -(zH + zF) / 2, lnBeta = dprime * c;
  // A′ and B″ (Grier 1971), with the mirror forms when F > H.
  const aPrime = H === F ? 0.5 : H > F ? 0.5 + ((H - F) * (1 + H - F)) / (4 * H * (1 - F)) : 0.5 - ((F - H) * (1 + F - H)) / (4 * F * (1 - H));
  const a = H * (1 - H), b = F * (1 - F);
  const bDoublePrime = a + b === 0 ? 0 : H >= F ? (a - b) / (a + b) : (b - a) / (a + b);
  // Variance of d′ (Gourevitch and Galanter 1967).
  const v = (H * (1 - H)) / (r.nS * phi(zH) ** 2) + (F * (1 - F)) / (r.nN * phi(zF) ** 2), se = Math.sqrt(v);
  return {
    ...r, zH, zF, dprime, c, cRel: c / dprime, beta: Math.exp(lnBeta), lnBeta, aPrime, bDoublePrime,
    azEqual: normCdf(dprime / Math.SQRT2), pc: (t.hits + t.crs) / (r.nS + r.nN), se, ci: [dprime - 1.959963984540054 * se, dprime + 1.959963984540054 * se],
  };
}

// ---------- ROC from confidence ratings ----------

export type RocPoint = { F: number; H: number; zF: number; zH: number };
export type RocFit = {
  k: number; S: number; N: number; points: RocPoint[];
  /** Area under the observed points joined by straight lines, from (0,0) to (1,1). */
  areaTrap: number;
  /** Least squares line through the z-transformed points: zH = a + b·zF. */
  ls: { a: number; b: number; r2: number; az: number; da: number; n: number } | null;
  /** Maximum likelihood unequal-variance Gaussian model (Dorfman and Alf 1969). */
  ml: { a: number; b: number; mu: number; sigma: number; az: number; da: number; seA: number; seB: number; seAz: number; criteria: number[]; logLik: number; g2: number; df: number; p: number; converged: boolean } | null;
};

/**
 * ROC from rating counts. `signal[i]` and `noise[i]` are the numbers of signal and noise trials given
 * rating category i, ordered from "surest it was a signal" (i = 0) to "surest it was noise".
 */
export function roc(signal: number[], noise: number[]): RocFit {
  const k = signal.length;
  if (k < 2 || noise.length !== k) throw new Error('Give at least two rating categories, with a signal count and a noise count for each.');
  if ([...signal, ...noise].some((v) => !(v >= 0) || !Number.isFinite(v))) throw new Error('Counts must be numbers of zero or more.');
  const S = signal.reduce((s, x) => s + x, 0), N = noise.reduce((s, x) => s + x, 0);
  if (S <= 0 || N <= 0) throw new Error('Both the signal and the noise column need at least one trial.');
  const points: RocPoint[] = [];
  let cs = 0, cn = 0;
  for (let j = 0; j < k - 1; j++) {
    cs += signal[j]; cn += noise[j];
    const H = cs / S, F = cn / N;
    points.push({ F, H, zF: normInv(F), zH: normInv(H) });
  }
  const all = [{ F: 0, H: 0 }, ...points, { F: 1, H: 1 }];
  let areaTrap = 0;
  for (let i = 1; i < all.length; i++) areaTrap += ((all[i].F - all[i - 1].F) * (all[i].H + all[i - 1].H)) / 2;

  const inner = points.filter((p) => p.H > 0 && p.H < 1 && p.F > 0 && p.F < 1);
  let ls: RocFit['ls'] = null;
  if (inner.length >= 2 && new Set(inner.map((p) => p.zF)).size >= 2) {
    const x = inner.map((p) => p.zF), y = inner.map((p) => p.zH), n = x.length;
    const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
    let sxx = 0, sxy = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); syy += (y[i] - my) ** 2; }
    const b = sxy / sxx, a = my - b * mx;
    ls = { a, b, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1, az: normCdf(a / Math.sqrt(1 + b * b)), da: a * Math.sqrt(2 / (1 + b * b)), n: inner.length };
  }
  return { k, S, N, points, areaTrap, ls, ml: k >= 3 ? fitMl(signal, noise, ls) : null };
}

/** Negative log likelihood of the rating counts under noise ~ N(0,1), signal ~ N(mu, sigma). */
function nll(theta: number[], signal: number[], noise: number[]) {
  const k = signal.length, mu = theta[0], sigma = Math.exp(theta[1]);
  // Criteria t_1 > t_2 > … > t_{k−1}; theta[2] is the lowest, the rest are log gaps upwards.
  const t = new Array(k - 1);
  t[k - 2] = theta[2];
  for (let j = k - 3; j >= 0; j--) t[j] = t[j + 1] + Math.exp(theta[2 + (k - 2 - j)]);
  let L = 0;
  for (let i = 0; i < k; i++) {
    const up = i === 0 ? Infinity : t[i - 1], lo = i === k - 1 ? -Infinity : t[i];
    const pn = (up === Infinity ? 1 : normCdf(up)) - (lo === -Infinity ? 0 : normCdf(lo));
    const ps = (up === Infinity ? 1 : normCdf((up - mu) / sigma)) - (lo === -Infinity ? 0 : normCdf((lo - mu) / sigma));
    if (noise[i] > 0) L += noise[i] * Math.log(Math.max(pn, 1e-300));
    if (signal[i] > 0) L += signal[i] * Math.log(Math.max(ps, 1e-300));
  }
  return { nll: -L, t };
}

function fitMl(signal: number[], noise: number[], ls: RocFit['ls']): RocFit['ml'] {
  const k = signal.length, S = signal.reduce((s, x) => s + x, 0), N = noise.reduce((s, x) => s + x, 0);
  // Start: criteria from the (slightly smoothed) false-alarm rates, mu and sigma from the LS line.
  const t0: number[] = [];
  let cn = 0;
  for (let j = 0; j < k - 1; j++) { cn += noise[j]; t0.push(-normInv((cn + 0.5) / (N + 1))); }
  for (let j = k - 3; j >= 0; j--) if (t0[j] <= t0[j + 1] + 0.01) t0[j] = t0[j + 1] + 0.05;
  const b0 = ls && ls.b > 0.05 && ls.b < 20 ? ls.b : 1, a0 = ls ? ls.a : 1;
  const th0 = [a0 / b0, Math.log(1 / b0), t0[k - 2]];
  for (let j = k - 3; j >= 0; j--) th0.push(Math.log(t0[j] - t0[j + 1]));
  const f = (th: number[]) => nll(th, signal, noise).nll;
  const m = nelderMead(f, th0, { step: th0.map(() => 0.3), maxIter: 20000, tol: 1e-13, restarts: 6 });
  const th = m.x, mu = th[0], sigma = Math.exp(th[1]);
  const a = mu / sigma, b = 1 / sigma;
  const az = normCdf(mu / Math.sqrt(1 + sigma * sigma)), da = a * Math.sqrt(2 / (1 + b * b));
  // Standard errors from the observed information (numerical Hessian) and the delta method.
  const cov = invert(hessian(f, th, th.map(() => 1e-4)));
  const se = (g: (th: number[]) => number) => {
    if (!cov) return NaN;
    const h = 1e-6, grad = th.map((_, i) => { const p = th.slice(), q = th.slice(); p[i] += h; q[i] -= h; return (g(p) - g(q)) / (2 * h); });
    let v = 0; for (let i = 0; i < th.length; i++) for (let j = 0; j < th.length; j++) v += grad[i] * cov[i][j] * grad[j];
    return v >= 0 ? Math.sqrt(v) : NaN;
  };
  const { t } = nll(th, signal, noise);
  // Goodness of fit: G² against the saturated model, df = 2(k − 1) − (k + 1) = k − 3.
  let g2 = 0;
  for (let i = 0; i < k; i++) {
    const up = i === 0 ? Infinity : t[i - 1], lo = i === k - 1 ? -Infinity : t[i];
    const pn = (up === Infinity ? 1 : normCdf(up)) - (lo === -Infinity ? 0 : normCdf(lo));
    const ps = (up === Infinity ? 1 : normCdf((up - mu) / sigma)) - (lo === -Infinity ? 0 : normCdf((lo - mu) / sigma));
    if (noise[i] > 0) g2 += 2 * noise[i] * Math.log(noise[i] / (N * pn));
    if (signal[i] > 0) g2 += 2 * signal[i] * Math.log(signal[i] / (S * ps));
  }
  const df = k - 3;
  return {
    a, b, mu, sigma, az, da,
    seA: se((p) => p[0] / Math.exp(p[1])), seB: se((p) => 1 / Math.exp(p[1])), seAz: se((p) => normCdf(p[0] / Math.sqrt(1 + Math.exp(2 * p[1])))),
    criteria: t, logLik: -m.f, g2: Math.max(0, g2), df, p: df > 0 ? chi2Sf(Math.max(0, g2), df) : NaN, converged: m.converged,
  };
}

/** Upper tail of chi-square, from the regularised lower incomplete gamma function. */
export function chi2Sf(x: number, df: number): number {
  if (x <= 0) return 1;
  const a = df / 2, z = x / 2;
  if (z < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 1000; n++) { term *= z / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-15) break; }
    return 1 - sum * Math.exp(-z + a * Math.log(z) - logGamma(a));
  }
  // Continued fraction for the upper tail (Lentz).
  let b = z + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.exp(-z + a * Math.log(z) - logGamma(a)) * h;
}

/** Points on the fitted ROC curve in probability space, for drawing: zH = a + b·zF. */
export function rocCurve(a: number, b: number, n = 120): { F: number[]; H: number[] } {
  const F: number[] = [0], H: number[] = [0];
  for (let i = 1; i < n; i++) { const z = -4 + (8 * i) / n; F.push(normCdf(z)); H.push(normCdf(a + b * z)); }
  F.push(1); H.push(1);
  return { F, H };
}
