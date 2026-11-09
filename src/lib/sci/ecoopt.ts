// Small numerical helpers shared by the ecology estimators (mark-recapture, distance sampling, occupancy):
// a Nelder-Mead minimiser, a numerical Hessian, a small matrix inverse, and chi-square / Poisson limits.
import { logGamma } from './stats.ts';

/** Minimise f from x0 with the Nelder-Mead simplex (Lagarias et al. 1998 coefficients), restarted once at the answer. */
export function nelderMead(f: (x: number[]) => number, x0: number[], opts: { step?: number; maxIter?: number; tol?: number } = {}): { x: number[]; f: number; iter: number; converged: boolean } {
  const n = x0.length, step = opts.step ?? 0.5, maxIter = opts.maxIter ?? 4000, tol = opts.tol ?? 1e-12;
  const val = (x: number[]) => { const v = f(x); return Number.isFinite(v) ? v : Infinity; };
  let iter = 0, converged = false, best = x0.slice();
  for (let round = 0; round < 3; round++) {
    let S = [best.slice()];
    for (let i = 0; i < n; i++) { const x = best.slice(); x[i] += x[i] === 0 ? step : step * Math.max(1, Math.abs(x[i])) * 0.5; S.push(x); }
    let F = S.map(val);
    converged = false;
    for (let k = 0; k < maxIter; k++, iter++) {
      const ord = F.map((v, i) => i).sort((a, b) => F[a] - F[b]); S = ord.map((i) => S[i]); F = ord.map((i) => F[i]);
      const spread = Math.abs(F[n] - F[0]), size = Math.max(...S.slice(1).map((x) => Math.max(...x.map((v, j) => Math.abs(v - S[0][j])))));
      if (spread <= tol * (Math.abs(F[0]) + 1e-10) && size < 1e-9) { converged = true; break; }
      const c = new Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += S[i][j] / n;
      const pt = (t: number) => c.map((v, j) => v + t * (S[n][j] - v));
      const xr = pt(-1), fr = val(xr);
      if (fr < F[0]) { const xe = pt(-2), fe = val(xe); if (fe < fr) { S[n] = xe; F[n] = fe; } else { S[n] = xr; F[n] = fr; } }
      else if (fr < F[n - 1]) { S[n] = xr; F[n] = fr; }
      else {
        const xc = fr < F[n] ? pt(-0.5) : pt(0.5), fc = val(xc);
        if (fc < Math.min(fr, F[n])) { S[n] = xc; F[n] = fc; }
        else for (let i = 1; i <= n; i++) { S[i] = S[i].map((v, j) => S[0][j] + 0.5 * (v - S[0][j])); F[i] = val(S[i]); }
      }
    }
    const i0 = F.indexOf(Math.min(...F)); best = S[i0];
  }
  return { x: best, f: val(best), iter, converged };
}

/** Hessian of f at x by central differences. */
export function hessian(f: (x: number[]) => number, x: number[], h = 1e-4): number[][] {
  const n = x.length, H = Array.from({ length: n }, () => new Array(n).fill(0));
  const at = (d: [number, number][]) => { const y = x.slice(); for (const [i, s] of d) y[i] += s; return f(y); };
  const f0 = f(x);
  for (let i = 0; i < n; i++) {
    const hi = h * Math.max(1, Math.abs(x[i]));
    H[i][i] = (at([[i, hi]]) - 2 * f0 + at([[i, -hi]])) / (hi * hi);
    for (let j = 0; j < i; j++) {
      const hj = h * Math.max(1, Math.abs(x[j]));
      H[i][j] = H[j][i] = (at([[i, hi], [j, hj]]) - at([[i, hi], [j, -hj]]) - at([[i, -hi], [j, hj]]) + at([[i, -hi], [j, -hj]])) / (4 * hi * hj);
    }
  }
  return H;
}

/** Inverse of a small square matrix (Gauss-Jordan with pivoting), or null if singular. */
export function inverse(A: number[][]): number[][] | null {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (!(Math.abs(M[p][c]) > 1e-300)) return null;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const k = M[r][c]; if (k) for (let j = 0; j < 2 * n; j++) M[r][j] -= k * M[c][j]; }
  }
  return M.map((r) => r.slice(n));
}

/** Regularised lower incomplete gamma P(a, x) (series or continued fraction, Numerical Recipes). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, del = sum, ap = a;
    for (let i = 0; i < 1000; i++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(-x + a * Math.log(x) - lg);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lg) * h;
}
/** Quantile of the chi-square distribution with k degrees of freedom. */
export function chi2Inv(p: number, k: number): number {
  if (p <= 0) return 0;
  let lo = 0, hi = Math.max(1, k);
  while (gammaP(k / 2, hi / 2) < p) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-12 * hi; i++) { const m = (lo + hi) / 2; if (gammaP(k / 2, m / 2) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Exact (Garwood) confidence limits for a Poisson count x. */
export function poissonCI(x: number, conf = 0.95): [number, number] {
  const a = 1 - conf;
  return [x === 0 ? 0 : chi2Inv(a / 2, 2 * x) / 2, chi2Inv(1 - a / 2, 2 * x + 2) / 2];
}

/** Gauss-Legendre nodes and weights on [-1, 1] (Golub-Welsch would be overkill; Newton on Legendre polynomials). */
export function gaussLegendre(n: number): { x: number[]; w: number[] } {
  const x: number[] = [], w: number[] = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = (n * (z * p1 - p2)) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-15) break;
    }
    x.push(z); w.push(2 / ((1 - z * z) * pp * pp));
  }
  return { x, w };
}
