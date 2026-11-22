---
title: Combinational logic
summary: 'Combinational logic at GATE depth: Boolean algebra and De Morgan, NAND and NOR as universal gates, minterms and maxterms, four-variable Karnaugh maps with don''t-cares, prime and essential implicants, half and full adders, ripple-carry and carry look-ahead, two''s complement subtraction, comparators, multiplexers as function generators, decoders and encoders, hazards, and logic-family numbers: noise margins, fan-out and CMOS power.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The minimal sum of products of F(A, B, C, D) = Σm(0, 2, 8, 10) is'
    choices: ['B′D′', 'A′B′D′ + AB′D′', 'B′ + D′', 'A′C′ + AC']
    ans: 0
    why: 'The four corners of the K-map form one group (rows and columns wrap round). In all four cells B = 0 and D = 0, while A and C take both values, so F = B′D′.'
  - q: 'How many select lines does a multiplexer need to implement an arbitrary function of 4 variables, if the data inputs may be 0, 1, D or D′?'
    choices: ['3', '4', '2', '16']
    ans: 0
    why: 'Use A, B, C as the select lines of an 8:1 mux. For each of the 8 combinations the function of the remaining variable D is 0, 1, D or D′, which goes on that data input.'
  - q: 'In 8-bit two''s complement, the range of representable integers is'
    choices: ['−128 to +127', '−127 to +127', '−128 to +128', '0 to 255']
    ans: 0
    why: 'With n bits two''s complement covers −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1. There is one zero, so one more negative number than positive.'
sources:
  - 'M. M. Mano and M. D. Ciletti, Digital Design, 5th ed. (2013), chapters 1 to 4'
  - 'R. J. Tocci, N. S. Widmer and G. L. Moss, Digital Systems, 12th ed. (2017), chapters 3, 4, 6 and 9'
  - 'J. F. Wakerly, Digital Design: Principles and Practices, 4th ed. (2006), chapters 3 to 6'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 45 minutes.** The JAM [digital logic lesson](/learn/courses/iit-jam-physics/digital-logic/) introduces gates, truth tables and number systems. GATE expects fast minimisation with Karnaugh maps, the arithmetic circuits, multiplexer tricks and a few numbers about real logic families. A combinational circuit has no memory: its outputs depend only on its present inputs. Circuits with memory come in [lesson 9.6](/learn/courses/gate-physics/sequential-logic/).

<div class="bigidea">Every Boolean function is a list of the input combinations that make it 1 (its minterms). Minimising it means covering those minterms with as few, and as large, rectangles of adjacent cells as possible. A Karnaugh map arranges the cells in Gray-code order so that neighbours differ in one variable, and each doubling of a rectangle removes one variable from its term.</div>

## 1. Boolean algebra

The laws that do most of the work:

```math
A + AB = A, \qquad A + A'B = A + B, \qquad AB + A'C + BC = AB + A'C \ (\text{consensus}), \qquad (A + B)' = A'B', \quad (AB)' = A' + B'
```

**De Morgan** lets any AND-OR circuit be built from NAND gates alone (NAND-NAND = AND-OR) and any OR-AND circuit from NOR gates alone: NAND and NOR are **universal**. An inverter is a NAND with its inputs tied; an XOR needs four NANDs.

A function can be written as a **sum of minterms** (one product term per 1 in the truth table, `$F = \Sigma m(\dots)$`) or a **product of maxterms** (one sum term per 0, `$F = \Pi M(\dots)$`). The two lists are complementary: `$\Sigma m(1, 3, 5) = \Pi M(0, 2, 4, 6, 7)$` for three variables.

## 2. Karnaugh maps

