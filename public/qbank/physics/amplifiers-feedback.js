// Amplifiers and feedback at GATE / CSIR NET level: small-signal gain with r_o and emitter degeneration, input
// resistance, coupling-capacitor cut-offs, the Miller effect and dominant poles, cascaded bandwidth, rise time and
// sag, Bode plots in dB; negative feedback (desensitivity, bandwidth extension, the four topologies and their effect on
// impedances, distortion), loop gain, phase and gain margin, two- and three-pole loops, compensation; differential
// pairs and CMRR, current mirrors, cascodes; power amplifier classes and efficiency. The JAM topic `transistors`
// covers biasing and load lines. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './amplifiers-feedback.more.gen.js';
import more2 from './amplifiers-feedback.more2.gen.js';
import r4 from './amplifiers-feedback.r4.gen.js';

const G = ['gate', 'net'];
const db = (x) => 20 * Math.log10(x);
// unity-crossing frequency of T0 / ((1 + jf/f1)(1 + jf/f2)), by bisection on a log scale (deterministic, no retries)
const cross2 = (T0, f1, f2) => { let lo = f1 * 1e-3, hi = f2 * 1e3 * T0; const T = (f) => T0 / Math.sqrt((1 + (f / f1) ** 2) * (1 + (f / f2) ** 2)); for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); if (T(m) > 1) lo = m; else hi = m; } return lo; };
const deg = (x) => x * 180 / Math.PI;

