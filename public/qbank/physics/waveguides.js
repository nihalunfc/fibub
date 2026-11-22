// Waveguides: rectangular hollow guides (TE and TM modes, cutoff, dominant TE10, guide wavelength, phase and group
// velocity, wave impedance, evanescent modes, power), the bouncing plane-wave picture, circular guides, parallel
// plates and coaxial lines (TEM), transmission-line basics, cavity resonators and step-index optical fibres (GATE/NET).
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt, C } from '../_util.js';
import more from './waveguides.more.gen.js';

const c = C.c;
const ETA0 = Math.sqrt(C.mu0 / C.eps0);
/** Cutoff frequency (Hz) of mode (m, n) in an a x b guide (metres) filled with relative permittivity er. */
const fcut = (m, n, a, b, er = 1) => (c / (2 * Math.sqrt(er))) * Math.sqrt((m / a) ** 2 + (n / b) ** 2);
/** All TE and TM modes of an a x b guide with cutoff below f, sorted. */
const modesBelow = (f, a, b) => {
  const out = [];
  for (let m = 0; m < 30; m++) for (let n = 0; n < 30; n++) {
    if (!m && !n) continue; const fc = fcut(m, n, a, b); if (fc >= f) continue;
    out.push([`TE_{${m}${n}}`, fc]); if (m && n) out.push([`TM_{${m}${n}}`, fc]);
  }
  return out.sort((x, y) => x[1] - y[1]);
};

