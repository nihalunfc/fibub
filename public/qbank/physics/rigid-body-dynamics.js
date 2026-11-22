// Rigid body dynamics (GATE / CSIR NET level): the inertia tensor, products of inertia and principal axes, L = I w,
// kinetic energy, Euler's equations, torque-free symmetric tops and the Earth's wobble, stability of free rotation,
// dynamic imbalance, Euler angles and the heavy symmetric top (precession, nutation, sleeping top).
// Rolling and simple fixed-axis rotation are in the JAM topics rigid-body-rotation and moment-of-inertia.
// Convention: I_ij = sum m (r^2 delta_ij - x_i x_j), so products of inertia carry a minus sign. Original questions.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './rigid-body-dynamics.more.gen.js';
import more2 from './rigid-body-dynamics.more2.gen.js';

const g = 9.8;
const DEG = Math.PI / 180;

export default {
  topic: 'rigid-body-dynamics',
  items: [
    // ---------- level 1 ----------
    { id: 'rbd-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'A rigid body has inertia tensor $I$ about a point. Its moment of inertia about an axis through that point along the unit vector $\\hat n$ is',
      options: ['$\\hat n^{T}I\\,\\hat n$', '$\\operatorname{tr} I$', '$|I\\hat n|$', '$\\det I$'], answer: 0,
      sol: '$I_{\\hat n} = \\sum_{ij}I_{ij}n_in_j = \\sum m(r^2 - (\\vec r\\cdot\\hat n)^2)$, which is the sum of $m\\times$(distance from the axis)$^2$. For $\\hat n$ along $x$ it gives $I_{xx}$.' },
    { id: 'rbd-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'For a rigid body rotating about a fixed point, the angular momentum $\\vec L = I\\vec\\omega$ is parallel to $\\vec\\omega$',
      options: ['always', 'only when $\\vec\\omega$ lies along a principal axis (or the principal moments are equal)', 'only when the body is a sphere', 'never'], answer: 1,
      sol: 'In principal axes $\\vec L = (I_1\\omega_1, I_2\\omega_2, I_3\\omega_3)$. This is a multiple of $\\vec\\omega$ only if $\\vec\\omega$ is an eigenvector of $I$: along a principal axis, or in a plane of equal moments. A sphere or cube ($I_1 = I_2 = I_3$) has $\\vec L \\parallel \\vec\\omega$ for every axis.' },
    { id: 'rbd-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'inertia tensor',
      q: 'A uniform solid cube has mass 6 kg and side 1 m. Its moment of inertia about any axis through its centre is ______ kg m².',
      answer: 1, tol: 0, unit: 'kg m²', calc: () => 6 * 1 / 6,
      sol: 'About an axis through the centre parallel to an edge, $I = M(a^2 + a^2)/12 = Ma^2/6 = 1$ kg m². All three principal moments are equal, so the inertia tensor is a multiple of the unit matrix and every axis through the centre (including a body diagonal) gives the same value.',
      trap: 'Students often expect the diagonal to be different; symmetry makes the cube behave like a sphere for rotation.' },
    { id: 'rbd-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'The kinetic energy of a rigid body rotating with angular velocity $\\vec\\omega$ about a fixed point is',
      options: ['$\\tfrac12|I\\vec\\omega|^2$', '$\\tfrac12\\omega^2\\operatorname{tr}I$', '$\\tfrac12\\vec\\omega^{\\,T}I\\vec\\omega$', '$\\tfrac12 I\\omega$'], answer: 2,
      sol: '$T = \\tfrac12\\sum m|\\vec\\omega\\times\\vec r|^2 = \\tfrac12\\vec\\omega^{\\,T}I\\vec\\omega = \\tfrac12\\vec\\omega\\cdot\\vec L$. In principal axes: $\\tfrac12(I_1\\omega_1^2 + I_2\\omega_2^2 + I_3\\omega_3^2)$.' },
    { id: 'rbd-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Euler\'s equations',
      q: 'For a body with principal moments $I_1, I_2, I_3$ and no external torque, Euler\'s equation for $\\omega_1$ is',
      options: ['$I_1\\dot\\omega_1 = (I_3 - I_2)\\omega_2\\omega_3$', '$I_1\\dot\\omega_1 = (I_2 + I_3)\\omega_2\\omega_3$', '$I_1\\dot\\omega_1 = 0$', '$I_1\\dot\\omega_1 = (I_2 - I_3)\\omega_2\\omega_3$'], answer: 3,
      sol: 'In the body frame $\\dot{\\vec L} + \\vec\\omega\\times\\vec L = \\vec\\tau = 0$. The first component: $I_1\\dot\\omega_1 + \\omega_2I_3\\omega_3 - \\omega_3I_2\\omega_2 = 0$, so $I_1\\dot\\omega_1 = (I_2 - I_3)\\omega_2\\omega_3$. The others follow by cycling $1 \\to 2 \\to 3$.',
      trap: 'The cyclic order fixes the sign: for $\\omega_1$ it is $I_2 - I_3$.' },
    { id: 'rbd-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'gyroscopes',
      q: 'A gyroscope wheel ($I = 0.002$ kg m², spinning at 200 rad/s) of mass 0.5 kg is supported at one end of its horizontal axle, its centre of mass 0.1 m from the pivot. Its precession rate is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 1.225, tol: 0.01, unit: 'rad/s', calc: () => 0.5 * 9.8 * 0.1 / (0.002 * 200),
      sol: 'Gravity\'s torque $Mgr = 0.49$ N m turns the horizontal angular momentum $I\\omega = 0.4$ kg m²/s, so $\\Omega = Mgr/(I\\omega) = 1.225$ rad/s (for a fast spin, ignoring the small extra angular momentum of the precession itself).' },

    // ---------- level 2 ----------
    { id: 'rbd-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'Point masses of 1 kg at $(1, 1, 0)$ m and 2 kg at $(1, -1, 0)$ m form a rigid body. With $I_{xy} = -\\sum m\\,xy$, the product of inertia $I_{xy}$ is ______ kg m².',
      answer: 1, tol: 0, unit: 'kg m²', calc: () => -(1 * 1 * 1 + 2 * 1 * -1),
      sol: '$\\sum mxy = 1(1)(1) + 2(1)(-1) = -1$, so $I_{xy} = +1$ kg m².',
      trap: 'Watch both the minus sign in the definition and the negative coordinate.' },
    { id: 'rbd-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'A thin uniform square plate of mass $M$ and side $a$ lies in the $xy$ plane, centred at the origin with edges along the axes. Its principal moments about the centre are',
      options: ['$\\tfrac{1}{12}Ma^2$, $\\tfrac{1}{12}Ma^2$, $\\tfrac16Ma^2$', '$\\tfrac16Ma^2$, $\\tfrac16Ma^2$, $\\tfrac13Ma^2$', '$\\tfrac1{12}Ma^2$ three times', '$\\tfrac13Ma^2$, $\\tfrac13Ma^2$, $\\tfrac23Ma^2$'], answer: 0,
      sol: 'In-plane axes: $I_x = I_y = Ma^2/12$ (like a rod of length $a$). Perpendicular axis: $I_z = I_x + I_y = Ma^2/6$. Because $I_x = I_y$, every axis in the plane through the centre (including the diagonals) is also principal with $Ma^2/12$.' },
    { id: 'rbd-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'Which statements about the inertia tensor of a rigid body are always true?',
      options: ['Its principal moments are real and non-negative', 'Its principal axes can be chosen mutually perpendicular', 'For any labelling of the principal moments, $I_1 + I_2 \\ge I_3$', 'Its off-diagonal elements are unchanged when the axes are rotated'], answer: [0, 1, 2],
      sol: '$I$ is real and symmetric, so its eigenvalues are real and its eigenvectors orthogonal; each eigenvalue is a sum of $m\\times$(distance)$^2$, so non-negative. $I_1 + I_2 - I_3 = 2\\sum mz^2 \\ge 0$ in principal axes (equality for a flat body, the perpendicular axis theorem). Off-diagonal elements change with the axes; they vanish in principal axes.' },
    { id: 'rbd-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'A torque-free symmetric body ($I_1 = I_2$) spins with $\\omega_3$ about its symmetry axis plus a small $\\omega_\\perp$. In the body frame, $\\vec\\omega_\\perp$ rotates about the symmetry axis at',
      options: ['$\\omega_3$', '$\\Omega = \\dfrac{I_3 - I_1}{I_1}\\omega_3$', '$\\Omega = \\dfrac{I_1}{I_3}\\omega_3$', '$\\Omega = \\dfrac{I_3}{I_1}\\omega_3$'], answer: 1,
      sol: 'Euler\'s equations with $I_1 = I_2$: $\\dot\\omega_3 = 0$, and $\\dot\\omega_1 = -\\Omega\\omega_2$, $\\dot\\omega_2 = \\Omega\\omega_1$ with $\\Omega = (I_3 - I_1)\\omega_3/I_1$. So $(\\omega_1, \\omega_2)$ turns at rate $\\Omega$, in the same sense as the spin for an oblate body ($I_3 > I_1$) and opposite for a prolate one.' },
    { id: 'rbd-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'A rigid body is a single 2 kg point mass at $(1, 2, 2)$ m (plus a massless frame to the origin). The trace of its inertia tensor about the origin is ______ kg m².',
      answer: 36, tol: 0, unit: 'kg m²', calc: () => 2 * 2 * 9,
      sol: '$I_{xx} = m(y^2 + z^2) = 16$, $I_{yy} = m(x^2 + z^2) = 10$, $I_{zz} = m(x^2 + y^2) = 10$. Trace $= 36 = 2mr^2$ (each $r^2$ is counted twice), and the trace is the same in every set of axes.' },
    { id: 'rbd-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'Treat the Earth as a rigid, torque-free oblate body with $(I_3 - I_1)/I_1 \\approx 1/305$, spinning once a day. If its rotation axis is slightly off its symmetry axis, the axis wobbles (in the body) with a period of about',
      options: ['1 day', '26 000 years', '305 days', '1 year'], answer: 2,
      sol: '$\\Omega = \\dfrac{I_3 - I_1}{I_1}\\omega_3 = \\omega_3/305$, so the period is 305 days (the Euler period). The observed Chandler wobble is about 433 days because the Earth is elastic. The 26 000-year precession is a different, torque-driven effect.' },
    { id: 'rbd-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'A body has principal moments $(1, 2, 3)$ kg m² and angular velocity $\\vec\\omega = (1, 1, 1)$ rad/s in principal axes. Its rotational kinetic energy is ______ J.',
      answer: 3, tol: 0, unit: 'J', calc: () => 0.5 * (1 + 2 + 3),
      sol: '$\\vec L = (1, 2, 3)$ kg m²/s and $T = \\tfrac12\\vec\\omega\\cdot\\vec L = \\tfrac12(1 + 2 + 3) = 3$ J.' },
    { id: 'rbd-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'stability',
      q: 'A rigid body with three different principal moments spins freely (no torque). Which statements are correct?',
      options: ['Rotation about the axis of largest moment is stable', 'Rotation about the axis of smallest moment is stable, if no energy is lost', 'Rotation about the intermediate axis is unstable', 'If the body slowly loses energy internally (flexing), it ends up spinning about its axis of smallest moment'], answer: [0, 1, 2],
      sol: 'Linearising Euler\'s equations about steady spin around axis $i$ gives oscillation when $I_i$ is largest or smallest and exponential growth when it is intermediate (the tennis racket theorem). With dissipation at fixed $L$, the energy $L^2/2I$ is lowest for the largest $I$, so the body drifts to the axis of largest moment (as the Explorer 1 satellite did).' },
    { id: 'rbd-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'The inertia tensor about a point displaced by $\\vec a$ from the centre of mass is related to that about the centre of mass by',
      options: ['$I_{ij} = I^{\\rm cm}_{ij} + Ma^2\\delta_{ij}$', '$I_{ij} = I^{\\rm cm}_{ij} - M(a^2\\delta_{ij} - a_ia_j)$', '$I_{ij} = I^{\\rm cm}_{ij} + Ma_ia_j$', '$I_{ij} = I^{\\rm cm}_{ij} + M(a^2\\delta_{ij} - a_ia_j)$'], answer: 3,
      sol: 'Substituting $\\vec r = \\vec a + \\vec r\\,\'$ into $\\sum m(r^2\\delta_{ij} - x_ix_j)$, the cross terms vanish because $\\sum m\\vec r\\,\' = 0$, leaving the extra term of a point mass $M$ at $\\vec a$. The diagonal part is the familiar parallel-axis theorem.' },
    { id: 'rbd-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'A heavy symmetric top with a fixed tip has $L = \\tfrac12I_1(\\dot\\theta^2 + \\dot\\phi^2\\sin^2\\theta) + \\tfrac12I_3(\\dot\\psi + \\dot\\phi\\cos\\theta)^2 - Mgl\\cos\\theta$ in Euler angles. Which coordinates are cyclic?',
      options: ['$\\phi$ and $\\psi$', '$\\theta$ only', '$\\theta$ and $\\phi$', 'none'], answer: 0,
      sol: '$L$ contains $\\theta$ but neither $\\phi$ nor $\\psi$, so $p_\\phi$ (the vertical component of $\\vec L$) and $p_\\psi = I_3\\omega_3$ (the component along the symmetry axis) are conserved. With the energy, that reduces the problem to one dimension in $\\theta$.' },
    { id: 'rbd-042', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'How many independent components does the inertia tensor of a general rigid body (about a given point) have?',
      options: ['$9$', '$6$', '$3$', '$4$'], answer: 1,
      sol: 'It is a symmetric $3\\times3$ matrix ($I_{ij} = I_{ji}$): three diagonal moments and three products of inertia, 6 in all. Choosing principal axes uses three angles, leaving the three principal moments.' },

    // ---------- level 3 ----------
    { id: 'rbd-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'A body has principal moments $(1, 2, 3)$ kg m² and angular velocity $(1, 1, 1)$ rad/s in principal axes. The angle between $\\vec L$ and $\\vec\\omega$ is ______ degrees.',
      answer: 22.21, tol: 0.2, unit: '°', calc: () => Math.acos(6 / Math.sqrt(42)) * 180 / Math.PI,
      sol: '$\\vec L = (1, 2, 3)$. $\\cos\\alpha = \\dfrac{\\vec L\\cdot\\vec\\omega}{|\\vec L||\\vec\\omega|} = \\dfrac{6}{\\sqrt{14}\\sqrt3} = 0.926$, so $\\alpha = 22.2^\\circ$.' },
    { id: 'rbd-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'A dumbbell has 1 kg masses at $(1, 1, 0)$ m and $(-1, -1, 0)$ m. Its moment of inertia about the axis through the origin along $(1, -1, 0)$ is ______ kg m².',
      answer: 4, tol: 0, unit: 'kg m²', calc: () => 0.5 * (2 + 2 + 2 * 2),
      sol: '$I_{xx} = I_{yy} = 2$, $I_{zz} = 4$, $I_{xy} = -\\sum mxy = -2$. With $\\hat n = (1, -1, 0)/\\sqrt2$: $\\hat n^TI\\hat n = \\tfrac12(I_{xx} + I_{yy} - 2I_{xy}) = \\tfrac12(2 + 2 + 4) = 4$ kg m². Check: each mass is $\\sqrt2$ m from that axis, so $2\\times1\\times2 = 4$. (Along the rod, $(1, 1, 0)$, the moment is 0.)' },
    { id: 'rbd-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stability',
      q: 'A free body with $I_1 < I_2 < I_3$ spins at $\\omega$ about axis 2. Small perturbations $\\omega_1, \\omega_3$ grow as $e^{\\lambda t}$ with',
      options: ['$\\lambda^2 = \\omega^2\\dfrac{(I_3 - I_2)(I_2 - I_1)}{I_1I_2}$', '$\\lambda^2 = -\\omega^2\\dfrac{(I_3 - I_2)(I_2 - I_1)}{I_1I_3}$', '$\\lambda^2 = \\omega^2\\dfrac{(I_3 - I_2)(I_2 - I_1)}{I_1I_3}$', '$\\lambda = \\omega$'], answer: 2,
      sol: 'Linearise with $\\omega_2 \\approx \\omega$: $I_1\\dot\\omega_1 = (I_2 - I_3)\\omega\\omega_3$ and $I_3\\dot\\omega_3 = (I_1 - I_2)\\omega\\omega_1$. Then $\\ddot\\omega_1 = \\dfrac{(I_2 - I_3)(I_1 - I_2)}{I_1I_3}\\omega^2\\omega_1 = +\\dfrac{(I_3 - I_2)(I_2 - I_1)}{I_1I_3}\\omega^2\\omega_1$: positive, so exponential growth.' },
    { id: 'rbd-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'A torque-free rod-like symmetric body has $I_3/I_1 = 0.4$ and spins with $\\omega_3 = 20$ rad/s plus a small wobble. The magnitude of the rate at which $\\vec\\omega$ circles the symmetry axis in the body frame is ______ rad/s.',
      answer: 12, tol: 0.05, unit: 'rad/s', calc: () => Math.abs((0.4 - 1) * 20),
      sol: '$\\Omega = \\dfrac{I_3 - I_1}{I_1}\\omega_3 = (0.4 - 1)\\times20 = -12$ rad/s: 12 rad/s, in the opposite sense to the spin because the body is prolate.' },
    { id: 'rbd-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'For a heavy symmetric top with its tip fixed, which statements are correct?',
      options: ['$p_\\phi$ and $p_\\psi$ are constants of the motion', 'The spin $\\omega_3 = \\dot\\psi + \\dot\\phi\\cos\\theta$ is constant', 'In general the tilt $\\theta$ oscillates (nutates) between two limiting angles', 'The precession rate $\\dot\\phi$ is always constant'], answer: [0, 1, 2],
      sol: '$\\phi$, $\\psi$ cyclic gives A, and $p_\\psi = I_3\\omega_3$ gives B. Energy conservation with the effective potential $U_{\\rm eff}(\\theta)$ confines $\\theta$ between two turning angles: nutation. $\\dot\\phi = (p_\\phi - p_\\psi\\cos\\theta)/(I_1\\sin^2\\theta)$ changes as $\\theta$ nutates; it is constant only for steady precession.' },
    { id: 'rbd-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'A top spins upright ("sleeps") on a fixed point. It has $I_3 = 2\\times10^{-4}$ kg m², $I_1 = 3\\times10^{-4}$ kg m² about the tip, mass 0.1 kg and its centre of mass 0.04 m above the tip. The smallest spin for which upright spinning is stable is ______ rad/s ($g = 9.8$ m/s²).',
      answer: 34.29, tol: 0.3, unit: 'rad/s', calc: () => Math.sqrt(4 * 3e-4 * 0.1 * 9.8 * 0.04) / 2e-4,
      sol: 'Expanding $U_{\\rm eff}$ about $\\theta = 0$ with $p_\\phi = p_\\psi = I_3\\omega_3$ gives stability when $I_3^2\\omega_3^2 > 4I_1Mgl$. So $\\omega_3 > \\sqrt{4\\times3\\times10^{-4}\\times0.1\\times9.8\\times0.04}/(2\\times10^{-4}) = 6.86\\times10^{-3}/2\\times10^{-4} = 34.3$ rad/s. As friction slows it below this, the top starts to wobble and fall.' },
    { id: 'rbd-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'A fast symmetric top (spin $\\omega_3$, $I_3\\omega_3$ much larger than everything else) precesses steadily. Its slow precession rate is approximately',
      options: ['$\\dfrac{I_3\\omega_3}{I_1\\cos\\theta}$', '$\\sqrt{Mgl/I_1}$', '$\\dfrac{Mgl\\sin\\theta}{I_3\\omega_3}$', '$\\dfrac{Mgl}{I_3\\omega_3}$, independent of the tilt'], answer: 3,
      sol: 'Steady precession needs $Mgl = \\dot\\phi(I_3\\omega_3 - I_1\\dot\\phi\\cos\\theta)$. For a fast top the slow root is $\\dot\\phi \\approx Mgl/(I_3\\omega_3)$: the torque $Mgl\\sin\\theta$ turns the horizontal part $I_3\\omega_3\\sin\\theta$ of $\\vec L$, and the $\\sin\\theta$ cancels. The other root, $I_3\\omega_3/(I_1\\cos\\theta)$, is the fast precession.' },
    { id: 'rbd-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'A fast top (mass 0.2 kg, centre of mass 0.05 m from the tip, $I_3 = 4\\times10^{-4}$ kg m²) spins at 300 rad/s. The period of its slow precession is ______ s ($g = 9.8$ m/s²).',
      answer: 7.694, tol: 0.05, unit: 's', calc: () => 2 * Math.PI / (0.2 * 9.8 * 0.05 / (4e-4 * 300)),
      sol: '$\\Omega = Mgl/(I_3\\omega_3) = 0.098/0.12 = 0.817$ rad/s, so the period is $2\\pi/0.817 = 7.69$ s.' },
    { id: 'rbd-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Euler angles',
      q: 'With Euler angles $(\\phi, \\theta, \\psi)$ in the usual $z$-$x$-$z$ convention, the component of $\\vec\\omega$ along the body\'s symmetry axis (body $z$) is',
      options: ['$\\dot\\psi + \\dot\\phi\\cos\\theta$', '$\\dot\\phi + \\dot\\psi\\cos\\theta$', '$\\dot\\theta + \\dot\\psi$', '$\\dot\\psi\\cos\\theta$'], answer: 0,
      sol: '$\\vec\\omega = \\dot\\phi\\,\\hat z_{\\rm space} + \\dot\\theta\\,\\hat e_{\\rm node} + \\dot\\psi\\,\\hat z_{\\rm body}$. The line of nodes is perpendicular to the body $z$ axis, and the space $z$ axis makes angle $\\theta$ with it, so $\\omega_3 = \\dot\\psi + \\dot\\phi\\cos\\theta$.' },
    { id: 'rbd-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'dynamic imbalance',
      q: 'A rigid body is driven to rotate with constant $\\vec\\omega$ about a fixed axis that is not a principal axis. Which statements are correct?',
      options: ['A torque $\\vec\\omega\\times\\vec L$ must be applied by the bearings to keep $\\vec\\omega$ constant', '$\\vec L$ is fixed in the body but sweeps round in space', 'If the centre of mass lies on the axis, the bearings feel no force at all', 'The needed torque vanishes if the axis is a principal axis'], answer: [0, 1, 3],
      sol: '$\\vec L = I\\vec\\omega$ is fixed relative to the body, so in space $d\\vec L/dt = \\vec\\omega\\times\\vec L \\neq 0$ unless $\\vec L \\parallel \\vec\\omega$. The bearings supply this torque through a rotating couple of forces even when the centre of mass is on the axis (static balance without dynamic balance). This is why car wheels are balanced dynamically.' },
    { id: 'rbd-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dynamic imbalance',
      q: 'A dumbbell (two 1 kg masses on a light rod 2 m long, centre on the axis) is fixed at $30^\\circ$ to a vertical axle that turns at 5 rad/s. The torque the bearings must supply has magnitude ______ N m.',
      answer: 21.65, tol: 0.2, unit: 'N m', calc: () => 25 * 2 * Math.sin(30 * Math.PI / 180) * Math.cos(30 * Math.PI / 180),
      sol: 'Masses at $\\pm(\\sin30^\\circ, 0, \\cos30^\\circ)$ m. $I_{xz} = -\\sum mxz = -2(0.5)(0.866) = -0.866$ kg m², $I_{zz} = 2(0.25) = 0.5$ kg m². $\\vec L = \\omega(I_{xz}, 0, I_{zz})$, and $|\\vec\\omega\\times\\vec L| = \\omega^2|I_{xz}| = 25\\times0.866 = 21.7$ N m.' },
    { id: 'rbd-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dynamic imbalance',
      q: 'A thin rectangular plate with unequal sides is spun at constant angular velocity about one of its diagonals (held in bearings). Then',
      options: ['$\\vec L$ is parallel to $\\vec\\omega$ and no torque is needed', '$\\vec L$ is not parallel to $\\vec\\omega$, so the bearings must supply a rotating torque', 'the plate cannot rotate about a diagonal at all', 'the torque needed is $I\\dot\\omega$, which is zero'], answer: 1,
      sol: 'The principal axes in the plane are along the edges. A diagonal is principal only if the moments about the two edge axes are equal, i.e. for a square. For a rectangle $\\vec L$ points off the diagonal and turns with the plate, so $\\vec\\tau = \\vec\\omega\\times\\vec L \\neq 0$.' },
    { id: 'rbd-041', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'A body has principal moments $(2, 3, 5)$ kg m². It rotates with $\\vec\\omega = (1, 0, 2)$ rad/s in principal axes. The magnitude of its angular momentum is ______ kg m²/s.',
      answer: 10.198, tol: 0.02, unit: 'kg m²/s', calc: () => Math.hypot(2, 0, 10),
      sol: '$\\vec L = (2\\times1, 3\\times0, 5\\times2) = (2, 0, 10)$, so $|\\vec L| = \\sqrt{104} = 10.20$ kg m²/s.',
      trap: 'Multiplying $|\\vec\\omega| = \\sqrt5$ by a single moment of inertia is wrong: each component has its own moment.' },

    // ---------- level 4 ----------
    { id: 'rbd-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'stability',
      q: 'A free body has principal moments $(1, 2, 3)$ kg m² and spins at 2 rad/s about the intermediate axis. Small deviations grow as $e^{\\lambda t}$ with $\\lambda = $ ______ s⁻¹.',
      answer: 1.1547, tol: 0.005, unit: 's⁻¹', calc: () => Math.sqrt(4 * 1 * 1 / 3),
      sol: '$\\lambda^2 = \\omega^2\\dfrac{(I_3 - I_2)(I_2 - I_1)}{I_1I_3} = 4\\times\\dfrac{1\\times1}{3} = 1.333$, so $\\lambda = 1.155$ s⁻¹: the deviation grows tenfold in about 2 s, which is why a tossed book tumbles.' },
    { id: 'rbd-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'stability',
      q: 'A free body spins at $\\omega$ about its axis of largest moment, $I_3 > I_2 > I_1$. Small wobbles oscillate with angular frequency',
      options: ['$\\omega\\sqrt{\\dfrac{(I_3 - I_1)(I_2 - I_1)}{I_2I_3}}$', '$\\omega\\dfrac{I_3 - I_1}{I_1}$', '$\\omega\\sqrt{\\dfrac{(I_3 - I_1)(I_3 - I_2)}{I_1I_2}}$', '$\\omega$'], answer: 2,
      sol: 'Linearise: $I_1\\dot\\omega_1 = (I_2 - I_3)\\omega\\omega_2$, $I_2\\dot\\omega_2 = (I_3 - I_1)\\omega\\omega_1$. So $\\ddot\\omega_1 = -\\dfrac{(I_3 - I_2)(I_3 - I_1)}{I_1I_2}\\omega^2\\omega_1$: oscillation at the given frequency. For $I_1 = I_2$ it reduces to $(I_3 - I_1)\\omega/I_1$, the symmetric-top result.' },
    { id: 'rbd-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'stability',
      q: 'A free body with principal moments $(2, 3, 4)$ kg m² spins at 3 rad/s about the axis of largest moment. Small wobbles oscillate at ______ rad/s.',
      answer: 1.732, tol: 0.005, unit: 'rad/s', calc: () => 3 * Math.sqrt((4 - 2) * (4 - 3) / (2 * 3)),
      sol: '$\\Omega = \\omega\\sqrt{\\dfrac{(I_3 - I_1)(I_3 - I_2)}{I_1I_2}} = 3\\sqrt{\\dfrac{2\\times1}{6}} = \\sqrt3 = 1.732$ rad/s.' },
    { id: 'rbd-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'Which statements about the motion of the Earth\'s axis are correct?',
      options: ['A rigid torque-free Earth would wobble with the Euler period $I_1/(I_3 - I_1)$ days, about 305 days', 'The observed Chandler wobble is longer, about 433 days, because the Earth is not rigid', 'The 26 000-year precession of the equinoxes is a torque-free motion', 'The precession of the equinoxes is driven by the torques of the Sun and Moon on the equatorial bulge'], answer: [0, 1, 3],
      sol: 'A: $\\Omega = (I_3 - I_1)\\omega_3/I_1$ with a one-day spin. B: elastic yielding of the Earth and the oceans lengthens it. C is false and D true: the slow precession is forced, like a top\'s precession under gravity; its rate is set by the solar and lunar torques on the bulge.' },
    { id: 'rbd-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'A frisbee with $I_3 = 2I_1 = 0.02$ kg m² flies with angular momentum 0.08 kg m²/s, its symmetry axis tilted slightly from $\\vec L$. Seen from the ground, the axis wobbles round $\\vec L$ at ______ rad/s.',
      answer: 8, tol: 0.05, unit: 'rad/s', calc: () => 0.08 / 0.01,
      sol: 'For a torque-free symmetric body the symmetry axis precesses about the fixed $\\vec L$ at $\\dot\\phi = L/I_1 = 0.08/0.01 = 8$ rad/s. The spin is about $L/I_3 = 4$ rad/s, so the wobble is twice as fast as the spin (Feynman\'s wobbling plate).',
      trap: 'The body-frame rate $(I_3 - I_1)\\omega_3/I_1 = 4$ rad/s is a different quantity from the space-frame wobble.' },
    { id: 'rbd-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'For the heavy symmetric top, eliminating $\\dot\\phi$ and $\\dot\\psi$ with the conserved $p_\\phi$ and $p_\\psi$ gives a one-dimensional problem in $\\theta$ with effective potential',
      options: ['$\\dfrac{(p_\\phi - p_\\psi)^2}{2I_1} + Mgl\\cos\\theta$', '$\\dfrac{p_\\phi^2}{2I_1\\sin^2\\theta} + Mgl\\cos\\theta$', '$\\dfrac{(p_\\phi - p_\\psi\\cos\\theta)^2}{2I_1} - Mgl\\cos\\theta$', '$\\dfrac{(p_\\phi - p_\\psi\\cos\\theta)^2}{2I_1\\sin^2\\theta} + Mgl\\cos\\theta$'], answer: 3,
      sol: 'From $p_\\phi = I_1\\dot\\phi\\sin^2\\theta + p_\\psi\\cos\\theta$: $\\dot\\phi = (p_\\phi - p_\\psi\\cos\\theta)/(I_1\\sin^2\\theta)$. The energy $\\tfrac12I_1\\dot\\theta^2 + \\tfrac12I_1\\dot\\phi^2\\sin^2\\theta + p_\\psi^2/2I_3 + Mgl\\cos\\theta$ then gives $U_{\\rm eff}$ as stated (dropping the constant $p_\\psi^2/2I_3$).' },
    { id: 'rbd-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'For a top in steady precession, $Mgl = \\dot\\phi(I_3\\omega_3 - I_1\\dot\\phi\\cos\\theta)$. With $I_3\\omega_3 = 0.1$ kg m²/s, $I_1 = 0.002$ kg m², $\\theta = 60^\\circ$ and $Mgl = 0.049$ N m, the slower precession rate is ______ rad/s.',
      answer: 0.4924, tol: 0.003, unit: 'rad/s', calc: () => (0.1 - Math.sqrt(0.01 - 4 * 0.001 * 0.049)) / 0.002,
      sol: 'Quadratic: $I_1\\cos\\theta\\,\\dot\\phi^2 - I_3\\omega_3\\dot\\phi + Mgl = 0$, i.e. $0.001\\dot\\phi^2 - 0.1\\dot\\phi + 0.049 = 0$. $\\dot\\phi = \\dfrac{0.1 \\mp \\sqrt{0.01 - 0.000196}}{0.002} = \\dfrac{0.1 \\mp 0.099015}{0.002}$. Slow: $0.492$ rad/s, close to the fast-top estimate $Mgl/I_3\\omega_3 = 0.49$.' },
    { id: 'rbd-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'For a free asymmetric rigid body, Poinsot\'s construction says the tip of $\\vec\\omega$ (in the body frame) moves along the curve where',
      options: ['the energy ellipsoid $\\vec\\omega^{\\,T}I\\vec\\omega = 2T$ meets the momentum ellipsoid $|I\\vec\\omega|^2 = L^2$', 'the energy ellipsoid meets the plane $\\omega_3 = 0$', 'the momentum ellipsoid meets a sphere of radius $\\omega$', '$\\vec\\omega$ stays fixed; only $\\vec L$ moves'], answer: 0,
      sol: 'Both $T$ and $L^2$ are conserved, and in principal axes each is a quadratic form in $\\vec\\omega$: $\\sum I_i\\omega_i^2 = 2T$ and $\\sum I_i^2\\omega_i^2 = L^2$. The path (the polhode) is their intersection. Near the largest and smallest axes the curves are small loops (stable); through the intermediate axis they cross (unstable).' },

    // ---------- level 5 ----------
    { id: 'rbd-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'For the same top as in steady precession with $I_3\\omega_3 = 0.1$ kg m²/s, $I_1 = 0.002$ kg m², $\\theta = 60^\\circ$, $Mgl = 0.049$ N m, the faster steady precession rate is ______ rad/s.',
      answer: 99.51, tol: 0.1, unit: 'rad/s', calc: () => (0.1 + Math.sqrt(0.01 - 4 * 0.001 * 0.049)) / 0.002,
      sol: 'The other root of $0.001\\dot\\phi^2 - 0.1\\dot\\phi + 0.049 = 0$: $\\dot\\phi = (0.1 + 0.099015)/0.002 = 99.5$ rad/s. It is close to $I_3\\omega_3/(I_1\\cos\\theta) = 100$ rad/s, the torque-free wobble rate, slightly modified by gravity.' },
    { id: 'rbd-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'For a torque-free symmetric body spinning about an axis close to its symmetry axis, which describes the motion correctly?',
      options: ['For an oblate body ($I_3 > I_1$) the body cone rolls on the inside of the space cone', 'For an oblate body the space cone lies inside the body cone, and in the body frame $\\vec\\omega$ circles the symmetry axis in the same sense as the spin', 'For a prolate body ($I_3 < I_1$) $\\vec\\omega$ circles the symmetry axis in the same sense as the spin', 'For any symmetric body $\\vec\\omega$ is parallel to $\\vec L$'], answer: 1,
      sol: 'The symmetry axis, $\\vec\\omega$ and $\\vec L$ lie in one plane. For $I_3 > I_1$ the angle of $\\vec L$ from the axis is smaller than that of $\\vec\\omega$ ($\\tan\\theta_L = (I_1/I_3)\\tan\\theta_\\omega$), so the fixed space cone (around $\\vec L$) is inside the body cone, which rolls around it, and the body-frame rate $(I_3 - I_1)\\omega_3/I_1$ is positive. For prolate bodies the body cone rolls on the outside of the space cone and the body-frame rotation is reversed.' },
    { id: 'rbd-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'torque-free tops',
      q: 'A torque-free disc-like body with $I_3 = 2I_1$ spins with its angular velocity $10^\\circ$ away from its symmetry axis. The angle between its angular momentum and the symmetry axis is ______ degrees.',
      answer: 5.04, tol: 0.05, unit: '°', calc: () => Math.atan(0.5 * Math.tan(10 * Math.PI / 180)) * 180 / Math.PI,
      sol: 'In principal axes $\\vec L = (I_1\\omega_\\perp, I_3\\omega_3)$, so $\\tan\\theta_L = \\dfrac{I_1}{I_3}\\tan\\theta_\\omega = 0.5\\tan10^\\circ = 0.0882$ and $\\theta_L = 5.04^\\circ$.' },
    { id: 'rbd-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'heavy top',
      q: 'A fast symmetric top (large $I_3\\omega_3$) is set spinning with its axis tilted and released with $\\dot\\theta = \\dot\\phi = 0$. Which statements are correct?',
      options: ['It nutates at a frequency close to $I_3\\omega_3/I_1$', 'The nutation amplitude falls as $1/\\omega_3^2$ for faster spins', 'The average precession rate is close to $Mgl/(I_3\\omega_3)$', 'It precesses steadily from the start, with no nutation'], answer: [0, 1, 2],
      sol: 'Released from rest, the axis first dips; the tip traces cusps (the cuspidal case of nutation). Expanding about the steady-precession angle, the nutation frequency is about $I_3\\omega_3/I_1$ and the dip is about $\\dfrac{I_1Mgl\\sin\\theta}{I_3^2\\omega_3^2}$, so it shrinks as $1/\\omega_3^2$. The mean drift is the slow precession $Mgl/I_3\\omega_3$. Steady precession would need the right initial $\\dot\\phi$, which this start does not have.' },
    ...more2,
  ],
  gens: [
    { id: 'rbd-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'inertia tensor',
      make(r) {
        const pts = [0, 1].map(() => ({ m: int(r, 1, 4), x: int(r, -2, 2) || 1, y: int(r, -2, 2) || -1, z: int(r, -2, 2) }));
        const comp = choose(r, [['xy', 'x', 'y'], ['xz', 'x', 'z'], ['yz', 'y', 'z']]);
        const [lab, a, b] = comp;
        const answer = -pts.reduce((s, p) => s + p.m * p[a] * p[b], 0);
        return { q: `Point masses of ${pts[0].m} kg at $(${pts[0].x}, ${pts[0].y}, ${pts[0].z})$ m and ${pts[1].m} kg at $(${pts[1].x}, ${pts[1].y}, ${pts[1].z})$ m form a rigid body. With $I_{${lab}} = -\\sum m\\,${a}${b}$, find $I_{${lab}}$ in kg m².`,
          answer, tol: 0, unit: 'kg m²', pts, a, b,
          sol: `$\\sum m${a}${b} = ${pts[0].m}(${pts[0][a]})(${pts[0][b]}) + ${pts[1].m}(${pts[1][a]})(${pts[1][b]}) = ${-answer}$, so $I_{${lab}} = ${answer}$ kg m².` };
      },
      verify: (p) => -p.pts.reduce((s, q) => s + q.m * q[p.a] * q[p.b], 0) },
    { id: 'rbd-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'principal axes',
      make(r) {
        const I = [int(r, 1, 4), int(r, 2, 6), int(r, 3, 9)], w = [int(r, -2, 3), int(r, -2, 3), int(r, 1, 3)];
        const L = I.map((v, i) => v * w[i]);
        const ask = choose(r, ['T', 'L']);
        const answer = round(ask === 'T' ? 0.5 * (L[0] * w[0] + L[1] * w[1] + L[2] * w[2]) : Math.hypot(...L), 4);
        return { q: `A body has principal moments $(${I.join(', ')})$ kg m² and angular velocity $(${w.join(', ')})$ rad/s in principal axes. Find ${ask === 'T' ? 'its rotational kinetic energy in J' : 'the magnitude of its angular momentum in kg m²/s'}.`,
          answer, tol: Math.max(0.005, answer * 0.002), unit: ask === 'T' ? 'J' : 'kg m²/s', I, w, ask,
          sol: `$\\vec L = (I_1\\omega_1, I_2\\omega_2, I_3\\omega_3) = (${L.join(', ')})$. ${ask === 'T' ? `$T = \\tfrac12\\vec\\omega\\cdot\\vec L = ${answer}$ J.` : `$|\\vec L| = \\sqrt{${L.map((x) => x * x).join(' + ')}} = ${answer}$ kg m²/s.`}` };
      },
      verify: (p) => { const L = p.I.map((v, i) => v * p.w[i]); return p.ask === 'T' ? 0.5 * L.reduce((s, x, i) => s + x * p.w[i], 0) : Math.hypot(...L); } },
    { id: 'rbd-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
      make(r) {
        const I = [int(r, 1, 3), int(r, 2, 5), int(r, 4, 8)], w = [int(r, 1, 3), int(r, 0, 2), int(r, 1, 3)];
        const L = I.map((v, i) => v * w[i]);
        const c = (L[0] * w[0] + L[1] * w[1] + L[2] * w[2]) / (Math.hypot(...L) * Math.hypot(...w));
        const answer = round(Math.acos(Math.min(1, c)) / DEG, 2);
        return { q: `A body with principal moments $(${I.join(', ')})$ kg m² rotates with $\\vec\\omega = (${w.join(', ')})$ rad/s in principal axes. Find the angle in degrees between $\\vec L$ and $\\vec\\omega$.`,
          answer, tol: 0.2, unit: '°', I, w,
          sol: `$\\vec L = (${L.join(', ')})$. $\\cos\\alpha = \\dfrac{\\vec L\\cdot\\vec\\omega}{|\\vec L||\\vec\\omega|} = \\dfrac{${L[0] * w[0] + L[1] * w[1] + L[2] * w[2]}}{${round(Math.hypot(...L), 4)}\\times${round(Math.hypot(...w), 4)}} = ${round(c, 4)}$, so $\\alpha = ${answer}^\\circ$.` };
      },
      verify: (p) => { const L = p.I.map((v, i) => v * p.w[i]); return Math.acos(Math.min(1, L.reduce((s, x, i) => s + x * p.w[i], 0) / (Math.hypot(...L) * Math.hypot(...p.w)))) / DEG; } },
    { id: 'rbd-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'torque-free tops',
      make(r) {
        const ratio = choose(r, [0.25, 0.4, 0.5, 1.2, 1.5, 1.8, 2]), w3 = int(r, 5, 60);
        const answer = round(Math.abs((ratio - 1) * w3), 3);
        return { q: `A torque-free symmetric body has $I_3/I_1 = ${ratio}$ and spins at $\\omega_3 = ${w3}$ rad/s with a small wobble. Find the magnitude (rad/s) of the rate at which $\\vec\\omega$ circles the symmetry axis in the body frame.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', ratio, w3,
          sol: `$\\Omega = \\dfrac{I_3 - I_1}{I_1}\\omega_3 = (${ratio} - 1)\\times${w3} = ${round((ratio - 1) * w3, 3)}$ rad/s; magnitude ${answer} rad/s, ${ratio > 1 ? 'in the same sense as the spin (oblate)' : 'opposite to the spin (prolate)'}.` };
      },
      verify: (p) => Math.abs((p.ratio - 1) * p.w3) },
    { id: 'rbd-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'stability',
      make(r) {
        const I1 = int(r, 1, 3), I2 = I1 + int(r, 1, 3), I3 = I2 + int(r, 1, 3), w = int(r, 1, 6);
        const axis = choose(r, [1, 2, 3]);
        let val, kind;
        if (axis === 2) { val = w * Math.sqrt((I3 - I2) * (I2 - I1) / (I1 * I3)); kind = 'growth rate $\\lambda$ (s⁻¹) of small deviations'; }
        else if (axis === 3) { val = w * Math.sqrt((I3 - I1) * (I3 - I2) / (I1 * I2)); kind = 'angular frequency (rad/s) of small wobbles'; }
        else { val = w * Math.sqrt((I2 - I1) * (I3 - I1) / (I2 * I3)); kind = 'angular frequency (rad/s) of small wobbles'; }
        const answer = round(val, 4);
        return { q: `A free rigid body has principal moments $I_1 = ${I1}$, $I_2 = ${I2}$, $I_3 = ${I3}$ kg m² and spins at ${w} rad/s about axis ${axis}. Find the ${kind}.`,
          answer, tol: Math.max(0.002, answer * 0.005), I1, I2, I3, w, axis,
          sol: `Linearising Euler's equations about spin around axis $${axis}$ gives $\\ddot\\epsilon = -\\omega^2\\dfrac{(I_${axis} - I_a)(I_${axis} - I_b)}{I_aI_b}\\epsilon$ for the other two axes $a$, $b$. ${axis === 2 ? 'For the intermediate axis the product is negative, so deviations grow' : 'For the largest or smallest axis the product is positive, so the motion oscillates'}: the rate is ${answer}.`,
          trap: 'The denominator contains the two moments of the perturbed axes, not the spin axis.' };
      },
      verify: (p) => { const { I1, I2, I3, w } = p; return p.axis === 2 ? w * Math.sqrt((I3 - I2) * (I2 - I1) / (I1 * I3)) : p.axis === 3 ? w * Math.sqrt((I3 - I1) * (I3 - I2) / (I1 * I2)) : w * Math.sqrt((I2 - I1) * (I3 - I1) / (I2 * I3)); } },
    { id: 'rbd-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heavy top',
      make(r) {
        const M = pick(r, 0.05, 0.5, 0.05), l = pick(r, 0.02, 0.1, 0.01), I3 = pick(r, 1, 8, 0.5) * 1e-4, I1 = I3 * pick(r, 1.2, 3, 0.2);
        const answer = round(Math.sqrt(4 * I1 * M * g * l) / I3, 2);
        return { q: `A top has $I_3 = ${round(I3 * 1e4, 2)}\\times10^{-4}$ kg m², $I_1 = ${round(I1 * 1e4, 3)}\\times10^{-4}$ kg m² (about the tip), mass ${M} kg and its centre of mass ${l} m above the tip. Find the smallest spin (rad/s) for which it can sleep stably upright ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.1, answer * 0.01), unit: 'rad/s', M, l, I1, I3,
          sol: `Stability of the upright top needs $I_3^2\\omega_3^2 > 4I_1Mgl$, so $\\omega_{\\min} = \\sqrt{4I_1Mgl}/I_3 = \\sqrt{4\\times${round(I1, 7)}\\times${M}\\times9.8\\times${l}}/${round(I3, 7)} = ${answer}$ rad/s.` };
      },
      verify: (p) => Math.sqrt(4 * p.I1 * p.M * g * p.l) / p.I3 },
    { id: 'rbd-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'gyroscopes',
      make(r) {
        const M = pick(r, 0.1, 2, 0.1), d = pick(r, 0.05, 0.3, 0.05), I = pick(r, 0.5, 10, 0.5) * 1e-3, w = int(r, 50, 500);
        const answer = round(M * g * d / (I * w), 4);
        return { q: `A gyroscope (mass ${M} kg, spin moment of inertia ${round(I * 1e3, 2)}×10⁻³ kg m², spinning at ${w} rad/s) is supported at one end of its horizontal axle, with its centre of mass ${d} m from the pivot. Find the precession rate (rad/s, $g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.002, answer * 0.01), unit: 'rad/s', M, d, I, w,
          sol: `$\\Omega = \\dfrac{Mgd}{I\\omega} = \\dfrac{${M}\\times9.8\\times${d}}{${round(I, 6)}\\times${w}} = ${answer}$ rad/s.`,
          trap: 'A faster spin gives a slower precession.' };
      },
      verify: (p) => p.M * g * p.d / (p.I * p.w) },
    { id: 'rbd-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dynamic imbalance',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), a = pick(r, 0.2, 1, 0.1), th = choose(r, [10, 20, 30, 45, 60, 75]), w = int(r, 2, 20);
        const answer = round(w * w * 2 * m * a * a * Math.sin(th * DEG) * Math.cos(th * DEG), 3);
        return { q: `Two ${m} kg masses are fixed at the ends of a light rod of length ${2 * a} m whose centre is on an axle; the rod makes ${th}° with the axle, which turns at ${w} rad/s. Find the magnitude of the torque (N m) the bearings must supply.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'N m', m, a, th, w,
          sol: `With the axle along $z$: $I_{xz} = -2ma^2\\sin\\theta\\cos\\theta = -${round(2 * m * a * a * Math.sin(th * DEG) * Math.cos(th * DEG), 4)}$ kg m². $\\vec L$ has a sideways part $\\omega|I_{xz}|$ that turns with the rod, so $|\\vec\\tau| = |\\vec\\omega\\times\\vec L| = \\omega^2|I_{xz}| = ${answer}$ N m.` };
      },
      verify: (p) => p.w * p.w * 2 * p.m * p.a * p.a * Math.sin(p.th * DEG) * Math.cos(p.th * DEG) },
    { id: 'rbd-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'heavy top',
      make(r) {
        const Lz = pick(r, 0.05, 0.3, 0.05), I1 = pick(r, 1, 5, 0.5) * 1e-3, th = choose(r, [30, 45, 60]), Mgl = pick(r, 0.01, 0.08, 0.01), slow = r() < 0.6;
        const a = I1 * Math.cos(th * DEG), disc = Lz * Lz - 4 * a * Mgl;
        const answer = round((Lz + (slow ? -1 : 1) * Math.sqrt(Math.max(0, disc))) / (2 * a), 4);
        return { q: `A top precesses steadily at tilt $\\theta = ${th}^\\circ$ with $I_3\\omega_3 = ${Lz}$ kg m²/s, $I_1 = ${round(I1 * 1e3, 2)}\\times10^{-3}$ kg m² and $Mgl = ${Mgl}$ N m. Using $Mgl = \\dot\\phi(I_3\\omega_3 - I_1\\dot\\phi\\cos\\theta)$, find the ${slow ? 'slower' : 'faster'} precession rate (rad/s).`,
          answer, tol: Math.max(0.002, answer * 0.003), unit: 'rad/s', Lz, I1, th, Mgl, slow,
          sol: `Solve $I_1\\cos\\theta\\,\\dot\\phi^2 - I_3\\omega_3\\dot\\phi + Mgl = 0$: $\\dot\\phi = \\dfrac{${Lz} \\mp \\sqrt{${Lz}^2 - 4(${round(a, 6)})(${Mgl})}}{2(${round(a, 6)})}$. The ${slow ? 'slow' : 'fast'} root is ${answer} rad/s (fast-top estimates: $Mgl/I_3\\omega_3 = ${round(Mgl / Lz, 4)}$ and $I_3\\omega_3/I_1\\cos\\theta = ${round(Lz / a, 2)}$).` };
      },
      verify: (p) => { const a = p.I1 * Math.cos(p.th * DEG); return (p.Lz + (p.slow ? -1 : 1) * Math.sqrt(Math.max(0, p.Lz * p.Lz - 4 * a * p.Mgl))) / (2 * a); } },
    { id: 'rbd-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'torque-free tops',
      make(r) {
        const ratio = choose(r, [0.3, 0.5, 1.5, 2, 1.2]), aw = choose(r, [5, 10, 15, 20, 30]);
        const answer = round(Math.atan(Math.tan(aw * DEG) / ratio) / DEG, 3);
        return { q: `A torque-free symmetric body has $I_3/I_1 = ${ratio}$. Its angular velocity is ${aw}° from the symmetry axis. Find the angle (degrees) between its angular momentum and the symmetry axis.`,
          answer, tol: Math.max(0.03, answer * 0.005), unit: '°', ratio, aw,
          sol: `$\\vec L = (I_1\\omega_\\perp, I_3\\omega_3)$, so $\\tan\\theta_L = \\dfrac{I_1}{I_3}\\tan\\theta_\\omega = \\dfrac{\\tan ${aw}^\\circ}{${ratio}}$ and $\\theta_L = ${answer}^\\circ$, ${ratio > 1 ? 'closer to the axis than $\\vec\\omega$ (oblate)' : 'further from the axis than $\\vec\\omega$ (prolate)'}.` };
      },
      verify: (p) => Math.atan(Math.tan(p.aw * DEG) / p.ratio) / DEG },
    { id: 'rbd-g11', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'principal axes',
      make(r) {
        const [body, mom] = choose(r, [
          ['a thin uniform square plate (side $a$) about its centre', ['$Ma^2/12$', '$Ma^2/12$', '$Ma^2/6$']],
          ['a uniform solid sphere (radius $a$) about its centre', ['$2Ma^2/5$', '$2Ma^2/5$', '$2Ma^2/5$']],
          ['a thin uniform disc (radius $a$) about its centre', ['$Ma^2/4$', '$Ma^2/4$', '$Ma^2/2$']],
          ['a thin uniform rod (length $a$) about its centre', ['$Ma^2/12$', '$Ma^2/12$', '$0$']],
          ['a thin uniform ring (radius $a$) about its centre', ['$Ma^2/2$', '$Ma^2/2$', '$Ma^2$']],
          ['a uniform solid cube (side $a$) about its centre', ['$Ma^2/6$', '$Ma^2/6$', '$Ma^2/6$']],
        ]);
        const show = (ms) => ms.join(', ');
        const all = [['$Ma^2/12$', '$Ma^2/12$', '$Ma^2/6$'], ['$2Ma^2/5$', '$2Ma^2/5$', '$2Ma^2/5$'], ['$Ma^2/4$', '$Ma^2/4$', '$Ma^2/2$'], ['$Ma^2/12$', '$Ma^2/12$', '$0$'], ['$Ma^2/2$', '$Ma^2/2$', '$Ma^2$'], ['$Ma^2/6$', '$Ma^2/6$', '$Ma^2/6$'], ['$Ma^2/2$', '$Ma^2/2$', '$Ma^2/4$'], ['$Ma^2/3$', '$Ma^2/3$', '$2Ma^2/3$']];
        const o = mcqOptions(r, show(mom), all.map(show).filter((x) => x !== show(mom)), (v) => v);
        return { q: `The principal moments of inertia of ${body} (mass $M$) are`, ...o,
          sol: `${body.charAt(0).toUpperCase() + body.slice(1)}: ${show(mom)}. For flat bodies the moment about the normal is the sum of the two in-plane moments (perpendicular axis theorem); for a body with equal moments about three perpendicular axes, every axis through the centre is principal.` };
      } },
    { id: 'rbd-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'torque-free tops',
      make(r) {
        const I1 = pick(r, 0.005, 0.05, 0.005), Lv = pick(r, 0.02, 0.4, 0.02);
        const answer = round(Lv / I1, 3);
        return { q: `A torque-free symmetric body has $I_1 = I_2 = ${I1}$ kg m² and angular momentum ${Lv} kg m²/s, its symmetry axis tilted slightly from $\\vec L$. At what rate (rad/s) does the symmetry axis precess around $\\vec L$ in space?`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 'rad/s', I1, Lv,
          sol: `In the torque-free symmetric top, the symmetry axis cones round the fixed $\\vec L$ at $\\dot\\phi = L/I_1 = ${Lv}/${I1} = ${answer}$ rad/s.`,
          trap: 'This space-frame rate uses the transverse moment $I_1$, not $I_3$.' };
      },
      verify: (p) => p.Lv / p.I1 },
    ...more,
  ],
};
