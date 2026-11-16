---
name: Polygon angles
num: 1238
shelf: learn
code: L123
section: school-maths
title: "Angle sum of a polygon: split any shape into triangles and see (n − 2) × 180°"
summary: "Drag the corners of a polygon with 3 to 10 sides. It splits into triangles, every angle is measured live, and they always add to (n − 2) × 180°, even with a dent. Turn on exterior angles to see them add to 360°."
status: live
ads: false
order: 1238
icon: compass
works: offline
updated: 2026-11-16
related: [quadrilateral-explorer, geometry-construction, similar-triangles]
sources:
  - "The angle sum of a polygon, (n − 2) × 180°, and the exterior angle sum of 360° are standard Euclidean geometry. Wording, pictures and examples are fibub's own."
  - "Checked against hand-worked shapes (a square; an arrowhead with a 292.62° reflex corner, from 360° − 2 × atan(2/3)) and 500 random shapes, where the triangles must also cover exactly the shoelace area of the polygon."
  - "Checked by hand: octagon 1080°, 135° each, 20 diagonals; interior 156° gives 15 sides; angle sum 1620° gives 11 sides; hexagon with 120, 130, 100, 140, 125 leaves 105°; decagon has 35 diagonals."
flow:
  - { icon: pointer, label: "Drag corners" }
  - { icon: scissors, label: "Triangles" }
  - { icon: sigma, label: "Add angles" }
  - { icon: check, label: "Check" }
---

## What it does

Why do the angles of a pentagon add up to 540°? Because any polygon can be cut into triangles, and each triangle's angles add to 180°. This page lets you see that for any shape you like:

- Pick the number of sides, from 3 to 10, and drag the blue corners anywhere.
- The shape is cut into **n − 2 triangles** (shaded) and every corner angle is measured, then added up live next to the rule **(n − 2) × 180°**.
- **Push a corner in** makes a dent: one angle becomes a reflex angle (more than 180°), and the rule still works, because the shape still cuts into n − 2 triangles.
- **Show exterior angles** draws each side carried on past its corner and the turn to the next side. Those turns always add to 360°: one full turn as you walk around.

It fits Class 8 Mathematics, *quadrilaterals* (the angle sum of a quadrilateral and of polygons in general), and is useful for regular polygons and tilings later. For the special four-sided shapes, try the [[quadrilateral-explorer]]; for drawing shapes with ruler and compass, [[geometry-construction]].

## Solve your own numbers

The first card answers the usual textbook questions about polygon angles with the working shown. Choose what to find: the **angle sum and each angle of a regular polygon** from the number of sides (also the exterior angle and number of diagonals), the **number of sides** from a regular polygon's interior angle, its exterior angle, or a given angle sum, a **missing angle** (give the angles you know, and if more than one is missing the rest are taken as equal), or the **number of diagonals** n(n − 3) ÷ 2. Angles can be typed in degrees or radians.

Impossible questions get a helpful message: an interior angle of 100° gives 4.5 sides, so no regular polygon has it; an angle sum must be a multiple of 180°; the angles you give may not already add up to more than the total.

## How to use it

1. Slide **n** to choose the number of sides. The shape starts regular.
2. Drag any corner. The triangles, angles and sums follow your finger.
3. Use **Make it regular**, **Random shape** or **Push a corner in** for quick shapes.
4. Tick **Show exterior angles** to see the turning angles and their total.

## A worked example

The page starts with a regular pentagon: 5 sides, so 5 − 2 = 3 triangles and 3 × 180° = 540°. Each angle is 540° ÷ 5 = 108°, and the angle line reads 108° + 108° + 108° + 108° + 108° = 540°. Turn on exterior angles: each is 180° − 108° = 72°, and 5 × 72° = 360°.

Now press **Push a corner in**. The top corner drops below the line joining its neighbours and its angle becomes more than 180°. The other angles shrink to make up for it, the sum stays 540°.

## Check yourself

Five fresh questions on angle sums, regular polygons and exterior angles. Type a number, press **Check**, and open the worked answer if you need it.

## FAQ

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.

**How do you find the number of sides of a regular polygon from its angle?** Subtract the interior angle from 180° to get the exterior angle, then divide 360° by it. An interior angle of 156° gives 24°, and 360 ÷ 24 = 15 sides.

**What is the sum of the interior angles of a polygon?** (n − 2) × 180° for n sides, for example 1080° for an octagon.
