---
title: "The unit circle explained: sin, cos, tan, radians and inverse trig"
summary: "Turn an angle on a circle of radius 1 and see where sine, cosine and tangent come from, why their waves look the way they do, and how inverse trig picks one answer."
tools: [unit-circle, argand-plane, function-grapher, derivative-slope]
updated: 2026-11-10
sources:
  - "Standard trigonometry: unit circle definitions of sine, cosine and tangent, radian measure, quadrant signs, the shape of y = a sin(bx + c) + d and the principal values of sin⁻¹, cos⁻¹ and tan⁻¹. General mathematics, explained in fibub's own words."
---

Right-angled triangles only get you as far as 90°. The [[unit-circle]] tool takes trigonometry past that point: you turn a radius on a circle of radius 1 and read sine, cosine and tangent for any angle up to two full turns, then watch the same values drawn out as waves. Two more views show how four numbers reshape a sine wave, and how the inverse functions choose a single answer. It is built for Class 11 and 12 students and anyone who wants trig to make sense rather than be memorised. Once the circle feels natural, plot your own trig curves in the [[function-grapher]], see a complex number as a turning arrow on the [[argand-plane]], or find out why the slope of sin x is cos x with [[derivative-slope]].

## What it is

Draw a circle of radius 1 with its centre at the origin. Start a radius pointing along the positive x-axis and turn it anticlockwise through an angle θ. The tip lands at a point P.

- **cos θ** is the x-coordinate of P: how far across it is.
- **sin θ** is the y-coordinate of P: how far up it is.
- **tan θ** = sin θ ÷ cos θ. On the picture it is the height where the radius, stretched out, crosses the upright line x = 1.

Because P always sits on a circle of radius 1, Pythagoras gives **sin² θ + cos² θ = 1** for every angle.

A **radian** is another way to measure an angle. One radian turns the radius far enough to sweep an arc as long as the radius itself. A full turn is 2π radians, so to convert, multiply degrees by π/180.

The signs of the ratios depend on the **quadrant**, the quarter of the circle where P lies. Going anticlockwise from the top right, the positive ones are All, then Sin, then Tan, then Cos (often remembered as ASTC).

The **inverse functions** run the other way: sin⁻¹ x asks "which angle has sine x?". Many angles do, so the answer is taken from one fixed stretch, the **principal range**: −90° to 90° for sin⁻¹ and tan⁻¹, 0° to 180° for cos⁻¹.

## How to use it

1. Choose a view at the top: **Unit circle**, **a sin(bx + c) + d** or **Inverse trig**.
2. In **Unit circle**, drag the point, move the θ slider (0° to 720°), or type an angle. Switch the typed box between **degrees** and **radians**; in radians, forms like 3π/4 work. Keep **Snap to 15°** ticked to land on tidy angles while dragging.
3. Read the facts under the picture: sin, cos and tan (exact forms at special angles, plus decimals), the radian value, the quadrant with its positive ratios, and the sin² + cos² check.
4. Tick **sin**, **cos** or **tan** to pick which waves are traced below the circle. Tan starts unticked.
5. In **a sin(bx + c) + d**, choose sin or cos, then move a (−3 to 3), b (0.5 to 4), c (steps of π/6) and d (−2 to 2). The facts give the amplitude, period, phase shift, middle line and range.
6. In **Inverse trig**, pick sin⁻¹, cos⁻¹ or tan⁻¹, slide x to read its principal value, and slide **Any angle θ** (−360° to 360°) to see what happens when you undo a trig function.
7. Finish with the five-question quiz at the bottom.

## A worked example

Take **θ = 225°**.

**Radians:** 225 × π/180 = **5π/4 rad** ≈ 3.9270 rad.

**Quadrant:** 225° lies between 180° and 270°, so P is in quadrant 3, bottom left. Only tan is positive there.

**Values:** the reference angle (the angle to the nearest part of the x-axis) is 225° − 180° = 45°. Both coordinates have size 1/√2 and both are negative:

- sin 225° = **−1/√2** ≈ −0.7071
- cos 225° = **−1/√2** ≈ −0.7071
- tan 225° = (−0.7071) ÷ (−0.7071) = **1**

**Check:** 0.5 + 0.5 = 1, as it must be.

**Undoing it:** in the Inverse trig view, set Any angle θ to 225°. sin⁻¹(sin 225°) = sin⁻¹(−0.7071) = **−45°**, because −45° is the only angle between −90° and 90° with that sine. With cos⁻¹, the answer is **135°** instead, the angle between 0° and 180° whose cosine is −0.7071.

**A wave:** in the a sin(bx + c) + d view, pick cos and set a = −1.5, b = 3, c = π/3 and d = 1, giving y = −1.5 cos(3x + π/3) + 1.

- amplitude |a| = **1.5** (the minus sign flips the wave)
- period 2π/b = 2π/3 ≈ **2.094**
- phase shift −c/b = −(π/3)/3 = −π/9, so **left by π/9** ≈ 0.349
- middle line **y = 1**, range **[−0.5, 2.5]**

## Where it is used

- **Physics.** Anything that goes round or back and forth, like a pendulum, a spring or an alternating current, follows a sine wave. Amplitude, period and phase are exactly the a, b and c of the wave view.
- **Engineering and surveying.** Splitting a force or a slope into across and up parts is cos θ and sin θ times its size.
- **Computer graphics and games.** Rotating a point on screen uses (cos θ, sin θ) directly, and sin⁻¹ or tan⁻¹ turns a direction back into an angle.
- **Sound and music.** A pure tone is a sine wave; its pitch sets the period and its loudness the amplitude.
- **Navigation.** Bearings and headings are angles round a circle, and positions follow from their sines and cosines.

## Common mistakes

- **Using degrees where radians are needed.** Calculators and code often expect radians. Convert with π/180 and check the mode.
- **Getting the sign wrong past 90°.** Find the quadrant first, then apply ASTC. The tool lights up the letter of the quadrant you are in.
- **Reading the phase shift as −c.** The wave moves by −c/b. With b = 3 and c = π/3 the shift is π/9, not π/3.
- **Expecting sin⁻¹(sin θ) to give θ back.** It only does when θ is already in the principal range. Try 150° in the tool to see it return 30°.
- **Looking for tan 90°.** cos 90° is 0, so tan 90° has no value. The green tan line runs off the picture near 90° and 270°.

## Questions people ask

**Why a circle of radius 1 and not any circle?** With radius 1, the coordinates of P are the sine and cosine themselves. On a circle of radius r they would be r cos θ and r sin θ.

**What happens past 360°?** The point starts a second lap, and every value repeats. sin 390° equals sin 30°. The slider runs to 720° so you can watch the waves repeat.

**Why does the tan wave look so different?** Tan is a ratio. Each time cos θ shrinks to 0 it shoots up without limit, then comes back from far below, so its pattern repeats every 180° rather than every 360°.
