// Anomalous Hall checker: with spin–orbit coupling, spins turn with the lattice, so the symmetry of a collinear magnet
// depends on which way its moments point (the Néel vector n for an antiferromagnet or altermagnet). For a chosen n this
// finds the magnetic point group (each crystal operation either keeps the moment pattern, or reverses it and is then a
// symmetry only together with time reversal) and the Hall vector σH = (σzy, σxz, σyx) it allows. σH is an axial vector
// that is odd under time reversal, so it must satisfy σH = det(R) R σH for each plain operation and σH = −det(R) R σH
// for each operation combined with time reversal. The allowed directions are the range of the group average
//   P = (1/|G|) Σ χ(g) det(R) R,  χ = +1 plain, −1 with time reversal,
// which is a projector. No DOM.
import { crystalOps, latticeMatrix, describe, type Crystal, type V3, type M3 } from './altermagnet.ts';

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mv = (M: M3, v: V3): V3 => [dot(M[0], v), dot(M[1], v), dot(M[2], v)];
const mm = (A: M3, B: M3): M3 => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j])) as M3;
const det = (A: M3) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
function inv(A: M3): M3 {
  const d = det(A), c = (i: number, j: number) => { const r = [0, 1, 2].filter((x) => x !== i), s = [0, 1, 2].filter((x) => x !== j); return A[r[0]][s[0]] * A[r[1]][s[1]] - A[r[0]][s[1]] * A[r[1]][s[0]]; };
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => ((i + j) % 2 ? -1 : 1) * c(j, i) / d)) as M3;
}
const wrap = (x: number) => x - Math.round(x);
const unit = (v: V3): V3 => { const n = Math.hypot(...v); return [v[0] / n, v[1] / n, v[2] / n]; };

export type MagOp = { R: M3; name: string; T: boolean }; // T: a symmetry only together with time reversal
export type HallResult = { ops: MagOp[]; dropped: number; P: M3; rank: number; basis: V3[]; net: number; magnetic: number };

/** Cartesian direction of the lattice direction [u v w] (x along a, y in the ab plane). */
export function latticeDir(cell: Crystal['cell'], uvw: V3): V3 { return unit(mv(latticeMatrix(cell), uvw)); }

/** A Cartesian direction written as the nearest small-integer lattice direction [u v w], or with decimals. */
export function dirName(cell: Crystal['cell'], v: V3): string {
  const f = mv(inv(latticeMatrix(cell)), v), mx = Math.max(...f.map(Math.abs)) || 1;
  let d = f.map((x) => x / mx);
  for (const m of [1, 2, 3, 4, 6]) { const s = d.map((x) => x * m); if (s.every((x) => Math.abs(x - Math.round(x)) < 2e-3)) { d = s.map(Math.round); break; } }
  if (d.find((x) => Math.abs(x) > 1e-9)! < 0) d = d.map((x) => -x);
  return `[${d.map((x) => (Number.isInteger(x) ? (x < 0 ? `−${-x}` : String(x)) : x.toFixed(2).replace('-', '−'))).join(' ')}]`;
}

export type Prepared = { cr: Crystal; ops: { R: M3; name: string; q: number }[] };

/** Crystal operations once, each with q = +1 if it keeps every moment, −1 if it reverses every moment, 0 otherwise. */
export function prepare(cr: Crystal, tolA = 0.1): Prepared {
  const A = latticeMatrix(cr.cell), Ai = inv(A);
  const close = (d: V3) => Math.hypot(...mv(A, [wrap(d[0]), wrap(d[1]), wrap(d[2])])) < tolA;
  const mags = cr.atoms.filter((a) => a.m);
  return { cr, ops: crystalOps(cr, tolA).map(({ W, t }) => {
    let q = mags.length ? 0 : 1;
    for (const a of mags) {
      const y = mv(W, a.f); y[0] += t[0]; y[1] += t[1]; y[2] += t[2];
      const b = cr.atoms.find((x) => x.el === a.el && close([y[0] - x.f[0], y[1] - x.f[1], y[2] - x.f[2]]));
      const r = b && b.m ? a.m / b.m : NaN, qi = Math.abs(r - 1) < 1e-6 ? 1 : Math.abs(r + 1) < 1e-6 ? -1 : 0;
      if (!qi || (q && qi !== q)) { q = 0; break; }
      q = qi;
    }
    return { R: mm(A, mm(W, Ai)), name: describe(W, t, A), q };
  }) };
}

