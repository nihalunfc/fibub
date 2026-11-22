// Magnetic materials: magnetisation, bound currents, H and the free-current Ampere law, B = mu0(H + M),
// susceptibility and permeability, dia-, para- and ferromagnetism, Curie and Curie-Weiss laws, hysteresis,
// boundary conditions, uniformly magnetised spheres and rods, magnetic circuits with gaps.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const mu0 = C.mu0;
const muB = C.e * C.hbar / (2 * C.me); // 9.274e-24 J/T

import * as Q5 from '../_util.js';
import more2 from './magnetic-materials.more2.gen.js';
import r4 from './magnetic-materials.r4.gen.js';
import r5 from './magnetic-materials.r5.gen.js';

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
  topic: 'magnetic-materials',
  items: [
    // ---------- level 1 ----------
    { id: 'mgm-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'kinds of magnetism',
      q: 'The magnetic susceptibility of a diamagnetic material is',
      options: ['small and negative', 'small and positive', 'large and positive', 'exactly $-1$'], answer: 0,
      sol: 'In a diamagnet the applied field changes the orbital motion of electrons so that the induced moments oppose the field (a Lenz-law effect inside each atom). The magnetisation is opposite to $\\vec H$ and tiny: $\\chi_m \\sim -10^{-5}$ for water or copper.',
      trap: '$\\chi_m = -1$ is a perfect diamagnet: a superconductor, not an ordinary material.' },
    { id: 'mgm-002', type: 'nat', level: 1, exams: ['jam'], sub: 'H and B', unit: 'T',
      q: 'A long solenoid with 1000 turns per metre carries 2.0 A and is filled with a soft iron core of relative permeability 500 (take it as linear). The magnetic field $B$ inside is ______ T (to two decimal places).',
      answer: 1.26, tol: 0.01, calc: () => mu0 * 500 * 1000 * 2,
      sol: 'Ampère\'s law for $\\vec H$ uses only free current: $H = nI = 2000$ A/m, whatever the core. Then $B = \\mu_0\\mu_rH = (1.2566\\times10^{-6})(500)(2000) = 1.26$ T.',
      trap: 'Forgetting $\\mu_r$ and getting 2.5 mT, the field without the core.' },
    { id: 'mgm-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'H and B',
      q: 'The SI unit of the auxiliary field $\\vec H$ is',
      options: ['tesla', 'ampere per metre', 'weber', 'ampere square metre'], answer: 1,
      sol: '$\\oint\\vec H\\cdot d\\vec l = I_{f}$, so $H$ is a current divided by a length: A/m. The magnetisation $\\vec M$ (magnetic moment per volume, A m$^2$/m$^3$) has the same unit.',
      trap: 'Tesla is the unit of $\\vec B$; A m$^2$ is the unit of a magnetic moment.' },
    { id: 'mgm-004', type: 'msq', level: 1, exams: ['jam'], sub: 'kinds of magnetism',
      q: 'Which of these statements about ferromagnetic materials are correct?',
      options: ['They show hysteresis.', 'Above the Curie temperature they become paramagnetic.', 'Their susceptibility is a constant, independent of $H$.', 'They are divided into domains, each magnetised to saturation.'], answer: [0, 1, 3],
      sol: 'Ferromagnets are made of domains in which exchange forces line the atomic moments up. Applying $H$ grows favourable domains, a process with friction-like irreversibility (hysteresis). Heat above the Curie temperature destroys the order and leaves a paramagnet. Because $M$ depends on the history and saturates, $\\chi = M/H$ is not a constant.',
      trap: '"Constant $\\chi$" describes linear (dia- and para-) materials, not ferromagnets.' },
    { id: 'mgm-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'curie law',
      q: 'For an ideal paramagnet at ordinary fields, the susceptibility varies with absolute temperature $T$ as',
      options: ['$T$', '$T^2$', '$e^{-1/T}$', '$1/T$'], answer: 3,
      sol: 'Curie\'s law: $\\chi = C/T$. The field tries to line up the permanent moments, thermal agitation scrambles them; the net alignment is about $\\mu B/(k_BT)$, which falls as $1/T$.',
      trap: 'Diamagnetic susceptibility is almost independent of $T$; paramagnetic is not.' },
    { id: 'mgm-006', type: 'nat', level: 1, exams: ['jam'], sub: 'H and B', unit: 'mT',
      q: 'In a material, $H = 1000$ A/m and $M = 4000$ A/m, both pointing the same way. The magnetic field $B$ is ______ mT (to two decimal places).',
      answer: 6.28, tol: 0.06, calc: () => mu0 * 5000 * 1000,
      sol: '$\\vec B = \\mu_0(\\vec H + \\vec M) = (1.2566\\times10^{-6})(5000) = 6.28\\times10^{-3}$ T.',
      trap: 'Using $B = \\mu_0H$ and forgetting the magnetisation.' },
    // ---------- level 2 ----------
    { id: 'mgm-007', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'bound currents',
      q: 'A long cylinder is uniformly magnetised along its axis with magnetisation $M$. Its bound currents are',
      options: ['a volume current $M$ per unit area along the axis', 'surface currents $M$ (per unit length) on the flat end faces only', 'zero everywhere, since $\\vec M$ is uniform', 'a surface current $M$ per unit length circling the curved surface, and no volume current'], answer: 3,
      sol: '$\\vec J_b = \\nabla\\times\\vec M = 0$ for uniform $\\vec M$. $\\vec K_b = \\vec M\\times\\hat n$: on the curved side $\\hat n = \\hat s$, $\\hat z\\times\\hat s = \\hat\\phi$, so $K_b = M$ circling round; on the ends $\\hat n = \\pm\\hat z$ and the cross product is zero. The magnet is equivalent to a solenoid with $nI = M$.',
      trap: 'Uniform $\\vec M$ kills the volume current but not the surface current.' },
    { id: 'mgm-008', type: 'nat', level: 2, exams: ['jam'], sub: 'bound currents', unit: 'T',
      q: 'A long iron rod is uniformly magnetised along its length with $M = 8.0\\times10^5$ A/m, with no free current anywhere. Far from its ends, the field $B$ inside it is ______ T (to two decimal places).',
      answer: 1.01, tol: 0.01, calc: () => mu0 * 8e5,
      sol: 'The rod is like a long solenoid with surface current $K_b = M$, so inside $B = \\mu_0K_b = \\mu_0M = (1.2566\\times10^{-6})(8.0\\times10^5) = 1.01$ T.',
      trap: 'Thinking $B = 0$ because there is no free current. $\\vec H$ is zero there, not $\\vec B$.' },
    { id: 'mgm-009', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'H and B',
      q: 'For the long, uniformly magnetised rod with no free current, far from its ends, $\\vec H$ inside is',
      options: ['$\\vec M$', '$-\\vec M$', 'zero', '$\\vec M/3$'], answer: 2,
      sol: '$\\vec H = \\vec B/\\mu_0 - \\vec M = \\vec M - \\vec M = 0$. Near the ends of a finite rod, $\\vec H$ is not zero: it points backwards, against $\\vec M$ (the demagnetising field).',
      trap: 'Assuming $\\vec H$ always points along $\\vec B$.' },
    { id: 'mgm-010', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'boundary conditions',
      q: 'At the boundary between two magnetic materials with no free surface current, which field components are continuous?',
      options: ['The normal component of $\\vec B$', 'The tangential component of $\\vec H$', 'The tangential component of $\\vec B$', 'The normal component of $\\vec H$'], answer: [0, 1],
      sol: '$\\nabla\\cdot\\vec B = 0$ (a pillbox) makes $B_\\perp$ continuous. $\\nabla\\times\\vec H = \\vec J_f$ with no free surface current (a thin loop) makes $H_\\parallel$ continuous. The other two jump by the ratio of permeabilities.',
      trap: 'This is the mirror of the dielectric rules ($D_\\perp$, $E_\\parallel$), with $\\vec B$ playing $\\vec D$ and $\\vec H$ playing $\\vec E$.' },
    { id: 'mgm-011', type: 'nat', level: 2, exams: ['jam'], sub: 'curie law', unit: '$10^{-4}$',
      q: 'A paramagnetic salt obeying Curie\'s law has susceptibility $3.0\\times10^{-4}$ at 300 K. At 150 K its susceptibility is ______ $\\times10^{-4}$ (to one decimal place).',
      answer: 6.0, tol: 0.05, calc: () => 3 * 300 / 150,
      sol: '$\\chi = C/T$, so $\\chi_2 = \\chi_1T_1/T_2 = 3.0\\times10^{-4}\\times300/150 = 6.0\\times10^{-4}$.',
      trap: 'Halving instead of doubling: colder means better alignment, larger $\\chi$.' },
    { id: 'mgm-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'kinds of magnetism',
      q: 'A type-I superconductor in the Meissner state expels the magnetic field from its interior. Its effective magnetic susceptibility is',
      options: ['0', '$+1$', '$-1$', '$-10^{-5}$'], answer: 2,
      sol: '$B = \\mu_0(1 + \\chi)H = 0$ inside for any $H$ requires $\\chi = -1$: a perfect diamagnet, with $\\vec M = -\\vec H$. (Physically, surface supercurrents cancel the field.)',
      trap: '$-10^{-5}$ is ordinary diamagnetism, far weaker.' },
    { id: 'mgm-013', type: 'nat', level: 2, exams: ['jam'], sub: 'H and B', unit: 'A/m',
      q: 'A toroid of mean radius 10 cm has 500 turns carrying 0.50 A. The magnitude of $H$ along its mean circle is ______ A/m (to the nearest whole number).',
      answer: 398, tol: 4, calc: () => 500 * 0.5 / (2 * Math.PI * 0.1),
      sol: '$\\oint\\vec H\\cdot d\\vec l = NI$: $H(2\\pi r) = 250$ A, so $H = \\dfrac{250}{2\\pi(0.10)} = 398$ A/m. This holds whatever the core is made of; the core changes $B$, not $H$.',
      trap: 'Using the diameter instead of the radius, or multiplying by $\\mu_0$ (that would be $B$ without a core).' },
    { id: 'mgm-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'kinds of magnetism',
      q: 'Paramagnetism arises from',
      options: ['the alignment, against thermal agitation, of permanent atomic magnetic moments', 'currents induced in electron orbits by the applied field', 'exchange forces that line up neighbouring moments', 'free electrons moving in circles in the field'], answer: 0,
      sol: 'Atoms with unpaired electrons have permanent moments. An applied field gives them an energy $-\\vec\\mu\\cdot\\vec B$, so they lean towards the field; heat randomises them. The induced-orbit effect is diamagnetism (present in all materials, usually swamped), and exchange alignment is ferromagnetism.',
      trap: 'Free electrons give a small paramagnetism (Pauli) and diamagnetism (Landau), but the classic paramagnet is about permanent atomic moments.' },
    { id: 'mgm-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'hysteresis',
      q: 'The energy dissipated as heat per unit volume of a ferromagnet in one full cycle of magnetisation equals',
      options: ['the remanence times the coercivity', 'the area enclosed by its B-H loop', 'half the area under the initial magnetisation curve', 'the saturation field squared over $2\\mu_0$'], answer: 1,
      sol: 'The work done by the source per unit volume to change the field is $\\int H\\,dB$. Round a closed loop, this is the loop\'s area. Soft iron (thin loop) wastes little energy per cycle, which is why it is used in transformer cores.',
      trap: 'Remanence times coercivity has the right units but is only a rough estimate of the area (exactly a quarter of it for a perfectly rectangular loop).' },
    { id: 'mgm-016', type: 'nat', level: 2, exams: ['jam'], sub: 'atomic moments', unit: '$10^6$ A/m',
      q: 'Iron has about $8.5\\times10^{28}$ atoms per m$^3$, each with a moment of about 2.2 Bohr magnetons. If all were aligned, the magnetisation would be ______ $\\times10^6$ A/m (to two decimal places). ($\\mu_B = 9.27\\times10^{-24}$ J/T.)',
      answer: 1.73, tol: 0.02, calc: () => 8.5e28 * 2.2 * muB / 1e6,
      sol: '$M_s = N\\mu = (8.5\\times10^{28})(2.2)(9.27\\times10^{-24}) = 1.73\\times10^6$ A/m. Then $\\mu_0M_s \\approx 2.2$ T, close to the saturation field of real iron.',
      trap: 'Using one Bohr magneton per atom.' },
    // ---------- level 3 ----------
    { id: 'mgm-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetised sphere', unit: 'mT',
      q: 'A sphere is uniformly magnetised with $M = 1.0\\times10^5$ A/m. The magnetic field $B$ inside it is ______ mT (to one decimal place).',
      answer: 83.8, tol: 0.8, calc: () => 2 / 3 * mu0 * 1e5 * 1000,
      sol: 'The bound surface current $K_b = M\\sin\\theta\\,\\hat\\phi$ is that of a spinning charged sphere and gives a uniform field inside: $\\vec B = \\tfrac23\\mu_0\\vec M = \\tfrac23(1.2566\\times10^{-6})(10^5) = 8.38\\times10^{-2}$ T.',
      trap: 'Using $\\mu_0M$ (the long rod). The sphere\'s shape gives $\\tfrac23$ of that.' },
    { id: 'mgm-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'magnetised sphere',
      q: 'Inside a uniformly magnetised sphere (no free current), $\\vec H$ equals',
      options: ['$-\\vec M/3$', '$+\\vec M/3$', '$\\tfrac23\\vec M$', 'zero'], answer: 0,
      sol: '$\\vec H = \\vec B/\\mu_0 - \\vec M = \\tfrac23\\vec M - \\vec M = -\\tfrac13\\vec M$. Inside a magnet $\\vec H$ points backwards: this is the demagnetising field, with demagnetising factor $\\tfrac13$ for a sphere (0 for a long rod, 1 for a thin disc magnetised across).',
      trap: 'Taking $\\vec H$ parallel to $\\vec B$, which fails inside permanent magnets.' },
    { id: 'mgm-019', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'H and B',
      q: 'In a region filled with a uniform linear magnetic material of susceptibility $\\chi_m$ carrying free current density $\\vec J_f$, which statements are correct?',
      options: ['$\\nabla\\times\\vec H = \\vec J_f$', '$\\nabla\\cdot\\vec B = 0$', '$\\vec J_b = \\chi_m\\vec J_f$', '$\\nabla\\cdot\\vec H = 0$ everywhere, including at the material\'s surface'], answer: [0, 1, 2],
      sol: '$\\nabla\\times\\vec H = \\vec J_f$ in any static situation, and $\\nabla\\cdot\\vec B = 0$ always. With $\\vec M = \\chi_m\\vec H$ and $\\chi_m$ constant, $\\vec J_b = \\nabla\\times\\vec M = \\chi_m\\nabla\\times\\vec H = \\chi_m\\vec J_f$. But $\\nabla\\cdot\\vec H = -\\nabla\\cdot\\vec M$, which is not zero where $\\vec M$ changes suddenly, as at a surface.',
      trap: 'Uniform material is the key: in non-uniform material $\\vec J_b$ has an extra $\\nabla\\chi_m\\times\\vec H$ part.' },
    { id: 'mgm-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetic circuits', unit: 'T',
      q: 'An iron core ($\\mu_r = 2000$) has a mean path length of 0.50 m with an air gap of 1.0 mm cut in it. A winding of 200 turns carries 1.0 A. Neglecting fringing, the field in the gap is ______ T (to three decimal places).',
      answer: 0.201, tol: 0.002, calc: () => mu0 * 200 / (0.5 / 2000 + 1e-3),
      sol: '$B$ is the same in iron and gap (normal component continuous, no fringing). Ampère for $H$: $\\dfrac{B}{\\mu_0\\mu_r}l + \\dfrac{B}{\\mu_0}g = NI$, so $B = \\dfrac{\\mu_0NI}{l/\\mu_r + g} = \\dfrac{(1.2566\\times10^{-6})(200)}{2.5\\times10^{-4} + 1.0\\times10^{-3}} = 0.201$ T.',
      trap: 'Ignoring the 1 mm gap because it is short. Its reluctance is four times that of the whole half-metre of iron.' },
    { id: 'mgm-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'magnetic circuits',
      q: 'In an electromagnet made of high-permeability iron with a small air gap, the current needed for a given gap field is set mainly by',
      options: ['the length of the iron path', 'the cross-section of the iron', 'the conductivity of the iron', 'the length of the air gap'], answer: 3,
      sol: 'The reluctances add in series: iron $l/(\\mu_0\\mu_rA)$ and gap $g/(\\mu_0A)$. With $\\mu_r \\sim 10^3$, a gap of a millimetre outweighs a metre of iron, so $NI \\approx Bg/\\mu_0$. The [magnetic circuit solver](/science/magnetic-circuit/) shows the split for any core.',
      trap: 'The iron path is long but its reluctance is divided by $\\mu_r$.' },
    { id: 'mgm-022', type: 'nat', level: 3, exams: ['jam'], sub: 'hysteresis', unit: 'W',
      q: 'The B-H loop of a transformer core material encloses 300 J/m$^3$. A core of volume $1.0\\times10^{-3}$ m$^3$ is driven at 50 Hz. The power lost to hysteresis is ______ W.',
      answer: 15, tol: 0.1, calc: () => 300 * 1e-3 * 50,
      sol: 'Each cycle wastes (loop area) $\\times$ (volume) $= 300\\times10^{-3} = 0.30$ J. At 50 cycles per second: $P = 0.30\\times50 = 15$ W.',
      trap: 'Forgetting to multiply by the frequency, or by the volume.' },
    { id: 'mgm-023', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions',
      q: 'Field lines in air meet the flat surface of a soft iron block ($\\mu_r = 1000$) at $45^\\circ$ to the normal. Inside the iron the lines',
      options: ['run almost parallel to the surface', 'run almost along the normal', 'continue at $45^\\circ$', 'bend to about $22^\\circ$ from the normal'], answer: 0,
      sol: '$B_\\perp$ and $H_\\parallel$ continuous give $\\dfrac{\\tan\\theta_2}{\\tan\\theta_1} = \\dfrac{\\mu_2}{\\mu_1}$, so $\\tan\\theta_2 = 1000$, $\\theta_2 = 89.94^\\circ$: almost along the surface. Run backwards, lines leaving iron into air come out almost perpendicular to the iron surface, which is why iron pole faces behave like magnetic "equipotentials".',
      trap: 'Expecting the lines to straighten towards the normal in the denser medium, as light does.' },
    { id: 'mgm-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'curie law', unit: 'K',
      q: 'Above its Curie point, a ferromagnet follows the Curie-Weiss law $\\chi = C/(T - \\theta)$. Its susceptibility is 0.010 at 1100 K and 0.005 at 1150 K. The constant $\\theta$ is ______ K.',
      answer: 1050, tol: 1, calc: () => (2 * 1100 - 1150),
      sol: 'Dividing: $\\dfrac{0.010}{0.005} = \\dfrac{1150 - \\theta}{1100 - \\theta} = 2$, so $1150 - \\theta = 2200 - 2\\theta$ and $\\theta = 1050$ K. Then $C = 0.010\\times50 = 0.50$ K.',
      trap: 'Using Curie\'s law $C/T$, which would give inconsistent $C$ values.' },
    { id: 'mgm-025', type: 'msq', level: 3, exams: ['jam'], sub: 'kinds of magnetism',
      q: 'Which statements about diamagnetism are correct?',
      options: ['It is present in all materials.', 'Its susceptibility hardly depends on temperature.', 'A diamagnetic sample is pulled towards the region of stronger field.', 'It comes from the change in electron orbital motion induced by the applied field.'], answer: [0, 1, 3],
      sol: 'Every atom\'s electron orbits respond to an applied field by Lenz\'s law, giving a moment against the field, so all matter is diamagnetic (it is just masked in para- and ferromagnets). The effect does not rely on alignment against heat, so it is nearly independent of $T$. With $\\chi < 0$ the energy $-\\tfrac{\\chi}{2\\mu_0}B^2V$ is lowest where $B$ is weak, so diamagnets are pushed out of strong fields (levitated frogs).',
      trap: 'Paramagnets are pulled in; diamagnets are pushed out.' },
    { id: 'mgm-026', type: 'nat', level: 3, exams: ['jam'], sub: 'bound currents', unit: 'kA',
      q: 'A cylindrical bar magnet, uniformly magnetised along its axis with $M = 2.0\\times10^5$ A/m, is 10 cm long. The total bound current circulating round its curved surface is ______ kA.',
      answer: 20, tol: 0.1, calc: () => 2e5 * 0.1 / 1000,
      sol: '$K_b = M = 2.0\\times10^5$ A per metre of length. Over 0.10 m: $I_b = K_bL = 2.0\\times10^4$ A $= 20$ kA. A magnet is equivalent to a huge current, which is why it is easy to make strong fields with permanent magnets and hard with wires.',
      trap: 'Multiplying by the circumference: $K_b$ is current per unit length along the axis.' },
    { id: 'mgm-027', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'bound currents',
      q: 'A long cylinder (axis $z$) has magnetisation $\\vec M = k\\,s\\,\\hat\\phi$ in cylindrical coordinates, where $k$ is a constant. The bound volume current density is',
      options: ['$k\\,\\hat z$', '$k\\,\\hat\\phi$', '$2k\\,\\hat z$', 'zero'], answer: 2,
      sol: '$(\\nabla\\times\\vec M)_z = \\dfrac1s\\dfrac{\\partial}{\\partial s}(sM_\\phi) = \\dfrac1s\\dfrac{d}{ds}(ks^2) = 2k$. Other components vanish. So $\\vec J_b = 2k\\,\\hat z$. On the surface $\\vec K_b = \\vec M\\times\\hat s = -kR\\,\\hat z$; total current $2k\\pi R^2 - kR\\cdot2\\pi R = 0$, as for any bound current crossing a section.',
      trap: 'Forgetting the factor $1/s$ and the $s$ inside the derivative (the curvilinear curl), which gives $k$.' },
    { id: 'mgm-028', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'curie law', unit: '$10^{-5}$',
      q: 'A paramagnet has $1.0\\times10^{28}$ moments per m$^3$, each of magnitude one Bohr magneton ($9.27\\times10^{-24}$ J/T), free to point in any direction. Using the classical Curie law $\\chi = \\mu_0N\\mu^2/(3k_BT)$, its susceptibility at 300 K is ______ $\\times10^{-5}$ (to two decimal places).',
      answer: 8.70, tol: 0.09, calc: () => mu0 * 1e28 * muB ** 2 / (3 * C.kB * 300) / 1e-5,
      sol: '$\\chi = \\dfrac{\\mu_0N\\mu^2}{3k_BT} = \\dfrac{(1.2566\\times10^{-6})(10^{28})(9.27\\times10^{-24})^2}{3(1.381\\times10^{-23})(300)} = \\dfrac{1.081\\times10^{-24}}{1.243\\times10^{-20}} = 8.70\\times10^{-5}$.',
      trap: 'Forgetting $\\mu_0$ (SI volume susceptibility needs it) or the factor 3 from averaging $\\cos^2\\theta$.' },
    // ---------- level 4 ----------
    { id: 'mgm-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'magnetic circuits', unit: 'A',
      q: 'A toroidal iron core ($\\mu_r = 800$, linear) has a mean circumference of 0.40 m and a 2.0 mm air gap. A 400-turn winding is to produce 0.50 T in the gap. The current needed is ______ A (to two decimal places).',
      answer: 2.48, tol: 0.03, calc: () => 0.5 * ((0.4 - 2e-3) / 800 + 2e-3) / (mu0 * 400),
      sol: 'Iron path $l = 0.40 - 0.002 = 0.398$ m. $NI = \\dfrac{B}{\\mu_0}\\left(\\dfrac{l}{\\mu_r} + g\\right) = \\dfrac{0.50}{1.2566\\times10^{-6}}(4.975\\times10^{-4} + 2.0\\times10^{-3}) = 994$ A-turns, so $I = 994/400 = 2.48$ A.',
      trap: 'Dropping the iron term entirely gives 1.99 A; here it is a fifth of the total, not negligible.' },
    { id: 'mgm-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'magnetised sphere',
      q: 'Outside a uniformly magnetised sphere of radius $R$ and magnetisation $\\vec M$, the field is',
      options: ['zero, since all bound current is on the surface', 'that of a point dipole $\\vec m = \\tfrac43\\pi R^3\\vec M$ at the centre, exactly', 'that of a point dipole only far away ($r \\gg R$)', 'uniform, equal to $\\tfrac23\\mu_0\\vec M$'], answer: 1,
      sol: 'The surface current $K_b = M\\sin\\theta$ makes exactly a dipole field outside (the same as a spinning charged shell), with total moment = magnetisation $\\times$ volume $= \\tfrac43\\pi R^3\\vec M$. "Exactly" is the special property of the sphere; other shapes have higher multipoles close up.',
      trap: 'Thinking the dipole form is only a far-field approximation; for a sphere it is exact at every $r > R$.' },
    { id: 'mgm-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'hysteresis',
      q: 'Which statements about the B-H hysteresis loop of a ferromagnet are correct?',
      options: ['The remanence is the value of $B$ when $H$ has been brought back to zero.', 'The coercivity is the reverse $H$ needed to bring $B$ to zero.', 'Materials with thin loops and small coercivity suit transformer cores.', 'Good permanent magnets need small coercivity, so that they are easy to magnetise.'], answer: [0, 1, 2],
      sol: 'Remanence and coercivity are defined where the loop crosses the axes. Transformers cycle 50 times a second, so they need small loop area (soft materials). A permanent magnet must resist demagnetisation by stray fields and its own $\\vec H$, so it needs large coercivity (hard materials, wide loops).',
      trap: 'Easy to magnetise also means easy to demagnetise: permanent magnets want the opposite.' },
    { id: 'mgm-032', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'linear sphere', unit: 'T',
      q: 'A sphere of linear magnetic material with $\\mu_r = 4$ is placed in a uniform field $B_0 = 0.10$ T. The field inside the sphere is ______ T (to two decimal places).',
      answer: 0.20, tol: 0.005, calc: () => 3 * 4 / (4 + 2) * 0.1,
      sol: 'Solving with $\\vec M = \\chi_m\\vec H$ (the magnetic twin of the dielectric sphere): $\\vec B_{\\text{in}} = \\dfrac{3\\mu_r}{\\mu_r + 2}\\vec B_0 = \\dfrac{12}{6}(0.10) = 0.20$ T. Check: with $\\vec H_{\\text{in}} = \\vec B_0/\\mu_0 - \\vec M/3$ and $\\vec M = 3\\vec H_{\\text{in}}$ we get $H_{\\text{in}} = B_0/(2\\mu_0)$ and $B_{\\text{in}} = \\mu_0\\mu_rH_{\\text{in}} = 2B_0$.',
      trap: 'Using $\\mu_rB_0 = 0.40$ T, the long-needle answer. The sphere\'s demagnetising field reduces it.' },
    { id: 'mgm-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'H and B',
      q: 'A long straight wire carrying current $I$ runs along the axis of a long cylinder of radius $R$ made of linear material with susceptibility $\\chi_m$. Inside the material, at distance $s$ from the axis ($s < R$), the field is',
      options: ['$\\dfrac{\\mu_0I}{2\\pi s}$', '$\\dfrac{\\mu_0(1+\\chi_m)I}{2\\pi s}$', '$\\dfrac{\\mu_0(1+\\chi_m)Is}{2\\pi R^2}$', '$\\dfrac{\\mu_0I}{2\\pi(1+\\chi_m)s}$'], answer: 1,
      sol: 'The free current is only in the wire, so $H = I/(2\\pi s)$ by Ampère. $B = \\mu_0(1+\\chi_m)H$. The extra field comes from a bound current $\\chi_mI$ along the wire\'s surface (the inner edge of the material); a return bound current $-\\chi_mI$ flows on the outer surface, so outside $B = \\mu_0I/(2\\pi s)$ again.',
      trap: 'The $s/R^2$ form is for current spread through the cylinder; here the free current is only on the axis.' },
    { id: 'mgm-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'atomic moments', unit: '$10^{-3}$',
      q: 'Spin-$\\tfrac12$ moments of one Bohr magneton sit in a field of 1.0 T at 300 K, each either along or against the field. The net fractional alignment $(N_\\uparrow - N_\\downarrow)/N$ is ______ $\\times10^{-3}$ (to two decimal places).',
      answer: 2.24, tol: 0.03, calc: () => Math.tanh(muB * 1 / (C.kB * 300)) * 1e3,
      sol: 'The two energies are $\\mp\\mu_BB$, so by Boltzmann $\\dfrac{N_\\uparrow - N_\\downarrow}{N} = \\tanh\\dfrac{\\mu_BB}{k_BT}$. Here $\\dfrac{\\mu_BB}{k_BT} = \\dfrac{9.27\\times10^{-24}}{4.14\\times10^{-21}} = 2.24\\times10^{-3}$, and $\\tanh x \\approx x$ for small $x$. Only about 2 in 1000 moments are effectively aligned at room temperature.',
      trap: 'Using the classical Langevin result $x/3$, which is for moments that can point in any direction.' },
    { id: 'mgm-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'H and B',
      q: 'Inside a short bar magnet (no free current), how do $\\vec B$ and $\\vec H$ point relative to the magnetisation $\\vec M$?',
      options: ['Both along $\\vec M$', 'Both against $\\vec M$', '$\\vec B$ along $\\vec M$, $\\vec H$ against $\\vec M$', '$\\vec B$ against $\\vec M$, $\\vec H$ along $\\vec M$'], answer: 2,
      sol: 'With no free current, $\\oint\\vec H\\cdot d\\vec l = 0$. Outside, $\\vec H = \\vec B/\\mu_0$ runs from N to S; to close the loop with zero total, $\\vec H$ inside must run from N to S too, i.e. against $\\vec M$. $\\vec B$ forms closed loops ($\\nabla\\cdot\\vec B = 0$), running S to N inside, along $\\vec M$: $\\vec B = \\mu_0(\\vec H + \\vec M)$ with $|\\vec H| < |\\vec M|$.',
      trap: 'Drawing $\\vec H$ lines as closed loops like $\\vec B$ lines. $\\vec H$ lines start and end on the poles.' },
    { id: 'mgm-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'magnetic circuits',
      q: 'The pole face of an electromagnet has area $A$ and the field across a thin gap is $B$. The force with which it holds an iron plate across the gap is',
      options: ['$\\dfrac{B^2A}{\\mu_0}$', '$\\dfrac{BA}{2\\mu_0}$', '$\\dfrac{\\mu_0B^2A}{2}$', '$\\dfrac{B^2A}{2\\mu_0}$'], answer: 3,
      sol: 'Pull the plate away by $dx$ at fixed flux: the gap volume grows by $A\\,dx$, storing extra energy $\\dfrac{B^2}{2\\mu_0}A\\,dx$, which must be the work $F\\,dx$. So $F = \\dfrac{B^2A}{2\\mu_0}$: the field\'s energy density acts as a pressure.',
      trap: 'Missing the $\\tfrac12$, or writing $\\mu_0$ upstairs (check units: $B^2/\\mu_0$ is J/m$^3$ = N/m$^2$).' },
    // ---------- level 5 ----------
    { id: 'mgm-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'magnetic circuits', unit: 'T',
      q: 'A ring of permanent-magnet material, of mean circumference 0.30 m, is uniformly magnetised round the ring with $M = 8.0\\times10^5$ A/m (treat $M$ as fixed). A thin radial gap of 3.0 mm is cut in it. Neglecting fringing, the field in the gap is ______ T (to three decimal places).',
      answer: 0.995, tol: 0.005, calc: () => mu0 * 8e5 * (0.3 - 3e-3) / 0.3,
      sol: 'No free current: $\\oint\\vec H\\cdot d\\vec l = H_m(l - g) + H_gg = 0$. $B$ is continuous across the gap faces: $B = \\mu_0H_g = \\mu_0(H_m + M)$. Eliminating: $\\dfrac{Bg}{\\mu_0} = -\\left(\\dfrac{B}{\\mu_0} - M\\right)(l - g)$, so $B = \\mu_0M\\dfrac{l - g}{l} = (1.0053)(0.99) = 0.995$ T.',
      trap: 'Taking $B = \\mu_0M$ in the gap (no reduction) or $B = 0$ (no free current). The gap creates a small backward $H$ in the magnet.' },
    { id: 'mgm-038', type: 'msq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'magnetised sphere',
      q: 'For a uniformly magnetised sphere with no free current, which statements are correct?',
      options: ['Inside, $\\vec B$ is parallel to $\\vec M$.', 'Inside, $\\vec H$ is antiparallel to $\\vec M$.', 'Outside, the field is exactly that of a point dipole.', '$\\nabla\\cdot\\vec H = 0$ everywhere, including on the surface.'], answer: [0, 1, 2],
      sol: '$\\vec B_{\\text{in}} = \\tfrac23\\mu_0\\vec M$ and $\\vec H_{\\text{in}} = -\\tfrac13\\vec M$. Outside it is an exact dipole of moment $\\tfrac43\\pi R^3\\vec M$. On the surface $\\vec M$ drops to zero abruptly, so $\\nabla\\cdot\\vec H = -\\nabla\\cdot\\vec M$ is a surface "magnetic charge" $\\sigma_m = \\vec M\\cdot\\hat n$, not zero.',
      trap: 'Using $\\nabla\\cdot\\vec B = 0$ for $\\vec H$. $\\vec H$ behaves like an electrostatic field of magnetic "poles".' },
    { id: 'mgm-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'curie law',
      q: 'In Weiss\'s mean-field model each moment feels an extra field $\\lambda\\vec M$ from its neighbours, and the material otherwise follows Curie\'s law $M = (C/T)H_{\\text{eff}}$. Above the ordering temperature the susceptibility and the Curie temperature are',
      options: ['$\\chi = \\dfrac{C}{T - \\lambda C}$, $T_c = \\lambda C$', '$\\chi = \\dfrac{C}{T + \\lambda C}$, $T_c = \\lambda C$', '$\\chi = \\dfrac{\\lambda C}{T - C}$, $T_c = C$', '$\\chi = \\dfrac{C}{T}$, $T_c = \\lambda/C$'], answer: 0,
      sol: '$M = \\dfrac CT(H + \\lambda M)$ gives $M\\left(1 - \\dfrac{\\lambda C}{T}\\right) = \\dfrac CTH$, so $\\chi = \\dfrac{M}{H} = \\dfrac{C}{T - \\lambda C}$. It diverges at $T_c = \\lambda C$, below which a spontaneous $M$ appears. A plus sign in the denominator ($T + \\theta$) describes antiferromagnets above the Néel point.',
      trap: 'The second option, with $T + \\lambda C$, is the antiferromagnetic form.' },
    { id: 'mgm-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'magnetised sphere', unit: 'T',
      q: 'A small sphere is uniformly magnetised with $M = 1.0\\times10^6$ A/m. Just outside its surface, on its equator (in the plane through the centre perpendicular to $\\vec M$), the magnitude of $B$ is ______ T (to three decimal places).',
      answer: 0.419, tol: 0.004, calc: () => mu0 * 1e6 / 3,
      sol: 'Outside it is a dipole $m = \\tfrac43\\pi R^3M$. On the equator the dipole field is $\\dfrac{\\mu_0m}{4\\pi r^3}$ against $\\vec m$; at $r = R$: $\\dfrac{\\mu_0}{4\\pi R^3}\\cdot\\dfrac43\\pi R^3M = \\dfrac{\\mu_0M}{3} = 0.419$ T, pointing opposite to $\\vec M$. (At the poles it is $\\tfrac23\\mu_0M$, equal to the inside value, as continuity of $B_\\perp$ demands.)',
      trap: 'Assuming $B$ just outside equals $B$ inside everywhere. Only the normal component is continuous; at the equator the field is tangential and it jumps.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'mgm-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'kinds of magnetism',
      make(r) {
        const names = ['diamagnetic', 'paramagnetic', 'ferromagnetic', 'antiferromagnetic', 'a superconductor (perfect diamagnet)'];
        const desc = ['a small negative susceptibility, about $-10^{-5}$, that hardly changes with temperature', 'a small positive susceptibility that varies as $1/T$', 'a susceptibility of order $10^{3}$ that depends on the field, with hysteresis, below a critical temperature',
          'a small positive susceptibility that rises as the sample is warmed up to a critical temperature and falls above it', 'a susceptibility of exactly $-1$ below a critical temperature'];
        const c = Q5.int(r, 0, 4);
        const o = Q5.mcqOptions(r, names[c], Q5.shuffle(r, names.filter((x, i) => i !== c)));
        return { q: `A material shows ${desc[c]}. It is best described as`, ...o,
          sol: 'Diamagnetism: induced moments oppose the field, $\\chi \\sim -10^{-5}$, nearly temperature independent. Paramagnetism: permanent moments partly aligned against thermal disorder, Curie law $\\chi = C/T$. Ferromagnetism: exchange aligns moments in domains, huge field-dependent $\\chi$ with hysteresis below $T_C$. Antiferromagnetism: neighbouring moments antiparallel; $\\chi$ peaks at the Néel temperature. A superconductor expels the field (Meissner effect): $B = 0$ inside, $\\chi = -1$.',
          trap: 'A susceptibility that peaks at a temperature signals antiferromagnetism; a $1/T$ fall signals paramagnetism.' };
      } },
    { id: 'mgm-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'bound currents', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['A uniformly magnetised body has no bound volume current.', 'The bound surface current density is $\\vec K_b = \\vec M\\times\\hat n$.', 'Across a boundary with no free surface current, the tangential component of $\\vec H$ is continuous.',
          'Across any boundary, the normal component of $\\vec B$ is continuous.', 'The bound volume current density is $\\vec J_b = \\nabla\\times\\vec M$.'];
        const F = ['A uniformly magnetised body has a bound volume current $\\vec J_b = \\vec M$.', 'The bound surface current density is $\\vec K_b = \\vec M\\cdot\\hat n$.', 'Across any boundary the normal component of $\\vec H$ is continuous.',
          'Across any boundary the tangential component of $\\vec B$ is continuous.', 'The bound volume current density is $\\vec J_b = \\nabla\\cdot\\vec M$.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about magnetised matter are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'A magnetisation $\\vec M$ is equivalent to bound currents $\\vec J_b = \\nabla\\times\\vec M$ (zero when $\\vec M$ is uniform) and $\\vec K_b = \\vec M\\times\\hat n$ on the surface. $\\nabla\\cdot\\vec B = 0$ always, so $B_n$ is continuous. $\\nabla\\times\\vec H = \\vec J_f$, so $H_t$ is continuous where there is no free surface current. $H_n$ and $B_t$ jump when $\\vec M$ changes across the boundary.',
          trap: 'Bound currents come from the curl of $\\vec M$ (and its cross product with the normal), never the divergence or dot product.' };
      } },
    { id: 'mgm-t23', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'bound currents', unit: 'mT',
      make(r) {
        const a = Q5.int(r, 1, 4), L = Q5.int(r, 8, 20), m = Q5.pick(r, 0.05, 2, 0.05);
        const M = m / (Math.PI * (a / 1000) ** 2 * (L / 100)), B = 4e-7 * Math.PI * M / 2 * 1000;
        return { q: `A thin iron rod, $${L}$ cm long and $${a}$ mm in radius, is magnetised uniformly along its length and has magnetic moment $${m}$ A m$^2$. The field $B$ at the centre of one end face is about ______ mT (to two decimal places; treat the rod as very long).`,
          answer: Q5.round(B, 2), tol: Math.max(0.01, Q5.round(0.005 * B, 3)), a, L, m,
          sol: `$M = m/V = ${m}/(\\pi\\times(${a / 1000})^2\\times${L / 100}) = ${Q5.fmt(M, 4)}$ A/m. The rod is equivalent to a surface current $K_b = M$ round its side: a solenoid. At the centre of an end of a long solenoid $B = \\mu_0K/2 = \\mu_0M/2 = ${Q5.round(B, 2)}$ mT.`,
          trap: 'At the end of a long solenoid the field is half the value deep inside.' };
      },
      verify: (p) => { const R = p.a / 1000, L = p.L / 100, K = p.m / (Math.PI * R * R * L); return 4e-7 * Math.PI * K / 2 * L / Math.sqrt(L * L + R * R) * 1000; } },
    { id: 'mgm-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'hysteresis',
      make(r) {
        const good = ['A transformer core should have a narrow hysteresis loop (low coercivity).', 'A permanent magnet should have high coercivity and high remanence.', 'The area of the B-H loop is the energy lost as heat per unit volume per cycle.',
          'Soft iron is preferred for electromagnet cores because it loses its magnetisation easily.', 'Heating a ferromagnet above its Curie temperature makes it paramagnetic.'];
        const bad = ['A transformer core should have a wide hysteresis loop.', 'A permanent magnet should have low coercivity.', 'The area of the B-H loop is the energy stored in the core.', 'Soft iron is preferred for permanent magnets.', 'Heating a ferromagnet above its Curie temperature makes it diamagnetic.'];
        const not = r() < 0.5;
        const o = not ? q5odd(r, bad, good) : q5odd(r, good, bad);
        return { q: `Which ${not ? 'one statement is <b>NOT</b> correct' : 'one statement is correct'}?`, ...o,
          sol: 'Cores that are cycled (transformers, electromagnets) need soft materials: narrow loops, low coercivity, little heat loss per cycle (loss per unit volume per cycle $= \\oint H\\,dB$, the loop area). Permanent magnets need hard materials: large remanence (strong when the field is removed) and large coercivity (hard to demagnetise). Above $T_C$ the exchange order is lost and the material becomes paramagnetic.',
          trap: 'Loop area is energy lost every cycle, not stored.' };
      } },
    { id: 'mgm-t25', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'curie law',
      make(r) {
        const n = Q5.int(r, 1, 9), k = Q5.int(r, 1, 7), T = Q5.int(r, 5, 40) * 10;
        const mu = k * 9.274e-24, chi = 1.25664e-6 * n * 1e27 * mu * mu / (3 * 1.380649e-23 * T);
        return { q: `A paramagnet has $${n}\\times10^{27}$ independent classical moments per m$^3$, each of size $${k}\\,\\mu_B$, at $${T}$ K. In the low-field (Langevin) limit its susceptibility is $\\chi = x\\times10^{-4}$, where $x$ is ______ (to three significant figures; $\\mu_B = 9.274\\times10^{-24}$ J/T, $\\mu_0 = 1.25664\\times10^{-6}$ SI, $k_B = 1.381\\times10^{-23}$ J/K).`,
          answer: +(chi * 1e4).toPrecision(3), tol: +(0.006 * chi * 1e4).toPrecision(2), n, k, T,
          sol: `For small $x = \\mu B/k_BT$, the Langevin function is $L(x) \\approx x/3$, so $M = n\\mu L(x) = \\dfrac{n\\mu^2}{3k_BT}B$ and, with $B \\approx \\mu_0H$, $\\chi = \\dfrac{\\mu_0n\\mu^2}{3k_BT}$. Here $\\mu = ${k}\\times9.274\\times10^{-24} = ${Q5.fmt(mu, 4)}$ J/T, giving $\\chi = ${Q5.fmt(chi, 3)}$.`,
          trap: 'The moment enters squared: once to align, once to count the magnetisation.' };
      },
      verify: (p) => { const mu = p.k * 9.274e-24, H = 1e5, Bf = 1.25664e-6 * H, x = mu * Bf / (1.380649e-23 * p.T); const L = 1 / Math.tanh(x) - 1 / x; return p.n * 1e27 * mu * L / H * 1e4; } },
    { id: 'mgm-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'H and B', unit: 'mT',
      make(r) {
        const H = int(r, 1, 20) * 100, M = int(r, -20, 40) * 100;
        const B = mu0 * (H + M) * 1000;
        return { q: `In a material $H = ${H}$ A/m and the magnetisation is $M = ${M}$ A/m along the same axis (a negative value means opposite to $\\vec H$). $B$ along that axis is ______ mT (to three decimal places).`,
          answer: round(B, 3), tol: Math.max(Math.abs(B) * 0.01, 0.002), H, M,
          sol: `$B = \\mu_0(H + M) = (1.2566\\times10^{-6})(${H + M}) \\approx ${round(B, 3)}$ mT.`,
          trap: 'Add $M$ to $H$ before multiplying by $\\mu_0$.' };
      },
      verify: (p) => mu0 * (p.H + p.M) * 1000 },
    { id: 'mgm-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'H and B', unit: 'T',
      make(r) {
        const N = int(r, 1, 20) * 50, I = pick(r, 0.1, 3, 0.1), rr = int(r, 5, 25), mur = choose(r, [100, 200, 500, 1000, 2000]);
        const B = mu0 * mur * N * I / (2 * Math.PI * rr / 100);
        return { q: `A toroid of mean radius ${rr} cm has ${N} turns carrying ${I} A, wound on a linear core with $\\mu_r = ${mur}$. The field $B$ on the mean circle is ______ T (to three significant figures).`,
          answer: +B.toPrecision(3), tol: Math.max(B * 0.01, 1e-4), N, I, rr, mur,
          sol: `$H = \\dfrac{NI}{2\\pi r} = \\dfrac{${round(N * I, 2)}}{2\\pi(${rr / 100})} = ${fmt(N * I / (2 * Math.PI * rr / 100), 4)}$ A/m; $B = \\mu_0\\mu_rH \\approx ${fmt(B, 3)}$ T.`,
          trap: '$H$ comes from free current alone; the core multiplies $B$ by $\\mu_r$.' };
      },
      verify: (p) => mu0 * p.mur * p.N * p.I / (2 * Math.PI * p.rr / 100) },
    { id: 'mgm-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'curie law', unit: '$10^{-4}$',
      make(r) {
        const x1 = pick(r, 0.5, 9.5, 0.5), T1 = int(r, 10, 40) * 10, T2 = int(r, 2, 40) * 10;
        const x2 = x1 * T1 / T2;
        return { q: `A Curie-law paramagnet has susceptibility $${x1}\\times10^{-4}$ at ${T1} K. At ${T2} K it is ______ $\\times10^{-4}$ (to three significant figures).`,
          answer: +x2.toPrecision(3), tol: Math.max(x2 * 0.01, 0.001), x1, T1, T2,
          sol: `$\\chi \\propto 1/T$: $\\chi_2 = ${x1}\\times\\dfrac{${T1}}{${T2}} \\approx ${fmt(x2, 3)}$ (in units of $10^{-4}$).`,
          trap: 'Colder means larger susceptibility.' };
      },
      verify: (p) => p.x1 * p.T1 / p.T2 },
    { id: 'mgm-g04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetic circuits', unit: 'T',
      make(r) {
        const mur = choose(r, [500, 1000, 2000, 5000]), l = pick(r, 0.2, 1, 0.1), g = pick(r, 0.5, 3, 0.5), N = int(r, 1, 10) * 100, I = pick(r, 0.5, 3, 0.5);
        const B = mu0 * N * I / (l / mur + g / 1000);
        return { q: `An iron core ($\\mu_r = ${mur}$) with mean path ${l} m has an air gap of ${g} mm. A winding of ${N} turns carries ${I} A. Ignoring fringing, the gap field is ______ T (to three significant figures).`,
          answer: +B.toPrecision(3), tol: Math.max(B * 0.01, 1e-4), mur, l, g, N, I,
          sol: `$B = \\dfrac{\\mu_0NI}{l/\\mu_r + g} = \\dfrac{(1.2566\\times10^{-6})(${round(N * I, 2)})}{${fmt(l / mur, 3)} + ${g / 1000}} \\approx ${fmt(B, 3)}$ T.`,
          trap: 'The gap\'s reluctance usually dominates.' };
      },
      verify: (p) => mu0 * p.N * p.I / (p.l / p.mur + p.g / 1000) },
    { id: 'mgm-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'hysteresis', unit: 'W',
      make(r) {
        const A = int(r, 5, 60) * 10, V = int(r, 1, 50), f = choose(r, [50, 60, 400, 1000]); // A in J/m^3, V in 10^-4 m^3
        const P = A * V * 1e-4 * f;
        return { q: `A core material's B-H loop encloses ${A} J/m$^3$. A core of volume $${V}\\times10^{-4}$ m$^3$ is cycled at ${f} Hz. The hysteresis loss is ______ W (to three significant figures).`,
          answer: +P.toPrecision(3), tol: Math.max(P * 0.01, 1e-3), A, V, f,
          sol: `$P = (\\text{loop area})\\times(\\text{volume})\\times f = ${A}\\times${V}\\times10^{-4}\\times${f} \\approx ${fmt(P, 3)}$ W.`,
          trap: 'Energy per cycle times cycles per second.' };
      },
      verify: (p) => p.A * p.V * 1e-4 * p.f },
    { id: 'mgm-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'kinds of magnetism',
      make(r) {
        const cases = [['$-2\\times10^{-5}$, nearly independent of temperature', 0], ['$-1$ below a critical temperature', 3], ['$+3\\times10^{-4}$, falling as $1/T$ when heated', 1], ['about $+5000$, depending on the previous magnetisation', 2], ['$-9\\times10^{-6}$, the same at 77 K and 300 K', 0], ['$+2\\times10^{-5}$, doubling when the absolute temperature halves', 1]];
        const [desc, ans] = choose(r, cases);
        return { q: `A material has a magnetic susceptibility of ${desc}. It is best described as`, options: ['diamagnetic', 'paramagnetic', 'ferromagnetic', 'a superconductor in the Meissner state'], answer: ans,
          sol: 'Diamagnets: small negative $\\chi$, nearly independent of $T$. Paramagnets: small positive $\\chi = C/T$. Ferromagnets: huge, history-dependent $\\chi$ (hysteresis). Superconductors: $\\chi = -1$, perfect expulsion of $B$.',
          trap: 'Look at both the sign and the size, and at how it changes with temperature.' };
      } },
    { id: 'mgm-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetised sphere', unit: 'mT',
      make(r) {
        const M = int(r, 1, 99) * 1e4, where = choose(r, ['inside', 'rod']);
        const B = (where === 'inside' ? 2 / 3 : 1) * mu0 * M * 1000;
        return { q: `${where === 'inside' ? 'A sphere' : 'A very long rod'} is uniformly magnetised with $M = ${fmt(M, 3)}$ A/m${where === 'rod' ? ' along its length' : ''}. The field $B$ inside it${where === 'rod' ? ', far from the ends,' : ''} is ______ mT (to three significant figures).`,
          answer: +B.toPrecision(3), tol: Math.max(B * 0.01, 0.01), M, where,
          sol: where === 'inside' ? `For a sphere $B = \\tfrac23\\mu_0M = \\tfrac23(1.2566\\times10^{-6})(${fmt(M, 3)}) \\approx ${fmt(B, 3)}$ mT.` : `A long rod is a solenoid with $K_b = M$: $B = \\mu_0M \\approx ${fmt(B, 3)}$ mT.`,
          trap: 'Shape matters: sphere $\\tfrac23\\mu_0M$, long rod $\\mu_0M$.' };
      },
      verify: (p) => (p.where === 'inside' ? 2 / 3 : 1) * mu0 * p.M * 1000 },
    { id: 'mgm-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'curie law', unit: 'K',
      make(r) {
        const th = int(r, 30, 120) * 10, d1 = choose(r, [10, 20, 25, 40, 50, 100]), f = choose(r, [2, 4, 5]);
        const T1 = th + d1, T2 = th + f * d1, x1 = 1 / d1, x2 = 1 / (f * d1); // C = 1 K, values terminate
        return { q: `A ferromagnet above its Curie point follows $\\chi = C/(T - \\theta)$. Its susceptibility is ${x1} at ${T1} K and ${x2} at ${T2} K. The constant $\\theta$ is ______ K.`,
          answer: th, tol: 1, T1, T2, f,
          sol: `The ratio is $${f}$, so $T_2 - \\theta = ${f}(T_1 - \\theta)$: $\\theta = \\dfrac{${f}T_1 - T_2}{${f - 1}} = \\dfrac{${f * T1} - ${T2}}{${f - 1}} = ${th}$ K.`,
          trap: 'Curie\'s law $C/T$ alone does not fit both points.' };
      },
      verify: (p) => (p.f * p.T1 - p.T2) / (p.f - 1) },
    ...r4.gens,
    ...r5.gens,
  ],
};
