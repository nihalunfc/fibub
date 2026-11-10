---
name: Circle area
num: 1253
shelf: learn
code: L138
section: school-maths
title: "Circle area"
summary: "Cut a circle into 4 to 200 equal slices and watch them unroll into a row that looks more and more like a rectangle πr wide and r tall. Live numbers show width × height closing in on πr²."
status: live
ads: false
order: 1253
icon: compass
works: offline
updated: 2026-11-09
related: [area-shear, circle-sector, picks-theorem, limit-zoom]
sources:
  - "The slicing argument for the area of a circle and the inscribed-polygon area (n/2)·r²·sin(2π/n) are standard geometry. Pictures and questions written for fibub."
  - "Checked: width × height of the row equals the inscribed regular n-gon area (n/2)·r²·sin(2π/n) and tends to πr² (within 0.02% at n = 200), in Python and in tests/sci-tools/circle-slices.mjs."
flow:
  - { icon: compass, label: "Circle" }
  - { icon: scissors, label: "Slice" }
  - { icon: ruler, label: "Unroll" }
  - { icon: check, label: "πr²" }
---

## What it does

Why is the area of a circle **πr²**? Cut a circle into equal slices like a pizza and lay them in a row, one pointing up, the next pointing down. The row looks a bit like a parallelogram:

- its **height** is about the radius, **r**;
- its **width** is half the slices' curved edges, which is half the circumference: **½ × 2πr = πr**.

So the area is about **πr × r = πr²**. With more and thinner slices, the bumps along the top and bottom flatten out, the slanted ends stand up, and the row becomes a true rectangle. This page lets you watch that happen with 4, 8, 16 or up to 200 slices, and shows the numbers getting closer to πr².

It follows the Class 8 maths chapter *Area* (area of a circle) and helps with circle areas in Class 10. Why sliding a shape keeps its area is in [[area-shear]], and the area of one slice (a sector) is in [[circle-sector]].

## How to use it

1. Set the number of slices **n** (always even, so half point up and half point down).
2. Set the radius **r** (in cm, or any unit).
3. Move **Unroll** to slide the slices between the circle and the row, or press **Play**.
4. Read the width, height and width × height of the row and compare them with πr².

## A worked example

The page starts with r = 7 cm and 8 slices.

- Each slice's straight edge (chord) is 2 × 7 × sin(22.5°) ≈ 5.358 cm. Four slices point up, so the row is about 4 × 5.358 = 21.43 cm wide.
- The height from tip to chord is 7 × cos(22.5°) ≈ 6.467 cm.
- Width × height ≈ 138.6 cm², which is 90.03% of πr² = π × 49 ≈ 153.94 cm².

With 64 slices the row is 21.98 cm wide (π × 7 = 21.99) and 6.99 cm tall, and width × height is 99.84% of πr². With 200 slices it is 99.98%.

## Tips

- The curved top of the row is always exactly half the circle's edge, πr. Only the straight-line measurement here falls a little short with few slices.
- Area grows with the **square** of the radius: double r and the area is four times as big.
- With 22/7 for π, a radius that is a multiple of 7 gives tidy answers: r = 7 gives 154 cm².

## Check yourself

Four fresh questions: an area from the radius, an area from the diameter, the width of the unrolled row, and what happens when the radius grows. Nothing is saved.

## FAQ

**Is this a proof?** It is the idea behind one. To make it a proof you show the error shrinks to zero as the slices get thinner, which is a limit, met properly in Class 11 and 12.

**Is this the NCERT book?** No. It covers the same topic with fibub's own pictures and questions. fibub is not part of NCERT.
