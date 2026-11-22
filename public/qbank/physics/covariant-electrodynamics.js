// Electrodynamics and relativity: four-current and four-potential, continuity and the Lorenz gauge in covariant form,
// the field tensor and its invariants, Lorentz transformation of E and B, crossed fields and E x B drift, the field of
// a uniformly moving charge, magnetism as a relativistic effect, covariant Lorentz force and Lagrangian, plane waves
// seen from moving frames, and the forces between moving charges (GATE/NET level).
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt, C } from '../_util.js';
import more from './covariant-electrodynamics.more.gen.js';

const c = C.c;
const K = 1 / (4 * Math.PI * C.eps0);
const gam = (b) => 1 / Math.sqrt(1 - b * b);
const D = Math.PI / 180;
const MPC2 = 938.272; // proton rest energy, MeV

export default {
  topic: 'covariant-electrodynamics',
  items: [
    // ---------- level 1 ----------
    { id: 'ced-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'invariants',
      q: 'Which of these is the same in every inertial frame?',
      options: ['$|\\vec E|^2$', '$|\\vec B|$', '$\\vec E\\cdot\\vec B$', '$|\\vec E\\times\\vec B|$'], answer: 2,
      sol: 'The field tensor has two invariants: $\\vec E\\cdot\\vec B$ and $E^2 - c^2B^2$. Each field separately, and their cross product (the Poynting vector), change from frame to frame.',
      trap: 'It is the combination $E^2 - c^2B^2$ that is invariant, not $E^2$.' },
    { id: 'ced-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'The four-current density is',
      options: ['$(\\rho, \\vec J/c)$ with $\\rho$ a scalar', '$(c\\rho, \\vec J)$', '$(\\vec J, \\rho)$ with $\\vec J$ as time part', '$(\\rho c^2, \\vec J)$'], answer: 1,
      sol: '$J^\\mu = (c\\rho, \\vec J)$, which is $\\rho_0u^\\mu$ for a charge cloud with rest density $\\rho_0$ and four-velocity $u^\\mu = \\gamma(c, \\vec v)$. Both parts have units of A/m$^2$.',
      trap: 'Charge density is the time component, so it changes under boosts like $ct$.' },
    { id: 'ced-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'field transformations',
      q: 'Under a Lorentz boost along a direction $\\hat n$, the field components parallel to $\\hat n$',
      options: ['are unchanged, for both $\\vec E$ and $\\vec B$', 'are multiplied by $\\gamma$', 'are divided by $\\gamma$', 'swap: $E_\\parallel$ becomes $cB_\\parallel$'], answer: 0,
      sol: '$E\'_\\parallel = E_\\parallel$, $B\'_\\parallel = B_\\parallel$; only the perpendicular parts mix: $\\vec E\'_\\perp = \\gamma(\\vec E + \\vec v\\times\\vec B)_\\perp$ and $\\vec B\'_\\perp = \\gamma(\\vec B - \\vec v\\times\\vec E/c^2)_\\perp$.',
      trap: 'This is the reverse of lengths, where the parallel part changes.' },
    { id: 'ced-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'field tensor',
      q: 'How many independent components does the electromagnetic field tensor $F^{\\mu\\nu}$ have?',
      answer: 6, tol: 0, calc: () => (4 * 3) / 2,
      sol: '$F^{\\mu\\nu}$ is antisymmetric in four dimensions: its diagonal is zero and the entries below it are minus those above, leaving $4\\times3/2 = 6$: the three components of $\\vec E/c$ and the three of $\\vec B$.',
      trap: 'A general $4\\times4$ tensor has 16 entries; antisymmetry leaves 6.' },
    { id: 'ced-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'The electric charge of a particle',
      options: ['grows by the factor $\\gamma$ when it moves', 'falls by $\\gamma$ when it moves', 'can change sign in some frames', 'is a Lorentz scalar, the same in every frame'], answer: 3,
      sol: 'Charge is invariant: atoms are neutral although electrons move far faster than nuclei, and the integral of $J^0$ over a hypersurface is frame independent by $\\partial_\\mu J^\\mu = 0$. Charge density changes (by $\\gamma$) because volume contracts, not because charge does.',
      trap: 'Density changes; total charge does not.' },
    { id: 'ced-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'The continuity equation $\\nabla\\cdot\\vec J + \\partial\\rho/\\partial t = 0$ in covariant form is',
      options: ['$\\partial_\\mu A^\\mu = 0$', '$\\partial_\\mu J^\\mu = 0$', '$J_\\mu J^\\mu = 0$', '$\\Box J^\\mu = 0$'], answer: 1,
      sol: 'With $x^0 = ct$ and $J^0 = c\\rho$: $\\partial_0J^0 = \\frac{1}{c}\\partial_t(c\\rho) = \\partial_t\\rho$, so $\\partial_\\mu J^\\mu = \\partial_t\\rho + \\nabla\\cdot\\vec J = 0$. A four-divergence that vanishes is a statement valid in every frame.',
      trap: '$\\partial_\\mu A^\\mu = 0$ is the Lorenz gauge, a choice, not a law.' },

    // ---------- level 2 ----------
    { id: 'ced-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'field transformations',
      q: 'In frame S there is a uniform electric field of 3.0$\\times10^5$ V/m along $y$ and no magnetic field. An observer moves at $0.60c$ along $x$. The magnetic field she measures has magnitude ______ mT (to two decimal places).',
      answer: 0.75, tol: 0.01, unit: 'mT', calc: () => gam(0.6) * (0.6 * 3e5) / c * 1e3,
      sol: '$\\vec B\'_\\perp = \\gamma(\\vec B - \\vec v\\times\\vec E/c^2)_\\perp = -\\gamma\\frac{vE}{c^2}\\hat z$. With $\\gamma = 1.25$: $|B\'| = 1.25\\times\\frac{0.6\\times3.0\\times10^5}{3.0\\times10^8} = 1.25\\times6.0\\times10^{-4}$ T $= 0.75$ mT.',
      trap: 'Forgetting $\\gamma$ gives 0.60 mT.' },
    { id: 'ced-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'Compared with its Coulomb field at rest, the electric field of a charge moving uniformly at Lorentz factor $\\gamma$ (at a fixed distance from its present position) is',
      options: ['the same in every direction', 'stronger along the line of motion by $\\gamma^2$', 'stronger by $\\gamma$ perpendicular to the motion and weaker by $\\gamma^2$ along it', 'weaker by $\\gamma$ in every direction'], answer: 2,
      sol: '$E = \\dfrac{q}{4\\pi\\epsilon_0r^2}\\dfrac{1 - \\beta^2}{(1 - \\beta^2\\sin^2\\theta)^{3/2}}$. At $\\theta = 90^\\circ$ this is $\\gamma$ times Coulomb; at $\\theta = 0$, $1/\\gamma^2$ times. The field lines squash into a "pancake" perpendicular to the motion.',
      trap: 'The ratio of perpendicular to parallel field is $\\gamma^3$.' },
    { id: 'ced-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'invariants',
      q: 'Which statements are true?',
      options: ['$E^2 - c^2B^2$ is a Lorentz invariant', '$\\vec E\\cdot\\vec B$ is a Lorentz invariant', '$|\\vec E|$ is a Lorentz invariant', 'If $\\vec E\\perp\\vec B$ and $E < cB$ in one frame, some frame has $\\vec E = 0$'], answer: [0, 1, 3],
      sol: 'The invariants are $F_{\\mu\\nu}F^{\\mu\\nu} \\propto B^2 - E^2/c^2$ and $F_{\\mu\\nu}\\tilde F^{\\mu\\nu} \\propto \\vec E\\cdot\\vec B$. With $\\vec E\\cdot\\vec B = 0$ and $E < cB$, a boost at $\\vec v = \\vec E\\times\\vec B/B^2$ (speed $E/B < c$) removes $\\vec E$, leaving $B\' = \\sqrt{B^2 - E^2/c^2}$.',
      trap: 'The size of a single field is not invariant.' },
    { id: 'ced-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'crossed fields',
      q: 'A charged particle moves in crossed fields $E = 1.0\\times10^4$ V/m and $B = 0.050$ T (perpendicular). Its guiding centre drifts at ______ $\\times10^5$ m/s (to one decimal place).',
      answer: 2.0, tol: 0.02, unit: '×10⁵ m/s', calc: () => 1e4 / 0.05 / 1e5,
      sol: '$v_d = E/B = 1.0\\times10^4/0.050 = 2.0\\times10^5$ m/s, along $\\vec E\\times\\vec B$, the same for any charge or mass. In the frame moving at $v_d$ the electric field vanishes and the particle simply gyrates.',
      trap: 'The drift does not depend on the charge\'s sign or mass.' },
    { id: 'ced-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'four-potential',
      q: 'With $A^\\mu = (\\phi/c, \\vec A)$, the Lorenz gauge condition $\\partial_\\mu A^\\mu = 0$ reads',
      options: ['$\\nabla\\cdot\\vec A = 0$', '$\\nabla\\cdot\\vec A = \\partial\\phi/\\partial t$', '$\\nabla\\times\\vec A = 0$', '$\\nabla\\cdot\\vec A + \\dfrac{1}{c^2}\\dfrac{\\partial\\phi}{\\partial t} = 0$'], answer: 3,
      sol: '$\\partial_0A^0 = \\frac1c\\partial_t\\frac{\\phi}{c} = \\frac{1}{c^2}\\partial_t\\phi$, so the condition is $\\nabla\\cdot\\vec A + \\frac{1}{c^2}\\partial_t\\phi = 0$. In this gauge each component obeys the wave equation $\\Box A^\\mu = \\mu_0J^\\mu$ (with $\\Box = \\frac{1}{c^2}\\partial_t^2 - \\nabla^2$). The Coulomb gauge $\\nabla\\cdot\\vec A = 0$ is not Lorentz covariant.',
      trap: 'Dropping the $1/c^2$ breaks the units.' },
    { id: 'ced-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'A long thin rod carries charge 1.0 nC/m in its own rest frame. It moves along its length at $0.80c$. In the lab, its line charge density is ______ nC/m (to two decimal places).',
      answer: 1.67, tol: 0.01, unit: 'nC/m', calc: () => gam(0.8),
      sol: 'The charge is invariant and the rod is contracted by $\\gamma = 1/\\sqrt{1 - 0.64} = 5/3$, so $\\lambda = \\gamma\\lambda_0 = 1.67$ nC/m. It also carries a current $I = \\lambda v = 1.67\\times10^{-9}\\times0.8c = 0.40$ A.',
      trap: 'Moving charge looks denser, not thinner.' },
    { id: 'ced-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'For a charge moving with constant velocity $\\vec v$ (any speed below $c$), its magnetic and electric fields at any point are related by',
      options: ['$\\vec B = \\dfrac{\\vec v\\times\\vec E}{c^2}$', '$\\vec B = \\vec v\\times\\vec E$', '$\\vec B = \\dfrac{\\vec E\\times\\vec v}{c^2}$', '$\\vec B = \\dfrac{\\vec E}{c}$'], answer: 0,
      sol: 'In the rest frame $\\vec B\' = 0$; transforming to the lab gives $\\vec B = \\vec v\\times\\vec E/c^2$ exactly. At low speed this is Biot-Savart for a point charge, $\\vec B = \\frac{\\mu_0}{4\\pi}\\frac{q\\vec v\\times\\hat r}{r^2}$.',
      trap: 'Order of the cross product matters: $\\vec E\\times\\vec v$ has the opposite sign.' },
    { id: 'ced-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'Which of these sets form a four-vector under Lorentz transformations?',
      options: ['$(\\phi/c, \\vec A)$', '$(c\\rho, \\vec J)$', '$(\\vec E, \\vec B)$ arranged as $(|\\vec E|/c, \\vec B)$', '$(\\omega/c, \\vec k)$ of a plane wave'], answer: [0, 1, 3],
      sol: 'The potentials, the current and the wave vector are four-vectors (the last because the phase $\\vec k\\cdot\\vec r - \\omega t$ is invariant). The fields are the six components of an antisymmetric second-rank tensor; they cannot be packed into a four-vector.',
      trap: '$\\vec E$ and $\\vec B$ together have six components: a tensor, not a vector.' },
    { id: 'ced-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'covariance',
      q: 'Maxwell\'s equations keep their form under',
      options: ['Galilean transformations only', 'Lorentz transformations, but not Galilean ones', 'both Galilean and Lorentz transformations', 'neither, unless the fields are static'], answer: 1,
      sol: 'The wave equation they imply has speed $c$ in every frame, which a Galilean change of frame would alter. Historically this mismatch led Lorentz, Poincaré and Einstein to special relativity: electrodynamics was relativistic before mechanics was.',
      trap: 'Mechanics, not electromagnetism, had to change.' },
    { id: 'ced-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'field transformations',
      q: 'A large parallel-plate capacitor has field $1.0\\times10^5$ V/m between its plates (in its rest frame). It moves at $0.60c$ in a direction parallel to its plates. In the lab, the field between the plates is ______ $\\times10^5$ V/m (to two decimal places).',
      answer: 1.25, tol: 0.01, unit: '×10⁵ V/m', calc: () => gam(0.6),
      sol: 'The field is perpendicular to the motion, so $E = \\gamma E_0$. Physically, the plates contract along the motion and the surface charge density grows by $\\gamma$; $E = \\sigma/\\epsilon_0$ follows it. Moving perpendicular to the plates, the field would be unchanged.',
      trap: 'Perpendicular field components grow with $\\gamma$; the parallel one does not.' },
    { id: 'ced-024', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'invariants',
      q: 'In frame S, $\\vec E = (1.0, 2.0, 0)\\times10^5$ V/m and $\\vec B = (0, 0.50, 0.30)\\times10^{-3}$ T. In a frame moving at $0.9c$ in some direction, the value of $\\vec E\'\\cdot\\vec B\'$ is ______ V T/m.',
      answer: 100, tol: 0.5, unit: 'V T/m', calc: () => 1e5 * 0 + 2e5 * 0.5e-3 + 0,
      sol: '$\\vec E\\cdot\\vec B$ is invariant, so compute it in S: $1.0\\times10^5\\times0 + 2.0\\times10^5\\times0.50\\times10^{-3} + 0\\times0.30\\times10^{-3} = 100$ V T/m. Because it is non-zero, no frame has a pure $\\vec E$ or a pure $\\vec B$.',
      trap: 'No transformation is needed: the boost speed is a distraction.' },
    { id: 'ced-028', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'An electron moves at $1.0\\times10^6$ m/s. At its present position\'s perpendicular distance of 1.0 nm, its magnetic field has magnitude ______ mT (to one decimal place).',
      answer: 16.0, tol: 0.1, unit: 'mT', calc: () => 1e-7 * C.e * 1e6 / 1e-18 * 1e3,
      sol: 'At $v \\ll c$, $B = \\dfrac{\\mu_0}{4\\pi}\\dfrac{qv}{r^2} = 10^{-7}\\times\\dfrac{1.602\\times10^{-19}\\times10^6}{10^{-18}} = 1.60\\times10^{-2}$ T. Equivalently $B = vE/c^2$ with $E = 1.44\\times10^9$ V/m.',
      trap: 'Even a single slow electron makes a sizeable field very close to it.' },

    // ---------- level 3 ----------
    { id: 'ced-015', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'crossed fields',
      q: 'In the lab, $E = 6.0\\times10^6$ V/m and $B = 0.010$ T, at right angles. In the frame where the magnetic field vanishes, the electric field is ______ MV/m (to two decimal places).',
      answer: 5.20, tol: 0.02, unit: 'MV/m', calc: () => Math.sqrt(36e12 - (c * 0.01) ** 2) / 1e6,
      sol: '$cB = 3.0\\times10^6$ V/m $< E$, so a frame with $\\vec B\' = 0$ exists (moving at $c^2B/E = 0.5c$ along $\\vec E\\times\\vec B$). The invariant $E^2 - c^2B^2$ gives $E\' = \\sqrt{36 - 9}\\times10^6 = 5.20$ MV/m.',
      trap: 'Subtracting the fields linearly ($E - cB$) gives 3.0 MV/m, wrong.' },
    { id: 'ced-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'A proton moving at $0.90c$ passes an atom at closest distance 1.0 nm. The largest transverse electric field the atom feels is ______ $\\times10^9$ V/m (to two decimal places).',
      answer: 3.30, tol: 0.03, unit: '×10⁹ V/m', calc: () => gam(0.9) * K * C.e / 1e-18 / 1e9,
      sol: 'At closest approach the field is perpendicular to the motion: $E = \\gamma\\dfrac{q}{4\\pi\\epsilon_0b^2}$. $\\gamma = 1/\\sqrt{0.19} = 2.294$ and $\\dfrac{q}{4\\pi\\epsilon_0b^2} = 1.44\\times10^9$ V/m, so $E = 3.30\\times10^9$ V/m.',
      trap: 'At closest approach the relevant enhancement is $\\gamma$, not $1/\\gamma^2$.' },
    { id: 'ced-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'For the proton of the previous situation ($0.90c$, impact distance 1.0 nm), the transverse field pulse at the atom lasts roughly $b/(\\gamma v)$. Find this time in attoseconds (to two decimal places).',
      answer: 1.61, tol: 0.02, unit: 'as', calc: () => 1e-9 / (gam(0.9) * 0.9 * c) * 1e18,
      sol: 'The field is strong only while the proton is within a distance $\\sim b/\\gamma$ of closest approach along its path (the pancake has that thickness), so $\\Delta t \\approx \\dfrac{b}{\\gamma v} = \\dfrac{10^{-9}}{2.294\\times0.9\\times3.0\\times10^8} = 1.61\\times10^{-18}$ s. Fast particles deliver sharp kicks, which is why their energy loss in matter depends on $\\ln\\gamma$.',
      trap: 'The duration shrinks as $1/\\gamma$ while the peak grows as $\\gamma$.' },
    { id: 'ced-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magnetism from relativity',
      q: 'A neutral wire carries a current (electrons drifting). A test charge moves parallel to the wire at the electrons\' drift speed. In the test charge\'s rest frame, the force on it is',
      options: ['zero, because the charge is at rest', 'magnetic, from the moving positive ions', 'electric, because in that frame the wire is no longer neutral', 'the same as in the lab, but of opposite sign'], answer: 2,
      sol: 'In the test charge\'s frame the electrons are at rest and their spacing grows (no longer contracted), while the positive ions move and their spacing contracts. The wire carries a net charge and exerts an electric force, matching the lab\'s magnetic force (to the factor $\\gamma$ that relates forces in the two frames). Magnetism is the relativistic side of electricity.',
      trap: 'A charge at rest feels no magnetic force, but it can feel an electric one.' },
    { id: 'ced-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'field transformations',
      q: 'Under a boost along the $x$ axis, which field components keep their values?',
      options: ['$E_x$', '$B_x$', '$E_y$', '$B_z$'], answer: [0, 1],
      sol: 'Components along the boost are unchanged. $E\'_y = \\gamma(E_y - vB_z)$ and $B\'_z = \\gamma(B_z - vE_y/c^2)$ mix (as do $E_z$ and $B_y$).',
      trap: 'Only the two components along the boost survive unchanged.' },
    { id: 'ced-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'field transformations',
      q: 'In frame S, $\\vec E = 2.0\\times10^6\\,\\hat y$ V/m and $\\vec B = 0.010\\,\\hat z$ T. Frame S$\'$ moves at $0.50c$ along $+x$. The field $E\'_y$ is ______ $\\times10^5$ V/m (to two decimal places).',
      answer: 5.79, tol: 0.03, unit: '×10⁵ V/m', calc: () => gam(0.5) * (2e6 - 0.5 * c * 0.01) / 1e5,
      sol: '$E\'_y = \\gamma(E_y - vB_z)$ with $\\gamma = 1.1547$ and $vB_z = 0.5\\times3.0\\times10^8\\times0.010 = 1.50\\times10^6$ V/m. So $E\'_y = 1.1547\\times(2.0 - 1.50)\\times10^6 = 5.79\\times10^5$ V/m (with $c = 2.998\\times10^8$).',
      trap: 'Sign: $\\vec v\\times\\vec B = v\\hat x\\times B\\hat z = -vB\\hat y$, so it subtracts.' },
    { id: 'ced-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'field tensor',
      q: 'In the field tensor $F^{\\mu\\nu} = \\partial^\\mu A^\\nu - \\partial^\\nu A^\\mu$, where do $\\vec E$ and $\\vec B$ sit (signs depend on the metric convention)?',
      options: ['$\\vec E$ in the diagonal, $\\vec B$ off the diagonal', 'the time-space entries $F^{0i}$ hold $\\pm E_i/c$; the space-space entries $F^{ij}$ hold $\\pm B_k$', 'the time-space entries hold $\\vec B$; the space-space entries hold $\\vec E$', '$\\vec E$ in the first row only, $\\vec B$ nowhere'], answer: 1,
      sol: '$F^{0i}$ involves $\\partial_tA^i$ and $\\partial_i\\phi$, the ingredients of $\\vec E = -\\nabla\\phi - \\partial_t\\vec A$ (divided by $c$). $F^{ij} = \\partial^iA^j - \\partial^jA^i$ is a component of $\\nabla\\times\\vec A = \\vec B$. The diagonal is zero by antisymmetry.',
      trap: 'An antisymmetric tensor has zeros on its diagonal.' },
    { id: 'ced-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'invariants',
      q: 'In some frame $\\vec E\\cdot\\vec B \\ne 0$. Which statements are true?',
      options: ['There is a frame in which $\\vec E$ and $\\vec B$ are perpendicular', 'No frame has $\\vec B = 0$', 'No frame has $\\vec E = 0$', 'There is a frame in which $\\vec E$ and $\\vec B$ are parallel'], answer: [1, 2, 3],
      sol: 'If either field vanished in some frame, $\\vec E\\cdot\\vec B$ would be zero there and hence everywhere. Perpendicular fields also give zero, so they are impossible too. A boost along $\\vec E\\times\\vec B$ with speed $v$ given by $\\frac{\\vec v}{1 + v^2/c^2} = \\frac{\\vec E\\times\\vec B}{B^2 + E^2/c^2}$ makes them parallel.',
      trap: 'Non-zero $\\vec E\\cdot\\vec B$ rules out perpendicular fields in every frame.' },
    { id: 'ced-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'covariant Lorentz force',
      q: 'The covariant equation of motion $\\dfrac{dp^\\mu}{d\\tau} = qF^{\\mu\\nu}u_\\nu$ has a time component ($\\mu = 0$) that states',
      options: ['the conservation of charge', 'that the rate of change of the particle\'s energy is $q\\vec E\\cdot\\vec v$', 'Gauss\'s law', 'that the magnetic force changes the speed'], answer: 1,
      sol: '$p^0 = E_{\\text{tot}}/c$, and the $\\mu = 0$ component gives $\\frac{dE_{\\text{tot}}}{dt} = q\\vec E\\cdot\\vec v$: only the electric field does work. The space components give $\\frac{d\\vec p}{dt} = q(\\vec E + \\vec v\\times\\vec B)$.',
      trap: 'The magnetic force is perpendicular to $\\vec v$ and does no work.' },
    { id: 'ced-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plane waves',
      q: 'A plane wave falls normally on a mirror that approaches the source at $0.10c$. The reflected frequency divided by the incident frequency (both in the lab) is ______ (to three decimal places).',
      answer: 1.222, tol: 0.002, calc: () => 1.1 / 0.9,
      sol: 'In the mirror frame the incident wave is blue-shifted by $\\sqrt{(1 + \\beta)/(1 - \\beta)}$ and reflects at the same frequency; transforming back to the lab shifts it again by the same factor. Total: $\\frac{1 + \\beta}{1 - \\beta} = \\frac{1.1}{0.9} = 1.222$. (This double shift is how police radar works, at $\\beta \\sim 10^{-7}$.)',
      trap: 'Using a single Doppler factor gives 1.106.' },
    { id: 'ced-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lagrangian',
      q: 'The Lagrangian of a relativistic charge $q$ in potentials $\\phi$, $\\vec A$ is',
      options: ['$\\tfrac12mv^2 - q\\phi$', '$-mc^2/\\gamma + q\\phi - q\\vec v\\cdot\\vec A$', '$\\gamma mc^2 - q\\phi + q\\vec v\\cdot\\vec A$', '$-mc^2/\\gamma - q\\phi + q\\vec v\\cdot\\vec A$'], answer: 3,
      sol: '$L = -mc^2\\sqrt{1 - v^2/c^2} - q\\phi + q\\vec v\\cdot\\vec A$. Its canonical momentum is $\\partial L/\\partial\\vec v = \\gamma m\\vec v + q\\vec A$, and the Euler-Lagrange equations give the Lorentz force. The interaction term is $-qA_\\mu dx^\\mu/dt$, a Lorentz-invariant coupling.',
      trap: 'The free part is $-mc^2/\\gamma$, not the energy $\\gamma mc^2$.' },
    { id: 'ced-030', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'crossed fields',
      q: 'Crossed fields $E = 3.0\\times10^5$ V/m and $B = 2.0$ mT are perpendicular. In the frame where the electric field vanishes, the magnetic field is ______ mT (to two decimal places).',
      answer: 1.73, tol: 0.01, unit: 'mT', calc: () => Math.sqrt(4e-6 - (3e5 / c) ** 2) * 1e3,
      sol: '$E/c = 1.0$ mT $< B$, so moving at $v = E/B = 1.5\\times10^8$ m/s ($0.5c$) removes $\\vec E$. From $B^2 - E^2/c^2$ invariant: $B\' = \\sqrt{4.0 - 1.0}$ mT $= 1.73$ mT.',
      trap: 'The field left over is smaller than $B$, not larger.' },
    { id: 'ced-036', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetism from relativity',
      q: 'An electron moves at $1.0\\times10^6$ m/s parallel to a long straight wire carrying 10 A, 1.0 cm away. The force on it in the lab is ______ $\\times10^{-17}$ N (to two decimal places).',
      answer: 3.20, tol: 0.02, unit: '×10⁻¹⁷ N', calc: () => C.e * 1e6 * (C.mu0 * 10) / (2 * Math.PI * 0.01) * 1e17,
      sol: '$B = \\dfrac{\\mu_0I}{2\\pi r} = 2.0\\times10^{-4}$ T and $F = evB = 1.602\\times10^{-19}\\times10^6\\times2.0\\times10^{-4} = 3.20\\times10^{-17}$ N. In the electron\'s rest frame the same force (to order $v^2/c^2$) is electric: the wire acquires a line charge $\\lambda\' \\approx Iv/c^2$.',
      trap: 'The force depends on the current, not on the drift speed of the electrons in the wire.' },

    // ---------- level 4 ----------
    { id: 'ced-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'crossed fields',
      q: 'Perpendicular fields $E = 6.0\\times10^5$ V/m and $B = 1.0$ mT fill a region. A frame in which the magnetic field vanishes moves at speed ______ $\\times c$ (to two decimal places).',
      answer: 0.50, tol: 0.005, calc: () => (c * 1e-3) / 6e5,
      sol: 'Here $E > cB = 3.0\\times10^5$ V/m, so $\\vec E$ cannot be removed but $\\vec B$ can. $\\vec B\'_\\perp = \\gamma(\\vec B - \\vec v\\times\\vec E/c^2) = 0$ for $\\vec v \\perp \\vec E$ needs $v = c^2B/E$, i.e. $v/c = cB/E = 0.50$, along $\\vec E\\times\\vec B$.',
      trap: '$E/B$ would exceed $c$ here: the drift picture fails when $E > cB$.' },
    { id: 'ced-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'For a charge moving with constant velocity, the electric field at a distant point at time $t$ points',
      options: ['radially away from where the charge is at time $t$', 'radially away from the retarded position', 'along the velocity', 'in a direction that depends on the distance'], answer: 0,
      sol: 'Although the field is built from the retarded position, for uniform motion the result points from the charge\'s present position (extrapolated straight-line motion). Information travels at $c$, but the field "anticipates" because the motion is predictable. If the charge suddenly stops, the region not yet reached by the news still points to where it would have been.',
      trap: 'The retarded position is where the field is calculated from, not where it points from.' },
    { id: 'ced-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'plane waves',
      q: 'An observer moves at $0.60c$ in the same direction as a plane electromagnetic wave. The ratio of the wave\'s energy density she measures to that in the lab is ______ (to two decimal places).',
      answer: 0.25, tol: 0.005, calc: () => (1 - 0.6) / (1 + 0.6),
      sol: 'For a wave along $x$ with $E_y = cB_z$: $E\'_y = \\gamma(E_y - vB_z) = \\gamma(1 - \\beta)E_y = \\sqrt{\\frac{1 - \\beta}{1 + \\beta}}E_y = 0.5E_y$. Energy density $\\propto E^2$: ratio $\\frac{1 - \\beta}{1 + \\beta} = 0.25$. The frequency also falls by 0.5, so the photon number density falls by 0.5, consistent.',
      trap: 'The amplitude scales like the Doppler factor; the energy density like its square.' },
    { id: 'ced-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'plane waves',
      q: 'For a plane electromagnetic wave in vacuum, which statements are true?',
      options: ['$\\vec E\\cdot\\vec B = 0$ in every frame', '$E^2 - c^2B^2 = 0$ in every frame', 'There is a frame in which the wave is purely electric', 'A boost along the propagation direction scales the amplitude by $\\sqrt{(1 - \\beta)/(1 + \\beta)}$'], answer: [0, 1, 3],
      sol: 'A plane wave has both invariants zero (a "null" field), so it stays a plane wave of the same kind in every frame: it can be made weaker or stronger by boosting along or against it, but never purely electric or magnetic (that would make $E^2 - c^2B^2 \\ne 0$).',
      trap: 'You cannot catch up with light, and you cannot boost away one of its fields.' },
    { id: 'ced-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'field tensor',
      q: 'The homogeneous Maxwell equations $\\partial_\\lambda F_{\\mu\\nu} + \\partial_\\mu F_{\\nu\\lambda} + \\partial_\\nu F_{\\lambda\\mu} = 0$ contain',
      options: ['Gauss\'s law and the Ampère-Maxwell law', 'Faraday\'s law and $\\nabla\\cdot\\vec B = 0$', 'the continuity equation', 'the Lorenz gauge condition'], answer: 1,
      sol: 'This Bianchi identity holds automatically when $F_{\\mu\\nu} = \\partial_\\mu A_\\nu - \\partial_\\nu A_\\mu$; its components with three space indices give $\\nabla\\cdot\\vec B = 0$ and those with one time index give $\\nabla\\times\\vec E + \\partial_t\\vec B = 0$. The sourced equation $\\partial_\\mu F^{\\mu\\nu} = \\mu_0J^\\nu$ contains Gauss and Ampère-Maxwell, and implies continuity.',
      trap: 'The source-free pair is the one that the potentials solve automatically.' },
    { id: 'ced-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'A charge moves at Lorentz factor $\\gamma = 3$. At equal distances from its present position, the ratio of its electric field strength perpendicular to the motion to that along the motion is ______.',
      answer: 27, tol: 0, calc: () => 3 ** 3,
      sol: 'Perpendicular: $\\gamma\\times$ Coulomb. Along the line: $(1 - \\beta^2) = 1/\\gamma^2$ times Coulomb. Ratio $\\gamma^3 = 27$.',
      trap: 'It is not $\\gamma^2$: one factor of $\\gamma$ enhances the side, two suppress the front.' },
    { id: 'ced-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'stress-energy',
      q: 'In the electromagnetic stress-energy tensor $T^{\\mu\\nu}$, the components $T^{0i}$ give',
      options: ['the Maxwell stress tensor', 'the energy density times $c$', '$S_i/c$, so the momentum density of the field is $\\vec S/c^2$', 'the charge density'], answer: 2,
      sol: '$T^{00} = u$ (energy density), $T^{0i} = S_i/c$ (energy flux, equivalently $c$ times momentum density $\\vec g = \\vec S/c^2$), and $T^{ij} = -\\sigma_{ij}$ (minus the Maxwell stress). $\\partial_\\mu T^{\\mu\\nu} = -F^{\\nu\\lambda}J_\\lambda$ expresses Poynting\'s theorem and momentum balance.',
      trap: 'Energy flux and momentum density are the same thing up to $c^2$, by the symmetry of $T^{\\mu\\nu}$.' },
    { id: 'ced-039', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'A cloud of charge has density $\\rho_0$ in its rest frame and moves at $0.80c$. In the lab its current density is ______ $\\times c\\rho_0$ (to two decimal places).',
      answer: 1.33, tol: 0.005, calc: () => gam(0.8) * 0.8,
      sol: '$J^\\mu = \\rho_0u^\\mu = \\rho_0\\gamma(c, \\vec v)$, so $\\rho = \\gamma\\rho_0 = 1.667\\rho_0$ and $J = \\gamma\\rho_0v = \\frac53\\times0.8\\,c\\rho_0 = 1.33\\,c\\rho_0$. Check: $(c\\rho)^2 - J^2 = c^2\\rho_0^2(2.778 - 1.778) = c^2\\rho_0^2$.',
      trap: 'The current uses the lab density $\\gamma\\rho_0$, not $\\rho_0$.' },
    { id: 'ced-044', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'crossed fields',
      q: 'A proton starts from rest in perpendicular fields $E = 2.0\\times10^4$ V/m and $B = 0.10$ T. It moves on a cycloid. Its greatest speed is ______ $\\times10^5$ m/s (to one decimal place).',
      answer: 4.0, tol: 0.02, unit: '×10⁵ m/s', calc: () => (2 * 2e4) / 0.1 / 1e5,
      sol: 'In the frame moving at $v_d = E/B = 2.0\\times10^5$ m/s, $\\vec E\' \\approx 0$ and the proton (initially moving at $-v_d$ there) circles at speed $v_d$. Back in the lab its velocity is $\\vec v_d$ plus a rotating vector of size $v_d$: from 0 to $2v_d = 4.0\\times10^5$ m/s.',
      trap: 'The top speed of a cycloid is twice the drift speed, whatever the mass.' },

    // ---------- level 5 ----------
    { id: 'ced-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'moving charge',
      q: 'A charge moves uniformly at $0.80c$. At what angle $\\theta$ from its velocity (measured at its present position) does its field strength equal the Coulomb value at the same distance? (degrees, to one decimal place)',
      answer: 61.4, tol: 0.15, unit: '°', calc: () => Math.asin(Math.sqrt((1 - 0.36 ** (2 / 3)) / 0.64)) / D,
      sol: 'Set $\\dfrac{1 - \\beta^2}{(1 - \\beta^2\\sin^2\\theta)^{3/2}} = 1$: $1 - \\beta^2\\sin^2\\theta = (1 - \\beta^2)^{2/3} = 0.36^{2/3} = 0.5066$. So $\\sin^2\\theta = \\dfrac{0.4934}{0.64} = 0.771$ and $\\theta = 61.4^\\circ$. Closer to the direction of motion the field is weaker than Coulomb; closer to $90^\\circ$ it is stronger.',
      trap: 'The crossover is not at $45^\\circ$, and it moves towards $90^\\circ$ as $\\beta \\to 1$.' },
    { id: 'ced-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Lagrangian',
      q: 'Under a gauge change $\\vec A \\to \\vec A + \\nabla\\chi$, $\\phi \\to \\phi - \\partial_t\\chi$, which statements about a charged particle are true?',
      options: ['The Lorenz gauge condition is not Lorentz invariant', 'The Lagrangian changes by a total time derivative $q\\,d\\chi/dt$', 'The canonical momentum $\\vec p + q\\vec A$ changes', 'The kinetic momentum $\\gamma m\\vec v$ is unchanged'], answer: [1, 2, 3],
      sol: '$\\delta L = -q\\delta\\phi + q\\vec v\\cdot\\delta\\vec A = q(\\partial_t\\chi + \\vec v\\cdot\\nabla\\chi) = q\\,d\\chi/dt$, which leaves the equations of motion unchanged. The canonical momentum shifts by $q\\nabla\\chi$, while $\\gamma m\\vec v$ (and the fields) do not. $\\partial_\\mu A^\\mu = 0$ is a scalar equation, so the Lorenz gauge is Lorentz invariant (unlike the Coulomb gauge).',
      trap: 'In quantum mechanics the canonical momentum is $-i\\hbar\\nabla$, so the wavefunction must change phase under a gauge change.' },
    { id: 'ced-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetism from relativity',
      q: 'Two parallel beams of electrons move side by side at the same speed $0.99c$. The net (electric minus magnetic) repulsion between them, as a fraction of the electric repulsion alone, is ______ (to four decimal places).',
      answer: 0.0199, tol: 0.0002, calc: () => 1 - 0.99 ** 2,
      sol: 'The electric force per unit length is $\\frac{\\lambda^2}{2\\pi\\epsilon_0d}$ and the magnetic attraction $\\frac{\\mu_0I^2}{2\\pi d} = \\frac{\\mu_0\\lambda^2v^2}{2\\pi d}$; their ratio is $v^2/c^2$. So the net is $1 - \\beta^2 = 1/\\gamma^2 = 0.0199$ of the electric part. In the beams\' rest frame the force is purely electric and smaller by $\\gamma$; transforming the transverse force to the lab divides by $\\gamma$ again. This is why relativistic beams barely blow up.',
      trap: 'The magnetic attraction never fully cancels the electric repulsion for $v < c$.' },
    { id: 'ced-043', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'invariants',
      q: 'In frame S, a uniform field has $\\vec E = E\\hat y$ and $\\vec B = (E/c)\\hat z$. Which statement is correct?',
      options: ['A boost along $x$ removes the magnetic field', 'A boost along $x$ removes the electric field', 'The fields are those of a static capacitor seen from a moving frame', 'Both invariants vanish: boosts along $x$ scale both fields by $\\sqrt{(1 - \\beta)/(1 + \\beta)}$, but neither can be removed'], answer: 3,
      sol: '$E^2 - c^2B^2 = 0$ and $\\vec E\\cdot\\vec B = 0$: a null field, like a plane wave. $E\'_y = \\gamma(E - vE/c) = \\gamma(1 - \\beta)E$ and $cB\'_z = \\gamma(1 - \\beta)E$: both shrink together for $\\beta > 0$ and grow for $\\beta < 0$. Removing one would make the first invariant non-zero; a static capacitor seen from a moving frame always has $E > cB$.',
      trap: 'Crossed fields with $E = cB$ exactly sit on the boundary: no drift frame exists ($v = c$).' },
  ],

  gens: [
    { id: 'ced-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'field transformations',
      make(r) {
        const E = int(r, 1, 9) * 1e5, b = choose(r, [0.2, 0.3, 0.5, 0.6, 0.8, 0.9]), ask = choose(r, ['B', 'E']);
        const g = gam(b), val = ask === 'B' ? (g * b * E) / c * 1e3 : (g * E) / 1e5, answer = round(val, 4);
        return { q: `In frame S there is a uniform electric field $${fmt(E, 2)}$ V/m along $y$ and no magnetic field. Frame S$'$ moves at $${b}c$ along $x$. Find ${ask === 'B' ? 'the magnitude of $\\vec B\'$ in mT' : '$E\'_y$ in units of $10^5$ V/m'}.`,
          answer, tol: Math.max(0.0005, val * 0.005), unit: ask === 'B' ? 'mT' : '×10⁵ V/m', E, b, ask,
          sol: `$\\gamma = 1/\\sqrt{1 - ${b}^2} = ${g.toFixed(4)}$. ${ask === 'B' ? `$|B\'| = \\gamma vE/c^2 = \\gamma\\beta E/c = ${g.toFixed(4)}\\times${b}\\times${fmt(E, 2)}/(3.0\\times10^8)$ T $= ${answer}$ mT.` : `$E\'_y = \\gamma(E_y - vB_z) = \\gamma E_y = ${answer}\\times10^5$ V/m.`}`,
          trap: 'Perpendicular fields pick up a factor $\\gamma$.' };
      },
      verify: (p) => { const g = 1 / Math.sqrt((1 - p.b) * (1 + p.b)); return p.ask === 'B' ? (g * p.b * p.E * 1e3) / c : (g * p.E) / 1e5; } },
    { id: 'ced-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'field transformations',
      make(r) {
        const E = int(r, 1, 9) * 1e6, B = int(r, 1, 9) * 1e-3 * choose(r, [1, 10]), b = choose(r, [0.1, 0.25, 0.5, 0.6, 0.8]), ask = choose(r, ['E', 'B']);
        const g = gam(b), v = b * c;
        const val = ask === 'E' ? (g * (E - v * B)) / 1e5 : g * (B - (v * E) / (c * c)) * 1e3, answer = round(val, 3);
        return { q: `In frame S, $\\vec E = ${fmt(E, 2)}\\,\\hat y$ V/m and $\\vec B = ${fmt(B, 2)}\\,\\hat z$ T. Frame S$'$ moves at $${b}c$ along $+x$. Find ${ask === 'E' ? '$E\'_y$ in units of $10^5$ V/m' : '$B\'_z$ in mT'} (sign included).`,
          answer, tol: Math.max(0.002, Math.abs(val) * 0.005), unit: ask === 'E' ? '×10⁵ V/m' : 'mT', E, B, b, ask,
          sol: `$\\gamma = ${g.toFixed(4)}$, $v = ${fmt(v, 4)}$ m/s. ${ask === 'E' ? `$E\'_y = \\gamma(E_y - vB_z) = ${g.toFixed(4)}\\times(${fmt(E, 2)} - ${fmt(v * B, 4)})$ V/m $= ${answer}\\times10^5$ V/m.` : `$B\'_z = \\gamma(B_z - vE_y/c^2) = ${g.toFixed(4)}\\times(${fmt(B, 2)} - ${fmt((v * E) / (c * c), 4)})$ T $= ${answer}$ mT.`}`,
          trap: 'Signs: $(\\vec v\\times\\vec B)_y = -vB_z$ and $(\\vec v\\times\\vec E)_z = vE_y$.' };
      },
      verify: (p) => { // apply the field tensor boost as a matrix to F^{02}=-Ey/c, F^{12}=-Bz
        const g = gam(p.b), b = p.b, F02 = -p.E / c, F12 = -p.B;
        const F02p = g * (F02 - b * F12), F12p = g * (F12 - b * F02);
        return p.ask === 'E' ? (-F02p * c) / 1e5 : -F12p * 1e3; } },
    { id: 'ced-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'four-vectors',
      make(r) {
        const l0 = int(r, 1, 20), b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9, 0.95, 0.99]), ask = choose(r, ['density', 'current']);
        const g = gam(b), val = ask === 'density' ? g * l0 : g * l0 * 1e-9 * b * c, answer = round(val, 3);
        return { q: `A thin rod carries ${l0} nC/m in its rest frame and moves along its length at $${b}c$. Find ${ask === 'density' ? 'its line charge density in the lab, in nC/m' : 'the current it carries in the lab, in A'}.`,
          answer, tol: Math.max(0.002, val * 0.005), unit: ask === 'density' ? 'nC/m' : 'A', l0, b, ask,
          sol: `$\\gamma = ${g.toFixed(4)}$, so $\\lambda = \\gamma\\lambda_0 = ${(g * l0).toFixed(4)}$ nC/m.${ask === 'current' ? ` $I = \\lambda v = ${(g * l0).toFixed(4)}\\times10^{-9}\\times${b}\\times3.0\\times10^8 = ${answer}$ A.` : ''}`,
          trap: 'Length contraction concentrates the invariant charge.' };
      },
      verify: (p) => { const u0 = p.l0 / Math.sqrt(1 - p.b * p.b); return p.ask === 'density' ? u0 : u0 * 1e-9 * p.b * c; } },
    { id: 'ced-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'crossed fields',
      make(r) {
        const E = int(r, 1, 9) * 1e5, B = int(r, 1, 9) * 1e-3;
        const elec = E > c * B, val = elec ? Math.sqrt(E * E - c * c * B * B) / 1e5 : Math.sqrt(B * B - (E * E) / (c * c)) * 1e3;
        if (Math.abs(E - c * B) < 0.05 * E) return { q: `Perpendicular fields $E = ${fmt(E, 2)}$ V/m and $B = ${fmt(B, 2)}$ T. Find $|E^2 - c^2B^2|^{1/2}$ in units of $10^5$ V/m.`, answer: round(Math.sqrt(Math.abs(E * E - c * c * B * B)) / 1e5, 3), tol: 0.003, E, B, elec: 'abs',
          sol: `$\\sqrt{|E^2 - c^2B^2|} = \\sqrt{|${fmt(E * E, 4)} - ${fmt(c * c * B * B, 4)}|} = ${round(Math.sqrt(Math.abs(E * E - c * c * B * B)) / 1e5, 3)}\\times10^5$ V/m.`, trap: 'This invariant is the same in every frame.' };
        const answer = round(val, 3);
        return { q: `Perpendicular fields $E = ${fmt(E, 2)}$ V/m and $B = ${fmt(B, 2)}$ T fill a region. One of the fields vanishes in a suitable frame. Find the other field in that frame, in ${elec ? 'units of $10^5$ V/m' : 'mT'}.`,
          answer, tol: Math.max(0.002, val * 0.005), unit: elec ? '×10⁵ V/m' : 'mT', E, B, elec,
          sol: `$cB = ${fmt(c * B, 4)}$ V/m ${elec ? '$<$' : '$>$'} $E$, so ${elec ? '$\\vec B$' : '$\\vec E$'} can be removed. The invariant $E^2 - c^2B^2$ gives ${elec ? `$E\' = \\sqrt{E^2 - c^2B^2} = ${answer}\\times10^5$ V/m` : `$B\' = \\sqrt{B^2 - E^2/c^2} = ${answer}$ mT`}.`,
          trap: 'Compare $E$ with $cB$, not with $B$.' };
      },
      verify: (p) => { const d = p.E * p.E - c * c * p.B * p.B; return p.elec === 'abs' ? Math.sqrt(Math.abs(d)) / 1e5 : p.elec ? Math.sqrt(d) / 1e5 : (Math.sqrt(-d) / c) * 1e3; } },
    { id: 'ced-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'crossed fields',
      make(r) {
        const B = int(r, 1, 9) * 1e-3, kind = int(r, 0, 2), E = kind === 0 ? round(c * B * choose(r, [1.5, 2, 3, 5]), -3) : kind === 1 ? round(c * B * choose(r, [0.1, 0.3, 0.5, 0.7]), -3) : c * B;
        const labels = ['a frame exists in which $\\vec B = 0$', 'a frame exists in which $\\vec E = 0$', 'no frame removes either field', 'a frame exists in which both vanish'];
        const o = mcqOptions(r, labels[kind], labels.filter((_, i) => i !== kind));
        const Etxt = kind === 2 ? `cB = ${fmt(E, 4)}` : fmt(E, 3);
        return { q: `Uniform perpendicular fields $E = ${Etxt}$ V/m and $B = ${fmt(B, 2)}$ T. Which is true?`, ...o,
          sol: `$\\vec E\\cdot\\vec B = 0$ and $E^2 - c^2B^2$ is ${kind === 0 ? 'positive ($E > cB$): boosting at $v = c^2B/E < c$ removes $\\vec B$' : kind === 1 ? 'negative ($E < cB$): boosting at the drift velocity $E/B < c$ removes $\\vec E$' : 'zero: a null field like a plane wave, so no frame removes either'}. Both cannot vanish, since the invariant would then be zero while the fields are not.`,
          trap: 'Which field can be removed depends on the sign of $E^2 - c^2B^2$.' };
      } },
    { id: 'ced-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moving charge',
      make(r) {
        const b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9, 0.95]), th = choose(r, [0, 15, 30, 45, 60, 75, 90]);
        const s2 = Math.sin(th * D) ** 2, val = (1 - b * b) / (1 - b * b * s2) ** 1.5, answer = round(val, 4);
        return { q: `A charge moves uniformly at $${b}c$. At angle $${th}^\\circ$ from its velocity, measured from its present position, find its electric field strength as a multiple of the Coulomb value at the same distance.`,
          answer, tol: Math.max(0.001, val * 0.005), b, th,
          sol: `$\\dfrac{E}{E_{\\text{Coul}}} = \\dfrac{1 - \\beta^2}{(1 - \\beta^2\\sin^2\\theta)^{3/2}} = \\dfrac{${(1 - b * b).toFixed(4)}}{(1 - ${(b * b).toFixed(4)}\\times${s2.toFixed(4)})^{3/2}} = ${answer}$.`,
          trap: 'Along the motion it is $1/\\gamma^2$; across it, $\\gamma$.' };
      },
      verify: (p) => { // from the boosted Coulomb field: in rest frame point at (x0 = gamma x, y), lab E components
        const g = gam(p.b), x = Math.cos(p.th * D), y = Math.sin(p.th * D), r0 = Math.hypot(g * x, y);
        const Ex = (g * x) / r0 ** 3, Ey = (g * y) / r0 ** 3; return Math.hypot(Ex, Ey); } },
    { id: 'ced-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moving charge',
      make(r) {
        const who = choose(r, ['proton', 'electron', 'alpha particle']), b = choose(r, [0.5, 0.8, 0.9, 0.99, 0.999]), bnm = choose(r, [0.1, 0.5, 1, 2, 5]);
        const q = who === 'alpha particle' ? 2 * C.e : C.e, E = (gam(b) * K * q) / (bnm * 1e-9) ** 2, ex = Math.floor(Math.log10(E)), val = E / 10 ** ex, answer = round(val, 3);
        return { q: `A${who === 'alpha particle' ? 'n' : ''} ${who} moving at $${b}c$ passes an atom at closest distance ${bnm} nm. The peak transverse electric field at the atom is $N\\times10^{${ex}}$ V/m. Find $N$.`,
          answer, tol: Math.max(0.002, val * 0.005), b, bnm, q0: q, ex,
          sol: `$E_{\\max} = \\gamma\\dfrac{q}{4\\pi\\epsilon_0b^2}$ with $\\gamma = ${gam(b).toFixed(4)}$: $${gam(b).toFixed(4)}\\times\\dfrac{8.988\\times10^9\\times${fmt(q, 4)}}{(${bnm}\\times10^{-9})^2} = ${fmt(E, 4)}$ V/m.`,
          trap: 'The perpendicular field at closest approach is enhanced by $\\gamma$.' };
      },
      verify: (p) => (p.q0 / (4 * Math.PI * C.eps0 * (p.bnm * 1e-9) ** 2 * Math.sqrt(1 - p.b * p.b))) / 10 ** p.ex },
    { id: 'ced-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'invariants',
      make(r) {
        const e = [int(r, -5, 5), int(r, -5, 5), int(r, 1, 5)], bb = [int(r, -5, 5), int(r, 1, 5), int(r, -5, 5)], ask = choose(r, ['dot', 'diff']);
        const E = e.map((x) => x * 1e5), B = bb.map((x) => x * 1e-4);
        const dot = E[0] * B[0] + E[1] * B[1] + E[2] * B[2], diff = (E[0] ** 2 + E[1] ** 2 + E[2] ** 2 - c * c * (B[0] ** 2 + B[1] ** 2 + B[2] ** 2)) / 1e10;
        const val = ask === 'dot' ? dot : diff, answer = round(val, 3);
        return { q: `In frame S, $\\vec E = (${e.join(', ')})\\times10^5$ V/m and $\\vec B = (${bb.join(', ')})\\times10^{-4}$ T. Find ${ask === 'dot' ? '$\\vec E\'\\cdot\\vec B\'$ in any other inertial frame, in V T/m' : '$E\'^2 - c^2B\'^2$ in any other inertial frame, in units of $10^{10}$ V$^2$/m$^2$'}.`,
          answer, tol: Math.max(0.002, Math.abs(val) * 0.005), e, bb, ask,
          sol: `It is invariant, so evaluate it in S: ${ask === 'dot' ? `$\\vec E\\cdot\\vec B = (${e[0]}\\cdot${bb[0]} + ${e[1]}\\cdot${bb[1]} + ${e[2]}\\cdot${bb[2]})\\times10 = ${answer}$ V T/m.` : `$E^2 = ${e[0] ** 2 + e[1] ** 2 + e[2] ** 2}\\times10^{10}$, $c^2B^2 = ${((c * c * (bb[0] ** 2 + bb[1] ** 2 + bb[2] ** 2) * 1e-8) / 1e10).toFixed(4)}\\times10^{10}$, difference $${answer}\\times10^{10}$ V$^2$/m$^2$.`}`,
          trap: 'No Lorentz transformation is needed for an invariant.' };
      },
      verify: (p) => (p.ask === 'dot' ? 10 * (p.e[0] * p.bb[0] + p.e[1] * p.bb[1] + p.e[2] * p.bb[2]) : (1e10 * p.e.reduce((s, x) => s + x * x, 0) - c * c * 1e-8 * p.bb.reduce((s, x) => s + x * x, 0)) / 1e10) },
    { id: 'ced-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plane waves',
      make(r) {
        const b = choose(r, [0.1, 0.2, 0.3, 0.5, 0.6, 0.8]), dir = choose(r, ['with', 'against']), ask = choose(r, ['amplitude', 'energy density', 'intensity']);
        const bb = dir === 'with' ? b : -b, f = Math.sqrt((1 - bb) / (1 + bb)), val = ask === 'amplitude' ? f : f * f, answer = round(val, 4);
        return { q: `An observer moves at $${b}c$ ${dir === 'with' ? 'in the same direction as' : 'straight towards the source of'} a plane electromagnetic wave. Find the ratio of the wave's ${ask === 'amplitude' ? 'electric field amplitude' : ask} that she measures to the lab value.`,
          answer, tol: Math.max(0.001, val * 0.005), b: bb, ask,
          sol: `$E\'_y = \\gamma(E_y - vB_z) = \\gamma(1 - \\beta)E_y = \\sqrt{\\dfrac{1 - \\beta}{1 + \\beta}}E_y$ with $\\beta = ${bb}$ (positive along the wave). So the amplitude ratio is $${f.toFixed(4)}$${ask === 'amplitude' ? '' : `, and the ${ask} (both $\\propto E^2$ for a plane wave) scale by its square, $${answer}$`}.`,
          trap: 'Energy density and intensity scale like the square of the Doppler factor.' };
      },
      verify: (p) => { const g = gam(p.b), a = g * (1 - p.b); return p.ask === 'amplitude' ? a : a * a; } },
    { id: 'ced-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetism from relativity',
      make(r) {
        const who = choose(r, ['electrons', 'protons']), ask = choose(r, ['speed', 'energy']);
        let b, txt;
        if (ask === 'speed') { b = choose(r, [0.1, 0.5, 0.8, 0.9, 0.99]); txt = `at $${b}c$`; } else { const T = who === 'electrons' ? choose(r, [0.1, 0.5, 1, 2, 5]) : choose(r, [50, 100, 500, 1000, 5000]); const m = who === 'electrons' ? 0.51099895 : MPC2; const g = 1 + T / m; b = Math.sqrt(1 - 1 / (g * g)); txt = `with kinetic energy ${T} MeV each`; }
        const val = 1 - b * b, answer = round(val, 5);
        return { q: `Two parallel beams of ${who} move side by side ${txt}. Find the net transverse force between them (electric repulsion minus magnetic attraction) as a fraction of the electric repulsion alone.`,
          answer, tol: Math.max(0.00001, val * 0.005), b,
          sol: `The magnetic attraction is $v^2/c^2$ of the electric repulsion, so the net fraction is $1 - \\beta^2 = 1/\\gamma^2$${ask === 'energy' ? ` with $\\beta = ${b.toFixed(5)}$` : ''}: $${answer}$.`,
          trap: 'The cancellation becomes nearly complete as $v \\to c$, but never exact.' };
      },
      verify: (p) => { const g = gam(p.b); return 1 / (g * g); } },
    { id: 'ced-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'four-vectors',
      make(r) {
        const b = choose(r, [0.6, 0.8, 0.28, 0.96]), g = gam(b), ask = choose(r, ['charge density', 'current density']);
        const val = ask === 'charge density' ? g : g * b, show = (v) => `$${v.toFixed(3)}$`;
        const o = mcqOptions(r, val, [ask === 'charge density' ? 1 / g : b, ask === 'charge density' ? g * g : b / g, ask === 'charge density' ? 1 : g, ask === 'charge density' ? g * b : g * g * b], show);
        return { q: `A charge cloud of rest density $\\rho_0$ moves at $${b}c$. In the lab its ${ask} divided by ${ask === 'charge density' ? '$\\rho_0$' : '$c\\rho_0$'} is`, ...o,
          sol: `$J^\\mu = \\rho_0\\gamma(c, \\vec v)$ with $\\gamma = ${g.toFixed(4)}$: $\\rho = \\gamma\\rho_0$ and $J = \\gamma\\beta c\\rho_0$. So the answer is $${val.toFixed(3)}$.`,
          trap: 'Both components carry one factor of $\\gamma$.' };
      } },
    { id: 'ced-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'moving charge',
      make(r) {
        const who = choose(r, ['proton', 'electron']), T = choose(r, [10, 100, 500, 1000, 5000]), m = who === 'proton' ? MPC2 : 0.51099895;
        const g = 1 + T / m, val = g ** 3, ex = val >= 1e4 ? Math.floor(Math.log10(val)) : 0, show = val / 10 ** ex, answer = round(show, 3);
        return { q: `A${who === 'electron' ? 'n' : ''} ${who} has kinetic energy ${T} MeV. At equal distances from its present position, find the ratio of its electric field perpendicular to the motion to that along the motion${ex ? `, as $N\\times10^{${ex}}$: give $N$` : ''}.`,
          answer, tol: Math.max(0.002, show * 0.005), T, m, ex,
          sol: `$\\gamma = 1 + T/mc^2 = 1 + ${T}/${m} = ${g.toFixed(4)}$. Perpendicular: $\\gamma\\times$ Coulomb; along: $\\gamma^{-2}\\times$ Coulomb. Ratio $\\gamma^3 = ${fmt(val, 4)}$.`,
          trap: 'Find $\\gamma$ from the total energy $T + mc^2$, not from $T$ alone.' };
      },
      verify: (p) => Math.pow((p.T + p.m) / p.m, 3) / 10 ** p.ex },
    ...more,
  ],
};
