// Poisson brackets and canonical transformations (GATE / CSIR NET level): bracket algebra, equations of motion,
// constants of motion, angular momentum brackets, tests for canonical transformations, generating functions,
// infinitesimal generators and the Hamilton-Jacobi equation. Convention throughout:
// {f, g} = sum_i (df/dq_i dg/dp_i - df/dp_i dg/dq_i), so {q, p} = 1. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './poisson-brackets.more.gen.js';
import more2 from './poisson-brackets.more2.gen.js';

const g = 9.8;
const PB = 'Use $\\{f, g\\} = \\sum_i\\left(\\dfrac{\\partial f}{\\partial q_i}\\dfrac{\\partial g}{\\partial p_i} - \\dfrac{\\partial f}{\\partial p_i}\\dfrac{\\partial g}{\\partial q_i}\\right)$.';

export default {
  topic: 'poisson-brackets',
  items: [
    // ---------- level 1 ----------
    { id: 'pbr-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} The fundamental bracket $\\{q, p\\}$ equals`,
      options: ['$1$', '$0$', '$-1$', '$i\\hbar$'], answer: 0,
      sol: '$\\{q, p\\} = \\dfrac{\\partial q}{\\partial q}\\dfrac{\\partial p}{\\partial p} - \\dfrac{\\partial q}{\\partial p}\\dfrac{\\partial p}{\\partial q} = 1\\cdot1 - 0 = 1$. In quantum mechanics this becomes $[\\hat q, \\hat p] = i\\hbar$, which is why $i\\hbar$ is tempting but wrong here.',
      trap: 'Some books define the bracket with the opposite sign and get $-1$; always check the convention given.' },
    { id: 'pbr-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'equations of motion',
      q: 'For a function $f(q, p)$ with no explicit time dependence and Hamiltonian $H$, the bracket $\\{f, H\\}$ equals',
      options: ['$\\partial f/\\partial t$', '$df/dt$ along the motion', '$-df/dt$ along the motion', '$H\\,df/dt$'], answer: 1,
      sol: '$\\dfrac{df}{dt} = \\dfrac{\\partial f}{\\partial q}\\dot q + \\dfrac{\\partial f}{\\partial p}\\dot p = \\dfrac{\\partial f}{\\partial q}\\dfrac{\\partial H}{\\partial p} - \\dfrac{\\partial f}{\\partial p}\\dfrac{\\partial H}{\\partial q} = \\{f, H\\}$. With explicit time dependence, add $\\partial f/\\partial t$.' },
    { id: 'pbr-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} The value of $\\{x, p_x^2\\}$ when $p_x = 3$ is ______.`,
      answer: 6, tol: 0, calc: () => 2 * 3,
      sol: '$\\{x, p_x^2\\} = \\dfrac{\\partial x}{\\partial x}\\dfrac{\\partial(p_x^2)}{\\partial p_x} = 2p_x = 6$. Bracketing with $x$ acts like $\\partial/\\partial p_x$.' },
    { id: 'pbr-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: 'For any Hamiltonian, the bracket $\\{H, H\\}$ is',
      options: ['$1$', '$2H$', '$0$', '$H^2$'], answer: 2,
      sol: 'The bracket is antisymmetric, $\\{f, g\\} = -\\{g, f\\}$, so $\\{f, f\\} = 0$ for every $f$. With $dH/dt = \\{H, H\\} + \\partial H/\\partial t$, this is why a time-independent $H$ is conserved.' },
    { id: 'pbr-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'constants of motion',
      q: 'A function $f(q, p)$ with no explicit time dependence is a constant of the motion if and only if',
      options: ['$\\{f, q\\} = 0$', '$\\{f, p\\} = 0$', '$f$ is a function of $H$ only', '$\\{f, H\\} = 0$'], answer: 3,
      sol: '$df/dt = \\{f, H\\}$, so $f$ is conserved exactly when its bracket with $H$ vanishes. Functions of $H$ are conserved, but so are many others (for example $L_z$ in a central field).',
      trap: 'Being a function of $H$ is sufficient, not necessary.' },
    { id: 'pbr-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} The value of $\\{q^2, p\\}$ at $q = 2$ is ______.`,
      answer: 4, tol: 0, calc: () => 2 * 2,
      sol: '$\\{q^2, p\\} = \\dfrac{\\partial(q^2)}{\\partial q}\\cdot1 = 2q = 4$. Bracketing with $p$ acts like $\\partial/\\partial q$.' },

    // ---------- level 2 ----------
    { id: 'pbr-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} For the angular momentum $\\vec L = \\vec r\\times\\vec p$, the bracket $\\{L_x, L_y\\}$ equals`,
      options: ['$L_z$', '$-L_z$', '$0$', '$L^2$'], answer: 0,
      sol: 'With $L_x = yp_z - zp_y$ and $L_y = zp_x - xp_z$, only the pair $(z, p_z)$ contributes, so $\\{L_x, L_y\\} = \\{yp_z, zp_x\\} + \\{zp_y, xp_z\\}$. Here $\\{yp_z, zp_x\\} = y p_x\\{p_z, z\\} = -yp_x$ and $\\{zp_y, xp_z\\} = xp_y\\{z, p_z\\} = xp_y$. Sum: $xp_y - yp_x = L_z$. In general $\\{L_i, L_j\\} = \\epsilon_{ijk}L_k$, the classical twin of $[\\hat L_i, \\hat L_j] = i\\hbar\\epsilon_{ijk}\\hat L_k$.' },
    { id: 'pbr-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} The value of $\\{xy, p_x\\}$ at the point $(x, y) = (5, 3)$ is ______.`,
      answer: 3, tol: 0, calc: () => 3,
      sol: '$\\{xy, p_x\\} = \\dfrac{\\partial(xy)}{\\partial x} = y = 3$.',
      trap: 'Only the $x$ derivative enters, because $p_x$ is conjugate to $x$; the value of $x$ does not matter.' },
    { id: 'pbr-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: 'Which of these identities hold for all smooth functions $f, g, h$ on phase space?',
      options: ['$\\{f, g\\} = -\\{g, f\\}$', '$\\{fg, h\\} = f\\{g, h\\} + \\{f, h\\}g$', '$\\{f, \\{g, h\\}\\} + \\{g, \\{h, f\\}\\} + \\{h, \\{f, g\\}\\} = 0$', '$\\{f, gh\\} = \\{f, g\\}\\{f, h\\}$'], answer: [0, 1, 2],
      sol: 'Antisymmetry, the product (Leibniz) rule and the Jacobi identity all follow from the definition. The last is false: the product rule gives $\\{f, gh\\} = g\\{f, h\\} + \\{f, g\\}h$.' },
    { id: 'pbr-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'Which of these transformations of one degree of freedom is canonical?',
      options: ['$Q = p$, $P = q$', '$Q = p$, $P = -q$', '$Q = 2q$, $P = 2p$', '$Q = q^2$, $P = p$'], answer: 1,
      sol: 'Test $\\{Q, P\\}_{q,p} = 1$. A: $\\{p, q\\} = -1$. B: $\\{p, -q\\} = 1$, canonical: swapping coordinate and momentum is allowed if one sign is flipped. C: $4$. D: $2q$.',
      trap: 'A plain swap reverses the sign of the bracket; it reverses time\'s arrow in Hamilton\'s equations.' },
    { id: 'pbr-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} The value of $\\{L_z, x\\}$, with $L_z = xp_y - yp_x$, at the point $(x, y) = (1, 2)$ is ______.`,
      answer: 2, tol: 0, calc: () => 2,
      sol: '$x$ has no momentum dependence, so $\\{L_z, x\\} = -\\dfrac{\\partial L_z}{\\partial p_x}\\dfrac{\\partial x}{\\partial x} = -(-y) = y = 2$.',
      trap: 'Dropping the minus sign in front of the second term of the bracket gives $-2$.' },
    { id: 'pbr-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'equations of motion',
      q: 'For $H = \\dfrac{p^2}{2m} + V(q)$, the bracket $\\{q, H\\}$ is',
      options: ['$-V\'(q)$', '$p^2/2m$', '$p/m$', '$0$'], answer: 2,
      sol: '$\\{q, H\\} = \\partial H/\\partial p = p/m = \\dot q$, the velocity, as it must be since $\\dot q = \\{q, H\\}$. Similarly $\\{p, H\\} = -V\'(q) = \\dot p$.' },
    { id: 'pbr-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'The type-2 generating function $F_2(q, P) = qP$ (with $p = \\partial F_2/\\partial q$, $Q = \\partial F_2/\\partial P$) generates',
      options: ['the exchange $Q = p$, $P = -q$', 'a rotation of phase space by 90°', 'a scaling $Q = 2q$, $P = p/2$', 'the identity transformation'], answer: 3,
      sol: '$p = \\partial F_2/\\partial q = P$ and $Q = \\partial F_2/\\partial P = q$: nothing changes. The exchange is generated instead by the type-1 function $F_1 = qQ$.' },
    { id: 'pbr-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'equations of motion',
      q: 'For $H = \\tfrac12(p^2 + q^2)$, the rate of change $\\dfrac{d}{dt}(qp)$ at the instant when $q = 1$ and $p = 3$ is ______.',
      answer: 8, tol: 0, calc: () => 9 - 1,
      sol: '$\\dfrac{d(qp)}{dt} = \\{qp, H\\} = \\dfrac{\\partial(qp)}{\\partial q}\\dfrac{\\partial H}{\\partial p} - \\dfrac{\\partial(qp)}{\\partial p}\\dfrac{\\partial H}{\\partial q} = p\\cdot p - q\\cdot q = 9 - 1 = 8$. Averaged over a period this is zero, which is the virial theorem ($\\langle T\\rangle = \\langle V\\rangle$ for the oscillator).' },
    { id: 'pbr-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'constants of motion',
      q: 'A particle moves in a central potential, $H = \\dfrac{p^2}{2m} + V(r)$. Which quantities have zero Poisson bracket with $H$?',
      options: ['$L_z$', '$L^2$', '$p_x$', '$H$'], answer: [0, 1, 3],
      sol: '$H$ depends only on $p^2$ and $r^2$, which are unchanged by rotations, and $\\vec L$ generates rotations, so each $L_i$ (and hence $L^2$) brackets to zero with $H$. $\\{H, H\\} = 0$ always. $\\{p_x, H\\} = -\\partial V/\\partial x \\neq 0$: the force changes the momentum.' },
    { id: 'pbr-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'constants of motion',
      q: 'If $f$ and $g$ are constants of the motion (no explicit time dependence), Poisson\'s theorem says that',
      options: ['$\\{f, g\\}$ is also a constant of the motion', '$\\{f, g\\} = 0$', '$fg = H$', '$f + g$ is not conserved'], answer: 0,
      sol: 'By the Jacobi identity, $\\{\\{f, g\\}, H\\} = -\\{\\{g, H\\}, f\\} - \\{\\{H, f\\}, g\\} = 0$ when $\\{f, H\\} = \\{g, H\\} = 0$. Example: $L_x$ and $L_y$ conserved implies $L_z = \\{L_x, L_y\\}$ conserved.',
      trap: 'The new constant may be trivial (zero, or a function of the old ones); the theorem does not promise something new.' },
    { id: 'pbr-041', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} The value of $\\{q^3, p^2\\}$ at $q = 1$, $p = 2$ is ______.`,
      answer: 12, tol: 0, calc: () => 3 * 1 * 2 * 2,
      sol: '$\\{q^3, p^2\\} = 3q^2\\cdot2p - 0 = 6q^2p = 6\\times1\\times2 = 12$.' },

    // ---------- level 3 ----------
    { id: 'pbr-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} The bracket $\\{L_z, p_x\\}$ equals`,
      options: ['$-p_y$', '$p_y$', '$0$', '$p_x$'], answer: 1,
      sol: '$\\{L_z, p_x\\} = \\dfrac{\\partial L_z}{\\partial x} = p_y$ (from $L_z = xp_y - yp_x$). In general $\\{L_i, p_j\\} = \\epsilon_{ijk}p_k$: the momentum is a vector, and $L_z$ rotates it.' },
    { id: 'pbr-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'The linear transformation $Q = 2q + p$, $P = 3q + dp$ is canonical. The value of $d$ is ______.',
      answer: 2, tol: 0, calc: () => (1 + 1 * 3) / 2,
      sol: '$\\{Q, P\\} = \\dfrac{\\partial Q}{\\partial q}\\dfrac{\\partial P}{\\partial p} - \\dfrac{\\partial Q}{\\partial p}\\dfrac{\\partial P}{\\partial q} = 2d - 3 = 1$, so $d = 2$. A linear map of one degree of freedom is canonical exactly when its determinant is 1 (it preserves area).' },
    { id: 'pbr-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'The new coordinate is $Q = q\\,e^{p}$. Which choice of new momentum makes the transformation canonical?',
      options: ['$P = e^{-p}$', '$P = q\\,e^{-p}$', '$P = -e^{-p}$', '$P = p\\,e^{-p}$'], answer: 2,
      sol: 'For $P = P(p)$ only: $\\{Q, P\\} = \\dfrac{\\partial Q}{\\partial q}P\'(p) = e^pP\'(p)$. This equals 1 when $P\' = e^{-p}$, i.e. $P = -e^{-p}$ (plus a constant). Check $q e^{-p}$: $\\{Q, P\\} = e^p(-qe^{-p}) - qe^p\\cdot e^{-p} = -2q$.',
      trap: '$e^{-p}$ gives $\\{Q, P\\} = -1$; the sign matters.' },
    { id: 'pbr-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'The generating function $F_2(q, P) = \\tfrac12 q^2P$ defines a canonical transformation through $p = \\partial F_2/\\partial q$ and $Q = \\partial F_2/\\partial P$. At the phase-space point $q = 2$, $p = 6$, the new momentum $P$ is ______.',
      answer: 3, tol: 0, calc: () => 6 / 2,
      sol: '$p = qP$ gives $P = p/q = 3$, and $Q = q^2/2 = 2$. Check: $\\{Q, P\\} = q\\cdot\\dfrac1q - 0 = 1$.' },
    { id: 'pbr-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'For a type-1 generating function $F_1(q, Q, t)$, the transformation equations are',
      options: ['$p = -\\partial F_1/\\partial q$, $P = \\partial F_1/\\partial Q$', '$p = \\partial F_1/\\partial q$, $P = \\partial F_1/\\partial Q$', '$q = \\partial F_1/\\partial p$, $Q = \\partial F_1/\\partial P$', '$p = \\partial F_1/\\partial q$, $P = -\\partial F_1/\\partial Q$'], answer: 3,
      sol: 'From $p\\dot q - H = P\\dot Q - K + dF_1/dt$: matching the $\\dot q$ and $\\dot Q$ terms gives $p = \\partial F_1/\\partial q$ and $P = -\\partial F_1/\\partial Q$, with $K = H + \\partial F_1/\\partial t$. Example: $F_1 = qQ$ gives $p = Q$, $P = -q$.' },
    { id: 'pbr-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'For a time-independent transformation $(q, p) \\to (Q, P)$ of one degree of freedom, which statements correctly test or describe a canonical transformation?',
      options: ['$\\{Q, P\\}_{q,p} = 1$', 'The Jacobian $\\partial(Q, P)/\\partial(q, p)$ equals 1', 'Hamilton\'s equations keep their form in the new variables, with $K(Q, P) = H(q, p)$', 'It must leave the Hamiltonian\'s functional form unchanged, $K(Q, P) = H(Q, P)$'], answer: [0, 1, 2],
      sol: 'For one degree of freedom the Jacobian determinant is exactly $\\{Q, P\\}$, so A and B are the same test (area preservation). C is the defining property; for a time-independent transformation $K$ is simply $H$ expressed in the new variables. D is false: the whole point is that $K$ may look very different, as with $H = \\tfrac12(p^2 + q^2) \\to K = P$ in action-angle form.' },
    { id: 'pbr-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} A particle is at $(x, y, z) = (1, 2, 0)$ with momentum $(p_x, p_y, p_z) = (3, 1, 0)$. The value of $\\{L_x, L_y\\}$ there is ______.`,
      answer: -5, tol: 0, calc: () => 1 * 1 - 2 * 3,
      sol: '$\\{L_x, L_y\\} = L_z = xp_y - yp_x = 1\\times1 - 2\\times3 = -5$.' },
    { id: 'pbr-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hamilton-Jacobi',
      q: 'The Hamilton-Jacobi equation for Hamilton\'s principal function $S(q, \\alpha, t)$ is',
      options: ['$\\dfrac{\\partial S}{\\partial t} + H\\left(q, \\dfrac{\\partial S}{\\partial q}, t\\right) = 0$', '$\\dfrac{\\partial S}{\\partial t} = H\\left(q, \\dfrac{\\partial S}{\\partial q}, t\\right)$', '$\\dfrac{\\partial S}{\\partial q} + H(q, p, t) = 0$', '$\\{S, H\\} = 0$'], answer: 0,
      sol: '$S$ is a type-2 generating function chosen so that the new Hamiltonian vanishes: $K = H + \\partial S/\\partial t = 0$ with $p = \\partial S/\\partial q$. Then all new coordinates and momenta are constants.' },
    { id: 'pbr-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hamilton-Jacobi',
      q: 'For a free particle of mass 2 kg, a complete solution of the Hamilton-Jacobi equation is $S = \\alpha x - \\dfrac{\\alpha^2 t}{2m}$. Setting $\\partial S/\\partial\\alpha = \\beta$ (a constant) with $\\alpha = 6$ kg m/s gives the motion; the particle\'s speed is ______ m/s.',
      answer: 3, tol: 0, unit: 'm/s', calc: () => 6 / 2,
      sol: '$\\partial S/\\partial\\alpha = x - \\alpha t/m = \\beta$, so $x = \\beta + (\\alpha/m)t$: uniform motion at $\\alpha/m = 3$ m/s. Also $p = \\partial S/\\partial x = \\alpha$, the constant momentum.' },
    { id: 'pbr-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generators',
      q: 'An infinitesimal canonical transformation $\\delta q = \\epsilon\\,\\partial G/\\partial p$, $\\delta p = -\\epsilon\\,\\partial G/\\partial q$ rotates the system by a small angle $\\epsilon$ about the $z$ axis. Its generator $G$ is',
      options: ['$p_z$', '$L_z$', '$H$', '$xp_x + yp_y$'], answer: 1,
      sol: 'With $G = L_z = xp_y - yp_x$: $\\delta x = \\epsilon\\,\\partial L_z/\\partial p_x = -\\epsilon y$ and $\\delta y = \\epsilon x$, a rotation by $\\epsilon$. Similarly $p_z$ generates translations along $z$, $H$ generates time evolution, and $xp_x + yp_y$ generates scalings.' },
    { id: 'pbr-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: `${PB} Which of these hold for every smooth function $f(x, y, p_x, p_y)$?`,
      options: ['$\\{f, p_x\\} = \\partial f/\\partial x$', '$\\{x, f\\} = \\partial f/\\partial p_x$', '$\\{f, x\\} = \\partial f/\\partial p_x$', '$\\{p_x, p_y\\} = 0$'], answer: [0, 1, 3],
      sol: 'A: only the $\\partial f/\\partial x\\cdot\\partial p_x/\\partial p_x$ term survives. B: only $\\partial x/\\partial x\\cdot\\partial f/\\partial p_x$ survives. C: by antisymmetry $\\{f, x\\} = -\\partial f/\\partial p_x$. D: momenta have no coordinate dependence, so their bracket vanishes.' },
    { id: 'pbr-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} The value of $\\{L_z, xy\\}$ at the point $(x, y) = (2, 3)$ is ______.`,
      answer: 5, tol: 0, calc: () => 3 * 3 - 2 * 2,
      sol: 'For a function of coordinates only, $\\{L_z, f\\} = -\\dfrac{\\partial L_z}{\\partial p_x}f_x - \\dfrac{\\partial L_z}{\\partial p_y}f_y = yf_x - xf_y$. With $f = xy$: $y^2 - x^2 = 9 - 4 = 5$. (This is minus the rate of change of $xy$ under a rotation; $x^2 + y^2$ would give zero.)' },

    // ---------- level 4 ----------
    { id: 'pbr-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'The canonical transformation $q = \\sqrt{2P/(m\\omega)}\\sin Q$, $p = \\sqrt{2m\\omega P}\\cos Q$ turns the oscillator Hamiltonian $\\dfrac{p^2}{2m} + \\tfrac12 m\\omega^2q^2$ into $K = \\omega P$. An oscillator with $\\omega = 3$ rad/s has energy 6 J. Its new momentum $P$ is ______ J s.',
      answer: 2, tol: 0, unit: 'J s', calc: () => 6 / 3,
      sol: 'Substituting: $\\dfrac{p^2}{2m} = \\omega P\\cos^2Q$ and $\\tfrac12 m\\omega^2q^2 = \\omega P\\sin^2Q$, so $K = \\omega P$. With $K = E$: $P = E/\\omega = 2$ J s. Hamilton\'s equations then give $\\dot P = 0$, $\\dot Q = \\omega$: $P$ is the action ($\\oint p\\,dq/2\\pi$) and $Q$ the angle.' },
    { id: 'pbr-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'The canonical transformation $Q = q + ap^2$, $P = p$ (with $a$ a constant) is generated by which type-2 function $F_2(q, P)$, with $p = \\partial F_2/\\partial q$ and $Q = \\partial F_2/\\partial P$?',
      options: ['$qP + aP^2$', '$qP - \\tfrac13 aP^3$', '$qP + \\tfrac13 aP^3$', '$qP + aqP^2$'], answer: 2,
      sol: '$p = \\partial F_2/\\partial q = P$ forces $F_2 = qP + f(P)$. Then $Q = q + f\'(P) = q + aP^2$ needs $f = \\tfrac13 aP^3$. Check the last option: it gives $p = P + aP^2$, which is wrong.' },
    { id: 'pbr-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'angular momentum',
      q: `${PB} Which of these brackets are correct?`,
      options: ['$\\{L_x, L_y\\} = L_z$', '$\\{L_z, L^2\\} = 0$', '$\\{L_z, x^2 + y^2 + z^2\\} = 0$', '$\\{L_z, p_x\\} = -p_y$'], answer: [0, 1, 2],
      sol: 'A: the angular momentum algebra. B: $\\{L_z, L^2\\} = 2L_x\\{L_z, L_x\\} + 2L_y\\{L_z, L_y\\} = 2L_xL_y - 2L_yL_x = 0$. C: $r^2$ is unchanged by rotations, which $L_z$ generates. D: $\\{L_z, p_x\\} = \\partial L_z/\\partial x = +p_y$.' },
    { id: 'pbr-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'equations of motion',
      q: 'A free particle has $H = p^2/2m$ with $m = 2$ kg. At an instant when $p = 6$ kg m/s, the rate of change of $qp$ is ______ (SI units).',
      answer: 18, tol: 0, calc: () => 36 / 2,
      sol: '$\\dfrac{d(qp)}{dt} = \\{qp, H\\} = p\\cdot\\dfrac{p}{m} - q\\cdot0 = \\dfrac{p^2}{m} = \\dfrac{36}{2} = 18$. It equals $2T$; for a free particle there is no potential term to cancel it, so $qp$ grows steadily.' },
    { id: 'pbr-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'For a free particle, $H = p^2/2m$, the time-dependent generating function $F_2(q, P, t) = qP - \\dfrac{P^2t}{2m}$ gives new variables $Q = q - Pt/m$ and $P = p$. The new Hamiltonian $K$ is',
      options: ['$P^2/2m$', '$P^2/m$', '$-P^2/2m$', '$0$'], answer: 3,
      sol: '$K = H + \\partial F_2/\\partial t = \\dfrac{P^2}{2m} - \\dfrac{P^2}{2m} = 0$. So $Q$ and $P$ are both constant: $Q$ is the initial position and $P$ the momentum. This $F_2$ is the Hamilton-Jacobi principal function of the free particle.',
      trap: 'For a time-dependent transformation, $K$ is not just $H$ rewritten; add $\\partial F/\\partial t$.' },
    { id: 'pbr-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'equations of motion',
      q: 'A ball of mass 1 kg has $H = \\dfrac{p^2}{2m} + mgq$ ($q$ up). Using the series $q(t) = q + t\\{q, H\\} + \\dfrac{t^2}{2!}\\{\\{q, H\\}, H\\} + \\ldots$ with $q = 10$ m and $p = 2$ kg m/s at $t = 0$, the height at $t = 1$ s is ______ m ($g = 9.8$ m/s²).',
      answer: 7.1, tol: 0.01, unit: 'm', calc: () => 10 + 2 - 4.9,
      sol: '$\\{q, H\\} = p/m$, $\\{p/m, H\\} = -\\dfrac1m\\dfrac{\\partial H}{\\partial q} = -g$, and every higher bracket is zero. So $q(t) = q_0 + \\dfrac{p_0}{m}t - \\tfrac12 gt^2 = 10 + 2 - 4.9 = 7.1$ m.' },
    { id: 'pbr-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: 'Using the Jacobi identity, $\\{f, \\{g, h\\}\\} + \\{g, \\{h, f\\}\\}$ equals',
      options: ['$\\{\\{f, g\\}, h\\}$', '$\\{h, \\{f, g\\}\\}$', '$0$', '$\\{f, g\\}\\{g, h\\}$'], answer: 0,
      sol: 'Jacobi: the sum of all three cyclic terms is zero, so the two given terms equal $-\\{h, \\{f, g\\}\\} = \\{\\{f, g\\}, h\\}$ by antisymmetry. This is the identity behind Poisson\'s theorem.' },
    { id: 'pbr-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Hamilton-Jacobi',
      q: 'Which statements about the Hamilton-Jacobi method are correct?',
      options: ['$S$ generates a canonical transformation to new variables that are all constant ($K = 0$)', 'For a time-independent $H$, $S = W(q) - Et$, where $W$ is Hamilton\'s characteristic function', 'The old momenta are recovered from $p_i = \\partial S/\\partial q_i$', 'The Hamilton-Jacobi equation is linear in $S$, so solutions can be added'], answer: [0, 1, 2],
      sol: 'A, B, C are the core of the method. D is false: $H$ is usually quadratic in $p = \\partial S/\\partial q$, so the equation is non-linear (for a particle, $(\\nabla S)^2/2m + V + \\partial_t S = 0$, the eikonal-like equation behind the WKB link to quantum mechanics).' },
    { id: 'pbr-042', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'generating functions',
      q: 'For a type-3 generating function $F_3(p, Q)$ (obtained from $F_1$ by $F_3 = F_1 - qp$), the transformation equations are',
      options: ['$q = \\partial F_3/\\partial p$, $P = \\partial F_3/\\partial Q$', '$q = -\\partial F_3/\\partial p$, $P = \\partial F_3/\\partial Q$', '$q = -\\partial F_3/\\partial p$, $P = -\\partial F_3/\\partial Q$', '$p = \\partial F_3/\\partial q$, $P = -\\partial F_3/\\partial Q$'], answer: 2,
      sol: '$dF_1 = p\\,dq - P\\,dQ$. Then $dF_3 = d(F_1 - qp) = -q\\,dp - P\\,dQ$, so $q = -\\partial F_3/\\partial p$ and $P = -\\partial F_3/\\partial Q$.' },

    // ---------- level 5 ----------
    { id: 'pbr-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'The transformation $Q = q^3p$, $P = c/q^2$ (for $q > 0$) is canonical for one value of the constant $c$. That value is ______.',
      answer: 0.5, tol: 0.001, calc: () => 1 / 2,
      sol: '$\\{Q, P\\} = \\dfrac{\\partial Q}{\\partial q}\\dfrac{\\partial P}{\\partial p} - \\dfrac{\\partial Q}{\\partial p}\\dfrac{\\partial P}{\\partial q} = 3q^2p\\cdot0 - q^3\\cdot(-2cq^{-3}) = 2c$. Setting $2c = 1$: $c = 0.5$.' },
    { id: 'pbr-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'generators',
      q: `${PB} The generator $L_z$ acts with parameter $\\epsilon = 0.01$: $\\delta f = \\epsilon\\{f, L_z\\}$. For a particle at $(x, y) = (3, 4)$, the change $\\delta y$ is ______.`,
      answer: 0.03, tol: 0.0005, calc: () => 0.01 * 3,
      sol: '$\\{y, L_z\\} = \\dfrac{\\partial L_z}{\\partial p_y} = x$, so $\\delta y = \\epsilon x = 0.03$. Likewise $\\delta x = \\epsilon\\{x, L_z\\} = -\\epsilon y = -0.04$: an anticlockwise rotation by 0.01 rad, as $x\' = x\\cos\\epsilon - y\\sin\\epsilon$, $y\' = x\\sin\\epsilon + y\\cos\\epsilon$ confirm.' },
    { id: 'pbr-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'constants of motion',
      q: 'For the Kepler problem $H = \\dfrac{p^2}{2m} - \\dfrac kr$, the Laplace-Runge-Lenz vector $\\vec A = \\vec p\\times\\vec L - mk\\hat r$ is conserved. Its components satisfy $\\{A_x, A_y\\} = $',
      options: ['$0$', '$-2mH\\,L_z$', '$L_z$', '$mk\\,A_z$'], answer: 1,
      sol: 'A direct (lengthy) computation gives $\\{A_i, A_j\\} = -2mH\\,\\epsilon_{ijk}L_k$. For bound orbits ($H < 0$) the rescaled $\\vec A/\\sqrt{-2mH}$ and $\\vec L$ close into the algebra of four-dimensional rotations, SO(4). This hidden symmetry is why all bound Kepler orbits close and why hydrogen levels depend only on $n$.',
      trap: 'Zero would mean $A_x$ and $A_y$ were independent commuting constants; then the orbit could not be confined to a plane perpendicular to $\\vec L$ with a fixed perihelion direction.' },
    { id: 'pbr-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: 'Which statements about canonical transformations are correct?',
      options: ['The map that carries $(q(0), p(0))$ to $(q(t), p(t))$ along the motion is itself canonical', 'A canonical transformation preserves the Poisson bracket of every pair of functions', 'Every canonical transformation can be generated by a type-2 function $F_2(q, P)$', 'A canonical transformation preserves phase-space volume'], answer: [0, 1, 3],
      sol: 'A: time evolution is generated by $H$ (an infinite string of infinitesimal canonical transformations). B: brackets are invariant, so they can be computed in any canonical variables. D: the Jacobian of a canonical map is 1 (Liouville). C is false: the exchange $Q = p$, $P = -q$ has $P$ depending on $q$ alone, so $q$ and $P$ cannot serve as independent variables; it needs a type-1 function ($F_1 = qQ$).' },
    ...more2,
  ],
  gens: [
    { id: 'pbr-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra',
      make(r) {
        const a = int(r, 0, 3), b = int(r, 1, 3), c = int(r, 1, 3), d = int(r, 0, 2), q = int(r, 1, 3), p = int(r, -2, 2) || 1;
        const k = a * d - b * c, answer = k * q ** (a + c - 1) * p ** (b + d - 1);
        const mono = (x, y) => `${x === 0 ? '' : x === 1 ? 'q' : `q^{${x}}`}${y === 0 ? '' : y === 1 ? 'p' : `p^{${y}}`}` || '1';
        return { q: `${PB} Find $\\{${mono(a, b)}, ${mono(c, d)}\\}$ at $q = ${q}$, $p = ${p}$.`,
          answer, tol: 0, a, b, c, d, qv: q, pv: p,
          sol: `For monomials, $\\{q^ap^b, q^cp^d\\} = (ad - bc)\\,q^{a + c - 1}p^{b + d - 1}$. Here $a = ${a}$, $b = ${b}$, $c = ${c}$, $d = ${d}$: $(${a * d} - ${b * c})\\,q^{${a + c - 1}}p^{${b + d - 1}} = ${k}\\times${q}^{${a + c - 1}}\\times(${p})^{${b + d - 1}} = ${answer}$.` };
      },
      verify: (x) => (x.a * x.d - x.b * x.c) * x.qv ** (x.a + x.c - 1) * x.pv ** (x.b + x.d - 1) },
    { id: 'pbr-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      make(r) {
        const a = choose(r, [1, 2, 4, 5]), b = int(r, 1, 4), c = int(r, -3, 4);
        const answer = round((1 + b * c) / a, 4);
        return { q: `The linear transformation $Q = ${a === 1 ? '' : a}q + ${b === 1 ? '' : b}p$, $P = ${c}q + dp$ is canonical. Find $d$.`,
          answer, tol: 0.001, a, b, c,
          sol: `$\\{Q, P\\} = ${a}d - (${b})(${c}) = 1$, so $d = (1 + ${b * c})/${a} = ${answer}$. A linear map is canonical when its determinant $ad - bc$ is 1.` };
      },
      verify: (p) => (1 + p.b * p.c) / p.a },
    { id: 'pbr-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      make(r) {
        const m = int(r, 1, 3), n = int(r, 0, 2), x = int(r, 1, 3), y = int(r, -2, 3) || 1;
        const fx = m * x ** (m - 1) * y ** n, fy = n === 0 ? 0 : n * x ** m * y ** (n - 1);
        const answer = y * fx - x * fy;
        const f = `x${m === 1 ? '' : `^{${m}}`}${n === 0 ? '' : n === 1 ? 'y' : `y^{${n}}`}`;
        return { q: `${PB} With $L_z = xp_y - yp_x$, find $\\{L_z, ${f}\\}$ at $(x, y) = (${x}, ${y})$.`,
          answer, tol: 0, m, n, x, y,
          sol: `For a function of coordinates only, $\\{L_z, f\\} = y\\,\\partial_x f - x\\,\\partial_y f$. Here $\\partial_x f = ${fx}$ and $\\partial_y f = ${fy}$ at the point, so the bracket is $${y}(${fx}) - ${x}(${fy}) = ${answer}$.`,
          trap: 'Watch the sign: $\\partial L_z/\\partial p_x = -y$, and the bracket has a minus sign in front of the $\\partial/\\partial p$ term.' };
      },
      verify: (p) => p.y * p.m * p.x ** (p.m - 1) * p.y ** p.n - p.x * (p.n === 0 ? 0 : p.n * p.x ** p.m * p.y ** (p.n - 1)) },
    { id: 'pbr-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'angular momentum',
      make(r) {
        const pair = choose(r, [['x', 'y', 'z'], ['y', 'z', 'x'], ['z', 'x', 'y']]);
        const v = { x: int(r, -3, 3), y: int(r, -3, 3), z: int(r, -3, 3) }, P = { x: int(r, -3, 3), y: int(r, -3, 3), z: int(r, -3, 3) };
        const [i, j, k] = pair;
        const [a, b] = { x: ['y', 'z'], y: ['z', 'x'], z: ['x', 'y'] }[k];
        const answer = v[a] * P[b] - v[b] * P[a];
        return { q: `${PB} A particle is at $(x, y, z) = (${v.x}, ${v.y}, ${v.z})$ with momentum $(p_x, p_y, p_z) = (${P.x}, ${P.y}, ${P.z})$. Find $\\{L_${i}, L_${j}\\}$ there.`,
          answer, tol: 0, va: v[a], vb: v[b], pa: P[a], pb: P[b],
          sol: `$\\{L_${i}, L_${j}\\} = L_${k} = ${a}p_${b} - ${b}p_${a} = (${v[a]})(${P[b]}) - (${v[b]})(${P[a]}) = ${answer}$.` };
      },
      verify: (p) => p.va * p.pb - p.vb * p.pa },
    { id: 'pbr-g05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      make(r) {
        const l = int(r, 2, 5);
        const good = [`$Q = ${l}q$, $P = p/${l}$`, `$Q = q + ${l}p$, $P = p$`, `$Q = q$, $P = p + ${l}q^2$`, '$Q = p$, $P = -q$', `$Q = -p/${l}$, $P = ${l}q$`];
        const bad = [`$Q = ${l}q$, $P = ${l}p$`, '$Q = p$, $P = q$', `$Q = q$, $P = ${l}p$`, '$Q = q^2$, $P = p$', '$Q = q + p$, $P = p - q$', `$Q = ${l}q$, $P = -p/${l}$`];
        const right = choose(r, good);
        const wr = bad;
        const o = mcqOptions(r, right, [wr[int(r, 0, 1)], wr[int(r, 2, 3)], wr[int(r, 4, 5)]], (v) => v);
        return { q: 'Which of these transformations is canonical?', ...o,
          sol: `Test $\\{Q, P\\} = \\dfrac{\\partial Q}{\\partial q}\\dfrac{\\partial P}{\\partial p} - \\dfrac{\\partial Q}{\\partial p}\\dfrac{\\partial P}{\\partial q} = 1$. ${right} gives exactly 1. The others give a different value (for example $${l}q, ${l}p$ gives $${l * l}$, a plain swap gives $-1$, and $q + p, p - q$ gives 2).`,
          trap: 'Scalings must be reciprocal ($q$ up by $\\lambda$, $p$ down by $\\lambda$) to keep phase-space area.' };
      } },
    { id: 'pbr-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
      make(r) {
        const w = int(r, 1, 8), E = int(r, 1, 30);
        const answer = round(E / w, 4);
        return { q: `The canonical transformation $q = \\sqrt{2P/(m\\omega)}\\sin Q$, $p = \\sqrt{2m\\omega P}\\cos Q$ turns an oscillator Hamiltonian into $K = \\omega P$. An oscillator with $\\omega = ${w}$ rad/s has energy ${E} J. Find $P$ in J s.`,
          answer, tol: Math.max(0.001, answer * 0.005), unit: 'J s', w, E,
          sol: `$K = \\omega P$ equals the energy, so $P = E/\\omega = ${E}/${w} = ${answer}$ J s. $P$ is constant and $Q = \\omega t + Q_0$.` };
      },
      verify: (p) => p.E / p.w },
    { id: 'pbr-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'equations of motion',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), q0 = int(r, 5, 40), p0 = pick(r, -4, 6, 0.5), t = pick(r, 0.5, 2, 0.5);
        const answer = round(q0 + p0 * t / m - 0.5 * g * t * t, 3);
        return { q: `A ball of mass ${m} kg has $H = \\dfrac{p^2}{2m} + mgq$ ($q$ is height). At $t = 0$, $q = ${q0}$ m and $p = ${p0}$ kg m/s. Using the series $q(t) = \\sum_n \\dfrac{t^n}{n!}\\{q, H\\}_n$ of repeated brackets, find $q$ at $t = ${t}$ s ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, Math.abs(answer) * 0.005), unit: 'm', m, q0, p0, t,
          sol: `$\\{q, H\\} = p/m$, $\\{p/m, H\\} = -g$, higher brackets vanish. $q(t) = ${q0} + \\dfrac{${p0}}{${m}}(${t}) - \\tfrac12(9.8)(${t})^2 = ${answer}$ m.` };
      },
      verify: (p) => p.q0 + p.p0 * p.t / p.m - 0.5 * g * p.t * p.t },
    { id: 'pbr-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'canonical transformations',
      make(r) {
        const n = int(r, 2, 6);
        const answer = round(1 / (n - 1), 4);
        return { q: `The transformation $Q = q^{${n}}p$, $P = c\\,q^{${1 - n}}$ (for $q > 0$) is canonical for one value of the constant $c$. Find $c$.`,
          answer, tol: 0.001, n,
          sol: `$\\{Q, P\\} = ${n}q^{${n - 1}}p\\cdot0 - q^{${n}}\\cdot c(${1 - n})q^{${-n}} = ${n - 1}c$. Setting this to 1: $c = 1/${n - 1} = ${answer}$.` };
      },
      verify: (p) => 1 / (p.n - 1) },
    { id: 'pbr-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'generators',
      make(r) {
        const x = int(r, -5, 5), y = int(r, -5, 5) || 2, e = choose(r, [0.01, 0.02, 0.005]);
        const which = choose(r, ['x', 'y']);
        const answer = round(which === 'x' ? -e * y : e * x, 5);
        return { q: `${PB} Under the infinitesimal transformation $\\delta f = \\epsilon\\{f, L_z\\}$ with $\\epsilon = ${e}$ and $L_z = xp_y - yp_x$, find $\\delta ${which}$ for a particle at $(x, y) = (${x}, ${y})$.`,
          answer, tol: 0.0002, x, y, e, which,
          sol: `$\\{x, L_z\\} = \\partial L_z/\\partial p_x = -y$ and $\\{y, L_z\\} = \\partial L_z/\\partial p_y = x$. So $\\delta ${which} = ${which === 'x' ? `-\\epsilon y = -${e}\\times(${y})` : `\\epsilon x = ${e}\\times(${x})`} = ${answer}$: a rotation by $\\epsilon$ rad about $z$.` };
      },
      verify: (p) => (p.which === 'x' ? -p.e * p.y : p.e * p.x) },
    { id: 'pbr-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'equations of motion',
      make(r) {
        const m = int(r, 1, 3), k = int(r, 1, 9), q = int(r, -3, 3), p = int(r, -4, 4);
        const answer = round(p * p / m - k * q * q, 4);
        return { q: `For $H = \\dfrac{p^2}{${2 * m}} + \\dfrac{${k}}{2}q^2$, find $\\dfrac{d}{dt}(qp)$ at the instant when $q = ${q}$ and $p = ${p}$.`,
          answer, tol: Math.max(0.001, Math.abs(answer) * 0.002), m, k, qv: q, pv: p,
          sol: `$\\dfrac{d(qp)}{dt} = \\{qp, H\\} = p\\dfrac{\\partial H}{\\partial p} - q\\dfrac{\\partial H}{\\partial q} = \\dfrac{p^2}{${m}} - ${k}q^2 = ${round(p * p / m, 4)} - ${k * q * q} = ${answer}$. (Its time average is zero: the virial theorem.)` };
      },
      verify: (x) => x.pv * x.pv / x.m - x.k * x.qv * x.qv },
    { id: 'pbr-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generating functions',
      make(r) {
        const sets = {
          1: ['F_1(q, Q)', '$p = \\partial F/\\partial q$, $P = -\\partial F/\\partial Q$'],
          2: ['F_2(q, P)', '$p = \\partial F/\\partial q$, $Q = \\partial F/\\partial P$'],
          3: ['F_3(p, Q)', '$q = -\\partial F/\\partial p$, $P = -\\partial F/\\partial Q$'],
          4: ['F_4(p, P)', '$q = -\\partial F/\\partial p$, $Q = \\partial F/\\partial P$'],
        };
        const t = int(r, 1, 4);
        const others = [1, 2, 3, 4].filter((x) => x !== t).map((x) => sets[x][1]);
        const o = mcqOptions(r, sets[t][1], others, (v) => v);
        return { q: `For a generating function of type ${t}, $${sets[t][0]}$, the transformation equations are`, ...o,
          sol: `Start from $dF_1 = p\\,dq - P\\,dQ$ and swap variables with Legendre transforms: $F_2 = F_1 + QP$, $F_3 = F_1 - qp$, $F_4 = F_1 + QP - qp$. Each swap flips which variable is differentiated and adds a sign. For type ${t}: ${sets[t][1]}.`,
          trap: 'A quick check: $F_2 = qP$ must give the identity and $F_1 = qQ$ the exchange $Q = p$, $P = -q$.' };
      } },
    { id: 'pbr-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hamilton-Jacobi',
      make(r) {
        const m = int(r, 1, 5), al = int(r, -6, 8) || 3, be = int(r, -5, 5), t = int(r, 1, 6);
        const answer = round(be + al * t / m, 4);
        return { q: `A free particle of mass ${m} kg has the Hamilton-Jacobi solution $S = \\alpha x - \\dfrac{\\alpha^2t}{2m}$ with $\\alpha = ${al}$ kg m/s. The condition $\\partial S/\\partial\\alpha = \\beta$ holds with $\\beta = ${be}$ m. Find $x$ at $t = ${t}$ s.`,
          answer, tol: Math.max(0.001, Math.abs(answer) * 0.002), unit: 'm', m, al, be, t,
          sol: `$\\partial S/\\partial\\alpha = x - \\alpha t/m = \\beta$, so $x = \\beta + \\alpha t/m = ${be} + ${al}\\times${t}/${m} = ${answer}$ m.` };
      },
      verify: (p) => p.be + p.al * p.t / p.m },
    ...more,
  ],
};
