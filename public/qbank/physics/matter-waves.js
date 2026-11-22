// Matter waves and the uncertainty principle: de Broglie wavelength (accelerated electrons, thermal neutrons,
// relativistic particles), electron and neutron diffraction, phase and group velocity, wave packets and their
// spreading, the position-momentum and energy-time uncertainty relations, and uncertainty estimates (atom size,
// electrons in nuclei, line widths). Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const h = 6.63e-34, me = 9.11e-31, e = 1.6e-19, mn = 1.675e-27, mp = 1.673e-27, hbar = 1.055e-34, kB = 1.38e-23;
const DEG = Math.PI / 180;
const lamV = (V) => h / Math.sqrt(2 * me * e * V);              // electron through V volts, metres
const lamRelKeV = (K) => 1240 / Math.sqrt(K * K + 2 * K * 511); // electron, K in keV -> pm (hc = 1240 keV pm)

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
  topic: 'matter-waves',
  items: [
    // ---------- level 1 ----------
    { id: 'mw-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'de broglie',
      q: 'If the momentum of a particle is doubled, its de Broglie wavelength',
      options: ['doubles', 'halves', 'stays the same', 'becomes a quarter'], answer: 1,
      sol: '$\\lambda = h/p$: wavelength is inversely proportional to momentum, so doubling $p$ halves $\\lambda$.',
      trap: 'A quarter is what happens to $\\lambda$ when the kinetic energy (not the momentum) goes up 16 times.' },
    { id: 'mw-002', type: 'nat', level: 1, exams: ['jam'], sub: 'accelerated electrons', unit: 'nm',
      q: 'An electron starting from rest is accelerated through $100$ V. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg and $e = 1.6\\times10^{-19}$ C, its de Broglie wavelength is ______ nm (to three decimal places).',
      answer: 0.123, tol: 0.002, calc: () => lamV(100) * 1e9,
      sol: 'Kinetic energy $K = eV$, so $p = \\sqrt{2mK} = \\sqrt{2m_eeV} = \\sqrt{2(9.11\\times10^{-31})(1.6\\times10^{-19})(100)} = 5.40\\times10^{-24}$ kg m/s. Then $\\lambda = h/p = 6.63\\times10^{-34}/5.40\\times10^{-24} = 1.23\\times10^{-10}$ m $= 0.123$ nm. Handy rule: $\\lambda \\approx 1.23/\\sqrt{V}$ nm for electrons.',
      trap: 'This wavelength is about the spacing of atoms in a crystal, which is why crystals diffract slow electrons.' },
    { id: 'mw-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'de broglie',
      q: 'An electron and a proton have the same kinetic energy (both non-relativistic). Which has the longer de Broglie wavelength?',
      options: ['Both the same', 'The proton', 'The electron', 'It depends on the size of the kinetic energy'], answer: 2,
      sol: '$\\lambda = h/\\sqrt{2mK}$. At equal $K$ the lighter particle has less momentum and so the longer wavelength: the electron, by a factor $\\sqrt{m_p/m_e} \\approx 43$.',
      trap: 'Equal kinetic energy is not equal momentum. Equal momentum would give equal wavelengths.' },
    { id: 'mw-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'experiments',
      q: 'The Davisson-Germer experiment is important because it',
      options: ['measured the charge of the electron', 'showed that X-rays are scattered with a change of wavelength', 'measured Planck\'s constant from the photoelectric effect', 'showed that electrons reflected from a nickel crystal form a diffraction pattern, confirming matter waves'], answer: 3,
      sol: 'Electrons scattered from a nickel crystal came out strongly at particular angles, exactly where Bragg-type diffraction with $\\lambda = h/p$ predicted. It was the first direct proof of de Broglie\'s idea. (The charge was Millikan\'s oil drops; the X-ray shift was Compton.)' },
    { id: 'mw-005', type: 'msq', level: 1, exams: ['jam'], sub: 'uncertainty principle', format: 'statements',
      q: 'Which statements about the Heisenberg uncertainty principle are correct?',
      options: ['$\\Delta x\\,\\Delta p_x \\ge \\hbar/2$.', 'It follows from the wave nature of matter: a short wave packet needs a wide spread of wavelengths.', 'It is only a statement about clumsy measuring instruments, and better instruments would beat it.', 'It puts no lower limit on $\\Delta x\\,\\Delta p_y$ (position along $x$, momentum along $y$).'], answer: [0, 1, 3],
      sol: 'The first is the precise form, with $\\Delta$ meaning standard deviations. The second is the reason: to build a packet of length $\\Delta x$ you must add waves whose wave numbers spread over about $1/\\Delta x$, and $p = \\hbar k$. The third is false: the limit is built into the state itself, not into the apparatus. The fourth is true: $x$ and $p_y$ commute, so both can be sharp.',
      trap: 'Only a coordinate and its own momentum are linked.' },
    { id: 'mw-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'de broglie',
      q: 'A cricket ball of mass $0.1$ kg moves at $10$ m/s. With $h = 6.63\\times10^{-34}$ J s, its de Broglie wavelength is',
      options: ['$6.63\\times10^{-35}$ m', '$6.63\\times10^{-34}$ m', '$6.63\\times10^{-33}$ m', '$6.63\\times10^{-32}$ m'], answer: 1,
      sol: '$p = mv = 1$ kg m/s, so $\\lambda = h/p = 6.63\\times10^{-34}$ m, about $10^{-19}$ times the size of a proton. Nothing could diffract it, which is why we never notice the wave nature of everyday objects.' },

    // ---------- level 2 ----------
    { id: 'mw-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'accelerated electrons',
      q: 'The accelerating voltage of an electron gun is raised from $V$ to $4V$ (non-relativistic). The de Broglie wavelength of the electrons',
      options: ['halves', 'becomes a quarter', 'doubles', 'stays the same'], answer: 0,
      sol: '$\\lambda = h/\\sqrt{2meV} \\propto 1/\\sqrt V$. Four times the voltage gives $1/\\sqrt4 = 1/2$ the wavelength.',
      trap: 'The wavelength goes as one over the square root of the voltage, not one over the voltage.' },
    { id: 'mw-008', type: 'nat', level: 2, exams: ['jam'], sub: 'uncertainty principle', unit: '$10^5$ m/s',
      q: 'An electron is known to be somewhere within a region with position uncertainty $\\Delta x = 0.10$ nm. Using $\\Delta x\\,\\Delta p \\ge \\hbar/2$ with $\\hbar = 1.055\\times10^{-34}$ J s and $m_e = 9.11\\times10^{-31}$ kg, the minimum uncertainty in its speed is ______ $\\times10^5$ m/s (to two decimal places).',
      answer: 5.79, tol: 0.03, calc: () => hbar / (2 * me * 1e-10) / 1e5,
      sol: '$\\Delta p \\ge \\hbar/(2\\Delta x) = 1.055\\times10^{-34}/(2\\times10^{-10}) = 5.275\\times10^{-25}$ kg m/s. $\\Delta v = \\Delta p/m_e = 5.275\\times10^{-25}/9.11\\times10^{-31} = 5.79\\times10^5$ m/s, a large speed: an electron held to atomic size cannot sit still.',
      trap: 'Using $h$ instead of $\\hbar/2$ gives a number about 12.6 times bigger. Use the form the question states.' },
    { id: 'mw-009', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'phase and group velocity',
      q: 'A free particle moves with speed $v$. Using the relativistic energy $E = \\gamma mc^2$ (including rest energy) and $E = \\hbar\\omega$, $p = \\hbar k$, the phase velocity $\\omega/k$ of its de Broglie wave is',
      options: ['$v$', '$c$', '$c^2/v$', '$v/2$'], answer: 2,
      sol: '$v_p = \\omega/k = E/p = \\gamma mc^2/(\\gamma mv) = c^2/v$, which is more than $c$. It carries no energy or information, so relativity is not broken; the packet (and the particle) moves at the group velocity $v$.',
      trap: '$v/2$ is what you get with the non-relativistic $E = p^2/2m$; the phase velocity depends on where the zero of energy is, so it is not a physical speed.' },
    { id: 'mw-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'phase and group velocity',
      q: 'The group velocity $d\\omega/dk$ of the de Broglie wave of a free particle equals',
      options: ['half the particle\'s speed', '$c^2$ divided by the particle\'s speed', 'the speed of light', 'the particle\'s speed'], answer: 3,
      sol: '$v_g = d\\omega/dk = dE/dp$. For $E = p^2/2m$: $dE/dp = p/m = v$. For $E = \\sqrt{p^2c^2 + m^2c^4}$: $dE/dp = pc^2/E = v$ again. The packet travels with the particle, as it must.' },
    { id: 'mw-011', type: 'nat', level: 2, exams: ['jam'], sub: 'neutrons', unit: 'nm',
      q: 'A neutron ($m_n = 1.675\\times10^{-27}$ kg) has kinetic energy $0.025$ eV. With $h = 6.63\\times10^{-34}$ J s and $1$ eV $= 1.6\\times10^{-19}$ J, its de Broglie wavelength is ______ nm (to three decimal places).',
      answer: 0.181, tol: 0.002, calc: () => h / Math.sqrt(2 * mn * 0.025 * e) * 1e9,
      sol: '$K = 0.025\\times1.6\\times10^{-19} = 4.0\\times10^{-21}$ J. $p = \\sqrt{2m_nK} = \\sqrt{2(1.675\\times10^{-27})(4.0\\times10^{-21})} = 3.66\\times10^{-24}$ kg m/s. $\\lambda = h/p = 1.81\\times10^{-10}$ m $= 0.181$ nm, close to atomic spacings: slow (thermal) neutrons diffract from crystals.',
      trap: 'Forgetting to turn eV into joules before using SI constants.' },
    { id: 'mw-012', type: 'msq', level: 2, exams: ['jam'], sub: 'de broglie', format: 'multi',
      q: 'A non-relativistic electron and a non-relativistic proton have the same de Broglie wavelength. Which statements are correct?',
      options: ['They have the same momentum.', 'They have the same kinetic energy.', 'The electron has the larger kinetic energy.', 'The proton moves more slowly.'], answer: [0, 2, 3],
      sol: 'Same $\\lambda = h/p$ means same $p$. Then $K = p^2/2m$ is larger for the lighter electron (by about 1836 times), and $v = p/m$ is smaller for the heavier proton.',
      trap: 'Equal wavelength means equal momentum, never equal energy (unless the masses are equal).' },
    { id: 'mw-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy-time',
      q: 'An excited atomic state lives for about $10^{-8}$ s. Take $\\hbar = 6.6\\times10^{-16}$ eV s. The natural spread in its energy is of the order of',
      options: ['$10^{-7}$ eV', '$10^{-3}$ eV', '$10^{-11}$ eV', '$1$ eV'], answer: 0,
      sol: '$\\Delta E \\sim \\hbar/\\tau = 6.6\\times10^{-16}/10^{-8} = 6.6\\times10^{-8}$ eV, about $10^{-7}$ eV (using $\\hbar/2\\tau$ changes only the factor). This tiny spread is the natural width of the spectral line.',
      trap: 'A short-lived state has a broad energy, a long-lived one a sharp energy; the product is fixed.' },
    { id: 'mw-014', type: 'nat', level: 2, exams: ['jam'], sub: 'accelerated electrons', unit: 'eV',
      q: 'An electron has de Broglie wavelength $0.10$ nm. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg and $1$ eV $= 1.6\\times10^{-19}$ J, its kinetic energy is ______ eV (to the nearest whole number).',
      answer: 151, tol: 1.5, calc: () => (h / 1e-10) ** 2 / (2 * me) / e,
      sol: '$p = h/\\lambda = 6.63\\times10^{-24}$ kg m/s. $K = p^2/2m = (6.63\\times10^{-24})^2/(2\\times9.11\\times10^{-31}) = 2.41\\times10^{-17}$ J $= 151$ eV.',
      trap: 'Squaring $h/\\lambda$ is easy to forget; $K$ grows as $1/\\lambda^2$.' },
    { id: 'mw-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'bohr and de broglie',
      q: 'In de Broglie\'s picture of the Bohr atom, an allowed orbit of radius $r$ is one where the electron wave fits round the orbit as a standing wave. The condition is ($n = 1, 2, 3, \\dots$)',
      options: ['$\\pi r = n\\lambda$', '$2\\pi r = n\\lambda$', '$r = n\\lambda$', '$2\\pi r = (n + \\tfrac12)\\lambda$'], answer: 1,
      sol: 'The wave must join up with itself after one trip round, so the circumference holds a whole number of wavelengths: $2\\pi r = n\\lambda = nh/p$. Then $L = pr = nh/2\\pi = n\\hbar$, which is Bohr\'s rule.',
      trap: 'Half-integer counts would make the wave meet itself out of step and cancel.' },
    { id: 'mw-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'neutrons',
      q: 'Neutrons in thermal equilibrium at $300$ K are cooled to $75$ K. Their typical de Broglie wavelength',
      options: ['stays the same', 'becomes four times larger', 'doubles', 'halves'], answer: 2,
      sol: 'Typical kinetic energy is proportional to $kT$, so $p \\propto \\sqrt T$ and $\\lambda \\propto 1/\\sqrt T$. A quarter of the temperature gives twice the wavelength. Cold neutrons are used to study large structures for this reason.' },

    // ---------- level 3 ----------
    { id: 'mw-017', type: 'nat', level: 3, exams: ['jam'], sub: 'electron diffraction', unit: 'degrees',
      q: 'Electrons accelerated through $150$ V fall normally on a crystal surface whose rows of atoms are $0.25$ nm apart. The first-order diffracted beam leaves at angle $\\varphi$ to the normal with $d\\sin\\varphi = \\lambda$. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg, $e = 1.6\\times10^{-19}$ C, find $\\varphi$ in degrees (to one decimal place).',
      answer: 23.6, tol: 0.2, calc: () => Math.asin(lamV(150) / 0.25e-9) / DEG,
      sol: '$\\lambda = h/\\sqrt{2m_eeV} = 6.63\\times10^{-34}/\\sqrt{2(9.11\\times10^{-31})(1.6\\times10^{-19})(150)} = 1.003\\times10^{-10}$ m. $\\sin\\varphi = 0.1003/0.25 = 0.401$, so $\\varphi = 23.6^\\circ$.',
      trap: 'This is the surface-grating rule $d\\sin\\varphi = \\lambda$, not Bragg\'s $2d\\sin\\theta = \\lambda$ for planes inside the crystal.' },
    { id: 'mw-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'uncertainty estimates',
      q: 'Estimate the hydrogen ground-state energy by writing the energy of an electron at distance $r$ as $E(r) = \\dfrac{\\hbar^2}{2m r^2} - \\dfrac{e^2}{4\\pi\\varepsilon_0 r}$ (taking $p \\sim \\hbar/r$) and minimising. The result is',
      options: ['$-27.2$ eV', '$-3.4$ eV', '$-6.8$ eV', '$-13.6$ eV'], answer: 3,
      sol: 'Write $E = A/r^2 - B/r$ with $A = \\hbar^2/2m$, $B = e^2/4\\pi\\varepsilon_0$. $dE/dr = -2A/r^3 + B/r^2 = 0$ gives $r = 2A/B = 4\\pi\\varepsilon_0\\hbar^2/(me^2) = a_0$, the Bohr radius. Then $E = B^2/4A - B^2/2A = -B^2/4A = -me^4/(2(4\\pi\\varepsilon_0)^2\\hbar^2) = -13.6$ eV. The estimate happens to be exact here.',
      trap: 'The kinetic term pushes the electron out, the Coulomb term pulls it in; the balance sets the size of the atom. Without the uncertainty principle the electron would fall in.' },
    { id: 'mw-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'uncertainty estimates',
      q: 'Suppose an electron were confined inside a nucleus of size about $10^{-14}$ m. Using $p \\sim \\hbar/\\Delta x$ (with $\\hbar c \\approx 197$ MeV fm), its kinetic energy would be of the order of',
      options: ['$20$ MeV', '$20$ keV', '$20$ eV', '$0.5$ MeV'], answer: 0,
      sol: '$\\Delta x = 10^{-14}$ m $= 10$ fm. $pc \\sim \\hbar c/\\Delta x = 197/10 \\approx 20$ MeV. That is far above $m_ec^2 = 0.511$ MeV, so the electron is ultra-relativistic and $K \\approx pc \\approx 20$ MeV, much more than the few MeV of beta decay energies or nuclear binding per particle. So electrons are not nuclear constituents.',
      trap: 'Using $p^2/2m$ at this momentum gives hundreds of MeV; at $pc \\gg mc^2$ use $K \\approx pc$.' },
    { id: 'mw-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'phase and group velocity', format: 'statements',
      q: 'For the de Broglie wave of a free relativistic particle of rest mass $m > 0$, which statements are correct?',
      options: ['$v_pv_g = c^2$.', '$v_p > c$, which does not break relativity because the phase carries no information.', '$v_g$ equals the speed of the particle.', '$v_p = v_g$.'], answer: [0, 1, 2],
      sol: '$v_p = E/p = c^2/v$ and $v_g = dE/dp = v$, so $v_pv_g = c^2$ and $v_p > c$ since $v < c$. The group velocity is the particle speed. They are equal only for a massless particle ($v_p = v_g = c$).',
      trap: 'Massive particles are dispersive: $\\omega(k)$ is not a straight line, so phase and group velocities differ.' },
    { id: 'mw-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'relativistic', unit: 'pm',
      q: 'An electron has kinetic energy $1.0$ MeV. Using $m_ec^2 = 0.511$ MeV and $hc = 1240$ MeV fm, its de Broglie wavelength is ______ pm (to three decimal places).',
      answer: 0.872, tol: 0.004, calc: () => 1240 / Math.sqrt(1 + 2 * 1 * 0.511) / 1000,
      sol: 'Relativistic: $E = K + mc^2$ and $(pc)^2 = E^2 - (mc^2)^2 = K^2 + 2Kmc^2 = 1 + 1.022 = 2.022$ MeV$^2$, so $pc = 1.422$ MeV. $\\lambda = hc/pc = 1240/1.422 = 872$ fm $= 0.872$ pm.',
      trap: 'The non-relativistic rule $1.23/\\sqrt V$ nm gives $1.23$ pm, 40% too large: at $K > m_ec^2$ you must use the relativistic momentum.' },
    { id: 'mw-022', type: 'mcq', level: 3, exams: ['jam'], sub: 'uncertainty principle',
      q: 'In Heisenberg\'s thought experiment an electron\'s position is found by scattering light off it and looking through a microscope. To locate it more precisely, light of shorter wavelength is used. The disturbance to the electron\'s momentum then becomes',
      options: ['smaller, because short waves pass the electron without touching it', 'larger, because each photon carries momentum $h/\\lambda$ and its kick has an uncertain direction', 'zero, if the microscope lens is large enough', 'unchanged, because momentum and position are unrelated'], answer: 1,
      sol: 'Resolution $\\Delta x \\sim \\lambda/\\sin\\alpha$ improves with shorter $\\lambda$, but the scattered photon\'s momentum $h/\\lambda$ grows, and since we do not know which way inside the lens it went, the electron\'s recoil is uncertain by about $(h/\\lambda)\\sin\\alpha$. The product stays about $h$.',
      trap: 'The thought experiment illustrates the principle; the principle itself is a property of all wave states, measured or not.' },
    { id: 'mw-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'uncertainty principle',
      q: 'The speed of a $50$ g ball is known with uncertainty $0.01$ m/s. Using $\\Delta x\\,\\Delta p \\ge \\hbar/2$ with $\\hbar = 1.055\\times10^{-34}$ J s, the smallest possible uncertainty in its position is',
      options: ['$1.06\\times10^{-31}$ m', '$1.06\\times10^{-28}$ m', '$5.3\\times10^{-32}$ m', '$2.1\\times10^{-31}$ m'], answer: 0,
      sol: '$\\Delta p = m\\Delta v = 0.05\\times0.01 = 5\\times10^{-4}$ kg m/s. $\\Delta x \\ge \\hbar/(2\\Delta p) = 1.055\\times10^{-34}/10^{-3} = 1.055\\times10^{-31}$ m. Far below anything measurable: for large objects the principle is irrelevant.',
      trap: 'Mass in grams: $50$ g $= 0.05$ kg.' },
    { id: 'mw-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'accelerated particles',
      q: 'A proton and an alpha particle (charge $2e$, mass $4m_p$) start from rest and are accelerated through the same potential difference. The ratio $\\lambda_\\alpha/\\lambda_p$ of their de Broglie wavelengths is',
      options: ['$1/2$', '$1/4$', '$1/(2\\sqrt2)$', '$\\sqrt2$'], answer: 2,
      sol: '$K = qV$, so $\\lambda = h/\\sqrt{2mqV}$. $\\lambda_\\alpha/\\lambda_p = \\sqrt{(m_pe)/(4m_p\\cdot2e)} = \\sqrt{1/8} = 1/(2\\sqrt2)$.',
      trap: 'The alpha has twice the charge, so it gains twice the kinetic energy; forgetting the charge gives $1/2$.' },
    { id: 'mw-025', type: 'msq', level: 3, exams: ['jam'], sub: 'diffraction', format: 'multi',
      q: 'Which of these have a wavelength close to $0.1$ nm, suitable for diffraction from crystals? (Use $\\lambda_e \\approx 1.23/\\sqrt{K/\\text{eV}}$ nm for electrons, $\\lambda_n \\approx 0.0286/\\sqrt{K/\\text{eV}}$ nm for neutrons and $hc = 1240$ eV nm.)',
      options: ['An electron of kinetic energy $150$ eV', 'A neutron of kinetic energy $0.08$ eV', 'A proton of kinetic energy $150$ eV', 'A photon of energy $150$ eV'], answer: [0, 1],
      sol: 'Electron: $1.23/\\sqrt{150} = 0.100$ nm. Neutron: $0.0286/\\sqrt{0.08} = 0.101$ nm. Proton: $\\sqrt{1836}\\approx43$ times shorter than the electron at the same energy, about $0.0023$ nm. Photon: $1240/150 = 8.3$ nm, far too long; X-rays for crystal work need about $12$ keV.',
      trap: 'For photons $\\lambda = hc/E$, not $h/\\sqrt{2mE}$: a photon and an electron with the same energy have very different wavelengths.' },
    { id: 'mw-026', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'energy-time', unit: 'MHz',
      q: 'An excited state has lifetime $2.0$ ns. Using $\\Delta E\\,\\Delta t \\ge \\hbar/2$ with $\\Delta t$ equal to the lifetime, the minimum frequency spread $\\Delta\\nu = \\Delta E/h$ of the emitted light is ______ MHz (to one decimal place).',
      answer: 39.8, tol: 0.2, calc: () => 1 / (4 * Math.PI * 2e-9) / 1e6,
      sol: '$\\Delta E = \\hbar/(2\\tau)$, so $\\Delta\\nu = \\Delta E/h = 1/(4\\pi\\tau) = 1/(4\\pi\\times2.0\\times10^{-9}) = 3.98\\times10^7$ Hz $= 39.8$ MHz.',
      trap: 'Dividing by $\\hbar$ instead of $h$ gives the angular frequency spread, $2\\pi$ times larger.' },
    { id: 'mw-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'uncertainty principle',
      q: 'A beam of electrons of momentum $p$ passes through a slit of width $a$. Treating the slit as fixing the sideways position to about $a$, the uncertainty principle estimates the angular spread of the beam, in order of magnitude, as',
      options: ['$pa/h$', '$a/\\lambda$', '$\\hbar a/p$', '$h/(pa)$, that is $\\lambda/a$'], answer: 3,
      sol: 'Sideways $\\Delta y \\sim a$ forces $\\Delta p_y \\sim h/a$. The angle is $\\Delta p_y/p \\sim h/(pa) = \\lambda/a$, matching the single-slit diffraction angle. Narrower slit, wider spread.',
      trap: 'Squeezing the beam through a narrower slit makes it spread more, not less.' },
    { id: 'mw-028', type: 'nat', level: 3, exams: ['jam'], sub: 'photon and electron',
      q: 'A photon and an electron both have wavelength $0.20$ nm. Using $m_ec^2 = 511$ keV and $hc = 1240$ eV nm, the ratio of the photon\'s energy to the electron\'s kinetic energy is ______ (to the nearest whole number).',
      answer: 165, tol: 1, calc: () => 2 * 511000 * 0.2 / 1240,
      sol: 'Photon: $E = hc/\\lambda = 1240/0.2 = 6200$ eV. Electron: $K = p^2/2m = (hc/\\lambda)^2/(2m_ec^2) = 6200^2/(1.022\\times10^6) = 37.6$ eV. Ratio $= 6200/37.6 = 165$. In general the ratio is $2m_ec^2\\lambda/(hc)$.',
      trap: 'Same wavelength means same momentum, but the energy-momentum relations are different: $E = pc$ against $K = p^2/2m$.' },

    // ---------- level 4 ----------
    { id: 'mw-029', type: 'mcq', level: 4, exams: ['jam'], sub: 'neutrons',
      q: 'Neutrons are in thermal equilibrium at $300$ K. Taking their kinetic energy as the mean value $\\tfrac32k_BT$, with $k_B = 1.38\\times10^{-23}$ J/K, $m_n = 1.675\\times10^{-27}$ kg and $h = 6.63\\times10^{-34}$ J s, their de Broglie wavelength is closest to',
      options: ['$0.178$ nm', '$0.126$ nm', '$0.145$ nm', '$0.290$ nm'], answer: 2,
      sol: '$K = \\tfrac32(1.38\\times10^{-23})(300) = 6.21\\times10^{-21}$ J. $p = \\sqrt{2m_nK} = \\sqrt{2(1.675\\times10^{-27})(6.21\\times10^{-21})} = 4.56\\times10^{-24}$ kg m/s. $\\lambda = h/p = 1.45\\times10^{-10}$ m $= 0.145$ nm.',
      trap: 'Using $K = k_BT$ instead gives $0.178$ nm. Always use the energy the question tells you; conventions differ.' },
    { id: 'mw-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'phase and group velocity',
      q: 'For a free non-relativistic particle, $\\omega = \\hbar k^2/2m$. The group velocity $v_g$ and phase velocity $v_p$ are related by',
      options: ['$v_g = 2v_p$', '$v_g = v_p$', '$v_g = v_p/2$', '$v_gv_p = c^2$'], answer: 0,
      sol: '$v_p = \\omega/k = \\hbar k/2m$ and $v_g = d\\omega/dk = \\hbar k/m$, so $v_g = 2v_p$. The group velocity $\\hbar k/m = p/m$ is the particle speed.',
      trap: '$v_gv_p = c^2$ is the relativistic result with the rest energy included.' },
    { id: 'mw-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'wave packets', format: 'statements',
      q: 'A free particle is described by a Gaussian wave packet. Which statements are correct?',
      options: ['At the moment of minimum width a Gaussian packet has $\\Delta x\\,\\Delta p = \\hbar/2$ exactly.', 'The packet spreads out in position as time passes.', 'The narrower the packet starts, the faster it spreads.', 'Its momentum spread grows with time.'], answer: [0, 1, 2],
      sol: 'A Gaussian is the minimum-uncertainty shape. Different momentum components travel at different speeds, so the packet spreads. A narrow start means a large $\\Delta p$, hence a large spread in speeds and fast spreading. For a free particle each momentum is conserved, so the momentum distribution, and $\\Delta p$, never change.',
      trap: 'The position spread grows; the momentum spread does not.' },
    { id: 'mw-032', type: 'nat', level: 4, exams: ['jam'], sub: 'uncertainty estimates', unit: 'meV',
      q: 'An electron is confined so that $\\Delta x = 1.0$ nm. Using $\\Delta p = \\hbar/(2\\Delta x)$, estimate its smallest kinetic energy as $(\\Delta p)^2/2m_e$, with $\\hbar = 1.055\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg, $1$ eV $= 1.6\\times10^{-19}$ J. The estimate is ______ meV (to one decimal place).',
      answer: 9.5, tol: 0.1, calc: () => (hbar / (2 * 1e-9)) ** 2 / (2 * me) / e * 1000,
      sol: '$\\Delta p = 1.055\\times10^{-34}/(2\\times10^{-9}) = 5.275\\times10^{-26}$ kg m/s. $(\\Delta p)^2/2m = 2.783\\times10^{-51}/(1.822\\times10^{-30}) = 1.527\\times10^{-21}$ J $= 9.5$ meV.',
      trap: 'This is only an order-of-magnitude estimate; the exact ground state of a 1 nm box is a different number.' },
    { id: 'mw-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'relativistic',
      q: 'For electrons, at roughly what kinetic energy does the non-relativistic formula $\\lambda = h/\\sqrt{2mK}$ give a wavelength 1% too large? ($m_ec^2 = 511$ keV)',
      options: ['About $200$ eV', 'About $20$ keV', 'About $2$ MeV', 'About $511$ keV'], answer: 1,
      sol: 'Exactly, $(pc)^2 = K^2 + 2Kmc^2 = 2Kmc^2(1 + K/2mc^2)$. So $\\lambda_{\\text{rel}}/\\lambda_{\\text{nr}} = (1 + K/2mc^2)^{-1/2}$. For this to be $0.99$: $1 + K/2mc^2 = 1.0203$, so $K = 0.0203\\times1022$ keV $\\approx 21$ keV. Electron microscopes (100 to 300 kV) must use the relativistic formula.',
      trap: 'Corrections start well below $m_ec^2$; "relativistic only near 511 keV" is wrong for a 1% answer.' },
    { id: 'mw-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'relativistic', unit: 'kV',
      q: 'An electron microscope needs electrons of wavelength $5.0$ pm. Using $hc = 1.24$ MeV pm and $m_ec^2 = 0.511$ MeV (relativistic formula), the accelerating voltage must be ______ kV (to the nearest kV).',
      answer: 57, tol: 1, calc: () => (Math.sqrt((1.24 / 5) ** 2 + 0.511 ** 2) - 0.511) * 1000,
      sol: '$pc = hc/\\lambda = 1.24/5.0 = 0.248$ MeV. $E = \\sqrt{(pc)^2 + (mc^2)^2} = \\sqrt{0.0615 + 0.2611} = 0.5680$ MeV. $K = E - mc^2 = 0.0570$ MeV $= 57$ keV, so $57$ kV.',
      trap: 'The non-relativistic formula gives $(pc)^2/2mc^2 = 60$ kV, about 5% too high.' },
    { id: 'mw-035', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'interpretation', format: 'statements',
      q: 'Which statements about matter waves are correct?',
      options: ['$|\\psi|^2$ gives the probability per unit length (or volume) of finding the particle.', 'An electron two-slit pattern builds up spot by spot even when electrons pass one at a time.', 'Matter waves are electromagnetic waves emitted by the moving particle.', 'The de Broglie wavelength of a particle depends on the frame of reference of the observer.'], answer: [0, 1, 3],
      sol: 'First: Born\'s rule. Second: seen in experiments; each electron lands at one spot, and the fringes appear in the statistics. Third: false; they are probability amplitudes, not electromagnetic fields (neutral neutrons show them too). Fourth: true, since momentum depends on the frame; in the particle\'s own rest frame $p = 0$.',
      trap: 'A neutral particle (neutron, atom, molecule) diffracts just as well, so matter waves cannot be electromagnetic.' },
    { id: 'mw-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'photon and electron',
      q: 'An electron of kinetic energy $100$ eV and a photon of energy $100$ eV are compared. With $m_ec^2 = 511$ keV, the ratio $\\lambda_{\\text{electron}}/\\lambda_{\\text{photon}}$ is about',
      options: ['$100$', '$1$', '$0.1$', '$0.01$'], answer: 3,
      sol: '$\\lambda_e = h/\\sqrt{2mE}$, $\\lambda_\\gamma = hc/E$. Ratio $= E/(c\\sqrt{2mE}) = \\sqrt{E/2mc^2} = \\sqrt{100/1.022\\times10^6} = 0.0099 \\approx 0.01$.',
      trap: 'At equal energy a slow electron has far more momentum than a photon, so a far shorter wavelength.' },
    { id: 'mw-037', type: 'nat', level: 4, exams: ['jam'], sub: 'electron interference', unit: '$\\mu$m',
      q: 'Electrons accelerated through $600$ V pass through two slits $1.0$ $\\mu$m apart. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg, $e = 1.6\\times10^{-19}$ C, the fringe spacing on a screen $2.0$ m away is ______ $\\mu$m (to the nearest $\\mu$m).',
      answer: 100, tol: 1, calc: () => lamV(600) * 2 / 1e-6 * 1e6,
      sol: '$\\lambda = h/\\sqrt{2m_eeV} = 5.01\\times10^{-11}$ m. Fringe spacing $= \\lambda D/d = (5.01\\times10^{-11})(2.0)/(1.0\\times10^{-6}) = 1.00\\times10^{-4}$ m $= 100$ $\\mu$m, the same formula as for light.',
      trap: 'Matter waves obey the same interference geometry as light; only $\\lambda$ is worked out differently.' },

    // ---------- level 5 ----------
    { id: 'mw-038', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'phase and group velocity', unit: '$c$',
      q: 'An electron has kinetic energy $1.0$ MeV ($m_ec^2 = 0.511$ MeV). The phase velocity of its de Broglie wave (relativistic, rest energy included) is ______ times $c$ (to three decimal places).',
      answer: 1.063, tol: 0.002, calc: () => (1 + 0.511) / Math.sqrt(1 + 2 * 0.511),
      sol: '$E = 1.511$ MeV, $pc = \\sqrt{K^2 + 2Kmc^2} = \\sqrt{2.022} = 1.4220$ MeV. Particle speed $v/c = pc/E = 0.9411$. Phase velocity $v_p = c^2/v$, so $v_p/c = E/pc = 1.511/1.4220 = 1.063$.',
      trap: 'The phase velocity is above $c$ for every massive particle and approaches $c$ only as the particle itself does.' },
    { id: 'mw-039', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'fourier', format: 'statements',
      q: 'Which statements are correct?',
      options: ['A packet localised within $\\Delta x$ is made of wave numbers spread over a range of about $1/\\Delta x$.', 'A plane wave $e^{ikx}$ has a sharp momentum $\\hbar k$ but is spread evenly over all space.', 'A state sharply localised at one point has equal amplitude for all momenta.', 'The uncertainty relation limits only successive measurements on one particle; it says nothing about the spread of results over many identically prepared particles.'], answer: [0, 1, 2],
      sol: 'First: Fourier pairs, $\\Delta x\\,\\Delta k \\gtrsim 1$. Second: $|e^{ikx}|^2 = 1$ everywhere. Third: the Fourier transform of a delta function is a constant. Fourth: false; $\\Delta x$ and $\\Delta p$ are the standard deviations of results over an ensemble of identically prepared systems, and the relation constrains exactly those spreads.',
      trap: 'The principle is about the state (the spreads it gives), not about one unlucky measurement.' },
    { id: 'mw-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'neutron diffraction', unit: 'meV',
      q: 'Neutrons are reflected in first order from crystal planes $0.20$ nm apart at a glancing angle of $30^\\circ$. Using $h = 6.63\\times10^{-34}$ J s, $m_n = 1.675\\times10^{-27}$ kg and $1$ eV $= 1.6\\times10^{-19}$ J, their kinetic energy is ______ meV (to one decimal place).',
      answer: 20.5, tol: 0.2, calc: () => h ** 2 / (2 * mn * (2 * 0.2e-9 * 0.5) ** 2) / e * 1000,
      sol: 'Bragg: $\\lambda = 2d\\sin\\theta = 2(0.20)(0.5) = 0.20$ nm. $K = h^2/(2m_n\\lambda^2) = (6.63\\times10^{-34})^2/(2\\times1.675\\times10^{-27}\\times4.0\\times10^{-20}) = 3.28\\times10^{-21}$ J $= 20.5$ meV, close to room-temperature thermal energy.',
      trap: 'The Bragg angle is measured from the planes (glancing angle), not from the normal.' },
    { id: 'mw-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'wave packets', unit: '$10^{-16}$ s',
      q: 'A free electron is described at $t = 0$ by a Gaussian packet of width $\\sigma_0 = 0.10$ nm, whose width grows as $\\sigma(t) = \\sigma_0\\sqrt{1 + (\\hbar t/2m\\sigma_0^2)^2}$. With $\\hbar = 1.055\\times10^{-34}$ J s and $m_e = 9.11\\times10^{-31}$ kg, the width doubles after ______ $\\times10^{-16}$ s (to two decimal places).',
      answer: 2.99, tol: 0.02, calc: () => Math.sqrt(3) * 2 * me * 1e-20 / hbar / 1e-16,
      sol: '$\\sigma = 2\\sigma_0$ needs $1 + (\\hbar t/2m\\sigma_0^2)^2 = 4$, so $\\hbar t/2m\\sigma_0^2 = \\sqrt3$ and $t = 2\\sqrt3\\,m\\sigma_0^2/\\hbar = 2(1.732)(9.11\\times10^{-31})(10^{-20})/(1.055\\times10^{-34}) = 2.99\\times10^{-16}$ s. An atom-sized free electron packet spreads in well under a femtosecond.',
      trap: 'The square root must equal 2, so the quantity under it must equal 4. Setting the quantity under the root equal to 2 gives the time for a width of only $\\sqrt2\\,\\sigma_0$.' },
    { id: 'mw-042', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'relativistic', format: 'statements',
      q: 'For a free particle with $E^2 = p^2c^2 + m^2c^4$, which statements are correct?',
      options: ['$dE/dp$ equals the particle\'s speed.', '$E/p \\ge c$.', 'For a photon, phase and group velocities are both $c$.', 'The phase velocity is the speed at which the probability density moves.'], answer: [0, 1, 2],
      sol: 'First: $dE/dp = pc^2/E = v$. Second: $E \\ge pc$, so $E/p \\ge c$, equality for $m = 0$. Third: $E = pc$ gives $\\omega = ck$, no dispersion. Fourth: false; the probability (and energy) moves with the group velocity.',
      trap: 'Phase velocity is a property of a single plane wave, not of anything you could detect moving.' },
  ],

  gens: [
    { id: 'mw-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'de broglie', format: 'comparison',
      make(r) {
        const P = [['a proton', 1, 1], ['a deuteron', 2, 1], ['an alpha particle', 4, 2]];
        const i = Q5.int(r, 0, 2), j = (i + Q5.int(r, 1, 2)) % 3, A = P[i], B = P[j];
        const sq = (n, d) => { const g = (a, b) => (b ? g(b, a % b) : a), k = g(n, d), a = n / k, b = d / k, ra = Math.round(Math.sqrt(a)), rb = Math.round(Math.sqrt(b)); return ra * ra === a && rb * rb === b ? q5frac(ra, rb) : `\\sqrt{${q5frac(a, b)}}`; };
        const c = Q5.int(r, 0, 3);
        const val = [sq(B[1], A[1]), q5frac(B[1], A[1]), '1', sq(B[1] * B[2], A[1] * A[2])];
        const cond = ['have the same kinetic energy', 'have the same speed', 'have the same momentum', 'are each accelerated from rest through the same potential difference'][c];
        const o = Q5.mcqOptions(r, val[c], [...val.filter((v, k) => k !== c), sq(A[1], B[1]), q5frac(A[1], B[1])], (s) => `$${s}$`);
        return { q: `${A[0][0].toUpperCase() + A[0].slice(1)} and ${B[0]} ${cond} (non-relativistic). The ratio of their de Broglie wavelengths, $\\lambda_{\\rm ${A[0].split(' ')[1]}}/\\lambda_{\\rm ${B[0].split(' ')[1]}}$, is (take masses $1:2:4$ for proton, deuteron and alpha, charges $e, e, 2e$)`, ...o,
          sol: `$\\lambda = h/p$. Same momentum: equal wavelengths. Same speed: $p = mv$, so $\\lambda \\propto 1/m$. Same kinetic energy: $p = \\sqrt{2mK}$, so $\\lambda \\propto 1/\\sqrt m$. Same accelerating voltage: $K = qV$, so $\\lambda \\propto 1/\\sqrt{qm}$. Here: $${val[c]}$.`,
          trap: 'Decide what is shared (K, v, p or V) before writing the ratio; the alpha particle has twice the charge.' };
      } },
    { id: 'mw-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'phase and group velocity', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['The uncertainty relation $\\Delta x\\,\\Delta p \\ge \\hbar/2$ is a property of waves, not a result of clumsy measurement.', 'A narrower wave packet needs a wider spread of wavenumbers.',
          'For a free non-relativistic particle, the group velocity of its matter wave equals the particle velocity.', 'For a free non-relativistic particle (no rest energy in $\\omega$), the phase velocity is half the particle velocity.', 'A free particle with an exactly known momentum is spread over all space.'];
        const F = ['For a free non-relativistic particle, the phase velocity of its matter wave equals the particle velocity.', 'A particle with an exactly known momentum is well localised.',
          'The de Broglie wavelength of a particle depends on its electric charge (at fixed momentum).', 'A wider wave packet needs a wider spread of wavenumbers.', 'Matter waves of free particles show no dispersion.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about matter waves are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'With $E = \\hbar\\omega = \\hbar^2k^2/2m$: $v_g = d\\omega/dk = \\hbar k/m = v$, while $v_p = \\omega/k = \\hbar k/2m = v/2$; since $v_p$ depends on $k$ the waves are dispersive and packets spread. A packet of width $\\Delta x$ needs $\\Delta k \\gtrsim 1/(2\\Delta x)$ (Fourier), which is the uncertainty relation; a single $k$ (exact momentum) is a plane wave filling all space. $\\lambda = h/p$ has no charge in it.',
          trap: 'Group velocity, not phase velocity, carries the particle.' };
      } },
    { id: 'mw-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'bohr and de broglie', unit: 'nm',
      make(r) {
        const n = Q5.int(r, 1, 5), Z = Q5.int(r, 1, 4);
        const lam = 2 * Math.PI * 0.0529 * n / Z;
        return { q: `In the Bohr model, the electron in the $n = ${n}$ orbit of a hydrogen-like ion with $Z = ${Z}$ has a de Broglie wavelength of ______ nm (to four decimal places; $a_0 = 0.0529$ nm).`,
          answer: Q5.round(lam, 4), tol: +(0.003 * lam).toPrecision(2), n, Z,
          sol: `Bohr's condition $mvr = n\\hbar$ is the same as $2\\pi r_n = n\\lambda$: $n$ wavelengths fit round the orbit. With $r_n = n^2a_0/Z$: $\\lambda = 2\\pi r_n/n = 2\\pi a_0 n/Z = 2\\pi\\times0.0529\\times${n}/${Z} = ${Q5.round(lam, 4)}$ nm.`,
          trap: 'The orbit holds $n$ whole wavelengths, so $\\lambda$ grows only as $n$, not $n^2$.' };
      },
      verify: (p) => { const v = 2.18769e6 * p.Z / p.n; return 6.62607e-34 / (9.10938e-31 * v) * 1e9; } },
    { id: 'mw-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'accelerated electrons', format: 'graph',
      make(r) {
        const [what, k] = Q5.choose(r, [['$\\log\\lambda$ against $\\log V$ for electrons accelerated from rest through $V$ (non-relativistic)', '-1/2'], ['$\\log\\lambda$ against $\\log p$ for any particle', '-1'],
          ['$\\log\\lambda$ against $\\log v$ for electrons of speed $v$ (non-relativistic)', '-1'], ['$\\log\\lambda$ against $\\log m$ for particles of the same kinetic energy', '-1/2'], ['$\\log\\lambda$ against $\\log E$ for photons of energy $E$', '-1'], ['$\\log\\lambda$ against $\\log T$ for thermal neutrons at temperature $T$', '-1/2']]);
        const o = Q5.mcqOptions(r, `$${k}$`, ['$-1/2$', '$-1$', '$1/2$', '$-2$', '$1$'].filter((s) => s !== `$${k}$`));
        return { q: `A graph of ${what} is a straight line. Its slope is`, ...o,
          sol: `$\\lambda = h/p$, so $\\log\\lambda = \\log h - \\log p$: slope $-1$ against $\\log p$, and also against $\\log v$ ($p = mv$) and $\\log E$ for photons ($p = E/c$). When $p = \\sqrt{2mK}$, with $K = eV$, $K$ fixed, or $K = \\tfrac32k_BT$, $\\lambda \\propto V^{-1/2}$, $m^{-1/2}$, $T^{-1/2}$: slope $-1/2$. Here the slope is $${k}$.`,
          trap: 'A power law $\\lambda \\propto x^n$ is a straight line of slope $n$ on a log-log graph.' };
      } },
    { id: 'mw-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'neutrons', unit: 'K',
      make(r) {
        const lam = Q5.pick(r, 0.1, 0.3, 0.01);
        const T = (6.626e-34) ** 2 / (3 * 1.675e-27 * 1.381e-23 * (lam * 1e-9) ** 2);
        return { q: `Neutrons with mean kinetic energy $\\tfrac32k_BT$ have de Broglie wavelength $${lam}$ nm. The temperature $T$ is ______ K (to three significant figures; $h = 6.626\\times10^{-34}$ J s, $m_n = 1.675\\times10^{-27}$ kg, $k_B = 1.381\\times10^{-23}$ J/K).`,
          answer: +T.toPrecision(3), tol: +(0.006 * T).toPrecision(2), lam,
          sol: `$\\lambda = h/\\sqrt{2m\\cdot\\tfrac32k_BT} = h/\\sqrt{3mk_BT}$, so $T = \\dfrac{h^2}{3mk_B\\lambda^2} = \\dfrac{(6.626\\times10^{-34})^2}{3\\times1.675\\times10^{-27}\\times1.381\\times10^{-23}\\times(${lam}\\times10^{-9})^2} = ${+T.toPrecision(3)}$ K.`,
          trap: 'Halving the wavelength needs four times the temperature.' };
      },
      verify: (p) => { const E = (6.626e-34) ** 2 / (2 * 1.675e-27 * (p.lam * 1e-9) ** 2); return 2 * E / (3 * 1.381e-23); } },
    { id: 'mw-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'accelerated electrons',
      make(r) {
        const V = choose(r, [25, 50, 64, 100, 144, 150, 200, 225, 300, 400, 500, 900, 1000]);
        const lam = lamV(V) * 1e9;
        return { q: `An electron is accelerated from rest through $${V}$ V. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg and $e = 1.6\\times10^{-19}$ C, its de Broglie wavelength is ______ nm (to three decimal places).`,
          answer: round(lam, 3), tol: Math.max(0.001, round(lam * 0.01, 3)), unit: 'nm', V,
          sol: `$\\lambda = h/\\sqrt{2m_eeV} = 6.63\\times10^{-34}/\\sqrt{2(9.11\\times10^{-31})(1.6\\times10^{-19})(${V})} = ${round(lam, 4)}$ nm (the rule $1.23/\\sqrt{V}$ nm gives the same).`,
          trap: 'The wavelength goes as $1/\\sqrt V$, not $1/V$.' };
      },
      verify: (p) => lamV(p.V) * 1e9 },
    { id: 'mw-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'de broglie',
      make(r) {
        const [name, m, mTex] = choose(r, [['an electron', me, 'm_e = 9.11\\times10^{-31}'], ['a proton', mp, 'm_p = 1.673\\times10^{-27}'], ['a neutron', mn, 'm_n = 1.675\\times10^{-27}']]);
        const K = m === me ? choose(r, [10, 20, 50, 100, 200, 500]) : choose(r, [0.01, 0.02, 0.025, 0.05, 0.1, 1]);
        const lam = h / Math.sqrt(2 * m * K * e) * 1e9;
        return { q: `Find the de Broglie wavelength of ${name} ($${mTex}$ kg) of kinetic energy $${K}$ eV, using $h = 6.63\\times10^{-34}$ J s and $1$ eV $= 1.6\\times10^{-19}$ J. Answer in nm, to three significant figures.`,
          answer: +lam.toPrecision(3), tol: lam * 0.01, unit: 'nm', m, K,
          sol: `$\\lambda = h/\\sqrt{2mK}$ with $K = ${K}\\times1.6\\times10^{-19}$ J: $\\lambda = ${+lam.toPrecision(4)}$ nm.`,
          trap: 'Turn eV into joules before using SI constants.' };
      },
      verify: (p) => h / Math.sqrt(2 * p.m * p.K * e) * 1e9 },
    { id: 'mw-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'uncertainty principle',
      make(r) {
        const dx = choose(r, [0.05, 0.1, 0.2, 0.5, 1, 2, 5]);
        const dv = hbar / (2 * me * dx * 1e-9);
        return { q: `An electron's position is uncertain by $${dx}$ nm. Using $\\Delta x\\,\\Delta p \\ge \\hbar/2$, $\\hbar = 1.055\\times10^{-34}$ J s and $m_e = 9.11\\times10^{-31}$ kg, the minimum uncertainty in its speed is ______ km/s (to three significant figures).`,
          answer: +(dv / 1000).toPrecision(3), tol: dv / 1000 * 0.01, unit: 'km/s', dx,
          sol: `$\\Delta v = \\hbar/(2m_e\\Delta x) = 1.055\\times10^{-34}/(2\\times9.11\\times10^{-31}\\times${dx}\\times10^{-9}) = ${+(dv / 1000).toPrecision(4)}$ km/s.`,
          trap: 'Halving the box doubles the speed uncertainty.' };
      },
      verify: (p) => hbar / (2 * me * p.dx * 1e-9) / 1000 },
    { id: 'mw-g04', type: 'mcq', level: 2, exams: ['jam'], sub: 'accelerated particles',
      make(r) {
        const ps = [['a proton', 1, 1], ['a deuteron', 2, 1], ['an alpha particle', 4, 2], ['a triton', 3, 1], ['a doubly charged lithium-6 ion', 6, 2]];
        let a = choose(r, ps), b = choose(r, ps); if (b === a) b = ps[(ps.indexOf(a) + 1) % ps.length];
        const ratio = Math.sqrt((b[1] * b[2]) / (a[1] * a[2]));
        const show = (v) => `$${round(v, 3)}$`;
        const o = mcqOptions(r, ratio, [1 / ratio, Math.sqrt(b[1] / a[1]), b[1] / a[1], ratio * ratio], show);
        return { q: `${a[0][0].toUpperCase() + a[0].slice(1)} (mass $${a[1]}m_p$, charge $${a[2]}e$) and ${b[0]} (mass $${b[1]}m_p$, charge $${b[2]}e$) start from rest and are accelerated through the same voltage. The ratio of their de Broglie wavelengths, first to second, is`, ...o,
          sol: `$K = qV$ so $\\lambda = h/\\sqrt{2mqV} \\propto 1/\\sqrt{mq}$. Ratio $= \\sqrt{(${b[1]}\\times${b[2]})/(${a[1]}\\times${a[2]})} = ${round(ratio, 3)}$.`,
          trap: 'Both the mass and the charge matter: the charge sets the kinetic energy gained.' };
      } },
    { id: 'mw-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'accelerated electrons',
      make(r) {
        const lam = choose(r, [0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.5]);
        const K = (h / (lam * 1e-9)) ** 2 / (2 * me) / e;
        return { q: `An electron has de Broglie wavelength $${lam}$ nm. Using $h = 6.63\\times10^{-34}$ J s, $m_e = 9.11\\times10^{-31}$ kg and $1$ eV $= 1.6\\times10^{-19}$ J, its kinetic energy is ______ eV (to three significant figures).`,
          answer: +K.toPrecision(3), tol: K * 0.01, unit: 'eV', lam,
          sol: `$K = p^2/2m = (h/\\lambda)^2/2m_e = (6.63\\times10^{-34}/${lam}\\times10^{-9})^2/(2\\times9.11\\times10^{-31})$ J $= ${+K.toPrecision(4)}$ eV.`,
          trap: '$K$ goes as $1/\\lambda^2$: halving the wavelength needs four times the energy.' };
      },
      verify: (p) => (h / (p.lam * 1e-9)) ** 2 / (2 * me) / e },
    { id: 'mw-g06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'energy-time',
      make(r) {
        const tau = choose(r, [0.5, 1, 1.6, 2, 5, 10, 16, 26]);
        const dnu = 1 / (4 * Math.PI * tau * 1e-9) / 1e6;
        return { q: `An excited state has lifetime $${tau}$ ns. Using $\\Delta E\\,\\Delta t \\ge \\hbar/2$ with $\\Delta t$ equal to the lifetime, the minimum frequency width $\\Delta E/h$ of the emitted line is ______ MHz (to three significant figures).`,
          answer: +dnu.toPrecision(3), tol: dnu * 0.01, unit: 'MHz', tau,
          sol: `$\\Delta\\nu = \\Delta E/h = (\\hbar/2\\tau)/h = 1/(4\\pi\\tau) = 1/(4\\pi\\times${tau}\\times10^{-9}) = ${+dnu.toPrecision(4)}$ MHz.`,
          trap: 'Divide by $h$, not $\\hbar$, to get an ordinary frequency.' };
      },
      verify: (p) => 1 / (4 * Math.PI * p.tau * 1e-9) / 1e6 },
    { id: 'mw-g07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'relativistic',
      make(r) {
        const K = choose(r, [50, 100, 120, 200, 300, 400, 500, 1000, 2000]);
        const lam = lamRelKeV(K);
        return { q: `Electrons in a microscope are accelerated through $${K}$ kV. Using $m_ec^2 = 511$ keV and $hc = 1.24$ MeV pm, and the relativistic momentum, their de Broglie wavelength is ______ pm (to three decimal places).`,
          answer: round(lam, 3), tol: Math.max(0.002, round(lam * 0.005, 3)), unit: 'pm', K,
          sol: `$pc = \\sqrt{K^2 + 2Km_ec^2} = \\sqrt{${K}^2 + 2(${K})(511)}$ keV $= ${round(Math.sqrt(K * K + 2 * K * 511), 1)}$ keV. $\\lambda = hc/pc = 1240/${round(Math.sqrt(K * K + 2 * K * 511), 1)} = ${round(lam, 3)}$ pm.`,
          trap: 'The non-relativistic formula overestimates the wavelength, by more as $K$ approaches $m_ec^2$.' };
      },
      verify: (p) => 1240 / Math.sqrt(p.K * p.K + 2 * p.K * 511) },
    { id: 'mw-g08', type: 'nat', level: 4, exams: ['jam'], sub: 'neutron diffraction',
      make(r) {
        const EmeV = choose(r, [10, 15, 20, 25, 30, 40, 50, 80]), d = choose(r, [0.2, 0.25, 0.3, 0.35, 0.4]);
        const lam = h / Math.sqrt(2 * mn * EmeV * 1e-3 * e) * 1e9;
        const th = Math.asin(lam / (2 * d)) / DEG;
        return { q: `Neutrons of kinetic energy $${EmeV}$ meV fall on crystal planes $${d}$ nm apart. Using $h = 6.63\\times10^{-34}$ J s, $m_n = 1.675\\times10^{-27}$ kg and $1$ eV $= 1.6\\times10^{-19}$ J, the first-order Bragg glancing angle is ______ degrees (to one decimal place).`,
          answer: round(th, 1), tol: 0.1, unit: 'degrees', EmeV, d,
          sol: `$\\lambda = h/\\sqrt{2m_nK} = ${round(lam, 4)}$ nm. Bragg: $\\sin\\theta = \\lambda/2d = ${round(lam, 4)}/${round(2 * d, 2)} = ${round(lam / (2 * d), 4)}$, so $\\theta = ${round(th, 1)}^\\circ$.`,
          trap: 'Bragg\'s law has $2d$: forgetting the 2 roughly doubles $\\sin\\theta$.' };
      },
      verify: (p) => Math.asin(h / Math.sqrt(2 * mn * p.EmeV * 1e-3 * e) * 1e9 / (2 * p.d)) / DEG },
  ],
};
