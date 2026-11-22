// Maxwell's equations and electromagnetic waves: displacement current, the four equations in vacuum and in
// matter, continuity, the wave equation and c, plane waves (directions, E/B = c, polarisation), energy density,
// the Poynting vector, intensity, momentum and radiation pressure, waves in dielectrics, reflection at normal
// incidence and at Brewster's angle, conductors and skin depth, plasma frequency.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const c = C.c, e0 = C.eps0, mu0 = C.mu0;

import * as Q5 from '../_util.js';
import more2 from './maxwell-em-waves.more2.gen.js';
import r4 from './maxwell-em-waves.r4.gen.js';

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
  topic: 'maxwell-em-waves',
  items: [
    // ---------- level 1 ----------
    { id: 'mxw-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'displacement current',
      q: 'Maxwell\'s displacement current density is',
      options: ['$\\epsilon_0\\dfrac{\\partial\\vec E}{\\partial t}$', '$\\sigma\\vec E$', '$\\mu_0\\dfrac{\\partial\\vec B}{\\partial t}$', '$\\rho\\vec v$'], answer: 0,
      sol: 'Maxwell added $\\vec J_d = \\epsilon_0\\,\\partial\\vec E/\\partial t$ to Ampère\'s law: $\\nabla\\times\\vec B = \\mu_0\\vec J + \\mu_0\\epsilon_0\\,\\partial\\vec E/\\partial t$. It is not a flow of charge, but it makes magnetic field exactly as a current does.',
      trap: '$\\sigma\\vec E$ and $\\rho\\vec v$ are conduction currents.' },
    { id: 'mxw-002', type: 'nat', level: 1, exams: ['jam'], sub: 'plane waves', unit: '$\\mu$T',
      q: 'A plane electromagnetic wave in vacuum has an electric field amplitude of 300 V/m. Its magnetic field amplitude is ______ $\\mu$T (to two decimal places).',
      answer: 1.00, tol: 0.01, calc: () => 300 / c * 1e6,
      sol: 'In a plane wave in vacuum $B_0 = E_0/c = 300/(3.00\\times10^8) = 1.00\\times10^{-6}$ T.',
      trap: 'Multiplying by $c$ instead of dividing.' },
    { id: 'mxw-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'maxwell equations',
      q: 'Which of Maxwell\'s equations expresses the absence of magnetic monopoles?',
      options: ['$\\nabla\\cdot\\vec E = \\rho/\\epsilon_0$', '$\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$', '$\\nabla\\cdot\\vec B = 0$', '$\\nabla\\times\\vec B = \\mu_0\\vec J + \\mu_0\\epsilon_0\\partial\\vec E/\\partial t$'], answer: 2,
      sol: 'If magnetic charge existed, $\\nabla\\cdot\\vec B$ would equal its density, as $\\nabla\\cdot\\vec E$ equals electric charge density over $\\epsilon_0$. $\\nabla\\cdot\\vec B = 0$ says magnetic field lines never start or end: the flux through any closed surface is zero.',
      trap: 'Faraday\'s law is about induction, not monopoles.' },
    { id: 'mxw-004', type: 'msq', level: 1, exams: ['jam'], sub: 'plane waves',
      q: 'For a plane electromagnetic wave travelling in vacuum, which statements are correct?',
      options: ['$\\vec E$ is perpendicular to $\\vec B$.', 'Both fields are perpendicular to the direction of travel.', '$\\vec E$ and $\\vec B$ oscillate in phase.', '$B_0 = cE_0$.'], answer: [0, 1, 2],
      sol: 'Plane waves in vacuum are transverse ($\\nabla\\cdot\\vec E = \\nabla\\cdot\\vec B = 0$), with $\\vec E\\perp\\vec B$ and $\\vec E\\times\\vec B$ along the direction of travel. Faraday\'s law gives $kE_0 = \\omega B_0$, so they are in phase and $B_0 = E_0/c$.',
      trap: '$B_0 = cE_0$ would make $B$ enormous; it is $E_0/c$.' },
    { id: 'mxw-005', type: 'nat', level: 1, exams: ['jam'], sub: 'wave equation', unit: '$10^8$ m/s',
      q: 'Using $\\mu_0 = 1.2566\\times10^{-6}$ H/m and $\\epsilon_0 = 8.854\\times10^{-12}$ F/m, the speed $1/\\sqrt{\\mu_0\\epsilon_0}$ is ______ $\\times10^8$ m/s (to three decimal places).',
      answer: 2.998, tol: 0.002, calc: () => 1 / Math.sqrt(1.2566e-6 * 8.854e-12) / 1e8,
      sol: '$\\mu_0\\epsilon_0 = 1.2566\\times10^{-6}\\times8.854\\times10^{-12} = 1.1126\\times10^{-17}$ s$^2$/m$^2$, and $1/\\sqrt{1.1126\\times10^{-17}} = 2.998\\times10^8$ m/s. Maxwell recognised this as the measured speed of light.',
      trap: 'Forgetting the square root.' },
    { id: 'mxw-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'energy and intensity',
      q: 'The time-averaged intensity of a plane wave in vacuum with electric field amplitude $E_0$ is',
      options: ['$c\\epsilon_0E_0^2$', '$\\tfrac12\\epsilon_0E_0^2$', '$\\tfrac12c\\epsilon_0E_0^2$', '$\\dfrac{E_0^2}{c\\mu_0}$ with no factor'], answer: 2,
      sol: 'The energy density is $u = \\epsilon_0E^2$ (half electric, half magnetic); its average over a cycle is $\\tfrac12\\epsilon_0E_0^2$. It travels at $c$, so $I = \\tfrac12c\\epsilon_0E_0^2 = \\dfrac{E_0^2}{2\\mu_0c}$.',
      trap: '$\\tfrac12\\epsilon_0E_0^2$ is the average energy density (J/m$^3$), not the intensity (W/m$^2$).' },
    // ---------- level 2 ----------
    { id: 'mxw-007', type: 'nat', level: 2, exams: ['jam'], sub: 'energy and intensity', unit: 'W/m$^2$',
      q: 'A plane wave in vacuum has electric field amplitude 100 V/m. Its average intensity is ______ W/m$^2$ (to one decimal place).',
      answer: 13.3, tol: 0.1, calc: () => 0.5 * c * e0 * 100 ** 2,
      sol: '$I = \\tfrac12c\\epsilon_0E_0^2 = \\tfrac12(3.00\\times10^8)(8.854\\times10^{-12})(10^4) = 13.3$ W/m$^2$.',
      trap: 'Using the rms field with the factor $\\tfrac12$ as well ($E_{\\text{rms}}^2 = E_0^2/2$ already contains it).' },
    { id: 'mxw-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'plane waves',
      q: 'The electric field of a plane wave in vacuum is $\\vec E = E_0\\sin(kz - \\omega t)\\,\\hat x$ (with $k, \\omega > 0$). Its magnetic field points along',
      options: ['$-\\hat y$', '$\\hat z$', '$\\hat x$', '$+\\hat y$, in phase with $\\vec E$'], answer: 3,
      sol: 'The wave travels along $+z$ (phase $kz - \\omega t$). $\\vec E\\times\\vec B$ must point along $+\\hat z$; with $\\vec E$ along $\\hat x$, $\\hat x\\times\\hat y = \\hat z$, so $\\vec B = (E_0/c)\\sin(kz - \\omega t)\\,\\hat y$.',
      trap: '$-\\hat y$ would describe a wave going the other way.' },
    { id: 'mxw-009', type: 'nat', level: 2, exams: ['jam'], sub: 'displacement current', unit: 'mA',
      q: 'Between the circular plates (area 0.010 m$^2$) of a charging capacitor, the uniform electric field grows at $1.0\\times10^{12}$ V m$^{-1}$ s$^{-1}$. The displacement current between the plates is ______ mA (to one decimal place).',
      answer: 88.5, tol: 0.9, calc: () => e0 * 0.01 * 1e12 * 1000,
      sol: '$I_d = \\epsilon_0\\dfrac{d\\Phi_E}{dt} = \\epsilon_0A\\dfrac{dE}{dt} = (8.854\\times10^{-12})(0.010)(10^{12}) = 0.0885$ A. It equals the conduction current in the wires feeding the plates.',
      trap: 'Thinking the current between the plates is zero because no charge crosses the gap.' },
    { id: 'mxw-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'momentum and pressure',
      q: 'A beam of intensity $I$ falls normally on a perfectly absorbing surface. The radiation pressure is',
      options: ['$2I/c$', '$I/c$', '$Ic$', '$I/(2c)$'], answer: 1,
      sol: 'Light carries momentum $U/c$ for energy $U$. Absorbed at normal incidence, momentum $I/c$ per unit area per second is delivered: pressure $I/c$. A perfect mirror reverses the momentum, giving $2I/c$.',
      trap: '$2I/c$ is the reflecting case.' },
    { id: 'mxw-011', type: 'nat', level: 2, exams: ['jam'], sub: 'momentum and pressure', unit: '$\\mu$N',
      q: 'Sunlight of intensity 1360 W/m$^2$ falls normally on a perfectly reflecting sail of area 1.0 m$^2$. The force on the sail is ______ $\\mu$N (to two decimal places).',
      answer: 9.07, tol: 0.05, calc: () => 2 * 1360 / c * 1e6,
      sol: 'Reflection reverses the momentum: $F = 2IA/c = 2(1360)(1.0)/(3.00\\times10^8) = 9.07\\times10^{-6}$ N. Tiny, but it never stops pushing, which is the idea behind solar sails.',
      trap: 'Using $I/c$ (absorber) halves the answer.' },
    { id: 'mxw-012', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'displacement current',
      q: 'Which statements about the displacement current are correct?',
      options: ['Taking the divergence of the Ampère-Maxwell law and using Gauss\'s law gives the continuity equation $\\nabla\\cdot\\vec J + \\partial\\rho/\\partial t = 0$.', 'Without it, Ampère\'s law would contradict charge conservation whenever charge density changes.', 'It produces a magnetic field in the same way as a conduction current.', 'It consists of charges moving through the gap of a capacitor.'], answer: [0, 1, 2],
      sol: '$\\nabla\\cdot(\\nabla\\times\\vec B) = 0$, so $0 = \\mu_0\\nabla\\cdot\\vec J + \\mu_0\\epsilon_0\\,\\partial(\\nabla\\cdot\\vec E)/\\partial t = \\mu_0(\\nabla\\cdot\\vec J + \\partial\\rho/\\partial t)$. Without the extra term we would need $\\nabla\\cdot\\vec J = 0$ always, false while a capacitor charges. The term enters Ampère\'s law exactly like $\\vec J$, so it makes $\\vec B$ just the same. No charge crosses the gap: it is a changing field.',
      trap: 'The word "current" misleads: nothing flows.' },
    { id: 'mxw-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'waves in matter',
      q: 'An electromagnetic wave travels in a non-magnetic medium of relative permittivity 4. Its speed is',
      options: ['$c/4$', '$c/2$', '$2c$', '$c/16$'], answer: 1,
      sol: '$v = \\dfrac{1}{\\sqrt{\\mu\\epsilon}} = \\dfrac{c}{\\sqrt{\\mu_r\\epsilon_r}} = \\dfrac{c}{\\sqrt4} = \\dfrac c2$. The refractive index is $n = \\sqrt{\\epsilon_r} = 2$.',
      trap: 'Dividing by $\\epsilon_r$ instead of its square root.' },
    { id: 'mxw-014', type: 'nat', level: 2, exams: ['jam'], sub: 'waves in matter', unit: 'nm',
      q: 'Light of vacuum wavelength 600 nm enters water ($n = 1.33$). Its wavelength in the water is ______ nm (to the nearest whole number).',
      answer: 451, tol: 1, calc: () => 600 / 1.33,
      sol: 'The frequency is fixed by the source and does not change at a boundary; the speed falls to $c/n$, so $\\lambda = \\lambda_0/n = 600/1.33 = 451$ nm.',
      trap: 'Changing the frequency instead of the wavelength.' },
    { id: 'mxw-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy and intensity',
      q: 'In a plane electromagnetic wave in vacuum, the energy density in the magnetic field is, compared with that in the electric field,',
      options: ['$c$ times larger', '$c^2$ times smaller', 'half as large', 'equal at every instant'], answer: 3,
      sol: '$u_B = \\dfrac{B^2}{2\\mu_0} = \\dfrac{E^2}{2\\mu_0c^2} = \\dfrac{\\epsilon_0E^2}{2} = u_E$, using $B = E/c$ and $c^2 = 1/(\\mu_0\\epsilon_0)$. The tiny $B$ is compensated by the tiny $\\mu_0$.',
      trap: 'Comparing $B$ and $E$ directly ($B = E/c$ is "small") instead of the energies.' },
    { id: 'mxw-016', type: 'nat', level: 2, exams: ['jam'], sub: 'plane waves', unit: 'm',
      q: 'An FM radio station broadcasts at 100 MHz. The wavelength is ______ m (to two decimal places).',
      answer: 3.00, tol: 0.01, calc: () => c / 1e8,
      sol: '$\\lambda = c/f = (3.00\\times10^8)/(1.00\\times10^8) = 3.00$ m. A quarter-wave antenna would be 75 cm long.',
      trap: 'Using MHz as $10^3$ Hz.' },
    // ---------- level 3 ----------
    { id: 'mxw-017', type: 'nat', level: 3, exams: ['jam'], sub: 'energy and intensity', unit: 'V/m',
      q: 'A 1.0 mW laser beam has a uniform circular cross-section of diameter 1.0 mm. The amplitude of its electric field is ______ V/m (to the nearest ten).',
      answer: 980, tol: 10, calc: () => Math.sqrt(2 * (1e-3 / (Math.PI * 5e-4 ** 2)) / (c * e0)),
      sol: '$I = P/A = \\dfrac{10^{-3}}{\\pi(5.0\\times10^{-4})^2} = 1273$ W/m$^2$. From $I = \\tfrac12c\\epsilon_0E_0^2$: $E_0 = \\sqrt{\\dfrac{2I}{c\\epsilon_0}} = \\sqrt{\\dfrac{2546}{2.654\\times10^{-3}}} = 980$ V/m.',
      trap: 'Using the diameter as the radius (dividing the intensity by 4).' },
    { id: 'mxw-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'plane waves',
      q: 'A plane wave in vacuum has $\\vec B = B_0\\cos(kx + \\omega t)\\,\\hat z$ ($k, \\omega > 0$). Its electric field is',
      options: ['$cB_0\\cos(kx + \\omega t)\\,\\hat y$', '$cB_0\\cos(kx + \\omega t)\\,\\hat x$', '$-cB_0\\cos(kx + \\omega t)\\,\\hat y$', '$(B_0/c)\\cos(kx + \\omega t)\\,\\hat y$'], answer: 2,
      sol: 'The phase $kx + \\omega t$ means travel along $-\\hat x$. We need $\\vec E\\times\\vec B$ along $-\\hat x$ with $\\vec B$ along $\\hat z$ (when the cosine is positive). $\\hat y\\times\\hat z = +\\hat x$, so $\\vec E$ must be along $-\\hat y$: $\\vec E = -cB_0\\cos(kx + \\omega t)\\,\\hat y$. Check with Faraday: $\\partial B_z/\\partial t = -\\omega B_0\\sin$, and $-(\\nabla\\times\\vec E)_z = -\\partial E_y/\\partial x = -ckB_0\\sin = -\\omega B_0\\sin$. ✓',
      trap: 'Assuming every wave travels along $+x$ and choosing $+\\hat y$.' },
    { id: 'mxw-019', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'poynting vector',
      q: 'Which statements about the Poynting vector $\\vec S = \\vec E\\times\\vec B/\\mu_0$ are correct?',
      options: ['It gives the rate of energy flow per unit area.', 'Its SI unit is W/m$^2$.', 'Poynting\'s theorem reads $\\nabla\\cdot\\vec S + \\partial u/\\partial t = -\\vec J\\cdot\\vec E$.', 'It is always zero when the fields are static.'], answer: [0, 1, 2],
      sol: 'Poynting\'s theorem is energy conservation for fields: the energy in a region falls by what flows out ($\\nabla\\cdot\\vec S$) and what the fields do on charges ($\\vec J\\cdot\\vec E$). Units: (V/m)(T)/(H/m) = W/m$^2$. With static fields, $\\vec S$ need not be zero: a battery feeding a resistor has steady $\\vec E$ and $\\vec B$, and $\\vec S$ carries the energy from the battery to the resistor.',
      trap: 'A static charge beside a magnet has non-zero $\\vec S$ too, circulating with no net flow; "static" does not mean $\\vec S = 0$.' },
    { id: 'mxw-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'poynting vector', unit: 'W/m$^2$',
      q: 'A straight wire of radius 1.0 mm and length 1.0 m has resistance 0.50 $\\Omega$ and carries a steady 2.0 A. The magnitude of the Poynting vector at its surface is ______ W/m$^2$ (to the nearest whole number).',
      answer: 318, tol: 3, calc: () => 2 ** 2 * 0.5 / (2 * Math.PI * 1e-3 * 1),
      sol: 'At the surface $E = V/L = IR/L$ along the wire and $B = \\mu_0I/(2\\pi a)$ round it, so $S = \\dfrac{EB}{\\mu_0} = \\dfrac{IR}{L}\\cdot\\dfrac{I}{2\\pi a} = \\dfrac{I^2R}{2\\pi aL}$, pointing radially into the wire. $S = \\dfrac{4\\times0.50}{2\\pi(10^{-3})(1.0)} = 318$ W/m$^2$. Times the surface area $2\\pi aL$ it gives exactly the Joule heating $I^2R = 2$ W: the energy enters from the field outside.',
      trap: 'Dividing by the cross-section $\\pi a^2$; the energy enters through the side surface.' },
    { id: 'mxw-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'reflection',
      q: 'Light falls normally from air on a flat glass surface ($n = 1.5$). The fraction of the intensity reflected is',
      options: ['4%', '20%', '0.2%', '10%'], answer: 0,
      sol: '$R = \\left(\\dfrac{n_1 - n_2}{n_1 + n_2}\\right)^2 = \\left(\\dfrac{-0.5}{2.5}\\right)^2 = 0.04$. The amplitude ratio is $-0.2$ (a phase flip); intensity goes as its square.',
      trap: '20% is the amplitude ratio, not the intensity.' },
    { id: 'mxw-022', type: 'nat', level: 3, exams: ['jam'], sub: 'reflection', unit: '%',
      q: 'Light falls normally from air on diamond ($n = 2.4$). The percentage of intensity transmitted into the diamond is ______ (to one decimal place).',
      answer: 83.0, tol: 0.2, calc: () => 100 * (1 - ((2.4 - 1) / (2.4 + 1)) ** 2),
      sol: '$R = \\left(\\dfrac{1.4}{3.4}\\right)^2 = 0.1696$, so $T = 1 - R = 0.830$, i.e. 83.0%. (In terms of fields, $T = \\dfrac{n_2}{n_1}t^2$ with $t = \\dfrac{2}{3.4}$, giving the same.)',
      trap: 'Taking $T = t^2 = 0.346$ and forgetting the factor $n_2/n_1$ (the wave is slower and denser in diamond).' },
    { id: 'mxw-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'reflection',
      q: 'Unpolarised light falls from air on glass of refractive index $\\sqrt3$. The reflected light is completely polarised when the angle of incidence is',
      options: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$54.7^\\circ$'], answer: 2,
      sol: 'At Brewster\'s angle $\\tan\\theta_B = n_2/n_1 = \\sqrt3$, so $\\theta_B = 60^\\circ$. There the reflected and refracted rays are perpendicular, and the component polarised in the plane of incidence is not reflected at all.',
      trap: 'Using $\\sin\\theta = 1/n$ (that is the critical angle idea, and it applies going from glass to air).' },
    { id: 'mxw-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'conductors', unit: '$\\mu$m',
      q: 'Copper has conductivity $5.8\\times10^7$ S/m. The skin depth for a 1.0 MHz wave in copper is ______ $\\mu$m (to one decimal place).',
      answer: 66.1, tol: 0.5, calc: () => Math.sqrt(2 / (2 * Math.PI * 1e6 * mu0 * 5.8e7)) * 1e6,
      sol: 'In a good conductor $\\delta = \\sqrt{\\dfrac{2}{\\omega\\mu_0\\sigma}} = \\sqrt{\\dfrac{2}{(2\\pi\\times10^6)(1.2566\\times10^{-6})(5.8\\times10^7)}} = \\sqrt{4.37\\times10^{-9}} = 6.61\\times10^{-5}$ m. The [skin depth calculator](/science/skin-depth-calculator/) gives it for any metal and frequency.',
      trap: 'Using $f$ in place of $\\omega = 2\\pi f$ makes the answer $\\sqrt{2\\pi}$ times too big.' },
    { id: 'mxw-025', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'maxwell equations',
      q: 'Which of these are correct forms of Maxwell\'s equations in linear matter, written with free charge $\\rho_f$ and free current $\\vec J_f$?',
      options: ['$\\nabla\\cdot\\vec H = 0$', '$\\nabla\\times\\vec H = \\vec J_f + \\dfrac{\\partial\\vec D}{\\partial t}$', '$\\nabla\\cdot\\vec D = \\rho_f$', '$\\nabla\\times\\vec E = -\\dfrac{\\partial\\vec B}{\\partial t}$'], answer: [1, 2, 3],
      sol: 'In matter the source equations use $\\vec D$ and $\\vec H$ with free sources only: $\\nabla\\cdot\\vec D = \\rho_f$, $\\nabla\\times\\vec H = \\vec J_f + \\partial\\vec D/\\partial t$. The other two are unchanged: $\\nabla\\cdot\\vec B = 0$ and Faraday\'s law. $\\nabla\\cdot\\vec H = -\\nabla\\cdot\\vec M$ is not zero in general.',
      trap: 'It is $\\vec B$, not $\\vec H$, that always has zero divergence.' },
    { id: 'mxw-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'plane waves',
      q: 'The ratio $E_0/H_0$ for a plane wave in vacuum (the impedance of free space) is about',
      options: ['$3\\times10^8\\ \\Omega$', '1 $\\Omega$', '50 $\\Omega$', '377 $\\Omega$'], answer: 3,
      sol: '$\\dfrac{E}{H} = \\dfrac{E}{B/\\mu_0} = \\mu_0c = \\sqrt{\\dfrac{\\mu_0}{\\epsilon_0}} = (1.2566\\times10^{-6})(3.00\\times10^8) = 377\\ \\Omega$.',
      trap: '$3\\times10^8$ is $E/B$ (in m/s), not $E/H$.' },
    { id: 'mxw-027', type: 'nat', level: 3, exams: ['jam'], sub: 'momentum and pressure', unit: '$10^{-9}$ kg m/s',
      q: 'A light pulse carrying 1.0 J is completely absorbed by a small object. The momentum given to the object is ______ $\\times10^{-9}$ kg m/s (to two decimal places).',
      answer: 3.34, tol: 0.02, calc: () => 1 / c * 1e9,
      sol: 'For electromagnetic radiation $p = U/c = 1.0/(3.00\\times10^8) = 3.34\\times10^{-9}$ kg m/s.',
      trap: 'Doubling it: the factor 2 is for reflection.' },
    { id: 'mxw-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'polarisation',
      q: 'The wave $\\vec E = E_0\\cos(kz - \\omega t)\\,\\hat x + E_0\\sin(kz - \\omega t)\\,\\hat y$ is',
      options: ['linearly polarised at $45^\\circ$ to the $x$ axis', 'circularly polarised', 'elliptically polarised with unequal axes', 'unpolarised'], answer: 1,
      sol: 'At fixed $z$ the components have equal amplitudes and differ in phase by $90^\\circ$, so the tip of $\\vec E$ traces a circle of radius $E_0$: $|\\vec E| = E_0$ at every instant. Linear polarisation at $45^\\circ$ would need both components in phase.',
      trap: 'Equal amplitudes alone do not make it linear; the relative phase decides.' },
    // ---------- level 4 ----------
    { id: 'mxw-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'displacement current', unit: '$\\mu$T',
      q: 'A parallel-plate capacitor has circular plates of radius 5.0 cm. While it charges, the uniform field between the plates grows at $2.0\\times10^{12}$ V m$^{-1}$ s$^{-1}$. The magnetic field at the edge of the plates ($r = 5.0$ cm) midway between them is ______ $\\mu$T (to three decimal places).',
      answer: 0.556, tol: 0.006, calc: () => mu0 * e0 * 0.05 / 2 * 2e12 * 1e6,
      sol: 'Ampère-Maxwell on a circle of radius $r$ between the plates: $B(2\\pi r) = \\mu_0\\epsilon_0\\pi r^2\\dfrac{dE}{dt}$, so $B = \\dfrac{\\mu_0\\epsilon_0r}{2}\\dfrac{dE}{dt} = \\dfrac{r}{2c^2}\\dfrac{dE}{dt} = \\dfrac{(0.05)(2\\times10^{12})}{2(8.99\\times10^{16})} = 5.56\\times10^{-7}$ T.',
      trap: 'Forgetting that only the displacement current inside the circle counts, or dropping the factor $\\tfrac12$.' },
    { id: 'mxw-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'displacement current',
      q: 'For a charging capacitor with circular plates of radius $R$, how does the magnetic field midway between the plates depend on distance $r$ from the axis?',
      options: ['It is uniform for $r < R$ and zero outside.', 'It is zero everywhere, since no current crosses the gap.', 'It grows as $r$ for $r < R$ and falls as $1/r$ for $r > R$.', 'It falls as $1/r$ everywhere, like a wire.'], answer: 2,
      sol: 'The displacement current is spread uniformly over the plate area. Inside, the enclosed part grows as $r^2$, so $B \\propto r^2/r = r$. Outside, all of it is enclosed, so $B = \\mu_0I/(2\\pi r)$, exactly as round the wire feeding the capacitor. It is the field of a thick wire.',
      trap: 'Thinking the field vanishes because no charge crosses the gap.' },
    { id: 'mxw-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'plane waves',
      q: 'A wave in vacuum has $\\vec E = E_0\\sin(ky + \\omega t)\\,\\hat z$ with $k, \\omega > 0$. Which statements are correct?',
      options: ['It travels along $-\\hat y$.', 'Its magnetic field oscillates along the $x$ axis.', 'Its wavelength is $2\\pi/k$.', 'Its phase velocity is $\\omega/k$ along $+\\hat y$.'], answer: [0, 1, 2],
      sol: 'A crest ($ky + \\omega t$ constant) moves with $dy/dt = -\\omega/k$: along $-\\hat y$, so the last option is wrong. $\\vec B$ is perpendicular to both $\\vec E$ ($\\hat z$) and the travel direction ($\\hat y$): along $\\pm\\hat x$ (in fact $\\hat z\\times\\hat x = \\hat y$, so $\\vec B$ is along $-\\hat x$ when $\\vec E$ is along $+\\hat z$, giving $\\vec E\\times\\vec B$ along $-\\hat y$). Wavelength $2\\pi/k$.',
      trap: 'Reading the direction of travel from the letter in the sine and ignoring the sign of $\\omega t$.' },
    { id: 'mxw-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'Sea water has conductivity 4.0 S/m and relative permittivity 81. At 1.0 MHz, the ratio of conduction current to displacement current amplitude, $\\sigma/(\\omega\\epsilon)$, is ______ (to the nearest whole number).',
      answer: 888, tol: 9, calc: () => 4 / (2 * Math.PI * 1e6 * 81 * e0),
      sol: '$\\dfrac{\\sigma}{\\omega\\epsilon} = \\dfrac{4.0}{(2\\pi\\times10^6)(81)(8.854\\times10^{-12})} = \\dfrac{4.0}{4.506\\times10^{-3}} = 888$. Much greater than 1, so at 1 MHz sea water is a good conductor and radio waves die within metres. (At optical frequencies the ratio is tiny and water is transparent.)',
      trap: 'Forgetting $\\epsilon_r = 81$ and getting a ratio 81 times too large.' },
    { id: 'mxw-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'In a good conductor, a plane wave\'s magnetic field compared with its electric field',
      options: ['is in phase, and $B/E = 1/c$', 'lags by $45^\\circ$ and is much larger than $E/c$', 'leads by $90^\\circ$', 'lags by $90^\\circ$ and is much smaller than $E/c$'], answer: 1,
      sol: 'In a good conductor the wavenumber is $\\tilde k = (1 + i)/\\delta$, which has phase $45^\\circ$. From Faraday, $\\tilde B = (\\tilde k/\\omega)\\tilde E$, so $B$ lags $E$ by $45^\\circ$ and $B/E = \\sqrt2/(\\omega\\delta) = \\sqrt{\\sigma\\mu_0/\\omega}$, much bigger than $1/c$. The wave is mostly magnetic inside a metal.',
      trap: 'Carrying the vacuum rules ($B = E/c$, in phase) into a conductor.' },
    { id: 'mxw-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'momentum and pressure', unit: '$\\mu$Pa',
      q: 'A beam of intensity 1000 W/m$^2$ falls on a perfect mirror at $60^\\circ$ to the normal. The radiation pressure on the mirror is ______ $\\mu$Pa (to two decimal places).',
      answer: 1.67, tol: 0.02, calc: () => 2 * 1000 * Math.cos(Math.PI / 3) ** 2 / c * 1e6,
      sol: 'Two factors of $\\cos\\theta$: the beam\'s power is spread over a larger area ($I\\cos\\theta$ per unit area of mirror), and only the normal momentum component reverses ($2\\cos\\theta$). $P = \\dfrac{2I\\cos^2\\theta}{c} = \\dfrac{2(1000)(0.25)}{3.00\\times10^8} = 1.67\\times10^{-6}$ Pa.',
      trap: 'Using just one $\\cos\\theta$ (3.33 $\\mu$Pa).' },
    { id: 'mxw-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'In a medium with conductivity $\\sigma$ and permittivity $\\epsilon$, the ratio of the amplitudes of conduction current density to displacement current density at angular frequency $\\omega$ is',
      options: ['$\\omega\\epsilon/\\sigma$', '$\\sigma\\epsilon/\\omega$', '$\\sigma/(\\omega\\epsilon)$', '$\\sigma/\\epsilon$'], answer: 2,
      sol: 'With $\\vec E \\propto e^{-i\\omega t}$: $|\\vec J_c| = \\sigma E$ and $|\\vec J_d| = |\\epsilon\\,\\partial E/\\partial t| = \\omega\\epsilon E$. Ratio $\\sigma/(\\omega\\epsilon)$. It decides whether the medium acts as a conductor ($\\gg1$) or as a dielectric ($\\ll1$) at that frequency.',
      trap: '$\\sigma/\\epsilon$ is a rate (the charge relaxation rate); it must be compared with $\\omega$.' },
    { id: 'mxw-036', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'reflection', unit: '%',
      q: 'A thick glass plate ($n = 1.5$, no absorption) is held normal to a beam of light. Counting all multiple reflections between its two faces, but ignoring interference, the percentage of the incident intensity that gets through is ______ (to one decimal place).',
      answer: 92.3, tol: 0.2, calc: () => { const R = 0.04; return 100 * (1 - R) / (1 + R); },
      sol: 'Each face reflects $R = 0.04$. Transmitted beams: $(1-R)^2[1 + R^2 + R^4 + \\dots] = \\dfrac{(1-R)^2}{1-R^2} = \\dfrac{1-R}{1+R} = \\dfrac{0.96}{1.04} = 0.923$.',
      trap: 'Stopping at $(1-R)^2 = 92.16\\%$; the multiply reflected beams add a little.' },
    // ---------- level 5 ----------
    { id: 'mxw-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'plasma', unit: 'MHz',
      q: 'The ionosphere has a free-electron density of $1.0\\times10^{12}$ m$^{-3}$. Waves below its plasma frequency are reflected. That plasma frequency $f_p = \\omega_p/2\\pi$ is ______ MHz (to two decimal places).',
      answer: 8.98, tol: 0.05, calc: () => Math.sqrt(1e12 * C.e ** 2 / (e0 * C.me)) / (2 * Math.PI) / 1e6,
      sol: '$\\omega_p = \\sqrt{\\dfrac{ne^2}{\\epsilon_0m_e}} = \\sqrt{\\dfrac{(10^{12})(1.602\\times10^{-19})^2}{(8.854\\times10^{-12})(9.109\\times10^{-31})}} = 5.64\\times10^7$ rad/s, so $f_p = 8.98$ MHz. The dispersion relation $\\omega^2 = \\omega_p^2 + c^2k^2$ gives imaginary $k$ below $\\omega_p$: shortwave radio bounces, FM (100 MHz) passes through to space.',
      trap: 'Giving $\\omega_p$ in rad/s (56.4 M) as if it were the frequency in hertz.' },
    { id: 'mxw-038', type: 'msq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'maxwell equations',
      q: 'Which statements follow from Maxwell\'s equations?',
      options: ['In vacuum all electromagnetic waves travel at the same speed, whatever their frequency.', 'The speed of light in vacuum depends on how fast the source moves.', 'In a uniform linear dielectric with no free charge, $\\nabla\\cdot\\vec E = 0$.', 'In a good conductor, the electric and magnetic fields of a plane wave are in phase.'], answer: [0, 2],
      sol: 'The vacuum wave equation has speed $1/\\sqrt{\\mu_0\\epsilon_0}$ with no frequency in it: no dispersion. That speed contains no reference to the source, the clash with Galilean relativity that led to Einstein\'s postulate (the equations alone do not say "for every observer", but they give no source-speed dependence). With $\\vec D = \\epsilon\\vec E$, $\\epsilon$ uniform and $\\rho_f = 0$, $\\nabla\\cdot\\vec E = 0$. In a good conductor $\\vec B$ lags $\\vec E$ by $45^\\circ$.',
      trap: 'Dispersion in glass comes from the frequency dependence of $\\epsilon$, not from the vacuum equations.' },
    { id: 'mxw-039', type: 'mcq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'poynting vector',
      q: 'A parallel-plate capacitor with circular plates is being charged slowly. Where does the energy that builds up between the plates enter the gap?',
      options: ['Along the connecting wires, then across the gap from plate to plate', 'Through the edge of the gap (the open cylindrical side), flowing radially inward', 'It is created inside the gap by the displacement current', 'Through the back faces of the plates'], answer: 1,
      sol: 'Between the plates $\\vec E$ is axial and growing, and the displacement current makes a circling $\\vec B$. $\\vec S = \\vec E\\times\\vec B/\\mu_0$ points radially inward. At the edge ($r = R$), $S\\cdot2\\pi Rd = \\dfrac{E}{\\mu_0}\\cdot\\dfrac{\\mu_0\\epsilon_0R}{2}\\dot E\\cdot2\\pi Rd = \\dfrac{d}{dt}\\left(\\tfrac12\\epsilon_0E^2\\cdot\\pi R^2d\\right)$: exactly the rate at which the stored energy grows.',
      trap: 'Picturing energy flowing inside the wires like water. It flows through the space around them.' },
    { id: 'mxw-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'reflection', unit: '%',
      q: 'Light polarised perpendicular to the plane of incidence (s-polarised) falls from air on glass ($n = 1.5$) at Brewster\'s angle. The percentage of its intensity that is reflected is ______ (to one decimal place).',
      answer: 14.8, tol: 0.2,
      calc: () => { const ti = Math.atan(1.5), tt = Math.PI / 2 - ti; return 100 * Math.sin(ti - tt) ** 2 / Math.sin(ti + tt) ** 2; },
      sol: 'Fresnel: $r_s = -\\dfrac{\\sin(\\theta_i - \\theta_t)}{\\sin(\\theta_i + \\theta_t)}$. At Brewster, $\\theta_i = \\tan^{-1}1.5 = 56.31^\\circ$ and $\\theta_i + \\theta_t = 90^\\circ$, so $\\theta_t = 33.69^\\circ$ and $r_s = -\\sin22.62^\\circ = -0.3846$. $R_s = 0.148$, i.e. 14.8%. The p component is not reflected at all, so unpolarised light reflects 7.4% of its intensity, all s-polarised.',
      trap: 'Thinking nothing is reflected at Brewster\'s angle: only the p component vanishes.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'mxw-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'plane waves',
      make(r) {
        const i = Q5.int(r, 0, 2), j = (i + Q5.int(r, 1, 2)) % 3, l = 3 - i - j, sE = r() < 0.5 ? 1 : -1, sB = r() < 0.5 ? 1 : -1;
        const eps = (j - i + 3) % 3 === 1 ? 1 : -1, sk = sE * sB * eps;
        const ax = ['x', 'y', 'z'], d = (s, a) => `$${s > 0 ? '+' : '-'}\\hat ${ax[a]}$`;
        const o = Q5.mcqOptions(r, d(sk, l), [d(-sk, l), d(sE, i), d(sB, j), d(-sE, i)]);
        return { q: `At some point and instant, a plane electromagnetic wave in vacuum has its electric field along ${d(sE, i)} and its magnetic field along ${d(sB, j)}. The wave is travelling along`, ...o,
          sol: `The wave travels along $\\vec E\\times\\vec B$ (the Poynting vector). ${d(sE, i)} $\\times$ ${d(sB, j)} $=$ ${d(sk, l)}, using $\\hat x\\times\\hat y = \\hat z$ and its cyclic forms.`,
          trap: 'The order matters: $\\vec E\\times\\vec B$, not $\\vec B\\times\\vec E$.' };
      } },
    { id: 'mxw-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'plane waves', format: 'statements',
      make(r) {
        const f = Q5.int(r, 50, 900), yes = r() < 0.5;
        const T = [`Its wavelength is $${Q5.round(300 / f, 3)}$ m.`, 'At each point its electric and magnetic energy densities are equal.', '$\\vec E$ and $\\vec B$ oscillate in phase.', 'Its average intensity is proportional to the square of the electric field amplitude.', 'Both fields are perpendicular to the direction of travel.'];
        const F = [`Its wavelength is $${Q5.round(600 / f, 3)}$ m.`, '$\\vec E$ and $\\vec B$ are a quarter period out of phase.', 'Its electric energy density is $c$ times its magnetic energy density.', 'Its average intensity is proportional to the electric field amplitude.', 'Its magnetic field amplitude is $c$ times its electric field amplitude.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `A plane electromagnetic wave of frequency $${f}$ MHz travels in vacuum. Which statements are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: `$\\lambda = c/f = 3\\times10^8/(${f}\\times10^6) = ${Q5.round(300 / f, 3)}$ m. In a vacuum plane wave $B = E/c$ and the two are in phase and perpendicular to each other and to $\\vec k$. Energy densities: $\\tfrac12\\varepsilon_0E^2 = \\tfrac12B^2/\\mu_0$ since $B^2 = \\varepsilon_0\\mu_0E^2$. $\\bar I = \\tfrac12c\\varepsilon_0E_0^2 \\propto E_0^2$.`,
          trap: 'Although $B = E/c$ is tiny in SI units, the magnetic field carries exactly half the energy.' };
      } },
    { id: 'mxw-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'momentum and pressure', unit: 'μPa',
      make(r) {
        const I = Q5.int(r, 1, 20) * 100, th = Q5.choose(r, [0, 15, 30, 45, 60]);
        const P = 2 * I * Math.cos(th * Math.PI / 180) ** 2 / 3e8 * 1e6;
        return { q: `Light of intensity $${I}$ W/m$^2$ falls on a flat, perfectly reflecting mirror at $${th}^\\circ$ to the normal. The radiation pressure on the mirror is ______ $\\mu$Pa (to three decimal places; $c = 3\\times10^8$ m/s).`,
          answer: Q5.round(P, 3), tol: 0.002, I, th,
          sol: `The beam brings momentum $I/c$ per unit time per unit beam area. A beam meeting the mirror at $\\theta$ spreads over an area larger by $1/\\cos\\theta$, and reflection reverses only the normal part, $2\\cos\\theta$ of the momentum. So $P = \\dfrac{2I\\cos^2\\theta}{c} = \\dfrac{2\\times${I}\\times\\cos^2${th}^\\circ}{3\\times10^8} = ${Q5.round(P, 3)}\\ \\mu$Pa.`,
          trap: 'One $\\cos\\theta$ comes from the spread of the beam over the surface, the other from the normal part of the momentum.' };
      },
      verify: (p) => { const c = Math.cos(p.th * Math.PI / 180), flux = p.I * c / 3e8; return flux * 2 * c * 1e6; } },
    { id: 'mxw-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'maxwell equations', format: 'units',
      make(r) {
        const units = ['m s$^{-1}$', '$\\Omega$', 'J m$^{-3}$', 'W m$^{-2}$', 'N C$^{-1}$', 'T'];
        const [ex, u] = Q5.choose(r, [['1/\\sqrt{\\mu_0\\varepsilon_0}', 0], ['\\sqrt{\\mu_0/\\varepsilon_0}', 1], ['E/B', 0], ['\\varepsilon_0E^2', 2], ['EB/\\mu_0', 3], ['B^2/\\mu_0', 2]]);
        const o = Q5.mcqOptions(r, units[u], Q5.shuffle(r, units.filter((x, i) => i !== u)));
        return { q: `In SI units, with $E$ an electric field and $B$ a magnetic field, the quantity $${ex}$ is measured in`, ...o,
          sol: '$1/\\sqrt{\\mu_0\\varepsilon_0} = c$ and $E/B = c$ (for a wave): speeds. $\\sqrt{\\mu_0/\\varepsilon_0} \\approx 377\\ \\Omega$, the impedance of free space. $\\varepsilon_0E^2$ and $B^2/\\mu_0$ are (twice) energy densities, J m$^{-3}$. $EB/\\mu_0$ is the size of the Poynting vector, W m$^{-2}$.',
          trap: 'Energy density J m$^{-3}$ is the same as pressure N m$^{-2}$; intensity has an extra "per second".' };
      } },
    { id: 'mxw-t25', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'waves in matter', unit: 'nT',
      make(r) {
        const E0 = Q5.int(r, 10, 300), er = Q5.choose(r, [2.25, 4, 1.69, 2.56, 9, 6.25]);
        const n = Math.sqrt(er), B0 = n * E0 / 2.998e8 * 1e9;
        return { q: `A plane wave travels in a non-magnetic, lossless dielectric with $\\varepsilon_r = ${er}$. Its electric field amplitude is $${E0}$ V/m. Its magnetic field amplitude is ______ nT (to two decimal places; $c = 2.998\\times10^8$ m/s).`,
          answer: Q5.round(B0, 2), tol: Math.max(0.01, Q5.round(0.002 * B0, 3)), E0, er,
          sol: `The wave speed is $v = c/n$ with $n = \\sqrt{\\varepsilon_r} = ${n}$, and $B_0 = E_0/v = nE_0/c = ${n}\\times${E0}/2.998\\times10^8 = ${Q5.round(B0, 2)}$ nT.`,
          trap: 'In matter $B = E/v$, not $E/c$: the magnetic field is larger by $n$.' };
      },
      verify: (p) => { const mu0 = 4e-7 * Math.PI, eta = mu0 * 2.998e8 / Math.sqrt(p.er), H = p.E0 / eta; return mu0 * H * 1e9; } },
    { id: 'mxw-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'plane waves', unit: 'nT',
      make(r) {
        const E = int(r, 1, 100) * 3;
        const B = E / c * 1e9;
        return { q: `A plane wave in vacuum has electric field amplitude ${E} V/m. Its magnetic field amplitude is ______ nT (to three significant figures).`,
          answer: +B.toPrecision(3), tol: Math.max(B * 0.01, 0.01), E,
          sol: `$B_0 = E_0/c = ${E}/(3.00\\times10^8) \\approx ${fmt(B, 3)}$ nT.`, trap: 'Divide by $c$.' };
      },
      verify: (p) => p.E / c * 1e9 },
    { id: 'mxw-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'energy and intensity', unit: 'W/m$^2$',
      make(r) {
        const E = int(r, 10, 1000);
        const I = 0.5 * c * e0 * E * E;
        return { q: `A plane wave in vacuum has electric field amplitude ${E} V/m. Its average intensity is ______ W/m$^2$ (to three significant figures).`,
          answer: +I.toPrecision(3), tol: Math.max(I * 0.01, 0.001), E,
          sol: `$I = \\tfrac12c\\epsilon_0E_0^2 = \\tfrac12(3.00\\times10^8)(8.854\\times10^{-12})(${E})^2 \\approx ${fmt(I, 3)}$ W/m$^2$.`,
          trap: 'The $\\tfrac12$ is the time average of $\\sin^2$.' };
      },
      verify: (p) => 0.5 * c * e0 * p.E * p.E },
    { id: 'mxw-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'momentum and pressure', unit: '$\\mu$N',
      make(r) {
        const I = int(r, 1, 30) * 100, A = pick(r, 0.5, 10, 0.5), kind = choose(r, ['absorbing', 'reflecting']);
        const F = (kind === 'reflecting' ? 2 : 1) * I * A / c * 1e6;
        return { q: `Light of intensity ${I} W/m$^2$ falls normally on a perfectly ${kind} surface of area ${A} m$^2$. The force on it is ______ $\\mu$N (to three significant figures).`,
          answer: +F.toPrecision(3), tol: Math.max(F * 0.01, 1e-4), I, A, kind,
          sol: `$F = ${kind === 'reflecting' ? '2' : ''}IA/c = ${kind === 'reflecting' ? '2\\times' : ''}${I}\\times${A}/(3.00\\times10^8) \\approx ${fmt(F, 3)}\\,\\mu$N.`,
          trap: 'Reflection doubles the momentum change.' };
      },
      verify: (p) => (p.kind === 'reflecting' ? 2 : 1) * p.I * p.A / c * 1e6 },
    { id: 'mxw-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'energy and intensity', unit: 'V/m',
      make(r) {
        const P = choose(r, [0.5, 1, 2, 5, 10, 50]), d = choose(r, [0.5, 1, 2, 3, 5]); // mW, mm diameter
        const I = P * 1e-3 / (Math.PI * (d / 2e3) ** 2), E = Math.sqrt(2 * I / (c * e0));
        return { q: `A ${P} mW laser beam has a uniform circular cross-section ${d} mm in diameter. The electric field amplitude is ______ V/m (to three significant figures).`,
          answer: +E.toPrecision(3), tol: Math.max(E * 0.01, 0.01), P, d,
          sol: `$I = \\dfrac{P}{\\pi(d/2)^2} = ${fmt(I, 4)}$ W/m$^2$; $E_0 = \\sqrt{2I/(c\\epsilon_0)} \\approx ${fmt(E, 3)}$ V/m.`,
          trap: 'Use the radius, half the diameter.' };
      },
      verify: (p) => Math.sqrt(2 * (p.P * 1e-3 / (Math.PI * (p.d / 2e3) ** 2)) / (c * e0)) },
    { id: 'mxw-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'reflection', unit: '%',
      make(r) {
        const n1 = choose(r, [1, 1, 1.33]), n2 = choose(r, [1.5, 1.6, 1.7, 2.0, 2.4, 3.5, 4.0]);
        const R = 100 * ((n1 - n2) / (n1 + n2)) ** 2;
        return { q: `Light passes at normal incidence from a medium of index ${n1} into one of index ${n2}. The percentage of intensity reflected is ______ (to two decimal places).`,
          answer: round(R, 2), tol: Math.max(R * 0.01, 0.01), n1, n2,
          sol: `$R = \\left(\\dfrac{n_1 - n_2}{n_1 + n_2}\\right)^2 = \\left(\\dfrac{${round(n1 - n2, 2)}}{${round(n1 + n2, 2)}}\\right)^2 \\approx ${round(R, 2)}\\%$.`,
          trap: 'Square the amplitude ratio to get the intensity.' };
      },
      verify: (p) => 100 * ((p.n1 - p.n2) / (p.n1 + p.n2)) ** 2 },
    { id: 'mxw-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'plane waves',
      make(r) {
        const ax = ['x', 'y', 'z'];
        const k = choose(r, ax), rest = ax.filter((a) => a !== k), e = choose(r, rest), sgn = choose(r, [1, -1]);
        // B direction: k_hat = E_hat x B_hat  =>  B_hat = k_hat x E_hat
        const cross = (a, b) => { const v = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }; const A = v[a], Bv = v[b]; const o = [A[1] * Bv[2] - A[2] * Bv[1], A[2] * Bv[0] - A[0] * Bv[2], A[0] * Bv[1] - A[1] * Bv[0]]; const i = o.findIndex((t) => t !== 0); return [ax[i], o[i]]; };
        const [bax, bs] = cross(k, e); const s = bs * sgn; // travel along sgn*k
        const name = (a, s2) => `$${s2 > 0 ? '+' : '-'}\\hat ${a}$`;
        const right = name(bax, s);
        const o = mcqOptions(r, right, [name(bax, -s), name(k, 1), name(e, 1)]);
        return { q: `A plane wave in vacuum travels along ${name(k, sgn)} and at some instant its electric field at a point is along $+\\hat ${e}$. The magnetic field there points along`, ...o,
          sol: `$\\vec E\\times\\vec B$ points along the direction of travel, so $\\hat B = \\hat k\\times\\hat E$ = ${name(k, sgn)} $\\times\\,(+\\hat ${e})$ = ${right}.`,
          trap: 'Get the order right: $\\vec E\\times\\vec B$ gives the travel direction, so $\\hat B = \\hat k\\times\\hat E$.' };
      } },
    { id: 'mxw-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'conductors', unit: '$\\mu$m',
      make(r) {
        const [metal, sig] = choose(r, [['copper', 5.8e7], ['aluminium', 3.5e7], ['silver', 6.3e7], ['brass', 1.5e7]]);
        const f = choose(r, [0.05, 1, 10, 100, 1000]); // MHz... 0.05 MHz = 50 kHz
        const d = Math.sqrt(2 / (2 * Math.PI * f * 1e6 * mu0 * sig)) * 1e6;
        return { q: `The skin depth in ${metal} ($\\sigma = ${fmt(sig, 2)}$ S/m) at ${f >= 1 ? f + ' MHz' : f * 1000 + ' kHz'} is ______ $\\mu$m (to three significant figures).`,
          answer: +d.toPrecision(3), tol: Math.max(d * 0.01, 0.001), sig, f,
          sol: `$\\delta = \\sqrt{\\dfrac{2}{\\omega\\mu_0\\sigma}} = \\sqrt{\\dfrac{2}{2\\pi(${fmt(f * 1e6, 3)})(1.2566\\times10^{-6})(${fmt(sig, 2)})}} \\approx ${fmt(d, 3)}\\,\\mu$m.`,
          trap: '$\\omega = 2\\pi f$.' };
      },
      verify: (p) => Math.sqrt(2 / (2 * Math.PI * p.f * 1e6 * mu0 * p.sig)) * 1e6 },
    { id: 'mxw-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'displacement current', unit: 'mA',
      make(r) {
        const Cn = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]), dV = int(r, 1, 50); // nF, kV/s... dV/dt in 10^3 V/s
        const I = Cn * 1e-9 * dV * 1e3 * 1e3;
        return { q: `The voltage across a ${Cn} nF parallel-plate capacitor rises at $${dV}\\times10^3$ V/s. The displacement current between its plates is ______ mA (to three significant figures).`,
          answer: +I.toPrecision(3), tol: Math.max(I * 0.01, 1e-4), Cn, dV,
          sol: `$I_d = \\epsilon_0A\\dfrac{dE}{dt} = \\epsilon_0\\dfrac{A}{d}\\dfrac{dV}{dt} = C\\dfrac{dV}{dt} = (${Cn}\\times10^{-9})(${dV}\\times10^3) \\approx ${fmt(I, 3)}$ mA, the same as the current in the leads.`,
          trap: 'The displacement current always equals the conduction current feeding the plates.' };
      },
      verify: (p) => p.Cn * 1e-9 * p.dV * 1e3 * 1e3 },
    ...r4.gens,
  ],
};
