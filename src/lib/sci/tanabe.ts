// Tanabe–Sugano diagrams for dⁿ ions in an octahedral field, from first principles.
// Every Slater determinant of n electrons in the five d orbitals (real orbitals xy, yz, zx, x²−y², z²) is a
// basis state. The electron repulsion uses the Slater integrals F2 = B + C/7 and F4 = C/35 (Racah B and C;
// the constant F0 part, Racah A, shifts every level equally and is left out). The octahedral field puts t2g
// at −4Dq and eg at +6Dq (Δ = 10Dq). For each total spin S the states are taken from the Ms = S block,
// kept to those with S² = S(S+1), the Hamiltonian is diagonalised there, and each level is named by its
// symmetry in the octahedral group, found from the characters of the many-electron state under the rotations
// E, C3, C2, C4 and C2'. Labels carry g (every dⁿ state is even under inversion). No table is copied: the
// textbook term energies (d², d³ free-ion terms, the d³/d⁸ closed forms) are only used in the tests.

export type Irrep = 'A1' | 'A2' | 'E' | 'T1' | 'T2';
export const IRREPS: Irrep[] = ['A1', 'A2', 'E', 'T1', 'T2'];
const DIM: Record<Irrep, number> = { A1: 1, A2: 1, E: 2, T1: 3, T2: 3 };
// Characters for the classes E, 8C3, 3C2, 6C4, 6C2' of the octahedral rotation group O.
const CHAR: Record<Irrep, number[]> = { A1: [1, 1, 1, 1, 1], A2: [1, 1, 1, -1, -1], E: [2, -1, 2, 0, 0], T1: [3, 0, -1, 1, -1], T2: [3, 0, -1, -1, 1] };
const CLASS_SIZE = [1, 8, 3, 6, 6];
export const LETTER = 'SPDFGHIKLMN';

// ---------- small linear algebra ----------
type Mat = Float64Array[];
const zeros = (r: number, c: number): Mat => Array.from({ length: r }, () => new Float64Array(c));

/** Eigenvalues (ascending) and eigenvectors (columns) of a real symmetric matrix: Householder + QL (EISPACK tred2/tql2). */
export function eigSym(A: ArrayLike<number>[]): { values: Float64Array; vectors: Mat } {
  const n = A.length, V = A.map((r) => Float64Array.from(r as ArrayLike<number>)), d = new Float64Array(n), e = new Float64Array(n);
  if (n === 0) return { values: d, vectors: V };
  for (let j = 0; j < n; j++) d[j] = V[n - 1][j];
  for (let i = n - 1; i > 0; i--) {
    let scale = 0, h = 0;
    for (let k = 0; k < i; k++) scale += Math.abs(d[k]);
    if (scale === 0) {
      e[i] = d[i - 1];
      for (let j = 0; j < i; j++) { d[j] = V[i - 1][j]; V[i][j] = 0; V[j][i] = 0; }
    } else {
      for (let k = 0; k < i; k++) { d[k] /= scale; h += d[k] * d[k]; }
      let f = d[i - 1], g = Math.sqrt(h);
      if (f > 0) g = -g;
      e[i] = scale * g; h -= f * g; d[i - 1] = f - g;
      for (let j = 0; j < i; j++) e[j] = 0;
      for (let j = 0; j < i; j++) {
        f = d[j]; V[j][i] = f; g = e[j] + V[j][j] * f;
        for (let k = j + 1; k <= i - 1; k++) { g += V[k][j] * d[k]; e[k] += V[k][j] * f; }
        e[j] = g;
      }
      f = 0;
      for (let j = 0; j < i; j++) { e[j] /= h; f += e[j] * d[j]; }
      const hh = f / (h + h);
      for (let j = 0; j < i; j++) e[j] -= hh * d[j];
      for (let j = 0; j < i; j++) {
        f = d[j]; g = e[j];
        for (let k = j; k <= i - 1; k++) V[k][j] -= f * e[k] + g * d[k];
        d[j] = V[i - 1][j]; V[i][j] = 0;
      }
    }
    d[i] = h;
  }
  for (let i = 0; i < n - 1; i++) {
    V[n - 1][i] = V[i][i]; V[i][i] = 1;
    const h = d[i + 1];
    if (h !== 0) {
      for (let k = 0; k <= i; k++) d[k] = V[k][i + 1] / h;
      for (let j = 0; j <= i; j++) {
        let g = 0;
        for (let k = 0; k <= i; k++) g += V[k][i + 1] * V[k][j];
        for (let k = 0; k <= i; k++) V[k][j] -= g * d[k];
      }
    }
    for (let k = 0; k <= i; k++) V[k][i + 1] = 0;
  }
  for (let j = 0; j < n; j++) { d[j] = V[n - 1][j]; V[n - 1][j] = 0; }
  V[n - 1][n - 1] = 1; e[0] = 0;
  // tql2
  for (let i = 1; i < n; i++) e[i - 1] = e[i];
  e[n - 1] = 0;
  let f = 0, tst1 = 0;
  const eps = 2 ** -52;
  for (let l = 0; l < n; l++) {
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    let m = l;
    while (m < n) { if (Math.abs(e[m]) <= eps * tst1) break; m++; }
    if (m > l) {
      let iter = 0;
      do {
        if (++iter > 60) throw new Error('eigSym did not converge');
        let g = d[l], p = (d[l + 1] - g) / (2 * e[l]), r = Math.hypot(p, 1);
        if (p < 0) r = -r;
        d[l] = e[l] / (p + r); d[l + 1] = e[l] * (p + r);
        const dl1 = d[l + 1];
        let h = g - d[l];
        for (let i = l + 2; i < n; i++) d[i] -= h;
        f += h;
        p = d[m];
        let c = 1, c2 = c, c3 = c, s = 0, s2 = 0;
        const el1 = e[l + 1];
        for (let i = m - 1; i >= l; i--) {
          c3 = c2; c2 = c; s2 = s;
          g = c * e[i]; h = c * p; r = Math.hypot(p, e[i]);
          e[i + 1] = s * r; s = e[i] / r; c = p / r; p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);
          for (let k = 0; k < n; k++) { h = V[k][i + 1]; V[k][i + 1] = s * V[k][i] + c * h; V[k][i] = c * V[k][i] - s * h; }
        }
        p = (-s * s2 * c3 * el1 * e[l]) / dl1; e[l] = s * p; d[l] = c * p;
      } while (Math.abs(e[l]) > eps * tst1);
    }
    d[l] += f; e[l] = 0;
  }
  // Sort ascending.
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => d[a] - d[b]);
  const values = Float64Array.from(idx, (i) => d[i]);
  const vectors = zeros(n, n);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) vectors[r][c] = V[r][idx[c]];
  return { values, vectors };
}

