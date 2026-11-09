// Masses on a line joined by springs: normal modes from the generalised eigenproblem K v = ω² M v (solved by the cyclic
// Jacobi method on M^-1/2 K M^-1/2), and the free motion from any starting displacement as a sum of modes. No DOM.

export type Ends = 'fixed-fixed' | 'fixed-free' | 'free-free';

/** Number of springs needed for n masses with the given ends. */
export const springCount = (n: number, ends: Ends) => (ends === 'fixed-fixed' ? n + 1 : ends === 'fixed-free' ? n : n - 1);

/** Stiffness matrix. Springs are listed left to right; with a fixed left end the first spring ties mass 1 to the wall. */
export function stiffness(n: number, k: number[], ends: Ends): number[][] {
  const K = Array.from({ length: n }, () => new Array(n).fill(0));
  const off = ends === 'free-free' ? 1 : 0; // spring j joins mass (j - 1 + off) and mass (j + off), 0-based
  for (let j = 0; j < k.length; j++) {
    const a = j - 1 + off, b = j + off;
    if (a >= 0 && a < n) K[a][a] += k[j];
    if (b >= 0 && b < n) K[b][b] += k[j];
    if (a >= 0 && b < n && a < n && b >= 0) { K[a][b] -= k[j]; K[b][a] -= k[j]; }
  }
  return K;
}

/** Eigenvalues (ascending) and unit eigenvectors (columns as arrays) of a symmetric matrix, cyclic Jacobi. */
export function jacobiEigen(A0: number[][]): { values: number[]; vectors: number[][] } {
  const n = A0.length, A = A0.map((r) => [...r]), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    const scale = A.reduce((s, r, i) => s + r[i] ** 2, 0) || 1;
    if (off <= 1e-30 * scale) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = A.map((_, i) => i).sort((a, b) => A[a][a] - A[b][b]);
  return { values: idx.map((i) => A[i][i]), vectors: idx.map((i) => V.map((r) => r[i])) };
}

export type Mode = { omega: number; f: number; T: number; shape: number[]; massNorm: number[] };

/** Normal modes, lowest first. `shape` is scaled so its largest |entry| is 1 and its first non-zero entry is positive. */
export function normalModes(m: number[], k: number[], ends: Ends): Mode[] {
  const n = m.length, K = stiffness(n, k, ends), s = m.map((x) => 1 / Math.sqrt(x));
  const A = K.map((r, i) => r.map((v, j) => v * s[i] * s[j]));
  const { values, vectors } = jacobiEigen(A);
  return values.map((lam, i) => {
    const omega = Math.sqrt(Math.max(0, lam) < 1e-12 * Math.max(...values.map(Math.abs)) ? 0 : Math.max(0, lam));
    const u = vectors[i].map((v, j) => v * s[j]); // M-orthonormal: uᵀ M u = 1
    const big = Math.max(...u.map(Math.abs)), first = u.find((x) => Math.abs(x) > 1e-9 * big) ?? 1, sg = Math.sign(first);
    return { omega, f: omega / (2 * Math.PI), T: omega > 0 ? (2 * Math.PI) / omega : Infinity, shape: u.map((x) => (sg * x) / big), massNorm: u.map((x) => sg * x) };
  });
}

/** Closed form for equal masses and springs between two walls: ω_j = 2√(k/m) sin(jπ / 2(N+1)). */
export const uniformFixedOmega = (n: number, m: number, k: number, j: number) => 2 * Math.sqrt(k / m) * Math.sin((j * Math.PI) / (2 * (n + 1)));

/** Modal amplitudes for a start from displacement x0 and velocity v0 (each mode: a cos ωt + b sin ωt; a rigid mode drifts). */
export function project(modes: Mode[], m: number[], x0: number[], v0: number[] = []) {
  return modes.map((md) => {
    const a = md.massNorm.reduce((s, u, i) => s + u * m[i] * x0[i], 0), b0 = md.massNorm.reduce((s, u, i) => s + u * m[i] * (v0[i] ?? 0), 0);
    return { a, b: md.omega > 0 ? b0 / md.omega : b0 };
  });
}
/** Displacements of every mass at time t. */
export function motionAt(modes: Mode[], coef: { a: number; b: number }[], t: number) {
  const n = modes[0].massNorm.length, x = new Array(n).fill(0);
  modes.forEach((md, j) => { const c = coef[j], q = md.omega > 0 ? c.a * Math.cos(md.omega * t) + c.b * Math.sin(md.omega * t) : c.a + c.b * t; for (let i = 0; i < n; i++) x[i] += q * md.massNorm[i]; });
  return x;
}
/** Share of the total energy in each mode (½ω²(a² + b²) per mode; for a rigid mode, ½ b²). */
export function modeEnergy(modes: Mode[], coef: { a: number; b: number }[]) {
  return modes.map((md, j) => (md.omega > 0 ? 0.5 * md.omega ** 2 * (coef[j].a ** 2 + coef[j].b ** 2) : 0.5 * coef[j].b ** 2));
}
