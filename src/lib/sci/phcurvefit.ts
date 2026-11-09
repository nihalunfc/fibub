// Curve fitting for lab data: straight lines, polynomials and nonlinear models (or any formula typed in), by
// Levenberg-Marquardt, with optional y uncertainties, residuals, chi-square and its p-value. Plain TypeScript, no DOM.
import { parse, variables, compile, CONSTANTS } from './expr.ts';
import { levenbergMarquardt, fitLine } from './fit.ts';
import { tInv, logGamma } from './stats.ts';

/** Regularised upper incomplete gamma Q(a, x) (series below a + 1, continued fraction above; Numerical Recipes 6.2). */
export function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  const gln = logGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - gln);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.exp(-x + a * Math.log(x) - gln) * h;
}
/** Probability of a chi-square at least this large for dof degrees of freedom. */
export const chi2Sf = (chi2: number, dof: number) => gammaQ(dof / 2, chi2 / 2);

type Guess = (x: number[], y: number[]) => number[];
export type Model = { id: string; name: string; formula: string; params: string[]; guess: Guess };
const span = (a: number[]) => Math.max(...a) - Math.min(...a);
const lin = (x: number[], y: number[]) => { try { const f = fitLine(x, y); return [f.intercept, f.slope]; } catch { return [y[0] ?? 0, 0]; } };
/** Least-squares polynomial coefficients (lowest power first), used as exact starting values. */
export function polyfit(x: number[], y: number[], deg: number): number[] {
  const m = deg + 1, A = Array.from({ length: m }, () => new Array(m).fill(0)), b = new Array(m).fill(0);
  x.forEach((xi, i) => { for (let r = 0; r < m; r++) { b[r] += y[i] * xi ** r; for (let c = 0; c < m; c++) A[r][c] += xi ** (r + c); } });
  // Gaussian elimination with partial pivoting.
  for (let k = 0; k < m; k++) {
    let p = k; for (let r = k + 1; r < m; r++) if (Math.abs(A[r][k]) > Math.abs(A[p][k])) p = r;
    [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
    for (let r = k + 1; r < m; r++) { const f = A[r][k] / A[k][k]; for (let c = k; c < m; c++) A[r][c] -= f * A[k][c]; b[r] -= f * b[k]; }
  }
  const out = new Array(m).fill(0);
  for (let k = m - 1; k >= 0; k--) { let s = b[k]; for (let c = k + 1; c < m; c++) s -= A[k][c] * out[c]; out[k] = s / A[k][k]; }
  return out;
}
export const MODELS: Model[] = [
  { id: 'line', name: 'Straight line', formula: 'a + b*x', params: ['a', 'b'], guess: lin },
  { id: 'origin', name: 'Line through the origin', formula: 'b*x', params: ['b'], guess: (x, y) => [x.reduce((s, v, i) => s + v * y[i], 0) / x.reduce((s, v) => s + v * v, 0) || 1] },
  { id: 'quad', name: 'Quadratic', formula: 'a + b*x + c*x^2', params: ['a', 'b', 'c'], guess: (x, y) => polyfit(x, y, 2) },
  { id: 'cubic', name: 'Cubic', formula: 'a + b*x + c*x^2 + d*x^3', params: ['a', 'b', 'c', 'd'], guess: (x, y) => polyfit(x, y, 3) },
  { id: 'exp', name: 'Exponential', formula: 'a*exp(b*x)', params: ['a', 'b'], guess: (x, y) => { const k = y.map((v, i) => [x[i], v]).filter(([, v]) => v > 0); if (k.length < 2) return [y[0] || 1, 0]; const [c, s] = lin(k.map((p) => p[0]), k.map((p) => Math.log(p[1]))); return [Math.exp(c), s]; } },
  { id: 'decay', name: 'Exponential decay with offset', formula: 'a*exp(-x/t) + c', params: ['a', 't', 'c'], guess: (x, y) => { const c = Math.min(...y), i0 = x.indexOf(Math.min(...x)); return [y[i0] - c || 1, span(x) / 3 || 1, c]; } },
  { id: 'power', name: 'Power law', formula: 'a*x^b', params: ['a', 'b'], guess: (x, y) => { const k = y.map((v, i) => [x[i], v]).filter(([u, v]) => u > 0 && v > 0); if (k.length < 2) return [1, 1]; const [c, s] = lin(k.map((p) => Math.log(p[0])), k.map((p) => Math.log(p[1]))); return [Math.exp(c), s]; } },
  { id: 'gauss', name: 'Gaussian peak with offset', formula: 'a*exp(-(x-m)^2/(2*s^2)) + c', params: ['a', 'm', 's', 'c'], guess: (x, y) => { const c = Math.min(...y), i = y.indexOf(Math.max(...y)), half = (y[i] + c) / 2, above = x.filter((_, j) => y[j] >= half); return [y[i] - c, x[i], (span(above) || span(x) / 4) / 2.355, c]; } },
  { id: 'sine', name: 'Sine wave', formula: 'a*sin(2*pi*x/T + p) + c', params: ['a', 'T', 'p', 'c'], guess: (x, y) => { const c = y.reduce((s, v) => s + v, 0) / y.length, a = span(y) / 2; let cross = 0; for (let i = 1; i < y.length; i++) if ((y[i - 1] - c) * (y[i] - c) < 0) cross++; const T = cross > 1 ? (2 * span(x)) / cross : span(x); return [a, T, 0, c]; } },
];

/** Parameters of a typed formula in x: every name except x and the constants, in order of first use. */
export function formulaParams(formula: string): string[] {
  return variables(parse(formula)).filter((v) => v !== 'x' && !(v in CONSTANTS));
}

export type CurveFit = {
  names: string[]; p: number[]; se: number[]; ci: number[]; corr: number[][]; dof: number; tCrit: number;
  chi2: number | null; redChi2: number | null; pValue: number | null; sse: number; s: number; r2: number;
  fitted: number[]; resid: number[]; norm: number[]; aic: number; converged: boolean; iterations: number; scaled: boolean;
  f: (x: number) => number;
};
/**
 * Fit y ≈ formula(x; params). With sigma, the fit is weighted by 1/σ² and the uncertainties are absolute (scipy's
 * absolute_sigma=True) unless scale is true, when they are multiplied by √(χ²/dof). Without sigma, the uncertainties
 * come from the scatter of the residuals.
 */
export function fitCurve(formula: string, x: number[], y: number[], p0: number[], sigma?: number[], scale = false): CurveFit {
  const names = formulaParams(formula), node = parse(formula), fn = compile(node, ['x', ...names]);
  if (!names.length) throw new Error('The formula needs at least one parameter besides x');
  if (p0.length !== names.length) throw new Error('One starting value per parameter is needed');
  const n = x.length, m = names.length;
  if (n <= m) throw new Error(`Need more than ${m} points to fit ${m} parameter${m === 1 ? '' : 's'}`);
  const buf = new Float64Array(m + 1);
  const f = (xi: number, p: number[]) => { buf[0] = xi; for (let j = 0; j < m; j++) buf[j + 1] = p[j]; return fn(buf); };
  const w = sigma ? sigma.map((s) => 1 / (s * s)) : undefined;
  const r = levenbergMarquardt(f, x, y, p0, { w, maxIter: 1000 });
  const fitted = x.map((xi) => f(xi, r.p)), resid = y.map((v, i) => v - fitted[i]);
  const chi2 = sigma ? resid.reduce((s, v, i) => s + (v / sigma[i]) ** 2, 0) : null;
  const dof = n - m, scaled = !sigma || scale;
  // fit.ts gives cov = s²(JᵀWJ)⁻¹ with s² = Σw r²/dof; absolute σ wants (JᵀWJ)⁻¹.
  const k = scaled ? 1 : 1 / (r.s * r.s);
  const cov = r.cov.map((row) => row.map((v) => v * k)), se = cov.map((row, i) => Math.sqrt(row[i]));
  const corr = cov.map((row, i) => row.map((v, j) => v / Math.sqrt(cov[i][i] * cov[j][j])));
  const tCrit = tInv(0.975, dof), sse = resid.reduce((s, v) => s + v * v, 0);
  const ybar = y.reduce((s, v) => s + v, 0) / n, sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const rss = chi2 ?? sse;
  return {
    names, p: r.p, se, ci: se.map((s) => s * tCrit), corr, dof, tCrit,
    chi2, redChi2: chi2 === null ? null : chi2 / dof, pValue: chi2 === null ? null : chi2Sf(chi2, dof),
    sse, s: Math.sqrt(sse / dof), r2: sst > 0 ? 1 - sse / sst : 1, fitted, resid,
    norm: sigma ? resid.map((v, i) => v / sigma[i]) : resid.map((v) => v / Math.sqrt(sse / dof)),
    aic: n * Math.log(rss / n) + 2 * m, converged: r.converged, iterations: r.iterations, scaled,
    f: (xi: number) => f(xi, r.p),
  };
}
