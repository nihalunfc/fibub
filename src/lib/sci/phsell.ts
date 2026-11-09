// Dispersion fitting: Sellmeier (1 to 3 terms) and Cauchy models fitted to measured refractive index against
// wavelength, with derived quantities (Abbe number, group index, group-velocity dispersion). Wavelengths in µm.
// Plain maths, no DOM.

/** Poles (C, µm²) are kept between these: 1 nm and 100 µm resonance wavelengths. */
export const C_MIN = 1e-6, C_MAX = 1e4;

export type Model = { kind: 'sellmeier'; terms: number } | { kind: 'cauchy'; terms: number };
export type Fit = { model: Model; p: number[]; se: number[]; rms: number; maxRes: number; res: number[]; dof: number; converged: boolean };

/** n(λ) for parameters p. Sellmeier p = [B1, C1, B2, C2, ...] (C in µm²); Cauchy p = [A, B, C...] (B in µm², C in µm⁴). */
export function nOf(m: Model, p: number[], l: number): number {
  const l2 = l * l;
  if (m.kind === 'cauchy') { let n = 0; for (let i = 0; i < m.terms; i++) n += p[i] / l2 ** i; return n; }
  let s = 1;
  for (let i = 0; i < m.terms; i++) s += (p[2 * i] * l2) / (l2 - p[2 * i + 1]);
  return Math.sqrt(s);
}
/** First and second derivatives of n with respect to λ (per µm, per µm²). */
export function derivs(m: Model, p: number[], l: number): { n: number; d1: number; d2: number } {
  const n = nOf(m, p, l), l2 = l * l;
  if (m.kind === 'cauchy') {
    let d1 = 0, d2 = 0;
    for (let i = 1; i < m.terms; i++) { d1 += -2 * i * p[i] * l ** (-2 * i - 1); d2 += 2 * i * (2 * i + 1) * p[i] * l ** (-2 * i - 2); }
    return { n, d1, d2 };
  }
  let f1 = 0, f2 = 0;
  for (let i = 0; i < m.terms; i++) { const B = p[2 * i], C = p[2 * i + 1], q = l2 - C; f1 += (-2 * B * C * l) / (q * q); f2 += (2 * B * C * (3 * l2 + C)) / (q * q * q); }
  const d1 = f1 / (2 * n), d2 = (f2 - 2 * d1 * d1) / (2 * n);
  return { n, d1, d2 };
}

function solve(A: number[][], b: number[]): number[] | null {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-300) return null;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function inverse(A: number[][]): number[][] | null {
  const n = A.length, cols: number[][] = [];
  for (let j = 0; j < n; j++) { const e = Array(n).fill(0); e[j] = 1; const x = solve(A, e); if (!x) return null; cols.push(x); }
  return A.map((_, i) => cols.map((c) => c[i]));
}

/** Linear least squares on n (Cauchy). */
function fitCauchy(ls: number[], ns: number[], terms: number): number[] | null {
  const X = ls.map((l) => Array.from({ length: terms }, (_, i) => 1 / (l * l) ** i));
  const A = Array.from({ length: terms }, (_, i) => Array.from({ length: terms }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const b = Array.from({ length: terms }, (_, i) => X.reduce((s, r, k) => s + r[i] * ns[k], 0));
  return solve(A, b);
}

/** For fixed poles C, the B that best fit n² − 1 (weighted by 1/(2n) so the residuals approximate n residuals). */
function bForC(ls: number[], ns: number[], C: number[]): { B: number[]; sse: number } | null {
  const k = C.length;
  const X = ls.map((l) => C.map((c) => (l * l) / (l * l - c)));
  const w = ns.map((n) => 1 / (2 * n));
  const y = ns.map((n) => n * n - 1);
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => X.reduce((s, r, q) => s + w[q] * w[q] * r[i] * r[j], 0)));
  const b = Array.from({ length: k }, (_, i) => X.reduce((s, r, q) => s + w[q] * w[q] * r[i] * y[q], 0));
  const B = solve(A, b);
  if (!B) return null;
  let sse = 0;
  for (let q = 0; q < ls.length; q++) { let s = 1; for (let i = 0; i < k; i++) s += B[i] * X[q][i]; if (!(s > 0)) return null; sse += (Math.sqrt(s) - ns[q]) ** 2; }
  return { B, sse };
}

