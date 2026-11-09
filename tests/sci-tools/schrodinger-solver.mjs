// #923 1D Schrödinger solver: finite-difference levels against analytic levels, and against SciPy's
// eigh_tridiagonal on the same grid (values computed with SciPy 1.x for these tests).
import * as S from '../../src/lib/sci/phschro.ts';
import { tridiagLowest } from '../../src/lib/sci/phq.ts';

export default async (check) => {
  const close = (a, b, tol) => a.length >= b.length && b.every((v, i) => Math.abs(a[i] - v) <= tol * Math.max(1, Math.abs(v)));
  { const t = tridiagLowest([2, 2, 2, 2, 2], [-1, -1, -1, -1], 5).values; check('schrodinger: tridiagonal eigenvalues 2 − 2cos(kπ/6)', close(t, [1, 2, 3, 4, 5].map((k) => 2 - 2 * Math.cos((k * Math.PI) / 6)), 1e-13)); }
  check('schrodinger: ħ²/2mₑ = 0.0380998 eV nm²', Math.abs(S.C_ELECTRON - 0.0380998211383624) < 1e-14);
  check('schrodinger: Airy zeros match scipy.special.ai_zeros', close(S.airyZeros(5), [2.33810741, 4.08794944, 5.52055983, 6.78670809, 7.94413359], 2e-9));
  check('schrodinger: finite well exact levels match SciPy brentq', close(S.finiteWellLevels(10, 2, 0.5), [-9.180259926233367, -6.77906002141041, -3.054233508773814], 1e-10));
  check('schrodinger: Pöschl–Teller levels −8, −4.5, −2, −0.5 (λ = 5)', close(S.poschlTellerLevels(10, 1, 0.5), [-8, -4.5, -2, -0.5], 1e-12));
  const run = (id, x0, x1, p, k = 6) => { const pot = S.potential(id, { p1: p[0], p2: p[1], p3: p[2] }, 0.5, x0, x1, '', [], k); return { pot, sol: S.solve(pot.V, x0, x1, 1000, k, 0.5) }; };
  { const { sol } = run('harmonic', -8, 8, [1, 0, 0]); const E = sol.states.map((s) => s.E);
    check('schrodinger: harmonic levels equal SciPy eigh_tridiagonal on the same grid', close(E, [0.49999202, 1.49996008, 2.4998962, 3.49980039, 4.49967263, 5.49951293], 2e-8));
    check('schrodinger: harmonic levels within 1e-4 of ħω(n + ½)', close(E, [0.5, 1.5, 2.5, 3.5, 4.5, 5.5], 1e-4));
    check('schrodinger: nodes 0..5 and normalised', sol.states.every((s, i) => s.nodes === i && Math.abs(s.psi.reduce((a, v) => a + v * v, 0) * sol.h - 1) < 1e-12));
    const s0 = sol.states[0]; check('schrodinger: ground state Δx = 1/√2 (ħ = m = ω = 1)', Math.abs(s0.spread - Math.SQRT1_2) < 1e-4);
    check('schrodinger: ground state forbidden-region probability 0.1573 (erfc 1)', Math.abs(S.forbidden(sol, 0) - 0.157299) < 4e-3); }
  { const { sol, pot } = run('box', 0, 1, [0, 0, 0]); check('schrodinger: box levels within 5e-5 of n²π²/2', close(sol.states.map((s) => s.E), pot.exact.slice(0, 6), 5e-5)); }
  { const { sol } = run('double', -5, 5, [5, 1.5, 0]); check('schrodinger: double well matches SciPy (1.95664631, 1.99967308, ...)', close(sol.states.map((s) => s.E), [1.95664631, 1.99967308, 4.86648796, 5.74089264, 7.78923919, 9.90488093], 2e-8)); }
  { const { sol } = run('finite', -6, 6, [10, 2, 0]); check('schrodinger: finite well matches SciPy on the same grid', close(sol.states.map((s) => s.E), [-9.17369668, -6.75414683, -3.00589751, 0.14267878, 0.20090464, 0.553478], 2e-8)); }
  { const { sol, pot } = run('morse', -4, 20, [10, 0.5, 0], 3); check('schrodinger: Morse levels near the Morse formula (1.08678, 3.07285, 4.80892)', close(sol.states.map((s) => s.E), pot.exact.slice(0, 3), 3e-4) && close(pot.exact, [1.08678378, 3.07285112, 4.80891821], 1e-6)); }
  { const { sol, pot } = run('linear', 0, 15, [1, 0, 0]); check('schrodinger: linear well within 1e-4 of the Airy levels', close(sol.states.map((s) => s.E), pot.exact.slice(0, 6), 1e-4)); }
  { const pot = S.potential('formula', { p1: 0, p2: 0, p3: 0 }, 0.5, -8, 8, '0.5*x^2'); const sol = S.solve(pot.V, -8, 8, 1000, 2, 0.5); check('schrodinger: formula 0.5*x^2 gives the harmonic levels', close(sol.states.map((s) => s.E), [0.49999202, 1.49996008], 2e-8)); }
  { let bad = ''; try { S.potential('formula', { p1: 0, p2: 0, p3: 0 }, 0.5, -1, 1, 'a*x'); } catch (e) { bad = e.message; } check('schrodinger: formula with an unknown name is refused', bad.includes('only use x')); }
  { const V = S.drawnV([0, 10, 0], 0, 2); check('schrodinger: drawn potential is joined by straight lines', V(0.5) === 5 && V(1) === 10 && V(2) === 0); }
};
