---
title: Logic gates and Boolean algebra
seoTitle: Logic gates and Boolean algebra for IIT JAM Physics
summary: 'Binary, hexadecimal, BCD, Gray code and two''s complement; every logic gate and why NAND and NOR are universal; the laws of Boolean algebra and De Morgan; simplifying with Karnaugh maps; adders, multiplexers, flip-flops and counters.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'What does De Morgan''s theorem give for the complement of (A + B)?'
    choices: ['A̅·B̅ (NOT A AND NOT B)', 'A̅ + B̅ (NOT A OR NOT B)', 'A·B', 'A ⊕ B']
    ans: 0
    why: 'Break the bar and change the operation: NOT(A + B) = NOT A · NOT B. The other form, NOT A + NOT B, equals NOT(A·B), the NAND.'
  - q: 'How many select lines does a multiplexer with 16 data inputs need?'
    choices: ['4', '16', '8', '2']
    ans: 0
    why: 'n select lines can choose among 2ⁿ inputs, and 2⁴ = 16.'
  - q: 'The 8-bit two''s complement numbers for +100 and +50 are added. What does the 8-bit result read as?'
    choices: ['−106, because 150 is beyond +127 and the result overflows', '+150', '−150', '+106']
    ans: 0
    why: 'The 8-bit signed range is −128 to +127. The pattern for 150 has its top bit set, so it reads as 150 − 256 = −106. Two positives giving a negative is the sign of overflow.'
sources:
  - 'M. M. Mano and M. D. Ciletti, Digital Design, 6th ed. (2018), chapters 1 to 6'
  - 'A. P. Malvino and D. P. Leach, Digital Principles and Applications, 8th ed. (2014)'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapter 10: digital logic'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 45 minutes.** By the end you will be able to convert between binary, decimal, hexadecimal, BCD and Gray code, add and subtract in two's complement and spot overflow, read and build any gate from NAND or NOR alone, simplify Boolean expressions algebraically and with Karnaugh maps, and explain adders, multiplexers, flip-flops and counters.

<div class="bigidea">Digital circuits use only two values, 0 and 1, and a handful of rules for combining them; with those rules any calculation can be built from a single kind of gate.</div>

## 1. Numbers in base 2

A transistor used as a switch (fully on or fully off, as in [lesson 7.5](/learn/courses/iit-jam-physics/transistors/)) naturally stores one **bit**. A string of bits is a number in base 2, each place worth twice the one to its right:

```math
(1011)_2 = 1\cdot2^3 + 0\cdot2^2 + 1\cdot2^1 + 1\cdot2^0 = 11
```

To go from decimal to binary, divide by 2 repeatedly and read the remainders from the **last** one up: 45 gives remainders 1, 0, 1, 1, 0, 1, so `$45 = (101101)_2$`.

| Code | Idea | Example (decimal 59) |
|---|---|---|
| Hexadecimal | groups of 4 bits, digits 0 to 9 and A to F | `$(3B)_{16}$` = `$0011\,1011$` |
| Octal | groups of 3 bits | `$(73)_8$` |
| BCD (8421) | each DECIMAL digit in its own 4 bits | `$0101\,1001$` |
| Gray code | neighbours differ in one bit only | binary `$111011 \to 100110$` |

To get Gray code, keep the first bit and XOR each pair of neighbouring bits: `$g_i = b_{i+1}\oplus b_i$`. It is used in shaft encoders, where two bits changing at once could give a false reading.

## 2. Negative numbers: two's complement

In an `$n$`-bit word, two's complement gives the top bit a weight of `$-2^{n-1}$`. To negate a number, **invert every bit and add 1**. For 8 bits:

- `$+20 = 00010100$`; invert: `$11101011$`; add 1: `$11101100 = -20$` (as an unsigned number it is `$256 - 20 = 236$`).
- The range is `$-128$` to `$+127$`; there is one zero.
- Subtraction is addition of the negative: `$A - B = A + (\bar B + 1)$`, and the carry out of the top bit is thrown away.

**Overflow** happens when the true answer is outside the range. It can only occur when both numbers have the same sign, and shows up as a result of the wrong sign.

