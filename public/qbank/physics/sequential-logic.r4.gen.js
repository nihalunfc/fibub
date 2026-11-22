// Round 4 extras for sequential-logic: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

// Smallest shift-register length k for which the last k bits of the repeating sequence fix the next bit.
const minWindow = (s) => {
  const L = s.length;
  for (let k = 1; k <= L; k++) {
    const seen = new Map(); let ok = true;
    for (let i = 0; i < L; i++) {
      let w = ''; for (let j = 0; j < k; j++) w += s[(i + j) % L];
      const nx = s[(i + k) % L];
      if (seen.has(w) && seen.get(w) !== nx) { ok = false; break; }
      seen.set(w, nx);
    }
    if (ok) return k;
  }
  return L;
};

export default {
  items: [
    { id: 'sl-r4-01', type: 'mcq', level: 1, exams: A, sub: 'state machines',
      q: R`A state machine has 10 states. With one-hot encoding (exactly one flip-flop set per state), it needs`,
      options: [R`$4$ flip-flops`, R`$10$ flip-flops`, R`$5$ flip-flops`, R`$1024$ flip-flops`], answer: 1,
      sol: R`One-hot gives each state its own flip-flop, so 10 states need 10 flip-flops. Binary encoding would need only $\lceil\log_210\rceil = 4$, but one-hot makes the next-state and output logic simpler and faster, which is why it is common in FPGAs.`,
      trap: R`4 is the binary-encoded count; the question fixes the encoding.` },
    { id: 'sl-r4-02', type: 'mcq', level: 2, exams: A, sub: 'counters',
      q: R`A ring counter of 6 flip-flops holds a single 1 that circulates, clocked at $12$ MHz. The waveform at any one flip-flop output has`,
      options: [R`frequency $2$ MHz and duty cycle $1/6$`, R`frequency $2$ MHz and duty cycle $50\%$`, R`frequency $1$ MHz and duty cycle $50\%$`, R`frequency $12$ MHz and duty cycle $1/6$`], answer: 0,
      sol: R`The single 1 returns to the same flip-flop every 6 clocks, so each output repeats at $12/6 = 2$ MHz. It is high for 1 clock out of 6: duty cycle $1/6$. (A Johnson counter of the same length would give 50% duty at $1$ MHz.)`,
      trap: R`A 50% duty cycle belongs to the Johnson (twisted-ring) counter.` },
    { id: 'sl-r4-03', type: 'nat', level: 2, exams: G, sub: 'shift registers',
      q: R`A serial link (UART) sends each byte as 1 start bit, 8 data bits, no parity and 1 stop bit, at $9600$ baud (bits per second), with no gaps between frames. Sending one byte takes ______ ms (to two decimal places).`,
      answer: 1.04, tol: 0.01, calc: () => 10 / 9600 * 1000,
      sol: R`Each frame is $1 + 8 + 1 = 10$ bits. At $9600$ bit/s that takes $10/9600 = 1.042$ ms, so the link carries at most $960$ bytes per second. The shift register in the receiver is clocked from a local clock that samples the middle of each bit.`,
      trap: R`Counting only the 8 data bits gives $0.83$ ms; start and stop bits also take line time.` },
    { id: 'sl-r4-04', type: 'nat', level: 3, exams: A, sub: 'counters',
      q: R`A seconds counter showing 00 to 59 in BCD is built as a decade counter (units digit) whose carry clocks a mod-6 counter (tens digit), each with the fewest flip-flops possible. The total number of flip-flops is ______.`,
      answer: 7, tol: 0, calc: () => Math.ceil(Math.log2(10)) + Math.ceil(Math.log2(6)),
      sol: R`A decade counter needs $\lceil\log_210\rceil = 4$ flip-flops and a mod-6 counter $\lceil\log_26\rceil = 3$: $7$ in all. A single binary mod-60 counter would need only $\lceil\log_260\rceil = 6$, but its output would not be BCD and would need conversion before driving a display.`,
      trap: R`$\lceil\log_260\rceil = 6$ is right for a binary counter, not for two separate BCD digits.` },
    { id: 'sl-r4-05', type: 'mcq', level: 3, exams: G, sub: 'clock domains',
      q: R`In an asynchronous FIFO, the read and write pointers are passed between two unrelated clock domains as Gray-code counts rather than binary counts. The reason is that`,
      options: [R`Gray counters count twice as fast`, R`Gray counters need fewer flip-flops`, R`Gray code removes the need for synchroniser flip-flops`, R`only one bit changes per count, so a value sampled during a change is off by at most one count`], answer: 3,
      sol: R`A binary count such as 0111 to 1000 changes four bits at once; sampled mid-change by the other clock, the bits may be caught in any mix (for example 1111), a wildly wrong pointer. In Gray code exactly one bit changes per step, so a sample is either the old or the new value. Synchronisers are still needed against metastability; Gray coding stops the multi-bit mix-up.`,
      trap: R`Gray coding does not cure metastability; it makes the multi-bit sample safe once each bit has settled.` },
    { id: 'sl-r4-06', type: 'mcq', level: 3, exams: G, sub: 'state machines',
      q: R`A signal $x$, already synchronised to the clock, is stored each clock in a D flip-flop whose output $q$ is therefore $x$ delayed by one clock. Which signal is 1 for exactly one clock period after each rising edge of $x$?`,
      options: [R`$\bar xq$`, R`$xq$`, R`$x\bar q$`, R`$x\oplus q$`], answer: 2,
      sol: R`Right after $x$ rises, $x = 1$ but $q$ still holds the old value 0; one clock later $q = 1$ too. So $x\bar q$ is 1 for one clock. $\bar xq$ marks falling edges, and $x\oplus q$ marks both edges.`,
      trap: R`$x\oplus q$ also pulses on falling edges.` },
    { id: 'sl-r4-07', type: 'msq', level: 3, exams: G, sub: 'flip-flops', format: 'statements',
      q: R`Which statements about the asynchronous preset and clear inputs of a flip-flop are correct?`,
      options: [R`An asynchronous clear acts at once, without waiting for a clock edge.`, R`Releasing an asynchronous reset too close to a clock edge can leave a flip-flop metastable (a recovery or removal time violation).`, R`Asserting preset and clear together puts many flip-flops in an indeterminate, forbidden state.`, R`A synchronous reset takes effect even when the clock is stopped.`], answer: [0, 1, 2],
      sol: R`Asynchronous inputs bypass the clocked path and force the output directly. Their release, however, is a timing event: like data, it must be stable for a recovery time before the edge and a removal time after it. Preset and clear together fight each other (in a NAND latch both outputs go high), so data sheets forbid it. A synchronous reset is just data steered into $D$, so it needs a clock edge.`,
      trap: R`"Asynchronous" describes when the reset is applied, not when it may safely be released.` },
    { id: 'sl-r4-08', type: 'msq', level: 4, exams: G, sub: 'counter design', format: 'multi',
      q: R`A 3-bit synchronous binary down-counter (counting 7, 6, ..., 0, 7, ...) is built from T flip-flops. Which toggle inputs are correct?`,
      options: [R`$T_1 = \bar Q_0$`, R`$T_2 = \bar Q_1\bar Q_0$`, R`$T_2 = Q_1Q_0$`, R`$T_0 = 1$`], answer: [0, 1, 3],
      sol: R`Counting down, bit 0 toggles every clock ($T_0 = 1$). A higher bit toggles when every lower bit is 0, because subtracting 1 then borrows through them (for example 100 to 011). So $T_1 = \bar Q_0$ and $T_2 = \bar Q_1\bar Q_0$. $T_2 = Q_1Q_0$ is the up-counter rule.`,
      trap: R`Up-counters toggle on all lower ones (carry), down-counters on all lower zeros (borrow).` },
    { id: 'sl-r4-09', type: 'mcq', level: 4, exams: G, sub: 'sequence generators',
      q: R`A shift register with combinational feedback (the new bit is a function of the bits held) must output the sequence $1101$ repeated forever. The fewest flip-flops that can do it is`,
      options: [R`$2$`, R`$3$`, R`$4$`, R`$5$`], answer: 1,
      sol: R`The bits held must decide the next bit. With 2 bits, the window 11 is followed by 0 in one place ($1\,1\,0$) and by 1 in another ($\ldots1\,1\,1\ldots$ across the repeat), so 2 is not enough. With 3 bits the windows in one period are 110, 101, 011, 111, all different, each with its own next bit. So 3 flip-flops suffice.`,
      trap: R`$\lceil\log_2 4\rceil = 2$ counts states of a counter, but a shift register's state is the recent output itself.` },
    { id: 'sl-r4-10', type: 'nat', level: 4, exams: G, sub: 'timing',
      q: R`A block of combinational logic has $20$ ns of delay between two registers; each register adds $1$ ns ($t_{cq} + t_{su}$). It is split into $4$ pipeline stages of equal delay with a register after each. The throughput (results per second) rises by a factor of ______ (to two decimal places).`,
      answer: 3.5, tol: 0.01, calc: () => (20 + 1) / (20 / 4 + 1),
      sol: R`Unpipelined: clock period $20 + 1 = 21$ ns. Pipelined: $5 + 1 = 6$ ns per stage. Throughput ratio $21/6 = 3.50$. The register overhead stops it from reaching 4; the latency actually grows to $4\times6 = 24$ ns.`,
      trap: R`Expecting a factor of exactly 4 ignores the overhead paid in every stage.` },
    { id: 'sl-r4-11', type: 'mcq', level: 5, exams: G, sub: 'timing',
      q: R`A designer gates a clock with a plain AND gate, $CLK\cdot EN$, where $EN$ comes from logic clocked on the rising edge of $CLK$. The main danger, and the standard fix, are`,
      options: [R`$EN$ can change while $CLK$ is high and give a glitch or a clipped clock pulse; pass $EN$ through a latch that is transparent while $CLK$ is low`, R`the AND gate delays the clock; use a faster gate`, R`$EN$ may arrive too late; lower the clock frequency`, R`the AND gate wastes power; replace it with an OR gate`], answer: 0,
      sol: R`$EN$ changes shortly after each rising edge, that is while $CLK$ is high, so the AND output can be cut short or pulse briefly: a spurious clock edge for everything downstream. A latch that is transparent only while $CLK$ is low lets $EN$ through during the low phase and holds it steady during the high phase, so the gated clock has only whole pulses. This latch-plus-AND cell is the standard integrated clock gate.`,
      trap: R`Slowing the clock does not help: the glitch comes from $EN$ changing during the high phase, at any frequency.` },
    { id: 'sl-r4-12', type: 'nat', level: 5, exams: G, sub: 'timing',
      q: R`An 8-bit synchronous binary counter uses T flip-flops ($t_{cq} = 3$ ns, $t_{su} = 2$ ns). Its toggle inputs come from a chain of 2-input AND gates, each with $2$ ns delay: $T_0 = 1$, $T_1 = Q_0$, $T_k = T_{k-1}Q_{k-1}$ for $k\ge2$. Its maximum clock frequency is ______ MHz (to two decimal places).`,
      answer: 58.82, tol: 0.05, calc: () => 1e3 / (3 + 6 * 2 + 2),
      sol: R`$T_2$ needs one AND gate, $T_3$ two in series, and so on: $T_7$ waits for $6$ gates. Slowest path: $t_{cq} + 6\times2 + t_{su} = 3 + 12 + 2 = 17$ ns, so $f_{max} = 1/17\text{ ns} = 58.82$ MHz. Wide AND gates (parallel carry) would cut it to $3 + 2 + 2 = 7$ ns.`,
      trap: R`Counting 7 or 8 gates in the chain: $T_1 = Q_0$ needs no gate.` },
  ],
  gens: [
    { id: 'sl-r4g1', type: 'nat', level: 2, exams: G, sub: 'shift registers',
      make(r) {
        const baud = choose(r, [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]), data = choose(r, [7, 8]), par = choose(r, [0, 1]), stop = choose(r, [1, 2]), ask = choose(r, ['time', 'rate']);
        const bits = 1 + data + par + stop, val = ask === 'time' ? bits / baud * 1e6 : baud / bits;
        return { q: `A UART sends frames of 1 start bit, ${data} data bits, ${par ? 'a parity bit' : 'no parity bit'} and ${stop} stop bit${stop > 1 ? 's' : ''} at $${baud}$ baud, back to back. ${ask === 'time' ? 'One frame takes ______ $\\mu$s' : 'The most characters it can send per second is ______'} (to two decimal places).`,
          answer: round(val, 2), tol: 0.01, bits, baud, ask,
          sol: `Frame length $= 1 + ${data} + ${par} + ${stop} = ${bits}$ bits. ${ask === 'time' ? `Time $= ${bits}/${baud}$ s $= ${round(val, 2)}\\ \\mu$s.` : `Rate $= ${baud}/${bits} = ${round(val, 2)}$ characters per second.`}`,
          trap: 'Forgetting the start and stop bits, which take line time but carry no data.' };
      },
      verify: (p) => (p.ask === 'time' ? p.bits / p.baud * 1e6 : p.baud / p.bits) },
    { id: 'sl-r4g2', type: 'nat', level: 3, exams: G, sub: 'timing',
      make(r) {
        const L = pick(r, 10, 60, 2), k = choose(r, [2, 3, 4, 5, 6]), o = pick(r, 0.5, 3, 0.5), ask = choose(r, ['f', 'speedup', 'latency']);
        const stage = L / k + o, val = ask === 'f' ? 1e3 / stage : ask === 'speedup' ? (L + o) / stage : k * stage;
        return { q: `Logic with a total delay of $${L}$ ns is cut into ${k} pipeline stages of equal delay; every stage ends in a register adding $${o}$ ns ($t_{cq} + t_{su}$). ${ask === 'f' ? 'The highest clock frequency is ______ MHz' : ask === 'speedup' ? 'Compared with one register stage holding all the logic, the throughput rises by a factor of ______' : 'The latency, from input to result, is ______ ns'} (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, round(val * 0.002, 2)), L, k, o, ask,
          sol: `Stage period $= ${L}/${k} + ${o} = ${round(stage, 4)}$ ns. ${ask === 'f' ? `$f_{max} = 1/${round(stage, 4)}\\text{ ns} = ${round(val, 2)}$ MHz.` : ask === 'speedup' ? `Unpipelined period $= ${L} + ${o} = ${round(L + o, 2)}$ ns, so the factor is $${round(L + o, 2)}/${round(stage, 4)} = ${round(val, 2)}$.` : `Latency $= ${k}\\times${round(stage, 4)} = ${round(val, 2)}$ ns, longer than the unpipelined $${round(L + o, 2)}$ ns.`}`,
          trap: 'Pipelining raises throughput but never shortens latency; the register overhead is paid in every stage.' };
      },
      verify: (p) => { const s = p.L / p.k + p.o; return p.ask === 'f' ? 1e3 / s : p.ask === 'speedup' ? (p.L + p.o) / s : p.k * s; } },
    { id: 'sl-r4g3', type: 'mcq', level: 4, exams: G, sub: 'sequence generators',
      make(r) {
        const L = int(r, 4, 8);
        let s = Array.from({ length: L }, () => int(r, 0, 1));
        if (s.every((b) => b === s[0])) s[int(r, 0, L - 1)] ^= 1;
        const k = minWindow(s), seq = s.join('');
        const o = mcqOptions(r, k, [k + 1, k > 1 ? k - 1 : k + 2, Math.max(1, Math.ceil(Math.log2(L))) === k ? k + 3 : Math.max(1, Math.ceil(Math.log2(L))), L === k ? k + 4 : L], (v) => `$${v}$`);
        return { q: `A shift register with combinational feedback must output the bit sequence $${seq}$ repeated forever. The fewest flip-flops that can do it is`, ...o,
          sol: `The bits held (the last $k$ outputs) must decide the next bit. Slide a window of length $k$ round the repeating sequence: for $k = ${k}$ every window that appears is always followed by the same bit${k > 1 ? `, while for $k = ${k - 1}$ some window is followed by 0 in one place and by 1 in another` : ''}. So ${k} flip-flop${k > 1 ? 's are' : ' is'} needed.`,
          trap: 'Using $\\lceil\\log_2 L\\rceil$ for a period of $L$ counts counter states; a shift register stores recent outputs, which may repeat within one period.' };
      } },
  ],
};
