// Fish length-weight relationship W = a·L^b, fitted as log10 W = log10 a + b·log10 L (Le Cren 1951;
// Froese 2006), with a test of b against 3 (isometric growth), Fulton's K and Le Cren's relative condition Kn.
// Plain maths; no DOM.
import { fitLine } from './fit.ts';
import { tInv, tTwoSided } from './stats.ts';

export type LWFit = {
  n: number; a: number; aRaw: number; b: number; seB: number; bLo: number; bHi: number; logA: number; seLogA: number;
  r2: number; s: number; cf: number; t3: number; p3: number; growth: 'isometric' | 'positive allometric' | 'negative allometric';
  resid: number[];
};

/**
 * Fit W = a·L^b by least squares on log10 values. `correct` multiplies a by the log-normal bias correction
 * CF = exp(s²·(ln 10)²/2) (Sprugel 1983), where s is the residual SD on the log10 scale.
 */
export function fitLW(L: number[], W: number[], correct = true, conf = 0.95, alpha = 0.05): LWFit {
  const x = L.map(Math.log10), y = W.map(Math.log10), f = fitLine(x, y);
  const n = L.length, s = f.syx, cf = Math.exp((s * Math.LN10) ** 2 / 2), aRaw = 10 ** f.intercept;
  const tq = tInv(1 - (1 - conf) / 2, n - 2), t3 = (f.slope - 3) / f.seSlope, p3 = tTwoSided(Math.abs(t3), n - 2);
  return {
    n, a: correct ? aRaw * cf : aRaw, aRaw, b: f.slope, seB: f.seSlope, bLo: f.slope - tq * f.seSlope, bHi: f.slope + tq * f.seSlope,
    logA: f.intercept, seLogA: f.seIntercept, r2: f.r2, s, cf, t3, p3, growth: p3 >= alpha ? 'isometric' : t3 > 0 ? 'positive allometric' : 'negative allometric',
    resid: y.map((v, i) => v - (f.intercept + f.slope * x[i])),
  };
}

/** Fulton's condition factor K = 100·W/L³ with W in g and L in cm (the usual scaling). */
export const fulton = (Lcm: number, Wg: number) => (100 * Wg) / Lcm ** 3;
/** Le Cren's relative condition Kn = W / (a·L^b): 1 is an average fish of that length. */
export const relCondition = (L: number, W: number, a: number, b: number) => W / (a * L ** b);