<div class="steps">
<div class="step"><p><b>Lay out the map.</b> For four variables, rows AB and columns CD both run 00, 01, 11, 10 (Gray order). The map wraps round: the left column is adjacent to the right, the top row to the bottom, and the four corners form one group.</p></div>
<div class="step"><p><b>Draw groups.</b> Rectangles of 1, 2, 4, 8 or 16 cells containing only 1s and don’t-cares (X). A group of 2ᵏ cells gives a product of 4 − k literals: the variables that stay constant over the group.</p></div>
<div class="step"><p><b>Prime implicants.</b> Make every group as large as possible. A group that cannot be enlarged is a prime implicant.</p></div>
<div class="step"><p><b>Essential primes first.</b> A prime implicant is essential if it alone covers some 1. Take all of them, then cover the remaining 1s with the fewest extra primes. Don’t-cares are used only when they make a group bigger; they never need to be covered.</p></div>
</div>

**Worked example 1.** `$F = \Sigma m(0, 2, 5, 7, 8, 10, 13, 15)$`. The four corners (0, 2, 8, 10) all have `$B = 0, D = 0$`: the term `$B'D'$`. The central square (5, 7, 13, 15) has `$B = 1, D = 1$`: `$BD$`. So `$F = B'D' + BD = (B\oplus D)'$`, an XNOR of two of the four inputs. This is the figure's starting map.

**Worked example 2.** `$F = \Sigma m(1, 3, 7, 11, 15) + d(0, 2, 5)$`. The column `$CD = 11$` (3, 7, 11, 15) gives `$CD$`, which is essential. Minterm 1 is left; it can join the top row (0, 1, 2, 3, using two don't-cares) as `$A'B'$`, or the block 1, 3, 5, 7 (using don't-care 5) as `$A'D$`. Both give a minimal answer with two terms and four literals: `$F = CD + A'B'$` or `$F = CD + A'D$`. Minimal covers need not be unique.

<figure class="fig" data-fig="kmap-simplifier"><figcaption>A four-variable Karnaugh map. Tap a cell to cycle 0 → 1 → X (don’t-care). The figure finds every prime implicant by checking every possible group, marks the essential ones, and shades a minimal sum of products. Enter the ring Σm(0, 1, 5, 7, 8, 10, 14, 15) to see a cyclic map with eight primes and no essential ones.</figcaption></figure>

**Hazards.** In `$F = AB + A'C$`, when `$B = C = 1$` and `$A$` changes, one term turns off just before the other turns on, and the output can glitch to 0 (a static-1 hazard). Adding the redundant consensus term `$BC$` covers the transition. On a K-map: any two adjacent 1s not inside a common group can glitch.

## 3. Arithmetic circuits

**Adders.** A half adder gives `$S = A\oplus B$`, `$C = AB$`. A full adder adds a carry in:

Switch the inputs of an adder and watch the carry.

<figure class="fig" data-fig="@sx-adders"><figcaption>Half adder, full adder and a 4-bit ripple-carry adder; in the ripple adder the sum is correct only after the carry has passed through every stage.</figcaption></figure>

```math
S = A\oplus B\oplus C_{in}, \qquad C_{out} = AB + C_{in}(A\oplus B)
```

A **ripple-carry** adder chains `$n$` full adders, and the worst case is a carry generated in bit 0 that must ripple through all of them, so the delay grows as `$n$`. **Carry look-ahead** defines generate `$G_i = A_iB_i$` and propagate `$P_i = A_i\oplus B_i$`, so that `$C_{i+1} = G_i + P_iC_i$`, and expands the recursion:

```math
C_4 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1G_0 + P_3P_2P_1P_0C_0
```

Every carry is then a two-level function of the inputs, computed in parallel; in hierarchical form the delay grows as `$\log n$`.

<div class="problem" data-problem="adder-delay"></div>

**Subtraction** uses two's complement: `$-B$` is `$B'$` + 1, so `$A - B = A + B' + 1$`, which is an adder with XOR gates on the `$B$` inputs and carry-in 1. With `$n$` bits the range is `$-2^{n-1}$` to `$2^{n-1} - 1$`. Overflow happens when two numbers of the same sign give a result of the other sign, which is when the carries into and out of the sign bit differ.

**Comparators.** Bit equality is XNOR; `$A = B$` for words is the AND of the bit XNORs. For magnitude, `$A > B$` is decided by the most significant bit where they differ.

