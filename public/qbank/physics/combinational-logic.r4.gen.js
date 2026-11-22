// Round 4 extras for combinational-logic: original questions, written 2026-11-22.
import { int, choose, mcqOptions } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const VARS = ['A', 'B', 'C', 'D'];

export default {
  items: [
    { id: 'cl-r4-01', type: 'mcq', level: 1, exams: A, sub: 'Boolean algebra',
      q: R`The complement of $F = A + \bar BC$ is`,
      options: [R`$\bar A + B\bar C$`, R`$\bar AB + \bar C$`, R`$\bar A(B + \bar C)$`, R`$A(\bar B + C)$`], answer: 2,
      sol: R`By De Morgan, $\overline{A + \bar BC} = \bar A\cdot\overline{\bar BC} = \bar A(B + \bar C)$. Every OR becomes AND and every literal is complemented, keeping the grouping: the product $\bar BC$ becomes the sum $B + \bar C$.`,
      trap: R`$\bar AB + \bar C$ loses the brackets; the AND with $\bar A$ must apply to the whole of $B + \bar C$.` },
    { id: 'cl-r4-02', type: 'mcq', level: 2, exams: A, sub: 'number systems',
      q: R`The hexadecimal number $(3\text{A}.8)_{16}$ in decimal is`,
      options: [R`$58.5$`, R`$58.8$`, R`$59.0$`, R`$38.5$`], answer: 0,
      sol: R`$3\times16 + 10\times1 + 8\times16^{-1} = 48 + 10 + 0.5 = 58.5$. Digits after the point carry negative powers of the base, so the $8$ is $8/16$, not $8/10$.`,
      trap: R`Reading the fractional digit as a decimal tenth gives $58.8$.` },
    { id: 'cl-r4-03', type: 'nat', level: 2, exams: A, sub: 'canonical forms',
      q: R`As a function of the four variables $A, B, C, D$, the expression $F = A + BC$ has ______ minterms.`,
      answer: 10, tol: 0, calc: () => { let n = 0; for (let x = 0; x < 16; x++) { const a = x >> 3 & 1, b = x >> 2 & 1, c = x >> 1 & 1; if (a || (b && c)) n++; } return n; },
      sol: R`$A$ alone is true for $2^3 = 8$ of the 16 input combinations; $BC$ for $2^2 = 4$; both ($ABC$) for $2$. By inclusion-exclusion, $8 + 4 - 2 = 10$ minterms.`,
      trap: R`Adding $8 + 4 = 12$ counts the two minterms with $A = B = C = 1$ twice.` },
    { id: 'cl-r4-04', type: 'nat', level: 3, exams: G, sub: 'error-correcting codes',
      q: R`A single-error-correcting Hamming code protects $26$ data bits. The smallest number of check (parity) bits it needs is ______.`,
      answer: 5, tol: 0, calc: () => { let p = 0; while (2 ** p < 26 + p + 1) p++; return p; },
      sol: R`The $p$ check bits form a syndrome that must name every possible single-bit error position among the $m + p$ bits, plus "no error": $2^p\ge m + p + 1$. With $m = 26$: $p = 4$ gives $16 < 31$; $p = 5$ gives $32\ge32$. So $5$ check bits, a $(31, 26)$ code.`,
      trap: R`Using $2^p\ge m$ forgets that the check bits themselves can be in error, and that "no error" needs a code too.` },
    { id: 'cl-r4-05', type: 'mcq', level: 3, exams: A, sub: 'Boolean algebra',
      q: R`The expression $XY + \bar XZ + YZ$ simplifies to`,
      options: [R`$XY + YZ$`, R`$X + Z$`, R`$Y + Z$`, R`$XY + \bar XZ$`], answer: 3,
      sol: R`This is the consensus theorem. Write $YZ = YZ(X + \bar X) = XYZ + \bar XYZ$. Then $XY + XYZ = XY$ and $\bar XZ + \bar XYZ = \bar XZ$, so the $YZ$ term is redundant: $F = XY + \bar XZ$. (Check: $X = 0, Y = 1, Z = 0$ gives $F = 0$, ruling out $Y + Z$.)`,
      trap: R`Dropping $\bar XZ$ instead loses minterms such as $X = 0, Y = 0, Z = 1$.` },
    { id: 'cl-r4-06', type: 'mcq', level: 3, exams: G, sub: 'parity',
      q: R`An even-parity bit for $8$ data bits is generated with 2-input XOR gates arranged as a balanced tree. The number of gates and the number of gate delays from input to output are`,
      options: [R`7 gates, 7 delays`, R`7 gates, 3 delays`, R`8 gates, 3 delays`, R`4 gates, 2 delays`], answer: 1,
      sol: R`Each 2-input gate merges two signals into one, so reducing 8 signals to 1 always takes $8 - 1 = 7$ gates. In a balanced tree they sit in levels of 4, 2 and 1 gates: $\log_28 = 3$ delays. A chain of the same 7 gates would take 7 delays.`,
      trap: R`The gate count is fixed by merging (n - 1); only the depth depends on the arrangement.` },
    { id: 'cl-r4-07', type: 'msq', level: 3, exams: G, sub: 'codes', format: 'statements',
      q: R`Which statements about decimal codes are correct?`,
      options: [R`Excess-3 code is self-complementing: inverting every bit of a digit gives the code of its 9's complement.`, R`4-bit BCD leaves 6 of the 16 possible codes unused.`, R`The 2421 (Aiken) code is self-complementing.`, R`In BCD addition, a correction of $+6$ is needed whenever the 4-bit binary sum of two digits exceeds 7.`, R`The excess-3 code for the decimal digit 5 is $0101$.`], answer: [0, 1, 2],
      sol: R`Excess-3 of $d$ is $d + 3$; inverting four bits gives $15 - (d + 3) = (9 - d) + 3$, the excess-3 code of $9 - d$. The 2421 code is built to have the same property (for example 2 = 0010 and 7 = 1101). BCD uses 0000 to 1001, leaving 1010 to 1111 unused. The $+6$ correction is needed when the sum exceeds 9 (or produces a carry), not 7. Excess-3 of 5 is $5 + 3 = 8 = 1000$.`,
      trap: R`The threshold for BCD correction is 9, the largest decimal digit.` },
    { id: 'cl-r4-08', type: 'msq', level: 4, exams: G, sub: 'Boolean functions', format: 'statements',
      q: R`For the function $F(A, B, C) = \sum m(1, 2, 4, 7)$, which statements are correct?`,
      options: [R`$F = A\oplus B\oplus C$.`, R`No two of its minterms are adjacent on a K-map, so its minimal sum of products has four 3-literal terms.`, R`$F$ is self-dual: $F(\bar A, \bar B, \bar C) = \overline{F(A, B, C)}$.`, R`$F$ is monotone, so it can be built from AND and OR gates without inverters.`], answer: [0, 1, 2],
      sol: R`The minterms 001, 010, 100, 111 are exactly the inputs with an odd number of 1s: odd parity, $A\oplus B\oplus C$. Any two of them differ in two bits, so none can be grouped. Complementing all three inputs flips three bits and so flips the parity: $F(\bar x) = \bar F(x)$, self-dual. It is not monotone: raising $A$ from 0 to 1 at $B = 1, C = 0$ takes $F$ from 1 to 0.`,
      trap: R`A function whose K-map cannot be simplified still has other structure: here XOR gates build it with two gates.` },
    { id: 'cl-r4-09', type: 'mcq', level: 4, exams: G, sub: 'counting functions',
      q: R`Of the 16 Boolean functions of two variables $A$ and $B$, how many truly depend on both inputs?`,
      options: [R`$10$`, R`$16$`, R`$8$`, R`$14$`], answer: 0,
      sol: R`Remove those that ignore at least one input: the constants 0 and 1, the functions of $A$ alone ($A$, $\bar A$) and of $B$ alone ($B$, $\bar B$). That leaves $16 - 6 = 10$: AND, OR, NAND, NOR, XOR, XNOR and the four "inhibit/implication" functions $A\bar B$, $\bar AB$, $A + \bar B$, $\bar A + B$.`,
      trap: R`Removing only the two constants gives 14; the single-variable functions do not depend on both inputs either.` },
    { id: 'cl-r4-10', type: 'nat', level: 3, exams: G, sub: 'ROM logic',
      q: R`A $4$-bit by $4$-bit unsigned multiplier is built as a lookup table in a ROM: the two operands form the address and the full product is the data word. The ROM must hold ______ bits.`,
      answer: 2048, tol: 0, calc: () => 2 ** 8 * 8,
      sol: R`Address: $4 + 4 = 8$ bits, so $2^8 = 256$ words. The largest product is $15\times15 = 225 < 2^8$, so each word needs $8$ bits. Size $= 256\times8 = 2048$ bits. The table doubles with every extra address bit, which is why wide multipliers are built from logic instead.`,
      trap: R`Using a 4-bit data word: the product of two n-bit numbers needs 2n bits.` },
    { id: 'cl-r4-11', type: 'mcq', level: 5, exams: G, sub: 'counting functions',
      q: R`How many Boolean functions of three variables are both self-dual ($f(\bar x) = \overline{f(x)}$) and monotone (never fall when any input rises)?`,
      options: [R`$2$`, R`$8$`, R`$4$`, R`$16$`], answer: 2,
      sol: R`Self-duality fixes $f$ on 000 and 111 as complements; monotonicity then forces $f(000) = 0$, $f(111) = 1$. Self-duality pairs each weight-1 input with its weight-2 complement, so $f$ is fixed by its values on 001, 010, 100. Monotone and self-dual: if two of these are 1, say $f(001) = f(010) = 1$, then $f(101) = 0$ by duality with $f(010)$, but $101 > 001$ forbids it; so at most one is 1. One of them 1 gives a single variable ($A$, $B$ or $C$); none gives the majority function. Total: $3 + 1 = 4$.`,
      trap: R`There are 16 self-dual functions of three variables, but most of them are not monotone.` },
    { id: 'cl-r4-12', type: 'nat', level: 5, exams: G, sub: 'K-maps',
      q: R`The function $F(A, B, C, D) = \sum m(0, 2, 3, 4, 5, 7, 8, 10, 13, 15)$ has several different minimal sum-of-products forms. How many?`,
      answer: 4, tol: 0, calc: () => 2 * 2,
      sol: R`Essential prime implicants: $\bar B\bar D$ (minterms 0, 2, 8, 10) and $BD$ (5, 7, 13, 15). They leave minterms 3 (0011) and 4 (0100). Minterm 3 is covered by either $\bar A\bar BC$ or $\bar ACD$; minterm 4 by either $\bar AB\bar C$ or $\bar A\bar C\bar D$. No single term covers both, so each minimal form is the two essentials plus one choice for each: $2\times2 = 4$ forms, each with four terms and ten literals.`,
      trap: R`Counting only the prime implicants (six) or the essential ones (two) answers a different question.` },
  ],
  gens: [
    { id: 'cl-r4g1', type: 'nat', level: 2, exams: A, sub: 'canonical forms',
      make(r) {
        const nt = int(r, 2, 3), terms = [];
        for (let t = 0; t < nt; t++) {
          let lits = VARS.map(() => int(r, 0, 2)); // 0 absent, 1 true, 2 complemented
          if (lits.every((l) => l === 0)) lits[int(r, 0, 3)] = 1;
          if (lits.filter((l) => l).length === 4) lits[int(r, 0, 3)] = 0;
          terms.push(lits);
        }
        const tex = terms.map((l) => l.map((x, i) => (x === 1 ? VARS[i] : x === 2 ? `\\bar ${VARS[i]}` : '')).join('')).join(' + ');
        const count = (ts) => { let n = 0; for (let x = 0; x < 16; x++) { const b = [x >> 3 & 1, x >> 2 & 1, x >> 1 & 1, x & 1]; if (ts.some((l) => l.every((v, i) => v === 0 || (v === 1 ? b[i] === 1 : b[i] === 0)))) n++; } return n; };
        const n = count(terms), sizes = terms.map((l) => 2 ** l.filter((v) => v === 0).length);
        return { q: `As a function of the four variables $A, B, C, D$, the expression $F = ${tex}$ has ______ minterms.`,
          answer: n, tol: 0, terms,
          sol: `A product with $k$ literals is true for $2^{4 - k}$ of the 16 inputs: here ${sizes.join(', ')}. Subtract the overlaps (inputs where two or more terms are true at once), by inclusion-exclusion or by marking a K-map: $${n}$ minterms in all.`,
          trap: 'Adding the term sizes without removing the overlaps.' };
      },
      verify: (p) => { let n = 0; for (let x = 0; x < 16; x++) { const b = [x >> 3 & 1, x >> 2 & 1, x >> 1 & 1, x & 1]; if (p.terms.some((l) => l.every((v, i) => v === 0 || (v === 1 ? b[i] === 1 : b[i] === 0)))) n++; } return n; } },
    { id: 'cl-r4g2', type: 'mcq', level: 2, exams: A, sub: 'number systems',
      make(r) {
        const b = choose(r, [8, 16]), n = int(r, 17, 255), f = int(r, 1, b - 1);
        const shown = `${n.toString(b).toUpperCase()}.${f.toString(b).toUpperCase()}`;
        const val = n + f / b;
        const o = mcqOptions(r, val, [n + f / 10, n + f / (b * b), n + 1 + f / b, n - 1 + f / b], (v) => `$${+v.toFixed(4)}$`);
        return { q: `The ${b === 16 ? 'hexadecimal' : 'octal'} number $(${shown.replace(/([A-F])/g, '\\text{$1}')})_{${b}}$ in decimal is`, ...o,
          sol: `Integer part: $(${n.toString(b).toUpperCase()})_{${b}} = ${n}$. Fraction: the first digit after the point has weight $${b}^{-1}$, so it adds $${f}/${b} = ${+(f / b).toFixed(4)}$. Total $${+val.toFixed(4)}$.`,
          trap: 'Treating the digits after the point as decimal tenths.' };
      } },
    { id: 'cl-r4g3', type: 'nat', level: 3, exams: G, sub: 'ROM logic',
      make(r) {
        const kind = choose(r, ['mul', 'add', 'cmp']), n = int(r, 2, 6), m = kind === 'mul' ? int(r, 2, 6) : n;
        const addr = kind === 'add' ? 2 * n + 1 : n + m, width = kind === 'mul' ? n + m : kind === 'add' ? n + 1 : 3;
        const bits = 2 ** addr * width;
        const what = kind === 'mul' ? `an unsigned ${n}-bit by ${m}-bit multiplier (data word = full product)` : kind === 'add' ? `a ${n}-bit binary adder with carry-in (data word = sum and carry-out)` : `a ${n}-bit magnitude comparator (data word = three flags: greater, equal, less)`;
        return { q: `A ROM is used as a lookup table for ${what}; all inputs together form the address. The ROM must hold ______ bits.`,
          answer: bits, tol: 0, addr, width,
          sol: `Address bits: ${kind === 'add' ? `$2\\times${n} + 1 = ${addr}$` : `$${n} + ${m} = ${addr}$`}, so $2^{${addr}} = ${2 ** addr}$ words. Data bits per word: ${kind === 'mul' ? `$${n} + ${m} = ${width}$ (the largest product needs $n + m$ bits)` : kind === 'add' ? `$${n} + 1 = ${width}$ (sum plus carry)` : '3'}. Size $= ${2 ** addr}\\times${width} = ${bits}$ bits.`,
          trap: 'Sizing the words by one operand only, or forgetting an input (such as the carry-in) in the address.' };
      },
      verify: (p) => 2 ** p.addr * p.width },
  ],
};
