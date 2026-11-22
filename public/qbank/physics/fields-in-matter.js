// Fields in matter at MSc level: bound charge and bound current, D and H, boundary conditions with free surface
// charge and current, depolarising and demagnetising factors (sphere, cylinder, slab, needle), dielectric and
// magnetic boundary value problems, cavity fields and the Lorentz local field, Clausius-Mossotti and Debye,
// dielectric images, magnetic shielding, energies. Original questions (fibub) for GATE and CSIR NET.
// BSc basics are in dielectrics and magnetic-materials (IIT JAM).
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './fields-in-matter.more.gen.js';
import more2 from './fields-in-matter.more2.gen.js';
import r4 from './fields-in-matter.r4.gen.js';
import r5 from './fields-in-matter.r5.gen.js';

const EPS0 = 8.8541878128e-12, MU0 = 1.25663706212e-6, K = 8.9875517923e9, KB = 1.380649e-23, PI = Math.PI;

export default {
  topic: 'fields-in-matter',
  items: [
    // ---------- level 1 ----------
    { id: 'fim-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bound charge',
      q: 'A dielectric with polarisation $\\vec P$ is equivalent, for its field, to bound charges with densities',
      options: ['$\\rho_b = \\nabla\\cdot\\vec P$ and $\\sigma_b = -\\vec P\\cdot\\hat n$', '$\\rho_b = -\\nabla\\cdot\\vec P$ and $\\sigma_b = \\vec P\\cdot\\hat n$', '$\\rho_b = -\\nabla\\times\\vec P$ and $\\sigma_b = \\vec P\\times\\hat n$', '$\\rho_b = |\\vec P|$ and $\\sigma_b = 0$'], answer: 1,
      sol: 'The potential of the dipoles is $\\dfrac{1}{4\\pi\\epsilon_0}\\int\\dfrac{\\vec P\\cdot\\hat{\\mathscr r}}{\\mathscr r^2}d\\tau$. Writing $\\hat{\\mathscr r}/\\mathscr r^2 = \\nabla\'(1/\\mathscr r)$ and integrating by parts gives a surface term with $\\sigma_b = \\vec P\\cdot\\hat n$ ($\\hat n$ outward) and a volume term with $\\rho_b = -\\nabla\\cdot\\vec P$. Where $\\vec P$ spreads out, positive ends leave and negative charge is left behind.' },
    { id: 'fim-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bound current',
      q: 'A magnetised body with magnetisation $\\vec M$ is equivalent to bound currents',
      options: ['$\\vec J_b = \\nabla\\cdot\\vec M$, $\\vec K_b = \\vec M\\cdot\\hat n$', '$\\vec J_b = -\\nabla\\times\\vec M$, $\\vec K_b = \\hat n\\times\\vec M$', '$\\vec J_b = \\nabla\\times\\vec M$, $\\vec K_b = \\vec M\\times\\hat n$', '$\\vec J_b = \\mu_0\\vec M$, $\\vec K_b = 0$'], answer: 2,
      sol: 'From $\\vec A = \\dfrac{\\mu_0}{4\\pi}\\int\\dfrac{\\vec M\\times\\hat{\\mathscr r}}{\\mathscr r^2}d\\tau$ and an integration by parts: volume current $\\vec J_b = \\nabla\\times\\vec M$ and surface current $\\vec K_b = \\vec M\\times\\hat n$ (outward normal). For uniform $\\vec M$ only the surface current survives, like the winding of a solenoid.',
      trap: 'The order in $\\vec M\\times\\hat n$ matters: $\\hat n\\times\\vec M$ has the opposite sign.' },
    { id: 'fim-003', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'linear media',
      q: 'In a linear dielectric of susceptibility $\\chi_e = 2.0$, the field is $1000$ V/m. The polarisation is ______ nC/m$^2$ (to one decimal place).',
      answer: 17.7, tol: 0.1, calc: () => EPS0 * 2 * 1000 * 1e9,
      sol: '$P = \\epsilon_0\\chi_eE = 8.854\\times10^{-12}\\times2.0\\times1000 = 1.77\\times10^{-8}$ C/m$^2 = 17.7$ nC/m$^2$.' },
    { id: 'fim-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'D and H',
      q: 'Which field has a divergence equal to the free charge density alone?',
      options: ['$\\vec E$', '$\\vec P$', '$\\epsilon_0\\vec E - \\vec P$', '$\\vec D = \\epsilon_0\\vec E + \\vec P$'], answer: 3,
      sol: '$\\epsilon_0\\nabla\\cdot\\vec E = \\rho_f + \\rho_b = \\rho_f - \\nabla\\cdot\\vec P$, so $\\nabla\\cdot(\\epsilon_0\\vec E + \\vec P) = \\rho_f$.' },
    { id: 'fim-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'depolarisation',
      q: 'A thin, wide slab is uniformly polarised with $\\vec P$ normal to its faces, with no free charge anywhere. The field inside it is',
      options: ['$-\\vec P/\\epsilon_0$', '$-\\vec P/3\\epsilon_0$', '$-\\vec P/2\\epsilon_0$', 'zero'], answer: 0,
      sol: 'The faces carry $\\sigma_b = \\pm P$, like a parallel-plate capacitor: inside $E = P/\\epsilon_0$ pointing from the $+$ face to the $-$ face, i.e. opposite to $\\vec P$. Equivalently $\\vec D = 0$ (no free charge, slab geometry), so $\\vec E = -\\vec P/\\epsilon_0$. Depolarising factor 1 (sphere: 1/3; needle along its axis: 0).' },
    { id: 'fim-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'D and H',
      q: 'Inside a magnetic material $B = 1.00$ T and $M = 7.0\\times10^5$ A/m along the same direction. $H$ is ______ kA/m (to one decimal place).',
      answer: 95.8, tol: 0.2, calc: () => (1 / MU0 - 7e5) / 1e3,
      sol: '$H = B/\\mu_0 - M = \\dfrac{1.00}{1.2566\\times10^{-6}} - 7.0\\times10^5 = 7.958\\times10^5 - 7.0\\times10^5 = 9.58\\times10^4$ A/m.' },

    // ---------- level 2 ----------
    { id: 'fim-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bound charge',
      q: 'A sphere of radius $R$ has polarisation $\\vec P = kr^2\\,\\hat r$. The bound volume charge density at $r = R/2$ is $\\kappa\\,kR$. The value of $\\kappa$ is ______.',
      answer: -2, tol: 0.001, calc: () => -4 * 0.5,
      sol: '$\\rho_b = -\\dfrac{1}{r^2}\\dfrac{d}{dr}(r^2\\cdot kr^2) = -\\dfrac{4kr^3}{r^2} = -4kr$. At $r = R/2$: $-2kR$. (Check: total volume charge $-4\\pi kR^4$ cancels the surface charge $\\sigma_b = kR^2$ times $4\\pi R^2$.)' },
    { id: 'fim-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'bound charge',
      q: 'A slab $0 < z < d$ has polarisation $\\vec P = P_0(z/d)\\,\\hat z$. Its bound charges are',
      options: ['$\\rho_b = 0$; $\\sigma_b = +P_0$ at $z = d$ and $-P_0$ at $z = 0$', '$\\rho_b = +P_0/d$; $\\sigma_b = -P_0$ at $z = d$, 0 at $z = 0$', '$\\rho_b = -P_0/d$; $\\sigma_b = +P_0$ at $z = d$, 0 at $z = 0$', '$\\rho_b = -P_0/d$; $\\sigma_b = +P_0$ at both faces'], answer: 2,
      sol: '$\\rho_b = -dP_z/dz = -P_0/d$. Top face ($\\hat n = \\hat z$): $\\sigma_b = P(d) = P_0$. Bottom face ($\\hat n = -\\hat z$): $\\sigma_b = -P(0) = 0$. Per unit area: $-P_0 + P_0 + 0 = 0$, as it must be for a neutral body.' },
    { id: 'fim-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A long cylinder of linear dielectric ($\\epsilon_r = 3$) lies with its axis perpendicular to a uniform field of 600 V/m. The field inside the cylinder is ______ V/m.',
      answer: 300, tol: 0.5, calc: () => 2 * 600 / (3 + 1),
      sol: 'Separation in polar coordinates: inside $V = -As\\cos\\phi$, outside $V = -E_0s\\cos\\phi + B\\cos\\phi/s$. Continuity of $V$ and of $\\epsilon\\partial V/\\partial s$ at $s = R$ give $A = \\dfrac{2E_0}{\\epsilon_r + 1}$: a uniform field $2\\times600/4 = 300$ V/m.',
      trap: 'The sphere formula $3E_0/(\\epsilon_r + 2)$ gives 360 V/m; a cylinder in a transverse field has depolarising factor 1/2, not 1/3.' },
    { id: 'fim-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cavity fields',
      q: 'Inside a uniformly magnetised material (fields $\\vec B$, $\\vec H$, magnetisation $\\vec M$), a long thin needle-shaped cavity is cut along $\\vec M$. The field $\\vec B$ in the cavity is',
      options: ['$\\vec B$', '$\\mu_0\\vec H$', '$\\vec B - \\tfrac23\\mu_0\\vec M$', 'zero'], answer: 1,
      sol: 'Removing a needle along $\\vec M$ removes a thin cylinder of magnetisation, i.e. its surface current $M$ per length round the long sides, which made a solenoid field $\\mu_0M$ inside. So $\\vec B_{cav} = \\vec B - \\mu_0\\vec M = \\mu_0\\vec H$. (A thin disc cut normal to $\\vec M$ has negligible side current: $\\vec B_{cav} = \\vec B$. These two cavities are how $\\vec H$ and $\\vec B$ were first defined operationally.)' },
    { id: 'fim-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'local field',
      q: 'In a cubic dielectric crystal with $\\epsilon_r = 2.5$ the macroscopic field is 1000 V/m. The Lorentz local field acting on a molecule is ______ V/m.',
      answer: 1500, tol: 1, calc: () => 1000 + (2.5 - 1) * 1000 / 3,
      sol: '$\\vec E_{loc} = \\vec E + \\dfrac{\\vec P}{3\\epsilon_0}$ (cubic symmetry: the near neighbours add nothing). $P = \\epsilon_0(\\epsilon_r - 1)E$, so $E_{loc} = E\\left(1 + \\dfrac{\\epsilon_r - 1}{3}\\right) = 1000\\times1.5 = 1500$ V/m.' },
    { id: 'fim-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'bound current',
      q: 'A long cylinder of radius $R$ (axis $z$) has magnetisation $\\vec M = ks\\,\\hat z$, with $s$ the distance from the axis. Its bound currents are',
      options: ['$\\vec J_b = -k\\,\\hat\\phi$ and $\\vec K_b = kR\\,\\hat\\phi$', '$\\vec J_b = k\\,\\hat\\phi$ and $\\vec K_b = -kR\\,\\hat\\phi$', '$\\vec J_b = 2k\\,\\hat z$ and $\\vec K_b = -kR\\,\\hat z$', '$\\vec J_b = 0$ and $\\vec K_b = kR\\,\\hat\\phi$'], answer: 0,
      sol: '$\\nabla\\times(M_z\\hat z) = -\\dfrac{\\partial M_z}{\\partial s}\\hat\\phi = -k\\hat\\phi$. On the curved surface $\\vec K_b = \\vec M\\times\\hat s = kR\\,\\hat z\\times\\hat s = kR\\,\\hat\\phi$. Per unit length the volume current $-kR$ cancels the surface current $+kR$: bound currents never carry net current through a cross-section.' },
    { id: 'fim-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'boundary conditions',
      q: 'At an interface carrying free surface charge $\\sigma_f$ and free surface current $\\vec K_f$, which statements are correct?',
      options: ['The tangential part of $\\vec H$ jumps by $|\\vec K_f|$ (in the direction perpendicular to $\\vec K_f$).', 'The normal component of $\\vec B$ is continuous.', 'The normal component of $\\vec D$ jumps by $\\sigma_f$.', 'The tangential part of $\\vec E$ jumps by $\\sigma_f/\\epsilon_0$.'], answer: [0, 1, 2],
      sol: 'Pillboxes: $\\nabla\\cdot\\vec D = \\rho_f$ gives $D_{2\\perp} - D_{1\\perp} = \\sigma_f$; $\\nabla\\cdot\\vec B = 0$ gives $B_\\perp$ continuous. Loops: $\\nabla\\times\\vec H = \\vec J_f$ gives $\\hat n\\times(\\vec H_2 - \\vec H_1) = \\vec K_f$; $\\nabla\\times\\vec E = 0$ (statics) keeps $E_\\parallel$ continuous whatever the surface charge.' },
    { id: 'fim-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A sphere of linear dielectric with $\\epsilon_r = 5$ sits in a uniform field of 1000 V/m. The largest bound surface charge density on it is ______ nC/m$^2$ (to one decimal place).',
      answer: 15.2, tol: 0.1, calc: () => 3 * EPS0 * (4 / 7) * 1000 * 1e9,
      sol: 'Inside, $\\vec E = \\dfrac{3}{\\epsilon_r + 2}\\vec E_0$ and $\\vec P = \\epsilon_0(\\epsilon_r - 1)\\vec E = 3\\epsilon_0\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}\\vec E_0$, uniform. $\\sigma_b = P\\cos\\theta$, largest at the poles: $3\\times8.854\\times10^{-12}\\times\\dfrac47\\times1000 = 1.52\\times10^{-8}$ C/m$^2$.',
      trap: 'Using the outside field $E_0$ in $P = \\epsilon_0\\chi E$ overestimates $P$; the field inside is reduced.' },
    { id: 'fim-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magnetic BVP',
      q: 'A superconducting sphere expels a uniform field $B_0$ completely (it behaves as $\\mu_r = 0$). The field just outside its surface on the equator is',
      options: ['$B_0$', '$2B_0$', 'zero', '$\\tfrac32B_0$'], answer: 3,
      sol: 'Outside, $\\Phi_M$ must give $B_r = 0$ at $r = R$: $\\vec B = B_0\\hat z$ plus a dipole of moment $-2\\pi R^3B_0/\\mu_0$. On the surface $B_\\theta = -\\tfrac32B_0\\sin\\theta$, so on the equator $|B| = \\tfrac32B_0$; at the poles it is zero. The field lines crowd round the sides.',
      trap: 'A conducting sphere in an electric field gives $3E_0$ at the poles; the superconductor gives $\\tfrac32B_0$ at the equator.' },
    { id: 'fim-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'energy',
      q: 'A linear dielectric with $\\epsilon_r = 4.0$ carries a field of $1.0\\times10^5$ V/m. The electrostatic energy density, $\\tfrac12\\vec D\\cdot\\vec E$, is ______ J/m$^3$ (to three decimal places).',
      answer: 0.177, tol: 0.002, calc: () => 0.5 * 4 * EPS0 * 1e10,
      sol: '$u = \\tfrac12\\epsilon_0\\epsilon_rE^2 = 0.5\\times4\\times8.854\\times10^{-12}\\times10^{10} = 0.177$ J/m$^3$. It counts the work done to polarise the material as well as the vacuum field energy.' },

    // ---------- level 3 ----------
    { id: 'fim-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound charge',
      q: 'A point charge of $+1.0$ nC sits at the centre of a thick spherical shell of linear dielectric ($\\epsilon_r = 3$) with inner radius 1.0 cm. The bound surface charge density on the inner surface is ______ nC/m$^2$ (to the nearest whole number).',
      answer: -531, tol: 3, calc: () => -(2 / 3) * 1e-9 / (4 * PI * 1e-4) * 1e9,
      sol: 'By symmetry $D = q/4\\pi r^2$ everywhere. In the shell $P = \\epsilon_0\\chi_eE = \\dfrac{\\chi_e}{1 + \\chi_e}D = \\dfrac{\\epsilon_r - 1}{\\epsilon_r}\\dfrac{q}{4\\pi r^2}$, radially out. On the inner surface $\\hat n = -\\hat r$: $\\sigma_b = -P(a) = -\\dfrac23\\dfrac{10^{-9}}{4\\pi\\times10^{-4}} = -5.31\\times10^{-7}$ C/m$^2$.',
      trap: 'The inner surface normal points towards the centre, so its bound charge is negative.' },
    { id: 'fim-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dielectric images',
      q: 'A point charge is inside a large block of linear dielectric ($\\epsilon_r > 1$), near its flat surface with vacuum. The force on the charge is',
      options: ['towards the surface', 'away from the surface, into the dielectric', 'zero, since the medium is uniform around it', 'towards the surface only if the charge is negative'], answer: 1,
      sol: 'For a charge in medium 1 near medium 2, the field in medium 1 is that of $q$ and an image $q\' = -q\\dfrac{\\epsilon_2 - \\epsilon_1}{\\epsilon_2 + \\epsilon_1}$. With $\\epsilon_1 = \\epsilon_r\\epsilon_0 > \\epsilon_2 = \\epsilon_0$: $q\' = +q\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 1}$, same sign as $q$, so the charge is repelled from the surface whatever its sign. Ions in water avoid the water-air surface.',
      trap: 'Near a conductor or a denser dielectric a charge is attracted; near a less polarisable medium it is repelled.' },
    { id: 'fim-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dielectric images',
      q: 'A charge of 1.0 nC is in a large block of dielectric with $\\epsilon_r = 4$, 1.0 cm from its flat surface with vacuum. The magnitude of the force on it is ______ $\\mu$N (to two decimal places).',
      answer: 3.37, tol: 0.03, calc: () => K / 4 * 1e-18 * 0.6 / 4e-4 * 1e6,
      sol: 'Image $q\' = q\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 1} = 0.6q$ at 1.0 cm beyond the surface, acting in the medium of permittivity $4\\epsilon_0$: $F = \\dfrac{qq\'}{4\\pi(4\\epsilon_0)(2d)^2} = \\dfrac{8.99\\times10^9}{4}\\times\\dfrac{0.6\\times10^{-18}}{4\\times10^{-4}} = 3.37\\times10^{-6}$ N, repulsive.',
      trap: 'The force is computed with $\\epsilon_1 = \\epsilon_r\\epsilon_0$ of the medium the charge is in.' },
    { id: 'fim-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'magnetic scalar potential',
      q: 'In a region with no free current, the magnetic scalar potential $\\Phi_M$ is defined by $\\vec H = -\\nabla\\Phi_M$. Which statements are correct?',
      options: ['$\\vec H$ can be written this way wherever $\\vec J_f = 0$ (and $\\partial\\vec D/\\partial t = 0$).', '$\\nabla^2\\Phi_M = \\nabla\\cdot\\vec M$, so $\\rho_M = -\\nabla\\cdot\\vec M$ acts as a source for $\\vec H$.', 'Inside a permanent magnet $\\vec B$ is curl-free.', 'A uniformly magnetised body acts on $\\vec H$ like surface "magnetic charge" $\\sigma_M = \\vec M\\cdot\\hat n$.'], answer: [0, 1, 3],
      sol: '$\\nabla\\times\\vec H = \\vec J_f = 0$ allows a scalar potential. $\\nabla\\cdot\\vec B = 0$ gives $\\nabla\\cdot\\vec H = -\\nabla\\cdot\\vec M$, so $-\\nabla^2\\Phi_M = -\\nabla\\cdot\\vec M$: the magnetic analogue of $\\rho_b$, $\\sigma_b$. But $\\nabla\\times\\vec B = \\mu_0\\nabla\\times\\vec M = \\mu_0\\vec J_b \\ne 0$ where $\\vec M$ varies (and at its surface).' },
    { id: 'fim-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'demagnetisation',
      q: 'A long rod is uniformly magnetised perpendicular to its axis with $M = 1.0\\times10^6$ A/m, with no free current. The magnetic field $B$ inside it is ______ T (to three decimal places).',
      answer: 0.628, tol: 0.003, calc: () => MU0 * 5e5,
      sol: 'For a long cylinder magnetised transversely the demagnetising factor is $N = \\tfrac12$: $\\vec H_{in} = -\\tfrac12\\vec M$ and $\\vec B = \\mu_0(\\vec H + \\vec M) = \\tfrac12\\mu_0\\vec M = 0.5\\times1.2566\\times10^{-6}\\times10^6 = 0.628$ T.',
      trap: 'Sphere: $\\tfrac23\\mu_0M$. Rod along its axis: $\\mu_0M$. Rod across: $\\tfrac12\\mu_0M$.' },
    { id: 'fim-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A spherical cavity is cut in an infinite linear dielectric ($\\epsilon_r$); far away the field is uniform, $E_0$. The field inside the cavity is',
      options: ['$\\dfrac{3E_0}{\\epsilon_r + 2}$', '$\\dfrac{3\\epsilon_rE_0}{2\\epsilon_r + 1}$', '$\\epsilon_rE_0$', '$E_0$'], answer: 1,
      sol: 'Same separation as for a dielectric sphere with the permittivities swapped: the inner region has $\\epsilon_0$ and the outer $\\epsilon_r\\epsilon_0$. Replacing $\\epsilon_r$ by $1/\\epsilon_r$ in $3E_0/(\\epsilon_r + 2)$ gives $\\dfrac{3E_0}{1/\\epsilon_r + 2} = \\dfrac{3\\epsilon_rE_0}{2\\epsilon_r + 1}$, larger than $E_0$ (between $E_0$ and $1.5E_0$).',
      trap: 'The sphere result $3E_0/(\\epsilon_r + 2)$ applies to a dielectric ball in vacuum, the opposite case.' },
    { id: 'fim-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A spherical air bubble sits in a large block of dielectric with $\\epsilon_r = 4$ in which the far field is 100 V/m. The field inside the bubble is ______ V/m (to one decimal place).',
      answer: 133.3, tol: 0.3, calc: () => 3 * 4 * 100 / 9,
      sol: '$E_{cav} = \\dfrac{3\\epsilon_rE_0}{2\\epsilon_r + 1} = \\dfrac{3\\times4\\times100}{9} = 133.3$ V/m. Breakdown therefore starts in voids inside insulation.' },
    { id: 'fim-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polarisability',
      q: 'A helium atom has polarisability volume $\\alpha/4\\pi\\epsilon_0 = 0.205$ Å$^3$. Modelling it as a conducting sphere ($\\alpha = 4\\pi\\epsilon_0R^3$), the effective radius is ______ Å (to two decimal places).',
      answer: 0.59, tol: 0.01, calc: () => Math.cbrt(0.205),
      sol: 'A conducting sphere in $E_0$ gains $p = 4\\pi\\epsilon_0R^3E_0$, so $\\alpha/4\\pi\\epsilon_0 = R^3$ and $R = (0.205)^{1/3} = 0.59$ Å, close to the size of the helium electron cloud (its Bohr-like radius is about 0.3 Å, the cloud extends further).' },
    { id: 'fim-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'polar molecules',
      q: 'For a dilute gas of polar molecules (number density $N$, permanent moment $p$, induced polarisability $\\alpha$), the Langevin-Debye susceptibility is',
      options: ['$\\chi_e = \\dfrac{N\\alpha}{\\epsilon_0}$, independent of temperature', '$\\chi_e = \\dfrac{Np^2}{\\epsilon_0k_BT}$', '$\\chi_e = \\dfrac{N}{\\epsilon_0}\\left(\\alpha + \\dfrac{p^2}{3k_BT}\\right)$', '$\\chi_e = \\dfrac{N}{\\epsilon_0}\\left(\\alpha + \\dfrac{3p^2}{k_BT}\\right)$'], answer: 2,
      sol: 'Induced part $N\\alpha E$. Orientation: the Langevin average $\\langle\\cos\\theta\\rangle = L(pE/k_BT) \\approx pE/3k_BT$ for weak fields, giving $Np^2E/3k_BT$. So $\\chi_e = \\dfrac{N}{\\epsilon_0}\\left(\\alpha + \\dfrac{p^2}{3k_BT}\\right)$: plotting $\\chi_e$ against $1/T$ gives $\\alpha$ from the intercept and $p$ from the slope.' },
    { id: 'fim-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polar molecules',
      q: 'A molecule has permanent moment $6.2\\times10^{-30}$ C m and polarisability volume $\\alpha/4\\pi\\epsilon_0 = 1.45\\times10^{-30}$ m$^3$. At 300 K, the ratio of the orientational term $p^2/3k_BT$ to the induced term $\\alpha$ is ______ (to one decimal place).',
      answer: 19.2, tol: 0.2, calc: () => (6.2e-30) ** 2 / (3 * KB * 300) / (4 * PI * EPS0 * 1.45e-30),
      sol: '$\\alpha = 4\\pi\\epsilon_0\\times1.45\\times10^{-30} = 1.61\\times10^{-40}$ C m$^2$/V. $p^2/3k_BT = \\dfrac{3.84\\times10^{-59}}{3\\times1.381\\times10^{-23}\\times300} = 3.09\\times10^{-39}$. Ratio $= 19.2$: for a strongly polar molecule orientation dominates at room temperature.' },
    { id: 'fim-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'linear media',
      q: 'A free point charge $q$ is embedded in a linear dielectric $\\epsilon_r$ that fills all space. Which statements are correct?',
      options: ['$\\vec E$ is reduced by the factor $\\epsilon_r$ compared with vacuum.', '$\\vec D$ is the same as $\\epsilon_0\\vec E$ would be in vacuum.', 'Bound charge $-q(\\epsilon_r - 1)/\\epsilon_r$ collects at the surface of the charge.', 'A finite, neutral dielectric body can carry non-zero total bound charge.'], answer: [0, 1, 2],
      sol: 'Spherical symmetry: $D = q/4\\pi r^2$, $E = D/\\epsilon_r\\epsilon_0$. The dielectric is uniform, so $\\rho_b = 0$ in its bulk; the bound charge sits at the cavity around $q$: $-P(a)\\cdot4\\pi a^2 = -q(\\epsilon_r - 1)/\\epsilon_r$, which screens $q$ to $q/\\epsilon_r$. For any finite neutral body, $\\int\\rho_b\\,d\\tau + \\oint\\sigma_b\\,da = -\\int\\nabla\\cdot\\vec P + \\oint\\vec P\\cdot d\\vec a = 0$.' },
    { id: 'fim-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bound current',
      q: 'A spherical shell of radius $R$ carries uniform surface charge $\\sigma$ and spins at angular velocity $\\omega\\hat z$. Its field inside is uniform, of size',
      options: ['$\\tfrac23\\mu_0\\sigma R\\omega$', '$\\mu_0\\sigma R\\omega$', '$\\tfrac13\\mu_0\\sigma R\\omega$', '$\\tfrac12\\mu_0\\sigma R\\omega$'], answer: 0,
      sol: 'The surface current $\\vec K = \\sigma\\vec v = \\sigma\\omega R\\sin\\theta\\,\\hat\\phi$ is exactly the bound current $\\vec M\\times\\hat n$ of a uniformly magnetised sphere with $M = \\sigma R\\omega$. Inside such a sphere $\\vec B = \\tfrac23\\mu_0\\vec M = \\tfrac23\\mu_0\\sigma R\\omega\\,\\hat z$.' },
    { id: 'fim-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound current',
      q: 'A long cylinder of radius $R$ has magnetisation $\\vec M = ks^2\\,\\hat\\phi$. The bound volume current density at $s = R/2$ is $\\kappa\\,kR$ along $\\hat z$. The value of $\\kappa$ is ______ (to one decimal place).',
      answer: 1.5, tol: 0.01, calc: () => 3 * 0.5,
      sol: '$\\nabla\\times(M_\\phi\\hat\\phi) = \\dfrac1s\\dfrac{d}{ds}(sM_\\phi)\\hat z = \\dfrac1s\\dfrac{d}{ds}(ks^3)\\hat z = 3ks\\,\\hat z$. At $R/2$: $1.5kR$. The surface current $\\vec K_b = \\vec M\\times\\hat s = -kR^2\\hat z$ returns it: $\\int_0^R3ks\\,2\\pi s\\,ds = 2\\pi kR^3 = kR^2\\times2\\pi R$.' },

    // ---------- level 4 ----------
    { id: 'fim-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A sphere of linear dielectric with $\\epsilon_r = 4$ sits in a uniform field $E_0$. Just outside its surface at a pole (on the field axis), the field is $\\kappa E_0$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 2, tol: 0.01, calc: () => 3 * 4 / (4 + 2),
      sol: 'Inside $E_{in} = \\dfrac{3E_0}{\\epsilon_r + 2}$, normal to the surface at the pole. $D_\\perp$ is continuous (no free charge): $E_{out} = \\epsilon_rE_{in} = \\dfrac{3\\epsilon_r}{\\epsilon_r + 2}E_0 = \\dfrac{12}{6}E_0 = 2E_0$. As $\\epsilon_r \\to \\infty$ this tends to $3E_0$, the conductor value.' },
    { id: 'fim-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      q: 'In the Clausius-Mossotti relation $\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2} = \\dfrac{N\\alpha}{3\\epsilon_0}$, what happens as $N\\alpha/3\\epsilon_0 \\to 1$?',
      options: ['$\\epsilon_r \\to 3$', '$\\epsilon_r \\to 1$', 'the local field correction vanishes', '$\\epsilon_r \\to \\infty$: the "polarisation catastrophe", a hint of spontaneous (ferroelectric) polarisation'], answer: 3,
      sol: 'Solving, $\\epsilon_r = \\dfrac{1 + 2x}{1 - x}$ with $x = N\\alpha/3\\epsilon_0$, which diverges as $x \\to 1$. The local field $E + P/3\\epsilon_0$ from the polarisation itself can then sustain the polarisation with no applied field. Real ferroelectrics need more than this simple model, but it explains why high-density, highly polarisable crystals can become ferroelectric.' },
    { id: 'fim-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'D and H',
      q: 'Which statements about $\\vec D$ and $\\vec H$ are correct?',
      options: ['$\\nabla\\times\\vec H = \\vec J_f + \\partial\\vec D/\\partial t$.', '$\\nabla\\cdot\\vec H = -\\nabla\\cdot\\vec M$.', '$\\vec H$ is fixed by the free currents alone, whatever the shape of the magnetic material.', 'Outside a permanently polarised body (an electret), $\\vec D$ can be non-zero although there is no free charge anywhere.'], answer: [0, 1, 3],
      sol: 'The first two follow from Maxwell\'s equations with $\\vec B = \\mu_0(\\vec H + \\vec M)$. A curl alone does not fix a vector field: $\\vec H$ also has a divergence, $-\\nabla\\cdot\\vec M$, so a bar magnet has an $\\vec H$ field with no free current at all. Likewise $\\nabla\\times\\vec D = \\nabla\\times\\vec P$ need not vanish, so an electret has a $\\vec D$ field outside.',
      trap: '"$\\vec D$ depends only on free charge" is true only when $\\nabla\\times\\vec P = 0$ everywhere (including the surfaces).' },
    { id: 'fim-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'depolarisation',
      q: 'A long cylinder is uniformly polarised perpendicular to its axis with $P = 1.0\\,\\mu$C/m$^2$, with no free charge. The magnitude of the field inside it is ______ kV/m (to one decimal place).',
      answer: 56.5, tol: 0.2, calc: () => 1e-6 / (2 * EPS0) / 1e3,
      sol: 'The surface carries $\\sigma_b = P\\cos\\phi$. Inside, the field is uniform: $\\vec E = -\\vec P/2\\epsilon_0$ (depolarising factor 1/2; the electric twin of the transverse rod in a field). $E = \\dfrac{10^{-6}}{2\\times8.854\\times10^{-12}} = 5.65\\times10^4$ V/m.' },
    { id: 'fim-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'energy',
      q: 'A small linear dielectric object is brought (at fixed sources) into a region of field $\\vec E_0$. The change in energy of the system is',
      options: ['$-\\tfrac12\\int\\vec P\\cdot\\vec E_0\\,d\\tau$, so the object is pulled towards stronger field', '$+\\tfrac12\\int\\vec P\\cdot\\vec E_0\\,d\\tau$, so the object is pushed away', '$-\\int\\vec P\\cdot\\vec E_0\\,d\\tau$, as for permanent dipoles', 'zero, because the object is neutral'], answer: 0,
      sol: 'For a linear material the induced moment grows as the object comes in, so the energy is half that of a permanent dipole: $W = -\\tfrac12\\int\\vec P\\cdot\\vec E_0\\,d\\tau$. It decreases where $E_0^2$ is larger, so dielectrics are drawn into strong fields (a liquid rising between capacitor plates, optical tweezers).' },
    { id: 'fim-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dielectric BVP',
      q: 'A long cylinder of linear dielectric ($\\epsilon_r = 3$) lies across a uniform field of 1000 V/m. The largest bound surface charge density on it is ______ nC/m$^2$ (to two decimal places).',
      answer: 8.85, tol: 0.03, calc: () => 2 * EPS0 * 0.5 * 1000 * 1e9,
      sol: '$E_{in} = \\dfrac{2E_0}{\\epsilon_r + 1} = 500$ V/m, so $P = \\epsilon_0(\\epsilon_r - 1)E_{in} = 2\\epsilon_0\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 1}E_0 = 8.854\\times10^{-12}\\times2\\times500 = 8.85\\times10^{-9}$ C/m$^2$. $\\sigma_b = P\\cos\\phi$, largest $8.85$ nC/m$^2$.' },
    { id: 'fim-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cavity fields',
      q: 'A small spherical cavity is cut inside a uniformly magnetised material where the field is $\\vec B$. The field at the centre of the cavity is',
      options: ['$\\vec B$', '$\\mu_0\\vec H$', '$\\vec B - \\tfrac23\\mu_0\\vec M$', '$\\vec B + \\tfrac13\\mu_0\\vec M$'], answer: 2,
      sol: 'Removing a sphere of uniform magnetisation subtracts its interior field $\\tfrac23\\mu_0\\vec M$. So $\\vec B_{cav} = \\vec B - \\tfrac23\\mu_0\\vec M = \\mu_0\\vec H + \\tfrac13\\mu_0\\vec M$. (Electric analogue: $\\vec E_{cav} = \\vec E + \\vec P/3\\epsilon_0$, the Lorentz field.)' },
    { id: 'fim-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'energy',
      q: 'A sphere of radius 1.0 cm made of linear dielectric with $\\epsilon_r = 4$ is placed in a uniform field of $1.0\\times10^5$ V/m. Its energy of interaction with the field, $-\\tfrac12\\vec p\\cdot\\vec E_0$, is ______ $\\mu$J (to three decimal places, with sign).',
      answer: -0.278, tol: 0.002, calc: () => -2 * PI * EPS0 * 1e-6 * 0.5 * 1e10 * 1e6,
      sol: 'Induced moment $p = 4\\pi\\epsilon_0R^3\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0$. $W = -\\tfrac12pE_0 = -2\\pi\\epsilon_0R^3\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0^2 = -2\\pi\\times8.854\\times10^{-12}\\times10^{-6}\\times0.5\\times10^{10} = -2.78\\times10^{-7}$ J.' },
    { id: 'fim-038', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'depolarisation',
      q: 'A sphere is uniformly polarised with $\\vec P = P\\hat z$ and there is no free charge. Which statements are correct?',
      options: ['$\\sigma_b = P\\cos\\theta$ on its surface.', 'Inside, $\\vec E = -\\vec P/3\\epsilon_0$.', 'Inside, $\\vec D = \\tfrac23\\vec P$.', 'Inside, $\\vec D = 0$ because there is no free charge.'], answer: [0, 1, 2],
      sol: '$\\sigma_b = \\vec P\\cdot\\hat r = P\\cos\\theta$, the shell problem solved by separation: $\\vec E_{in} = -\\vec P/3\\epsilon_0$. Then $\\vec D = \\epsilon_0\\vec E + \\vec P = \\tfrac23\\vec P \\ne 0$. No free charge does not mean $\\vec D = 0$; only in a slab geometry is it so.',
      trap: 'Zero free charge kills $\\nabla\\cdot\\vec D$, not $\\vec D$.' },

    // ---------- level 5 ----------
    { id: 'fim-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetic shielding',
      q: 'A long cylindrical iron shield ($\\mu_r = 1000$) with inner radius $a$ and outer radius $b = a/0.9$ is placed across a uniform field $B_0$. Solving Laplace\'s equation for $\\Phi_M$ in the three regions gives $B_{in}/B_0 = \\dfrac{4\\mu_r}{(\\mu_r + 1)^2 - (\\mu_r - 1)^2(a/b)^2}$. The shielding factor $B_0/B_{in}$ is ______ (to one decimal place).',
      answer: 48.4, tol: 0.2, calc: () => ((1001) ** 2 - (999) ** 2 * 0.81) / 4000,
      sol: 'In each region $\\Phi_M = (A_ns + B_n/s)\\cos\\phi$; matching $\\Phi_M$ and $\\mu\\,\\partial\\Phi_M/\\partial s$ at $s = a$ and $s = b$ gives the formula. With $\\mu_r = 1000$, $(a/b)^2 = 0.81$: denominator $1001^2 - 999^2\\times0.81 = 1\\,002\\,001 - 808\\,384 = 193\\,617$; $B_{in}/B_0 = 4000/193\\,617 = 0.0207$, so the shield cuts the field by a factor 48.4. For a thin shell of thickness $t$ this is about $\\mu_rt/2a$: $1000\\times0.111/2 \\approx 56$, the same order.',
      trap: 'A high-$\\mu$ shield does not stop field lines; it gives them an easier path round the inside.' },
    { id: 'fim-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'bound charge',
      q: 'A sphere of radius $R$ has radial polarisation of constant magnitude, $\\vec P = k\\hat r$, and no free charge. The potential difference $V(0) - V(R)$ is $\\kappa\\,kR/\\epsilon_0$. The value of $\\kappa$ is ______.',
      answer: -1, tol: 0.001, calc: () => -1,
      sol: 'Bound charges: $\\rho_b = -\\dfrac{1}{r^2}\\dfrac{d}{dr}(kr^2) = -\\dfrac{2k}{r}$ and $\\sigma_b = k$. With no free charge and spherical symmetry, $\\nabla\\cdot\\vec D = 0$ forces $\\vec D = 0$ everywhere, so inside $\\vec E = -\\vec P/\\epsilon_0 = -\\dfrac{k}{\\epsilon_0}\\hat r$ and outside $\\vec E = 0$. Then $V(0) - V(R) = \\displaystyle\\int_0^RE_r\\,dr = -kR/\\epsilon_0$: the centre is at lower potential (negative bound charge fills the inside).',
      trap: 'Here $\\vec D = 0$ really does hold, because of spherical symmetry; for the uniformly polarised sphere it does not.' },
    { id: 'fim-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'cavity fields',
      q: 'Inside a uniformly polarised linear dielectric (macroscopic $\\vec E$, $\\vec D$, $\\vec P$), small cavities are cut. Which statements are correct?',
      options: ['In a needle-shaped cavity along $\\vec E$, the field is $\\vec E$.', 'In a thin disc-shaped cavity normal to $\\vec E$, the field is $\\vec D/\\epsilon_0$.', 'In a spherical cavity, the field is $\\vec E + \\vec P/3\\epsilon_0$.', 'In a spherical cavity, $\\epsilon_0\\vec E_{cav}$ equals $\\vec D$.'], answer: [0, 1, 2],
      sol: 'Needle: only tiny end faces of bound charge, and $E_\\parallel$ is continuous: $\\vec E$. Disc: the faces carry $\\pm P$, adding $\\vec P/\\epsilon_0$, so $\\vec E + \\vec P/\\epsilon_0 = \\vec D/\\epsilon_0$ ($D_\\perp$ continuous). Sphere: the cavity surface carries $-P\\cos\\theta$, adding $+\\vec P/3\\epsilon_0$. So $\\epsilon_0\\vec E_{cav} = \\epsilon_0\\vec E + \\vec P/3 \\ne \\vec D$.' },
    { id: 'fim-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'dielectric images',
      q: 'A point charge $q$ sits in vacuum at height $d$ above the flat surface of a semi-infinite dielectric with $\\epsilon_r = 3$. At any point inside the dielectric, the potential equals $\\kappa$ times the vacuum Coulomb potential $q/4\\pi\\epsilon_0R_1$ (with $R_1$ the distance from the real charge). The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 0.5, tol: 0.005, calc: () => 2 / (1 + 3),
      sol: 'In the dielectric the field is that of an effective charge $q\'\' = \\dfrac{2\\epsilon_2}{\\epsilon_1 + \\epsilon_2}q$ at the real position, in a medium $\\epsilon_2$: $V = \\dfrac{q\'\'}{4\\pi\\epsilon_2R_1} = \\dfrac{2}{1 + \\epsilon_r}\\dfrac{q}{4\\pi\\epsilon_0R_1}$. Check the boundary: $V$ continuous needs $q + q\' = q\'\'/\\epsilon_r$ with $q\' = -\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 1}q$: $1 - \\tfrac12 = \\tfrac12$. ✓ So $\\kappa = 2/(1 + 3) = 0.5$.',
      trap: 'The potential in the dielectric is not simply reduced by $\\epsilon_r$: the factor is $2/(1 + \\epsilon_r)$.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],

  gens: [
    { id: 'fim-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bound charge',
      make(r) {
        const n = int(r, 0, 3), f = choose(r, [0.25, 0.5, 0.75]), ask = choose(r, ['rho', 'sig']);
        const val = ask === 'rho' ? -(n + 2) * Math.pow(f, n - 1) : 1;
        const P = n === 0 ? 'k\\,\\hat r' : n === 1 ? 'kr\\,\\hat r' : `kr^${n}\\,\\hat r`;
        return { q: ask === 'rho' ? `A sphere of radius $R$ has polarisation $\\vec P = ${P}$. The bound volume charge density at $r = ${f}R$ is $\\kappa\\,k${n === 1 ? '' : n === 0 ? 'R^{-1}' : n === 2 ? 'R' : `R^{${n - 1}}`}$. Find $\\kappa$ (to three decimal places).` : `A sphere of radius $R$ has polarisation $\\vec P = ${P}$. The bound surface charge density on its surface is $\\kappa\\,k${n === 0 ? '' : n === 1 ? 'R' : `R^${n}`}$. Find $\\kappa$.`,
          answer: round(val, 3), tol: Math.max(0.001, Math.abs(val) * 0.005), n, f, ask,
          sol: ask === 'rho' ? `$\\rho_b = -\\dfrac1{r^2}\\dfrac{d}{dr}(r^2\\cdot kr^{${n}}) = -(${n} + 2)kr^{${n - 1}}$. At $r = ${f}R$: $\\kappa = -${n + 2}\\times(${f})^{${n - 1}} = ${round(val, 4)}$.` : `$\\sigma_b = \\vec P\\cdot\\hat r$ at $r = R$: $kR^{${n}}$, so $\\kappa = 1$. (The volume charge $-(${n}+2)kr^{${n - 1}}$ integrates to $-4\\pi kR^{${n + 2}}$, cancelling it.)`,
          trap: 'In spherical coordinates the divergence is $\\frac{1}{r^2}\\frac{d}{dr}(r^2P_r)$, not $dP_r/dr$.' };
      },
      verify: (p) => (p.ask === 'rho' ? -(p.n + 2) * Math.pow(p.f, p.n - 1) : 1) },
    { id: 'fim-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dielectric BVP',
      make(r) {
        const shape = choose(r, ['sphere', 'cylinder', 'cavity']), er = choose(r, [2, 3, 4, 5, 6, 9, 81]), E0 = choose(r, [100, 200, 500, 1000]);
        const val = shape === 'sphere' ? 3 * E0 / (er + 2) : shape === 'cylinder' ? 2 * E0 / (er + 1) : 3 * er * E0 / (2 * er + 1);
        const desc = { sphere: `a sphere of linear dielectric ($\\epsilon_r = ${er}$) placed in a uniform field of ${E0} V/m`, cylinder: `a long cylinder of linear dielectric ($\\epsilon_r = ${er}$) lying across a uniform field of ${E0} V/m`, cavity: `a spherical air cavity in a large block of dielectric ($\\epsilon_r = ${er}$) where the far field is ${E0} V/m` }[shape];
        const f = { sphere: `$E_{in} = \\dfrac{3E_0}{\\epsilon_r + 2}$`, cylinder: `$E_{in} = \\dfrac{2E_0}{\\epsilon_r + 1}$`, cavity: `$E_{in} = \\dfrac{3\\epsilon_rE_0}{2\\epsilon_r + 1}$` }[shape];
        return { q: `Find the (uniform) field inside ${desc}, in V/m (to one decimal place).`, answer: round(val, 1), tol: Math.max(0.1, val * 0.005), unit: 'V/m', shape, er, E0,
          sol: `Separation of variables with $V$ and $\\epsilon\\,\\partial V/\\partial n$ continuous gives ${f}. Here: ${round(val, 2)} V/m.`,
          trap: 'Sphere $3/(\\epsilon_r + 2)$, transverse cylinder $2/(\\epsilon_r + 1)$, spherical cavity $3\\epsilon_r/(2\\epsilon_r + 1)$.' };
      },
      verify: (p) => (p.shape === 'sphere' ? 3 * p.E0 / (p.er + 2) : p.shape === 'cylinder' ? 2 * p.E0 / (p.er + 1) : 3 * p.er * p.E0 / (2 * p.er + 1)) },
    { id: 'fim-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic BVP',
      make(r) {
        const shape = choose(r, ['sphere', 'cylinder']), mu = choose(r, [0.5, 2, 5, 10, 100, 1000]), B0 = choose(r, [10, 20, 50, 100]);
        const val = shape === 'sphere' ? 3 * mu * B0 / (mu + 2) : 2 * mu * B0 / (mu + 1);
        return { q: `A ${shape === 'sphere' ? 'sphere' : 'long cylinder (axis across the field)'} of linear magnetic material with $\\mu_r = ${mu}$ is placed in a uniform field of ${B0} mT. The field $B$ inside it is ______ mT (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, val * 0.005), unit: 'mT', shape, mu, B0,
          sol: `With no free current, $\\vec H = -\\nabla\\Phi_M$ and $\\Phi_M$ obeys Laplace's equation; $\\Phi_M$ and $\\mu\\,\\partial\\Phi_M/\\partial n$ are continuous. ${shape === 'sphere' ? '$B_{in} = \\dfrac{3\\mu_r}{\\mu_r + 2}B_0$' : '$B_{in} = \\dfrac{2\\mu_r}{\\mu_r + 1}B_0$'} $= ${round(val, 3)}$ mT. ${mu < 1 ? 'Diamagnetic: the field is weakened.' : 'It saturates at ' + (shape === 'sphere' ? '3' : '2') + '$B_0$ for very large $\\mu_r$.'}`,
          trap: 'The magnetic results are the dielectric ones with $E \\to B$, $\\epsilon_r \\to \\mu_r$ and an extra factor $\\mu_r$ (since $B = \\mu H$).' };
      },
      verify: (p) => (p.shape === 'sphere' ? 3 * p.mu * p.B0 / (p.mu + 2) : 2 * p.mu * p.B0 / (p.mu + 1)) },
    { id: 'fim-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dielectric images',
      make(r) {
        const e1 = choose(r, [1, 2, 4, 80]), e2 = choose(r, [1, 2, 3, 5, 80].filter((x) => x !== e1)), q = choose(r, [1, 2, 5]), d = choose(r, [0.5, 1, 2]);
        const qp = -(e2 - e1) / (e2 + e1);
        const F = K / e1 * (q * 1e-9) ** 2 * qp / (2 * d / 100) ** 2 * 1e6; // positive = repulsive
        return { q: `A charge of ${q} nC sits in a medium of $\\epsilon_r = ${e1}$, ${d} cm from its flat boundary with a medium of $\\epsilon_r = ${e2}$ (both linear and semi-infinite). Find the force on the charge in $\\mu$N, positive if it is pushed away from the boundary and negative if pulled towards it (three significant figures).`,
          answer: +F.toPrecision(3), tol: Math.abs(F) * 0.01, unit: 'μN', e1, e2, qc: q, d,
          sol: `Image in medium 1: $q' = -q\\dfrac{\\epsilon_2 - \\epsilon_1}{\\epsilon_2 + \\epsilon_1} = ${round(qp, 4)}q$ at distance $d$ beyond the boundary. $F = \\dfrac{qq'}{4\\pi\\epsilon_1(2d)^2} = \\dfrac{8.99\\times10^9}{${e1}}\\times\\dfrac{${round(qp, 4)}\\times(${q}\\times10^{-9})^2}{(${2 * d / 100})^2} = ${F.toPrecision(4)}$ $\\mu$N. ${e2 > e1 ? 'The other side is more polarisable: attraction.' : 'The other side is less polarisable: repulsion.'}`,
          trap: 'The image sign depends on which side is more polarisable, not on the sign of $q$.' };
      },
      verify: (p) => K / p.e1 * (p.qc * 1e-9) ** 2 * (-(p.e2 - p.e1) / (p.e2 + p.e1)) / (2 * p.d / 100) ** 2 * 1e6 },
    { id: 'fim-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      make(r) {
        const dir = choose(r, ['eps', 'x']);
        if (dir === 'eps') {
          const x = choose(r, [0.05, 0.1, 0.2, 0.3, 0.4, 0.5]);
          const val = (1 + 2 * x) / (1 - x);
          return { q: `In a dense non-polar dielectric, $N\\alpha/3\\epsilon_0 = ${x}$. Using the Clausius-Mossotti relation, $\\epsilon_r$ is ______ (to three decimal places).`, answer: round(val, 3), tol: val * 0.002, dir, x,
            sol: `$\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2} = x$ gives $\\epsilon_r = \\dfrac{1 + 2x}{1 - x} = \\dfrac{${round(1 + 2 * x, 3)}}{${round(1 - x, 3)}} = ${round(val, 4)}$. Without the local-field correction one would get $1 + 3x = ${round(1 + 3 * x, 3)}$, too small.`,
            trap: 'The local field enhances the response: CM gives a larger $\\epsilon_r$ than $1 + N\\alpha/\\epsilon_0$.' };
        }
        const er = choose(r, [1.5, 2, 2.25, 3, 4, 6]);
        const val = (er - 1) / (er + 2);
        return { q: `A dense non-polar liquid has $\\epsilon_r = ${er}$. Using the Clausius-Mossotti relation, $N\\alpha/3\\epsilon_0$ is ______ (to three decimal places).`, answer: round(val, 3), tol: Math.max(0.001, val * 0.002), dir, er,
          sol: `$\\dfrac{N\\alpha}{3\\epsilon_0} = \\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2} = \\dfrac{${round(er - 1, 3)}}{${round(er + 2, 3)}} = ${round(val, 4)}$.`,
          trap: 'The left side is $(\\epsilon_r - 1)/(\\epsilon_r + 2)$, not $(\\epsilon_r - 1)/3$.' };
      },
      verify: (p) => (p.dir === 'eps' ? (1 + 2 * p.x) / (1 - p.x) : (p.er - 1) / (p.er + 2)) },
    { id: 'fim-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound current',
      make(r) {
        const kind = choose(r, ['phi', 'z']), n = int(r, 1, 3), f = choose(r, [0.25, 0.5, 0.75]);
        // M = k s^n phi-hat: J = (n+1) k s^(n-1) z-hat. M = k s^n z-hat: J = -n k s^(n-1) phi-hat.
        const val = (kind === 'phi' ? (n + 1) : -n) * Math.pow(f, n - 1);
        return { q: `A long cylinder of radius $R$ (axis $z$) has magnetisation $\\vec M = k${n === 1 ? 's' : `s^${n}`}\\,\\hat${kind === 'phi' ? '\\phi' : ' z'}$. The bound volume current density at $s = ${f}R$ is $\\kappa\\,k${n === 1 ? '' : n === 2 ? 'R' : 'R^2'}$ along $\\hat${kind === 'phi' ? ' z' : '\\phi'}$. Find $\\kappa$ (to three decimal places, with sign).`,
          answer: round(val, 3), tol: Math.max(0.001, Math.abs(val) * 0.005), kind, n, f,
          sol: kind === 'phi' ? `$\\nabla\\times(M_\\phi\\hat\\phi) = \\dfrac1s\\dfrac{d}{ds}(sM_\\phi)\\hat z = \\dfrac1s\\dfrac{d}{ds}(ks^{${n + 1}})\\hat z = ${n + 1}ks^{${n - 1}}\\hat z$. At $s = ${f}R$: $\\kappa = ${n + 1}\\times(${f})^{${n - 1}} = ${round(val, 4)}$.` : `$\\nabla\\times(M_z\\hat z) = -\\dfrac{dM_z}{ds}\\hat\\phi = -${n}ks^{${n - 1}}\\hat\\phi$. At $s = ${f}R$: $\\kappa = -${n}\\times(${f})^{${n - 1}} = ${round(val, 4)}$.`,
          trap: 'For $M_\\phi$ the curl has the extra factor $s$ inside the derivative.' };
      },
      verify: (p) => (p.kind === 'phi' ? (p.n + 1) : -p.n) * Math.pow(p.f, p.n - 1) },
    { id: 'fim-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cavity fields',
      make(r) {
        const C = choose(r, [
          ['a long thin needle along the field', '$\\vec E$'],
          ['a thin flat disc with its faces normal to the field', '$\\vec E + \\vec P/\\epsilon_0$'],
          ['a small sphere', '$\\vec E + \\vec P/3\\epsilon_0$'],
          ['a long thin cylinder lying across the field', '$\\vec E + \\vec P/2\\epsilon_0$'],
        ]);
        const all = ['$\\vec E$', '$\\vec E + \\vec P/\\epsilon_0$', '$\\vec E + \\vec P/3\\epsilon_0$', '$\\vec E + \\vec P/2\\epsilon_0$', '$\\vec E - \\vec P/3\\epsilon_0$'];
        const o = mcqOptions(r, C[1], all.filter((x) => x !== C[1]), (v) => v);
        return { q: `In a uniformly polarised dielectric (macroscopic field $\\vec E$, polarisation $\\vec P$), a small cavity is cut in the shape of ${C[0]}. The field in the cavity is`, ...o,
          sol: `Cutting the cavity removes polarised material; the cavity walls then carry $\\sigma_b = -\\vec P\\cdot\\hat n_{out}$ of the removed piece, which adds $N\\vec P/\\epsilon_0$ with $N$ the depolarising factor of the shape: needle along the field 0, transverse cylinder 1/2, sphere 1/3, disc normal to the field 1. Here: ${C[1]}.`,
          trap: 'The cavity field is the macroscopic field minus the field of the removed piece, which was $-N\\vec P/\\epsilon_0$.' };
      } },
    { id: 'fim-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polar molecules',
      make(r) {
        const pD = choose(r, [0.5, 1.0, 1.5, 1.85, 2.5]), av = choose(r, [1, 1.5, 2.5, 4]), T = choose(r, [200, 300, 400, 500]);
        const p = pD * 3.33564e-30, a = 4 * PI * EPS0 * av * 1e-30, val = p * p / (3 * KB * T) / a;
        return { q: `A molecule has dipole moment ${pD} D and polarisability volume ${av}$\\times10^{-30}$ m$^3$. At ${T} K, the ratio of the orientational contribution $p^2/3k_BT$ to the induced polarisability $\\alpha$ is ______ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, pD, av, T,
          sol: `$p = ${pD}\\times3.336\\times10^{-30} = ${p.toPrecision(4)}$ C m; $\\alpha = 4\\pi\\epsilon_0\\times${av}\\times10^{-30} = ${a.toPrecision(4)}$. $p^2/3k_BT = ${(p * p / (3 * KB * T)).toPrecision(4)}$. Ratio $= ${val.toPrecision(4)}$.`,
          trap: 'Remember $\\alpha = 4\\pi\\epsilon_0\\times$ (polarisability volume).' };
      },
      verify: (p) => (p.pD * 3.33564e-30) ** 2 / (3 * KB * p.T) / (4 * PI * EPS0 * p.av * 1e-30) },
    { id: 'fim-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'depolarisation',
      make(r) {
        const S = choose(r, [['sphere', 1 / 3], ['long cylinder magnetised across its axis', 1 / 2], ['long rod magnetised along its axis (far from the ends)', 0], ['thin wide plate magnetised normal to its faces', 1]]);
        const M = choose(r, [1, 2, 5, 8]) * 1e5, ask = choose(r, ['B', 'H']);
        const val = ask === 'B' ? MU0 * M * (1 - S[1]) * 1e3 : -S[1] * M / 1e3;
        return { q: `A ${S[0]} has uniform magnetisation $M = ${M / 1e5}\\times10^5$ A/m and there is no free current. ${ask === 'B' ? 'The field $B$ inside is ______ mT (to one decimal place).' : 'The component of $\\vec H$ inside along $\\vec M$ is ______ kA/m (to one decimal place, with sign).'}`,
          answer: round(val, 1), tol: Math.max(0.1, Math.abs(val) * 0.005), unit: ask === 'B' ? 'mT' : 'kA/m', N: S[1], M, ask,
          sol: `Demagnetising factor $N = ${round(S[1], 3)}$: $\\vec H_{in} = -N\\vec M$ and $\\vec B = \\mu_0(\\vec H + \\vec M) = \\mu_0(1 - N)\\vec M$. ${ask === 'B' ? `$B = 1.2566\\times10^{-6}\\times${round(1 - S[1], 3)}\\times${M} = ${round(val, 2)}$ mT.` : `$H = -${round(S[1], 3)}\\times${M} = ${round(val, 2)}$ kA/m.`}`,
          trap: '$\\vec H$ points against $\\vec M$ inside a magnet (except for a long rod far from its ends).' };
      },
      verify: (p) => (p.ask === 'B' ? MU0 * p.M * (1 - p.N) * 1e3 : -p.N * p.M / 1e3) },
    { id: 'fim-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dielectric BVP',
      make(r) {
        const shape = choose(r, ['sphere', 'cylinder']), er = choose(r, [2, 3, 4, 6, 10]), E0 = choose(r, [1, 2, 5, 10]), ang = choose(r, [0, 30, 45, 60]);
        const P = shape === 'sphere' ? 3 * EPS0 * (er - 1) / (er + 2) * E0 * 1e3 : 2 * EPS0 * (er - 1) / (er + 1) * E0 * 1e3;
        const val = P * Math.cos(ang * PI / 180) * 1e9;
        return { q: `A ${shape === 'sphere' ? 'sphere' : 'long cylinder (axis across the field)'} of linear dielectric with $\\epsilon_r = ${er}$ is in a uniform field of ${E0} kV/m. The bound surface charge density where the outward normal makes ${ang}$^\\circ$ with the field is ______ nC/m$^2$ (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, val * 0.01), unit: 'nC/m²', shape, er, E0, ang,
          sol: `${shape === 'sphere' ? '$P = 3\\epsilon_0\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0$' : '$P = 2\\epsilon_0\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 1}E_0$'} $= ${round(P * 1e9, 3)}$ nC/m$^2$, uniform; $\\sigma_b = P\\cos${ang}^\\circ = ${round(val, 3)}$ nC/m$^2$.`,
          trap: 'Use the field inside the body, not $E_0$, in $P = \\epsilon_0\\chi_eE$.' };
      },
      verify: (p) => (p.shape === 'sphere' ? 3 * EPS0 * (p.er - 1) / (p.er + 2) : 2 * EPS0 * (p.er - 1) / (p.er + 1)) * p.E0 * 1e3 * Math.cos(p.ang * PI / 180) * 1e9 },
    { id: 'fim-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound charge',
      make(r) {
        const q = choose(r, [1, 2, 5]), a = choose(r, [1, 2]), b = a + choose(r, [1, 2, 3]), er = choose(r, [2, 3, 4, 5]), which = choose(r, ['inner', 'outer']);
        const s = (which === 'inner' ? -1 : 1) * q * 1e-9 * (er - 1) / er / (4 * PI * ((which === 'inner' ? a : b) / 100) ** 2) * 1e9;
        return { q: `A point charge of $+${q}$ nC is at the centre of a spherical shell of linear dielectric ($\\epsilon_r = ${er}$) with inner radius ${a} cm and outer radius ${b} cm. The bound surface charge density on the ${which} surface is ______ nC/m$^2$ (three significant figures, with sign).`,
          answer: +s.toPrecision(3), tol: Math.abs(s) * 0.01, unit: 'nC/m²', qc: q, a, b, er, which,
          sol: `$D = q/4\\pi r^2$; in the shell $P = \\dfrac{\\epsilon_r - 1}{\\epsilon_r}\\dfrac{q}{4\\pi r^2}$ outward. ${which === 'inner' ? 'Inner surface ($\\hat n = -\\hat r$): $\\sigma_b = -P(a)$' : 'Outer surface ($\\hat n = +\\hat r$): $\\sigma_b = +P(b)$'} $= ${s.toPrecision(4)}$ nC/m$^2$. The totals on the two surfaces are $\\mp q(\\epsilon_r - 1)/\\epsilon_r$ and cancel.`,
          trap: 'Total bound charge on each surface is the same size; the densities differ by $(b/a)^2$.' };
      },
      verify: (p) => (p.which === 'inner' ? -1 : 1) * p.qc * 1e-9 * (p.er - 1) / p.er / (4 * PI * ((p.which === 'inner' ? p.a : p.b) / 100) ** 2) * 1e9 },
    { id: 'fim-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'energy',
      make(r) {
        const R = choose(r, [0.5, 1, 2]), er = choose(r, [2, 3, 4, 10]), E0 = choose(r, [1, 2, 5]);
        const W = -2 * PI * EPS0 * (R / 100) ** 3 * (er - 1) / (er + 2) * (E0 * 1e5) ** 2 * 1e6;
        return { q: `A sphere of linear dielectric ($\\epsilon_r = ${er}$, radius ${R} cm) is placed in a uniform field of ${E0}$\\times10^5$ V/m. The energy $-\\tfrac12\\vec p\\cdot\\vec E_0$ is ______ $\\mu$J (three significant figures, with sign).`,
          answer: +W.toPrecision(3), tol: Math.abs(W) * 0.01, unit: 'μJ', R, er, E0,
          sol: `$p = 4\\pi\\epsilon_0R^3\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0$, so $W = -2\\pi\\epsilon_0R^3\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0^2 = -2\\pi\\times8.854\\times10^{-12}\\times(${R / 100})^3\\times${round((er - 1) / (er + 2), 4)}\\times(${E0}\\times10^5)^2 = ${W.toPrecision(4)}$ $\\mu$J.`,
          trap: 'The factor $\\tfrac12$: the moment is induced, not permanent.' };
      },
      verify: (p) => -2 * PI * EPS0 * (p.R / 100) ** 3 * (p.er - 1) / (p.er + 2) * (p.E0 * 1e5) ** 2 * 1e6 },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
