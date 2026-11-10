---
name: Riemann sums
num: 1182
shelf: learn
code: L85
section: school-maths
title: "Riemann sums"
summary: "See the area under a curve filled with strips. Pick left, right, midpoint or trapezium sums, slide the number of strips n and watch the sum close in on the exact integral, with the error. Then see why ∫ f dx has a + C, and shade the area between two curves with the crossing points found for you."
status: live
ads: false
order: 1182
icon: chart
works: offline
updated: 2026-11-09
related: [derivative-slope, function-grapher, symbolic-algebra, numerical-methods]
sources:
  - "Standard calculus: Riemann sums, the trapezium rule, Simpson's rule, the fundamental theorem of calculus and the area between two curves. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against NumPy (sums on linspace grids and numpy.trapezoid) and SciPy (integrate.quad for integrals and areas, optimize.brentq for crossing points)."
flow:
  - { icon: curve, label: "Pick f(x)" }
  - { icon: sliders, label: "Strips n" }
  - { icon: chart, label: "Sum" }
  - { icon: target, label: "Integral" }
---

## What it shows

A definite integral is the area under a curve, counted as positive above the x-axis and negative below it. Nobody can measure a curved area directly, so we fill it with thin strips whose areas are easy, add them up, and see what the total settles on as the strips get thinner. That total is a **Riemann sum**, and the number it settles on is the **integral**.

This page draws the strips for you, gives the sum and the exact integral side by side, and shows the error shrinking as you add strips. Two more views go with it: the **antiderivative family** (why every indefinite integral ends in + C) and the **area between two curves**.

It follows the school topics of integrals and the application of integrals in Class 12 maths. Before it, the [[derivative-slope]] page shows what a derivative is (integration undoes it); for any curve you like, the [[function-grapher]] draws it, and [[symbolic-algebra]] finds antiderivatives with working.

## How to use it

1. **Riemann sums.** Pick a function, type the start *a* and end *b*, then choose **Left**, **Right**, **Midpoint** or **Trapezium** and slide the number of strips *n* (1 to 100). Blue strips sit above the axis, orange strips below it (they count as negative).
2. **Antiderivative + C.** Pick a function. The page draws a whole family of antiderivatives F(x) + C in grey and one of them in blue. Slide **C** to move it up or down, and slide **x** to see the tangents there: every curve in the family has the same slope, f(x).
3. **Area between curves.** Type two curves f and g. With the box ticked, the page finds where they cross and uses the first and last crossing as a and b; untick it to type your own. The area is split into pieces wherever the curves cross, so it always counts as positive.

## What each number means

- **Δx = (b − a) / n** is the width of every strip.
- **Left / right sum**: each strip is as tall as the curve at its left or right edge.
- **Midpoint sum**: each strip is as tall as the curve at its middle.
- **Trapezium sum**: each strip is a trapezium joining the curve at both edges.
- **∫ from a to b**: the exact value from the antiderivative, F(b) − F(a), for the ready-made functions; for a function you type, Simpson's rule with 4000 strips, which is accurate to many decimal places for smooth curves.
- **Error** is the sum minus the integral. The table shows the sums for n = 4, 8, 16, 32, 64 and 128: doubling n roughly halves the left and right errors and quarters the midpoint and trapezium errors.

## Worked example

Take f(x) = x² from 0 to 2 with n = 4, so Δx = 0.5. The left ends are 0, 0.5, 1 and 1.5, so the left sum is 0.5 × (0 + 0.25 + 1 + 2.25) = **1.75**. The right sum is 0.5 × (0.25 + 1 + 2.25 + 4) = **3.75**, the midpoint sum **2.625** and the trapezium sum **2.75**. The exact integral is [x³/3] from 0 to 2 = 8/3 ≈ **2.6667**. With n = 100 the left sum is 2.6268 and the right sum 2.7068, closing in from both sides.

For the area between y = 4 − x² and y = x, the curves cross at x ≈ −2.5616 and x ≈ 1.5616, and the area between them is about **11.682**.

## Check yourself

Five questions with fresh numbers: a small left sum to do by hand, two definite integrals, an area between a parabola and a line, and which sum is exact for a straight line. Type an answer (3/4 or 8/3 is fine) and press Check; open the working to see each step. Nothing is saved.

## FAQ

**Why is my integral negative?** The part of the curve below the x-axis counts as negative area. The "area between curves" view always counts area as positive.

**Why does sin x from 0 to 2π give 0?** The hump above the axis and the dip below it are the same size, so they cancel.

**Is this from my textbook?** It covers the standard topics that school maths teaches everywhere, with its own examples and pictures. It is an independent study aid.
