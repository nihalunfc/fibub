// Combinational logic at GATE / CSIR NET level: counting Boolean functions (all, self-dual, symmetric), functionally
// complete sets, K-maps with don't-cares, prime and essential prime implicants, cyclic functions, multiplexer and
// decoder realisations, adders (ripple and carry-lookahead delay, generate/propagate), BCD correction, two's-complement
// overflow, Gray code, priority encoders, comparators, static hazards; logic families (noise margins, fan-out,
// CMOS dynamic power, wired-AND). The JAM topic `digital-logic` covers gates, De Morgan, basic K-maps and number
// systems. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';

const an = (n) => ([8, 11, 18].includes(n) ? 'An' : 'A');
const G = ['gate', 'net'];
const VARS = 'ABCD';

// Prime implicants, essential primes and a minimal sum of products (fewest terms, then fewest literals) of an
// n-variable function (n <= 4), by listing every cube. Deterministic; used by the templates below.
export function minimise(n, ones, dc = []) {
  const on = new Set(ones), care = new Set([...ones, ...dc]), N = 1 << n, cubes = [];
  for (let mask = 0; mask < N; mask++) for (let v = 0; v < N; v++) {
    if ((v & ~mask) !== 0) continue;
    let all = true; const cov = [];
    for (let m = 0; m < N; m++) if ((m & mask) === v) { if (!care.has(m)) { all = false; break; } cov.push(m); }
    if (all && cov.some((m) => on.has(m))) cubes.push({ mask, v, cov });
  }
  const primes = cubes.filter((c) => !cubes.some((d) => d !== c && d.cov.length > c.cov.length && c.cov.every((m) => d.cov.includes(m))));
  const ess = primes.filter((p) => p.cov.some((m) => on.has(m) && primes.filter((q) => q.cov.includes(m)).length === 1));
  const lits = (c) => { let k = 0; for (let i = 0; i < n; i++) if ((c.mask >> i) & 1) k++; return k; };
  let best = null;
  for (let k = 0; k <= primes.length && !best; k++) {
    const rec = (start, chosen) => {
      if (chosen.length === k) { const cov = new Set(chosen.flatMap((c) => c.cov)); if (ones.every((m) => cov.has(m))) { const L = chosen.reduce((s, c) => s + lits(c), 0); if (!best || L < best.L) best = { terms: chosen.slice(), L }; } return; }
      for (let i = start; i < primes.length; i++) { chosen.push(primes[i]); rec(i + 1, chosen); chosen.pop(); }
    };
    rec(0, []);
  }
  const name = (c) => { let s = ''; for (let i = 0; i < n; i++) { const b = n - 1 - i; if ((c.mask >> b) & 1) s += VARS[i] + (((c.v >> b) & 1) ? '' : "'"); } return s || '1'; };
  return { primes: primes.map(name), ess: ess.map(name), min: best ? best.terms.map(name) : [], terms: best ? best.terms.length : 0, lits: best ? best.L : 0 };
}
const tex = (s) => s.replace(/([A-D])'/g, "\\bar{$1}");

export default {
  topic: 'combinational-logic',
  items: [
    // ---------- level 1 ----------
    { id: 'cl-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'counting functions',
      q: 'How many different Boolean functions of three variables are there?',
      options: ['8', '64', '256', '512'], answer: 2,
      sol: 'Three variables give $2^3 = 8$ rows in the truth table, and each row can be 0 or 1 independently: $2^8 = 256$ functions. In general $2^{2^n}$.',
      trap: '8 is the number of rows (minterms), not of functions.' },
    { id: 'cl-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'decoders',
      q: 'A binary decoder with 4 input lines (and an enable) has how many output lines?',
      options: ['16', '8', '4', '32'], answer: 0,
      sol: 'An $n$-to-$2^n$ decoder activates exactly one output for each of the $2^n$ input codes: $2^4 = 16$ outputs, each one a minterm of the inputs.',
      trap: 'An encoder goes the other way, from $2^n$ lines to $n$.' },
    { id: 'cl-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'XOR',
      q: 'The value of $A\\oplus\\bar A$ is',
      options: ['0', '$A$', '$\\bar A$', '1'], answer: 3,
      sol: '$A$ and $\\bar A$ always differ, and XOR is 1 exactly when its inputs differ. So $A\\oplus\\bar A = 1$, while $A\\oplus A = 0$.',
      trap: 'Mixing it up with $A\\cdot\\bar A = 0$.' },
    { id: 'cl-004', type: 'nat', level: 1, exams: G, sub: 'multiplexers',
      q: 'A 16:1 multiplexer is built as a tree of 2:1 multiplexers only. The number of 2:1 multiplexers needed is ______.',
      answer: 15, tol: 0, calc: () => 8 + 4 + 2 + 1,
      sol: 'The first level pairs the 16 inputs with 8 multiplexers (select bit $S_0$), then 4, then 2, then 1: $8 + 4 + 2 + 1 = 15 = 2^4 - 1$.',
      trap: 'Answering 4 (the number of select lines) or 8 (only the first level).' },
    { id: 'cl-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'adders',
      q: 'A half adder adds bits $A$ and $B$. Its sum and carry outputs are',
      options: ['sum $A + B$, carry $AB$', 'sum $A\\oplus B$, carry $AB$', 'sum $AB$, carry $A\\oplus B$', 'sum $A\\odot B$, carry $A + B$'], answer: 1,
      sol: '$1 + 1 = 10_2$: the sum bit is 1 only when exactly one input is 1 (XOR), and the carry is 1 only when both are (AND).',
      trap: 'The OR $A + B$ gets $1 + 1$ wrong.' },
    { id: 'cl-006', type: 'msq', level: 1, exams: G, sub: 'functional completeness', format: 'multi',
      q: 'Which of these sets of operations are functionally complete (can build any Boolean function)?',
      options: ['{AND, NOT}', '{OR, NOT}', '{AND, OR}', '{XOR, AND, constant 1}'], answer: [0, 1, 3],
      sol: 'AND and NOT give OR through De Morgan, so {AND, NOT} is complete; likewise {OR, NOT}. With XOR and the constant 1, $A\\oplus1 = \\bar A$, so NOT and AND are available. {AND, OR} alone can only make monotone functions: it can never produce a NOT.',
      trap: 'AND and OR feel like "everything", but without inversion you cannot make $\\bar A$.' },

    // ---------- level 2 ----------
    { id: 'cl-007', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'K-maps',
      q: 'The function $F(A,B,C,D) = \\sum m(0, 2, 8, 10)$ is simplified to a minimal sum of products. The total number of literals in it is ______.',
      answer: 2, tol: 0, calc: () => 2,
      sol: 'The minterms 0000, 0010, 1000, 1010 are the four corners of the K-map. They share $B = 0$ and $D = 0$ while $A$ and $C$ take all values, so $F = \\bar B\\bar D$: two literals.',
      trap: 'Missing that the corners are adjacent (the map wraps around in both directions).' },
    { id: 'cl-008', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'K-maps',
      q: 'The function $F(A,B,C) = \\sum m(1, 3, 5, 7)$ simplifies to',
      options: ['$A$', '$\\bar C$', '$C$', '$AB + C$'], answer: 2,
      sol: 'Minterms 1, 3, 5, 7 are exactly the odd numbers: the last bit $C$ is 1 and $A$, $B$ take all values. So $F = C$.',
      trap: 'Reading the bit order backwards and answering $A$.' },
    { id: 'cl-009', type: 'nat', level: 2, exams: G, sub: 'prime implicants',
      q: 'How many prime implicants does $F(A,B,C) = \\sum m(0, 1, 2, 5, 6, 7)$ have?',
      answer: 6, tol: 0, calc: () => 6,
      sol: 'On the 3-variable K-map the ones form a ring: each 1 has exactly two neighbouring 1s and no group of four exists. The pairs are $\\bar A\\bar B$ (0,1), $\\bar BC$ (1,5), $AC$ (5,7), $AB$ (6,7), $B\\bar C$ (2,6), $\\bar A\\bar C$ (0,2): six prime implicants, none essential. Such a function is called cyclic.',
      trap: 'Counting only the terms of one minimal cover (3).' },
    { id: 'cl-010', type: 'mcq', level: 2, exams: G, sub: 'prime implicants',
      q: 'For the cyclic function $F(A,B,C) = \\sum m(0, 1, 2, 5, 6, 7)$, a minimal sum of products has how many product terms?',
      options: ['2', '3', '4', '6'], answer: 1,
      sol: 'Six ones, and each prime implicant covers two, so at least 3 terms are needed; 3 suffice, for example $\\bar BC + \\bar A\\bar C + AB$ (or the other alternate set $\\bar A\\bar B + B\\bar C + AC$). Two minimal answers exist, both with 3 terms and 6 literals.',
      trap: 'Using all six prime implicants.' },
    { id: 'cl-011', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'adders',
      q: 'The carry output of a full adder with inputs $A$, $B$ and carry-in $C_i$ can be written as',
      options: ['$A\\oplus B\\oplus C_i$', '$AB\\,C_i$', '$A + B + C_i$', '$AB + C_i(A\\oplus B)$'], answer: 3,
      sol: 'A carry comes out when at least two inputs are 1: $AB + BC_i + AC_i$, the majority function. Grouping: either $A$ and $B$ both generate it ($AB$), or exactly one of them is 1 and propagates the incoming carry ($C_i(A\\oplus B)$). The two forms are equal.',
      trap: '$A\\oplus B\\oplus C_i$ is the sum output.' },
    { id: 'cl-012', type: 'nat', level: 2, exams: G, sub: 'adder delay', unit: 'ns',
      q: 'A 4-bit ripple-carry adder uses full adders whose carry output settles 2 ns after its inputs and whose sum output settles 3 ns after its inputs. With all inputs applied at $t = 0$, the most significant sum bit is guaranteed correct after ______ ns.',
      answer: 9, tol: 0, calc: () => 3 * 2 + 3,
      sol: 'The carry ripples through the first three stages: $3\\times2 = 6$ ns until the carry into the last stage is correct. That stage then needs 3 ns for its sum: $6 + 3 = 9$ ns.',
      trap: 'Counting four carry delays plus a sum delay (11 ns): the last stage\'s carry-out is not needed for its own sum.' },
    { id: 'cl-013', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: "two's complement",
      q: 'The 8-bit two\'s-complement number 1111 1011 represents',
      options: ['251', '$-4$', '$-5$', '$-123$'], answer: 2,
      sol: 'The sign bit is 1, so the value is negative. Invert and add 1: $0000\\,0100 + 1 = 0000\\,0101 = 5$. The number is $-5$. (Unsigned it would be 251 $= 256 - 5$.)',
      trap: '$-123$ reads it as sign-magnitude.' },
    { id: 'cl-014', type: 'msq', level: 2, exams: G, sub: 'XOR', format: 'multi',
      q: 'Which identities hold for the exclusive-OR operation?',
      options: ['$(A\\oplus B)\\oplus C = A\\oplus(B\\oplus C)$', '$A\\oplus B\\oplus B = A$', '$A\\oplus1 = \\bar A$', '$A\\oplus(BC) = (A\\oplus B)(A\\oplus C)$'], answer: [0, 1, 2],
      sol: 'XOR is addition modulo 2: associative, $B\\oplus B = 0$, and adding 1 flips a bit. The last identity fails for $A = 1$, $B = 1$, $C = 0$: left side $1\\oplus0 = 1$, right side $0\\cdot1 = 0$. (AND does distribute over XOR: $A(B\\oplus C) = AB\\oplus AC$.)',
      trap: 'Distributivity works one way only: AND over XOR, not XOR over AND.' },
    { id: 'cl-015', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Gray code',
      q: 'The 4-bit Gray code for the binary number 1011 is',
      options: ['1101', '1110', '0111', '1011'], answer: 1,
      sol: 'Keep the first bit and XOR each pair of neighbouring bits: $g_3 = 1$, $g_2 = 1\\oplus0 = 1$, $g_1 = 0\\oplus1 = 1$, $g_0 = 1\\oplus1 = 0$. Gray code 1110. Successive Gray codes differ in one bit, which is why shaft encoders and K-map axes use it.',
      trap: 'XORing with the wrong neighbour (shifting the other way).' },
    { id: 'cl-016', type: 'nat', level: 2, exams: G, sub: 'BCD',
      q: 'The decimal numbers 47 and 38 are added in BCD with 4-bit binary adders. In how many of the two digit positions must the correction "add 0110" be applied?',
      answer: 1, tol: 0, calc: () => 1,
      sol: 'Units: $7 + 8 = 15 = 1111_2$, more than 9, so add 0110: $1\\,0101$, digit 5 with a carry. Tens: $4 + 3 + 1 = 8$, valid, no correction. Result 85, with one correction.',
      trap: 'Forgetting the carry into the tens digit, or correcting a valid digit.' },

    // ---------- level 3 ----------
    { id: 'cl-017', type: 'nat', level: 3, exams: G, sub: 'K-maps',
      q: 'The minimal sum-of-products form of $F(A,B,C,D) = \\sum m(0, 2, 5, 7, 8, 10, 13, 15)$ contains ______ literals in total.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'Minterms 0, 2, 8, 10 are the four corners: $\\bar B\\bar D$. Minterms 5, 7, 13, 15 form the central square: $BD$. So $F = \\bar B\\bar D + BD = \\overline{B\\oplus D}$, 4 literals. $A$ and $C$ do not matter at all.',
      trap: 'Grouping in pairs instead of quads gives 12 literals.' },
    { id: 'cl-018', type: 'mcq', level: 3, exams: G, sub: "don't cares",
      q: 'A minimal sum-of-products form of $F(A,B,C,D) = \\sum m(1, 3, 7, 11, 15) + d(0, 2, 5)$ is',
      options: ['$CD + \\bar A\\bar B$', '$CD + \\bar A\\bar BD$', '$\\bar A\\bar B\\bar CD + CD$', '$D$'], answer: 0,
      sol: '$CD$ covers 3, 7, 11, 15 (an essential prime). Minterm 1 is left. Using the don\'t-cares 0 and 2, the quad $\\bar A\\bar B$ (0, 1, 2, 3) covers it with two literals. ($\\bar AD$, using don\'t-care 5, is an equally small alternative.) $D$ alone would include 9 and 13, which must be 0.',
      trap: 'Not using don\'t-cares to enlarge a group, or using a don\'t-care to include a real 0.' },
    { id: 'cl-019', type: 'mcq', level: 3, exams: G, sub: "don't cares",
      q: 'The minimal sum of products of $F(A,B,C,D) = \\sum m(2, 3, 7, 9, 11, 13) + d(1, 10, 15)$ is',
      options: ['$CD + \\bar BC + AD$', '$CD + \\bar BD + AD$', '$\\bar BC + AD$', '$CD + \\bar BC + A\\bar CD$'], answer: 0,
      sol: 'Prime implicants (with the don\'t-cares): $CD$ (3, 7, 11, 15), $\\bar BC$ (2, 3, 10, 11), $AD$ (9, 11, 13, 15) and $\\bar BD$ (1, 3, 9, 11). Minterm 7 is covered only by $CD$, 2 only by $\\bar BC$, and 13 only by $AD$: all three are essential and together cover everything. $F = CD + \\bar BC + AD$.',
      trap: '$\\bar BD$ is a prime implicant but not needed; dropping $CD$ leaves 7 uncovered.' },
    { id: 'cl-020', type: 'mcq', level: 3, exams: G, sub: 'multiplexers',
      q: 'A 4:1 multiplexer has select lines $A$ (most significant) and $B$; its data inputs are $I_0 = C$, $I_1 = \\bar C$, $I_2 = 0$, $I_3 = 1$. The function it realises is',
      options: ['$\\sum m(1, 2, 6, 7)$', '$\\sum m(0, 3, 6, 7)$', '$\\sum m(1, 2, 4, 5)$', '$\\sum m(1, 3, 6, 7)$'], answer: 0,
      sol: '$F = \\bar A\\bar B\\,C + \\bar AB\\,\\bar C + A\\bar B\\cdot0 + AB\\cdot1$. In minterms of $ABC$: $\\bar A\\bar BC = 001 = 1$; $\\bar AB\\bar C = 010 = 2$; $AB$ gives 110 and 111 = 6, 7. So $\\sum m(1, 2, 6, 7)$.',
      trap: 'Swapping $C$ and $\\bar C$ on the first two inputs gives $\\sum m(0, 3, 6, 7)$.' },
    { id: 'cl-021', type: 'mcq', level: 3, exams: G, sub: 'decoders',
      q: 'A 3-to-8 decoder has its outputs 1, 2, 4 and 7 joined by an OR gate. The resulting function of the inputs $A$, $B$, $C$ is',
      options: ['$AB + BC + CA$', '$\\overline{A\\oplus B\\oplus C}$', '$A\\oplus B\\oplus C$', '$\\bar A\\bar B\\bar C$'], answer: 2,
      sol: 'Each decoder output is a minterm, so the OR gives $\\sum m(1, 2, 4, 7)$: inputs 001, 010, 100, 111, exactly those with an odd number of ones. That is odd parity, $A\\oplus B\\oplus C$ (the full-adder sum).',
      trap: 'The majority function (carry) is $\\sum m(3, 5, 6, 7)$.' },
    { id: 'cl-022', type: 'msq', level: 3, exams: G, sub: 'hazards', format: 'multi',
      q: 'The circuit for $F = AB + \\bar AC$ is built from AND gates and an OR gate, with an inverter making $\\bar A$. Which statements are correct?',
      options: ['With $B = C = 1$, a change of $A$ can produce a brief 0 glitch at the output (a static-1 hazard)', 'Adding the consensus term $BC$ removes this hazard', 'The glitch arises because $A$ and $\\bar A$ reach the OR gate through paths of different delay', 'Reducing the expression to fewer terms is the standard cure for hazards'], answer: [0, 1, 2],
      sol: 'With $B = C = 1$, $F = A + \\bar A = 1$ in theory. But when $A$ falls, the $AB$ term may drop before the $\\bar AC$ term rises (the inverter adds delay): a momentary 0. The redundant consensus term $BC$ stays 1 throughout and holds the output. Hazard-free design adds terms; it does not remove them.',
      trap: 'A minimal expression is not necessarily glitch-free.' },
    { id: 'cl-023', type: 'nat', level: 3, exams: G, sub: 'carry lookahead',
      q: 'In a carry-lookahead adder adding $A = 1011$ and $B = 0110$, each bit has propagate $P_i = A_i\\oplus B_i$ and generate $G_i = A_iB_i$. The number of bit positions with $P_i = 1$ is ______.',
      answer: 3, tol: 0, calc: () => (0b1011 ^ 0b0110).toString(2).split('').filter((c) => c === '1').length,
      sol: '$P = 1011\\oplus0110 = 1101$: three positions propagate. $G = 1011\\cdot0110 = 0010$: bit 1 generates. Then $C_2 = G_1 = 1$, $C_3 = P_2C_2 = 1$, $C_4 = P_3C_3 = 1$: the sum is $1\\,0001$ (11 + 6 = 17).',
      trap: 'Using OR for propagate is also allowed for carries, but then the count would be 4.' },
    { id: 'cl-024', type: 'nat', level: 3, exams: G, sub: 'CMOS power', unit: 'W',
      q: 'A CMOS chip has $10^6$ gates, each switching an average load of $50$ fF, with activity factor $0.1$ (fraction of gates switching per cycle), at $1.0$ V and $1$ GHz. Its dynamic power is ______ W.',
      answer: 5, tol: 0.01, calc: () => 1e6 * 0.1 * 50e-15 * 1 ** 2 * 1e9,
      sol: 'Each switching event charges and discharges $C$ through the transistors, costing $CV^2$ per cycle. $P = N\\alpha CV^2f = 10^6\\times0.1\\times50\\times10^{-15}\\times1\\times10^9 = 5$ W. Halving the voltage would quarter it.',
      trap: 'Using $\\tfrac12CV^2$ (the energy stored) instead of $CV^2$ (energy drawn from the supply per full cycle).' },
    { id: 'cl-025', type: 'mcq', level: 3, exams: G, sub: 'noise margins',
      q: 'A logic family has $V_{OH(min)} = 2.4$ V, $V_{OL(max)} = 0.4$ V, $V_{IH(min)} = 2.0$ V and $V_{IL(max)} = 0.8$ V. Its high and low noise margins are',
      options: ['both 0.4 V', 'high 0.4 V, low 0.8 V', 'high 2.0 V, low 0.4 V', 'both 1.2 V'], answer: 0,
      sol: '$NM_H = V_{OH} - V_{IH} = 2.4 - 2.0 = 0.4$ V; $NM_L = V_{IL} - V_{OL} = 0.8 - 0.4 = 0.4$ V. Noise smaller than this cannot turn a valid output into an invalid input.',
      trap: 'Subtracting output from output or input from input.' },
    { id: 'cl-026', type: 'nat', level: 3, exams: G, sub: 'counting functions',
      q: 'A Boolean function is self-dual if it equals its dual: $f(\\bar x_1, \\ldots, \\bar x_n) = \\overline{f(x_1, \\ldots, x_n)}$. The number of self-dual functions of 3 variables is ______.',
      answer: 16, tol: 0, calc: () => 2 ** (2 ** 2),
      sol: 'The 8 input rows pair up as $x$ and its complement $\\bar x$ (4 pairs). Choosing $f$ on one row of a pair fixes it on the other. So there are $2^4 = 16$ self-dual functions, $2^{2^{n-1}}$ in general.',
      trap: 'Answering $2^8 = 256$ (all functions) or 8.' },
    { id: 'cl-027', type: 'mcq', level: 3, exams: G, sub: 'encoders',
      q: 'A 4-to-2 priority encoder gives input $D_3$ the highest priority. With $D_3D_2D_1D_0 = 0110$, its output $Y_1Y_0$ is',
      options: ['01', '11', '00', '10'], answer: 3,
      sol: 'The highest-priority active input is $D_2$ (since $D_3 = 0$), so the output is the code of 2: $Y_1Y_0 = 10$. $D_1$ is ignored. A valid-output flag distinguishes "$D_0$ active" from "nothing active".',
      trap: 'Encoding the lowest active input (01).' },
    { id: 'cl-028', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: "two's complement",
      q: 'Two signed numbers, $+100$ and $+50$, are added in an 8-bit two\'s-complement adder. Read as a signed number, the 8-bit result is ______.',
      answer: -106, tol: 0, calc: () => ((100 + 50) & 0xff) - 256,
      sol: '$100 + 50 = 150 = 1001\\,0110_2$. As an 8-bit signed value the leading 1 makes it negative: $150 - 256 = -106$. Overflow: two positives gave a negative (the carry into the sign bit differs from the carry out).',
      trap: 'Answering 150: it does not fit in the range $-128$ to $+127$.' },

    // ---------- level 4 ----------
    { id: 'cl-029', type: 'nat', level: 4, exams: G, sub: 'prime implicants',
      q: 'The function $F(A,B,C,D) = \\sum m(0, 1, 2, 5, 6, 7, 8, 9, 10, 13, 14, 15)$ has how many prime implicants?',
      answer: 6, tol: 0, calc: () => 6,
      sol: 'The zeros are 3, 4, 11, 12. Quads of ones: $\\bar C D$ (1, 5, 9, 13), $C\\bar D$ (2, 6, 10, 14), $\\bar B\\bar D$ (0, 2, 8, 10), $BD$ (5, 7, 13, 15), $\\bar B\\bar C$ (0, 1, 8, 9), $BC$ (6, 7, 14, 15). Every 1 lies in exactly two of them and no octet fits, so there are 6 primes, none essential. A minimal cover needs 3, e.g. $\\bar CD + \\bar B\\bar D + BC$.',
      trap: 'Stopping at the three terms of one minimal cover.' },
    { id: 'cl-030', type: 'mcq', level: 4, exams: G, sub: 'multiplexers',
      q: 'The even-parity function of four bits, $F = \\sum m(0, 3, 5, 6, 9, 10, 12, 15)$, is built with an 8:1 multiplexer whose selects are $A, B, C$ ($A$ most significant). The data inputs $I_0$ to $I_7$ must be',
      options: ['$D, \\bar D, \\bar D, D, \\bar D, D, D, \\bar D$', '$\\bar D, D, D, \\bar D, D, \\bar D, \\bar D, D$', '$0, 1, 1, 0, 1, 0, 0, 1$', '$\\bar D, D, \\bar D, D, \\bar D, D, \\bar D, D$'], answer: 1,
      sol: 'For each $ABC$, $F$ must be 1 when $ABCD$ has an even number of ones. If $ABC$ already has even parity (000, 011, 101, 110), $D$ must be 0: $I = \\bar D$. If odd (001, 010, 100, 111), $D$ must be 1: $I = D$. So $I_0..I_7 = \\bar D, D, D, \\bar D, D, \\bar D, \\bar D, D$.',
      trap: 'The first option is the odd-parity function.' },
    { id: 'cl-031', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'universal gates',
      q: 'Using only 2-input NAND gates, the smallest number needed to make a 2-input XOR is ______.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'Let $N = \\overline{AB}$. Then $\\overline{AN} = \\overline{A\\,\\overline{AB}}$ and $\\overline{BN}$, and a final NAND gives $\\overline{\\overline{AN}\\,\\overline{BN}} = AN + BN = (A + B)\\overline{AB} = A\\oplus B$. Four gates; sharing $N$ is the trick (the straightforward version needs 5).',
      trap: 'Building $\\bar A$ and $\\bar B$ separately costs extra gates.' },
    { id: 'cl-032', type: 'msq', level: 4, exams: G, sub: 'decoders', format: 'multi',
      q: 'Which statements about binary decoders are correct?',
      options: ['A decoder with an enable input can be used as a demultiplexer', 'Any function of $n$ variables can be made with one $n$-to-$2^n$ decoder and one OR gate', 'Two 3-to-8 decoders with enable inputs (and an inverter) make a 4-to-16 decoder', 'Each output of a decoder is active for two different input codes'], answer: [0, 1, 2],
      sol: 'Feed the data into the enable and the select code into the inputs, and the data appears on the selected output: a demultiplexer. Outputs are minterms, so ORing the right ones gives any function. The fourth input drives one decoder\'s enable directly and the other\'s through an inverter. Each output responds to exactly one code.',
      trap: 'A decoder output is a single minterm, never two.' },
    { id: 'cl-033', type: 'nat', level: 4, exams: G, sub: 'comparators',
      q: 'A 2-bit magnitude comparator compares $A = A_1A_0$ with $B = B_1B_0$. For how many of the 16 input combinations is its output $A > B$ equal to 1?',
      answer: 6, tol: 0, calc: () => { let k = 0; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) if (a > b) k++; return k; },
      sol: 'Of the 16 pairs, 4 have $A = B$ and the other 12 split equally between $A > B$ and $A < B$: 6. Explicitly $A = 1$: 1 pair; $A = 2$: 2; $A = 3$: 3; total 6.',
      trap: 'Answering 8, as if half the combinations.' },
    { id: 'cl-034', type: 'mcq', level: 4, exams: G, sub: 'logic families',
      q: 'The outputs of several open-collector (open-drain) gates are joined and returned to $V_{CC}$ through one pull-up resistor. In positive logic the joined line gives',
      options: ['a wired-OR of the outputs', 'a wired-AND of the outputs', 'the XOR of the outputs', 'a short circuit whenever outputs differ'], answer: 1,
      sol: 'Any gate whose output transistor is on pulls the line low. The line is high only if every output is high (all transistors off): a wired-AND. Totem-pole outputs must never be joined like this, because a high and a low output would short the supply.',
      trap: 'The danger of shorting belongs to totem-pole outputs, not open-collector ones.' },
    { id: 'cl-035', type: 'nat', level: 4, exams: G, sub: 'adder delay',
      q: 'In a 32-bit ripple-carry adder each carry stage takes 2 gate delays. A carry-lookahead block computes a carry from $P_i$, $G_i$ and $C_0$ in 2 gate delays after $P_i$ and $G_i$ are ready (1 gate delay). The ripple adder\'s final carry $C_{32}$ takes ______ gate delays.',
      answer: 64, tol: 0, calc: () => 32 * 2,
      sol: 'Each of the 32 stages must wait for the carry from the one below: $32\\times2 = 64$ gate delays. A full single-level lookahead would give any carry after $1 + 2 = 3$ gate delays (with very wide gates), which is why practical adders use groups of 4 with a second lookahead level.',
      trap: 'Mixing up the lookahead figure (3) with the ripple figure.' },
    { id: 'cl-036', type: 'nat', level: 4, exams: G, sub: 'counting functions',
      q: 'How many Boolean functions of 4 variables have $f(0000) = 0$ and $f(1111) = 1$?',
      answer: 16384, tol: 0, calc: () => 2 ** 14,
      sol: 'There are 16 truth-table rows. Two are fixed; the other 14 are free: $2^{14} = 16384$.',
      trap: 'Subtracting instead: $2^{16} - 2$.' },

    // ---------- level 5 ----------
    { id: 'cl-037', type: 'nat', level: 5, exams: G, sub: 'prime implicants',
      q: 'The function $F(A,B,C,D) = \\sum m(0, 1, 5, 7, 8, 10, 14, 15)$ has how many prime implicants?',
      answer: 8, tol: 0, calc: () => 8,
      sol: 'No quads exist (check each candidate: every group of four includes a 0). The pairs that are prime: $\\bar B\\bar C\\bar D$ (0, 8), $\\bar A\\bar B\\bar C$ (0, 1), $\\bar A\\bar CD$ (1, 5), $\\bar ABD$ (5, 7), $BCD$ (7, 15), $ABC$ (14, 15), $AC\\bar D$ (10, 14), $A\\bar B\\bar D$ (8, 10). Eight primes in a ring, none essential; a minimal cover takes 4 of them (12 literals).',
      trap: 'Missing the wrap-around pair (0, 8).' },
    { id: 'cl-038', type: 'msq', level: 5, exams: G, sub: 'prime implicants', format: 'multi',
      q: 'For $F(A,B,C,D) = \\sum m(0, 4, 5, 7, 8, 9, 13, 15)$, which statements are correct?',
      options: ['$BD$ is an essential prime implicant', 'There are exactly six prime implicants', 'A minimal sum of products has three product terms', 'A minimal sum of products has two product terms'], answer: [0, 1, 2],
      sol: 'Primes: $BD$ (5, 7, 13, 15), and the pairs $\\bar B\\bar C\\bar D$ (0, 8), $\\bar A\\bar C\\bar D$ (0, 4), $A\\bar CD$ (9, 13), $\\bar AB\\bar C$ (4, 5), $A\\bar B\\bar C$ (8, 9): six. Minterm 7 lies only in $BD$, so it is essential. The remaining 0, 4, 8, 9 need two more pairs, e.g. $\\bar A\\bar C\\bar D + A\\bar B\\bar C$: three terms in all.',
      trap: 'Thinking 0, 4, 8, 9 can be one quad: they are not a rectangle on the map.' },
    { id: 'cl-039', type: 'nat', level: 5, exams: G, sub: 'counting functions',
      q: 'A Boolean function is symmetric if its value depends only on how many of its inputs are 1. The number of symmetric functions of 4 variables is ______.',
      answer: 32, tol: 0, calc: () => 2 ** 5,
      sol: 'The number of ones can be 0, 1, 2, 3 or 4: five classes, and the function picks 0 or 1 for each: $2^5 = 32$. Parity, majority and AND/OR of all inputs are examples.',
      trap: 'Counting $2^4 = 16$ (forgetting the class with zero ones).' },
    { id: 'cl-040', type: 'mcq', level: 5, exams: G, sub: 'duality',
      q: 'Which of these functions is self-dual (equal to its own dual)?',
      options: ['$AB$', '$A + B$', '$A\\oplus B$', '$AB + BC + CA$'], answer: 3,
      sol: 'The dual swaps AND with OR. The dual of $AB + BC + CA$ is $(A + B)(B + C)(C + A)$, which expands back to $AB + BC + CA$: the majority function is self-dual. The dual of $AB$ is $A + B$ (and vice versa), and the dual of $A\\oplus B = A\\bar B + \\bar AB$ is $(A + \\bar B)(\\bar A + B) = \\overline{A\\oplus B}$.',
      trap: 'Thinking XOR is self-dual because it is symmetric.' },
  ],
  gens: [
    { id: 'cl-g01', type: 'nat', level: 3, exams: G, sub: 'K-maps',
      make(r) {
        const ones = []; for (let m = 0; m < 16; m++) if (r() < 0.45) ones.push(m);
        if (!ones.length) ones.push(int(r, 0, 15));
        const res = minimise(4, ones), ask = choose(r, ['terms', 'primes', 'ess']);
        const val = ask === 'terms' ? res.terms : ask === 'primes' ? res.primes.length : res.ess.length;
        const what = ask === 'terms' ? 'The number of product terms in a minimal sum of products is' : ask === 'primes' ? 'The number of prime implicants is' : 'The number of essential prime implicants is';
        return { q: `For $F(A,B,C,D) = \\sum m(${ones.join(', ')})$: ${what} ______.`, answer: val, tol: 0, ones, ask,
          sol: `Prime implicants: $${res.primes.map(tex).join(',\\ ')}$ (${res.primes.length}). Essential (the only prime covering some minterm): ${res.ess.length ? `$${res.ess.map(tex).join(',\\ ')}$` : 'none'}. A minimal cover: $F = ${res.min.map(tex).join(' + ')}$ (${res.terms} terms, ${res.lits} literals). Asked: ${val}.`,
          trap: 'Forgetting that the K-map wraps around (corners and edges are adjacent).' };
      },
      verify: (p) => { const res = minimise(4, p.ones); return p.ask === 'terms' ? res.terms : p.ask === 'primes' ? res.primes.length : res.ess.length; } },
    { id: 'cl-g02', type: 'mcq', level: 3, exams: G, sub: 'multiplexers',
      make(r) {
        const ins = [0, 1, 2, 3].map(() => choose(r, ['0', '1', 'C', "C'"]));
        const f = []; for (let m = 0; m < 8; m++) { const ab = m >> 1, c = m & 1, i = ins[ab]; const v = i === '0' ? 0 : i === '1' ? 1 : i === 'C' ? c : 1 - c; if (v) f.push(m); }
        const flip = (x) => (x === 'C' ? "C'" : x === "C'" ? 'C' : x);
        const alt = (insX) => { const g = []; for (let m = 0; m < 8; m++) { const i = insX[m >> 1], c = m & 1; if (i === '0' ? 0 : i === '1' ? 1 : i === 'C' ? c : 1 - c) g.push(m); } return g; };
        const srt = (l) => [...new Set(l)].sort((x, y) => x - y);
        const wr = [alt(ins.map(flip)), alt([ins[0], ins[2], ins[1], ins[3]]), alt(ins.map((x) => (x === '0' ? '1' : x === '1' ? '0' : x))), f.map((m) => m ^ 4), f.map((m) => m ^ 2), f.map((m) => m ^ 1), [0, 1, 2, 3, 4, 5, 6, 7].filter((m) => !f.includes(m)), f.slice(1), [7], [0, 7], [3, 5, 6], f.concat([0, 1, 2, 3, 4, 5, 6, 7].filter((m) => !f.includes(m)).slice(0, 1))].map(srt);
        const show = (l) => (l.length ? `$\\sum m(${l.join(', ')})$` : '$F = 0$');
        const o = mcqOptions(r, show(f), wr.map(show));
        return { q: `A 4:1 multiplexer has select lines $A$ (most significant) and $B$, and data inputs $I_0 = ${tex(ins[0])}$, $I_1 = ${tex(ins[1])}$, $I_2 = ${tex(ins[2])}$, $I_3 = ${tex(ins[3])}$. As a function of $A, B, C$ it realises`, ...o,
          sol: `$F = \\bar A\\bar B\\,I_0 + \\bar AB\\,I_1 + A\\bar B\\,I_2 + AB\\,I_3$. For each select pair, an input of 1 adds both minterms, $C$ adds the odd one, $\\bar C$ the even one, 0 neither. Result: ${show(f)}.`,
          trap: 'Taking $B$ as the most significant select line, or swapping $C$ and $\\bar C$.' };
      } },
    { id: 'cl-g03', type: 'nat', level: 2, exams: G, sub: 'multiplexers',
      make(r) {
        const n = int(r, 2, 6), kind = choose(r, ['mux', 'dec', 'muxk']);
        const k = kind === 'muxk' ? choose(r, [2, 4].filter((x) => x < 2 ** n)) : 2;
        let val, q, sol;
        if (kind === 'mux') { val = 2 ** n - 1; q = `A $${2 ** n}$:1 multiplexer is built as a tree of 2:1 multiplexers. The number of 2:1 multiplexers needed is ______.`; sol = `Each level halves the number of signals: $${2 ** (n - 1)} + \\ldots + 1 = 2^{${n}} - 1 = ${val}$.`; }
        else if (kind === 'dec') { val = 2 ** n; q = `A decoder has ${n} input lines. The number of distinct minterms (output lines) it provides is ______.`; sol = `An $n$-to-$2^n$ decoder has one output per input code: $2^{${n}} = ${val}$.`; }
        else { const levels = Math.ceil(n / Math.log2(k)); let tot = 0, cnt = 2 ** n; while (cnt > 1) { cnt = Math.ceil(cnt / k); tot += cnt; } val = tot; q = `A $${2 ** n}$:1 multiplexer is built as a tree of ${k}:1 multiplexers. The number of ${k}:1 multiplexers needed is ______.`; sol = `Each level divides the number of signals by ${k} (rounding up): the counts per level add to ${val} over ${levels} levels.`; }
        return { q, answer: val, tol: 0, n, kind, k, sol, trap: 'Counting only the first level of the tree.' };
      },
      verify: (p) => { if (p.kind === 'mux') return 2 ** p.n - 1; if (p.kind === 'dec') return 2 ** p.n; let t = 0, c = 2 ** p.n; while (c > 1) { c = Math.ceil(c / p.k); t += c; } return t; } },
    { id: 'cl-g04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: "two's complement",
      make(r) {
        const bits = choose(r, [4, 6, 8]), lim = 2 ** (bits - 1), a = int(r, -lim, lim - 1), b = int(r, -lim, lim - 1), op = r() < 0.5 ? '+' : '-';
        const raw = op === '+' ? a + b : a - b, wrapped = ((raw % 2 ** bits) + 2 ** bits) % 2 ** bits, val = wrapped >= lim ? wrapped - 2 ** bits : wrapped;
        return { q: `Two signed numbers, $${a}$ and $${b}$, are stored in ${bits}-bit two\'s complement and the adder computes $${a} ${op} (${b})$, keeping ${bits} bits. Read as a signed number, the result is ______.`,
          answer: val, tol: 0, bits, a, b, op,
          sol: `The true result is $${raw}$. The ${bits}-bit range is $${-lim}$ to $${lim - 1}$; the hardware keeps the result modulo $2^{${bits}} = ${2 ** bits}$, giving the pattern of $${wrapped}$, which as a signed number is $${val}$. ${val === raw ? 'No overflow.' : 'Overflow: the true result does not fit.'}`,
          trap: 'Giving the true result when it lies outside the representable range.' };
      },
      verify: (p) => { const raw = p.op === '+' ? p.a + p.b : p.a - p.b, M = 2 ** p.bits, w = ((raw % M) + M) % M; return w >= M / 2 ? w - M : w; } },
    { id: 'cl-g05', type: 'nat', level: 3, exams: G, sub: 'CMOS power',
      make(r) {
        const N = choose(r, [1e5, 1e6, 1e7]), C = pick(r, 5, 100, 5), a = choose(r, [0.05, 0.1, 0.15, 0.2, 0.25]), V = pick(r, 0.6, 3.3, 0.1), f = choose(r, [100, 200, 500, 1000, 2000]);
        const P = N * a * C * 1e-15 * V * V * f * 1e6;
        return { q: `A CMOS circuit has $${N}$ gates of average load $${C}$ fF and activity factor $${a}$, running at $${V}$ V and $${f}$ MHz. Its dynamic power is ______ W (to three decimal places).`,
          answer: round(P, 3), tol: Math.max(0.001, round(P * 0.003, 3)), unit: 'W', N, C, a, V, f,
          sol: `$P = N\\alpha CV^2f = ${N}\\times${a}\\times${C}\\times10^{-15}\\times${V}^2\\times${f}\\times10^6 = ${round(P, 3)}$ W.`,
          trap: 'Forgetting to square the voltage.' };
      },
      verify: (p) => p.N * p.a * p.C * 1e-15 * p.V ** 2 * p.f * 1e6 },
    { id: 'cl-g06', type: 'nat', level: 2, exams: G, sub: 'noise margins',
      make(r) {
        const VOH = pick(r, 2.4, 4.9, 0.1), VIH = round(VOH - pick(r, 0.1, 1, 0.1), 2), VOL = pick(r, 0.05, 0.5, 0.05), VIL = round(VOL + pick(r, 0.2, 1.2, 0.1), 2), ask = r() < 0.5 ? 'H' : 'L';
        const val = ask === 'H' ? VOH - VIH : VIL - VOL;
        return { q: `A logic family has $V_{OH} = ${VOH}$ V, $V_{IH} = ${VIH}$ V, $V_{IL} = ${VIL}$ V and $V_{OL} = ${VOL}$ V. Its ${ask === 'H' ? 'high' : 'low'}-level noise margin is ______ V (to two decimal places).`,
          answer: round(val, 2), tol: 0.005, unit: 'V', VOH, VIH, VOL, VIL, ask,
          sol: `$NM_H = V_{OH} - V_{IH} = ${round(VOH - VIH, 2)}$ V; $NM_L = V_{IL} - V_{OL} = ${round(VIL - VOL, 2)}$ V.`,
          trap: 'Subtracting the wrong pair (always output minus input for high, input minus output for low).' };
      },
      verify: (p) => (p.ask === 'H' ? p.VOH - p.VIH : p.VIL - p.VOL) },
    { id: 'cl-g07', type: 'nat', level: 3, exams: G, sub: 'counting functions',
      make(r) {
        const n = int(r, 2, 4), kind = choose(r, ['all', 'self', 'sym', 'fix0', 'fix2']);
        const val = kind === 'all' ? 2 ** (2 ** n) : kind === 'self' ? 2 ** (2 ** (n - 1)) : kind === 'sym' ? 2 ** (n + 1) : kind === 'fix0' ? 2 ** (2 ** n - 1) : 2 ** (2 ** n - 2);
        const what = kind === 'all' ? 'Boolean functions of' : kind === 'self' ? 'self-dual Boolean functions of' : kind === 'sym' ? 'symmetric Boolean functions (value depends only on the number of 1 inputs) of' : kind === 'fix0' ? 'Boolean functions with $f = 0$ when all inputs are 0, of' : 'Boolean functions with $f = 0$ for all-zero inputs and $f = 1$ for all-one inputs, of';
        return { q: `How many ${what} ${n} variables are there?`, answer: val, tol: 0, n, kind,
          sol: kind === 'all' ? `$2^n = ${2 ** n}$ rows, each free: $2^{${2 ** n}} = ${val}$.` : kind === 'self' ? `Rows pair with their complements ($2^{n-1} = ${2 ** (n - 1)}$ pairs); one free choice per pair: $2^{${2 ** (n - 1)}} = ${val}$.` : kind === 'sym' ? `The number of ones takes $n + 1 = ${n + 1}$ values, each mapped to 0 or 1: $2^{${n + 1}} = ${val}$.` : kind === 'fix0' ? `One row fixed, $${2 ** n - 1}$ free: $2^{${2 ** n - 1}} = ${val}$.` : `Two rows fixed, $${2 ** n - 2}$ free: $2^{${2 ** n - 2}} = ${val}$.`,
          trap: 'Confusing the number of rows ($2^n$) with the number of functions ($2^{2^n}$).' };
      },
      verify: (p) => (p.kind === 'all' ? 2 ** (2 ** p.n) : p.kind === 'self' ? 2 ** (2 ** (p.n - 1)) : p.kind === 'sym' ? 2 ** (p.n + 1) : p.kind === 'fix0' ? 2 ** (2 ** p.n - 1) : 2 ** (2 ** p.n - 2)) },
    { id: 'cl-g08', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Gray code',
      make(r) {
        const bits = choose(r, [4, 5, 6]), x = int(r, 1, 2 ** bits - 1), toGray = r() < 0.6;
        const gray = x ^ (x >> 1);
        let bin = x; if (!toGray) { bin = 0; for (let g = x; g; g >>= 1) bin ^= g; }
        const val = toGray ? gray : bin, s = (v) => v.toString(2).padStart(bits, '0');
        return { q: toGray ? `The ${bits}-bit binary number ${s(x)} is converted to Gray code. Read as an ordinary binary number, the Gray code word has the decimal value ______.` : `The ${bits}-bit Gray code word ${s(x)} is converted back to binary. The binary number is ______ in decimal.`,
          answer: val, tol: 0, x, bits, toGray,
          sol: toGray ? `Gray $= b\\oplus(b \\gg 1)$: ${s(x)} XOR ${s(x >> 1)} = ${s(gray)}, which is ${gray} in decimal.` : `Binary bit $b_i = g_{n-1}\\oplus\\ldots\\oplus g_i$ (running XOR from the left): ${s(x)} becomes ${s(bin)} $= ${bin}$.`,
          trap: toGray ? 'Shifting the wrong way before the XOR.' : 'XORing neighbouring Gray bits (that converts binary to Gray, not back).' };
      },
      verify: (p) => { if (p.toGray) return p.x ^ (p.x >> 1); let b = 0; for (let g = p.x; g; g >>= 1) b ^= g; return b; } },
    { id: 'cl-g09', type: 'nat', level: 3, exams: G, sub: 'logic families',
      make(r) {
        const IOH = choose(r, [0.4, 0.8, 1, 2, 4]), IIH = choose(r, [0.02, 0.04, 0.05]), IOL = choose(r, [8, 16, 20, 24]), IIL = choose(r, [0.1, 0.4, 1, 1.6]);
        const hi = Math.floor(IOH / IIH + 1e-9), lo = Math.floor(IOL / IIL + 1e-9), fo = Math.min(hi, lo);
        return { q: `A gate can source $${IOH}$ mA when high and sink $${IOL}$ mA when low. Each input it drives needs $${IIH}$ mA when high and $${IIL}$ mA when low. Its fan-out is ______.`,
          answer: fo, tol: 0, IOH, IIH, IOL, IIL,
          sol: `High state: $${IOH}/${IIH} = ${hi}$ inputs. Low state: $${IOL}/${IIL} = ${lo}$ inputs. Fan-out is the smaller: ${fo}.`,
          trap: 'Taking the larger of the two, or rounding up.' };
      },
      verify: (p) => Math.min(Math.floor(p.IOH / p.IIH + 1e-9), Math.floor(p.IOL / p.IIL + 1e-9)) },
    { id: 'cl-g10', type: 'nat', level: 3, exams: G, sub: 'adder delay',
      make(r) {
        const n = choose(r, [4, 8, 16, 32]), tc = pick(r, 1, 5, 0.5), ts = round(tc + pick(r, 0, 3, 0.5), 2), ask = r() < 0.5 ? 'sum' : 'carry';
        const val = ask === 'sum' ? (n - 1) * tc + ts : n * tc;
        return { q: `${an(n)} ${n}-bit ripple-carry adder uses full adders whose carry output settles ${tc} ns and sum output ${ts} ns after their inputs. With all inputs applied at once, ${ask === 'sum' ? 'the most significant sum bit' : 'the final carry-out'} is guaranteed correct after ______ ns.`,
          answer: round(val, 2), tol: 0.01, unit: 'ns', n, tc, ts, ask,
          sol: ask === 'sum' ? `The carry must ripple through ${n - 1} stages ($${n - 1}\\times${tc} = ${round((n - 1) * tc, 2)}$ ns), then the last stage forms its sum in ${ts} ns: ${round(val, 2)} ns.` : `All ${n} carry stages in series: $${n}\\times${tc} = ${round(val, 2)}$ ns.`,
          trap: 'Counting $n$ carry delays before the last sum bit.' };
      },
      verify: (p) => (p.ask === 'sum' ? (p.n - 1) * p.tc + p.ts : p.n * p.tc) },
    { id: 'cl-g11', type: 'msq', level: 4, exams: G, sub: "don't cares", format: 'multi',
      make(r) {
        const ones = [], dc = [];
        for (let m = 0; m < 16; m++) { const x = r(); if (x < 0.35) ones.push(m); else if (x < 0.47) dc.push(m); }
        if (!ones.length) ones.push(int(r, 0, 15));
        const res = minimise(4, ones, dc.filter((d) => !ones.includes(d)));
        const nonEss = res.primes.filter((p) => !res.ess.includes(p));
        const s = [
          [`It has exactly ${res.primes.length} prime implicants (don\'t-cares used)`, true],
          [`It has exactly ${res.ess.length + 1} essential prime implicants`, false],
          [`A minimal sum of products has ${res.terms} product terms`, true],
          [res.ess.length ? `$${tex(res.ess[0])}$ is an essential prime implicant` : `$${tex(nonEss[0] || res.primes[0])}$ is an essential prime implicant`, res.ess.length > 0],
        ];
        const sh = shuffle(r, s), options = sh.map((x) => x[0]), answer = sh.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0);
        return { q: `For $F(A,B,C,D) = \\sum m(${ones.join(', ')})${dc.length ? ` + d(${dc.join(', ')})` : ''}$, which statements are correct?`, options, answer,
          sol: `Prime implicants: $${res.primes.map(tex).join(',\\ ')}$ (${res.primes.length}). Essential: ${res.ess.length ? `$${res.ess.map(tex).join(',\\ ')}$ (${res.ess.length})` : 'none'}. A minimal cover: $F = ${res.min.map(tex).join(' + ')}$ (${res.terms} terms). Don\'t-cares may enlarge groups but never need to be covered.`,
          trap: 'Requiring the don\'t-cares to be covered, or calling a prime essential when another prime also covers each of its minterms.' };
      } },
  ],
};
