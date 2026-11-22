// Radiation from dipoles and accelerated charges: retarded fields and the radiation zone, oscillating electric and
// magnetic dipoles, the Larmor formula and its relativistic (Liénard) form, antennas (radiation resistance,
// directivity, simple arrays), Thomson and Rayleigh scattering, radiation reaction, synchrotron and cyclotron
// radiation, and the classical atom (GATE/NET level).
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt, C } from '../_util.js';
import more from './radiation.more.gen.js';
import more2 from './radiation.more2.gen.js';

const c = C.c;
const ETA0 = Math.sqrt(C.mu0 / C.eps0);
const RE = (C.e * C.e) / (4 * Math.PI * C.eps0 * C.me * c * c); // classical electron radius
const SIGT = (8 * Math.PI / 3) * RE * RE;
const larmor = (q, a) => (q * q * a * a) / (6 * Math.PI * C.eps0 * c ** 3);
const MEV = 0.51099895; // electron rest energy in MeV
const MP = C.mp;

export default {
  topic: 'radiation',
  items: [
    // ---------- level 1 ----------
    { id: 'rdn-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'radiation zone',
      q: 'Far from an oscillating electric dipole, the amplitude of its radiation electric field falls with distance $r$ as',
      options: ['$1/r^3$', '$1/r^2$', '$1/r$', '$e^{-r}$'], answer: 2,
      sol: 'The radiation fields go as $1/r$, so the intensity goes as $1/r^2$ and the power through a sphere, intensity times $4\\pi r^2$, is the same at every radius: energy really leaves. The $1/r^2$ and $1/r^3$ terms are the induction and quasi-static fields, which carry no net power away.',
      trap: '$1/r^3$ is the static dipole field, which dominates only close in ($r \\ll \\lambda$).' },
    { id: 'rdn-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'For a slowly moving charge, the total power radiated (Larmor formula) is proportional to',
      options: ['its acceleration', 'the square of its acceleration', 'the square of its speed', 'its charge'], answer: 1,
      sol: '$P = \\dfrac{q^2a^2}{6\\pi\\epsilon_0c^3}$: proportional to $q^2a^2$. Speed does not enter (for $v \\ll c$); a charge at constant velocity does not radiate.',
      trap: 'The charge enters squared, so the sign of $q$ does not matter.' },
    { id: 'rdn-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'In which direction does an oscillating (Hertzian) electric dipole radiate no power?',
      options: ['Along its own axis', 'Perpendicular to its axis', 'At $45^\\circ$ to its axis', 'None: it radiates equally in all directions'], answer: 0,
      sol: 'The intensity goes as $\\sin^2\\theta$, with $\\theta$ measured from the dipole axis: zero along the axis, largest in the equatorial plane. Seen end-on, the charges show no transverse acceleration.',
      trap: 'A dipole antenna gives no signal off its ends.' },
    { id: 'rdn-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'An oscillating electric dipole keeps the same amplitude $p_0$ while its frequency is doubled. The radiated power is multiplied by ______.',
      answer: 16, tol: 0, calc: () => 2 ** 4,
      sol: '$P = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$, so doubling $\\omega$ multiplies $P$ by $2^4 = 16$. The same $\\omega^4$ makes the sky blue.',
      trap: 'The field goes as $\\omega^2$ (the acceleration), the power as $\\omega^4$.' },
    { id: 'rdn-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'scattering',
      q: 'The daytime sky is blue mainly because',
      options: ['blue light is absorbed less by air', 'sunlight contains more blue than red', 'oxygen emits blue light', 'scattering by molecules much smaller than the wavelength grows as $1/\\lambda^4$'], answer: 3,
      sol: 'A molecule is a dipole driven well below its resonance, so its induced dipole is nearly independent of frequency and the scattered power goes as $\\omega^4 \\propto 1/\\lambda^4$ (Rayleigh). Violet is scattered even more, but the Sun emits less of it and our eyes are less sensitive to it.',
      trap: 'Absorption has nothing to do with it; the blue light is redirected, not removed.' },
    { id: 'rdn-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'antennas',
      q: 'A short dipole antenna of length $l = \\lambda/20$ carries a uniform current. Using $R_{\\text{rad}} = \\dfrac{2\\pi}{3}\\eta_0\\left(\\dfrac{l}{\\lambda}\\right)^2 \\approx 790(l/\\lambda)^2\\ \\Omega$, its radiation resistance is ______ $\\Omega$ (to two decimal places).',
      answer: 1.97, tol: 0.02, unit: 'Ω', calc: () => ((2 * Math.PI) / 3) * ETA0 / 400,
      sol: '$R = 789.6\\times(1/20)^2 = 789.6/400 = 1.97\\ \\Omega$. Short antennas have tiny radiation resistance, which is why they are hard to match and lose much of their power as heat.',
      trap: 'Forgetting to square $l/\\lambda$ gives 39.5 $\\Omega$.' },

    // ---------- level 2 ----------
    { id: 'rdn-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'An electron has an acceleration of $1.0\\times10^{18}$ m/s$^2$ (non-relativistic). The power it radiates is $N\\times10^{-18}$ W. Find $N$ (to two decimal places).',
      answer: 5.71, tol: 0.03, calc: () => larmor(C.e, 1e18) * 1e18,
      sol: '$P = \\dfrac{e^2a^2}{6\\pi\\epsilon_0c^3} = \\dfrac{(1.602\\times10^{-19})^2\\times10^{36}}{6\\pi\\times8.854\\times10^{-12}\\times(3.0\\times10^8)^3} = \\dfrac{2.566\\times10^{-2}}{4.50\\times10^{15}} = 5.71\\times10^{-18}$ W.',
      trap: 'The denominator has $c^3$, a huge number: radiation from single charges is feeble.' },
    { id: 'rdn-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'The time-averaged power radiated by an electric dipole $p_0\\cos\\omega t$ is',
      options: ['$\\dfrac{\\mu_0p_0^2\\omega^2}{6\\pi c}$', '$\\dfrac{\\mu_0p_0\\omega^4}{12\\pi c^2}$', '$\\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$', '$\\dfrac{p_0^2\\omega^4}{12\\pi\\epsilon_0}$'], answer: 2,
      sol: 'With $\\ddot p = -\\omega^2p_0\\cos\\omega t$, Larmor gives $P(t) = \\dfrac{\\mu_0\\ddot p^2}{6\\pi c}$; the average of $\\cos^2$ is $\\tfrac12$, so $\\langle P\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$. Check units: the last option is missing $c^3$.',
      trap: 'The $\\tfrac12$ from time averaging turns $6\\pi$ into $12\\pi$.' },
    { id: 'rdn-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'radiation zone',
      q: 'In the radiation zone of any localised source in vacuum, which statements are true?',
      options: ['The total power through a sphere of radius $r$ grows with $r$', '$\\vec E$, $\\vec B$ and $\\hat r$ are mutually perpendicular', '$|\\vec E| = c|\\vec B|$', 'Both fields fall as $1/r$'], answer: [1, 2, 3],
      sol: 'Far away the radiation fields look locally like a plane wave moving outwards: transverse, with $E = cB$, and both $\\propto 1/r$. The power through a sphere, $\\propto r^2\\times(1/r)^2$, is independent of $r$ (energy conservation), not growing.',
      trap: 'Constant power through every sphere is the signature of radiation.' },
    { id: 'rdn-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scattering',
      q: 'The Thomson cross-section $\\sigma_T = \\frac{8\\pi}{3}r_e^2$, with classical electron radius $r_e = 2.818\\times10^{-15}$ m, is $N\\times10^{-29}$ m$^2$. Find $N$ (to two decimal places).',
      answer: 6.65, tol: 0.02, calc: () => SIGT * 1e29,
      sol: '$\\sigma_T = \\frac{8\\pi}{3}(2.818\\times10^{-15})^2 = 8.378\\times7.941\\times10^{-30} = 6.65\\times10^{-29}$ m$^2$. It is the ratio of power scattered by a free electron to the incident intensity, and is independent of frequency (for $\\hbar\\omega \\ll m_ec^2$).',
      trap: 'Using the Bohr radius instead of $r_e$ is off by $10^{9}$ in area.' },
    { id: 'rdn-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magnetic dipole',
      q: 'A small current loop with magnetic moment $m_0\\cos\\omega t$ radiates a time-averaged power',
      options: ['$\\dfrac{\\mu_0m_0^2\\omega^4}{12\\pi c^3}$', '$\\dfrac{\\mu_0m_0^2\\omega^4}{12\\pi c}$', '$\\dfrac{\\mu_0m_0^2\\omega^2}{12\\pi c^3}$', '$\\dfrac{\\mu_0m_0\\omega^4}{6\\pi c^2}$'], answer: 0,
      sol: 'Magnetic dipole radiation is the electric-dipole result with $p_0 \\to m_0/c$: $\\langle P\\rangle = \\dfrac{\\mu_0m_0^2\\omega^4}{12\\pi c^3}$. Units check: $m_0$ is in A m$^2$, and $m_0/c$ has the units of a dipole moment in C m.',
      trap: 'The extra $c^2$ in the denominator is what makes magnetic dipole radiation weak.' },
    { id: 'rdn-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      q: 'The radiation resistance of a thin half-wave dipole antenna is about',
      options: ['$790\\ \\Omega$', '$377\\ \\Omega$', '$73\\ \\Omega$', '$2\\ \\Omega$'], answer: 2,
      sol: 'Integrating the half-wave current distribution\'s far-field pattern gives $R_{\\text{rad}} \\approx 73\\ \\Omega$, close to 75 $\\Omega$ coaxial cable, which is one reason half-wave dipoles are so common. The short-dipole formula $790(l/\\lambda)^2$ would give 197 $\\Omega$ at $l = \\lambda/2$, because the real current is not uniform.',
      trap: 'The short-dipole formula assumes uniform current and fails for $l = \\lambda/2$.' },
    { id: 'rdn-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scattering',
      q: 'By what factor is blue light of 450 nm scattered more strongly by air molecules than red light of 700 nm? (to two decimal places)',
      answer: 5.86, tol: 0.03, calc: () => (700 / 450) ** 4,
      sol: 'Rayleigh scattering $\\propto 1/\\lambda^4$: $(700/450)^4 = 1.556^4 = 5.86$.',
      trap: 'The ratio is the fourth power, not the square.' },
    { id: 'rdn-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'A slowly moving charge accelerates along $\\hat z$. An observer far away in direction $\\hat n$ sees a radiation electric field that is',
      options: ['along $\\hat n$', 'along the part of the acceleration perpendicular to $\\hat n$ (up to sign)', 'along $\\hat n\\times\\hat z$', 'zero unless $\\hat n$ is along $\\hat z$'], answer: 1,
      sol: '$\\vec E_{\\text{rad}} = \\dfrac{q}{4\\pi\\epsilon_0c^2r}\\,\\hat n\\times(\\hat n\\times\\vec a) = \\dfrac{q}{4\\pi\\epsilon_0c^2r}\\left[(\\hat n\\cdot\\vec a)\\hat n - \\vec a\\right]$: minus the part of $\\vec a$ transverse to the line of sight. So the radiation is linearly polarised in the plane of $\\hat n$ and $\\vec a$, and vanishes along $\\vec a$.',
      trap: '$\\hat n\\times\\hat z$ is the direction of the magnetic field, not the electric.' },
    { id: 'rdn-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      q: 'A 1.0 m long short dipole carries a uniform current of amplitude 10 A at 3.0 MHz ($\\lambda = 100$ m). Using $R_{\\text{rad}} = 790(l/\\lambda)^2\\ \\Omega$, the radiated power is ______ W (to two decimal places).',
      answer: 3.95, tol: 0.03, unit: 'W', calc: () => 0.5 * 100 * ((2 * Math.PI) / 3) * ETA0 * 1e-4,
      sol: '$R = 790\\times(0.01)^2 = 0.079\\ \\Omega$. With amplitude $I_0$, $\\langle P\\rangle = \\tfrac12I_0^2R = \\tfrac12\\times100\\times0.079 = 3.95$ W.',
      trap: 'For an amplitude (peak) current the power has a factor $\\tfrac12$; for an rms current it does not.' },
    { id: 'rdn-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'radiation zone',
      q: 'Which statements about the fields of an oscillating dipole (size $d \\ll \\lambda$) are true?',
      options: ['A steady current in a closed loop radiates', 'For $r \\ll \\lambda$ the quasi-static $1/r^3$ field dominates', 'The radiation description needs $r \\gg \\lambda$', 'The $1/r$ part exists only because the charges accelerate'], answer: [1, 2, 3],
      sol: 'The full field has $1/r^3$, $1/r^2$ and $1/r$ terms with relative sizes $1 : kr : (kr)^2$. Close in ($kr \\ll 1$) the static term wins; far out ($kr \\gg 1$) the $1/r$ term wins. The $1/r$ term is proportional to $\\ddot p$ (acceleration). A steady current has no time dependence, so nothing radiates.',
      trap: 'Moving charges are not enough: radiation needs acceleration (changing current).' },
    { id: 'rdn-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      q: 'The directivity (peak intensity over average intensity) of a short (Hertzian) dipole is',
      options: ['1', '1.5', '1.64', '2'], answer: 1,
      sol: 'Intensity $\\propto \\sin^2\\theta$. Its average over the sphere is $\\frac{1}{4\\pi}\\int\\sin^2\\theta\\,d\\Omega = \\frac23$, so peak over average is $1/(2/3) = 1.5$. A half-wave dipole is slightly more directive, 1.64.',
      trap: '1.64 belongs to the half-wave dipole.' },
    { id: 'rdn-039', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'At the same distance from an oscillating electric dipole, what is the ratio of the intensity at $30^\\circ$ from its axis to that at $60^\\circ$? (to three decimal places)',
      answer: 0.333, tol: 0.002, calc: () => Math.sin(Math.PI / 6) ** 2 / Math.sin(Math.PI / 3) ** 2,
      sol: '$I \\propto \\sin^2\\theta$: $\\dfrac{\\sin^230^\\circ}{\\sin^260^\\circ} = \\dfrac{1/4}{3/4} = \\dfrac13 = 0.333$.',
      trap: 'The angle is measured from the dipole axis, not from the equatorial plane.' },

    // ---------- level 3 ----------
    { id: 'rdn-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'classical atom',
      q: 'In a classical hydrogen atom the electron would radiate and spiral in from the Bohr radius $a_0$. Larmor\'s formula gives a collapse time $t = \\dfrac{a_0^3}{4r_e^2c}$. This is $N\\times10^{-11}$ s. Find $N$ (to two decimal places; $a_0 = 5.292\\times10^{-11}$ m, $r_e = 2.818\\times10^{-15}$ m).',
      answer: 1.56, tol: 0.02, calc: () => C.a0 ** 3 / (4 * RE * RE * c) * 1e11,
      sol: 'Energy $E = -\\frac{e^2}{8\\pi\\epsilon_0r}$ and $P = \\frac{e^2a^2}{6\\pi\\epsilon_0c^3}$ with $a = \\frac{e^2}{4\\pi\\epsilon_0mr^2}$ give $\\frac{e^2}{8\\pi\\epsilon_0r^2}\\dot r = -P$, which simplifies to $\\dot r = -\\frac{4r_e^2c}{3r^2}$. So $r^2dr = -\\frac43r_e^2c\\,dt$; integrating from $a_0$ to 0 gives $\\frac{a_0^3}{3} = \\frac43r_e^2ct$, i.e. $t = \\frac{a_0^3}{4r_e^2c} = \\frac{1.482\\times10^{-31}}{4\\times7.94\\times10^{-30}\\times3.0\\times10^8} = 1.56\\times10^{-11}$ s.',
      trap: 'This failure of classical physics is one of the reasons quantum mechanics was needed.' },
    { id: 'rdn-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'A vertical short dipole antenna radiates a total of 1.0 kW. Ignoring the ground, the intensity 10 km away in its horizontal (equatorial) plane is ______ $\\mu$W/m$^2$ (to two decimal places).',
      answer: 1.19, tol: 0.01, unit: 'μW/m²', calc: () => (3 * 1000) / (8 * Math.PI * 1e8) * 1e6,
      sol: '$I(\\theta) = \\dfrac{3P}{8\\pi r^2}\\sin^2\\theta$ (since $\\int\\sin^2\\theta\\,d\\Omega = 8\\pi/3$). At $\\theta = 90^\\circ$: $\\dfrac{3000}{8\\pi\\times10^8} = 1.19\\times10^{-6}$ W/m$^2$, 1.5 times the isotropic value $P/4\\pi r^2$.',
      trap: 'An isotropic estimate misses the directivity factor 1.5.' },
    { id: 'rdn-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'relativistic radiation',
      q: 'For an ultra-relativistic charge with Lorentz factor $\\gamma$, at a given magnitude of acceleration, the radiated power scales as',
      options: ['$\\gamma^2$ for both linear and circular motion', '$\\gamma^4$ for linear and $\\gamma^6$ for circular motion', '$\\gamma^6$ for linear and $\\gamma^4$ for circular motion', '$\\gamma^0$: Larmor holds at all speeds'], answer: 2,
      sol: 'Liénard: $P = \\dfrac{\\mu_0q^2\\gamma^6}{6\\pi c}\\left(a^2 - \\dfrac{|\\vec v\\times\\vec a|^2}{c^2}\\right)$. With $\\vec a \\parallel \\vec v$ the bracket is $a^2$: $\\gamma^6$. With $\\vec a \\perp \\vec v$ it is $a^2(1 - \\beta^2) = a^2/\\gamma^2$: $\\gamma^4$.',
      trap: 'Yet for a given force, linear acceleration radiates far less: $a = F/(\\gamma^3m)$ along $v$ but $F/(\\gamma m)$ across it.' },
    { id: 'rdn-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'synchrotron radiation',
      q: 'Electrons of 3.0 GeV circulate in a storage ring with bending radius 10 m. The energy each electron radiates per turn, $\\Delta E = \\dfrac{e^2\\beta^3\\gamma^4}{3\\epsilon_0R}$, is ______ keV (nearest keV).',
      answer: 717, tol: 3, unit: 'keV', calc: () => (C.e * (3000 / MEV) ** 4) / (3 * C.eps0 * 10) / 1e3,
      sol: '$\\gamma = 3000/0.511 = 5871$, so $\\gamma^4 = 1.19\\times10^{15}$ and $\\beta \\approx 1$. In eV, $\\Delta E/e = \\dfrac{e\\gamma^4}{3\\epsilon_0R} = \\dfrac{1.602\\times10^{-19}\\times1.19\\times10^{15}}{3\\times8.854\\times10^{-12}\\times10} = 7.17\\times10^5$ eV, about 717 keV. The RF cavities must put this back every turn. (Engineers write $88.5\\,E^4[\\text{GeV}]/R[\\text{m}]$ keV.)',
      trap: 'The $\\gamma^4$ makes electron rings expensive; protons of the same energy lose $(m_e/m_p)^4$ as much.' },
    { id: 'rdn-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'scattering',
      q: 'Which statements about Thomson scattering of light by free electrons are true?',
      options: ['Its cross-section does not depend on the frequency', 'For unpolarised incident light, the light scattered at $90^\\circ$ is fully linearly polarised', 'It applies when the photon energy is much larger than $m_ec^2$', 'The cross-section for a free proton is smaller by $(m_e/m_p)^2$'], answer: [0, 1, 3],
      sol: 'The electron is driven at the frequency of the light with $\\ddot x = -eE/m$, so $\\sigma_T = \\frac{8\\pi}{3}\\left(\\frac{q^2}{4\\pi\\epsilon_0mc^2}\\right)^2$: no $\\omega$, and $\\propto 1/m^2$. At $90^\\circ$ only the incident polarisation perpendicular to the scattering plane can radiate towards the observer. When $\\hbar\\omega \\gtrsim m_ec^2$, recoil matters and Compton (Klein-Nishina) scattering replaces it.',
      trap: 'Thomson is the low-energy limit of Compton scattering.' },
    { id: 'rdn-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radiation reaction',
      q: 'The Abraham-Lorentz force on a radiating electron is $m\\tau\\dddot{x}$ with $\\tau = \\dfrac{e^2}{6\\pi\\epsilon_0m_ec^3}$. This time is $N\\times10^{-24}$ s. Find $N$ (to two decimal places).',
      answer: 6.27, tol: 0.03, calc: () => (C.e * C.e) / (6 * Math.PI * C.eps0 * C.me * c ** 3) * 1e24,
      sol: '$\\tau = \\dfrac{(1.602\\times10^{-19})^2}{6\\pi\\times8.854\\times10^{-12}\\times9.109\\times10^{-31}\\times(3.0\\times10^8)^3} = 6.27\\times10^{-24}$ s, the time for light to cross about two-thirds of $r_e$. Radiation reaction matters only for motions that change on this time scale.',
      trap: '$\\tau = \\frac23\\frac{r_e}{c}$: a useful check.' },
    { id: 'rdn-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'synchrotron radiation',
      q: 'An ultra-relativistic electron moves in a circle. An observer in the plane of the orbit sees its radiation',
      options: ['spread evenly over all directions, as for a slow charge', 'emitted backwards, opposite to the velocity', 'emitted mainly along the radius, towards the centre', 'concentrated in a narrow forward cone of half-angle about $1/\\gamma$ around the velocity, arriving as short flashes'], answer: 3,
      sol: 'In the instantaneous rest frame the pattern is the dipole $\\sin^2$ shape. Transforming to the lab, aberration crowds all of it into angles of order $1/\\gamma$ about $\\vec v$. The observer sees a pulse each time the cone sweeps past, lasting about $R/(c\\gamma^3)$, so the spectrum extends to roughly $\\gamma^3$ times the orbital frequency: X-rays from a GeV ring.',
      trap: 'The slow-charge (cyclotron) pattern is broad; the relativistic one is a searchlight.' },
    { id: 'rdn-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'antennas',
      q: 'A small circular loop antenna has circumference $0.10\\lambda$. From $P = \\mu_0m_0^2\\omega^4/(12\\pi c^3)$ with $m_0 = I_0\\pi a^2$ its radiation resistance is $R = \\frac{\\pi}{6}\\eta_0(C/\\lambda)^4$. Find $R$ in m$\\Omega$ (to one decimal place).',
      answer: 19.7, tol: 0.2, unit: 'mΩ', calc: () => (Math.PI / 6) * ETA0 * 1e-4 * 1e3,
      sol: 'Set $\\tfrac12I_0^2R = \\dfrac{\\mu_0(I_0\\pi a^2)^2\\omega^4}{12\\pi c^3}$, so $R = \\dfrac{\\mu_0\\pi a^4\\omega^4}{6c^3}$; with $\\omega = 2\\pi c/\\lambda$ and $a = C/2\\pi$ this is $\\frac{\\pi}{6}\\eta_0(C/\\lambda)^4 = 197.3\\times10^{-4}\\ \\Omega = 19.7$ m$\\Omega$. That is far below a short dipole of similar size, which is why small loops are poor transmitters (but useful receivers).',
      trap: 'A loop\'s radiation resistance goes as the fourth power of its size; a dipole\'s as the square.' },
    { id: 'rdn-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'Which of these does NOT radiate?',
      options: ['A charge in uniform circular motion', 'An electron slowing down in the target of an X-ray tube', 'A charge moving with constant velocity in vacuum', 'An oscillating electric dipole'], answer: 2,
      sol: 'Radiation needs acceleration. Circular motion has centripetal acceleration (cyclotron or synchrotron radiation); stopping electrons give bremsstrahlung; an oscillating dipole has $\\ddot p \\ne 0$. A uniformly moving charge has a field that simply moves with it (it is a boosted Coulomb field) and carries no energy to infinity.',
      trap: 'Constant speed in a circle is still acceleration.' },
    { id: 'rdn-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'A dipole of amplitude $p_0 = 1.0\\times10^{-11}$ C m oscillates at 1.0 GHz. The time-averaged power it radiates is ______ W (to one decimal place).',
      answer: 17.3, tol: 0.2, unit: 'W', calc: () => (C.mu0 * 1e-22 * (2 * Math.PI * 1e9) ** 4) / (12 * Math.PI * c),
      sol: '$\\omega = 6.283\\times10^9$ rad/s, $\\omega^4 = 1.559\\times10^{39}$. $P = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c} = \\dfrac{1.257\\times10^{-6}\\times10^{-22}\\times1.559\\times10^{39}}{12\\pi\\times3.0\\times10^8} = \\dfrac{1.96\\times10^{11}}{1.13\\times10^{10}} = 17.3$ W.',
      trap: 'Use $\\omega = 2\\pi f$; with $f$ the answer is $(2\\pi)^4 \\approx 1559$ times too small.' },
    { id: 'rdn-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Larmor formula',
      q: 'A slowly moving charge accelerates along a fixed line. The intensity it radiates at $30^\\circ$ to that line, compared with the intensity at $90^\\circ$ (same distance), is',
      options: ['$1/2$', '$1/4$', '$\\sqrt3/2$', '$3/4$'], answer: 1,
      sol: '$\\dfrac{dP}{d\\Omega} = \\dfrac{q^2a^2}{16\\pi^2\\epsilon_0c^3}\\sin^2\\theta$ with $\\theta$ from the acceleration. $\\sin^230^\\circ = 1/4$ against $\\sin^290^\\circ = 1$.',
      trap: '$1/2$ is the field ratio; intensity is its square.' },
    { id: 'rdn-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cyclotron radiation',
      q: 'An electron with kinetic energy 1.0 keV circles in a 1.0 T magnetic field. The power it radiates (Larmor) is $N\\times10^{-17}$ W. Find $N$ (to two decimal places).',
      answer: 6.21, tol: 0.03, calc: () => { const v = Math.sqrt((2 * 1000 * C.e) / C.me); return larmor(C.e, (C.e / C.me) * v) * 1e17; },
      sol: '$v = \\sqrt{2K/m} = 1.875\\times10^7$ m/s (non-relativistic). $a = evB/m = 1.759\\times10^{11}\\times1.875\\times10^7 = 3.30\\times10^{18}$ m/s$^2$. $P = \\dfrac{e^2a^2}{6\\pi\\epsilon_0c^3} = \\dfrac{2.566\\times10^{-38}\\times1.088\\times10^{37}}{4.50\\times10^{15}} = 6.21\\times10^{-17}$ W.',
      trap: 'The acceleration is $v^2/r = evB/m$, not $eB/m$ (that is the angular frequency).' },
    { id: 'rdn-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'antennas',
      q: 'Comparing a half-wave dipole with a short (Hertzian) dipole, which statements are true?',
      options: ['The half-wave dipole has a null in the broadside direction', 'The half-wave dipole has directivity about 1.64', 'Its radiation resistance is about 73 $\\Omega$', 'A short dipole\'s radiation resistance scales as $(l/\\lambda)^2$'], answer: [1, 2, 3],
      sol: 'The half-wave pattern $\\left[\\frac{\\cos(\\frac\\pi2\\cos\\theta)}{\\sin\\theta}\\right]^2$ is a little narrower than $\\sin^2\\theta$ (directivity 1.64 against 1.5), with its maximum broadside and nulls along the wire. $R \\approx 73\\ \\Omega$. For a short dipole $R = 790(l/\\lambda)^2$.',
      trap: 'Both have their maximum broadside (perpendicular to the wire).' },

    // ---------- level 4 ----------
    { id: 'rdn-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cyclotron radiation',
      q: 'A non-relativistic electron gyrates in a uniform 1.0 T field and loses energy by cyclotron radiation. Its kinetic energy decays exponentially. The time constant is ______ s (to two decimal places).',
      answer: 2.58, tol: 0.02, unit: 's', calc: () => (3 * Math.PI * C.eps0 * C.me ** 3 * c ** 3) / (C.e ** 4 * 1),
      sol: '$P = \\dfrac{e^2}{6\\pi\\epsilon_0c^3}\\left(\\dfrac{eB}{m}\\right)^2v^2 = \\dfrac{e^4B^2}{3\\pi\\epsilon_0m^3c^3}K$ with $K = \\tfrac12mv^2$. So $dK/dt = -K/\\tau$ with $\\tau = \\dfrac{3\\pi\\epsilon_0m^3c^3}{e^4B^2} = 2.58$ s at 1 T, the same at every energy (as long as $v \\ll c$). It falls as $1/B^2$: in a 10 T fusion magnet, 26 ms.',
      trap: 'The time constant does not depend on the starting energy.' },
    { id: 'rdn-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'antennas',
      q: 'Two identical parallel vertical antennas stand a quarter wavelength apart on an east-west line. The western one is fed with current that leads the eastern one by $90^\\circ$. In the horizontal plane, the pair radiates',
      options: ['equally in all directions', 'mainly north and south, broadside to the line', 'mainly towards the east, the side of the lagging antenna', 'mainly towards the west, the side of the leading antenna'], answer: 2,
      sol: 'Going east, the eastern wave starts $90^\\circ$ behind but has a quarter wave ($90^\\circ$) less path: the two arrive in phase and add. Going west, the eastern wave is $90^\\circ$ behind and has $90^\\circ$ more path: $180^\\circ$ apart, they cancel. The pattern is a cardioid pointing east (an end-fire array).',
      trap: 'The beam points towards the element whose current lags.' },
    { id: 'rdn-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'relativistic radiation',
      q: 'An ultra-relativistic electron gains energy at 10 MeV per metre in a linear accelerator. For linear motion $P = \\dfrac{e^2}{6\\pi\\epsilon_0m^2c^3}\\left(\\dfrac{dp}{dt}\\right)^2$. The ratio of power radiated to power gained is $N\\times10^{-14}$. Find $N$ (to two decimal places).',
      answer: 3.68, tol: 0.03, calc: () => { const F = 10e6 * C.e; return (C.e * C.e * F * F) / (6 * Math.PI * C.eps0 * C.me ** 2 * c ** 3) / (F * c) * 1e14; },
      sol: '$dp/dt = dE/dx$ for $v \\approx c$, so $F = 10$ MeV/m $= 1.602\\times10^{-12}$ N. The gained power is $Fc$. Ratio $= \\dfrac{e^2F}{6\\pi\\epsilon_0m^2c^4} = \\dfrac{2.566\\times10^{-38}\\times1.602\\times10^{-12}}{1.669\\times10^{-10}\\times8.30\\times10^{-61}\\times8.08\\times10^{33}} = 3.68\\times10^{-14}$. Radiation loss in linear accelerators is negligible; in rings it is not.',
      trap: 'In linear acceleration the $\\gamma^6$ is cancelled by writing the power in terms of $dp/dt$.' },
    { id: 'rdn-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'radiation reaction',
      q: 'Which statement about the Abraham-Lorentz equation $m\\dot{\\vec v} = \\vec F + m\\tau\\ddot{\\vec v}$ is correct?',
      options: ['It has unphysical runaway solutions (acceleration growing as $e^{t/\\tau}$ with no force), and curing them leads to pre-acceleration on a time scale $\\tau$', 'It is exact at all distances and times', 'It predicts that a charge at rest radiates', 'It shows that radiation reaction is always larger than the applied force'], answer: 0,
      sol: 'With $\\vec F = 0$, $\\dot{\\vec v} = \\vec a_0e^{t/\\tau}$ is a solution: self-acceleration. Excluding it with a boundary condition at $t \\to \\infty$ makes the charge start accelerating about $\\tau \\approx 6\\times10^{-24}$ s before the force arrives. Both show the classical point-charge theory breaking down at time scales where quantum effects take over anyway.',
      trap: 'Radiation reaction is usually tiny; its conceptual problems appear only at the scale $\\tau$.' },
    { id: 'rdn-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'magnetic dipole',
      q: 'Compare oscillating magnetic dipole radiation (small loop) with oscillating electric dipole radiation. Which statements are true?',
      options: ['Both have the same $\\sin^2\\theta$ intensity pattern about the dipole axis', 'The roles of $\\vec E$ and $\\vec B$ are swapped, so the polarisations differ by $90^\\circ$', 'Magnetic dipole power grows as $\\omega^2$', 'For charges moving in a region of size $a$, magnetic dipole radiation is weaker by a factor of order $(ka)^2$'], answer: [0, 1, 3],
      sol: 'Replace $\\vec p \\to \\vec m/c$, $\\vec E \\to c\\vec B$, $c\\vec B \\to -\\vec E$: same pattern, rotated polarisation. Power $\\propto m_0^2\\omega^4/c^3$. Since $m \\sim qva \\sim q\\omega a^2$ while $p \\sim qa$, $(m/c)/p \\sim ka$, so power is down by $(ka)^2$, which is why magnetic dipole lines in atoms are weak.',
      trap: 'Both multipoles radiate as $\\omega^4$ at fixed moment.' },
    { id: 'rdn-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'synchrotron radiation',
      q: 'For the 3.0 GeV electrons in a ring with 10 m bending radius, the critical photon energy is $\\hbar\\omega_c = \\frac32\\hbar\\gamma^3c/R$. It is ______ keV (to two decimal places).',
      answer: 5.99, tol: 0.05, unit: 'keV', calc: () => (1.5 * C.hbar * (3000 / MEV) ** 3 * c) / 10 / C.e / 1e3,
      sol: '$\\gamma^3 = 5871^3 = 2.02\\times10^{11}$. $\\hbar c/R = 1.055\\times10^{-34}\\times3.0\\times10^8/10 = 3.16\\times10^{-27}$ J. So $\\hbar\\omega_c = 1.5\\times3.16\\times10^{-27}\\times2.02\\times10^{11} = 9.6\\times10^{-16}$ J $= 5.99$ keV: hard X-rays from a beam circulating at only about 5 MHz.',
      trap: 'The orbital frequency is multiplied by $\\gamma^3$, not $\\gamma$.' },
    { id: 'rdn-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'classical atom',
      q: 'Classical electrodynamics predicts that an orbiting atomic electron would',
      options: ['radiate only at the frequencies of the observed spectral lines', 'radiate nothing because its speed is constant', 'radiate in short bursts when it jumps between orbits', 'radiate continuously at its orbital frequency, which rises as it spirals in within about $10^{-11}$ s, giving a continuous spectrum'], answer: 3,
      sol: 'A circular orbit has centripetal acceleration, so Larmor gives steady radiation at the orbital frequency. Losing energy, the orbit shrinks and the frequency increases continuously, a "chirp" lasting about $1.6\\times10^{-11}$ s. Stable atoms and sharp lines contradict this; Bohr\'s postulates and then quantum mechanics replaced it.',
      trap: 'Jumps between orbits are Bohr\'s quantum idea, not a classical prediction.' },
    { id: 'rdn-044', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'relativistic radiation',
      q: 'X-ray tube electrons with speed close to $c$ are stopped in the target (acceleration opposite to velocity). Compared with the $\\sin^2\\theta$ pattern of a slow charge, their bremsstrahlung is',
      options: ['tilted backwards towards the electron source', 'exactly the same', 'tilted forwards, with lobes closer to the direction of motion (but still zero exactly along it)', 'emitted only exactly along the direction of motion'], answer: 2,
      sol: 'For $\\vec a \\parallel \\vec v$: $\\dfrac{dP}{d\\Omega} \\propto \\dfrac{\\sin^2\\theta}{(1 - \\beta\\cos\\theta)^5}$. The denominator favours forward angles, so the two lobes tilt forward, peaking near $\\theta \\approx 1/(2\\gamma)$ for large $\\gamma$, while $\\sin^2\\theta$ still forces zero exactly at $\\theta = 0$.',
      trap: 'Forward-peaked does not mean on-axis: the null along $\\vec v$ survives.' },

    // ---------- level 5 ----------
    { id: 'rdn-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'scattering',
      q: 'A small water droplet of radius 10 nm ($\\epsilon_r = 1.77$ at optical frequencies) scatters 500 nm light. Its Rayleigh cross-section $\\sigma = \\dfrac{8\\pi}{3}k^4a^6\\left(\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}\\right)^2$ is $N\\times10^{-21}$ m$^2$. Find $N$ (to two decimal places).',
      answer: 8.71, tol: 0.08, calc: () => (8 * Math.PI / 3) * (2 * Math.PI / 500e-9) ** 4 * 1e-48 * (0.77 / 3.77) ** 2 * 1e21,
      sol: 'The sphere becomes a dipole $p = 4\\pi\\epsilon_0a^3\\frac{\\epsilon_r - 1}{\\epsilon_r + 2}E_0$; its dipole radiation divided by the incident intensity gives the formula. $k = 1.257\\times10^7$ m$^{-1}$, $k^4 = 2.49\\times10^{28}$, $a^6 = 10^{-48}$, $(0.77/3.77)^2 = 0.0417$. So $\\sigma = 8.378\\times2.49\\times10^{28}\\times10^{-48}\\times0.0417 = 8.71\\times10^{-21}$ m$^2$, about $3\\times10^{-5}$ of its geometric cross-section.',
      trap: 'The $a^6$ dependence is why small particles scatter so weakly, and why haze grows rapidly as droplets swell.' },
    { id: 'rdn-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'synchrotron radiation',
      q: 'An electron and a proton, both ultra-relativistic with the same energy, move on circles of the same radius. The ratio of the power radiated by the proton to that by the electron is $N\\times10^{-14}$. Find $N$ (to two decimal places).',
      answer: 8.80, tol: 0.05, calc: () => (C.me / MP) ** 4 * 1e14,
      sol: 'For circular motion $P = \\dfrac{q^2c\\beta^4\\gamma^4}{6\\pi\\epsilon_0R^2}$. Same energy means $\\gamma \\propto 1/m$, with $\\beta \\approx 1$ for both. So $P_p/P_e = (m_e/m_p)^4 = (1/1836.15)^4 = 8.80\\times10^{-14}$. That is why the LHC can reach 7 TeV with protons in a ring where electrons of the same energy would be impossible.',
      trap: 'At equal energy (not equal speed), the mass enters to the fourth power.' },
    { id: 'rdn-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Liénard-Wiechert',
      q: 'Which statements about the Liénard-Wiechert fields of a point charge are true?',
      options: ['The radiation part is proportional to the acceleration and falls as $1/r$', 'The fields are evaluated at the retarded time', 'A charge in uniform motion sends a net flux of energy to infinity', 'For $v \\ll c$, the radiation pattern is $\\sin^2\\theta$ about the acceleration'], answer: [0, 1, 3],
      sol: 'The field splits into a velocity part ($\\propto 1/r^2$, a boosted Coulomb field) and an acceleration part ($\\propto \\dot{\\vec v}/r$). Only the second carries energy to infinity. Both are evaluated at $t_r = t - |\\vec r - \\vec w(t_r)|/c$. For small $v$, the acceleration part reduces to the Larmor $\\sin^2\\theta$ pattern.',
      trap: 'The velocity field falls as $1/r^2$, so its Poynting flux through a large sphere tends to zero.' },
    { id: 'rdn-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'radiation reaction',
      q: 'A classical electron oscillator at angular frequency $\\omega$ loses energy by radiation at rate $\\Gamma = \\omega^2\\tau$ ($\\tau = 6.27\\times10^{-24}$ s), giving a spectral line of full width $\\Delta\\omega = \\Gamma$. The corresponding width in wavelength is independent of $\\omega$. Find it, as $N\\times10^{-14}$ m (to two decimal places).',
      answer: 1.18, tol: 0.01, calc: () => 2 * Math.PI * c * (C.e * C.e) / (6 * Math.PI * C.eps0 * C.me * c ** 3) * 1e14,
      sol: '$\\Delta\\lambda = \\dfrac{\\lambda^2}{2\\pi c}\\Delta\\omega = \\dfrac{\\lambda^2\\omega^2\\tau}{2\\pi c} = 2\\pi c\\tau$ (using $\\lambda\\omega = 2\\pi c$). Numerically $2\\pi\\times3.0\\times10^8\\times6.27\\times10^{-24} = 1.18\\times10^{-14}$ m $= \\frac{4\\pi}{3}r_e$. Real atomic lines are narrower in proportion to their oscillator strength, but this classical value sets the scale (about $10^{-4}$ nm).',
      trap: 'The width in frequency grows as $\\omega^2$; in wavelength it is constant.' },
    { id: 'rdn-043', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'electric dipole',
      q: 'A rotating dipole $\\vec p = p_0(\\hat x\\cos\\omega t + \\hat y\\sin\\omega t)$ radiates. Which statements are true?',
      options: ['It radiates nothing along the $z$ axis', 'Along the $z$ axis its radiation is circularly polarised', 'In the $xy$ plane its radiation is linearly polarised', 'Its total power is twice that of a linear dipole of amplitude $p_0$'], answer: [1, 2, 3],
      sol: 'It is two perpendicular dipoles, $90^\\circ$ out of phase. Along $z$ both are fully transverse, equal and in quadrature: circular polarisation, at maximum intensity. Looking along $x$, only the $y$ dipole is transverse: linear polarisation. The cross terms average to zero, so the powers add: $2\\times\\frac{\\mu_0p_0^2\\omega^4}{12\\pi c}$.',
      trap: 'The $z$ axis is perpendicular to both dipoles, so it is the brightest direction, not dark.' },
    ...more2,
  ],

  gens: [
    { id: 'rdn-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      make(r) {
        const who = choose(r, ['electron', 'proton', 'alpha particle']), q = who === 'alpha particle' ? 2 * C.e : C.e;
        const m = int(r, 1, 9), e = int(r, 12, 22), a = m * 10 ** e, P = larmor(q, a), ex = Math.floor(Math.log10(P)), val = P / 10 ** ex, answer = round(val, 3);
        return { q: `A non-relativistic ${who} has acceleration $${m}\\times10^{${e}}$ m/s$^2$. The power it radiates is $N\\times10^{${ex}}$ W. Find $N$.`,
          answer, tol: Math.max(0.002, val * 0.005), q0: q, a, ex,
          sol: `$P = \\dfrac{q^2a^2}{6\\pi\\epsilon_0c^3}$ with $q = ${who === 'alpha particle' ? '2e' : 'e'}$: $P = \\dfrac{${fmt(q * q, 4)}\\times(${fmt(a, 2)})^2}{${fmt(6 * Math.PI * C.eps0 * c ** 3, 4)}} = ${fmt(P, 4)}$ W, so $N = ${answer}$.`,
          trap: 'The mass does not appear in Larmor\'s formula once the acceleration is given.' };
      },
      verify: (p) => (C.mu0 * p.q0 ** 2 * p.a ** 2) / (6 * Math.PI * c) / 10 ** p.ex },
    { id: 'rdn-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'electric dipole',
      make(r) {
        const pm = int(r, 1, 9), pe = int(r, -14, -10), p0 = pm * 10 ** pe, f = choose(r, [1e8, 3e8, 1e9, 2.4e9, 5e9]);
        const P = (C.mu0 * p0 * p0 * (2 * Math.PI * f) ** 4) / (12 * Math.PI * c), ex = Math.floor(Math.log10(P)), val = P / 10 ** ex, answer = round(val, 3);
        return { q: `An electric dipole of amplitude $${pm}\\times10^{${pe}}$ C m oscillates at $${fmt(f, 2)}$ Hz. Its time-averaged radiated power is $N\\times10^{${ex}}$ W. Find $N$.`,
          answer, tol: Math.max(0.002, val * 0.005), p0, f, ex,
          sol: `$\\langle P\\rangle = \\dfrac{\\mu_0p_0^2\\omega^4}{12\\pi c}$ with $\\omega = 2\\pi f = ${fmt(2 * Math.PI * f, 4)}$ rad/s: $${fmt(P, 4)}$ W, so $N = ${answer}$.`,
          trap: 'Use the angular frequency, to the fourth power.' };
      },
      verify: (p) => (p.p0 ** 2 * (2 * Math.PI * p.f) ** 4) / (12 * Math.PI * C.eps0 * c ** 3) / 10 ** p.ex },
    { id: 'rdn-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'antennas',
      make(r) {
        const frac = choose(r, [10, 15, 20, 25, 30, 50, 100]), I0 = int(r, 1, 20), ask = choose(r, ['resistance', 'power']);
        const R = ((2 * Math.PI) / 3) * ETA0 / (frac * frac), P = 0.5 * I0 * I0 * R, val = ask === 'resistance' ? R : P, answer = round(val, 4);
        return { q: `A short dipole of length $\\lambda/${frac}$ carries a uniform current of amplitude ${I0} A. Find its ${ask === 'resistance' ? 'radiation resistance in ohms' : 'radiated power in watts'}. Use $R = \\frac{2\\pi}{3}\\eta_0(l/\\lambda)^2$, $\\eta_0 = 376.7\\ \\Omega$.`,
          answer, tol: Math.max(0.0005, val * 0.005), unit: ask === 'resistance' ? 'Ω' : 'W', frac, I0, ask,
          sol: `$R = 789.6/${frac}^2 = ${R.toFixed(4)}\\ \\Omega$.${ask === 'power' ? ` $\\langle P\\rangle = \\tfrac12I_0^2R = \\tfrac12\\times${I0 * I0}\\times${R.toFixed(4)} = ${answer}$ W.` : ''}`,
          trap: 'Peak current: include the $\\tfrac12$ when averaging.' };
      },
      verify: (p) => { const R = (C.mu0 * c * 2 * Math.PI) / (3 * p.frac ** 2); return p.ask === 'resistance' ? R : 0.5 * p.I0 ** 2 * R; } },
    { id: 'rdn-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scattering',
      make(r) {
        const l1 = choose(r, [380, 400, 420, 450, 480]), l2 = choose(r, [550, 600, 633, 650, 700, 750]);
        const val = (l2 / l1) ** 4, answer = round(val, 3);
        return { q: `Molecules scatter light of ${l1} nm and ${l2} nm by Rayleigh scattering. How many times more strongly is the ${l1} nm light scattered?`,
          answer, tol: Math.max(0.005, val * 0.005), l1, l2,
          sol: `Rayleigh: scattered power $\\propto \\omega^4 \\propto \\lambda^{-4}$. Ratio $= (${l2}/${l1})^4 = ${answer}$.`,
          trap: 'Fourth power of the wavelength ratio, longer over shorter.' };
      },
      verify: (p) => Math.exp(4 * Math.log(p.l2 / p.l1)) },
    { id: 'rdn-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'electric dipole',
      make(r) {
        const P = choose(r, [1, 5, 10, 50, 100]), rk = choose(r, [1, 2, 5, 10, 20]), th = choose(r, [30, 45, 60, 90]);
        const I = ((3 * P * 1e3) / (8 * Math.PI * (rk * 1e3) ** 2)) * Math.sin((th * Math.PI) / 180) ** 2 * 1e6, answer = round(I, 3);
        return { q: `A short dipole antenna radiates a total of ${P} kW. Find the intensity ${rk} km away at $${th}^\\circ$ from its axis, in $\\mu$W/m$^2$.`,
          answer, tol: Math.max(0.002, I * 0.005), unit: 'μW/m²', P, rk, th,
          sol: `$I = \\dfrac{3P}{8\\pi r^2}\\sin^2\\theta = \\dfrac{3\\times${P * 1000}}{8\\pi\\times(${rk * 1000})^2}\\times\\sin^2${th}^\\circ = ${answer}\\ \\mu$W/m$^2$.`,
          trap: 'The normalisation $3/8\\pi$ comes from $\\int\\sin^2\\theta\\,d\\Omega = 8\\pi/3$.' };
      },
      verify: (p) => { let s = 0; const N = 2000; for (let i = 0; i < N; i++) { const t = (Math.PI * (i + 0.5)) / N; s += Math.sin(t) ** 3; } const norm = 2 * Math.PI * (s * Math.PI) / N; return ((p.P * 1e3) / ((p.rk * 1e3) ** 2 * norm)) * Math.sin((p.th * Math.PI) / 180) ** 2 * 1e6; } },
    { id: 'rdn-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'synchrotron radiation',
      make(r) {
        const E = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 6, 8]), R = choose(r, [2, 5, 10, 20, 40, 100]);
        const g = (E * 1000) / MEV, dE = (C.e * g ** 4) / (3 * C.eps0 * R) / 1e3, answer = round(dE, 3);
        return { q: `Electrons of ${E} GeV circulate with bending radius ${R} m. Find the energy each loses to synchrotron radiation per turn, in keV, using $\\Delta E = \\dfrac{e^2\\gamma^4}{3\\epsilon_0R}$ ($\\beta \\approx 1$).`,
          answer, tol: Math.max(0.001, dE * 0.005), unit: 'keV', E, R,
          sol: `$\\gamma = ${E * 1000}/0.511 = ${g.toFixed(0)}$. $\\Delta E/e = \\dfrac{e\\gamma^4}{3\\epsilon_0R} = \\dfrac{1.602\\times10^{-19}\\times${fmt(g ** 4, 4)}}{3\\times8.854\\times10^{-12}\\times${R}}$ V $= ${answer}$ keV. (Check: $88.5E^4/R = ${(88.46 * E ** 4 / R).toFixed(1)}$ keV.)`,
          trap: 'Energy to the fourth power: doubling the energy costs 16 times the RF power.' };
      },
      verify: (p) => (88.4628 * p.E ** 4) / p.R },
    { id: 'rdn-g07', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'electric dipole',
      make(r) {
        const kf = choose(r, [2, 3, 0.5]), ka = choose(r, [1, 2, 3, 0.5]), what = choose(r, ['electric dipole', 'small current loop (magnetic dipole)']);
        const val = kf ** 4 * ka ** 2, show = (v) => (v >= 1 ? `${+v.toFixed(4)}` : `1/${+(1 / v).toFixed(4)}`);
        const o = mcqOptions(r, val, [kf ** 2 * ka ** 2, kf ** 4 * ka, kf ** 3 * ka ** 2, kf ** 2 * ka].filter((x) => Math.abs(x - val) > 1e-9), (v) => `multiplied by ${show(v)}`);
        return { q: `The frequency of an oscillating ${what} is multiplied by ${kf} and its moment amplitude by ${ka}. The radiated power is`, ...o,
          sol: `Both electric and magnetic dipole power go as (moment)$^2\\omega^4$. So the factor is $${ka}^2\\times${kf}^4 = ${show(val)}$.`,
          trap: 'Power goes as the square of the amplitude and the fourth power of the frequency.' };
      } },
    { id: 'rdn-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cyclotron radiation',
      make(r) {
        const B = choose(r, [0.5, 1, 2, 3, 5, 8, 10]), who = choose(r, ['electron', 'positron']);
        const tau = (3 * Math.PI * C.eps0 * C.me ** 3 * c ** 3) / (C.e ** 4 * B * B), answer = round(tau, 4);
        return { q: `A slow ${who} gyrates in a uniform ${B} T magnetic field. Its kinetic energy decays as $e^{-t/\\tau}$ because of cyclotron radiation. Find $\\tau$ in seconds.`,
          answer, tol: Math.max(0.0005, tau * 0.005), unit: 's', B,
          sol: `$\\tau = \\dfrac{3\\pi\\epsilon_0m^3c^3}{e^4B^2} = \\dfrac{2.579}{${B}^2}$ s $= ${answer}$ s (from $P = \\frac{e^4B^2}{3\\pi\\epsilon_0m^3c^3}K$).`,
          trap: 'The sign of the charge does not matter: $e^4$.' };
      },
      verify: (p) => { const K = 1e-17, v = Math.sqrt((2 * K) / C.me), a = (C.e * v * p.B) / C.me; return K / larmor(C.e, a); } },
    { id: 'rdn-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'antennas',
      make(r) {
        const ratio = choose(r, [0.05, 0.08, 0.1, 0.15, 0.2, 0.25]), N = int(r, 1, 6);
        const R = N * N * (Math.PI / 6) * ETA0 * ratio ** 4, answer = round(R * 1e3, 3);
        return { q: `A small loop antenna of ${N} turn${N > 1 ? 's' : ''}, each of circumference $${ratio}\\lambda$, radiates as a magnetic dipole. Find its radiation resistance in m$\\Omega$ ($R_1 = \\frac\\pi6\\eta_0(C/\\lambda)^4$ per single turn).`,
          answer, tol: Math.max(0.001, R * 1e3 * 0.005), unit: 'mΩ', ratio, N,
          sol: `One turn: $\\frac\\pi6\\times376.7\\times${ratio}^4 = ${((Math.PI / 6) * ETA0 * ratio ** 4 * 1e3).toFixed(4)}$ m$\\Omega$. With ${N} turns the moment is ${N} times larger for the same current, so the power and resistance grow by $${N}^2$: ${answer} m$\\Omega$.`,
          trap: 'Turns multiply the moment, so the radiation resistance grows as $N^2$.' };
      },
      verify: (p) => { const lam = 1, a = (p.ratio * lam) / (2 * Math.PI), m = p.N * Math.PI * a * a, w = (2 * Math.PI * c) / lam; return ((2 * C.mu0 * m * m * w ** 4) / (12 * Math.PI * c ** 3)) * 1e3; } },
    { id: 'rdn-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula',
      make(r) {
        const ax = ['x', 'y', 'z'], A = choose(r, ax), O = choose(r, ax);
        const right = A === O ? 'there is no radiation field in that direction' : `parallel to the ${A} axis`;
        const o = mcqOptions(r, right, ['there is no radiation field in that direction', ...ax.map((x) => `parallel to the ${x} axis`)]);
        return { q: `A slowly moving charge has acceleration along the ${A} axis. Far away on the ${O} axis, its radiation electric field is`, ...o,
          sol: `$\\vec E_{\\text{rad}} \\propto \\hat n\\times(\\hat n\\times\\vec a) = (\\hat n\\cdot\\vec a)\\hat n - \\vec a$, the part of $\\vec a$ transverse to the line of sight (reversed). ${A === O ? 'Looking along the acceleration, nothing is transverse: no radiation.' : `Here $\\hat n \\perp \\vec a$, so $\\vec E$ is along $-\\vec a$: parallel to the ${A} axis.`}`,
          trap: 'The radiation field is never along the line of sight.' };
      } },
    { id: 'rdn-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'scattering',
      make(r) {
        const th = choose(r, [0, 20, 30, 45, 60, 120, 150, 180]), ask = choose(r, ['ratio', 'degree']);
        const ct = Math.cos((th * Math.PI) / 180), val = ask === 'ratio' ? 1 + ct * ct : (1 - ct * ct) / (1 + ct * ct), answer = round(val, 4);
        return { q: ask === 'ratio' ? `Unpolarised light is Thomson-scattered by free electrons. Find the ratio of scattered intensity at $${th}^\\circ$ to that at $90^\\circ$ (same distance).` : `Unpolarised light is Thomson-scattered by free electrons. Find the degree of linear polarisation of the light scattered at $${th}^\\circ$.`,
          answer, tol: 0.002, th, ask,
          sol: `For unpolarised light $\\dfrac{d\\sigma}{d\\Omega} = r_e^2\\dfrac{1 + \\cos^2\\theta}{2}$: the component perpendicular to the scattering plane gives 1, the one in the plane gives $\\cos^2\\theta$. ${ask === 'ratio' ? `Ratio to $90^\\circ$: $1 + \\cos^2${th}^\\circ = ${answer}$.` : `Degree of polarisation $\\dfrac{1 - \\cos^2\\theta}{1 + \\cos^2\\theta} = ${answer}$.`}`,
          trap: 'Forward and backward scattering are equally strong and unpolarised.' };
      },
      verify: (p) => { const s = Math.sin((p.th * Math.PI) / 180) ** 2; return p.ask === 'ratio' ? 2 - s : s / (2 - s); } },
    { id: 'rdn-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'relativistic radiation',
      make(r) {
        const K = choose(r, [0.1, 0.5, 1, 2, 5, 10, 50]), ask = choose(r, ['linear', 'circular']);
        const g = 1 + K / MEV, val = ask === 'linear' ? g ** 6 : g ** 4, ex = val >= 1e4 ? Math.floor(Math.log10(val)) : 0, show = val / 10 ** ex, answer = round(show, 3);
        return { q: `An electron of kinetic energy ${K} MeV has an acceleration of fixed magnitude ${ask === 'linear' ? 'along' : 'perpendicular to'} its velocity. By what factor does its radiated power exceed the non-relativistic Larmor value for the same acceleration?${ex ? ` Give the answer as $N\\times10^{${ex}}$: find $N$.` : ''}`,
          answer, tol: Math.max(0.002, show * 0.005), K, ask, ex,
          sol: `$\\gamma = 1 + K/m_ec^2 = 1 + ${K}/0.511 = ${g.toFixed(4)}$. Liénard: the factor is $\\gamma^${ask === 'linear' ? 6 : 4}$ ${ask === 'linear' ? '(acceleration along $v$)' : '(acceleration across $v$)'} $= ${fmt(val, 4)}$.`,
          trap: 'Linear: $\\gamma^6$; circular: $\\gamma^4$.' };
      },
      verify: (p) => { const g = (p.K + MEV) / MEV; return (p.ask === 'linear' ? Math.pow(g, 6) : Math.pow(g, 4)) / 10 ** p.ex; } },
    ...more,
  ],
};