export default {
  topic: 'amplifiers-feedback',
  items: [
    // ---------- level 1 ----------
    { id: 'af-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'feedback basics',
      q: 'An amplifier of gain $A$ has a fraction $\\beta$ of its output fed back to subtract from the input. The closed-loop gain is',
      options: ['$A/(1 - A\\beta)$', '$A/(1 + A\\beta)$', '$A(1 + A\\beta)$', '$1/(A\\beta)$ exactly'], answer: 1,
      sol: 'The amplifier sees $x_i = x_s - \\beta x_o$ and gives $x_o = Ax_i$. So $x_o = A(x_s - \\beta x_o)$ and $x_o/x_s = A/(1 + A\\beta)$. When the loop gain $A\\beta\\gg1$ this tends to $1/\\beta$, set by the feedback network alone.',
      trap: '$A/(1 - A\\beta)$ is positive feedback; $1/\\beta$ is only the limit for large loop gain.' },
    { id: 'af-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'decibels',
      q: 'A voltage gain of 100 expressed in decibels is',
      options: ['20 dB', '10 dB', '40 dB', '100 dB'], answer: 2,
      sol: 'For voltage (or current) ratios, gain in dB $= 20\\log_{10}(100) = 40$ dB. A power ratio of 100 would be $10\\log_{10}100 = 20$ dB.',
      trap: 'Using $10\\log$ (the power formula) for a voltage ratio.' },
    { id: 'af-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Bode plots',
      q: 'Well above the corner frequency of a single-pole low-pass amplifier, the magnitude of its gain falls at',
      options: ['20 dB per decade (6 dB per octave)', '40 dB per decade', '3 dB per decade', '10 dB per octave'], answer: 0,
      sol: '$|A| = A_0/\\sqrt{1 + (f/f_H)^2}\\approx A_0f_H/f$ for $f\\gg f_H$: ten times the frequency, one tenth of the gain, which is $-20$ dB. Doubling the frequency halves it: $-6$ dB per octave. Each extra pole adds another $-20$ dB/decade.',
      trap: 'The 3 dB figure is the drop at the corner itself, not the slope.' },
    { id: 'af-004', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'feedback basics',
      q: 'An amplifier with open-loop gain $1000$ has negative feedback with $\\beta = 0.009$. Its closed-loop gain is ______.',
      answer: 100, tol: 0, calc: () => 1000 / (1 + 1000 * 0.009),
      sol: 'Loop gain $A\\beta = 9$, so $A_f = 1000/(1 + 9) = 100$.',
      trap: 'Using $1/\\beta = 111$ ignores that the loop gain here is not large.' },
    { id: 'af-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'feedback basics',
      q: 'Which of these is reduced, rather than improved, when negative feedback is applied to an amplifier?',
      options: ['Bandwidth', 'Harmonic distortion', 'Sensitivity of the gain to transistor changes', 'The magnitude of the gain'], answer: 3,
      sol: 'Negative feedback trades gain for everything else: the gain falls by the factor $1 + A\\beta$, while bandwidth grows by about that factor, and distortion and sensitivity to $A$ fall by it.',
      trap: 'Reading "bandwidth" as something feedback reduces: for a single-pole amplifier it rises.' },
    { id: 'af-006', type: 'msq', level: 1, exams: G, sub: 'feedback topologies', format: 'multi',
      q: 'In voltage-series (series-shunt) negative feedback, the output voltage is sampled and a voltage is fed back in series with the input. Which statements are correct?',
      options: ['The input resistance rises by the factor $1 + A\\beta$', 'The output resistance falls by the factor $1 + A\\beta$', 'The voltage gain is stabilised near $1/\\beta$', 'The output resistance rises by the factor $1 + A\\beta$'], answer: [0, 1, 2],
      sol: 'Series mixing opposes the input voltage, so the source pushes less current for the same voltage: $R_{if} = R_i(1 + A\\beta)$. Shunt sampling of the output voltage fights any change in it, so the output looks stiffer: $R_{of} = R_o/(1 + A\\beta)$. The non-inverting op-amp amplifier is the textbook example.',
      trap: 'Output resistance rises only when the output current is sampled (series sampling).' },

    // ---------- level 2 ----------
    { id: 'af-007', type: 'nat', level: 2, exams: G, sub: 'desensitivity', unit: '%',
      q: 'An amplifier has loop gain $A\\beta = 99$. Its open-loop gain $A$ drifts by $20\\%$. The closed-loop gain changes by about ______ % (small-change estimate).',
      answer: 0.2, tol: 0.01, calc: () => 20 / (1 + 99),
      sol: 'Differentiate $A_f = A/(1 + A\\beta)$: $\\dfrac{dA_f}{A_f} = \\dfrac1{1 + A\\beta}\\dfrac{dA}{A}$. So the change is $20\\%/100 = 0.2\\%$.',
      trap: 'Dividing by $A\\beta = 99$ instead of $1 + A\\beta = 100$ changes little here, but matters when the loop gain is small.' },
    { id: 'af-008', type: 'nat', level: 2, exams: G, sub: 'bandwidth extension', unit: 'kHz',
      q: 'An amplifier has midband gain $2000$ and a single upper cut-off at $50$ kHz. Negative feedback with $\\beta = 0.0045$ is applied. The new upper cut-off is ______ kHz.',
      answer: 500, tol: 1, calc: () => 50 * (1 + 2000 * 0.0045),
      sol: 'Loop gain $A\\beta = 9$, so $1 + A\\beta = 10$. With one pole, $A(s) = A_0/(1 + s/\\omega_H)$ gives $A_f(s) = \\dfrac{A_0/(1 + A_0\\beta)}{1 + s/[\\omega_H(1 + A_0\\beta)]}$: gain $200$, cut-off $50\\times10 = 500$ kHz. The gain-bandwidth product stays $10^8$ Hz.',
      trap: 'Dividing the cut-off by the factor instead of multiplying (that is what happens to a lower cut-off).' },
    { id: 'af-009', type: 'mcq', level: 2, exams: G, sub: 'Miller effect',
      q: 'A capacitance of $2$ pF connects the input and output of an inverting stage with voltage gain $-99$. Seen from the input, it behaves like a capacitance to ground of',
      options: ['2 pF', '198 pF', '100 pF', '200 pF'], answer: 3,
      sol: 'The voltage across the capacitor is $v_i - (-99v_i) = 100v_i$, so it draws 100 times the current a grounded 2 pF would: $C_M = C(1 - K) = 2\\times100 = 200$ pF.',
      trap: '$C|K| = 198$ pF forgets the input side of the capacitor also moves.' },
    { id: 'af-010', type: 'nat', level: 2, exams: G, sub: 'emitter degeneration',
      q: 'A common-emitter stage has $g_m = 40$ mA/V, collector resistor $5$ k$\\Omega$ and an unbypassed emitter resistor of $200\\,\\Omega$ ($r_o$ and the load ignored). The magnitude of its voltage gain is ______ (to one decimal place).',
      answer: 22.2, tol: 0.1, calc: () => 40 * 5 / (1 + 40 * 0.2),
      sol: '$|A_v| = \\dfrac{g_mR_C}{1 + g_mR_E} = \\dfrac{40\\times5}{1 + 40\\times0.2} = \\dfrac{200}{9} = 22.2$. The emitter resistor is local series feedback with loop gain $g_mR_E = 8$.',
      trap: 'Using $R_C/R_E = 25$ is the large-loop-gain limit, not exact.' },
    { id: 'af-011', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'low-frequency response',
      q: 'A $10\\,\\mu$F coupling capacitor feeds an amplifier whose input resistance is $2$ k$\\Omega$ (ideal voltage source driving it). The lower 3 dB frequency it sets is about',
      options: ['50 Hz', '8.0 Hz', '0.8 Hz', '80 Hz'], answer: 1,
      sol: 'The capacitor and the input resistance form a high-pass $RC$: $f_L = 1/(2\\pi RC) = 1/(2\\pi\\times2000\\times10^{-5}) = 7.96$ Hz.',
      trap: 'Forgetting the $2\\pi$ gives 50 Hz.' },
    { id: 'af-012', type: 'nat', level: 2, exams: G, sub: 'cascaded bandwidth', unit: 'MHz',
      q: 'Three identical non-interacting amplifier stages, each with a single upper cut-off at $1$ MHz, are cascaded. The overall upper 3 dB frequency is ______ MHz (to two decimal places).',
      answer: 0.51, tol: 0.005, calc: () => Math.sqrt(2 ** (1 / 3) - 1),
      sol: 'Each stage gives $1/\\sqrt{1 + x^2}$ with $x = f/f_1$. Three in a row: $(1 + x^2)^{-3/2} = 1/\\sqrt2$, so $1 + x^2 = 2^{1/3}$ and $x = \\sqrt{2^{1/3} - 1} = 0.510$. The overall bandwidth is $0.51$ MHz.',
      trap: 'Thinking the bandwidth stays 1 MHz, or dividing by 3.' },
    { id: 'af-013', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'power amplifiers',
      q: 'The highest possible collector efficiency of an ideal class B push-pull amplifier with sinusoidal output is',
      options: ['25%', '50%', '78.5%', '100%'], answer: 2,
      sol: 'At full swing $V_p = V_{CC}$: $P_{out} = V_{CC}^2/2R_L$ and the supply delivers $P_{dc} = 2V_{CC}^2/(\\pi R_L)$. The ratio is $\\pi/4 = 78.5\\%$. Class A reaches 25% with a resistive load and 50% with a transformer.',
      trap: '50% is class A with transformer coupling.' },
    { id: 'af-014', type: 'mcq', level: 2, exams: G, sub: 'differential amplifier',
      q: 'A differential amplifier has differential gain $200$ and common-mode gain $0.02$. Its common-mode rejection ratio is',
      options: ['80 dB', '40 dB', '100 dB', '20 dB'], answer: 0,
      sol: 'CMRR $= |A_d/A_{cm}| = 200/0.02 = 10^4$, which is $20\\log_{10}10^4 = 80$ dB.',
      trap: 'Using $10\\log$ gives 40 dB.' },
    { id: 'af-015', type: 'msq', level: 2, exams: G, sub: 'rise time', format: 'multi',
      q: 'An amplifier has a single high-frequency pole at $f_H$ and is driven by a voltage step. Which statements are correct?',
      options: ['Its 10-90% rise time is about $0.35/f_H$', 'Doubling $f_H$ halves the rise time', 'The output overshoots before settling', 'Under negative feedback its gain-bandwidth product stays the same'], answer: [0, 1, 3],
      sol: 'One pole gives $v_o\\propto1 - e^{-t/\\tau}$ with $\\tau = 1/(2\\pi f_H)$; from 10% to 90% takes $\\tau\\ln9 = 2.2\\tau = 0.35/f_H$. A first-order response never overshoots. Feedback divides the gain and multiplies $f_H$ by the same $1 + A_0\\beta$.',
      trap: 'Overshoot needs at least two poles (a complex pair).' },
    { id: 'af-016', type: 'nat', level: 2, exams: G, sub: 'feedback basics',
      q: 'An amplifier with open-loop gain $2000$ gives a closed-loop gain of $50$ with negative feedback. The feedback factor $\\beta$ is ______ (to four decimal places).',
      answer: 0.0195, tol: 0.0002, calc: () => (2000 / 50 - 1) / 2000,
      sol: '$1 + A\\beta = A/A_f = 2000/50 = 40$, so $A\\beta = 39$ and $\\beta = 39/2000 = 0.0195$.',
      trap: 'Taking $\\beta = 1/A_f = 0.02$ assumes infinite loop gain.' },

    // ---------- level 3 ----------
    { id: 'af-017', type: 'nat', level: 3, exams: G, sub: 'input resistance', unit: 'kΩ',
      q: 'A transistor with $\\beta = 100$ is biased at $I_C = 1$ mA ($V_T = 25$ mV) in a common-emitter stage with an unbypassed $500\\,\\Omega$ emitter resistor. The small-signal resistance looking into the base is ______ k$\\Omega$ (to one decimal place).',
      answer: 53, tol: 0.1, calc: () => 100 * 0.025 / 1 + 101 * 0.5,
      sol: '$r_\\pi = \\beta V_T/I_C = 2.5$ k$\\Omega$. The emitter resistor carries $(\\beta + 1)$ times the base current, so it appears $(\\beta + 1)$ times larger from the base: $R_{in} = r_\\pi + (\\beta + 1)R_E = 2.5 + 101\\times0.5 = 53.0$ k$\\Omega$.',
      trap: 'Adding $R_E$ itself rather than $(\\beta + 1)R_E$.' },
    { id: 'af-018', type: 'mcq', level: 3, exams: G, sub: 'Miller effect',
      q: 'A common-emitter stage is driven from a $1$ k$\\Omega$ source (take $r_\\pi\\gg1$ k$\\Omega$). It has $C_\\pi = 10$ pF, $C_\\mu = 1$ pF and a midband gain of $-49$. The input pole is at about',
      options: ['15.9 MHz', '3.18 MHz', '2.65 MHz', '159 MHz'], answer: 2,
      sol: 'Miller: $C_\\mu$ appears at the input as $C_\\mu(1 + 49) = 50$ pF. Total input capacitance $10 + 50 = 60$ pF. $f_p = 1/(2\\pi\\times10^3\\times60\\times10^{-12}) = 2.65$ MHz.',
      trap: '15.9 MHz ignores $C_\\mu$; 3.18 MHz forgets $C_\\pi$. The tiny feedback capacitor dominates.' },
    { id: 'af-019', type: 'nat', level: 3, exams: G, sub: 'feedback topologies', unit: 'Ω',
      q: 'A voltage amplifier has output resistance $2$ k$\\Omega$ and open-loop gain $500$. Voltage-series feedback with $\\beta = 0.1$ is applied. The output resistance becomes ______ $\\Omega$ (to one decimal place).',
      answer: 39.2, tol: 0.2, calc: () => 2000 / (1 + 500 * 0.1),
      sol: 'Sampling the output voltage divides the output resistance by $1 + A\\beta = 51$: $R_{of} = 2000/51 = 39.2\\,\\Omega$.',
      trap: 'Multiplying by 51 (that is what series mixing does to the input resistance).' },
    { id: 'af-020', type: 'mcq', level: 3, exams: G, sub: 'feedback topologies',
      q: 'An amplifier with input resistance $5$ k$\\Omega$ is given shunt (current) mixing at its input with loop gain 24. The input resistance becomes',
      options: ['125 kΩ', '200 Ω', '5 kΩ', '208 Ω'], answer: 1,
      sol: 'Shunt mixing draws extra current from the source through the feedback path, so the input looks smaller: $R_{if} = R_i/(1 + A\\beta) = 5000/25 = 200\\,\\Omega$. The inverting op-amp input is the extreme case (a virtual ground).',
      trap: '208 Ω divides by 24 instead of 25.' },
    { id: 'af-021', type: 'mcq', level: 3, exams: G, sub: 'stability',
      q: 'The loop gain of a feedback amplifier falls to magnitude 1 at a frequency where its phase is $-135^\\circ$. The phase margin is',
      options: ['135°', '−45°', '90°', '45°'], answer: 3,
      sol: 'Phase margin $= 180^\\circ + \\angle T$ at the frequency where $|T| = 1$: $180 - 135 = 45^\\circ$. The loop would oscillate if the phase reached $-180^\\circ$ with $|T|\\ge1$; 45° is a common minimum, 60° gives little ringing.',
      trap: 'Reading the phase itself as the margin.' },
    { id: 'af-022', type: 'nat', level: 3, exams: G, sub: 'stability',
      q: 'A loop gain has three identical real poles: $T(s) = T_0/(1 + s/\\omega_p)^3$. The largest $T_0$ for which the closed loop is stable is ______.',
      answer: 8, tol: 0, calc: () => (1 + 3) ** 1.5,
      sol: 'The phase reaches $-180^\\circ$ when each pole gives $-60^\\circ$: $\\omega/\\omega_p = \\tan60^\\circ = \\sqrt3$. There $|T| = T_0/(1 + 3)^{3/2} = T_0/8$. Stability needs $|T| < 1$ at that frequency, so $T_0 < 8$. (This is also the gain condition of the three-section RC phase-shift oscillator with buffered sections.)',
      trap: 'Taking $\\omega = \\omega_p$, where each pole gives only $-45^\\circ$.' },
    { id: 'af-023', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'power amplifiers', format: 'multi',
      q: 'Which statements about power amplifier classes are correct?',
      options: ['In class A the transistor conducts over the whole cycle (360°)', 'In class B each transistor conducts for half the cycle (180°)', 'Class C conducts for less than 180° and is used with tuned loads at radio frequency', 'Class AB conducts for more than 360°'], answer: [0, 1, 2],
      sol: 'Conduction angles: A 360°, AB between 180° and 360°, B 180°, C below 180°. A class C collector current is a train of pulses; a tuned circuit picks out the fundamental, giving efficiencies above 78.5%. No class conducts for more than a full cycle.',
      trap: 'AB sits between A and B; it cannot exceed the full cycle.' },
    { id: 'af-024', type: 'nat', level: 3, exams: G, sub: 'power amplifiers', unit: '%',
      q: 'A class B push-pull stage runs from $\\pm20$ V into an $8\\,\\Omega$ load and delivers a sine wave of $16$ V peak. Its efficiency is ______ % (to one decimal place).',
      answer: 62.8, tol: 0.2, calc: () => Math.PI / 4 * 16 / 20 * 100,
      sol: '$P_{out} = V_p^2/2R_L = 256/16 = 16$ W. Each supply delivers current only on its half cycle, average $I_p/\\pi$, so $P_{dc} = 2V_{CC}V_p/(\\pi R_L) = 2\\times20\\times16/(8\\pi) = 25.46$ W. Efficiency $= 16/25.46 = 62.8\\% = (\\pi/4)(V_p/V_{CC})$.',
      trap: 'Quoting 78.5%, which needs a full swing $V_p = V_{CC}$.' },
    { id: 'af-025', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'power amplifiers',
      q: 'Crossover distortion in a class B complementary push-pull output stage is caused by',
      options: ['the dead band near zero input, where neither transistor is conducting until $|v_{BE}|$ reaches about 0.6 V', 'saturation of both transistors at the peaks', 'unequal current gains of the npn and pnp transistors', 'the output coupling capacitor'], answer: 0,
      sol: 'Each transistor needs about 0.6-0.7 V of base-emitter drive before it conducts, so the output sticks at zero while the input crosses through that band. Biasing both transistors slightly on (two diodes or a $V_{BE}$ multiplier between the bases) gives class AB and removes the dead band; overall negative feedback reduces what is left.',
      trap: 'Clipping at the peaks is a different distortion.' },
    { id: 'af-026', type: 'mcq', level: 3, exams: G, sub: 'differential amplifier',
      q: 'A BJT differential pair has a tail current of $1$ mA from a current source of output resistance $50$ k$\\Omega$; the output is taken from one collector ($V_T = 25$ mV, large $\\beta$). Its CMRR is about',
      options: ['40 dB', '54 dB', '66 dB', '60 dB'], answer: 3,
      sol: 'Each transistor carries 0.5 mA, so $g_m = 20$ mA/V. Single-ended: $A_d = g_mR_C/2$ and $A_{cm}\\approx R_C/(2R_{EE})$. CMRR $= g_mR_{EE} = 20\\times50 = 1000$, that is 60 dB.',
      trap: 'Using the whole tail current in $g_m$ (40 mA/V) gives 66 dB.' },
    { id: 'af-027', type: 'mcq', level: 3, exams: G, sub: 'Bode plots',
      q: 'An amplifier has a midband gain of 60 dB and real poles at 1 kHz and 100 kHz. On the asymptotic Bode plot, its gain at 10 kHz is',
      options: ['60 dB', '20 dB', '40 dB', '57 dB'], answer: 2,
      sol: 'From 1 kHz the gain falls at 20 dB/decade, so one decade later (10 kHz) it is $60 - 20 = 40$ dB. The second pole only starts to act near 100 kHz; beyond it the slope is 40 dB/decade.',
      trap: '57 dB is the true gain at the first corner (1 kHz), not at 10 kHz.' },
    { id: 'af-028', type: 'mcq', level: 3, exams: G, sub: 'cascode',
      q: 'Why does a cascode (common-emitter stage feeding a common-base stage) have a much wider bandwidth than a plain common-emitter stage with the same gain?',
      options: ['The common-base stage has a higher current gain', 'The input transistor sees a very small collector load (about $1/g_m$), so its gain is about $-1$ and $C_\\mu$ is hardly Miller-multiplied', 'It needs no bias current', 'The output resistance is lower'], answer: 1,
      sol: 'The emitter of the common-base transistor presents about $1/g_m$ to the input transistor, so the input stage\'s voltage gain is near $-1$ and its $C_\\mu$ appears only doubled. The full voltage gain is developed at the output node, where no Miller multiplication occurs. As a bonus the output resistance rises to about $\\beta r_o$.',
      trap: 'The cascode raises output resistance, it does not lower it.' },

    // ---------- level 4 ----------
    { id: 'af-029', type: 'nat', level: 4, exams: G, sub: 'two-pole feedback',
      q: 'A loop gain has two real poles: $T(s) = T_0/[(1 + s/\\omega_1)(1 + s/\\omega_2)]$ with $\\omega_2 = 10\\,\\omega_1$. The value of $T_0$ that makes the closed-loop response maximally flat (pole $Q = 1/\\sqrt2$) is ______ (to two decimal places).',
      answer: 5.05, tol: 0.02, calc: () => 121 / 20 - 1,
      sol: 'The closed-loop poles are roots of $s^2 + (\\omega_1 + \\omega_2)s + (1 + T_0)\\omega_1\\omega_2 = 0$, so $\\omega_0^2 = (1 + T_0)\\omega_1\\omega_2$ and $Q = \\omega_0/(\\omega_1 + \\omega_2)$. $Q^2 = \\tfrac12$ gives $1 + T_0 = (\\omega_1 + \\omega_2)^2/(2\\omega_1\\omega_2) = 121/20 = 6.05$, so $T_0 = 5.05$.',
      trap: 'Setting $Q = 1/2$ (critical damping) gives $T_0 = 2.025$.' },
    { id: 'af-030', type: 'nat', level: 4, exams: G, sub: 'stability', unit: 'degrees',
      q: 'A loop gain has DC value $100$ and real poles at $1$ kHz and $100$ kHz. Its phase margin is ______ degrees (to one decimal place).',
      answer: 52.6, tol: 0.5, calc: () => { const f = cross2(100, 1e3, 1e5); return 180 - deg(Math.atan(f / 1e3) + Math.atan(f / 1e5)); },
      sol: 'Find where $|T| = 1$: $\\dfrac{100}{\\sqrt{(1 + (f/1\\text{k})^2)(1 + (f/100\\text{k})^2)}} = 1$. With $u = f^2$ this is a quadratic; its root is $f\\approx78.6$ kHz. The phase there is $-\\arctan78.6 - \\arctan0.786 = -89.27^\\circ - 38.17^\\circ = -127.4^\\circ$. Phase margin $= 180 - 127.4 = 52.6^\\circ$.',
      trap: 'Assuming crossover at the second pole (45° margin) ignores that the gain there is already below 1.' },
    { id: 'af-031', type: 'mcq', level: 4, exams: G, sub: 'distortion and noise',
      q: 'Which statement about negative feedback is correct?',
      options: ['It reduces distortion produced in the output stage by about $1 + A\\beta$, if the gain is restored by a clean preamplifier', 'It improves the signal-to-noise ratio of noise that enters at the amplifier input', 'It always makes an amplifier more stable', 'It increases the gain-bandwidth product of a single-pole amplifier'], answer: 0,
      sol: 'Disturbances generated inside the loop (output-stage distortion, hum at the output) are divided by $1 + A\\beta$ relative to the signal once the signal is raised again to the same output. Noise added at the input is indistinguishable from the signal and is not helped. Too much feedback with several poles can cause oscillation. For one pole the gain-bandwidth product stays constant.',
      trap: 'Feedback does nothing for input noise: it is amplified exactly like the signal.' },
    { id: 'af-032', type: 'msq', level: 4, exams: G, sub: 'Miller effect', format: 'multi',
      q: 'An admittance $Y$ connects two nodes of an amplifier where $v_2 = Kv_1$. By Miller\'s theorem, which statements are correct?',
      options: ['It is equivalent to $Y(1 - K)$ from node 1 to ground and $Y(1 - 1/K)$ from node 2 to ground', 'For a large inverting gain, the output-side admittance is close to $Y$', 'For a follower with $K$ just below 1, the input-side capacitance is nearly removed (bootstrapping)', 'In a common-emitter stage the Miller effect increases the bandwidth'], answer: [0, 1, 2],
      sol: 'The current through $Y$ is $Y(v_1 - v_2) = Yv_1(1 - K)$ seen from node 1 and $Yv_2(1 - 1/K)$ seen from node 2. For $K = -100$ the output side is $1.01Y$. For $K\\to1$ the voltage across $Y$ vanishes, so it draws almost nothing: the follower bootstraps its own input capacitance. In a CE stage the multiplied input capacitance lowers the bandwidth.',
      trap: 'Miller multiplication is a problem in inverting stages and a help in followers.' },
    { id: 'af-033', type: 'nat', level: 4, exams: G, sub: 'rise time', unit: 'MHz',
      q: 'Two cascaded stages have step-response rise times of $100$ ns and $200$ ns. Treating the overall rise time as the root-sum-square, the overall upper 3 dB bandwidth is about ______ MHz (to two decimal places).',
      answer: 1.57, tol: 0.01, calc: () => 0.35 / Math.sqrt(100 ** 2 + 200 ** 2) * 1e3,
      sol: '$t_r\\approx\\sqrt{100^2 + 200^2} = 223.6$ ns. Then $f_H\\approx0.35/t_r = 0.35/(223.6\\times10^{-9}) = 1.57$ MHz.',
      trap: 'Adding rise times (300 ns) overestimates the total.' },
    { id: 'af-034', type: 'nat', level: 4, exams: G, sub: 'low-frequency response', unit: '%',
      q: 'A $100$ Hz square wave passes through an amplifier whose lower 3 dB frequency is $5$ Hz. The percentage tilt (sag) of each flat top is about ______ % (to one decimal place).',
      answer: 15.7, tol: 0.1, calc: () => Math.PI * 5 / 100 * 100,
      sol: 'During each half period $T/2$ the high-pass decays as $e^{-t/\\tau}$ with $\\tau = 1/(2\\pi f_L)$. For small sag, $P\\approx\\dfrac{T/2}{\\tau}\\times100\\% = \\dfrac{\\pi f_L}{f}\\times100\\% = \\pi\\times5/100\\times100\\% = 15.7\\%$.',
      trap: 'Using the full period $T$ doubles the tilt.' },
    { id: 'af-035', type: 'mcq', level: 4, exams: G, sub: 'current mirror',
      q: 'A simple two-transistor BJT current mirror uses matched transistors with $\\beta = 50$ (Early effect ignored). The ratio $I_{out}/I_{ref}$ is about',
      options: ['0.980', '1.000', '0.943', '0.962'], answer: 3,
      sol: 'Both transistors have the same $V_{BE}$, so the same collector current $I_C$. The reference supplies $I_C$ plus two base currents: $I_{ref} = I_C(1 + 2/\\beta)$. So $I_{out}/I_{ref} = \\beta/(\\beta + 2) = 50/52 = 0.962$.',
      trap: '$\\beta/(\\beta + 1) = 0.980$ counts only one base current.' },
    { id: 'af-036', type: 'nat', level: 4, exams: G, sub: 'small-signal gain',
      q: 'A common-emitter stage has $g_m = 40$ mA/V, $r_o = 40$ k$\\Omega$, collector resistor $10$ k$\\Omega$ and a $10$ k$\\Omega$ load, with the emitter bypassed. The magnitude of its voltage gain is ______ (to one decimal place).',
      answer: 177.8, tol: 0.5, calc: () => 40 / (1 / 10 + 1 / 40 + 1 / 10),
      sol: 'All three resistances load the collector in parallel: $10\\parallel40\\parallel10 = 1/(0.1 + 0.025 + 0.1) = 4.444$ k$\\Omega$. $|A_v| = g_mR = 40\\times4.444 = 177.8$.',
      trap: 'Ignoring $r_o$ and the load gives 400.' },

    // ---------- level 5 ----------
    { id: 'af-037', type: 'mcq', level: 5, exams: G, sub: 'distortion and noise',
      q: 'A power amplifier with gain 1000 has 10% second-harmonic distortion at full output. Negative feedback is to bring this down to 0.5% at the same output. The closed-loop gain becomes',
      options: ['200', '50', '20', '500'], answer: 1,
      sol: 'Distortion generated inside the loop falls by $1 + A\\beta$, so $1 + A\\beta = 10/0.5 = 20$. The gain falls by the same factor: $1000/20 = 50$ (a preamplifier of gain 20 restores the signal level). $\\beta = 19/1000 = 0.019$.',
      trap: '20 is the factor, not the new gain.' },
    { id: 'af-038', type: 'msq', level: 5, exams: G, sub: 'two-pole feedback', format: 'multi',
      q: 'A loop gain has two real left-half-plane poles, $T(s) = T_0/[(1 + s/\\omega_1)(1 + s/\\omega_2)]$. As $T_0$ is increased from 0, which statements about the closed-loop poles are correct?',
      options: ['They move towards each other along the real axis, meet, and then become a complex pair', 'Their sum stays equal to $-(\\omega_1 + \\omega_2)$', 'The closed loop never becomes unstable, however large $T_0$ is', 'The step-response overshoot keeps decreasing'], answer: [0, 1, 2],
      sol: 'The poles solve $s^2 + (\\omega_1 + \\omega_2)s + (1 + T_0)\\omega_1\\omega_2 = 0$. The sum of the roots is fixed at $-(\\omega_1 + \\omega_2)$, so they meet at the midpoint and then move vertically, staying in the left half plane (the phase of $T$ never reaches $-180^\\circ$). But $Q$ grows with $T_0$, so overshoot and ringing increase: a third pole would eventually make it oscillate.',
      trap: '"Never unstable" is not "well behaved": the phase margin keeps shrinking.' },
    { id: 'af-039', type: 'nat', level: 5, exams: G, sub: 'stability', unit: 'dB',
      q: 'A loop gain $T(s) = 4/(1 + s/\\omega_p)^3$ has three identical poles. Its gain margin is ______ dB (to two decimal places).',
      answer: 6.02, tol: 0.05, calc: () => 20 * Math.log10(8 / 4),
      sol: 'The phase is $-180^\\circ$ at $\\omega = \\sqrt3\\,\\omega_p$, where $|T| = 4/8 = 0.5$. Gain margin $= -20\\log_{10}0.5 = 6.02$ dB: the loop gain could double before oscillation.',
      trap: 'Evaluating $|T|$ at $\\omega_p$ (phase $-135^\\circ$) instead of at the phase crossover.' },
    { id: 'af-040', type: 'mcq', level: 5, exams: G, sub: 'compensation',
      q: 'An amplifier inside a feedback loop has DC loop gain $10^4$ and a non-dominant pole at $1$ MHz. A dominant pole is added so that the loop gain crosses unity near $1$ MHz, for a phase margin of about 45°. The dominant pole must be at about',
      options: ['100 Hz', '1 kHz', '10 Hz', '10 kHz'], answer: 0,
      sol: 'Above the dominant pole $f_d$ the loop gain is about $T_0f_d/f$. Setting it to 1 at 1 MHz: $f_d = 10^6/10^4 = 100$ Hz. At that crossover the second pole adds $-45^\\circ$ to the dominant pole\'s $-90^\\circ$, leaving about 45° of margin (a little more in fact, since the second pole also lowers the magnitude).',
      trap: 'Placing the dominant pole at $10^6/\\sqrt{10^4}$ or similar guesses; use the gain-bandwidth argument.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'af-g01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'feedback basics',
      make(r) {
        const A = choose(r, [200, 500, 1000, 2000, 5000, 1e4, 1e5]), beta = choose(r, [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1]);
        const Af = A / (1 + A * beta);
        return { q: `An amplifier with open-loop gain $${A}$ has negative feedback with $\\beta = ${beta}$. Its closed-loop gain is ______ (to two decimal places).`,
          answer: round(Af, 2), tol: Math.max(0.01, round(Af * 0.002, 2)), A, beta,
          sol: `$A\\beta = ${round(A * beta, 4)}$, so $A_f = \\dfrac{${A}}{1 + ${round(A * beta, 4)}} = ${round(Af, 2)}$ (compare $1/\\beta = ${round(1 / beta, 2)}$).`,
          trap: 'Using $1/\\beta$, which is exact only for infinite loop gain.' };
      },
      verify: (p) => p.A / (1 + p.A * p.beta) },
    { id: 'af-g02', type: 'nat', level: 3, exams: G, sub: 'desensitivity',
      make(r) {
        const A = choose(r, [500, 1000, 2000, 5000, 1e4]), Af = choose(r, [10, 20, 50, 100]), d = pick(r, 5, 50, 5);
        const beta = (A / Af - 1) / A, A2 = A * (1 - d / 100), Af2 = A2 / (1 + A2 * beta), ch = (Af - Af2) / Af * 100;
        return { q: `An amplifier of open-loop gain $${A}$ is given negative feedback for a closed-loop gain of exactly $${Af}$. If the open-loop gain then falls by $${d}\\%$, the closed-loop gain falls by ______ % (exact, to three decimal places).`,
          answer: round(ch, 3), tol: Math.max(0.002, round(ch * 0.005, 3)), unit: '%', A, Af, d,
          sol: `$\\beta = (A/A_f - 1)/A = ${round(beta, 6)}$. New $A = ${round(A2, 2)}$, so $A_f = ${round(A2, 2)}/(1 + ${round(A2 * beta, 4)}) = ${round(Af2, 4)}$, a fall of $${round(ch, 3)}\\%$. The small-change estimate $${d}\\%/(1 + A\\beta) = ${round(d * Af / A, 3)}\\%$ is close when the change is small.`,
          trap: 'Dividing the change by $A\\beta$ or by $A$ instead of by $1 + A\\beta$.' };
      },
      verify: (p) => { const b = (p.A / p.Af - 1) / p.A, A2 = p.A * (1 - p.d / 100); return (1 - A2 / (1 + A2 * b) / p.Af) * 100; } },
    { id: 'af-g03', type: 'nat', level: 2, exams: G, sub: 'bandwidth extension',
      make(r) {
        const A = choose(r, [100, 200, 500, 1000, 2000]), L = choose(r, [4, 9, 19, 24, 49, 99]), up = r() < 0.6;
        const f = up ? pick(r, 10, 200, 10) : pick(r, 20, 500, 10), ff = up ? f * (1 + L) : f / (1 + L);
        return { q: `A single-pole amplifier has midband gain $${A}$ and ${up ? `upper cut-off $${f}$ kHz` : `lower cut-off $${f}$ Hz (one low-frequency pole)`}. Negative feedback with loop gain $A\\beta = ${L}$ is applied. The new ${up ? 'upper cut-off is ______ kHz' : 'lower cut-off is ______ Hz'} (to two decimal places).`,
          answer: round(ff, 2), tol: Math.max(0.01, round(ff * 0.003, 2)), A, L, f, up,
          sol: `The factor $1 + A\\beta = ${1 + L}$ divides the gain (to $${round(A / (1 + L), 3)}$) and ${up ? 'multiplies the upper cut-off' : 'divides the lower cut-off'}: ${up ? `$${f}\\times${1 + L} = ${round(ff, 2)}$ kHz` : `$${f}/${1 + L} = ${round(ff, 2)}$ Hz`}. The bandwidth widens at both ends.`,
          trap: up ? 'Dividing the upper cut-off by the factor.' : 'Multiplying the lower cut-off by the factor (that would narrow the band).' };
      },
      verify: (p) => (p.up ? p.f * (1 + p.L) : p.f / (1 + p.L)) },
    { id: 'af-g04', type: 'nat', level: 3, exams: G, sub: 'Miller effect',
      make(r) {
        const Rs = pick(r, 0.5, 10, 0.5), Cpi = pick(r, 2, 30, 1), Cmu = pick(r, 0.5, 3, 0.5), K = pick(r, 20, 200, 10);
        const Cin = Cpi + Cmu * (1 + K), f = 1 / (2 * Math.PI * Rs * 1e3 * Cin * 1e-12) / 1e6;
        return { q: `A common-emitter stage with voltage gain $-${K}$ is driven from a source resistance of $${Rs}$ k$\\Omega$ (base input resistance much larger). It has $C_\\pi = ${Cpi}$ pF and $C_\\mu = ${Cmu}$ pF. Using the Miller approximation, the input pole is at ______ MHz (to two decimal places).`,
          answer: round(f, 2), tol: Math.max(0.01, round(f * 0.005, 2)), unit: 'MHz', Rs, Cpi, Cmu, K,
          sol: `$C_{in} = C_\\pi + C_\\mu(1 + |A|) = ${Cpi} + ${Cmu}\\times${1 + K} = ${round(Cin, 2)}$ pF. $f_p = \\dfrac1{2\\pi R_sC_{in}} = \\dfrac1{2\\pi\\times${Rs}\\times10^3\\times${round(Cin, 2)}\\times10^{-12}} = ${round(f, 2)}$ MHz.`,
          trap: 'Leaving out $C_\\pi$, or multiplying $C_\\mu$ by $|A|$ instead of $1 + |A|$.' };
      },
      verify: (p) => 1 / (2 * Math.PI * p.Rs * 1e3 * (p.Cpi + p.Cmu * (1 + p.K)) * 1e-12) / 1e6 },
    { id: 'af-g05', type: 'nat', level: 2, exams: G, sub: 'cascaded bandwidth',
      make(r) {
        const n = int(r, 2, 6), f1 = pick(r, 0.5, 20, 0.5), low = r() < 0.4;
        const k = Math.sqrt(2 ** (1 / n) - 1), fn = low ? f1 / k : f1 * k;
        return { q: low ? `${n} identical non-interacting stages, each with one low-frequency pole giving a lower cut-off of $${f1}$ Hz, are cascaded. The overall lower 3 dB frequency is ______ Hz (to two decimal places).` : `${n} identical non-interacting stages, each with one high-frequency pole at $${f1}$ MHz, are cascaded. The overall upper 3 dB frequency is ______ MHz (to two decimal places).`,
          answer: round(fn, 2), tol: Math.max(0.01, round(fn * 0.005, 2)), n, f1, low,
          sol: `For $n$ identical poles the overall cut-off scales by $\\sqrt{2^{1/n} - 1} = ${round(k, 4)}$: ${low ? `the lower cut-off rises to $${f1}/${round(k, 4)} = ${round(fn, 2)}$ Hz` : `the upper cut-off falls to $${f1}\\times${round(k, 4)} = ${round(fn, 2)}$ MHz`}.`,
          trap: 'Assuming the cut-off is unchanged, or dividing by $n$.' };
      },
      verify: (p) => { const k = Math.sqrt(2 ** (1 / p.n) - 1); return p.low ? p.f1 / k : p.f1 * k; } },
    { id: 'af-g06', type: 'nat', level: 3, exams: G, sub: 'emitter degeneration',
      make(r) {
        const Ic = pick(r, 0.5, 5, 0.5), Rc = pick(r, 1, 10, 0.5), Re = choose(r, [0, 0.05, 0.1, 0.2, 0.5, 1]), RL = choose(r, [0, 5, 10, 20]);
        const gm = Ic / 0.025, R = RL ? Rc * RL / (Rc + RL) : Rc, A = gm * R / (1 + gm * Re);
        return { q: `A BJT common-emitter stage is biased at $I_C = ${Ic}$ mA ($V_T = 25$ mV) with $R_C = ${Rc}$ k$\\Omega$${Re ? `, an unbypassed emitter resistor of $${round(Re * 1000, 0)}\\,\\Omega$` : ' and the emitter fully bypassed'}${RL ? ` and a $${RL}$ k$\\Omega$ load` : ' and no load'} ($r_o$ ignored, large $\\beta$). The magnitude of the voltage gain is ______ (to one decimal place).`,
          answer: round(A, 1), tol: Math.max(0.1, round(A * 0.005, 1)), Ic, Rc, Re, RL,
          sol: `$g_m = ${Ic}/0.025 = ${round(gm, 1)}$ mA/V. Collector load $R = ${RL ? `${Rc}\\parallel${RL} = ` : ''}${round(R, 4)}$ k$\\Omega$. $|A_v| = \\dfrac{g_mR}{1 + g_mR_E} = \\dfrac{${round(gm * R, 2)}}{1 + ${round(gm * Re, 3)}} = ${round(A, 1)}$.`,
          trap: 'Forgetting the load in parallel with $R_C$, or the $1 +$ in the denominator.' };
      },
      verify: (p) => { const gm = p.Ic / 0.025, R = p.RL ? p.Rc * p.RL / (p.Rc + p.RL) : p.Rc; return gm * R / (1 + gm * p.Re); } },
    { id: 'af-g07', type: 'mcq', level: 2, exams: G, sub: 'feedback topologies',
      make(r) {
        const T = [
          ['the output voltage is sampled and a voltage is mixed in series with the input (series-shunt)', 0, 'a voltage amplifier, such as a non-inverting op-amp stage'],
          ['the output current is sampled and a voltage is mixed in series with the input (series-series)', 1, 'a transconductance amplifier, such as an emitter resistor in a CE stage'],
          ['the output voltage is sampled and a current is mixed in parallel at the input (shunt-shunt)', 2, 'a transresistance amplifier, such as the inverting op-amp stage'],
          ['the output current is sampled and a current is mixed in parallel at the input (shunt-series)', 3, 'a current amplifier'],
        ];
        const [desc, answer, ex] = choose(r, T);
        const options = ['input resistance rises, output resistance falls', 'input resistance rises, output resistance rises', 'input resistance falls, output resistance falls', 'input resistance falls, output resistance rises'];
        return { q: `In a negative-feedback amplifier ${desc}. What happens to its input and output resistances?`, options, answer,
          sol: `Series mixing raises the input resistance and shunt mixing lowers it, by $1 + A\\beta$. Sampling a voltage (shunt at the output) lowers the output resistance; sampling a current (series at the output) raises it. This topology makes ${ex}.`,
          trap: 'Mixing up the input side (how the feedback is mixed) with the output side (what is sampled).' };
      } },
    { id: 'af-g08', type: 'nat', level: 3, exams: G, sub: 'power amplifiers',
      make(r) {
        const Vcc = pick(r, 10, 40, 1), frac = pick(r, 0.4, 1, 0.05), RL = choose(r, [4, 8, 16]), Vp = round(Vcc * frac, 2), ask = choose(r, ['eff', 'pout', 'pdiss']);
        const Po = Vp * Vp / (2 * RL), Pdc = 2 * Vcc * Vp / (Math.PI * RL), val = ask === 'eff' ? Po / Pdc * 100 : ask === 'pout' ? Po : (Pdc - Po) / 2;
        const what = ask === 'eff' ? 'the efficiency is ______ %' : ask === 'pout' ? 'the output power is ______ W' : 'the power dissipated in each transistor is ______ W';
        return { q: `An ideal class B complementary push-pull stage runs from $\\pm${Vcc}$ V into $${RL}\\,\\Omega$ and gives a sine wave of $${Vp}$ V peak. ${what[0].toUpperCase() + what.slice(1)} (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, round(val * 0.005, 2)), Vcc, Vp, RL, ask,
          sol: `$P_{out} = V_p^2/2R_L = ${round(Po, 3)}$ W. $P_{dc} = 2V_{CC}V_p/(\\pi R_L) = ${round(Pdc, 3)}$ W. Efficiency $= ${round(Po / Pdc * 100, 2)}\\% = (\\pi/4)(V_p/V_{CC})$. Each transistor dissipates $(P_{dc} - P_{out})/2 = ${round((Pdc - Po) / 2, 3)}$ W.`,
          trap: 'Quoting 78.5% when the swing is less than the supply.' };
      },
      verify: (p) => { const Po = p.Vp ** 2 / (2 * p.RL), Pdc = 2 * p.Vcc * p.Vp / (Math.PI * p.RL); return p.ask === 'eff' ? Po / Pdc * 100 : p.ask === 'pout' ? Po : (Pdc - Po) / 2; } },
    { id: 'af-g09', type: 'nat', level: 4, exams: G, sub: 'stability',
      make(r) {
        const T0 = choose(r, [10, 20, 50, 100, 200, 500, 1000]), f1 = choose(r, [10, 100, 1000]), f2 = f1 * choose(r, [10, 30, 100, 300, 1000]);
        const fc = cross2(T0, f1, f2), pm = 180 - deg(Math.atan(fc / f1) + Math.atan(fc / f2));
        return { q: `A loop gain has DC value $${T0}$ and two real poles at $${f1}$ Hz and $${f2}$ Hz. Its phase margin is ______ degrees (to one decimal place).`,
          answer: round(pm, 1), tol: 0.3, unit: 'degrees', T0, f1, f2,
          sol: `Solve $|T| = 1$: with $u = f^2$, $(1 + u/f_1^2)(1 + u/f_2^2) = T_0^2$, giving $f_c = ${round(fc, 1)}$ Hz. Phase $= -\\arctan(f_c/f_1) - \\arctan(f_c/f_2) = -${round(deg(Math.atan(fc / f1)), 2)}^\\circ - ${round(deg(Math.atan(fc / f2)), 2)}^\\circ$. Phase margin $= ${round(pm, 1)}^\\circ$.`,
          trap: 'Taking the crossover at $T_0f_1$ ignores the second pole, which matters when it is near the crossover.' };
      },
      verify: (p) => { const a = 1 / (p.f1 ** 2 * p.f2 ** 2), b = 1 / p.f1 ** 2 + 1 / p.f2 ** 2, c = 1 - p.T0 ** 2; const u = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a), f = Math.sqrt(u); return 180 - (Math.atan(f / p.f1) + Math.atan(f / p.f2)) * 180 / Math.PI; } },
    { id: 'af-g10', type: 'nat', level: 3, exams: G, sub: 'Bode plots',
      make(r) {
        const A0 = choose(r, [40, 60, 80, 100]), f1 = choose(r, [100, 1000, 1e4]), m = choose(r, [10, 100, 1000]), f2 = f1 * m, e = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 3.5]), f = f1 * 10 ** e;
        const asym = A0 - 20 * Math.max(0, Math.log10(f / f1)) - 20 * Math.max(0, Math.log10(f / f2));
        return { q: `An amplifier has a midband gain of $${A0}$ dB and real poles at $${f1}$ Hz and $${f2}$ Hz. On the straight-line (asymptotic) Bode plot, its gain at $${round(f, 1)}$ Hz is ______ dB (to one decimal place).`,
          answer: round(asym, 1), tol: 0.1, unit: 'dB', A0, f1, f2, f,
          sol: `Above each pole the slope steepens by $-20$ dB/decade. From $${f1}$ Hz: $-20\\log_{10}(${round(f, 1)}/${f1}) = -${round(20 * Math.max(0, Math.log10(f / f1)), 2)}$ dB. ${f > f2 ? `Above $${f2}$ Hz a further $-20\\log_{10}(${round(f, 1)}/${f2}) = -${round(20 * Math.log10(f / f2), 2)}$ dB.` : 'The second pole has not yet been reached.'} Gain $= ${round(asym, 1)}$ dB.`,
          trap: 'Forgetting that the slope doubles after the second pole.' };
      },
      verify: (p) => p.A0 - 20 * Math.max(0, Math.log10(p.f / p.f1)) - 20 * Math.max(0, Math.log10(p.f / p.f2)) },
    { id: 'af-g11', type: 'nat', level: 4, exams: G, sub: 'two-pole feedback',
      make(r) {
        const ratio = choose(r, [2, 4, 5, 10, 20, 50, 100]), Q = choose(r, [0.5, Math.SQRT1_2, 1]);
        const T0 = (1 + ratio) ** 2 * Q * Q / ratio - 1, qn = Q === 0.5 ? '1/2 (critically damped)' : Q === 1 ? '1' : '1/\\sqrt2 (maximally flat)';
        return { q: `A loop gain has two real poles with $\\omega_2 = ${ratio}\\,\\omega_1$: $T(s) = T_0/[(1 + s/\\omega_1)(1 + s/\\omega_2)]$. The closed-loop pole quality factor equals $${qn}$ when $T_0$ is ______ (to two decimal places).`,
          answer: round(T0, 2), tol: Math.max(0.01, round(Math.abs(T0) * 0.003, 2)), ratio, Q,
          sol: `Closed-loop poles: $s^2 + (\\omega_1 + \\omega_2)s + (1 + T_0)\\omega_1\\omega_2 = 0$, so $Q^2 = \\dfrac{(1 + T_0)\\omega_1\\omega_2}{(\\omega_1 + \\omega_2)^2}$. Then $1 + T_0 = Q^2(1 + ${ratio})^2/${ratio} = ${round(T0 + 1, 4)}$ and $T_0 = ${round(T0, 2)}$.`,
          trap: 'Using $Q = \\omega_0/(\\omega_2 - \\omega_1)$ or forgetting the $1 +$.' };
      },
      verify: (p) => p.Q ** 2 * (1 + p.ratio) ** 2 / p.ratio - 1 },
    { id: 'af-g12', type: 'nat', level: 3, exams: G, sub: 'differential amplifier',
      make(r) {
        const Iee = pick(r, 0.2, 4, 0.2), Ree = choose(r, [10, 20, 50, 100, 200, 500, 1000]);
        const gm = Iee / 2 / 0.025, cm = 20 * Math.log10(gm * Ree);
        return { q: `A BJT differential pair is biased by a tail current of $${Iee}$ mA whose source has output resistance $${Ree}$ k$\\Omega$. Taking the output from one collector ($V_T = 25$ mV, large $\\beta$), the CMRR is about ______ dB (to one decimal place).`,
          answer: round(cm, 1), tol: 0.1, unit: 'dB', Iee, Ree,
          sol: `Each transistor carries $${round(Iee / 2, 3)}$ mA, so $g_m = ${round(gm, 2)}$ mA/V. Single-ended $A_d = g_mR_C/2$ and $A_{cm}\\approx R_C/2R_{EE}$, so CMRR $= g_mR_{EE} = ${round(gm * Ree, 1)}$, or $${round(cm, 1)}$ dB.`,
          trap: 'Using the whole tail current in $g_m$ adds 6 dB.' };
      },
      verify: (p) => 20 * Math.log10(p.Iee / 0.05 * p.Ree) },
    ...more,
    ...r4.gens,
  ],
};
