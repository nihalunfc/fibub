// Item response theory for 0/1 answers: 1PL (one common slope, the Rasch model with an estimated spread) and
// 2PL fits by marginal maximum likelihood with the EM algorithm of Bock and Aitkin (1981), using Gauss-Hermite
// quadrature over a standard normal ability. Standard errors come from the observed information (the
// Hessian of the marginal log-likelihood, by central differences of its exact gradient). Persons get EAP scores.
import { logGamma } from './stats.ts';

/** Gauss-Hermite nodes and weights for a standard normal distribution (weights sum to 1). */
export function quadrature(K: number): { x: number[]; w: number[] } {
  // Golub-Welsch would need an eigen solver; Newton on the physicists' Hermite polynomials is enough here.
  const x: number[] = new Array(K), w: number[] = new Array(K), m = Math.floor((K + 1) / 2), PIM4 = Math.pow(Math.PI, -0.25);
  let z = 0;
  for (let i = 0; i < m; i++) {
    if (i === 0) z = Math.sqrt(2 * K + 1) - 1.85575 * Math.pow(2 * K + 1, -0.16667);
    else if (i === 1) z -= (1.14 * Math.pow(K, 0.426)) / z;
    else if (i === 2) z = 1.86 * z - 0.86 * x[0];
    else if (i === 3) z = 1.91 * z - 0.91 * x[1];
    else z = 2 * z - x[i - 2];
    let pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = PIM4, p2 = 0;
      for (let j = 1; j <= K; j++) { const p3 = p2; p2 = p1; p1 = z * Math.sqrt(2 / j) * p2 - Math.sqrt((j - 1) / j) * p3; }
      pp = Math.sqrt(2 * K) * p2;
      const z1 = z; z = z1 - p1 / pp;
      if (Math.abs(z - z1) < 1e-15) break;
    }
    x[i] = z; x[K - 1 - i] = -z; w[i] = w[K - 1 - i] = 2 / (pp * pp);
  }
  // Physicists' rule (weight e^{-z²}) to the standard normal: θ = √2 z, weight / √π.
  const order = x.map((_, i) => i).sort((a, b) => x[a] - x[b]);
  return { x: order.map((i) => Math.SQRT2 * x[i]), w: order.map((i) => w[i] / Math.sqrt(Math.PI)) };
}

const sigm = (t: number) => (t >= 0 ? 1 / (1 + Math.exp(-t)) : Math.exp(t) / (1 + Math.exp(t)));

export type IrtModel = '1pl' | '2pl';
export type IrtItem = { a: number; b: number; c: number; seA: number; seB: number; p: number; n: number };
export type IrtFit = {
  model: IrtModel; items: IrtItem[]; logLik: number; aic: number; bic: number; nPar: number;
  iterations: number; converged: boolean; nodes: { x: number[]; w: number[] };
  theta: number[]; thetaSE: number[]; raw: number[]; answered: number[];
};

/** The marginal log-likelihood, the posterior over the nodes for each person, and the expected counts. */
function estep(U: number[][], a: number[], c: number[], Q: { x: number[]; w: number[] }) {
  const N = U.length, J = a.length, K = Q.x.length;
  const lp = a.map((aj, j) => Q.x.map((t) => { const z = aj * t + c[j]; return z >= 0 ? -Math.log1p(Math.exp(-z)) : z - Math.log1p(Math.exp(z)); }));
  const lq = a.map((aj, j) => Q.x.map((t) => { const z = aj * t + c[j]; return z >= 0 ? -z - Math.log1p(Math.exp(-z)) : -Math.log1p(Math.exp(z)); }));
  const lw = Q.w.map(Math.log);
  const r = Array.from({ length: J }, () => new Array(K).fill(0)), n = Array.from({ length: J }, () => new Array(K).fill(0));
  const post: number[][] = [];
  let ll = 0;
  const L = new Array(K);
  for (let i = 0; i < N; i++) {
    const u = U[i];
    let mx = -Infinity;
    for (let k = 0; k < K; k++) {
      let s = lw[k];
      for (let j = 0; j < J; j++) { const v = u[j]; if (v === 1) s += lp[j][k]; else if (v === 0) s += lq[j][k]; }
      L[k] = s; if (s > mx) mx = s;
    }
    let tot = 0;
    for (let k = 0; k < K; k++) { L[k] = Math.exp(L[k] - mx); tot += L[k]; }
    ll += mx + Math.log(tot);
    const pi = L.map((v: number) => v / tot);
    post.push(pi);
    for (let j = 0; j < J; j++) { const v = u[j]; if (v !== 0 && v !== 1) continue; const rj = r[j], nj = n[j]; for (let k = 0; k < K; k++) { nj[k] += pi[k]; if (v === 1) rj[k] += pi[k]; } }
  }
  return { ll, r, n, post };
}

