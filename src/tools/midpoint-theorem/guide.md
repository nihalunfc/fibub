---
name: Mid-point theorem
num: 1288
shelf: learn
section: school-maths
title: "Mid-point theorem: drag a triangle and see the line joining two mid-points stay parallel and half as long"
summary: "Drag the corners of any triangle on a centimetre grid: the segment joining the mid-points of two sides stays parallel to the third side and exactly half its length. See the converse, the proof step by step, and Varignon's parallelogram inside any quadrilateral. Ends with fresh practice questions."
status: live
ads: false
order: 1288
icon: ruler
works: offline
updated: 2026-11-09
related: [quadrilateral-explorer, similar-triangles, section-formula]
sources:
  - "The mid-point theorem, its converse and Varignon's theorem are standard Euclidean geometry. Wording, pictures, proof write-up and examples are fibub's own."
  - "Lengths, angles and areas checked against Python (math.dist, the shoelace formula) for the example shapes and for 500 random triangles and quadrilaterals."
flow:
  - { icon: pointer, label: "Drag corner" }
  - { icon: ruler, label: "Mid-points" }
  - { icon: target, label: "Parallel" }
  - { icon: check, label: "Half length" }
---

## What it does

The **mid-point theorem** says: in any triangle ABC, if D is the mid-point of AB and E is the mid-point of AC, then **DE is parallel to BC and DE = ½ BC**. This page lets you test that on as many triangles as you like. Drag the blue corners and the page measures DE, BC, their ratio and the corresponding angles ∠ADE and ∠ABC as you go.

It has three views:

- **Theorem:** the triangle with D, E and the segment DE, plus a five-step proof (extend DE to F, congruent triangles, a parallelogram).
- **Converse:** a line through the mid-point D of AB, drawn parallel to BC, meets AC at F. The page measures AF and FC to show F is the mid-point.
- **Quadrilateral:** join the mid-points P, Q, R, S of the four sides of any quadrilateral. The result is always a parallelogram (Varignon's theorem), its sides are half the diagonals, its perimeter equals AC + BD and its area is half of ABCD.

It fits the Class 9 mathematics chapter on quadrilaterals (properties of parallelograms and the mid-point theorem). To sort shapes into squares, kites and trapeziums first, use the [[quadrilateral-explorer]]; the same idea grows into the basic proportionality theorem in [[similar-triangles]].

## How to use it

1. Pick **Theorem**, **Converse** or **Quadrilateral** at the top.
2. Drag any blue corner. Corners snap to the grid, and each square is 1 cm, so the lengths are easy to check with Pythagoras.
3. Read the measurements under the picture. Lengths are rounded to 2 decimal places.
4. In the triangle views, the **Right angle**, **Obtuse** and **Very thin** buttons give quick starting shapes.

## A worked example

The page starts with A(6, 2), B(2, 12) and C(15, 11) in centimetres.

- D, the mid-point of AB, is ((6 + 2) ÷ 2, (2 + 12) ÷ 2) = (4, 7). E, the mid-point of AC, is (10.5, 6.5).
- DE = √(6.5² + 0.5²) = √42.5 ≈ 6.52 cm and BC = √(13² + 1²) = √170 ≈ 13.04 cm.
- DE ÷ BC = 0.5 exactly, because √170 = 2 × √42.5.
- ∠ADE and ∠ABC both measure 63.8°, so DE ∥ BC (corresponding angles are equal).

In the Quadrilateral view the starting shape A(3, 3), B(2, 12), C(14, 11), D(12, 2) has diagonals AC ≈ 13.6 cm and BD ≈ 14.14 cm, so the mid-point parallelogram has perimeter about 27.74 cm, and ABCD's area of 95 cm² gives it an area of 47.5 cm².

## Check yourself

Four fresh questions each time: DE from BC, BC from DE, the perimeter of the triangle made by joining all three mid-points, and the perimeter of the mid-point parallelogram of a quadrilateral. Nothing is saved.

## FAQ

**Does it work for every triangle?** Yes: acute, right-angled, obtuse, very thin. That is what makes it a theorem. Dragging only lets you test cases; the proof shows why it can never fail.

**What shape do the mid-points of a rectangle make?** A rhombus, because a rectangle's diagonals are equal. A rhombus gives a rectangle, and a square gives a square.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures, proof wording and examples. fibub is not part of NCERT.
