---
title: 'Complex numbers: question types and traps'
seoTitle: 'Complex numbers JEE questions: types and traps'
summary: 'Every way entrance exams test complex numbers: powers of i, algebra and division, conjugate and modulus, square roots, polar form and argument, De Moivre, cube and nth roots of unity, the triangle inequality, rotation and loci, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The principal argument of −1 − i is:'
    choices: ['π/4', '5π/4', '−3π/4', '3π/4']
    ans: 2
    why: 'The point is in the third quadrant with acute angle π/4. The principal value must lie in (−π, π], so it is −(π − π/4) = −3π/4. 5π/4 is the same direction but outside the principal range.'
  - q: 'If |z| = 1 and z ≠ −1, then (1 − z)/(1 + z) is always:'
    choices: ['real', 'purely imaginary (or zero)', 'of modulus 1', 'equal to z']
    ans: 1
    why: 'With z = e^{iθ}, (1 − z)/(1 + z) = −i tan(θ/2), which is purely imaginary.'
  - q: 'The locus of z with |z − 2| = |z + 2i| is:'
    choices: ['a circle', 'the line y = −x', 'the line y = x', 'an ellipse']
    ans: 1
    why: 'Equal distances from 2 and −2i: the perpendicular bisector of the segment joining (2, 0) and (0, −2), which is the line y = −x.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Complex numbers and quadratic equations; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Complex numbers](/learn/courses/engineering-entrance/complex-numbers/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Easy complex-number questions are algebra: compare real and imaginary parts. Hard ones are geometry: every modulus is a distance and every argument an angle. Switch to the picture as soon as the algebra gets long.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Powers of i and of ω.</b> Reduce the exponent mod 4 (for i) or mod 3 (for ω). <i>Trap:</i> negative exponents: i⁻¹ = −i.</div>
<div class="step"><b>2. Algebra and division.</b> Multiply by the conjugate of the denominator. <i>Trap:</i> √(−a)√(−b) ≠ √(ab).</div>
<div class="step"><b>3. Conjugate and modulus.</b> z real ⇔ z = z̄; |z|² = z z̄. <i>Trap:</i> |z₁ + z₂| is not |z₁| + |z₂| in general.</div>
<div class="step"><b>4. Square roots.</b> p² − q² = a, p² + q² = |z|. <i>Trap:</i> wrong sign pairing; pq must have the sign of b.</div>
<div class="step"><b>5. Polar form and argument.</b> Acute angle, then quadrant. <i>Trap:</i> giving an argument outside (−π, π].</div>
<div class="step"><b>6. De Moivre and powers.</b> (1 + i)ⁿ, (√3 + i)ⁿ, and conditions like "zⁿ is real". <i>Trap:</i> forgetting the modulus raised to n.</div>
<div class="step"><b>7. Roots of unity.</b> Sums, products and factorisations with ω or e^{2πik/n}. <i>Trap:</i> the sum of all nth roots is 0 but the sum of their kth powers is n when n divides k.</div>
<div class="step"><b>8. Triangle inequality and extremes.</b> Greatest or least |z| on a circle or line. <i>Trap:</i> not checking that equality can actually happen.</div>
<div class="step"><b>9. Rotation and triangles.</b> (c − a)/(b − a) carries the angle at A. <i>Trap:</i> rotating about the origin instead of about a.</div>
<div class="step"><b>10. Loci.</b> Circle, line, ellipse, hyperbola, arc. <i>Trap:</i> |z − a| + |z − b| = |a − b| is just the segment, not an ellipse.</div>
</div>

## Worked examples

**Example 1 (level 3, equation).** Solve z² + |z| = 0. *Solution.* z² = −|z| is real and not positive, so z is purely imaginary or zero. Put z = iy: −y² + |y| = 0, so |y| = 0 or 1. **z = 0, i or −i.**

**Example 2 (level 4, roots of unity).** Find (1 + ω)(1 + ω²)(1 + ω⁴)(1 + ω⁸), where ω is a non-real cube root of unity. *Solution.* ω⁴ = ω and ω⁸ = ω². So the product is [(1 + ω)(1 + ω²)]². Now (1 + ω)(1 + ω²) = 1 + ω + ω² + ω³ = 0 + 1 = 1. **Answer 1.**

**Example 3 (level 4, extremes).** If |z − 4/z| = 2, find the greatest value of |z|. *Solution.* By the triangle inequality, |z| − 4/|z| ≤ |z − 4/z| = 2. With t = |z| > 0: t² − 2t − 4 ≤ 0, so t ≤ 1 + √5. Equality holds when z and −4/z point the same way, for example z = (1 + √5)i. **Greatest |z| = 1 + √5.**

**Example 4 (level 5, rotation).** Two vertices of an equilateral triangle are 0 and 2 + 2i. Find the third. *Solution.* Turn 2 + 2i by ±60° about 0: (2 + 2i)(1/2 ± i√3/2). With + this is (1 − √3) + (1 + √3)i; with − it is (1 + √3) + (1 − √3)i. **Two answers**, one on each side of the segment.

<div class="myth">

**"arg(z₁z₂) = arg z₁ + arg z₂, always."** Only up to a multiple of 2π. With principal values, arg(−1) + arg(−1) = 2π, but arg(1) = 0. When the sum leaves (−π, π], subtract or add 2π.

</div>

<div class="meaning">
<dl>
<dt>|z − a|</dt><dd>distance from z to the point a</dd>
<dt>arg((z − a)/(z − b))</dt><dd>the angle between the arrows from b to z and from a to z</dd>
<dt>Physical meaning</dt><dd>Every locus question asks "which points keep this distance or this angle?" Draw the fixed points first, and the shape usually names itself.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="complex-numbers" data-mode="practice"></div>

<div class="keypoints">

- Reduce powers of i mod 4 and of ω mod 3; 1 + ω + ω² = 0.
- Clear denominators with the conjugate; compare real and imaginary parts.
- Principal argument in (−π, π]: acute angle, then quadrant.
- Triangle inequality gives greatest and least moduli; check when equality holds.
- Rotation about a: z′ − a = (z − a)e^{iφ}.
- Loci: equal distances, a line; ratio of distances, a circle; sum of distances, an ellipse; constant angle, an arc.

</div>
