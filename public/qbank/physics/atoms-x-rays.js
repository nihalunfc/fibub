// The Bohr atom, spectra and X-rays: Bohr's postulates and orbits (radius, speed, energy, frequency, magnetic
// moment), hydrogen-like ions, spectral series and the Rydberg formula, counting lines, reduced mass (deuterium,
// positronium, muonic atoms), recoil, Franck-Hertz, the correspondence principle, and X-rays: the continuous
// spectrum and its cut-off (Duane-Hunt), characteristic lines, Moseley's law and absorption edges.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const RY = 13.6;        // eV, as stated in the questions
const RH = 1.097e7;     // Rydberg constant, m^-1, as stated
const HC = 1240;        // eV nm
const lineNm = (Z, ni, nf) => 1e9 / (RH * Z * Z * (1 / (nf * nf) - 1 / (ni * ni)));

import * as Q5 from '../_util.js';
import more2 from './atoms-x-rays.more2.gen.js';
import r4 from './atoms-x-rays.r4.gen.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'atoms-x-rays',
  items: [
    // ---------- level 1 ----------
    { id: 'atx-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'bohr energies',
      q: 'In the Bohr model of hydrogen, with ground-state energy $-13.6$ eV, the energy of the electron in the $n = 2$ orbit is',
      options: ['$-13.6$ eV', '$-6.8$ eV', '$-1.51$ eV', '$-3.4$ eV'], answer: 3,
      sol: '$E_n = -13.6/n^2$ eV, so $E_2 = -13.6/4 = -3.4$ eV.',
      trap: '$-6.8$ eV divides by $n$ instead of $n^2$.' },
    { id: 'atx-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'hydrogen-like ions',
      q: 'The energy needed to remove the electron from a singly ionised helium ion, He$^+$, in its ground state is (hydrogen: $13.6$ eV)',
      options: ['$27.2$ eV', '$54.4$ eV', '$13.6$ eV', '$24.6$ eV'], answer: 1,
      sol: 'He$^+$ is hydrogen-like with $Z = 2$: $E_n = -13.6Z^2/n^2$ eV. Ground state $-13.6\\times4 = -54.4$ eV, so $54.4$ eV removes the electron.',
      trap: '$24.6$ eV is the first ionisation energy of neutral helium (two electrons, not hydrogen-like). $27.2$ eV scales with $Z$ instead of $Z^2$.' },
    { id: 'atx-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'spectral series',
      q: 'The lines of the Balmer series of hydrogen are produced by transitions that end on the level',
      options: ['$n = 2$', '$n = 1$', '$n = 3$', '$n = 4$'], answer: 0,
      sol: 'Lyman ends on $n = 1$ (ultraviolet), Balmer on $n = 2$ (mostly visible: $656$, $486$, $434$, $410$ nm, ...), Paschen on $n = 3$, Brackett on $n = 4$ (infrared).',
      trap: 'Balmer is the visible series, but it is not the lowest level; that is Lyman.' },
    { id: 'atx-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'bohr radii',
      q: 'The Bohr radius of hydrogen is $a_0$. The radius of the $n = 3$ orbit of the doubly ionised lithium ion Li$^{2+}$ ($Z = 3$) is',
      options: ['$3a_0$', '$9a_0$', '$a_0$', '$27a_0$'], answer: 0,
      sol: '$r_n = n^2a_0/Z = 9a_0/3 = 3a_0$. A bigger nuclear charge pulls the orbit in; a larger $n$ pushes it out as $n^2$.',
      trap: 'The radius goes as $1/Z$, not $1/Z^2$ (that is the energy\'s $Z$ dependence, upside down).' },
    { id: 'atx-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'x-ray cut-off',
      q: 'An X-ray tube works at $25$ kV. Taking $hc = 1240$ eV nm, the shortest wavelength in its spectrum is',
      options: ['$0.496$ nm', '$0.0248$ nm', '$4.96$ nm', '$0.0496$ nm'], answer: 3,
      sol: 'The most energetic photon takes all of one electron\'s kinetic energy, $eV = 25$ keV. $\\lambda_{\\min} = hc/eV = 1240/25000 = 0.0496$ nm (the Duane-Hunt law).',
      trap: 'Keep kV as thousands of volts: $1240/25$ gives $49.6$ nm, a thousand times too long.' },
    { id: 'atx-006', type: 'nat', level: 1, exams: ['jam'], sub: 'counting lines',
      q: 'A large number of hydrogen atoms are excited to the $n = 5$ level. The number of different spectral lines they can emit on their way down to the ground state is ______.',
      answer: 10, tol: 0, calc: () => 5 * 4 / 2,
      sol: 'Each line joins one pair of levels from $\\{1, 2, 3, 4, 5\\}$. The number of pairs is $\\binom52 = 5\\times4/2 = 10$. In general $n(n - 1)/2$.',
      trap: 'A single atom gives at most $n - 1 = 4$ lines on one path down; many atoms take every path.' },

    // ---------- level 2 ----------
    { id: 'atx-007', type: 'nat', level: 2, exams: ['jam'], sub: 'rydberg formula', unit: 'nm',
      q: 'Using $R = 1.097\\times10^7$ m$^{-1}$, the wavelength of the hydrogen line from $n = 3$ to $n = 2$ is ______ nm (to one decimal place).',
      answer: 656.3, tol: 0.4, calc: () => lineNm(1, 3, 2),
      sol: '$1/\\lambda = R(1/2^2 - 1/3^2) = R\\times5/36 = 1.5236\\times10^6$ m$^{-1}$. $\\lambda = 6.563\\times10^{-7}$ m $= 656.3$ nm: the red H$\\alpha$ line.',
      trap: 'Writing $1/3^2 - 1/2^2$ gives a negative wavelength; the lower level goes first.' },
    { id: 'atx-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'spectral series',
      q: 'Taking $R = 1.097\\times10^7$ m$^{-1}$, the shortest wavelength in the Lyman series of hydrogen (the series limit) is about',
      options: ['$91.2$ nm', '$121.6$ nm', '$364.6$ nm', '$656.3$ nm'], answer: 0,
      sol: 'The series limit is the jump from $n = \\infty$ to $n = 1$: $1/\\lambda = R(1 - 0) = R$, so $\\lambda = 1/R = 91.2$ nm. ($121.6$ nm is the longest Lyman line, $2\\to1$; $364.6$ nm is the Balmer limit.)',
      trap: 'The shortest wavelength is the biggest energy jump, which comes from infinity, not from $n = 2$.' },
    { id: 'atx-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'bohr orbits',
      q: 'The speed of the electron in the first Bohr orbit of hydrogen, as a fraction of the speed of light, is about',
      options: ['$1/1836$', '$1/2$', '$1/137$', '$1/13.6$'], answer: 2,
      sol: '$v_n = \\dfrac{e^2}{4\\pi\\varepsilon_0\\hbar}\\cdot\\dfrac{Z}{n} = \\dfrac{Z\\alpha c}{n}$, with the fine-structure constant $\\alpha \\approx 1/137$. So $v_1 = c/137 \\approx 2.19\\times10^6$ m/s: fast, but not relativistic, which is why the non-relativistic Bohr model works for hydrogen.',
      trap: 'For a heavy hydrogen-like ion, $v = Z\\alpha c$ becomes a large fraction of $c$, and relativistic corrections grow.' },
    { id: 'atx-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'moseley',
      q: 'Using Moseley\'s law in the form $E_{K\\alpha} \\approx 10.2(Z - 1)^2$ eV, the $K\\alpha$ X-ray energy of copper ($Z = 29$) is about',
      options: ['$8.6$ keV', '$5.7$ keV', '$8.0$ keV', '$11.4$ keV'], answer: 2,
      sol: '$10.2(29 - 1)^2 = 10.2\\times784 = 7997$ eV $\\approx 8.0$ keV. The $10.2$ eV is $13.6(1 - 1/4)$: a hydrogen-like $2\\to1$ jump, with the nuclear charge screened by the one electron left in the K shell.',
      trap: 'Using $Z^2$ instead of $(Z - 1)^2$ gives $8.6$ keV.' },
    { id: 'atx-011', type: 'msq', level: 2, exams: ['jam'], sub: 'x-ray spectrum', format: 'statements',
      q: 'For the X-ray spectrum of a tube, which statements are correct?',
      options: ['The cut-off wavelength depends only on the accelerating voltage, not on the target metal.', 'The wavelengths of the characteristic lines depend on the target metal.', 'Raising the voltage shifts the characteristic lines to shorter wavelengths.', 'The continuous part is bremsstrahlung, radiation from electrons slowed down in the target.'], answer: [0, 1, 3],
      sol: 'First: $\\lambda_{\\min} = hc/eV$. Second: characteristic lines come from jumps between inner shells, whose energies are fixed by the element. Third: false; once the voltage is high enough to make them, their wavelengths stay put (only their intensity grows). Fourth: true; "braking radiation".',
      trap: 'Voltage moves the cut-off, not the characteristic lines.' },
    { id: 'atx-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'bohr energies',
      q: 'As the Bohr orbit number $n$ increases, which of these increases?',
      options: ['The kinetic energy of the electron', 'Its orbital speed', 'Its orbital frequency', 'Its potential energy (becoming less negative)'], answer: 3,
      sol: '$K = 13.6/n^2$ eV and $v \\propto 1/n$ fall; the orbital frequency $v/2\\pi r \\propto 1/n^3$ falls. The potential energy $U = -2K = -27.2/n^2$ eV rises towards zero, and so does the total $E = -13.6/n^2$ eV.',
      trap: 'In a $1/r$ potential, $E = -K$ and $U = -2K$ (the virial theorem): when the electron moves out it slows down.' },
    { id: 'atx-013', type: 'nat', level: 2, exams: ['jam'], sub: 'hydrogen-like ions', unit: 'nm',
      q: 'A He$^+$ ion drops from $n = 2$ to $n = 1$. Taking $13.6$ eV for hydrogen and $hc = 1240$ eV nm, the wavelength of the photon is ______ nm (to one decimal place).',
      answer: 30.4, tol: 0.1, calc: () => HC / (RY * 4 * 0.75),
      sol: '$\\Delta E = 13.6Z^2(1 - 1/4) = 13.6\\times4\\times0.75 = 40.8$ eV. $\\lambda = 1240/40.8 = 30.4$ nm, a quarter of hydrogen\'s $121.6$ nm Lyman $\\alpha$.',
      trap: 'Every hydrogen-like wavelength is the hydrogen one divided by $Z^2$.' },
    { id: 'atx-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'spectral series',
      q: 'The ratio of the longest wavelength of the Lyman series to the longest wavelength of the Balmer series of hydrogen is',
      options: ['$27/5$', '$4/9$', '$5/27$', '$3/4$'], answer: 2,
      sol: 'Longest Lyman ($2\\to1$): $1/\\lambda_L = R(1 - 1/4) = 3R/4$. Longest Balmer ($3\\to2$): $1/\\lambda_B = R(1/4 - 1/9) = 5R/36$. $\\lambda_L/\\lambda_B = (5/36)/(3/4) = 5/27$.',
      trap: 'Ratios of wavelengths are the inverse ratios of the energy jumps.' },
    { id: 'atx-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'franck-hertz',
      q: 'In a Franck-Hertz experiment with mercury vapour, the collector current drops sharply each time the accelerating voltage passes a multiple of about $4.9$ V. This shows that',
      options: ['electrons have a wavelength comparable to atomic sizes', 'mercury atoms absorb energy from colliding electrons only in fixed amounts, so atomic energy levels are discrete', 'mercury atoms are ionised at $4.9$ V', 'the electron charge is quantised'], answer: 1,
      sol: 'An electron with less than $4.9$ eV bounces off atoms elastically and reaches the collector. At $4.9$ eV it can give exactly that much to an atom (raising it to its first excited state) and is then too slow to pass the small retarding grid, so the current dips; it repeats at $9.8$ V, and so on. The mercury then emits $1240/4.9 = 253$ nm ultraviolet light.',
      trap: '$4.9$ eV is an excitation energy, not the ionisation energy (about $10.4$ eV for mercury).' },
    { id: 'atx-016', type: 'msq', level: 2, exams: ['jam'], sub: 'hydrogen-like ions', format: 'multi',
      q: 'For a hydrogen-like ion of nuclear charge $Ze$ (Bohr model, fixed $n$), which scalings are correct?',
      options: ['$E_n \\propto Z^2$', '$r_n \\propto 1/Z$', '$v_n \\propto Z$', 'The orbital period $\\propto Z^2$'], answer: [0, 1, 2],
      sol: '$r_n = n^2a_0/Z$, $v_n = Z\\alpha c/n$, $E_n = -13.6Z^2/n^2$ eV. The period $T = 2\\pi r/v \\propto (1/Z)/Z = 1/Z^2$: it shrinks, not grows.',
      trap: 'Period $\\propto 1/Z^2$, not $Z^2$: smaller orbit and faster electron both shorten it.' },

    // ---------- level 3 ----------
    { id: 'atx-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'reduced mass', unit: 'nm',
      q: 'The H$\\alpha$ line of hydrogen is at $656.3$ nm. Taking the reduced-mass correction into account with $m_p/m_e = 1836$ and $m_d/m_e = 3670$, the same line of deuterium is shorter by ______ nm (to three decimal places).',
      answer: 0.179, tol: 0.002, calc: () => 656.3 * (1 - (1 + 1 / 3670) / (1 + 1 / 1836)),
      sol: 'Energies scale with the reduced mass $\\mu = m_e/(1 + m_e/M)$, so $\\lambda \\propto 1/\\mu$. $\\lambda_D/\\lambda_H = \\mu_H/\\mu_D = (1 + 1/3670)/(1 + 1/1836) = 1.0002725/1.0005447 = 0.999728$. $\\Delta\\lambda = 656.3\\times(1 - 0.999728) = 0.179$ nm. This small shift is how deuterium was discovered in 1932.',
      trap: 'Deuterium\'s reduced mass is closer to $m_e$, so its levels are slightly deeper and its lines slightly bluer (shorter).' },
    { id: 'atx-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'reduced mass',
      q: 'Positronium is a bound electron and positron. Taking hydrogen\'s ground-state energy as $-13.6$ eV (with an infinitely heavy nucleus), the binding energy of positronium\'s ground state is',
      options: ['$13.6$ eV', '$27.2$ eV', '$3.4$ eV', '$6.8$ eV'], answer: 3,
      sol: 'Reduced mass $\\mu = m_em_e/(m_e + m_e) = m_e/2$. Energies scale with $\\mu$, so the binding energy is $13.6/2 = 6.8$ eV.',
      trap: 'The charges are the same as in hydrogen ($Z = 1$); only the reduced mass changes.' },
    { id: 'atx-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'counting lines',
      q: 'Hydrogen atoms excited to $n = 4$ fall back to the ground state by every possible route. How many of the emitted lines are in the visible range (about $400$ to $700$ nm)? Use $R = 1.097\\times10^7$ m$^{-1}$.',
      options: ['$1$', '$3$', '$2$', '$6$'], answer: 2,
      sol: 'The six lines: $4\\to1$, $3\\to1$, $2\\to1$ are Lyman (ultraviolet, $97$ to $122$ nm). $4\\to3$ is Paschen ($1875$ nm, infrared). $3\\to2$ ($656$ nm) and $4\\to2$ ($486$ nm) are Balmer and visible. So 2.',
      trap: 'Six lines in total, but only Balmer lines fall in the visible, and only two of those start at or below $n = 4$.' },
    { id: 'atx-020', type: 'nat', level: 3, exams: ['jam'], sub: 'ionisation', unit: 'nm',
      q: 'A hydrogen atom is in the $n = 3$ state. Taking $13.6$ eV and $hc = 1240$ eV nm, the longest wavelength of light that can ionise it is ______ nm (to the nearest nm).',
      answer: 821, tol: 1, calc: () => HC / (RY / 9),
      sol: 'From $n = 3$ the binding energy is $13.6/9 = 1.511$ eV. $\\lambda_{\\max} = 1240/1.511 = 821$ nm (near infrared): the Paschen series limit.',
      trap: 'The energy to ionise from an excited level is much less than $13.6$ eV.' },
    { id: 'atx-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'moseley',
      q: 'By Moseley\'s law for $K\\alpha$ lines, $\\sqrt\\nu \\propto Z - 1$. The ratio of the $K\\alpha$ frequencies of elements with $Z = 41$ and $Z = 21$ is',
      options: ['$(41/21)^2$', '$4$', '$2$', '$\\sqrt2$'], answer: 1,
      sol: '$\\nu \\propto (Z - 1)^2$, so the ratio is $(40/20)^2 = 4$.',
      trap: '$(41/21)^2 = 3.81$ forgets the screening constant 1; $2$ forgets the square.' },
    { id: 'atx-022', type: 'nat', level: 3, exams: ['jam'], sub: 'moseley',
      q: 'An unknown target gives a $K\\alpha$ line of wavelength $0.0720$ nm. Using $E_{K\\alpha} = 10.2(Z - 1)^2$ eV and $hc = 1240$ eV nm, the atomic number of the target is ______ (nearest integer).',
      answer: 42, tol: 0, calc: () => Math.round(1 + Math.sqrt(HC / 0.072 / 10.2)),
      sol: '$E = 1240/0.0720 = 17\\,220$ eV. $(Z - 1)^2 = 17220/10.2 = 1688$, so $Z - 1 = 41.1$ and $Z = 42$ (molybdenum).',
      trap: 'Moseley\'s law is approximate, so expect a value near an integer, not exactly on it.' },
    { id: 'atx-023', type: 'msq', level: 3, exams: ['jam'], sub: 'bohr model limits', format: 'statements',
      q: 'Which statements about the Bohr model are correct?',
      options: ['It gives the correct energy levels of hydrogen, apart from small fine-structure corrections.', 'It correctly predicts that the ground state of hydrogen has zero orbital angular momentum.', 'It cannot account for the relative intensities of spectral lines.', 'It fails to give the energy levels of the helium atom.'], answer: [0, 2, 3],
      sol: 'First: $E_n = -13.6/n^2$ eV matches experiment closely. Second: false; Bohr gives $L = \\hbar$ for $n = 1$, while quantum mechanics gives $L = 0$ for the 1s state. Third and fourth: true; intensities need transition probabilities, and two interacting electrons are beyond the model.',
      trap: 'Bohr\'s energies are right; his orbits and angular momenta are not.' },
    { id: 'atx-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'x-ray cut-off',
      q: 'The shortest wavelength emitted by an X-ray tube is $0.031$ nm. With $hc = 1240$ eV nm, the tube voltage is',
      options: ['$4.0$ kV', '$40$ kV', '$31$ kV', '$400$ kV'], answer: 1,
      sol: '$eV = hc/\\lambda_{\\min} = 1240/0.031 = 40\\,000$ eV, so $V = 40$ kV.',
      trap: 'Units: $hc = 1240$ eV nm with $\\lambda$ in nm gives eV directly; the voltage is that number in volts.' },
    { id: 'atx-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'characteristic lines',
      q: 'Compare the $K\\alpha$ and $K\\beta$ lines of one element.',
      options: ['$K\\beta$ has the shorter wavelength, because it comes from the M shell (further from the nucleus) to the K shell', '$K\\alpha$ has the shorter wavelength, because it is stronger', 'They have the same wavelength but different intensities', '$K\\beta$ has the longer wavelength, because it ends on the L shell'], answer: 0,
      sol: '$K\\alpha$: L shell to K shell. $K\\beta$: M shell to K shell. The M electron starts higher, so it releases more energy: $K\\beta$ has the higher energy and shorter wavelength. $K\\alpha$ is usually stronger, but strength has nothing to do with wavelength.',
      trap: 'The letter K names the shell the transition ends on; $\\alpha$ and $\\beta$ name where it starts.' },
    { id: 'atx-026', type: 'nat', level: 3, exams: ['jam'], sub: 'bohr orbits', unit: '$10^{15}$ Hz',
      q: 'In the first Bohr orbit of hydrogen the electron moves at $2.19\\times10^6$ m/s on a circle of radius $0.0529$ nm. Its orbital frequency is ______ $\\times10^{15}$ Hz (to two decimal places).',
      answer: 6.59, tol: 0.02, calc: () => 2.19e6 / (2 * Math.PI * 0.0529e-9) / 1e15,
      sol: '$f = v/(2\\pi r) = 2.19\\times10^6/(2\\pi\\times5.29\\times10^{-11}) = 2.19\\times10^6/3.324\\times10^{-10} = 6.59\\times10^{15}$ Hz. Classically the electron would radiate at this frequency and spiral in within about $10^{-11}$ s; Bohr\'s postulate forbids it.',
      trap: 'Dividing by $r$ instead of $2\\pi r$ gives the angular frequency.' },
    { id: 'atx-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'absorption spectra',
      q: 'Cool hydrogen gas at room temperature is lit with white light covering the ultraviolet, visible and infrared. Dark absorption lines appear mainly in',
      options: ['the visible Balmer series', 'the infrared Paschen series', 'all series equally', 'the ultraviolet Lyman series'], answer: 3,
      sol: 'At room temperature $kT \\approx 0.025$ eV, far below the $10.2$ eV needed to reach $n = 2$, so practically every atom is in $n = 1$. Absorption starts from the occupied level, so only Lyman lines (from $n = 1$ upward) are absorbed.',
      trap: 'Balmer absorption needs atoms already sitting in $n = 2$, which happens in hot stellar atmospheres (about $10\\,000$ K), not in a cool gas.' },
    { id: 'atx-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'absorption edges', format: 'statements',
      q: 'X-rays of slowly increasing photon energy pass through a thin metal foil. Which statements about its absorption are correct?',
      options: ['The absorption jumps up sharply when the photon energy passes the binding energy of the K-shell electrons (the K edge).', 'The K edge lies at a slightly higher photon energy than the $K\\alpha$ emission line of the same metal.', 'Between edges the absorption falls steeply as the photon energy rises.', 'The edge energies are the same for every element.'], answer: [0, 1, 2],
      sol: 'Above the K edge the photon can eject a K electron, a new channel for absorption. The edge is at the full K binding energy, while $K\\alpha$ is the K-L difference, so the edge is higher. Between edges photoelectric absorption falls roughly as $E^{-3}$. Edges scale with $Z^2$ like the lines, so they identify the element.',
      trap: 'A metal is fairly transparent to its own $K\\alpha$ line, which is just below its K edge; this is why filters work.' },

    // ---------- level 4 ----------
    { id: 'atx-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'exotic atoms', unit: 'fm',
      q: 'In muonic hydrogen a muon ($m_\\mu = 207m_e$) replaces the electron. Taking the reduced mass with $m_p = 1836m_e$ and $a_0 = 0.0529$ nm for ordinary hydrogen with an infinitely heavy nucleus, the Bohr radius of muonic hydrogen is ______ fm (to the nearest fm).',
      answer: 284, tol: 1.5, calc: () => 52900 / (207 / (1 + 207 / 1836)),
      sol: 'Reduced mass $\\mu = 207m_e/(1 + 207/1836) = 207m_e/1.1127 = 186.0m_e$. The radius scales as $1/\\mu$: $a = 0.0529$ nm$/186.0 = 52\\,900$ fm$/186.0 = 284$ fm, only about 300 times a proton radius, so the muon feels the proton\'s size.',
      trap: 'Using $207$ without the reduced mass gives $256$ fm; for a heavy orbiting particle the nucleus\'s motion matters a lot.' },
    { id: 'atx-030', type: 'nat', level: 4, exams: ['jam'], sub: 'recoil', unit: 'm/s',
      q: 'A hydrogen atom at rest emits a Lyman $\\alpha$ photon of energy $10.2$ eV. Taking the atom\'s rest energy as $939$ MeV and $c = 3\\times10^8$ m/s, its recoil speed is ______ m/s (to two decimal places).',
      answer: 3.26, tol: 0.02, calc: () => 10.2 / 939e6 * 3e8,
      sol: 'Momentum conservation: $Mv = E/c$, so $v = E/(Mc) = c\\cdot E/(Mc^2) = 3\\times10^8\\times10.2/(9.39\\times10^8) = 3.26$ m/s. The recoil energy $E^2/2Mc^2 \\approx 5.5\\times10^{-8}$ eV is negligible.',
      trap: 'Photons carry momentum $E/c$; the atom must recoil the other way.' },
    { id: 'atx-031', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'hydrogen-like ions',
      q: 'The He$^+$ transition from $n = 4$ to $n = 2$ has (to within the small reduced-mass difference) the same wavelength as which hydrogen line?',
      options: ['H$\\alpha$ ($3\\to2$)', 'H$\\beta$ ($4\\to2$)', 'Lyman $\\alpha$ ($2\\to1$)', 'Paschen $\\alpha$ ($4\\to3$)'], answer: 2,
      sol: 'He$^+$: $\\Delta E = 13.6\\times4(1/4 - 1/16) = 13.6\\times4\\times3/16 = 13.6\\times3/4 = 10.2$ eV. Hydrogen Lyman $\\alpha$: $13.6(1 - 1/4) = 10.2$ eV. Same. In general He$^+$ from $2n_2$ to $2n_1$ matches hydrogen from $n_2$ to $n_1$.',
      trap: 'The same $n$ values do not give the same line in different ions; it is $Z/n$ that matters.' },
    { id: 'atx-032', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'magnetic moment',
      q: 'The electron in the first Bohr orbit is a tiny current loop. With $e = 1.6\\times10^{-19}$ C, $\\hbar = 1.055\\times10^{-34}$ J s and $m_e = 9.11\\times10^{-31}$ kg, its orbital magnetic moment is closest to',
      options: ['$9.3\\times10^{-24}$ A m$^2$', '$4.6\\times10^{-24}$ A m$^2$', '$1.9\\times10^{-23}$ A m$^2$', '$5.1\\times10^{-27}$ A m$^2$'], answer: 0,
      sol: 'Current $I = ef = ev/2\\pi r$ and area $\\pi r^2$, so $\\mu = I\\pi r^2 = evr/2 = (e/2m_e)L$. With $L = \\hbar$: $\\mu = e\\hbar/2m_e = (1.6\\times10^{-19})(1.055\\times10^{-34})/(1.822\\times10^{-30}) = 9.26\\times10^{-24}$ A m$^2$, the Bohr magneton.',
      trap: '$5.1\\times10^{-27}$ A m$^2$ is the nuclear magneton, with $m_p$ in place of $m_e$.' },
    { id: 'atx-033', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'moseley', format: 'statements',
      q: 'Which statements about Moseley\'s law are correct?',
      options: ['$\\sqrt\\nu$ for a given X-ray line is a straight-line function of $Z$.', 'For $K\\alpha$ the screening constant is about 1, because one electron stays in the K shell and partly hides the nucleus.', 'It showed that elements should be ordered by atomic number rather than atomic mass, settling cases such as cobalt and nickel.', 'To a first approximation the $K\\alpha$ energy does not depend on the chemical compound the element is in.'], answer: [0, 1, 2, 3],
      sol: 'All four are true. $\\nu = c_1(Z - \\sigma)^2$; for $K\\alpha$ $\\sigma \\approx 1$. Moseley\'s 1913 plot put Co (27) before Ni (28) although Co is heavier, and revealed gaps for undiscovered elements. Inner-shell energies are set by the nucleus and inner electrons, almost untouched by chemical bonding of the outer electrons.',
      trap: 'In a multiple-select question, all options can be correct; judge each one on its own.' },
    { id: 'atx-034', type: 'nat', level: 4, exams: ['jam'], sub: 'collisional excitation', unit: 'eV',
      q: 'Electrons are fired into hydrogen gas whose atoms are all in the ground state. Neglecting atomic recoil, the smallest electron kinetic energy that can make the gas emit the red H$\\alpha$ line ($3\\to2$) is ______ eV (to two decimal places). Take $13.6$ eV.',
      answer: 12.09, tol: 0.01, calc: () => RY * (1 - 1 / 9),
      sol: 'H$\\alpha$ needs atoms in $n = 3$. Exciting from $n = 1$ to $n = 3$ takes $13.6(1 - 1/9) = 12.09$ eV. Unlike a photon, an electron can hand over just part of its energy, so any electron with at least $12.09$ eV can do it.',
      trap: 'The energy of the H$\\alpha$ photon itself ($1.89$ eV) is not enough; the atom must first be lifted from $n = 1$.' },
    { id: 'atx-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'absorption and emission',
      q: 'Hydrogen atoms in the ground state absorb photons of energy $12.75$ eV (take $13.6$ eV). Afterwards the gas can emit how many different spectral lines?',
      options: ['$3$', '$4$', '$10$', '$6$'], answer: 3,
      sol: '$13.6(1 - 1/n^2) = 12.75$ gives $1/n^2 = 0.0625$, so $n = 4$. Atoms in $n = 4$ can emit $4\\times3/2 = 6$ different lines.',
      trap: 'A photon is absorbed only if its energy matches a gap exactly; first find which level it reaches.' },
    { id: 'atx-036', type: 'nat', level: 4, exams: ['jam'], sub: 'x-ray diffraction', unit: 'degrees',
      q: 'X-rays of wavelength $0.154$ nm are reflected from crystal planes $0.282$ nm apart. The first-order Bragg glancing angle is ______ degrees (to one decimal place).',
      answer: 15.8, tol: 0.1, calc: () => Math.asin(0.154 / (2 * 0.282)) * 180 / Math.PI,
      sol: '$2d\\sin\\theta = \\lambda$: $\\sin\\theta = 0.154/0.564 = 0.2730$, $\\theta = 15.8^\\circ$. The scattering angle between incident and reflected beams is $2\\theta = 31.7^\\circ$.',
      trap: 'Bragg\'s $\\theta$ is measured from the planes, and the beam is turned through $2\\theta$.' },
    { id: 'atx-037', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'reduced mass',
      q: 'Compared with ordinary hydrogen, the ionisation energy of deuterium is',
      options: ['exactly the same, because the nuclear charge is the same', 'slightly larger, by about $0.03\\%$', 'slightly smaller, by about $0.03\\%$', 'twice as large, because the nucleus is twice as heavy'], answer: 1,
      sol: '$E \\propto \\mu = m_e/(1 + m_e/M)$. For H, $\\mu = 0.999456m_e$; for D, $0.999728m_e$. D binds more tightly by the ratio $1.000272$, about $0.03\\%$ more ($13.593$ eV against $13.596$ eV in this model).',
      trap: 'The heavier nucleus moves less, so the reduced mass is closer to $m_e$ and binding is slightly stronger.' },

    // ---------- level 5 ----------
    { id: 'atx-038', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'rydberg atoms', unit: 'GHz',
      q: 'A hydrogen atom in the Rydberg state $n = 101$ drops to $n = 100$. Taking $13.6$ eV and $h = 4.136\\times10^{-15}$ eV s, the emitted frequency is ______ GHz (to two decimal places).',
      answer: 6.48, tol: 0.02, calc: () => RY * (1 / 100 ** 2 - 1 / 101 ** 2) / 4.136e-15 / 1e9,
      sol: '$\\Delta E = 13.6(1/100^2 - 1/101^2) = 13.6(1.0000\\times10^{-4} - 0.98030\\times10^{-4}) = 2.680\\times10^{-5}$ eV. $\\nu = \\Delta E/h = 2.680\\times10^{-5}/4.136\\times10^{-15} = 6.48\\times10^9$ Hz, a microwave. It is close to the classical orbital frequency at $n \\approx 100$, as the correspondence principle demands.',
      trap: 'Subtracting two nearly equal numbers needs enough digits; the shortcut $2\\times13.6/n^3$ with $n = 100.5$ gives the same.' },
    { id: 'atx-039', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'correspondence', format: 'statements',
      q: 'For hydrogen at large $n$, which statements are correct?',
      options: ['The frequency of the $n \\to n - 1$ photon approaches the classical orbital frequency of the $n$-th orbit.', 'The spacing between neighbouring levels falls as $1/n^3$.', 'The orbit radius grows as $n^2$.', 'The orbital speed grows as $n$.'], answer: [0, 1, 2],
      sol: '$E_n - E_{n-1} \\approx 2(13.6\\text{ eV})/n^3$, and the classical orbital frequency $v/2\\pi r \\propto (1/n)/n^2 = 1/n^3$ with exactly the same constant: correspondence. $r \\propto n^2$. Speed $\\propto 1/n$, so it falls.',
      trap: 'Outer orbits are slower, as for planets.' },
    { id: 'atx-040', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'moseley',
      q: 'Two elements with $Z = 20$ and $Z = 40$ have $K\\alpha$ wavelengths $0.3360$ nm and $0.0791$ nm. Assuming $\\nu = c_1(Z - \\sigma)^2$ with the same $c_1$ and $\\sigma$ for both, the screening constant $\\sigma$ is ______ (to two decimal places).',
      answer: 1.15, tol: 0.02, calc: () => { const k = Math.sqrt(0.336 / 0.0791); return (40 - 20 * k) / (1 - k); },
      sol: '$\\nu \\propto 1/\\lambda$, so $\\dfrac{40 - \\sigma}{20 - \\sigma} = \\sqrt{\\dfrac{0.3360}{0.0791}} = \\sqrt{4.2478} = 2.0610$. Then $40 - \\sigma = 41.220 - 2.0610\\sigma$, so $1.0610\\sigma = 1.220$ and $\\sigma = 1.15$.',
      trap: 'Frequency goes as $1/\\lambda$: the heavier element (shorter wavelength) has the larger $\\sqrt\\nu$.' },
    { id: 'atx-041', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'exotic atoms', format: 'statements',
      q: 'Treat positronium (electron plus positron) in the Bohr model, with hydrogen values $13.6$ eV and $a_0$ for an infinitely heavy nucleus. Which statements are correct?',
      options: ['Its ground-state binding energy is $6.8$ eV.', 'The electron-positron separation in the ground state is $2a_0$.', 'Its $2\\to1$ photon has energy $5.1$ eV.', 'All its spectral lines have twice the frequencies of the matching hydrogen lines.'], answer: [0, 1, 2],
      sol: 'Reduced mass $m_e/2$. Energies scale with $\\mu$: $6.8$ eV, and the $2\\to1$ line is $10.2/2 = 5.1$ eV. Lengths scale as $1/\\mu$: separation $2a_0$. Frequencies are half, not twice, those of hydrogen.',
      trap: 'Smaller reduced mass means weaker binding and a bigger atom.' },
    { id: 'atx-042', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'hydrogen-like ions',
      q: 'For a hydrogen-like ion, the series of lines ending on $n = 3$ has its short-wavelength limit at $32.8$ nm. Using $13.6$ eV and $hc = 1240$ eV nm, the nuclear charge $Z$ is ______.',
      answer: 5, tol: 0, calc: () => Math.round(Math.sqrt(HC / 32.8 * 9 / RY)),
      sol: 'The series limit is the jump from $n = \\infty$ to $n = 3$: $E = 13.6Z^2/9$. With $E = 1240/32.8 = 37.80$ eV: $Z^2 = 37.80\\times9/13.6 = 25.0$, so $Z = 5$ (B$^{4+}$).',
      trap: 'The series limit corresponds to the binding energy of the lower level, $13.6Z^2/n^2$, not to a jump from $n + 1$.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'atx-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'bohr orbits', format: 'comparison',
      make(r) {
        const ion = ['H', 'He$^+$', 'Li$^{2+}$'];
        const Z1 = Q5.int(r, 1, 3), Z2 = Q5.int(r, 1, 3), n1 = Q5.int(r, 1, 4); let n2 = Q5.int(r, 1, 4); if (Z1 === Z2 && n1 === n2) n2 = n1 === 4 ? 1 : n1 + 1;
        const Qs = { 'orbit radius': [(n, Z) => n * n, (n, Z) => Z], 'orbital speed': [(n, Z) => Z, (n, Z) => n], 'binding energy': [(n, Z) => Z * Z, (n, Z) => n * n], 'orbital period': [(n, Z) => n ** 3, (n, Z) => Z * Z], 'angular momentum': [(n, Z) => n, () => 1] };
        const key = Q5.choose(r, Object.keys(Qs));
        const rat = (k) => q5frac(Qs[k][0](n1, Z1) * Qs[k][1](n2, Z2), Qs[k][1](n1, Z1) * Qs[k][0](n2, Z2));
        const right = rat(key), inv = q5frac(Qs[key][1](n1, Z1) * Qs[key][0](n2, Z2), Qs[key][0](n1, Z1) * Qs[key][1](n2, Z2));
        const o = Q5.mcqOptions(r, right, [inv, ...Object.keys(Qs).filter((k) => k !== key).map(rat), q5frac(n1 * Z2, n2 * Z1), q5frac(n2 * Z1 * 3, n1 * Z2 * 2)], (s) => `$${s}$`);
        return { q: `In the Bohr model, the ratio of the ${key} of the electron in ${ion[Z1 - 1]} ($n = ${n1}$) to that in ${ion[Z2 - 1]} ($n = ${n2}$) is`, ...o,
          sol: `Bohr scalings: $r \\propto n^2/Z$, $v \\propto Z/n$, binding energy $\\propto Z^2/n^2$, period $T = 2\\pi r/v \\propto n^3/Z^2$, angular momentum $= n\\hbar$. For the ${key}: $${right}$.`,
          trap: 'Keep the powers straight: radius $n^2/Z$, energy $Z^2/n^2$, period $n^3/Z^2$.' };
      } },
    { id: 'atx-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'x-ray spectrum', format: 'statements',
      make(r) {
        const c = Q5.int(r, 0, 2);
        const L = [
          ['the accelerating voltage is raised', ['The cut-off (shortest) wavelength becomes shorter.', 'The characteristic lines stay at the same wavelengths.', 'The total X-ray intensity rises.'], ['The characteristic lines shift to shorter wavelengths.', 'The cut-off wavelength is unchanged.', 'The cut-off wavelength becomes longer.']],
          ['the tube current is raised, at the same voltage', ['The cut-off wavelength is unchanged.', 'The characteristic lines stay at the same wavelengths.', 'The intensity at every wavelength rises.'], ['The cut-off wavelength becomes shorter.', 'The characteristic lines shift to shorter wavelengths.', 'New characteristic lines must appear.']],
          ['the target is changed to an element of higher atomic number, at the same voltage', ['The characteristic lines move to shorter wavelengths.', 'The cut-off wavelength is unchanged.', 'The continuous spectrum generally becomes more intense.'], ['The cut-off wavelength becomes shorter.', 'The characteristic lines stay at the same wavelengths.', 'The characteristic lines move to longer wavelengths.']]][c];
        const o = q5msq(r, L[1], L[2]);
        return { q: `In an X-ray tube, ${L[0]}. Which statements are correct?`, ...o,
          sol: 'The cut-off wavelength $\\lambda_{\\min} = hc/eV$ depends only on the voltage (an electron gives all its energy to one photon). Characteristic lines come from inner-shell jumps in the target atoms, so they depend only on the target ($\\propto 1/(Z-1)^2$ by Moseley), not on voltage or current (once the voltage can excite them). The current sets the number of electrons per second, so it scales the intensity everywhere; higher voltage and higher-$Z$ targets also make bremsstrahlung more intense.',
          trap: 'Voltage moves the cut-off, the target moves the lines, and the current moves neither.' };
      } },
    { id: 'atx-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'hydrogen-like ions',
      make(r) {
        const [n1, n2] = Q5.choose(r, [[1, 2], [2, 3], [1, 3], [2, 4], [3, 4]]), Z = Q5.int(r, 1, 10);
        const f = 1 / (n1 * n1) - 1 / (n2 * n2), lam = +(1e9 / (1.097e7 * Z * Z * f)).toPrecision(4);
        const ans = Math.round(Math.sqrt(1e9 / (1.097e7 * lam * f)));
        return { q: `A hydrogen-like ion emits a line of wavelength $${lam}$ nm when its electron drops from $n = ${n2}$ to $n = ${n1}$. Its atomic number $Z$ is ______ (use $R = 1.097\\times10^7$ m$^{-1}$).`,
          answer: ans, tol: 0, n1, n2, lam,
          sol: `$\\dfrac1\\lambda = RZ^2\\left(\\dfrac1{${n1}^2} - \\dfrac1{${n2}^2}\\right)$, so $Z^2 = \\dfrac{1}{R\\lambda(${Q5.round(f, 4)})} = \\dfrac{1}{1.097\\times10^7\\times${lam}\\times10^{-9}\\times${Q5.round(f, 4)}} = ${Q5.round(1e9 / (1.097e7 * lam * f), 2)}$, so $Z = ${ans}$.`,
          trap: 'The Rydberg formula for an ion carries $Z^2$, not $Z$.' };
      },
      verify: (p) => { const E = 1240 / p.lam, f = 1 / (p.n1 * p.n1) - 1 / (p.n2 * p.n2); return Math.round(Math.sqrt(E / (13.6 * f))); } },
    { id: 'atx-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'franck-hertz', format: 'graph',
      make(r) {
        const dV = Q5.choose(r, [4.9, 4.7, 6.7, 2.1, 1.6, 10.2, 3.2]);
        const s = (x) => `$${Q5.round(x, 1)}$ nm`;
        const o = Q5.mcqOptions(r, 1240 / dV, [620 / dV, 2480 / dV, 1240 / (dV + 1), 1240 * dV / 10], s);
        return { q: `In a Franck-Hertz experiment with a certain vapour, the graph of collector current against accelerating voltage shows sharp dips spaced $${dV}$ V apart. Light emitted by the excited atoms has a wavelength of about ($hc = 1240$ eV nm)`, ...o,
          sol: `Each dip marks electrons that have just enough energy to excite an atom and lose it in one collision; the spacing $${dV}$ V means the excitation energy is $${dV}$ eV. The atom returns by emitting $\\lambda = hc/E = 1240/${dV} = ${Q5.round(1240 / dV, 1)}$ nm. (For mercury, $4.9$ V gives the $254$ nm ultraviolet line.)`,
          trap: 'Use the spacing between dips, not the position of the first dip, which is shifted by contact potentials.' };
      } },
    { id: 'atx-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'moseley', unit: 'pm',
      make(r) {
        const Z1 = Q5.int(r, 20, 50), Z2 = 20 + ((Z1 - 20 + Q5.int(r, 1, 30)) % 31);
        const l1 = +(1240e3 / (10.2 * (Z1 - 1) ** 2)).toPrecision(4), l2 = l1 * (Z1 - 1) ** 2 / (Z2 - 1) ** 2;
        return { q: `The $K\\alpha$ X-ray line of an element with $Z = ${Z1}$ has wavelength $${l1}$ pm. Using Moseley's law ($\\sqrt f \\propto Z - 1$), the $K\\alpha$ wavelength for $Z = ${Z2}$ is ______ pm (to three significant figures).`,
          answer: +l2.toPrecision(3), tol: +(0.006 * l2).toPrecision(2), Z1, Z2, l1,
          sol: `$f \\propto (Z - 1)^2$, so $\\lambda \\propto 1/(Z - 1)^2$: $\\lambda_2 = ${l1}\\times\\dfrac{${Z1 - 1}^2}{${Z2 - 1}^2} = ${+l2.toPrecision(3)}$ pm.`,
          trap: 'Moseley uses $Z - 1$ (screening by the other K electron), and wavelength goes inversely with frequency.' };
      },
      verify: (p) => 1240e3 / (10.2 * (p.Z2 - 1) ** 2) },
    { id: 'atx-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'bohr energies',
      make(r) {
        const [Z, ion] = choose(r, [[1, 'a hydrogen atom'], [2, 'a He$^+$ ion'], [3, 'a Li$^{2+}$ ion'], [4, 'a Be$^{3+}$ ion']]), n = int(r, 1, 5);
        const E = -RY * Z * Z / (n * n);
        return { q: `Using the Bohr model with $13.6$ eV for hydrogen, the energy of the electron in the $n = ${n}$ level of ${ion} ($Z = ${Z}$) is ______ eV (to two decimal places).`,
          answer: round(E, 2), tol: 0.01, unit: 'eV', Z, n,
          sol: `$E_n = -13.6Z^2/n^2 = -13.6\\times${Z * Z}/${n * n} = ${round(E, 2)}$ eV.`,
          trap: 'The energy is negative (bound) and scales as $Z^2/n^2$.' };
      },
      verify: (p) => -RY * p.Z ** 2 / p.n ** 2 },
    { id: 'atx-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'rydberg formula',
      make(r) {
        const nf = int(r, 1, 4), ni = nf + int(r, 1, 3);
        const lam = lineNm(1, ni, nf);
        return { q: `Using $R = 1.097\\times10^7$ m$^{-1}$, the wavelength of the hydrogen line from $n = ${ni}$ to $n = ${nf}$ is ______ nm (to the nearest nm).`,
          answer: round(lam, 0), tol: Math.max(1, round(lam * 0.002, 0)), unit: 'nm', ni, nf,
          sol: `$1/\\lambda = R(1/${nf}^2 - 1/${ni}^2) = ${round(RH * (1 / nf ** 2 - 1 / ni ** 2) / 1e6, 4)}\\times10^6$ m$^{-1}$, so $\\lambda = ${round(lam, 1)}$ nm.`,
          trap: 'Put the lower level first inside the bracket.' };
      },
      verify: (p) => lineNm(1, p.ni, p.nf) },
    { id: 'atx-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'x-ray cut-off',
      make(r) {
        const V = choose(r, [10, 15, 20, 25, 30, 35, 40, 50, 60, 80, 100, 120]);
        const lam = HC / (V * 1000) * 1000;
        return { q: `An X-ray tube runs at $${V}$ kV. With $hc = 1240$ eV nm, the shortest wavelength it emits is ______ pm (to one decimal place).`,
          answer: round(lam, 1), tol: 0.1, unit: 'pm', V,
          sol: `$\\lambda_{\\min} = hc/eV = 1240/${V * 1000}$ nm $= ${round(lam / 1000, 5)}$ nm $= ${round(lam, 1)}$ pm.`,
          trap: 'The cut-off depends only on the voltage, not on the target.' };
      },
      verify: (p) => HC / p.V },
    { id: 'atx-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'moseley',
      make(r) {
        const [Z, el] = choose(r, [[22, 'titanium'], [24, 'chromium'], [26, 'iron'], [27, 'cobalt'], [28, 'nickel'], [29, 'copper'], [30, 'zinc'], [42, 'molybdenum'], [47, 'silver'], [74, 'tungsten']]);
        const E = 10.2 * (Z - 1) ** 2 / 1000;
        return { q: `Using Moseley's law $E_{K\\alpha} \\approx 10.2(Z - 1)^2$ eV, the $K\\alpha$ energy of ${el} ($Z = ${Z}$) is ______ keV (to two decimal places).`,
          answer: round(E, 2), tol: 0.01, unit: 'keV', Z,
          sol: `$E = 10.2\\times(${Z} - 1)^2 = 10.2\\times${(Z - 1) ** 2} = ${round(E * 1000, 0)}$ eV $= ${round(E, 2)}$ keV.`,
          trap: 'Use $Z - 1$, not $Z$: one K electron screens the nucleus.' };
      },
      verify: (p) => 10.2 * (p.Z - 1) ** 2 / 1000 },
    { id: 'atx-g05', type: 'mcq', level: 2, exams: ['jam'], sub: 'counting lines',
      make(r) {
        const n = int(r, 3, 8), N = n * (n - 1) / 2;
        const o = mcqOptions(r, N, [n - 1, n * (n + 1) / 2, n, (n - 1) * (n - 2) / 2], (v) => `$${v}$`);
        return { q: `Many hydrogen atoms are excited to the $n = ${n}$ level. How many different spectral lines can they emit as they return to the ground state?`, ...o,
          sol: `Each line joins a pair of levels among $1, \\dots, ${n}$: $\\binom{${n}}{2} = ${n}\\times${n - 1}/2 = ${N}$.`,
          trap: `$${n - 1}$ is the most one atom can emit on a single path down.` };
      } },
    { id: 'atx-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'hydrogen-like ions',
      make(r) {
        const [Z, ion] = choose(r, [[2, 'He$^+$'], [3, 'Li$^{2+}$'], [4, 'Be$^{3+}$']]), nf = int(r, 1, 3), ni = nf + int(r, 1, 2);
        const dE = RY * Z * Z * (1 / nf ** 2 - 1 / ni ** 2), lam = HC / dE;
        return { q: `The ion ${ion} ($Z = ${Z}$) drops from $n = ${ni}$ to $n = ${nf}$. Using $13.6$ eV and $hc = 1240$ eV nm, the photon wavelength is ______ nm (to one decimal place).`,
          answer: round(lam, 1), tol: Math.max(0.1, round(lam * 0.002, 1)), unit: 'nm', Z, ni, nf,
          sol: `$\\Delta E = 13.6\\times${Z * Z}(1/${nf * nf} - 1/${ni * ni}) = ${round(dE, 3)}$ eV, $\\lambda = 1240/${round(dE, 3)} = ${round(lam, 1)}$ nm.`,
          trap: 'Hydrogen-like wavelengths are hydrogen\'s divided by $Z^2$.' };
      },
      verify: (p) => HC / (RY * p.Z ** 2 * (1 / p.nf ** 2 - 1 / p.ni ** 2)) },
    { id: 'atx-g07', type: 'nat', level: 4, exams: ['jam'], sub: 'bohr radii',
      make(r) {
        const Z = int(r, 1, 6), n = int(r, 1, 6);
        const rr = 0.0529 * n * n / Z;
        return { q: `With $a_0 = 0.0529$ nm, the Bohr-model radius of the $n = ${n}$ orbit of a hydrogen-like ion with $Z = ${Z}$ is ______ nm (to three significant figures).`,
          answer: +rr.toPrecision(3), tol: rr * 0.005, unit: 'nm', Z, n,
          sol: `$r_n = n^2a_0/Z = ${n * n}\\times0.0529/${Z} = ${+rr.toPrecision(4)}$ nm.`,
          trap: 'Radius $\\propto n^2/Z$; energy $\\propto Z^2/n^2$.' };
      },
      verify: (p) => 0.0529 * p.n ** 2 / p.Z },
    { id: 'atx-g08', type: 'nat', level: 4, exams: ['jam'], sub: 'moseley',
      make(r) {
        const Z = int(r, 20, 60);
        const lam = round(HC / (10.2 * (Z - 1) ** 2), 4);
        return { q: `A target emits a $K\\alpha$ line at $${lam}$ nm. Using $E_{K\\alpha} = 10.2(Z - 1)^2$ eV and $hc = 1240$ eV nm, find the atomic number $Z$ (nearest integer).`,
          answer: Z, tol: 0, lam,
          sol: `$E = 1240/${lam} = ${round(HC / lam, 0)}$ eV. $(Z - 1)^2 = ${round(HC / lam, 0)}/10.2 = ${round(HC / lam / 10.2, 1)}$, $Z - 1 = ${round(Math.sqrt(HC / lam / 10.2), 2)}$, so $Z = ${Z}$.`,
          trap: 'Remember to add the 1 back after taking the square root.' };
      },
      verify: (p) => Math.round(1 + Math.sqrt(HC / p.lam / 10.2)) },
    ...r4.gens,
  ],
};
