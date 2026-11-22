// Hamiltonian mechanics (GATE / CSIR NET level): the Legendre transform, Hamilton's equations, when H is the energy,
// phase space and phase portraits, Liouville's theorem, action-angle variables and adiabatic invariants.
// Original questions for fibub. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './hamiltonian-mechanics.more.gen.js';
import more2 from './hamiltonian-mechanics.more2.gen.js';
import r4 from './hamiltonian-mechanics.r4.gen.js';
import r5 from './hamiltonian-mechanics.r5.gen.js';

const g = 9.8;

export default {
  topic: 'hamiltonian-mechanics',
  items: [
    // ---------- level 1 ----------
    { id: 'ham-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Legendre transform',
      q: 'For a particle with $L = \\tfrac12 m\\dot x^2 - V(x)$, the Hamiltonian is',
      options: ['$\\dfrac{p^2}{2m} + V(x)$', '$\\dfrac{p^2}{2m} - V(x)$', '$\\dfrac{p^2}{m} - V(x)$', '$\\tfrac12 m\\dot x^2 + V(x)$ written in terms of $\\dot x$'], answer: 0,
      sol: '$p = \\partial L/\\partial\\dot x = m\\dot x$, so $\\dot x = p/m$. $H = p\\dot x - L = \\dfrac{p^2}{m} - \\dfrac{p^2}{2m} + V = \\dfrac{p^2}{2m} + V(x)$.',
      trap: 'The value equals the energy, but a Hamiltonian must be written in terms of $p$, not $\\dot x$; otherwise Hamilton\'s equations cannot be used.' },
    { id: 'ham-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'Hamilton\'s equations of motion are',
      options: ['$\\dot q = -\\partial H/\\partial p,\\ \\dot p = \\partial H/\\partial q$', '$\\dot q = \\partial H/\\partial p,\\ \\dot p = -\\partial H/\\partial q$', '$\\dot q = \\partial H/\\partial q,\\ \\dot p = -\\partial H/\\partial p$', '$\\dot q = \\partial H/\\partial p,\\ \\dot p = \\partial H/\\partial q$'], answer: 1,
      sol: 'Check with $H = p^2/2m + V$: $\\dot q = p/m$ (velocity) and $\\dot p = -V\'(q)$ (force). So $\\dot q = \\partial H/\\partial p$ and $\\dot p = -\\partial H/\\partial q$.',
      trap: 'Remember the sign by testing on a free fall: $\\dot p$ must equal the force $-\\partial V/\\partial q$.' },
    { id: 'ham-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'phase space',
      q: 'The dimension of the phase space of three free point particles moving in three dimensions is ______.',
      answer: 18, tol: 0, calc: () => 2 * 3 * 3,
      sol: 'There are $3\\times3 = 9$ coordinates and 9 conjugate momenta: phase space has $2\\times9 = 18$ dimensions.',
      trap: 'Configuration space has 9 dimensions; phase space doubles it.' },
    { id: 'ham-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'phase space',
      q: 'The trajectory of a one-dimensional harmonic oscillator in its phase plane $(x, p)$ is',
      options: ['a parabola', 'a straight line through the origin', 'an ellipse', 'a hyperbola'], answer: 2,
      sol: 'Energy conservation $\\dfrac{p^2}{2m} + \\tfrac12 m\\omega^2x^2 = E$ is an ellipse with semi-axes $\\sqrt{2E/(m\\omega^2)}$ along $x$ and $\\sqrt{2mE}$ along $p$.',
      trap: 'A parabola in phase space belongs to the free fall, $p^2/2m + mgx = E$.' },
    { id: 'ham-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'For $H = \\dfrac{p^2}{2m} + mgq$, Hamilton\'s equation for $p$ gives',
      options: ['$\\dot p = p/m$', '$\\dot p = mg$', '$\\dot p = 0$', '$\\dot p = -mg$'], answer: 3,
      sol: '$\\dot p = -\\partial H/\\partial q = -mg$: a constant downward force when $q$ is the height.' },
    { id: 'ham-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'A system has $H = \\dfrac{p^2}{2m} + \\tfrac12 kq^2$ with $m = 2$ kg and $k = 8$ N/m. Its angular frequency is ______ rad/s.',
      answer: 2, tol: 0, unit: 'rad/s', calc: () => Math.sqrt(8 / 2),
      sol: '$\\dot q = p/m$ and $\\dot p = -kq$ combine to $\\ddot q = -(k/m)q$, so $\\omega = \\sqrt{k/m} = \\sqrt{4} = 2$ rad/s.' },

    // ---------- level 2 ----------
    { id: 'ham-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'For a particle in a plane with $L = \\tfrac12 m(\\dot r^2 + r^2\\dot\\theta^2) - V(r)$, the Hamiltonian is',
      options: ['$\\dfrac{p_r^2}{2m} + \\dfrac{p_\\theta^2}{2mr^2} + V(r)$', '$\\dfrac{p_r^2}{2m} + \\dfrac{p_\\theta^2}{2m} + V(r)$', '$\\dfrac{p_r^2}{2m} + \\dfrac{r^2p_\\theta^2}{2m} + V(r)$', '$\\dfrac{p_r^2 + p_\\theta^2}{2mr^2} + V(r)$'], answer: 0,
      sol: '$p_r = m\\dot r$ and $p_\\theta = mr^2\\dot\\theta$. Then $T = \\tfrac12 m\\dot r^2 + \\tfrac12 mr^2\\dot\\theta^2 = \\dfrac{p_r^2}{2m} + \\dfrac{p_\\theta^2}{2mr^2}$, and $H = T + V$.',
      trap: 'Substituting $\\dot\\theta = p_\\theta/(mr^2)$ into $\\tfrac12 mr^2\\dot\\theta^2$ leaves one $r^2$ in the denominator.' },
    { id: 'ham-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'For $H = \\dfrac{p^2}{2} + \\dfrac{q^4}{4}$, the value of $\\dot p$ at the instant when $q = 2$ and $p = 3$ is ______.',
      answer: -8, tol: 0, calc: () => -(2 ** 3),
      sol: '$\\dot p = -\\partial H/\\partial q = -q^3 = -8$. (The value of $p$ does not matter here; it sets $\\dot q = p = 3$.)' },
    { id: 'ham-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'when H is the energy',
      q: 'For a system with Lagrangian $L = T - V$, which conditions together guarantee that the Hamiltonian equals the total energy $T + V$?',
      options: ['The constraints do not depend on time', 'The potential does not depend on the velocities', 'The Lagrangian has no explicit time dependence', 'The kinetic energy is a homogeneous quadratic function of the generalised velocities'], answer: [0, 1, 3],
      sol: 'Euler\'s theorem for a homogeneous quadratic $T$ gives $\\sum\\dot q_k\\,\\partial T/\\partial\\dot q_k = 2T$. If $V$ has no velocities, $H = 2T - (T - V) = T + V$. Time-independent constraints are what make $T$ homogeneous quadratic (moving constraints add linear and constant terms). Explicit time dependence in $L$ decides whether $H$ is conserved, not whether it equals $T + V$.',
      trap: '"$H = E$" and "$H$ is conserved" are separate questions.' },
    { id: 'ham-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'The Hamiltonian of a charge $q$ (mass $m$) in fields with potentials $\\phi$ and $\\vec A$ is',
      options: ['$\\dfrac{(\\vec p + q\\vec A)^2}{2m} + q\\phi$', '$\\dfrac{(\\vec p - q\\vec A)^2}{2m} + q\\phi$', '$\\dfrac{p^2}{2m} + q\\phi - q\\vec v\\cdot\\vec A$', '$\\dfrac{(\\vec p - q\\vec A)^2}{2m} - q\\phi$'], answer: 1,
      sol: 'From $L = \\tfrac12 mv^2 - q\\phi + q\\vec v\\cdot\\vec A$: $\\vec p = m\\vec v + q\\vec A$, so $m\\vec v = \\vec p - q\\vec A$. $H = \\vec p\\cdot\\vec v - L = \\tfrac12 mv^2 + q\\phi = \\dfrac{(\\vec p - q\\vec A)^2}{2m} + q\\phi$. The magnetic field does no work, so it appears only through $\\vec p - q\\vec A$.',
      trap: 'The third option still contains $\\vec v$; a Hamiltonian must be a function of $\\vec p$.' },
    { id: 'ham-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'phase space',
      q: 'A harmonic oscillator of mass 1 kg and angular frequency 2 rad/s has energy 3 J. The area enclosed by its orbit in the $(x, p)$ plane is $k\\pi$ J s. The value of $k$ is ______.',
      answer: 3, tol: 0, calc: () => 2 * 3 / 2,
      sol: 'The ellipse has semi-axes $a = \\sqrt{2E/(m\\omega^2)}$ and $b = \\sqrt{2mE}$, so the area is $\\pi ab = \\pi\\cdot\\dfrac{2E}{\\omega} = \\pi\\times\\dfrac{2\\times3}{2} = 3\\pi$ J s.',
      trap: 'The area $\\oint p\\,dx = 2\\pi E/\\omega$ is the action; in quantum mechanics it is $(n + \\tfrac12)h$.' },
    { id: 'ham-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Liouville\'s theorem',
      q: 'Liouville\'s theorem states that, for a Hamiltonian system,',
      options: ['every trajectory is closed', 'the energy of each member of an ensemble is the same', 'the density of an ensemble of systems in phase space stays constant along each trajectory', 'the phase-space volume of an ensemble shrinks to a point over time'], answer: 2,
      sol: 'The Hamiltonian flow has zero divergence in phase space, $\\partial\\dot q/\\partial q + \\partial\\dot p/\\partial p = \\partial^2 H/\\partial q\\partial p - \\partial^2 H/\\partial p\\partial q = 0$. So $d\\rho/dt = 0$ along the flow: phase-space volumes keep their size (they may change shape).',
      trap: 'Volumes are preserved, not shapes: an ensemble blob can stretch into a long thin filament.' },
    { id: 'ham-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'phase space',
      q: 'For a Hamiltonian $H(q, p)$ with no explicit time dependence, which statements are correct?',
      options: ['Two different phase-space trajectories never cross', 'The phase-space area of a set of initial conditions is preserved', 'Some trajectories can spiral into a stable point (an attractor)', 'The value of $H$ changes slowly along a trajectory'], answer: [0, 1],
      sol: 'A: through each point $(q, p)$ Hamilton\'s equations give a unique velocity, so trajectories cannot cross. B: Liouville\'s theorem. C: an attractor would shrink areas, which Liouville forbids; spirals need damping. D: $dH/dt = \\partial H/\\partial t = 0$, so $H$ is exactly constant.',
      trap: 'A separatrix seems to cross itself at a saddle point, but the saddle is a separate trajectory (a fixed point) that the others only approach as $t \\to \\pm\\infty$.' },
    { id: 'ham-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'A system has $H = \\dfrac{p^2}{6} + 5q$. Working back to the Lagrangian, the value of $L$ when $q = 1$ and $\\dot q = 2$ is ______.',
      answer: 1, tol: 0, calc: () => 0.5 * 3 * 4 - 5,
      sol: '$\\dot q = \\partial H/\\partial p = p/3$, so $p = 3\\dot q$. $L = p\\dot q - H = 3\\dot q^2 - \\tfrac32\\dot q^2 - 5q = \\tfrac32\\dot q^2 - 5q = 6 - 5 = 1$.',
      trap: '$H$ has $p^2/6$, which means a mass of 3 (not 6).' },
    { id: 'ham-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'For a free relativistic particle with $H = \\sqrt{p^2c^2 + m^2c^4}$, Hamilton\'s equation gives the velocity $\\dot q$ as',
      options: ['$p/m$', '$c$', '$\\dfrac{p^2c^2}{\\sqrt{p^2c^2 + m^2c^4}}$', '$\\dfrac{pc^2}{\\sqrt{p^2c^2 + m^2c^4}}$'], answer: 3,
      sol: '$\\dot q = \\partial H/\\partial p = \\dfrac{pc^2}{\\sqrt{p^2c^2 + m^2c^4}} = \\dfrac{pc^2}{E}$, which is always less than $c$ and becomes $p/m$ when $p \\ll mc$.' },
    { id: 'ham-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cyclic coordinates',
      q: 'If a coordinate $q_k$ does not appear in the Hamiltonian, then',
      options: ['$p_k$ is a constant of the motion', '$q_k$ is a constant of the motion', '$\\dot q_k = 0$', '$H$ cannot depend on $p_k$'], answer: 0,
      sol: '$\\dot p_k = -\\partial H/\\partial q_k = 0$. The coordinate itself changes at the rate $\\dot q_k = \\partial H/\\partial p_k$, which is then a function of the constant $p_k$ and the other variables. Since $p_k$ is just a constant, the problem loses one degree of freedom.' },

    // ---------- level 3 ----------
    { id: 'ham-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'A particle of mass $m$ is confined to the surface of a sphere of radius $R$ with no potential. In the usual polar angles $(\\theta, \\phi)$ its Hamiltonian is',
      options: ['$\\dfrac{p_\\theta^2 + p_\\phi^2}{2mR^2}$', '$\\dfrac{1}{2mR^2}\\left(p_\\theta^2 + \\dfrac{p_\\phi^2}{\\sin^2\\theta}\\right)$', '$\\dfrac{1}{2mR^2}\\left(p_\\theta^2 + p_\\phi^2\\sin^2\\theta\\right)$', '$\\dfrac{mR^2}{2}\\left(p_\\theta^2 + \\dfrac{p_\\phi^2}{\\sin^2\\theta}\\right)$'], answer: 1,
      sol: '$L = \\tfrac12 mR^2(\\dot\\theta^2 + \\sin^2\\theta\\,\\dot\\phi^2)$. $p_\\theta = mR^2\\dot\\theta$, $p_\\phi = mR^2\\sin^2\\theta\\,\\dot\\phi$. So $H = \\dfrac{p_\\theta^2}{2mR^2} + \\dfrac{p_\\phi^2}{2mR^2\\sin^2\\theta}$. (Quantum mechanics turns this into $\\hat L^2/2mR^2$, the rigid rotor.)' },
    { id: 'ham-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'action-angle variables',
      q: 'A particle bounces back and forth with speed $v$ between two hard walls a distance $a$ apart. Its action is $J = \\oint p\\,dq = 2amv$, so $H = J^2/(8ma^2)$. For $a = 0.5$ m and $v = 3$ m/s, the frequency $\\nu = \\partial H/\\partial J$ is ______ Hz.',
      answer: 3, tol: 0.01, unit: 'Hz', calc: () => 3 / (2 * 0.5),
      sol: '$\\nu = \\dfrac{\\partial H}{\\partial J} = \\dfrac{J}{4ma^2} = \\dfrac{2amv}{4ma^2} = \\dfrac{v}{2a} = \\dfrac{3}{1} = 3$ Hz. Check directly: one round trip covers $2a = 1$ m at 3 m/s, so 3 round trips per second.',
      trap: 'With $J = \\oint p\\,dq$ (no $2\\pi$), the derivative $\\partial H/\\partial J$ is a frequency in Hz, not an angular frequency.' },
    { id: 'ham-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: 'The spring of an oscillator is stiffened very slowly (over many periods) until its angular frequency has doubled. Its energy',
      options: ['stays the same', 'is halved', 'quadruples', 'doubles'], answer: 3,
      sol: 'For a slow change the action $J = \\oint p\\,dx = 2\\pi E/\\omega$ is an adiabatic invariant. With $E/\\omega$ fixed, doubling $\\omega$ doubles $E$. (Quantum version: the oscillator stays in level $n$, whose energy $(n + \\tfrac12)\\hbar\\omega$ doubles.)',
      trap: 'Energy is not conserved: the slowly changing spring does work. What stays fixed is $E/\\omega$.' },
    { id: 'ham-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: 'The angular frequency of an oscillator is raised very slowly from 2 rad/s to 8 rad/s (the mass stays the same). The ratio of the final amplitude to the initial amplitude is ______.',
      answer: 0.5, tol: 0.005, calc: () => Math.sqrt(2 / 8),
      sol: '$E/\\omega$ is invariant and $E = \\tfrac12 m\\omega^2A^2$, so $\\omega A^2$ is constant and $A \\propto \\omega^{-1/2}$. Ratio $= (2/8)^{1/2} = 0.5$.',
      trap: 'Energy goes up by 4 but the amplitude still falls, because $E$ grows more slowly than $\\omega^2$.' },
    { id: 'ham-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'when H is the energy',
      q: 'Which statements about the Hamiltonian $H(q, p, t)$ are correct?',
      options: ['Along the motion, $dH/dt = \\partial H/\\partial t$', 'If $H$ depends explicitly on time, $H$ is not conserved', '$H$ can be conserved even when it is not the total energy', '$H$ is always the total energy of the system'], answer: [0, 1, 2],
      sol: 'A: $\\dfrac{dH}{dt} = \\dfrac{\\partial H}{\\partial q}\\dot q + \\dfrac{\\partial H}{\\partial p}\\dot p + \\dfrac{\\partial H}{\\partial t}$, and the first two terms cancel by Hamilton\'s equations. B follows. C: a bead on a hoop driven at constant speed has a conserved $H$ that is not $T + V$. D is false for the same reason, and for any time-dependent constraint.' },
    { id: 'ham-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hamilton\'s equations',
      q: 'A system has $H = \\tfrac12(p^2 + q^2) + 0.6\\,qp$ (in suitable units). Its motion is periodic with angular frequency ______.',
      answer: 0.8, tol: 0.005, calc: () => Math.sqrt(1 - 0.36),
      sol: '$\\dot q = \\partial H/\\partial p = p + 0.6q$ and $\\dot p = -\\partial H/\\partial q = -q - 0.6p$. For $e^{\\lambda t}$: $\\det\\begin{pmatrix}0.6 - \\lambda & 1\\\\ -1 & -0.6 - \\lambda\\end{pmatrix} = \\lambda^2 - 0.36 + 1 = 0$, so $\\lambda = \\pm 0.8i$ and $\\omega = 0.8$.',
      trap: 'The cross term does not damp anything (Liouville forbids it); it lowers the frequency, and for a coefficient above 1 the motion would become unbounded.' },
    { id: 'ham-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'For a simple pendulum (mass $m$, length $l$), with the energy zero at the lowest point, the separatrix in the $(\\theta, p_\\theta)$ phase portrait, which divides swinging from full rotation, has energy',
      options: ['$mgl$', '$\\tfrac12 mgl$', '$4mgl$', '$2mgl$'], answer: 3,
      sol: 'The separatrix passes through the unstable equilibrium at the top, $\\theta = \\pm\\pi$, where the pendulum is at rest at height $2l$. So its energy is $2mgl$. Below it the motion is libration (closed loops round the origin); above it, rotation (wavy lines).',
      trap: '$mgl$ is the energy to reach the horizontal, not the top.' },
    { id: 'ham-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'A pendulum has a 0.5 kg bob on a light rigid rod of length 0.4 m. Where its separatrix crosses $\\theta = 0$, the angular momentum $p_\\theta = ml^2\\dot\\theta$ is ______ kg m²/s ($g = 9.8$ m/s²).',
      answer: 0.792, tol: 0.008, unit: 'kg m²/s', calc: () => 0.5 * 0.16 * 2 * Math.sqrt(9.8 / 0.4),
      sol: 'On the separatrix $\\tfrac12 ml^2\\dot\\theta^2 = 2mgl$ at the bottom, so $\\dot\\theta = 2\\sqrt{g/l} = 2\\sqrt{24.5} = 9.90$ rad/s. Then $p_\\theta = 0.5\\times0.16\\times9.90 = 0.792$ kg m²/s.' },
    { id: 'ham-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'A system has $L = \\tfrac12\\dot q^2 + q\\dot q - \\tfrac12 q^2$. Its Hamiltonian is',
      options: ['$\\tfrac12(p - q)^2 + \\tfrac12 q^2$', '$\\tfrac12 p^2 + \\tfrac12 q^2$', '$\\tfrac12(p + q)^2 + \\tfrac12 q^2$', '$\\tfrac12(p - q)^2 - \\tfrac12 q^2$'], answer: 0,
      sol: '$p = \\dot q + q$, so $\\dot q = p - q$. $H = p\\dot q - L = (p - q)(p) - \\tfrac12(p - q)^2 - q(p - q) + \\tfrac12 q^2 = \\tfrac12(p - q)^2 + \\tfrac12 q^2$. (Since $q\\dot q$ is a total derivative the motion is still $\\ddot q = -q$; the Hamiltonian looks different because $p$ is shifted.)',
      trap: 'Dropping the $q\\dot q$ term before the Legendre transform gives $\\tfrac12(p^2 + q^2)$, which uses a different $p$.' },
    { id: 'ham-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'For $H = \\dfrac{p^2}{2} - \\dfrac{q^2}{2} + \\dfrac{q^4}{4}$, which statements about the fixed points in the phase plane are correct?',
      options: ['$(0, 0)$ is a saddle point', '$(\\pm1, 0)$ are centres', '$(0, 0)$ is a centre', 'There are exactly three fixed points'], answer: [0, 1, 3],
      sol: 'Fixed points need $p = 0$ and $V\'(q) = -q + q^3 = 0$: $q = 0, \\pm1$, three in all. $V\'\'(q) = -1 + 3q^2$: at $q = 0$ it is $-1$ (a maximum of $V$, a saddle); at $q = \\pm1$ it is $2$ (minima, centres). The separatrix through the saddle is a figure of eight around the two wells.' },
    { id: 'ham-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Liouville\'s theorem',
      q: 'An ensemble of damped oscillators obeys $\\ddot x + \\gamma\\dot x + \\omega^2x = 0$ with $\\gamma = 0.5$ s⁻¹. The area occupied by the ensemble in the $(x, \\dot x)$ plane after 2 s, as a fraction of its initial area, is ______.',
      answer: 0.3679, tol: 0.004, calc: () => Math.exp(-1),
      sol: 'The flow is $\\dot x = v$, $\\dot v = -\\omega^2x - \\gamma v$. Its divergence is $\\partial\\dot x/\\partial x + \\partial\\dot v/\\partial v = -\\gamma$, so areas shrink as $e^{-\\gamma t} = e^{-1} = 0.368$. Damped systems are not Hamiltonian, so Liouville\'s theorem does not apply.',
      trap: 'For an undamped oscillator the answer would be exactly 1.' },
    { id: 'ham-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cyclic coordinates',
      q: 'A particle moves in the plane with $H = \\dfrac{p_r^2}{2m} + \\dfrac{p_\\theta^2}{2mr^2} + \\tfrac12 kr^2$ and fixed $p_\\theta = \\ell \\neq 0$. A circular orbit has radius $r_0$ given by',
      options: ['$r_0^2 = \\dfrac{\\ell^2}{mk}$', '$r_0^4 = \\dfrac{\\ell^2}{mk}$', '$r_0^4 = \\dfrac{2\\ell^2}{mk}$', '$r_0^3 = \\dfrac{\\ell^2}{mk}$'], answer: 1,
      sol: '$\\dot p_r = -\\partial H/\\partial r = \\dfrac{\\ell^2}{mr^3} - kr$. A circle needs $\\dot p_r = 0$: $\\ell^2/(mr_0^3) = kr_0$, so $r_0^4 = \\ell^2/(mk)$.' },
    { id: 'ham-038', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'The trajectories in the phase plane for the Hamiltonian $H = qp$ are',
      options: ['circles round the origin', 'hyperbolas $qp = $ constant', 'straight lines through the origin', 'ellipses'], answer: 1,
      sol: '$\\dot q = \\partial H/\\partial p = q$ and $\\dot p = -\\partial H/\\partial q = -p$, so $q = q_0e^t$, $p = p_0e^{-t}$ and $qp$ stays constant (it is $H$). The flow stretches $q$ and squeezes $p$ by the same factor, keeping areas fixed, as Liouville requires.',
      trap: 'Lines through the origin would be $q/p$ constant; here it is the product that is conserved.' },

    // ---------- level 4 ----------
    { id: 'ham-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'action-angle variables',
      q: 'A particle of mass 1 kg moves in the potential $V(q) = F|q|$ with $F = 2$ N. The action is $J = \\oint p\\,dq = \\dfrac{8\\sqrt{2m}}{3F}E^{3/2}$. For $E = 8$ J, the period $T = dJ/dE$ is ______ s.',
      answer: 8, tol: 0.05, unit: 's', calc: () => 4 * Math.sqrt(2 * 1 * 8) / 2,
      sol: '$T = \\dfrac{dJ}{dE} = \\dfrac{4\\sqrt{2m}}{F}E^{1/2} = \\dfrac{4\\sqrt{2mE}}{F} = \\dfrac{4\\times4}{2} = 8$ s. Check: from $q = 0$ the particle (speed $\\sqrt{2E/m} = 4$ m/s) is slowed at $F/m = 2$ m/s² and stops after 2 s; a full cycle is four such quarters, 8 s.' },
    { id: 'ham-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'action-angle variables',
      q: 'A particle oscillates in the potential $V(q) = \\lambda q^4$. Using the action integral, its period depends on the energy as',
      options: ['$T \\propto E^{1/4}$', '$T$ independent of $E$', '$T \\propto E^{-1/4}$', '$T \\propto E^{-1/2}$'], answer: 2,
      sol: 'Turning points at $q_{\\max} \\propto E^{1/4}$. $J = \\oint\\sqrt{2m(E - \\lambda q^4)}\\,dq \\propto E^{1/2}\\cdot E^{1/4} = E^{3/4}$ (scale $q = q_{\\max}u$). Then $T = dJ/dE \\propto E^{-1/4}$: higher energy, shorter period. In general $V \\propto |q|^n$ gives $T \\propto E^{1/n - 1/2}$.',
      trap: 'Only the harmonic case ($n = 2$) is isochronous.' },
    { id: 'ham-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'variational principle',
      q: 'Hamilton\'s equations follow from the modified principle $\\delta\\displaystyle\\int_{t_1}^{t_2}\\left(p\\dot q - H(q, p, t)\\right)dt = 0$. Which statements are correct?',
      options: ['$q(t)$ and $p(t)$ are varied independently', 'Varying $p$ gives $\\dot q = \\partial H/\\partial p$ and varying $q$ gives $\\dot p = -\\partial H/\\partial q$', 'The variations $\\delta p$ must also vanish at the end points, or the equations come out different', 'Adding $\\dfrac{d}{dt}F(q, t)$ to the integrand changes the equations of motion'], answer: [0, 1],
      sol: 'A and B: $\\delta p$ multiplies $\\dot q - \\partial H/\\partial p$, and after integrating $p\\,\\delta\\dot q$ by parts, $\\delta q$ multiplies $-\\dot p - \\partial H/\\partial q$. C: no $\\dot p$ appears in the integrand, so no boundary term in $\\delta p$ arises; only $\\delta q = 0$ at the ends is needed. D: a total derivative of $F(q, t)$ adds only an end-point term, which vanishes when $\\delta q = 0$ there; this freedom is the root of canonical transformations.' },
    { id: 'ham-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: 'A pendulum swings with a small amplitude while its string is pulled up very slowly through the pivot, halving its length from 1.0 m to 0.5 m. The ratio of the new angular amplitude to the old is ______.',
      answer: 1.682, tol: 0.01, calc: () => 2 ** 0.75,
      sol: 'The invariant is $E/\\omega$. With $E = \\tfrac12 mgl\\theta_0^2$ and $\\omega = \\sqrt{g/l}$: $E/\\omega \\propto l\\theta_0^2\\cdot l^{1/2} = l^{3/2}\\theta_0^2$. So $\\theta_0 \\propto l^{-3/4}$ and the ratio is $2^{3/4} = 1.682$.',
      trap: 'The angle grows while the arc length $l\\theta_0$ shrinks (by $2^{-1/4}$).' },
    { id: 'ham-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cyclic coordinates',
      q: 'A charge $q > 0$ moves in the $xy$ plane in a uniform field $B\\hat z$, using the gauge $\\vec A = (0, Bx, 0)$, so $H = \\dfrac{p_x^2 + (p_y - qBx)^2}{2m}$. Which statement is correct?',
      options: ['$p_x$ is conserved and the orbit is centred at $y_0 = p_x/qB$', '$p_y$ is conserved and equals $m\\dot y$', '$H$ is not conserved because the field bends the path', '$p_y$ is conserved and the orbit is centred on the line $x_0 = p_y/qB$'], answer: 3,
      sol: '$y$ is cyclic, so $p_y$ is constant. Then $H = \\dfrac{p_x^2}{2m} + \\dfrac{q^2B^2}{2m}(x - p_y/qB)^2$: a harmonic oscillator in $x$ at frequency $qB/m$, centred at $x_0 = p_y/qB$. The kinetic momentum is $m\\dot y = p_y - qBx$, not $p_y$. $H$ has no explicit $t$, so the speed is constant.',
      trap: 'In this gauge the canonical $p_y$ labels the guiding-centre position, not the velocity.' },
    { id: 'ham-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'A particle of mass 0.5 kg has $H = \\dfrac{p^2}{2m} - 2q^2 + bq^4$ with $b > 0$ (SI units). The angular frequency of small oscillations about either stable fixed point is ______ rad/s (it does not depend on $b$).',
      answer: 4, tol: 0.02, unit: 'rad/s', calc: () => Math.sqrt(4 * 2 / 0.5),
      sol: '$V = -aq^2 + bq^4$ with $a = 2$: $V\' = -2aq + 4bq^3 = 0$ gives $q^2 = a/2b$. $V\'\' = -2a + 12bq^2 = -2a + 6a = 4a = 8$ N/m. $\\omega = \\sqrt{8/0.5} = 4$ rad/s.' },
    { id: 'ham-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: 'In axes rotating at constant $\\Omega$ about $z$, a particle has $L = \\tfrac12 m\\left[(\\dot x - \\Omega y)^2 + (\\dot y + \\Omega x)^2\\right] - V$. Its Hamiltonian is',
      options: ['$\\dfrac{p_x^2 + p_y^2}{2m} - \\Omega(xp_y - yp_x) + V$', '$\\dfrac{p_x^2 + p_y^2}{2m} + \\Omega(xp_y - yp_x) + V$', '$\\dfrac{p_x^2 + p_y^2}{2m} + V$', '$\\dfrac{p_x^2 + p_y^2}{2m} - \\tfrac12 m\\Omega^2(x^2 + y^2) + V$'], answer: 0,
      sol: '$p_x = m(\\dot x - \\Omega y)$ and $p_y = m(\\dot y + \\Omega x)$. Then $H = p_x\\dot x + p_y\\dot y - L$ with $\\dot x = p_x/m + \\Omega y$ and $\\dot y = p_y/m - \\Omega x$: $H = \\dfrac{p^2}{2m} + \\Omega(yp_x - xp_y) + V = \\dfrac{p^2}{2m} - \\Omega L_z + V$. It is conserved (the Jacobi integral), although it is not the inertial energy.',
      trap: 'Here $p$ is the inertial momentum written in rotating coordinates; the centrifugal term appears only after rewriting in terms of $\\dot x$, $\\dot y$.' },
    { id: 'ham-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Liouville\'s theorem',
      q: 'In which of these systems is the phase-space volume of an ensemble (in canonical coordinates) preserved?',
      options: ['An undamped pendulum', 'A charged particle in a static magnetic field', 'An oscillator with viscous damping', 'An oscillator whose spring constant is changed with time in a prescribed way'], answer: [0, 1, 3],
      sol: 'Liouville\'s theorem holds for any Hamiltonian system, including one whose $H$ depends explicitly on time (D) and one with velocity-dependent magnetic forces (B), as long as canonical $(\\vec r, \\vec p)$ are used. Viscous damping (C) is not Hamiltonian and shrinks volumes as $e^{-\\gamma t}$.',
      trap: 'An explicitly time-dependent $H$ breaks energy conservation, not Liouville\'s theorem.' },
    { id: 'ham-039', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: 'A particle bounces between two hard walls. The walls are moved together very slowly, from 2 m apart to 1 m apart. The ratio of the final kinetic energy to the initial is ______.',
      answer: 4, tol: 0.01, calc: () => (2 / 1) ** 2,
      sol: 'The action $J = \\oint p\\,dq = 2ap$ is adiabatically invariant, so $p \\propto 1/a$ doubles and $E = p^2/2m$ grows by 4. (Each bounce off the approaching wall adds a little speed; this is also why a gas heats under slow compression, $E \\propto V^{-2/3}$ in 3D.)' },

    // ---------- level 5 ----------
    { id: 'ham-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'phase portraits',
      q: 'For a pendulum with $m = 1$ kg and $l = 1$ m, the area of the region enclosed by the separatrix in the $(\\theta, p_\\theta)$ plane, between $\\theta = -\\pi$ and $\\pi$, is ______ J s ($g = 9.8$ m/s²).',
      answer: 50.09, tol: 0.5, unit: 'J s', calc: () => 16 * Math.sqrt(9.8),
      sol: 'On the separatrix $\\tfrac12 ml^2\\dot\\theta^2 = mgl(1 + \\cos\\theta)$, so $p_\\theta = ml^2\\dot\\theta = 2ml^2\\sqrt{g/l}\\cos(\\theta/2)$. Area $= 2\\displaystyle\\int_{-\\pi}^{\\pi} 2ml^2\\sqrt{g/l}\\cos(\\theta/2)\\,d\\theta = 4ml^2\\sqrt{g/l}\\times4 = 16m\\sqrt{gl^3} = 16\\sqrt{9.8} = 50.1$ J s.',
      trap: 'Remember both halves ($p_\\theta > 0$ and $< 0$) and that $\\int_{-\\pi}^{\\pi}\\cos(\\theta/2)\\,d\\theta = 4$.' },
    { id: 'ham-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'action-angle variables',
      q: 'Which statements about action-angle variables $(J, w)$ of a one-dimensional periodic system, with $J = \\oint p\\,dq$, are correct?',
      options: ['The angle variable increases linearly in time, $w = \\nu t + w_0$', 'The frequency of the motion is $\\nu = \\partial H/\\partial J$', 'The action is an adiabatic invariant under slow changes of a parameter', 'The action stays invariant even when a slow change carries the orbit across a separatrix'], answer: [0, 1, 2],
      sol: 'In action-angle variables $H = H(J)$, so $\\dot w = \\partial H/\\partial J = \\nu$, a constant. The adiabatic theorem says $J$ is conserved to high accuracy when parameters change slowly compared with the period. Near a separatrix the period becomes infinitely long, the change is no longer slow by comparison, and the invariance fails (the action jumps).',
      trap: 'Adiabatic invariance needs the period to be short compared with the time scale of change; at a separatrix the period diverges.' },
    { id: 'ham-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: 'A particle oscillates in the potential $V = F|q|$. The force constant $F$ is slowly doubled. The ratio of the final energy to the initial energy is ______.',
      answer: 1.587, tol: 0.005, calc: () => 2 ** (2 / 3),
      sol: 'The action is $J = \\dfrac{8\\sqrt{2m}}{3F}E^{3/2}$. Keeping $J$ fixed, $E^{3/2} \\propto F$, so $E \\propto F^{2/3}$ and the ratio is $2^{2/3} = 1.587$.' },
    { id: 'ham-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'action-angle variables',
      q: 'A particle oscillates in a symmetric potential $V \\propto |q|^n$. Its period is found to vary with energy as $T \\propto E^{-1/4}$. The exponent $n$ is',
      options: ['$1$', '$4/3$', '$4$', '$2$'], answer: 2,
      sol: 'Scaling the action integral: $J \\propto E^{1/2}\\cdot E^{1/n}$, so $T = dJ/dE \\propto E^{1/n - 1/2}$. Setting $1/n - 1/2 = -1/4$ gives $n = 4$.',
      trap: '$n = 4/3$ gives $T \\propto E^{+1/4}$: the sign of the exponent matters.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'ham-g01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Hamilton\'s equations',
      make(r) {
        const [m, w] = choose(r, [[1, 2], [2, 3], [0.5, 4], [4, 1.5], [3, 2], [0.25, 6], [2, 5]]);
        const k = round(m * w * w, 4);
        return { q: `A system has $H = \\dfrac{p^2}{${2 * m}} + ${round(k / 2, 4)}\\,q^2$ (SI units). Find its angular frequency in rad/s.`,
          answer: w, tol: 0.01, unit: 'rad/s', m, k,
          sol: `Comparing with $p^2/2m + \\tfrac12 kq^2$: $m = ${m}$ kg and $k = ${k}$ N/m. Hamilton's equations give $\\ddot q = -(k/m)q$, so $\\omega = \\sqrt{${k}/${m}} = ${w}$ rad/s.`,
          trap: 'The coefficient of $p^2$ is $1/2m$ and that of $q^2$ is $k/2$; read off $m$ and $k$ before taking the square root.' };
      },
      verify: (p) => Math.sqrt(p.k / p.m) },
    { id: 'ham-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'phase space',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), w = int(r, 1, 6), E = int(r, 1, 12);
        const answer = round(2 * E / w, 3);
        return { q: `An oscillator of mass ${m} kg and angular frequency ${w} rad/s has energy ${E} J. The area enclosed by its phase-space orbit in the $(x, p)$ plane is $k\\pi$ J s. Find $k$.`,
          answer, tol: Math.max(0.01, answer * 0.005), E, w,
          sol: `Semi-axes $\\sqrt{2E/(m\\omega^2)}$ and $\\sqrt{2mE}$; area $= \\pi\\cdot 2E/\\omega$, independent of the mass. $k = 2\\times${E}/${w} = ${answer}$.`,
          trap: 'The mass cancels; it only changes the shape of the ellipse.' };
      },
      verify: (p) => 2 * p.E / p.w },
    { id: 'ham-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hamilton\'s equations',
      make(r) {
        const a = int(r, 1, 4), n = int(r, 2, 4), q = int(r, -2, 3) || 1, p = int(r, -3, 3);
        const answer = -n * a * q ** (n - 1);
        return { q: `For $H = \\dfrac{p^2}{2} + ${a === 1 ? '' : a}q^{${n}}$, find $\\dot p$ at the instant when $q = ${q}$ and $p = ${p}$.`,
          answer, tol: 0, a, n, qv: q,
          sol: `$\\dot p = -\\partial H/\\partial q = -${n * a}q^{${n - 1}} = -${n * a}\\times(${q})^{${n - 1}} = ${answer}$. The momentum value only fixes $\\dot q = p = ${p}$.` };
      },
      verify: (x) => -x.n * x.a * x.qv ** (x.n - 1) },
    { id: 'ham-g04', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre transform',
      make(r) {
        const a = int(r, 2, 5), b = int(r, 1, 4), c = int(r, 1, 5);
        const show = (v) => `$H = ${v}$`;
        const right = `\\dfrac{(p - ${b})^2}{${2 * a}} + ${c}q^2`;
        const o = mcqOptions(r, right, [`\\dfrac{(p + ${b})^2}{${2 * a}} + ${c}q^2`, `\\dfrac{p^2}{${2 * a}} + ${c}q^2`, `\\dfrac{(p - ${b})^2}{${2 * a}} - ${c}q^2`], show);
        return { q: `A system has $L = \\tfrac{${a}}{2}\\dot q^2 + ${b}\\dot q - ${c}q^2$. Its Hamiltonian is`, ...o,
          sol: `$p = ${a}\\dot q + ${b}$, so $\\dot q = (p - ${b})/${a}$. $H = p\\dot q - L = \\tfrac{${a}}{2}\\dot q^2 + ${c}q^2 = \\dfrac{(p - ${b})^2}{${2 * a}} + ${c}q^2$. The linear term $${b}\\dot q$ is a total derivative, so the motion is unchanged, but it shifts $p$.`,
          trap: 'Dropping the linear term too early gives $p^2/2m$, which uses a different momentum.' };
      } },
    { id: 'ham-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      make(r) {
        const w1 = int(r, 1, 6), w2 = int(r, 2, 12);
        const ask = choose(r, ['amplitude', 'energy']);
        const answer = round(ask === 'amplitude' ? Math.sqrt(w1 / w2) : w2 / w1, 4);
        return { q: `The angular frequency of an oscillator (fixed mass) is changed very slowly from ${w1} rad/s to ${w2} rad/s. Find the ratio of the final ${ask} to the initial ${ask}.`,
          answer, tol: Math.max(0.005, answer * 0.005), w1, w2, ask,
          sol: `The adiabatic invariant is $E/\\omega$, so $E \\propto \\omega$. With $E = \\tfrac12 m\\omega^2A^2$, $A \\propto \\omega^{-1/2}$. ${ask === 'amplitude' ? `Ratio $= \\sqrt{${w1}/${w2}} = ${answer}$.` : `Ratio $= ${w2}/${w1} = ${answer}$.`}`,
          trap: 'Energy is not conserved during the change; $E/\\omega$ is.' };
      },
      verify: (p) => (p.ask === 'amplitude' ? Math.sqrt(p.w1 / p.w2) : p.w2 / p.w1) },
    { id: 'ham-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      make(r) {
        const l1 = pick(r, 0.5, 2, 0.25), f = choose(r, [2, 3, 4, 0.5, 0.25]);
        const l2 = round(l1 / f, 4), answer = round(f ** 0.75, 4);
        return { q: `A pendulum swings with a small amplitude while its length is changed very slowly from ${l1} m to ${l2} m. Find the ratio of the new angular amplitude to the old.`,
          answer, tol: Math.max(0.005, answer * 0.005), l1, l2,
          sol: `$E/\\omega$ is invariant, with $E = \\tfrac12 mgl\\theta_0^2$ and $\\omega = \\sqrt{g/l}$, so $l^{3/2}\\theta_0^2$ is constant and $\\theta_0 \\propto l^{-3/4}$. Ratio $= (${l1}/${l2})^{3/4} = ${answer}$.` };
      },
      verify: (p) => (p.l1 / p.l2) ** 0.75 },
    { id: 'ham-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'action-angle variables',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), F = int(r, 1, 6), E = int(r, 1, 20);
        const answer = round(4 * Math.sqrt(2 * m * E) / F, 3);
        return { q: `A particle of mass ${m} kg moves in $V(q) = ${F}|q|$ (newtons and metres) with energy ${E} J. Using $T = dJ/dE$ with $J = \\oint p\\,dq$, find the period in seconds.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 's', m, F, E,
          sol: `$J = 4\\displaystyle\\int_0^{E/F}\\sqrt{2m(E - Fq)}\\,dq = \\dfrac{8\\sqrt{2m}}{3F}E^{3/2}$, so $T = \\dfrac{4\\sqrt{2mE}}{F} = \\dfrac{4\\sqrt{2\\times${m}\\times${E}}}{${F}} = ${answer}$ s.`,
          trap: 'The period grows as $\\sqrt E$ here; only a quadratic potential gives a period independent of energy.' };
      },
      verify: (p) => 4 * Math.sqrt(2 * p.m * p.E) / p.F },
    { id: 'ham-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hamilton\'s equations',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 5, 12), ok = choose(r, [-2, -1, 1, 2]);
        const answer = round(Math.sqrt(a * b - ok * ok), 4);
        const cross = ok === 0 ? '' : ` ${ok < 0 ? '-' : '+'} ${Math.abs(ok) === 1 ? '' : Math.abs(ok)}qp`;
        return { q: `A system has $H = \\tfrac12(${a === 1 ? '' : a}p^2 + ${b === 1 ? '' : b}q^2)${cross}$ (in suitable units). Find the angular frequency of its periodic motion.`,
          answer, tol: Math.max(0.005, answer * 0.005), a, b, c: ok,
          sol: `$\\dot q = ${a}p ${ok < 0 ? '-' : '+'} ${Math.abs(ok)}q$, $\\dot p = -${b}q ${ok < 0 ? '+' : '-'} ${Math.abs(ok)}p$. For solutions $e^{\\lambda t}$, $\\lambda^2 = c^2 - ab = ${ok * ok} - ${a * b}$, so $\\omega = \\sqrt{ab - c^2} = \\sqrt{${a * b - ok * ok}} = ${answer}$.`,
          trap: 'A $qp$ term does not damp the motion; it lowers the frequency to $\\sqrt{ab - c^2}$.' };
      },
      verify: (p) => Math.sqrt(p.a * p.b - p.c * p.c) },
    { id: 'ham-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Liouville\'s theorem',
      make(r) {
        const gm = pick(r, 0.1, 1, 0.1), t = int(r, 1, 6);
        const answer = round(Math.exp(-gm * t), 4);
        return { q: `An ensemble of oscillators obeys $\\ddot x + ${gm}\\dot x + \\omega^2 x = 0$ (time in seconds). Find the area occupied by the ensemble in the $(x, \\dot x)$ plane after ${t} s, as a fraction of its initial area.`,
          answer, tol: Math.max(0.002, answer * 0.01), gm, t,
          sol: `The phase flow $(\\dot x, \\dot v) = (v, -\\omega^2x - ${gm}v)$ has divergence $-${gm}$, so areas shrink as $e^{-${gm}t} = e^{-${round(gm * t, 3)}} = ${answer}$, whatever $\\omega$ is.`,
          trap: 'Liouville\'s theorem (area preserved) holds only without damping.' };
      },
      verify: (p) => Math.exp(-p.gm * p.t) },
    { id: 'ham-g10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      make(r) {
        const c2 = choose(r, [-3, -2, -1, 1, 2, 3]), c3 = choose(r, [-2, -1, 1, 2]);
        const qs = round(-2 * c2 / (3 * c3), 3);
        const which = choose(r, ['zero', 'other']);
        const curv = which === 'zero' ? 2 * c2 : -2 * c2;
        const kind = curv > 0 ? 'a centre (stable, closed orbits around it)' : 'a saddle point (unstable)';
        const o = mcqOptions(r, kind, [curv > 0 ? 'a saddle point (unstable)' : 'a centre (stable, closed orbits around it)', 'a stable spiral (orbits wind into it)', 'an unstable node (orbits run straight out)'], (v) => v);
        const pt = which === 'zero' ? '(0, 0)' : `(${qs}, 0)`;
        const s = (x) => (x < 0 ? `- ${Math.abs(x) === 1 ? '' : Math.abs(x)}` : `+ ${x === 1 ? '' : x}`);
        return { q: `For $H = \\dfrac{p^2}{2} ${s(c2)}q^2 ${s(c3)}q^3$, the fixed point at $${pt}$ in the phase plane is`, ...o,
          sol: `Fixed points: $p = 0$ and $V'(q) = ${2 * c2}q ${c3 < 0 ? '-' : '+'} ${Math.abs(3 * c3)}q^2 = 0$, so $q = 0$ or $q = ${qs}$. $V''(q) = ${2 * c2} ${c3 < 0 ? '-' : '+'} ${Math.abs(6 * c3)}q$, which is $${curv}$ at $q = ${which === 'zero' ? 0 : qs}$. ${curv > 0 ? 'A minimum of $V$ is a centre.' : 'A maximum of $V$ is a saddle.'} Spirals and nodes cannot occur in a Hamiltonian system, which preserves area.`,
          trap: 'Hamiltonian fixed points are only centres or saddles; attracting spirals would shrink phase-space area.' };
      } },
    { id: 'ham-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      make(r) {
        const a1 = pick(r, 1, 4, 0.5), a2 = pick(r, 0.5, 3, 0.5);
        const answer = round((a1 / a2) ** 2, 4);
        return { q: `A particle bounces between two hard walls ${a1} m apart. The walls are moved very slowly until they are ${a2} m apart. Find the ratio of the final kinetic energy to the initial.`,
          answer, tol: Math.max(0.005, answer * 0.005), a1, a2,
          sol: `$J = \\oint p\\,dq = 2ap$ is an adiabatic invariant, so $p \\propto 1/a$ and $E \\propto 1/a^2$. Ratio $= (${a1}/${a2})^2 = ${answer}$.` };
      },
      verify: (p) => (p.a1 / p.a2) ** 2 },
    { id: 'ham-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phase portraits',
      make(r) {
        const m = pick(r, 0.2, 2, 0.1), l = pick(r, 0.2, 1.5, 0.1);
        const answer = round(2 * m * l * l * Math.sqrt(g / l), 4);
        return { q: `A pendulum has a ${m} kg bob on a light rigid rod of length ${l} m. Find the angular momentum $p_\\theta = ml^2\\dot\\theta$ (kg m²/s) where its separatrix crosses $\\theta = 0$ ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.002, answer * 0.01), unit: 'kg m²/s', m, l,
          sol: `The separatrix has the energy of the bob at rest at the top, $2mgl$ above the bottom. At $\\theta = 0$: $\\tfrac12 ml^2\\dot\\theta^2 = 2mgl$, so $\\dot\\theta = 2\\sqrt{g/l}$ and $p_\\theta = 2ml^2\\sqrt{g/l} = ${answer}$ kg m²/s.` };
      },
      verify: (p) => 2 * p.m * p.l * p.l * Math.sqrt(g / p.l) },
    { id: 'ham-g13', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'action-angle variables',
      make(r) {
        const [n, txt] = choose(r, [[1, '|q|'], [4, 'q^4'], [6, 'q^6'], [3, '|q|^3'], [8, 'q^8']]);
        const ex = (k) => { const num = 2 - k, den = 2 * k; const gg = (a, b) => (b ? gg(b, a % b) : Math.abs(a)); const d = gg(num, den); return [num / d, den / d]; };
        const show = ([a, b]) => (a === 0 ? '$T$ independent of $E$' : b === 1 ? `$T \\propto E^{${a}}$` : `$T \\propto E^{${a < 0 ? '-' : ''}${Math.abs(a)}/${b}}$`);
        const right = ex(n);
        const o = mcqOptions(r, show(right), [show([-right[0], right[1]]), show([0, 1]), show(ex(n === 1 ? 4 : 1))], (v) => v);
        return { q: `A particle oscillates in the potential $V = \\lambda ${txt}$ ($\\lambda > 0$). How does its period $T$ depend on its energy $E$?`, ...o,
          sol: `With $q = q_{\\max}u$ and $q_{\\max} \\propto E^{1/${n}}$, the action is $J \\propto E^{1/2 + 1/${n}}$, so $T = dJ/dE \\propto E^{1/${n} - 1/2}$, i.e. ${show(right)}.`,
          trap: 'Only the quadratic potential gives a period independent of amplitude.' };
      } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
