---
title: 'Determinants: practice questions'
seoTitle: 'Determinants Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Determinants: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'If a 2 × 2 matrix has determinant 0, then it is:'
    choices: ['singular', 'an identity matrix', 'non-singular', 'symmetric']
    ans: 0
    why: 'A square matrix with |A| = 0 is called singular, and it has no inverse.'
  - q: 'For a 3 × 3 matrix A with |A| = 3, the value of |2A| is:'
    choices: ['24', '6', '12', '9']
    ans: 0
    why: 'Every one of the three rows is doubled, so |2A| = 2³ × 3 = 24.'
  - q: 'The adjoint of the matrix with rows (2, 3) and (1, 4) has rows:'
    choices: ['(4, −3) and (−1, 2)', '(4, 3) and (1, 2)', '(2, −3) and (−1, 4)', '(−4, 3) and (1, −2)']
    ans: 0
    why: 'Swap the diagonal entries (2 and 4) and change the signs of the other two (3 and 1).'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 4.** Read the chapter lesson, [Determinants](/learn/courses/ncert-class-12-maths/determinants/), first. Try each question on paper before opening the answer. Board marks come for the method, so show every step.

<div class="bigidea">Most determinant questions are one of four jobs: expand a determinant without a sign slip, get an area, find an adjoint and inverse, or solve equations with A⁻¹ or Cramer’s rule. Check each answer with a quick second method: for the inverse, multiply back and look for I.</div>

## How to set out a determinant question

1. Write the determinant or matrix clearly and say which row or column you expand along (the one with most zeros).
2. Write the sign for each term from the checkerboard `$+ - + / - + - / + - +$` before you work out the minor.
3. For an inverse: find `$|A|$`, then the cofactors, then transpose them to get `$\operatorname{adj}A$`, then divide by `$|A|$`.
4. For equations: write `$AX = B$`, check `$|A| \ne 0$`, then solve and substitute back to test.

<div class="problem" data-problem="c12m-det-three"></div>

<div class="problem" data-problem="c12m-det-tri"></div>

## 1-mark questions

1. Find the value of the determinant with rows (5, 2) and (3, 4).

<details><summary>Answer</summary>

5 × 4 − 2 × 3 = 20 − 6 = 14.

</details>

2. When is a square matrix called singular?

<details><summary>Answer</summary>When its determinant is 0. Such a matrix has no inverse.</details>

3. A is a 2 × 2 matrix with |A| = 5. Write the value of |3A|.

<details><summary>Answer</summary>

Both rows are multiplied by 3, so |3A| = 3² × 5 = 45.

</details>

4. For which value of `$x$` is the determinant with rows `$(x, 2)$` and `$(3, 6)$` equal to 0?

<details><summary>Answer</summary>

6x − 6 = 0, so x = 1.

</details>

## 2- and 3-mark questions

5. (2) Find the area of the triangle with corners (1, 1), (3, 1) and (1, 5), using a determinant.

<details><summary>Answer</summary>

Rows (1, 1, 1), (3, 1, 1), (1, 5, 1). Expanding along row 1: 1(1 − 5) − 1(3 − 1) + 1(15 − 1) = −4 − 2 + 14 = 8. Area = ½ × 8 = 4 square units. (Check: base 2, height 4, half of 8 is 4.)

</details>

6. (2) Show that the points (1, 2), (2, 4) and (3, 6) are collinear.

<details><summary>Answer</summary>

The determinant with rows (1, 2, 1), (2, 4, 1), (3, 6, 1) is 1(4 − 6) − 2(2 − 3) + 1(12 − 12) = −2 + 2 + 0 = 0. The area is 0, so the points are collinear.

</details>

7. (3) Find the minors and cofactors of all entries of the matrix with rows (2, −1) and (3, 4).

<details><summary>Answer</summary>

For a 2 × 2 matrix the minor of an entry is the diagonally opposite entry: M₁₁ = 4, M₁₂ = 3, M₂₁ = −1, M₂₂ = 2. Cofactors A = (−1)^(i+j) M: A₁₁ = 4, A₁₂ = −3, A₂₁ = 1, A₂₂ = 2.

</details>

8. (3) Find A⁻¹ for the matrix with rows (3, 1) and (5, 2).

<details><summary>Answer</summary>

|A| = 6 − 5 = 1, so the inverse exists. adj A has rows (2, −1) and (−5, 3). Dividing by 1, A⁻¹ has rows (2, −1) and (−5, 3). Check: row 1 of A with column 1 of A⁻¹ is 6 − 5 = 1.

</details>

9. (3) If A is a 3 × 3 matrix with |A| = −2, find |adj A| and |A⁻¹|.

<details><summary>Answer</summary>

|adj A| = |A|² = 4. |A⁻¹| = 1/|A| = −1/2.

</details>

10. (3) Solve by Cramer’s rule: 3x + y = 7 and x − 2y = −7.

<details><summary>Answer</summary>

D = 3(−2) − 1(1) = −7. Dx = 7(−2) − 1(−7) = −7. Dy = 3(−7) − 7(1) = −28. So x = −7/−7 = 1 and y = −28/−7 = 4. Check: 3 + 4 = 7 ✓; 1 − 8 = −7 ✓.

</details>

## 5-mark questions

11. Find the inverse of the matrix with rows (1, 2, 3), (0, 1, 4), (5, 6, 0) and use it to solve x + 2y + 3z = 1, y + 4z = 2, 5x + 6y = 3.

<details><summary>Answer</summary>

