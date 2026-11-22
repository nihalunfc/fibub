// Small oscillations and normal modes (GATE / CSIR NET level): expanding about equilibrium, the eigenvalue problem
// det(K - w^2 M) = 0, mode shapes and orthogonality, normal coordinates, zero modes, molecules, coupled pendulums and
// beats, beaded strings, rings and chains (dispersion). The JAM topic superposition-coupled has the basics.
// Original questions for fibub. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './normal-modes.more.gen.js';
import more2 from './normal-modes.more2.gen.js';

const g = 9.8;

export default {
  topic: 'normal-modes',
  items: [
    // ---------- level 1 ----------
    { id: 'nm-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'A system with $N$ degrees of freedom oscillates about a stable equilibrium. Counting zero-frequency modes, it has',
      options: ['$N$ normal modes', '$2N$ normal modes', '$N - 1$ normal modes', '$3N$ normal modes'], answer: 0,
      sol: 'The $N\\times N$ eigenvalue problem $(K - \\omega^2M)\\vec a = 0$ has $N$ eigenvalues $\\omega^2$ and $N$ independent eigenvectors. Some $\\omega$ may be zero (free translation or rotation).',
      trap: '$2N$ counts the dimensions of phase space, not the modes.' },
    { id: 'nm-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'Near equilibrium a system has $T = \\tfrac12\\dot{\\vec q}^{\\,T}M\\dot{\\vec q}$ and $V = \\tfrac12\\vec q^{\\,T}K\\vec q$. Its normal-mode frequencies are found from',
      options: ['$\\det(K - \\omega M) = 0$', '$\\det(K - \\omega^2M) = 0$', '$\\det(M - \\omega^2K) = 0$', '$\\det(KM - \\omega^2) = 0$ with $KM$ the ordinary product'], answer: 1,
      sol: 'The equations of motion are $M\\ddot{\\vec q} + K\\vec q = 0$. Trying $\\vec q = \\vec a\\cos\\omega t$ gives $(K - \\omega^2M)\\vec a = 0$, which has a non-zero solution only when $\\det(K - \\omega^2M) = 0$.',
      trap: '$\\det(M - \\omega^2K) = 0$ gives $1/\\omega^2$ instead of $\\omega^2$.' },
    { id: 'nm-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'two-body oscillations',
      q: 'Two blocks, each of mass 1 kg, slide on a smooth table, joined by a spring of constant 8 N/m. Nothing else touches them. The non-zero normal-mode angular frequency is ______ rad/s.',
      answer: 4, tol: 0, unit: 'rad/s', calc: () => Math.sqrt(2 * 8 / 1),
      sol: 'One mode is a free translation ($\\omega = 0$). In the other the blocks move oppositely: the reduced mass $\\mu = m/2$ oscillates on the spring, $\\omega = \\sqrt{k/\\mu} = \\sqrt{2k/m} = 4$ rad/s.',
      trap: '$\\sqrt{k/m} = 2.83$ rad/s forgets that both blocks move.' },
    { id: 'nm-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'eigenvalue problem',
      q: 'In a single normal mode of an undamped system,',
      options: ['each part moves with its own frequency', 'only one part moves at a time', 'every part oscillates at the same frequency, all in phase or in antiphase', 'the energy flows back and forth between the parts'], answer: 2,
      sol: 'A normal mode is a motion $\\vec q = \\vec a\\cos(\\omega t + \\phi)$: one frequency, one phase, with fixed amplitude ratios (the signs of the components of $\\vec a$ tell which parts are in antiphase). Energy exchange happens only when two modes are mixed.' },
    { id: 'nm-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'zero modes',
      q: 'Three atoms on a straight line are joined by two springs and may move only along the line. The number of zero-frequency modes is',
      options: ['$0$', '$2$', '$3$', '$1$'], answer: 3,
      sol: 'Moving all three atoms together stretches no spring, so a uniform translation costs no energy: one zero mode. The other two modes are the symmetric and antisymmetric stretches.' },
    { id: 'nm-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'coupled pendulums',
      q: 'Two identical pendulums (length $l$) are joined by a weak spring between the bobs. The frequency of the mode in which they swing in step is',
      options: ['$\\sqrt{g/l}$, the same as one free pendulum', '$\\sqrt{g/l + 2k/m}$', '$\\sqrt{g/l + k/m}$', '$\\sqrt{2g/l}$'], answer: 0,
      sol: 'Swinging in step, the bobs stay the same distance apart and the spring never stretches, so each moves like a free pendulum. The opposite mode stretches the spring from both ends: $\\omega^2 = g/l + 2k/m$.' },

    // ---------- level 2 ----------
    { id: 'nm-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'Two masses of 2 kg sit in a line between two fixed walls, connected wall-spring-mass-spring-mass-spring-wall by three identical springs of 18 N/m. The higher normal-mode angular frequency is ______ rad/s.',
      answer: 5.196, tol: 0.02, unit: 'rad/s', calc: () => Math.sqrt(3 * 18 / 2),
      sol: '$K = k\\begin{pmatrix}2 & -1\\\\ -1 & 2\\end{pmatrix}$, $M = mI$. $\\det(K - \\omega^2M) = (2k - m\\omega^2)^2 - k^2 = 0$ gives $\\omega^2 = k/m$ or $3k/m$. Higher: $\\sqrt{3\\times18/2} = \\sqrt{27} = 5.196$ rad/s.' },
    { id: 'nm-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mode shapes',
      q: 'For two equal masses between walls joined by three identical springs, the mode shapes $(x_1, x_2)$ are',
      options: ['slow $(1, -1)$ and fast $(1, 1)$', 'slow $(1, 1)$ and fast $(1, -1)$', 'slow $(1, 0)$ and fast $(0, 1)$', 'slow $(1, 2)$ and fast $(2, -1)$'], answer: 1,
      sol: 'In $(1, 1)$ the middle spring is never stretched, so each mass feels only its outer spring: $\\omega^2 = k/m$. In $(1, -1)$ the middle spring stretches by twice the displacement: $\\omega^2 = (k + 2k)/m = 3k/m$. Antiphase modes stretch more springs and are faster.' },
    { id: 'nm-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'mode shapes',
      q: 'For normal modes $\\vec a_i$ of $M\\ddot{\\vec q} + K\\vec q = 0$ (with $M$, $K$ symmetric and distinct frequencies), which statements are correct?',
      options: ['$\\vec a_i^{\\,T}M\\vec a_j = 0$ for $i \\neq j$', 'Every small motion is a superposition of the normal modes', 'The total energy is the sum of the energies of the separate modes', 'The mode vectors are always orthogonal in the ordinary sense, $\\vec a_i\\cdot\\vec a_j = 0$'], answer: [0, 1, 2],
      sol: 'Subtracting $\\vec a_j^{\\,T}(K - \\omega_i^2M)\\vec a_i = 0$ and its partner gives $(\\omega_i^2 - \\omega_j^2)\\vec a_j^{\\,T}M\\vec a_i = 0$: orthogonality with weight $M$. This makes $T$ and $V$ diagonal in normal coordinates, so the energy splits mode by mode. Ordinary orthogonality holds only when $M$ is a multiple of the unit matrix.',
      trap: 'With unequal masses the mode vectors are generally not perpendicular.' },
    { id: 'nm-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'molecules',
      q: 'Model CO₂ as O-C-O on a line (masses 16, 12, 16 u) with two identical springs. The ratio of the antisymmetric stretch frequency to the symmetric stretch frequency is ______.',
      answer: 1.915, tol: 0.005, calc: () => Math.sqrt(1 + 2 * 16 / 12),
      sol: 'Symmetric stretch: carbon still, each oxygen on its own spring, $\\omega_s = \\sqrt{k/m}$. Antisymmetric: the carbon moves against both oxygens, $\\omega_a = \\sqrt{\\dfrac km\\left(1 + \\dfrac{2m}{M}\\right)}$. Ratio $= \\sqrt{1 + 32/12} = 1.915$. (Measured: 2349/1388 cm⁻¹ = 1.69, since the real force field is not just two springs.)' },
    { id: 'nm-011', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'coupled pendulums',
      q: 'Two identical weakly coupled pendulums have mode frequencies $\\omega_1 < \\omega_2$. One is pulled aside and released, the other at rest. The first pendulum is next completely at rest after a time',
      options: ['$2\\pi/(\\omega_2 - \\omega_1)$', '$2\\pi/(\\omega_1 + \\omega_2)$', '$\\pi/(\\omega_2 - \\omega_1)$', '$\\pi/\\omega_1$'], answer: 2,
      sol: 'Starting one pendulum mixes the two modes equally: $x_1 = A\\cos\\frac{\\omega_2 - \\omega_1}{2}t\\,\\cos\\frac{\\omega_1 + \\omega_2}{2}t$. The envelope $\\cos\\frac{\\Delta\\omega}{2}t$ first vanishes at $t = \\pi/\\Delta\\omega$; then all the energy is in the second pendulum.',
      trap: '$2\\pi/\\Delta\\omega$ is the time for the energy to go across and come back.' },
    { id: 'nm-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'coupled pendulums',
      q: 'Two coupled pendulums have normal-mode frequencies 10.0 and 10.5 rad/s. One is started alone. The time for its energy to pass completely to the other is ______ s.',
      answer: 6.283, tol: 0.02, unit: 's', calc: () => Math.PI / 0.5,
      sol: '$t = \\pi/(\\omega_2 - \\omega_1) = \\pi/0.5 = 6.28$ s.' },
    { id: 'nm-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'To set up small oscillations about an equilibrium $\\vec q_0$ of $V(\\vec q)$, the stiffness matrix is',
      options: ['$K_{ij} = \\partial V/\\partial q_i$ at $\\vec q_0$', '$K_{ij} = V(\\vec q_0)\\delta_{ij}$', '$K_{ij} = \\partial^2 T/\\partial\\dot q_i\\partial\\dot q_j$', '$K_{ij} = \\partial^2V/\\partial q_i\\partial q_j$ at $\\vec q_0$'], answer: 3,
      sol: 'Taylor expand: $V = V_0 + \\sum\\partial_iV\\,\\eta_i + \\tfrac12\\sum\\partial_i\\partial_jV\\,\\eta_i\\eta_j + \\ldots$ The first derivatives vanish at equilibrium, so the quadratic part is $\\tfrac12\\eta^TK\\eta$ with $K$ the Hessian. The mass matrix comes from $T$, evaluated at $\\vec q_0$.' },
    { id: 'nm-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'zero modes',
      q: 'A system has a normal mode with $\\omega = 0$. Which statements are correct?',
      options: ['It can be a free translation or rotation of the whole system', 'The potential energy does not change, to second order, along that mode', '$\\det K = 0$', 'The equilibrium must be unstable'], answer: [0, 1, 2],
      sol: '$\\omega^2 = 0$ means $K\\vec a = 0$: $K$ has a zero eigenvalue (so $\\det K = 0$) and $V$ is flat along $\\vec a$. Motion along it is uniform, $q = a + bt$, not oscillatory but not runaway either; this is neutral, not unstable (no exponential growth).' },
    { id: 'nm-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'A system has $M = mI$ and $K = k\\begin{pmatrix}2 & -1\\\\ -1 & 2\\end{pmatrix}$. The ratio of its higher to lower normal-mode frequency is ______.',
      answer: 1.732, tol: 0.005, calc: () => Math.sqrt(3),
      sol: 'The eigenvalues of $\\begin{pmatrix}2 & -1\\\\ -1 & 2\\end{pmatrix}$ are $2 \\mp 1 = 1, 3$, so $\\omega^2 = k/m, 3k/m$ and the ratio is $\\sqrt3 = 1.732$.' },
    { id: 'nm-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'two-body oscillations',
      q: 'Masses $m$ and $2m$ on a smooth table are joined by a spring $k$. The non-zero normal-mode angular frequency is',
      options: ['$\\sqrt{3k/2m}$', '$\\sqrt{k/3m}$', '$\\sqrt{3k/m}$', '$\\sqrt{k/2m}$'], answer: 0,
      sol: 'The relative coordinate oscillates with the reduced mass $\\mu = m\\cdot2m/3m = 2m/3$: $\\omega = \\sqrt{k/\\mu} = \\sqrt{3k/2m}$. The other mode is the free motion of the centre of mass.' },
    { id: 'nm-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'normal coordinates',
      q: 'In terms of suitably normalised normal coordinates $Q_k$, the small-oscillation Lagrangian $L = \\tfrac12\\dot{\\vec q}^{\\,T}M\\dot{\\vec q} - \\tfrac12\\vec q^{\\,T}K\\vec q$ becomes',
      options: ['$\\tfrac12\\sum_k(\\dot Q_k^2 + \\omega_k^2Q_k^2)$', '$\\tfrac12\\sum_k(\\dot Q_k^2 - \\omega_k^2Q_k^2)$', '$\\tfrac12\\sum_{j,k}\\dot Q_j\\dot Q_k - \\tfrac12\\sum_k\\omega_kQ_k^2$', '$\\tfrac12\\sum_k\\omega_k(\\dot Q_k^2 - Q_k^2)$'], answer: 1,
      sol: 'With $\\vec q = \\sum_k Q_k\\vec a_k$ and the modes normalised so that $\\vec a_j^{\\,T}M\\vec a_k = \\delta_{jk}$, $T = \\tfrac12\\sum\\dot Q_k^2$ and $V = \\tfrac12\\sum\\omega_k^2Q_k^2$. So $L$ is a sum of independent oscillators, each obeying $\\ddot Q_k = -\\omega_k^2Q_k$.' },

    // ---------- level 3 ----------
    { id: 'nm-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'double pendulum',
      q: 'A double pendulum has two equal bobs on light rods of length 1 m each. The lower of its two small-oscillation angular frequencies is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 2.396, tol: 0.01, unit: 'rad/s', calc: () => Math.sqrt((2 - Math.SQRT2) * 9.8),
      sol: 'Linearised: $2\\ddot\\theta_1 + \\ddot\\theta_2 = -2\\omega_0^2\\theta_1$ and $\\ddot\\theta_1 + \\ddot\\theta_2 = -\\omega_0^2\\theta_2$, with $\\omega_0^2 = g/l$. The determinant condition gives $\\omega^4 - 4\\omega_0^2\\omega^2 + 2\\omega_0^4 = 0$, so $\\omega^2 = (2 \\mp \\sqrt2)\\omega_0^2$. Lower: $\\sqrt{0.586\\times9.8} = 2.396$ rad/s.' },
    { id: 'nm-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'double pendulum',
      q: 'For the double pendulum with equal masses and equal lengths, the amplitude ratio $\\theta_2/\\theta_1$ in the slow normal mode is',
      options: ['$-\\sqrt2$', '$1$', '$\\sqrt2$', '$2$'], answer: 2,
      sol: 'From $\\ddot\\theta_1 + \\ddot\\theta_2 = -\\omega_0^2\\theta_2$: $\\theta_2/\\theta_1 = \\omega^2/(\\omega_0^2 - \\omega^2)$. With $\\omega^2 = (2 - \\sqrt2)\\omega_0^2$ this is $(2 - \\sqrt2)/(\\sqrt2 - 1) = \\sqrt2$: both swing the same way, the lower bob further. The fast mode has $-\\sqrt2$.' },
    { id: 'nm-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'beaded string',
      q: 'Three beads of mass $m$ are spaced $a$ apart on a light string under tension $T$, fixed at both ends (spacing $a$ from each end), with $T/(ma) = 100$ s⁻². The highest transverse normal-mode frequency is ______ rad/s.',
      answer: 18.48, tol: 0.05, unit: 'rad/s', calc: () => 2 * 10 * Math.sin(3 * Math.PI / 8),
      sol: 'For $N$ beads, $\\omega_n = 2\\sqrt{T/ma}\\,\\sin\\dfrac{n\\pi}{2(N + 1)}$. Highest ($n = 3$, $N = 3$): $2\\times10\\times\\sin(3\\pi/8) = 20\\times0.9239 = 18.48$ rad/s. (The three frequencies are $\\sqrt{2 \\mp \\sqrt2}$ and $\\sqrt2$ times 10.)' },
    { id: 'nm-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'chains',
      q: 'An infinite chain of masses $m$ joined by springs $k$, spacing $a$, has $\\omega(q) = 2\\sqrt{k/m}\\,|\\sin(qa/2)|$. Which statements are correct?',
      options: ['The largest frequency is $2\\sqrt{k/m}$', 'The group velocity is zero at $q = \\pi/a$', 'For long waves the chain carries sound at speed $a\\sqrt{k/m}$', 'Phase and group velocity are equal at every $q$'], answer: [0, 1, 2],
      sol: '$\\omega \\le 2\\sqrt{k/m}$, reached at the zone boundary, where $d\\omega/dq = a\\sqrt{k/m}\\cos(qa/2) = 0$ (a standing wave). For $qa \\ll 1$, $\\omega \\approx a\\sqrt{k/m}\\,q$, so both velocities equal $a\\sqrt{k/m}$. Elsewhere the chain is dispersive: $\\omega/q > d\\omega/dq$.' },
    { id: 'nm-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'normal coordinates',
      q: 'Two equal masses between walls are joined by three identical springs, with $k/m = 1$ s⁻². At $t = 0$, $x_1 = 1$ cm, $x_2 = 0$, both at rest. The value of $x_1$ at $t = \\pi$ s is ______ cm.',
      answer: -0.1669, tol: 0.003, unit: 'cm', calc: () => 0.5 * (Math.cos(Math.PI) + Math.cos(Math.sqrt(3) * Math.PI)),
      sol: 'The modes are $(1, 1)$ at $\\omega = 1$ and $(1, -1)$ at $\\omega = \\sqrt3$. The start $(1, 0) = \\tfrac12(1, 1) + \\tfrac12(1, -1)$, so $x_1 = \\tfrac12(\\cos t + \\cos\\sqrt3t)$. At $t = \\pi$: $\\tfrac12(-1 + \\cos5.441) = \\tfrac12(-1 + 0.666) = -0.167$ cm.' },
    { id: 'nm-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rings',
      q: 'Three equal masses slide on a smooth circular hoop, joined by three identical springs (each spring between neighbours, along the hoop). The normal-mode frequencies are',
      options: ['$\\sqrt{k/m}$, $\\sqrt{2k/m}$, $\\sqrt{3k/m}$', '$0$, $\\sqrt{k/m}$, $\\sqrt{3k/m}$', 'all three equal to $\\sqrt{3k/m}$', '$0$ and $\\sqrt{3k/m}$ (twice)'], answer: 3,
      sol: '$K = k\\begin{pmatrix}2 & -1 & -1\\\\ -1 & 2 & -1\\\\ -1 & -1 & 2\\end{pmatrix}$ has eigenvalues $0$ (all masses moving round together) and $3k$ twice. The two fast modes are degenerate because the ring has threefold symmetry.' },
    { id: 'nm-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'A particle of unit mass moves in the plane near the minimum of $V = 3x^2 + 2xy + 3y^2$. The lower normal-mode angular frequency is ______.',
      answer: 2, tol: 0.005, calc: () => Math.sqrt(4),
      sol: '$K = \\begin{pmatrix}6 & 2\\\\ 2 & 6\\end{pmatrix}$ (the Hessian; note the $xy$ term gives off-diagonal entries of 2, not 1). Eigenvalues $6 \\mp 2 = 4, 8$, along $(1, -1)$ and $(1, 1)$. So $\\omega = 2$ and $2\\sqrt2$.',
      trap: 'Forgetting the factor 2 when reading $K$ from $V = \\tfrac12q^TKq$ halves every $\\omega^2$.' },
    { id: 'nm-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rings',
      q: 'Two equal masses $m$ slide on a smooth circular hoop, joined by two identical springs $k$ (one along each arc). The non-zero normal-mode frequency is',
      options: ['$2\\sqrt{k/m}$', '$\\sqrt{2k/m}$', '$\\sqrt{k/m}$', '$\\sqrt{3k/m}$'], answer: 0,
      sol: 'If mass 1 moves by $s_1$ and mass 2 by $s_2$ along the hoop, one spring stretches by $s_2 - s_1$ and the other compresses by the same amount, so $V = k(s_1 - s_2)^2$. With the reduced mass $m/2$ for the relative motion and stiffness $2k$: $\\omega^2 = 2k/(m/2) = 4k/m$.' },
    { id: 'nm-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'mode shapes',
      q: 'Two normal modes share the same frequency (degeneracy). Which statements are correct?',
      options: ['Any linear combination of the two mode vectors is also a normal mode', 'The mode vectors can be chosen to be $M$-orthogonal', 'Degeneracy usually reflects a symmetry, as in the isotropic two-dimensional oscillator', 'Degenerate modes are always unstable'], answer: [0, 1, 2],
      sol: 'If $K\\vec a = \\omega^2M\\vec a$ and $K\\vec b = \\omega^2M\\vec b$, the same holds for $\\alpha\\vec a + \\beta\\vec b$; Gram-Schmidt with weight $M$ then gives orthogonal ones. Symmetries (rotation for the isotropic oscillator, threefold for a ring of three) force equal frequencies. Stability depends on the sign of $\\omega^2$, not on degeneracy.' },
    { id: 'nm-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'molecules',
      q: 'A linear molecule of four atoms (such as acetylene, H-C≡C-H) has how many vibrational normal modes?',
      options: ['$6$', '$7$', '$8$', '$5$'], answer: 1,
      sol: '$3N = 12$ coordinates, minus 3 translations, minus 2 rotations (rotation about the molecular axis moves no atom): $3N - 5 = 7$. A non-linear molecule of four atoms would have $3N - 6 = 6$.' },
    { id: 'nm-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stability',
      q: 'At an equilibrium point of a two-dimensional potential, the Hessian matrix has eigenvalues $3$ and $-1$ (the mass matrix is positive). The equilibrium is',
      options: ['stable, with two oscillation frequencies', 'neutrally stable', 'unstable: a saddle, with one exponentially growing mode', 'stable because the trace of the Hessian is positive'], answer: 2,
      sol: 'A negative eigenvalue gives $\\omega^2 < 0$, i.e. $e^{\\pm\\kappa t}$ motion along that direction: the point is a saddle of $V$ and unstable. Stability needs $K$ positive definite (all eigenvalues positive), not just a positive trace.' },
    { id: 'nm-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'Two 1 kg masses sit between walls. Each is joined to its wall by a spring of 10 N/m, and they are joined to each other by a spring of 5 N/m. The higher normal-mode angular frequency is ______ rad/s.',
      answer: 4.472, tol: 0.01, unit: 'rad/s', calc: () => Math.sqrt(10 + 2 * 5),
      sol: 'In step $(1, 1)$: the middle spring is idle, $\\omega^2 = k/m = 10$. Opposite $(1, -1)$: the middle spring is stretched by $2x$, giving each mass an extra force $2k_cx$, so $\\omega^2 = (k + 2k_c)/m = 20$ and $\\omega = 4.47$ rad/s.' },
    { id: 'nm-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      q: 'From a ceiling hang a spring $k$, a mass $m$, a second spring $k$ and a second mass $m$, with $k/m = 4$ s⁻². The lower normal-mode angular frequency for vertical motion is ______ rad/s.',
      answer: 1.236, tol: 0.005, unit: 'rad/s', calc: () => Math.sqrt((3 - Math.sqrt(5)) / 2 * 4),
      sol: 'Gravity only shifts the equilibrium. $K = k\\begin{pmatrix}2 & -1\\\\ -1 & 1\\end{pmatrix}$, whose eigenvalues satisfy $\\lambda^2 - 3\\lambda + 1 = 0$: $\\lambda = (3 \\mp \\sqrt5)/2$. Lower: $\\omega^2 = 0.382\\times4 = 1.528$, $\\omega = 1.236$ rad/s.' },

    // ---------- level 4 ----------
    { id: 'nm-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'molecules',
      q: 'In a linear O-C-O model with springs of 1600 N/m (oxygen 16 u, carbon 12 u, 1 u $= 1.6605\\times10^{-27}$ kg), the antisymmetric stretch angular frequency is $f\\times10^{14}$ rad/s. The value of $f$ is ______.',
      answer: 4.70, tol: 0.03, calc: () => Math.sqrt(1600 / (16 * 1.6605390666e-27) * (1 + 32 / 12)) / 1e14,
      sol: '$m = 16\\times1.6605\\times10^{-27} = 2.657\\times10^{-26}$ kg. $\\omega_a^2 = \\dfrac km\\left(1 + \\dfrac{2m}{M}\\right) = 6.02\\times10^{28}\\times3.667 = 2.21\\times10^{29}$ s⁻², so $\\omega_a = 4.70\\times10^{14}$ rad/s.' },
    { id: 'nm-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'coupled pendulums',
      q: 'Two pendulums of slightly different lengths are joined by a very weak spring. One is started swinging, the other at rest. Over time,',
      options: ['all the energy passes to the second pendulum and back, as for identical pendulums', 'the second pendulum never moves', 'the energy exchange is the same as with no spring', 'only part of the energy passes across before returning, because the modes are not equal mixtures'], answer: 3,
      sol: 'When the detuning $\\Delta\\omega_0$ is comparable with the coupling, the normal modes are localised mostly on one pendulum. Starting one pendulum is then an unequal mix of the modes, and the beat never empties it completely. The maximum fraction transferred is $\\dfrac{\\kappa^2}{\\kappa^2 + (\\Delta\\omega_0/2)^2}$ in the weak-coupling limit, where $\\kappa$ is half the splitting at zero detuning.' },
    { id: 'nm-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'beaded string',
      q: 'Four beads on a light taut string (fixed ends, equal spacing $a$), with $\\sqrt{T/ma} = 10$ s⁻¹. The lowest transverse normal-mode frequency is ______ rad/s.',
      answer: 6.180, tol: 0.01, unit: 'rad/s', calc: () => 20 * Math.sin(Math.PI / 10),
      sol: '$\\omega_1 = 2\\sqrt{T/ma}\\,\\sin\\dfrac{\\pi}{2(N + 1)} = 20\\sin(\\pi/10) = 20\\times0.309 = 6.18$ rad/s. For large $N$ this approaches $\\pi\\sqrt{T/\\rho}/L$, the fundamental of a continuous string.' },
    { id: 'nm-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'normal coordinates',
      q: 'A particle of unit mass has $L = \\tfrac12(\\dot x^2 + \\dot y^2) - \\tfrac12(5x^2 + 8xy + 5y^2)$. Which statements are correct?',
      options: ['The mode with $x = y$ has $\\omega = 3$', 'The mode with $x = -y$ has $\\omega = 1$', 'The normal coordinates are $(x \\pm y)/\\sqrt2$', 'Released from rest at $x = 1$, $y = 0$, the motion never repeats'], answer: [0, 1, 2],
      sol: '$K = \\begin{pmatrix}5 & 4\\\\ 4 & 5\\end{pmatrix}$: eigenvalue 9 along $(1, 1)$ and 1 along $(1, -1)$. With $Q_\\pm = (x \\pm y)/\\sqrt2$, $L = \\tfrac12(\\dot Q_+^2 - 9Q_+^2) + \\tfrac12(\\dot Q_-^2 - Q_-^2)$. From $(1, 0)$: $x = \\tfrac12(\\cos3t + \\cos t)$, which repeats every $2\\pi$ because the frequency ratio 3 is rational.' },
    { id: 'nm-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'chains',
      q: 'A one-dimensional chain alternates masses $m$ and $M$ ($m < M$) joined by identical springs $k$. The highest frequency of the optical branch (at $q = 0$) is',
      options: ['$\\sqrt{2k\\left(\\dfrac1m + \\dfrac1M\\right)}$', '$\\sqrt{2k/m}$', '$\\sqrt{2k/M}$', '$2\\sqrt{k/(m + M)}$'], answer: 0,
      sol: 'At $q = 0$ in the optical branch the two sublattices move against each other with the centre of mass of each cell fixed: the reduced mass $\\mu = mM/(m + M)$ on two springs gives $\\omega^2 = 2k/\\mu = 2k(1/m + 1/M)$. At the zone edge the branches end at $\\sqrt{2k/m}$ (optical) and $\\sqrt{2k/M}$ (acoustic), with a gap between.' },
    { id: 'nm-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'chains',
      q: 'A diatomic chain has masses $m = 1$ and $M = 2$ and springs $k = 1$ (consistent units). The width of the frequency gap between the acoustic and optical branches is ______.',
      answer: 0.4142, tol: 0.003, calc: () => Math.sqrt(2) - 1,
      sol: 'At the zone boundary the acoustic branch tops out at $\\sqrt{2k/M} = 1$ and the optical branch bottoms out at $\\sqrt{2k/m} = \\sqrt2$. Gap $= \\sqrt2 - 1 = 0.414$. Waves with frequencies in the gap cannot travel along the chain.' },
    { id: 'nm-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'molecules',
      q: 'Of the four vibrational modes of CO₂ (linear O-C-O), in which one does the carbon atom stay at rest?',
      options: ['The antisymmetric stretch', 'The symmetric stretch', 'Each of the two bending modes', 'None: the carbon moves in every mode'], answer: 1,
      sol: 'In the symmetric stretch the oxygens move out and in together, so momentum balance keeps the carbon still. In the antisymmetric stretch and in the (doubly degenerate) bends, the carbon moves opposite to the oxygens to keep the centre of mass fixed. The symmetric stretch has no oscillating dipole, so it does not absorb infrared.' },
    { id: 'nm-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coupled pendulums',
      q: 'Two identical pendulums with $g/l = 10$ s⁻² are joined by a weak spring with $k/m = 0.05$ s⁻². Starting one alone, the time for its energy to pass completely to the other is ______ s.',
      answer: 199.2, tol: 2, unit: 's', calc: () => Math.PI / (Math.sqrt(10.1) - Math.sqrt(10)),
      sol: '$\\omega_1 = \\sqrt{10} = 3.16228$, $\\omega_2 = \\sqrt{10 + 2\\times0.05} = 3.17805$ rad/s. $\\Delta\\omega = 0.01577$, so $t = \\pi/\\Delta\\omega = 199$ s. (Approximation: $\\Delta\\omega \\approx (k/m)/\\omega_0 = 0.0158$.)',
      trap: 'Weak coupling gives slow exchange: the transfer time is inversely proportional to the coupling.' },

    // ---------- level 5 ----------
    { id: 'nm-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'double pendulum',
      q: 'A double pendulum has rods of equal length 1 m; the upper bob has mass $3m$ and the lower bob mass $m$. The higher small-oscillation angular frequency is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 4.427, tol: 0.01, unit: 'rad/s', calc: () => Math.sqrt(2 * 9.8),
      sol: 'With $M$ on top and $m$ below, the linearised equations are $(M + m)l\\ddot\\theta_1 + ml\\ddot\\theta_2 = -(M + m)g\\theta_1$ and $l\\ddot\\theta_1 + l\\ddot\\theta_2 = -g\\theta_2$. Writing $\\mu = m/(M + m)$, the determinant gives $\\omega^2 = \\dfrac gl\\dfrac{1 \\pm \\sqrt\\mu}{1 - \\mu}$. Here $\\mu = 1/4$: $\\omega^2 = \\dfrac gl\\dfrac{1 \\pm 1/2}{3/4} = 2g/l$ or $\\tfrac23g/l$. Higher: $\\sqrt{19.6} = 4.43$ rad/s.' },
    { id: 'nm-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'rings',
      q: 'Six equal masses on a smooth hoop are joined in a ring by six identical springs. The mode frequencies are $\\omega_j = 2\\sqrt{k/m}\\,|\\sin(\\pi j/6)|$ for $j = 0, \\ldots, 5$. How many different frequencies are there?',
      options: ['$6$', '$3$', '$4$', '$5$'], answer: 2,
      sol: 'The values of $|\\sin(\\pi j/6)|$ are $0, \\tfrac12, \\tfrac{\\sqrt3}{2}, 1, \\tfrac{\\sqrt3}{2}, \\tfrac12$. So the frequencies are $0$, $\\sqrt{k/m}$ (twice), $\\sqrt{3k/m}$ (twice) and $2\\sqrt{k/m}$: four different values. Waves running either way round the ring pair up, except for $j = 0$ and $j = N/2$.' },
    { id: 'nm-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'beaded string',
      q: 'For five equal beads on a taut string with fixed ends, the ratio of the highest to the lowest transverse normal-mode frequency is ______.',
      answer: 3.732, tol: 0.005, calc: () => Math.sin(5 * Math.PI / 12) / Math.sin(Math.PI / 12),
      sol: '$\\omega_n \\propto \\sin\\dfrac{n\\pi}{2(N + 1)} = \\sin\\dfrac{n\\pi}{12}$. Ratio $= \\sin75^\\circ/\\sin15^\\circ = \\cot15^\\circ = 2 + \\sqrt3 = 3.732$. A continuous string would give 5.' },
    { id: 'nm-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'molecules',
      q: 'Which statements about molecular vibrations are correct?',
      options: ['H₂O has 3 vibrational normal modes', 'CO₂ has 4 vibrational normal modes', 'A linear molecule of $N$ atoms has $3N - 5$ vibrational modes', 'A diatomic molecule has 2 vibrational modes'], answer: [0, 1, 2],
      sol: 'Non-linear: $3N - 6$, so H₂O has 3. Linear: $3N - 5$ (only two rotations move atoms), so CO₂ has 4 and a diatomic has $6 - 5 = 1$.' },
    ...more2,
  ],
  gens: [
    { id: 'nm-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      make(r) {
        const m = pick(r, 0.5, 4, 0.5), k = int(r, 5, 60), hi = r() < 0.5;
        const answer = round(Math.sqrt((hi ? 3 : 1) * k / m), 3);
        return { q: `Two ${m} kg masses sit between two walls, joined wall-mass-mass-wall by three identical springs of ${k} N/m. Find the ${hi ? 'higher' : 'lower'} normal-mode angular frequency (rad/s).`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', m, k, hi,
          sol: `$\\det\\begin{pmatrix}2k - m\\omega^2 & -k\\\\ -k & 2k - m\\omega^2\\end{pmatrix} = 0$ gives $\\omega^2 = k/m$ (in step) and $3k/m$ (opposite). ${hi ? `Higher: $\\sqrt{3\\times${k}/${m}}$` : `Lower: $\\sqrt{${k}/${m}}$`} $= ${answer}$ rad/s.` };
      },
      verify: (p) => Math.sqrt((p.hi ? 3 : 1) * p.k / p.m) },
    { id: 'nm-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), k = int(r, 4, 40), kc = int(r, 1, 20);
        const answer = round(Math.sqrt((k + 2 * kc) / m), 3);
        return { q: `Two ${m} kg masses between walls are each tied to their wall by a ${k} N/m spring and to each other by a ${kc} N/m spring. Find the higher normal-mode angular frequency (rad/s).`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', m, k, kc,
          sol: `The opposite mode $(1, -1)$ stretches the middle spring by twice each displacement, so $\\omega^2 = (k + 2k_c)/m = (${k} + ${2 * kc})/${m}$ and $\\omega = ${answer}$ rad/s. (The in-step mode has $\\sqrt{k/m} = ${round(Math.sqrt(k / m), 3)}$ rad/s.)` };
      },
      verify: (p) => Math.sqrt((p.k + 2 * p.kc) / p.m) },
    { id: 'nm-g03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'two-body oscillations',
      make(r) {
        const m1 = pick(r, 0.5, 5, 0.5), m2 = pick(r, 0.5, 5, 0.5), k = int(r, 2, 80);
        const answer = round(Math.sqrt(k * (1 / m1 + 1 / m2)), 3);
        return { q: `Blocks of ${m1} kg and ${m2} kg on a smooth table are joined by a spring of ${k} N/m and nothing else. Find the non-zero normal-mode angular frequency (rad/s).`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', m1, m2, k,
          sol: `One mode is free translation. The other uses the reduced mass $\\mu = \\dfrac{m_1m_2}{m_1 + m_2} = ${round(m1 * m2 / (m1 + m2), 4)}$ kg: $\\omega = \\sqrt{k/\\mu} = ${answer}$ rad/s.` };
      },
      verify: (p) => Math.sqrt(p.k * (1 / p.m1 + 1 / p.m2)) },
    { id: 'nm-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'molecules',
      make(r) {
        const [name, mo, mc] = choose(r, [['CO₂ (O-C-O)', 16, 12], ['CS₂ (S-C-S)', 32, 12], ['BeH₂ (H-Be-H)', 1, 9], ['XeF₂ (F-Xe-F)', 19, 131], ['an O-N-O ion (taken as linear)', 16, 14]]);
        const answer = round(Math.sqrt(1 + 2 * mo / mc), 4);
        return { q: `Model ${name} as three atoms on a line (outer atoms ${mo} u, central atom ${mc} u) joined by two identical springs. Find the ratio of the antisymmetric to the symmetric stretch frequency.`,
          answer, tol: Math.max(0.003, answer * 0.003), mo, mc,
          sol: `Symmetric: centre still, $\\omega_s = \\sqrt{k/m}$. Antisymmetric: $\\omega_a = \\sqrt{\\dfrac km\\left(1 + \\dfrac{2m}{M}\\right)}$. Ratio $= \\sqrt{1 + 2\\times${mo}/${mc}} = ${answer}$.`,
          trap: 'Here $m$ is an outer atom and $M$ the central one.' };
      },
      verify: (p) => Math.sqrt(1 + 2 * p.mo / p.mc) },
    { id: 'nm-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'beaded string',
      make(r) {
        const N = int(r, 2, 7), n = int(r, 1, N), w0 = int(r, 5, 30);
        const answer = round(2 * w0 * Math.sin(n * Math.PI / (2 * (N + 1))), 3);
        return { q: `${N} equal beads sit on a light taut string with fixed ends, equally spaced, with $\\sqrt{T/ma} = ${w0}$ s⁻¹. Find the angular frequency (rad/s) of transverse normal mode number ${n} (counting from the lowest).`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', N, n, w0,
          sol: `$\\omega_n = 2\\sqrt{T/ma}\\,\\sin\\dfrac{n\\pi}{2(N + 1)} = 2\\times${w0}\\times\\sin\\dfrac{${n}\\pi}{${2 * (N + 1)}} = ${answer}$ rad/s.` };
      },
      verify: (p) => 2 * p.w0 * Math.sin(p.n * Math.PI / (2 * (p.N + 1))) },
    { id: 'nm-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coupled pendulums',
      make(r) {
        const l = pick(r, 0.3, 2, 0.1), kc = choose(r, [0.02, 0.05, 0.1, 0.2, 0.5]);
        const w1 = Math.sqrt(g / l), w2 = Math.sqrt(g / l + 2 * kc);
        const answer = round(Math.PI / (w2 - w1), 2);
        return { q: `Two identical ${l} m pendulums are joined by a weak spring with $k/m = ${kc}$ s⁻². One is started swinging, the other at rest. After how many seconds has all the energy passed to the second pendulum ($g = 9.8$ m/s²)?`,
          answer, tol: Math.max(0.05, answer * 0.01), unit: 's', l, kc,
          sol: `$\\omega_1 = \\sqrt{g/l} = ${round(w1, 5)}$ and $\\omega_2 = \\sqrt{g/l + 2k/m} = ${round(w2, 5)}$ rad/s. Transfer time $= \\pi/(\\omega_2 - \\omega_1) = ${answer}$ s.`,
          trap: 'The full there-and-back cycle takes twice as long.' };
      },
      verify: (p) => Math.PI / (Math.sqrt(g / p.l + 2 * p.kc) - Math.sqrt(g / p.l)) },
    { id: 'nm-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'double pendulum',
      make(r) {
        const l = pick(r, 0.2, 2, 0.1), fast = r() < 0.5;
        const answer = round(Math.sqrt((fast ? 2 + Math.SQRT2 : 2 - Math.SQRT2) * g / l), 3);
        return { q: `A double pendulum has two equal bobs on light rods of length ${l} m each. Find its ${fast ? 'higher' : 'lower'} small-oscillation angular frequency (rad/s, $g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', l, fast,
          sol: `$\\omega^2 = (2 \\mp \\sqrt2)\\,g/l$. ${fast ? 'Higher' : 'Lower'}: $\\sqrt{(2 ${fast ? '+' : '-'} \\sqrt2)\\times9.8/${l}} = ${answer}$ rad/s (mode shape $\\theta_2/\\theta_1 = ${fast ? '-' : ''}\\sqrt2$).` };
      },
      verify: (p) => Math.sqrt((p.fast ? 2 + Math.SQRT2 : 2 - Math.SQRT2) * g / p.l) },
    { id: 'nm-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'eigenvalue problem',
      make(r) {
        const a = int(r, 2, 8), c = int(r, -(2 * a - 1), 2 * a - 1) || 1, hi = r() < 0.5;
        const w2 = hi ? 2 * a + Math.abs(c) : 2 * a - Math.abs(c), answer = round(Math.sqrt(w2), 4);
        return { q: `A particle of unit mass oscillates near the minimum of $V = ${a}x^2 ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}xy + ${a}y^2$. Find its ${hi ? 'higher' : 'lower'} normal-mode angular frequency.`,
          answer, tol: Math.max(0.002, answer * 0.003), a, c, hi,
          sol: `$K$ is the Hessian: $\\begin{pmatrix}${2 * a} & ${c}\\\\ ${c} & ${2 * a}\\end{pmatrix}$, with eigenvalues $${2 * a} \\pm ${Math.abs(c)}$ along $(1, \\pm1)$. ${hi ? 'Higher' : 'Lower'}: $\\omega = \\sqrt{${w2}} = ${answer}$.`,
          trap: 'The diagonal entries are $2a$, not $a$, because $V = \\tfrac12\\vec q^{\\,T}K\\vec q$.' };
      },
      verify: (p) => Math.sqrt(p.hi ? 2 * p.a + Math.abs(p.c) : 2 * p.a - Math.abs(p.c)) },
    { id: 'nm-g09', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'molecules',
      make(r) {
        const [name, N, lin] = choose(r, [['N₂', 2, true], ['HCl', 2, true], ['CO₂', 3, true], ['H₂O', 3, false], ['NH₃', 4, false], ['CH₄', 5, false], ['C₂H₂ (acetylene, linear)', 4, true], ['HCN (linear)', 3, true], ['C₆H₆ (benzene)', 12, false], ['SF₆', 7, false]]);
        const n = lin ? 3 * N - 5 : 3 * N - 6;
        const o = mcqOptions(r, n, [lin ? 3 * N - 6 : 3 * N - 5, 3 * N, 3 * N - 3], (v) => String(v));
        return { q: `How many vibrational normal modes does ${name} have?`, ...o,
          sol: `${N} atoms give $3N = ${3 * N}$ coordinates. Subtract 3 translations and ${lin ? '2 rotations (the molecule is linear, so spinning about its axis moves no atom)' : '3 rotations (non-linear)'}: ${lin ? '$3N - 5$' : '$3N - 6$'} $= ${n}$.`,
          trap: 'Linear molecules lose only two rotations.' };
      } },
    { id: 'nm-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'chains',
      make(r) {
        const w0 = int(r, 2, 20), frac = choose(r, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.9, 1]), ask = choose(r, ['omega', 'vg']);
        const x = frac * Math.PI / 2; // qa/2
        const answer = round(ask === 'omega' ? 2 * w0 * Math.sin(x) : w0 * Math.cos(x), 4);
        return { q: `A chain of masses $m$ joined by springs $k$ (spacing $a = 1$ m) has $\\sqrt{k/m} = ${w0}$ s⁻¹. For a wave with $qa = ${frac}\\pi$, find the ${ask === 'omega' ? 'angular frequency (rad/s)' : 'group velocity (m/s)'}.`,
          answer, tol: Math.max(0.002, Math.abs(answer) * 0.005), unit: ask === 'omega' ? 'rad/s' : 'm/s', w0, frac, ask,
          sol: `$\\omega = 2\\sqrt{k/m}\\,|\\sin(qa/2)|$ and $v_g = d\\omega/dq = a\\sqrt{k/m}\\cos(qa/2)$. With $qa/2 = ${round(frac / 2, 3)}\\pi$: ${ask === 'omega' ? `$\\omega = 2\\times${w0}\\times\\sin(${round(frac / 2, 3)}\\pi) = ${answer}$ rad/s` : `$v_g = ${w0}\\times\\cos(${round(frac / 2, 3)}\\pi) = ${answer}$ m/s`}.` };
      },
      verify: (p) => (p.ask === 'omega' ? 2 * p.w0 * Math.sin(p.frac * Math.PI / 2) : p.w0 * Math.cos(p.frac * Math.PI / 2)) },
    { id: 'nm-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mode shapes',
      make(r) {
        const which = choose(r, ['hang-slow', 'hang-fast', 'dp-slow', 'dp-fast', 'wall-slow', 'wall-fast']);
        const data = {
          'hang-slow': ['two equal masses hanging in a vertical chain from a ceiling (spring, mass, spring, mass; equal springs), in the slower mode', '$1.618$ (in step, lower mass moving more)', 'x_2/x_1 = 2 - \\lambda with \\lambda = (3 - \\sqrt5)/2'],
          'hang-fast': ['two equal masses hanging in a vertical chain from a ceiling (spring, mass, spring, mass; equal springs), in the faster mode', '$-0.618$ (opposite, lower mass moving less)', 'x_2/x_1 = 2 - \\lambda with \\lambda = (3 + \\sqrt5)/2'],
          'dp-slow': ['a double pendulum with equal bobs and equal rods, in the slower mode', '$1.414$ (in step, lower mass moving more)', '\\theta_2/\\theta_1 = \\omega^2/(\\omega_0^2 - \\omega^2) with \\omega^2 = (2 - \\sqrt2)\\omega_0^2'],
          'dp-fast': ['a double pendulum with equal bobs and equal rods, in the faster mode', '$-1.414$ (opposite, lower mass moving more)', '\\theta_2/\\theta_1 = \\omega^2/(\\omega_0^2 - \\omega^2) with \\omega^2 = (2 + \\sqrt2)\\omega_0^2'],
          'wall-slow': ['two equal masses between walls joined by three equal springs, in the slower mode', '$1$ (exactly in step)', 'x_2/x_1 = 2 - \\lambda with \\lambda = 1'],
          'wall-fast': ['two equal masses between walls joined by three equal springs, in the faster mode', '$-1$ (exactly opposite)', 'x_2/x_1 = 2 - \\lambda with \\lambda = 3'],
        };
        const [what, right, why] = data[which];
        const pool = ['$1.618$ (in step, lower mass moving more)', '$-0.618$ (opposite, lower mass moving less)', '$1.414$ (in step, lower mass moving more)', '$-1.414$ (opposite, lower mass moving more)', '$1$ (exactly in step)', '$-1$ (exactly opposite)'];
        const o = mcqOptions(r, right, pool.filter((x) => x !== right).sort((a, b) => (a.length * 7 + which.length) % 5 - (b.length * 7 + which.length) % 5), (v) => v);
        return { q: `What is the amplitude ratio (second coordinate over first) for ${what}?`, ...o,
          sol: `Solve $(K - \\omega^2M)\\vec a = 0$ for that mode: $${why}$, giving ${right}. In-step modes are slower than opposite ones, because opposite motion stretches the coupling more.` };
      } },
    { id: 'nm-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rings',
      make(r) {
        const N = int(r, 3, 8), j = int(r, 1, N - 1), w0 = int(r, 2, 15);
        const answer = round(2 * w0 * Math.abs(Math.sin(Math.PI * j / N)), 4);
        return { q: `${N} equal masses slide on a smooth hoop, joined in a ring by ${N} identical springs, with $\\sqrt{k/m} = ${w0}$ s⁻¹. The modes are travelling waves $x_n \\propto e^{2\\pi i jn/N}$. Find the angular frequency (rad/s) of the mode with $j = ${j}$.`,
          answer, tol: Math.max(0.002, answer * 0.005), unit: 'rad/s', N, j, w0,
          sol: `Substituting into $m\\ddot x_n = k(x_{n+1} - 2x_n + x_{n-1})$ gives $\\omega_j^2 = \\dfrac{2k}{m}\\left(1 - \\cos\\dfrac{2\\pi j}{N}\\right)$, so $\\omega_j = 2\\sqrt{k/m}\\,|\\sin(\\pi j/N)| = 2\\times${w0}\\times|\\sin(${j}\\pi/${N})| = ${answer}$ rad/s.${N - j !== j ? ` (The mode $j = ${N - j}$ has the same frequency.)` : ''}` };
      },
      verify: (p) => 2 * p.w0 * Math.abs(Math.sin(Math.PI * p.j / p.N)) },
    ...more,
  ],
};
