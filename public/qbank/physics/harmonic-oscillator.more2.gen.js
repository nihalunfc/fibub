// Extra written questions (round 2, qho-x01..x10) for harmonic-oscillator. Spread at the end of `items` in harmonic-oscillator.js.
// Original questions for GATE / CSIR NET practice (fibub). Named .gen.js so tests/qbank.mjs does not treat it as a topic.
const R = String.raw;
const HBAR = 1.054571817e-34, U = 1.66053907e-27, E = 1.602176634e-19;

function erfc(x) {
  // Numerical integration of the complementary error function (Simpson's rule), enough for x up to about 5.
  const N = 2000, b = x + 8, h = (b - x) / N;
  let s = Math.exp(-x * x) + Math.exp(-b * b);
  for (let i = 1; i < N; i++) { const t = x + i * h; s += (i % 2 ? 4 : 2) * Math.exp(-t * t); }
  return 2 / Math.sqrt(Math.PI) * s * h / 3;
}

export default [
  { id: 'qho-x01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ground state',
    q: R`In the ground state of a quantum harmonic oscillator, the probability of finding the particle outside the classically allowed region (beyond the turning points of a classical oscillator with the same energy) is ______ (three decimal places).`,
    answer: 0.157, tol: 0.002, calc: () => erfc(1),
    sol: R`With $\xi = x\sqrt{m\omega/\hbar}$, $|\psi_0|^2 \propto e^{-\xi^2}$, and $E = \tfrac12\hbar\omega$ puts the turning points at $\xi = \pm1$. $P = \dfrac{2}{\sqrt\pi}\displaystyle\int_1^\infty e^{-\xi^2}d\xi = \text{erfc}(1) = 0.157$. About 16% of the time the particle is where a classical one could never be.`,
    trap: R`Taking the turning points at $\xi = \pm\sqrt2$ uses $E = \hbar\omega$ instead of $\tfrac12\hbar\omega$.` },
  { id: 'qho-x02', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'coupled oscillators',
    q: R`Two identical oscillators are coupled: $H = \dfrac{p_1^2 + p_2^2}{2m} + \tfrac12m\omega^2(x_1^2 + x_2^2) + \lambda x_1x_2$ with $|\lambda| < m\omega^2$. The ground-state energy is`,
    options: [R`$\hbar\omega$`, R`$\hbar\sqrt{\omega^2 + \lambda/m}$`, R`$\tfrac12\hbar\left(\sqrt{\omega^2 + \lambda/m} + \sqrt{\omega^2 - \lambda/m}\right)$`, R`$\hbar\omega + \dfrac{\hbar\lambda}{2m\omega}$`], answer: 2,
    sol: R`With $X_\pm = (x_1 \pm x_2)/\sqrt2$, $x_1x_2 = \tfrac12(X_+^2 - X_-^2)$, so the potential is $\tfrac12m\omega_+^2X_+^2 + \tfrac12m\omega_-^2X_-^2$ with $\omega_\pm^2 = \omega^2 \pm \lambda/m$. The kinetic term keeps its form. Two independent oscillators: $E_0 = \tfrac12\hbar(\omega_+ + \omega_-)$. To first order in $\lambda$ the shift cancels, so the coupling lowers $E_0$ only at second order: $E_0 \approx \hbar\omega - \dfrac{\hbar\lambda^2}{8m^2\omega^3}$.`,
    trap: R`Adding $\hbar\lambda/2m\omega$ treats the coupling as a first-order shift; $\langle0|x_1x_2|0\rangle = 0$.` },
  { id: 'qho-x03', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'matrix elements',
    q: R`In the first excited state $|1\rangle$ of an oscillator, $\langle x^4\rangle = k\left(\dfrac{\hbar}{2m\omega}\right)^2$. The value of $k$ is ______.`,
    answer: 15, tol: 0, calc: () => 6 * 1 + 6 * 1 + 3,
    sol: R`$\hat x = \sqrt{\hbar/2m\omega}\,(a + a^\dagger)$. Count the paths in $\langle1|(a + a^\dagger)^4|1\rangle$ that go up twice and down twice and return to $n = 1$: each path contributes the product of $\sqrt{}$ factors. The general result is $\langle n|(a + a^\dagger)^4|n\rangle = 6n^2 + 6n + 3$, which for $n = 1$ gives 15. (For $n = 0$ it gives 3, the Gaussian $\langle x^4\rangle = 3\sigma^4$.) Check one path, up-up-down-down from $|1\rangle$: $\sqrt2\sqrt3\sqrt3\sqrt2 = 6$; the other allowed orderings give up-down-up-down $= 4$, up-down-down-up $= 2$, down-up-up-down $= 2$, down-up-down-up $= 1$ (down-down is impossible from $|1\rangle$), total $6 + 4 + 2 + 2 + 1 = 15$.`,
    trap: R`Using the ground-state value 3 for every level misses the growth of the spread with $n$.` },
  { id: 'qho-x04', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'thermal states',
    q: R`An oscillator in thermal equilibrium at temperature $T$ has $\langle x^2\rangle$ equal to`,
    options: [R`$\dfrac{\hbar}{2m\omega}\coth\dfrac{\hbar\omega}{2kT}$`, R`$\dfrac{kT}{m\omega^2}$ at all temperatures`, R`$\dfrac{\hbar}{2m\omega}\tanh\dfrac{\hbar\omega}{2kT}$`, R`$\dfrac{\hbar}{2m\omega}$ at all temperatures`], answer: 0,
    sol: R`$\langle x^2\rangle_n = \dfrac{\hbar}{m\omega}(n + \tfrac12)$, so $\langle x^2\rangle_T = \dfrac{\hbar}{m\omega}(\bar n + \tfrac12)$ with $\bar n + \tfrac12 = \tfrac12\coth\dfrac{\hbar\omega}{2kT}$. At $T \to 0$ this gives the zero-point $\hbar/2m\omega$; at high $T$, $\coth y \approx 1/y$ gives the classical $kT/m\omega^2$ (equipartition).`,
    trap: R`$\tanh$ goes the wrong way: it would shrink the spread as $T$ rises.` },
  { id: 'qho-x05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Heisenberg picture', format: 'statements',
    q: R`For the oscillator in the Heisenberg picture, which statements are true?`,
    options: [R`$a(t) = a\,e^{-i\omega t}$`, R`$\hat x(t) = \hat x\cos\omega t + \dfrac{\hat p}{m\omega}\sin\omega t$`, R`$\hat N(t) = a^\dagger a$ does not change with time`, R`$a^\dagger(t) = a^\dagger e^{-i\omega t}$`], answer: [0, 1, 2],
    sol: R`$\dot a = \dfrac{i}{\hbar}[H, a] = \dfrac i\hbar(-\hbar\omega a) = -i\omega a$, so $a(t) = ae^{-i\omega t}$ and, taking the adjoint, $a^\dagger(t) = a^\dagger e^{+i\omega t}$. Then $\hat x(t) \propto ae^{-i\omega t} + a^\dagger e^{i\omega t}$ reproduces the classical solution. $\hat N$ commutes with $H$, so it is constant.`,
    trap: R`The adjoint of $e^{-i\omega t}$ is $e^{+i\omega t}$; $a$ and $a^\dagger$ rotate in opposite senses.` },
  { id: 'qho-x06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'molecular vibrations',
    q: R`The H$^{35}$Cl bond has a force constant of 516 N/m (masses 1.008 u and 34.97 u). Treating it as a harmonic oscillator, its zero-point vibrational energy is ______ eV (three decimal places).`,
    answer: 0.185, tol: 0.002, unit: 'eV', calc: () => { const mu = 1.008 * 34.97 / (1.008 + 34.97) * U; return 0.5 * HBAR * Math.sqrt(516 / mu) / E; },
    sol: R`Reduced mass $\mu = \dfrac{1.008\times34.97}{35.98}$ u $= 0.980$ u $= 1.627\times10^{-27}$ kg. $\omega = \sqrt{k/\mu} = \sqrt{516/1.627\times10^{-27}} = 5.63\times10^{14}$ s$^{-1}$. $\tfrac12\hbar\omega = 0.5\times1.055\times10^{-34}\times5.63\times10^{14} = 2.97\times10^{-20}$ J $= 0.185$ eV.`,
    trap: R`Using the hydrogen mass alone instead of the reduced mass gives 0.183 eV; close here, but wrong in principle (and badly wrong for H$_2$).` },
  { id: 'qho-x07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
    q: R`A charged particle in a harmonic potential interacts with light through its electric dipole $q\hat x$. Starting from thermal populations of many levels, its absorption spectrum consists of`,
    options: [R`lines at $\omega, 2\omega, 3\omega, \dots$ of equal strength`, R`a continuous band`, R`lines at $\omega/2, \omega, 3\omega/2, \dots$`, R`a single line at $\omega$`], answer: 3,
    sol: R`$\langle m|\hat x|n\rangle \ne 0$ only for $m = n \pm 1$, so dipole transitions change $n$ by one, and every such transition has energy $\hbar\omega$ because the levels are equally spaced. All the lines fall on top of each other: one line at $\omega$, the same as the classical oscillator's emission. Real molecules show weak overtones only because of anharmonicity and non-linear dipoles.`,
    trap: R`Many populated levels suggest many lines, but equal spacing puts them all at the same frequency.` },
  { id: 'qho-x08', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'parity',
    q: R`For the oscillator with number operator $\hat N = a^\dagger a$, the operator $e^{i\pi\hat N}$ is`,
    options: [R`the identity`, R`the parity operator, $\psi(x) \to \psi(-x)$`, R`minus the identity`, R`time reversal`], answer: 1,
    sol: R`$e^{i\pi\hat N}|n\rangle = (-1)^n|n\rangle$. The eigenfunctions $\psi_n$ have parity $(-1)^n$ (Hermite polynomials of degree $n$), so on every basis state this operator acts like $\psi(x) \to \psi(-x)$; by linearity it is the parity operator. It also equals the time evolution over half a period up to a phase: $e^{-iH\pi/\hbar\omega} = e^{-i\pi/2}e^{-i\pi\hat N}$, which turns $x$ into $-x$ classically too.`,
    trap: R`$e^{i\pi} = -1$ tempts "minus identity", but $\hat N$ is an operator with integer eigenvalues, giving alternating signs.` },
  { id: 'qho-x09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'perturbations',
    q: R`An oscillator is perturbed by $H' = \alpha\hat x^3$. The first-order shift of every energy level is`,
    options: [R`zero, and the leading shift is second order and negative`, R`$\alpha\langle n|\hat x^3|n\rangle > 0$`, R`zero to all orders`, R`proportional to $\alpha(n + \tfrac12)^{3/2}$`], answer: 0,
    sol: R`$\psi_n$ has definite parity, so $|\psi_n|^2$ is even and $\langle n|x^3|n\rangle = 0$: no first-order shift. At second order $\hat x^3$ connects $|n\rangle$ to $|n \pm 1\rangle$ and $|n \pm 3\rangle$; the sum $\sum|H'_{mn}|^2/(E_n - E_m)$ is negative overall (the ground state's second-order shift is always negative), giving $E_n^{(2)} = -\dfrac{\alpha^2}{\hbar\omega}\left(\dfrac{\hbar}{2m\omega}\right)^3(30n^2 + 30n + 11)$.`,
    trap: R`A zero first-order shift does not mean no shift at all.` },
  { id: 'qho-x10', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'two-dimensional oscillator', format: 'statements',
    q: R`For the isotropic two-dimensional oscillator with levels $E = (N + 1)\hbar\omega$, $N = n_x + n_y$, which statements are true?`,
    options: [R`Level $N$ is $(N + 1)$-fold degenerate`, R`The states of level $N$ can be chosen with $L_z = m\hbar$, $m = -N, -N + 2, \dots, N$`, R`The ground state is non-degenerate`, R`The first excited level is three-fold degenerate`], answer: [0, 1, 2],
    sol: R`$n_x$ can be $0, 1, \dots, N$: $N + 1$ states. Using circular ladder operators $a_\pm = (a_x \mp ia_y)/\sqrt2$, $N = n_+ + n_-$ and $L_z = (n_+ - n_-)\hbar$, which runs from $-N$ to $N$ in steps of 2 ($N + 1$ values, matching). $N = 0$ has one state; $N = 1$ has two ($m = \pm1$), not three (that is the 3D count).`,
    trap: R`Three-fold degeneracy of the first excited level belongs to the 3D oscillator.` },
];
