// Extra question shapes for oscillators (templates osc-m31..m35). Imported by oscillators.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'osc-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Barkhausen criterion', format: 'statements',
    make(r) {
      const R = choose(r, [1, 4.7, 10, 15]), C = choose(r, [10, 22, 47, 100]), f = 1 / (2 * Math.PI * R * 1e3 * C * 1e-9), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a Wien-bridge oscillator with $R = ${R}$ kΩ and $C = ${C}$ nF runs at about $${sci(f)}$ Hz`, `a Wien-bridge oscillator with $R = ${R}$ kΩ and $C = ${C}$ nF runs at about $${sci(f * 2 * Math.PI)}$ Hz`, `$f = 1/(2\\pi RC) = 1/(2\\pi\\times${R}\\times10^3\\times${C}\\times10^{-9}) = ${sci(f)}$ Hz; forgetting the $2\\pi$ gives $1/RC$.`),
        ['sustained oscillation needs a loop gain of magnitude 1 and total phase shift $0^\\circ$ (or $360^\\circ$)', true, 'The Barkhausen criterion.'],
        ['for reliable start-up the small-signal loop gain is made slightly greater than 1', true, 'Noise then grows until a nonlinearity limits the amplitude.'],
        ['a Wien-bridge oscillator needs an amplifier gain of 3', true, 'At $f_0$ the Wien network passes 1/3 with zero phase.'],
        ['a three-section RC phase-shift oscillator (equal sections) needs an inverting gain of 29', true, 'Its network gives $-1/29$ at $f = 1/(2\\pi RC\\sqrt6)$.'],
        ['a Colpitts oscillator uses a tapped inductor in its tank', false, 'That is the Hartley; the Colpitts uses a capacitive divider.'],
        ['the steady amplitude of a linear oscillator is fixed by the loop gain being exactly 1', false, 'A perfectly linear loop has no preferred amplitude; a nonlinearity (or AGC) sets it.'],
        ['negative feedback alone can sustain oscillation', false, 'The loop must return the signal in phase: regenerative (positive) feedback at $f_0$.'],
      ], { not });
      return { q: `Which of the following statements about sinusoidal oscillators are ${nt(not)}?`, ...m,
        trap: 'Wien bridge: gain 3. RC phase-shift (three equal sections): gain 29.' };
    } },
  { id: 'osc-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'crystal',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the series resonance of a quartz crystal lies just below its parallel resonance', true, '$f_p = f_s\\sqrt{1 + C_s/C_p}$ is slightly higher.'],
        ['between series and parallel resonance the crystal behaves as an inductance', true, 'Oscillator circuits use it in this narrow inductive band.'],
        ['crystal $Q$ values of $10^4$ to $10^6$ make the frequency very stable', true, 'The phase changes very steeply with frequency near resonance.'],
        ['an AT-cut crystal has a small temperature coefficient near room temperature', true, 'Its frequency-temperature curve is a flat cubic around 25 °C.'],
        ['between series and parallel resonance the crystal behaves as a capacitance', false, 'It is inductive there; it is capacitive below $f_s$ and above $f_p$.'],
        ['the series and parallel resonances of a crystal are separated by tens of per cent', false, 'They differ by a fraction of a per cent, because $C_s \\ll C_p$.'],
        ['a crystal oscillator\'s frequency can easily be tuned over a factor of two', false, 'It can be pulled only by parts per million with a trimmer capacitor.'],
      ], not);
      return { q: `Which statement about quartz crystals in oscillators is ${nt(not)}?`, ...m,
        trap: 'The crystal is inductive only in the narrow band between $f_s$ and $f_p$.' };
    } },
  { id: 'osc-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'oscillator types', format: 'match',
    make(r) {
      const L = {
        rc: 'audio-frequency sine waves (hertz to about a hundred kilohertz)',
        lc: 'radio-frequency sine waves (about 100 kHz to hundreds of MHz)',
        xt: 'a highly stable clock frequency',
        rel: 'square or triangular waves (non-sinusoidal)',
        vco: 'a frequency set by a control voltage, as in a phase-locked loop',
        quad: 'two sine outputs 90° apart',
      };
      const cas = choose(r, [
        ['A Wien-bridge oscillator', 'rc', 'RC networks give convenient component values at audio frequencies; at RF the op-amp runs out of bandwidth.'],
        ['A Colpitts oscillator', 'lc', 'An LC tank is practical at radio frequencies.'],
        ['A Pierce oscillator built around a quartz crystal', 'xt', 'The crystal\'s very high Q fixes the frequency.'],
        ['An op-amp astable multivibrator (comparator with RC timing)', 'rel', 'It switches between saturation levels: a square wave at the output, a triangle-like exponential on the capacitor.'],
        ['A varactor-tuned LC oscillator', 'vco', 'The varactor capacitance follows the control voltage.', ['lc']],
        ['Two integrators and an inverter in a loop', 'quad', 'Each integrator shifts by 90°: sine and cosine outputs.'],
      ]);
      return { q: `${cas[0]} is most typically used to produce`, ...matchOne(r, L, cas),
        trap: 'RC for low frequencies, LC for RF, crystal for stability, relaxation for non-sinusoidal waves.' };
    } },
  { id: 'osc-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Clapp', format: 'limiting case',
    make(r) {
      const Lh = choose(r, [10, 22, 47, 100]), C3 = choose(r, [10, 22, 47]), big = C3 * choose(r, [50, 100]);
      const f = (c) => 1 / (2 * Math.PI * Math.sqrt(Lh * 1e-6 * c * 1e-12));
      const ser = 1 / (1 / big + 1 / big + 1 / C3), show = (x) => `${(x / 1e6).toFixed(2)} MHz`;
      const o = mcqOptions(r, f(C3), [f(big), f(big / 2), f(C3 + big), f(C3) / (2 * Math.PI)], show);
      return { q: `In a Clapp oscillator the tank has $L = ${Lh}$ µH with a series capacitor $C_3 = ${C3}$ pF, and the two divider capacitors are $C_1 = C_2 = ${big}$ pF. The oscillation frequency is closest to`,
        options: o.options, answer: o.answer,
        sol: `The three capacitors are in series: $1/C = 2/${big} + 1/${C3}$, so $C = ${ser.toFixed(2)}$ pF $\\approx C_3$ because $C_3 \\ll C_1, C_2$. Then $f = 1/(2\\pi\\sqrt{LC}) \\approx ${show(f(C3))}$ (exactly ${show(f(ser))}). This is the point of the Clapp design: the frequency hardly depends on the transistor capacitances that load $C_1$ and $C_2$.`,
        trap: 'Series capacitors are dominated by the smallest one.' };
    } },
  { id: 'osc-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'crystal', format: 'order of magnitude',
    make(r) {
      const ppm = choose(r, [1, 5, 20, 50]), [T, tn] = choose(r, [[86400, 'a day'], [2.592e6, 'a 30-day month'], [3.156e7, 'a year']]);
      const x = ppm * 1e-6 * T, o = orderOpts(r, x, '\\text{s}');
      return { q: `A watch crystal runs ${ppm} ppm (parts per million) fast. Over ${tn} the watch gains about`,
        options: o.options, answer: o.answer,
        sol: `The fractional error is $${ppm}\\times10^{-6}$; over $${sci(T)}$ s the gain is $${ppm}\\times10^{-6}\\times${sci(T)} = ${sci(x)}$ s.`,
        trap: '1 ppm is $10^{-6}$, and a day is 86 400 s.' };
    } },
];