## 4. Multiplexers, decoders and encoders

| Block | Inputs → outputs | What it does |
|---|---|---|
| multiplexer `$2^n{:}1$` | `$2^n$` data, `$n$` select → 1 | passes the selected data input |
| demultiplexer | 1 data, `$n$` select → `$2^n$` | routes the input to one output |
| decoder `$n{:}2^n$` | `$n$` → `$2^n$` | one output per minterm; with an OR gate, any function |
| encoder / priority encoder | `$2^n$` → `$n$` | the code of the active (highest-priority) input |

**A multiplexer is a universal function generator.** Put the variables on the select lines and the truth table on the data inputs, and a `$2^n{:}1$` mux implements any function of `$n$` variables. Better: use `$n$` of `$n + 1$` variables as selects and put 0, 1, the last variable or its complement on each data input. A 4:1 mux with selects `$A, B$` gives `$F(A, B, C) = \Sigma m(1, 2, 6, 7)$` with inputs `$I_0 = C$`, `$I_1 = C'$`, `$I_2 = 0$`, `$I_3 = 1$`.

## 5. Real logic families

<div class="meaning">

<dl>
<dt>noise margins</dt><dd>`$NM_H = V_{OH} - V_{IH}$` and `$NM_L = V_{IL} - V_{OL}$`: how much noise a valid output can pick up and still be read correctly. Standard TTL: `$V_{OH} = 2.4$`, `$V_{IH} = 2.0$`, `$V_{IL} = 0.8$`, `$V_{OL} = 0.4$` V, so both margins are 0.4 V. CMOS margins are close to `$0.3V_{DD}$` or more.</dd>
<dt>fan-out</dt><dd>how many inputs one output can drive: the smaller of `$I_{OH}/I_{IH}$` and `$I_{OL}/I_{IL}$` for TTL; for CMOS it is limited by speed, since each input adds capacitance</dd>
<dt>propagation delay</dt><dd>time from an input change to the output change; sets the speed of every path</dd>
<dt>dynamic power</dt><dd>`$P = \alpha CV_{DD}^2f$`: each 0 → 1 transition takes `$CV_{DD}^2$` from the supply. CMOS draws almost no static current, so this dominates, and lowering the supply voltage is the strongest lever.</dd>
</dl>

</div>

**Worked example.** A chip switches an effective 1 nF at 2 GHz with activity `$\alpha = 0.1$` at 1.0 V: `$P = 0.1\times10^{-9}\times1^2\times2\times10^9 = 0.2$` W. At 1.2 V the same work costs 0.29 W.

<div class="problem" data-problem="cmos-power"></div>

<div class="myth">

**"The minimal sum of products is unique, and you get it by grouping the biggest blocks first."** Biggest-first can leave you with a redundant group: take essential primes first, then choose among the rest. And many functions have several equally small covers (example 2 above), so an exam asks for the number of terms or literals, or gives options of which more than one may be correct.

</div>

<div class="keypoints">

- De Morgan; NAND and NOR are universal; consensus `$AB + A'C + BC = AB + A'C$`.
- K-map: Gray order, wrap-round, groups of 2ᵏ drop `$k$` variables; essential primes first; don't-cares only when they help.
- Full adder `$S = A\oplus B\oplus C$`, `$C_{out} = AB + C(A\oplus B)$`; ripple delay ∝ `$n$`, look-ahead ∝ `$\log n$`.
- Two's complement: range `$-2^{n-1}$` to `$2^{n-1} - 1$`; `$A - B = A + B' + 1$`.
- `$2^n{:}1$` mux implements any `$(n + 1)$`-variable function with inputs 0, 1, x, x′.
- `$NM_H = V_{OH} - V_{IH}$`, `$NM_L = V_{IL} - V_{OL}$`; CMOS `$P = \alpha CV^2f$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="combinational-logic" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.6](/learn/courses/gate-physics/sequential-logic/) adds memory: latches, flip-flops, counters and shift registers. The [logic simplifier](/science/logic-simplifier/) minimises functions of more variables than a K-map can handle.
