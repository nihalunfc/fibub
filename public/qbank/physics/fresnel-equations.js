// Reflection, refraction and the Fresnel equations: boundary conditions and the laws of reflection and refraction,
// s (TE) and p (TM) amplitude coefficients, reflectance and transmittance with the beam-area factor, Brewster angle,
// total internal reflection with its phase shifts and evanescent wave, metals with complex index, magnetic media,
// Stokes relations, antireflection coatings and piles of plates (GATE/NET level).
// Sign convention used for r_p: r_p = (n2 cos θi − n1 cos θt)/(n2 cos θi + n1 cos θt). Questions avoid depending on it.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt } from '../_util.js';
import more from './fresnel-equations.more.gen.js';
import more2 from './fresnel-equations.more2.gen.js';
import r4 from './fresnel-equations.r4.gen.js';

const D = Math.PI / 180;
/** Fresnel amplitude coefficients for a ray from n1 into n2 at incidence thDeg (no TIR). */
const fres = (n1, n2, thDeg) => {
  const ci = Math.cos(thDeg * D), st = (n1 / n2) * Math.sin(thDeg * D), ct = Math.sqrt(1 - st * st);
  const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct);
  const ts = (2 * n1 * ci) / (n1 * ci + n2 * ct), tp = (2 * n1 * ci) / (n2 * ci + n1 * ct);
  return { rs, rp, ts, tp, ci, ct, f: (n2 * ct) / (n1 * ci) };
};
/** Relative phase (degrees) between s and p after one total internal reflection, n = n2/n1 < 1. */
const tirDelta = (thDeg, n) => { const s = Math.sin(thDeg * D), c = Math.cos(thDeg * D); return (2 * Math.atan((c * Math.sqrt(s * s - n * n)) / (s * s))) / D; };
const deg = (x) => x / D;
const rhombAngle = (n1) => { let lo = 45, hi = 80; const n = 1 / n1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (tirDelta(m, n) > 45) lo = m; else hi = m; } return lo; };
const arR = (n1, n2, n3, d, lam) => { // single-layer film reflectance (normal incidence)
  const del = (2 * Math.PI * n2 * d) / lam, r12 = (n1 - n2) / (n1 + n2), r23 = (n2 - n3) / (n2 + n3);
  const nr = r12 + r23 * Math.cos(2 * del), ni = r23 * Math.sin(2 * del), dr = 1 + r12 * r23 * Math.cos(2 * del), di = r12 * r23 * Math.sin(2 * del);
  return (nr * nr + ni * ni) / (dr * dr + di * di);
};

