---
name: Compound angle proof
num: 1370
shelf: learn
section: school-maths
title: "Sum and difference formulae: a visual proof of sin(A + B) and cos(A + B) from stacked right triangles"
seoTitle: "sin(A + B) visual proof: compound angle formulae"
summary: "Slide two angles A and B and watch two right triangles stack up into the angle A + B. The heights add up to sin(A + B) = sin A cos B + cos A sin B and the widths to cos(A + B) = cos A cos B − sin A sin B, with live numbers, plus a table that checks the difference, tan and double angle formulae."
status: live
ads: false
order: 1370
icon: compass
works: offline
updated: 2026-11-09
related: [unit-circle, trig-ratios, radian-ruler, argand-plane]
sources:
  - "The sum, difference and double angle formulae and their geometric proof by stacked right triangles are standard trigonometry. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against Python's math.sin and math.cos for every pair of angles from 0° to 80° in 5° steps, and against sympy for the exact values of sin 75° and cos 15°."
flow:
  - { icon: sliders, label: "A and B" }
  - { icon: compass, label: "Triangles" }
  - { icon: ruler, label: "Lengths" }
  - { icon: check, label: "Formula" }
---

## What it shows

Why is sin(A + B) not just sin A + sin B? This page answers with a picture. Start with a line OP of length 1 at an angle A + B above the x-axis. Split the climb into two right triangles: OQ at angle A, and QP at right angles to it, so that the angle between OQ and OP is B. Then

- OQ = cos B and QP = sin B, because OP = 1;
- the height of P is the height of Q plus the extra climb from Q to P;
- and how far right P is equals how far right Q is, minus the distance P has stepped back.

Measure those pieces with sin A and cos A and you get the two **compound angle formulae** of Class 11 maths (trigonometric functions):

sin(A + B) = sin A cos B + cos A sin B and cos(A + B) = cos A cos B − sin A sin B.

The rest (sin(A − B), cos(A − B), tan(A ± B), sin 2A, cos 2A, tan 2A) follow by putting −B for B, dividing, or setting B = A, and the table below the picture checks every one of them at your angles.

Revise the ratios in a right triangle with [[trig-ratios]] first; the [[unit-circle]] shows why the formulas still hold beyond 90°, and the [[radian-ruler]] turns the degrees into radians.

## How to use it

1. Move the **A** and **B** sliders (0° to 80° each). The picture redraws with O, Q, P, the feet R and M on the x-axis, and N, the point level with Q directly below P.
2. Tap **sin(A + B)** to see the heights: RQ in red and NP in green add up to MP, the height of P. Tap **cos(A + B)** to see the widths: OR in red minus NQ in green leaves OM.
3. The numbered steps under the picture give the reason for each length with your numbers filled in, and the bold line adds them up.
4. **Make B = A** turns the sum formulas into the double angle formulas.
5. The table works out each formula twice: the left side straight from the angle, the right side from the formula.

## Why the angle at P is A

Triangle QNP has a right angle at N. Its side QN is horizontal and NP vertical, while QP is at right angles to OQ. Turning a whole triangle through 90° keeps its angles, so the angle between PN and PQ equals the angle between the x-axis and OQ, which is A. That is why NP = QP cos A and NQ = QP sin A.

## Worked example

With the starting angles A = 30° and B = 45°, the title reads sin(30° + 45°) = sin 75° = 0.9659. The steps show OQ = cos 45° = 0.7071 and QP = sin 45° = 0.7071, then RQ = sin 30° cos 45° = 0.3536 and NP = cos 30° sin 45° = 0.6124. The last line reads sin(A + B) = 0.3536 + 0.6124 = 0.9659, the same as sin 75°. The exact value is (√6 + √2)/4.

Switch to cos(A + B): OR = cos 30° cos 45° = 0.6124 and NQ = sin 30° sin 45° = 0.3536, so cos 75° = 0.6124 − 0.3536 = 0.2588.

## FAQ

**Does the proof only work for acute angles?** The picture is drawn for A and B up to 80°, but A + B can pass 90° (P then sits left of the y-axis and cos(A + B) is negative). The formulas hold for all angles; the unit circle definitions extend the proof.

**Why does tan(A + B) say "undefined" sometimes?** When A + B = 90°, tan(A + B) has no value, and so 1 − tan A tan B = 0 on the right as well.

**Is anything saved?** No. Everything runs in your browser. fibub is not part of NCERT; the topics follow the syllabus but the words and pictures are our own.
