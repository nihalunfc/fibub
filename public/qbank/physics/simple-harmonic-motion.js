// Simple harmonic motion: equation of motion, energy, springs, pendulums (simple, physical, in accelerating
// frames), small oscillations about a minimum of potential, superposition of same-frequency SHMs, period-energy
// scaling and adiabatic invariants. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
// Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const TAU = 2 * Math.PI;

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
  topic: 'simple-harmonic-motion',
  items: [
    // ---------- level 1 ----------
    { id: 'shm-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'kinematics',
      q: 'A particle moves as $x = 4\\sin(3t + \\pi/6)$, with $x$ in cm and $t$ in s. Its maximum speed is',
      options: ['$4$ cm/s', '$12$ cm/s', '$36$ cm/s', '$4/3$ cm/s'], answer: 1,
      sol: 'Compare with $x = A\\sin(\\omega t + \\phi)$: $A = 4$ cm and $\\omega = 3$ rad/s. The velocity is $v = A\\omega\\cos(\\omega t + \\phi)$, whose largest value is $A\\omega = 4\\times3 = 12$ cm/s. The phase $\\pi/6$ only shifts when the maximum happens, not its size.',
      trap: '$36$ cm/s is $A\\omega^2$, the maximum acceleration (in cm/s$^2$), not the speed.' },
    { id: 'shm-002', type: 'nat', level: 1, exams: ['jam'], sub: 'spring-mass', unit: 's',
      q: 'A block of mass $0.5$ kg on a smooth horizontal table is attached to a spring of force constant $200$ N/m. The period of its oscillation is ______ s (to three decimal places).',
      answer: 0.314, tol: 0.003, calc: () => TAU * Math.sqrt(0.5 / 200),
      sol: '$T = 2\\pi\\sqrt{m/k} = 2\\pi\\sqrt{0.5/200} = 2\\pi\\sqrt{0.0025} = 2\\pi\\times0.05 = 0.314$ s.',
      trap: 'Using $\\sqrt{k/m}$ gives the angular frequency (20 rad/s), not the period.' },
    { id: 'shm-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'kinematics',
      q: 'For a particle in simple harmonic motion, the magnitude of the acceleration is largest',
      options: ['halfway between the mean and an extreme', 'the same everywhere', 'at the mean position', 'at the extreme positions'], answer: 3,
      sol: 'In SHM $a = -\\omega^2 x$, so $|a|$ grows with the distance from the mean position and is largest at $x = \\pm A$, where the particle momentarily stops. At the mean position $a = 0$ and the speed is largest.',
      trap: 'Mixing up speed (largest at the mean position) with acceleration (largest at the extremes).' },
    { id: 'shm-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'phase',
      q: 'In simple harmonic motion, the phase difference between the displacement and the acceleration is',
      options: ['$\\pi$', '$3\\pi/2$', '$0$', '$\\pi/2$'], answer: 0,
      sol: '$a = -\\omega^2 x$: the acceleration is always the displacement times a negative number, so it points opposite to the displacement. Opposite means a phase difference of $\\pi$.',
      trap: '$\\pi/2$ is the phase difference between displacement and velocity.' },
    { id: 'shm-005', type: 'nat', level: 1, exams: ['jam'], sub: 'kinematics', unit: 'cm/s',
      q: 'A particle oscillates with amplitude $5$ cm and angular frequency $4$ rad/s. Its speed when it is $3$ cm from the mean position is ______ cm/s.',
      answer: 16, tol: 0, calc: () => 4 * Math.sqrt(25 - 9),
      sol: '$v = \\omega\\sqrt{A^2 - x^2} = 4\\sqrt{25 - 9} = 4\\times4 = 16$ cm/s.' },
    { id: 'shm-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'energy',
      q: 'The amplitude of a spring-mass oscillator is doubled without changing the spring or the mass. Its total mechanical energy becomes',
      options: ['the same', 'twice as large', 'four times as large', 'half as large'], answer: 2,
      sol: '$E = \\tfrac12 kA^2$. Doubling $A$ multiplies $E$ by $2^2 = 4$. The period does not change, because it depends only on $m$ and $k$.' },

    // ---------- level 2 ----------
    { id: 'shm-007', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'identifying SHM', format: 'multi',
      q: 'Which of the following displacements describe simple harmonic motion (about some fixed point)? Here $A$, $B$ and $\\omega$ are positive constants.',
      options: ['$x = A\\sin\\omega t + B\\cos\\omega t$', '$x = A\\sin^2\\omega t$', '$x = A\\sin\\omega t + A\\sin 2\\omega t$', '$x = Ae^{-\\omega t}$'], answer: [0, 1],
      sol: 'A: a sum of sine and cosine of the same frequency is one sinusoid, $\\sqrt{A^2+B^2}\\sin(\\omega t + \\phi)$: SHM. B: $\\sin^2\\omega t = \\tfrac12(1 - \\cos2\\omega t)$, so $x = A/2 - (A/2)\\cos2\\omega t$: SHM of amplitude $A/2$ and angular frequency $2\\omega$ about $x = A/2$. C: two different frequencies, so $\\ddot x$ is not proportional to $-(x - x_0)$: periodic but not simple harmonic. D: not even periodic.',
      trap: 'B looks non-sinusoidal, but a double-angle identity turns it into a shifted SHM. C is periodic, but periodic is not the same as simple harmonic.' },
    { id: 'shm-008', type: 'nat', level: 2, exams: ['jam'], sub: 'energy',
      q: 'For a particle in SHM of amplitude $A$, the kinetic energy equals the potential energy when the displacement is $x = kA$. The positive value of $k$ is ______ (to two decimal places).',
      answer: 0.71, tol: 0.01, calc: () => Math.SQRT1_2,
      sol: 'Potential energy $\\tfrac12 m\\omega^2x^2$, kinetic energy $\\tfrac12 m\\omega^2(A^2 - x^2)$. Setting them equal: $x^2 = A^2 - x^2$, so $x = A/\\sqrt2 \\approx 0.71A$.',
      trap: 'Answering $0.5$: at $x = A/2$ the potential energy is only a quarter of the total.' },
    { id: 'shm-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'spring-mass',
      q: 'Two springs of force constants $k_1$ and $k_2$ are joined end to end (in series) and a mass $m$ hangs from the combination. The angular frequency of vertical oscillation is',
      options: ['$\\sqrt{(k_1+k_2)/m}$', '$\\sqrt{\\dfrac{k_1k_2}{(k_1+k_2)m}}$', '$\\sqrt{\\dfrac{k_1+k_2}{k_1k_2m}}$', '$\\sqrt{\\dfrac{2k_1k_2}{(k_1+k_2)m}}$'], answer: 1,
      sol: 'In series the same tension $F$ acts in both springs, so the extensions add: $F/k = F/k_1 + F/k_2$, giving $k = k_1k_2/(k_1+k_2)$. Then $\\omega = \\sqrt{k/m}$. Gravity only shifts the equilibrium point; it does not change $\\omega$.',
      trap: 'Adding the constants is right for springs side by side (parallel), not end to end.' },
    { id: 'shm-010', type: 'nat', level: 2, exams: ['jam'], sub: 'pendulum', unit: 's',
      q: 'A simple pendulum of length $1.0$ m is taken to a planet where $g = 4.9$ m/s$^2$. Its period for small swings there is ______ s (to two decimal places).',
      answer: 2.84, tol: 0.02, calc: () => TAU * Math.sqrt(1 / 4.9),
      sol: '$T = 2\\pi\\sqrt{L/g} = 2\\pi\\sqrt{1/4.9} = 2\\pi\\times0.4518 = 2.84$ s. That is $\\sqrt2$ times the Earth value of about $2.01$ s, as expected for half the gravity.' },
    { id: 'shm-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'kinematics',
      q: 'A particle in SHM with period $T$ starts at the mean position. The shortest time it takes to reach half the amplitude is',
      options: ['$T/6$', '$T/4$', '$T/8$', '$T/12$'], answer: 3,
      sol: '$x = A\\sin(2\\pi t/T)$. Setting $x = A/2$: $\\sin(2\\pi t/T) = 1/2$, so $2\\pi t/T = \\pi/6$ and $t = T/12$. The particle is fastest near the mean position, so it covers the first half of the amplitude in only a third of the quarter-period.',
      trap: '$T/8$ assumes constant speed over the quarter-period.' },
    { id: 'shm-012', type: 'nat', level: 2, exams: ['jam'], sub: 'kinematics', unit: 's',
      q: 'A particle performs SHM with period $2$ s and amplitude $10$ cm, starting from rest at $x = +10$ cm. The time it takes to first reach $x = +5$ cm is ______ s (to two decimal places).',
      answer: 0.33, tol: 0.01, calc: () => 2 / 6,
      sol: 'Starting from the extreme, $x = A\\cos(2\\pi t/T)$. $x = A/2$ when $\\cos(\\pi t) = 1/2$, so $\\pi t = \\pi/3$ and $t = 1/3 \\approx 0.33$ s, which is $T/6$.',
      trap: 'Near the extreme the particle is slow, so this takes longer ($T/6$) than the $T/12$ needed from the mean position to $A/2$.' },
    { id: 'shm-013', type: 'mcq', level: 3, exams: ['jam'], sub: 'small oscillations',
      q: 'A particle of mass $1.5$ kg moves along $x$ in the potential energy $U(x) = 3x^2 + 2$ (in joules, with $x$ in metres). Its angular frequency of oscillation is',
      options: ['$2$ rad/s', '$\\sqrt2$ rad/s', '$4$ rad/s', '$2\\sqrt2$ rad/s'], answer: 0,
      sol: 'Compare with $U = \\tfrac12kx^2 + $ constant: $\\tfrac12 k = 3$, so $k = 6$ N/m (or use $k = U\'\'(0) = 6$). Then $\\omega = \\sqrt{k/m} = \\sqrt{6/1.5} = 2$ rad/s. The constant 2 J has no effect.',
      trap: 'Reading $k = 3$ from the coefficient of $x^2$ forgets the factor $\\tfrac12$ and gives $\\sqrt2$ rad/s.' },
    { id: 'shm-014', type: 'msq', level: 2, exams: ['jam'], sub: 'phase', format: 'statements',
      q: 'For a particle executing SHM $x = A\\sin\\omega t$, which statements are correct?',
      options: ['The velocity leads the displacement by $\\pi/2$.', 'The kinetic energy averaged over a period equals the potential energy averaged over a period.', 'The period increases with the amplitude.', 'The acceleration is in phase with the velocity.'], answer: [0, 1],
      sol: 'A: $v = A\\omega\\cos\\omega t = A\\omega\\sin(\\omega t + \\pi/2)$, ahead by $\\pi/2$. B: both averages equal $\\tfrac14 m\\omega^2A^2$, half the total energy each. C: false for ideal SHM: the period $2\\pi/\\omega$ does not depend on amplitude (isochronism). D: $a = -A\\omega^2\\sin\\omega t$ is $\\pi/2$ ahead of the velocity, not in phase.' },
    { id: 'shm-015', type: 'nat', level: 2, exams: ['jam'], sub: 'energy', unit: 'J',
      q: 'A $2$ kg mass oscillates with amplitude $0.1$ m and angular frequency $5$ rad/s. Its kinetic energy averaged over one full period is ______ J (to three decimal places).',
      answer: 0.125, tol: 0.002, calc: () => 0.25 * 2 * 25 * 0.01,
      sol: 'Total energy $E = \\tfrac12 m\\omega^2A^2 = \\tfrac12\\times2\\times25\\times0.01 = 0.25$ J. Since $\\langle\\cos^2\\rangle = \\tfrac12$, the average kinetic energy is $E/2 = 0.125$ J.',
      trap: '$0.25$ J is the maximum kinetic energy, not the average.' },
    { id: 'shm-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'spring-mass',
      q: 'A mass on a spring has period $T$. The spring is cut into two equal halves and the same mass is attached to one half. The new period is',
      options: ['$T$', '$T/2$', '$T/\\sqrt2$', '$\\sqrt2\\,T$'], answer: 2,
      sol: 'For a uniform spring $k \\propto 1/(\\text{length})$: each half stretches half as much under the same force, so $k_{\\text{half}} = 2k$. $T \\propto 1/\\sqrt k$, so $T\' = T/\\sqrt2$.',
      trap: 'Thinking $k$ halves along with the length gives $\\sqrt2\\,T$.' },

    // ---------- level 3 ----------
    { id: 'shm-017', type: 'nat', level: 3, exams: ['jam'], sub: 'spring-mass', unit: 's',
      q: 'A block hung from a light vertical spring stretches it by $2.5$ cm at equilibrium. Take $g = 9.8$ m/s$^2$. If pulled down a little and released, it oscillates with period ______ s (to three decimal places).',
      answer: 0.317, tol: 0.003, calc: () => TAU * Math.sqrt(0.025 / 9.8),
      sol: 'At equilibrium $k\\delta = mg$, so $m/k = \\delta/g$. Then $T = 2\\pi\\sqrt{\\delta/g} = 2\\pi\\sqrt{0.025/9.8} = 2\\pi\\times0.0505 = 0.317$ s. The mass is not needed.',
      trap: 'Forgetting to convert $2.5$ cm to $0.025$ m changes the answer by a factor of 10.' },
    { id: 'shm-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'other oscillators',
      q: 'A liquid column of total length $L$ (measured along the tube) in a U-tube of uniform cross-section is displaced and released. Ignoring viscosity, the period of oscillation is',
      options: ['$2\\pi\\sqrt{L/g}$', '$2\\pi\\sqrt{L/(2g)}$', '$2\\pi\\sqrt{2L/g}$', '$\\pi\\sqrt{L/g}$'], answer: 1,
      sol: 'If one surface rises by $x$, the other falls by $x$: a height difference of $2x$. The unbalanced weight is $\\rho A(2x)g$ and it accelerates the whole mass $\\rho AL$: $\\rho AL\\ddot x = -2\\rho Agx$, so $\\omega^2 = 2g/L$ and $T = 2\\pi\\sqrt{L/(2g)}$.',
      trap: 'Using a height difference of $x$ instead of $2x$ gives the simple pendulum formula.' },
    { id: 'shm-019', type: 'nat', level: 3, exams: ['jam'], sub: 'pendulum',
      q: 'A simple pendulum has period $T_0$ in a lift at rest. When the lift accelerates upward at $g/3$, the period becomes $T$. The ratio $T/T_0$ is ______ (to three decimal places).',
      answer: 0.866, tol: 0.003, calc: () => Math.sqrt(3 / 4),
      sol: 'In the lift frame the effective gravity is $g + a = 4g/3$. $T \\propto 1/\\sqrt{g_{\\text{eff}}}$, so $T/T_0 = \\sqrt{g/(4g/3)} = \\sqrt{3/4} = 0.866$.',
      trap: 'Upward acceleration makes gravity feel stronger, so the period gets shorter, not longer.' },
    { id: 'shm-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'physical pendulum',
      q: 'A uniform rod of length $L$ swings in a vertical plane about a horizontal axis through one end. Its period for small oscillations is',
      options: ['$2\\pi\\sqrt{L/(2g)}$', '$2\\pi\\sqrt{L/(3g)}$', '$2\\pi\\sqrt{L/g}$', '$2\\pi\\sqrt{2L/(3g)}$'], answer: 3,
      sol: 'Physical pendulum: $T = 2\\pi\\sqrt{I/(mgd)}$ with $I = mL^2/3$ about the end and $d = L/2$ from the pivot to the centre of mass. $I/(md) = (L^2/3)/(L/2) = 2L/3$, so $T = 2\\pi\\sqrt{2L/(3g)}$: the same as a simple pendulum of length $2L/3$.',
      trap: 'Treating the rod as a point mass at its end, or at its centre, gives the wrong "equivalent length".' },
    { id: 'shm-021', type: 'nat', level: 3, exams: ['jam'], sub: 'physical pendulum', unit: 's',
      q: 'A uniform metre-stick-like rod of length $1.2$ m is pivoted at one end and swings with small amplitude. With $g = 9.8$ m/s$^2$ its period is ______ s (to two decimal places).',
      answer: 1.80, tol: 0.02, calc: () => TAU * Math.sqrt((2 * 1.2 / 3) / 9.8),
      sol: 'Equivalent length $2L/3 = 0.8$ m, so $T = 2\\pi\\sqrt{0.8/9.8} = 2\\pi\\times0.2857 = 1.80$ s.' },
    { id: 'shm-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'small oscillations',
      q: 'A particle of mass $m$ moves in the potential $U(x) = U_0\\left[(x/a)^4 - 2(x/a)^2\\right]$ with $U_0, a > 0$. The angular frequency of small oscillations about either stable equilibrium is',
      options: ['$\\sqrt{\\dfrac{8U_0}{ma^2}}$', '$\\sqrt{\\dfrac{4U_0}{ma^2}}$', '$\\sqrt{\\dfrac{2U_0}{ma^2}}$', 'it does not oscillate: both equilibria are unstable'], answer: 0,
      sol: '$U\'(x) = U_0(4x^3/a^4 - 4x/a^2) = 0$ at $x = 0$ and $x = \\pm a$. $U\'\'(x) = U_0(12x^2/a^4 - 4/a^2)$: at $x = 0$ it is $-4U_0/a^2 < 0$ (a maximum, unstable); at $x = \\pm a$ it is $8U_0/a^2 > 0$ (stable). So $\\omega = \\sqrt{U\'\'(a)/m} = \\sqrt{8U_0/(ma^2)}$.',
      trap: '$\\sqrt{4U_0/(ma^2)}$ is $|U\'\'(0)|$: it uses the hilltop at $x = 0$, which is not an equilibrium you can oscillate about.' },
    { id: 'shm-023', type: 'nat', level: 3, exams: ['jam'], sub: 'superposition', unit: 'cm',
      q: 'A particle is subjected to two SHMs along the same line, $x_1 = 3\\sin\\omega t$ and $x_2 = 4\\sin(\\omega t + \\pi/3)$ (in cm). The amplitude of the resulting motion is ______ cm (to two decimal places).',
      answer: 6.08, tol: 0.01, calc: () => Math.sqrt(9 + 16 + 2 * 12 * Math.cos(Math.PI / 3)),
      sol: 'Add as phasors: $A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi = 9 + 16 + 24\\times\\tfrac12 = 37$, so $A = \\sqrt{37} = 6.08$ cm.',
      trap: 'Adding $3 + 4 = 7$ works only when the phases are equal; $\\sqrt{9 + 16} = 5$ only when they differ by $\\pi/2$.' },
    { id: 'shm-024', type: 'nat', level: 3, exams: ['jam'], sub: 'contact and SHM', unit: 'Hz',
      q: 'A small coin rests on a horizontal platform that oscillates vertically in SHM with amplitude $2.5$ cm. Take $g = 9.8$ m/s$^2$. The largest frequency for which the coin never leaves the platform is ______ Hz (to two decimal places).',
      answer: 3.15, tol: 0.02, calc: () => Math.sqrt(9.8 / 0.025) / TAU,
      sol: 'The coin loses contact when the platform accelerates downward faster than $g$, which first happens at the top of the motion where the downward acceleration is $\\omega^2A$. Contact is kept if $\\omega^2A \\le g$: $\\omega_{\\max} = \\sqrt{9.8/0.025} = \\sqrt{392} = 19.80$ rad/s, so $f_{\\max} = 19.80/(2\\pi) = 3.15$ Hz.',
      trap: 'Giving $19.8$ (the angular frequency) when the question asks for hertz.' },
    { id: 'shm-025', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'other oscillators',
      q: 'A bead of mass $m$ is fixed at the midpoint of a light string stretched with tension $T$ between two walls a distance $2l$ apart. For small transverse displacements (tension unchanged, gravity ignored), the angular frequency is',
      options: ['$\\sqrt{4T/(ml)}$', '$\\sqrt{T/(ml)}$', '$\\sqrt{2T/(ml)}$', '$\\sqrt{T/(2ml)}$'], answer: 2,
      sol: 'Displace the bead sideways by $y \\ll l$. Each half of the string makes an angle $\\approx y/l$ with the line between the walls, so each pulls back with $T(y/l)$. Total restoring force $2Ty/l$, so $m\\ddot y = -(2T/l)y$ and $\\omega = \\sqrt{2T/(ml)}$.',
      trap: 'Counting only one half of the string misses a factor of 2.' },
    { id: 'shm-026', type: 'msq', level: 3, exams: ['jam'], sub: 'pendulum', format: 'multi',
      q: 'Which of these have the same small-oscillation period as a simple pendulum of length $l$ at the same place?',
      options: ['A mass on a vertical spring whose static extension is $l$', 'A solid ball rolling without slipping inside a bowl, with its centre moving on a circle of radius $l$', 'A small bead sliding without friction inside a smooth bowl of radius $l$', 'A pendulum of length $l$ in a freely falling lift'], answer: [0, 2],
      sol: 'A: $kl = mg$ gives $T = 2\\pi\\sqrt{m/k} = 2\\pi\\sqrt{l/g}$. B: rolling adds rotational kinetic energy: $T = 2\\pi\\sqrt{7l/(5g)}$, longer. C: the bowl supplies the same constraint as a string of length $l$: same period. D: in free fall $g_{\\text{eff}} = 0$ and the pendulum does not oscillate at all.',
      trap: 'B looks like C, but a rolling ball stores part of its energy as rotation, which slows it down.' },
    { id: 'shm-027', type: 'nat', level: 3, exams: ['jam'], sub: 'energy', unit: 'Hz',
      q: 'A $0.2$ kg mass in SHM has amplitude $0.05$ m and total energy $0.1$ J. Its frequency is ______ Hz (to two decimal places).',
      answer: 3.18, tol: 0.02, calc: () => Math.sqrt(2 * 0.1 / (0.2 * 0.05 ** 2)) / TAU,
      sol: '$E = \\tfrac12 m\\omega^2A^2$ gives $\\omega^2 = 2E/(mA^2) = 0.2/(0.2\\times0.0025) = 400$, so $\\omega = 20$ rad/s and $f = 20/(2\\pi) = 3.18$ Hz.' },
    { id: 'shm-028', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'phase space',
      q: 'A particle moves as $x = 3\\cos 2t$ (SI units). Its path in the phase plane ($v$ plotted against $x$) is',
      options: ['a circle of radius 3', 'an ellipse with semi-axes 3 m (along $x$) and 6 m/s (along $v$)', 'an ellipse with semi-axes 3 m (along $x$) and 12 m/s (along $v$)', 'a straight line through the origin'], answer: 1,
      sol: '$v = -6\\sin2t$, so $(x/3)^2 + (v/6)^2 = \\cos^2 2t + \\sin^2 2t = 1$: an ellipse with semi-axes $A = 3$ m and $A\\omega = 6$ m/s. It is a circle only if you scale $v$ by $1/\\omega$.',
      trap: '$12$ m/s$^2$ is the maximum acceleration $A\\omega^2$; the phase plane uses velocity.' },
    { id: 'shm-029', type: 'msq', level: 3, exams: ['jam'], sub: 'kinematics', format: 'statements',
      q: 'A particle moves as $x = 2\\cos(\\pi t) + 2\\sqrt3\\sin(\\pi t)$, with $x$ in m and $t$ in s. Which statements are correct?',
      options: ['The amplitude is $4$ m.', 'The period is $2$ s.', 'At $t = 0$ the velocity is $2\\sqrt3\\,\\pi$ m/s.', 'At $t = 0$ the particle is moving towards the mean position.'], answer: [0, 1, 2],
      sol: 'A: $\\sqrt{2^2 + (2\\sqrt3)^2} = \\sqrt{16} = 4$ m. B: $\\omega = \\pi$, so $T = 2\\pi/\\omega = 2$ s. C: $v = -2\\pi\\sin\\pi t + 2\\sqrt3\\,\\pi\\cos\\pi t$, which is $2\\sqrt3\\,\\pi$ at $t = 0$. D: at $t = 0$, $x = 2 > 0$ and $v > 0$, so it moves away from the mean position (towards the extreme at $x = 4$).',
      trap: 'D: a positive displacement with a positive velocity means moving outward, not back.' },
    { id: 'shm-030', type: 'nat', level: 3, exams: ['jam'], sub: 'kinematics', unit: 'cm',
      q: 'A particle in SHM has speed $8$ cm/s when it is $3$ cm from the mean position and $6$ cm/s when it is $4$ cm from it. Its amplitude is ______ cm.',
      answer: 5, tol: 0, calc: () => Math.sqrt(16 + 36 / ((64 - 36) / 7)),
      sol: '$v^2 = \\omega^2(A^2 - x^2)$: $64 = \\omega^2(A^2 - 9)$ and $36 = \\omega^2(A^2 - 16)$. Subtracting: $28 = 7\\omega^2$, so $\\omega = 2$ rad/s. Then $A^2 = 16 + 36/4 = 25$ and $A = 5$ cm.' },

    // ---------- level 4 ----------
    { id: 'shm-031', type: 'nat', level: 4, exams: ['jam'], sub: 'gravity', unit: 'min',
      q: 'A straight frictionless tunnel is dug along a chord of the Earth (not through the centre). Treat the Earth as a uniform sphere of radius $6.4\\times10^6$ m with $g = 9.8$ m/s$^2$ at the surface. A ball dropped into the tunnel oscillates with period ______ minutes (to one decimal place).',
      answer: 84.6, tol: 0.3, calc: () => TAU * Math.sqrt(6.4e6 / 9.8) / 60,
      sol: 'Inside a uniform sphere the gravitational force is $F = -(mg/R)\\vec r$. Along the chord only the component along the tunnel acts: at distance $s$ from the chord\'s midpoint it is $-(mg/R)s$. So $\\omega^2 = g/R$ for every chord, and $T = 2\\pi\\sqrt{R/g} = 2\\pi\\sqrt{6.531\\times10^5} = 2\\pi\\times808.1 = 5078$ s $= 84.6$ min.',
      trap: 'Expecting a shorter chord to give a shorter period: the period is the same for every chord.' },
    { id: 'shm-032', type: 'mcq', level: 4, exams: ['jam'], sub: 'other oscillators',
      q: 'A cylinder of height $H$ and density $\\rho$ floats upright in a liquid of density $\\sigma$ ($\\sigma > \\rho$). Pushed down slightly and released (ignore the liquid\'s own motion and viscosity), it bobs with period',
      options: ['$2\\pi\\sqrt{\\dfrac{\\sigma H}{\\rho g}}$', '$2\\pi\\sqrt{\\dfrac{(\\sigma - \\rho)H}{\\sigma g}}$', '$2\\pi\\sqrt{H/g}$', '$2\\pi\\sqrt{\\dfrac{\\rho H}{\\sigma g}}$'], answer: 3,
      sol: 'Pushing it down by $y$ adds a buoyant force $\\sigma Ayg$, so $k = \\sigma Ag$. The mass is $\\rho AH$. $T = 2\\pi\\sqrt{\\rho AH/(\\sigma Ag)} = 2\\pi\\sqrt{\\rho H/(\\sigma g)}$. Note $\\rho H/\\sigma$ is just the submerged depth $h$, so $T = 2\\pi\\sqrt{h/g}$.',
      trap: 'Using the whole height $H$ as the "length" ignores that only the submerged depth sets the stiffness.' },
    { id: 'shm-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'two-body', unit: 'rad/s',
      q: 'Masses of $1$ kg and $3$ kg on a smooth table are joined by a light spring of force constant $300$ N/m. The spring is stretched and both masses are released from rest. The angular frequency of oscillation is ______ rad/s.',
      answer: 20, tol: 0, calc: () => Math.sqrt(300 / (1 * 3 / 4)),
      sol: 'The centre of mass stays still and the separation obeys $\\mu\\ddot r = -k(r - r_0)$ with reduced mass $\\mu = m_1m_2/(m_1+m_2) = 3/4$ kg. So $\\omega = \\sqrt{k/\\mu} = \\sqrt{400} = 20$ rad/s.',
      trap: 'Using the total mass ($4$ kg) or either mass alone instead of the reduced mass.' },
    { id: 'shm-034', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'large amplitude', format: 'statements',
      q: 'A simple pendulum is released from rest at angle $\\theta_0$, which is not small. Which statements are correct?',
      options: ['The period is longer than $2\\pi\\sqrt{l/g}$ and grows with $\\theta_0$.', 'For $\\theta_0 = 90^\\circ$ the period is about 18% longer than the small-angle value.', 'The motion is still periodic.', 'The restoring torque is still proportional to $\\theta$.'], answer: [0, 1, 2],
      sol: 'The restoring torque is $-mgl\\sin\\theta$, which is weaker than $-mgl\\theta$ at large angles (so D is false), and a weaker pull means a longer swing (A). The exact period is $T = (4/\\omega_0)K(\\sin(\\theta_0/2))$ with $K$ the complete elliptic integral; for $90^\\circ$, $T/T_0 \\approx 1.180$ (B). The motion is periodic, just not sinusoidal (C).',
      trap: 'Periodic does not mean simple harmonic: here the period depends on amplitude.' },
    { id: 'shm-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'physical pendulum',
      q: 'A solid cylinder of radius $r$ rolls without slipping on the inside of a fixed cylindrical trough of radius $R$. The period of small oscillations about the bottom is',
      options: ['$2\\pi\\sqrt{\\dfrac{3(R-r)}{2g}}$', '$2\\pi\\sqrt{\\dfrac{7(R-r)}{5g}}$', '$2\\pi\\sqrt{\\dfrac{2(R-r)}{3g}}$', '$2\\pi\\sqrt{(R-r)/g}$'], answer: 0,
      sol: 'The centre moves on a circle of radius $R - r$ with speed $v = (R - r)\\dot\\theta$. Rolling: kinetic energy $\\tfrac12mv^2(1 + I/(mr^2)) = \\tfrac12mv^2\\cdot\\tfrac32$ for a solid cylinder. Potential energy $\\tfrac12mg(R-r)\\theta^2$. So $\\omega^2 = g/[\\tfrac32(R-r)]$ and $T = 2\\pi\\sqrt{3(R-r)/(2g)}$.',
      trap: 'The factor $7/5$ is for a solid sphere; a solid cylinder has $I/(mr^2) = 1/2$, giving $3/2$.' },
    { id: 'shm-036', type: 'nat', level: 4, exams: ['jam'], sub: 'spring-mass', unit: 's',
      q: 'A block of mass $0.4$ kg is attached to a uniform spring of mass $0.3$ kg and force constant $50$ N/m. Allowing for the spring\'s mass, the period is ______ s (to three decimal places).',
      answer: 0.628, tol: 0.004, calc: () => TAU * Math.sqrt((0.4 + 0.3 / 3) / 50),
      sol: 'A uniform spring\'s kinetic energy (velocity growing linearly along it) adds $m_s/3$ to the moving mass: $T = 2\\pi\\sqrt{(M + m_s/3)/k} = 2\\pi\\sqrt{0.5/50} = 2\\pi\\times0.1 = 0.628$ s.',
      trap: 'Adding the whole spring mass ($0.7$ kg) or half of it overestimates the effective mass.' },
    { id: 'shm-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'period and energy',
      q: 'A particle of mass $m$ moves in the potential $V(x) = k|x|$ ($k > 0$). How does its period $T$ depend on its energy $E$?',
      options: ['$T$ is independent of $E$', '$T \\propto E$', '$T \\propto E^{1/2}$', '$T \\propto E^{-1/2}$'], answer: 2,
      sol: 'For $x > 0$ the force is a constant $-k$. The particle goes from $0$ to the turning point $x_{\\max} = E/k$ under constant deceleration $k/m$, taking $t = \\sqrt{2mx_{\\max}/k} = \\sqrt{2mE}/k$. A full cycle is four such legs: $T = 4\\sqrt{2mE}/k \\propto E^{1/2}$. In general $V \\propto |x|^n$ gives $T \\propto E^{1/n - 1/2}$; only $n = 2$ is isochronous.',
      trap: 'Assuming every oscillation has an energy-independent period, which is true only for the harmonic potential.' },
    { id: 'shm-038', type: 'nat', level: 4, exams: ['jam'], sub: 'pendulum', unit: 's',
      q: 'A pendulum clock with a brass rod ($\\alpha = 2\\times10^{-5}$ K$^{-1}$) keeps correct time at $20^\\circ$C. At $30^\\circ$C it loses ______ seconds per day (to one decimal place).',
      answer: 8.6, tol: 0.1, calc: () => 86400 * 0.5 * 2e-5 * 10,
      sol: '$T \\propto \\sqrt l$, so $\\Delta T/T = \\tfrac12\\Delta l/l = \\tfrac12\\alpha\\Delta\\theta = \\tfrac12\\times2\\times10^{-5}\\times10 = 10^{-4}$. A slower pendulum counts fewer ticks: it loses $86400\\times10^{-4} = 8.64$ s per day.',
      trap: 'Forgetting the square root (the factor $\\tfrac12$) doubles the answer.' },
    { id: 'shm-039', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'time averages', format: 'multi',
      q: 'For $x = A\\cos\\omega t$, which of the following are correct? (Averages are over one full period.)',
      options: ['$\\langle x^2\\rangle = A^2/2$', 'The average speed is $2A\\omega/\\pi$', 'A photograph taken at a random moment is most likely to show the particle near $x = 0$', '$\\langle x\\rangle = 0$'], answer: [0, 1, 3],
      sol: 'A: $\\langle\\cos^2\\rangle = 1/2$. B: the particle covers $4A$ in time $T = 2\\pi/\\omega$, so the average speed is $4A\\omega/(2\\pi) = 2A\\omega/\\pi$. C: false: the probability density is $1/(\\pi\\sqrt{A^2 - x^2})$, largest near the turning points, where the particle is slow. D: the motion is symmetric about 0.',
      trap: 'C feels natural, but a slow particle spends more time where it is slow: near the extremes.' },

    // ---------- level 5 ----------
    { id: 'shm-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'small oscillations', unit: 'rad/s',
      q: 'A bead slides without friction on a vertical circular hoop of radius $0.1$ m that spins about its vertical diameter at $\\Omega = 14$ rad/s. Take $g = 9.8$ m/s$^2$. The angular frequency of small oscillations of the bead about its stable off-axis equilibrium is ______ rad/s (to one decimal place).',
      answer: 12.1, tol: 0.1, calc: () => 14 * Math.sin(Math.acos(9.8 / (0.1 * 196))),
      sol: 'With $\\theta$ measured from the bottom, the effective potential in the rotating frame is $U = -mgR\\cos\\theta - \\tfrac12mR^2\\Omega^2\\sin^2\\theta$. $U\' = 0$ off the axis at $\\cos\\theta_0 = g/(R\\Omega^2) = 9.8/19.6 = 0.5$, so $\\theta_0 = 60^\\circ$ (this exists because $\\Omega^2 > g/R = 98$). $U\'\'(\\theta_0) = mR^2\\Omega^2\\sin^2\\theta_0$, and the kinetic energy is $\\tfrac12mR^2\\dot\\theta^2$, so $\\omega = \\Omega\\sin\\theta_0 = 14\\times0.866 = 12.1$ rad/s.',
      trap: 'Using $\\sqrt{g/R} = 9.9$ rad/s: that is the frequency about the bottom of a hoop that is not spinning.' },
    { id: 'shm-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'adiabatic invariance',
      q: 'A simple pendulum swings with small angular amplitude $\\theta_1$. Its string is drawn up through a hole very slowly (over many periods) until the length is a quarter of the original. The new angular amplitude is $\\theta_2$. The ratio $\\theta_2/\\theta_1$ is ______ (to two decimal places).',
      answer: 2.83, tol: 0.02, calc: () => 4 ** 0.75,
      sol: 'For a slow change, the action $E/\\omega$ is an adiabatic invariant. $E = \\tfrac12mgl\\theta^2$ and $\\omega = \\sqrt{g/l}$, so $E/\\omega \\propto l\\theta^2\\sqrt l = l^{3/2}\\theta^2$ is constant. Hence $\\theta \\propto l^{-3/4}$ and $\\theta_2/\\theta_1 = 4^{3/4} = 2\\sqrt2 = 2.83$.',
      trap: 'Keeping the energy constant is wrong: pulling the string up does work on the pendulum.' },
    { id: 'shm-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'period and energy',
      q: 'A particle oscillates in the potential $V(x) = \\lambda x^4$. If its energy is increased 16-fold, its period',
      options: ['becomes 4 times longer', 'halves', 'doubles', 'stays the same'], answer: 1,
      sol: 'Scaling: the turning point is $x_0 = (E/\\lambda)^{1/4}$ and a typical speed is $\\sqrt{E/m}$, so $T \\sim x_0/\\sqrt{E/m} \\propto E^{1/4 - 1/2} = E^{-1/4}$. Multiplying $E$ by 16 multiplies $T$ by $16^{-1/4} = 1/2$.',
      trap: 'A stiffer-than-harmonic potential gives faster oscillations at higher energy, unlike $V = k|x|$.' },
    { id: 'shm-043', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'physical pendulum', unit: 's',
      q: 'A uniform disc of radius $0.2$ m can be hung from any point along a radius and swung in its own plane about a horizontal axis through that point. Take $g = 9.8$ m/s$^2$. The smallest possible period is ______ s (to two decimal places).',
      answer: 1.07, tol: 0.01, calc: () => TAU * Math.sqrt(Math.SQRT2 * 0.2 / 9.8),
      sol: 'With the pivot at distance $d$ from the centre, $I = m(R^2/2 + d^2)$ and $T = 2\\pi\\sqrt{(R^2/2 + d^2)/(gd)}$. Minimise $f(d) = R^2/(2d) + d$: $f\'(d) = 0$ at $d = R/\\sqrt2$, where $f = \\sqrt2\\,R$. So $T_{\\min} = 2\\pi\\sqrt{\\sqrt2R/g} = 2\\pi\\sqrt{0.02886} = 1.07$ s.',
      trap: 'Hanging from the rim ($d = R$) is not the minimum: it gives $2\\pi\\sqrt{1.5R/g} = 1.10$ s.' },
    { id: 'shm-044', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'phase space', format: 'statements',
      q: 'For a one-dimensional harmonic oscillator $H = p^2/(2m) + \\tfrac12m\\omega^2x^2$ with energy $E$, which statements are correct?',
      options: ['The area enclosed by its orbit in the $(x, p)$ plane is $2\\pi E/\\omega$.', 'The enclosed area is the same for every energy.', 'The enclosed area is $\\pi E/\\omega$.', 'Setting this area equal to $nh$ (Bohr-Sommerfeld) gives $E = n\\hbar\\omega$.'], answer: [0, 3],
      sol: 'The orbit is an ellipse with semi-axes $x_0 = \\sqrt{2E/(m\\omega^2)}$ and $p_0 = \\sqrt{2mE}$. Area $= \\pi x_0p_0 = \\pi\\cdot2E/\\omega = 2\\pi E/\\omega$ (A true, B and C false). Setting $2\\pi E/\\omega = nh$ gives $E = nh\\omega/(2\\pi) = n\\hbar\\omega$ (D), the old quantum rule (the exact answer adds $\\tfrac12\\hbar\\omega$).',
      trap: 'C forgets that $\\pi x_0p_0$ already contains the factor 2 from $x_0p_0 = 2E/\\omega$.' },
  ],
  gens: [
    { id: 'shm-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'kinematics', format: 'statements',
      make(r) {
        const A = Q5.int(r, 2, 10), w = Q5.int(r, 2, 9), yes = r() < 0.5;
        const T = [`The maximum speed is $${A * w}$ cm/s.`, `The maximum acceleration is $${A * w * w}$ cm/s$^2$.`, `The period is $2\\pi/${w}$ s.`,
          `At $x = ${A / 2}$ cm the speed is $${A * w}\\sqrt3/2$ cm/s.`, `The kinetic and potential energies are equal at $x = ${A}/\\sqrt2$ cm.`, 'The acceleration is zero at the mean position.'];
        const F = [`The maximum speed is $${A * w * w}$ cm/s.`, `The maximum acceleration is $${A * w}$ cm/s$^2$.`, `The period is $${2 * w}\\pi$ s.`,
          `At $x = ${A / 2}$ cm the speed is $${A * w / 2}$ cm/s.`, `The kinetic and potential energies are equal at $x = ${A / 2}$ cm.`, 'The acceleration is largest at the mean position.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `A particle moves along a line with $x = ${A}\\sin(${w}t)$ ($x$ in cm, $t$ in s). Which of these statements are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: `Here $A = ${A}$ cm and $\\omega = ${w}$ rad/s. $v_{\\max} = A\\omega = ${A * w}$ cm/s and $a_{\\max} = A\\omega^2 = ${A * w * w}$ cm/s$^2$; $T = 2\\pi/\\omega = 2\\pi/${w}$ s. The speed is $v = \\omega\\sqrt{A^2 - x^2}$, so at $x = A/2$ it is $\\tfrac{\\sqrt3}{2}A\\omega$. KE = PE when $\\tfrac12kx^2 = \\tfrac12\\cdot\\tfrac12kA^2$, that is at $x = A/\\sqrt2$. $a = -\\omega^2x$ is zero at $x = 0$ and largest at the turning points. Compare each statement with these facts.`,
          trap: 'At half the amplitude the speed is not half the maximum: it is $\\sqrt3/2$ of it.' };
      } },
    { id: 'shm-t22', type: 'mcq', level: 3, exams: ['jam'], sub: 'spring-mass',
      make(r) {
        const M = Q5.int(r, 1, 6), m = Q5.int(r, 1, 5), mean = r() < 0.5;
        const s = `$A\\sqrt{${M}/${M + m}}$`, u = '$A$', l = `$A\\cdot ${M}/${M + m}$`, h = `$A\\sqrt{${M + m}/${M}}$`;
        const o = Q5.mcqOptions(r, mean ? s : u, mean ? [u, l, h] : [s, l, h]);
        return { q: `A block of mass $${M}$ kg oscillates with amplitude $A$ on a horizontal spring on a smooth floor. As the block passes its ${mean ? 'mean position' : 'extreme position'}, a lump of putty of mass $${m}$ kg is dropped vertically onto it and sticks. The new amplitude is`, ...o,
          sol: mean ? `At the mean position the block has its full speed $v = A\\omega$. The putty brings no horizontal momentum, so $Mv = (M + m)v'$ and $v' = \\dfrac{M}{M+m}A\\omega$. The new angular frequency is $\\omega' = \\omega\\sqrt{M/(M+m)}$. The mean position does not move, so $A' = v'/\\omega' = A\\sqrt{${M}/${M + m}}$.`
            : `At the extreme position the block is momentarily at rest. The putty adds no horizontal momentum, so the combined block is still at rest at $x = A$: that point stays a turning point and $A' = A$. Only the period grows, by $\\sqrt{${M + m}/${M}}$.`,
          trap: 'Momentum (not kinetic energy) is conserved when the putty sticks; at the extreme there is no speed to share at all.' };
      } },
    { id: 'shm-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'kinematics', unit: 'cm',
      make(r) {
        const A = Q5.int(r, 6, 15), w = Q5.int(r, 2, 6), x1 = Q5.int(r, 1, A - 4), x2 = Q5.int(r, x1 + 2, A - 1);
        const v1 = Q5.round(w * Math.sqrt(A * A - x1 * x1), 2), v2 = Q5.round(w * Math.sqrt(A * A - x2 * x2), 2);
        const om2 = (v1 * v1 - v2 * v2) / (x2 * x2 - x1 * x1), amp = Math.sqrt(x1 * x1 + v1 * v1 / om2);
        return { q: `A particle in SHM has speed $${v1}$ cm/s when it is $${x1}$ cm from the mean position and $${v2}$ cm/s when it is $${x2}$ cm from it. Its amplitude is ______ cm (to two decimal places).`,
          answer: Q5.round(amp, 2), tol: 0.03, v1, v2, x1, x2,
          sol: `Use $v^2 = \\omega^2(A^2 - x^2)$ at both points. Subtracting, $v_1^2 - v_2^2 = \\omega^2(x_2^2 - x_1^2)$, so $\\omega^2 = \\dfrac{${v1}^2 - ${v2}^2}{${x2}^2 - ${x1}^2} = ${Q5.round(om2, 3)}$ s$^{-2}$. Then $A^2 = x_1^2 + v_1^2/\\omega^2$ gives $A = ${Q5.round(amp, 2)}$ cm.`,
          trap: 'Two unknowns ($\\omega$ and $A$) need both data points; eliminate $\\omega$ first.' };
      },
      verify: (p) => Math.sqrt((p.v1 ** 2 * p.x2 ** 2 - p.v2 ** 2 * p.x1 ** 2) / (p.v1 ** 2 - p.v2 ** 2)) },
    { id: 'shm-t24', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'other oscillators', format: 'dimensions',
      make(r) {
        const n = Q5.choose(r, [2, 3, 4, 5]);
        const f = (x) => (Number.isInteger(x) ? String(x) : `${x < 0 ? '-' : ''}${Math.abs(2 * x)}/2`);
        const show = (x) => `$T \\propto A^{${f(x)}}$`;
        const o = Q5.mcqOptions(r, (1 - n) / 2, [(n - 1) / 2, 1 - n, 0.5, -(n + 1) / 2, 1], show);
        return { q: `A particle of mass $m$ moves under the restoring force $F = -k\\,x\\,|x|^{${n - 1}}$ (so $|F| = k|x|^{${n}}$). Using only dimensional analysis, how does the period depend on the amplitude $A$?`, ...o,
          sol: `$[k] = [F]/[x^{${n}}] = \\mathrm{M\\,L^{${1 - n}}\\,T^{-2}}$. Write $T = m^a k^b A^c$. Mass: $a + b = 0$; time: $-2b = 1$, so $b = -\\tfrac12$, $a = \\tfrac12$; length: $(1-${n})b + c = 0$, so $c = (1 - ${n})/2$. Hence $T \\propto A^{${f((1 - n) / 2)}}$: only the linear force ($n = 1$) gives a period independent of amplitude.`,
          trap: 'Isochronism (period independent of amplitude) is special to the linear force $F = -kx$.' };
      } },
    { id: 'shm-t25', type: 'msq', level: 2, exams: ['jam'], sub: 'phase', format: 'graph',
      make(r) {
        const qd = Q5.int(r, 0, 3);
        const desc = ['positive and increasing', 'positive and decreasing', 'negative and becoming more negative', 'negative and moving back towards zero'][qd];
        const vPos = qd === 0 || qd === 3, aPos = qd >= 2, inward = qd === 1 || qd === 3;
        const pairs = [
          ['The velocity is positive.', 'The velocity is negative.'], ['The acceleration is positive.', 'The acceleration is negative.'],
          ['The kinetic energy is increasing.', 'The kinetic energy is decreasing.'], ['The velocity and acceleration point the same way.', 'The velocity and acceleration point opposite ways.'],
          ['The particle is moving towards the mean position.', 'The particle is moving away from the mean position.']];
        const truth = [vPos, aPos, inward, inward, inward];
        const T = pairs.map((p, i) => (truth[i] ? p[0] : p[1])), F = pairs.map((p, i) => (truth[i] ? p[1] : p[0]));
        const o = q5msq(r, T, F);
        return { q: `The displacement-time graph of a particle in SHM is a sine curve about $x = 0$. At a certain instant the graph shows the displacement to be ${desc}. Which statements about that instant are correct?`, ...o,
          sol: `The slope of the $x$-$t$ graph is the velocity: it is ${vPos ? 'positive' : 'negative'} here. In SHM $a = -\\omega^2 x$, so the acceleration has the opposite sign to $x$: ${aPos ? 'positive' : 'negative'}. The particle is moving ${inward ? 'towards' : 'away from'} the mean position, so its speed (and kinetic energy) is ${inward ? 'increasing' : 'decreasing'}, and $v$ and $a$ point ${inward ? 'the same way' : 'opposite ways'}.`,
          trap: 'The sign of the acceleration follows the displacement (opposite to it), not the velocity.' };
      } },
    { id: 'shm-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'spring-mass',
      make(r) {
        const m = pick(r, 0.1, 2, 0.1), k = choose(r, [20, 40, 50, 80, 100, 160, 200, 250, 400]);
        const T = TAU * Math.sqrt(m / k);
        return { q: `A mass of $${m}$ kg on a light spring of force constant $${k}$ N/m oscillates on a smooth floor. Its period is ______ s (to three decimal places).`,
          answer: round(T, 3), tol: Math.max(0.002, round(T * 0.01, 3)), unit: 's', m, k,
          sol: `$T = 2\\pi\\sqrt{m/k} = 2\\pi\\sqrt{${m}/${k}} = ${round(T, 3)}$ s.`,
          trap: 'Writing $\\sqrt{k/m}$ inverts the ratio and gives the angular frequency instead.' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt(p.m / p.k) },
    { id: 'shm-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'kinematics',
      make(r) {
        const A = int(r, 4, 12), x = int(r, 1, A - 1), w = int(r, 2, 9);
        const v = w * Math.sqrt(A * A - x * x);
        return { q: `A particle oscillates with amplitude $${A}$ cm and angular frequency $${w}$ rad/s. Its speed at $${x}$ cm from the mean position is ______ cm/s (to two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.02, round(v * 0.005, 2)), unit: 'cm/s', A, x, w,
          sol: `$v = \\omega\\sqrt{A^2 - x^2} = ${w}\\sqrt{${A * A} - ${x * x}} = ${w}\\times${round(Math.sqrt(A * A - x * x), 4)} = ${round(v, 2)}$ cm/s.`,
          trap: 'Using $\\omega(A - x)$ instead of $\\omega\\sqrt{A^2 - x^2}$.' };
      },
      verify: (p) => p.w * Math.sqrt(p.A ** 2 - p.x ** 2) },
    { id: 'shm-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'pendulum',
      make(r) {
        const L = pick(r, 0.2, 3, 0.1), g = choose(r, [9.8, 1.62, 3.71, 24.8, 4.9]);
        const where = { 9.8: 'on Earth', 1.62: 'on the Moon', 3.71: 'on Mars', 24.8: 'on Jupiter', 4.9: 'on a planet' }[g];
        const T = TAU * Math.sqrt(L / g);
        return { q: `A simple pendulum of length $${L}$ m swings with small amplitude ${where}, where $g = ${g}$ m/s$^2$. Its period is ______ s (to two decimal places).`,
          answer: round(T, 2), tol: Math.max(0.02, round(T * 0.01, 2)), unit: 's', L, g,
          sol: `$T = 2\\pi\\sqrt{L/g} = 2\\pi\\sqrt{${L}/${g}} = ${round(T, 2)}$ s. The mass of the bob does not matter.` };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt(p.L / p.g) },
    { id: 'shm-g04', type: 'mcq', level: 2, exams: ['jam'], sub: 'spring-mass',
      make(r) {
        const k1 = choose(r, [100, 200, 300, 400, 600]), k2 = choose(r, [100, 200, 300, 600, 900]), m = choose(r, [0.5, 1, 2, 4]);
        const series = r() < 0.5;
        const k = series ? k1 * k2 / (k1 + k2) : k1 + k2, kw = series ? k1 + k2 : k1 * k2 / (k1 + k2);
        const w = Math.sqrt(k / m);
        const show = (v) => `$${round(v, 2)}$ rad/s`;
        const o = mcqOptions(r, w, [Math.sqrt(kw / m), Math.sqrt(k * m), Math.sqrt(k1 / m), w / TAU], show);
        return { q: `Springs of force constants $${k1}$ N/m and $${k2}$ N/m are connected ${series ? 'end to end (in series)' : 'side by side (in parallel)'} and support a mass of $${m}$ kg. The angular frequency of oscillation is`, ...o,
          sol: `${series ? `In series the extensions add: $k = k_1k_2/(k_1+k_2) = ${round(k, 3)}$ N/m.` : `In parallel the forces add: $k = k_1 + k_2 = ${k}$ N/m.`} Then $\\omega = \\sqrt{k/m} = \\sqrt{${round(k, 3)}/${m}} = ${round(w, 2)}$ rad/s.`,
          trap: 'Swapping the series and parallel rules: springs combine the opposite way to resistors.' };
      } },
    { id: 'shm-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'superposition',
      make(r) {
        const A1 = int(r, 1, 8), A2 = int(r, 1, 8), [ph, phTex] = choose(r, [[Math.PI / 3, '\\pi/3'], [Math.PI / 2, '\\pi/2'], [2 * Math.PI / 3, '2\\pi/3'], [Math.PI / 4, '\\pi/4'], [Math.PI / 6, '\\pi/6']]);
        const A = Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(ph));
        return { q: `Two SHMs along the same line, $x_1 = ${A1}\\sin\\omega t$ and $x_2 = ${A2}\\sin(\\omega t + ${phTex})$ (in cm), act on one particle. The amplitude of the resulting motion is ______ cm (to two decimal places).`,
          answer: round(A, 2), tol: 0.02, unit: 'cm', A1, A2, ph,
          sol: `Phasor addition: $A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi = ${A1 * A1} + ${A2 * A2} + ${2 * A1 * A2}\\cos(${phTex}) = ${round(A * A, 4)}$, so $A = ${round(A, 2)}$ cm.`,
          trap: 'The amplitudes add directly only when the phase difference is zero.' };
      },
      verify: (p) => Math.sqrt(p.A1 ** 2 + p.A2 ** 2 + 2 * p.A1 * p.A2 * Math.cos(p.ph)) },
    { id: 'shm-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'kinematics',
      make(r) {
        const T = choose(r, [1.2, 2, 2.4, 3, 3.6, 4, 6]);
        const [f, fTex] = choose(r, [[0.5, '1/2'], [Math.SQRT1_2, '1/\\sqrt2'], [Math.sqrt(3) / 2, '\\sqrt3/2']]);
        const fromMean = r() < 0.5;
        const t = fromMean ? T * Math.asin(f) / TAU : T * Math.acos(f) / TAU;
        return { q: `A particle in SHM with period $${T}$ s starts ${fromMean ? 'at the mean position' : 'from rest at the extreme $x = +A$'}. The shortest time for it to reach $x = (${fTex})A$ is ______ s (to three decimal places).`,
          answer: round(t, 3), tol: 0.003, unit: 's', T, f, fromMean,
          sol: fromMean ? `$x = A\\sin(2\\pi t/T)$, so $2\\pi t/T = \\sin^{-1}(${fTex}) = ${round(Math.asin(f), 4)}$ rad and $t = ${T}\\times${round(Math.asin(f), 4)}/(2\\pi) = ${round(t, 3)}$ s.`
            : `$x = A\\cos(2\\pi t/T)$, so $2\\pi t/T = \\cos^{-1}(${fTex}) = ${round(Math.acos(f), 4)}$ rad and $t = ${T}\\times${round(Math.acos(f), 4)}/(2\\pi) = ${round(t, 3)}$ s.`,
          trap: 'Using sine when the motion starts at the extreme (or cosine when it starts at the mean) swaps the two times.' };
      },
      verify: (p) => p.T * (p.fromMean ? Math.asin(p.f) : Math.acos(p.f)) / (2 * Math.PI) },
    { id: 'shm-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'contact and SHM',
      make(r) {
        const f = pick(r, 1, 6, 0.5);
        const A = 9.8 / (TAU * f) ** 2 * 100;
        return { q: `A block rests on a horizontal platform that oscillates vertically in SHM at $${f}$ Hz. Take $g = 9.8$ m/s$^2$. The largest amplitude for which the block stays in contact is ______ cm (to two decimal places).`,
          answer: round(A, 2), tol: Math.max(0.01, round(A * 0.01, 2)), unit: 'cm', f,
          sol: `Contact is lost at the top when $\\omega^2A > g$. So $A_{\\max} = g/\\omega^2 = 9.8/(2\\pi\\times${f})^2 = ${round(A / 100, 5)}$ m $= ${round(A, 2)}$ cm.`,
          trap: 'Using $f$ in place of $\\omega = 2\\pi f$.' };
      },
      verify: (p) => 9.8 / (2 * Math.PI * p.f) ** 2 * 100 },
    { id: 'shm-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'physical pendulum',
      make(r) {
        const L = pick(r, 0.6, 2, 0.2), frac = choose(r, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
        const d = round(L * frac, 3);
        const T = TAU * Math.sqrt((L * L / 12 + d * d) / (9.8 * d));
        return { q: `A uniform rod of length $${L}$ m swings in a vertical plane about a horizontal axis $${d}$ m from its centre. Take $g = 9.8$ m/s$^2$. The period of small oscillations is ______ s (to two decimal places).`,
          answer: round(T, 2), tol: 0.02, unit: 's', L, d,
          sol: `Parallel axes: $I = m(L^2/12 + d^2)$. Then $T = 2\\pi\\sqrt{I/(mgd)} = 2\\pi\\sqrt{(${round(L * L / 12, 4)} + ${round(d * d, 4)})/(9.8\\times${d})} = ${round(T, 2)}$ s.`,
          trap: 'Forgetting the parallel-axis term $d^2$, or using $I = mL^2/3$ (which is only for the end).' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt((p.L ** 2 / 12 + p.d ** 2) / (9.8 * p.d)) },
  ],
};
