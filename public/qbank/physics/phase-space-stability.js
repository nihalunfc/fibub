// Phase space, fixed points and stability (CSIR NET Part C, some GATE): one-dimensional flows, linearisation and
// the Jacobian, classification of fixed points in the plane by trace and determinant, conservative systems and the
// pendulum separatrix, damping, Liouville's theorem, Lyapunov functions, limit cycles (van der Pol, Hopf),
// Bendixson and Poincaré-Bendixson, index theory, bifurcations and population models. Original questions for fibub.
import { int, pick, choose, mcqOptions, round } from '../_util.js';
import more from './phase-space-stability.more.gen.js';

const TD = 'For $\\dot{\\vec x} = A\\vec x$ in the plane, with $\\tau = \\mathrm{tr}\\,A$ and $\\Delta = \\det A$: the eigenvalues are $\\lambda = \\tfrac12\\left(\\tau \\pm\\sqrt{\\tau^2 - 4\\Delta}\\right)$.';
const classify = (t, D) => {
  if (D < 0) return 'saddle';
  if (D === 0) return 'non-isolated (a line of fixed points)';
  if (t === 0) return 'centre';
  const disc = t * t - 4 * D, st = t < 0 ? 'stable' : 'unstable';
  if (disc > 0) return `${st} node`;
  if (disc === 0) return `${st} degenerate node`;
  return `${st} spiral`;
};

