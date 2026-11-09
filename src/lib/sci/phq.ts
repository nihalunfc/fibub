// Shared numerical tools for the quantum mechanics pages: complex numbers and matrices, eigenvalues of
// symmetric tridiagonal, complex Hermitian and general complex matrices, and a fast Fourier transform.
// Plain TypeScript, no DOM; checked against NumPy/SciPy in tests/sci-tools/.

export type C = [number, number];
export const cx = (re: number, im = 0): C => [re, im];
export const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
export const csub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
export const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const cconj = (a: C): C => [a[0], -a[1]];
export const cabs = (a: C) => Math.hypot(a[0], a[1]);
export const cdiv = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
export const cscale = (a: C, s: number): C => [a[0] * s, a[1] * s];
export const cexp = (a: C): C => { const r = Math.exp(a[0]); return [r * Math.cos(a[1]), r * Math.sin(a[1])]; };
export function csqrt(a: C): C {
  const r = cabs(a); if (r === 0) return [0, 0];
  const re = Math.sqrt((r + a[0]) / 2), im = Math.sqrt(Math.max(0, (r - a[0]) / 2));
  return [re, a[1] < 0 ? -im : im];
}

/** A complex matrix as rows of complex numbers. */
export type CM = C[][];
export const czeros = (n: number, m = n): CM => Array.from({ length: n }, () => Array.from({ length: m }, () => [0, 0] as C));
export const ceye = (n: number): CM => czeros(n).map((r, i) => r.map((_, j) => [i === j ? 1 : 0, 0] as C));
export const cmm = (A: CM, B: CM): CM => {
  const n = A.length, m = B[0].length, k = B.length, R = czeros(n, m);
  for (let i = 0; i < n; i++) for (let l = 0; l < k; l++) {
    const a = A[i][l]; if (a[0] === 0 && a[1] === 0) continue;
    const b = B[l], r = R[i];
    for (let j = 0; j < m; j++) { r[j][0] += a[0] * b[j][0] - a[1] * b[j][1]; r[j][1] += a[0] * b[j][1] + a[1] * b[j][0]; }
  }
  return R;
};
export const cmadd = (A: CM, B: CM, s: C = [1, 0]): CM => A.map((r, i) => r.map((a, j) => cadd(a, cmul(s, B[i][j]))));
export const cmscale = (A: CM, s: C): CM => A.map((r) => r.map((a) => cmul(a, s)));
export const dagger = (A: CM): CM => A[0].map((_, j) => A.map((r) => cconj(r[j])));
export const ctrace = (A: CM): C => A.reduce((s, r, i) => cadd(s, r[i]), [0, 0] as C);
export const kron = (A: CM, B: CM): CM => {
  const n = A.length, m = B.length, R = czeros(n * m, A[0].length * B[0].length);
  for (let i = 0; i < n; i++) for (let j = 0; j < A[0].length; j++) for (let k = 0; k < m; k++) for (let l = 0; l < B[0].length; l++) R[i * m + k][j * B[0].length + l] = cmul(A[i][j], B[k][l]);
  return R;
};
/** Largest |entry| of A − B. */
export const cmdiff = (A: CM, B: CM) => Math.max(...A.map((r, i) => Math.max(...r.map((a, j) => cabs(csub(a, B[i][j]))))));
export const cmnorm = (A: CM) => Math.max(0, ...A.map((r) => Math.max(0, ...r.map(cabs))));
export const isHermitian = (A: CM, tol = 1e-10) => A.length === A[0].length && cmdiff(A, dagger(A)) <= tol * Math.max(1, cmnorm(A));
export const fromReal = (A: number[][]): CM => A.map((r) => r.map((x) => [x, 0] as C));

/** Complex determinant by Gaussian elimination with partial pivoting. */
export function cdet(A0: CM): C {
  const A = A0.map((r) => r.map((x) => [...x] as C)), n = A.length;
  let d: C = [1, 0];
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (cabs(A[i][k]) > cabs(A[p][k])) p = i;
    if (cabs(A[p][k]) === 0) return [0, 0];
    if (p !== k) { [A[p], A[k]] = [A[k], A[p]]; d = cscale(d, -1); }
    d = cmul(d, A[k][k]);
    for (let i = k + 1; i < n; i++) { const f = cdiv(A[i][k], A[k][k]); for (let j = k; j < n; j++) A[i][j] = csub(A[i][j], cmul(f, A[k][j])); }
  }
  return d;
}

// ---------- Symmetric tridiagonal: eigenvalues by bisection (Sturm counts), vectors by inverse iteration ----------

