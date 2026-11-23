---
title: 'Vector Algebra: practice questions'
seoTitle: 'Vector Algebra Class 12 questions with answers'
summary: 'Class 12 Vector Algebra practice: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions, all with full answers, plus live problems.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'The unit vector along 2i − 3j + 6k is:'
    choices: ['(2i − 3j + 6k)/7', '(2i − 3j + 6k)/5', '(2i − 3j + 6k)/11', '2i − 3j + 6k']
    ans: 0
    why: '|a| = √(4 + 9 + 36) = 7.'
  - q: 'The scalar a·b for a = i + j and b = j + k is:'
    choices: ['1', '0', '2', '3']
    ans: 0
    why: 'Only the j parts multiply: 1 × 1 = 1.'
  - q: '|a × b| equals:'
    choices: ['|a||b| sin θ', '|a||b| cos θ', '|a| + |b|', '|a||b|']
    ans: 0
    why: 'The magnitude of the cross product is |a||b| sin θ, the area of the parallelogram.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 10 “Vector Algebra” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Questions follow the CBSE board pattern (1, 2, 3 and 5 mark, case-based and assertion-reason) as in the CBSE sample question papers; all numbers and stories are original and every answer was checked a second way.'
---

Back to the chapter: [Vector Algebra](/learn/courses/ncert-class-12-maths/vector-algebra/).

## How to set out answers

Write the formula first, then put in the numbers, then the answer with its unit if it has one. For vectors: say what each vector is (a = ..., b = ...), show the dot or cross product line by line, and finish with a check (for example, a cross product must give 0 when dotted with a and with b). A board marker gives marks for the formula, the working and the final answer separately.

## 1-mark questions

**Q1.** Find the unit vector along `$2\hat i - 3\hat j + 6\hat k$`.

<details><summary>Answer</summary>

`$|\vec a| = \sqrt{4 + 9 + 36} = 7$`, so the unit vector is `$\dfrac{2\hat i - 3\hat j + 6\hat k}{7}$`.

</details>

**Q2.** If `$|\vec a| = 2$`, `$|\vec b| = 3$` and `$\vec a\cdot\vec b = 3$`, find the angle between the vectors.

<details><summary>Answer</summary>

`$\cos\theta = \dfrac{3}{2\times3} = \dfrac12$`, so `$\theta = 60°$`.

</details>

**Q3.** Find the vector joining `$P(1, 2, 3)$` to `$Q(4, 0, -1)$`.

<details><summary>Answer</summary>

`$\overrightarrow{PQ} = (4-1)\hat i + (0-2)\hat j + (-1-3)\hat k = 3\hat i - 2\hat j - 4\hat k$` (head minus tail).

</details>

**Q4.** Find `$\hat i\times(\hat j + \hat k)$`.

<details><summary>Answer</summary>

`$\hat i\times\hat j + \hat i\times\hat k = \hat k - \hat j$`.

</details>

## 2-mark and 3-mark questions

**Q5.** Show that `$\vec a = \hat i + 2\hat j + 3\hat k$` and `$\vec b = 3\hat i - \hat k$` are perpendicular.

<details><summary>Answer</summary>

`$\vec a\cdot\vec b = 1\cdot3 + 2\cdot0 + 3\cdot(-1) = 0$`. The dot product is zero and neither vector is zero, so they are perpendicular.

</details>

**Q6.** Find the projection of `$\vec a = 2\hat i + 3\hat j + 2\hat k$` on `$\vec b = \hat i + 2\hat j + \hat k$`.

<details><summary>Answer</summary>

`$\vec a\cdot\vec b = 2 + 6 + 2 = 10$` and `$|\vec b| = \sqrt6$`. The projection is `$\dfrac{10}{\sqrt6} = \dfrac{5\sqrt6}{3}$`.

</details>

**Q7.** Find the area of the parallelogram with adjacent sides `$\vec a = \hat i - \hat j + 3\hat k$` and `$\vec b = 2\hat i - 7\hat j + \hat k$`.

<details><summary>Answer</summary>

Compute the determinant: `$\hat i[(-1)(1) - (3)(-7)] - \hat j[(1)(1) - (3)(2)] + \hat k[(1)(-7) - (-1)(2)] = 20\hat i + 5\hat j - 5\hat k$`.

The area is `$|\vec a\times\vec b| = \sqrt{400 + 25 + 25} = \sqrt{450} = 15\sqrt2$` square units.

</details>

**Q8.** Find the point that divides the line from `$A(1, -2, 3)$` to `$B(4, 1, -3)$` internally in the ratio `$2 : 1$`.

<details><summary>Answer</summary>

`$\vec p = \dfrac{1\cdot\vec a + 2\cdot\vec b}{3} = \dfrac{(1, -2, 3) + (8, 2, -6)}{3} = \dfrac{(9, 0, -3)}{3} = (3, 0, -1)$`.

</details>

**Q9.** A force `$\vec F = 3\hat i + 2\hat j - \hat k$` newtons moves a particle from `$A(1, 1, 1)$` to `$B(3, 0, 2)$` (metres). Find the work done.

<details><summary>Answer</summary>

Displacement `$\vec d = \overrightarrow{AB} = 2\hat i - \hat j + \hat k$`. Work `$= \vec F\cdot\vec d = 6 - 2 - 1 = 3$` joules.

</details>

## 5-mark questions

**Q10.** Find a unit vector perpendicular to both `$\vec a = \hat i + \hat j + \hat k$` and `$\vec b = 2\hat i - \hat j + 3\hat k$`. Hence find the area of the triangle with these as two sides.

