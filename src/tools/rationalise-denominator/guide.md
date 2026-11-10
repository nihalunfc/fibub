---
name: Rationalise the denominator
num: 1277
shelf: learn
section: school-maths
title: "Rationalise the denominator step by step: k/√n, k/(a + b√n) and k/(√m ± √n)"
summary: "Type a fraction with a square root on the bottom and see it rationalised step by step: what to multiply by, how the root disappears from the denominator, the simplified answer and a decimal check. A picture shows why multiplying by the conjugate works: (x + y)(x − y) = x² − y²."
status: live
ads: false
order: 1277
icon: sigma
works: offline
updated: 2026-11-09
related: [identity-tiles, number-line-zoom, root-spiral]
sources:
  - "Standard school algebra: multiplying by √n/√n or by the conjugate, the identity (x + y)(x − y) = x² − y², and simplifying √(s²r) = s√r. Written for fibub; exact whole-number arithmetic."
  - "Checked against hand-worked examples (6/√3 = 2√3, 1/(2 + √3) = 2 − √3, 1/(√5 + √3) = (√5 − √3)/2, 5/(3 − √2) = (15 + 5√2)/7, 3/√12 = √3/2) and, for about 3,000 random fractions, the decimal value of the answer against that of the question."
flow:
  - { icon: pencil, label: "Type it" }
  - { icon: calculator, label: "Conjugate" }
  - { icon: sigma, label: "Simplify" }
  - { icon: check, label: "Practise" }
---

## What it does

A fraction like 5/(3 − √2) has an irrational number on the bottom. **Rationalising the denominator** rewrites it so the bottom is a whole number, which makes it easier to estimate, add to other fractions and compare. This page does it step by step for three kinds of fraction:

- **k/√n**: multiply top and bottom by √n, because √n × √n = n.
- **k/(a + b√n)**: multiply top and bottom by the **conjugate** a − b√n, because (a + b√n)(a − b√n) = a² − b²n, a whole number.
- **k/(√m ± √n)**: multiply by √m ∓ √n, because (√m + √n)(√m − √n) = m − n.

Each step is written with your numbers, the answer is simplified (common factors cancelled, and roots like √12 = 2√3 taken apart), and a decimal check shows the value has not changed. A picture shows why the conjugate works: a big square minus a small square is an L-shape that rearranges into a rectangle (x + y) by (x − y). It fits the Class 9 Maths chapter on the world of numbers (rationalising denominators) and the algebraic identities chapter.

The identity behind it is drawn with tiles in [[identity-tiles]]; to see where a number like 2 − √3 sits on the line, zoom in with the [[number-line-zoom]]; and to construct √n with a ruler, use the [[root-spiral]].

## How to use it

1. Pick the kind of fraction: **k/√n**, **k/(a + b√n)** or **k/(√m ± √n)**.
2. Type the whole numbers. b and a can be negative; n and m are the numbers under the roots.
3. Read the steps, the answer, and the decimal check.
4. If the bottom has no real root (for example 2 + √4 = 4) or is zero, the page says so.

## A worked example

The page starts with 5/(3 − √2).

1. Multiply top and bottom by (3 + √2)/(3 + √2), which is just 1.
2. Bottom: (3 − √2)(3 + √2) = 3² − (√2)² = 9 − 2 = 7.
3. Top: 5 × (3 + √2) = 15 + 5√2.
4. So 5/(3 − √2) = **(15 + 5√2)/7**.

Check: 5/(3 − √2) ≈ 3.15301 and (15 + 5√2)/7 ≈ 3.15301.

## Tips

- The conjugate of a + b√n is a − b√n: same numbers, opposite sign in the middle.
- When a² − b²n = 1, the fraction disappears completely: 1/(2 + √3) = 2 − √3.
- Simplify roots at the end: 3/√12 = 3√12/12 = 6√3/12 = √3/2.

## Check yourself

Four fresh questions: k/√n as a√n, 1/(a + √b) as p + q√b, 1/(√(m + 1) + √m) as √A − √B, and the decimal value of a rationalised fraction. Type the numbers asked for, in order. Nothing is saved.

## FAQ

**Why bother?** Before calculators, dividing by 1.414… by hand was slow; dividing by 7 was easy. Today it still makes answers easier to compare and to add, and examiners expect it.

**What about cube roots?** They need a different identity, a³ − b³ = (a − b)(a² + ab + b²), and are beyond this page.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
