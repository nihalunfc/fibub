---
name: Argand plane
num: 1187
shelf: learn
code: L90
section: school-maths
title: "Argand plane interactive: add, multiply and divide complex numbers, modulus, argument, powers of i, complex roots"
summary: "Drag two complex numbers z and w on the Argand plane and see z + w as a parallelogram, z × w as stretch-and-turn, the conjugate as a reflection, modulus, argument and polar form, powers of i as quarter turns, and the complex roots of a quadratic appearing when the parabola misses the x-axis."
status: live
ads: false
order: 1187
icon: compass
works: offline
updated: 2026-11-16
related: [unit-circle, symbolic-algebra, function-grapher]
sources:
  - "Standard complex number algebra: i² = −1, the Argand plane, modulus, principal argument in (−π, π], polar form, and the quadratic formula with a negative discriminant. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against Python's complex numbers and cmath.phase (sums, products, quotients, powers, modulus and argument) and numpy.roots (roots of five quadratics)."
flow:
  - { icon: pointer, label: "Drag z, w" }
  - { icon: sliders, label: "Operation" }
  - { icon: compass, label: "Picture" }
  - { icon: calculator, label: "a + bi" }
---

## What it shows

A complex number z = a + bi has a real part a and an imaginary part b, where i² = −1. On the **Argand plane** it is the point (a, b), or the arrow from 0 to that point. Its length is the **modulus** |z| = √(a² + b²) and its angle from the positive real axis is the **argument** arg z. Seen this way, the algebra turns into geometry:

- **z + w** is the fourth corner of the parallelogram on z and w (like adding vectors).
- **z × w** stretches z by |w| and turns it by arg w: lengths multiply, angles add.
- **z̄**, the conjugate a − bi, is the reflection of z in the real axis.
- **i × z** turns z a quarter turn anticlockwise, which is why i² = −1 (two quarter turns point backwards).

It follows complex numbers and quadratic equations in Class 11 maths. The [[unit-circle]] page explains the angles and the cos and sin inside the polar form; [[symbolic-algebra]] simplifies complex expressions; and the [[function-grapher]] draws any parabola.

## How to use it

1. **Pick an operation**: z + w, z − w, z × w, z ÷ w, the conjugate z̄, i × z, or zⁿ.
2. **Drag** the blue point z and the orange point w on the plane, or type their parts in the boxes. *Snap to halves* keeps the numbers tidy.
3. The **green arrow** is the answer. Under the picture, the working line fills in your numbers, and the facts give each number's modulus, argument and the polar form of the answer.
4. For **zⁿ**, slide n from 0 to 8 to see the powers spiral out (|z| > 1) or in (|z| < 1).
5. In **Complex roots of a quadratic**, slide a, b and c. The left picture is the parabola; the right one shows the two roots on the Argand plane.

## Worked example

Take z = 3 + i and w = 1 + 2i. Then z + w = **4 + 3i**. For the product, (3 + i)(1 + 2i) = 3 + 6i + i + 2i² = **1 + 7i**. Check with the geometry: |z| = √10 ≈ 3.1623 and |w| = √5 ≈ 2.2361 multiply to 7.0711 = |1 + 7i|, and arg z ≈ 18.43° plus arg w ≈ 63.43° gives 81.87° = arg(1 + 7i). Dividing, (3 + i) ÷ (1 + 2i) = (3 + i)(1 − 2i) / 5 = **1 − i**.

For x² + 2x + 5 = 0, the discriminant is 4 − 20 = −16, so the parabola never touches the x-axis and the roots are (−2 ± 4i) / 2 = **−1 ± 2i**, a conjugate pair.

## Things to notice

- The argument shown is the **principal value**, between −180° and 180° (−π and π). When the angles of a product add past 180°, subtract 360°.
- Real quadratics always have complex roots in **conjugate pairs**: mirror images in the real axis.
- Powers of i repeat every four: i, −1, −i, 1.

## Check yourself

Five questions with fresh numbers: a modulus, the real part of a product, a power of i, an argument, and the roots of a quadratic. Nothing is saved.

## Solve your own numbers

The first card works with the numbers from your own question. Choose what to find, type the parts, and the answer appears as one sentence with the working underneath, set out the way an exam answer is marked.

- **z and w**: add, subtract, multiply or divide, for example (3 + i)(1 + 2i) = 1 + 7i. Division multiplies top and bottom by the conjugate.
- **Modulus and argument of z**: |z| and arg z in degrees and radians, using the reference angle and the quadrant, with the polar form.
- **Polar form to a + bi**: type r and θ (pick degrees or radians) and get a + bi.
- **Power zⁿ**: De Moivre's theorem for whole n from −60 to 60, for example (1 + i)⁸ = 16.
- **Roots of a quadratic**: type a, b and c. Real or complex roots come with the discriminant and a sum-and-product check.

Zero divisors, zero modulus and a = 0 give a plain message. A line under each answer names the usual slip, such as using tan⁻¹(b/a) without checking the quadrant.

## FAQ

**How do I find the modulus and argument of a complex number?** Type a and b in the first card and choose *Modulus and argument of z*: |z| = √(a² + b²), and the argument comes from the reference angle tan⁻¹(|b|/|a|) placed in the right quadrant.

**Why is the argument of a negative real number 180° and not −180°?** The principal argument is taken in (−π, π], which includes π but not −π.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