**Worked example.** Work out `$0110 - 1001$` in 4-bit two's complement (unsigned 6 − 9).

1. Two's complement of `$1001$`: invert to `$0110$`, add 1: `$0111$`.
2. Add: `$0110 + 0111 = 1101$` (no carry out).
3. Top bit 1, so negative: invert `$1101$` to `$0010$`, add 1: `$0011 = 3$`. The answer is `$-3$`, as it should be.

<div class="problem" data-problem="twos-sum"></div>

## 3. The gates

| Gate | Expression | Output is 1 when | Truth table for AB = 00, 01, 10, 11 |
|---|---|---|---|
| AND | `$AB$` | all inputs are 1 | 0, 0, 0, 1 |
| OR | `$A + B$` | any input is 1 | 0, 1, 1, 1 |
| NOT | `$\bar A$` | the input is 0 | (one input) |
| NAND | `$\overline{AB}$` | not all inputs are 1 | 1, 1, 1, 0 |
| NOR | `$\overline{A + B}$` | no input is 1 | 1, 0, 0, 0 |
| XOR | `$A\oplus B = \bar AB + A\bar B$` | the inputs differ | 0, 1, 1, 0 |
| XNOR | `$\overline{A\oplus B}$` | the inputs are equal | 1, 0, 0, 1 |

<figure class="fig" data-fig="logic-gates"><figcaption>Pick a gate and tap A and B. The lit row of the truth table always matches the lamp. Try NAND with both inputs tied the same way (00 and 11): it behaves as NOT.</figcaption></figure>

**NAND and NOR are universal**: each can build every other gate by itself.

- NOT from NAND: tie the inputs together, `$\overline{AA} = \bar A$`.
- AND from NAND: a NAND followed by a NAND-inverter.
- OR from NAND: invert each input first, then NAND: `$\overline{\bar A\bar B} = A + B$`.
- XOR takes four NANDs: with `$N = \overline{AB}$`, the output is `$\overline{\overline{AN}\cdot\overline{BN}} = A\oplus B$`.

The same works for NOR with AND and OR swapped. Chips with only NAND gates were the workhorse of early computers.

## 4. Boolean algebra

Variables take only the values 0 and 1; `$+$` means OR, juxtaposition means AND, a bar means NOT.

| Law | OR form | AND form |
|---|---|---|
| Identity | `$A + 0 = A$` | `$A\cdot1 = A$` |
| Null | `$A + 1 = 1$` | `$A\cdot0 = 0$` |
| Idempotent | `$A + A = A$` | `$AA = A$` |
| Complement | `$A + \bar A = 1$` | `$A\bar A = 0$` |
| Absorption | `$A + AB = A$` | `$A(A + B) = A$` |
| Distributive | `$A + BC = (A + B)(A + C)$` | `$A(B + C) = AB + AC$` |
| De Morgan | `$\overline{A + B} = \bar A\,\bar B$` | `$\overline{AB} = \bar A + \bar B$` |
| Useful extras | `$A + \bar AB = A + B$` | consensus: `$AB + \bar AC + BC = AB + \bar AC$` |

Every law has a **dual**: swap `$+$` with `$\cdot$` and 0 with 1. Notice the laws ordinary algebra does not have: `$A + 1 = 1$`, `$A + A = A$`, and OR distributing over AND.

<div class="meaning">

<dl>
<dt>A + B</dt><dd>OR: true if at least one is true (not an arithmetic sum: 1 + 1 = 1)</dd>
<dt>AB</dt><dd>AND: true only if both are true</dd>
<dt>Ā</dt><dd>NOT: the opposite value</dd>
<dt>De Morgan</dt><dd>"break the bar, change the sign": a NOR is an AND of inverted inputs, a NAND an OR of inverted inputs</dd>
<dt>Physical meaning</dt><dd>Each law says two circuits give the same output for every input. Simplifying an expression means building the same behaviour with fewer gates, less power and less delay.</dd>
</dl>

</div>

**Worked example.** Simplify `$Y = (A + B)(A + \bar B)(\bar A + C)$`.

