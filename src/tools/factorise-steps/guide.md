---
name: Factorising steps
num: 1284
shelf: learn
code: L165
section: school-maths
title: "Factorising steps"
summary: "Type whole-number coefficients and watch the expression factorised step by step: the common factor, the identity that fits (a² − b², (a ± b)², a³ ± b³) or the split middle term, an area picture of the two brackets, and a check by expanding and by putting in a number."
status: live
ads: false
order: 1284
icon: sigma
works: offline
updated: 2026-11-09
related: [identity-tiles, polynomial-zeros, quadratic-explorer, symbolic-algebra]
sources:
  - "Algebraic identities ((a ± b)², a² − b², a³ ± b³) and factorising by splitting the middle term are standard school algebra. Written for fibub; the examples are fibub's own."
  - "Every answer checked against sympy.factor (x² + 7x + 12, 6x² − 5x − 6, 9x² − 12x + 4, −2x² − 14x − 24, 49x² − 16, 8x³ + 27, 2x³ − 16), and 1 400 products (px + q)(rx + s) factorised back and re-expanded exactly."
flow:
  - { icon: pencil, label: "Expression" }
  - { icon: search, label: "Identity" }
  - { icon: table, label: "Area" }
  - { icon: check, label: "Practise" }
---

## What it does

Factorising is expanding brackets backwards: you start with 6x² − 5x − 6 and find the brackets (2x − 3)(3x + 2) that multiply to give it. This page does it **step by step**, the way you would write it in a test:

- **ax² + bx + c**: take out any common factor, look for two numbers that multiply to a × c and add to b, split the middle term, group in pairs, and write the two brackets. If the first and last terms are squares it also names the **perfect-square identity** (a ± b)².
- **a² − b²**: spot a square minus a square, as in 49x² − 16 = (7x + 4)(7x − 4).
- **a³ + b³ and a³ − b³**: spot two cubes and use (a + b)(a² − ab + b²) or (a − b)(a² + ab + b²).

Every answer is **checked by expanding** it again and by putting **x = 2** into both forms. For quadratics an **area picture** shows the two brackets as the sides of a rectangle made of four parts.

It follows the Class 9 maths chapter on **algebraic identities** and the Class 10 chapters on polynomials and quadratic equations (factorising to solve).

See the identities as pictures with sliders in [[identity-tiles]]; once a quadratic is factorised, its zeros are where each bracket is 0, as the [[polynomial-zeros]] tool shows, and the graph is drawn in the [[quadratic-explorer]].

## How to use it

1. Choose the kind of expression: **ax² + bx + c**, **a² − b²** (type p and q for px² − q) or **a³ ± b³** (p and q for px³ ± q, with the sign).
2. Type whole numbers. The expression and its factorised form appear at the top.
3. Read **Step by step**. If it cannot be factorised with whole numbers, the last step says why.
4. **New example** makes a fresh one that does factorise.
5. For a quadratic, **As an area** shows the rectangle: its width and height are the brackets, and the four parts are the terms you get when you expand.

## A worked example

The page starts with **6x² − 5x − 6**.

1. Two numbers that multiply to a × c = 6 × (−6) = −36 and add to −5: they are −9 and 4.
2. Split the middle term: 6x² − 9x + 4x − 6.
3. Group in pairs: 3x(2x − 3) + 2(2x − 3) = **(2x − 3)(3x + 2)**.
4. Check: expanding gives 6x² + 4x − 9x − 6 = 6x² − 5x − 6. With x = 2 both forms give 8.

For **49x² − 16**: 49x² = (7x)² and 16 = 4², so it is (7x + 4)(7x − 4). For **8x³ + 27**: 8x³ = (2x)³ and 27 = 3³, so it is (2x + 3)(4x² − 6x + 9).

## Tips

- Always take out a common factor first: 3x² + 6x + 3 = 3(x² + 2x + 1) = 3(x + 1)².
- If no two whole numbers work, b² − 4ac is not a perfect square and the quadratic does not split into whole-number brackets.
- The identities also help with mental arithmetic: 53² − 47² = (53 + 47)(53 − 47) = 600.

## Check yourself

Four fresh questions each time: find the two numbers for a quadratic, and use identities to work out squares, a difference of squares and a cube bracket. For two numbers, type them with a comma between. Nothing is saved.

## FAQ

**Why only whole numbers?** That is how factorising is taught at school. Quadratics with other roots are solved with the quadratic formula, as in the [[quadratic-explorer]].

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
