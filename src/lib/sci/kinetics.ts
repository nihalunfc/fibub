// Reaction kinetics: integrated rate laws (zero, first, second and general n-th order) fitted to concentration
// against time, the classic straight-line plots, half-lives, and Arrhenius and Eyring analysis of k against T.
import { fitLine, levenbergMarquardt, type NlFit, type LineFit } from './fit.ts';
import { tInv } from './stats.ts';

export const R_GAS = 8.314462618; // J/(mol K)
export const KB_OVER_H = 2.083661912e10; // Boltzmann / Planck, 1/(K s)

export type Order = 0 | 1 | 2;
/** [A] at time t for order n with rate constant k (rate = k[A]^n). Zero order stops at zero. */
export function conc(order: number, a0: number, k: number, t: number): number {
  if (order === 0) return Math.max(0, a0 - k * t);
  if (order === 1) return a0 * Math.exp(-k * t);
  if (order === 2) return 1 / (1 / a0 + k * t);
  const base = a0 ** (1 - order) + (order - 1) * k * t;
  return base <= 0 ? 0 : base ** (1 / (1 - order));
}
/** Half-life from the start for order n. */
export function halfLife(order: number, a0: number, k: number): number {
  if (order === 0) return a0 / (2 * k);
  if (order === 1) return Math.LN2 / k;
  if (order === 2) return 1 / (k * a0);
  return (2 ** (order - 1) - 1) / ((order - 1) * k * a0 ** (order - 1));
}

export type OrderFit = { order: Order; a0: number; k: number; seA0: number; seK: number; sse: number; r2: number; aicc: number; halfLife: number; line: LineFit; fit: NlFit };

/** The straight-line form of each order: [A], ln[A] or 1/[A] against t. */
export const LINEAR: Record<Order, { label: string; y: (c: number) => number; slopeSign: number }> = {
  0: { label: '[A]', y: (c) => c, slopeSign: -1 },
  1: { label: 'ln [A]', y: (c) => Math.log(c), slopeSign: -1 },
  2: { label: '1/[A]', y: (c) => 1 / c, slopeSign: 1 },
};

/** Fit zero, first and second order by non-linear least squares on [A] itself (starting from the straight-line fits). */
export function fitOrders(t: number[], c: number[]): OrderFit[] {
  if (t.length < 3) throw new Error('Need at least three points.');
  if (c.some((x) => !(x > 0))) throw new Error('Concentrations must all be above zero (ln and 1/[A] need it).');
  const n = t.length;
  return ([0, 1, 2] as Order[]).map((order) => {
    const L = LINEAR[order], line = fitLine(t, c.map(L.y));
    const k0 = Math.abs(line.slope) || 1e-6;
    const a00 = order === 0 ? line.intercept : order === 1 ? Math.exp(line.intercept) : 1 / line.intercept;
    const start = [a00 > 0 && Number.isFinite(a00) ? a00 : c[0], k0];
    const fit = levenbergMarquardt((x, p) => conc(order, p[0], p[1], x), t, c, start, { maxIter: 200 });
    const floor = 1e-24 * c.reduce((x, y) => x + y * y, 0); // exact data: keep the log finite
    const aicc = n * Math.log(Math.max(fit.sse, floor) / n) + 4 + (2 * 2 * 3) / Math.max(1, n - 3);
    return { order, a0: fit.p[0], k: fit.p[1], seA0: fit.se[0], seK: fit.se[1], sse: fit.sse, r2: fit.r2, aicc, halfLife: halfLife(order, fit.p[0], fit.p[1]), line, fit };
  });
}

/** Free-order fit: rate = k[A]^n with n found from the data. */
export function fitFreeOrder(t: number[], c: number[], start: OrderFit): NlFit | null {
  if (t.length < 4) return null;
  try {
    const f = levenbergMarquardt((x, p) => conc(p[2], p[0], p[1], x), t, c, [start.a0, start.k, start.order + 0.05], { maxIter: 300 });
    return f.converged && Number.isFinite(f.p[2]) ? f : null;
  } catch { return null; }
}

/** Akaike weights: how strongly the data prefer each model. */
export function akaikeWeights(aicc: number[]): number[] {
  const m = Math.min(...aicc), e = aicc.map((a) => Math.exp(-(a - m) / 2)), s = e.reduce((x, y) => x + y, 0);
  return e.map((x) => x / s);
}

export type Arrhenius = { ea: number; seEa: number; a: number; lnA: number; seLnA: number; line: LineFit; ci95Ea: [number, number]; dH: number; seDH: number; dS: number; seDS: number; dG298: number };

/** Arrhenius (ln k = ln A − Ea/RT) and Eyring (ln(k/T) = ln(kB/h) + ΔS‡/R − ΔH‡/RT) from rate constants at several temperatures (K). */
export function arrhenius(T: number[], k: number[]): Arrhenius {
  if (T.length < 2) throw new Error('Need rate constants at two or more temperatures.');
  if (T.some((x) => !(x > 0)) || k.some((x) => !(x > 0))) throw new Error('Temperatures (in kelvin) and rate constants must be above zero.');
  const x = T.map((t) => 1 / t), line = lineAny(x, k.map(Math.log));
  const ea = -line.slope * R_GAS, seEa = line.seSlope * R_GAS;
  const tq = line.df > 0 ? tInv(0.975, line.df) : NaN;
  const ey = lineAny(x, k.map((kk, i) => Math.log(kk / T[i])));
  const dH = -ey.slope * R_GAS, dS = (ey.intercept - Math.log(KB_OVER_H)) * R_GAS;
  return { ea, seEa, a: Math.exp(line.intercept), lnA: line.intercept, seLnA: line.seIntercept, line, ci95Ea: [ea - tq * seEa, ea + tq * seEa], dH, seDH: ey.seSlope * R_GAS, dS, seDS: ey.seIntercept * R_GAS, dG298: dH - 298.15 * dS };
}

/** A straight line through two or more points (two points: exact, with no standard errors). */
function lineAny(x: number[], y: number[]): LineFit {
  if (x.length > 2) return fitLine(x, y);
  if (x[0] === x[1]) throw new Error('The two temperatures must differ.');
  const slope = (y[1] - y[0]) / (x[1] - x[0]), intercept = y[0] - slope * x[0];
  return { n: 2, slope, intercept, seSlope: NaN, seIntercept: NaN, covAB: NaN, r: 1, r2: 1, syx: 0, df: 0, xbar: (x[0] + x[1]) / 2, ybar: (y[0] + y[1]) / 2, sxx: (x[1] - x[0]) ** 2 / 2, sumW: 2, residuals: [0, 0] };
}

/** k at temperature T from an Arrhenius fit. */
export const kAt = (a: Arrhenius, T: number) => Math.exp(a.lnA - a.ea / (R_GAS * T));

/** A simulated first-order run: N2O5 decomposing at 45 °C (k ≈ 6.2 × 10⁻⁴ s⁻¹), with 1 % noise. */
export function simulatedRun(): { t: number[]; c: number[] } {
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  for (let i = 0; i < 8; i++) rnd();
  const t = [0, 300, 600, 900, 1200, 1800, 2400, 3000, 3600, 4800];
  return { t, c: t.map((x) => +(conc(1, 0.0200, 6.2e-4, x) * (1 + 0.01 * gauss())).toPrecision(4)) };
}
