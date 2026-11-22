// Round 4 extras for digital-logic: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const b4 = (n) => n.toString(2).padStart(4, '0');

export default {
  items: [
    { id: 'dlg-r4-01', type: 'mcq', level: 1, exams: A, sub: 'number systems',
      q: R`The smallest number of bits that can represent every whole number from $0$ to $100$ in plain binary is`,
      options: [R`$6$`, R`$7$`, R`$8$`, R`$10$`],
      answer: 1,
      sol: R`$n$ bits cover $0$ to $2^n - 1$. $2^6 - 1 = 63$ is too small; $2^7 - 1 = 127\ge100$. So $7$ bits ($100 = 1100100_2$).`,
      trap: R`Choosing 8 because data usually comes in whole bytes: 7 bits already reach 127.` },
    { id: 'dlg-r4-02', type: 'nat', level: 2, exams: A, sub: 'memory',
      q: R`A memory chip stores $4$ KB, organised as one byte per address ($1$ KB $= 1024$ bytes). The number of address lines it needs is ______.`,
      answer: 12, tol: 0, calc: () => Math.log2(4 * 1024),
      sol: R`$4$ KB $= 4\times1024 = 4096 = 2^{12}$ addresses, and $n$ address lines select $2^n$ locations. So $12$ lines. The $8$ data lines carry the byte itself and are not part of the count.`,
      trap: R`Counting bits ($4096\times8 = 2^{15}$, giving 15) instead of addressable words.` },
    { id: 'dlg-r4-03', type: 'mcq', level: 2, exams: A, sub: 'codes',
      q: R`In excess-3 code, the decimal digit $5$ is written as`,
      options: [R`$0101$`, R`$0010$`, R`$0111$`, R`$1000$`],
      answer: 3,
      sol: R`Excess-3 adds $3$ to each decimal digit and writes the result in 4-bit binary: $5 + 3 = 8 = 1000$. The code is self-complementing: the 9's complement of a digit is obtained by inverting its bits ($4\to0111$, $5\to1000$).`,
      trap: R`$0101$ is plain BCD; $0010$ subtracts 3 instead of adding.` },
    { id: 'dlg-r4-04', type: 'nat', level: 3, exams: A, sub: 'counters', unit: 'MHz',
      q: R`A synchronous counter uses flip-flops with clock-to-output delay $10$ ns and setup time $5$ ns; the logic that forms each flip-flop's next input adds at most $5$ ns. The highest clock frequency at which it works reliably is ______ MHz.`,
      answer: 50, tol: 0, calc: () => 1e3 / (10 + 5 + 5),
      sol: R`In one clock period the outputs must change ($10$ ns), ripple through the next-state logic ($5$ ns) and be stable at the next flip-flop inputs for the setup time ($5$ ns). $T_{\min} = 20$ ns, so $f_{\max} = 1/20\ \text{ns} = 50$ MHz. Unlike a ripple counter, this does not grow with the number of bits (as long as the logic delay does not).`,
      trap: R`Leaving out the setup time ($66.7$ MHz) or multiplying by the number of flip-flops as in a ripple counter.` },
    { id: 'dlg-r4-05', type: 'msq', level: 3, exams: A, sub: 'sequential logic', format: 'statements',
      q: R`Which statements are correct?`,
      options: [R`A shift register is a sequential circuit.`, R`A multiplexer needs a clock to choose which input to pass.`, R`A latch is level-sensitive, while an edge-triggered flip-flop responds only at a clock edge.`, R`A ROM used as a look-up table is a combinational circuit: its output depends only on the present address.`],
      answer: [0, 2, 3],
      sol: R`A circuit is sequential if its output depends on past inputs (it has memory). A ROM read is a fixed function of the address: combinational. A shift register stores bits in flip-flops: sequential. A multiplexer is pure gating, with select lines and no clock. A latch is transparent while its enable is active; a flip-flop samples only at an edge.`,
      trap: R`A ROM "stores" data, but reading it involves no state that changes with time, so it counts as combinational.` },
    { id: 'dlg-r4-06', type: 'mcq', level: 3, exams: A, sub: 'adders',
      q: R`A 16-bit ripple-carry adder is built from full adders, each taking $2$ ns from carry-in to carry-out. The worst-case time for the carry to settle is about`,
      options: [R`$32$ ns`, R`$2$ ns`, R`$8$ ns`, R`$64$ ns`],
      answer: 0,
      sol: R`In the worst case (e.g. adding $1$ to $0111\ldots1$) a carry made in the lowest stage must pass through all 16 stages in turn: $16\times2 = 32$ ns. Carry-lookahead adders compute the carries in parallel, so their delay grows only as $\log n$; $8$ ns is the kind of figure such a design would give.`,
      trap: R`Assuming all full adders work at once (2 ns): each one has to wait for the carry from below.` },
    { id: 'dlg-r4-07', type: 'nat', level: 4, exams: A, sub: 'shift registers',
      q: R`A linear-feedback shift register made of $5$ flip-flops, with XOR feedback chosen for the longest possible sequence, steps through ______ different states before repeating.`,
      answer: 31, tol: 0, calc: () => 2 ** 5 - 1,
      sol: R`Five bits have $2^5 = 32$ states. With XOR feedback the all-zeros state maps to itself, so it can never be part of the main cycle. A maximal-length (primitive-polynomial) LFSR visits all the others: $2^5 - 1 = 31$ states. Such registers make pseudo-random bit sequences and CRC checks.`,
      trap: R`Answering 32: the all-zero state is a lock-up state, not part of the cycle.` },
    { id: 'dlg-r4-08', type: 'mcq', level: 4, exams: A, sub: 'hazards',
      q: R`The circuit $Y = AB + \bar AC$, built as two AND gates into an OR gate, can glitch (a brief $0$) when $B = C = 1$ and $A$ changes. The extra product term that removes this static hazard is`,
      options: [R`$AC$`, R`$\bar AB$`, R`$BC$`, R`$AB\bar C$`],
      answer: 2,
      sol: R`With $B = C = 1$, $Y = A + \bar A = 1$, but as $A$ changes one AND gate turns off before the other turns on (the inverter adds delay), so $Y$ can dip. The consensus term $BC$ equals 1 throughout that change and holds the output high. Logically $AB + \bar AC + BC = AB + \bar AC$ (consensus theorem), so the function is unchanged; only the timing improves.`,
      trap: R`Minimising the expression removes exactly the redundant term that prevents the glitch.` },
    { id: 'dlg-r4-09', type: 'msq', level: 4, exams: A, sub: 'boolean algebra', format: 'statements',
      q: R`Which of these sets of operations are functionally complete (able to build every Boolean function)?`,
      options: [R`$\{\text{NAND}\}$`, R`$\{\text{AND}, \text{OR}\}$`, R`$\{\text{AND}, \text{NOT}\}$`, R`$\{\text{XOR}, \text{AND}, \text{the constant }1\}$`],
      answer: [0, 2, 3],
      sol: R`NAND alone gives NOT ($\overline{AA}$) and AND (NAND then NOT), and hence OR by De Morgan. AND with NOT gives OR as $\overline{\bar A\bar B}$. XOR with the constant 1 gives NOT ($A\oplus1 = \bar A$), and with AND that is complete. AND and OR alone can only build functions that never fall when an input rises (monotone functions); they can never make NOT.`,
      trap: R`Thinking AND and OR are enough because sums of products use them: the complements of the variables are needed as well.` },
    { id: 'dlg-r4-10', type: 'nat', level: 5, exams: A, sub: 'boolean algebra',
      q: R`A Boolean function of $A$, $B$, $C$ is called symmetric if swapping any two inputs never changes it (so it depends only on how many inputs are 1). The number of different symmetric functions of three variables is ______.`,
      answer: 16, tol: 0, calc: () => 2 ** (3 + 1),
      sol: R`A symmetric function is fixed by its value for each possible count of 1s: $0, 1, 2$ or $3$. That is $4$ independent choices of 0 or 1, giving $2^4 = 16$ functions (among them the constants, AND, OR, majority and XOR of all three). In general there are $2^{n+1}$ symmetric functions of $n$ variables, against $2^{2^n} = 256$ functions of three variables in all.`,
      trap: R`Counting $2^{2^3} = 256$ (all functions) or $2^3 = 8$ (input rows).` },
  ],
  gens: [
    { id: 'dlg-r4g1', type: 'nat', level: 2, exams: A, sub: 'memory',
      make(r) {
        const [cap, unit, bytes] = choose(r, [[1, 'KB', 2 ** 10], [2, 'KB', 2 ** 11], [8, 'KB', 2 ** 13], [16, 'KB', 2 ** 14], [64, 'KB', 2 ** 16], [256, 'KB', 2 ** 18], [1, 'MB', 2 ** 20], [4, 'MB', 2 ** 22]]);
        const w = choose(r, [8, 16, 32]);
        const n = Math.log2(bytes * 8 / w);
        return { q: R`A memory holds $${cap}$ ${unit} ($1$ KB $= 1024$ bytes, $1$ MB $= 1024$ KB), organised as ${w}-bit words, one word per address. The number of address lines needed is ______.`,
          answer: n, tol: 0, cap, w, bytes,
          sol: R`Number of words $= \dfrac{${cap}\ \text{${unit}}\times8\ \text{bits}}{${w}\ \text{bits}} = \dfrac{2^{${Math.log2(bytes)}}\times8}{${w}} = 2^{${n}}$, so $${n}$ address lines.`,
          trap: 'Count addressable words, not bits or bytes, when the word is wider than a byte.' };
      },
      verify: (p) => Math.log2(p.bytes * 8 / p.w) },
    { id: 'dlg-r4g2', type: 'nat', level: 3, exams: A, sub: 'counters',
      make(r) {
        const tp = choose(r, [3, 5, 8, 10, 12, 15]), tg = choose(r, [2, 4, 5, 6, 10]), ts = choose(r, [1, 2, 3, 5]);
        const f = 1e3 / (tp + tg + ts);
        return { q: R`A synchronous counter has flip-flops with clock-to-output delay $${tp}$ ns and setup time $${ts}$ ns, and next-state logic with a worst-case delay of $${tg}$ ns. Its maximum clock frequency is ______ MHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.005, 1)), unit: 'MHz', tp, tg, ts,
          sol: R`$T_{\min} = t_{\rm clk\to Q} + t_{\rm logic} + t_{\rm setup} = ${tp} + ${tg} + ${ts} = ${tp + tg + ts}$ ns, so $f_{\max} = 1000/${tp + tg + ts} = ${round(f, 1)}$ MHz.`,
          trap: 'All three delays sit in series inside one clock period.' };
      },
      verify: (p) => 1e3 / (p.tp + p.tg + p.ts) },
    { id: 'dlg-r4g3', type: 'mcq', level: 2, exams: A, sub: 'codes',
      make(r) {
        const n = int(r, 10, 96), t = Math.floor(n / 10), u = n % 10;
        const x3 = `${b4(t + 3)}\\ ${b4(u + 3)}`;
        const bcd = `${b4(t)}\\ ${b4(u)}`;
        const bin = n.toString(2).padStart(8, '0'), binx = `${bin.slice(0, 4)}\\ ${bin.slice(4)}`;
        const swap = `${b4(u + 3)}\\ ${b4(t + 3)}`;
        const plus3 = (n + 3).toString(2).padStart(8, '0'), p3 = `${plus3.slice(0, 4)}\\ ${plus3.slice(4)}`;
        const minus = `${b4(Math.abs(t - 3))}\\ ${b4(Math.abs(u - 3))}`;
        const o = mcqOptions(r, x3, [bcd, p3, binx, swap, minus], (v) => `$${v}$`);
        return { q: R`The decimal number $${n}$ written in excess-3 code (one 4-bit group per decimal digit) is`, ...o,
          sol: R`Add $3$ to each decimal digit separately: $${t} + 3 = ${t + 3}$ and $${u} + 3 = ${u + 3}$, giving $${x3}$. (Adding 3 to the whole number gives $${p3}$, and plain BCD is $${bcd}$.)`,
          trap: 'Excess-3 adds 3 to each digit, not to the whole number.' };
      } },
  ],
};