function det(M: number[][]): number {
  const n = M.length, A = M.map((r) => r.slice());
  let s = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-300) return 0;
    if (p !== c) { [A[p], A[c]] = [A[c], A[p]]; s = -s; }
    s *= A[c][c];
    for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]; }
  }
  return s;
}

// ---------- angular algebra ----------
const fact = (n: number) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
/** Wigner 3j symbol (Racah formula), integer arguments. */
export function threeJ(j1: number, j2: number, j3: number, m1: number, m2: number, m3: number): number {
  if (m1 + m2 + m3 !== 0 || Math.abs(m1) > j1 || Math.abs(m2) > j2 || Math.abs(m3) > j3) return 0;
  if (j3 < Math.abs(j1 - j2) || j3 > j1 + j2) return 0;
  const tri = (fact(j1 + j2 - j3) * fact(j1 - j2 + j3) * fact(-j1 + j2 + j3)) / fact(j1 + j2 + j3 + 1);
  const pre = Math.sqrt(tri * fact(j1 + m1) * fact(j1 - m1) * fact(j2 + m2) * fact(j2 - m2) * fact(j3 + m3) * fact(j3 - m3));
  let sum = 0;
  for (let t = 0; t <= j1 + j2 + j3; t++) {
    const a = [t, j3 - j2 + t + m1, j3 - j1 + t - m2, j1 + j2 - j3 - t, j1 - t - m1, j2 - t + m2];
    if (a.some((x) => x < 0)) continue;
    sum += (t % 2 ? -1 : 1) / a.reduce((p, x) => p * fact(x), 1);
  }
  const ph = (j1 - j2 - m3) % 2 ? -1 : 1;
  return ph * pre * sum;
}
/** Condon–Shortley c^k(l m, l m') for l = 2. */
export const ck = (k: number, m: number, mp: number) => (m % 2 ? -1 : 1) * 5 * threeJ(2, k, 2, 0, 0, 0) * threeJ(2, k, 2, -m, m - mp, mp);

// Real d orbitals as combinations of complex Y(2,m) (Condon–Shortley phases), m = −2..2 → index m + 2.
export const ORBITALS = ['xy', 'yz', 'zx', 'x²−y²', 'z²'];
type C = [number, number];
const r2 = Math.SQRT1_2;
const U: C[][] = [
  /* xy */[[0, r2], [0, 0], [0, 0], [0, 0], [0, -r2]],
  /* yz */[[0, 0], [0, r2], [0, 0], [0, r2], [0, 0]],
  /* zx */[[0, 0], [r2, 0], [0, 0], [-r2, 0], [0, 0]],
  /* x2-y2 */[[r2, 0], [0, 0], [0, 0], [0, 0], [r2, 0]],
  /* z2 */[[0, 0], [0, 0], [1, 0], [0, 0], [0, 0]],
];
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const conj = (a: C): C => [a[0], -a[1]];