/** Nelder-Mead in log(C) space. */
function nelderMead(f: (x: number[]) => number, x0: number[], step = 0.5, iters = 3000): number[] {
  const n = x0.length;
  let S = [x0, ...x0.map((_, i) => x0.map((v, j) => (i === j ? v + step : v)))].map((x) => ({ x, v: f(x) }));
  for (let it = 0; it < iters; it++) {
    S.sort((a, b) => a.v - b.v);
    if (Math.abs(S[n].v - S[0].v) <= 1e-30 + 1e-15 * Math.abs(S[0].v) && it > 50) break;
    const c = x0.map((_, j) => S.slice(0, n).reduce((s, p) => s + p.x[j], 0) / n);
    const at = (t: number) => c.map((v, j) => v + t * (S[n].x[j] - v));
    const r = at(-1), fr = f(r);
    if (fr < S[0].v) { const e = at(-2), fe = f(e); S[n] = fe < fr ? { x: e, v: fe } : { x: r, v: fr }; }
    else if (fr < S[n - 1].v) S[n] = { x: r, v: fr };
    else { const k = at(fr < S[n].v ? -0.5 : 0.5), fk = f(k); if (fk < Math.min(fr, S[n].v)) S[n] = { x: k, v: fk }; else S = S.map((p, i) => (i === 0 ? p : { x: p.x.map((v, j) => S[0].x[j] + 0.5 * (v - S[0].x[j])), v: 0 })).map((p, i) => (i === 0 ? p : { x: p.x, v: f(p.x) })); }
  }
  S.sort((a, b) => a.v - b.v);
  return S[0].x;
}

/** Levenberg-Marquardt polish on the n residuals, numeric Jacobian. Returns the parameters and J at the end. */
function lm(m: Model, ls: number[], ns: number[], p0: number[], valid: (q: number[]) => boolean = () => true): { p: number[]; J: number[][]; converged: boolean } {
  let p = [...p0], lam = 1e-3, converged = false;
  const res = (q: number[]) => ls.map((l, i) => nOf(m, q, l) - ns[i]);
  const sse = (q: number[]) => res(q).reduce((s, r) => s + (Number.isFinite(r) ? r * r : Infinity), 0);
  const jac = (q: number[]) => ls.map((l) => q.map((v, j) => { const h = 1e-7 * Math.max(Math.abs(v), 1e-6), a = [...q], b = [...q]; a[j] += h; b[j] -= h; return (nOf(m, a, l) - nOf(m, b, l)) / (2 * h); }));
  let cur = sse(p);
  for (let it = 0; it < 200; it++) {
    const J = jac(p), r = res(p), k = p.length;
    const A = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => J.reduce((s, row) => s + row[i] * row[j], 0)));
    const g = Array.from({ length: k }, (_, i) => -J.reduce((s, row, q) => s + row[i] * r[q], 0));
    let improved = false;
    for (let t = 0; t < 30; t++) {
      const Ad = A.map((row, i) => row.map((v, j) => (i === j ? v * (1 + lam) + 1e-300 : v)));
      const d = solve(Ad, g);
      if (!d) { lam *= 10; continue; }
      const q = p.map((v, i) => v + d[i]), nv = valid(q) ? sse(q) : Infinity;
      if (nv < cur) { const rel = (cur - nv) / Math.max(cur, 1e-300); p = q; cur = nv; lam = Math.max(lam / 3, 1e-12); improved = true; if (rel < 1e-12) converged = true; break; }
      lam *= 4;
    }
    if (!improved || converged) { converged = true; break; }
  }
  return { p, J: jac(p), converged };
}

