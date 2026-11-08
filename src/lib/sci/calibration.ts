// Straight-line calibration: fit the standards, read unknowns back with confidence intervals, and
// estimate detection and quantitation limits. Formulas from Miller and Miller, Statistics and
// Chemometrics for Analytical Chemistry (6th ed.), sections 5.3 to 5.10, and ICH Q2(R2) for the limits.
import { fitLine, type LineFit } from './fit.ts';
import { tInv } from './stats.ts';

export type Weighting = 'none' | '1/x' | '1/x2';
export type Calibration = LineFit & { weighting: Weighting; t: number; xs: number[]; ys: number[]; ciSlope: [number, number]; ciIntercept: [number, number]; xmin: number; xmax: number; weight: (x: number) => number };

export function calibrate(x: number[], y: number[], weighting: Weighting = 'none', level = 0.95): Calibration {
  if (weighting !== 'none' && x.some((v) => !(v > 0))) throw new Error('Weighting by 1/x or 1/x² needs every standard above zero (a blank cannot be weighted). Leave the blank out or use no weighting.');
  const raw = (v: number) => (weighting === '1/x' ? 1 / v : weighting === '1/x2' ? 1 / (v * v) : 1);
  const w = x.map(raw);
  const fit = fitLine(x, y, weighting === 'none' ? undefined : w);
  const scale = x.length / w.reduce((s, v) => s + v, 0);
  const t = tInv(1 - (1 - level) / 2, fit.df);
  return {
    ...fit, weighting, t, xs: x, ys: y,
    ciSlope: [fit.slope - t * fit.seSlope, fit.slope + t * fit.seSlope],
    ciIntercept: [fit.intercept - t * fit.seIntercept, fit.intercept + t * fit.seIntercept],
    xmin: Math.min(...x), xmax: Math.max(...x),
    weight: (v: number) => raw(v) * scale,
  };
}

/** Concentration of an unknown from the mean of m replicate responses, with its standard error and confidence interval. */
export function inverse(c: Calibration, responses: number[]) {
  const m = responses.length;
  const y0 = responses.reduce((s, v) => s + v, 0) / m;
  const x0 = (y0 - c.intercept) / c.slope;
  const w0 = c.weighting === 'none' ? 1 : x0 > 0 ? c.weight(x0) : NaN;
  const se = (Math.abs(c.syx / c.slope)) * Math.sqrt(1 / (w0 * m) + 1 / c.n + (y0 - c.ybar) ** 2 / (c.slope ** 2 * c.sxx));
  return { y0, x0, se, lo: x0 - c.t * se, hi: x0 + c.t * se, m };
}

/** ICH Q2 limits: LOD = 3.3 σ / slope, LOQ = 10 σ / slope, with σ the residual SD or the SD of the intercept. */
export function limits(c: Calibration, basis: 'residual' | 'intercept' = 'residual') {
  const sigma = basis === 'residual' ? c.syx : c.seIntercept;
  return { sigma, lod: (3.3 * sigma) / Math.abs(c.slope), loq: (10 * sigma) / Math.abs(c.slope) };
}
