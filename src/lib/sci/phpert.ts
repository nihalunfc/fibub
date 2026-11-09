// Time-independent (Rayleigh–Schrödinger) perturbation theory for H = H0 + λV with Hermitian matrices:
// first, second and third order for non-degenerate levels, first and second order for degenerate ones (the
// "good" states from diagonalising V, then the second-order effective Hamiltonian, inside each degenerate set),
// compared with exact diagonalisation followed continuously in λ.
import { type C, type CM, cadd, csub, cmul, cconj, cabs, cscale, dagger, cmm, eigHermitian, isHermitian } from './phq.ts';

/** Read one complex number: "2", "-0.5", "3i", "-i", "1+2i", "1.5e-3-2i", "2+i". NaN pair if unreadable. */
export function parseComplex(s: string): C {
  const t = s.trim().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/j$/i, 'i');
  if (!t) return [NaN, NaN];
  const num = '(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?';
  let m = new RegExp(`^([-+]?${num})$`, 'i').exec(t); if (m) return [Number(m[1]), 0];
  m = new RegExp(`^([-+]?)(${num})?\\*?i$`, 'i').exec(t); if (m) return [0, (m[1] === '-' ? -1 : 1) * (m[2] ? Number(m[2]) : 1)];
  m = new RegExp(`^([-+]?${num})([-+])(${num})?\\*?i$`, 'i').exec(t); if (m) return [Number(m[1]), (m[2] === '-' ? -1 : 1) * (m[3] ? Number(m[3]) : 1)];
  return [NaN, NaN];
}

/** Read a square matrix typed or pasted as rows (spaces, tabs, commas or semicolons between entries). */
export function parseMatrix(text: string, name = 'matrix'): CM {
  const rows = text.split(/\r?\n/).map((r) => r.trim()).filter((r) => r && !r.startsWith('#'));
  if (!rows.length) throw new Error(`Type the ${name}, one row per line.`);
  const M = rows.map((r, i) => {
    const cells = (r.includes('\t') ? r.split('\t') : r.includes(';') ? r.split(';') : r.includes(',') ? r.split(',') : r.split(/\s+/)).map((c) => c.trim()).filter(Boolean);
    return cells.map((c, j) => { const z = parseComplex(c); if (!Number.isFinite(z[0]) || !Number.isFinite(z[1])) throw new Error(`${name}, row ${i + 1}, entry ${j + 1}: "${c}" is not a number (write complex numbers as 1+2i).`); return z; });
  });
  const n = M.length;
  M.forEach((r, i) => { if (r.length !== n) throw new Error(`The ${name} must be square: row ${i + 1} has ${r.length} entries, but there are ${n} rows.`); });
  return M;
}

export type Level = {
  E0: number; E1: number; E2: number; E3: number | null; degenerate: number;
  pt1: number; pt2: number; pt3: number | null; exact: number;
};
export type Result = { levels: Level[]; lambdas: number[]; exactCurves: number[][]; maxRatio: number; hermitian: boolean };

/** Exact levels followed continuously from λ = 0 (matching eigenvectors by overlap), labelled by the unperturbed order. */
export function followExact(H0: CM, V: CM, lams: number[], start: C[][]): number[][] {
  const n = H0.length; let prev = start;
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const lam of lams) {
    if (lam === 0) { // keep the given (good) basis at λ = 0, where degenerate eigenvectors are not unique
      prev.forEach((v, k) => { let e: C = [0, 0]; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) e = cadd(e, cmul(cconj(v[i]), cmul(H0[i][j], v[j]))); out[k].push(e[0]); });
      continue;
    }
    const H = H0.map((r, i) => r.map((a, j) => cadd(a, cscale(V[i][j], lam))));
    const { values, vectors } = eigHermitian(H);
    // Greedy assignment by largest overlap |⟨prev_k|v_j⟩|.
    const used = new Set<number>(), assign = new Array(n).fill(-1);
    const pairs: [number, number, number][] = [];
    for (let k = 0; k < n; k++) for (let j = 0; j < n; j++) { let s: C = [0, 0]; for (let t = 0; t < n; t++) s = cadd(s, cmul(cconj(prev[k][t]), vectors[j][t])); pairs.push([cabs(s), k, j]); }
    pairs.sort((a, b) => b[0] - a[0]);
    for (const [, k, j] of pairs) if (assign[k] < 0 && !used.has(j)) { assign[k] = j; used.add(j); }
    prev = assign.map((j) => vectors[j]);
    assign.forEach((j, k) => out[k].push(values[j]));
  }
  return out;
}

