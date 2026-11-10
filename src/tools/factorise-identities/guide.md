---
name: Factorise with identities
num: 1285
shelf: learn
section: school-maths
title: "Factorise with identities: a² − b², perfect squares, cubes and the middle-term split, step by step"
summary: "Type a polynomial in x (or tap an example) and see it factorised step by step: the common factor first, then a² − b², (a ± b)², a³ ± b³, (a + b)³, splitting the middle term or the factor theorem. Two-bracket answers are drawn as an area model, and every answer is checked by multiplying back."
status: live
ads: false
order: 1285
icon: sigma
works: offline
updated: 2026-11-09
related: [identity-tiles, polynomial-zeros, quadratic-explorer, figurate-numbers]
sources:
  - "Algebraic identities, the middle-term split and the factor theorem are standard school algebra, written for fibub."
  - "Answers checked against the identities by hand and against Python sympy.factor for the examples on the page; every result is multiplied back and compared with the input, including 400 random products of whole-number factors."
flow:
  - { icon: pencil, label: "Type it" }
  - { icon: scissors, label: "Common" }
  - { icon: sigma, label: "Identity" }
  - { icon: check, label: "Multiply" }
---

## What it does

Factorising means writing an expression as a product of simpler ones, like 6 = 2 × 3 but for algebra: x² + 5x + 6 = (x + 2)(x + 3). The **algebraic identities** are shortcuts that make many factorisations quick, once you spot which one fits.

Type any polynomial in x with whole-number coefficients, up to x⁴, or tap an example. The page:

1. takes out the **common factor** first (a number and a power of x),
2. looks for an identity: **a² − b²**, **(a + b)²** and **(a − b)²**, **a³ + b³** and **a³ − b³**, **(a + b)³**,
3. otherwise **splits the middle term** of a quadratic (two numbers that multiply to ac and add to b),
4. and for cubics and quartics uses the **factor theorem**: if p(r) = 0 then (x − r) is a factor,
5. keeps going on each bracket until nothing more factorises with whole numbers.

Every step names the identity it used. When the answer is two brackets, the page draws the **area model**: a rectangle whose sides are the brackets and whose four parts are the terms. Finally it **checks** the answer by multiplying it back out and by putting x = 2 into both forms.

It fits the Class 9 maths chapters on algebraic identities and polynomials, and helps with every Class 10 quadratic. The identities as pictures are in [[identity-tiles]], the zeros you get from the factors are in [[polynomial-zeros]], and quadratic graphs are in [[quadratic-explorer]].

## How to use it

1. Type the expression, e.g. `9x^2 - 25` or `x² + 7x + 12`. Powers can be typed as x^2 or x².
2. Or tap an example, or press a **Random** button for a fresh one of that kind.
3. Read the steps, the answer and the check.

## A worked example

The page starts with **6x² + 5x − 6**.

- No common factor.
- a × c = 6 × (−6) = −36. Two numbers that multiply to −36 and add to 5 are −4 and 9.
- 6x² − 4x + 9x − 6 = 2x(3x − 2) + 3(3x − 2) = **(2x + 3)(3x − 2)**.
- Check: (2x + 3)(3x − 2) = 6x² − 4x + 9x − 6 = 6x² + 5x − 6. With x = 2 both give 28.

Now try **2x² − 18**: take out 2 to get 2(x² − 9), then a² − b² gives **2(x + 3)(x − 3)**.

## Tips

- Always look for a common factor first. It makes the numbers smaller and the identity easier to see.
- a² + b² (a plus sign between two squares) does not factorise with whole numbers.
- In a³ ± b³ the second bracket never factorises further with whole numbers.
- The identities also make mental maths quick: 103² = (100 + 3)² = 10 000 + 600 + 9 = 10 609.

## Check yourself

Four fresh questions each time: find the numbers in (x + m)(x + n), use a² − b² and (a + b)² for mental arithmetic, and find a² + b² from a + b and ab. Nothing is saved.

## FAQ

**What does "does not factorise with whole numbers" mean?** There is no way to write it as brackets with whole-number coefficients. Some (like x² − 2) factorise with square roots; others (like x² + 1) need numbers beyond the real numbers.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