/** Exact gradient of the marginal log-likelihood in (a, c) by Fisher's identity. */
function gradient(U: number[][], a: number[], c: number[], Q: { x: number[]; w: number[] }) {
  const { r, n, ll } = estep(U, a, c, Q);
  const ga = a.map(() => 0), gc = a.map(() => 0);
  a.forEach((aj, j) => Q.x.forEach((t, k) => { const e = r[j][k] - n[j][k] * sigm(aj * t + c[j]); gc[j] += e; ga[j] += t * e; }));
  return { ga, gc, ll };
}

function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col; for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    const d = M[col][col]; if (Math.abs(d) < 1e-300) throw new Error('singular');
    for (let r = 0; r < n; r++) if (r !== col) { const f = M[r][col] / d; if (f) for (let j = col; j <= n; j++) M[r][j] -= f * M[col][j]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function inverse(A: number[][]): number[][] {
  const n = A.length, cols = A.map((_, j) => solve(A, A.map((_, i) => (i === j ? 1 : 0))));
  return A.map((_, i) => cols.map((c) => c[i]));
}

/** Fit a 1PL or 2PL model. U: people × items with 1, 0, or NaN for no answer. */
export function fitIrt(U0: number[][], model: IrtModel, opts: { nodes?: number; maxIter?: number; tol?: number } = {}): IrtFit {
  const K = opts.nodes ?? 41, maxIter = opts.maxIter ?? 5000, tol = opts.tol ?? 1e-7;
  const J = U0[0]?.length ?? 0;
  if (J < 2) throw new Error('Need at least two items (columns)');
  for (const r of U0) for (const v of r) if (!(v === 0 || v === 1 || Number.isNaN(v))) throw new Error('Answers must be 0 or 1 (or blank)');
  const U = U0.filter((r) => r.some((v) => v === 0 || v === 1));
  const N = U.length;
  if (N < 10) throw new Error('Need at least ten people with answers');
  const pj = Array.from({ length: J }, (_, j) => { let s = 0, m = 0; for (const r of U) if (r[j] === 0 || r[j] === 1) { s += r[j]; m++; } return { p: m ? s / m : NaN, n: m }; });
  pj.forEach((x, j) => { if (!(x.p > 0 && x.p < 1)) throw new Error(`Item ${j + 1} was answered ${x.p === 1 ? 'correctly by everyone' : x.p === 0 ? 'wrongly by everyone' : 'by no one'}, so it cannot be fitted. Remove it`); });
  const Q = quadrature(K);
  // Start from the logits of the proportions correct.
  let a = new Array(J).fill(1), c = pj.map((x) => Math.log(x.p / (1 - x.p)) * 1.2);
  let it = 0, converged = false, ll = -Infinity;
  for (; it < maxIter; it++) {
    const e = estep(U, a, c, Q);
    const llOld = ll; ll = e.ll;
    const na = a.slice(), nc = c.slice();
    if (model === '2pl') {
      for (let j = 0; j < J; j++) {
        let A = a[j], C = c[j];
        for (let s = 0; s < 20; s++) {
          let g1 = 0, g2 = 0, h11 = 0, h12 = 0, h22 = 0;
          for (let k = 0; k < K; k++) { const t = Q.x[k], P = sigm(A * t + C), W = e.n[j][k] * P * (1 - P), d = e.r[j][k] - e.n[j][k] * P; g1 += t * d; g2 += d; h11 += t * t * W; h12 += t * W; h22 += W; }
          const det = h11 * h22 - h12 * h12; if (!(det > 0)) break;
          let dA = (h22 * g1 - h12 * g2) / det, dC = (h11 * g2 - h12 * g1) / det;
          const big = Math.max(Math.abs(dA), Math.abs(dC)); if (big > 1) { dA /= big; dC /= big; }
          A += dA; C += dC;
          if (big < 1e-10) break;
        }
        na[j] = A; nc[j] = C;
      }
    } else {
      // Newton on (common a, c_1..c_J): bordered Hessian solved directly.
      let A = a[0]; const C = c.slice();
      for (let s = 0; s < 20; s++) {
        let ga = 0, haa = 0; const gc = new Array(J).fill(0), hcc = new Array(J).fill(0), hac = new Array(J).fill(0);
        for (let j = 0; j < J; j++) for (let k = 0; k < K; k++) { const t = Q.x[k], P = sigm(A * t + C[j]), W = e.n[j][k] * P * (1 - P), d = e.r[j][k] - e.n[j][k] * P; ga += t * d; gc[j] += d; haa += t * t * W; hcc[j] += W; hac[j] += t * W; }
        // Schur complement on a.
        let S = haa, rhs = ga; for (let j = 0; j < J; j++) { S -= (hac[j] * hac[j]) / hcc[j]; rhs -= (hac[j] * gc[j]) / hcc[j]; }
        let dA = rhs / S; const dC = gc.map((g, j) => (g - hac[j] * dA) / hcc[j]);
        let big = Math.max(Math.abs(dA), ...dC.map(Math.abs)); const f = big > 1 ? 1 / big : 1;
        dA *= f; A += dA; dC.forEach((d, j) => (C[j] += d * f));
        if (big < 1e-10) break;
      }
      na.fill(A); C.forEach((v, j) => (nc[j] = v));
    }
    const change = Math.max(...na.map((v, j) => Math.abs(v - a[j])), ...nc.map((v, j) => Math.abs(v - c[j])));
    a = na; c = nc;
    if (change < tol && Math.abs(ll - llOld) < 1e-9) { converged = true; break; }
  }
  const final = estep(U, a, c, Q); ll = final.ll;
  // Observed information by central differences of the exact gradient.
  const P = model === '2pl' ? 2 * J : J + 1;
  const pack = (A: number[], C: number[]) => (model === '2pl' ? [...A, ...C] : [A[0], ...C]);
  const unpack = (v: number[]) => (model === '2pl' ? { A: v.slice(0, J), C: v.slice(J) } : { A: new Array(J).fill(v[0]), C: v.slice(1) });
  const grad = (v: number[]) => { const { A, C } = unpack(v), g = gradient(U, A, C, Q); return model === '2pl' ? [...g.ga, ...g.gc] : [g.ga.reduce((s, x) => s + x, 0), ...g.gc]; };
  const v0 = pack(a, c), H: number[][] = [];
  for (let i = 0; i < P; i++) {
    const h = 1e-4 * Math.max(1, Math.abs(v0[i])), up = v0.slice(), dn = v0.slice(); up[i] += h; dn[i] -= h;
    const gu = grad(up), gd = grad(dn); H.push(gu.map((x, k) => -(x - gd[k]) / (2 * h)));
  }
  const Hs = H.map((r, i) => r.map((x, j) => (x + H[j][i]) / 2));
  let cov: number[][];
  try { cov = inverse(Hs); } catch { cov = Hs.map((r) => r.map(() => NaN)); }
  const ia = (j: number) => (model === '2pl' ? j : 0), ic = (j: number) => (model === '2pl' ? J + j : 1 + j);
  const items: IrtItem[] = a.map((aj, j) => {
    const b = -c[j] / aj, va = cov[ia(j)][ia(j)], vc = cov[ic(j)][ic(j)], vac = cov[ia(j)][ic(j)];
    // b = −c/a: delta method with ∂b/∂a = c/a², ∂b/∂c = −1/a.
    const da = c[j] / (aj * aj), dc = -1 / aj;
    return { a: aj, b, c: c[j], seA: Math.sqrt(va), seB: Math.sqrt(da * da * va + dc * dc * vc + 2 * da * dc * vac), p: pj[j].p, n: pj[j].n };
  });
  const theta = final.post.map((pi) => pi.reduce((s, x, k) => s + x * Q.x[k], 0));
  const thetaSE = final.post.map((pi, i) => Math.sqrt(Math.max(0, pi.reduce((s, x, k) => s + x * Q.x[k] ** 2, 0) - theta[i] ** 2)));
  return {
    model, items, logLik: ll, nPar: P, aic: -2 * ll + 2 * P, bic: -2 * ll + P * Math.log(N), iterations: it + 1, converged, nodes: Q,
    theta, thetaSE, raw: U.map((r) => r.reduce((s, v) => s + (v === 1 ? 1 : 0), 0)), answered: U.map((r) => r.filter((v) => v === 0 || v === 1).length),
  };
}

/** Probability of a correct answer and item information at ability θ. */
export const icc = (it: { a: number; b: number }, t: number) => sigm(it.a * (t - it.b));
export const info = (it: { a: number; b: number }, t: number) => { const p = icc(it, t); return it.a * it.a * p * (1 - p); };

/** Upper tail of the chi-square distribution (for the 1PL against 2PL likelihood-ratio test). */
export function chi2Sf(x: number, df: number): number {
  const a = df / 2, z = x / 2;
  if (z <= 0) return 1;
  const lg = a * Math.log(z) - z - logGamma(a);
  if (z < a + 1) { let s = 1 / a, t = s; for (let n = 1; n < 1000; n++) { t *= z / (a + n); s += t; if (Math.abs(t) < Math.abs(s) * 1e-16) break; } return 1 - s * Math.exp(lg); }
  let b = z + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
  return Math.exp(lg) * h;
}

/** Likelihood-ratio test of the 1PL (nested) against the 2PL. */
export function compareModels(m1: IrtFit, m2: IrtFit) {
  const chi2 = Math.max(0, 2 * (m2.logLik - m1.logLik)), df = m2.nPar - m1.nPar;
  return { chi2, df, p: chi2Sf(chi2, df) };
}
