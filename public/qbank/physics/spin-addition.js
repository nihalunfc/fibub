// Spin and the addition of angular momenta: Pauli matrices and their algebra, spin-1/2 states along any direction,
// Stern-Gerlach sequences, rotations and the 4π periodicity, spin precession, two spin-1/2 (singlet and triplet,
// S1·S2, exchange), adding j1 and j2 (allowed j, state counting, Clebsch-Gordan coefficients for l ⊗ 1/2),
// L·S, the projection theorem, and three spins.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './spin-addition.more.gen.js';
import more2 from './spin-addition.more2.gen.js';
import r4 from './spin-addition.r4.gen.js';
import r5 from './spin-addition.r5.gen.js';

const half = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const ls = (l, j) => (j * (j + 1) - l * (l + 1) - 0.75) / 2;            // <L·S>/ħ² for s = 1/2
const cgUp = (l, j, m) => (j > l ? (l + m + 0.5) : (l - m + 0.5)) / (2 * l + 1); // P(m_s = +1/2) in |l 1/2 j m>

export default {
  topic: 'spin-addition',
  items: [
    // ---------- level 1 ----------
    { id: 'qsa-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'pauli matrices',
      q: 'The eigenvalues of the Pauli matrix $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$ are',
      options: ['$\\pm1$', '$\\pm i$', '$0$ and $\\pm1$', '$\\pm\\hbar/2$'], answer: 0,
      sol: '$\\det(\\sigma_y - \\lambda) = \\lambda^2 - (-i)(i) = \\lambda^2 - 1 = 0$, so $\\lambda = \\pm1$. Every Pauli matrix is Hermitian with $\\sigma^2 = 1$, so its eigenvalues are real and square to 1. The spin component $S_y = \\tfrac\\hbar2\\sigma_y$ has eigenvalues $\\pm\\hbar/2$.',
      trap: 'The $i$ entries do not make the eigenvalues imaginary: the matrix is Hermitian.' },
    { id: 'qsa-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'addition rules',
      q: 'An orbital angular momentum $l = 1$ is combined with a spin $s = \\tfrac12$. The possible values of the total $j$ are',
      options: ['$\\tfrac12$ only', '$\\tfrac12$ and $\\tfrac32$', '$\\tfrac32$ only', '$0$, $1$ and $2$'], answer: 1,
      sol: '$j$ runs from $|l - s|$ to $l + s$ in whole steps: $\\tfrac12$ and $\\tfrac32$. Check the count: $(2\\cdot1 + 1)(2\\cdot\\tfrac12 + 1) = 6 = 2 + 4$.' },
    { id: 'qsa-003', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'addition rules',
      q: 'Two angular momenta $j_1 = 2$ and $j_2 = 1$ are combined. The total number of states $|j, m\\rangle$ in the coupled basis is ______.',
      answer: 15, tol: 0, calc: () => 5 * 3,
      sol: 'The coupled basis spans the same space as the product basis: $(2j_1 + 1)(2j_2 + 1) = 5\\times3 = 15$. Check: $j = 1, 2, 3$ give $3 + 5 + 7 = 15$.' },
    { id: 'qsa-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'pauli matrices',
      q: 'The product $\\sigma_x\\sigma_y$ of Pauli matrices equals',
      options: ['$\\sigma_z$', '$-i\\sigma_z$', '$i\\sigma_z$', '$1$'], answer: 2,
      sol: '$\\sigma_x\\sigma_y = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix} = \\begin{pmatrix}i&0\\\\0&-i\\end{pmatrix} = i\\sigma_z$. In general $\\sigma_i\\sigma_j = \\delta_{ij} + i\\epsilon_{ijk}\\sigma_k$; reversing the order gives $-i\\sigma_z$.' },
    { id: 'qsa-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'spin basics',
      q: 'The magnitude of the spin angular momentum of an electron is',
      options: ['$\\hbar/2$', '$\\hbar$', '$3\\hbar/4$', '$\\tfrac{\\sqrt3}{2}\\hbar$'], answer: 3,
      sol: '$|\\vec S| = \\sqrt{s(s+1)}\\,\\hbar = \\sqrt{3/4}\\,\\hbar = \\tfrac{\\sqrt3}{2}\\hbar \\approx 0.866\\hbar$. $\\hbar/2$ is only the largest $z$ component; $3\\hbar^2/4$ is $S^2$.',
      trap: 'Answering $\\hbar/2$, the value of $S_z$, not of $|\\vec S|$.' },
    { id: 'qsa-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'pauli matrices',
      q: 'Which properties do all three Pauli matrices share?',
      options: ['They are Hermitian.', 'They are traceless.', 'Their determinant is $+1$.', 'Each squares to the identity.'], answer: [0, 1, 3],
      sol: 'Each Pauli matrix is Hermitian, traceless, with eigenvalues $+1$ and $-1$; so its square is $1$ and its determinant is the product of eigenvalues, $-1$.' },

    // ---------- level 2 ----------
    { id: 'qsa-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two spins',
      q: 'For two spin-$\\tfrac12$ particles in a triplet state, $\\langle\\vec S_1\\cdot\\vec S_2\\rangle = k\\hbar^2$. The value of $k$ is ______ (to two decimal places).',
      answer: 0.25, tol: 0.001, calc: () => (2 - 0.75 - 0.75) / 2,
      sol: '$\\vec S_1\\cdot\\vec S_2 = \\tfrac12(S^2 - S_1^2 - S_2^2) = \\tfrac{\\hbar^2}{2}\\left[S(S+1) - \\tfrac34 - \\tfrac34\\right]$. Triplet $S = 1$: $\\tfrac12(2 - 1.5) = 0.25$. Singlet: $\\tfrac12(0 - 1.5) = -0.75$.' },
    { id: 'qsa-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin states',
      q: 'The spin state $\\tfrac{1}{\\sqrt2}\\left(|{\\uparrow}\\rangle + i|{\\downarrow}\\rangle\\right)$ is an eigenstate of',
      options: ['$S_x$ with eigenvalue $+\\hbar/2$', '$S_y$ with eigenvalue $+\\hbar/2$', '$S_y$ with eigenvalue $-\\hbar/2$', '$S_z$ with eigenvalue $+\\hbar/2$'], answer: 1,
      sol: '$\\sigma_y\\begin{pmatrix}1\\\\i\\end{pmatrix} = \\begin{pmatrix}-i\\cdot i\\\\i\\cdot1\\end{pmatrix} = \\begin{pmatrix}1\\\\i\\end{pmatrix}$: eigenvalue $+1$, so $S_y = +\\hbar/2$. It is the spin pointing along $+y$ ($\\theta = 90^\\circ$, $\\phi = 90^\\circ$).' },
    { id: 'qsa-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin states',
      q: 'A spin-$\\tfrac12$ particle is in the "up" eigenstate of the spin component along a unit vector at $60^\\circ$ to the $z$-axis. The probability that a measurement of $S_z$ gives $+\\hbar/2$ is ______ (to two decimal places).',
      answer: 0.75, tol: 0.002, calc: () => Math.cos(Math.PI / 6) ** 2,
      sol: 'The state is $\\cos\\tfrac\\theta2|{\\uparrow}\\rangle + e^{i\\phi}\\sin\\tfrac\\theta2|{\\downarrow}\\rangle$, so $P = \\cos^2 30^\\circ = 0.75$. Check: $\\langle S_z\\rangle = \\tfrac\\hbar2(0.75 - 0.25) = \\tfrac\\hbar2\\cos60^\\circ$, the classical projection.',
      trap: 'Using $\\cos^2\\theta = 0.25$: spin-$\\tfrac12$ states use half angles.' },
    { id: 'qsa-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'two spins',
      q: 'For two spin-$\\tfrac12$ particles, the state $\\tfrac{1}{\\sqrt2}\\left(|{\\uparrow\\downarrow}\\rangle + |{\\downarrow\\uparrow}\\rangle\\right)$ has',
      options: ['$S = 0$, $M = 0$', '$S = 1$, $M = 1$', '$S = 1$, $M = 0$', 'no definite $S$ (it is not an eigenstate of $S^2$)'], answer: 2,
      sol: 'Apply $S_- = S_{1-} + S_{2-}$ to $|{\\uparrow\\uparrow}\\rangle = |1, 1\\rangle$: $\\sqrt2\\hbar|1,0\\rangle = \\hbar(|{\\downarrow\\uparrow}\\rangle + |{\\uparrow\\downarrow}\\rangle)$. So the symmetric combination is $|1, 0\\rangle$; the antisymmetric one is the singlet $|0,0\\rangle$.',
      trap: '$M = 0$ does not mean $S = 0$.' },
    { id: 'qsa-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'For an electron with $l = 1$ in the $j = \\tfrac12$ state, the eigenvalue of $\\vec L\\cdot\\vec S$ is',
      options: ['$\\hbar^2/2$', '$-\\hbar^2/2$', '$-3\\hbar^2/2$', '$-\\hbar^2$'], answer: 3,
      sol: '$\\vec L\\cdot\\vec S = \\tfrac12(J^2 - L^2 - S^2) = \\tfrac{\\hbar^2}{2}\\left[\\tfrac34 - 2 - \\tfrac34\\right] = -\\hbar^2$. For $j = \\tfrac32$: $\\tfrac{\\hbar^2}{2}\\left[\\tfrac{15}{4} - 2 - \\tfrac34\\right] = \\tfrac{\\hbar^2}{2}$.' },
    { id: 'qsa-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'A spin-$\\tfrac12$ particle is in $\\tfrac15\\left(3|{\\uparrow}\\rangle + 4|{\\downarrow}\\rangle\\right)$. $\\langle S_x\\rangle = k\\hbar$ with $k =$ ______ (to two decimal places).',
      answer: 0.48, tol: 0.003, calc: () => (2 * 3 * 4 / 25) / 2,
      sol: 'For $a|{\\uparrow}\\rangle + b|{\\downarrow}\\rangle$, $\\langle\\sigma_x\\rangle = a^*b + b^*a = 2\\,\\mathrm{Re}(a^*b) = 2\\cdot\\tfrac{12}{25} = 0.96$. So $\\langle S_x\\rangle = 0.48\\hbar$. (Also $\\langle S_z\\rangle = \\tfrac\\hbar2(\\tfrac{9 - 16}{25}) = -0.14\\hbar$ and $\\langle S_y\\rangle = 0$.)' },
    { id: 'qsa-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'two spins',
      q: 'For two spin-$\\tfrac12$ particles, which statements are correct?',
      options: ['The three triplet states are symmetric under exchange of the spins.', 'In the singlet, $\\vec S_1\\cdot\\vec S_2 = -\\tfrac34\\hbar^2$.', 'There are four states in all.', '$|{\\uparrow\\downarrow}\\rangle$ is an eigenstate of $S^2$.'], answer: [0, 1, 2],
      sol: '$\\tfrac12\\otimes\\tfrac12 = 1\\oplus0$: three symmetric triplet states and one antisymmetric singlet. $|{\\uparrow\\downarrow}\\rangle = \\tfrac{1}{\\sqrt2}(|1,0\\rangle + |0,0\\rangle)$ is a mixture of $S = 1$ and $S = 0$, so it is not an eigenstate of $S^2$ (it is an eigenstate of $S_z$, with $M = 0$).' },
    { id: 'qsa-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rotations',
      q: 'A spin-$\\tfrac12$ state is rotated by $2\\pi$ about any axis. The state is multiplied by',
      options: ['$-1$', '$+1$', '$i$', '$e^{i\\pi/4}$'], answer: 0,
      sol: '$U = e^{-i\\alpha\\,\\hat n\\cdot\\vec\\sigma/2} = \\cos\\tfrac\\alpha2 - i\\,\\hat n\\cdot\\vec\\sigma\\sin\\tfrac\\alpha2$. At $\\alpha = 2\\pi$: $U = -1$. Only a $4\\pi$ rotation brings a spinor back to itself. The sign shows up in neutron interferometry, where one beam is rotated relative to the other.' },
    { id: 'qsa-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'addition rules',
      q: 'An electron with $l = 2$ couples its spin to give $j = \\tfrac52$. The number of states in this $j$ multiplet is ______.',
      answer: 6, tol: 0, calc: () => 2 * 2.5 + 1,
      sol: '$2j + 1 = 6$. The other multiplet, $j = \\tfrac32$, has 4 states; $6 + 4 = 10 = 5\\times2$.' },
    { id: 'qsa-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'pauli matrices',
      q: 'For a real unit vector $\\hat n$, the matrix $(\\vec\\sigma\\cdot\\hat n)^2$ equals',
      options: ['$0$', 'the identity', '$\\vec\\sigma\\cdot\\hat n$', '$3$ times the identity'], answer: 1,
      sol: '$(\\vec\\sigma\\cdot\\vec a)(\\vec\\sigma\\cdot\\vec b) = \\vec a\\cdot\\vec b + i\\vec\\sigma\\cdot(\\vec a\\times\\vec b)$. With $\\vec a = \\vec b = \\hat n$ the cross product vanishes: $(\\vec\\sigma\\cdot\\hat n)^2 = \\hat n\\cdot\\hat n = 1$. So $\\vec\\sigma\\cdot\\hat n$ has eigenvalues $\\pm1$ for every direction.',
      trap: '$\\vec\\sigma\\cdot\\vec\\sigma = \\sigma_x^2 + \\sigma_y^2 + \\sigma_z^2 = 3$ is a different object.' },

    // ---------- level 3 ----------
    { id: 'qsa-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'clebsch-gordan',
      q: 'An electron is in the state $|j = \\tfrac32, m = \\tfrac12\\rangle$ built from $l = 1$ and $s = \\tfrac12$. The probability that a measurement of $S_z$ gives $+\\hbar/2$ is ______ (to three decimal places).',
      answer: 0.667, tol: 0.003, calc: () => cgUp(1, 1.5, 0.5),
      sol: 'Lower the stretched state $|\\tfrac32, \\tfrac32\\rangle = |1, 1\\rangle|{\\uparrow}\\rangle$ with $J_- = L_- + S_-$: $\\sqrt3\\hbar|\\tfrac32, \\tfrac12\\rangle = \\sqrt2\\hbar|1, 0\\rangle|{\\uparrow}\\rangle + \\hbar|1, 1\\rangle|{\\downarrow}\\rangle$. So $|\\tfrac32,\\tfrac12\\rangle = \\sqrt{\\tfrac23}|1,0\\rangle|{\\uparrow}\\rangle + \\sqrt{\\tfrac13}|1,1\\rangle|{\\downarrow}\\rangle$ and $P(\\uparrow) = \\tfrac23$.' },
    { id: 'qsa-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stern-gerlach',
      q: 'Spin-$\\tfrac12$ atoms leave a Stern-Gerlach filter that passes only $S_z = +\\hbar/2$. They then pass a filter along a direction at $60^\\circ$ to $z$ (in the $xz$-plane) that keeps only "up" along that direction, and finally a $z$ filter that keeps only $S_z = -\\hbar/2$. The fraction of atoms entering the second filter that come out of the third is ______ (to four decimal places).',
      answer: 0.1875, tol: 0.002, calc: () => Math.cos(Math.PI / 6) ** 2 * Math.sin(Math.PI / 6) ** 2,
      sol: 'Up along $z$ to up along $\\hat n$ ($\\theta = 60^\\circ$): $\\cos^2 30^\\circ = 0.75$. Then up along $\\hat n$ to down along $z$: $|\\langle\\downarrow|+\\hat n\\rangle|^2 = \\sin^2 30^\\circ = 0.25$. Product $0.1875$. Without the middle filter none would pass: the middle measurement creates the $S_z = -\\hbar/2$ amplitude.',
      trap: 'Thinking the last filter must block everything because the atoms "are" spin up along $z$.' },
    { id: 'qsa-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two spins',
      q: 'Two spin-$\\tfrac12$ particles interact through $H = A\\,\\vec S_1\\cdot\\vec S_2$ with $A > 0$. The energy gap between the triplet and the singlet is',
      options: ['$A\\hbar^2/4$', '$3A\\hbar^2/4$', '$A\\hbar^2$', '$2A\\hbar^2$'], answer: 2,
      sol: 'Triplet: $A\\hbar^2/4$; singlet: $-3A\\hbar^2/4$. The gap is $A\\hbar^2$, with the singlet lower for $A > 0$. This is the form of the hydrogen hyperfine interaction behind the 21 cm line.' },
    { id: 'qsa-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'three spins',
      q: 'Three spin-$\\tfrac12$ particles are combined. The number of linearly independent states with total spin $S = \\tfrac12$ is ______.',
      answer: 4, tol: 0, calc: () => 8 - 4,
      sol: '$\\tfrac12\\otimes\\tfrac12 = 1\\oplus0$; adding the third: $1\\otimes\\tfrac12 = \\tfrac32\\oplus\\tfrac12$ and $0\\otimes\\tfrac12 = \\tfrac12$. So $\\tfrac32\\oplus\\tfrac12\\oplus\\tfrac12$: two doublets, $2 + 2 = 4$ states with $S = \\tfrac12$, plus 4 with $S = \\tfrac32$. Total $8 = 2^3$.',
      trap: 'Counting only one doublet (2 states).' },
    { id: 'qsa-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'precession',
      q: 'An electron (take $g = 2$) sits in a uniform field $B\\hat z$ with its spin initially along $+x$. $\\langle\\vec S\\rangle$ precesses about $z$ with angular frequency',
      options: ['$eB/2m$', '$2eB/m$', '$eB/4m$', '$eB/m$'], answer: 3,
      sol: '$H = -\\vec\\mu\\cdot\\vec B = \\tfrac{ge}{2m}BS_z = \\tfrac{eB}{m}S_z$. The two $S_z$ levels are split by $\\hbar eB/m$, so the relative phase turns at $\\omega = eB/m$, and $\\langle S_x\\rangle = \\tfrac\\hbar2\\cos\\omega t$. That is twice the orbital Larmor frequency $eB/2m$, because $g = 2$.',
      trap: '$eB/2m$ is the orbital Larmor frequency ($g = 1$).' },
    { id: 'qsa-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotations',
      q: 'A spin-$\\tfrac12$ particle in the $S_x = +\\hbar/2$ state is acted on by $U = e^{-i\\pi S_z/2\\hbar}$ (a rotation by $90^\\circ$ about $z$). The probability that a measurement of $S_y$ then gives $+\\hbar/2$ is ______.',
      answer: 1, tol: 0, calc: () => 1,
      sol: '$U\\tfrac{1}{\\sqrt2}(|{\\uparrow}\\rangle + |{\\downarrow}\\rangle) = \\tfrac{1}{\\sqrt2}(e^{-i\\pi/4}|{\\uparrow}\\rangle + e^{i\\pi/4}|{\\downarrow}\\rangle) = e^{-i\\pi/4}\\tfrac{1}{\\sqrt2}(|{\\uparrow}\\rangle + i|{\\downarrow}\\rangle)$, which is the $S_y = +\\hbar/2$ state up to a phase. Rotating $+x$ by $90^\\circ$ about $z$ gives $+y$, as for a classical vector.' },
    { id: 'qsa-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'exchange symmetry',
      q: 'Two spin-1 particles are combined into states of total spin $S$. Which statements are correct?',
      options: ['The $S = 2$ states are symmetric under exchange.', 'The $S = 1$ states are symmetric under exchange.', 'The $S = 0$ state is symmetric under exchange.', 'There are 9 states in all.'], answer: [0, 2, 3],
      sol: 'For two equal spins $j$, the coupled state $|S, M\\rangle$ picks up $(-1)^{2j - S}$ under exchange. With $j = 1$: $S = 2$ and $S = 0$ are symmetric ($5 + 1 = 6$ states), $S = 1$ is antisymmetric (3 states). Total $9$. Check: there are $\\tfrac12\\cdot3\\cdot4 = 6$ symmetric and $3$ antisymmetric product combinations.' },
    { id: 'qsa-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'exchange symmetry',
      q: 'For two spin-$\\tfrac12$ particles, the operator that exchanges their spin states, $P|a\\rangle_1|b\\rangle_2 = |b\\rangle_1|a\\rangle_2$, can be written as',
      options: ['$\\tfrac12(1 + \\vec\\sigma_1\\cdot\\vec\\sigma_2)$', '$\\tfrac12(1 - \\vec\\sigma_1\\cdot\\vec\\sigma_2)$', '$\\vec\\sigma_1\\cdot\\vec\\sigma_2$', '$\\tfrac14(3 + \\vec\\sigma_1\\cdot\\vec\\sigma_2)$'], answer: 0,
      sol: '$\\vec\\sigma_1\\cdot\\vec\\sigma_2 = 4\\vec S_1\\cdot\\vec S_2/\\hbar^2$ is $+1$ on the triplet and $-3$ on the singlet. $\\tfrac12(1 + \\vec\\sigma_1\\cdot\\vec\\sigma_2)$ gives $+1$ on the (symmetric) triplet and $-1$ on the (antisymmetric) singlet, exactly what $P$ does. $\\tfrac14(3 + \\vec\\sigma_1\\cdot\\vec\\sigma_2)$ is the projector onto the triplet (1 and 0).' },
    { id: 'qsa-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'clebsch-gordan',
      q: 'For the state $|j = \\tfrac32, m = \\tfrac12\\rangle$ built from $l = 1$ and $s = \\tfrac12$, $\\langle L_z\\rangle = k\\hbar$. The value of $k$ is ______ (to three decimal places).',
      answer: 0.333, tol: 0.003, calc: () => 1 / 3,
      sol: 'The state is $\\sqrt{\\tfrac23}|m_l = 0\\rangle|{\\uparrow}\\rangle + \\sqrt{\\tfrac13}|m_l = 1\\rangle|{\\downarrow}\\rangle$. $\\langle L_z\\rangle = \\tfrac23\\cdot0 + \\tfrac13\\cdot1 = \\tfrac13\\hbar$, and $\\langle S_z\\rangle = \\tfrac23\\cdot\\tfrac12 - \\tfrac13\\cdot\\tfrac12 = \\tfrac16\\hbar$. Sum $\\tfrac12\\hbar = m\\hbar$, as it must be.' },
    { id: 'qsa-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two spins',
      q: 'The eigenvalues of the $4\\times4$ operator $\\vec\\sigma_1\\cdot\\vec\\sigma_2$ for two spin-$\\tfrac12$ particles are',
      options: ['$+1$ and $-1$, twice each', '$+1$ (three times) and $-3$ (once)', '$+3$ (once) and $-1$ (three times)', '$\\tfrac14$ (three times) and $-\\tfrac34$ (once)'], answer: 1,
      sol: '$\\vec\\sigma_1\\cdot\\vec\\sigma_2 = \\tfrac{4}{\\hbar^2}\\vec S_1\\cdot\\vec S_2 = 2[S(S+1) - \\tfrac32]$: $+1$ for the triplet ($S = 1$), $-3$ for the singlet. Check: the trace $3(1) + (-3) = 0$, as $\\mathrm{Tr}(\\sigma_i\\otimes\\sigma_i) = 0$.',
      trap: '$\\tfrac14$ and $-\\tfrac34$ are the eigenvalues of $\\vec S_1\\cdot\\vec S_2$ in units of $\\hbar^2$.' },
    { id: 'qsa-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'precession',
      q: 'Taking $g = 2$, $\\mu_B = 9.274\\times10^{-24}$ J/T and $h = 6.626\\times10^{-34}$ J s, the spin precession (electron spin resonance) frequency of a free electron in a $1.00$ T field is ______ GHz (to one decimal place).',
      answer: 28.0, tol: 0.1, calc: () => 2 * 9.274e-24 / 6.626e-34 / 1e9,
      sol: 'The splitting is $\\Delta E = g\\mu_BB$, so $f = g\\mu_BB/h = 2\\times9.274\\times10^{-24}/6.626\\times10^{-34} = 2.80\\times10^{10}$ Hz $= 28.0$ GHz. (Protons precess about 660 times slower: 42.6 MHz/T.)' },
    { id: 'qsa-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pauli matrices',
      q: 'The matrix $e^{i\\pi\\sigma_y/2}$ equals',
      options: ['$\\sigma_y$', '$-1$', '$i\\sigma_y$', '$1 + i\\sigma_y$'], answer: 2,
      sol: 'Since $\\sigma_y^2 = 1$, the power series splits: $e^{i\\alpha\\sigma_y} = \\cos\\alpha + i\\sigma_y\\sin\\alpha$. At $\\alpha = \\pi/2$: $i\\sigma_y = \\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$, a real rotation matrix that swaps up and down (with a sign).' },
    { id: 'qsa-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin states',
      q: 'The spin-$\\tfrac12$ state with spin "up" along the unit vector with polar angles $(\\theta, \\phi)$ is',
      options: ['$\\cos\\theta|{\\uparrow}\\rangle + e^{i\\phi}\\sin\\theta|{\\downarrow}\\rangle$', '$\\cos\\tfrac\\theta2|{\\uparrow}\\rangle + \\sin\\tfrac\\theta2|{\\downarrow}\\rangle$ for every $\\phi$', '$\\sin\\tfrac\\theta2|{\\uparrow}\\rangle + e^{i\\phi}\\cos\\tfrac\\theta2|{\\downarrow}\\rangle$', '$\\cos\\tfrac\\theta2|{\\uparrow}\\rangle + e^{i\\phi}\\sin\\tfrac\\theta2|{\\downarrow}\\rangle$'], answer: 3,
      sol: 'Solve $(\\vec\\sigma\\cdot\\hat n)\\chi = \\chi$ with $\\vec\\sigma\\cdot\\hat n = \\begin{pmatrix}\\cos\\theta & \\sin\\theta e^{-i\\phi}\\\\ \\sin\\theta e^{i\\phi} & -\\cos\\theta\\end{pmatrix}$: the first row gives $b/a = e^{i\\phi}(1 - \\cos\\theta)/\\sin\\theta = e^{i\\phi}\\tan\\tfrac\\theta2$. Check: $\\theta = \\pi$ gives $|{\\downarrow}\\rangle$, and the full angle $\\theta$ would make $\\theta = 90^\\circ$ point down instead of sideways.' },

    // ---------- level 4 ----------
    { id: 'qsa-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'clebsch-gordan',
      q: 'An electron with $l = 2$ is in $|j = \\tfrac52, m = \\tfrac32\\rangle$. The probability that $S_z = +\\hbar/2$ is ______ (to two decimal places).',
      answer: 0.8, tol: 0.003, calc: () => cgUp(2, 2.5, 1.5),
      sol: 'For $j = l + \\tfrac12$: $|j, m\\rangle = \\sqrt{\\tfrac{l + m + 1/2}{2l + 1}}\\,|m - \\tfrac12\\rangle|{\\uparrow}\\rangle + \\sqrt{\\tfrac{l - m + 1/2}{2l + 1}}\\,|m + \\tfrac12\\rangle|{\\downarrow}\\rangle$. With $l = 2$, $m = \\tfrac32$: $P(\\uparrow) = \\tfrac{4}{5} = 0.8$. (Check with $l = 1$, $m = \\tfrac12$: $\\tfrac23$, as derived by lowering.)' },
    { id: 'qsa-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'projection theorem',
      q: 'An electron with $l = 2$ is in $|j = \\tfrac32, m = \\tfrac32\\rangle$. $\\langle S_z\\rangle = k\\hbar$ with $k =$ ______ (to two decimal places).',
      answer: -0.3, tol: 0.003, calc: () => 0.5 * (cgUp(2, 1.5, 1.5) - (1 - cgUp(2, 1.5, 1.5))),
      sol: 'For $j = l - \\tfrac12$: $P(\\uparrow) = \\tfrac{l - m + 1/2}{2l + 1} = \\tfrac{1}{5}$ and $P(\\downarrow) = \\tfrac45$, so $\\langle S_z\\rangle = \\tfrac12(\\tfrac15 - \\tfrac45)\\hbar = -0.3\\hbar$. Check by the projection theorem: $\\langle S_z\\rangle = m\\dfrac{\\langle\\vec S\\cdot\\vec J\\rangle}{j(j+1)}$, with $\\vec S\\cdot\\vec J = \\tfrac12(J^2 + S^2 - L^2) = \\tfrac12(\\tfrac{15}{4} + \\tfrac34 - 6)\\hbar^2 = -\\tfrac34\\hbar^2$: $\\tfrac32\\cdot(-\\tfrac34)/\\tfrac{15}{4} = -0.3$.',
      trap: 'The spin points on average against $\\vec J$ in a $j = l - \\tfrac12$ state.' },
    { id: 'qsa-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'two spins',
      q: 'Two electrons are prepared in the spin state $|{\\uparrow}\\rangle_1|{\\downarrow}\\rangle_2$. A measurement of the total $S^2$ gives $2\\hbar^2$ with probability',
      options: ['$1$', '$0$', '$1/4$', '$1/2$'], answer: 3,
      sol: '$|{\\uparrow\\downarrow}\\rangle = \\tfrac{1}{\\sqrt2}(|1,0\\rangle + |0,0\\rangle)$, so $S^2 = 2\\hbar^2$ ($S = 1$) with probability $\\tfrac12$ and $0$ with probability $\\tfrac12$.' },
    { id: 'qsa-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'two spins',
      q: 'Two spin-$\\tfrac12$ particles have $H = A\\,\\vec S_1\\cdot\\vec S_2 + b\\,(S_{1z} + S_{2z})/\\hbar$. Which statements are correct?',
      options: ['$H$ commutes with the total $S^2$.', 'The triplet and singlet states $|S, M\\rangle$ are eigenstates of $H$.', 'The triplet levels are $A\\hbar^2/4 + Mb$ with $M = 1, 0, -1$.', 'The singlet energy depends on $b$.'], answer: [0, 1, 2],
      sol: '$\\vec S_1\\cdot\\vec S_2 = \\tfrac12(S^2 - \\tfrac32\\hbar^2)$ and $S_{1z} + S_{2z} = S_z$ both commute with $S^2$ and with each other, so $|S, M\\rangle$ diagonalise $H$: $E = \\tfrac{A\\hbar^2}{2}[S(S+1) - \\tfrac32] + Mb$. Triplet: $A\\hbar^2/4 + Mb$; singlet ($M = 0$): $-3A\\hbar^2/4$, independent of $b$. (With unequal couplings $b_1S_{1z} + b_2S_{2z}$ this fails: $T_0$ and $S$ mix.)' },
    { id: 'qsa-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'An electron with $l = 2$ has spin-orbit energy $H_{so} = \\xi\\,\\vec L\\cdot\\vec S$. The splitting $E(j = \\tfrac52) - E(j = \\tfrac32)$ is $k\\,\\xi\\hbar^2$ with $k =$ ______ (to one decimal place).',
      answer: 2.5, tol: 0.01, calc: () => ls(2, 2.5) - ls(2, 1.5),
      sol: '$\\langle\\vec L\\cdot\\vec S\\rangle/\\hbar^2 = \\tfrac12[j(j+1) - 6 - \\tfrac34]$: $+1$ for $j = \\tfrac52$ and $-\\tfrac32$ for $j = \\tfrac32$. Splitting $2.5 = (2l + 1)/2$. Check the centre of gravity: $6(1) + 4(-\\tfrac32) = 0$.' },
    { id: 'qsa-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spin states',
      q: 'A beam of spin-$\\tfrac12$ particles is described by the density matrix $\\rho = \\begin{pmatrix}0.8&0\\\\0&0.2\\end{pmatrix}$ in the $S_z$ basis. Writing $\\rho = \\tfrac12(1 + \\vec P\\cdot\\vec\\sigma)$, the degree of polarisation $|\\vec P|$ is',
      options: ['$0.8$', '$0.6$', '$0.3$', '$0.36$'], answer: 1,
      sol: '$\\tfrac12(1 + P_z) = 0.8$ gives $P_z = 0.6$, and the zero off-diagonal entries give $P_x = P_y = 0$. So $|\\vec P| = \\langle\\sigma_z\\rangle = 0.8 - 0.2 = 0.6$: a partly polarised (mixed) beam. A pure state has $|\\vec P| = 1$.' },
    { id: 'qsa-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin states',
      q: 'A spin-$\\tfrac12$ particle is in $\\tfrac15\\left(3|{\\uparrow}\\rangle + 4i|{\\downarrow}\\rangle\\right)$. The probability that a measurement of $S_x$ gives $+\\hbar/2$ is ______ (to two decimal places).',
      answer: 0.5, tol: 0.003, calc: () => (3 * 3 + 4 * 4) / 50,
      sol: '$|+x\\rangle = \\tfrac{1}{\\sqrt2}(|{\\uparrow}\\rangle + |{\\downarrow}\\rangle)$, so the amplitude is $\\tfrac{1}{5\\sqrt2}(3 + 4i)$ and the probability $\\tfrac{|3 + 4i|^2}{50} = \\tfrac{25}{50} = 0.5$. The relative phase $i$ puts the spin in the $yz$-plane, with $\\langle S_x\\rangle = 0$.',
      trap: 'Adding $3 + 4 = 7$ as if both amplitudes were real gives $49/50 = 0.98$.' },
    { id: 'qsa-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'clebsch-gordan',
      q: 'The state $|j = \\tfrac12, m = -\\tfrac12\\rangle$ built from $l = 1$ and $s = \\tfrac12$ contains $|m_l = -1\\rangle|{\\uparrow}\\rangle$ with probability',
      options: ['$1/3$', '$1/2$', '$2/3$', '$0$'], answer: 2,
      sol: 'Lowering from the top: $|\\tfrac32, -\\tfrac12\\rangle = \\sqrt{\\tfrac13}|{-1}\\rangle|{\\uparrow}\\rangle + \\sqrt{\\tfrac23}|0\\rangle|{\\downarrow}\\rangle$. The $j = \\tfrac12$ state with the same $m$ is orthogonal to it: $\\propto \\sqrt{\\tfrac23}|{-1}\\rangle|{\\uparrow}\\rangle - \\sqrt{\\tfrac13}|0\\rangle|{\\downarrow}\\rangle$. Probability $\\tfrac23$.' },
    { id: 'qsa-041', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two spins',
      q: 'For two spin-$\\tfrac12$ particles in the product state $|{\\uparrow}\\rangle_1|{\\downarrow}\\rangle_2$, $\\langle\\vec S_1\\cdot\\vec S_2\\rangle = k\\hbar^2$. The value of $k$ is ______ (to two decimal places).',
      answer: -0.25, tol: 0.002, calc: () => 0.5 * 0.25 + 0.5 * -0.75,
      sol: 'Directly: $\\langle S_{1z}S_{2z}\\rangle = (\\tfrac12)(-\\tfrac12)\\hbar^2$, while $\\langle S_{1x}\\rangle = \\langle S_{1y}\\rangle = 0$ in a product of $S_z$ eigenstates, so $\\langle S_{1x}S_{2x} + S_{1y}S_{2y}\\rangle = 0$. Result $-0.25$. Check: half triplet ($+\\tfrac14$) and half singlet ($-\\tfrac34$) average to $-\\tfrac14$.' },

    // ---------- level 5 ----------
    { id: 'qsa-037', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'projection theorem',
      q: 'For the state $|l = 1, s = \\tfrac12, j = \\tfrac32, m = \\tfrac12\\rangle$, $\\langle L_z + 2S_z\\rangle = k\\hbar$ with $k =$ ______ (to three decimal places).',
      answer: 0.667, tol: 0.003, calc: () => 0.5 * (1 + (3.75 + 0.75 - 2) / 7.5),
      sol: 'From the Clebsch-Gordan coefficients, $\\langle L_z\\rangle = \\tfrac13\\hbar$ and $\\langle S_z\\rangle = \\tfrac16\\hbar$, so $\\langle L_z + 2S_z\\rangle = \\tfrac13 + \\tfrac13 = \\tfrac23\\hbar$. Projection theorem: $mg_j$ with $g_j = 1 + \\tfrac{j(j+1) + s(s+1) - l(l+1)}{2j(j+1)} = 1 + \\tfrac{2.5}{7.5} = \\tfrac43$, giving $\\tfrac12\\cdot\\tfrac43 = \\tfrac23$. This is the weak-field Zeeman shift in units of $\\mu_BB$.' },
    { id: 'qsa-038', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'three spins',
      q: 'The product space of three spin-$\\tfrac12$ particles decomposes into total-spin multiplets as',
      options: ['$\\tfrac32\\oplus\\tfrac12\\oplus\\tfrac12$', '$\\tfrac32\\oplus\\tfrac12$', '$\\tfrac32\\oplus\\tfrac32\\oplus\\tfrac12$', '$\\tfrac12\\oplus\\tfrac12\\oplus\\tfrac12\\oplus\\tfrac12$'], answer: 0,
      sol: 'Couple two first: $1\\oplus0$. Then $1\\otimes\\tfrac12 = \\tfrac32\\oplus\\tfrac12$ and $0\\otimes\\tfrac12 = \\tfrac12$. Dimensions: $4 + 2 + 2 = 8$. The two doublets differ in how the first pair is coupled; the quartet is fully symmetric.',
      trap: '$\\tfrac32\\oplus\\tfrac12$ has only 6 states, not 8.' },
    { id: 'qsa-039', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'two spins',
      q: 'Two spin-$\\tfrac12$ particles evolve under $H = J\\,\\vec\\sigma_1\\cdot\\vec\\sigma_2$ starting from $|{\\uparrow\\downarrow}\\rangle$ at $t = 0$. At the time when $Jt/\\hbar = \\pi/12$, the probability of finding them in $|{\\downarrow\\uparrow}\\rangle$ is ______ (to three decimal places).',
      answer: 0.25, tol: 0.003, calc: () => Math.sin(2 * Math.PI / 12) ** 2,
      sol: '$|{\\uparrow\\downarrow}\\rangle = \\tfrac{1}{\\sqrt2}(|T_0\\rangle + |S\\rangle)$ with energies $+J$ and $-3J$. Then $\\langle{\\downarrow\\uparrow}|\\psi(t)\\rangle = \\tfrac12(e^{-iJt/\\hbar} - e^{3iJt/\\hbar})$, whose square is $\\tfrac12(1 - \\cos4Jt/\\hbar) = \\sin^2(2Jt/\\hbar)$. At $Jt/\\hbar = \\pi/12$: $\\sin^2(\\pi/6) = 0.25$. Full swap at $Jt/\\hbar = \\pi/4$: this is the exchange (SWAP) gate of spin qubits.' },
    { id: 'qsa-040', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'clebsch-gordan',
      q: 'For the coupling of $j_1$ and $j_2$ to $|j, m\\rangle$ with Clebsch-Gordan coefficients $\\langle j_1m_1; j_2m_2|j m\\rangle$, which statements are always correct?',
      options: ['The coefficient vanishes unless $m = m_1 + m_2$.', '$\\sum_j(2j + 1) = (2j_1 + 1)(2j_2 + 1)$, with $j$ from $|j_1 - j_2|$ to $j_1 + j_2$.', '$|j_1 + j_2, j_1 + j_2\\rangle = |j_1j_1\\rangle|j_2j_2\\rangle$.', 'Every coupled state is symmetric under swapping the two angular momenta when $j_1 = j_2$.'], answer: [0, 1, 2],
      sol: '$J_z = J_{1z} + J_{2z}$ forces $m = m_1 + m_2$. The coupled and product bases span the same space, so the dimensions match. The stretched state has only one product state with $m = j_1 + j_2$. For $j_1 = j_2 = j$ the exchange sign is $(-1)^{2j - J}$, so half the multiplets (alternately) are antisymmetric, such as the singlet of two spin-$\\tfrac12$.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'qsa-g01', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'addition rules',
      make(r) {
        const j1 = int(r, 1, 8) / 2, j2 = int(r, 1, 6) / 2, ask = choose(r, ['states', 'values']);
        const v = ask === 'states' ? (2 * j1 + 1) * (2 * j2 + 1) : 2 * Math.min(j1, j2) + 1;
        return { q: `Angular momenta $j_1 = ${half(j1)}$ and $j_2 = ${half(j2)}$ are combined. ${ask === 'states' ? 'The total number of coupled states $|j, m\\rangle$ is' : 'The number of different allowed values of the total $j$ is'} ______.`,
          answer: v, tol: 0, j1, j2, ask,
          sol: `$j$ runs from $|j_1 - j_2| = ${half(Math.abs(j1 - j2))}$ to $j_1 + j_2 = ${half(j1 + j2)}$ in whole steps: $2\\min(j_1, j_2) + 1 = ${2 * Math.min(j1, j2) + 1}$ values. The number of states is $(2j_1 + 1)(2j_2 + 1) = ${2 * j1 + 1}\\times${2 * j2 + 1} = ${(2 * j1 + 1) * (2 * j2 + 1)}$.` };
      },
      verify: (p) => { let n = 0, c = 0; for (let j = Math.abs(p.j1 - p.j2); j <= p.j1 + p.j2 + 1e-9; j++) { n++; c += 2 * j + 1; } return p.ask === 'states' ? c : n; } },
    { id: 'qsa-g02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'addition rules',
      make(r) {
        const j1 = int(r, 2, 8) / 2, j2 = int(r, 1, 4) / 2;
        const list = (a, b) => { const o = []; for (let j = a; j <= b + 1e-9; j++) o.push(half(j)); return '$' + o.join(', ') + '$'; };
        const lo = Math.abs(j1 - j2), hi = j1 + j2;
        const o = mcqOptions(r, list(lo, hi), [list(lo + 1, hi), list(lo, hi - 1), list(Math.max(0, lo - 1), hi + 1), list(Math.max(0, lo - 0.5), hi + 0.5), list(lo, hi + 1)]);
        return { q: `Combining $j_1 = ${half(j1)}$ with $j_2 = ${half(j2)}$, the allowed total $j$ values are`, ...o,
          sol: `$|j_1 - j_2| \\le j \\le j_1 + j_2$ in whole steps: from $${half(lo)}$ to $${half(hi)}$. The two endpoints are both included, and $j$ is a half-integer exactly when one of $j_1, j_2$ is.` };
      } },
    { id: 'qsa-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin states',
      make(r) {
        const th = choose(r, [30, 45, 60, 90, 120, 135, 150]), down = r() < 0.5;
        const c = Math.cos(th * Math.PI / 360) ** 2, v = down ? 1 - c : c;
        return { q: `A spin-$\\tfrac12$ particle is prepared with $S_z = +\\hbar/2$. Its spin component along a unit vector at $${th}^\\circ$ to $z$ is measured. The probability of the result $${down ? '-' : '+'}\\hbar/2$ is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, th, down,
          sol: `$|{\\uparrow}\\rangle$ expanded in the eigenstates along $\\hat n$: $P(+) = \\cos^2(\\theta/2) = \\cos^2 ${th / 2}^\\circ = ${round(c, 4)}$ and $P(-) = \\sin^2(\\theta/2) = ${round(1 - c, 4)}$. Answer $${round(v, 3)}$.`,
          trap: 'Spin-half amplitudes use the half angle $\\theta/2$.' };
      },
      verify: (p) => { const c = Math.cos(p.th * Math.PI / 360) ** 2; return p.down ? 1 - c : c; } },
    { id: 'qsa-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit',
      make(r) {
        const l = int(r, 1, 4), up = r() < 0.5, j = up ? l + 0.5 : l - 0.5;
        const v = ls(l, j);
        return { q: `For an electron with $l = ${l}$ in the $j = ${half(j)}$ state, $\\langle\\vec L\\cdot\\vec S\\rangle = k\\hbar^2$. The value of $k$ is ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, l, j,
          sol: `$\\vec L\\cdot\\vec S = \\tfrac12(J^2 - L^2 - S^2) = \\tfrac{\\hbar^2}{2}[${round(j * (j + 1), 2)} - ${l * (l + 1)} - 0.75] = ${round(v, 2)}\\hbar^2$. In general $l/2$ for $j = l + \\tfrac12$ and $-(l + 1)/2$ for $j = l - \\tfrac12$.` };
      },
      verify: (p) => (p.j > p.l ? p.l / 2 : -(p.l + 1) / 2) },
    { id: 'qsa-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'clebsch-gordan',
      make(r) {
        const l = int(r, 1, 4), up = r() < 0.6, j = up ? l + 0.5 : l - 0.5;
        const m = int(r, 0, 2 * j) - j, dn = r() < 0.4;
        const p = cgUp(l, j, m), v = dn ? 1 - p : p;
        return { q: `An electron with $l = ${l}$ is in $|j = ${half(j)}, m = ${half(m)}\\rangle$. The probability that a measurement of $S_z$ gives $${dn ? '-' : '+'}\\hbar/2$ (and so $m_l = ${half(dn ? m + 0.5 : m - 0.5)}$) is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, l, j, m, dn,
          sol: `For $j = l ${up ? '+' : '-'} \\tfrac12$: $P(\\uparrow) = \\dfrac{l ${up ? '+' : '-'} m + \\tfrac12}{2l + 1} = \\dfrac{${round(up ? l + m + 0.5 : l - m + 0.5, 1)}}{${2 * l + 1}} = ${round(p, 4)}$ and $P(\\downarrow) = ${round(1 - p, 4)}$. Answer $${round(v, 3)}$.`,
          trap: 'The $j = l + \\tfrac12$ and $j = l - \\tfrac12$ states swap the two weights.' };
      },
      verify: (p) => { const P = cgUp(p.l, p.j, p.m); return p.dn ? 1 - P : P; } },
    { id: 'qsa-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 4), ph = choose(r, [0, 90, 180, 270]), comp = choose(r, ['x', 'y', 'z']);
        const N = a * a + b * b, c = Math.cos(ph * Math.PI / 180), s = Math.sin(ph * Math.PI / 180);
        const v = comp === 'z' ? (a * a - b * b) / (2 * N) : comp === 'x' ? a * b * c / N : a * b * s / N;
        const coef = (ph >= 180 ? '-' : '+') + ' ' + (b === 1 ? '' : b) + (ph % 180 ? 'i' : '');
        return { q: `A spin-$\\tfrac12$ particle is in the (unnormalised) state $${a === 1 ? '' : a}|{\\uparrow}\\rangle ${coef}|{\\downarrow}\\rangle$. $\\langle S_${comp}\\rangle = k\\hbar$ with $k =$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, a, b, ph, comp,
          sol: `Norm $${N}$. With $b\' = ${b}e^{i${ph}^\\circ}$: $\\langle\\sigma_z\\rangle = (a^2 - b^2)/N = ${round((a * a - b * b) / N, 4)}$, $\\langle\\sigma_x\\rangle = 2\\,\\mathrm{Re}(a^*b\')/N = ${round(2 * a * b * c / N, 4)}$, $\\langle\\sigma_y\\rangle = 2\\,\\mathrm{Im}(a^*b\')/N = ${round(2 * a * b * s / N, 4)}$. $\\langle S_${comp}\\rangle = \\tfrac\\hbar2\\langle\\sigma_${comp}\\rangle = ${round(v, 3)}\\hbar$.` };
      },
      verify: (p) => { const N = p.a ** 2 + p.b ** 2, t = p.ph * Math.PI / 180; return p.comp === 'z' ? (p.a ** 2 - p.b ** 2) / (2 * N) : p.comp === 'x' ? p.a * p.b * Math.cos(t) / N : p.a * p.b * Math.sin(t) / N; } },
    { id: 'qsa-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stern-gerlach',
      make(r) {
        const t1 = choose(r, [30, 45, 60, 90, 120]), t2 = choose(r, [90, 135, 150, 180]);
        const v = Math.cos(t1 * Math.PI / 360) ** 2 * Math.cos((t2 - t1) * Math.PI / 360) ** 2;
        return { q: `Spin-$\\tfrac12$ atoms with $S_z = +\\hbar/2$ pass two Stern-Gerlach filters in turn, each keeping only "spin up" along its own axis. Both axes lie in the $xz$-plane, at $${t1}^\\circ$ and then $${t2}^\\circ$ from $+z$ (measured the same way round). The fraction of atoms that get through both is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, t1, t2,
          sol: `Each step passes $\\cos^2(\\Delta\\theta/2)$ of what enters, where $\\Delta\\theta$ is the angle between successive axes. $\\cos^2(${t1 / 2}^\\circ)\\times\\cos^2(${(t2 - t1) / 2}^\\circ) = ${round(Math.cos(t1 * Math.PI / 360) ** 2, 4)}\\times${round(Math.cos((t2 - t1) * Math.PI / 360) ** 2, 4)} = ${round(v, 3)}$.` };
      },
      verify: (p) => Math.cos(p.t1 * Math.PI / 360) ** 2 * Math.cos((p.t2 - p.t1) * Math.PI / 360) ** 2 },
    { id: 'qsa-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'precession',
      make(r) {
        const who = choose(r, ['electron', 'proton']), B = choose(r, [0.1, 0.35, 0.5, 1.5, 3, 7]);
        const v = who === 'electron' ? 2.0023 * 9.274e-24 * B / 6.626e-34 / 1e9 : 5.586 * 5.051e-27 * B / 6.626e-34 / 1e6;
        return { q: `The spin precession (magnetic resonance) frequency of a free ${who} in a field of $${B}$ T is ______ ${who === 'electron' ? 'GHz' : 'MHz'} (to two decimal places). Use ${who === 'electron' ? '$g = 2.0023$, $\\mu_B = 9.274\\times10^{-24}$ J/T' : '$g_p = 5.586$, $\\mu_N = 5.051\\times10^{-27}$ J/T'} and $h = 6.626\\times10^{-34}$ J s.`,
          answer: round(v, 2), tol: Math.max(0.01, v * 0.003), who, B,
          sol: `$hf = g\\mu B$ (the splitting of the two spin states). $f = ${who === 'electron' ? '2.0023\\times9.274\\times10^{-24}' : '5.586\\times5.051\\times10^{-27}'}\\times${B}/6.626\\times10^{-34} = ${round(v, 2)}$ ${who === 'electron' ? 'GHz' : 'MHz'}.` };
      },
      verify: (p) => (p.who === 'electron' ? 2.0023 * 9.274e-24 * p.B / 6.626e-34 / 1e9 : 5.586 * 5.051e-27 * p.B / 6.626e-34 / 1e6) },
    { id: 'qsa-g09', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'two spins',
      make(r) {
        const k = choose(r, [16, 12, 10, 8, 6, 5, 3]);
        const v = Math.sin(2 * Math.PI / k) ** 2;
        return { q: `Two spin-$\\tfrac12$ particles evolve under $H = J\\,\\vec\\sigma_1\\cdot\\vec\\sigma_2$ from $|{\\uparrow\\downarrow}\\rangle$. When $Jt/\\hbar = \\pi/${k}$, the probability of finding $|{\\downarrow\\uparrow}\\rangle$ is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, k,
          sol: `Triplet $T_0$ has energy $+J$, singlet $-3J$. $|{\\uparrow\\downarrow}\\rangle = (T_0 + S)/\\sqrt2$, so $P = \\sin^2(2Jt/\\hbar) = \\sin^2(2\\pi/${k}) = ${round(v, 3)}$.` };
      },
      verify: (p) => (1 - Math.cos(4 * Math.PI / p.k)) / 2 },
    { id: 'qsa-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two spins',
      make(r) {
        const A = choose(r, [0.2, 0.4, 0.6, 1, 1.5]), b = choose(r, [0.1, 0.3, 0.5, 0.8]);
        const levels = { 'T+': A / 4 + b, T0: A / 4, 'T-': A / 4 - b, S: -0.75 * A };
        const names = { 'T+': '$|1, 1\\rangle$', T0: '$|1, 0\\rangle$', 'T-': '$|1, -1\\rangle$', S: 'the singlet' };
        const ks = Object.keys(levels), i = int(r, 0, 3), j = (i + int(r, 1, 3)) % 4;
        const v = Math.abs(levels[ks[i]] - levels[ks[j]]);
        return { q: `Two spin-$\\tfrac12$ particles have $H = A\\,\\vec S_1\\cdot\\vec S_2/\\hbar^2 + b\\,(S_{1z} + S_{2z})/\\hbar$ with $A = ${A}$ meV and $b = ${b}$ meV. The energy difference between ${names[ks[i]]} and ${names[ks[j]]} (magnitude) is ______ meV (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, A, b, a: ks[i], c: ks[j],
          sol: `$E = \\tfrac{A}{2}[S(S+1) - \\tfrac32] + Mb$: triplet $A/4 + Mb$ $(${round(A / 4 + b, 3)}, ${round(A / 4, 3)}, ${round(A / 4 - b, 3)})$ meV for $M = 1, 0, -1$; singlet $-3A/4 = ${round(-0.75 * A, 3)}$ meV. Difference $${round(v, 3)}$ meV.` };
      },
      verify: (p) => { const L = { 'T+': p.A / 4 + p.b, T0: p.A / 4, 'T-': p.A / 4 - p.b, S: -0.75 * p.A }; return Math.abs(L[p.a] - L[p.c]); } },
    { id: 'qsa-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'exchange symmetry',
      make(r) {
        const j = int(r, 2, 5) / 2;
        const sym = [], anti = [];
        for (let J = 0; J <= 2 * j + 1e-9; J++) ((2 * j - J) % 2 === 0 ? sym : anti).push(J);
        const show = (a) => '$J = ' + a.map(half).join(', ') + '$';
        const o = mcqOptions(r, show(sym), [show(anti), show(sym.concat(anti).sort((x, y) => x - y)), show([2 * j]), show(sym.filter((x) => x !== 0).length ? sym.filter((x) => x !== 0) : [1])]);
        return { q: `Two angular momenta, each $j = ${half(j)}$, are coupled to total $J$. Which coupled multiplets are symmetric under exchange of the two?`, ...o,
          sol: `The stretched state $J = 2j$ is $|jj\\rangle|jj\\rangle$, symmetric, and the symmetry alternates as $(-1)^{2j - J}$ going down. So the symmetric multiplets are ${show(sym)} and the antisymmetric ones ${show(anti)}. Count check: symmetric states number $\\tfrac12(2j+1)(2j+2) = ${(2 * j + 1) * (2 * j + 2) / 2}$.` };
      } },
    { id: 'qsa-g12', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'projection theorem',
      make(r) {
        const l = int(r, 1, 3), up = r() < 0.5, j = up ? l + 0.5 : l - 0.5, m = int(r, 0, 2 * j) - j;
        const what = choose(r, ['Sz', 'Lz']);
        const sz = m * (j * (j + 1) + 0.75 - l * (l + 1)) / (2 * j * (j + 1));
        const v = what === 'Sz' ? sz : m - sz;
        return { q: `An electron with $l = ${l}$ is in $|j = ${half(j)}, m = ${half(m)}\\rangle$. $\\langle ${what === 'Sz' ? 'S_z' : 'L_z'}\\rangle = k\\hbar$ with $k =$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, l, j, m, what,
          sol: `Projection theorem: $\\langle S_z\\rangle = m\\dfrac{\\langle\\vec S\\cdot\\vec J\\rangle}{j(j+1)}$ with $\\vec S\\cdot\\vec J = \\tfrac12[j(j+1) + \\tfrac34 - l(l+1)]\\hbar^2$. So $\\langle S_z\\rangle = ${half(m)}\\times\\dfrac{${round(j * (j + 1) + 0.75 - l * (l + 1), 3)}}{${round(2 * j * (j + 1), 3)}}\\hbar = ${round(sz, 4)}\\hbar$${what === 'Lz' ? `, and $\\langle L_z\\rangle = m\\hbar - \\langle S_z\\rangle = ${round(m - sz, 3)}\\hbar$` : ''}.` };
      },
      verify: (p) => { const P = cgUp(p.l, p.j, p.m), sz = (P - 0.5); return p.what === 'Sz' ? sz : p.m - sz; } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
