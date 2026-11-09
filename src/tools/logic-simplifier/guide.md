---
name: Truth table and Karnaugh map simplifier
num: 558
shelf: science
section: discrete-maths-and-graph-theory
title: "Boolean expression simplifier: truth table, Karnaugh map, Quine-McCluskey, minimal SOP and POS, logic gates"
summary: "Type a Boolean expression or a list of minterms (with don't-cares) and get the truth table, the minimal sum of products and product of sums by Quine-McCluskey (up to 6 variables), a Karnaugh map with the groups circled (2 to 4 variables), the prime implicant chart and a logic gate diagram. Checked against sympy."
status: live
ads: true
order: 558
icon: table
works: offline
updated: 2026-11-09
related: [regex-fsm-visualiser, combinatorics-calculator, symbolic-algebra, matrix-calculator, graph-algorithms, circuit-simulator, error-correcting-codes]
sources:
  - "Methods: Quine-McCluskey prime implicants with an exact minimum cover (fewest terms, then fewest literals), De Morgan for the product of sums, Karnaugh maps in Gray code order (standard digital logic)."
  - "Checked against sympy.logic SOPform and POSform on 160 random functions of 2 to 6 variables with don't-cares (always as small, sometimes smaller), sympy truth tables of 11 expressions, and a brute-force search over all 256 functions of 3 variables."
  - "The example expressions are made up for this tool."
flow:
  - { icon: pencil, label: "Expression" }
  - { icon: table, label: "Truth table" }
  - { icon: target, label: "K-map" }
  - { icon: check, label: "Minimal" }
---

## What it does

For digital electronics, computer science and discrete maths courses. Give it a Boolean function and it works out:

- the **truth table**, with each row's number and the minterm (Σm) and maxterm (ΠM) lists;
- the **minimal sum of products (SOP)** and **minimal product of sums (POS)**, fewest terms first and then fewest literals, using the Quine-McCluskey method with an exact search for the smallest cover;
- a **Karnaugh map** for 2, 3 or 4 variables, with each group of the minimal SOP drawn as a coloured loop (loops wrap round the edges where needed);
- the **prime implicant chart**, marking the essential prime implicants and those used, and the **Quine-McCluskey combining steps**;
- a **logic gate diagram**: AND gates into an OR gate for the SOP, or OR gates into an AND gate for the POS, with NOT gates on complemented inputs.

Build and test the simplified gates in the [[circuit-simulator]], and see how state machines read text in the [[regex-fsm-visualiser]].

## How to use it

1. Choose **Expression** and type something like `AB + A'C + BC`, or choose **Minterms** and give the variable names, the row numbers where F = 1 and any don't-cares (rows where the output does not matter, such as unused codes).
2. Pick how answers are written: textbook (A′B + AC), logic symbols (¬A∧B ∨ A∧C), code (!A & B | A & C) or SymPy (~A & B | A & C), which you can paste into Python.
3. Choose whether the gate diagram shows the SOP or the POS.
4. Download the truth table as CSV, or everything (forms, table, K-map, gates and chart) as an image, PDF or Word file.

In an expression, letters are variables and letters written together are ANDed, so `AB'C` is A AND (NOT B) AND C. NOT binds tightest, then AND, then XOR, then OR, then implies (`->`) and equivalence (`<->`). Rows are numbered with the first variable (in alphabetical order for an expression) as the highest bit.

## Worked examples

- `AB + A'C + BC` is 1 on rows 1, 3, 6 and 7. The minimal SOP is **AB + A′C**: the term BC is redundant (the consensus theorem). The minimal POS is **(A′ + B)(A + C)**.
- Minterms 0, 1, 2, 5, 6, 7, 8, 9, 10, 14 of A B C D have 6 prime implicants, 2 of them essential, and the minimal SOP **B′C′ + CD′ + A′BD** (3 terms, 7 literals).
- The don't-cares example (minterms 1, 3, 7, 11, 15 with don't-cares 0, 2, 5) simplifies to **A′D + CD**, or **D(A′ + C)** as a product of sums.
- A three-way XOR (`A ^ B ^ C`) cannot be simplified: no two of its 1s are next to each other on the map, so the SOP keeps all four minterms.

## Tips and limits

- A function can have several minimal forms of the same size; this tool shows one of them. Any of them is a correct answer if it has the same number of terms and literals.
- Karnaugh maps are drawn for 2 to 4 variables. With 5 or 6 variables, use the truth table, the prime implicant chart and the steps.
- Up to 6 variables (64 rows). Multi-level circuits, NAND-only or NOR-only conversion and timing hazards are not covered.

## Frequently asked questions

**What is a prime implicant?** A group of 1s (and don't-cares) that is as large as possible: a product term that cannot lose another literal and still stay inside the function. The minimal SOP always uses prime implicants only.

**Why can the POS have a different number of terms from the SOP?** The POS is the minimal SOP of the complement (the 0s), turned round with De Morgan's laws, so it groups the 0s instead of the 1s.

**Is anything uploaded?** No. Everything runs on your device.
