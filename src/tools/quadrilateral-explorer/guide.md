---
name: Quadrilateral explorer
num: 1166
shelf: learn
code: L83
section: school-maths
title: "Quadrilateral explorer: drag the corners, see the angles, diagonals and family"
summary: "Drag four corners on a grid and see the sides, the angles adding to 360°, the diagonals and the area, and whether the shape is a square, rectangle, rhombus, parallelogram, kite or trapezium (and which of those it also is)."
status: live
ads: false
order: 1166
icon: crop
works: offline
updated: 2026-11-09
related: [geometry-construction, pythagoras-proofs, herons-formula]
sources:
  - "Angle sum, the properties of special quadrilaterals, the shoelace area formula and the midpoint (Varignon) theorem are standard geometry. Written for fibub."
  - "Angles and areas checked against a separate Python script (acos of the edge vectors, shoelace area) for a square, rectangle, rhombus, parallelogram, kite, trapezium, isosceles trapezium and a concave dart."
flow:
  - { icon: pointer, label: "Drag corners" }
  - { icon: compass, label: "Angles" }
  - { icon: target, label: "Name it" }
  - { icon: check, label: "Practise" }
---

## What it does

A quadrilateral is any shape with four straight sides. The special ones (square, rectangle, rhombus, parallelogram, kite and trapezium) are told apart by a handful of facts: which sides are parallel, which are equal, which angles are right angles, and how the diagonals behave.

This page puts a quadrilateral ABCD on a square grid. Drag any corner, or type its coordinates, and it shows at once:

- the four sides (as exact square roots where needed),
- the four angles, which always add to 360°, even when the shape is concave and one angle is more than 180°,
- how many pairs of sides are parallel,
- the diagonals: their lengths, whether they cut each other in half, and whether they cross at 90°,
- the area, and the family name.

Under the name, a row of family labels lights up for **every** family the shape belongs to. A square lights up as a rectangle, a rhombus, a parallelogram, a kite and a trapezium too, which is the idea behind the "family tree" of quadrilaterals. If two sides cross like a bow tie, the page says it is not a quadrilateral at all.

It follows the Class 8 chapter *Understanding quadrilaterals* and the Class 9 chapter *Quadrilaterals* (the angle sum, the parallelogram theorems and the midpoint theorem).

To draw these shapes with ruler and compass, use [[geometry-construction]]. Diagonals and right angles lead straight to [[pythagoras-proofs]], and a quadrilateral split by a diagonal into two triangles can be measured with [[herons-formula]].

## How to use it

1. Pick a starting shape, such as **Parallelogram** or **Kite**.
2. Drag A, B, C or D. Corners snap to whole grid points, so lengths and areas stay exact.
3. Or type x and y for each corner in the boxes under the picture.
4. Tick **Diagonals** to draw AC and BD, and **Join the midpoints** to see the midpoint parallelogram.
5. Read the name, the lit-up families and the list of facts.

## A worked example

The page starts with A(1, 1), B(7, 1), C(9, 4) and D(3, 4).

- AB and DC are both 6 units long and horizontal; BC and AD both go 2 across and 3 up, so they are parallel and equal (√13 ≈ 3.61). Both pairs of opposite sides are parallel: a **parallelogram**.
- ∠A = ∠C ≈ 56.3° and ∠B = ∠D ≈ 123.7°. Opposite angles are equal, next-door angles add to 180°, and all four add to 360°.
- The diagonals AC and BD both have their midpoint at (5, 2.5), so they cut each other in half.
- Area = base × height = 6 × 3 = 18 square units.

Drag C to (7, 4) and D to (1, 4): every angle becomes 90° and the name changes to rectangle, while parallelogram stays lit.

## Tips

- In a concave quadrilateral (a dart), one diagonal lies outside the shape.
- Some books say a trapezium has **exactly** one pair of parallel sides. Here, as in many texts, it means **at least** one pair, so every parallelogram is also a trapezium.

## Check yourself

Four fresh questions each time: the fourth angle from three, the angle next to a given one in a parallelogram, a rhombus side from its diagonals, and angles in a ratio. Nothing is saved.

## FAQ

**Why do the angles always add to 360°?** A diagonal splits the quadrilateral into two triangles, and each triangle's angles add to 180°.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
