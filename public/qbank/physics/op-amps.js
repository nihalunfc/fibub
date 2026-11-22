// Operational amplifiers: ideal op-amp rules (virtual short), inverting, non-inverting, follower, summing and
// difference amplifiers, integrator and differentiator, saturation, CMRR, offsets and bias currents, slew rate,
// gain-bandwidth product, finite open-loop gain, comparators and Schmitt triggers, active filters and oscillators.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const par = (a, b) => (a * b) / (a + b);

import * as Q5 from '../_util.js';
import more2 from './op-amps.more2.gen.js';
import r4 from './op-amps.r4.gen.js';

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
  topic: 'op-amps',
  items: [
    // ---------- level 1 ----------
    { id: 'opa-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'ideal op-amp', format: 'single',
      q: 'Which of the following is NOT a property of an ideal operational amplifier?',
      options: ['Infinite open-loop voltage gain', 'Infinite input impedance', 'Infinite output impedance', 'Infinite bandwidth'], answer: 2,
      sol: 'An ideal op-amp has infinite gain, infinite bandwidth and infinite input impedance (no current flows into its inputs). Its output should behave like a perfect voltage source that holds its voltage whatever the load draws, which means ZERO output impedance.',
      trap: 'The ideal is "infinite" for almost everything, which tempts people to say the same of the output impedance.' },
    { id: 'opa-002', type: 'nat', level: 1, exams: ['jam'], sub: 'inverting', unit: 'V',
      q: 'An ideal inverting amplifier has input resistor $10$ k$\\Omega$ and feedback resistor $100$ k$\\Omega$. For a DC input of $0.2$ V the output is ______ V.',
      answer: -2, tol: 0.001, calc: () => -(100 / 10) * 0.2,
      sol: 'Gain $= -R_f/R_{in} = -100/10 = -10$, so $V_o = -10\\times0.2 = -2$ V.',
      trap: 'The minus sign is part of the answer: the inverting amplifier flips the polarity.' },
    { id: 'opa-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'non-inverting',
      q: 'A non-inverting amplifier uses $R_f = 90$ k$\\Omega$ from output to the inverting input and $R_1 = 10$ k$\\Omega$ from the inverting input to ground. Its voltage gain is',
      options: ['$9$', '$10$', '$-9$', '$11$'], answer: 1,
      sol: 'The divider feeds back $R_1/(R_1 + R_f) = 1/10$ of the output. With the inputs held equal, $V_{in} = V_o/10$, so the gain is $1 + R_f/R_1 = 1 + 9 = 10$.',
      trap: '$9$ is $R_f/R_1$, the inverting amplifier\'s gain magnitude; the non-inverting one adds 1.' },
    { id: 'opa-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'follower',
      q: 'A voltage follower (output tied straight to the inverting input, signal into the non-inverting input) is useful because',
      options: ['it has a gain of $-1$, so it inverts the signal', 'it has infinite gain, so it detects tiny signals', 'it has zero gain, so it blocks the signal', 'it has a gain of $1$ with a very high input impedance and a very low output impedance'], answer: 3,
      sol: 'With full feedback, $V_- = V_o$ and the virtual short gives $V_o = V_+ = V_{in}$: gain $+1$. It draws almost no current from the source and can drive heavy loads, so it is a buffer between a weak source and a demanding load.',
      trap: 'A gain of 1 sounds useless, but the job of a buffer is impedance, not gain.' },
    { id: 'opa-005', type: 'nat', level: 1, exams: ['jam'], sub: 'non-inverting', unit: 'V',
      q: 'A non-inverting amplifier has $R_f = 47$ k$\\Omega$ and $R_1 = 4.7$ k$\\Omega$. For an input of $0.3$ V the output is ______ V.',
      answer: 3.3, tol: 0.01, calc: () => (1 + 47 / 4.7) * 0.3,
      sol: 'Gain $= 1 + R_f/R_1 = 1 + 10 = 11$; $V_o = 11\\times0.3 = 3.3$ V, with the same sign as the input.',
      trap: 'Using $R_f/R_1 = 10$ gives $3.0$ V.' },
    { id: 'opa-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'ideal op-amp',
      q: 'In an inverting amplifier the inverting input is called a "virtual ground". This means',
      options: ['it is connected to ground through a wire inside the op-amp', 'current flows from it straight to ground', 'it stays at (almost) zero volts because negative feedback keeps the two inputs equal, though no current flows to ground through it', 'it carries the full output voltage'], answer: 2,
      sol: 'The non-inverting input is grounded. With a huge gain and negative feedback, the output settles where $V_+ - V_- = V_o/A \\approx 0$, so $V_- \\approx 0$. But no current enters the op-amp input, so all the input current goes on through $R_f$: the node is at ground potential without being connected to ground.',
      trap: 'If it really were grounded, the input current would vanish into ground and the output would be zero.' },

    // ---------- level 2 ----------
    { id: 'opa-007', type: 'nat', level: 2, exams: ['jam'], sub: 'summing', unit: 'V',
      q: 'An inverting summing amplifier has $R_f = 30$ k$\\Omega$. Input $V_1 = 2$ V is applied through $20$ k$\\Omega$ and $V_2 = 0.3$ V through $10$ k$\\Omega$. The output is ______ V.',
      answer: -3.9, tol: 0.01, calc: () => -(30 / 20 * 2 + 30 / 10 * 0.3),
      sol: 'The currents add at the virtual ground: $V_o = -R_f(V_1/R_1 + V_2/R_2) = -(1.5\\times2 + 3\\times0.3) = -(3 + 0.9) = -3.9$ V.',
      trap: 'Each input has its own weight $R_f/R_i$; adding the inputs first and using one gain is wrong here.' },
    { id: 'opa-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'saturation',
      q: 'An inverting amplifier with gain $-20$ runs from $\\pm12$ V supplies; its output can swing only to $\\pm11$ V. For a DC input of $+0.8$ V the output is',
      options: ['$-16$ V', '$-11$ V', '$+11$ V', '$-12$ V'], answer: 1,
      sol: 'The ideal output would be $-20\\times0.8 = -16$ V, but the output cannot go beyond the negative saturation level, $-11$ V. The op-amp saturates there and the virtual short no longer holds.',
      trap: 'The formula $-R_f/R_{in}$ is valid only while the output stays within the rails.' },
    { id: 'opa-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'difference',
      q: 'A difference amplifier is built with four equal resistors. $V_1 = 3$ V goes to the resistor on the inverting side and $V_2 = 5$ V to the resistor on the non-inverting side. The output is',
      options: ['$+8$ V', '$-2$ V', '$+2$ V', '$0$ V'], answer: 2,
      sol: 'With equal resistors, $V_+ = V_2/2$. Superposition: $V_o = (1 + R/R)V_+ - (R/R)V_1 = 2(V_2/2) - V_1 = V_2 - V_1 = 5 - 3 = +2$ V.',
      trap: 'The sign depends on which input reaches which terminal; the non-inverting input carries the plus sign.' },
    { id: 'opa-010', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'slew rate', unit: 'kHz',
      q: 'An op-amp has a slew rate of $0.5$ V/$\\mu$s. The highest frequency at which it can deliver an undistorted sine wave of $10$ V peak is ______ kHz (to two decimal places).',
      answer: 7.96, tol: 0.05, calc: () => 0.5e6 / (2 * Math.PI * 10) / 1e3,
      sol: 'For $V_p\\sin2\\pi ft$ the steepest slope is $2\\pi fV_p$ (at the zero crossings). It must not exceed the slew rate: $f_{max} = SR/(2\\pi V_p) = 5\\times10^5/(2\\pi\\times10) = 7958$ Hz $= 7.96$ kHz.',
      trap: 'Using peak-to-peak (20 V) halves the answer; the slope uses the peak amplitude.' },
    { id: 'opa-011', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'gain-bandwidth', unit: 'kHz',
      q: 'An op-amp has a gain-bandwidth product of $1$ MHz. Used as a non-inverting amplifier with gain $20$, its $-3$ dB bandwidth is ______ kHz.',
      answer: 50, tol: 0.1, calc: () => 1e6 / 20 / 1e3,
      sol: 'For a single-pole op-amp, closed-loop gain times bandwidth stays equal to the gain-bandwidth product: $f_{3dB} = 1\\text{ MHz}/20 = 50$ kHz.',
      trap: 'For an inverting amplifier the divisor is the noise gain $1 + R_f/R_{in}$, not $R_f/R_{in}$; here the stage is non-inverting so it is just 20.' },
    { id: 'opa-012', type: 'msq', level: 2, exams: ['jam'], sub: 'feedback', format: 'statements',
      q: 'Negative feedback is applied around an op-amp to make an amplifier. Compared with the open-loop op-amp, which statements are correct?',
      options: ['The voltage gain is reduced.', 'The bandwidth is increased.', 'Distortion is reduced.', 'The gain now depends mainly on the op-amp\'s open-loop gain.'], answer: [0, 1, 2],
      sol: 'With feedback fraction $\\beta$, the gain becomes $A/(1 + A\\beta) \\approx 1/\\beta$: much smaller, but set by resistors rather than by the large, unreliable $A$. The same factor $1 + A\\beta$ widens the bandwidth and divides the distortion. So the gain becomes nearly INDEPENDENT of the open-loop gain.',
      trap: 'The whole point of feedback is that the gain stops depending on $A$.' },
    { id: 'opa-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'integrator',
      q: 'An ideal integrator has $R = 10$ k$\\Omega$ and $C = 1\\ \\mu$F, and its output starts at $0$ V. A constant $+1$ V is applied to its input. After $20$ ms the output is',
      options: ['$+2$ V', '$-20$ V', '$-0.2$ V', '$-2$ V'], answer: 3,
      sol: 'A constant current $V_{in}/R = 0.1$ mA charges the capacitor, so the output ramps: $V_o = -\\dfrac{1}{RC}\\int_0^t V_{in}\\,dt = -\\dfrac{V_{in}t}{RC} = -\\dfrac{1\\times0.02}{0.01} = -2$ V.',
      trap: 'The inverting integrator ramps the opposite way to the input: the sign is negative.' },
    { id: 'opa-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'CMRR',
      q: 'An op-amp has differential gain $10^5$ and common-mode gain $1$. Its common-mode rejection ratio is',
      options: ['$50$ dB', '$100$ dB', '$10^5$ dB', '$5$ dB'], answer: 1,
      sol: '$\\text{CMRR} = A_d/A_{cm} = 10^5$, and in decibels $20\\log_{10}10^5 = 100$ dB.',
      trap: '$10\\log_{10}$ (50 dB) is for power ratios; gains of voltage use $20\\log_{10}$.' },
    { id: 'opa-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'inverting',
      q: 'An inverting amplifier has $R_{in} = 4.7$ k$\\Omega$ and $R_f = 47$ k$\\Omega$, built with an ideal op-amp. The input resistance seen by the signal source is',
      options: ['infinite', '$4.7$ k$\\Omega$', '$47$ k$\\Omega$', '$0\\ \\Omega$'], answer: 1,
      sol: 'The source drives $R_{in}$, whose other end sits at the virtual ground. So the current is $V_{in}/R_{in}$ and the input resistance is just $R_{in} = 4.7$ k$\\Omega$, however ideal the op-amp is.',
      trap: 'The op-amp\'s own input is infinite, but in the inverting circuit the source sees $R_{in}$. Only the non-inverting circuit gives the very high input resistance.' },
    { id: 'opa-016', type: 'msq', level: 2, exams: ['jam'], sub: 'comparator', format: 'statements',
      q: 'An op-amp is used without feedback as a comparator. Which statements are correct?',
      options: ['Its output sits near one supply rail or the other.', 'It relies on negative feedback to keep its inputs equal.', 'A differential input of a few millivolts is enough to saturate the output.', 'When $V_+ > V_-$ the output is at positive saturation.'], answer: [0, 2, 3],
      sol: 'With no feedback the full open-loop gain (around $10^5$) acts on $V_+ - V_-$, so even a millivolt or so drives the output to a rail: positive when $V_+ > V_-$, negative otherwise. There is no feedback, so the virtual short does not apply and the inputs can differ by volts.',
      trap: 'The rule "inputs equal" is a consequence of negative feedback, not a property of the op-amp itself.' },
    { id: 'opa-045', type: 'msq', level: 2, exams: ['jam'], sub: 'phase', format: 'multi',
      q: 'Which of these circuits (ideal op-amps, mid-band) give an output in phase with the input?',
      options: ['A non-inverting amplifier of gain 5', 'A voltage follower', 'An inverting amplifier with $R_f = R_{in}$', 'Two inverting amplifiers connected one after the other'], answer: [0, 1, 3],
      sol: 'Non-inverting amplifiers and the follower have positive gain. An inverting amplifier with equal resistors has gain $-1$: same size, opposite phase. Two inverting stages give $(-)(-) = +$: in phase overall.',
      trap: 'Gain $-1$ keeps the size of the signal but still flips it by $180^\\circ$.' },

    // ---------- level 3 ----------
    { id: 'opa-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'finite gain',
      q: 'An op-amp with open-loop gain $A = 1000$ is used in a non-inverting amplifier whose resistor divider feeds back $\\beta = 0.1$ of the output. The closed-loop gain is ______ (to three decimal places).',
      answer: 9.901, tol: 0.002, calc: () => 1000 / (1 + 1000 * 0.1),
      sol: 'From $V_o = A(V_{in} - \\beta V_o)$: $V_o/V_{in} = A/(1 + A\\beta) = 1000/(1 + 100) = 9.901$. The ideal value $1/\\beta = 10$ is off by about 1% because the loop gain $A\\beta = 100$ is not infinite.',
      trap: 'Using the ideal value 10 is wrong when the question gives a finite $A$.' },
    { id: 'opa-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'differentiator',
      q: 'A triangular wave is fed into an ideal op-amp differentiator. The output is',
      options: ['a sine wave', 'a triangular wave of the opposite sign', 'a square wave', 'a train of narrow spikes'], answer: 2,
      sol: 'The differentiator gives $V_o = -RC\\,dV_{in}/dt$. A triangle has a constant positive slope on the way up and a constant negative slope on the way down, so the output jumps between two constant levels: a square wave. (A square wave in gives spikes; the integrator undoes these steps.)',
      trap: 'Spikes are what a differentiator makes from a square wave, not from a triangle.' },
    { id: 'opa-019', type: 'nat', level: 3, exams: ['jam'], sub: 'active filter', unit: 'Hz',
      q: 'An inverting amplifier has a $0.01\\ \\mu$F capacitor in parallel with its $10$ k$\\Omega$ feedback resistor, making a first-order low-pass filter. Its cut-off frequency is ______ Hz (to the nearest whole number).',
      answer: 1592, tol: 3, calc: () => 1 / (2 * Math.PI * 1e4 * 1e-8),
      sol: 'The feedback impedance is $R_f\\parallel(1/j\\omega C)$, so the gain falls by $\\sqrt2$ where $\\omega R_fC = 1$: $f_c = 1/(2\\pi R_fC) = 1/(2\\pi\\times10^4\\times10^{-8}) = 1592$ Hz. The input resistor sets only the pass-band gain.',
      trap: 'Using the input resistor in $f_c$: the capacitor is across $R_f$, so only $R_f$ counts.' },
    { id: 'opa-020', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'oscillators',
      q: 'A Wien bridge oscillator uses a non-inverting amplifier with resistors $R_f$ (feedback) and $R_1$ (to ground). For oscillations to just start and be sustained, the resistors must satisfy (at least)',
      options: ['$R_f = R_1$', '$R_f = 2R_1$', '$R_f = 3R_1$', '$R_f = 29R_1$'], answer: 1,
      sol: 'At its centre frequency $f = 1/(2\\pi RC)$ the Wien network has zero phase shift and passes $1/3$ of the voltage. Barkhausen: the loop gain must be 1, so the amplifier needs gain $3 = 1 + R_f/R_1$, i.e. $R_f = 2R_1$.',
      trap: '$R_f = 3R_1$ gives gain 4 (it confuses $R_f/R_1$ with the gain); $29$ belongs to the RC phase-shift oscillator.' },
    { id: 'opa-021', type: 'nat', level: 3, exams: ['jam'], sub: 'Schmitt trigger', unit: 'V',
      q: 'An inverting Schmitt trigger has its output ($\\pm12$ V saturation) fed back to the non-inverting input through $R_2 = 20$ k$\\Omega$, and $R_1 = 10$ k$\\Omega$ from the non-inverting input to ground. The width of its hysteresis band (upper threshold minus lower threshold) is ______ V.',
      answer: 8, tol: 0.01, calc: () => 2 * 12 * 10 / 30,
      sol: 'The non-inverting input sits at $V_o R_1/(R_1 + R_2) = V_o/3$. With $V_o = +12$ V the threshold is $+4$ V; with $V_o = -12$ V it is $-4$ V. The width is $4 - (-4) = 8$ V.',
      trap: 'Using $R_1/R_2$ instead of $R_1/(R_1 + R_2)$ gives thresholds of $\\pm6$ V.' },
    { id: 'opa-022', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'integrator', format: 'statements',
      q: 'Which statements about the ideal op-amp integrator (input resistor $R$, feedback capacitor $C$) are correct?',
      options: ['$V_o = -\\dfrac{1}{RC}\\displaystyle\\int V_{in}\\,dt$.', 'The magnitude of its gain rises with frequency.', 'At DC its gain is unlimited, so even a tiny input offset slowly drives it into saturation.', 'A large resistor is often placed across $C$ to limit its gain at low frequencies.'], answer: [0, 2, 3],
      sol: 'The input current $V_{in}/R$ flows on into the capacitor, so $C\\,dV_o/dt = -V_{in}/R$. In terms of frequency the gain is $-1/(j\\omega RC)$, whose size FALLS as $1/\\omega$ (that is the differentiator that rises). At $\\omega \\to 0$ the gain is unbounded, so offsets integrate up to a rail; a resistor across $C$ caps the DC gain at $-R_f/R$.',
      trap: 'Integrator and differentiator are easy to swap: the integrator is a low-pass circuit.' },
    { id: 'opa-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'integrator',
      q: 'An ideal integrator with $R = 10$ k$\\Omega$ and $C = 0.1\\ \\mu$F receives $V_{in} = 2\\sin(1000t)$ V. Ignoring any constant, the output is',
      options: ['$2\\cos(1000t)$ V', '$-2\\cos(1000t)$ V', '$2000\\cos(1000t)$ V', '$-2\\sin(1000t)$ V'], answer: 0,
      sol: '$RC = 10^4\\times10^{-7} = 10^{-3}$ s. $V_o = -\\dfrac{1}{RC}\\int 2\\sin(1000t)\\,dt = -1000\\times\\left(-\\dfrac{2}{1000}\\cos1000t\\right) = 2\\cos(1000t)$ V. The amplitude is unchanged because $\\omega RC = 1$ at this frequency.',
      trap: 'Two minus signs (the inverting circuit and the integral of sine) cancel; dropping either gives $-2\\cos$.' },
    { id: 'opa-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'instrumentation',
      q: 'A three-op-amp instrumentation amplifier has input-stage resistors $R = 25$ k$\\Omega$ on each side, a gain-setting resistor $R_G = 1$ k$\\Omega$ between them, and a unity-gain difference stage. Its differential gain is ______.',
      answer: 51, tol: 0.01, calc: () => 1 + 2 * 25 / 1,
      sol: 'The two input followers force the input difference across $R_G$, so the current $(V_2 - V_1)/R_G$ flows through $R + R_G + R$. The difference between the two buffer outputs is $(V_2 - V_1)(1 + 2R/R_G)$, and the unity difference stage passes it on: gain $1 + 2\\times25/1 = 51$.',
      trap: '$1 + R/R_G = 26$ forgets that there is a resistor $R$ on each side.' },
    { id: 'opa-025', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'offset',
      q: 'An op-amp with input offset voltage $2$ mV is used in an inverting amplifier with $R_f/R_{in} = 100$. With the input grounded, the output offset is about',
      options: ['$200$ mV', '$202$ mV', '$2$ mV', '$20$ mV'], answer: 1,
      sol: 'The offset acts like a small source in series with the non-inverting input. For that source the circuit is a non-inverting amplifier with gain $1 + R_f/R_{in} = 101$ (the "noise gain"). Output offset $= 101\\times2$ mV $= 202$ mV.',
      trap: 'The signal gain is 100, but the offset sees the noise gain, 101.' },
    { id: 'opa-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'bias current',
      q: 'To cancel the effect of the input bias currents in an inverting amplifier with $R_{in} = 10$ k$\\Omega$ and $R_f = 100$ k$\\Omega$, a resistor is placed between the non-inverting input and ground. Its best value is about',
      options: ['$9.1$ k$\\Omega$', '$110$ k$\\Omega$', '$10$ k$\\Omega$', '$100$ k$\\Omega$'], answer: 0,
      sol: 'Each input should see the same DC resistance, so that equal bias currents make equal voltage drops. The inverting input sees $R_{in}$ and $R_f$ in parallel (the source and output are both at low impedance): $10\\parallel100 = 9.09$ k$\\Omega$.',
      trap: '$110$ k$\\Omega$ puts the resistors in series; from the input node they are in parallel.' },
    { id: 'opa-027', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'gain-bandwidth',
      q: 'An op-amp with gain-bandwidth product $1$ MHz is wired as a non-inverting amplifier of gain $100$. At $100$ kHz the magnitude of its closed-loop gain is about',
      options: ['$10$', '$100$', '$1$', '$50$'], answer: 0,
      sol: 'The closed-loop corner is at $1\\text{ MHz}/100 = 10$ kHz. Ten times above it, a single-pole response has fallen by a factor of about 10 (exactly $100/\\sqrt{1 + 10^2} = 9.95$). Equivalently, above the corner the curve follows the open-loop gain $\\approx\\text{GBW}/f = 10$.',
      trap: 'The gain is flat only up to the corner frequency, not up to the GBW.' },
    { id: 'opa-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'summing',
      q: 'Three inputs of $2$ V, $4$ V and $-3$ V are applied through $30$ k$\\Omega$ resistors each to an inverting summing amplifier with $R_f = 10$ k$\\Omega$. The output is',
      options: ['$-3$ V', '$+1$ V', '$-1$ V', '$-9$ V'], answer: 2,
      sol: '$V_o = -\\dfrac{R_f}{R}(V_1 + V_2 + V_3) = -\\dfrac{10}{30}(2 + 4 - 3) = -1$ V. With $R_f = R/3$ the circuit gives minus the average of the three inputs.',
      trap: 'Forgetting the minus sign of the $-3$ V input gives $(2 + 4 + 3)/3 = 3$.' },
    { id: 'opa-029', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'nonlinear',
      q: 'An op-amp circuit has a resistor from the input to the inverting input and a forward-biased diode in the feedback path. Its output is proportional to',
      options: ['$V_{in}^2$', '$e^{V_{in}}$', '$1/V_{in}$', '$-\\ln V_{in}$ (for positive $V_{in}$)'], answer: 3,
      sol: 'The current $V_{in}/R$ must flow through the diode, whose current is $I_S e^{V_D/V_T}$. The diode voltage is the output with a minus sign, so $V_o = -V_T\\ln\\big(V_{in}/(RI_S)\\big)$: a logarithmic amplifier. Swapping the diode and resistor gives the antilog (exponential) amplifier.',
      trap: 'The exponential law of the diode, sitting in the feedback path, is inverted: exponential in the element means logarithm in the circuit.' },
    { id: 'opa-030', type: 'msq', level: 3, exams: ['jam'], sub: 'non-inverting', format: 'statements',
      q: 'Compare an ideal non-inverting amplifier with an ideal inverting amplifier. Which statements are correct?',
      options: ['The non-inverting amplifier has a very high input impedance.', 'The non-inverting amplifier\'s gain can never be less than 1.', 'The inverting amplifier can have a gain magnitude less than 1.', 'In both circuits the inverting input is a virtual ground.'], answer: [0, 1, 2],
      sol: 'The non-inverting circuit takes the signal straight into the op-amp input: very high input impedance. Its gain $1 + R_f/R_1$ is at least 1. The inverting gain $-R_f/R_{in}$ can be any size, e.g. $-0.5$. In the non-inverting circuit the inverting input follows $V_{in}$ (the virtual SHORT puts it at $V_+ = V_{in}$), so it is not a virtual ground.',
      trap: '"Virtual ground" is a special case of the virtual short, true only when $V_+$ is grounded.' },
    { id: 'opa-044', type: 'nat', level: 3, exams: ['jam'], sub: 'superposition', unit: 'V',
      q: 'In an op-amp circuit, $V_1 = 1$ V drives the inverting input through $R = 10$ k$\\Omega$, the feedback resistor is $20$ k$\\Omega$, and $V_2 = 0.5$ V is connected directly to the non-inverting input. The output is ______ V.',
      answer: -0.5, tol: 0.001, calc: () => -2 * 1 + 3 * 0.5,
      sol: 'Superposition. With $V_2 = 0$: inverting amplifier, $-(20/10)V_1 = -2$ V. With $V_1 = 0$: non-inverting amplifier, $(1 + 20/10)V_2 = 3\\times0.5 = 1.5$ V. Total $V_o = -2 + 1.5 = -0.5$ V.',
      trap: 'Using gain $2$ (not $3$) for $V_2$: the non-inverting path always has gain $1 + R_f/R$.' },

    // ---------- level 4 ----------
    { id: 'opa-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'difference', unit: 'V',
      q: 'A difference amplifier has $R_1 = 10$ k$\\Omega$ from $V_1$ to the inverting input, $R_2 = 50$ k$\\Omega$ feedback, $R_3 = 10$ k$\\Omega$ from $V_2$ to the non-inverting input and $R_4 = 40$ k$\\Omega$ from the non-inverting input to ground. With $V_1 = V_2 = 1$ V the output is ______ V.',
      answer: -0.2, tol: 0.002, calc: () => -(50 / 10) * 1 + (1 + 50 / 10) * (40 / 50) * 1,
      sol: '$V_+ = V_2R_4/(R_3 + R_4) = 0.8V_2$. $V_o = -(R_2/R_1)V_1 + (1 + R_2/R_1)V_+ = -5V_1 + 6\\times0.8V_2 = -5V_1 + 4.8V_2$. With both at 1 V: $-0.2$ V. A true difference amplifier needs $R_4/R_3 = R_2/R_1$; here the mismatch lets a common-mode input through.',
      trap: 'Assuming "equal inputs give zero output" is true only for matched ratios.' },
    { id: 'opa-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'slew rate', unit: 'kHz',
      q: 'An op-amp has gain-bandwidth product $2$ MHz and slew rate $1$ V/$\\mu$s. It is used as a non-inverting amplifier of gain $10$ with a sine input of $1$ V peak. The highest input frequency for an undistorted output is ______ kHz (to one decimal place).',
      answer: 15.9, tol: 0.1, calc: () => 1e6 / (2 * Math.PI * 10) / 1e3,
      sol: 'Two limits. Small-signal bandwidth: $2\\text{ MHz}/10 = 200$ kHz. Slew-rate limit for a $10$ V peak output: $f = SR/(2\\pi V_p) = 10^6/(2\\pi\\times10) = 15.9$ kHz. The lower one wins: $15.9$ kHz.',
      trap: 'Quoting the 200 kHz bandwidth ignores that the large output swing is slew-limited much earlier.' },
    { id: 'opa-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'oscillators',
      q: 'An RC phase-shift oscillator uses three identical sections, each a series capacitor $C = 10$ nF followed by a resistor $R = 10$ k$\\Omega$ to ground, driving an inverting amplifier. Its frequency of oscillation is about',
      options: ['$650$ Hz', '$1.59$ kHz', '$3.9$ kHz', '$265$ Hz'], answer: 0,
      sol: 'For this ladder the total phase shift reaches $180^\\circ$ at $\\omega = 1/(\\sqrt6\\,RC)$, where the network passes $1/29$ of the voltage (so the amplifier needs gain 29). $f = 1/(2\\pi\\sqrt6RC) = 1/(2\\pi\\times2.449\\times10^{-4}) = 650$ Hz.',
      trap: '$1/(2\\pi RC) = 1.59$ kHz is the Wien bridge frequency, not the three-section ladder.' },
    { id: 'opa-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'finite gain',
      q: 'An inverting amplifier with $R_{in} = 10$ k$\\Omega$ and $R_f = 100$ k$\\Omega$ uses an op-amp of open-loop gain $1000$ (infinite input impedance, zero output impedance). Its closed-loop gain is ______ (to two decimal places).',
      answer: -9.89, tol: 0.01, calc: () => -10 / (1 + 11 / 1000),
      sol: 'Let $V_-$ be the inverting input voltage; $V_o = -AV_-$. Current balance: $(V_{in} - V_-)/R_{in} = (V_- - V_o)/R_f$. Solving, $V_o/V_{in} = -\\dfrac{R_f/R_{in}}{1 + (1 + R_f/R_{in})/A} = -\\dfrac{10}{1 + 11/1000} = -9.89$.',
      trap: 'The error term uses the noise gain $1 + R_f/R_{in} = 11$, not 10.' },
    { id: 'opa-035', type: 'msq', level: 4, exams: ['jam'], sub: 'Schmitt trigger', format: 'statements',
      q: 'Which statements about a Schmitt trigger built from an op-amp are correct?',
      options: ['It uses positive feedback.', 'It has two different switching thresholds.', 'It stops a slowly changing, noisy input from making the output chatter.', 'Between the thresholds its output varies linearly with the input.'], answer: [0, 1, 2],
      sol: 'Part of the output goes back to the non-inverting input, which is positive feedback: once the output starts to switch, it drives itself all the way. The threshold depends on which rail the output is on, so there are two. Noise smaller than the gap cannot switch it back. Between the thresholds the output stays at whichever rail it was on: it is never linear.',
      trap: 'A Schmitt trigger is a comparator with memory, not an amplifier.' },
    { id: 'opa-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'transimpedance',
      q: 'A photodiode delivers a current of $2\\ \\mu$A into the inverting input (a virtual ground) of an op-amp whose feedback resistor is $1$ M$\\Omega$ and whose non-inverting input is grounded. The current flows into the input node. The output voltage is',
      options: ['$+2$ V', '$-2$ mV', '$0$ V', '$-2$ V'], answer: 3,
      sol: 'No current enters the op-amp, so the whole $2\\ \\mu$A flows through $R_f$ from the input node to the output. The node is at 0 V, so $V_o = 0 - IR_f = -2\\times10^{-6}\\times10^6 = -2$ V.',
      trap: 'A current flowing INTO the node leaves through $R_f$ towards the output, so the output sits below zero.' },
    { id: 'opa-037', type: 'nat', level: 4, exams: ['jam'], sub: 'integrator', unit: 'V',
      q: 'A symmetric $\\pm1$ V square wave of frequency $1$ kHz drives an ideal integrator with $R = 10$ k$\\Omega$ and $C = 0.1\\ \\mu$F. In the steady state the output is a triangle wave of peak-to-peak amplitude ______ V.',
      answer: 0.5, tol: 0.005, calc: () => 1 / (1e4 * 1e-7) * 0.5e-3,
      sol: 'During each half-period ($0.5$ ms) the input is constant at $\\pm1$ V, so the output ramps at $V/RC = 1/10^{-3} = 1000$ V/s. In $0.5$ ms it moves $0.5$ V, then ramps back. Peak-to-peak $= 0.5$ V.',
      trap: 'Using the full period (1 ms) doubles the answer; each ramp lasts half a period.' },
    { id: 'opa-038', type: 'mcq', level: 4, exams: ['jam'], sub: 'faults',
      q: 'In a non-inverting amplifier ($R_f$ from output to the inverting input, $R_1$ from the inverting input to ground), $R_1$ breaks open. The circuit now has a gain of',
      options: ['$1 + R_f/R_1$, unchanged', 'infinity, so the output saturates', '$1$', '$0$'], answer: 2,
      sol: 'With $R_1$ open, no current flows in $R_f$ (none enters the op-amp input), so there is no drop across it: $V_- = V_o$. The circuit is now a voltage follower, gain 1. (If instead $R_f$ broke open, the loop would be broken and the output would saturate.)',
      trap: 'Opening $R_1$ and opening $R_f$ have opposite effects; check which one removes the feedback.' },
    { id: 'opa-040', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'integrator',
      q: 'On a Bode plot, the gain of an ideal integrator with $R = 10$ k$\\Omega$ and $C = 1\\ \\mu$F falls at $20$ dB per decade. It crosses $0$ dB (gain magnitude 1) at about',
      options: ['$100$ Hz', '$15.9$ Hz', '$1.59$ Hz', '$159$ Hz'], answer: 1,
      sol: '$|A| = 1/(\\omega RC) = 1$ when $\\omega = 1/RC = 100$ rad/s, i.e. $f = 100/(2\\pi) = 15.9$ Hz.',
      trap: '$100$ is the angular frequency in rad/s, not the frequency in Hz.' },
    { id: 'opa-046', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'limitations', format: 'multi',
      q: 'For a real op-amp amplifier delivering a large-amplitude sine wave, which of these limit the highest frequency at which the output is undistorted?',
      options: ['The slew rate', 'The gain-bandwidth product', 'The input offset voltage', 'The common-mode rejection ratio'], answer: [0, 1],
      sol: 'The slew rate caps how fast the output can change, which matters for large amplitudes. The gain-bandwidth product sets where the closed-loop gain starts to fall. The offset voltage adds a DC shift and the CMRR controls how well common-mode signals are rejected; neither sets a frequency limit for the wanted signal.',
      trap: 'Offset and CMRR are accuracy specs, not speed specs.' },

    // ---------- level 5 ----------
    { id: 'opa-039', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'CMRR', unit: 'dB',
      q: 'A difference amplifier built with an ideal op-amp has $R_1 = R_3 = 10$ k$\\Omega$ (input resistors), feedback $R_2 = 100$ k$\\Omega$, and $R_4 = 99$ k$\\Omega$ from the non-inverting input to ground (a 1% mismatch). Defining the differential input as $V_2 - V_1$ and the common-mode input as $(V_1 + V_2)/2$, the CMRR of the circuit is ______ dB (to one decimal place).',
      answer: 60.7, tol: 0.15, calc: () => { const a = -10, b = 11 * 99 / 109; const Ad = (b - a) / 2, Acm = a + b; return 20 * Math.log10(Math.abs(Ad / Acm)); },
      sol: '$V_o = -\\dfrac{R_2}{R_1}V_1 + \\left(1 + \\dfrac{R_2}{R_1}\\right)\\dfrac{R_4}{R_3 + R_4}V_2 = -10V_1 + 11\\times\\dfrac{99}{109}V_2 = -10V_1 + 9.9908V_2$. Write $V_1 = V_{cm} - V_d/2$, $V_2 = V_{cm} + V_d/2$: $A_{cm} = -10 + 9.9908 = -0.00917$ and $A_d = (10 + 9.9908)/2 = 9.9954$. CMRR $= 9.9954/0.00917 = 1090$, i.e. $20\\log_{10}1090 = 60.7$ dB, even though the op-amp itself is ideal.',
      trap: 'A perfect op-amp does not guarantee a perfect difference amplifier: resistor matching sets the CMRR.' },
    { id: 'opa-041', type: 'msq', level: 5, exams: ['gate', 'jam'], sub: 'finite gain', format: 'statements',
      q: 'An inverting amplifier ($R_{in}$, $R_f$) uses an op-amp with large but finite open-loop gain $A$ (and ideal input and output impedances). Which statements are correct?',
      options: ['The inverting input sits at $-V_o/A$, not exactly at zero.', 'The magnitude of the closed-loop gain is slightly less than $R_f/R_{in}$.', 'The relative gain error gets larger as $R_f/R_{in}$ is made smaller.', 'The input resistance is $R_{in} + R_f/(1 + A)$.'], answer: [0, 1, 3],
      sol: 'With $V_+ = 0$, $V_o = A(0 - V_-)$, so $V_- = -V_o/A$. The gain is $-(R_f/R_{in})/[1 + (1 + R_f/R_{in})/A]$, a little smaller in size, and the fractional error $(1 + R_f/R_{in})/A$ GROWS with larger $R_f/R_{in}$ (less loop gain is left over), so the claim that the error grows as $R_f/R_{in}$ is made smaller is backwards. Seen from the inverting node, $R_f$ is divided by $1 + A$ (the Miller effect for a resistor), so the input resistance is $R_{in} + R_f/(1+A)$.',
      trap: 'High-gain stages are the less accurate ones: the loop gain $A\\beta$ shrinks as the closed-loop gain grows.' },
    { id: 'opa-042', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'Schmitt trigger', unit: 'V',
      q: 'An inverting Schmitt trigger has its output ($\\pm10$ V saturation) fed back to the non-inverting input through $R_2 = 40$ k$\\Omega$. Instead of going to ground, $R_1 = 10$ k$\\Omega$ runs from the non-inverting input to a $+2$ V reference. The input is on the inverting terminal. The upper switching threshold is ______ V.',
      answer: 3.6, tol: 0.01, calc: () => 2 * 40 / 50 + 10 * 10 / 50,
      sol: 'Superposition at the non-inverting input: $V_+ = V_{ref}\\dfrac{R_2}{R_1 + R_2} + V_o\\dfrac{R_1}{R_1 + R_2} = 2\\times0.8 + V_o\\times0.2$. With the output high ($+10$ V) the input must rise past $1.6 + 2 = 3.6$ V to switch it; with the output low the lower threshold is $1.6 - 2 = -0.4$ V. The reference shifts the centre of the band to $1.6$ V, not to $2$ V.',
      trap: 'The centre of the hysteresis band is $V_{ref}R_2/(R_1 + R_2)$, not $V_{ref}$ itself.' },
    { id: 'opa-043', type: 'mcq', level: 5, exams: ['jam'], sub: 'superposition',
      q: 'An op-amp has equal resistors $R$ from the input to the inverting terminal and from the output back to the inverting terminal. The same input $V_{in}$ is also connected directly to the non-inverting terminal. The output is',
      options: ['$-V_{in}$', '$0$', '$2V_{in}$', '$+V_{in}$'], answer: 3,
      sol: 'Superposition. Through the inverting path: $-(R/R)V_{in} = -V_{in}$. Through the non-inverting path: $(1 + R/R)V_{in} = 2V_{in}$. Total $+V_{in}$. Check with the virtual short: $V_- = V_{in}$, so no current flows in the input resistor and none in the feedback resistor, giving $V_o = V_- = V_{in}$.',
      trap: 'It looks like the two paths should cancel to zero, but the non-inverting path has gain 2, not 1.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'opa-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'integrator',
      make(r) {
        const names = ['an integrator', 'a differentiator', 'an inverting amplifier', 'a voltage follower', 'a comparator', 'a Schmitt trigger'];
        const desc = ['the input feeds the inverting input through a resistor, and a capacitor connects the output back to the inverting input; the non-inverting input is grounded',
          'the input feeds the inverting input through a capacitor, and a resistor connects the output back to the inverting input; the non-inverting input is grounded',
          'the input feeds the inverting input through a resistor $R_1$, and a resistor $R_2$ connects the output back to the inverting input; the non-inverting input is grounded',
          'the output is wired straight to the inverting input, and the signal goes to the non-inverting input',
          'there is no feedback at all; the signal goes to one input and a fixed reference voltage to the other',
          'the signal goes to the inverting input, and a resistor divider feeds part of the output back to the non-inverting input'];
        const c = Q5.int(r, 0, 5);
        const o = Q5.mcqOptions(r, names[c], Q5.shuffle(r, names.filter((x, i) => i !== c)));
        return { q: `In an op-amp circuit, ${desc[c]}. The circuit is`, ...o,
          sol: 'Negative feedback through a capacitor: $v_o = -\\frac{1}{RC}\\int v_i\\,dt$ (integrator); input capacitor with feedback resistor: $v_o = -RC\\,dv_i/dt$ (differentiator); two resistors: gain $-R_2/R_1$; output to the inverting input with the signal on the other: unity-gain follower. No feedback: the huge open-loop gain slams the output to a rail, comparing two voltages. Positive feedback to the non-inverting input gives two thresholds (hysteresis): a Schmitt trigger.',
          trap: 'Feedback to the non-inverting input is positive feedback: no virtual short, but a switching circuit.' };
      } },
    { id: 'opa-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'ideal op-amp', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['With negative feedback and the output not saturated, the two input voltages are (nearly) equal.', 'An ideal op-amp draws no current into its inputs.', 'Without feedback, a small difference between the inputs drives the output into saturation.',
          'The inverting input is a virtual ground only when the non-inverting input is grounded.', 'An ideal op-amp has zero output resistance.'];
        const F = ['The two inputs stay at equal voltages even with positive feedback.', 'The input current equals the output current.', 'The inverting input is a virtual ground in every op-amp circuit.',
          'An ideal op-amp has infinite output resistance.', 'The output can exceed the supply voltages if the gain is large enough.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about ideal op-amps are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'Ideal: infinite open-loop gain and input resistance, zero output resistance. With negative feedback the output settles where $v_+ \\approx v_-$ (virtual short); if $v_+$ is grounded, $v_-$ is a virtual ground. With positive feedback or none, the output runs to a rail, which it can never exceed. No current enters the inputs; the output current comes from the supplies.',
          trap: 'The virtual short is a consequence of negative feedback, not a property of the op-amp alone.' };
      } },
    { id: 'opa-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'inverting', unit: 'V',
      make(r) {
        const R1 = Q5.int(r, 1, 10), Rf = R1 * Q5.int(r, 2, 10), R3 = Q5.int(r, 1, 10), R2 = R3 * Q5.int(r, 1, 10), vin = Q5.pick(r, 0.01, 0.1, 0.01) * (r() < 0.5 ? -1 : 1);
        const v1 = -Rf / R1 * vin, vo = v1 * (1 + R2 / R3);
        return { q: `An inverting amplifier ($R_1 = ${R1}$ k$\\Omega$, $R_f = ${Rf}$ k$\\Omega$) feeds a non-inverting amplifier ($R_3 = ${R3}$ k$\\Omega$ to ground, $R_2 = ${R2}$ k$\\Omega$ feedback). Both op-amps are ideal with $\\pm15$ V supplies. For a DC input of $${Q5.round(vin, 2)}$ V, the final output is ______ V (to three decimal places).`,
          answer: Q5.round(vo, 3), tol: 0.002, R1, Rf, R2, R3, vin,
          sol: `Stage 1: $v_1 = -\\dfrac{R_f}{R_1}v_{in} = -${Rf / R1}\\times(${Q5.round(vin, 2)}) = ${Q5.round(v1, 3)}$ V. Stage 2: $v_o = \\left(1 + \\dfrac{R_2}{R_3}\\right)v_1 = ${1 + R2 / R3}\\times(${Q5.round(v1, 3)}) = ${Q5.round(vo, 3)}$ V, within the supply rails, so neither stage saturates.`,
          trap: 'Keep the sign from the inverting stage; the non-inverting stage has gain $1 + R_2/R_3$, not $R_2/R_3$.' };
      },
      verify: (p) => -(p.Rf / p.R1) * ((p.R3 + p.R2) / p.R3) * p.vin },
    { id: 'opa-t24', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'active filter', format: 'limiting case',
      make(r) {
        const c = Q5.int(r, 0, 3), hi = r() < 0.5;
        const circ = ['an ideal integrator (input $R$, feedback $C$)', 'an ideal differentiator (input $C$, feedback $R$)', 'a first-order active low-pass filter (input $R_1$, feedback $R_2$ in parallel with $C$)', 'a first-order active high-pass filter (input $R_1$ in series with $C$, feedback $R_2$)'][c];
        const opts = ['tends to zero', 'tends to $R_2/R_1$', 'grows without limit (in practice until the op-amp saturates or runs out of bandwidth)', 'equals 1'];
        const ans = [[2, 0], [0, 2], [1, 0], [0, 1]][c][hi ? 1 : 0];
        const o = Q5.mcqOptions(r, opts[ans], opts.filter((x, i) => i !== ans));
        return { q: `For ${circ}, the size of the voltage gain at ${hi ? 'very high' : 'very low'} frequency`, ...o,
          sol: `Use the impedances $Z_C = 1/j\\omega C$, which is huge at low $\\omega$ and tiny at high $\\omega$; the gain is $-Z_f/Z_{in}$. Integrator: $1/\\omega RC$ (huge at low, zero at high). Differentiator: $\\omega RC$ (zero at low, huge at high). Low-pass: $R_2\\parallel C$ is $R_2$ at low $\\omega$, giving $R_2/R_1$, and shorts at high $\\omega$, giving 0. High-pass: the series $C$ blocks at low $\\omega$ (gain 0) and vanishes at high $\\omega$ (gain $R_2/R_1$).`,
          trap: 'Treat a capacitor as an open circuit at DC and a short at very high frequency.' };
      } },
    { id: 'opa-t25', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'instrumentation', unit: 'kΩ',
      make(r) {
        const R = Q5.int(r, 10, 50), k = Q5.choose(r, [1, 2, 5]), G = k * Q5.int(r, 5, 100);
        const RG = 2 * R / (G / k - 1);
        return { q: `A three-op-amp instrumentation amplifier has gain $G = \\left(1 + \\dfrac{2R}{R_G}\\right)\\dfrac{R_3}{R_2}$, with $R = ${R}$ k$\\Omega$ in its input stage and $R_3/R_2 = ${k}$ in its difference stage. For an overall gain of $${G}$, the gain resistor $R_G$ must be ______ k$\\Omega$ (to three decimal places).`,
          answer: Q5.round(RG, 3), tol: Math.max(0.002, Q5.round(0.001 * RG, 4)), R, k, G,
          sol: `$1 + \\dfrac{2R}{R_G} = \\dfrac{G}{R_3/R_2} = ${G / k}$, so $R_G = \\dfrac{2R}{${G / k} - 1} = \\dfrac{${2 * R}}{${G / k - 1}} = ${Q5.round(RG, 3)}$ k$\\Omega$.`,
          trap: 'Divide out the difference-stage gain first; then only the first stage depends on $R_G$.' };
      },
      verify: (p) => { const g = (x) => (1 + 2 * p.R / x) * p.k - p.G; let lo = 1e-6, hi = 1e6; for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); if (g(m) > 0) lo = m; else hi = m; } return Math.sqrt(lo * hi); } },
    { id: 'opa-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'inverting', unit: 'V',
      make(r) {
        const Rin = choose(r, [1, 2, 4.7, 5, 10, 20]), k = choose(r, [2, 3, 4, 5, 10]), Rf = round(Rin * k, 2);
        const Vin = pick(r, -1, 1, 0.1) || 0.5;
        const Vo = -(Rf / Rin) * Vin;
        return { q: `An ideal inverting amplifier has $R_{in} = ${Rin}$ k$\\Omega$ and $R_f = ${Rf}$ k$\\Omega$, with $\\pm15$ V supplies. For a DC input of $${Vin}$ V the output is ______ V (to two decimal places).`,
          answer: round(Vo, 2), tol: 0.01, unit: 'V', Rin, Rf, Vin,
          sol: `$V_o = -(R_f/R_{in})V_{in} = -(${Rf}/${Rin})\\times${Vin} = ${round(Vo, 2)}$ V, well inside the supplies.`,
          trap: 'Dropping the minus sign of the inverting gain.' };
      },
      verify: (p) => -(p.Rf / p.Rin) * p.Vin },
    { id: 'opa-g02', type: 'nat', level: 1, exams: ['jam'], sub: 'non-inverting', unit: 'V',
      make(r) {
        const R1 = choose(r, [1, 2.2, 4.7, 10]), Rf = choose(r, [4.7, 10, 22, 33, 47, 100]);
        const Vin = pick(r, 0.05, 1, 0.05);
        const Vo = (1 + Rf / R1) * Vin;
        return { q: `A non-inverting amplifier has $R_f = ${Rf}$ k$\\Omega$ and $R_1 = ${R1}$ k$\\Omega$ (to ground). For an input of $${Vin}$ V the output is ______ V (to two decimal places).`,
          answer: round(Vo, 2), tol: Math.max(0.01, round(Vo * 0.003, 2)), unit: 'V', R1, Rf, Vin,
          sol: `Gain $= 1 + R_f/R_1 = 1 + ${Rf}/${R1} = ${round(1 + Rf / R1, 4)}$, so $V_o = ${round(1 + Rf / R1, 4)}\\times${Vin} = ${round(Vo, 2)}$ V.`,
          trap: 'Using $R_f/R_1$ without the added 1.' };
      },
      verify: (p) => (1 + p.Rf / p.R1) * p.Vin },
    { id: 'opa-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'summing', unit: 'V',
      make(r) {
        const Rf = choose(r, [10, 20, 30, 50, 100]), R1 = choose(r, [10, 20, 50, 100]), R2 = choose(r, [10, 20, 25, 50]);
        const V1 = pick(r, -1, 1, 0.1), V2 = pick(r, -1, 1, 0.1);
        const Vo = -Rf * (V1 / R1 + V2 / R2);
        return { q: `An inverting summing amplifier has $R_f = ${Rf}$ k$\\Omega$. $V_1 = ${V1}$ V enters through $${R1}$ k$\\Omega$ and $V_2 = ${V2}$ V through $${R2}$ k$\\Omega$. Assuming the op-amp does not saturate, the output is ______ V (to two decimal places).`,
          answer: round(Vo, 2), tol: 0.01, unit: 'V', Rf, R1, R2, V1, V2,
          sol: `$V_o = -R_f(V_1/R_1 + V_2/R_2) = -${Rf}(${V1}/${R1} + ${V2}/${R2}) = ${round(Vo, 2)}$ V.`,
          trap: 'Each input has its own weight $R_f/R_i$.' };
      },
      verify: (p) => -p.Rf * (p.V1 / p.R1 + p.V2 / p.R2) },
    { id: 'opa-g04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'slew rate', unit: 'kHz',
      make(r) {
        const SR = choose(r, [0.3, 0.5, 1, 2, 5, 10, 13]), Vp = choose(r, [1, 2, 5, 8, 10, 12]);
        const f = SR * 1e6 / (2 * Math.PI * Vp) / 1e3;
        return { q: `An op-amp has slew rate $${SR}$ V/$\\mu$s. The highest frequency for an undistorted sine output of $${Vp}$ V peak is ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.005, 1)), unit: 'kHz', SR, Vp,
          sol: `$f_{max} = SR/(2\\pi V_p) = ${SR}\\times10^6/(2\\pi\\times${Vp}) = ${round(f * 1000, 0)}$ Hz $= ${round(f, 1)}$ kHz.`,
          trap: 'Using peak-to-peak amplitude, or leaving out the $2\\pi$.' };
      },
      verify: (p) => p.SR * 1e6 / (2 * Math.PI * p.Vp) / 1e3 },
    { id: 'opa-g05', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'gain-bandwidth', unit: 'kHz',
      make(r) {
        const GBW = choose(r, [1, 2, 3, 4, 8, 10]), inv = r() < 0.5, k = choose(r, [4, 9, 19, 24, 49, 99]);
        const noise = inv ? 1 + k : k;
        const f = GBW * 1000 / noise;
        return { q: `An op-amp with gain-bandwidth product $${GBW}$ MHz is used as ${inv ? `an inverting amplifier of gain $-${k}$` : `a non-inverting amplifier of gain $${k}$`}. Its closed-loop bandwidth is ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.005, 1)), unit: 'kHz', GBW, noise,
          sol: inv ? `For an inverting stage the bandwidth is set by the noise gain $1 + R_f/R_{in} = ${noise}$: $f = ${GBW}\\text{ MHz}/${noise} = ${round(f, 1)}$ kHz.` : `$f = \\text{GBW}/\\text{gain} = ${GBW}\\text{ MHz}/${k} = ${round(f, 1)}$ kHz.`,
          trap: 'For an inverting amplifier divide by $1 + R_f/R_{in}$, not by $R_f/R_{in}$.' };
      },
      verify: (p) => p.GBW * 1000 / p.noise },
    { id: 'opa-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'integrator', unit: 'V',
      make(r) {
        let R, C, Vin, t, RC, Vo;
        do {
          R = choose(r, [1, 10, 22, 47, 100]); C = choose(r, [0.1, 0.47, 1, 2.2, 10]); Vin = pick(r, -2, 2, 0.5) || 1; t = choose(r, [1, 2, 5, 10, 20, 50]);
          RC = R * 1e3 * C * 1e-6; Vo = -Vin * t * 1e-3 / RC;
        } while (Math.abs(Vo) > 12 || Math.abs(Vo) < 0.05);
        return { q: `An ideal integrator has $R = ${R}$ k$\\Omega$ and $C = ${C}\\ \\mu$F; its output starts at $0$ V and its supplies are $\\pm15$ V. A constant input of $${Vin}$ V is applied. After $${t}$ ms the output is ______ V (to two decimal places).`,
          answer: round(Vo, 2), tol: Math.max(0.01, round(Math.abs(Vo) * 0.005, 2)), unit: 'V', R, C, Vin, t,
          sol: `$RC = ${round(RC * 1000, 4)}$ ms. $V_o = -V_{in}t/RC = -${Vin}\\times${t}/${round(RC * 1000, 4)} = ${round(Vo, 2)}$ V.`,
          trap: 'The output ramps with the opposite sign to the input.' };
      },
      verify: (p) => -p.Vin * p.t * 1e-3 / (p.R * 1e3 * p.C * 1e-6) },
    { id: 'opa-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'Schmitt trigger', unit: 'V',
      make(r) {
        const Vs = choose(r, [10, 12, 13, 14, 15]), R1 = choose(r, [1, 2.2, 4.7, 10]), R2 = choose(r, [10, 22, 47, 100]);
        const VT = Vs * R1 / (R1 + R2);
        return { q: `An inverting Schmitt trigger saturates at $\\pm${Vs}$ V. The output feeds the non-inverting input through $R_2 = ${R2}$ k$\\Omega$, and $R_1 = ${R1}$ k$\\Omega$ joins the non-inverting input to ground. The upper switching threshold is ______ V (to two decimal places).`,
          answer: round(VT, 2), tol: 0.01, unit: 'V', Vs, R1, R2,
          sol: `$V_{UT} = V_{sat}R_1/(R_1 + R_2) = ${Vs}\\times${R1}/${round(R1 + R2, 2)} = ${round(VT, 2)}$ V. The lower threshold is $-${round(VT, 2)}$ V.`,
          trap: 'Using $R_1/R_2$ instead of $R_1/(R_1 + R_2)$.' };
      },
      verify: (p) => p.Vs * p.R1 / (p.R1 + p.R2) },
    { id: 'opa-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'finite gain',
      make(r) {
        const A = choose(r, [200, 500, 1000, 2000, 5000]), G = choose(r, [5, 10, 20, 50, 100]);
        const b = 1 / G, Acl = A / (1 + A * b);
        return { q: `A non-inverting amplifier is designed for an ideal gain of $${G}$ (feedback fraction $\\beta = 1/${G}$), but the op-amp\'s open-loop gain is only $${A}$. The actual closed-loop gain is ______ (to three decimal places).`,
          answer: round(Acl, 3), tol: Math.max(0.002, round(Acl * 0.0005, 3)), A, G,
          sol: `$A_{cl} = A/(1 + A\\beta) = ${A}/(1 + ${A}/${G}) = ${A}/${round(1 + A / G, 4)} = ${round(Acl, 3)}$. The loop gain $A\\beta = ${round(A / G, 2)}$ sets the error.`,
          trap: 'Answering the ideal $1/\\beta$.' };
      },
      verify: (p) => p.A / (1 + p.A / p.G) },
    { id: 'opa-g09', type: 'mcq', level: 2, exams: ['jam'], sub: 'difference',
      make(r) {
        const k = choose(r, [1, 2, 3, 5, 10]), V1 = pick(r, -2, 2, 0.5);
        let V2; do { V2 = pick(r, -2, 2, 0.5); } while (V2 === V1);
        const Vo = k * (V2 - V1);
        const show = (v) => `$${round(v, 2)}$ V`;
        const o = mcqOptions(r, Vo, [k * (V1 - V2), k * (V1 + V2), V2 - V1 === Vo ? -k * (V1 + V2) : V2 - V1, (1 + k) * V2 - k * V1], show);
        return { q: `A difference amplifier has $R_1 = R_3 = 10$ k$\\Omega$ and $R_2 = R_4 = ${10 * k}$ k$\\Omega$. $V_1 = ${V1}$ V drives the inverting side and $V_2 = ${V2}$ V the non-inverting side. The output is`, ...o,
          sol: `With matched ratios $R_2/R_1 = R_4/R_3 = ${k}$, $V_o = ${k}(V_2 - V_1) = ${k}(${V2} - (${V1})) = ${round(Vo, 2)}$ V.`,
          trap: 'Swapping which input carries the minus sign.' };
      } },
    ...r4.gens,
  ],
};
