// Curve fitting for the science tools: straight lines (with optional weights) and any model with a
// few parameters (Levenberg-Marquardt). Both report standard errors from the covariance matrix.

export type LineFit = {
  n: number; slope: number; intercept: number; seSlope: number; seIntercept: number; covAB: number;
  r: number; r2: number; syx: number; df: number; xbar: number; ybar: number; sxx: number; sumW: number;
  residuals: number[];
};

/**
 * Least-squares straight line y = a + b·x. With weights w (for example 1/x or 1/x²) it is the
 * weighted fit of Miller and Miller, Statistics and Chemometrics for Analytical Chemistry,
 * section 5.10: weights are scaled to sum to n, so s(y/x) stays on the scale of the data.
 * throughOrigin forces a = 0.
 */
export function fitLine(x: number[], y: number[], w?: number[], throughOrigin = false): LineFit {
  const n = x.length;
  if (n !== y.length) throw new Error('x and y need the same number of values');
  const need = throughOrigin ? 2 : 3;
  if (n < need) throw new Error(`Need at least ${need} points`);
  let wt = w ? w.slice() : x.map(() => 1);
  if (wt.some((v) => !(v > 0) || !Number.isFinite(v))) throw new Error('Every weight must be a positive number');
  const sw0 = wt.reduce((s, v) => s + v, 0);
  wt = wt.map((v) => (v * n) / sw0);
  const sumW = n;
  let xbar = 0, ybar = 0;
  if (!throughOrigin) { for (let i = 0; i < n; i++) { xbar += wt[i] * x[i]; ybar += wt[i] * y[i]; } xbar /= sumW; ybar /= sumW; }
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - xbar, dy = y[i] - ybar; sxx += wt[i] * dx * dx; sxy += wt[i] * dx * dy; syy += wt[i] * dy * dy; }
  if (!(sxx > 0)) throw new Error('The x values are all the same');
  const slope = sxy / sxx, intercept = throughOrigin ? 0 : ybar - slope * xbar;
  const df = n - (throughOrigin ? 1 : 2);
  const residuals = x.map((xi, i) => y[i] - (intercept + slope * xi));
  const sse = residuals.reduce((s, r, i) => s + wt[i] * r * r, 0);
  const syx = Math.sqrt(sse / df);
  const seSlope = syx / Math.sqrt(sxx);
  // Weighted case: Var(a) = s² (Σw x²) / (Σw · Sxx); unweighted reduces to s² Σx² / (n Sxx).
  const sumWx2 = wt.reduce((s, v, i) => s + v * x[i] * x[i], 0);
  const seIntercept = throughOrigin ? 0 : syx * Math.sqrt(sumWx2 / (sumW * sxx));
  const covAB = throughOrigin ? 0 : (-xbar * syx * syx) / sxx;
  const r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 1;
  return { n, slope, intercept, seSlope, seIntercept, covAB, r, r2: r * r, syx, df, xbar, ybar, sxx, sumW, residuals };
}

/** Solve A·x = b for a small symmetric positive definite A (Cholesky), or null if singular. */
export function solveSPD(A: number[][], b: number[]): number[] | null {
  const n = b.length, L = A.map((r) => r.map(() => 0));
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    let s = A[i][j];
    for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
    if (i === j) { if (!(s > 0)) return null; L[i][i] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
  }
  const z = new Array(n).fill(0), x = new Array(n).fill(0);
  for (let i = 0; i < n; i++) { let s = b[i]; for (let k = 0; k < i; k++) s -= L[i][k] * z[k]; z[i] = s / L[i][i]; }
  for (let i = n - 1; i >= 0; i--) { let s = z[i]; for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k]; x[i] = s / L[i][i]; }
  return x;
}
/** Inverse of a small symmetric positive definite matrix, or null. */
export function invSPD(A: number[][]): number[][] | null {
  const n = A.length, cols: number[][] = [];
  for (let j = 0; j < n; j++) { const e = new Array(n).fill(0); e[j] = 1; const c = solveSPD(A, e); if (!c) return null; cols.push(c); }
  return A.map((_, i) => cols.map((c) => c[i]));
}

