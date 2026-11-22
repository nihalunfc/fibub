// Retarded and Liénard-Wiechert potentials, NET depth: velocity and acceleration fields of a point charge, Larmor and
// Liénard powers, angular distributions and beaming, electric and magnetic dipole radiation, antennas and radiation
// resistance, Thomson and Rayleigh scattering, synchrotron and cyclotron losses, radiation reaction, Jefimenko's
// equations. (Gauges, retarded time and the LW potentials themselves are in potentials-gauges.)
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './retarded-potentials.more.gen.js';
import more2 from './retarded-potentials.more2.gen.js';
import r4 from './retarded-potentials.r4.gen.js';

const PI = Math.PI, E = C.e, ME = C.me, EPS = C.eps0, C0 = C.c, MU0 = C.mu0;
const KL = E * E / (6 * PI * EPS * C0 ** 3);          // Larmor coefficient for an electron, W s^4/m^2
const RE = E * E / (4 * PI * EPS * ME * C0 * C0);       // classical electron radius
const TAU = 2 * RE / (3 * C0);                          // radiation-reaction time of the electron
const MEC2 = 0.51099895;                                // MeV

export default {
  topic: 'retarded-potentials',
  items: [
    // ---------- level 1 ----------
    { id: 'netrp-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Liénard-Wiechert fields',
      q: 'The electric field of an arbitrarily moving point charge splits into a "velocity field" and an "acceleration field". Far from the charge, at distance $\\mathscr r$, these fall off as',
      options: ['$1/\\mathscr r$ and $1/\\mathscr r^2$', '$1/\\mathscr r^2$ and $1/\\mathscr r$', 'both as $1/\\mathscr r^2$', '$1/\\mathscr r^2$ and $1/\\mathscr r^3$'], answer: 1,
      sol: 'The velocity (generalised Coulomb) field does not depend on the acceleration and falls as $1/\\mathscr r^2$, like Coulomb\'s law. The acceleration field is proportional to $\\vec a$ and falls as $1/\\mathscr r$. Only the $1/\\mathscr r$ part gives a Poynting flux $\\propto 1/\\mathscr r^2$ whose integral over a large sphere stays finite: that is radiation.',
      trap: 'The order is the other way round from what the names suggest to many students: the acceleration field is the long-range one.' },
    { id: 'netrp-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Larmor formula',
      q: 'A non-relativistic charge $q$ with acceleration $a$ radiates a total power (SI units)',
      options: ['$\\dfrac{q^2a^2}{4\\pi\\epsilon_0c^3}$', '$\\dfrac{q^2a}{6\\pi\\epsilon_0c^2}$', '$\\dfrac{q^2a^2}{6\\pi\\epsilon_0c^3}$', '$\\dfrac{qa^2}{6\\pi\\epsilon_0c^3}$'], answer: 2,
      sol: 'Larmor: $P = \\dfrac{q^2a^2}{6\\pi\\epsilon_0c^3} = \\dfrac{\\mu_0q^2a^2}{6\\pi c}$. Check dimensions: $q^2/\\epsilon_0$ is J m, times $a^2/c^3$ (m$^2$s$^{-4}$ / m$^3$s$^{-3}$ = m$^{-1}$s$^{-1}$) gives J/s.',
      trap: 'The power goes as $q^2$ and $a^2$: the sign of the charge and the direction of the acceleration do not matter.' },
    { id: 'netrp-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'dipole radiation',
      q: 'An oscillating electric dipole $\\vec p = p_0\\cos\\omega t\\,\\hat z$ radiates. In which direction is the radiated intensity zero?',
      options: ['Along the $z$ axis', 'In the $xy$ plane', 'At $45^\\circ$ to the $z$ axis', 'Nowhere: dipole radiation is isotropic'], answer: 0,
      sol: 'The time-averaged intensity is $\\langle S\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{32\\pi^2c}\\dfrac{\\sin^2\\theta}{r^2}$, with $\\theta$ measured from the dipole axis. It vanishes at $\\theta = 0, \\pi$ (along $z$) and is largest in the equatorial plane. The charges cannot radiate along their own line of motion.' },
    { id: 'netrp-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Rayleigh scattering',
      q: 'Small molecules scatter sunlight with intensity proportional to $\\omega^4$. The ratio of the scattered intensity at 400 nm to that at 700 nm (equal incident intensities) is ______ (to two decimal places).',
      answer: 9.38, tol: 0.02, calc: () => (700 / 400) ** 4,
      sol: 'Each molecule is a driven dipole far below resonance, $p_0 \\propto E_0$ independent of $\\omega$, so the radiated power $\\propto p_0^2\\omega^4 \\propto 1/\\lambda^4$. Ratio $= (700/400)^4 = 1.75^4 = 9.38$. Hence the blue sky.',
      trap: 'Using $(700/400)^2 = 3.06$ treats the intensity like a field amplitude.' },
    { id: 'netrp-005', type: 'mcq', level: 1, exams: ['net'], sub: 'Jefimenko',
      q: 'Jefimenko\'s equations give $\\vec E(\\vec r, t)$ from the sources at the retarded time. Compared with the static Coulomb integral, they contain extra terms involving',
      options: ['$\\nabla\\rho$ and $\\nabla\\times\\vec J$ only', 'the advanced charge density', 'the vector potential at the field point', '$\\partial\\rho/\\partial t$ and $\\partial\\vec J/\\partial t$ at the retarded time'], answer: 3,
      sol: '$\\vec E = \\dfrac{1}{4\\pi\\epsilon_0}\\displaystyle\\int\\left[\\dfrac{\\rho(t_r)}{\\mathscr r^2}\\hat{\\mathscr r} + \\dfrac{\\dot\\rho(t_r)}{c\\mathscr r}\\hat{\\mathscr r} - \\dfrac{\\dot{\\vec J}(t_r)}{c^2\\mathscr r}\\right]d\\tau\'$. The time derivatives come from differentiating $t_r = t - \\mathscr r/c$; the $\\dot{\\vec J}$ term falls only as $1/\\mathscr r$ and carries radiation.' },
    { id: 'netrp-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'radiation fields',
      q: 'In the radiation zone of any localised source, the fields $\\vec E$, $\\vec B$ and the unit vector $\\hat r$ towards the observer satisfy',
      options: ['$\\vec B = \\hat r\\times\\vec E/c$, with $\\vec E\\perp\\hat r$', '$\\vec B = \\vec E\\times\\hat r/c$, with $\\vec E\\parallel\\hat r$', '$\\vec B = c\\,\\hat r\\times\\vec E$', '$\\vec B\\parallel\\vec E$'], answer: 0,
      sol: 'Far away the fields look locally like a plane wave travelling along $\\hat r$: $\\vec E\\perp\\hat r$, $\\vec B = \\hat r\\times\\vec E/c$, $|E| = c|B|$, and $\\vec S = \\vec E\\times\\vec B/\\mu_0$ points along $\\hat r$ with magnitude $E^2/\\mu_0c$.' },

    // ---------- level 2 ----------
    { id: 'netrp-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'An electron has an acceleration of $2.0\\times10^{18}$ m s$^{-2}$ (non-relativistic). The power it radiates is ______ $\\times10^{-17}$ W (to two decimal places).',
      answer: 2.28, tol: 0.02, calc: () => KL * 4e36 * 1e17,
      sol: '$\\dfrac{e^2}{6\\pi\\epsilon_0c^3} = \\dfrac{(1.602\\times10^{-19})^2}{6\\pi(8.854\\times10^{-12})(2.998\\times10^8)^3} = 5.71\\times10^{-54}$ W s$^4$/m$^2$. Then $P = 5.71\\times10^{-54}\\times(2.0\\times10^{18})^2 = 2.28\\times10^{-17}$ W.' },
    { id: 'netrp-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      q: 'A short centre-fed antenna of length 1.0 m carries a uniform current oscillating at 15 MHz. Treating it as an ideal Hertzian dipole, its radiation resistance is ______ $\\Omega$ (to two decimal places).',
      answer: 1.97, tol: 0.02, calc: () => 80 * PI * PI * (1 / 20) ** 2,
      sol: 'For a dipole of length $d$ with uniform current $I_0\\cos\\omega t$: $p_0 = I_0d/\\omega$, so $\\langle P\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c} = \\dfrac{\\mu_0I_0^2\\omega^2d^2}{12\\pi c}$. Writing $\\langle P\\rangle = \\tfrac12I_0^2R$ gives $R = \\dfrac{2\\pi}{3}Z_0\\left(\\dfrac{d}{\\lambda}\\right)^2 = 80\\pi^2(d/\\lambda)^2$. Here $\\lambda = c/f = 20$ m, so $R = 789.6/400 = 1.97\\ \\Omega$.',
      trap: 'A real short antenna has current falling to zero at the tips, which cuts $R$ by a factor of 4.' },
    { id: 'netrp-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dipole radiation',
      q: 'A small current loop (magnetic dipole) and a short straight wire (electric dipole) are driven with the same current amplitude $I_0$. If the drive frequency is doubled, keeping $I_0$ fixed, their radiated powers change by factors of',
      options: ['16 (loop) and 16 (wire)', '4 (loop) and 16 (wire)', '16 (loop) and 4 (wire)', '4 (loop) and 4 (wire)'], answer: 2,
      sol: 'Magnetic dipole: $m_0 = I_0\\pi b^2$ does not depend on $\\omega$, and $P_m = \\mu_0m_0^2\\omega^4/12\\pi c^3$, so $P\\propto\\omega^4$: factor 16. Electric dipole: $p_0 = I_0d/\\omega$, so $P_e\\propto p_0^2\\omega^4\\propto\\omega^2$: factor 4.',
      trap: 'The $\\omega^4$ law holds at fixed dipole moment, not at fixed current.' },
    { id: 'netrp-010', type: 'mcq', level: 2, exams: ['net'], sub: 'Thomson scattering',
      q: 'The Thomson cross-section of a free charge $q$ of mass $m$ is $\\sigma_T = \\dfrac{8\\pi}{3}\\left(\\dfrac{q^2}{4\\pi\\epsilon_0mc^2}\\right)^2$. How does the cross-section of a free proton compare with that of a free electron?',
      options: ['Equal, since the charges are equal in size', 'Larger by $m_p/m_e$', 'Smaller by $m_e/m_p$', 'Smaller by $(m_e/m_p)^2\\approx3\\times10^{-7}$'], answer: 3,
      sol: 'The driven charge has acceleration $qE_0/m$, so the scattered power goes as $q^4/m^2$: $\\sigma\\propto(q^2/m)^2$. For the proton $\\sigma_p/\\sigma_e = (m_e/m_p)^2 = (1/1836)^2 = 2.97\\times10^{-7}$. In a plasma it is the electrons that scatter light.' },
    { id: 'netrp-011', type: 'nat', level: 2, exams: ['net'], sub: 'Thomson scattering',
      q: 'A laser of intensity $1.0\\times10^{16}$ W m$^{-2}$ (non-relativistic regime) falls on a free electron. The power it scatters is ______ $\\times10^{-13}$ W (to two decimal places). ($\\sigma_T = 6.652\\times10^{-29}$ m$^2$.)',
      answer: 6.65, tol: 0.02, calc: () => 8 * PI / 3 * RE * RE * 1e16 * 1e13,
      sol: 'Scattered power $= \\sigma_TI = 6.652\\times10^{-29}\\times1.0\\times10^{16} = 6.65\\times10^{-13}$ W. The cross-section follows from the Larmor power of the driven electron, $\\langle P\\rangle = \\dfrac{e^2}{6\\pi\\epsilon_0c^3}\\dfrac{e^2E_0^2}{2m^2}$, divided by $I = \\tfrac12c\\epsilon_0E_0^2$.' },
    { id: 'netrp-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'which systems radiate',
      q: 'Which of these radiate electromagnetic energy to infinity?',
      options: ['A point charge moving with constant velocity', 'A point charge moving in a circle at constant speed', 'A steady current in a circular loop', 'An electric dipole whose moment rotates at constant angular velocity in a plane'], answer: [1, 3],
      sol: 'Radiation needs acceleration (more generally, time-varying $\\ddot{\\vec p}$, $\\ddot{\\vec m}$, ...). Uniform motion: no acceleration, and its fields are a boosted Coulomb field. Circular motion: centripetal acceleration, so it radiates. A steady current: the charge distribution and current are static, so the fields are static. A rotating dipole has $\\ddot{\\vec p}\\neq0$ and radiates.',
      trap: 'In the steady loop each charge accelerates, but the continuous distribution produces time-independent fields.' },
    { id: 'netrp-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'polarisation of radiation',
      q: 'Radiation from an electric dipole oscillating along $z$ is observed at a point in the $xy$ plane. Its electric field is',
      options: ['linearly polarised along $z$', 'circularly polarised', 'linearly polarised along the line of sight', 'unpolarised'], answer: 0,
      sol: 'The radiation field is $\\vec E\\propto\\hat r\\times(\\hat r\\times\\ddot{\\vec p})$, the part of $\\ddot{\\vec p}$ perpendicular to $\\hat r$, so it lies in the plane of $\\vec p$ and $\\hat r$ and is perpendicular to $\\hat r$. In the equatorial plane that is $\\pm\\hat z$ (precisely $-\\hat\\theta$): linear polarisation along the dipole.' },
    { id: 'netrp-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'antenna directivity',
      q: 'For a Hertzian dipole, the ratio of the maximum radiated intensity to the intensity averaged over all directions (the directivity) is ______ (to one decimal place).',
      answer: 1.5, tol: 0.01, calc: () => 1 / (2 / 3),
      sol: 'Intensity $\\propto\\sin^2\\theta$. Its average over the sphere is $\\dfrac{1}{4\\pi}\\displaystyle\\int\\sin^2\\theta\\,d\\Omega = \\dfrac12\\int_0^\\pi\\sin^3\\theta\\,d\\theta = \\dfrac12\\cdot\\dfrac43 = \\dfrac23$. The maximum is 1, so the directivity is $1/(2/3) = 1.5$.' },
    { id: 'netrp-015', type: 'mcq', level: 2, exams: ['net'], sub: 'retarded and advanced solutions',
      q: 'The inhomogeneous wave equation $\\Box^2V = -\\rho/\\epsilon_0$ is solved both by the retarded potential (source at $t - \\mathscr r/c$) and the advanced potential (source at $t + \\mathscr r/c$). The advanced solution is normally discarded because',
      options: ['it does not satisfy the Lorenz gauge condition', 'it would let the field depend on what the source will do in the future, against causality', 'it is not Lorentz invariant', 'it diverges at large distances'], answer: 1,
      sol: 'Both satisfy the wave equation and the Lorenz condition (given charge conservation), and both are Lorentz covariant. The choice is a boundary condition in time: we demand no incoming radiation from infinity, so effects follow causes. (Wheeler-Feynman absorber theory uses half-advanced plus half-retarded, but that is not the standard choice.)' },
    { id: 'netrp-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'radiation fields',
      q: 'An electron has acceleration $1.0\\times10^{21}$ m s$^{-2}$ at the retarded time and moves slowly. The magnitude of its radiation electric field 1.0 m away, in the direction perpendicular to the acceleration, is ______ $\\mu$V/m (to two decimal places).',
      answer: 16.02, tol: 0.05, calc: () => E / (4 * PI * EPS * C0 * C0) * 1e21 * 1e6,
      sol: 'Non-relativistically $E_{rad} = \\dfrac{qa\\sin\\theta}{4\\pi\\epsilon_0c^2\\mathscr r}$. With $\\theta = 90^\\circ$: $\\dfrac{1.602\\times10^{-19}\\times8.988\\times10^9\\times10^{21}}{(2.998\\times10^8)^2\\times1} = 1.602\\times10^{-5}$ V/m $= 16.02\\ \\mu$V/m.' },

    // ---------- level 3 ----------
    { id: 'netrp-017', type: 'mcq', level: 3, exams: ['net'], sub: 'Liénard formula',
      q: 'A charge moving at speed $v$ ($\\gamma = (1 - v^2/c^2)^{-1/2}$) has acceleration of fixed magnitude $a$. The ratio of the power it radiates when $\\vec a\\parallel\\vec v$ to the power when $\\vec a\\perp\\vec v$ is',
      options: ['$1$', '$\\gamma^4$', '$\\gamma^{-2}$', '$\\gamma^2$'], answer: 3,
      sol: 'Liénard: $P = \\dfrac{q^2\\gamma^6}{6\\pi\\epsilon_0c^3}\\left(a^2 - \\dfrac{|\\vec v\\times\\vec a|^2}{c^2}\\right)$. Parallel: $P = Ka^2\\gamma^6$. Perpendicular: $a^2(1 - \\beta^2) = a^2/\\gamma^2$, so $P = Ka^2\\gamma^4$. Ratio $\\gamma^2$.',
      trap: 'At equal force (not equal acceleration) the answer reverses, since a parallel force produces $\\gamma^2$ times less acceleration: $dp/dt = \\gamma^3ma$ (parallel) vs $\\gamma ma$ (perpendicular).' },
    { id: 'netrp-018', type: 'nat', level: 3, exams: ['net'], sub: 'synchrotron radiation',
      q: 'Electrons of energy 3.0 GeV circulate in a ring of bending radius 10 m. Using $\\Delta E\\,[\\text{keV}] = 88.46\\,E^4[\\text{GeV}]/R\\,[\\text{m}]$, the energy each electron loses per turn is ______ keV (to the nearest whole number).',
      answer: 717, tol: 1, calc: () => 88.46 * 81 / 10,
      sol: 'For $\\beta\\approx1$ the Liénard power with $a\\perp v$ is $P = \\dfrac{e^2c\\gamma^4}{6\\pi\\epsilon_0R^2}$, and one turn takes $2\\pi R/c$, giving $\\Delta E = \\dfrac{e^2\\gamma^4}{3\\epsilon_0R}$, which is the quoted rule. $\\Delta E = 88.46\\times3^4/10 = 88.46\\times8.1 = 717$ keV.',
      trap: 'The loss grows as $E^4$: doubling the energy at the same radius costs 16 times more RF power.' },
    { id: 'netrp-019', type: 'nat', level: 3, exams: ['net'], sub: 'radiation reaction',
      q: 'The Abraham-Lorentz force on an electron is $\\vec F = m\\tau\\dot{\\vec a}$ with $\\tau = \\dfrac{e^2}{6\\pi\\epsilon_0mc^3}$. The value of $\\tau$ is ______ $\\times10^{-24}$ s (to two decimal places).',
      answer: 6.27, tol: 0.02, calc: () => TAU * 1e24,
      sol: '$\\tau = \\dfrac{2}{3}\\dfrac{r_e}{c}$ with $r_e = \\dfrac{e^2}{4\\pi\\epsilon_0mc^2} = 2.818\\times10^{-15}$ m: $\\tau = \\dfrac{2\\times2.818\\times10^{-15}}{3\\times2.998\\times10^8} = 6.27\\times10^{-24}$ s, the time light takes to cross about a classical electron radius. Radiation reaction matters only for motions that change on this time scale.' },
    { id: 'netrp-020', type: 'nat', level: 3, exams: ['net'], sub: 'classical atom',
      q: 'A classical electron in a circular orbit at the Bohr radius $a_0 = 0.529$ Å (speed $2.19\\times10^6$ m/s) radiates according to Larmor. Its radiated power is ______ $\\times10^{-8}$ W (to two decimal places).',
      answer: 4.67, tol: 0.03, calc: () => KL * (2.18769126e6 ** 2 / 5.29177210903e-11) ** 2 * 1e8,
      sol: 'Centripetal acceleration $a = v^2/r = (2.19\\times10^6)^2/(5.29\\times10^{-11}) = 9.05\\times10^{22}$ m/s$^2$. $P = 5.71\\times10^{-54}\\times(9.05\\times10^{22})^2 = 4.67\\times10^{-8}$ W. The orbital energy is only 13.6 eV $= 2.2\\times10^{-18}$ J, so a classical atom would collapse in about $10^{-11}$ s.' },
    { id: 'netrp-021', type: 'nat', level: 3, exams: ['net'], sub: 'uniform motion',
      q: 'A charge moves uniformly at $0.80c$. At equal distances from its present position, the ratio of the electric field strength perpendicular to the motion to that straight ahead is ______ (to two decimal places).',
      answer: 4.63, tol: 0.02, calc: () => (1 / 0.6) ** 3,
      sol: 'For uniform motion $\\vec E = \\dfrac{q}{4\\pi\\epsilon_0}\\dfrac{1 - \\beta^2}{(1 - \\beta^2\\sin^2\\theta)^{3/2}}\\dfrac{\\hat R}{R^2}$, pointing from the present position. Ahead ($\\theta = 0$): factor $1 - \\beta^2 = 1/\\gamma^2$. Sideways: $1/\\sqrt{1 - \\beta^2} = \\gamma$. Ratio $\\gamma^3 = (5/3)^3 = 4.63$.',
      trap: 'The field is compressed into a pancake: weaker ahead and behind, stronger sideways.' },
    { id: 'netrp-022', type: 'mcq', level: 3, exams: ['net'], sub: 'Liénard-Wiechert fields',
      q: 'A charge moves on a straight line with acceleration parallel to its velocity (bremsstrahlung geometry, any speed). Its acceleration (radiation) field vanishes',
      options: ['in the plane perpendicular to the motion', 'nowhere', 'only straight ahead', 'straight ahead and straight behind, along the line of motion'], answer: 3,
      sol: 'The acceleration field is $\\propto\\hat{\\mathscr r}\\times[(\\hat{\\mathscr r} - \\vec\\beta)\\times\\vec a]$. With $\\vec\\beta$ and $\\vec a$ both along the line, for $\\hat{\\mathscr r}$ along the line $(\\hat{\\mathscr r} - \\vec\\beta)\\times\\vec a = 0$. So there is no radiation along the axis of motion at any speed, while the peak tilts forward as $\\beta\\to1$.' },
    { id: 'netrp-023', type: 'mcq', level: 3, exams: ['net'], sub: 'beaming',
      q: 'For an ultra-relativistic charge with Lorentz factor $\\gamma$, most of the radiated power is concentrated in a forward cone whose half-angle is about',
      options: ['$1/\\gamma^2$', '$1/\\gamma$', '$1/\\sqrt\\gamma$', '$\\pi/4$, independent of $\\gamma$'], answer: 1,
      sol: 'In the instantaneous rest frame the emission is the dipole pattern. Aberration maps the rest-frame angle $90^\\circ$ to $\\sin\\theta = 1/\\gamma$ in the lab, so half the photons fall within $\\theta\\approx1/\\gamma$. The factor $(1 - \\beta\\cos\\theta)^{-n}$ in the Liénard-Wiechert angular distribution peaks over the same range since $1 - \\beta\\cos\\theta\\approx(1/\\gamma^2 + \\theta^2)/2$.' },
    { id: 'netrp-024', type: 'nat', level: 3, exams: ['net'], sub: 'cyclotron radiation',
      q: 'A slow electron gyrates in a uniform field of 1.0 T. Its kinetic energy decays exponentially through cyclotron radiation, with time constant $\\tau_E = \\dfrac{3\\pi\\epsilon_0m^3c^3}{e^4B^2}$. The value of $\\tau_E$ is ______ s (to two decimal places).',
      answer: 2.58, tol: 0.02, calc: () => 3 * PI * EPS * ME ** 3 * C0 ** 3 / E ** 4,
      sol: 'Larmor with $a = \\omega_cv = eBv/m$: $P = \\dfrac{e^2}{6\\pi\\epsilon_0c^3}\\dfrac{e^2B^2v^2}{m^2} = \\dfrac{e^4B^2}{3\\pi\\epsilon_0m^3c^3}K$ with $K = \\tfrac12mv^2$. So $dK/dt = -K/\\tau_E$. Numerically $\\tau_E = \\dfrac{3\\pi(8.854\\times10^{-12})(9.109\\times10^{-31})^3(2.998\\times10^8)^3}{(1.602\\times10^{-19})^4} = 2.58$ s; it scales as $1/B^2$.' },
    { id: 'netrp-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Liénard-Wiechert fields',
      q: 'For the complete Liénard-Wiechert fields of a point charge in arbitrary motion, which statements are correct?',
      options: ['$\\vec B = \\hat{\\mathscr r}\\times\\vec E/c$ holds for the whole field, with $\\hat{\\mathscr r}$ from the retarded position', 'The velocity field points from the retarded position of the charge', 'For uniform motion the velocity field points from the present position', 'The acceleration field is perpendicular to $\\hat{\\mathscr r}$'], answer: [0, 2, 3],
      sol: 'Griffiths\' result $\\vec B = \\tfrac1c\\hat{\\mathscr r}\\times\\vec E$ holds for both parts. The velocity field points along $\\vec u = c\\hat{\\mathscr r} - \\vec v$, which is the direction from the position the charge would have now had it kept moving uniformly: for uniform motion that is the present position, not the retarded one. The acceleration field $\\propto\\hat{\\mathscr r}\\times(\\vec u\\times\\vec a)$ is perpendicular to $\\hat{\\mathscr r}$.',
      trap: 'The field of a uniformly moving charge "knows" where the charge is now, even though the information left it at the retarded time.' },
    { id: 'netrp-026', type: 'nat', level: 3, exams: ['net'], sub: 'classical damping',
      q: 'A classical electron oscillator (Lorentz model) with natural wavelength 500 nm loses energy by radiation at the rate $\\Gamma = \\omega_0^2\\tau$, where $\\tau = 6.27\\times10^{-24}$ s. Its classical radiative lifetime $1/\\Gamma$ is ______ ns (to one decimal place).',
      answer: 11.2, tol: 0.1, calc: () => 1 / ((2 * PI * C0 / 5e-7) ** 2 * TAU) * 1e9,
      sol: '$\\omega_0 = 2\\pi c/\\lambda = 3.767\\times10^{15}$ s$^{-1}$, so $\\omega_0^2\\tau = 1.419\\times10^{31}\\times6.27\\times10^{-24} = 8.89\\times10^7$ s$^{-1}$ and $1/\\Gamma = 11.2$ ns. (Averaged Larmor power $m\\tau\\omega_0^4x_0^2/2$ divided by the energy $m\\omega_0^2x_0^2/2$.) Real allowed atomic transitions in the visible have lifetimes of a few to tens of ns: the classical estimate is close.' },
    { id: 'netrp-027', type: 'mcq', level: 3, exams: ['net'], sub: 'rotating dipole',
      q: 'A dipole of fixed magnitude rotates in the $xy$ plane, $\\vec p = p_0(\\cos\\omega t\\,\\hat x + \\sin\\omega t\\,\\hat y)$. Compared with a dipole $p_0\\cos\\omega t\\,\\hat x$, its total radiated power and the polarisation seen on the $z$ axis are',
      options: ['the same power; linear polarisation', 'twice the power; circular polarisation', 'twice the power; linear polarisation', 'four times the power; circular polarisation'], answer: 1,
      sol: 'The rotating dipole is two dipoles of amplitude $p_0$ along $x$ and $y$, $90^\\circ$ out of phase. Their cross terms average to zero, so the power is $2\\times\\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$. On the $z$ axis both components are seen fully, equal and in quadrature: circular polarisation. The pattern is $\\propto(1 + \\cos^2\\theta)$.' },
    { id: 'netrp-028', type: 'nat', level: 3, exams: ['net'], sub: 'near and far zones',
      q: 'A non-relativistic electron with acceleration $1.0\\times10^{16}$ m s$^{-2}$ is observed perpendicular to its acceleration. Beyond what distance (in m) does its acceleration field exceed its velocity (Coulomb) field? Answer to two decimal places.',
      answer: 8.99, tol: 0.02, calc: () => C0 * C0 / 1e16,
      sol: 'Coulomb part: $\\dfrac{q}{4\\pi\\epsilon_0\\mathscr r^2}$. Acceleration part at $90^\\circ$: $\\dfrac{qa}{4\\pi\\epsilon_0c^2\\mathscr r}$. They are equal at $\\mathscr r = c^2/a = (2.998\\times10^8)^2/10^{16} = 8.99$ m.' },

    // ---------- level 4 ----------
    { id: 'netrp-029', type: 'nat', level: 4, exams: ['net'], sub: 'classical atom',
      q: 'A classical hydrogen atom spirals in from $r = a_0$ (0.529 Å) to $r = 0$ while radiating by Larmor\'s formula in quasi-circular orbits. The collapse time $t = \\dfrac{a_0^3}{4r_e^2c}$ is ______ $\\times10^{-11}$ s (to two decimal places). ($r_e = 2.818\\times10^{-15}$ m.)',
      answer: 1.56, tol: 0.02, calc: () => 5.29177210903e-11 ** 3 / (4 * RE * RE * C0) * 1e11,
      sol: 'With $E = -\\dfrac{e^2}{8\\pi\\epsilon_0r}$ and $a = \\dfrac{e^2}{4\\pi\\epsilon_0mr^2}$, energy balance $dE/dt = -P$ gives $\\dfrac{dr}{dt} = -\\dfrac{4r_e^2c}{3r^2}$. Integrating, $t = \\dfrac{a_0^3}{4r_e^2c} = \\dfrac{1.482\\times10^{-31}}{4\\times7.94\\times10^{-30}\\times2.998\\times10^8} = 1.56\\times10^{-11}$ s. This is the classic failure that quantum mechanics fixes.' },
    { id: 'netrp-030', type: 'nat', level: 4, exams: ['net'], sub: 'bremsstrahlung',
      q: 'An electron moving at $1.0\\times10^7$ m/s is stopped uniformly over a distance of 1.0 nm. The fraction of its kinetic energy radiated (Larmor) is $f = \\tau v/d$ with $\\tau = 6.27\\times10^{-24}$ s. The value of $f$ is ______ $\\times10^{-8}$ (to two decimal places).',
      answer: 6.27, tol: 0.03, calc: () => TAU * 1e7 / 1e-9 * 1e8,
      sol: 'Uniform deceleration $a = v^2/2d$ over time $t = 2d/v$. Energy radiated $= \\dfrac{e^2a^2t}{6\\pi\\epsilon_0c^3} = m\\tau\\dfrac{v^4}{4d^2}\\dfrac{2d}{v} = \\dfrac{m\\tau v^3}{2d}$. Dividing by $\\tfrac12mv^2$: $f = \\tau v/d = 6.27\\times10^{-24}\\times10^{7}/10^{-9} = 6.27\\times10^{-8}$. Bremsstrahlung by slow electrons is a tiny loss.' },
    { id: 'netrp-031', type: 'nat', level: 4, exams: ['net'], sub: 'linear accelerators',
      q: 'In a linac an electron ($\\beta\\approx1$) gains energy at 10 MeV per metre. For linear motion $P = \\dfrac{e^2}{6\\pi\\epsilon_0m^2c^3}\\left(\\dfrac{dp}{dt}\\right)^2$. The ratio of radiated power to the rate of energy gain is ______ $\\times10^{-14}$ (to two decimal places).',
      answer: 3.68, tol: 0.03, calc: () => 2 * RE / 3 * 10 / MEC2 * 1e14,
      sol: 'With $v\\approx c$, $dp/dt = dE/dx$ and $dE/dt = c\\,dE/dx$. Ratio $= \\dfrac{e^2}{6\\pi\\epsilon_0m^2c^3}\\dfrac{(dE/dx)^2}{c\\,dE/dx} = \\dfrac{2}{3}r_e\\dfrac{dE/dx}{mc^2} = \\dfrac23(2.818\\times10^{-15}\\text{ m})\\dfrac{10\\text{ MeV/m}}{0.511\\text{ MeV}} = 3.68\\times10^{-14}$. Linear acceleration radiates negligibly, unlike bending.',
      trap: 'The $\\gamma^6$ in the Liénard formula is cancelled when it is written with $dp/dt = \\gamma^3ma$.' },
    { id: 'netrp-032', type: 'mcq', level: 4, exams: ['net'], sub: 'synchrotron radiation',
      q: 'Protons and electrons are stored at the same total energy $E\\gg m_pc^2$ in rings of the same radius. The ratio of the synchrotron power of an electron to that of a proton is about',
      options: ['$1.8\\times10^3$', '$3.4\\times10^6$', '$1.1\\times10^{13}$', '$6.2\\times10^9$'], answer: 2,
      sol: 'For $\\beta\\approx1$ on a circle $P = \\dfrac{e^2c\\gamma^4}{6\\pi\\epsilon_0R^2}$ with $\\gamma = E/mc^2$. At equal $E$ and $R$, $P\\propto m^{-4}$: $(m_p/m_e)^4 = 1836.15^4 = 1.1\\times10^{13}$. That is why LHC can bend 7 TeV protons in a ring where electrons would lose everything.',
      trap: '$3.4\\times10^6 = (m_p/m_e)^2$ is the ratio at equal acceleration (Larmor), not at equal energy.' },
    { id: 'netrp-033', type: 'mcq', level: 4, exams: ['net'], sub: 'Liénard formula',
      q: 'Which expression for the radiated power of a charge in arbitrary motion is Lorentz invariant and reduces to Larmor\'s formula when $v\\ll c$? ($p^\\mu$ is the four-momentum, $\\tau$ proper time, metric $(+,-,-,-)$.)',
      options: ['$P = \\dfrac{q^2}{6\\pi\\epsilon_0m^2c^3}\\dfrac{dp_\\mu}{d\\tau}\\dfrac{dp^\\mu}{d\\tau}$', '$P = -\\dfrac{q^2}{6\\pi\\epsilon_0m^2c^3}\\dfrac{dp_\\mu}{d\\tau}\\dfrac{dp^\\mu}{d\\tau}$', '$P = \\dfrac{q^2}{6\\pi\\epsilon_0m^2c^3}\\left|\\dfrac{d\\vec p}{dt}\\right|^2$', '$P = \\dfrac{q^2\\gamma^2a^2}{6\\pi\\epsilon_0c^3}$'], answer: 1,
      sol: 'With $(+,-,-,-)$, $\\dfrac{dp_\\mu}{d\\tau}\\dfrac{dp^\\mu}{d\\tau} = \\dfrac{1}{c^2}\\left(\\dfrac{dE}{d\\tau}\\right)^2 - \\left|\\dfrac{d\\vec p}{d\\tau}\\right|^2$, which is negative (the four-acceleration is spacelike). At low speed $dE/d\\tau\\to0$ and $d\\vec p/d\\tau\\to m\\vec a$, so the minus sign gives $+q^2a^2/6\\pi\\epsilon_0c^3$. The other forms are either negative or not invariant.' },
    { id: 'netrp-034', type: 'nat', level: 4, exams: ['net'], sub: 'antennas',
      q: 'A short dipole antenna with uniform current has radiation resistance $R = 80\\pi^2(d/\\lambda)^2$. What length gives $R = 5.0\\ \\Omega$ at 300 MHz? Answer in cm to two decimal places.',
      answer: 7.95, tol: 0.03, calc: () => C0 / 3e8 * Math.sqrt(5 / (80 * PI * PI)) * 100,
      sol: '$\\lambda = c/f = 2.998\\times10^8/3.00\\times10^8 = 0.9993$ m. $(d/\\lambda)^2 = 5.0/(80\\pi^2) = 6.333\\times10^{-3}$, so $d/\\lambda = 0.0796$ and $d = 0.0796\\times0.9993$ m $= 7.95$ cm. Since $d/\\lambda\\approx0.08$ is small, the Hertzian-dipole formula is still a fair approximation.',
      trap: 'Forgetting the square root gives $d/\\lambda = 6.3\\times10^{-3}$, an antenna under a centimetre.' },
    { id: 'netrp-035', type: 'mcq', level: 4, exams: ['net'], sub: 'multipole radiation',
      q: 'For radiation by an atom (size $a\\sim a_0$, wavelength $\\lambda\\gg a$), the magnetic dipole and electric quadrupole rates compared with an allowed electric dipole rate are suppressed by roughly',
      options: ['$(ka)^2$ with $k = 2\\pi/\\lambda$: about $10^{-5}$ to $10^{-7}$', '$ka$: about $10^{-3}$', '$1/(ka)$: they are stronger', 'nothing: all three are comparable'], answer: 0,
      sol: 'Each higher multipole carries an extra factor $ka = 2\\pi a/\\lambda$ in amplitude, so $(ka)^2$ in rate. Magnetic dipole: $m\\sim eva$ compared with $p\\sim ea$ gives $(m/c)/p\\sim v/c\\sim\\alpha$, so the rate ratio is $\\sim\\alpha^2\\approx5\\times10^{-5}$. For visible light $ka\\sim2\\pi\\times0.05/500\\sim10^{-3}$, giving quadrupole ratios $\\sim10^{-6}$. These are the "forbidden" lines.' },
    { id: 'netrp-036', type: 'msq', level: 4, exams: ['net'], sub: 'radiation reaction',
      q: 'Which statements about the Abraham-Lorentz equation $m\\vec a = \\vec F_{ext} + m\\tau\\dot{\\vec a}$ are correct?',
      options: ['With $\\vec F_{ext} = 0$ it has runaway solutions $a\\propto e^{t/\\tau}$', 'Removing runaways by a boundary condition makes the charge start accelerating about $\\tau$ before the force acts (preacceleration)', 'The reaction force is proportional to the velocity, like friction', 'Averaged over a periodic motion, the work done by the reaction force equals minus the Larmor energy radiated'], answer: [0, 1, 3],
      sol: 'The equation is third order in $x$: $\\dot a = a/\\tau$ for zero force gives runaways. Demanding $a\\to0$ as $t\\to\\infty$ leads to an integro-differential form in which the response begins before the force (by $\\sim\\tau$), violating strict causality on a $10^{-24}$ s scale. The force is $\\propto\\dot{\\vec a}$, not $\\vec v$. It is built so that $\\int m\\tau\\dot{\\vec a}\\cdot\\vec v\\,dt = -\\int m\\tau a^2dt$ when the boundary terms vanish (periodic motion), matching Larmor.' },
    { id: 'netrp-037', type: 'nat', level: 5, exams: ['net'], sub: 'synchrotron radiation',
      q: 'The critical frequency of synchrotron radiation is $\\omega_c = \\tfrac32\\gamma^3c/R$. For 3.0 GeV electrons on a 10 m bending radius, the critical photon energy $\\hbar\\omega_c$ is ______ keV (to one decimal place).',
      answer: 6.0, tol: 0.05, calc: () => 1.054571817e-34 * 1.5 * (3000 / MEC2) ** 3 * C0 / 10 / E / 1e3,
      sol: '$\\gamma = 3000/0.511 = 5871$, $\\gamma^3 = 2.024\\times10^{11}$. $\\omega_c = 1.5\\times2.024\\times10^{11}\\times2.998\\times10^8/10 = 9.10\\times10^{18}$ s$^{-1}$. $\\hbar\\omega_c = 1.0546\\times10^{-34}\\times9.10\\times10^{18}$ J $= 9.60\\times10^{-16}$ J $= 5.99$ keV, so 6.0 keV: hard X-rays. One $\\gamma$ comes from the rotation frequency $c/R$, and $\\gamma^2$ more from the $1/\\gamma$ beaming cone compressed by the Doppler factor $1 - \\beta\\approx1/2\\gamma^2$.',
      trap: 'Taking the orbital frequency $c/R$ as the emitted frequency misses a factor of order $\\gamma^3\\sim10^{11}$.' },
    { id: 'netrp-038', type: 'mcq', level: 5, exams: ['net'], sub: 'bremsstrahlung',
      q: 'For a charge accelerating along its velocity at speed $\\beta c$, $dP/d\\Omega\\propto\\dfrac{\\sin^2\\theta}{(1 - \\beta\\cos\\theta)^5}$, which peaks at $\\cos\\theta_{max} = \\dfrac{\\sqrt{1 + 15\\beta^2} - 1}{3\\beta}$. At $\\beta = 0.5$ the peak is at about',
      options: ['$90^\\circ$', '$60^\\circ$', '$38^\\circ$', '$15^\\circ$'], answer: 2,
      sol: '$\\sqrt{1 + 15\\times0.25} = \\sqrt{4.75} = 2.179$. $\\cos\\theta_{max} = (2.179 - 1)/1.5 = 0.786$, so $\\theta_{max} = 38.2^\\circ$. As $\\beta\\to0$ the formula gives $90^\\circ$ (Larmor\'s $\\sin^2\\theta$), and as $\\beta\\to1$ it tends to $1/2\\gamma$.' },
    { id: 'netrp-039', type: 'nat', level: 5, exams: ['net'], sub: 'Liénard formula',
      q: 'The same magnitude of force acts on an electron of Lorentz factor $\\gamma = 3$, once along its velocity and once perpendicular to it. The ratio of radiated power (perpendicular case to parallel case) is ______.',
      answer: 9, tol: 0, calc: () => 3 * 3,
      sol: 'Parallel: $F = dp/dt = \\gamma^3ma$, so $a = F/\\gamma^3m$ and $P\\propto\\gamma^6a^2 = F^2/m^2$. Perpendicular: $F = \\gamma ma$, $a = F/\\gamma m$, and $P\\propto\\gamma^4a^2 = \\gamma^2F^2/m^2$. Ratio $= \\gamma^2 = 9$. Bending a beam costs far more radiation than pushing it along.',
      trap: 'At equal acceleration the parallel case radiates more ($\\gamma^2$ times); at equal force it is the other way round.' },
    { id: 'netrp-040', type: 'msq', level: 5, exams: ['net'], sub: 'Liénard-Wiechert potentials',
      q: 'The Liénard-Wiechert potential $V = \\dfrac{q}{4\\pi\\epsilon_0(\\mathscr r - \\vec{\\mathscr r}\\cdot\\vec v/c)}$ is evaluated at the retarded time. Which statements are correct?',
      options: ['The factor $1/(1 - \\hat{\\mathscr r}\\cdot\\vec v/c)$ is geometric: the retarded integral counts a moving source over a stretched or shrunk region', 'It survives in the point limit of any rigid extended charge, so it is not an artefact of point charges', 'The LW potentials satisfy the Lorenz gauge condition', 'If the charge is momentarily at rest at the retarded time, $V$ is the Coulomb potential of its present position'], answer: [0, 1, 2],
      sol: 'The retarded integral $\\int\\rho(\\vec r\\,\', t_r)d\\tau\'$ over a moving source counts it over a stretched (approaching) or shrunk (receding) region; the factor $1/(1 - \\hat{\\mathscr r}\\cdot\\vec v/c)$ does not vanish as the size goes to zero. Being retarded solutions of the Lorenz-gauge wave equations, they satisfy the Lorenz condition. With $\\vec v(t_r) = 0$, $V = q/4\\pi\\epsilon_0\\mathscr r$ uses the retarded distance, not the present one (an accelerating charge has moved since).' },
    { id: 'netrp-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      q: 'The radiation resistance of a thin half-wave dipole antenna is closest to',
      options: ['$377\\ \\Omega$', '$36.5\\ \\Omega$', '$73\\ \\Omega$', '$789\\ \\Omega$'], answer: 2,
      sol: 'With a sinusoidal current distribution along the half-wave dipole, the radiated power integral gives $R\\approx73\\ \\Omega$. $377\\ \\Omega$ is the impedance of free space, $36.5\\ \\Omega$ the quarter-wave monopole over a ground plane (half of 73), and $80\\pi^2\\approx789\\ \\Omega$ the Hertzian-dipole coefficient, valid only for $d\\ll\\lambda$.' },
    { id: 'netrp-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipole radiation',
      q: 'A dipole $p_0\\cos\\omega t$ with $p_0 = 2.0\\times10^{-9}$ C m oscillates at 100 MHz. Its time-averaged intensity at 100 m, $30^\\circ$ from the dipole axis, is ______ mW m$^{-2}$ (to two decimal places).',
      answer: 0.21, tol: 0.005, calc: () => MU0 * 4e-18 * (2 * PI * 1e8) ** 4 * 0.25 / (32 * PI * PI * C0 * 1e4) * 1e3,
      sol: '$\\langle S\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{32\\pi^2c}\\dfrac{\\sin^2\\theta}{r^2}$. $\\omega^4 = (6.283\\times10^8)^4 = 1.558\\times10^{35}$; $\\mu_0p_0^2\\omega^4 = 1.257\\times10^{-6}\\times4\\times10^{-18}\\times1.558\\times10^{35} = 7.83\\times10^{11}$. Divide by $32\\pi^2c = 9.47\\times10^{10}$: 8.27. Times $\\sin^2 30^\\circ/r^2 = 0.25/10^4$: $2.07\\times10^{-4}$ W/m$^2$ = 0.21 mW/m$^2$. Check $r\\gg\\lambda = 3$ m: far zone.' },
    { id: 'netrp-043', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipole radiation',
      q: 'For any localised charge distribution with dipole moment $\\vec p(t)$, the instantaneous electric-dipole radiated power is',
      options: ['$\\dfrac{\\mu_0|\\dot{\\vec p}|^2}{6\\pi c}$', '$\\dfrac{\\mu_0|\\ddot{\\vec p}|^2}{12\\pi c}$', '$\\dfrac{\\mu_0|\\vec p|^2\\omega^4}{6\\pi c^3}$', '$\\dfrac{\\mu_0|\\ddot{\\vec p}|^2}{6\\pi c}$'], answer: 3,
      sol: 'For one charge $\\ddot{\\vec p} = q\\vec a$ and Larmor gives $\\mu_0q^2a^2/6\\pi c$; the general result replaces $q\\vec a$ by $\\ddot{\\vec p}$ at the retarded time. For $p_0\\cos\\omega t$ the time average of $\\ddot p^2$ is $p_0^2\\omega^4/2$, giving the familiar $\\mu_0p_0^2\\omega^4/12\\pi c$: the $12\\pi$ is the averaged form, not the instantaneous one.' },
    { id: 'netrp-044', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'An electron and a proton sit in the same uniform electric field (non-relativistic). The ratio of the power radiated by the electron to that radiated by the proton is ______ $\\times10^6$ (to two decimal places). ($m_p/m_e = 1836.15$.)',
      answer: 3.37, tol: 0.01, calc: () => 1836.15267 ** 2 / 1e6,
      sol: 'Equal force $eE$, so $a = eE/m$ and $P\\propto q^2a^2\\propto1/m^2$. Ratio $= (m_p/m_e)^2 = 1836.15^2 = 3.37\\times10^6$.',
      trap: 'At the same acceleration (not the same field) the two would radiate equally.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'netrp-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      make(r) {
        const P = choose(r, [['An electron', 1, ME], ['A proton', 1, C.mp], ['An alpha particle', 2, 6.6446573357e-27]]);
        const ex = int(r, 17, 21), m = choose(r, [1, 2, 3, 5]), a = m * 10 ** ex;
        const val = (P[1] * E) ** 2 * a * a / (6 * PI * EPS * C0 ** 3), e10 = Math.floor(Math.log10(val)), man = val / 10 ** e10;
        return { q: `${P[0]} has a non-relativistic acceleration of $${m}\\times10^{${ex}}$ m s$^{-2}$. The power it radiates is ______ $\\times10^{${e10}}$ W (to two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), z: P[1], a, e10,
          sol: `Larmor: $P = \\dfrac{q^2a^2}{6\\pi\\epsilon_0c^3}$ with $q = ${P[1] === 2 ? '2e' : 'e'}$: $q^2/(6\\pi\\epsilon_0c^3) = ${(P[1] ** 2 * KL * 1e54).toFixed(3)}\\times10^{-54}$ W s$^4$m$^{-2}$, times $a^2 = ${m * m}\\times10^{${2 * ex}}$ gives $${man.toFixed(3)}\\times10^{${e10}}$ W.`,
          trap: 'The mass does not enter at a given acceleration; it enters only when the force is given.' };
      },
      verify: (p) => (p.z * E) ** 2 * p.a ** 2 / (6 * PI * EPS * C0 ** 3) / 10 ** p.e10 },
    { id: 'netrp-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dipole radiation',
      make(r) {
        const p0 = choose(r, [1, 2, 5]), pe = choose(r, [-10, -9, -8]), f = choose(r, [10, 30, 50, 100, 300]);
        const w = 2 * PI * f * 1e6, val = MU0 * (p0 * 10 ** pe) ** 2 * w ** 4 / (12 * PI * C0);
        return { q: `An electric dipole $p_0\\cos\\omega t$ with $p_0 = ${p0}\\times10^{${pe}}$ C m oscillates at ${f} MHz. Its time-averaged radiated power is ______ W (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, unit: 'W', p0: p0 * 10 ** pe, f,
          sol: `$\\langle P\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$ with $\\omega = 2\\pi\\times${f}\\times10^6 = ${w.toPrecision(4)}$ s$^{-1}$: $\\dfrac{1.2566\\times10^{-6}\\times(${p0}\\times10^{${pe}})^2\\times(${w.toPrecision(4)})^4}{12\\pi\\times2.998\\times10^8} = ${val.toPrecision(4)}$ W.`,
          trap: 'Use $\\omega = 2\\pi f$, and the averaged $12\\pi$ (the instantaneous peak uses $6\\pi$).' };
      },
      verify: (p) => MU0 * p.p0 ** 2 * (2 * PI * p.f * 1e6) ** 4 / (12 * PI * C0) },
    { id: 'netrp-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'antennas',
      make(r) {
        const d = choose(r, [0.1, 0.2, 0.5, 1, 2]), f = choose(r, [3, 5, 10, 15, 20, 30]), I = choose(r, [1, 2, 5, 10]), ask = choose(r, ['R', 'P']);
        const lam = C0 / (f * 1e6), R = 80 * PI * PI * (d / lam) ** 2, val = ask === 'R' ? R : 0.5 * I * I * R;
        return { q: `A short antenna of length ${d} m carries a uniform current of amplitude ${I} A at ${f} MHz. Treating it as a Hertzian dipole, ${ask === 'R' ? 'its radiation resistance is ______ $\\Omega$' : 'its time-averaged radiated power is ______ W'} (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, d, f, I, ask,
          sol: `$\\lambda = c/f = ${lam.toPrecision(4)}$ m. $R = 80\\pi^2(d/\\lambda)^2 = 789.6\\times(${(d / lam).toPrecision(4)})^2 = ${R.toPrecision(4)}\\ \\Omega$.${ask === 'P' ? ` $\\langle P\\rangle = \\tfrac12I_0^2R = 0.5\\times${I}^2\\times${R.toPrecision(4)} = ${val.toPrecision(4)}$ W.` : ''}`,
          trap: 'The current amplitude does not affect $R$; and $\\langle P\\rangle$ uses $\\tfrac12I_0^2$, not $I_0^2$.' };
      },
      verify: (p) => { const R = 80 * PI * PI * (p.d * p.f * 1e6 / C0) ** 2; return p.ask === 'R' ? R : 0.5 * p.I ** 2 * R; } },
    { id: 'netrp-g04', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Rayleigh scattering',
      make(r) {
        const l1 = choose(r, [380, 400, 420, 450, 470]), l2 = choose(r, [550, 600, 650, 700, 750]), inv = r() < 0.5;
        const val = inv ? (l1 / l2) ** 4 : (l2 / l1) ** 4;
        return { q: `In Rayleigh scattering by molecules, what is the ratio of the scattered intensity at ${inv ? l2 : l1} nm to that at ${inv ? l1 : l2} nm, for equal incident intensities? Answer to three decimal places.`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.004), l1, l2, inv,
          sol: `A bound electron driven far below resonance has $p_0$ independent of $\\omega$, so the power $\\propto\\omega^4\\propto\\lambda^{-4}$. Ratio $= (${inv ? l1 : l2}/${inv ? l2 : l1})^4 = ${round(val, 4)}$.`,
          trap: 'Shorter wavelengths scatter more: the ratio is above 1 only if the first wavelength is the shorter one.' };
      },
      verify: (p) => (p.inv ? p.l1 / p.l2 : p.l2 / p.l1) ** 4 },
    { id: 'netrp-g05', type: 'nat', level: 3, exams: ['net'], sub: 'synchrotron radiation',
      make(r) {
        const En = choose(r, [1, 1.5, 2, 2.5, 3, 6, 8]), R = choose(r, [5, 8, 10, 20, 50, 100]), ask = choose(r, ['dE', 'frac']);
        const dE = 88.46 * En ** 4 / R, val = ask === 'dE' ? dE : dE / (En * 1e6) * 1e4;
        return { q: `Electrons of ${En} GeV circulate on a bending radius of ${R} m. Using $\\Delta E\\,[\\text{keV}] = 88.46\\,E^4[\\text{GeV}]/R[\\text{m}]$, ${ask === 'dE' ? 'the energy lost per turn is ______ keV' : 'the fraction of the beam energy lost per turn is ______ $\\times10^{-4}$'} (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, En, R, ask,
          sol: `$\\Delta E = 88.46\\times${En}^4/${R} = ${dE.toPrecision(4)}$ keV per turn.${ask === 'frac' ? ` As a fraction of ${En} GeV $= ${En * 1e6}$ keV this is $${val.toPrecision(4)}\\times10^{-4}$.` : ''} The rule comes from $\\Delta E = e^2\\gamma^4/3\\epsilon_0R$.`,
          trap: 'The loss scales as $E^4/R$: energy to the fourth power.' };
      },
      verify: (p) => { const d = 88.46 * p.En ** 4 / p.R; return p.ask === 'dE' ? d : d / (p.En * 1e6) * 1e4; } },
    { id: 'netrp-g06', type: 'nat', level: 4, exams: ['net'], sub: 'synchrotron radiation',
      make(r) {
        const En = choose(r, [1, 2, 3, 6, 7]), R = choose(r, [5, 10, 25, 50, 100]);
        const g = En * 1000 / MEC2, val = 1.054571817e-34 * 1.5 * g ** 3 * C0 / R / E / 1e3;
        return { q: `Electrons of ${En} GeV move on a bending radius of ${R} m. With $\\omega_c = \\tfrac32\\gamma^3c/R$, the critical photon energy $\\hbar\\omega_c$ is ______ keV (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, En, R,
          sol: `$\\gamma = ${En * 1000}/0.511 = ${g.toFixed(0)}$. $\\omega_c = 1.5\\times${g.toFixed(0)}^3\\times2.998\\times10^8/${R} = ${(1.5 * g ** 3 * C0 / R).toPrecision(4)}$ s$^{-1}$. $\\hbar\\omega_c = ${val.toPrecision(4)}$ keV (equivalently $2.218\\,E^3[\\text{GeV}]/R[\\text{m}]$ keV).`,
          trap: 'The emitted spectrum reaches $\\gamma^3$ times the orbital frequency because of beaming and Doppler compression.' };
      },
      verify: (p) => 1.054571817e-34 * 1.5 * (p.En * 1000 / MEC2) ** 3 * C0 / p.R / E / 1e3 },
    { id: 'netrp-g07', type: 'nat', level: 3, exams: ['net'], sub: 'beaming',
      make(r) {
        const P = choose(r, [['electrons', MEC2], ['electrons', MEC2], ['protons', 938.272]]), En = choose(r, P[0] === 'protons' ? [50, 450, 7000] : [0.5, 1, 2, 3, 6]);
        const g = En * 1000 / P[1], val = 1e3 / g;
        return { q: `Synchrotron radiation from ${P[0]} of total energy ${En} GeV is beamed into a forward cone of half-angle about $1/\\gamma$. This angle is ______ mrad (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, unit: 'mrad', m: P[1], En,
          sol: `$\\gamma = E/mc^2 = ${En * 1000}/${P[1]} = ${g.toPrecision(4)}$, so $1/\\gamma = ${(1 / g).toPrecision(4)}$ rad $= ${val.toPrecision(4)}$ mrad.`,
          trap: 'Use the total energy over the rest energy; at these energies kinetic and total energy are nearly equal.' };
      },
      verify: (p) => 1e3 * p.m / (p.En * 1000) },
    { id: 'netrp-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'angular distribution',
      make(r) {
        const kind = choose(r, ['lin', 'rot']), th = choose(r, [15, 30, 40, 45, 60, 75]);
        const s = Math.sin(th * PI / 180), c = Math.cos(th * PI / 180), val = kind === 'lin' ? s * s : (1 + c * c) / 2;
        return { q: kind === 'lin' ? `An electric dipole oscillates along the $z$ axis. At a fixed distance, the intensity at ${th}$^\\circ$ from the $z$ axis is what fraction of the intensity in the equatorial plane? (three decimal places)` : `A dipole of constant magnitude rotates uniformly in the $xy$ plane. At a fixed distance, the time-averaged intensity at ${th}$^\\circ$ from the $z$ axis is what fraction of the intensity along the $z$ axis? (three decimal places)`,
          answer: round(val, 3), tol: 0.002, kind, th,
          sol: kind === 'lin' ? `$\\langle S\\rangle\\propto\\sin^2\\theta$, so the fraction is $\\sin^2${th}^\\circ = ${round(val, 4)}$.` : `Two perpendicular dipoles in quadrature give $\\langle S\\rangle\\propto\\tfrac12[(1 - \\sin^2\\theta\\cos^2\\phi) + (1 - \\sin^2\\theta\\sin^2\\phi)] = \\tfrac12(1 + \\cos^2\\theta)$, largest (1) on the axis. Fraction $= (1 + \\cos^2${th}^\\circ)/2 = ${round(val, 4)}$.`,
          trap: kind === 'lin' ? 'The angle is from the dipole axis, where the intensity is zero.' : 'A rotating dipole radiates most along its rotation axis, half as much in its plane.' };
      },
      verify: (p) => { const t = p.th * PI / 180; return p.kind === 'lin' ? Math.sin(t) ** 2 : (1 + Math.cos(t) ** 2) / 2; } },
    { id: 'netrp-g09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling of radiated power',
      make(r) {
        const kind = choose(r, ['ed', 'md', 'eq', 'fixI']), k = choose(r, [2, 3]), s = choose(r, [2, 3, 1]);
        const n = { ed: 4, md: 4, eq: 6, fixI: 2 }[kind];
        const what = { ed: `an electric dipole is changed: frequency × ${k}, dipole amplitude × ${s}`, md: `a magnetic dipole is changed: frequency × ${k}, dipole moment amplitude × ${s}`, eq: `an electric quadrupole is changed: frequency × ${k}, quadrupole amplitude × ${s}`, fixI: `a short straight antenna is changed: frequency × ${k}, current amplitude × ${s}` }[kind];
        const val = k ** n * s * s;
        const o = mcqOptions(r, val, [k ** 4 * s * s, k ** 6 * s * s, k ** 2 * s * s, k ** n * s, k ** 4 * s, k ** 3 * s * s].filter((x) => x !== val), (v) => `${v}`);
        return { q: `The drive of ${what}. By what factor does the time-averaged radiated power change?`, ...o,
          sol: `${kind === 'fixI' ? '$p_0 = I_0d/\\omega$, so $P\\propto p_0^2\\omega^4\\propto I_0^2\\omega^2$' : kind === 'eq' ? 'Quadrupole power $\\propto Q_0^2\\omega^6$' : 'Dipole power $\\propto(\\text{moment})^2\\omega^4$'}: factor $${k}^{${n}}\\times${s}^2 = ${val}$.`,
          trap: 'Power goes as the square of the amplitude; the power of the frequency depends on the multipole and on what is held fixed.' };
      } },
    { id: 'netrp-g10', type: 'nat', level: 4, exams: ['net'], sub: 'cyclotron radiation',
      make(r) {
        const B = choose(r, [0.5, 1, 2, 3, 5, 10]);
        const val = 3 * PI * EPS * ME ** 3 * C0 ** 3 / (E ** 4 * B * B);
        return { q: `A slow electron gyrates in a uniform magnetic field of ${B} T and loses energy by cyclotron radiation. Its kinetic energy decays as $e^{-t/\\tau_E}$. Find $\\tau_E$ in seconds (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, unit: 's', B,
          sol: `$a = eBv/m$, so $P = \\dfrac{e^4B^2v^2}{6\\pi\\epsilon_0m^2c^3} = \\dfrac{K}{\\tau_E}$ with $\\tau_E = \\dfrac{3\\pi\\epsilon_0m^3c^3}{e^4B^2} = \\dfrac{2.579\\text{ s T}^2}{${B}^2} = ${val.toPrecision(4)}$ s.`,
          trap: 'The time constant does not depend on the speed (non-relativistic), only on $B^2$.' };
      },
      verify: (p) => 3 * PI * EPS * ME ** 3 * C0 ** 3 / (E ** 4 * p.B ** 2) },
    { id: 'netrp-g11', type: 'nat', level: 3, exams: ['net'], sub: 'uniform motion',
      make(r) {
        const b = choose(r, [0.5, 0.6, 0.8, 0.9, 0.95]), ask = choose(r, ['perp', 'par', 'ratio']);
        const g = 1 / Math.sqrt(1 - b * b), val = { perp: g, par: 1 / (g * g), ratio: g ** 3 }[ask];
        const txt = { perp: 'perpendicular to the motion, as a multiple of the Coulomb value $q/4\\pi\\epsilon_0R^2$', par: 'straight ahead, as a multiple of the Coulomb value $q/4\\pi\\epsilon_0R^2$', ratio: 'perpendicular to the motion divided by the field straight ahead' }[ask];
        return { q: `A charge moves uniformly at ${b}$c$. At distance $R$ from its present position, find the electric field ${txt} (three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.002, val * 0.003), b, ask,
          sol: `$E = \\dfrac{q}{4\\pi\\epsilon_0R^2}\\dfrac{1 - \\beta^2}{(1 - \\beta^2\\sin^2\\theta)^{3/2}}$, with $\\gamma = ${round(g, 4)}$. At $\\theta = 90^\\circ$ the factor is $\\gamma$; at $\\theta = 0$ it is $1/\\gamma^2$. Answer: $${round(val, 4)}$.`,
          trap: 'The field is radial from the present position and squeezed sideways.' };
      },
      verify: (p) => { const g = 1 / Math.sqrt(1 - p.b ** 2); return { perp: g, par: 1 / g ** 2, ratio: g ** 3 }[p.ask]; } },
    { id: 'netrp-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const P = choose(r, [
          ['Which quantity sets the total power radiated by a non-relativistic point charge?', 'its acceleration', ['its velocity', 'its kinetic energy', 'the rate of change of its potential energy'], 'Larmor: $P = q^2a^2/6\\pi\\epsilon_0c^3$ depends only on $a$.'],
          ['In the radiation zone the Poynting vector of a localised source falls off as', '$1/r^2$', ['$1/r$', '$1/r^3$', '$1/r^4$'], 'The fields go as $1/r$, so $S\\propto1/r^2$ and the power through any large sphere is the same.'],
          ['Which part of the field of a moving point charge carries energy to infinity?', 'the acceleration field, $\\propto1/\\mathscr r$', ['the velocity field, $\\propto1/\\mathscr r^2$', 'the magnetic part of the velocity field only', 'none: a point charge cannot radiate'], 'Only a $1/\\mathscr r$ field gives a finite flux through an infinitely large sphere.'],
          ['Thomson-scattered light observed at $90^\\circ$ to an unpolarised beam is', 'fully linearly polarised, perpendicular to the scattering plane', ['unpolarised', 'circularly polarised', 'fully linearly polarised, in the scattering plane'], 'The electrons oscillate perpendicular to the beam; seen at $90^\\circ$ only the component perpendicular to the scattering plane radiates towards the observer.'],
          ['The Thomson cross-section of a free electron depends on the light frequency as', 'not at all (for $\\hbar\\omega\\ll m_ec^2$)', ['$\\omega^4$', '$\\omega^2$', '$\\omega^{-2}$'], 'A free electron\'s acceleration $eE_0/m$ does not depend on $\\omega$, so neither does the scattered power per unit intensity.'],
          ['A charge bound by a spring, driven far above its resonance frequency, scatters light like', 'a free electron (Thomson, frequency independent)', ['a Rayleigh scatterer ($\\omega^4$)', 'a perfect absorber', 'a magnetic dipole'], 'Far above resonance the spring force is negligible compared with inertia, so the charge responds like a free one.'],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. ${P[3]}` };
      } },
    ...more,
    ...r4.gens,
  ],
};
