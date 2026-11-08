// Fit a Keplerian orbit to radial velocities: period, semi-amplitude K, eccentricity, argument of periastron ω,
// time of periastron and systemic velocity γ, with uncertainties from the covariance matrix.
import { lombScargle, peaks } from './lombscargle.ts';

const TAU = 2 * Math.PI;
/** True anomaly at time t for period P, eccentricity e and periastron time tp. */
export function trueAnomaly(t: number, P: number, e: number, tp: number) {
  const M = (((TAU * (t - tp)) / P) % TAU + TAU) % TAU;
  let E = e < 0.8 ? M : Math.PI;
  for (let k = 0; k < 60; k++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; }
  return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
}
export type Orbit = { P: number; K: number; e: number; w: number; tp: number; gamma: number };
/** Radial velocity: γ + K [cos(ν + ω) + e cos ω], ω in radians. */
export const rv = (t: number, o: Orbit) => { const nu = trueAnomaly(t, o.P, o.e, o.tp); return o.gamma + o.K * (Math.cos(nu + o.w) + o.e * Math.cos(o.w)); };

// For fixed P, e and tp the model is linear: v = c + a cos ν + b sin ν, with a = K cos ω and b = −K sin ω.
function linear(t: number[], v: number[], wt: number[], P: number, e: number, tp: number) {
  const n = t.length, S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], R = [0, 0, 0];
  const cols = t.map((x) => { const nu = trueAnomaly(x, P, e, tp); return [1, Math.cos(nu), Math.sin(nu)]; });
  for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) { R[j] += wt[i] * cols[i][j] * v[i]; for (let k = 0; k < 3; k++) S[j][k] += wt[i] * cols[i][j] * cols[i][k]; }
  const x = solve(S, R); if (!x) return null;
  let chi = 0; for (let i = 0; i < n; i++) { const m = x[0] + x[1] * cols[i][1] + x[2] * cols[i][2]; chi += wt[i] * (v[i] - m) ** 2; }
  const K = Math.hypot(x[1], x[2]), w = Math.atan2(-x[2], x[1]);
  return { chi, o: { P, K, e, w, tp, gamma: x[0] - K * e * Math.cos(w) } as Orbit };
}
/** Gaussian elimination with partial pivoting; null if singular. */
export function solve(M: number[][], b: number[]) {
  const n = b.length, a = M.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    if (Math.abs(a[p][c]) < 1e-300) return null;
    [a[c], a[p]] = [a[p], a[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = a[r][c] / a[c][c]; for (let k = c; k <= n; k++) a[r][k] -= f * a[c][k]; }
  }
  return a.map((r, i) => r[n] / r[i]);
}
function invert(M: number[][]) {
  const n = M.length, out: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const e = new Array(n).fill(0); e[j] = 1; const x = solve(M, e); if (!x) return null; for (let i = 0; i < n; i++) out[i][j] = x[i]; }
  return out;
}

/** Nelder-Mead minimiser. */
function nelderMead(f: (x: number[]) => number, x0: number[], step: number[], iters = 600) {
  const n = x0.length; let pts = [x0, ...step.map((s, i) => x0.map((v, j) => (j === i ? v + s : v)))], fs = pts.map(f);
  for (let it = 0; it < iters; it++) {
    const idx = fs.map((_, i) => i).sort((a, b) => fs[a] - fs[b]); pts = idx.map((i) => pts[i]); fs = idx.map((i) => fs[i]);
    if (Math.abs(fs[n] - fs[0]) < 1e-12 * (Math.abs(fs[0]) + 1e-30)) break;
    const c = new Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += pts[i][j] / n;
    const at = (k: number) => c.map((v, j) => v + k * (pts[n][j] - v));
    const xr = at(-1), fr = f(xr);
    if (fr < fs[0]) { const xe = at(-2), fe = f(xe); if (fe < fr) { pts[n] = xe; fs[n] = fe; } else { pts[n] = xr; fs[n] = fr; } }
    else if (fr < fs[n - 1]) { pts[n] = xr; fs[n] = fr; }
    else { const xc = at(0.5), fc = f(xc); if (fc < fs[n]) { pts[n] = xc; fs[n] = fc; } else { for (let i = 1; i <= n; i++) { pts[i] = pts[i].map((v, j) => pts[0][j] + 0.5 * (v - pts[0][j])); fs[i] = f(pts[i]); } } }
  }
  return pts[0];
}

export type Fit = { o: Orbit; err: Record<keyof Orbit, number>; chi2: number; rms: number; dof: number; redChi2: number; candidates: number[] };

