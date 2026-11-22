// Extra question shapes for postulates-operators (templates qpo-m31..m35). Imported by postulates-operators.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

const ket = (n) => `|${n}\\rangle`;
const cf = (c) => (c === 1 ? '' : c);

export default [
  { id: 'qpo-m31', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Hermitian and unitary matrices', format: 'statements',
    make(r) {
      const M = choose(r, [
        { t: '\\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}', dag: 'the same matrix', H: 1, U: 1, P: 0, R: 1, N: 1, sq: '$M^2 = I$', dm: '$M^\\dagger M = I$', ev: '$\\pm1$' },
        { t: '\\begin{pmatrix}1 & 0\\\\ 0 & 0\\end{pmatrix}', dag: 'the same matrix', H: 1, U: 0, P: 1, R: 1, N: 1, sq: '$M^2 = M$', dm: '$M^\\dagger M = M \\ne I$', ev: '$1$ and $0$' },
        { t: '\\begin{pmatrix}0 & -i\\\\ i & 0\\end{pmatrix}', dag: 'the same matrix', H: 1, U: 1, P: 0, R: 1, N: 1, sq: '$M^2 = I \\ne M$', dm: '$M^\\dagger M = I$', ev: '$\\pm1$' },
        { t: '\\begin{pmatrix}0 & 1\\\\ 0 & 0\\end{pmatrix}', dag: '$\\begin{pmatrix}0 & 0\\\\ 1 & 0\\end{pmatrix} \\ne M$', H: 0, U: 0, P: 0, R: 1, N: 0, sq: '$M^2 = 0 \\ne M$', dm: '$M^\\dagger M = \\begin{pmatrix}0 & 0\\\\ 0 & 1\\end{pmatrix} \\ne I$, while $MM^\\dagger = \\begin{pmatrix}1 & 0\\\\ 0 & 0\\end{pmatrix}$', ev: '$0$ (twice)' },
        { t: '\\tfrac12\\begin{pmatrix}1 & 1\\\\ 1 & 1\\end{pmatrix}', dag: 'the same matrix', H: 1, U: 0, P: 1, R: 1, N: 1, sq: '$M^2 = M$', dm: '$M^\\dagger M = M \\ne I$', ev: '$1$ and $0$' },
        { t: '\\begin{pmatrix}0 & 1\\\\ -1 & 0\\end{pmatrix}', dag: '$\\begin{pmatrix}0 & -1\\\\ 1 & 0\\end{pmatrix} = -M$', H: 0, U: 1, P: 0, R: 0, N: 1, sq: '$M^2 = -I \\ne M$', dm: '$M^\\dagger M = I$', ev: '$\\pm i$' },
        { t: '\\begin{pmatrix}1 & 0\\\\ 0 & i\\end{pmatrix}', dag: '$\\begin{pmatrix}1 & 0\\\\ 0 & -i\\end{pmatrix} \\ne M$', H: 0, U: 1, P: 0, R: 0, N: 1, sq: '$M^2 = \\begin{pmatrix}1 & 0\\\\ 0 & -1\\end{pmatrix} \\ne M$', dm: '$M^\\dagger M = I$', ev: '$1$ and $i$' },
      ]);
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['$M$ is Hermitian, so it can represent an observable', !!M.H, `$M^\\dagger$ is ${M.dag}.`],
        ['$M$ is unitary', !!M.U, `${M.dm}.`],
        ['$M$ is a projection operator ($M^2 = M$)', !!M.P, `${M.sq}.`],
        ['All eigenvalues of $M$ are real', !!M.R, `The eigenvalues are ${M.ev}.`],
        ['$M$ is normal ($MM^\\dagger = M^\\dagger M$), so it has an orthonormal eigenbasis', !!M.N, M.N ? 'Hermitian, unitary and diagonal matrices are all normal.' : `${M.dm}: the two products differ.`],
      ], { not });
      return { q: `Consider the matrix $M = ${M.t}$. Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Real eigenvalues do not make a matrix Hermitian: the nilpotent matrix with a single 1 above the diagonal has eigenvalues 0 and 0 but is not even normal.' };
    } },
  { id: 'qpo-m32', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'measurement postulate',
    make(r) {
      const c = [int(r, 1, 3), int(r, 1, 3), int(r, 1, 3)], S = c[0] ** 2 + c[1] ** 2 + c[2] ** 2;
      const sq = (n) => `\\sqrt{${n}}`;
      const st = `\\frac{1}{${sq(S)}}\\left(${c[0] === 1 ? '' : c[0]}${ket(1)} + ${c[1] === 1 ? '' : c[1]}${ket(2)} + ${c[2] === 1 ? '' : c[2]}${ket(3)}\\right)`;
      const mode = int(r, 0, 2);
      if (mode === 2) {
        const S12 = c[0] ** 2 + c[1] ** 2, sup = `${c[0] === 1 ? '' : c[0]}${ket(1)} + ${c[1] === 1 ? '' : c[1]}${ket(2)}`;
        const o = pickMcq(r, `$\\dfrac{1}{${sq(S12)}}\\left(${sup}\\right)$`, [`$${ket(1)}$`, `$${st}$`, `$\\dfrac{1}{${sq(S)}}\\left(${sup}\\right)$`, `$${ket(3)}$`]);
        return { q: `An observable $A$ has $A${ket(1)} = a${ket(1)}$, $A${ket(2)} = a${ket(2)}$ (a degenerate eigenvalue) and $A${ket(3)} = b${ket(3)}$ with $b \\ne a$, where the kets are orthonormal. The system is in $|\\psi\\rangle = ${st}$. $A$ is measured and gives $a$. Immediately afterwards the state is`, ...o,
          sol: `For a degenerate eigenvalue the state is projected onto the whole eigenspace and renormalised: $P_a|\\psi\\rangle \\propto ${sup}$, whose norm squared is $${c[0]}^2 + ${c[1]}^2 = ${S12}$. So the new state is $\\frac{1}{${sq(S12)}}(${sup})$. The measurement does not pick one basis ket inside the eigenspace.`,
          trap: 'Collapsing onto a single basis ket of a degenerate eigenspace, or forgetting to renormalise after the projection.' };
      }
      const k = int(r, 1, 3), ck = c[k - 1];
      if (mode === 0) {
        const others = [1, 2, 3].filter((j) => j !== k);
        const So = others.reduce((s, j) => s + c[j - 1] ** 2, 0);
        const o = pickMcq(r, `$${ket(k)}$`, [`$${st}$`, `$\\dfrac{${ck}}{${sq(S)}}${ket(k)}$`, `$\\dfrac{1}{${sq(So)}}\\left(${cf(c[others[0] - 1])}${ket(others[0])} + ${cf(c[others[1] - 1])}${ket(others[1])}\\right)$`]);
        return { q: `An observable $A$ has non-degenerate eigenvalues $a_1, a_2, a_3$ with orthonormal eigenkets $${ket(1)}, ${ket(2)}, ${ket(3)}$. The system is in $|\\psi\\rangle = ${st}$. A measurement of $A$ gives $a_${k}$. Immediately afterwards the state is`, ...o,
          sol: `After a measurement with a non-degenerate result the state collapses onto the eigenket of that result: $|\\psi\\rangle \\to ${ket(k)}$ (normalised, any overall phase is irrelevant). The coefficient $${ck}/${sq(S)}$ only fixed the probability $${ck * ck}/${S}$ of getting $a_${k}$.`,
          trap: 'Keeping the old amplitude in front of the ket: the post-measurement state must be normalised.' };
      }
      const p = `\\tfrac{${ck * ck}}{${S}}`;
      const o = pickMcq(r, '$1$', [`$${p}$`, `$\\left(${p}\\right)^2$`, '$0$', `$1 - ${p}$`]);
      return { q: `A system is in $|\\psi\\rangle = ${st}$, where $${ket(1)}, ${ket(2)}, ${ket(3)}$ are non-degenerate eigenkets of an observable $A$ with eigenvalues $a_1, a_2, a_3$. $A$ is measured and gives $a_${k}$; it is measured again immediately. The probability that the second measurement also gives $a_${k}$ is`, ...o,
        sol: `The first result has probability $${p}$, but after it the state is $${ket(k)}$. A second immediate measurement on $${ket(k)}$ gives $a_${k}$ with probability $|\\langle ${k}|${k}\\rangle|^2 = 1$. This repeatability is what the collapse postulate guarantees.`,
        trap: 'Using the original probability again: the state has already changed.' };
    } },
  { id: 'qpo-m33', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Hermitian operators', format: 'which is NOT',
    make(r) {
      const H = [
        ['$\\hat x^2$', 'A real function of a Hermitian operator is Hermitian.'],
        ['$-i\\hbar\\,\\dfrac{d}{dx}$', 'Integration by parts flips the sign of $d/dx$ and complex conjugation flips the sign of $i$: the two signs cancel.'],
        ['$\\dfrac{d^2}{dx^2}$', 'Two integrations by parts give two minus signs, so $(d^2/dx^2)^\\dagger = d^2/dx^2$.'],
        ['$\\hat x\\hat p + \\hat p\\hat x$', '$(\\hat x\\hat p)^\\dagger = \\hat p\\hat x$, so the sum is its own adjoint.'],
        ['$i\\,\\dfrac{d}{dx}$', '$(d/dx)^\\dagger = -d/dx$ and $i^* = -i$, so $(i\\,d/dx)^\\dagger = (-i)(-d/dx) = i\\,d/dx$.'],
        ['$\\dfrac{\\hat p^2}{2m} + V(\\hat x)$ with real $V$', 'A sum of Hermitian operators is Hermitian.'],
      ];
      const anti = [
        ['$\\dfrac{d}{dx}$', 'Integration by parts gives $(d/dx)^\\dagger = -d/dx$: it is anti-Hermitian.'],
        ['$i\\hat x$', '$(i\\hat x)^\\dagger = -i\\hat x$: anti-Hermitian.'],
        ['$\\hat x\\hat p - \\hat p\\hat x$', 'It equals $i\\hbar$ times the identity, and $(i\\hbar)^* = -i\\hbar$: anti-Hermitian.'],
        ['$\\dfrac{d^3}{dx^3}$', 'Three integrations by parts give $(-1)^3$: anti-Hermitian.'],
      ];
      const neither = [
        ['$\\hat x\\hat p$', '$(\\hat x\\hat p)^\\dagger = \\hat p\\hat x = \\hat x\\hat p - i\\hbar$, which is neither $\\hat x\\hat p$ nor $-\\hat x\\hat p$.'],
        ['$x\\,\\dfrac{d}{dx}$', '$(x\\,d/dx)^\\dagger = -\\frac{d}{dx}x = -x\\frac{d}{dx} - 1$: neither Hermitian nor anti-Hermitian.'],
        ['$\\hat a = \\sqrt{\\tfrac{m\\omega}{2\\hbar}}\\left(\\hat x + \\tfrac{i\\hat p}{m\\omega}\\right)$', 'Its adjoint is the raising operator $\\hat a^\\dagger \\ne \\pm\\hat a$.'],
      ];
      const antiMode = r() < 0.4;
      const c = antiMode ? choose(r, anti) : choose(r, [...anti, ...neither]);
      const ws = choose(r, [[0, 1, 2], [3, 4, 5], [0, 3, 5], [1, 2, 4], [2, 4, 5]]).map((i) => H[i]);
      const o = pickMcq(r, c[0], ws.map((w) => w[0]));
      return { q: `Acting on smooth functions that vanish at $x = \\pm\\infty$, which ONE of these operators is ${antiMode ? '<b>anti-Hermitian</b> ($A^\\dagger = -A$)' : '<b>NOT</b> Hermitian'}?`, ...o,
        sol: `${c[0]}: ${c[1]}<br>The others are Hermitian:<ul>${ws.map((w) => `<li>${w[0]}: ${w[1]}</li>`).join('')}</ul>`,
        trap: 'Forgetting that $d/dx$ alone changes sign under the adjoint, or that $(AB)^\\dagger = B^\\dagger A^\\dagger$ reverses the order.' };
    } },
  { id: 'qpo-m34', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'time evolution', format: 'statements',
    make(r) {
      const E1 = round(0.1 * int(r, 1, 10), 1), dE = round(0.1 * int(r, 2, 15), 1), E2 = round(E1 + dE, 1);
      const T = 4.135667 / dE;
      const right = r() < 0.5;
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$\\langle H\\rangle$ is independent of time', true, 'The weights $|c_n|^2$ never change, so $\\langle H\\rangle = |c_1|^2E_1 + |c_2|^2E_2$ is constant.'],
        ['The probability of finding energy $E_1$ is independent of time', true, '$c_n(t) = c_ne^{-iE_nt/\\hbar}$, so $|c_n(t)|^2$ is constant.'],
        ['The norm $\\langle\\psi|\\psi\\rangle$ is independent of time', true, 'Evolution by $e^{-iHt/\\hbar}$ is unitary.'],
        ['$\\langle x\\rangle$ is independent of time', false, 'The cross term $2\\,\\mathrm{Re}[c_1^*c_2\\langle1|x|2\\rangle e^{-i(E_2 - E_1)t/\\hbar}]$ oscillates when $\\langle1|x|2\\rangle \\ne 0$.'],
        ['$|\\psi(x, t)|^2$ is independent of time', false, 'The interference term between $\\psi_1$ and $\\psi_2$ oscillates at the Bohr frequency $(E_2 - E_1)/\\hbar$.'],
        [`$|\\psi(x, t)|^2$ repeats with period $${round(right ? T : 2 * T, 2)}$ fs`, right, `The period is $h/(E_2 - E_1) = (4.1357\\text{ eV fs})/(${dE}\\text{ eV}) = ${round(T, 2)}$ fs.`],
      ], { not });
      return { q: `A particle in one dimension is in $\\psi = c_1\\psi_1 + c_2\\psi_2$, where $\\psi_1, \\psi_2$ are stationary states with $E_1 = ${E1}$ eV and $E_2 = ${E2}$ eV, both $c$'s are non-zero and $\\langle\\psi_1|x|\\psi_2\\rangle \\ne 0$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'A superposition of stationary states is not stationary: only the energy probabilities stay fixed.' };
    } },
  { id: 'qpo-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'spectra of operators',
    make(r) {
      const cats = {
        disc: ['the Hamiltonian of a harmonic oscillator', '$\\hat L_z$ of a particle in three dimensions', '$S_z$ of a spin-$\\tfrac12$ particle', 'the Hamiltonian of a particle in an infinite square well'],
        cont: ['the position operator $\\hat x$ on the whole line', 'the momentum operator $\\hat p$ on the whole line', 'the Hamiltonian of a free particle on the whole line'],
        both: ['the Hamiltonian of the hydrogen atom', 'the Hamiltonian of a finite square well', 'the Hamiltonian of an attractive delta well $-\\alpha\\delta(x)$'],
      };
      const label = { disc: 'a purely discrete spectrum', cont: 'a purely continuous spectrum', both: 'both a discrete part and a continuous part' };
      const why = { disc: 'its eigenvalues are isolated points with normalisable eigenvectors and nothing in between', cont: 'its generalised eigenfunctions (plane waves or delta functions) cannot be normalised, and every real value (or every value above the band bottom) is allowed', both: 'it has normalisable bound states at isolated negative energies and unbound scattering states filling all positive energies' };
      const key = choose(r, ['disc', 'cont', 'both']);
      const c = choose(r, cats[key]);
      const others = Object.keys(cats).filter((k) => k !== key);
      const ws = [...cats[others[0]], ...cats[others[1]]];
      const o = pickMcq(r, c, ws);
      return { q: `Which ONE of these operators has ${label[key]}?`, ...o,
        sol: `The answer is ${c}: ${why[key]}. The other options: ${o.options.filter((x) => x !== c).map((x) => `${x} has ${label[Object.keys(cats).find((k) => cats[k].includes(x))]}`).join('; ')}.`,
        trap: 'Hydrogen is easy to file as "discrete" because of its famous levels, but the ionised states form a continuum above $E = 0$.' };
    } },
];
