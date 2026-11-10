---
name: 3D vector lab
num: 1190
shelf: learn
code: L93
section: school-maths
title: "3D vector visualiser: add vectors, dot product as projection, cross product as area, shortest distance between lines"
summary: "Type two vectors in 3D and turn the picture round to see a + b, the dot product as the shadow of one vector on the other, and the cross product standing square to both with the parallelogram's area. Then put two lines in space and find the angle and the shortest distance between them, with the closest points marked."
status: live
ads: false
order: 1190
icon: compass
works: offline
updated: 2026-11-09
related: [matrix-transform, argand-plane, matrix-calculator]
sources:
  - "Standard vector algebra and three-dimensional geometry: components, magnitude, direction cosines, dot and cross products, projections, the vector equation of a line, the angle between lines and the shortest distance between skew and parallel lines. Written for fibub; no textbook text, figures or exercises are used, and the example vectors are made up."
  - "Checked against NumPy (sums, dot and cross products, angles, projections, direction cosines) and against a direct numerical minimisation of the distance between two lines with scipy.optimize.minimize."
flow:
  - { icon: pencil, label: "Type a, b" }
  - { icon: pointer, label: "Turn" }
  - { icon: target, label: "a · b, a × b" }
  - { icon: ruler, label: "Distance" }
---

## What it shows

A vector in space has three parts, a = (a₁, a₂, a₃), and is drawn as an arrow from the origin. This page draws your vectors in 3D on a picture you can turn with a finger or the mouse, and shows the three things school vector algebra does with them:

- **a + b**: put the tail of b on the head of a; the sum goes from the start to the finish.
- **a · b** (the dot product): a single number, a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ. It measures how much the vectors point the same way. Divided by |a|, it is the length of b's shadow (projection) on a, drawn in green.
- **a × b** (the cross product): a vector square to both a and b, pointing by the right-hand rule, whose length is the area of the parallelogram they make.

A fourth view puts two **lines in space**, r = p₁ + s d₁ and r = p₂ + t d₂, and finds whether they meet, are parallel or are skew, the angle between them and the shortest distance, with the closest points joined in green.

It follows vector algebra and three-dimensional geometry in Class 12 maths. In two dimensions, the [[matrix-transform]] page shows how areas scale (the cross product's 2D cousin, the determinant), the [[argand-plane]] adds arrows as complex numbers, and the [[matrix-calculator]] handles bigger matrix work.

## How to use it

1. Pick **a + b**, **a · b**, **a × b** or **Lines in space**.
2. Type the x, y and z parts of a and b (or, for lines, a point p and a direction d for each).
3. **Drag** the picture to turn it, or use the buttons for a tilted view, a view from above or from the front.
4. Read the working line, which fills in your numbers, and the facts below it.

## Formulas used

- |a| = √(a₁² + a₂² + a₃²); direction cosines (a₁, a₂, a₃)/|a|.
- a · b = a₁b₁ + a₂b₂ + a₃b₃, cos θ = a · b / (|a||b|), projection of b on a = a · b / |a|.
- a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁); area of the parallelogram |a × b|, of the triangle half that.
- Skew lines: d = |(p₂ − p₁) · (d₁ × d₂)| / |d₁ × d₂|. Parallel lines: d = |(p₂ − p₁) × d₁| / |d₁|.

## Worked example

With a = (2, 1, −2) and b = (1, 3, 1): a + b = **(3, 4, −1)**; a · b = 2 + 3 − 2 = **3**, |a| = 3 and |b| = √11, so cos θ = 3 / (3√11) and θ ≈ **72.45°**; the projection of b on a is 3/3 = **1**. The cross product is a × b = **(7, −4, 5)** and the parallelogram's area is √90 ≈ **9.4868**.

For the lines through (1, 2, 3) along (1, −3, 2) and through (4, 5, 6) along (2, 3, 1), d₁ × d₂ = (−9, 3, 9) and the shortest distance is |(3, 3, 3) · (−9, 3, 9)| / √171 = 9 / 13.077 ≈ **0.6882**.

## Check yourself

Five questions with fresh numbers: a dot product, a length, a part of a cross product, a parallelogram's area and the angle when a · b = 0. Nothing is saved.

## FAQ

**Why does a × b change sign when I swap a and b?** The right-hand rule: curling from b to a instead of a to b points your thumb the other way.

**Is this from my textbook?** It covers the standard school topics with its own examples. It is an independent study aid.
