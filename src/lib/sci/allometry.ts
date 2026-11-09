// Allometric body mass estimation: fit log10 M = a + b·log10 X by least squares to reference specimens, with
// prediction intervals, percent prediction error (%PE), percent standard error of estimate (%SEE) and log
// back-transformation bias corrections (Duan's smearing estimate, or the quasi-maximum-likelihood factor), then
// predict masses for fossils. Plain maths, no DOM.
import { tInv } from './stats.ts';
import { num, parseTable } from './num.ts';

export type Fit = {
  n: number; a: number; b: number; seA: number; seB: number; r2: number;
  /** Standard error of estimate on the log10 scale (√(SSE / (n − 2))). */
  see: number; xbar: number; sxx: number;
  /** Fitted log10 masses and residuals (log10 observed − log10 fitted). */
  fitted: number[]; resid: number[];
  /** Smith (1984): mean |observed − predicted| / predicted × 100, with predicted = 10^fitted (no correction). */
  pe: number;
  /** Smith (1984): 100 · (10^SEE − 1). */
  seePct: number;
  /** Duan (1983) smearing factor: mean of 10^residual. */
  smear: number;
  /** Quasi-maximum-likelihood factor exp((ln 10 · SEE)² / 2). */
  qmle: number;
  xmin: number; xmax: number;
};

/** Least-squares fit on log10 X and log10 M. Needs at least 3 specimens with positive values. */
export function fitAllometry(x: number[], m: number[]): Fit {
  const n = x.length, lx = x.map(Math.log10), ly = m.map(Math.log10);
  const xbar = lx.reduce((s, v) => s + v, 0) / n, ybar = ly.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (lx[i] - xbar) ** 2; sxy += (lx[i] - xbar) * (ly[i] - ybar); syy += (ly[i] - ybar) ** 2; }
  const b = sxy / sxx, a = ybar - b * xbar;
  const fitted = lx.map((v) => a + b * v), resid = ly.map((v, i) => v - fitted[i]);
  const sse = resid.reduce((s, e) => s + e * e, 0), see = Math.sqrt(sse / (n - 2));
  const seB = see / Math.sqrt(sxx), seA = see * Math.sqrt(1 / n + (xbar * xbar) / sxx);
  const pe = (100 / n) * m.reduce((s, v, i) => s + Math.abs(v - 10 ** fitted[i]) / 10 ** fitted[i], 0);
  return {
    n, a, b, seA, seB, r2: 1 - sse / syy, see, xbar, sxx, fitted, resid, pe, seePct: 100 * (10 ** see - 1),
    smear: resid.reduce((s, e) => s + 10 ** e, 0) / n, qmle: Math.exp((Math.LN10 * see) ** 2 / 2),
    xmin: Math.min(...x), xmax: Math.max(...x),
  };
}

export type Prediction = {
  x: number; logM: number; mass: number; lo: number; hi: number; ciLo: number; ciHi: number; extrapolated: boolean;
};

/**
 * Predicted mass for a new X. `cf` multiplies the back-transformed estimate (1, the smearing or the QMLE factor).
 * The prediction interval is 10^(ŷ ± t·SEE·√(1 + 1/n + (log X − mean)² / Sxx)), and the confidence interval for the
 * line uses √(1/n + …); both are back-transformed without correction (intervals for the median mass).
 */
export function predict(f: Fit, x: number, cf = 1, level = 0.95): Prediction {
  const lx = Math.log10(x), y = f.a + f.b * lx, t = tInv(1 - (1 - level) / 2, f.n - 2);
  const h = 1 / f.n + (lx - f.xbar) ** 2 / f.sxx, sp = f.see * Math.sqrt(1 + h), sc = f.see * Math.sqrt(h);
  return { x, logM: y, mass: 10 ** y * cf, lo: 10 ** (y - t * sp), hi: 10 ** (y + t * sp), ciLo: 10 ** (y - t * sc), ciHi: 10 ** (y + t * sc), extrapolated: x < f.xmin || x > f.xmax };
}

/** Mass from a typed equation log_base(M) = a + b·log_base(X), times an optional correction factor. */
export function fromEquation(a: number, b: number, x: number, base: 10 | 'e' = 10, cf = 1): number {
  return base === 10 ? 10 ** (a + b * Math.log10(x)) * cf : Math.exp(a + b * Math.log(x)) * cf;
}

/** Made-up reference specimens (not real animals): a bone measurement X in mm and body mass in kg. */
export const EXAMPLE_REF = `Specimen\tX (mm)\tMass (kg)
Ref 1\t200\t572.6
Ref 2\t100\t123.1
Ref 3\t238\t952.5
Ref 4\t171\t326.4
Ref 5\t49\t18.0
Ref 6\t304\t1350.4
Ref 7\t195\t624.3
Ref 8\t205\t596.2
Ref 9\t52\t18.8
Ref 10\t102\t92.7
Ref 11\t86\t85.9
Ref 12\t275\t1218.9`;
export const EXAMPLE_FOSSILS = `Fossil A\t160
Fossil B\t65
Fossil C\t410`;

/**
 * Rows of a pasted table: an optional name, then `k` positive numbers. A first row without numbers is taken as a
 * header. Returns names, the numbers by column, and plain errors for rows that cannot be used.
 */
export function readRows(text: string, k: number): { names: string[]; cols: number[][]; errors: string[] } {
  const t = parseTable(text), names: string[] = [], cols: number[][] = Array.from({ length: k }, () => []), errors: string[] = [];
  t.forEach((r, i) => {
    // Numbers are the last k cells; anything before them is the name (so "Fossil A 160" works with spaces).
    const named = r.length > k || Number.isNaN(num(r[0]));
    const vals = (named ? r.slice(Math.max(1, r.length - k)) : r.slice(0, k)).map(num);
    if (i === 0 && vals.some((v) => Number.isNaN(v))) return; // header
    if (vals.length < k || vals.some((v) => !Number.isFinite(v))) { errors.push(`Row ${i + 1} ("${r.join(' ')}"): needs ${k === 1 ? 'a number' : `${k} numbers`}.`); return; }
    if (vals.some((v) => v <= 0)) { errors.push(`Row ${i + 1} ("${r.join(' ')}"): values must be above zero to take logarithms.`); return; }
    names.push(named ? r.slice(0, Math.max(1, r.length - k)).join(' ') : `${k === 1 ? 'Fossil' : 'Specimen'} ${names.length + 1}`);
    vals.forEach((v, j) => cols[j].push(v));
  });
  return { names, cols, errors };
}
