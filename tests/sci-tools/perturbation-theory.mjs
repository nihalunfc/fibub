// #928 perturbation theory: non-degenerate E1, E2, E3 against direct NumPy sums, degenerate first and second order
// against polynomial fits of NumPy's exact eigenvalues, the x⁴ oscillator against the textbook series
// 3/4, −21/8, 333/16, and the shared eigen-solvers against numpy.linalg.
import * as P from '../../src/lib/sci/phpert.ts';
import { fromReal, eigHermitian, eigvalsGeneral, cmadd, dagger } from '../../src/lib/sci/phq.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  { // Shared Hermitian and general eigen-solvers (reference values from numpy.linalg.eigvalsh and eigvals).
    const A = [[[0.2, 0.1], [-0.4, 0.3], [0.5, -0.2]], [[0.7, -0.6], [0.1, 0.9], [-0.3, 0.4]], [[0.8, 0.2], [-0.5, -0.1], [0.6, 0.6]]];
    const H = cmadd(A, dagger(A)), e = eigHermitian(H);
    const res = Math.max(...e.vectors.map((v, k) => Math.max(...H.map((row, i) => { const s = row.reduce((acc, a, j) => [acc[0] + a[0] * v[j][0] - a[1] * v[j][1], acc[1] + a[0] * v[j][1] + a[1] * v[j][0]], [0, 0]); return Math.hypot(s[0] - e.values[k] * v[i][0], s[1] - e.values[k] * v[i][1]); }))));
    check('pert: Hermitian Jacobi eigenvalues match numpy.linalg.eigvalsh', [-1.4873243613514973, 0.8360064632556201, 2.451317898095877].every((x, i) => near(e.values[i], x, 1e-12)) && res < 1e-13);
    const g = eigvalsGeneral(A).sort((a, b) => a[0] - b[0]);
    check('pert: general complex eigenvalues match numpy.linalg.eigvals', [[-0.41998491375566815, 0.1627336752156468], [0.21631129878022537, 0.9330204998523832], [1.1036736149754427, 0.5042458249319706]].every(([r, im], i) => near(g[i][0], r, 1e-12) && near(g[i][1], im, 1e-12)));
  }
  check('pert: complex entries are read (1-2i, 1+2i, -i, 3i)', JSON.stringify(P.parseMatrix('0 1-2i\n1+2i 3')) === '[[[0,0],[1,-2]],[[1,2],[3,0]]]' && P.parseComplex('-i')[1] === -1 && P.parseComplex('3i')[1] === 3 && P.parseComplex('2.5e-1')[0] === 0.25);
  { let e = ''; try { P.parseMatrix('1 2\n3'); } catch (x) { e = x.message; } check('pert: non-square matrix is refused', e.includes('square')); }
  { let e = ''; try { P.perturb(fromReal([[1, 2], [0, 1]]), fromReal([[0, 0], [0, 0]]), 0.1); } catch (x) { e = x.message; } check('pert: non-Hermitian matrix is refused', e.includes('Hermitian')); }
  const V = [[0.3, -0.1, 0.4, 0.2, -0.5], [-0.1, 0.2, 0.6, -0.3, 0.1], [0.4, 0.6, -0.2, 0.5, 0.3], [0.2, -0.3, 0.5, 0.1, -0.4], [-0.5, 0.1, 0.3, -0.4, 0.6]];
  const E0 = [0, 1, 1.7, 3, 4.2], H0 = E0.map((e, i) => E0.map((_, j) => (i === j ? e : 0)));
  const r = P.perturb(fromReal(H0), fromReal(V), 0.05);
  // Reference sums computed in NumPy for this V.
  const ref = [0.3, 0.2, -0.2, 0.1, 0.6];
  const direct = (k) => { let e2 = 0, b = 0, a = 0; for (let m = 0; m < 5; m++) if (m !== k) { e2 += V[m][k] ** 2 / (E0[k] - E0[m]); b += V[m][k] ** 2 / (E0[k] - E0[m]) ** 2; } for (let p = 0; p < 5; p++) for (let m = 0; m < 5; m++) if (p !== k && m !== k) a += (V[k][p] * V[p][m] * V[m][k]) / ((E0[k] - E0[p]) * (E0[k] - E0[m])); return [V[k][k], e2, a - V[k][k] * b]; };
  check('pert: non-degenerate E1, E2, E3 equal the direct sums', r.levels.every((L, k) => { const d = direct(k); return near(L.E1, d[0], 1e-13) && near(L.E2, d[1], 1e-13) && near(L.E3, d[2], 1e-13); }) && ref.every((x, k) => near(r.levels[k].E1, x, 1e-15)) && near(r.levels[0].E2, -0.17697478991596644, 1e-14));
  check('pert: exact levels match numpy.linalg.eigvalsh (λ = 0.05)', [0.014552129928, 1.008577431616, 1.691007661113, 3.005294537129, 4.230568240214].every((x, k) => near(r.levels[k].exact, x, 1e-11)));
  check('pert: third-order error is far below second-order error', r.levels.every((L) => Math.abs(L.pt3 - L.exact) <= Math.abs(L.pt2 - L.exact) + 1e-12));
  { const { H0: h, V: v } = P.hoX4(40), a = P.perturb(fromReal(h), fromReal(v), 0.01);
    check('pert: anharmonic oscillator ground state 1/2 + 3λ/4 − 21λ²/8 + 333λ³/16', near(a.levels[0].E1, 0.75, 1e-12) && near(a.levels[0].E2, -2.625, 1e-11) && near(a.levels[0].E3, 20.8125, 1e-9));
    check('pert: ⟨2|x⁴|2⟩ = 3(2n² + 2n + 1)/4 = 9.75', near(a.levels[2].E1, 9.75, 1e-12)); }
  { const Hd = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 3]], Vd = [[0, 0.5, 0, 0.3], [0.5, 0, 0, 0.2], [0, 0, 0, 0.4], [0.3, 0.2, 0.4, 0]];
    const d = P.perturb(fromReal(Hd), fromReal(Vd), 0.02); const got = d.levels.map((l) => [l.E1, l.E2]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    check('pert: degenerate first and second order match fits of exact NumPy levels', [[-0.5, -0.0025], [0, -0.08], [0, 0.145], [0.5, -0.0625]].every((x, i) => near(got[i][0], x[0], 1e-12) && near(got[i][1], x[1], 1e-12)) && d.levels.filter((l) => l.degenerate === 3).length === 3 && d.levels.every((l) => near(l.pt2, l.exact, 3e-5))); }
  { const d = P.perturb(fromReal([[0, 0, 0], [0, 0, 0], [0, 0, 2]]), fromReal([[0, 0, 1], [0, 0, 1], [1, 1, 0]]), 0.01); const e2 = d.levels.slice(0, 2).map((l) => l.E2).sort((a, b) => a - b);
    check('pert: degeneracy left by first order is split at second order (−1 and 0)', near(e2[0], -1, 1e-12) && near(e2[1], 0, 1e-12) && d.levels.slice(0, 2).every((l) => near(l.pt2, l.exact, 1e-5))); }
};