1. `$(A + B)(A + \bar B) = A + B\bar B = A + 0 = A$` (OR distributes over AND).
2. `$Y = A(\bar A + C) = A\bar A + AC = AC$`.
3. Check one row: `$A = 1, B = 0, C = 1$` gives `$(1)(1)(1) = 1$` and `$AC = 1$`.

<div class="myth">

**"The complement of AB is Ā·B̄."** No: putting a bar over each letter is not the same as putting one long bar over the product. `$\overline{AB} = \bar A + \bar B$` (NAND), while `$\bar A\,\bar B = \overline{A + B}$` (NOR). They differ when exactly one input is 1: `$A = 1, B = 0$` gives `$\overline{AB} = 1$` but `$\bar A\bar B = 0$`. When you break a bar, the operation underneath must flip.

</div>

## 5. Minterms and Karnaugh maps

Any function can be written straight from its truth table as a **sum of products** (SOP): one AND term (**minterm**) for each row where the output is 1. With `$A$` as the most significant bit, row 5 is `$101$`, the minterm `$A\bar BC$`, written `$m_5$`. The **product of sums** (POS) uses one OR term (**maxterm**) for each 0 row. So `$f = \sum m(3,5,6,7) = \prod M(0,1,2,4)$` (this is the majority function `$AB + BC + CA$`).

A **Karnaugh map** lays the truth table out so that neighbouring cells differ in one variable (rows and columns run in Gray-code order 00, 01, 11, 10, and the edges wrap round). Simplifying then becomes drawing loops:

<div class="steps">
<div class="step"><p><b>Fill the map.</b> Put a 1 in the cell of every minterm. Cells marked X are "don't cares": use them only if they help.</p></div>
<div class="step"><p><b>Loop the 1s in blocks of 1, 2, 4, 8 or 16.</b> Blocks must be rectangles (wrapping round the edges is allowed) and their sizes powers of two.</p></div>
<div class="step"><p><b>Make each loop as big as possible.</b> A loop of 2ᵏ cells removes k variables: inside it those variables take every value, so they drop out.</p></div>
<div class="step"><p><b>Use as few loops as possible</b> to cover every 1. Overlapping loops are fine.</p></div>
<div class="step"><p><b>Read off each loop</b> as the AND of the variables that stay constant inside it, and OR the loops together.</p></div>
</div>

**Worked example.** Simplify `$f(A,B,C,D) = \sum m(0,1,2,3,4,6,8,9,10,11,12,14)$`.

1. There are 12 ones and only 4 zeros, at `$m_5, m_7, m_{13}, m_{15}$` = `$0101, 0111, 1101, 1111$`.
2. The zeros are exactly the cells with `$B = 1$` and `$D = 1$`, so `$\bar f = BD$`.
3. By De Morgan `$f = \bar B + \bar D$`: two loops of eight. Looking at the zeros first was much faster than looping twelve ones.

A function with no two neighbouring 1s, like `$A\oplus B\oplus C$` (a checkerboard), cannot be simplified at all. To check your loops on any function, the [logic simplifier](/science/logic-simplifier/) gives the minimal SOP and POS and draws the Karnaugh map.

<div class="problem" data-problem="minterm-count"></div>

## 6. Circuits that combine

- **Half adder**: sum `$S = A\oplus B$`, carry `$C = AB$`.
- **Full adder** (with carry-in `$C_i$`): `$S = A\oplus B\oplus C_i$` (odd parity), `$C_o = AB + C_i(A\oplus B) = AB + BC_i + C_iA$` (majority). Chained, `$n$` full adders add two `$n$`-bit numbers (a ripple-carry adder).
- **Multiplexer** (data selector): `$n$` select lines pick one of `$2^n$` inputs. A 4-to-1 MUX gives `$Y = \bar S_1\bar S_0I_0 + \bar S_1S_0I_1 + S_1\bar S_0I_2 + S_1S_0I_3$`, so tying its inputs to 0s and 1s makes any function of the select lines.
- **Decoder**: `$n$` inputs light exactly one of `$2^n$` outputs; a demultiplexer sends one input to the chosen output.

**Worked example.** Make `$S_1\oplus S_0$` from a 4-to-1 MUX.

