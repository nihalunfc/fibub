---
name: Relation checker
num: 1193
shelf: learn
section: school-maths
title: "Relation checker: reflexive, symmetric, transitive, equivalence classes and functions"
summary: "Tap a table or type pairs to build a relation on {1, ..., n}, see it as an arrow diagram, and check reflexive, symmetric, transitive and antisymmetric with a counterexample for every no. Find equivalence classes, closures, and whether the relation is a one-one, onto function."
status: live
ads: false
order: 1193
icon: link
works: offline
updated: 2026-11-09
related: [venn-diagram, logic-simplifier, combinatorics-calculator]
sources:
  - "Standard definitions of relations on a set: reflexive, symmetric, antisymmetric and transitive relations, equivalence relations and classes, partial orders, closures (Warshall's method for the transitive closure) and functions. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked by counting every relation on 3 and 4 elements (512 and 65,536 relations) and comparing with a Python brute force: 171 and 3994 transitive, 5 and 15 equivalence, 19 and 219 partial orders."
flow:
  - { icon: table, label: "Tap pairs" }
  - { icon: link, label: "Arrows" }
  - { icon: check, label: "Properties" }
  - { icon: target, label: "Classes" }
---

## What it shows

A **relation** R on a set A is any collection of ordered pairs (a, b) from A × A; we write a R b when (a, b) is in R. This page lets you build one on A = {1, 2, ..., n} (n from 2 to 6) by tapping a table or typing pairs, and draws it as an **arrow diagram**: an arrow from a to b for each pair, and a small loop when a R a.

It then checks the four properties you meet in school, and for every "No" it shows the exact pair that breaks the rule:

- **Reflexive**: every a has a R a (every number has a loop).
- **Symmetric**: whenever a R b, also b R a (arrows come in both directions).
- **Transitive**: whenever a R b and b R c, also a R c (every two-step path has a shortcut).
- **Antisymmetric**: a R b and b R a only when a = b.

A relation that is reflexive, symmetric and transitive is an **equivalence relation**, and the page lists its **equivalence classes**. Reflexive, antisymmetric and transitive makes a **partial order**. It also says whether R is a **function** from A to A, and whether that function is one-one and onto.

It follows relations and functions in Class 11 maths and the types of relations and functions in Class 12. Sets come first in the [[venn-diagram]] calculator; the [[logic-simplifier]] works with the same "and", "or" and "if ... then" that the definitions use, and the [[combinatorics-calculator]] counts the arrangements behind the numbers of relations and functions.

## How to use it

1. Choose the **size of A** and a starting relation, such as a ≤ b or a − b is even.
2. Tap squares to add or remove pairs (row a, column b), or type pairs like (1, 2), (2, 3) and press Enter.
3. Read the checks. A red "No" comes with the pair that breaks the rule.
4. Press **reflexive**, **symmetric**, **transitive** or **an equivalence** to add the fewest pairs that give R that property (its closure). Added pairs show in orange.

## Worked example

On A = {1, 2, 3, 4}, let a R b when a − b is even. Then R = {(1, 1), (1, 3), (2, 2), (2, 4), (3, 1), (3, 3), (4, 2), (4, 4)}.

- Reflexive: a − a = 0 is even, so yes.
- Symmetric: if a − b is even, so is b − a = −(a − b). Yes.
- Transitive: (a − b) + (b − c) = a − c, and the sum of two even numbers is even. Yes.

So R is an equivalence relation, with classes {1, 3} (the odd numbers) and {2, 4} (the even numbers). It is not antisymmetric, because both (1, 3) and (3, 1) are in R.

Now start from b = a + 1, which gives {(1, 2), (2, 3), (3, 4)}. It fails transitivity: (1, 2) and (2, 3) are in R but (1, 3) is not. Press **transitive** and the page adds (1, 3), (1, 4) and (2, 4), which turns it into a < b.

## Counting relations

A × A has n² pairs, and each is in R or not, so a set of n elements has 2^(n²) relations. Of these, 2^(n² − n) are reflexive and 2^(n(n + 1)/2) are symmetric. The number of equivalence relations is the Bell number (1, 2, 5, 15, 52, 203 for n = 1 to 6), and there are nⁿ functions from A to A.

## Check yourself

Five questions with fresh numbers: spot a property, complete a transitive relation, count equivalence classes, count relations and count one-one functions. Nothing is saved.

## FAQ

**Can a relation be symmetric and antisymmetric?** Yes: a = b (only loops) is both. The empty relation is too.

**Is the empty relation transitive?** Yes. There is no a R b and b R c to break the rule.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
