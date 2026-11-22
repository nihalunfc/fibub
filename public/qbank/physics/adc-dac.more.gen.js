// Extra question shapes for adc-dac (templates adc-m31..m35). Imported by adc-dac.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'adc-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'ADC types', format: 'statements',
    make(r) {
      const n = int(r, 4, 10), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `${n === 8 ? "an" : "a"} ${n}-bit flash ADC needs ${2 ** n - 1} comparators`, `${n === 8 ? "an" : "a"} ${n}-bit flash ADC needs ${n} comparators`, `One comparator per threshold: $2^n - 1 = ${2 ** n - 1}$.`),
        vs(r, `${n === 8 ? "an" : "a"} ${n}-bit successive-approximation ADC needs about ${n} clock cycles per conversion`, `${n === 8 ? "an" : "a"} ${n}-bit successive-approximation ADC needs about ${2 ** n} clock cycles per conversion`, `It decides one bit per cycle: $n = ${n}$ cycles. A counter-ramp ADC may need up to $2^n$.`),
        ['a dual-slope ADC rejects mains hum when its integration time is a whole number of mains periods', true, 'The integral of the hum over full cycles is zero.'],
        ['the result of a dual-slope ADC does not depend on the exact values of R, C or the clock frequency', true, 'They appear in both the run-up and run-down phases and cancel.'],
        ['an R-2R ladder DAC needs only two resistor values', true, 'Easy to match on a chip, unlike the binary-weighted DAC.'],
        ['a flash ADC is the slowest common architecture', false, 'It is the fastest: all comparisons happen at once.'],
        ['a counter-ramp ADC has a fixed conversion time', false, 'Its conversion time grows with the input, up to $2^n$ clock cycles.'],
        ['a sigma-delta converter combines oversampling with noise shaping', true, 'It pushes quantisation noise to high frequencies and filters it off.'],
      ], { not });
      return { q: `Which of the following statements about data converters are ${nt(not)}?`, ...m,
        trap: 'Flash: $2^n - 1$ comparators in one step. SAR: one comparator, $n$ steps.' };
    } },
  { id: 'adc-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'sampling',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a sine of frequency $f$ sampled at $f_s$ aliases to $|f - kf_s|$ for the nearest integer $k$', true, 'The sampled values are identical for those frequencies.'],
        ['an anti-aliasing filter must act before the sampler', true, 'Once aliased, the unwanted components cannot be separated.'],
        ['the rms quantisation noise of an ideal quantiser with step $\\Delta$ is $\\Delta/\\sqrt{12}$', true, 'Uniform error over $\\pm\\Delta/2$.'],
        ['each extra bit raises the ideal SQNR by about 6 dB', true, 'SQNR $= 6.02n + 1.76$ dB for a full-scale sine.'],
        ['oversampling by 4 (without noise shaping) gains about one extra bit', true, 'Noise power in band falls by 4, i.e. 6 dB.'],
        ['raising the sampling rate makes the quantisation step smaller', false, 'The step is set by the full scale and the number of bits, $\\Delta = V_{FS}/2^n$.'],
        ['sampling a sine at exactly twice its frequency always recovers it', false, 'The samples might all fall on zero crossings; strictly more than $2f$ is needed.'],
        ['aliasing can be removed by digital filtering after sampling', false, 'The aliased components sit at in-band frequencies indistinguishable from real ones.'],
      ], not);
      return { q: `Which statement about sampling and quantisation is ${nt(not)}?`, ...m,
        trap: 'Sampling rate controls aliasing; bit count controls quantisation noise.' };
    } },
  { id: 'adc-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ADC types', format: 'match',
    make(r) {
      const L = { ds: 'dual-slope (integrating)', fl: 'flash', sd: 'sigma-delta', sar: 'successive approximation', pip: 'pipelined' };
      const cas = choose(r, [
        ['A bench digital multimeter reading a slowly varying DC voltage, with strong mains pickup', 'ds', 'Integrating over whole mains cycles rejects hum; speed does not matter.'],
        ['A digital oscilloscope sampling at several gigasamples per second, 8 bits', 'fl', 'Only a flash converter decides in a single comparator delay.'],
        ['Studio audio recording at 24 bits and 48 kHz', 'sd', 'High resolution at modest bandwidth is exactly what oversampling and noise shaping give.'],
        ['A microcontroller reading sensors at 12 bits and up to about 1 MS/s', 'sar', 'Moderate speed and resolution with one comparator: low power and small area.'],
        ['A wireless receiver needing 14 bits at 100 MS/s', 'pip', 'Pipelining several low-resolution stages reaches high speed and high resolution together.'],
      ]);
      return { q: `Job: ${cas[0]}. The most suitable ADC architecture is`, ...matchOne(r, L, cas),
        trap: 'Flash for speed, integrating for precision and noise rejection, sigma-delta for resolution, SAR for the middle ground.' };
    } },
  { id: 'adc-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'converter errors', format: 'graph in words',
    make(r) {
      const L = {
        off: 'the whole staircase shifted up by the same amount at every code',
        gain: 'the staircase correct at zero but with the wrong overall slope, the error growing with the code',
        nm: 'at one code step the output goes down instead of up',
        miss: 'one step twice as wide as the others, so one output code never appears',
        inl: 'steps of nearly equal size but the staircase bowing away from the straight line in the middle',
      };
      const cas = choose(r, [
        ['an offset error', 'off', 'A constant added to every output.'],
        ['a gain (full-scale) error', 'gain', 'The slope is wrong: zero code is right, full scale is off.'],
        ['a non-monotonic DAC (DNL below $-1$ LSB at one transition)', 'nm', 'Typically at the major carry (0111... to 1000...) of a binary-weighted DAC.'],
        ['a missing code in an ADC', 'miss', 'A DNL of $-1$ LSB at one code width means its neighbour takes over its range.'],
        ['a large integral nonlinearity with small differential nonlinearity', 'inl', 'Small step errors that all lean the same way add up to a bow.'],
      ]);
      return { q: `On the transfer characteristic of a converter, ${cas[0]} shows up as`, ...matchOne(r, L, cas),
        trap: 'Offset shifts, gain tilts, DNL distorts individual steps, INL bends the whole curve.' };
    } },
  { id: 'adc-m35', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'resolution', format: 'order of magnitude',
    make(r) {
      const n = choose(r, [8, 10, 12, 16, 20, 24]), V = choose(r, [1, 2.5, 3.3, 5, 10]), x = V / 2 ** n;
      const o = orderOpts(r, x, '\\text{V}');
      return { q: `The size of one LSB of an ideal ${n}-bit converter with a full-scale range of ${V} V is about`,
        options: o.options, answer: o.answer,
        sol: `LSB $= V_{FS}/2^n = ${V}/${2 ** n} = ${sci(x)}$ V. (Some books use $2^n - 1$; it changes nothing at this level of accuracy.)`,
        trap: '$2^{10} \\approx 10^3$: every 10 bits divide the step by about a thousand.' };
    } },
];
