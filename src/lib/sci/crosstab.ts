// Cross-tabulation of two categorical variables with optional survey weights: counts and percentages,
// Pearson chi-square and likelihood-ratio G², Cramér's V, Pearson and adjusted standardised residuals,
// Fisher's exact test for 2 × 2 tables, and a simple design-effect (first-order Rao-Scott style)
// correction of the chi-square for weighted data. Plain functions, no DOM.
import { logGamma } from './stats.ts';

/** Regularised lower incomplete gamma P(a, x) (series below a + 1, continued fraction above). */
export function gammaP(a: number, x: number): number {
  if (!(x > 0)) return 0;
  const gl = logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, del = sum, ap = a;
    for (let n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(-x + a * Math.log(x) - gl);
  }
  return 1 - gammaQcf(a, x, gl);
}
function gammaQcf(a: number, x: number, gl: number) {
  const FPMIN = 1e-300;
  let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.exp(-x + a * Math.log(x) - gl) * h;
}
/** Upper tail of the chi-square distribution, P(X > x). */
export function chiSqSf(x: number, df: number): number {
  if (!(x > 0)) return 1;
  const a = df / 2, h = x / 2;
  return h < a + 1 ? 1 - gammaP(a, h) : gammaQcf(a, h, logGamma(a));
}

const lfact = (n: number) => logGamma(n + 1);
/**
 * Fisher's exact test for a 2 × 2 table [[a, b], [c, d]], two-sided as in scipy: the sum of the
 * probabilities of all tables with the same margins that are no more likely than the one observed
 * (with a relative tolerance of 1e-7). Also the one-sided p-values and the sample odds ratio ad/bc.
 */
export function fisherExact(t: number[][]) {
  const [[a, b], [c, d]] = t;
  const r1 = a + b, r2 = c + d, c1 = a + c, n = r1 + r2;
  const lo = Math.max(0, c1 - r2), hi = Math.min(r1, c1);
  const base = lfact(r1) + lfact(r2) + lfact(c1) + lfact(n - c1) - lfact(n);
  const prob = (x: number) => Math.exp(base - lfact(x) - lfact(r1 - x) - lfact(c1 - x) - lfact(r2 - c1 + x));
  const pObs = prob(a);
  let two = 0, less = 0, greater = 0;
  for (let x = lo; x <= hi; x++) {
    const p = prob(x);
    if (p <= pObs * (1 + 1e-7)) two += p;
    if (x <= a) less += p;
    if (x >= a) greater += p;
  }
  const or = b * c === 0 ? (a * d === 0 ? NaN : Infinity) : (a * d) / (b * c);
  return { p: Math.min(1, two), less: Math.min(1, less), greater: Math.min(1, greater), oddsRatio: or };
}

export type Crosstab = {
  rows: string[]; cols: string[]; O: number[][]; rowTot: number[]; colTot: number[]; N: number;
  /** Unweighted number of cases used. */
  n: number; weighted: boolean;
  E: number[][]; rowPct: number[][]; colPct: number[][]; totPct: number[][];
  chi2: number; df: number; p: number; g2: number; pG2: number; cramerV: number;
  /** Pearson residuals (O − E)/√E and adjusted standardised residuals (approximately N(0, 1)). */
  resid: number[][]; adjResid: number[][];
  minExpected: number; smallCells: number;
  yates?: { chi2: number; p: number };
  fisher?: ReturnType<typeof fisherExact>;
  /** For weighted data: Kish design effect, and the chi-square on weighted shares rescaled to n and divided by it. */
  design?: { deff: number; nEff: number; chi2Shares: number; chi2: number; p: number; g2: number; pG2: number };
};

/** Category order: numbers by value, then text in natural order. */
export function sortCats(c: string[]) {
  const isNum = (s: string) => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s);
  return [...c].sort((x, y) => (isNum(x) && isNum(y) ? Number(x) - Number(y) : isNum(x) ? -1 : isNum(y) ? 1 : x.localeCompare(y, 'en', { numeric: true })));
}

/**
 * Cross-tabulate `a` (rows) by `b` (columns). With `w`, cells hold the sum of weights; tests then use the
 * design-effect correction (see `design`), and the plain chi-square on weighted counts is not reported as valid.
 */