/** Coulomb integrals <ab|cd> over real d orbitals for one Slater integral F^k = 1 (k = 2 or 4); also returns the largest imaginary part (0 if the phases are right). */
export function realIntegrals(k: 2 | 4) {
  const g = (m1: number, m2: number, m3: number, m4: number) => (m1 + m2 === m3 + m4 ? ck(k, m1, m3) * ck(k, m4, m2) : 0);
  const out = new Float64Array(625);
  let imag = 0;
  for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) for (let c = 0; c < 5; c++) for (let d = 0; d < 5; d++) {
    let s: C = [0, 0];
    for (let m1 = 0; m1 < 5; m1++) { const u1 = conj(U[a][m1]); if (!u1[0] && !u1[1]) continue;
      for (let m2 = 0; m2 < 5; m2++) { const u2 = conj(U[b][m2]); if (!u2[0] && !u2[1]) continue;
        for (let m3 = 0; m3 < 5; m3++) { const u3 = U[c][m3]; if (!u3[0] && !u3[1]) continue;
          for (let m4 = 0; m4 < 5; m4++) { const u4 = U[d][m4]; if (!u4[0] && !u4[1]) continue;
            const v = g(m1 - 2, m2 - 2, m3 - 2, m4 - 2); if (!v) continue;
            const p = cmul(cmul(u1, u2), cmul(u3, u4));
            s = [s[0] + p[0] * v, s[1] + p[1] * v];
          } } } }
    out[((a * 5 + b) * 5 + c) * 5 + d] = s[0];
    imag = Math.max(imag, Math.abs(s[1]));
  }
  return { ints: out, imag };
}

/** Orbital angular momentum (l = 2) in the real basis: L_a = i·A_a with A_a real antisymmetric. */
function realL(): { A: number[][][]; imag: number } {
  // Complex basis matrices.
  const Lz: C[][] = [], Lx: C[][] = [], Ly: C[][] = [];
  for (let i = 0; i < 5; i++) { Lz.push([]); Lx.push([]); Ly.push([]); for (let j = 0; j < 5; j++) {
    const mi = i - 2, mj = j - 2;
    const up = mi === mj + 1 ? Math.sqrt(6 - mj * (mj + 1)) : 0, dn = mi === mj - 1 ? Math.sqrt(6 - mj * (mj - 1)) : 0;
    Lz[i].push([mi === mj ? mi : 0, 0]); Lx[i].push([(up + dn) / 2, 0]); Ly[i].push([0, -(up - dn) / 2]);
  } }
  let imag = 0;
  const A = [Lx, Ly, Lz].map((L) => {
    const M: number[][] = [];
    for (let a = 0; a < 5; a++) { M.push([]); for (let b = 0; b < 5; b++) {
      let s: C = [0, 0];
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const p = cmul(cmul(conj(U[a][i]), L[i][j]), U[b][j]); s = [s[0] + p[0], s[1] + p[1]]; }
      imag = Math.max(imag, Math.abs(s[0])); M[a].push(s[1]); // L = i·A, so A = Im part
    } }
    return M;
  });
  return { A, imag };
}

// The rotations of the octahedron. Each is a 3×3 matrix M (r → M r); a d orbital is a quadratic form rᵀQr and
// turns into rᵀ(MᵀQM)r, which gives its 5×5 matrix in the real-orbital basis (columns = images).
const QB: number[][][] = (() => {
  const q = [
    [[0, 1, 0], [1, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 0, 1], [0, 0, 0], [1, 0, 0]],
    [[1, 0, 0], [0, -1, 0], [0, 0, 0]], [[-1, 0, 0], [0, -1, 0], [0, 0, 2]],
  ];
  return q.map((Q) => { const nrm = Math.sqrt(Q.flat().reduce((t, v) => t + v * v, 0)); return Q.map((r) => r.map((v) => v / nrm)); });
})();
const mul3 = (A: number[][], B: number[][]) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
/** The 5×5 matrix of a rotation M acting on the real d orbitals. */
export function dRep(M: number[][]): number[][] {
  const MT = [0, 1, 2].map((i) => [0, 1, 2].map((j) => M[j][i]));
  return [0, 1, 2, 3, 4].map((i) => [0, 1, 2, 3, 4].map((j) => { const T = mul3(mul3(MT, QB[j]), M); let t = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) t += QB[i][a][b] * T[a][b]; return t; }));
}
const GEN3 = [[[0, 1, 0], [0, 0, 1], [1, 0, 0]], [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]]; // C3 about [111], C4 about z
/** Class of a proper rotation of the cube: 0 E, 1 C3, 2 C2 (about an axis), 3 C4, 4 C2' (about a face diagonal). */
export const classOf = (M: number[][]) => { const t = Math.round(M[0][0] + M[1][1] + M[2][2]); if (t === 3) return 0; if (t === 0) return 1; if (t === 1) return 3; const diag = M.every((r, i) => r.every((v, j) => i === j || v === 0)); return diag ? 2 : 4; };
/**
 * The 24 rotations, each built as parent·generator. The many-electron matrices multiply in reverse order
 * (ρ(M)ρ(M') = ρ(M'M)), so each matrix M here is the generator times its parent's M, and the many-electron
 * matrix of an element is its parent's times the generator's.
 */
