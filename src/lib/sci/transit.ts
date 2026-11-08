// Exoplanet transit light curves: a planet of radius ratio k crossing a limb-darkened star (quadratic law) on a
// circular orbit, and a least-squares fit of depth, duration and impact parameter to measured brightness.
import { nelderMead, invert } from './rvfit.ts';

/** Fraction of a uniform disc (radius 1) covered by a disc of radius p at centre distance z. */
export function overlapUniform(z: number, p: number) {
  if (z >= 1 + p) return 0;
  if (z <= Math.abs(1 - p)) return p <= 1 ? p * p : 1;
  const k0 = Math.acos((p * p + z * z - 1) / (2 * p * z)), k1 = Math.acos((1 - p * p + z * z) / (2 * z));
  return (p * p * k0 + k1 - 0.5 * Math.sqrt(Math.max(0, 4 * z * z - (1 + z * z - p * p) ** 2))) / Math.PI;
}

/** Intensity of the quadratic limb-darkening law at radius r (0 centre, 1 limb), centre = 1. */
export const intensity = (r: number, u1: number, u2: number) => { const m = 1 - Math.sqrt(Math.max(0, 1 - r * r)); return 1 - u1 * m - u2 * m * m; };

// Integral of f over [a, b] with the substitution r = a + (b − a)(1 − cos t)/2, which handles the square-root
// behaviour at both ends (the planet's edge and the star's limb) without many points.
function cosInt(f: (r: number) => number, a: number, b: number, n = 96) {
  if (b <= a) return 0;
  let s = 0; const h = Math.PI / n;
  for (let i = 0; i < n; i++) { const t = (i + 0.5) * h; s += f(a + ((b - a) * (1 - Math.cos(t))) / 2) * ((b - a) / 2) * Math.sin(t); }
  return s * h;
}

/** Fraction of the star's light blocked by a planet of radius ratio p at projected separation z (in stellar radii). */
export function blocked(z: number, p: number, u1 = 0, u2 = 0) {
  z = Math.abs(z);
  if (p <= 0 || z >= 1 + p) return 0;
  if (u1 === 0 && u2 === 0) return overlapUniform(z, p);
  const total = Math.PI * (1 - u1 / 3 - u2 / 6);
  // Arc of the ring at radius r that lies inside the planet, times the ring's brightness.
  const arc = (r: number) => {
    if (r <= 0) return 0;
    let th: number;
    if (z === 0) th = r < p ? Math.PI : 0;
    else { const c = (r * r + z * z - p * p) / (2 * r * z); th = c <= -1 ? Math.PI : c >= 1 ? 0 : Math.acos(c); }
    return 2 * r * th * intensity(r, u1, u2);
  };
  const lo = Math.max(0, z - p), hi = Math.min(1, z + p), mid = Math.abs(p - z);
  const cuts = [lo, ...(mid > lo && mid < hi ? [mid] : []), hi];
  let s = 0; for (let i = 0; i + 1 < cuts.length; i++) s += cosInt(arc, cuts[i], cuts[i + 1]);
  return s / total;
}

export type TransitModel = { T0: number; P: number; k: number; aR: number; b: number; F0: number; u1: number; u2: number };

/** Projected separation (stellar radii) at time t on a circular orbit; Infinity on the far side. */
export function separation(t: number, m: Pick<TransitModel, 'T0' | 'P' | 'aR' | 'b'>) {
  const ph = (2 * Math.PI * (t - m.T0)) / m.P, ci = m.b / m.aR;
  if (Math.cos(ph) < 0) return Infinity;
  return m.aR * Math.sqrt(Math.sin(ph) ** 2 + ci * ci * Math.cos(ph) ** 2);
}

/** Model brightness at time t. `texp` (same unit as t) averages over the exposure with 7 sub-samples. */
export function fluxAt(t: number, m: TransitModel, texp = 0) {
  if (!(texp > 0)) return m.F0 * (1 - blocked(separation(t, m), m.k, m.u1, m.u2));
  let s = 0; for (let i = 0; i < 7; i++) s += 1 - blocked(separation(t + ((i + 0.5) / 7 - 0.5) * texp, m), m.k, m.u1, m.u2);
  return (m.F0 * s) / 7;
}

