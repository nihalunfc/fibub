// #907 coupled oscillators: normal modes checked against SciPy eigh (generalised problem) and the closed form for a uniform
// chain; motion checked against the matrix exponential of the state-space system (SciPy expm).
import { normalModes, uniformFixedOmega, project, motionAt, modeEnergy, stiffness, jacobiEigen } from '../../src/lib/sci/phcoupled.ts';
export default async (check) => {
  const near = (a, b, t = 1e-10) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const m = [1, 2, 1.5], k = [10, 20, 15, 5];
  const md = normalModes(m, k, 'fixed-fixed');
  check('coupled: 3 unequal masses between walls, ω vs SciPy eigh', [1.7076339856216651, 4.22090314427565, 6.332558420664363].every((w, i) => near(md[i].omega, w)));
  const shapes = [[0.7384437384370028, 1.0, 0.9599398382373121], [0.735833652678166, 0.4482690020022739, -1.0], [1.0, -0.5050648075563562, 0.18868257214576614]];
  check('coupled: mode shapes vs SciPy eigh', shapes.every((s, i) => s.every((x, j) => near(md[i].shape[j], x, 1e-9))));
  check('coupled: one end free, ω vs SciPy', [1.2527157266624647, 3.9913285141882944, 6.324555320336759].every((w, i) => near(normalModes(m, [10, 20, 15], 'fixed-free')[i].omega, w)));
  { const ff = normalModes(m, [20, 15], 'free-free'); check('coupled: both ends free, a zero (rigid) mode and ω vs SciPy', ff[0].omega === 0 && near(ff[1].omega, 3.6152448490182634) && near(ff[2].omega, 5.8677086398053975) && ff[0].shape.every((x) => near(x, 1))); }
  { const u = normalModes(new Array(6).fill(0.5), new Array(7).fill(8), 'fixed-fixed'); check('coupled: uniform chain of 6 matches 2√(k/m) sin(jπ/2(N+1))', u.every((x, j) => near(x.omega, uniformFixedOmega(6, 0.5, 8, j + 1)))); }
  { const o = normalModes(m, k, 'fixed-fixed'); let ok = true; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const d = o[a].massNorm.reduce((s, u, i) => s + u * m[i] * o[b].massNorm[i], 0); if (!near(d, a === b ? 1 : 0, 1e-10)) ok = false; } check('coupled: modes are M-orthonormal', ok); }
  const c = project(md, m, [0.1, 0, 0], [0, 0.2, 0]), x = motionAt(md, c, 1.7);
  check('coupled: motion at t = 1.7 s from x₀, v₀ vs SciPy expm', near(x[0], 0.026057484034739974, 1e-9) && near(x[1], 0.00770571072606524, 1e-9) && near(x[2], -0.035447158731616205, 1e-9));
  { const E = modeEnergy(md, c).reduce((s, e) => s + e, 0), K = stiffness(3, k, 'fixed-fixed'), x0 = [0.1, 0, 0], v0 = [0, 0.2, 0];
    const pe = 0.5 * x0.reduce((s, xi, i) => s + xi * K[i].reduce((t, kij, j) => t + kij * x0[j], 0), 0), ke = 0.5 * v0.reduce((s, v, i) => s + m[i] * v * v, 0);
    check('coupled: energy in the modes adds up to ½xᵀKx + ½vᵀMv', near(E, pe + ke, 1e-12)); }
  { const e = jacobiEigen([[2, 1], [1, 2]]); check('coupled: Jacobi on [[2,1],[1,2]] gives 1 and 3', near(e.values[0], 1) && near(e.values[1], 3)); }
};
