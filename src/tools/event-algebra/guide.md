---
name: Event algebra
num: 1385
shelf: learn
code: L227
section: school-maths
title: "Event algebra: A ∪ B, A ∩ B, not A and the addition rule P(A ∪ B) = P(A) + P(B) − P(A ∩ B) on a grid of outcomes"
seoTitle: "Probability of A or B: addition rule on a dice grid"
summary: "Roll two dice (or a coin and a die) and see all the outcomes as a grid. Choose events A and B, shade them, outline A ∪ B, A ∩ B, A′, A − B or B − A, and watch the addition rule P(A ∪ B) = P(A) + P(B) − P(A ∩ B) worked out with the counts. Mutually exclusive and exhaustive events are flagged, and a simulation checks the answer."
status: live
ads: false
order: 1385
icon: target
works: offline
updated: 2026-11-09
related: [sample-space, venn-diagram, probability-tree, spread-explorer]
sources:
  - "Sample spaces, events, the algebra of events and the addition rule of probability are standard school probability. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against a Python enumeration of all 36 outcomes of two dice (itertools.product with fractions.Fraction) and a seeded simulation of 20 000 rolls."
flow:
  - { icon: table, label: "Outcomes" }
  - { icon: pointer, label: "A and B" }
  - { icon: target, label: "A ∪ B" }
  - { icon: calculator, label: "Rule" }
---

## What it does

An **event** is a set of outcomes. Roll two dice and "the sum is 9 or more" is the 10 outcomes (3, 6), (4, 5), (4, 6) … (6, 6). Once events are sets, you can combine them like sets:

- **A ∪ B** (A or B): outcomes in A, in B, or in both;
- **A ∩ B** (A and B): outcomes in both;
- **A′** (not A): every outcome that is not in A;
- **A − B** (A but not B), and the outcomes in exactly one of A and B.

This page draws all 36 outcomes of two dice as a 6 × 6 grid (or the 12 outcomes of a coin and a die). Cells in A are shaded blue, cells in B orange, cells in both half and half, and the cells of the event you choose are outlined. Underneath, the **addition rule** is worked with the actual counts:

P(A ∪ B) = P(A) + P(B) − P(A ∩ B).

The − P(A ∩ B) is there because the overlap gets counted twice when you add P(A) and P(B). When the overlap is empty, A and B are **mutually exclusive** and the rule becomes plain addition.

It fits the Class 11 maths chapter on probability (events, the algebra of events, axiomatic probability), and builds on the classical probability of Class 9 and 10. Count simple events first with the [[sample-space]] tool and see the sets as circles with the [[venn-diagram]]; for "given that" questions in Class 12, go on to the [[probability-tree]].

## How to use it

1. Choose the experiment: **Two dice** or **A coin and a die**.
2. Pick **Event A** and **Event B** from the lists. Some events take a number k (the sum is k, the die shows k or more); a k box appears for those.
3. Tap an **Outline** button: A ∪ B, A ∩ B, A′, A − B, B − A or "exactly one". The outlined cells are counted in the last line of the box.
4. Read P(A), P(B), P(A ∩ B) and the outlined event as counts out of n(S) and as fractions in lowest terms, then the addition rule with your numbers.
5. **Check it by experiment** rolls 100, 1000 or 10 000 times and compares the share of rolls in A ∪ B with the rule.

In the dice grid the rows are the first die and the columns the second; each cell shows the sum of the two dice.

## Worked example

The page opens with A = "the sum is 9 or more" and B = "at least one die shows 6". The box reads P(A) = 10/36 = 5/18, P(B) = 11/36 and P(A ∩ B) = 7/36: seven cells, such as (3, 6) and (6, 6), are in both. The rule line says P(A ∪ B) = 10/36 + 11/36 − 7/36 = 14/36 = 7/18, and counting the outlined cells gives 14 as well. Because 7 outcomes are shared, A and B are not mutually exclusive.

Now change A to "the sum is k" with k = 7 and B to "a double". The overlap is empty (a double always has an even sum), so the page says they are mutually exclusive and P(A ∪ B) = 6/36 + 6/36 = 1/3.

## FAQ

**What is the difference between mutually exclusive and exhaustive?** Mutually exclusive events cannot happen together (no shared cells). Exhaustive events cover every outcome between them (no empty cells). Heads and tails are both.

**Why does the simulation not give exactly the rule's number?** Random rolls wobble. With more rolls the relative frequency usually gets closer to the probability, which is what the rule describes.

**Is anything stored?** No. Everything runs in your browser. fibub is not part of NCERT; the topics follow the syllabus, but the words, pictures and examples are our own.