/** Magnetic point group and allowed Hall vector for moments along the Cartesian direction n (each atom's moment is m·n̂). */
export function hall(pre: Prepared, n: V3): HallResult {
  const { cr } = pre, nh = unit(n), mags = cr.atoms.filter((a) => a.m), ops: MagOp[] = [];
  let dropped = 0;
  for (const o of pre.ops) {
    // The moment n̂ is an axial vector: it goes to det(R) R n̂, which must be +n̂ or −n̂.
    const dR = det(o.R) > 0 ? 1 : -1, v = mv(o.R, nh), cs = dR * dot(v, nh);
    const s = cs > 1 - 1e-6 ? 1 : cs < -1 + 1e-6 ? -1 : 0;
    // Plain symmetry if the moved moments match (s·q = +1); with time reversal if they are all reversed (s·q = −1).
    const c = mags.length ? s * o.q : s ? 1 : 0;
    if (!c) { dropped++; continue; }
    ops.push({ R: o.R, name: o.name, T: c === -1 });
  }
  const P = [0, 1, 2].map((i) => [0, 1, 2].map((j) => ops.reduce((acc, o) => acc + (o.T ? -1 : 1) * det(o.R) * o.R[i][j], 0) / (ops.length || 1))) as M3;
  // Orthonormal basis of the range of P by Gram–Schmidt on its columns.
  const basis: V3[] = [];
  for (let j = 0; j < 3; j++) {
    let u: V3 = [P[0][j], P[1][j], P[2][j]];
    for (const b of basis) { const p = dot(u, b); u = [u[0] - p * b[0], u[1] - p * b[1], u[2] - p * b[2]]; }
    if (Math.hypot(...u) > 1e-6) basis.push(unit(u));
  }
  // Tidy: a single direction points into the positive half; three directions become x, y, z.
  if (basis.length === 1) { const b = basis[0], k = b.find((x) => Math.abs(x) > 1e-6)!; if (k < 0) basis[0] = [-b[0], -b[1], -b[2]]; }
  if (basis.length === 3) basis.splice(0, 3, [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  basis.forEach((b, i) => { basis[i] = b.map((x) => (Math.abs(x) < 1e-12 ? 0 : x)) as V3; });
  return { ops, dropped, P, rank: basis.length, basis, net: cr.atoms.reduce((t, a) => t + a.m, 0), magnetic: mags.length };
}

/** Which antisymmetric conductivity components a set of allowed Hall directions switches on. */
export function components(basis: V3[]) {
  const names = ['σyz (Hall vector along x)', 'σzx (Hall vector along y)', 'σxy (Hall vector along z)'];
  return names.filter((_, i) => basis.some((b) => Math.abs(b[i]) > 1e-6));
}

/** Hall rank for Néel directions over the upper hemisphere (lower is the mirror image, since σH(−n) = −σH(n)). */
export function scanSphere(pre: Prepared, steps = 24) {
  const out: { theta: number; phi: number; rank: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * (Math.PI / 2), m = i === 0 ? 1 : 12 * Math.max(1, Math.round((4 * steps * Math.sin(theta)) / 12)); // multiples of 12 hit every 30° and 45° line
    for (let j = 0; j < m; j++) { const phi = (j / m) * 2 * Math.PI; out.push({ theta, phi, rank: hall(pre, [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)]).rank }); }
  }
  return out;
}
