---
title: "How to find a missing side of a right triangle using sin, cos and tan"
summary: "Label the sides from the angle you know, pick the ratio that links the side you have to the side you want, then multiply or divide. Worked ladder example and checks."
tools: [trig-ratios, inverse-trig, pythagoras-proofs]
updated: 2026-11-10
sources:
  - "Definitions of sin, cos and tan in a right triangle, sin²θ + cos²θ = 1 and Pythagoras' theorem: standard school trigonometry."
---

To find a missing side of a right triangle, name each side from the angle you know (opposite, adjacent, hypotenuse), choose the ratio that uses the side you have and the side you want, and rearrange: for example, opposite = hypotenuse × sin θ. The [[trig-ratios]] explorer draws the triangle for any angle and hypotenuse you type and prints every side length and ratio, so you can see the numbers before you write them down.

## What you need

- **A right triangle**: one angle must be exactly 90°.
- **One other angle**, θ, in degrees (not the right angle).
- **One side length**, with its unit (cm, m and so on).
- **The three side names**, always taken from the angle θ:
  - the **hypotenuse** is the longest side, opposite the right angle,
  - the **opposite** side is across the triangle from θ,
  - the **adjacent** side touches θ and is not the hypotenuse.

## Step by step

The three ratios are:

- sin θ = opposite / hypotenuse
- cos θ = adjacent / hypotenuse
- tan θ = opposite / adjacent

Remember them as SOH CAH TOA. Pick the one holding the side you know and the side you want, then multiply when the unknown is on top and divide when it is underneath.

With the tool:

1. Open the trig ratio explorer and keep the level on **Class 10 (0° to 90°)**.
2. Type your angle into the **θ** box, or drag the blue point along the quarter circle.
3. Type your hypotenuse into the **r** box. The slider runs from 1 to 10, but the box takes larger numbers too.
4. Read the line just under the special-angle buttons. It gives the opposite, the adjacent and the hypotenuse, each to three decimal places. In the picture the opposite side is green and the adjacent side blue.
5. The table below lists all six ratios as a fraction of two sides and as a decimal, so you can copy the line you need into your working.
6. If you know a short side rather than the hypotenuse, set r to 1 and read the ratio you need from the table, then do the last multiply or divide yourself (there is an example under the questions below).

## A worked example

A 6 m ladder leans against a wall and makes an angle of 35° with the flat ground. How high up the wall does it reach, and how far is its foot from the wall?

- The ladder is the hypotenuse: 6 m.
- The angle of 35° is at the foot of the ladder, so the wall is the **opposite** side and the ground between the wall and the foot is the **adjacent** side.
- Height: opposite = hypotenuse × sin 35° = 6 × 0.5736 ≈ **3.441 m**.
- Distance out: adjacent = hypotenuse × cos 35° = 6 × 0.8192 ≈ **4.915 m**.

Put θ = 35 and r = 6 into the explorer and it shows the same pair: opposite 3.441 and adjacent 4.915. The table row for sin reads 3.441 / 6 = 0.5736.

Now try the reverse question: a ladder must reach 4 m up the wall at the same angle. Here you know the opposite side and want the hypotenuse, so the unknown is underneath: hypotenuse = opposite ÷ sin 35° = 4 ÷ 0.5736 ≈ 6.97 m. You would need a ladder of about 7 m.

## Check your answer

- **Pythagoras.** The two short sides squared should add up to the hypotenuse squared: 3.441² + 4.915² ≈ 11.84 + 24.16 = 36 = 6². If they do not, one of your sides is wrong. The [[pythagoras-proofs]] page shows why this rule holds.
- **Size.** The hypotenuse is always the longest side. A short side that comes out longer than the hypotenuse means you multiplied where you should have divided.
- **Which side is bigger.** Below 45° the opposite side is shorter than the adjacent side; above 45° it is longer. At 35°, 3.441 m is less than 4.915 m, as it should be.
- **Work back to the angle.** tan θ = 3.441 ÷ 4.915 ≈ 0.700, and the angle with that tangent is 35°. The [[inverse-trig]] tool turns a ratio back into an angle if you want to check that last step.

## Questions people ask

**What if I know the adjacent side, not the hypotenuse?**
Use tan. Say a tree throws a shadow 8 m long when the Sun is 40° above the ground. The shadow is the adjacent side and the tree the opposite, so height = 8 × tan 40° ≈ 8 × 0.8391 ≈ 6.71 m. In the explorer, set θ to 40 and r to 1 and read tan from the table.

**My calculator gives a strange answer for sin 35. Why?**
It is probably set to radians. Switch it to degrees (often a DEG or D on the screen). In radians, sin 35 is about −0.43, which no side ratio can be.

**Can I use these ratios in a triangle without a right angle?**
Not directly: these side ratios need a 90° corner. Split the shape into right triangles with a height line, or use the sine and cosine rules you meet later.