/** Fit a model to (λ µm, n) data. Throws with a plain message when there are too few points. */
export function fit(m: Model, ls: number[], ns: number[]): Fit {
  const k = m.kind === 'cauchy' ? m.terms : 2 * m.terms;
  if (ls.length < k + 1) throw new Error(`This model has ${k} coefficients; give at least ${k + 1} data points (you gave ${ls.length}).`);
  let p: number[];
  let converged = true;
  if (m.kind === 'cauchy') {
    const c = fitCauchy(ls, ns, m.terms);
    if (!c) throw new Error('The fit failed: the wavelengths may all be the same.');
    p = c;
  } else {
    // Start poles: UV resonances near 0.07 and 0.13 µm, an IR one near 10 µm (as squares, µm²).
    const starts = [[0.07 ** 2], [0.07 ** 2, 10 ** 2], [0.07 ** 2, 0.13 ** 2, 10 ** 2]][m.terms - 1];
    const lmin = Math.min(...ls), lmax = Math.max(...ls);
    const okC = (C: number[]) => C.every((c) => c >= C_MIN && c <= C_MAX && !(c > lmin * lmin * 0.98 && c < lmax * lmax * 1.02));
    const obj = (x: number[]) => { const C = x.map(Math.exp); if (!okC(C)) return 1e10; const r = bForC(ls, ns, C); return r ? r.sse : 1e10; };
    let best = starts.map(Math.log), bv = obj(best);
    for (const s of [0.5, 0.25]) { const x = nelderMead(obj, best, s); const v = obj(x); if (v <= bv) { best = x; bv = v; } }
    const C = best.map(Math.exp), B = bForC(ls, ns, C)?.B;
    if (!B) throw new Error('The Sellmeier fit failed. Try fewer terms or the Cauchy model.');
    const p0 = C.flatMap((c, i) => [B[i], c]);
    const r = lm(m, ls, ns, p0, (q) => okC(q.filter((_, i) => i % 2 === 1)));
    p = r.p; converged = r.converged;
  }
  const res = ls.map((l, i) => ns[i] - nOf(m, p, l));
  const sse = res.reduce((s, r) => s + r * r, 0), dof = ls.length - k;
  // Standard errors from J (numeric for both models).
  const J = ls.map((l) => p.map((v, j) => { const h = 1e-7 * Math.max(Math.abs(v), 1e-6), a = [...p], b = [...p]; a[j] += h; b[j] -= h; return (nOf(m, a, l) - nOf(m, b, l)) / (2 * h); }));
  const A = p.map((_, i) => p.map((_, j) => J.reduce((s, row) => s + row[i] * row[j], 0)));
  const inv = dof > 0 ? inverse(A) : null, s2 = dof > 0 ? sse / dof : NaN;
  const se = p.map((_, i) => (inv && inv[i][i] > 0 ? Math.sqrt(s2 * inv[i][i]) : NaN));
  return { model: m, p, se, rms: Math.sqrt(sse / ls.length), maxRes: Math.max(...res.map(Math.abs)), res, dof, converged };
}

/** Fraunhofer lines used for the Abbe number (µm): d (helium yellow), F (hydrogen blue), C (hydrogen red). */
export const LINES = { d: 0.5875618, F: 0.4861327, C: 0.6562725 };
export const abbe = (m: Model, p: number[]) => (nOf(m, p, LINES.d) - 1) / (nOf(m, p, LINES.F) - nOf(m, p, LINES.C));
const C0 = 299792458;
/** Group index, group-velocity dispersion β2 (fs²/mm) and dispersion parameter D (ps/(nm·km)) at λ (µm). */
export function dispersion(m: Model, p: number[], l: number) {
  const { n, d1, d2 } = derivs(m, p, l);
  const lm_ = l * 1e-6, d2m = d2 * 1e12; // per m²
  const beta2 = ((lm_ ** 3) / (2 * Math.PI * C0 * C0)) * d2m; // s²/m
  return { n, ng: n - l * d1, beta2: beta2 * 1e27, D: (-(lm_ / C0) * d2m) * 1e6 };
}

/** Read λ and n columns; λ in nm (values above 100) or µm. */
export function readData(cols: number[][], unit: 'auto' | 'nm' | 'um'): { ls: number[]; ns: number[]; unit: 'nm' | 'um'; dropped: number } {
  const [a, b] = cols;
  const ls: number[] = [], ns: number[] = [];
  let dropped = 0;
  for (let i = 0; i < (a?.length ?? 0); i++) { if (Number.isFinite(a[i]) && Number.isFinite(b?.[i]) && a[i] > 0 && b[i] >= 1 && b[i] < 10) { ls.push(a[i]); ns.push(b[i]); } else dropped++; }
  const u = unit === 'auto' ? (ls.length && Math.max(...ls) > 50 ? 'nm' : 'um') : unit;
  return { ls: u === 'nm' ? ls.map((v) => v / 1000) : ls, ns, unit: u, dropped };
}