/** Number of eigenvalues of the symmetric tridiagonal matrix (diagonal d, off-diagonal e, e[i] couples i and i+1) below x. */
function sturm(d: ArrayLike<number>, e2: ArrayLike<number>, x: number): number {
  let c = 0, q = d[0] - x;
  if (q < 0) c++;
  for (let i = 1; i < d.length; i++) {
    q = d[i] - x - e2[i - 1] / (q === 0 ? 1e-300 : q);
    if (q < 0) c++;
  }
  return c;
}

/** The k lowest eigenvalues (ascending) and unit eigenvectors of a symmetric tridiagonal matrix. */
export function tridiagLowest(d: ArrayLike<number>, e: ArrayLike<number>, k: number): { values: number[]; vectors: Float64Array[] } {
  const n = d.length; k = Math.min(k, n);
  const e2 = Float64Array.from(e, (x) => x * x);
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < n; i++) { const r = (i > 0 ? Math.abs(e[i - 1]) : 0) + (i < n - 1 ? Math.abs(e[i]) : 0); lo = Math.min(lo, d[i] - r); hi = Math.max(hi, d[i] + r); }
  const span = Math.max(1e-300, hi - lo);
  lo -= 1e-9 * span; hi += 1e-9 * span;
  const values: number[] = [];
  for (let j = 0; j < k; j++) {
    let a = j ? values[j - 1] - 1e-12 * span : lo, b = hi;
    if (a < lo) a = lo;
    for (let it = 0; it < 200; it++) {
      const m = 0.5 * (a + b);
      if (m === a || m === b) break;
      if (sturm(d, e2, m) > j) b = m; else a = m;
    }
    values.push(0.5 * (a + b));
  }
  const vectors: Float64Array[] = [];
  for (let j = 0; j < k; j++) {
    const v = inverseIteration(d, e, values[j] + (j > 0 && Math.abs(values[j] - values[j - 1]) < 1e-10 * span ? 1e-12 * span : 0), span);
    // Keep near-degenerate vectors orthogonal (as LAPACK's dstein does).
    for (let it = 0; it < 2; it++) for (let i = j - 1; i >= 0 && Math.abs(values[j] - values[i]) < 1e-3 * span; i--) {
      let s = 0; for (let t = 0; t < n; t++) s += v[t] * vectors[i][t];
      for (let t = 0; t < n; t++) v[t] -= s * vectors[i][t];
      let nn = 0; for (let t = 0; t < n; t++) nn += v[t] * v[t];
      nn = Math.sqrt(nn); for (let t = 0; t < n; t++) v[t] /= nn;
    }
    // Sign convention: the first sizeable lobe from the left is positive.
    let mx = 0; for (let t = 0; t < n; t++) mx = Math.max(mx, Math.abs(v[t]));
    for (let t = 0; t < n; t++) if (Math.abs(v[t]) > 0.05 * mx) { if (v[t] < 0) for (let s = 0; s < n; s++) v[s] = -v[s]; break; }
    vectors.push(v);
  }
  return { values, vectors };
}

function inverseIteration(d: ArrayLike<number>, e: ArrayLike<number>, lam: number, span: number): Float64Array {
  const n = d.length;
  // LU of (T - lam I) with partial pivoting (LAPACK dgttrf layout): dl, dd, du, du2, ipiv.
  const dl = Float64Array.from(e), du = Float64Array.from(e), dd = Float64Array.from(d, (x) => x - lam), du2 = new Float64Array(n), piv = new Uint8Array(n);
  const tiny = 1e-14 * span || 1e-300;
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(dd[i]) >= Math.abs(dl[i])) {
      if (dd[i] === 0) dd[i] = tiny;
      const f = dl[i] / dd[i]; dl[i] = f; dd[i + 1] -= f * du[i];
      if (i < n - 2) du2[i] = 0;
    } else {
      const f = dd[i] / dl[i]; dd[i] = dl[i]; dl[i] = f;
      const t = du[i]; du[i] = dd[i + 1]; dd[i + 1] = t - f * dd[i + 1];
      if (i < n - 2) { du2[i] = du[i + 1]; du[i + 1] = -f * du[i + 1]; }
      piv[i] = 1;
    }
  }
  if (dd[n - 1] === 0) dd[n - 1] = tiny;
  for (let i = 0; i < n; i++) if (Math.abs(dd[i]) < tiny) dd[i] = dd[i] < 0 ? -tiny : tiny;
  let x = new Float64Array(n);
  // A start vector with no special symmetry.
  for (let i = 0; i < n; i++) x[i] = 1 + 0.37 * Math.sin(1.7 * i + 0.3);
  for (let it = 0; it < 4; it++) {
    const b = x;
    for (let i = 0; i < n - 1; i++) {
      if (piv[i]) { const t = b[i]; b[i] = b[i + 1]; b[i + 1] = t - dl[i] * b[i]; } else b[i + 1] -= dl[i] * b[i];
    }
    b[n - 1] /= dd[n - 1];
    if (n > 1) b[n - 2] = (b[n - 2] - du[n - 2] * b[n - 1]) / dd[n - 2];
    for (let i = n - 3; i >= 0; i--) b[i] = (b[i] - du[i] * b[i + 1] - du2[i] * b[i + 2]) / dd[i];
    let s = 0; for (let i = 0; i < n; i++) s += b[i] * b[i];
    s = Math.sqrt(s) || 1; for (let i = 0; i < n; i++) b[i] /= s;
    x = b;
  }
  return x;
}