export const GROUP: { parent: number; gen: number; M: number[][]; cls: number }[] = (() => {
  const key = (M: number[][]) => M.flat().map((v) => Math.round(v)).join(',');
  const out = [{ parent: -1, gen: -1, M: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], cls: 0 }], seen = new Set([key(out[0].M)]);
  for (let i = 0; i < out.length; i++) for (let g = 0; g < 2; g++) {
    const M = mul3(GEN3[g], out[i].M), k = key(M);
    if (!seen.has(k)) { seen.add(k); out.push({ parent: i, gen: g, M, cls: classOf(M) }); }
  }
  return out;
})();

// ---------- determinants ----------
// Spin orbital p = 2·orbital + spin (0 = up, 1 = down); a determinant is a 10-bit mask, creation order ascending p.
const popcount = (x: number) => { let c = 0; while (x) { x &= x - 1; c++; } return c; };
/** Apply a†_p (create) or a_p (annihilate) to a mask; returns [newMask, sign] or null. */
function op(mask: number, p: number, create: boolean): [number, number] | null {
  const bit = 1 << p;
  if (create === !!(mask & bit)) return null;
  const sign = popcount(mask & (bit - 1)) % 2 ? -1 : 1;
  return [mask ^ bit, sign];
}
function dets(n: number, twoMs: number): number[] {
  const out: number[] = [];
  for (let m = 0; m < 1024; m++) {
    if (popcount(m) !== n) continue;
    let up = 0; for (let i = 0; i < 5; i++) if (m & (1 << (2 * i))) up++;
    if (up - (n - up) === twoMs) out.push(m);
  }
  return out;
}
const occ = (m: number) => { const o: number[] = []; for (let p = 0; p < 10; p++) if (m & (1 << p)) o.push(p); return o; };

let INTS: { 2: Float64Array; 4: Float64Array } | null = null;
let LREAL: number[][][] | null = null;

type Block = { basis: number[]; M2: Mat; M4: Mat; CF: Mat; S2: Mat; L2: Mat; R: Mat[] };
function buildBlock(n: number, twoMs: number): Block {
  // F^2 = 49·F2 and F^4 = 441·F4 (Condon–Shortley normalisation of the Racah parameters).
  if (!INTS) INTS = { 2: realIntegrals(2).ints.map((v) => 49 * v), 4: realIntegrals(4).ints.map((v) => 441 * v) };
  if (!LREAL) LREAL = realL().A;
  const basis = dets(n, twoMs), N = basis.length, index = new Map(basis.map((m, i) => [m, i]));
  const M2 = zeros(N, N), M4 = zeros(N, N), CF = zeros(N, N), S2 = zeros(N, N);
  const I2 = INTS[2], I4 = INTS[4];
  basis.forEach((D, j) => {
    const o = occ(D);
    // Crystal field (diagonal): t2g −0.4 Δ, eg +0.6 Δ per electron.
    CF[j][j] = o.reduce((s, p) => s + ((p >> 1) < 3 ? -0.4 : 0.6), 0);
    // Coulomb: Σ_{p<q} Σ_{r<s} <pq||rs> a†p a†q a_s a_r.
    for (let x = 0; x < o.length; x++) for (let y = x + 1; y < o.length; y++) {
      const r = o[x], s = o[y];
      const t1 = op(D, r, false)!, t2 = op(t1[0], s, false)!;
      const D0 = t2[0], sg0 = t1[1] * t2[1];
      for (let q = 0; q < 10; q++) { const u1 = op(D0, q, true); if (!u1) continue;
        for (let p = 0; p < q; p++) { const u2 = op(u1[0], p, true); if (!u2) continue;
          const i = index.get(u2[0]); if (i === undefined) continue;
          // a†p a†q a_s a_r: annihilate r first, then s; create q, then p.
          const sign = sg0 * u1[1] * u2[1];
          const sp = p & 1, sq = q & 1, sr = r & 1, ss = s & 1;
          const P = p >> 1, Q = q >> 1, R = r >> 1, S = s >> 1;
          // <pq||rs> = <pq|rs> − <pq|sr>, with electron 1 in p, r and electron 2 in q, s.
          const k1 = sp === sr && sq === ss ? ((P * 5 + Q) * 5 + R) * 5 + S : -1;
          const k2 = sp === ss && sq === sr ? ((P * 5 + Q) * 5 + S) * 5 + R : -1;
          const v2 = (k1 >= 0 ? I2[k1] : 0) - (k2 >= 0 ? I2[k2] : 0), v4 = (k1 >= 0 ? I4[k1] : 0) - (k2 >= 0 ? I4[k2] : 0);
          // The order in which we annihilate (r then s) gives a†p a†q a_s a_r up to the sign already counted.
          M2[i][j] += sign * v2; M4[i][j] += sign * v4;
        } }
    }
    // S² = S−S+ + Sz(Sz + 1).
    const sz = twoMs / 2;
    S2[j][j] += sz * (sz + 1);
    for (let a = 0; a < 5; a++) { const d1 = op(D, 2 * a + 1, false); if (!d1) continue; const c1 = op(d1[0], 2 * a, true); if (!c1) continue; // S+ term
      for (let b = 0; b < 5; b++) { const d2 = op(c1[0], 2 * b, false); if (!d2) continue; const c2 = op(d2[0], 2 * b + 1, true); if (!c2) continue;
        const i = index.get(c2[0]); if (i !== undefined) S2[i][j] += d1[1] * c1[1] * d2[1] * c2[1];
      } }
  });
  // L² = −Σ_a Â_a², with Â_a = Σ A_a[p][q] a†p a_q (same spin).
  const Ahat = LREAL!.map((A) => {
    const M = zeros(N, N);
    basis.forEach((D, j) => { for (let q = 0; q < 10; q++) { const d1 = op(D, q, false); if (!d1) continue;
      for (let pp = q & 1; pp < 10; pp += 2) { const v = A[pp >> 1][q >> 1]; if (!v) continue; const c1 = op(d1[0], pp, true); if (!c1) continue;
        const i = index.get(c1[0]); if (i !== undefined) M[i][j] += v * d1[1] * c1[1];
      } } });
    return M;
  });
  const L2 = zeros(N, N);
  for (const A of Ahat) for (let i = 0; i < N; i++) for (let k = 0; k < N; k++) { const a = A[i][k]; if (!a) continue; for (let j = 0; j < N; j++) L2[i][j] -= a * A[k][j]; }
  // Rotations: <D'|R|D> = det(R[occ D', occ D]) (spin conserved).
  const R = GEN3.map((G) => { const Rm = dRep(G);
    const M = zeros(N, N);
    basis.forEach((D, j) => { const oj = occ(D); basis.forEach((Dp, i) => {
      const oi = occ(Dp);
      M[i][j] = det(oi.map((pi) => oj.map((pj) => ((pi & 1) === (pj & 1) ? Rm[pi >> 1][pj >> 1] : 0))));
    }); });
    return M;
  });
  return { basis, M2, M4, CF, S2, L2, R };
}

