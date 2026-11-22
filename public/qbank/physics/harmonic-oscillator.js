// The quantum harmonic oscillator at MSc level: ladder operators and their algebra, matrix elements of x and p,
// Hermite functions, uncertainty in stationary states, coherent states, sudden changes, 2D and 3D oscillators,
// an oscillator in a uniform field. (Basic energy levels: schrodinger-equation topic.)
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, round } from '../_util.js';
import more from './harmonic-oscillator.more.gen.js';
import more2 from './harmonic-oscillator.more2.gen.js';
import r4 from './harmonic-oscillator.r4.gen.js';

const HBM = 0.0762; // hbar^2 / m_e in eV nm^2
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

export default {
  topic: 'harmonic-oscillator',
  items: [
    // ---------- level 1 ----------
    { id: 'qho-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'For the oscillator lowering operator $a$ acting on the normalised eigenstate $|n\\rangle$, $a|n\\rangle$ equals',
      options: ['$\\sqrt{n+1}\\,|n-1\\rangle$', '$\\sqrt n\\,|n-1\\rangle$', '$\\sqrt n\\,|n+1\\rangle$', '$n\\,|n-1\\rangle$'], answer: 1,
      sol: '$a|n\\rangle = c|n-1\\rangle$ and $|c|^2 = \\langle n|a^\\dagger a|n\\rangle = \\langle n|N|n\\rangle = n$. Choosing $c$ real and positive, $a|n\\rangle = \\sqrt n\\,|n-1\\rangle$; in particular $a|0\\rangle = 0$.' },
    { id: 'qho-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'The raising operator acting on $|n\\rangle$ gives',
      options: ['$\\sqrt n\\,|n+1\\rangle$', '$\\sqrt{n+1}\\,|n-1\\rangle$', '$(n+1)\\,|n+1\\rangle$', '$\\sqrt{n+1}\\,|n+1\\rangle$'], answer: 3,
      sol: '$\\|a^\\dagger|n\\rangle\\|^2 = \\langle n|aa^\\dagger|n\\rangle = \\langle n|(N + 1)|n\\rangle = n + 1$, so $a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle$. Repeating: $|n\\rangle = (a^\\dagger)^n|0\\rangle/\\sqrt{n!}$.',
      trap: 'Mixing the two factors: lowering gives $\\sqrt n$, raising gives $\\sqrt{n+1}$ (the larger of the two labels involved, in both cases).' },
    { id: 'qho-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'With $a = \\sqrt{\\dfrac{m\\omega}{2\\hbar}}\\left(\\hat x + \\dfrac{i\\hat p}{m\\omega}\\right)$, the commutator $[a, a^\\dagger]$ equals ______.',
      answer: 1, tol: 0,
      sol: '$[a, a^\\dagger] = \\dfrac{m\\omega}{2\\hbar}\\left[\\hat x + \\dfrac{i\\hat p}{m\\omega}, \\hat x - \\dfrac{i\\hat p}{m\\omega}\\right] = \\dfrac{m\\omega}{2\\hbar}\\cdot\\dfrac{-2i}{m\\omega}[\\hat x, \\hat p] = \\dfrac{-i}{\\hbar}(i\\hbar) = 1$.' },
    { id: 'qho-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'In terms of the ladder operators, the oscillator Hamiltonian is',
      options: ['$\\hbar\\omega\\left(a^\\dagger a + \\tfrac12\\right)$', '$\\hbar\\omega\\,a^\\dagger a$', '$\\hbar\\omega\\left(aa^\\dagger + \\tfrac12\\right)$', '$\\tfrac12\\hbar\\omega\\left(a^\\dagger a + aa^\\dagger + 1\\right)$'], answer: 0,
      sol: 'Expanding, $a^\\dagger a = \\dfrac{H}{\\hbar\\omega} - \\dfrac12$, so $H = \\hbar\\omega(N + \\tfrac12)$ with $N = a^\\dagger a$. Equivalently $H = \\tfrac12\\hbar\\omega(a^\\dagger a + aa^\\dagger)$; the last option adds an extra $\\tfrac12\\hbar\\omega$. $aa^\\dagger = N + 1$, so the third option is too high by $\\hbar\\omega$.' },
    { id: 'qho-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'eigenfunctions',
      q: 'The oscillator eigenfunction $\\psi_5(x)$ is',
      options: ['even in $x$', 'odd in $x$', 'neither even nor odd', 'even or odd depending on $\\omega$'], answer: 1,
      sol: '$\\psi_n \\propto H_n(\\xi)e^{-\\xi^2/2}$ and $H_n$ has parity $(-1)^n$. For $n = 5$ the parity is $-1$: odd, with 5 nodes, one of them at $x = 0$.' },
    { id: 'qho-006', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'ground state',
      q: 'Which statements about the oscillator ground state $|0\\rangle$ are correct?',
      options: ['Its wavefunction is a Gaussian.', '$a|0\\rangle = 0$.', '$\\Delta x\\,\\Delta p = \\hbar/2$ in this state.', 'Its wavefunction has one node.'], answer: [0, 1, 2],
      sol: '$a\\psi_0 = 0$ is the first-order equation $\\left(x + \\tfrac{\\hbar}{m\\omega}\\tfrac{d}{dx}\\right)\\psi_0 = 0$, solved by $e^{-m\\omega x^2/2\\hbar}$, a Gaussian with no nodes. It is a minimum-uncertainty state.' },

    // ---------- level 2 ----------
    { id: 'qho-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      q: 'In the eigenstate $|3\\rangle$, $\\langle x^2\\rangle = k\\,\\dfrac{\\hbar}{2m\\omega}$. The value of $k$ is ______.',
      answer: 7, tol: 0,
      sol: '$x^2 = \\tfrac{\\hbar}{2m\\omega}(a + a^\\dagger)^2 = \\tfrac{\\hbar}{2m\\omega}(a^2 + a^{\\dagger2} + aa^\\dagger + a^\\dagger a)$. Only the last two have diagonal elements: $(n + 1) + n = 2n + 1 = 7$.',
      trap: 'Answering $n + \\tfrac12 = 3.5$, which is $\\langle x^2\\rangle$ in units of $\\hbar/m\\omega$.' },
    { id: 'qho-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'The position operator in terms of $a$ and $a^\\dagger$ is',
      options: ['$\\sqrt{\\dfrac{\\hbar}{2m\\omega}}\\,(a - a^\\dagger)$', '$i\\sqrt{\\dfrac{\\hbar}{2m\\omega}}\\,(a^\\dagger - a)$', '$\\sqrt{\\dfrac{\\hbar}{2m\\omega}}\\,(a + a^\\dagger)$', '$\\sqrt{\\dfrac{\\hbar}{m\\omega}}\\,(a + a^\\dagger)$'], answer: 2,
      sol: 'Add $a$ and $a^\\dagger$: the momentum parts cancel, leaving $a + a^\\dagger = 2\\sqrt{m\\omega/2\\hbar}\\,x$. So $x = \\sqrt{\\hbar/2m\\omega}\\,(a + a^\\dagger)$, and similarly $p = i\\sqrt{m\\hbar\\omega/2}\\,(a^\\dagger - a)$.',
      trap: 'The second option has the form of the momentum operator (with the wrong prefactor).' },
    { id: 'qho-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'The value of $\\langle 2|a^\\dagger a^\\dagger a\\,a|2\\rangle$ is',
      options: ['$2$', '$4$', '$1$', '$\\sqrt2$'], answer: 0,
      sol: '$a\\,a|2\\rangle = \\sqrt2\\sqrt1|0\\rangle$, and $\\langle2|a^\\dagger a^\\dagger = (a\\,a|2\\rangle)^\\dagger = \\sqrt2\\langle0|$. So the value is $\\sqrt2\\cdot\\sqrt2 = 2$. In general $a^{\\dagger2}a^2 = N(N - 1)$, giving $n(n-1)$.' },
    { id: 'qho-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      q: 'The matrix element $\\langle m|\\hat x|n\\rangle$ between oscillator eigenstates is non-zero only when',
      options: ['$m = n$', '$m = n \\pm 2$', '$m$ and $n$ have the same parity', '$m = n \\pm 1$'], answer: 3,
      sol: '$\\hat x \\propto a + a^\\dagger$ changes $n$ by exactly one, so $\\langle m|x|n\\rangle = \\sqrt{\\hbar/2m\\omega}\\left(\\sqrt n\\,\\delta_{m,n-1} + \\sqrt{n+1}\\,\\delta_{m,n+1}\\right)$. This is the dipole selection rule $\\Delta n = \\pm1$ of a charged oscillator.' },
    { id: 'qho-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      q: 'The matrix element $\\langle 3|\\hat x|2\\rangle = k\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$. The value of $k$ is ______ (to three decimal places).',
      answer: 1.732, tol: 0.002, calc: () => Math.sqrt(3),
      sol: '$\\hat x|2\\rangle = \\sqrt{\\hbar/2m\\omega}\\,(\\sqrt2|1\\rangle + \\sqrt3|3\\rangle)$, so $\\langle3|\\hat x|2\\rangle = \\sqrt3\\sqrt{\\hbar/2m\\omega}$: $k = 1.732$.' },
    { id: 'qho-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'uncertainty',
      q: 'In the oscillator eigenstate $|2\\rangle$, the product $\\Delta x\\,\\Delta p$ is',
      options: ['$\\hbar/2$', '$3\\hbar/2$', '$5\\hbar/2$', '$2\\hbar$'], answer: 2,
      sol: '$\\langle x\\rangle = \\langle p\\rangle = 0$; $\\langle x^2\\rangle = (2n+1)\\tfrac{\\hbar}{2m\\omega}$ and $\\langle p^2\\rangle = (2n+1)\\tfrac{m\\hbar\\omega}{2}$. So $\\Delta x\\Delta p = (n + \\tfrac12)\\hbar = \\tfrac52\\hbar$ for $n = 2$.' },
    { id: 'qho-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'eigenfunctions',
      q: 'With $\\xi = x\\sqrt{m\\omega/\\hbar}$, the second excited state $\\psi_2$ is proportional to',
      options: ['$\\xi\\,e^{-\\xi^2/2}$', '$(2\\xi^2 - 1)\\,e^{-\\xi^2/2}$', '$(\\xi^2 + 1)\\,e^{-\\xi^2/2}$', '$(2\\xi^3 - 3\\xi)\\,e^{-\\xi^2/2}$'], answer: 1,
      sol: '$\\psi_2 \\propto H_2(\\xi)e^{-\\xi^2/2}$ with $H_2 = 4\\xi^2 - 2 = 2(2\\xi^2 - 1)$. It is even with two nodes at $\\xi = \\pm1/\\sqrt2$. (Check: $a^\\dagger \\propto \\xi - d/d\\xi$ applied twice to $e^{-\\xi^2/2}$ gives $(4\\xi^2 - 2)e^{-\\xi^2/2}$.) $\\xi^2 + 1$ has no real zeros, and the cubic is odd ($\\psi_3$).' },
    { id: 'qho-014', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'classical limit',
      q: 'For large $n$, the probability density $|\\psi_n(x)|^2$, averaged over its rapid wiggles, is largest',
      options: ['near the classical turning points', 'at the centre $x = 0$', 'uniformly spread between the turning points', 'outside the classical turning points'], answer: 0,
      sol: 'It approaches the classical density $P(x) \\propto 1/\\sqrt{A^2 - x^2}$: the particle moves slowest near the turning points and spends most time there. The ground state is the opposite: largest at the centre.' },
    { id: 'qho-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'length scale',
      q: 'An electron is in an oscillator with $\\hbar\\omega = 1.0$ eV. The length $x_0 = \\sqrt{\\hbar/m\\omega}$ is ______ nm (to three decimal places). (Use $\\hbar^2/m_e = 0.0762$ eV nm².)',
      answer: 0.276, tol: 0.003, calc: () => Math.sqrt(HBM / 1.0),
      sol: '$x_0^2 = \\dfrac{\\hbar}{m\\omega} = \\dfrac{\\hbar^2}{m\\cdot\\hbar\\omega} = \\dfrac{0.0762}{1.0}$ nm², so $x_0 = 0.276$ nm. The ground-state density is $\\propto e^{-x^2/x_0^2}$, and $x_0$ is also the classical amplitude in the ground state.' },
    { id: 'qho-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'half oscillator',
      q: 'A particle moves in $V = \\tfrac12m\\omega^2x^2$ for $x > 0$ and $V = \\infty$ for $x \\le 0$. Its ground-state energy is',
      options: ['$\\tfrac12\\hbar\\omega$', '$\\hbar\\omega$', '$\\tfrac52\\hbar\\omega$', '$\\tfrac32\\hbar\\omega$'], answer: 3,
      sol: 'The wall needs $\\psi(0) = 0$. The odd oscillator states satisfy this and the oscillator equation for $x > 0$, so the allowed energies are $(n + \\tfrac12)\\hbar\\omega$ with $n$ odd: $\\tfrac32\\hbar\\omega, \\tfrac72\\hbar\\omega, \\dots$ The spacing becomes $2\\hbar\\omega$.' },
    { id: 'qho-041', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'eigenfunctions',
      q: 'Which statements about the stationary states $\\psi_n$ of the oscillator are correct?',
      options: ['The levels are equally spaced by $\\hbar\\omega$.', '$\\psi_n$ has exactly $n$ nodes.', '$\\psi_n$ has parity $(-1)^{n+1}$.', '$\\langle x\\rangle = 0$ in every stationary state.'], answer: [0, 1, 3],
      sol: '$E_n = (n + \\tfrac12)\\hbar\\omega$. $H_n$ is a polynomial of degree $n$ with $n$ real zeros and parity $(-1)^n$ (the ground state is even). $|\\psi_n|^2$ is even, so $\\langle x\\rangle = 0$; equivalently $\\langle n|a + a^\\dagger|n\\rangle = 0$.' },

    // ---------- level 3 ----------
    { id: 'qho-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'uniform field',
      q: 'An electron is bound by a spring of constant $k = m\\omega^2 = 4.0$ eV/nm². A uniform field adds the force $eE$ with $eE = 0.20$ eV/nm. Every energy level shifts by ______ meV.',
      answer: -5, tol: 0.05, calc: () => -1000 * 0.2 ** 2 / (2 * 4.0),
      sol: '$V = \\tfrac12kx^2 - eEx = \\tfrac12k(x - x_e)^2 - \\dfrac{(eE)^2}{2k}$ with $x_e = eE/k$. The spectrum is the same oscillator moved to $x_e$ and lowered by $(eE)^2/2k = 0.04/8$ eV $= 5$ meV. So every level shifts by $-5$ meV; the spacing $\\hbar\\omega$ is unchanged.',
      trap: 'Using first-order perturbation theory gives zero ($\\langle n|x|n\\rangle = 0$); the shift is second order, and here exact.' },
    { id: 'qho-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      q: 'A coherent state $|\\alpha\\rangle$ is an eigenstate of',
      options: ['$a^\\dagger$, with eigenvalue $\\alpha$', '$N$, with eigenvalue $|\\alpha|^2$', '$a$, with eigenvalue $\\alpha$', '$H$, with eigenvalue $(|\\alpha|^2 + \\tfrac12)\\hbar\\omega$'], answer: 2,
      sol: '$|\\alpha\\rangle = e^{-|\\alpha|^2/2}\\sum_n \\dfrac{\\alpha^n}{\\sqrt{n!}}|n\\rangle$ satisfies $a|\\alpha\\rangle = \\alpha|\\alpha\\rangle$. It is not an eigenstate of $N$ or $H$: $\\langle N\\rangle = |\\alpha|^2$ is only the mean. $a^\\dagger$ has no normalisable eigenstates.' },
    { id: 'qho-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      q: 'An oscillator is in a coherent state with $|\\alpha|^2 = 4$. The probability of finding it in $|2\\rangle$ is ______ (to three decimal places).',
      answer: 0.147, tol: 0.002, calc: () => Math.exp(-4) * 16 / 2,
      sol: 'The number distribution is Poisson with mean $|\\alpha|^2$: $P(n) = e^{-|\\alpha|^2}|\\alpha|^{2n}/n!$. $P(2) = e^{-4}\\cdot16/2 = 8e^{-4} = 0.147$.' },
    { id: 'qho-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      q: 'The mean energy of an oscillator in the coherent state $|\\alpha = 2\\rangle$ is',
      options: ['$\\tfrac92\\hbar\\omega$', '$4\\hbar\\omega$', '$\\tfrac52\\hbar\\omega$', '$2\\hbar\\omega$'], answer: 0,
      sol: '$\\langle H\\rangle = \\hbar\\omega(\\langle a^\\dagger a\\rangle + \\tfrac12) = \\hbar\\omega(|\\alpha|^2 + \\tfrac12) = 4.5\\hbar\\omega$, using $a|\\alpha\\rangle = \\alpha|\\alpha\\rangle$ and $\\langle\\alpha|a^\\dagger = \\alpha^*\\langle\\alpha|$.',
      trap: 'Using $|\\alpha|$ instead of $|\\alpha|^2$, or forgetting the zero-point $\\tfrac12\\hbar\\omega$.' },
    { id: 'qho-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      q: 'Which statements about coherent states of the oscillator are correct?',
      options: ['They have $\\Delta x\\,\\Delta p = \\hbar/2$ at all times.', '$\\langle x\\rangle(t)$ oscillates like a classical oscillator.', 'The number of quanta follows a Poisson distribution.', 'Coherent states with different $\\alpha$ are orthogonal.'], answer: [0, 1, 2],
      sol: 'A coherent state is the ground-state Gaussian displaced in phase space; it moves rigidly, $\\alpha(t) = \\alpha e^{-i\\omega t}$, so its shape and minimum uncertainty persist while $\\langle x\\rangle$ and $\\langle p\\rangle$ follow the classical orbit. $|\\langle\\beta|\\alpha\\rangle|^2 = e^{-|\\alpha - \\beta|^2} \\ne 0$: they are not orthogonal (the set is overcomplete).' },
    { id: 'qho-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'matrix elements',
      q: 'At $t = 0$ an oscillator is in $(|1\\rangle + |2\\rangle)/\\sqrt2$. Then $\\langle x\\rangle = k\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$ with $k =$ ______ (to three decimal places).',
      answer: 1.414, tol: 0.002, calc: () => Math.SQRT2,
      sol: '$(a + a^\\dagger)|1\\rangle = |0\\rangle + \\sqrt2|2\\rangle$ and $(a + a^\\dagger)|2\\rangle = \\sqrt2|1\\rangle + \\sqrt3|3\\rangle$. Taking the inner product with $(\\langle1| + \\langle2|)/\\sqrt2$ and dividing by $\\sqrt2$: $\\tfrac12(\\sqrt2 + \\sqrt2) = \\sqrt2$. Later, $\\langle x\\rangle = \\sqrt2\\sqrt{\\hbar/2m\\omega}\\cos\\omega t$.' },
    { id: 'qho-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'The commutator $[H, a]$ for the oscillator is',
      options: ['$\\hbar\\omega\\,a$', '$-\\hbar\\omega\\,a$', '$\\hbar\\omega\\,a^\\dagger$', '$0$'], answer: 1,
      sol: '$[N, a] = [a^\\dagger a, a] = [a^\\dagger, a]a = -a$, so $[H, a] = -\\hbar\\omega a$. Hence $H(a|E\\rangle) = (E - \\hbar\\omega)a|E\\rangle$: $a$ lowers the energy by one quantum. Likewise $[H, a^\\dagger] = +\\hbar\\omega a^\\dagger$.' },
    { id: 'qho-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden change',
      q: 'An oscillator is in its ground state when the spring constant is suddenly reduced so that $\\omega \\to \\omega/4$. The probability that it is found in the ground state of the new oscillator is ______ (to two decimal places).',
      answer: 0.8, tol: 0.005, calc: () => 2 * Math.sqrt(0.25) / 1.25,
      sol: 'The Gaussian $\\psi_0 \\propto e^{-m\\omega x^2/2\\hbar}$ is unchanged at the instant. Overlap of two normalised Gaussians: $\\langle0_\\omega|0_{\\omega\'}\\rangle = \\sqrt{\\dfrac{2\\sqrt{\\omega\\omega\'}}{\\omega + \\omega\'}}$. Probability $= \\dfrac{2\\sqrt{\\omega\\omega\'}}{\\omega + \\omega\'} = \\dfrac{2\\times\\tfrac12}{1.25} = 0.80$.',
      trap: 'Squaring twice: the formula under the root is the amplitude squared already.' },
    { id: 'qho-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: '2D and 3D oscillators',
      q: 'For an isotropic two-dimensional oscillator, the degeneracy of the level with energy $4\\hbar\\omega$ is',
      options: ['$3$', '$5$', '$4$', '$10$'], answer: 2,
      sol: '$E = (n_x + n_y + 1)\\hbar\\omega$, so $4\\hbar\\omega$ needs $n_x + n_y = 3$: $(0,3), (1,2), (2,1), (3,0)$, four states. In 2D the level $N$ has degeneracy $N + 1$.',
      trap: 'Forgetting the zero-point energy $\\hbar\\omega$ (two halves) and solving $n_x + n_y = 4$.' },
    { id: 'qho-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D and 3D oscillators',
      q: 'A 3D oscillator has $\\omega_x = \\omega_y = \\omega$ and $\\omega_z = 2\\omega$. The number of states with energy $5\\hbar\\omega$ is ______.',
      answer: 6, tol: 0,
      sol: '$E = \\hbar\\omega(n_x + n_y + 2n_z + 2)$, so we need $n_x + n_y + 2n_z = 3$. $n_z = 0$: $n_x + n_y = 3$, 4 ways. $n_z = 1$: $n_x + n_y = 1$, 2 ways. Total 6.' },
    { id: 'qho-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: '2D and 3D oscillators',
      q: 'For an isotropic 3D oscillator, the degeneracy of the level $E = \\tfrac{11}{2}\\hbar\\omega$ is',
      options: ['$10$', '$12$', '$25$', '$15$'], answer: 3,
      sol: '$E = (N + \\tfrac32)\\hbar\\omega$ gives $N = 4$. The number of ways to write $n_x + n_y + n_z = N$ is $\\tfrac{(N+1)(N+2)}{2} = \\tfrac{5\\cdot6}{2} = 15$.',
      trap: 'The 3D zero-point energy is $\\tfrac32\\hbar\\omega$, not $\\tfrac12\\hbar\\omega$; with the wrong zero point you land on the wrong level ($10$ is the degeneracy of $N = 3$).' },
    { id: 'qho-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      q: 'A coherent state has $\\langle N\\rangle = 100$. The relative spread $\\Delta N/\\langle N\\rangle$ of the number of quanta is',
      options: ['$0.01$', '$0.1$', '$1$', '$10$'], answer: 1,
      sol: 'For a Poisson distribution the variance equals the mean: $\\Delta N = \\sqrt{\\langle N\\rangle} = 10$, so $\\Delta N/\\langle N\\rangle = 1/\\sqrt{100} = 0.1$. Large coherent states have sharp relative energy, which is why laser light (a coherent state of a field mode) behaves classically.' },

    // ---------- level 4 ----------
    { id: 'qho-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'matrix elements',
      q: 'At $t = 0$ an oscillator is in $(|0\\rangle + |2\\rangle)/\\sqrt2$. Its mean kinetic energy, in units of $\\hbar\\omega$, is ______ (to three decimal places).',
      answer: 0.396, tol: 0.003, calc: () => (3 - Math.SQRT2) / 4,
      sol: '$T = \\dfrac{p^2}{2m} = -\\dfrac{\\hbar\\omega}{4}(a^\\dagger - a)^2 = \\dfrac{\\hbar\\omega}{4}(2N + 1 - a^2 - a^{\\dagger2})$. $\\langle 2N + 1\\rangle = \\tfrac12(1 + 5) = 3$. $a^2|2\\rangle = \\sqrt2|0\\rangle$, so $\\langle a^2\\rangle = \\langle a^{\\dagger2}\\rangle = \\tfrac{\\sqrt2}{2}$. $\\langle T\\rangle = \\tfrac14(3 - \\sqrt2)\\hbar\\omega = 0.396\\hbar\\omega$. (Then $\\langle V\\rangle = \\tfrac14(3 + \\sqrt2) = 1.104$, and the sum is $1.5 = \\tfrac12(0.5 + 2.5)$.)',
      trap: 'Using the virial result $\\langle T\\rangle = \\langle E\\rangle/2 = 0.75$, which holds only in stationary states.' },
    { id: 'qho-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'time evolution',
      q: 'An oscillator is in $(|0\\rangle + |2\\rangle)/\\sqrt2$. Its mean potential energy $\\langle V\\rangle(t)$',
      options: ['oscillates with angular frequency $\\omega$', 'oscillates with angular frequency $\\omega/2$', 'oscillates with angular frequency $2\\omega$', 'does not change'], answer: 2,
      sol: '$V \\propto x^2$ contains $a^2$ and $a^{\\dagger2}$, which connect $|0\\rangle$ and $|2\\rangle$. The cross terms carry $e^{\\pm i(E_2 - E_0)t/\\hbar} = e^{\\pm2i\\omega t}$. ($\\langle x\\rangle$ stays zero, since $x$ connects only states differing by one.) The total energy is of course constant: $\\langle T\\rangle$ oscillates opposite to $\\langle V\\rangle$.' },
    { id: 'qho-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'Which statements about the ladder operators are correct?',
      options: ['$a$ is not Hermitian.', '$a^\\dagger$ has no normalisable eigenvectors.', 'Every complex number is an eigenvalue of $a$.', '$a$ and $a^\\dagger$ commute with $N = a^\\dagger a$.'], answer: [0, 1, 2],
      sol: '$a^\\dagger \\ne a$. An eigenvector of $a^\\dagger$ would need its lowest non-zero component to vanish, so none exists; but $a$ has the coherent state $|\\alpha\\rangle$ for every complex $\\alpha$. $[N, a] = -a$ and $[N, a^\\dagger] = a^\\dagger$, not zero (that is exactly what makes them ladder operators).' },
    { id: 'qho-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      q: 'An oscillator is in its ground state when the centre of the potential suddenly jumps by $d = x_0 = \\sqrt{\\hbar/m\\omega}$ (same $\\omega$). The probability that it is found in the ground state of the new potential is ______ (to three decimal places).',
      answer: 0.607, tol: 0.003, calc: () => Math.exp(-0.5),
      sol: 'Relative to the new centre, the old ground state is a coherent state with $|\\alpha|^2 = \\dfrac{m\\omega d^2}{2\\hbar} = \\dfrac{d^2}{2x_0^2} = \\tfrac12$. The probability of $n = 0$ is $e^{-|\\alpha|^2} = e^{-1/2} = 0.607$. (Directly: the overlap of two Gaussians $e^{-x^2/2x_0^2}$ a distance $d$ apart is $e^{-d^2/4x_0^2}$; squared, $e^{-d^2/2x_0^2}$.)' },
    { id: 'qho-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'many particles',
      q: 'Five non-interacting spin-half fermions are placed in a 1D oscillator. The lowest possible total energy, in units of $\\hbar\\omega$, is ______.',
      answer: 6.5, tol: 0.001, calc: () => 0.5 + 0.5 + 1.5 + 1.5 + 2.5,
      sol: 'Each level holds two (spin up and down). Fill $n = 0, 0, 1, 1, 2$: $\\tfrac12 + \\tfrac12 + \\tfrac32 + \\tfrac32 + \\tfrac52 = 6.5$ in units of $\\hbar\\omega$.',
      trap: 'Putting all five in $n = 0$ (bosons) gives $2.5$; ignoring spin (one per level) gives $12.5$.' },
    { id: 'qho-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'eigenfunction expansion',
      q: 'An oscillator has the normalised wavefunction $\\psi \\propto \\xi^2e^{-\\xi^2/2}$, $\\xi = x\\sqrt{m\\omega/\\hbar}$. Its mean energy, in units of $\\hbar\\omega$, is ______ (to three decimal places).',
      answer: 1.833, tol: 0.003, calc: () => 11 / 6,
      sol: 'Write $\\xi^2 = \\tfrac14H_2 + \\tfrac12H_0$. With normalised $\\psi_n = N_nH_ne^{-\\xi^2/2}$, $N_n \\propto 1/\\sqrt{2^nn!}$, the amplitudes are proportional to $\\tfrac12\\sqrt{1}$ for $n = 0$ and $\\tfrac14\\sqrt{8}$ for $n = 2$, i.e. $\\tfrac12$ and $\\tfrac{1}{\\sqrt2}$. Probabilities: $P_0 = \\tfrac{1/4}{3/4} = \\tfrac13$, $P_2 = \\tfrac23$. $\\langle E\\rangle = \\tfrac13\\cdot\\tfrac12 + \\tfrac23\\cdot\\tfrac52 = \\tfrac{11}{6} = 1.833$.',
      trap: 'Reading the probabilities off the Hermite coefficients $\\tfrac12, \\tfrac14$ directly, without the normalisation $\\sqrt{2^nn!}$.' },
    { id: 'qho-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'For integer $n \\ge 1$, the commutator $[a, (a^\\dagger)^n]$ equals',
      options: ['$n\\,(a^\\dagger)^{n-1}$', '$n\\,(a^\\dagger)^{n}$', '$(a^\\dagger)^{n-1}$', '$-n\\,(a^\\dagger)^{n-1}$'], answer: 0,
      sol: 'Since $[a, a^\\dagger] = 1$, $a$ acts on functions of $a^\\dagger$ like $d/da^\\dagger$: $[a, f(a^\\dagger)] = f\'(a^\\dagger)$. By induction, $[a, a^{\\dagger n}] = [a, a^{\\dagger(n-1)}]a^\\dagger + a^{\\dagger(n-1)} = n\\,a^{\\dagger(n-1)}$. This gives $a|n\\rangle = \\sqrt n|n-1\\rangle$ from $|n\\rangle = a^{\\dagger n}|0\\rangle/\\sqrt{n!}$.' },
    { id: 'qho-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uncertainty',
      q: 'At $t = 0$ an oscillator is in $(|0\\rangle + |1\\rangle)/\\sqrt2$. The product $\\Delta x\\,\\Delta p$ is $k\\hbar$, with $k =$ ______ (to three decimal places).',
      answer: 0.707, tol: 0.003, calc: () => Math.SQRT1_2,
      sol: 'With $\\ell = \\sqrt{\\hbar/2m\\omega}$: $\\langle x\\rangle = \\ell\\cdot\\tfrac12(1 + 1) = \\ell$ and $\\langle x^2\\rangle = \\ell^2\\cdot\\tfrac12(1 + 3) = 2\\ell^2$, so $\\Delta x = \\ell$. $\\langle p\\rangle \\propto i\\cdot\\tfrac12(\\langle0|a^\\dagger - a|1\\rangle + \\langle1|a^\\dagger - a|0\\rangle) = i\\cdot\\tfrac12(-1 + 1) = 0$ and $\\langle p^2\\rangle = \\tfrac{m\\hbar\\omega}{2}\\cdot\\tfrac12(1 + 3) = m\\hbar\\omega$. So $\\Delta p = \\sqrt{m\\hbar\\omega} = \\hbar/(\\sqrt2\\,\\ell)$ and $\\Delta x\\Delta p = \\hbar/\\sqrt2$.',
      trap: 'Forgetting to subtract $\\langle x\\rangle^2$, which is not zero in this superposition.' },

    // ---------- level 5 ----------
    { id: 'qho-037', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'sudden change',
      q: 'An oscillator is in its ground state when $\\omega$ suddenly doubles to $2\\omega$. Which statements are correct?',
      options: ['The probability of finding it in the first excited state of the new oscillator is zero.', 'The probability of finding it in the new ground state is $2\\sqrt2/3$.', 'Its mean energy just afterwards is $\\tfrac54\\hbar\\omega$.', 'Energy is conserved, so its mean energy afterwards is still $\\tfrac12\\hbar\\omega$.'], answer: [0, 1, 2],
      sol: 'The state is even, and the new $|1\\rangle$ is odd: zero overlap. Ground overlap probability $2\\sqrt{\\omega\\omega\'}/(\\omega + \\omega\') = 2\\sqrt2/3 = 0.943$. Mean energy in the new potential: $\\langle p^2\\rangle/2m = \\hbar\\omega/4$ and $\\tfrac12m(2\\omega)^2\\langle x^2\\rangle = 4\\times\\hbar\\omega/4 = \\hbar\\omega$, total $\\tfrac54\\hbar\\omega$. A sudden change of $H$ does work on the system, so energy is not conserved.' },
    { id: 'qho-038', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'squeezed states',
      q: 'A Gaussian state narrower than the oscillator ground state (a squeezed state, centred at the origin) evolves in the oscillator. Its width $\\Delta x(t)$ oscillates with angular frequency',
      options: ['$\\omega$', '$\\omega/2$', 'it stays constant', '$2\\omega$'], answer: 3,
      sol: 'In the Heisenberg picture $x(t) = x\\cos\\omega t + \\tfrac{p}{m\\omega}\\sin\\omega t$, so $\\langle x^2\\rangle(t) = \\langle x^2\\rangle\\cos^2\\omega t + \\tfrac{\\langle p^2\\rangle}{m^2\\omega^2}\\sin^2\\omega t$ (the cross term vanishes for a real Gaussian). This contains $\\cos2\\omega t$: the packet breathes twice per classical period, narrow-wide-narrow.',
      trap: 'Expecting frequency $\\omega$ because $\\langle x\\rangle$ oscillates at $\\omega$; a width is quadratic in $x$.' },
    { id: 'qho-039', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'sudden change',
      q: 'An atom bound in a harmonic trap is in the ground state when it absorbs a momentum kick $\\hbar k$ (so $\\psi \\to e^{ikx}\\psi$). The recoil energy $E_R = \\hbar^2k^2/2m$ equals $\\hbar\\omega/4$. The probability that the atom stays in the ground state is ______ (to three decimal places).',
      answer: 0.779, tol: 0.003, calc: () => Math.exp(-0.25),
      sol: '$|\\langle0|e^{ikx}|0\\rangle|^2 = e^{-k^2\\langle x^2\\rangle}$ for a Gaussian, with $\\langle x^2\\rangle = \\hbar/2m\\omega$. So the exponent is $\\dfrac{\\hbar k^2}{2m\\omega} = \\dfrac{E_R}{\\hbar\\omega} = \\tfrac14$, and the probability is $e^{-1/4} = 0.779$. This recoil-free fraction is the Lamb-Dicke (and Mössbauer) factor.' },
    { id: 'qho-040', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'coherent states',
      q: 'Let $D(\\alpha) = e^{\\alpha a^\\dagger - \\alpha^*a}$. Which statements are correct?',
      options: ['$|\\alpha\\rangle = D(\\alpha)|0\\rangle$ is the coherent state with $a|\\alpha\\rangle = \\alpha|\\alpha\\rangle$.', '$D(\\alpha)$ is unitary.', '$|\\alpha\\rangle$ is an eigenstate of $a^\\dagger$ with eigenvalue $\\alpha^*$.', '$|\\langle\\beta|\\alpha\\rangle|^2 = e^{-|\\alpha - \\beta|^2}$.'], answer: [0, 1, 3],
      sol: 'The exponent is anti-Hermitian, so $D$ is unitary. BCH gives $D^\\dagger aD = a + \\alpha$, so $aD|0\\rangle = D(a + \\alpha)|0\\rangle = \\alpha D|0\\rangle$. $\\langle\\alpha|a^\\dagger = \\alpha^*\\langle\\alpha|$ (a left eigenvector), but $|\\alpha\\rangle$ is not a right eigenvector of $a^\\dagger$. From the Poisson expansion, $\\langle\\beta|\\alpha\\rangle = e^{-|\\alpha|^2/2 - |\\beta|^2/2 + \\beta^*\\alpha}$, whose modulus squared is $e^{-|\\alpha - \\beta|^2}$.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'qho-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      make(r) {
        const n = int(r, 0, 9), which = choose(r, ['x', 'p']);
        const unit = which === 'x' ? '\\dfrac{\\hbar}{2m\\omega}' : '\\dfrac{m\\hbar\\omega}{2}';
        return { q: `In the oscillator eigenstate $|${n}\\rangle$, $\\langle ${which}^2\\rangle = k\\,${unit}$. The value of $k$ is ______.`,
          answer: 2 * n + 1, tol: 0, n,
          sol: `$${which}^2$ is proportional to ${which === 'x' ? '$(a + a^\\dagger)^2$' : '$-(a^\\dagger - a)^2$'}, whose diagonal part is $aa^\\dagger + a^\\dagger a = 2N + 1$. So $k = 2(${n}) + 1 = ${2 * n + 1}$.` };
      },
      verify: (p) => 2 * p.n + 1 },
    { id: 'qho-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'matrix elements',
      make(r) {
        const n = int(r, 0, 8), up = r() < 0.5;
        const [m, k] = up ? [n + 1, Math.sqrt(n + 1)] : [n, Math.sqrt(n + 1)];
        const q = up ? `\\langle ${n + 1}|\\hat x|${n}\\rangle` : `\\langle ${n}|\\hat x|${n + 1}\\rangle`;
        return { q: `The matrix element $${q} = k\\sqrt{\\dfrac{\\hbar}{2m\\omega}}$. The value of $k$ is ______ (to three decimal places).`,
          answer: round(k, 3), tol: 0.002, n, m,
          sol: `$\\hat x = \\sqrt{\\hbar/2m\\omega}\\,(a + a^\\dagger)$. Between $|${n}\\rangle$ and $|${n + 1}\\rangle$ the factor is $\\sqrt{${n + 1}}$ (the larger label), whichever way round: $k = ${round(k, 3)}$.`,
          trap: 'Using the smaller label: the factor is $\\sqrt{n+1}$ for $a^\\dagger|n\\rangle$ and also for $a|n+1\\rangle$.' };
      },
      verify: (p) => Math.sqrt(p.n + 1) },
    { id: 'qho-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'coherent states',
      make(r) {
        const A = choose(r, [1, 2, 3, 4, 5, 6, 9]), n = int(r, 0, 5);
        const P = Math.exp(-A) * A ** n / fact(n);
        return { q: `An oscillator is in a coherent state with $|\\alpha|^2 = ${A}$. The probability of finding exactly $${n}$ quanta is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.002, A, n,
          sol: `Poisson with mean $${A}$: $P(${n}) = e^{-${A}}\\,${A}^{${n}}/${n}! = ${round(P, 3)}$.`,
          trap: 'Using $|\\alpha|$ instead of $|\\alpha|^2$ as the mean.' };
      },
      verify: (p) => Math.exp(-p.A) * p.A ** p.n / fact(p.n) },
    { id: 'qho-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'uniform field',
      make(r) {
        const k = choose(r, [1, 2, 2.5, 4, 5, 8, 10]), F = choose(r, [0.05, 0.1, 0.2, 0.3, 0.4, 0.5]);
        const dE = -1000 * F * F / (2 * k);
        return { q: `A charged particle is bound by a spring of constant $${k}$ eV/nm². A uniform field then exerts a constant force of $${F}$ eV/nm on it. Every energy level shifts by ______ meV (to two decimal places).`,
          answer: round(dE, 2), tol: Math.max(0.01, round(Math.abs(dE) * 0.005, 2)), k, F,
          sol: `Completing the square, $\\tfrac12kx^2 - Fx = \\tfrac12k(x - F/k)^2 - F^2/2k$. Shift $= -F^2/2k = -${F}^2/(2\\times${k})$ eV $= ${round(dE, 2)}$ meV; the spacing is unchanged.`,
          trap: 'First-order perturbation theory gives zero; the shift is second order in the field.' };
      },
      verify: (p) => -1000 * p.F ** 2 / (2 * p.k) },
    { id: 'qho-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D and 3D oscillators',
      make(r) {
        const N = int(r, 1, 8), dim = choose(r, [2, 3]);
        const deg = dim === 2 ? N + 1 : (N + 1) * (N + 2) / 2;
        const E = N + dim / 2;
        return { q: `For an isotropic ${dim}D harmonic oscillator, the degeneracy of the level with energy $${E}\\,\\hbar\\omega$ is ______.`,
          answer: deg, tol: 0, N, dim,
          sol: `$E = (N + ${dim === 2 ? '1' : '\\tfrac32'})\\hbar\\omega$ gives $N = ${N}$. The number of ways to share $N$ quanta among ${dim} directions is ${dim === 2 ? `$N + 1 = ${deg}$` : `$\\tfrac{(N+1)(N+2)}{2} = ${deg}$`}.`,
          trap: 'Forgetting the zero-point energy of each direction when finding $N$.' };
      },
      verify: (p) => (p.dim === 2 ? p.N + 1 : (p.N + 1) * (p.N + 2) / 2) },
    { id: 'qho-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      make(r) {
        const ratio = choose(r, [0.25, 0.5, 2, 3, 4, 9]);
        const P = 2 * Math.sqrt(ratio) / (1 + ratio);
        return { q: `An oscillator is in its ground state when its frequency suddenly changes from $\\omega$ to $${ratio}\\,\\omega$. The probability of finding it in the new ground state is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.003, ratio,
          sol: `$P = \\dfrac{2\\sqrt{\\omega\\omega'}}{\\omega + \\omega'} = \\dfrac{2\\sqrt{${ratio}}}{1 + ${ratio}} = ${round(P, 3)}$. The result is the same for $\\omega'/\\omega$ and $\\omega/\\omega'$.` };
      },
      verify: (p) => 2 * Math.sqrt(p.ratio) / (1 + p.ratio) },
    { id: 'qho-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'length scale',
      make(r) {
        const hw = choose(r, [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2]);
        const x0 = Math.sqrt(HBM / hw);
        return { q: `An electron is in a harmonic well with $\\hbar\\omega = ${hw}$ eV. The ground-state length $x_0 = \\sqrt{\\hbar/m\\omega}$ is ______ nm (to three decimal places). Use $\\hbar^2/m_e = 0.0762$ eV nm².`,
          answer: round(x0, 3), tol: Math.max(0.002, round(x0 * 0.005, 3)), hw,
          sol: `$x_0^2 = \\hbar^2/(m\\,\\hbar\\omega) = 0.0762/${hw}$ nm², so $x_0 = ${round(x0, 3)}$ nm.` };
      },
      verify: (p) => Math.sqrt(HBM / p.hw) },
    { id: 'qho-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      make(r) {
        const f = choose(r, [0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]);
        const P = Math.exp(-f);
        return { q: `A trapped atom in the ground state of a harmonic trap absorbs a momentum kick $\\hbar k$ with recoil energy $E_R = \\hbar^2k^2/2m = ${f}\\,\\hbar\\omega$. The probability that it stays in the ground state is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.003, f,
          sol: `$|\\langle0|e^{ikx}|0\\rangle|^2 = e^{-k^2\\langle x^2\\rangle} = e^{-\\hbar k^2/2m\\omega} = e^{-E_R/\\hbar\\omega} = e^{-${f}} = ${round(P, 3)}$.` };
      },
      verify: (p) => Math.exp(-p.f) },
    ...more,
    ...r4.gens,
  ],
};
