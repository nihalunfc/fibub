// State-space analysis and pole placement for small systems, for study: controllability and observability
// (matrices and ranks), eigenvalues, Ackermann's formula for single-input state feedback, observer gains by duality,
// and the closed-loop step response by the exact matrix-exponential discretisation. Plain TypeScript, no DOM.
import { num } from './num.ts';

export type Mat = number[][];
export type C = { re: number; im: number };

export const zeros = (r: number, c: number): Mat => Array.from({ length: r }, () => new Array(c).fill(0));
export const eye = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
export const mul = (A: Mat, B: Mat): Mat => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
export const add = (A: Mat, B: Mat, s = 1): Mat => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
export const scale = (A: Mat, s: number): Mat => A.map((r) => r.map((v) => v * s));
export const T = (A: Mat): Mat => A[0].map((_, j) => A.map((r) => r[j]));
export const hcat = (...Ms: Mat[]): Mat => Ms[0].map((_, i) => Ms.flatMap((M) => M[i]));
const norm1 = (A: Mat) => Math.max(...A[0].map((_, j) => A.reduce((s, r) => s + Math.abs(r[j]), 0)));

/** Read a matrix typed as rows on lines (or separated by ;), numbers separated by spaces or commas. Brackets are ignored. */
export function parseMatrix(text: string): Mat {
  const t = text.replace(/[[\]]/g, ' ').trim();
  if (!t) return [];
  const rows = t.split(/[\n;]+/).map((r) => r.trim()).filter(Boolean);
  const M = rows.map((r) => r.split(/[\s,]+/).filter(Boolean).map((x) => num(x)));
  if (M.some((r) => r.some((x) => !Number.isFinite(x)))) throw new Error('not a number');
  if (M.some((r) => r.length !== M[0].length)) throw new Error('rows of different lengths');
  return M;
}

/** Inverse by Gauss-Jordan with partial pivoting. Throws on a singular matrix. */
export function inv(A: Mat): Mat {
  const n = A.length, M = A.map((r, i) => [...r, ...eye(n)[i]]), sc = norm1(A) || 1;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-13 * sc) throw new Error('singular');
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c && M[r][c]) { const f = M[r][c]; for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((r) => r.slice(n));
}

/** Singular values by one-sided Jacobi rotations (accurate for small matrices). */
export function singularValues(A: Mat): number[] {
  let U = A[0].length > A.length ? T(A) : A.map((r) => [...r]); // tall: rows ≥ columns
  const m = U.length, n = U[0].length;
  U = U.map((r) => [...r]);
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      let a = 0, b = 0, g = 0;
      for (let i = 0; i < m; i++) { a += U[i][p] ** 2; b += U[i][q] ** 2; g += U[i][p] * U[i][q]; }
      if (Math.abs(g) <= 1e-15 * Math.sqrt(a * b)) continue;
      off = Math.max(off, Math.abs(g) / Math.sqrt(a * b));
      const z = (b - a) / (2 * g), t = Math.sign(z || 1) / (Math.abs(z) + Math.sqrt(1 + z * z)), c = 1 / Math.sqrt(1 + t * t), s = c * t;
      for (let i = 0; i < m; i++) { const x = U[i][p], y = U[i][q]; U[i][p] = c * x - s * y; U[i][q] = s * x + c * y; }
    }
    if (off < 1e-15) break;
  }
  return Array.from({ length: n }, (_, j) => Math.sqrt(U.reduce((s, r) => s + r[j] ** 2, 0))).sort((x, y) => y - x);
}
/** Numerical rank with NumPy's default tolerance: σ_max × max(rows, cols) × machine epsilon. */
export function rank(A: Mat): number {
  const s = singularValues(A), tol = (s[0] || 0) * Math.max(A.length, A[0].length) * 2.220446049250313e-16;
  return s.filter((x) => x > tol).length;
}

export const ctrb = (A: Mat, B: Mat): Mat => { const blocks = [B]; for (let i = 1; i < A.length; i++) blocks.push(mul(A, blocks[i - 1])); return hcat(...blocks); };
export const obsv = (A: Mat, Cm: Mat): Mat => T(ctrb(T(A), T(Cm)));

