---
name: Combinatorics calculator
num: 557
shelf: science
section: discrete-maths-and-graph-theory
title: "Combinatorics calculator: permutations, combinations, multinomials, Stirling, Bell, Catalan, partitions and derangements (exact)"
summary: "Count exactly, with every digit: permutations and combinations with or without repetition, multinomial coefficients (arrangements of a word), Stirling numbers of both kinds, Lah numbers, Bell and Catalan numbers, integer partitions and derangements, with tables you can download."
status: live
ads: true
order: 557
icon: calculator
works: offline
updated: 2026-11-09
related: [number-theory-toolkit, group-explorer, sample-size, graph-algorithms, logic-simplifier, distribution-explorer]
sources:
  - "Standard counting formulas and recurrences (Pascal's rule, Stirling's recurrences, the Bell triangle, Euler's pentagonal number theorem)."
  - "Checked against sympy (binomial, ff, multinomial_coefficients, stirling, bell, catalan, npartitions, nT, subfactorial), including C(1000, 500), B(300), C(1000) and p(20000)."
flow:
  - { icon: pencil, label: "n and k" }
  - { icon: calculator, label: "Count" }
  - { icon: table, label: "Tables" }
---

## What it does

Counting problems turn up in probability, statistics, chemistry and computing, and the answers grow fast: there are 2 598 960 poker hands and 80 658 175 170 943 878 571 660 636 856 403 766 975 289 505 440 883 277 824 000 000 000 000 ways to shuffle a deck. Calculators round these off; this one keeps every digit, using exact whole-number arithmetic.

- **Choose and arrange:** for n things and k picks, all four classic counts at once: order matters or not, repeats allowed or not (nPk, n^k, nCk and C(n + k − 1, k)), with n!.
- **Multinomial:** n! / (k1! k2! …), the ways to split things into groups of given sizes. Type a word and it counts the different arrangements of its letters.
- **Special numbers** for any n: partitions p(n), Bell B(n), Catalan C(n), derangements !n and n!, with a table of every value from 0 to n.
- **Triangles:** Pascal's triangle, Stirling numbers of the first kind c(n, k) and second kind S(n, k), Lah numbers and partitions into exactly k parts, with your entry highlighted.

Turn counts into probabilities in the [[distribution-explorer]], and work with primes and remainders in the [[number-theory-toolkit]].

## How to use it

1. Pick a tab and type n (and k).
2. Long numbers are shortened to their first and last digits with the digit count and a rounded scientific form. Tick **Show every digit** to see them in full.
3. Download a table as CSV (always with every digit), or the whole result as an image, PDF or Word file.

## Which count do I need?

Ask two questions: does the **order** matter, and can the same thing be picked **again**? A race podium is ordered without repeats (nPk). A PIN is ordered with repeats (n^k). A lottery ticket is unordered without repeats (nCk). Choosing 3 scoops from 10 flavours, where two scoops can be the same flavour, is unordered with repeats (C(n + k − 1, k)).

## Worked example

The page opens with n = 10 and k = 3: **C(10, 3) = 120** combinations, 10P3 = 720 ordered picks, 10^3 = 1000 codes, and C(12, 3) = 220 multisets of 3 from 10 flavours; 10! = 3 628 800.

Multinomial: MISSISSIPPI has letters in groups of 1, 4, 4 and 2, so it has 11! / (1! 4! 4! 2!) = **34 650** different arrangements.

Special numbers for n = 10: p(10) = 42 partitions, B(10) = 115 975 ways to group 10 people, C(10) = 16 796 and !10 = 1 334 961 derangements: about 36.8 % of shuffles leave no card in place, close to 1/e.

Triangles: S(5, 2) = 15 ways to split 5 people into 2 teams, and row 5 adds up to the Bell number 52.

## Frequently asked questions

**How big can n be?** Up to 5000 for most counts, 400 for the triangles and Bell numbers, and 20 000 for partitions. C(5000, 2500) has 1504 digits and appears at once.

**What is a derangement?** A rearrangement where nothing stays in its place, as in a Secret Santa draw where nobody gets their own name.

**Is anything sent anywhere?** No. All the arithmetic is done in your browser.
