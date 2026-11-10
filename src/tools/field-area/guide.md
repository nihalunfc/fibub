---
name: Field area by triangles
num: 1284
shelf: learn
section: school-maths
title: "Field area by triangles: split a plot of land into triangles and add up the areas"
summary: "Drag the corners of a field on a metre grid (five-sided, L-shaped, trapezium or your own shape, up to 10 corners). It is split into triangles, each one's area is worked out with Heron's formula (Class 9) or the coordinate formula (Class 10), and the total is checked with the shoelace formula, with the perimeter and hectares."
status: live
ads: false
order: 1284
icon: ruler
works: offline
updated: 2026-11-09
related: [herons-formula, section-formula, quadrilateral-explorer, tree-height-basal-area]
sources:
  - "Heron's formula, the coordinate formula for a triangle, the shoelace formula and ear-clipping triangulation are standard geometry, written for fibub. Field shapes are made-up examples."
  - "Checked by hand (L-shape 408 m², trapezium 400 m², a 3-4-5 triangle 6 m²), against an independent Python shoelace sum, and on 300 random (often non-convex) polygons whose triangles must add up to the shoelace area."
flow:
  - { icon: pointer, label: "Drag corners" }
  - { icon: scissors, label: "Triangles" }
  - { icon: calculator, label: "Each area" }
  - { icon: check, label: "Total" }
---

## What it does

Real fields and plots are rarely neat rectangles. Surveyors and farmers find their area by cutting the shape into **triangles**, working out each triangle, and adding them up. This page does that for any shape you draw.

- Drag the corners of the field on a grid of metres (each square is 2 m by 2 m), start from a **five-sided field**, an **L-shaped plot**, a **trapezium** or a **four-sided field**, and add corners up to 10.
- The page splits the field into triangles T1, T2, … (a field with n corners always gives n − 2 triangles), even when the shape bends inwards.
- **Class 9 (Heron):** for each triangle it measures the three sides, finds the semi-perimeter s and uses area = √[s(s − a)(s − b)(s − c)].
- **Class 10 (coordinates):** for each triangle it uses the corners directly: area = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.
- The total is checked against the **shoelace formula**, which uses all the corners at once, and the page gives the **perimeter** (how much fencing) and the area in **hectares** (1 hectare = 10 000 m²).

It fits the Class 9 chapter on measuring space (perimeter and area) and the Class 10 coordinate geometry chapter. Each triangle step is the same as in [[herons-formula]]; distances between corners come from [[section-formula]], and shapes with four corners are explored in [[quadrilateral-explorer]].

## How to use it

1. Choose a **Level**: Heron (Class 9) or coordinates (Class 10).
2. Pick a starting shape, then **drag the corners**. They snap to whole metres and show their coordinates.
3. **Add a corner** puts a new one halfway along the longest side; drag it out. **Remove last corner** takes one away (at least 3 stay).
4. If two sides cross, the outline turns red. Drag a corner to untangle it.
5. Read each triangle's working and the total.

## A worked example

Pick the **L-shaped plot**: corners A(4, 4), B(34, 4), C(34, 12), D(16, 12), E(16, 26) and F(4, 26).

- Six corners, so four triangles.
- The triangles add up to **408 m²**, and the shoelace formula agrees.
- Check it another way: a 30 m by 8 m strip (240 m²) and a 12 m by 14 m block (168 m²) make 408 m².
- The perimeter is 30 + 8 + 18 + 14 + 12 + 22 = 104 m, and 408 m² is 0.0408 hectare.

## Tips

- Any polygon can be cut into triangles from its corners, so knowing the area of a triangle is enough for every field.
- Heron's formula needs only the side lengths, which is what you can measure on the ground with a tape.
- The coordinate formula needs the corners on a map or grid. Both give the same answer.

## Check yourself

Four fresh questions each time: a rectangle plus a triangle, a trapezium split along a diagonal, a quadrilateral field from Heron's formula plus a second triangle, and a triangle from its corner coordinates. Nothing is saved.

## FAQ

**Why n − 2 triangles?** Each cut along a diagonal removes one corner from what is left, until three corners (one triangle) remain.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