<details><summary>Answer</summary>

```math
\vec a\times\vec b = \begin{vmatrix}\hat i & \hat j & \hat k\\ 1 & 1 & 1\\ 2 & -1 & 3\end{vmatrix} = \hat i(3 + 1) - \hat j(3 - 2) + \hat k(-1 - 2) = 4\hat i - \hat j - 3\hat k
```

Its magnitude is `$\sqrt{16 + 1 + 9} = \sqrt{26}$`. A unit vector perpendicular to both is `$\pm\dfrac{4\hat i - \hat j - 3\hat k}{\sqrt{26}}$`.

Check: `$(4, -1, -3)\cdot(1, 1, 1) = 0$` and `$(4, -1, -3)\cdot(2, -1, 3) = 8 + 1 - 9 = 0$`.

Area of the triangle `$= \tfrac12|\vec a\times\vec b| = \dfrac{\sqrt{26}}{2}$` square units.

</details>

**Q11.** Three vectors satisfy `$\vec a + \vec b + \vec c = \vec 0$` with `$|\vec a| = 3$`, `$|\vec b| = 5$` and `$|\vec c| = 7$`. Find the angle between `$\vec a$` and `$\vec b$`.

<details><summary>Answer</summary>

From `$\vec a + \vec b = -\vec c$`, square both sides: `$|\vec a|^2 + |\vec b|^2 + 2\vec a\cdot\vec b = |\vec c|^2$`.

`$9 + 25 + 2\vec a\cdot\vec b = 49$`, so `$\vec a\cdot\vec b = \dfrac{15}{2}$`.

`$\cos\theta = \dfrac{15/2}{3\times5} = \dfrac12$`, so `$\theta = 60°$`.

</details>

**Q12.** Prove that the position vector of the point P dividing the line from A to B internally in the ratio `$m : n$` is `$\dfrac{n\vec a + m\vec b}{m + n}$`.

<details><summary>Answer</summary>

Since `$AP : PB = m : n$` and P lies between A and B, `$n\,\overrightarrow{AP} = m\,\overrightarrow{PB}$` (same direction).

Write each as head minus tail: `$n(\vec p - \vec a) = m(\vec b - \vec p)$`.

Expand: `$n\vec p - n\vec a = m\vec b - m\vec p$`, so `$(m + n)\vec p = n\vec a + m\vec b$`.

Divide by `$m + n$`: `$\vec p = \dfrac{n\vec a + m\vec b}{m + n}$`. For `$m = n$` this is the mid-point `$\dfrac{\vec a + \vec b}{2}$`.

</details>

## Case-based question

**Q13.** A delivery drone starts at the base O (the origin, in kilometres) and flies in a straight line to a customer at `$A(3, 4, 12)$`.

(i) Find the distance OA. (ii) Write the unit vector along the flight. (iii) Find the direction cosines of the path. (iv) Find the point on the path that is one-third of the way from O to A.

<details><summary>Answer</summary>

(i) `$|\overrightarrow{OA}| = \sqrt{9 + 16 + 144} = 13$` km.

(ii) `$\hat u = \dfrac{3\hat i + 4\hat j + 12\hat k}{13}$`.

(iii) The direction cosines are the components of the unit vector: `$\dfrac3{13}, \dfrac4{13}, \dfrac{12}{13}$` (their squares add to 1).

(iv) One-third of the way is `$\dfrac13\overrightarrow{OA} = \left(1, \dfrac43, 4\right)$` (the section formula with the ratio `$1 : 2$`).

</details>

## Assertion and reason

**Q14.** **Assertion (A):** `$|\vec a + \vec b| = |\vec a| + |\vec b|$` only when `$\vec a$` and `$\vec b$` point in the same direction. **Reason (R):** one side of a triangle equals the sum of the other two only when the triangle is flat. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

<details><summary>Answer</summary>

(a). A is true: equality in the triangle inequality needs the vectors along the same line and the same way. R is the reason: a “degenerate” triangle with all three points on a line.

</details>

**Q15.** **Assertion (A):** `$\vec a\times\vec b = \vec b\times\vec a$`. **Reason (R):** `$|\vec a||\vec b|\sin\theta$` is the same whichever vector comes first. Choose (a) to (d) as above.

<details><summary>Answer</summary>

(d). A is false because `$\vec b\times\vec a = -\,\vec a\times\vec b$` (the direction flips by the right-hand rule). R is true, since the magnitude `$|\vec a||\vec b|\sin\theta$` does not depend on the order.

</details>

## Live problems

<div class="problem" data-problem="c12m-vec-dot"></div>

<div class="problem" data-problem="c12m-vec-cross"></div>

<div class="problem" data-problem="c12m-vec-proj"></div>

## More questions

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="vector-algebra" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Unit vector `$\hat a = \vec a/|\vec a|$`; `$\overrightarrow{PQ}$` = head minus tail; section formula `$\dfrac{n\vec a + m\vec b}{m+n}$`.
- Dot product is a number: `$a_1b_1 + a_2b_2 + a_3b_3 = |\vec a||\vec b|\cos\theta$`; zero means perpendicular; projection `$\dfrac{\vec a\cdot\vec b}{|\vec b|}$`; work `$= \vec F\cdot\vec d$`.
- Cross product is a vector (determinant); magnitude `$|\vec a||\vec b|\sin\theta$` = parallelogram area; triangle area is half; `$\vec b\times\vec a = -\vec a\times\vec b$`.
- Square `$\vec a + \vec b + \vec c = \vec 0$`-type relations to find angles; always check a cross product by dotting it with both vectors.

</div>
