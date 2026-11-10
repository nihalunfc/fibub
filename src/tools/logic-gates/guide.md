---
name: Logic gates
num: 1432
shelf: learn
section: school-physics
title: "Logic gates"
summary: "Tap the inputs of an AND, OR, NOT, NAND, NOR, XOR or XNOR gate and watch the output lamp and its row of the truth table light up. Build NOT, AND and OR from NAND or NOR gates only, and chain two gates into a three-input circuit with its full truth table."
status: live
ads: false
order: 1432
icon: table
works: offline
updated: 2026-11-09
related: [pn-junction, logic-simplifier, rectifier-lab, venn-diagram]
sources:
  - "The gates, truth tables, Boolean expressions and the NAND/NOR constructions are standard digital electronics. Every table and construction is checked in the tests for all inputs."
  - "Gate symbols are drawn by fibub in the usual distinctive-shape style. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pointer, label: "Tap inputs" }
  - { icon: eye, label: "Output" }
  - { icon: table, label: "Truth table" }
  - { icon: link, label: "Combine" }
---

## What it does

Computers think in two states: 1 (on, high voltage) and 0 (off, low voltage). A **logic gate** takes one or two inputs and gives one output by a fixed rule. Gates are built from diodes and transistors, and every calculator and phone is made of millions of them.

- **The seven gates.** AND, OR, NOT, NAND, NOR, XOR (exclusive OR) and XNOR. Tap the big **A** and **B** buttons to switch each input between 0 and 1. The wires that carry a 1 turn coloured, the output lamp lights when Y = 1, and the matching row of the **truth table** is highlighted. The Boolean expression and a one-line rule sit under the symbol.
- **Universal gates.** With NAND gates alone (or NOR gates alone) you can build every other gate. Pick one and pick NOT, AND or OR to see the recipe, how many gates it takes, and a table that proves it gives the same output for every input.
- **Two gates in a row.** Feed the output of one gate (G1) into a second (G2) with a third input C. You get a three-input circuit and its eight-row truth table, with the working for the current inputs.

Logic gates were part of **Class 12 Physics: semiconductor electronics** and are still taught in many schools and in computer science; this page is an extension of that chapter and of **Class 11 maths: sets** (AND is like intersection, OR like union). It follows on from the diodes in the [[pn-junction]] tool. To simplify a bigger logic expression with a Karnaugh map, use the [[logic-simplifier]]; to see AND and OR as overlapping sets, try the [[venn-diagram]].

## How to use it

1. Pick a gate at the top.
2. Tap **A** and **B**. Watch the lamp and the highlighted row.
3. In the second card, choose **Only NAND** or **Only NOR** and the gate to build.
4. In the third card, choose G1 and G2 and tap A, B and C.
5. Try the **Check yourself** questions; **New questions** gives a fresh set.

## Worked example

AND with A = 1, B = 1 gives Y = 1; switch B to 0 and the lamp goes out. NAND gives the opposite in every row: 1, 1, 1, 0.

Build OR from NAND gates: first make NOT A = NAND(A, A) and NOT B = NAND(B, B), then NAND(NOT A, NOT B). With A = 0, B = 1: NOT A = 1, NOT B = 0, NAND(1, 0) = 1, the same as OR(0, 1). That uses 3 NAND gates.

Two gates in a row with G1 = AND, G2 = OR and A = 1, B = 0, C = 1: G1 = AND(1, 0) = 0, then Y = OR(0, 1) = 1. The table has 2³ = 8 rows.

## Tips

- A quick check for AND: any 0 in gives 0 out. For OR: any 1 in gives 1 out.
- A bubble on the output of a symbol means NOT. NAND is AND with a bubble; NOR is OR with a bubble.
- XOR adds two bits without the carry: 1 ⊕ 1 = 0. That is the heart of an adder circuit.

## FAQ

**Why are NAND and NOR called universal?** Because NOT, AND and OR can each be built from them, and every logic circuit can be built from NOT, AND and OR.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
