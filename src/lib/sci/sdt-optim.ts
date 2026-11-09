// Nelder-Mead simplex minimiser, shared by the signal detection (ROC) and staircase (psychometric) fits.
// Plain maths, no DOM. Restarts from the best point until the simplex stops moving.

export type Minimum = { x: number[]; f: number; iterations: number; converged: boolean };

export function nelderMead(f: (x: number[]) => number, x0: number[], opts: { step?: number[]; maxIter?: number; tol?: number; xtol?: number; restarts?: number } = {}): Minimum {
  const n = x0.length, maxIter = opts.maxIter ?? 4000, tol = opts.tol ?? 1e-10, xtol = opts.xtol ?? 1e-9;
  const val = (x: number[]) => { const v = f(x); return Number.isFinite(v) ? v : Infinity; };
  let best = x0.slice(), fBest = val(best), total = 0, converged = false;
  for (let r = 0; r <= (opts.restarts ?? 3); r++) {
    const simplex: number[][] = [best.slice()];
    for (let i = 0; i < n; i++) {
      const p = best.slice();
      const s = opts.step?.[i] ?? (Math.abs(p[i]) > 1e-3 ? 0.1 * Math.abs(p[i]) : 0.1);
      p[i] += s; simplex.push(p);
    }
    let fs = simplex.map(val);
    let it = 0;
    for (; it < maxIter; it++) {
      const idx = fs.map((_, i) => i).sort((a, b) => fs[a] - fs[b]);
      const S = idx.map((i) => simplex[i]), F = idx.map((i) => fs[i]);
      simplex.splice(0, n + 1, ...S); fs = F;
      if (Math.abs(fs[n] - fs[0]) <= tol * (Math.abs(fs[0]) + tol) && S.every((p) => p.every((v, j) => Math.abs(v - S[0][j]) < xtol * (1 + Math.abs(S[0][j]))))) break;
      const c = Array.from({ length: n }, (_, j) => S.slice(0, n).reduce((s, p) => s + p[j], 0) / n);
      const at = (t: number) => c.map((cj, j) => cj + t * (S[n][j] - cj));
      const xr = at(-1), fr = val(xr);
      if (fr < fs[0]) {
        const xe = at(-2), fe = val(xe);
        if (fe < fr) { simplex[n] = xe; fs[n] = fe; } else { simplex[n] = xr; fs[n] = fr; }
      } else if (fr < fs[n - 1]) { simplex[n] = xr; fs[n] = fr; }
      else {
        const outside = fr < fs[n];
        const xc = at(outside ? -0.5 : 0.5), fc = val(xc);
        if (fc < (outside ? fr : fs[n])) { simplex[n] = xc; fs[n] = fc; }
        else {
          for (let i = 1; i <= n; i++) { simplex[i] = simplex[i].map((v, j) => simplex[0][j] + 0.5 * (v - simplex[0][j])); fs[i] = val(simplex[i]); }
        }
      }
    }
    total += it;
    const k = fs.indexOf(Math.min(...fs));
    const moved = fBest - fs[k];
    if (fs[k] <= fBest) { best = simplex[k].slice(); fBest = fs[k]; }
    converged = it < maxIter;
    if (converged && r > 0 && moved <= tol * (Math.abs(fBest) + tol)) break;
  }
  return { x: best, f: fBest, iterations: total, converged };
}

/** Numerical Hessian of f at x by central differences. */
export function hessian(f: (x: number[]) => number, x: number[], h?: number[]): number[][] {
  const n = x.length, H = Array.from({ length: n }, () => new Array(n).fill(0));
  const hs = x.map((v, i) => h?.[i] ?? 1e-4 * Math.max(1, Math.abs(v)));
  const at = (d: [number, number][]) => { const y = x.slice(); for (const [i, s] of d) y[i] += s; return f(y); };
  const f0 = f(x);
  for (let i = 0; i < n; i++) {
    H[i][i] = (at([[i, hs[i]]]) - 2 * f0 + at([[i, -hs[i]]])) / (hs[i] * hs[i]);
    for (let j = i + 1; j < n; j++) {
      H[i][j] = H[j][i] = (at([[i, hs[i]], [j, hs[j]]]) - at([[i, hs[i]], [j, -hs[j]]]) - at([[i, -hs[i]], [j, hs[j]]]) + at([[i, -hs[i]], [j, -hs[j]]])) / (4 * hs[i] * hs[j]);
    }
  }
  return H;
}

/** Inverse of a small symmetric matrix by Gauss-Jordan; null when singular. */
export function invert(A: number[][]): number[][] | null {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-300) return null;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const k = M[r][c]; if (k) for (let j = 0; j < 2 * n; j++) M[r][j] -= k * M[c][j]; }
  }
  return M.map((r) => r.slice(n));
}

/** Small seeded random number generator (mulberry32), so simulations and bootstraps repeat exactly. */
export function rng(seed = 1): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