/** Fit an orbit. With no period given, the strongest periodogram peaks between pmin and pmax are tried. */
export function fitOrbit(t: number[], v: number[], dv: number[] | null, opts: { P?: number; pmin?: number; pmax?: number; circular?: boolean } = {}): Fit {
  const n = t.length; if (n < 7 && !opts.circular) throw new Error('An eccentric orbit needs at least 7 velocities (6 numbers are fitted)');
  if (n < 5) throw new Error('Need at least 5 velocities');
  const wt = dv ? dv.map((x) => 1 / (x * x)) : t.map(() => 1), span = Math.max(...t) - Math.min(...t);
  let cands: number[];
  if (opts.P) cands = [opts.P];
  else {
    const pmin = opts.pmin ?? Math.max(span / n / 2, 0.1 * (span / n)), pmax = opts.pmax ?? span * 1.5;
    const pg = lombScargle(t, v, dv, 1 / pmax, 1 / pmin, Math.min(200000, Math.max(2000, Math.ceil(10 * span * (1 / pmin - 1 / pmax)))));
    cands = peaks(pg, 5).map((p) => 1 / p.freq);
  }
  const es = opts.circular ? [0] : [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.88];
  let best: { chi: number; o: Orbit } | null = null;
  for (const P of cands) for (const e of es) for (let k = 0; k < 24; k++) { const r = linear(t, v, wt, P, e, t[0] + (P * k) / 24); if (r && (!best || r.chi < best.chi)) best = r; }
  if (!best) throw new Error('Could not fit an orbit to these numbers');
  // Refine P, e and tp, with γ, K and ω solved exactly at each step. e is kept in [0, 0.98) through a sine map.
  const b0 = best.o, eMap = (x: number) => 0.98 * Math.sin(x) ** 2, eInv = (e: number) => Math.asin(Math.sqrt(Math.min(0.98, e) / 0.98));
  const obj = (x: number[]) => { const r = linear(t, v, wt, x[0], opts.circular ? 0 : eMap(x[1]), x[2]); return r ? r.chi : Infinity; };
  let x = nelderMead(obj, [b0.P, eInv(b0.e) + 0.05, b0.tp], [b0.P * 1e-3, 0.1, b0.P * 0.02]);
  x = nelderMead(obj, x, [x[0] * 1e-4, 0.02, x[0] * 0.005]);
  const o = linear(t, v, wt, x[0], opts.circular ? 0 : eMap(x[1]), x[2])!.o;
  if (o.e < 1e-4) { o.e = 0; }
  // Covariance from the Jacobian of the weighted residuals in (P, K, e, ω, tp, γ). A circle has no periastron, so its
  // zero time is held fixed and ω carries the phase.
  const keys: (keyof Orbit)[] = opts.circular ? ['P', 'K', 'w', 'gamma'] : ['P', 'K', 'e', 'w', 'tp', 'gamma'];
  const res = (oo: Orbit) => t.map((ti, i) => Math.sqrt(wt[i]) * (v[i] - rv(ti, oo)));
  const r0 = res(o), chi2 = r0.reduce((s, r) => s + r * r, 0), dof = n - keys.length;
  const h: Record<string, number> = { P: o.P * 1e-6, K: Math.max(1e-6, o.K * 1e-5), e: 1e-5, w: 1e-5, tp: o.P * 1e-6, gamma: Math.max(1e-6, o.K * 1e-5) };
  const J = keys.map((k) => { const up = { ...o, [k]: o[k] + h[k] }, dn = { ...o, [k]: o[k] - h[k] }; const a = res(up), b = res(dn); return a.map((x2, i) => (x2 - b[i]) / (2 * h[k])); });
  const JTJ = keys.map((_, i) => keys.map((__, j) => J[i].reduce((s, x2, m) => s + x2 * J[j][m], 0)));
  const cov = invert(JTJ), scale = dv ? 1 : chi2 / Math.max(1, dof);
  const err = { P: NaN, K: NaN, e: 0, w: NaN, tp: 0, gamma: NaN } as Record<keyof Orbit, number>;
  if (cov) keys.forEach((k, i) => (err[k] = Math.sqrt(Math.max(0, cov[i][i] * scale))));
  const rms = Math.sqrt(t.reduce((s, ti, i) => s + (v[i] - rv(ti, o)) ** 2, 0) / n);
  // Keep ω in 0..2π and tp as the periastron just before the first measurement.
  o.w = ((o.w % TAU) + TAU) % TAU; o.tp = o.tp - Math.ceil((o.tp - Math.min(...t)) / o.P) * o.P;
  return { o, err, chi2, rms, dof, redChi2: chi2 / Math.max(1, dof), candidates: cands };
}

/** Spectroscopic binary results: mass function (solar masses) and a sin i (km) for K in km/s and P in days. */
export function binary(K: number, P: number, e: number) {
  const G = 6.6743e-11, MSUN = 1.98840987e30, Ps = P * 86400, Km = K * 1000;
  return { fm: (Ps * Km ** 3 * (1 - e * e) ** 1.5) / (2 * Math.PI * G) / MSUN, asini: (Km * Ps * Math.sqrt(1 - e * e)) / (2 * Math.PI) / 1000 };
}
