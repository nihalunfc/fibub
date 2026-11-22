// Electromagnetic induction and inductance: Faraday's law, Lenz's law, motional EMF (rods, rotating rods, coils),
// induced electric fields, self and mutual inductance, RL growth and decay, magnetic energy, rails problems.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, C } from '../_util.js';

const MU = C.mu0;

import * as Q5 from '../_util.js';
import more2 from './induction.more2.gen.js';

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
  topic: 'induction',
  items: [
    // ---------- level 1 ----------
    { id: 'ind-001', type: 'nat', level: 1, exams: ['jam'], sub: 'faraday law', unit: 'V',
      q: 'A coil of 200 turns, each of area 0.010 m$^2$, sits in a field of 0.50 T along its axis. The field falls steadily to zero in 0.10 s. The average induced EMF is ______ V.',
      answer: 10, tol: 0, calc: () => 200 * 0.01 * 0.5 / 0.1,
      sol: '$|\\mathcal E| = N\\dfrac{\\Delta\\Phi}{\\Delta t} = 200\\times\\dfrac{(0.50)(0.010)}{0.10} = 10$ V.',
      trap: 'Forgetting the factor $N$: every turn links the flux.' },
    { id: 'ind-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'lenz law',
      q: 'The north pole of a bar magnet is pushed towards a closed wire loop. Seen from the magnet\'s side, the induced current in the loop flows',
      options: ['clockwise, making the near face a south pole', 'anticlockwise, making the near face a north pole that repels the magnet', 'clockwise, making the near face a north pole', 'nowhere: the loop is not moving'], answer: 1,
      sol: 'Field lines leave the north pole, so the flux through the loop, pointing away from the magnet, grows as the magnet approaches. Lenz: the induced current makes a field pointing back towards the magnet, so the near face becomes a north pole and repels it. A current that looks anticlockwise from a face makes that face a north pole.',
      trap: 'Only relative motion matters; the loop need not move.' },
    { id: 'ind-003', type: 'nat', level: 1, exams: ['jam'], sub: 'motional emf', unit: 'V',
      q: 'A 0.50 m rod slides at 3.0 m/s along rails, perpendicular to a uniform 0.40 T field that is perpendicular to the plane of the rails. The EMF across the rod is ______ V (to one decimal place).',
      answer: 0.6, tol: 0.01, calc: () => 0.4 * 0.5 * 3,
      sol: '$\\mathcal E = BLv = (0.40)(0.50)(3.0) = 0.60$ V. Each charge in the rod feels $qvB$ along the rod; over length $L$ that is an EMF $vBL$.' },
    { id: 'ind-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'self inductance',
      q: 'The self-inductance of a long solenoid of $N$ turns, length $l$ and cross-sectional area $A$ is',
      options: ['$\\mu_0NA/l$', '$\\mu_0N^2A/l$', '$\\mu_0N^2Al$', '$\\mu_0N^2l/A$'], answer: 1,
      sol: '$B = \\mu_0NI/l$, flux per turn $BA$, total linkage $N\\cdot BA = \\mu_0N^2AI/l$. So $L = \\mu_0N^2A/l$ (or $\\mu_0n^2Al$ with $n = N/l$).',
      trap: 'Option C mixes the two forms: it is right only if $N$ means turns per metre.' },
    { id: 'ind-005', type: 'nat', level: 1, exams: ['jam'], sub: 'magnetic energy', unit: 'J',
      q: 'An inductor of 50 mH carries 4.0 A. The energy stored in it is ______ J (to one decimal place).',
      answer: 0.4, tol: 0.01, calc: () => 0.5 * 0.05 * 16,
      sol: '$U = \\tfrac12LI^2 = \\tfrac12(0.050)(16) = 0.40$ J.' },
    { id: 'ind-006', type: 'msq', level: 1, exams: ['jam'], sub: 'faraday law',
      q: 'Which statements about electromagnetic induction are correct?',
      options: ['An EMF is induced in a loop only while the flux through it changes.', 'A changing magnetic field produces a circulating electric field even where there is no wire.', 'The induced current always opposes the magnetic flux through the loop.', 'The EMF in a rod moving through a steady field comes from the magnetic force on its charges.'], answer: [0, 1, 3],
      sol: 'A: $\\mathcal E = -d\\Phi/dt$. B: $\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$ holds in empty space. D: motional EMF is $\\oint(\\vec v\\times\\vec B)\\cdot d\\vec l$. C is false: it opposes the change in flux. If the flux is falling, the induced current supports it.',
      trap: 'C: Lenz opposes the change, not the flux itself.' },

    // ---------- level 2 ----------
    { id: 'ind-007', type: 'nat', level: 2, exams: ['jam'], sub: 'generators', unit: 'V',
      q: 'A coil of 100 turns, area 0.020 m$^2$, spins at 50 revolutions per second in a uniform 0.50 T field, about an axis perpendicular to the field. The peak EMF is ______ V (to the nearest whole number).',
      answer: 314, tol: 3, calc: () => 100 * 0.02 * 0.5 * 2 * Math.PI * 50,
      sol: '$\\Phi = NBA\\cos\\omega t$, so $\\mathcal E = NBA\\omega\\sin\\omega t$ with peak $NBA\\omega$. $\\omega = 2\\pi\\times50 = 314$ rad/s. Peak $= 100\\times0.50\\times0.020\\times314 \\approx 314$ V.',
      trap: 'Using 50 instead of $\\omega = 2\\pi f$.' },
    { id: 'ind-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'motional emf',
      q: 'A metal rod of length $L$ spins at angular speed $\\omega$ about one end, in a plane perpendicular to a uniform field $B$. The EMF between its ends is',
      options: ['$B\\omega L^2$', '$\\tfrac12B\\omega L^2$', '$\\tfrac12B\\omega L$', '$B\\omega L^2/4$'], answer: 1,
      sol: 'A piece at distance $r$ moves at $\\omega r$, so $d\\mathcal E = B\\omega r\\,dr$. Integrate from 0 to $L$: $\\mathcal E = \\tfrac12B\\omega L^2$. (Or: the rod sweeps area $\\tfrac12L^2\\omega$ per second.)',
      trap: 'Using the tip speed $\\omega L$ for the whole rod gives twice the answer.' },
    { id: 'ind-009', type: 'nat', level: 2, exams: ['jam'], sub: 'motional emf', unit: 'V',
      q: 'A 1.0 m rod spins at 10 revolutions per second about one end, in a plane perpendicular to a 0.20 T field. The EMF between its ends is ______ V (to two decimal places).',
      answer: 6.28, tol: 0.06, calc: () => 0.5 * 0.2 * 2 * Math.PI * 10 * 1,
      sol: '$\\omega = 2\\pi\\times10 = 62.8$ rad/s. $\\mathcal E = \\tfrac12B\\omega L^2 = \\tfrac12(0.20)(62.8)(1.0)^2 \\approx 6.28$ V.' },
    { id: 'ind-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'rl circuits',
      q: 'A battery is connected at $t = 0$ to a resistor $R$ in series with an inductor $L$. After one time constant the current has reached',
      options: ['$L/R$ seconds and 37% of its final value', '$RL$ seconds and 63% of its final value', '$L/R$ seconds and 63% of its final value', '$R/L$ seconds and 50% of its final value'], answer: 2,
      sol: '$I(t) = \\dfrac VR(1 - e^{-tR/L})$, so $\\tau = L/R$ and $I(\\tau) = (1 - e^{-1})I_\\infty \\approx 0.63\\,I_\\infty$.',
      trap: '37% is what remains of a decaying current after one time constant.' },
    { id: 'ind-011', type: 'nat', level: 2, exams: ['jam'], sub: 'rl circuits', unit: 'A',
      q: 'A 20 V battery is connected at $t = 0$ to a 10 $\\Omega$ resistor in series with a 2.0 H inductor. The current at $t = 0.20$ s is ______ A (to two decimal places).',
      answer: 1.26, tol: 0.013, calc: () => 2 * (1 - Math.exp(-1)),
      sol: '$\\tau = L/R = 0.20$ s and $I_\\infty = V/R = 2.0$ A. $I(0.2) = 2.0(1 - e^{-1}) = 2.0\\times0.632 \\approx 1.26$ A.' },
    { id: 'ind-012', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'mutual inductance',
      q: 'A short solenoid (radius $r_1$, $n_1$ turns per metre) sits coaxially inside a long solenoid (radius $r_2 > r_1$, $n_2$ turns per metre), overlapping it along a length $l$. Their mutual inductance is',
      options: ['$\\mu_0n_1n_2\\pi r_2^2l$', '$\\mu_0n_1n_2\\pi r_1^2l$', '$\\mu_0n_1n_2\\pi r_1r_2l$', '$\\mu_0(n_1 + n_2)\\pi r_1^2l$'], answer: 1,
      sol: 'Easiest way: current $I$ in the outer solenoid makes $B = \\mu_0n_2I$ inside it. The inner coil has $n_1l$ turns of area $\\pi r_1^2$, so it links $\\mu_0n_2I\\pi r_1^2n_1l$. $M = \\mu_0n_1n_2\\pi r_1^2l$. By $M_{12} = M_{21}$ the other way gives the same.',
      trap: 'Using the outer area: the field of the outer coil only matters where the inner coil is.' },
    { id: 'ind-013', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetic energy', unit: '$10^5$ J/m$^3$',
      q: 'The energy density of a magnetic field of 1.0 T in vacuum is ______ $\\times10^5$ J/m$^3$ (to two decimal places).',
      answer: 3.98, tol: 0.04, calc: () => 1 / (2 * MU) / 1e5,
      sol: '$u = \\dfrac{B^2}{2\\mu_0} = \\dfrac{1}{2(4\\pi\\times10^{-7})} \\approx 3.98\\times10^5$ J/m$^3$. Compare the electric field of air breakdown, about 40 J/m$^3$: magnetic fields store far more energy.' },
    { id: 'ind-014', type: 'msq', level: 2, exams: ['jam'], sub: 'rails',
      q: 'A rod of length $L$ on frictionless rails, closed by a resistor $R$, is pulled by a constant force $F$ through a uniform field $B$ perpendicular to the rails\' plane. Which are correct?',
      options: ['It reaches a terminal speed $FR/(B^2L^2)$.', 'At terminal speed the power delivered by $F$ equals the heat produced in $R$.', 'The magnetic force on the rod opposes its motion.', 'Its speed keeps growing linearly with time.'], answer: [0, 1, 2],
      sol: 'Current $I = BLv/R$; magnetic force $BIL = B^2L^2v/R$, opposing the motion (Lenz). Terminal speed when this equals $F$: $v_t = FR/(B^2L^2)$. Then $Fv_t = I^2R$ (both are $B^2L^2v_t^2/R$): mechanical work becomes heat. D is false: the speed approaches $v_t$ exponentially.' },
    { id: 'ind-015', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'self inductance',
      q: 'A toroid of $N$ turns has a rectangular cross-section: inner radius $a$, outer radius $b$, height $h$. Its self-inductance is',
      options: ['$\\dfrac{\\mu_0N^2h}{2\\pi}\\ln\\dfrac ba$', '$\\dfrac{\\mu_0N^2h(b-a)}{2\\pi a}$', '$\\dfrac{\\mu_0Nh}{2\\pi}\\ln\\dfrac ba$', '$\\mu_0N^2h(b - a)$'], answer: 0,
      sol: 'Inside, $B = \\mu_0NI/(2\\pi s)$. Flux through one turn: $\\int_a^b\\dfrac{\\mu_0NI}{2\\pi s}h\\,ds = \\dfrac{\\mu_0NIh}{2\\pi}\\ln\\dfrac ba$. Times $N$ turns, divided by $I$: $L = \\dfrac{\\mu_0N^2h}{2\\pi}\\ln\\dfrac ba$. (B is the thin-toroid approximation, valid only for $b - a\\ll a$.)' },
    { id: 'ind-016', type: 'nat', level: 2, exams: ['jam'], sub: 'faraday law', unit: 'mC',
      q: 'A coil of 50 turns, area 4.0 cm$^2$, has its plane perpendicular to a 0.20 T field. It is flipped over (turned through $180^\\circ$). The coil and meter have a total resistance of 10 $\\Omega$. The charge that flows is ______ mC (to two decimal places).',
      answer: 0.8, tol: 0.008, calc: () => 50 * 2 * 0.2 * 4e-4 / 10 * 1000,
      sol: '$Q = \\int I\\,dt = \\dfrac1R\\int\\mathcal E\\,dt = \\dfrac{N\\Delta\\Phi}{R}$, whatever the speed. Flipping reverses the flux, so $\\Delta\\Phi = 2BA = 2(0.20)(4\\times10^{-4}) = 1.6\\times10^{-4}$ Wb. $Q = \\dfrac{50\\times1.6\\times10^{-4}}{10} = 8.0\\times10^{-4}$ C.',
      trap: 'Using $\\Delta\\Phi = BA$: a flip changes the flux by twice that.' },

    // ---------- level 3 ----------
    { id: 'ind-017', type: 'nat', level: 3, exams: ['jam'], sub: 'motional emf', unit: '$\\mu$V',
      q: 'A rectangular loop (20 cm parallel to a long straight wire carrying 10 A, 10 cm perpendicular to it) moves directly away from the wire at 5.0 m/s. When its near side is 10 cm from the wire, the EMF in the loop is ______ $\\mu$V (to one decimal place).',
      answer: 10.0, tol: 0.1, calc: () => MU * 10 * 0.2 * 5 / (2 * Math.PI) * (1 / 0.1 - 1 / 0.2) * 1e6,
      sol: 'Only the two sides parallel to the wire have motional EMF, $B(s)av$, and they oppose each other: $\\mathcal E = \\dfrac{\\mu_0Iav}{2\\pi}\\left(\\dfrac1s - \\dfrac1{s+b}\\right) = (2\\times10^{-7})(10)(0.20)(5.0)(10 - 5) = 1.0\\times10^{-5}$ V.',
      trap: 'Using the field at the near side only.' },
    { id: 'ind-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'induced electric field',
      q: 'The uniform field inside a long solenoid of radius $R$ changes at a rate $dB/dt$. The induced electric field at distance $r$ from the axis is',
      options: ['$\\dfrac r2\\dfrac{dB}{dt}$ inside and zero outside', '$\\dfrac r2\\dfrac{dB}{dt}$ inside and $\\dfrac{R^2}{2r}\\dfrac{dB}{dt}$ outside', '$r\\dfrac{dB}{dt}$ inside and $\\dfrac{R^2}{r}\\dfrac{dB}{dt}$ outside', 'zero inside and $\\dfrac{R^2}{2r}\\dfrac{dB}{dt}$ outside'], answer: 1,
      sol: 'Faraday on a circle of radius $r$: $E(2\\pi r) = \\dfrac{d\\Phi}{dt}$. Inside, $\\Phi = \\pi r^2B$, so $E = \\dfrac r2\\dfrac{dB}{dt}$. Outside, $\\Phi = \\pi R^2B$, so $E = \\dfrac{R^2}{2r}\\dfrac{dB}{dt}$: not zero, even though $B = 0$ there.',
      trap: 'Option A: the induced E outside does not vanish just because B does.' },
    { id: 'ind-019', type: 'nat', level: 3, exams: ['jam'], sub: 'induced electric field', unit: 'mV/m',
      q: 'A long solenoid of radius 5.0 cm has its field increasing at 0.20 T/s. The induced electric field 10 cm from the axis is ______ mV/m (to two decimal places).',
      answer: 2.5, tol: 0.03, calc: () => 0.05 ** 2 / (2 * 0.1) * 0.2 * 1000,
      sol: 'The point is outside, so it links all the flux: $E = \\dfrac{R^2}{2r}\\dfrac{dB}{dt} = \\dfrac{0.0025}{0.20}\\times0.20 = 2.5\\times10^{-3}$ V/m.' },
    { id: 'ind-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'induced electric field',
      q: 'The current in a long solenoid is increasing. Outside the solenoid (where $B \\approx 0$), which are correct?',
      options: ['There is an electric field circling the solenoid.', 'This electric field is conservative.', 'Around a closed loop outside that does not encircle the solenoid, $\\oint\\vec E\\cdot d\\vec l = 0$.', '$\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$ holds there too.'], answer: [0, 2, 3],
      sol: 'Outside, $\\partial\\vec B/\\partial t = 0$, so $\\nabla\\times\\vec E = 0$ locally (D), and loops that do not encircle the solenoid give zero (C). But loops that do encircle it give $-d\\Phi/dt \\ne 0$ (A), so $\\vec E$ is not conservative (B is false): the region is not simply connected.' },
    { id: 'ind-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'mutual inductance', unit: 'mH',
      q: 'Two coils of 4.0 mH and 9.0 mH have coupling coefficient $k = 0.50$. Connected in series so that their fluxes add, the total inductance is ______ mH.',
      answer: 19, tol: 0, calc: () => 4 + 9 + 2 * 0.5 * Math.sqrt(4 * 9),
      sol: '$M = k\\sqrt{L_1L_2} = 0.5\\times6 = 3.0$ mH. Series aiding: $L = L_1 + L_2 + 2M = 4 + 9 + 6 = 19$ mH. (Opposing: $4 + 9 - 6 = 7$ mH.)',
      trap: 'Adding $M$ once instead of twice: each coil feels the other\'s flux.' },
    { id: 'ind-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'mutual inductance',
      q: 'Two coils have self-inductances 4.0 mH and 9.0 mH. Which value of their mutual inductance is impossible?',
      options: ['2.0 mH', '4.0 mH', '6.0 mH', '7.0 mH'], answer: 3,
      sol: 'Always $M \\le \\sqrt{L_1L_2} = 6.0$ mH (equality for perfect coupling, $k = 1$). 7.0 mH would make the stored energy negative for some pair of currents.',
      trap: '7 mH looks plausible because it is less than 9 mH, but the limit is the geometric mean.' },
    { id: 'ind-023', type: 'nat', level: 3, exams: ['jam'], sub: 'magnetic energy', unit: 'Hz',
      q: 'A 10 mH inductor is connected to a charged 1.0 $\\mu$F capacitor. Energy sloshes between the electric and magnetic fields. The frequency of this oscillation is ______ Hz (to the nearest whole number).',
      answer: 1592, tol: 16, calc: () => 1 / (2 * Math.PI * Math.sqrt(0.01 * 1e-6)),
      sol: 'Energy conservation $\\tfrac12LI^2 + \\tfrac{Q^2}{2C}$ = const gives $\\ddot Q = -Q/(LC)$: $\\omega = 1/\\sqrt{LC} = 1/\\sqrt{10^{-8}} = 10^4$ rad/s, $f = \\omega/2\\pi \\approx 1592$ Hz.',
      trap: 'Quoting $\\omega = 10^4$ when the question asks for $f$ in Hz.' },
    { id: 'ind-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'lenz law',
      q: 'The same strong magnet is dropped down three vertical tubes of equal length: copper, copper with a lengthwise slit, and plastic. Order the fall times from longest to shortest.',
      options: ['copper > slit copper > plastic', 'plastic > slit copper > copper', 'slit copper > copper > plastic', 'all equal: no current flows without a battery'], answer: 0,
      sol: 'The falling magnet induces eddy currents circling the tube, which oppose its motion (Lenz). The slit cuts the circular paths, so much weaker currents flow; plastic carries none, so the magnet falls freely there.' },
    { id: 'ind-025', type: 'nat', level: 3, exams: ['jam'], sub: 'rails', unit: 'm/s',
      q: 'A 20 g rod, 0.40 m long, slides without friction down vertical conducting rails joined at the top by a 0.50 $\\Omega$ resistor. A horizontal 0.50 T field is perpendicular to the plane of the rails. The terminal speed is ______ m/s (to two decimal places; $g = 9.8$ m/s$^2$).',
      answer: 2.45, tol: 0.03, calc: () => 0.02 * 9.8 * 0.5 / (0.5 ** 2 * 0.4 ** 2),
      sol: 'At terminal speed the magnetic force $\\dfrac{B^2L^2v}{R}$ balances $mg$: $v_t = \\dfrac{mgR}{B^2L^2} = \\dfrac{(0.020)(9.8)(0.50)}{(0.25)(0.16)} = 2.45$ m/s.' },
    { id: 'ind-026', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'mutual inductance',
      q: 'Which statements about the mutual inductance of two coils are correct?',
      options: ['$M_{12} = M_{21}$ always.', '$M$ depends on the currents in the coils.', 'Depending on how the coils are connected, $M$ can carry a negative sign.', '$M^2 \\le L_1L_2$.'], answer: [0, 2, 3],
      sol: 'A: the Neumann formula $M = \\dfrac{\\mu_0}{4\\pi}\\oint\\oint\\dfrac{d\\vec l_1\\cdot d\\vec l_2}{r}$ is symmetric. B is false: in vacuum (or linear materials) $M$ is set by geometry alone. C: the sign depends on the chosen current directions. D: energy positivity.' },
    { id: 'ind-027', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'self inductance', unit: '$\\mu$H/m',
      q: 'A coaxial cable has an inner conductor of radius 1.0 mm and a thin outer sheath of radius 4.0 mm. Ignoring the field inside the inner conductor, its inductance per metre is ______ $\\mu$H/m (to three decimal places).',
      answer: 0.277, tol: 0.003, calc: () => MU / (2 * Math.PI) * Math.log(4) * 1e6,
      sol: 'Between the conductors $B = \\mu_0I/(2\\pi s)$. Flux through a strip of length $l$: $\\dfrac{\\mu_0Il}{2\\pi}\\ln\\dfrac ba$. So $\\dfrac Ll = \\dfrac{\\mu_0}{2\\pi}\\ln\\dfrac ba = (2\\times10^{-7})\\ln4 \\approx 2.77\\times10^{-7}$ H/m. The [capacitor inductor calculator](/science/capacitor-inductor-calculator/) does this for any cable.' },
    { id: 'ind-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'faraday law',
      q: 'The flux through a loop rises linearly from 0 to $\\Phi_0$ between $t = 0$ and 2 s, stays at $\\Phi_0$ until 4 s, then falls linearly to zero by 5 s. Taking $\\mathcal E_0 = \\Phi_0/(2\\text{ s})$, the EMF is',
      options: ['$-\\mathcal E_0$, then 0, then $+2\\mathcal E_0$', '$-\\mathcal E_0$, then $-\\mathcal E_0$, then $+\\mathcal E_0$', '$+\\mathcal E_0$, then 0, then $+2\\mathcal E_0$', '$-\\mathcal E_0$, then 0, then $+\\mathcal E_0/2$'], answer: 0,
      sol: '$\\mathcal E = -d\\Phi/dt$. Rising at $\\Phi_0/2$ per second gives $-\\mathcal E_0$; constant flux gives zero; falling at $\\Phi_0/1$ per second gives $+2\\mathcal E_0$. The faster change gives the bigger EMF.',
      trap: 'Mistaking a flat flux for a flat, non-zero EMF.' },
    { id: 'ind-029', type: 'nat', level: 3, exams: ['jam'], sub: 'self inductance', unit: 'mH',
      q: 'A solenoid 50 cm long and 2.0 cm in radius has 500 turns. Its self-inductance is ______ mH (to three decimal places).',
      answer: 0.790, tol: 0.008, calc: () => MU * 500 ** 2 * Math.PI * 0.02 ** 2 / 0.5 * 1000,
      sol: '$L = \\dfrac{\\mu_0N^2A}{l} = \\dfrac{(4\\pi\\times10^{-7})(250000)(\\pi\\times4\\times10^{-4})}{0.50} \\approx 7.90\\times10^{-4}$ H.' },

    // ---------- level 4 ----------
    { id: 'ind-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'rails',
      q: 'A square loop of side $a$, mass $m$ and resistance $R$ falls with its plane vertical, its lower edge entering a region of horizontal uniform field $B$ (perpendicular to the loop) below a horizontal boundary. While it is partly inside, its speed approaches',
      options: ['$\\dfrac{mgR}{B^2a^2}$', '$\\dfrac{mgR}{Ba}$', '$\\sqrt{\\dfrac{mgR}{B^2a^2}}$', 'it keeps accelerating at $g$'], answer: 0,
      sol: 'Only the lower edge is in the field, so $\\mathcal E = Bav$ and $I = Bav/R$. The upward force on that edge is $BIa = B^2a^2v/R$. It balances $mg$ at $v = mgR/(B^2a^2)$. (Once fully inside, the flux stops changing and it falls at $g$ again.)' },
    { id: 'ind-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'induced electric field',
      q: 'In a betatron, electrons circle at a fixed radius while the magnetic field is ramped up. For this to work, the field at the orbit must be what fraction of the average field over the area inside the orbit? (Two decimal places.)',
      answer: 0.5, tol: 0.01, calc: () => 1 / 2,
      sol: 'The induced field speeds the electron up: $\\dfrac{dp}{dt} = eE = \\dfrac{e}{2\\pi r}\\dfrac{d\\Phi}{dt} = \\dfrac{er}{2}\\dfrac{d\\bar B}{dt}$. To keep the radius fixed, $p = eB_{\\text{orbit}}r$, so $\\dfrac{dp}{dt} = er\\dfrac{dB_{\\text{orbit}}}{dt}$. Equating: $B_{\\text{orbit}} = \\tfrac12\\bar B$ (starting from zero).' },
    { id: 'ind-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'induced electric field',
      q: 'An insulating disc, free to turn on an axle, has small charges glued round its rim. A coaxial coil at its centre carries a steady current, which is then switched off. Which are correct?',
      options: ['The disc starts to rotate.', 'This violates conservation of angular momentum.', 'The electromagnetic field held angular momentum before the switch-off.', 'The disc stays still because magnetic forces do no work.'], answer: [0, 2],
      sol: 'The falling flux induces a circling electric field at the rim, which pushes the charges round: the disc turns (A). Angular momentum is conserved because the fields of the charges and the coil together carried angular momentum, which passes to the disc (C, so B is false). D is false: the push comes from the induced electric field, not from the magnetic force.' },
    { id: 'ind-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'mutual inductance', unit: 'nH',
      q: 'A rectangular loop (20 cm parallel to a long straight wire, 10 cm perpendicular) lies in the wire\'s plane with its near side 10 cm from the wire. Their mutual inductance is ______ nH (to one decimal place).',
      answer: 27.7, tol: 0.3, calc: () => MU * 0.2 / (2 * Math.PI) * Math.log(2) * 1e9,
      sol: 'Current $I$ in the wire gives flux $\\int_d^{d+b}\\dfrac{\\mu_0I}{2\\pi s}a\\,ds = \\dfrac{\\mu_0Ia}{2\\pi}\\ln\\dfrac{d+b}{d}$. $M = (2\\times10^{-7})(0.20)\\ln2 \\approx 2.77\\times10^{-8}$ H.' },
    { id: 'ind-034', type: 'mcq', level: 4, exams: ['gate', 'net', 'jam'], sub: 'magnetic energy',
      q: 'Two coupled coils carry currents $I_1$ and $I_2$. Why must $M \\le \\sqrt{L_1L_2}$?',
      options: ['Because $M$ is measured in the same units as $L$.', 'Because the stored energy $\\tfrac12L_1I_1^2 + \\tfrac12L_2I_2^2 + MI_1I_2$ must be positive for every choice of currents.', 'Because flux cannot exceed $\\mu_0$ times current.', 'Because $M = (L_1 + L_2)/2$ at most.'], answer: 1,
      sol: 'The energy is a quadratic form in $(I_1, I_2)$. It is non-negative for all currents only if its discriminant is not positive: $M^2 \\le L_1L_2$. (Physically: no more flux can link coil 2 than coil 1 makes.)' },
    { id: 'ind-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rl circuits', unit: 'ms',
      q: 'A 0.50 H inductor carrying 2.0 A is suddenly connected across a 5.0 $\\Omega$ resistor. The time for its stored energy to fall to half is ______ ms (to one decimal place).',
      answer: 34.7, tol: 0.35, calc: () => 0.5 / 5 * Math.log(2) / 2 * 1000,
      sol: '$I = I_0e^{-t/\\tau}$ with $\\tau = L/R = 0.10$ s, so $U \\propto I^2 \\propto e^{-2t/\\tau}$. Half when $2t/\\tau = \\ln2$: $t = \\tau\\ln2/2 = 0.10\\times0.693/2 \\approx 0.0347$ s.',
      trap: 'Using $\\tau\\ln2 = 69.3$ ms, which is when the current halves.' },
    { id: 'ind-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'lenz law',
      q: 'A bar magnet falls along the axis of a fixed horizontal copper ring, passing through it. Its acceleration is',
      options: ['less than $g$ both while approaching and while leaving the ring', 'less than $g$ approaching, more than $g$ leaving', 'more than $g$ approaching, less than $g$ leaving', 'exactly $g$ throughout'], answer: 0,
      sol: 'Approaching, the ring\'s current repels the magnet (opposing the rising flux). Leaving, the current reverses and attracts it back (opposing the falling flux). Either way the force is upward, so the acceleration is below $g$ both times; Lenz\'s law always opposes the relative motion.' },
    { id: 'ind-037', type: 'nat', level: 4, exams: ['jam'], sub: 'motional emf', unit: 'mV',
      q: 'A circular wire loop lies perpendicular to a steady 0.50 T field. Its radius is shrinking at 2.0 cm/s. At the moment its radius is 10 cm, the EMF in it is ______ mV (to two decimal places).',
      answer: 6.28, tol: 0.06, calc: () => 0.5 * 2 * Math.PI * 0.1 * 0.02 * 1000,
      sol: '$\\Phi = B\\pi r^2$, so $|\\mathcal E| = B\\cdot2\\pi r\\left|\\dfrac{dr}{dt}\\right| = (0.50)(2\\pi)(0.10)(0.020) \\approx 6.28\\times10^{-3}$ V.' },

    // ---------- level 5 ----------
    { id: 'ind-038', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'rails', unit: 'm/s$^2$',
      q: 'A rod of mass 0.10 kg and length 0.50 m on frictionless horizontal rails is pulled by a constant 0.70 N force through a vertical 1.0 T field. The rails are joined by a 1.0 F capacitor (no resistance). The rod\'s acceleration is ______ m/s$^2$ (to two decimal places).',
      answer: 2, tol: 0.02, calc: () => 0.7 / (0.1 + 1 * 1 * 0.25),
      sol: 'The capacitor voltage follows the EMF: $Q = CBLv$, so $I = CBLa$. The magnetic force $BIL = CB^2L^2a$ opposes $F$: $F - CB^2L^2a = ma$, giving $a = \\dfrac{F}{m + CB^2L^2} = \\dfrac{0.70}{0.10 + 0.25} = 2.0$ m/s$^2$, constant. The capacitor acts like extra mass.',
      trap: 'Expecting a terminal speed as with a resistor.' },
    { id: 'ind-039', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'rails',
      q: 'A rod of mass $m$ on horizontal frictionless rails closed by a resistor $R$, in a vertical field $B$, is given a speed $v_0$ and left alone. Which are correct?',
      options: ['It travels a total distance $mv_0R/(B^2L^2)$.', 'Its speed decays exponentially with time.', 'The total heat produced is $\\tfrac12mv_0^2$.', 'Its speed decays exponentially with distance.'], answer: [0, 1, 2],
      sol: '$m\\dfrac{dv}{dt} = -\\dfrac{B^2L^2}{R}v$ gives $v = v_0e^{-t/\\tau}$ with $\\tau = mR/(B^2L^2)$ (B). Writing $\\dfrac{dv}{dt} = v\\dfrac{dv}{dx}$: $\\dfrac{dv}{dx} = -\\dfrac{B^2L^2}{mR}$, a constant, so $v$ falls linearly with distance (D false) and stops after $x = mv_0R/(B^2L^2)$ (A). All the kinetic energy becomes heat (C).',
      trap: 'D: exponential in time, but linear in distance.' },
    { id: 'ind-040', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'rails', unit: 'm',
      q: 'For the coasting rod (previous idea): $m = 0.20$ kg, $v_0 = 4.0$ m/s, $R = 2.0\\ \\Omega$, $B = 0.50$ T, $L = 1.0$ m. The total distance it travels is ______ m (to one decimal place).',
      answer: 6.4, tol: 0.06, calc: () => 0.2 * 4 * 2 / (0.25 * 1),
      sol: '$x = \\dfrac{mv_0R}{B^2L^2} = \\dfrac{(0.20)(4.0)(2.0)}{(0.25)(1.0)} = 6.4$ m. (Its total time is infinite, but the distance is finite.)' },
    { id: 'ind-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'mutual inductance',
      q: 'A small loop of radius $a$ is coaxial with a large loop of radius $b\\gg a$, a distance $z$ away along the axis. Their mutual inductance is approximately',
      options: ['$\\dfrac{\\mu_0\\pi a^2b^2}{2(b^2+z^2)^{3/2}}$', '$\\dfrac{\\mu_0\\pi ab}{2\\sqrt{b^2+z^2}}$', '$\\dfrac{\\mu_0\\pi a^2}{2b}$ for every $z$', '$\\dfrac{\\mu_0a^2b^2}{4\\pi(b^2+z^2)^{3/2}}$'], answer: 0,
      sol: 'Send current $I$ round the big loop. Its axial field $\\dfrac{\\mu_0Ib^2}{2(b^2+z^2)^{3/2}}$ is nearly uniform over the small loop, so the flux is that times $\\pi a^2$. Divide by $I$. Check: at $z = 0$ it gives $\\mu_0\\pi a^2/(2b)$, the flux through a small loop at the centre. By $M_{12} = M_{21}$ this also gives the much harder flux of the small loop\'s dipole field through the big loop.' },
    ...more2,
  ],
  gens: [
    { id: 'ind-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'faraday law', format: 'graph',
      make(r) {
        const N = Q5.int(r, 2, 20) * 10, P = Q5.int(r, 2, 20), t = [Q5.pick(r, 0.1, 1, 0.1), Q5.pick(r, 0.2, 2, 0.1), Q5.pick(r, 0.1, 1, 0.1)], s = Q5.int(r, 0, 2);
        const e = (i) => (i === 1 ? 0 : N * P * 1e-3 / t[i]);
        const show = (v) => `$${Q5.round(v, 3)}$ V`;
        const o = Q5.mcqOptions(r, e(s), [e((s + 1) % 3), e((s + 2) % 3), N * P * 1e-3, P * 1e-3 / t[s === 1 ? 0 : s], N * P * 1e-3 / t[1]], show);
        return { q: `The magnetic flux through each turn of a $${N}$-turn coil, plotted against time, rises in a straight line from $0$ to $${P}$ mWb in $${t[0]}$ s, stays flat for $${t[1]}$ s, then falls in a straight line to $0$ in $${t[2]}$ s. During the ${['rise', 'flat part', 'fall'][s]}, the size of the induced emf is`, ...o,
          sol: `$|\\mathcal E| = N\\,|d\\Phi/dt|$, $N$ times the slope of the graph. Rise: $${N}\\times${P}\\times10^{-3}/${t[0]} = ${Q5.round(e(0), 3)}$ V. Flat: slope zero, emf zero (even though the flux is largest). Fall: $${N}\\times${P}\\times10^{-3}/${t[2]} = ${Q5.round(e(2), 3)}$ V, with the opposite sign.`,
          trap: 'The emf follows the slope of the flux graph, not its height.' };
      } },
    { id: 'ind-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'lenz law', format: 'statements',
      make(r) {
        const near = r() < 0.5, pole = r() < 0.5 ? 'north' : 'south';
        const faceN = near ? pole === 'north' : pole === 'south';
        const pairs = [['The coil repels the magnet.', 'The coil attracts the magnet.', near], ['The face of the coil nearest the magnet acts as a north pole.', 'The face of the coil nearest the magnet acts as a south pole.', faceN],
          ['Seen from the magnet, the induced current flows anticlockwise.', 'Seen from the magnet, the induced current flows clockwise.', faceN], ['The person moving the magnet must do work against the magnetic force.', 'The magnetic force on the magnet helps the person move it.', true],
          ['Moving the magnet faster would give a larger induced current.', 'The induced current does not depend on how fast the magnet moves.', true]];
        const T = pairs.map((p) => (p[2] ? p[0] : p[1])), F = pairs.map((p) => (p[2] ? p[1] : p[0]));
        const o = q5msq(r, T, F);
        return { q: `The ${pole} pole of a bar magnet is moved along the axis of a closed coil, ${near ? 'towards' : 'away from'} it. Which statements are correct?`, ...o,
          sol: `Lenz: the induced current opposes the change. The flux from the ${pole} pole through the coil is ${near ? 'growing, so the coil opposes the approach: its near face becomes a ' + pole + ' pole and repels' : 'shrinking, so the coil opposes the retreat: its near face becomes ' + (pole === 'north' ? 'a south' : 'a north') + ' pole and attracts'}. A face acts as a north pole when, seen from outside, its current runs anticlockwise. Either way the force opposes the motion, so the person does work, which becomes heat in the coil. Faster motion means faster flux change, larger emf and current.`,
          trap: 'Lenz law opposes the change in flux, not the flux itself: a retreating magnet is attracted.' };
      } },
    { id: 'ind-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'rails', unit: 'm/s',
      make(r) {
        const m = Q5.pick(r, 0.005, 0.05, 0.005), R = Q5.pick(r, 0.5, 5, 0.5), B = Q5.pick(r, 0.5, 1.5, 0.1), L = Q5.pick(r, 0.2, 0.5, 0.05);
        const v = m * 9.8 * R / (B * L) ** 2;
        return { q: `A metal rod of mass $${m}$ kg and length $${L}$ m slides without friction down a pair of long vertical rails joined at the top by a $${R}\\ \\Omega$ resistor (rod and rails have no resistance). A horizontal field of $${B}$ T is perpendicular to the plane of the rails. Released from rest, the rod reaches a terminal speed of ______ m/s (to three significant figures; $g = 9.8$ m/s$^2$).`,
          answer: +v.toPrecision(3), tol: +(0.006 * v).toPrecision(2), m, R, B, L,
          sol: `At speed $v$: emf $BLv$, current $BLv/R$, magnetic force $B^2L^2v/R$ upwards. Terminal speed when this equals $mg$: $v_t = \\dfrac{mgR}{B^2L^2} = \\dfrac{${m}\\times9.8\\times${R}}{(${B}\\times${L})^2} = ${+v.toPrecision(3)}$ m/s. (Check: then $mgv_t = (BLv_t)^2/R$, the power lost by gravity becomes heat.)`,
          trap: 'The braking force grows as $B^2L^2$: double the field and the terminal speed falls to a quarter.' };
      },
      verify: (p) => { const k = (p.B * p.L) ** 2 / (p.m * p.R), tau = 1 / k, h = tau / 50; let v = 0; const f = (x) => 9.8 - k * x; for (let i = 0; i < 2000; i++) { const a = f(v), b = f(v + h * a / 2), c = f(v + h * b / 2), d = f(v + h * c); v += h * (a + 2 * b + 2 * c + d) / 6; } return v; } },
    { id: 'ind-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'rl circuits', format: 'dimensions',
      make(r) {
        const time = r() < 0.5;
        const ok = time ? ['$L/R$', '$RC$', '$\\sqrt{LC}$'] : ['$\\sqrt{L/C}$', '$L/(RC)$', '$\\omega L$'];
        const bad = time ? ['$LR$', '$R/L$', '$L/C$', '$LC$', '$\\sqrt{L/C}$'] : ['$LC$', '$RC$', '$L/R$', '$\\sqrt{LC}$', '$C/L$'];
        const o = q5odd(r, ok, bad);
        return { q: `With $R$ a resistance, $L$ an inductance, $C$ a capacitance and $\\omega$ an angular frequency, which combination has the dimensions of ${time ? 'time' : 'resistance'}?`, ...o,
          sol: 'From $V = L\\,dI/dt$, an inductance is (ohm)(second); from $I = C\\,dV/dt$, a capacitance is (second)/(ohm). So $L/R$ and $RC$ are seconds and $LC$ is seconds squared; $\\sqrt{L/C}$, $\\omega L$ and $L/RC$ are ohms.',
          trap: 'Write $L$ as $\\Omega$ s and $C$ as s/$\\Omega$; then every combination is quick to check.' };
      } },
    { id: 'ind-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'mutual inductance', unit: 'mV',
      make(r) {
        const N1 = Q5.int(r, 2, 10) * 50, N2 = Q5.int(r, 2, 10) * 100, l = Q5.int(r, 20, 60), a = Q5.int(r, 1, 3), dI = Q5.int(r, 1, 50);
        const M = 4e-7 * Math.PI * N1 * N2 * Math.PI * (a / 100) ** 2 / (l / 100), e = M * dI * 1000;
        return { q: `A long solenoid of $${N2}$ turns and length $${l}$ cm surrounds, along its whole length, a coaxial inner coil of $${N1}$ turns and radius $${a}$ cm (the same length). The current in the outer solenoid changes at $${dI}$ A/s. The emf induced in the inner coil is ______ mV (to three significant figures; $\\mu_0 = 4\\pi\\times10^{-7}$ SI).`,
          answer: +e.toPrecision(3), tol: +(0.006 * e).toPrecision(2), N1, N2, l, a, dI,
          sol: `The outer field is $B = \\mu_0N_2I/l$; its flux through each inner turn is $B\\pi a^2$. So $M = \\mu_0N_1N_2\\pi a^2/l = ${Q5.fmt(M, 4)}$ H and $\\mathcal E = M\\,dI/dt = ${+e.toPrecision(3)}$ mV.`,
          trap: 'Only the inner coil\'s area carries the linking flux, whatever the outer radius.' };
      },
      verify: (p) => { const B1 = 4e-7 * Math.PI * p.N1 / (p.l / 100); const link = p.N2 * B1 * Math.PI * (p.a / 100) ** 2; return link * p.dI * 1000; } },
    { id: 'ind-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'faraday law', unit: 'V',
      make(r) {
        const N = choose(r, [10, 50, 100, 200, 500]), A = int(r, 5, 100), B1 = int(r, 0, 10) / 10, B2 = int(r, 0, 10) / 10, t = choose(r, [0.05, 0.1, 0.2, 0.5, 1]);
        const dB = Math.abs(B2 - B1) || 0.3;
        const E = N * A * 1e-4 * dB / t;
        return { q: `A coil of ${N} turns, each of area ${A} cm$^2$, has its axis along a uniform field. The field changes steadily ${B2 - B1 ? `from ${B1} T to ${B2} T` : `by ${dB} T`} in ${t} s. The magnitude of the induced EMF is ______ V (to three decimal places).`,
          answer: round(E, 3), tol: Math.max(E * 0.01, 0.001), N, A, dB, t,
          sol: `$|\\mathcal E| = NA\\dfrac{|\\Delta B|}{\\Delta t} = ${N}\\times(${A}\\times10^{-4})\\times\\dfrac{${round(dB, 2)}}{${t}} \\approx ${round(E, 3)}$ V.`,
          trap: 'Convert cm$^2$ to m$^2$ (divide by $10^4$) and include all $N$ turns.' };
      },
      verify: (p) => p.N * p.A * 1e-4 * p.dB / p.t },
    { id: 'ind-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'rails', unit: 'mA',
      make(r) {
        const B = int(r, 1, 10) / 10, L = int(r, 10, 100) / 100, v = int(r, 1, 10), R = int(r, 1, 20);
        const I = B * L * v / R * 1000;
        return { q: `A rod ${L} m long slides at ${v} m/s along rails joined by a ${R} $\\Omega$ resistor, in a ${B} T field perpendicular to the plane of the rails. The current is ______ mA (to one decimal place).`,
          answer: round(I, 1), tol: Math.max(I * 0.01, 0.1), B, L, v, R,
          sol: `$\\mathcal E = BLv = (${B})(${L})(${v}) = ${round(B * L * v, 4)}$ V. $I = \\mathcal E/R = ${round(B * L * v, 4)}/${R} \\approx ${round(I, 1)}$ mA.`,
          trap: 'Only the moving rod has an EMF; the rails and resistor just close the circuit.' };
      },
      verify: (p) => p.B * p.L * p.v / p.R * 1000 },
    { id: 'ind-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'motional emf', unit: 'V',
      make(r) {
        const B = int(r, 1, 10) / 10, L = int(r, 2, 20) / 10, f = int(r, 1, 20), mid = r() < 0.3;
        const E = mid ? 0 : 0.5 * B * 2 * Math.PI * f * L * L;
        return { q: `A metal rod ${L} m long spins at ${f} revolutions per second about ${mid ? 'its midpoint' : 'one end'}, in a plane perpendicular to a uniform ${B} T field. The EMF between its two ends is ______ V (to two decimal places).`,
          answer: round(E, 2), tol: Math.max(E * 0.01, 0.01), B, L, f, mid,
          sol: mid
            ? 'Each half gives $\\tfrac12B\\omega(L/2)^2$ from the centre outwards, so both ends are at the same potential relative to the centre: the EMF between the ends is 0 V (each end is still at a different potential from the centre).'
            : `$\\omega = 2\\pi\\times${f} = ${round(2 * Math.PI * f, 2)}$ rad/s. $\\mathcal E = \\tfrac12B\\omega L^2 = \\tfrac12(${B})(${round(2 * Math.PI * f, 2)})(${L})^2 \\approx ${round(E, 2)}$ V.`,
          trap: mid ? 'The two halves give equal and opposite EMFs between the ends.' : 'The average speed of the rod is half the tip speed: $\\tfrac12\\omega L$.' };
      },
      verify: (p) => (p.mid ? 0 : 0.5 * p.B * 2 * Math.PI * p.f * p.L * p.L) },
    { id: 'ind-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'generators', unit: 'V',
      make(r) {
        const N = choose(r, [20, 50, 100, 200]), A = int(r, 10, 300), B = int(r, 1, 10) / 10, rpm = choose(r, [600, 900, 1200, 1500, 1800, 3000, 3600]);
        const w = 2 * Math.PI * rpm / 60, E = N * B * A * 1e-4 * w, rms = r() < 0.4;
        const ans = rms ? E / Math.SQRT2 : E;
        return { q: `A generator coil of ${N} turns, area ${A} cm$^2$, turns at ${rpm} rpm in a uniform ${B} T field perpendicular to its axis of rotation. The ${rms ? 'rms' : 'peak'} EMF is ______ V (to one decimal place).`,
          answer: round(ans, 1), tol: Math.max(ans * 0.01, 0.1), N, A, B, rpm, rms,
          sol: `$\\omega = 2\\pi\\times${rpm}/60 = ${round(w, 2)}$ rad/s. Peak $= NBA\\omega = ${N}\\times${B}\\times${A}\\times10^{-4}\\times${round(w, 2)} \\approx ${round(E, 1)}$ V.${rms ? ` The rms value is peak$/\\sqrt2 \\approx ${round(ans, 1)}$ V.` : ''}`,
          trap: 'Convert rpm to rad/s ($\\times2\\pi/60$)' + (rms ? ', and divide the peak by $\\sqrt2$ for rms.' : '.') };
      },
      verify: (p) => { const E = p.N * p.B * p.A * 1e-4 * 2 * Math.PI * p.rpm / 60; return p.rms ? E / Math.SQRT2 : E; } },
    { id: 'ind-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'rl circuits', unit: 'A',
      make(r) {
        const V = int(r, 2, 24), R = int(r, 2, 20), L = int(r, 1, 20) / 10, n = choose(r, [0.5, 1, 2, 3]), decay = r() < 0.4;
        const tau = L / R, t = round(n * tau, 4), I0 = V / R;
        const I = decay ? I0 * Math.exp(-t / tau) : I0 * (1 - Math.exp(-t / tau));
        return { q: decay
            ? `A ${L} H inductor in series with a ${R} $\\Omega$ resistor has carried a steady current from a battery of ${V} V for a long time. At $t = 0$ the battery is replaced by a wire. The current at $t = ${t}$ s is ______ A (to three decimal places).`
            : `At $t = 0$ a battery of ${V} V is connected to a ${R} $\\Omega$ resistor in series with a ${L} H inductor. The current at $t = ${t}$ s is ______ A (to three decimal places).`,
          answer: round(I, 3), tol: Math.max(I * 0.01, 0.001), V, R, L, t, decay,
          sol: `$\\tau = L/R = ${round(tau, 4)}$ s and the steady current is $V/R = ${round(I0, 4)}$ A. ${decay ? `Decay: $I = ${round(I0, 4)}\\,e^{-t/\\tau} = ${round(I0, 4)}\\,e^{-${n}}$` : `Growth: $I = ${round(I0, 4)}(1 - e^{-t/\\tau}) = ${round(I0, 4)}(1 - e^{-${n}})$`} $\\approx ${round(I, 3)}$ A.`,
          trap: 'The time constant of an RL circuit is $L/R$ (not $RL$ or $R/L$).' };
      },
      verify: (p) => { const tau = p.L / p.R, I0 = p.V / p.R; return p.decay ? I0 * Math.exp(-p.t / tau) : I0 * (1 - Math.exp(-p.t / tau)); } },
    { id: 'ind-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'self inductance', unit: 'mH',
      make(r) {
        const N = int(r, 1, 20) * 100, l = int(r, 2, 10) * 10, a = int(r, 1, 4); // cm
        const L = MU * N * N * Math.PI * (a / 100) ** 2 / (l / 100) * 1000;
        return { q: `A long solenoid has ${N} turns wound over a length of ${l} cm, with radius ${a} cm. Its self-inductance is ______ mH (to three significant figures).`,
          answer: +L.toPrecision(3), tol: L * 0.01, N, l, a,
          sol: `$L = \\dfrac{\\mu_0N^2\\pi a^2}{l} = \\dfrac{(4\\pi\\times10^{-7})(${N})^2\\pi(${a / 100})^2}{${l / 100}} \\approx ${+L.toPrecision(3)}$ mH.`,
          trap: '$L$ grows as $N^2$: doubling the turns quadruples the inductance.' };
      },
      verify: (p) => MU * p.N * p.N * Math.PI * (p.a / 100) ** 2 / (p.l / 100) * 1000 },
    { id: 'ind-g07', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetic energy', unit: 'J',
      make(r) {
        const kind = choose(r, ['coil', 'field']);
        if (kind === 'coil') {
          const L = int(r, 1, 50) * 10, I = int(r, 1, 10); // mH, A
          const U = 0.5 * L / 1000 * I * I;
          return { q: `An inductor of ${L} mH carries ${I} A. The energy stored in its magnetic field is ______ J (to three decimal places).`,
            answer: round(U, 3), tol: Math.max(U * 0.01, 0.001), kind, L, I, B: 0, V: 0,
            sol: `$U = \\tfrac12LI^2 = \\tfrac12(${L / 1000})(${I})^2 = ${round(U, 3)}$ J.`, trap: 'Convert mH to H.' };
        }
        const B = int(r, 1, 20) / 10, V = int(r, 1, 50); // T, cm^3
        const U = B * B / (2 * MU) * V * 1e-6;
        return { q: `A uniform magnetic field of ${B} T fills a gap of volume ${V} cm$^3$. The energy stored in the gap is ______ J (to three decimal places).`,
          answer: round(U, 3), tol: Math.max(U * 0.01, 0.001), kind, B, V, L: 0, I: 0,
          sol: `$u = \\dfrac{B^2}{2\\mu_0} = \\dfrac{(${B})^2}{2(4\\pi\\times10^{-7})} \\approx ${round(B * B / (2 * MU), 0)}$ J/m$^3$. Times $${V}\\times10^{-6}$ m$^3$: $U \\approx ${round(U, 3)}$ J.`,
          trap: 'Convert cm$^3$ to m$^3$ (divide by $10^6$).' };
      },
      verify: (p) => (p.kind === 'coil' ? 0.5 * p.L / 1000 * p.I * p.I : p.B * p.B / (2 * MU) * p.V * 1e-6) },
    { id: 'ind-g08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'mutual inductance', unit: 'mH',
      make(r) {
        const [L1, L2, g] = choose(r, [[1, 4, 2], [4, 9, 6], [2, 8, 4], [9, 16, 12], [4, 25, 10], [1, 9, 3], [16, 25, 20]]);
        const k = choose(r, [0.25, 0.5, 0.75, 1]), aid = r() < 0.5;
        const M = k * g, L = L1 + L2 + (aid ? 2 : -2) * M;
        return { q: `Two coils of ${L1} mH and ${L2} mH have coupling coefficient $k = ${k}$. They are joined in series ${aid ? 'so that their fluxes add' : 'so that their fluxes oppose'}. The total inductance is ______ mH (to two decimal places).`,
          answer: round(L, 2), tol: 0.01, L1, L2, g, k, aid,
          sol: `$M = k\\sqrt{L_1L_2} = ${k}\\times${g} = ${M}$ mH. ${aid ? 'Aiding' : 'Opposing'}: $L = L_1 + L_2 ${aid ? '+' : '-'} 2M = ${L1} + ${L2} ${aid ? '+' : '-'} ${2 * M} = ${round(L, 2)}$ mH.`,
          trap: 'The mutual term appears twice ($2M$), because each coil links the other\'s flux.' };
      },
      verify: (p) => p.L1 + p.L2 + (p.aid ? 2 : -2) * p.k * p.g },
  ],
};