|A| = 1(0 − 24) − 2(0 − 20) + 3(0 − 5) = −24 + 40 − 15 = 1.

Cofactors: A₁₁ = −24, A₁₂ = 20, A₁₃ = −5; A₂₁ = 18, A₂₂ = −15, A₂₃ = 4; A₃₁ = 5, A₃₂ = −4, A₃₃ = 1.

adj A is the transpose: rows (−24, 18, 5), (20, −15, −4), (−5, 4, 1). Since |A| = 1, A⁻¹ = adj A.

X = A⁻¹B with B = (1, 2, 3): x = −24 + 36 + 15 = 27, y = 20 − 30 − 12 = −22, z = −5 + 8 + 3 = 6. Check in the second equation: y + 4z = −22 + 24 = 2 ✓.

</details>

12. Using Cramer’s rule solve x + y + z = 6, 2x + y − z = 2 and x − y + 2z = 7.

<details><summary>Answer</summary>

D has rows (1, 1, 1), (2, 1, −1), (1, −1, 2): D = 1(2 − 1) − 1(4 + 1) + 1(−2 − 1) = 1 − 5 − 3 = −7.

Dx (column 1 replaced by 6, 2, 7): 6(2 − 1) − 1(4 + 7) + 1(−2 − 7) = 6 − 11 − 9 = −14, so x = 2.

Dy (column 2 replaced): rows (1, 6, 1), (2, 2, −1), (1, 7, 2): 1(4 + 7) − 6(4 + 1) + 1(14 − 2) = 11 − 30 + 12 = −7, so y = 1.

Dz (column 3 replaced): rows (1, 1, 6), (2, 1, 2), (1, −1, 7): 1(7 + 2) − 1(14 − 2) + 6(−2 − 1) = 9 − 12 − 18 = −21, so z = 3.

Check in the first equation: 2 + 1 + 3 = 6 ✓.

</details>

## Case-based question

**Three shops, three prices.** A school cooperative sells notebooks (x rupees each), pens (y rupees) and geometry boxes (z rupees). On Monday, 2 notebooks, 1 pen and 1 geometry box cost 80 rupees. On Tuesday, 1 notebook, 3 pens and 2 geometry boxes cost 110. On Wednesday, 3 notebooks, 2 pens and 1 geometry box cost 110.

13. (a) Write the three equations as AX = B and say what A, X and B are. (b) Find |A|. (c) Is the solution unique? (d) Find the prices.

<details><summary>Answer</summary>

(a) A has rows (2, 1, 1), (1, 3, 2), (3, 2, 1); X = (x, y, z); B = (80, 110, 110).

(b) |A| = 2(3 − 4) − 1(1 − 6) + 1(2 − 9) = −2 + 5 − 7 = −4.

(c) |A| ≠ 0, so A⁻¹ exists and the solution is unique.

(d) Cramer: Dx, with rows (80, 1, 1), (110, 3, 2), (110, 2, 1), is 80(3 − 4) − 1(110 − 220) + 1(220 − 330) = −80 + 110 − 110 = −80, so x = −80/−4 = 20. Dy, with rows (2, 80, 1), (1, 110, 2), (3, 110, 1), is 2(110 − 220) − 80(1 − 6) + 1(110 − 330) = −220 + 400 − 220 = −40, so y = 10. Dz, with rows (2, 1, 80), (1, 3, 110), (3, 2, 110), is 2(330 − 220) − 1(110 − 330) + 80(2 − 9) = 220 + 220 − 560 = −120, so z = 30. Check Monday: 40 + 10 + 30 = 80 ✓. Notebooks cost ₹20, pens ₹10, geometry boxes ₹30.

</details>

## Assertion and reason

For each pair choose: (a) both true and R explains A, (b) both true but R does not explain A, (c) A true, R false, (d) A false, R true.

14. **Assertion (A):** The matrix with rows (2, 4) and (3, 6) has no inverse. **Reason (R):** Its determinant is 0.

<details><summary>Answer</summary>(a). |A| = 12 − 12 = 0, so the matrix is singular, and only non-singular matrices have inverses.</details>

15. **Assertion (A):** The determinant of the identity matrix of any order is 1. **Reason (R):** The determinant of a 3 × 3 matrix is always the sum of its diagonal entries.

<details><summary>Answer</summary>(c). A is true (for a 3 × 3 identity, 1(1·1 − 0) = 1). R is false: the determinant is not the sum of the diagonal (that is the trace).</details>

16. **Assertion (A):** If every entry of a 3 × 3 matrix is doubled, its determinant becomes 8 times as large. **Reason (R):** Doubling one row doubles the determinant, and all three rows are doubled.

<details><summary>Answer</summary>(a). Each of the three rows contributes a factor 2, so 2³ = 8, and R explains A.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="determinants" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- 2 × 2: `$ad - bc$`. 3 × 3: expand along a row or column with signs `$+ - + / - + - / + - +$`.
- Area of triangle: `$\tfrac12|\det|$` of rows `$(x, y, 1)$`. Collinear points: determinant 0.
- `$A^{-1} = \operatorname{adj}A / |A|$`; adj A is the transpose of the cofactor matrix; singular matrices have no inverse.
- `$|kA| = k^n|A|$` and `$|\operatorname{adj}A| = |A|^{n-1}$` for an `$n \times n$` matrix.
- `$AX = B$`: unique solution `$X = A^{-1}B$` if `$|A| \ne 0$`; Cramer: `$x = D_x/D$`.

</div>
