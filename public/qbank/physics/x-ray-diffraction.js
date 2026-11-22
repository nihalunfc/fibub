// X-ray diffraction: Bragg's law and orders, Laue condition and the Ewald sphere, structure factor and missing
// reflections (sc, bcc, fcc, diamond, NaCl, CsCl, zinc blende, ordered alloys), indexing powder patterns, atomic form
// factor, Debye-Waller factor, Scherrer size, electron and neutron diffraction, Laue, rotating-crystal and powder methods.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const D = Math.PI / 180, S3 = Math.sqrt(3);
const bar = (n) => (n < 0 ? `\\bar{${-n}}` : `${n}`);
const hkl = (h, k, l) => `(${bar(h)}${bar(k)}${bar(l)})`;
// first allowed reflections (h^2+k^2+l^2 and indices) of the cubic structures, in order of increasing angle
const LINES = {
  sc: { name: 'simple cubic', list: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0], [2, 1, 0], [2, 1, 1], [2, 2, 0], [2, 2, 1]] },
  bcc: { name: 'body-centred cubic', list: [[1, 1, 0], [2, 0, 0], [2, 1, 1], [2, 2, 0], [3, 1, 0], [2, 2, 2], [3, 2, 1], [4, 0, 0]] },
  fcc: { name: 'face-centred cubic', list: [[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1], [2, 2, 2], [4, 0, 0], [3, 3, 1], [4, 2, 0]] },
  diamond: { name: 'diamond cubic', list: [[1, 1, 1], [2, 2, 0], [3, 1, 1], [4, 0, 0], [3, 3, 1], [4, 2, 2], [5, 1, 1], [4, 4, 0]] },
};
const RULE = { sc: 'every $(hkl)$ is allowed', bcc: 'only $h + k + l$ even is allowed', fcc: 'only $h, k, l$ all odd or all even are allowed', diamond: 'only all odd, or all even with $h + k + l$ a multiple of 4, are allowed' };
const lam_e = (V) => C.h / Math.sqrt(2 * C.me * C.e * V) * 1e10; // electron wavelength in Å (non-relativistic)

