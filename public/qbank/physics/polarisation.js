// Polarisation: polarisers and Malus's law (two, three and many polarisers, rotating polarisers), degree of
// polarisation, Brewster's angle and polarisation by reflection, Fresnel reflectances, scattering, double refraction
// (ordinary and extraordinary rays), quarter- and half-wave plates, circular and elliptical light, optical activity
// and the Faraday effect, Jones vectors and Stokes parameters for GATE and NET. Original questions for IIT JAM, GATE
// and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const deg = Math.PI / 180;

import * as Q5 from '../_util.js';
import more2 from './polarisation.more2.gen.js';
import r4 from './polarisation.r4.gen.js';

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
  topic: 'polarisation',
  items: [
    // ---------- level 1 ----------
    { id: 'pol-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'malus law',
      q: 'Unpolarised light of intensity $I_0$ passes through an ideal polariser. The transmitted intensity is',
      options: ['$I_0$', '$I_0/2$', '$I_0/4$', 'zero'], answer: 1,
      sol: 'Unpolarised light has its field direction changing randomly. Averaging Malus\'s $\\cos^2\\theta$ over all directions gives $\\langle\\cos^2\\theta\\rangle = 1/2$, so $I_0/2$ gets through, polarised along the transmission axis.' },
    { id: 'pol-002', type: 'nat', level: 1, exams: ['jam'], sub: 'malus law', unit: 'W/m²',
      q: 'Linearly polarised light of intensity $8$ W/m² meets an analyser whose axis makes $60^\\circ$ with the light\'s plane of polarisation. The transmitted intensity is ______ W/m².',
      answer: 2, tol: 0.01, calc: () => 8 * Math.cos(60 * deg) ** 2,
      sol: 'Malus: $I = I_0\\cos^2\\theta = 8\\times(1/2)^2 = 2$ W/m².',
      trap: 'Using $\\cos\\theta$ instead of $\\cos^2\\theta$ gives 4 W/m²: the field goes as $\\cos\\theta$, the intensity as its square.' },
    { id: 'pol-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'brewster',
      q: 'The Brewster angle for light in air reflecting from glass of refractive index $1.5$ is about',
      options: ['$33.7^\\circ$', '$41.8^\\circ$', '$56.3^\\circ$', '$60^\\circ$'], answer: 2,
      sol: '$\\tan\\theta_B = n_2/n_1 = 1.5$, so $\\theta_B = 56.3^\\circ$.',
      trap: '$41.8^\\circ$ is the critical angle (a sine, not a tangent); $33.7^\\circ$ is the Brewster angle from inside the glass.' },
    { id: 'pol-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'basics',
      q: 'Which phenomenon shows that light is a transverse wave?',
      options: ['interference', 'diffraction', 'reflection', 'polarisation'], answer: 3,
      sol: 'Interference, diffraction and reflection happen for longitudinal waves (sound) too. Only a transverse wave has a direction of vibration across its path that a polariser can select.' },
    { id: 'pol-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'brewster',
      q: 'Unpolarised light strikes glass at the Brewster angle. The reflected light is',
      options: ['completely polarised perpendicular to the plane of incidence', 'completely polarised in the plane of incidence', 'unpolarised', 'circularly polarised'], answer: 0,
      sol: 'At the Brewster angle the reflection coefficient for the component in the plane of incidence ($p$) is zero. Only the perpendicular ($s$) component reflects, so the reflected light is completely $s$-polarised. The transmitted light is only partly polarised.',
      trap: 'The transmitted beam is not completely polarised; only the reflected one is.' },
    { id: 'pol-006', type: 'nat', level: 1, exams: ['jam'], sub: 'malus law', unit: 'degrees',
      q: 'Linearly polarised light passes through an analyser and a quarter of its intensity gets through. The smallest angle between the analyser\'s axis and the plane of polarisation is ______ degrees.',
      answer: 60, tol: 0.1, calc: () => Math.acos(Math.sqrt(0.25)) / deg,
      sol: '$\\cos^2\\theta = 1/4$, so $\\cos\\theta = 1/2$ and $\\theta = 60^\\circ$.',
      trap: 'Solving $\\cos\\theta = 1/4$ gives $75.5^\\circ$.' },

    // ---------- level 2 ----------
    { id: 'pol-007', type: 'nat', level: 2, exams: ['jam'], sub: 'malus law', unit: 'W/m²',
      q: 'Unpolarised light of intensity $32$ W/m² falls on two crossed polarisers. A third polariser is slipped between them with its axis at $45^\\circ$ to both. The intensity that emerges is ______ W/m².',
      answer: 4, tol: 0.01, calc: () => 32 / 2 * Math.cos(45 * deg) ** 2 * Math.cos(45 * deg) ** 2,
      sol: 'After the first: $16$. After the middle ($45^\\circ$): $16\\cos^245^\\circ = 8$. After the last ($45^\\circ$ from the middle): $8\\times\\tfrac12 = 4$ W/m². Without the middle polariser nothing would get through.',
      trap: 'Thinking an extra polariser can only remove light: here it lets light through.' },
    { id: 'pol-008', type: 'nat', level: 2, exams: ['jam'], sub: 'wave plates', unit: 'μm',
      q: 'Quartz has $n_e - n_o = 0.009$ at $589$ nm. The thinnest quartz quarter-wave plate for this wavelength is ______ μm thick (to one decimal place).',
      answer: 16.4, tol: 0.1, calc: () => 589e-9 / (4 * 0.009) * 1e6,
      sol: 'A quarter-wave plate gives a path difference $\\lambda/4$ between the two rays: $d|n_e - n_o| = \\lambda/4$, so $d = 589\\times10^{-9}/(4\\times0.009) = 1.64\\times10^{-5}$ m $= 16.4\\ \\mu$m.',
      trap: 'Using $\\lambda/2$ gives a half-wave plate (32.7 μm).' },
    { id: 'pol-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'brewster',
      q: 'At the Brewster angle, the reflected and refracted rays are',
      options: ['parallel', 'perpendicular to each other', 'at $45^\\circ$ to each other', 'both along the surface'], answer: 1,
      sol: 'With $\\tan\\theta_B = n$ and Snell\'s law, $\\sin\\theta_B = n\\sin\\theta_t$ gives $\\sin\\theta_t = \\cos\\theta_B$, so $\\theta_B + \\theta_t = 90^\\circ$: the reflected and refracted rays are at right angles. Dipoles in the glass oscillating along the refracted ray\'s $p$ direction cannot radiate along their own axis, which is the reflected direction.' },
    { id: 'pol-010', type: 'msq', level: 2, exams: ['jam'], sub: 'wave plates', format: 'statements',
      q: 'Which statements about an ideal quarter-wave plate are correct?',
      options: ['Linear light polarised at $45^\\circ$ to its axes comes out circularly polarised.', 'Linear light polarised along its fast axis comes out unchanged.', 'Circularly polarised light comes out linearly polarised.', 'It rotates any linear polarisation by $90^\\circ$.'], answer: [0, 1, 2],
      sol: 'The plate delays one component by a quarter cycle. Equal components ($45^\\circ$) a quarter cycle apart make circular light; the process runs backwards too (circular in, linear out at $45^\\circ$). Light along one axis has only one component, so nothing changes. Rotating a linear polarisation is the job of a half-wave plate.' },
    { id: 'pol-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'wave plates',
      q: 'Linearly polarised light falls on a half-wave plate with its plane of polarisation at angle $\\theta$ to the fast axis. The emerging light is',
      options: ['linearly polarised, rotated by $\\theta$', 'linearly polarised, rotated by $2\\theta$', 'circularly polarised', 'unchanged'], answer: 1,
      sol: 'A half-wave delay flips the sign of the slow-axis component, so the light comes out at $-\\theta$ to the fast axis: still linear, mirrored about the axis, i.e. rotated by $2\\theta$. At $\\theta = 45^\\circ$ this turns horizontal into vertical.' },
    { id: 'pol-012', type: 'nat', level: 2, exams: ['jam'], sub: 'brewster', unit: 'degrees',
      q: 'The Brewster angle for light in air reflecting from water ($n = 1.33$) is ______ degrees (to one decimal place).',
      answer: 53.1, tol: 0.1, calc: () => Math.atan(1.33) / deg,
      sol: '$\\theta_B = \\tan^{-1}1.33 = 53.1^\\circ$. Polaroid sunglasses block the strongly polarised glare from lakes near this angle.' },
    { id: 'pol-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'degree of polarisation',
      q: 'Partially polarised light is viewed through a rotating analyser. The largest transmitted intensity is three times the smallest. The degree of polarisation is',
      options: ['$1/2$', '$1/3$', '$2/3$', '$3/4$'], answer: 0,
      sol: '$P = (I_{\\max} - I_{\\min})/(I_{\\max} + I_{\\min}) = (3 - 1)/(3 + 1) = 1/2$: half the light is polarised and half unpolarised.',
      trap: 'Taking $I_{\\min}/I_{\\max} = 1/3$ as the answer.' },
    { id: 'pol-014', type: 'nat', level: 2, exams: ['jam'], sub: 'optical activity', unit: '°/(dm·g/cm³)',
      q: 'A sugar solution of concentration $0.10$ g/cm³ in a tube $20$ cm long rotates the plane of polarisation by $13.3^\\circ$. The specific rotation, in degrees per decimetre per (g/cm³), is ______ (to one decimal place).',
      answer: 66.5, tol: 0.1, calc: () => 13.3 / (2 * 0.10),
      sol: '$[\\alpha] = \\theta/(lc)$ with $l$ in decimetres: $13.3/(2\\times0.10) = 66.5$.',
      trap: 'Specific rotation uses the length in decimetres; using 20 cm gives 6.65.' },
    { id: 'pol-015', type: 'msq', level: 2, exams: ['jam'], sub: 'producing polarised light', format: 'multi',
      q: 'Which of these can produce polarised light from unpolarised light?',
      options: ['Reflection at the Brewster angle', 'Scattering by particles much smaller than the wavelength, seen at $90^\\circ$', 'Double refraction in a calcite crystal', 'Passing through an ordinary glass lens at normal incidence'], answer: [0, 1, 2],
      sol: 'Brewster reflection removes the $p$ component; Rayleigh scattering at $90^\\circ$ can only send out the component perpendicular to the scattering plane; calcite splits light into two beams polarised at right angles. A lens at near-normal incidence treats both components almost alike.' },
    { id: 'pol-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'producing polarised light',
      q: 'Blue sky light is examined with a polariser. It is most strongly polarised in directions',
      options: ['towards the Sun', 'directly opposite the Sun', 'near the horizon at sunset, in the direction of the Sun', 'at $90^\\circ$ from the Sun'], answer: 3,
      sol: 'Air molecules scatter like small dipoles driven by the sunlight\'s field, which lies across the Sun\'s direction. Seen at $90^\\circ$ from the Sun, only one field direction can be seen oscillating, so the light is strongly polarised. Bees navigate with this pattern.' },

    // ---------- level 3 ----------
    { id: 'pol-017', type: 'nat', level: 3, exams: ['jam'], sub: 'malus law',
      q: 'Unpolarised light of intensity $I_0$ passes through a fixed polariser, then one rotating at a steady rate, then a third fixed one crossed with the first. The time-averaged transmitted intensity, as a fraction of $I_0$, is ______ (to four decimal places).',
      answer: 0.0625, tol: 0.0005, calc: () => 1 / 16,
      sol: 'With the middle polariser at angle $\\theta = \\omega t$: $I = \\tfrac{I_0}2\\cos^2\\theta\\sin^2\\theta = \\tfrac{I_0}8\\sin^22\\theta$. The average of $\\sin^2$ is $\\tfrac12$, so $\\langle I\\rangle = I_0/16 = 0.0625I_0$. The light flickers at $4\\omega$.',
      trap: 'Averaging $\\cos^2$ and $\\sin^2$ separately and multiplying ($1/2\\times1/4\\times1/4$) is wrong: they are not independent.' },
    { id: 'pol-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'elliptical light',
      q: 'A light wave has $E_x = E_0\\cos\\omega t$ and $E_y = 2E_0\\sin\\omega t$ at a fixed point. It is',
      options: ['elliptically polarised, with the major axis along $y$', 'circularly polarised', 'linearly polarised at $\\tan^{-1}2$ to the $x$ axis', 'elliptically polarised, with the major axis along $x$'], answer: 0,
      sol: '$(E_x/E_0)^2 + (E_y/2E_0)^2 = 1$: an ellipse with semi-axes $E_0$ along $x$ and $2E_0$ along $y$. The components are a quarter cycle apart but unequal, so it is elliptical, not circular.',
      trap: 'A $90^\\circ$ phase difference gives circular light only if the amplitudes are equal.' },
    { id: 'pol-019', type: 'nat', level: 3, exams: ['jam'], sub: 'malus law',
      q: 'Unpolarised light of intensity $I_0$ passes through a polariser and then through five more polarisers, each turned $18^\\circ$ further than the one before (so the last is at $90^\\circ$ to the first). The emerging intensity, as a fraction of $I_0$, is ______ (to three decimal places).',
      answer: 0.303, tol: 0.002, calc: () => 0.5 * Math.cos(18 * deg) ** 10,
      sol: 'After the first: $I_0/2$. Each further polariser multiplies by $\\cos^218^\\circ = 0.9045$. Five of them: $\\tfrac12(0.9045)^5 = \\tfrac12\\cos^{10}18^\\circ = 0.303$. With many small steps almost all the polarised light can be turned through $90^\\circ$.' },
    { id: 'pol-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'fresnel', format: 'statements',
      q: 'For light in air reflecting from glass ($n = 1.5$), which statements are correct?',
      options: ['At normal incidence about $4\\%$ of the intensity is reflected.', 'For $p$-polarised light the reflectance is zero at the Brewster angle.', 'For $s$-polarised light the reflectance rises steadily from $4\\%$ to $100\\%$ as the angle goes from $0^\\circ$ to $90^\\circ$.', 'The $p$ reflectance is larger than the $s$ reflectance at every angle.'], answer: [0, 1, 2],
      sol: 'At normal incidence $R = [(n - 1)/(n + 1)]^2 = (0.5/2.5)^2 = 0.04$. $R_p$ falls from 4% to zero at $\\theta_B$, then rises to 100% at grazing. $R_s$ rises steadily. Between $0^\\circ$ and $90^\\circ$, $R_p < R_s$, which is why reflected glare is mostly $s$-polarised.' },
    { id: 'pol-021', type: 'nat', level: 3, exams: ['jam'], sub: 'wave plates', unit: 'μm',
      q: 'Calcite has $n_o = 1.658$ and $n_e = 1.486$ at $589$ nm. The thinnest calcite half-wave plate for this wavelength is ______ μm thick (to two decimal places).',
      answer: 1.71, tol: 0.01, calc: () => 589e-9 / (2 * (1.658 - 1.486)) * 1e6,
      sol: '$d|n_o - n_e| = \\lambda/2$: $d = 589\\times10^{-9}/(2\\times0.172) = 1.71\\times10^{-6}$ m. Calcite is so strongly birefringent that its wave plates are very thin; real ones are often made thicker as higher-order plates.' },
    { id: 'pol-022', type: 'mcq', level: 3, exams: ['jam'], sub: 'analysing light',
      q: 'A beam gives the same intensity through a polariser at every orientation. To tell whether it is unpolarised or circularly polarised you should',
      options: ['rotate the polariser faster', 'put a half-wave plate in front of the polariser', 'put a quarter-wave plate in front of the polariser and rotate the polariser', 'measure the intensity without the polariser'], answer: 2,
      sol: 'A quarter-wave plate turns circular light into linear light, which a rotating polariser can then extinguish completely. Unpolarised light stays unpolarised after the plate and gives a constant intensity. A half-wave plate would only turn circular light into circular light of the opposite hand.' },
    { id: 'pol-023', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'fresnel',
      q: 'Light in air falls on glass ($n = 1.5$) at the Brewster angle. The reflectance for the $s$-polarised component is ______ (to three decimal places).',
      answer: 0.148, tol: 0.002, calc: () => { const ti = Math.atan(1.5), tt = Math.PI / 2 - ti; return (Math.sin(ti - tt) / Math.sin(ti + tt)) ** 2; },
      sol: 'Fresnel: $r_s = -\\sin(\\theta_i - \\theta_t)/\\sin(\\theta_i + \\theta_t)$. At Brewster $\\theta_i + \\theta_t = 90^\\circ$ with $\\theta_i = 56.31^\\circ$, $\\theta_t = 33.69^\\circ$: $r_s = -\\sin22.62^\\circ = -0.3846$, $R_s = 0.148$. Equivalently $R_s = [(n^2 - 1)/(n^2 + 1)]^2 = (1.25/3.25)^2$. For unpolarised light only half of this, 7.4%, is reflected.' },
    { id: 'pol-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'brewster',
      q: 'Polaroid sunglasses cut the glare from a wet road. Their transmission axes are',
      options: ['horizontal, to pass the reflected light', 'at $45^\\circ$, to pass half of it', 'random, as in unpolarised light', 'vertical, to block the mostly horizontally polarised reflected light'], answer: 3,
      sol: 'Light reflected from a horizontal surface near the Brewster angle is mostly $s$-polarised: its field is parallel to the surface, horizontal. Vertical transmission axes block it.' },
    { id: 'pol-025', type: 'nat', level: 3, exams: ['jam'], sub: 'brewster', unit: 'degrees',
      q: 'Light in air strikes a medium of refractive index $\\sqrt3$ at the Brewster angle. The angle of refraction is ______ degrees.',
      answer: 30, tol: 0.1, calc: () => 90 - Math.atan(Math.sqrt(3)) / deg,
      sol: '$\\tan\\theta_B = \\sqrt3$ gives $\\theta_B = 60^\\circ$. At Brewster incidence the refracted ray is at $90^\\circ - \\theta_B = 30^\\circ$ (check: $\\sin60^\\circ = \\sqrt3\\sin30^\\circ$).' },
    { id: 'pol-026', type: 'msq', level: 3, exams: ['jam'], sub: 'double refraction', format: 'statements',
      q: 'Which statements about double refraction in a uniaxial crystal are correct?',
      options: ['The ordinary ray obeys Snell\'s law with one fixed index.', 'The extraordinary ray\'s index depends on its direction relative to the optic axis.', 'Light travelling along the optic axis is not split.', 'The ordinary and extraordinary rays are polarised parallel to each other.'], answer: [0, 1, 2],
      sol: 'The o-ray sees $n_o$ in every direction; the e-ray sees an index between $n_o$ and $n_e$ depending on its angle to the optic axis. Along the axis both see $n_o$ and there is no splitting. The two rays are polarised at right angles, which is how a Nicol prism or Wollaston prism makes polarised light.' },
    { id: 'pol-027', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'optical activity',
      q: 'Linearly polarised light passes through a sample, reflects from a mirror and passes back through the same sample. Which is correct?',
      options: ['A sugar solution and a Faraday rotator both give zero net rotation.', 'A sugar solution gives zero net rotation, but a Faraday rotator in a magnetic field doubles the rotation.', 'Both double the rotation.', 'A sugar solution doubles the rotation, but a Faraday rotator cancels it.'], answer: 1,
      sol: 'Natural optical activity comes from the handedness of the molecules, so it turns the plane the same way relative to the direction of travel; coming back undoes it. Faraday rotation is set by the magnetic field direction, not the travel direction, so the return trip adds to it. This non-reciprocal behaviour is used in optical isolators.' },
    { id: 'pol-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'wave plates',
      q: 'Linearly polarised light falls on a quarter-wave plate with its plane of polarisation at $30^\\circ$ to the optic axis. The light that emerges is',
      options: ['linearly polarised, rotated by $60^\\circ$', 'circularly polarised', 'elliptically polarised', 'unpolarised'], answer: 2,
      sol: 'The components along the axes are $E\\cos30^\\circ$ and $E\\sin30^\\circ$, unequal, and the plate puts them a quarter cycle apart: an ellipse with its axes along the plate\'s axes. Only at $45^\\circ$ are they equal (circular); at $0^\\circ$ or $90^\\circ$ the light stays linear.' },

    // ---------- level 4 ----------
    { id: 'pol-029', type: 'nat', level: 4, exams: ['jam'], sub: 'wave plates',
      q: 'In the situation of linear light at $30^\\circ$ to the axis of a quarter-wave plate, the ratio of the minor to the major axis of the emerging ellipse (of the field) is ______ (to three decimal places).',
      answer: 0.577, tol: 0.003, calc: () => Math.tan(30 * deg),
      sol: 'The emerging field is $(E\\cos30^\\circ\\cos\\omega t,\\ E\\sin30^\\circ\\sin\\omega t)$, an ellipse with semi-axes $E\\cos30^\\circ$ and $E\\sin30^\\circ$ along the plate axes. Ratio $= \\tan30^\\circ = 0.577$.' },
    { id: 'pol-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'jones calculus',
      q: 'A half-wave plate with its fast axis at $45^\\circ$ has Jones matrix (up to a phase) $\\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}$. Acting on horizontally polarised light $\\begin{pmatrix}1\\\\ 0\\end{pmatrix}$ it gives',
      options: ['vertically polarised light', 'horizontally polarised light', 'right circular light', 'light polarised at $45^\\circ$'], answer: 0,
      sol: '$\\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}\\begin{pmatrix}1\\\\ 0\\end{pmatrix} = \\begin{pmatrix}0\\\\ 1\\end{pmatrix}$: vertical. This matches the rule that a half-wave plate rotates linear light by $2\\times45^\\circ = 90^\\circ$.' },
    { id: 'pol-031', type: 'nat', level: 4, exams: ['jam'], sub: 'malus law', unit: 'degrees',
      q: 'Unpolarised light passes through two crossed polarisers with a third between them at angle $\\theta$ to the first. If $1/10$ of the incident intensity emerges, the smallest possible $\\theta$ is ______ degrees (to one decimal place).',
      answer: 31.7, tol: 0.2, calc: () => Math.asin(Math.sqrt(0.8)) / 2 / deg,
      sol: '$I/I_0 = \\tfrac12\\cos^2\\theta\\sin^2\\theta = \\tfrac18\\sin^22\\theta = 0.1$, so $\\sin^22\\theta = 0.8$, $\\sin2\\theta = 0.894$, $2\\theta = 63.4^\\circ$ and $\\theta = 31.7^\\circ$ (the other solution is $58.3^\\circ$).',
      trap: 'The most that can get through is $1/8$, at $45^\\circ$; any value above that would have no solution.' },
    { id: 'pol-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'jones calculus', format: 'statements',
      q: 'Which statements about these Jones vectors are correct?',
      options: ['$\\tfrac1{\\sqrt2}\\begin{pmatrix}1\\\\ i\\end{pmatrix}$ is circularly polarised.', '$\\tfrac1{\\sqrt2}\\begin{pmatrix}1\\\\ 1\\end{pmatrix}$ is linearly polarised at $45^\\circ$.', '$\\begin{pmatrix}1\\\\ 2i\\end{pmatrix}$ is elliptical with its axes along $x$ and $y$.', '$\\begin{pmatrix}1\\\\ e^{i\\pi/4}\\end{pmatrix}$ is linearly polarised.'], answer: [0, 1, 2],
      sol: 'Equal amplitudes with a phase of $\\pi/2$: circular. Equal and in phase: linear at $45^\\circ$. Unequal with a phase of $\\pi/2$: an ellipse with axes along $x$ and $y$. A phase of $\\pi/4$ (neither $0$ nor $\\pi$) gives an ellipse tilted at $45^\\circ$, not a line.' },
    { id: 'pol-033', type: 'nat', level: 4, exams: ['jam'], sub: 'optical activity', unit: 'mm',
      q: 'Quartz cut perpendicular to its optic axis rotates the plane of polarisation of $589$ nm light by $21.7^\\circ$ per mm. The thickness needed to turn it through $90^\\circ$ is ______ mm (to two decimal places).',
      answer: 4.15, tol: 0.01, calc: () => 90 / 21.7,
      sol: '$d = 90/21.7 = 4.15$ mm. Placed between crossed polarisers, such a plate lets $589$ nm light through fully, while other wavelengths (rotated by different amounts) are partly blocked: colours appear.' },
    { id: 'pol-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'wave plates',
      q: 'A Fresnel rhomb turns linear light polarised at $45^\\circ$ into circular light without using a birefringent crystal. It works because',
      options: ['the glass is optically active', 'it absorbs one component more than the other', 'Brewster reflection removes the $p$ component', 'each total internal reflection adds a different phase to the $s$ and $p$ components, and two reflections add up to a quarter cycle'], answer: 3,
      sol: 'Total internal reflection reflects all the light but shifts the phases of $s$ and $p$ differently, by an amount set by the angle and index. At about $54^\\circ$ in glass of index 1.51, each reflection gives a $45^\\circ$ difference, so two give $90^\\circ$: a quarter-wave retarder that works over a wide band of wavelengths.' },
    { id: 'pol-035', type: 'nat', level: 4, exams: ['jam'], sub: 'brewster', unit: 'degrees',
      q: 'Light travelling in water ($n = 4/3$) reflects from a glass plate ($n = 1.5$) immersed in it. The Brewster angle is ______ degrees (to one decimal place).',
      answer: 48.4, tol: 0.1, calc: () => Math.atan(1.5 / (4 / 3)) / deg,
      sol: '$\\tan\\theta_B = n_2/n_1 = 1.5/1.333 = 1.125$, so $\\theta_B = 48.4^\\circ$.',
      trap: 'Using $\\tan^{-1}1.5$ treats the first medium as air.' },
    { id: 'pol-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'wave plates',
      q: 'Light passes through a linear polariser, then a quarter-wave plate with its axis at $45^\\circ$, and then hits a mirror and comes back through both. The returning light',
      options: ['passes the polariser fully', 'passes the polariser at half intensity', 'is circularly polarised when it reaches the polariser', 'is blocked by the polariser'], answer: 3,
      sol: 'Going out, the plate makes circular light. The return trip through the plate adds another quarter wave: two quarter waves make a half-wave plate at $45^\\circ$, which turns the original linear polarisation through $90^\\circ$. The polariser now blocks it. This is a simple optical isolator, used to stop reflections returning into a laser.' },

    // ---------- level 5 ----------
    { id: 'pol-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'malus law',
      q: 'Linearly polarised light is to be turned through $90^\\circ$ using ten ideal polarisers, each turned $9^\\circ$ further than the previous one (the first at $9^\\circ$ to the light). The fraction of the intensity that emerges is ______ (to three decimal places).',
      answer: 0.781, tol: 0.003, calc: () => Math.cos(9 * deg) ** 20,
      sol: 'Each polariser passes $\\cos^29^\\circ = 0.97553$. Ten of them: $\\cos^{20}9^\\circ = 0.781$. As the number $N$ grows, $\\cos^{2N}(\\pi/2N) \\approx 1 - \\pi^2/(4N) \\to 1$: in the limit nothing is lost, which is how a twisted liquid crystal guides polarisation round.' },
    { id: 'pol-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'stokes parameters', format: 'statements',
      q: 'Which statements about the Stokes parameters $(S_0, S_1, S_2, S_3)$ are correct?',
      options: ['For unpolarised light $S_1 = S_2 = S_3 = 0$.', 'For fully polarised light $S_0^2 = S_1^2 + S_2^2 + S_3^2$.', 'For circularly polarised light $|S_3| = S_0$.', 'For horizontally polarised light $S_2 = S_0$.'], answer: [0, 1, 2],
      sol: '$S_1$ compares horizontal with vertical, $S_2$ compares $+45^\\circ$ with $-45^\\circ$, and $S_3$ compares right with left circular. Unpolarised light shows no preference: all three are zero. Fully polarised light lies on the surface of the Poincaré sphere. Circular light has only $S_3$. Horizontal light has $S_1 = S_0$ and $S_2 = 0$.' },
    { id: 'pol-039', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'wave plates',
      q: 'Linear light of intensity $I_0$, polarised at $30^\\circ$ to the fast axis of a quarter-wave plate, passes through the plate and then through an analyser whose axis is at $60^\\circ$ to the fast axis. The transmitted intensity as a fraction of $I_0$ is ______ (to three decimal places).',
      answer: 0.375, tol: 0.003, calc: () => (Math.cos(30 * deg) * Math.cos(60 * deg)) ** 2 + (Math.sin(30 * deg) * Math.sin(60 * deg)) ** 2,
      sol: 'After the plate (fast axis $x$): $(\\cos30^\\circ,\\ i\\sin30^\\circ)$. The analyser picks the component along $(\\cos60^\\circ, \\sin60^\\circ)$: amplitude $\\cos30^\\circ\\cos60^\\circ + i\\sin30^\\circ\\sin60^\\circ$, whose squared magnitude is $0.75\\times0.25 + 0.25\\times0.75 = 0.375$. Without the plate, Malus would give $\\cos^230^\\circ = 0.75$.',
      trap: 'Applying Malus\'s law to the angle $30^\\circ$ ignores the quarter-wave phase, which stops the two parts adding in step.' },
    { id: 'pol-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'fresnel',
      q: 'For $p$-polarised light in air reflecting from glass, as the angle of incidence increases through the Brewster angle, the reflected amplitude',
      options: ['stays zero for all angles beyond Brewster', 'grows continuously without passing through zero', 'passes through zero and changes sign (a phase jump of $\\pi$)', 'becomes complex, as in total internal reflection'], answer: 2,
      sol: '$r_p = \\tan(\\theta_i - \\theta_t)/\\tan(\\theta_i + \\theta_t)$. The denominator\'s tangent passes through infinity at $\\theta_i + \\theta_t = 90^\\circ$, so $r_p$ passes through zero and changes sign: a phase jump of $\\pi$ in the reflected $p$ wave. Complex coefficients appear only beyond the critical angle, going from dense to rare.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'pol-t21', type: 'nat', level: 3, exams: ['jam'], sub: 'brewster', unit: 'degrees',
      make(r) {
        const tb = Q5.pick(r, 50, 62, 0.5);
        const n = Math.tan(tb * Math.PI / 180), tc = Math.asin(1 / n) * 180 / Math.PI;
        return { q: `Light in air reflected from a flat transparent block is completely polarised when the angle of incidence is $${tb}^\\circ$. For light inside the block meeting the same surface, the critical angle is ______ degrees (to two decimal places).`,
          answer: Q5.round(tc, 2), tol: 0.02, tb,
          sol: `Brewster: $n = \\tan\\theta_B = \\tan ${tb}^\\circ = ${Q5.round(n, 4)}$. Critical angle: $\\sin\\theta_c = 1/n$, so $\\theta_c = \\sin^{-1}(${Q5.round(1 / n, 4)}) = ${Q5.round(tc, 2)}^\\circ$.`,
          trap: 'Brewster uses $\\tan$, the critical angle uses $\\sin$: the two angles are not complementary.' };
      },
      verify: (p) => { const t = p.tb * Math.PI / 180; return Math.asin(Math.cos(t) / Math.sin(t)) * 180 / Math.PI; } },
    { id: 'pol-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'wave plates', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['Circularly polarised light passing through a polariser loses half its intensity, at any orientation of the polariser.', 'A half-wave plate turns linearly polarised light at angle $\\theta$ to its fast axis into linear light at $-\\theta$ (a turn of $2\\theta$).',
          'A quarter-wave plate turns linear light at $45^\\circ$ to its axes into circular light.', 'A polariser alone cannot tell circularly polarised light from unpolarised light.', 'Unpolarised light passing through an ideal polariser loses half its intensity.'];
        const F = ['Circularly polarised light passing through a polariser gives an intensity that varies as the polariser turns.', 'A half-wave plate turns linear light into circular light.',
          'A quarter-wave plate turns linear light into circular light whatever the angle to its axes.', 'A polariser alone can tell circularly polarised light from unpolarised light.', 'A quarter-wave plate turns circular light into unpolarised light.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about polarisers and wave plates (ideal, at normal incidence) are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'Circular light has equal, perpendicular components $\\pi/2$ apart; a polariser at any angle passes half. Unpolarised light also gives half at every angle, so a polariser alone cannot separate them (a quarter-wave plate first turns circular light into linear, which then can be extinguished). A half-wave plate adds $\\pi$ to one component, reflecting the polarisation direction about the fast axis; a quarter-wave plate adds $\\pi/2$, giving circular light only when the two components are equal, i.e. at $45^\\circ$. Wave plates never make light unpolarised.',
          trap: 'Circular and unpolarised light look the same through a single polariser.' };
      } },
    { id: 'pol-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'elliptical light',
      make(r) {
        const [a, b, ph, phs, kind] = Q5.choose(r, [[3, 3, 0, '0', 0], [2, 5, Math.PI, '\\pi', 0], [4, 4, Math.PI / 2, '\\pi/2', 1], [5, 5, -Math.PI / 2, '-\\pi/2', 1], [3, 5, Math.PI / 2, '\\pi/2', 2], [4, 4, Math.PI / 3, '\\pi/3', 2], [2, 6, Math.PI / 4, '\\pi/4', 2]]);
        const names = ['linearly polarised', 'circularly polarised', 'elliptically polarised', 'unpolarised'];
        const o = Q5.mcqOptions(r, names[kind], names.filter((x, i) => i !== kind));
        return { q: `A light wave has $E_x = ${a}\\cos(kz - \\omega t)$ and $E_y = ${b}\\cos(kz - \\omega t ${phs[0] === '-' ? '- ' + phs.slice(1) : '+ ' + phs})$ (arbitrary units). It is`, ...o,
          sol: kind === 0 ? `With phase difference $${phs}$ the two components rise and fall together (or exactly opposite), so $E_y/E_x = ${ph === 0 ? '' : '-'}${q5frac(b, a)}$ at all times: the field stays on one line.`
            : kind === 1 ? 'Equal amplitudes and a phase difference of $\\pm\\pi/2$: the tip of $\\vec E$ moves on a circle.'
              : `The phase difference $${phs}$ is neither $0$ nor $\\pi$, and the case is not equal amplitudes with $\\pm\\pi/2$, so the tip traces an ellipse.`,
          trap: 'Circular light needs both equal amplitudes and a phase difference of exactly $\\pi/2$.' };
      } },
    { id: 'pol-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'analysing light', unit: 'W/m²',
      make(r) {
        const Iu = Q5.int(r, 2, 20), Ip = Q5.int(r, 2, 20), th = Q5.choose(r, [20, 30, 45, 60, 70]);
        const I = Iu / 2 + Ip * Math.cos(th * Math.PI / 180) ** 2;
        return { q: `A beam is a mixture of $${Iu}$ W/m² of unpolarised light and $${Ip}$ W/m² of light polarised along $x$. It passes an ideal polariser whose axis is at $${th}^\\circ$ to $x$. The transmitted intensity is ______ W/m² (to two decimal places).`,
          answer: Q5.round(I, 2), tol: 0.01, Iu, Ip, th,
          sol: `The unpolarised part always gives half: $${Iu}/2 = ${Iu / 2}$. The polarised part obeys Malus: $${Ip}\\cos^2 ${th}^\\circ = ${Q5.round(Ip * Math.cos(th * Math.PI / 180) ** 2, 3)}$. Total $= ${Q5.round(I, 2)}$ W/m².`,
          trap: 'Malus law applies only to the polarised part.' };
      },
      verify: (p) => { const mx = p.Iu / 2 + p.Ip, mn = p.Iu / 2; return (mx + mn) / 2 + (mx - mn) / 2 * Math.cos(2 * p.th * Math.PI / 180); } },
    { id: 'pol-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'optical activity', format: 'comparison',
      make(r) {
        const t1 = Q5.int(r, 5, 30), L1 = Q5.int(r, 1, 3), c1 = Q5.int(r, 5, 20), L2 = Q5.int(r, 1, 4), c2 = Q5.int(r, 5, 25);
        const s = (x) => `$${Q5.round(x, 2)}^\\circ$`;
        const o = Q5.mcqOptions(r, t1 * L2 * c2 / (L1 * c1), [t1 * L2 / L1, t1 * c2 / c1, t1 * L1 * c1 / (L2 * c2), t1 * L2 * c2 / (L1 * c1) * 2], s);
        return { q: `A sugar solution of concentration $${c1}$ g per 100 mL in a tube $${L1}$ dm long turns the plane of polarisation by $${t1}^\\circ$. The same sugar at $${c2}$ g per 100 mL in a tube $${L2}$ dm long (same light, same temperature) turns it by`, ...o,
          sol: `Rotation $= [\\alpha]\\,L\\,c$, proportional to both length and concentration: $\\theta_2 = ${t1}^\\circ\\times\\dfrac{${L2}\\times${c2}}{${L1}\\times${c1}} = ${Q5.round(t1 * L2 * c2 / (L1 * c1), 2)}^\\circ$.`,
          trap: 'Both the path length and the concentration scale the rotation.' };
      } },
    { id: 'pol-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'malus law',
      make(r) {
        const I0 = int(r, 2, 40), th = choose(r, [15, 20, 30, 37, 45, 53, 60, 70, 75]);
        const I = I0 * Math.cos(th * deg) ** 2;
        return { q: `Linearly polarised light of intensity $${I0}$ W/m² meets an analyser at $${th}^\\circ$ to its plane of polarisation. The transmitted intensity is ______ W/m² (to two decimal places).`,
          answer: round(I, 2), tol: 0.02, unit: 'W/m²', I0, th,
          sol: `$I = I_0\\cos^2\\theta = ${I0}\\cos^2${th}^\\circ = ${round(I, 2)}$ W/m².`,
          trap: 'Malus\'s law uses $\\cos^2\\theta$.' };
      },
      verify: (p) => p.I0 * (1 + Math.cos(2 * p.th * deg)) / 2 },
    { id: 'pol-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'malus law',
      make(r) {
        const I0 = int(r, 10, 100), th = int(r, 10, 80);
        const I = I0 / 2 * Math.cos(th * deg) ** 2 * Math.sin(th * deg) ** 2;
        return { q: `Unpolarised light of intensity $${I0}$ W/m² passes through two crossed polarisers with a third between them at $${th}^\\circ$ to the first. The emerging intensity is ______ W/m² (to two decimal places).`,
          answer: round(I, 2), tol: 0.02, unit: 'W/m²', I0, th,
          sol: `$I = \\tfrac{I_0}{2}\\cos^2\\theta\\cos^2(90^\\circ - \\theta) = \\tfrac{I_0}{8}\\sin^2 2\\theta = ${round(I, 2)}$ W/m².`,
          trap: 'The angle between the middle and last polariser is $90^\\circ - \\theta$.' };
      },
      verify: (p) => p.I0 / 8 * Math.sin(2 * p.th * deg) ** 2 },
    { id: 'pol-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'brewster',
      make(r) {
        const n = pick(r, 1.3, 2.4, 0.01);
        const t = Math.atan(n) / deg;
        return { q: `The Brewster angle for light in air reflecting from a medium of refractive index $${n}$ is ______ degrees (to one decimal place).`,
          answer: round(t, 1), tol: 0.1, unit: 'degrees', n,
          sol: `$\\theta_B = \\tan^{-1}${n} = ${round(t, 1)}^\\circ$.`,
          trap: 'Brewster uses the tangent; the critical angle uses the sine.' };
      },
      verify: (p) => 90 - Math.atan(1 / p.n) / deg },
    { id: 'pol-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'wave plates',
      make(r) {
        const lam = choose(r, [400, 450, 500, 546, 589, 633, 700]), dn = choose(r, [0.009, 0.0092, 0.172, 0.01, 0.05, 0.02]), half = r() < 0.5;
        const d = lam * 1e-3 / ((half ? 2 : 4) * dn);
        return { q: `A crystal has $|n_e - n_o| = ${dn}$ at $${lam}$ nm. The thinnest ${half ? 'half' : 'quarter'}-wave plate made from it is ______ μm thick (to two decimal places).`,
          answer: round(d, 2), tol: Math.max(0.01, round(d * 0.003, 2)), unit: 'μm', lam, dn, half,
          sol: `$d|n_e - n_o| = \\lambda/${half ? 2 : 4}$: $d = ${lam}\\ \\text{nm}/(${half ? 2 : 4}\\times${dn}) = ${round(d, 2)}\\ \\mu$m.`,
          trap: 'Quarter-wave: $\\lambda/4$; half-wave: $\\lambda/2$.' };
      },
      verify: (p) => p.lam / 1000 / ((p.half ? 2 : 4) * p.dn) },
    { id: 'pol-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'malus law',
      make(r) {
        const N = int(r, 2, 12), total = choose(r, [60, 90]);
        const step = total / N, f = Math.cos(step * deg) ** (2 * N);
        return { q: `Linearly polarised light passes through $${N}$ ideal polarisers, each turned $${round(step, 3)}^\\circ$ further than the last (the first at $${round(step, 3)}^\\circ$ to the light), turning it through $${total}^\\circ$ in all. The fraction of intensity that emerges is ______ (to three decimal places).`,
          answer: round(f, 3), tol: 0.002, N, total,
          sol: `Each passes $\\cos^2${round(step, 3)}^\\circ$, so the fraction is $\\cos^{${2 * N}}${round(step, 3)}^\\circ = ${round(f, 3)}$.`,
          trap: 'There are as many factors as polarisers, each $\\cos^2$.' };
      },
      verify: (p) => Math.cos(p.total / p.N * deg) ** (2 * p.N) },
    { id: 'pol-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'degree of polarisation',
      make(r) {
        const a = int(r, 2, 12), b = 1;
        const P = (a - b) / (a + b);
        return { q: `As an analyser is rotated in partially polarised light, the largest transmitted intensity is $${a}$ times the smallest. The degree of polarisation is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.002, a,
          sol: `$P = (I_{\\max} - I_{\\min})/(I_{\\max} + I_{\\min}) = (${a} - 1)/(${a} + 1) = ${round(P, 3)}$.`,
          trap: 'Divide the difference by the sum, not by the maximum.' };
      },
      verify: (p) => 1 - 2 / (p.a + 1) },
    { id: 'pol-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'fresnel',
      make(r) {
        const n = pick(r, 1.3, 2.4, 0.01);
        const R = ((n - 1) / (n + 1)) ** 2 * 100;
        return { q: `Light in air falls normally on a flat surface of a material with refractive index $${n}$. The percentage of the intensity reflected is ______ % (to two decimal places).`,
          answer: round(R, 2), tol: 0.02, unit: '%', n,
          sol: `$R = \\left(\\dfrac{n - 1}{n + 1}\\right)^2 = \\left(\\dfrac{${round(n - 1, 2)}}{${round(n + 1, 2)}}\\right)^2 = ${round(R / 100, 5)} = ${round(R, 2)}\\%$.`,
          trap: 'Square the amplitude ratio to get the intensity.' };
      },
      verify: (p) => 100 * (1 - 4 * p.n / (p.n + 1) ** 2) },
    { id: 'pol-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'wave plates',
      make(r) {
        const plate = choose(r, ['quarter', 'half']), th = choose(r, [0, 20, 30, 45, 60, 90]);
        let right;
        if (th === 0 || th === 90) right = 'linearly polarised, unchanged';
        else if (plate === 'half') right = `linearly polarised, turned through $${2 * th}^\\circ$`;
        else right = th === 45 ? 'circularly polarised' : 'elliptically polarised';
        const pool = ['linearly polarised, unchanged', 'circularly polarised', 'elliptically polarised', `linearly polarised, turned through $${th === 0 || th === 90 ? 90 : 2 * th}^\\circ$`, 'unpolarised'];
        const o = mcqOptions(r, right, pool.filter((s) => s !== right), (s) => s);
        return { q: `Linearly polarised light falls on a ${plate}-wave plate with its plane of polarisation at $${th}^\\circ$ to the fast axis. The emerging light is`, ...o,
          sol: `Split the field along the plate axes: components $E\\cos${th}^\\circ$ and $E\\sin${th}^\\circ$. ${th === 0 || th === 90 ? 'Only one component exists, so the plate changes nothing.' : plate === 'half' ? `A half-wave delay flips one component: the light stays linear, mirrored about the axis, turned through $2\\theta = ${2 * th}^\\circ$.` : th === 45 ? 'Equal components a quarter cycle apart: circular.' : 'Unequal components a quarter cycle apart: an ellipse with axes along the plate axes.'}`,
          trap: 'Circular light needs a quarter-wave plate and exactly $45^\\circ$.' };
      } },
    ...r4.gens,
  ],
};