export type NlFit = { p: number[]; se: number[]; cov: number[][]; sse: number; df: number; s: number; iterations: number; converged: boolean; r2: number };

/**
 * Levenberg-Marquardt least squares for y ≈ f(x, p) with optional weights. Derivatives are taken
 * numerically (central differences). Standard errors come from s²·(JᵀWJ)⁻¹, as in R's nls and
 * GraphPad Prism.
 */
export function levenbergMarquardt(f: (x: number, p: number[]) => number, x: number[], y: number[], p0: number[], opts: { w?: number[]; maxIter?: number } = {}): NlFit {
  const n = x.length, m = p0.length, w = opts.w ?? x.map(() => 1);
  if (n <= m) throw new Error(`Need more than ${m} points to fit ${m} parameters`);
  const resid = (p: number[]) => x.map((xi, i) => y[i] - f(xi, p));
  const cost = (r: number[]) => r.reduce((s, v, i) => s + w[i] * v * v, 0);
  const jac = (p: number[]) => {
    const J = x.map(() => new Array(m).fill(0));
    for (let j = 0; j < m; j++) {
      const h = 1e-6 * Math.max(Math.abs(p[j]), 1e-3);
      const pp = p.slice(), pm = p.slice(); pp[j] += h; pm[j] -= h;
      for (let i = 0; i < n; i++) J[i][j] = (f(x[i], pp) - f(x[i], pm)) / (2 * h);
    }
    return J;
  };
  let p = p0.slice(), r = resid(p), c = cost(r), lambda = 1e-3, it = 0, converged = false;
  if (!Number.isFinite(c)) throw new Error('The starting guess gives no finite values');
  for (; it < (opts.maxIter ?? 500); it++) {
    const J = jac(p);
    const A = Array.from({ length: m }, (_, a) => Array.from({ length: m }, (_, b) => J.reduce((s, row, i) => s + w[i] * row[a] * row[b], 0)));
    const g = Array.from({ length: m }, (_, a) => J.reduce((s, row, i) => s + w[i] * row[a] * r[i], 0));
    let improved = false;
    for (let tries = 0; tries < 30; tries++) {
      const Ad = A.map((row, i) => row.map((v, j) => (i === j ? v * (1 + lambda) + 1e-300 : v)));
      const d = solveSPD(Ad, g);
      if (d) {
        const pn = p.map((v, i) => v + d[i]), rn = resid(pn), cn = cost(rn);
        if (Number.isFinite(cn) && cn <= c) {
          const rel = (c - cn) / Math.max(c, 1e-300);
          const step = Math.max(...d.map((v, i) => Math.abs(v) / Math.max(Math.abs(p[i]), 1e-12)));
          p = pn; r = rn; c = cn; lambda = Math.max(lambda / 10, 1e-12); improved = true;
          if (rel < 1e-14 || step < 1e-10) converged = true;
          break;
        }
      }
      lambda *= 10;
    }
    if (!improved) { converged = true; break; }
    if (converged) break;
  }
  const J = jac(p);
  const A = Array.from({ length: m }, (_, a) => Array.from({ length: m }, (_, b) => J.reduce((s, row, i) => s + w[i] * row[a] * row[b], 0)));
  const df = n - m, s2 = c / df;
  const inv = invSPD(A);
  const cov = inv ? inv.map((row) => row.map((v) => v * s2)) : A.map((row) => row.map(() => NaN));
  const yw = y.reduce((s, v, i) => s + w[i] * v, 0) / w.reduce((s, v) => s + v, 0);
  const sst = y.reduce((s, v, i) => s + w[i] * (v - yw) ** 2, 0);
  return { p, se: cov.map((row, i) => Math.sqrt(row[i])), cov, sse: c, df, s: Math.sqrt(s2), iterations: it, converged, r2: sst > 0 ? 1 - c / sst : 1 };
}
