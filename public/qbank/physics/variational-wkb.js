// The variational method and the WKB approximation: the variational principle and why energy errors are second
// order, trial functions for wells, oscillators, delta, linear and quartic potentials and hydrogen, helium and H⁻
// with a screened charge, linear (Rayleigh-Ritz) variation, WKB wavefunctions and validity, quantisation rules
// with soft and hard turning points, power-law level scaling, the bouncing particle, tunnelling exponents,
// field emission, decay lifetimes and double-well splitting.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './variational-wkb.more.gen.js';
import more2 from './variational-wkb.more2.gen.js';
import r4 from './variational-wkb.r4.gen.js';

const K1 = 5.1232; // sqrt(2 m_e · 1 eV)/ħ in nm⁻¹
const U = 0.0381;  // ħ²/2m_e in eV nm²

export default {
  topic: 'variational-wkb',
  items: [
    // ---------- level 1 ----------
    { id: 'qvw-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'For any normalisable trial state $|\\psi\\rangle$ obeying the boundary conditions, the variational principle says',
      options: ['$\\dfrac{\\langle\\psi|H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle} \\ge E_0$', '$\\dfrac{\\langle\\psi|H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle} \\le E_0$', '$\\langle\\psi|H|\\psi\\rangle = E_0$', '$\\dfrac{\\langle\\psi|H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle} \\ge E_1$, the first excited energy'], answer: 0,
      sol: 'Expand $|\\psi\\rangle = \\sum c_n|n\\rangle$: $\\langle H\\rangle = \\sum|c_n|^2E_n/\\sum|c_n|^2 \\ge E_0$, because every $E_n \\ge E_0$. Equality holds only if $|\\psi\\rangle$ is the ground state. So any guess gives an upper bound on the ground-state energy.' },
    { id: 'qvw-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'For a smooth potential well with two ordinary (soft) classical turning points, the WKB quantisation condition is',
      options: ['$\\oint p\\,dx = nh$', '$\\oint p\\,dx = (n + \\tfrac12)h$', '$\\oint p\\,dx = (n + 1)h$', '$\\oint p\\,dx = (n + \\tfrac34)h$'], answer: 1,
      sol: 'Each soft turning point adds a phase of $\\pi/4$ when the WKB wave is matched to the decaying solution outside (the connection formulas), so $\\int_a^b p\\,dx = (n + \\tfrac12)\\pi\\hbar$, i.e. $\\oint p\\,dx = (n + \\tfrac12)h$, $n = 0, 1, 2, \\dots$ The $\\tfrac12$ is the zero-point term.' },
    { id: 'qvw-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'wkb validity',
      q: 'The WKB approximation is reliable where',
      options: ['the potential is exactly constant', 'the energy is close to the top of the well', 'the potential changes little over one local de Broglie wavelength', 'the particle is classically forbidden'], answer: 2,
      sol: 'WKB treats the wave as locally plane with $\\lambda(x) = h/p(x)$. It needs $|d\\lambda/dx| \\ll 1$, i.e. the momentum changes by a small fraction over one wavelength. It fails near turning points, where $p \\to 0$ and $\\lambda \\to \\infty$; connection formulas bridge them. In a forbidden region it works too, with a decaying exponential, provided $\\kappa$ varies slowly.' },
    { id: 'qvw-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'A trial function $e^{-\\beta x^2}$ is used for the harmonic oscillator and $\\langle H\\rangle$ is minimised over $\\beta$. The result is',
      options: ['$\\hbar\\omega$', '$0.707\\,\\hbar\\omega$', 'below $\\tfrac12\\hbar\\omega$', 'exactly $\\tfrac12\\hbar\\omega$'], answer: 3,
      sol: '$\\langle H\\rangle = \\dfrac{\\hbar^2\\beta}{2m} + \\dfrac{m\\omega^2}{8\\beta}$, minimised at $\\beta = m\\omega/2\\hbar$, giving $\\tfrac12\\hbar\\omega$. The family contains the true ground state, so the method is exact. It can never go below $E_0$.' },
    { id: 'qvw-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'If the trial state differs from the true ground state by a small admixture of size $\\epsilon$, the error in the variational energy is of order',
      options: ['$\\epsilon^2$', '$\\epsilon$', '$\\sqrt\\epsilon$', '$\\epsilon^3$'], answer: 0,
      sol: 'With $|\\psi\\rangle = |0\\rangle + \\epsilon|\\chi\\rangle$ ($\\chi \\perp 0$), $\\langle H\\rangle = \\dfrac{E_0 + \\epsilon^2\\langle\\chi|H|\\chi\\rangle}{1 + \\epsilon^2} = E_0 + \\epsilon^2(\\langle\\chi|H|\\chi\\rangle - E_0) + \\dots$ The ground state is a stationary point of $\\langle H\\rangle$, so a mediocre wavefunction still gives a good energy.' },
    { id: 'qvw-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'Which statements about the variational method are correct?',
      options: ['It gives an upper bound on the ground-state energy.', 'It is exact if the trial family contains the true ground state.', 'A trial function orthogonal to the ground state gives an upper bound on the first excited energy.', 'It gives a lower bound on the ground-state energy.'], answer: [0, 1, 2],
      sol: 'If $c_0 = 0$, the expansion starts at $E_1$, so $\\langle H\\rangle \\ge E_1$; in practice orthogonality is often guaranteed by symmetry (an odd trial function in an even potential). The method never gives a lower bound.' },

    // ---------- level 2 ----------
    { id: 'qvw-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'For an infinite well $0 < x < a$, the trial function $\\psi = x(a - x)$ gives $\\langle H\\rangle = 5\\hbar^2/ma^2$. The ratio of this to the exact ground-state energy is ______ (to three decimal places).',
      answer: 1.013, tol: 0.002, calc: () => 10 / Math.PI ** 2,
      sol: 'Exact $E_1 = \\pi^2\\hbar^2/2ma^2 = 4.935\\hbar^2/ma^2$. Ratio $5/4.935 = 10/\\pi^2 = 1.013$: a 1.3% overestimate from a simple parabola. (Check of $\\langle H\\rangle$: $\\langle\\psi|\\psi\\rangle = a^5/30$, $\\int|\\psi\'|^2 = a^3/3$, so $\\langle T\\rangle = \\tfrac{\\hbar^2}{2m}\\cdot\\tfrac{a^3/3}{a^5/30} = 5\\hbar^2/ma^2$.)' },
    { id: 'qvw-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'tunnelling',
      q: 'An electron meets a rectangular barrier that is $1.0$ eV above its energy and $1.0$ nm wide. In the WKB estimate $T \\approx e^{-2\\kappa L}$, the exponent $2\\kappa L$ is ______ (to one decimal place). Use $\\sqrt{2m_e\\cdot1\\ \\text{eV}}/\\hbar = 5.12$ nm$^{-1}$.',
      answer: 10.2, tol: 0.1, calc: () => 2 * K1,
      sol: '$\\kappa = \\sqrt{2m(V - E)}/\\hbar = 5.12$ nm$^{-1}$, so $2\\kappa L = 10.2$ and $T \\approx e^{-10.2} \\approx 3.6\\times10^{-5}$. Doubling the width squares $T$.' },
    { id: 'qvw-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'Applied to the harmonic oscillator, the WKB rule $\\oint p\\,dx = (n + \\tfrac12)h$ gives',
      options: ['$E_n = n\\hbar\\omega$', '$E_n = (n + \\tfrac12)\\hbar\\omega$, the exact result', '$E_n = (n + \\tfrac12)\\hbar\\omega$ only for large $n$', '$E_n = (n + 1)\\hbar\\omega$'], answer: 1,
      sol: 'The orbit in phase space is an ellipse with semi-axes $\\sqrt{2E/m\\omega^2}$ and $\\sqrt{2mE}$, area $2\\pi E/\\omega$. Setting it to $(n + \\tfrac12)h$ gives $E = (n + \\tfrac12)\\hbar\\omega$ for every $n$: an accident of the quadratic potential (WKB is also exact for the Coulomb potential with the Langer correction).' },
    { id: 'qvw-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'For a well with infinitely hard walls at both ends (and any smooth floor between), the WKB condition is',
      options: ['$\\int_a^bp\\,dx = (n + \\tfrac12)\\pi\\hbar$', '$\\int_a^bp\\,dx = (n - \\tfrac14)\\pi\\hbar$', '$\\int_a^bp\\,dx = n\\pi\\hbar$, $n = 1, 2, \\dots$', '$\\int_a^bp\\,dx = 2n\\pi\\hbar$'], answer: 2,
      sol: 'At a hard wall the wavefunction must vanish, with no $\\pi/4$ phase leak into a forbidden region. Two walls give $\\int p\\,dx = n\\pi\\hbar$; for a flat floor this reproduces the exact square-well levels $n^2\\pi^2\\hbar^2/2ma^2$.' },
    { id: 'qvw-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'In a potential $V = c|x|^k$, WKB predicts that at large $n$ the levels grow as $E_n \\propto n^{2k/(k+2)}$. For the linear potential $V = F|x|$ this is',
      options: ['$n^2$', '$n$', '$n^{4/3}$', '$n^{2/3}$'], answer: 3,
      sol: 'The turning point is $x_0 \\propto E^{1/k}$ and $p \\propto E^{1/2}$, so $\\int p\\,dx \\propto E^{1/2 + 1/k} = E^{(k+2)/2k} \\propto n$. For $k = 1$: $E \\propto n^{2/3}$. Checks: $k = 2$ gives $n$ (oscillator), $k \\to \\infty$ gives $n^2$ (square well).' },
    { id: 'qvw-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'helium',
      q: 'For helium with trial function $\\psi \\propto e^{-\\zeta(r_1 + r_2)/a_0}$, one finds $\\langle H\\rangle = \\left(2\\zeta^2 - \\tfrac{27}{4}\\zeta\\right)\\times13.6$ eV. The best effective charge $\\zeta$ is',
      options: ['$27/16$', '$2$', '$27/8$', '$5/16$'], answer: 0,
      sol: '$d\\langle H\\rangle/d\\zeta = 4\\zeta - \\tfrac{27}{4} = 0$, so $\\zeta = \\tfrac{27}{16} = 1.6875$. Each electron partly screens the nucleus from the other: $2 - \\tfrac{5}{16}$.' },
    { id: 'qvw-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'Which requirement must a variational trial function satisfy?',
      options: ['It must solve the Schrödinger equation.', 'It must be normalisable and obey the boundary conditions of the problem.', 'It must have the exact energy.', 'It must be an eigenfunction of the kinetic energy.'], answer: 1,
      sol: 'The bound $\\langle H\\rangle \\ge E_0$ needs only that the trial state lies in the space where $H$ acts: normalisable, with the right boundary conditions (for example zero at hard walls) and finite kinetic energy. It need not satisfy any equation; it can even have kinks.' },
    { id: 'qvw-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'For the attractive delta potential $-\\alpha\\delta(x)$, a Gaussian trial function gives the best energy $-m\\alpha^2/\\pi\\hbar^2$, while the exact energy is $-m\\alpha^2/2\\hbar^2$. The ratio of variational to exact energy is',
      options: ['$1$', '$\\pi/2$', '$2/\\pi \\approx 0.64$', '$1/2$'], answer: 2,
      sol: '$\\dfrac{-m\\alpha^2/\\pi\\hbar^2}{-m\\alpha^2/2\\hbar^2} = \\dfrac2\\pi = 0.64$. The variational energy is higher (less negative), as it must be. A Gaussian is smooth at the origin, while the true $e^{-\\kappa|x|}$ has a cusp there, so the guess is poor.',
      trap: 'Thinking a ratio below 1 means the bound is violated: both energies are negative, and $-0.64|E_0|$ lies above $-|E_0|$.' },
    { id: 'qvw-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'wkb wavefunction',
      q: 'Which statements about the WKB wavefunction $\\psi \\approx \\dfrac{C}{\\sqrt{p(x)}}\\exp\\left(\\pm\\dfrac{i}{\\hbar}\\int p\\,dx\\right)$ are correct?',
      options: ['Its amplitude diverges at a classical turning point.', '$|\\psi|^2 \\propto 1/p$ matches the classical time spent in each $dx$.', 'In a forbidden region it becomes a real growing or decaying exponential.', 'It is exact for every potential.'], answer: [0, 1, 2],
      sol: 'At $p = 0$ the formula blows up; the true solution is an Airy function there. Away from turning points $|\\psi|^2 \\propto 1/p \\propto 1/v$, the classical dwell time. Where $E < V$, $p = i\\hbar\\kappa$ and the phase becomes $e^{\\pm\\int\\kappa\\,dx}$. It is exact only in special cases such as constant $V$.' },
    { id: 'qvw-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wkb wavefunction',
      q: 'In the WKB approximation, the probability density in a classically allowed region varies as',
      options: ['$p(x)$', '$p(x)^2$', 'a constant', '$1/p(x)$'], answer: 3,
      sol: 'Conservation of probability current with a slowly varying amplitude gives $|A|^2p = $ const, so $|\\psi|^2 \\propto 1/p$ (averaged over the fast oscillations). A slow particle spends more time in a region, just as in classical mechanics.' },

    // ---------- level 3 ----------
    { id: 'qvw-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      q: 'For hydrogen, a Gaussian trial function $e^{-\\beta r^2}$ gives the best energy $-\\dfrac{8}{3\\pi}$ Ry. With $1$ Ry $= 13.6$ eV, this is ______ eV (to two decimal places).',
      answer: -11.54, tol: 0.02, calc: () => -8 / (3 * Math.PI) * 13.6,
      sol: '$\\langle T\\rangle = \\tfrac{3\\hbar^2\\beta}{2m}$ and $\\langle V\\rangle = -\\tfrac{e^2}{4\\pi\\epsilon_0}\\cdot2\\sqrt{\\tfrac{2\\beta}{\\pi}}$. Minimising gives $-\\tfrac{8}{3\\pi}$ Ry $= -0.849\\times13.6 = -11.54$ eV, 15% above the true $-13.6$ eV: the Gaussian has no cusp at the nucleus and falls off too fast.' },
    { id: 'qvw-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'For the harmonic oscillator, take the trial function $e^{-\\alpha|x|}$ and minimise $\\langle H\\rangle$ over $\\alpha$. The result is $k\\,\\hbar\\omega$ with $k =$ ______ (to three decimal places).',
      answer: 0.707, tol: 0.002, calc: () => 1 / Math.SQRT2,
      sol: 'Normalised, $|\\psi|^2 = \\alpha e^{-2\\alpha|x|}$: $\\langle T\\rangle = \\hbar^2\\alpha^2/2m$ (the kink contributes no extra term when computed as $\\int|\\psi\'|^2$), and $\\langle x^2\\rangle = 1/2\\alpha^2$, so $\\langle V\\rangle = m\\omega^2/4\\alpha^2$. $E(\\alpha) = A\\alpha^2 + B/\\alpha^2$ has minimum $2\\sqrt{AB} = 2\\sqrt{\\tfrac{\\hbar^2}{2m}\\cdot\\tfrac{m\\omega^2}{4}} = \\hbar\\omega/\\sqrt2 = 0.707\\hbar\\omega$, above the exact $0.5\\hbar\\omega$.' },
    { id: 'qvw-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'A particle of mass $m$ bounces on a hard floor under gravity ($V = mgz$ for $z > 0$). WKB with one hard wall and one soft turning point gives $E_n = c_n\\left(\\tfrac12mg^2\\hbar^2\\right)^{1/3}$. The value of $c_1$ (ground state) is ______ (to three decimal places).',
      answer: 2.320, tol: 0.004, calc: () => Math.pow(1.5 * Math.PI * 0.75, 2 / 3),
      sol: 'Hard wall plus soft turning point: $\\int_0^{z_0}p\\,dz = (n - \\tfrac14)\\pi\\hbar$. With $p = \\sqrt{2m(E - mgz)}$: $\\int_0^{z_0}p\\,dz = \\dfrac{2\\sqrt{2m}E^{3/2}}{3mg}$. So $E_n = \\left[\\tfrac{3\\pi}{2}(n - \\tfrac14)\\right]^{2/3}\\left(\\tfrac12mg^2\\hbar^2\\right)^{1/3}$ and $c_1 = (3.534)^{2/3} = 2.320$. The exact value (first zero of the Airy function) is $2.338$.' },
    { id: 'qvw-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'helium',
      q: 'The helium ground-state energy is about $-79.0$ eV. Which estimate does the screened variational trial function ($\\zeta = 27/16$) give?',
      options: ['$-77.5$ eV', '$-74.8$ eV', '$-108.8$ eV', '$-81.2$ eV'], answer: 0,
      sol: '$E = -2\\zeta^2\\times13.6 = -2(1.6875)^2\\times13.6 = -77.5$ eV, above the true value as required. $-108.8$ eV ignores the repulsion; $-74.8$ eV is first-order perturbation theory with $\\zeta = 2$ ($-108.8 + 34.0$). Any value below $-79.0$ eV (such as $-81.2$) would violate the variational bound.' },
    { id: 'qvw-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear variation',
      q: 'A trial state $c_1\\phi_1 + c_2\\phi_2$ is built from two orthonormal functions with $\\langle\\phi_i|H|\\phi_j\\rangle = \\begin{pmatrix}-2 & 0.5\\\\0.5 & 1\\end{pmatrix}$ eV. The best variational estimate of the ground-state energy is ______ eV (to three decimal places).',
      answer: -2.081, tol: 0.002, calc: () => -0.5 - Math.sqrt(2.25 + 0.25),
      sol: 'Minimising over $c_1, c_2$ (Rayleigh-Ritz) means finding the lowest eigenvalue of the matrix: $\\tfrac{-2 + 1}{2} - \\sqrt{\\left(\\tfrac{1 + 2}{2}\\right)^2 + 0.5^2} = -0.5 - \\sqrt{2.5} = -2.081$ eV. It lies below $-2$ eV (the best single function) and above the true $E_0$.' },
    { id: 'qvw-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'For $V = F|x|$, WKB gives $E_n = c_n\\left(\\dfrac{\\hbar^2F^2}{2m}\\right)^{1/3}$. The ground-state coefficient $c_0$ is ______ (to three decimal places).',
      answer: 1.116, tol: 0.003, calc: () => Math.pow(3 * Math.PI * 0.5 / 4, 2 / 3),
      sol: 'Two soft turning points at $\\pm E/F$: $\\int p\\,dx = 2\\int_0^{E/F}\\sqrt{2m(E - Fx)}\\,dx = \\dfrac{4\\sqrt{2m}E^{3/2}}{3F} = (n + \\tfrac12)\\pi\\hbar$. So $E_n = \\left[\\tfrac{3\\pi}{4}(n + \\tfrac12)\\right]^{2/3}\\left(\\tfrac{\\hbar^2F^2}{2m}\\right)^{1/3}$ and $c_0 = (3\\pi/8)^{2/3} = 1.116$ (exact $1.019$; WKB is worst for the ground state).' },
    { id: 'qvw-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      q: 'A Gaussian trial function $e^{-\\beta r^2}$ is used for the hydrogen ground state. Which statements are correct?',
      options: ['The result is an upper bound on $-13.6$ eV.', 'It misses the cusp of the true wavefunction at $r = 0$.', 'Its tail falls off faster than the true $e^{-r/a_0}$.', 'With the best $\\beta$ it gives exactly $-13.6$ eV.'], answer: [0, 1, 2],
      sol: 'The best Gaussian gives $-11.5$ eV, above $-13.6$ eV. The true $1s$ function has a cusp ($\\psi\'/\\psi = -1/a_0$ at the nucleus) and a simple exponential tail; a Gaussian has neither, so no $\\beta$ reaches the exact energy.' },
    { id: 'qvw-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'excited states',
      q: 'For a potential with $V(-x) = V(x)$, a trial function that is odd in $x$ gives an upper bound on',
      options: ['the ground-state energy only', 'the first excited energy', 'the second excited energy', 'nothing useful, because odd functions are not allowed'], answer: 1,
      sol: 'The ground state of a symmetric 1D potential is even, so an odd trial function has $c_0 = 0$ automatically, and $\\langle H\\rangle \\ge E_1$. The first excited state is odd, so the bound can be tight. (For the oscillator, $xe^{-\\beta x^2}$ gives $\\tfrac32\\hbar\\omega$ exactly.)' },
    { id: 'qvw-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'A one-parameter trial family gives $\\langle H\\rangle(b) = \\dfrac{A}{b^2} + Bb^2$ with $A, B > 0$. The variational estimate is',
      options: ['$A + B$', '$\\sqrt{AB}$', '$2\\sqrt{AB}$', '$4\\sqrt{AB}$'], answer: 2,
      sol: '$d\\langle H\\rangle/db = -2A/b^3 + 2Bb = 0$ gives $b^4 = A/B$. Then $\\langle H\\rangle = A\\sqrt{B/A} + B\\sqrt{A/B} = 2\\sqrt{AB}$. At the minimum the two terms are equal: the kinetic and potential energies share the total equally, as the virial theorem for $V \\propto x^2$ requires.' },
    { id: 'qvw-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'tunnelling',
      q: 'In the WKB estimate $T \\approx \\exp\\left(-2\\int\\kappa\\,dx\\right)$, doubling the width of a rectangular barrier (same height) changes the transmission from $T$ to approximately',
      options: ['$T/2$', '$T/4$', '$2T$', '$T^2$'], answer: 3,
      sol: 'The exponent doubles: $e^{-4\\kappa L} = (e^{-2\\kappa L})^2 = T^2$. For $T = 10^{-5}$ this means $10^{-10}$. Exponential sensitivity is why tunnelling currents in a scanning tunnelling microscope respond so strongly to distance.',
      trap: 'Thinking of an Ohmic resistor; tunnelling is exponential in width, not linear.' },
    { id: 'qvw-030', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'A "half oscillator" has $V = \\tfrac12m\\omega^2x^2$ for $x > 0$ and an infinite wall at $x = 0$. WKB with one hard wall and one soft turning point gives the levels',
      options: ['$(2n + \\tfrac32)\\hbar\\omega$', '$(n + \\tfrac12)\\hbar\\omega$', '$(2n + \\tfrac12)\\hbar\\omega$', '$(n + \\tfrac34)\\hbar\\omega$'], answer: 0,
      sol: '$\\int_0^{x_0}p\\,dx$ is half the full-oscillator integral, $\\tfrac{\\pi E}{2\\omega}$. Setting it to $(n + \\tfrac34)\\pi\\hbar$ gives $E = (2n + \\tfrac32)\\hbar\\omega = \\tfrac32, \\tfrac72, \\dots$ in units of $\\hbar\\omega$: exactly the odd oscillator levels, which vanish at $x = 0$ as the wall demands.' },
    { id: 'qvw-031', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'linear variation',
      q: 'In the linear variational (Rayleigh-Ritz) method with $N$ basis functions, the $N$ eigenvalues of the $N\\times N$ matrix of $H$, in increasing order,',
      options: ['are all lower bounds on the true levels', 'are each upper bounds on the corresponding true levels $E_0, E_1, \\dots, E_{N-1}$', 'bound only the ground state; the rest mean nothing', 'equal the true levels whenever $N \\ge 2$'], answer: 1,
      sol: 'By the min-max (Hylleraas-Undheim-MacDonald) theorem, the $k$-th Ritz eigenvalue is $\\ge E_k$, and adding basis functions can only lower each one. This is how quantum chemistry codes converge from above.' },
    { id: 'qvw-041', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'The first-order perturbation estimate $E_0^{(0)} + \\langle0|H\'|0\\rangle$ of a ground-state energy is',
      options: ['always below the true ground energy', 'always equal to the true ground energy', 'unrelated to any bound', 'always an upper bound on the true ground energy'], answer: 3,
      sol: '$E_0^{(0)} + \\langle0|H\'|0\\rangle = \\langle0|H_0 + H\'|0\\rangle$, the expectation of the full $H$ in the trial state $|0\\rangle$. By the variational principle it is $\\ge E_0$. That is why the second-order correction for the ground state is always negative.' },

    // ---------- level 4 ----------
    { id: 'qvw-025', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'tunnelling',
      q: 'Electrons tunnel out of a metal (work function $4.0$ eV) through the triangular barrier $V = \\Phi - e\\mathcal Ex$ made by a field of $1.0\\times10^9$ V/m. The WKB exponent $2\\int\\kappa\\,dx = \\dfrac43\\dfrac{\\sqrt{2m}\\,\\Phi^{3/2}}{\\hbar e\\mathcal E}$ is ______ (to one decimal place). Use $\\sqrt{2m_e\\cdot1\\ \\text{eV}}/\\hbar = 5.123$ nm$^{-1}$.',
      answer: 54.6, tol: 0.3, calc: () => (4 / 3) * K1 * 2 * 4,
      sol: '$2\\int_0^{\\Phi/e\\mathcal E}\\dfrac{\\sqrt{2m(\\Phi - e\\mathcal Ex)}}{\\hbar}dx = \\dfrac43\\cdot\\dfrac{\\sqrt{2m\\Phi}}{\\hbar}\\cdot\\dfrac{\\Phi}{e\\mathcal E}$. Here $\\sqrt{2m\\Phi}/\\hbar = 5.123\\times2 = 10.25$ nm$^{-1}$ and $\\Phi/e\\mathcal E = 4$ eV$/(1$ eV/nm$) = 4$ nm. Exponent $= \\tfrac43\\times10.25\\times4 = 54.6$ (the Fowler-Nordheim exponent).' },
    { id: 'qvw-027', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'For the quartic oscillator $V = \\lambda x^4$, a Gaussian trial function gives $E = c\\left(\\hbar^2/2m\\right)^{2/3}\\lambda^{1/3}$ at best. The value of $c$ is ______ (to three decimal places).',
      answer: 1.082, tol: 0.003, calc: () => 1.5 * Math.pow(3 / 8, 1 / 3),
      sol: 'For $e^{-\\beta x^2}$: $\\langle p^2\\rangle = \\hbar^2\\beta$ and $\\langle x^4\\rangle = 3/16\\beta^2$. With $u = \\hbar^2/2m$: $E = u\\beta + \\tfrac{3\\lambda}{16\\beta^2}$; $dE/d\\beta = 0$ gives $\\beta^3 = 3\\lambda/8u$, and then $E = \\tfrac32u\\beta = \\tfrac32(3/8)^{1/3}u^{2/3}\\lambda^{1/3} = 1.082\\,u^{2/3}\\lambda^{1/3}$. The exact value is $1.060$.' },
    { id: 'qvw-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'A particle moves in 3D in $V = Fr$. With the trial function $e^{-r/b}$ ($l = 0$), $\\langle T\\rangle = \\hbar^2/2mb^2$ and $\\langle r\\rangle = \\tfrac32b$. The best energy is $c\\left(\\hbar^2F^2/2m\\right)^{1/3}$ with $c =$ ______ (to three decimal places).',
      answer: 2.476, tol: 0.004, calc: () => 2.25 * Math.pow(4 / 3, 1 / 3),
      sol: '$E(b) = \\tfrac{\\hbar^2}{2mb^2} + \\tfrac32Fb$. $dE/db = 0$: $\\tfrac{\\hbar^2}{mb^3} = \\tfrac32F$, so $\\tfrac{\\hbar^2}{2mb^2} = \\tfrac34Fb$ and $E = \\tfrac94Fb$ with $b = \\left(\\tfrac43\\right)^{1/3}\\left(\\tfrac{\\hbar^2}{2mF}\\right)^{1/3}$. So $c = \\tfrac94(4/3)^{1/3} = 2.476$, above the exact $2.338$ (an Airy zero, since $u = rR$ obeys the 1D bouncing-ball equation).' },
    { id: 'qvw-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'tunnelling',
      q: 'A particle meets an inverted-parabola barrier $V = V_0 - \\tfrac12m\\omega^2x^2$ with $V_0 - E = 0.10$ eV and $\\hbar\\omega = 0.20$ eV. The WKB transmission $e^{-2\\int\\kappa\\,dx}$ is ______ (to four decimal places).',
      answer: 0.0432, tol: 0.0004, calc: () => Math.exp(-2 * Math.PI * 0.1 / 0.2),
      sol: 'Between the turning points $\\pm b$, $\\kappa = \\sqrt{2m(\\Delta - \\tfrac12m\\omega^2x^2)}/\\hbar$ traces half an ellipse, so $\\int\\kappa\\,dx = \\tfrac\\pi2b\\sqrt{2m\\Delta}/\\hbar = \\pi\\Delta/\\hbar\\omega$ with $b = \\sqrt{2\\Delta/m\\omega^2}$. Exponent $2\\pi\\Delta/\\hbar\\omega = \\pi$, so $T \\approx e^{-\\pi} = 0.0432$. (The exact result $1/(1 + e^{\\pi}) = 0.0414$ is close.)' },
    { id: 'qvw-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'helium',
      q: 'Which statements about the variational treatment of helium with $\\psi \\propto e^{-\\zeta(r_1 + r_2)/a_0}$ are correct?',
      options: ['The best $\\zeta$ is less than 2 because each electron screens the nucleus.', 'In this state $\\langle e^2/4\\pi\\epsilon_0r_{12}\\rangle = \\tfrac58\\zeta\\cdot\\tfrac{e^2}{4\\pi\\epsilon_0a_0}$.', 'The variational energy lies above the measured energy.', 'The first-order perturbation estimate ($-74.8$ eV) lies below the measured energy.'], answer: [0, 1, 2],
      sol: 'The repulsion integral for two $1s$ electrons of charge parameter $\\zeta$ is $\\tfrac58\\zeta$ hartree. Minimising gives $\\zeta = 27/16$ and $-77.5$ eV, above $-79.0$ eV. The perturbative $-74.8$ eV is also an expectation value of $H$ (with $\\zeta = 2$), so it too lies above the true energy, and is worse.' },
    { id: 'qvw-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trial functions',
      q: 'For the infinite well $0 < x < a$, the normalised trial function $\\sqrt{30/a^5}\\,x(a - x)$ has overlap probability $|\\langle\\psi_1|\\psi\\rangle|^2$ with the true ground state equal to ______ (to four decimal places).',
      answer: 0.9986, tol: 0.0003, calc: () => 960 / Math.PI ** 6,
      sol: '$\\int_0^ax(a - x)\\sin\\tfrac{\\pi x}{a}dx = \\tfrac{4a^3}{\\pi^3}$. So $\\langle\\psi_1|\\psi\\rangle = \\sqrt{\\tfrac2a}\\sqrt{\\tfrac{30}{a^5}}\\tfrac{4a^3}{\\pi^3} = \\tfrac{4\\sqrt{60}}{\\pi^3} = 0.99928$ and the probability is $\\tfrac{960}{\\pi^6} = 0.9986$. The 0.14% missing weight sits in $n = 3, 5, \\dots$ and raises the energy by 1.3%.' },
    { id: 'qvw-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'A normalised trial state is $(|0\\rangle + \\epsilon|1\\rangle)/\\sqrt{1 + \\epsilon^2}$, where $|0\\rangle, |1\\rangle$ are exact eigenstates with energies $E_0 < E_1$ and $\\epsilon$ is real. Then $\\langle H\\rangle - E_0$ equals',
      options: ['$\\epsilon(E_1 - E_0)$', '$\\epsilon^2(E_1 + E_0)$', '$\\dfrac{\\epsilon^2}{1 + \\epsilon^2}(E_1 - E_0)$', '$\\dfrac{\\epsilon}{1 + \\epsilon^2}(E_1 - E_0)$'], answer: 2,
      sol: '$\\langle H\\rangle = \\dfrac{E_0 + \\epsilon^2E_1}{1 + \\epsilon^2}$, so $\\langle H\\rangle - E_0 = \\dfrac{\\epsilon^2(E_1 - E_0)}{1 + \\epsilon^2} \\ge 0$: quadratic in the wavefunction error, and positive.' },
    { id: 'qvw-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: 'For the quartic potential $V = \\lambda x^4$, WKB gives $E_n \\propto (n + \\tfrac12)^{4/3}$. The ratio $E_{20}/E_{10}$ is ______ (to two decimal places).',
      answer: 2.44, tol: 0.01, calc: () => (20.5 / 10.5) ** (4 / 3),
      sol: 'From $E_n \\propto (n + \\tfrac12)^{2k/(k+2)}$ with $k = 4$: $(20.5/10.5)^{4/3} = 1.952^{4/3} = 2.44$. Levels spread out faster than in an oscillator (ratio $1.95$) but slower than in a square well.' },
    { id: 'qvw-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'helium',
      q: 'With the screened trial function, helium\'s variational ground-state energy is $-2\\zeta^2$ Ry with $\\zeta = 27/16$. Taking $1$ Ry $= 13.6$ eV, this is ______ eV (to one decimal place).',
      answer: -77.5, tol: 0.1, calc: () => -2 * (27 / 16) ** 2 * 13.6,
      sol: 'At the minimum of $2\\zeta^2 - \\tfrac{27}{4}\\zeta$: $2\\zeta^2 - 4\\zeta^2 = -2\\zeta^2 = -2(1.6875)^2 = -5.695$ Ry $= -77.5$ eV. Measured: $-79.0$ eV. The ionisation energy follows as $77.5 - 54.4 = 23.1$ eV (measured 24.6 eV).' },

    // ---------- level 5 ----------
    { id: 'qvw-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'helium',
      q: 'Apply the same screened trial function to the hydride ion H$^-$ (nuclear charge 1, two electrons): $\\langle H\\rangle = \\left(2\\zeta^2 - 4\\zeta + \\tfrac54\\zeta\\right)$ Ry. The best variational energy is ______ eV (to two decimal places; $1$ Ry $= 13.6$ eV).',
      answer: -12.86, tol: 0.02, calc: () => -2 * (11 / 16) ** 2 * 13.6,
      sol: '$\\langle H\\rangle = 2\\zeta^2 - \\tfrac{11}{4}\\zeta$, minimised at $\\zeta = 11/16$: $E = -2(11/16)^2$ Ry $= -0.945$ Ry $= -12.86$ eV. This is above $-13.6$ eV (a hydrogen atom plus a free electron at rest), so this trial function fails to show that H$^-$ is bound, although it is (by 0.75 eV). A better (correlated) trial function is needed: the variational bound is one-sided.' },
    { id: 'qvw-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'wkb quantisation',
      q: 'Which WKB quantisation rules are correct ($n = 0, 1, 2, \\dots$)?',
      options: ['Two soft turning points: $\\int_a^bp\\,dx = (n + \\tfrac12)\\pi\\hbar$.', 'One soft turning point and one infinite wall: $\\int_a^bp\\,dx = (n + \\tfrac34)\\pi\\hbar$.', 'Two infinite walls: $\\int_a^bp\\,dx = (n + 1)\\pi\\hbar$.', 'For the flat-bottomed infinite square well these rules give only approximate levels.'], answer: [0, 1, 2],
      sol: 'Each soft turning point contributes $\\pi/4$ of phase and each hard wall $\\pi/2$, so the totals are $\\pi/2$, $3\\pi/4$ and $\\pi$ beyond $n\\pi$. For the square well, $\\int p\\,dx = pa = (n + 1)\\pi\\hbar$ gives the exact levels.' },
    { id: 'qvw-040', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'tunnelling',
      q: 'An alpha particle hits the barrier of its nucleus $10^{21}$ times per second, and the WKB exponent for each attempt is $2\\int\\kappa\\,dx = 80$. Taking the decay rate as (attempt frequency)$\\times e^{-80}$, $\\log_{10}$ of the half-life in seconds is ______ (to two decimal places).',
      answer: 13.59, tol: 0.02, calc: () => Math.log10(Math.LN2) - 21 + 80 * Math.LOG10E,
      sol: 'Rate $\\Gamma = 10^{21}e^{-80}$ s$^{-1}$ and $t_{1/2} = \\ln2/\\Gamma$. $\\log_{10}t_{1/2} = \\log_{10}0.693 - 21 + 80\\log_{10}e = -0.159 - 21 + 34.744 = 13.59$ (about a million years). Changing the exponent by 10% (to 88) changes the half-life by a factor $e^8 \\approx 3000$: the Geiger-Nuttall law.' },
    { id: 'qvw-042', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'double well',
      q: 'In a symmetric double well, each well alone has vibration quantum $\\hbar\\omega = 0.10$ eV, and the WKB barrier integral at the ground energy is $\\theta = \\int\\kappa\\,dx = 5.0$. The tunnelling splitting $\\Delta E \\approx \\dfrac{\\hbar\\omega}{\\pi}e^{-\\theta}$ is ______ meV (to three decimal places).',
      answer: 0.214, tol: 0.002, calc: () => 100 / Math.PI * Math.exp(-5),
      sol: '$\\Delta E = \\tfrac{0.10}{\\pi}e^{-5}$ eV $= 0.0318\\times0.00674$ eV $= 2.14\\times10^{-4}$ eV $= 0.214$ meV. A particle put in one well moves to the other in a time $\\pi\\hbar/\\Delta E$ (as in the ammonia inversion line), and the splitting depends on $e^{-\\theta}$, not $e^{-2\\theta}$, because it is an amplitude effect.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'qvw-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'tunnelling',
      make(r) {
        const who = choose(r, ['electron', 'electron', 'proton']), dV = choose(r, [0.5, 1, 2, 3, 5]), L = choose(r, [0.2, 0.3, 0.5, 0.8, 1]);
        const kap = K1 * Math.sqrt(dV * (who === 'proton' ? 1836.15 : 1)), ex = 2 * kap * L, T = Math.exp(-ex);
        return { q: `A${who === 'electron' ? 'n' : ''} ${who} meets a rectangular barrier $${dV}$ eV above its energy and $${L}$ nm wide. Using $T \\approx e^{-2\\kappa L}$, $-\\ln T =$ ______ (to one decimal place). Use $\\sqrt{2m_e\\cdot1\\ \\text{eV}}/\\hbar = 5.123$ nm$^{-1}$${who === 'proton' ? ' and $m_p = 1836\\,m_e$' : ''}.`,
          answer: round(ex, 1), tol: Math.max(0.1, ex * 0.003), who, dV, L,
          sol: `$\\kappa = 5.123\\sqrt{${dV}${who === 'proton' ? '\\times1836' : ''}}$ nm$^{-1}$ $= ${round(kap, 3)}$ nm$^{-1}$. $2\\kappa L = ${round(ex, 1)}$, so $T \\approx ${who === 'proton' ? 'e^{-' + round(ex, 0) + '}' : round(T, 6)}$${who === 'proton' ? ': protons hardly tunnel through nanometre barriers' : ''}.` };
      },
      verify: (p) => 2 * K1 * Math.sqrt(p.dV * (p.who === 'proton' ? 1836.15 : 1)) * p.L },
    { id: 'qvw-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium',
      make(r) {
        const Z = int(r, 2, 8), ask = choose(r, ['zeta', 'energy']);
        const zeta = Z - 5 / 16, E = -2 * zeta * zeta * 13.6;
        const el = { 2: 'He', 3: 'Li$^{+}$', 4: 'Be$^{2+}$', 5: 'B$^{3+}$', 6: 'C$^{4+}$', 7: 'N$^{5+}$', 8: 'O$^{6+}$' }[Z];
        return { q: `For the two-electron ion ${el} ($Z = ${Z}$), the trial function $e^{-\\zeta(r_1 + r_2)/a_0}$ gives $\\langle H\\rangle = \\left(2\\zeta^2 - 4Z\\zeta + \\tfrac54\\zeta\\right)$ Ry. ${ask === 'zeta' ? 'The best $\\zeta$ is ______ (to four decimal places).' : 'The best variational energy is ______ eV (to one decimal place; $1$ Ry $= 13.6$ eV).'}`,
          answer: ask === 'zeta' ? round(zeta, 4) : round(E, 1), tol: ask === 'zeta' ? 0.0005 : Math.max(0.1, Math.abs(E) * 0.002), Z, ask,
          sol: `$d\\langle H\\rangle/d\\zeta = 4\\zeta - 4Z + \\tfrac54 = 0$, so $\\zeta = Z - \\tfrac{5}{16} = ${round(zeta, 4)}$. Then $\\langle H\\rangle = -2\\zeta^2$ Ry $= ${round(E, 1)}$ eV. The screening $\\tfrac5{16}$ is the same for every $Z$; its relative effect shrinks as $Z$ grows.` };
      },
      verify: (p) => (p.ask === 'zeta' ? p.Z - 5 / 16 : -2 * (p.Z - 5 / 16) ** 2 * 13.6) },
    { id: 'qvw-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear variation',
      make(r) {
        const a = int(r, -4, 0), b = a + int(r, 1, 5), v = choose(r, [0.3, 0.5, 0.8, 1, 1.5]);
        const E = (a + b) / 2 - Math.sqrt(((b - a) / 2) ** 2 + v * v);
        return { q: `A trial state $c_1\\phi_1 + c_2\\phi_2$ uses orthonormal functions with $H_{11} = ${a}$ eV, $H_{22} = ${b}$ eV and $H_{12} = H_{21} = ${v}$ eV. The best (Rayleigh-Ritz) estimate of the ground-state energy is ______ eV (to three decimal places).`,
          answer: round(E, 3), tol: 0.002, a, b, v,
          sol: `Minimising $\\langle H\\rangle$ over $c_1, c_2$ gives the secular equation $\\det(H - E) = 0$, whose lower root is $\\tfrac{${a} + ${b}}{2} - \\sqrt{\\left(\\tfrac{${b - a}}{2}\\right)^2 + ${v}^2} = ${round(E, 3)}$ eV, below the better single function ($${a}$ eV).` };
      },
      verify: (p) => (p.a + p.b) / 2 - Math.hypot((p.b - p.a) / 2, p.v) },
    { id: 'qvw-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      make(r) {
        const n = int(r, 1, 4);
        const scale = Math.cbrt(1.67493e-27 * 9.81 ** 2 * 1.054572e-34 ** 2 / 2) / 1.602177e-19 * 1e12; // peV
        const v = Math.pow(1.5 * Math.PI * (n - 0.25), 2 / 3) * scale;
        return { q: `Ultracold neutrons bounce on a horizontal mirror in Earth's gravity ($g = 9.81$ m/s$^2$, $m_n = 1.675\\times10^{-27}$ kg). Using WKB with one hard wall and one soft turning point, the energy of level $n = ${n}$ is ______ peV (to two decimal places; $1$ peV $= 10^{-12}$ eV).`,
          answer: round(v, 2), tol: Math.max(0.01, v * 0.004), n,
          sol: `$\\int_0^{z_0}p\\,dz = (n - \\tfrac14)\\pi\\hbar$ gives $E_n = \\left[\\tfrac{3\\pi}{2}(n - \\tfrac14)\\right]^{2/3}\\left(\\tfrac12mg^2\\hbar^2\\right)^{1/3}$. The energy scale $(\\tfrac12mg^2\\hbar^2)^{1/3} = ${round(scale, 3)}$ peV and the coefficient is $${round(Math.pow(1.5 * Math.PI * (n - 0.25), 2 / 3), 3)}$, so $E_${n} = ${round(v, 2)}$ peV. (These quantum bouncing states have been measured.)` };
      },
      verify: (p) => Math.pow(1.5 * Math.PI * (p.n - 0.25), 2 / 3) * Math.cbrt(1.67493e-27 * 96.2361 * 1.054572e-34 ** 2 / 2) / 1.602177e-19 * 1e12 },
    { id: 'qvw-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trial functions',
      make(r) {
        const F = choose(r, [0.5, 1, 2, 5, 10]); // eV/nm
        const v = 3 * Math.pow(1 / (2 * Math.sqrt(2 * Math.PI)), 2 / 3) * Math.cbrt(U * F * F) * 1000;
        return { q: `An electron moves in $V = F|x|$ with $F = ${F}$ eV/nm. Using a Gaussian trial function $e^{-\\beta x^2}$ (for which $\\langle p^2\\rangle = \\hbar^2\\beta$ and $\\langle|x|\\rangle = 1/\\sqrt{2\\pi\\beta}$), the best variational energy is ______ meV (to one decimal place). Use $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(v, 1), tol: Math.max(0.1, v * 0.003), F,
          sol: `With $u = \\hbar^2/2m$: $E(\\beta) = u\\beta + F/\\sqrt{2\\pi\\beta}$. $dE/d\\beta = 0$ gives $u\\beta = \\tfrac12F/\\sqrt{2\\pi\\beta}$, so $E = 3u\\beta$ with $\\beta^{3/2} = F/(2\\sqrt{2\\pi}u)$. This gives $E = 3\\left(\\tfrac{1}{2\\sqrt{2\\pi}}\\right)^{2/3}(uF^2)^{1/3} = 1.024\\,(uF^2)^{1/3}$, and $(uF^2)^{1/3} = ${round(Math.cbrt(U * F * F) * 1000, 1)}$ meV, so $E = ${round(v, 1)}$ meV (exact coefficient 1.019).` };
      },
      verify: (p) => 1.02418 * Math.cbrt(U * p.F * p.F) * 1000 },
    { id: 'qvw-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      make(r) {
        const n = int(r, 0, 6);
        const v = Math.pow(0.75 * Math.PI * (n + 0.5), 2 / 3);
        return { q: `For $V = F|x|$, WKB gives $E_n = c_n(\\hbar^2F^2/2m)^{1/3}$. The value of $c_{${n}}$ is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.003, n,
          sol: `$\\int_{-E/F}^{E/F}\\sqrt{2m(E - F|x|)}\\,dx = \\tfrac{4\\sqrt{2m}}{3F}E^{3/2} = (n + \\tfrac12)\\pi\\hbar$, so $c_n = \\left[\\tfrac{3\\pi}{4}(n + \\tfrac12)\\right]^{2/3} = (${round(0.75 * Math.PI * (n + 0.5), 4)})^{2/3} = ${round(v, 3)}$. WKB improves with $n$.` };
      },
      verify: (p) => Math.pow(0.75 * Math.PI * (p.n + 0.5), 2 / 3) },
    { id: 'qvw-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wkb quantisation',
      make(r) {
        const k = choose(r, [1, 2, 4, 6]), n1 = int(r, 2, 8), n2 = n1 + int(r, 2, 12);
        const p = 2 * k / (k + 2), v = ((n2 + 0.5) / (n1 + 0.5)) ** p;
        return { q: `In the potential $V = c|x|^{${k}}$, use WKB scaling to find the ratio $E_{${n2}}/E_{${n1}}$ ______ (to three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, v * 0.001), k, n1, n2,
          sol: `$\\int p\\,dx \\propto E^{1/2 + 1/k}$, so $E_n \\propto (n + \\tfrac12)^{2k/(k+2)} = (n + \\tfrac12)^{${round(p, 4)}}$. Ratio $(${n2 + 0.5}/${n1 + 0.5})^{${round(p, 4)}} = ${round(v, 3)}$.${k === 2 ? ' For the oscillator this is simply the ratio of $n + \\tfrac12$.' : ''}` };
      },
      verify: (p) => ((p.n2 + 0.5) / (p.n1 + 0.5)) ** (2 * p.k / (p.k + 2)) },
    { id: 'qvw-g08', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wkb quantisation',
      make(r) {
        const cases = [
          ['a particle on a hard floor under gravity, $V = mgz$ for $z > 0$', '$(n + \\tfrac34)\\pi\\hbar$', 'one hard wall (phase $\\pi/2$) and one soft turning point ($\\pi/4$)'],
          ['a particle between two hard walls with a sloping floor between them', '$(n + 1)\\pi\\hbar$', 'two hard walls, $\\pi/2$ each'],
          ['an anharmonic well $V = \\lambda x^4$', '$(n + \\tfrac12)\\pi\\hbar$', 'two soft turning points, $\\pi/4$ each'],
          ['the half oscillator, $V = \\tfrac12m\\omega^2x^2$ for $x > 0$ with a wall at $x = 0$', '$(n + \\tfrac34)\\pi\\hbar$', 'one hard wall and one soft turning point'],
          ['the linear well $V = F|x|$', '$(n + \\tfrac12)\\pi\\hbar$', 'two soft turning points'],
        ];
        const [what, right, why] = choose(r, cases);
        const o = mcqOptions(r, right, ['$(n + \\tfrac12)\\pi\\hbar$', '$(n + \\tfrac34)\\pi\\hbar$', '$(n + 1)\\pi\\hbar$', '$(n + \\tfrac14)\\pi\\hbar$'].filter((s) => s !== right));
        return { q: `For ${what}, the WKB condition is $\\int_a^bp\\,dx =$ ($n = 0, 1, 2, \\dots$; $a$, $b$ the ends of the classical motion)`, ...o,
          sol: `Count the phase lost at each end: ${why}. Adding $n\\pi$ gives ${right}.` };
      } },
    { id: 'qvw-g09', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'double well',
      make(r) {
        const hw = choose(r, [0.05, 0.1, 0.2, 0.4]), th = choose(r, [3, 4, 5, 6, 8, 10]);
        const v = hw / Math.PI * Math.exp(-th) * 1000;
        return { q: `In a symmetric double well, each well has $\\hbar\\omega = ${hw}$ eV and the barrier integral is $\\theta = \\int\\kappa\\,dx = ${th}$. Estimate the tunnelling splitting $\\Delta E = (\\hbar\\omega/\\pi)e^{-\\theta}$ in meV: ______ (to three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.001, v * 0.005), hw, th,
          sol: `$\\Delta E = \\tfrac{${hw}}{\\pi}e^{-${th}}$ eV $= ${round(hw / Math.PI, 5)}\\times${round(Math.exp(-th), 6)}$ eV $= ${round(v, 3)}$ meV. The two lowest states are the even and odd combinations of the single-well states.` };
      },
      verify: (p) => p.hw / Math.PI * Math.exp(-p.th) * 1000 },
    { id: 'qvw-g10', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'tunnelling',
      make(r) {
        const f = choose(r, [1e20, 1e21, 5e21]), G = int(r, 60, 110);
        const v = Math.log10(Math.LN2 / f) + G * Math.LOG10E;
        const fs = f === 5e21 ? '5\\times10^{21}' : `10^{${Math.round(Math.log10(f))}}`;
        return { q: `An alpha particle strikes its nuclear barrier $${fs}$ times per second, with WKB exponent $2\\int\\kappa\\,dx = ${G}$ per attempt. With decay rate $f e^{-${G}}$, $\\log_{10}(t_{1/2}/\\text{s})$ is ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.02, f, G,
          sol: `$t_{1/2} = \\ln2/(fe^{-G})$, so $\\log_{10}t_{1/2} = \\log_{10}(0.6931/${fs}) + ${G}\\times0.4343 = ${round(Math.log10(Math.LN2 / f), 3)} + ${round(G * Math.LOG10E, 3)} = ${round(v, 2)}$.` };
      },
      verify: (p) => Math.log10(Math.LN2) - Math.log10(p.f) + p.G / Math.LN10 },
    { id: 'qvw-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'tunnelling',
      make(r) {
        const W = choose(r, [2, 3, 4, 4.5, 5]), E = choose(r, [0.5, 1, 2, 3, 5]); // E in V/nm
        const v = (4 / 3) * K1 * Math.sqrt(W) * W / E;
        return { q: `Field emission: electrons leave a metal of work function $${W}$ eV through the triangular barrier made by a field of $${E}\\times10^9$ V/m. The WKB exponent $\\tfrac43\\sqrt{2m\\Phi}\\,\\Phi/(\\hbar e\\mathcal E)$ is ______ (to one decimal place). Use $\\sqrt{2m_e\\cdot1\\ \\text{eV}}/\\hbar = 5.123$ nm$^{-1}$.`,
          answer: round(v, 1), tol: Math.max(0.1, v * 0.003), W, E,
          sol: `$\\sqrt{2m\\Phi}/\\hbar = 5.123\\sqrt{${W}} = ${round(K1 * Math.sqrt(W), 3)}$ nm$^{-1}$; the barrier is $\\Phi/e\\mathcal E = ${round(W / E, 3)}$ nm wide at the Fermi level. Exponent $\\tfrac43\\times${round(K1 * Math.sqrt(W), 3)}\\times${round(W / E, 3)} = ${round(v, 1)}$.` };
      },
      verify: (p) => (4 / 3) * K1 * Math.pow(p.W, 1.5) / p.E },
    { id: 'qvw-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'trial functions',
      make(r) {
        const a = choose(r, [0.05, 0.1, 0.2, 0.3]), which = choose(r, ['var', 'exact']);
        const v = (which === 'var' ? -a * a / (2 * Math.PI * U) : -a * a / (4 * U)) * 1000;
        return { q: `An electron is bound by $V = -\\alpha\\delta(x)$ with $\\alpha = ${a}$ eV nm. ${which === 'var' ? 'Using a Gaussian trial function, the best variational energy $-m\\alpha^2/\\pi\\hbar^2$' : 'The exact bound-state energy $-m\\alpha^2/2\\hbar^2$'} is ______ meV (to two decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(v, 2), tol: Math.max(0.01, Math.abs(v) * 0.003), a, which,
          sol: `$m/\\hbar^2 = 1/(2\\times0.0381)$ eV$^{-1}$ nm$^{-2}$. ${which === 'var' ? `$-m\\alpha^2/\\pi\\hbar^2 = -\\alpha^2/(2\\pi\\times0.0381) = ${round(v, 2)}$ meV` : `$-m\\alpha^2/2\\hbar^2 = -\\alpha^2/(4\\times0.0381) = ${round(v, 2)}$ meV`}. The Gaussian estimate is $2/\\pi$ of the exact binding: an upper bound on the energy.` };
      },
      verify: (p) => (p.which === 'var' ? -(p.a ** 2) / (2 * Math.PI * U) : -(p.a ** 2) / (4 * U)) * 1000 },
    ...more,
    ...r4.gens,
  ],
};
