---
title: 'Complex Numbers and Quadratic Equations: practice questions'
seoTitle: 'Complex Numbers Class 11 questions with answers'
summary: 'Practice for Class 11 Complex Numbers and Quadratic Equations: algebra, conjugate, modulus, argument, polar form and complex roots, 1 to 5 marks.'
minutes: 65
updated: 2026-11-23
quiz:
  - q: 'The conjugate of −2 + 5i is:'
    choices: ['−2 − 5i', '2 − 5i', '2 + 5i', '−5 + 2i']
    ans: 0
    why: 'Change only the sign of the imaginary part.'
  - q: 'The modulus of −6 + 8i is:'
    choices: ['10', '2', '14', '100']
    ans: 0
    why: '√(36 + 64) = √100 = 10.'
  - q: 'The roots of x² + 6x + 13 = 0 are:'
    choices: ['−3 ± 2i', '3 ± 2i', '−3 ± 4i', '−6 ± 13i']
    ans: 0
    why: 'D = 36 − 52 = −16, so x = (−6 ± 4i)/2 = −3 ± 2i.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 4.** Read the lesson, [Complex Numbers and Quadratic Equations](/learn/courses/ncert-class-11-maths/complex-numbers-and-quadratic-equations/), first. Try each question on paper before you open the answer.

<div class="bigidea">Treat i like a letter, and replace i² by −1 every time it appears. For a quotient, multiply top and bottom by the conjugate of the bottom. For an argument, look at the quadrant before you trust the calculator.</div>

## How to set out answers

1. Expand products fully, then replace `$i^2$` by −1 and collect real and imaginary parts.
2. For a quotient, write "multiply top and bottom by the conjugate" and show the bottom becoming real.
3. For a modulus or argument, sketch the point and name its quadrant.
4. For a quadratic, write the discriminant first and say whether the roots are real or complex.

## 1-mark questions

1. Find the value of i¹⁰.
<details><summary>Answer</summary>10 = 4 × 2 + 2, so i¹⁰ = i² = −1.</details>

2. Write the conjugate of −2 + 5i.
<details><summary>Answer</summary>−2 − 5i.</details>

3. Find |−6 + 8i|.
<details><summary>Answer</summary>√(36 + 64) = 10.</details>

4. Write the real part and the imaginary part of 3 − 7i.
<details><summary>Answer</summary>Real part 3; imaginary part −7 (the coefficient of i, not −7i).</details>

5. Find the discriminant of x² + x + 1 = 0.
<details><summary>Answer</summary>D = 1 − 4 = −3.</details>

## 2-mark and 3-mark questions

6. Find (2 + 3i)(4 − i) in the form a + bi. *(2 marks)*
<details><summary>Answer</summary>

`$8 - 2i + 12i - 3i^2 = 8 + 10i + 3 = 11 + 10i$`.

</details>

7. Write `$\dfrac{1}{3 + 4i}$` in the form a + bi. *(3 marks)*
<details><summary>Answer</summary>

Multiply top and bottom by `$3 - 4i$`: `$\dfrac{3 - 4i}{(3 + 4i)(3 - 4i)} = \dfrac{3 - 4i}{9 + 16} = \dfrac{3}{25} - \dfrac{4}{25}i$`.

</details>

8. Find real x and y if (x + 2i) + (3 − yi) = 7 + 5i. *(2 marks)*
<details><summary>Answer</summary>

Real parts: `$x + 3 = 7$`, so `$x = 4$`. Imaginary parts: `$2 - y = 5$`, so `$y = -3$`.

</details>

9. Find the modulus and the principal argument of `$-1 + \sqrt3\, i$`. *(3 marks)*
<details><summary>Answer</summary>

`$r = \sqrt{1 + 3} = 2$`. The point is in quadrant II, with reference angle `$\tan^{-1}\sqrt3 = \pi/3$`. So the argument is `$\pi - \pi/3 = 2\pi/3$`. Polar form: `$2\left(\cos\tfrac{2\pi}{3} + i\sin\tfrac{2\pi}{3}\right)$`.

</details>

10. Solve `$x^2 + 6x + 13 = 0$`. *(3 marks)*
<details><summary>Answer</summary>

`$D = 36 - 52 = -16$`, so `$x = \dfrac{-6 \pm 4i}{2} = -3 \pm 2i$`.

</details>

## 5-mark questions (model answers)

11. Express `$\dfrac{1 + 2i}{1 - 3i}$` in the form a + bi, and find its modulus and principal argument. *(5 marks)*
<details><summary>Answer</summary>

Multiply top and bottom by `$1 + 3i$`. Top: `$(1 + 2i)(1 + 3i) = 1 + 3i + 2i + 6i^2 = -5 + 5i$`. Bottom: `$1 + 9 = 10$`. So the quotient is `$-\tfrac12 + \tfrac12 i$`.

Modulus: `$\sqrt{\tfrac14 + \tfrac14} = \tfrac{1}{\sqrt2}$`. The point `$(-\tfrac12, \tfrac12)$` is in quadrant II, with reference angle `$\pi/4$`, so the principal argument is `$\pi - \pi/4 = 3\pi/4$`.

</details>

12. One root of `$x^2 + px + q = 0$` (p, q real) is `$2 - 3i$`. Find p and q. *(5 marks)*
<details><summary>Answer</summary>

The coefficients are real, so complex roots come in conjugate pairs: the other root is `$2 + 3i$`. Sum of roots: `$4 = -p$`, so `$p = -4$`. Product: `$(2 - 3i)(2 + 3i) = 4 + 9 = 13 = q$`. The equation is `$x^2 - 4x + 13 = 0$`.

</details>

## Case-based question

In an alternating-current circuit, resistance and reactance are combined in a complex impedance. Two parts have impedances `$Z_1 = 3 + 4i$` and `$Z_2 = 1 - 2i$` (in ohms).

13. (a) Find Z₁ + Z₂ (parts in series). (b) Find |Z₁|. (c) Write the conjugate of Z₁. (d) Find Z₁ · Z₂. *(4 marks)*
<details><summary>Answer</summary>

(a) `$4 + 2i$`. (b) `$\sqrt{9 + 16} = 5$` ohms. (c) `$3 - 4i$`. (d) `$(3 + 4i)(1 - 2i) = 3 - 6i + 4i - 8i^2 = 11 - 2i$`.

</details>

<div class="problem" data-problem="c11m-cx-quotient"></div>

## Assertion and reason

14. **Assertion (A):** x² + 4 = 0 has no real root but has two complex roots. **Reason (R):** Its discriminant is −16.
<details><summary>Answer</summary>Both true and R explains A (option a): D = 0 − 16 = −16 < 0, so the roots are ±2i.</details>

15. **Assertion (A):** |z₁ + z₂| = |z₁| + |z₂| for all complex numbers. **Reason (R):** The length of the sum of two vectors is at most the sum of their lengths.
<details><summary>Answer</summary>A is false (it holds only when the two arrows point the same way). R is true (the triangle inequality). Option (d).</details>

<div class="problem" data-problem="c11m-cx-root"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="complex-numbers-and-quadratic-equations" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- i² = −1; powers of i repeat in fours.
- Multiply by expanding; divide by multiplying top and bottom by the conjugate of the bottom.
- |z| = √(a² + b²); z·z̄ = |z|²; fix the quadrant when finding the argument.
- D = b² − 4ac < 0 gives two conjugate complex roots; sum of roots −b/a, product c/a.
- Real-coefficient quadratics: if p + qi is a root so is p − qi.

</div>
