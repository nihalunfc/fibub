---
name: Algebraic identity tiles
num: 1158
shelf: learn
code: L75
section: school-maths
title: "Algebraic identities as area models: (a + b)², (a − b)², a² − b², (x + a)(x + b) and (a + b)³ blocks"
summary: "See each algebraic identity as a picture: slide a and b and the square or rectangle splits into its pieces with the identity filled in. Watch a² − b² turn into (a + b)(a − b), and pull the cube (a + b)³ apart into eight blocks."
status: live
ads: false
order: 1158
icon: crop
works: offline
updated: 2026-11-09
related: [quadratic-explorer, polynomial-zeros, symbolic-algebra]
sources:
  - "The standard algebraic identities and their area and volume models are classical mathematics. Pictures and wording are fibub's own."
  - "Every identity checked with sympy.expand; the tiles are checked to fill each shape exactly for random sizes, and the cube's blocks to fill (a + b)³ with counts 1, 3, 3, 1."
flow:
  - { icon: sliders, label: "Sizes" }
  - { icon: crop, label: "Pieces" }
  - { icon: sigma, label: "Identity" }
  - { icon: check, label: "Practise" }
---

## What it does

An identity such as (a + b)² = a² + 2ab + b² is true for every a and b. The easiest way to see why is to draw it: a square of side a + b cuts into a square a², a square b² and two rectangles a × b. This page draws six identities that way, with your own numbers:

- **(a + b)² = a² + 2ab + b²**
- **(a − b)² = a² − 2ab + b²**: two strips are cut off a², and the corner they share comes back once.
- **(a + b)(a − b) = a² − b²**: cut b² out of a², slide the leftover strip across, and the L shape becomes a rectangle.
- **(x + a)(x + b) = x² + (a + b)x + ab**
- **(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca**
- **(a + b)³ = a³ + 3a²b + 3ab² + b³**: a cube made of eight blocks that you can pull apart.

It fits the Class 8 topic *algebraic expressions and identities* and the identities in the Class 9 *polynomials* chapter (including the three-term square and the cube).

Use these identities to factor quadratics in the [[quadratic-explorer]] and to read sums and products of zeros in [[polynomial-zeros]]. For bigger expressions, let [[symbolic-algebra]] expand or factor them.

## How to use it

1. Pick an identity at the top.
2. Move the sliders (or type values) for a, b, and where needed x or c. The picture redraws and every piece shows its name.
3. The line under the picture puts your numbers into the identity and adds the pieces up.
4. For **(a + b)(a − b)**, use the ↔ slider to move the strip. For **(a + b)³**, use the ↕ slider to pull the eight blocks apart; labels appear when they are apart.

## A worked example

The page starts with (a + b)² for a = 5 and b = 3.

- The big square has side 8, so its area is 64.
- The pieces: a² = 25, two strips of ab = 15 each, and b² = 9.
- 25 + 2 × 15 + 9 = 64. ✓

Switch to **(a + b)(a − b)** with the same numbers: 8 × 2 = 16 and 25 − 9 = 16. The cut-out corner is b² = 9, and the leftover strip 2 × 3 moves to make the rectangle 8 × 2.

Switch to **(a + b)³**: 512 = 125 + 3 × 75 + 3 × 45 + 27.

## Tips for mental maths

- 103² = (100 + 3)² = 10 000 + 600 + 9 = 10 609.
- 98² = (100 − 2)² = 10 000 − 400 + 4 = 9 604.
- 105 × 95 = 100² − 5² = 9 975.

The **Check yourself** questions practise exactly these tricks, plus factoring x² + px + q and finding a² + b² from a + b and ab. Nothing you type is saved.

## FAQ

**Why must b be smaller than a in two of the pictures?** The identities hold for any numbers, but a picture of a − b only makes sense when a − b is a length. The page tells you if b is bigger.

**Is this from the NCERT book?** It covers the same identities with fibub's own pictures and examples. fibub is not part of NCERT.
