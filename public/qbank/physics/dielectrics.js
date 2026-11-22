// Dielectrics and capacitors: polarisation, bound charges, D and the free-charge Gauss law, linear dielectrics,
// boundary conditions, capacitors of every shape with slabs and layers, energy, forces on slabs, battery connected
// versus isolated, charge sharing, a dielectric sphere in a uniform field, Clausius-Mossotti, leaky capacitors.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const K = 1 / (4 * Math.PI * C.eps0);
const e0 = C.eps0;

import * as Q5 from '../_util.js';
import more2 from './dielectrics.more2.gen.js';
import r4 from './dielectrics.r4.gen.js';

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
  topic: 'dielectrics',
  items: [
    // ---------- level 1 ----------
    { id: 'die-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'battery connected or isolated',
      q: 'A parallel-plate capacitor stays connected to a battery while a dielectric of constant 4 is slid in to fill the gap. The charge on the plates',
      options: ['stays the same', 'becomes 4 times larger', 'becomes 4 times smaller', 'becomes 16 times larger'], answer: 1,
      sol: 'The battery holds $V$ fixed. Filling the gap multiplies the capacitance by $\\kappa = 4$, so $Q = CV$ becomes 4 times larger. The battery supplies the extra charge.',
      trap: 'Mixing up the two cases: with the battery removed, $Q$ stays fixed and $V$ drops by 4 instead.' },
    { id: 'die-002', type: 'nat', level: 1, exams: ['jam'], sub: 'parallel plate', unit: 'pF',
      q: 'Two plates of area 0.020 m$^2$ are 1.0 mm apart with a dielectric of constant 5.0 filling the gap. The capacitance is ______ pF (to the nearest whole number).',
      answer: 885, tol: 9, calc: () => 5 * e0 * 0.02 / 1e-3 * 1e12,
      sol: '$C = \\dfrac{\\kappa\\epsilon_0A}{d} = \\dfrac{5.0\\times8.854\\times10^{-12}\\times0.020}{1.0\\times10^{-3}} = 8.85\\times10^{-10}$ F $= 885$ pF.',
      trap: 'Forgetting to turn 1.0 mm into $10^{-3}$ m, which is off by a factor of 1000.' },
    { id: 'die-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'polarisation',
      q: 'The SI unit of the polarisation $\\vec P$ (dipole moment per unit volume) is',
      options: ['V/m', 'C m', 'C/m$^3$', 'C/m$^2$'], answer: 3,
      sol: 'Dipole moment has units C m; per unit volume, (C m)/m$^3$ = C/m$^2$. It is the same unit as surface charge density, which is no accident: the bound surface charge is $\\sigma_b = \\vec P\\cdot\\hat n$.',
      trap: 'C m is the unit of a single dipole moment, not of the moment per volume.' },
    { id: 'die-004', type: 'msq', level: 1, exams: ['jam'], sub: 'D field',
      q: 'Which of these are correct for a linear, isotropic dielectric of permittivity $\\epsilon = \\epsilon_0\\epsilon_r$?',
      options: ['$\\vec D = \\epsilon_0\\vec E + \\vec P$', '$\\vec D = \\epsilon\\vec E$', '$\\vec P = \\epsilon_0\\chi_e\\vec E$ with $\\chi_e = \\epsilon_r - 1$', '$\\nabla\\cdot\\vec D$ equals the total (free plus bound) charge density'], answer: [0, 1, 2],
      sol: 'The first is the definition of $\\vec D$, true in any material. For a linear isotropic material $\\vec P = \\epsilon_0\\chi_e\\vec E$, so $\\vec D = \\epsilon_0(1+\\chi_e)\\vec E = \\epsilon\\vec E$. The divergence of $\\vec D$ is the <em>free</em> charge density only; that is the whole point of $\\vec D$.',
      trap: '$\\nabla\\cdot\\vec E$ is total charge over $\\epsilon_0$; $\\nabla\\cdot\\vec D$ is free charge.' },
    { id: 'die-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'battery connected or isolated',
      q: 'A charged parallel-plate capacitor is disconnected from its battery. A slab of dielectric constant $\\kappa$ is then slid in to fill the gap. The stored energy',
      options: ['becomes $\\kappa$ times larger', 'stays the same', 'becomes $\\kappa$ times smaller', 'becomes $\\kappa^2$ times smaller'], answer: 2,
      sol: 'Isolated: $Q$ is fixed. $U = Q^2/(2C)$ and $C$ grows by $\\kappa$, so $U$ falls by $\\kappa$. The lost energy went into pulling the slab in (the capacitor does work on it).',
      trap: 'Using $U = \\tfrac12CV^2$ with $V$ held fixed: that is the battery-connected case.' },
    { id: 'die-006', type: 'nat', level: 1, exams: ['jam'], sub: 'combinations', unit: '$\\mu$F',
      q: 'Capacitors of $3\\,\\mu$F and $6\\,\\mu$F are connected in series. The combined capacitance is ______ $\\mu$F.',
      answer: 2, tol: 0, calc: () => 1 / (1 / 3 + 1 / 6),
      sol: 'In series the charge is the same on each and the voltages add: $\\dfrac1C = \\dfrac13 + \\dfrac16 = \\dfrac12$, so $C = 2\\,\\mu$F, smaller than either.',
      trap: 'Adding them (9 $\\mu$F) is the parallel rule.' },
    // ---------- level 2 ----------
    { id: 'die-007', type: 'nat', level: 2, exams: ['jam'], sub: 'bound charge', unit: 'nC',
      q: 'A dielectric cube of side 5.0 cm has uniform polarisation $\\vec P = 2.0\\,\\mu\\text{C/m}^2\\,\\hat z$, with two faces normal to $z$. The bound charge on the top face (the face with outward normal $+\\hat z$) is ______ nC.',
      answer: 5, tol: 0.05, calc: () => 2e-6 * 0.05 ** 2 * 1e9,
      sol: '$\\sigma_b = \\vec P\\cdot\\hat n = +2.0\\,\\mu$C/m$^2$ on the top face. Charge $= \\sigma_bA = (2.0\\times10^{-6})(0.050)^2 = 5.0\\times10^{-9}$ C $= 5.0$ nC. The bottom face carries $-5.0$ nC, the side faces nothing ($\\vec P\\cdot\\hat n = 0$), and inside $\\rho_b = -\\nabla\\cdot\\vec P = 0$.',
      trap: 'Giving the side faces charge: only the component of $\\vec P$ along the outward normal counts.' },
    { id: 'die-008', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'bound charge',
      q: 'A dielectric sphere has polarisation $\\vec P = k\\,r\\,\\hat r$ ($k$ a constant). The bound volume charge density inside it is',
      options: ['$-3k$', '$3k$', '$-k$', '$-2k/r$'], answer: 0,
      sol: '$\\rho_b = -\\nabla\\cdot\\vec P = -\\dfrac{1}{r^2}\\dfrac{d}{dr}\\left(r^2\\cdot kr\\right) = -\\dfrac{1}{r^2}(3kr^2) = -3k$, uniform. The surface gets $\\sigma_b = P(R) = kR$; total bound charge $-3k\\cdot\\tfrac43\\pi R^3 + kR\\cdot4\\pi R^2 = 0$, as it must be.',
      trap: 'Dropping the minus sign in $\\rho_b = -\\nabla\\cdot\\vec P$, or using the Cartesian $d/dr$ without the $r^2$.' },
    { id: 'die-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'bound charge',
      q: 'A neutral piece of dielectric of any shape is polarised by an external field. The total bound charge (volume plus surface) on it is',
      options: ['equal to $\\epsilon_0$ times the flux of $\\vec E$ through its surface', 'zero', 'equal to $-\\oint\\vec P\\cdot d\\vec a$, which is not zero in general', 'positive on the whole'], answer: 1,
      sol: 'Total bound charge $= \\int(-\\nabla\\cdot\\vec P)\\,d\\tau + \\oint\\vec P\\cdot d\\vec a = 0$ by the divergence theorem. Polarisation only shifts charges inside each molecule; it cannot create net charge.',
      trap: 'The surface charge alone is $\\oint\\vec P\\cdot d\\vec a$, which can be non-zero, but the volume charge cancels it.' },
    { id: 'die-010', type: 'nat', level: 2, exams: ['jam'], sub: 'slabs and layers', unit: 'pF',
      q: 'A parallel-plate capacitor has plates of area 0.010 m$^2$ separated by 5.0 mm. A slab 2.0 mm thick with dielectric constant 4.0 is placed in the gap, parallel to the plates. The capacitance is ______ pF (to one decimal place).',
      answer: 25.3, tol: 0.3, calc: () => e0 * 0.01 / (3e-3 + 2e-3 / 4) * 1e12,
      sol: 'The slab and the air are in series: $C = \\dfrac{\\epsilon_0A}{d - t + t/\\kappa} = \\dfrac{8.854\\times10^{-12}\\times0.010}{3.0\\times10^{-3} + 0.5\\times10^{-3}} = 2.53\\times10^{-11}$ F $= 25.3$ pF. Where the slab sits in the gap does not matter.',
      trap: 'Multiplying the air-filled value by $\\kappa$ as if the slab filled the gap.' },
    { id: 'die-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'slabs and layers',
      q: 'The gap of a parallel-plate capacitor (plate area $A$, gap $d$) is filled with two dielectrics side by side, $\\kappa_1$ under one half of the plate area and $\\kappa_2$ under the other half. The capacitance is',
      options: ['$\\dfrac{2\\epsilon_0A}{d}\\dfrac{\\kappa_1\\kappa_2}{\\kappa_1+\\kappa_2}$', '$\\dfrac{\\epsilon_0A}{d}(\\kappa_1+\\kappa_2)$', '$\\dfrac{\\epsilon_0A}{2d}(\\kappa_1+\\kappa_2)$', '$\\dfrac{\\epsilon_0A}{d}\\sqrt{\\kappa_1\\kappa_2}$'], answer: 2,
      sol: 'Side by side, both halves feel the same voltage, so they are in parallel: $C = \\dfrac{\\kappa_1\\epsilon_0(A/2)}{d} + \\dfrac{\\kappa_2\\epsilon_0(A/2)}{d} = \\dfrac{\\epsilon_0A}{2d}(\\kappa_1 + \\kappa_2)$.',
      trap: 'The first option is the series answer for two layers stacked one above the other.' },
    { id: 'die-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy',
      q: 'The energy stored in a $10\\,\\mu$F capacitor charged to 50 V is',
      options: ['12.5 mJ', '25 mJ', '0.25 J', '1.25 mJ'], answer: 0,
      sol: '$U = \\tfrac12CV^2 = \\tfrac12(10\\times10^{-6})(50)^2 = 1.25\\times10^{-2}$ J $= 12.5$ mJ.',
      trap: 'Forgetting the $\\tfrac12$ gives 25 mJ.' },
    { id: 'die-013', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'boundary conditions',
      q: 'At the flat boundary between two linear dielectrics with no free charge on it, which quantities are continuous?',
      options: ['The component of $\\vec E$ along the boundary', 'The component of $\\vec D$ normal to the boundary', 'The component of $\\vec E$ normal to the boundary', 'The component of $\\vec D$ along the boundary'], answer: [0, 1],
      sol: '$\\nabla\\times\\vec E = 0$ (a thin rectangular loop) makes $E_\\parallel$ continuous. $\\nabla\\cdot\\vec D = \\rho_f = 0$ (a thin pillbox) makes $D_\\perp$ continuous. Then $E_\\perp = D_\\perp/\\epsilon$ jumps by $\\epsilon_1/\\epsilon_2$, and $D_\\parallel = \\epsilon E_\\parallel$ jumps too.',
      trap: 'Bound charge sits on the boundary, so $E_\\perp$ jumps even with no free charge.' },
    { id: 'die-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'linear dielectrics',
      q: 'A large slab of linear dielectric (constant $\\kappa$) is placed in a uniform field $E_0$ with its faces perpendicular to the field. The field inside the slab is',
      options: ['$E_0/\\kappa$', '$\\kappa E_0$', '$E_0$', '$E_0(\\kappa - 1)/\\kappa$'], answer: 0,
      sol: 'With no free charge on the faces, $D_\\perp$ is continuous: $\\epsilon_0E_0 = \\kappa\\epsilon_0E_{\\text{in}}$, so $E_{\\text{in}} = E_0/\\kappa$. The bound charges on the faces partly cancel the applied field.',
      trap: 'This simple result needs the faces perpendicular to the field; a slab lying along the field has $E_{\\text{in}} = E_0$, and a sphere gets $3E_0/(\\kappa+2)$.' },
    { id: 'die-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'battery connected or isolated',
      q: 'A capacitor is charged to 100 V and disconnected. A dielectric of constant 2.5 is then slid in to fill the gap completely. The voltage across it becomes',
      options: ['250 V', '100 V', '40 V', '16 V'], answer: 2,
      sol: 'Isolated, so $Q$ is fixed; $C$ grows by 2.5; $V = Q/C$ falls to $100/2.5 = 40$ V. The field in the gap also falls by 2.5.',
      trap: '250 V comes from multiplying instead of dividing.' },
    { id: 'die-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'linear dielectrics',
      q: 'A material has relative permittivity 3.5. Its electric susceptibility is',
      options: ['3.5', '2.5', '4.5', '$1/3.5$'], answer: 1,
      sol: '$\\epsilon_r = 1 + \\chi_e$, so $\\chi_e = 3.5 - 1 = 2.5$. Vacuum has $\\chi_e = 0$, $\\epsilon_r = 1$.',
      trap: 'Taking $\\chi_e = \\epsilon_r$.' },
    // ---------- level 3 ----------
    { id: 'die-017', type: 'nat', level: 3, exams: ['jam'], sub: 'spherical and cylindrical', unit: 'pF',
      q: 'A spherical capacitor has an inner sphere of radius 5.0 cm and an outer shell of radius 10 cm, with vacuum between. Its capacitance is ______ pF (to two decimal places).',
      answer: 11.13, tol: 0.11, calc: () => 4 * Math.PI * e0 * 0.05 * 0.1 / 0.05 * 1e12,
      sol: 'With $\\pm Q$ on the spheres, $V = kQ\\left(\\dfrac1a - \\dfrac1b\\right)$, so $C = \\dfrac{4\\pi\\epsilon_0ab}{b - a} = \\dfrac{(0.05)(0.10)}{(8.99\\times10^9)(0.05)} = 1.11\\times10^{-11}$ F $= 11.13$ pF.',
      trap: 'Using $4\\pi\\epsilon_0a$ (the isolated sphere), which ignores the outer shell.' },
    { id: 'die-018', type: 'nat', level: 3, exams: ['jam'], sub: 'spherical and cylindrical', unit: 'pF/m',
      q: 'A coaxial cable has an inner conductor of radius 1.0 mm and an outer conductor of radius 5.0 mm, with polyethylene ($\\kappa = 2.2$) between. Its capacitance per metre is ______ pF/m (to one decimal place).',
      answer: 76.0, tol: 0.8, calc: () => 2 * Math.PI * e0 * 2.2 / Math.log(5) * 1e12,
      sol: 'Gauss\'s law for $\\vec D$ gives $E = \\dfrac{\\lambda}{2\\pi\\kappa\\epsilon_0s}$, so $V = \\dfrac{\\lambda}{2\\pi\\kappa\\epsilon_0}\\ln\\dfrac ba$ and $\\dfrac Cl = \\dfrac{2\\pi\\kappa\\epsilon_0}{\\ln(b/a)} = \\dfrac{2\\pi(2.2)(8.854\\times10^{-12})}{\\ln 5} = 7.60\\times10^{-11}$ F/m.',
      trap: 'Using $\\log_{10}5$ instead of $\\ln 5$.' },
    { id: 'die-019', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions',
      q: 'Field lines pass from a dielectric with $\\epsilon_{r1} = 2$ into one with $\\epsilon_{r2} = 6$ across a flat boundary carrying no free charge. In the first medium the field makes $30^\\circ$ with the normal. In the second it makes',
      options: ['$10.9^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$'], answer: 3,
      sol: '$E_\\parallel$ continuous and $\\epsilon E_\\perp$ continuous give $\\dfrac{\\tan\\theta_2}{\\tan\\theta_1} = \\dfrac{\\epsilon_2}{\\epsilon_1}$. So $\\tan\\theta_2 = 3\\tan30^\\circ = \\sqrt3$ and $\\theta_2 = 60^\\circ$. Lines bend away from the normal entering the higher-permittivity medium.',
      trap: 'Using Snell\'s law with sines, or putting the ratio upside down (giving $10.9^\\circ$).' },
    { id: 'die-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'force on a slab',
      q: 'A charged capacitor is isolated, and a dielectric slab (of the same thickness as the gap) is partly inserted between its plates, edge first. Neglect friction. Which statements are correct?',
      options: ['The slab is pulled further in.', 'The force on the slab is the same at every insertion depth.', 'The stored energy decreases as the slab moves in.', 'The voltage between the plates decreases as the slab moves in.'], answer: [0, 2, 3],
      sol: 'With $Q$ fixed, $U = Q^2/(2C)$ and $C(x)$ grows linearly with the inserted length $x$. The force $F = -dU/dx = \\dfrac{Q^2}{2C^2}\\dfrac{dC}{dx}$ is positive (inward) but falls as $C$ grows, so it depends on $x$. $U$ and $V = Q/C$ both fall as the slab goes in.',
      trap: 'With a battery connected the force <em>is</em> independent of $x$, since then $F = \\tfrac12V^2\\,dC/dx$ with $V$ fixed.' },
    { id: 'die-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'force on a slab', unit: '$\\mu$N',
      q: 'A parallel-plate capacitor has square plates 10 cm wide and a gap of 2.0 mm, and stays connected to a 200 V supply. A slab of dielectric constant 3.0 that just fits the gap is partly inserted. The force pulling it in is ______ $\\mu$N (to one decimal place).',
      answer: 17.7, tol: 0.2, calc: () => e0 * 2 * 0.1 * 200 ** 2 / (2 * 2e-3) * 1e6,
      sol: 'With inserted length $x$ and plate width $w$: $C = \\dfrac{\\epsilon_0w}{d}[\\kappa x + (L - x)]$, so $\\dfrac{dC}{dx} = \\dfrac{\\epsilon_0w(\\kappa-1)}{d}$. At fixed $V$, $F = \\tfrac12V^2\\dfrac{dC}{dx} = \\dfrac{\\epsilon_0(\\kappa-1)wV^2}{2d} = \\dfrac{(8.854\\times10^{-12})(2)(0.10)(4\\times10^4)}{4\\times10^{-3}} = 1.77\\times10^{-5}$ N.',
      trap: 'Using $\\kappa$ instead of $\\kappa - 1$: only the change in capacitance pulls.' },
    { id: 'die-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'battery connected or isolated',
      q: 'A capacitor connected to a battery has a dielectric slab pushed into it, raising its stored energy by $\\Delta U$. The work done by the battery in this process is',
      options: ['$\\Delta U$', 'zero', '$\\Delta U/2$', '$2\\Delta U$'], answer: 3,
      sol: 'The battery moves extra charge $\\Delta Q$ through voltage $V$: $W_b = V\\Delta Q = V^2\\Delta C$. The stored energy rises by $\\tfrac12V^2\\Delta C = \\Delta U$. So $W_b = 2\\Delta U$; the other half is the work done on the slab as it is pulled in (or heat, if it slams in).',
      trap: 'Assuming all the battery\'s work ends up stored.' },
    { id: 'die-023', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dielectric sphere', unit: 'V/m',
      q: 'A solid sphere of linear dielectric with $\\epsilon_r = 4$ is placed in a uniform field of 300 V/m. The field inside the sphere is ______ V/m.',
      answer: 150, tol: 0, calc: () => 3 * 300 / (4 + 2),
      sol: 'Solving Laplace\'s equation inside and outside with the boundary conditions gives a uniform field inside: $E_{\\text{in}} = \\dfrac{3}{\\epsilon_r + 2}E_0 = \\dfrac{3}{6}(300) = 150$ V/m, along $E_0$.',
      trap: 'Using $E_0/\\epsilon_r = 75$ V/m, which is the slab result, not the sphere.' },
    { id: 'die-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'microscopic picture',
      q: 'The Clausius-Mossotti relation links the relative permittivity of a dense, non-polar medium to the polarisability $\\alpha$ of its molecules (number density $N$). It reads',
      options: ['$\\epsilon_r - 1 = N\\alpha/\\epsilon_0$', '$\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2} = \\dfrac{N\\alpha}{3\\epsilon_0}$', '$\\dfrac{\\epsilon_r + 2}{\\epsilon_r - 1} = \\dfrac{N\\alpha}{3\\epsilon_0}$', '$\\epsilon_r = 1 + 3N\\alpha/\\epsilon_0$'], answer: 1,
      sol: 'Each molecule feels the local field $E + P/(3\\epsilon_0)$, not just $E$. With $P = N\\alpha E_{\\text{loc}}$ and $P = \\epsilon_0(\\epsilon_r - 1)E$, eliminating $E_{\\text{loc}}$ gives $\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2} = \\dfrac{N\\alpha}{3\\epsilon_0}$. For dilute gases ($\\epsilon_r \\approx 1$) it reduces to the first option.',
      trap: 'The first option is only the dilute-gas limit; it ignores the field of neighbouring dipoles.' },
    { id: 'die-025', type: 'nat', level: 3, exams: ['jam'], sub: 'energy', unit: 'mJ',
      q: 'A $2.0\\,\\mu$F capacitor charged to 100 V is connected across an uncharged $3.0\\,\\mu$F capacitor. The energy lost in the process is ______ mJ.',
      answer: 6, tol: 0.05,
      calc: () => { const Q = 2e-6 * 100, V = Q / 5e-6; return (0.5 * 2e-6 * 100 ** 2 - 0.5 * 5e-6 * V * V) * 1e3; },
      sol: 'Initial energy $\\tfrac12(2\\times10^{-6})(100)^2 = 10$ mJ. Charge $200\\,\\mu$C is shared at a common voltage $V = 200/5 = 40$ V. Final energy $\\tfrac12(5\\times10^{-6})(40)^2 = 4$ mJ. Lost: 6 mJ, as heat in the wires and as radiation. In general the loss is $\\dfrac{C_1C_2}{2(C_1+C_2)}(V_1 - V_2)^2$, whatever the resistance.',
      trap: 'Assuming energy is conserved because charge is. It is not: there is always loss when capacitors at different voltages are joined.' },
    { id: 'die-026', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'D field',
      q: 'Which of these statements about the electric displacement $\\vec D$ are correct?',
      options: ['Its flux through any closed surface equals the free charge enclosed.', 'Its curl is always zero, so it is the gradient of a potential.', 'In a region of linear dielectrics, its lines begin and end only on free charges.', 'Its full vector is continuous across any boundary between dielectrics.'], answer: [0, 2],
      sol: '$\\oint\\vec D\\cdot d\\vec a = Q_{f,\\text{enc}}$, so $\\vec D$ lines start and end only on free charge. But $\\nabla\\times\\vec D = \\nabla\\times\\vec P$, which need not vanish (for example at the edges of a polarised bar), so $\\vec D$ is not generally a gradient. At a boundary only $D_\\perp$ is continuous (with no free surface charge); $D_\\parallel$ jumps.',
      trap: 'Treating $\\vec D$ as "just like $\\vec E$ but with free charge". Its curl is not zero in general, so you cannot use Coulomb\'s law with free charges to get $\\vec D$.' },
    { id: 'die-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'slabs and layers',
      q: 'The gap $d$ of a parallel-plate capacitor (area $A$) is filled with two layers of equal thickness $d/2$, one with $\\kappa = 2$ and one with $\\kappa = 4$. The capacitance, in units of $\\epsilon_0A/d$, is',
      options: ['$8/3$', '$3$', '$6$', '$4/3$'], answer: 0,
      sol: 'Stacked layers are in series. Each layer: $C_i = \\kappa_i\\epsilon_0A/(d/2) = 2\\kappa_i\\epsilon_0A/d$, giving $4$ and $8$ (in units of $\\epsilon_0A/d$). In series: $\\dfrac{4\\times8}{4+8} = \\dfrac{8}{3}$.',
      trap: '3 is the average of the two constants, which would be the side-by-side (parallel) answer.' },
    { id: 'die-028', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'bound charge', unit: '$\\mu$C/m$^2$',
      q: 'A capacitor\'s plates carry free charge density $\\pm6.0\\,\\mu$C/m$^2$ and the gap is filled by a dielectric of constant 3.0. The magnitude of the bound surface charge density on the face of the dielectric next to a plate is ______ $\\mu$C/m$^2$.',
      answer: 4, tol: 0.05, calc: () => 6 * (1 - 1 / 3),
      sol: '$D = \\sigma_f$, $E = \\sigma_f/(\\kappa\\epsilon_0)$, and $P = D - \\epsilon_0E = \\sigma_f(1 - 1/\\kappa) = 6.0\\times\\tfrac23 = 4.0\\,\\mu$C/m$^2$. The bound charge on the face next to the positive plate is $-4.0\\,\\mu$C/m$^2$, leaving a net $2.0 = \\sigma_f/\\kappa$ to make the field.',
      trap: 'Taking $\\sigma_b = \\sigma_f/\\kappa$ (that is the net charge seen by the field, not the bound charge).' },
    // ---------- level 4 ----------
    { id: 'die-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'slabs and layers', unit: '$\\epsilon_0A/d$',
      q: 'The permittivity in the gap of a parallel-plate capacitor rises linearly from $\\epsilon_0$ at one plate to $2\\epsilon_0$ at the other: $\\epsilon(x) = \\epsilon_0(1 + x/d)$. The capacitance, in units of $\\epsilon_0A/d$, is ______ (to three decimal places).',
      answer: 1.443, tol: 0.005, calc: () => 1 / Math.log(2),
      sol: 'The gap is a stack of thin layers in series: $\\dfrac1C = \\int_0^d\\dfrac{dx}{\\epsilon(x)A} = \\dfrac{d}{\\epsilon_0A}\\int_0^1\\dfrac{du}{1+u} = \\dfrac{d\\ln2}{\\epsilon_0A}$. So $C = \\dfrac{1}{\\ln2}\\dfrac{\\epsilon_0A}{d} = 1.443\\,\\epsilon_0A/d$.',
      trap: 'Using the average permittivity $1.5\\epsilon_0$. Series layers average $1/\\epsilon$, not $\\epsilon$.' },
    { id: 'die-030', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'bound charge',
      q: 'A sphere is uniformly polarised with polarisation $\\vec P$ (a permanent electret, no external field). The field inside the sphere is',
      options: ['$-\\dfrac{\\vec P}{\\epsilon_0}$', 'zero', '$-\\dfrac{\\vec P}{3\\epsilon_0}$', '$+\\dfrac{\\vec P}{3\\epsilon_0}$'], answer: 2,
      sol: 'The bound charge is only on the surface, $\\sigma_b = P\\cos\\theta$. A sphere with $\\sigma = \\sigma_0\\cos\\theta$ has a uniform field $-\\sigma_0/(3\\epsilon_0)$ along the axis inside (and a dipole field outside). So $\\vec E_{\\text{in}} = -\\vec P/(3\\epsilon_0)$, opposite to $\\vec P$: the depolarising field.',
      trap: '$-\\vec P/\\epsilon_0$ is the field inside a thin slab polarised across its thickness; the shape matters.' },
    { id: 'die-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'energy', unit: 'J',
      q: 'A capacitor has capacitance $5.0\\,\\mu$F with air in the gap. With a slab of constant 4.0 filling the gap, it is charged to 120 V and disconnected. The slab is then pulled out completely. The work done by the person pulling it is ______ J (to three decimal places).',
      answer: 0.432, tol: 0.004,
      calc: () => { const Ci = 20e-6, Cf = 5e-6, Q = Ci * 120; return Q * Q / 2 * (1 / Cf - 1 / Ci); },
      sol: 'With the slab, $C_i = 20\\,\\mu$F and $Q = 20\\times10^{-6}\\times120 = 2.4$ mC, which stays fixed. $U_i = \\dfrac{Q^2}{2C_i} = 0.144$ J, $U_f = \\dfrac{Q^2}{2C_f} = 0.576$ J. No battery and no heat (slowly), so the work done is $U_f - U_i = 0.432$ J. The voltage rises to 480 V.',
      trap: 'Using $\\tfrac12CV^2$ with $V = 120$ V both times, as if the battery were still connected (that gives a negative answer).' },
    { id: 'die-032', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'dielectric sphere',
      q: 'A sphere of linear dielectric ($\\epsilon_r > 1$) is placed in a uniform field $\\vec E_0$. Which statements are correct?',
      options: ['The field inside is uniform.', 'The field inside is weaker than $E_0$.', 'The polarisation is $\\vec P = 3\\epsilon_0\\dfrac{\\epsilon_r - 1}{\\epsilon_r + 2}\\vec E_0$.', 'The sphere acquires a net bound charge.'], answer: [0, 1, 2],
      sol: '$\\vec E_{\\text{in}} = \\dfrac{3}{\\epsilon_r+2}\\vec E_0$: uniform and smaller than $E_0$ for $\\epsilon_r > 1$. Then $\\vec P = \\epsilon_0(\\epsilon_r - 1)\\vec E_{\\text{in}} = 3\\epsilon_0\\dfrac{\\epsilon_r-1}{\\epsilon_r+2}\\vec E_0$. Bound charges always total zero.',
      trap: 'As $\\epsilon_r \\to \\infty$ the result tends to the conducting sphere: $E_{\\text{in}} \\to 0$ and $P \\to 3\\epsilon_0E_0$, matching $\\sigma = 3\\epsilon_0E_0\\cos\\theta$.' },
    { id: 'die-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'bound charge', unit: 'nC',
      q: 'A point charge of $+10$ nC is embedded at the centre of a very large block of linear dielectric with $\\epsilon_r = 5$. The total bound charge gathered on the surface of the small cavity round the charge is ______ nC.',
      answer: -8, tol: 0.05, calc: () => -10 * (1 - 1 / 5),
      sol: 'Gauss for $\\vec D$: $D = q/(4\\pi r^2)$, so $E = q/(4\\pi\\epsilon_0\\epsilon_rr^2)$: the charge looks like $q/\\epsilon_r = 2$ nC. The difference comes from bound charge right next to it: $q_b = q/\\epsilon_r - q = -q(1 - 1/\\epsilon_r) = -8$ nC. (Inside a uniform linear dielectric $\\rho_b = 0$ away from free charge, and the matching $+8$ nC sits on the far outer surface of the block.)',
      trap: 'Answering $-2$ nC or $+2$ nC: 2 nC is the screened charge the field sees, not the bound charge.' },
    { id: 'die-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'battery connected or isolated',
      q: 'A parallel-plate capacitor stays connected to a battery. Its plate separation is doubled, and at the same time the new gap is completely filled with a dielectric of constant 3. The stored energy',
      options: ['triples', 'becomes 2/3 of its old value', 'is unchanged', 'becomes 3/2 of its old value'], answer: 3,
      sol: '$C = \\kappa\\epsilon_0A/d$ changes by $3/2$. With $V$ fixed, $U = \\tfrac12CV^2$ also changes by $3/2$.',
      trap: 'Using $U = Q^2/2C$ with $Q$ fixed, which gives 2/3: that is the isolated case.' },
    { id: 'die-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'leaky capacitors', unit: 's',
      q: 'A capacitor of any shape is filled with a weakly conducting material of relative permittivity 4.0 and conductivity $1.0\\times10^{-10}$ S/m. Once charged and isolated, its charge leaks away with time constant ______ s (to three decimal places).',
      answer: 0.354, tol: 0.004, calc: () => 4 * e0 / 1e-10,
      sol: 'For any shape: $J = \\sigma E$ and Gauss\'s law for $\\vec D$ ($\\oint\\vec D\\cdot d\\vec a = Q$, with $D = \\epsilon E$) give the leakage current from the positive electrode $I = \\sigma\\oint\\vec E\\cdot d\\vec a = \\sigma Q/\\epsilon$. So $dQ/dt = -(\\sigma/\\epsilon)Q$ and $\\tau = RC = \\epsilon/\\sigma$. $\\tau = \\dfrac{4.0\\times8.854\\times10^{-12}}{1.0\\times10^{-10}} = 0.354$ s.',
      trap: 'Trying to find $R$ and $C$ separately: the geometry cancels completely.' },
    { id: 'die-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'bound charge',
      q: 'A capacitor with free charge $\\pm\\sigma$ on its plates has two dielectric layers: $\\kappa_1 = 2$ next to the positive plate and $\\kappa_2 = 4$ next to the negative plate. The bound surface charge at the interface between the two layers is',
      options: ['$+\\sigma/4$', '$-\\sigma/4$', 'zero, since the interface has no free charge', '$-\\sigma/2$'], answer: 1,
      sol: '$D = \\sigma$ throughout (pointing from $+$ to $-$). $P_1 = \\sigma(1 - 1/2) = \\sigma/2$, $P_2 = \\sigma(1 - 1/4) = 3\\sigma/4$. At the interface, layer 1\'s face (outward normal along $D$) carries $+P_1$ and layer 2\'s face (outward normal against $D$) carries $-P_2$. Total $\\sigma/2 - 3\\sigma/4 = -\\sigma/4$. Check with the field jump: $\\epsilon_0(E_2 - E_1) = \\sigma(1/4 - 1/2) = -\\sigma/4$.',
      trap: 'No free charge does not mean no charge: the bound charges of the two layers do not cancel when the constants differ.' },
    // ---------- level 5 ----------
    { id: 'die-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'force on a slab', unit: 'mm',
      q: 'Two vertical parallel plates 2.0 mm apart dip into an oil of dielectric constant 3.0 and density 900 kg/m$^3$, and are held at 5.0 kV. Taking $g = 9.8$ m/s$^2$, the oil between the plates rises above the outside level by ______ mm (to two decimal places).',
      answer: 6.27, tol: 0.07, calc: () => e0 * 2 * 5000 ** 2 / (2 * 900 * 9.8 * 2e-3 ** 2) * 1e3,
      sol: 'The upward electric force per unit width is $F/w = \\dfrac{\\epsilon_0(\\kappa-1)V^2}{2d}$ (the slab force at fixed $V$). It holds up a column of mass $\\rho g h d$ per unit width. So $h = \\dfrac{\\epsilon_0(\\kappa-1)V^2}{2\\rho gd^2} = \\dfrac{(8.854\\times10^{-12})(2)(2.5\\times10^7)}{2(900)(9.8)(4\\times10^{-6})} = 6.27\\times10^{-3}$ m.',
      trap: 'Using $\\kappa$ in place of $\\kappa - 1$, or forgetting that the column\'s weight per width involves $d$ once and the force divides by $d$ once more.' },
    { id: 'die-038', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'battery connected or isolated',
      q: 'A parallel-plate capacitor (gap $d$) is kept at voltage $V$ by a battery, and a dielectric of constant $\\kappa$ fills the gap. Compared with the empty capacitor at the same $V$, which statements are correct?',
      options: ['The free charge on the plates is $\\kappa$ times larger.', 'The field in the gap is still $V/d$.', 'The free surface charge density is $\\kappa\\epsilon_0V/d$.', 'The bound surface charge density on the dielectric is $\\kappa\\epsilon_0V/d$.'], answer: [0, 1, 2],
      sol: 'With $V$ fixed, $E = V/d$ is unchanged. Then $D = \\kappa\\epsilon_0V/d = \\sigma_f$, $\\kappa$ times the empty value. $P = D - \\epsilon_0E = (\\kappa - 1)\\epsilon_0V/d$, which is the bound density magnitude, not $\\kappa\\epsilon_0V/d$.',
      trap: 'The bound charge is always smaller than the free charge by exactly $\\epsilon_0E$; that leftover is what makes the field.' },
    { id: 'die-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'images in dielectrics',
      q: 'A point charge $q$ in vacuum is at distance $d$ from the flat surface of a semi-infinite linear dielectric with constant $\\kappa$. For the field in the vacuum region, the dielectric can be replaced by an image charge at the mirror point equal to',
      options: ['$+q\\dfrac{\\kappa-1}{\\kappa+1}$', '$-q$', '$-q\\dfrac{\\kappa-1}{\\kappa+1}$', '$-q/\\kappa$'], answer: 2,
      sol: 'Describe the vacuum side by $q$ plus an image $q\'$ at the mirror point, and the dielectric side by a single charge $q\'\'$ at $q$\'s position with potential $q\'\'/(4\\pi\\epsilon r)$. On the surface, continuity of $V$ gives $q + q\' = q\'\'/\\kappa$, and continuity of $D_\\perp$ gives $q - q\' = q\'\'$. Solving: $q\'\' = \\dfrac{2\\kappa q}{\\kappa+1}$ and $q\' = -q\\dfrac{\\kappa-1}{\\kappa+1}$. Limits: $\\kappa = 1$ gives no image; $\\kappa\\to\\infty$ gives $-q$, the conductor. So the charge is always attracted to the dielectric.',
      trap: 'A positive image would mean repulsion; a dielectric (like any neutral polarisable body) attracts.' },
    { id: 'die-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'spherical and cylindrical', unit: 'pF',
      q: 'A spherical capacitor has radii $a = 2.0$ cm and $b = 4.0$ cm. The space between is filled with a dielectric whose constant varies as $\\kappa(r) = r/a$. Its capacitance is ______ pF (to two decimal places).',
      answer: 5.93, tol: 0.06, calc: () => { const a = 0.02, b = 0.04; return 8 * Math.PI * e0 * a * b * b / (b * b - a * a) * 1e12; },
      sol: 'Gauss for $\\vec D$: $D = Q/(4\\pi r^2)$, so $E = \\dfrac{Q}{4\\pi\\epsilon_0\\kappa(r)r^2} = \\dfrac{Qa}{4\\pi\\epsilon_0r^3}$. $V = \\int_a^bE\\,dr = \\dfrac{Qa}{8\\pi\\epsilon_0}\\left(\\dfrac1{a^2} - \\dfrac1{b^2}\\right)$. So $C = \\dfrac{8\\pi\\epsilon_0ab^2}{b^2 - a^2} = \\dfrac{8\\pi(8.854\\times10^{-12})(0.02)(0.0016)}{0.0012} = 5.93$ pF.',
      trap: 'Multiplying the vacuum answer by an average $\\kappa$; the field must be integrated with $\\kappa(r)$ inside.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'die-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'battery connected or isolated', format: 'comparison',
      make(r) {
        const K = Q5.int(r, 2, 6), conn = r() < 0.5, w = Q5.int(r, 0, 3);
        const names = ['the charge on the plates', 'the potential difference between the plates', 'the electric field between the plates', 'the stored energy'];
        const fac = conn ? ['K', '1', '1', 'K'][w] : ['1', '1/K', '1/K', '1/K'][w];
        const show = (f) => (f === 'K' ? `$${K}$ times its old value` : f === '1/K' ? `$1/${K}$ of its old value` : f === 'K2' ? `$${K * K}$ times its old value` : 'unchanged');
        const o = Q5.mcqOptions(r, show(fac), ['K', '1/K', '1', 'K2'].filter((f) => f !== fac).map(show));
        return { q: `A parallel-plate capacitor is charged by a battery and ${conn ? 'stays connected to it' : 'then disconnected from it'}. A slab of dielectric constant $${K}$ is slid in to fill the gap completely. Afterwards ${names[w]} is`, ...o,
          sol: conn ? `Connected: $V$ is held fixed. $C$ becomes $${K}C$, so $Q = CV$ grows $${K}$ times; $E = V/d$ is unchanged; $U = \\tfrac12CV^2$ grows $${K}$ times (the battery supplies the extra).`
            : `Isolated: $Q$ is fixed. $C$ becomes $${K}C$, so $V = Q/C$ falls to $1/${K}$, $E = V/d$ falls to $1/${K}$ (bound charge on the slab partly cancels the free charge), and $U = Q^2/2C$ falls to $1/${K}$ (the field pulls the slab in and does work).`,
          trap: 'First ask what is held fixed: $V$ (battery connected) or $Q$ (isolated).' };
      } },
    { id: 'die-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['The normal component of $\\vec D$ is continuous across the boundary.', 'The tangential component of $\\vec E$ is continuous across the boundary.', 'Field lines bend so that $\\tan\\theta_1/\\tan\\theta_2 = \\varepsilon_1/\\varepsilon_2$ (angles from the normal).',
          'Bound (polarisation) charge appears on the boundary.', 'The normal component of $\\vec E$ jumps across the boundary.'];
        const F = ['The normal component of $\\vec E$ is continuous across the boundary.', 'The tangential component of $\\vec D$ is continuous across the boundary.', 'Field lines cross the boundary without bending.',
          'Field lines bend so that $\\sin\\theta_1/\\sin\\theta_2 = \\varepsilon_1/\\varepsilon_2$.', 'No charge of any kind can sit on the boundary.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `An electrostatic field crosses the flat boundary between two linear dielectrics of permittivities $\\varepsilon_1 \\ne \\varepsilon_2$, with no free charge on the boundary. Which statements are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'With no free surface charge, Gauss law for $\\vec D$ on a pillbox gives $D_{1n} = D_{2n}$, so $\\varepsilon_1E_{1n} = \\varepsilon_2E_{2n}$: $E_n$ jumps. Curl $\\vec E = 0$ on a thin loop gives $E_{1t} = E_{2t}$, so $D_t$ jumps. Dividing: $\\tan\\theta_1/\\tan\\theta_2 = (E_t/E_{1n})/(E_t/E_{2n}) = \\varepsilon_1/\\varepsilon_2$. The jump in $E_n$ is caused by bound charge $\\sigma_b = \\varepsilon_0(E_{2n} - E_{1n})$ on the boundary.',
          trap: '$\\vec D$ keeps its normal part, $\\vec E$ keeps its tangential part; and the law is about tangents, not sines.' };
      } },
    { id: 'die-t23', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions', unit: 'degrees',
      make(r) {
        const e1 = Q5.int(r, 1, 4), e2 = Q5.int(r, 2, 9), t1 = Q5.int(r, 10, 70);
        const t2 = Math.atan(e2 / e1 * Math.tan(t1 * Math.PI / 180)) * 180 / Math.PI;
        return { q: `An electric field in a dielectric with $\\varepsilon_r = ${e1}$ meets a flat boundary with a dielectric of $\\varepsilon_r = ${e2}$ (no free charge on the boundary), making $${t1}^\\circ$ with the normal. In the second dielectric the field makes ______ degrees with the normal (to two decimal places).`,
          answer: Q5.round(t2, 2), tol: 0.02, e1, e2, t1,
          sol: `$E_t$ is continuous and $\\varepsilon E_n$ is continuous, so $\\tan\\theta_2 = \\dfrac{\\varepsilon_2}{\\varepsilon_1}\\tan\\theta_1 = \\dfrac{${e2}}{${e1}}\\tan${t1}^\\circ = ${Q5.round(e2 / e1 * Math.tan(t1 * Math.PI / 180), 4)}$, so $\\theta_2 = ${Q5.round(t2, 2)}^\\circ$.`,
          trap: 'In the medium of larger permittivity the field bends away from the normal.' };
      },
      verify: (p) => { const t = p.t1 * Math.PI / 180, Et = Math.sin(t), En2 = p.e1 * Math.cos(t) / p.e2; return Math.atan2(Et, En2) * 180 / Math.PI; } },
    { id: 'die-t24', type: 'mcq', level: 3, exams: ['jam'], sub: 'slabs and layers', format: 'comparison',
      make(r) {
        const K = Q5.int(r, 2, 8);
        const o = Q5.mcqOptions(r, q5frac((1 + K) ** 2, 4 * K), [q5frac(4 * K, (1 + K) ** 2), q5frac(1 + K, 2), q5frac(2 * K, 1 + K), q5frac(1 + K, 2 * K)], (s) => `$${s}$`);
        return { q: `Two identical parallel-plate capacitors are each half filled with a dielectric of constant $${K}$. In P the slab fills the left half of the plate area through the whole gap; in Q the slab covers the whole area but fills half the gap. The ratio $C_P/C_Q$ is`, ...o,
          sol: `P is two capacitors in parallel: $C_P = \\tfrac12C_0 + \\tfrac12${K}C_0 = \\tfrac{1 + ${K}}{2}C_0$. Q is two in series, each $2C_0$ and $2\\cdot${K}C_0$: $C_Q = \\dfrac{2\\cdot${K}}{1 + ${K}}C_0$. Ratio $= \\dfrac{(1 + ${K})^2}{4\\cdot${K}} = ${q5frac((1 + K) ** 2, 4 * K)}$, larger than 1 for any $K \\ne 1$.`,
          trap: 'Side by side means parallel (add $C$); layers mean series (add $1/C$).' };
      } },
    { id: 'die-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'energy', unit: 'μJ',
      make(r) {
        const C0 = Q5.int(r, 1, 20) * 10, V0 = Q5.int(r, 2, 30) * 10, K = Q5.choose(r, [2, 3, 4, 5, 2.5]);
        const U0 = 0.5 * C0 * 1e-12 * V0 * V0 * 1e6, W = U0 * (1 - 1 / K);
        return { q: `A $${C0}$ pF air capacitor is charged to $${V0}$ V and disconnected. A slab of dielectric constant $${K}$ is then pulled into the gap by the field until it fills it. The work done by the field on the slab is ______ $\\mu$J (to four decimal places).`,
          answer: Q5.round(W, 4), tol: Math.max(0.0001, Q5.round(W * 0.001, 5)), C0, V0, K,
          sol: `The charge stays $Q = C_0V_0$. The energy falls from $U_0 = \\tfrac12C_0V_0^2 = ${Q5.round(U0, 4)}\\ \\mu$J to $U_0/${K}$. The lost energy is the work done on the slab: $U_0(1 - 1/${K}) = ${Q5.round(W, 4)}\\ \\mu$J.`,
          trap: 'With the battery disconnected, energy falls; with it connected, energy rises (the battery does work).' };
      },
      verify: (p) => { const C = p.C0 * 1e-12, Q = C * p.V0; return (Q * Q / (2 * C) - Q * Q / (2 * p.K * C)) * 1e6; } },
    { id: 'die-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'parallel plate', unit: 'pF',
      make(r) {
        const A = int(r, 1, 50), d = pick(r, 0.5, 5, 0.5), k = choose(r, [1, 2, 2.2, 3, 4, 5, 6.5, 10]); // A in 10^-3 m^2, d in mm
        const Cp = k * e0 * A * 1e-3 / (d * 1e-3) * 1e12;
        return { q: `Plates of area $${A}\\times10^{-3}$ m$^2$ are ${d} mm apart with a dielectric of constant ${k} filling the gap. The capacitance is ______ pF (to three significant figures).`,
          answer: +Cp.toPrecision(3), tol: Math.max(Cp * 0.01, 0.01), A, d, k,
          sol: `$C = \\dfrac{\\kappa\\epsilon_0A}{d} = \\dfrac{${k}\\times8.854\\times10^{-12}\\times${A}\\times10^{-3}}{${d}\\times10^{-3}} \\approx ${fmt(Cp, 3)}$ pF.`,
          trap: 'Convert mm to m.' };
      },
      verify: (p) => p.k * e0 * p.A / p.d * 1e12 },
    { id: 'die-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'slabs and layers', unit: 'pF',
      make(r) {
        const d = int(r, 3, 10), t = int(r, 1, d - 1), k = choose(r, [2, 3, 4, 5, 6]), A = int(r, 1, 10); // mm, mm, -, 10^-2 m^2
        const Cp = e0 * A * 1e-2 / ((d - t + t / k) * 1e-3) * 1e12;
        return { q: `Plates of area $${A}\\times10^{-2}$ m$^2$ are ${d} mm apart. A slab ${t} mm thick of dielectric constant ${k} lies in the gap parallel to the plates. The capacitance is ______ pF (to three significant figures).`,
          answer: +Cp.toPrecision(3), tol: Math.max(Cp * 0.01, 0.01), A, d, t, k,
          sol: `Series: $C = \\dfrac{\\epsilon_0A}{d - t + t/\\kappa} = \\dfrac{8.854\\times10^{-12}\\times${A}\\times10^{-2}}{(${d - t} + ${round(t / k, 4)})\\times10^{-3}} \\approx ${fmt(Cp, 3)}$ pF.`,
          trap: 'The slab acts as if its thickness were divided by $\\kappa$.' };
      },
      verify: (p) => e0 * p.A * 1e-2 / ((p.d - p.t + p.t / p.k) * 1e-3) * 1e12 },
    { id: 'die-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'energy', unit: 'mJ',
      make(r) {
        const C1 = int(r, 1, 10), C2 = int(r, 1, 10), V1 = int(r, 2, 20) * 10, V2 = int(r, 0, 10) * 10; // uF, V
        const loss = C1 * C2 / (2 * (C1 + C2)) * (V1 - V2) ** 2 * 1e-3; // uF*V^2 = uJ -> mJ
        return { q: `A ${C1} $\\mu$F capacitor at ${V1} V is connected, positive plate to positive plate, across a ${C2} $\\mu$F capacitor at ${V2} V. The energy lost is ______ mJ (to three significant figures).`,
          answer: +loss.toPrecision(3), tol: Math.max(loss * 0.01, 0.001), C1, C2, V1, V2,
          sol: `Common voltage $V = \\dfrac{C_1V_1 + C_2V_2}{C_1 + C_2} = ${round((C1 * V1 + C2 * V2) / (C1 + C2), 3)}$ V. Energy lost $= \\dfrac{C_1C_2}{2(C_1+C_2)}(V_1 - V_2)^2 = \\dfrac{${C1 * C2}}{${2 * (C1 + C2)}}(${V1 - V2})^2\\,\\mu$J $\\approx ${fmt(loss, 3)}$ mJ.`,
          trap: 'Charge is conserved; energy is not.' };
      },
      verify: (p) => p.C1 * p.C2 / (2 * (p.C1 + p.C2)) * (p.V1 - p.V2) ** 2 * 1e-3 },
    { id: 'die-g04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'force on a slab', unit: '$\\mu$N',
      make(r) {
        const w = int(r, 5, 20), d = pick(r, 0.5, 4, 0.5), V = int(r, 1, 10) * 100, k = choose(r, [2, 3, 4, 5, 7]);
        const F = e0 * (k - 1) * (w / 100) * V * V / (2 * d * 1e-3) * 1e6;
        return { q: `A capacitor with plates ${w} cm wide and a ${d} mm gap is held at ${V} V by a battery. A slab of dielectric constant ${k} that fits the gap is partly inside. The force pulling it in is ______ $\\mu$N (to three significant figures).`,
          answer: +F.toPrecision(3), tol: Math.max(F * 0.01, 0.001), w, d, V, k,
          sol: `$F = \\dfrac{\\epsilon_0(\\kappa - 1)wV^2}{2d} = \\dfrac{(8.854\\times10^{-12})(${k - 1})(${w / 100})(${V})^2}{2(${d}\\times10^{-3})} \\approx ${fmt(F, 3)}\\,\\mu$N. It does not depend on how far in the slab is.`,
          trap: 'Use $\\kappa - 1$, the change in capacitance per length.' };
      },
      verify: (p) => e0 * (p.k - 1) * (p.w / 100) * p.V * p.V / (2 * p.d * 1e-3) * 1e6 },
    { id: 'die-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dielectric sphere', unit: 'V/m',
      make(r) {
        const er = choose(r, [1.5, 2, 2.5, 3, 4, 5, 7, 10]), E0 = int(r, 1, 20) * 50;
        const E = 3 * E0 / (er + 2);
        return { q: `A sphere of linear dielectric with $\\epsilon_r = ${er}$ sits in a uniform field of ${E0} V/m. The field inside it is ______ V/m (to one decimal place).`,
          answer: round(E, 1), tol: Math.max(E * 0.005, 0.1), er, E0,
          sol: `$E_{\\text{in}} = \\dfrac{3E_0}{\\epsilon_r + 2} = \\dfrac{3(${E0})}{${er + 2}} \\approx ${round(E, 1)}$ V/m, uniform and along $E_0$.`,
          trap: 'Not $E_0/\\epsilon_r$ (that is a slab across the field).' };
      },
      verify: (p) => 3 * p.E0 / (p.er + 2) },
    { id: 'die-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'battery connected or isolated',
      make(r) {
        const mode = choose(r, ['connected', 'isolated']), qty = choose(r, ['charge on the plates', 'voltage across the plates', 'field in the gap', 'stored energy']);
        const k = choose(r, [2, 3, 4, 5]);
        const table = { connected: { 'charge on the plates': 0, 'voltage across the plates': 2, 'field in the gap': 2, 'stored energy': 0 },
          isolated: { 'charge on the plates': 2, 'voltage across the plates': 1, 'field in the gap': 1, 'stored energy': 1 } };
        const options = [`multiplied by ${k}`, `divided by ${k}`, 'unchanged', `multiplied by ${k * k}`];
        const why = mode === 'connected' ? `$V$ is held fixed, $C \\to ${k}C$, so $Q = CV$ and $U = \\tfrac12CV^2$ grow by ${k}, while $E = V/d$ is unchanged.` : `$Q$ is fixed, $C \\to ${k}C$, so $V = Q/C$, $E = V/d$ and $U = Q^2/2C$ all fall by ${k}.`;
        return { q: `A parallel-plate capacitor ${mode === 'connected' ? 'stays connected to a battery' : 'is charged and then disconnected from its battery'}. A dielectric of constant ${k} is slid in to fill the gap. The ${qty} is`, options, answer: table[mode][qty],
          sol: why, trap: 'First decide what is held fixed: $V$ (battery connected) or $Q$ (isolated).' };
      } },
    { id: 'die-g07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'bound charge', unit: '$\\mu$C/m$^2$',
      make(r) {
        const s = int(r, 1, 20), k = choose(r, [1.5, 2, 2.5, 3, 4, 5, 8, 10]);
        const b = s * (1 - 1 / k);
        return { q: `The plates of a capacitor carry free charge density $\\pm${s}\\,\\mu$C/m$^2$ and a dielectric of constant ${k} fills the gap. The magnitude of the bound surface charge density on the dielectric is ______ $\\mu$C/m$^2$ (to two decimal places).`,
          answer: round(b, 2), tol: Math.max(b * 0.005, 0.01), s, k,
          sol: `$\\sigma_b = P = \\sigma_f(1 - 1/\\kappa) = ${s}(1 - 1/${k}) \\approx ${round(b, 2)}\\,\\mu$C/m$^2$, of opposite sign to the neighbouring plate.`,
          trap: 'The bound charge is $\\sigma_f(1 - 1/\\kappa)$, not $\\sigma_f/\\kappa$.' };
      },
      verify: (p) => p.s * (1 - 1 / p.k) },
    { id: 'die-g08', type: 'nat', level: 3, exams: ['jam'], sub: 'spherical and cylindrical', unit: 'pF',
      make(r) {
        const a = int(r, 1, 10), b = a + int(r, 1, 10), k = choose(r, [1, 2, 3, 4]);
        const Cp = 4 * Math.PI * e0 * k * (a / 100) * (b / 100) / ((b - a) / 100) * 1e12;
        return { q: `A spherical capacitor has radii ${a} cm and ${b} cm, with ${k === 1 ? 'vacuum' : `a dielectric of constant ${k}`} between them. Its capacitance is ______ pF (to three significant figures).`,
          answer: +Cp.toPrecision(3), tol: Math.max(Cp * 0.01, 0.01), a, b, k,
          sol: `$C = \\dfrac{4\\pi\\epsilon_0\\kappa ab}{b - a} = \\dfrac{${k}(${a / 100})(${b / 100})}{(8.99\\times10^9)(${(b - a) / 100})} \\approx ${fmt(Cp, 3)}$ pF.`,
          trap: 'Remember the outer sphere: not $4\\pi\\epsilon_0a$.' };
      },
      verify: (p) => 4 * Math.PI * e0 * p.k * (p.a / 100) * (p.b / 100) / ((p.b - p.a) / 100) * 1e12 },
    ...r4.gens,
  ],
};
