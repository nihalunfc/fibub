// Statistics for data with non-detects (left-censored at one or more detection or reporting limits), after Helsel's
// methods: Kaplan–Meier on the flipped data (nonparametric), robust regression on order statistics (ROS, log-normal for
// the non-detects only), maximum likelihood for a censored log-normal, and the simple substitutions for comparison.
// No DOM.
import { normCdf, normInv } from './stats.ts';

export type Obs = { v: number; nd: boolean }; // nd: true when the value is a detection limit ("<v")

/** Read "<5", "ND 5", "nd<5" or "5" (with an optional flag cell such as "<", "ND", "U", "1", "true"). */
export function parseObs(cell: string, flag?: string): Obs | null {
  let s = cell.trim(), nd = false;
  const m = /^(?:nd|n\.d\.|<|less than)\s*<?\s*(.*)$/i.exec(s);
  if (m) { nd = true; s = m[1]; }
  const t = s.replace(/,/g, '.').replace(/\s+/g, ''), v = Number(t);
  if (t === '' || !Number.isFinite(v)) return null;
  if (flag !== undefined) { const f = flag.trim().toLowerCase(); if (['<', 'nd', 'u', '1', 'true', 'yes', 'y', 'censored', 'non-detect', 'nondetect'].includes(f)) nd = true; }
  return { v, nd };
}

export type KM = {
  steps: { x: number; F: number; Fbelow: number; d: number; n: number }[]; // F = P(X ≤ x); Fbelow = P(X < x)
  mean: number; se: number; floor: number; leftover: number;
  q: (p: number) => number; // NaN when the percentile is below the lowest limit
};

/** Kaplan–Meier estimate of the distribution of left-censored data (flipped; restricted mean). */
export function kaplanMeier(obs: Obs[]): KM {
  const det = [...new Set(obs.filter((o) => !o.nd).map((o) => o.v))].sort((a, b) => b - a);
  const floor = Math.min(...obs.map((o) => o.v));
  let S = 1; // P(X ≤ current x) going down from the top
  const steps: KM['steps'] = [];
  for (const x of det) {
    const d = obs.filter((o) => !o.nd && o.v === x).length, n = obs.filter((o) => o.v <= x).length;
    const F = S; S *= 1 - d / n;
    steps.push({ x, F, Fbelow: S, d, n });
  }
  const leftover = S; // mass below the lowest detect, placed at the lowest value of all (restricted mean)
  let mean = leftover * floor;
  for (const s of steps) mean += (s.F - s.Fbelow) * s.x;
  // Greenwood variance of the restricted mean, on the flipped scale: Σ A_j² d_j / (n_j (n_j − d_j)), A_j the area beyond event j.
  let v = 0;
  for (let j = 0; j < steps.length; j++) {
    const s = steps[j]; if (s.n - s.d <= 0) continue;
    // Area under the flipped survival curve from this event to the end = ∫ from floor to x_j of F(x) dx (below the step).
    let A = 0;
    for (let k = j; k < steps.length; k++) { const lo = k + 1 < steps.length ? steps[k + 1].x : floor; A += steps[k].Fbelow * (steps[k].x - lo); }
    v += (A * A * s.d) / (s.n * (s.n - s.d));
  }
  const asc = [...steps].reverse();
  // Smallest detected value whose cumulative share reaches p; below the leftover mass the answer is under the lowest limit.
  const q = (p: number) => { if (p <= leftover + 1e-12) return NaN; for (const st of asc) if (st.F >= p - 1e-12) return st.x; return asc.length ? asc[asc.length - 1].x : NaN; };
  return { steps, mean, se: Math.sqrt(v), floor, leftover, q };
}

