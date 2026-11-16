---
name: Section formula
num: 1160
shelf: learn
code: L77
section: school-maths
title: "Section formula"
summary: "Drag two points on a grid and see the distance formula, the point that divides the segment in any ratio m : n, and the midpoint, worked with your numbers. Add a third point for the centroid and the area of the triangle."
status: live
ads: false
order: 1160
icon: pointer
works: offline
updated: 2026-11-16
related: [pythagoras-proofs, linear-pair-solver, geometry-construction]
sources:
  - "Standard coordinate geometry: the distance formula (from Pythagoras' theorem), the section formula, the midpoint and centroid formulas and the area of a triangle from its vertices. Written for fibub."
  - "Checked on hand-worked examples and on 300 random point sets (P lies on AB with AP : PB = m : n, the centroid is 2 : 1 along each median, the area equals the shoelace sum)."
flow:
  - { icon: pointer, label: "Drag A, B" }
  - { icon: ruler, label: "Distance" }
  - { icon: target, label: "Section" }
  - { icon: check, label: "Practise" }
---

## What it does

Coordinate geometry turns shapes into numbers. This page puts two points A and B on a grid and works out, with your own coordinates:

- the **distance** AB = √[(x₂ − x₁)² + (y₂ − y₁)²], which is just Pythagoras' theorem on the grid;
- the point **P that divides AB in the ratio m : n** (the section formula), inside AB or, if you tick the box, outside it;
- the **midpoint** M, the special case m : n = 1 : 1;
- where the **x axis** cuts AB, as a ratio;
- with a third point C, the **centroid** G of triangle ABC and the triangle's **area**.

It follows the Class 10 chapter *coordinate geometry* (distance formula and section formula). The area of a triangle and external division are useful extras for older syllabuses and Class 11.

The distance formula comes from [[pythagoras-proofs]]. Lines on the same grid are in the [[linear-pair-solver]], and you can build your own constructions in [[geometry-construction]].

## How to use it

1. **Drag A and B** on the grid. They snap to whole-number points from −10 to 10.
2. Set the ratio **m : n** with the sliders or boxes. The green point P moves along AB; the orange point M is the midpoint.
3. Tick **Divide externally** to put P on the line AB beyond B (or A).
4. Tick **Add a third point C** for the triangle, its medians (dashed), the red centroid G and the area.
5. Every formula in the second card is filled in with your numbers.

## A worked example

The page starts with A(−6, −4), B(6, 5) and m : n = 2 : 1.

- Distance: √[12² + 9²] = √225 = 15.
- Section point: x = (2 × 6 + 1 × (−6)) / 3 = 2 and y = (2 × 5 + 1 × (−4)) / 3 = 2, so P = (2, 2). Check: AP = 10 and PB = 5, a ratio of 2.
- Midpoint: (0/2, 1/2) = (0, 0.5).
- The x axis cuts AB in the ratio 4 : 5 from A, since A is 4 below the axis and B is 5 above it.

With C(5, −6): the centroid is (5/3, −5/3) ≈ (1.667, −1.667) and the area is ½|−6(11) + 6(−2) + 5(−9)| = 61.5.

## Tips

- The section formula puts m next to B's coordinates and n next to A's: the point is pulled towards the end with the bigger share.
- If the area of three points is 0, they lie on one line (they are collinear).

## Solve with your numbers

The first card on the page works from typed numbers, so you can enter the exact points from your question instead of dragging. Type the coordinates (whole numbers, decimals or fractions such as 3/2), choose what to find, and the answer appears in one sentence at the top with the working under it.

- **The point dividing AB in the ratio m : n**, inside or outside AB (external division), with a check of AP : PB.
- **The midpoint** and **the distance AB**, with an optional unit (cm, m or km).
- **The ratio in which P divides AB**, when you know all three points. If P is not on the line AB the page says so instead of guessing.
- **The ratio in which the x axis or y axis cuts AB**, with the point where it cuts and whether the cut is inside or outside the segment.
- **Triangle ABC**: the centroid, the area and the three side lengths. An area of 0 is reported as three points on one line.

Six examples in your own style are in the drop-down, from "divide (2, −3) and (8, 6) in 1 : 2" to a triangle with a centroid. "Use the points from the graph below" copies the dragged points into the boxes. Under the answer you get one common mistake for that kind of question, such as putting m with the wrong end or forgetting brackets round negative numbers before squaring.

## Check yourself

Four fresh questions each time: a distance, a midpoint, a section point and a centroid. Type points as x, y (for example 2, −3), press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Can I use points beyond 10?** The picture shows −10 to 10 so it stays readable on a phone; the questions use the same range.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.

**What is the section formula?** For a point P that divides the segment from A(x₁, y₁) to B(x₂, y₂) in the ratio m : n, P = ((m x₂ + n x₁)/(m + n), (m y₂ + n y₁)/(m + n)); for external division replace the plus signs in the denominator and the numerator by minus.

**What if m or n is zero, negative or blank?** The page asks for a number above 0 for internal division, and for different m and n for external division, instead of showing a wrong point.
