// Extra question shapes for variational-wkb (templates qvw-m31..m35). Imported by variational-wkb.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq } from './_more.js';

export default [
  { id: 'qvw-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'trial functions', format: 'which is NOT',
    make(r) {
      const S = choose(r, [
        { name: 'an infinite square well $0 < x < L$', good: ['$x(L - x)$', '$x^2(L - x)$', '$\\sin(\\pi x/L)\\,[1 + 0.1\\,x(L - x)/L^2]$', '$x(L - x)(L + x)$'], bad: [['$e^{-x/L}$', 'it does not vanish at the walls, so the kinetic energy (with the infinite walls) is infinite'], ['$x(L - x) + L^2/10$', 'it is non-zero at the walls'], ['$\\cos(\\pi x/L)$', 'it is non-zero at both walls']] },
        { name: 'a harmonic oscillator on the whole line (ground-state estimate)', good: ['$e^{-\\beta x^2}$', '$1/(1 + \\beta x^2)$', '$e^{-\\beta|x|}$', '$(1 + \\beta x^2)e^{-\\beta x^2}$'], bad: [['$e^{-\\beta x}$', 'it blows up as $x \\to -\\infty$ and cannot be normalised'], ['$\\cos(\\beta x)$', 'it does not decay, so it cannot be normalised'], ['$1/(1 + \\beta|x|)^{1/2}$', '$|\\psi|^2$ falls only as $1/|x|$, so the norm integral diverges']] },
        { name: 'a particle in $V = \\tfrac12m\\omega^2x^2$ for $x > 0$ with a hard wall at $x = 0$', good: ['$xe^{-\\beta x^2}$', '$xe^{-\\beta x}$', '$x/(1 + \\beta x^2)^2$', '$x^2e^{-\\beta x^2}$'], bad: [['$e^{-\\beta x^2}$', 'it is non-zero at the hard wall'], ['$e^{-\\beta x}$', 'it is non-zero at the hard wall'], ['$x$', 'it grows without bound and cannot be normalised']] },
        { name: 'the hydrogen atom ground state (radial trial function $\\psi(r)$)', good: ['$e^{-\\beta r}$', '$e^{-\\beta r^2}$', '$1/(1 + \\beta r)^3$', '$(1 + \\beta r)e^{-2\\beta r}$'], bad: [['$1/(1 + \\beta r)$', '$\\int r^2|\\psi|^2dr$ diverges, so it cannot be normalised'], ['$e^{-\\beta/r}$', 'it tends to 1 at large $r$ and cannot be normalised'], ['$r^{-2}e^{-\\beta r}$', '$r^2|\\psi|^2 \\sim r^{-2}$ near the origin, so the norm integral diverges there']] },
      ]);
      const c = choose(r, S.bad);
      const o = pickMcq(r, c[0], S.good);
      return { q: `For a variational estimate of the ground-state energy of ${S.name}, which ONE trial function (with $\\beta > 0$) is <b>NOT</b> acceptable?`, ...o,
        sol: `${c[0]} is unacceptable because ${c[1]}. A trial function only needs to be normalisable, obey the boundary conditions and give a finite $\\langle H\\rangle$; it need not satisfy the Schrödinger equation, and a cusp (like $e^{-\\beta|x|}$) is allowed. The other options meet these conditions, so each gives an upper bound on the ground-state energy.`,
        trap: 'Any acceptable trial function gives an upper bound, however poor; "acceptable" is about normalisability and boundary conditions, not accuracy.' };
    } },
  { id: 'qvw-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'variational principle', format: 'statements',
    make(r) {
      const E0 = -round(0.1 * int(r, 30, 150), 1), d = round(0.1 * int(r, 2, 20), 1);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$\\langle H\\rangle$ in any normalisable trial state is at least the ground-state energy', true, 'Expand the trial state in eigenstates: $\\langle H\\rangle = \\sum|c_n|^2E_n \\ge E_0$.'],
        [`If the exact ground energy is $${E0}$ eV, a trial function giving $${round(E0 - d, 1)}$ eV signals an error`, true, `No trial state can go below $E_0 = ${E0}$ eV, and $${round(E0 - d, 1)} < ${E0}$.`],
        [`If the exact ground energy is $${E0}$ eV, a trial function giving $${round(E0 + d, 1)}$ eV is consistent`, true, 'It lies above $E_0$, as the principle requires.'],
        ['A trial function orthogonal to the exact ground state gives an upper bound on the first excited energy', true, 'With $c_0 = 0$, $\\langle H\\rangle = \\sum_{n \\ge 1}|c_n|^2E_n \\ge E_1$.'],
        ['An error of order $\\epsilon$ in the trial function gives an error of order $\\epsilon^2$ in the energy', true, 'The energy is stationary at the true eigenstate, so the first-order change vanishes.'],
        ['The variational method gives a lower bound on the ground-state energy', false, 'It gives an upper bound.'],
        ['A trial function with a lower energy always gives a more accurate $\\langle x^2\\rangle$', false, 'Energy is second-order accurate, other expectation values only first order; a better energy does not guarantee better wavefunction properties.'],
        ['The trial function must satisfy the Schrödinger equation', false, 'Any normalisable function obeying the boundary conditions is allowed.'],
      ], { not });
      return { q: `Which statements about the variational method are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'An energy below the true ground state is impossible: it means an algebra error, not a "better" trial function.' };
    } },
  { id: 'qvw-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'WKB scaling', format: 'match the system',
    make(r) {
      const P = [
        ['$V = F|x|$', '2/3', '\\tfrac23'], ['$V = \\tfrac12m\\omega^2x^2$', '1', '1'], ['$V = \\lambda x^4$', '4/3', '\\tfrac43'], ['$V = \\lambda x^6$', '3/2', '\\tfrac32'], ['an infinite square well', '2', '2'],
      ];
      const i = int(r, 0, P.length - 1), rev = r() < 0.5;
      const nu = [1, 2, 4, 6, Infinity][i];
      const sol = 'For $V \\propto |x|^\\nu$, the WKB condition $\\oint p\\,dx = (n + \\tfrac12)h$ with turning points at $x_t \\propto E^{1/\\nu}$ gives $\\oint p\\,dx \\propto E^{1/2}x_t \\propto E^{1/2 + 1/\\nu}$, so $E_n \\propto (n + \\tfrac12)^{2\\nu/(\\nu + 2)}$. ' + `For ${P[i][0]} ($\\nu = ${nu === Infinity ? '\\infty' : nu}$) the exponent is $${P[i][2]}$.`;
      if (rev) {
        const o = pickMcq(r, P[i][0], P.filter((_, j) => j !== i).map((p) => p[0]));
        return { q: `In which potential do the energy levels grow as $E_n \\propto n^{${P[i][2]}}$ for large $n$?`, ...o, sol, trap: 'Steeper walls push the exponent towards 2 (the box); softer walls bring it below 1.' };
      }
      const o = pickMcq(r, `$${P[i][2]}$`, P.filter((_, j) => j !== i).map((p) => `$${p[2]}$`).concat(['$\\tfrac12$']));
      return { q: `For large $n$, the energy levels in ${P[i][0]} grow as $E_n \\propto n^p$. What is $p$?`, ...o, sol, trap: 'Only the oscillator has evenly spaced levels ($p = 1$).' };
    } },
  { id: 'qvw-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'tunnelling sensitivity', format: 'scaling',
    make(r) {
      const k = int(r, 2, 8);
      const C = choose(r, [
        ['the barrier width is doubled', 2, 'width enters $2\\kappa L$ linearly'],
        ['the barrier width is tripled', 3, 'width enters linearly'],
        ['$V_0 - E$ is made 4 times larger', 2, '$\\kappa \\propto \\sqrt{V_0 - E}$, so $\\kappa$ doubles'],
        ['$V_0 - E$ is made 9 times larger', 3, '$\\kappa \\propto \\sqrt{V_0 - E}$, so $\\kappa$ triples'],
        ['the particle mass is made 4 times larger', 2, '$\\kappa \\propto \\sqrt m$, so $\\kappa$ doubles'],
        ['$V_0 - E$ is made 4 times smaller', 0.5, '$\\kappa \\propto \\sqrt{V_0 - E}$, so $\\kappa$ halves'],
      ]);
      const e = (s) => `$10^{-${round(k * s, 1)}}$`;
      const lin = C[1] === 2 && C[0].includes('4 times larger') ? 4 : C[1] === 3 && C[0].includes('9') ? 9 : C[1] === 0.5 ? 0.25 : C[1] * C[1];
      const o = pickMcq(r, e(C[1]), [e(lin), `$10^{-${k}}$`, e(C[1] * C[1] === lin ? C[1] * C[1] * C[1] : C[1] * C[1]), e(C[1] + 1), e(1 / C[1])]);
      return { q: `In the WKB limit an electron tunnels through a barrier with $T \\approx e^{-2\\kappa L} = 10^{-${k}}$. If ${C[0]}, keeping everything else fixed, $T$ becomes about`, ...o,
        sol: `$\\log_{10}T = -2\\kappa L/\\ln10$ is proportional to $\\kappa L$. Here ${C[2]}, so the exponent is multiplied by ${C[1]}: $T \\approx (10^{-${k}})^{${C[1]}} = ${e(C[1]).slice(1, -1)}$. (The prefactor is ignored in the WKB estimate.)`,
        trap: 'The barrier height and the mass act through a square root; only the width enters linearly.' };
    } },
  { id: 'qvw-m35', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'exactness of WKB', format: 'statements',
    make(r) {
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['the harmonic oscillator', true, 'With the $\\tfrac12$ from two soft turning points, WKB gives exactly $(n + \\tfrac12)\\hbar\\omega$.'],
        ['the infinite square well (with hard-wall boundary conditions)', true, 'With two hard walls $\\int p\\,dx = (n + 1)\\pi\\hbar$ reproduces $n^2\\pi^2\\hbar^2/2mL^2$ exactly.'],
        ['the Morse potential', true, 'The Morse levels $\\hbar\\omega(n + \\tfrac12) - [\\hbar\\omega(n + \\tfrac12)]^2/4D$ come out exactly from the WKB integral.'],
        ['the quartic oscillator $V = \\lambda x^4$', false, 'WKB is only approximate (good for large $n$, off by a few percent for the ground state).'],
        ['the linear potential $V = F|x|$', false, 'The exact levels come from zeros of the Airy function and its derivative; WKB is close but not exact.'],
        ['a finite square well', false, 'The sharp steps violate the WKB validity condition, and the result is not exact.'],
      ], { not });
      return { q: `For which of these systems does the WKB quantisation condition (with the correct turning-point phases) give energies that are ${not ? '<b>NOT</b> exact' : 'exact'}?`, ...m,
        sol: m.sol.replace('statements that are true', 'systems where WKB is exact (marked true)').replace('statements that are false', 'systems where WKB is only approximate (marked false)'),
        trap: 'WKB being exact for the oscillator is a coincidence of the quadratic potential, not a general rule.' };
    } },
];
