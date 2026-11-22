// Multipole expansion: Legendre expansion of 1/|r - r'|, monopole, dipole and quadrupole moments (the traceless
// quadrupole tensor), origin dependence, dipole fields and the delta term, energies, forces and torques in external
// fields, dipole-dipole interactions, molecular dipoles, nuclear quadrupoles, magnetic dipoles.
// Original questions (fibub) for GATE and CSIR NET. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';

const K = 8.9875517923e9, D = 3.33564e-30, E = 1.602176634e-19, PI = Math.PI;

export default {
  topic: 'multipoles',
  items: [
    // ---------- level 1 ----------
    { id: 'mpl-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'falloff',
      q: 'A charge distribution has zero total charge and zero dipole moment, but is not spherically symmetric. Far away its potential typically falls off as',
      options: ['$1/r$', '$1/r^2$', '$1/r^3$', '$e^{-r}$'], answer: 2,
      sol: 'The $l$-th term of the multipole expansion goes as $1/r^{l+1}$: monopole $1/r$, dipole $1/r^2$, quadrupole $1/r^3$. With the first two zero, the quadrupole term leads. (The field falls one power faster, as $1/r^4$.)',
      trap: 'Confusing the potential (here $1/r^3$) with the field ($1/r^4$).' },
    { id: 'mpl-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'origin dependence',
      q: 'The electric dipole moment $\\vec p = \\sum q_i\\vec r_i$ of a set of charges does not depend on the choice of origin when',
      options: ['the total charge is zero', 'the charges all have the same sign', 'the quadrupole moment is zero', 'the charges lie in a plane'], answer: 0,
      sol: 'Shift the origin by $\\vec a$: $\\vec r_i \\to \\vec r_i - \\vec a$, so $\\vec p \\to \\vec p - Q\\vec a$ with $Q = \\sum q_i$. The moment is unchanged for every shift only if $Q = 0$.' },
    { id: 'mpl-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'dipole moment',
      q: 'Charges $+1.0$ nC at $(1, 0, 0)$ cm, $+1.0$ nC at $(0, 1, 0)$ cm and $-2.0$ nC at the origin. The magnitude of the dipole moment is ______ $\\times10^{-11}$ C m (to two decimal places).',
      answer: 1.41, tol: 0.01, calc: () => Math.SQRT2,
      sol: '$\\vec p = \\sum q_i\\vec r_i = (10^{-9})(0.01\\hat x) + (10^{-9})(0.01\\hat y) + 0 = 10^{-11}(\\hat x + \\hat y)$ C m, of magnitude $\\sqrt2\\times10^{-11} = 1.41\\times10^{-11}$ C m. The net charge is zero, so this is the same about any origin.' },
    { id: 'mpl-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'The quadrupole tensor $Q_{ij} = \\sum_n q_n(3x_{n,i}x_{n,j} - r_n^2\\delta_{ij})$ has trace $Q_{xx} + Q_{yy} + Q_{zz}$ equal to',
      options: ['$\\sum_nq_nr_n^2$', '$3\\sum_nq_nr_n^2$', '$2\\sum_nq_nr_n^2$', '$0$'], answer: 3,
      sol: 'Trace $= \\sum_nq_n(3r_n^2 - 3r_n^2) = 0$. The $-r^2\\delta_{ij}$ part is there exactly to make the tensor traceless: the trace would only add a term proportional to $\\nabla^2(1/r) = 0$ outside the source.' },
    { id: 'mpl-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'dipole field',
      q: 'At equal distances from a point dipole, the field strength on its axis compared with that on its perpendicular bisector (equatorial plane) is',
      options: ['the same', 'twice as large', 'half as large', 'four times as large'], answer: 1,
      sol: '$E_r = \\dfrac{2p\\cos\\theta}{4\\pi\\epsilon_0r^3}$, $E_\\theta = \\dfrac{p\\sin\\theta}{4\\pi\\epsilon_0r^3}$. Axis ($\\theta = 0$): $2kp/r^3$ along $\\vec p$. Equator ($\\theta = 90^\\circ$): $kp/r^3$ opposite to $\\vec p$. Ratio 2.' },
    { id: 'mpl-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'molecular dipoles',
      q: 'A molecule has a dipole moment of 1.85 debye. In SI units this is ______ $\\times10^{-30}$ C m (to two decimal places). (1 D $= 3.336\\times10^{-30}$ C m.)',
      answer: 6.17, tol: 0.02, calc: () => 1.85 * 3.33564,
      sol: '$1.85\\times3.336\\times10^{-30} = 6.17\\times10^{-30}$ C m. One debye is roughly the moment of charges $\\pm e$ separated by 0.21 Å, which is why molecular moments are a few debye.' },

    // ---------- level 2 ----------
    { id: 'mpl-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'quadrupole potential',
      q: 'Charges $+1.0$ nC, $-2.0$ nC and $+1.0$ nC sit on the $z$ axis at $z = -1.0$ cm, $0$ and $+1.0$ cm. Using the leading term of the multipole expansion, the potential on the $z$ axis at $z = 10$ cm is ______ V (to two decimal places).',
      answer: 1.80, tol: 0.02, calc: () => 2 * K * 1e-9 * 1e-4 / 1e-3,
      sol: 'Total charge 0; dipole moment $q(-a) + q(a) = 0$. Quadrupole: $Q_{zz} = \\sum q(3z^2 - z^2) = 2\\times q\\times2a^2 = 4qa^2$. On the axis $V = \\dfrac{1}{4\\pi\\epsilon_0}\\dfrac{Q_{zz}}{2z^3} = \\dfrac{2kqa^2}{z^3} = \\dfrac{2\\times8.99\\times10^9\\times10^{-9}\\times10^{-4}}{10^{-3}} = 1.80$ V. (Exact sum: 1.82 V; the error is of order $(a/z)^2$.)',
      trap: 'Forgetting the $\\tfrac12$ in $V = \\tfrac{1}{2}\\sum Q_{ij}\\hat r_i\\hat r_j/4\\pi\\epsilon_0r^3$ doubles the answer.' },
    { id: 'mpl-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre expansion',
      q: 'For $r > r\'$, with $\\gamma$ the angle between $\\vec r$ and $\\vec r\\,\'$, the expansion $\\dfrac{1}{|\\vec r - \\vec r\\,\'|} = \\sum_l T_l$ has terms',
      options: ['$T_l = \\dfrac{r^l}{r\'^{\\,l+1}}P_l(\\cos\\gamma)$', '$T_l = \\dfrac{r\'^{\\,l}}{r^{l}}P_l(\\cos\\gamma)$', '$T_l = \\dfrac{r\'^{\\,l}}{r^{l+1}}P_l(\\cos\\gamma)$', '$T_l = \\dfrac{r\'^{\\,l}}{r^{l+1}}\\cos^l\\gamma$'], answer: 2,
      sol: '$\\dfrac1{|\\vec r - \\vec r\\,\'|} = \\dfrac1r\\left(1 - 2t\\cos\\gamma + t^2\\right)^{-1/2}$ with $t = r\'/r < 1$, and the generating function of the Legendre polynomials is $(1 - 2tx + t^2)^{-1/2} = \\sum t^lP_l(x)$. So $T_l = r\'^{\\,l}P_l(\\cos\\gamma)/r^{l+1}$: the smaller distance on top.',
      trap: 'Using $\\cos^l\\gamma$ instead of $P_l(\\cos\\gamma)$ is wrong from $l = 2$ on.' },
    { id: 'mpl-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'dipole field',
      q: 'For a point dipole $\\vec p = p\\hat z$ at the origin, which statements are correct (with $k = 1/4\\pi\\epsilon_0$)?',
      options: ['$E_r = 2kp\\cos\\theta/r^3$', '$E_\\theta = kp\\sin\\theta/r^3$', 'The field lines obey $r = C\\sin^2\\theta$.', 'The field vanishes at some finite point with $r > 0$.'], answer: [0, 1, 2],
      sol: 'From $V = kp\\cos\\theta/r^2$: $E_r = -\\partial_rV = 2kp\\cos\\theta/r^3$ and $E_\\theta = -\\tfrac1r\\partial_\\theta V = kp\\sin\\theta/r^3$. Field lines: $dr/(r\\,d\\theta) = E_r/E_\\theta = 2\\cot\\theta$ gives $\\ln r = 2\\ln\\sin\\theta + $ const. $|E| = \\dfrac{kp}{r^3}\\sqrt{3\\cos^2\\theta + 1} \\ge kp/r^3 > 0$: never zero.' },
    { id: 'mpl-010', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'molecular dipoles',
      q: 'In a bent molecule each of the two equivalent bonds carries a dipole moment of 1.50 D, and the angle between the bonds is $104.5^\\circ$. The molecular dipole moment is ______ D (to two decimal places).',
      answer: 1.84, tol: 0.01, calc: () => 2 * 1.5 * Math.cos(52.25 * PI / 180),
      sol: 'The components across the symmetry axis cancel; along it each bond gives $p_b\\cos(\\theta/2)$. Total $= 2\\times1.50\\times\\cos52.25^\\circ = 3.00\\times0.612 = 1.84$ D.',
      trap: 'Using $\\cos104.5^\\circ$ or forgetting the factor 2 are the usual slips.' },
    { id: 'mpl-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'origin dependence',
      q: 'A distribution has total charge $Q$ and dipole moment $\\vec p$ about the origin $O$. About a new origin $O\'$ at position $\\vec a$ (measured from $O$), the dipole moment is',
      options: ['$\\vec p + Q\\vec a$', '$\\vec p$', '$\\vec p - \\vec a$', '$\\vec p - Q\\vec a$'], answer: 3,
      sol: 'Positions measured from $O\'$ are $\\vec r_i - \\vec a$, so $\\vec p\\,\' = \\sum q_i(\\vec r_i - \\vec a) = \\vec p - Q\\vec a$. Choosing $\\vec a = \\vec p/Q$ (the centre of charge) makes the dipole moment vanish whenever $Q \\ne 0$.' },
    { id: 'mpl-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dipole field',
      q: 'Around a point dipole $p\\hat z$, the field is perpendicular to the dipole axis ($E_z = 0$) on a cone of half-angle $\\theta$ (measured from the $+z$ axis, $\\theta < 90^\\circ$). $\\theta$ is ______ degrees (to one decimal place).',
      answer: 54.7, tol: 0.1, calc: () => Math.acos(1 / Math.sqrt(3)) * 180 / PI,
      sol: '$\\vec E = \\dfrac{k}{r^3}[3(\\vec p\\cdot\\hat r)\\hat r - \\vec p]$, so $E_z = \\dfrac{kp}{r^3}(3\\cos^2\\theta - 1)$. It vanishes where $P_2(\\cos\\theta) = 0$: $\\cos\\theta = 1/\\sqrt3$, $\\theta = 54.7^\\circ$ (the "magic angle" of NMR).' },
    { id: 'mpl-013', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'dipole in a field',
      q: 'The work needed to turn a dipole $p$ in a uniform field $E$ from alignment with the field to the opposite direction is',
      options: ['$pE$', '$0$', '$2pE$', '$pE/2$'], answer: 2,
      sol: '$U = -\\vec p\\cdot\\vec E$: $-pE$ when aligned and $+pE$ when reversed. Work $= \\Delta U = 2pE$. (The torque $pE\\sin\\theta$ integrated from 0 to $\\pi$ gives the same.)' },
    { id: 'mpl-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'Four charges sit at the corners of a square in the $xy$ plane: $+q$ at $(a, a)$ and $(-a, -a)$, $-q$ at $(a, -a)$ and $(-a, a)$. The non-zero components of $Q_{ij} = \\sum q(3x_ix_j - r^2\\delta_{ij})$ are',
      options: ['$Q_{xx} = Q_{yy} = 6qa^2$, $Q_{zz} = -12qa^2$', '$Q_{xy} = Q_{yx} = 12qa^2$ only', '$Q_{xy} = Q_{yx} = 3qa^2$ only', '$Q_{zz} = 4qa^2$ only'], answer: 1,
      sol: 'Diagonal: each charge has $3x^2 - r^2 = 3a^2 - 2a^2 = a^2$, and $\\sum q = 0$, so $Q_{xx} = 0$; likewise $Q_{yy} = 0$ and $Q_{zz} = \\sum q(-2a^2) = 0$. Off-diagonal: $Q_{xy} = 3\\sum qxy = 3[q a^2 + q a^2 + (-q)(-a^2) + (-q)(-a^2)] = 12qa^2$. $Q_{xz} = Q_{yz} = 0$ since $z = 0$.' },
    { id: 'mpl-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magnetic multipoles',
      q: 'The multipole expansion of the vector potential of a closed current loop has no monopole ($1/r$) term because',
      options: ['the current is steady', 'the loop is small', 'magnetic charges are too weak to measure', '$\\oint d\\vec l\\,\' = 0$ around any closed loop'], answer: 3,
      sol: '$\\vec A = \\dfrac{\\mu_0I}{4\\pi}\\sum_l\\dfrac{1}{r^{l+1}}\\oint r\'^{\\,l}P_l(\\cos\\gamma)\\,d\\vec l\\,\'$. The $l = 0$ term is $\\dfrac{\\mu_0I}{4\\pi r}\\oint d\\vec l\\,\'$, and the vector sum of the elements of a closed loop is zero. The leading term is the magnetic dipole, $\\vec A = \\dfrac{\\mu_0}{4\\pi}\\dfrac{\\vec m\\times\\hat r}{r^2}$.' },
    { id: 'mpl-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dipole-dipole',
      q: 'Two molecules, each with dipole moment 1.0 D, are lined up head to tail along a common axis, 0.50 nm apart. The magnitude of their interaction energy is ______ meV (to one decimal place).',
      answer: 10.0, tol: 0.1, calc: () => 2 * K * D * D / (0.5e-9) ** 3 / E * 1e3,
      sol: '$U = \\dfrac{\\vec p_1\\cdot\\vec p_2 - 3(\\vec p_1\\cdot\\hat r)(\\vec p_2\\cdot\\hat r)}{4\\pi\\epsilon_0r^3} = -\\dfrac{2p^2}{4\\pi\\epsilon_0r^3}$ for coaxial, parallel dipoles. $kp^2 = 8.99\\times10^9\\times(3.336\\times10^{-30})^2 = 1.00\\times10^{-49}$ J m$^3$; divide by $r^3 = 1.25\\times10^{-28}$ m$^3$ and double: $1.60\\times10^{-21}$ J $= 10.0$ meV, less than $k_BT \\approx 26$ meV at room temperature.' },

    // ---------- level 3 ----------
    { id: 'mpl-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'A charge of 1.0 nC is spread uniformly through a prolate spheroid with semi-axes $a = b = 1.0$ cm and $c = 2.0$ cm (along $z$). Its quadrupole moment $Q_{zz} = \\int\\rho(3z^2 - r^2)\\,dV$ is ______ $\\times10^{-13}$ C m$^2$ (to two decimal places).',
      answer: 1.2, tol: 0.01, calc: () => 0.4 * 1e-9 * (4e-4 - 1e-4) / 1e-13,
      sol: 'For a uniform ellipsoid $\\langle x^2\\rangle = a^2/5$, $\\langle y^2\\rangle = b^2/5$, $\\langle z^2\\rangle = c^2/5$. So $Q_{zz} = Q\\left(\\dfrac{3c^2}{5} - \\dfrac{a^2 + b^2 + c^2}{5}\\right) = \\dfrac{2Q}{5}(c^2 - a^2) = 0.4\\times10^{-9}\\times3\\times10^{-4} = 1.2\\times10^{-13}$ C m$^2$. Positive: prolate (cigar).' },
    { id: 'mpl-018', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'nuclear quadrupoles',
      q: 'The quadrupole moment of a nucleus is defined about its centre of charge by $eQ = \\int\\rho(3z^2 - r^2)\\,dV$ in the state of maximum $m$. Which statements are correct?',
      options: ['A prolate (cigar-shaped) nucleus has $Q > 0$.', 'An oblate (disc-shaped) nucleus has $Q < 0$.', 'A nucleus of spin 0 or 1/2 shows no spectroscopic quadrupole moment.', 'Because the nucleus is charged, its quadrupole moment is the same about any origin.'], answer: [0, 1, 2],
      sol: 'Extra charge along $z$ makes $3z^2 - r^2$ positive on average: prolate $Q > 0$, oblate $Q < 0$. A rank-2 tensor needs at least spin 1 to have a non-zero expectation value (Wigner-Eckart), so $I = 0, \\tfrac12$ give zero. Since the nucleus has net charge, its dipole and quadrupole moments do depend on origin; that is why they are taken about the centre of charge.' },
    { id: 'mpl-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole potential',
      q: 'The square quadrupole has $+1.0$ nC at $(a, a)$ and $(-a, -a)$, $-1.0$ nC at $(a, -a)$ and $(-a, a)$, with $a = 1.0$ cm. Using the quadrupole term, the potential at a point in the $xy$ plane on the line $y = x$, 20 cm from the origin, is ______ V (to two decimal places).',
      answer: 0.67, tol: 0.01, calc: () => 6 * K * 1e-9 * 1e-4 / 0.008,
      sol: 'Only $Q_{xy} = Q_{yx} = 12qa^2$ is non-zero, so $V = \\dfrac{k}{2r^5}\\sum Q_{ij}x_ix_j = \\dfrac{k}{2r^5}\\cdot2\\cdot12qa^2xy$. On $y = x$, $xy = r^2/2$: $V = \\dfrac{6kqa^2}{r^3} = \\dfrac{6\\times8.99\\times10^9\\times10^{-9}\\times10^{-4}}{0.008} = 0.674$ V. (A direct sum over the four charges gives 0.675 V.)' },
    { id: 'mpl-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipole in a field',
      q: 'A small dipole $p$ sits on the line through a point charge $Q > 0$, at distance $r$, with $\\vec p$ pointing directly away from $Q$. The force on the dipole is',
      options: ['$\\dfrac{2Qp}{4\\pi\\epsilon_0r^3}$, towards $Q$', '$\\dfrac{2Qp}{4\\pi\\epsilon_0r^3}$, away from $Q$', '$\\dfrac{Qp}{4\\pi\\epsilon_0r^3}$, towards $Q$', 'zero, since the dipole is neutral'], answer: 0,
      sol: '$\\vec F = (\\vec p\\cdot\\nabla)\\vec E$. With $E_r = kQ/r^2$ and $\\vec p = p\\hat r$: $F_r = p\\,\\partial_rE_r = -2kQp/r^3$, i.e. towards $Q$. Physically the negative end is nearer to $Q$ and is pulled harder than the positive end is pushed.',
      trap: 'A neutral object feels a force in a non-uniform field.' },
    { id: 'mpl-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'average fields',
      q: 'Consider the average electric field over the volume of a sphere of radius $R$. Which statements are correct?',
      options: ['For charges entirely outside the sphere, it equals the field they produce at the centre.', 'For charges entirely inside, it equals $-\\dfrac{\\vec p}{4\\pi\\epsilon_0R^3}$, where $\\vec p$ is their dipole moment about the centre.', 'For a point dipole inside, the average is zero because the dipole field averages out over angles.', 'The field of an ideal point dipole contains a term $-\\dfrac{\\vec p}{3\\epsilon_0}\\delta^3(\\vec r)$.'], answer: [0, 1, 3],
      sol: 'Outside charges: $V$ is harmonic in the sphere, so by the mean value theorem the average field is the field at the centre. Inside charges: the average equals $-\\vec p/4\\pi\\epsilon_0R^3$ wherever they sit inside. The angular average of $3(\\vec p\\cdot\\hat r)\\hat r - \\vec p$ is zero, so all of that average comes from the contact term $-\\vec p\\,\\delta^3/3\\epsilon_0$: integrating it over the ball gives $-\\vec p/3\\epsilon_0$, divided by $\\tfrac43\\pi R^3$ gives the result.',
      trap: 'Dropping the delta term makes the average zero, which is wrong; it matters for hyperfine splitting and for the field inside matter.' },
    { id: 'mpl-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipole moment',
      q: 'A ring of radius 10 cm in the $xy$ plane carries line charge $\\lambda = \\lambda_0\\cos\\phi$ with $\\lambda_0 = 1.0$ nC/m. The magnitude of its dipole moment is ______ $\\times10^{-11}$ C m (to two decimal places).',
      answer: 3.14, tol: 0.01, calc: () => PI * 1e-9 * 0.01 / 1e-11,
      sol: '$\\vec p = \\displaystyle\\int\\lambda\\,\\vec r\\,dl = \\int_0^{2\\pi}\\lambda_0\\cos\\phi\\,R(\\cos\\phi, \\sin\\phi)\\,R\\,d\\phi = \\pi\\lambda_0R^2\\,\\hat x$. Numbers: $\\pi\\times10^{-9}\\times0.01 = 3.14\\times10^{-11}$ C m. The total charge is zero, so the result does not depend on origin.' },
    { id: 'mpl-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipole moment',
      q: 'A thin hemispherical shell of radius $R$ (the half with $z > 0$) carries uniform surface charge $\\sigma_0$. Its dipole moment about the centre of the sphere is $\\kappa\\,\\sigma_0R^3\\,\\hat z$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 3.14, tol: 0.01, calc: () => PI,
      sol: '$p_z = \\displaystyle\\int\\sigma_0(R\\cos\\theta)R^2\\,d\\Omega = \\sigma_0R^3\\cdot2\\pi\\int_0^{\\pi/2}\\cos\\theta\\sin\\theta\\,d\\theta = \\sigma_0R^3\\cdot2\\pi\\cdot\\tfrac12 = \\pi\\sigma_0R^3$. The $x$ and $y$ parts cancel by symmetry. Because the net charge $2\\pi R^2\\sigma_0$ is not zero, this value belongs to the centre as origin.',
      trap: 'Forgetting the $\\sin\\theta$ in $d\\Omega$ gives $2\\sigma_0R^3$.' },
    { id: 'mpl-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'energy in a field',
      q: 'A small charge distribution with quadrupole tensor $Q_{ij} = \\sum q(3x_ix_j - r^2\\delta_{ij})$ sits in an external field. Besides the $qV$ and $-\\vec p\\cdot\\vec E$ terms, its energy contains',
      options: ['$-\\dfrac12\\sum_{ij}Q_{ij}\\dfrac{\\partial E_j}{\\partial x_i}$', '$-\\dfrac13\\sum_{ij}Q_{ij}\\dfrac{\\partial E_j}{\\partial x_i}$', '$-\\dfrac16\\sum_{ij}Q_{ij}\\dfrac{\\partial E_j}{\\partial x_i}$', '$+\\dfrac16\\sum_{ij}Q_{ij}\\dfrac{\\partial E_j}{\\partial x_i}$'], answer: 2,
      sol: 'Taylor-expand $V$: $W = \\sum q[V_0 + x_i\\partial_iV + \\tfrac12x_ix_j\\partial_i\\partial_jV]$. The last term is $-\\tfrac12\\sum q\\,x_ix_j\\partial_iE_j$. Since $\\nabla\\cdot\\vec E = 0$ for external sources, we may replace $x_ix_j$ by $x_ix_j - \\tfrac13r^2\\delta_{ij} = \\tfrac13(3x_ix_j - r^2\\delta_{ij})$, giving $-\\tfrac16\\sum Q_{ij}\\partial_iE_j$.',
      trap: 'The factor $\\tfrac16$ comes from $\\tfrac12$ (Taylor) times $\\tfrac13$ (the definition of $Q_{ij}$).' },
    { id: 'mpl-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'How many independent components does the electric quadrupole tensor $Q_{ij}$ have in general?',
      options: ['9', '6', '3', '5'], answer: 3,
      sol: 'A $3\\times3$ tensor has 9 components; symmetry ($Q_{ij} = Q_{ji}$) leaves 6; tracelessness removes one more: 5. This matches the $2l + 1 = 5$ spherical components $q_{2m}$, $m = -2, \\dots, 2$.' },
    { id: 'mpl-026', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'molecular dipoles',
      q: 'A diatomic molecule has a dipole moment of 1.08 D and a bond length of 127 pm. If it were fully ionic ($\\pm e$ at the nuclei), its moment would be $e\\times$(bond length). The percentage ionic character, $p_{\\rm actual}/p_{\\rm ionic}\\times100$, is ______ % (to one decimal place).',
      answer: 17.7, tol: 0.2, calc: () => 1.08 * D / (E * 1.27e-10) * 100,
      sol: '$p_{\\rm ionic} = 1.602\\times10^{-19}\\times1.27\\times10^{-10} = 2.035\\times10^{-29}$ C m $= 6.10$ D. $p_{\\rm actual} = 1.08\\times3.336\\times10^{-30} = 3.60\\times10^{-30}$ C m. Ratio $= 0.177$: about 17.7% ionic.' },
    { id: 'mpl-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole potential',
      q: 'Far from the linear quadrupole ($+q$, $-2q$, $+q$ on the $z$ axis at $-a$, $0$, $+a$), the potential at polar angle $\\theta$ is proportional to',
      options: ['$\\cos\\theta/r^2$', '$(3\\cos^2\\theta - 1)/r^3$', '$\\sin^2\\theta/r^3$', '$\\cos^2\\theta/r^3$'], answer: 1,
      sol: 'With axial symmetry, $V = \\dfrac{kQ_{zz}}{2r^3}P_2(\\cos\\theta) = \\dfrac{kqa^2}{r^3}(3\\cos^2\\theta - 1)$, using $Q_{zz} = 4qa^2$. It is positive along the axis (the $+q$ ends are nearer) and negative in the equatorial plane, where it is $-kqa^2/r^3$.' },
    { id: 'mpl-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipole-dipole',
      q: 'Two equal point dipoles are held a fixed distance apart, free to rotate. Which arrangement has the lowest interaction energy?',
      options: ['Side by side, antiparallel', 'Side by side, parallel', 'Perpendicular to each other', 'Head to tail along the line joining them'], answer: 3,
      sol: '$U = k[\\vec p_1\\cdot\\vec p_2 - 3(\\vec p_1\\cdot\\hat r)(\\vec p_2\\cdot\\hat r)]/r^3$. Head to tail: $k(p^2 - 3p^2)/r^3 = -2kp^2/r^3$. Side by side antiparallel: $-kp^2/r^3$. Side by side parallel: $+kp^2/r^3$. Perpendicular (one along $\\hat r$): 0. Lowest: head to tail, which is why polar molecules form chains.',
      trap: 'Antiparallel side by side is stable but only half as strongly bound as head to tail.' },
    { id: 'mpl-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'A single point charge $q$ sits at $(0, 0, d)$. About the origin, its quadrupole component $Q_{zz} = q(3z^2 - r^2)$ is',
      options: ['$qd^2$', '$2qd^2$', '$3qd^2$', '$0$, since a point charge has no quadrupole moment'], answer: 1,
      sol: '$Q_{zz} = q(3d^2 - d^2) = 2qd^2$, and $Q_{xx} = Q_{yy} = -qd^2$. A displaced point charge has every multipole about the origin: it is the expansion of $q/|\\vec r - d\\hat z|$, with $l$-th term $qd^lP_l(\\cos\\theta)/r^{l+1}$.',
      trap: 'Only about its own position does a point charge have no higher moments.' },

    // ---------- level 4 ----------
    { id: 'mpl-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole potential',
      q: 'Charges $+1.0$ nC at $(\\pm1.0, 0, 0)$ cm and $-2.0$ nC at the origin. Using the quadrupole term, the potential on the $z$ axis at $z = 10$ cm is ______ V (to three decimal places, with sign).',
      answer: -0.899, tol: 0.003, calc: () => -K * 1e-9 * 1e-4 / 1e-3,
      sol: 'This is a linear quadrupole along $x$: $Q_{xx} = 4qa^2$, $Q_{yy} = Q_{zz} = -2qa^2$. On the $z$ axis $V = \\dfrac{kQ_{zz}}{2z^3} = -\\dfrac{kqa^2}{z^3} = -\\dfrac{8.99\\times10^9\\times10^{-9}\\times10^{-4}}{10^{-3}} = -0.899$ V. (Check: $\\dfrac{2kq}{\\sqrt{z^2 + a^2}} - \\dfrac{2kq}{z} \\approx -\\dfrac{kqa^2}{z^3}$.)',
      trap: 'Viewed from the side, a linear quadrupole looks negative: its central charge is nearer.' },
    { id: 'mpl-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'origin dependence',
      q: 'Which statement about the origin dependence of multipole moments is correct?',
      options: ['The quadrupole moment is independent of origin whenever the total charge is zero.', 'The dipole moment is independent of origin only for spherically symmetric distributions.', 'All moments change when the origin moves, so only the full potential has meaning.', 'The lowest non-vanishing multipole moment is always independent of origin.'], answer: 3,
      sol: 'Shifting the origin mixes each moment with the lower ones only (e.g. $\\vec p\\,\' = \\vec p - Q\\vec a$, and $Q_{ij}\'$ picks up terms in $\\vec p$ and $Q$). So if all lower moments vanish, the first non-zero one is unchanged. The quadrupole needs both $Q = 0$ and $\\vec p = 0$.' },
    { id: 'mpl-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'energy in a field',
      q: 'A linear quadrupole ($+q$, $-2q$, $+q$ at $z = -a, 0, +a$) with $q = 1.0$ nC and $a = 1.0$ mm sits where the external field has $\\partial E_z/\\partial z = 1.0\\times10^8$ V/m$^2$ and $\\partial E_x/\\partial x = \\partial E_y/\\partial y = -0.5\\times10^8$ V/m$^2$ (axially symmetric). Its energy is ______ $\\mu$J (to two decimal places, with sign).',
      answer: -0.1, tol: 0.005, calc: () => -1e-9 * 1e-6 * 1e8 * 1e6,
      sol: '$Q_{zz} = 4qa^2$, $Q_{xx} = Q_{yy} = -2qa^2$. $W = -\\tfrac16\\sum Q_{ii}\\partial_iE_i = -\\tfrac16[4qa^2G + 2(-2qa^2)(-G/2)] = -qa^2G$. Check directly: the potential $-\\tfrac12Gz^2 + \\dots$ gives $W = 2q(-\\tfrac12Ga^2) = -qa^2G$. Numbers: $-10^{-9}\\times10^{-6}\\times10^8 = -10^{-7}$ J $= -0.10$ $\\mu$J.' },
    { id: 'mpl-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'origin dependence',
      q: 'Which statements about multipole moments are correct?',
      options: ['The total charge never depends on the origin.', 'The dipole moment is origin-independent if and only if the total charge is zero.', 'The quadrupole moment is origin-independent if and only if the total charge and the dipole moment are both zero.', 'Placing the origin at the centre of charge removes the quadrupole moment.'], answer: [0, 1, 2],
      sol: 'Under $\\vec r \\to \\vec r - \\vec a$: $Q$ unchanged; $\\vec p\\,\' = \\vec p - Q\\vec a$; $Q_{ij}\' = Q_{ij} - 3(p_ia_j + p_ja_i) + 2(\\vec p\\cdot\\vec a)\\delta_{ij} + Q(3a_ia_j - a^2\\delta_{ij})$. The centre of charge removes only the dipole moment, not the quadrupole.' },
    { id: 'mpl-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole field',
      q: 'For the linear quadrupole $+2.0$ nC, $-4.0$ nC, $+2.0$ nC at $z = -1.0$ cm, 0, $+1.0$ cm, the leading-order field strength on the axis at $z = 10$ cm is ______ V/m (to the nearest whole number).',
      answer: 108, tol: 1.5, calc: () => 6 * K * 2e-9 * 1e-4 / 1e-4,
      sol: 'On the axis $V = 2kqa^2/z^3$, so $E_z = -dV/dz = 6kqa^2/z^4 = \\dfrac{6\\times8.99\\times10^9\\times2\\times10^{-9}\\times10^{-4}}{10^{-4}} = 108$ V/m, pointing away from the quadrupole.',
      trap: 'Differentiate the $1/z^3$ potential: the field goes as $1/z^4$ with a factor 3.' },
    { id: 'mpl-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'nuclear quadrupoles',
      q: 'A uniformly charged spheroid with semi-axes $a = b$ (in the $xy$ plane) and $c$ (along $z$) has $Q_{zz} = \\int\\rho(3z^2 - r^2)\\,dV$ equal to',
      options: ['$\\tfrac25Q(c^2 - a^2)$, negative for an oblate spheroid', '$\\tfrac25Q(a^2 - c^2)$, negative for a prolate spheroid', '$\\tfrac15Q(c^2 - a^2)$, positive for an oblate spheroid', '$\\tfrac35Q(c^2 - a^2)$, zero for a sphere'], answer: 0,
      sol: 'With $\\langle x^2\\rangle = \\langle y^2\\rangle = a^2/5$, $\\langle z^2\\rangle = c^2/5$: $Q_{zz} = Q(3c^2 - 2a^2 - c^2)/5 = \\tfrac25Q(c^2 - a^2)$. Oblate ($c < a$): negative. Prolate: positive. Sphere: zero.' },
    { id: 'mpl-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipole-dipole',
      q: 'Dipole $\\vec p_1 = p\\hat z$ is at the origin and dipole $\\vec p_2 = p\\hat x$ is at $\\vec r = \\tfrac{r}{\\sqrt2}(\\hat x + \\hat z)$. Their interaction energy is $\\kappa\\,p^2/(4\\pi\\epsilon_0r^3)$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: -1.5, tol: 0.01, calc: () => 0 - 3 * (1 / Math.SQRT2) * (1 / Math.SQRT2),
      sol: '$\\vec p_1\\cdot\\vec p_2 = 0$; $\\vec p_1\\cdot\\hat r = p/\\sqrt2$; $\\vec p_2\\cdot\\hat r = p/\\sqrt2$. $U = \\dfrac{k}{r^3}[0 - 3\\cdot\\tfrac{p^2}{2}] = -1.5\\,\\dfrac{kp^2}{r^3}$.',
      trap: 'Perpendicular dipoles need not have zero energy: what matters is how each lines up with $\\hat r$.' },
    { id: 'mpl-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'magnetic multipoles',
      q: 'The vector potential far from a small current loop of magnetic moment $\\vec m$ is',
      options: ['$\\dfrac{\\mu_0}{4\\pi}\\dfrac{\\vec m\\times\\hat r}{r^2}$', '$\\dfrac{\\mu_0}{4\\pi}\\dfrac{\\vec m\\cdot\\hat r}{r^2}$', '$\\dfrac{\\mu_0}{4\\pi}\\dfrac{\\vec m\\times\\hat r}{r^3}$', '$\\dfrac{\\mu_0}{4\\pi}\\dfrac{\\hat r\\times\\vec m}{r}$'], answer: 0,
      sol: 'The $l = 1$ term of the expansion is $\\dfrac{\\mu_0I}{4\\pi r^2}\\oint(\\hat r\\cdot\\vec r\\,\')\\,d\\vec l\\,\' = \\dfrac{\\mu_0}{4\\pi r^2}\\vec m\\times\\hat r$ with $\\vec m = I\\vec a$. Its curl gives $\\vec B = \\dfrac{\\mu_0}{4\\pi r^3}[3(\\vec m\\cdot\\hat r)\\hat r - \\vec m]$, the same shape as the electric dipole field. A vector potential must be a vector, which rules out the dot product.' },
    { id: 'mpl-038', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole potential',
      q: 'A thin rod of length $2L$ centred on the origin along the $z$ axis carries total charge $Q$ spread uniformly. On the axis at $z = 3L$, the ratio of the quadrupole term to the monopole term of the potential is ______ (to three decimal places).',
      answer: 0.037, tol: 0.001, calc: () => 1 / 27,
      sol: '$Q_{zz} = \\displaystyle\\int_{-L}^{L}\\lambda(3z^2 - z^2)\\,dz = \\dfrac{4\\lambda L^3}{3} = \\dfrac{2QL^2}{3}$ (with $\\lambda = Q/2L$); the dipole term vanishes by symmetry. On the axis: quadrupole $\\dfrac{kQ_{zz}}{2z^3} = \\dfrac{kQL^2}{3z^3}$, monopole $kQ/z$. Ratio $= \\dfrac{L^2}{3z^2} = \\dfrac{1}{27} = 0.037$. (Exact: $\\dfrac{kQ}{2L}\\ln2 = 0.3466\\,kQ/L$ against $\\tfrac13 + \\tfrac1{81} = 0.3457$.)' },

    // ---------- level 5 ----------
    { id: 'mpl-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'average fields',
      q: 'A point dipole of moment $1.0\\times10^{-12}$ C m sits somewhere inside (not necessarily at the centre of) an imaginary sphere of radius 1.0 cm. The magnitude of the electric field averaged over the volume of the sphere is ______ kV/m (to two decimal places).',
      answer: 8.99, tol: 0.03, calc: () => K * 1e-12 / 1e-6 / 1e3,
      sol: 'For charges inside a sphere, $\\langle\\vec E\\rangle = -\\dfrac{\\vec p}{4\\pi\\epsilon_0R^3}$, independent of where they sit. Magnitude $= \\dfrac{8.99\\times10^9\\times10^{-12}}{10^{-6}} = 8.99\\times10^3$ V/m.',
      trap: 'Ignoring the contact term $-\\vec p\\,\\delta^3/3\\epsilon_0$ gives zero for a dipole at the centre.' },
    { id: 'mpl-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'interactions',
      q: 'How do interaction energies between point multipoles fall off with their separation $r$? Select the correct pairings.',
      options: ['dipole-dipole: $1/r^3$', 'point charge-quadrupole: $1/r^3$', 'dipole-quadrupole: $1/r^4$', 'quadrupole-quadrupole: $1/r^4$'], answer: [0, 1, 2],
      sol: 'A $2^l$-pole makes a potential $\\propto 1/r^{l+1}$; a $2^{l\'}$-pole couples to its $l\'$-th derivative, adding $l\'$ powers. So $U \\propto 1/r^{l + l\' + 1}$: $1 + 1 + 1 = 3$; $0 + 2 + 1 = 3$; $1 + 2 + 1 = 4$; $2 + 2 + 1 = 5$ for two quadrupoles.' },
    { id: 'mpl-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'Charges $+q$ at $(a, 0, 0)$, $-q$ at $(-a, 0, 0)$, $+q$ at $(0, a, 0)$ and $-q$ at $(0, -a, 0)$. Which statements are correct?',
      options: ['The dipole moment is $2qa(\\hat x + \\hat y)$.', 'Every component of the quadrupole tensor (about the origin) vanishes.', 'The dipole moment is the same about any origin.', 'Far away the leading field falls as $1/r^4$.'], answer: [0, 1, 2],
      sol: '$\\vec p = qa\\hat x - q(-a)\\hat x + qa\\hat y - q(-a)\\hat y = 2qa(\\hat x + \\hat y)$; net charge zero, so origin-independent. Diagonal $Q_{ii}$: the pair on the $x$ axis gives $q(2a^2) - q(2a^2) = 0$, similarly for the others; off-diagonal terms vanish since every charge has two zero coordinates. The leading term is the dipole, so the field falls as $1/r^3$; the next non-zero correction is the octupole.',
      trap: 'Zero quadrupole does not mean a fast falloff when the dipole is non-zero.' },
    { id: 'mpl-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      q: 'A spherical shell of radius $R$ carries surface charge $\\sigma = \\sigma_0\\cos^2\\theta$. Its quadrupole moment $Q_{zz} = \\int\\sigma(3z^2 - r^2)\\,dA$ is $\\kappa\\,\\sigma_0R^4$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 3.35, tol: 0.01, calc: () => 16 * PI / 15,
      sol: 'On the shell $3z^2 - r^2 = R^2(3\\cos^2\\theta - 1)$ and $dA = R^2d\\Omega$. So $Q_{zz} = \\sigma_0R^4\\cdot2\\pi\\displaystyle\\int_{-1}^{1}x^2(3x^2 - 1)\\,dx = \\sigma_0R^4\\cdot2\\pi\\left(\\tfrac65 - \\tfrac23\\right) = \\dfrac{16\\pi}{15}\\sigma_0R^4 = 3.35\\,\\sigma_0R^4$.',
      trap: 'Only the $P_2$ part of $\\cos^2\\theta$ contributes; the $\\tfrac13$ part is a monopole.' },
  ],

  gens: [
    { id: 'mpl-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dipole moment',
      make(r) {
        const pts = shuffle(r, [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [2, 0], [0, 2], [-1, 1], [1, -1]]).slice(0, 2);
        const q1 = choose(r, [1, 2, 3]), q2 = choose(r, [1, 2]);
        // charges q1 at pts[0], q2 at pts[1], -(q1+q2) at origin (cm, nC)
        const px = q1 * pts[0][0] + q2 * pts[1][0], py = q1 * pts[0][1] + q2 * pts[1][1];
        const val = Math.hypot(px, py);
        return { q: `Charges $+${q1}$ nC at $(${pts[0][0]}, ${pts[0][1]})$ cm, $+${q2}$ nC at $(${pts[1][0]}, ${pts[1][1]})$ cm and $-${q1 + q2}$ nC at the origin, all in the $xy$ plane. The magnitude of the dipole moment is ______ $\\times10^{-11}$ C m (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, val * 0.005), px, py,
          sol: `$\\vec p = \\sum q_i\\vec r_i$ (the charge at the origin adds nothing): $p_x = ${q1}(${pts[0][0]}) + ${q2}(${pts[1][0]}) = ${px}$, $p_y = ${q1}(${pts[0][1]}) + ${q2}(${pts[1][1]}) = ${py}$, in nC cm $= 10^{-11}$ C m. $|\\vec p| = \\sqrt{${px}^2 + ${py}^2} = ${round(val, 3)}\\times10^{-11}$ C m. Net charge zero: the same about any origin.`,
          trap: '1 nC cm is $10^{-9}\\times10^{-2} = 10^{-11}$ C m.' };
      },
      verify: (p) => Math.hypot(p.px, p.py) },
    { id: 'mpl-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      make(r) {
        const pool = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [-1, 1, 0]];
        const ps = shuffle(r, pool).slice(0, 3), qs = [choose(r, [1, 2]), choose(r, [-1, 1, 2]), choose(r, [-2, -1, 1])];
        const comp = choose(r, [['x', 'x', 0, 0], ['z', 'z', 2, 2], ['x', 'y', 0, 1], ['x', 'z', 0, 2], ['y', 'y', 1, 1]]);
        let val = 0;
        const terms = ps.map((v, n) => { const r2 = v[0] ** 2 + v[1] ** 2 + v[2] ** 2; const t = qs[n] * (3 * v[comp[2]] * v[comp[3]] - (comp[2] === comp[3] ? r2 : 0)); val += t; return t; });
        return { q: `Point charges (in units of $q$) sit at positions in units of $a$: ${ps.map((v, n) => `$${qs[n] > 0 ? '+' : ''}${qs[n]}$ at $(${v.join(', ')})$`).join(', ')}. The component $Q_{${comp[0]}${comp[1]}}$ of $Q_{ij} = \\sum q(3x_ix_j - r^2\\delta_{ij})$ about the origin, in units of $qa^2$, is ______.`,
          answer: val, tol: 0, ps, qs, ci: comp[2], cj: comp[3],
          sol: `Term by term, $q_n(3x_{${comp[0]}}x_{${comp[1]}}${comp[2] === comp[3] ? ' - r^2' : ''})$: ${terms.map((t, n) => `${qs[n]}\\times(${3 * ps[n][comp[2]] * ps[n][comp[3]]}${comp[2] === comp[3] ? ` - ${ps[n][0] ** 2 + ps[n][1] ** 2 + ps[n][2] ** 2}` : ''}) = ${t}`).map((s) => `$${s}$`).join('; ')}. Sum: $${val}$.`,
          trap: comp[2] === comp[3] ? 'The diagonal components include the $-r^2$ term.' : 'Off-diagonal components have no $r^2$ term.' };
      },
      verify: (p) => p.ps.reduce((s, v, n) => s + p.qs[n] * (3 * v[p.ci] * v[p.cj] - (p.ci === p.cj ? v[0] ** 2 + v[1] ** 2 + v[2] ** 2 : 0)), 0) },
    { id: 'mpl-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole potential',
      make(r) {
        const q = choose(r, [1, 2, 5]), a = choose(r, [0.5, 1, 2]), rr = choose(r, [10, 20, 50]), th = choose(r, [0, 30, 45, 60, 90, 120, 180]);
        const c = Math.cos(th * PI / 180), V = K * q * 1e-9 * (a / 100) ** 2 * (3 * c * c - 1) / (rr / 100) ** 3;
        return { q: `A linear quadrupole has $+${q}$ nC, $-${2 * q}$ nC, $+${q}$ nC on the $z$ axis at $z = -${a}$, $0$, $+${a}$ cm. Using the quadrupole term, the potential at $r = ${rr}$ cm, $\\theta = ${th}^\\circ$ from the $+z$ axis is ______ V (three significant figures, with sign).`,
          answer: +V.toPrecision(3), tol: Math.max(Math.abs(V) * 0.01, 1e-4), unit: 'V', qc: q, a, rr, th,
          sol: `$Q_{zz} = 4qa^2$ and $V = \\dfrac{kQ_{zz}}{2r^3}P_2(\\cos\\theta) = \\dfrac{kqa^2}{r^3}(3\\cos^2\\theta - 1)$. Here $3\\cos^2${th}^\\circ - 1 = ${round(3 * c * c - 1, 4)}$: $V = \\dfrac{8.99\\times10^9\\times${q}\\times10^{-9}\\times(${a / 100})^2}{(${rr / 100})^3}\\times${round(3 * c * c - 1, 4)} = ${V.toPrecision(4)}$ V.`,
          trap: 'Negative near the equator, positive near the axis.' };
      },
      verify: (p) => { const c = Math.cos(p.th * PI / 180); return K * p.qc * 1e-9 * (p.a / 100) ** 2 * (3 * c * c - 1) / (p.rr / 100) ** 3; } },
    { id: 'mpl-g04', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'dipole field',
      make(r) {
        const p = choose(r, [1, 2, 5]), rr = choose(r, [1, 2, 5, 10]), th = choose(r, [0, 30, 45, 60, 90, 135]);
        const c = Math.cos(th * PI / 180), Ef = K * p * 1e-12 * Math.sqrt(3 * c * c + 1) / (rr / 100) ** 3;
        return { q: `A point dipole of moment ${p}$\\times10^{-12}$ C m sits at the origin. The magnitude of its field at distance ${rr} cm, at ${th}$^\\circ$ from the dipole axis, is ______ V/m (three significant figures).`,
          answer: +Ef.toPrecision(3), tol: Ef * 0.01, unit: 'V/m', p, rr, th,
          sol: `$E_r = 2kp\\cos\\theta/r^3$, $E_\\theta = kp\\sin\\theta/r^3$, so $|E| = \\dfrac{kp}{r^3}\\sqrt{3\\cos^2\\theta + 1}$. $\\dfrac{kp}{r^3} = \\dfrac{8.99\\times10^9\\times${p}\\times10^{-12}}{(${rr / 100})^3} = ${(K * p * 1e-12 / (rr / 100) ** 3).toPrecision(4)}$ V/m; $\\sqrt{3\\cos^2${th}^\\circ + 1} = ${round(Math.sqrt(3 * c * c + 1), 4)}$. $|E| = ${Ef.toPrecision(4)}$ V/m.`,
          trap: 'The axis value is twice the equatorial value, and in between it is not a simple $\\cos\\theta$.' };
      },
      verify: (p) => { const c = Math.cos(p.th * PI / 180); return K * p.p * 1e-12 * Math.sqrt(3 * c * c + 1) / (p.rr / 100) ** 3; } },
    { id: 'mpl-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'falloff',
      make(r) {
        const S = choose(r, [
          ['a point charge $+q$ next to a point charge $-q$ (a small pair)', 2],
          ['charges $+q, -2q, +q$ in a short line', 3],
          ['charges $+q, -q, +q, -q$ at the corners of a small square, alternating', 3],
          ['a small uniformly charged ring with net charge', 1],
          ['two small identical dipoles placed side by side, antiparallel', 3],
          ['a small neutral cube with $+q$ on the top face and $-q$ on the bottom face, spread evenly', 2],
          ['two equal coaxial quadrupoles placed end to end with opposite signs', 4],
        ]);
        const what = choose(r, ['potential', 'field']);
        const n = S[1] + (what === 'field' ? 1 : 0);
        const o = mcqOptions(r, n, [n > 1 ? n - 1 : n + 3, n + 1, n + 2], (v) => `$1/r^{${v}}$`);
        return { q: `Far from ${S[0]}, the ${what} typically falls off with distance as`, ...o,
          sol: `Find the first non-vanishing moment. ${['', 'Net charge: monopole, potential $1/r$.', 'Net charge zero, dipole moment non-zero: potential $1/r^2$.', 'Net charge and dipole moment zero, quadrupole non-zero: potential $1/r^3$.', 'Charge, dipole and quadrupole all cancel: octupole, potential $1/r^4$.'][S[1]]} The ${what} therefore goes as $1/r^{${n}}$${what === 'field' ? ' (one power faster than the potential)' : ''}.`,
          trap: 'Field = one more power of $1/r$ than the potential.' };
      } },
    { id: 'mpl-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipole-dipole',
      make(r) {
        const cfg = choose(r, [['head to tail on a common axis', -2], ['side by side and parallel', 1], ['side by side and antiparallel', -1], ['on a common axis and antiparallel (facing each other)', 2]]);
        const p = choose(r, [0.5, 1, 1.5, 2]), d = choose(r, [0.3, 0.4, 0.5, 1]);
        const U = cfg[1] * K * (p * D) ** 2 / (d * 1e-9) ** 3 / E * 1e3;
        return { q: `Two point dipoles, each of ${p} D, are ${d} nm apart, ${cfg[0]}. Their interaction energy is ______ meV (three significant figures, with sign).`,
          answer: +U.toPrecision(3), tol: Math.abs(U) * 0.01, unit: 'meV', c: cfg[1], p, d,
          sol: `$U = \\dfrac{\\vec p_1\\cdot\\vec p_2 - 3(\\vec p_1\\cdot\\hat r)(\\vec p_2\\cdot\\hat r)}{4\\pi\\epsilon_0r^3} = ${cfg[1]}\\dfrac{kp^2}{r^3}$ here. $kp^2/r^3 = \\dfrac{8.99\\times10^9\\times(${p}\\times3.336\\times10^{-30})^2}{(${d}\\times10^{-9})^3} = ${(K * (p * D) ** 2 / (d * 1e-9) ** 3).toPrecision(4)}$ J. So $U = ${U.toPrecision(4)}$ meV.`,
          trap: 'Coaxial: $\\mp2kp^2/r^3$; side by side: $\\pm kp^2/r^3$.' };
      },
      verify: (p) => p.c * K * (p.p * D) ** 2 / (p.d * 1e-9) ** 3 / E * 1e3 },
    { id: 'mpl-g07', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'molecular dipoles',
      make(r) {
        const pb = choose(r, [0.8, 1.2, 1.5, 1.6, 2.0]), ang = choose(r, [90, 100, 104.5, 107, 109.5, 120]), n = choose(r, [2, 3]);
        // n = 2: bent AB2 with angle; n = 3: pyramidal AB3 with bond angle (all pairs) -> resultant 3 pb cos(alpha), cos(alpha) from geometry
        let val, how;
        if (n === 2) { val = 2 * pb * Math.cos(ang * PI / 360); how = `$2p_b\\cos(\\theta/2) = 2\\times${pb}\\times\\cos${ang / 2}^\\circ$`; }
        else { const cb = Math.cos(ang * PI / 180); const ca = Math.sqrt((1 + 2 * cb) / 3); val = 3 * pb * ca; how = `$3p_b\\cos\\alpha$, where $\\alpha$ (bond to symmetry axis) satisfies $\\cos^2\\alpha = (1 + 2\\cos\\beta)/3 = ${round(ca * ca, 4)}$`; }
        return { q: n === 2 ? `A bent molecule AB$_2$ has two equivalent bonds, each with moment ${pb} D, at an angle of ${ang}$^\\circ$. Its dipole moment is ______ D (to two decimal places).` : `A pyramidal molecule AB$_3$ has three equivalent bonds, each with moment ${pb} D, with every B-A-B angle equal to ${ang}$^\\circ$. Its dipole moment is ______ D (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, val * 0.005), unit: 'D', n, pb, ang,
          sol: `By symmetry only the components along the symmetry axis survive: ${how}, giving ${round(val, 3)} D.${n === 3 && ang >= 120 ? ' At 120° the molecule is flat and the moments cancel.' : ''}`,
          trap: 'Add bond moments as vectors, never as numbers.' };
      },
      verify: (p) => (p.n === 2 ? 2 * p.pb * Math.cos(p.ang * PI / 360) : 3 * p.pb * Math.sqrt((1 + 2 * Math.cos(p.ang * PI / 180)) / 3)) },
    { id: 'mpl-g08', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'molecular dipoles',
      make(r) {
        const M = choose(r, [['HF', 1.82, 92], ['HCl', 1.08, 127], ['HBr', 0.82, 141], ['HI', 0.44, 161], ['KBr', 10.4, 282], ['NaCl', 9.0, 236], ['CO', 0.11, 113]]);
        const val = M[1] * D / (E * M[2] * 1e-12) * 100;
        return { q: `${M[0]} (gas) has dipole moment ${M[1]} D and bond length ${M[2]} pm. Its percentage ionic character, $p/(e\\,d)\\times100$, is ______ % (to one decimal place).`,
          answer: round(val, 1), tol: Math.max(0.1, val * 0.01), unit: '%', pD: M[1], d: M[2],
          sol: `$e\\,d = 1.602\\times10^{-19}\\times${M[2]}\\times10^{-12} = ${(E * M[2] * 1e-12).toPrecision(4)}$ C m. $p = ${M[1]}\\times3.336\\times10^{-30} = ${(M[1] * D).toPrecision(4)}$ C m. Ratio $= ${round(val / 100, 4)}$, i.e. ${round(val, 1)}%.`,
          trap: '1 D $= 3.336\\times10^{-30}$ C m, not $10^{-30}$.' };
      },
      verify: (p) => p.pD * D / (E * p.d * 1e-12) * 100 },
    { id: 'mpl-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole tensor',
      make(r) {
        const Q = choose(r, [1, 2, 5]), a = choose(r, [1, 2, 3]), c = choose(r, [1, 2, 3, 4].filter((x) => x !== a));
        const val = 0.4 * Q * (c * c - a * a); // in nC cm^2 = 1e-13 C m^2
        return { q: `A charge of ${Q} nC is spread uniformly through a spheroid with equatorial semi-axes ${a} cm and polar semi-axis ${c} cm (along $z$). Its quadrupole moment $Q_{zz} = \\int\\rho(3z^2 - r^2)dV$ is ______ $\\times10^{-13}$ C m$^2$ (to two decimal places, with sign).`,
          answer: round(val, 2), tol: Math.max(0.01, Math.abs(val) * 0.005), Qc: Q, a, c,
          sol: `$Q_{zz} = \\tfrac25Q(c^2 - a^2) = 0.4\\times${Q}\\times(${c * c} - ${a * a})$ nC cm$^2 = ${round(val, 3)}\\times10^{-13}$ C m$^2$ (1 nC cm$^2 = 10^{-13}$ C m$^2$). ${c > a ? 'Prolate: positive.' : 'Oblate: negative.'}`,
          trap: 'The sign tells the shape: positive is cigar-like along $z$, negative is disc-like.' };
      },
      verify: (p) => 0.4 * p.Qc * (p.c ** 2 - p.a ** 2) },
    { id: 'mpl-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipole in a field',
      make(r) {
        const Q = choose(r, [1, 5, 10]), p = choose(r, [1, 2, 5]), rr = choose(r, [1, 2, 5]), orient = choose(r, ['radial', 'tangential']);
        const F = (orient === 'radial' ? 2 : 1) * K * Q * 1e-9 * p * 1e-12 / (rr / 100) ** 3 * 1e6;
        return { q: `A small dipole of moment ${p}$\\times10^{-12}$ C m is ${rr} cm from a point charge of ${Q} nC, ${orient === 'radial' ? 'pointing along the line from the charge to the dipole' : 'pointing perpendicular to the line joining them'}. The magnitude of the force on the dipole is ______ $\\mu$N (three significant figures).`,
          answer: +F.toPrecision(3), tol: F * 0.01, unit: 'μN', c: orient === 'radial' ? 2 : 1, Qc: Q, p, rr,
          sol: `$\\vec F = (\\vec p\\cdot\\nabla)\\vec E$ for the Coulomb field $\\vec E = kQ\\hat r/r^2$. ${orient === 'radial' ? 'Along $\\hat r$: $F = p\\,\\partial_r(kQ/r^2) = -2kQp/r^3$ (towards the charge).' : 'Across: moving sideways by $ds$ turns $\\vec E$ by $ds/r$, so $|F| = pE/r = kQp/r^3$, perpendicular to the line (equal and opposite to the force of the dipole on the charge).'} $|F| = ${orient === 'radial' ? 2 : 1}\\times\\dfrac{8.99\\times10^9\\times${Q}\\times10^{-9}\\times${p}\\times10^{-12}}{(${rr / 100})^3} = ${F.toPrecision(4)}$ $\\mu$N.`,
          trap: 'Radial alignment gives twice the force of the perpendicular case.' };
      },
      verify: (p) => p.c * K * p.Qc * 1e-9 * p.p * 1e-12 / (p.rr / 100) ** 3 * 1e6 },
    { id: 'mpl-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'origin dependence',
      make(r) {
        const Q = choose(r, [-3, -2, -1, 1, 2, 4]), p = [int(r, -5, 5), int(r, -5, 5)], a = [int(r, -3, 3), int(r, -3, 3)], comp = choose(r, ['x', 'y']);
        const i = comp === 'x' ? 0 : 1, val = p[i] - Q * a[i];
        return { q: `A distribution has total charge ${Q} nC and dipole moment $\\vec p = (${p[0]}\\hat x + ${p[1]}\\hat y)$ nC cm about the origin. About the point $(${a[0]}, ${a[1]})$ cm, the ${comp}-component of its dipole moment is ______ nC cm.`.replace(/\+ -/g, '- '),
          answer: val, tol: 0, Qc: Q, p, a, i,
          sol: `$\\vec p\\,' = \\vec p - Q\\vec a$. ${comp}-component: $${p[i]} - (${Q})(${a[i]}) = ${val}$ nC cm.`,
          trap: 'The sign: moving the origin towards the charge reduces the moment.' };
      },
      verify: (p) => p.p[p.i] - p.Qc * p.a[p.i] },
    { id: 'mpl-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'energy in a field',
      make(r) {
        const q = choose(r, [1, 2, 5]), a = choose(r, [0.5, 1, 2]), G = choose(r, [1, 2, 5]), b = choose(r, [0, 30, 45, 60, 90]);
        const c = Math.cos(b * PI / 180), W = -q * 1e-9 * (a * 1e-3) ** 2 * G * 1e8 * (1.5 * c * c - 0.5) * 1e6;
        return { q: `A linear quadrupole ($+${q}$ nC, $-${2 * q}$ nC, $+${q}$ nC, spacing ${a} mm) has its axis at ${b}$^\\circ$ to the $z$ axis. The external field has an axially symmetric gradient: $\\partial E_z/\\partial z = ${G}\\times10^8$ V/m$^2$, $\\partial E_x/\\partial x = \\partial E_y/\\partial y = -${G / 2}\\times10^8$ V/m$^2$. The quadrupole's energy is ______ $\\mu$J (three significant figures, with sign).`,
          answer: Math.abs(W) < 1e-12 ? 0 : +W.toPrecision(3), tol: Math.max(Math.abs(W) * 0.01, 1e-6), unit: 'μJ', qc: q, a, G, b,
          sol: `For a linear quadrupole along $\\hat n$, $Q_{ij} = 2qa^2(3n_in_j - \\delta_{ij})$. With $\\partial_iE_j = G\\,\\mathrm{diag}(-\\tfrac12, -\\tfrac12, 1)$ (traceless), $W = -\\tfrac16\\sum Q_{ij}\\partial_iE_j = -\\tfrac16\\cdot2qa^2\\cdot3G(\\cos^2\\beta - \\tfrac12\\sin^2\\beta) = -qa^2G\\,P_2(\\cos\\beta)$. $P_2(\\cos${b}^\\circ) = ${round(1.5 * c * c - 0.5, 4)}$, so $W = -${q}\\times10^{-9}\\times(${a}\\times10^{-3})^2\\times${G}\\times10^8\\times${round(1.5 * c * c - 0.5, 4)} = ${round(W, 5)}$ $\\mu$J.`,
          trap: 'At the magic angle 54.7° the energy is zero; beyond it the sign flips.' };
      },
      verify: (p) => { const c = Math.cos(p.b * PI / 180); return -p.qc * 1e-9 * (p.a * 1e-3) ** 2 * p.G * 1e8 * (1.5 * c * c - 0.5) * 1e6; } },
  ],
};