export function perturb(H0: CM, V: CM, lam: number, tol = 1e-9): Result {
  const n = H0.length;
  if (V.length !== n) throw new Error(`H₀ is ${n} × ${n} but V is ${V.length} × ${V.length}: they must be the same size.`);
  const hermitian = isHermitian(H0) && isHermitian(V);
  if (!hermitian) throw new Error('Both matrices must be Hermitian (symmetric if real): entry (i, j) must equal the complex conjugate of entry (j, i).');
  const e0 = eigHermitian(H0), E = e0.values, U = e0.vectors; // U[k] = k-th eigenvector
  const Um: CM = Array.from({ length: n }, (_, i) => U.map((v) => v[i])); // columns are eigenvectors
  let W = cmm(cmm(dagger(Um), V), Um); // V in the H0 eigenbasis
  const scale = Math.max(1, ...E.map(Math.abs));
  // Degenerate groups of H0.
  const groups: number[][] = []; let g: number[] = [0];
  for (let i = 1; i < n; i++) { if (Math.abs(E[i] - E[i - 1]) <= tol * scale) g.push(i); else { groups.push(g); g = [i]; } }
  groups.push(g);
  // Inside each degenerate group, rotate to the good basis: eigenvectors of W restricted to the group, then (for any
  // sets still degenerate) of the second-order effective Hamiltonian.
  let B = Um.map((r) => r.slice());
  const basisChange = (idx: number[], M: CM) => {
    const { vectors } = eigHermitian(M);
    const cols = idx.map((_, k) => idx.map((_, i) => vectors[k][i]));
    const newB = B.map((r) => r.slice());
    idx.forEach((ci, k) => { for (let row = 0; row < n; row++) { let s: C = [0, 0]; idx.forEach((cj, i) => { s = cadd(s, cmul(B[row][cj], cols[k][i])); }); newB[row][ci] = s; } });
    B = newB; W = cmm(cmm(dagger(B), V), B);
  };
  for (const grp of groups) {
    if (grp.length < 2) continue;
    basisChange(grp, grp.map((i) => grp.map((j) => W[i][j])));
    // Sub-sets still degenerate after first order.
    const vscale = Math.max(1e-300, ...grp.map((i) => Math.abs(W[i][i][0])), scale * 1e-12);
    const subs: number[][] = []; let s: number[] = [];
    const sorted = [...grp].sort((a, b) => W[a][a][0] - W[b][b][0]);
    for (const i of sorted) { if (s.length && Math.abs(W[i][i][0] - W[s[s.length - 1]][s[s.length - 1]][0]) > 1e-9 * vscale) { subs.push(s); s = []; } s.push(i); }
    subs.push(s);
    for (const sub of subs) if (sub.length > 1) {
      const Ed = E[sub[0]], M2: CM = sub.map((a) => sub.map((b) => { let t: C = [0, 0]; for (let m = 0; m < n; m++) if (!grp.includes(m)) t = cadd(t, cscale(cmul(W[a][m], W[m][b]), 1 / (Ed - E[m]))); return t; }));
      // Keep the first-order value on the diagonal; diagonalise only the second-order part.
      basisChange(sub, M2);
    }
  }
  const groupOf = (i: number) => groups.find((gg) => gg.includes(i))!;
  let maxRatio = 0;
  const levels: Level[] = E.map((En, k) => {
    const grp = groupOf(k), out = (m: number) => !grp.includes(m);
    const E1 = W[k][k][0];
    let E2 = 0; for (let m = 0; m < n; m++) if (out(m)) { E2 += cabs(W[m][k]) ** 2 / (En - E[m]); maxRatio = Math.max(maxRatio, (Math.abs(lam) * cabs(W[m][k])) / Math.abs(En - E[m])); }
    let E3: number | null = null;
    if (grp.length === 1) {
      let a: C = [0, 0], b = 0;
      for (let p = 0; p < n; p++) if (p !== k) for (let m = 0; m < n; m++) if (m !== k) a = cadd(a, cscale(cmul(cmul(W[k][p], W[p][m]), W[m][k]), 1 / ((En - E[p]) * (En - E[m]))));
      for (let m = 0; m < n; m++) if (m !== k) b += cabs(W[m][k]) ** 2 / (En - E[m]) ** 2;
      E3 = a[0] - E1 * b;
    }
    return { E0: En, E1, E2, E3, degenerate: grp.length, pt1: En + lam * E1, pt2: En + lam * E1 + lam * lam * E2, pt3: E3 === null ? null : En + lam * E1 + lam * lam * E2 + lam ** 3 * E3, exact: NaN };
  });
  const lambdas = Array.from({ length: 121 }, (_, i) => (lam * 1.5 * i) / 120);
  const start: C[][] = Array.from({ length: n }, (_, k) => B.map((r) => r[k]));
  const curves = followExact(H0, V, lambdas.length ? lambdas : [0], start);
  // Exact value at λ: follow the curve up to λ exactly.
  const atLam = followExact(H0, V, Array.from({ length: 81 }, (_, i) => (lam * i) / 80), start);
  levels.forEach((L, k) => { L.exact = atLam[k][atLam[k].length - 1]; });
  return { levels, lambdas, exactCurves: curves, maxRatio, hermitian };
}

// ---------- Example matrices (made up, or textbook operators) ----------
export function hoX4(N: number): { H0: number[][]; V: number[][] } {
  // x = (a + a†)/√2 in the first N oscillator states (ħ = m = ω = 1); V = x⁴.
  const x = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (j === i + 1 ? Math.sqrt(j / 2) : i === j + 1 ? Math.sqrt(i / 2) : 0)));
  const mm = (A: number[][], Bm: number[][]) => A.map((r) => Bm[0].map((_, j) => r.reduce((s, a, k) => s + a * Bm[k][j], 0)));
  const x2 = mm(x, x), x4 = mm(x2, x2);
  return { H0: Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (i === j ? i + 0.5 : 0))), V: x4 };
}
export const fmtMatrix = (M: number[][] | CM) => M.map((r) => r.map((x) => (Array.isArray(x) ? (x[1] ? `${+x[0].toPrecision(10)}${x[1] < 0 ? '-' : '+'}${Math.abs(+x[1].toPrecision(10))}i` : String(+x[0].toPrecision(10))) : String(+(+x).toPrecision(10)))).join(' ')).join('\n');
