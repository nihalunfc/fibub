---
name: Triangle congruence
num: 2277
shelf: learn
code: L353
section: school-maths
title: "Triangle congruence: SSS, SAS, ASA, AAS and RHS"
summary: "Choose which three parts of a triangle are given and see every triangle that fits. One triangle means the test proves congruence; two or many means it does not, as in the SSA and AAA traps."
status: live
ads: false
order: 2277
icon: ruler
works: offline
updated: 2026-11-16
related: [similar-triangles, rigid-motions, sine-cosine-law]
sources:
  - "Triangle congruence tests are standard geometry taught in GCSE Maths, Common Core HSG-CO.B.7 and HSG-CO.B.8, and Ontario MPM2D. Triangles are built with the sine and cosine laws (src/lib/learn/triangle.ts) and checked in tests/curr-geo.mjs. Pictures are fibub's own."
flow:
  - { icon: ruler, label: "Given parts" }
  - { icon: sliders, label: "Set values" }
  - { icon: eye, label: "See fits" }
  - { icon: check, label: "Prove it" }
---

## What it does

Two triangles are congruent when they are exactly the same shape and size: one can be slid, turned or flipped to land on the other. A triangle has six measurements, three sides and three angles, but you do not need to know them all. Some sets of three are enough to force one single triangle. Others leave room for several.

Pick a test and set the given sides and angles with the sliders. The page builds every triangle that fits and draws them on top of each other. One triangle means the test proves congruence. Two or more means it cannot. The SSA case shows a side that swings like a gate and can reach the base in two places. Moving shapes onto each other is covered in [[rigid-motions]], same shape but different size in [[similar-triangles]], and calculating the missing parts in [[sine-cosine-law]].

## How to use it

1. Choose SSS, SAS, ASA, AAS, RHS, or one of the traps (AAA, SSA).
2. Move the three sliders to set the given parts.
3. Look at how many triangles are drawn and read the verdict.
4. For SSA, watch the swinging side and try values above and below the height.
5. Try "Prove it": for two triangles with marked equal parts, choose the test or "Cannot tell".

## What each setting does

- **SSS:** three sides. **SAS:** two sides and the angle between them.
- **ASA / AAS:** two angles and a side (between them, or not).
- **RHS:** right angle, hypotenuse and one other side.
- **AAA:** only angles, so the size is free (similar, not congruent).
- **SSA:** the angle is not between the sides, so two triangles can fit.

## Worked example

Take SSA with a = 4 cm, b = 6 cm and A = 30°. The height is b sin A = 6 × 0.5 = 3 cm. Because 3 < 4 < 6, the swinging side a reaches the base in two places, giving two different triangles with B about 48.6° or 131.4°. So SSA with these numbers does not prove congruence. If a were 7 cm (longer than b), only one triangle fits.

## FAQs

**Why does RHS work when SSA does not?** The right angle makes the third side fixed by Pythagoras, so only one triangle fits.

**Is AAA a congruence test?** No. Three equal angles only show the triangles are similar.

**Do I name the letters in the right order in a proof?** Yes. Write the matching vertices in the same order, such as triangle ABC ≡ triangle PQR.
