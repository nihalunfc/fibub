// Extra question shapes for amplifiers-feedback (templates af-m31..m35). Imported by amplifiers-feedback.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'af-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'feedback basics', format: 'statements',
    make(r) {
      const A = choose(r, [1e3, 1e4, 1e5]), b = choose(r, [0.01, 0.02, 0.05, 0.1]), G = A / (1 + A * b), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `with open-loop gain $${sci(A)}$ and $\\beta = ${b}$, the closed-loop gain is close to ${+(1 / b).toFixed(1)}`, `with open-loop gain $${sci(A)}$ and $\\beta = ${b}$, the closed-loop gain is close to $${sci(A * b)}$`, `$A_f = A/(1 + A\\beta) = ${G.toFixed(2)} \\approx 1/\\beta = ${+(1 / b).toFixed(1)}$ because $A\\beta = ${sci(A * b)} \\gg 1$.`),
        ['negative feedback divides the gain by $1 + A\\beta$', true, '$A_f = A/(1 + A\\beta)$.'],
        ['for a single-pole amplifier, negative feedback widens the bandwidth by $1 + A\\beta$', true, 'The gain-bandwidth product stays constant.'],
        ['negative feedback reduces nonlinear distortion', true, 'Distortion generated inside the loop is divided by $1 + A\\beta$.'],
        ['series (voltage) mixing at the input raises the input resistance', true, 'It multiplies $R_{in}$ by $1 + A\\beta$.'],
        ['shunt (voltage) sampling at the output raises the output resistance', false, 'Sampling the output voltage lowers $R_{out}$ by $1 + A\\beta$.'],
        ['negative feedback improves the signal-to-noise ratio for noise entering at the amplifier input', false, 'Input-referred noise is amplified exactly like the signal; feedback cannot separate them.'],
        ['negative feedback makes the gain less sensitive to changes in $A$', true, '$dA_f/A_f = (dA/A)/(1 + A\\beta)$.'],
      ], { not });
      return { q: `Which of the following statements about negative feedback are ${nt(not)}?`, ...m,
        trap: 'Feedback helps against noise and distortion generated inside the loop, not against noise added with the input signal.' };
    } },
  { id: 'af-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'power amplifiers',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a common-emitter stage gives a large, inverted voltage gain', true, '$A_v \\approx -g_mR_C$.'],
        ['an emitter follower has a voltage gain just below 1 and a low output resistance', true, 'It is a buffer.'],
        ['a common-base stage has a low input resistance and a current gain close to 1', true, '$R_{in} \\approx 1/g_m$, $\\alpha \\approx 1$.'],
        ['a cascode stage reduces the Miller effect', true, 'The common-base transistor holds the first collector at nearly constant voltage.'],
        ['the maximum efficiency of a class B push-pull stage is $\\pi/4 \\approx 78.5\\%$', true, 'Each transistor conducts for half a cycle.'],
        ['an emitter follower gives a large voltage gain', false, 'Its voltage gain is just below 1; it gives current gain.'],
        ['a common-base stage inverts the signal', false, 'Input at the emitter and output at the collector are in phase.'],
        ['class C amplifiers are preferred for high-fidelity audio', false, 'They distort heavily and need a tuned load; they suit RF carriers.'],
      ], not);
      return { q: `Which statement about amplifier stages is ${nt(not)}?`, ...m,
        trap: 'Common emitter inverts; common base and common collector do not.' };
    } },
  { id: 'af-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Bode plots', format: 'graph in words',
    make(r) {
      const A = choose(r, [10, 50, 100, 200]), w = choose(r, ['10^3', '10^4', '2\\pi\\times10^5']);
      const L = {
        lp1: 'flat, then falling at 20 dB/decade above $\\omega_0$; phase goes from 0 to $-90^\\circ$',
        lp2: 'flat, then falling at 40 dB/decade above $\\omega_0$; phase goes from 0 to $-180^\\circ$',
        hp: 'rising at 20 dB/decade, then flat above $\\omega_0$; phase goes from $+90^\\circ$ to 0',
        int: `falling at 20 dB/decade at all frequencies, crossing 0 dB at $${A}\\omega_0$; phase constant at $-90^\\circ$`,
        bp: 'rising at 20 dB/decade, peaking near $\\omega_0$, then falling at 20 dB/decade',
      };
      const cas = choose(r, [
        [`\\dfrac{${A}}{1 + s/\\omega_0}`, 'lp1', 'One pole at $\\omega_0$.'],
        [`\\dfrac{${A}}{(1 + s/\\omega_0)^2}`, 'lp2', 'A double pole: twice the slope and twice the phase lag.'],
        [`\\dfrac{${A}\\,s/\\omega_0}{1 + s/\\omega_0}`, 'hp', 'A zero at the origin and a pole at $\\omega_0$: a high-pass.'],
        [`\\dfrac{${A}\\,\\omega_0}{s}`, 'int', 'An integrator: $|H| = A\\omega_0/\\omega$, unity at $\\omega = A\\omega_0$.'],
        [`\\dfrac{${A}\\,s/\\omega_0}{(1 + s/\\omega_0)^2}`, 'bp', 'A zero at the origin and a double pole: rises, peaks, falls.'],
      ]);
      return { q: `With $\\omega_0 = ${w}$ rad/s, the Bode magnitude and phase of $H(s) = ${cas[0]}$ are best described as`, ...matchOne(r, L, cas),
        trap: 'Each pole adds $-20$ dB/decade and up to $-90^\\circ$; each zero adds the opposite.' };
    } },
  { id: 'af-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Miller effect', format: 'limiting case',
    make(r) {
      const A = choose(r, [10, 20, 50, 100, 200]), C = choose(r, [1, 2, 3, 5]);
      const f = (x) => `${+x.toPrecision(3)} pF`;
      const o = mcqOptions(r, C * (1 + 1 / A), [C * (1 + A), C / (1 + A), C * A, C / A], f);
      return { q: `A capacitor of ${C} pF is connected between the input and output of an ideal inverting amplifier of gain $-${A}$. By Miller's theorem, the capacitance it presents at the <b>output</b> node is about`,
        options: o.options, answer: o.answer,
        sol: `At the input the capacitor looks like $C(1 + A) = ${f(C * (1 + A))}$. At the output the current through it is $C\\,d(v_o - v_i)/dt = C(1 + 1/A)\\,dv_o/dt$, so it looks like $C(1 + 1/A) = ${f(C * (1 + 1 / A))}$: for large gain, just $C$.`,
        trap: 'The large multiplication $C(1 + A)$ appears only at the input side.' };
    } },
  { id: 'af-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cascaded bandwidth', format: 'order of magnitude',
    make(r) {
      const e = choose(r, [4, 5, 6]), fp = choose(r, [2, 5, 10, 20]), x = 10 ** e * fp;
      const o = orderOpts(r, x, '\\text{Hz}');
      return { q: `A single-pole op-amp has DC gain $10^{${e}}$ and its pole at ${fp} Hz. Connected as a voltage follower, its bandwidth is about`,
        options: o.options, answer: o.answer,
        sol: `The gain-bandwidth product is $10^{${e}}\\times${fp} = ${sci(x)}$ Hz. A follower has noise gain 1, so its bandwidth equals the unity-gain frequency, $${sci(x)}$ Hz.`,
        trap: 'The open-loop pole is only a few hertz, but feedback stretches the bandwidth by the loop gain.' };
    } },
];