const project = (M: Mat, P: Mat, d: number): Mat => {
  const N = M.length, T = zeros(N, d), out = zeros(d, d);
  for (let i = 0; i < N; i++) for (let k = 0; k < N; k++) { const m = M[i][k]; if (!m) continue; for (let c = 0; c < d; c++) T[i][c] += m * P[k][c]; }
  for (let a = 0; a < d; a++) for (let i = 0; i < N; i++) { const p = P[i][a]; if (!p) continue; for (let c = 0; c < d; c++) out[a][c] += p * T[i][c]; }
  return out;
};

type Sym = { irrep: Irrep; size: number; M2: Mat; M4: Mat; CF: Mat; L2: Mat };
export type SpinSpace = { S: number; dim: number; M2: Mat; M4: Mat; CF: Mat; L2: Mat; /** one element of each class C3, C2, C4, C2' */ cls: Mat[]; sym: Sym[] };
const cache = new Map<number, SpinSpace[]>();
const matmul = (A: Mat, B: Mat): Mat => { const n = A.length, m = B[0]?.length ?? 0, k = B.length, C = zeros(n, m); for (let i = 0; i < n; i++) for (let t = 0; t < k; t++) { const a = A[i][t]; if (!a) continue; const Bt = B[t], Ci = C[i]; for (let j = 0; j < m; j++) Ci[j] += a * Bt[j]; } return C; };

/**
 * The pieces of the Hamiltonian for each total spin S of dⁿ, in an orthonormal basis of the S states with
 * Ms = S, and split further by octahedral symmetry with the projectors (dΓ/24) Σ χΓ(g) R(g).
 */
