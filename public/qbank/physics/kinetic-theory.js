// Kinetic theory of gases: pressure from molecular motion, Maxwell speed and energy distributions, equipartition and
// heat capacities, mean free path, collisions, effusion, transport, van der Waals gas.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

// error function (Abramowitz-Stegun 7.1.26 is too rough for checks; use the series, fine for |x| < 3)
const erf = (x) => { let s = 0, t = x, n = 0; while (Math.abs(t) > 1e-16 && n < 200) { s += t / (2 * n + 1); n++; t *= -x * x / n; } return (2 / Math.sqrt(Math.PI)) * s; };

import * as Q5 from '../_util.js';
import more2 from './kinetic-theory.more2.gen.js';

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
  topic: 'kinetic-theory',
  items: [
    // ---- level 1 ----
    { id: 'kth-001', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'Maxwell speeds',
      q: 'For an ideal gas in equilibrium, the ratio $v_{\\rm rms} : \\bar v : v_{\\rm mp}$ (root-mean-square, mean and most probable speeds) is',
      options: ['$\\sqrt3 : \\sqrt2 : \\sqrt{8/\\pi}$', '$1 : 1 : 1$', '$\\sqrt3 : \\sqrt{8/\\pi} : \\sqrt2$', '$\\sqrt2 : \\sqrt{8/\\pi} : \\sqrt3$'], answer: 2,
      sol: 'From the Maxwell distribution, $v_{\\rm mp} = \\sqrt{2kT/m}$, $\\bar v = \\sqrt{8kT/\\pi m}$ and $v_{\\rm rms} = \\sqrt{3kT/m}$. Since $8/\\pi \\approx 2.55$ lies between 2 and 3, the order is $v_{\\rm rms} > \\bar v > v_{\\rm mp}$, in the ratio $\\sqrt3 : \\sqrt{8/\\pi} : \\sqrt2 \\approx 1.225 : 1.128 : 1$.',
      trap: 'Putting the mean speed last. Remember the order of the numbers under the root: 3 > 2.55 > 2.' },
    { id: 'kth-002', type: 'nat', level: 1, exams: ['jam'], sub: 'Maxwell speeds', unit: 'm/s',
      q: 'The root-mean-square speed of nitrogen molecules ($M = 28$ g/mol) at $300$ K is ______ m/s (take $R = 8.314$ J mol$^{-1}$ K$^{-1}$).',
      answer: 517, tol: 5, calc: () => Math.sqrt(3 * 8.314 * 300 / 0.028),
      sol: '$v_{\\rm rms} = \\sqrt{3RT/M} = \\sqrt{3\\times8.314\\times300/0.028} = \\sqrt{2.672\\times10^5} \\approx 517$ m/s.',
      trap: 'Using $M = 28$ instead of $0.028$ kg/mol makes the answer about 32 times too small.' },
    { id: 'kth-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'pressure and temperature',
      q: 'Helium and xenon are kept at the same temperature $T$. The average translational kinetic energy per atom is',
      options: ['$\\tfrac32 kT$ for both', 'larger for xenon, because it is heavier', 'larger for helium, because it moves faster', '$\\tfrac12 kT$ for both'], answer: 0,
      sol: 'Kinetic theory gives $\\langle \\tfrac12 m v^2\\rangle = \\tfrac32 kT$: three translational degrees of freedom, each with $\\tfrac12 kT$. The mass cancels. Helium atoms are faster, xenon atoms heavier, and the energy is the same.',
      trap: 'Mixing up speed (depends on mass) with kinetic energy (does not).' },
    { id: 'kth-004', type: 'msq', level: 1, exams: ['jam'], sub: 'pressure and temperature', format: 'multi',
      q: 'For a fixed amount of a given ideal gas, which of these depend <b>only</b> on the temperature?',
      options: ['The average translational kinetic energy of a molecule', 'The pressure', 'The internal energy', 'The number density'], answer: [0, 2],
      sol: 'A: $\\tfrac32 kT$. C: for an ideal gas there are no forces between molecules, so $U$ is the sum of molecular energies and depends only on $T$. B: $P = nkT$ also depends on the number density. D: the density depends on the volume.',
      trap: 'Pressure depends on temperature, but not only on temperature: compress the gas at fixed $T$ and $P$ rises.' },
    { id: 'kth-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'equipartition',
      q: 'At room temperature the molar heat capacity at constant volume of oxygen (a rigid diatomic gas) is close to',
      options: ['$\\tfrac32 R$', '$\\tfrac72 R$', '$3R$', '$\\tfrac52 R$'], answer: 3,
      sol: 'A diatomic molecule has 3 translational and 2 rotational quadratic terms (rotation about the bond axis does not count). Vibration is frozen at room temperature. Each term gives $\\tfrac12 R$ per mole, so $C_V = \\tfrac52 R$.',
      trap: '$\\tfrac72 R$ includes vibration (two quadratic terms: kinetic and potential), which needs much higher temperatures.' },
    { id: 'kth-006', type: 'nat', level: 1, exams: ['jam'], sub: 'equipartition',
      q: 'The ratio $\\gamma = C_P/C_V$ for an ideal monatomic gas is ______ (to two decimal places).',
      answer: 1.67, tol: 0.01, calc: () => 5 / 3,
      sol: '$C_V = \\tfrac32 R$ and $C_P = C_V + R = \\tfrac52 R$, so $\\gamma = 5/3 \\approx 1.67$.' },

    // ---- level 2 ----
    { id: 'kth-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'Maxwell speeds',
      q: 'A gas is heated from $27\\,^\\circ$C to $327\\,^\\circ$C. Its rms speed becomes',
      options: ['12.1 times the original', '$\\sqrt2$ times the original', '2 times the original', '$\\sqrt{327/27}$ times the original'], answer: 1,
      sol: '$v_{\\rm rms} \\propto \\sqrt T$ with $T$ in kelvin: $300$ K to $600$ K doubles $T$, so the speed grows by $\\sqrt2$.',
      trap: 'Using Celsius temperatures. Every kinetic theory formula needs absolute temperature.' },
    { id: 'kth-008', type: 'nat', level: 2, exams: ['jam'], sub: 'pressure and temperature', unit: 'kPa',
      q: 'A gas has $2.5\\times10^{25}$ molecules per cubic metre, each of mass $4.65\\times10^{-26}$ kg, and an rms speed of $500$ m/s. The pressure it exerts is ______ kPa.',
      answer: 96.9, tol: 0.5, calc: () => (1 / 3) * 2.5e25 * 4.65e-26 * 500 ** 2 / 1000,
      sol: 'Kinetic theory: $P = \\tfrac13 n m \\langle v^2\\rangle = \\tfrac13 (2.5\\times10^{25})(4.65\\times10^{-26})(500)^2 = \\tfrac13(1.1625)(2.5\\times10^5) \\approx 9.69\\times10^4$ Pa $= 96.9$ kPa.',
      trap: 'Forgetting the factor $\\tfrac13$: only one third of $\\langle v^2\\rangle$ is along any one axis.' },
    { id: 'kth-009', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'energy distribution',
      q: 'In the Maxwell–Boltzmann distribution of molecular kinetic energies, $f(E) \\propto \\sqrt{E}\\,e^{-E/kT}$, the most probable kinetic energy is',
      options: ['$\\tfrac32 kT$', '$2kT$', '$\\tfrac12 kT$', '$kT$'], answer: 2,
      sol: 'Maximise $\\ln f = \\tfrac12\\ln E - E/kT$: $\\frac{1}{2E} - \\frac1{kT} = 0$, so $E_{\\rm mp} = \\tfrac12 kT$.',
      trap: '$\\tfrac12 m v_{\\rm mp}^2 = kT$ is not the most probable energy. Changing variable from $v$ to $E$ changes the shape of the distribution, so the peaks do not map onto each other.' },
    { id: 'kth-010', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'mean free path', format: 'multi',
      q: 'For a dilute gas of hard spheres of diameter $d$, the mean free path $\\lambda = 1/(\\sqrt2\\,\\pi d^2 n)$. Which statements are correct?',
      options: ['At constant temperature, $\\lambda \\propto 1/P$', 'At constant number density, $\\lambda$ does not depend on $T$', 'Doubling $d$ makes $\\lambda$ four times smaller', 'Doubling the molecular mass at the same $n$ halves $\\lambda$'], answer: [0, 1, 2],
      sol: '$\\lambda$ depends only on $n$ and $d$. A: $n = P/kT$, so at fixed $T$, $\\lambda \\propto 1/P$. B: true, $T$ does not appear once $n$ is fixed. C: $\\lambda \\propto d^{-2}$. D: mass does not appear at all.',
      trap: 'Writing $\\lambda = kT/(\\sqrt2\\pi d^2 P)$ and concluding that $\\lambda$ always grows with $T$; that is only at fixed pressure.' },
    { id: 'kth-011', type: 'nat', level: 2, exams: ['jam'], sub: 'mean free path', unit: 'nm',
      q: 'Nitrogen molecules have an effective diameter $3.7\\times10^{-10}$ m. Their mean free path at $273$ K and $1.013\\times10^5$ Pa is ______ nm.',
      answer: 61.2, tol: 0.7, calc: () => C.kB * 273 / (Math.SQRT2 * Math.PI * (3.7e-10) ** 2 * 1.013e5) * 1e9,
      sol: '$\\lambda = \\dfrac{kT}{\\sqrt2\\,\\pi d^2 P} = \\dfrac{(1.381\\times10^{-23})(273)}{1.414\\times\\pi(3.7\\times10^{-10})^2(1.013\\times10^5)} = \\dfrac{3.77\\times10^{-21}}{6.16\\times10^{-14}} \\approx 6.12\\times10^{-8}$ m $= 61.2$ nm.',
      trap: 'Using the radius instead of the diameter changes the answer by a factor of 4.' },
    { id: 'kth-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'equipartition',
      q: 'One mole of helium is mixed with one mole of oxygen (rigid diatomic). The ratio $C_P/C_V$ of the mixture is',
      options: ['$1.50$', '$1.53$', '$1.60$', '$1.47$'], answer: 0,
      sol: 'Add heat capacities, not $\\gamma$s. $C_V = (1\\cdot\\tfrac32 R + 1\\cdot\\tfrac52 R)/2 = 2R$ per mole of mixture; $C_P = C_V + R = 3R$. So $\\gamma = 3/2 = 1.50$.',
      trap: 'Averaging the two $\\gamma$ values, $(1.667 + 1.4)/2 \\approx 1.53$, is wrong.' },
    { id: 'kth-013', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'Maxwell speeds', format: 'multi',
      q: 'Which statements about the Maxwell speed distribution $f(v)$ of an ideal gas are correct?',
      options: ['As $T$ rises, the peak moves to higher speed and the curve becomes flatter', 'As $T$ rises, the area under the curve grows', 'At the same $T$, a lighter gas has its peak at a higher speed', 'The height of the peak is proportional to $T^{-1/2}$'], answer: [0, 2, 3],
      sol: 'A and C: $v_{\\rm mp} = \\sqrt{2kT/m}$. B: the area is always 1 (it is a probability distribution). D: $f(v_{\\rm mp}) = 4\\pi(m/2\\pi kT)^{3/2}v_{\\rm mp}^2e^{-1} \\propto T^{-3/2}\\cdot T = T^{-1/2}$.',
      trap: 'Thinking that more molecules become fast as well as fewer slow, so the area grows. The total stays fixed: the curve spreads out and drops.' },
    { id: 'kth-014', type: 'nat', level: 2, exams: ['jam'], sub: 'effusion',
      q: 'Hydrogen ($M = 2$) and oxygen ($M = 32$) at the same temperature and pressure leak through the same tiny hole. The ratio of the rate at which hydrogen molecules escape to that of oxygen is ______.',
      answer: 4, tol: 0, calc: () => Math.sqrt(32 / 2),
      sol: 'Effusion flux $= \\tfrac14 n\\bar v$. Same $T$ and $P$ means the same $n$, and $\\bar v \\propto 1/\\sqrt M$. Ratio $= \\sqrt{32/2} = 4$ (Graham\'s law).' },
    { id: 'kth-016', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'Maxwell speeds',
      q: 'For a gas in equilibrium (molecular mass $m$), the averages of one velocity component are',
      options: ['$\\langle v_x\\rangle = 0$ and $\\langle v_x^2\\rangle = 3kT/m$', '$\\langle v_x\\rangle = \\sqrt{2kT/m}$ and $\\langle v_x^2\\rangle = kT/m$', '$\\langle v_x\\rangle = \\bar v/3$ and $\\langle v_x^2\\rangle = kT/m$', '$\\langle v_x\\rangle = 0$ and $\\langle v_x^2\\rangle = kT/m$'], answer: 3,
      sol: 'Each component has a Gaussian distribution centred on zero (molecules move left as often as right), so $\\langle v_x\\rangle = 0$. Equipartition: $\\tfrac12 m\\langle v_x^2\\rangle = \\tfrac12 kT$, so $\\langle v_x^2\\rangle = kT/m$, one third of $\\langle v^2\\rangle = 3kT/m$.' },
    { id: 'kth-017', type: 'nat', level: 2, exams: ['jam'], sub: 'equipartition', unit: '$10^{-21}$ J',
      q: 'The average total energy of one molecule of a rigid diatomic ideal gas at $400$ K is ______ $\\times10^{-21}$ J.',
      answer: 13.81, tol: 0.1, calc: () => 2.5 * C.kB * 400 * 1e21,
      sol: 'Five quadratic terms (3 translation + 2 rotation), each $\\tfrac12 kT$: $\\langle E\\rangle = \\tfrac52 kT = 2.5\\times1.381\\times10^{-23}\\times400 = 1.381\\times10^{-20}$ J $= 13.81\\times10^{-21}$ J.',
      trap: 'Using $\\tfrac32 kT$, which is only the translational part.' },
    { id: 'kth-025', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'real gases',
      q: 'The compressibility factor $Z_c = P_cV_c/RT_c$ at the critical point of a van der Waals gas is',
      options: ['$8/3$', '$3/8$', '$1$', '$3/4$'], answer: 1,
      sol: 'For the van der Waals gas $V_c = 3b$, $P_c = a/27b^2$, $T_c = 8a/27Rb$. So $Z_c = \\dfrac{(a/27b^2)(3b)}{R\\cdot 8a/27Rb} = \\dfrac{3}{8}$. Real gases have $Z_c \\approx 0.23$–$0.31$, one sign that the model is only approximate.',
      trap: '$Z = 1$ is the ideal-gas value, not the critical one.' },

    // ---- level 3 ----
    { id: 'kth-015', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'equipartition',
      q: 'At a temperature high enough for all vibrational modes to be fully excited (but no dissociation), the classical molar $C_V$ of carbon dioxide (linear, O=C=O) is',
      options: ['$\\tfrac{15}{2}R$', '$6R$', '$\\tfrac{13}{2}R$', '$\\tfrac72 R$'], answer: 2,
      sol: 'A linear molecule of $N = 3$ atoms has 3 translations, 2 rotations and $3N - 5 = 4$ vibrational modes. Translations and rotations give $\\tfrac12 R$ each; each vibration gives $R$ (kinetic plus potential). $C_V = \\tfrac32 R + R + 4R = \\tfrac{13}{2}R$.',
      trap: '$6R$ is the answer for a non-linear triatomic (3 rotations, 3 vibrations). Linear molecules have one rotation fewer and one vibration more.' },
    { id: 'kth-018', type: 'nat', level: 3, exams: ['jam'], sub: 'Maxwell speeds', unit: 'm/s',
      q: 'The mean speed of oxygen molecules ($M = 32$ g/mol) at $400$ K is ______ m/s.',
      answer: 514, tol: 5, calc: () => Math.sqrt(8 * 8.314 * 400 / (Math.PI * 0.032)),
      sol: '$\\bar v = \\sqrt{8RT/\\pi M} = \\sqrt{8\\times8.314\\times400/(\\pi\\times0.032)} = \\sqrt{2.646\\times10^5} \\approx 514$ m/s.',
      trap: 'Using $\\sqrt{3RT/M}$ (the rms speed, 558 m/s) when the mean speed is asked.' },
    { id: 'kth-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'Maxwell speeds',
      q: 'At what temperature do hydrogen molecules ($M = 2$) have the same rms speed as oxygen molecules ($M = 32$) at $47\\,^\\circ$C?',
      options: ['$20$ K', '$2.9$ K', '$80$ K', '$1280$ K'], answer: 0,
      sol: 'Equal $v_{\\rm rms}$ means equal $T/M$. $T_{\\rm O_2} = 320$ K, so $T_{\\rm H_2} = 320\\times 2/32 = 20$ K.',
      trap: '$2.9$ K comes from using $47$ instead of $320$; $80$ K from using $\\sqrt{M}$ instead of $M$.' },
    { id: 'kth-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'Maxwell speeds',
      q: 'At what temperature is the most probable speed of a gas equal to its rms speed at $300$ K?',
      options: ['$200$ K', '$367$ K', '$600$ K', '$450$ K'], answer: 3,
      sol: '$\\sqrt{2kT/m} = \\sqrt{3k(300)/m}$ gives $2T = 900$, so $T = 450$ K.',
      trap: '$200$ K reverses the ratio: the most probable speed is the smaller one, so the gas must be hotter.' },
    { id: 'kth-021', type: 'nat', level: 3, exams: ['jam'], sub: 'mean free path', unit: '$10^9$ s$^{-1}$',
      q: 'In a gas the mean free path is $68$ nm and the mean speed is $470$ m/s. The average number of collisions a molecule makes per second is ______ $\\times10^9$.',
      answer: 6.91, tol: 0.07, calc: () => 470 / 68e-9 / 1e9,
      sol: 'In one second a molecule travels $\\bar v = 470$ m, in steps of average length $\\lambda$. Collision frequency $z = \\bar v/\\lambda = 470/(6.8\\times10^{-8}) \\approx 6.91\\times10^9$ s$^{-1}$.',
      trap: 'Using the relative speed $\\sqrt2\\bar v$ here would count the $\\sqrt2$ twice: it is already inside the definition of $\\lambda$.' },
    { id: 'kth-022', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'transport', format: 'multi',
      q: 'Elementary kinetic theory gives the viscosity of a dilute gas as $\\eta = \\tfrac13 n m\\bar v\\lambda$. Which conclusions follow for a hard-sphere gas?',
      options: ['$\\eta$ does not depend on the pressure at fixed temperature', '$\\eta$ grows as $\\sqrt T$', '$\\eta$ falls as the temperature rises, as for liquids', 'The ratio $\\kappa/(\\eta c_v)$ of thermal conductivity to viscosity times specific heat (per unit mass) is a pure number of order 1'], answer: [0, 1, 3],
      sol: 'A: $n\\lambda = 1/(\\sqrt2\\pi d^2)$ is fixed, so $\\eta = m\\bar v/(3\\sqrt2\\pi d^2)$ has no $n$ in it (Maxwell\'s surprising result). B: $\\bar v \\propto \\sqrt T$. C: false for gases; liquid viscosity falls with $T$ for a different reason. D: elementary theory gives $\\kappa = \\eta c_v$ (ratio 1); the exact Chapman–Enskog result for monatomic gases is 2.5.',
      trap: 'Expecting a denser gas to be more viscous. More molecules carry momentum, but each travels a proportionally shorter distance.' },
    { id: 'kth-023', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'effusion',
      q: 'Gas at temperature $T$ leaks through a tiny hole into vacuum. The average kinetic energy of the molecules that come out is',
      options: ['$\\tfrac52 kT$', '$2kT$', '$\\tfrac32 kT$', '$kT$'], answer: 1,
      sol: 'The number crossing the hole per second with speed $v$ is proportional to $v f(v)$, so fast molecules are over-represented. $\\langle E\\rangle_{\\rm eff} = \\dfrac{\\int \\tfrac12 m v^2\\, v f(v)\\,dv}{\\int v f(v)\\,dv} = \\dfrac{\\tfrac12 m\\langle v^3\\rangle}{\\langle v\\rangle} = 2kT$.',
      trap: '$\\tfrac32 kT$ is the average inside the box. The escaping beam is weighted by speed.' },
    { id: 'kth-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'real gases', unit: 'K',
      q: 'A gas obeys the van der Waals equation with $a = 0.364$ Pa m$^6$ mol$^{-2}$ and $b = 4.27\\times10^{-5}$ m$^3$ mol$^{-1}$. Its critical temperature is ______ K.',
      answer: 303.8, tol: 3, calc: () => 8 * 0.364 / (27 * 8.314 * 4.27e-5),
      sol: 'At the critical point $\\partial P/\\partial V = 0$ and $\\partial^2P/\\partial V^2 = 0$, which give $T_c = 8a/27Rb = \\dfrac{8\\times0.364}{27\\times8.314\\times4.27\\times10^{-5}} = \\dfrac{2.912}{9.585\\times10^{-3}} \\approx 304$ K.' },
    { id: 'kth-026', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'transport',
      q: 'In elementary kinetic theory the self-diffusion coefficient is $D = \\tfrac13\\bar v\\lambda$. If the absolute temperature of a gas is made four times larger at constant pressure, $D$ becomes',
      options: ['$4$ times larger', '$16$ times larger', '$8$ times larger', '$2$ times larger'], answer: 2,
      sol: '$\\bar v \\propto T^{1/2}$ and, at fixed pressure, $\\lambda = kT/(\\sqrt2\\pi d^2P) \\propto T$. So $D \\propto T^{3/2}$, and $4^{3/2} = 8$.',
      trap: 'Taking $\\lambda$ as constant gives 2; that is true only at fixed density.' },
    { id: 'kth-027', type: 'nat', level: 3, exams: ['jam'], sub: 'equipartition',
      q: 'A mixture contains 2 mol of a monatomic gas and 3 mol of a rigid diatomic gas. Its ratio $C_P/C_V$ is ______ (to two decimal places).',
      answer: 1.48, tol: 0.01, calc: () => { const cv = (2 * 1.5 + 3 * 2.5) / 5; return (cv + 1) / cv; },
      sol: '$C_V = (2\\times\\tfrac32 + 3\\times\\tfrac52)R/5 = 10.5R/5 = 2.1R$. $C_P = C_V + R = 3.1R$. $\\gamma = 3.1/2.1 \\approx 1.48$.',
      trap: 'Weighting the $\\gamma$ values by moles gives $1.51$, which is wrong.' },
    { id: 'kth-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'pressure and temperature',
      q: 'The ratio of the speed of sound in a diatomic ideal gas ($\\gamma = 1.4$) to the rms speed of its molecules is closest to',
      options: ['$0.68$', '$1.46$', '$0.82$', '$1.00$'], answer: 0,
      sol: '$v_s = \\sqrt{\\gamma RT/M}$ and $v_{\\rm rms} = \\sqrt{3RT/M}$, so the ratio is $\\sqrt{\\gamma/3} = \\sqrt{0.467} \\approx 0.68$. Sound is carried by molecular motion, so it cannot be much faster than the molecules.' },
    { id: 'kth-029', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'Maxwell speeds', format: 'multi',
      q: 'For an ideal gas in equilibrium at temperature $T$, which statements are correct?',
      options: ['The fraction of molecules with speeds between $v$ and $v + dv$ does not depend on the pressure', 'The mean speed is larger than the rms speed', 'The average of $1/v$ is larger than $1/\\bar v$', 'The most probable kinetic energy equals $\\tfrac12 m v_{\\rm mp}^2$'], answer: [0, 2],
      sol: 'A: $f(v)$ contains only $m$ and $T$. B: false, $\\bar v < v_{\\rm rms}$ always (the rms weights fast molecules more). C: $\\langle 1/v\\rangle = \\sqrt{2m/\\pi kT}$, so $\\langle 1/v\\rangle\\,\\bar v = 4/\\pi > 1$. D: $\\tfrac12 m v_{\\rm mp}^2 = kT$, but the most probable energy is $\\tfrac12 kT$.',
      trap: 'D looks like a definition, but a distribution in $E$ peaks at a different place from the distribution in $v$.' },

    // ---- level 4 ----
    { id: 'kth-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'effusion', unit: '$10^{18}$ s$^{-1}$',
      q: 'Argon ($M = 40$ g/mol) at $300$ K and $100$ Pa is in a vessel with a pinhole of area $1.0$ mm$^2$ opening into vacuum. Atoms escape at a rate of ______ $\\times10^{18}$ per second.',
      answer: 2.41, tol: 0.03, calc: () => { const n = 100 / (C.kB * 300), v = Math.sqrt(8 * 8.314 * 300 / (Math.PI * 0.04)); return n * v * 1e-6 / 4 / 1e18; },
      sol: '$n = P/kT = 100/(1.381\\times10^{-23}\\times300) = 2.414\\times10^{22}$ m$^{-3}$. $\\bar v = \\sqrt{8RT/\\pi M} = 398.5$ m/s. Rate $= \\tfrac14 n\\bar v A = \\tfrac14(2.414\\times10^{22})(398.5)(10^{-6}) \\approx 2.41\\times10^{18}$ s$^{-1}$.',
      trap: 'Using $n\\bar v A$ without the $\\tfrac14$: only molecules moving towards the wall, and at an angle, cross it.' },
    { id: 'kth-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Maxwell speeds',
      q: 'For a Maxwellian gas, the product $\\langle v\\rangle\\,\\langle 1/v\\rangle$ equals',
      options: ['$1$', '$\\pi/4$', '$2/\\sqrt\\pi$', '$4/\\pi$'], answer: 3,
      sol: 'With $f(v) = 4\\pi(\\beta/\\pi)^{3/2}v^2e^{-\\beta v^2}$, $\\beta = m/2kT$: $\\langle 1/v\\rangle = 4\\pi(\\beta/\\pi)^{3/2}\\cdot\\frac{1}{2\\beta} = 2\\sqrt{\\beta/\\pi}$, and $\\langle v\\rangle = 2/\\sqrt{\\pi\\beta}$. The product is $4/\\pi \\approx 1.27$, independent of $T$ and $m$.',
      trap: 'Assuming $\\langle 1/v\\rangle = 1/\\langle v\\rangle$. Averages of non-linear functions are not functions of averages.' },
    { id: 'kth-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Maxwell speeds',
      q: 'For a Maxwell speed distribution $f(v)$, the ratio $f(v_{\\rm rms})/f(v_{\\rm mp})$ is ______ (to two decimal places).',
      answer: 0.91, tol: 0.01, calc: () => 1.5 * Math.exp(-0.5),
      sol: '$f(v) \\propto v^2e^{-v^2/v_{\\rm mp}^2}$. With $v_{\\rm rms}^2 = \\tfrac32 v_{\\rm mp}^2$: ratio $= \\tfrac32\\,e^{-3/2}/e^{-1} = 1.5\\,e^{-1/2} \\approx 0.91$.' },
    { id: 'kth-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Maxwell speeds', format: 'multi',
      q: 'For molecules of mass $m$ in a Maxwellian gas at temperature $T$, which of these equal $kT/m$?',
      options: ['$\\langle v_x^2\\rangle$', '$v_{\\rm mp}^2/2$', '$\\pi\\bar v^2/8$', '$\\langle |v_x|\\rangle^2$'], answer: [0, 1, 2],
      sol: 'A: equipartition. B: $v_{\\rm mp}^2 = 2kT/m$. C: $\\bar v^2 = 8kT/\\pi m$, times $\\pi/8$ gives $kT/m$. D: $\\langle|v_x|\\rangle = \\sqrt{2kT/\\pi m}$, so its square is $2kT/\\pi m \\approx 0.64\\,kT/m$.' },
    { id: 'kth-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'real gases',
      q: 'For a van der Waals gas, the ratio of the Boyle temperature to the critical temperature is',
      options: ['$3/8$', '$27/8$', '$8/27$', '$2$'], answer: 1,
      sol: 'Expand: $PV/RT \\approx 1 + (b - a/RT)/V$. The second virial coefficient vanishes at $T_B = a/Rb$. With $T_c = 8a/27Rb$, $T_B/T_c = 27/8 \\approx 3.4$.',
      trap: 'The inversion temperature $2a/Rb$ is twice the Boyle temperature; do not mix them up.' },
    { id: 'kth-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'equipartition',
      q: 'The molar $C_V$ of hydrogen gas is measured from about 30 K to 5000 K. Plotted against $\\log T$, $C_V/R$ shows plateaus at about',
      options: ['$1.5$, then $3$, then $4.5$', '$3$, then $5$, then $7$', '$1.5$, then $2.5$, then $3.5$', '$2.5$, then $3.5$, then $4.5$'], answer: 2,
      sol: 'At low $T$ only translation is active ($\\tfrac32$). Rotation switches on near $k T \\sim \\hbar^2/I$ (around 100 K for H$_2$), adding 1 ($\\tfrac52$). Vibration switches on at a few thousand kelvin, adding 1 more ($\\tfrac72$). Quantised energy levels freeze out modes whose spacing is much larger than $kT$, which classical equipartition cannot explain.',
      trap: 'Option B counts in units of $R/2$, not $R$.' },
    { id: 'kth-036', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'transport', unit: 'nm',
      q: 'A gas of density $1.2$ kg/m$^3$ has a mean molecular speed of $460$ m/s and viscosity $1.8\\times10^{-5}$ Pa s. Using $\\eta = \\tfrac13\\rho\\bar v\\lambda$, the mean free path is ______ nm.',
      answer: 97.8, tol: 1, calc: () => 3 * 1.8e-5 / (1.2 * 460) * 1e9,
      sol: '$\\lambda = 3\\eta/(\\rho\\bar v) = 5.4\\times10^{-5}/552 = 9.78\\times10^{-8}$ m $\\approx 97.8$ nm. Here $\\rho = nm$ is the mass density.' },
    { id: 'kth-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Maxwell speeds',
      q: 'Molecules of mass $m$ move freely on a flat surface (a two-dimensional ideal gas) at temperature $T$. Their most probable speed is',
      options: ['$\\sqrt{kT/m}$', '$\\sqrt{2kT/m}$', '$\\sqrt{\\pi kT/2m}$', '$\\sqrt{3kT/m}$'], answer: 0,
      sol: 'In 2D the number of velocity states between $v$ and $v + dv$ is $2\\pi v\\,dv$, so $f(v) \\propto v\\,e^{-mv^2/2kT}$. Setting $df/dv = 0$: $1 - mv^2/kT = 0$, so $v_{\\rm mp} = \\sqrt{kT/m}$. (Option C is the 2D mean speed.)',
      trap: 'Using the 3D factor $v^2$: the power of $v$ comes from the dimension of velocity space.' },

    // ---- level 5 ----
    { id: 'kth-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Maxwell speeds',
      q: 'The fraction of molecules in a Maxwellian gas with speeds <b>below</b> the most probable speed is ______ (to two decimal places).',
      answer: 0.43, tol: 0.01, calc: () => erf(1) - (2 / Math.sqrt(Math.PI)) * Math.exp(-1),
      sol: 'With $x = v/v_{\\rm mp}$, $f\\,dv = \\frac{4}{\\sqrt\\pi}x^2e^{-x^2}dx$. Integrate by parts: $\\int_0^1 \\frac{4}{\\sqrt\\pi}x^2e^{-x^2}dx = \\mathrm{erf}(1) - \\frac{2}{\\sqrt\\pi}e^{-1} = 0.8427 - 0.4151 \\approx 0.43$. Fewer than half are below the peak because the tail on the fast side is long.',
      trap: 'Answering 0.5 by thinking of the peak as the median.' },
    { id: 'kth-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'effusion',
      q: 'A thermally insulated vessel holds an ideal monatomic gas, which slowly effuses through a pinhole into vacuum. When half of the atoms have escaped, the ratio of the final to the initial temperature of the gas left inside is ______ (to two decimal places).',
      answer: 0.79, tol: 0.01, calc: () => Math.pow(0.5, 1 / 3),
      sol: 'Each escaping atom carries $2kT$ on average (the effusion bias), more than the $\\tfrac32 kT$ average inside. Energy balance for $U = \\tfrac32 NkT$: $d(\\tfrac32 NkT) = 2kT\\,dN$, so $\\tfrac32 N\\,dT = \\tfrac12 T\\,dN$, i.e. $dT/T = \\tfrac13\\,dN/N$. Then $T \\propto N^{1/3}$ and $T_f/T_i = (1/2)^{1/3} \\approx 0.79$.',
      trap: 'Assuming the temperature stays constant because the escaping gas does no work: the fast atoms leave first, so the remaining gas cools.' },
    { id: 'kth-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'mean free path',
      q: 'A mixture of helium ($M = 4$) and argon ($M = 40$) is at temperature $T$. The mean relative speed of a He–Ar pair divided by the mean speed of a helium atom is closest to',
      options: ['$1.41$', '$3.32$', '$1.00$', '$1.05$'], answer: 3,
      sol: 'The relative velocity of two Maxwellian molecules is itself Maxwellian with the reduced mass $\\mu = m_1m_2/(m_1 + m_2)$, so $\\bar v_{\\rm rel} = \\sqrt{8kT/\\pi\\mu}$. Ratio $= \\sqrt{m_{\\rm He}/\\mu} = \\sqrt{(m_{\\rm He} + m_{\\rm Ar})/m_{\\rm Ar}} = \\sqrt{44/40} \\approx 1.05$. Heavy argon atoms are almost at rest relative to fast helium.',
      trap: '$\\sqrt2$ holds only for two molecules of the same mass.' },
    { id: 'kth-041', type: 'msq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'pressure and temperature', format: 'multi',
      q: 'An ideal gas column stands in uniform gravity $g$ at a single temperature $T$ everywhere (isothermal atmosphere). Which statements are correct?',
      options: ['The number density falls with height as $e^{-mgz/kT}$', 'The speed distribution of molecules at height $z$ is the same Maxwell distribution as at the ground', 'Molecules high up have a smaller mean kinetic energy, because they had to climb', 'Heavier molecules have a smaller scale height $kT/mg$'], answer: [0, 1, 3],
      sol: 'The Boltzmann factor $e^{-(\\frac12 mv^2 + mgz)/kT}$ factorises into a speed part and a height part. So the speed distribution (and the mean energy $\\tfrac32 kT$) is the same at every height, while the density falls as $e^{-mgz/kT}$ with scale height $kT/mg$. Slow molecules do not get as high, which is why fewer arrive, not why those that arrive are slower.',
      trap: 'C sounds natural but contradicts equilibrium at one temperature: temperature measures mean kinetic energy.' },
    ...more2,
  ],
  gens: [
    { id: 'kth-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'Maxwell speeds', format: 'comparison',
      make(r) {
        const gas = Q5.choose(r, [['helium', 4], ['nitrogen', 28], ['argon', 40], ['oxygen', 32]]), T = Q5.int(r, 20, 120) * 5;
        const sp = { rms: ['v_{\\rm rms}', Math.sqrt(3)], avg: ['\\bar v', Math.sqrt(8 / Math.PI)], mp: ['v_{\\rm mp}', Math.SQRT2] };
        const [a, b] = Q5.choose(r, [['rms', 'mp'], ['rms', 'avg'], ['avg', 'mp'], ['mp', 'rms'], ['avg', 'rms'], ['mp', 'avg']]);
        const val = sp[a][1] / sp[b][1], s = (x) => `$${Q5.round(x, 3)}$`;
        const o = Q5.mcqOptions(r, val, [1 / val, 1.5, Math.sqrt(3), 1.225, 1.085, 1.128, 0.886].filter((x) => Math.abs(x - val) > 0.002), s);
        return { q: `For ${gas[0]} ($M = ${gas[1]}$ g/mol) at $${T}$ K, the ratio $${sp[a][0]}/${sp[b][0]}$ is`, ...o,
          sol: `$v_{\\rm rms} = \\sqrt{3k_BT/m}$, $\\bar v = \\sqrt{8k_BT/\\pi m}$, $v_{\\rm mp} = \\sqrt{2k_BT/m}$. In any ratio $k_BT/m$ cancels, so the gas and temperature do not matter: the ratio is $\\sqrt3 : \\sqrt{8/\\pi} : \\sqrt2$ taken pairwise, here $${Q5.round(val, 3)}$.`,
          trap: 'The gas and the temperature are distractors; and $v_{\\rm mp} < \\bar v < v_{\\rm rms}$ always.' };
      } },
    { id: 'kth-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'equipartition', format: 'statements',
      make(r) {
        const [name, f] = Q5.choose(r, [['a monatomic ideal gas', 3], ['a diatomic ideal gas with rotation but no vibration', 5], ['a diatomic ideal gas with vibration fully excited', 7], ['an ideal gas of rigid non-linear polyatomic molecules', 6]]);
        const T = [`$C_V = ${f / 2}R$ per mole.`, `$\\gamma = C_P/C_V = ${q5frac(f + 2, f)}$.`, '$C_P - C_V = R$ per mole.', `The internal energy of one mole at temperature $T$ is $${f / 2}RT$.`];
        const F = [`$C_V = ${(f + 2) / 2}R$ per mole.`, `$\\gamma = C_P/C_V = ${q5frac(f, f + 2)}$.`, `$C_P - C_V = ${f / 2}R$ per mole.`, `The internal energy of one mole at temperature $T$ is $${(f + 2) / 2}RT$.`];
        const o = q5msq(r, T, F);
        return { q: `For ${name}, using the equipartition theorem, which statements are correct?`, ...o,
          sol: `Count quadratic energy terms per molecule: $f = ${f}$ (${f === 3 ? '3 translational' : f === 5 ? '3 translational + 2 rotational' : f === 7 ? '3 translational + 2 rotational + 2 vibrational (kinetic and potential)' : '3 translational + 3 rotational'}). Each gives $\\tfrac12k_BT$, so $U = \\tfrac{${f}}{2}RT$ per mole, $C_V = ${f / 2}R$, $C_P = C_V + R = ${(f + 2) / 2}R$ (Mayer's relation holds for every ideal gas) and $\\gamma = (f + 2)/f = ${q5frac(f + 2, f)}$.`,
          trap: 'A vibration counts twice (kinetic and potential energy); a linear molecule has only two rotations.' };
      } },
    { id: 'kth-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'equipartition',
      make(r) {
        const n1 = Q5.int(r, 1, 5), n2 = Q5.int(r, 1, 5);
        const Cv = (1.5 * n1 + 2.5 * n2) / (n1 + n2), g = 1 + 1 / Cv;
        return { q: `A mixture contains $${n1}$ mol of a monatomic ideal gas and $${n2}$ mol of a diatomic ideal gas (rigid molecules). The ratio $\\gamma = C_P/C_V$ for the mixture is ______ (to three decimal places).`,
          answer: Q5.round(g, 3), tol: 0.001, n1, n2,
          sol: `Heat capacities add mole by mole: $C_V = \\dfrac{${n1}\\times\\tfrac32R + ${n2}\\times\\tfrac52R}{${n1 + n2}} = ${Q5.round(Cv, 4)}R$ per mole, and $C_P = C_V + R$. So $\\gamma = 1 + R/C_V = ${Q5.round(g, 3)}$.`,
          trap: 'Do not average the two values of $\\gamma$; average the heat capacities.' };
      },
      verify: (p) => { const Cp = p.n1 * 2.5 + p.n2 * 3.5, Cv = p.n1 * 1.5 + p.n2 * 2.5; return Cp / Cv; } },
    { id: 'kth-t24', type: 'mcq', level: 3, exams: ['jam'], sub: 'Maxwell speeds', format: 'graph',
      make(r) {
        const k = Q5.int(r, 2, 4), same = r() < 0.5;
        const o = Q5.mcqOptions(r, `$${same ? k * k : `1/${k * k}`}$`, [`$${k}$`, `$1/${k}$`, `$${same ? `1/${k * k}` : k * k}$`]);
        return { q: `Two Maxwell speed-distribution curves are drawn on one graph. Curve A peaks at a speed $${k}$ times that of curve B. ${same ? 'Both curves are for the same gas. The ratio $T_A/T_B$ of their temperatures is' : 'Both gases are at the same temperature. The ratio $m_A/m_B$ of their molecular masses is'}`, ...o,
          sol: `The peak is at $v_{\\rm mp} = \\sqrt{2k_BT/m}$. ${same ? `For one gas, $v_{\\rm mp} \\propto \\sqrt T$, so $T_A/T_B = ${k}^2 = ${k * k}$.` : `At one temperature, $v_{\\rm mp} \\propto 1/\\sqrt m$, so $m_A/m_B = 1/${k}^2 = 1/${k * k}$.`} (Curve A is also lower and broader, since the area under each curve is 1.)`,
          trap: 'The peak speed goes as a square root, so the factor is squared.' };
      } },
    { id: 'kth-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'mean free path', unit: 'Pa',
      make(r) {
        const lam = Q5.pick(r, 0.5, 50, 0.5), d = Q5.pick(r, 2, 4, 0.1), T = Q5.int(r, 200, 500);
        const p = 1.380649e-23 * T / (Math.SQRT2 * Math.PI * (d * 1e-10) ** 2 * lam * 1e-6);
        return { q: `In a gas of molecules of diameter $${d}$ Å at $${T}$ K, the mean free path is $${lam}\\ \\mu$m. Using $\\lambda = 1/(\\sqrt2\\,\\pi d^2 n)$, the pressure is ______ Pa (to three significant figures; $k_B = 1.381\\times10^{-23}$ J/K).`,
          answer: +p.toPrecision(3), tol: +(0.006 * p).toPrecision(2), lam, d, T,
          sol: `$p = nk_BT$ with $n = 1/(\\sqrt2\\pi d^2\\lambda)$: $p = \\dfrac{k_BT}{\\sqrt2\\pi d^2\\lambda} = \\dfrac{1.381\\times10^{-23}\\times${T}}{\\sqrt2\\pi(${d}\\times10^{-10})^2\\times${lam}\\times10^{-6}} = ${+p.toPrecision(3)}$ Pa.`,
          trap: 'The diameter is squared; convert Å and $\\mu$m to metres first.' };
      },
      verify: (p) => { const n = 1 / (Math.SQRT2 * Math.PI * (p.d * 1e-10) ** 2 * (p.lam * 1e-6)); return n * 1.380649e-23 * p.T; } },
    { id: 'kth-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'Maxwell speeds',
      make(r) {
        const [gas, M] = choose(r, [['helium', 4], ['neon', 20], ['nitrogen', 28], ['oxygen', 32], ['argon', 40], ['carbon dioxide', 44], ['hydrogen', 2]]);
        const T = int(r, 20, 120) * 5;
        const answer = Math.sqrt(3 * 8.314 * T / (M / 1000));
        return { q: `The rms speed of ${gas} molecules ($M = ${M}$ g/mol) at $${T}$ K is ______ m/s ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
          answer: round(answer, 0), tol: Math.max(2, round(answer * 0.01, 0)), unit: 'm/s', M, T,
          sol: `$v_{\\rm rms} = \\sqrt{3RT/M} = \\sqrt{3\\times8.314\\times${T}/${M / 1000}} \\approx ${round(answer, 0)}$ m/s.`,
          trap: 'The molar mass must be in kg/mol.' };
      },
      verify: (p) => Math.sqrt(3 * 8.314 * p.T / (p.M / 1000)) },
    { id: 'kth-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'Maxwell speeds',
      make(r) {
        const [kind, k, f] = choose(r, [['most probable', 2, '\\sqrt{2RT/M}'], ['mean', 8 / Math.PI, '\\sqrt{8RT/\\pi M}'], ['rms', 3, '\\sqrt{3RT/M}']]);
        const M = choose(r, [2, 4, 28, 32, 40]), T = int(r, 10, 80) * 10;
        const answer = Math.sqrt(k * 8.314 * T / (M / 1000));
        return { q: `The ${kind} speed of molecules of a gas with $M = ${M}$ g/mol at $${T}$ K is ______ m/s.`,
          answer: round(answer, 0), tol: Math.max(2, round(answer * 0.01, 0)), unit: 'm/s', k, M, T,
          sol: `The ${kind} speed is $${f}$. With $M = ${M / 1000}$ kg/mol and $T = ${T}$ K this is $\\approx ${round(answer, 0)}$ m/s.`,
          trap: 'Three different speeds, three different numbers under the root: 2 (most probable), $8/\\pi$ (mean), 3 (rms).' };
      },
      verify: (p) => Math.sqrt(p.k * 8.314 * p.T / (p.M / 1000)) },
    { id: 'kth-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'mean free path',
      make(r) {
        const d = pick(r, 2.5, 4.0, 0.1), T = int(r, 25, 80) * 10, P = choose(r, [1, 10, 100, 1000, 10000, 101325]);
        const lam = C.kB * T / (Math.SQRT2 * Math.PI * (d * 1e-10) ** 2 * P); // m
        const um = lam * 1e6;
        return { q: `Molecules of diameter $${d}\\times10^{-10}$ m form a gas at $${T}$ K and $${P}$ Pa. The mean free path is ______ μm.`,
          answer: um, tol: Math.abs(um) * 0.01, unit: 'μm', d, T, P,
          sol: `$\\lambda = \\dfrac{kT}{\\sqrt2\\,\\pi d^2P} = \\dfrac{1.381\\times10^{-23}\\times${T}}{\\sqrt2\\,\\pi(${d}\\times10^{-10})^2\\times${P}} \\approx ${round(um, 4)}$ μm.`,
          trap: 'Use the diameter (not the radius), and remember the $\\sqrt2$ from the motion of the other molecules.' };
      },
      verify: (p) => C.kB * p.T / (Math.SQRT2 * Math.PI * (p.d * 1e-10) ** 2 * p.P) * 1e6 },
    { id: 'kth-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'equipartition',
      make(r) {
        const n1 = int(r, 1, 5), n2 = int(r, 1, 5), vib = r() < 0.3;
        const c2 = vib ? 3.5 : 2.5;
        const cv = (1.5 * n1 + c2 * n2) / (n1 + n2), g = (cv + 1) / cv;
        return { q: `A gas mixture contains ${n1} mol of a monatomic gas and ${n2} mol of a diatomic gas${vib ? ' whose vibration is fully excited' : ' (rigid molecules)'}. Its $C_P/C_V$ is ______ (to three decimal places).`,
          answer: round(g, 3), tol: 0.002, n1, n2, c2,
          sol: `$C_V = (${n1}\\times\\tfrac32 + ${n2}\\times${c2})R/${n1 + n2} = ${round(cv, 4)}R$, $C_P = C_V + R$, so $\\gamma = ${round(cv + 1, 4)}/${round(cv, 4)} \\approx ${round(g, 3)}$.`,
          trap: 'Average the heat capacities weighted by moles, never the $\\gamma$ values.' };
      },
      verify: (p) => { const cv = (1.5 * p.n1 + p.c2 * p.n2) / (p.n1 + p.n2); return (cv + 1) / cv; } },
    { id: 'kth-g05', type: 'mcq', level: 2, exams: ['jam'], sub: 'Maxwell speeds',
      make(r) {
        const M1 = choose(r, [2, 4, 16]), M2 = choose(r, [28, 32, 44]), T1 = int(r, 2, 8) * 50, T2 = int(r, 2, 8) * 50;
        const ratio = Math.sqrt((T1 / M1) / (T2 / M2));
        const show = (v) => `$${round(v, 2)}$`;
        const o = mcqOptions(r, ratio, [Math.sqrt(M1 / M2 * T1 / T2), (T1 / M1) / (T2 / M2), Math.sqrt(T1 / T2), Math.sqrt(M2 / M1)], show);
        return { q: `Gas A ($M = ${M1}$ g/mol) is at $${T1}$ K and gas B ($M = ${M2}$ g/mol) at $${T2}$ K. The ratio $v_{\\rm rms,A}/v_{\\rm rms,B}$ is`, ...o,
          sol: `$v_{\\rm rms} \\propto \\sqrt{T/M}$, so the ratio is $\\sqrt{(${T1}/${M1})/(${T2}/${M2})} \\approx ${round(ratio, 2)}$.`,
          trap: 'The speed goes as the square root of $T/M$: no square root, or $M$ upside down, are the tempting errors.' };
      } },
    { id: 'kth-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'effusion',
      make(r) {
        const [a, Ma] = choose(r, [['helium', 4], ['hydrogen', 2], ['methane', 16], ['neon', 20]]);
        const [b, Mb] = choose(r, [['oxygen', 32], ['argon', 40], ['carbon dioxide', 44], ['krypton', 84]]);
        const t = int(r, 20, 90);
        const answer = t * Math.sqrt(Ma / Mb);
        return { q: `At the same temperature and pressure, a fixed number of ${b} molecules ($M = ${Mb}$) takes $${t}$ s to effuse through a pinhole. The same number of ${a} molecules ($M = ${Ma}$) takes ______ s.`,
          answer: round(answer, 2), tol: Math.max(0.05, round(answer * 0.01, 2)), unit: 's', t, Ma, Mb,
          sol: `The effusion rate is $\\tfrac14 n\\bar v \\propto 1/\\sqrt M$, so the time for a fixed number goes as $\\sqrt M$: $t = ${t}\\sqrt{${Ma}/${Mb}} \\approx ${round(answer, 2)}$ s.`,
          trap: 'The lighter gas is faster, so its time is shorter: check that your answer is less than ' + t + ' s.' };
      },
      verify: (p) => p.t * Math.sqrt(p.Ma / p.Mb) },
    { id: 'kth-g07', type: 'nat', level: 2, exams: ['jam'], sub: 'pressure and temperature',
      make(r) {
        const n = pick(r, 1, 5, 0.5), m = pick(r, 3, 7, 0.5), v = int(r, 30, 70) * 10;
        const P = (1 / 3) * n * 1e25 * m * 1e-26 * v * v / 1000;
        return { q: `A gas has $${n}\\times10^{25}$ molecules per m$^3$, each of mass $${m}\\times10^{-26}$ kg, with rms speed $${v}$ m/s. The pressure is ______ kPa.`,
          answer: round(P, 2), tol: Math.max(0.05, round(P * 0.01, 2)), unit: 'kPa', n, m, v,
          sol: `$P = \\tfrac13 n m v_{\\rm rms}^2 = \\tfrac13(${n}\\times10^{25})(${m}\\times10^{-26})(${v})^2 \\approx ${round(P * 1000, 0)}$ Pa $= ${round(P, 2)}$ kPa.`,
          trap: 'Do not forget the $\\tfrac13$.' };
      },
      verify: (p) => (1 / 3) * p.n * 1e25 * p.m * 1e-26 * p.v ** 2 / 1000 },
    { id: 'kth-g08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'real gases',
      make(r) {
        const a = pick(r, 0.10, 0.60, 0.01), b = pick(r, 2.5, 6.0, 0.05);
        const want = choose(r, ['Tc', 'TB', 'Ti']);
        const Tc = 8 * a / (27 * 8.314 * b * 1e-5), TB = a / (8.314 * b * 1e-5), Ti = 2 * TB;
        const answer = { Tc, TB, Ti }[want];
        const name = { Tc: 'critical temperature', TB: 'Boyle temperature', Ti: 'low-pressure Joule–Thomson inversion temperature' }[want];
        const f = { Tc: '8a/27Rb', TB: 'a/Rb', Ti: '2a/Rb' }[want];
        return { q: `For a van der Waals gas with $a = ${a}$ Pa m$^6$ mol$^{-2}$ and $b = ${b}\\times10^{-5}$ m$^3$ mol$^{-1}$, the ${name} is ______ K.`,
          answer: round(answer, 1), tol: round(answer * 0.01, 1), unit: 'K', a, b, want,
          sol: `The ${name} of a van der Waals gas is $${f} = ${round(answer, 1)}$ K.`,
          trap: 'Three temperatures in the ratio $T_c : T_B : T_i = 8/27 : 1 : 2$; know which is which.' };
      },
      verify: (p) => ({ Tc: 8 / 27, TB: 1, Ti: 2 })[p.want] * p.a / (8.314 * p.b * 1e-5) },
  ],
};