// ---------- Complex Hermitian: cyclic Jacobi ----------

/** Eigenvalues (ascending, real) and eigenvectors (columns, as arrays of C) of a Hermitian matrix. */
export function eigHermitian(A0: CM): { values: number[]; vectors: C[][] } {
  const n = A0.length;
  const A = A0.map((r) => r.map((x) => [x[0], x[1]] as C));
  const V = ceye(n);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0, tot = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const a = A[i][j][0] ** 2 + A[i][j][1] ** 2; if (i !== j) off += a; tot += a; }
    if (off <= 1e-30 * tot || off === 0) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      const apq = A[p][q], r = cabs(apq);
      if (r === 0 || r < 1e-300) continue;
      const ph = Math.atan2(apq[1], apq[0]);
      const th = 0.5 * Math.atan2(2 * r, A[q][q][0] - A[p][p][0]);
      const c = Math.cos(th), s = Math.sin(th), e: C = [Math.cos(-ph), Math.sin(-ph)];
      // V = D R: Vpp = c, Vpq = s, Vqp = -s e, Vqq = c e, with e = exp(-i ph).
      const Vpp: C = [c, 0], Vpq: C = [s, 0], Vqp = cscale(e, -s), Vqq = cscale(e, c);
      for (let k = 0; k < n; k++) { // columns
        const ap = A[k][p], aq = A[k][q];
        A[k][p] = cadd(cmul(ap, Vpp), cmul(aq, Vqp)); A[k][q] = cadd(cmul(ap, Vpq), cmul(aq, Vqq));
        const vp = V[k][p], vq = V[k][q];
        V[k][p] = cadd(cmul(vp, Vpp), cmul(vq, Vqp)); V[k][q] = cadd(cmul(vp, Vpq), cmul(vq, Vqq));
      }
      for (let k = 0; k < n; k++) { // rows
        const ap = A[p][k], aq = A[q][k];
        A[p][k] = cadd(cmul(cconj(Vpp), ap), cmul(cconj(Vqp), aq)); A[q][k] = cadd(cmul(cconj(Vpq), ap), cmul(cconj(Vqq), aq));
      }
      A[p][q] = [0, 0]; A[q][p] = [0, 0]; A[p][p] = [A[p][p][0], 0]; A[q][q] = [A[q][q][0], 0];
    }
  }
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => A[a][a][0] - A[b][b][0]);
  const vectors = idx.map((j) => {
    const v = V.map((r) => r[j]);
    // Phase convention: the largest component is real and positive.
    let m = 0; for (let i = 1; i < n; i++) if (cabs(v[i]) > cabs(v[m]) + 1e-12) m = i;
    const ph = cscale(cconj(v[m]), 1 / (cabs(v[m]) || 1));
    return v.map((x) => cmul(x, ph));
  });
  return { values: idx.map((j) => A[j][j][0]), vectors };
}

// ---------- General complex matrix: eigenvalues by Hessenberg reduction and shifted QR ----------