/** Characteristic polynomial coefficients [1, c1, …, cn] of A (det(sI − A)) by the Faddeev-LeVerrier recursion. */
export function charPoly(A: Mat): number[] {
  const n = A.length, c = [1];
  let M = zeros(n, n);
  for (let k = 1; k <= n; k++) {
    M = add(mul(A, M), eye(n), c[k - 1]); // M_k = A M_{k−1} + c_{k−1} I
    const AM = mul(A, M);
    c.push(-AM.reduce((s, r, i) => s + r[i], 0) / k);
  }
  return c;
}
/** Polynomial with roots p (complex, conjugate pairs) as real coefficients [1, a1, …, an]. */
export function polyFromRoots(p: C[]): number[] {
  let re = [1], im = [0];
  for (const r of p) {
    const nr = new Array(re.length + 1).fill(0), ni = new Array(re.length + 1).fill(0);
    for (let i = 0; i < re.length; i++) { nr[i] += re[i]; ni[i] += im[i]; nr[i + 1] -= r.re * re[i] - r.im * im[i]; ni[i + 1] -= r.re * im[i] + r.im * re[i]; }
    re = nr; im = ni;
  }
  return re;
}
/** Roots of a real polynomial [1, a1, …, an] by the Aberth-Ehrlich method, then Newton polishing. */
export function roots(c: number[]): C[] {
  const n = c.length - 1;
  if (n < 1) return [];
  const ev = (z: C) => { let pr = 1, pi = 0, dr = 0, di = 0; for (let k = 1; k <= n; k++) { const ndr = dr * z.re - di * z.im + pr, ndi = dr * z.im + di * z.re + pi; dr = ndr; di = ndi; const npr = pr * z.re - pi * z.im + c[k], npi = pr * z.im + pi * z.re; pr = npr; pi = npi; } return { p: { re: pr, im: pi }, d: { re: dr, im: di } }; };
  const R = 1 + Math.max(...c.slice(1).map(Math.abs));
  let z: C[] = Array.from({ length: n }, (_, k) => ({ re: 0.5 * R * Math.cos((2 * Math.PI * k) / n + 0.4), im: 0.5 * R * Math.sin((2 * Math.PI * k) / n + 0.4) }));
  const div = (a: C, b: C): C => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; };
  for (let it = 0; it < 500; it++) {
    let move = 0;
    z = z.map((zi, i) => {
      const { p, d } = ev(zi);
      if (p.re === 0 && p.im === 0) return zi;
      const ratio = div(p, d);
      let sr = 0, si = 0;
      for (let j = 0; j < n; j++) if (j !== i) { const w = div({ re: 1, im: 0 }, { re: zi.re - z[j].re, im: zi.im - z[j].im }); sr += w.re; si += w.im; }
      const den = { re: 1 - (ratio.re * sr - ratio.im * si), im: -(ratio.re * si + ratio.im * sr) }, step = div(ratio, den);
      move = Math.max(move, Math.hypot(step.re, step.im) / (1 + Math.hypot(zi.re, zi.im)));
      return { re: zi.re - step.re, im: zi.im - step.im };
    });
    if (move < 1e-15) break;
  }
  for (let k = 0; k < 3; k++) z = z.map((zi) => { const { p, d } = ev(zi); if (d.re === 0 && d.im === 0) return zi; const s = div(p, d); return { re: zi.re - s.re, im: zi.im - s.im }; });
  // Tidy: real roots exactly real, conjugates symmetric.
  const scaleR = Math.max(1, ...z.map((x) => Math.hypot(x.re, x.im)));
  return z.map((x) => (Math.abs(x.im) < 1e-9 * scaleR ? { re: x.re, im: 0 } : x)).sort((a, b) => b.re - a.re || b.im - a.im);
}
export const eig = (A: Mat): C[] => roots(charPoly(A));

/** p(A) for p = [1, a1, …, an] (Horner). */
export function polyMat(p: number[], A: Mat): Mat {
  let M = scale(eye(A.length), p[0]);
  for (let k = 1; k < p.length; k++) M = add(mul(M, A), scale(eye(A.length), p[k]));
  return M;
}

/** Ackermann's formula: K (1 × n) placing the eigenvalues of A − BK at `poles`. B must be one column. */
export function acker(A: Mat, B: Mat, poles: C[]): Mat {
  const n = A.length;
  if (B[0].length !== 1) throw new Error('Ackermann needs a single input (B with one column).');
  if (poles.length !== n) throw new Error(`Give ${n} poles, one for each state.`);
  const Wc = ctrb(A, B);
  if (rank(Wc) < n) throw new Error('The system is not controllable, so its poles cannot all be placed.');
  const en = [Array.from({ length: n }, (_, i) => (i === n - 1 ? 1 : 0))];
  return mul(mul(en, inv(Wc)), polyMat(polyFromRoots(poles), A));
}
/** Observer gain L (n × 1) placing the eigenvalues of A − LC, by duality with Ackermann. C must be one row. */
export function observerGain(A: Mat, Cm: Mat, poles: C[]): Mat {
  if (Cm.length !== 1) throw new Error('The observer needs a single output (C with one row).');
  try { return T(acker(T(A), T(Cm), poles)); } catch (e) { throw new Error((e as Error).message.replace('controllable', 'observable').replace('single input (B with one column)', 'single output (C with one row)')); }
}

/** Matrix exponential by scaling and squaring with a 12-term Taylor series (fine for the small, well-scaled matrices here). */
export function expm(A: Mat): Mat {
  const n = A.length, nm = norm1(A), s = nm > 0.5 ? Math.max(0, Math.ceil(Math.log2(nm / 0.5))) : 0;
  const X = scale(A, 2 ** -s);
  let term = eye(n), E = eye(n);
  for (let k = 1; k <= 18; k++) { term = scale(mul(term, X), 1 / k); E = add(E, term); }
  for (let i = 0; i < s; i++) E = mul(E, E);
  return E;
}

