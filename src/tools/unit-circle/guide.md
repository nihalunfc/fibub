---
name: Unit circle
num: 1183
shelf: learn
section: school-maths
title: "Unit circle"
summary: "Drag a point round the unit circle and watch sin, cos and tan drawn as waves. Angles in degrees and radians, exact values at 30°, 45° and 60°, the ASTC quadrant signs, sliders for y = a sin(bx + c) + d, and the inverse trig functions as the mirror image of the principal branch."
status: live
ads: false
order: 1183
icon: compass
works: offline
updated: 2026-11-09
related: [derivative-slope, function-grapher, riemann-sums]
sources:
  - "Standard trigonometry: the unit circle definitions of sine, cosine and tangent, radian measure, quadrant signs, the transformations of y = a sin(bx + c) + d and the principal value branches of the inverse functions. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: exact values of sin, cos and tan at all multiples of 30° and 45° from 0° to 330°, radian forms, and principal values of asin, acos and atan."
flow:
  - { icon: compass, label: "Turn θ" }
  - { icon: target, label: "sin, cos" }
  - { icon: curve, label: "Waves" }
  - { icon: sliders, label: "Transform" }
---

## What it shows

On a circle of radius 1 centred at the origin, turn a radius through an angle θ from the positive x-axis. The point where it lands has coordinates **(cos θ, sin θ)**. That one picture defines sine and cosine for every angle, not just the acute angles of a right triangle, and **tan θ = sin θ / cos θ** is the height where the radius, extended, meets the line x = 1.

Drag the point round and the page traces sin θ and cos θ as waves underneath, so you can see where the wave shapes come from. Two more views build on it: **a sin(bx + c) + d** stretches, squeezes and slides the wave, and **Inverse trig** shows sin⁻¹, cos⁻¹ and tan⁻¹ as the mirror images of one-one pieces of the curves.

It follows trigonometric functions in Class 11 maths and inverse trigonometric functions in Class 12 maths. Next, the [[derivative-slope]] page shows why the slope of sin x is cos x, the [[riemann-sums]] page finds the area under one hump of a sine wave, and the [[function-grapher]] draws any trig curve you type.

## How to use it

1. **Unit circle.** Drag the point, use the θ slider (0° to 720°, two full turns), or type an angle. Switch the box between **degrees** and **radians**; in radians you can type 2.356, `3pi/4` or `3π/4`. *Snap to 15°* makes dragging land on the angles with exact values.
2. Read the **facts**: sin, cos and tan (as exact values such as √3/2 at the special angles), the angle in radians, the quadrant and which ratios are positive there, and the check sin² θ + cos² θ = 1.
3. Tick **sin**, **cos** and **tan** to choose which waves are traced; the coloured part is the part you have turned through so far.
4. **a sin(bx + c) + d.** Pick sin or cos and slide a, b, c and d. The facts give the amplitude |a|, period 2π/b, phase shift −c/b, middle line y = d and the range.
5. **Inverse trig.** Pick sin⁻¹, cos⁻¹ or tan⁻¹. Slide x to read the principal value, and slide *any angle θ* to see why sin⁻¹(sin θ) is not always θ.

## What each setting does

- **ASTC**: in the first quadrant All ratios are positive, in the second only Sin, in the third only Tan, in the fourth only Cos. The letter of the quadrant you are in turns green.
- **a** stretches the wave up and down (a negative a flips it). **b** squeezes it sideways, so b waves fit in each 2π. **c** slides it; the shift is −c/b, not −c. **d** lifts it.
- **Principal branch**: sin and cos repeat, so they are not one-one. Keeping only −π/2 to π/2 for sin (0 to π for cos, open −π/2 to π/2 for tan) makes them one-one, and reflecting that piece in y = x gives the inverse.

## Worked example

Set θ = 150°. That is 150 × π/180 = **5π/6** rad ≈ 2.618. The point is in quadrant 2, where only sin is positive: sin 150° = **1/2**, cos 150° = **−√3/2** ≈ −0.866 and tan 150° = **−1/√3** ≈ −0.5774. In the Inverse trig view, sin⁻¹(sin 150°) = sin⁻¹(1/2) = **30°**, because 30° is the only angle in [−90°, 90°] whose sine is 1/2.

For y = 2 sin(2x) the amplitude is 2, the period is 2π/2 = **π** and the range is [−2, 2].

## Check yourself

Five questions with fresh angles each time: an exact value, a conversion to radians, the period of a wave, a principal value and a quadrant sign. Decimals, fractions and forms like `sqrt(3)/2` or `3*pi/4` are accepted. Nothing is saved.

## FAQ

**Why radians?** An angle of 1 radian cuts off an arc as long as the radius, which makes the formulas of calculus (like d/dx sin x = cos x) come out clean.

**Why is tan 90° undefined?** At 90° the radius is straight up and never meets the line x = 1; equally, cos 90° = 0 and you cannot divide by 0.

**Is this from my textbook?** It covers the standard school topics with its own pictures and examples. It is an independent study aid.
