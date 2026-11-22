// Plasma oscillations and dispersion, NET depth: the plasma frequency, the dielectric function and the dispersion
// relation omega^2 = omega_p^2 + c^2 k^2, cutoff, evanescence, phase and group velocity, the ionosphere, metals and
// the Drude model, Debye screening and the plasma parameter, Bohm-Gross and ion-acoustic waves, magnetised plasma
// (cyclotron, upper hybrid, Faraday rotation, whistlers) and pulsar dispersion.
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './plasma-dispersion.more.gen.js';

const PI = Math.PI, E = C.e, ME = C.me, EPS = C.eps0, C0 = C.c, KB = C.kB, MP = C.mp, HB = C.hbar;
const wp = (n) => Math.sqrt(n * E * E / (EPS * ME));      // electron plasma angular frequency, n in m^-3
const KDM = 4.149;                                          // ms per (pc cm^-3) per GHz^-2

export default {
  topic: 'plasma-dispersion',
  items: [
    // ---------- level 1 ----------
    { id: 'netpl-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'The electron plasma frequency of a plasma with electron density $n$ is',
      options: ['$\\omega_p = \\dfrac{ne^2}{\\epsilon_0m}$', '$\\omega_p = \\sqrt{\\dfrac{ne^2}{\\epsilon_0m}}$', '$\\omega_p = \\sqrt{\\dfrac{\\epsilon_0m}{ne^2}}$', '$\\omega_p = \\dfrac{eB}{m}$'], answer: 1,
      sol: 'Displace all electrons in a slab by $x$: the uncovered charge produces $E = nex/\\epsilon_0$, so $m\\ddot x = -\\dfrac{ne^2}{\\epsilon_0}x$, simple harmonic with $\\omega_p^2 = ne^2/\\epsilon_0m$. $eB/m$ is the cyclotron frequency.' },
    { id: 'netpl-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'dispersion relation',
      q: 'Transverse electromagnetic waves in a cold, collisionless, unmagnetised plasma obey',
      options: ['$\\omega = ck$', '$\\omega^2 = c^2k^2 - \\omega_p^2$', '$\\omega^2 = \\omega_p^2 + c^2k^2$', '$\\omega = \\omega_p + ck$'], answer: 2,
      sol: 'The electrons give $\\epsilon_r(\\omega) = 1 - \\omega_p^2/\\omega^2$, and $k^2 = \\epsilon_r\\omega^2/c^2$ gives $\\omega^2 = \\omega_p^2 + c^2k^2$. There is a cutoff: real $k$ needs $\\omega > \\omega_p$.' },
    { id: 'netpl-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'The ionospheric F layer has an electron density of $1.0\\times10^{12}$ m$^{-3}$. Its plasma frequency $f_p = \\omega_p/2\\pi$ is ______ MHz (to one decimal place).',
      answer: 9.0, tol: 0.05, calc: () => wp(1e12) / 2 / PI / 1e6,
      sol: '$\\omega_p = \\sqrt{\\dfrac{10^{12}\\times(1.602\\times10^{-19})^2}{8.854\\times10^{-12}\\times9.109\\times10^{-31}}} = 5.64\\times10^7$ s$^{-1}$, so $f_p = 8.98$ MHz. A handy rule: $f_p\\approx8.98\\sqrt{n}$ Hz with $n$ in m$^{-3}$.',
      trap: 'Quoting $\\omega_p$ (56 Mrad/s) instead of $f_p$ is a factor $2\\pi$ off.' },
    { id: 'netpl-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'A radio wave of frequency below the local plasma frequency meets a plasma layer at normal incidence. It is',
      options: ['transmitted with reduced speed', 'absorbed completely', 'transmitted with speed above $c$', 'reflected, with an evanescent field inside the plasma'], answer: 3,
      sol: 'For $\\omega < \\omega_p$, $k^2 = (\\omega^2 - \\omega_p^2)/c^2 < 0$, so $k = i\\kappa$: the field decays as $e^{-\\kappa z}$ and carries no average energy flux into the plasma. In a collisionless plasma nothing is absorbed, so the wave is totally reflected.' },
    { id: 'netpl-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'phase and group velocity',
      q: 'For an electromagnetic wave in a plasma ($\\omega > \\omega_p$), the phase velocity $v_p$ and group velocity $v_g$ satisfy',
      options: ['$v_pv_g = c^2$, with $v_p > c > v_g$', '$v_p = v_g = c$', '$v_pv_g = c^2$, with $v_g > c > v_p$', '$v_p + v_g = 2c$'], answer: 0,
      sol: 'From $\\omega^2 = \\omega_p^2 + c^2k^2$: $v_g = d\\omega/dk = c^2k/\\omega$ and $v_p = \\omega/k$, so $v_pv_g = c^2$. Since $v_g = c\\sqrt{1 - \\omega_p^2/\\omega^2} < c$, $v_p > c$. Energy and signals move at $v_g$.',
      trap: 'A phase velocity above $c$ carries no information, so relativity is safe.' },
    { id: 'netpl-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'If the electron density of a plasma is made four times larger, its plasma frequency',
      options: ['doubles', 'quadruples', 'halves', 'is unchanged'], answer: 0,
      sol: '$\\omega_p\\propto\\sqrt n$, so a factor 4 in density doubles $\\omega_p$. The plasma frequency does not depend on temperature in the cold-plasma model.' },

    // ---------- level 2 ----------
    { id: 'netpl-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'phase and group velocity',
      q: 'An electromagnetic wave of frequency $2\\omega_p$ travels through a plasma. Its group velocity is ______ $c$ (to three decimal places).',
      answer: 0.866, tol: 0.002, calc: () => Math.sqrt(1 - 0.25),
      sol: '$v_g = c\\sqrt{1 - \\omega_p^2/\\omega^2} = c\\sqrt{1 - 1/4} = 0.866c$. The phase velocity is $c^2/v_g = 1.155c$.' },
    { id: 'netpl-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'critical density',
      q: 'A laser of wavelength 1.0 $\\mu$m cannot propagate in a plasma denser than the critical density $n_c = \\epsilon_0m\\omega^2/e^2$. The value of $n_c$ is ______ $\\times10^{27}$ m$^{-3}$ (to two decimal places).',
      answer: 1.11, tol: 0.01, calc: () => EPS * ME * (2 * PI * C0 / 1e-6) ** 2 / E / E / 1e27,
      sol: 'Setting $\\omega_p = \\omega$: $n_c = \\epsilon_0m\\omega^2/e^2$. $\\omega = 2\\pi c/\\lambda = 1.884\\times10^{15}$ s$^{-1}$, so $n_c = \\dfrac{8.854\\times10^{-12}\\times9.109\\times10^{-31}\\times3.55\\times10^{30}}{2.566\\times10^{-38}} = 1.11\\times10^{27}$ m$^{-3}$. Note $n_c\\propto1/\\lambda^2$.' },
    { id: 'netpl-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dielectric function',
      q: 'The relative permittivity of a cold collisionless electron plasma at frequency $\\omega$ is',
      options: ['$1 + \\omega_p^2/\\omega^2$', '$1 - \\omega^2/\\omega_p^2$', '$1 - \\omega_p^2/\\omega^2$', '$\\omega_p^2/\\omega^2$'], answer: 2,
      sol: 'A free electron obeys $m\\ddot x = -eE$; for $E = E_0e^{-i\\omega t}$ this gives $x = eE/m\\omega^2$. The polarisation is $P = -nex = -\\dfrac{ne^2}{m\\omega^2}E$. Then $\\epsilon_r = 1 + P/\\epsilon_0E = 1 - \\omega_p^2/\\omega^2$, negative below $\\omega_p$.',
      trap: 'Free electrons respond out of phase with the field (inertia dominated), so they reduce $\\epsilon_r$, unlike bound electrons below resonance.' },
    { id: 'netpl-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'metals',
      q: 'Sodium has $2.65\\times10^{28}$ conduction electrons per m$^3$. Treating them as a free-electron plasma, sodium becomes transparent for wavelengths shorter than ______ nm (to the nearest whole number).',
      answer: 205, tol: 1, calc: () => 2 * PI * C0 / wp(2.65e28) * 1e9,
      sol: '$\\omega_p = \\sqrt{\\dfrac{2.65\\times10^{28}\\times2.566\\times10^{-38}}{8.854\\times10^{-12}\\times9.109\\times10^{-31}}} = 9.18\\times10^{15}$ s$^{-1}$. $\\lambda_p = 2\\pi c/\\omega_p = 205$ nm (measured: about 210 nm). Alkali metals are transparent in the ultraviolet.' },
    { id: 'netpl-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'ionosphere',
      q: 'The peak plasma frequency of the ionosphere is 8.0 MHz. Using the secant law $f_{max} = f_p\\sec\\theta_0$, the highest frequency reflected for a wave incident at $60^\\circ$ from the vertical is ______ MHz.',
      answer: 16, tol: 0.05, calc: () => 8 / Math.cos(PI / 3),
      sol: 'In a flat layered ionosphere, Snell\'s law keeps $n\\sin\\theta = \\sin\\theta_0$. The ray turns back where $n = \\sin\\theta_0$, i.e. $1 - f_p^2/f^2 = \\sin^2\\theta_0$, so $f = f_p/\\cos\\theta_0 = 8.0/0.5 = 16$ MHz. Oblique paths carry higher frequencies over the horizon.' },
    { id: 'netpl-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'dispersion relation',
      q: 'For transverse waves with $\\omega^2 = \\omega_p^2 + c^2k^2$, which statements are correct?',
      options: ['The refractive index is less than 1 for every propagating frequency', 'As $k\\to0$ the group velocity tends to zero', 'Waves with $\\omega\\gg\\omega_p$ travel almost as in vacuum', 'The relation has the same form as the waveguide dispersion relation, with $\\omega_p$ playing the cutoff'], answer: [0, 1, 2, 3],
      sol: '$n = \\sqrt{1 - \\omega_p^2/\\omega^2} < 1$. $v_g = c^2k/\\omega\\to0$ as $k\\to0$ ($\\omega\\to\\omega_p$). At high frequency $n\\to1$. A TE/TM waveguide mode obeys $\\omega^2 = \\omega_c^2 + c^2k^2$, the same form (and the same "massive particle" form $E^2 = m^2c^4 + p^2c^2$).' },
    { id: 'netpl-013', type: 'mcq', level: 2, exams: ['net'], sub: 'Debye screening',
      q: 'In a plasma at temperature $T$, the potential of a test charge falls off as $\\dfrac{e^{-r/\\lambda_D}}{r}$ with the Debye length',
      options: ['$\\lambda_D = \\sqrt{\\dfrac{ne^2}{\\epsilon_0kT}}$', '$\\lambda_D = \\dfrac{\\epsilon_0kT}{ne^2}$', '$\\lambda_D = \\sqrt{\\dfrac{kT}{m}}\\dfrac{1}{\\omega_c}$', '$\\lambda_D = \\sqrt{\\dfrac{\\epsilon_0kT}{ne^2}}$'], answer: 3,
      sol: 'Linearising the Boltzmann response $n_e = n\\,e^{e\\phi/kT}\\approx n(1 + e\\phi/kT)$ in Poisson\'s equation gives $\\nabla^2\\phi = \\phi/\\lambda_D^2$ with $\\lambda_D^2 = \\epsilon_0kT/ne^2$. Note $\\lambda_D = v_{th}/\\omega_p$ with $v_{th} = \\sqrt{kT/m}$.' },
    { id: 'netpl-014', type: 'nat', level: 2, exams: ['net'], sub: 'Faraday rotation',
      q: 'A linearly polarised radio wave of wavelength 21 cm crosses a magnetised plasma with rotation measure 100 rad m$^{-2}$. Its plane of polarisation turns by ______ rad (to two decimal places).',
      answer: 4.41, tol: 0.01, calc: () => 100 * 0.21 ** 2,
      sol: 'Faraday rotation: $\\Delta\\chi = \\text{RM}\\,\\lambda^2$ with $\\text{RM} = \\dfrac{e^3}{8\\pi^2\\epsilon_0m^2c^3}\\displaystyle\\int n_eB_\\parallel\\,dl$. So $\\Delta\\chi = 100\\times0.21^2 = 4.41$ rad. Measuring at several wavelengths separates RM from the intrinsic angle.' },
    { id: 'netpl-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'The ion plasma frequency of a hydrogen plasma, compared with its electron plasma frequency, is smaller by a factor of',
      options: ['$m_e/m_p\\approx1/1836$', '$\\sqrt{m_e/m_p}\\approx1/43$', '1 (they are equal by neutrality)', '$(m_e/m_p)^2$'], answer: 1,
      sol: '$\\omega_{pi}^2 = n_iZ^2e^2/\\epsilon_0M$. For hydrogen $n_i = n_e$ and $Z = 1$, so $\\omega_{pi}/\\omega_{pe} = \\sqrt{m_e/m_p} = 1/42.8$.' },
    { id: 'netpl-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'A wave with frequency $\\omega = 3\\omega_p$ enters a plasma from vacuum at normal incidence. The refractive index of the plasma is ______ (to three decimal places).',
      answer: 0.943, tol: 0.002, calc: () => Math.sqrt(1 - 1 / 9),
      sol: '$n = \\sqrt{1 - \\omega_p^2/\\omega^2} = \\sqrt{1 - 1/9} = \\sqrt{8/9} = 0.943$. Less than 1, so total internal reflection can occur on going from vacuum into the plasma at grazing angles.' },

    // ---------- level 3 ----------
    { id: 'netpl-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent waves',
      q: 'A 4.5 MHz wave meets a plasma whose plasma frequency is 9.0 MHz. The $1/e$ penetration depth of its field into the plasma is ______ m (to two decimal places).',
      answer: 6.12, tol: 0.02, calc: () => C0 / (2 * PI * 9e6 * Math.sqrt(0.75)),
      sol: '$\\kappa = \\sqrt{\\omega_p^2 - \\omega^2}/c = \\dfrac{\\omega_p}{c}\\sqrt{1 - 1/4}$. $\\omega_p = 5.655\\times10^7$ s$^{-1}$, so $\\kappa = 5.655\\times10^7\\times0.866/2.998\\times10^8 = 0.1634$ m$^{-1}$, and $\\delta = 1/\\kappa = 6.12$ m.',
      trap: 'At $\\omega\\ll\\omega_p$ the depth tends to $c/\\omega_p$ (the collisionless skin depth), not to zero.' },
    { id: 'netpl-018', type: 'nat', level: 3, exams: ['net'], sub: 'pulsar dispersion',
      q: 'A pulsar has dispersion measure 50 pc cm$^{-3}$. The arrival-time delay $\\Delta t = 4.149\\text{ ms}\\times\\text{DM}\\,(f_1^{-2} - f_2^{-2})$ with $f$ in GHz. A pulse at 400 MHz arrives later than the same pulse at 1400 MHz by ______ s (to two decimal places).',
      answer: 1.19, tol: 0.01, calc: () => KDM * 50 * (1 / 0.16 - 1 / 1.96) / 1000,
      sol: 'For $\\omega\\gg\\omega_p$, $1/v_g\\approx\\dfrac1c\\left(1 + \\dfrac{\\omega_p^2}{2\\omega^2}\\right)$, so the extra travel time is $\\dfrac{e^2}{8\\pi^2\\epsilon_0mc}\\dfrac{\\int n\\,dl}{f^2}$. Here $\\Delta t = 4.149\\times50\\times(6.25 - 0.510)$ ms $= 1191$ ms $= 1.19$ s.',
      trap: 'Low frequencies arrive later: the delay goes as $1/f^2$.' },
    { id: 'netpl-019', type: 'nat', level: 3, exams: ['net'], sub: 'Bohm-Gross waves',
      q: 'Electron plasma waves obey the Bohm-Gross relation $\\omega^2 = \\omega_p^2 + 3k^2v_{th}^2$ with $v_{th}^2 = kT_e/m$. For $f_p = 1.0$ GHz, $T_e = 1.0\\times10^4$ K and $k = 1.0\\times10^4$ m$^{-1}$, the wave frequency $\\omega/2\\pi$ is ______ GHz (to two decimal places).',
      answer: 1.47, tol: 0.01, calc: () => Math.sqrt((2 * PI * 1e9) ** 2 + 3e8 * KB * 1e4 / ME) / 2 / PI / 1e9,
      sol: '$v_{th}^2 = 1.381\\times10^{-23}\\times10^4/9.109\\times10^{-31} = 1.516\\times10^{11}$ m$^2$/s$^2$. $3k^2v_{th}^2 = 3\\times10^8\\times1.516\\times10^{11} = 4.55\\times10^{19}$ s$^{-2}$; $\\omega_p^2 = (2\\pi\\times10^9)^2 = 3.95\\times10^{19}$. $\\omega = \\sqrt{8.49\\times10^{19}} = 9.22\\times10^9$ s$^{-1}$, $f = 1.47$ GHz.' },
    { id: 'netpl-020', type: 'nat', level: 3, exams: ['net'], sub: 'ion-acoustic waves',
      q: 'In a hydrogen plasma with $T_e = 10$ eV and cold ions, long-wavelength ion-acoustic waves travel at $c_s = \\sqrt{kT_e/m_p}$. The value of $c_s$ is ______ km/s (to one decimal place).',
      answer: 30.9, tol: 0.1, calc: () => Math.sqrt(10 * E / MP) / 1e3,
      sol: '$kT_e = 10\\times1.602\\times10^{-19} = 1.602\\times10^{-18}$ J. $c_s = \\sqrt{1.602\\times10^{-18}/1.673\\times10^{-27}} = \\sqrt{9.58\\times10^8} = 3.09\\times10^4$ m/s. The electrons supply the pressure, the ions the inertia; for $k\\lambda_D\\gtrsim1$ the wave turns into ion plasma oscillations.' },
    { id: 'netpl-021', type: 'nat', level: 3, exams: ['net'], sub: 'Debye screening',
      q: 'A plasma has $n = 1.0\\times10^{12}$ m$^{-3}$ and $T = 1000$ K. Its Debye length is ______ mm (to two decimal places).',
      answer: 2.18, tol: 0.01, calc: () => Math.sqrt(EPS * KB * 1000 / (1e12 * E * E)) * 1e3,
      sol: '$\\lambda_D = \\sqrt{\\dfrac{8.854\\times10^{-12}\\times1.381\\times10^{-20}}{10^{12}\\times2.566\\times10^{-38}}} = \\sqrt{4.765\\times10^{-6}}$ m $= 2.18$ mm. (Rule: $\\lambda_D\\approx69\\sqrt{T/n}$ m.) The number of electrons in a Debye sphere is $\\tfrac43\\pi n\\lambda_D^3\\approx4\\times10^4\\gg1$, so this is a genuine plasma.' },
    { id: 'netpl-022', type: 'mcq', level: 3, exams: ['net'], sub: 'magnetised plasma',
      q: 'For propagation perpendicular to $\\vec B_0$ with $\\vec E\\perp\\vec B_0$ (the extraordinary wave), the electrons resonate at the upper hybrid frequency',
      options: ['$\\omega_{UH} = \\omega_p + \\omega_c$', '$\\omega_{UH}^2 = \\omega_p^2 - \\omega_c^2$', '$\\omega_{UH} = \\sqrt{\\omega_p\\omega_c}$', '$\\omega_{UH}^2 = \\omega_p^2 + \\omega_c^2$'], answer: 3,
      sol: 'An electron displaced perpendicular to $\\vec B_0$ feels two restoring effects: the space-charge field (giving $\\omega_p^2$) and the Lorentz force (giving $\\omega_c^2$). For a longitudinal oscillation across $\\vec B_0$ they add in quadrature: $\\omega_{UH}^2 = \\omega_p^2 + \\omega_c^2$.' },
    { id: 'netpl-023', type: 'nat', level: 3, exams: ['net'], sub: 'magnetised plasma',
      q: 'A laboratory plasma has $f_p = 3.0$ GHz in a field of 0.10 T. Its upper hybrid frequency is ______ GHz (to two decimal places).',
      answer: 4.10, tol: 0.01, calc: () => Math.sqrt(9 + (E * 0.1 / (2 * PI * ME) / 1e9) ** 2),
      sol: '$f_c = eB/2\\pi m = 1.602\\times10^{-19}\\times0.10/(2\\pi\\times9.109\\times10^{-31}) = 2.80$ GHz (28.0 GHz per tesla). $f_{UH} = \\sqrt{3.0^2 + 2.80^2} = \\sqrt{16.84} = 4.10$ GHz.' },
    { id: 'netpl-024', type: 'msq', level: 3, exams: ['net'], sub: 'magnetised plasma',
      q: 'For waves travelling along a static field $\\vec B_0$ in a cold electron plasma, $n^2_{R,L} = 1 - \\dfrac{\\omega_p^2}{\\omega(\\omega\\mp\\omega_c)}$. Which statements are correct?',
      options: ['The right-hand circular wave has a resonance at $\\omega = \\omega_c$', 'Below $\\omega_c$ the right-hand wave can propagate as a whistler even when $\\omega < \\omega_p$', 'The two circular waves travel at different speeds, so a linear polarisation rotates (Faraday rotation)', 'The left-hand wave resonates at the electron cyclotron frequency'], answer: [0, 1, 2],
      sol: 'R wave: denominator $\\omega - \\omega_c$ vanishes at $\\omega_c$, rotating with the electrons. For $\\omega\\ll\\omega_c$, $n_R^2\\approx1 + \\omega_p^2/\\omega\\omega_c > 0$: the whistler mode, with $v_g\\propto\\sqrt\\omega$ (higher tones arrive first). Different $n_R$ and $n_L$ rotate the plane of a linear wave. The L wave rotates against the electrons and has no electron resonance (it resonates with ions, at $\\omega_{ci}$).' },
    { id: 'netpl-025', type: 'mcq', level: 3, exams: ['net'], sub: 'Drude model',
      q: 'In the Drude model with collision time $\\tau$, the conductivity is $\\sigma(\\omega) = \\dfrac{\\sigma_0}{1 - i\\omega\\tau}$ and $\\epsilon_r = 1 + \\dfrac{i\\sigma}{\\epsilon_0\\omega}$. For $\\omega\\tau\\gg1$ this reduces to',
      options: ['$\\epsilon_r\\approx1 - \\omega_p^2/\\omega^2$, the collisionless plasma', '$\\epsilon_r\\approx1 + i\\sigma_0/\\epsilon_0\\omega$, a good conductor', '$\\epsilon_r\\approx1$', '$\\epsilon_r\\approx-\\omega_p^2\\tau^2$'], answer: 0,
      sol: 'For $\\omega\\tau\\gg1$, $\\sigma\\approx\\dfrac{\\sigma_0}{-i\\omega\\tau} = \\dfrac{i\\sigma_0}{\\omega\\tau}$. With $\\sigma_0 = ne^2\\tau/m$: $\\dfrac{i\\sigma}{\\epsilon_0\\omega} = -\\dfrac{ne^2}{\\epsilon_0m\\omega^2} = -\\dfrac{\\omega_p^2}{\\omega^2}$. In metals $\\tau\\sim10^{-14}$ s, so this holds at optical frequencies.' },
    { id: 'netpl-026', type: 'nat', level: 3, exams: ['net'], sub: 'photon effective mass',
      q: 'The plasma dispersion relation looks like $E^2 = p^2c^2 + m_\\gamma^2c^4$ with $m_\\gamma c^2 = \\hbar\\omega_p$. For the ionosphere ($n = 1.0\\times10^{12}$ m$^{-3}$), $m_\\gamma c^2$ is ______ $\\times10^{-8}$ eV (to two decimal places).',
      answer: 3.71, tol: 0.02, calc: () => HB * wp(1e12) / E * 1e8,
      sol: 'Multiply $\\omega^2 = \\omega_p^2 + c^2k^2$ by $\\hbar^2$: $E^2 = (\\hbar\\omega_p)^2 + p^2c^2$. $\\hbar\\omega_p = 6.582\\times10^{-16}\\text{ eV s}\\times5.64\\times10^7\\text{ s}^{-1} = 3.71\\times10^{-8}$ eV. The same idea, a gauge field gaining mass from a medium, is the Anderson-Higgs mechanism in superconductors.' },
    { id: 'netpl-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'longitudinal oscillations',
      q: 'Cold-plasma Langmuir oscillations (longitudinal, $T = 0$) have',
      options: ['$\\omega = ck$', 'group velocity $c$', '$\\omega = \\omega_p$ for every $k$, so zero group velocity', '$\\omega\\propto k^2$'], answer: 2,
      sol: 'For a longitudinal wave $\\nabla\\times\\vec E = 0$ and Gauss\'s law with the electron equation of motion gives $\\epsilon_r(\\omega) = 0$, i.e. $\\omega = \\omega_p$ independent of $k$. The disturbance does not travel; thermal pressure adds $3k^2v_{th}^2$ (Bohm-Gross) and gives it a group velocity.' },
    { id: 'netpl-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'group delay',
      q: 'A 30 MHz pulse travels 100 km through a uniform plasma with $f_p = 9.0$ MHz. Compared with vacuum, it arrives late by ______ $\\mu$s (to one decimal place), using the exact group velocity.',
      answer: 16.1, tol: 0.1, calc: () => (1e5 / (C0 * Math.sqrt(1 - 0.09)) - 1e5 / C0) * 1e6,
      sol: '$v_g = c\\sqrt{1 - (9/30)^2} = c\\sqrt{0.91} = 0.9539c$. Time $= \\dfrac{10^5}{0.9539\\times2.998\\times10^8} = 349.7\\ \\mu$s (349.67), against $333.56\\ \\mu$s in vacuum: delay $16.1\\ \\mu$s. (The $\\omega\\gg\\omega_p$ approximation $\\tfrac{L}{c}\\tfrac{f_p^2}{2f^2}$ gives 15.0 $\\mu$s, 7% low.)' },

    // ---------- level 4 ----------
    { id: 'netpl-029', type: 'nat', level: 4, exams: ['net'], sub: 'plasma parameter',
      q: 'For the plasma with $n = 1.0\\times10^{12}$ m$^{-3}$ and $T = 1000$ K, the number of electrons in a Debye sphere, $N_D = \\tfrac43\\pi n\\lambda_D^3$, is ______ $\\times10^4$ (to two decimal places).',
      answer: 4.35, tol: 0.03, calc: () => 4 / 3 * PI * 1e12 * Math.sqrt(EPS * KB * 1000 / (1e12 * E * E)) ** 3 / 1e4,
      sol: '$\\lambda_D = 2.182\\times10^{-3}$ m, so $\\lambda_D^3 = 1.039\\times10^{-8}$ m$^3$ and $N_D = 4.189\\times10^{12}\\times1.039\\times10^{-8} = 4.35\\times10^4$. $N_D\\gg1$ means collective behaviour dominates over binary collisions; $N_D\\propto T^{3/2}/n^{1/2}$.' },
    { id: 'netpl-030', type: 'mcq', level: 4, exams: ['net'], sub: 'whistlers',
      q: 'Lightning launches whistler waves ($\\omega\\ll\\omega_c$, $\\omega\\ll\\omega_p$) for which $n^2\\approx\\omega_p^2/\\omega\\omega_c$. A listener on the ground hears',
      options: ['a rising tone, since low frequencies arrive first', 'a falling tone, since high frequencies arrive first', 'a steady tone, since there is no dispersion', 'nothing in the audio band'], answer: 1,
      sol: '$k = n\\omega/c = \\dfrac{\\omega_p}{c}\\sqrt{\\omega/\\omega_c}$, so $\\omega\\propto k^2$ and $v_g = 2\\omega/k = \\dfrac{2c}{\\omega_p}\\sqrt{\\omega\\omega_c}\\propto\\sqrt\\omega$. Higher frequencies travel faster and arrive first: a descending whistle lasting about a second, with delay $\\propto1/\\sqrt f$.' },
    { id: 'netpl-031', type: 'nat', level: 4, exams: ['net'], sub: 'pulsar dispersion',
      q: 'A pulse is recorded at 600 MHz and 50 ms later at 400 MHz. Using $\\Delta t = 4.149\\text{ ms}\\times\\text{DM}\\,(f_1^{-2} - f_2^{-2})$ ($f$ in GHz), the dispersion measure is ______ pc cm$^{-3}$ (to two decimal places).',
      answer: 3.47, tol: 0.01, calc: () => 50 / (KDM * (1 / 0.16 - 1 / 0.36)),
      sol: 'Here $f_1 = 0.4$ GHz is the later (lower) frequency: $f_1^{-2} - f_2^{-2} = 6.25 - 2.778 = 3.472$ GHz$^{-2}$. Then $4.149\\times3.472 = 14.41$ ms per unit DM, so DM $= 50/14.41 = 3.47$ pc cm$^{-3}$, i.e. a column of $1.07\\times10^{23}$ electrons per m$^2$: a nearby pulsar.',
      trap: 'Using $f^{-1}$ instead of $f^{-2}$, or putting MHz into a GHz formula, changes the answer by large factors.' },
    { id: 'netpl-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ionosphere',
      q: 'Medium-wave AM stations (about 1 MHz) are heard far beyond the horizon at night, while FM stations (about 100 MHz) are not. The reason is that',
      options: ['FM signals are absorbed by water vapour', 'AM transmitters use more power at night', 'the ionosphere is denser at night', 'about 1 MHz lies below the ionospheric plasma frequency (reflected), while 100 MHz lies far above it (transmitted into space)'], answer: 3,
      sol: 'Peak $f_p$ in the F layer is a few to about 10 MHz. Below it (and below $f_p\\sec\\theta$ for oblique paths) waves are reflected and hop over the horizon; far above it they pass through. At night the lower, absorbing D layer disappears, so the reflected AM signal survives; the ionosphere is actually less dense at night.' },
    { id: 'netpl-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ionosphere',
      q: 'A vertical ionosonde finds echoes from the F layer for every frequency up to 7.0 MHz and none above. The peak electron density of the layer is ______ $\\times10^{11}$ m$^{-3}$ (to two decimal places).',
      answer: 6.08, tol: 0.03, calc: () => (2 * PI * 7e6) ** 2 * EPS * ME / E / E / 1e11,
      sol: 'At vertical incidence a wave reflects where $\\omega = \\omega_p$; the highest reflected frequency (the critical frequency) is the peak $f_p$. $n = \\dfrac{\\epsilon_0m(2\\pi f)^2}{e^2} = \\dfrac{8.854\\times10^{-12}\\times9.109\\times10^{-31}\\times1.934\\times10^{15}}{2.566\\times10^{-38}} = 6.08\\times10^{11}$ m$^{-3}$ (or $(7.0\\times10^6/8.98)^2$).' },
    { id: 'netpl-034', type: 'msq', level: 4, exams: ['net'], sub: 'plasma criteria',
      q: 'An ionised gas behaves as a plasma (collective behaviour) when',
      options: ['its size is much larger than the Debye length', 'the electron-neutral collision frequency is much larger than $\\omega_p$', 'the number of particles in a Debye sphere is much larger than 1', 'the typical potential energy between neighbours is much smaller than $kT$'], answer: [0, 2, 3],
      sol: 'Quasi-neutrality and screening need $L\\gg\\lambda_D$. Collective (statistical) shielding needs $N_D\\gg1$, which is equivalent to weak coupling: neighbour Coulomb energy $\\ll kT$. Collisions with neutrals must be rare compared with plasma oscillations ($\\omega_p\\tau\\gg1$), otherwise the gas behaves like an ordinary fluid.' },
    { id: 'netpl-035', type: 'nat', level: 4, exams: ['net'], sub: 'Faraday rotation',
      q: 'The rotation measure is $\\text{RM} = 0.812\\displaystyle\\int n_eB_\\parallel\\,dl$ rad m$^{-2}$ with $n_e$ in cm$^{-3}$, $B$ in $\\mu$G and $l$ in pc. Through 1000 pc of interstellar gas with $n_e = 0.030$ cm$^{-3}$ and $B_\\parallel = 2.0\\ \\mu$G, RM is ______ rad m$^{-2}$ (to one decimal place).',
      answer: 48.7, tol: 0.1, calc: () => 0.812 * 0.03 * 2 * 1000,
      sol: 'RM $= 0.812\\times0.030\\times2.0\\times1000 = 48.7$ rad m$^{-2}$. At 21 cm this rotates the plane by $48.7\\times0.0441 = 2.15$ rad. Combined with DM (which gives $\\int n_e\\,dl$) it measures the mean $B_\\parallel$ = 1.232 RM/DM $\\mu$G.' },
    { id: 'netpl-036', type: 'mcq', level: 4, exams: ['net'], sub: 'energy in plasma waves',
      q: 'For a transverse wave of frequency $\\omega$ in a cold plasma, the ratio of the time-averaged kinetic energy density of the electrons to the electric field energy density is',
      options: ['1', '$\\omega_p^2/\\omega^2$', '$\\omega^2/\\omega_p^2$', '$\\omega_p/\\omega$'], answer: 1,
      sol: 'Electron velocity amplitude $v_0 = eE_0/m\\omega$. Kinetic energy density $\\tfrac12nm\\langle v^2\\rangle = \\dfrac{ne^2E_0^2}{4m\\omega^2}$; electric energy density $\\tfrac12\\epsilon_0\\langle E^2\\rangle = \\tfrac14\\epsilon_0E_0^2$. Ratio $= \\dfrac{ne^2}{\\epsilon_0m\\omega^2} = \\omega_p^2/\\omega^2$. Near cutoff the electrons carry as much energy as the field, and the energy moves slowly ($v_g\\to0$).' },
    { id: 'netpl-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'phase and group velocity',
      q: 'In a plasma with $f_p = 9.0$ MHz, at what frequency is the group velocity of electromagnetic waves exactly $c/2$? Answer in MHz to two decimal places.',
      answer: 10.39, tol: 0.02, calc: () => 9 / Math.sqrt(0.75),
      sol: '$v_g/c = \\sqrt{1 - f_p^2/f^2} = 1/2$ gives $f_p^2/f^2 = 3/4$, so $f = f_p/\\sqrt{0.75} = 9.0/0.8660 = 10.39$ MHz. Then $v_p = 2c$, and $v_pv_g = c^2$ as it must.' },
    { id: 'netpl-038', type: 'mcq', level: 5, exams: ['net'], sub: 'ionosphere',
      q: 'An ionosonde quotes a virtual height $h\' = c\\,t_{echo}/2$ for each frequency. Compared with the true reflection height, $h\'$ is',
      options: ['always larger, because the pulse travels at $v_g < c$ in the ionised region', 'always smaller, because the phase velocity exceeds $c$', 'equal, since reflection happens at the boundary', 'larger for low frequencies and smaller for high ones'], answer: 0,
      sol: 'The echo time is $2\\int dz/v_g$ and $v_g < c$ wherever $n_e > 0$, so $h\' > h$. Near the reflection level $v_g\\to0$, which makes $h\'$ rise steeply as $f$ approaches the critical frequency. The phase velocity is irrelevant: pulses (energy) travel at $v_g$.' },
    { id: 'netpl-039', type: 'nat', level: 5, exams: ['net'], sub: 'Bohm-Gross waves',
      q: 'For Bohm-Gross waves $\\omega^2 = \\omega_p^2(1 + 3k^2\\lambda_D^2)$, with $\\lambda_D = v_{th}/\\omega_p$. At $k\\lambda_D = 0.20$ the group velocity is ______ $v_{th}$ (to three decimal places).',
      answer: 0.567, tol: 0.002, calc: () => 0.6 / Math.sqrt(1.12),
      sol: '$v_g = \\dfrac{d\\omega}{dk} = \\dfrac{3kv_{th}^2}{\\omega} = \\dfrac{3k\\lambda_Dv_{th}}{\\sqrt{1 + 3k^2\\lambda_D^2}} = \\dfrac{0.60\\,v_{th}}{\\sqrt{1.12}} = 0.567\\,v_{th}$. Meanwhile $v_p = \\omega/k = v_{th}\\sqrt{1.12}/0.2 = 5.29\\,v_{th}$, far out on the Maxwellian tail, so Landau damping is weak.' },
    { id: 'netpl-040', type: 'msq', level: 5, exams: ['net'], sub: 'Landau damping',
      q: 'Which statements about Landau damping of electron plasma waves are correct?',
      options: ['It occurs in a collisionless plasma', 'It comes from resonant electrons with speeds near the wave phase velocity', 'It becomes strong when $k\\lambda_D$ approaches 1', 'It requires a distribution with more fast electrons than slow ones at $v = v_p$'], answer: [0, 1, 2],
      sol: 'Electrons slightly slower than $v_p$ gain energy from the wave and slightly faster ones give energy to it. For a Maxwellian $\\partial f/\\partial v < 0$ at $v_p$: more slow than fast, so net damping, with no collisions. As $k\\lambda_D\\to1$, $v_p$ falls towards $v_{th}$ where many electrons resonate. A positive slope (bump on tail) gives growth instead of damping.' },
    { id: 'netpl-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'metals',
      q: 'Why do metals look shiny in visible light, while some become transparent in the ultraviolet?',
      options: ['Their electrons absorb visible light and re-emit it at random', 'Visible light excites interband transitions only', 'Visible light lies below the plasma frequency of the conduction electrons, so $\\epsilon_r < 0$ and it is reflected', 'Metals have a refractive index far above 1 in the visible'], answer: 2,
      sol: 'For $\\omega < \\omega_p$, $\\epsilon_r = 1 - \\omega_p^2/\\omega^2 < 0$, so $n$ is imaginary and the wave is reflected (apart from losses from collisions). Typical metallic $\\hbar\\omega_p$ is 5 to 15 eV, in the ultraviolet; above it the metal is transparent.' },
    { id: 'netpl-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'metals',
      q: 'Aluminium has $1.81\\times10^{29}$ free electrons per m$^3$. Its free-electron plasmon energy $\\hbar\\omega_p$ is ______ eV (to one decimal place).',
      answer: 15.8, tol: 0.1, calc: () => HB * wp(1.81e29) / E,
      sol: '$\\omega_p = \\sqrt{\\dfrac{1.81\\times10^{29}\\times2.566\\times10^{-38}}{8.854\\times10^{-12}\\times9.109\\times10^{-31}}} = 2.40\\times10^{16}$ s$^{-1}$. $\\hbar\\omega_p = 6.582\\times10^{-16}\\times2.40\\times10^{16} = 15.8$ eV, close to the 15 eV plasmon loss seen in electron energy-loss spectra of aluminium.' },
  ],
  gens: [
    { id: 'netpl-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'plasma frequency',
      make(r) {
        const m = choose(r, [1, 2, 3, 5, 8]), ex = int(r, 10, 20), n = m * 10 ** ex, ask = choose(r, ['f', 'f', 'n']);
        const f = wp(n) / 2 / PI;
        if (ask === 'n') {
          const fM = +(f / 1e6).toPrecision(3), nn = (2 * PI * fM * 1e6) ** 2 * EPS * ME / E / E, e10 = Math.floor(Math.log10(nn)), man = nn / 10 ** e10;
          return { q: `A plasma has a plasma frequency $f_p = ${fM}$ MHz. Its electron density is ______ $\\times10^{${e10}}$ m$^{-3}$ (to two decimal places).`,
            answer: round(man, 2), tol: Math.max(0.01, man * 0.006), ask, fM, e10,
            sol: `$n = \\epsilon_0m(2\\pi f_p)^2/e^2 = ${man.toFixed(3)}\\times10^{${e10}}$ m$^{-3}$ (equivalently $(f_p/8.98\\text{ Hz})^2$).`,
            trap: 'Square the frequency: density goes as $f_p^2$.' };
        }
        const val = f / 1e6;
        return { q: `An electron plasma has density $${m}\\times10^{${ex}}$ m$^{-3}$. Its plasma frequency $f_p$ is ______ MHz (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, ask, n,
          sol: `$\\omega_p = \\sqrt{ne^2/\\epsilon_0m} = ${wp(n).toPrecision(4)}$ s$^{-1}$, so $f_p = \\omega_p/2\\pi = ${val.toPrecision(4)}$ MHz (rule: $8.98\\sqrt n$ Hz).`,
          trap: 'Divide $\\omega_p$ by $2\\pi$ to get $f_p$.' };
      },
      verify: (p) => p.ask === 'n' ? (2 * PI * p.fM * 1e6) ** 2 * EPS * ME / E / E / 10 ** p.e10 : wp(p.n) / 2 / PI / 1e6 },
    { id: 'netpl-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'critical density',
      make(r) {
        const L = choose(r, [['CO$_2$ laser', 10.6], ['Nd:glass laser', 1.054], ['frequency-doubled Nd laser', 0.527], ['KrF laser', 0.248], ['Ti:sapphire laser', 0.8]]);
        const nc = EPS * ME * (2 * PI * C0 / (L[1] * 1e-6)) ** 2 / E / E, e10 = Math.floor(Math.log10(nc)), man = nc / 10 ** e10;
        return { q: `A ${L[0]} of wavelength ${L[1]} $\\mu$m is fired at a target. The critical electron density beyond which the light cannot propagate is ______ $\\times10^{${e10}}$ m$^{-3}$ (to two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), lam: L[1], e10,
          sol: `$n_c = \\epsilon_0m\\omega^2/e^2$ with $\\omega = 2\\pi c/\\lambda = ${(2 * PI * C0 / (L[1] * 1e-6)).toPrecision(4)}$ s$^{-1}$: $n_c = ${man.toFixed(3)}\\times10^{${e10}}$ m$^{-3}$ (rule: $1.115\\times10^{27}/\\lambda^2[\\mu\\text{m}]$).`,
          trap: 'Shorter wavelengths penetrate denser plasma: $n_c\\propto1/\\lambda^2$.' };
      },
      verify: (p) => EPS * ME * (2 * PI * C0 / (p.lam * 1e-6)) ** 2 / E / E / 10 ** p.e10 },
    { id: 'netpl-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'phase and group velocity',
      make(r) {
        const x = choose(r, [1.1, 1.25, 1.5, 2, 2.5, 3, 4, 5]), ask = choose(r, ['vg', 'vp', 'n']);
        const s = Math.sqrt(1 - 1 / (x * x)), val = { vg: s, vp: 1 / s, n: s }[ask];
        const txt = { vg: 'its group velocity, in units of $c$', vp: 'its phase velocity, in units of $c$', n: 'the refractive index of the plasma' }[ask];
        return { q: `An electromagnetic wave of frequency ${x}$\\,\\omega_p$ propagates in a cold plasma. Find ${txt} (three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.002, val * 0.002), x, ask,
          sol: `$n = \\sqrt{1 - \\omega_p^2/\\omega^2} = \\sqrt{1 - 1/${x}^2} = ${round(s, 4)}$. Then $v_g = nc$ and $v_p = c/n$. Answer: $${round(val, 4)}$.`,
          trap: '$v_g = nc$ and $v_p = c/n$, so $v_pv_g = c^2$; do not swap them.' };
      },
      verify: (p) => { const s = Math.sqrt(1 - 1 / p.x ** 2); return p.ask === 'vp' ? 1 / s : s; } },
    { id: 'netpl-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent waves',
      make(r) {
        const fp = choose(r, [5, 8, 9, 10, 12]), x = choose(r, [0.1, 0.3, 0.5, 0.7, 0.9]), f = round(fp * x, 2);
        const val = C0 / (2 * PI * Math.sqrt(fp ** 2 - f ** 2) * 1e6);
        return { q: `A wave of ${f} MHz is incident on a plasma with $f_p = ${fp}$ MHz. Find the $1/e$ penetration depth of the field into the plasma, in m (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, unit: 'm', fp, f,
          sol: `$\\kappa = \\dfrac{2\\pi}{c}\\sqrt{f_p^2 - f^2} = \\dfrac{2\\pi}{2.998\\times10^8}\\sqrt{${fp}^2 - ${f}^2}\\times10^6 = ${(1 / val).toPrecision(4)}$ m$^{-1}$, so $\\delta = 1/\\kappa = ${val.toPrecision(4)}$ m.`,
          trap: 'The depth grows without limit as $f\\to f_p$ and tends to $c/\\omega_p$ as $f\\to0$.' };
      },
      verify: (p) => C0 / (2 * PI * Math.sqrt(p.fp ** 2 - p.f ** 2) * 1e6) },
    { id: 'netpl-g05', type: 'nat', level: 2, exams: ['net'], sub: 'Debye screening',
      make(r) {
        const P = choose(r, [['the solar wind', 5e6, 1e5], ['a glow discharge', 1e16, 2e4], ['the ionosphere', 1e11, 1500], ['a tokamak core', 1e20, 1e8], ['the solar corona', 1e15, 1e6]]);
        const ask = choose(r, ['lD', 'ND']), lD = Math.sqrt(EPS * KB * P[2] / (P[1] * E * E));
        const ND = 4 / 3 * PI * P[1] * lD ** 3;
        const val = ask === 'lD' ? lD : Math.log10(ND);
        return { q: ask === 'lD' ? `In ${P[0]}, typical values are $n = ${P[1].toExponential(0).replace('e+', '\\times10^{')}}$ m$^{-3}$ and $T = ${P[2].toExponential(0).replace('e+', '\\times10^{')}}$ K. The Debye length is ______ m (three significant figures).` : `In ${P[0]}, typical values are $n = ${P[1].toExponential(0).replace('e+', '\\times10^{')}}$ m$^{-3}$ and $T = ${P[2].toExponential(0).replace('e+', '\\times10^{')}}$ K. Find $\\log_{10}N_D$, where $N_D = \\tfrac43\\pi n\\lambda_D^3$ is the number of electrons in a Debye sphere (two decimal places).`,
          answer: ask === 'lD' ? +val.toPrecision(3) : round(val, 2), tol: ask === 'lD' ? val * 0.01 : 0.02, n: P[1], T: P[2], ask,
          sol: `$\\lambda_D = \\sqrt{\\epsilon_0kT/ne^2} = ${lD.toPrecision(4)}$ m.${ask === 'ND' ? ` $N_D = \\tfrac43\\pi n\\lambda_D^3 = ${ND.toPrecision(3)}$, so $\\log_{10}N_D = ${round(val, 3)}$.` : ''}`,
          trap: 'Use $kT$ in joules with $T$ in kelvin; $\\lambda_D$ grows with $T$ and falls with $n$.' };
      },
      verify: (p) => { const l = Math.sqrt(EPS * KB * p.T / (p.n * E * E)); return p.ask === 'lD' ? l : Math.log10(4 / 3 * PI * p.n * l ** 3); } },
    { id: 'netpl-g06', type: 'nat', level: 3, exams: ['net'], sub: 'pulsar dispersion',
      make(r) {
        const DM = choose(r, [10, 26, 50, 71, 120, 300]), f1 = choose(r, [0.15, 0.33, 0.4, 0.6]), f2 = choose(r, [0.8, 1.4, 2.0]), ask = choose(r, ['dt', 'DM']);
        const dt = KDM * DM * (1 / f1 ** 2 - 1 / f2 ** 2);
        if (ask === 'DM') {
          const t = +dt.toPrecision(3);
          return { q: `A pulsar pulse arrives at ${f2 * 1000} MHz and then ${t} ms later at ${f1 * 1000} MHz. Using $\\Delta t = 4.149\\text{ ms}\\times\\text{DM}\\,(f_1^{-2} - f_2^{-2})$ with $f$ in GHz, find DM in pc cm$^{-3}$ (three significant figures).`,
            answer: +(t / (KDM * (1 / f1 ** 2 - 1 / f2 ** 2))).toPrecision(3), tol: DM * 0.01, ask, t, f1, f2,
            sol: `$f_1^{-2} - f_2^{-2} = ${round(1 / f1 ** 2 - 1 / f2 ** 2, 4)}$ GHz$^{-2}$. DM $= ${t}/(4.149\\times${round(1 / f1 ** 2 - 1 / f2 ** 2, 4)}) = ${(t / (KDM * (1 / f1 ** 2 - 1 / f2 ** 2))).toPrecision(4)}$ pc cm$^{-3}$.`,
            trap: 'The lower frequency arrives later.' };
        }
        return { q: `A pulsar has DM = ${DM} pc cm$^{-3}$. By how many milliseconds does a pulse at ${f1 * 1000} MHz lag the same pulse at ${f2 * 1000} MHz? Use $\\Delta t = 4.149\\text{ ms}\\times\\text{DM}\\,(f_1^{-2} - f_2^{-2})$ with $f$ in GHz (three significant figures).`,
          answer: +dt.toPrecision(3), tol: dt * 0.01, ask, DM, f1, f2,
          sol: `$\\Delta t = 4.149\\times${DM}\\times(${round(1 / f1 ** 2, 4)} - ${round(1 / f2 ** 2, 4)}) = ${dt.toPrecision(4)}$ ms. It comes from $1/v_g\\approx(1 + \\omega_p^2/2\\omega^2)/c$ integrated along the path.`,
          trap: 'The delay scales as $1/f^2$, not $1/f$.' };
      },
      verify: (p) => p.ask === 'dt' ? KDM * p.DM * (1 / p.f1 ** 2 - 1 / p.f2 ** 2) : p.t / (KDM * (1 / p.f1 ** 2 - 1 / p.f2 ** 2)) },
    { id: 'netpl-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'ionosphere',
      make(r) {
        const fp = choose(r, [4, 5, 6, 7, 8, 9, 10]), th = choose(r, [30, 45, 60, 70, 75]), ask = choose(r, ['f', 'th']);
        const f = fp / Math.cos(th * PI / 180);
        if (ask === 'th') {
          const ff = round(f, 1), val = Math.acos(fp / ff) * 180 / PI;
          return { q: `The ionosphere's peak plasma frequency is ${fp} MHz. A ${ff} MHz signal must be reflected back to Earth. Using the secant law, the smallest angle of incidence from the vertical that still gives reflection is ______ degrees (one decimal place).`,
            answer: round(val, 1), tol: 0.15, ask, fp, ff,
            sol: `Reflection needs $f\\le f_p\\sec\\theta_0$, i.e. $\\cos\\theta_0\\le f_p/f = ${fp}/${ff} = ${round(fp / ff, 4)}$, so $\\theta_0\\ge${round(val, 2)}^\\circ$.`,
            trap: 'Steeper (more vertical) rays pass through; only oblique rays come back.' };
        }
        return { q: `The ionosphere's peak plasma frequency is ${fp} MHz. Using the secant law, the highest frequency reflected for a ray incident at ${th}$^\\circ$ from the vertical is ______ MHz (two decimal places).`,
          answer: round(f, 2), tol: 0.02, ask, fp, th,
          sol: `Snell in a layered medium: the ray turns where $n = \\sin\\theta_0$, i.e. $f = f_p/\\cos\\theta_0 = ${fp}/${round(Math.cos(th * PI / 180), 4)} = ${round(f, 3)}$ MHz.`,
          trap: 'Use the angle from the vertical; with the elevation angle the sine and cosine swap.' };
      },
      verify: (p) => p.ask === 'f' ? p.fp / Math.cos(p.th * PI / 180) : Math.acos(p.fp / p.ff) * 180 / PI },
    { id: 'netpl-g08', type: 'nat', level: 3, exams: ['net'], sub: 'Bohm-Gross waves',
      make(r) {
        const kl = choose(r, [0.05, 0.1, 0.15, 0.2, 0.3, 0.4]), ask = choose(r, ['w', 'vg', 'vp']);
        const w = Math.sqrt(1 + 3 * kl * kl), val = { w, vg: 3 * kl / w, vp: w / kl }[ask];
        const txt = { w: 'the frequency in units of $\\omega_p$', vg: 'the group velocity in units of $v_{th}$', vp: 'the phase velocity in units of $v_{th}$' }[ask];
        return { q: `Electron plasma waves obey $\\omega^2 = \\omega_p^2 + 3k^2v_{th}^2$, with $\\lambda_D = v_{th}/\\omega_p$. At $k\\lambda_D = ${kl}$, find ${txt} (three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.002, val * 0.002), kl, ask,
          sol: `$\\omega/\\omega_p = \\sqrt{1 + 3(k\\lambda_D)^2} = ${round(w, 4)}$. $v_g = 3kv_{th}^2/\\omega = 3k\\lambda_Dv_{th}/(\\omega/\\omega_p)$, $v_p = \\omega/k = v_{th}(\\omega/\\omega_p)/(k\\lambda_D)$. Answer: $${round(val, 4)}$.`,
          trap: 'Here $v_pv_g = 3v_{th}^2$, not $c^2$.' };
      },
      verify: (p) => { const w = Math.sqrt(1 + 3 * p.kl ** 2); return { w, vg: 3 * p.kl / w, vp: w / p.kl }[p.ask]; } },
    { id: 'netpl-g09', type: 'nat', level: 3, exams: ['net'], sub: 'magnetised plasma',
      make(r) {
        const fp = choose(r, [1, 2, 3, 5, 10]), B = choose(r, [0.05, 0.1, 0.2, 0.5, 1]), ask = choose(r, ['UH', 'fc']);
        const fc = E * B / (2 * PI * ME) / 1e9, val = ask === 'fc' ? fc : Math.sqrt(fp * fp + fc * fc);
        return { q: ask === 'fc' ? `Find the electron cyclotron frequency $f_c$ in a field of ${B} T, in GHz (three significant figures).` : `A plasma with $f_p = ${fp}$ GHz sits in a field of ${B} T. Find its upper hybrid frequency in GHz (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, fp, B, ask,
          sol: `$f_c = eB/2\\pi m = 27.99\\times${B} = ${fc.toPrecision(4)}$ GHz.${ask === 'UH' ? ` $f_{UH} = \\sqrt{f_p^2 + f_c^2} = \\sqrt{${fp}^2 + ${fc.toPrecision(4)}^2} = ${val.toPrecision(4)}$ GHz.` : ''}`,
          trap: 'The cyclotron frequency depends only on $B$ (and $e/m$), not on density or energy (non-relativistic).' };
      },
      verify: (p) => { const fc = E * p.B / (2 * PI * ME) / 1e9; return p.ask === 'fc' ? fc : Math.hypot(p.fp, fc); } },
    { id: 'netpl-g10', type: 'nat', level: 2, exams: ['net'], sub: 'ion-acoustic waves',
      make(r) {
        const I = choose(r, [['hydrogen', 1.00728], ['helium-4', 4.0015], ['argon-40', 39.95], ['deuterium', 2.0136]]), Te = choose(r, [1, 2, 5, 10, 20, 100]);
        const val = Math.sqrt(Te * E / (I[1] * C.u)) / 1e3;
        return { q: `In a ${I[0]} plasma (singly charged ions, mass ${I[1]} u, cold ions) with $T_e = ${Te}$ eV, the ion-acoustic speed $\\sqrt{kT_e/M}$ is ______ km/s (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, Te, M: I[1],
          sol: `$c_s = \\sqrt{\\dfrac{${Te}\\times1.602\\times10^{-19}}{${I[1]}\\times1.6605\\times10^{-27}}} = ${(val * 1e3).toPrecision(4)}$ m/s $= ${val.toPrecision(4)}$ km/s.`,
          trap: 'Electron temperature, ion mass: the electrons push, the ions carry the inertia.' };
      },
      verify: (p) => Math.sqrt(p.Te * E / (p.M * C.u)) / 1e3 },
    { id: 'netpl-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cutoff',
      make(r) {
        const fp = choose(r, [5, 8, 9, 10]), x = choose(r, [0.6, 0.8, 1.25, 1.5, 2, 3]), f = round(fp * x, 2);
        const vg = x > 1 ? round(Math.sqrt(1 - 1 / (x * x)), 3) : null;
        const correct = vg ? `transmitted, with group velocity ${vg}$c$` : 'reflected; the field inside decays evanescently';
        const w = vg ? ['reflected; the field inside decays evanescently', `transmitted, with group velocity ${round(1 / vg, 3)}$c$`, `transmitted, with group velocity ${round(vg * vg, 3)}$c$`, 'absorbed completely'] : [`transmitted, with group velocity ${round(Math.sqrt(1 - x * x), 3)}$c$`, 'transmitted at speed $c$', 'absorbed completely'];
        const o = mcqOptions(r, correct, w, (v) => v);
        return { q: `A ${f} MHz wave falls normally on a thick, uniform, collisionless plasma with $f_p = ${fp}$ MHz. The wave is`, ...o,
          sol: vg ? `$f > f_p$, so it propagates with $v_g = c\\sqrt{1 - (f_p/f)^2} = c\\sqrt{1 - ${round(1 / (x * x), 4)}} = ${vg}c$ (phase velocity ${round(1 / vg, 3)}$c$).` : `$f < f_p$, so $k^2 < 0$: the field decays as $e^{-\\kappa z}$ with no energy flow, and a collisionless plasma reflects it totally.`,
          trap: 'Above cutoff, $v_g < c < v_p$.' };
      } },
    { id: 'netpl-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const P = choose(r, [
          ['Which quantity does the cold-plasma frequency $\\omega_p$ NOT depend on?', 'the temperature', ['the electron density', 'the electron mass', 'the electron charge'], '$\\omega_p^2 = ne^2/\\epsilon_0m$ has no temperature in it; temperature enters only through Bohm-Gross and Debye terms.'],
          ['Ions are often ignored in high-frequency plasma waves because', 'they are thousands of times heavier, so they barely move at $\\omega\\sim\\omega_{pe}$', ['they carry no charge', 'they are fewer than the electrons', 'they move faster than the electrons'], 'The response of a species goes as $q^2/m$; ions contribute $\\omega_{pi}^2 = (m_e/M)\\omega_{pe}^2$.'],
          ['A plasma shields a static test charge over a distance of about', 'the Debye length $\\sqrt{\\epsilon_0kT/ne^2}$', ['the collisionless skin depth $c/\\omega_p$', 'the mean interparticle spacing $n^{-1/3}$', 'the Larmor radius'], 'Mobile electrons rearrange with Boltzmann factors and screen the charge as $e^{-r/\\lambda_D}/r$.'],
          ['A static magnetic field penetrates a collisionless plasma conductor only to about', 'the skin depth $c/\\omega_p$ (for fields that are switched on quickly)', ['the Debye length', 'infinitely far', 'one wavelength of light'], 'From $\\epsilon_r = 1 - \\omega_p^2/\\omega^2$ at low frequency, $\\kappa\\to\\omega_p/c$: the inertial (London-like) skin depth.'],
          ['The dispersion relation $\\omega^2 = \\omega_p^2 + c^2k^2$ means a photon in a plasma behaves like a particle with', 'rest energy $\\hbar\\omega_p$', ['zero rest mass', 'charge $e$', 'rest energy $\\hbar ck$'], 'Multiplying by $\\hbar^2$ gives $E^2 = (\\hbar\\omega_p)^2 + (pc)^2$.'],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. ${P[3]}` };
      } },
    ...more,
  ],
};
