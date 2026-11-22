// Lagrangian mechanics (GATE / CSIR NET level): generalised coordinates, constraints, Euler-Lagrange equations,
// cyclic coordinates and Noether's theorem, the energy function, Lagrange multipliers, velocity-dependent potentials
// and the calculus of variations. Original questions for fibub. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './lagrangian-mechanics.more.gen.js';
import more2 from './lagrangian-mechanics.more2.gen.js';
import r4 from './lagrangian-mechanics.r4.gen.js';
import r5 from './lagrangian-mechanics.r5.gen.js';

const g = 9.8;

export default {
  topic: 'lagrangian-mechanics',
  items: [
    // ---------- level 1 ----------
    { id: 'lag-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'degrees of freedom',
      q: 'The number of degrees of freedom of a rigid body that can move freely in three-dimensional space is',
      options: ['$3$', '$5$', '$6$', '$9$'], answer: 2,
      sol: 'Three coordinates fix the position of one point (say the centre of mass) and three angles (for example the Euler angles) fix the orientation about it. Total $3 + 3 = 6$.',
      trap: 'Five is the count for a rigid rod or diatomic molecule, where rotation about the rod\'s own axis means nothing.' },
    { id: 'lag-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'constraints',
      q: 'A bead slides on a rigid circular wire that is driven to rotate at a fixed angular speed $\\omega$ about its vertical diameter. The constraint on the bead is',
      options: ['holonomic and rheonomic', 'holonomic and scleronomic', 'non-holonomic and scleronomic', 'non-holonomic and rheonomic'], answer: 0,
      sol: 'The constraint can be written as equations between the coordinates and time: $r = R$ and $\\phi = \\omega t$ (in spherical coordinates). Equations of the form $f(q, t) = 0$ are holonomic. Because time appears explicitly, the constraint is rheonomic (time-dependent). The bead keeps one degree of freedom, the polar angle $\\theta$.',
      trap: 'Time-dependent does not mean non-holonomic. Non-holonomic means the constraint involves velocities that cannot be integrated (or is an inequality).' },
    { id: 'lag-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'degrees of freedom',
      q: 'A molecule is modelled as two point atoms joined by a rigid bond, free to move in three dimensions. Its number of degrees of freedom is ______.',
      answer: 5, tol: 0, calc: () => 3 * 2 - 1,
      sol: 'Two free point particles have $3\\times2 = 6$ coordinates. The rigid bond adds one holonomic constraint, $|\\vec r_1 - \\vec r_2| = d$. So $6 - 1 = 5$: three for the centre of mass and two angles for the direction of the bond.' },
    { id: 'lag-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'writing the Lagrangian',
      q: 'The Lagrangian of a free particle of mass $m$ moving in a plane, written in plane polar coordinates $(r, \\theta)$, is',
      options: ['$\\tfrac12 m(\\dot r^2 + \\dot\\theta^2)$', '$\\tfrac12 m(\\dot r^2 + r^2\\dot\\theta^2)$', '$\\tfrac12 m(\\dot r^2 + r\\dot\\theta^2)$', '$\\tfrac12 m\\,r^2(\\dot r^2 + \\dot\\theta^2)$'], answer: 1,
      sol: 'The velocity has a radial part $\\dot r$ and a sideways part $r\\dot\\theta$, at right angles. So $T = \\tfrac12 m(\\dot r^2 + r^2\\dot\\theta^2)$, and with no potential $L = T$.',
      trap: 'The first option is not even dimensionally consistent: $\\dot\\theta$ has units of 1/s while $\\dot r$ has m/s.' },
    { id: 'lag-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'cyclic coordinates',
      q: 'A generalised coordinate $q_k$ is called cyclic (ignorable) when',
      options: ['$\\dot q_k = 0$ along the motion', '$\\partial L/\\partial \\dot q_k = 0$', 'the Lagrangian has no explicit time dependence', '$\\partial L/\\partial q_k = 0$'], answer: 3,
      sol: 'If $L$ does not contain $q_k$ itself (it may contain $\\dot q_k$), the Euler-Lagrange equation gives $\\dfrac{d}{dt}\\dfrac{\\partial L}{\\partial\\dot q_k} = \\dfrac{\\partial L}{\\partial q_k} = 0$. So the conjugate momentum $p_k = \\partial L/\\partial\\dot q_k$ is conserved.',
      trap: 'A cyclic coordinate usually keeps changing. It is its conjugate momentum that stays constant, not $\\dot q_k$.' },
    { id: 'lag-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'degrees of freedom',
      q: 'Three point masses are joined pairwise by three light rigid rods to form a triangle that moves in a plane. The number of degrees of freedom is ______.',
      answer: 3, tol: 0, calc: () => 2 * 3 - 3,
      sol: 'In a plane each particle needs 2 coordinates: $2\\times3 = 6$. The three rods are three independent holonomic constraints. $6 - 3 = 3$: two for the position of the triangle and one angle for its orientation, as for any rigid body in a plane.' },

    // ---------- level 2 ----------
    { id: 'lag-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
      q: 'For the Lagrangian $L = \\tfrac12 m\\dot q^2 + a\\,q\\dot q - \\tfrac12 k q^2$ with constant $a$, the equation of motion is',
      options: ['$m\\ddot q + a\\dot q + kq = 0$', '$m\\ddot q + 2a\\dot q + kq = 0$', '$m\\ddot q + kq = 0$', '$m\\ddot q + kq = a$'], answer: 2,
      sol: '$\\partial L/\\partial\\dot q = m\\dot q + aq$, so $\\dfrac{d}{dt}(m\\dot q + aq) = m\\ddot q + a\\dot q$. Also $\\partial L/\\partial q = a\\dot q - kq$. Equating: $m\\ddot q + a\\dot q = a\\dot q - kq$, so $m\\ddot q + kq = 0$. The term $aq\\dot q = \\dfrac{d}{dt}(\\tfrac12 aq^2)$ is a total time derivative, which never changes the equations of motion.',
      trap: 'Taking only $d/dt$ of the momentum and forgetting the $a\\dot q$ in $\\partial L/\\partial q$ leaves a false damping term.' },
    { id: 'lag-008', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
      q: 'Which of the following changes to a Lagrangian $L(q, \\dot q, t)$ always leave the equations of motion unchanged?',
      options: ['$L \\to L + \\dfrac{d}{dt}F(q, t)$ for any smooth $F$', '$L \\to cL$ for a non-zero constant $c$', '$L \\to L + 7$', '$L \\to L + q\\,\\dot q^2$'], answer: [0, 1, 2],
      sol: 'A total time derivative $dF/dt$ of a function of $q$ and $t$ adds identical terms to both sides of the Euler-Lagrange equation. Multiplying $L$ by a constant multiplies the whole equation by $c$. A constant drops out of every derivative. But $q\\dot q^2$ is not a total derivative: it adds $\\dfrac{d}{dt}(2q\\dot q) - \\dot q^2 = 2q\\ddot q + \\dot q^2$ to the equation.',
      trap: 'Only total time derivatives of functions of $(q, t)$ are safe; a term that merely looks small, like $q\\dot q^2$, is not.' },
    { id: 'lag-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'generalised momentum',
      q: 'For $L = 2\\dot q^2 + 3q\\dot q - q^2$, the generalised momentum conjugate to $q$ at the instant when $q = 1$ and $\\dot q = 2$ is ______.',
      answer: 11, tol: 0, calc: () => 4 * 2 + 3 * 1,
      sol: '$p = \\partial L/\\partial\\dot q = 4\\dot q + 3q = 4(2) + 3(1) = 11$.',
      trap: 'The canonical momentum is not always "mass times velocity": here the $3q\\dot q$ term adds $3q$.' },
    { id: 'lag-011', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'cyclic coordinates',
      q: 'A particle moves in a plane with $L = \\tfrac12 m(\\dot r^2 + r^2\\dot\\theta^2) + \\dfrac{k}{r}$. Which quantity is conserved because a coordinate is cyclic?',
      options: ['$m r^2\\dot\\theta$', '$m\\dot r$', '$m r\\dot\\theta$', '$m\\dot r\\,\\dot\\theta$'], answer: 0,
      sol: '$\\theta$ does not appear in $L$, so $p_\\theta = \\partial L/\\partial\\dot\\theta = mr^2\\dot\\theta$ (the angular momentum) is constant.',
      trap: '$mr\\dot\\theta$ is the sideways linear momentum, which changes as $r$ changes.' },
    { id: 'lag-012', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'simple systems',
      q: 'An Atwood machine has masses 3 kg and 1 kg on a light string over a light frictionless pulley. Using the Lagrangian with the single coordinate $x$ (the drop of the 3 kg mass), the acceleration of the masses is ______ m/s² (take $g = 9.8$ m/s²).',
      answer: 4.9, tol: 0.05, unit: 'm/s²', calc: () => (3 - 1) * 9.8 / 4,
      sol: '$T = \\tfrac12(3 + 1)\\dot x^2 = 2\\dot x^2$, $V = -3gx + 1gx = -2gx$. So $L = 2\\dot x^2 + 2gx$. Euler-Lagrange: $4\\ddot x = 2g$, $\\ddot x = g/2 = 4.9$ m/s².' },
    { id: 'lag-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'velocity-dependent potentials',
      q: 'A particle of mass $m$ and charge $q$ moves in fields with potentials $\\phi$ and $\\vec A$, with $L = \\tfrac12 m v^2 - q\\phi + q\\,\\vec v\\cdot\\vec A$. The momentum conjugate to $x$ is',
      options: ['$m\\dot x$', '$m\\dot x - qA_x$', '$m\\dot x + q\\phi$', '$m\\dot x + qA_x$'], answer: 3,
      sol: '$p_x = \\partial L/\\partial\\dot x = m\\dot x + qA_x$. This canonical momentum differs from the kinetic momentum $m\\dot x$; it is the one that becomes $-i\\hbar\\,\\partial_x$ in quantum mechanics.',
      trap: 'The sign follows the sign of the $q\\vec v\\cdot\\vec A$ term in $L$; with this standard Lagrangian it is plus.' },
    { id: 'lag-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'constraints',
      q: 'Which of these constraints are holonomic?',
      options: ['A bead threaded on a fixed curved wire', 'A gas molecule confined inside a closed box', 'A vertical disc rolling without slipping along a fixed straight line', 'A vertical coin rolling without slipping on a horizontal plane, free to turn its heading'], answer: [0, 2],
      sol: 'A: the wire gives two equations among the coordinates. B: the walls give inequalities ($0 \\le x \\le a$ and so on), which are not holonomic. C: rolling on a line gives $\\dot x = R\\dot\\phi$, which integrates to $x = R\\phi + $ const, a holonomic relation. D: for the coin, $\\dot x = R\\dot\\phi\\cos\\psi$ and $\\dot y = R\\dot\\phi\\sin\\psi$ depend on the heading $\\psi$ and cannot be integrated: non-holonomic.',
      trap: 'Rolling is not automatically non-holonomic. It is non-holonomic only when the rolling condition cannot be integrated.' },
    { id: 'lag-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: 'The functional $J[y] = \\displaystyle\\int_a^b (y\'^2 + y^2)\\,dx$ is stationary for curves that satisfy',
      options: ['$y\'\' = -y$', '$y\'\' = y$', '$y\'\' = 0$', '$y\' = y$'], answer: 1,
      sol: 'With $f = y\'^2 + y^2$, the Euler equation $\\dfrac{d}{dx}\\dfrac{\\partial f}{\\partial y\'} = \\dfrac{\\partial f}{\\partial y}$ gives $2y\'\' = 2y$, so $y\'\' = y$ (solutions $\\cosh x$, $\\sinh x$).',
      trap: 'Treating it like $T - V$ gives $y\'\' = -y$; here both terms carry a plus sign.' },
    { id: 'lag-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
      q: 'The Lagrangian $L = e^{\\gamma t}\\left(\\tfrac12 m\\dot x^2 - \\tfrac12 kx^2\\right)$ leads to the equation of motion',
      options: ['$m\\ddot x + kx = 0$', '$m\\ddot x + \\tfrac12 m\\gamma\\dot x + kx = 0$', '$m\\ddot x + m\\gamma\\dot x + kx = 0$', '$m\\ddot x - m\\gamma\\dot x + kx = 0$'], answer: 2,
      sol: '$\\partial L/\\partial\\dot x = e^{\\gamma t}m\\dot x$, whose time derivative is $e^{\\gamma t}(m\\ddot x + m\\gamma\\dot x)$. $\\partial L/\\partial x = -e^{\\gamma t}kx$. Cancelling $e^{\\gamma t}$: $m\\ddot x + m\\gamma\\dot x + kx = 0$, a damped oscillator.',
      trap: 'Forgetting to differentiate the $e^{\\gamma t}$ factor loses the damping term.' },
    { id: 'lag-018', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'generalised forces',
      q: 'A particle moves in the $xy$ plane, described by polar coordinates $(r, \\theta)$. A force of 3 N along $+\\hat y$ acts on it when it is at $(x, y) = (2\\ \\text{m}, 0)$. The generalised force $Q_\\theta$ at that instant is ______ N m.',
      answer: 6, tol: 0, unit: 'N m', calc: () => 2 * 3,
      sol: '$Q_\\theta = \\vec F\\cdot\\dfrac{\\partial\\vec r}{\\partial\\theta}$ with $\\partial\\vec r/\\partial\\theta = r(-\\sin\\theta, \\cos\\theta) = (0, 2)$ m at $\\theta = 0$. So $Q_\\theta = 3\\times2 = 6$ N m: the generalised force conjugate to an angle is a torque.' },
    { id: 'lag-019', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'energy function',
      q: 'The energy function $h = \\sum_k \\dot q_k\\,\\partial L/\\partial\\dot q_k - L$ is a constant of the motion whenever',
      options: ['all the coordinates are cyclic', 'the constraints are holonomic', '$h$ equals $T + V$', '$L$ has no explicit time dependence'], answer: 3,
      sol: 'Along the motion $dh/dt = -\\partial L/\\partial t$ (use the Euler-Lagrange equations in $dh/dt$). So $h$ is conserved exactly when $\\partial L/\\partial t = 0$. Whether $h$ equals $T + V$ is a separate question: it does when the constraints are time-independent and $T$ is quadratic in the velocities.',
      trap: '$h$ can be conserved without being the total energy, as for a bead on a hoop driven at constant speed.' },

    // ---------- level 3 ----------
    { id: 'lag-010', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'moving supports',
      q: 'The support of a simple pendulum (length $l$, angle $\\theta$ from the vertical) is driven horizontally as $x_s = a\\cos\\omega t$. The equation of motion of the pendulum is',
      options: ['$\\ddot\\theta + \\dfrac{g}{l}\\sin\\theta = 0$', '$\\ddot\\theta + \\dfrac{g}{l}\\sin\\theta = \\dfrac{a\\omega^2}{l}\\cos\\omega t\\,\\sin\\theta$', '$\\ddot\\theta + \\dfrac{g}{l}\\sin\\theta = \\dfrac{a\\omega^2}{l}\\cos\\omega t\\,\\cos\\theta$', '$\\ddot\\theta + \\dfrac{g}{l}\\sin\\theta = -\\dfrac{a\\omega}{l}\\sin\\omega t\\,\\cos\\theta$'], answer: 2,
      sol: 'Bob: $x = a\\cos\\omega t + l\\sin\\theta$, $y = -l\\cos\\theta$. $T = \\tfrac12 m(a^2\\omega^2\\sin^2\\omega t - 2a\\omega l\\sin\\omega t\\cos\\theta\\,\\dot\\theta + l^2\\dot\\theta^2)$, $V = -mgl\\cos\\theta$.<br>$\\dfrac{d}{dt}\\dfrac{\\partial L}{\\partial\\dot\\theta} = ml^2\\ddot\\theta - ma\\omega^2 l\\cos\\omega t\\cos\\theta + ma\\omega l\\sin\\omega t\\sin\\theta\\,\\dot\\theta$.<br>$\\dfrac{\\partial L}{\\partial\\theta} = ma\\omega l\\sin\\omega t\\sin\\theta\\,\\dot\\theta - mgl\\sin\\theta$.<br>The $\\dot\\theta$ terms cancel, leaving $l\\ddot\\theta + g\\sin\\theta = a\\omega^2\\cos\\omega t\\cos\\theta$. Physically: in the support\'s frame there is a horizontal inertial force $-m\\ddot x_s = ma\\omega^2\\cos\\omega t$, whose torque arm is $l\\cos\\theta$.',
      trap: 'The horizontal pseudo-force has a lever arm $l\\cos\\theta$, not $l\\sin\\theta$; $\\sin\\theta$ goes with vertical forces such as gravity.' },
    { id: 'lag-015', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotating constraints',
      q: 'A bead can slide without friction along a straight horizontal rod that is driven to rotate at $\\omega = 2$ rad/s about a vertical axis through one end. The bead starts at rest relative to the rod, 0.5 m from the axis. Its distance from the axis after 1 s is ______ m.',
      answer: 1.881, tol: 0.02, unit: 'm', calc: () => 0.5 * Math.cosh(2),
      sol: 'With $\\phi = \\omega t$ fixed by the motor, $L = \\tfrac12 m(\\dot r^2 + \\omega^2 r^2)$. Euler-Lagrange: $\\ddot r = \\omega^2 r$, so $r = A\\cosh\\omega t + B\\sinh\\omega t$. Starting at rest relative to the rod: $B = 0$, $A = 0.5$ m. At $t = 1$ s: $r = 0.5\\cosh 2 = 0.5\\times3.762 = 1.881$ m.',
      trap: 'The equation is $\\ddot r = +\\omega^2 r$ (exponential growth), not simple harmonic motion.' },
    { id: 'lag-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rotating constraints',
      q: 'A bead slides on a smooth vertical hoop of radius $R$ that spins at constant $\\omega$ about its vertical diameter. With $\\theta$ measured from the lowest point, an equilibrium (relative to the hoop) away from the bottom exists when $\\omega^2 > g/R$, at',
      options: ['$\\cos\\theta_0 = \\dfrac{\\omega^2 R}{g}$', '$\\sin\\theta_0 = \\dfrac{g}{\\omega^2 R}$', '$\\tan\\theta_0 = \\dfrac{\\omega^2 R}{g}$', '$\\cos\\theta_0 = \\dfrac{g}{\\omega^2 R}$'], answer: 3,
      sol: '$L = \\tfrac12 mR^2(\\dot\\theta^2 + \\omega^2\\sin^2\\theta) + mgR\\cos\\theta$. Euler-Lagrange: $\\ddot\\theta = \\sin\\theta\\left(\\omega^2\\cos\\theta - \\dfrac gR\\right)$. Equilibria: $\\sin\\theta = 0$ or $\\cos\\theta_0 = g/(\\omega^2 R)$, which needs $\\omega^2 R > g$.',
      trap: 'The first option is the reciprocal; it would exceed 1 exactly when the off-bottom equilibrium exists.' },
    { id: 'lag-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotating constraints',
      q: 'A smooth vertical hoop of radius 0.2 m spins at 10 rad/s about its vertical diameter. A bead on it rests (relative to the hoop) away from the bottom. The angle between the radius to the bead and the downward vertical is ______ degrees ($g = 9.8$ m/s²).',
      answer: 60.66, tol: 0.3, unit: '°', calc: () => Math.acos(9.8 / (100 * 0.2)) * 180 / Math.PI,
      sol: '$\\cos\\theta_0 = \\dfrac{g}{\\omega^2 R} = \\dfrac{9.8}{100\\times0.2} = 0.49$, so $\\theta_0 = 60.66^\\circ$.' },
    { id: 'lag-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'conservation laws',
      q: 'A particle moves in the two-dimensional isotropic oscillator potential: $L = \\tfrac12 m(\\dot x^2 + \\dot y^2) - \\tfrac12 k(x^2 + y^2)$. Which of these are constants of the motion?',
      options: ['$\\tfrac12 m(\\dot x^2 + \\dot y^2) + \\tfrac12 k(x^2 + y^2)$', '$m(x\\dot y - y\\dot x)$', '$m\\dot x$', '$m\\dot x^2 + kx^2$'], answer: [0, 1, 3],
      sol: 'A: no explicit $t$, so the energy is conserved. B: $L$ is unchanged by rotations about the $z$ axis, so $L_z$ is conserved (in polar form $\\theta$ is cyclic). C: $\\dot p_x = -kx \\neq 0$. D: the $x$ and $y$ motions separate into two independent oscillators, so each one\'s energy, $\\tfrac12(m\\dot x^2 + kx^2)$, is conserved separately.',
      trap: 'Option D is easy to miss: separable systems have more constants than the obvious symmetry ones.' },
    { id: 'lag-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'simple systems',
      q: 'Masses of 5 kg and 3 kg hang on a light string over a pulley of radius $R$ and moment of inertia $I$ with $I/R^2 = 2$ kg. The string does not slip. The acceleration of the masses is ______ m/s² ($g = 9.8$ m/s²).',
      answer: 1.96, tol: 0.02, unit: 'm/s²', calc: () => (5 - 3) * 9.8 / (5 + 3 + 2),
      sol: 'With $x$ the drop of the 5 kg mass and pulley angle $x/R$: $T = \\tfrac12(5 + 3 + I/R^2)\\dot x^2 = 5\\dot x^2$, $V = -(5 - 3)gx$. Euler-Lagrange: $10\\ddot x = 2g$, $\\ddot x = 1.96$ m/s².',
      trap: 'The pulley\'s inertia enters as an extra "mass" $I/R^2$ in the kinetic energy, not in the potential energy.' },
    { id: 'lag-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'velocity-dependent potentials',
      q: 'For a charge $q$ with $L = \\tfrac12 mv^2 - q\\phi + q\\vec v\\cdot\\vec A$, the gauge change $\\vec A \\to \\vec A + \\nabla\\chi$, $\\phi \\to \\phi - \\partial\\chi/\\partial t$ changes the Lagrangian by',
      options: ['zero', '$q\\,d\\chi/dt$', '$q\\,\\partial\\chi/\\partial t$', '$q\\,\\vec v\\cdot\\nabla\\chi$'], answer: 1,
      sol: '$\\delta L = q\\,\\partial_t\\chi + q\\,\\vec v\\cdot\\nabla\\chi = q\\dfrac{d\\chi}{dt}$, the total derivative of $q\\chi(\\vec r, t)$ along the path. A total derivative leaves the equations of motion unchanged, which is why the physics is gauge invariant even though $L$ and the canonical momentum are not.',
      trap: 'Each piece alone is not a total derivative; only their sum is.' },
    { id: 'lag-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'surfaces of revolution',
      q: 'A particle slides without friction on the inside of the paraboloid $z = \\alpha r^2$ with $\\alpha = 2$ m⁻¹ ($z$ up). For a horizontal circular orbit, its angular speed is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 6.261, tol: 0.03, unit: 'rad/s', calc: () => Math.sqrt(2 * 9.8 * 2),
      sol: 'With $z = \\alpha r^2$: $L = \\tfrac12 m(\\dot r^2 + 4\\alpha^2 r^2\\dot r^2 + r^2\\dot\\phi^2) - mg\\alpha r^2$. For a circle ($\\dot r = \\ddot r = 0$) the radial equation gives $mr\\dot\\phi^2 = 2mg\\alpha r$, so $\\dot\\phi = \\sqrt{2g\\alpha} = \\sqrt{39.2} = 6.261$ rad/s, the same at every radius.',
      trap: 'You might expect it to depend on the radius, as on a cone; for a paraboloid it does not.' },
    { id: 'lag-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lagrange multipliers',
      q: 'A particle starts from rest at the top of a smooth fixed sphere of radius $R$ and slides down. It is described by $L\' = T - V + \\lambda(r - R)$ in spherical coordinates, with $\\theta$ measured from the top. The multiplier $\\lambda$ as a function of $\\theta$ is',
      options: ['$mg\\cos\\theta$', '$mg(2 - 3\\cos\\theta)$', '$mg(1 - \\cos\\theta)$', '$mg(3\\cos\\theta - 2)$'], answer: 3,
      sol: 'Radial equation from $L\'$: $m\\ddot r - mr\\dot\\theta^2 + mg\\cos\\theta = \\lambda$. On the sphere $\\ddot r = 0$, so $\\lambda = mg\\cos\\theta - mR\\dot\\theta^2$. Energy: $\\tfrac12 mR^2\\dot\\theta^2 = mgR(1 - \\cos\\theta)$, so $mR\\dot\\theta^2 = 2mg(1 - \\cos\\theta)$. Then $\\lambda = mg(3\\cos\\theta - 2)$. It is the outward normal force; it vanishes, and the particle leaves, at $\\cos\\theta = 2/3$.',
      trap: 'The multiplier is the force of constraint; its sign follows from how the constraint term is written.' },
    { id: 'lag-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'conservation laws',
      q: 'Which statements about symmetries and conserved quantities (Noether\'s theorem) are correct?',
      options: ['If $L$ is unchanged by $x \\to x + \\epsilon$, then $p_x$ is conserved', 'If $L$ is unchanged by rotations about the $z$ axis, then $L_z$ is conserved', 'If $L$ has no explicit $t$, the energy function $h$ is conserved, even when $h \\neq T + V$', 'If $L$ is unchanged by $q \\to q + \\epsilon$, then $\\dot q$ is constant'], answer: [0, 1, 2],
      sol: 'A and B: a continuous symmetry gives the conserved momentum conjugate to the shifted coordinate (linear momentum for translations, angular momentum for rotations). C: time-translation invariance conserves $h$, which equals $T + V$ only for time-independent constraints. D: what is conserved is $p = \\partial L/\\partial\\dot q$, which need not be proportional to $\\dot q$ (for a charge in a magnetic field it is $m\\dot x + qA_x$).',
      trap: 'Statement D mixes up the coordinate\'s velocity with its conjugate momentum.' },
    { id: 'lag-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: 'The solution of the brachistochrone problem is a cycloid $x = a(\\phi - \\sin\\phi)$, $y = a(1 - \\cos\\phi)$ ($y$ downward). For $a = 1$ m, the time for a bead released from rest at the cusp to slide to the lowest point is ______ s ($g = 9.8$ m/s²).',
      answer: 1.0035, tol: 0.01, unit: 's', calc: () => Math.PI * Math.sqrt(1 / 9.8),
      sol: 'Speed $v = \\sqrt{2gy}$, arc length $ds = 2a\\sin(\\phi/2)\\,d\\phi$, and $y = 2a\\sin^2(\\phi/2)$. So $dt = ds/v = \\sqrt{a/g}\\,d\\phi$. From $\\phi = 0$ to $\\pi$: $t = \\pi\\sqrt{a/g} = \\pi/\\sqrt{9.8} = 1.0035$ s.',
      trap: 'The time per unit $\\phi$ is constant, which is also why the cycloid is isochronous (the tautochrone).' },
    { id: 'lag-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'writing the Lagrangian',
      q: 'Which Lagrangian gives the correct relativistic equation of motion $\\dfrac{d}{dt}(\\gamma m\\vec v) = -\\nabla V$ for a particle of rest mass $m$?',
      options: ['$L = \\gamma mc^2 - V$', '$L = -mc^2\\sqrt{1 - v^2/c^2} - V$', '$L = \\tfrac12\\gamma mv^2 - V$', '$L = (\\gamma - 1)mc^2 - V$'], answer: 1,
      sol: '$\\partial L/\\partial\\vec v = -mc^2\\cdot\\dfrac{-\\vec v/c^2}{\\sqrt{1 - v^2/c^2}} = \\gamma m\\vec v$, which is the relativistic momentum, so the Euler-Lagrange equation is the one wanted. Note $L \\neq T - V$: the free part is $-mc^2/\\gamma$, not the kinetic energy $(\\gamma - 1)mc^2$.',
      trap: 'Using the relativistic kinetic energy as $T$ in $T - V$ gives the wrong momentum.' },

    // ---------- level 4 ----------
    { id: 'lag-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'simple systems',
      q: 'A double Atwood machine: a 4 kg mass hangs on one side of a fixed light pulley. On the other side hangs a light pulley over which pass masses of 1 kg and 3 kg. All strings are light and the pulleys frictionless. The magnitude of the acceleration of the 4 kg mass is ______ m/s² ($g = 9.8$ m/s²).',
      answer: 1.4, tol: 0.02, unit: 'm/s²', calc: () => 9.8 * (4 * 4 - 4 * 3) / (4 * 4 + 4 * 3),
      sol: 'Let $x$ be the drop of the 4 kg mass and $y$ the drop of the 1 kg mass below the movable pulley. The movable pulley drops by $-x$, the 1 kg by $y - x$, the 3 kg by $-y - x$.<br>$T = \\tfrac12(4\\dot x^2 + (\\dot y - \\dot x)^2 + 3(\\dot x + \\dot y)^2)$, $V = -g(4x + (y - x) + 3(-x - y)) = -g(0\\cdot x - 2y)$.<br>$x$: $8\\ddot x + 2\\ddot y = 0$. $y$: $2\\ddot x + 4\\ddot y = -2g$.<br>So $\\ddot y = -4\\ddot x$ and $2\\ddot x - 16\\ddot x = -2g$: $\\ddot x = g/7 = 1.4$ m/s² (downward).',
      trap: 'The movable pulley side has total mass 4 kg, equal to the other side, yet the 4 kg mass still moves: the 1 kg and 3 kg pair accelerate and the effective mass of the pulley system is $4m_2m_3/(m_2 + m_3) = 3$ kg.' },
    { id: 'lag-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'velocity-dependent potentials',
      q: 'A charge $q$ of mass $m$ moves in the $xy$ plane in a uniform field $B\\hat z$, with $L = \\tfrac12 m(\\dot x^2 + \\dot y^2) + \\tfrac12 qB(x\\dot y - y\\dot x)$. Solving the Euler-Lagrange equations, the particle moves on circles with angular frequency',
      options: ['$qB/2m$', '$2qB/m$', '$qB/m$', '$\\sqrt{qB/m}$'], answer: 2,
      sol: '$x$: $\\dfrac{d}{dt}(m\\dot x - \\tfrac12 qBy) = \\tfrac12 qB\\dot y$, so $m\\ddot x = qB\\dot y$. $y$: $\\dfrac{d}{dt}(m\\dot y + \\tfrac12 qBx) = -\\tfrac12 qB\\dot x$, so $m\\ddot y = -qB\\dot x$. With $u = \\dot x + i\\dot y$: $\\dot u = -i(qB/m)u$, rotation at $\\omega_c = qB/m$.',
      trap: 'The factor $\\tfrac12$ in the symmetric gauge is doubled back by the two contributions; the cyclotron frequency is $qB/m$, not $qB/2m$.' },
    { id: 'lag-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'energy function',
      q: 'For the bead on a smooth vertical hoop driven at constant angular speed $\\omega$ about its vertical diameter (one coordinate $\\theta$), which statements are correct?',
      options: ['The energy function $h$ is conserved', 'The total energy $T + V$ (kinetic energy in the lab) is conserved', '$h = T + V$', 'The hoop does work on the bead as the bead moves along it'], answer: [0, 3],
      sol: '$L = \\tfrac12 mR^2(\\dot\\theta^2 + \\omega^2\\sin^2\\theta) + mgR\\cos\\theta$ has no explicit $t$, so $h = \\tfrac12 mR^2\\dot\\theta^2 - \\tfrac12 mR^2\\omega^2\\sin^2\\theta - mgR\\cos\\theta$ is conserved. But $T + V = \\tfrac12 mR^2(\\dot\\theta^2 + \\omega^2\\sin^2\\theta) - mgR\\cos\\theta$ differs from $h$ by $mR^2\\omega^2\\sin^2\\theta$, which changes as the bead moves. The difference is supplied by the motor through the hoop\'s sideways push, which does work because the constraint moves.',
      trap: 'Rheonomic constraints can do work. "No explicit $t$ in $L$" conserves $h$, not the lab energy.' },
    { id: 'lag-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: 'On the surface of a cylinder of radius 1 m, the shortest path is taken between the points $(\\phi, z) = (0, 0)$ and $(\\pi/2, 2\\ \\text{m})$, going the short way round. Its length is ______ m.',
      answer: 2.5431, tol: 0.01, unit: 'm', calc: () => Math.hypot(Math.PI / 2, 2),
      sol: 'Path length $\\int\\sqrt{R^2 d\\phi^2 + dz^2} = \\int\\sqrt{R^2 + z\'^2}\\,d\\phi$. The integrand does not contain $z$, so $\\partial f/\\partial z\' = $ const, giving $z\' = $ const: a helix, which is a straight line on the unrolled cylinder. Length $= \\sqrt{(R\\pi/2)^2 + 2^2} = \\sqrt{2.467 + 4} = 2.543$ m.' },
    { id: 'lag-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotating constraints',
      q: 'For the bead on a hoop of radius $R$ spinning at $\\omega$ about its vertical diameter, with $\\omega^2 > g/R$, the angular frequency $\\Omega$ of small oscillations about the off-bottom equilibrium satisfies',
      options: ['$\\Omega^2 = \\omega^2 - g/R$', '$\\Omega^2 = \\omega^2 - \\dfrac{g^2}{R^2\\omega^2}$', '$\\Omega^2 = g/R - \\omega^2$', '$\\Omega^2 = \\omega^2 + g/R$'], answer: 1,
      sol: 'The equation is $\\ddot\\theta = f(\\theta) = \\sin\\theta(\\omega^2\\cos\\theta - g/R)$. At $\\cos\\theta_0 = g/(\\omega^2 R)$: $f\'(\\theta_0) = \\cos\\theta_0(\\omega^2\\cos\\theta_0 - g/R) - \\omega^2\\sin^2\\theta_0 = -\\omega^2\\sin^2\\theta_0$. So $\\Omega^2 = \\omega^2\\sin^2\\theta_0 = \\omega^2 - g^2/(R^2\\omega^2)$.',
      trap: '$\\omega^2 - g/R$ is minus the stiffness of the bottom point (where it is unstable), not the frequency at the new minimum.' },
    { id: 'lag-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coupled systems',
      q: 'A simple pendulum (bob 1 kg, length 0.5 m) hangs from a block of mass 2 kg that can slide freely on a smooth horizontal rail. The angular frequency of small oscillations is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 5.422, tol: 0.03, unit: 'rad/s', calc: () => Math.sqrt(9.8 / 0.5 * (2 + 1) / 2),
      sol: 'Coordinates: block position $X$, angle $\\theta$. $L = \\tfrac12(M + m)\\dot X^2 + mL_p\\dot X\\dot\\theta\\cos\\theta + \\tfrac12 mL_p^2\\dot\\theta^2 + mgL_p\\cos\\theta$. $X$ is cyclic: $(M + m)\\dot X + mL_p\\dot\\theta\\cos\\theta = $ const (zero for a start from rest). For small angles, $\\ddot X = -\\dfrac{mL_p}{M + m}\\ddot\\theta$, and the $\\theta$ equation $L_p\\ddot\\theta + \\ddot X = -g\\theta$ becomes $\\dfrac{M}{M + m}L_p\\ddot\\theta = -g\\theta$. So $\\omega^2 = \\dfrac{g}{L_p}\\dfrac{M + m}{M} = 19.6\\times1.5 = 29.4$ and $\\omega = 5.422$ rad/s.',
      trap: 'Using $\\sqrt{g/l} = 4.43$ rad/s ignores the recoil of the block, which makes the oscillation faster.' },
    { id: 'lag-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Lagrange multipliers',
      q: 'A uniform disc (mass $m$, radius $R$) rolls without slipping down a plane inclined at $\\alpha$. Treat $x$ (distance down the plane) and $\\phi$ (rotation angle) as independent and impose $x = R\\phi$ with a multiplier. The friction force on the disc, given by the multiplier, has magnitude',
      options: ['$\\tfrac13 mg\\sin\\alpha$', '$\\tfrac23 mg\\sin\\alpha$', '$\\tfrac12 mg\\sin\\alpha$', '$mg\\sin\\alpha$'], answer: 0,
      sol: '$L\' = \\tfrac12 m\\dot x^2 + \\tfrac14 mR^2\\dot\\phi^2 + mgx\\sin\\alpha + \\lambda(x - R\\phi)$. $x$: $m\\ddot x = mg\\sin\\alpha + \\lambda$. $\\phi$: $\\tfrac12 mR^2\\ddot\\phi = -\\lambda R$, so with $\\ddot\\phi = \\ddot x/R$: $\\lambda = -\\tfrac12 m\\ddot x$. Then $\\tfrac32 m\\ddot x = mg\\sin\\alpha$, $\\ddot x = \\tfrac23 g\\sin\\alpha$, and $|\\lambda| = \\tfrac13 mg\\sin\\alpha$, acting up the slope.',
      trap: '$\\tfrac23 g\\sin\\alpha$ is the acceleration; the friction is $m$ times the shortfall from $g\\sin\\alpha$.' },
    { id: 'lag-037', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'constraints',
      q: 'Which statements about virtual displacements and the principle of virtual work are correct?',
      options: ['Virtual displacements are taken at a fixed instant of time, consistent with the constraints at that instant', 'Ideal (workless) constraint forces do zero total virtual work', 'The actual displacement in time $dt$ is always one of the possible virtual displacements', 'The static friction at a contact that rolls without slipping does no virtual work'], answer: [0, 1, 3],
      sol: 'A and B are the definitions behind d\'Alembert\'s principle. C fails for moving (rheonomic) constraints: on a rotating hoop the real displacement includes the hoop\'s motion, which a virtual displacement at frozen time does not. D: the contact point has zero velocity, so its allowed virtual displacement is zero and the friction there does no virtual work.',
      trap: 'Statement C is true only for time-independent constraints.' },
    { id: 'lag-041', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotating frames',
      q: 'In axes rotating at constant $\\Omega$ about $z$, a particle of unit mass has $L = \\tfrac12(\\dot x^2 + \\dot y^2) + \\Omega(x\\dot y - y\\dot x) + \\tfrac12\\Omega^2(x^2 + y^2) - V(x, y)$. The $x$ equation of motion is',
      options: ['$\\ddot x - 2\\Omega\\dot y - \\Omega^2 x = -\\partial V/\\partial x$', '$\\ddot x - \\Omega\\dot y - \\Omega^2 x = -\\partial V/\\partial x$', '$\\ddot x + \\Omega^2 x = -\\partial V/\\partial x$', '$\\ddot x + 2\\Omega\\dot y + \\Omega^2 x = -\\partial V/\\partial x$'], answer: 0,
      sol: '$\\partial L/\\partial\\dot x = \\dot x - \\Omega y$, with time derivative $\\ddot x - \\Omega\\dot y$. $\\partial L/\\partial x = \\Omega\\dot y + \\Omega^2 x - \\partial_x V$. So $\\ddot x - 2\\Omega\\dot y - \\Omega^2 x = -\\partial_x V$: the $2\\Omega\\dot y$ is the Coriolis term and $\\Omega^2 x$ the centrifugal term.',
      trap: 'Half the Coriolis term comes from $d/dt$ of the momentum and half from $\\partial L/\\partial x$; stopping after one gives $\\Omega\\dot y$.' },

    // ---------- level 5 ----------
    { id: 'lag-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'rotating constraints',
      q: 'A smooth vertical hoop of radius 0.1 m spins at 14 rad/s about its vertical diameter. The period of small oscillations of a bead about its stable equilibrium on the hoop is ______ s ($g = 9.8$ m/s²).',
      answer: 0.5182, tol: 0.005, unit: 's', calc: () => 2 * Math.PI / Math.sqrt(196 - 98 * 98 / 196),
      sol: 'Here $\\omega^2 = 196 > g/R = 98$ s⁻², so the bottom is unstable and the stable point is at $\\cos\\theta_0 = 98/196 = 0.5$. There $\\Omega^2 = \\omega^2 - (g/R)^2/\\omega^2 = 196 - 49 = 147$ s⁻², $\\Omega = 12.12$ rad/s, period $2\\pi/\\Omega = 0.518$ s.',
      trap: 'Using the bottom point gives $\\Omega^2 = g/R - \\omega^2 < 0$: that point is a maximum of the effective potential here.' },
    { id: 'lag-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'coupled systems',
      q: 'A puck of mass 1 kg on a smooth horizontal table is tied to a string that passes through a small hole and holds a 2 kg mass hanging below. The puck circles at 0.5 m from the hole. If disturbed slightly, the radius oscillates with angular frequency ______ rad/s ($g = 9.8$ m/s²).',
      answer: 6.261, tol: 0.03, unit: 'rad/s', calc: () => Math.sqrt(3 * 2 * 9.8 / (3 * 0.5)),
      sol: 'With $r$ the puck\'s distance from the hole, $L = \\tfrac12(m + M)\\dot r^2 + \\tfrac12 mr^2\\dot\\theta^2 - Mgr$. $\\theta$ is cyclic: $\\ell = mr^2\\dot\\theta$ fixed. Radial: $(m + M)\\ddot r = \\dfrac{\\ell^2}{mr^3} - Mg$. Circle at $r_0$: $\\ell^2/(mr_0^3) = Mg$. Linearise: $(m + M)\\delta\\ddot r = -\\dfrac{3\\ell^2}{mr_0^4}\\delta r = -\\dfrac{3Mg}{r_0}\\delta r$. So $\\omega^2 = \\dfrac{3Mg}{(m + M)r_0} = \\dfrac{3\\times2\\times9.8}{3\\times0.5} = 39.2$, $\\omega = 6.26$ rad/s.',
      trap: 'Both masses move when $r$ changes, so the inertia is $m + M$; the stiffness comes from the centrifugal barrier, $3\\ell^2/(mr_0^4)$.' },
    { id: 'lag-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'conservation laws',
      q: 'A particle moves in a plane with $L = \\tfrac12 m(\\dot x^2 + \\dot y^2) - V(x + 2y)$, where $V$ is an arbitrary smooth function. Which of these are conserved?',
      options: ['$2p_x - p_y$', '$p_x + 2p_y$', '$p_x$', '$\\tfrac12 m(\\dot x^2 + \\dot y^2) + V(x + 2y)$'], answer: [0, 3],
      sol: 'The shift $x \\to x + 2\\epsilon$, $y \\to y - \\epsilon$ leaves $x + 2y$, and so $L$, unchanged. Noether: $p_x\\delta x + p_y\\delta y \\propto 2p_x - p_y$ is conserved. Check: $\\dot p_x = -V\'$, $\\dot p_y = -2V\'$, so $2\\dot p_x - \\dot p_y = 0$. No explicit $t$: energy conserved. $p_x + 2p_y$ changes at rate $-5V\'$.',
      trap: 'The conserved combination is along the direction in which $V$ does not change, perpendicular to $\\nabla(x + 2y) = (1, 2)$.' },
    { id: 'lag-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'calculus of variations',
      q: 'The functional $J[y] = \\displaystyle\\int_0^1 (y\'^2 + y^2)\\,dx$ is minimised over smooth curves with $y(0) = 0$ and $y(1) = 1$. The minimum value of $J$ is ______ (to three decimal places).',
      answer: 1.313, tol: 0.003, calc: () => Math.cosh(1) / Math.sinh(1),
      sol: 'The Euler equation is $y\'\' = y$; with the end conditions, $y = \\sinh x/\\sinh 1$. Integrate $\\int y\'^2\\,dx$ by parts: $[yy\']_0^1 - \\int yy\'\'\\,dx = [yy\']_0^1 - \\int y^2\\,dx$. So $J = [yy\']_0^1 = y(1)y\'(1) = \\cosh 1/\\sinh 1 = \\coth 1 = 1.313$.',
      trap: 'The by-parts trick avoids integrating $\\sinh^2$ and $\\cosh^2$ separately.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'lag-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'simple systems',
      make(r) {
        const m1 = int(r, 4, 9), m2 = int(r, 1, m1 - 1), Ir = int(r, 1, 6);
        const answer = round((m1 - m2) * g / (m1 + m2 + Ir), 3);
        return { q: `Masses of ${m1} kg and ${m2} kg hang from a light string over a pulley with $I/R^2 = ${Ir}$ kg that turns without slipping. Using the Lagrangian, the acceleration of the masses is ______ m/s² ($g = 9.8$ m/s²).`,
          answer, tol: 0.02, unit: 'm/s²', m1, m2, Ir,
          sol: `$T = \\tfrac12(${m1} + ${m2} + ${Ir})\\dot x^2$ and $V = -(${m1} - ${m2})gx$. Euler-Lagrange: $${m1 + m2 + Ir}\\ddot x = ${m1 - m2}g$, so $\\ddot x = ${answer}$ m/s².`,
          trap: 'Leaving out $I/R^2$ treats the pulley as massless.' };
      },
      verify: (p) => (p.m1 - p.m2) * g / (p.m1 + p.m2 + p.Ir) },
    { id: 'lag-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotating constraints',
      make(r) {
        const R = pick(r, 0.1, 0.5, 0.05), w = int(r, Math.ceil(Math.sqrt(g / R)) + 1, Math.ceil(Math.sqrt(g / R)) + 8);
        const c = g / (w * w * R), answer = round(Math.acos(c) * 180 / Math.PI, 2);
        return { q: `A smooth vertical hoop of radius ${R} m spins at ${w} rad/s about its vertical diameter. A bead on it stays at rest relative to the hoop, away from the bottom. Find the angle (in degrees) between the radius to the bead and the downward vertical ($g = 9.8$ m/s²).`,
          answer, tol: 0.3, unit: '°', R, w,
          sol: `From $L = \\tfrac12 mR^2(\\dot\\theta^2 + \\omega^2\\sin^2\\theta) + mgR\\cos\\theta$: $\\ddot\\theta = \\sin\\theta(\\omega^2\\cos\\theta - g/R)$. Off-bottom equilibrium: $\\cos\\theta_0 = \\dfrac{g}{\\omega^2R} = \\dfrac{9.8}{${w * w}\\times${R}} = ${round(c, 4)}$, so $\\theta_0 = ${answer}^\\circ$.` };
      },
      verify: (p) => Math.acos(g / (p.w * p.w * p.R)) * 180 / Math.PI },
    { id: 'lag-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'generalised momentum',
      make(r) {
        const a = int(r, 1, 5), b = int(r, -4, 4) || 2, c = int(r, 1, 5), qq = int(r, -3, 3), v = int(r, -3, 4);
        const answer = 2 * a * v + b * qq;
        return { q: `For the Lagrangian $L = ${a}\\dot q^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}q\\dot q - ${c}q^2$, find the canonical momentum $p$ at the instant when $q = ${qq}$ and $\\dot q = ${v}$.`,
          answer, tol: 0, a, b, qq, v,
          sol: `$p = \\partial L/\\partial\\dot q = ${2 * a}\\dot q ${b < 0 ? '-' : '+'} ${Math.abs(b)}q = ${2 * a}(${v}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}(${qq}) = ${answer}$. (The $q\\dot q$ term does not change the equation of motion, but it does change $p$.)` };
      },
      verify: (p) => 2 * p.a * p.v + p.b * p.qq },
    { id: 'lag-g04', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'degrees of freedom',
      make(r) {
        const sys = choose(r, [
          ['four point masses joined by six light rigid rods into a rigid tetrahedron, free in space', 6, 12],
          ['a double pendulum swinging in a fixed vertical plane', 2, 4],
          ['a spherical pendulum (a bob on a light rigid rod pivoted at a fixed point)', 2, 3],
          ['two point masses joined by a rigid rod, sliding on a horizontal table', 3, 4],
          ['a bead on a circular wire that rotates about a fixed diameter at a constant rate', 1, 3],
          ['three point masses on a light rigid rod (in a straight line), free in space', 5, 9],
          ['a rigid body free to rotate about a fixed point', 3, 6],
          ['a triple pendulum in a fixed vertical plane', 3, 6],
        ]);
        const [what, n, wrong] = sys;
        const o = mcqOptions(r, n, [wrong, n + 1, n - 1 > 0 ? n - 1 : n + 2, n + 3], (v) => String(v));
        return { q: `How many degrees of freedom does this system have: ${what}?`, ...o,
          sol: `Count coordinates and subtract independent holonomic constraints. The system has <b>${n}</b> degree${n > 1 ? 's' : ''} of freedom.${n === 6 ? ' Any rigid body free in space has 6: 3 for a point and 3 angles.' : ''}${n === 5 ? ' Collinear masses form a rigid line: the spin about the line itself means nothing, so 3 + 2 = 5.' : ''}`,
          trap: `${wrong} is what you get by counting coordinates or rods carelessly.` };
      } },
    { id: 'lag-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'surfaces of revolution',
      make(r) {
        const alpha = choose(r, [20, 30, 40, 45, 50, 60]), rad = pick(r, 0.2, 1.5, 0.1);
        const a = alpha * Math.PI / 180, answer = round(Math.sqrt(g * rad / Math.tan(a)), 3);
        return { q: `A particle slides without friction on the inside of a cone with its vertex down and axis vertical; the cone's surface makes an angle of ${alpha}° with the axis. For a horizontal circular orbit of radius ${rad} m, find the particle's speed in m/s ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'm/s', alpha, rad,
          sol: `With $z = r\\cot\\alpha$: $L = \\tfrac12 m(\\dot r^2\\csc^2\\alpha + r^2\\dot\\phi^2) - mgr\\cot\\alpha$. The radial equation for a circle gives $mr\\dot\\phi^2 = mg\\cot\\alpha$, so $v^2 = (r\\dot\\phi)^2 = gr\\cot\\alpha = 9.8\\times${rad}\\times\\cot ${alpha}^\\circ$ and $v = ${answer}$ m/s.`,
          trap: 'The angle here is between the surface and the axis; $\\cot\\alpha$ becomes $\\tan\\alpha$ if you measure it from the horizontal.' };
      },
      verify: (p) => Math.sqrt(g * p.rad / Math.tan(p.alpha * Math.PI / 180)) },
    { id: 'lag-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotating constraints',
      make(r) {
        const w = pick(r, 1, 4, 0.5), r0 = pick(r, 0.1, 0.5, 0.05), Lr = pick(r, 1, 3, 0.5);
        const answer = round(Math.acosh(Lr / r0) / w, 3);
        return { q: `A bead slides without friction on a horizontal rod of length ${Lr} m that rotates at ${w} rad/s about a vertical axis through one end. It starts at rest relative to the rod, ${r0} m from the axis. How long (in s) does it take to fly off the free end?`,
          answer, tol: Math.max(0.005, answer * 0.01), unit: 's', w, r0, Lr,
          sol: `$L = \\tfrac12 m(\\dot r^2 + \\omega^2r^2)$ gives $\\ddot r = \\omega^2 r$, so $r = r_0\\cosh\\omega t$. Set $r = ${Lr}$: $\\cosh(${w}t) = ${round(Lr / r0, 3)}$, $t = \\cosh^{-1}(${round(Lr / r0, 3)})/${w} = ${answer}$ s.`,
          trap: 'The motion is exponential, not oscillatory: $\\ddot r = +\\omega^2 r$.' };
      },
      verify: (p) => Math.acosh(p.Lr / p.r0) / p.w },
    { id: 'lag-g07', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
      make(r) {
        const gm = int(r, 1, 6), k = int(r, 2, 9);
        const o = mcqOptions(r, `\\ddot x + ${gm}\\dot x + ${k}x = 0`, [`\\ddot x + ${k}x = 0`, `\\ddot x + ${2 * gm}\\dot x + ${k}x = 0`, `\\ddot x - ${gm}\\dot x + ${k}x = 0`], (v) => `$${v}$`);
        return { q: `A particle of unit mass has the Lagrangian $L = e^{${gm}t}\\left(\\tfrac12\\dot x^2 - \\tfrac{${k}}{2}x^2\\right)$. Its equation of motion is`, ...o,
          sol: `$\\dfrac{d}{dt}(e^{${gm}t}\\dot x) = e^{${gm}t}(\\ddot x + ${gm}\\dot x)$ and $\\partial L/\\partial x = -${k}e^{${gm}t}x$. Cancel the exponential: $\\ddot x + ${gm}\\dot x + ${k}x = 0$, damping rate equal to the exponent.`,
          trap: 'The time-dependent factor must be differentiated too; that is where the damping comes from.' };
      } },
    { id: 'lag-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coupled systems',
      make(r) {
        const M = int(r, 1, 6), m = int(r, 1, 4), l = pick(r, 0.3, 1.5, 0.1);
        const answer = round(Math.sqrt(g / l * (M + m) / M), 3);
        return { q: `A pendulum with a ${m} kg bob on a light rod of length ${l} m hangs from a ${M} kg block that slides freely on a smooth horizontal rail. Find the angular frequency (rad/s) of small oscillations ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'rad/s', M, m, l,
          sol: `The block coordinate is cyclic, so total horizontal momentum is conserved and, for small angles, $\\ddot X = -\\dfrac{ml}{M + m}\\ddot\\theta$. The pendulum equation $l\\ddot\\theta + \\ddot X = -g\\theta$ becomes $\\dfrac{M}{M + m}l\\ddot\\theta = -g\\theta$. So $\\omega = \\sqrt{\\dfrac{g}{l}\\dfrac{M + m}{M}} = \\sqrt{\\dfrac{9.8}{${l}}\\times\\dfrac{${M + m}}{${M}}} = ${answer}$ rad/s.`,
          trap: 'A fixed support would give $\\sqrt{g/l}$; the recoiling block raises the frequency.' };
      },
      verify: (p) => Math.sqrt(g / p.l * (p.M + p.m) / p.M) },
    { id: 'lag-g09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'coupled systems',
      make(r) {
        const m = int(r, 1, 4), M = int(r, 1, 5), r0 = pick(r, 0.2, 1, 0.1);
        const answer = round(Math.sqrt(3 * M * g / ((m + M) * r0)), 3);
        return { q: `A ${m} kg puck on a smooth table is tied to a string that passes through a hole and holds a ${M} kg mass hanging below. The puck circles the hole at radius ${r0} m. Find the angular frequency (rad/s) of small radial oscillations about this circle ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'rad/s', m, M, r0,
          sol: `$L = \\tfrac12(m + M)\\dot r^2 + \\tfrac12 mr^2\\dot\\theta^2 - Mgr$, with $\\ell = mr^2\\dot\\theta$ conserved. Radial: $(m + M)\\ddot r = \\ell^2/(mr^3) - Mg$. At the circle $\\ell^2/(mr_0^3) = Mg$, and linearising gives $\\omega^2 = \\dfrac{3Mg}{(m + M)r_0} = \\dfrac{3\\times${M}\\times9.8}{${m + M}\\times${r0}}$, so $\\omega = ${answer}$ rad/s.`,
          trap: 'The inertia is $m + M$ (both move), and the factor 3 comes from differentiating $1/r^3$.' };
      },
      verify: (p) => Math.sqrt(3 * p.M * g / ((p.m + p.M) * p.r0)) },
    { id: 'lag-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'calculus of variations',
      make(r) {
        const R = pick(r, 0.5, 2, 0.5), deg = choose(r, [60, 90, 120, 180]), h = pick(r, 0.5, 3, 0.5);
        const answer = round(Math.hypot(R * deg * Math.PI / 180, h), 3);
        return { q: `Find the length (m) of the shortest path on the surface of a cylinder of radius ${R} m between two points that are ${deg}° apart around the axis and ${h} m apart along it.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'm', R, deg, h,
          sol: `$ds = \\sqrt{R^2 d\\phi^2 + dz^2}$, so the length is $\\int\\sqrt{R^2 + z\'^2}\\,d\\phi$. $z$ is cyclic, so $z\' = $ const: a helix (a straight line once the cylinder is unrolled). Length $= \\sqrt{(R\\Delta\\phi)^2 + h^2} = \\sqrt{(${R}\\times${round(deg * Math.PI / 180, 4)})^2 + ${h}^2} = ${answer}$ m.` };
      },
      verify: (p) => Math.hypot(p.R * p.deg * Math.PI / 180, p.h) },
    { id: 'lag-g11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'conservation laws',
      make(r) {
        const [a, b] = choose(r, [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, -2], [2, -1]]);
        const co = (c, first) => (c === 1 ? (first ? '' : '+ ') : c === -1 ? (first ? '-' : '- ') : c < 0 ? (first ? `-${-c}` : `- ${-c}`) : (first ? `${c}` : `+ ${c}`));
        const lin = (c1, s1, c2, s2) => `${co(c1, true)}${s1} ${co(c2, false)}${s2}`;
        const arg = lin(a, 'x', b, 'y');
        const right = lin(b, 'p_x', -a, 'p_y'), wrong = lin(a, 'p_x', b, 'p_y');
        const opts = [right, wrong, 'p_x', 'p_y'].map((x) => `$${x}$`).concat(['$\\tfrac12 m(\\dot x^2 + \\dot y^2) + V$']);
        return { q: `A particle moves in a plane with $L = \\tfrac12 m(\\dot x^2 + \\dot y^2) - V(${arg})$ for an arbitrary smooth $V$. Which of the following are conserved?`,
          options: opts, answer: [0, 4],
          sol: `The shift $(\\delta x, \\delta y) = \\epsilon(${b}, ${-a})$ leaves $${arg}$ unchanged, so by Noether's theorem $p_x\\delta x + p_y\\delta y \\propto ${right}$ is conserved. Check: $\\dot p_x = ${-a}V'$ and $\\dot p_y = ${-b}V'$, so $${lin(b, '\\dot p_x', -a, '\\dot p_y')} = 0$. The energy is conserved because $L$ has no explicit $t$. $p_x$ and $p_y$ separately are not, and $${wrong}$ changes at the rate $${-(a * a + b * b)}V'$.`,
          trap: 'The conserved momentum points along the level lines of $V$, perpendicular to its gradient.' };
      } },
    { id: 'lag-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'simple systems',
      make(r) {
        const m1 = int(r, 2, 8), m2 = int(r, 1, 4), m3 = int(r, m2 + 1, 6);
        const mu4 = 4 * m2 * m3 / (m2 + m3);
        const a = g * (m1 - mu4) / (m1 + mu4), answer = round(Math.abs(a), 3);
        return { q: `A double Atwood machine: a ${m1} kg mass hangs on one side of a fixed pulley; on the other side hangs a light pulley carrying ${m2} kg and ${m3} kg masses. All strings and pulleys are light and frictionless. Find the magnitude of the acceleration (m/s²) of the ${m1} kg mass ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.02, answer * 0.01), unit: 'm/s²', m1, m2, m3,
          sol: `With two coordinates ($x$ for the ${m1} kg mass, $y$ on the lower pulley), eliminating $\\ddot y$ shows the lower pulley behaves like an effective mass $\\dfrac{4m_2m_3}{m_2 + m_3} = ${round(mu4, 3)}$ kg. So $a = g\\dfrac{m_1 - ${round(mu4, 3)}}{m_1 + ${round(mu4, 3)}} = ${round(a, 3)}$ m/s² (positive means the ${m1} kg mass goes down), magnitude ${answer} m/s².`,
          trap: 'The lower pulley does not act like its total mass $m_2 + m_3$: the two masses accelerate relative to it.' };
      },
      verify: (p) => { const mu = 4 * p.m2 * p.m3 / (p.m2 + p.m3); return Math.abs(g * (p.m1 - mu) / (p.m1 + mu)); } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
