// Extra question shapes for op-amp-circuits (templates oc-m31..m35). Imported by op-amp-circuits.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'oc-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'ideal op-amp', format: 'statements',
    make(r) {
      const R1 = choose(r, [1, 2, 4.7, 10]), Rf = choose(r, [10, 22, 47, 100]), not = r() < 0.5;
      const g = +(Rf / R1).toPrecision(3);
      const m = msqOf(r, [
        vs(r, `an inverting amplifier with $R_1 = ${R1}$ kΩ and $R_f = ${Rf}$ kΩ has gain $-${g}$`, `an inverting amplifier with $R_1 = ${R1}$ kΩ and $R_f = ${Rf}$ kΩ has gain $-${+(1 + Rf / R1).toPrecision(3)}$`, `Inverting gain is $-R_f/R_1 = -${g}$; $1 + R_f/R_1$ is the non-inverting gain.`),
        vs(r, `an inverting amplifier with input resistor $R_1 = ${R1}$ kΩ presents an input resistance of ${R1} kΩ`, `an inverting amplifier with input resistor $R_1 = ${R1}$ kΩ presents a practically infinite input resistance`, `The inverting input is a virtual ground, so the source sees $R_1 = ${R1}$ kΩ.`),
        ['the virtual short between the inputs holds only when there is negative feedback', true, 'Without it the output saturates and the inputs can differ by any amount.'],
        ['a Schmitt trigger uses positive feedback', true, 'That gives the two thresholds (hysteresis).'],
        ['a comparator relies on the virtual short between its inputs', false, 'An open-loop comparator has no negative feedback; its output swings to a rail.'],
        ['an inverting integrator driven by a constant input voltage gives an output ramp', true, '$v_o = -\\tfrac{1}{RC}\\int v_i\\,dt$.'],
        ['a differentiator amplifies high-frequency noise', true, 'Its gain $\\omega RC$ rises with frequency.'],
        ['a non-inverting amplifier can have a gain magnitude below 1', false, 'Its gain $1 + R_f/R_1$ is at least 1.'],
      ], { not });
      return { q: `Which of the following statements about op-amp circuits are ${nt(not)}?`, ...m,
        trap: 'Virtual short needs negative feedback: never apply it to a comparator or a Schmitt trigger.' };
    } },
  { id: 'oc-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gain-bandwidth',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['slew rate limits the largest undistorted sine amplitude at high frequency', true, 'A sine of amplitude $V_p$ needs $2\\pi fV_p \\le SR$.'],
        ['an input offset voltage makes an ideal integrator drift into saturation', true, 'A constant offset integrates into a ramp.'],
        ['a resistor equal to $R_1\\parallel R_f$ in the non-inverting input reduces the output error from bias currents', true, 'Both inputs then see the same DC resistance, so equal bias currents give equal drops.'],
        ['with a single-pole op-amp, closed-loop bandwidth is the gain-bandwidth product divided by the noise gain', true, 'Noise gain is $1 + R_f/R_1$ for both inverting and non-inverting connections.'],
        ['raising the closed-loop gain of an op-amp amplifier raises its bandwidth', false, 'For a single-pole op-amp gain times bandwidth is constant, so more gain means less bandwidth.'],
        ['slew rate limits the bandwidth for very small signals', false, 'Small signals are limited by the gain-bandwidth product; slew rate matters for large swings.'],
        ['a finite CMRR has no effect in a difference amplifier', false, 'A common-mode input then leaks to the output.'],
      ], not);
      return { q: `Which statement about non-ideal op-amp behaviour is ${nt(not)}?`, ...m,
        trap: 'Small signals: gain-bandwidth limit. Large fast signals: slew-rate limit.' };
    } },
  { id: 'oc-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'active filter', format: 'graph in words',
    make(r) {
      const L = {
        lp2: 'flat at low frequency, then falling at 40 dB/decade',
        int: 'falling at 20 dB/decade over the whole range, with the phase near $+90^\\circ$ (the inversion included)',
        hp: 'rising at 20 dB/decade, then flat at a gain of $R_f/R_s$',
        ap: 'constant magnitude at all frequencies, with the phase changing by $180^\\circ$',
        bp: 'peaked at one frequency and falling on both sides',
        notch: 'flat except for a deep dip at one frequency',
      };
      const cas = choose(r, [
        ['a unity-gain Sallen-Key low-pass filter (two resistors, two capacitors)', 'lp2', 'Two poles: $-40$ dB/decade above the corner.'],
        ['an inverting integrator (input resistor, feedback capacitor)', 'int', '$H = -1/(j\\omega RC)$: magnitude $1/(\\omega RC)$; the phase of $-1/j$ is $+90^\\circ$.'],
        ['a practical differentiator (series resistor $R_s$ with the input capacitor, feedback resistor $R_f$)', 'hp', 'Below $1/(R_sC)$ it differentiates; above it the capacitor is a short and the gain levels at $R_f/R_s$.'],
        ['a first-order all-pass section', 'ap', '$H = (1 - j\\omega RC)/(1 + j\\omega RC)$ has $|H| = 1$ and a phase that sweeps through $180^\\circ$.'],
        ['a multiple-feedback band-pass filter', 'bp', 'It passes frequencies near its centre and rolls off on both sides.'],
        ['a twin-T notch filter with an op-amp buffer', 'notch', 'It rejects one frequency (for example 50 Hz hum).'],
      ]);
      return { q: `The magnitude response of ${cas[0]} is best described as`, ...matchOne(r, L, cas),
        trap: 'An all-pass filter changes only the phase; do not confuse it with a wide band-pass.' };
    } },
  { id: 'oc-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'differentiator', format: 'limiting case',
    make(r) {
      const R1 = choose(r, [1, 2, 5, 10]), Rf = choose(r, [20, 50, 100, 200]), diff = r() < 0.5;
      const g = Rf / R1;
      const o = mcqOptions(r, diff ? `$${g}$` : `$${g}$ (inverting)`, diff ? ['$\\infty$', '$0$', `$${+(Rf / (R1 + Rf)).toFixed(3)}$`, `$${g + 1}$`] : ['$\\infty$', '$0$', `$${g + 1}$ (inverting)`, '$1$ (inverting)']);
      return { q: diff
        ? `A practical differentiator has a ${R1} kΩ resistor in series with its input capacitor and a ${Rf} kΩ feedback resistor. At frequencies far above the corner $1/(2\\pi R_sC)$, the magnitude of its gain tends to`
        : `A lossy integrator has a ${R1} kΩ input resistor and a ${Rf} kΩ resistor in parallel with the feedback capacitor. At DC its gain tends to`,
        options: o.options, answer: o.answer,
        sol: diff
          ? `Input impedance $R_s + 1/(j\\omega C) \\to R_s$ at high frequency, so $|H| \\to R_f/R_s = ${Rf}/${R1} = ${g}$. The series resistor is there precisely to stop the gain growing without bound (and amplifying noise).`
          : `At DC the capacitor is open, leaving an inverting amplifier with gain $-R_f/R_1 = -${g}$. The parallel resistor stops the integrator drifting to saturation on offsets.`,
        trap: 'Take each limit by replacing the capacitor with an open circuit (DC) or a short (high frequency).' };
    } },
  { id: 'oc-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'slew rate', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const SR = choose(r, [0.5, 13, 20, 200]), Vp = choose(r, [1, 5, 10]);
        x = (SR * 1e6) / (2 * Math.PI * Vp); unit = '\\text{Hz}';
        q = `An op-amp with slew rate ${SR} V/µs must deliver a sine wave of ${Vp} V peak. The highest frequency it can reproduce without slew distortion is about`;
        sol = `$f_{max} = SR/(2\\pi V_p) = ${SR}\\times10^6/(2\\pi\\times${Vp}) = ${sci(x)}$ Hz.`;
      } else {
        const Ib = choose(r, [10e-12, 1e-9, 100e-9, 1e-6]), R = choose(r, [10e3, 100e3, 1e6]);
        x = Ib * R; unit = '\\text{V}';
        q = `A bias current of $${sci(Ib)}$ A flows through a ${R >= 1e6 ? R / 1e6 + ' MΩ' : R / 1e3 + ' kΩ'} feedback resistor of an inverting amplifier (no compensation resistor). The output error it causes is about`;
        sol = `$V_{err} = I_BR_f = ${sci(Ib)}\\times${sci(R)} = ${sci(x)}$ V.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'The $2\\pi$ matters: the steepest slope of $V_p\\sin\\omega t$ is $\\omega V_p$.' };
    } },
];
