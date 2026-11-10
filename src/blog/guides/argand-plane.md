---
title: "Complex numbers on the Argand plane: add, multiply and find roots"
summary: "See complex numbers as points and arrows: addition as a parallelogram, multiplication as stretch and turn, and the complex roots of a quadratic. A plain guide to the Argand plane tool."
tools: [argand-plane, unit-circle, quadratic-explorer, vector-adder]
updated: 2026-11-10
sources:
  - "Standard complex number algebra: i² = −1, modulus, principal argument in (−180°, 180°], polar form and the quadratic formula. General mathematics, explained in fibub's own words."
---

Complex numbers can feel like pure symbol-pushing until you draw them. The [[argand-plane]] tool puts two complex numbers on a grid, lets you drag them around and draws the result of adding, subtracting, multiplying, dividing, conjugating, multiplying by i or raising to a power. A second panel shows how a quadratic with no real roots still has two complex ones. It is made for Class 11 students and anyone revising complex numbers. If angles and cos and sin feel shaky, warm up with the [[unit-circle]]; if you want to see how a parabola changes with its coefficients, try the [[quadratic-explorer]].

## What it is

A **complex number** is written z = a + bi. Here a is the **real part**, b is the **imaginary part**, and i is a number with i² = −1.

The **Argand plane** is an ordinary grid with the real part along the horizontal axis (Re) and the imaginary part up the vertical axis (Im). The number a + bi becomes the point (a, b), or an arrow from 0 to it.

Two measurements describe that arrow:

- **Modulus** |z| = √(a² + b²): the arrow's length.
- **Argument** arg z: the angle from the positive real axis, measured anticlockwise. The tool gives the **principal value**, which lies above −180° and up to 180°.

Together they give the **polar form**: z = |z|(cos θ + i sin θ), where θ is the argument.

The pictures follow simple rules:

- **Adding** works like adding vectors, tip to tail, which draws a parallelogram.
- **Multiplying** multiplies the lengths and adds the angles.
- **Dividing** divides the lengths and subtracts the angles.
- The **conjugate** z̄ = a − bi flips z across the real axis.

## How to use it

1. Pick an operation along the top: **z + w**, **z − w**, **z × w**, **z ÷ w**, **z̄**, **i × z** or **zⁿ**.
2. Type the real and imaginary parts of z (a and b) and, for the first four operations, of w (c and d).
3. Or drag the blue point z and the orange point w on the picture. Leave **Snap to halves** ticked to keep the numbers tidy, or untick it for any value.
4. Read the green answer arrow, the working line under the picture, and the facts: each number's modulus and argument, and the polar form of the answer.
5. For **zⁿ**, move the **Power n** slider from 0 to 8 and watch the powers trace a spiral.
6. In **Complex roots of a quadratic**, move the sliders for a (−3 to 3), b (−6 to 6) and c (−6 to 10). The left picture shows the parabola; the right one shows the two roots on the Argand plane.
7. Try the quick quiz at the bottom for practice with fresh numbers.

## A worked example

Let **z = 2 + 3i** and **w = −1 + i**.

**Add:** (2 + (−1)) + (3 + 1)i = **1 + 4i**.

**Multiply:** (2 + 3i)(−1 + i) = −2 + 2i − 3i + 3i². Since i² = −1, that is −2 − 3 + (2 − 3)i = **−5 − i**.

Check it with the geometry:

- |z| = √(4 + 9) = √13 ≈ **3.6056**, and arg z ≈ **56.31°**
- |w| = √(1 + 1) = √2 ≈ **1.4142**, and arg w = **135°**
- lengths multiply: 3.6056 × 1.4142 ≈ **5.0990**, and |−5 − i| = √26 ≈ 5.0990
- angles add: 56.31° + 135° = 191.31°. That is past 180°, so subtract 360° to get **−168.69°**, which is arg(−5 − i)

**Divide:** multiply top and bottom by the conjugate of w. z × w̄ = (2 + 3i)(−1 − i) = **1 − 5i**, and |w|² = 2, so z ÷ w = **0.5 − 2.5i**.

**A quadratic:** set a = 2, b = 2, c = 5 for 2x² + 2x + 5 = 0. The discriminant is D = 2² − 4 × 2 × 5 = 4 − 40 = **−36**. The parabola sits above the x-axis, so there are no real roots. The roots are (−2 ± 6i) ÷ 4 = **−0.5 ± 1.5i**, mirror images across the real axis.

## Where it is used

- **Electrical engineering.** Alternating currents and voltages are written as complex numbers. The modulus is the size of the signal and the argument is its phase, so multiplying by an impedance stretches and turns it, just as in the tool.
- **Signal processing.** Sound and radio signals are broken into rotating complex numbers, one per frequency.
- **Physics.** Waves and quantum mechanics use complex numbers to keep track of both size and phase.
- **Computer graphics.** Multiplying by a complex number of modulus 1 is a neat way to rotate a 2D point.

## Common mistakes

- **Forgetting that i² = −1.** In a product, the bd term flips sign. Watch the working line in the tool.
- **Finding the argument with tan⁻¹(b/a) alone.** That gives the wrong quadrant for numbers on the left half. Check which quadrant the point is in.
- **Leaving an angle above 180°.** After adding arguments, bring the answer back into the principal range.
- **Dividing without the conjugate.** Multiply top and bottom by w̄ to make the bottom a real number.
- **Expecting complex roots from every quadratic.** Only a negative discriminant gives them. With D ≥ 0 the roots are real and lie on the real axis.

## Questions people ask

**Is the Argand plane the same as an x-y graph?** It looks the same, but each point is a single number, not a pair of separate values. That lets you multiply points, which you cannot do with ordinary coordinates.

**Why do powers of 1 + i spiral outwards?** Its modulus is √2, which is more than 1, so each power is longer than the last, while the angle grows by 45° each time. By the 8th power, (1 + i)⁸ = 16.

**What happens if I divide by 0?** The tool tells you to move w away from the origin, because division by zero has no answer.
