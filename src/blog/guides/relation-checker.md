---
title: "Reflexive, symmetric and transitive relations, checked with examples"
summary: "Build a relation on a small set, see it as arrows, and learn to test reflexive, symmetric, transitive and antisymmetric, find equivalence classes and spot functions."
tools: [relation-checker, venn-diagram, logic-simplifier, combinatorics-calculator]
updated: 2026-11-10
sources:
  - "Definitions of relations, their properties, equivalence classes, partial orders, closures and functions, and the counts 2^(n²), 2^(n² − n), 2^(n(n + 1)/2) and Bell numbers: standard discrete mathematics."
---

The relation checker is a sandbox for relations on a small set {1, ..., n}. You switch pairs on and off in a table, the page draws them as arrows, and it tells you which of the four classic properties hold, with the exact pair that breaks each one that fails. It is written for Class 11 and 12 students working on relations and functions. If sets themselves are new, start with the [[venn-diagram]]; for the "and", "or" and "if ... then" hiding inside every definition, see the [[logic-simplifier]]; and to count how many relations or functions exist, use the [[combinatorics-calculator]].

## What it is

Take a set A. A **relation** R on A is simply a chosen list of ordered pairs (a, b), where both a and b come from A. If (a, b) is on the list, we say "a is related to b" and write a R b. Order matters: (1, 2) and (2, 1) are different pairs.

Four properties come up again and again:

- **Reflexive**: every element is related to itself. Every dot has a loop.
- **Symmetric**: if a R b, then b R a. Every arrow has a partner pointing back.
- **Transitive**: if a R b and b R c, then a R c. Any two-step journey also has a direct arrow.
- **Antisymmetric**: two different elements are never related both ways.

A relation with the first three is an **equivalence relation**. It sorts A into separate groups called **equivalence classes**, where everything in a group is related to everything else in it. A relation that is reflexive, antisymmetric and transitive is a **partial order**, like "less than or equal to".

A relation is a **function** from A to A when every element has exactly one arrow leaving it. It is **one-one** when no two elements point to the same place; on a finite set to itself, one-one and onto go together.

## How to use it

1. Set the **Size of A** slider anywhere from 2 to 6.
2. Pick a starting point from **Start from**: a = b, a ≤ b, a divides b, a − b is even, b = a + 1, a < b, every pair, or empty.
3. Tap squares in the table to add or remove pairs (row a, column b), or type pairs such as (1, 2), (3, 4) into **Pairs in R** and press Enter.
4. Read the arrow diagram and the list of checks. Each "No" names the pair that breaks the rule.
5. Under **Make it …**, press **reflexive**, **symmetric**, **transitive** or **an equivalence** to add the fewest pairs that give that property. The new pairs turn orange.
6. Read the counting line under the buttons, then try the practice questions.

## A worked example

Set the size to 4 and start from **a divides b**. The table fills with 8 pairs:

(1, 1), (1, 2), (1, 3), (1, 4), (2, 2), (2, 4), (3, 3), (4, 4)

- Reflexive: yes, every number divides itself.
- Symmetric: no. The page points to (1, 2): 1 divides 2, but 2 does not divide 1.
- Antisymmetric: yes. If a divides b and b divides a, they must be equal.
- Transitive: yes. If a divides b and b divides c, then a divides c.

So "divides" is a **partial order** on {1, 2, 3, 4}, not an equivalence relation.

Now clear it and type **(1, 2), (2, 1), (3, 4)**. Every check fails. The transitive counterexample is a surprise to many students: (1, 2) and (2, 1) are in R, so (1, 1) must be too, and it is not.

Press **an equivalence**. The page adds five orange pairs: the four loops and (4, 3). R now has 8 pairs and two classes, {1, 2} and {3, 4}.

Last, type **(1, 2), (2, 3), (3, 1), (4, 4)**. Each row has exactly one dot, so this is a function: 1→2, 2→3, 3→1, 4→4. No column repeats, so it is one-one and onto, a bijection.

For a set of 4 elements, the counting line reports 2¹⁶ = 65,536 relations in all, 4,096 reflexive, 1,024 symmetric, 15 equivalence relations and 256 functions.

## Where it is used

- **Databases.** A table of "who follows whom" or "which course needs which" is a relation. Transitive closure answers "can I reach this from that?", such as all the courses you must pass first.
- **Computer science.** Finding the parts of a network that are linked to each other is finding equivalence classes. Build tools sort tasks using partial orders.
- **Number theory.** "Leaves the same remainder when divided by 5" is an equivalence relation; its classes are the remainders 0 to 4.

## Common mistakes

- **Testing only the pairs you see.** Reflexive needs every loop, including elements with no arrows at all. A missing element is a missing loop.
- **Thinking symmetric and antisymmetric are opposites.** A relation can be both (only loops) or neither. Check each one on its own.
- **Missing the a = c case in transitivity.** If (a, b) and (b, a) are both in R, then (a, a) must be as well.
- **Calling any relation a function.** Every element needs exactly one arrow out. Zero or two arrows from one element means it is not a function.
- **Reading the table the wrong way round.** The row is a and the column is b. Square (2, 4) means 2 R 4, not 4 R 2.

## Questions people ask

**Is "is a friend of" an equivalence relation?** Usually not. It is symmetric, but your friend's friend need not be your friend, so it fails transitivity.

**Why does the closure button sometimes add many pairs?** The transitive closure keeps adding shortcuts until no two-step path is missing, and new shortcuts can create new paths.

**Do the classes always cover the whole set?** Yes, for an equivalence relation. Every element sits in exactly one class, because each is related at least to itself.

