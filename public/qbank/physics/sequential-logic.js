// Sequential logic at GATE / CSIR NET level: latches and flip-flops (SR, D, JK, T; characteristic and excitation
// tables, race-around, master-slave, edge triggering, conversions), timing (setup, hold, clock-to-Q, skew, maximum clock
// frequency, metastability and synchronisers), counters (ripple and synchronous, up/down by edge and connection, mod-N
// by reset, ring and Johnson including lock-out states, cascading for frequency division, design with T and JK flip-
// flops), shift registers, LFSRs, state machines (Mealy and Moore, sequence detectors, state encoding).
// The JAM topic `digital-logic` has the basic counters and flip-flops. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './sequential-logic.more.gen.js';
import more2 from './sequential-logic.more2.gen.js';
import r4 from './sequential-logic.r4.gen.js';

const an = (n) => ([8, 11, 18].includes(n) ? 'An' : 'A');
const G = ['gate', 'net'];
const bin = (v, n) => v.toString(2).padStart(n, '0');

export default {
  topic: 'sequential-logic',
  items: [
    // ---------- level 1 ----------
    { id: 'sl-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'latches',
      q: 'For an SR latch built from two cross-coupled NOR gates, which input combination is not allowed?',
      options: ['$S = 0, R = 0$', '$S = 1, R = 0$', '$S = 1, R = 1$', '$S = 0, R = 1$'], answer: 2,
      sol: 'With both inputs 1, both NOR outputs are forced to 0, so $Q$ and $\\bar Q$ are no longer complements; and when both inputs return to 0 together the final state depends on which gate is faster. $S = R = 0$ holds the state. (For a NAND latch the forbidden pair is $S = R = 0$ on its active-low inputs.)',
      trap: '$S = R = 0$ is the memory (hold) condition for a NOR latch.' },
    { id: 'sl-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'flip-flops',
      q: 'An edge-triggered JK flip-flop has $J = K = 1$. At each active clock edge its output',
      options: ['toggles (changes to the opposite state)', 'resets to 0', 'sets to 1', 'stays the same'], answer: 0,
      sol: 'The JK characteristic equation $Q^+ = J\\bar Q + \\bar KQ$ gives $Q^+ = \\bar Q$ for $J = K = 1$. This is how a JK flip-flop becomes a T flip-flop and a divide-by-2.',
      trap: 'Thinking $J = K = 1$ is forbidden as in the SR latch; resolving that problem is the reason the JK exists.' },
    { id: 'sl-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'counters',
      q: 'The minimum number of flip-flops for a binary counter that counts through 12 states (mod-12) is',
      options: ['3', '12', '6', '4'], answer: 3,
      sol: '$n$ flip-flops give $2^n$ states. $2^3 = 8 < 12\\le16 = 2^4$, so 4 are needed (4 of the 16 states unused).',
      trap: 'A ring counter would need 12 and a Johnson counter 6, but the question asks for a binary counter.' },
    { id: 'sl-004', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Johnson counter',
      q: 'A Johnson (twisted-ring) counter is built with 5 flip-flops. The number of distinct states in its normal sequence is ______.',
      answer: 10, tol: 0, calc: () => 2 * 5,
      sol: 'In a Johnson counter the complement of the last output is fed back to the first. Ones fill in from one end and then zeros: $2n = 10$ states for $n = 5$. A plain ring counter with one circulating 1 has only $n = 5$.',
      trap: 'Confusing it with the ring counter (5) or a binary counter (32).' },
    { id: 'sl-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'flip-flops',
      q: 'The characteristic equation of a D flip-flop is',
      options: ['$Q^+ = D\\bar Q$', '$Q^+ = D$', '$Q^+ = D\\oplus Q$', '$Q^+ = \\bar D$'], answer: 1,
      sol: 'At the clock edge the output takes the value of $D$, whatever it was before. So $Q^+ = D$. $D\\oplus Q$ is the T flip-flop with $T = D$.',
      trap: 'The D flip-flop has no hold input: holding needs $D = Q$ fed back (or a clock enable).' },
    { id: 'sl-006', type: 'msq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'counters', format: 'multi',
      q: 'Which statements comparing ripple (asynchronous) and synchronous counters are correct?',
      options: ['In a synchronous counter every flip-flop is clocked by the same clock', 'In a ripple counter the propagation delays add up along the chain', 'Decoding the outputs of a ripple counter can give short false pulses (glitches)', 'Synchronous counters need no logic gates at all'], answer: [0, 1, 2],
      sol: 'Ripple counters clock each flip-flop from the previous output, so the last one changes $n$ delays after the clock and passes through wrong intermediate states (011 goes to 010, 000, then 100). A synchronous counter changes all bits together, but it needs gates to decide which bits toggle.',
      trap: 'Synchronous counters trade gates for speed and clean outputs.' },

    // ---------- level 2 ----------
    { id: 'sl-007', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'frequency division', unit: 'kHz',
      q: 'A 4-bit binary ripple counter is clocked at $16$ kHz. The frequency of the square wave at its most significant output is ______ kHz.',
      answer: 1, tol: 0, calc: () => 16 / 2 ** 4,
      sol: 'Each flip-flop divides by 2, so the fourth output runs at $16/2^4 = 1$ kHz, with a 50% duty cycle.',
      trap: 'Dividing by 4 (the number of flip-flops) instead of $2^4$.' },
    { id: 'sl-008', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'flip-flops',
      q: 'The characteristic equation of a JK flip-flop is',
      options: ['$Q^+ = J + KQ$', '$Q^+ = JK + \\bar Q$', '$Q^+ = J\\bar Q + \\bar KQ$', '$Q^+ = J\\oplus K$'], answer: 2,
      sol: 'From the table: $JK = 00$ holds ($Q^+ = Q$), $10$ sets, $01$ resets, $11$ toggles. The K-map of $Q^+$ against $J, K, Q$ simplifies to $J\\bar Q + \\bar KQ$: set when 0 if $J = 1$, stay 1 unless $K = 1$.',
      trap: 'Check the toggle case: $J = K = 1$ must give $\\bar Q$.' },
    { id: 'sl-009', type: 'nat', level: 2, exams: G, sub: 'shift registers', unit: 'μs',
      q: 'An 8-bit serial-in serial-out shift register is clocked at $1$ MHz. A bit entering the serial input appears at the serial output after ______ μs.',
      answer: 8, tol: 0, calc: () => 8 / 1,
      sol: 'Each clock moves the bit one stage, so it needs 8 clocks of 1 μs each: 8 μs. Shift registers make digital delay lines this way.',
      trap: 'Answering 7: the bit is at the output only after the eighth edge.' },
    { id: 'sl-010', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'conversions',
      q: 'To make a T flip-flop from a JK flip-flop, connect',
      options: ['$J = T$ and $K = \\bar T$', '$J = K = T$', '$J = T$ and $K = 0$', '$J = \\bar Q$ and $K = T$'], answer: 1,
      sol: 'With $J = K = T$: $T = 0$ gives hold, $T = 1$ gives toggle, exactly the T flip-flop. $J = T$, $K = \\bar T$ gives a D flip-flop instead.',
      trap: '$J = D$, $K = \\bar D$ is the JK-to-D conversion.' },
    { id: 'sl-011', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'mod-N counters',
      q: 'A 4-bit ripple up-counter has its asynchronous clear driven by a NAND gate whose inputs are $Q_3$ and $Q_1$ ($Q_0$ is the least significant bit). Starting from 0000, it cycles through how many stable states?',
      answer: 10, tol: 0, calc: () => 0b1010,
      sol: 'The first count with $Q_3 = Q_1 = 1$ is 1010 = 10. As soon as it appears the counter clears to 0000, so 1010 lasts only a few nanoseconds. Stable states: 0 to 9: a decade (mod-10) counter.',
      trap: 'Counting the momentary state 1010 as an eleventh state.' },
    { id: 'sl-012', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'race-around',
      q: 'A level-triggered JK flip-flop with $J = K = 1$ suffers the race-around condition when',
      options: ['the clock is high for longer than the flip-flop\'s propagation delay, so it toggles more than once per pulse', 'the clock is too slow overall', 'the inputs change after the clock goes low', 'it is replaced by an edge-triggered device'], answer: 0,
      sol: 'While the clock is high the flip-flop is transparent: it toggles, the new output feeds back through $J$, $K$ and toggles it again, repeatedly, until the clock falls. The final state is unpredictable. Master-slave and edge-triggered designs allow only one change per clock.',
      trap: 'The fix is a short sampling window, not a slower clock.' },
    { id: 'sl-013', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'latches',
      q: 'What distinguishes a D latch from an edge-triggered D flip-flop?',
      options: ['The latch has no enable input', 'The latch can only store a 1', 'The latch is transparent: its output follows $D$ for as long as the enable is active, while the flip-flop samples $D$ only at the clock edge', 'There is no difference in behaviour'], answer: 2,
      sol: 'A latch is level sensitive; a flip-flop is edge sensitive. In a pipeline of latches clocked together, data could race through several stages in one clock phase; flip-flops prevent that.',
      trap: 'Both store one bit; the difference is when they listen to the input.' },
    { id: 'sl-014', type: 'msq', level: 2, exams: G, sub: 'Johnson counter', format: 'multi',
      q: 'For a 4-bit Johnson counter in its normal sequence, which statements are correct?',
      options: ['It has 8 states', 'Successive states differ in exactly one bit', 'Each state can be decoded with a single 2-input gate', 'It returns to the normal sequence by itself from any power-up state'], answer: [0, 1, 2],
      sol: 'The sequence is 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001: 8 states, one bit changing at a time, and each state is identified by one adjacent pair of bits (so glitch-free 2-input decoding). The other 8 states form a separate loop; without extra logic a counter that starts there stays there.',
      trap: 'The unused states of a Johnson counter form a lock-out loop.' },
    { id: 'sl-015', type: 'nat', level: 2, exams: G, sub: 'ripple counter timing', unit: 'MHz',
      q: 'A 4-bit ripple counter uses flip-flops with a propagation delay of 10 ns. If every output must settle before the next clock edge, the highest clock frequency is ______ MHz.',
      answer: 25, tol: 0, calc: () => 1 / (4 * 10e-9) / 1e6,
      sol: 'The worst case (for example 0111 to 1000) ripples through all four flip-flops: $4\\times10 = 40$ ns. The period must be at least that: $f_{max} = 1/40\\text{ ns} = 25$ MHz.',
      trap: 'Using one flip-flop delay (100 MHz) as for a synchronous counter.' },
    { id: 'sl-016', type: 'mcq', level: 2, exams: G, sub: 'excitation tables',
      q: 'A JK flip-flop must go from $Q = 0$ to $Q = 1$ at the next clock edge. The required inputs are ($X$ = don\'t care)',
      options: ['$J = 0$, $K = X$', '$J = X$, $K = 1$', '$J = X$, $K = 0$', '$J = 1$, $K = X$'], answer: 3,
      sol: 'From 0, either "set" ($J = 1$, $K = 0$) or "toggle" ($J = 1$, $K = 1$) gives 1. So $J = 1$, $K = X$. Excitation tables like this are the starting point for synchronous counter design.',
      trap: '$J = X$, $K = 0$ is the excitation for $1\\to1$.' },

    // ---------- level 3 ----------
    { id: 'sl-017', type: 'nat', level: 3, exams: G, sub: 'timing', unit: 'MHz',
      q: 'In a synchronous circuit, a flip-flop with clock-to-Q delay 3 ns drives combinational logic with a worst-case delay of 12 ns into a flip-flop with setup time 2 ns (no clock skew). The maximum clock frequency is ______ MHz (to one decimal place).',
      answer: 58.8, tol: 0.1, calc: () => 1e3 / (3 + 12 + 2),
      sol: 'The data launched at one edge must arrive a setup time before the next: $T\\ge t_{cq} + t_{logic} + t_{su} = 17$ ns. $f_{max} = 1/17\\text{ ns} = 58.8$ MHz.',
      trap: 'Leaving out the setup time or the clock-to-Q delay.' },
    { id: 'sl-018', type: 'nat', level: 3, exams: G, sub: 'timing', unit: 'ns',
      q: 'A flip-flop has minimum clock-to-Q delay 1.0 ns and drives a path with minimum logic delay 0.5 ns into a flip-flop with hold time 0.8 ns. The largest clock skew (capture clock arriving later than launch clock) the path can tolerate without a hold violation is ______ ns.',
      answer: 0.7, tol: 0.01, calc: () => 1.0 + 0.5 - 0.8,
      sol: 'Hold requires the new data not to reach the capturing flip-flop until a hold time after its clock edge: $t_{cq,min} + t_{logic,min}\\ge t_h + t_{skew}$. So $t_{skew}\\le1.0 + 0.5 - 0.8 = 0.7$ ns. Note that the clock period does not enter hold checks.',
      trap: 'Trying to fix a hold problem by slowing the clock: it does not help.' },
    { id: 'sl-019', type: 'mcq', level: 3, exams: G, sub: 'state sequences',
      q: 'Three D flip-flops have $D_2 = Q_1$, $D_1 = Q_0$ and $D_0 = \\bar Q_2$. Starting from $Q_2Q_1Q_0 = 000$, the state after 4 clock edges is',
      options: ['111', '110', '100', '011'], answer: 1,
      sol: 'Each edge shifts left and feeds in $\\bar Q_2$: 000 → 001 → 011 → 111 → 110 (after 4) → 100 → 000. It is a 3-bit Johnson counter with 6 states.',
      trap: 'Shifting in $Q_2$ instead of its complement gives a ring that stays at 000.' },
    { id: 'sl-020', type: 'nat', level: 3, exams: G, sub: 'LFSR',
      q: 'A 6-bit linear feedback shift register (XOR feedback) with well-chosen taps runs through a maximal-length sequence. Its length (number of distinct states) is ______.',
      answer: 63, tol: 0, calc: () => 2 ** 6 - 1,
      sol: 'With XOR feedback the all-zero state maps to itself, so it cannot be part of the cycle. A primitive feedback polynomial visits every other state: $2^6 - 1 = 63$. These sequences are used as pseudo-random generators and in CRC and scrambler circuits.',
      trap: 'Answering 64: the all-zero state is a trap state for XOR feedback.' },
    { id: 'sl-021', type: 'mcq', level: 3, exams: G, sub: 'state machines',
      q: 'In a Mealy state machine, the outputs depend on',
      options: ['the present state only', 'the present state and the present inputs', 'the inputs only, with no memory', 'the clock frequency'], answer: 1,
      sol: 'Moore outputs are functions of the state only, so they change only after a clock edge. Mealy outputs also depend on the inputs, so they can respond within the same clock cycle and the machine often needs fewer states.',
      trap: 'State only is the Moore machine.' },
    { id: 'sl-022', type: 'nat', level: 3, exams: G, sub: 'sequence detectors',
      q: 'A Mealy machine must output 1 whenever the last four input bits are 1011 (overlapping allowed). The minimum number of states is ______.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'States remember the longest useful prefix seen: S0 (nothing), S1 ("1"), S2 ("10"), S3 ("101"). In S3 an input 1 completes 1011: output 1 and go to S1 (the final 1 starts a new match). A Moore machine needs a fifth state to hold the output.',
      trap: 'Adding a separate "found" state belongs to the Moore design.' },
    { id: 'sl-023', type: 'msq', level: 3, exams: G, sub: 'metastability', format: 'multi',
      q: 'Which statements about metastability in flip-flops are correct?',
      options: ['It can occur when the data changes inside the setup-hold window around the clock edge', 'A chain of two flip-flops (a synchroniser) greatly reduces the chance that a metastable value reaches the logic', 'The mean time between failures grows exponentially with the time allowed for the flip-flop to resolve', 'A fast enough flip-flop removes metastability completely'], answer: [0, 1, 2],
      sol: 'A flip-flop is a bistable circuit; a violated window can leave it balanced near the midpoint, from which it escapes as $e^{t/\\tau}$. Giving it one more clock period to resolve multiplies the MTBF by $e^{T/\\tau}$. The probability can be made tiny but never zero.',
      trap: 'Metastability is reduced, never eliminated.' },
    { id: 'sl-024', type: 'nat', level: 3, exams: G, sub: 'synchronous counters',
      q: 'A 3-bit synchronous counter has $J_0 = K_0 = 1$, $J_1 = K_1 = Q_0$ and $J_2 = K_2 = Q_0Q_1$. Starting from 000, after 13 clock edges its state, read as a binary number $Q_2Q_1Q_0$, is ______.',
      answer: 5, tol: 0, calc: () => 13 % 8,
      sol: 'Bit 0 toggles every edge, bit 1 when $Q_0 = 1$, bit 2 when $Q_0Q_1 = 1$: a binary up-counter, mod 8. After 13 edges: $13\\bmod8 = 5$ (101).',
      trap: 'Reading it as a down counter.' },
    { id: 'sl-025', type: 'mcq', level: 3, exams: G, sub: 'ripple counters',
      q: 'A ripple counter uses positive-edge-triggered T flip-flops ($T = 1$), each clocked from the $Q$ output of the previous one. It counts',
      options: ['up', 'down', 'up to 3 and stops', 'not at all: the outputs stay at 0'], answer: 1,
      sol: 'Bit 1 toggles when $Q_0$ rises (0 → 1). From 00: $Q_0$ rises, so $Q_1$ toggles: 11; next $Q_0$ falls: 10; then rises: $Q_1$ toggles: 01; then 00. The sequence 0, 3, 2, 1 is a down count. Negative-edge flip-flops clocked from $Q$ (or positive-edge from $\\bar Q$) count up.',
      trap: 'Assuming every ripple counter counts up.' },
    { id: 'sl-026', type: 'nat', level: 3, exams: G, sub: 'frequency division', unit: 'kHz',
      q: 'A Johnson counter with 5 flip-flops is clocked at $1$ MHz. The frequency of the square wave at any one flip-flop output is ______ kHz.',
      answer: 100, tol: 0, calc: () => 1000 / 10,
      sol: 'The normal sequence has $2n = 10$ states, and each output is high for 5 consecutive states and low for 5. So each output repeats every 10 clocks: 100 kHz with a 50% duty cycle.',
      trap: 'Dividing by 5 (a ring counter) or by 32 (a binary counter).' },
    { id: 'sl-027', type: 'mcq', level: 3, exams: G, sub: 'flip-flops',
      q: 'A JK flip-flop has its own outputs fed back to its inputs: $J = \\bar Q$ and $K = Q$. At each clock edge it',
      options: ['holds its state', 'resets to 0', 'sets to 1', 'toggles'], answer: 3,
      sol: '$Q^+ = J\\bar Q + \\bar KQ = \\bar Q\\cdot\\bar Q + \\bar Q\\cdot Q = \\bar Q$. With $Q = 0$ it sees $J = 1$, $K = 0$ (set); with $Q = 1$ it sees $J = 0$, $K = 1$ (reset): it toggles.',
      trap: 'Plugging in the inputs without letting them depend on $Q$.' },
    { id: 'sl-028', type: 'nat', level: 3, exams: G, sub: 'shift registers', unit: 'μs',
      q: 'An 8-bit serial-in parallel-out shift register is clocked at $2$ MHz. A byte arriving bit by bit is complete at the parallel outputs ______ μs after its first bit is clocked in (count from the first clock edge to the last).',
      answer: 3.5, tol: 0.01, calc: () => 7 / 2,
      sol: 'Eight bits need eight clock edges; from the first edge to the eighth there are 7 clock periods of 0.5 μs: 3.5 μs.',
      trap: 'Counting 8 periods (4 μs) instead of the 7 gaps between 8 edges.' },

    // ---------- level 4 ----------
    { id: 'sl-029', type: 'nat', level: 4, exams: G, sub: 'frequency division', unit: 'kHz',
      q: 'A $6$ MHz clock drives a mod-5 counter whose most significant output clocks a mod-12 counter. The frequency at the most significant output of the mod-12 counter is ______ kHz.',
      answer: 100, tol: 0, calc: () => 6000 / (5 * 12),
      sol: 'Each counter divides by its modulus, and cascading multiplies: $6\\text{ MHz}/(5\\times12) = 100$ kHz (one cycle per 60 input clocks, though not with a 50% duty cycle).',
      trap: 'Adding the moduli (17) instead of multiplying.' },
    { id: 'sl-030', type: 'mcq', level: 4, exams: G, sub: 'state sequences',
      q: 'Two D flip-flops are connected with $D_1 = Q_0$ and $D_0 = \\bar Q_1$. Starting from $Q_1Q_0 = 00$, the circuit is',
      options: ['a 2-bit Johnson counter with the sequence 00, 01, 11, 10 (one bit changes per clock)', 'a binary up-counter 00, 01, 10, 11', 'a binary down-counter', 'a ring counter that alternates 01 and 10'], answer: 0,
      sol: 'From 00: $Q_1^+ = 0$, $Q_0^+ = 1$ → 01; then $Q_1^+ = 1$, $Q_0^+ = 1$ → 11; then $Q_1^+ = 1$, $Q_0^+ = 0$ → 10; then 00. The order 00, 01, 11, 10 is Gray code: a 2-bit Johnson counter, often used to make quadrature clocks.',
      trap: 'Expecting binary order from two flip-flops.' },
    { id: 'sl-031', type: 'nat', level: 4, exams: G, sub: 'LFSR',
      q: 'A 3-bit shift register shifts $Q_0\\to Q_1\\to Q_2$ at each clock, with new input $Q_0^+ = Q_1\\oplus Q_2$. Starting from $Q_2Q_1Q_0 = 001$, how many clocks pass before the state 001 returns?',
      answer: 7, tol: 0, calc: () => { let s = 1, k = 0; do { const q0 = s & 1, q1 = (s >> 1) & 1, q2 = (s >> 2) & 1; s = (q1 << 2) | (q0 << 1) | (q1 ^ q2); k++; } while (s !== 1 && k < 20); return k; },
      sol: 'Step through: 001 → 010 → 101 → 011 → 111 → 110 → 100 → 001. Seven clocks: every non-zero state is visited, a maximal-length sequence ($2^3 - 1$).',
      trap: 'Expecting 8 states: 000 would lock up and is never reached.' },
    { id: 'sl-032', type: 'msq', level: 4, exams: G, sub: 'counter design', format: 'multi',
      q: 'A 3-bit synchronous binary up-counter is built from T flip-flops. Which toggle inputs are correct?',
      options: ['$T_0 = 1$', '$T_1 = Q_0$', '$T_2 = Q_0Q_1$', '$T_2 = Q_1$'], answer: [0, 1, 2],
      sol: 'In binary counting a bit flips exactly when all lower bits are 1: bit 0 always, bit 1 when $Q_0 = 1$, bit 2 when $Q_0 = Q_1 = 1$. $T_2 = Q_1$ would flip bit 2 at 010 → 111, which is wrong.',
      trap: 'Using only the bit immediately below.' },
    { id: 'sl-033', type: 'nat', level: 4, exams: G, sub: 'ripple counter timing',
      q: 'A 3-bit ripple up-counter changes from 011 to 100. How many wrong intermediate states appear briefly at its outputs before 100 settles?',
      answer: 2, tol: 0, calc: () => 2,
      sol: 'Bit 0 falls first: 011 → 010. That edge makes bit 1 fall: 010 → 000. That makes bit 2 rise: 000 → 100. The two transient states 010 and 000 each last one flip-flop delay; a decoder watching for 2 or 0 would glitch.',
      trap: 'Thinking all bits change together, as in a synchronous counter.' },
    { id: 'sl-034', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'latches',
      q: 'A mechanical switch bounces several times when pressed. A common way to get one clean transition is',
      options: ['feed it to a T flip-flop', 'use a single-pole double-throw switch driving an SR latch', 'connect it directly to a counter', 'add a second switch in series'], answer: 1,
      sol: 'The first contact with one throw sets (or resets) the latch; bounces on that same contact only repeat the same command, and the moving contact cannot reach the other throw during the bounce. The output changes once. (An RC filter plus Schmitt trigger is the other classic fix.)',
      trap: 'A T flip-flop would toggle on every bounce.' },
    { id: 'sl-035', type: 'nat', level: 4, exams: G, sub: 'timing', unit: 'MHz',
      q: 'A synchronous 4-bit counter uses flip-flops with clock-to-Q delay 4 ns and setup time 2 ns; its slowest toggle logic path has 6 ns delay. The maximum clock frequency is ______ MHz (to one decimal place).',
      answer: 83.3, tol: 0.2, calc: () => 1e3 / (4 + 6 + 2),
      sol: '$T_{min} = t_{cq} + t_{logic} + t_{su} = 4 + 6 + 2 = 12$ ns, so $f_{max} = 83.3$ MHz, regardless of the number of bits (unlike a ripple counter, though wider counters have longer toggle logic).',
      trap: 'Multiplying by 4 as for a ripple counter.' },
    { id: 'sl-036', type: 'nat', level: 4, exams: G, sub: 'Johnson counter',
      q: 'A counter must have 50 distinct states. Built as a Johnson counter, it needs ______ flip-flops (a binary counter would need only 6).',
      answer: 25, tol: 0, calc: () => 50 / 2,
      sol: 'A Johnson counter with $n$ flip-flops has $2n$ states, so $n = 25$. The price of simple glitch-free decoding is many more flip-flops.',
      trap: 'Answering 50 (ring counter) or 6 (binary).' },

    // ---------- level 5 ----------
    { id: 'sl-037', type: 'nat', level: 5, exams: G, sub: 'Johnson counter',
      q: 'A 4-bit Johnson counter (no self-correcting logic) powers up in the state 0010, which is not in its normal sequence. It then cycles through a loop of ______ states that never joins the normal sequence.',
      answer: 8, tol: 0, calc: () => 16 - 8,
      sol: 'The normal loop uses 8 of the 16 states. Shifting with complemented feedback maps the other 8 into each other: 0010, 0101, 1011, 0110, 1101, 1010, 0100, 1001 (shift towards the higher bit, feed in the complement of the top bit), then back to 0010. A gate that detects one illegal pattern and forces a reset fixes this.',
      trap: 'Expecting a lost counter to fall back into the right sequence by itself.' },
    { id: 'sl-038', type: 'msq', level: 5, exams: G, sub: 'state machines', format: 'multi',
      q: 'Which statements about synchronous state machines are correct?',
      options: ['A Moore machine\'s outputs change only after clock edges', 'A Mealy machine\'s output can change between clock edges if an input changes', 'For the same input-output behaviour, a Mealy machine needs no more states than a Moore machine', 'One-hot encoding of a 10-state machine needs 4 flip-flops'], answer: [0, 1, 2],
      sol: 'Moore outputs are functions of the state, which changes only at edges. Mealy outputs see the inputs directly, so they follow input changes immediately (and can glitch). Any Moore machine is also a Mealy machine, and Mealy designs often merge output states. One-hot uses one flip-flop per state: 10. Binary encoding needs $\\lceil\\log_2 10\\rceil = 4$.',
      trap: 'One-hot spends flip-flops to save decoding logic.' },
    { id: 'sl-039', type: 'nat', level: 5, exams: G, sub: 'ripple counter timing', unit: 'MHz',
      q: 'An 8-bit ripple counter has 12 ns of delay per flip-flop, and its outputs are decoded by a gate that is enabled by a strobe needing 16 ns after the outputs settle. The highest clock frequency for reliable decoding is ______ MHz (to two decimal places).',
      answer: 8.93, tol: 0.02, calc: () => 1e3 / (8 * 12 + 16),
      sol: 'Worst case: the change ripples through all 8 flip-flops ($96$ ns), then the strobe needs 16 ns: $T\\ge112$ ns, $f\\le8.93$ MHz.',
      trap: 'Ignoring the strobe time, or using one flip-flop delay.' },
    { id: 'sl-040', type: 'mcq', level: 5, exams: G, sub: 'synchronous counters',
      q: 'A 2-bit synchronous counter has $J_0 = K_0 = 1$ and $J_1 = K_1 = \\bar Q_0$. Starting from $Q_1Q_0 = 00$, it is',
      options: ['a down counter', 'an up counter', 'a Gray-code counter', 'a ring counter'], answer: 0,
      sol: 'Bit 1 toggles when $Q_0 = 0$ before the edge. 00 → 11 (bit 1 toggles) → 10 (bit 1 holds, since $Q_0$ was 1) → 01 (toggles) → 00. The sequence 0, 3, 2, 1 counts down: a bit flips when all lower bits are 0.',
      trap: 'Using $Q_0$ after the edge instead of before.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'sl-g01', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'frequency division',
      make(r) {
        const f = choose(r, [1, 2, 4, 5, 6, 8, 10, 12, 16, 20, 32]), stages = [int(r, 2, 12), choose(r, [2, 4, 8, 10, 12, 16])], three = r() < 0.4;
        if (three) stages.push(choose(r, [2, 3, 5, 6, 10]));
        const out = f * 1e3 / stages.reduce((a, b) => a * b, 1);
        return { q: `A $${f}$ MHz clock drives ${stages.map((m) => `a mod-${m}`).join(', then ')} counter in cascade. The output frequency of the last counter is ______ kHz (to three decimal places).`,
          answer: round(out, 3), tol: Math.max(0.001, round(out * 0.001, 3)), unit: 'kHz', f, stages,
          sol: `Cascaded counters divide by the product of their moduli: $${stages.join('\\times')} = ${stages.reduce((a, b) => a * b, 1)}$. $${f}\\text{ MHz}/${stages.reduce((a, b) => a * b, 1)} = ${round(out, 3)}$ kHz.`,
          trap: 'Adding the moduli.' };
      },
      verify: (p) => p.f * 1e3 / p.stages.reduce((a, b) => a * b, 1) },
    { id: 'sl-g02', type: 'nat', level: 3, exams: G, sub: 'timing',
      make(r) {
        const tcq = pick(r, 0.5, 5, 0.5), tl = pick(r, 1, 20, 0.5), tsu = pick(r, 0.2, 3, 0.1), sk = choose(r, [0, 0, 0.5, 1, -0.5]);
        const T = tcq + tl + tsu - sk, f = 1e3 / T;
        return { q: `A path runs from a flip-flop (clock-to-Q $${tcq}$ ns) through logic ($${tl}$ ns worst case) into a flip-flop with setup time $${tsu}$ ns. The capture clock arrives $${sk}$ ns ${sk >= 0 ? 'later' : 'earlier'} than the launch clock${sk < 0 ? ' (that is, the skew is negative)' : ''}. The maximum clock frequency is ______ MHz (to one decimal place).`.replace(`$${sk}$ ns earlier`, `$${Math.abs(sk)}$ ns earlier`),
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.002, 1)), unit: 'MHz', tcq, tl, tsu, sk,
          sol: `Setup check: $T\\ge t_{cq} + t_{logic} + t_{su} - t_{skew} = ${tcq} + ${tl} + ${tsu} ${sk >= 0 ? '-' : '+'} ${Math.abs(sk)} = ${round(T, 2)}$ ns. $f_{max} = ${round(f, 1)}$ MHz. A late capture clock gives the data extra time; an early one takes time away.`,
          trap: 'Getting the sign of the skew backwards.' };
      },
      verify: (p) => 1e3 / (p.tcq + p.tl + p.tsu - p.sk) },
    { id: 'sl-g03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'counters',
      make(r) {
        const N = int(r, 3, 100), kind = choose(r, ['binary', 'ring', 'johnson']);
        const val = kind === 'binary' ? Math.ceil(Math.log2(N) - 1e-9) : kind === 'ring' ? N : Math.ceil(N / 2);
        return { q: `A counter must cycle through ${N} distinct states. Built as a ${kind === 'binary' ? 'binary counter' : kind === 'ring' ? 'ring counter (one circulating 1)' : 'Johnson (twisted-ring) counter'}, the minimum number of flip-flops is ______.`,
          answer: val, tol: 0, N, kind,
          sol: kind === 'binary' ? `Need $2^n\\ge${N}$: $n = ${val}$ ($2^{${val}} = ${2 ** val}$).` : kind === 'ring' ? `A ring counter has one state per flip-flop: ${N}.` : `A Johnson counter has $2n$ states, and for an odd count a small change of the feedback drops one: $n = \\lceil${N}/2\\rceil = ${val}$.`,
          trap: 'Mixing up the state counts of ring ($n$), Johnson ($2n$) and binary ($2^n$) counters.' };
      },
      verify: (p) => (p.kind === 'binary' ? Math.ceil(Math.log2(p.N) - 1e-9) : p.kind === 'ring' ? p.N : Math.ceil(p.N / 2)) },
    { id: 'sl-g04', type: 'nat', level: 3, exams: G, sub: 'ripple counter timing',
      make(r) {
        const n = int(r, 3, 12), tpd = pick(r, 5, 30, 1), ts = choose(r, [0, 0, 5, 10, 20]);
        const f = 1e3 / (n * tpd + ts);
        return { q: `${an(n)} ${n}-bit ripple counter uses flip-flops with ${tpd} ns propagation delay${ts ? `, and its decoder needs a ${ts} ns strobe after the outputs settle` : ''}. The highest clock frequency at which all outputs ${ts ? 'can be decoded reliably' : 'settle within one period'} is ______ MHz (to two decimal places).`,
          answer: round(f, 2), tol: Math.max(0.01, round(f * 0.002, 2)), unit: 'MHz', n, tpd, ts,
          sol: `Worst case ripples through all ${n} stages: $${n}\\times${tpd} = ${n * tpd}$ ns${ts ? `, plus ${ts} ns of strobe: ${n * tpd + ts} ns` : ''}. $f_{max} = ${round(f, 2)}$ MHz.`,
          trap: 'Using one flip-flop delay, as for a synchronous counter.' };
      },
      verify: (p) => 1e3 / (p.n * p.tpd + p.ts) },
    { id: 'sl-g05', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'flip-flops',
      make(r) {
        const type = choose(r, ['JK', 'SR', 'T', 'D']), Q = int(r, 0, 1), a = int(r, 0, 1), b = int(r, 0, 1);
        let nxt, inp;
        if (type === 'JK') { nxt = (a && !Q) || (!b && Q) ? 1 : 0; inp = `$J = ${a}$, $K = ${b}$`; }
        else if (type === 'SR') { nxt = a && b ? 2 : a ? 1 : b ? 0 : Q; inp = `$S = ${a}$, $R = ${b}$`; }
        else if (type === 'T') { nxt = a ? 1 - Q : Q; inp = `$T = ${a}$`; }
        else { nxt = a; inp = `$D = ${a}$`; }
        const options = ['$Q^+ = 0$', '$Q^+ = 1$', 'not defined (forbidden input combination)'];
        return { q: `A clocked ${type} flip-flop has $Q = ${Q}$ and inputs ${inp}. After the next active clock edge,`, options, answer: nxt,
          sol: type === 'JK' ? `$Q^+ = J\\bar Q + \\bar KQ = ${a}\\cdot${1 - Q} + ${1 - b}\\cdot${Q} = ${nxt}$.` : type === 'SR' ? (nxt === 2 ? '$S = R = 1$ is forbidden for an SR flip-flop: the next state is not defined.' : `$Q^+ = S + \\bar RQ$ with $SR = 0$: $Q^+ = ${nxt}$.`) : type === 'T' ? `$Q^+ = T\\oplus Q = ${a}\\oplus${Q} = ${nxt}$.` : `$Q^+ = D = ${a}$.`,
          trap: 'Treating $J = K = 1$ as forbidden (it toggles), or $S = R = 1$ as toggle (it is forbidden).' };
      } },
    { id: 'sl-g06', type: 'nat', level: 3, exams: G, sub: 'mod-N counters',
      make(r) {
        const n = int(r, 3, 4), V = choose(r, [3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15].filter((v) => v < 2 ** n)), start = 0, k = int(r, 5, 60);
        const bits = []; for (let i = 0; i < n; i++) if ((V >> i) & 1) bits.push(`Q_${i}`);
        // a NAND of the 1-bits of V clears the counter the moment it reaches V (or any earlier count containing those bits)
        let M = V; for (let c = 1; c <= V; c++) if ((c & V) === V) { M = c; break; }
        const val = (start + k) % M;
        return { q: `${an(n)} ${n}-bit ripple up-counter has its asynchronous clear driven by a NAND of $${bits.join(', ')}$ ($Q_0$ least significant). Starting from 0, its stable count after ${k} clock pulses is ______.`,
          answer: val, tol: 0, n, V, k, M,
          sol: `The first count with all of $${bits.join(', ')}$ high is ${M} (${bin(M, n)}); it clears at once, so the stable states are 0 to ${M - 1}: mod-${M}. After ${k} pulses: $${k}\\bmod${M} = ${val}$.`,
          trap: 'Including the momentary clearing state in the count.' };
      },
      verify: (p) => p.k % p.M },
    { id: 'sl-g07', type: 'nat', level: 4, exams: G, sub: 'LFSR',
      make(r) {
        const n = choose(r, [3, 4]), taps = n === 3 ? choose(r, [[1, 2], [0, 2], [2], [0, 1, 2]]) : choose(r, [[2, 3], [0, 3], [1, 3], [3], [0, 1, 2, 3], [1, 2, 3]]);
        const seed = int(r, 1, 2 ** n - 1);
        const step = (s) => { let fb = 0; for (const t of taps) fb ^= (s >> t) & 1; return ((s << 1) & (2 ** n - 1)) | fb; };
        let s = step(seed), k = 1; const seen = new Set([seed]);
        while (s !== seed && !seen.has(s) && k <= 2 ** n) { seen.add(s); s = step(s); k++; }
        const back = s === seed;
        const len = back ? k : 0;
        return { q: `${an(n)} ${n}-bit shift register shifts $Q_0\\to Q_1\\to\\ldots\\to Q_{${n - 1}}$ each clock, with new input $Q_0^+ = ${taps.map((t) => `Q_${t}`).join('\\oplus ')}$. Starting from $Q_{${n - 1}}\\ldots Q_0 = ${bin(seed, n)}$, ${back ? 'the number of clocks before the starting state first returns is' : 'it never returns to the start; the number of clocks before it first repeats a state is'} ______.`,
          answer: back ? len : k, tol: 0, n, taps, s0: seed,
          sol: `Stepping the register: ${(() => { const l = [bin(seed, n)]; let x = seed; for (let i = 0; i < Math.min(k, 16); i++) { x = step(x); l.push(bin(x, n)); } return l.join(' → '); })()}. ${back ? `The start returns after ${len} clocks${len === 2 ** n - 1 ? ', a maximal-length sequence' : ''}.` : `A state repeats after ${k} clocks without reaching the start again.`}`,
          trap: 'Assuming every feedback choice gives the maximal length $2^n - 1$.' };
      },
      verify: (p) => { const step = (s) => { let fb = 0; for (const t of p.taps) fb ^= (s >> t) & 1; return ((s << 1) & (2 ** p.n - 1)) | fb; }; let s = step(p.s0), k = 1; const seen = new Set([p.s0]); while (s !== p.s0 && !seen.has(s) && k <= 2 ** p.n) { seen.add(s); s = step(s); k++; } return k; } },
    { id: 'sl-g08', type: 'mcq', level: 3, exams: G, sub: 'state sequences',
      make(r) {
        const forms = [
          ['Q_1', 'Q_0', '\\bar Q_2', (q2, q1, q0) => [q1, q0, 1 - q2]],
          ['Q_1', 'Q_0', 'Q_2', (q2, q1, q0) => [q1, q0, q2]],
          ['Q_0', 'Q_2', 'Q_1\\oplus Q_2', (q2, q1, q0) => [q0, q2, q1 ^ q2]],
          ['Q_1\\oplus Q_0', 'Q_0', '\\bar Q_0', (q2, q1, q0) => [q1 ^ q0, q0, 1 - q0]],
          ['Q_2\\oplus(Q_1Q_0)', 'Q_1\\oplus Q_0', '\\bar Q_0', (q2, q1, q0) => [q2 ^ (q1 & q0), q1 ^ q0, 1 - q0]],
        ];
        const [d2, d1, d0, f] = choose(r, forms), s0 = int(r, 0, 7), k = int(r, 1, 6);
        let s = s0; const path = [bin(s, 3)];
        for (let i = 0; i < k; i++) { const [a, b, c] = f((s >> 2) & 1, (s >> 1) & 1, s & 1); s = (a << 2) | (b << 1) | c; path.push(bin(s, 3)); }
        const wr = [0, 1, 2, 3, 4, 5, 6, 7].filter((x) => x !== s);
        const o = mcqOptions(r, bin(s, 3), shuffle(r, wr).map((x) => bin(x, 3)));
        return { q: `Three D flip-flops have $D_2 = ${d2}$, $D_1 = ${d1}$, $D_0 = ${d0}$. Starting from $Q_2Q_1Q_0 = ${bin(s0, 3)}$, the state after ${k} clock edge${k > 1 ? 's' : ''} is`, ...o,
          sol: `Apply the equations to the present state at each edge: ${path.join(' → ')}. After ${k}: ${bin(s, 3)}.`,
          trap: 'Using a value already updated in the same clock edge: all flip-flops use the old state.' };
      } },
    { id: 'sl-g09', type: 'nat', level: 2, exams: G, sub: 'shift registers',
      make(r) {
        const n = choose(r, [4, 8, 12, 16, 32]), f = choose(r, [0.5, 1, 2, 4, 5, 10, 20]), kind = choose(r, ['siso', 'sipo']);
        const val = kind === 'siso' ? n / f : (n - 1) / f;
        return { q: kind === 'siso' ? `A ${n}-bit serial-in serial-out shift register is clocked at $${f}$ MHz. A bit entering the input reaches the serial output after ______ μs (to three decimal places).` : `A ${n}-bit serial-in parallel-out register is clocked at $${f}$ MHz. From the clock edge that loads the first bit to the edge that loads the last, ______ μs pass (to three decimal places).`,
          answer: round(val, 3), tol: 0.001, unit: 'μs', n, f, kind,
          sol: kind === 'siso' ? `${n} clock periods of $1/${f}$ μs: ${round(val, 3)} μs.` : `${n} edges have ${n - 1} periods between them: $${n - 1}/${f} = ${round(val, 3)}$ μs.`,
          trap: 'Off-by-one errors between edges and periods.' };
      },
      verify: (p) => (p.kind === 'siso' ? p.n / p.f : (p.n - 1) / p.f) },
    { id: 'sl-g10', type: 'nat', level: 3, exams: G, sub: 'timing',
      make(r) {
        const cq = pick(r, 0.2, 2, 0.1), lg = pick(r, 0, 2, 0.1), th = pick(r, 0.1, 1.5, 0.1);
        const val = cq + lg - th;
        return { q: `A launching flip-flop has minimum clock-to-Q delay $${cq}$ ns, the shortest logic path is $${lg}$ ns, and the capturing flip-flop has hold time $${th}$ ns. The largest clock skew (capture clock later than launch) allowed without a hold violation is ______ ns (a negative answer means the path fails even with zero skew) (to two decimal places).`,
          answer: round(val, 2), tol: 0.005, unit: 'ns', cq, lg, th,
          sol: `Hold: $t_{cq,min} + t_{logic,min}\\ge t_h + t_{skew}$, so $t_{skew}\\le${cq} + ${lg} - ${th} = ${round(val, 2)}$ ns.${val < 0 ? ' Negative: delay must be added to the short path.' : ''}`,
          trap: 'Bringing the clock period into a hold check.' };
      },
      verify: (p) => p.cq + p.lg - p.th },
    { id: 'sl-g11', type: 'nat', level: 2, exams: G, sub: 'frequency division',
      make(r) {
        const n = int(r, 2, 10), f = choose(r, [100, 120, 200, 240, 500, 1000, 1200]), kind = choose(r, ['binary', 'ring', 'johnson']);
        const div = kind === 'binary' ? 2 ** n : kind === 'ring' ? n : 2 * n, out = f / div;
        return { q: `A ${kind === 'binary' ? 'binary ripple' : kind === 'ring' ? 'ring' : 'Johnson'} counter of ${n} flip-flops is clocked at $${f}$ kHz. The frequency at ${kind === 'binary' ? 'its most significant output' : 'any one flip-flop output'} is ______ kHz (to three decimal places).`,
          answer: round(out, 3), tol: Math.max(0.001, round(out * 0.002, 3)), unit: 'kHz', n, f, kind,
          sol: `Each output repeats once per ${kind === 'binary' ? `$2^{${n}} = ${div}$` : kind === 'ring' ? `${n}` : `$2\\times${n} = ${div}$`} clocks: $${f}/${div} = ${round(out, 3)}$ kHz.`,
          trap: 'Using the wrong number of states for the counter type.' };
      },
      verify: (p) => p.f / (p.kind === 'binary' ? 2 ** p.n : p.kind === 'ring' ? p.n : 2 * p.n) },
    ...more,
    ...r4.gens,
  ],
};
