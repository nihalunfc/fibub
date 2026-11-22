// Logic gates and Boolean algebra: number systems (binary, hex, BCD, Gray, two's complement), gates and universal
// gates, Boolean laws and De Morgan, simplification and Karnaugh maps, SOP/POS and minterms, adders, multiplexers,
// flip-flops, counters. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
// Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, shuffle } from '../_util.js';

const bin = (n, w) => n.toString(2).padStart(w, '0');

// three-variable expressions for templates: [TeX, function]
const EXPR3 = [
  ['A\\bar B + C', (a, b, c) => (a && !b) || c],
  ['(A + B)\\,\\bar C', (a, b, c) => (a || b) && !c],
  ['A \\oplus B \\oplus C', (a, b, c) => (a ^ b ^ c) === 1],
  ['\\overline{AB} \\cdot C', (a, b, c) => !(a && b) && c],
  ['AB + BC + CA', (a, b, c) => (a && b) || (b && c) || (c && a)],
  ['\\overline{A + B} + BC', (a, b, c) => !(a || b) || (b && c)],
  ['A \\oplus BC', (a, b, c) => (a ^ (b & c)) === 1],
  ['(A + \\bar C)(\\bar A + B)', (a, b, c) => (a || !c) && (!a || b)],
];
// four-variable expressions: [TeX, function]
const EXPR4 = [
  ['AB + CD', (a, b, c, d) => (a && b) || (c && d)],
  ['A + BCD', (a, b, c, d) => a || (b && c && d)],
  ['A\\bar B + C', (a, b, c, d) => (a && !b) || c],
  ['(A + B)(C + D)', (a, b, c, d) => (a || b) && (c || d)],
  ['A \\oplus B', (a, b) => (a ^ b) === 1],
  ['AB + \\bar A\\bar B', (a, b) => (a && b) || (!a && !b)],
  ['A + B + C + D', (a, b, c, d) => a || b || c || d],
  ['\\bar A\\,\\bar B\\,\\bar C + D', (a, b, c, d) => (!a && !b && !c) || d],
];
const count4 = (f) => { let n = 0; for (let m = 0; m < 16; m++) if (f(m >> 3 & 1, m >> 2 & 1, m >> 1 & 1, m & 1)) n++; return n; };