/** Eigenvalues of any square complex matrix (unordered). Defective matrices give eigenvalues of limited accuracy. */
export function eigvalsGeneral(A0: CM): C[] {
  const n = A0.length;
  const H = A0.map((r) => r.map((x) => [x[0], x[1]] as C));
  // Householder reduction to upper Hessenberg form.
  for (let k = 0; k < n - 2; k++) {
    let alpha = 0; for (let i = k + 1; i < n; i++) alpha += H[i][k][0] ** 2 + H[i][k][1] ** 2;
    alpha = Math.sqrt(alpha); if (alpha === 0) continue;
    const x0 = H[k + 1][k], a0 = cabs(x0), ph: C = a0 ? cscale(x0, 1 / a0) : [1, 0];
    const v: C[] = []; for (let i = k + 1; i < n; i++) v.push([...H[i][k]] as C);
    v[0] = cadd(v[0], cscale(ph, alpha));
    let vn = 0; for (const x of v) vn += x[0] ** 2 + x[1] ** 2;
    if (vn === 0) continue;
    // H = (I - 2 v v*/vn) H (I - 2 v v*/vn)
    for (let j = 0; j < n; j++) { let s: C = [0, 0]; for (let i = 0; i < v.length; i++) s = cadd(s, cmul(cconj(v[i]), H[k + 1 + i][j])); s = cscale(s, 2 / vn); for (let i = 0; i < v.length; i++) H[k + 1 + i][j] = csub(H[k + 1 + i][j], cmul(v[i], s)); }
    for (let i = 0; i < n; i++) { let s: C = [0, 0]; for (let j = 0; j < v.length; j++) s = cadd(s, cmul(H[i][k + 1 + j], v[j])); s = cscale(s, 2 / vn); for (let j = 0; j < v.length; j++) H[i][k + 1 + j] = csub(H[i][k + 1 + j], cmul(s, cconj(v[j]))); }
  }
  const out: C[] = [];
  let hi = n - 1, iter = 0;
  const scale = Math.max(1e-300, cmnorm(A0));
  while (hi >= 0) {
    if (hi === 0) { out.push(H[0][0]); break; }
    // Find a small subdiagonal.
    let l = hi;
    for (; l > 0; l--) { const s = cabs(H[l - 1][l - 1]) + cabs(H[l][l]); if (cabs(H[l][l - 1]) <= 1e-15 * (s || scale)) { H[l][l - 1] = [0, 0]; break; } }
    if (l === hi) { out.push(H[hi][hi]); hi--; iter = 0; continue; }
    // Wilkinson shift from the trailing 2x2 block.
    const a = H[hi - 1][hi - 1], b = H[hi - 1][hi], c = H[hi][hi - 1], d = H[hi][hi];
    const tr = cadd(a, d), det = csub(cmul(a, d), cmul(b, c));
    const disc = csqrt(csub(cmul(tr, tr), cscale(det, 4)));
    const m1 = cscale(cadd(tr, disc), 0.5), m2 = cscale(csub(tr, disc), 0.5);
    let mu = cabs(csub(m1, d)) < cabs(csub(m2, d)) ? m1 : m2;
    iter++;
    if (iter % 11 === 10) mu = cadd(d, [cabs(H[hi][hi - 1]) * 0.75, 0.37 * cabs(H[hi][hi - 1])]); // exceptional shift
    if (iter > 3000) { for (let i = hi; i >= 0; i--) out.push(H[i][i]); break; }
    // One QR step on the active block l..hi with Givens rotations: H - mu I = Q R, H <- R Q + mu I.
    for (let i = l; i <= hi; i++) H[i][i] = csub(H[i][i], mu);
    const rots: [C, C, number][] = [];
    for (let k = l; k < hi; k++) {
      const x = H[k][k], y = H[k + 1][k], r = Math.hypot(cabs(x), cabs(y));
      const cc: C = r ? cscale(x, 1 / r) : [1, 0], ss: C = r ? cscale(y, 1 / r) : [0, 0];
      // G = [[conj(cc), conj(ss)], [-ss, cc]] applied to rows k, k+1.
      for (let j = k; j < n; j++) {
        const u = H[k][j], w = H[k + 1][j];
        H[k][j] = cadd(cmul(cconj(cc), u), cmul(cconj(ss), w)); H[k + 1][j] = csub(cmul(cc, w), cmul(ss, u));
      }
      rots.push([cc, ss, k]);
    }
    for (const [cc, ss, k] of rots) {
      for (let i = 0; i <= Math.min(hi, k + 2); i++) {
        const u = H[i][k], w = H[i][k + 1];
        H[i][k] = cadd(cmul(u, cc), cmul(w, ss)); H[i][k + 1] = csub(cmul(w, cconj(cc)), cmul(u, cconj(ss)));
      }
    }
    for (let i = l; i <= hi; i++) H[i][i] = cadd(H[i][i], mu);
  }
  return out;
}

// ---------- FFT ----------

/** In-place radix-2 FFT of (re, im); n must be a power of two. inverse = true gives the unnormalised inverse. */
export function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

/** Format a complex number briefly: "0.5", "−i", "0.707 + 0.707i". */
export function fmtC(z: C, d = 4, tol = 1e-10): string {
  const f = (x: number) => { const s = (+x.toPrecision(d)).toString(); return s.replace('-', '−'); };
  const re = Math.abs(z[0]) < tol ? 0 : z[0], im = Math.abs(z[1]) < tol ? 0 : z[1];
  if (im === 0) return f(re);
  const is = Math.abs(im) === 1 ? '' : f(Math.abs(im));
  if (re === 0) return `${im < 0 ? '−' : ''}${is}i`;
  return `${f(re)} ${im < 0 ? '−' : '+'} ${is}i`;
}

/** A seeded random generator (mulberry32) so pictures and samples repeat exactly. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
