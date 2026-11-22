---
title: Complex numbers
seoTitle: 'Complex numbers: JEE maths'
summary: 'The number i and its powers, algebra, conjugate and modulus, square roots, polar and Euler form, the argument and its principal value, De Moivre, cube roots and nth roots of unity, the triangle inequality, and geometry on the Argand plane: distance, section, rotation and loci such as circles, lines and conics.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'What is i⁴⁵?'
    choices: ['1', 'i', '−1', '−i']
    ans: 1
    why: 'Powers of i repeat every 4. 45 = 4 × 11 + 1, so i⁴⁵ = i¹ = i.'
  - q: 'The modulus of (3 + 4i)/(1 − i) is:'
    choices: ['5', '5/√2', '5√2', '25/2']
    ans: 1
    why: 'The modulus of a quotient is the quotient of the moduli: |3 + 4i| / |1 − i| = 5/√2.'
  - q: 'If ω is a non-real cube root of unity, 1 + ω + ω² equals:'
    choices: ['0', '1', '3', '−1']
    ans: 0
    why: 'ω satisfies ω³ − 1 = (ω − 1)(ω² + ω + 1) = 0 and ω ≠ 1, so 1 + ω + ω² = 0.'
sources:
  - 'NCERT Mathematics Class 11 (Complex numbers and quadratic equations): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Complex numbers and quadratic equations'
---

**Maths · Class 11 · about 38 minutes.** By the end you will be able to calculate with complex numbers in any form, find square roots and nth roots, use the cube roots of unity, and, most importantly for JEE, read every complex-number condition as a picture on the Argand plane: a distance, an angle, a rotation or a locus.

<div class="bigidea">A complex number is a point (or an arrow) in a plane. Adding complex numbers adds arrows. Multiplying them multiplies their lengths and adds their angles, so multiplication is a stretch and a turn. Once you see that, rotation, roots of unity and loci all become geometry.</div>

## 1. The number i and its powers

i is a number with i² = −1. Its powers go round in a cycle of four: i, −1, −i, 1, i, … So for any integer n, `$i^n$` depends only on the remainder when n is divided by 4. The sum of any four consecutive powers is 0.

A complex number is z = x + iy with real x and y. x = Re z is the real part, y = Im z the imaginary part. Two complex numbers are equal only when both parts are equal: that one fact turns one complex equation into two real ones.

<div class="myth">

**"√(−4) × √(−9) = √36 = 6."** The rule √a √b = √(ab) holds only when a and b are not both negative. Correctly, √(−4) √(−9) = 2i × 3i = −6. Write each root with i first, then multiply.

</div>

## 2. Conjugate, modulus and division

```math
\bar z = x - iy, \qquad |z| = \sqrt{x^2 + y^2}, \qquad z\bar z = |z|^2
```

<div class="meaning">
<dl>
<dt>z̄ (conjugate)</dt><dd>the mirror image of z in the real axis</dd>
<dt>|z| (modulus)</dt><dd>the distance of z from the origin; |z₁ − z₂| is the distance between two points</dd>
<dt>arg z (argument)</dt><dd>the angle the arrow to z makes with the positive real axis; its principal value lies in (−π, π]</dd>
<dt>Physical meaning</dt><dd>z z̄ = |z|² is real, which is why multiplying top and bottom by the conjugate clears i from a denominator.</dd>
</dl>
</div>

Rules worth knowing: `$\overline{z_1 + z_2} = \bar z_1 + \bar z_2$`, `$\overline{z_1 z_2} = \bar z_1 \bar z_2$`, `$|z_1 z_2| = |z_1||z_2|$`, `$|z_1 / z_2| = |z_1|/|z_2|$`. z is real exactly when z = z̄, and purely imaginary when z = −z̄. Also

```math
|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\,\mathrm{Re}(z_1\bar z_2)
```

**Square roots.** To find √(a + ib), set it equal to p + iq. Then p² − q² = a, 2pq = b, and p² + q² = √(a² + b²). Solve for p² and q², and choose signs so that pq has the sign of b. For example √(−5 + 12i) = ±(2 + 3i).

<div class="problem" data-problem="cx-sqrt"></div>

## 3. Polar form and the argument

With r = |z| and θ = arg z,

```math
z = r(\cos\theta + i\sin\theta) = re^{i\theta}
```

To find the principal argument, work out the acute angle α = tan⁻¹|y/x|, then place it by quadrant: α in the first, π − α in the second, −(π − α) in the third, −α in the fourth.

Because `$e^{i\alpha}e^{i\beta} = e^{i(\alpha+\beta)}$`, `$\arg(z_1 z_2) = \arg z_1 + \arg z_2$` and `$\arg(z_1/z_2) = \arg z_1 - \arg z_2$`, up to adding a multiple of 2π to bring the answer back to the principal range.