import * as Q5 from '../_util.js';
import more2 from './digital-logic.more2.gen.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'digital-logic',
  items: [
    // ---------- level 1 ----------
    { id: 'dlg-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'number systems',
      q: 'The binary number $(1011)_2$ equals, in decimal,',
      options: ['$13$', '$9$', '$11$', '$1011$'], answer: 2,
      sol: 'Weights from the right are $1, 2, 4, 8$: $1\\times8 + 0\\times4 + 1\\times2 + 1\\times1 = 11$.',
      trap: '$13$ comes from reading the bits in the wrong order ($1101$).' },
    { id: 'dlg-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'gates',
      q: 'A two-input gate gives output 1 only when both inputs are 0. It is',
      options: ['NAND', 'OR', 'XNOR', 'NOR'], answer: 3,
      sol: 'OR gives 1 if any input is 1, so NOR (OR then NOT) gives 1 only when no input is 1, i.e. both are 0. XNOR also gives 1 for inputs 00, but it gives 1 for 11 as well.',
      trap: 'XNOR is 1 for 00 too, but not ONLY for 00.' },
    { id: 'dlg-003', type: 'nat', level: 1, exams: ['jam'], sub: 'number systems',
      q: 'When the decimal number $45$ is written in binary, the number of 1s in it is ______.',
      answer: 4, tol: 0, calc: () => (45).toString(2).split('').filter((c) => c === '1').length,
      sol: '$45 = 32 + 8 + 4 + 1$, so $45 = (101101)_2$, which has four 1s. Check by repeated division by 2: remainders $1, 0, 1, 1, 0, 1$ read from the last one up.',
      trap: 'Reading the remainders from the first one down gives the bits reversed; here the count of 1s is the same, but the number is not.' },
    { id: 'dlg-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'Boolean laws',
      q: 'The Boolean expression $A + AB$ simplifies to',
      options: ['$A$', '$B$', '$AB$', '$A + B$'], answer: 0,
      sol: 'Factor out $A$: $A + AB = A(1 + B) = A\\cdot1 = A$, since $1 + B = 1$ in Boolean algebra. This is the absorption law: if $A$ is 1 the expression is 1, and if $A$ is 0 both terms are 0.',
      trap: 'Ordinary algebra has no rule $1 + B = 1$, so it seems nothing simplifies.' },
    { id: 'dlg-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'gates',
      q: 'Which expression equals $A \\oplus B$ (exclusive OR)?',
      options: ['$AB + \\bar A\\bar B$', '$\\bar AB + A\\bar B$', '$A + B$', '$\\bar A + \\bar B$'], answer: 1,
      sol: 'XOR is 1 exactly when the inputs differ: $A = 0, B = 1$ (term $\\bar AB$) or $A = 1, B = 0$ (term $A\\bar B$). So $A\\oplus B = \\bar AB + A\\bar B$. The expression $AB + \\bar A\\bar B$ is its complement, XNOR.',
      trap: '$A + B$ (OR) differs from XOR only in the row $A = B = 1$, the row people forget.' },
    { id: 'dlg-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'universal gates',
      q: 'Which pair of gates are each "universal", meaning any logic function can be built from that gate alone?',
      options: ['AND and OR', 'NAND and NOR', 'XOR and XNOR', 'NOT and AND'], answer: 1,
      sol: 'With NAND alone: NOT $A$ = NAND($A$, $A$); AND = NOT of NAND; OR = NAND($\\bar A$, $\\bar B$) by De Morgan. NOR works the same way with the roles of AND and OR swapped. AND and OR cannot make NOT; XOR cannot make AND.',
      trap: 'NOT plus AND is also a complete set, but it is two gates, not one universal gate.' },

    // ---------- level 2 ----------
    { id: 'dlg-007', type: 'nat', level: 2, exams: ['jam'], sub: 'number systems',
      q: 'The hexadecimal number $(2F)_{16}$ equals ______ in decimal.',
      answer: 47, tol: 0, calc: () => parseInt('2F', 16),
      sol: '$F = 15$, so $(2F)_{16} = 2\\times16 + 15 = 47$.',
      trap: 'Treating F as 6 (the sixth letter) or reading 2F as $2\\times10 + 15$.' },
    { id: 'dlg-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'De Morgan',
      q: 'By De Morgan\'s theorem, $\\overline{A + B}$ equals',
      options: ['$\\bar A + \\bar B$', '$\\overline{AB}$', '$\\bar A\\,\\bar B$', '$A\\bar B + \\bar AB$'], answer: 2,
      sol: '"Break the bar and change the sign": $\\overline{A + B} = \\bar A\\,\\bar B$ and $\\overline{AB} = \\bar A + \\bar B$. Check: $A + B$ is 0 only when both are 0, which is exactly when $\\bar A\\,\\bar B = 1$.',
      trap: '$\\bar A + \\bar B$ breaks the bar but forgets to change OR into AND; it equals NAND, not NOR.' },
    { id: 'dlg-009', type: 'nat', level: 2, exams: ['jam'], sub: 'two\'s complement',
      q: 'The number $-20$ is stored in 8-bit two\'s complement form. Read as an unsigned binary number, that 8-bit pattern equals ______ in decimal.',
      answer: 236, tol: 0, calc: () => 256 - 20,
      sol: '$20 = 00010100$. Invert every bit: $11101011$; add 1: $11101100$. As an unsigned number this is $128 + 64 + 32 + 8 + 4 = 236$, which is $2^8 - 20$, as it must be.',
      trap: 'Stopping after inverting (one\'s complement) gives $235$.' },
    { id: 'dlg-010', type: 'msq', level: 2, exams: ['jam'], sub: 'Boolean laws', format: 'multi',
      q: 'Which of the following expressions are equal to $A$?',
      options: ['$A + AB$', '$A(A + B)$', '$A + \\bar AB$', '$AB + A\\bar B$'], answer: [0, 1, 3],
      sol: '$A + AB = A(1 + B) = A$. $A(A + B) = A + AB = A$. $AB + A\\bar B = A(B + \\bar B) = A$. But $A + \\bar AB = (A + \\bar A)(A + B) = A + B$, which is 1 when $A = 0, B = 1$.',
      trap: '$A + \\bar AB$ looks like the absorption law, but the bar on $A$ makes it $A + B$.' },
    { id: 'dlg-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'universal gates',
      q: 'The smallest number of two-input NAND gates needed to make a two-input XOR gate is',
      options: ['$3$', '$4$', '$5$', '$2$'], answer: 1,
      sol: 'Let $N = \\overline{AB}$ (gate 1). Gate 2: $\\overline{AN}$; gate 3: $\\overline{BN}$; gate 4: NAND of those two. Gate 4 gives $AN + BN = (A + B)\\overline{AB} = (A + B)(\\bar A + \\bar B) = A\\bar B + \\bar AB = A\\oplus B$. Four gates; it cannot be done with three.',
      trap: 'Building XOR from its SOP form with NANDs and separate inverters takes 5; sharing $\\overline{AB}$ saves one.' },
    { id: 'dlg-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'adders',
      q: 'A half adder adds two bits $A$ and $B$. Its sum $S$ and carry $C$ are',
      options: ['$S = A + B$, $C = AB$', '$S = AB$, $C = A\\oplus B$', '$S = A\\oplus B$, $C = A + B$', '$S = A\\oplus B$, $C = AB$'], answer: 3,
      sol: 'Binary addition: $0+0 = 00$, $0+1 = 1+0 = 01$, $1+1 = 10$. The sum bit is 1 when exactly one input is 1 (XOR); the carry is 1 only when both are 1 (AND).',
      trap: 'Using OR for the sum fails in the row $1 + 1$, where the sum bit must be 0.' },
    { id: 'dlg-013', type: 'nat', level: 2, exams: ['jam'], sub: 'truth tables',
      q: 'The complete truth table of a Boolean function of 5 input variables has ______ rows.',
      answer: 32, tol: 0, calc: () => 2 ** 5,
      sol: 'Each input is 0 or 1, so there are $2^5 = 32$ combinations, one row each.',
      trap: '$5^2 = 25$ swaps base and exponent.' },
    { id: 'dlg-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'universal gates',
      q: 'Both inputs of a two-input NAND gate are tied together and driven by $A$. The output is',
      options: ['$\\bar A$', '$A$', 'always $1$', 'always $0$'], answer: 0,
      sol: '$\\overline{A\\cdot A} = \\bar A$: the NAND becomes an inverter. The same works for NOR: $\\overline{A + A} = \\bar A$.',
      trap: 'Tying the inputs of AND or OR gives back $A$; the bar in NAND makes it $\\bar A$.' },
    { id: 'dlg-015', type: 'msq', level: 2, exams: ['jam'], sub: 'gates', format: 'statements',
      q: 'Which statements about the two-input NOR gate are correct?',
      options: ['It is a universal gate.', 'Its output is 1 only when both inputs are 0.', 'It is equivalent to an OR gate followed by a NOT gate.', 'With both inputs tied to $A$ its output is $A$.'], answer: [0, 1, 2],
      sol: 'NOR $= \\overline{A + B}$: an OR followed by NOT, 1 only for inputs 00, and universal (it can make NOT, OR and AND). With both inputs tied together, $\\overline{A + A} = \\bar A$, an inverter, not $A$.',
      trap: 'Tied inputs turn NOR into NOT.' },
    { id: 'dlg-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'number systems',
      q: 'The decimal number $59$ in BCD (8421 code) is',
      options: ['$0011\\,1011$', '$1001\\,0101$', '$0101\\,1010$', '$0101\\,1001$'], answer: 3,
      sol: 'BCD codes each decimal digit separately in four bits: $5 = 0101$ and $9 = 1001$, so $59 = 0101\\,1001$.',
      trap: '$0011\\,1011$ is the plain binary of 59, not BCD.' },
    { id: 'dlg-042', type: 'msq', level: 2, exams: ['jam'], sub: 'Boolean laws', format: 'statements',
      q: 'Which of these identities hold in Boolean algebra?',
      options: ['$A + A = A$', '$A + 1 = 1$', '$A + BC = (A + B)(A + C)$', '$A(B + C) = AB + C$'], answer: [0, 1, 2],
      sol: '$A + A = A$ (idempotence) and $A + 1 = 1$ have no ordinary-algebra version. $A + BC = (A + B)(A + C)$ is the distributive law of OR over AND: expand the right side to $A + AC + AB + BC = A + BC$. The last one is wrong: $A(B + C) = AB + AC$; try $A = 0, C = 1$, which gives 0 on the left and 1 on the right.',
      trap: 'OR distributes over AND in Boolean algebra, although addition does not distribute over multiplication in ordinary algebra.' },

    // ---------- level 3 ----------
    { id: 'dlg-017', type: 'mcq', level: 3, exams: ['jam'], sub: 'simplification',
      q: 'The expression $Y = AB + A\\bar B + \\bar AB$ simplifies to',
      options: ['$AB$', '$A \\oplus B$', '$A + B$', '$1$'], answer: 2,
      sol: '$AB + A\\bar B = A(B + \\bar B) = A$, so $Y = A + \\bar AB = (A + \\bar A)(A + B) = A + B$. In the truth table $Y$ is 0 only for $A = B = 0$, which is OR.',
      trap: 'Two of the three terms are the XOR terms, which tempts people to answer XOR; the extra $AB$ term fills the last row.' },
    { id: 'dlg-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'K-maps',
      q: 'With $A$ as the most significant bit, the function $f(A, B, C) = \\sum m(0, 2, 4, 6)$ simplifies to',
      options: ['$\\bar A\\bar C$', '$\\bar C$', '$C$', '$\\bar B$'], answer: 1,
      sol: 'The minterms are $000, 010, 100, 110$: in every one $C = 0$, while $A$ and $B$ take all four values. So $f = \\bar C$. On a K-map the four cells form one group of four.',
      trap: 'Grouping only pairs gives $\\bar A\\bar C + A\\bar C$, which is still $\\bar C$.' },
    { id: 'dlg-019', type: 'msq', level: 3, exams: ['jam'], sub: 'De Morgan', format: 'multi',
      q: 'Let $Y = \\overline{AB}\\cdot\\overline{\\bar A\\,\\bar B}$. Which expressions are equal to $Y$?',
      options: ['$A \\oplus B$', '$(A + B)(\\bar A + \\bar B)$', 'the complement of $A$ XNOR $B$', '$A + B$'], answer: [0, 1, 2],
      sol: 'De Morgan on each factor: $\\overline{AB} = \\bar A + \\bar B$ and $\\overline{\\bar A\\bar B} = A + B$. So $Y = (A + B)(\\bar A + \\bar B) = A\\bar B + \\bar AB = A\\oplus B$, which is also the complement of XNOR. It differs from $A + B$ at $A = B = 1$, where $Y = 0$.',
      trap: 'The product of sums $(A + B)(\\bar A + \\bar B)$ is a valid way to write XOR; it is not OR.' },
    { id: 'dlg-020', type: 'nat', level: 3, exams: ['jam'], sub: 'two\'s complement',
      q: 'In 4-bit two\'s complement arithmetic, $0110 - 1001$ is done by adding the two\'s complement of $1001$ to $0110$ (with $1001$ read as an unsigned 4-bit number). Keeping 4 bits and reading the result as a two\'s complement number, the answer in decimal is ______.',
      answer: -3, tol: 0, calc: () => { const s = (6 + ((~9 + 1) & 15)) & 15; return s >= 8 ? s - 16 : s; },
      sol: 'Two\'s complement of $1001$: invert to $0110$, add 1: $0111$. Add: $0110 + 0111 = 1101$. The top bit is 1, so the result is negative: invert $1101$ to $0010$, add 1, giving $0011 = 3$. The result is $-3$, which matches $6 - 9$.',
      trap: 'Reading $1101$ as unsigned gives 13; the top bit marks a negative number.' },
    { id: 'dlg-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'adders',
      q: 'The carry output of a full adder with inputs $A$, $B$ and carry-in $C$ is',
      options: ['$AB + C(A\\oplus B)$', '$A\\oplus B\\oplus C$', '$AB + BC$', '$A + B + C$'], answer: 0,
      sol: 'A carry comes out when at least two of the three inputs are 1. Either $A$ and $B$ are both 1 ($AB$), or exactly one of them is 1 and the carry-in is 1 ($C(A\\oplus B)$). This equals the majority function $AB + BC + CA$. $A\\oplus B\\oplus C$ is the sum bit.',
      trap: '$AB + BC$ misses the case $A = C = 1, B = 0$.' },
    { id: 'dlg-022', type: 'nat', level: 3, exams: ['jam'], sub: 'multiplexers',
      q: 'A multiplexer selects one of $32$ data inputs. The number of select lines it needs is ______.',
      answer: 5, tol: 0, calc: () => Math.log2(32),
      sol: '$n$ select lines can address $2^n$ inputs. $2^5 = 32$, so 5 select lines.',
      trap: 'Thinking one select line per input (32) or $32/2 = 16$.' },
    { id: 'dlg-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'multiplexers',
      q: 'A 4-to-1 multiplexer with select lines $S_1S_0$ has its data inputs set to $I_0 = 0$, $I_1 = 1$, $I_2 = 1$, $I_3 = 0$. As a function of $S_1$ and $S_0$, its output is',
      options: ['$S_1S_0$', '$S_1 + S_0$', '$S_1 \\oplus S_0$', 'the complement of $S_1\\oplus S_0$'], answer: 2,
      sol: 'The output copies $I_k$ where $k = (S_1S_0)_2$: $00\\to0$, $01\\to1$, $10\\to1$, $11\\to0$. That is 1 exactly when the select bits differ: $S_1\\oplus S_0$. A multiplexer can make any function of its select lines by tying its data inputs to the truth table.',
      trap: 'OR differs only in the row $11$, where this output is 0.' },
    { id: 'dlg-024', type: 'nat', level: 3, exams: ['jam'], sub: 'counters', unit: 'kHz',
      q: 'A 4-bit ripple counter is driven by a $16$ kHz clock. The frequency of the square wave at the output of its last flip-flop is ______ kHz.',
      answer: 1, tol: 0.001, calc: () => 16 / 2 ** 4,
      sol: 'Each toggling flip-flop divides the frequency by 2, so four of them divide by $2^4 = 16$: $16/16 = 1$ kHz.',
      trap: 'Dividing by 4 (one per flip-flop, not two) gives 4 kHz.' },
    { id: 'dlg-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'flip-flops',
      q: 'An edge-triggered JK flip-flop has $J = K = 1$. At each active clock edge its output',
      options: ['holds its value', 'resets to 0', 'sets to 1', 'toggles'], answer: 3,
      sol: 'JK flip-flop: $J = K = 0$ holds, $J = 1, K = 0$ sets, $J = 0, K = 1$ resets, $J = K = 1$ toggles ($Q_{n+1} = \\bar Q_n$). The characteristic equation $Q_{n+1} = J\\bar Q_n + \\bar KQ_n$ gives $\\bar Q_n$ when $J = K = 1$.',
      trap: 'In an SR flip-flop the equivalent input $S = R = 1$ is forbidden; the JK was designed to make it useful.' },
    { id: 'dlg-026', type: 'msq', level: 3, exams: ['jam'], sub: 'SOP and POS', format: 'statements',
      q: 'With $A$ as the most significant bit, consider $f(A, B, C) = \\sum m(3, 5, 6, 7)$. Which statements are correct?',
      options: ['$f = AB + BC + CA$', '$f$ is 1 whenever at least two inputs are 1.', '$f = \\prod M(0, 1, 2, 4)$', '$f$ is the sum output of a full adder.'], answer: [0, 1, 2],
      sol: 'The minterms $011, 101, 110, 111$ are exactly the rows with two or more 1s: the majority function, $AB + BC + CA$. The maxterms are the remaining rows $0, 1, 2, 4$, so the POS form is $\\prod M(0, 1, 2, 4)$. The majority function is the CARRY of a full adder; the sum is $A\\oplus B\\oplus C$ (minterms 1, 2, 4, 7).',
      trap: 'Carry and sum are easily swapped: the sum is the odd-parity function, the carry the majority function.' },
    { id: 'dlg-027', type: 'nat', level: 3, exams: ['jam'], sub: 'minterms',
      q: 'As a function of four variables $A, B, C, D$, the expression $f = A + B$ has ______ minterms.',
      answer: 12, tol: 0, calc: () => count4((a, b) => a || b),
      sol: '$f$ is 0 only when $A = B = 0$, which happens in $2^2 = 4$ of the 16 rows (any $C$, $D$). So $16 - 4 = 12$ rows give 1.',
      trap: 'Counting only the minterms of $A + B$ as a function of two variables gives 3; each one is repeated for the 4 values of $CD$.' },
    { id: 'dlg-028', type: 'mcq', level: 3, exams: ['jam'], sub: 'number systems',
      q: 'The 4-bit binary number $1011$ in Gray code is',
      options: ['$1101$', '$0100$', '$1011$', '$1110$'], answer: 3,
      sol: 'Keep the first bit, then each Gray bit is the XOR of neighbouring binary bits: $g_3 = 1$, $g_2 = 1\\oplus0 = 1$, $g_1 = 0\\oplus1 = 1$, $g_0 = 1\\oplus1 = 0$. So $1110$. In Gray code neighbouring numbers differ in one bit only.',
      trap: '$0100$ is the bitwise complement, unrelated to Gray code.' },

    // ---------- level 4 ----------
    { id: 'dlg-029', type: 'mcq', level: 4, exams: ['jam'], sub: 'simplification',
      q: 'The expression $Y = (A + B)(A + \\bar B)(\\bar A + C)$ simplifies to',
      options: ['$A + C$', '$AC$', '$A$', '$BC$'], answer: 1,
      sol: '$(A + B)(A + \\bar B) = A + B\\bar B = A$ (OR distributes over AND). Then $Y = A(\\bar A + C) = A\\bar A + AC = AC$.',
      trap: 'Stopping after the first step and answering $A$ forgets the third factor.' },
    { id: 'dlg-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'K-maps',
      q: 'With $A$ as the most significant bit, $f(A, B, C, D) = \\sum m(0, 1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 14)$. The total number of literals in its minimal sum-of-products form is ______.',
      answer: 2, tol: 0, calc: () => { const ones = [0, 1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 14]; const same = [...Array(16).keys()].every((m) => ones.includes(m) === !((m >> 2 & 1) && (m & 1))); return same ? 2 : NaN; },
      sol: 'Look at the missing minterms: $5, 7, 13, 15$, i.e. $0101, 0111, 1101, 1111$, which are exactly the rows with $B = 1$ and $D = 1$. So $\\bar f = BD$ and $f = \\overline{BD} = \\bar B + \\bar D$: two groups of eight on the K-map, two literals in all.',
      trap: 'Grouping into quads ($\\bar A\\bar B$, $A\\bar B$, $B\\bar D$...) gives a correct but not minimal answer. Looking at the 0s first is often faster.' },
    { id: 'dlg-031', type: 'msq', level: 4, exams: ['jam'], sub: 'gates', format: 'multi',
      q: 'For which of these two-input gates does holding one input at logic 1 make the gate an inverter for the other input?',
      options: ['NAND', 'NOR', 'XOR', 'XNOR'], answer: [0, 2],
      sol: 'NAND: $\\overline{A\\cdot1} = \\bar A$. XOR: $A\\oplus1 = \\bar A$. NOR: $\\overline{A + 1} = 0$ always. XNOR: $\\overline{A\\oplus1} = A$, a buffer. (With one input held at 0, NOR and XNOR are the ones that invert.)',
      trap: 'NOR inverts when the spare input is held at 0, not 1.' },
    { id: 'dlg-032', type: 'mcq', level: 4, exams: ['jam'], sub: 'truth tables',
      q: 'How many different Boolean functions of two variables are there?',
      options: ['$4$', '$8$', '$16$', '$256$'], answer: 2,
      sol: 'A function of two variables is fixed by its truth table, which has $2^2 = 4$ rows. Each row\'s output can be 0 or 1 independently, giving $2^4 = 16$ functions (including the constants 0 and 1, AND, OR, XOR, NAND and so on). In general there are $2^{2^n}$.',
      trap: '$4$ counts the rows, not the functions; $256$ is the count for three variables.' },
    { id: 'dlg-033', type: 'nat', level: 4, exams: ['jam'], sub: 'counters',
      q: 'A 4-bit ripple up-counter has a NAND gate that clears all flip-flops as soon as the outputs reach $Q_3Q_2Q_1Q_0 = 1100$. The modulus (number of distinct states it counts through) is ______.',
      answer: 12, tol: 0, calc: () => 0b1100,
      sol: 'The counter goes $0000, 0001, \\dots, 1011$ and the instant it reaches $1100$ (twelve) it is cleared to $0000$. State 1100 lasts only a moment, so the stable states are $0$ to $11$: modulus 12.',
      trap: 'Counting the reset state too gives 13.' },
    { id: 'dlg-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'flip-flops',
      q: 'An SR latch is built from two cross-coupled NOR gates. If $S = R = 1$ is applied,',
      options: ['$Q$ toggles', '$Q$ holds its previous value', '$Q = \\bar Q = 1$', 'both $Q$ and $\\bar Q$ go to 0, and the state after removing the inputs is unpredictable'], answer: 3,
      sol: 'Each NOR gate has one input at 1, so both outputs are forced to 0. This breaks the rule that the outputs are complements. If both inputs then return to 0 together, the latch settles to whichever side wins the race: so $S = R = 1$ is "forbidden". (A NAND latch has its forbidden state at $\\bar S = \\bar R = 0$, which forces both outputs to 1.)',
      trap: 'Both outputs 1 is the NAND-latch version; for NOR they go to 0.' },
    { id: 'dlg-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'universal gates',
      q: 'Four two-input NAND gates are wired as follows: gate 1 has inputs $A$ and $B$; gate 2 has inputs $A$ and the output of gate 1; gate 3 has inputs $B$ and the output of gate 1; gate 4 has the outputs of gates 2 and 3 as inputs. The output of gate 4 is',
      options: ['$A\\oplus B$', 'the complement of $A\\oplus B$', '$AB$', '$A + B$'], answer: 0,
      sol: 'Gate 1: $N = \\overline{AB}$. Gates 2 and 3: $\\overline{AN}$ and $\\overline{BN}$. Gate 4: $\\overline{\\overline{AN}\\cdot\\overline{BN}} = AN + BN = (A + B)\\overline{AB}$. Check the rows: $00\\to0$, $01\\to1$, $10\\to1$, $11\\to(1)(0) = 0$. That is XOR.',
      trap: 'Adding a fifth NAND as an inverter would give XNOR; with four it is XOR.' },
    { id: 'dlg-036', type: 'nat', level: 4, exams: ['jam'], sub: 'parity',
      q: 'For how many of the 16 input combinations of $A, B, C, D$ is $A\\oplus B\\oplus C\\oplus D = 1$?',
      answer: 8, tol: 0, calc: () => count4((a, b, c, d) => (a ^ b ^ c ^ d) === 1),
      sol: 'A chain of XORs is 1 when an odd number of inputs are 1: one 1 ($\\binom41 = 4$ ways) or three 1s ($\\binom43 = 4$ ways). Total 8, exactly half of the 16 rows.',
      trap: 'Counting only the rows with a single 1 gives 4.' },
    { id: 'dlg-041', type: 'nat', level: 4, exams: ['jam'], sub: 'minterms',
      q: 'The four-variable function $f(A, B, C, D) = AB + CD$ has ______ minterms.',
      answer: 7, tol: 0, calc: () => count4((a, b, c, d) => (a && b) || (c && d)),
      sol: '$AB = 1$ in 4 rows (any $C$, $D$) and $CD = 1$ in 4 rows. The row $ABCD = 1111$ is in both, so by inclusion-exclusion $4 + 4 - 1 = 7$.',
      trap: 'Adding $4 + 4 = 8$ counts $1111$ twice.' },
    { id: 'dlg-043', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'flip-flops', format: 'statements',
      q: 'Which statements about flip-flops are correct?',
      options: ['The output of a D flip-flop after an active clock edge equals the value of $D$ just before the edge.', 'A T flip-flop with $T = 1$ divides the clock frequency by 2.', 'A level-triggered JK latch with $J = K = 1$ can toggle many times while the clock is high (race-around).', 'An SR flip-flop can safely be given $S = R = 1$.'], answer: [0, 1, 2],
      sol: 'A D flip-flop samples $D$ at the edge: $Q_{n+1} = D$. A T flip-flop with $T = 1$ toggles once per clock, so its output completes one cycle every two clock cycles. A level-triggered JK latch with $J = K = 1$ keeps toggling as long as the clock stays high, if the clock pulse is longer than the gate delay; edge triggering or master-slave designs fix this. $S = R = 1$ is the forbidden input of an SR flip-flop.',
      trap: 'Race-around is a problem of level triggering, not of the JK idea itself.' },

    // ---------- level 5 ----------
    { id: 'dlg-037', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'K-maps', format: 'statements',
      q: 'Consider $F(A, B, C) = A\\oplus B\\oplus C$. Which statements are correct?',
      options: ['$F$ is self-dual: its dual function equals $F$.', 'No two 1s of $F$ are adjacent on its K-map, so its minimal SOP has four terms of three literals each.', '$F$ can be built from two two-input XOR gates.', '$F$ is the carry output of a full adder.'], answer: [0, 1, 2],
      sol: 'Dual: $F^d(A, B, C) = \\overline{F(\\bar A, \\bar B, \\bar C)}$. Complementing all three inputs flips the parity (odd number of flips), so $F(\\bar A, \\bar B, \\bar C) = \\bar F$ and $F^d = F$. On the K-map the 1s (minterms 1, 2, 4, 7) form a checkerboard: changing any one input changes $F$, so no cells can be grouped and $F = \\bar A\\bar BC + \\bar AB\\bar C + A\\bar B\\bar C + ABC$. $(A\\oplus B)\\oplus C$ uses two XOR gates. $F$ is the SUM of a full adder; the carry is the majority function.',
      trap: 'Parity functions are the worst case for K-maps: no grouping is possible at all.' },
    { id: 'dlg-038', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'counters',
      q: 'Three D flip-flops are clocked together with $D_2 = Q_1$, $D_1 = Q_0$ and $D_0 = \\bar Q_2$. Starting from $Q_2Q_1Q_0 = 000$, the number of distinct states in the sequence before it repeats is ______.',
      answer: 6, tol: 0, calc: () => { const seen = new Set(); let s = 0; while (!seen.has(s)) { seen.add(s); const q2 = s >> 2 & 1, q1 = s >> 1 & 1, q0 = s & 1; s = (q1 << 2) | (q0 << 1) | (1 - q2); } return seen.size; },
      sol: 'Apply the rule $Q_2Q_1Q_0 \\to Q_1\\,Q_0\\,\\bar Q_2$ step by step: $000 \\to 001 \\to 011 \\to 111 \\to 110 \\to 100 \\to 000$. Six states. This is a 3-bit Johnson (twisted-ring) counter; with $n$ flip-flops it has $2n$ states, and the other two ($010$, $101$) form a separate unused loop.',
      trap: 'Answering $2^3 = 8$ assumes a binary counter; a ring with one inversion gives $2n$.' },
    { id: 'dlg-039', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'simplification',
      q: 'The expression $Y = AB + \\bar AC + BC$ simplifies to',
      options: ['$AB + BC$', '$\\bar AC + BC$', '$A + C$', '$AB + \\bar AC$'], answer: 3,
      sol: 'The term $BC$ is the consensus of $AB$ and $\\bar AC$: whenever $BC = 1$, either $A = 1$ (then $AB = 1$) or $A = 0$ (then $\\bar AC = 1$). So it adds nothing: $BC = BC(A + \\bar A) = ABC + \\bar ABC$, which is absorbed by $AB$ and $\\bar AC$. $Y = AB + \\bar AC$.',
      trap: 'The redundant term is the one that does NOT contain the variable appearing both plain and barred.' },
    { id: 'dlg-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'two\'s complement',
      q: 'Two 8-bit two\'s complement numbers, $01100100$ and $01010000$, are added in an 8-bit adder and the carry out is discarded. Read as an 8-bit two\'s complement number, the result is ______ in decimal.',
      answer: -76, tol: 0, calc: () => { const s = (100 + 80) & 255; return s >= 128 ? s - 256 : s; },
      sol: 'The numbers are $100$ and $80$. Their true sum $180$ is above $127$, the largest 8-bit signed value. The adder gives $10110100$, whose top bit is 1: as a signed number it is $180 - 256 = -76$. Two positive numbers giving a negative result is the sign of OVERFLOW.',
      trap: 'Answering 180 ignores the 8-bit range: the hardware cannot hold it.' },
    ...more2,
  ],

  gens: [
    { id: 'dlg-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'simplification',
      make(r) {
        const pool = [['A + AB', 'A'], ['A(A + B)', 'A'], ['A + \\bar A B', 'A + B'], ['AB + A\\bar B', 'A'], ['(A + B)(A + \\bar B)', 'A'], ['AB + \\bar A C + BC', 'AB + \\bar A C'],
          ['\\bar A\\bar B + \\bar A B', '\\bar A'], ['\\overline{A + B}', '\\bar A\\,\\bar B'], ['\\overline{AB}', '\\bar A + \\bar B'], ['A\\bar B + \\bar A B + AB', 'A + B'], ['(A + B)(\\bar A + C)', '\\bar A B + AC']];
        const [ex, res] = Q5.choose(r, pool);
        const others = [...new Set([...pool.map((p) => p[1]), 'B', 'AB', '1', 'A\\bar B', '\\bar A + B'])].filter((s) => s !== res);
        const o = Q5.mcqOptions(r, res, Q5.shuffle(r, others), (s) => `$${s}$`);
        return { q: `The Boolean expression $${ex}$ simplifies to`, ...o,
          sol: 'Useful laws: absorption $A + AB = A$ and $A(A + B) = A$; $A + \\bar AB = A + B$; combining $AB + A\\bar B = A$ and its dual $(A + B)(A + \\bar B) = A$; consensus $AB + \\bar AC + BC = AB + \\bar AC$; De Morgan $\\overline{A + B} = \\bar A\\bar B$, $\\overline{AB} = \\bar A + \\bar B$. ' + `Here $${ex} = ${res}$ (check with a truth table if unsure).`,
          trap: 'A truth table settles any doubt: two expressions are equal only if they agree on every input.' };
      } },
    { id: 'dlg-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'universal gates', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['A NAND gate with its inputs tied together acts as a NOT gate.', 'Any Boolean function can be built from NOR gates alone.', 'An XOR gate gives 1 when its two inputs differ.', '$\\overline{AB} = \\bar A + \\bar B$.', 'An OR gate can be built from three NAND gates.'];
        const F = ['XOR is a universal gate.', 'An AND gate followed by a NOT gate is a NOR gate.', '$\\overline{A + B} = \\bar A + \\bar B$.', 'An XNOR gate gives 1 when its two inputs differ.', 'NAND gates alone cannot make an OR function.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about logic gates are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'NAND and NOR are universal: NOT from tied inputs, AND or OR by adding inverters (OR $= \\overline{\\bar A\\cdot\\bar B}$: two NANDs as inverters and one NAND). XOR gates, even with constant inputs, build only parity (linear) functions and can never make AND, so XOR is not universal. AND then NOT is NAND, not NOR. De Morgan: $\\overline{AB} = \\bar A + \\bar B$ and $\\overline{A + B} = \\bar A\\bar B$. XOR is 1 for different inputs, XNOR for equal ones.',
          trap: 'De Morgan swaps AND with OR as the bar is broken.' };
      } },
    { id: 'dlg-t23', type: 'nat', level: 2, exams: ['jam'], sub: 'number systems',
      make(r) {
        const o8 = `${Q5.int(r, 1, 7)}${Q5.int(r, 0, 7)}${Q5.int(r, 0, 7)}`, h16 = `${'123456789ABCDEF'[Q5.int(r, 0, 14)]}${'0123456789ABCDEF'[Q5.int(r, 0, 15)]}`;
        const s = parseInt(o8, 8) + parseInt(h16, 16);
        return { q: `$(${o8})_8 + (${h16})_{16}$, written in decimal, is ______.`,
          answer: s, tol: 0, o8, h16,
          sol: `$(${o8})_8 = ${o8[0]}\\times64 + ${o8[1]}\\times8 + ${o8[2]} = ${parseInt(o8, 8)}$. $(${h16})_{16} = ${parseInt(h16[0], 16)}\\times16 + ${parseInt(h16[1], 16)} = ${parseInt(h16, 16)}$. Sum $= ${s}$.`,
          trap: 'Hex digits A-F stand for 10-15; octal places are 1, 8, 64.' };
      },
      verify: (p) => { let a = 0; for (const d of p.o8) a = a * 8 + Number(d); let b = 0; for (const d of p.h16) b = b * 16 + '0123456789ABCDEF'.indexOf(d); return a + b; } },
    { id: 'dlg-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'truth tables', format: 'graph',
      make(r) {
        const combos = Q5.shuffle(r, [[0, 0], [0, 1], [1, 0], [1, 1]]);
        const G = { AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b) };
        const g = Q5.choose(r, Object.keys(G));
        const row = (f) => combos.map(f).join(', ');
        const o = Q5.mcqOptions(r, `${g} gate`, Q5.shuffle(r, Object.keys(G).filter((x) => x !== g)).map((x) => `${x} gate`));
        return { q: `A timing diagram shows four equal time slots. Input A is $${row((c) => c[0])}$, input B is $${row((c) => c[1])}$, and the output Y is $${row((c) => G[g](c[0], c[1]))}$ in successive slots. The gate is`, ...o,
          sol: `Read the slots as a truth table: ${combos.map((c) => `$(A, B) = (${c[0]}, ${c[1]}) \\to Y = ${G[g](c[0], c[1])}$`).join('; ')}. That is the ${g} truth table.`,
          trap: 'Sort the slots into a truth table; with all four input pairs present the gate is fixed uniquely.' };
      } },
    { id: 'dlg-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'counters',
      make(r) {
        const c = Q5.int(r, 0, 3);
        let qtext, ans, sol, n = 0, K = 0, S = 0;
        if (c === 0) { n = Q5.int(r, 5, 15); K = Q5.int(r, 20, 500); ans = K % n; qtext = `A synchronous mod-$${n}$ counter (counting $0, 1, \\dots, ${n - 1}, 0, \\dots$) starts at $0$. After $${K}$ clock pulses its count is ______.`; sol = `It returns to 0 every $${n}$ pulses, so the count is $${K} \\bmod ${n} = ${ans}$.`; }
        else if (c === 1) { n = Q5.int(r, 3, 6); ans = 2 * n; qtext = `A Johnson (twisted-ring) counter is built from $${n}$ flip-flops. The number of distinct states it cycles through is ______.`; sol = `A Johnson counter fills with 1s and then with 0s: $2n = ${ans}$ states.`; }
        else if (c === 2) { n = Q5.int(r, 3, 8); ans = n; qtext = `A ring counter is built from $${n}$ flip-flops with a single 1 circulating. The number of clock pulses before it first returns to its starting state is ______.`; sol = `The single 1 moves one place per pulse and comes back after $n = ${ans}$ pulses.`; }
        else { n = Q5.int(r, 3, 6); S = Q5.int(r, 0, 2 ** n - 1); K = Q5.int(r, 10, 200); ans = (S + K) % 2 ** n; qtext = `A $${n}$-bit binary up-counter holds $${S}$ (decimal). After $${K}$ more clock pulses it holds ______ (decimal; it wraps round after $${2 ** n - 1}$).`; sol = `It counts modulo $2^${n} = ${2 ** n}$: $(${S} + ${K}) \\bmod ${2 ** n} = ${ans}$.`; }
        return { q: qtext, answer: ans, tol: 0, sol, c, n, K, S, trap: 'Counters wrap round: work modulo the number of states.' };
      },
      verify: (p) => { if (p.c === 1) { let st = Array(p.n).fill(0); const seen = new Set(); while (!seen.has(st.join(''))) { seen.add(st.join('')); st = [1 - st[p.n - 1], ...st.slice(0, -1)]; } return seen.size; } if (p.c === 2) { let st = [1, ...Array(p.n - 1).fill(0)]; let k = 0; do { st = [st[p.n - 1], ...st.slice(0, -1)]; k++; } while (st[0] !== 1); return k; } const mod = p.c === 0 ? p.n : 2 ** p.n; let x = p.c === 0 ? 0 : p.S; for (let i = 0; i < p.K; i++) x = (x + 1) % mod; return x; } },
    { id: 'dlg-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'number systems',
      make(r) {
        const w = int(r, 5, 8), n = int(r, 2 ** (w - 1), 2 ** w - 1);
        return { q: `The binary number $(${bin(n, w)})_2$ equals ______ in decimal.`, answer: n, tol: 0, b: bin(n, w),
          sol: `Add the place values of the 1s: ${bin(n, w).split('').map((c, i) => (c === '1' ? `$2^{${w - 1 - i}}$` : null)).filter(Boolean).join(' + ')} $= ${n}$.`,
          trap: 'Reading the bits from the wrong end.' };
      },
      verify: (p) => parseInt(p.b, 2) },
    { id: 'dlg-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'number systems',
      make(r) {
        const n = int(r, 26, 4095), h = n.toString(16).toUpperCase();
        return { q: `The hexadecimal number $(${h})_{16}$ equals ______ in decimal.`, answer: n, tol: 0, h,
          sol: `Each hex digit is worth a power of 16 (A = 10 ... F = 15): ${h.split('').map((c, i) => `$${parseInt(c, 16)}\\times16^{${h.length - 1 - i}}$`).join(' + ')} $= ${n}$.`,
          trap: 'Treating the hex digits as decimal place values (powers of 10).' };
      },
      verify: (p) => parseInt(p.h, 16) },
    { id: 'dlg-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'two\'s complement',
      make(r) {
        const n = int(r, 1, 128);
        const pat = bin(256 - n, 8);
        return { q: `The number $-${n}$ is stored in 8-bit two's complement form. Read as an unsigned binary number, the pattern equals ______ in decimal.`, answer: 256 - n, tol: 0, n,
          sol: `Two's complement of $${n}$: invert $${bin(n, 8)}$ and add 1, giving $${pat}$, which is $2^8 - ${n} = ${256 - n}$ as an unsigned number.`,
          trap: 'Stopping at the one\'s complement (inverting only) gives one less.' };
      },
      verify: (p) => 256 - p.n },
    { id: 'dlg-g04', type: 'msq', level: 3, exams: ['jam'], sub: 'truth tables', format: 'multi',
      make(r) {
        const [tex, f] = choose(r, EXPR3);
        let rows, ans;
        do {
          rows = shuffle(r, [0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4);
          ans = rows.map((m, i) => (f(m >> 2 & 1, m >> 1 & 1, m & 1) ? i : -1)).filter((i) => i >= 0);
        } while (!ans.length || ans.length === 4);
        const options = rows.map((m) => `$A = ${m >> 2 & 1},\\ B = ${m >> 1 & 1},\\ C = ${m & 1}$`);
        const lines = rows.map((m) => `$(${m >> 2 & 1},${m >> 1 & 1},${m & 1})$ gives $${f(m >> 2 & 1, m >> 1 & 1, m & 1) ? 1 : 0}$`).join('; ');
        return { q: `For which of these inputs is $Y = ${tex}$ equal to 1?`, options, answer: ans,
          sol: `Substitute each row into $Y = ${tex}$ (a bar means NOT, juxtaposition AND, $+$ OR, $\\oplus$ XOR). For $(A, B, C)$: ${lines}.`,
          trap: 'Evaluate NOT before AND before OR, and a long bar covers everything under it.' };
      } },
    { id: 'dlg-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'minterms',
      make(r) {
        const k = int(r, 0, EXPR4.length - 1), [tex, f] = EXPR4[k];
        const n = count4(f);
        return { q: `As a function of the four variables $A, B, C, D$, the expression $f = ${tex}$ has ______ minterms (rows of the truth table where $f = 1$).`, answer: n, tol: 0, k,
          sol: `Count the rows of the 16-row truth table where $f = 1$. A term with $j$ literals covers $2^{4-j}$ rows; overlapping terms must not be counted twice (inclusion-exclusion), and a variable that does not appear doubles the count. The total is $${n}$.`,
          trap: 'Forgetting that missing variables multiply the count, or counting overlaps twice.' };
      },
      verify: (p) => count4(EXPR4[p.k][1]) },
    { id: 'dlg-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'counters', unit: 'kHz',
      make(r) {
        const n = int(r, 2, 8), f = choose(r, [64, 128, 256, 512, 1024, 2048, 4096]);
        const out = f / 2 ** n;
        return { q: `A ${n}-bit ripple counter is driven by a $${f}$ kHz clock. The frequency at the output of its last flip-flop is ______ kHz.`, answer: out, tol: Math.max(0.001, out * 0.001), unit: 'kHz', n, f,
          sol: `Each flip-flop divides by 2, so ${n} flip-flops divide by $2^{${n}} = ${2 ** n}$: $${f}/${2 ** n} = ${out}$ kHz.`,
          trap: 'Dividing by the number of flip-flops instead of by $2^n$.' };
      },
      verify: (p) => p.f / 2 ** p.n },
    { id: 'dlg-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'counters',
      make(r) {
        const N = int(r, 3, 200);
        const k = Math.ceil(Math.log2(N));
        return { q: `The minimum number of flip-flops needed to build a mod-$${N}$ counter (a binary counter with $${N}$ distinct states) is ______.`, answer: k, tol: 0, N,
          sol: `$k$ flip-flops give at most $2^k$ states, so we need $2^k \\ge ${N}$. $2^{${k - 1}} = ${2 ** (k - 1)}$ is too few and $2^{${k}} = ${2 ** k}$ is enough: $k = ${k}$.`,
          trap: 'Using $\\log_2 N$ without rounding up, or $N/2$.' };
      },
      verify: (p) => Math.ceil(Math.log2(p.N)) },
    { id: 'dlg-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'two\'s complement',
      make(r) {
        const a = int(r, -128, 127), b = int(r, -128, 127);
        const s = (a + b) & 255, v = s >= 128 ? s - 256 : s;
        const enc = (x) => bin(x & 255, 8);
        const over = a + b > 127 || a + b < -128;
        return { q: `The 8-bit two's complement numbers $${enc(a)}$ and $${enc(b)}$ are added in an 8-bit adder (carry out discarded). Read as an 8-bit two's complement number, the result is ______ in decimal.`, answer: v, tol: 0, a, b,
          sol: `The inputs are $${a}$ and $${b}$; their true sum is $${a + b}$. The adder keeps 8 bits: $${enc(s)}$, which reads as $${v}$.${over ? ' The true sum is outside $-128$ to $127$: overflow, so the result wraps round by 256.' : ' The true sum is in range, so there is no overflow.'}`,
          trap: 'Reading a pattern with top bit 1 as a positive number, or forgetting the 8-bit wrap-around on overflow.' };
      },
      verify: (p) => { const s = p.a + p.b; return ((s + 128) % 256 + 256) % 256 - 128; } },
    { id: 'dlg-g09', type: 'mcq', level: 3, exams: ['jam'], sub: 'number systems',
      make(r) {
        const n = int(r, 1, 15), g = n ^ (n >> 1);
        const show = (x) => `$${bin(x, 4)}$`;
        const o = mcqOptions(r, g, [n, (~g) & 15, parseInt(bin(g, 4).split('').reverse().join(''), 2), n ^ (n << 1) & 15, (g + 1) & 15], show);
        return { q: `The 4-bit binary number $${bin(n, 4)}$ written in Gray code is`, ...o,
          sol: `Keep the leading bit and XOR each neighbouring pair: $g = b \\oplus (b \\gg 1) = ${bin(n, 4)} \\oplus ${bin(n >> 1, 4)} = ${bin(g, 4)}$.`,
          trap: 'Complementing the bits or leaving the number unchanged.' };
      } },
  ],
};