export function spinSpaces(n: number): SpinSpace[] {
  if (!(Number.isInteger(n) && n >= 1 && n <= 9)) throw new Error('dⁿ needs n from 1 to 9.');
  const hit = cache.get(n); if (hit) return hit;
  const Smax = Math.min(n, 10 - n) / 2, out: SpinSpace[] = [];
  for (let S = Smax; S >= 0; S -= 1) {
    const b = buildBlock(n, Math.round(2 * S));
    const { values, vectors } = eigSym(b.S2);
    const target = S * (S + 1), cols: number[] = [];
    values.forEach((v, i) => { if (Math.abs(v - target) < 1e-6) cols.push(i); });
    const d = cols.length, N = b.basis.length;
    if (!d) continue;
    const P = zeros(N, d);
    for (let i = 0; i < N; i++) cols.forEach((c, k) => { P[i][k] = vectors[i][c]; });
    const M2 = project(b.M2, P, d), M4 = project(b.M4, P, d), CF = project(b.CF, P, d), L2 = project(b.L2, P, d);
    // All 24 rotations in this space.
    const gens = b.R.map((M) => project(M, P, d));
    const reps: Mat[] = [];
    GROUP.forEach((g, i) => { reps[i] = g.parent < 0 ? Array.from({ length: d }, (_, r) => { const row = new Float64Array(d); row[r] = 1; return row; }) : matmul(reps[g.parent], gens[g.gen]); });
    const cls = [1, 2, 3, 4].map((c) => reps[GROUP.findIndex((g) => g.cls === c)]);
    const sym: Sym[] = [];
    for (const irrep of IRREPS) {
      const Pg = zeros(d, d);
      GROUP.forEach((g, i) => { const w = (DIM[irrep] * CHAR[irrep][g.cls]) / 24; if (!w) return; const R = reps[i]; for (let r = 0; r < d; r++) for (let c = 0; c < d; c++) Pg[r][c] += w * R[r][c]; });
      // Symmetrise against round-off, then keep the eigenvectors with eigenvalue 1.
      for (let r = 0; r < d; r++) for (let c = 0; c < r; c++) { const m = (Pg[r][c] + Pg[c][r]) / 2; Pg[r][c] = Pg[c][r] = m; }
      const e = eigSym(Pg), keep: number[] = [];
      e.values.forEach((v, i) => { if (v > 0.5) keep.push(i); });
      if (!keep.length) continue;
      const Q = zeros(d, keep.length);
      for (let r = 0; r < d; r++) keep.forEach((c, k) => { Q[r][k] = e.vectors[r][c]; });
      sym.push({ irrep, size: keep.length, M2: project(M2, Q, keep.length), M4: project(M4, Q, keep.length), CF: project(CF, Q, keep.length), L2: project(L2, Q, keep.length) });
    }
    if (sym.reduce((t, x) => t + x.size, 0) !== d) throw new Error('Symmetry blocks do not add up.');
    out.push({ S, dim: d, M2, M4, CF, L2, cls, sym });
  }
  cache.set(n, out);
  return out;
}

export type Level = { S: number; mult: number; irrep: Irrep; E: number; /** order among levels of the same S and irrep, from 1, lowest first */ k: number };

/** All levels of dⁿ at Δ/B = x and C/B = gamma, energies in units of B (no shift: the F0 part is left out). */
export function levels(n: number, x: number, gamma: number): Level[] {
  const F2 = 1 + gamma / 7, F4 = gamma / 35, out: Level[] = [];
  for (const sp of spinSpaces(n)) for (const b of sp.sym) {
    const m = b.size, H = zeros(m, m), dg = DIM[b.irrep];
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) H[i][j] = F2 * b.M2[i][j] + F4 * b.M4[i][j] + x * b.CF[i][j];
    const v = eigSym(H).values;
    for (let i = 0, k = 1; i < m; i += dg, k++) { let E = 0; for (let j = 0; j < dg; j++) E += v[i + j]; out.push({ S: sp.S, mult: Math.round(2 * sp.S + 1), irrep: b.irrep, E: E / dg, k }); }
  }
  return out.sort((a, b) => a.E - b.E || b.mult - a.mult);
}

/** The same levels found the other way: diagonalise the whole spin space and name each degenerate group by its characters. */
export function levelsByCharacters(n: number, x: number, gamma: number): Level[] {
  const F2 = 1 + gamma / 7, F4 = gamma / 35, out: Level[] = [];
  for (const sp of spinSpaces(n)) {
    const d = sp.dim, H = zeros(d, d);
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) H[i][j] = F2 * sp.M2[i][j] + F4 * sp.M4[i][j] + x * sp.CF[i][j];
    const { values, vectors } = eigSym(H);
    const tol = 1e-7 * Math.max(1, ...Array.from(values, Math.abs));
    const count: Record<string, number> = {};
    for (let i = 0; i < d;) {
      let j = i + 1; while (j < d && values[j] - values[j - 1] < tol) j++;
      const chi = [j - i, ...sp.cls.map((R) => { let t = 0; for (let c = i; c < j; c++) for (let a = 0; a < d; a++) { const va = vectors[a][c]; if (!va) continue; let s = 0; for (let b = 0; b < d; b++) s += R[a][b] * vectors[b][c]; t += va * s; } return t; })];
      const E = values.slice(i, j).reduce((s, v) => s + v, 0) / (j - i);
      let used = 0;
      for (const g of IRREPS) {
        const m = Math.round(CHAR[g].reduce((s, c, q) => s + CLASS_SIZE[q] * c * chi[q], 0) / 24);
        for (let r = 0; r < m; r++) { count[g] = (count[g] ?? 0) + 1; out.push({ S: sp.S, mult: Math.round(2 * sp.S + 1), irrep: g, E, k: count[g] }); used += DIM[g]; }
      }
      if (used !== j - i) throw new Error(`Could not name a level (dimension ${j - i}).`);
      i = j;
    }
  }
  return out.sort((a, b) => a.E - b.E || b.mult - a.mult);
}

