---
name: Quadratic explorer
num: 1151
shelf: learn
section: school-maths
title: "Quadratic equations explorer: parabola, roots, discriminant and completing the square"
summary: "Slide a, b and c and watch the parabola move: vertex, roots and the discriminant update live, completing the square is drawn with tiles, and the middle term is split for you. With fresh practice questions."
status: live
ads: false
order: 1151
icon: curve
works: offline
updated: 2026-11-09
related: [function-grapher, symbolic-algebra]
sources:
  - "Standard school algebra: the quadratic formula, the discriminant b² − 4ac, the vertex at x = −b/2a, completing the square and splitting the middle term. Written for fibub; not taken from any textbook."
  - "Roots checked against numpy.roots and hand-worked examples; every whole-number split checked by expanding the factors back."
flow:
  - { icon: sliders, label: "Slide a b c" }
  - { icon: curve, label: "See curve" }
  - { icon: sigma, label: "Discriminant" }
  - { icon: check, label: "Practise" }
---

## What it does

A quadratic equation ax² + bx + c = 0 is the place where the parabola y = ax² + bx + c crosses the x axis. This explorer puts the picture and the algebra side by side, so you can see why there are sometimes two roots, sometimes one and sometimes none. It follows the Class 10 maths topic *quadratic equations* (solving by factorisation, the quadratic formula and the nature of roots), and with the **Class 11** level it also shows complex roots, from the Class 11 chapter on complex numbers and quadratic equations.

Draw several curves together on the [[function-grapher]], or expand and factor bigger expressions with [[symbolic-algebra]].

## How to use it

1. **Move the sliders** for a, b and c, or type values in the boxes beside them. The equation at the top and the graph change at once.
2. **Drag the blue dot** (the vertex) around the graph. The curve slides with it; a stays the same, while b and c change to match.
3. Read the facts under the graph: the **vertex**, the **axis of symmetry**, whether the curve opens up or down, the **roots** and where the curve meets the y axis.
4. The **discriminant** card shows D = b² − 4ac with your numbers in it and says what kind of roots you have. The quadratic formula is filled in below it.
5. **Completing the square** draws the x² tile, two strips of half of b each and the missing corner square, then lists every step of the algebra.
6. **Split the middle term** looks for two whole numbers that add to b and multiply to a × c, then shows the factors.
7. The quick buttons give a curve with two roots, one that just touches the axis, one that misses it and one upside down.

## What each setting does

- **a** sets how steep the parabola is and which way it opens. Positive a opens upwards, negative a opens downwards. a cannot be 0 (then there is no x² term and the graph is a straight line).
- **b** slides the vertex sideways and down, because the axis of symmetry is x = −b/2a.
- **c** moves the whole curve up and down; it is where the curve meets the y axis.
- **Level**: Class 10 says "no real roots" when D < 0. Class 11 also gives the complex roots p ± qi and the sum and product of roots, −b/a and c/a.

## A worked example

Start with the page's first example, x² − 5x + 6 = 0.

- D = (−5)² − 4 × 1 × 6 = 25 − 24 = 1. D is positive, so there are two different real roots.
- Formula: x = (5 ± 1) / 2, so x = 2 or x = 3. The two green dots sit at 2 and 3 on the x axis.
- Vertex: x = −b/2a = 2.5, and y = 2.5² − 5 × 2.5 + 6 = −0.25, so the lowest point is (2.5, −0.25).
- Splitting the middle term: two numbers that add to −5 and multiply to 6 are −3 and −2, so x² − 5x + 6 = (x − 2)(x − 3).
- Completing the square: x² − 5x = −6; add (2.5)² = 6.25 to both sides; (x − 2.5)² = 0.25; x − 2.5 = ± 0.5.

Now press **Touches** (x² − 4x + 4): D = 0 and the vertex sits on the axis at x = 2. Press **Misses** (x² + 2x + 5): D = −16, so there is no real root; switch to Class 11 to see −1 ± 2i.

## Check yourself

The last card gives four fresh questions each time: solve a quadratic, find a discriminant, find a vertex and build a quadratic from its roots. Type your answer and press **Check**. If it is wrong you can try again or open the worked answer. Nothing you type is saved or sent.

## FAQ

**Why does the curve sometimes run off the graph?** The graph shows x from −8 to 8 and y from −10 to 10 so that you can compare curves on the same grid. The vertex dot stays on the edge so you can drag it back.

**Why does splitting the middle term sometimes fail?** It only works when the roots are rational, which happens when D is a perfect square. Otherwise use the quadratic formula.

**Is this the same as the NCERT book?** It covers the same topics but is written by fibub. It is not part of NCERT. Use it next to your textbook.
