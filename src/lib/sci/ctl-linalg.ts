// Small dense linear algebra for the control and robotics tools: products, inverse, rank, eigenvalues
// (balance, Hessenberg reduction and the shifted QR algorithm, after EISPACK's balanc/elmhes/hqr),
// polynomial roots (companion matrix), polynomials from roots and the matrix exponential (Padé with
// scaling and squaring). Plain TypeScript, no DOM. Matrices are arrays of rows.
export type Mat = number[][];
export type Cx = { re: number; im: number };

export const zeros = (r: number, c: number): Mat => Array.from({ length: r }, () => new Array(c).fill(0));
export const eye = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
export const clone = (A: Mat): Mat => A.map((r) => r.slice());
export const T = (A: Mat): Mat => (A.length ? A[0].map((_, j) => A.map((r) => r[j])) : []);
export function mul(A: Mat, B: Mat): Mat {
  const n = A.length, m = B[0]?.length ?? 0, k = B.length;
  const C = zeros(n, m);
  for (let i = 0; i < n; i++) for (let p = 0; p < k; p++) { const a = A[i][p]; if (a) for (let j = 0; j < m; j++) C[i][j] += a * B[p][j]; }
  return C;
}
export const add = (A: Mat, B: Mat): Mat => A.map((r, i) => r.map((x, j) => x + B[i][j]));
export const sub = (A: Mat, B: Mat): Mat => A.map((r, i) => r.map((x, j) => x - B[i][j]));
export const scale = (A: Mat, s: number): Mat => A.map((r) => r.map((x) => x * s));
export const normInf = (A: Mat) => Math.max(0, ...A.map((r) => r.reduce((s, x) => s + Math.abs(x), 0)));

/** Solve A X = B (B may have several columns) by Gaussian elimination with partial pivoting. Throws if singular. */
export function solve(A: Mat, B: Mat): Mat {
  const n = A.length, m = B[0].length;
  const M = A.map((r, i) => [...r, ...B[i]]);
  const tol = 1e-13 * Math.max(1e-300, normInf(A));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) <= tol) throw new Error('singular');
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; if (f) for (let j = c; j < n + m; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((r, i) => r.slice(n).map((x) => x / M[i][i]));
}
export const inv = (A: Mat): Mat => solve(A, eye(A.length));
export function det(A: Mat): number {
  const M = clone(A), n = M.length; let d = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (M[p][c] === 0) return 0;
    if (p !== c) { [M[c], M[p]] = [M[p], M[c]]; d = -d; }
    d *= M[c][c];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let j = c; j < n; j++) M[r][j] -= f * M[c][j]; }
  }
  return d;
}
/** Numerical rank: row reduction with full pivoting and a tolerance relative to the largest entry. */
export function rank(A: Mat, rtol = 1e-9): number {
  const M = clone(A), n = M.length, m = M[0]?.length ?? 0;
  const big = Math.max(0, ...M.flat().map(Math.abs));
  if (!big) return 0;
  let r = 0;
  const used = new Array(m).fill(false);
  for (let step = 0; step < Math.min(n, m); step++) {
    let bi = -1, bj = -1, bv = 0;
    for (let i = r; i < n; i++) for (let j = 0; j < m; j++) if (!used[j] && Math.abs(M[i][j]) > bv) { bv = Math.abs(M[i][j]); bi = i; bj = j; }
    if (bv <= rtol * big) break;
    [M[r], M[bi]] = [M[bi], M[r]]; used[bj] = true;
    for (let i = r + 1; i < n; i++) { const f = M[i][bj] / M[r][bj]; for (let j = 0; j < m; j++) M[i][j] -= f * M[r][j]; }
    r++;
  }
  return r;
}

