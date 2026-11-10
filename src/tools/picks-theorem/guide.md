---
name: Pick's theorem on a dot grid
num: 1252
shelf: learn
section: school-maths
title: "Pick's theorem: find the area of a grid polygon by counting dots"
summary: "Tap dots on a grid to make any polygon. The page colours the dots inside and on the edges, works out I + B/2 − 1 and checks it against the area from the corners. Drag corners to explore."
status: live
ads: false
order: 1252
icon: target
works: offline
updated: 2026-11-09
related: [area-shear, herons-formula, section-formula, circle-slices]
sources:
  - "Pick's theorem (Georg Pick, 1899) and the shoelace area formula are standard geometry. Pictures, shapes and questions written for fibub."
  - "Checked: interior and edge dots counted point by point (not from the formula) agree with I + B/2 − 1 = shoelace area for 1 000 random simple polygons (tests/sci-tools/picks-theorem.mjs); the starting shapes were also counted in Python with a winding-number test."
flow:
  - { icon: pointer, label: "Tap dots" }
  - { icon: search, label: "Count I, B" }
  - { icon: calculator, label: "I + B/2 − 1" }
  - { icon: check, label: "Compare" }
---

## What it does

On a grid of dots, any polygon whose corners sit on dots has a surprisingly simple area rule, found by the Austrian mathematician Georg Pick:

**Area = I + B/2 − 1**

where **I** is the number of dots strictly **inside** the shape and **B** is the number of dots **on its edges** (corners included). You don't need any lengths, heights or angles; you just count.

This page lets you draw a polygon by tapping dots, colours the inside dots green and the edge dots orange, counts them for you, and compares Pick's answer with the area worked out from the corners (the shoelace method). They always agree, as long as the edges don't cross each other.

It is an extra for the Class 8 maths chapter *Area*, a fun way to check areas of triangles and rectangles you have worked out with formulas. Why sliding a shape keeps its area is in [[area-shear]], and points on a grid with coordinates are in [[section-formula]].

## How to use it

1. Press a starting shape (**Rectangle**, **Triangle**, **L shape**, **Arrow**) or **Clear** and tap your own dots in order around the shape.
2. The last corner joins back to the first automatically.
3. Drag any corner to a new dot. **Undo** removes the last corner.
4. Read I, B, Pick's area and the area from the corners. If the edges cross, the shape turns red and the page explains why.

## A worked example

The page starts with a rectangle from (1, 1) to (6, 4), 5 wide and 3 tall.

- Edge dots: each long side has 5 steps and each short side 3, so B = 5 + 3 + 5 + 3 = 16.
- Inside dots: 4 columns × 2 rows, so I = 8.
- Pick: 8 + 16/2 − 1 = 15 square units, the same as 5 × 3.

Press **Triangle**: corners (1, 1), (8, 2), (3, 6). The page counts I = 16 and B = 3 (only the corners, because no other dots lie on these slanted edges), so the area is 16 + 1.5 − 1 = 16.5. The shoelace area from the corners is also 16.5.

## Tips

- An edge from (x₁, y₁) to (x₂, y₂) passes through gcd(|x₂ − x₁|, |y₂ − y₁|) + 1 dots, counting both ends.
- A triangle with no dots inside and only its three corners on the edges always has area ½.
- Pick's theorem fails for shapes with holes and for shapes whose edges cross.

## Check yourself

Four fresh questions: area from I and B, edge dots of a rectangle, inside dots from the area, and a right triangle on the grid. Nothing is saved.

## FAQ

**Why minus 1?** Each inside dot is worth a whole square, each edge dot about half, and the corners overcount by exactly one square in total when you go once around the shape.

**Is this the NCERT book?** No. It is an extra with fibub's own shapes and questions. fibub is not part of NCERT.
