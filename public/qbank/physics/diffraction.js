// Diffraction: Fraunhofer single slit (minima, intensity, secondary maxima), double slit and N slits (envelope,
// missing orders, principal and secondary maxima), the plane transmission grating (orders, dispersion, overlap,
// half-width, resolving power, oblique incidence), circular apertures and the Rayleigh criterion, Fresnel zones and
// zone plates, Babinet and Fourier optics. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const DEG = Math.PI / 180;

import * as Q5 from '../_util.js';

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
  topic: 'diffraction',
  items: [
    // ---------- level 1 ----------
    { id: 'dfr-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'single slit',
      q: 'In Fraunhofer diffraction by a single slit of width $a$, the dark fringes are at angles $\\theta$ given by',
      options: ['$a\\cos\\theta = m\\lambda$', '$a\\sin\\theta = m\\lambda$, $m = \\pm1, \\pm2, \\dots$', '$a\\sin\\theta = (m + \\tfrac12)\\lambda$', '$a\\sin\\theta = 2m\\lambda$'], answer: 1,
      sol: 'Split the slit into two halves. When $a\\sin\\theta = \\lambda$, each point in the top half has a partner in the bottom half whose path differs by $\\lambda/2$, so they cancel in pairs. Splitting into $2m$ strips gives the general rule $a\\sin\\theta = m\\lambda$ ($m \\neq 0$).',
      trap: 'The half-integer rule is the minimum condition for two slits; for a single slit the integer rule gives minima.' },
    { id: 'dfr-002', type: 'nat', level: 1, exams: ['jam'], sub: 'single slit', unit: 'mm',
      q: 'Light of wavelength $500$ nm passes through a slit $0.2$ mm wide. On a screen $2$ m away the width of the central bright band is ______ mm.',
      answer: 10, tol: 0, calc: () => 2 * 500e-9 * 2 / 0.2e-3 * 1000,
      sol: 'The first minima are at $\\sin\\theta \\approx \\lambda/a$, i.e. at $y = \\pm\\lambda D/a$. The central band is $2\\lambda D/a = 2(500\\times10^{-9})(2)/(2\\times10^{-4}) = 0.01$ m $= 10$ mm.',
      trap: 'Giving $\\lambda D/a = 5$ mm, the half-width, instead of the full width.' },
    { id: 'dfr-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'fresnel and fraunhofer',
      q: 'Fraunhofer diffraction differs from Fresnel diffraction in that',
      options: ['it happens only with sound', 'it needs white light', 'the aperture must be circular', 'the source and screen are effectively at infinite distance, so the wavefronts at the aperture are plane'], answer: 3,
      sol: 'In Fraunhofer (far-field) diffraction the incident and diffracted wavefronts are plane, usually made so with lenses. In Fresnel (near-field) diffraction the source or screen is at a finite distance, so the curvature of the wavefronts matters.' },
    { id: 'dfr-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'single slit',
      q: 'The width of a single slit is reduced. The central maximum of the diffraction pattern becomes',
      options: ['wider and dimmer', 'narrower and brighter', 'narrower and dimmer', 'unchanged'], answer: 0,
      sol: 'Angular half-width $\\approx \\lambda/a$ grows as $a$ falls, and less light gets through the narrower slit, so the pattern spreads out and dims.',
      trap: 'Thinking a smaller opening makes a smaller spot: diffraction works the other way.' },
    { id: 'dfr-005', type: 'nat', level: 1, exams: ['jam'], sub: 'grating', unit: 'degrees',
      q: 'A grating has $5000$ lines per cm. Light of wavelength $500$ nm falls on it normally. The first-order maximum is at ______ degrees from the normal (to two decimal places).',
      answer: 14.48, tol: 0.05, calc: () => Math.asin(500e-9 / 2e-6) / DEG,
      sol: 'Grating spacing $d = 1/5000$ cm $= 2\\ \\mu$m. $\\sin\\theta = \\lambda/d = 0.5/2 = 0.25$, so $\\theta = 14.48^\\circ$.',
      trap: 'Using 5000 lines per metre (instead of per cm) gives a sine larger than 1.' },
    { id: 'dfr-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'resolving power',
      q: 'By the Rayleigh criterion, the smallest angle between two point sources that a lens of aperture diameter $D$ can resolve is about',
      options: ['$D/\\lambda$', '$0.61D/\\lambda$', '$1.22\\lambda/D$', '$\\lambda/(2D)$'], answer: 2,
      sol: 'Two images are just resolved when the centre of one Airy disc falls on the first dark ring of the other, which for a circular aperture is at $\\sin\\theta = 1.22\\lambda/D$.' },

    // ---------- level 2 ----------
    { id: 'dfr-007', type: 'nat', level: 2, exams: ['jam'], sub: 'grating',
      q: 'A grating with $6000$ lines per cm is lit normally with light of wavelength $600$ nm. The highest order that can be seen is ______.',
      answer: 2, tol: 0, calc: () => Math.floor((1e-2 / 6000) / 600e-9),
      sol: '$d = 1/6000$ cm $= 1.667\\ \\mu$m. $\\sin\\theta = m\\lambda/d \\le 1$ needs $m \\le d/\\lambda = 2.78$, so $m_{\\max} = 2$.',
      trap: 'Rounding $2.78$ up to 3: the third order would need $\\sin\\theta > 1$.' },
    { id: 'dfr-008', type: 'msq', level: 2, exams: ['jam'], sub: 'single slit', format: 'statements',
      q: 'Which statements about Fraunhofer diffraction by a single slit are correct?',
      options: ['The secondary maxima get rapidly weaker (the first is under 5% of the central peak).', 'The central maximum is twice as wide as each secondary maximum.', 'The secondary maxima lie exactly midway between adjacent minima.', 'The minima are equally spaced in $\\sin\\theta$.'], answer: [0, 1, 3],
      sol: 'A: about 4.7%, 1.6%, 0.8%, ... B: the central band runs from $-\\lambda/a$ to $+\\lambda/a$ in $\\sin\\theta$; the others are $\\lambda/a$ wide. D: minima at $\\sin\\theta = m\\lambda/a$. C is false: the maxima satisfy $\\tan\\beta = \\beta$, so they sit slightly closer to the centre than the midpoints ($\\beta = 1.43\\pi$, not $1.5\\pi$).',
      trap: 'C is the usual approximation, but it is not exact, and exams test that.' },
    { id: 'dfr-009', type: 'nat', level: 2, exams: ['jam'], sub: 'resolving power', unit: 'μrad',
      q: 'A telescope with a $10$ cm objective observes at $550$ nm. Its limit of resolution (Rayleigh) is ______ microradians (to two decimal places).',
      answer: 6.71, tol: 0.05, calc: () => 1.22 * 550e-9 / 0.1 * 1e6,
      sol: '$\\theta = 1.22\\lambda/D = 1.22\\times550\\times10^{-9}/0.1 = 6.71\\times10^{-6}$ rad $= 6.71\\ \\mu$rad (about 1.4 arcseconds).' },
    { id: 'dfr-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'grating',
      q: 'The resolving power $\\lambda/\\Delta\\lambda$ of a plane grating with $N$ illuminated lines, used in order $m$, is',
      options: ['$m^2N$', '$mN$', '$N/m$', '$m/N$'], answer: 1,
      sol: 'A principal maximum has angular half-width $\\lambda/(Nd\\cos\\theta)$; the angular dispersion is $m/(d\\cos\\theta)$. Setting $\\Delta\\lambda\\cdot m/(d\\cos\\theta) = \\lambda/(Nd\\cos\\theta)$ gives $\\lambda/\\Delta\\lambda = mN$.' },
    { id: 'dfr-011', type: 'nat', level: 2, exams: ['jam'], sub: 'grating',
      q: 'The sodium D lines ($589.0$ nm and $589.6$ nm) are to be resolved in the first order. Using the mean wavelength $589.3$ nm, the minimum number of grating lines that must be illuminated is ______.',
      answer: 983, tol: 0, calc: () => Math.ceil(589.3 / 0.6),
      sol: '$N \\ge \\lambda/(m\\Delta\\lambda) = 589.3/0.6 = 982.2$. Lines come in whole numbers, so $N = 983$.',
      trap: 'Rounding $982.2$ down to 982 falls just short of the criterion.' },
    { id: 'dfr-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'missing orders',
      q: 'A grating has opaque spaces twice as wide as its transparent slits ($d = 3a$). The orders missing from its spectrum are',
      options: ['2, 4, 6, ...', '3 only', 'none', '3, 6, 9, ...'], answer: 3,
      sol: 'A principal maximum of order $m$ ($d\\sin\\theta = m\\lambda$) is missing if it falls on a single-slit minimum ($a\\sin\\theta = p\\lambda$). With $d = 3a$ this happens for $m = 3p$: orders 3, 6, 9, ...',
      trap: 'The ratio is $d/a$ (slit plus space over slit) $= 3$, not space over slit $= 2$.' },
    { id: 'dfr-013', type: 'nat', level: 2, exams: ['jam'], sub: 'single slit', unit: 'μm',
      q: 'The first diffraction minimum for light of wavelength $600$ nm passing through a single slit is at $30^\\circ$. The slit width is ______ μm (to one decimal place).',
      answer: 1.2, tol: 0.02, calc: () => 0.6 / Math.sin(30 * DEG),
      sol: '$a\\sin30^\\circ = \\lambda$, so $a = 0.6\\ \\mu\\text{m}/0.5 = 1.2\\ \\mu$m.' },
    { id: 'dfr-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'grating',
      q: 'The angular dispersion $d\\theta/d\\lambda$ of a grating of spacing $d$ in order $m$ at angle $\\theta$ is',
      options: ['$\\dfrac{m}{d\\cos\\theta}$', '$\\dfrac{m}{d\\sin\\theta}$', '$\\dfrac{d\\cos\\theta}{m}$', '$\\dfrac{md}{\\cos\\theta}$'], answer: 0,
      sol: 'Differentiate $d\\sin\\theta = m\\lambda$: $d\\cos\\theta\\,d\\theta = m\\,d\\lambda$. Higher orders and finer gratings spread the spectrum more.' },
    { id: 'dfr-015', type: 'msq', level: 2, exams: ['jam'], sub: 'resolving power', format: 'multi',
      q: 'Which of the following improve a telescope\'s ability to resolve two close stars?',
      options: ['A larger objective diameter', 'Observing at a shorter wavelength', 'An eyepiece of longer focal length', 'Higher magnification on its own'], answer: [0, 1],
      sol: 'The limit $1.22\\lambda/D$ improves with larger $D$ and smaller $\\lambda$. The eyepiece only magnifies the image the objective has already formed; it cannot separate Airy discs that already overlap ("empty magnification").' },
    { id: 'dfr-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'n slits',
      q: 'For Fraunhofer diffraction by $N$ equally spaced narrow slits, between two adjacent principal maxima there are',
      options: ['$N - 2$ minima and $N - 1$ secondary maxima', '$N + 1$ minima and $N$ secondary maxima', '$N - 1$ minima and $N - 2$ secondary maxima', '$N$ minima and $N - 1$ secondary maxima'], answer: 2,
      sol: 'The interference factor $\\sin^2(N\\delta/2)/\\sin^2(\\delta/2)$ vanishes at $\\delta = 2\\pi k/N$ for $k$ not a multiple of $N$: $N - 1$ zeros between principal maxima, with a secondary maximum between each pair of neighbouring zeros: $N - 2$ of them.' },

    // ---------- level 3 ----------
    { id: 'dfr-017', type: 'nat', level: 3, exams: ['jam'], sub: 'n slits',
      q: 'Four identical, equally spaced narrow slits are lit coherently. At a principal maximum, the intensity is how many times the intensity at the same point with only one slit open?',
      answer: 16, tol: 0, calc: () => 4 ** 2,
      sol: 'At a principal maximum all $N$ waves arrive in phase, so the amplitudes add: $4a$. Intensity goes as amplitude squared: $16$ times. (The extra energy at the peaks is balanced by darkness elsewhere.)',
      trap: 'Answering 4 adds intensities, which is right only for incoherent light.' },
    { id: 'dfr-018', type: 'nat', level: 3, exams: ['jam'], sub: 'double slit',
      q: 'A double slit has slit width $0.1$ mm and slit separation (centre to centre) $0.4$ mm. The number of bright interference fringes inside the central diffraction maximum is ______.',
      answer: 7, tol: 0, calc: () => 2 * 4 - 1,
      sol: 'The central diffraction maximum ends at $\\sin\\theta = \\lambda/a$, where the interference order is $d/a = 4$. That fourth order is missing (it falls on the diffraction zero). Inside are orders $-3$ to $+3$: $7$ fringes.',
      trap: 'Counting the missing $\\pm4$ orders gives 9.' },
    { id: 'dfr-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'single slit',
      q: 'The intensity in the Fraunhofer pattern of a single slit of width $a$ is ($I_0$ = central intensity)',
      options: ['$I_0\\dfrac{\\sin\\beta}{\\beta}$ with $\\beta = \\dfrac{\\pi a\\sin\\theta}{\\lambda}$', '$I_0\\left(\\dfrac{\\sin\\beta}{\\beta}\\right)^2$ with $\\beta = \\dfrac{\\pi a\\sin\\theta}{\\lambda}$', '$I_0\\cos^2\\beta$ with $\\beta = \\dfrac{\\pi a\\sin\\theta}{\\lambda}$', '$I_0\\left(\\dfrac{\\sin\\beta}{\\beta}\\right)^2$ with $\\beta = \\dfrac{2\\pi a\\sin\\theta}{\\lambda}$'], answer: 1,
      sol: 'Adding the wavelets across the slit (a phasor arc) gives amplitude $\\propto \\sin\\beta/\\beta$, where $2\\beta = (2\\pi/\\lambda)a\\sin\\theta$ is the phase difference between the two edges. Intensity is its square. Zeros at $\\beta = m\\pi$, i.e. $a\\sin\\theta = m\\lambda$, as they must be.',
      trap: 'With $\\beta = 2\\pi a\\sin\\theta/\\lambda$ the zeros would land at $a\\sin\\theta = m\\lambda/2$, which is wrong.' },
    { id: 'dfr-020', type: 'nat', level: 3, exams: ['jam'], sub: 'single slit',
      q: 'In a single-slit pattern, the intensity at the point where the phase difference between waves from the two edges of the slit is $\\pi$, as a fraction of the central intensity, is ______ (to three decimal places).',
      answer: 0.405, tol: 0.003, calc: () => (Math.sin(Math.PI / 2) / (Math.PI / 2)) ** 2,
      sol: 'Edge-to-edge phase $2\\beta = \\pi$, so $\\beta = \\pi/2$. $I/I_0 = (\\sin\\beta/\\beta)^2 = (1/(\\pi/2))^2 = 4/\\pi^2 = 0.405$.',
      trap: 'Taking $\\beta = \\pi$ (the edge-to-edge phase itself) gives zero.' },
    { id: 'dfr-021', type: 'msq', level: 3, exams: ['jam'], sub: 'grating', format: 'statements',
      q: 'White light (400 to 700 nm) falls normally on a plane grating. Which statements are correct?',
      options: ['Higher orders are spread out more.', 'The second-order spectrum overlaps the third-order spectrum.', 'In each order, red light is deviated less than violet.', 'The zeroth order is white, with no dispersion.'], answer: [0, 1, 3],
      sol: 'A: dispersion $m/(d\\cos\\theta)$ grows with $m$. B: the second order reaches $2\\times700 = 1400$ nm of path, the third starts at $3\\times400 = 1200$ nm, so they overlap. C is false: $\\sin\\theta = m\\lambda/d$, so red (longer $\\lambda$) is deviated more, the opposite of a prism. D: at $m = 0$ every wavelength goes straight through.',
      trap: 'Carrying over the prism rule (violet bent most) to gratings.' },
    { id: 'dfr-022', type: 'nat', level: 3, exams: ['jam'], sub: 'grating', unit: 'nm',
      q: 'In a grating spectrum, the third-order line of an unknown wavelength falls exactly on the second-order line of $600$ nm. The unknown wavelength is ______ nm.',
      answer: 400, tol: 0, calc: () => 2 * 600 / 3,
      sol: 'Same angle means the same $m\\lambda$: $3\\lambda = 2\\times600$, so $\\lambda = 400$ nm.' },
    { id: 'dfr-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'circular aperture',
      q: 'A camera lens of focal length $50$ mm is set to aperture diameter $25$ mm. For light of $500$ nm, the radius of the Airy disc (to its first dark ring) on the sensor is about',
      options: ['$0.6\\ \\mu$m', '$2.4\\ \\mu$m', '$12\\ \\mu$m', '$1.2\\ \\mu$m'], answer: 3,
      sol: '$r = 1.22\\lambda f/D = 1.22\\times(500\\times10^{-9})\\times(50/25) = 1.22\\times10^{-6}$ m. Note that $f/D$ is the f-number (here f/2): the spot size depends only on it and $\\lambda$.' },
    { id: 'dfr-024', type: 'nat', level: 3, exams: ['jam'], sub: 'resolving power', unit: 'm',
      q: 'A telescope of aperture $5$ m observes the Moon ($3.84\\times10^8$ m away) at $550$ nm. The smallest separation between two features on the Moon that it can resolve, at the diffraction limit, is ______ m (to one decimal place).',
      answer: 51.5, tol: 0.5, calc: () => 1.22 * 550e-9 / 5 * 3.84e8,
      sol: '$\\theta = 1.22\\lambda/D = 1.22\\times550\\times10^{-9}/5 = 1.342\\times10^{-7}$ rad. Separation $= \\theta\\times$ distance $= 1.342\\times10^{-7}\\times3.84\\times10^8 = 51.5$ m. (In practice the atmosphere blurs far more than this.)' },
    { id: 'dfr-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'fresnel zones',
      q: 'A plane wave of wavelength $\\lambda$ falls on an aperture; a point $P$ is a distance $b$ behind it on the axis. The radius of the $n$th Fresnel half-period zone (for $b \\gg \\lambda$) is',
      options: ['$\\sqrt{n\\lambda b}$', '$n\\lambda b$', '$\\sqrt{n\\lambda/b}$', '$\\sqrt{2n\\lambda b}$'], answer: 0,
      sol: 'The edge of zone $n$ is $b + n\\lambda/2$ from $P$. By Pythagoras $r_n^2 = (b + n\\lambda/2)^2 - b^2 \\approx n\\lambda b$. So $r_n = \\sqrt{n\\lambda b}$, and every zone has the same area $\\pi\\lambda b$.' },
    { id: 'dfr-026', type: 'nat', level: 3, exams: ['jam'], sub: 'zone plate', unit: 'cm',
      q: 'The first zone of a zone plate has radius $0.5$ mm. For light of $500$ nm, its principal focal length is ______ cm.',
      answer: 50, tol: 0, calc: () => (0.5e-3) ** 2 / 500e-9 * 100,
      sol: 'From $r_n^2 = n\\lambda f$: $f = r_1^2/\\lambda = (0.5\\times10^{-3})^2/(5\\times10^{-7}) = 0.5$ m $= 50$ cm.' },
    { id: 'dfr-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'zone plate',
      q: 'Besides its principal focus at $f$, a zone plate also brings light to a focus at',
      options: ['$2f$, $3f$, ...', 'no other points', '$f/3$, $f/5$, $f/7$, ...', '$f/2$, $f/4$, $f/6$, ...'], answer: 2,
      sol: 'At distance $f/3$, each zone of the plate holds three zones as seen from that point; two of them cancel and one survives from every open zone, so they still add in phase. The same works for any odd fraction. At $f/2$ each open zone holds two zones, which cancel.' },
    { id: 'dfr-028', type: 'nat', level: 3, exams: ['jam'], sub: 'grating', unit: 'degrees',
      q: 'A grating with spacing $2\\ \\mu$m is lit normally with $500$ nm light. The angle between the first-order and second-order maxima on the same side is ______ degrees (to two decimal places).',
      answer: 15.52, tol: 0.05, calc: () => (Math.asin(0.5) - Math.asin(0.25)) / DEG,
      sol: '$\\sin\\theta_1 = 0.25$, $\\theta_1 = 14.48^\\circ$; $\\sin\\theta_2 = 0.5$, $\\theta_2 = 30.00^\\circ$. Difference $15.52^\\circ$.',
      trap: 'Doubling the first-order angle ($28.96^\\circ$) assumes the angles, not their sines, go up in steps.' },
    { id: 'dfr-029', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'fresnel zones', format: 'statements',
      q: 'A plane wave falls on a circular hole; the intensity is observed on the axis behind it. Which statements are correct?',
      options: ['If the hole exposes exactly the first Fresnel zone, the axial intensity is about four times that with no screen at all.', 'If it exposes exactly two zones, the axial point is nearly dark.', 'Behind a small opaque disc, there is a bright spot at the centre of the shadow.', 'The number of zones exposed does not depend on the distance to the observation point.'], answer: [0, 1, 2],
      sol: 'The unobstructed wave has half the amplitude of zone 1 alone, so zone 1 alone gives twice the amplitude and four times the intensity (A). Two neighbouring zones nearly cancel (B). Behind a disc the zones outside it still add to about half the first unblocked zone: the Poisson (Arago) spot (C). D is false: $r_n = \\sqrt{n\\lambda b}$, so the number of zones in a fixed hole, $r^2/(\\lambda b)$, changes with $b$.' },

    // ---------- level 4 ----------
    { id: 'dfr-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'grating',
      q: 'A grating has $1000$ lines in total with spacing $2\\ \\mu$m. For $500$ nm light at normal incidence, the angular half-width of the first-order principal maximum is $x\\times10^{-4}$ rad. The value of $x$ is ______ (to two decimal places).',
      answer: 2.58, tol: 0.02, calc: () => 500e-9 / (1000 * 2e-6 * Math.cos(Math.asin(0.25))) * 1e4,
      sol: 'The first zero next to a principal maximum is where the phase difference changes by $2\\pi/N$: $\\Delta\\theta = \\lambda/(Nd\\cos\\theta)$. With $\\cos\\theta = \\sqrt{1 - 0.0625} = 0.9682$: $\\Delta\\theta = 5\\times10^{-7}/(1000\\times2\\times10^{-6}\\times0.9682) = 2.58\\times10^{-4}$ rad.',
      trap: 'Leaving out $\\cos\\theta$ gives $2.50$, outside the tolerance.' },
    { id: 'dfr-031', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'single slit',
      q: 'A plane wave strikes a slit of width $a$ at angle $i$ to the normal. The diffraction minima are at angles $\\theta$ given by',
      options: ['$a(\\sin\\theta + \\sin i) = (m + \\tfrac12)\\lambda$', '$a(\\sin\\theta - \\sin i) = m\\lambda$, $m \\ne 0$', '$a\\sin(\\theta - i) = m\\lambda$', '$a\\sin\\theta = m\\lambda$, as for normal incidence'], answer: 1,
      sol: 'The incoming wave already has a path difference $a\\sin i$ between the slit edges. The total edge-to-edge difference is $a(\\sin\\theta - \\sin i)$ (angles measured on the same side), and the minima need it to be $m\\lambda$. The central maximum moves to $\\theta = i$, straight ahead.',
      trap: '$\\sin(\\theta - i)$ looks natural but is only approximately right for small angles.' },
    { id: 'dfr-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'grating', unit: 'degrees',
      q: 'Light of wavelength $500$ nm falls on a grating of spacing $2\\ \\mu$m at $30^\\circ$ to its normal. The first-order maximum on the same side of the normal as the incident beam\'s continuation is at ______ degrees from the normal (to two decimal places).',
      answer: 48.59, tol: 0.05, calc: () => Math.asin(0.5 + 0.25) / DEG,
      sol: 'Grating equation at oblique incidence: $d(\\sin\\theta - \\sin i) = m\\lambda$. $\\sin\\theta = 0.5 + 0.25 = 0.75$, so $\\theta = 48.59^\\circ$.',
      trap: 'Adding angles ($30^\\circ + 14.48^\\circ$) instead of sines.' },
    { id: 'dfr-033', type: 'msq', level: 4, exams: ['jam'], sub: 'double slit', format: 'statements',
      q: 'In a double-slit Fraunhofer pattern, the slit width $a$ is reduced while the separation $d$ is kept fixed. Which statements are correct?',
      options: ['The spacing of the interference fringes is unchanged.', 'The diffraction envelope widens, so more fringes fit inside the central maximum.', 'The fringes become dimmer.', 'The missing orders move to lower orders.'], answer: [0, 1, 2],
      sol: 'Fringe spacing depends on $d$ only (A). The envelope width $\\propto 1/a$ grows (B). Less light passes (C). D is false: missing orders are multiples of $d/a$, which grows, so they move to higher orders.' },
    { id: 'dfr-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'babinet',
      q: 'Babinet\'s principle says that the Fraunhofer patterns of two complementary screens (for example a slit and a wire of the same width)',
      options: ['are complementary everywhere: bright where the other is dark', 'are the same only for circular apertures', 'differ by a factor of 2 in angular scale', 'are identical except at the very centre (the geometric image of the source)'], answer: 3,
      sol: 'The two screens\' diffracted amplitudes add to the unobstructed wave: $U_1 + U_2 = U_0$. Away from the centre, $U_0$ (a focused point in Fraunhofer conditions) is zero, so $U_1 = -U_2$ and the intensities are equal. This is why hair thickness can be measured with a laser exactly like a slit width.',
      trap: '"Complementary screens give complementary patterns" sounds right but confuses amplitudes with intensities.' },
    { id: 'dfr-035', type: 'nat', level: 4, exams: ['jam'], sub: 'grating', unit: 'nm',
      q: 'A grating $2$ cm wide with $6000$ lines per cm is used in the second order near $600$ nm. The smallest wavelength difference it can resolve is ______ nm (to three decimal places).',
      answer: 0.025, tol: 0.0005, calc: () => 600 / (2 * 2 * 6000),
      sol: '$N = 2\\times6000 = 12000$ lines, $R = mN = 24000$. $\\Delta\\lambda = \\lambda/R = 600/24000 = 0.025$ nm.' },
    { id: 'dfr-036', type: 'nat', level: 4, exams: ['jam'], sub: 'resolving power', unit: 'km',
      q: 'A car\'s headlights are $1.5$ m apart. Taking the eye\'s pupil as $3$ mm across and $\\lambda = 550$ nm, the greatest distance at which the eye could, by diffraction alone, see them as two lights is ______ km (to two decimal places).',
      answer: 6.71, tol: 0.05, calc: () => 1.5 / (1.22 * 550e-9 / 3e-3) / 1000,
      sol: '$\\theta_{\\min} = 1.22\\lambda/D = 1.22\\times550\\times10^{-9}/(3\\times10^{-3}) = 2.237\\times10^{-4}$ rad. Distance $= 1.5/\\theta_{\\min} = 6.71\\times10^3$ m.' },
    { id: 'dfr-037', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'n slits',
      q: 'For three equally spaced narrow slits, the intensity at the secondary maximum halfway between two principal maxima (phase difference $\\pi$ between neighbouring slits), as a fraction of a principal maximum, is ______ (to three decimal places).',
      answer: 0.111, tol: 0.002, calc: () => (Math.sin(3 * Math.PI / 2) / Math.sin(Math.PI / 2)) ** 2 / 9,
      sol: '$I \\propto \\sin^2(N\\delta/2)/\\sin^2(\\delta/2)$, which is $N^2 = 9$ at a principal maximum. At $\\delta = \\pi$: $\\sin^2(3\\pi/2)/\\sin^2(\\pi/2) = 1$. Fraction $= 1/9 = 0.111$. (Phasor picture: two of the three phasors cancel, leaving one.)' },

    // ---------- level 5 ----------
    { id: 'dfr-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'fourier optics',
      q: 'A rectangular aperture is $a$ wide along $x$ and $b$ tall along $y$, with $a = 2b$. In its Fraunhofer pattern, the central maximum is',
      options: ['twice as wide along $y$ as along $x$', 'twice as wide along $x$ as along $y$', 'the same width in both directions', 'four times as wide along $y$'], answer: 0,
      sol: 'The pattern factorises: $I \\propto \\mathrm{sinc}^2(\\pi a\\sin\\theta_x/\\lambda)\\,\\mathrm{sinc}^2(\\pi b\\sin\\theta_y/\\lambda)$. Angular widths go as $\\lambda/a$ along $x$ and $\\lambda/b = 2\\lambda/a$ along $y$: the pattern is spread most along the aperture\'s narrow direction.',
      trap: 'Expecting the pattern to have the same shape as the aperture; it is stretched the other way.' },
    { id: 'dfr-039', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'single slit',
      q: 'The first secondary maximum of a single slit occurs where $\\tan\\beta = \\beta$. Its intensity as a fraction of the central maximum is ______ (to three decimal places).',
      answer: 0.047, tol: 0.001,
      calc: () => { let b = 4.5; for (let i = 0; i < 30; i++) b -= (Math.tan(b) - b) / (1 / Math.cos(b) ** 2 - 1); return (Math.sin(b) / b) ** 2; },
      sol: '$dI/d\\beta = 0$ for $I \\propto (\\sin\\beta/\\beta)^2$ gives $\\tan\\beta = \\beta$. The first root after zero is $\\beta = 4.493$ rad ($1.430\\pi$, a little less than $1.5\\pi$). Then $\\sin\\beta = -0.9761$ and $(\\sin\\beta/\\beta)^2 = (0.2172)^2 = 0.0472$.',
      trap: 'Using the midpoint $\\beta = 3\\pi/2$ gives $4/(9\\pi^2) = 0.045$, outside the tolerance.' },
    { id: 'dfr-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'fourier optics', format: 'statements',
      q: 'In Fraunhofer diffraction the far-field amplitude is the Fourier transform of the aperture\'s transmission function. Which statements are correct?',
      options: ['An aperture with Gaussian transmission gives a Gaussian pattern with no side lobes.', 'Moving the aperture sideways changes only the phase of the far-field amplitude, not the intensity pattern.', 'A grating\'s pattern is the single-slit envelope multiplied by the $N$-slit interference factor.', 'Doubling the aperture width doubles the width of the pattern.'], answer: [0, 1, 2],
      sol: 'A: the transform of a Gaussian is a Gaussian (this is why "apodised" apertures suppress side lobes). B: shift theorem: a shift multiplies the transform by a phase factor $e^{-ik_xx_0}$. C: the grating is one slit convolved with a row of delta functions, and a convolution transforms into a product. D is false: widths are reciprocal, so the pattern halves.' },
    { id: 'dfr-041', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'missing orders',
      q: 'A grating has spacing $d = 5\\lambda$ and slit width $a = d/3$, and is lit normally. Counting the central maximum, the number of principal maxima that actually appear is ______.',
      answer: 7, tol: 0, calc: () => [-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((m) => m % 3 !== 0 || m === 0).length,
      sol: '$\\sin\\theta = m/5 < 1$ allows $m = 0, \\pm1, \\pm2, \\pm3, \\pm4$ ($m = \\pm5$ would be at $90^\\circ$, along the grating, and is not seen). Orders that are multiples of $d/a = 3$ are missing: $\\pm3$. That leaves $0, \\pm1, \\pm2, \\pm4$: $7$ maxima.',
      trap: 'Counting $m = \\pm5$ (grazing) or forgetting the missing orders.' },
  ],
  gens: [
    { id: 'dfr-t21', type: 'mcq', level: 3, exams: ['jam'], sub: 'single slit', format: 'comparison',
      make(r) {
        const [n, d] = Q5.choose(r, [[2, 1], [3, 1], [1, 2]]), width = r() < 0.5;
        const f = (k) => `$${k >= 0 ? q5frac(n ** k, d ** k) : q5frac(d ** -k, n ** -k)}$ times`;
        const right = width ? f(-1) : f(2), wr = width ? [f(1), f(2), f(-2)] : [f(1), f(-1), f(-2)];
        const o = Q5.mcqOptions(r, right, wr);
        return { q: `A single slit is lit normally by a parallel beam of fixed intensity, and the Fraunhofer pattern is watched on a distant screen. The slit width is multiplied by $${q5frac(n, d)}$. The ${width ? 'angular width of the central maximum' : 'intensity at the centre of the pattern'} becomes`, ...o,
          sol: width ? `The first minima are at $\\sin\\theta = \\pm\\lambda/a$, so the central width goes as $1/a$: it becomes ${f(-1)} as large.`
            : `The power through the slit grows as $a$, while the central maximum narrows as $1/a$; so the peak intensity goes as $a \\times a = a^2$ (the amplitude at the centre adds up from the whole slit, $\\propto a$). It becomes ${f(2)} as large.`,
          trap: 'The centre grows as $a^2$, not $a$: more light is squeezed into a narrower peak.' };
      } },
    { id: 'dfr-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'n slits', format: 'statements',
      make(r) {
        const N = Q5.int(r, 3, 8);
        const T = [`Between two neighbouring principal maxima there are $${N - 1}$ minima.`, `Between two neighbouring principal maxima there are $${N - 2}$ secondary maxima.`,
          `Each principal maximum is $${N * N}$ times as intense as the maximum from one slit alone.`, 'The principal maxima are at the same angles as for two slits with the same spacing.'];
        const F = [`Between two neighbouring principal maxima there are $${N}$ minima.`, `Between two neighbouring principal maxima there are $${N - 1}$ secondary maxima.`,
          `Each principal maximum is $${N}$ times as intense as the maximum from one slit alone.`, 'Adding more slits with the same spacing moves the principal maxima to larger angles.'];
        const o = q5msq(r, T, F);
        return { q: `Monochromatic light falls normally on $${N}$ identical, very narrow, equally spaced slits. Which statements about the far-field pattern are correct?`, ...o,
          sol: `$I = I_1\\left(\\dfrac{\\sin(N\\phi/2)}{\\sin(\\phi/2)}\\right)^2$ with $\\phi$ the phase step between neighbouring slits. Principal maxima at $\\phi = 2\\pi m$ (set by the spacing only: $d\\sin\\theta = m\\lambda$), with height $N^2I_1 = ${N * N}I_1$. Zeros where $N\\phi/2 = k\\pi$ but $\\phi/2 \\ne m\\pi$: $N - 1 = ${N - 1}$ of them between principal maxima, and hence $N - 2 = ${N - 2}$ weak secondary maxima.`,
          trap: 'Peak height grows as $N^2$ (amplitudes add), while the peaks get narrower as $1/N$.' };
      } },
    { id: 'dfr-t23', type: 'nat', level: 2, exams: ['jam'], sub: 'resolving power', unit: 'km',
      make(r) {
        const s = Q5.pick(r, 1.2, 1.8, 0.1), D = Q5.pick(r, 2, 7, 0.5), lam = Q5.choose(r, [500, 550, 600]);
        const L = s * D * 1e-3 / (1.22 * lam * 1e-9) / 1000;
        return { q: `The two headlights of a car are $${s}$ m apart. Taking the eye's pupil as a circular aperture $${D}$ mm across, light of $${lam}$ nm and the Rayleigh criterion (and no other limit), the largest distance at which the two lights can be seen as separate is ______ km (to two decimal places).`,
          answer: Q5.round(L, 2), tol: 0.02, s, D, lam,
          sol: `Rayleigh limit: $\\theta = 1.22\\lambda/D = 1.22\\times${lam}\\times10^{-9}/${D / 1000} = ${Q5.fmt(1.22 * lam * 1e-9 / (D * 1e-3), 4)}$ rad. The lights subtend $s/L$, so $L = s/\\theta = ${Q5.round(L, 2)}$ km.`,
          trap: 'Convert the pupil size to metres and the wavelength to metres before dividing.' };
      },
      verify: (p) => { const theta = 1.22 * p.lam / (p.D * 1e6); return p.s / theta / 1000; } },
    { id: 'dfr-t24', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'fresnel zones',
      make(r) {
        const N = Q5.int(r, 1, 8), lam = Q5.choose(r, [500, 600]), z = Q5.int(r, 1, 4);
        const rho = Q5.round(Math.sqrt(N * lam * 1e-9 * z) * 1000, 3);
        const s = (k) => `about $${k}$ zones, so the centre is ${k % 2 ? 'bright' : 'nearly dark'}`;
        const opp = `about $${N}$ zones, so the centre is ${N % 2 ? 'nearly dark' : 'bright'}`;
        const o = Q5.mcqOptions(r, s(N), [opp, s(2 * N), s(N + 1), s(N + 2)]);
        return { q: `A plane wave of wavelength $${lam}$ nm falls normally on an opaque screen with a circular hole of radius $${rho}$ mm. Seen from a point on the axis $${z}$ m behind the screen, the hole uncovers`, ...o,
          sol: `The $k$-th half-period zone has outer radius $\\rho_k = \\sqrt{k\\lambda z}$, so the number of zones is $N = \\rho^2/(\\lambda z) = \\dfrac{(${rho}\\times10^{-3})^2}{${lam}\\times10^{-9}\\times${z}} \\approx ${N}$. Neighbouring zones send nearly equal amplitudes in antiphase: an odd number leaves one zone uncancelled (bright, up to 4 times the open-screen intensity for $N = 1$); an even number nearly cancels.`,
          trap: 'Enlarging the hole can make the centre darker: what matters is whether the zone count is odd or even.' };
      } },
    { id: 'dfr-t25', type: 'nat', level: 2, exams: ['jam'], sub: 'grating', unit: 'lines/mm',
      make(r) {
        const Nl = Q5.int(r, 100, 800), lam = Q5.int(r, 400, 700), m = 2 * Nl * lam * 1e-6 < 0.9 ? Q5.int(r, 1, 2) : 1;
        const th = Q5.round(Math.asin(Nl * m * lam * 1e-6) * 180 / Math.PI, 2);
        const ans = Math.sin(th * Math.PI / 180) / (m * lam * 1e-6);
        return { q: `Light of wavelength $${lam}$ nm falls normally on a grating. The order-$${m}$ maximum is seen at $${th}^\\circ$ from the straight-through direction. The grating has ______ lines per mm (to the nearest whole number).`,
          answer: Math.round(ans), tol: 1, lam, m, th,
          sol: `$d\\sin\\theta = m\\lambda$, so $d = \\dfrac{${m}\\times${lam}\\times10^{-6}\\ \\text{mm}}{\\sin ${th}^\\circ} = ${Q5.fmt(m * lam * 1e-6 / Math.sin(th * Math.PI / 180), 4)}$ mm, and the number of lines per mm is $1/d \\approx ${Math.round(ans)}$.`,
          trap: 'The grating equation gives the spacing $d$; lines per mm is its reciprocal (with $d$ in mm).' };
      },
      verify: (p) => { const d = p.m * p.lam * 1e-6 / Math.sin(p.th * Math.PI / 180); return 1 / d; } },
    { id: 'dfr-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'single slit',
      make(r) {
        const lam = choose(r, [450, 500, 550, 600, 633, 650]), a = choose(r, [0.05, 0.1, 0.15, 0.2, 0.25, 0.4]), D = pick(r, 0.5, 3, 0.5);
        const w = 2 * lam * 1e-9 * D / (a * 1e-3) * 1000;
        return { q: `Light of wavelength $${lam}$ nm passes through a slit $${a}$ mm wide. The full width of the central maximum on a screen $${D}$ m away is ______ mm (to two decimal places).`,
          answer: round(w, 2), tol: Math.max(0.01, round(w * 0.01, 2)), unit: 'mm', lam, a, D,
          sol: `First minima at $y = \\pm\\lambda D/a$. Width $= 2\\lambda D/a = 2(${lam}\\times10^{-9})(${D})/(${a}\\times10^{-3}) = ${round(w, 2)}$ mm.`,
          trap: 'The full width is twice $\\lambda D/a$.' };
      },
      verify: (p) => 2 * p.lam * 1e-9 * p.D / (p.a * 1e-3) * 1000 },
    { id: 'dfr-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'grating',
      make(r) {
        const N = choose(r, [2000, 2500, 4000, 5000, 6000]), lam = choose(r, [400, 450, 500, 550, 589, 600, 650]), m = choose(r, [1, 1, 2]);
        const d = 1e-2 / N, s = m * lam * 1e-9 / d;
        const th = Math.asin(s) / DEG;
        return { q: `A grating with $${N}$ lines per cm is lit normally by $${lam}$ nm light. The order-${m} maximum is at ______ degrees from the normal (to two decimal places).`,
          answer: round(th, 2), tol: 0.05, unit: 'degrees', N, lam, m,
          sol: `$d = 1/${N}$ cm $= ${round(d * 1e6, 4)}\\ \\mu$m. $\\sin\\theta = m\\lambda/d = ${m}\\times${lam / 1000}/${round(d * 1e6, 4)} = ${round(s, 4)}$, so $\\theta = ${round(th, 2)}^\\circ$.`,
          trap: 'Lines per cm must be turned into a spacing in metres.' };
      },
      verify: (p) => Math.asin(p.m * p.lam * 1e-9 * p.N / 1e-2) / DEG },
    { id: 'dfr-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'grating',
      make(r) {
        const N = choose(r, [1000, 2000, 3000, 4000, 5000, 6000, 8000]), lam = choose(r, [400, 450, 500, 550, 600, 650, 700]);
        const ratio = (1e-2 / N) / (lam * 1e-9);
        let mmax = Math.floor(ratio + 1e-12);
        if (Math.abs(ratio - Math.round(ratio)) < 1e-9) mmax = Math.round(ratio) - 1; // order exactly at 90 degrees is not seen
        return { q: `A grating with $${N}$ lines per cm is lit normally by light of wavelength $${lam}$ nm. The highest order that can be observed is ______.`,
          answer: mmax, tol: 0, N, lam,
          sol: `$\\sin\\theta = m\\lambda/d$ must be below 1: $m < d/\\lambda = ${round(ratio, 3)}$. So the highest order is $${mmax}$.`,
          trap: 'Rounding $d/\\lambda$ up instead of down.' };
      },
      verify: (p) => { const q = (1e-2 / p.N) / (p.lam * 1e-9); return Math.abs(q - Math.round(q)) < 1e-9 ? Math.round(q) - 1 : Math.floor(q); } },
    { id: 'dfr-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'resolving power',
      make(r) {
        const D = choose(r, [0.005, 0.05, 0.1, 0.2, 0.5, 1, 2.4]), lam = choose(r, [400, 500, 550, 600, 700]);
        const th = 1.22 * lam * 1e-9 / D * 1e6;
        return { q: `An instrument with a circular aperture $${D * 100}$ cm across works at $${lam}$ nm. Its Rayleigh limit of resolution is ______ microradians (to two decimal places).`,
          answer: round(th, 2), tol: Math.max(0.01, round(th * 0.005, 2)), unit: 'μrad', D, lam,
          sol: `$\\theta = 1.22\\lambda/D = 1.22\\times${lam}\\times10^{-9}/${D} = ${round(th, 2)}\\times10^{-6}$ rad.`,
          trap: 'Forgetting the factor 1.22 for a circular aperture.' };
      },
      verify: (p) => 1.22 * p.lam * 1e-9 / p.D * 1e6 },
    { id: 'dfr-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'grating',
      make(r) {
        const [l1, l2] = choose(r, [[589.0, 589.6], [576.96, 579.07], [656.27, 656.29], [486.13, 486.27], [434.05, 434.0]]);
        const m = choose(r, [1, 2, 3]);
        const lam = (l1 + l2) / 2, dl = Math.abs(l2 - l1);
        const N = Math.ceil(round(lam / (m * dl), 6));
        return { q: `Two spectral lines at $${l1}$ nm and $${l2}$ nm are to be resolved in order $${m}$ of a grating. Using their mean wavelength, the minimum number of lines that must be illuminated is ______.`,
          answer: N, tol: 0, l1, l2, m,
          sol: `$N \\ge \\bar\\lambda/(m\\Delta\\lambda) = ${round(lam, 3)}/(${m}\\times${round(dl, 3)}) = ${round(lam / (m * dl), 2)}$, so $N = ${N}$ (round up).`,
          trap: 'Rounding down leaves the lines just unresolved.' };
      },
      verify: (p) => Math.ceil(round(((p.l1 + p.l2) / 2) / (p.m * Math.abs(p.l2 - p.l1)), 6)) },
    { id: 'dfr-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'double slit',
      make(r) {
        const a = choose(r, [0.02, 0.04, 0.05, 0.08, 0.1, 0.12]), k = int(r, 2, 8);
        const d = round(a * k, 3);
        return { q: `A double slit has slit width $${a}$ mm and centre-to-centre separation $${d}$ mm. The number of bright interference fringes inside the central diffraction maximum is ______.`,
          answer: 2 * k - 1, tol: 0, k,
          sol: `$d/a = ${k}$, so order $${k}$ lands on the first diffraction zero and is missing. Inside: orders $-${k - 1}$ to $+${k - 1}$, which is $2\\times${k - 1} + 1 = ${2 * k - 1}$ fringes.`,
          trap: `Counting the missing orders $\\pm${k}$ gives $${2 * k + 1}$.` };
      },
      verify: (p) => 2 * p.k - 1 },
    { id: 'dfr-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'zone plate',
      make(r) {
        const r1 = choose(r, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), lam = choose(r, [450, 500, 550, 600, 633]);
        const f = (r1 * 1e-3) ** 2 / (lam * 1e-9) * 100;
        return { q: `The first zone of a zone plate has radius $${r1}$ mm. For light of wavelength $${lam}$ nm, its principal focal length is ______ cm (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.005, 1)), unit: 'cm', r1, lam,
          sol: `$f = r_1^2/\\lambda = (${r1}\\times10^{-3})^2/(${lam}\\times10^{-9}) = ${round(f / 100, 4)}$ m $= ${round(f, 1)}$ cm.` };
      },
      verify: (p) => (p.r1 * 1e-3) ** 2 / (p.lam * 1e-9) * 100 },
    { id: 'dfr-g08', type: 'mcq', level: 3, exams: ['jam'], sub: 'single slit',
      make(r) {
        const lam = choose(r, [400, 500, 600, 700]), a = choose(r, [1.5, 2, 2.5, 3, 4, 5]), m = choose(r, [1, 2]);
        const s = m * lam / 1000 / a;
        const th = Math.asin(s) / DEG;
        const show = (v) => `$${round(v, 1)}^\\circ$`;
        const o = mcqOptions(r, th, [Math.asin(Math.min(0.999, (m + 0.5) * lam / 1000 / a)) / DEG, Math.asin(s / 2) / DEG, s / DEG * 2, 90 - th], show);
        return { q: `Light of wavelength $${lam}$ nm falls normally on a slit $${a}\\ \\mu$m wide. Diffraction minimum number $${m}$ is at an angle of`, ...o,
          sol: `$a\\sin\\theta = m\\lambda$: $\\sin\\theta = ${m}\\times${lam / 1000}/${a} = ${round(s, 4)}$, so $\\theta = ${round(th, 1)}^\\circ$.`,
          trap: 'Using the half-integer rule, which belongs to two-slit minima, not single-slit minima.' };
      } },
  ],
};
