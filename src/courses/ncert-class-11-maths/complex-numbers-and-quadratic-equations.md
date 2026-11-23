---
title: Complex Numbers and Quadratic Equations
seoTitle: 'Complex Numbers Class 11 notes and examples'
summary: 'Class 11 Complex Numbers and Quadratic Equations with animations: i, the Argand plane, algebra, conjugate, modulus, argument, polar form and quadratic roots.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'i⁴³ equals:'
    choices: ['−i', 'i', '1', '−1']
    ans: 0
    why: '43 = 4 × 10 + 3, so i⁴³ = i³ = i² · i = −i.'
  - q: '(2 + 3i)(2 − 3i) equals:'
    choices: ['13', '4 − 9i', '−5', '4 + 9i']
    ans: 0
    why: 'z · z̄ = |z|² = 2² + 3² = 13. (The cross terms cancel and −9i² = +9.)'
  - q: 'The roots of x² − 2x + 5 = 0 are:'
    choices: ['1 ± 2i', '1 ± 4i', '−1 ± 2i', '2 ± i']
    ans: 0
    why: 'The discriminant is 4 − 20 = −16, so x = (2 ± 4i)/2 = 1 ± 2i.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 4 “Complex Numbers and Quadratic Equations” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard complex numbers (e.g. Needham, T., Visual Complex Analysis, Oxford University Press, chapter 1); every number in the figures was recomputed in code.'
---

**Maths · Class 11 · Chapter 4 · about 90 minutes.** By the end you will be able to add, multiply and divide complex numbers, find conjugates and moduli, place a complex number on the Argand plane and write it in polar form, and solve quadratic equations that have no real roots.

<div class="bigidea">No real number squares to −1, so mathematicians simply invented one and called it i. Surprisingly, nothing breaks. Numbers of the form a + bi behave like points on a plane, adding is sliding, multiplying is turning and stretching, and every quadratic equation finally has its two roots.</div>

## 1. Why we need i

Try to solve `$x^2 + 1 = 0$`. You need a number whose square is −1, but every real number squared is zero or positive. The graph of `$y = x^2 + 1$` never touches the x-axis, which says the same thing. We therefore **define** a new number `$i$` by

```math
i^2 = -1, \qquad i = \sqrt{-1}
```

A **complex number** is `$z = a + bi$` with a and b real. `$a$` is the **real part**, `$\operatorname{Re}(z)$`, and `$b$` is the **imaginary part**, `$\operatorname{Im}(z)$` (note: `$b$`, not `$bi$`). Every real number is complex (with `$b = 0$`); a number like `$3i$` with `$a = 0$` is **purely imaginary**. Two complex numbers are equal exactly when their real parts match and their imaginary parts match.

### 1.1 Powers of i

Each time you multiply by i the value turns a quarter of a circle. So the powers cycle through four values and repeat: `$i, -1, -i, 1, i, -1, \dots$`. To find `$i^n$`, divide n by 4 and use the remainder. Press play or slide n.

<figure class="fig" data-fig="c11m-cx-powers"><figcaption>Each multiplication by i turns the point a quarter turn anticlockwise: 1, i, −1, −i, then back to 1. Only n's remainder on division by 4 matters.</figcaption></figure>

<div class="problem" data-problem="c11m-cx-power"></div>

<div class="myth">

**"i = −1."** No: `$i^2 = -1$`, but `$i$` itself is a new number that is not on the real number line. Also be careful with `$\sqrt{-a}$`: write `$\sqrt{-a} = i\sqrt{a}$` **before** combining, because `$\sqrt{-2}\cdot\sqrt{-3} = i\sqrt2 \cdot i\sqrt3 = -\sqrt6$`, not `$+\sqrt6$`.

</div>

## 2. Algebra of complex numbers

Treat i like a letter and replace `$i^2$` by −1 whenever it appears.

- **Add and subtract** real and imaginary parts separately: `$(2 + 3i) + (4 - 5i) = 6 - 2i$`.
- **Multiply** by expanding: `$(a + bi)(c + di) = ac + adi + bci + bdi^2 = (ac - bd) + (ad + bc)i$`.
- Useful: `$(a + bi)^2 = a^2 - b^2 + 2abi$` and `$(a + bi)(a - bi) = a^2 + b^2$`.

<div class="problem" data-problem="c11m-cx-product"></div>

## 3. The Argand plane

Draw two perpendicular axes: the **real axis** (horizontal) and the **imaginary axis** (vertical). The complex number `$a + bi$` is the point `$(a, b)$`. This picture is the **Argand plane** (or complex plane). Real numbers sit on the horizontal axis; purely imaginary numbers on the vertical axis. Drag the point below and read off its real part, imaginary part, **modulus** and **argument**.