import * as Q5 from '../_util.js';
import more2 from './x-ray-diffraction.more2.gen.js';
import r4 from './x-ray-diffraction.r4.gen.js';

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
  topic: 'x-ray-diffraction',
  items: [
    // ---------- level 1 ----------
    { id: 'xrd-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'Bragg law',
      q: 'In Bragg\'s law $2d\\sin\\theta = n\\lambda$, the angle $\\theta$ is',
      options: ['the angle between the incident beam and the normal to the planes', 'the angle between the incident and the diffracted beams', 'the angle between the incident beam and the reflecting planes', 'the angle through which the crystal is rotated from the start'], answer: 2,
      sol: '$\\theta$ is the glancing angle: measured from the planes themselves, not from their normal. The beam is turned through $2\\theta$ in total, which is the angle a diffractometer reports.',
      trap: 'Optics usually measures angles from the normal. Bragg\'s $\\theta$ is the complement of that angle.' },
    { id: 'xrd-002', type: 'nat', level: 1, exams: ['jam'], sub: 'Bragg law', unit: 'degree',
      q: 'X-rays of wavelength $1.54$ Å reflect in first order from planes $2.00$ Å apart. The Bragg angle $\\theta$ is ______ degrees (to one decimal place).',
      answer: 22.6, tol: 0.1, calc: () => Math.asin(1.54 / 4) / D,
      sol: '$\\sin\\theta = \\dfrac{n\\lambda}{2d} = \\dfrac{1.54}{2\\times2.00} = 0.385$, so $\\theta = 22.6^\\circ$. The detector would sit at $2\\theta = 45.3^\\circ$.',
      trap: 'Forgetting the 2 in $2d$ gives $\\sin\\theta = 0.77$ and $50.4^\\circ$.' },
    { id: 'xrd-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'why X-rays',
      q: 'X-rays rather than visible light are used to study crystal structure mainly because',
      options: ['their wavelength is comparable to the spacing of atomic planes', 'they travel faster than visible light', 'they are not absorbed by matter at all', 'they carry no momentum, so they do not disturb the atoms'], answer: 0,
      sol: 'Diffraction is strong when the wavelength is similar to the spacing of the scatterers. Atomic planes are 1 to 5 Å apart and X-rays have wavelengths of about 0.5 to 2.5 Å. Visible light (4000 to 7000 Å) is thousands of times too long: Bragg\'s law would need $\\sin\\theta > 1$.',
      trap: 'All electromagnetic waves travel at the same speed in vacuum; speed has nothing to do with it.' },
    { id: 'xrd-004', type: 'nat', level: 1, exams: ['jam'], sub: 'orders',
      q: 'X-rays of wavelength $1.54$ Å fall on a set of planes $3.0$ Å apart. The highest order of Bragg reflection that can be seen is ______.',
      answer: 3, tol: 0, calc: () => Math.floor(2 * 3.0 / 1.54),
      sol: 'Since $\\sin\\theta \\le 1$, $n \\le \\dfrac{2d}{\\lambda} = \\dfrac{6.0}{1.54} = 3.90$. The order must be a whole number, so the highest is $n = 3$.',
      trap: 'Rounding 3.90 up to 4: order 4 would need $\\sin\\theta = 1.03$.' },
    { id: 'xrd-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'powder method',
      q: 'A powder diffractometer shows a peak at $2\\theta = 50^\\circ$. The angle to use in Bragg\'s law is',
      options: ['$50^\\circ$', '$25^\\circ$', '$100^\\circ$', '$65^\\circ$'], answer: 1,
      sol: 'Diffractometers plot intensity against the scattering angle $2\\theta$, the total turn of the beam. Bragg\'s law uses half of it: $\\theta = 25^\\circ$.',
      trap: 'Putting $2\\theta$ straight into $2d\\sin\\theta = n\\lambda$, the most common slip in powder problems.' },
    { id: 'xrd-006', type: 'msq', level: 1, exams: ['jam'], sub: 'probes', format: 'multi',
      q: 'Which of these can be diffracted by a crystal with plane spacings of a few Å?',
      options: ['X-rays of wavelength 1 Å', 'electrons accelerated through about 100 V', 'thermal neutrons (energy about 0.025 eV)', 'green light of wavelength 5500 Å'], answer: [0, 1, 2],
      sol: '<b>1 Å X-rays:</b> yes. <b>100 V electrons:</b> $\\lambda = h/\\sqrt{2meV} \\approx 1.2$ Å, yes. <b>Thermal neutrons:</b> $\\lambda = h/\\sqrt{2m_nE} \\approx 1.8$ Å, yes; neutrons are also sensitive to magnetic order and to light atoms such as hydrogen. <b>Green light:</b> no: $\\lambda > 2d$, so no Bragg angle exists.',
      trap: 'Forgetting that particles have de Broglie wavelengths: electrons and neutrons diffract like X-rays.' },

    // ---------- level 2 ----------
    { id: 'xrd-007', type: 'nat', level: 2, exams: ['jam'], sub: 'Bragg law', unit: 'Å',
      q: 'Mo K$\\alpha$ X-rays ($\\lambda = 0.71$ Å) give a first-order reflection at a glancing angle of $15^\\circ$. The spacing of the reflecting planes is ______ Å (to two decimal places).',
      answer: 1.37, tol: 0.01, calc: () => 0.71 / (2 * Math.sin(15 * D)),
      sol: '$d = \\dfrac{n\\lambda}{2\\sin\\theta} = \\dfrac{0.71}{2\\times0.2588} = 1.37$ Å.',
      trap: 'Using $\\sin 30^\\circ$ (treating $15^\\circ$ as $\\theta/2$) gives $0.71$ Å.' },
    { id: 'xrd-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'missing reflections',
      q: 'For a bcc crystal of identical atoms, which of these reflections is present?',
      options: [`$${hkl(1, 0, 0)}$`, `$${hkl(1, 1, 1)}$`, `$${hkl(1, 1, 0)}$`, `$${hkl(2, 1, 0)}$`], answer: 2,
      sol: 'The bcc structure factor is $F = f[1 + e^{i\\pi(h+k+l)}]$, which is $2f$ when $h + k + l$ is even and $0$ when it is odd. Sums: $(100)$ 1, $(111)$ 3, $(110)$ 2, $(210)$ 3. Only $(110)$ survives; it is the first line of every bcc pattern.',
      trap: '$(100)$ is the first plane you think of, but in bcc the body-centre atoms reflect exactly half a wavelength out of step with the corner atoms and cancel it.' },
    { id: 'xrd-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'missing reflections',
      q: 'The lowest-angle reflection in the powder pattern of an fcc metal comes from the planes',
      options: [`$${hkl(1, 0, 0)}$`, `$${hkl(1, 1, 0)}$`, `$${hkl(2, 0, 0)}$`, `$${hkl(1, 1, 1)}$`], answer: 3,
      sol: 'For fcc, $F = 4f$ when $h, k, l$ are all odd or all even, and $0$ when they are mixed. $(100)$ and $(110)$ are mixed and vanish. Of the allowed ones, $(111)$ has the smallest $h^2 + k^2 + l^2 = 3$, hence the largest $d$ and smallest $\\theta$. $(200)$, with 4, comes next.',
      trap: '$(200)$ is allowed but is the second line. The order of lines follows $h^2 + k^2 + l^2$.' },
    { id: 'xrd-010', type: 'nat', level: 2, exams: ['jam'], sub: 'Bragg law', unit: 'degree',
      q: 'An fcc crystal has lattice constant $3.6$ Å. With X-rays of wavelength $1.54$ Å, the Bragg angle of its first reflection is ______ degrees (to one decimal place).',
      answer: 21.7, tol: 0.1, calc: () => Math.asin(1.54 * S3 / (2 * 3.6)) / D,
      sol: 'The first fcc reflection is $(111)$: $d = a/\\sqrt3 = 3.6/1.732 = 2.078$ Å. $\\sin\\theta = \\lambda/2d = 1.54/4.157 = 0.3705$, so $\\theta = 21.7^\\circ$.',
      trap: 'Using $(100)$ with $d = a$, which is forbidden in fcc.' },
    { id: 'xrd-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'orders',
      q: 'The second-order Bragg reflection from the $(111)$ planes of a cubic crystal appears at the same angle as the first-order reflection from',
      options: ['$(\\tfrac12\\,\\tfrac12\\,\\tfrac12)$', '$(222)$', '$(112)$', '$(111)$ at twice the wavelength only'], answer: 1,
      sol: '$2d_{111}\\sin\\theta = 2\\lambda$ can be written $2(d_{111}/2)\\sin\\theta = \\lambda$, and $d_{111}/2 = a/(2\\sqrt3) = a/\\sqrt{12} = d_{222}$. So the $n$-th order from $(hkl)$ is labelled as the first order from $(nh\\,nk\\,nl)$. This is why powder patterns are indexed with "$(222)$" rather than "second-order $(111)$".',
      trap: 'Halving the indices: higher orders correspond to larger indices (closer planes), not smaller.' },
    { id: 'xrd-012', type: 'nat', level: 2, exams: ['jam'], sub: 'electron diffraction', unit: 'Å',
      q: 'The de Broglie wavelength of electrons accelerated from rest through $150$ V is ______ Å (to two decimal places). Ignore relativity.',
      answer: 1.00, tol: 0.01, calc: () => lam_e(150),
      sol: '$\\lambda = \\dfrac{h}{\\sqrt{2m_eeV}} = \\dfrac{6.626\\times10^{-34}}{\\sqrt{2\\times9.109\\times10^{-31}\\times1.602\\times10^{-19}\\times150}} = 1.00\\times10^{-10}$ m. A handy form: $\\lambda \\approx 12.26/\\sqrt{V}$ Å.',
      trap: 'Using $\\lambda = hc/E$, which is the photon formula, gives a far shorter, wrong wavelength.' },
    { id: 'xrd-013', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'structure factor', format: 'statements',
      q: 'Which statements about the structure factor $F_{hkl} = \\sum_j f_j\\,e^{2\\pi i(hx_j + ky_j + lz_j)}$ are correct?',
      options: ['For bcc with identical atoms, $F = 0$ when $h + k + l$ is odd.', 'For fcc with identical atoms, $F = 0$ when $h, k, l$ are of mixed parity.', 'For the diamond structure, the $(200)$ reflection is allowed.', 'The intensity of a reflection is proportional to $|F_{hkl}|^2$.'], answer: [0, 1, 3],
      sol: '<b>bcc:</b> true: $F = f(1 + e^{i\\pi(h+k+l)})$. <b>fcc:</b> true: $F = f(1 + e^{i\\pi(h+k)} + e^{i\\pi(k+l)} + e^{i\\pi(h+l)})$, which is $4f$ for unmixed and $0$ for mixed indices. <b>Diamond (200):</b> false. Diamond multiplies the fcc factor by $1 + e^{i\\pi(h+k+l)/2}$; for $(200)$ this is $1 + e^{i\\pi} = 0$. <b>Intensity:</b> true (times the multiplicity and the angle factors).',
      trap: 'Diamond has an fcc lattice, so students assume the fcc rule is the whole story. The second atom of the basis removes more lines.' },
    { id: 'xrd-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'methods',
      q: 'In the Laue method of X-ray diffraction one uses',
      options: ['white (continuous-spectrum) X-rays and a stationary single crystal', 'monochromatic X-rays and a powdered sample', 'monochromatic X-rays and a rotating single crystal', 'white X-rays and a powdered sample'], answer: 0,
      sol: 'With the crystal fixed, each set of planes has a fixed $\\theta$ and $d$, so Bragg\'s law can only be met if the beam contains the right $\\lambda$. A continuous spectrum supplies it: each plane picks out its own wavelength. Laue photographs show the crystal\'s symmetry and are used to orient crystals. Powder: monochromatic beam, random grains. Rotating crystal: monochromatic beam, $\\theta$ varied by turning the crystal.',
      trap: 'Mixing up which variable each method frees: Laue varies $\\lambda$, the others vary $\\theta$.' },
    { id: 'xrd-015', type: 'nat', level: 2, exams: ['jam'], sub: 'Bragg law', unit: 'Å',
      q: 'The longest X-ray wavelength that can be Bragg-reflected (in any order) by planes $2.5$ Å apart is ______ Å.',
      answer: 5, tol: 0, calc: () => 2 * 2.5,
      sol: 'The largest value of $n\\lambda = 2d\\sin\\theta$ is $2d$ (at $n = 1$, $\\theta = 90^\\circ$, straight back). So $\\lambda_{\\max} = 2d = 5$ Å.',
      trap: 'Taking $\\lambda_{\\max} = d$.' },
    { id: 'xrd-016', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'form factor',
      q: 'The atomic scattering (form) factor $f$ of an atom with atomic number $Z$, as a function of $\\sin\\theta/\\lambda$,',
      options: ['is zero at $\\theta = 0$ and rises to $Z$', 'is constant and equal to $Z$', 'grows as $\\sin\\theta/\\lambda$ increases', 'equals $Z$ at $\\theta = 0$ and falls as $\\sin\\theta/\\lambda$ increases'], answer: 3,
      sol: 'In the forward direction all $Z$ electrons scatter in step, so $f(0) = Z$. At larger angles waves from different parts of the electron cloud get out of step and partly cancel, so $f$ falls. This is one reason high-angle peaks are weaker.',
      trap: 'Treating the atom as a point scatterer with $f = Z$ at every angle.' },

    // ---------- level 3 ----------
    { id: 'xrd-017', type: 'nat', level: 3, exams: ['jam'], sub: 'indexing', unit: 'Å',
      q: 'The first powder lines of a cubic crystal have $\\sin^2\\theta$ in the ratio $3 : 4 : 8 : 11$. With $\\lambda = 1.54$ Å the first line is at $\\theta = 19.0^\\circ$. The lattice constant is ______ Å (to two decimal places).',
      answer: 4.10, tol: 0.02, calc: () => 1.54 * S3 / (2 * Math.sin(19 * D)),
      sol: 'The ratio $3:4:8:11$ is $h^2+k^2+l^2$ for $(111), (200), (220), (311)$: an fcc pattern. The first line is $(111)$: $d = \\lambda/(2\\sin\\theta) = 1.54/(2\\times0.3256) = 2.365$ Å, and $a = d\\sqrt3 = 4.10$ Å.',
      trap: 'Taking the first line as $(100)$ and $a = d$ gives $2.37$ Å.' },
    { id: 'xrd-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'indexing',
      q: 'In the powder pattern of a simple cubic crystal, which value of $h^2 + k^2 + l^2$ can never occur?',
      options: ['$6$', '$7$', '$8$', '$9$'], answer: 1,
      sol: 'No sum of three squares equals 7 (or any number of the form $4^m(8n + 7)$, such as 15, 23, 28). $6 = 4 + 1 + 1$, $8 = 4 + 4 + 0$, $9 = 4 + 4 + 1 = 9 + 0 + 0$. So a simple cubic pattern always has a gap after the sixth line.',
      trap: 'This gap is what tells simple cubic apart from bcc, whose lines $2, 4, 6, \\ldots, 14$ halve to $1, 2, \\ldots, 7$ with no gap.' },
    { id: 'xrd-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'indexing',
      q: 'The first four lines of an fcc powder pattern are indexed, in order of increasing angle, as',
      options: ['$(100), (110), (111), (200)$', '$(110), (200), (211), (220)$', '$(111), (200), (220), (311)$', '$(111), (220), (311), (400)$'], answer: 2,
      sol: 'Allowed fcc indices are all odd or all even. In order of $h^2+k^2+l^2$: $(111)$ 3, $(200)$ 4, $(220)$ 8, $(311)$ 11, then $(222)$ 12, $(400)$ 16. The first option is simple cubic, the second bcc and the last diamond (where $(200)$ is also missing).',
      trap: 'The diamond list looks like fcc but skips $(200)$.' },
    { id: 'xrd-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Scherrer', unit: 'nm',
      q: 'A powder peak at $2\\theta = 40^\\circ$, measured with $\\lambda = 0.154$ nm, has a width (FWHM, after removing the instrument\'s width) of $0.50^\\circ$ in $2\\theta$. With Scherrer constant $K = 0.9$, the crystallite size is ______ nm (to one decimal place).',
      answer: 16.9, tol: 0.2, calc: () => 0.9 * 0.154 / (0.5 * D * Math.cos(20 * D)),
      sol: 'Scherrer: $\\tau = \\dfrac{K\\lambda}{\\beta\\cos\\theta}$ with $\\beta$ in radians and $\\theta$ half the peak position. $\\beta = 0.50\\times\\pi/180 = 8.727\\times10^{-3}$ rad, $\\cos20^\\circ = 0.9397$. $\\tau = \\dfrac{0.9\\times0.154}{8.727\\times10^{-3}\\times0.9397} = 16.9$ nm.',
      trap: 'Leaving $\\beta$ in degrees (gives 0.3 nm) or using $\\cos40^\\circ$ instead of $\\cos20^\\circ$.' },
    { id: 'xrd-021', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'structure factor', format: 'statements',
      q: 'KCl has the rock-salt structure (cube edge $a$), yet its powder pattern looks like that of a simple cubic crystal. Which statements are correct?',
      options: ['K$^+$ and Cl$^-$ have the same number of electrons, so their form factors are nearly equal.', 'Reflections with $h, k, l$ all odd almost vanish.', 'The apparent simple cubic lattice constant is $2a$.', 'The true Bravais lattice of KCl is fcc.'], answer: [0, 1, 3],
      sol: 'For rock salt, $F = 4(f_+ + f_-)$ for all-even and $4(f_+ - f_-)$ for all-odd indices. <b>Equal electrons:</b> true: both ions have 18. <b>All-odd vanish:</b> true, since $f_+ \\approx f_-$. <b>$2a$:</b> false. Only all-even lines remain, $(200), (220), (222), \\ldots$, which look like $(100), (110), (111)$ of a simple cubic lattice with edge $a/2$, the K-Cl distance. <b>fcc:</b> true: the X-rays simply cannot tell K$^+$ from Cl$^-$.',
      trap: 'A pattern that looks simple cubic need not be simple cubic: nearly identical scatterers can hide the real lattice.' },
    { id: 'xrd-022', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'peak shift',
      q: 'On heating a crystal, a Bragg peak at $\\theta = 30.00^\\circ$ moves to $\\theta = 29.95^\\circ$ (same wavelength). The fractional increase in the plane spacing, $\\Delta d/d$, is ______ $\\times10^{-3}$ (to two decimal places).',
      answer: 1.51, tol: 0.02, calc: () => -(1 / Math.tan(30 * D)) * (-0.05 * D) * 1e3,
      sol: 'Differentiate $2d\\sin\\theta = n\\lambda$ at fixed $\\lambda$: $\\Delta d\\sin\\theta + d\\cos\\theta\\,\\Delta\\theta = 0$, so $\\dfrac{\\Delta d}{d} = -\\cot\\theta\\,\\Delta\\theta$. With $\\Delta\\theta = -0.05^\\circ = -8.727\\times10^{-4}$ rad and $\\cot30^\\circ = 1.732$: $\\Delta d/d = 1.51\\times10^{-3}$. Lattice expansion moves peaks to lower angles.',
      trap: 'Using $\\Delta\\theta$ in degrees (gives 0.087), or $\\tan\\theta$ instead of $\\cot\\theta$.' },
    { id: 'xrd-023', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'structure factor',
      q: 'CsCl has Cs at $(0,0,0)$ and Cl at $(\\tfrac12,\\tfrac12,\\tfrac12)$ in a cubic cell. The structure factor of the $(100)$ reflection is',
      options: ['$f_{\\rm Cs} + f_{\\rm Cl}$', '$0$', '$f_{\\rm Cs} - f_{\\rm Cl}$', '$2f_{\\rm Cs}$'], answer: 2,
      sol: '$F = f_{\\rm Cs} + f_{\\rm Cl}\\,e^{i\\pi(h+k+l)}$. For $(100)$, $h + k + l = 1$ and $e^{i\\pi} = -1$, so $F = f_{\\rm Cs} - f_{\\rm Cl}$: weak but not zero, because the two ions differ. If both atoms were the same (bcc) this line would vanish.',
      trap: 'Applying the bcc rule and answering 0. The bcc rule needs identical atoms at the corner and the centre.' },
    { id: 'xrd-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'neutron diffraction', unit: 'Å',
      q: 'Neutrons of kinetic energy $0.025$ eV are used for diffraction. Their wavelength is ______ Å (to two decimal places). Take $m_n = 1.675\\times10^{-27}$ kg.',
      answer: 1.81, tol: 0.02, calc: () => C.h / Math.sqrt(2 * C.mn * 0.025 * C.e) * 1e10,
      sol: '$\\lambda = \\dfrac{h}{\\sqrt{2m_nE}} = \\dfrac{6.626\\times10^{-34}}{\\sqrt{2\\times1.675\\times10^{-27}\\times0.025\\times1.602\\times10^{-19}}} = \\dfrac{6.626\\times10^{-34}}{3.663\\times10^{-24}} = 1.81\\times10^{-10}$ m. Thermal neutrons are naturally the right wavelength for crystals.',
      trap: 'Forgetting to convert eV to joules (multiply by $1.602\\times10^{-19}$).' },
    { id: 'xrd-025', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Ewald sphere',
      q: 'In the Ewald construction (wave vector $\\vec k$ of length $2\\pi/\\lambda$ ending at the reciprocal-lattice origin), a diffracted beam appears when',
      options: ['a reciprocal-lattice point lies on the sphere of radius $2\\pi/\\lambda$ centred at the start of $\\vec k$', 'the sphere encloses the reciprocal-lattice origin', 'a direct-lattice point lies on the sphere', 'the sphere has radius equal to the lattice constant'], answer: 0,
      sol: 'Elastic scattering keeps $|\\vec k\'| = |\\vec k|$, so the scattered wave vector ends on the sphere. The Laue condition requires $\\vec k\' - \\vec k = \\vec G$. Both hold when a reciprocal-lattice point (other than the origin) lies on the sphere; the diffracted beam then points from the sphere\'s centre to that point.',
      trap: 'Using the direct lattice: the construction lives in reciprocal space.' },
    { id: 'xrd-026', type: 'nat', level: 3, exams: ['jam'], sub: 'indexing',
      q: 'How many distinct powder lines does an fcc crystal of identical atoms give with $h^2 + k^2 + l^2 \\le 12$?',
      answer: 5, tol: 0,
      sol: 'Allowed fcc indices are all odd or all even. With $h^2 + k^2 + l^2 \\le 12$: $(111)$ 3, $(200)$ 4, $(220)$ 8, $(311)$ 11, $(222)$ 12. Five lines.',
      trap: 'Counting $(100)$, $(110)$, $(210)$ and similar mixed sets that fcc forbids.' },
    { id: 'xrd-027', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'missing reflections',
      q: 'Which reflection is allowed for an fcc lattice of identical atoms but missing for the diamond structure?',
      options: [`$${hkl(2, 0, 0)}$`, `$${hkl(2, 2, 0)}$`, `$${hkl(1, 1, 1)}$`, `$${hkl(3, 1, 1)}$`], answer: 0,
      sol: 'The diamond structure factor is $F_{\\rm fcc}\\times[1 + e^{i\\pi(h+k+l)/2}]$. For $(200)$: $1 + e^{i\\pi} = 0$. For $(220)$: $1 + e^{2\\pi i} = 2$. For $(111)$ and $(311)$: $1 \\pm i$, of size $\\sqrt2$. So $(200)$ (and also $(222)$) disappear in diamond.',
      trap: 'All four are allowed for fcc. The extra cancellation comes from the second atom at $(\\tfrac14,\\tfrac14,\\tfrac14)$.' },
    { id: 'xrd-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'temperature', format: 'statements',
      q: 'A crystal is heated (well below melting). Which changes in its X-ray diffraction pattern are expected from the extra thermal vibration of the atoms?',
      options: ['The Bragg peak intensities decrease.', 'The decrease is larger for high-angle peaks than for low-angle ones.', 'The Bragg peaks become much broader.', 'The diffuse background between the peaks rises.'], answer: [0, 1, 3],
      sol: 'The Debye-Waller factor multiplies each peak by $e^{-2W}$ with $2W \\propto G^2\\langle u^2\\rangle$: <b>lower peaks</b> (true), <b>much more so at large $G$</b>, i.e. high angle (true). The intensity taken from the peaks reappears as <b>thermal diffuse scattering</b> between them (true). The peaks stay sharp (false): vibration does not destroy the long-range order, it only blurs each atom about its site.',
      trap: 'Expecting thermal motion to broaden the peaks. Broadening comes from small crystallites or strain, not from vibration.' },
    { id: 'xrd-029', type: 'mcq', level: 3, exams: ['jam'], sub: 'diffractometer',
      q: 'In a diffractometer with the source fixed, the sample is turned through an angle $\\alpha$ to bring new planes into reflection. To catch the reflected beam, the detector must turn through',
      options: ['$\\alpha/2$', '$\\alpha$', '$2\\alpha$', '$4\\alpha$'], answer: 2,
      sol: 'Turning the planes by $\\alpha$ raises the glancing angle $\\theta$ by $\\alpha$, and the beam is deviated by $2\\theta$. So the reflected beam turns through $2\\alpha$, and the detector must follow at twice the sample\'s rate. This is the $\\theta$-$2\\theta$ geometry.',
      trap: 'The same factor 2 as for a rotating mirror: deviation is twice the glancing angle.' },

    // ---------- level 4 ----------
    { id: 'xrd-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'indexing', unit: 'Å',
      q: 'A cubic powder gives its first two lines at $\\theta = 21.68^\\circ$ and $\\theta = 25.25^\\circ$ with $\\lambda = 1.54$ Å. Identify the structure from the lines and find the lattice constant, ______ Å (to two decimal places).',
      answer: 3.61, tol: 0.02, calc: () => 1.54 * S3 / (2 * Math.sin(21.68 * D)),
      sol: '$\\sin^2 21.68^\\circ = 0.1365$ and $\\sin^2 25.25^\\circ = 0.1820$; ratio $1.333 = 4/3$. The first two lines in the ratio $3:4$ mean $(111)$ and $(200)$: fcc. (Simple cubic would give $1:2$, bcc $2:4 = 1:2$, diamond $3:8$.) From $(111)$: $d = 1.54/(2\\times0.3694) = 2.084$ Å and $a = \\sqrt3\\,d = 3.61$ Å.',
      trap: 'Comparing the angles ($21.68/25.25$) instead of $\\sin^2\\theta$.' },
    { id: 'xrd-031', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'indexing',
      q: 'The first eight lines of a cubic powder pattern have $\\sin^2\\theta$ in the ratio $1:2:3:4:5:6:7:8$. The crystal is',
      options: ['simple cubic', 'body-centred cubic', 'face-centred cubic', 'diamond cubic'], answer: 1,
      sol: 'bcc allows $h^2+k^2+l^2 = 2, 4, 6, 8, 10, 12, 14, 16$, which is $1:2:\\ldots:8$. Simple cubic would give $1, 2, 3, 4, 5, 6, 8, 9$: the value 7 cannot be a sum of three squares, so a ratio with 7 in it rules simple cubic out. fcc and diamond start $3:4$ and $3:8$.',
      trap: 'The first six lines of simple cubic and bcc have the same ratios. Only the seventh line decides.' },
    { id: 'xrd-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'structure factor',
      q: 'In a rock-salt crystal take the form factors as $f_A = 11$ and $f_B = 17$ for both reflections (a crude approximation that ignores their fall with angle). The ratio of structure-factor intensities $|F_{200}|^2/|F_{111}|^2$ is ______ (to one decimal place).',
      answer: 21.8, tol: 0.2, calc: () => ((11 + 17) / (17 - 11)) ** 2,
      sol: 'Rock salt: $F = 4(f_A + f_B)$ when $h, k, l$ are all even and $4(f_A - f_B)$ when all odd. $|F_{200}|^2/|F_{111}|^2 = (28/6)^2 = 21.8$. Real intensities also include multiplicity (6 for $\\{200\\}$, 8 for $\\{111\\}$) and angle factors.',
      trap: 'Using $f_A + f_B$ for both lines (ratio 1), or $(28/6)$ without squaring.' },
    { id: 'xrd-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Laue condition', format: 'statements',
      q: 'Which statements are correct?',
      options: ['In Bragg diffraction the X-ray photon gives part of its energy to the lattice.', 'The Laue condition $\\vec k\' - \\vec k = \\vec G$ is equivalent to Bragg\'s law.', 'A monochromatic beam on a fixed single crystal in a general orientation always gives several diffracted beams.', 'The shortest reciprocal-lattice vector perpendicular to the $(hkl)$ planes has length $2\\pi/d_{hkl}$.'], answer: [1, 3],
      sol: '<b>Energy loss:</b> false: Bragg peaks are elastic ($|\\vec k\'| = |\\vec k|$); inelastic scattering by phonons gives the weak diffuse background. <b>Laue = Bragg:</b> true: $|\\vec G| = 2k\\sin\\theta$ with $|\\vec G| = 2\\pi n/d$ gives $2d\\sin\\theta = n\\lambda$. <b>Always several beams:</b> false: in general no reciprocal-lattice point lies exactly on the Ewald sphere, which is why one rotates the crystal, uses a powder, or uses white radiation. <b>$2\\pi/d$:</b> true.',
      trap: 'Expecting diffraction from any crystal in any orientation: a monochromatic beam needs the right angle.' },
    { id: 'xrd-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'electron diffraction', unit: 'V',
      q: 'Electrons accelerated from rest through a voltage $V$ give a first-order Bragg reflection at $\\theta = 30^\\circ$ from planes $1.5$ Å apart. $V$ is ______ volts (to one decimal place). Ignore relativity.',
      answer: 66.8, tol: 0.7, calc: () => C.h ** 2 / (2 * C.me * C.e * (1.5e-10) ** 2),
      sol: 'Bragg: $\\lambda = 2d\\sin\\theta = 2\\times1.5\\times0.5 = 1.5$ Å. Then $V = \\dfrac{h^2}{2m_ee\\lambda^2} = \\dfrac{(6.626\\times10^{-34})^2}{2\\times9.109\\times10^{-31}\\times1.602\\times10^{-19}\\times(1.5\\times10^{-10})^2} = 66.8$ V. (Check with $\\lambda \\approx 12.26/\\sqrt V$ Å: $(12.26/1.5)^2 = 66.8$.)',
      trap: 'Using $\\theta$ as the angle from the normal ($\\cos30^\\circ$) gives $\\lambda = 2.6$ Å and the wrong voltage.' },
    { id: 'xrd-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'peak shift',
      q: 'A uniform lattice expansion of a cubic crystal makes the powder peaks',
      options: ['shift to higher angle, all by the same amount', 'shift to lower angle, all by the same amount', 'shift to higher angle, the high-angle peaks more', 'shift to lower angle, the high-angle peaks more'], answer: 3,
      sol: 'From $\\Delta\\theta = -\\tan\\theta\\,(\\Delta d/d)$: a larger $d$ means a smaller $\\theta$, and since $\\tan\\theta$ grows with $\\theta$, high-angle peaks move most. That is why precise lattice constants are taken from back-reflection peaks near $\\theta = 90^\\circ$.',
      trap: 'Expecting a rigid shift of the whole pattern; the shift scales with $\\tan\\theta$.' },
    { id: 'xrd-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'indexing',
      q: 'The seventh line of the powder pattern of a bcc metal (counting from the lowest angle) comes from the planes',
      options: ['$(400)$', '$(222)$', '$(310)$', '$(321)$'], answer: 3,
      sol: 'bcc lines have $h^2 + k^2 + l^2 = 2, 4, 6, 8, 10, 12, 14, \\ldots$: $(110), (200), (211), (220), (310), (222), (321)$. The seventh, $N = 14$, is $(321)$. In simple cubic $N = 7$ cannot occur, but in bcc $N = 14 = 9 + 4 + 1$ is fine.',
      trap: 'Counting to $(400)$ by skipping $N = 14$ as if it were forbidden.' },
    { id: 'xrd-037', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'structure factor', format: 'multi',
      q: 'For the diamond structure (identical atoms), which of these reflections are present?',
      options: [`$${hkl(1, 1, 1)}$`, `$${hkl(2, 0, 0)}$`, `$${hkl(2, 2, 0)}$`, `$${hkl(2, 2, 2)}$`], answer: [0, 2],
      sol: 'Diamond: $F = F_{\\rm fcc}[1 + e^{i\\pi(h+k+l)/2}]$. $(111)$: fcc-allowed, factor $1 + e^{3i\\pi/2} = 1 - i \\ne 0$: present. $(200)$: $1 + e^{i\\pi} = 0$: absent. $(220)$: $1 + e^{2i\\pi} = 2$: present. $(222)$: $1 + e^{3i\\pi} = 0$: absent (it shows only very faintly in real Si because the bonding electrons are not spherical).',
      trap: 'All even indices are not automatically present in diamond: they need $h + k + l$ divisible by 4.' },
    { id: 'xrd-038', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'hexagonal', unit: 'Å',
      q: 'A hexagonal crystal has $a = 3.0$ Å and $c = 5.0$ Å. Using $\\dfrac{1}{d^2} = \\dfrac43\\cdot\\dfrac{h^2 + hk + k^2}{a^2} + \\dfrac{l^2}{c^2}$, the spacing of the $(101)$ planes is ______ Å (to two decimal places).',
      answer: 2.31, tol: 0.01, calc: () => 1 / Math.sqrt(4 / 27 + 1 / 25),
      sol: '$h^2 + hk + k^2 = 1$, so $\\dfrac1{d^2} = \\dfrac43\\cdot\\dfrac19 + \\dfrac1{25} = 0.1481 + 0.0400 = 0.1881$ Å$^{-2}$, and $d = 2.31$ Å.',
      trap: 'Dropping the factor $4/3$, which comes from the $120^\\circ$ angle between the basal axes.' },

    // ---------- level 5 ----------
    { id: 'xrd-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'structure factor',
      q: 'A zinc-blende crystal has atom A at the fcc sites and atom B displaced by $(\\tfrac14,\\tfrac14,\\tfrac14)a$ from each. Take $f_A = 30$ and $f_B = 16$ for both reflections. The ratio $|F_{111}|^2/|F_{200}|^2$ is ______ (to two decimal places).',
      answer: 5.90, tol: 0.05, calc: () => (30 ** 2 + 16 ** 2) / (30 - 16) ** 2,
      sol: '$F = F_{\\rm fcc}\\,[f_A + f_B\\,e^{i\\pi(h+k+l)/2}]$ with $F_{\\rm fcc}$ factor 4. $(111)$: $e^{3i\\pi/2} = -i$, so $F = 4(30 - 16i)$ and $|F|^2 = 16(900 + 256) = 16\\times1156$. $(200)$: $e^{i\\pi} = -1$, $F = 4(30 - 16) = 56$, $|F|^2 = 16\\times196$. Ratio $1156/196 = 5.90$. Unlike diamond, $(200)$ survives because A and B differ.',
      trap: 'Adding the B wave in phase for $(111)$ ($|30 + 16|^2$) instead of a quarter cycle out of phase.' },
    { id: 'xrd-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'order-disorder', format: 'statements',
      q: 'An alloy AB has a bcc arrangement of sites. Above a critical temperature A and B occupy the sites at random; below it, A takes the corners and B the body centres. Which statements are correct?',
      options: ['In the random phase, reflections with $h + k + l$ odd are absent.', 'In the ordered phase, extra (superlattice) reflections with $h + k + l$ odd appear.', 'The superlattice reflections have intensity proportional to $(f_A - f_B)^2$.', 'The ordered phase still has a bcc Bravais lattice.'], answer: [0, 1, 2],
      sol: '<b>Random:</b> every site holds an average atom $\\bar f = (f_A + f_B)/2$, which is bcc, so odd $h + k + l$ cancel (true). <b>Ordered:</b> $F = f_A + f_B(-1)^{h+k+l}$, so odd lines appear with $F = f_A - f_B$ (true), and their intensity goes as $(f_A - f_B)^2$ (true). <b>Bravais lattice:</b> false: when the corner and centre differ, the lattice is simple cubic with a two-atom basis (the CsCl type). The growth of superlattice lines below the critical temperature measures the degree of order.',
      trap: 'If A and B have nearly equal form factors (neighbours in the periodic table), the superlattice lines are too weak for X-rays; neutrons are then used.' },
    { id: 'xrd-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Laue method',
      q: 'An X-ray tube run at $30$ kV gives a continuous spectrum from its short-wavelength limit upward. A fixed crystal presents planes with $d = 2.0$ Å at a glancing angle of $20^\\circ$. Assuming every wavelength above the limit is present, how many orders $n$ are reflected by these planes at the same time?',
      answer: 3, tol: 0, calc: () => Math.floor((2 * 2.0 * Math.sin(20 * D)) / (C.hc_eVnm / 30000 * 10)),
      sol: 'Short-wavelength (Duane-Hunt) limit: $\\lambda_{\\min} = hc/eV = 1239.8/30000$ nm $= 0.413$ Å. The planes reflect $\\lambda_n = 2d\\sin\\theta/n = 1.368/n$ Å. These must be at least $0.413$ Å: $n \\le 1.368/0.413 = 3.31$. So orders $n = 1, 2, 3$ ($\\lambda = 1.368$, $0.684$, $0.456$ Å) all appear in the same spot.',
      trap: 'Thinking a Laue spot has one wavelength: harmonics $\\lambda/2$, $\\lambda/3$ land in the same direction.' },
    { id: 'xrd-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'line broadening',
      q: 'Peak widths $\\beta$ (in radians, instrument width removed) of a powder are analysed with $\\beta\\cos\\theta = \\dfrac{K\\lambda}{\\tau} + 4\\varepsilon\\sin\\theta$ (Williamson-Hall), where $\\tau$ is the crystallite size and $\\varepsilon$ the microstrain. Plotting $\\beta\\cos\\theta$ against $\\sin\\theta$ for many peaks,',
      options: ['the slope gives the size and the intercept gives the strain', 'the intercept gives the size and the slope gives the strain', 'both the size and the strain come from the slope', 'a horizontal line means the sample is strained and has very large grains'], answer: 1,
      sol: 'The equation is a straight line $y = c + mx$ with $y = \\beta\\cos\\theta$ and $x = \\sin\\theta$. Intercept $c = K\\lambda/\\tau$, so $\\tau = K\\lambda/c$. Slope $m = 4\\varepsilon$. A horizontal line ($m = 0$) means no strain: the broadening is all from small crystallites, as Scherrer assumes.',
      trap: 'Size broadening goes as $1/\\cos\\theta$ and strain broadening as $\\tan\\theta$; the plot separates them because only strain depends on $\\sin\\theta$ after multiplying by $\\cos\\theta$.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'xrd-t21', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'missing reflections',
      make(r) {
        const bcc = r() < 0.5, not = r() < 0.5;
        const all = ['100', '110', '111', '200', '210', '211', '220', '221', '300', '310', '311', '222'];
        const ok = (s) => { const [h, k, l] = s.split('').map(Number); return bcc ? (h + k + l) % 2 === 0 : (h % 2 === k % 2 && k % 2 === l % 2); };
        const yes = all.filter(ok).map((s) => `$(${s})$`), no = all.filter((s) => !ok(s)).map((s) => `$(${s})$`);
        const o = not ? q5odd(r, no, yes) : q5odd(r, yes, no);
        return { q: `A crystal has the ${bcc ? 'body' : 'face'}-centred cubic structure with one atom per lattice point. Indexed on the conventional cubic cell, which reflection ${not ? 'is <b>absent</b> from' : 'appears in'} its powder pattern?`, ...o,
          sol: bcc ? 'bcc: atoms at $(0,0,0)$ and $(\\tfrac12,\\tfrac12,\\tfrac12)$ give $F = f[1 + e^{i\\pi(h+k+l)}]$, zero when $h + k + l$ is odd. Allowed: $(110), (200), (211), (220), (310), (222), \\dots$'
            : 'fcc: four atoms per cell give $F = f[1 + e^{i\\pi(h+k)} + e^{i\\pi(k+l)} + e^{i\\pi(h+l)}]$, which is $4f$ when $h, k, l$ are all even or all odd and zero when they are mixed. Allowed: $(111), (200), (220), (311), (222), \\dots$',
          trap: 'bcc needs $h + k + l$ even; fcc needs $h, k, l$ unmixed. $(100)$ is absent in both.' };
      } },
    { id: 'xrd-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'methods', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['The Laue method uses a fixed single crystal and a continuous range of wavelengths.', 'The powder method uses one wavelength and crystallites in all orientations.', 'In Bragg\'s law $2d\\sin\\theta = n\\lambda$, $\\theta$ is measured from the planes, not from their normal.',
          'The diffracted beam is turned through $2\\theta$ from the incident beam.', 'No Bragg reflection is possible from planes with $d < \\lambda/2$.'];
        const F = ['The Laue method uses a single wavelength.', 'In Bragg\'s law, $\\theta$ is measured from the normal to the planes.', 'The diffracted beam is turned through $\\theta$ from the incident beam.',
          'Neutrons cannot be diffracted by crystals because they carry no charge.', 'Planes with $d < \\lambda/2$ give their first-order reflection at small angles.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about X-ray diffraction are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'Laue: white radiation on a fixed crystal; each set of planes picks the wavelength that satisfies Bragg. Powder: monochromatic radiation; some crystallites always sit at the right angle, giving cones. $\\theta$ is the glancing angle to the planes and the beam turns by $2\\theta$. Since $\\sin\\theta \\le 1$, reflection needs $\\lambda \\le 2d$. Neutrons scatter from nuclei (and magnetic moments) and diffract well; only their wavelength matters.',
          trap: 'Glancing angle $\\theta$ versus deviation $2\\theta$: the detector reads $2\\theta$.' };
      } },
    { id: 'xrd-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'indexing', unit: 'degrees',
      make(r) {
        const t1 = Q5.pick(r, 10, 40, 0.1);
        const t2 = Math.asin(Math.sin(t1 * Math.PI / 180) * 2 / Math.sqrt(3)) * 180 / Math.PI;
        return { q: `In the powder pattern of a face-centred cubic metal, the $(111)$ reflection appears at a Bragg angle $\\theta = ${t1}^\\circ$. With the same X-rays, the $(200)$ reflection appears at $\\theta = $ ______ degrees (to two decimal places).`,
          answer: Q5.round(t2, 2), tol: 0.02, t1,
          sol: `$\\sin\\theta \\propto 1/d \\propto \\sqrt{h^2 + k^2 + l^2}$. So $\\sin\\theta_{200} = \\sin\\theta_{111}\\sqrt{4/3} = \\sin${t1}^\\circ\\times1.1547 = ${Q5.round(Math.sin(t1 * Math.PI / 180) * 2 / Math.sqrt(3), 4)}$, giving $\\theta = ${Q5.round(t2, 2)}^\\circ$.`,
          trap: 'Scale $\\sin\\theta$, not $\\theta$ itself.' };
      },
      verify: (p) => { const lam = 0.154, a = lam * Math.sqrt(3) / (2 * Math.sin(p.t1 * Math.PI / 180)), d = a / 2; return Math.asin(lam / (2 * d)) * 180 / Math.PI; } },
    { id: 'xrd-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'peak shift',
      make(r) {
        const [what, low] = Q5.choose(r, [['the sample is heated, so its lattice expands', true], ['the sample is compressed, so its lattice shrinks', false], ['the X-ray wavelength is changed to a longer one', false], ['the X-ray wavelength is changed to a shorter one', true]]);
        const right = low ? 'to smaller angles $2\\theta$' : 'to larger angles $2\\theta$';
        const o = Q5.mcqOptions(r, right, ['to smaller angles $2\\theta$', 'to larger angles $2\\theta$', 'nowhere: the peaks stay where they are', 'nowhere, but each peak splits in two'].filter((s) => s !== right));
        return { q: `A powder diffraction pattern is recorded. Then ${what}. The peaks move`, ...o,
          sol: `Bragg: $\\sin\\theta = \\lambda/2d$. ${what.includes('lattice') ? `Here $d$ ${low ? 'grows, so $\\sin\\theta$ falls' : 'shrinks, so $\\sin\\theta$ grows'}.` : `Here $\\lambda$ ${low ? 'shrinks, so $\\sin\\theta$ falls' : 'grows, so $\\sin\\theta$ grows'}.`} The peaks move ${low ? 'to smaller' : 'to larger'} angles, and high-angle peaks move the most.`,
          trap: 'Larger spacing means smaller angles: $\\sin\\theta \\propto 1/d$.' };
      } },
    { id: 'xrd-t25', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'structure factor',
      make(r) {
        const f1 = Q5.int(r, 20, 60), f2 = Q5.int(r, 5, 19), up = r() < 0.5;
        const ratio = up ? ((f1 + f2) / (f1 - f2)) ** 2 : ((f1 - f2) / (f1 + f2)) ** 2;
        return { q: `A crystal has the CsCl structure: a simple cubic lattice with ion A (form factor $${f1}$) at $(0,0,0)$ and ion B (form factor $${f2}$) at $(\\tfrac12,\\tfrac12,\\tfrac12)$. Ignoring all other factors, the intensity ratio $I_{${up ? '110' : '100'}}/I_{${up ? '100' : '110'}}$ is ______ (to three decimal places).`,
          answer: Q5.round(ratio, 3), tol: Math.max(0.002, Q5.round(0.002 * ratio, 4)), f1, f2, up,
          sol: `$F_{hkl} = f_A + f_Be^{i\\pi(h + k + l)}$: $f_A + f_B = ${f1 + f2}$ when $h + k + l$ is even, $f_A - f_B = ${f1 - f2}$ when odd. $I \\propto |F|^2$: $I_{110}/I_{100} = (${f1 + f2}/${f1 - f2})^2$, so the asked ratio is $${Q5.round(ratio, 3)}$. (If A and B were identical, $(100)$ would vanish: bcc.)`,
          trap: 'In CsCl the odd reflections are weak, not absent, because the two ions differ.' };
      },
      verify: (p) => { const F = (h, k, l) => { const ph = Math.PI * (h + k + l); return Math.hypot(p.f1 + p.f2 * Math.cos(ph), p.f2 * Math.sin(ph)) ** 2; }; return p.up ? F(1, 1, 0) / F(1, 0, 0) : F(1, 0, 0) / F(1, 1, 0); } },
    { id: 'xrd-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'Bragg law',
      make(r) {
        const lam = choose(r, [0.71, 1.54, 1.79, 1.94, 2.29]), n = choose(r, [1, 1, 1, 2]);
        const d = pick(r, Math.max(1.0, n * lam / 1.9), 4.5, 0.01);
        const th = Math.asin(n * lam / (2 * d)) / D;
        return { q: `X-rays of wavelength $${lam}$ Å reflect in order $n = ${n}$ from planes $${d}$ Å apart. The Bragg angle $\\theta$ is ______ degrees (to two decimal places).`,
          answer: round(th, 2), tol: 0.05, unit: 'degree', lam, n, d,
          sol: `$\\sin\\theta = \\dfrac{n\\lambda}{2d} = \\dfrac{${n}\\times${lam}}{2\\times${d}} = ${round(n * lam / (2 * d), 4)}$, so $\\theta = ${round(th, 2)}^\\circ$ (the detector reads $2\\theta = ${round(2 * th, 2)}^\\circ$).`,
          trap: 'Reporting $2\\theta$ instead of $\\theta$, or dropping the 2 in $2d$.' };
      },
      verify: (p) => Math.asin(p.n * p.lam / (2 * p.d)) * 180 / Math.PI },
    { id: 'xrd-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'Bragg law',
      make(r) {
        const lam = choose(r, [0.71, 1.54, 1.79, 1.94]), tt = pick(r, 20, 140, 0.1), n = 1;
        const d = n * lam / (2 * Math.sin(tt / 2 * D));
        return { q: `A powder diffractometer with $\\lambda = ${lam}$ Å records a peak at $2\\theta = ${tt}^\\circ$. The spacing of the reflecting planes is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: 0.003, unit: 'Å', lam, tt,
          sol: `$\\theta = ${round(tt / 2, 2)}^\\circ$, so $d = \\dfrac{\\lambda}{2\\sin\\theta} = \\dfrac{${lam}}{2\\times${round(Math.sin(tt / 2 * D), 4)}} = ${round(d, 3)}$ Å.`,
          trap: 'Using $2\\theta$ in place of $\\theta$.' };
      },
      verify: (p) => p.lam / (2 * Math.sin(p.tt / 2 * Math.PI / 180)) },
    { id: 'xrd-g03', type: 'nat', level: 3, exams: ['jam'], sub: 'indexing',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), L = LINES[key];
        const a = pick(r, 2.8, 6.0, 0.01), lam = 1.54, [h, k, l] = L.list[0], N = h * h + k * k + l * l;
        const th = round(Math.asin(lam * Math.sqrt(N) / (2 * a)) / D, 2);
        const aa = lam * Math.sqrt(N) / (2 * Math.sin(th * D));
        return { q: `A metal with the ${L.name} structure gives its lowest-angle powder line at $\\theta = ${th}^\\circ$ with $\\lambda = ${lam}$ Å. Its lattice constant is ______ Å (to two decimal places).`,
          answer: round(aa, 2), tol: 0.02, unit: 'Å', th, N, lam,
          sol: `For ${L.name}, ${RULE[key]}, so the first line is $${hkl(h, k, l)}$ with $h^2+k^2+l^2 = ${N}$. $d = \\lambda/(2\\sin\\theta) = ${round(lam / (2 * Math.sin(th * D)), 4)}$ Å, and $a = d\\sqrt{${N}} = ${round(aa, 2)}$ Å.`,
          trap: 'Assuming the first line is always $(100)$.' };
      },
      verify: (p) => p.lam * Math.sqrt(p.N) / (2 * Math.sin(p.th * Math.PI / 180)) },
    { id: 'xrd-g04', type: 'mcq', level: 2, exams: ['jam'], sub: 'indexing',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), L = LINES[key], i = int(r, 0, 4);
        const ord = ['first', 'second', 'third', 'fourth', 'fifth'][i];
        const pool = [...new Set(Object.values(LINES).flatMap((x) => x.list.slice(0, 6)).map((t) => hkl(...t)))];
        const right = hkl(...L.list[i]);
        const wrongs = [hkl(...LINES[key === 'fcc' ? 'diamond' : 'fcc'].list[i]), hkl(...LINES[key === 'bcc' ? 'sc' : 'bcc'].list[i]), ...pool.filter((s) => s !== right)];
        const o = mcqOptions(r, right, wrongs, (s) => `$${s}$`);
        return { q: `In the powder pattern of a ${L.name} crystal of identical atoms, the ${ord} line (counting from the lowest angle) comes from the planes`, ...o,
          sol: `For ${L.name}, ${RULE[key]}. In order of $h^2 + k^2 + l^2$ the lines are ${L.list.slice(0, i + 2).map((t) => `$${hkl(...t)}$`).join(', ')}, ... so the ${ord} is $${right}$.`,
          trap: 'Forgetting the missing reflections and counting every $(hkl)$.' };
      } },
    { id: 'xrd-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Scherrer',
      make(r) {
        const lam = choose(r, [0.154, 0.071, 0.179]), tt = pick(r, 20, 90, 0.5), b = pick(r, 0.1, 1.2, 0.05);
        const tau = 0.9 * lam / (b * D * Math.cos(tt / 2 * D));
        return { q: `A powder peak at $2\\theta = ${tt}^\\circ$ ($\\lambda = ${lam}$ nm) has a width (FWHM in $2\\theta$, instrument width removed) of $${b}^\\circ$. With $K = 0.9$, the Scherrer crystallite size is ______ nm (to one decimal place).`,
          answer: round(tau, 1), tol: Math.max(0.1, round(tau * 0.01, 1)), unit: 'nm', lam, tt, b,
          sol: `$\\tau = \\dfrac{K\\lambda}{\\beta\\cos\\theta} = \\dfrac{0.9\\times${lam}}{(${b}\\times\\pi/180)\\cos${round(tt / 2, 2)}^\\circ} = ${round(tau, 1)}$ nm.`,
          trap: 'Width in degrees instead of radians, or $\\cos 2\\theta$ instead of $\\cos\\theta$.' };
      },
      verify: (p) => 0.9 * p.lam / (p.b * Math.PI / 180 * Math.cos(p.tt / 2 * Math.PI / 180)) },
    { id: 'xrd-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'electron diffraction',
      make(r) {
        const V = choose(r, [25, 36, 50, 64, 81, 100, 120, 144, 200, 300, 400, 500, 1000]);
        const lam = lam_e(V);
        return { q: `Electrons are accelerated from rest through $${V}$ V. Their de Broglie wavelength (non-relativistic) is ______ Å (to three decimal places).`,
          answer: round(lam, 3), tol: Math.max(0.003, round(lam * 0.005, 3)), unit: 'Å', V,
          sol: `$\\lambda = \\dfrac{h}{\\sqrt{2m_eeV}} \\approx \\dfrac{12.26}{\\sqrt{${V}}}$ Å $= ${round(lam, 3)}$ Å.`,
          trap: 'Using the photon relation $\\lambda = hc/eV$.' };
      },
      verify: (p) => lam_e(p.V) },
    { id: 'xrd-g07', type: 'nat', level: 2, exams: ['jam'], sub: 'orders',
      make(r) {
        const lam = choose(r, [0.56, 0.71, 1.54, 1.79, 1.94, 2.29]);
        let d; do { d = pick(r, 1.2, 6, 0.05); } while (Math.abs(2 * d / lam - Math.round(2 * d / lam)) < 0.02);
        const n = Math.floor(2 * d / lam);
        return { q: `X-rays of wavelength $${lam}$ Å fall on planes $${d}$ Å apart. The highest order of Bragg reflection possible is ______.`,
          answer: n, tol: 0, lam, d,
          sol: `$n \\le 2d/\\lambda = ${round(2 * d / lam, 3)}$, so the highest whole order is $${n}$.`,
          trap: 'Rounding up instead of down.' };
      },
      verify: (p) => Math.floor(2 * p.d / p.lam) },
    { id: 'xrd-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'structure factor',
      make(r) {
        let fa, fb; do { fa = int(r, 3, 55); fb = int(r, 3, 55); } while (fa === fb);
        const ratio = ((fa + fb) / (fa - fb)) ** 2;
        return { q: `In a rock-salt (NaCl-type) crystal, take the ionic form factors as $f_1 = ${fa}$ and $f_2 = ${fb}$ for every reflection. The ratio $|F_{200}|^2/|F_{111}|^2$ is ______ (to two decimal places).`,
          answer: round(ratio, 2), tol: Math.max(0.01, round(ratio * 0.005, 2)), fa, fb,
          sol: `Rock salt: $F = 4(f_1 + f_2)$ for all-even and $4(f_1 - f_2)$ for all-odd indices. Ratio $= \\left(\\dfrac{${fa + fb}}{${Math.abs(fa - fb)}}\\right)^2 = ${round(ratio, 2)}$.`,
          trap: 'Forgetting to square, or using the fcc rule that gives equal $F$ for both.' };
      },
      verify: (p) => ((p.fa + p.fb) / (p.fa - p.fb)) ** 2 },
    ...r4.gens,
  ],
};
