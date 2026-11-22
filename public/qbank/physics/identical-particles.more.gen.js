// Extra question shapes for identical-particles (templates qip-m31..m35). Imported by identical-particles.js.
import { int, choose } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'qip-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'bosons and fermions',
    make(r) {
      const L = [
        ['a $^{4}$He atom', 2, 2, 2], ['a $^{3}$He atom', 2, 1, 2], ['a $^{7}$Li atom', 3, 4, 3], ['a $^{6}$Li atom', 3, 3, 3], ['an $^{87}$Rb atom', 37, 50, 37],
        ['a $^{40}$K atom', 19, 21, 19], ['a $^{23}$Na atom', 11, 12, 11], ['a deuteron (nucleus only)', 1, 1, 0], ['a $^{3}$He$^{+}$ ion', 2, 1, 1], ['a $^{4}$He$^{+}$ ion', 2, 2, 1],
        ['a hydrogen atom', 1, 0, 1], ['an H$^{-}$ ion', 1, 0, 2], ['a $^{13}$C nucleus', 6, 7, 0], ['a $^{12}$C atom', 6, 6, 6], ['an alpha particle', 2, 2, 0],
      ];
      const ferm = (x) => (x[1] + x[2] + x[3]) % 2 === 1;
      const askF = r() < 0.5;
      const good = L.filter((x) => ferm(x) === askF), bad = L.filter((x) => ferm(x) !== askF);
      const c = choose(r, good);
      const o = pickMcq(r, c[0], bad.map((x) => x[0]));
      const cnt = (x) => `${x[0]}: ${x[1]} p + ${x[2]} n + ${x[3]} e = ${x[1] + x[2] + x[3]}`;
      return { q: `Which ONE of these composite particles is a <b>${askF ? 'fermion' : 'boson'}</b>?`, ...o,
        sol: `Count the spin-$\\tfrac12$ constituents: an odd number makes a fermion, an even number a boson.<ul>${o.options.map((s) => `<li>${cnt(L.find((x) => x[0] === s))} (${ferm(L.find((x) => x[0] === s)) ? 'odd: fermion' : 'even: boson'})</li>`).join('')}</ul>`,
        trap: 'Remember the electrons in neutral atoms and ions: $^{3}$He is a fermion but the $^{3}$He$^{+}$ ion is a boson.' };
    } },
  { id: 'qip-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'exchange symmetry', format: 'statements',
    make(r) {
      const P = choose(r, [
        ['two electrons in a spin-triplet state', [0, 1, 0, 1, 1], 'The triplet spin state is symmetric, so the spatial part must be antisymmetric.'],
        ['two electrons in the spin-singlet state', [1, 0, 1, 0, 1], 'The singlet spin state is antisymmetric, so the spatial part must be symmetric.'],
        ['two identical spin-0 bosons', [1, 0, 1, 0, 0], 'With no spin, the whole wavefunction is the spatial one and must be symmetric.'],
        ['two identical spin-1 bosons whose spins couple to total $S = 1$', [0, 1, 0, 1, 0], 'For two spin-1 particles the $S = 1$ spin states are antisymmetric, so the spatial part must be antisymmetric for a symmetric total.'],
      ]);
      const [sym, anti, same, zero, totA] = P[1];
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['The spatial wavefunction is symmetric under exchange', !!sym, P[2]],
        ['The spatial wavefunction is antisymmetric under exchange', !!anti, P[2]],
        ['Both particles can occupy the same spatial orbital', !!same, same ? 'A symmetric spatial state $\\phi(x_1)\\phi(x_2)$ is allowed.' : 'An antisymmetric spatial state built from one orbital, $\\phi(x_1)\\phi(x_2) - \\phi(x_2)\\phi(x_1)$, vanishes.'],
        ['The probability of finding both particles at the same point is zero', !!zero, zero ? 'An antisymmetric spatial function vanishes at $x_1 = x_2$.' : 'A symmetric spatial function need not vanish at $x_1 = x_2$; it is even enhanced there.'],
        ['The total wavefunction (space times spin) is antisymmetric', !!totA, totA ? 'Electrons are fermions.' : 'These are bosons: the total wavefunction is symmetric.'],
      ], { not });
      return { q: `Consider ${P[0]}. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Fermions in a symmetric spin state behave spatially like "anti-bosons", and vice versa: always combine the spin and space symmetries.' };
    } },
  { id: 'qip-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'exchange effects', format: 'ranking',
    make(r) {
      const n1 = int(r, 0, 3), d = int(r, 1, 3), n2 = n1 + d;
      const O = { order: 'bosons $<$ distinguishable $<$ fermions', rev: 'fermions $<$ distinguishable $<$ bosons', eq: 'all three are equal', mid: 'distinguishable $<$ bosons $=$ fermions' };
      const key = d === 1 ? 'order' : 'eq';
      const o = pickMcq(r, O[key], Object.keys(O).filter((k) => k !== key).map((k) => O[k]));
      return { q: `Two non-interacting particles in a 1D harmonic oscillator occupy the levels $n = ${n1}$ and $n = ${n2}$ (one each, spin ignored). Rank $\\langle(x_1 - x_2)^2\\rangle$ for distinguishable particles, identical bosons (symmetric spatial state) and identical fermions (antisymmetric spatial state).`, ...o,
        sol: `$\\langle(x_1 - x_2)^2\\rangle = \\langle x^2\\rangle_{${n1}} + \\langle x^2\\rangle_{${n2}} - 2\\langle x\\rangle_{${n1}}\\langle x\\rangle_{${n2}} \\mp 2|\\langle ${n1}|x|${n2}\\rangle|^2$, with $-$ for bosons and $+$ for fermions, and no exchange term for distinguishable particles. ${d === 1 ? `Here the levels differ by one, so $\\langle ${n1}|x|${n2}\\rangle \\ne 0$: bosons sit closer together and fermions further apart.` : `Here the levels differ by ${d}, and $x$ only connects neighbouring levels, so $\\langle ${n1}|x|${n2}\\rangle = 0$: the exchange term vanishes and all three agree.`}`,
        trap: 'The "exchange force" is not universal: it needs a non-zero overlap matrix element $\\langle a|x|b\\rangle$.' };
    } },
  { id: 'qip-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'filling levels', format: 'which is NOT',
    make(r) {
      const N = int(r, 3, 7), top = Math.ceil(N / 2);
      let E = 0; for (let n = 1; n <= N; n++) E += Math.ceil(n / 2) ** 2;
      let Enospin = 0; for (let n = 1; n <= N; n++) Enospin += n * n;
      const T = [
        [`The highest occupied level is $n = ${top}$`, `Two electrons (up and down) per level: ${N} electrons fill up to $n = \\lceil ${N}/2\\rceil = ${top}$.`],
        [`The ground-state energy is $${E}E_1$`, `Sum $n^2$ with each level counted twice (once if half-filled): $${E}E_1$.`],
        [`The total spin of the ground state is $S = ${N % 2 ? '\\tfrac12' : '0'}$`, N % 2 ? 'One electron is unpaired.' : 'All electrons are paired.'],
        [`If they were spinless bosons, the ground-state energy would be $${N}E_1$`, 'All bosons can sit in $n = 1$.'],
      ];
      const F = [
        [`The highest occupied level is $n = ${N}$`, 'This ignores spin: two electrons fit in each level.'],
        [`The ground-state energy is $${Enospin}E_1$`, 'This puts one electron per level, as for spinless fermions.'],
        [`The ground-state energy is $${N}E_1$`, 'Only bosons could all sit in $n = 1$.'],
        [`The total spin of the ground state is $S = ${N / 2 === Math.floor(N / 2) ? N / 2 : `\\tfrac{${N}}{2}`}$`, 'Paired electrons cancel their spins; $S$ is 0 or $\\tfrac12$.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `${N} non-interacting electrons (spin $\\tfrac12$) are in a 1D infinite well with levels $E_n = n^2E_1$. For the ground state, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Each spatial level holds two electrons of opposite spin; spinless fermions would need one level each.' };
    } },
  { id: 'qip-m35', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Slater determinants', format: 'statements',
    make(r) {
      const N = int(r, 2, 5), f = [1, 1, 2, 6, 24, 120][N];
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['It vanishes if two of the occupied spin-orbitals are the same', true, 'Two equal columns make the determinant zero: the Pauli principle.'],
        ['It changes sign when the coordinates of two electrons are swapped', true, 'Swapping two rows of a determinant changes its sign.'],
        [`With orthonormal spin-orbitals its normalisation factor is $1/\\sqrt{${f}}$`, true, `The prefactor is $1/\\sqrt{N!}$ with $N! = ${f}$.`],
        [`With orthonormal spin-orbitals its normalisation factor is $1/${N}$`, false, `The prefactor is $1/\\sqrt{N!} = 1/\\sqrt{${f}}$.`],
        ['It is unchanged if one spin-orbital is replaced by itself plus a multiple of another occupied one', true, 'Adding a multiple of one column to another leaves a determinant unchanged.'],
        ['It is always an eigenstate of the total spin $\\vec S^2$', false, 'A single determinant with open shells is generally a mixture of total spins (e.g. $|{\\uparrow\\downarrow}\\rangle$ for two electrons in different orbitals).'],
        ['It is symmetric under exchange of any two electrons', false, 'It is antisymmetric.'],
      ], { not });
      return { q: `A Slater determinant is built for ${N} electrons from ${N} spin-orbitals. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Antisymmetry is automatic in a determinant, but a definite total spin is not.' };
    } },
];