/** Total (first to fourth contact) and full (second to third) durations, in the unit of P (Winn 2010, eq. 14–15). */
export function durations(m: Pick<TransitModel, 'P' | 'k' | 'aR' | 'b'>) {
  const si = Math.sqrt(Math.max(0, 1 - (m.b / m.aR) ** 2));
  const f = (x: number) => (x <= 0 ? 0 : (m.P / Math.PI) * Math.asin(Math.min(1, Math.sqrt(x) / (m.aR * si))));
  return { t14: f((1 + m.k) ** 2 - m.b * m.b), t23: f((1 - m.k) ** 2 - m.b * m.b) };
}

/** Mean stellar density (g/cm³) from a/R* and the period in days (Seager and Mallén-Ornelas 2003). */
export const stellarDensity = (aR: number, Pdays: number) => (3 * Math.PI * aR ** 3) / (6.674e-8 * (Pdays * 86400) ** 2);
/** a/R* for a given stellar density (g/cm³) and period (days), the inverse of stellarDensity. */
export const aRFromDensity = (rho: number, Pdays: number) => Math.cbrt((rho * 6.674e-8 * (Pdays * 86400) ** 2) / (3 * Math.PI));

/** Phase-fold times to −P/2 … P/2 around T0. */
export const fold = (t: number, T0: number, P: number) => ((((t - T0) % P) + 1.5 * P) % P) - P / 2;

export type TransitFit = {
  m: TransitModel; err: { T0: number; k: number; aR: number; b: number; F0: number };
  cov: number[][] | null; chi2: number; dof: number; redChi2: number; rms: number;
  derived: (fn: (m: TransitModel) => number) => { v: number; e: number };
};

/** Fit T0, k, a/R*, b and the out-of-transit level to times t and brightness f (errors df, or null to estimate
 *  them from the scatter). P, u1 and u2 are held fixed. */