export type Term = { S: number; mult: number; L: number; name: string; E: number; dim: number };
/** Free-ion terms of dⁿ (Δ = 0), energies in B relative to the lowest, sorted. */
export function freeIonTerms(n: number, gamma: number): Term[] {
  const F2 = 1 + gamma / 7, F4 = gamma / 35, out: Term[] = [];
  for (const sp of spinSpaces(n)) {
    const d = sp.dim, H = zeros(d, d);
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) H[i][j] = F2 * sp.M2[i][j] + F4 * sp.M4[i][j];
    const { values, vectors } = eigSym(H);
    const tol = 1e-7 * Math.max(1, ...Array.from(values, Math.abs));
    for (let i = 0; i < d;) {
      let j = i + 1; while (j < d && values[j] - values[j - 1] < tol) j++;
      // L² inside this group (splits accidentally equal terms).
      const g = j - i, Lg = zeros(g, g);
      for (let a = 0; a < g; a++) for (let b = 0; b < g; b++) { let s = 0; for (let p = 0; p < d; p++) { const vp = vectors[p][i + a]; if (!vp) continue; for (let q = 0; q < d; q++) s += vp * sp.L2[p][q] * vectors[q][i + b]; } Lg[a][b] = s; }
      const lv = eigSym(Lg).values;
      for (let a = 0; a < g;) {
        const L = Math.round((-1 + Math.sqrt(1 + 4 * lv[a])) / 2);
        const size = 2 * L + 1;
        out.push({ S: sp.S, mult: Math.round(2 * sp.S + 1), L, name: `${Math.round(2 * sp.S + 1)}${LETTER[L]}`, E: values[i], dim: size });
        a += size;
      }
      i = j;
    }
  }
  const e0 = Math.min(...out.map((t) => t.E));
  return out.map((t) => ({ ...t, E: t.E - e0 })).sort((a, b) => a.E - b.E || b.mult - a.mult || b.L - a.L);
}

/** Free-ion parent (L) of each level, from <L²> just above Δ = 0; undefined where the parentage is mixed. */
export function parents(n: number, gamma: number): Map<string, number | undefined> {
  const x = 1e-4, F2 = 1 + gamma / 7, F4 = gamma / 35, out = new Map<string, number | undefined>();
  for (const sp of spinSpaces(n)) for (const b of sp.sym) {
    const m = b.size, H = zeros(m, m), dg = DIM[b.irrep];
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) H[i][j] = F2 * b.M2[i][j] + F4 * b.M4[i][j] + x * b.CF[i][j];
    const { vectors } = eigSym(H);
    for (let i = 0, k = 1; i < m; i += dg, k++) {
      let l2 = 0;
      for (let c = i; c < i + dg; c++) for (let a = 0; a < m; a++) { const va = vectors[a][c]; if (!va) continue; let s = 0; for (let q = 0; q < m; q++) s += b.L2[a][q] * vectors[q][c]; l2 += va * s; }
      l2 /= dg;
      const L = (-1 + Math.sqrt(1 + 4 * l2)) / 2, Lr = Math.round(L);
      out.set(`${Math.round(2 * sp.S + 1)}${b.irrep}#${k}`, Math.abs(L - Lr) < 0.02 ? Lr : undefined);
    }
  }
  return out;
}

export type Curve = { key: string; mult: number; irrep: Irrep; k: number; parent?: number; label: string; /** which side of each ground-state change (0 = weak field) */ seg: number; x: number[]; y: number[] };
export type Diagram = { n: number; gamma: number; xs: number[]; curves: Curve[]; ground: string[]; crossings: number[]; groundMult: number[] };

const SUB: Record<Irrep, string> = { A1: 'A₁g', A2: 'A₂g', E: 'Eg', T1: 'T₁g', T2: 'T₂g' };
const SUPN = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷'];
export const pretty = (mult: number, irrep: Irrep, parent?: number) => `${SUPN[mult]}${SUB[irrep]}${parent !== undefined ? `(${LETTER[parent]})` : ''}`;

/** Find where the ground state changes between Δ/B = a and b (bisection). */
function crossing(n: number, gamma: number, a: number, b: number, ga: string) {
  for (let it = 0; it < 60; it++) { const m = (a + b) / 2, l = levels(n, m, gamma)[0]; if (`${l.mult}${l.irrep}#${l.k}` === ga) a = m; else b = m; }
  return (a + b) / 2;
}