export function crosstab(a: string[], b: string[], w?: number[], order?: { rows?: string[]; cols?: string[] }): Crosstab {
  const rows = order?.rows ?? sortCats([...new Set(a)]), cols = order?.cols ?? sortCats([...new Set(b)]);
  if (rows.length < 2 || cols.length < 2) throw new Error(`Each variable needs at least two categories (rows: ${rows.length}, columns: ${cols.length}).`);
  const ri = new Map(rows.map((r, i) => [r, i])), ci = new Map(cols.map((c, j) => [c, j]));
  const O = rows.map(() => cols.map(() => 0)), U = rows.map(() => cols.map(() => 0));
  let sw = 0, sw2 = 0;
  a.forEach((x, k) => {
    const wk = w ? w[k] : 1;
    if (!(wk >= 0) || !Number.isFinite(wk)) throw new Error(`Weight in data row ${k + 1} is not a number of zero or more.`);
    O[ri.get(x)!][ci.get(b[k])!] += wk; U[ri.get(x)!][ci.get(b[k])!]++;
    sw += wk; sw2 += wk * wk;
  });
  const n = a.length, rowTot = O.map((r) => r.reduce((s, x) => s + x, 0)), colTot = cols.map((_, j) => O.reduce((s, r) => s + r[j], 0)), N = rowTot.reduce((s, x) => s + x, 0);
  if (!(N > 0)) throw new Error('The table is empty (all weights are zero).');
  const emptyR = rows.filter((_, i) => rowTot[i] === 0), emptyC = cols.filter((_, j) => colTot[j] === 0);
  if (emptyR.length || emptyC.length) throw new Error(`Category ${[...emptyR, ...emptyC].map((c) => `"${c}"`).join(', ')} has no cases (or only zero weights). Remove it first.`);
  const E = rows.map((_, i) => cols.map((_, j) => (rowTot[i] * colTot[j]) / N));
  const pearson = (T: number[][], Ex: number[][]) => T.reduce((s, r, i) => s + r.reduce((t, o, j) => t + (o - Ex[i][j]) ** 2 / Ex[i][j], 0), 0);
  const lr = (T: number[][], Ex: number[][]) => 2 * T.reduce((s, r, i) => s + r.reduce((t, o, j) => t + (o > 0 ? o * Math.log(o / Ex[i][j]) : 0), 0), 0);
  const chi2 = pearson(O, E), g2 = lr(O, E), df = (rows.length - 1) * (cols.length - 1), k = Math.min(rows.length, cols.length) - 1;
  const out: Crosstab = {
    rows, cols, O, rowTot, colTot, N, n, weighted: !!w, E,
    rowPct: O.map((r, i) => r.map((x) => (100 * x) / rowTot[i])),
    colPct: O.map((r) => r.map((x, j) => (100 * x) / colTot[j])),
    totPct: O.map((r) => r.map((x) => (100 * x) / N)),
    chi2, df, p: chiSqSf(chi2, df), g2, pG2: chiSqSf(g2, df), cramerV: Math.sqrt(chi2 / (N * k)),
    resid: O.map((r, i) => r.map((o, j) => (o - E[i][j]) / Math.sqrt(E[i][j]))),
    adjResid: O.map((r, i) => r.map((o, j) => (o - E[i][j]) / Math.sqrt(E[i][j] * (1 - rowTot[i] / N) * (1 - colTot[j] / N)))),
    minExpected: Math.min(...E.flat()), smallCells: E.flat().filter((e) => e < 5).length,
  };
  if (!w && rows.length === 2 && cols.length === 2) {
    // Yates' continuity correction as scipy applies it: move each |O − E| towards zero by up to 0.5.
    const Oy = O.map((r, i) => r.map((o, j) => { const d = o - E[i][j], s = Math.sign(d), m = Math.min(0.5, Math.abs(d)); return o - s * m; }));
    const cy = pearson(Oy, E);
    out.yates = { chi2: cy, p: chiSqSf(cy, 1) };
    out.fisher = fisherExact(O);
  }
  if (w) {
    // Simple first-order correction: Kish's design effect from the weights, deff = n Σw² / (Σw)².
    const deff = (n * sw2) / (sw * sw), P = O.map((r) => r.map((x) => x / N));
    const Pn = P.map((r) => r.map((x) => x * n)), En = E.map((r) => r.map((x) => (x / N) * n));
    const chi2Shares = pearson(Pn, En), g2Shares = lr(Pn, En);
    out.design = { deff, nEff: n / deff, chi2Shares, chi2: chi2Shares / deff, p: chiSqSf(chi2Shares / deff, df), g2: g2Shares / deff, pG2: chiSqSf(g2Shares / deff, df) };
    out.cramerV = Math.sqrt(chi2Shares / (n * k));
  }
  return out;
}