export default {
  topic: 'phase-space-stability',
  items: [
    // ---------- level 1 ----------
    { id: 'pss-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: '1D flows',
      q: 'For the one-dimensional flow $\\dot x = f(x)$, a fixed point $x^*$ (where $f(x^*) = 0$) is stable if',
      options: ['$f(x^*) > 0$', '$f\'(x^*) < 0$', '$f\'(x^*) > 0$', '$f\'\'(x^*) = 0$'], answer: 1,
      sol: 'Near $x^*$, write $x = x^* + \\eta$: $\\dot\\eta \\approx f\'(x^*)\\eta$, so $\\eta \\propto e^{f\'(x^*)t}$. It decays when $f\'(x^*) < 0$: the flow points towards $x^*$ from both sides. If $f\'(x^*) = 0$ the linear test is inconclusive.' },
    { id: 'pss-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'classification',
      q: 'The Jacobian at a fixed point of a planar system has two real, negative, distinct eigenvalues. The fixed point is',
      options: ['a saddle', 'an unstable node', 'a stable node', 'a centre'], answer: 2,
      sol: 'Both eigen-directions decay exponentially without rotation, so every nearby trajectory runs straight into the point: a stable node. Opposite signs give a saddle, both positive an unstable node, and purely imaginary eigenvalues a centre.' },
    { id: 'pss-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'classification',
      q: 'The linearisation at a fixed point has eigenvalues $\\lambda = \\pm2i$. For the linear system, the fixed point is',
      options: ['a stable spiral', 'a saddle', 'an unstable spiral', 'a centre'], answer: 3,
      sol: 'Purely imaginary eigenvalues give $e^{\\pm2it}$: closed elliptical orbits circling the point, neither growing nor decaying. For the full nonlinear system a linear centre may become a weak spiral; conservative (Hamiltonian) systems keep it a true centre.' },
    { id: 'pss-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: '1D flows',
      q: 'The flow $\\dot x = x^2 - 4$ has two fixed points. The stable one is at $x =$ ______.',
      answer: -2, tol: 0, calc: () => -2,
      sol: 'Fixed points: $x = \\pm2$. $f\'(x) = 2x$: at $x = -2$, $f\' = -4 < 0$, stable; at $x = 2$, $f\' = 4 > 0$, unstable. Picture: $f < 0$ between the roots (flow to the left) and $f > 0$ outside, so trajectories gather at $-2$.' },
    { id: 'pss-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'phase space',
      q: 'Two distinct trajectories in the phase space of an autonomous system $\\dot{\\vec x} = \\vec f(\\vec x)$ (smooth $\\vec f$) can never cross. Why?',
      options: ['A crossing point would have two different futures, violating uniqueness of solutions', 'Energy is always conserved', 'Phase space is always two-dimensional', 'All trajectories are closed'], answer: 0,
      sol: 'Through each point the velocity $\\vec f(\\vec x)$ is fixed, and the existence-uniqueness theorem gives exactly one solution from each starting point. Two trajectories through one point would be the same trajectory. (They can approach the same fixed point as $t\\to\\infty$, which is not a crossing.)' },
    { id: 'pss-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'phase space',
      q: 'The phase-space trajectories $(x, p)$ of an undamped harmonic oscillator are',
      options: ['spirals into the origin', 'ellipses centred on the origin', 'straight lines through the origin', 'hyperbolas'], answer: 1,
      sol: 'Energy conservation, $\\dfrac{p^2}{2m} + \\tfrac12kx^2 = E$, is the equation of an ellipse with semi-axes $\\sqrt{2E/k}$ and $\\sqrt{2mE}$. Damping turns the ellipses into inward spirals; hyperbolas belong to an inverted oscillator (a saddle).' },

    // ---------- level 2 ----------
    { id: 'pss-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'The fixed point at the origin of $\\dot x = x + 2y$, $\\dot y = 3x + y$ is',
      options: ['a saddle', 'a stable node', 'a centre', 'an unstable spiral'], answer: 0,
      sol: '$A = \\begin{pmatrix}1 & 2\\\\ 3 & 1\\end{pmatrix}$: $\\Delta = 1 - 6 = -5 < 0$. A negative determinant means real eigenvalues of opposite sign ($\\lambda = 1\\pm\\sqrt6$), whatever the trace: a saddle.' },
    { id: 'pss-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: `${TD} For $A = \\begin{pmatrix}-1 & 4\\\\ -2 & -1\\end{pmatrix}$, the eigenvalues are $-1\\pm i\\omega$. The value of $\\omega$ is ______.`,
      answer: 2.828, tol: 0.01, calc: () => Math.sqrt(4 * 9 - 4) / 2,
      sol: '$\\tau = -2$, $\\Delta = 1 + 8 = 9$, $\\tau^2 - 4\\Delta = -32$. So $\\lambda = \\tfrac12(-2 \\pm i\\sqrt{32}) = -1 \\pm 2\\sqrt2\\,i$, $\\omega = 2.828$: a stable spiral turning at angular frequency $2\\sqrt2$.' },
    { id: 'pss-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'pendulum',
      q: 'For the undamped pendulum $\\ddot\\theta = -\\omega_0^2\\sin\\theta$, the fixed point $(\\theta, \\dot\\theta) = (\\pi, 0)$ (pendulum upright) is',
      options: ['a centre', 'a stable spiral', 'a saddle', 'an unstable node'], answer: 2,
      sol: 'Put $\\theta = \\pi + \\phi$: $\\sin\\theta \\approx -\\phi$, so $\\ddot\\phi = +\\omega_0^2\\phi$, eigenvalues $\\pm\\omega_0$, opposite signs: a saddle. Its incoming and outgoing branches form the separatrix that divides swinging from whirling motion. The hanging position $\\theta = 0$ is a centre.' },
    { id: 'pss-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'damping',
      q: 'For the underdamped oscillator $\\ddot x + 2\\gamma\\dot x + \\omega_0^2x = 0$ with $0 < \\gamma < \\omega_0$, the origin of the $(x, \\dot x)$ plane is',
      options: ['a stable spiral', 'a stable node', 'a centre', 'a saddle'], answer: 0,
      sol: 'Eigenvalues $\\lambda = -\\gamma\\pm i\\sqrt{\\omega_0^2 - \\gamma^2}$: negative real part and non-zero imaginary part, so trajectories spiral inwards. Overdamping ($\\gamma > \\omega_0$) gives a stable node, critical damping a degenerate node.' },
    { id: 'pss-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'conservative systems',
      q: 'A particle of unit mass moves in $V(x) = x^4 - 2x^2$. The angular frequency of small oscillations about either minimum is ______.',
      answer: 2.828, tol: 0.01, calc: () => Math.sqrt(12 - 4),
      sol: '$V\'(x) = 4x^3 - 4x = 0$ at $x = 0, \\pm1$. $V\'\'(x) = 12x^2 - 4$: at $x = \\pm1$, $V\'\' = 8 > 0$ (minima, centres); at $x = 0$, $V\'\' = -4$ (a maximum, a saddle). $\\omega = \\sqrt{V\'\'/m} = \\sqrt8 \\approx 2.83$.' },
    { id: 'pss-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Liouville theorem',
      q: 'For a Hamiltonian flow in phase space, which statements are correct?',
      options: ['The volume of any region of phase space is preserved as it moves', 'There are no asymptotically stable fixed points or attracting limit cycles', 'The divergence of the phase-space velocity field is zero', 'Two trajectories can merge into one after a finite time'], answer: [0, 1, 2],
      sol: '$\\nabla\\cdot(\\dot q, \\dot p) = \\partial^2H/\\partial q\\partial p - \\partial^2H/\\partial p\\partial q = 0$, so volumes are preserved (Liouville). An attractor would shrink a ball of initial conditions onto a point or curve, which a volume-preserving flow cannot do. Trajectories never merge (uniqueness).' },
    { id: 'pss-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'conservative systems',
      q: 'For a particle in a one-dimensional potential $V(x)$, a fixed point at a local maximum of $V$ is, in the $(x, p)$ plane,',
      options: ['a centre', 'a stable node', 'a stable spiral', 'a saddle'], answer: 3,
      sol: 'Linearising $m\\ddot x = -V\'(x)$ about $x^*$ gives $m\\ddot\\eta = -V\'\'(x^*)\\eta$. At a maximum $V\'\' < 0$, so $\\eta$ grows or decays as $e^{\\pm\\sqrt{|V\'\'|/m}\\,t}$: a saddle. At a minimum $V\'\' > 0$ gives a centre. Without friction there are no nodes or spirals.' },
    { id: 'pss-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: '1D flows',
      q: 'The flow $\\dot x = 4x - x^3$ has three fixed points. The number of them that are stable is ______.',
      answer: 2, tol: 0, calc: () => [0, 2, -2].filter((x) => 4 - 3 * x * x < 0).length,
      sol: 'Fixed points $x = 0, \\pm2$. $f\'(x) = 4 - 3x^2$: $f\'(0) = 4 > 0$ (unstable), $f\'(\\pm2) = -8 < 0$ (stable). So 2 stable points; this is the supercritical pitchfork above threshold.' },
    { id: 'pss-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'bifurcations',
      q: 'As $r$ passes through 0, the flow $\\dot x = r - x^2$ undergoes',
      options: ['a pitchfork bifurcation', 'a saddle-node bifurcation', 'a transcritical bifurcation', 'a Hopf bifurcation'], answer: 1,
      sol: 'For $r > 0$ there are two fixed points $x = \\pm\\sqrt r$ (the positive one stable, the negative one unstable); they approach each other, merge at $r = 0$ and disappear for $r < 0$. Fixed points created or destroyed in pairs: saddle-node (fold) bifurcation.' },
    { id: 'pss-016', type: 'mcq', level: 2, exams: ['net'], sub: 'population models',
      q: 'In the Lotka-Volterra model $\\dot x = x(a - by)$, $\\dot y = y(-c + dx)$ ($a, b, c, d > 0$), the linearisation at the coexistence fixed point $(c/d, a/b)$ has eigenvalues',
      options: ['$-a$ and $-c$', '$a$ and $-c$', '$\\pm i\\sqrt{ac}$', '$\\pm\\sqrt{ac}$'], answer: 2,
      sol: 'The Jacobian there is $\\begin{pmatrix}0 & -bc/d\\\\ ad/b & 0\\end{pmatrix}$ (the diagonal terms $a - by$ and $-c + dx$ vanish at the fixed point). So $\\lambda^2 = -ac$: $\\lambda = \\pm i\\sqrt{ac}$, a centre. The model has a conserved quantity, so the populations cycle forever with period about $2\\pi/\\sqrt{ac}$ for small cycles.' },

    // ---------- level 3 ----------
    { id: 'pss-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linearisation',
      q: 'The system $\\dot x = y$, $\\dot y = -x + x^3$ has a fixed point at $(1, 0)$. The positive eigenvalue of the Jacobian there is ______.',
      answer: 1.414, tol: 0.005, calc: () => Math.sqrt(-1 + 3),
      sol: 'Jacobian $\\begin{pmatrix}0 & 1\\\\ -1 + 3x^2 & 0\\end{pmatrix}$; at $x = 1$ it is $\\begin{pmatrix}0 & 1\\\\ 2 & 0\\end{pmatrix}$, so $\\lambda^2 = 2$, $\\lambda = \\pm\\sqrt2$: a saddle. (The potential is $V = x^2/2 - x^4/4$, with a maximum at $x = \\pm1$.)' },
    { id: 'pss-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'classification',
      q: 'The origin of $\\dot x = -x + y$, $\\dot y = -x - y$ is',
      options: ['a stable node', 'a stable spiral', 'a centre', 'a saddle'], answer: 1,
      sol: '$\\tau = -2$, $\\Delta = (-1)(-1) - (1)(-1) = 2$. $\\tau^2 - 4\\Delta = 4 - 8 = -4 < 0$: complex eigenvalues $-1\\pm i$ with negative real part, a stable spiral. In polar form $\\dot r = -r$, $\\dot\\theta = -1$: it spirals clockwise into the origin.' },
    { id: 'pss-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'damping',
      q: 'For $\\ddot x + b\\dot x + 9x = 0$, the value of $b$ at which the origin changes from a stable spiral to a stable node is ______.',
      answer: 6, tol: 0, calc: () => 2 * Math.sqrt(9),
      sol: 'Eigenvalues $\\lambda = \\tfrac12(-b\\pm\\sqrt{b^2 - 36})$. They are complex for $b < 6$ (spiral) and real for $b > 6$ (node). At $b = 6$ (critical damping) they coincide: a degenerate node.' },
    { id: 'pss-020', type: 'mcq', level: 3, exams: ['net'], sub: 'limit cycles',
      q: 'Bendixson\'s criterion states that a planar system $\\dot x = f(x, y)$, $\\dot y = g(x, y)$ has no closed orbit in a simply connected region if, throughout that region,',
      options: ['$\\partial f/\\partial x + \\partial g/\\partial y$ is not identically zero and does not change sign', '$f$ and $g$ never vanish together', 'the Jacobian determinant is positive', '$\\partial f/\\partial y = \\partial g/\\partial x$'], answer: 0,
      sol: 'If a closed orbit $C$ existed, Green\'s theorem would give $\\iint(\\partial_xf + \\partial_yg)\\,dA = \\oint(f\\,dy - g\\,dx) = 0$, because the flow is tangent to $C$. A divergence of one sign makes the left side non-zero: contradiction. Example: any damped oscillator has divergence $-b < 0$ and so no periodic orbits.' },
    { id: 'pss-021', type: 'nat', level: 3, exams: ['net'], sub: 'Hopf bifurcation',
      q: 'The system $\\dot x = \\mu x - y - x(x^2 + y^2)$, $\\dot y = x + \\mu y - y(x^2 + y^2)$ becomes $\\dot r = \\mu r - r^3$, $\\dot\\theta = 1$ in polar coordinates. For $\\mu = 0.25$, the radius of the stable limit cycle is ______.',
      answer: 0.5, tol: 0.001, calc: () => Math.sqrt(0.25),
      sol: '$\\dot r = r(\\mu - r^2) = 0$ at $r = \\sqrt\\mu = 0.5$. For $r < 0.5$, $\\dot r > 0$; for $r > 0.5$, $\\dot r < 0$, so the circle attracts from both sides. As $\\mu$ crosses 0 the origin changes from a stable to an unstable spiral and the cycle is born with radius $\\sqrt\\mu$: a supercritical Hopf bifurcation.' },
    { id: 'pss-022', type: 'mcq', level: 3, exams: ['net'], sub: 'limit cycles',
      q: 'Which is a consequence of the Poincaré-Bendixson theorem?',
      options: ['Every planar system has a limit cycle', 'Hamiltonian systems have no fixed points', 'Every fixed point in the plane is stable', 'A smooth autonomous system in the plane cannot be chaotic'], answer: 3,
      sol: 'The theorem says a bounded trajectory in the plane that stays away from fixed points approaches a periodic orbit. So the long-time behaviour of planar flows is limited to fixed points, cycles and connections between them; chaos needs at least three dimensions for an autonomous flow (or two with periodic forcing, which is effectively three).' },
    { id: 'pss-023', type: 'nat', level: 3, exams: ['net'], sub: 'index theory',
      q: 'The index of a saddle point (the number of turns the vector field makes as you go once round a small loop enclosing the point) is ______.',
      answer: -1, tol: 0, calc: () => -1,
      sol: 'Going anticlockwise round a saddle such as $(\\dot x, \\dot y) = (x, -y)$, the field turns once clockwise: index $-1$. Nodes, spirals and centres all have index $+1$. Any closed orbit must enclose fixed points whose indices add to $+1$.' },
    { id: 'pss-024', type: 'msq', level: 3, exams: ['net'], sub: 'index theory',
      q: 'A closed orbit (periodic trajectory) of a smooth planar system could enclose which of these sets of fixed points?',
      options: ['A single centre', 'A single saddle', 'Two nodes and one saddle', 'Two saddles and nothing else'], answer: [0, 2],
      sol: 'The indices enclosed must sum to $+1$. A centre: $+1$, possible. A saddle: $-1$, impossible. Two nodes and a saddle: $1 + 1 - 1 = +1$, possible (as in a double-well oscillator with damping removed, around both wells). Two saddles: $-2$, impossible.' },
    { id: 'pss-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bifurcations',
      q: 'As $r$ increases through 0, the flow $\\dot x = rx - x^2$',
      options: ['loses both its fixed points', 'gains two new fixed points', 'keeps two fixed points, $x = 0$ and $x = r$, which exchange stability', 'develops a limit cycle'], answer: 2,
      sol: 'Fixed points $x = 0$ and $x = r$ for every $r$. $f\'(x) = r - 2x$: $f\'(0) = r$ and $f\'(r) = -r$. For $r < 0$, $x = 0$ is stable; for $r > 0$, $x = r$ is stable. They pass through each other at $r = 0$ and swap stability: a transcritical bifurcation (as at a laser threshold).' },
    { id: 'pss-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pendulum',
      q: 'A pendulum with $\\omega_0 = \\sqrt{g/l} = 3$ rad/s moves on its separatrix (it just reaches the upright position). Its angular speed as it passes the lowest point is ______ rad/s.',
      answer: 6, tol: 0.01, unit: 'rad/s', calc: () => 2 * 3,
      sol: 'Per unit $ml^2$, $E = \\tfrac12\\dot\\theta^2 - \\omega_0^2\\cos\\theta$. On the separatrix $E$ equals the energy at the top, $+\\omega_0^2$. At the bottom: $\\tfrac12\\dot\\theta^2 - \\omega_0^2 = \\omega_0^2$, so $\\dot\\theta = 2\\omega_0 = 6$ rad/s. The separatrix is $\\dot\\theta = \\pm2\\omega_0\\cos(\\theta/2)$.' },
    { id: 'pss-027', type: 'mcq', level: 3, exams: ['net'], sub: 'Lyapunov functions',
      q: 'For $\\dot x = -x + y$, $\\dot y = -x - y^3$, consider $V = x^2 + y^2$. Using $\\dot V$, the origin is',
      options: ['asymptotically stable', 'unstable', 'a centre', 'a saddle'], answer: 0,
      sol: '$\\dot V = 2x(-x + y) + 2y(-x - y^3) = -2x^2 - 2y^4$, negative everywhere except at the origin. $V$ is positive definite and strictly decreases along trajectories, so it is a Lyapunov function and every trajectory tends to the origin: asymptotically stable (globally here).' },
    { id: 'pss-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'classification',
      q: 'For $\\dot{\\vec x} = A\\vec x$ with $A = \\begin{pmatrix}2 & 1\\\\ 1 & 2\\end{pmatrix}$, the larger eigenvalue is ______.',
      answer: 3, tol: 0, calc: () => (4 + Math.sqrt(16 - 12)) / 2,
      sol: '$\\tau = 4$, $\\Delta = 3$, $\\lambda = \\tfrac12(4\\pm\\sqrt{16 - 12}) = 3, 1$, with eigenvectors $(1, 1)$ and $(1, -1)$. Both positive: an unstable node, with trajectories leaving fastest along $(1, 1)$.' },
    { id: 'pss-041', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'damping',
      q: 'For a critically damped oscillator, the fixed point at the origin of the $(x, \\dot x)$ plane is',
      options: ['a stable spiral', 'a centre', 'a degenerate stable node (a repeated eigenvalue with one eigenvector)', 'a saddle'], answer: 2,
      sol: 'At critical damping $\\lambda = -\\omega_0$ twice, but the matrix $\\begin{pmatrix}0 & 1\\\\ -\\omega_0^2 & -2\\omega_0\\end{pmatrix}$ has only one eigenvector, $(1, -\\omega_0)$. Solutions $(c_1 + c_2t)e^{-\\omega_0t}$ approach the origin tangent to that line without spiralling: a degenerate (improper) node.' },
    { id: 'pss-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'conservative systems',
      q: 'For $H = \\tfrac12p^2 + \\tfrac12x^2 - \\tfrac13x^3$, the energy of the separatrix (the orbit through the saddle point) is ______.',
      answer: 0.1667, tol: 0.001, calc: () => 0.5 - 1 / 3,
      sol: '$V = x^2/2 - x^3/3$, $V\' = x - x^2 = 0$ at $x = 0$ (minimum, centre) and $x = 1$ (maximum, saddle). The separatrix passes through the saddle with $p = 0$: $E = V(1) = \\tfrac12 - \\tfrac13 = \\tfrac16$. Orbits with $E < 1/6$ near the origin are closed; above it, the particle escapes.' },

    // ---------- level 4 ----------
    { id: 'pss-029', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'classification',
      q: 'The origin of $\\dot x = x - y$, $\\dot y = x + y$ is',
      options: ['an unstable node', 'a stable spiral', 'a centre', 'an unstable spiral'], answer: 3,
      sol: '$\\tau = 2$, $\\Delta = 1 + 1 = 2$, $\\tau^2 - 4\\Delta = -4$: $\\lambda = 1\\pm i$. Positive real part with rotation: an unstable spiral. In polar form, $\\dot r = r$ and $\\dot\\theta = 1$.' },
    { id: 'pss-030', type: 'nat', level: 4, exams: ['net'], sub: 'limit cycles',
      q: 'For the van der Pol oscillator $\\ddot x - \\mu(1 - x^2)\\dot x + x = 0$ with small $\\mu > 0$, the amplitude of the limit cycle is ______.',
      answer: 2, tol: 0.01, calc: () => 2,
      sol: 'Averaging: for $x \\approx a\\cos t$, the energy gained per cycle is $\\mu\\oint(1 - x^2)\\dot x^2\\,dt = \\mu\\pi a^2(1 - a^2/4)$. It vanishes for $a = 2$: smaller orbits gain energy (negative damping near $x = 0$) and larger ones lose it. So the cycle has amplitude 2, whatever the small $\\mu$.' },
    { id: 'pss-031', type: 'mcq', level: 4, exams: ['net'], sub: 'Liouville theorem',
      q: 'For a Hamiltonian system with one degree of freedom, the eigenvalues of the linearisation at a fixed point satisfy $\\lambda_1 + \\lambda_2 = 0$. So the fixed point can only be',
      options: ['a node or a spiral', 'a saddle or a centre', 'a stable spiral', 'an unstable node'], answer: 1,
      sol: 'The Jacobian of $(\\partial H/\\partial p, -\\partial H/\\partial q)$ has trace $H_{qp} - H_{pq} = 0$. With $\\tau = 0$: $\\Delta < 0$ gives a saddle, $\\Delta > 0$ a centre (for the linear system; nonlinear Hamiltonian terms keep it a centre, since a conserved $H$ forbids spiralling).' },
    { id: 'pss-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bifurcations',
      q: 'For the supercritical pitchfork $\\dot x = rx - x^3$ at $r = 0.09$, the distance between the two stable fixed points is ______.',
      answer: 0.6, tol: 0.001, calc: () => 2 * Math.sqrt(0.09),
      sol: 'Non-zero fixed points at $x = \\pm\\sqrt r = \\pm0.3$, both stable ($f\' = r - 3x^2 = -2r < 0$); $x = 0$ is unstable for $r > 0$. Distance $2\\sqrt r = 0.6$. The square-root growth is the classical "mean-field" order parameter, $\\beta = 1/2$.' },
    { id: 'pss-033', type: 'mcq', level: 4, exams: ['net'], sub: 'population models',
      q: 'Two species compete: $\\dot x = x(3 - x - 2y)$, $\\dot y = y(2 - x - y)$. The coexistence fixed point $(1, 1)$ is',
      options: ['a saddle', 'a stable node', 'a stable spiral', 'a centre'], answer: 0,
      sol: 'Jacobian $\\begin{pmatrix}3 - 2x - 2y & -2x\\\\ -y & 2 - x - 2y\\end{pmatrix}$ at $(1, 1)$: $\\begin{pmatrix}-1 & -2\\\\ -1 & -1\\end{pmatrix}$, with $\\Delta = 1 - 2 = -1 < 0$: a saddle. Almost every starting point ends at $(3, 0)$ or $(0, 2)$, both stable nodes: one species wins (competitive exclusion), depending on which side of the saddle\'s stable manifold you start.' },
    { id: 'pss-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'classification',
      q: 'A linear planar system has $\\mathrm{tr}\\,A = -4$ and $\\det A = 3$. The slower decay rate (the smaller $|\\lambda|$) is ______ per unit time.',
      answer: 1, tol: 0.001, calc: () => Math.abs((-4 + Math.sqrt(16 - 12)) / 2),
      sol: '$\\lambda = \\tfrac12(-4\\pm\\sqrt{16 - 12}) = -1, -3$: a stable node. The fast mode dies as $e^{-3t}$ and the slow mode as $e^{-t}$; at late times trajectories approach along the slow eigenvector, decaying at rate 1.' },
    { id: 'pss-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'classification',
      q: 'For a linear planar system with trace $\\tau$ and determinant $\\Delta$, which statements are correct?',
      options: ['$\\Delta < 0$ always gives a saddle', '$\\tau = 0$ and $\\Delta > 0$ give a centre', '$\\tau < 0$ and $\\Delta > 0$ give an asymptotically stable fixed point', '$\\tau > 0$, $\\Delta > 0$ and $\\tau^2 < 4\\Delta$ give a stable spiral'], answer: [0, 1, 2],
      sol: '$\\Delta = \\lambda_1\\lambda_2 < 0$ means real eigenvalues of opposite sign. $\\tau = \\lambda_1 + \\lambda_2 = 0$ with $\\Delta > 0$ means $\\lambda = \\pm i\\sqrt\\Delta$. With $\\Delta > 0$ both eigenvalues (or their real parts) have the sign of $\\tau$, so $\\tau < 0$ is stable. The last case has positive real parts: an unstable spiral.' },
    { id: 'pss-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '1D flows',
      q: 'The flow $\\dot x = 1 + x^2$ starts at $x(0) = 0$. The time at which $x$ becomes infinite is ______.',
      answer: 1.5708, tol: 0.002, calc: () => Math.PI / 2,
      sol: 'Separate: $\\int_0^x\\dfrac{dx}{1 + x^2} = t$, so $x = \\tan t$, which blows up at $t = \\pi/2 \\approx 1.571$. Nonlinear flows can escape to infinity in finite time; linear ones cannot.' },

    // ---------- level 5 ----------
    { id: 'pss-037', type: 'nat', level: 5, exams: ['net'], sub: 'bifurcations',
      q: 'Just past a saddle-node bifurcation the flow is $\\dot x = r + x^2$ with small $r > 0$. The time to pass through the bottleneck (from $x = -\\infty$ to $+\\infty$) is ______ for $r = 0.01$.',
      answer: 31.42, tol: 0.1, calc: () => Math.PI / Math.sqrt(0.01),
      sol: '$t = \\int_{-\\infty}^{\\infty}\\dfrac{dx}{r + x^2} = \\dfrac{\\pi}{\\sqrt r} = \\dfrac{\\pi}{0.1} \\approx 31.4$. The "ghost" of the vanished fixed points slows the flow, and the passage time diverges as $r^{-1/2}$: a universal scaling near a saddle-node.' },
    { id: 'pss-038', type: 'nat', level: 5, exams: ['net'], sub: 'limit cycles',
      q: 'A system in polar form is $\\dot r = r(1 - r^2)$, $\\dot\\theta = 1$. Small radial deviations from the limit cycle $r = 1$ decay as $e^{-kt}$. The value of $k$ is ______.',
      answer: 2, tol: 0.001, calc: () => -(1 - 3 * 1 ** 2),
      sol: 'With $f(r) = r - r^3$, $f\'(r) = 1 - 3r^2$, so $f\'(1) = -2$. Writing $r = 1 + \\eta$: $\\dot\\eta \\approx -2\\eta$, so $k = 2$. This is the cycle\'s Floquet (characteristic) exponent; negative means the cycle is stable.' },
    { id: 'pss-039', type: 'mcq', level: 5, exams: ['net'], sub: 'index theory',
      q: 'The planar field $\\dot x = x^2 - y^2$, $\\dot y = 2xy$ (that is, $\\dot z = z^2$ with $z = x + iy$) has an isolated fixed point at the origin. Its index is',
      options: ['$-1$', '$0$', '$1$', '$2$'], answer: 3,
      sol: 'On a circle $z = \\rho e^{i\\phi}$ the field is $z^2 = \\rho^2e^{2i\\phi}$: its direction turns by $2\\times2\\pi$ as $\\phi$ goes once round. Index 2. In general $\\dot z = z^n$ has index $n$ and $\\dot z = \\bar z^n$ has index $-n$ (the saddle is $\\bar z$).' },
    { id: 'pss-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'damping',
      q: 'For $\\ddot x + 2\\dot x + 5x = 0$, the ratio of successive maxima of $x(t)$ (later to earlier) is ______.',
      answer: 0.0432, tol: 0.001, calc: () => Math.exp(-Math.PI),
      sol: 'Eigenvalues $\\lambda = -1\\pm2i$, so $x = Ae^{-t}\\cos(2t + \\phi)$. Successive maxima are one damped period $2\\pi/2 = \\pi$ apart, so their ratio is $e^{-\\pi} \\approx 0.0432$. The logarithmic decrement is $\\pi$; in phase space the spiral shrinks by this factor per turn.' },
  ],
  gens: [
    { id: 'pss-g01', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      make(r) {
        let a = int(r, -4, 4), b = int(r, -4, 4), c = int(r, -4, 4), d = int(r, -4, 4);
        if (a * d - b * c === 0) { a = 1; b = 2; c = -3; d = -1; }
        const t = a + d, D = a * d - b * c, kind = classify(t, D);
        const all = ['saddle', 'stable node', 'unstable node', 'stable spiral', 'unstable spiral', 'centre', 'stable degenerate node', 'unstable degenerate node'];
        const o = mcqOptions(r, kind, all.filter((k) => k !== kind).sort((x, y) => (x.includes(kind.split(' ').pop()) ? -1 : 1) - (y.includes(kind.split(' ').pop()) ? -1 : 1)), (v) => v);
        return { q: `Classify the fixed point at the origin of $\\dot x = ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}y$, $\\dot y = ${c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)}y$.`, ...o,
          sol: `${TD} Here $\\tau = ${t}$, $\\Delta = (${a})(${d}) - (${b})(${c}) = ${D}$, and $\\tau^2 - 4\\Delta = ${t * t - 4 * D}$. ${D < 0 ? 'A negative determinant means real eigenvalues of opposite sign' : t === 0 ? 'Zero trace with positive determinant gives purely imaginary eigenvalues' : t * t - 4 * D < 0 ? `Complex eigenvalues with real part $\\tau/2 = ${t / 2}$` : `Real eigenvalues of the same sign as $\\tau$`}: a ${kind}.`,
          trap: 'Check the determinant first: if it is negative, the trace does not matter.' };
      } },
    { id: 'pss-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'classification',
      make(r) {
        const t = int(r, -6, 6), D = int(r, -8, 12) || 2, disc = t * t - 4 * D;
        const real = disc >= 0, answer = round(real ? (t + Math.sqrt(disc)) / 2 : Math.sqrt(-disc) / 2, 4);
        return { q: `A linear planar system has $\\mathrm{tr}\\,A = ${t}$ and $\\det A = ${D}$. ${real ? 'Find the larger eigenvalue.' : 'The eigenvalues are complex, $\\alpha\\pm i\\omega$; find $\\omega$ (the angular frequency of rotation).'}`,
          answer, tol: Math.max(0.002, Math.abs(answer) * 0.002), t, D,
          sol: `$\\lambda = \\tfrac12(\\tau\\pm\\sqrt{\\tau^2 - 4\\Delta}) = \\tfrac12(${t}\\pm\\sqrt{${disc}})$. ${real ? `The larger is $${answer}$.` : `So $\\alpha = ${t / 2}$ and $\\omega = \\sqrt{${-disc}}/2 = ${answer}$.`} The fixed point is a ${classify(t, D)}.` };
      },
      verify: (p) => { const disc = p.t * p.t - 4 * p.D; return disc >= 0 ? Math.max((p.t + Math.sqrt(disc)) / 2, (p.t - Math.sqrt(disc)) / 2) : Math.abs(Math.sqrt(-disc) / 2); } },
    { id: 'pss-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: '1D flows',
      make(r) {
        const a = int(r, -5, -1), b = int(r, 0, 2), c = int(r, 3, 6), s = choose(r, [1, -1]);
        const f = (x) => s * (x - a) * (x - b) * (x - c), fp = (x) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
        const stable = [a, b, c].filter((x) => fp(x) < 0), answer = stable.reduce((u, v) => u + v, 0);
        return { q: `For $\\dot x = ${s < 0 ? '-' : ''}(x ${a < 0 ? '+' : '-'} ${Math.abs(a)})(x${b === 0 ? '' : ` - ${b}`})(x - ${c})$, find the sum of the stable fixed points.`,
          answer, tol: 0, a, b, c, s,
          sol: `Fixed points $${a}, ${b}, ${c}$. The sign of $f$ alternates between them; for large $x$, $f$ has the sign of ${s > 0 ? '$+x^3$ (positive)' : '$-x^3$ (negative)'}. So the flow points ${s > 0 ? 'away from the outer two and into the middle one' : 'into the outer two and away from the middle one'}. Stable: ${stable.join(' and ')}, sum ${answer}.`,
          trap: 'Stable and unstable points alternate along the line for a smooth 1D flow with simple roots.' };
      },
      verify: (p) => { const f = (x) => p.s * (x - p.a) * (x - p.b) * (x - p.c); return [p.a, p.b, p.c].filter((x) => f(x - 0.01) > 0 && f(x + 0.01) < 0).reduce((u, v) => u + v, 0); } },
    { id: 'pss-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'conservative systems',
      make(r) {
        const A = int(r, 1, 4), B = int(r, 1, 6), m = pick(r, 0.5, 3, 0.5);
        const answer = round(Math.sqrt(4 * B / m), 4);
        return { q: `A particle of mass ${m} kg moves in $V(x) = ${A === 1 ? '' : A}x^4 - ${B}x^2$ (SI units). Find the angular frequency of small oscillations about a minimum.`,
          answer, tol: answer * 0.005, unit: 'rad/s', A, B, m,
          sol: `$V' = 4Ax^3 - 2Bx = 0$ gives $x^2 = B/2A = ${round(B / (2 * A), 4)}$ (minima) or $x = 0$ (a maximum: a saddle). $V'' = 12Ax^2 - 2B = 6B - 2B = 4B = ${4 * B}$ at the minima. $\\omega = \\sqrt{V''/m} = \\sqrt{${4 * B}/${m}} = ${answer}$ rad/s.` };
      },
      verify: (p) => { const x = Math.sqrt(p.B / (2 * p.A)), h = 1e-4, V = (y) => p.A * y ** 4 - p.B * y * y; return Math.sqrt((V(x + h) - 2 * V(x) + V(x - h)) / (h * h) / p.m); } },
    { id: 'pss-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'damping',
      make(r) {
        const m = pick(r, 0.5, 4, 0.5), k = int(r, 1, 50);
        const answer = round(2 * Math.sqrt(k * m), 4);
        return { q: `A mass ${m} kg on a spring of constant ${k} N/m has damping force $-b\\dot x$. Find the value of $b$ (in kg/s) at which the origin of phase space changes from a stable spiral to a stable node.`,
          answer, tol: answer * 0.005, unit: 'kg/s', m, k,
          sol: `$m\\ddot x + b\\dot x + kx = 0$ has $\\lambda = \\dfrac{-b\\pm\\sqrt{b^2 - 4km}}{2m}$. The eigenvalues stop being complex when $b^2 = 4km$: $b_c = 2\\sqrt{km} = 2\\sqrt{${k}\\times${m}} = ${answer}$ kg/s (critical damping).` };
      },
      verify: (p) => Math.sqrt(4 * p.k * p.m) },
    { id: 'pss-g06', type: 'nat', level: 3, exams: ['net'], sub: 'Hopf bifurcation',
      make(r) {
        const mu = pick(r, 0.04, 1, 0.04), a = choose(r, [1, 2, 4]), w = int(r, 1, 5), ask = choose(r, ['radius', 'period']);
        const answer = round(ask === 'radius' ? Math.sqrt(mu / a) : 2 * Math.PI / w, 4);
        return { q: `Near a supercritical Hopf bifurcation a system reads $\\dot r = ${mu}r - ${a === 1 ? '' : a}r^3$, $\\dot\\theta = ${w}$. Find the ${ask === 'radius' ? 'radius of the stable limit cycle' : 'period of the limit cycle'}.`,
          answer, tol: Math.max(0.001, answer * 0.005), mu, a, w, ask,
          sol: `$\\dot r = r(${mu} - ${a}r^2) = 0$ at $r = \\sqrt{${mu}/${a}} = ${round(Math.sqrt(mu / a), 4)}$; it is stable because $\\dot r$ changes from positive to negative there. On the cycle $\\theta$ advances at ${w} rad per unit time, so the period is $2\\pi/${w} = ${round(2 * Math.PI / w, 4)}$. The answer is ${answer}.` };
      },
      verify: (p) => { if (p.ask === 'period') return 2 * Math.PI / p.w; let lo = 1e-6, hi = 10; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (p.mu * m - p.a * m ** 3 > 0) lo = m; else hi = m; } return lo; } },
    { id: 'pss-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bifurcations',
      make(r) {
        const B = [
          ['$\\dot x = r - x^2$', 'saddle-node', 'two fixed points $\\pm\\sqrt r$ collide at $r = 0$ and vanish for $r < 0$'],
          ['$\\dot x = rx - x^2$', 'transcritical', 'the fixed points $0$ and $r$ pass through each other and exchange stability'],
          ['$\\dot x = rx - x^3$', 'supercritical pitchfork', 'for $r > 0$ the origin becomes unstable and two stable points $\\pm\\sqrt r$ grow continuously from it'],
          ['$\\dot x = rx + x^3$', 'subcritical pitchfork', 'for $r < 0$ two unstable points $\\pm\\sqrt{-r}$ flank the stable origin and shrink onto it at $r = 0$, after which nothing nearby is stable'],
          ['$\\dot r = \\mu r - r^3,\\ \\dot\\theta = \\omega$', 'Hopf', 'a stable spiral becomes unstable and a limit cycle of radius $\\sqrt\\mu$ appears'],
        ];
        const b = choose(r, B);
        const o = mcqOptions(r, b[1], B.filter((x) => x !== b).map((x) => x[1]), (v) => v);
        return { q: `As the parameter ($r$ or $\\mu$) increases through 0, the system ${b[0]} undergoes which bifurcation?`, ...o,
          sol: `It is a ${b[1]} bifurcation: ${b[2]}.` };
      } },
    { id: 'pss-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pendulum',
      make(r) {
        const l = pick(r, 0.25, 4, 0.25), ask = choose(r, ['bottom', 'angle']);
        const w0 = Math.sqrt(9.8 / l);
        if (ask === 'bottom') {
          const answer = round(2 * w0, 4);
          return { q: `A pendulum of length ${l} m ($g = 9.8$ m/s²) moves on its separatrix. Find its angular speed at the lowest point, in rad/s.`, answer, tol: answer * 0.005, unit: 'rad/s', l, ask,
            sol: `On the separatrix the energy equals that of the upright pendulum at rest: $\\tfrac12\\dot\\theta^2 - \\omega_0^2\\cos\\theta = \\omega_0^2$. At $\\theta = 0$: $\\dot\\theta = 2\\omega_0 = 2\\sqrt{9.8/${l}} = ${answer}$ rad/s.` };
        }
        const th = choose(r, [60, 90, 120]), answer = round(2 * w0 * Math.cos(th * Math.PI / 360), 4);
        return { q: `A pendulum of length ${l} m ($g = 9.8$ m/s²) moves on its separatrix. Find its angular speed when it is ${th}° from the lowest point, in rad/s.`, answer, tol: answer * 0.005, unit: 'rad/s', l, ask, th,
          sol: `The separatrix is $\\dot\\theta = 2\\omega_0\\cos(\\theta/2)$ (from $\\tfrac12\\dot\\theta^2 = \\omega_0^2(1 + \\cos\\theta)$). With $\\omega_0 = ${round(w0, 4)}$ rad/s: $\\dot\\theta = 2\\times${round(w0, 4)}\\times\\cos${th / 2}° = ${answer}$ rad/s.` };
      },
      verify: (p) => { const w2 = 9.8 / p.l, th = p.ask === 'bottom' ? 0 : p.th * Math.PI / 180; return Math.sqrt(2 * w2 * (1 + Math.cos(th))); } },
    { id: 'pss-g09', type: 'nat', level: 3, exams: ['net'], sub: 'population models',
      make(r) {
        const a = int(r, 1, 6), b = choose(r, [0.5, 1, 2]), c = int(r, 1, 6), d = choose(r, [0.5, 1, 2]), ask = choose(r, ['x', 'y', 'T']);
        const answer = round(ask === 'x' ? c / d : ask === 'y' ? a / b : 2 * Math.PI / Math.sqrt(a * c), 4);
        const what = { x: 'the prey population $x$ at the coexistence fixed point', y: 'the predator population $y$ at the coexistence fixed point', T: 'the period of small oscillations about the coexistence point' }[ask];
        return { q: `In the Lotka-Volterra model $\\dot x = x(${a} - ${b}y)$, $\\dot y = y(-${c} + ${d}x)$, find ${what}.`,
          answer, tol: answer * 0.005, a, b, c, d, ask,
          sol: `Coexistence needs $${a} - ${b}y = 0$ and $-${c} + ${d}x = 0$: $(x^*, y^*) = (${round(c / d, 4)}, ${round(a / b, 4)})$. There the Jacobian is $\\begin{pmatrix}0 & -${b}x^*\\\\ ${d}y^* & 0\\end{pmatrix}$, so $\\lambda^2 = -${b}x^*\\cdot${d}y^* = -${a * c}$: $\\lambda = \\pm i\\sqrt{${a * c}}$ and the small-oscillation period is $2\\pi/\\sqrt{${a * c}} = ${round(2 * Math.PI / Math.sqrt(a * c), 4)}$. Answer: ${answer}.` };
      },
      verify: (p) => (p.ask === 'x' ? p.c / p.d : p.ask === 'y' ? p.a / p.b : 2 * Math.PI / Math.sqrt(p.b * (p.c / p.d) * p.d * (p.a / p.b))) },
    { id: 'pss-g10', type: 'nat', level: 4, exams: ['net'], sub: 'bifurcations',
      make(r) {
        const rr = choose(r, [0.0001, 0.0004, 0.0025, 0.01, 0.04, 0.09, 0.25]);
        const answer = round(Math.PI / Math.sqrt(rr), 3);
        return { q: `Just beyond a saddle-node bifurcation, $\\dot x = ${rr} + x^2$. Find the time taken to pass through the bottleneck, from $x = -\\infty$ to $x = +\\infty$.`,
          answer, tol: answer * 0.005, rr,
          sol: `$T = \\int_{-\\infty}^{\\infty}\\dfrac{dx}{r + x^2} = \\dfrac{\\pi}{\\sqrt r} = \\dfrac{\\pi}{${round(Math.sqrt(rr), 4)}} = ${answer}$. Almost all of this time is spent near $x = 0$, where the fixed points used to be.` };
      },
      verify: (p) => 2 * Math.atan(1e12) / Math.sqrt(p.rr) },
    { id: 'pss-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'damping',
      make(r) {
        const m = pick(r, 0.5, 2, 0.5), b = pick(r, 0.1, 2, 0.1), k = int(r, 4, 40);
        const g = b / (2 * m), wd = Math.sqrt(k / m - g * g), ask = choose(r, ['ratio', 'decrement']);
        const answer = round(ask === 'ratio' ? Math.exp(-2 * Math.PI * g / wd) : 2 * Math.PI * g / wd, 5);
        return { q: `A damped oscillator has $m = ${m}$ kg, $b = ${b}$ kg/s and $k = ${k}$ N/m. Find ${ask === 'ratio' ? 'the ratio of successive maxima of $x$ (later/earlier)' : 'the logarithmic decrement (the natural log of the ratio of successive maxima, earlier/later)'}.`,
          answer, tol: Math.max(0.0005, answer * 0.005), m, b, k, ask,
          sol: `$\\gamma = b/2m = ${round(g, 5)}$ s⁻¹ and $\\omega_d = \\sqrt{k/m - \\gamma^2} = ${round(wd, 5)}$ rad/s. Maxima are $2\\pi/\\omega_d$ apart, so the decrement is $2\\pi\\gamma/\\omega_d = ${round(2 * Math.PI * g / wd, 5)}$ and the ratio $e^{-2\\pi\\gamma/\\omega_d} = ${round(Math.exp(-2 * Math.PI * g / wd), 5)}$. In phase space this is the shrink factor of the stable spiral per turn.` };
      },
      verify: (p) => { const lam = -p.b / (2 * p.m), w = Math.sqrt(p.k / p.m - lam * lam), d = -lam * 2 * Math.PI / w; return p.ask === 'ratio' ? Math.exp(-d) : d; } },
    { id: 'pss-g12', type: 'nat', level: 3, exams: ['net'], sub: 'index theory',
      make(r) {
        const N = int(r, 0, 3), F = int(r, 0, 2), Cn = int(r, 0, 2), S = int(r, 0, 3);
        const answer = N + F + Cn - S;
        return { q: `A simple closed curve in the plane, on which the vector field never vanishes, encloses ${N} node(s), ${F} spiral(s), ${Cn} centre(s) and ${S} saddle(s), and no other fixed points. Find the index of the curve (the number of turns of the field as you go once round it). Could the curve be a periodic orbit?`,
          answer, tol: 0, N, F, Cn, S,
          sol: `Nodes, spirals and centres have index $+1$, saddles $-1$, and the index of the curve is the sum: $${N} + ${F} + ${Cn} - ${S} = ${answer}$. A periodic orbit must have index $+1$, so ${answer === 1 ? 'it could be one (the index allows it; it does not guarantee it)' : 'it cannot be a periodic orbit'}.` };
      },
      verify: (p) => p.N + p.F + p.Cn - p.S },
    ...more,
  ],
};
