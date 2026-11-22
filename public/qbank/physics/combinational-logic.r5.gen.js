// Round 5 extras for combinational-logic: original questions, written 2026-11-22.
import { int, choose, mcqOptions } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const pop = (x) => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };

export default {
  items: [
    { id: 'cl-r5-01', type: 'mcq', level: 1, exams: A, sub: 'Boolean algebra',
      q: R`The complement of $F = A + \bar BC$ is`,
      options: [R`$\bar A + B\bar C$`, R`$\bar A(B + \bar C)$`, R`$\bar AB\bar C$`, R`$A(\bar B + C)$`], answer: 1,
      sol: R`De Morgan: $\overline{A + \bar BC} = \bar A\cdot\overline{\bar BC} = \bar A(B + \bar C)$. Each OR becomes AND, each AND becomes OR, and every literal is complemented, keeping the grouping.`,
      trap: R`Complementing each literal but leaving AND and OR in place gives $\bar A + B\bar C$, which is wrong: De Morgan swaps the operators too.` },
    { id: 'cl-r5-02', type: 'nat', level: 2, exams: A, sub: 'number representation',
      q: R`The 8-bit pattern $11010110$ is read as a two's complement signed integer. Its decimal value is ______.`,
      answer: -42, tol: 0, calc: () => (0xD6 << 24) >> 24,
      sol: R`The top bit is 1, so the number is negative. Unsigned it is $214$; subtracting $2^8 = 256$ gives $214 - 256 = -42$. Check by negating: invert to $00101001$ and add 1 to get $00101010 = 42$.`,
      trap: R`Reading it as sign-magnitude gives $-86$; reading it as one's complement gives $-41$.` },
    { id: 'cl-r5-03', type: 'mcq', level: 2, exams: A, sub: 'number systems',
      q: R`The hexadecimal number $2\text{F}7_{16}$ written in octal is`,
      options: [R`$759_8$`, R`$1767_8$`, R`$2367_8$`, R`$1367_8$`], answer: 3,
      sol: R`Write each hex digit as 4 bits: $2 = 0010$, F $= 1111$, $7 = 0111$, giving $001011110111$. Regroup in threes from the right: $001\ 011\ 110\ 111 = 1\ 3\ 6\ 7$. So $2\text{F}7_{16} = 1367_8$ (both equal $759$ in decimal).`,
      trap: R`$759$ is the decimal value, not an octal numeral; grouping in threes from the left gives wrong digits.` },
    { id: 'cl-r5-04', type: 'nat', level: 3, exams: A, sub: 'canonical forms',
      q: R`The function $F(A,B,C,D) = AB + CD + A\bar C\bar D$ is written as a sum of minterms. The number of minterms is ______.`,
      answer: 8, tol: 0,
      sol: R`$AB$ covers the 4 minterms $1100, 1101, 1110, 1111$ (12 to 15). $CD$ covers $0011, 0111, 1011, 1111$ (3, 7, 11, 15); 15 is already counted, so 3 new. $A\bar C\bar D$ covers $1000$ and $1100$ (8 and 12); 12 is already counted, so 1 new. Total $4 + 3 + 1 = 8$: $F = \sum m(3, 7, 8, 11, 12, 13, 14, 15)$.`,
      trap: R`Adding term sizes ($4 + 4 + 2 = 10$) counts the shared minterms twice.` },
    { id: 'cl-r5-05', type: 'msq', level: 3, exams: A, sub: 'XOR',
      q: R`Which expressions equal the XNOR (equivalence) $\overline{A\oplus B}$?`,
      options: [R`$AB + \bar A\bar B$`, R`$(\bar A + B)(A + \bar B)$`, R`$A\oplus\bar B$`, R`$\bar A\oplus\bar B$`], answer: [0, 1, 2],
      sol: R`XNOR is 1 when $A = B$: $AB + \bar A\bar B$. Multiplying out the second: $(\bar A + B)(A + \bar B) = \bar A\bar B + AB$, the same. Complementing one input of an XOR complements its output, so $A\oplus\bar B = \overline{A\oplus B}$. Complementing both inputs undoes itself: $\bar A\oplus\bar B = A\oplus B$, the XOR, not the XNOR.`,
      trap: R`Complementing both XOR inputs changes nothing.` },
    { id: 'cl-r5-06', type: 'nat', level: 4, exams: G, sub: 'codes',
      q: R`A 4-bit binary counter steps from $0000$ up to $1111$ (15 steps). The total number of individual bit changes over those 15 steps is ______. (A Gray-code counter would need exactly 15.)`,
      answer: 26, tol: 0, calc: () => 2 * 15 - pop(15),
      sol: R`Bit 0 changes every step: 15 times. Bit 1 changes every 2 steps: 7 times. Bit 2 every 4: 3 times. Bit 3 once (at $0111\to1000$). Total $15 + 7 + 3 + 1 = 26$. In general counting from 0 to $M$ costs $2M - (\text{number of 1s in }M)$ changes, which is why Gray code is used where switching or simultaneous changes matter.`,
      trap: R`$4\times15 = 60$ assumes every bit changes at every step.` },
    { id: 'cl-r5-07', type: 'mcq', level: 4, exams: A, sub: 'multiplexers',
      q: R`An 8:1 multiplexer has select lines $A, B, C$ ($A$ most significant) and data inputs $D_0\ldots D_7 = 0, 1, 1, 0, 1, 0, 0, 1$. Its output is`,
      options: [R`$A\oplus B\oplus C$`, R`$\overline{A\oplus B\oplus C}$`, R`$AB + BC + CA$`, R`$A + B + C$`], answer: 0,
      sol: R`The output is 1 for select values 1, 2, 4, 7, i.e. $001, 010, 100, 111$: exactly the inputs with an odd number of 1s. That is the 3-input XOR (odd parity) $A\oplus B\oplus C$.`,
      trap: R`$AB + BC + CA$ (majority) is 1 for 3, 5, 6, 7, not 1, 2, 4, 7.` },
    { id: 'cl-r5-08', type: 'msq', level: 4, exams: G, sub: 'hazards', format: 'statements',
      q: R`The function $F = A\bar C + BC$ is built as two AND gates feeding an OR gate, with an inverter making $\bar C$. Which statements are correct?`,
      options: [R`With $A = B = 1$, a change of $C$ can cause a brief 0 glitch at the output.`, R`Adding the consensus term $AB$ removes this static hazard.`, R`The glitch appears when $C$ is held fixed and $A$ changes.`, R`In a synchronous design whose output is sampled only after it has settled, the glitch does no harm.`], answer: [0, 1, 3],
      sol: R`With $A = B = 1$, $F = \bar C + C = 1$ for both values of $C$, but the two product terms are covered by different gates. If the inverter delays $\bar C$, both terms can be 0 for a moment as $C$ changes: a static-1 hazard. The consensus of $A\bar C$ and $BC$ is $AB$, which stays 1 throughout and bridges the gap. With $C$ fixed, only one product term depends on the changing input, so no such race exists. Clocked designs sample after the logic settles, so glitches matter only for asynchronous inputs (clocks, resets, latch enables).`,
      trap: R`The hazard is from the variable that appears both true and complemented, here $C$.` },
    { id: 'cl-r5-09', type: 'nat', level: 3, exams: G, sub: 'parity',
      q: R`The parity of a 16-bit word is computed with a balanced tree of 2-input XOR gates, each with a delay of $12$ ns. The worst-case delay from any input bit to the parity output is ______ ns.`,
      answer: 48, tol: 0, calc: () => Math.log2(16) * 12,
      sol: R`Each level of a balanced tree halves the number of signals: $16\to8\to4\to2\to1$, which is $\log_216 = 4$ levels (using 15 gates in all). Every input passes through 4 gates, so the delay is $4\times12 = 48$ ns. A chain of 15 gates would take $180$ ns.`,
      trap: R`Counting gates (15) instead of levels (4) gives the delay of a chain, not a tree.` },
    { id: 'cl-r5-10', type: 'mcq', level: 5, exams: G, sub: 'functional completeness',
      q: R`Only the constant 1 is available (no constant 0). Which single 2-input gate, used as many times as needed, can build every Boolean function?`,
      options: [R`AND`, R`XOR`, R`inhibition, $f(x, y) = \bar xy$`, R`OR`], answer: 2,
      sol: R`With inhibition: $f(x, 1) = \bar x$ gives NOT, and $f(\bar x, y) = xy$ gives AND. NOT and AND together are complete. AND and OR can never make a NOT (they are monotone). XOR with 1 gives NOT, but every function made from XOR and constants is affine (a parity of some inputs), so AND is out of reach.`,
      trap: R`XOR plus the constant 1 makes NOT, which looks promising, but it never makes AND.` },
  ],
  gens: [
    { id: 'cl-r5g1', type: 'nat', level: 2, exams: A, sub: 'number representation',
      make(r) {
        const n = choose(r, [6, 8, 10, 12]), u = int(r, 2 ** (n - 1), 2 ** n - 1), bits = u.toString(2).padStart(n, '0');
        const v = u - 2 ** n;
        return { q: R`The ${n}-bit pattern $${bits}$ is read as a two's complement signed integer. Its decimal value is ______.`,
          answer: v, tol: 0, u, n,
          sol: R`The top bit is 1, so it is negative. Unsigned it is $${u}$; subtract $2^{${n}} = ${2 ** n}$: $${u} - ${2 ** n} = ${v}$.`,
          trap: 'Sign-magnitude or one\'s complement readings give a different number.' };
      },
      verify: (p) => p.u - 2 ** p.n },
    { id: 'cl-r5g2', type: 'nat', level: 4, exams: G, sub: 'codes',
      make(r) {
        const M = int(r, 5, 300);
        const flips = 2 * M - pop(M);
        return { q: R`A binary counter (wide enough never to overflow) starts at 0 and counts up to ${M}. The total number of individual bit changes over all the steps is ______.`,
          answer: flips, tol: 0, M,
          sol: R`Bit $i$ changes $\lfloor M/2^i\rfloor$ times. Summing over all bits gives $2M - s(M)$, where $s(M)$ is the number of 1s in $M$'s binary form. Here $M = ${M} = ${M.toString(2)}_2$ has $${pop(M)}$ ones, so the total is $${2 * M} - ${pop(M)} = ${flips}$. A Gray-code counter would need only ${M}.`,
          trap: 'Bit 0 changes every step, bit 1 every second step, and so on; not every bit changes each step.' };
      },
      verify: (p) => { let s = 0; for (let i = 0; 2 ** i <= p.M; i++) s += Math.floor(p.M / 2 ** i); return s; } },
    { id: 'cl-r5g3', type: 'mcq', level: 2, exams: A, sub: 'number systems',
      make(r) {
        const v = int(r, 300, 4000), hex = v.toString(16).toUpperCase(), oct = v.toString(8);
        const o = mcqOptions(r, oct, [String(v), (v + 8).toString(8), oct.split('').reverse().join(''), (v ^ 1).toString(8), (v + 64).toString(8)], (s) => `$${s}_8$`);
        return { q: R`The hexadecimal number $${hex}_{16}$ written in octal is`, ...o,
          sol: R`Expand each hex digit to 4 bits: $${v.toString(2)}_2$. Regroup in threes from the right to read the octal digits: $${oct}_8$ (decimal ${v}).`,
          trap: 'Group the bits from the right, and do not write the decimal value as if it were octal.' };
      } },
  ],
};