/** Eigenvalues of a real square matrix, sorted by real part then imaginary part. */
export function eig(A0: Mat): Cx[] {
  const n = A0.length;
  if (!n) return [];
  // 1-indexed copy, as in the EISPACK/Numerical Recipes routines.
  const a: number[][] = [new Array(n + 1).fill(0), ...A0.map((r) => [0, ...r])];
  // balanc
  const RADIX = 2, sq = RADIX * RADIX;
  for (let last = false; !last;) {
    last = true;
    for (let i = 1; i <= n; i++) {
      let r = 0, c = 0;
      for (let j = 1; j <= n; j++) if (j !== i) { c += Math.abs(a[j][i]); r += Math.abs(a[i][j]); }
      if (c && r) {
        let g = r / RADIX, f = 1; const s = c + r;
        while (c < g) { f *= RADIX; c *= sq; }
        g = r * RADIX;
        while (c > g) { f /= RADIX; c /= sq; }
        if ((c + r) / f < 0.95 * s) { last = false; g = 1 / f; for (let j = 1; j <= n; j++) a[i][j] *= g; for (let j = 1; j <= n; j++) a[j][i] *= f; }
      }
    }
  }
  // elmhes
  for (let m = 2; m < n; m++) {
    let x = 0, i = m;
    for (let j = m; j <= n; j++) if (Math.abs(a[j][m - 1]) > Math.abs(x)) { x = a[j][m - 1]; i = j; }
    if (i !== m) {
      for (let j = m - 1; j <= n; j++) [a[i][j], a[m][j]] = [a[m][j], a[i][j]];
      for (let j = 1; j <= n; j++) [a[j][i], a[j][m]] = [a[j][m], a[j][i]];
    }
    if (x) for (let ii = m + 1; ii <= n; ii++) {
      let y = a[ii][m - 1];
      if (y !== 0) { y /= x; a[ii][m - 1] = y; for (let j = m; j <= n; j++) a[ii][j] -= y * a[m][j]; for (let j = 1; j <= n; j++) a[j][m] += y * a[j][ii]; }
    }
  }
  for (let i = 1; i <= n; i++) for (let j = 1; j < i - 1; j++) a[i][j] = 0;
  // hqr
  const wr = new Array(n + 1).fill(0), wi = new Array(n + 1).fill(0);
  const SIGN = (x: number, y: number) => (y >= 0 ? Math.abs(x) : -Math.abs(x));
  let anorm = 0;
  for (let i = 1; i <= n; i++) for (let j = Math.max(i - 1, 1); j <= n; j++) anorm += Math.abs(a[i][j]);
  let nn = n, t = 0;
  let p = 0, q = 0, r = 0, s = 0, w = 0, x = 0, y = 0, z = 0, u = 0, v = 0;
  while (nn >= 1) {
    let its = 0, l: number;
    do {
      for (l = nn; l >= 2; l--) {
        s = Math.abs(a[l - 1][l - 1]) + Math.abs(a[l][l]);
        if (s === 0) s = anorm;
        if (Math.abs(a[l][l - 1]) + s === s) { a[l][l - 1] = 0; break; }
      }
      x = a[nn][nn];
      if (l === nn) { wr[nn] = x + t; wi[nn--] = 0; }
      else {
        y = a[nn - 1][nn - 1]; w = a[nn][nn - 1] * a[nn - 1][nn];
        if (l === nn - 1) {
          p = 0.5 * (y - x); q = p * p + w; z = Math.sqrt(Math.abs(q)); x += t;
          if (q >= 0) { z = p + SIGN(z, p); wr[nn - 1] = wr[nn] = x + z; if (z) wr[nn] = x - w / z; wi[nn - 1] = wi[nn] = 0; }
          else { wr[nn - 1] = wr[nn] = x + p; wi[nn - 1] = -(wi[nn] = z); }
          nn -= 2;
        } else {
          if (its === 60) throw new Error('eigenvalues did not converge');
          if (its === 10 || its === 20 || its === 40) {
            t += x;
            for (let i = 1; i <= nn; i++) a[i][i] -= x;
            s = Math.abs(a[nn][nn - 1]) + Math.abs(a[nn - 1][nn - 2]);
            y = x = 0.75 * s; w = -0.4375 * s * s;
          }
          ++its;
          let m: number;
          for (m = nn - 2; m >= l; m--) {
            z = a[m][m]; r = x - z; s = y - z;
            p = (r * s - w) / a[m + 1][m] + a[m][m + 1]; q = a[m + 1][m + 1] - z - r - s; r = a[m + 2][m + 1];
            s = Math.abs(p) + Math.abs(q) + Math.abs(r); p /= s; q /= s; r /= s;
            if (m === l) break;
            u = Math.abs(a[m][m - 1]) * (Math.abs(q) + Math.abs(r));
            v = Math.abs(p) * (Math.abs(a[m - 1][m - 1]) + Math.abs(z) + Math.abs(a[m + 1][m + 1]));
            if (u + v === v) break;
          }
          for (let i = m + 2; i <= nn; i++) { a[i][i - 2] = 0; if (i !== m + 2) a[i][i - 3] = 0; }
          for (let k = m; k <= nn - 1; k++) {
            if (k !== m) {
              p = a[k][k - 1]; q = a[k + 1][k - 1]; r = 0;
              if (k !== nn - 1) r = a[k + 2][k - 1];
              if ((x = Math.abs(p) + Math.abs(q) + Math.abs(r)) !== 0) { p /= x; q /= x; r /= x; }
            }
            if ((s = SIGN(Math.sqrt(p * p + q * q + r * r), p)) !== 0) {
              if (k === m) { if (l !== m) a[k][k - 1] = -a[k][k - 1]; } else a[k][k - 1] = -s * x;
              p += s; x = p / s; y = q / s; z = r / s; q /= p; r /= p;
              for (let j = k; j <= nn; j++) {
                p = a[k][j] + q * a[k + 1][j];
                if (k !== nn - 1) { p += r * a[k + 2][j]; a[k + 2][j] -= p * z; }
                a[k + 1][j] -= p * y; a[k][j] -= p * x;
              }
              const mmin = nn < k + 3 ? nn : k + 3;
              for (let i = l; i <= mmin; i++) {
                p = x * a[i][k] + y * a[i][k + 1];
                if (k !== nn - 1) { p += z * a[i][k + 2]; a[i][k + 2] -= p * r; }
                a[i][k + 1] -= p * q; a[i][k] -= p;
              }
            }
          }
        }
      }
    } while (l < nn - 1);
  }
  const out: Cx[] = [];
  for (let i = 1; i <= n; i++) out.push({ re: wr[i], im: wi[i] });
  return out.sort((a1, b1) => a1.re - b1.re || a1.im - b1.im);
}

