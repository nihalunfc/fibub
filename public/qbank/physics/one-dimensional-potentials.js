// One-dimensional potentials at MSc level: delta wells and barriers, the finite square well (even and odd states,
// graphical solution, counting bound states), steps and barriers above the top, transmission resonances,
// the Ramsauer effect, double delta wells, parity and matching conditions. (Basics: schrodinger-equation topic.)
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './one-dimensional-potentials.more.gen.js';
import more2 from './one-dimensional-potentials.more2.gen.js';
import r4 from './one-dimensional-potentials.r4.gen.js';
import r5 from './one-dimensional-potentials.r5.gen.js';

const HB2M = 0.0381; // hbar^2 / (2 m_e) in eV nm^2

export default {
  topic: 'one-dimensional-potentials',
  items: [
    // ---------- level 1 ----------
    { id: 'q1d-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'matching conditions',
      q: 'At a point where the potential contains $-\\alpha\\,\\delta(x)$, the wavefunction of a stationary state',
      options: ['has both $\\psi$ and $d\\psi/dx$ continuous', 'is continuous, but its slope jumps', 'jumps, but its slope is continuous', 'jumps, and so does its slope'], answer: 1,
      sol: 'Integrate the Schrödinger equation from $-\\epsilon$ to $\\epsilon$: $-\\tfrac{\\hbar^2}{2m}[\\psi\'(0^+) - \\psi\'(0^-)] - \\alpha\\psi(0) = 0$ as $\\epsilon \\to 0$. So the slope jumps by $-\\tfrac{2m\\alpha}{\\hbar^2}\\psi(0)$, while $\\psi$ itself stays continuous (a jump in $\\psi$ would make $\\psi\'\'$ contain $\\delta\'$, which nothing can balance).' },
    { id: 'q1d-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'parity',
      q: 'For a potential with $V(-x) = V(x)$, the bound states (in order of increasing energy) are',
      options: ['all even', 'neither even nor odd in general', 'alternately even and odd, starting with an even ground state', 'alternately odd and even, starting with an odd ground state'], answer: 2,
      sol: '$H$ commutes with parity, and 1D bound states are non-degenerate, so each is even or odd. The ground state has no nodes, so it is even; each next state has one more node, so the parities alternate.' },
    { id: 'q1d-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'The number of bound states of a particle in the potential $V(x) = -\\alpha\\,\\delta(x)$, $\\alpha > 0$, is ______.',
      answer: 1, tol: 0,
      sol: 'For $E < 0$ the solution must be $Ae^{-\\kappa|x|}$ (even; an odd function would vanish at the delta and feel nothing, so it cannot be bound). The slope condition fixes $\\kappa = m\\alpha/\\hbar^2$ uniquely: exactly one bound state, however weak the well.' },
    { id: 'q1d-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'general properties',
      q: 'In one dimension, a bound-state energy level (for a potential without infinite barriers splitting space into separate pieces) is',
      options: ['non-degenerate', 'always doubly degenerate', 'degenerate only for even potentials', 'infinitely degenerate'], answer: 0,
      sol: 'If $\\psi_1$ and $\\psi_2$ both solve the equation with the same $E$, their Wronskian $\\psi_1\\psi_2\' - \\psi_2\\psi_1\'$ is constant; both vanish at infinity, so it is zero and $\\psi_2 \\propto \\psi_1$. Free particles (not bound) do have a two-fold degeneracy, $e^{\\pm ikx}$.' },
    { id: 'q1d-005', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'finite well',
      q: 'A particle moves in a finite square well, $V = -V_0$ for $|x| < a/2$ and $V = 0$ outside. Which statements are correct?',
      options: ['There is at least one bound state for any $V_0 > 0$.', 'The number of bound states grows with $V_0a^2$.', 'Every bound-state energy lies between $-V_0$ and $0$.', 'There is an odd bound state for every depth.'], answer: [0, 1, 2],
      sol: 'With $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar$, the even states start at $z_0 = 0$ (so one always exists) and the count is $1 + \\lfloor 2z_0/\\pi\\rfloor$, a function of $V_0a^2$. Bound energies lie above the bottom and below the top. The first odd state needs $z_0 \\ge \\pi/2$.' },
    { id: 'q1d-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'The bound state of a delta well is $\\psi = Ae^{-\\kappa|x|}$ with $A = 1$ nm$^{-1/2}$ and $\\kappa = 2$ nm$^{-1}$. The jump $\\psi\'(0^+) - \\psi\'(0^-)$ is ______ nm$^{-3/2}$.',
      answer: -4, tol: 0,
      sol: 'For $x > 0$, $\\psi\' = -\\kappa Ae^{-\\kappa x} \\to -\\kappa A$; for $x < 0$, $\\psi\' = +\\kappa Ae^{\\kappa x} \\to +\\kappa A$. The jump is $-2\\kappa A = -4$ nm$^{-3/2}$, and it must equal $-\\tfrac{2m\\alpha}{\\hbar^2}\\psi(0)$, which is how $\\kappa = m\\alpha/\\hbar^2$ comes out.' },

    // ---------- level 2 ----------
    { id: 'q1d-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'An electron is bound by $V = -\\alpha\\,\\delta(x)$ with $\\alpha = 0.381$ eV nm. Its wavefunction falls as $e^{-|x|/\\ell}$, with $\\ell =$ ______ nm. (Use $\\hbar^2/m_e = 0.0762$ eV nm².)',
      answer: 0.2, tol: 0.003, calc: () => 2 * HB2M / 0.381,
      sol: '$\\kappa = m\\alpha/\\hbar^2 = \\alpha/(\\hbar^2/m) = 0.381/0.0762 = 5.0$ nm$^{-1}$, so $\\ell = 1/\\kappa = 0.20$ nm. (The binding energy is $\\hbar^2\\kappa^2/2m = 0.0381\\times25 = 0.95$ eV.)' },
    { id: 'q1d-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'A repulsive delta potential $V = +\\alpha\\,\\delta(x)$, $\\alpha > 0$, has',
      options: ['exactly one bound state', 'one bound state for each energy', 'infinitely many bound states', 'no bound states'], answer: 3,
      sol: 'A bound state needs $E < 0$, but $V \\ge 0$ everywhere, so $\\langle H\\rangle = \\langle T\\rangle + \\langle V\\rangle > 0$ for any state. (Formally, the slope condition would need $\\kappa = -m\\alpha/\\hbar^2 < 0$, a growing exponential.)' },
    { id: 'q1d-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'finite well',
      q: 'For a finite square well of width $a$, as the depth $V_0 \\to \\infty$ the bound-state energies measured from the bottom of the well',
      options: ['approach $n^2\\pi^2\\hbar^2/2ma^2$ from below', 'approach $n^2\\pi^2\\hbar^2/2ma^2$ from above', 'approach zero', 'merge into a continuum'], answer: 0,
      sol: 'The wave leaks into the walls, so it is effectively in a slightly wider box and every level is slightly lower than the infinite-well value. As $V_0$ grows the leakage length $1/\\kappa$ shrinks to zero and the levels rise towards the infinite-well values.' },
    { id: 'q1d-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'steps',
      q: 'Particles of energy $E > 0$ move right and meet a step DOWN, from $V = 0$ to $V = -V_0$. Classically all of them carry on. Quantum mechanically',
      options: ['all of them carry on, as classically', 'all of them are reflected', 'some are reflected, with $R = \\left(\\dfrac{k_1 - k_2}{k_1 + k_2}\\right)^2$', 'some are reflected only if $E < V_0$'], answer: 2,
      sol: 'Matching $\\psi$ and $\\psi\'$ at the step needs a reflected wave whenever $k_1 \\ne k_2$, whichever way the step goes. Here $k_2 = \\sqrt{2m(E + V_0)}/\\hbar > k_1$, and $R$ has the same form as for a step up.',
      trap: 'Reflection is caused by a sudden change of wavelength, not by a wall in the way.' },
    { id: 'q1d-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'barriers',
      q: 'Particles with $E > V_0$ pass over a rectangular barrier of height $V_0$ and width $a$. They are transmitted with certainty ($T = 1$) when',
      options: ['$E = 2V_0$', '$E = V_0$', '$k_2a = (n + \\tfrac12)\\pi$, where $k_2 = \\sqrt{2m(E - V_0)}/\\hbar$', '$k_2a = n\\pi$, where $k_2 = \\sqrt{2m(E - V_0)}/\\hbar$'], answer: 3,
      sol: 'For $E > V_0$, $T^{-1} = 1 + \\dfrac{V_0^2\\sin^2(k_2a)}{4E(E - V_0)}$, so $T = 1$ when $\\sin(k_2a) = 0$: a whole number of half-wavelengths fits over the barrier, and the waves reflected from its two edges cancel. At $E = V_0$ exactly, $T < 1$.' },
    { id: 'q1d-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'probability current',
      q: 'For stationary states in one dimension, which statements about the probability current $j = \\dfrac{\\hbar}{m}\\mathrm{Im}(\\psi^*\\psi\')$ are correct?',
      options: ['$j$ is the same at every $x$.', '$j = 0$ for any real wavefunction (up to a constant phase).', 'A single decaying exponential $Ce^{-\\kappa x}$ carries a current.', '$j$ is continuous across a delta-function potential.'], answer: [0, 1, 3],
      sol: 'Stationarity and the continuity equation give $dj/dx = 0$. A real $\\psi$ makes $\\psi^*\\psi\'$ real. For $Ce^{-\\kappa x}$, $\\psi^*\\psi\' = -\\kappa|C|^2e^{-2\\kappa x}$ is real, so $j = 0$; a current inside a barrier needs both growing and decaying parts. At a delta, $\\psi$ is continuous and the slope jump is proportional to $\\psi$ itself, so $\\mathrm{Im}(\\psi^*\\psi\')$ does not jump.' },
    { id: 'q1d-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'nodes',
      q: 'A finite square well has exactly 6 bound states. The number of nodes of the highest bound state is ______.',
      answer: 5, tol: 0,
      sol: 'The $n$-th bound state (counting from $n = 1$) has $n - 1$ nodes. The sixth has 5. It is odd, because the parities alternate starting from an even ground state.' },
    { id: 'q1d-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'finite well',
      q: 'In the finite well $V = -V_0$ for $|x| < a/2$, with $k = \\sqrt{2m(E + V_0)}/\\hbar$ inside and $\\kappa = \\sqrt{-2mE}/\\hbar$ outside, the even bound states satisfy',
      options: ['$\\kappa = -k\\cot(ka/2)$', '$\\kappa = k\\tan(ka/2)$', '$k = \\kappa\\tan(ka/2)$', '$\\kappa = k\\cot(ka/2)$'], answer: 1,
      sol: 'Even: $\\psi = \\cos kx$ inside, $Ae^{-\\kappa x}$ outside. Matching the log-derivative $\\psi\'/\\psi$ at $x = a/2$: $-k\\tan(ka/2) = -\\kappa$. Odd states ($\\sin kx$) give $\\kappa = -k\\cot(ka/2)$.' },
    { id: 'q1d-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'For scattering from $V = \\alpha\\,\\delta(x)$, the transmission coefficient as the energy $E \\to 0$ tends to',
      options: ['$1$', '$1/2$', '$0$', 'a value that depends on the sign of $\\alpha$'], answer: 2,
      sol: '$T = \\left[1 + \\dfrac{m\\alpha^2}{2\\hbar^2E}\\right]^{-1}$, which goes to 0 as $E \\to 0$ and to 1 as $E \\to \\infty$. It depends on $\\alpha^2$, so a delta well and a delta barrier of the same strength transmit equally.' },
    { id: 'q1d-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'In the bound state of $V = -\\alpha\\,\\delta(x)$ (energy $E < 0$), the mean potential and kinetic energies are',
      options: ['$\\langle V\\rangle = 2E$, $\\langle T\\rangle = -E$', '$\\langle V\\rangle = E$, $\\langle T\\rangle = 0$', '$\\langle V\\rangle = E/2$, $\\langle T\\rangle = E/2$', '$\\langle V\\rangle = -E$, $\\langle T\\rangle = 2E$'], answer: 0,
      sol: '$\\langle V\\rangle = -\\alpha|\\psi(0)|^2 = -\\alpha\\kappa$ (normalised $\\psi = \\sqrt\\kappa e^{-\\kappa|x|}$), and $E = -\\hbar^2\\kappa^2/2m = -\\alpha\\kappa/2$ using $\\kappa = m\\alpha/\\hbar^2$. So $\\langle V\\rangle = 2E$ and $\\langle T\\rangle = E - \\langle V\\rangle = -E > 0$. This is the virial theorem for a potential of degree $-1$ ($\\delta(\\lambda x) = \\delta(x)/\\lambda$).',
      trap: 'Kinetic energy is always positive, which rules out the last option at once.' },
    { id: 'q1d-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'matching conditions',
      q: 'A particle is confined to $x > 0$ by an infinitely high wall at $x = 0$. Which conditions hold at the wall?',
      options: ['$\\psi(0) = 0$', '$\\psi\'$ is continuous at $x = 0$', '$\\psi\'(0^+)$ can be non-zero', 'The probability current at the wall is zero'], answer: [0, 2, 3],
      sol: 'Inside the wall $\\psi = 0$, and $\\psi$ must be continuous, so $\\psi(0) = 0$. The slope jumps from $0$ to $\\psi\'(0^+)$, allowed because $V$ is infinite there (as at the walls of an infinite well, where the slope of $\\sin(n\\pi x/L)$ is not zero). With $\\psi(0) = 0$, $j(0) = 0$.' },

    // ---------- level 3 ----------
    { id: 'q1d-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      q: 'An electron is in a finite square well of width $1.0$ nm. The smallest depth $V_0$ for which the well has three bound states is ______ eV. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 1.5, tol: 0.01, calc: () => HB2M * (2 * Math.PI / 1.0) ** 2,
      sol: 'The count is $1 + \\lfloor 2z_0/\\pi\\rfloor$ with $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar$. Three states need $z_0 \\ge \\pi$: $\\tfrac a2\\sqrt{V_0/0.0381} \\ge \\pi$, so $V_0 \\ge 0.0381(2\\pi/a)^2 = 0.0381\\times39.48 = 1.50$ eV.',
      trap: 'Using $z_0 \\ge 3\\pi/2$ (that gives four states) or forgetting the half-width in $z_0$.' },
    { id: 'q1d-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'Electrons of energy $0.50$ eV meet the barrier $V = \\alpha\\,\\delta(x)$ with $\\alpha = 0.20$ eV nm. The transmission coefficient is ______ (to three decimal places). (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.656, tol: 0.003, calc: () => 1 / (1 + 0.04 / (4 * HB2M * 0.5)),
      sol: '$T = \\left[1 + \\dfrac{m\\alpha^2}{2\\hbar^2E}\\right]^{-1}$, and $\\dfrac{m\\alpha^2}{2\\hbar^2E} = \\dfrac{\\alpha^2}{4(\\hbar^2/2m)E} = \\dfrac{0.04}{4\\times0.0381\\times0.50} = 0.525$. So $T = 1/1.525 = 0.656$.' },
    { id: 'q1d-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'A delta function $\\alpha\\,\\delta(x)$ is placed at the centre $x = 0$ of an infinite well $-L/2 < x < L/2$. Which states keep exactly their old energies?',
      options: ['The odd states', 'The even states', 'Only the ground state', 'None of them'], answer: 0,
      sol: 'Odd states vanish at $x = 0$, so the delta (which acts only through $\\psi(0)$) does not affect them: they still satisfy every condition with the same energy. Even states have $\\psi(0) \\ne 0$, and their slopes must jump, which shifts their energies (up for a barrier, down for a well).' },
    { id: 'q1d-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'barriers',
      q: 'Electrons with energy exactly equal to the barrier height $V_0 = 0.381$ eV meet a rectangular barrier of width $0.50$ nm. The transmission coefficient is ______ (to three decimal places). (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.615, tol: 0.003, calc: () => 1 / (1 + 0.381 * 0.25 / (4 * HB2M)),
      sol: 'Take $E \\to V_0$ in $T^{-1} = 1 + \\dfrac{V_0^2\\sin^2(k_2a)}{4E(E - V_0)}$: $\\sin^2(k_2a) \\approx k_2^2a^2 = \\tfrac{2m(E - V_0)}{\\hbar^2}a^2$, so $T^{-1} = 1 + \\dfrac{mV_0a^2}{2\\hbar^2} = 1 + \\dfrac{V_0a^2}{4(0.0381)} = 1 + \\dfrac{0.381\\times0.25}{0.1524} = 1.625$. $T = 0.615$.',
      trap: 'Using $T \\approx e^{-2\\kappa a}$: at $E = V_0$, $\\kappa = 0$ and the formula is meaningless.' },
    { id: 'q1d-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'barriers',
      q: 'Electrons pass over a rectangular barrier of height $1.0$ eV and width $0.50$ nm. The lowest energy at which the barrier is perfectly transparent is ______ eV. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 2.5, tol: 0.01, calc: () => 1.0 + HB2M * (Math.PI / 0.5) ** 2,
      sol: 'Perfect transmission needs $k_2a = n\\pi$ with $n \\ge 1$: $E - V_0 = \\dfrac{\\hbar^2}{2m}\\left(\\dfrac{n\\pi}{a}\\right)^2 = 0.0381\\times(2\\pi)^2 = 1.50$ eV for $n = 1$. So $E = 2.50$ eV.',
      trap: 'Forgetting to add $V_0$: the resonance condition fixes the kinetic energy above the barrier.' },
    { id: 'q1d-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'steps',
      q: 'Particles with $E > V_0$ meet a potential step of height $V_0$. Write $\\psi = Ae^{ik_1x} + Be^{-ik_1x}$ for $x < 0$ and $Ce^{ik_2x}$ for $x > 0$. Which statements are correct?',
      options: ['$R$ is the same for a step up and a step down with the same pair $k_1, k_2$.', 'For a step up, $|C/A|^2$ exceeds 1.', '$R \\to 0$ as $E/V_0 \\to \\infty$.', '$R$ depends on $\\hbar$ and $m$ separately, not only on $E/V_0$.'], answer: [0, 1, 2],
      sol: '$R = \\left(\\tfrac{k_1 - k_2}{k_1 + k_2}\\right)^2$ is symmetric in $k_1, k_2$, and depends only on $k_2/k_1 = \\sqrt{1 - V_0/E}$. $C/A = 2k_1/(k_1 + k_2) > 1$ when $k_2 < k_1$; but $T = (k_2/k_1)|C/A|^2 = 4k_1k_2/(k_1+k_2)^2 \\le 1$ because the slower wave carries less current per unit density.',
      trap: 'Taking $|C/A|^2$ as the transmission coefficient: transmission is a ratio of currents, not of densities.' },
    { id: 'q1d-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      q: 'A finite square well has $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar = 4$. Its bound states are',
      options: ['1 even and 2 odd', '2 even and 2 odd', '3 even and none odd', '2 even and 1 odd'], answer: 3,
      sol: 'Graphically, even states come from the branches of $\\tan z$ starting at $z = 0, \\pi, 2\\pi, \\dots$ and odd states from those of $-\\cot z$ starting at $\\pi/2, 3\\pi/2, \\dots$, each branch giving a state if it starts below $z_0$. With $z_0 = 4$: even branches at $0$ and $\\pi = 3.14$; odd branch at $\\pi/2 = 1.57$ (the next, $3\\pi/2 = 4.71$, is too high). Total $1 + \\lfloor 8/\\pi\\rfloor = 3$.' },
    { id: 'q1d-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'The bound state $\\psi \\propto e^{-\\kappa|x|}$ of a delta well has a momentum distribution $|\\phi(p)|^2$ of the form',
      options: ['$\\propto e^{-p^2/\\hbar^2\\kappa^2}$', '$\\propto \\dfrac{1}{(p^2 + \\hbar^2\\kappa^2)^2}$', 'uniform up to $|p| = \\hbar\\kappa$, zero beyond', '$\\propto e^{-|p|/\\hbar\\kappa}$'], answer: 1,
      sol: '$\\int e^{-\\kappa|x|}e^{-ipx/\\hbar}dx = \\dfrac{2\\kappa}{\\kappa^2 + p^2/\\hbar^2}$, a Lorentzian in $p$. Its square falls as $p^{-4}$; the cusp of $\\psi$ at $x = 0$ is what produces the slow fall-off at large momentum.',
      trap: 'Squaring is easy to forget: $\\phi(p)$ itself is a Lorentzian; the probability density is its square.' },
    { id: 'q1d-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wells above the top',
      q: 'Electrons with $E > 0$ pass over a square well of depth $1.0$ eV and width $0.50$ nm. The lowest such energy at which they are transmitted with certainty is ______ eV. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.504, tol: 0.005, calc: () => HB2M * (Math.PI / 0.5) ** 2 - 1.0,
      sol: 'Over the well $k_2 = \\sqrt{2m(E + V_0)}/\\hbar$, and $T = 1$ when $k_2a = n\\pi$. $n = 1$: $E + V_0 = 0.0381(\\pi/0.50)^2 = 1.504$ eV, so $E = 0.504$ eV, which is positive, so it is allowed. This is the Ramsauer-Townsend effect: slow electrons cross some atoms almost without scattering.',
      trap: 'Using $E - V_0$ (a barrier) instead of $E + V_0$ (a well).' },
    { id: 'q1d-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      q: 'An electron moves in $V = \\infty$ for $x < 0$, $V = -V_0$ for $0 < x < 0.50$ nm and $V = 0$ beyond. The smallest $V_0$ for which a bound state exists is ______ eV. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.376, tol: 0.003, calc: () => HB2M * (Math.PI / (2 * 0.5)) ** 2,
      sol: 'The wall forces $\\psi(0) = 0$, so the states are the odd states of a symmetric well of width $2a$. The first odd state needs $z_0 = a\\sqrt{2mV_0}/\\hbar \\ge \\pi/2$, i.e. $V_0 \\ge \\dfrac{\\hbar^2}{2m}\\left(\\dfrac{\\pi}{2a}\\right)^2 = 0.0381\\times\\pi^2 = 0.376$ eV.',
      trap: 'Saying "a well always has a bound state": that is true for a symmetric 1D well, not for one next to a hard wall (which behaves like 3D s-waves).' },
    { id: 'q1d-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      q: 'As the depth $V_0$ of a finite well grows (width fixed), the distance $1/\\kappa$ that the ground state leaks into the walls',
      options: ['grows without limit', 'stays the same', 'shrinks, roughly as $\\hbar/\\sqrt{2mV_0}$ for deep wells', 'shrinks to zero at a finite depth'], answer: 2,
      sol: 'For a deep well the ground state sits near the bottom, so $-E \\approx V_0$ and $\\kappa = \\sqrt{-2mE}/\\hbar \\approx \\sqrt{2mV_0}/\\hbar$. The leakage shrinks smoothly and vanishes only in the limit $V_0 \\to \\infty$.' },
    { id: 'q1d-036', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      q: 'A finite square well has $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar = 5$. The number of bound states is ______.',
      answer: 4, tol: 0,
      sol: 'Count $= 1 + \\lfloor 2z_0/\\pi\\rfloor = 1 + \\lfloor 3.18\\rfloor = 4$: branches start at $0, \\pi/2, \\pi, 3\\pi/2$ (all below 5), while the next, $2\\pi = 6.28$, is above.' },

    // ---------- level 4 ----------
    { id: 'q1d-028', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'finite well',
      q: 'An electron is in a very shallow square well, depth $0.020$ eV and width $0.50$ nm. Treating it as a delta well of the same area, $\\alpha = V_0a$, its bound-state energy is ______ meV. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: -0.66, tol: 0.04, calc: () => -1000 * (0.02 * 0.5) ** 2 / (4 * HB2M),
      sol: 'Here $z_0 = 0.25\\sqrt{0.020/0.0381} = 0.18 \\ll 1$, so the well is shallow and the wavefunction is much wider than the well: it sees only the area $\\alpha = V_0a = 0.010$ eV nm. $E = -\\dfrac{m\\alpha^2}{2\\hbar^2} = -\\dfrac{\\alpha^2}{4(\\hbar^2/2m)} = -\\dfrac{10^{-4}}{0.1524}$ eV $= -0.66$ meV. (Solving the even-state equation exactly gives $-0.63$ meV.)',
      trap: 'Using the infinite-well formula for a well this shallow; the state is barely bound and mostly outside.' },
    { id: 'q1d-029', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'Two delta wells $-\\alpha[\\delta(x - d) + \\delta(x + d)]$ have an even ground state satisfying $\\kappa(1 + \\tanh\\kappa d) = 2m\\alpha/\\hbar^2$. As $d \\to 0$, the ground-state energy tends to',
      options: ['four times that of a single well $-\\alpha\\delta(x)$', 'twice that of a single well', 'that of a single well', 'zero'], answer: 0,
      sol: 'As $d \\to 0$, $\\tanh\\kappa d \\to 0$ and $\\kappa = 2m\\alpha/\\hbar^2$, twice the single-well value $m\\alpha/\\hbar^2$. Since $E \\propto -\\kappa^2$, the energy is four times as deep: the two wells merge into one of strength $2\\alpha$, and $E \\propto \\alpha^2$. As $d \\to \\infty$, $\\tanh \\to 1$ and the single-well value returns.',
      trap: 'Adding the strengths and forgetting that the energy goes as the square of the strength.' },
    { id: 'q1d-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'A delta barrier $\\alpha\\,\\delta(x)$ sits at the centre of an infinite well $-L/2 < x < L/2$ whose ground-state energy without it is $E_1$. As $\\alpha \\to \\infty$, the ground-state energy tends to',
      options: ['$E_1$', '$2E_1$', '$4E_1$', 'infinity'], answer: 2,
      sol: 'An infinitely strong barrier forces $\\psi(0) = 0$, cutting the well into two halves of width $L/2$, each with ground energy $4E_1$. Equivalently, the even ground state is pushed up until it is degenerate with the unaffected odd state $n = 2$ (energy $4E_1$).' },
    { id: 'q1d-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'Electrons meet a delta barrier $\\alpha\\,\\delta(x)$ with $\\alpha = 0.20$ eV nm. At what energy are reflection and transmission equally likely? ______ eV (to three decimal places). (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.262, tol: 0.003, calc: () => 0.04 / (4 * HB2M),
      sol: '$T = 1/2$ when $\\dfrac{m\\alpha^2}{2\\hbar^2E} = 1$, i.e. $E = \\dfrac{m\\alpha^2}{2\\hbar^2} = \\dfrac{\\alpha^2}{4(\\hbar^2/2m)} = \\dfrac{0.04}{0.1524} = 0.262$ eV. Curiously, this equals the binding energy of the delta well of the same strength.' },
    { id: 'q1d-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'finite well',
      q: 'For the finite well $V = -V_0$ for $|x| < a/2$, which statements are correct?',
      options: ['The ground-state energy measured from the bottom rises with $V_0$ towards the infinite-well value.', 'For a given particle, the number of bound states depends only on $V_0a^2$.', 'Outside, $\\psi \\propto e^{-\\kappa|x|}$ with $\\kappa = \\sqrt{2m|E|}/\\hbar$, where $E$ is measured from the top of the well.', 'The ground state has nodes at the edges $x = \\pm a/2$.'], answer: [0, 1, 2],
      sol: 'Deeper walls let less of the wave leak, so the effective width shrinks towards $a$ and the level (from the bottom) rises towards $\\pi^2\\hbar^2/2ma^2$. The single parameter $z_0 \\propto a\\sqrt{V_0}$ fixes the count. Outside, $V = 0$ and $E < 0$. The ground state is non-zero at the edges; only an infinite wall forces $\\psi = 0$.' },
    { id: 'q1d-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'barriers',
      q: 'Each of two identical delta barriers, alone, transmits a fraction $T_1 < 1$ at a given energy. Placed a distance $d$ apart, the pair',
      options: ['always transmits exactly $T_1^2$', 'can transmit with $T = 1$ at certain energies', 'always transmits less than $T_1$', 'always transmits $2T_1$'], answer: 1,
      sol: 'Waves bouncing between the barriers interfere. When the round trip matches the reflection phases, the reflected waves cancel and $T = 1$ (resonant tunnelling, as in a resonant tunnelling diode or a Fabry-Perot etalon). At other energies $T$ can be far below $T_1^2$. $T_1^2$ would be correct only if the waves added incoherently.' },
    { id: 'q1d-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'finite well',
      q: 'An electron is in a finite square well of width $1.0$ nm. For what depth $V_0$ does its ground state lie exactly halfway, at $E = -V_0/2$? ______ eV (to three decimal places). (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.188, tol: 0.003, calc: () => HB2M * Math.PI ** 2 / 2,
      sol: 'With $z = ka/2$ and $z_0^2 = z^2 + (\\kappa a/2)^2$, $E = -V_0/2$ means $k = \\kappa$. The even condition $\\kappa = k\\tan z$ then gives $\\tan z = 1$, $z = \\pi/4$ and $z_0 = \\sqrt2\\,z = \\pi\\sqrt2/4$. So $V_0 = \\dfrac{\\hbar^2}{2m}\\left(\\dfrac{2z_0}{a}\\right)^2 = 0.0381\\times\\dfrac{\\pi^2}{2} = 0.188$ eV.' },
    { id: 'q1d-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'delta potentials',
      q: 'A particle is in the bound state of $V = -\\alpha\\,\\delta(x)$. The probability of finding it in the classically forbidden region is',
      options: ['$0$', '$1/2$', '$1 - e^{-2}$', '$1$'], answer: 3,
      sol: 'The energy is negative, while $V = 0$ at every $x \\ne 0$. So $E < V$ everywhere except a single point, and the whole line is classically forbidden: the probability is 1. The particle is bound only by the slope jump at the origin.',
      trap: 'Reaching for $1 - e^{-2}$, the probability within one decay length, which answers a different question.' },

    // ---------- level 5 ----------
    { id: 'q1d-037', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'delta potentials',
      q: 'An electron moves in two delta wells $-\\alpha[\\delta(x - d) + \\delta(x + d)]$ with $\\alpha = 0.381$ eV nm. The odd state is bound only if the separation $2d$ exceeds ______ nm. (Use $\\hbar^2/2m_e = 0.0381$ eV nm².)',
      answer: 0.2, tol: 0.003, calc: () => 2 * HB2M / 0.381,
      sol: 'Odd state: $\\sinh\\kappa x$ between the wells, $\\pm Ae^{-\\kappa|x|}$ outside. The slope jump at $x = d$ gives $\\kappa(1 + \\coth\\kappa d) = g$ with $g = 2m\\alpha/\\hbar^2 = \\alpha/0.0381 = 10$ nm$^{-1}$. The left side decreases to $1/d$ as $\\kappa \\to 0$, so a root exists only if $g > 1/d$, i.e. $d > 0.10$ nm and $2d > 0.20$ nm.',
      trap: 'Answering 0.1 nm: the question asks for the separation $2d$.' },
    { id: 'q1d-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'sudden change',
      q: 'A particle is in the bound state of $-\\alpha\\,\\delta(x)$. The strength suddenly doubles to $-2\\alpha\\,\\delta(x)$. The probability that the particle remains bound is ______ (to three decimal places).',
      answer: 0.889, tol: 0.003, calc: () => 8 / 9,
      sol: 'The state does not change during a sudden change. Old: $\\sqrt\\kappa e^{-\\kappa|x|}$; new bound state: $\\sqrt{2\\kappa}e^{-2\\kappa|x|}$ (the only one). Overlap: $\\sqrt{2}\\,\\kappa\\int e^{-3\\kappa|x|}dx = \\sqrt2\\kappa\\cdot\\tfrac{2}{3\\kappa} = \\tfrac{2\\sqrt2}{3}$. Probability $= 8/9 = 0.889$; the rest goes into the continuum.' },
    { id: 'q1d-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'scattering',
      q: 'Compare scattering from an attractive delta well $-\\alpha\\delta(x)$ and a repulsive delta barrier $+\\alpha\\delta(x)$ of the same $\\alpha$. Which statements are correct?',
      options: ['Their transmission coefficients are equal at every energy.', 'Their reflection amplitudes have different phases.', 'The transmission amplitude of the well, continued to imaginary $k$, has a pole at the bound-state energy $-m\\alpha^2/2\\hbar^2$.', 'The well reflects more strongly than the barrier.'], answer: [0, 1, 2],
      sol: 'With signed strength $\\alpha_s$, $t = 1/(1 + i\\beta)$ and $r = -i\\beta/(1 + i\\beta)$, $\\beta = m\\alpha_s/\\hbar^2k$. $|t|^2 = 1/(1 + \\beta^2)$ depends on $\\alpha_s^2$, so the transmission is the same; $r$ changes phase with the sign of $\\beta$. For the well, $1 - im\\alpha/\\hbar^2k = 0$ at $k = im\\alpha/\\hbar^2$, i.e. $E = \\hbar^2k^2/2m = -m\\alpha^2/2\\hbar^2$: bound states appear as poles of the scattering amplitude.' },
    { id: 'q1d-040', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'delta potentials',
      q: 'A strong delta barrier $\\alpha\\,\\delta(x)$ sits at the centre of an infinite well $-L/2 < x < L/2$ (ground energy $E_1$ without it). For large $\\alpha$ the two lowest levels are close to $4E_1$. Their splitting is approximately',
      options: ['$\\dfrac{8\\hbar^2E_1}{m\\alpha L}$', '$\\dfrac{16\\hbar^2E_1}{m\\alpha L}$', '$4E_1e^{-m\\alpha L/\\hbar^2}$', '$\\dfrac{\\hbar^2E_1}{m\\alpha L}$'], answer: 1,
      sol: 'The odd state stays at $4E_1$. Even states: $\\psi = \\sin k(L/2 - |x|)$; the slope jump gives $\\tan(kL/2) = -2k/g$ with $g = 2m\\alpha/\\hbar^2$. For large $g$, $kL/2 = \\pi - \\delta$ with $\\delta \\approx 2k/g \\approx 4\\pi/gL$. Then $E = 4E_1(1 - \\delta/\\pi)^2 \\approx 4E_1(1 - 8/gL)$, so the splitting is $32E_1/gL = 16\\hbar^2E_1/m\\alpha L$, falling as $1/\\alpha$ (a delta barrier has no thickness, so there is no exponential).',
      trap: 'Expecting an exponentially small splitting, which belongs to thick barriers with $\\kappa a \\gg 1$.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'q1d-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      make(r) {
        const alpha = choose(r, [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.762]);
        const ell = 2 * HB2M / alpha;
        return { q: `An electron is bound by $V = -\\alpha\\,\\delta(x)$ with $\\alpha = ${alpha}$ eV nm. Its wavefunction falls off as $e^{-|x|/\\ell}$ with $\\ell =$ ______ nm (to three decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(ell, 3), tol: Math.max(0.002, round(ell * 0.01, 3)), alpha,
          sol: `$\\kappa = m\\alpha/\\hbar^2 = \\alpha/(2\\times0.0381) = ${round(1 / ell, 3)}$ nm$^{-1}$, so $\\ell = 1/\\kappa = ${round(ell, 3)}$ nm.` };
      },
      verify: (p) => 2 * HB2M / p.alpha },
    { id: 'q1d-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'delta potentials',
      make(r) {
        const alpha = choose(r, [0.05, 0.08, 0.12, 0.15, 0.2, 0.25, 0.3]);
        const E = 1000 * alpha * alpha / (4 * HB2M);
        return { q: `An electron is bound by $V = -\\alpha\\,\\delta(x)$ with $\\alpha = ${alpha}$ eV nm. Its binding energy is ______ meV (to one decimal place). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(E, 1), tol: Math.max(0.1, round(E * 0.01, 1)), alpha,
          sol: `$|E| = \\dfrac{m\\alpha^2}{2\\hbar^2} = \\dfrac{\\alpha^2}{4(\\hbar^2/2m)} = \\dfrac{${alpha}^2}{0.1524}$ eV $= ${round(E, 1)}$ meV.`,
          trap: 'Mixing up $\\hbar^2/m$ and $\\hbar^2/2m$ gives an answer off by a factor of 2.' };
      },
      verify: (p) => 1000 * p.alpha ** 2 / (4 * HB2M) },
    { id: 'q1d-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'delta potentials',
      make(r) {
        const alpha = choose(r, [0.1, 0.15, 0.2, 0.3, 0.4]), E = choose(r, [0.1, 0.2, 0.3, 0.5, 1.0, 2.0]);
        const x = alpha * alpha / (4 * HB2M * E), T = 1 / (1 + x);
        return { q: `Electrons of energy $${E}$ eV meet the delta barrier $${alpha}\\,\\text{eV nm}\\times\\delta(x)$. The transmission coefficient is ______ (to three decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(T, 3), tol: 0.003, alpha, E,
          sol: `$\\dfrac{m\\alpha^2}{2\\hbar^2E} = \\dfrac{\\alpha^2}{4(0.0381)E} = \\dfrac{${round(alpha * alpha, 4)}}{${round(4 * HB2M * E, 4)}} = ${round(x, 4)}$, so $T = 1/(1 + ${round(x, 4)}) = ${round(T, 3)}$.` };
      },
      verify: (p) => 1 / (1 + p.alpha ** 2 / (4 * HB2M * p.E)) },
    { id: 'q1d-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'barriers',
      make(r) {
        const V0 = choose(r, [0.2, 0.3, 0.5, 1.0, 1.5, 2.0]), a = choose(r, [0.2, 0.3, 0.4, 0.5, 0.8]);
        const x = V0 * a * a / (4 * HB2M), T = 1 / (1 + x);
        return { q: `Electrons with energy equal to the barrier height $V_0 = ${V0}$ eV meet a rectangular barrier of width $${a}$ nm. The transmission coefficient is ______ (to three decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(T, 3), tol: 0.003, V0, a,
          sol: `At $E = V_0$, $T^{-1} = 1 + \\dfrac{mV_0a^2}{2\\hbar^2} = 1 + \\dfrac{V_0a^2}{4(0.0381)} = 1 + ${round(x, 4)}$, so $T = ${round(T, 3)}$.`,
          trap: 'The thick-barrier formula $e^{-2\\kappa a}$ gives 1 here because $\\kappa = 0$; the exact limit is needed.' };
      },
      verify: (p) => 1 / (1 + p.V0 * p.a ** 2 / (4 * HB2M)) },
    { id: 'q1d-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'barriers',
      make(r) {
        const V0 = choose(r, [0.5, 1.0, 2.0, 3.0]), a = choose(r, [0.3, 0.5, 0.8, 1.0]), n = int(r, 1, 3);
        const E = V0 + HB2M * (n * Math.PI / a) ** 2;
        const ord = ['', 'lowest', 'second lowest', 'third lowest'][n];
        return { q: `Electrons pass over a rectangular barrier of height $${V0}$ eV and width $${a}$ nm. The ${ord} energy above the barrier at which it is perfectly transparent is ______ eV (to two decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(E, 2), tol: Math.max(0.01, round(E * 0.005, 2)), V0, a, n,
          sol: `$T = 1$ when $k_2a = n\\pi$ with $n = ${n}$: $E - V_0 = 0.0381\\left(\\dfrac{${n}\\pi}{${a}}\\right)^2 = ${round(E - V0, 3)}$ eV, so $E = ${round(E, 2)}$ eV.` };
      },
      verify: (p) => p.V0 + HB2M * (p.n * Math.PI / p.a) ** 2 },
    { id: 'q1d-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      make(r) {
        const N = int(r, 2, 5), a = choose(r, [0.5, 0.8, 1.0, 1.5, 2.0]);
        const V0 = HB2M * ((N - 1) * Math.PI / a) ** 2;
        return { q: `An electron is in a finite square well of width $${a}$ nm. The smallest depth for which the well has ${N} bound states is ______ eV (to three decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(V0, 3), tol: Math.max(0.002, round(V0 * 0.005, 3)), N, a,
          sol: `$N$ states need $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar \\ge (N - 1)\\pi/2 = ${N - 1}\\pi/2$. So $V_0 \\ge 0.0381\\left(\\dfrac{${N - 1}\\pi}{${a}}\\right)^2 = ${round(V0, 3)}$ eV.`,
          trap: 'Using $N\\pi/2$, which is the threshold for $N + 1$ states.' };
      },
      verify: (p) => HB2M * ((p.N - 1) * Math.PI / p.a) ** 2 },
    { id: 'q1d-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'wells above the top',
      make(r) {
        const V0 = choose(r, [0.5, 1.0, 2.0, 3.0, 5.0]), a = choose(r, [0.3, 0.5, 0.8, 1.0]);
        const base = HB2M * (Math.PI / a) ** 2;
        let n = Math.floor(Math.sqrt(V0 / base)) + 1;
        const E = base * n * n - V0;
        return { q: `Electrons with $E > 0$ pass over a square well of depth $${V0}$ eV and width $${a}$ nm. The lowest energy at which they are transmitted with certainty is ______ eV (to three decimal places). Use $\\hbar^2/2m_e = 0.0381$ eV nm².`,
          answer: round(E, 3), tol: Math.max(0.003, round(E * 0.01, 3)), V0, a, n,
          sol: `$T = 1$ when $\\sqrt{2m(E + V_0)}\\,a/\\hbar = n\\pi$, i.e. $E = ${round(base, 4)}n^2 - ${V0}$ eV. The smallest $n$ giving $E > 0$ is $n = ${n}$: $E = ${round(base * n * n, 4)} - ${V0} = ${round(E, 3)}$ eV.`,
          trap: 'Taking $n = 1$ without checking that it gives a positive energy.' };
      },
      verify: (p) => HB2M * (p.n * Math.PI / p.a) ** 2 - p.V0 },
    { id: 'q1d-g08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'finite well',
      make(r) {
        const z0 = choose(r, [1.2, 2, 2.5, 3.5, 4.5, 5.2, 6, 7]);
        let ev = 0, od = 0;
        for (let k = 0; k < 20; k++) { if (k * Math.PI / 2 < z0) (k % 2 === 0 ? ev++ : od++); }
        const s = (e, o) => `${e} even and ${o} odd`;
        const o = mcqOptions(r, s(ev, od), [s(od, ev), s(ev + 1, od), s(ev, od + 1), s(ev + od, 0), s(ev - 1, od + 1)].filter((t) => !/-/.test(t) && t !== s(ev, od)), (t) => t);
        return { q: `A finite square well has $z_0 = \\tfrac a2\\sqrt{2mV_0}/\\hbar = ${z0}$. Its bound states are`, ...o,
          sol: `Branches of the graphical solution start at $z = 0, \\pi/2, \\pi, 3\\pi/2, \\dots$ (even, odd, even, odd, ...), each giving one state if it starts below $z_0 = ${z0}$. That gives ${ev} even and ${od} odd, ${ev + od} in all ($= 1 + \\lfloor 2z_0/\\pi\\rfloor$).` };
      } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
