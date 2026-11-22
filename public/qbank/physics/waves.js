// Waves: travelling waves and the wave equation, wave speed on strings, energy and power, reflection and
// transmission at a junction (impedance), standing waves and the modes of strings, d'Alembert's solution,
// dispersion relations, phase and group velocity, wave packets. Original questions for IIT JAM, GATE and CSIR NET
// practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

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
  topic: 'waves',
  items: [
    // ---------- level 1 ----------
    { id: 'wav-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'travelling waves',
      q: 'A wave on a string is $y = 0.02\\sin(4x - 200t)$ in SI units. It travels',
      options: ['at $50$ m/s along $-x$', 'at $50$ m/s along $+x$', 'at $800$ m/s along $+x$', 'at $0.02$ m/s along $+x$'], answer: 1,
      sol: 'Compare with $A\\sin(kx - \\omega t)$: $k = 4$ rad/m, $\\omega = 200$ rad/s. The speed is $\\omega/k = 50$ m/s. A minus sign between the $x$ and $t$ terms means motion towards $+x$ (a crest at $4x - 200t = $ constant moves to larger $x$ as $t$ grows).',
      trap: 'Multiplying $\\omega$ by $k$ gives 800; the speed is their ratio.' },
    { id: 'wav-002', type: 'nat', level: 1, exams: ['jam'], sub: 'wave speed', unit: 'm/s',
      q: 'A string with mass per unit length $0.01$ kg/m is held at a tension of $100$ N. The speed of transverse waves on it is ______ m/s.',
      answer: 100, tol: 0, calc: () => Math.sqrt(100 / 0.01),
      sol: '$v = \\sqrt{T/\\mu} = \\sqrt{100/0.01} = \\sqrt{10^4} = 100$ m/s.',
      trap: 'Forgetting the square root gives $10^4$.' },
    { id: 'wav-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'wave equation',
      q: 'Which of these is NOT a solution of the wave equation $\\dfrac{\\partial^2y}{\\partial x^2} = \\dfrac{1}{v^2}\\dfrac{\\partial^2y}{\\partial t^2}$?',
      options: ['$A\\sin(kx)\\cos(kvt)$', '$Ae^{-(x - vt)^2}$', '$A\\sin(kx - kvt) + B\\sin(kx + kvt)$', '$Ae^{-x^2 - v^2t^2}$'], answer: 3,
      sol: 'Every function of $x - vt$ or $x + vt$, and every sum of such functions, is a solution (d\'Alembert). $\\sin kx\\cos kvt = \\tfrac12[\\sin k(x - vt) + \\sin k(x + vt)]$ qualifies. But $e^{-x^2}e^{-v^2t^2}$ is not a function of $x \\pm vt$: $y_{xx} = (4x^2 - 2)y$ while $y_{tt}/v^2 = (4v^2t^2 - 2)y$, which differ.',
      trap: 'Thinking that having both $x$ and $vt$ in it is enough; they must appear in the combination $x \\pm vt$.' },
    { id: 'wav-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'standing waves',
      q: 'In a standing wave of wavelength $\\lambda$, the distance between two neighbouring nodes is',
      options: ['$\\lambda/4$', '$\\lambda$', '$\\lambda/2$', '$2\\lambda$'], answer: 2,
      sol: '$y = 2A\\sin kx\\cos\\omega t$ is zero where $kx = n\\pi$, i.e. $x = n\\lambda/2$. Neighbouring nodes are $\\lambda/2$ apart; a node and the next antinode are $\\lambda/4$ apart.' },
    { id: 'wav-005', type: 'nat', level: 1, exams: ['jam'], sub: 'modes of a string', unit: 'Hz',
      q: 'A string $0.5$ m long, fixed at both ends, carries waves at $200$ m/s. Its fundamental frequency is ______ Hz.',
      answer: 200, tol: 0, calc: () => 200 / (2 * 0.5),
      sol: 'The fundamental has one loop: $L = \\lambda/2$, so $\\lambda = 1$ m and $f = v/\\lambda = 200/1 = 200$ Hz.',
      trap: 'Using $\\lambda = L$ gives 400 Hz, the second harmonic.' },
    { id: 'wav-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'reflection',
      q: 'A pulse on a string reaches an end that is rigidly fixed. The reflected pulse is',
      options: ['upright, with no phase change', 'completely absorbed by the support', 'shifted in phase by $\\pi/2$', 'inverted (a phase change of $\\pi$)'], answer: 3,
      sol: 'The fixed end cannot move, so the reflected wave must cancel the incident one there at every instant: it comes back upside down, a phase change of $\\pi$. A free end (a ring sliding on a smooth rod) reflects the pulse upright.' },

    // ---------- level 2 ----------
    { id: 'wav-007', type: 'nat', level: 2, exams: ['jam'], sub: 'travelling waves', unit: 'm/s',
      q: 'A wave is $y = 0.05\\sin\\left[2\\pi\\left(\\dfrac{x}{0.4} - \\dfrac{t}{0.01}\\right)\\right]$ in SI units. The maximum speed of a particle of the medium is ______ m/s (to one decimal place).',
      answer: 31.4, tol: 0.2, calc: () => 0.05 * 2 * Math.PI / 0.01,
      sol: 'The period is $0.01$ s, so $\\omega = 2\\pi/0.01 = 628.3$ rad/s. Maximum particle speed $= A\\omega = 0.05\\times628.3 = 31.4$ m/s. (The wave itself moves at $\\lambda/T = 0.4/0.01 = 40$ m/s, a different thing.)',
      trap: 'Giving the wave speed (40 m/s) instead of the particle speed.' },
    { id: 'wav-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'group velocity',
      q: 'Waves on deep water obey $\\omega^2 = gk$. Their group velocity is',
      options: ['twice the phase velocity', 'equal to the phase velocity', 'half the phase velocity', '$1/\\sqrt2$ of the phase velocity'], answer: 2,
      sol: '$\\omega = \\sqrt{gk}$. Phase velocity $v_p = \\omega/k = \\sqrt{g/k}$. Group velocity $v_g = d\\omega/dk = \\tfrac12\\sqrt{g/k} = v_p/2$. Individual crests run forward through a group and vanish at its front.' },
    { id: 'wav-009', type: 'msq', level: 2, exams: ['jam'], sub: 'standing waves', format: 'statements',
      q: 'For the standing wave $y = 2A\\sin kx\\cos\\omega t$, which statements are correct?',
      options: ['All points between two neighbouring nodes move in phase.', 'Energy is carried steadily along the string.', 'Nodes are $\\lambda/2$ apart.', 'The amplitude at an antinode is $2A$.'], answer: [0, 2, 3],
      sol: 'Between two nodes $\\sin kx$ has one sign, so all those points reach their maxima together (in phase); the next segment moves exactly opposite. Nodes are at $kx = n\\pi$, $\\lambda/2$ apart, and the largest amplitude is $2A$. The two travelling waves carry equal energy in opposite directions, so the net flow averages to zero.' },
    { id: 'wav-010', type: 'nat', level: 2, exams: ['jam'], sub: 'modes of a string', unit: 'Hz',
      q: 'A string fixed at both ends resonates at $420$ Hz and at $490$ Hz, with no resonance in between. Its fundamental frequency is ______ Hz.',
      answer: 70, tol: 0, calc: () => 490 - 420,
      sol: 'Resonances of a string fixed at both ends are $nf_1$. Neighbouring ones differ by $f_1$: $f_1 = 490 - 420 = 70$ Hz ($420 = 6\\times70$, $490 = 7\\times70$).',
      trap: 'Taking 420 Hz as the fundamental.' },
    { id: 'wav-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'modes of a string',
      q: 'The tension in a guitar string is made four times larger, with nothing else changed. Its fundamental frequency',
      options: ['halves', 'doubles', 'becomes four times larger', 'stays the same'], answer: 1,
      sol: '$f_1 = \\dfrac{1}{2L}\\sqrt{T/\\mu}$, so $f_1 \\propto \\sqrt T$. Four times the tension doubles the frequency (one octave up).' },
    { id: 'wav-012', type: 'nat', level: 2, exams: ['jam'], sub: 'energy and power', unit: 'W',
      q: 'A string of mass per unit length $0.04$ kg/m under tension $64$ N carries a sine wave of amplitude $1.0$ cm and frequency $50$ Hz. The average power carried is ______ W (to two decimal places).',
      answer: 7.90, tol: 0.08, calc: () => 0.5 * 0.04 * (100 * Math.PI) ** 2 * 1e-4 * Math.sqrt(64 / 0.04),
      sol: '$v = \\sqrt{64/0.04} = 40$ m/s, $\\omega = 2\\pi\\times50 = 314.2$ rad/s. $P = \\tfrac12\\mu\\omega^2A^2v = \\tfrac12(0.04)(314.2)^2(10^{-4})(40) = 7.90$ W.',
      trap: 'Using $f$ instead of $\\omega$ in $\\omega^2$ makes the power $4\\pi^2$ times too small.' },
    { id: 'wav-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'travelling waves',
      q: 'Two points on a wave of wavelength $1.0$ m are $25$ cm apart along the direction of travel. The phase difference between their motions is',
      options: ['$\\pi/4$', '$\\pi$', '$\\pi/2$', '$2\\pi$'], answer: 2,
      sol: 'Phase difference $= k\\Delta x = (2\\pi/\\lambda)\\Delta x = 2\\pi(0.25/1.0) = \\pi/2$.' },
    { id: 'wav-014', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'group velocity',
      q: 'Electromagnetic waves in a plasma obey $\\omega^2 = \\omega_p^2 + c^2k^2$. Which relation holds for $\\omega > \\omega_p$?',
      options: ['$v_pv_g = c^2$', '$v_p = v_g = c$', '$v_g > c$', '$v_p < c$'], answer: 0,
      sol: 'Differentiate: $2\\omega\\,d\\omega = 2c^2k\\,dk$, so $v_g = d\\omega/dk = c^2k/\\omega = c^2/v_p$, i.e. $v_pv_g = c^2$. Since $\\omega/k > c$, the phase velocity exceeds $c$ and the group velocity (which carries the signal) is below $c$.',
      trap: 'A phase velocity above $c$ breaks no law: no energy or information travels at $v_p$.' },
    { id: 'wav-015', type: 'msq', level: 2, exams: ['jam'], sub: 'dispersion', format: 'multi',
      q: 'Which dispersion relations describe dispersive waves (phase velocity depending on wavenumber)?',
      options: ['$\\omega = ck$', '$\\omega^2 = gk$', '$\\omega^2 = \\omega_p^2 + c^2k^2$', '$\\omega = Dk^2$'], answer: [1, 2, 3],
      sol: '$v_p = \\omega/k$. For $\\omega = ck$ it is the constant $c$: no dispersion. The others give $\\sqrt{g/k}$, $\\sqrt{c^2 + \\omega_p^2/k^2}$ and $Dk$, all depending on $k$.' },
    { id: 'wav-016', type: 'nat', level: 2, exams: ['jam'], sub: 'modes of a string', unit: 'Hz',
      q: 'A string $1.2$ m long, fixed at both ends, has mass per unit length $0.01$ kg/m and tension $90$ N. The frequency of its third harmonic is ______ Hz (to the nearest whole number).',
      answer: 119, tol: 1, calc: () => 3 * Math.sqrt(90 / 0.01) / (2 * 1.2),
      sol: '$v = \\sqrt{90/0.01} = 94.87$ m/s. $f_3 = 3v/(2L) = 3(94.87)/2.4 = 118.6$ Hz, about 119 Hz.' },

    // ---------- level 3 ----------
    { id: 'wav-017', type: 'nat', level: 3, exams: ['jam'], sub: 'reflection',
      q: 'A string of mass per unit length $\\mu$ is joined to a second string of $4\\mu$, under the same tension. A wave travels from the lighter string towards the joint. The fraction of the incident power that is reflected is ______ (to two decimal places).',
      answer: 0.11, tol: 0.005, calc: () => ((1 - 2) / (1 + 2)) ** 2,
      sol: 'The impedance is $Z = \\sqrt{T\\mu}$, so $Z_2 = 2Z_1$. Amplitude reflection $r = (Z_1 - Z_2)/(Z_1 + Z_2) = -1/3$. Reflected power fraction $= r^2 = 1/9 = 0.11$ (the rest, $8/9$, goes on).',
      trap: 'Using the ratio of the $\\mu$ values instead of their square roots gives $r = -3/5$.' },
    { id: 'wav-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'reflection',
      q: 'A pulse of height $A$ runs along a light string into a heavier one with four times its mass per unit length (same tension). Just after the joint,',
      options: ['the reflected pulse is upright with height $A/3$', 'the reflected pulse is inverted with height $2A/3$', 'the transmitted pulse has height $4A/3$', 'the reflected pulse is inverted with height $A/3$ and the transmitted one upright with height $2A/3$'], answer: 3,
      sol: '$Z_2 = 2Z_1$. Reflected: $r = (Z_1 - Z_2)/(Z_1 + Z_2) = -1/3$, inverted, height $A/3$. Transmitted: $t = 2Z_1/(Z_1 + Z_2) = 2/3$, upright. Check: $1 + r = t$ (the string is continuous at the joint).',
      trap: 'Going into a lighter string instead, the reflection is upright and the transmitted pulse is taller than $A$.' },
    { id: 'wav-019', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'group velocity', unit: 'm/s',
      q: 'Capillary ripples on water obey $\\omega^2 = (\\sigma/\\rho)k^3$ with $\\sigma = 0.072$ N/m and $\\rho = 1000$ kg/m³. For ripples of wavelength $1.0$ cm, the group velocity is ______ m/s (to two decimal places).',
      answer: 0.32, tol: 0.005, calc: () => 1.5 * Math.sqrt(0.072 / 1000 * (2 * Math.PI / 0.01)) ,
      sol: '$k = 2\\pi/0.01 = 628.3$ m$^{-1}$. $v_p = \\omega/k = \\sqrt{\\sigma k/\\rho} = \\sqrt{0.072\\times628.3/1000} = 0.213$ m/s. With $\\omega \\propto k^{3/2}$, $v_g = \\tfrac32v_p = 0.32$ m/s: groups run ahead of their crests.',
      trap: 'Using the deep-water result $v_g = v_p/2$, which holds for gravity waves, not ripples.' },
    { id: 'wav-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'group velocity',
      q: 'In a medium the phase velocity increases with wavelength ($dv_p/d\\lambda > 0$). Then',
      options: ['$v_g > v_p$', '$v_g = v_p$', '$v_g < v_p$', '$v_g = 0$'], answer: 2,
      sol: 'Rayleigh\'s relation: $v_g = v_p - \\lambda\\,\\dfrac{dv_p}{d\\lambda}$. A positive slope makes $v_g$ smaller than $v_p$. This is "normal dispersion", as for light in glass, where red (long $\\lambda$) travels faster than blue.' },
    { id: 'wav-021', type: 'msq', level: 3, exams: ['jam'], sub: 'standing waves', format: 'statements',
      q: 'Two waves $A\\sin(kx - \\omega t)$ and $A\\sin(kx + \\omega t)$ on a string add up. Which statements are correct?',
      options: ['There is a node at $x = 0$.', 'Points at $x = \\lambda/4$ and $x = 3\\lambda/4$ move in step.', 'At $\\omega t = \\pi/2$ the string is straight and every point is moving at its fastest.', 'At $\\omega t = 0$ all the energy is potential.'], answer: [0, 2, 3],
      sol: 'The sum is $2A\\sin kx\\cos\\omega t$. At $x = 0$, $\\sin kx = 0$: a node. At $\\lambda/4$ and $3\\lambda/4$, $\\sin kx = +1$ and $-1$: they move opposite. At $\\omega t = \\pi/2$ the displacement is zero everywhere (straight string) and the velocity $-2A\\omega\\sin kx\\sin\\omega t$ is largest. At $\\omega t = 0$ every point is at its extreme and momentarily still: all potential energy.',
      trap: 'Points in neighbouring loops are half a cycle apart, however far apart they are.' },
    { id: 'wav-022', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'group velocity',
      q: 'A medium has the dispersion relation $\\omega = 3k + 2k^3$ (in consistent units). At $k = 1$ the group velocity is ______.',
      answer: 9, tol: 0, calc: () => 3 + 6 * 1 ** 2,
      sol: '$v_g = d\\omega/dk = 3 + 6k^2 = 9$ at $k = 1$. (The phase velocity is $\\omega/k = 3 + 2k^2 = 5$.)',
      trap: 'Dividing $\\omega$ by $k$ gives the phase velocity, 5.' },
    { id: 'wav-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'modes of a string',
      q: 'A string has one end fixed and the other end attached to a massless ring that slides freely on a smooth vertical rod. The frequencies of its first three modes are in the ratio',
      options: ['$1 : 2 : 3$', '$1 : 3 : 5$', '$1 : 4 : 9$', '$2 : 3 : 4$'], answer: 1,
      sol: 'A fixed end is a node; a free end is an antinode. The string must hold an odd number of quarter wavelengths: $L = (2n - 1)\\lambda/4$, so $f = (2n - 1)v/(4L)$: only odd multiples, $1 : 3 : 5$.',
      trap: 'Using the both-ends-fixed result $1 : 2 : 3$.' },
    { id: 'wav-024', type: 'nat', level: 3, exams: ['jam'], sub: 'wave speed', unit: 's',
      q: 'A uniform rope $4.9$ m long hangs from the ceiling. A small transverse pulse starts at the bottom. The time it takes to reach the top is ______ s (to two decimal places; $g = 9.8$ m/s²).',
      answer: 1.41, tol: 0.01, calc: () => 2 * Math.sqrt(4.9 / 9.8),
      sol: 'At height $y$ above the bottom the tension supports the rope below: $T = \\mu gy$, so $v = \\sqrt{T/\\mu} = \\sqrt{gy}$. Time $= \\int_0^L dy/\\sqrt{gy} = 2\\sqrt{L/g} = 2\\sqrt{0.5} = 1.41$ s.',
      trap: 'Using one speed for the whole rope; the pulse speeds up as it climbs.' },
    { id: 'wav-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'travelling waves',
      q: 'A pulse is described by $y(x, t) = \\dfrac{4}{2 + (x + 3t)^2}$ in SI units. It moves',
      options: ['along $-x$ at $3$ m/s', 'along $+x$ at $3$ m/s', 'along $+x$ at $1/3$ m/s', 'along $-x$ at $9$ m/s'], answer: 0,
      sol: 'It is a function of $x + 3t$ only, so the shape keeps its form and its peak (at $x + 3t = 0$) sits at $x = -3t$: moving towards $-x$ at 3 m/s.',
      trap: 'A plus sign means motion towards $-x$.' },
    { id: 'wav-026', type: 'nat', level: 3, exams: ['jam'], sub: 'modes of a string', unit: 'N',
      q: 'A string driven at a fixed frequency vibrates in 4 loops when the tension is $10$ N. To make it vibrate in 2 loops at the same frequency, the tension must be ______ N.',
      answer: 40, tol: 0, calc: () => 10 * (4 / 2) ** 2,
      sol: '$f = \\dfrac{n}{2L}\\sqrt{T/\\mu}$. With $f$ fixed, $n\\sqrt T$ is constant, so $T \\propto 1/n^2$: $T = 10\\times(4/2)^2 = 40$ N.',
      trap: 'Thinking $T \\propto 1/n$ gives 20 N.' },
    { id: 'wav-027', type: 'msq', level: 3, exams: ['jam'], sub: 'energy and power', format: 'statements',
      q: 'For a sine wave travelling along a stretched string, which statements are correct?',
      options: ['The energy per unit length is proportional to $A^2\\omega^2$.', 'The power carried equals the energy per unit length times the wave speed.', 'A piece of string at a crest has, at that instant, neither kinetic nor potential energy.', 'A piece passing through equilibrium has its largest kinetic energy and zero potential energy.'], answer: [0, 1, 2],
      sol: 'Average energy per length $\\tfrac12\\mu\\omega^2A^2$, and power $= $ that $\\times v$. The potential energy density is $\\tfrac12T(\\partial y/\\partial x)^2$, which depends on the stretch (slope), not on height. At a crest the slope is zero and the piece is still: no energy. Passing through equilibrium the slope is steepest and the speed largest: both energies are largest there, unlike a mass on a spring.',
      trap: 'Applying the spring picture (KE and PE swap) to a travelling wave: in a wave they rise and fall together.' },
    { id: 'wav-028', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'wave packets',
      q: 'A wave packet is confined to a region of length $\\Delta x$. The spread of wavenumbers $\\Delta k$ it must contain is of the order of',
      options: ['$\\Delta x$', '$(\\Delta x)^2$', 'a value independent of $\\Delta x$', '$1/\\Delta x$'], answer: 3,
      sol: 'Building a short packet from sine waves needs a band of wavenumbers whose phases agree only over $\\Delta x$: $\\Delta x\\,\\Delta k \\gtrsim 1$ (about $2\\pi$ depending on how widths are defined). Multiplied by $\\hbar$ this is the uncertainty principle.' },

    // ---------- level 4 ----------
    { id: 'wav-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'group velocity',
      q: 'A signal at angular frequency $\\omega = 2\\omega_p$ travels through a plasma with $\\omega^2 = \\omega_p^2 + c^2k^2$. Its group velocity as a fraction of $c$ is ______ (to three decimal places).',
      answer: 0.866, tol: 0.003, calc: () => Math.sqrt(1 - 1 / 4),
      sol: '$ck = \\sqrt{\\omega^2 - \\omega_p^2}$, so $v_g = c^2k/\\omega = c\\sqrt{1 - \\omega_p^2/\\omega^2} = c\\sqrt{1 - 1/4} = 0.866c$. The phase velocity is $c/0.866 = 1.155c$.',
      trap: 'Giving the phase velocity, which is above $c$.' },
    { id: 'wav-030', type: 'mcq', level: 4, exams: ['jam'], sub: 'dispersion',
      q: 'Water waves obey $\\omega^2 = gk\\tanh(kh)$ in water of depth $h$. A tsunami has a wavelength of hundreds of kilometres in an ocean $4000$ m deep. It travels at about',
      options: ['$200$ m/s', '$20$ m/s', '$2000$ m/s', 'a speed that depends on wavelength only, not on depth'], answer: 0,
      sol: 'For $kh \\ll 1$, $\\tanh kh \\approx kh$, so $\\omega^2 = ghk^2$: non-dispersive with $v = \\sqrt{gh} = \\sqrt{9.8\\times4000} = 198$ m/s, about 700 km/h.',
      trap: 'Using the deep-water formula $\\sqrt{g/k}$, which applies only when the wavelength is much shorter than the depth.' },
    { id: 'wav-031', type: 'nat', level: 4, exams: ['jam'], sub: 'reflection',
      q: 'Two strings with mass per unit length $0.01$ kg/m and $0.09$ kg/m are joined and stretched with the same tension. A wave comes from the lighter string. The fraction of the incident power transmitted is ______.',
      answer: 0.75, tol: 0.005, calc: () => 3 * (2 / 4) ** 2,
      sol: '$Z_2/Z_1 = \\sqrt{0.09/0.01} = 3$. $t = 2Z_1/(Z_1 + Z_2) = 1/2$, $r = (1 - 3)/4 = -1/2$. Power goes as $Z\\times$ amplitude²: transmitted fraction $= (Z_2/Z_1)t^2 = 3/4$. Check: $r^2 + 3/4 = 1/4 + 3/4 = 1$.',
      trap: 'Taking $t^2 = 1/4$ as the transmitted power forgets that the second string has a different impedance.' },
    { id: 'wav-032', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'dispersion', format: 'statements',
      q: 'A chain of masses $m$ joined by springs $K$ with spacing $a$ has $\\omega = 2\\sqrt{K/m}\\,|\\sin(ka/2)|$. Which statements are correct?',
      options: ['The group velocity is zero at $k = \\pi/a$.', 'For long waves ($ka \\ll 1$) the chain is non-dispersive with speed $a\\sqrt{K/m}$.', 'Phase and group velocity are equal for every $k$.', 'No wave above $\\omega = 2\\sqrt{K/m}$ can travel along the chain.'], answer: [0, 1, 3],
      sol: '$v_g = a\\sqrt{K/m}\\cos(ka/2)$, zero at $ka = \\pi$ (neighbours move exactly opposite: a standing wave). For small $k$, $\\omega \\approx a\\sqrt{K/m}\\,k$: constant speed. Away from small $k$, $v_p = \\omega/k$ and $v_g$ differ. The largest $\\omega$ is $2\\sqrt{K/m}$; higher frequencies give evanescent (decaying) motion.' },
    { id: 'wav-033', type: 'mcq', level: 4, exams: ['jam'], sub: 'standing waves',
      q: 'Two waves of the same frequency but unequal amplitudes $A_1 > A_2$ travel in opposite directions on a string. The resulting pattern',
      options: ['is a perfect standing wave with nodes of zero amplitude', 'carries no net energy', 'has amplitude varying between $A_1 + A_2$ and $A_1 - A_2$ along the string, and carries a net energy flow', 'is a travelling wave of amplitude $A_1 - A_2$ only'], answer: 2,
      sol: 'Where the two arrive in phase the amplitude is $A_1 + A_2$, where out of phase $A_1 - A_2 \\ne 0$: there are no true nodes. It can be written as a standing wave of amplitude $2A_2$ plus a travelling wave of amplitude $A_1 - A_2$, which carries energy in the direction of the bigger wave. The ratio $(A_1 + A_2)/(A_1 - A_2)$ is the standing-wave ratio used for transmission lines.' },
    { id: 'wav-034', type: 'nat', level: 4, exams: ['jam'], sub: 'modes of a string',
      q: 'A string fixed at both ends is plucked at a point one quarter of its length from one end and released. The lowest harmonic number that is completely absent from its sound is ______.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'The plucked point moves the most, so a harmonic with a node there cannot be excited. Harmonic $n$ has nodes at $x = jL/n$. A node at $L/4$ needs $n$ to be a multiple of 4. (In detail the amplitude of harmonic $n$ is proportional to $\\sin(n\\pi/4)/n^2$.) So harmonics 4, 8, 12, ... are missing; the lowest is 4.',
      trap: 'Answering 2: harmonic 2 has its node at $L/2$, not at $L/4$.' },
    { id: 'wav-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'group velocity',
      q: 'Measurements in a medium give $\\omega = 2.00$ rad/s at $k = 1.00$ rad/m and $\\omega = 2.06$ rad/s at $k = 1.02$ rad/m. Near $k = 1$ the group and phase velocities are about',
      options: ['$v_g = 3$ m/s, $v_p = 2$ m/s', '$v_g = 2$ m/s, $v_p = 3$ m/s', '$v_g = 2.06$ m/s, $v_p = 2$ m/s', '$v_g = 1.5$ m/s, $v_p = 2$ m/s'], answer: 0,
      sol: '$v_g \\approx \\Delta\\omega/\\Delta k = 0.06/0.02 = 3$ m/s. $v_p = \\omega/k = 2.00/1.00 = 2$ m/s. Here groups outrun crests (anomalous dispersion).' },
    { id: 'wav-036', type: 'nat', level: 4, exams: ['jam'], sub: 'group velocity', unit: 'm/s',
      q: 'Two waves $A\\cos(10x - 100t)$ and $A\\cos(11x - 120t)$ (SI) are superposed. The speed of the beat envelope is ______ m/s.',
      answer: 20, tol: 0, calc: () => (120 - 100) / (11 - 10),
      sol: 'The sum is $2A\\cos\\left(\\frac{\\Delta k}{2}x - \\frac{\\Delta\\omega}{2}t\\right)\\cos(\\bar kx - \\bar\\omega t)$. The envelope moves at $\\Delta\\omega/\\Delta k = 20/1 = 20$ m/s (the group velocity); the carrier moves at $\\bar\\omega/\\bar k = 110/10.5 = 10.5$ m/s.',
      trap: 'Using $\\bar\\omega/\\bar k$ gives the carrier (phase) speed.' },

    // ---------- level 5 ----------
    { id: 'wav-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'A stiff string obeys $\\omega^2 = (T/\\mu)k^2 + \\alpha k^4$ with $T/\\mu = 100$ m²/s² and $\\alpha = 1$ m⁴/s². At $k = 10$ m$^{-1}$ the ratio $v_g/v_p$ is ______ (to two decimal places).',
      answer: 1.5, tol: 0.01, calc: () => { const k = 10, w = Math.sqrt(100 * k * k + k ** 4); return ((200 * k + 4 * k ** 3) / (2 * w)) / (w / k); },
      sol: '$\\omega^2 = 10^4 + 10^4 = 2\\times10^4$, $\\omega = 141.4$ rad/s, $v_p = 14.14$ m/s. $2\\omega\\,d\\omega/dk = 2(T/\\mu)k + 4\\alpha k^3 = 2000 + 4000$, so $v_g = 6000/282.8 = 21.21$ m/s. Ratio $= 1.50$. In general $v_gv_p = T/\\mu + 2\\alpha k^2$, so $v_g/v_p = (T/\\mu + 2\\alpha k^2)/(T/\\mu + \\alpha k^2) = 300/200$.',
      trap: 'Differentiating $\\omega^2$ and forgetting to divide by $2\\omega$.' },
    { id: 'wav-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'reflection',
      q: 'A small bead of mass $M = 0.01$ kg is fixed on a long string with impedance $Z = \\sqrt{T\\mu} = 10$ kg/s. A wave of angular frequency $2000$ rad/s hits the bead. The fraction of the incident power reflected is ______ (to two decimal places).',
      answer: 0.5, tol: 0.01, calc: () => { const q = 0.01 * 2000 / (2 * 10); return q * q / (1 + q * q); },
      sol: 'Continuity: $1 + r = t$. Newton for the bead: $-M\\omega^2t = T(ikt - ik(1 - r))$. With $kT = \\omega Z$ this gives $t = 1/(1 - iq)$ with $q = M\\omega/(2Z) = 0.01\\times2000/20 = 1$. Then $|t|^2 = 1/(1 + q^2) = 1/2$ and the reflected fraction is $q^2/(1 + q^2) = 0.50$. Heavier beads or higher frequencies reflect more.',
      trap: 'Expecting a point mass on a uniform string to let everything through; its inertia reflects more at high frequency.' },
    { id: 'wav-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'wave packets',
      q: 'A wave packet moves in a medium with $\\omega = \\alpha k^2$ (as for a free quantum particle). Which is correct?',
      options: ['$v_g = v_p$ and the packet keeps its shape', '$v_g = 2v_p$ and the packet spreads as it moves', '$v_g = v_p/2$ and the packet spreads', '$v_g = 2v_p$ and the packet keeps its shape'], answer: 1,
      sol: '$v_p = \\alpha k$, $v_g = 2\\alpha k = 2v_p$. Because $d^2\\omega/dk^2 = 2\\alpha \\ne 0$, different parts of the packet travel at different group speeds, so it spreads. For a particle $\\alpha = \\hbar/2m$ and $v_g = \\hbar k/m$, the classical velocity.',
      trap: 'Any dispersion relation with nonzero curvature spreads a packet; $v_g = 2v_p$ alone does not say it keeps its shape.' },
    { id: 'wav-040', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'wave equation', format: 'statements',
      q: 'A long string is released from rest with an initial shape $f(x)$. Which statements are correct?',
      options: ['The shape splits into two copies of half the height running in opposite directions.', 'If instead the string starts straight with initial velocity $g(x)$, then $y = \\dfrac1{2v}\\displaystyle\\int_{x - vt}^{x + vt}g(s)\\,ds$.', 'When one copy reaches a fixed end it comes back inverted.', 'On a string of length $L$ fixed at both ends, the starting shape first reappears after a time $L/v$.'], answer: [0, 1, 2],
      sol: 'D\'Alembert: $y = \\tfrac12[f(x - vt) + f(x + vt)] + \\frac{1}{2v}\\int_{x - vt}^{x + vt}g\\,ds$, which gives the first two. A fixed end inverts a pulse. With both ends fixed every mode has a frequency that is a multiple of $v/2L$, so the motion repeats after $2L/v$, not $L/v$ (after $L/v$ the shape is inverted and mirrored).',
      trap: 'Forgetting that each copy must make a round trip and be inverted twice to come back as it started.' },
  ],
  gens: [
    { id: 'wav-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'travelling waves',
      make(r) {
        const k = Q5.int(r, 1, 6), w = k * Q5.int(r, 2, 20), v = w / k;
        const [f, plus, why] = Q5.choose(r, [
          [`${0.02}\\sin(${k}x - ${w}t)`, true, 'the phase $kx - \\omega t$ stays constant when $x$ grows with $t$'],
          [`${0.02}\\sin(${w}t + ${k}x)`, false, 'the phase $\\omega t + kx$ stays constant only if $x$ falls as $t$ grows'],
          [`${0.02}\\cos(${w}t - ${k}x)`, true, '$\\cos(\\omega t - kx) = \\cos(kx - \\omega t)$, whose phase is constant for $x$ growing with $t$'],
          [`-${0.02}\\sin(${w}t - ${k}x)`, true, '$-\\sin(\\omega t - kx) = \\sin(kx - \\omega t)$'],
          [`${0.02}\\cos(${k}x + ${w}t)`, false, 'the phase $kx + \\omega t$ stays constant only if $x$ falls as $t$ grows']]);
        const s = (dir, sp) => `along $${dir}x$ at $${sp}$ m/s`;
        const kw = Q5.round(k / w, 3);
        const o = Q5.mcqOptions(r, s(plus ? '+' : '-', v), [s(plus ? '-' : '+', v), s(plus ? '+' : '-', kw), s(plus ? '-' : '+', kw)]);
        return { q: `A wave on a string is $y = ${f}$ (SI units). It travels`, ...o,
          sol: `The speed is $\\omega/k = ${w}/${k} = ${v}$ m/s. Direction: ${why}, so it moves along $${plus ? '+' : '-'}x$.`,
          trap: 'Speed is $\\omega/k$, not $k/\\omega$; and look at the relative sign of the $x$ and $t$ terms, not their order.' };
      } },
    { id: 'wav-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'standing waves', format: 'statements',
      make(r) {
        const n = Q5.int(r, 2, 6), L = Q5.pick(r, 1, 3, 0.5), th = `${n}${['', 'st', 'nd', 'rd'][n] || 'th'}`;
        const R = (x) => Q5.round(x, 3);
        const T = [`There are $${n + 1}$ nodes, counting the two fixed ends.`, `There are $${n}$ antinodes.`, `The wavelength is $${R(2 * L / n)}$ m.`,
          `Neighbouring nodes are $${R(L / n)}$ m apart.`, 'All points between two neighbouring nodes move in phase.', 'On average no energy is carried along the string.'];
        const F = [`There are $${n}$ nodes, counting the two fixed ends.`, `There are $${n + 1}$ antinodes.`, `The wavelength is $${R(L / n)}$ m.`,
          `Neighbouring nodes are $${R(2 * L / n)}$ m apart.`, 'Points on opposite sides of a node move in phase.', 'Every point of the string vibrates with the same amplitude.'];
        const o = q5msq(r, T, F);
        return { q: `A string $${L}$ m long, fixed at both ends, vibrates in its ${th} harmonic. Which statements are correct?`, ...o,
          sol: `In the ${th} harmonic the string holds $${n}$ half-wavelengths: $\\lambda = 2L/n = ${R(2 * L / n)}$ m, nodes $\\lambda/2 = ${R(L / n)}$ m apart, $${n + 1}$ nodes including the ends and $${n}$ antinodes. In a standing wave every point between two nodes moves in phase, the two sides of a node are in antiphase, the amplitude varies as $|\\sin kx|$, and the two travelling waves carry equal and opposite energy flows.`,
          trap: 'Nodes are half a wavelength apart, not a whole one.' };
      } },
    { id: 'wav-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'travelling waves', unit: 'm',
      make(r) {
        const w = Q5.int(r, 50, 500), A = Q5.pick(r, 0.001, 0.01, 0.001), v = Q5.int(r, 10, 200);
        const vp = Q5.round(A * w, 4), ap = Q5.round(A * w * w, 3);
        const lam = 2 * Math.PI * v * vp / ap;
        return { q: `A sinusoidal wave travels at $${v}$ m/s along a string. The largest transverse speed of any bit of string is $${vp}$ m/s and the largest transverse acceleration is $${ap}$ m/s$^2$. The wavelength is ______ m (to three significant figures).`,
          answer: +lam.toPrecision(3), tol: +(0.006 * lam).toPrecision(2), v, vp, ap,
          sol: `Each bit of string does SHM with $v_{\\max} = A\\omega$ and $a_{\\max} = A\\omega^2$. Dividing, $\\omega = a_{\\max}/v_{\\max} = ${Q5.round(ap / vp, 2)}$ rad/s. Then $k = \\omega/v$ and $\\lambda = 2\\pi v/\\omega = ${+lam.toPrecision(3)}$ m.`,
          trap: 'The transverse particle speed is not the wave speed; it only gives $A\\omega$.' };
      },
      verify: (p) => { const A = p.vp * p.vp / p.ap; const w = Math.sqrt(p.ap / A); return 2 * Math.PI * p.v / w; } },
    { id: 'wav-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'wave speed', format: 'dimensions',
      make(r) {
        const [what, ok, bad] = Q5.choose(r, [
          ['transverse waves on a string of tension $T$ and mass per unit length $\\mu$', '\\sqrt{T/\\mu}', ['\\sqrt{T\\mu}', 'T/\\mu', '\\sqrt{\\mu/T}']],
          ['longitudinal waves in a rod of Young modulus $Y$ and density $\\rho$', '\\sqrt{Y/\\rho}', ['\\sqrt{Y\\rho}', 'Y/\\rho', '\\sqrt{\\rho/Y}']],
          ['deep-water gravity waves of wavelength $\\lambda$ (with $g$)', '\\sqrt{g\\lambda/2\\pi}', ['\\sqrt{g/2\\pi\\lambda}', 'g\\lambda/2\\pi', '\\sqrt{2\\pi\\lambda/g}']],
          ['short ripples ruled by surface tension $\\sigma$, on a liquid of density $\\rho$, of wavelength $\\lambda$', '\\sqrt{2\\pi\\sigma/\\rho\\lambda}', ['\\sqrt{2\\pi\\sigma\\lambda/\\rho}', '\\sqrt{2\\pi\\sigma/\\rho}', '2\\pi\\sigma/\\rho\\lambda']],
          ['sound in a gas of pressure $P$, density $\\rho$ and adiabatic index $\\gamma$', '\\sqrt{\\gamma P/\\rho}', ['\\sqrt{\\gamma\\rho/P}', '\\gamma P/\\rho', '\\sqrt{\\gamma P\\rho}']]]);
        const o = Q5.mcqOptions(r, ok, bad, (s) => `$v = ${s}$`);
        return { q: `On dimensional grounds alone, which expression could give the speed of ${what}?`, ...o,
          sol: `Only $${ok}$ has the dimensions of speed, $\\mathrm{L\\,T^{-1}}$. (Tension/$\\mu$, modulus/density, pressure/density and $g\\lambda$ all have dimensions $\\mathrm{L^2T^{-2}}$, as does $\\sigma/(\\rho\\lambda)$; their square roots are speeds.) Dimensionless numbers such as $2\\pi$ or $\\gamma$ cannot be fixed this way.`,
          trap: 'An expression without the square root has dimensions of speed squared.' };
      } },
    { id: 'wav-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'energy and power', format: 'comparison',
      make(r) {
        const [fa, sa] = Q5.choose(r, [[2, '2'], [3, '3'], [0.5, '1/2'], [1.5, '1.5']]), [ff, sf] = Q5.choose(r, [[2, '2'], [0.5, '1/2'], [3, '3'], [1.5, '1.5'], [1, '1']]), [fT, sT] = Q5.choose(r, [[4, '4'], [9, '9'], [0.25, '1/4'], [1, '1'], [2, '2']]);
        const k = fa * fa * ff * ff * Math.sqrt(fT);
        return { q: `A sine wave runs along a stretched string. The amplitude is multiplied by $${sa}$, the frequency by $${sf}$ and the tension by $${sT}$ (same string). The average power carried is multiplied by ______ (to three decimal places).`,
          answer: Q5.round(k, 3), tol: Math.max(0.001, Q5.round(0.002 * k, 4)), fa, ff, fT,
          sol: `$\\bar P = \\tfrac12\\mu v\\omega^2A^2$ with $v = \\sqrt{T/\\mu}$, so $\\bar P = \\tfrac12\\sqrt{T\\mu}\\,\\omega^2A^2$. The factor is $(${sa})^2\\times(${sf})^2\\times\\sqrt{${sT}} = ${Q5.round(k, 3)}$.`,
          trap: 'Tension enters through the wave speed, as a square root.' };
      },
      verify: (p) => { const P = (mu, T, w, A) => 0.5 * mu * Math.sqrt(T / mu) * w * w * A * A; return P(0.01, 50 * p.fT, 300 * p.ff, 0.002 * p.fa) / P(0.01, 50, 300, 0.002); } },
    { id: 'wav-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'travelling waves',
      make(r) {
        const k = choose(r, [0.5, 1, 2, 2.5, 4, 5, 8, 10]), w = choose(r, [10, 20, 40, 50, 100, 200, 300, 400]);
        return { q: `A wave is $y = 0.01\\sin(${k}x - ${w}t)$ in SI units. Its speed is ______ m/s (to one decimal place).`,
          answer: round(w / k, 1), tol: 0.1, unit: 'm/s', k, w,
          sol: `$v = \\omega/k = ${w}/${k} = ${round(w / k, 2)}$ m/s, towards $+x$.`,
          trap: 'Speed is $\\omega/k$, not $\\omega k$.' };
      },
      verify: (p) => p.w / p.k },
    { id: 'wav-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'modes of a string',
      make(r) {
        const L = pick(r, 0.3, 2, 0.1), T = int(r, 20, 400), mu = choose(r, [0.001, 0.002, 0.005, 0.01, 0.02]), n = int(r, 1, 4);
        const f = n / (2 * L) * Math.sqrt(T / mu);
        return { q: `A string $${L}$ m long, fixed at both ends, has mass per unit length $${mu}$ kg/m and tension $${T}$ N. The frequency of harmonic number $${n}$ is ______ Hz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 1)), unit: 'Hz', L, T, mu, n,
          sol: `$v = \\sqrt{T/\\mu} = \\sqrt{${T}/${mu}} = ${round(Math.sqrt(T / mu), 2)}$ m/s. $f_n = nv/(2L) = ${n}\\times${round(Math.sqrt(T / mu), 2)}/${round(2 * L, 2)} = ${round(f, 1)}$ Hz.`,
          trap: 'Harmonic $n$ has $n$ loops: $L = n\\lambda/2$.' };
      },
      verify: (p) => p.n * Math.sqrt(p.T / p.mu) / (2 * p.L) },
    { id: 'wav-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'modes of a string',
      make(r) {
        const f1 = int(r, 30, 150), n = int(r, 2, 8);
        return { q: `A string fixed at both ends has neighbouring resonances at $${n * f1}$ Hz and $${(n + 1) * f1}$ Hz. Its fundamental frequency is ______ Hz.`,
          answer: f1, tol: 0, unit: 'Hz', f1, n,
          sol: `Resonances are $nf_1$, so neighbouring ones differ by $f_1 = ${(n + 1) * f1} - ${n * f1} = ${f1}$ Hz.`,
          trap: 'The lower of the two is harmonic $' + n + '$, not the fundamental.' };
      },
      verify: (p) => p.f1 },
    { id: 'wav-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'energy and power',
      make(r) {
        const mu = choose(r, [0.01, 0.02, 0.04, 0.05, 0.1]), T = int(r, 20, 200), A = pick(r, 0.2, 2, 0.1), f = int(r, 10, 120);
        const v = Math.sqrt(T / mu), P = 0.5 * mu * (2 * Math.PI * f) ** 2 * (A / 100) ** 2 * v;
        return { q: `A string ($\\mu = ${mu}$ kg/m, tension $${T}$ N) carries a sine wave of amplitude $${A}$ cm and frequency $${f}$ Hz. The average power it carries is ______ W (to three significant figures).`,
          answer: +P.toPrecision(3), tol: +(P * 0.01).toPrecision(2), unit: 'W', mu, T, A, f,
          sol: `$v = \\sqrt{T/\\mu} = ${round(v, 2)}$ m/s, $\\omega = 2\\pi f = ${round(2 * Math.PI * f, 2)}$ rad/s. $P = \\tfrac12\\mu\\omega^2A^2v = ${+P.toPrecision(3)}$ W.`,
          trap: 'Convert the amplitude to metres and use $\\omega = 2\\pi f$.' };
      },
      verify: (p) => 0.5 * p.mu * (2 * Math.PI * p.f) ** 2 * (p.A / 100) ** 2 * Math.sqrt(p.T / p.mu) },
    { id: 'wav-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'reflection',
      make(r) {
        const ratio = choose(r, [4, 9, 16, 25, 2.25, 0.25, 1 / 9, 0.0625]);
        const z = Math.sqrt(ratio), R = ((1 - z) / (1 + z)) ** 2;
        const rtex = ratio >= 1 ? String(ratio) : `${round(ratio, 4)}`;
        return { q: `A wave on a string meets a joint with a second string whose mass per unit length is $${rtex}$ times that of the first (same tension). The fraction of the incident power reflected is ______ (to three decimal places).`,
          answer: round(R, 3), tol: 0.002, ratio,
          sol: `$Z_2/Z_1 = \\sqrt{${rtex}} = ${round(z, 4)}$. $r = (1 - Z_2/Z_1)/(1 + Z_2/Z_1) = ${round((1 - z) / (1 + z), 4)}$; reflected power $= r^2 = ${round(R, 3)}$.`,
          trap: 'Impedance goes as $\\sqrt\\mu$, not $\\mu$.' };
      },
      verify: (p) => ((1 - Math.sqrt(p.ratio)) / (1 + Math.sqrt(p.ratio))) ** 2 },
    { id: 'wav-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'group velocity',
      make(r) {
        const k1 = int(r, 5, 20), dk = int(r, 1, 3), w1 = k1 * int(r, 5, 20), dw = int(r, 2, 40);
        return { q: `Two waves $A\\cos(${k1}x - ${w1}t)$ and $A\\cos(${k1 + dk}x - ${w1 + dw}t)$ (SI) are superposed. The speed of the envelope (group velocity) is ______ m/s (to two decimal places).`,
          answer: round(dw / dk, 2), tol: 0.01, unit: 'm/s', dk, dw,
          sol: `$v_g = \\Delta\\omega/\\Delta k = ${dw}/${dk} = ${round(dw / dk, 2)}$ m/s.`,
          trap: '$\\bar\\omega/\\bar k$ is the carrier speed, not the envelope speed.' };
      },
      verify: (p) => p.dw / p.dk },
    { id: 'wav-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'wave speed',
      make(r) {
        const L = pick(r, 1, 10, 0.5);
        const t = 2 * Math.sqrt(L / 9.8);
        return { q: `A uniform rope $${L}$ m long hangs freely from a support. A transverse pulse starts at the bottom end. The time for it to reach the top is ______ s (to two decimal places; $g = 9.8$ m/s²).`,
          answer: round(t, 2), tol: 0.01, unit: 's', L,
          sol: `$v = \\sqrt{gy}$ at height $y$ above the bottom, so $t = \\int_0^L dy/\\sqrt{gy} = 2\\sqrt{L/g} = 2\\sqrt{${L}/9.8} = ${round(t, 2)}$ s.`,
          trap: 'The tension, and so the speed, grows with height.' };
      },
      verify: (p) => 2 * Math.sqrt(p.L / 9.8) },
    { id: 'wav-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'modes of a string',
      make(r) {
        const [fac, show] = choose(r, [[4, '4'], [9, '9'], [2, '2'], [0.25, '1/4'], [16, '16'], [1 / 9, '1/9']]);
        const right = Math.sqrt(fac);
        const s = (v) => { const m = [[2, '2'], [3, '3'], [Math.SQRT2, '\\sqrt2'], [0.5, '1/2'], [4, '4'], [1 / 3, '1/3'], [16, '16'], [81, '81'], [0.25, '1/4'], [1 / 9, '1/9'], [1 / 16, '1/16'], [1 / 81, '1/81'], [1 / Math.SQRT2, '1/\\sqrt2'], [256, '256'], [8, '8'], [9, '9']].find(([x]) => Math.abs(x - v) < 1e-9); return `$${m ? m[1] : round(v, 3)}$ times`; };
        const o = mcqOptions(r, right, [fac, fac * fac, 1 / right], s);
        return { q: `The tension in a string fixed at both ends is multiplied by $${show}$, with the length and mass unchanged. Its fundamental frequency is multiplied by`, ...o,
          sol: `$f_1 = \\dfrac1{2L}\\sqrt{T/\\mu} \\propto \\sqrt T$, so the factor is $\\sqrt{${show}}$.`,
          trap: 'Frequency goes as the square root of tension.' };
      } },
  ],
};