/** Roots of a polynomial given highest power first (c[0] s^n + ... + c[n]). Leading zeros are dropped. */
export function roots(c0: number[]): Cx[] {
  let c = c0.slice();
  while (c.length && c[0] === 0) c.shift();
  if (c.length <= 1) return [];
  const zerosAt: Cx[] = [];
  while (c.length > 1 && c[c.length - 1] === 0) { c.pop(); zerosAt.push({ re: 0, im: 0 }); }
  const n = c.length - 1;
  if (!n) return zerosAt;
  const C = zeros(n, n);
  for (let j = 0; j < n; j++) C[0][j] = -c[j + 1] / c[0];
  for (let i = 1; i < n; i++) C[i][i - 1] = 1;
  const rs = eig(C).map((z) => polish(c, z));
  return [...rs, ...zerosAt].sort((a, b) => a.re - b.re || a.im - b.im);
}
/** A few Newton steps on the polynomial to tidy a root found from the companion matrix. */
function polish(c: number[], z: Cx): Cx {
  let zr = z.re, zi = z.im;
  for (let it = 0; it < 3; it++) {
    let pr = c[0], pi = 0, dr = 0, di = 0;
    for (let k = 1; k < c.length; k++) {
      const ndr = dr * zr - di * zi + pr, ndi = dr * zi + di * zr + pi;
      dr = ndr; di = ndi;
      const npr = pr * zr - pi * zi + c[k], npi = pr * zi + pi * zr;
      pr = npr; pi = npi;
    }
    const d2 = dr * dr + di * di;
    if (!d2) break;
    const sr = (pr * dr + pi * di) / d2, si = (pi * dr - pr * di) / d2;
    const nr = zr - sr, ni = zi - si;
    if (!Number.isFinite(nr) || !Number.isFinite(ni)) break;
    if (Math.hypot(sr, si) > 1e-3 * (1 + Math.hypot(zr, zi))) break; // only small corrections
    zr = nr; zi = ni;
  }
  if (Math.abs(zi) < 1e-12 * (1 + Math.abs(zr))) zi = 0;
  return { re: zr, im: zi };
}
/** Real polynomial (highest power first, monic) with the given roots. Complex roots must come in conjugate pairs. */
export function poly(rs: Cx[]): number[] {
  let re = [1], im = [0];
  for (const z of rs) {
    const nr = new Array(re.length + 1).fill(0), ni = new Array(re.length + 1).fill(0);
    for (let k = 0; k < re.length; k++) {
      nr[k] += re[k]; ni[k] += im[k];
      nr[k + 1] -= re[k] * z.re - im[k] * z.im; ni[k + 1] -= re[k] * z.im + im[k] * z.re;
    }
    re = nr; im = ni;
  }
  return re;
}
/** p(A) for a polynomial p given highest power first (Horner). */
export function polyMat(p: number[], A: Mat): Mat {
  const n = A.length; let R = zeros(n, n);
  for (const c of p) R = add(mul(R, A), scale(eye(n), c));
  return R;
}
/** Matrix exponential: Padé (6,6) with scaling and squaring. */
export function expm(A: Mat): Mat {
  const n = A.length, nrm = normInf(A);
  const s = nrm > 0.5 ? Math.max(0, Math.ceil(Math.log2(nrm)) + 1) : 0;
  const X = scale(A, 1 / 2 ** s);
  const q = 6; let c = 1;
  let N = eye(n), D = eye(n), P = eye(n);
  for (let k = 1; k <= q; k++) {
    c = (c * (q - k + 1)) / (k * (2 * q - k + 1));
    P = mul(P, X);
    N = add(N, scale(P, c)); D = add(D, scale(P, k % 2 ? -c : c));
  }
  let E = solve(D, N);
  for (let k = 0; k < s; k++) E = mul(E, E);
  return E;
}
/** Exact zero-order-hold discretisation of x' = Ax + Bu over a step h: returns [Ad, Bd]. */
export function c2d(A: Mat, B: Mat, h: number): [Mat, Mat] {
  const n = A.length, m = B[0].length;
  const M = zeros(n + m, n + m);
  for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) M[i][j] = A[i][j] * h; for (let j = 0; j < m; j++) M[i][n + j] = B[i][j] * h; }
  const E = expm(M);
  return [E.slice(0, n).map((r) => r.slice(0, n)), E.slice(0, n).map((r) => r.slice(n))];
}
/** Format a complex number as "a ± bj". */
export function cxText(z: Cx, f: (x: number) => string): string {
  if (!z.im) return f(z.re);
  return `${f(z.re)} ${z.im < 0 ? '−' : '+'} ${f(Math.abs(z.im))}j`;
}
/**
 * Read a list of complex numbers typed as "-2, -1+3j, -1-3j" (j or i). Returns null and a message when
 * something cannot be read.
 */
