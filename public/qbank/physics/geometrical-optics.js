// Geometrical optics: Fermat's principle, reflection and refraction, total internal reflection, apparent depth and
// slabs, prisms (minimum deviation, thin prisms, dispersion), spherical mirrors, refraction at a spherical surface,
// thin lenses and the lensmaker's formula, lenses in liquids, combinations and separated lenses, the displacement
// method, magnifiers, microscopes and telescopes, achromatic doublets, thick lenses, cardinal points and ray
// matrices. Sign convention in solutions: Cartesian (distances from the pole or lens, positive in the direction the
// light travels): lens 1/v - 1/u = 1/f, mirror 1/v + 1/u = 1/f. Original questions for IIT JAM, GATE and CSIR NET
// practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const deg = Math.PI / 180;

import * as Q5 from '../_util.js';
import more2 from './geometrical-optics.more2.gen.js';
import r4 from './geometrical-optics.r4.gen.js';

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
  topic: 'geometrical-optics',
  items: [
    // ---------- level 1 ----------
    { id: 'gop-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'total internal reflection',
      q: 'The critical angle for light going from glass of refractive index $1.5$ into air is about',
      options: ['$30^\\circ$', '$41.8^\\circ$', '$48.6^\\circ$', '$60^\\circ$'], answer: 1,
      sol: '$\\sin C = n_2/n_1 = 1/1.5 = 0.667$, so $C = 41.8^\\circ$. Beyond this angle of incidence, no light leaves the glass.',
      trap: '$48.6^\\circ$ is the critical angle for water ($n = 4/3$).' },
    { id: 'gop-002', type: 'nat', level: 1, exams: ['jam'], sub: 'apparent depth', unit: 'm',
      q: 'A swimming pool is $2.0$ m deep and filled with water ($n = 4/3$). Looking straight down, the bottom appears to be ______ m below the surface.',
      answer: 1.5, tol: 0.01, calc: () => 2 / (4 / 3),
      sol: 'For near-normal viewing, apparent depth $=$ real depth$/n = 2.0/(4/3) = 1.5$ m.',
      trap: 'Multiplying by $n$ makes the pool look deeper; it looks shallower.' },
    { id: 'gop-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'thin lenses',
      q: 'An object is placed at a distance $2f$ in front of a thin convex lens of focal length $f$. The image is',
      options: ['virtual, upright and magnified', 'at infinity', 'real, inverted, the same size, at $2f$ behind the lens', 'real, inverted and twice the size'], answer: 2,
      sol: '$1/v - 1/u = 1/f$ with $u = -2f$: $1/v = 1/f - 1/(2f) = 1/(2f)$, so $v = 2f$. Magnification $v/u = -1$: real, inverted, same size.' },
    { id: 'gop-004', type: 'nat', level: 1, exams: ['jam'], sub: 'thin lenses', unit: 'D',
      q: 'A convex lens has focal length $25$ cm. Its power is ______ dioptres.',
      answer: 4, tol: 0, calc: () => 1 / 0.25,
      sol: 'Power $= 1/f$ with $f$ in metres: $1/0.25 = +4$ D.',
      trap: 'Using centimetres gives $0.04$.' },
    { id: 'gop-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'reflection',
      q: 'A ray reflects from a plane mirror. Keeping the ray fixed, the mirror is turned through an angle $\\theta$. The reflected ray turns through',
      options: ['$\\theta$', '$\\theta/2$', '$4\\theta$', '$2\\theta$'], answer: 3,
      sol: 'Turning the mirror by $\\theta$ turns the normal by $\\theta$. The angle of incidence changes by $\\theta$ and so does the angle of reflection, on the other side of the normal: the reflected ray turns by $2\\theta$. This doubling is used in galvanometer mirrors.' },
    { id: 'gop-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'fermat principle',
      q: 'Fermat\'s principle states that between two points light follows a path for which',
      options: ['the travel time is stationary (usually a minimum)', 'the geometric distance is always the smallest', 'the speed is greatest', 'the number of reflections is the least'], answer: 0,
      sol: 'The optical path $\\int n\\,ds$ (equivalently the travel time) is stationary: a minimum in most cases, sometimes a maximum or a saddle (for example reflection inside an ellipse). It is not the shortest distance: a refracted ray bends.',
      trap: 'Shortest distance and least time agree only in a uniform medium.' },

    // ---------- level 2 ----------
    { id: 'gop-007', type: 'nat', level: 2, exams: ['jam'], sub: 'thin lenses', unit: 'cm',
      q: 'An object stands $30$ cm in front of a convex lens of focal length $20$ cm. The image forms ______ cm behind the lens.',
      answer: 60, tol: 0.1, calc: () => 1 / (1 / 20 - 1 / 30),
      sol: '$1/v = 1/f + 1/u = 1/20 + 1/(-30) = 1/60$, so $v = +60$ cm: real, behind the lens, magnification $v/u = -2$.' },
    { id: 'gop-008', type: 'nat', level: 2, exams: ['jam'], sub: 'mirrors',
      q: 'An object is $10$ cm in front of a concave mirror of radius of curvature $30$ cm. The magnitude of the magnification is ______.',
      answer: 3, tol: 0.01, calc: () => { const f = -15, u = -10, v = 1 / (1 / f - 1 / u); return Math.abs(-v / u); },
      sol: '$f = -15$ cm, $u = -10$ cm. $1/v = 1/f - 1/u = -1/15 + 1/10 = 1/30$, so $v = +30$ cm: a virtual image behind the mirror. Magnification $m = -v/u = 3$: upright and three times larger (a shaving mirror).',
      trap: 'Using $f = R = 30$ cm instead of $R/2$.' },
    { id: 'gop-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'lensmaker',
      q: 'A thin biconvex lens of glass ($n = 1.5$) has both radii of curvature $20$ cm. In air its focal length is',
      options: ['$10$ cm', '$20$ cm', '$40$ cm', '$30$ cm'], answer: 1,
      sol: '$\\dfrac1f = (n - 1)\\left(\\dfrac1{R_1} - \\dfrac1{R_2}\\right) = 0.5\\left(\\dfrac1{20} + \\dfrac1{20}\\right) = \\dfrac1{20}$, so $f = 20$ cm ($R_2 = -20$ cm for the second surface).',
      trap: 'Taking both radii as $+20$ cm makes the bracket zero.' },
    { id: 'gop-010', type: 'nat', level: 2, exams: ['jam'], sub: 'prisms', unit: 'degrees',
      q: 'A prism with apex angle $60^\\circ$ has refractive index $\\sqrt2$. Its angle of minimum deviation is ______ degrees.',
      answer: 30, tol: 0.1, calc: () => 2 * Math.asin(Math.SQRT2 * Math.sin(30 * deg)) / deg - 60,
      sol: '$n = \\dfrac{\\sin[(A + D)/2]}{\\sin(A/2)}$: $\\sin[(60^\\circ + D)/2] = \\sqrt2\\sin30^\\circ = 0.707$, so $(60^\\circ + D)/2 = 45^\\circ$ and $D = 30^\\circ$. At minimum deviation the ray passes through the prism symmetrically.' },
    { id: 'gop-011', type: 'msq', level: 2, exams: ['jam'], sub: 'total internal reflection', format: 'statements',
      q: 'Which statements about total internal reflection are correct?',
      options: ['Light must travel from a medium of higher index towards one of lower index.', 'The angle of incidence must exceed the critical angle.', 'The critical angle of diamond ($n = 2.42$) is larger than that of glass ($n = 1.5$).', 'Optical fibres guide light by total internal reflection.'], answer: [0, 1, 3],
      sol: '$\\sin C = n_2/n_1$ exists only if $n_1 > n_2$. For diamond $\\sin C = 1/2.42$, $C = 24.4^\\circ$, smaller than glass ($41.8^\\circ$); that small angle traps light and makes diamonds sparkle. Fibres keep light inside a core of higher index than its cladding.' },
    { id: 'gop-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'lens combinations',
      q: 'A thin convex lens of focal length $20$ cm is placed in contact with a thin concave lens of focal length $30$ cm. The combination behaves as',
      options: ['a converging lens of focal length $12$ cm', 'a diverging lens of focal length $12$ cm', 'a converging lens of focal length $60$ cm', 'a diverging lens of focal length $60$ cm'], answer: 2,
      sol: 'Powers add: $1/F = 1/20 + 1/(-30) = 1/60$, so $F = +60$ cm, converging (the stronger lens wins).',
      trap: 'Adding the focal lengths, or using $f_1f_2/(f_1 + f_2)$ with both positive ($12$ cm).' },
    { id: 'gop-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'lensmaker',
      q: 'A glass lens ($n = 1.5$) has a focal length of $20$ cm in air. When it is put in water ($n = 4/3$), its focal length becomes',
      options: ['$20$ cm', '$26.7$ cm', '$80$ cm', '$-80$ cm'], answer: 2,
      sol: 'The lensmaker\'s formula uses the relative index: $1/f \\propto (n_{lens}/n_{medium} - 1)$. In air: $0.5$. In water: $1.5/1.333 - 1 = 0.125$. So $f$ grows by $0.5/0.125 = 4$: $80$ cm, still converging (glass is still denser than water).',
      trap: 'Using $n_{lens} - n_{water} = 0.167$ instead of the ratio gives $60$ cm.' },
    { id: 'gop-014', type: 'nat', level: 2, exams: ['jam'], sub: 'spherical surface', unit: 'cm',
      q: 'The end of a long glass rod ($n = 1.5$) is ground into a convex hemisphere of radius $10$ cm. An object in air is $30$ cm in front of this surface on the axis. The image forms inside the rod ______ cm from the surface.',
      answer: 90, tol: 0.1, calc: () => 1.5 / ((1.5 - 1) / 10 - 1 / 30),
      sol: '$\\dfrac{n_2}{v} - \\dfrac{n_1}{u} = \\dfrac{n_2 - n_1}{R}$ with $n_1 = 1$, $n_2 = 1.5$, $u = -30$ cm, $R = +10$ cm: $1.5/v + 1/30 = 0.05$, so $1.5/v = 1/60$ and $v = 90$ cm.',
      trap: 'Using the thin-lens formula: this is one surface, and the image is in glass, so $n_2$ multiplies $1/v$.' },
    { id: 'gop-015', type: 'msq', level: 2, exams: ['jam'], sub: 'images', format: 'statements',
      q: 'For real objects, which statements are correct?',
      options: ['A real image can be caught on a screen.', 'A convex mirror always forms a virtual, upright, smaller image.', 'A concave lens can form a real image.', 'A concave mirror can form a virtual, magnified image.'], answer: [0, 1, 3],
      sol: 'Real images are where light actually converges, so a screen shows them. Diverging elements (convex mirror, concave lens) always give virtual, upright, diminished images of real objects; a concave lens cannot form a real image of a real object. A concave mirror with the object inside its focus gives a virtual magnified image.' },
    { id: 'gop-016', type: 'nat', level: 2, exams: ['jam'], sub: 'instruments',
      q: 'A magnifying glass of focal length $5$ cm is used with the final image at the near point ($25$ cm). Its angular magnification is ______.',
      answer: 6, tol: 0, calc: () => 1 + 25 / 5,
      sol: 'With the image at the near point, $M = 1 + D/f = 1 + 25/5 = 6$. With the image at infinity (relaxed eye) it would be $D/f = 5$.',
      trap: 'Mixing the two cases: $D/f$ is for the image at infinity.' },

    // ---------- level 3 ----------
    { id: 'gop-017', type: 'nat', level: 3, exams: ['jam'], sub: 'lens combinations', unit: 'cm',
      q: 'Two thin convex lenses, each of focal length $20$ cm, are placed $10$ cm apart on a common axis. The equivalent focal length is ______ cm (to two decimal places).',
      answer: 13.33, tol: 0.05, calc: () => 20 * 20 / (20 + 20 - 10),
      sol: '$\\dfrac1F = \\dfrac1{f_1} + \\dfrac1{f_2} - \\dfrac{d}{f_1f_2} = \\dfrac1{20} + \\dfrac1{20} - \\dfrac{10}{400} = \\dfrac{3}{40}$, so $F = 13.33$ cm (measured from the principal planes, not from either lens).',
      trap: 'Forgetting the $-d/(f_1f_2)$ term gives 10 cm (lenses in contact).' },
    { id: 'gop-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'instruments',
      q: 'An astronomical telescope has an objective of focal length $100$ cm and an eyepiece of $5$ cm, in normal adjustment (final image at infinity). Its angular magnification and length are',
      options: ['$20$ and $105$ cm', '$20$ and $95$ cm', '$500$ and $105$ cm', '$1/20$ and $105$ cm'], answer: 0,
      sol: 'In normal adjustment the objective\'s image sits at the eyepiece\'s focus: length $f_o + f_e = 105$ cm and $M = f_o/f_e = 20$ (the image is inverted).',
      trap: '$f_o - f_e$ is the length of a Galilean telescope, which uses a concave eyepiece.' },
    { id: 'gop-019', type: 'nat', level: 3, exams: ['jam'], sub: 'instruments',
      q: 'A compound microscope has an objective of focal length $1.0$ cm and an eyepiece of $5.0$ cm, $20$ cm apart. The final image is at infinity and the near point is $25$ cm. The magnitude of its magnifying power is ______.',
      answer: 70, tol: 0.5, calc: () => { const v = 20 - 5, u = 1 / (1 / v - 1 / 1); return Math.abs(v / u) * 25 / 5; },
      sol: 'The objective\'s image must sit at the eyepiece focus: $v_o = 20 - 5 = 15$ cm. Then $1/u_o = 1/15 - 1/1 = -14/15$, $u_o = -1.07$ cm, and $m_o = v_o/u_o = -14$. The eyepiece adds $D/f_e = 5$. Total $|M| = 14\\times5 = 70$.',
      trap: 'Using the tube length 20 cm as $v_o$ ignores where the eyepiece needs the image.' },
    { id: 'gop-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'apparent depth',
      q: 'A mark on paper is viewed straight down through a glass slab $6$ cm thick ($n = 1.5$) lying on it. The mark appears',
      options: ['raised by $2$ cm', 'raised by $4$ cm', 'lowered by $2$ cm', 'raised by $9$ cm'], answer: 0,
      sol: 'The slab makes the mark seem to be at depth $t/n = 4$ cm below the top surface instead of $6$ cm: it is raised by $t(1 - 1/n) = 6(1 - 2/3) = 2$ cm. The shift does not depend on where the eye is (for near-normal viewing).',
      trap: '$4$ cm is the apparent depth below the top, not the shift.' },
    { id: 'gop-021', type: 'nat', level: 3, exams: ['jam'], sub: 'aberrations', unit: 'cm',
      q: 'An achromatic doublet of focal length $+40$ cm is made from a crown-glass lens (dispersive power $0.02$) in contact with a flint-glass lens (dispersive power $0.04$). The focal length of the crown lens is ______ cm.',
      answer: 20, tol: 0.1, calc: () => 40 * (1 - 0.02 / 0.04),
      sol: 'No colour error: $\\omega_1/f_1 + \\omega_2/f_2 = 0$, so $f_2 = -(\\omega_2/\\omega_1)f_1 = -2f_1$. Combined power: $1/f_1 + 1/f_2 = 1/(2f_1) = 1/40$, so $f_1 = 20$ cm (converging crown) and $f_2 = -40$ cm (diverging flint).',
      trap: 'Making the more dispersive lens the converging one gives a diverging doublet.' },
    { id: 'gop-022', type: 'msq', level: 3, exams: ['jam'], sub: 'thin lenses', format: 'statements',
      q: 'An object and a screen are a fixed distance $D$ apart. A convex lens of focal length $f$ between them gives a sharp image at two positions, a distance $x$ apart, with image heights $h_1$ and $h_2$. Which statements are correct?',
      options: ['Two positions exist only if $D > 4f$.', '$f = (D^2 - x^2)/(4D)$.', 'The object height is $\\sqrt{h_1h_2}$.', 'The two magnifications are equal.'], answer: [0, 1, 2],
      sol: 'With $|u| + |v| = D$, the lens equation gives a quadratic with real, distinct roots only if $D > 4f$. The two positions swap $u$ and $v$, so $|v| - |u| = x$ and $|u||v| = fD$, giving $f = (D^2 - x^2)/4D$. The magnifications are $m$ and $1/m$, so $h_1h_2 = h^2$.',
      trap: 'The magnifications are reciprocal, not equal: one image is enlarged, the other reduced.' },
    { id: 'gop-023', type: 'nat', level: 3, exams: ['jam'], sub: 'thin lenses', unit: 'cm',
      q: 'An object and a screen are $100$ cm apart. A convex lens gives sharp images at two positions $60$ cm apart. Its focal length is ______ cm.',
      answer: 16, tol: 0.05, calc: () => (100 ** 2 - 60 ** 2) / (4 * 100),
      sol: '$f = (D^2 - x^2)/(4D) = (10\\,000 - 3600)/400 = 16$ cm. Check: the lens positions are $20$ cm and $80$ cm from the object, and $1/80 + 1/20 = 1/16$.' },
    { id: 'gop-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'refraction',
      q: 'A ray in water ($n = 4/3$) meets a flat glass surface ($n = 3/2$) at $30^\\circ$ incidence. The angle of refraction in the glass is about',
      options: ['$30^\\circ$', '$34.2^\\circ$', '$26.4^\\circ$', '$22.0^\\circ$'], answer: 2,
      sol: 'Snell: $\\tfrac43\\sin30^\\circ = \\tfrac32\\sin r$, so $\\sin r = (2/3)/(3/2) = 0.444$ and $r = 26.4^\\circ$. Going into the denser medium the ray bends towards the normal.',
      trap: 'Using air as the first medium ($\\sin r = 1/3$, $19.5^\\circ$).' },
    { id: 'gop-025', type: 'nat', level: 3, exams: ['jam'], sub: 'prisms',
      q: 'A $60^\\circ$ prism gives a minimum deviation of $40^\\circ$. Its refractive index is ______ (to three decimal places).',
      answer: 1.532, tol: 0.003, calc: () => Math.sin(50 * deg) / Math.sin(30 * deg),
      sol: '$n = \\sin[(A + D)/2]/\\sin(A/2) = \\sin50^\\circ/\\sin30^\\circ = 0.7660/0.5 = 1.532$.' },
    { id: 'gop-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'mirrors',
      q: 'An object is placed between the focus and the centre of curvature of a concave mirror. The image is',
      options: ['virtual, upright and magnified', 'real, inverted and smaller, between $F$ and $C$', 'at infinity', 'real, inverted and magnified, beyond $C$'], answer: 3,
      sol: 'With $f < |u| < 2f$, the mirror equation gives $|v| > 2f$: the image is real, inverted, beyond $C$ and larger than the object. (Object beyond $C$ gives the reverse: image between $F$ and $C$, smaller.)' },
    { id: 'gop-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'prisms',
      q: 'Two thin prisms of angles $A$ and $A\'$ (crown and flint glass) are combined, apex opposite, to deviate light without dispersing it. With $n_v$, $n_r$ the indices for violet and red, the condition is',
      options: ['$(n - 1)A = (n\' - 1)A\'$ for the mean indices', '$(n_v - n_r)A = (n\'_v - n\'_r)A\'$', '$A = A\'$', '$n_vA = n\'_rA\'$'], answer: 1,
      sol: 'A thin prism deviates by $(n - 1)A$, so it spreads violet and red apart by $(n_v - n_r)A$. Opposed prisms cancel the spread if $(n_v - n_r)A = (n\'_v - n\'_r)A\'$; the deviations $(n - 1)A$ and $(n\' - 1)A\'$ then differ, so a net deviation remains. The first option is the condition for no deviation (a direct-vision prism).',
      trap: 'Mixing up "no dispersion" (achromatic prism) with "no deviation" (direct-vision prism).' },
    { id: 'gop-028', type: 'nat', level: 3, exams: ['jam'], sub: 'mirrors', unit: 'cm',
      q: 'A concave mirror forms a real image $60$ cm in front of it for an object $20$ cm in front of it. The magnitude of its focal length is ______ cm.',
      answer: 15, tol: 0.05, calc: () => Math.abs(1 / (1 / -60 + 1 / -20)),
      sol: '$u = -20$ cm, $v = -60$ cm (real, in front). $1/f = 1/v + 1/u = -1/60 - 3/60 = -1/15$, so $|f| = 15$ cm.' },

    // ---------- level 4 ----------
    { id: 'gop-029', type: 'nat', level: 4, exams: ['jam'], sub: 'spherical surface', unit: 'cm',
      q: 'A parallel beam falls on a glass sphere ($n = 1.5$) of radius $10$ cm along a diameter. The beam comes to a focus ______ cm beyond the far surface of the sphere (paraxial rays).',
      answer: 5, tol: 0.05, calc: () => { const v1 = 1.5 * 10 / 0.5; const u2 = v1 - 20; const v2 = 1 / ((1 - 1.5) / -10 + 1.5 / u2); return v2; },
      sol: 'First surface ($u = \\infty$, $R = +10$): $1.5/v_1 = 0.5/10$, so $v_1 = 30$ cm from the front, i.e. $10$ cm beyond the back surface. Second surface (glass to air, $R = -10$ cm, $u_2 = +10$ cm, a virtual object): $1/v_2 - 1.5/10 = (1 - 1.5)/(-10) = 0.05$, so $1/v_2 = 0.2$ and $v_2 = 5$ cm. (A ball lens has $f = nR/[2(n - 1)] = 15$ cm from its centre.)',
      trap: 'Stopping after the first surface (30 cm).' },
    { id: 'gop-030', type: 'mcq', level: 4, exams: ['jam'], sub: 'lensmaker',
      q: 'A thin equiconvex lens of focal length $f$ is cut by a plane perpendicular to its axis into two plano-convex halves. The focal length of each half is',
      options: ['$f/2$', '$2f$', '$f$', '$4f$'], answer: 1,
      sol: 'Equiconvex: $1/f = (n - 1)(2/R)$. A plano-convex half keeps one curved face: $1/f\' = (n - 1)/R = 1/(2f)$, so $f\' = 2f$. (Cutting along the axis instead gives two halves each of focal length $f$, only dimmer.)',
      trap: 'Cutting along the axis does not change $f$; cutting across it does.' },
    { id: 'gop-031', type: 'msq', level: 4, exams: ['jam'], sub: 'lens combinations', format: 'statements',
      q: 'A convex lens of focal length $30$ cm and a concave lens of focal length $10$ cm are placed $20$ cm apart on one axis. Which statements are correct?',
      options: ['The combination has zero power.', 'A parallel beam entering it leaves parallel.', 'It is a Galilean telescope with angular magnification 3.', 'It forms a real image of a distant object.'], answer: [0, 1, 2],
      sol: '$1/F = 1/30 - 1/10 - 20/(30\\times(-10)) = 1/30 - 3/30 + 2/30 = 0$: an afocal system. The convex lens would focus at 30 cm, which is 10 cm beyond the concave lens: exactly its focal point, so the light leaves parallel. Angular magnification $f_o/|f_e| = 3$, with an upright image. Parallel light out means no real image.' },
    { id: 'gop-032', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'cardinal points', format: 'statements',
      q: 'Which statements about the cardinal points of a thick lens are correct?',
      options: ['For a lens in air the nodal points coincide with the principal points.', 'The equivalent focal length is measured from the principal planes.', 'For a thin lens both principal planes lie at the lens.', 'The front and back focal distances (measured from the lens surfaces) are always equal.'], answer: [0, 1, 2],
      sol: 'Nodal points coincide with principal points when the media on both sides are the same. Focal lengths are measured from the principal planes, which for a thin lens merge at the lens. The distances from the surfaces to the foci (back and front focal distances) differ in general, for example for a plano-convex lens turned either way, even though the equivalent focal length is the same.' },
    { id: 'gop-033', type: 'mcq', level: 4, exams: ['jam'], sub: 'aberrations',
      q: 'A plano-convex lens is used to focus a parallel beam. To reduce spherical aberration it should be placed',
      options: ['with the flat side towards the beam', 'with either side towards the beam: it makes no difference', 'only with a diaphragm, whichever way round', 'with the curved side towards the beam'], answer: 3,
      sol: 'Spherical aberration is smallest when the bending is shared between the two surfaces. With the curved side facing the parallel beam, each surface deviates the rays by a similar amount; with the flat side first, the flat face does nothing and the curved face does all the bending, which increases the aberration.' },
    { id: 'gop-034', type: 'nat', level: 4, exams: ['jam'], sub: 'lens combinations', unit: 'cm',
      q: 'Two thin convex lenses, each of focal length $10$ cm, are $50$ cm apart. An object is $15$ cm in front of the first. The final image forms ______ cm beyond the second lens.',
      answer: 20, tol: 0.1, calc: () => { const v1 = 1 / (1 / 10 - 1 / 15); const u2 = v1 - 50; return 1 / (1 / 10 + 1 / u2); },
      sol: 'Lens 1: $1/v_1 = 1/10 + 1/(-15) = 1/30$, $v_1 = 30$ cm, magnification $-2$. This image is $20$ cm in front of lens 2: $u_2 = -20$ cm. $1/v_2 = 1/10 - 1/20 = 1/20$, $v_2 = 20$ cm, magnification $-1$. Final image: real, $20$ cm beyond lens 2, upright overall (total magnification $+2$).' },
    { id: 'gop-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'fermat principle',
      q: 'On a hot day a road far ahead looks wet. Which explanation is correct?',
      options: ['Water vapour above the road reflects the sky like a mirror.', 'Hot air near the road has a higher refractive index, so rays bend down into it.', 'Hot air near the road has a lower refractive index, so rays from the sky curve upwards towards the eye.', 'Light reflects off the asphalt by total internal reflection inside the road.'], answer: 2,
      sol: 'Air\'s refractive index falls as it warms. Near the hot road the index is lowest, so rays heading down at a shallow angle bend away from the lower-index layer and curve back up (the least-time path dips into the faster air). The eye sees sky light coming from the road: a mirage that looks like water.' },
    { id: 'gop-036', type: 'nat', level: 4, exams: ['jam'], sub: 'apparent depth', unit: 'cm',
      q: 'A coin lies at the bottom of a beaker under $6$ cm of glass ($n = 1.5$) covered by $4$ cm of water ($n = 4/3$). Viewed from straight above, the coin appears ______ cm below the water surface.',
      answer: 7, tol: 0.05, calc: () => 4 / (4 / 3) + 6 / 1.5,
      sol: 'For near-normal viewing each layer contributes its thickness divided by its index: $4/(4/3) + 6/1.5 = 3 + 4 = 7$ cm.' },

    // ---------- level 5 ----------
    { id: 'gop-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'thick lenses', unit: 'cm',
      q: 'A thick equiconvex glass lens ($n = 1.5$) has radii $20$ cm and a centre thickness of $3$ cm. Its equivalent focal length is ______ cm (to two decimal places).',
      answer: 20.51, tol: 0.05, calc: () => 1 / (0.5 * (1 / 20 + 1 / 20 - 0.5 * 3 / (1.5 * 20 * 20))),
      sol: 'Thick-lens formula: $\\dfrac1f = (n - 1)\\left[\\dfrac1{R_1} - \\dfrac1{R_2} + \\dfrac{(n - 1)d}{nR_1R_2}\\right]$ with $R_1 = 20$, $R_2 = -20$: $0.5[0.05 + 0.05 - 0.5\\times3/(1.5\\times400)] = 0.5[0.1 - 0.0025] = 0.04875$, so $f = 20.51$ cm (the thin-lens value is 20 cm).',
      trap: 'Sign of the thickness term: with $R_2 < 0$ it reduces the power of a biconvex lens.' },
    { id: 'gop-038', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'spherical surface', unit: 'cm',
      q: 'A small air bubble is inside a solid glass sphere ($n = 1.5$, radius $10$ cm), $5$ cm from the centre. It is viewed from outside along the diameter through it, from the side nearer the bubble. The bubble appears ______ cm inside the surface.',
      answer: 4, tol: 0.05, calc: () => -1 / ((1 - 1.5) / -10 + 1.5 / -5),
      sol: 'Light goes from glass to air towards the viewer. Nearer surface: the bubble is $5$ cm inside, $u = -5$ cm; the centre of curvature is inside the glass, $R = -10$ cm. $\\dfrac{1}{v} - \\dfrac{1.5}{-5} = \\dfrac{1 - 1.5}{-10}$ gives $1/v = 0.05 - 0.3 = -0.25$, $v = -4$ cm: a virtual image $4$ cm inside the surface.',
      trap: 'Using the flat-surface rule (depth$/n = 3.33$ cm) ignores the curvature.' },
    { id: 'gop-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'ray matrices',
      q: 'An optical system in air has ray-transfer matrix $\\begin{pmatrix}A & B\\\\ C & D\\end{pmatrix}$ acting on (height, angle) from an input plane to an output plane. Which statement is correct?',
      options: ['Its determinant equals the refractive index of glass.', 'If $A = 0$ the two planes are object and image planes.', 'The power of the system is $+C$.', 'If $B = 0$ the planes are conjugate (object and image) and $A$ is the lateral magnification.'], answer: 3,
      sol: 'Output height $= Ay_{in} + B\\theta_{in}$. If $B = 0$, every ray from one input point reaches the same output point whatever its angle: the planes are conjugate and $A$ is the magnification. Between equal media $\\det = AD - BC = 1$. The power is $-C$ (a converging lens has $C = -1/f$). $A = 0$ means the output plane is the back focal plane.' },
    { id: 'gop-040', type: 'msq', level: 5, exams: ['jam'], sub: 'dispersion', format: 'statements',
      q: 'Which statements about rainbows are correct?',
      options: ['In the primary bow red is on the outside.', 'The primary bow lies about $42^\\circ$ from the point directly opposite the Sun.', 'The secondary bow has its colours in the reverse order.', 'The secondary bow is formed by one internal reflection in each drop.'], answer: [0, 1, 2],
      sol: 'Each drop sends light back most strongly at its angle of minimum deviation: about $42^\\circ$ (red) and $40^\\circ$ (violet) from the antisolar point for one internal reflection, so red is outside. The secondary bow (about $51^\\circ$) comes from two internal reflections, which reverses the colours.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'gop-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'images',
      make(r) {
        const el = Q5.choose(r, ['a concave mirror', 'a thin convex lens', 'a thin concave lens', 'a convex mirror']);
        const zone = Q5.int(r, 0, 2), conv = el === 'a concave mirror' || el === 'a thin convex lens';
        const where = ['farther than $2f$ from it', 'between $f$ and $2f$ from it', 'closer than $f$ to it'][zone];
        const kinds = ['real, inverted and diminished', 'real, inverted and magnified', 'virtual, erect and magnified', 'virtual, erect and diminished'];
        const right = conv ? kinds[zone] : kinds[3];
        const o = Q5.mcqOptions(r, right, kinds.filter((k) => k !== right));
        return { q: `A small object stands on the axis of ${el} (focal length of size $f$), ${where}. Its image is`, ...o,
          sol: conv ? `For a converging element: beyond $2f$ the image is real, inverted, between $f$ and $2f$ on the other side, and smaller; between $f$ and $2f$ it is real, inverted, beyond $2f$ and larger; inside $f$ the rays still diverge after the element, so the image is virtual, erect and larger. Here: ${right}.`
            : 'A diverging element (concave lens or convex mirror) always forms a virtual, erect, diminished image of a real object, between the element and its focus, wherever the object is.',
          trap: 'For a concave lens or convex mirror the distance does not matter: the image is always virtual, erect and smaller.' };
      } },
    { id: 'gop-t22', type: 'nat', level: 2, exams: ['jam'], sub: 'thin lenses', unit: 'cm',
      make(r) {
        const f = Q5.int(r, 5, 30), [m, ms] = Q5.choose(r, [[0.5, '1/2'], [2, '2'], [3, '3'], [4, '4'], [1.5, '1.5'], [0.25, '1/4']]);
        const u = f * (1 + 1 / m);
        return { q: `A thin convex lens of focal length $${f}$ cm forms a real image $${ms}$ times the size of the object. The object is ______ cm from the lens (to two decimal places).`,
          answer: Q5.round(u, 2), tol: 0.01, f, m,
          sol: `A real image is inverted: $v/u = ${ms}$ in size, with $v = ${ms}\\,u$ (distances measured as positive on their own sides). The lens equation $\\dfrac1u + \\dfrac1v = \\dfrac1f$ gives $\\dfrac1u\\left(1 + \\dfrac1{${ms}}\\right) = \\dfrac1{${f}}$, so $u = f(1 + 1/m) = ${Q5.round(u, 2)}$ cm.`,
          trap: 'Magnification is $v/u$, so a magnified real image needs the object between $f$ and $2f$.' };
      },
      verify: (p) => { const v = p.f * (1 + p.m); return v / p.m; } },
    { id: 'gop-t23', type: 'msq', level: 3, exams: ['jam'], sub: 'lensmaker', format: 'statements',
      make(r) {
        const F = Q5.int(r, 10, 30), nm = Q5.choose(r, [1.2, 1.33, 1.5, 1.6, 1.75]);
        const ratio = 0.5 / (1.5 / nm - 1), fl = F * ratio;
        const T = ['Its power is smaller in size than in air.'], Fa = ['Its focal length is the same as in air.'];
        if (nm < 1.5) { T.push('It still converges light.', `Its focal length is $${Q5.round(fl, 1)}$ cm.`); Fa.push('It now diverges light.', `Its focal length is $${Q5.round(F / ratio, 1)}$ cm.`, 'It has no focusing effect at all.'); }
        else if (nm > 1.5) { T.push('It now diverges light.', `Its focal length is $${Q5.round(fl, 1)}$ cm (a diverging lens).`); Fa.push('It still converges light.', `Its focal length is $+${Q5.round(-fl, 1)}$ cm (a converging lens).`, 'It has no focusing effect at all.'); }
        else { T.push('It has no focusing effect at all.', 'Light crosses the glass surfaces without bending.'); Fa.push('It still converges light.', 'It now diverges light.', `Its focal length is $${2 * F}$ cm.`); }
        const o = q5msq(r, T, Fa);
        return { q: `A thin symmetric biconvex glass lens ($n = 1.5$) has focal length $${F}$ cm in air. It is put into a liquid of refractive index $${nm}$. Which statements are correct?`, ...o,
          sol: `Lensmaker: $\\dfrac1f = \\left(\\dfrac{n_g}{n_m} - 1\\right)\\left(\\dfrac1{R_1} - \\dfrac1{R_2}\\right)$. In air the bracket is $0.5$; in the liquid it is $1.5/${nm} - 1 = ${Q5.round(1.5 / nm - 1, 4)}$. ${nm === 1.5 ? 'It is zero: the lens is invisible to the light.' : `So $f_{\\rm liq} = ${F}\\times\\dfrac{0.5}{${Q5.round(1.5 / nm - 1, 4)}} = ${Q5.round(fl, 1)}$ cm${nm > 1.5 ? ', negative: the lens diverges because the liquid is optically denser than the glass' : ''}.`} The size of the bracket is below $0.5$ for any liquid with $n > 1$, so the power always shrinks.`,
          trap: 'A convex lens in a denser liquid behaves as a diverging lens.' };
      } },
    { id: 'gop-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'lens combinations', format: 'units',
      make(r) {
        const P1 = Q5.choose(r, [2, 4, 5, 2.5, 10]); let P2 = Q5.choose(r, [-1, -2, -4, -1.25, -5]); if (P1 + P2 === 0) P2 -= 1;
        const f = 100 / (P1 + P2), s = (x) => `$${Q5.round(x, 2)}$ cm`;
        const o = Q5.mcqOptions(r, f, [-f, 100 * (1 / P1 + 1 / P2), (P1 + P2), 100 / (P1 - P2)], s);
        return { q: `Thin lenses of power $+${P1}$ D and $${P2}$ D are placed in contact. The focal length of the combination is`, ...o,
          sol: `Powers in contact add: $P = ${P1} + (${P2}) = ${P1 + P2}$ D. A dioptre is m$^{-1}$, so $f = 1/P = ${Q5.round(1 / (P1 + P2), 4)}$ m $= ${Q5.round(f, 2)}$ cm${f < 0 ? ' (negative: the pair diverges)' : ''}.`,
          trap: 'Add powers, not focal lengths; and $1$ D $= 1$ m$^{-1}$, so $f$ in cm is $100/P$.' };
      } },
    { id: 'gop-t25', type: 'nat', level: 2, exams: ['jam'], sub: 'apparent depth', unit: 'cm',
      make(r) {
        const d1 = Q5.int(r, 4, 20), d2 = Q5.int(r, 4, 20), [n1, s1] = Q5.choose(r, [[4 / 3, '4/3'], [1.25, '1.25'], [1.36, '1.36']]), [n2, s2] = Q5.choose(r, [[1.5, '1.5'], [1.6, '1.6'], [1.44, '1.44']]);
        const app = d1 / n1 + d2 / n2;
        return { q: `A tank holds a layer of liquid A ($n = ${s1}$), $${d1}$ cm deep, floating on a layer of liquid B ($n = ${s2}$), $${d2}$ cm deep. Seen from straight above, a coin on the bottom appears to be ______ cm below the top surface (to two decimal places).`,
          answer: Q5.round(app, 2), tol: 0.02, d1, d2, n1, n2,
          sol: `Near the normal each layer shows its thickness divided by its index, and the layers add: $\\dfrac{${d1}}{${s1}} + \\dfrac{${d2}}{${s2}} = ${Q5.round(d1 / n1, 3)} + ${Q5.round(d2 / n2, 3)} = ${Q5.round(app, 2)}$ cm.`,
          trap: 'Do not use one average index for the whole depth; each layer is divided by its own index.' };
      },
      verify: (p) => (p.d1 + p.d2) - p.d1 * (1 - 1 / p.n1) - p.d2 * (1 - 1 / p.n2) },
    { id: 'gop-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'apparent depth',
      make(r) {
        const d = pick(r, 0.5, 5, 0.1), [n, tex] = choose(r, [[4 / 3, '4/3'], [1.5, '1.5'], [1.33, '1.33'], [1.6, '1.6']]);
        return { q: `An object lies $${d}$ m below the surface of a liquid of refractive index $${tex}$. Viewed from straight above it appears ______ m below the surface (to two decimal places).`,
          answer: round(d / n, 2), tol: 0.01, unit: 'm', d, n,
          sol: `Apparent depth $= d/n = ${d}/${tex} = ${round(d / n, 3)}$ m.`,
          trap: 'Divide by $n$; objects under water look shallower.' };
      },
      verify: (p) => p.d / p.n },
    { id: 'gop-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'thin lenses',
      make(r) {
        const f = choose(r, [10, 12, 15, 20, 25, 30, 40]), u = f + int(r, 2, 40);
        const v = 1 / (1 / f - 1 / u);
        return { q: `An object is $${u}$ cm in front of a thin convex lens of focal length $${f}$ cm. The real image forms ______ cm behind the lens (to one decimal place).`,
          answer: round(v, 1), tol: 0.1, unit: 'cm', f, u,
          sol: `$1/v = 1/f + 1/u = 1/${f} - 1/${u}$, so $v = ${round(v, 2)}$ cm (magnification $${round(-v / u, 2)}$).`,
          trap: 'With the Cartesian convention $u$ is negative for a real object.' };
      },
      verify: (p) => p.f * p.u / (p.u - p.f) },
    { id: 'gop-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'lens combinations',
      make(r) {
        const f1 = choose(r, [10, 15, 20, 25, 30, 40]), f2 = choose(r, [10, 15, 20, 25, 30, 40]), d = int(r, 0, 15);
        const F = f1 * f2 / (f1 + f2 - d);
        return { q: `Two thin convex lenses of focal lengths $${f1}$ cm and $${f2}$ cm are $${d}$ cm apart on a common axis. The equivalent focal length is ______ cm (to two decimal places).`,
          answer: round(F, 2), tol: 0.02, unit: 'cm', f1, f2, d,
          sol: `$1/F = 1/f_1 + 1/f_2 - d/(f_1f_2)$, so $F = f_1f_2/(f_1 + f_2 - d) = ${f1 * f2}/${f1 + f2 - d} = ${round(F, 2)}$ cm.`,
          trap: 'Include the separation term unless the lenses touch.' };
      },
      verify: (p) => p.f1 * p.f2 / (p.f1 + p.f2 - p.d) },
    { id: 'gop-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'total internal reflection',
      make(r) {
        const n1 = choose(r, [1.4, 1.5, 1.6, 1.7, 2.42]), n2 = choose(r, [1, 1, 1.33]);
        const C = Math.asin(n2 / n1) / deg;
        return { q: `Light travels from a medium of index $${n1}$ towards one of index $${n2}$. The critical angle is ______ degrees (to one decimal place).`,
          answer: round(C, 1), tol: 0.1, unit: 'degrees', n1, n2,
          sol: `$\\sin C = n_2/n_1 = ${n2}/${n1} = ${round(n2 / n1, 4)}$, so $C = ${round(C, 1)}^\\circ$.`,
          trap: 'The ratio is the smaller index over the larger.' };
      },
      verify: (p) => Math.asin(p.n2 / p.n1) / deg },
    { id: 'gop-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'prisms',
      make(r) {
        const A = choose(r, [30, 45, 60, 60, 72]), D = int(r, 20, 50);
        const n = Math.sin((A + D) / 2 * deg) / Math.sin(A / 2 * deg);
        return { q: `A prism of apex angle $${A}^\\circ$ shows a minimum deviation of $${D}^\\circ$. Its refractive index is ______ (to three decimal places).`,
          answer: round(n, 3), tol: 0.002, A, D,
          sol: `$n = \\sin[(A + D)/2]/\\sin(A/2) = \\sin${(A + D) / 2}^\\circ/\\sin${A / 2}^\\circ = ${round(n, 3)}$.`,
          trap: 'Halve both angles inside the sines.' };
      },
      verify: (p) => Math.sin((p.A + p.D) / 2 * deg) / Math.sin(p.A / 2 * deg) },
    { id: 'gop-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'lensmaker',
      make(r) {
        const f = choose(r, [10, 15, 20, 25, 30]), [nl, ntex] = choose(r, [[1.5, '1.5'], [1.6, '1.6'], [1.7, '1.7']]), [nm, mtex] = choose(r, [[4 / 3, '4/3'], [1.2, '1.2'], [1.25, '1.25']]);
        const fp = f * (nl - 1) / (nl / nm - 1);
        return { q: `A thin glass lens ($n = ${ntex}$) has focal length $${f}$ cm in air. In a liquid of index $${mtex}$ its focal length is ______ cm (to one decimal place).`,
          answer: round(fp, 1), tol: Math.max(0.1, round(fp * 0.003, 1)), unit: 'cm', f, nl, nm,
          sol: `$f' = f\\dfrac{n - 1}{n/n_m - 1} = ${f}\\times\\dfrac{${round(nl - 1, 2)}}{${round(nl / nm - 1, 4)}} = ${round(fp, 1)}$ cm.`,
          trap: 'Use the ratio $n/n_m$, not the difference.' };
      },
      verify: (p) => p.f * (p.nl - 1) / (p.nl / p.nm - 1) },
    { id: 'gop-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'mirrors',
      make(r) {
        const f = choose(r, [10, 12, 15, 20, 25]), u0 = int(r, 3, 60), u = u0 === f ? u0 + 1 : u0;
        const v = 1 / (-1 / f + 1 / u); // Cartesian: 1/v = 1/f - 1/u with f = -F, u = -U
        const m = -v / -u;
        return { q: `An object is $${u}$ cm in front of a concave mirror of focal length $${f}$ cm. The lateral magnification (positive for an upright image) is ______ (to two decimal places).`,
          answer: round(m, 2), tol: 0.02, f, u,
          sol: `Cartesian: $f = -${f}$, $u = -${u}$. $1/v = 1/f - 1/u = ${round(-1 / f + 1 / u, 5)}$, $v = ${round(v, 2)}$ cm. $m = -v/u = ${round(m, 2)}$ (${m > 0 ? 'upright, virtual' : 'inverted, real'}).`,
          trap: 'For a mirror $m = -v/u$; for a lens $m = +v/u$.' };
      },
      verify: (p) => p.f / (p.f - p.u) },
    { id: 'gop-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'thin lenses',
      make(r) {
        const f = choose(r, [10, 15, 20, 25]);
        const cases = [
          [0.5, 'virtual, upright and magnified'], [1.5, 'real, inverted and magnified'], [2, 'real, inverted and the same size'],
          [3, 'real, inverted and diminished'],
        ];
        const [k, right] = choose(r, cases);
        const o = mcqOptions(r, right, cases.map((c) => c[1]).filter((s) => s !== right).concat(['virtual, inverted and diminished']), (s) => s);
        return { q: `An object is placed $${k * f}$ cm in front of a thin convex lens of focal length $${f}$ cm. The image is`, ...o,
          sol: `The object is at ${k}$f$. Object inside $f$: virtual, upright, magnified. Between $f$ and $2f$: real, inverted, magnified. At $2f$: real, inverted, same size. Beyond $2f$: real, inverted, diminished. So the image is ${right}.`,
          trap: 'Compare the object distance with $f$ and $2f$ first.' };
      } },
    ...r4.gens,
  ],
};
