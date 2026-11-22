// Interference: coherence, two-beam intensity, Young's double slit (fringe width, shifts, media, white light),
// Lloyd's mirror and the biprism, thin films (reflection phase changes, AR coatings, wedges, colours), Newton's
// rings, the Michelson interferometer (fringe counting, doublets, refractive index of gases), coherence length,
// visibility and spatial coherence. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

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
  topic: 'interference',
  items: [
    // ---------- level 1 ----------
    { id: 'ifr-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'young double slit',
      q: 'In Young\'s double-slit experiment the slit separation is doubled and the slit-to-screen distance is kept the same. The fringe width',
      options: ['doubles', 'halves', 'stays the same', 'becomes four times larger'], answer: 1,
      sol: 'Fringe width $\\beta = \\lambda D/d$. Doubling $d$ halves $\\beta$: slits further apart give finer fringes.',
      trap: 'Expecting wider spacing from wider slit separation; the relation is inverse.' },
    { id: 'ifr-002', type: 'nat', level: 1, exams: ['jam'], sub: 'young double slit', unit: 'mm',
      q: 'Light of wavelength $600$ nm falls on two slits $0.3$ mm apart. On a screen $1.5$ m away the fringe width is ______ mm.',
      answer: 3, tol: 0, calc: () => 600e-9 * 1.5 / 0.3e-3 * 1000,
      sol: '$\\beta = \\lambda D/d = (600\\times10^{-9})(1.5)/(0.3\\times10^{-3}) = 3\\times10^{-3}$ m $= 3$ mm.',
      trap: 'Mixing nm and mm: convert everything to metres first.' },
    { id: 'ifr-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'coherence',
      q: 'Two light sources are coherent if they have',
      options: ['the same amplitude only', 'the same direction of travel', 'the same intensity', 'a constant phase difference (and the same frequency)'], answer: 3,
      sol: 'A steady pattern needs the phase difference at each point to stay fixed in time, which requires the same frequency and a constant phase relation. Equal intensities improve contrast but are not needed for coherence.',
      trap: 'Equal intensity gives perfectly dark minima, but it is not what coherence means.' },
    { id: 'ifr-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'path and phase',
      q: 'Two waves of wavelength $\\lambda$ arrive at a point with a path difference of $\\lambda/4$. Their phase difference is',
      options: ['$\\pi/2$', '$\\pi$', '$2\\pi$', '$\\pi/4$'], answer: 0,
      sol: 'Phase difference $= (2\\pi/\\lambda)\\times$ path difference $= (2\\pi/\\lambda)(\\lambda/4) = \\pi/2$.' },
    { id: 'ifr-005', type: 'nat', level: 1, exams: ['jam'], sub: 'intensity',
      q: 'Two coherent waves of intensities $I$ and $4I$ interfere. The ratio of maximum to minimum intensity in the pattern is ______.',
      answer: 9, tol: 0, calc: () => ((1 + 2) / (2 - 1)) ** 2,
      sol: 'Amplitudes are proportional to $\\sqrt I$: ratio $1 : 2$. $I_{\\max}/I_{\\min} = (a_1 + a_2)^2/(a_1 - a_2)^2 = (1 + 2)^2/(2 - 1)^2 = 9$.',
      trap: 'Adding intensities ($5I$ and $3I$) instead of amplitudes gives $5/3$.' },
    { id: 'ifr-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'thin films',
      q: 'A vertical soap film drains and becomes very thin at the top. Seen in reflected light, the thinnest part looks',
      options: ['violet', 'white', 'black', 'red'], answer: 2,
      sol: 'Reflection off the front surface (air to soap) gains a phase of $\\pi$; reflection off the back surface (soap to air) does not. When the thickness is much less than $\\lambda$, the path difference is nearly zero, so the two reflections cancel for every colour: the film looks black.',
      trap: 'Thinking zero thickness means zero path difference and so a bright film: the extra $\\pi$ from one reflection is the key.' },

    // ---------- level 2 ----------
    { id: 'ifr-007', type: 'nat', level: 2, exams: ['jam'], sub: 'thin films', unit: 'nm',
      q: 'A thin film of refractive index $1.5$ in air is lit normally by light of wavelength $600$ nm. The smallest thickness for which the reflected light is strongest is ______ nm.',
      answer: 100, tol: 0, calc: () => 600 / (4 * 1.5),
      sol: 'Only the top reflection gains $\\pi$, so reflection is strongest when $2nt = (m + \\tfrac12)\\lambda$. The smallest is $m = 0$: $t = \\lambda/(4n) = 600/6 = 100$ nm.',
      trap: 'Using $2nt = \\lambda$ (forgetting the $\\pi$ shift) gives 200 nm, which is a reflection minimum.' },
    { id: 'ifr-008', type: 'msq', level: 2, exams: ['jam'], sub: 'young double slit', format: 'statements',
      q: 'Which statements about Young\'s double-slit experiment are correct?',
      options: ['With identical slits lit in phase, the central fringe is bright.', 'If the whole apparatus is put in water ($n = 4/3$), the fringe width becomes $3/4$ of its value in air.', 'With white light, the central fringe is white and the others are coloured.', 'Moving the screen further away makes the fringes narrower.'], answer: [0, 1, 2],
      sol: 'A: equal paths at the centre. B: the wavelength in water is $\\lambda/n$, so $\\beta$ becomes $\\beta/n = 3\\beta/4$. C: every colour has its zero-order maximum at the centre; other orders separate by colour. D: false: $\\beta = \\lambda D/d$ grows with $D$.' },
    { id: 'ifr-009', type: 'nat', level: 2, exams: ['jam'], sub: 'fringe shift', unit: 'μm',
      q: 'A thin glass sheet ($n = 1.5$) over one slit of a Young\'s experiment shifts the pattern by $5$ fringes for light of wavelength $600$ nm. The sheet\'s thickness is ______ μm.',
      answer: 6, tol: 0, calc: () => 5 * 0.6 / 0.5,
      sol: 'The sheet adds an optical path $(n - 1)t$. A shift of $N$ fringes means $(n - 1)t = N\\lambda$, so $t = 5\\times0.6\\ \\mu\\text{m}/0.5 = 6\\ \\mu$m.',
      trap: 'Using $nt$ instead of $(n - 1)t$: the sheet replaces an equal thickness of air.' },
    { id: 'ifr-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'newtons rings',
      q: 'In Newton\'s rings seen by reflected light (air film between a lens of radius of curvature $R$ and a flat plate), the radius of the $n$th dark ring is',
      options: ['$\\sqrt{2n\\lambda R}$', '$\\sqrt{n\\lambda R}$', '$n\\lambda R$', '$\\sqrt{(n + \\tfrac12)\\lambda R}$'], answer: 1,
      sol: 'The air gap at radius $r$ is $t = r^2/(2R)$. With one $\\pi$ reflection shift, dark rings need $2t = n\\lambda$, so $r^2/R = n\\lambda$ and $r_n = \\sqrt{n\\lambda R}$ (the centre, $n = 0$, is dark).',
      trap: '$\\sqrt{(n + \\frac12)\\lambda R}$ gives the bright rings.' },
    { id: 'ifr-011', type: 'nat', level: 2, exams: ['jam'], sub: 'newtons rings', unit: 'mm',
      q: 'Newton\'s rings are formed in reflected light of wavelength $589$ nm with a lens of radius of curvature $1.0$ m on a flat plate (air film). The radius of the 10th dark ring (counting the dark centre as $n = 0$) is ______ mm (to two decimal places).',
      answer: 2.43, tol: 0.02, calc: () => Math.sqrt(10 * 589e-9 * 1) * 1000,
      sol: '$r_{10} = \\sqrt{n\\lambda R} = \\sqrt{10\\times589\\times10^{-9}\\times1} = \\sqrt{5.89\\times10^{-6}} = 2.43\\times10^{-3}$ m.' },
    { id: 'ifr-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'michelson',
      q: 'In a Michelson interferometer, one mirror is moved through a distance $d$ and $N$ fringes pass the centre of the field. Then',
      options: ['$d = 2N\\lambda$', '$d = N\\lambda/4$', '$d = N\\lambda$', '$2d = N\\lambda$'], answer: 3,
      sol: 'Light travels to the mirror and back, so moving it by $d$ changes the path by $2d$. Each fringe is one wavelength of path: $2d = N\\lambda$.',
      trap: 'Forgetting the round trip gives $d = N\\lambda$.' },
    { id: 'ifr-013', type: 'nat', level: 2, exams: ['jam'], sub: 'michelson', unit: 'nm',
      q: 'Moving a Michelson mirror by $0.1$ mm makes $400$ fringes cross the field. The wavelength is ______ nm.',
      answer: 500, tol: 0, calc: () => 2 * 0.1e-3 / 400 * 1e9,
      sol: '$\\lambda = 2d/N = 2(10^{-4})/400 = 5\\times10^{-7}$ m $= 500$ nm.' },
    { id: 'ifr-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'wedge',
      q: 'A thin wedge of a transparent material of refractive index $n$ and small angle $\\theta$ is lit normally by light of wavelength $\\lambda$. The spacing between adjacent bright fringes in reflection is',
      options: ['$\\lambda/(2n\\theta)$', '$\\lambda/(n\\theta)$', '$2n\\theta/\\lambda$', '$\\lambda/(2\\theta)$, whatever $n$ is'], answer: 0,
      sol: 'At distance $x$ from the edge the thickness is $\\theta x$ and the optical path difference is $2n\\theta x$. Moving one fringe changes this by $\\lambda$: $\\Delta x = \\lambda/(2n\\theta)$.',
      trap: 'The option without $n$ is right only for an air wedge ($n = 1$).' },
    { id: 'ifr-015', type: 'msq', level: 2, exams: ['jam'], sub: 'coherence', format: 'multi',
      q: 'Which pairs act as coherent sources?',
      options: ['Two narrow slits lit by light from one narrow slit', 'Two independent sodium lamps', 'A narrow slit and its image in a plane mirror (Lloyd\'s mirror)', 'The two beams made by splitting one laser beam with a half-silvered mirror'], answer: [0, 2, 3],
      sol: 'Coherent sources must come from the same original wavefront, by division of wavefront (A, C) or of amplitude (D). Two independent lamps emit with random, unrelated phases (B).' },
    { id: 'ifr-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'intensity',
      q: 'Two coherent waves, each of intensity $I_0$, meet with phase difference $\\phi$. The resulting intensity is',
      options: ['$2I_0$', '$2I_0\\cos^2(\\phi/2)$', '$4I_0\\cos^2(\\phi/2)$', '$4I_0\\cos^2\\phi$'], answer: 2,
      sol: '$I = I_1 + I_2 + 2\\sqrt{I_1I_2}\\cos\\phi = 2I_0(1 + \\cos\\phi) = 4I_0\\cos^2(\\phi/2)$. It ranges from $0$ to $4I_0$; the average over the pattern is $2I_0$, so energy is conserved.',
      trap: '$2I_0$ is the result for incoherent waves (or the average of the coherent pattern).' },
    { id: 'ifr-017', type: 'mcq', level: 2, exams: ['jam'], sub: 'newtons rings', format: 'statements',
      q: 'Which statement about Newton\'s rings (air film, reflected light) is NOT correct?',
      options: ['In transmitted light the centre is bright.', 'The radius of a ring is proportional to its order $n$.', 'The rings get closer together further from the centre.', 'A lens with a larger radius of curvature gives larger rings.'], answer: 1,
      sol: '$r_n = \\sqrt{n\\lambda R}$: the radius grows as $\\sqrt n$, not $n$ (so D is the wrong statement), which is exactly why the rings crowd together further out (A). Larger $R$ gives larger rings (B). The transmitted pattern is complementary to the reflected one, so its centre is bright (C).' },

    // ---------- level 3 ----------
    { id: 'ifr-018', type: 'nat', level: 3, exams: ['jam'], sub: 'young double slit', unit: 'mm',
      q: 'A Young\'s experiment ($d = 0.5$ mm, $D = 1$ m) uses light containing $450$ nm and $600$ nm. The smallest non-zero distance from the central maximum at which bright fringes of the two wavelengths coincide is ______ mm.',
      answer: 3.6, tol: 0.01, calc: () => 4 * 450e-9 * 1 / 0.5e-3 * 1000,
      sol: 'Coincidence needs $m_1(450) = m_2(600)$, smallest with $m_1 = 4$, $m_2 = 3$: path difference $1800$ nm. Position $y = 1800\\times10^{-9}\\times1/(0.5\\times10^{-3}) = 3.6\\times10^{-3}$ m.',
      trap: 'Multiplying the two fringe widths, or taking their sum, does not give the coincidence point; use the lowest common multiple of the wavelengths.' },
    { id: 'ifr-019', type: 'nat', level: 3, exams: ['jam'], sub: 'intensity',
      q: 'In a two-slit pattern with equal slits, the intensity at a point where the path difference is $\\lambda/3$, divided by the intensity at the central maximum, is ______ (to two decimal places).',
      answer: 0.25, tol: 0.01, calc: () => Math.cos(Math.PI / 3) ** 2,
      sol: 'Phase difference $\\phi = 2\\pi/3$. $I/I_{\\max} = \\cos^2(\\phi/2) = \\cos^2(\\pi/3) = 1/4$.',
      trap: 'Using $\\cos^2\\phi$ instead of $\\cos^2(\\phi/2)$ gives the same number here by coincidence ($0.25$); check with $\\lambda/4$, where the right answer is $0.5$ and the wrong one is $0$.' },
    { id: 'ifr-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'lloyds mirror',
      q: 'In Lloyd\'s mirror, the fringe at the line where the mirror plane meets the screen (zero path difference) is',
      options: ['coloured', 'missing, because no light reaches it', 'bright, because the paths are equal', 'dark, because reflection at the mirror adds a phase of $\\pi$'], answer: 3,
      sol: 'Light reflected at grazing incidence from a denser medium gains a phase of $\\pi$. At zero path difference the direct and reflected waves are therefore out of phase: a dark fringe. This experiment was early evidence for the phase change on reflection.' },
    { id: 'ifr-021', type: 'nat', level: 3, exams: ['jam'], sub: 'thin films', unit: 'nm',
      q: 'An oil film ($n = 1.40$, thickness $500$ nm) floats on water ($n = 1.33$). In white light at normal incidence, the wavelength between $450$ nm and $700$ nm that is most strongly reflected is ______ nm.',
      answer: 560, tol: 1, calc: () => 2 * 1.4 * 500 / 2.5,
      sol: 'Air to oil ($1 \\to 1.40$): phase $\\pi$. Oil to water ($1.40 \\to 1.33$, to a less dense medium): no phase change. One $\\pi$ shift, so strong reflection needs $2nt = (m + \\tfrac12)\\lambda$, i.e. $\\lambda = 1400/(m + \\tfrac12)$ nm $= 2800, 933, 560, 400, \\dots$ Only $560$ nm lies in the range.',
      trap: 'Assuming a $\\pi$ shift at both surfaces (as for oil on glass of higher index) gives $\\lambda = 1400/m = 700$ nm, the wrong colour.' },
    { id: 'ifr-022', type: 'msq', level: 3, exams: ['jam'], sub: 'thin films', format: 'statements',
      q: 'A glass lens ($n = 1.5$) is coated with a thin layer of MgF$_2$ ($n = 1.38$) to cut reflection at wavelength $\\lambda$ (normal incidence). Which statements are correct?',
      options: ['Both reflections (air-coating and coating-glass) have a phase change of $\\pi$.', 'The thinnest coating that works has thickness $\\lambda/(4 \\times 1.38)$.', 'A coating of thickness $\\lambda/(2\\times1.38)$ works just as well.', 'Complete cancellation would need a coating index of about $\\sqrt{1.5}$.'], answer: [0, 1, 3],
      sol: 'A: both are reflections into a denser medium. So the phase shifts cancel and destructive interference needs $2nt = \\lambda/2$: $t = \\lambda/(4n)$ (B). A half-wave layer gives $2nt = \\lambda$: constructive, as if there were no coating (C false). D: the two reflected amplitudes are equal when $n_c/1 = 1.5/n_c$, so $n_c = \\sqrt{1.5} = 1.22$.' },
    { id: 'ifr-023', type: 'nat', level: 3, exams: ['jam'], sub: 'newtons rings',
      q: 'The diameter of the 10th dark Newton\'s ring is $1.40$ cm with air in the gap and $1.27$ cm when a liquid fills it. The refractive index of the liquid is ______ (to three decimal places).',
      answer: 1.215, tol: 0.005, calc: () => (1.40 / 1.27) ** 2,
      sol: 'With a liquid, dark rings need $2\\mu t = n\\lambda$, so $D^2 \\propto 1/\\mu$. Hence $\\mu = (D_{\\text{air}}/D_{\\text{liq}})^2 = (1.40/1.27)^2 = 1.215$.',
      trap: 'Using the ratio of diameters without squaring gives $1.102$.' },
    { id: 'ifr-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'newtons rings',
      q: 'To measure a lens\'s radius of curvature $R$ with Newton\'s rings, one measures the diameters $D_n$ and $D_{n+p}$ of two dark rings (wavelength $\\lambda$). Then',
      options: ['$R = \\dfrac{D_{n+p}^2 - D_n^2}{4p\\lambda}$', '$R = \\dfrac{D_{n+p}^2 - D_n^2}{p\\lambda}$', '$R = \\dfrac{D_{n+p} - D_n}{4p\\lambda}$', '$R = \\dfrac{D_{n+p}^2 - D_n^2}{2p\\lambda}$'], answer: 0,
      sol: '$D_n^2 = 4r_n^2 = 4n\\lambda R$. Subtracting: $D_{n+p}^2 - D_n^2 = 4p\\lambda R$. Using a difference removes the error from not knowing exactly where the contact point is (dust, uncertain order).',
      trap: 'Forgetting that the diameter is twice the radius drops the factor 4.' },
    { id: 'ifr-025', type: 'nat', level: 3, exams: ['jam'], sub: 'newtons rings', unit: 'cm',
      q: 'In a Newton\'s rings experiment with $\\lambda = 589$ nm, the diameters of the 5th and 15th dark rings are $0.336$ cm and $0.590$ cm. The radius of curvature of the lens is ______ cm (to the nearest cm).',
      answer: 100, tol: 1, calc: () => (0.590 ** 2 - 0.336 ** 2) / (4 * 10 * 589e-7),
      sol: '$R = (D_{15}^2 - D_5^2)/(4p\\lambda) = (0.3481 - 0.1129)\\ \\text{cm}^2/(4\\times10\\times5.89\\times10^{-5}\\ \\text{cm}) = 0.2352/0.002356 = 99.8$ cm, so about $100$ cm.',
      trap: 'Keep the wavelength in cm ($5.89\\times10^{-5}$ cm) when the diameters are in cm.' },
    { id: 'ifr-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'michelson',
      q: 'A Michelson interferometer shows circular fringes. As one mirror is moved so that the path difference decreases towards zero,',
      options: ['the rings stay fixed', 'the rings turn into straight fringes at once', 'the rings collapse into the centre and get wider, and at zero path difference the field becomes uniform', 'the rings grow out of the centre and get narrower'], answer: 2,
      sol: 'A ring of order $m$ satisfies $2d\\cos\\theta = m\\lambda$. As $d$ falls, a fixed $m$ needs larger $\\cos\\theta$ (smaller $\\theta$), so rings shrink into the centre and vanish. Fewer rings fit in the field and each gets wider; at $d = 0$ the whole field has the same phase.' },
    { id: 'ifr-027', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'michelson', unit: 'mm',
      q: 'A Michelson interferometer is lit by the sodium doublet ($589.0$ nm and $589.6$ nm). The mirror movement between two successive positions where the fringes vanish (minimum visibility) is ______ mm (to three decimal places).',
      answer: 0.289, tol: 0.002, calc: () => 589.0 * 589.6 / (2 * 0.6) * 1e-6,
      sol: 'The two fringe systems go from in step to out of step when the path difference $2d$ changes by $\\lambda_1\\lambda_2/\\Delta\\lambda$. So $d = \\lambda_1\\lambda_2/(2\\Delta\\lambda) = (589.0\\times589.6)/(1.2)$ nm $= 2.894\\times10^5$ nm $= 0.289$ mm.',
      trap: 'Forgetting the factor 2 for the round trip gives $0.579$ mm.' },
    { id: 'ifr-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'biprism',
      q: 'A Fresnel biprism of refractive index $n$ and small refracting angle $\\alpha$ is placed a distance $a$ from a narrow slit. The separation of the two virtual sources is',
      options: ['$(n - 1)\\alpha/a$', '$2a(n - 1)\\alpha$', '$a(n - 1)\\alpha$', '$2an\\alpha$'], answer: 1,
      sol: 'Each half of the biprism is a thin prism that deviates light by $(n - 1)\\alpha$. Seen from the screen, each virtual image is displaced sideways by $a(n - 1)\\alpha$, in opposite directions, so they are $2a(n - 1)\\alpha$ apart.' },
    { id: 'ifr-029', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'coherence', unit: 'cm',
      q: 'A source emits at $600$ nm with a spectral width of $0.01$ nm. Its coherence length is ______ cm (to one decimal place).',
      answer: 3.6, tol: 0.05, calc: () => (600e-9) ** 2 / 0.01e-9 * 100,
      sol: '$l_c \\approx \\lambda^2/\\Delta\\lambda = (600\\times10^{-9})^2/(10^{-11}) = 3.6\\times10^{-13}/10^{-11} = 0.036$ m $= 3.6$ cm. Interference fringes fade once the path difference exceeds this.' },
    { id: 'ifr-030', type: 'msq', level: 3, exams: ['jam'], sub: 'young double slit', format: 'statements',
      q: 'In a Young\'s experiment, the narrow source slit $S$ (which lights the double slit) is moved slightly upward. Which statements are correct?',
      options: ['The whole pattern shifts downward.', 'The fringe width does not change.', 'The central bright fringe stays on the symmetry axis.', 'If the source slit is made too wide, the fringes disappear.'], answer: [0, 1, 3],
      sol: 'Moving $S$ up makes the path to the lower slit longer, so the zero-path-difference point moves down to compensate (A), and C is false. The spacing $\\lambda D/d$ is unchanged (B). A wide source is many shifted patterns added together, which wash out (D): spatial coherence.' },

    // ---------- level 4 ----------
    { id: 'ifr-031', type: 'nat', level: 4, exams: ['jam'], sub: 'fringe shift',
      q: 'In a Young\'s experiment with $\\lambda = 500$ nm, one slit is covered by a sheet of index $1.5$ and thickness $4\\ \\mu$m, and the other by a sheet of index $1.6$ and thickness $3\\ \\mu$m. The pattern shifts by ______ fringe widths (to one decimal place).',
      answer: 0.4, tol: 0.05, calc: () => ((1.5 - 1) * 4 - (1.6 - 1) * 3) / 0.5,
      sol: 'Extra optical paths: $(0.5)(4) = 2.0\\ \\mu$m and $(0.6)(3) = 1.8\\ \\mu$m. Net difference $0.2\\ \\mu$m $= 0.4\\lambda$, so a shift of $0.4$ fringe (towards the slit with the larger extra path).',
      trap: 'Adding the two shifts instead of subtracting them: both sheets delay their own beams.' },
    { id: 'ifr-032', type: 'nat', level: 4, exams: ['jam'], sub: 'wedge', unit: 'μm',
      q: 'Two flat glass plates touch along one edge and are separated by a thin wire $10$ cm away. In reflected light of wavelength $600$ nm, $20$ dark fringes per centimetre are seen. The diameter of the wire is ______ μm.',
      answer: 60, tol: 0.5, calc: () => (600e-9 / (2 * 0.5e-3)) * 0.1 * 1e6,
      sol: 'Fringe spacing $\\beta = 1\\ \\text{cm}/20 = 0.5$ mm. For an air wedge $\\beta = \\lambda/(2\\theta)$, so $\\theta = 600\\times10^{-9}/(10^{-3}) = 6\\times10^{-4}$ rad. Wire diameter $= \\theta L = 6\\times10^{-4}\\times0.1 = 6\\times10^{-5}$ m $= 60\\ \\mu$m.' },
    { id: 'ifr-033', type: 'mcq', level: 4, exams: ['jam'], sub: 'thin films',
      q: 'A thin film that looks green when viewed straight on is viewed at a steadily larger angle from the normal. The reflected colour',
      options: ['moves towards longer wavelengths (red)', 'does not change', 'becomes white', 'moves towards shorter wavelengths (blue)'], answer: 3,
      sol: 'The path difference is $2nt\\cos r$, where $r$ is the angle inside the film. It decreases as the angle grows, so the condition for a given order is met by a shorter wavelength: the colour shifts towards blue.',
      trap: 'Thinking the slanted path through the film is longer and so the colour reddens: the optical path difference is $2nt\\cos r$, which shrinks as the angle grows.' },
    { id: 'ifr-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'michelson',
      q: 'A $5$ cm long gas cell sits in one arm of a Michelson interferometer ($\\lambda = 600$ nm). As the cell is pumped out, $50$ fringes cross the field. The refractive index of the gas is $1 + x\\times10^{-4}$. The value of $x$ is ______ (to one decimal place).',
      answer: 3, tol: 0.05, calc: () => 50 * 600e-9 / (2 * 0.05) * 1e4,
      sol: 'The light crosses the cell twice, so the path change is $2(n - 1)L = N\\lambda$. $n - 1 = 50\\times600\\times10^{-9}/(2\\times0.05) = 3\\times10^{-4}$.',
      trap: 'Using $L$ instead of $2L$ doubles the answer.' },
    { id: 'ifr-035', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'visibility', format: 'statements',
      q: 'Two fully coherent beams of intensities $I$ and $4I$ interfere. Which statements are correct?',
      options: ['The fringe visibility $(I_{\\max} - I_{\\min})/(I_{\\max} + I_{\\min})$ is $0.8$.', 'The minimum intensity is not zero.', 'Visibility 1 would need equal intensities.', 'The visibility does not depend on the degree of coherence of the two beams.'], answer: [0, 1, 2],
      sol: '$I_{\\max} = 9I$, $I_{\\min} = I$, so $V = 8/10 = 0.8$ (A, B). In general $V = 2\\sqrt{I_1I_2}/(I_1 + I_2)\\times|\\gamma|$, which is 1 only for equal intensities and full coherence (C). D is false: partial coherence ($|\\gamma| < 1$) lowers the visibility.' },
    { id: 'ifr-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'newtons rings',
      q: 'Newton\'s rings are formed between a convex surface of radius $R_1$ resting on a concave surface of larger radius $R_2$ (air gap, reflected light). The radius of the $n$th dark ring is',
      options: ['$\\sqrt{n\\lambda\\dfrac{R_1R_2}{R_2 - R_1}}$', '$\\sqrt{n\\lambda\\dfrac{R_1R_2}{R_1 + R_2}}$', '$\\sqrt{n\\lambda R_1}$', '$\\sqrt{n\\lambda(R_2 - R_1)}$'], answer: 0,
      sol: 'The gap at radius $r$ is the difference of the two sags: $t = \\dfrac{r^2}{2R_1} - \\dfrac{r^2}{2R_2}$. Dark rings: $2t = n\\lambda$, so $r^2(1/R_1 - 1/R_2) = n\\lambda$, giving $r^2 = n\\lambda R_1R_2/(R_2 - R_1)$. The rings are larger than with a flat plate.',
      trap: 'Adding the sags is right for a convex surface on another convex surface, not on a concave one.' },
    { id: 'ifr-037', type: 'nat', level: 4, exams: ['jam'], sub: 'intensity', unit: 'nm',
      q: 'In a two-slit pattern with equal slits and $\\lambda = 600$ nm, the smallest path difference at which the intensity is $3/4$ of the central maximum is ______ nm.',
      answer: 100, tol: 0.5, calc: () => 600 * (2 * Math.acos(Math.sqrt(0.75))) / (2 * Math.PI),
      sol: '$\\cos^2(\\phi/2) = 3/4$ gives $\\phi/2 = \\pi/6$, so $\\phi = \\pi/3$. Path difference $= \\lambda\\phi/(2\\pi) = \\lambda/6 = 100$ nm.' },
    { id: 'ifr-038', type: 'nat', level: 4, exams: ['jam'], sub: 'young double slit', unit: 'nm',
      q: 'White light (400 to 700 nm) lights a double slit with $d = 0.5$ mm; the screen is $1$ m away. At $3$ mm from the central fringe, some wavelengths are missing (dark). The longest missing wavelength is ______ nm.',
      answer: 600, tol: 0.5, calc: () => 1500 / 2.5,
      sol: 'Path difference $= yd/D = (3\\times10^{-3})(0.5\\times10^{-3})/1 = 1.5\\ \\mu$m $= 1500$ nm. Dark when $1500 = (m + \\tfrac12)\\lambda$: $\\lambda = 3000, 1000, 600, 428.6, \\dots$ nm. In the visible range: $600$ and $428.6$ nm. The longest is $600$ nm.',
      trap: 'Using $m\\lambda$ (the bright condition) gives $750$ and $500$ nm, the colours that are strongest there.' },
    { id: 'ifr-039', type: 'mcq', level: 4, exams: ['jam'], sub: 'michelson',
      q: 'Why does a Michelson interferometer have a compensating plate (an uncoated copy of the beam splitter) in one arm?',
      options: ['To polarise the light', 'To make the mirrors parallel', 'So that both beams pass through the same thickness of glass, which is needed to see white-light fringes', 'To increase the intensity of the fringes'], answer: 2,
      sol: 'One beam crosses the splitter\'s glass three times, the other once. Glass is dispersive, so the extra path differs for each colour; with a monochromatic source this only shifts the zero, but white-light fringes (needed to find exact zero path difference) appear only if the glass paths are equal. The compensator equalises them.' },

    // ---------- level 5 ----------
    { id: 'ifr-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'thin films', unit: 'nm',
      q: 'A film of index $1.25$ in air, lit normally by white light, shows reflection minima at $500$ nm and $600$ nm and no minimum in between. Its thickness is ______ nm.',
      answer: 1200, tol: 1, calc: () => 5 * 600 / (2 * 1.25),
      sol: 'One $\\pi$ shift (top surface only), so minima satisfy $2nt = m\\lambda$. Consecutive orders: $m(600) = (m + 1)(500)$ gives $m = 5$, so $2nt = 3000$ nm and $t = 3000/2.5 = 1200$ nm.',
      trap: 'Assigning the larger order to the longer wavelength: the shorter wavelength has the higher order.' },
    { id: 'ifr-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'coherence',
      q: 'In a Michelson interferometer the visibility of fringes, as a function of path difference, is measured for a source with a Gaussian spectral line. The visibility curve is',
      options: ['constant', 'a Gaussian in path difference, narrower for a broader spectral line', 'a Gaussian that gets wider for a broader spectral line', 'a sinc function in path difference'], answer: 1,
      sol: 'For a single spectral line, the visibility is the magnitude of the normalised Fourier transform of the spectrum (Wiener-Khinchin theorem). The Fourier transform of a Gaussian is a Gaussian, and the widths are reciprocal: a broader line gives a narrower visibility curve (shorter coherence length).',
      trap: 'A sinc would come from a rectangular (flat-topped) spectrum, not a Gaussian.' },
    { id: 'ifr-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'spatial coherence', format: 'statements',
      q: 'A double slit with separation $d$ is lit by an incoherent source that subtends a small angle $\\theta_s$ at the slits. Which statements are correct?',
      options: ['For a uniform strip source, the visibility varies with $d$ as $|\\sin(\\pi d\\theta_s/\\lambda)/(\\pi d\\theta_s/\\lambda)|$ and first vanishes at $d = \\lambda/\\theta_s$.', 'Michelson\'s stellar interferometer uses this effect to measure the angular sizes of stars.', 'For a uniform circular disc of angular diameter $\\theta_s$, the visibility first vanishes at $d = 1.22\\lambda/\\theta_s$.', 'A larger source gives higher visibility.'], answer: [0, 1, 2],
      sol: 'By the van Cittert-Zernike theorem the complex degree of coherence is the normalised Fourier transform of the source\'s brightness: a sinc for a strip (A), an Airy function $2J_1(x)/x$ for a disc, with its first zero at $d = 1.22\\lambda/\\theta_s$ (C). Increasing $d$ until the fringes vanish measures $\\theta_s$ (B). D is backwards: a larger source lowers coherence.' },
    { id: 'ifr-043', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'thin films', unit: 'nm',
      q: 'A liquid of index $1.6$ fills the gap between a lens of index $1.5$ and a plate of index $1.7$ in a Newton\'s rings set-up, lit normally with $600$ nm light. The smallest non-zero liquid thickness at which the reflected light is dark is ______ nm (to one decimal place).',
      answer: 93.8, tol: 0.5, calc: () => 600 / (4 * 1.6),
      sol: 'Lens to liquid ($1.5 \\to 1.6$): phase $\\pi$. Liquid to plate ($1.6 \\to 1.7$): phase $\\pi$ again. The shifts cancel, so the centre (zero thickness) is bright, and darkness needs $2\\mu t = \\lambda/2$: $t = \\lambda/(4\\mu) = 600/6.4 = 93.75$ nm.',
      trap: 'Assuming the usual dark centre (one $\\pi$ shift) leads to $2\\mu t = \\lambda$ and $t = 187.5$ nm.' },
  ],
  gens: [
    { id: 'ifr-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'young double slit', format: 'comparison',
      make(r) {
        const b = Q5.pick(r, 0.3, 2, 0.1), kind = Q5.int(r, 0, 3);
        let what, fac, why;
        if (kind === 0) { const [n, s] = Q5.choose(r, [[4 / 3, '4/3'], [1.5, '1.5'], [1.6, '1.6']]); fac = 1 / n; what = `the whole apparatus is put under a liquid of refractive index $${s}$`; why = `the wavelength in the liquid is $\\lambda/n$, so $\\beta$ is divided by $${s}$`; }
        else if (kind === 1) { const c = Q5.choose(r, [2, 3, 0.5]); fac = 1 / c; what = `the slit separation is multiplied by $${c}$`; why = `$\\beta \\propto 1/d$, so $\\beta$ is divided by $${c}$`; }
        else if (kind === 2) { const c = Q5.choose(r, [2, 3, 0.5, 1.5]); fac = c; what = `the slit-to-screen distance is multiplied by $${c}$`; why = `$\\beta \\propto D$, so $\\beta$ is multiplied by $${c}$`; }
        else { const [l1, l2] = Q5.choose(r, [[600, 400], [450, 600], [500, 650], [640, 480]]); fac = l2 / l1; what = `the light of $${l1}$ nm is replaced by light of $${l2}$ nm`; why = `$\\beta \\propto \\lambda$, so $\\beta$ is multiplied by $${l2}/${l1}$`; }
        const s = (x) => `$${Q5.round(x, 3)}$ mm`;
        const o = Q5.mcqOptions(r, b * fac, [b, b / fac, b * fac * fac, b / (fac * fac)], s);
        return { q: `In a Young's double-slit experiment the fringe width is $${b}$ mm. Then ${what}, and nothing else changes. The new fringe width is`, ...o,
          sol: `$\\beta = \\lambda D/d$. Here ${why}: $\\beta' = ${b}\\times${Q5.round(fac, 4)} = ${Q5.round(b * fac, 3)}$ mm.`,
          trap: 'Fringe width grows with $\\lambda$ and $D$ but shrinks with $d$ and with the refractive index of the medium.' };
      } },
    { id: 'ifr-t22', type: 'msq', level: 3, exams: ['jam'], sub: 'thin films', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['A soap film in air looks dark in reflected light where it is much thinner than the wavelength.', 'The reflected and transmitted fringe patterns of a thin film are complementary.',
          'At normal incidence a soap film (index $n$, thickness $t$) in air reflects wavelength $\\lambda$ most strongly when $2nt = (m + \\tfrac12)\\lambda$.', 'A quarter-wave coating whose index lies between those of air and glass reduces reflection from the glass.',
          'The colour reflected by a thin film changes with the viewing angle.'];
        const F = ['A soap film in air looks bright in reflected light where it is much thinner than the wavelength.', 'The reflected and transmitted fringe patterns of a thin film are identical.',
          'At normal incidence a soap film in air reflects wavelength $\\lambda$ most strongly when $2nt = m\\lambda$.', 'An anti-reflection coating works best when it is half a wavelength thick (in the coating).',
          'The colour reflected by a thin film does not depend on the viewing angle.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about interference in thin films are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'A soap film in air: reflection at the top (air to soap) gains a phase $\\pi$, at the bottom (soap to air) it does not. So the condition for bright reflection is $2nt = (m + \\tfrac12)\\lambda$, and a film with $t \\to 0$ is dark. Energy is conserved, so where reflection is strong transmission is weak: the patterns are complementary. A coating with $n_{\\rm air} < n_c < n_g$ has a $\\pi$ shift at both faces, so a quarter-wave thickness ($2n_ct = \\lambda/2$) makes the two reflections cancel; a half-wave coating would make them add. The path difference is $2nt\\cos r$, so the colour shifts with angle.',
          trap: 'Count the phase jumps: one jump in a free film, two in a coating on glass.' };
      } },
    { id: 'ifr-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'young double slit', unit: 'nm',
      make(r) {
        const m = Q5.int(r, 3, 6), same = r() < 0.5, n = same ? m : m - 1, l1 = same ? Q5.int(r, 500, 650) : Q5.int(r, 400, 500);
        const l2 = (m - 0.5) * l1 / n;
        const th = (k) => `${k}${['', 'st', 'nd', 'rd'][k] || 'th'}`;
        return { q: `In a Young's experiment lit by two wavelengths together, the ${th(m)} dark fringe of the $${l1}$ nm light (counting outwards from the centre) falls exactly on the ${th(n)} bright fringe of the other light (not counting the central one). The other wavelength is ______ nm (to one decimal place).`,
          answer: Q5.round(l2, 1), tol: 0.1, m, n, l1,
          sol: `Dark fringe number $m$ of $\\lambda_1$: path difference $(m - \\tfrac12)\\lambda_1$. Bright fringe number $n$ of $\\lambda_2$: path difference $n\\lambda_2$. Equal positions mean equal path differences: $\\lambda_2 = \\dfrac{(${m} - 0.5)\\times${l1}}{${n}} = ${Q5.round(l2, 1)}$ nm.`,
          trap: 'The first dark fringe is at half a wavelength of path difference, so the $m$-th is at $(m - \\tfrac12)\\lambda$.' };
      },
      verify: (p) => { const D = 1.2, d = 3e-4; const y = (p.m - 0.5) * p.l1 * 1e-9 * D / d; return y * d / (p.n * D) * 1e9; } },
    { id: 'ifr-t24', type: 'mcq', level: 3, exams: ['jam'], sub: 'visibility', format: 'graph',
      make(r) {
        const p = Q5.int(r, 2, 6), q = Q5.int(r, 1, p - 1);
        const o = Q5.mcqOptions(r, q5frac((p + q) ** 2, (p - q) ** 2), [q5frac(p + q, p - q), q5frac(p * p, q * q), q5frac(p, q), q5frac((p + q) ** 2, 4 * p * q)], (s) => `$${s}$`);
        return { q: `Two coherent beams overlap. A graph of intensity across the overlap region is a cosine-like curve swinging between $${p * p}$ units and $${q * q}$ ${q * q === 1 ? 'unit' : 'units'}. The ratio of the intensities of the two beams (stronger to weaker) is`, ...o,
          sol: `$I_{\\max} = (a_1 + a_2)^2$ and $I_{\\min} = (a_1 - a_2)^2$, so $a_1 + a_2 = ${p}$ and $a_1 - a_2 = ${q}$ (in matching units): $a_1/a_2 = ${q5frac(p + q, p - q)}$. Intensity goes as amplitude squared: $I_1/I_2 = ${q5frac((p + q) ** 2, (p - q) ** 2)}$.`,
          trap: '$I_{\\max}/I_{\\min}$ is not the beam ratio; take square roots first.' };
      } },
    { id: 'ifr-t25', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'michelson',
      make(r) {
        const L = Q5.int(r, 2, 10), lam = Q5.choose(r, [546.1, 589.3, 632.8]), N = Q5.int(r, 20, 200);
        const x = N * lam * 1e-9 / (2 * L * 1e-2) * 1e4;
        return { q: `A gas cell of inner length $${L}$ cm sits in one arm of a Michelson interferometer lit at $${lam}$ nm. As the gas is pumped out, $${N}$ fringes pass the centre. The refractive index of the gas is $n = 1 + x\\times10^{-4}$, where $x$ is ______ (to three decimal places).`,
          answer: Q5.round(x, 3), tol: 0.004, L, lam, N,
          sol: `The light crosses the cell twice, so the optical path changes by $2L(n - 1)$, and each fringe is one wavelength: $2L(n - 1) = N\\lambda$. $n - 1 = \\dfrac{${N}\\times${lam}\\times10^{-9}}{2\\times${L / 100}} = ${Q5.round(x, 3)}\\times10^{-4}$.`,
          trap: 'In a Michelson the beam passes through the cell twice: use $2L$.' };
      },
      verify: (p) => (p.N * p.lam * 1e-7) / (2 * p.L) * 1e4 },
    { id: 'ifr-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'young double slit',
      make(r) {
        const lam = choose(r, [450, 500, 550, 589, 600, 633, 650]), D = pick(r, 0.5, 2.5, 0.5), d = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5, 1]);
        const b = lam * 1e-9 * D / (d * 1e-3) * 1000;
        return { q: `Light of wavelength $${lam}$ nm falls on two slits $${d}$ mm apart. The fringe width on a screen $${D}$ m away is ______ mm (to two decimal places).`,
          answer: round(b, 2), tol: Math.max(0.01, round(b * 0.01, 2)), unit: 'mm', lam, D, d,
          sol: `$\\beta = \\lambda D/d = (${lam}\\times10^{-9})(${D})/(${d}\\times10^{-3}) = ${round(b / 1000, 6)}$ m $= ${round(b, 2)}$ mm.`,
          trap: 'Convert nm and mm to metres before dividing.' };
      },
      verify: (p) => p.lam * 1e-9 * p.D / (p.d * 1e-3) * 1000 },
    { id: 'ifr-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'intensity',
      make(r) {
        const [a, b] = choose(r, [[1, 4], [1, 9], [4, 9], [1, 16], [9, 16], [4, 25], [1, 25]]);
        const ratio = ((Math.sqrt(a) + Math.sqrt(b)) / (Math.sqrt(b) - Math.sqrt(a))) ** 2;
        return { q: `Two coherent beams with intensities in the ratio $${a} : ${b}$ interfere. $I_{\\max}/I_{\\min}$ is ______ (to two decimal places).`,
          answer: round(ratio, 2), tol: 0.01, a, b,
          sol: `Amplitude ratio $\\sqrt{${a}} : \\sqrt{${b}} = ${Math.sqrt(a)} : ${Math.sqrt(b)}$. $I_{\\max}/I_{\\min} = (${Math.sqrt(a)} + ${Math.sqrt(b)})^2/(${Math.sqrt(b)} - ${Math.sqrt(a)})^2 = ${round(ratio, 2)}$.`,
          trap: 'Work with amplitudes (square roots of intensities), not intensities.' };
      },
      verify: (p) => ((Math.sqrt(p.a) + Math.sqrt(p.b)) / (Math.sqrt(p.b) - Math.sqrt(p.a))) ** 2 },
    { id: 'ifr-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'fringe shift',
      make(r) {
        const n = choose(r, [1.4, 1.5, 1.6, 1.7]), N = int(r, 2, 12), lam = choose(r, [480, 500, 550, 600, 650]);
        const t = N * lam / (n - 1) / 1000;
        return { q: `A thin sheet of refractive index $${n}$ placed over one slit of a Young\'s experiment shifts the pattern by $${N}$ fringes ($\\lambda = ${lam}$ nm). The sheet\'s thickness is ______ μm (to two decimal places).`,
          answer: round(t, 2), tol: Math.max(0.01, round(t * 0.005, 2)), unit: 'μm', n, N, lam,
          sol: `$(n - 1)t = N\\lambda$, so $t = ${N}\\times${lam}\\ \\text{nm}/${round(n - 1, 2)} = ${round(t * 1000, 1)}$ nm $= ${round(t, 2)}\\ \\mu$m.`,
          trap: 'The extra path is $(n - 1)t$, not $nt$.' };
      },
      verify: (p) => p.N * p.lam / (p.n - 1) / 1000 },
    { id: 'ifr-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'newtons rings',
      make(r) {
        const n = int(r, 3, 25), lam = choose(r, [500, 546, 589, 633]), R = pick(r, 0.5, 3, 0.5);
        const rad = Math.sqrt(n * lam * 1e-9 * R) * 1000;
        return { q: `Newton\'s rings in reflected light ($\\lambda = ${lam}$ nm, air film, lens of radius of curvature $${R}$ m). Counting the dark centre as $n = 0$, the radius of dark ring $n = ${n}$ is ______ mm (to two decimal places).`,
          answer: round(rad, 2), tol: 0.02, unit: 'mm', n, lam, R,
          sol: `$r_n = \\sqrt{n\\lambda R} = \\sqrt{${n}\\times${lam}\\times10^{-9}\\times${R}} = ${round(rad, 3)}$ mm.`,
          trap: '$\\sqrt{(n + \\frac12)\\lambda R}$ is the bright-ring formula.' };
      },
      verify: (p) => Math.sqrt(p.n * p.lam * 1e-9 * p.R) * 1000 },
    { id: 'ifr-g05', type: 'nat', level: 2, exams: ['jam'], sub: 'michelson',
      make(r) {
        const lam = choose(r, [450, 500, 546, 589, 600, 633]), N = choose(r, [100, 200, 250, 400, 500, 1000]);
        const d = N * lam / 2 / 1000; // micrometres
        return { q: `A Michelson interferometer uses light of wavelength $${lam}$ nm. To make $${N}$ fringes pass the centre, one mirror must move by ______ μm (to one decimal place).`,
          answer: round(d, 1), tol: Math.max(0.1, round(d * 0.005, 1)), unit: 'μm', lam, N,
          sol: `$2d = N\\lambda$, so $d = ${N}\\times${lam}/2$ nm $= ${round(d * 1000, 0)}$ nm $= ${round(d, 1)}\\ \\mu$m.`,
          trap: 'The mirror movement is half the path change (light goes there and back).' };
      },
      verify: (p) => p.N * p.lam / 2000 },
    { id: 'ifr-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'thin films',
      make(r) {
        const lam = choose(r, [500, 550, 589, 600, 633]), [nc, ng] = choose(r, [[1.38, 1.5], [1.38, 1.6], [1.25, 1.5], [1.45, 1.7]]);
        const t = lam / (4 * nc);
        return { q: `An anti-reflection coating of index $${nc}$ on glass of index $${ng}$ is designed for $${lam}$ nm at normal incidence. The thinnest suitable coating is ______ nm (to one decimal place).`,
          answer: round(t, 1), tol: 0.2, unit: 'nm', lam, nc,
          sol: `Both reflections go into a denser medium, so both gain $\\pi$ and the shifts cancel. Destructive interference needs $2n_ct = \\lambda/2$: $t = \\lambda/(4n_c) = ${lam}/(4\\times${nc}) = ${round(t, 1)}$ nm.`,
          trap: 'Using the glass index, or $\\lambda/(2n_c)$, which makes the reflection stronger.' };
      },
      verify: (p) => p.lam / (4 * p.nc) },
    { id: 'ifr-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'intensity',
      make(r) {
        const lam = choose(r, [400, 480, 500, 600, 720]), p = round(choose(r, [lam / 8, lam / 6, lam / 5, lam / 4, lam / 3, (3 * lam) / 8]), 1);
        const f = Math.cos(Math.PI * p / lam) ** 2;
        return { q: `Two equal coherent waves of wavelength $${lam}$ nm meet with a path difference of $${round(p, 1)}$ nm. The intensity there, as a fraction of the maximum, is ______ (to three decimal places).`,
          answer: round(f, 3), tol: 0.003, lam, p,
          sol: `Phase difference $\\phi = 2\\pi(${round(p, 1)}/${lam}) = ${round(2 * Math.PI * p / lam, 4)}$ rad. $I/I_{\\max} = \\cos^2(\\phi/2) = ${round(f, 3)}$.`,
          trap: 'Use $\\cos^2(\\phi/2)$, not $\\cos^2\\phi$.' };
      },
      verify: (p) => Math.cos(Math.PI * p.p / p.lam) ** 2 },
    { id: 'ifr-g08', type: 'mcq', level: 3, exams: ['jam'], sub: 'young double slit',
      make(r) {
        const [l1, l2, m1, m2] = choose(r, [[400, 600, 3, 2], [450, 600, 4, 3], [500, 600, 6, 5], [480, 640, 4, 3], [420, 560, 4, 3], [500, 750, 3, 2], [400, 500, 5, 4]]);
        const D = choose(r, [1, 1.5, 2]), d = choose(r, [0.5, 1, 2]);
        const y = m1 * l1 * 1e-9 * D / (d * 1e-3) * 1000;
        const show = (v) => `$${round(v, 2)}$ mm`;
        const o = mcqOptions(r, y, [l1 * 1e-9 * D / (d * 1e-3) * 1000 * m2, (l1 + l2) * 1e-9 * D / (d * 1e-3) * 1000, l1 * l2 * 1e-9 * D / (d * 1e-3) / 100, y / 2], show);
        return { q: `In a Young\'s experiment ($d = ${d}$ mm, $D = ${D}$ m) with light of wavelengths $${l1}$ nm and $${l2}$ nm, the nearest point to the central maximum where bright fringes of both coincide is at`, ...o,
          sol: `Need $m_1(${l1}) = m_2(${l2})$; the smallest whole numbers are $m_1 = ${m1}$, $m_2 = ${m2}$, a path difference of $${m1 * l1}$ nm. So $y = ${m1 * l1}\\times10^{-9}\\times${D}/(${d}\\times10^{-3}) = ${round(y, 2)}$ mm.`,
          trap: 'Find the lowest common multiple of the wavelengths, not their sum or product.' };
      } },
  ],
};