export default {
  topic: 'waveguides',
  items: [
    // ---------- level 1 ----------
    { id: 'wvg-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'modes',
      q: 'Which kind of wave can a hollow, perfectly conducting rectangular waveguide NOT carry?',
      options: ['TE$_{10}$', 'TM$_{11}$', 'TEM', 'TE$_{20}$'], answer: 2,
      sol: 'A TEM mode would need a transverse field that is both curl-free and divergence-free in the cross-section, i.e. a 2D electrostatic field inside a single closed conductor. That conductor is an equipotential, so the field is zero. TEM needs two separate conductors (coax, parallel plates).',
      trap: 'The coaxial line, not the hollow guide, carries TEM.' },
    { id: 'wvg-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'modes',
      q: 'The dominant mode (lowest cutoff) of a hollow rectangular guide with broad side $a$ and narrow side $b < a$ is',
      options: ['TM$_{11}$', 'TE$_{10}$', 'TE$_{01}$', 'TM$_{10}$'], answer: 1,
      sol: '$f_c = \\frac{c}{2}\\sqrt{(m/a)^2 + (n/b)^2}$ is smallest for $(m, n) = (1, 0)$ when $a > b$: $f_c = c/2a$. TM modes need $m, n \\ge 1$, so TM$_{11}$ is higher and TM$_{10}$ does not exist.',
      trap: 'TE$_{01}$ has cutoff $c/2b$, higher because $b < a$.' },
    { id: 'wvg-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'An air-filled rectangular guide has inner dimensions 2.5 cm by 1.0 cm. The cutoff frequency of its TE$_{10}$ mode is ______ GHz (to two decimal places).',
      answer: 6.00, tol: 0.03, unit: 'GHz', calc: () => fcut(1, 0, 0.025, 0.01) / 1e9,
      sol: '$f_{c,10} = \\dfrac{c}{2a} = \\dfrac{3.0\\times10^8}{2\\times0.025} = 6.00$ GHz. The cutoff wavelength is $2a = 5$ cm: half a wavelength must fit across the broad side.',
      trap: 'Using the narrow side $b$ gives 15 GHz, the TE$_{01}$ cutoff.' },
    { id: 'wvg-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'A mode is driven at a frequency below its cutoff frequency. Along the guide its fields',
      options: ['travel with phase velocity below $c$', 'travel with group velocity above $c$', 'stay constant in amplitude', 'decay exponentially without travelling (an evanescent mode)'], answer: 3,
      sol: '$k_z^2 = k^2 - k_c^2 < 0$ below cutoff, so $k_z = i\\alpha$ and the fields go as $e^{-\\alpha z}$ with no travelling phase. In a lossless guide this is reactive: no power is absorbed, it is reflected back.',
      trap: 'Below cutoff there is no propagation at any speed.' },
    { id: 'wvg-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'modes',
      q: 'Which of these modes does NOT exist in a rectangular waveguide?',
      options: ['TE$_{01}$', 'TE$_{20}$', 'TM$_{10}$', 'TE$_{11}$'], answer: 2,
      sol: 'TM modes have $E_z \\propto \\sin(m\\pi x/a)\\sin(n\\pi y/b)$ (it must vanish on all four walls). With $n = 0$ this is identically zero, and with $E_z = 0$ and $H_z = 0$ there is no field at all. TE modes have $H_z \\propto \\cos(m\\pi x/a)\\cos(n\\pi y/b)$, which allows one index to be zero.',
      trap: 'TE can have one zero index; TM cannot have any.' },
    { id: 'wvg-049', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'The cutoff wavelength of the TE$_{10}$ mode of a rectangular guide of broad side $a$ is',
      options: ['$a$', '$2a$', '$a/2$', '$2b$'], answer: 1,
      sol: '$\\lambda_c = c/f_c = c/(c/2a) = 2a$. The field $E_y \\propto \\sin(\\pi x/a)$ is half a wavelength of the transverse standing wave across the broad side.',
      trap: '$2b$ is the TE$_{01}$ cutoff wavelength.' },

    // ---------- level 2 ----------
    { id: 'wvg-006', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'guide wavelength',
      q: 'A 10 GHz signal travels in the TE$_{10}$ mode of an air-filled guide whose TE$_{10}$ cutoff is 5 GHz. The guide wavelength is ______ cm (to two decimal places; take $c = 3.0\\times10^8$ m/s).',
      answer: 3.46, tol: 0.02, unit: 'cm', calc: () => 3 / Math.sqrt(1 - 0.25),
      sol: '$\\lambda = c/f = 3.0$ cm. $\\lambda_g = \\dfrac{\\lambda}{\\sqrt{1 - (f_c/f)^2}} = \\dfrac{3.0}{\\sqrt{0.75}} = 3.46$ cm, longer than in free space.',
      trap: 'The guide wavelength is longer than $\\lambda$, not shorter.' },
    { id: 'wvg-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'A 9.0 GHz signal travels in the TE$_{10}$ mode of an air-filled guide with $a = 2.5$ cm. Its group velocity is ______ $\\times10^8$ m/s (to two decimal places).',
      answer: 2.24, tol: 0.02, unit: '×10⁸ m/s', calc: () => c * Math.sqrt(1 - (fcut(1, 0, 0.025, 0.01) / 9e9) ** 2) / 1e8,
      sol: '$f_c = c/2a = 6.00$ GHz. $v_g = c\\sqrt{1 - (f_c/f)^2} = 3.0\\times10^8\\times\\sqrt{1 - (6/9)^2} = 3.0\\times10^8\\times0.745 = 2.24\\times10^8$ m/s.',
      trap: 'The phase velocity $c/0.745 = 4.0\\times10^8$ m/s exceeds $c$; the group velocity, which carries energy, does not.' },
    { id: 'wvg-008', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'For a propagating mode in a hollow, air-filled waveguide, which statements are true?',
      options: ['The phase velocity exceeds $c$', 'The group velocity is less than $c$', 'The product of phase and group velocities is $c^2$', 'The phase velocity tends to zero as $f \\to f_c$'], answer: [0, 1, 2],
      sol: '$\\omega^2 = \\omega_c^2 + c^2k_z^2$ (the same form as a plasma), so $v_p = c/\\sqrt{1 - (f_c/f)^2} > c$, $v_g = c\\sqrt{1 - (f_c/f)^2} < c$ and $v_pv_g = c^2$. As $f \\to f_c$, $v_p \\to \\infty$ and $v_g \\to 0$.',
      trap: 'At cutoff it is the group velocity that vanishes; the phase velocity blows up.' },
    { id: 'wvg-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'An air-filled guide is 2.5 cm by 1.0 cm. Only the TE$_{10}$ mode propagates from 6.0 GHz up to the next cutoff. That upper frequency is ______ GHz (to one decimal place).',
      answer: 12.0, tol: 0.06, unit: 'GHz', calc: () => Math.min(fcut(2, 0, 0.025, 0.01), fcut(0, 1, 0.025, 0.01)) / 1e9,
      sol: 'Next candidates: TE$_{20}$ at $c/a = 12.0$ GHz and TE$_{01}$ at $c/2b = 15.0$ GHz. The lower, 12.0 GHz, ends the single-mode band. Choosing $a \\approx 2b$ makes TE$_{20}$ and TE$_{01}$ arrive together and gives the widest single-mode octave.',
      trap: 'Checking only TE$_{01}$ misses TE$_{20}$, which comes first when $a > 2b$.' },
    { id: 'wvg-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'field patterns',
      q: 'For the TE$_{10}$ mode of a rectangular guide ($0 \\le x \\le a$ across the broad side, $0 \\le y \\le b$), the electric field is',
      options: ['along $x$, varying as $\\cos(\\pi x/a)$', 'along $z$, largest at the walls', 'along $y$, varying as $\\sin(\\pi y/b)$', 'along $y$, varying as $\\sin(\\pi x/a)$ and uniform in $y$'], answer: 3,
      sol: 'TE$_{10}$ has $H_z \\propto \\cos(\\pi x/a)$, and from it $E_y \\propto \\sin(\\pi x/a)$, $H_x \\propto \\sin(\\pi x/a)$, with no $y$ dependence. $E_y$ is parallel to the side walls $x = 0, a$ and vanishes there, as a tangential $E$ must; it is largest in the centre.',
      trap: 'The index 1 counts half-waves along $x$; the field points along $y$.' },
    { id: 'wvg-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wave impedance',
      q: 'The wave impedance $E_t/H_t$ of a TE mode in an air-filled guide at frequency $f$ above its cutoff $f_c$ is',
      options: ['$\\eta_0\\sqrt{1 - (f_c/f)^2}$', '$\\eta_0/\\sqrt{1 - (f_c/f)^2}$', '$\\eta_0$', '$\\eta_0f_c/f$'], answer: 1,
      sol: 'For TE modes $Z_{TE} = \\omega\\mu_0/k_z = \\eta_0k/k_z = \\eta_0/\\sqrt{1 - (f_c/f)^2}$, larger than $\\eta_0$. For TM modes $Z_{TM} = k_z/(\\omega\\epsilon_0) = \\eta_0\\sqrt{1 - (f_c/f)^2}$, smaller.',
      trap: 'TE and TM impedances are swapped forms; TE goes to infinity at cutoff.' },
    { id: 'wvg-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'A guide with $a = 2.5$ cm is completely filled with polyethylene ($\\epsilon_r = 2.25$). Its TE$_{10}$ cutoff frequency is ______ GHz (to two decimal places).',
      answer: 4.00, tol: 0.02, unit: 'GHz', calc: () => fcut(1, 0, 0.025, 0.01, 2.25) / 1e9,
      sol: 'In the filling the wave speed is $c/\\sqrt{\\epsilon_r} = c/1.5$, so $f_c = \\dfrac{c}{2a\\sqrt{\\epsilon_r}} = \\dfrac{6.00}{1.5} = 4.00$ GHz. The cutoff wavelength in vacuum terms grows by $\\sqrt{\\epsilon_r}$.',
      trap: 'Dividing by $\\epsilon_r$ rather than its square root.' },
    { id: 'wvg-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'TEM lines',
      q: 'Which structure can carry a wave with zero cutoff frequency?',
      options: ['A hollow rectangular guide', 'A hollow circular guide', 'A coaxial line', 'A hollow guide filled with dielectric'], answer: 2,
      sol: 'A coaxial line has two conductors, so it supports a TEM mode whose transverse field is the 2D electrostatic field between them; TEM has $k_z = \\omega/v$ at every frequency, no cutoff. Hollow guides (filled or not) have one conductor and only TE and TM modes with non-zero cutoffs.',
      trap: 'A dielectric filling lowers the cutoff but never to zero.' },
    { id: 'wvg-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'TEM lines',
      q: 'A coaxial cable has a ratio of outer to inner conductor radii of 3.6 and a polyethylene filling ($\\epsilon_r = 2.25$). Its characteristic impedance is ______ $\\Omega$ (to one decimal place).',
      answer: 51.2, tol: 0.3, unit: 'Ω', calc: () => (ETA0 / (2 * Math.PI * 1.5)) * Math.log(3.6),
      sol: '$L\' = \\frac{\\mu_0}{2\\pi}\\ln\\frac ba$ and $C\' = \\frac{2\\pi\\epsilon}{\\ln(b/a)}$, so $Z_0 = \\sqrt{L\'/C\'} = \\dfrac{\\eta_0}{2\\pi\\sqrt{\\epsilon_r}}\\ln\\dfrac ba = \\dfrac{60}{1.5}\\ln3.6 = 40\\times1.281 = 51.2\\ \\Omega$.',
      trap: 'Use the natural logarithm, not $\\log_{10}$.' },
    { id: 'wvg-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'For a step-index optical fibre with core index $n_1$ and cladding index $n_2 < n_1$, in air, which statements are true?',
      options: ['The numerical aperture is $\\sqrt{n_1^2 - n_2^2}$', 'The largest acceptance half-angle $\\theta_a$ in air satisfies $\\sin\\theta_a = \\text{NA}$', 'A larger core radius allows more guided modes', 'The fibre is single-mode when $V > 2.405$'], answer: [0, 1, 2],
      sol: 'The steepest guided ray meets the core-cladding wall at $\\theta_c$, so it makes $90^\\circ - \\theta_c$ with the axis. Snell at the end face: $\\sin\\theta_a = n_1\\sin(90^\\circ - \\theta_c) = n_1\\cos\\theta_c = \\sqrt{n_1^2 - n_2^2}$. The number of modes grows with $V = \\frac{2\\pi a}{\\lambda}\\text{NA}$. Single-mode operation needs $V < 2.405$ (the first zero of $J_0$).',
      trap: 'Single mode is for small $V$, below 2.405.' },
    { id: 'wvg-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'A step-index fibre has core index 1.48 and cladding index 1.46. Its numerical aperture is ______ (to three decimal places).',
      answer: 0.242, tol: 0.002, calc: () => Math.sqrt(1.48 ** 2 - 1.46 ** 2),
      sol: '$\\text{NA} = \\sqrt{n_1^2 - n_2^2} = \\sqrt{2.1904 - 2.1316} = \\sqrt{0.0588} = 0.242$, an acceptance half-angle of $14.0^\\circ$ in air.',
      trap: '$n_1 - n_2 = 0.02$ is not the numerical aperture.' },
    { id: 'wvg-029', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'transmission lines',
      q: 'A 75 $\\Omega$ antenna is connected to a lossless 50 $\\Omega$ line. The voltage standing-wave ratio on the line is',
      options: ['1.2', '1.5', '2.0', '3.0'], answer: 1,
      sol: '$\\Gamma = \\dfrac{Z_L - Z_0}{Z_L + Z_0} = \\dfrac{25}{125} = 0.2$, and $\\text{VSWR} = \\dfrac{1 + |\\Gamma|}{1 - |\\Gamma|} = \\dfrac{1.2}{0.8} = 1.5$. The reflected power fraction is $|\\Gamma|^2 = 4\\%$.',
      trap: '1.2 is $1 + |\\Gamma|$, not the VSWR.' },
    { id: 'wvg-035', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'An air-filled guide is completely filled with a dielectric of $\\epsilon_r = 4$. Every mode\'s cutoff frequency is',
      options: ['doubled', 'unchanged', 'quartered', 'halved'], answer: 3,
      sol: '$f_c = \\dfrac{1}{2\\sqrt{\\mu\\epsilon}}\\sqrt{(m/a)^2 + (n/b)^2} \\propto 1/\\sqrt{\\epsilon_r}$, so it is halved. That is how dielectric-loaded guides are made smaller for the same band.',
      trap: 'The cutoff goes as $1/\\sqrt{\\epsilon_r}$, not $1/\\epsilon_r$.' },
    { id: 'wvg-046', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'guide wavelength',
      q: 'As the operating frequency rises far above a mode\'s cutoff, its guide wavelength $\\lambda_g$',
      options: ['grows without limit', 'tends to $2a$', 'approaches the free-space wavelength', 'tends to zero faster than $\\lambda$'], answer: 2,
      sol: '$\\lambda_g = \\lambda/\\sqrt{1 - (f_c/f)^2} \\to \\lambda$ as $f/f_c \\to \\infty$: the bouncing plane waves travel almost along the axis, and the guide hardly matters.',
      trap: '$\\lambda_g$ grows without limit near cutoff, not far above it.' },

    // ---------- level 3 ----------
    { id: 'wvg-011', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'modes',
      q: 'How many distinct modes (counting TE and TM separately) can propagate at 20 GHz in an air-filled guide of 2.5 cm by 1.0 cm?',
      answer: 8, tol: 0, calc: () => modesBelow(20e9, 0.025, 0.01).length,
      sol: '$f_c = 6.00\\sqrt{m^2 + 6.25n^2}$ GHz. With $n = 0$: TE$_{10}$, TE$_{20}$, TE$_{30}$ (6, 12, 18 GHz). With $n = 1$: TE$_{01}$ (15.0), TE$_{11}$ and TM$_{11}$ (16.2), TE$_{21}$ and TM$_{21}$ (19.2); $m = 3$ gives 23.4 GHz. $n = 2$ starts at 30 GHz. Total 8.',
      trap: 'For $m, n \\ge 1$ each cutoff carries two modes, TE and TM.' },
    { id: 'wvg-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent modes',
      q: 'A 3.0 GHz signal is fed into a 5.0 cm length of air-filled guide with $a = 2.5$ cm (TE$_{10}$ cutoff 6.0 GHz). By how many decibels is the field attenuated over this length? (to one decimal place)',
      answer: 47.3, tol: 0.3, unit: 'dB', calc: () => { const k = (2 * Math.PI * 3e9) / c, al = Math.sqrt((Math.PI / 0.025) ** 2 - k * k); return 20 * Math.log10(Math.E) * al * 0.05; },
      sol: '$\\alpha = \\sqrt{k_c^2 - k^2}$ with $k_c = \\pi/a = 125.7$ m$^{-1}$ and $k = 2\\pi f/c = 62.9$ m$^{-1}$: $\\alpha = 108.8$ Np/m. Over 5 cm, $\\alpha L = 5.44$ Np, i.e. $8.686\\times5.44 = 47.3$ dB. A short length of below-cutoff guide is a strong, frequency-insensitive attenuator.',
      trap: 'Far below cutoff $\\alpha \\approx \\pi/a$, nearly independent of frequency.' },
    { id: 'wvg-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'plane-wave picture',
      q: 'The TE$_{10}$ mode can be built from two plane waves bouncing between the side walls $x = 0$ and $x = a$. Each makes an angle $\\theta$ with the guide axis given by',
      options: ['$\\sin\\theta = 2a/\\lambda$', '$\\cos\\theta = \\lambda/2a$', '$\\sin\\theta = \\lambda/2a$', '$\\tan\\theta = a/\\lambda$'], answer: 2,
      sol: 'The two waves have $k_x = \\pm k\\sin\\theta$ and must form the standing wave $\\sin(\\pi x/a)$, so $k\\sin\\theta = \\pi/a$, i.e. $\\sin\\theta = \\lambda/2a$. At cutoff ($\\lambda = 2a$) $\\theta = 90^\\circ$: the waves bounce straight across and go nowhere. $k_z = k\\cos\\theta$ gives $v_g = c\\cos\\theta$ and $v_p = c/\\cos\\theta$.',
      trap: 'Measured from the axis, $\\theta$ grows towards $90^\\circ$ at cutoff.' },
    { id: 'wvg-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'For the air-filled 2.5 cm by 1.0 cm guide, the cutoff frequency of the lowest TM mode is ______ GHz (to one decimal place).',
      answer: 16.2, tol: 0.08, unit: 'GHz', calc: () => fcut(1, 1, 0.025, 0.01) / 1e9,
      sol: 'The lowest TM mode is TM$_{11}$: $f_c = \\frac c2\\sqrt{(1/0.025)^2 + (1/0.010)^2} = 1.5\\times10^8\\times\\sqrt{1600 + 10000} = 1.5\\times10^8\\times107.7 = 16.2$ GHz.',
      trap: 'TM$_{10}$ and TM$_{01}$ do not exist.' },
    { id: 'wvg-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'wave impedance',
      q: 'For propagating modes in an air-filled hollow guide, which statements about the wave impedances are true?',
      options: ['$Z_{TE} > \\eta_0$', '$Z_{TM} < \\eta_0$', 'Both tend to $\\eta_0$ as $f \\to \\infty$', '$Z_{TM}$ grows without limit as $f \\to f_c$'], answer: [0, 1, 2],
      sol: '$Z_{TE} = \\eta_0/\\sqrt{1 - (f_c/f)^2}$ and $Z_{TM} = \\eta_0\\sqrt{1 - (f_c/f)^2}$. Far above cutoff both tend to $\\eta_0$. At cutoff $Z_{TE} \\to \\infty$ and $Z_{TM} \\to 0$; also $Z_{TE}Z_{TM} = \\eta_0^2$ at the same $f/f_c$.',
      trap: 'It is $Z_{TE}$ that diverges at cutoff.' },
    { id: 'wvg-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'circular guides',
      q: 'An air-filled circular guide has inner radius 1.0 cm. Its dominant TE$_{11}$ mode, with $p\'_{11} = 1.841$ (first zero of $J_1\'$), has cutoff frequency ______ GHz (to two decimal places).',
      answer: 8.78, tol: 0.04, unit: 'GHz', calc: () => (1.841 * c) / (2 * Math.PI * 0.01) / 1e9,
      sol: '$k_c = p\'_{11}/R$, so $f_c = \\dfrac{1.841c}{2\\pi R} = \\dfrac{1.841\\times3.0\\times10^8}{2\\pi\\times0.010} = 8.78$ GHz. Its cutoff wavelength is $3.41R$.',
      trap: 'TE modes use zeros of $J_n\'$; TM modes use zeros of $J_n$.' },
    { id: 'wvg-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'circular guides',
      q: 'In a circular guide, the ratio of the TM$_{01}$ cutoff (first zero of $J_0$: 2.405) to the TE$_{11}$ cutoff (first zero of $J_1\'$: 1.841) is closest to',
      options: ['1.31', '0.77', '1.00', '2.08'], answer: 0,
      sol: 'Cutoff frequencies scale as the Bessel zeros: $2.405/1.841 = 1.306$. So TE$_{11}$ is dominant, and the single-mode band of a circular guide spans only a factor 1.31, narrower than a rectangular guide\'s factor 2.',
      trap: 'Inverting the ratio gives 0.77, which would make TM$_{01}$ dominant.' },
    { id: 'wvg-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cavities',
      q: 'A closed rectangular copper box has inner dimensions $a = 2.5$ cm, $b = 1.0$ cm, $d = 5.0$ cm (air). The resonant frequency of its TE$_{101}$ mode is ______ GHz (to two decimal places).',
      answer: 6.70, tol: 0.03, unit: 'GHz', calc: () => (c / 2) * Math.sqrt(1 / 0.025 ** 2 + 1 / 0.05 ** 2) / 1e9,
      sol: 'Standing waves in all three directions: $f_{mnp} = \\frac c2\\sqrt{(m/a)^2 + (n/b)^2 + (p/d)^2}$. For $(1, 0, 1)$: $1.5\\times10^8\\times\\sqrt{1600 + 400} = 1.5\\times10^8\\times44.7 = 6.70$ GHz. Equivalently, a TE$_{10}$ guide shorted at both ends, $d$ = half a guide wavelength.',
      trap: 'A cavity needs $p \\ge 1$ for TE modes: $p = 0$ would leave no field.' },
    { id: 'wvg-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'field patterns',
      q: 'Across the broad side of a rectangular guide carrying only the TE$_{20}$ mode, the electric field',
      options: ['is uniform', 'is largest at the walls', 'varies as $\\sin(\\pi y/b)$', 'has two half-wave loops of opposite sign, with a null along the centre line'], answer: 3,
      sol: 'TE$_{20}$: $E_y \\propto \\sin(2\\pi x/a)$, positive for $0 < x < a/2$ and negative for $a/2 < x < a$, zero at the walls and at $x = a/2$. A thin metal sheet placed at $x = a/2$ parallel to $E$ would not disturb it.',
      trap: 'The first index counts half-wave variations along the broad side.' },
    { id: 'wvg-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'A step-index fibre has core radius 4.0 $\\mu$m and NA 0.12. At 1.31 $\\mu$m its normalised frequency $V = \\frac{2\\pi a}{\\lambda}\\text{NA}$ is ______ (to two decimal places).',
      answer: 2.30, tol: 0.02, calc: () => (2 * Math.PI * 4 * 0.12) / 1.31,
      sol: '$V = \\dfrac{2\\pi\\times4.0\\times0.12}{1.31} = 2.30$. Since $V < 2.405$, only the fundamental LP$_{01}$ mode is guided: the fibre is single-mode at this wavelength.',
      trap: 'Use the core radius, not the diameter.' },
    { id: 'wvg-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'In a 1.0 km step-index multimode fibre ($n_1 = 1.50$, $n_2 = 1.48$), ray optics gives the spread in arrival times between the axial ray and the ray at the critical angle. It is ______ ns (to one decimal place).',
      answer: 67.6, tol: 0.5, unit: 'ns', calc: () => ((1000 * 1.5) / c) * (1.5 / 1.48 - 1) * 1e9,
      sol: 'Axial ray: $t_1 = Ln_1/c$. The steepest guided ray travels a path longer by $1/\\sin\\theta_c = n_1/n_2$: $t_2 = Ln_1^2/(cn_2)$. So $\\Delta t = \\dfrac{Ln_1}{c}\\left(\\dfrac{n_1}{n_2} - 1\\right) = 5.00\\ \\mu\\text{s}\\times0.0135 = 67.6$ ns. Pulses closer than this blur together, limiting the bit rate to roughly 10 Mbit/s over a kilometre.',
      trap: 'Single-mode fibres avoid this intermodal spread entirely.' },
    { id: 'wvg-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'A short pulse containing frequencies between 7 and 11 GHz is sent down a guide whose TE$_{10}$ cutoff is 6 GHz. At the far end,',
      options: ['all frequencies arrive together', 'the higher frequencies arrive first', 'the lower frequencies arrive first', 'only the 6 GHz component arrives'], answer: 1,
      sol: '$v_g = c\\sqrt{1 - (f_c/f)^2}$ increases with $f$, so the high-frequency part of the pulse arrives first and the pulse spreads (waveguide dispersion), most strongly for components near cutoff.',
      trap: 'The phase velocity falls with frequency, but energy moves at the group velocity.' },
    { id: 'wvg-034', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cutoff',
      q: 'An engineer wants a 10 GHz signal to run at 1.25 times the TE$_{10}$ cutoff of an air-filled guide. The broad dimension should be ______ cm (to two decimal places).',
      answer: 1.87, tol: 0.01, unit: 'cm', calc: () => (c / (2 * 8e9)) * 100,
      sol: '$f_c = 10/1.25 = 8.0$ GHz, and $a = \\dfrac{c}{2f_c} = \\dfrac{3.0\\times10^8}{1.6\\times10^{10}} = 1.87$ cm. Working at 1.25 to 1.9 times cutoff keeps losses and dispersion low while staying below the next mode.',
      trap: 'Too close to cutoff the group velocity and dispersion become poor.' },
    { id: 'wvg-040', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'transmission lines',
      q: 'A lossless 50 $\\Omega$ line, exactly a quarter wavelength long, is terminated in 100 $\\Omega$. The impedance seen at its input is',
      options: ['$25\\ \\Omega$', '$50\\ \\Omega$', '$100\\ \\Omega$', '$200\\ \\Omega$'], answer: 0,
      sol: '$Z_{\\text{in}} = Z_0\\dfrac{Z_L + iZ_0\\tan\\beta\\ell}{Z_0 + iZ_L\\tan\\beta\\ell}$; with $\\beta\\ell = \\pi/2$, $\\tan \\to \\infty$ and $Z_{\\text{in}} = Z_0^2/Z_L = 2500/100 = 25\\ \\Omega$. The quarter-wave line inverts impedance, the same idea as an antireflection layer.',
      trap: 'A half-wave line would return 100 $\\Omega$ unchanged.' },
    { id: 'wvg-047', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'guide wavelength',
      q: 'A 7.5 GHz signal travels in the TE$_{10}$ mode of an air-filled guide with $a = 2.5$ cm. The guide wavelength is closest to',
      options: ['6.7 cm', '4.0 cm', '2.4 cm', '5.0 cm'], answer: 0,
      sol: '$\\lambda = c/f = 4.0$ cm and $f_c = 6.0$ GHz, so $\\lambda_g = \\dfrac{4.0}{\\sqrt{1 - (6/7.5)^2}} = \\dfrac{4.0}{0.6} = 6.7$ cm.',
      trap: '4.0 cm is the free-space wavelength; 5.0 cm is the cutoff wavelength $2a$.' },
    { id: 'wvg-051', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'modes',
      q: 'Which modes propagate at 14 GHz in an air-filled guide of 2.5 cm by 1.0 cm?',
      options: ['TE$_{10}$', 'TE$_{20}$', 'TE$_{01}$', 'TM$_{11}$'], answer: [0, 1],
      sol: 'Cutoffs: TE$_{10}$ 6.0 GHz, TE$_{20}$ 12.0 GHz, TE$_{01}$ 15.0 GHz, TM$_{11}$ 16.2 GHz. Only modes with $f_c < 14$ GHz propagate: TE$_{10}$ and TE$_{20}$.',
      trap: 'TE$_{01}$ depends on the narrow side and is higher than TE$_{20}$ here.' },

    // ---------- level 4 ----------
    { id: 'wvg-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'power',
      q: 'The TE$_{10}$ mode in a 2.5 cm by 1.0 cm air guide at 9.0 GHz has $E_y = E_0\\sin(\\pi x/a)$, carrying power $P = \\dfrac{E_0^2ab}{4Z_{TE}}$. If air breaks down at $E_0 = 3.0$ MV/m, the largest power the guide can carry is ______ MW (to two decimal places).',
      answer: 1.11, tol: 0.02, unit: 'MW', calc: () => (9e12 * 2.5e-4) / (4 * ETA0 / Math.sqrt(1 - (fcut(1, 0, 0.025, 0.01) / 9e9) ** 2)) / 1e6,
      sol: '$Z_{TE} = \\eta_0/\\sqrt{1 - (6/9)^2} = 376.7/0.7454 = 505\\ \\Omega$. The time-averaged Poynting flux is $\\frac{E_0^2}{2Z_{TE}}\\sin^2(\\pi x/a)$; integrating over the cross-section gives $\\frac{E_0^2}{2Z_{TE}}\\cdot\\frac a2\\cdot b$. So $P = \\dfrac{(3\\times10^6)^2\\times2.5\\times10^{-4}}{4\\times505} = 1.11$ MW.',
      trap: 'The average of $\\sin^2$ across the guide gives the extra factor $\\tfrac12$.' },
    { id: 'wvg-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'A short 9.0 GHz radar pulse runs 10 m along an air-filled guide in the TE$_{10}$ mode with cutoff 6.0 GHz. Its travel time is ______ ns (to one decimal place).',
      answer: 44.7, tol: 0.3, unit: 'ns', calc: () => 10 / (c * Math.sqrt(1 - (fcut(1, 0, 0.025, 0.01) / 9e9) ** 2)) * 1e9,
      sol: 'The pulse moves at $v_g = c\\sqrt{1 - (6/9)^2} = 0.745c = 2.24\\times10^8$ m/s, so $t = 10/2.24\\times10^8 = 44.7$ ns, against 33.4 ns in free space.',
      trap: 'Using $v_p$ gives 25 ns, faster than light travel: impossible for a signal.' },
    { id: 'wvg-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'field patterns',
      q: 'For the TE$_{10}$ mode of a rectangular guide, which statements are true?',
      options: ['$H_z$ is non-zero', 'The electric field has no component along the axis', '$E_y$ is uniform across the broad dimension', 'A narrow slot cut along the axis at the centre of the broad wall barely disturbs the mode'], answer: [0, 1, 3],
      sol: 'TE means $E_z = 0$ with $H_z \\propto \\cos(\\pi x/a) \\ne 0$. $E_y \\propto \\sin(\\pi x/a)$ is not uniform. On the broad wall, the surface current $\\vec K = \\hat n\\times\\vec H$ has a transverse part from $H_z$, which vanishes at $x = a/2$, and a longitudinal part from $H_x$. A longitudinal slot at the centre cuts no current lines, so it hardly radiates; that is why slotted measuring lines put their probe there.',
      trap: 'Slots that cut current lines radiate (slot antennas); the centre-line slot does not.' },
    { id: 'wvg-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'A step-index multimode fibre has core radius 25 $\\mu$m and NA 0.20. Using $M \\approx V^2/2$, the number of guided modes at 0.85 $\\mu$m is about ______ (nearest whole number).',
      answer: 683, tol: 8, calc: () => ((2 * Math.PI * 25 * 0.2) / 0.85) ** 2 / 2,
      sol: '$V = \\dfrac{2\\pi\\times25\\times0.20}{0.85} = 36.96$, so $M \\approx 36.96^2/2 = 683$ (counting both polarisations). Hundreds of modes, each with its own group delay: the cause of intermodal dispersion.',
      trap: '$V^2/2$ is a large-$V$ estimate; it does not apply near single-mode operation.' },
    { id: 'wvg-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'optical fibres',
      q: 'A fibre with NA 0.10 must be single-mode at 1.55 $\\mu$m. The largest core radius allowed is ______ $\\mu$m (to two decimal places).',
      answer: 5.93, tol: 0.03, unit: 'μm', calc: () => (2.405 * 1.55) / (2 * Math.PI * 0.1),
      sol: 'Single mode needs $V = \\frac{2\\pi a}{\\lambda}\\text{NA} < 2.405$, so $a < \\dfrac{2.405\\lambda}{2\\pi\\,\\text{NA}} = \\dfrac{2.405\\times1.55}{0.628} = 5.93\\ \\mu$m. At shorter wavelengths the same fibre becomes multimode.',
      trap: 'The cutoff value 2.405 is for $V$, which already contains $2\\pi$.' },
    { id: 'wvg-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cavities',
      q: 'The quality factor of a metal cavity resonator limited by wall losses is roughly $Q \\sim \\dfrac{\\text{volume}}{\\text{surface area}\\times\\delta}$. Which change raises $Q$?',
      options: ['Using a metal of lower conductivity', 'Making the cavity smaller at the same frequency (higher mode)', 'Roughening the inner walls', 'Silver-plating the walls (higher conductivity, thinner skin depth)'], answer: 3,
      sol: 'Energy is stored in the volume and lost in a skin layer of thickness $\\delta$ on the walls, so $Q \\sim V/(S\\delta)$ times a number of order 1. Higher $\\sigma$ means smaller $\\delta$ and larger $Q$. Lower conductivity or roughness raise the loss.',
      trap: 'Roughness longer than $\\delta$ lengthens the current path and lowers $Q$.' },
    { id: 'wvg-039', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'TEM lines',
      q: 'For a lossless coaxial line with inner radius $a$, outer radius $b$ and filling $\\epsilon_r$, which statements are true?',
      options: ['The TEM mode has no cutoff', 'The first higher mode (TE$_{11}$) has cutoff wavelength roughly $\\pi(a + b)\\sqrt{\\epsilon_r}$', 'The characteristic impedance depends only on $b/a$ and $\\epsilon_r$', 'The TEM phase velocity depends on frequency'], answer: [0, 1, 2],
      sol: 'TEM: $\\omega = vk$ at every frequency, so there is no cutoff and no dispersion; $Z_0 = \\frac{\\eta_0}{2\\pi\\sqrt{\\epsilon_r}}\\ln(b/a)$. The TE$_{11}$ mode needs about one wavelength (in the filling) around the mean circumference, $\\lambda_c \\approx \\pi(a + b)\\sqrt{\\epsilon_r}$, which sets the highest usable frequency of a cable.',
      trap: 'A coax is single-mode only below the TE$_{11}$ cutoff.' },
    { id: 'wvg-048', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'circular guides',
      q: 'Which mode has the lowest cutoff frequency in a hollow circular guide?',
      options: ['TM$_{01}$', 'TE$_{01}$', 'TE$_{11}$', 'TM$_{11}$'], answer: 2,
      sol: 'Cutoff $\\propto$ the relevant Bessel zero: TE$_{11}$ 1.841, TM$_{01}$ 2.405, TE$_{21}$ 3.054, TE$_{01}$ and TM$_{11}$ 3.832. TE$_{11}$ is the dominant mode.',
      trap: 'TE$_{01}$ (low loss at high frequency) is famous but not dominant.' },
    { id: 'wvg-050', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'wave impedance',
      q: 'As the frequency is lowered towards the cutoff of the TE$_{10}$ mode, its wave impedance',
      options: ['falls to zero', 'rises without limit', 'stays at $\\eta_0$', 'approaches $\\eta_0/2$'], answer: 1,
      sol: '$Z_{TE} = \\eta_0/\\sqrt{1 - (f_c/f)^2} \\to \\infty$ as $f \\to f_c$: the magnetic field transverse to the axis vanishes while $E_y$ stays. (A TM mode does the opposite.) This is why matching into a guide near cutoff is hard.',
      trap: 'Zero impedance at cutoff belongs to TM modes.' },

    // ---------- level 5 ----------
    { id: 'wvg-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'Two short pulses, at 8.0 GHz and 12.0 GHz, start together down 20 m of air-filled guide with TE$_{10}$ cutoff 6.0 GHz. The 12 GHz pulse arrives earlier by ______ ns (to one decimal place).',
      answer: 23.8, tol: 0.2, unit: 'ns', calc: () => { const fc = fcut(1, 0, 0.025, 0.01), vg = (f) => c * Math.sqrt(1 - (fc / f) ** 2); return 20 * (1 / vg(8e9) - 1 / vg(12e9)) * 1e9; },
      sol: '$v_g(8) = c\\sqrt{1 - 0.5625} = 0.6614c$ and $v_g(12) = c\\sqrt{1 - 0.25} = 0.8660c$. Times: $\\frac{20}{0.6614c} = 100.8$ ns and $\\frac{20}{0.8660c} = 77.0$ ns. Difference 23.8 ns (with $f_c = c/2a$ exactly 5.996 GHz the figures change by under 0.1 ns).',
      trap: 'The lower frequency, closer to cutoff, is the slow one.' },
    { id: 'wvg-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'modes',
      q: 'Which statements about mode degeneracy in hollow guides are true?',
      options: ['In any rectangular guide, TE$_{mn}$ and TM$_{mn}$ ($m, n \\ge 1$) share a cutoff', 'In a square guide, TE$_{10}$ and TE$_{01}$ share a cutoff', 'In a circular guide, TE$_{01}$ and TM$_{11}$ share a cutoff', 'In a rectangular guide with $a = 2b$, TE$_{20}$ and TE$_{11}$ share a cutoff'], answer: [0, 1, 2],
      sol: 'Rectangular cutoffs depend only on $(m/a)^2 + (n/b)^2$, the same for TE and TM. In a square guide $(1,0)$ and $(0,1)$ match. In a circular guide TE$_{0n}$ uses zeros of $J_0\' = -J_1$, the same as the zeros of $J_1$ used by TM$_{1n}$, so TE$_{01}$ and TM$_{11}$ coincide (3.832). With $a = 2b$: TE$_{20}$ has $(2/a)^2 = 4/a^2$; TE$_{11}$ has $1/a^2 + 4/a^2 = 5/a^2$, different (TE$_{20}$ actually ties with TE$_{01}$).',
      trap: 'The degeneracy of TE$_{01}$ and TM$_{11}$ in round guides comes from $J_0\' = -J_1$.' },
    { id: 'wvg-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'cavities',
      q: 'An air-filled rectangular cavity measures 3.0 cm by 1.5 cm by 4.0 cm. How many independent resonant modes does it have below 12 GHz?',
      answer: 7, tol: 0, calc: () => { let n = 0; for (let m = 0; m < 6; m++) for (let k = 0; k < 6; k++) for (let p = 0; p < 6; p++) { const z = [m, k, p].filter((x) => x === 0).length; if (z > 1) continue; const f = (c / 2) * Math.sqrt((m / 0.03) ** 2 + (k / 0.015) ** 2 + (p / 0.04) ** 2); if (f < 12e9) n += z === 0 ? 2 : 1; } return n; },
      sol: 'Each set $(m, n, p)$ with at most one zero gives a resonance at $\\frac c2\\sqrt{(m/a)^2 + (n/b)^2 + (p/d)^2}$; if all three are non-zero it carries two independent modes (a TE and a TM), if exactly one is zero it carries one. Below 12 GHz: $(1,0,1)$ 6.25, $(1,0,2)$ 9.01, $(0,1,1)$ 10.67, $(2,0,1)$ 10.67, $(1,1,0)$ 11.17, $(1,1,1)$ 11.78 GHz (two modes). Total $5 + 2 = 7$.',
      trap: 'Two different index sets can share a frequency (here 10.67 GHz): count them separately.' },
    { id: 'wvg-044', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'plane-wave picture',
      q: 'In the bouncing plane-wave picture of a waveguide mode, each plane wave travels at $c$ at angle $\\theta$ to the axis. Which statements are true?',
      options: ['At cutoff the plane waves bounce straight across the guide ($\\theta = 90^\\circ$)', 'The group velocity is $c\\cos\\theta$', 'The phase velocity along the axis is $c/\\cos\\theta$', 'The angle $\\theta$ is the same at every frequency'], answer: [0, 1, 2],
      sol: '$k_z = k\\cos\\theta$ and $k\\sin\\theta = k_c$ is fixed by the walls. Energy moves along the zigzag at $c$, so its axial speed is $c\\cos\\theta$; the wavefronts cut the axis at intervals $\\lambda/\\cos\\theta$, giving $v_p = c/\\cos\\theta$. Since $\\sin\\theta = k_c/k = f_c/f$, the angle changes with frequency, reaching $90^\\circ$ at cutoff.',
      trap: 'Phase velocity above $c$ is just the speed at which a slanted wavefront slides along the wall.' },
    { id: 'wvg-045', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'evanescent modes',
      q: 'A circular tube of inner radius 5.0 mm is used as a below-cutoff attenuator at 1.0 GHz. The attenuation of the TE$_{11}$ field (first zero of $J_1\'$: 1.841) is ______ dB per cm (to one decimal place).',
      answer: 31.9, tol: 0.3, unit: 'dB/cm', calc: () => { const kc = 1.841 / 0.005, k = (2 * Math.PI * 1e9) / c; return Math.sqrt(kc * kc - k * k) * 0.01 * 20 * Math.log10(Math.E); },
      sol: '$k_c = 1.841/0.005 = 368.2$ m$^{-1}$, $k = 2\\pi f/c = 20.96$ m$^{-1}$, so $\\alpha = \\sqrt{k_c^2 - k^2} = 367.6$ Np/m $= 3.676$ Np/cm $= 8.686\\times3.676 = 31.9$ dB/cm. Far below cutoff the result hardly depends on frequency, which is what makes such attenuators precise.',
      trap: 'Using the TM$_{01}$ zero (2.405) gives a larger, wrong attenuation: the least-attenuated mode, TE$_{11}$, dominates.' },
  ],

  gens: [
    { id: 'wvg-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cutoff',
      make(r) {
        const a = int(r, 15, 50) / 10, b = round(a * choose(r, [0.4, 0.45, 0.5]), 2), mode = choose(r, [[1, 0], [2, 0], [0, 1], [1, 1], [3, 0], [2, 1]]), tm = mode[0] && mode[1] && r() < 0.5;
        const fc = fcut(mode[0], mode[1], a / 100, b / 100) / 1e9, answer = round(fc, 3);
        return { q: `An air-filled rectangular guide is ${a} cm by ${b} cm. Find the cutoff frequency of its ${tm ? 'TM' : 'TE'}$_{${mode[0]}${mode[1]}}$ mode, in GHz.`,
          answer, tol: Math.max(0.005, fc * 0.005), unit: 'GHz', a, b, m: mode[0], n: mode[1],
          sol: `$f_c = \\dfrac c2\\sqrt{\\left(\\dfrac{${mode[0]}}{${a / 100}}\\right)^2 + \\left(\\dfrac{${mode[1]}}{${b / 100}}\\right)^2} = ${answer}$ GHz (TE and TM with the same indices share it).`,
          trap: 'Convert centimetres to metres before using $c$ in m/s.' };
      },
      verify: (p) => (c / 2e9) * Math.hypot(p.m / (p.a / 100), p.n / (p.b / 100)) },
    { id: 'wvg-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'guide wavelength',
      make(r) {
        const fc = int(r, 3, 12), f = round(fc * (1.15 + int(r, 0, 10) * 0.08), 2), ask = choose(r, ['guide wavelength', 'phase velocity', 'group velocity']);
        const s = Math.sqrt(1 - (fc / f) ** 2), lam = 30 / f;
        const val = ask === 'guide wavelength' ? lam / s : ask === 'phase velocity' ? 3 / s : 3 * s, answer = round(val, 3);
        return { q: `A ${f} GHz signal travels in an air-filled guide in a mode whose cutoff is ${fc} GHz. Find its ${ask}${ask === 'guide wavelength' ? ' in cm' : ' in units of $10^8$ m/s'} (take $c = 3.0\\times10^8$ m/s).`,
          answer, tol: Math.max(0.002, val * 0.005), unit: ask === 'guide wavelength' ? 'cm' : '×10⁸ m/s', f, fc, ask,
          sol: `$\\sqrt{1 - (f_c/f)^2} = \\sqrt{1 - (${fc}/${f})^2} = ${s.toFixed(4)}$. ${ask === 'guide wavelength' ? `$\\lambda = 30/${f} = ${lam.toFixed(4)}$ cm, so $\\lambda_g = \\lambda/${s.toFixed(4)} = ${answer}$ cm.` : ask === 'phase velocity' ? `$v_p = c/${s.toFixed(4)} = ${answer}\\times10^8$ m/s, above $c$.` : `$v_g = c\\times${s.toFixed(4)} = ${answer}\\times10^8$ m/s.`}`,
          trap: 'Guide wavelength and phase velocity grow near cutoff; group velocity shrinks.' };
      },
      verify: (p) => { const k = Math.sqrt(p.f ** 2 - p.fc ** 2); return p.ask === 'guide wavelength' ? 30 / k : p.ask === 'phase velocity' ? (3 * p.f) / k : (3 * k) / p.f; } },
    { id: 'wvg-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'modes',
      make(r) {
        const a = int(r, 18, 40) / 10, b = round(a * choose(r, [0.4, 0.5, 0.6]), 2), f = int(r, 8, 30);
        const ms = modesBelow(f * 1e9, a / 100, b / 100), answer = ms.length;
        return { q: `How many modes (TE and TM counted separately) propagate at ${f} GHz in an air-filled guide of ${a} cm by ${b} cm?`,
          answer, tol: 0, a, b, f,
          sol: `$f_c = \\frac c2\\sqrt{(m/a)^2 + (n/b)^2}$. The modes with $f_c < ${f}$ GHz are: ${ms.length ? ms.map(([nm, fc]) => `$\\text{${nm.slice(0, 2)}}${nm.slice(2)}$ (${(fc / 1e9).toFixed(2)})`).join(', ') : 'none'}. Total ${answer}.`,
          trap: 'Each $(m, n)$ with both indices non-zero carries a TE and a TM mode.' };
      },
      verify: (p) => { let n = 0; for (let m = 0; m < 40; m++) for (let k = 0; k < 40; k++) { if (!m && !k) continue; if ((c / 2) * Math.hypot(m / (p.a / 100), k / (p.b / 100)) < p.f * 1e9) n += m && k ? 2 : 1; } return n; } },
    { id: 'wvg-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent modes',
      make(r) {
        const a = int(r, 15, 40) / 10, fcG = fcut(1, 0, a / 100, 0.01) / 1e9, f = round(fcG * int(r, 2, 9) / 10, 2), L = int(r, 1, 10);
        const k = (2 * Math.PI * f * 1e9) / c, al = Math.sqrt((Math.PI / (a / 100)) ** 2 - k * k), db = 20 * Math.log10(Math.E) * al * L / 100, answer = round(db, 2);
        return { q: `A ${f} GHz signal enters ${L} cm of air-filled guide with broad side ${a} cm (below the TE$_{10}$ cutoff). Find the attenuation of the TE$_{10}$ field over this length, in dB.`,
          answer, tol: Math.max(0.02, db * 0.01), unit: 'dB', a, f, L,
          sol: `$k_c = \\pi/a = ${(Math.PI / (a / 100)).toFixed(2)}$ m$^{-1}$, $k = 2\\pi f/c = ${k.toFixed(2)}$ m$^{-1}$, so $\\alpha = \\sqrt{k_c^2 - k^2} = ${al.toFixed(2)}$ Np/m. Over ${L} cm: $8.686\\times${al.toFixed(2)}\\times${L / 100} = ${answer}$ dB.`,
          trap: 'Field attenuation in dB is $20\\log_{10}$, i.e. 8.686 dB per neper.' };
      },
      verify: (p) => { const fc = c / (2 * p.a / 100); return 8.685889638 * (2 * Math.PI * fc / c) * Math.sqrt(1 - (p.f * 1e9 / fc) ** 2) * p.L / 100; } },
    { id: 'wvg-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'modes',
      make(r) {
        const a = int(r, 20, 30) / 10, b = round(a * choose(r, [0.4, 0.45]), 2), ms = modesBelow(80e9, a / 100, b / 100);
        const cuts = []; for (const m of ms) if (!cuts.length || m[1] - cuts[cuts.length - 1] > 1e7) cuts.push(m[1]);
        const idx = int(r, 1, 4), f = round((cuts[idx] + cuts[idx + 1]) / 2e9, 2);
        const n = ms.filter((m) => m[1] < f * 1e9).length;
        const o = mcqOptions(r, n, [n + 1, n > 2 ? n - 1 : n + 3, n + 2, 1].filter((x) => x !== n));
        return { q: `How many modes propagate at ${f} GHz in an air-filled guide of ${a} cm by ${b} cm (TE and TM counted separately)?`, ...o,
          sol: `List the cutoffs $f_c = \\frac c2\\sqrt{(m/a)^2 + (n/b)^2}$ in order: ${ms.slice(0, n + 1).map(([nm, fc]) => `$\\text{${nm.slice(0, 2)}}${nm.slice(2)}$ ${(fc / 1e9).toFixed(2)}`).join(', ')} GHz. Below ${f} GHz there are ${n}.`,
          trap: 'Do not forget the TE$_{n0}$ ladder along the broad side, nor the TM partner of each TE$_{mn}$ with $m, n \\ge 1$.' };
      } },
    { id: 'wvg-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cavities',
      make(r) {
        const a = int(r, 2, 6), b = int(r, 1, a), d = int(r, 3, 9), mode = choose(r, [[1, 0, 1], [1, 1, 0], [0, 1, 1], [1, 0, 2], [2, 0, 1], [1, 1, 1]]);
        const f = (c / 2) * Math.hypot(mode[0] / (a / 100), mode[1] / (b / 100), mode[2] / (d / 100)) / 1e9, answer = round(f, 3);
        return { q: `An air-filled rectangular cavity is ${a} cm by ${b} cm by ${d} cm. Find the resonant frequency of the $(m, n, p) = (${mode.join(', ')})$ mode, in GHz.`,
          answer, tol: Math.max(0.005, f * 0.005), unit: 'GHz', a, b, d, mode,
          sol: `$f = \\dfrac c2\\sqrt{(m/a)^2 + (n/b)^2 + (p/d)^2} = 1.499\\times10^8\\times\\sqrt{${(mode[0] / (a / 100)) ** 2} + ${round((mode[1] / (b / 100)) ** 2, 1)} + ${round((mode[2] / (d / 100)) ** 2, 1)}}$ Hz $= ${answer}$ GHz.`,
          trap: 'Each index counts half-wavelengths along its own side.' };
      },
      verify: (p) => (c / 2e9) * Math.sqrt((p.mode[0] / (p.a / 100)) ** 2 + (p.mode[1] / (p.b / 100)) ** 2 + (p.mode[2] / (p.d / 100)) ** 2) },
    { id: 'wvg-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'optical fibres',
      make(r) {
        const n1 = choose(r, [1.46, 1.47, 1.48, 1.5]), dn = choose(r, [0.003, 0.005, 0.01, 0.02]), n2 = round(n1 - dn, 3), a = choose(r, [2, 3, 4, 5, 8, 25, 50]), lam = choose(r, [0.85, 1.31, 1.55]);
        const NA = Math.sqrt(n1 * n1 - n2 * n2), V = (2 * Math.PI * a * NA) / lam, answer = round(V, 3);
        return { q: `A step-index fibre has $n_1 = ${n1}$, $n_2 = ${n2}$ and core radius ${a} $\\mu$m. Find its $V$ number at ${lam} $\\mu$m. (Single-mode if $V < 2.405$.)`,
          answer, tol: Math.max(0.005, V * 0.005), n1, n2, a, lam,
          sol: `$\\text{NA} = \\sqrt{${n1}^2 - ${n2}^2} = ${NA.toFixed(4)}$, $V = \\dfrac{2\\pi\\times${a}}{${lam}}\\times${NA.toFixed(4)} = ${answer}$: ${V < 2.405 ? 'single-mode' : `multimode (about ${Math.round((V * V) / 2)} modes if $V$ is large)`}.`,
          trap: 'Use the core radius and the numerical aperture, not the index difference.' };
      },
      verify: (p) => (2 * Math.PI * p.a * Math.sqrt((p.n1 - p.n2) * (p.n1 + p.n2))) / p.lam },
    { id: 'wvg-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'TEM lines',
      make(r) {
        const ratio = choose(r, [2.3, 2.7, 3.0, 3.5, 4.0, 5.0, 6.5]), er = choose(r, [1, 1.5, 2.1, 2.25, 4]), ask = choose(r, ['impedance', 'ratio']);
        const Z = (ETA0 / (2 * Math.PI * Math.sqrt(er))) * Math.log(ratio);
        if (ask === 'impedance') return { q: `A coaxial line has outer-to-inner radius ratio ${ratio} and filling of relative permittivity ${er}. Find its characteristic impedance in ohms.`, answer: round(Z, 2), tol: Math.max(0.05, Z * 0.005), unit: 'Ω', ratio, er, ask,
          sol: `$Z_0 = \\dfrac{\\eta_0}{2\\pi\\sqrt{\\epsilon_r}}\\ln\\dfrac ba = \\dfrac{59.96}{\\sqrt{${er}}}\\ln${ratio} = ${round(Z, 2)}\\ \\Omega$.`, trap: 'Natural log, and $\\sqrt{\\epsilon_r}$ in the denominator.' };
        const Zt = choose(r, [50, 75, 93]), rat = Math.exp((Zt * 2 * Math.PI * Math.sqrt(er)) / ETA0);
        return { q: `What outer-to-inner radius ratio gives a ${Zt} $\\Omega$ coaxial line with a filling of relative permittivity ${er}?`, answer: round(rat, 3), tol: Math.max(0.005, rat * 0.005), Zt, er, ask,
          sol: `$\\ln(b/a) = \\dfrac{2\\pi\\sqrt{\\epsilon_r}Z_0}{\\eta_0} = \\dfrac{\\sqrt{${er}}\\times${Zt}}{59.96} = ${Math.log(rat).toFixed(4)}$, so $b/a = ${round(rat, 3)}$.`, trap: 'Exponentiate with $e$, not 10.' };
      },
      verify: (p) => (p.ask === 'impedance' ? (59.9585 / Math.sqrt(p.er)) * Math.log(p.ratio) : Math.exp((Math.sqrt(p.er) * p.Zt) / 59.9585)) },
    { id: 'wvg-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'transmission lines',
      make(r) {
        const Z0 = choose(r, [50, 75, 100, 300]), ZL = choose(r, [25, 50, 75, 100, 150, 200, 300, 600].filter((z) => z !== Z0)), ask = choose(r, ['VSWR', 'reflected power (%)', 'quarter-wave input impedance']);
        const G = (ZL - Z0) / (ZL + Z0), val = ask === 'VSWR' ? (1 + Math.abs(G)) / (1 - Math.abs(G)) : ask === 'reflected power (%)' ? 100 * G * G : (Z0 * Z0) / ZL, answer = round(val, 3);
        return { q: ask === 'quarter-wave input impedance' ? `A lossless ${Z0} $\\Omega$ line, a quarter wavelength long, ends in ${ZL} $\\Omega$. Find its input impedance in ohms.` : `A lossless ${Z0} $\\Omega$ line ends in a ${ZL} $\\Omega$ resistive load. Find the ${ask}.`,
          answer, tol: Math.max(0.002, val * 0.005), unit: ask === 'quarter-wave input impedance' ? 'Ω' : '', Z0, ZL, ask,
          sol: ask === 'quarter-wave input impedance' ? `A quarter-wave line inverts: $Z_{\\text{in}} = Z_0^2/Z_L = ${Z0 * Z0}/${ZL} = ${answer}\\ \\Omega$.` : `$\\Gamma = \\dfrac{Z_L - Z_0}{Z_L + Z_0} = \\dfrac{${ZL - Z0}}{${ZL + Z0}} = ${G.toFixed(4)}$. ${ask === 'VSWR' ? `VSWR $= \\dfrac{1 + |\\Gamma|}{1 - |\\Gamma|} = ${answer}$.` : `Reflected power $= |\\Gamma|^2 = ${answer}\\%$.`}`,
          trap: 'The VSWR is never below 1; reflected power is $|\\Gamma|^2$, not $|\\Gamma|$.' };
      },
      verify: (p) => { const G = Math.abs(p.ZL - p.Z0) / (p.ZL + p.Z0); return p.ask === 'VSWR' ? Math.max(p.ZL, p.Z0) / Math.min(p.ZL, p.Z0) : p.ask === 'reflected power (%)' ? 100 * G * G : (p.Z0 * p.Z0) / p.ZL; } },
    { id: 'wvg-g10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'wave impedance',
      make(r) {
        const kind = choose(r, ['TE', 'TM']), ratio = choose(r, [1.25, 1.5, 2, 2.5, 3]), s = Math.sqrt(1 - 1 / ratio ** 2);
        const right = kind === 'TE' ? ETA0 / s : ETA0 * s, show = (v) => `$${v.toFixed(0)}\\ \\Omega$`;
        const o = mcqOptions(r, right, [kind === 'TE' ? ETA0 * s : ETA0 / s, ETA0, ETA0 / ratio, ETA0 * ratio], show);
        return { q: `A ${kind} mode in an air-filled guide runs at ${ratio} times its cutoff frequency. Its wave impedance is closest to`, ...o,
          sol: `$\\sqrt{1 - (f_c/f)^2} = \\sqrt{1 - 1/${ratio}^2} = ${s.toFixed(4)}$. ${kind === 'TE' ? '$Z_{TE} = \\eta_0/' : '$Z_{TM} = \\eta_0\\times'}${s.toFixed(4)}$ $= ${right.toFixed(0)}\\ \\Omega$.`,
          trap: 'TE impedance is above $\\eta_0$, TM impedance below.' };
      } },
    { id: 'wvg-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'power',
      make(r) {
        const a = int(r, 18, 30) / 10, b = round(a / 2, 2), fcG = fcut(1, 0, a / 100, b / 100) / 1e9, f = round(fcG * choose(r, [1.3, 1.5, 1.7]), 2), E0 = int(r, 2, 30) * 1e4;
        const Z = ETA0 / Math.sqrt(1 - (fcG / f) ** 2), P = (E0 * E0 * (a / 100) * (b / 100)) / (4 * Z), answer = round(P / 1e3, 3);
        return { q: `The TE$_{10}$ mode in an air-filled ${a} cm by ${b} cm guide at ${f} GHz has peak field $E_0 = ${fmt(E0, 3)}$ V/m at the centre. Find the power carried, in kW.`,
          answer, tol: Math.max(0.002, (P / 1e3) * 0.01), unit: 'kW', a, b, f, E0,
          sol: `$f_c = ${fcG.toFixed(3)}$ GHz, $Z_{TE} = \\eta_0/\\sqrt{1 - (f_c/f)^2} = ${Z.toFixed(1)}\\ \\Omega$. $P = \\dfrac{E_0^2ab}{4Z_{TE}} = \\dfrac{(${fmt(E0, 3)})^2\\times${a / 100}\\times${b / 100}}{4\\times${Z.toFixed(1)}} = ${answer}$ kW.`,
          trap: 'The power uses $Z_{TE}$, not $\\eta_0$, and a factor $\\tfrac14$ from two averages.' };
      },
      verify: (p) => { let s = 0; const N = 400, a = p.a / 100, fc = c / (2 * a), Z = ETA0 / Math.sqrt(1 - (fc / (p.f * 1e9)) ** 2); for (let i = 0; i < N; i++) s += Math.sin((Math.PI * (i + 0.5)) / N) ** 2; return ((p.E0 ** 2 / (2 * Z)) * (s / N) * a * (p.b / 100)) / 1e3; } },
    { id: 'wvg-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'optical fibres',
      make(r) {
        const n1 = choose(r, [1.45, 1.48, 1.5]), n2 = round(n1 - choose(r, [0.005, 0.01, 0.015, 0.02, 0.03]), 3), L = choose(r, [0.5, 1, 2, 5]);
        const dt = ((L * 1000 * n1) / c) * (n1 / n2 - 1) * 1e9, answer = round(dt, 2);
        return { q: `Ray optics: find the intermodal delay spread (ns) over ${L} km of step-index fibre with $n_1 = ${n1}$ and $n_2 = ${n2}$.`,
          answer, tol: Math.max(0.01, dt * 0.005), unit: 'ns', n1, n2, L,
          sol: `$\\Delta t = \\dfrac{Ln_1}{c}\\left(\\dfrac{n_1}{n_2} - 1\\right) = \\dfrac{${L * 1000}\\times${n1}}{3.0\\times10^8}\\times${(n1 / n2 - 1).toFixed(5)} = ${answer}$ ns.`,
          trap: 'The slowest ray travels at the critical angle, a path $n_1/n_2$ times the axial one.' };
      },
      verify: (p) => (p.L * 1000 * p.n1 * (p.n1 - p.n2)) / (c * p.n2) * 1e9 },
    ...more,
  ],
};
