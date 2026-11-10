---
name: Venn diagram calculator
num: 1186
shelf: learn
code: L89
section: school-maths
title: "Venn diagram calculator: type (A ∪ B)′ ∩ C and see it shaded, check De Morgan's laws, count n(A ∪ B)"
summary: "Type any set expression with union, intersection, complement and difference for 2 or 3 sets and see the region shaded on a Venn diagram. Compare two expressions to check De Morgan's laws, put in real lists of elements, and count with n(A ∪ B) = n(A) + n(B) − n(A ∩ B)."
status: live
ads: false
order: 1186
icon: target
works: offline
updated: 2026-11-09
related: [logic-simplifier, combinatorics-calculator, distribution-explorer]
sources:
  - "Standard set theory: union, intersection, complement, difference and symmetric difference, De Morgan's laws, the distributive laws and the inclusion–exclusion principle. Written for fibub; no textbook text, figures or exercises are used, and the example sets are made up."
  - "Checked against Python's own set operations: the regions of 13 expressions on the eight regions of a three-set diagram, and results and counts on example lists of elements."
flow:
  - { icon: pencil, label: "Type sets" }
  - { icon: target, label: "Shaded" }
  - { icon: check, label: "Compare" }
  - { icon: calculator, label: "Count" }
---

## What it does

A Venn diagram draws each set as a circle inside a rectangle, the universal set U. The circles cut the rectangle into regions: 4 regions for two sets and 8 for three. Every set expression you can build from A, B and C, however long, is just a choice of some of those regions. This page reads the expression you type and shades exactly those regions, so you can *see* what (A ∪ B)′ ∩ C means.

It also compares two expressions region by region (the quickest way to check a law such as De Morgan's), and lets you fill the sets with real elements to work counting problems.

It follows sets in Class 11 maths (operations on sets, complements, Venn diagrams and practical counting problems). For the same laws in logic, the [[logic-simplifier]] simplifies true/false expressions; for counting arrangements and selections, see the [[combinatorics-calculator]]; and the [[distribution-explorer]] uses events and sets in probability.

## How to use it

1. Choose **2 sets** or **3 sets**.
2. **Type an expression** in the box, tap the symbol keys, or pick an example. You can type u or | for ∪, n or & for ∩, an apostrophe ' for the complement ′, and a minus sign for the difference −. Δ is the symmetric difference.
3. The diagram shades the set and the line under it names each shaded region, such as A ∩ B′ ∩ C (in A and C but not B).
4. **Compare**: type a second expression. The page says whether the two are equal and, if not, which regions differ. The buttons fill in De Morgan's two laws and the distributive law.
5. **Use my own elements**: tick the box and type U, A, B (and C) as lists such as `1-12` or `2, 4, 6`. Each region shows its elements, the result is written out in roster form, and the counting facts fill in with your numbers.

## Order of the signs

The complement ′ is applied first, then ∩, then ∪, − and Δ from left to right, so A ∪ B ∩ C means A ∪ (B ∩ C). When in doubt, use brackets; the page shows how it read your expression in the heading above the diagram.

## Worked example

Take U = {1, 2, …, 12}, A = {1, 2, 3, 4, 5, 6}, B = the even numbers and C = the multiples of 3. Then A ∪ B = {1, 2, 3, 4, 5, 6, 8, 10, 12}, so (A ∪ B)′ = {7, 9, 11} and **(A ∪ B)′ ∩ C = {9}**: one element, in the region A′ ∩ B′ ∩ C. Counting: n(A) = 6, n(B) = 6 and n(A ∩ B) = 3, so n(A ∪ B) = 6 + 6 − 3 = **9**. For all three, n(A ∪ B ∪ C) = 6 + 6 + 4 − 3 − 2 − 2 + 1 = **10**.

## De Morgan's laws

(A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′. Press the De Morgan buttons and both diagrams shade the same regions. Try the wrong version, A′ ∪ B′ for (A ∪ B)′, and the page lists the regions where they differ.

## Check yourself

Five questions with fresh numbers: n(A ∪ B), a "neither" problem, De Morgan, three-set inclusion–exclusion and n(A − B). Nothing is saved.

## FAQ

**Why is my answer the empty set?** Some expressions cover no region, such as A ∩ A′. The page says so and shades nothing.

**Can I use more than three sets?** Not here: with four sets, circles can no longer show every region, which is why school problems stop at three.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
