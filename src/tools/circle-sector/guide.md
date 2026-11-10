---
name: Circle sectors
num: 1161
shelf: learn
section: school-maths
title: "Circle sectors"
summary: "Drag the edge of a sector to change its angle and get the sector area, arc length, perimeter and segment area with π = 22/7, 3.14 or exact. Drag a point outside a circle to see its two equal tangents meet the radii at right angles."
status: live
ads: false
order: 1161
icon: target
works: offline
updated: 2026-11-09
related: [trig-ratios, pythagoras-proofs, geometry-construction]
sources:
  - "Standard results: sector area (θ/360)πr², arc length (θ/360)2πr, segment = sector − triangle, the tangent is perpendicular to the radius and the two tangents from a point are equal. Written for fibub."
  - "Checked against hand-worked answers (r = 21 cm, 60°, π = 22/7: 231 cm² and 22 cm) and on 300 random tangent cases."
flow:
  - { icon: pointer, label: "Drag arc" }
  - { icon: target, label: "Sector" }
  - { icon: ruler, label: "Tangents" }
  - { icon: check, label: "Practise" }
---

## What it does

A **sector** is a slice of a circle, like a slice of pizza: two radii and the arc between them. A **segment** is the part between a chord and the arc. This page draws both and works out:

- the **sector area** (θ/360) × πr²,
- the **arc length** (θ/360) × 2πr and the sector's perimeter,
- the **segment area**, sector minus the triangle made by the two radii,
- the **major** sector and segment (the rest of the circle).

A second picture shows the **tangents** from a point outside a circle: each tangent meets its radius at a right angle, the two tangents have the same length, and the angle between them and the angle between the radii add up to 180°.

It follows the Class 10 chapters *circles* (tangents) and *areas related to circles* (sectors and segments).

The triangle part of a segment uses ½ r² sin θ, which you can explore in [[trig-ratios]]. The tangent length comes from [[pythagoras-proofs]]. Draw your own tangent constructions in [[geometry-construction]].

## How to use it

1. Drag the blue point on the circle, or use the θ slider, to set the angle at the centre (1° to 359°).
2. Set the radius r in cm.
3. Choose **π = 22/7**, **3.14** or **exact π**. Textbook answers usually use 22/7 (with radii that are multiples of 7) or 3.14.
4. Choose whether to shade the **sector** or the **segment**.
5. In the tangent picture, drag P around. The radius stands for 4 cm, so the lengths are easy to compare.

## A worked example

The page starts with r = 21 cm, θ = 60° and π = 22/7.

- Sector area = (60/360) × 22/7 × 21² = 1/6 × 22/7 × 441 = 231 cm².
- Arc length = (60/360) × 2 × 22/7 × 21 = 22 cm; perimeter = 22 + 42 = 64 cm.
- The triangle has area ½ × 21² × sin 60° ≈ 190.96 cm², so the segment is about 231 − 190.96 = 40.04 cm².

For the tangents: with a radius of 4 cm and P 5 cm from the centre, PT = √(25 − 16) = 3 cm on both sides.

## Tips

- θ/360 is the fraction of the whole circle: 90° is a quarter, 120° a third.
- For angles over 180°, the triangle sits on the other side of the chord, so the segment is the sector **plus** the triangle. The page handles this with the sine of the angle.

## Check yourself

Four fresh questions each time: a sector area, an arc length, a tangent length and an angle between radii. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why do answers differ slightly between 22/7 and 3.14?** Both are approximations of π (3.14159...). 22/7 ≈ 3.1429 and 3.14 is a little smaller.

**Is this from the NCERT book?** It covers the same topics with fibub's own pictures and examples. fibub is not part of NCERT.