/** The whole diagram: E/B relative to the ground state against Δ/B from 0 to xMax. */
export function diagram(n: number, gamma: number, xMax = 40, steps = 200): Diagram {
  if (!(gamma > 0 && gamma < 50)) throw new Error('C/B should be a positive number, usually between 3 and 6.');
  if (!(xMax > 0 && xMax <= 200)) throw new Error('Δ/B up to between 1 and 200.');
  const par = parents(n, gamma);
  const raw: Level[][] = [], xs: number[] = [];
  for (let s = 0; s <= steps; s++) { const x = (xMax * s) / steps; xs.push(x); raw.push(levels(n, x, gamma)); }
  const key = (l: Level) => `${l.mult}${l.irrep}#${l.k}`;
  // Ground-state changes.
  const g0 = levels(n, Math.min(1e-6, xMax / steps / 10), gamma)[0]; // the free-ion ground term splits at once
  const crossings: number[] = [], ground: string[] = [key(g0)], groundMult = [g0.mult];
  for (let s = 1; s <= steps; s++) {
    const g = key(raw[s][0]);
    if (g !== ground[ground.length - 1]) { crossings.push(crossing(n, gamma, xs[s - 1], xs[s], ground[ground.length - 1])); ground.push(g); groundMult.push(raw[s][0].mult); }
  }
  // Points: the grid plus each crossing twice (once on each side), so the jump is a clean break.
  const pts: { x: number; L: Level[]; seg: number }[] = [];
  let seg = 0;
  xs.forEach((x, s) => {
    while (seg < crossings.length && crossings[seg] <= x) { const L = levels(n, crossings[seg], gamma); pts.push({ x: crossings[seg], L, seg }, { x: crossings[seg], L, seg: seg + 1 }); seg++; }
    pts.push({ x, L: raw[s], seg });
  });
  const curves = new Map<string, Curve>();
  for (const { x, L, seg: sg } of pts) {
    const gl = L.find((l) => key(l) === ground[sg])!;
    for (const l of L) {
      const ck2 = `${key(l)}@${sg}`;
      let c = curves.get(ck2);
      if (!c) { const p = par.get(key(l)); c = { key: key(l), mult: l.mult, irrep: l.irrep, k: l.k, parent: p, label: pretty(l.mult, l.irrep, p), seg: sg, x: [], y: [] }; curves.set(ck2, c); }
      c.x.push(x); c.y.push(l.E - gl.E);
    }
  }
  return { n, gamma, xs, curves: [...curves.values()], ground, crossings, groundMult };
}

/** Levels at one Δ/B, relative to the ground state there. */
export function readAt(n: number, x: number, gamma: number) {
  const L = levels(n, x, gamma), par = parents(n, gamma), e0 = L[0].E;
  return L.map((l) => { const p = par.get(`${l.mult}${l.irrep}#${l.k}`); return { ...l, E: l.E - e0, parent: p, label: pretty(l.mult, l.irrep, p) }; });
}

/** Ground-state multiplicity of the weak-field (high-spin) ion: spin-allowed bands keep this spin. */
export const highSpinMult = (n: number) => { const u = n <= 5 ? n : 10 - n; return u + 1; };

/**
 * d³ or d⁸: Δ and B from the two lowest spin-allowed bands ν1 (→ ⁴T₂g / ³T₂g, equal to Δ) and
 * ν2 (→ ⁴T₁g(F) / ³T₁g(F)). Returns Δ, B, Δ/B and the predicted third band ν3 (→ T₁g(P)).
 */
export function fitTwoBands(n: 3 | 8, nu1: number, nu2: number, gamma = 4.5) {
  if (!(nu1 > 0 && nu2 > 0)) throw new Error('Give both band positions as positive numbers.');
  const r = nu2 / nu1;
  const mult = highSpinMult(n);
  const ratio = (x: number) => { const L = levels(n, x, gamma); const e0 = L[0].E; const T2 = L.find((l) => l.mult === mult && l.irrep === 'T2' && l.k === 1)!, T1 = L.find((l) => l.mult === mult && l.irrep === 'T1' && l.k === 1)!; return { r: (T1.E - e0) / (T2.E - e0), T2: T2.E - e0, T1: T1.E - e0, T1b: L.find((l) => l.mult === mult && l.irrep === 'T1' && l.k === 2)!.E - e0 }; };
  let lo = 0.05, hi = 2000;
  const rLo = ratio(lo).r, rHi = ratio(hi).r;
  if (!(r < rLo && r > rHi)) throw new Error(`For d${n === 3 ? '³' : '⁸'} the second band must lie between ${(rHi).toFixed(3)} and ${rLo.toFixed(3)} times the first. Check that ν1 is the lowest band and ν2 the next spin-allowed one.`);
  for (let it = 0; it < 80; it++) { const m = Math.sqrt(lo * hi); if (ratio(m).r > r) lo = m; else hi = m; }
  const x = Math.sqrt(lo * hi), R = ratio(x);
  const B = nu1 / R.T2; // T2 lies exactly at Δ: R.T2 = x
  return { x, B, Delta: x * B, nu3: R.T1b * B, nu2: R.T1 * B };
}

/** Wavenumber (cm⁻¹) ⇄ wavelength (nm). */
export const toNm = (cm: number) => 1e7 / cm;