export function fitTransit(t: number[], f: number[], df: number[] | null, opts: { P: number; u1: number; u2: number; T0?: number; texp?: number }): TransitFit {
  const n = t.length, P = opts.P;
  if (n < 10) throw new Error('Give at least 10 points to fit a transit.');
  if (!(P > 0)) throw new Error('Give the orbital period.');
  const sorted = [...f].sort((a, b) => a - b), F0g = sorted[Math.floor(n * 0.75)];
  // First guess of the mid-transit time: the deepest bin of the folded curve.
  let T0 = opts.T0;
  if (T0 === undefined || !Number.isFinite(T0)) {
    const nb = 200, s = new Array(nb).fill(0), c = new Array(nb).fill(0);
    for (let i = 0; i < n; i++) { const b = Math.min(nb - 1, Math.floor(((((t[i] - t[0]) % P) + P) % P / P) * nb)); s[b] += f[i]; c[b]++; }
    let best = -1, bv = Infinity;
    for (let b = 0; b < nb; b++) { if (!c[b]) continue; let ss = 0, cc = 0; for (let d = -2; d <= 2; d++) { const j = (b + d + nb) % nb; ss += s[j]; cc += c[j]; } const v = ss / cc; if (v < bv) { bv = v; best = b; } }
    T0 = t[0] + ((best + 0.5) / nb) * P;
  }
  // Put T0 near the middle of the data so its error is not inflated by the period's.
  const tm = (t[0] + t[n - 1]) / 2; T0 += Math.round((tm - T0) / P) * P;
  const depth = Math.max(1e-5, 1 - Math.min(...sorted.slice(0, Math.max(1, Math.floor(n * 0.02)))) / F0g);
  const k0 = Math.sqrt(depth);
  // Duration guess: the span of folded points below half depth.
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < n; i++) if (f[i] < F0g * (1 - depth / 2)) { const ph = fold(t[i], T0, P); if (Math.abs(ph) < P / 4) { lo = Math.min(lo, ph); hi = Math.max(hi, ph); } }
  const T14g = Number.isFinite(hi - lo) && hi > lo ? (hi - lo) * 1.1 : P / 20;
  const err = df ?? new Array(n).fill(1);
  const sc = [P / 200, 1, 1, 1, 1];
  const toM = (x: number[]): TransitModel => ({ T0: T0! + x[0] * sc[0], P, k: Math.exp(x[1]), aR: Math.exp(x[2]), b: Math.abs(x[3]), F0: F0g * (1 + x[4] * 1e-3), u1: opts.u1, u2: opts.u2 });
  const chi = (x: number[]) => {
    const m = toM(x);
    if (m.aR < 1.05 || m.b > 1 + m.k || m.k > 0.9) return 1e30;
    let s = 0; for (let i = 0; i < n; i++) s += ((f[i] - fluxAt(t[i], m, opts.texp)) / err[i]) ** 2;
    return s;
  };
  let best: number[] = [], bc = Infinity;
  for (const b of [0.1, 0.5, 0.85]) {
    const aR = Math.max(1.5, (P / (Math.PI * T14g)) * Math.sqrt(Math.max(0.05, (1 + k0) ** 2 - b * b)));
    const x0 = [0, Math.log(k0 * 1.05), Math.log(aR), b, 0];
    const x = nelderMead(chi, x0, [0.2, 0.1, 0.15, 0.15, 0.3], 900), c = chi(x);
    if (c < bc) { bc = c; best = x; }
  }
  let x = nelderMead(chi, best, [0.05, 0.03, 0.05, 0.05, 0.1], 1500);
  x = nelderMead(chi, x, [0.01, 0.005, 0.01, 0.01, 0.02], 1500);
  const m = toM(x), chi2 = chi(x), dof = Math.max(1, n - 5);
  let rs = 0; for (let i = 0; i < n; i++) rs += (f[i] - fluxAt(t[i], m, opts.texp)) ** 2;
  const rms = Math.sqrt(rs / n) / m.F0;
  // Covariance in the natural parameters (T0, k, aR, b, F0) from the Jacobian of the scaled residuals.
  const vec = (m2: TransitModel) => [m2.T0, m2.k, m2.aR, m2.b, m2.F0];
  const fromVec = (v: number[]): TransitModel => ({ ...m, T0: v[0], k: v[1], aR: v[2], b: Math.abs(v[3]), F0: v[4] });
  const p0 = vec(m), hs = [P * 1e-5, m.k * 1e-3, m.aR * 1e-3, 1e-3, m.F0 * 1e-5];
  const res = (v: number[]) => { const mm = fromVec(v); return t.map((ti, i) => (f[i] - fluxAt(ti, mm, opts.texp)) / err[i]); };
  const J = p0.map((_, j) => { const up = [...p0], dn = [...p0]; up[j] += hs[j]; dn[j] -= hs[j]; const a = res(up), c = res(dn); return a.map((q, i) => (q - c[i]) / (2 * hs[j])); });
  let cov = invert(p0.map((_, i) => p0.map((__, j) => J[i].reduce((acc, q, kk) => acc + q * J[j][kk], 0))));
  // Without given errors, scale so the reduced χ² is 1 (errors estimated from the scatter).
  if (cov && !df) cov = cov.map((r) => r.map((c) => c * (chi2 / dof)));
  const e = (i: number) => (cov ? Math.sqrt(Math.max(0, cov[i][i])) : NaN);
  const derived = (fn: (mm: TransitModel) => number) => {
    const v = fn(m);
    if (!cov) return { v, e: NaN };
    const g = p0.map((_, j) => { const up = [...p0], dn = [...p0]; up[j] += hs[j]; dn[j] -= hs[j]; return (fn(fromVec(up)) - fn(fromVec(dn))) / (2 * hs[j]); });
    let s = 0; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) s += g[i] * cov[i][j] * g[j];
    return { v, e: Math.sqrt(Math.max(0, s)) };
  };
  const out = df ? chi2 : dof;
  return { m, err: { T0: e(0), k: e(1), aR: e(2), b: e(3), F0: e(4) }, cov, chi2: out, dof, redChi2: out / dof, rms, derived };
}

/** A simulated hot-Jupiter transit (times in days, relative flux) with 1 ppt noise, for the example. */
export function simulatedTransit(seed = 7) {
  const m: TransitModel = { T0: 2460000.5, P: 3.52474859, k: 0.1205, aR: 8.8, b: 0.5, F0: 1, u1: 0.4, u2: 0.25 };
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const t: number[] = [], f: number[] = [];
  for (let x = m.T0 - 0.18; x <= m.T0 + 0.18; x += 2 / 1440) { t.push(+x.toFixed(5)); f.push(+(fluxAt(x, m) + 0.001 * gauss()).toFixed(5)); }
  return { t, f, m };
}
