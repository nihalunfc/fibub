// Allometric scaling Y = a M^b (plain maths, no DOM): ordinary least squares on log10 Y against log10 M, with
// t-based confidence limits for b and a, a test of b against any exponent, back-transformed predictions with
// confidence and prediction limits, and the log-normal bias correction factor (Baskerville 1972; Sprugel 1983).
import { tInv, tTwoSided } from './stats.ts';

export type AlloFit = {
  n: number; b: number; seB: number; logA: number; seLogA: number; a: number;
  bLo: number; bHi: number; aLo: number; aHi: number; r2: number; s: number; cf: number;
  xBar: number; sxx: number; tCrit: number; conf: number; mMin: number; mMax: number;
};

/** Fit log10 Y = log10 a + b log10 M. Masses and Y values must be above zero. */
export function fitAllometry(M: number[], Y: number[], conf = 0.95): AlloFit {
  const n = M.length;
  if (n < 3) throw new Error('Give at least 3 pairs of values.');
  if (M.some((v) => !(v > 0)) || Y.some((v) => !(v > 0))) throw new Error('All values must be above zero to take logarithms.');
  const x = M.map(Math.log10), y = Y.map(Math.log10);
  const xBar = x.reduce((s, v) => s + v, 0) / n, yBar = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - xBar) ** 2; sxy += (x[i] - xBar) * (y[i] - yBar); syy += (y[i] - yBar) ** 2; }
  if (!(sxx > 0)) throw new Error('All the masses are the same, so no slope can be fitted.');
  const b = sxy / sxx, logA = yBar - b * xBar;
  const sse = Math.max(0, syy - b * sxy), s = Math.sqrt(sse / (n - 2));
  const seB = s / Math.sqrt(sxx), seLogA = s * Math.sqrt(1 / n + (xBar * xBar) / sxx);
  const tCrit = tInv(1 - (1 - conf) / 2, n - 2);
  const r2 = syy > 0 ? 1 - sse / syy : 1;
  const ln10 = Math.LN10;
  return {
    n, b, seB, logA, seLogA, a: 10 ** logA, bLo: b - tCrit * seB, bHi: b + tCrit * seB,
    aLo: 10 ** (logA - tCrit * seLogA), aHi: 10 ** (logA + tCrit * seLogA), r2, s,
    cf: Math.exp((s * ln10) ** 2 / 2), xBar, sxx, tCrit, conf, mMin: Math.min(...M), mMax: Math.max(...M),
  };
}

/** Two-sided t test of the fitted exponent against b0. */
export function testExponent(f: AlloFit, b0: number): { t: number; p: number; inside: boolean } {
  const t = (f.b - b0) / f.seB;
  return { t, p: f.seB > 0 ? tTwoSided(Math.abs(t), f.n - 2) : (f.b === b0 ? 1 : 0), inside: b0 >= f.bLo && b0 <= f.bHi };
}

/** Predicted Y at mass M (the back-transformed median), with confidence limits for the line and prediction limits for one new individual or species. */
export function predictY(f: AlloFit, M: number): { y: number; ciLo: number; ciHi: number; piLo: number; piHi: number; extrapolated: boolean } {
  const x = Math.log10(M), yh = f.logA + f.b * x, d2 = (x - f.xBar) ** 2 / f.sxx;
  const sm = f.s * Math.sqrt(1 / f.n + d2), sp = f.s * Math.sqrt(1 + 1 / f.n + d2), t = f.tCrit;
  return { y: 10 ** yh, ciLo: 10 ** (yh - t * sm), ciHi: 10 ** (yh + t * sm), piLo: 10 ** (yh - t * sp), piHi: 10 ** (yh + t * sp), extrapolated: M < f.mMin || M > f.mMax };
}

/** Y = a M^b for a scaling law with a coefficient and exponent the user sets. */
export const scale = (a: number, b: number, M: number) => a * M ** b;
