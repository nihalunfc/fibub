// Superposition and coupled oscillators: adding SHMs along one line (phasors), beats, perpendicular SHMs and
// Lissajous figures (shapes, frequency ratios from an oscilloscope, sense of rotation), coupled pendulums and
// spring-mass chains (normal modes, energy exchange, normal coordinates), coupled LC circuits and the normal modes
// of chains and rings for GATE and NET. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

import * as Q5 from '../_util.js';
import more2 from './superposition-coupled.more2.gen.js';
import r4 from './superposition-coupled.r4.gen.js';

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
  topic: 'superposition-coupled',
  items: [
    // ---------- level 1 ----------
    { id: 'spc-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'adding SHMs',
      q: 'A particle is moved by two SHMs along the same line, $x_1 = 3\\sin\\omega t$ and $x_2 = 4\\cos\\omega t$ (in cm). The amplitude of the resulting motion is',
      options: ['$7$ cm', '$1$ cm', '$5$ cm', '$\\sqrt7$ cm'], answer: 2,
      sol: '$\\cos\\omega t = \\sin(\\omega t + \\pi/2)$, so the two motions are $90^\\circ$ apart. As phasors they are perpendicular arrows of lengths 3 and 4: $A = \\sqrt{3^2 + 4^2} = 5$ cm.',
      trap: 'Adding the amplitudes (7 cm) is right only when the two motions are in phase.' },
    { id: 'spc-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'lissajous',
      q: 'A point moves with $x = A\\cos\\omega t$ and $y = A\\sin\\omega t$. Its path is',
      options: ['a straight line through the origin', 'a circle of radius $A$', 'a parabola', 'a figure of eight'], answer: 1,
      sol: '$x^2 + y^2 = A^2(\\cos^2\\omega t + \\sin^2\\omega t) = A^2$: a circle. Two perpendicular SHMs of equal amplitude and frequency, a quarter cycle apart, make uniform circular motion.' },
    { id: 'spc-003', type: 'nat', level: 1, exams: ['jam'], sub: 'beats', unit: 'Hz',
      q: 'A displacement is $x = a\\cos(20\\pi t) + a\\cos(22\\pi t)$, with $t$ in seconds. The beat frequency (number of loudness maxima per second) is ______ Hz.',
      answer: 1, tol: 0, calc: () => (22 * Math.PI - 20 * Math.PI) / (2 * Math.PI),
      sol: 'The frequencies are $f_1 = 20\\pi/2\\pi = 10$ Hz and $f_2 = 22\\pi/2\\pi = 11$ Hz. The beat frequency is $|f_1 - f_2| = 1$ Hz.',
      trap: 'Subtracting the angular frequencies ($2\\pi$ rad/s) and calling it Hz gives $6.28$.' },
    { id: 'spc-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'lissajous',
      q: 'Two perpendicular SHMs $x = a\\sin\\omega t$ and $y = a\\sin(\\omega t + \\pi)$ act on a particle. Its path is',
      options: ['a circle', 'the straight line $y = x$', 'an ellipse with axes along $x$ and $y$', 'the straight line $y = -x$'], answer: 3,
      sol: '$\\sin(\\omega t + \\pi) = -\\sin\\omega t$, so $y = -x$ at every instant: the particle runs back and forth along the line $y = -x$.',
      trap: 'A phase difference of $\\pi$ still gives a line; it is the $\\pi/2$ difference that opens it into a circle.' },
    { id: 'spc-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'coupled pendulums',
      q: 'Two identical pendulums are joined by a light spring between their bobs. In the normal mode where both swing in step (same direction, same amplitude), the frequency is',
      options: ['higher than that of one free pendulum', 'zero', 'equal to that of one free pendulum', 'lower than that of one free pendulum'], answer: 2,
      sol: 'When the bobs move together the spring keeps its natural length, so it exerts no force. Each pendulum then swings as if the spring were not there: $\\omega = \\sqrt{g/L}$.',
      trap: 'The spring raises only the out-of-step mode, where it is stretched and squashed.' },
    { id: 'spc-006', type: 'nat', level: 1, exams: ['jam'], sub: 'normal modes',
      q: 'Four beads sit on a light stretched string fixed at both ends. If they move only sideways, in one plane, the number of normal modes is ______.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'Each bead has one coordinate (its sideways displacement), so there are 4 degrees of freedom and therefore 4 normal modes.',
      trap: 'Counting the string or the two fixed ends as extra degrees of freedom.' },

    // ---------- level 2 ----------
    { id: 'spc-007', type: 'nat', level: 2, exams: ['jam'], sub: 'adding SHMs', unit: 'cm',
      q: 'Two SHMs along one line, $x_1 = 4\\sin\\omega t$ and $x_2 = 4\\sin(\\omega t + \\pi/3)$ (in cm), are added. The resulting amplitude is ______ cm (to two decimal places).',
      answer: 6.93, tol: 0.05, calc: () => 8 * Math.cos(Math.PI / 6),
      sol: '$A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi = 16 + 16 + 32\\cos60^\\circ = 48$, so $A = 4\\sqrt3 = 6.93$ cm. For equal amplitudes this is $2A_1\\cos(\\phi/2)$.',
      trap: 'Using $\\cos(\\phi/2)$ inside the $A^2$ formula, or forgetting the square root.' },
    { id: 'spc-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'lissajous',
      q: 'On an oscilloscope, a signal of $200$ Hz drives the horizontal deflection and an unknown signal the vertical. The steady figure touches the top edge of its bounding box 3 times and the right-hand edge 2 times. The unknown frequency is',
      options: ['$133$ Hz', '$300$ Hz', '$200$ Hz', '$600$ Hz'], answer: 1,
      sol: 'In one full repeat of the figure, the vertical signal reaches its top once per cycle and the horizontal signal reaches its right-hand extreme once per cycle. So $f_y : f_x = (\\text{top touches}) : (\\text{side touches}) = 3 : 2$, and $f_y = 200\\times3/2 = 300$ Hz.',
      trap: 'Inverting the ratio gives $133$ Hz. Ask which signal makes the top touches: the vertical one.' },
    { id: 'spc-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'normal modes',
      q: 'Two equal masses $m$ joined by a spring of constant $k$ rest on a frictionless table with nothing else attached. The normal-mode angular frequencies for motion along the spring are',
      options: ['$\\sqrt{k/m}$ and $\\sqrt{2k/m}$', '$0$ and $\\sqrt{k/m}$', '$\\sqrt{k/2m}$ and $\\sqrt{2k/m}$', '$0$ and $\\sqrt{2k/m}$'], answer: 3,
      sol: 'One mode is the whole system sliding along together: nothing stretches, so $\\omega = 0$. In the other the masses move oppositely about the fixed centre of mass; each half of the spring (constant $2k$) acts on one mass, so $\\omega = \\sqrt{2k/m}$. Equivalently $\\omega = \\sqrt{k/\\mu}$ with reduced mass $\\mu = m/2$.',
      trap: 'Using $\\sqrt{k/m}$ treats one mass as if it were fixed to a wall.' },
    { id: 'spc-010', type: 'nat', level: 2, exams: ['jam'], sub: 'coupled pendulums', unit: 'rad/s',
      q: 'Two identical pendulums (length $1.0$ m, bob mass $0.20$ kg) are joined at the bobs by a spring of constant $0.49$ N/m. Take $g = 9.8$ m/s². The angular frequency of the mode in which the bobs swing in opposite directions is ______ rad/s (to two decimal places).',
      answer: 3.83, tol: 0.02, calc: () => Math.sqrt(9.8 / 1 + 2 * 0.49 / 0.2),
      sol: 'In the opposite mode each bob is displaced by $x$ and the other by $-x$, so the spring stretches by $2x$ and pulls each bob back with $2kx$. Then $\\omega_2^2 = g/L + 2k/m = 9.8 + 2(0.49)/0.20 = 9.8 + 4.9 = 14.7$, so $\\omega_2 = 3.83$ rad/s (the in-step mode stays at $\\sqrt{9.8} = 3.13$ rad/s).',
      trap: 'Using $k/m$ instead of $2k/m$: the spring changes length by twice each displacement.' },
    { id: 'spc-011', type: 'msq', level: 2, exams: ['jam'], sub: 'beats', format: 'statements',
      q: 'Two SHMs of equal amplitude $A$ and nearly equal angular frequencies $\\omega_1$ and $\\omega_2$ are added along one line. Which statements are correct?',
      options: ['The fast oscillation has angular frequency $(\\omega_1 + \\omega_2)/2$.', 'The number of loudness maxima per second is $|f_1 - f_2|$.', 'The amplitude swings between $0$ and $2A$.', 'Because the envelope is $2A\\cos[(\\omega_1 - \\omega_2)t/2]$, beats occur at $|f_1 - f_2|/2$ per second.'], answer: [0, 1, 2],
      sol: '$A\\cos\\omega_1t + A\\cos\\omega_2t = 2A\\cos\\left(\\frac{\\omega_1 - \\omega_2}{2}t\\right)\\cos\\left(\\frac{\\omega_1 + \\omega_2}{2}t\\right)$. The second factor is the fast oscillation (first statement true). The envelope swings from $2A$ to $0$ (third true). The envelope cosine has frequency $|f_1 - f_2|/2$, but loudness depends on its size, not its sign, and $|\\cos|$ peaks twice per cosine cycle, so there are $|f_1 - f_2|$ beats per second (second true, fourth false).',
      trap: 'Reading the beat frequency straight off the envelope cosine halves it.' },
    { id: 'spc-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'lissajous',
      q: 'A particle has $x = a\\sin\\omega t$ and $y = b\\cos\\omega t$ with $a \\ne b$. It moves on',
      options: ['an ellipse, clockwise as seen with $x$ to the right and $y$ up', 'an ellipse, anticlockwise', 'a straight line', 'a circle'], answer: 0,
      sol: '$x^2/a^2 + y^2/b^2 = 1$: an ellipse with axes along $x$ and $y$. At $t = 0$ it is at $(0, b)$, the top. A moment later $x$ is positive and $y$ is falling, so it moves from the top towards the right: clockwise.',
      trap: 'Assuming every $\\sin$/$\\cos$ pair goes anticlockwise; check the position at $t = 0$ and just after.' },
    { id: 'spc-013', type: 'nat', level: 2, exams: ['jam'], sub: 'beats',
      q: 'Two SHMs $x_1 = 5\\sin(100\\pi t)$ and $x_2 = 5\\sin(104\\pi t)$ (with $t$ in seconds) are added. The number of beats heard in $10$ s is ______.',
      answer: 20, tol: 0, calc: () => (52 - 50) * 10,
      sol: '$f_1 = 50$ Hz, $f_2 = 52$ Hz, so the beat frequency is $2$ Hz and there are $2\\times10 = 20$ beats in $10$ s.' },
    { id: 'spc-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'lissajous',
      q: 'A particle moves with $x = A\\sin\\omega t$ and $y = A\\cos2\\omega t$. Its path is',
      options: ['a figure of eight', 'a circle', 'an arc of a parabola', 'an ellipse'], answer: 2,
      sol: '$\\cos2\\omega t = 1 - 2\\sin^2\\omega t$, so $y = A(1 - 2x^2/A^2)$ with $-A \\le x \\le A$: an arc of a downward parabola, traced back and forth.',
      trap: 'With $y = A\\sin2\\omega t$ the path is a figure of eight; changing sine to cosine (a phase shift) changes the shape.' },
    { id: 'spc-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'normal modes',
      q: 'Two masses $m$ are connected in a line wall-spring-mass-spring-mass-spring-wall by three identical springs of constant $k$. The normal-mode angular frequencies are',
      options: ['$\\sqrt{k/m}$ and $\\sqrt{2k/m}$', '$\\sqrt{2k/m}$ and $\\sqrt{3k/m}$', '$\\sqrt{k/2m}$ and $\\sqrt{3k/m}$', '$\\sqrt{k/m}$ and $\\sqrt{3k/m}$'], answer: 3,
      sol: 'In-step mode ($x_1 = x_2$): the middle spring is unstretched, each mass feels only its outer spring: $\\omega_1 = \\sqrt{k/m}$. Opposite mode ($x_1 = -x_2$): the middle spring changes by $2x$ and adds $2kx$ to the outer spring\'s $kx$: $\\omega_2 = \\sqrt{3k/m}$.' },
    { id: 'spc-016', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'normal modes', format: 'statements',
      q: 'Which statements about the normal modes of an undamped system of coupled oscillators are correct?',
      options: ['In a normal mode every part oscillates at the same frequency.', 'In a normal mode all parts pass through their equilibrium positions at the same instant.', 'Any free motion of the system is a superposition of its normal modes.', 'In a normal mode energy flows back and forth between the oscillators.'], answer: [0, 1, 2],
      sol: 'A normal mode is a motion in which all coordinates move as $\\cos(\\omega t + \\phi)$ with one $\\omega$ and one $\\phi$ (moving in step or exactly opposite), so they cross equilibrium together. The modes form a complete set, so any motion is a sum of them. Energy exchange (beats between oscillators) needs two modes at once; in a single mode the energy of each part stays the same on average.',
      trap: 'The slow swapping of energy between coupled pendulums is a mixture of two modes, not a mode.' },

    // ---------- level 3 ----------
    { id: 'spc-017', type: 'nat', level: 3, exams: ['jam'], sub: 'coupled pendulums', unit: 's',
      q: 'Two weakly coupled identical pendulums have normal-mode frequencies of $1.00$ Hz and $1.05$ Hz. One is pulled aside and released while the other is at rest. The time until the first pendulum is (momentarily) motionless, with all the energy in the second, is ______ s.',
      answer: 10, tol: 0.1, calc: () => 1 / (2 * (1.05 - 1.00)),
      sol: 'The motion is an equal mix of both modes: $x_1 = a\\cos(\\Delta\\omega t/2)\\cos\\bar\\omega t$, $x_2 = a\\sin(\\Delta\\omega t/2)\\sin\\bar\\omega t$. Pendulum 1 stops when $\\Delta\\omega t/2 = \\pi/2$, i.e. $t = \\pi/\\Delta\\omega = 1/(2\\Delta f) = 1/(2\\times0.05) = 10$ s.',
      trap: 'Using the full beat period $1/\\Delta f = 20$ s: that is the time for the energy to go over and come back.' },
    { id: 'spc-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'lissajous',
      q: 'A particle has $x = A\\sin\\omega t$ and $y = A\\sin(\\omega t + \\phi)$. For $\\phi = 3\\pi/4$ its path is',
      options: ['an ellipse with its major axis along $y = x$', 'an ellipse with its major axis along $y = -x$', 'a circle', 'the straight line $y = -x$'], answer: 1,
      sol: 'Eliminating $t$ gives $x^2 + y^2 - 2xy\\cos\\phi = A^2\\sin^2\\phi$. With $\\cos\\phi = -1/\\sqrt2$: $x^2 + y^2 + \\sqrt2\\,xy = A^2/2$. Along $y = -x$ the $xy$ term is negative, so the curve reaches further out in that direction: the major axis lies along $y = -x$. (For $0 < \\phi < \\pi/2$ it lies along $y = x$; at $\\pi/2$ it is a circle; at $\\pi$ it closes into the line $y = -x$.)',
      trap: 'Remembering only "ellipse at 45 degrees" without checking which diagonal.' },
    { id: 'spc-019', type: 'nat', level: 3, exams: ['jam'], sub: 'adding SHMs', unit: 'cm',
      q: 'Three SHMs along one line are added: $x_1 = 4\\sin\\omega t$, $x_2 = 3\\sin(\\omega t + \\pi/2)$ and $x_3 = 2\\sin(\\omega t + \\pi)$, all in cm. The amplitude of the resultant is ______ cm (to two decimal places).',
      answer: 3.61, tol: 0.02, calc: () => Math.sqrt(13),
      sol: '$x_3 = -2\\sin\\omega t$, which cancels part of $x_1$: together $2\\sin\\omega t$. $x_2 = 3\\cos\\omega t$. So $x = 2\\sin\\omega t + 3\\cos\\omega t$, with amplitude $\\sqrt{4 + 9} = \\sqrt{13} = 3.61$ cm.',
      trap: 'Adding $4 + 3 + 2$, or ignoring that $x_3$ is opposite to $x_1$.' },
    { id: 'spc-020', type: 'nat', level: 3, exams: ['jam'], sub: 'normal modes', unit: 'rad/s',
      q: 'Two masses of $0.5$ kg are connected wall-spring-mass-spring-mass-spring-wall. The two outer springs have $k = 50$ N/m and the middle one $k\' = 25$ N/m. The higher normal-mode angular frequency is ______ rad/s (to two decimal places).',
      answer: 14.14, tol: 0.05, calc: () => Math.sqrt((50 + 2 * 25) / 0.5),
      sol: 'Opposite mode: each mass feels $kx$ from its outer spring and $2k\'x$ from the middle spring (stretched by $2x$). $\\omega^2 = (k + 2k\')/m = (50 + 50)/0.5 = 200$, so $\\omega = 14.14$ rad/s. The other mode has $\\omega = \\sqrt{k/m} = 10$ rad/s.',
      trap: 'Writing $(k + k\')/m$ forgets that the middle spring is stretched from both ends.' },
    { id: 'spc-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'coupled pendulums',
      q: 'Two identical coupled oscillators have normal-mode angular frequencies $\\omega_1 < \\omega_2$. Oscillator 1 starts displaced and oscillator 2 at rest at equilibrium. Oscillator 1 first comes to a complete standstill (all the energy in oscillator 2) at $t =$',
      options: ['$\\pi/(\\omega_2 - \\omega_1)$', '$2\\pi/(\\omega_2 - \\omega_1)$', '$\\pi/(\\omega_2 + \\omega_1)$', '$\\pi/[2(\\omega_2 - \\omega_1)]$'], answer: 0,
      sol: 'With $x_1(0) = a$, $x_2(0) = 0$ both modes are excited equally: $x_1 = \\tfrac a2(\\cos\\omega_1t + \\cos\\omega_2t) = a\\cos\\frac{(\\omega_2 - \\omega_1)t}{2}\\cos\\frac{(\\omega_1 + \\omega_2)t}{2}$. The envelope is zero first when $(\\omega_2 - \\omega_1)t/2 = \\pi/2$, i.e. $t = \\pi/(\\omega_2 - \\omega_1)$.',
      trap: '$2\\pi/(\\omega_2 - \\omega_1)$ is when the energy has gone over and returned.' },
    { id: 'spc-022', type: 'msq', level: 3, exams: ['jam'], sub: 'lissajous', format: 'multi',
      q: 'Two perpendicular SHMs with frequencies $f_x$ and $f_y$ are combined. For which ratios is the Lissajous figure a closed curve that keeps repeating?',
      options: ['$f_x : f_y = 2 : 3$', '$f_x : f_y = \\sqrt2 : 1$', '$f_x : f_y = 1.5 : 1$', '$f_x : f_y = \\pi : 3$'], answer: [0, 2],
      sol: 'The figure closes only if both motions complete whole numbers of cycles in the same time, i.e. $f_x/f_y$ is rational. $2/3$ and $1.5 = 3/2$ are rational; $\\sqrt2$ and $\\pi/3$ are irrational, so those curves never repeat and slowly fill a rectangle.' },
    { id: 'spc-023', type: 'nat', level: 3, exams: ['jam'], sub: 'lissajous', unit: 'Hz',
      q: 'A $500$ Hz signal feeds the horizontal plates of an oscilloscope and an unknown signal the vertical plates. The stationary Lissajous figure touches the top edge of its box twice and a side edge 5 times. The unknown frequency is ______ Hz.',
      answer: 200, tol: 0, calc: () => 500 * 2 / 5,
      sol: 'The top is touched once per vertical cycle and a side once per horizontal cycle, in the same time. $f_y/f_x = 2/5$, so $f_y = 500\\times2/5 = 200$ Hz.',
      trap: 'Inverting the ratio gives $1250$ Hz.' },
    { id: 'spc-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'coupled circuits',
      q: 'Two identical LC loops (inductance $L$, capacitance $C$ each) share a common branch containing a capacitor $C_c$. The two normal-mode angular frequencies are',
      options: ['$1/\\sqrt{LC}$ and $1/\\sqrt{LC_c}$', '$1/\\sqrt{L(C + C_c)}$ and $1/\\sqrt{LC}$', '$1/\\sqrt{2LC}$ and $\\sqrt{2/LC}$', '$1/\\sqrt{LC}$ and $\\sqrt{1/LC + 2/LC_c}$'], answer: 3,
      sol: 'With loop charges $q_1$, $q_2$ the shared capacitor carries $q_1 - q_2$. Kirchhoff: $L\\ddot q_1 + q_1/C + (q_1 - q_2)/C_c = 0$ and the same with 1 and 2 swapped. Mode $q_1 = q_2$: no charge on $C_c$, $\\omega^2 = 1/LC$. Mode $q_1 = -q_2$: $C_c$ carries $2q_1$, $\\omega^2 = 1/LC + 2/LC_c$. This is the coupled-pendulum problem with $1/C_c$ playing the spring.' },
    { id: 'spc-025', type: 'nat', level: 3, exams: ['jam'], sub: 'normal modes', unit: 'rad/s',
      q: 'Masses of $1$ kg and $2$ kg are joined by a spring of constant $24$ N/m and slide freely on a frictionless surface. The non-zero normal-mode angular frequency is ______ rad/s.',
      answer: 6, tol: 0.01, calc: () => Math.sqrt(24 / (1 * 2 / 3)),
      sol: 'The centre of mass moves freely (the zero mode). The relative coordinate oscillates with the reduced mass $\\mu = m_1m_2/(m_1 + m_2) = 2/3$ kg: $\\omega = \\sqrt{k/\\mu} = \\sqrt{24\\times3/2} = \\sqrt{36} = 6$ rad/s.',
      trap: 'Using the total mass ($\\sqrt{24/3} = 2.83$) or one of the masses.' },
    { id: 'spc-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'adding SHMs',
      q: 'Two SHMs of the same frequency and the same amplitude $A$ along one line add to give an SHM of amplitude $A$. The phase difference between them is',
      options: ['$\\pi/3$', '$\\pi/2$', '$2\\pi/3$', '$\\pi$'], answer: 2,
      sol: 'For equal amplitudes the resultant is $2A\\cos(\\phi/2)$. Setting it equal to $A$: $\\cos(\\phi/2) = 1/2$, so $\\phi/2 = \\pi/3$ and $\\phi = 2\\pi/3$.',
      trap: 'Solving $\\cos\\phi = 1/2$ instead gives $\\pi/3$, for which the resultant is $\\sqrt3A$.' },
    { id: 'spc-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'coupled pendulums',
      q: 'Two identical pendulums joined by a weak spring are released from rest, pendulum 1 displaced by $+a$ and pendulum 2 by $-a$. What happens?',
      options: ['Both swing in opposite directions at a frequency above that of a free pendulum, with no exchange of energy.', 'Energy passes from one pendulum to the other and back, at the beat frequency.', 'Both swing at the frequency of a free pendulum, in step.', 'Pendulum 2 stays at rest while pendulum 1 swings.'], answer: 0,
      sol: 'The starting shape $(+a, -a)$ is exactly the out-of-step normal mode, so only that mode is excited. The system stays in it for ever: equal and opposite swings at $\\omega_2 = \\sqrt{g/L + 2k/m}$, each pendulum keeping its own energy.',
      trap: 'Energy exchange happens only when the starting shape mixes both modes, such as one pendulum displaced and the other at rest.' },
    { id: 'spc-028', type: 'nat', level: 3, exams: ['jam'], sub: 'lissajous', unit: 'cm²',
      q: 'A particle moves with $x = 2\\sin\\omega t$ and $y = 2\\sin(\\omega t + \\pi/6)$ (in cm). The area enclosed by its elliptical path is ______ cm² (to two decimal places).',
      answer: 6.28, tol: 0.03, calc: () => Math.PI * 2 * 2 * Math.sin(Math.PI / 6),
      sol: 'For $x = a\\sin\\omega t$, $y = b\\sin(\\omega t + \\phi)$ the enclosed area is $\\oint x\\,dy = \\pi ab\\sin\\phi$ (check: a circle when $\\phi = \\pi/2$, a line of zero area when $\\phi = 0$). Here $\\pi\\times2\\times2\\times\\tfrac12 = 2\\pi = 6.28$ cm².',
      trap: 'Using $\\pi ab = 12.57$ cm² treats every such ellipse as if its phase difference were $\\pi/2$.' },

    // ---------- level 4 ----------
    { id: 'spc-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'normal modes',
      q: 'A linear molecule O-C-O is modelled as masses $16$, $12$ and $16$ (in u) in a line joined by two identical springs, moving only along the line. The ratio of the asymmetric-stretch frequency to the symmetric-stretch frequency is ______ (to two decimal places).',
      answer: 1.91, tol: 0.01, calc: () => Math.sqrt(1 + 2 * 16 / 12),
      sol: 'Symmetric stretch: the centre atom stays still and each O atom oscillates on one spring: $\\omega_s^2 = k/m$. Asymmetric stretch: the O atoms move together and C moves oppositely, keeping the centre of mass fixed ($2mx = -My$). Working out the forces gives $\\omega_a^2 = (k/m)(1 + 2m/M)$. Ratio $= \\sqrt{1 + 32/12} = \\sqrt{3.667} = 1.91$. (The third mode, the whole molecule sliding, has $\\omega = 0$.)',
      trap: 'Forgetting that the centre of mass stays fixed, or swapping $m$ and $M$ (which gives $\\sqrt{1 + 24/16} = 1.58$).' },
    { id: 'spc-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'normal modes',
      q: 'Three equal masses $m$ are connected in a line between two walls by four identical springs $k$ (wall-spring-mass-spring-mass-spring-mass-spring-wall). With $\\omega_0^2 = k/m$, the squared normal-mode frequencies are',
      options: ['$\\omega_0^2,\\ 2\\omega_0^2,\\ 3\\omega_0^2$', '$(2 - \\sqrt2)\\omega_0^2,\\ 2\\omega_0^2,\\ (2 + \\sqrt2)\\omega_0^2$', '$0,\\ \\omega_0^2,\\ 3\\omega_0^2$', '$\\omega_0^2,\\ 3\\omega_0^2,\\ 5\\omega_0^2$'], answer: 1,
      sol: 'The equations give the matrix $\\omega_0^2\\begin{pmatrix}2 & -1 & 0\\\\ -1 & 2 & -1\\\\ 0 & -1 & 2\\end{pmatrix}$, whose eigenvalues are $\\omega_0^2(2 - \\sqrt2)$, $2\\omega_0^2$, $\\omega_0^2(2 + \\sqrt2)$. Check: the middle mode $(1, 0, -1)$ keeps the centre mass still, and each outer mass feels two springs: $2\\omega_0^2$. Also the general chain formula $\\omega_n = 2\\omega_0\\sin[n\\pi/(2(N + 1))]$ with $N = 3$.',
      trap: 'There is no zero mode: the walls stop the chain from sliding as a whole.' },
    { id: 'spc-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'normal coordinates', format: 'statements',
      q: 'A system has Lagrangian $L = \\tfrac12(\\dot x^2 + \\dot y^2) - \\tfrac12(5x^2 + 5y^2 - 8xy)$. Which statements are correct?',
      options: ['The normal-mode angular frequencies are $1$ and $3$.', 'In the slower mode the two coordinates move equally and in step ($x = y$).', 'In the faster mode also $x = y$, but with a larger amplitude.', '$(x + y)/\\sqrt2$ and $(x - y)/\\sqrt2$ are normal coordinates.'], answer: [0, 1, 3],
      sol: 'The potential matrix is $\\begin{pmatrix}5 & -4\\\\ -4 & 5\\end{pmatrix}$ (unit masses). Its eigenvalues are $5 \\mp 4 = 1, 9$, with eigenvectors $(1, 1)$ and $(1, -1)$. So $\\omega = 1$ with $x = y$ and $\\omega = 3$ with $x = -y$. In $q_\\pm = (x \\pm y)/\\sqrt2$ the potential becomes $\\tfrac12(q_+^2 + 9q_-^2)$, with no cross term: these are normal coordinates.',
      trap: 'Forgetting that the frequency is the square root of the eigenvalue ($9 \\to 3$).' },
    { id: 'spc-032', type: 'nat', level: 4, exams: ['jam'], sub: 'coupled pendulums', unit: 's',
      q: 'Two identical pendulums of length $0.50$ m are joined at the bobs by a spring with $k/m = 0.20$ s$^{-2}$ ($g = 9.8$ m/s²). One is displaced and released, the other starts at rest. The time for all the energy to pass to the second pendulum is ______ s (to the nearest whole number).',
      answer: 70, tol: 0.7, calc: () => Math.PI / (Math.sqrt(9.8 / 0.5 + 0.4) - Math.sqrt(9.8 / 0.5)),
      sol: '$\\omega_1 = \\sqrt{g/L} = \\sqrt{19.6} = 4.4272$ rad/s. $\\omega_2 = \\sqrt{g/L + 2k/m} = \\sqrt{20.0} = 4.4721$ rad/s. The transfer time is $\\pi/(\\omega_2 - \\omega_1) = \\pi/0.04494 = 69.9$ s, about $70$ s. (Weak-coupling shortcut: $\\Delta\\omega \\approx k/(m\\omega_1) = 0.0452$ rad/s gives $69.5$ s.)',
      trap: 'Taking $2\\pi/\\Delta\\omega$ (140 s) counts the round trip.' },
    { id: 'spc-033', type: 'mcq', level: 4, exams: ['jam'], sub: 'lissajous',
      q: 'A particle moves with $x = A\\cos\\omega t$ and $y = A\\cos3\\omega t$. Its path is',
      options: ['an ellipse', 'a figure of eight', 'the cubic $y = (4x^3 - 3A^2x)/A^2$ for $|x| \\le A$', 'the parabola $y = A - 2x^2/A$'], answer: 2,
      sol: 'Use $\\cos3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$ with $\\cos\\theta = x/A$: $y/A = 4(x/A)^3 - 3(x/A)$, so $y = (4x^3 - 3A^2x)/A^2$. The particle runs back and forth along this S-shaped arc, which touches the top and bottom edges of its box (a 3 : 1 open Lissajous figure).',
      trap: 'The parabola belongs to $y = A\\cos2\\omega t$, a ratio of $2 : 1$.' },
    { id: 'spc-034', type: 'nat', level: 4, exams: ['jam'], sub: 'beats', unit: 's',
      q: 'A displacement is $x = 6\\cos(2t)\\cos(50t)$ in SI units. The time between successive instants at which the oscillation amplitude is zero is ______ s (to two decimal places).',
      answer: 1.57, tol: 0.01, calc: () => Math.PI / 2,
      sol: 'The envelope is $6|\\cos2t|$, which is zero when $2t = \\pi/2, 3\\pi/2, \\dots$, i.e. every $\\pi/2 = 1.57$ s. (This is the sum $3\\cos48t + 3\\cos52t$: the beat frequency is $(52 - 48)/2\\pi$ Hz, beat period $2\\pi/4 = 1.57$ s.)',
      trap: 'Taking the period of $\\cos2t$ itself, $\\pi = 3.14$ s; the amplitude depends on $|\\cos2t|$, which repeats twice as fast.' },
    { id: 'spc-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'coupled pendulums',
      q: 'Two identical pendulums (length $L$) are coupled by a weak spring attached to both strings at distance $d$ below the pivots. The spring is moved from $d = L$ (at the bobs) to $d = L/2$. The time taken for energy to pass from one pendulum to the other becomes about',
      options: ['twice as long', 'half as long', 'unchanged', 'four times as long'], answer: 3,
      sol: 'A swing angle $\\theta$ stretches the spring by $d\\theta$, and its force has lever arm $d$, so the coupling torque goes as $kd^2$. In the opposite mode $\\omega_2^2 = g/L + 2kd^2/(mL^2)$. For weak coupling $\\omega_2 - \\omega_1 \\approx kd^2/(mL^2\\omega_1)$, proportional to $d^2$. Halving $d$ divides $\\Delta\\omega$ by 4, so the transfer time $\\pi/\\Delta\\omega$ is four times longer.',
      trap: 'Thinking the coupling scales with $d$ alone: both the stretch and the lever arm carry a factor $d$.' },
    { id: 'spc-036', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'superposition principle', format: 'multi',
      q: 'For which equations is the sum of any two solutions again a solution?',
      options: ['$\\ddot x + \\omega^2x = 0$', '$\\ddot x + \\omega^2\\sin x = 0$', '$\\ddot x + \\gamma\\dot x + \\omega^2x = 0$', '$\\ddot x + \\omega^2x = F_0\\cos\\Omega t$'], answer: [0, 2],
      sol: 'Superposition needs a linear and homogeneous equation. The first and third qualify. $\\sin x$ is not linear in $x$. The driven equation is linear but not homogeneous: if $x_1$ and $x_2$ each give $F_0\\cos\\Omega t$, their sum gives $2F_0\\cos\\Omega t$. (The difference of two of its solutions does solve the free equation.)',
      trap: 'The driven oscillator is linear, so it feels like it should obey superposition; the forcing term breaks it.' },

    // ---------- level 5 ----------
    { id: 'spc-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Three equal masses on a light string, fixed at both ends and equally spaced, perform small transverse oscillations. The ratio of the highest to the lowest normal-mode frequency is ______ (to three decimal places).',
      answer: 2.414, tol: 0.005, calc: () => Math.sin(3 * Math.PI / 8) / Math.sin(Math.PI / 8),
      sol: 'For $N$ beads the modes are $\\omega_n = 2\\omega_0\\sin\\dfrac{n\\pi}{2(N + 1)}$, $n = 1, \\dots, N$. With $N = 3$: $\\omega_3/\\omega_1 = \\sin(3\\pi/8)/\\sin(\\pi/8) = 0.9239/0.3827 = 2.414 = 1 + \\sqrt2$. The same follows from the eigenvalues $2 \\mp \\sqrt2$ of the $3\\times3$ matrix: $\\sqrt{(2 + \\sqrt2)/(2 - \\sqrt2)} = 1 + \\sqrt2$.',
      trap: 'Taking the ratio of the eigenvalues ($5.83$) instead of their square roots.' },
    { id: 'spc-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'double pendulum', unit: 'rad/s',
      q: 'A double pendulum has two equal bobs and two equal light rods of length $1.0$ m ($g = 9.8$ m/s²). The lower normal-mode angular frequency for small oscillations is ______ rad/s (to two decimal places).',
      answer: 2.40, tol: 0.02, calc: () => Math.sqrt(9.8 * (2 - Math.SQRT2)),
      sol: 'For small angles: $T = \\tfrac12mL^2(2\\dot\\theta_1^2 + 2\\dot\\theta_1\\dot\\theta_2 + \\dot\\theta_2^2)$ and $V = \\tfrac12mgL(2\\theta_1^2 + \\theta_2^2)$. $\\det(V - \\omega^2T) = 0$ gives $\\omega^4 - 4(g/L)\\omega^2 + 2(g/L)^2 = 0$, so $\\omega^2 = (2 \\mp \\sqrt2)g/L$. Lower: $\\sqrt{0.586\\times9.8} = 2.40$ rad/s (both bobs swing the same way, the lower one further).',
      trap: 'Treating it as two independent pendulums of lengths $L$ and $2L$.' },
    { id: 'spc-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Four equal masses $m$ sit on a frictionless circular track, joined in a closed ring by four identical springs $k$, and move only along the track. With $\\omega_0 = \\sqrt{k/m}$, the normal-mode angular frequencies are',
      options: ['$0,\\ \\sqrt2\\omega_0,\\ \\sqrt2\\omega_0,\\ 2\\omega_0$', '$\\omega_0,\\ \\sqrt2\\omega_0,\\ \\sqrt3\\omega_0,\\ 2\\omega_0$', '$\\sqrt{2 - \\sqrt2}\\,\\omega_0,\\ \\sqrt2\\omega_0,\\ \\sqrt{2 + \\sqrt2}\\,\\omega_0,\\ 2\\omega_0$', '$0,\\ \\omega_0,\\ \\omega_0,\\ 2\\omega_0$'], answer: 0,
      sol: 'A ring of $N$ masses has $\\omega_n = 2\\omega_0|\\sin(n\\pi/N)|$, $n = 0, \\dots, N - 1$. For $N = 4$: $0$ (the ring turns as a whole), $\\sqrt2\\omega_0$ twice ($n = 1, 3$: two waves running opposite ways, or two standing waves), and $2\\omega_0$ (neighbours exactly opposite: each spring changes by $2x$ from both sides, $\\omega^2 = 4k/m$).',
      trap: 'Using the fixed-end chain formula, which has no zero mode and no repeated frequency.' },
    { id: 'spc-040', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'lissajous', format: 'statements',
      q: 'A particle moves with $x = A\\cos\\omega t$ and $y = A\\cos[(\\omega + \\varepsilon)t]$ where $0 < \\varepsilon \\ll \\omega$. On a time scale of many cycles the figure slowly changes shape. Which statements are correct?',
      options: ['Near $t = \\pi/\\varepsilon$ the figure is the straight line $y = -x$.', 'Near $t = \\pi/(2\\varepsilon)$ the figure is a circle.', 'The figure is the line $y = x$ once every $\\pi/\\varepsilon$.', 'Its axes always lie along the $x$ and $y$ axes.'], answer: [0, 1],
      sol: 'Over a few cycles this is a fixed-frequency Lissajous figure with a slowly growing phase difference $\\phi = \\varepsilon t$. $\\phi = \\pi$ (at $t = \\pi/\\varepsilon$) gives the line $y = -x$; $\\phi = \\pi/2$ gives a circle (equal amplitudes). The line $y = x$ needs $\\phi = 0, 2\\pi, \\dots$: once every $2\\pi/\\varepsilon$. For equal amplitudes the ellipses have their axes along the diagonals, not along $x$ and $y$ (except the circle). This is how an oscilloscope shows two nearly equal frequencies: the figure "breathes" at the beat frequency.',
      trap: 'Mixing up the time between lines on the same diagonal ($2\\pi/\\varepsilon$) with the time between the two diagonals ($\\pi/\\varepsilon$).' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'spc-t21', type: 'nat', level: 3, exams: ['jam'], sub: 'adding SHMs', unit: 'cm',
      make(r) {
        const N = Q5.int(r, 3, 6), ph = Q5.choose(r, [30, 45, 60, 90, 120]), a = Q5.int(r, 1, 5);
        const R = Math.abs(a * Math.sin(N * ph * Math.PI / 360) / Math.sin(ph * Math.PI / 360));
        return { q: `$${N}$ SHMs along the same line, each of amplitude $${a}$ cm and the same frequency, are added. Each is ahead of the one before it in phase by $${ph}^\\circ$. The amplitude of the resultant motion is ______ cm (to two decimal places).`,
          answer: Q5.round(R, 2), tol: 0.01, N, ph, a,
          sol: `The phasors form part of a regular polygon. The resultant of $N$ equal phasors with step $\\phi$ is $a\\,\\dfrac{\\sin(N\\phi/2)}{\\sin(\\phi/2)}$ in size: $${a}\\times\\dfrac{|\\sin(${N * ph / 2}^\\circ)|}{\\sin(${ph / 2}^\\circ)} = ${Q5.round(R, 2)}$ cm.${Q5.round(R, 2) === 0 ? ' The phasors close into a full polygon, so the motions cancel.' : ''}`,
          trap: 'Amplitudes add as phasors, not as numbers: $N a$ only when the phase step is zero.' };
      },
      verify: (p) => { let x = 0, y = 0; for (let j = 0; j < p.N; j++) { x += p.a * Math.cos(j * p.ph * Math.PI / 180); y += p.a * Math.sin(j * p.ph * Math.PI / 180); } return Math.hypot(x, y); } },
    { id: 'spc-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'coupled pendulums', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['In the in-phase (symmetric) mode the coupling spring never stretches.', 'The out-of-phase mode has the higher frequency.', 'The in-phase mode has the same frequency as one uncoupled pendulum.',
          'If one bob alone is pulled aside and released, the energy passes back and forth between the bobs.', 'The normal-mode frequencies do not depend on how the motion is started.'];
        const F = ['The in-phase mode has the higher frequency.', 'In the in-phase mode the coupling spring is stretched most.', 'A stiffer coupling spring makes the energy exchange between the bobs slower.',
          'The out-of-phase mode has the same frequency as one uncoupled pendulum.', 'Any motion of the two bobs repeats with the period of the in-phase mode.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Two identical simple pendulums are joined at their bobs by a light spring. Which statements about small oscillations are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'Modes: in phase, $\\omega_1 = \\sqrt{g/L}$ (the spring keeps its length, so it is as if absent); out of phase, $\\omega_2 = \\sqrt{g/L + 2k/m}$ (higher). A general motion is a mix of the two; starting one bob alone gives beats, with the energy swapping in a time $\\pi/(\\omega_2 - \\omega_1)$, which shortens as $k$ grows. The mode frequencies are fixed by the system; the mixture depends on the start, and a mixture is periodic only when $\\omega_2/\\omega_1$ is rational.',
          trap: 'The spring sets the gap between the two mode frequencies, so a stiffer spring means faster energy exchange.' };
      } },
    { id: 'spc-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'coupled pendulums', unit: 'N/m',
      make(r) {
        const m = Q5.pick(r, 0.1, 1, 0.05), fs = Q5.pick(r, 0.5, 1.5, 0.01), fa = Q5.round(fs + Q5.pick(r, 0.05, 0.6, 0.01), 2);
        const k = m * (4 * Math.PI ** 2) * (fa * fa - fs * fs) / 2;
        return { q: `Two identical pendulums with bobs of mass $${m}$ kg are coupled by a light spring between the bobs. Their normal modes are measured at $${fs}$ Hz (in phase) and $${fa}$ Hz (out of phase). The spring constant is ______ N/m (to three decimal places).`,
          answer: Q5.round(k, 3), tol: Math.max(0.002, Q5.round(0.005 * k, 4)), m, fs, fa,
          sol: `$\\omega_s^2 = g/L$ and $\\omega_a^2 = g/L + 2k/m$, so $k = \\tfrac{m}{2}(\\omega_a^2 - \\omega_s^2) = 2\\pi^2 m(f_a^2 - f_s^2) = 2\\pi^2\\times${m}\\times(${fa}^2 - ${fs}^2) = ${Q5.round(k, 3)}$ N/m.`,
          trap: 'Each bob feels the spring stretch twice the bob displacement in the out-of-phase mode: hence $2k/m$.' };
      },
      verify: (p) => { const ws = 2 * Math.PI * p.fs, wa = 2 * Math.PI * p.fa; const gL = ws * ws; return (wa * wa - gL) * p.m / 2; } },
    { id: 'spc-t24', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'normal modes', format: 'comparison',
      make(r) {
        const c = Q5.int(r, 1, 6);
        const sq = (n) => { const s = Math.round(Math.sqrt(n)); return s * s === n ? `$${s}$` : `$\\sqrt{${n}}$`; };
        const o = Q5.mcqOptions(r, sq(1 + 2 * c), [sq(1 + c), sq(2 * c), `$${1 + 2 * c}$`, sq(2 + c), `$${c + 1}$`, sq(4 * c + 1)]);
        return { q: `Two equal masses $m$ slide on a smooth line between two walls: wall, spring $k$, mass, spring $${c === 1 ? '' : c}k$, mass, spring $k$, wall. The ratio of the higher normal-mode frequency to the lower one is`, ...o,
          sol: `In the in-phase mode the middle spring keeps its length: $\\omega_1 = \\sqrt{k/m}$. In the out-of-phase mode the middle spring stretches by $2x$, so each mass feels $-kx - 2(${c}k)x$: $\\omega_2 = \\sqrt{(1 + ${2 * c})k/m}$. Ratio $= \\sqrt{${1 + 2 * c}}$.`,
          trap: 'In the out-of-phase mode the middle spring stretches by twice each displacement.' };
      } },
    { id: 'spc-t25', type: 'nat', level: 2, exams: ['jam'], sub: 'lissajous', unit: 'degrees',
      make(r) {
        const B = Q5.int(r, 2, 10), Y = Q5.pick(r, 0.5, B - 0.5, 0.5);
        const phi = Math.asin(Y / B) * 180 / Math.PI;
        return { q: `A spot moves with $x = A\\sin\\omega t$ and $y = ${B}\\sin(\\omega t + \\phi)$ (cm), with $0 < \\phi < 90^\\circ$, and traces an ellipse. The ellipse cuts the $y$ axis at $y = \\pm${Y}$ cm. The phase difference $\\phi$ is ______ degrees (to one decimal place).`,
          answer: Q5.round(phi, 1), tol: 0.1, B, Y,
          sol: `On the $y$ axis $x = 0$, so $\\sin\\omega t = 0$ and $\\omega t = 0$ or $\\pi$; then $y = \\pm${B}\\sin\\phi$. So $\\sin\\phi = ${Y}/${B}$ and $\\phi = ${Q5.round(phi, 1)}^\\circ$.`,
          trap: 'The crossing height is $B\\sin\\phi$, not $B\\cos\\phi$: at $\\phi = 0$ the figure is a line through the origin.' };
      },
      verify: (p) => Math.acos(Math.sqrt(1 - (p.Y / p.B) ** 2)) * 180 / Math.PI },
    { id: 'spc-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'adding SHMs',
      make(r) {
        const A1 = int(r, 2, 9), A2 = int(r, 2, 9), [ph, tex] = choose(r, [[0, '0'], [Math.PI / 3, '\\pi/3'], [Math.PI / 2, '\\pi/2'], [2 * Math.PI / 3, '2\\pi/3'], [Math.PI / 4, '\\pi/4']]);
        const A = Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(ph));
        return { q: `Two SHMs along one line, $x_1 = ${A1}\\sin\\omega t$ and $x_2 = ${A2}\\sin(\\omega t + ${tex})$ (in cm), are added. The resulting amplitude is ______ cm (to two decimal places).`,
          answer: round(A, 2), tol: 0.02, unit: 'cm', A1, A2, ph,
          sol: `$A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi = ${A1 * A1} + ${A2 * A2} + ${2 * A1 * A2}\\cos(${tex}) = ${round(A * A, 3)}$, so $A = ${round(A, 2)}$ cm.`,
          trap: 'Amplitudes add like arrows, not like numbers, unless the motions are in phase.' };
      },
      verify: (p) => Math.hypot(p.A1 + p.A2 * Math.cos(p.ph), p.A2 * Math.sin(p.ph)) },
    { id: 'spc-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'beats',
      make(r) {
        const f1 = int(r, 20, 400), df = int(r, 1, 8), t = int(r, 2, 15);
        return { q: `The motion $x = a\\sin(${2 * f1}\\pi t) + a\\sin(${2 * (f1 + df)}\\pi t)$ (with $t$ in seconds) is observed for $${t}$ s. The number of beats in that time is ______.`,
          answer: df * t, tol: 0, f1, df, t,
          sol: `The frequencies are $${f1}$ Hz and $${f1 + df}$ Hz, so the beat frequency is $${df}$ Hz and there are $${df}\\times${t} = ${df * t}$ beats.`,
          trap: 'Divide the coefficient of $t$ by $2\\pi$ to get a frequency in Hz.' };
      },
      verify: (p) => p.df * p.t },
    { id: 'spc-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'lissajous',
      make(r) {
        const [a, b] = choose(r, [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5]]);
        const fx = choose(r, [60, 100, 120, 150, 300, 600]);
        const fy = fx * a / b;
        return { q: `An oscilloscope shows a steady Lissajous figure. The horizontal input is $${fx}$ Hz. The figure touches the top edge of its box $${a}$ time${a > 1 ? 's' : ''} and a side edge $${b}$ time${b > 1 ? 's' : ''}. The vertical input frequency is ______ Hz (to one decimal place).`,
          answer: round(fy, 1), tol: 0.1, unit: 'Hz', a, b, fx,
          sol: `$f_y : f_x = (\\text{top touches}) : (\\text{side touches}) = ${a} : ${b}$, so $f_y = ${fx}\\times${a}/${b} = ${round(fy, 1)}$ Hz.`,
          trap: 'The top edge is touched by the vertical motion; do not invert the ratio.' };
      },
      verify: (p) => p.fx * p.a / p.b },
    { id: 'spc-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'coupled pendulums',
      make(r) {
        const L = pick(r, 0.4, 2, 0.1), m = pick(r, 0.1, 1, 0.1), k = pick(r, 0.2, 5, 0.1);
        const w = Math.sqrt(9.8 / L + 2 * k / m);
        return { q: `Two identical pendulums (length $${L}$ m, bob mass $${m}$ kg) are coupled at the bobs by a spring of constant $${k}$ N/m ($g = 9.8$ m/s²). The angular frequency of the out-of-step normal mode is ______ rad/s (to two decimal places).`,
          answer: round(w, 2), tol: 0.02, unit: 'rad/s', L, m, k,
          sol: `$\\omega_2^2 = g/L + 2k/m = ${round(9.8 / L, 4)} + ${round(2 * k / m, 4)} = ${round(w * w, 4)}$, so $\\omega_2 = ${round(w, 2)}$ rad/s.`,
          trap: 'The spring is stretched by twice each displacement: $2k/m$, not $k/m$.' };
      },
      verify: (p) => Math.sqrt(9.8 / p.L + 2 * p.k / p.m) },
    { id: 'spc-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'coupled pendulums',
      make(r) {
        const f1 = pick(r, 0.5, 3, 0.05), df = choose(r, [0.01, 0.02, 0.025, 0.04, 0.05, 0.1]);
        const t = 1 / (2 * df);
        return { q: `Two weakly coupled identical oscillators have normal-mode frequencies $${f1}$ Hz and $${round(f1 + df, 3)}$ Hz. One starts displaced, the other at rest. The time until all the energy is in the second oscillator is ______ s (to one decimal place).`,
          answer: round(t, 1), tol: 0.1, unit: 's', df,
          sol: `$t = \\pi/\\Delta\\omega = 1/(2\\Delta f) = 1/(2\\times${df}) = ${round(t, 1)}$ s.`,
          trap: 'The full beat period $1/\\Delta f$ is the round trip.' };
      },
      verify: (p) => 1 / (2 * p.df) },
    { id: 'spc-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'normal modes',
      make(r) {
        const m = pick(r, 0.2, 2, 0.1), k = int(r, 10, 100), kc = int(r, 5, 60);
        const w = Math.sqrt((k + 2 * kc) / m);
        return { q: `Two masses of $${m}$ kg are connected wall-spring-mass-spring-mass-spring-wall. The outer springs have $k = ${k}$ N/m and the middle spring $k' = ${kc}$ N/m. The higher normal-mode angular frequency is ______ rad/s (to two decimal places).`,
          answer: round(w, 2), tol: 0.02, unit: 'rad/s', m, k, kc,
          sol: `In the opposite mode the middle spring is stretched by $2x$: $\\omega^2 = (k + 2k')/m = (${k} + ${2 * kc})/${m} = ${round(w * w, 3)}$, so $\\omega = ${round(w, 2)}$ rad/s.`,
          trap: 'Writing $(k + k\')/m$ misses the factor 2 from the middle spring.' };
      },
      verify: (p) => Math.sqrt((p.k + 2 * p.kc) / p.m) },
    { id: 'spc-g07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'normal modes',
      make(r) {
        const m1 = pick(r, 0.5, 5, 0.5), m2 = pick(r, 0.5, 5, 0.5), k = int(r, 10, 200);
        const mu = m1 * m2 / (m1 + m2), w = Math.sqrt(k / mu);
        return { q: `Masses of $${m1}$ kg and $${m2}$ kg, joined by a spring of constant $${k}$ N/m, slide freely on a frictionless surface. The non-zero normal-mode angular frequency is ______ rad/s (to two decimal places).`,
          answer: round(w, 2), tol: 0.02, unit: 'rad/s', m1, m2, k,
          sol: `Reduced mass $\\mu = m_1m_2/(m_1 + m_2) = ${round(mu, 4)}$ kg; $\\omega = \\sqrt{k/\\mu} = ${round(w, 2)}$ rad/s. The other mode (free sliding) has $\\omega = 0$.`,
          trap: 'Using the total mass or one mass instead of the reduced mass.' };
      },
      verify: (p) => Math.sqrt(p.k * (p.m1 + p.m2) / (p.m1 * p.m2)) },
    { id: 'spc-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'lissajous',
      make(r) {
        const cases = [
          ['0', 'the straight line $y = x$'], ['\\pi', 'the straight line $y = -x$'], ['\\pi/2', 'a circle'],
          ['\\pi/4', 'an ellipse with its major axis along $y = x$'], ['3\\pi/4', 'an ellipse with its major axis along $y = -x$'],
        ];
        const [ph, right] = choose(r, cases);
        const o = mcqOptions(r, right, cases.map((c) => c[1]).filter((s) => s !== right), (s) => s);
        return { q: `A particle moves with $x = A\\sin\\omega t$ and $y = A\\sin(\\omega t + ${ph})$. Its path is`, ...o,
          sol: `Eliminating $t$: $x^2 + y^2 - 2xy\\cos\\phi = A^2\\sin^2\\phi$. With $\\phi = ${ph}$ this is ${right}. (Lines at $0$ and $\\pi$, a circle at $\\pi/2$, ellipses along $y = x$ for $0 < \\phi < \\pi/2$ and along $y = -x$ for $\\pi/2 < \\phi < \\pi$.)`,
          trap: 'Check which diagonal: the sign of $\\cos\\phi$ decides it.' };
      } },
    ...r4.gens,
  ],
};