<figure class="fig" data-fig="argand-plane"><figcaption>Set z by its length and angle. In "z × w" the product's length is the product of the lengths and its angle is the sum of the angles. "Powers" shows De Moivre's spiral; "nth roots" shows the roots as a regular polygon.</figcaption></figure>

## 4. De Moivre and the roots of unity

**De Moivre's theorem:** `$(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta$` for any integer n. So to raise z to a power, raise the modulus to that power and multiply the argument.

<div class="problem" data-problem="cx-power"></div>

**Cube roots of unity.** The roots of z³ = 1 are 1, ω and ω², with

```math
\omega = \frac{-1 + i\sqrt3}{2} = e^{2\pi i/3}, \qquad 1 + \omega + \omega^2 = 0, \qquad \omega^3 = 1, \qquad \bar\omega = \omega^2
```

They are the corners of an equilateral triangle on the unit circle. They factor many expressions: `$a^3 + b^3 + c^3 - 3abc = (a+b+c)(a+b\omega+c\omega^2)(a+b\omega^2+c\omega)$` and `$x^2 + x + 1 = (x-\omega)(x-\omega^2)$`. For powers of ω, reduce the exponent modulo 3.

**nth roots of unity.** The roots of zⁿ = 1 are `$e^{2\pi i k/n}$` for k = 0, 1, …, n − 1. They form a regular n-gon, their sum is 0 (for n ≥ 2), and their product is `$(-1)^{n-1}$`. The nth roots of any z = re^{iθ} have modulus `$r^{1/n}$` and arguments `$(\theta + 2\pi k)/n$`.

<div class="myth">

**"zⁿ = w has one answer, like a real root."** It has exactly n different answers, spread evenly round a circle. Taking only the principal one loses n − 1 of them, and JEE questions about sums and products of roots need all of them.

</div>

## 5. Geometry on the Argand plane (JEE Main and Advanced)

- **Distance and section.** |z₁ − z₂| is the distance; the point dividing z₁z₂ in the ratio m : n is (mz₂ + nz₁)/(m + n).
- **Triangle inequality.** `$\big||z_1| - |z_2|\big| \le |z_1 + z_2| \le |z_1| + |z_2|$`. Equality on the right means z₁ and z₂ point the same way. Greatest and least values of |z| on a circle follow from this.
- **Rotation.** Multiplying by `$e^{i\phi}$` turns an arrow by φ about the origin. To turn point z about point a: `$z' - a = (z - a)e^{i\phi}$`. If the angle at A between AB and AC is θ, then `$\dfrac{c - a}{b - a} = \dfrac{|c-a|}{|b-a|}e^{i\theta}$`.
- **Equilateral triangle.** z₁, z₂, z₃ form one exactly when `$z_1^2 + z_2^2 + z_3^2 = z_1z_2 + z_2z_3 + z_3z_1$`.

**Loci.** Read each condition as a distance or an angle:

| Condition | Locus |
|---|---|
| \|z − a\| = r | circle, centre a, radius r |
| \|z − a\| = \|z − b\| | perpendicular bisector of ab |
| \|z − a\| = k\|z − b\|, k ≠ 1 | a circle (Apollonius circle) |
| \|z − a\| + \|z − b\| = 2c > \|a − b\| | ellipse with foci a, b |
| \|\|z − a\| − \|z − b\|\| = 2c < \|a − b\| | hyperbola with foci a, b |
| arg((z − a)/(z − b)) = θ | arc of a circle through a and b |
| Re z, Im z conditions | substitute z = x + iy and simplify |

<div class="problem" data-problem="cx-locus"></div>

**Worked example.** Find the greatest value of |z| when |z − 3 − 4i| = 2. The point z lies on a circle of radius 2 around 3 + 4i, which is 5 from the origin. The farthest point of the circle from the origin is on the line through the centre: 5 + 2 = **7**. The nearest is 5 − 2 = 3.

<div class="keypoints">

- iⁿ repeats every 4; equal complex numbers have equal real and equal imaginary parts.
- z z̄ = |z|²; |z₁z₂| = |z₁||z₂|; arg(z₁z₂) = arg z₁ + arg z₂ (adjust to the principal range).
- Square root of a + ib: p² − q² = a, p² + q² = |z|, sign of pq = sign of b.
- De Moivre: (r e^{iθ})ⁿ = rⁿ e^{inθ}; zⁿ = w has n roots forming a regular polygon.
- 1 + ω + ω² = 0, ω³ = 1, ω̄ = ω².
- Rotation: z′ − a = (z − a)e^{iφ}. Loci: |z − a| is a distance, arg is an angle.

</div>
