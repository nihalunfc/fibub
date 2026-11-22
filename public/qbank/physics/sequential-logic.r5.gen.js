// Round 5 extras for sequential-logic: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'sl-r5-01', type: 'mcq', level: 1, exams: A, sub: 'ring counter',
      q: R`A ring counter is made of 6 D flip-flops in a loop ($D$ of each from $Q$ of the previous, last back to first) and is started with a single 1. The number of distinct states it cycles through is`,
      options: [R`$64$`, R`$12$`, R`$6$`, R`$5$`], answer: 2,
      sol: R`The single 1 moves one place per clock and returns after 6 clocks: $100000\to010000\to\ldots\to000001\to100000$. So there are 6 states. A Johnson counter (inverted feedback) with the same 6 flip-flops would give 12, and a binary counter 64.`,
      trap: R`12 is the Johnson (twisted-ring) count; 64 is the number of possible patterns, not the ones visited.` },
    { id: 'sl-r5-02', type: 'nat', level: 2, exams: A, sub: 'memory',
      q: R`A memory chip is organised as $32\text{K}\times16$ bits (32K words of 16 bits each, $1\text{K} = 1024$). The number of address lines it needs is ______.`,
      answer: 15, tol: 0, calc: () => Math.log2(32 * 1024),
      sol: R`Address lines pick one word: $32\text{K} = 32\times1024 = 2^5\times2^{10} = 2^{15}$ words, so 15 lines. The word width (16 bits) sets the number of data lines, not address lines.`,
      trap: R`Counting bits instead of words: $32\text{K}\times16 = 2^{19}$ bits would suggest 19 lines.` },
    { id: 'sl-r5-03', type: 'mcq', level: 3, exams: A, sub: 'memory',
      q: R`A $64\text{K}\times16$ memory is built from $8\text{K}\times8$ chips. How many chips are needed, and how many extra address lines go to the decoder that selects chip rows?`,
      options: [R`8 chips, 3 lines`, R`4 chips, 2 lines`, R`32 chips, 4 lines`, R`16 chips, 3 lines`], answer: 3,
      sol: R`Width: $16/8 = 2$ chips side by side make one 16-bit row. Depth: $64\text{K}/8\text{K} = 8$ rows. Total $2\times8 = 16$ chips. Each chip has 13 address lines ($8\text{K} = 2^{13}$); the full memory needs 16 ($64\text{K} = 2^{16}$), so the top 3 lines drive a 3-to-8 decoder that enables one row.`,
      trap: R`Forgetting to double for the width gives 8 chips.` },
    { id: 'sl-r5-04', type: 'nat', level: 1, exams: A, sub: 'mod-N counters',
      q: R`A decade (mod-10) counter is built from the smallest possible number of flip-flops. The number of flip-flop states it never uses in normal counting is ______.`,
      answer: 6, tol: 0, calc: () => 2 ** 4 - 10,
      sol: R`Ten states need $\lceil\log_210\rceil = 4$ flip-flops, which have $2^4 = 16$ states. Ten are used (0 to 9), so $16 - 10 = 6$ are unused (10 to 15). A careful design makes sure each unused state leads back into the count, so the counter cannot lock up at power-on.`,
      trap: R`Three flip-flops give only 8 states, too few for 10.` },
    { id: 'sl-r5-05', type: 'msq', level: 3, exams: G, sub: 'state machines', format: 'statements',
      q: R`A state machine has 10 states. Which statements about its state assignment are correct?`,
      options: [R`One-hot encoding uses 10 flip-flops.`, R`Binary encoding uses 4 flip-flops.`, R`If the machine mostly steps through its states in order, a Gray-code assignment makes only one flip-flop change on each of those steps.`, R`One-hot encoding always needs fewer gates and flip-flops in total than binary encoding.`], answer: [0, 1, 2],
      sol: R`One-hot gives each state its own flip-flop (10). Binary needs $\lceil\log_210\rceil = 4$. With a Gray assignment along the main sequence, neighbouring states differ in one bit, saving power and avoiding decoding glitches. One-hot often makes the next-state logic simpler and faster (each state is one bit), which suits FPGAs with plenty of flip-flops, but it uses more flip-flops, so "always fewer in total" is false.`,
      trap: R`One-hot trades flip-flops for simple logic; it is not a free win.` },
    { id: 'sl-r5-06', type: 'mcq', level: 3, exams: A, sub: 'counter design',
      q: R`A 4-bit synchronous binary counter has a parallel-load input. Its terminal-count output (high at $1111$) drives the load input, and the load value is $0110$. At each clock it either counts up or, at $1111$, loads $0110$. The counter divides the clock by`,
      options: [R`$10$`, R`$9$`, R`$6$`, R`$16$`], answer: 0,
      sol: R`The sequence is $0110, 0111, \ldots, 1111$, then back to $0110$. That is the states 6 to 15: $15 - 6 + 1 = 10$ states, so it divides by 10. A synchronous load (at the clock edge) does not create the short glitch state that an asynchronous clear does.`,
      trap: R`$15 - 6 = 9$ forgets to count both ends of the range.` },
    { id: 'sl-r5-07', type: 'nat', level: 4, exams: G, sub: 'FIFO',
      q: R`Data arrives in bursts of 120 words, one word per clock of a $100$ MHz write clock. The reader takes one word per clock of an $80$ MHz read clock, and the bursts are far enough apart for the FIFO to empty between them. The smallest FIFO depth that never overflows is ______ words.`,
      answer: 24, tol: 0, calc: () => Math.ceil(120 - 120 * 80 / 100),
      sol: R`The burst lasts $120/100\text{ MHz} = 1.2\ \mu$s. In that time the reader removes $1.2\ \mu\text{s}\times80$ MHz $= 96$ words. The rest must wait in the FIFO: $120 - 96 = 24$ words.`,
      trap: R`$96$ is the number of words read during the burst, not the number left waiting; the FIFO holds the difference.` },
    { id: 'sl-r5-08', type: 'mcq', level: 3, exams: G, sub: 'sequence detectors',
      q: R`A state machine outputs 1 when it has just seen the input pattern 101 (overlapping allowed, e.g. 10101 gives two 1s). The minimum numbers of states for a Mealy and a Moore design are`,
      options: [R`Mealy 2, Moore 3`, R`Mealy 3, Moore 4`, R`Mealy 4, Moore 4`, R`Mealy 3, Moore 3`], answer: 1,
      sol: R`Mealy: states for "nothing useful", "seen 1" and "seen 10"; on input 1 in "seen 10" it outputs 1 on the transition and goes to "seen 1" (the last 1 starts a new pattern). That is 3 states. A Moore machine's output depends only on the state, so it needs a fourth state "just seen 101" whose output is 1 (from there, 0 leads to "seen 10" because of overlap). So 3 and 4.`,
      trap: R`A Moore machine usually needs one more state than the Mealy machine, because its output must be a state.` },
    { id: 'sl-r5-09', type: 'msq', level: 5, exams: G, sub: 'frequency division', format: 'statements',
      q: R`An engineer needs clocks divided by 3 and by 4 from a master clock with $50\%$ duty cycle. Which statements are correct?`,
      options: [R`A mod-3 counter clocked only on rising edges cannot give exactly $50\%$ duty cycle.`, R`OR-ing a divide-by-3 waveform (high for one input period) with a copy delayed by half an input period (made with a falling-edge flip-flop) gives a $50\%$ duty divide-by-3 clock.`, R`Two toggle flip-flops in cascade give a divide-by-4 clock with $50\%$ duty.`, R`A Johnson counter can divide by any odd number with $50\%$ duty, using rising edges only.`], answer: [0, 1, 2],
      sol: R`With rising edges alone, the output can change only at whole periods $T$, but $50\%$ of $3T$ is $1.5T$. Using the falling edges too gives half-period steps: a pulse $T$ wide OR-ed with itself shifted by $T/2$ is $1.5T$ wide. Each toggle stage halves the frequency with a perfectly square output, so two give $50\%$ at $f/4$. A Johnson counter with $n$ flip-flops divides by $2n$, an even number, so odd ratios need extra tricks.`,
      trap: R`Johnson counters are natural for even ratios with $50\%$ duty, not odd ones.` },
    { id: 'sl-r5-10', type: 'nat', level: 5, exams: G, sub: 'clock skew',
      q: R`A register-to-register path has clock-to-Q delay $1.0$ ns (minimum) to $2.0$ ns (maximum), logic delay $0.5$ ns (minimum) to $7.0$ ns (maximum), setup time $0.5$ ns and hold time $0.3$ ns. The capturing flip-flop's clock is deliberately delayed by the largest skew that still meets hold. The highest clock frequency then possible is ______ MHz (to one decimal place).`,
      answer: 120.5, tol: 0.6, calc: () => 1e3 / (2.0 + 7.0 + 0.5 - (1.0 + 0.5 - 0.3)),
      sol: R`Hold: new data must not reach the capture flip-flop before its (late) clock edge plus hold time: $t_{cq,min} + t_{logic,min}\ge t_{hold} + t_{skew}$, so $t_{skew}\le1.0 + 0.5 - 0.3 = 1.2$ ns. Setup with a late capture clock: $T\ge t_{cq,max} + t_{logic,max} + t_{setup} - t_{skew} = 2.0 + 7.0 + 0.5 - 1.2 = 8.3$ ns. So $f_{max} = 1/8.3\text{ ns} = 120.5$ MHz.`,
      trap: R`Skew that helps setup hurts hold; ignoring the skew gives $105.3$ MHz, and adding it instead of subtracting gives $93.5$ MHz.` },
  ],
  gens: [
    { id: 'sl-r5g1', type: 'nat', level: 2, exams: A, sub: 'memory',
      make(r) {
        const ask = choose(r, ['lines', 'chips']);
        const wk = choose(r, [1, 2, 4, 8, 16, 32, 64, 128, 256]), bits = choose(r, [4, 8, 16, 32]);
        const ck = choose(r, [1, 2, 4, 8].filter((x) => x <= wk)), cb = choose(r, [1, 4, 8].filter((x) => x <= bits));
        const lines = Math.log2(wk * 1024), chips = (wk / ck) * (bits / cb);
        return { q: ask === 'lines'
            ? R`A memory is organised as $${wk}\text{K}\times${bits}$ bits ($1\text{K} = 1024$). The number of address lines it needs is ______.`
            : R`A $${wk}\text{K}\times${bits}$ memory is built from $${ck}\text{K}\times${cb}$ chips. The number of chips needed is ______.`,
          answer: ask === 'lines' ? lines : chips, tol: 0, ask, wk, bits, ck, cb,
          sol: ask === 'lines'
            ? R`$${wk}\text{K} = ${wk}\times2^{10} = 2^{${lines}}$ words, so ${lines} address lines. The word width sets the data lines.`
            : R`Depth: $${wk}\text{K}/${ck}\text{K} = ${wk / ck}$ rows. Width: $${bits}/${cb} = ${bits / cb}$ chips per row. Total $${wk / ck}\times${bits / cb} = ${chips}$.`,
          trap: ask === 'lines' ? 'Address lines count words, not bits.' : 'Count both the rows (depth) and the chips side by side (width).' };
      },
      verify: (p) => (p.ask === 'lines' ? Math.log2(p.wk * 1024) : (p.wk / p.ck) * (p.bits / p.cb)) },
    { id: 'sl-r5g2', type: 'nat', level: 4, exams: G, sub: 'FIFO',
      make(r) {
        const B = choose(r, [32, 50, 64, 80, 100, 128, 200, 256]), fw = choose(r, [50, 100, 125, 150, 200]), fr = round(fw * choose(r, [0.4, 0.5, 0.6, 0.75, 0.8]), 2);
        const depth = Math.ceil(B - B * fr / fw - 1e-9);
        return { q: R`Bursts of ${B} words arrive at one word per clock of a $${fw}$ MHz write clock; the reader takes one word per clock of a $${fr}$ MHz read clock. Bursts are spaced far enough apart for the FIFO to empty between them. The smallest FIFO depth that never overflows is ______ words.`,
          answer: depth, tol: 0, B, fw, fr,
          sol: R`The burst lasts $${B}/${fw}$ MHz $= ${round(B / fw, 4)}\ \mu$s; in that time the reader removes $${round(B / fw, 4)}\times${fr} = ${round(B * fr / fw, 2)}$ words. The FIFO must hold the rest: $${B} - ${round(B * fr / fw, 2)}$, rounded up, $= ${depth}$ words.`,
          trap: 'Only the time of the burst matters; the reader keeps working during it.' };
      },
      verify: (p) => Math.ceil(p.B - p.B * p.fr / p.fw - 1e-9) },
    { id: 'sl-r5g3', type: 'mcq', level: 3, exams: A, sub: 'counter design',
      make(r) {
        const n = choose(r, [3, 4, 5]), L = int(r, 1, 2 ** n - 3), mod = 2 ** n - L;
        const lb = L.toString(2).padStart(n, '0');
        const o = mcqOptions(r, mod, [mod - 1, L, 2 ** n, mod + 1], (v) => `$${v}$`);
        return { q: R`A ${n}-bit synchronous binary counter loads $${lb}$ (synchronously) whenever it reaches all ones, and otherwise counts up. It divides the clock by`, ...o,
          sol: R`It runs through $${L}, ${L + 1}, \ldots, ${2 ** n - 1}$ and then reloads ${L}: that is $${2 ** n - 1} - ${L} + 1 = ${mod}$ states, so it divides by ${mod}.`,
          trap: 'Count both ends of the range of states.' };
      } },
  ],
};