export function parseCx(s: string): { list: Cx[] } | { error: string } {
  const parts = s.replace(/−/g, '-').split(/[,;\n]+|\s{2,}/).map((x) => x.replace(/\s+/g, '')).filter(Boolean);
  const out: Cx[] = [];
  for (const p of parts) {
    const m = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)?(?:([+-])((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)?\*?[ij])?$/i.exec(p);
    const m2 = /^([+-]?)((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)?\*?[ij]$/i.exec(p);
    if (m && (m[1] !== undefined || m[2])) out.push({ re: m[1] !== undefined ? Number(m[1]) : 0, im: m[2] ? (m[2] === '-' ? -1 : 1) * (m[3] !== undefined ? Number(m[3]) : 1) : 0 });
    else if (m2) out.push({ re: 0, im: (m2[1] === '-' ? -1 : 1) * (m2[2] !== undefined ? Number(m2[2]) : 1) });
    else return { error: `"${p}" is not a number like -2 or -1+3j.` };
  }
  return { list: out };
}
/** True when every complex value has its conjugate in the list. */
export function conjugateClosed(list: Cx[], tol = 1e-9): boolean {
  const left = list.filter((z) => z.im !== 0);
  const used = new Array(left.length).fill(false);
  for (let i = 0; i < left.length; i++) {
    if (used[i]) continue;
    const j = left.findIndex((w, k) => !used[k] && k !== i && Math.abs(w.re - left[i].re) <= tol * (1 + Math.abs(w.re)) && Math.abs(w.im + left[i].im) <= tol * (1 + Math.abs(w.im)));
    if (j < 0) return false;
    used[i] = used[j] = true;
  }
  return true;
}
