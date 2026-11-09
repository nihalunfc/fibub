// Aquifer pumping tests: the Theis well function, Theis curve fitting, the Cooper-Jacob straight line,
// distance-drawdown and Theis recovery. SI units inside (m, s, m³/s). Plain maths; no DOM.

import { fitLine, levenbergMarquardt } from './fit.ts';

const EULER = 0.5772156649015329;

/** Theis well function W(u) = E1(u), the exponential integral, for u > 0. Series below 1, continued fraction above. */
export function wellW(u: number): number {
  if (!(u > 0)) return NaN;
  if (u < 1) {
    let sum = 0, term = 1;
    for (let k = 1; k < 200; k++) { term *= -u / k; const add = -term / k; sum += add; if (Math.abs(add) < 1e-17 * Math.abs(sum)) break; }
    return -EULER - Math.log(u) + sum;
  }
  // Modified Lentz continued fraction: E1(u) = e^-u · 1/(u+1-1/(u+3-4/(u+5-...))).
  let b = u + 1, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const a = -i * i; b += 2; d = 1 / (a * d + b); c = b + a / c; const del = c * d; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return h * Math.exp(-u);
}

/** Theis drawdown s (m) at distance r (m) and time t (s) for a pumping rate Q (m³/s), T (m²/s) and S. */
export const theis = (t: number, r: number, Q: number, T: number, S: number) => (Q / (4 * Math.PI * T)) * wellW((r * r * S) / (4 * T * t));
/** u = r²S / (4Tt). */
export const uOf = (t: number, r: number, T: number, S: number) => (r * r * S) / (4 * T * t);

/**
 * Cooper-Jacob straight line through drawdown against log10 time. Starts from the later half of the data and keeps
 * only the points with u ≤ uMax, repeating until the set stops changing.
 */
export function cooperJacob(t: number[], s: number[], r: number, Q: number, uMax = 0.05) {
  const n = t.length;
  if (n < 3) throw new Error('Need at least three readings');
  let use = t.map((_, i) => i >= Math.floor(n / 2));
  let res: { T: number; S: number; ds: number; t0: number; a: number; b: number; used: boolean[]; r2: number } | null = null;
  for (let it = 0; it < 20; it++) {
    const ix = t.map((_, i) => i).filter((i) => use[i]);
    if (ix.length < 2) break;
    const f = ix.length === 2 ? twoPoint(ix.map((i) => Math.log10(t[i])), ix.map((i) => s[i])) : fitLine(ix.map((i) => Math.log10(t[i])), ix.map((i) => s[i]));
    if (!(f.slope > 0)) throw new Error('Drawdown does not rise with time in the late data, so no straight line fits');
    const T = (2.303 * Q) / (4 * Math.PI * f.slope), t0 = 10 ** (-f.intercept / f.slope), S = (2.25 * T * t0) / (r * r);
    res = { T, S, ds: f.slope, t0, a: f.intercept, b: f.slope, used: use, r2: f.r2 };
    const next = t.map((ti) => uOf(ti, r, T, S) <= uMax);
    if (next.filter(Boolean).length < 2 || next.every((v, i) => v === use[i])) break;
    use = next;
  }
  if (!res) throw new Error('Not enough late readings for a straight line');
  return res;
}
const twoPoint = (x: number[], y: number[]) => { const slope = (y[1] - y[0]) / (x[1] - x[0]); return { slope, intercept: y[0] - slope * x[0], r2: 1 }; };

/** Theis curve fit: least squares on log10 drawdown, over log10 T and log10 S. Starts from Cooper-Jacob. */
export function fitTheis(t: number[], s: number[], r: number, Q: number) {
  const ok = t.map((ti, i) => ti > 0 && s[i] > 0);
  const tt = t.filter((_, i) => ok[i]), ss = s.filter((_, i) => ok[i]);
  if (tt.length < 3) throw new Error('Need at least three readings with time and drawdown above zero');
  let T0 = 1e-3, S0 = 1e-4;
  try { const cj = cooperJacob(tt, ss, r, Q); if (cj.T > 0 && cj.S > 0) { T0 = cj.T; S0 = cj.S; } } catch { /* fall back to the defaults */ }
  const model = (ti: number, p: number[]) => Math.log10(theis(ti, r, Q, 10 ** p[0], 10 ** p[1]));
  // A small grid first, so a poor start cannot trap the fit.
  let best = [Math.log10(T0), Math.log10(S0)], bc = Infinity;
  for (let dT = -2; dT <= 2; dT += 0.5) for (let dS = -3; dS <= 3; dS += 0.5) {
    const p = [Math.log10(T0) + dT, Math.log10(S0) + dS];
    const c = tt.reduce((a, ti, i) => a + (model(ti, p) - Math.log10(ss[i])) ** 2, 0);
    if (c < bc) { bc = c; best = p; }
  }
  const f = levenbergMarquardt(model, tt, ss.map((v) => Math.log10(v)), best, { maxIter: 200 });
  const T = 10 ** f.p[0], S = 10 ** f.p[1];
  const rmsLog = Math.sqrt(f.sse / tt.length);
  return { T, S, seLogT: f.se[0], seLogS: f.se[1], rmsLog, converged: f.converged, n: tt.length };
}

/** Distance-drawdown at one time t (s): s against log10 r. */
export function distanceDrawdown(r: number[], s: number[], t: number, Q: number) {
  if (r.length < 2) throw new Error('Need at least two wells');
  const f = r.length === 2 ? twoPoint(r.map(Math.log10), s) : fitLine(r.map(Math.log10), s);
  if (!(f.slope < 0)) throw new Error('Drawdown should fall with distance from the pumped well');
  const ds = -f.slope, T = (2.303 * Q) / (2 * Math.PI * ds), r0 = 10 ** (-f.intercept / f.slope), S = (2.25 * T * t) / (r0 * r0);
  return { T, S, ds, r0, a: f.intercept, b: f.slope, r2: f.r2 };
}

/**
 * Theis recovery: residual drawdown s' against log10(t/t'), where t' is the time since pumping stopped and
 * t = tp + t'. The slope per log cycle gives T. With the late points only (small u'), the line passes near the origin.
 */
export function recovery(tPrime: number[], sRes: number[], tp: number, Q: number, lateFraction = 0.6) {
  const pts = tPrime.map((tq, i) => ({ x: Math.log10((tp + tq) / tq), y: sRes[i] })).filter((p) => p.x > 0 && Number.isFinite(p.y));
  if (pts.length < 3) throw new Error('Need at least three recovery readings');
  // Late recovery means small t/t': keep the smallest-x share of the points.
  const sorted = pts.slice().sort((a, b) => a.x - b.x), k = Math.max(3, Math.round(sorted.length * lateFraction)), use = sorted.slice(0, k);
  const f = fitLine(use.map((p) => p.x), use.map((p) => p.y));
  if (!(f.slope > 0)) throw new Error('Residual drawdown should fall as recovery goes on');
  return { T: (2.303 * Q) / (4 * Math.PI * f.slope), ds: f.slope, a: f.intercept, b: f.slope, r2: f.r2, used: k, xMax: use[use.length - 1].x };
}
