// Electromagnetic waves in matter, conductors and plasmas: linear dielectrics and impedance, complex permittivity and
// loss tangent, good and poor conductors (skin depth, surface resistance, phase of B), charge relaxation, cold plasma
// dispersion and cutoff, the Drude and Lorentz models, group velocity and dispersion, Kramers-Kronig (GATE/NET level).
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt, C } from '../_util.js';
import more from './em-waves-media.more.gen.js';
import more2 from './em-waves-media.more2.gen.js';

const PC = 3.0857e16; // parsec in metres
const KDM = (C.e * C.e) / (8 * Math.PI ** 2 * C.eps0 * C.me * C.c); // delay t = KDM * (column density) / f^2
const fpOf = (n) => Math.sqrt((n * C.e * C.e) / (C.me * C.eps0)) / (2 * Math.PI);
const deltaOf = (sigma, f, mur = 1) => Math.sqrt(2 / (mur * C.mu0 * sigma * 2 * Math.PI * f));
const ETA0 = Math.sqrt(C.mu0 / C.eps0);
const METALS = [['copper', 5.8e7], ['aluminium', 3.5e7], ['silver', 6.3e7], ['gold', 4.1e7], ['brass', 1.5e7], ['stainless steel (non-magnetic)', 1.4e6]];

export default {
  topic: 'em-waves-media',
  items: [
    // ---------- level 1 ----------
    { id: 'emm-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'linear dielectrics',
      q: 'The intrinsic impedance $\\eta = \\sqrt{\\mu/\\epsilon}$ of a lossless non-magnetic medium with $\\epsilon_r = 9$ is closest to',
      options: ['$1131\\ \\Omega$', '$42\\ \\Omega$', '$126\\ \\Omega$', '$377\\ \\Omega$'], answer: 2,
      sol: '$\\eta = \\sqrt{\\mu_0/(\\epsilon_r\\epsilon_0)} = \\eta_0/\\sqrt{\\epsilon_r} = 376.7/3 \\approx 126\\ \\Omega$.',
      trap: 'Dividing by $\\epsilon_r$ instead of $\\sqrt{\\epsilon_r}$ gives $42\\ \\Omega$; multiplying gives $1131\\ \\Omega$.' },
    { id: 'emm-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'In a good conductor, the skin depth depends on the frequency $f$ as',
      options: ['$f^{-1}$', '$f^{-1/2}$', '$f^{1/2}$', 'it does not depend on $f$'], answer: 1,
      sol: '$\\delta = \\sqrt{2/(\\mu\\sigma\\omega)}$, so $\\delta \\propto f^{-1/2}$: four times the frequency halves the skin depth.',
      trap: 'For a poor conductor the attenuation length is nearly independent of $f$; do not mix the two limits.' },
    { id: 'emm-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'plasma',
      q: 'The plasma frequency of a free-electron gas of number density $n$ is proportional to',
      options: ['$n$', '$n^2$', '$1/\\sqrt n$', '$\\sqrt n$'], answer: 3,
      sol: '$\\omega_p = \\sqrt{ne^2/(m\\epsilon_0)} \\propto \\sqrt n$. Numerically $f_p \\approx 8.98\\sqrt{n}$ Hz with $n$ in m$^{-3}$.',
      trap: 'Denser plasma has a higher cutoff, but only as the square root.' },
    { id: 'emm-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'charge relaxation',
      q: 'A medium has $\\epsilon_r = 5$ and conductivity $\\sigma = 2.0\\times10^{-3}$ S/m. A free charge placed inside decays with time constant $\\tau = \\epsilon/\\sigma$. Find $\\tau$ in ns (to one decimal place).',
      answer: 22.1, tol: 0.2, unit: 'ns', calc: () => (5 * C.eps0) / 2e-3 * 1e9,
      sol: 'Continuity plus Gauss plus Ohm give $\\partial\\rho_f/\\partial t = -(\\sigma/\\epsilon)\\rho_f$, so $\\rho_f \\propto e^{-t/\\tau}$ with $\\tau = \\frac{5\\times8.854\\times10^{-12}}{2.0\\times10^{-3}} = 2.21\\times10^{-8}$ s $= 22.1$ ns.',
      trap: 'Forgetting $\\epsilon_r$ and using $\\epsilon_0$ alone gives a value five times too small.' },
    { id: 'emm-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'For a plane wave inside a good conductor, the magnetic field relative to the electric field',
      options: ['is in phase with it', 'lags it by $45^\\circ$', 'leads it by $45^\\circ$', 'lags it by $90^\\circ$'], answer: 1,
      sol: 'With $\\tilde k = (1 + i)/\\delta = \\frac{\\sqrt2}{\\delta}e^{i\\pi/4}$ and $\\tilde B = (\\tilde k/\\omega)\\tilde E$, $B$ carries an extra phase $+\\pi/4$ in $\\cos(kz - \\omega t + \\phi)$. At a fixed point that peak arrives later in time, so $B$ lags $E$ by $45^\\circ$.',
      trap: 'In a perfect dielectric the two are in phase; the $45^\\circ$ comes from $\\sigma \\gg \\omega\\epsilon$.' },
    { id: 'emm-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'A material counts as a <em>good conductor</em> at angular frequency $\\omega$ when',
      options: ['$\\sigma \\gg \\omega\\epsilon$', '$\\sigma \\ll \\omega\\epsilon$', '$\\sigma \\gg \\omega\\mu$', '$\\sigma = \\omega\\epsilon$'], answer: 0,
      sol: 'Ampère-Maxwell has $\\sigma\\vec E - i\\omega\\epsilon\\vec E$: conduction current against displacement current. Good conductor: the conduction current dominates, $\\sigma/(\\omega\\epsilon) \\gg 1$. The same material can be a good conductor at low frequency and a dielectric at high frequency.',
      trap: '$\\sigma$ and $\\omega\\mu$ have different units, so they cannot be compared.' },

    // ---------- level 2 ----------
    { id: 'emm-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'Aluminium has $\\sigma = 3.5\\times10^7$ S/m and $\\mu \\approx \\mu_0$. Its skin depth at the mains frequency of 50 Hz is ______ mm (to one decimal place).',
      answer: 12.0, tol: 0.15, unit: 'mm', calc: () => deltaOf(3.5e7, 50) * 1e3,
      sol: '$\\delta = \\sqrt{\\dfrac{2}{\\mu_0\\sigma\\omega}} = \\sqrt{\\dfrac{2}{1.2566\\times10^{-6}\\times3.5\\times10^7\\times2\\pi\\times50}} = \\sqrt{1.45\\times10^{-4}}$ m $\\approx 12.0$ mm. This is why thick power-line conductors use a steel core: the outer centimetre carries the current.',
      trap: 'Using $f$ instead of $\\omega = 2\\pi f$ gives a value $\\sqrt{2\\pi}$ too large.' },
    { id: 'emm-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      q: 'A laboratory plasma has electron density $4.0\\times10^{16}$ m$^{-3}$. Its plasma frequency $f_p = \\omega_p/2\\pi$ is ______ GHz (to two decimal places).',
      answer: 1.80, tol: 0.02, unit: 'GHz', calc: () => fpOf(4e16) / 1e9,
      sol: '$\\omega_p = \\sqrt{\\dfrac{ne^2}{m\\epsilon_0}}$, so $f_p = 8.98\\sqrt{n}$ Hz $= 8.98\\times2.0\\times10^8 = 1.80\\times10^9$ Hz. Microwaves below 1.8 GHz are reflected by this plasma.',
      trap: 'Quoting $\\omega_p$ ($1.13\\times10^{10}$ rad/s) when $f_p$ is asked.' },
    { id: 'emm-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      q: 'The dispersion relation for transverse electromagnetic waves in a cold, collisionless electron plasma is',
      options: ['$\\omega^2 = \\omega_p^2 - c^2k^2$', '$\\omega = \\omega_p + ck$', '$\\omega^2 = c^2k^2 - \\omega_p^2$', '$\\omega^2 = \\omega_p^2 + c^2k^2$'], answer: 3,
      sol: 'Each electron obeys $m\\dot{\\vec v} = -e\\vec E$, so $\\vec J = \\frac{ine^2}{m\\omega}\\vec E$ and $\\epsilon(\\omega) = \\epsilon_0(1 - \\omega_p^2/\\omega^2)$. Then $k^2 = \\omega^2\\mu_0\\epsilon = (\\omega^2 - \\omega_p^2)/c^2$, i.e. $\\omega^2 = \\omega_p^2 + c^2k^2$. Real $k$ needs $\\omega > \\omega_p$.',
      trap: 'The relation has the same form as $E^2 = m^2c^4 + p^2c^2$: the plasma gives the photon an effective mass.' },
    { id: 'emm-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      q: 'For waves in a cold plasma above the plasma frequency, the product of phase velocity and group velocity is',
      options: ['$c$', '$c^2\\omega_p/\\omega$', '$c^2$', '$c^2(1 - \\omega_p^2/\\omega^2)$'], answer: 2,
      sol: 'From $\\omega^2 = \\omega_p^2 + c^2k^2$: $v_p = \\omega/k$ and $v_g = d\\omega/dk = c^2k/\\omega$, so $v_pv_g = c^2$. With $v_p > c$, the group velocity is below $c$.',
      trap: '$c^2(1 - \\omega_p^2/\\omega^2)$ is $v_g^2$, not $v_pv_g$.' },
    { id: 'emm-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'For a plane wave of angular frequency $\\omega$ in a good conductor with skin depth $\\delta$, which statements are true?',
      options: ['The wavelength inside is $2\\pi\\delta$', 'The phase velocity is $\\omega\\delta$', 'The ratio $E_0/B_0$ is much larger than $c$', 'The field amplitude falls by a factor $e$ in one skin depth'], answer: [0, 1, 3],
      sol: 'In a good conductor $\\tilde k = (1 + i)/\\delta$: the real part $1/\\delta$ gives $\\lambda = 2\\pi\\delta$ and $v_p = \\omega/k = \\omega\\delta$; the imaginary part $1/\\delta$ gives decay $e^{-z/\\delta}$. And $E_0/B_0 = \\omega/|\\tilde k| = \\sqrt{\\omega/(\\mu\\sigma)}$, which is much less than $c$: the field is mostly magnetic.',
      trap: 'In a conductor the wave is nearly all magnetic, the opposite of a large $E/B$.' },
    { id: 'emm-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'loss tangent',
      q: 'Moist soil has $\\sigma = 0.010$ S/m and $\\epsilon_r = 10$. Its loss tangent $\\sigma/(\\omega\\epsilon)$ at 10 MHz is ______ (to two decimal places).',
      answer: 1.80, tol: 0.02, calc: () => 0.01 / (2 * Math.PI * 1e7 * 10 * C.eps0),
      sol: '$\\omega\\epsilon = 2\\pi\\times10^7\\times10\\times8.854\\times10^{-12} = 5.56\\times10^{-3}$ S/m, so $\\tan\\delta = 0.010/5.56\\times10^{-3} \\approx 1.80$. Neither limit applies: conduction and displacement currents are comparable, so the full complex $\\tilde k$ must be used.',
      trap: 'Forgetting $\\epsilon_r$ makes the soil look like a good conductor (ratio 18).' },
    { id: 'emm-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'surface resistance',
      q: 'The surface resistance $R_s$ of a good conductor (the real part of its surface impedance) is',
      options: ['$1/(\\sigma\\delta)$', '$\\delta/\\sigma$', '$\\sigma\\delta$', '$1/(\\sigma\\delta^2)$'], answer: 0,
      sol: 'The current flows effectively in a layer of thickness $\\delta$, so a square of surface has resistance $\\frac{1}{\\sigma}\\frac{L}{L\\delta} = \\frac{1}{\\sigma\\delta} = \\sqrt{\\frac{\\mu\\omega}{2\\sigma}}$. The power absorbed per unit area is $\\frac12R_s|H_0|^2$.',
      trap: 'Check units: $1/(\\sigma\\delta)$ is in ohms; $\\delta/\\sigma$ is not.' },
    { id: 'emm-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      q: 'A wave of angular frequency $\\omega < \\omega_p$ falls on a cold, collisionless plasma. Inside the plasma the wave',
      options: ['propagates with phase velocity less than $c$', 'is evanescent: its amplitude decays and the energy is reflected', 'is absorbed by collisions and turned into heat', 'travels at exactly $c$'], answer: 1,
      sol: 'For $\\omega < \\omega_p$, $k^2 = (\\omega^2 - \\omega_p^2)/c^2 < 0$, so $k = i\\kappa$ and the field falls as $e^{-\\kappa z}$. The average Poynting vector inside is zero (E and B are $90^\\circ$ out of phase), so with no collisions nothing is absorbed: the wave is totally reflected.',
      trap: 'Decay does not mean absorption: an evanescent field stores energy but carries none on average.' },
    { id: 'emm-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'attenuation',
      q: 'A wave travels three skin depths into a conductor. By how many decibels has its <em>power</em> fallen? (to one decimal place)',
      answer: 26.1, tol: 0.1, unit: 'dB', calc: () => 20 * Math.log10(Math.exp(3)),
      sol: 'The field falls as $e^{-z/\\delta}$, the power as $e^{-2z/\\delta}$. At $z = 3\\delta$ the power ratio is $e^{-6}$, i.e. $10\\log_{10}e^{6} = 60\\log_{10}e = 26.1$ dB (8.686 dB per neper of field attenuation).',
      trap: 'Using the field decay $e^{-3}$ in $10\\log_{10}$ gives 13.0 dB, half the answer.' },
    { id: 'emm-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dispersion',
      q: 'In a region of normal dispersion ($dn/d\\omega > 0$, $n > 1$), the group velocity $v_g$ and phase velocity $v_p$ satisfy',
      options: ['$v_g > v_p$', '$v_g = v_p$', '$v_g > c$ always', '$v_g < v_p$'], answer: 3,
      sol: '$v_g = \\dfrac{d\\omega}{dk}$ with $k = n\\omega/c$ gives $v_g = \\dfrac{c}{n + \\omega\\,dn/d\\omega}$. With $dn/d\\omega > 0$ the denominator exceeds $n$, so $v_g < c/n = v_p$.',
      trap: 'The group index is $n + \\omega\\,dn/d\\omega$, not $n - \\omega\\,dn/d\\omega$ (the minus sign belongs to the form with $\\lambda$).' },
    { id: 'emm-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      q: 'For a transverse wave with $\\omega > \\omega_p$ in a cold electron plasma, which statements are true?',
      options: ['The phase velocity is greater than $c$', 'The group velocity is less than $c$', 'The refractive index is less than 1', 'Waves of every frequency can travel through it'], answer: [0, 1, 2],
      sol: '$n = \\sqrt{1 - \\omega_p^2/\\omega^2} < 1$, so $v_p = c/n > c$, and $v_g = cn < c$. Below $\\omega_p$, $n$ is imaginary and the wave cannot travel, so the last statement is false.',
      trap: 'A phase velocity above $c$ carries no information and breaks no rule.' },
    { id: 'emm-044', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'Inside a good conductor (conductivity $\\sigma$, permeability $\\mu$), the amplitude ratio $B_0/E_0$ of a plane wave of angular frequency $\\omega$ is',
      options: ['$1/c$', '$\\sqrt{\\mu\\sigma/\\omega}$', '$\\sqrt{\\mu\\epsilon}$', '$\\mu\\sigma\\delta$'], answer: 1,
      sol: '$B_0/E_0 = |\\tilde k|/\\omega$ and $|\\tilde k| = |1 + i|/\\delta = \\sqrt2\\sqrt{\\mu\\sigma\\omega/2} = \\sqrt{\\mu\\sigma\\omega}$. So $B_0/E_0 = \\sqrt{\\mu\\sigma/\\omega}$, far larger than $1/c$.',
      trap: '$\\mu\\sigma\\delta = \\sqrt{2\\mu\\sigma/\\omega}$ is $\\sqrt2$ times too big: it uses only the real part of $\\tilde k$ twice.' },

    // ---------- level 3 ----------
    { id: 'emm-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'poor conductors',
      q: 'A non-magnetic medium has $\\epsilon_r = 4$ and $\\sigma = 1.0\\times10^{-3}$ S/m. At 100 MHz it is a low-loss medium. After what distance does the field amplitude fall to $1/e$? (in m, to one decimal place)',
      answer: 10.6, tol: 0.1, unit: 'm', calc: () => 1 / (0.5e-3 * Math.sqrt(C.mu0 / (4 * C.eps0))),
      sol: 'Check: $\\omega\\epsilon = 2\\pi\\times10^8\\times4\\times8.854\\times10^{-12} = 0.022$ S/m $\\gg \\sigma$, so low-loss. Then $\\alpha \\approx \\frac{\\sigma}{2}\\sqrt{\\mu/\\epsilon} = \\frac{\\sigma\\eta}{2}$ with $\\eta = 376.7/2 = 188.4\\ \\Omega$: $\\alpha = 0.0942$ Np/m and $1/\\alpha = 10.6$ m.',
      trap: 'The good-conductor formula $\\sqrt{2/(\\mu\\sigma\\omega)}$ gives 1.6 m, wrong here because $\\sigma \\ll \\omega\\epsilon$.' },
    { id: 'emm-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'For a plane wave in copper ($\\sigma = 5.8\\times10^7$ S/m, $\\epsilon \\approx \\epsilon_0$) at 1.0 GHz, the ratio of time-averaged magnetic to electric energy density is $N\\times10^9$. Find $N$ (to two decimal places).',
      answer: 1.04, tol: 0.01, calc: () => 5.8e7 / (2 * Math.PI * 1e9 * C.eps0) / 1e9,
      sol: '$\\dfrac{u_B}{u_E} = \\dfrac{B_0^2/\\mu}{\\epsilon E_0^2} = \\dfrac{|\\tilde k|^2}{\\mu\\epsilon\\omega^2} = \\dfrac{\\mu\\sigma\\omega}{\\mu\\epsilon\\omega^2} = \\dfrac{\\sigma}{\\epsilon\\omega} = \\dfrac{5.8\\times10^7}{5.56\\times10^{-2}} = 1.04\\times10^{9}$.',
      trap: 'In vacuum the two energies are equal; in a conductor the magnetic part wins by the loss tangent.' },
    { id: 'emm-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'Treat the conduction electrons of an alkali metal as a free-electron plasma with plasma frequency $\\omega_p$ (collisions neglected). Which statements are true?',
      options: ['The metal is transparent for $\\omega > \\omega_p$', 'It reflects totally for $\\omega < \\omega_p$', 'For typical metals $\\omega_p$ lies in the ultraviolet', '$\\epsilon(\\omega)$ is positive for $\\omega < \\omega_p$'], answer: [0, 1, 2],
      sol: '$\\epsilon/\\epsilon_0 = 1 - \\omega_p^2/\\omega^2$ is negative below $\\omega_p$ (so $n$ is imaginary and $|r| = 1$) and positive above (the metal transmits). With $n \\sim 10^{28}$ m$^{-3}$, $\\omega_p \\sim 10^{16}$ rad/s: ultraviolet. This is the ultraviolet transparency of the alkali metals.',
      trap: 'The sign of $\\epsilon$ below $\\omega_p$ is what makes metals shiny.' },
    { id: 'emm-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'plasma',
      q: 'A wave of angular frequency $\\omega < \\omega_p$ meets a cold plasma. The distance over which the field amplitude falls by $1/e$ inside is',
      options: ['$c/\\omega_p$ for every $\\omega$', '$c/\\sqrt{\\omega^2 + \\omega_p^2}$', '$c/\\sqrt{\\omega_p^2 - \\omega^2}$', '$c\\,\\omega/\\omega_p^2$'], answer: 2,
      sol: '$k^2 = (\\omega^2 - \\omega_p^2)/c^2 = -\\kappa^2$ gives $\\kappa = \\sqrt{\\omega_p^2 - \\omega^2}/c$, so the $1/e$ length is $c/\\sqrt{\\omega_p^2 - \\omega^2}$. It tends to $c/\\omega_p$ for $\\omega \\ll \\omega_p$ and grows without bound as $\\omega \\to \\omega_p$.',
      trap: '$c/\\omega_p$ is only the low-frequency limit.' },
    { id: 'emm-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dispersion',
      q: 'Radio pulses from a pulsar cross interstellar plasma with electron column density $\\int n\\,dl = 30$ pc cm$^{-3}$ ($1$ pc $= 3.086\\times10^{16}$ m). For $f \\gg f_p$ the extra group delay is $t = \\dfrac{e^2}{8\\pi^2\\epsilon_0m_ec}\\dfrac{\\int n\\,dl}{f^2}$. By how many milliseconds does the 400 MHz pulse arrive after the 800 MHz pulse? (nearest ms)',
      answer: 583, tol: 3, unit: 'ms', calc: () => KDM * 30 * PC * 1e6 * (1 / 400e6 ** 2 - 1 / 800e6 ** 2) * 1e3,
      sol: 'Convert: $30$ pc cm$^{-3} = 30\\times3.086\\times10^{16}\\times10^6 = 9.26\\times10^{23}$ m$^{-2}$. The constant $\\frac{e^2}{8\\pi^2\\epsilon_0m_ec} = 1.345\\times10^{-7}$ SI. So $\\Delta t = 1.345\\times10^{-7}\\times9.26\\times10^{23}\\times\\left(\\frac{1}{(4\\times10^8)^2} - \\frac{1}{(8\\times10^8)^2}\\right) = 1.245\\times10^{17}\\times4.69\\times10^{-18} = 0.583$ s.',
      trap: 'Forgetting the cm$^{-3}$ to m$^{-3}$ factor of $10^6$.' },
    { id: 'emm-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lorentz model',
      q: 'In the Lorentz (bound-electron) model of a dielectric, close to a resonance $\\omega_0$ with small damping, which description is correct?',
      options: ['$n$ rises with $\\omega$ and absorption is smallest at $\\omega_0$', '$n = 1$ exactly and there is no absorption', '$n$ is constant and absorption grows as $\\omega^4$', 'absorption peaks and $n$ falls with $\\omega$ (anomalous dispersion)'], answer: 3,
      sol: '$\\chi \\propto \\dfrac{1}{\\omega_0^2 - \\omega^2 - i\\gamma\\omega}$. The imaginary part (absorption) peaks at $\\omega_0$ with width $\\gamma$. The real part rises below the line, then falls through the line ($dn/d\\omega < 0$: anomalous dispersion), then rises again above it.',
      trap: 'Normal dispersion holds away from resonances; anomalous dispersion is confined to the absorption band.' },
    { id: 'emm-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'surface resistance',
      q: 'The surface resistance $R_s = \\sqrt{\\pi f\\mu_0/\\sigma}$ of copper ($\\sigma = 5.8\\times10^7$ S/m) at 10 GHz is ______ m$\\Omega$ (to one decimal place).',
      answer: 26.1, tol: 0.3, unit: 'mΩ', calc: () => Math.sqrt((Math.PI * 1e10 * C.mu0) / 5.8e7) * 1e3,
      sol: '$R_s = \\sqrt{\\dfrac{\\pi\\times10^{10}\\times1.2566\\times10^{-6}}{5.8\\times10^7}} = \\sqrt{6.81\\times10^{-4}} = 0.0261\\ \\Omega$. Equivalently $1/(\\sigma\\delta)$ with $\\delta = 0.66\\ \\mu$m.',
      trap: '$\\sqrt{\\pi f\\mu_0/\\sigma}$ is the same as $\\sqrt{\\mu_0\\omega/(2\\sigma)}$; do not use $\\omega$ in the first form.' },
    { id: 'emm-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'The magnitude of the intrinsic impedance $|\\eta_c| = |\\tilde E/\\tilde H|$ of a good conductor, compared with $\\eta_0 \\approx 377\\ \\Omega$, is',
      options: ['about equal to $\\eta_0$', 'much larger than $\\eta_0$', 'smaller by the factor $\\sqrt{\\omega\\epsilon_0/\\sigma}$', 'exactly zero'], answer: 2,
      sol: '$\\eta_c = \\mu\\omega/\\tilde k$ with $|\\tilde k| = \\sqrt{\\mu_0\\sigma\\omega}$, so $|\\eta_c| = \\sqrt{\\mu_0\\omega/\\sigma} = \\eta_0\\sqrt{\\epsilon_0\\omega/\\sigma}$. For copper at 1 GHz that is about 12 m$\\Omega$. The tiny impedance is why a metal reflects almost everything: $r \\approx (\\eta_c - \\eta_0)/(\\eta_c + \\eta_0) \\approx -1$.',
      trap: 'Only a perfect conductor has exactly zero impedance.' },
    { id: 'emm-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma',
      q: 'A 3.0 GHz signal travels through a plasma whose plasma frequency is 1.8 GHz. Its group velocity is ______ $\\times c$ (to two decimal places).',
      answer: 0.80, tol: 0.005, calc: () => Math.sqrt(1 - 0.36),
      sol: '$v_g = c\\sqrt{1 - f_p^2/f^2} = c\\sqrt{1 - 0.36} = 0.80c$. The phase velocity is $c/0.8 = 1.25c$; their product is $c^2$.',
      trap: 'Using $1 - f_p/f$ without squaring.' },
    { id: 'emm-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'loss tangent',
      q: 'A linear, isotropic, non-magnetic medium has complex permittivity $\\epsilon = \\epsilon\' + i\\epsilon\'\'$ (time dependence $e^{-i\\omega t}$). Which statements are true?',
      options: ['$\\epsilon\'\'$ describes absorption', 'For $\\epsilon\'\' \\ll \\epsilon\'$ the attenuation constant is $\\alpha \\approx \\dfrac{\\omega\\epsilon\'\'}{2}\\sqrt{\\mu/\\epsilon\'}$', 'A conductivity $\\sigma$ acts like $\\epsilon\'\' = \\sigma/\\omega$', 'In a passive medium $\\epsilon\'\'$ can be negative'], answer: [0, 1, 2],
      sol: '$k = \\omega\\sqrt{\\mu(\\epsilon\' + i\\epsilon\'\')} \\approx \\omega\\sqrt{\\mu\\epsilon\'}\\left(1 + \\frac{i\\epsilon\'\'}{2\\epsilon\'}\\right)$, so $\\alpha = \\text{Im}\\,k = \\frac{\\omega\\epsilon\'\'}{2}\\sqrt{\\mu/\\epsilon\'}$. Ampère-Maxwell with $\\vec J = \\sigma\\vec E$ gives $-i\\omega(\\epsilon + i\\sigma/\\omega)\\vec E$, so $\\sigma/\\omega$ adds to $\\epsilon\'\'$. Negative $\\epsilon\'\'$ would mean gain, which needs an energy source (a laser medium), not a passive one.',
      trap: 'With the $e^{+j\\omega t}$ convention of engineers the sign flips: $\\epsilon = \\epsilon\' - j\\epsilon\'\'$.' },
    { id: 'emm-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'charge relaxation',
      q: 'For copper ($\\sigma = 5.8\\times10^7$ S/m, $\\epsilon \\approx \\epsilon_0$) the free-charge relaxation time $\\epsilon/\\sigma$ is about',
      options: ['$1.5\\times10^{-12}$ s', '$1.5\\times10^{-19}$ s', '$1.5\\times10^{-6}$ s', '$1.5\\times10^{-3}$ s'], answer: 1,
      sol: '$\\tau = 8.854\\times10^{-12}/5.8\\times10^7 = 1.5\\times10^{-19}$ s. This is far shorter than any optical period, so $\\rho_f = 0$ inside a metal is safe in wave problems. (The Drude collision time, about $10^{-14}$ s, is longer still; the simple estimate is a formal one.)',
      trap: 'Multiplying instead of dividing by $\\sigma$.' },
    { id: 'emm-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dispersion',
      q: 'A glass has $n = 1.52$ and $dn/d\\lambda = -0.050\\ \\mu$m$^{-1}$ at $\\lambda = 500$ nm. The group velocity of a pulse at this wavelength is ______ $\\times10^8$ m/s (to two decimal places).',
      answer: 1.94, tol: 0.01, unit: '×10⁸ m/s', calc: () => C.c / (1.52 + 0.5 * 0.05) / 1e8,
      sol: 'Group index $n_g = n - \\lambda\\dfrac{dn}{d\\lambda} = 1.52 - 0.5\\times(-0.050) = 1.545$. So $v_g = c/n_g = 2.998\\times10^8/1.545 = 1.94\\times10^8$ m/s, slower than the phase velocity $1.97\\times10^8$ m/s.',
      trap: 'Sign: with $dn/d\\lambda < 0$, $n_g > n$.' },
    { id: 'emm-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'poor conductors',
      q: 'In a low-loss medium ($\\sigma \\ll \\omega\\epsilon$, constant $\\sigma$ and $\\epsilon$), which quantities are (to first order) independent of frequency?',
      options: ['The attenuation constant $\\alpha$', 'The phase velocity', 'The wavelength', 'The loss tangent'], answer: [0, 1],
      sol: '$\\alpha \\approx \\frac{\\sigma}{2}\\sqrt{\\mu/\\epsilon}$ has no $\\omega$, and $v_p \\approx 1/\\sqrt{\\mu\\epsilon}$ also has none. The wavelength $v_p/f$ falls as $1/f$ and the loss tangent $\\sigma/(\\omega\\epsilon)$ falls as $1/\\omega$.',
      trap: 'In a good conductor $\\alpha$ grows as $\\sqrt\\omega$; in a poor one it is flat.' },
    { id: 'emm-045', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conductors',
      q: 'In a homogeneous ohmic medium ($\\epsilon$, $\\mu$, $\\sigma$) with time dependence $e^{-i\\omega t}$, the complex wavenumber of a plane wave satisfies',
      options: ['$\\tilde k^2 = \\mu\\epsilon\\omega^2 - \\mu\\sigma\\omega$', '$\\tilde k = \\omega\\sqrt{\\mu\\epsilon} + i\\sigma$', '$\\tilde k^2 = \\mu\\epsilon\\omega^2 + i\\mu\\sigma\\omega$', '$\\tilde k^2 = \\mu\\sigma\\omega$ for every material'], answer: 2,
      sol: 'The wave equation in a conductor is $\\nabla^2\\vec E = \\mu\\epsilon\\ddot{\\vec E} + \\mu\\sigma\\dot{\\vec E}$. With $e^{i(\\tilde kz - \\omega t)}$: $-\\tilde k^2 = -\\mu\\epsilon\\omega^2 - i\\mu\\sigma\\omega$, so $\\tilde k^2 = \\mu\\epsilon\\omega^2 + i\\mu\\sigma\\omega$. The last option is only the good-conductor limit (and even then has an $i$).',
      trap: 'Dropping the $i$ turns damping into a shift of the wavenumber.' },

    // ---------- level 4 ----------
    { id: 'emm-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'plasma',
      q: 'An ionospheric layer has peak electron density $2.5\\times10^{12}$ m$^{-3}$. Treating it as flat (secant law), the highest frequency it can reflect back to the ground for a ray striking it at $70^\\circ$ from the vertical is ______ MHz (to the nearest whole number).',
      answer: 42, tol: 1, unit: 'MHz', calc: () => fpOf(2.5e12) / Math.cos((70 * Math.PI) / 180) / 1e6,
      sol: '$f_p = 8.98\\sqrt{2.5\\times10^{12}} = 14.2$ MHz. In a flat layer Snell gives $\\sin\\theta = n\\sin\\theta_z$; the ray turns back where $n = \\sin\\theta$, i.e. $1 - f_p^2/f^2 = \\sin^2\\theta$, so $f = f_p/\\cos\\theta = 14.2/0.342 = 41.5$ MHz, about 42 MHz.',
      trap: 'At oblique incidence the layer reflects frequencies well above $f_p$.' },
    { id: 'emm-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Kramers-Kronig',
      q: 'A transparent material absorbs strongly only in a narrow ultraviolet band. In the visible, well below that band, its refractive index is',
      options: ['greater than 1 and rising with frequency', 'less than 1 and rising with frequency', 'exactly 1', 'greater than 1 and falling with frequency'], answer: 0,
      sol: 'For a single Lorentz resonance $n^2 - 1 \\propto \\dfrac{1}{\\omega_0^2 - \\omega^2}$ below $\\omega_0$: positive, and growing as $\\omega$ approaches $\\omega_0$. This is normal dispersion (blue light bends more than red), the visible tail of the ultraviolet absorption. Kramers-Kronig says the same in general: an absorption band raises $n$ below it.',
      trap: 'Falling $n$ with frequency happens only inside the band.' },
    { id: 'emm-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'Sodium has $2.65\\times10^{28}$ conduction electrons per m$^3$. Treating them as a free-electron gas (mass $m_e$), the vacuum wavelength below which sodium becomes transparent is ______ nm (to the nearest whole number).',
      answer: 205, tol: 2, unit: 'nm', calc: () => C.c / fpOf(2.65e28) * 1e9,
      sol: '$\\omega_p = \\sqrt{\\dfrac{2.65\\times10^{28}\\times(1.602\\times10^{-19})^2}{9.109\\times10^{-31}\\times8.854\\times10^{-12}}} = 9.18\\times10^{15}$ rad/s. Then $\\lambda_p = 2\\pi c/\\omega_p = 205$ nm. Shorter wavelengths have $\\omega > \\omega_p$ and pass through (measured: about 210 nm).',
      trap: 'Using $c/\\omega_p$ without the $2\\pi$ gives 33 nm.' },
    { id: 'emm-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'surface resistance',
      q: 'A wave with tangential surface field $H_0$ (amplitude) falls on a good conductor of skin depth $\\delta$ and surface resistance $R_s$. Which statements are true?',
      options: ['The time-averaged power absorbed per unit area is $\\tfrac12R_sH_0^2$', 'Inside, the magnetic energy density far exceeds the electric', 'The fields inside decay as $e^{-2z/\\delta}$', 'At fixed $\\sigma$, $R_s$ grows as $\\sqrt f$'], answer: [0, 1, 3],
      sol: 'The surface current $K = H_0$ flows in a layer of resistance $R_s$ per square, so $\\langle P\\rangle = \\frac12R_sH_0^2$. $u_B/u_E = \\sigma/(\\omega\\epsilon) \\gg 1$. $R_s = \\sqrt{\\mu\\omega/2\\sigma} \\propto \\sqrt f$. The fields decay as $e^{-z/\\delta}$; it is the power that decays as $e^{-2z/\\delta}$.',
      trap: 'Field versus power decay: a factor 2 in the exponent.' },
    { id: 'emm-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'Submarines receive very-low-frequency radio. Sea water has $\\sigma = 4.0$ S/m, $\\epsilon_r = 81$, $\\mu = \\mu_0$. At 10 kHz, the skin depth is ______ m (to two decimal places).',
      answer: 2.52, tol: 0.03, unit: 'm', calc: () => deltaOf(4, 1e4),
      sol: 'Check: $\\omega\\epsilon = 6.28\\times10^4\\times81\\times8.854\\times10^{-12} = 4.5\\times10^{-5}$ S/m $\\ll 4$, a good conductor. $\\delta = \\sqrt{\\dfrac{2}{\\mu_0\\sigma\\omega}} = \\sqrt{\\dfrac{2}{1.2566\\times10^{-6}\\times4\\times6.283\\times10^4}} = 2.52$ m. A receiver 20 m down sees the field reduced by $e^{-8}$.',
      trap: '$\\epsilon_r = 81$ does not enter the good-conductor formula.' },
    { id: 'emm-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'For waves inside a good conductor of fixed $\\sigma$ and $\\mu$, the group velocity is',
      options: ['equal to the phase velocity', 'half the phase velocity', 'twice the phase velocity', 'equal to $c$'], answer: 2,
      sol: '$k = 1/\\delta = \\sqrt{\\mu\\sigma\\omega/2}$, so $\\omega = 2k^2/(\\mu\\sigma)$ and $v_g = d\\omega/dk = 4k/(\\mu\\sigma) = 2\\omega/k = 2v_p$. Both are tiny: in copper at 1 GHz, $v_p = \\omega\\delta \\approx 4\\times10^3$ m/s.',
      trap: 'Dispersion with $\\omega \\propto k^2$ (like a free quantum particle) always gives $v_g = 2v_p$.' },
    { id: 'emm-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'plasma',
      q: 'A 100 MHz signal crosses a 200 km thick uniform plasma slab with plasma frequency 10 MHz. Compared with travel through vacuum, the extra group delay is ______ $\\mu$s (to two decimal places).',
      answer: 3.36, tol: 0.03, unit: 'μs', calc: () => (2e5 / C.c) * (1 / Math.sqrt(1 - 0.01) - 1) * 1e6,
      sol: 'Group delay through the slab: $L/v_g = \\dfrac{L}{c\\sqrt{1 - f_p^2/f^2}}$. With $f_p^2/f^2 = 0.01$: $\\dfrac{L}{c}\\left(\\frac{1}{\\sqrt{0.99}} - 1\\right) = 667.1\\ \\mu\\text{s}\\times0.00504 = 3.36\\ \\mu$s. This is the ionospheric error that dual-frequency GPS removes.',
      trap: 'The phase arrives early (phase velocity above $c$) while the signal arrives late.' },
    { id: 'emm-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'In the Drude model $\\sigma(\\omega) = \\dfrac{\\sigma_0}{1 - i\\omega\\tau}$. For $\\omega\\tau \\gg 1$,',
      options: ['$\\sigma$ is real and equal to $\\sigma_0$', '$\\sigma$ is mainly imaginary: the electrons respond like a free plasma with $\\omega_p^2 = \\sigma_0/(\\epsilon_0\\tau)$', '$\\sigma$ vanishes, so the metal is an insulator at every frequency', '$\\sigma$ grows linearly with $\\omega$'], answer: 1,
      sol: 'For $\\omega\\tau \\gg 1$, $\\sigma \\approx \\dfrac{i\\sigma_0}{\\omega\\tau}$: current $90^\\circ$ out of phase with $E$, no dissipation, exactly the free-electron plasma. Then $\\epsilon/\\epsilon_0 = 1 + \\dfrac{i\\sigma}{\\epsilon_0\\omega} = 1 - \\dfrac{\\sigma_0}{\\epsilon_0\\tau\\omega^2}$; with $\\sigma_0 = ne^2\\tau/m$, $\\sigma_0/(\\epsilon_0\\tau) = ne^2/(m\\epsilon_0) = \\omega_p^2$.',
      trap: 'An imaginary conductivity is not zero: it is reactive (inductive) current.' },
    { id: 'emm-043', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Kramers-Kronig',
      q: 'Which statements about the Kramers-Kronig relations for $\\epsilon(\\omega)$ are true?',
      options: ['They follow from causality: the polarisation cannot respond before the field is applied', 'A material that absorbs at no frequency at all would have $\\epsilon = \\epsilon_0$ at every frequency', 'An absorption band raises the refractive index at frequencies below it', 'They apply only to lossless media'], answer: [0, 1, 2],
      sol: 'Causality makes $\\epsilon(\\omega) - \\epsilon_0$ analytic in the upper half-plane, and the real and imaginary parts become Hilbert transforms of each other. If $\\epsilon\'\' = 0$ everywhere, $\\epsilon\' - \\epsilon_0 = 0$ too. Below a band, $\\frac{2}{\\pi}\\int\\frac{\\omega\'\\epsilon\'\'(\\omega\')}{\\omega\'^2 - \\omega^2}d\\omega\' > 0$. The relations are about loss, so they certainly apply to lossy media.',
      trap: 'Every real dielectric with $n > 1$ must absorb somewhere.' },

    // ---------- level 5 ----------
    { id: 'emm-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'plasma',
      q: 'An ionospheric layer starts 100 km above the ground; above its base the electron density grows linearly with height, so that $f_p$ reaches 10 MHz at 300 km above the base. A 6.0 MHz pulse is sent vertically up. Its <em>virtual height</em> (half the echo delay times $c$) is ______ km (nearest km).',
      answer: 316, tol: 1, unit: 'km', calc: () => { const zr = 300 * 0.36; return 100 + 2 * zr; },
      sol: 'Since $f_p^2 \\propto n \\propto z$ above the base: $f_p^2(z) = (10\\text{ MHz})^2z/300$ km. The pulse turns back where $f_p = f$: $z_r = 300\\times0.36 = 108$ km. Inside, $v_g = c\\sqrt{1 - f_p^2/f^2} = c\\sqrt{1 - z/z_r}$, so the one-way time in the layer is $\\int_0^{z_r}\\frac{dz}{c\\sqrt{1 - z/z_r}} = \\frac{2z_r}{c}$. Virtual height $= 100 + 2\\times108 = 316$ km, while the real turning point is at 208 km.',
      trap: 'The pulse slows down near the turning point, so the virtual height exceeds the real one.' },
    { id: 'emm-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Lorentz model',
      q: 'For a single narrow Lorentz resonance at $\\omega_0$ with damping $\\gamma \\ll \\omega_0$, where do $n - 1$ reach its maximum and its minimum?',
      options: ['At $\\omega_0$ and $2\\omega_0$', 'At $\\omega_0 - \\gamma$ and $\\omega_0 + \\gamma$', 'At $\\omega_0/2$ and $2\\omega_0$', 'Maximum at $\\omega_0 - \\gamma/2$, minimum at $\\omega_0 + \\gamma/2$'], answer: 3,
      sol: 'Near $\\omega_0$: $\\omega_0^2 - \\omega^2 - i\\gamma\\omega \\approx 2\\omega_0(\\Delta - i\\gamma/2)$ with $\\Delta = \\omega_0 - \\omega$. So $\\text{Re}\\,\\chi \\propto \\dfrac{\\Delta}{\\Delta^2 + \\gamma^2/4}$, which has its maximum at $\\Delta = \\gamma/2$ ($\\omega = \\omega_0 - \\gamma/2$) and minimum at $\\Delta = -\\gamma/2$. These are the half-power points of the absorption peak.',
      trap: 'The full width at half maximum of the absorption is $\\gamma$, so the extremes of $n$ sit at $\\pm\\gamma/2$, not $\\pm\\gamma$.' },
    { id: 'emm-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'dispersion',
      q: 'Which statements about wave speeds in dispersive media are true?',
      options: ['In a cold plasma the phase velocity exceeds $c$', 'Inside an absorption line the group velocity can exceed $c$ or become negative', 'This lets information travel faster than light', 'The front of a sharply switched-on signal never travels faster than $c$'], answer: [0, 1, 3],
      sol: 'Plasma: $v_p = c/n > c$. In anomalous dispersion $n + \\omega\\,dn/d\\omega$ can be below 1 or negative, so $v_g > c$ or $v_g < 0$; but there the pulse is strongly absorbed and reshaped, and the group velocity no longer describes energy flow. The signal front travels at the high-frequency limit, where $n \\to 1$: Sommerfeld and Brillouin showed it never beats $c$.',
      trap: '"Group velocity" means the speed of the peak only when the medium barely distorts the pulse.' },
    { id: 'emm-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'good conductors',
      q: 'Light of very low frequency compared with $\\sigma/\\epsilon_0$ falls normally on a good conductor. Show that the absorbed fraction is $1 - R \\approx 4R_s/\\eta_0$ and evaluate it for copper ($\\sigma = 5.8\\times10^7$ S/m) at 10 GHz, in units of $10^{-4}$ (to two decimal places).',
      answer: 2.77, tol: 0.03, calc: () => (4 * Math.sqrt((C.mu0 * 2 * Math.PI * 1e10) / (2 * 5.8e7))) / ETA0 * 1e4,
      sol: '$r = \\dfrac{\\eta_c - \\eta_0}{\\eta_c + \\eta_0}$ with $\\eta_c = R_s(1 - i)$ (for $e^{-i\\omega t}$) and $R_s \\ll \\eta_0$. To first order $|r|^2 \\approx 1 - 4\\,\\text{Re}(\\eta_c)/\\eta_0 = 1 - 4R_s/\\eta_0$. With $R_s = 0.0261\\ \\Omega$: $1 - R = 4\\times0.0261/376.7 = 2.77\\times10^{-4}$. This is the Hagen-Rubens result $1 - R = 2\\sqrt{2\\omega\\epsilon_0/\\sigma}$.',
      trap: 'Only the real (resistive) part of the surface impedance absorbs.' },
    ...more2,
  ],

  gens: [
    { id: 'emm-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      make(r) {
        const [name, sigma] = choose(r, METALS), f = choose(r, [1e3, 1e4, 6e4, 1e5, 1e6, 1e7, 1e8, 1e9]);
        const d = deltaOf(sigma, f) * 1e6, answer = round(d, d < 10 ? 2 : 1);
        return { q: `Find the skin depth of ${name} ($\\sigma = ${fmt(sigma, 2)}$ S/m, $\\mu = \\mu_0$) at $f = ${fmt(f, 2)}$ Hz, in $\\mu$m.`,
          answer, tol: Math.max(0.01, d * 0.01), unit: 'μm', sigma, f,
          sol: `$\\delta = \\sqrt{\\dfrac{2}{\\mu_0\\sigma\\omega}} = \\sqrt{\\dfrac{2}{1.2566\\times10^{-6}\\times${fmt(sigma, 2)}\\times2\\pi\\times${fmt(f, 2)}}} \\approx ${fmt(d, 3)}\\ \\mu$m.`,
          trap: 'Use $\\omega = 2\\pi f$, and convert metres to micrometres at the end.' };
      },
      verify: (p) => 503.29 * Math.sqrt(1 / (p.sigma * p.f)) * 1e6 },
    { id: 'emm-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'plasma',
      make(r) {
        const m = int(r, 1, 9), e = int(r, 10, 18), n = m * 10 ** e;
        const fp = fpOf(n), unitMHz = fp < 1e9, val = unitMHz ? fp / 1e6 : fp / 1e9, answer = round(val, 3);
        return { q: `Find the plasma frequency $f_p = \\omega_p/2\\pi$ of an electron plasma with density $${m}\\times10^{${e}}$ m$^{-3}$, in ${unitMHz ? 'MHz' : 'GHz'}.`,
          answer, tol: Math.max(0.001, val * 0.01), unit: unitMHz ? 'MHz' : 'GHz', n, unitMHz,
          sol: `$f_p = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{ne^2}{m_e\\epsilon_0}} = 8.98\\sqrt{n}$ Hz $= 8.98\\times\\sqrt{${fmt(n, 2)}} = ${fmt(fp, 3)}$ Hz $\\approx ${fmt(val, 3)}$ ${unitMHz ? 'MHz' : 'GHz'}.`,
          trap: 'Do not stop at $\\omega_p$: divide by $2\\pi$ for $f_p$.' };
      },
      verify: (p) => (8.97866 * Math.sqrt(p.n)) / (p.unitMHz ? 1e6 : 1e9) },
    { id: 'emm-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma',
      make(r) {
        const fp = int(r, 2, 9), f = fp + int(r, 1, 12), which = choose(r, ['phase', 'group']);
        const s = Math.sqrt(1 - (fp * fp) / (f * f)), val = which === 'phase' ? 1 / s : s, answer = round(val, 3);
        return { q: `A ${f} MHz wave travels through a cold plasma with $f_p = ${fp}$ MHz. Find its ${which} velocity as a multiple of $c$.`,
          answer, tol: 0.002, fp, f, which,
          sol: `$n = \\sqrt{1 - f_p^2/f^2} = \\sqrt{1 - ${fp * fp}/${f * f}} = ${s.toFixed(4)}$. Phase velocity $c/n$, group velocity $cn$ (their product is $c^2$). So the ${which} velocity is $${answer}c$.`,
          trap: 'The phase velocity in a plasma is above $c$; the group velocity is below.' };
      },
      verify: (p) => { const k = Math.sqrt(p.f ** 2 - p.fp ** 2); return p.which === 'phase' ? p.f / k : k / p.f; } },
    { id: 'emm-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma',
      make(r) {
        const fp = int(r, 5, 30), f = int(r, 1, fp - 2);
        const kap = (2 * Math.PI * Math.sqrt(fp * fp - f * f) * 1e6) / C.c, d = 100 / kap, answer = round(d, 2);
        return { q: `A ${f} MHz wave falls on a plasma with $f_p = ${fp}$ MHz. Over what distance does its field amplitude fall to $1/e$ inside the plasma? (in cm)`,
          answer, tol: Math.max(0.01, d * 0.01), unit: 'cm', f, fp,
          sol: `Below cutoff $k = i\\kappa$ with $\\kappa = \\dfrac{2\\pi}{c}\\sqrt{f_p^2 - f^2} = \\dfrac{2\\pi\\times\\sqrt{${fp * fp - f * f}}\\times10^6}{3.0\\times10^8} = ${kap.toFixed(4)}$ m$^{-1}$, so the $1/e$ length is $1/\\kappa \\approx ${answer}$ cm.`,
          trap: 'It is $\\sqrt{f_p^2 - f^2}$, not $f_p - f$.' };
      },
      verify: (p) => (100 * C.c) / (2 * Math.PI * 1e6 * Math.sqrt((p.fp - p.f) * (p.fp + p.f))) },
    { id: 'emm-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      make(r) {
        const mats = [['sea water', 4, 81], ['wet earth', 0.01, 10], ['dry earth', 1e-4, 4], ['fresh water', 1e-3, 80], ['graphite', 7e4, 1], ['germanium', 2, 16]];
        const [name, sigma, er] = choose(r, mats), cls = int(r, 0, 2);
        const target = [choose(r, [100, 300, 1000, 3000]), choose(r, [0.001, 0.003, 0.01]), choose(r, [0.5, 1, 2])][cls];
        const f = sigma / (2 * Math.PI * er * C.eps0 * target), ratio = sigma / (2 * Math.PI * f * er * C.eps0);
        const labels = ['a good conductor', 'a low-loss dielectric (poor conductor)', 'neither: conduction and displacement currents are comparable'];
        const o = mcqOptions(r, labels[cls], [...labels.filter((_, i) => i !== cls), 'a perfect insulator, since $\\sigma$ is small']);
        return { q: `${name[0].toUpperCase() + name.slice(1)} has $\\sigma = ${fmt(sigma, 2)}$ S/m and $\\epsilon_r = ${er}$. At $f = ${fmt(f, 3)}$ Hz it behaves as`, ...o,
          sol: `Compare conduction and displacement currents: $\\dfrac{\\sigma}{\\omega\\epsilon} = \\dfrac{${fmt(sigma, 2)}}{2\\pi\\times${fmt(f, 3)}\\times${er}\\times8.854\\times10^{-12}} \\approx ${fmt(ratio, 2)}$. ${cls === 0 ? 'Much greater than 1: a good conductor.' : cls === 1 ? 'Much less than 1: a low-loss dielectric.' : 'Of order 1: neither limit applies, so the full complex wavenumber is needed.'}`,
          trap: 'Whether a material is a conductor depends on the frequency, not on $\\sigma$ alone.' };
      } },
    { id: 'emm-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'poor conductors',
      make(r) {
        const er = choose(r, [2, 2.5, 4, 6, 9]), sig = int(r, 1, 9) * 1e-4;
        const eta = ETA0 / Math.sqrt(er), a = (sig / 2) * eta, db = 20 * Math.log10(Math.E) * a, answer = round(db, 3);
        return { q: `A low-loss non-magnetic dielectric has $\\epsilon_r = ${er}$ and $\\sigma = ${fmt(sig, 2)}$ S/m (at a frequency where $\\sigma \\ll \\omega\\epsilon$). Find the attenuation in dB per metre.`,
          answer, tol: Math.max(0.001, db * 0.01), unit: 'dB/m', er, sig,
          sol: `$\\alpha \\approx \\dfrac{\\sigma}{2}\\sqrt{\\dfrac{\\mu_0}{\\epsilon_r\\epsilon_0}} = \\dfrac{${fmt(sig, 2)}}{2}\\times\\dfrac{376.7}{\\sqrt{${er}}} = ${fmt(a, 3)}$ Np/m. In decibels: $8.686\\alpha \\approx ${answer}$ dB/m.`,
          trap: 'One neper of field attenuation is 8.686 dB, not 4.343 dB.' };
      },
      verify: (p) => 8.685889638 * 0.5 * p.sig * 376.730313 / Math.sqrt(p.er) },
    { id: 'emm-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dispersion',
      make(r) {
        const dm = int(r, 5, 300), f1 = choose(r, [150, 300, 400, 600]), f2 = f1 * choose(r, [1.5, 2, 3]);
        const dt = KDM * dm * PC * 1e6 * (1 / (f1 * 1e6) ** 2 - 1 / (f2 * 1e6) ** 2) * 1e3, answer = round(dt, 1);
        return { q: `A pulsar has dispersion measure $${dm}$ pc cm$^{-3}$. By how many milliseconds does its pulse at ${f1} MHz lag the pulse at ${f2} MHz? Use $t = 4.149\\ \\text{ms}\\times\\text{DM}/f_{\\text{GHz}}^2$.`,
          answer, tol: Math.max(0.1, dt * 0.01), unit: 'ms', dm, f1, f2,
          sol: `$\\Delta t = 4.149\\times${dm}\\times\\left(\\dfrac{1}{${f1 / 1000}^2} - \\dfrac{1}{${f2 / 1000}^2}\\right)$ ms $\\approx ${answer}$ ms. Lower frequencies have lower group velocity in the plasma, so they arrive later.`,
          trap: 'The delay goes as $1/f^2$: halving the frequency quadruples it.' };
      },
      verify: (p) => 4.1488 * p.dm * (1e6 / p.f1 ** 2 - 1e6 / p.f2 ** 2) },
    { id: 'emm-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dispersion',
      make(r) {
        const n = choose(r, [1.45, 1.5, 1.52, 1.6, 1.7]), lam = choose(r, [0.4, 0.5, 0.6, 0.8, 1.0]), d = -int(r, 1, 12) / 100;
        const ng = n - lam * d, answer = round(ng, 4), ask = choose(r, ['index', 'speed']);
        const val = ask === 'index' ? ng : C.c / ng / 1e8;
        return { q: `A glass has $n = ${n}$ and $dn/d\\lambda = ${d}\\ \\mu$m$^{-1}$ at $\\lambda = ${lam}\\ \\mu$m. Find ${ask === 'index' ? 'the group index $n_g$' : 'the group velocity in units of $10^8$ m/s'}.`,
          answer: round(val, 4), tol: 0.002, n, lam, d, ask, unit: ask === 'index' ? '' : '×10⁸ m/s',
          sol: `$n_g = n - \\lambda\\dfrac{dn}{d\\lambda} = ${n} - ${lam}\\times(${d}) = ${answer}$.${ask === 'speed' ? ` Then $v_g = c/n_g = ${round(val, 4)}\\times10^8$ m/s.` : ''}`,
          trap: 'With normal dispersion ($dn/d\\lambda < 0$) the group index is larger than $n$.' };
      },
      verify: (p) => { const ng = p.n - p.lam * p.d; return p.ask === 'index' ? ng : C.c / ng / 1e8; } },
    { id: 'emm-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'surface resistance',
      make(r) {
        const [name, sigma] = choose(r, METALS.slice(0, 5)), fG = choose(r, [1, 2, 3, 5, 10, 24]), H = int(r, 2, 40);
        const Rs = Math.sqrt((Math.PI * fG * 1e9 * C.mu0) / sigma), P = 0.5 * Rs * H * H, answer = round(P, 3);
        return { q: `The tangential magnetic field at the wall of a ${name} cavity ($\\sigma = ${fmt(sigma, 2)}$ S/m) has amplitude ${H} A/m at ${fG} GHz. Find the time-averaged power lost per square metre of wall, in W/m$^2$.`,
          answer, tol: Math.max(0.001, P * 0.01), unit: 'W/m²', sigma, fG, H,
          sol: `$R_s = \\sqrt{\\pi f\\mu_0/\\sigma} = ${fmt(Rs, 3)}\\ \\Omega$. The surface current density equals $H_0$, so $\\langle P\\rangle/A = \\tfrac12R_sH_0^2 = \\tfrac12\\times${fmt(Rs, 3)}\\times${H}^2 \\approx ${answer}$ W/m$^2$.`,
          trap: 'The factor $\\tfrac12$ comes from time-averaging a sinusoid of amplitude $H_0$.' };
      },
      verify: (p) => 0.5 * p.H * p.H / (p.sigma * deltaOf(p.sigma, p.fG * 1e9)) },
    { id: 'emm-g10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'good conductors',
      make(r) {
        const [name, sigma] = choose(r, METALS), f = choose(r, [1e6, 1e8, 1e9, 1e10]);
        const ratio = sigma / (2 * Math.PI * f * C.eps0), show = (v) => `$${fmt(v, 2)}$`;
        const o = mcqOptions(r, ratio, [Math.sqrt(ratio), 1, ratio / (2 * Math.PI), 1 / ratio], show);
        return { q: `For a plane wave in ${name} ($\\sigma = ${fmt(sigma, 2)}$ S/m, $\\epsilon \\approx \\epsilon_0$) at $${fmt(f, 2)}$ Hz, the ratio of time-averaged magnetic to electric energy density is about`, ...o,
          sol: `$u_B/u_E = |\\tilde k|^2/(\\mu\\epsilon\\omega^2) = \\sigma/(\\epsilon\\omega) = ${fmt(sigma, 2)}/(2\\pi\\times${fmt(f, 2)}\\times8.854\\times10^{-12}) \\approx ${fmt(ratio, 2)}$.`,
          trap: 'The amplitude ratio $cB_0/E_0$ is the square root of this; energies go as squares.' };
      } },
    { id: 'emm-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'plasma',
      make(r) {
        const m = int(r, 1, 9), n = m * 1e11 * choose(r, [1, 10]), th = choose(r, [30, 45, 60, 70, 75, 80]);
        const fp = fpOf(n), muf = fp / Math.cos((th * Math.PI) / 180) / 1e6, answer = round(muf, 2);
        return { q: `An ionospheric layer (treat it as flat) has peak electron density $${fmt(n, 2)}$ m$^{-3}$. Find the highest frequency it reflects for a ray meeting it at $${th}^\\circ$ from the vertical, in MHz.`,
          answer, tol: Math.max(0.01, muf * 0.01), unit: 'MHz', n, th,
          sol: `$f_p = 8.98\\sqrt{n} = ${fmt(fp / 1e6, 4)}$ MHz. The ray turns back where $n_{\\text{ref}} = \\sin\\theta$, i.e. $1 - f_p^2/f^2 = \\sin^2\\theta$, so $f_{\\max} = f_p\\sec\\theta = ${fmt(fp / 1e6, 4)}/\\cos${th}^\\circ \\approx ${answer}$ MHz.`,
          trap: 'Vertical incidence reflects only up to $f_p$; slanting rays reflect higher frequencies.' };
      },
      verify: (p) => 8.97866 * Math.sqrt(p.n) / Math.cos((p.th * Math.PI) / 180) / 1e6 },
    { id: 'emm-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'good conductors',
      make(r) {
        const k = choose(r, [2, 4, 9, 16, 25, 100]), what = choose(r, ['skin depth', 'surface resistance', 'phase velocity']);
        const s = Math.sqrt(k), val = what === 'skin depth' ? 1 / s : s;
        const show = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v < 1 && Math.abs(1 / v - Math.round(1 / v)) < 1e-9 ? `1/${Math.round(1 / v)}` : `${v.toFixed(3)}`);
        const o = mcqOptions(r, val, [k, 1 / k, what === 'skin depth' ? s : 1 / s, 1], (v) => `multiplied by ${show(v)}`);
        return { q: `The frequency of a wave on a good conductor is multiplied by ${k}. Its ${what} is`, ...o,
          sol: `$\\delta = \\sqrt{2/(\\mu\\sigma\\omega)} \\propto \\omega^{-1/2}$, $R_s = 1/(\\sigma\\delta) \\propto \\omega^{1/2}$ and $v_p = \\omega\\delta \\propto \\omega^{1/2}$. So the ${what} is multiplied by ${show(val)}.`,
          trap: 'Skin depth falls with frequency; surface resistance and phase velocity grow.' };
      } },
    ...more,
  ],
};