1. XOR is 1 for select values 01 and 10.
2. So set `$I_0 = 0$`, `$I_1 = 1$`, `$I_2 = 1$`, `$I_3 = 0$`.
3. The MUX copies the truth table column straight to its output.

## 7. Circuits that remember

Feed a gate's output back to its input and the circuit can store a bit.

- **SR latch** (two cross-coupled NOR gates): S = 1 sets Q = 1, R = 1 resets Q = 0, S = R = 0 holds. S = R = 1 forces both outputs to 0 and leaves the next state unpredictable: forbidden. (With NAND gates the inputs are active-low and the forbidden state forces both outputs to 1.)
- **D flip-flop**: at the clock edge Q copies D. The basic memory cell of registers.
- **JK flip-flop**: like SR, but J = K = 1 **toggles** Q. Its characteristic equation is `$Q_{n+1} = J\bar Q_n + \bar KQ_n$`. A level-triggered JK latch with J = K = 1 can toggle many times while the clock is high (race-around); edge triggering or a master-slave design fixes this.
- **T flip-flop**: T = 1 toggles at every edge, so it divides the clock frequency by 2.

**Counters.** A chain of `$n$` toggling flip-flops, each clocked by the previous one, is a **ripple counter**: it counts 0 to `$2^n - 1$`, and the last output is the clock divided by `$2^n$`. A mod-`$N$` counter needs `$\lceil\log_2N\rceil$` flip-flops and a gate that clears them all when the count reaches `$N$` (e.g. clear at `$1010$` for a decade counter). A **Johnson counter** (a shift register with its inverted last output fed back to the start) runs through `$2n$` states with `$n$` flip-flops; a **ring counter** (one circulating 1) runs through `$n$`.

**Worked example.** Three D flip-flops are clocked together with `$D_2 = Q_1$`, `$D_1 = Q_0$`, `$D_0 = \bar Q_2$`. Starting at `$000$`, list the states.

1. Each clock shifts left and brings in `$\bar Q_2$` at the right: `$000 \to 001 \to 011 \to 111 \to 110 \to 100 \to 000$`.
2. Six states: a 3-bit Johnson counter, `$2n = 6$`.
3. The two missing states, `$010$` and `$101$`, form a separate loop of their own; a careful design makes sure the counter cannot get stuck there after power-up.

To play with gates, NAND-only circuits and chained gates, use the [logic gates](/learn/logic-gates/) tool.

<div class="keypoints">

- Binary place values are powers of 2; hex groups 4 bits; BCD codes each decimal digit separately; Gray code changes one bit at a time (`$g_i = b_{i+1}\oplus b_i$`).
- Two's complement: invert and add 1; `$n$` bits hold `$-2^{n-1}$` to `$2^{n-1} - 1$`; overflow means the result has the wrong sign.
- NAND and NOR are universal. XOR is 1 when inputs differ; XOR needs four NANDs.
- Boolean laws: `$A + 1 = 1$`, `$A + A = A$`, `$A + AB = A$`, `$A + \bar AB = A + B$`, `$A + BC = (A + B)(A + C)$`, De Morgan, consensus.
- K-maps: Gray-code order, loops of `$2^k$` cells remove `$k$` variables; largest and fewest loops; look at the 0s when there are fewer of them.
- Full adder: sum = parity, carry = majority. MUX: `$n$` select lines for `$2^n$` inputs.
- Flip-flops: D copies, JK with J = K = 1 toggles, SR forbids S = R = 1. Ripple counters divide by `$2^n$`; Johnson counters have `$2n$` states.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [logic gates and Boolean algebra practice page](/learn/courses/iit-jam-physics/practice/digital-logic/).

<div class="qbank" data-bank="physics" data-topics="digital-logic" data-exam="jam" data-n="10"></div>

**Next:** this completes the electronics module, with [transistors](/learn/courses/iit-jam-physics/transistors/) and [op-amps](/learn/courses/iit-jam-physics/op-amps/) before it, and module 8 begins with [the JAM paper](/learn/courses/iit-jam-physics/jam-exam-pattern/). The GATE Physics course goes on to [combinational design](/learn/courses/gate-physics/combinational-logic/), [flip-flops, counters and registers](/learn/courses/gate-physics/sequential-logic/) in detail.
