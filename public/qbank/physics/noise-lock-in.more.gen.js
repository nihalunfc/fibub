// Extra question shapes for noise-lock-in (templates nli-m31..m35). Imported by noise-lock-in.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'nli-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'signal averaging', format: 'statements',
    make(r) {
      const N = choose(r, [16, 64, 100, 400]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `averaging ${N} repeated sweeps with independent noise improves the signal-to-noise ratio (amplitude) by ${Math.sqrt(N)}`, `averaging ${N} repeated sweeps with independent noise improves the signal-to-noise ratio (amplitude) by ${N}`, `The signal adds as $N$, the noise as $\\sqrt N$: gain $\\sqrt{${N}} = ${Math.sqrt(N)}$.`),
        ['Johnson noise has a flat (white) spectrum up to very high frequencies', true, 'Up to about $kT/h$, far above electronic bandwidths.'],
        ['shot noise current is $\\sqrt{2eI\\Delta f}$', true, 'From the random arrival of discrete charges.'],
        ['$1/f$ noise dominates at low frequencies', true, 'Its density rises as frequency falls.'],
        ['a lock-in amplifier shifts the signal to DC and then low-pass filters it', true, 'Multiplying by the reference and averaging.'],
        ['a longer lock-in time constant narrows the equivalent noise bandwidth', true, 'ENBW of a single RC stage is $1/(4RC)$.'],
        ['Johnson noise of a resistor grows with the current through it', false, 'It is equilibrium noise: present even with no current.'],
        ['chopping a DC signal before detection makes $1/f$ noise worse', false, 'Moving the signal to the chopping frequency escapes $1/f$ noise.'],
      ], { not });
      return { q: `Which of the following statements about noise and its reduction are ${nt(not)}?`, ...m,
        trap: 'Averaging $N$ times improves amplitude SNR by $\\sqrt N$, not $N$.' };
    } },
  { id: 'nli-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lock-in',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a single-phase lock-in output is proportional to the cosine of the phase difference between signal and reference', true, '$\\langle A\\sin(\\omega t + \\phi)\\sin\\omega t\\rangle = \\tfrac12A\\cos\\phi$.'],
        ['a dual-phase lock-in gives the amplitude $R = \\sqrt{X^2 + Y^2}$ whatever the phase', true, 'X and Y are the in-phase and quadrature parts.'],
        ['with a square-wave reference, a lock-in also responds at odd harmonics of the reference', true, 'A square wave contains odd harmonics with weights $1/n$.'],
        ['the equivalent noise bandwidth of one RC low-pass stage is $1/(4RC)$', true, 'Integrate $|H|^2$ over all positive frequencies.'],
        ['a lock-in amplifier needs no reference signal', false, 'The reference is essential: it defines the frequency and phase to detect.'],
        ['increasing the time constant makes the lock-in respond faster', false, 'It slows the response (settling takes several time constants).'],
        ['a lock-in rejects noise at all frequencies equally well, including at the reference frequency', false, 'Noise within the filter bandwidth of the reference frequency passes through.'],
      ], not);
      return { q: `Which statement about lock-in detection is ${nt(not)}?`, ...m,
        trap: 'Phase matters for a single-phase lock-in: at $90^\\circ$ it reads zero.' };
    } },
  { id: 'nli-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'noise spectra', format: 'match',
    make(r) {
      const L = {
        th: 'white, with mean-square value proportional to $TR\\Delta f$',
        sh: 'white, with mean-square value proportional to $I\\Delta f$',
        fl: 'rising as $1/f$ toward low frequency',
        pop: 'a random two-level (telegraph) signal with a Lorentzian spectrum',
        q: 'white, with mean square $\\Delta^2/12$ fixed by the step size',
        ktc: 'total mean square $kT/C$, independent of the resistance',
      };
      const cas = choose(r, [
        ['Johnson (thermal) noise of a resistor', 'th', '$\\overline{v^2} = 4kTR\\Delta f$.'],
        ['shot noise in a photodiode current', 'sh', '$\\overline{i^2} = 2eI\\Delta f$.'],
        ['flicker noise in a carbon resistor carrying current', 'fl', 'Fluctuations of resistance: density $\\propto 1/f$.'],
        ['burst (popcorn) noise in a transistor', 'pop', 'Charge traps switching between two states.'],
        ['quantisation noise of an ideal ADC with step $\\Delta$', 'q', 'Uniform error over $\\pm\\Delta/2$.'],
        ['the noise sampled on a capacitor through a switch resistance (RC)', 'ktc', 'Integrating $4kTR$ over the RC bandwidth $1/(4RC)$ cancels $R$.'],
      ]);
      return { q: `Which description fits ${cas[0]}?`, ...matchOne(r, L, cas),
        trap: '$kT/C$ noise does not depend on $R$: a bigger resistor gives more noise density but less bandwidth.' };
    } },
  { id: 'nli-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Johnson noise', format: 'limiting case',
    make(r) {
      const R1 = choose(r, [1, 2, 4.7, 10]), R2 = choose(r, [1, 3.3, 10, 22]), ser = r() < 0.5;
      const Req = ser ? R1 + R2 : (R1 * R2) / (R1 + R2), v = (R) => Math.sqrt(4 * 1.381e-23 * 300 * R * 1e3) * 1e9;
      const show = (x) => `${x.toFixed(2)} nV/$\\sqrt{\\text{Hz}}$`;
      const o = mcqOptions(r, v(Req), [v(R1) + v(R2), v(ser ? (R1 * R2) / (R1 + R2) : R1 + R2), Math.abs(v(R1) - v(R2)), v(Math.max(R1, R2))], show);
      return { q: `Resistors of ${R1} kΩ and ${R2} kΩ at 300 K are connected in ${ser ? 'series' : 'parallel'}. The open-circuit noise voltage density across the combination is`,
        options: o.options, answer: o.answer,
        sol: `Independent noise sources add in power. The result is the noise of the equivalent resistance, $${Req.toFixed(3)}$ kΩ: $\\sqrt{4kTR} = \\sqrt{4(1.38\\times10^{-23})(300)(${(Req * 1e3).toFixed(0)})} = ${v(Req).toFixed(2)}$ nV/$\\sqrt{\\text{Hz}}$.`,
        trap: 'Noise voltages of independent sources never add linearly; add their squares (or just use the equivalent resistance).' };
    } },
  { id: 'nli-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'shot noise', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const I = choose(r, [1e-9, 1e-6, 1e-3]), B = choose(r, [1, 1e3, 1e6]);
        x = Math.sqrt(2 * 1.602e-19 * I * B); unit = '\\text{A}';
        q = `The rms shot noise of a $${sci(I)}$ A photocurrent in a bandwidth of $${sci(B)}$ Hz is about`;
        sol = `$i_n = \\sqrt{2eI\\Delta f} = \\sqrt{2(1.6\\times10^{-19})(${sci(I)})(${sci(B)})} = ${sci(x)}$ A.`;
      } else {
        const R = choose(r, [50, 1e3, 1e6]), B = choose(r, [1e3, 1e6, 1e8]);
        x = Math.sqrt(4 * 1.381e-23 * 300 * R * B); unit = '\\text{V}';
        q = `The rms Johnson noise voltage of a ${R >= 1e6 ? '1 MΩ' : R >= 1e3 ? '1 kΩ' : '50 Ω'} resistor at 300 K over a bandwidth of $${sci(B)}$ Hz is about`;
        sol = `$v_n = \\sqrt{4kTR\\Delta f} = ${sci(x)}$ V.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'A 1 kΩ resistor at room temperature gives about 4 nV/$\\sqrt{\\text{Hz}}$.' };
    } },
];
