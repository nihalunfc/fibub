// Four-vectors and relativistic kinematics (GATE / CSIR NET level): the Minkowski interval, four-velocity and four-
// momentum, invariant mass, rapidity, decays, thresholds, centre-of-mass energy, Mandelstam variables, Doppler shift,
// aberration, hyperbolic motion and rockets. Lorentz transformations, time dilation and E = mc^2 are in the JAM topic
// special-relativity. Metric signature (+, -, -, -). Original questions for fibub.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './relativistic-kinematics.more.gen.js';
import more2 from './relativistic-kinematics.more2.gen.js';
import r4 from './relativistic-kinematics.r4.gen.js';

const M = { p: 938.27, n: 939.57, pi: 139.57, pi0: 134.98, mu: 105.66, e: 0.511, K: 493.68, K0: 497.61, L: 1115.68, eta: 547.86 };
const DEG = Math.PI / 180;
const lam = (a, b, c) => a * a + b * b + c * c - 2 * a * b - 2 * a * c - 2 * b * c;

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'relativistic-kinematics',
  items: [
    // ---------- level 1 ----------
    { id: 'rk-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'interval',
      q: 'Two events are separated by $\\Delta t$ and $\\Delta x$ (with $\\Delta y = \\Delta z = 0$). The separation is timelike, so that one event can cause the other, when',
      options: ['$c^2\\Delta t^2 > \\Delta x^2$', '$c^2\\Delta t^2 < \\Delta x^2$', '$c^2\\Delta t^2 = \\Delta x^2$', '$\\Delta t > 0$ in every frame, whatever $\\Delta x$'], answer: 0,
      sol: 'The interval $s^2 = c^2\\Delta t^2 - \\Delta x^2$ is the same in every inertial frame. If $s^2 > 0$ a signal slower than light can link the events and every observer agrees on their order. $s^2 = 0$ is lightlike; $s^2 < 0$ spacelike, and then the order of the events depends on the frame.' },
    { id: 'rk-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'four-velocity',
      q: 'With the metric signature $(+, -, -, -)$, the four-velocity $U^\\mu = dx^\\mu/d\\tau$ of any massive particle satisfies',
      options: ['$U_\\mu U^\\mu = 0$', '$U_\\mu U^\\mu = c^2$', '$U_\\mu U^\\mu = \\gamma^2c^2$', '$U_\\mu U^\\mu = v^2$'], answer: 1,
      sol: '$U^\\mu = \\gamma(c, \\vec v)$, so $U_\\mu U^\\mu = \\gamma^2(c^2 - v^2) = c^2$, the same for every particle in every frame. (In the rest frame, $U = (c, \\vec 0)$.)' },
    { id: 'rk-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'invariant mass',
      q: 'Two photons, each of energy 1 GeV, travel in exactly opposite directions. The invariant mass of the pair is ______ GeV/$c^2$.',
      answer: 2, tol: 0.001, unit: 'GeV/c²', calc: () => Math.sqrt((1 + 1) ** 2 - 0),
      sol: 'Total energy 2 GeV, total momentum 0 (they cancel). $Mc^2 = \\sqrt{E^2 - p^2c^2} = 2$ GeV. Two photons can have a large invariant mass even though each is massless.' },
    { id: 'rk-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'four-momentum',
      q: 'For a particle of mass $m$, energy $E$ and momentum $\\vec p$, the invariant $p_\\mu p^\\mu$ of its four-momentum $p^\\mu = (E/c, \\vec p)$ equals',
      options: ['$E^2 + p^2c^2$', '$\\gamma mc$', '$m^2c^2$', '$0$'], answer: 2,
      sol: '$p_\\mu p^\\mu = E^2/c^2 - p^2 = m^2c^2$, i.e. $E^2 = p^2c^2 + m^2c^4$. It is zero only for massless particles.' },
    { id: 'rk-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'interval',
      q: 'Which of these is the same in all inertial frames?',
      options: ['The time between two events', 'The length of a rod', 'The energy of a particle', 'The proper time between two events on a particle\'s path'], answer: 3,
      sol: 'Proper time $d\\tau = ds/c$ is built from the invariant interval, so all observers agree on it. Coordinate time, length and energy all depend on the frame (time dilation, length contraction, $E = \\gamma mc^2$).' },
    { id: 'rk-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'four-momentum',
      q: 'A particle has energy 5 GeV and momentum 4 GeV/$c$. Its rest mass is ______ GeV/$c^2$.',
      answer: 3, tol: 0.001, unit: 'GeV/c²', calc: () => Math.sqrt(25 - 16),
      sol: '$mc^2 = \\sqrt{E^2 - p^2c^2} = \\sqrt{25 - 16} = 3$ GeV. Its speed is $pc^2/E = 0.8c$.' },

    // ---------- level 2 ----------
    { id: 'rk-007', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'interval',
      q: 'In some frame, two events on the path of a clock are 5 s apart in time and 3 light-seconds apart in space. The clock records ______ s between them.',
      answer: 4, tol: 0, unit: 's', calc: () => Math.sqrt(25 - 9),
      sol: '$c^2\\Delta\\tau^2 = c^2\\Delta t^2 - \\Delta x^2$, so $\\Delta\\tau = \\sqrt{5^2 - 3^2} = 4$ s (the clock moves at $0.6c$, $\\gamma = 1.25$).' },
    { id: 'rk-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rapidity',
      q: 'The rapidity of a particle moving at $0.8c$ is $y = \\tanh^{-1}(v/c) = $ ______ (to three decimal places).',
      answer: 1.099, tol: 0.002, calc: () => Math.atanh(0.8),
      sol: '$y = \\tfrac12\\ln\\dfrac{1 + \\beta}{1 - \\beta} = \\tfrac12\\ln9 = \\ln3 = 1.099$. Rapidities add simply under boosts along one line, so two boosts of $0.8c$ give $y = 2\\ln3$, i.e. $\\beta = \\tanh(2\\ln3) = 0.976$. Also $\\gamma = \\cosh y = 5/3$.' },
    { id: 'rk-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'Which statements about four-vectors are correct?',
      options: ['The scalar product $A_\\mu B^\\mu$ of two four-vectors is the same in every inertial frame', 'The four-velocity of a massive particle is timelike', 'The four-momentum of a photon is null (lightlike)', 'The four-acceleration is parallel to the four-velocity'], answer: [0, 1, 2],
      sol: 'A: Lorentz transformations preserve the Minkowski product. B: $U\\cdot U = c^2 > 0$. C: $p\\cdot p = m^2c^2 = 0$. D: differentiating $U\\cdot U = c^2$ gives $U\\cdot A = 0$: the four-acceleration is orthogonal to the four-velocity (and spacelike).' },
    { id: 'rk-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'centre-of-mass energy',
      q: 'A particle of mass $m_1$ and energy $E_1$ strikes a particle of mass $m_2$ at rest. In units with $c = 1$, the square of the centre-of-mass energy is',
      options: ['$s = m_1^2 + m_2^2 + 2E_1m_2$', '$s = (E_1 + m_2)^2$', '$s = m_1^2 + m_2^2 + E_1m_2$', '$s = E_1^2 + m_2^2$'], answer: 0,
      sol: '$s = (p_1 + p_2)^2 = m_1^2 + m_2^2 + 2p_1\\cdot p_2$, and with $p_2 = (m_2, \\vec 0)$, $p_1\\cdot p_2 = E_1m_2$. Note $(E_1 + m_2)^2$ forgets to subtract the total momentum squared.' },
    { id: 'rk-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'decays',
      q: 'A $\\pi^+$ ($139.57$ MeV/$c^2$) at rest decays to $\\mu^+$ ($105.66$ MeV/$c^2$) and a massless neutrino. The muon\'s momentum is ______ MeV/$c$.',
      answer: 29.79, tol: 0.1, unit: 'MeV/c', calc: () => (139.57 ** 2 - 105.66 ** 2) / (2 * 139.57),
      sol: 'Momentum balance: $p_\\mu = p_\\nu = p$. Energy: $m_\\pi = \\sqrt{p^2 + m_\\mu^2} + p$. So $(m_\\pi - p)^2 = p^2 + m_\\mu^2$, giving $p = \\dfrac{m_\\pi^2 - m_\\mu^2}{2m_\\pi} = 29.79$ MeV/$c$.' },
    { id: 'rk-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'invariant mass',
      q: 'A single photon cannot turn into an electron-positron pair in empty space because',
      options: ['charge would not be conserved', 'the photon\'s invariant mass is zero, but the pair\'s invariant mass is at least $2m_ec^2$', 'the photon\'s energy is always too small', 'spin would not be conserved'], answer: 1,
      sol: 'Four-momentum conservation requires $p_\\gamma^2 = (p_+ + p_-)^2$. The left side is 0; the right side is at least $(2m_e c)^2$. No frame fixes this, since both sides are invariants. Near a nucleus, the nucleus takes up momentum and pair production is allowed.' },
    { id: 'rk-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'four-velocity',
      q: 'A particle\'s four-velocity is $U^\\mu = \\left(\\tfrac54c, \\tfrac34c, 0, 0\\right)$. Its ordinary speed is',
      options: ['$0.75c$', '$0.8c$', '$0.6c$', '$0.45c$'], answer: 2,
      sol: '$U^0 = \\gamma c$ gives $\\gamma = 5/4$, and $U^1 = \\gamma v$ gives $v = (3/4)c/(5/4) = 0.6c$. Check: $U\\cdot U = (25/16 - 9/16)c^2 = c^2$.',
      trap: 'The spatial part $U^1 = 0.75c$ is $\\gamma v$, not $v$.' },
    { id: 'rk-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Doppler effect',
      q: 'A source of frequency $f_0$ moves past an observer. Light that reaches the observer travelling at right angles to the source\'s velocity (in the observer\'s frame) has frequency',
      options: ['$\\gamma f_0$', '$f_0$', '$f_0\\sqrt{\\dfrac{1 - \\beta}{1 + \\beta}}$', '$f_0/\\gamma$'], answer: 3,
      sol: 'The general result, from the four-wavevector, is $f = \\dfrac{f_0}{\\gamma(1 - \\beta\\cos\\theta)}$ with $\\theta$ the angle in the observer\'s frame between the source velocity and the direction to the observer. At $\\theta = 90^\\circ$: $f = f_0/\\gamma$, a pure time-dilation redshift with no classical counterpart (the transverse Doppler effect).' },
    { id: 'rk-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Mandelstam variables',
      q: 'For a two-to-two reaction $1 + 2 \\to 3 + 4$ with $s = (p_1 + p_2)^2$, $t = (p_1 - p_3)^2$, $u = (p_1 - p_4)^2$ ($c = 1$), which statements are correct?',
      options: ['$s + t + u = m_1^2 + m_2^2 + m_3^2 + m_4^2$', '$\\sqrt s$ is the total energy in the centre-of-mass frame', 'For elastic scattering, $t \\le 0$', '$s$, $t$ and $u$ have different values in different frames'], answer: [0, 1, 2],
      sol: 'A: expand and use $p_1 + p_2 = p_3 + p_4$. B: in the CM frame $p_1 + p_2 = (E_{\\rm tot}, \\vec 0)$. C: in the CM frame of elastic scattering $t = -2p^2(1 - \\cos\\theta) \\le 0$. D is false: they are invariants by construction, which is why they are used.' },
    { id: 'rk-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'centre-of-mass energy',
      q: 'A 7000 GeV proton beam strikes protons at rest ($m_pc^2 = 0.938$ GeV). The centre-of-mass energy $\\sqrt s$ is ______ GeV.',
      answer: 114.6, tol: 0.3, unit: 'GeV', calc: () => Math.sqrt(2 * 0.93827 ** 2 + 2 * 7000 * 0.93827),
      sol: '$s = 2m_p^2 + 2E_1m_p = 2(0.880) + 2(7000)(0.938) = 13137$ GeV², so $\\sqrt s = 114.6$ GeV. Two 7000 GeV beams colliding head-on give 14 000 GeV instead: that is why colliders are built.' },
    { id: 'rk-041', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'four-momentum',
      q: 'A proton ($m_pc^2 = 0.938$ GeV) has kinetic energy 2 GeV. Its momentum is ______ GeV/$c$.',
      answer: 2.784, tol: 0.01, unit: 'GeV/c', calc: () => Math.sqrt(2 ** 2 + 2 * 2 * 0.93827),
      sol: '$E = T + mc^2 = 2.938$ GeV. $pc = \\sqrt{E^2 - m^2c^4} = \\sqrt{T^2 + 2Tmc^2} = \\sqrt{4 + 3.753} = 2.784$ GeV.' },

    // ---------- level 3 ----------
    { id: 'rk-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thresholds',
      q: 'For the reaction $\\pi^- + p \\to K^0 + \\Lambda$ with the proton at rest, the threshold kinetic energy of the pion is ______ MeV. (Masses in MeV/$c^2$: $\\pi^-$ 139.57, $p$ 938.27, $K^0$ 497.61, $\\Lambda$ 1115.68.)',
      answer: 767.9, tol: 2, unit: 'MeV', calc: () => ((497.61 + 1115.68) ** 2 - 139.57 ** 2 - 938.27 ** 2) / (2 * 938.27) - 139.57,
      sol: 'At threshold the products are at rest in the CM frame, so $\\sqrt s = m_K + m_\\Lambda = 1613.29$ MeV. With $s = m_\\pi^2 + m_p^2 + 2E_\\pi m_p$: $E_\\pi = \\dfrac{1613.29^2 - 139.57^2 - 938.27^2}{2\\times938.27} = 907.5$ MeV, so $T_\\pi = 907.5 - 139.6 = 767.9$ MeV.',
      trap: 'The naive guess, the mass difference $m_K + m_\\Lambda - m_\\pi - m_p = 535$ MeV, ignores the energy locked in the motion of the centre of mass.' },
    { id: 'rk-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'thresholds',
      q: 'The threshold photon energy for $\\gamma + N \\to N + e^+ + e^-$ on a nucleus of mass $M$ at rest is',
      options: ['$2m_ec^2\\left(1 + \\dfrac{m_e}{M}\\right)$', '$2m_ec^2$', '$m_ec^2\\left(1 + \\dfrac{m_e}{M}\\right)$', '$2m_ec^2\\left(1 - \\dfrac{m_e}{M}\\right)$'], answer: 0,
      sol: '$s = M^2 + 2E_\\gamma M$ must reach $(M + 2m_e)^2 = M^2 + 4Mm_e + 4m_e^2$. So $E_\\gamma = 2m_e + 2m_e^2/M = 2m_ec^2(1 + m_e/M)$. For a heavy nucleus this is just above 1.022 MeV; on a free electron ($M = m_e$) it rises to $4m_ec^2$.' },
    { id: 'rk-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decays',
      q: 'A $K^+$ (493.68 MeV/$c^2$) at rest decays to $\\pi^+$ (139.57) and $\\pi^0$ (134.98). The momentum of each pion is ______ MeV/$c$.',
      answer: 205.1, tol: 0.5, unit: 'MeV/c', calc: () => Math.sqrt(lam(493.68 ** 2, 139.57 ** 2, 134.98 ** 2)) / (2 * 493.68),
      sol: 'For $M \\to m_1 + m_2$ at rest, $p = \\dfrac{\\sqrt{\\lambda(M^2, m_1^2, m_2^2)}}{2M}$ with $\\lambda(a, b, c) = a^2 + b^2 + c^2 - 2ab - 2ac - 2bc$. Equivalently $p = \\dfrac{\\sqrt{(M^2 - (m_1 + m_2)^2)(M^2 - (m_1 - m_2)^2)}}{2M} = 205.1$ MeV/$c$.' },
    { id: 'rk-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Compton scattering',
      q: 'A photon of energy $E$ scatters straight back ($180^\\circ$) from a free electron at rest. Its final energy is',
      options: ['$E$', '$\\dfrac{E}{1 + 2E/m_ec^2}$', '$\\dfrac{E}{1 + E/m_ec^2}$', '$E - 2m_ec^2$'], answer: 1,
      sol: 'From $(p_\\gamma + p_e - p_\\gamma\')^2 = p_e^2$: $\\dfrac1{E\'} - \\dfrac1E = \\dfrac{1 - \\cos\\theta}{m_ec^2}$. At $\\theta = 180^\\circ$: $E\' = E/(1 + 2E/m_ec^2)$. For very high $E$ this tends to $m_ec^2/2 = 255.5$ keV.' },
    { id: 'rk-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'invariant mass',
      q: 'A detector sees two photons of 100 MeV each, with an opening angle of $90^\\circ$ between them. If they come from the decay of one particle, its mass is ______ MeV/$c^2$.',
      answer: 141.4, tol: 0.3, unit: 'MeV/c²', calc: () => Math.sqrt(2 * 100 * 100 * (1 - Math.cos(Math.PI / 2))),
      sol: 'For two massless particles, $M^2c^4 = (p_1 + p_2)^2 = 2E_1E_2(1 - \\cos\\theta) = 2\\times100\\times100\\times1 = 20000$ MeV², so $M = 141.4$ MeV/$c^2$ (close to the $\\pi^0$).' },
    { id: 'rk-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'accelerated motion',
      q: 'A rocket moves along $x$ with constant proper acceleration $a$ (starting from rest at $x = c^2/a$, $t = 0$). Which statements are correct?',
      options: ['Its world line is the hyperbola $x^2 - c^2t^2 = c^4/a^2$', 'Its rapidity grows linearly with proper time, $y = a\\tau/c$', 'Its speed approaches but never reaches $c$', 'Its proper acceleration is different for different inertial observers'], answer: [0, 1, 2],
      sol: 'Constant proper acceleration means $dy/d\\tau = a/c$, so $y = a\\tau/c$, $ct = (c^2/a)\\sinh y$, $x = (c^2/a)\\cosh y$: hyperbolic motion with $v = c\\tanh y < c$. Proper acceleration is the size of the four-acceleration, an invariant.' },
    { id: 'rk-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'accelerated motion',
      q: 'A spaceship accelerates from rest with a constant proper acceleration of 9.8 m/s² for one year of its own time ($3.156\\times10^7$ s). Its Lorentz factor is then ______.',
      answer: 1.581, tol: 0.01, calc: () => Math.cosh(9.8 * 3.156e7 / 2.99792458e8),
      sol: 'Rapidity $y = a\\tau/c = 9.8\\times3.156\\times10^7/2.998\\times10^8 = 1.032$. $\\gamma = \\cosh y = 1.581$ (speed $\\tanh y = 0.775c$).',
      trap: 'Newton would give $v = a\\tau = 1.03c$; the rapidity, not the speed, grows linearly.' },
    { id: 'rk-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'aberration',
      q: 'A source moving at speed $\\beta c$ emits a photon at $90^\\circ$ to its motion in its own rest frame. In the lab, the photon\'s angle $\\theta$ to the direction of motion satisfies',
      options: ['$\\theta = 90^\\circ$', '$\\cos\\theta = 1/\\gamma$', '$\\sin\\theta = 1/\\gamma$', '$\\tan\\theta = \\beta$'], answer: 2,
      sol: 'Aberration: $\\cos\\theta = \\dfrac{\\cos\\theta\' + \\beta}{1 + \\beta\\cos\\theta\'}$. With $\\theta\' = 90^\\circ$: $\\cos\\theta = \\beta$, so $\\sin\\theta = \\sqrt{1 - \\beta^2} = 1/\\gamma$. Half of all the light emitted (isotropically) in the rest frame is squeezed into a forward cone of half-angle about $1/\\gamma$: the headlight effect behind synchrotron beams.' },
    { id: 'rk-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'aberration',
      q: 'An electron with $\\gamma = 10$ emits light isotropically in its own rest frame. In the lab, half of the photons lie within a forward cone of half-angle ______ degrees.',
      answer: 5.74, tol: 0.05, unit: '°', calc: () => Math.asin(0.1) * 180 / Math.PI,
      sol: 'Half the photons are emitted forward of $90^\\circ$ in the rest frame. That boundary maps to $\\sin\\theta = 1/\\gamma = 0.1$, so $\\theta = 5.74^\\circ$.' },
    { id: 'rk-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'collisions',
      q: 'A fast particle scatters elastically from an identical particle at rest. Compared with the Newtonian result, the angle between the two outgoing particles is',
      options: ['always exactly $90^\\circ$', 'greater than $90^\\circ$', 'zero', 'less than $90^\\circ$ (for any scattering angle other than $0$)'], answer: 3,
      sol: 'Relativistically $\\tan\\theta_1\\tan\\theta_2 = \\dfrac{2}{\\gamma + 1}$ (with $\\gamma$ of the projectile in the lab). For $\\gamma > 1$ this is below 1, so $\\theta_1 + \\theta_2 < 90^\\circ$. This was seen in early cloud-chamber photos of fast electrons hitting electrons.' },
    { id: 'rk-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'centre-of-mass energy',
      q: 'A beam particle of mass $m_1$ and energy $E_1$ hits a particle of mass $m_2$ at rest ($c = 1$). Which statements are correct?',
      options: ['The Lorentz factor of the centre-of-mass frame is $\\gamma_{\\rm cm} = (E_1 + m_2)/\\sqrt s$', 'For $E_1 \\gg m_1, m_2$, $\\sqrt s$ grows only like $\\sqrt{E_1}$', 'At high energy most of the beam energy goes into the motion of the centre of mass', '$\\sqrt s = E_1 + m_2$'], answer: [0, 1, 2],
      sol: 'The total four-momentum is $(E_1 + m_2, \\vec p_1)$ with invariant mass $\\sqrt s$, so $\\gamma_{\\rm cm} = E_{\\rm tot}/\\sqrt s$. With $s \\approx 2E_1m_2$, $\\sqrt s \\propto \\sqrt{E_1}$. The rest of the energy, $E_1 + m_2 - \\sqrt s$, is just the CM moving. D forgets to subtract $p_1^2$.' },
    { id: 'rk-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rapidity',
      q: 'In terms of the rapidity $y$ (with $\\beta = \\tanh y$), a boost along $x$ acts on $(ct, x)$ as',
      options: ['$\\begin{pmatrix}\\cosh y & -\\sinh y\\\\ -\\sinh y & \\cosh y\\end{pmatrix}$', '$\\begin{pmatrix}\\cos y & -\\sin y\\\\ \\sin y & \\cos y\\end{pmatrix}$', '$\\begin{pmatrix}\\cosh y & \\sinh y\\\\ -\\sinh y & \\cosh y\\end{pmatrix}$', '$\\begin{pmatrix}\\cosh y & -\\sinh y\\\\ \\sinh y & -\\cosh y\\end{pmatrix}$'], answer: 0,
      sol: '$\\gamma = \\cosh y$ and $\\gamma\\beta = \\sinh y$, so $ct\' = ct\\cosh y - x\\sinh y$ and $x\' = -ct\\sinh y + x\\cosh y$. The matrix is a hyperbolic rotation; its determinant is $\\cosh^2y - \\sinh^2y = 1$, and two boosts multiply to a boost by $y_1 + y_2$.' },
    { id: 'rk-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'four-vectors',
      q: 'With signature $(+, -, -, -)$, which of these four-vectors (components $(A^0, A^1, A^2, A^3)$) is null?',
      options: ['$(2, 1, 1, 1)$', '$(2, 1, 1, \\sqrt2)$', '$(1, 1, 1, 0)$', '$(3, 2, 2, 0)$'], answer: 1,
      sol: '$A\\cdot A = (A^0)^2 - |\\vec A|^2$: $4 - 3 = 1$ (timelike); $4 - 1 - 1 - 2 = 0$ (null); $1 - 2 = -1$ (spacelike); $9 - 8 = 1$ (timelike).' },

    // ---------- level 4 ----------
    { id: 'rk-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Mandelstam variables',
      q: 'In the centre-of-mass frame, two particles scatter elastically with momentum 1 GeV/$c$ each, through $60^\\circ$. The Mandelstam variable $t$ is ______ GeV² (with $c = 1$).',
      answer: -1, tol: 0.001, unit: 'GeV²', calc: () => -2 * 1 * (1 - Math.cos(Math.PI / 3)),
      sol: 'In the CM frame of elastic scattering the energies do not change, so $t = (p_1 - p_3)^2 = -|\\vec p_1 - \\vec p_3|^2 = -2p^2(1 - \\cos\\theta) = -2(1)(0.5) = -1$ GeV².' },
    { id: 'rk-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'decays',
      q: 'A $\\pi^0$ of mass $m$ and energy $E = \\gamma mc^2$ decays into two photons. The smallest possible opening angle $\\theta_{\\min}$ between the photons in the lab satisfies',
      options: ['$\\cos\\theta_{\\min} = 1/\\gamma$', '$\\theta_{\\min} = 0$', '$\\sin(\\theta_{\\min}/2) = 1/\\gamma$', '$\\tan\\theta_{\\min} = 1/\\gamma$'], answer: 2,
      sol: '$m^2c^4 = 2E_1E_2(1 - \\cos\\theta) = 4E_1E_2\\sin^2(\\theta/2)$. For fixed $E_1 + E_2 = E$, the product $E_1E_2$ is largest ($E^2/4$) for equal sharing, which gives the smallest angle: $\\sin(\\theta_{\\min}/2) = mc^2/E = 1/\\gamma$.' },
    { id: 'rk-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'decays',
      q: 'A neutral pion (135 MeV/$c^2$) with total energy 1350 MeV decays to two photons. The smallest possible opening angle between them is ______ degrees.',
      answer: 11.48, tol: 0.05, unit: '°', calc: () => 2 * Math.asin(0.1) * 180 / Math.PI,
      sol: '$\\sin(\\theta_{\\min}/2) = m/E = 0.1$, so $\\theta_{\\min} = 2\\sin^{-1}0.1 = 11.48^\\circ$ (each photon then carries 675 MeV).' },
    { id: 'rk-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'rockets',
      q: 'A relativistic rocket ejects exhaust at speed $u$ relative to itself, going from rest mass $m_i$ to $m_f$. Which statements are correct?',
      options: ['Its rapidity increases by $(u/c)\\ln(m_i/m_f)$', 'For a photon rocket ($u = c$) reaching speed $\\beta c$, $m_i/m_f = \\sqrt{(1 + \\beta)/(1 - \\beta)}$', 'Its speed stays below $c$ however large the mass ratio', 'The Newtonian result $\\Delta v = u\\ln(m_i/m_f)$ holds exactly for the speed'], answer: [0, 1, 2],
      sol: 'In the instantaneous rest frame, momentum balance gives $m\\,dv\' = -u\\,dm$, and a small $dv\'$ is a small rapidity $c\\,dy$. So $dy = -(u/c)\\,dm/m$, which integrates to A. With $u = c$: $\\ln(m_i/m_f) = \\tanh^{-1}\\beta$, i.e. B. Since $v = c\\tanh y$, C follows. The Newtonian formula is the small-speed limit only.' },
    { id: 'rk-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rockets',
      q: 'A photon rocket starts from rest and reaches $0.8c$. The ratio of its initial to final rest mass is ______.',
      answer: 3, tol: 0.005, calc: () => Math.sqrt(1.8 / 0.2),
      sol: '$m_i/m_f = e^{y} = \\sqrt{\\dfrac{1 + \\beta}{1 - \\beta}} = \\sqrt{\\dfrac{1.8}{0.2}} = 3$. Two thirds of the starting mass must be turned into light.' },
    { id: 'rk-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'accelerated motion',
      q: 'A particle moves at constant speed $v$ on a circle of radius $r$ in the lab. Its proper acceleration (the acceleration it feels) is',
      options: ['$v^2/r$', '$\\gamma v^2/r$', '$v^2/(\\gamma r)$', '$\\gamma^2v^2/r$'], answer: 3,
      sol: 'In the instantaneous rest frame, transverse acceleration is larger by $\\gamma^2$: one $\\gamma$ from time dilation in each of the two time derivatives (transverse lengths are unchanged). So $\\alpha = \\gamma^2v^2/r$. Equivalently, $|A^\\mu| = \\gamma^2 a$ for $\\vec a \\perp \\vec v$.' },
    { id: 'rk-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Compton scattering',
      q: 'Gamma rays of 662 keV Compton-scatter in a detector ($m_ec^2 = 511$ keV). The largest kinetic energy an electron can receive (the Compton edge) is ______ keV.',
      answer: 477.7, tol: 1, unit: 'keV', calc: () => 662 * 1324 / (511 + 1324),
      sol: 'The electron gets the most when the photon goes straight back: $E\' = \\dfrac{E}{1 + 2E/m_ec^2} = \\dfrac{662}{1 + 2.591} = 184.3$ keV. So $T_{\\max} = 662 - 184.3 = 477.7$ keV, i.e. $T_{\\max} = \\dfrac{2E^2}{m_ec^2 + 2E}$.' },
    { id: 'rk-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'velocity transformation',
      q: 'Frame $S\'$ moves at $v$ along $x$ relative to $S$. A particle has velocity $(u_x, u_y, 0)$ in $S$. Its $y$ velocity in $S\'$ is',
      options: ['$\\dfrac{u_y}{\\gamma(1 - vu_x/c^2)}$', '$u_y$', '$\\dfrac{u_y}{1 - vu_x/c^2}$', '$\\gamma u_y$'], answer: 0,
      sol: '$dy\' = dy$ and $dt\' = \\gamma(dt - v\\,dx/c^2)$, so $u_y\' = \\dfrac{dy}{\\gamma(dt - v\\,dx/c^2)} = \\dfrac{u_y}{\\gamma(1 - vu_x/c^2)}$. Transverse velocities change even though transverse lengths do not, because the time intervals change.' },

    // ---------- level 5 ----------
    { id: 'rk-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thresholds',
      q: 'Cosmic-ray protons can make pions on cosmic microwave background photons, $p + \\gamma \\to p + \\pi^0$. For a head-on collision with a photon of $6.4\\times10^{-4}$ eV, the threshold proton energy is $f\\times10^{20}$ eV. The value of $f$ is ______ ($m_pc^2 = 938.27$ MeV, $m_{\\pi^0}c^2 = 134.98$ MeV).',
      answer: 1.061, tol: 0.005, calc: () => (134.98e6 ** 2 + 2 * 134.98e6 * 938.27e6) / (4 * 6.4e-4) / 1e20,
      sol: 'For an ultra-relativistic proton ($E_p \\approx p_pc$) meeting a photon head-on, $s = m_p^2 + 2E_\\gamma(E_p + p_p) \\approx m_p^2 + 4E_\\gamma E_p$. Threshold: $s = (m_p + m_\\pi)^2$, so $E_p = \\dfrac{m_\\pi^2 + 2m_\\pi m_p}{4E_\\gamma} = \\dfrac{2.715\\times10^{17}\\ \\text{eV}^2}{2.56\\times10^{-3}\\ \\text{eV}} = 1.06\\times10^{20}$ eV. This is the origin of the GZK cut-off in the cosmic-ray spectrum.' },
    { id: 'rk-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'collisions',
      q: 'A particle with Lorentz factor $\\gamma$ scatters elastically off an identical particle at rest. The lab angles $\\theta_1$, $\\theta_2$ of the two outgoing particles satisfy',
      options: ['$\\tan\\theta_1\\tan\\theta_2 = 1$', '$\\tan\\theta_1\\tan\\theta_2 = \\dfrac{2}{\\gamma + 1}$', '$\\tan\\theta_1\\tan\\theta_2 = \\dfrac{\\gamma + 1}{2}$', '$\\theta_1 + \\theta_2 = 90^\\circ/\\gamma$'], answer: 1,
      sol: 'In the CM frame each particle has speed $\\beta_c$ with $\\gamma_c^2 = (\\gamma + 1)/2$, and they leave back to back at $\\Theta$ and $\\Theta + \\pi$. Boosting to the lab: $\\tan\\theta_1 = \\dfrac{\\sin\\Theta}{\\gamma_c(1 + \\cos\\Theta)}$ and $\\tan\\theta_2 = \\dfrac{\\sin\\Theta}{\\gamma_c(1 - \\cos\\Theta)}$. Their product is $1/\\gamma_c^2 = 2/(\\gamma + 1)$. For $\\gamma \\to 1$ it gives the Newtonian $90^\\circ$ opening.' },
    { id: 'rk-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thresholds',
      q: 'High-energy gamma rays from distant sources are absorbed by pair production on starlight, $\\gamma + \\gamma \\to e^+ + e^-$. For a head-on collision with a 1 eV photon, the threshold energy of the gamma ray is ______ GeV ($m_ec^2 = 0.511$ MeV).',
      answer: 261.1, tol: 1, unit: 'GeV', calc: () => 0.51099895 ** 2 * 1e12 / 1 / 1e9,
      sol: 'For two photons $s = 2E_1E_2(1 - \\cos\\theta)$; head-on, $s = 4E_1E_2$. Threshold: $s = (2m_e)^2$, so $E_1 = m_e^2/E_2 = (0.511\\times10^6\\ \\text{eV})^2/(1\\ \\text{eV}) = 2.61\\times10^{11}$ eV $= 261$ GeV.' },
    { id: 'rk-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'invariant mass',
      q: 'Which statements about the invariant mass of a system of particles are correct?',
      options: ['The square of the total four-momentum is the same in all frames', 'In the centre-of-mass frame the total three-momentum is zero', 'The invariant mass of a system equals the sum of the rest masses of its particles', 'A massless particle has no rest frame, but a system of two massless particles moving in different directions does'], answer: [0, 1, 3],
      sol: 'A: it is a Minkowski square. B: that defines the CM frame, where $Mc^2$ is the total energy. C is false: the invariant mass includes the kinetic energy in the CM frame (a box of hot gas weighs more). D: two photons that are not collinear have $M > 0$, so a frame exists where their momenta cancel.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'rk-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'four-momentum',
      make(r) {
        const [m, p] = choose(r, [[3, 4], [5, 12], [8, 15], [7, 24], [20, 21], [9, 40], [12, 35], [1, 1], [2, 3], [0.5, 2]]);
        const k = choose(r, [1, 10, 100, 0.1]);
        const E = round(Math.hypot(m, p) * k, 4), P = round(p * k, 4);
        const ask = choose(r, ['m', 'v']);
        const answer = round(ask === 'm' ? Math.sqrt(E * E - P * P) : P / E, 4);
        return { q: `A particle has energy ${E} GeV and momentum ${P} GeV/$c$. Find ${ask === 'm' ? 'its rest mass in GeV/$c^2$' : 'its speed as a fraction of $c$'}.`,
          answer, tol: Math.max(0.001, answer * 0.002), E, P, ask,
          sol: ask === 'm' ? `$mc^2 = \\sqrt{E^2 - p^2c^2} = \\sqrt{${E}^2 - ${P}^2} = ${answer}$ GeV.` : `$\\beta = pc/E = ${P}/${E} = ${answer}$.`,
          trap: ask === 'v' ? 'The speed is $pc^2/E$, not $p/m$.' : 'Subtract squares, not the values themselves.' };
      },
      verify: (p) => (p.ask === 'm' ? Math.sqrt(p.E * p.E - p.P * p.P) : p.P / p.E) },
    { id: 'rk-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'decays',
      make(r) {
        const [name, Mp, m1, m2, d] = choose(r, [
          ['$\\pi^+ \\to \\mu^+\\nu_\\mu$', M.pi, M.mu, 0, '\\mu^+'],
          ['$K^+ \\to \\mu^+\\nu_\\mu$', M.K, M.mu, 0, '\\mu^+'],
          ['$K^+ \\to \\pi^+\\pi^0$', M.K, M.pi, M.pi0, '\\pi^+'],
          ['$\\Lambda \\to p\\,\\pi^-$', M.L, M.p, M.pi, 'p'],
          ['$K^0 \\to \\pi^+\\pi^-$', M.K0, M.pi, M.pi, '\\pi^+'],
          ['$\\pi^+ \\to e^+\\nu_e$', M.pi, M.e, 0, 'e^+'],
          ['$\\eta \\to \\gamma\\gamma$', M.eta, 0, 0, '\\gamma'],
        ]);
        const p = Math.sqrt(lam(Mp * Mp, m1 * m1, m2 * m2)) / (2 * Mp);
        const ask = choose(r, ['p', 'E']);
        const answer = round(ask === 'p' ? p : Math.sqrt(p * p + m1 * m1), 3);
        return { q: `For the decay ${name} at rest (masses in MeV/$c^2$: parent ${Mp}, daughters ${m1} and ${m2}), find the ${ask === 'p' ? 'momentum (MeV/$c$)' : 'total energy (MeV)'} of the $${d}$.`,
          answer, tol: Math.max(0.05, answer * 0.002), unit: ask === 'p' ? 'MeV/c' : 'MeV', Mp, m1, m2, ask,
          sol: `$p = \\dfrac{\\sqrt{(M^2 - (m_1 + m_2)^2)(M^2 - (m_1 - m_2)^2)}}{2M} = ${round(p, 3)}$ MeV/$c$.${ask === 'E' ? ` Then $E = \\sqrt{p^2 + m_1^2} = ${answer}$ MeV (equivalently $(M^2 + m_1^2 - m_2^2)/2M$).` : ''}`,
          trap: 'Both daughters have the same momentum but not the same energy.' };
      },
      verify: (q) => { const p = Math.sqrt(lam(q.Mp ** 2, q.m1 ** 2, q.m2 ** 2)) / (2 * q.Mp); return q.ask === 'p' ? p : Math.sqrt(p * p + q.m1 ** 2); } },
    { id: 'rk-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thresholds',
      make(r) {
        const [rx, ma, mb, fin] = choose(r, [
          ['$p + p \\to p + p + \\pi^0$ (beam proton on proton at rest)', M.p, M.p, [M.p, M.p, M.pi0]],
          ['$\\pi^- + p \\to K^0 + \\Lambda$ (pion beam, proton at rest)', M.pi, M.p, [M.K0, M.L]],
          ['$\\gamma + p \\to p + \\pi^0$ (photon beam, proton at rest)', 0, M.p, [M.p, M.pi0]],
          ['$\\gamma + p \\to n + \\pi^+$ (photon beam, proton at rest)', 0, M.p, [M.n, M.pi]],
          ['$p + p \\to p + p + \\eta$ (beam proton on proton at rest)', M.p, M.p, [M.p, M.p, M.eta]],
          ['$\\pi^- + p \\to n + \\eta$ (pion beam, proton at rest)', M.pi, M.p, [M.n, M.eta]],
        ]);
        const Mf = fin.reduce((s, x) => s + x, 0);
        const E = (Mf * Mf - ma * ma - mb * mb) / (2 * mb), answer = round(E - ma, 2);
        return { q: `Find the threshold kinetic energy (MeV) of the beam particle for ${rx}. Masses in MeV/$c^2$: beam ${ma}, target ${mb}, products ${fin.join(', ')}.`,
          answer, tol: Math.max(0.2, answer * 0.003), unit: 'MeV', ma, mb, Mf,
          sol: `At threshold $\\sqrt s = \\sum m_f = ${round(Mf, 2)}$ MeV. With $s = m_a^2 + m_b^2 + 2E_am_b$: $E_a = \\dfrac{${round(Mf, 2)}^2 - ${ma}^2 - ${mb}^2}{2\\times${mb}} = ${round(E, 2)}$ MeV, so $T_a = ${answer}$ MeV.`,
          trap: 'The threshold kinetic energy is larger than the mass difference, because the products must still move with the centre of mass.' };
      },
      verify: (p) => (p.Mf ** 2 - p.ma ** 2 - p.mb ** 2) / (2 * p.mb) - p.ma },
    { id: 'rk-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'invariant mass',
      make(r) {
        const E1 = int(r, 20, 500), E2 = int(r, 20, 500), th = choose(r, [30, 45, 60, 90, 120, 150, 180]);
        const answer = round(Math.sqrt(2 * E1 * E2 * (1 - Math.cos(th * DEG))), 2);
        return { q: `Two photons of ${E1} MeV and ${E2} MeV have an opening angle of ${th}°. Find their invariant mass in MeV/$c^2$.`,
          answer, tol: Math.max(0.1, answer * 0.003), unit: 'MeV/c²', E1, E2, th,
          sol: `$M^2c^4 = 2E_1E_2(1 - \\cos\\theta) = 2\\times${E1}\\times${E2}\\times(1 - \\cos ${th}^\\circ)$, so $M = ${answer}$ MeV/$c^2$.` };
      },
      verify: (p) => Math.sqrt(2 * p.E1 * p.E2 * (1 - Math.cos(p.th * DEG))) },
    { id: 'rk-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'centre-of-mass energy',
      make(r) {
        const [bn, mb1, tn, mt] = choose(r, [['proton', 0.93827, 'proton', 0.93827], ['electron', 0.000511, 'electron', 0.000511], ['electron', 0.000511, 'proton', 0.93827], ['positron', 0.000511, 'electron', 0.000511], ['proton', 0.93827, 'electron', 0.000511]]);
        const E = choose(r, [1, 5, 10, 50, 100, 400, 1000]), collider = r() < 0.4;
        const answer = round(collider ? 2 * E : Math.sqrt(mb1 * mb1 + mt * mt + 2 * E * mt), 4);
        return { q: collider ? `A ${bn} of ${E} GeV collides head-on with a ${tn} of ${E} GeV (both highly relativistic, masses negligible). Find $\\sqrt s$ in GeV.` : `A ${bn} beam of total energy ${E} GeV strikes ${tn}s at rest (masses ${mb1} and ${mt} GeV/$c^2$). Find $\\sqrt s$ in GeV.`,
          answer, tol: Math.max(1e-4, answer * 0.003), unit: 'GeV', mb1, mt, E, collider,
          sol: collider ? `In a symmetric collider the lab is the CM frame, so $\\sqrt s = E_1 + E_2 = ${answer}$ GeV.` : `$s = m_1^2 + m_2^2 + 2E_1m_2 = ${round(mb1 * mb1 + mt * mt + 2 * E * mt, 6)}$ GeV², so $\\sqrt s = ${answer}$ GeV.` };
      },
      verify: (p) => (p.collider ? 2 * p.E : Math.sqrt(p.mb1 ** 2 + p.mt ** 2 + 2 * p.E * p.mt)) },
    { id: 'rk-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rapidity',
      make(r) {
        const b1 = pick(r, 0.1, 0.9, 0.1), b2 = pick(r, 0.1, 0.9, 0.1), ask = choose(r, ['y', 'beta']);
        const y = Math.atanh(b1) + Math.atanh(b2);
        const answer = round(ask === 'y' ? y : Math.tanh(y), 4);
        return { q: `Frame $S'$ moves at ${b1}$c$ relative to $S$, and a rocket moves at ${b2}$c$ relative to $S'$, all along $x$. ${ask === 'y' ? 'Find the rocket\'s rapidity in $S$.' : 'Using rapidities, find the rocket\'s speed in $S$ as a fraction of $c$.'}`,
          answer, tol: Math.max(0.001, answer * 0.002), b1, b2, ask,
          sol: `Rapidities add: $y = \\tanh^{-1}${b1} + \\tanh^{-1}${b2} = ${round(Math.atanh(b1), 4)} + ${round(Math.atanh(b2), 4)} = ${round(y, 4)}$.${ask === 'beta' ? ` Then $\\beta = \\tanh y = ${answer}$, the same as $(\\beta_1 + \\beta_2)/(1 + \\beta_1\\beta_2)$.` : ''}` };
      },
      verify: (p) => { const y = Math.atanh(p.b1) + Math.atanh(p.b2); return p.ask === 'y' ? y : Math.tanh(y); } },
    { id: 'rk-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Doppler effect',
      make(r) {
        const b = pick(r, 0.1, 0.9, 0.05), th = choose(r, [0, 30, 60, 90, 120, 180]), f0 = choose(r, [100, 500, 600, 1000]);
        const gm = 1 / Math.sqrt(1 - b * b), answer = round(f0 / (gm * (1 - b * Math.cos(th * DEG))), 2);
        return { q: `A source emits light of frequency ${f0} THz in its rest frame and moves at ${b}$c$. In the observer's frame the light reaching the observer travels at ${th}° to the source's velocity. Find the observed frequency in THz.`,
          answer, tol: Math.max(0.05, answer * 0.003), unit: 'THz', b, th, f0,
          sol: `From the four-wavevector, $f = \\dfrac{f_0}{\\gamma(1 - \\beta\\cos\\theta)}$ with $\\gamma = ${round(gm, 4)}$: $f = \\dfrac{${f0}}{${round(gm, 4)}(1 - ${b}\\cos ${th}^\\circ)} = ${answer}$ THz.${th === 90 ? ' (Transverse: a pure time-dilation redshift.)' : ''}` };
      },
      verify: (p) => p.f0 * Math.sqrt(1 - p.b * p.b) / (1 - p.b * Math.cos(p.th * DEG)) },
    { id: 'rk-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'aberration',
      make(r) {
        const b = pick(r, 0.1, 0.95, 0.05), thp = choose(r, [30, 60, 90, 120, 150]);
        const c = (Math.cos(thp * DEG) + b) / (1 + b * Math.cos(thp * DEG)), answer = round(Math.acos(c) / DEG, 2);
        return { q: `A source moving at ${b}$c$ emits a photon at ${thp}° to its direction of motion, measured in its own rest frame. Find the photon's angle (degrees) to the direction of motion in the lab.`,
          answer, tol: 0.1, unit: '°', b, thp,
          sol: `$\\cos\\theta = \\dfrac{\\cos\\theta' + \\beta}{1 + \\beta\\cos\\theta'} = ${round(c, 5)}$, so $\\theta = ${answer}^\\circ$: thrown forward (the headlight effect).` };
      },
      verify: (p) => Math.acos((Math.cos(p.thp * DEG) + p.b) / (1 + p.b * Math.cos(p.thp * DEG))) / DEG },
    { id: 'rk-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'decays',
      make(r) {
        const [name, m] = choose(r, [['$\\pi^0$', M.pi0], ['$\\eta$', M.eta]]);
        const E = choose(r, [300, 500, 800, 1000, 2000, 5000, 10000]);
        const answer = round(2 * Math.asin(Math.min(1, m / E)) / DEG, 3);
        return { q: `A ${name} (${m} MeV/$c^2$) with total energy ${E} MeV decays into two photons. Find the smallest possible opening angle (degrees) between them.`,
          answer, tol: Math.max(0.02, answer * 0.003), unit: '°', m, E,
          sol: `$m^2 = 4E_1E_2\\sin^2(\\theta/2)$; the angle is smallest for equal sharing, $E_1 = E_2 = E/2$: $\\sin(\\theta_{\\min}/2) = m/E = ${round(m / E, 5)}$, so $\\theta_{\\min} = ${answer}^\\circ$.` };
      },
      verify: (p) => 2 * Math.asin(Math.min(1, p.m / p.E)) / DEG },
    { id: 'rk-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Compton scattering',
      make(r) {
        const E = choose(r, [122, 356, 511, 662, 835, 1173, 1275, 1332, 2614]), th = choose(r, [60, 90, 120, 180]), ask = choose(r, ['photon', 'electron']);
        const Ep = E / (1 + (E / 511) * (1 - Math.cos(th * DEG)));
        const answer = round(ask === 'photon' ? Ep : E - Ep, 2);
        return { q: `A ${E} keV gamma ray scatters through ${th}° from a free electron at rest ($m_ec^2 = 511$ keV). Find the ${ask === 'photon' ? 'scattered photon energy' : 'kinetic energy given to the electron'} in keV.`,
          answer, tol: Math.max(0.2, answer * 0.003), unit: 'keV', E, th, ask,
          sol: `Four-momentum conservation gives $\\dfrac{1}{E'} - \\dfrac{1}{E} = \\dfrac{1 - \\cos\\theta}{m_ec^2}$, so $E' = \\dfrac{${E}}{1 + (${E}/511)(1 - \\cos ${th}^\\circ)} = ${round(Ep, 2)}$ keV.${ask === 'electron' ? ` The electron gets $${E} - ${round(Ep, 2)} = ${answer}$ keV.` : ''}` };
      },
      verify: (p) => { const Ep = p.E / (1 + (p.E / 511) * (1 - Math.cos(p.th * DEG))); return p.ask === 'photon' ? Ep : p.E - Ep; } },
    { id: 'rk-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rockets',
      make(r) {
        const ask = choose(r, ['ratio', 'beta']), u = choose(r, [1, 0.5, 0.2]);
        if (ask === 'ratio') {
          const b = pick(r, 0.1, 0.95, 0.05); const answer = round(Math.exp(Math.atanh(b) / u), 4);
          return { q: `A rocket with exhaust speed ${u === 1 ? '$c$ (a photon rocket)' : `${u}$c$`} accelerates from rest to ${b}$c$. Find the ratio of its initial to final rest mass.`,
            answer, tol: Math.max(0.002, answer * 0.003), ask, u, b, R: 0,
            sol: `Rapidity gained: $y = (u/c)\\ln(m_i/m_f)$, so $m_i/m_f = e^{y c/u} = \\exp(\\tanh^{-1}(${b})/${u}) = ${answer}$.` };
        }
        const R = choose(r, [2, 3, 5, 10, 20]); const answer = round(Math.tanh(u * Math.log(R)), 4);
        return { q: `A rocket with exhaust speed ${u === 1 ? '$c$ (a photon rocket)' : `${u}$c$`} burns from rest until its rest mass has fallen by a factor of ${R}. Find its final speed as a fraction of $c$.`,
          answer, tol: Math.max(0.001, answer * 0.002), ask, u, b: 0, R,
          sol: `$y = (u/c)\\ln(m_i/m_f) = ${u}\\ln ${R} = ${round(u * Math.log(R), 4)}$, so $\\beta = \\tanh y = ${answer}$ (Newton would say ${round(u * Math.log(R), 3)}$c$).` };
      },
      verify: (p) => (p.ask === 'ratio' ? Math.exp(Math.atanh(p.b) / p.u) : Math.tanh(p.u * Math.log(p.R))) },
    { id: 'rk-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'four-vectors',
      make(r) {
        const kind = choose(r, ['timelike', 'null', 'spacelike']);
        const vecs = { timelike: [[3, 1, 2, 0], [5, 3, 0, 0], [2, 1, 1, 1], [4, 2, 2, 2]], null: [[5, 3, 4, 0], [3, 1, 2, 2], [13, 5, 12, 0], [9, 4, 4, 7], [7, 2, 3, 6]], spacelike: [[1, 1, 1, 0], [2, 3, 0, 0], [3, 2, 2, 2], [1, 0, 0, 2]] };
        const v = choose(r, vecs[kind]);
        const n = v[0] ** 2 - v[1] ** 2 - v[2] ** 2 - v[3] ** 2;
        const labels = ['timelike (it can be the four-momentum of a massive particle)', 'null (it can be the four-momentum of a photon)', 'spacelike (no particle can have it as four-momentum)', 'none of these: four-vectors cannot be classified without choosing a frame'];
        const right = labels[['timelike', 'null', 'spacelike'].indexOf(kind)];
        const o = mcqOptions(r, right, labels.filter((x) => x !== right), (x) => x);
        return { q: `With signature $(+, -, -, -)$, the four-vector $(${v.join(', ')})$ is`, ...o,
          sol: `$A\\cdot A = ${v[0]}^2 - ${v[1]}^2 - ${v[2]}^2 - ${v[3]}^2 = ${n}$, which is ${n > 0 ? 'positive: timelike' : n === 0 ? 'zero: null' : 'negative: spacelike'}. The sign of $A\\cdot A$ is the same in every frame.` };
      } },
    ...more,
    ...r4.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["rk-r4g1"]);
