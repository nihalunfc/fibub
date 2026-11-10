---
name: Square root spiral
num: 1276
shelf: learn
code: L144
section: school-maths
title: "Square root spiral (Theodorus) and √x on the number line, built step by step"
summary: "Build the square root spiral one right triangle at a time and watch √2, √3, √4 … appear as its spokes, with Pythagoras showing why each is √(n + 1). Then mark √x on the number line for any x with the semicircle construction, worked with your numbers."
status: live
ads: false
order: 1276
icon: compass
works: offline
updated: 2026-11-09
related: [pythagoras-proofs, number-line-zoom, geometry-construction]
sources:
  - "The spiral of Theodorus (right triangles with legs √k and 1) and the semicircle construction of √x (the geometric mean, from Euclid's Elements Book VI, Proposition 13). Written for fibub."
  - "Checked against Python: spoke lengths √(k + 1) and the turn after k triangles (Σ tan⁻¹(1/√k) = 351.1504° after 16 and 364.7834° after 17), and the semicircle height √x for 1,000 random x."
flow:
  - { icon: sliders, label: "Pick n or x" }
  - { icon: compass, label: "Construct" }
  - { icon: ruler, label: "Read √" }
  - { icon: check, label: "Practise" }
---

## What it does

You cannot measure √2 with a ruler marked in centimetres, but you can **draw** it exactly. This page shows two ways.

- **Square root spiral.** Draw a right triangle with both short sides 1: its long side is √2. On the end of that long side stand another side of length 1 at right angles; the new long side is √3. Keep going and the long sides, the spokes from the centre, are √2, √3, √4 = 2, √5, … The slider sets how many triangles; the newest spoke is drawn in red, and the steps show Pythagoras with your numbers and how far the spiral has turned.
- **√x on the number line.** For any x: mark AB = x and BC = 1 on a line, draw a semicircle on AC, and raise a line at right angles at B. It meets the semicircle at D, and BD = √x. An arc from B carries that length onto the number line at E.

It fits the Class 9 Maths chapter on the world of numbers (locating √2, √3 and √x on the number line).

The spiral is Pythagoras over and over, as in [[pythagoras-proofs]]; to see √2 digit by digit, zoom into it with the [[number-line-zoom]]; for more ruler-and-compass work, try [[geometry-construction]].

## How to use it

1. Pick **Square root spiral** or **√x on the number line**.
2. For the spiral, move **n** (1 to 30 triangles). For the number line, move **x** or type any value up to 100.
3. Read **Why it works**: each step with the lengths from your picture.

## A worked example

With n = 5, the spokes are √2, √3, 2, √5 and the newest, √6 ≈ 2.4495. Triangle 5 has legs √5 and 1, so its long side is √(5 + 1) = √6. Its angle at the centre is tan⁻¹(1/√5) = 24.09°, and the five triangles turn 160.92° in all.

With x = 3.5 on the number line: AC = 4.5, so the semicircle has radius 2.25. O is 1.25 from B, so BD² = 2.25² − 1.25² = 5.0625 − 1.5625 = 3.5, and BD = √3.5 ≈ 1.8708.

## Tips

- The spiral first completes a full turn with its 17th triangle: 16 triangles turn 351.15°, 17 turn 364.78°.
- The spokes that are whole numbers come at √4, √9, √16, √25: perfect squares.
- The semicircle method works for decimals too, such as √2.5, and for x less than 1.

## Check yourself

Four fresh questions: the long side of a spiral triangle, which triangle has a whole-number side, simplifying a square root, and the radius in the semicircle construction. Nothing is saved.

## FAQ

**Who was Theodorus?** Theodorus of Cyrene, a Greek mathematician of the 5th century BCE. Plato says he showed that √3, √5, … up to √17 are irrational; the spiral is named after him, though the drawing itself is modern.

**Why does the semicircle give √x?** Triangle ABD is similar to triangle DBC, so AB ÷ BD = BD ÷ BC, which means BD² = AB × BC = x × 1.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
