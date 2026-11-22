// Extra question shapes for sequential-logic (templates sl-m31..m35). Imported by sequential-logic.js.
import { choose, int, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'sl-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'counters', format: 'statements',
    make(r) {
      const n = int(r, 3, 6), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a ${n}-bit Johnson (twisted-ring) counter has ${2 * n} states`, `a ${n}-bit Johnson (twisted-ring) counter has ${2 ** n} states`, `A Johnson counter cycles through $2n = ${2 * n}$ states.`),
        vs(r, `a ${n}-bit ring counter has ${n} states`, `a ${n}-bit ring counter has ${2 ** n} states`, `One 1 circulates through $n = ${n}$ positions.`),
        vs(r, `a ${n}-bit binary counter has ${2 ** n} states`, `a ${n}-bit binary counter has ${2 * n} states`, `$2^n = ${2 ** n}$.`),
        ['a JK flip-flop with $J = K = 1$ toggles on each active clock edge', true, 'That is its toggle mode.'],
        ['a D flip-flop with $\\overline Q$ fed back to D divides the clock frequency by 2', true, 'It toggles each edge.'],
        ['in a ripple counter all flip-flops change state at the same instant', false, 'Each stage is clocked by the previous one, so changes ripple through with a delay per stage.'],
        ['a level-sensitive latch changes its output only at a clock edge', false, 'A latch is transparent for the whole time the enable is active.'],
        ['the master-slave arrangement removes the race-around problem of a level-triggered JK', true, 'The output can change only after the master has been cut off.'],
      ], { not });
      return { q: `Which of the following statements about flip-flops and counters are ${nt(not)}?`, ...m,
        trap: 'Ring: $n$ states. Johnson: $2n$. Binary: $2^n$.' };
    } },
  { id: 'sl-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'timing',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the minimum clock period is $t_{clk\\text{-}q} + t_{logic,max} + t_{setup}$ (no skew)', true, 'Data launched at one edge must arrive a setup time before the next.'],
        ['a setup-time violation can be cured by lowering the clock frequency', true, 'A longer period gives the data more time to arrive.'],
        ['a hold-time violation cannot be cured by lowering the clock frequency', true, 'Hold depends on the shortest path and the same edge, not on the period.'],
        ['the chance that a synchroniser is still metastable falls exponentially with the time allowed', true, '$P \\propto e^{-t/\\tau}$.'],
        ['clock skew can cause hold-time violations', true, 'A late clock at the capturing flip-flop lets new data race through.'],
        ['a hold-time violation can be cured by lowering the clock frequency', false, 'The period does not enter the hold check; add delay to the short path instead.'],
        ['a two-flip-flop synchroniser removes metastability completely', false, 'It only makes failures very rare (long MTBF).'],
        ['the maximum clock frequency is set by the shortest path through the logic', false, 'The longest (critical) path sets it; the shortest path matters for hold.'],
      ], not);
      return { q: `Which statement about timing in synchronous circuits is ${nt(not)}?`, ...m,
        trap: 'Setup: longest path, fix by slowing the clock. Hold: shortest path, fix by adding delay.' };
    } },
  { id: 'sl-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'state machines', format: 'match',
    make(r) {
      const L = { tog: 'a divide-by-2 (toggle) stage', sh: 'a shift register', joh: 'a Johnson counter', ring: 'a ring counter', lfsr: 'a pseudo-random sequence generator (LFSR)', sr: 'an SR latch' };
      const cas = choose(r, [
        ['A D flip-flop with its $\\overline Q$ output connected back to its D input', 'tog', 'Each clock edge loads the opposite of the present state.'],
        ['A chain of D flip-flops, each Q driving the next D, with data entering the first', 'sh', 'Each clock moves every bit one place along.'],
        ['A chain of D flip-flops with the $\\overline Q$ of the last fed back to the first D', 'joh', 'The twisted feedback fills with 1s then empties: $2n$ states.'],
        ['A chain of D flip-flops with the Q of the last fed back to the first D, started with a single 1', 'ring', 'The single 1 circulates: $n$ states.'],
        ['A shift register whose input is the XOR of selected stages', 'lfsr', 'With the right taps it cycles through $2^n - 1$ states, skipping all-zero.'],
        ['Two NOR gates, each output driving one input of the other', 'sr', 'Cross-coupling gives two stable states set and reset by the free inputs.'],
      ]);
      return { q: `${cas[0]} forms`, ...matchOne(r, L, cas),
        trap: 'Johnson feeds back $\\overline Q$; ring feeds back $Q$.' };
    } },
  { id: 'sl-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'frequency division', format: 'graph in words',
    make(r) {
      const n = int(r, 3, 5), kind = choose(r, ['bin', 'joh', 'ring', 'mod6']);
      const desc = (div, duty) => `a periodic wave of frequency $f/${div}$ that is high ${duty}`;
      const C = {
        bin: [`the most significant output of a ${n}-bit binary up-counter`, desc(2 ** n, 'half the time'), `The MSB stays high for the upper half of the $2^{${n}} = ${2 ** n}$ states.`],
        joh: [`any one output of a ${n}-bit Johnson counter`, desc(2 * n, 'half the time'), `Each output is high for $${n}$ of the $${2 * n}$ states, in one block.`],
        ring: [`any one output of a ${n}-bit ring counter holding a single 1`, desc(n, `for one clock period in every ${n}`), 'The single 1 visits each stage once per cycle.'],
        mod6: ['the most significant output $Q_2$ of a 3-bit counter that resets from 101 to 000 (mod 6)', desc(6, 'for two clock periods in every 6'), 'States 000 to 101: $Q_2 = 1$ only in 100 and 101.'],
      };
      const wr = [desc(2 ** n, 'half the time'), desc(2 * n, 'half the time'), desc(n, `for one clock period in every ${n}`), desc(6, 'for two clock periods in every 6'), desc(n, 'half the time'), desc(2 ** n, `for one clock period in every ${2 ** n}`)];
      const [what, ans, why] = C[kind];
      const o = mcqOptions(r, ans, wr);
      return { q: `A counter is clocked at frequency $f$. The waveform of ${what} is`, options: o.options, answer: o.answer,
        sol: `${why} So it is ${ans}.`,
        trap: 'Frequency and duty cycle both identify the counter: binary MSB $f/2^n$ at 50%, Johnson $f/2n$ at 50%, ring $f/n$ with duty $1/n$.' };
    } },
  { id: 'sl-m35', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'metastability', format: 'order of magnitude',
    make(r) {
      const tr = choose(r, [2, 3, 5]), tau = choose(r, [50, 100, 200]), T0 = choose(r, [50, 100]), fc = choose(r, [100e6, 500e6]), fd = choose(r, [1e6, 10e6]);
      const lg = (tr * 1e-9 / (tau * 1e-12)) / Math.LN10 - Math.log10(T0 * 1e-12 * fc * fd);
      const s = int(r, 0, 3), n = Math.round(lg);
      const options = [0, 1, 2, 3].map((i) => `$\\sim 10^{${n - s + i}}\\,\\text{s}$`);
      return { q: `A synchroniser allows a resolution time $t_r = ${tr}$ ns. Its flip-flop has $\\tau = ${tau}$ ps and $T_0 = ${T0}$ ps; the clock is $${sci(fc)}$ Hz and the asynchronous input changes $${sci(fd)}$ times per second. Using MTBF $= e^{t_r/\\tau}/(T_0f_{clk}f_{data})$, the MTBF is about`,
        options, answer: s,
        sol: `$t_r/\\tau = ${(tr * 1000 / tau).toFixed(0)}$, so $e^{t_r/\\tau} = 10^{${((tr * 1e-9) / (tau * 1e-12) / Math.LN10).toFixed(1)}}$. Denominator $T_0f_{clk}f_{data} = ${sci(T0 * 1e-12 * fc * fd)}$ s$^{-1}$. MTBF $\\approx 10^{${lg.toFixed(1)}}$ s. Each extra $\\tau$ of resolution time multiplies it by $e$.`,
        trap: 'The exponential dominates: a few hundred picoseconds more resolution time changes the MTBF by orders of magnitude.' };
    } },
];