<figure class="fig" data-fig="c11m-cx-plane"><figcaption>Drag z. The dashed lines show the real and imaginary parts, the length of the blue arrow is the modulus |z|, the green arc is the argument, and z̄ is the mirror image in the real axis.</figcaption></figure>

<div class="meaning">
<dl>
<dt>`$|z| = \sqrt{a^2 + b^2}$`</dt><dd>the modulus: the distance of the point from the origin.</dd>
<dt>`$\arg z = \theta$`</dt><dd>the argument: the angle from the positive real axis to the arrow, measured anticlockwise. The <b>principal argument</b> lies between −π and π.</dd>
<dt>`$\bar z = a - bi$`</dt><dd>the conjugate: the mirror image of z in the real axis.</dd>
</dl>
</div>

<!--fig:tool argand-plane-->

### 3.1 Adding on the plane

Adding complex numbers is adding arrows tip to tail: `$z_1 + z_2$` is the far corner of the parallelogram built on the two arrows. And `$z_1 - z_2 = z_1 + (-z_2)$`. The length of the sum is never more than the sum of the lengths (the **triangle inequality**): `$|z_1 + z_2| \le |z_1| + |z_2|$`, because a straight road is the shortest way between two towns.

<figure class="fig" data-fig="c11m-cx-add"><figcaption>Drag z1 and z2. The sum is the corner of the parallelogram; for a difference, z2 is flipped first. Compare the lengths in the readout.</figcaption></figure>

## 4. Conjugate and modulus

The conjugate `$\bar z = a - bi$` is the mirror image of z. Three quick facts come straight from the picture:

```math
z + \bar z = 2a\ (\text{real}),\qquad z - \bar z = 2bi\ (\text{imaginary}),\qquad z\bar z = a^2 + b^2 = |z|^2\ (\text{real, } \ge 0)
```

<figure class="fig" data-fig="c11m-cx-conj"><figcaption>Drag z. The sum z + z̄ lands on the real axis at 2a, the difference z − z̄ on the imaginary axis at 2bi, and the product z·z̄ on the real axis at |z|².</figcaption></figure>

The last fact makes **division** easy. To divide, multiply top and bottom by the conjugate of the bottom, so the bottom turns into the real number `$|\text{bottom}|^2$`. Follow `$\dfrac{3 + 2i}{1 - i}$`.

<div class="steps" data-fig="c11m-cx-divide">
<div class="step">We want (3 + 2i)/(1 − i) in the form a + bi. The trouble: i is in the bottom.</div>
<div class="step">The conjugate of the bottom 1 − i is 1 + i. Multiply top and bottom by it (that is multiplying by 1).</div>
<div class="step">Top: (3 + 2i)(1 + i) = 3 + 3i + 2i + 2i² = 1 + 5i, using i² = −1.</div>
<div class="step">Bottom: (1 − i)(1 + i) = 1 − i² = 2. The bottom is now a plain real number.</div>
<div class="step">(1 + 5i)/2 = 0.5 + 2.5i. That is the quotient, the orange point.</div>
<div class="step">Check by multiplying back: (0.5 + 2.5i)(1 − i) = 3 + 2i.</div>
</div>

<div class="problem" data-problem="c11m-cx-quotient"></div>

<div class="problem" data-problem="c11m-cx-modulus"></div>

Rules for modulus and conjugate (true for all complex numbers): `$|z_1 z_2| = |z_1||z_2|$`, `$|z_1/z_2| = |z_1|/|z_2|$`, `$\overline{z_1 + z_2} = \bar z_1 + \bar z_2$`, `$\overline{z_1 z_2} = \bar z_1\,\bar z_2$` and `$|\bar z| = |z|$`.

## 5. Polar form

A point can also be described by its distance and direction. With `$r = |z|$` and `$\theta = \arg z$`, we have `$a = r\cos\theta$` and `$b = r\sin\theta$`, so

```math
z = r(\cos\theta + i\sin\theta)
```

This **polar form** shows what multiplication does. If `$z_1 = r_1(\cos\theta_1 + i\sin\theta_1)$` and `$z_2 = r_2(\cos\theta_2 + i\sin\theta_2)$`, then using the sum formulae of trigonometry,

```math
z_1 z_2 = r_1 r_2\,\bigl(\cos(\theta_1 + \theta_2) + i\sin(\theta_1 + \theta_2)\bigr)
```

**Lengths multiply, angles add.** So multiplying by z stretches by |z| and turns by arg z. Drag the two points and check both rules:

<figure class="fig" data-fig="c11m-cx-mult"><figcaption>z1·z2 has length |z1||z2| and angle arg z1 + arg z2. Multiplying by i (a point at angle 90°, length 1) is a pure quarter turn.</figcaption></figure>

### 5.1 Finding the argument without errors

To find θ for `$a + bi$`: first find the reference angle `$\alpha = \tan^{-1}(|b|/|a|)$`, then decide the quadrant of the point from the signs of a and b:

- quadrant I: `$\theta = \alpha$`; quadrant II: `$\theta = \pi - \alpha$`;
- quadrant III: `$\theta = -(\pi - \alpha)$`; quadrant IV: `$\theta = -\alpha$`.

<figure class="fig" data-fig="c11m-cx-polar"><figcaption>Drag z (or use the buttons) into any quadrant. The dashed red arc is what tan⁻¹(b/a) on a calculator gives; the green arc is the true argument. They differ in quadrants II and III.</figcaption></figure>

<div class="problem" data-problem="c11m-cx-argument"></div>

<div class="myth">

**"arg(a + bi) = tan⁻¹(b/a)."** A calculator's tan⁻¹ only returns angles between −90° and 90°, so for points on the left side (quadrants II and III) it is wrong by 180°. Always look at which quadrant the point is in. For `$-1 + i$` the calculator says −45°, but the point is in quadrant II and the argument is 135°.

</div>

## 6. Quadratic equations with complex roots

For `$ax^2 + bx + c = 0$` the **quadratic formula** gives

```math
x = \frac{-b \pm \sqrt{D}}{2a}, \qquad D = b^2 - 4ac
```

The **discriminant** `$D$` tells you the story. If `$D > 0$` there are two different real roots (the parabola cuts the x-axis twice). If `$D = 0$` there is one repeated real root (it touches). If `$D < 0$` there are no real roots, but there are **two complex roots**, and because the formula has `$\pm\sqrt D$` with `$\sqrt D = i\sqrt{-D}$`, they are conjugates:

```math
x = -\frac{b}{2a} \pm i\,\frac{\sqrt{-D}}{2a}
```

Slide b and c for `$x^2 + bx + c = 0$` and watch the roots leave the real axis and move into the Argand plane when the parabola lifts off the x-axis.

<figure class="fig" data-fig="c11m-cx-quad"><figcaption>Left: the parabola. Right: the roots on the Argand plane. Real roots (D ≥ 0) sit on the horizontal axis; for D < 0 they form a conjugate pair above and below it.</figcaption></figure>

Here is a full solution, one step at a time:

<div class="steps" data-fig="c11m-cx-quadsteps">
<div class="step">x² − 2x + 5 = 0 has a = 1, b = −2, c = 5. The formula is x = (−b ± √D) / 2a.</div>
<div class="step">D = b² − 4ac = 4 − 20 = −16. Negative: no real roots, and the parabola misses the x-axis.</div>
<div class="step">√D = √(−16) = √16 · √(−1) = 4i.</div>
<div class="step">x = (2 ± 4i) / 2.</div>
<div class="step">x = 1 + 2i or x = 1 − 2i. A conjugate pair, mirrored in the real axis.</div>
<div class="step">Check x = 1 + 2i: (1 + 2i)² − 2(1 + 2i) + 5 = (1 + 4i − 4) − 2 − 4i + 5 = 0.</div>
</div>

<div class="problem" data-problem="c11m-cx-root"></div>

A useful fact: for a quadratic with **real** coefficients, complex roots always come as a conjugate pair, so if `$2 + 3i$` is a root then `$2 - 3i$` is too. The sum of the roots is `$-b/a$` and the product is `$c/a$`, whether the roots are real or complex. Explore more equations in the [Quadratic explorer](/learn/quadratic-explorer/).

<!--fig:tool quadratic-explorer-->

<div class="history">

- **1545:** Gerolamo Cardano meets square roots of negative numbers while solving cubic equations and calls them "subtle".
- **c. 1777:** Leonhard Euler introduces the letter i for the square root of −1.
- **1806:** Jean-Robert Argand publishes the plane picture of complex numbers (Caspar Wessel had found it in 1797).
- **Today:** engineers describe alternating current, radio waves and sound with complex numbers.

</div>

<div class="keypoints">

- i² = −1; a complex number is a + bi with real part a and imaginary part b. Powers of i repeat in fours: i, −1, −i, 1.
- Add and subtract parts separately; multiply by expanding and using i² = −1.
- a + bi is the point (a, b) on the Argand plane. |z| = √(a² + b²); the conjugate z̄ = a − bi.
- z·z̄ = |z|² is real; divide by multiplying top and bottom by the conjugate of the bottom.
- Polar form z = r(cos θ + i sin θ): multiplication multiplies lengths and adds angles. Fix the quadrant when finding θ.
- D = b² − 4ac: D < 0 gives the conjugate pair −b/2a ± i√(−D)/2a.
- Sum of roots = −b/a, product = c/a.

</div>

Going further for JEE/NEET: [Complex numbers](/learn/courses/engineering-entrance/complex-numbers/) and [Quadratic equations](/learn/courses/engineering-entrance/quadratic-equations/) have the exam-level roots of unity, locus and inequality problems.
