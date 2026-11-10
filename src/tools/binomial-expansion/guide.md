---
name: Binomial expansion
num: 1192
shelf: learn
code: L95
section: school-maths
title: "Binomial expansion"
summary: "Expand (ax + b)ⁿ with exact coefficients, read them off Pascal's triangle, find the general term T(r+1) and the middle term(s), and drop balls through a Galton board to watch the same numbers turn into chances."
status: live
ads: false
order: 1192
icon: table
works: offline
updated: 2026-11-09
related: [combinatorics-calculator, distribution-explorer, probability-tree]
sources:
  - "Standard binomial theorem: (x + y)ⁿ = Σ C(n, r) xⁿ⁻ʳ yʳ, Pascal's rule C(n, r) = C(n − 1, r − 1) + C(n − 1, r), and the binomial distribution C(n, k)/2ⁿ for a fair Galton board. Written for fibub; no textbook text, figures or exercises are used."
  - "Coefficients checked against sympy's expand and binomial for several (ax + b)ⁿ, including negative b and n up to 12."
flow:
  - { icon: sliders, label: "Set a, b, n" }
  - { icon: table, label: "Pascal" }
  - { icon: sigma, label: "Term" }
  - { icon: chart, label: "Galton" }
---

## What it shows

The **binomial theorem** tells you how to multiply out (ax + b)ⁿ without doing it by hand n times. Each term is a number from **Pascal's triangle** times a power of ax times a power of b:

(ax + b)ⁿ = C(n, 0)(ax)ⁿ + C(n, 1)(ax)ⁿ⁻¹ b + C(n, 2)(ax)ⁿ⁻² b² + … + C(n, n) bⁿ

This page expands (ax + b)ⁿ for whole numbers a and b from −20 to 20 and n from 0 to 12, with exact coefficients however large they get. It highlights row n of Pascal's triangle, builds the **general term** T(r+1) = C(n, r)(ax)ⁿ⁻ʳ bʳ for any r you pick, names the **middle term** (or the two middle terms when n is odd), and adds up the coefficients. A **Galton board** underneath drops balls left or right at each peg, so you can see the same row of numbers turn into the chances of the binomial distribution.

It follows the binomial theorem in Class 11 maths, which builds on permutations and combinations and leads to probability in Class 12. For counting C(n, r) and arrangements on their own, use the [[combinatorics-calculator]]; afterwards, the [[distribution-explorer]] draws the binomial distribution for any p, and the [[probability-tree]] shows how chances multiply along branches.

## How to use it

1. Type **a** and **b** (whole numbers; b may be negative) and slide **n**.
2. Read the expansion. The blue row of the triangle is C(n, 0) to C(n, n).
3. Slide **r** to build any term T(r+1) step by step: the C(n, r), the power of ax and the power of b.
4. Read the facts: number of terms, the middle term(s), the sum of the coefficients and the term with no x.
5. Press **Drop 100 balls** or **Drop 1000**, and **Empty** to start again. The orange lines are the expected shares C(n, k)/2ⁿ.

## Worked example

Expand (2x − 3)⁵. Row 5 of Pascal's triangle is 1, 5, 10, 10, 5, 1. Term by term: 1 × 32x⁵, 5 × 16x⁴ × (−3) = −240x⁴, 10 × 8x³ × 9 = 720x³, 10 × 4x² × (−27) = −1080x², 5 × 2x × 81 = 810x and 1 × (−243). So

(2x − 3)⁵ = 32x⁵ − 240x⁴ + 720x³ − 1080x² + 810x − 243.

There are 6 terms; n = 5 is odd, so the middle terms are T₃ = 720x³ and T₄ = −1080x². Putting x = 1 gives the sum of the coefficients: (2 − 3)⁵ = −1.

## Why a Galton board?

Each ball meets n pegs and goes left or right with equal chance. To land in slot k it must go right exactly k times, and there are C(n, k) ways to choose which pegs, out of 2ⁿ equally likely paths. So the chance is C(n, k)/2ⁿ: the same row of Pascal's triangle, divided by its sum. With many balls the pile takes the bell shape of the binomial distribution.

## Check yourself

Five questions with fresh numbers: a value of C(n, r), a coefficient from the general term, the middle term, the sum of the coefficients and a Galton-board chance. Nothing is saved.

## FAQ

**Why does a negative b make the signs alternate?** The term with bʳ is negative when r is odd and positive when r is even.

**How many terms are there?** Always n + 1, from r = 0 to r = n.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
