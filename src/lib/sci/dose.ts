// Four-parameter logistic (4PL) dose-response curves, as in GraphPad Prism's "log(agonist) vs.
// response, variable slope": y = Bottom + (Top − Bottom) / (1 + (EC50 / x)^Hill). A positive Hill
// slope rises with dose; a negative one falls (inhibition, IC50). Fitted by Levenberg-Marquardt on
// log10(EC50), so the EC50's confidence interval is symmetric on the log scale, as Prism reports it.
import { levenbergMarquardt } from './fit.ts';
import { tInv } from './stats.ts';

export type Fixed = { bottom?: number; top?: number };
export type DoseFit = {
  bottom: number; top: number; ec50: number; logEc50: number; hill: number;
  se: { bottom: number; top: number; logEc50: number; hill: number };
  ci: { ec50: [number, number]; hill: [number, number]; bottom: [number, number]; top: [number, number] };
  r2: number; s: number; df: number; n: number; converged: boolean; rising: boolean;
  f: (x: number) => number; inverse: (y: number) => number;
};

export const fourPL = (x: number, bottom: number, top: number, logEc50: number, hill: number) =>
  bottom + (top - bottom) / (1 + Math.pow(10 ** logEc50 / x, hill));

/** Fit the 4PL to x (dose or concentration, above or equal to zero) and y. weights: optional, for example 1/y². */
export function fitDose(x: number[], y: number[], fixed: Fixed = {}, weights?: number[]): DoseFit {
  const pos = x.filter((v) => v > 0);
  if (pos.length < 3) throw new Error('Need at least three doses above zero');
  if (x.some((v) => v < 0)) throw new Error('Doses and concentrations cannot be negative');
  const free = ['bottom', 'top', 'logEc50', 'hill'].filter((k) => !(k === 'bottom' && fixed.bottom != null) && !(k === 'top' && fixed.top != null));
  if (x.length <= free.length) throw new Error(`Need more than ${free.length} points to fit this curve`);
  // Starting guesses: the response range, the dose nearest the half-way response, and the direction.
  const ymin = Math.min(...y), ymax = Math.max(...y);
  const lx = x.map((v) => (v > 0 ? Math.log10(v) : NaN));
  const mx = lx.filter(Number.isFinite).reduce((s, v) => s + v, 0) / pos.length;
  const pairs = x.map((v, i) => [lx[i], y[i]]).filter(([a]) => Number.isFinite(a));
  const my = pairs.reduce((s, p) => s + p[1], 0) / pairs.length;
  const cov = pairs.reduce((s, [a, b]) => s + (a - mx) * (b - my), 0);
  const rising = cov >= 0;
  const b0 = fixed.bottom ?? (rising ? ymin : ymin), t0 = fixed.top ?? ymax;
  const mid = (b0 + t0) / 2;
  const sorted = [...pairs].sort((p, q) => p[0] - q[0]);
  let l0 = mx;
  for (let i = 1; i < sorted.length; i++) {
    const [xa, ya] = sorted[i - 1], [xb, yb] = sorted[i];
    if ((ya - mid) * (yb - mid) <= 0 && ya !== yb) { l0 = xa + ((mid - ya) / (yb - ya)) * (xb - xa); break; }
  }
  const all: Record<string, number> = { bottom: b0, top: t0, logEc50: l0, hill: rising ? 1 : -1 };
  const unpack = (p: number[]) => { const o = { ...all, bottom: fixed.bottom ?? all.bottom, top: fixed.top ?? all.top }; free.forEach((k, i) => (o[k] = p[i])); return o; };
  const model = (xv: number, p: number[]) => { const o = unpack(p); return fourPL(xv, o.bottom, o.top, o.logEc50, o.hill); };
  // Try a few starting slopes and keep the best fit, so steep or shallow curves both converge.
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const h of [1, 0.5, 2, 4]) {
    all.hill = rising ? h : -h;
    try {
      const r = levenbergMarquardt(model, x, y, free.map((k) => all[k]), { w: weights });
      if (!best || r.sse < best.sse) best = r;
    } catch { /* try the next start */ }
  }
  if (!best) throw new Error('The curve could not be fitted. Check that the data has a clear S-shape.');
  const o = unpack(best.p);
  const se: Record<string, number> = { bottom: 0, top: 0, logEc50: 0, hill: 0 };
  free.forEach((k, i) => (se[k] = best!.se[i]));
  const t = tInv(0.975, best.df);
  const ci = (v: number, s: number): [number, number] => [v - t * s, v + t * s];
  const bottom = o.bottom, top = o.top, logEc50 = o.logEc50, hill = o.hill;
  return {
    bottom, top, logEc50, ec50: 10 ** logEc50, hill,
    se: { bottom: se.bottom, top: se.top, logEc50: se.logEc50, hill: se.hill },
    ci: { ec50: [10 ** (logEc50 - t * se.logEc50), 10 ** (logEc50 + t * se.logEc50)], hill: ci(hill, se.hill), bottom: ci(bottom, se.bottom), top: ci(top, se.top) },
    r2: best.r2, s: best.s, df: best.df, n: x.length, converged: best.converged, rising: hill > 0,
    f: (xv: number) => fourPL(xv, bottom, top, logEc50, hill),
    // Concentration giving response y; NaN outside the curve's range.
    inverse: (yv: number) => {
      const r = (top - bottom) / (yv - bottom) - 1;
      return r > 0 ? 10 ** logEc50 / Math.pow(r, 1 / hill) : NaN;
    },
  };
}
