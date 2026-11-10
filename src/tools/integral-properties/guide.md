---
name: Definite integral properties
num: 1470
shelf: learn
section: school-maths
title: "Definite integral properties, drawn: swap the limits, split at c, f(a + b − x), even and odd functions"
summary: "See each property of definite integrals as a picture with the numbers worked out: swapping the limits flips the sign, splitting at any c adds up, f(a + b − x) is the same area flipped, ∫₀²ᵏ in two halves, even functions double and odd functions cancel, and the area function A(x) whose slope is f(x)."
status: live
ads: false
order: 1470
icon: sigma
works: offline
updated: 2026-11-09
related: [riemann-sums, derivative-steps, e-and-ln, function-grapher]
sources:
  - "Standard properties of definite integrals and the first fundamental theorem of calculus. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14 (integrate): five integrals each of nine functions, the parity of each, and ∫₀^(π/2) sin x/(sin x + cos x) dx = π/4; integrals by composite Simpson's rule with 2000 strips."
flow:
  - { icon: book, label: "Property" }
  - { icon: curve, label: "Function" }
  - { icon: sliders, label: "Limits" }
  - { icon: check, label: "Both sides" }
---

## What it shows

A definite integral ∫ₐᵇ f(x) dx is the **signed area** between the graph of f and the x-axis from a to b: area above the axis counts plus, area below counts minus. Once you see it that way, the properties in your syllabus stop being rules to memorise and become things you can see. Pick a property, pick a function, move the limits, and the page draws both sides and works both out, so you can watch them agree.

- **Swap the limits**: going from b back to a flips the sign.
- **Split at c**: the area from a to b is the area from a to c plus the area from c to b, even when c lies outside [a, b].
- **f(a + b − x)**: this is the graph flipped left to right inside [a, b], so its area is the same. It is the trick behind many clever integrals, such as ∫₀^(π/2) sin x/(sin x + cos x) dx = π/4.
- **From 0 to 2k**: the second half can be flipped onto the first as f(2k − x).
- **Even and odd functions**: on [−k, k], an even function's halves are equal, so the integral is twice the right half; an odd function's halves cancel, so it is 0.
- **Area function**: A(x) = ∫ₐˣ f(t) dt grows at the rate f(x). This is the first fundamental theorem of calculus.

It follows integrals in Class 12 maths (definite integrals and their properties, the fundamental theorem). Before this page, [[riemann-sums]] shows where the area comes from; for the antiderivatives you need to work integrals by hand, [[derivative-steps]] runs the rules backwards in your head, and [[e-and-ln]] covers the eˣ and ln x you meet in them.

## How to use it

1. **Pick a property** from the first list.
2. **Pick f(x)**: x², x³ − x, sin x, cos x, |x|, eˣ, x sin x, 2x + 1 or sin² x, or choose *My own…* and type one, such as `x^2 cos(x)`.
3. **Move the sliders** that the property needs: a and b (the limits), c (the split point), k (the half-width) or x (the end of the area function).
4. Read the **numbers** under the picture: both sides of the property, worked out to four decimals, and a line saying whether they agree.

## Worked example

Pick *Even and odd functions* and x³ − x with k = 1.5. The right half ∫₀^1.5 (x³ − x) dx = 1.5⁴/4 − 1.5²/2 = 1.2656 − 1.125 = 0.1406, and the left half is −0.1406. The whole integral is 0, for any k, because x³ − x is odd. Switch to x² with k = 1.5: the halves are both 1.125 and the whole is 2.25 = 2 × 1.125.

Pick *Split at a point c* with x² from a = −0.5 to b = 2 and c = 0.75. The pieces are 0.1823 and 2.526, which add to 2.7083 = (8 + 0.125)/3, the whole integral.

## FAQ

**How does the page work the integrals out?** By Simpson's rule with 2000 strips, which is accurate to many decimals for these smooth functions. The checks compare it with exact answers from a computer algebra system.

**Why is |x| even but not smooth?** |x| has a corner at 0, but |−x| = |x|, so it is even and the shortcut works.

**Is this page part of NCERT?** No. fibub is independent. It follows the topics of the Class 12 maths syllabus and uses none of the textbook's text or exercises.