/**
 * Step response of x' = A x + B u, y = C x + D u, for a unit step on input `input` (0-based), from x = 0, sampled
 * every h seconds up to tEnd. Exact for a held input: [Φ Γ; 0 I] = expm([A B; 0 0]·h).
 */
export function step(A: Mat, B: Mat, Cm: Mat, D: Mat, tEnd: number, nPts = 400, input = 0): { t: number[]; y: number[][] } {
  const n = A.length, h = tEnd / nPts, b = B.map((r) => [r[input]]), d = D.map((r) => [r[input]]);
  const M = zeros(n + 1, n + 1); for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) M[i][j] = A[i][j] * h; M[i][n] = b[i][0] * h; }
  const E = expm(M), Phi = E.slice(0, n).map((r) => r.slice(0, n)), G = E.slice(0, n).map((r) => [r[n]]);
  let x: Mat = zeros(n, 1);
  const t: number[] = [], y: number[][] = [];
  for (let k = 0; k <= nPts; k++) {
    t.push(k * h); y.push(add(mul(Cm, x), d).map((r) => r[0]));
    x = add(mul(Phi, x), G);
  }
  return { t, y };
}
/** Steady-state gain from input to each output, −C A⁻¹ B + D (only for a stable A). */
export const dcGain = (A: Mat, B: Mat, Cm: Mat, D: Mat): Mat => add(D, scale(mul(mul(Cm, inv(A)), B), -1));

/** Step-response figures: final value, rise time 10–90 %, overshoot %, 2 % settling time. */
export function stepInfo(t: number[], y: number[], final: number) {
  const n = y.length, at = (f: number) => { for (let i = 1; i < n; i++) { const a = y[i - 1] - f * final, b = y[i] - f * final; if ((final > 0 ? b >= 0 : b <= 0) && (final > 0 ? a < 0 : a > 0)) return t[i - 1] + ((t[i] - t[i - 1]) * -a) / (b - a); } return NaN; };
  const peak = final >= 0 ? Math.max(...y) : Math.min(...y);
  let settle = 0;
  for (let i = n - 1; i >= 0; i--) if (Math.abs(y[i] - final) > 0.02 * Math.abs(final)) { settle = t[Math.min(n - 1, i + 1)]; break; }
  return { final, rise: at(0.9) - at(0.1), overshoot: final ? Math.max(0, ((peak - final) / final) * 100) : NaN, settling: settle, peak };
}

/** Parse poles such as "-2, -3+4j, -3-4j" or "-3±4j" (i or j). Complex poles must come with their conjugates. */
export function parsePoles(text: string): C[] {
  const out: C[] = [];
  for (const raw of text.split(/[,;\n]+/).map((s) => s.replace(/\s+/g, '').replace(/−/g, '-')).filter(Boolean)) {
    const pm = /^([-+]?[\d.]+(?:e[-+]?\d+)?)±([\d.]+(?:e[-+]?\d+)?)\*?[ij]$/i.exec(raw);
    if (pm) { const re = Number(pm[1]), im = Number(pm[2]); out.push({ re, im }, { re, im: -im }); continue; }
    const bad = () => new Error(`"${raw}" is not a pole. Write it like −2, −1+3j or −1±3j.`);
    const val = (x: string) => (x === '' || x === '+' ? 1 : x === '-' ? -1 : /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(x) ? Number(x) : NaN);
    let re: number, im: number;
    if (/[ij]$/i.test(raw)) {
      const body = raw.slice(0, -1).replace(/\*$/, '');
      let k = -1; for (let i = body.length - 1; i > 0; i--) if ((body[i] === '+' || body[i] === '-') && !/e/i.test(body[i - 1])) { k = i; break; }
      if (k > 0) { re = Number(body.slice(0, k)); im = val(body.slice(k)); if (body.slice(0, k) === '') re = NaN; }
      else { re = 0; im = val(body); }
    } else { re = /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(raw) ? Number(raw) : NaN; im = 0; }
    if (!Number.isFinite(re) || !Number.isFinite(im)) throw bad();
    out.push({ re, im });
  }
  // Every complex pole needs its conjugate.
  const left = out.filter((p) => p.im !== 0).map((p) => ({ ...p }));
  while (left.length) {
    const p = left.shift()!, k = left.findIndex((x) => Math.abs(x.re - p.re) < 1e-12 && Math.abs(x.im + p.im) < 1e-12);
    if (k < 0) throw new Error(`The pole ${p.re}${p.im > 0 ? '+' : '−'}${Math.abs(p.im)}j needs its conjugate too, so the gains are real.`);
    left.splice(k, 1);
  }
  return out;
}
export const fmtC = (z: C, d = 4) => { const f = (x: number) => (+x.toPrecision(d)).toString().replace('-', '−'); return Math.abs(z.im) < 1e-12 ? f(z.re) : `${f(z.re)} ${z.im > 0 ? '+' : '−'} ${f(Math.abs(z.im))}j`; };

export const EXAMPLE = { A: '0 1 0\n0 -0.5 1\n0 -2 -8', B: '0\n0\n4', C: '1 0 0', D: '0', poles: '-2+2j, -2-2j, -10', obs: '-8+8j, -8-8j, -40' };
