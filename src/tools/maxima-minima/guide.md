---
name: Maxima and minima finder
num: 1184
shelf: learn
section: school-maths
title: "Maxima and minima finder: f, f′ and f″ stacked, first and second derivative tests, optimisation problems"
summary: "See a function, its slope f′ and its bending f″ stacked one above the other, with every turning point found and tested by the first and second derivative tests, the absolute maximum and minimum on an interval, and three optimisation stories (open box, fence by a river, closed can) with the working."
status: live
ads: false
order: 1184
icon: chart
works: offline
updated: 2026-11-09
related: [derivative-slope, riemann-sums, function-grapher, symbolic-algebra]
sources:
  - "Standard calculus: critical points, the first and second derivative tests, absolute extremes on a closed interval, and classic optimisation problems (open box, three-sided fence, closed cylinder). Written for fibub; no textbook text, figures or exercises are used, and the sizes are made-up examples."
  - "Checked against sympy 1.14: critical points, function values and second derivatives of every ready-made function (solveset, diff) and the optimum of each story (solve)."
flow:
  - { icon: curve, label: "Pick f(x)" }
  - { icon: chart, label: "f, f′, f″" }
  - { icon: target, label: "Turns" }
  - { icon: check, label: "Tests" }
---

## What it shows

A smooth curve turns round at the top of a hill (a **local maximum**) or the bottom of a valley (a **local minimum**). At those points the tangent is flat, so the derivative f′(x) is 0. This page draws **f**, **f′** and **f″** one above the other on the same x scale, so you can see the connection: where f climbs, f′ is above the axis; where f falls, f′ is below; where f turns, f′ crosses zero. And f″ tells you which way the curve bends, which is the second derivative test.

The second view, **Optimisation stories**, uses the same idea on real problems: the biggest open box from a square sheet, the biggest field from a fixed length of fence, and the can that uses the least metal.

It follows the application of derivatives in Class 12 maths (increasing and decreasing functions, maxima and minima). Start with [[derivative-slope]] if f′ is new; afterwards [[riemann-sums]] covers integration, and the [[function-grapher]] finds turning points on any curve you draw.

## How to use it

1. **Turning points.** Pick a function, or choose *My own…* and type one such as `x^3 - 6x^2 + 9x + 1`. Set the interval from a to b.
2. Slide **Look at x** to move a cursor through all three graphs; the sentence under the picture says whether f is rising or falling and which way it bends there.
3. Read the **table**: each critical point with f(x), the sign of f′ just left and right, f″(x), and what the two tests say.
4. Read the **absolute maximum and minimum** on [a, b]: the page compares the values at both ends with the values at the critical points.
5. **Optimisation stories.** Pick a story, type the size (sheet side, fence length or can volume) and slide the choice you can make (the cut, the width, the radius). The graph shows the quantity you want to make biggest or smallest, with the best point in green, and the working lists each step.

## The two tests

- **First derivative test**: if f′ goes from + to − as x passes c, f has a local maximum at c; from − to + is a local minimum; no change of sign means neither (like x³ at 0).
- **Second derivative test**: at a point where f′(c) = 0, f″(c) < 0 means a maximum (the curve bends down) and f″(c) > 0 a minimum. If f″(c) = 0 the test fails and you go back to the first test (like x⁴ at 0).

## Worked example

For f(x) = x³ − 3x, f′(x) = 3x² − 3 = 0 at x = −1 and x = 1. f″(x) = 6x is −6 at x = −1 (a local maximum, f = 2) and 6 at x = 1 (a local minimum, f = −2). On the interval [−2.5, 2.5] the ends give f(−2.5) = −8.125 and f(2.5) = 8.125, so the absolute maximum is 8.125 at the right end, bigger than the local maximum.

**Open box:** from a 30 cm sheet, cutting squares of side x gives V = x(30 − 2x)². V′ = (30 − 2x)(30 − 6x) = 0 at x = 5, where V = 5 × 20 × 20 = **2000 cm³**. **Can:** for 500 cm³ the least metal is about 348.73 cm², with r ≈ 4.30 cm and the height equal to the diameter.

## Check yourself

Five questions with fresh numbers: a critical point of a quadratic, a local maximum of a cubic, a second derivative test, the best cut for a box and the biggest fenced area. Nothing is saved.

## FAQ

**Why can a local maximum be lower than a local minimum?** "Local" only compares nearby points. For x + 1/x the hill at x = −1 has height −2 and the valley at x = 1 has height 2.

**Why check the ends of the interval?** On a closed interval the biggest or smallest value can sit at an end, where f′ need not be zero.

**Is this from my textbook?** It covers the standard school topics with its own examples and numbers. It is an independent study aid.