export default {
  topic: 'fresnel-equations',
  items: [
    // ---------- level 1 ----------
    { id: 'frs-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'Light in air meets a non-magnetic dielectric of index $n$ at the Brewster angle $\\theta_B$. The angle of refraction is',
      options: ['$\\theta_B$', '$\\sin^{-1}(1/n)$', '$90^\\circ - \\theta_B$', '$45^\\circ$'], answer: 2,
      sol: '$\\tan\\theta_B = n_2/n_1$ is the same as $n_1\\sin\\theta_B = n_2\\cos\\theta_B$; comparing with Snell\'s law $n_1\\sin\\theta_B = n_2\\sin\\theta_t$ gives $\\theta_t = 90^\\circ - \\theta_B$. Then the angle between reflected and refracted rays is $180^\\circ - \\theta_B - \\theta_t = 90^\\circ$. The dipoles in medium 2 oscillate along the would-be reflected ray for p light, and a dipole does not radiate along its axis.',
      trap: '$\\sin^{-1}(1/n)$ is the critical angle for light going the other way, a different thing.' },
    { id: 'frs-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'Total internal reflection at a plane boundary can occur only when light travels',
      options: ['from a medium of lower index to one of higher index', 'from a medium of higher index to one of lower index', 'at normal incidence', 'in p polarisation only'], answer: 1,
      sol: 'Snell: $\\sin\\theta_t = (n_1/n_2)\\sin\\theta_i$ exceeds 1 for some angle only if $n_1 > n_2$. The critical angle is $\\sin\\theta_c = n_2/n_1$. Both polarisations are totally reflected beyond it.',
      trap: 'TIR does not care about polarisation; Brewster does.' },
    { id: 'frs-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'normal incidence',
      q: 'Light falls normally from air on still water ($n = 1.33$). The percentage of the intensity reflected is ______ (to two decimal places).',
      answer: 2.01, tol: 0.02, unit: '%', calc: () => 100 * (0.33 / 2.33) ** 2,
      sol: '$R = \\left(\\dfrac{n_2 - n_1}{n_2 + n_1}\\right)^2 = \\left(\\dfrac{0.33}{2.33}\\right)^2 = 0.0201$, about 2.01%.',
      trap: 'Forgetting to square the amplitude ratio gives 14%.' },
    { id: 'frs-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'Between two non-magnetic dielectrics, which Fresnel amplitude coefficient becomes zero at the Brewster angle?',
      options: ['$r_s$', '$t_p$', '$t_s$', '$r_p$'], answer: 3,
      sol: 'At $\\theta_B$ the p reflection coefficient vanishes, so only s light (E perpendicular to the plane of incidence) is reflected. The transmission coefficients never vanish (all the p light goes through), and $r_s = -\\sin(\\theta_i - \\theta_t)/\\sin(\\theta_i + \\theta_t)$ is zero only for equal indices.',
      trap: 's comes from the German "senkrecht", perpendicular; it is the p wave that disappears from the reflection.' },
    { id: 'frs-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'normal incidence',
      q: 'At normal incidence from air onto glass, the reflected electric field relative to the incident field (same orientation convention)',
      options: ['is reversed in sign (phase change $\\pi$)', 'has the same sign', 'is shifted by $\\pi/2$', 'has zero amplitude'], answer: 0,
      sol: '$r = \\dfrac{n_1 - n_2}{n_1 + n_2} = \\dfrac{1 - 1.5}{2.5} = -0.2$: the reflected $E$ is reversed. Going from glass to air it would keep its sign ($r = +0.2$). The magnetic field behaves the other way round.',
      trap: 'The $\\pi$ shift is for $E$ at reflection off the denser medium; for $B$ it is the rarer.' },
    { id: 'frs-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'The critical angle for light going from flint glass ($n = 1.60$) into air is ______ degrees (to one decimal place).',
      answer: 38.7, tol: 0.1, unit: '°', calc: () => deg(Math.asin(1 / 1.6)),
      sol: '$\\sin\\theta_c = n_2/n_1 = 1/1.60 = 0.625$, so $\\theta_c = 38.7^\\circ$.',
      trap: 'Using $\\tan$ instead of $\\sin$ gives the internal Brewster angle, $32.0^\\circ$.' },

    // ---------- level 2 ----------
    { id: 'frs-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'A flint-glass prism ($n = 1.62$) is immersed in benzene ($n = 1.50$). For light in the benzene striking the prism, the Brewster angle is ______ degrees (to one decimal place).',
      answer: 47.2, tol: 0.1, unit: '°', calc: () => deg(Math.atan(1.62 / 1.5)),
      sol: '$\\tan\\theta_B = n_2/n_1 = 1.62/1.50 = 1.08$, so $\\theta_B = 47.2^\\circ$, close to $45^\\circ$ because the indices are nearly matched (compare $58.3^\\circ$ from air). When the indices match exactly the boundary vanishes and $\\theta_B = 45^\\circ$, though by then nothing is reflected at any angle.',
      trap: 'The Brewster angle depends on the ratio of indices, not on $n_2$ alone.' },
    { id: 'frs-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'transmittance',
      q: 'For oblique incidence from index $n_1$ into $n_2$, the transmittance is $T = \\dfrac{n_2\\cos\\theta_t}{n_1\\cos\\theta_i}|t|^2$ rather than $|t|^2$. The extra factor accounts for',
      options: ['absorption in the second medium', 'the change in wave speed and the change in beam cross-section', 'the phase shift on transmission', 'the reflected beam'], answer: 1,
      sol: 'Intensity in a medium is $\\frac12n\\epsilon_0c|E|^2$ (factor $n_2/n_1$), and power through a patch of the interface is intensity times $\\cos\\theta$ (factor $\\cos\\theta_t/\\cos\\theta_i$). With both, $R + T = 1$. $|t|^2$ alone can even exceed 1, for example $t = 1.2$ from glass to air at normal incidence.',
      trap: 'An amplitude coefficient above 1 does not break energy conservation.' },
    { id: 'frs-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'Beyond the critical angle at a glass-air boundary, which statements are true?',
      options: ['The reflectance is 1 for both polarisations', 'An evanescent field exists in the air', 'The time-averaged energy flow across the boundary is zero', 'The s and p reflected waves have equal phase shifts'], answer: [0, 1, 2],
      sol: 'With $\\sin\\theta_t > 1$, $\\cos\\theta_t$ is imaginary and $|r_s| = |r_p| = 1$. The transmitted field decays as $e^{-\\kappa z}$ while running along the surface; its normal Poynting component averages to zero. The phase shifts differ (that is how a Fresnel rhomb makes circular light).',
      trap: 'An evanescent wave is not "no field": the field is there, but carries no average power across.' },
    { id: 'frs-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normal incidence',
      q: 'At normal incidence from air into glass ($n = 1.5$), the amplitude transmission coefficient $t = E_t/E_i$ is ______ (to two decimal places).',
      answer: 0.80, tol: 0.005, calc: () => 2 / 2.5,
      sol: '$t = \\dfrac{2n_1}{n_1 + n_2} = \\dfrac{2}{2.5} = 0.80$. Check: $T = n_2|t|^2/n_1 = 1.5\\times0.64 = 0.96$ and $R = 0.04$, adding to 1.',
      trap: '$t = 1 + r$ (here $1 - 0.2$), not $1 - |r|$ in general; for glass to air $t = 1.2$.' },
    { id: 'frs-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'normal incidence',
      q: 'At normal incidence, the reflectance of a glass-air surface for light inside the glass, compared with that for light coming from the air, is',
      options: ['larger, because the glass is denser', 'smaller, because of the phase change', 'zero', 'the same'], answer: 3,
      sol: '$R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2$ is symmetric in $n_1$ and $n_2$. Only the sign of $r$ changes ($r\' = -r$, a Stokes relation).',
      trap: 'At oblique incidence the two sides differ (and only the inside can show TIR).' },
    { id: 'frs-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Stokes relations',
      q: 'For a certain interface the amplitude reflection coefficient from side 1 is $r = 0.30$. Using the Stokes relations, the product $tt\'$ of the transmission coefficients from side 1 and from side 2 is ______ (to two decimal places).',
      answer: 0.91, tol: 0.005, calc: () => 1 - 0.09,
      sol: 'Time-reversing the reflected and transmitted waves must rebuild the incident one: $r^2 + tt\' = 1$ and $r\' = -r$. So $tt\' = 1 - 0.09 = 0.91$.',
      trap: '$tt\'$ is not $t^2$: the two transmission coefficients differ.' },
    { id: 'frs-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'For s polarisation (E perpendicular to the plane of incidence) between non-magnetic media, the amplitude reflection coefficient is',
      options: ['$\\dfrac{n_1\\cos\\theta_t - n_2\\cos\\theta_i}{n_1\\cos\\theta_t + n_2\\cos\\theta_i}$', '$\\dfrac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}$', '$\\dfrac{n_1 - n_2}{n_1 + n_2}$ at every angle', '$\\dfrac{2n_1\\cos\\theta_i}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}$'], answer: 1,
      sol: 'Continuity of tangential $E$: $E_i + E_r = E_t$. Continuity of tangential $H$: $n_1\\cos\\theta_i(E_i - E_r) = n_2\\cos\\theta_t E_t$. Eliminating $E_t$: $r_s = \\dfrac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}$. The first option is (up to an overall sign) the p coefficient; the last is $t_s$.',
      trap: 'In $r_s$ each index pairs with the cosine of its own medium; in $r_p$ they are crossed.' },
    { id: 'frs-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'Light inside a glass block ($n = 1.5$) meets the glass-air surface. The internal Brewster angle is closest to',
      options: ['$33.7^\\circ$', '$56.3^\\circ$', '$41.8^\\circ$', '$48.2^\\circ$'], answer: 0,
      sol: '$\\tan\\theta_B = n_2/n_1 = 1/1.5$, so $\\theta_B = 33.7^\\circ$, the complement of the external value $56.3^\\circ$ (the internal one is the refraction angle of the external one). It is below the critical angle $41.8^\\circ$, as it must be.',
      trap: '$41.8^\\circ$ is the critical angle, not the Brewster angle.' },
    { id: 'frs-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'boundary conditions',
      q: 'Which statements follow from requiring the boundary conditions to hold at every point of a plane interface and at every instant?',
      options: ['The reflected and transmitted waves have the same frequency as the incident wave', 'The tangential component of $\\vec k$ is the same for all three waves (giving Snell\'s law)', 'The amplitude ratios follow from continuity of tangential $\\vec E$ and $\\vec H$', 'The wavelength is the same on both sides'], answer: [0, 1, 2],
      sol: 'The phases $\\vec k\\cdot\\vec r - \\omega t$ must match all along the interface for all $t$: same $\\omega$, same tangential $k$, so $n_1\\sin\\theta_i = n_2\\sin\\theta_t$ and $\\theta_r = \\theta_i$. The amplitudes then come from the field conditions (the Fresnel equations). The wavelength $\\lambda_0/n$ changes.',
      trap: 'Snell\'s law is purely kinematic; it holds for any kind of wave.' },
    { id: 'frs-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magnetic media',
      q: 'A plane wave in vacuum falls normally on a lossless material with relative permittivity $\\epsilon_r$ and relative permeability $\\mu_r$. There is no reflection when',
      options: ['$\\epsilon_r = 1$ only', '$\\epsilon_r\\mu_r = 1$', '$\\epsilon_r = \\mu_r$', '$\\mu_r = 1$'], answer: 2,
      sol: 'In impedance form $r = \\dfrac{\\eta_2 - \\eta_1}{\\eta_2 + \\eta_1}$ with $\\eta_2 = \\eta_0\\sqrt{\\mu_r/\\epsilon_r}$. Zero reflection needs $\\eta_2 = \\eta_0$, i.e. $\\mu_r = \\epsilon_r$, even though the index $\\sqrt{\\epsilon_r\\mu_r}$ differs from 1. This is the idea behind radar-absorbing ferrites.',
      trap: 'Matching impedance, not refractive index, removes reflection.' },
    { id: 'frs-027', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'antireflection coating',
      q: 'An ideal single-layer antireflection coating for glass of index 1.52 in air, designed for 550 nm, has thickness ______ nm (to one decimal place).',
      answer: 111.5, tol: 0.6, unit: 'nm', calc: () => 550 / (4 * Math.sqrt(1.52)),
      sol: 'The two reflections cancel when they have equal size ($n_c = \\sqrt{n_{\\text{air}}n_g} = \\sqrt{1.52} = 1.233$) and opposite phase (optical thickness a quarter wave). So $d = \\dfrac{\\lambda}{4n_c} = \\dfrac{550}{4\\times1.233} = 111.5$ nm.',
      trap: 'Use the wavelength inside the coating, $\\lambda/n_c$, not 550 nm itself.' },

    // ---------- level 3 ----------
    { id: 'frs-015', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent wave',
      q: 'A He-Ne beam ($\\lambda_0 = 633$ nm) is totally reflected inside glass ($n = 1.50$) at a glass-air face, at $45^\\circ$ incidence. The depth in the air at which the evanescent <em>field</em> amplitude falls to $1/e$ is ______ nm (nearest nm).',
      answer: 285, tol: 2, unit: 'nm', calc: () => 633 / (2 * Math.PI * Math.sqrt(2.25 * 0.5 - 1)),
      sol: 'Tangential $k_x = n_1k_0\\sin\\theta$ is fixed, so in air $k_z^2 = k_0^2 - k_x^2 = -k_0^2(n_1^2\\sin^2\\theta - 1)$ and $\\kappa = k_0\\sqrt{n_1^2\\sin^2\\theta - 1} = \\frac{2\\pi}{633}\\sqrt{1.125 - 1}$. Then $1/\\kappa = \\dfrac{633}{2\\pi\\times0.354} = 285$ nm. The intensity falls to $1/e$ in half that depth.',
      trap: 'Field versus intensity depth differ by a factor 2.' },
    { id: 'frs-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'Light polarised perpendicular to the plane of incidence (s) falls from air on glass ($n = 1.5$) at $60^\\circ$. The reflectance $R_s$ is ______ (to three decimal places).',
      answer: 0.177, tol: 0.002, calc: () => fres(1, 1.5, 60).rs ** 2,
      sol: '$\\sin\\theta_t = \\sin60^\\circ/1.5 = 0.577$, $\\theta_t = 35.3^\\circ$, $\\cos\\theta_t = 0.816$. $r_s = \\dfrac{0.5 - 1.5\\times0.816}{0.5 + 1.5\\times0.816} = \\dfrac{-0.725}{1.725} = -0.420$, so $R_s = 0.177$.',
      trap: 'Using the normal-incidence 4% at all angles: $R_s$ rises steadily with angle.' },
    { id: 'frs-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'Light polarised in the plane of incidence (p) falls from air on glass ($n = 1.5$) at $30^\\circ$. The reflectance $R_p$, in percent, is ______ (to two decimal places).',
      answer: 2.52, tol: 0.03, unit: '%', calc: () => 100 * fres(1, 1.5, 30).rp ** 2,
      sol: '$\\sin\\theta_t = 0.5/1.5$, $\\cos\\theta_t = 0.943$. $r_p = \\dfrac{n_2\\cos\\theta_i - n_1\\cos\\theta_t}{n_2\\cos\\theta_i + n_1\\cos\\theta_t} = \\dfrac{1.299 - 0.943}{1.299 + 0.943} = 0.159$, so $R_p = 0.0252$: already below the 4% of normal incidence, on its way to zero at $56.3^\\circ$.',
      trap: 'Crossing the indices wrongly (the s form) gives 5.8%.' },
    { id: 'frs-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'For light going from air into glass ($n = 1.5$), how does the p reflectance $R_p$ vary as the angle of incidence goes from $0^\\circ$ to $90^\\circ$?',
      options: ['It rises steadily from 4% to 100%', 'It stays at 4% and then jumps to 100% at the critical angle', 'It falls from 4% to zero near $56^\\circ$, then rises to 100% at grazing incidence', 'It is zero at normal incidence and 4% at grazing'], answer: 2,
      sol: 'At $0^\\circ$ both polarisations give 4%. $R_p$ falls to zero at $\\theta_B = 56.3^\\circ$ and then climbs to 1 at grazing incidence. $R_s$ rises steadily from 4% to 100%. There is no critical angle going into the denser medium.',
      trap: 'The steady rise is the s curve.' },
    { id: 'frs-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'Unpolarised light falls from air on glass at the Brewster angle. Which statements are true?',
      options: ['The reflected light is completely s-polarised', 'The transmitted light is partially polarised', '$\\theta_i + \\theta_t = 90^\\circ$', 'The s reflectance is zero'], answer: [0, 1, 2],
      sol: 'At $\\theta_B$: $r_p = 0$, so the reflected beam is pure s. The transmitted beam has all the p light and $1 - R_s$ of the s light, so it is only partly polarised (a pile of plates improves it). $\\tan\\theta_B = n_2/n_1$ gives $\\theta_i + \\theta_t = 90^\\circ$. $R_s$ is not zero (about 15% for $n = 1.5$).',
      trap: 's and p are easy to swap: at Brewster it is p that vanishes from the reflection.' },
    { id: 'frs-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polarisation by reflection',
      q: 'Unpolarised light is reflected from glass ($n = 1.5$) at $70^\\circ$ incidence. The degree of polarisation $\\dfrac{R_s - R_p}{R_s + R_p}$ of the reflected light is ______ (to two decimal places).',
      answer: 0.75, tol: 0.01, calc: () => { const f = fres(1, 1.5, 70); return (f.rs ** 2 - f.rp ** 2) / (f.rs ** 2 + f.rp ** 2); },
      sol: '$\\cos70^\\circ = 0.342$; $\\sin\\theta_t = 0.940/1.5 = 0.626$, $\\cos\\theta_t = 0.779$. $r_s = \\dfrac{0.342 - 1.169}{0.342 + 1.169} = -0.547$, $R_s = 0.300$. $r_p = \\dfrac{0.513 - 0.779}{0.513 + 0.779} = -0.206$, $R_p = 0.042$. So $P = \\dfrac{0.258}{0.342} = 0.75$.',
      trap: 'Past the Brewster angle $r_p$ changes sign, but $R_p$ is positive again.' },
    { id: 'frs-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'Under total internal reflection, the phase difference between the reflected s and p components',
      options: ['is constant at $90^\\circ$ for all angles beyond critical', 'is zero at the critical angle and at grazing incidence, with a maximum in between', 'grows steadily from zero at critical to $180^\\circ$ at grazing', 'is always zero'], answer: 1,
      sol: '$\\tan\\dfrac{\\Delta}{2} = \\dfrac{\\cos\\theta\\sqrt{\\sin^2\\theta - n^2}}{\\sin^2\\theta}$ with $n = n_2/n_1$. It vanishes at $\\sin\\theta = n$ and at $\\theta = 90^\\circ$, with a maximum $\\tan(\\Delta_{\\max}/2) = \\dfrac{1 - n^2}{2n}$ in between: about $45^\\circ$ for glass.',
      trap: 'Each component alone has a phase that grows from 0 to $180^\\circ$; their difference does not.' },
    { id: 'frs-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'Light is totally reflected inside glass ($n = 1.5$) at a glass-air face at $60^\\circ$ incidence. Using $\\tan\\dfrac{\\Delta}{2} = \\dfrac{\\cos\\theta\\sqrt{\\sin^2\\theta - n^2}}{\\sin^2\\theta}$ with $n = 1/1.5$, the phase difference $\\Delta$ between s and p is ______ degrees (to one decimal place).',
      answer: 40.5, tol: 0.15, unit: '°', calc: () => tirDelta(60, 1 / 1.5),
      sol: '$\\sin^2 60^\\circ = 0.75$, $n^2 = 0.444$, $\\sqrt{0.75 - 0.444} = 0.553$. $\\tan(\\Delta/2) = \\dfrac{0.5\\times0.553}{0.75} = 0.369$, so $\\Delta/2 = 20.23^\\circ$ and $\\Delta = 40.5^\\circ$.',
      trap: 'Forgetting to double the half-angle.' },
    { id: 'frs-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'metals',
      q: 'A metal has complex refractive index $\\tilde n = n + i\\kappa$. Its normal-incidence reflectance from air is',
      options: ['$\\dfrac{(n - 1)^2 - \\kappa^2}{(n + 1)^2 - \\kappa^2}$', '$\\left(\\dfrac{n - 1}{n + 1}\\right)^2$', '$\\dfrac{\\kappa^2}{(n + 1)^2}$', '$\\dfrac{(n - 1)^2 + \\kappa^2}{(n + 1)^2 + \\kappa^2}$'], answer: 3,
      sol: '$r = \\dfrac{1 - \\tilde n}{1 + \\tilde n}$, so $R = |r|^2 = \\dfrac{(1 - n)^2 + \\kappa^2}{(1 + n)^2 + \\kappa^2}$. A large $\\kappa$ drives $R$ towards 1, whatever $n$ is.',
      trap: 'Ignoring $\\kappa$ makes silver ($n \\approx 0.06$) look like a good antireflection surface.' },
    { id: 'frs-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'metals',
      q: 'At 600 nm, silver has $\\tilde n \\approx 0.06 + 4.0i$. Its reflectance at normal incidence is ______ (to three decimal places).',
      answer: 0.986, tol: 0.002, calc: () => (0.94 ** 2 + 16) / (1.06 ** 2 + 16),
      sol: '$R = \\dfrac{(0.06 - 1)^2 + 4.0^2}{(0.06 + 1)^2 + 4.0^2} = \\dfrac{0.884 + 16}{1.124 + 16} = \\dfrac{16.884}{17.124} = 0.986$.',
      trap: 'The small real part does not make silver transparent; the large imaginary part makes it a mirror.' },
    { id: 'frs-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'antireflection coating',
      q: 'Glass ($n = 1.52$) carries a quarter-wave layer of MgF$_2$ ($n = 1.38$). At the design wavelength and normal incidence from air, the reflectance is ______ % (to two decimal places).',
      answer: 1.26, tol: 0.02, unit: '%', calc: () => 100 * ((1.52 - 1.38 ** 2) / (1.52 + 1.38 ** 2)) ** 2,
      sol: 'A quarter-wave layer transforms the load: the glass looks like an index $n_c^2/n_g$. So $r = \\dfrac{n_0n_g - n_c^2}{n_0n_g + n_c^2} = \\dfrac{1.52 - 1.904}{1.52 + 1.904} = -0.112$ and $R = 1.26\\%$, down from 4.3% for bare glass.',
      trap: 'MgF$_2$ is not the ideal $\\sqrt{1.52} = 1.23$, so the reflection is reduced, not removed.' },
    { id: 'frs-029', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'For reflection from air onto a non-magnetic glass surface, which statements are true?',
      options: ['$r_p$ changes sign as the angle passes through $\\theta_B$', '$r_s$ is never zero', 'At grazing incidence both $|r_s|$ and $|r_p|$ tend to 1', 'At normal incidence $R_s \\ne R_p$'], answer: [0, 1, 2],
      sol: '$r_p \\propto \\tan(\\theta_i - \\theta_t)/\\tan(\\theta_i + \\theta_t)$ passes through zero when $\\theta_i + \\theta_t = 90^\\circ$, changing sign. $r_s = -\\sin(\\theta_i - \\theta_t)/\\sin(\\theta_i + \\theta_t)$ vanishes only if $\\theta_i = \\theta_t$, i.e. equal indices. At grazing incidence $\\cos\\theta_i \\to 0$ and both tend to magnitude 1. At normal incidence s and p cannot be told apart, so $R_s = R_p$.',
      trap: 'For non-magnetic media only p has a Brewster angle.' },
    { id: 'frs-038', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic media',
      q: 'A ferrite tile has $\\epsilon_r = 12$ and $\\mu_r = 3$ (lossless at the frequency used). A plane wave in air meets it at normal incidence. The power reflectance is ______ (to three decimal places).',
      answer: 0.111, tol: 0.002, calc: () => ((0.5 - 1) / 1.5) ** 2,
      sol: '$\\eta_2 = \\eta_0\\sqrt{\\mu_r/\\epsilon_r} = \\eta_0/2$. Then $r = \\dfrac{\\eta_2 - \\eta_0}{\\eta_2 + \\eta_0} = \\dfrac{-0.5}{1.5} = -\\tfrac13$ and $R = 0.111$. The index $\\sqrt{36} = 6$ would wrongly give $(5/7)^2 = 0.51$.',
      trap: 'For magnetic media, use impedances, not $(n_1 - n_2)/(n_1 + n_2)$.' },

    // ---------- level 4 ----------
    { id: 'frs-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pile of plates',
      q: 'Each surface of a glass plate reflects a fraction $R = 0.04$ (normal incidence, no absorption). Light passes through a stack of 4 separated plates. Adding all multiple reflections incoherently, the total transmitted fraction is ______ (to two decimal places).',
      answer: 0.75, tol: 0.005, calc: () => 0.96 / (1 + 7 * 0.04),
      sol: 'For $m$ identical, non-absorbing surfaces with incoherent multiple reflections, $T = \\dfrac{1 - R}{1 + (m - 1)R}$ (check $m = 1$: $T = 1 - R$; it follows by combining surfaces with $T_{12} = T_1T_2/(1 - R_1R_2)$). Four plates give $m = 8$: $T = \\dfrac{0.96}{1 + 7\\times0.04} = 0.75$. Ignoring multiple reflections would give $0.96^8 = 0.72$.',
      trap: 'Four plates have eight surfaces.' },
    { id: 'frs-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'evanescent wave',
      q: 'In an optical fibre, light of vacuum wavelength 1.55 $\\mu$m in the core ($n_1 = 1.47$) meets the cladding ($n_2 = 1.46$) at $85^\\circ$ incidence. The $1/e$ penetration depth of the evanescent field into the cladding is ______ $\\mu$m (to two decimal places).',
      answer: 2.17, tol: 0.02, unit: 'μm', calc: () => 1.55 / (2 * Math.PI * Math.sqrt(1.47 ** 2 * Math.sin(85 * D) ** 2 - 1.46 ** 2)),
      sol: '$\\kappa = k_0\\sqrt{n_1^2\\sin^2\\theta - n_2^2} = \\dfrac{2\\pi}{1.55}\\sqrt{2.1609\\times0.99240 - 2.1316} = \\dfrac{2\\pi}{1.55}\\times0.1135$. So $1/\\kappa = 2.17\\ \\mu$m, more than a wavelength: the cladding must be thick, and a bend that brings anything close couples light out.',
      trap: 'Close to the critical angle the evanescent field reaches far; it diverges at $\\theta_c$.' },
    { id: 'frs-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'For light going from a denser medium into a rarer one, the internal Brewster angle $\\theta_B$ and the critical angle $\\theta_c$ always satisfy',
      options: ['$\\theta_B > \\theta_c$', '$\\theta_B = \\theta_c$', '$\\theta_B < \\theta_c$', 'either order, depending on the indices'], answer: 2,
      sol: '$\\tan\\theta_B = n_2/n_1 = \\sin\\theta_c$. For any angle in $(0, 90^\\circ)$, $\\tan x > \\sin x$, so $\\tan\\theta_B = \\sin\\theta_c < \\tan\\theta_c$, giving $\\theta_B < \\theta_c$. The Brewster angle must lie in the range where a transmitted ray exists.',
      trap: 'Both formulas contain $n_2/n_1$; one with $\\tan$, the other with $\\sin$.' },
    { id: 'frs-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'For total internal reflection inside glass of index 1.5 against air, the largest possible phase difference between the s and p components after one reflection is ______ degrees (to one decimal place).',
      answer: 45.2, tol: 0.15, unit: '°', calc: () => 2 * deg(Math.atan((1 - 1 / 2.25) / (2 / 1.5))),
      sol: 'Maximising $\\tan\\frac{\\Delta}{2} = \\frac{\\cos\\theta\\sqrt{\\sin^2\\theta - n^2}}{\\sin^2\\theta}$ over $\\theta$ gives $\\sin^2\\theta = \\frac{2n^2}{1 + n^2}$ and $\\tan\\frac{\\Delta_{\\max}}{2} = \\frac{1 - n^2}{2n}$. With $n = 2/3$: $\\frac{1 - 4/9}{4/3} = 0.4167$, $\\Delta_{\\max}/2 = 22.6^\\circ$, $\\Delta_{\\max} = 45.2^\\circ$. Just enough for a Fresnel rhomb (two reflections of $45^\\circ$ each).',
      trap: 'A single TIR cannot give a quarter-wave ($90^\\circ$) shift in ordinary glass; a rhomb uses two.' },
    { id: 'frs-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'A parallel-sided glass plate is tilted so that light from air strikes it at the Brewster angle, as in a laser\'s Brewster window. Which statements are true?',
      options: ['Inside the plate the light reaches the second face at the internal Brewster angle', 'p-polarised light passes both faces with no reflection loss', 's-polarised light loses some power at each face', 'The window works for any wavelength because the index does not depend on wavelength'], answer: [0, 1, 2],
      sol: 'The refraction angle at the first face is $90^\\circ - \\theta_B$, and $\\tan(90^\\circ - \\theta_B) = n_1/n_2$, the internal Brewster condition. So p light suffers no loss at either face, while s light reflects about 15% per face for $n = 1.5$. In a laser this extra loss stops s from lasing, so the output is p-polarised. Dispersion makes $\\theta_B$ shift slightly with wavelength.',
      trap: 'A Brewster window favours p, not s.' },
    { id: 'frs-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'As the angle of incidence on glass approaches $90^\\circ$ (grazing), the s reflection coefficient $r_s$ tends to',
      options: ['$0$', '$+1$', '$-1$, so the incident and reflected fields cancel at the surface', '$-0.2$, as at normal incidence'], answer: 2,
      sol: 'With $\\cos\\theta_i \\to 0$: $r_s = \\frac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t} \\to -1$. The tangential field at the surface vanishes, which is why Lloyd\'s mirror shows a dark fringe where the mirror meets the screen.',
      trap: 'Near-grazing reflection is almost total and with a sign change.' },
    { id: 'frs-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Brewster angle',
      q: 'A 10.0 mW s-polarised beam falls from air on glass of index 1.70 at the Brewster angle. The reflected power is ______ mW (to two decimal places).',
      answer: 2.36, tol: 0.02, unit: 'mW', calc: () => 10 * ((1.7 ** 2 - 1) / (1.7 ** 2 + 1)) ** 2,
      sol: 'At Brewster, $\\theta_t = 90^\\circ - \\theta_B$, so $r_s = -\\frac{\\sin(\\theta_B - \\theta_t)}{\\sin(\\theta_B + \\theta_t)} = -\\sin(2\\theta_B - 90^\\circ) = \\cos2\\theta_B = \\frac{1 - \\tan^2\\theta_B}{1 + \\tan^2\\theta_B}$. With $\\tan\\theta_B = n$: $|r_s| = \\dfrac{n^2 - 1}{n^2 + 1} = \\dfrac{1.89}{3.89} = 0.486$. Reflected power $= 10\\times0.486^2 = 2.36$ mW.',
      trap: 'Only p vanishes at Brewster; an s beam reflects more strongly than at normal incidence.' },
    { id: 'frs-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Stokes relations',
      q: 'Stokes derived $r\' = -r$ and $tt\' = 1 - r^2$ for an interface (primes: light coming from the other side). His argument rests on',
      options: ['energy conservation alone', 'time-reversal invariance of the lossless wave equations', 'the Brewster condition', 'the existence of an evanescent wave'], answer: 1,
      sol: 'Reverse the reflected ($r$) and transmitted ($t$) rays. Together they must rebuild only the reversed incident ray: on side 1, $r\\cdot r + t\\cdot t\' = 1$; on side 2, $r\\cdot t + t\\cdot r\' = 0$. This works only without absorption, because time reversal of a lossy process is not a solution.',
      trap: 'Energy conservation gives $R + T = 1$ but not the sign relation $r\' = -r$.' },
    { id: 'frs-039', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'evanescent wave',
      q: 'For the evanescent wave beyond a totally reflecting surface (in the $xy$ plane, incidence in the $xz$ plane), which statements are true?',
      options: ['Its amplitude decays exponentially with distance $z$ from the surface', 'Its phase travels along the surface with $k_x = n_1k_0\\sin\\theta$', 'For p polarisation it has an electric field component along its direction of travel', 'It carries a non-zero time-averaged energy flux away from the surface'], answer: [0, 1, 2],
      sol: 'In medium 2, $e^{i(k_xx - \\omega t)}e^{-\\kappa z}$ with $k_x = n_1k_0\\sin\\theta > n_2k_0$. Since $\\nabla\\cdot\\vec E = 0$ needs $ik_xE_x - \\kappa E_z = 0$ for p light, $E_x$ (along the travel direction) cannot vanish: the wave is not transverse. The $z$ component of the Poynting vector is $90^\\circ$ out of phase and averages to zero (unless a second surface is near: frustrated TIR).',
      trap: 'Energy flows along the surface, not away from it.' },

    // ---------- level 5 ----------
    { id: 'frs-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: 'A Fresnel rhomb of glass with $n = 1.51$ turns linear light at $45^\\circ$ into circular light with two total internal reflections, each giving a $45^\\circ$ s-p phase difference. Two angles of incidence work. The larger one is ______ degrees (to one decimal place).',
      answer: 54.6, tol: 0.15, unit: '°', calc: () => rhombAngle(1.51),
      sol: 'Solve $\\tan22.5^\\circ = 0.4142 = \\dfrac{\\cos\\theta\\sqrt{\\sin^2\\theta - n^2}}{\\sin^2\\theta}$ with $n^2 = 1/1.51^2 = 0.4386$. Squaring, with $s = \\sin^2\\theta$: $0.1716\\,s^2 = (1 - s)(s - 0.4386)$, i.e. $1.1716s^2 - 1.4386s + 0.4386 = 0$, so $s = 0.6633$ or $0.5645$. The larger root gives $\\theta = 54.6^\\circ$ (the smaller $48.6^\\circ$). Fresnel chose the larger one, where $\\Delta$ changes more slowly with angle.',
      trap: 'Both roots must exceed the critical angle ($41.5^\\circ$) for TIR; here both do.' },
    { id: 'frs-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'magnetic media',
      q: 'Two media have equal permittivities but different permeabilities ($\\mu_1 \\ne \\mu_2$). Which polarisation, if any, shows a Brewster angle (zero reflection) at this interface?',
      options: ['p (E in the plane of incidence) only', 'both s and p', 'neither', 's (E perpendicular to the plane of incidence) only'], answer: 3,
      sol: 'Maxwell\'s equations are symmetric under $\\vec E \\to \\vec H$, $\\epsilon \\leftrightarrow \\mu$, which swaps the roles of s and p. For non-magnetic media ($\\mu$ equal, $\\epsilon$ different) only p has a Brewster angle; so for equal $\\epsilon$ and different $\\mu$, only s does.',
      trap: 'The usual "only p" rule assumes $\\mu_1 = \\mu_2$.' },
    { id: 'frs-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'evanescent wave',
      q: 'Light inside glass ($n = 1.50$) is totally reflected at a glass-air face. At what angle of incidence does the $1/e$ field penetration depth of the evanescent wave equal the vacuum wavelength? (degrees, to two decimal places)',
      answer: 42.46, tol: 0.05, unit: '°', calc: () => deg(Math.asin(Math.sqrt((1 + 1 / (4 * Math.PI ** 2)) / 2.25))),
      sol: 'Depth $= \\dfrac{\\lambda_0}{2\\pi\\sqrt{n_1^2\\sin^2\\theta - 1}} = \\lambda_0$ needs $n_1^2\\sin^2\\theta = 1 + \\dfrac{1}{4\\pi^2} = 1.0253$. So $\\sin\\theta = \\sqrt{1.0253/2.25} = 0.6751$ and $\\theta = 42.46^\\circ$, only $0.65^\\circ$ above the critical angle $41.81^\\circ$. The depth falls quickly as the angle grows.',
      trap: 'Penetration of a wavelength or more happens only just past the critical angle.' },
    { id: 'frs-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'antireflection coating',
      q: 'A MgF$_2$ coating ($n = 1.38$) on glass ($n = 1.52$) is a quarter wave thick at 550 nm. Using $r = \\dfrac{r_{12} + r_{23}e^{2i\\delta}}{1 + r_{12}r_{23}e^{2i\\delta}}$ with $\\delta = 2\\pi n_cd/\\lambda$, find the normal-incidence reflectance at 450 nm, in percent (to two decimal places).',
      answer: 1.62, tol: 0.03, unit: '%', calc: () => 100 * arR(1, 1.38, 1.52, 550 / (4 * 1.38), 450),
      sol: '$d = 550/(4\\times1.38) = 99.6$ nm, $\\delta = 2\\pi\\times1.38\\times99.6/450 = 1.920$ rad, so $2\\delta = 3.840$ rad. $r_{12} = (1 - 1.38)/2.38 = -0.1597$, $r_{23} = (1.38 - 1.52)/2.90 = -0.0483$. Numerator: $-0.1597 - 0.0483(\\cos3.840 + i\\sin3.840) = -0.1597 + 0.0371 + 0.0309i = -0.1226 + 0.0309i$. Denominator: $1 + 0.00771(-0.768 - 0.640i) = 0.9941 - 0.0049i$. $R = \\dfrac{0.01503 + 0.00095}{0.9883} = 0.0162$, i.e. 1.62% (against 1.26% at 550 nm): the coating is bluish-purple in reflection because it fails most at the ends of the spectrum.',
      trap: 'At other wavelengths the two reflections no longer arrive half a wave apart.' },
    { id: 'frs-044', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      q: 'For non-magnetic media, which of these forms of the Fresnel coefficients (with Snell\'s law used to remove the indices) are correct?',
      options: ['$r_s = -\\dfrac{\\sin(\\theta_i - \\theta_t)}{\\sin(\\theta_i + \\theta_t)}$', '$|r_p| = \\left|\\dfrac{\\tan(\\theta_i - \\theta_t)}{\\tan(\\theta_i + \\theta_t)}\\right|$', '$t_s = \\dfrac{2\\sin\\theta_t\\cos\\theta_i}{\\sin(\\theta_i + \\theta_t)}$', '$|r_p| = 0$ when $\\theta_i + \\theta_t = \\pi$'], answer: [0, 1, 2],
      sol: 'Put $n_2/n_1 = \\sin\\theta_i/\\sin\\theta_t$ into $r_s = \\frac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}$: numerator $\\propto \\sin\\theta_t\\cos\\theta_i - \\sin\\theta_i\\cos\\theta_t = -\\sin(\\theta_i - \\theta_t)$, denominator $\\sin(\\theta_i + \\theta_t)$. The same steps give $t_s$ and $|r_p| = |\\tan(\\theta_i - \\theta_t)/\\tan(\\theta_i + \\theta_t)|$, which is zero when $\\tan(\\theta_i + \\theta_t)$ is infinite, i.e. $\\theta_i + \\theta_t = \\pi/2$, not $\\pi$.',
      trap: 'The sign of $r_p$ depends on the book\'s convention; its magnitude does not.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'frs-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'total internal reflection',
      make(r) {
        const pairs = [['glass', 1.5, 'air', 1], ['diamond', 2.42, 'air', 1], ['glass', 1.52, 'water', 1.33], ['sapphire', 1.77, 'air', 1], ['flint glass', 1.65, 'water', 1.33], ['a fibre core', 1.48, 'cladding', 1.46], ['ice', 1.31, 'air', 1]];
        const [a, n1, b, n2] = choose(r, pairs), th = deg(Math.asin(n2 / n1)), answer = round(th, 2);
        return { q: `Find the critical angle for light going from ${a} ($n = ${n1}$) into ${b} ($n = ${n2}$), in degrees.`,
          answer, tol: 0.05, unit: '°', n1, n2,
          sol: `$\\sin\\theta_c = n_2/n_1 = ${n2}/${n1} = ${(n2 / n1).toFixed(4)}$, so $\\theta_c = ${answer}^\\circ$.`,
          trap: 'Put the smaller index on top.' };
      },
      verify: (p) => deg(Math.atan(p.n2 / Math.sqrt(p.n1 ** 2 - p.n2 ** 2))) },
    { id: 'frs-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Brewster angle',
      make(r) {
        const ns = [1, 1.33, 1.46, 1.5, 1.62, 1.75, 2.0, 2.42], i = int(r, 0, 7); let j = int(r, 0, 6); if (j >= i) j++;
        const n1 = ns[i], n2 = ns[j], th = deg(Math.atan(n2 / n1)), answer = round(th, 2);
        return { q: `Find the Brewster angle for light going from a medium of index ${n1} into one of index ${n2}, in degrees.`,
          answer, tol: 0.05, unit: '°', n1, n2,
          sol: `$\\tan\\theta_B = n_2/n_1 = ${n2}/${n1}$, so $\\theta_B = ${answer}^\\circ$. ${n2 < n1 ? 'This is internal reflection, so $\\theta_B$ is below $45^\\circ$ and below the critical angle.' : 'The refracted ray makes $90^\\circ - \\theta_B$ with the normal.'}`,
          trap: 'Brewster uses $\\tan$; the critical angle uses $\\sin$.' };
      },
      verify: (p) => 90 - deg(Math.atan(p.n1 / p.n2)) },
    { id: 'frs-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fresnel coefficients',
      make(r) {
        const n = choose(r, [1.33, 1.45, 1.5, 1.6, 1.7, 2.0, 2.4]), th = choose(r, [15, 20, 30, 40, 45, 50, 60, 65, 75, 80]), pol = choose(r, ['s', 'p']);
        const f = fres(1, n, th), R = (pol === 's' ? f.rs : f.rp) ** 2, answer = round(100 * R, 3);
        return { q: `Light polarised ${pol === 's' ? 'perpendicular to' : 'in'} the plane of incidence (${pol}) falls from air on a dielectric of index ${n} at $${th}^\\circ$. Find the reflectance $R_${pol}$ in percent.`,
          answer, tol: Math.max(0.005, answer * 0.01), unit: '%', n, th, pol,
          sol: `$\\sin\\theta_t = \\sin${th}^\\circ/${n}$, $\\cos\\theta_t = ${f.ct.toFixed(4)}$, $\\cos\\theta_i = ${f.ci.toFixed(4)}$. ${pol === 's' ? `$r_s = \\dfrac{\\cos\\theta_i - ${n}\\cos\\theta_t}{\\cos\\theta_i + ${n}\\cos\\theta_t} = ${f.rs.toFixed(4)}$` : `$r_p = \\dfrac{${n}\\cos\\theta_i - \\cos\\theta_t}{${n}\\cos\\theta_i + \\cos\\theta_t} = ${f.rp.toFixed(4)}$`}, so $R_${pol} = ${answer}\\%$.`,
          trap: pol === 's' ? 'For s, each index goes with the cosine in its own medium.' : 'For p, the indices pair with the other medium\'s cosine; $R_p$ vanishes at Brewster.' };
      },
      verify: (p) => { const ti = p.th * D, tt = Math.asin(Math.sin(ti) / p.n); return 100 * (p.pol === 's' ? (Math.sin(ti - tt) / Math.sin(ti + tt)) ** 2 : (Math.tan(ti - tt) / Math.tan(ti + tt)) ** 2); } },
    { id: 'frs-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'transmittance',
      make(r) {
        const n = choose(r, [1.33, 1.5, 1.6, 2.0, 2.4]), th = choose(r, [0, 20, 30, 45, 60, 70]), pol = choose(r, ['s', 'p']), from = choose(r, ['air', 'inside']);
        const [n1, n2] = from === 'air' ? [1, n] : [n, 1];
        const thUse = from === 'air' ? th : Math.min(th, Math.floor(deg(Math.asin(1 / n))) - 3);
        const f = fres(n1, n2, thUse), t = pol === 's' ? f.ts : f.tp, answer = round(t, 4);
        return { q: `Light (${pol} polarisation) goes from a medium of index ${n1} into one of index ${n2} at $${thUse}^\\circ$ incidence. Find the amplitude transmission coefficient $t_${pol} = E_t/E_i$.`,
          answer, tol: 0.002, n1, n2, th: thUse, pol,
          sol: `$\\cos\\theta_i = ${f.ci.toFixed(4)}$, $\\cos\\theta_t = ${f.ct.toFixed(4)}$. ${pol === 's' ? `$t_s = \\dfrac{2n_1\\cos\\theta_i}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}$` : `$t_p = \\dfrac{2n_1\\cos\\theta_i}{n_2\\cos\\theta_i + n_1\\cos\\theta_t}$`} $= ${answer}$. ${t > 1 ? 'It exceeds 1, which is fine: the transmittance $\\frac{n_2\\cos\\theta_t}{n_1\\cos\\theta_i}|t|^2$ is still below 1.' : ''}`,
          trap: 'An amplitude coefficient above 1 is allowed going into a rarer medium.' };
      },
      verify: (p) => { const ti = p.th * D, tt = Math.asin((p.n1 * Math.sin(ti)) / p.n2); if (p.th === 0) return (2 * p.n1) / (p.n1 + p.n2); return p.pol === 's' ? (2 * Math.sin(tt) * Math.cos(ti)) / Math.sin(ti + tt) : (2 * Math.sin(tt) * Math.cos(ti)) / (Math.sin(ti + tt) * Math.cos(ti - tt)); } },
    { id: 'frs-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'evanescent wave',
      make(r) {
        const n1 = choose(r, [1.45, 1.5, 1.52, 1.7, 2.0]), n2 = choose(r, [1, 1.33]), lam = choose(r, [400, 500, 633, 800, 1064]);
        const thc = deg(Math.asin(n2 / n1)), th = Math.ceil(thc) + int(r, 2, 30); const thU = Math.min(th, 85);
        const d = lam / (2 * Math.PI * Math.sqrt((n1 * Math.sin(thU * D)) ** 2 - n2 * n2)), answer = round(d, 1);
        return { q: `Light of vacuum wavelength ${lam} nm is totally reflected in a medium of index ${n1} against one of index ${n2}, at $${thU}^\\circ$ incidence. Find the depth (nm) at which the evanescent field amplitude has fallen to $1/e$.`,
          answer, tol: Math.max(0.2, d * 0.01), unit: 'nm', n1, n2, lam, th: thU,
          sol: `$\\kappa = \\dfrac{2\\pi}{\\lambda_0}\\sqrt{n_1^2\\sin^2\\theta - n_2^2} = \\dfrac{2\\pi}{${lam}}\\sqrt{${((n1 * Math.sin(thU * D)) ** 2).toFixed(4)} - ${round(n2 * n2, 4)}}$ nm$^{-1}$, so the depth is $1/\\kappa \\approx ${answer}$ nm.`,
          trap: 'The square root contains $n_2^2$, not $1$, when the outer medium is not air.' };
      },
      verify: (p) => p.lam / (2 * Math.PI * Math.sqrt((p.n1 * Math.sin(p.th * D) - p.n2) * (p.n1 * Math.sin(p.th * D) + p.n2))) },
    { id: 'frs-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'total internal reflection',
      make(r) {
        const n1 = choose(r, [1.5, 1.6, 1.7, 2.0, 2.42]), thc = deg(Math.asin(1 / n1)), th = Math.ceil(thc) + int(r, 1, 40); const thU = Math.min(th, 88);
        const del = tirDelta(thU, 1 / n1), answer = round(del, 2);
        return { q: `Light is totally reflected inside a medium of index ${n1} at its boundary with air, at $${thU}^\\circ$ incidence. Find the phase difference between the reflected s and p components, in degrees.`,
          answer, tol: 0.1, unit: '°', n1, th: thU,
          sol: `With $n = 1/${n1}$: $\\tan\\dfrac{\\Delta}{2} = \\dfrac{\\cos\\theta\\sqrt{\\sin^2\\theta - n^2}}{\\sin^2\\theta} = ${Math.tan((del / 2) * D).toFixed(4)}$, so $\\Delta = ${answer}^\\circ$.`,
          trap: 'Remember to double the half-angle.' };
      },
      verify: (p) => { // from the separate phases: tan(phi_s/2) = sqrt(s^2-n^2)/cos, tan(phi_p/2) = sqrt(s^2-n^2)/(n^2 cos)
        const s = Math.sin(p.th * D), c = Math.cos(p.th * D), n = 1 / p.n1, q = Math.sqrt(s * s - n * n);
        return Math.abs(2 * Math.atan(q / (n * n * c)) - 2 * Math.atan(q / c)) / D; } },
    { id: 'frs-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'antireflection coating',
      make(r) {
        const ng = choose(r, [1.46, 1.5, 1.52, 1.6, 1.7, 1.8]), nc = choose(r, [1.23, 1.3, 1.38, 1.45]), lam = choose(r, [500, 550, 600, 633]);
        const ask = choose(r, ['thickness', 'reflectance']);
        const val = ask === 'thickness' ? lam / (4 * nc) : 100 * ((ng - nc * nc) / (ng + nc * nc)) ** 2;
        const answer = round(val, ask === 'thickness' ? 1 : 3);
        return { q: ask === 'thickness' ? `Find the thinnest coating of index ${nc} that gives minimum reflection at ${lam} nm on glass of index ${ng} (in nm).` : `Glass of index ${ng} carries a quarter-wave layer of index ${nc}. Find the normal-incidence reflectance from air at the design wavelength, in percent.`,
          answer, tol: ask === 'thickness' ? 0.3 : Math.max(0.003, val * 0.01), unit: ask === 'thickness' ? 'nm' : '%', ng, nc, lam, ask,
          sol: ask === 'thickness' ? `Optical thickness $\\lambda/4$: $d = \\dfrac{${lam}}{4\\times${nc}} = ${answer}$ nm (the index ${nc} sits between 1 and ${ng}, so both reflections suffer the same phase change and the quarter wave makes them cancel).` : `A quarter-wave layer makes the substrate look like index $n_c^2/n_g$: $R = \\left(\\dfrac{n_g - n_c^2}{n_g + n_c^2}\\right)^2 = \\left(\\dfrac{${ng} - ${(nc * nc).toFixed(4)}}{${ng} + ${(nc * nc).toFixed(4)}}\\right)^2 = ${answer}\\%$.`,
          trap: 'Perfect cancellation needs $n_c = \\sqrt{n_g}$.' };
      },
      verify: (p) => (p.ask === 'thickness' ? p.lam / (4 * p.nc) : 100 * arR(1, p.nc, p.ng, p.lam / (4 * p.nc), p.lam)) },
    { id: 'frs-g08', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brewster angle',
      make(r) {
        const n1 = choose(r, [1, 1.33, 1.5, 1.6]), n2 = choose(r, [1, 1.33, 1.5, 1.7, 2.0].filter((x) => x !== n1)), kind = int(r, 0, 2);
        const thB = deg(Math.atan(n2 / n1)), thc = n1 > n2 ? deg(Math.asin(n2 / n1)) : 99;
        let th; if (kind === 0) th = thB; else if (kind === 1 && n1 > n2) th = Math.min(89, Math.ceil(thc) + 5); else th = Math.max(5, Math.round(thB) - 15);
        const right = Math.abs(th - thB) < 1e-9 ? 'the reflected light is completely s-polarised' : th > thc ? 'the light is totally reflected' : 'both polarisations are partly reflected';
        const o = mcqOptions(r, right, ['the reflected light is completely s-polarised', 'the light is totally reflected', 'both polarisations are partly reflected', 'neither polarisation is reflected']);
        const thTxt = Math.abs(th - thB) < 1e-9 ? `$\\tan^{-1}(${n2}/${n1}) = ${thB.toFixed(1)}^\\circ$` : `$${th}^\\circ$`;
        return { q: `Unpolarised light goes from index ${n1} towards index ${n2} with angle of incidence ${thTxt}. Then`, ...o,
          sol: `Brewster angle $\\tan^{-1}(${n2}/${n1}) = ${thB.toFixed(1)}^\\circ$; ${n1 > n2 ? `critical angle $\\sin^{-1}(${n2}/${n1}) = ${thc.toFixed(1)}^\\circ$` : 'no critical angle (going into the denser medium)'}. The given angle ${Math.abs(th - thB) < 1e-9 ? 'is the Brewster angle, so $r_p = 0$ and only s is reflected' : th > thc ? 'is beyond the critical angle, so both polarisations are totally reflected' : 'is neither, so both are partly reflected'}.`,
          trap: 'A single interface never reflects zero of both polarisations at once (unless the indices are equal).' };
      } },
    { id: 'frs-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'polarisation by reflection',
      make(r) {
        const n = choose(r, [1.33, 1.5, 1.6, 1.8, 2.4]), thB = deg(Math.atan(n)); let th = choose(r, [20, 30, 40, 45, 60, 70, 80]); if (Math.abs(th - thB) < 1.5) th += 5;
        const f = fres(1, n, th), Rs = f.rs ** 2, Rp = f.rp ** 2, P = (Rs - Rp) / (Rs + Rp), answer = round(P, 3);
        return { q: `Unpolarised light is reflected from a dielectric of index ${n} at $${th}^\\circ$ incidence (from air). Find the degree of polarisation $(R_s - R_p)/(R_s + R_p)$ of the reflected light.`,
          answer, tol: 0.005, n, th,
          sol: `$R_s = ${Rs.toFixed(4)}$ and $R_p = ${Rp.toFixed(4)}$ from the Fresnel formulas (with $\\cos\\theta_t = ${f.ct.toFixed(4)}$). So $P = \\dfrac{${(Rs - Rp).toFixed(4)}}{${(Rs + Rp).toFixed(4)}} = ${answer}$.`,
          trap: 'Polarisation is complete only at the Brewster angle.' };
      },
      verify: (p) => { const ti = p.th * D, tt = Math.asin(Math.sin(ti) / p.n), Rs = (Math.sin(ti - tt) / Math.sin(ti + tt)) ** 2, Rp = (Math.tan(ti - tt) / Math.tan(ti + tt)) ** 2; return (Rs - Rp) / (Rs + Rp); } },
    { id: 'frs-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'metals',
      make(r) {
        const n = choose(r, [0.05, 0.1, 0.2, 0.5, 1.0, 1.5, 2.5]), k = choose(r, [0.5, 1, 2, 3, 4, 5, 7]);
        const R = ((n - 1) ** 2 + k * k) / ((n + 1) ** 2 + k * k), answer = round(R, 4);
        return { q: `A metal has complex refractive index $${n} + ${k}i$ at some wavelength. Find its reflectance at normal incidence from air.`,
          answer, tol: 0.002, n, k,
          sol: `$R = \\dfrac{(n - 1)^2 + \\kappa^2}{(n + 1)^2 + \\kappa^2} = \\dfrac{${((n - 1) ** 2).toFixed(4)} + ${k * k}}{${((n + 1) ** 2).toFixed(4)} + ${k * k}} = ${answer}$.`,
          trap: 'The imaginary part $\\kappa$ adds to both numerator and denominator.' };
      },
      verify: (p) => { const re = 1 - p.n, im = -p.k, dr = 1 + p.n, di = p.k; return (re * re + im * im) / (dr * dr + di * di); } },
    { id: 'frs-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pile of plates',
      make(r) {
        const n = choose(r, [1.5, 1.6, 1.8, 2.0]), N = int(r, 1, 8), R = ((n - 1) / (n + 1)) ** 2, m = 2 * N;
        const T = (1 - R) / (1 + (m - 1) * R), answer = round(T, 4);
        return { q: `A stack of ${N} separated, non-absorbing plates of index ${n} is held normal to a beam. Adding multiple reflections incoherently, find the fraction of the power transmitted.`,
          answer, tol: 0.002, n, N,
          sol: `Each surface reflects $R = \\left(\\frac{${n} - 1}{${n} + 1}\\right)^2 = ${R.toFixed(4)}$. For $m = ${m}$ surfaces, $T = \\dfrac{1 - R}{1 + (m - 1)R} = \\dfrac{${(1 - R).toFixed(4)}}{1 + ${m - 1}\\times${R.toFixed(4)}} = ${answer}$.`,
          trap: 'Each plate has two surfaces.' };
      },
      verify: (p) => { const R = ((p.n - 1) / (p.n + 1)) ** 2; let T = 1, Rt = 0; for (let i = 0; i < 2 * p.N; i++) { const Tn = (T * (1 - R)) / (1 - Rt * R); Rt = Rt + (T * T * R) / (1 - Rt * R); T = Tn; } return T; } },
    { id: 'frs-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Brewster angle',
      make(r) {
        const thc = int(r, 25, 65), s = Math.sin(thc * D), thB = deg(Math.atan(s));
        const show = (v) => `$${v.toFixed(1)}^\\circ$`;
        const o = mcqOptions(r, thB, [deg(Math.atan(1 / s)), thc, 90 - thc, deg(Math.atan(s * s))], show);
        return { q: `The critical angle for light leaving a transparent block into air is $${thc}^\\circ$. The internal Brewster angle at the same surface is`, ...o,
          sol: `$\\sin\\theta_c = n_2/n_1 = \\sin${thc}^\\circ = ${s.toFixed(4)}$, and $\\tan\\theta_B = n_2/n_1$ too. So $\\theta_B = \\tan^{-1}(${s.toFixed(4)}) = ${thB.toFixed(1)}^\\circ$, below the critical angle as always.`,
          trap: 'The external Brewster angle is the complement of the internal one.' };
      } },
    ...more,
    ...r4.gens,
  ],
};