/** Robust ROS (Helsel and Cohn): plotting positions with several limits, log-normal regression of the detects, non-detects imputed. */
export function ros(obs: Obs[]) {
  const n = obs.length, limits = [...new Set(obs.filter((o) => o.nd).map((o) => o.v))].sort((a, b) => a - b);
  const det = obs.filter((o) => !o.nd);
  // Exceedance probability above each limit (Hirsch and Stedinger), from the highest limit down.
  const L = [...limits, Infinity], pe = new Array(L.length).fill(0);
  for (let j = L.length - 2; j >= 0; j--) {
    const A = det.filter((o) => o.v >= L[j] && o.v < L[j + 1]).length;
    const B = obs.filter((o) => (o.nd ? o.v <= L[j] : o.v < L[j])).length;
    pe[j] = A + B > 0 ? pe[j + 1] + (A / (A + B)) * (1 - pe[j + 1]) : pe[j + 1];
  }
  const peAt = (j: number) => (j < 0 ? 1 : pe[j]);
  const pp = new Array<number>(n).fill(NaN);
  // Detects in each band [L_j, L_{j+1}) spread between the two exceedance probabilities.
  for (let j = -1; j < L.length - 1; j++) {
    const lo = j < 0 ? -Infinity : L[j], hi = L[j + 1];
    const idx = obs.map((o, i) => i).filter((i) => !obs[i].nd && obs[i].v >= lo && obs[i].v < hi).sort((a, b) => obs[a].v - obs[b].v || a - b);
    const A = idx.length, top = peAt(j), bot = pe[j + 1];
    idx.forEach((i, r) => { pp[i] = 1 - top + ((r + 1) / (A + 1)) * (top - bot); });
  }
  // Non-detects at each limit spread below it.
  limits.forEach((lim, j) => {
    const idx = obs.map((o, i) => i).filter((i) => obs[i].nd && obs[i].v === lim);
    const C = idx.length, below = 1 - peAt(j);
    idx.forEach((i, r) => { pp[i] = ((r + 1) / (C + 1)) * below; });
  });
  const z = pp.map((p) => normInv(p));
  const di = obs.map((_, i) => i).filter((i) => !obs[i].nd);
  const zx = di.map((i) => z[i]), ly = di.map((i) => Math.log(obs[i].v));
  const mz = zx.reduce((a, b) => a + b, 0) / zx.length, my = ly.reduce((a, b) => a + b, 0) / ly.length;
  let sxx = 0, sxy = 0; zx.forEach((v, k) => { sxx += (v - mz) ** 2; sxy += (v - mz) * (ly[k] - my); });
  const slope = sxx > 0 ? sxy / sxx : 0, icept = my - slope * mz;
  const values = obs.map((o, i) => (o.nd ? Math.exp(icept + slope * z[i]) : o.v));
  const m = values.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(values.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  return { values, pp, z, slope, icept, mean: m, sd, limits, pe };
}

/** Maximum likelihood fit of a log-normal to censored data. μ and σ are on the natural-log scale. */
export function mleLognormal(obs: Obs[], start?: [number, number]) {
  const y = obs.map((o) => Math.log(o.v)), nd = obs.map((o) => o.nd);
  const ll = (mu: number, s: number) => y.reduce((a, v, i) => { const z = (v - mu) / s; return a + (nd[i] ? Math.log(Math.max(1e-300, normCdf(z))) : -Math.log(s) - 0.5 * z * z - 0.5 * Math.log(2 * Math.PI)); }, 0);
  const grad = (mu: number, s: number) => {
    let g1 = 0, g2 = 0;
    y.forEach((v, i) => {
      const z = (v - mu) / s;
      if (nd[i]) { const P = Math.max(1e-300, normCdf(z)), lam = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI) / P; g1 -= lam / s; g2 -= (lam * z) / s; }
      else { g1 += z / s; g2 += (z * z - 1) / s; }
    });
    return [g1, g2];
  };
  const dets = y.filter((_, i) => !nd[i]);
  let mu = start ? start[0] : dets.reduce((a, b) => a + b, 0) / dets.length, s = start ? start[1] : Math.max(0.1, Math.sqrt(dets.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, dets.length - 1)));
  let it = 0;
  for (; it < 200; it++) {
    const [g1, g2] = grad(mu, s), h = 1e-6 * (1 + Math.abs(mu)), hs = 1e-6 * s;
    const [a1, a2] = grad(mu + h, s), [b1, b2] = grad(mu, s + hs);
    const H11 = (a1 - g1) / h, H12 = ((a2 - g2) / h + (b1 - g1) / hs) / 2, H22 = (b2 - g2) / hs, det = H11 * H22 - H12 * H12;
    let dm: number, ds: number;
    if (det > 0 && H11 < 0) { dm = -(H22 * g1 - H12 * g2) / det; ds = -(H11 * g2 - H12 * g1) / det; } else { dm = 0.1 * g1 * s * s; ds = 0.1 * g2 * s * s; }
    const L0 = ll(mu, s); let k = 0;
    while ((s + ds <= 0 || ll(mu + dm, s + ds) < L0 - 1e-12) && k < 40) { dm /= 2; ds /= 2; k++; }
    mu += dm; s += ds;
    if (Math.abs(dm) < 1e-11 * (1 + Math.abs(mu)) && Math.abs(ds) < 1e-11 * s) break;
  }
  return { mu, sigma: s, logLik: ll(mu, s), mean: Math.exp(mu + (s * s) / 2), sd: Math.exp(mu + (s * s) / 2) * Math.sqrt(Math.exp(s * s) - 1), median: Math.exp(mu), q: (p: number) => Math.exp(mu + s * normInv(p)), converged: it < 200 };
}

/** Mean and standard deviation after replacing each non-detect by a fraction of its limit (0, ½ or 1). */
export function substitute(obs: Obs[], f: number) {
  const v = obs.map((o) => (o.nd ? f * o.v : o.v)), n = v.length, m = v.reduce((a, b) => a + b, 0) / n;
  return { mean: m, sd: Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)), values: v };
}

/** Percentile of a sample (Weibull plotting position i/(n+1), as Helsel uses for imputed ROS values). */
export function percentile(v: number[], p: number) {
  const s = [...v].sort((a, b) => a - b), n = s.length, h = p * (n + 1);
  if (h <= 1) return s[0]; if (h >= n) return s[n - 1];
  const i = Math.floor(h); return s[i - 1] + (h - i) * (s[i] - s[i - 1]);
}
