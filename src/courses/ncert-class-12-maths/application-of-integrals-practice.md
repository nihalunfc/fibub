---
title: 'Application of Integrals: practice questions'
seoTitle: 'Application of Integrals Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Application of Integrals: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full answers.'
minutes: 70
updated: 2026-11-22
quiz:
  - q: 'The area enclosed by the line y = 2x and the parabola y = x² is:'
    choices: ['2/3', '4/3', '8/3', '4']
    ans: 1
    why: 'They meet at x = 0 and x = 2. A = ∫₀² (2x − x²) dx = [x² − x³/3]₀² = 4 − 8/3 = 4/3.'
  - q: 'The area of the ellipse x²/25 + y²/9 = 1 is:'
    choices: ['15π', '34π', '8π', '25π']
    ans: 0
    why: 'a = 5 and b = 3, so the area is πab = 15π.'
  - q: 'To find the area between a curve and the x-axis where the curve crosses the axis, you should:'
    choices: ['integrate once over the whole range', 'split at the crossing and add the absolute values', 'double the integral', 'take the integral and square it']
    ans: 1
    why: 'The integral subtracts regions below the axis. True area is always positive, so each piece is taken as positive.'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 8.** Read the chapter lesson, [Application of Integrals](/learn/courses/ncert-class-12-maths/application-of-integrals/), first. Try each question on paper before opening the answer. Marks go for the sketch, the limits, the strip and integral, and the final answer with units.

<div class="bigidea">Every area question is the same five moves: sketch, find the intersection points, draw one strip (top minus bottom, or right minus left), integrate, and check the answer is positive and about the right size.</div>

## How to set out an area

1. Draw a neat sketch and shade the region. Mark the intersection points.
2. Write the element of area: `$dA = (\text{top} - \text{bottom})\,dx$` or `$(\text{right} - \text{left})\,dy$`.
3. Write the integral with its limits, integrate, substitute.
4. Answer in "square units" and check it against the sketch.

<div class="problem" data-problem="c12m-aoi-between"></div>

<div class="problem" data-problem="c12m-aoi-ellipse"></div>

## 1-mark questions

1. Write the formula for the area under `$y = f(x)$`, above the x-axis, from `$x = a$` to `$x = b$`.

<details><summary>Answer</summary>`$A = \int_a^b f(x)\,dx$`, in square units.</details>

2. Find the area of the circle `$x^2 + y^2 = 16$`.

<details><summary>Answer</summary>`$\pi r^2 = 16\pi$` square units (radius 4).</details>

3. Find the area under `$y = 4$` between `$x = 1$` and `$x = 5$`.

<details><summary>Answer</summary>`$\int_1^5 4\,dx = 16$` (a rectangle 4 by 4).</details>

4. The area under `$y = x^3$` from 0 to 1 is?

<details><summary>Answer</summary>`$[x^4/4]_0^1 = \tfrac14$`.</details>

## 2-mark and 3-mark questions

5. Find the area bounded by `$y = x^2$`, the x-axis and the line `$x = 3$`.

<details><summary>Answer</summary>

The curve starts at the origin, so the limits are 0 and 3: `$\int_0^3 x^2\,dx = \left[\tfrac{x^3}{3}\right]_0^3 = 9$` square units.

</details>

6. Find the area of the region enclosed by `$y = x$` and `$y = x^2$`.

<details><summary>Answer</summary>

They meet where `$x = x^2$`: `$x = 0$` and `$x = 1$`. On `$[0, 1]$` the line is above the parabola.

`$A = \int_0^1 (x - x^2)\,dx = \tfrac12 - \tfrac13 = \tfrac16$` square units.

</details>

7. Find the area under `$y = \sin x$` from `$x = 0$` to `$x = \pi$`.

<details><summary>Answer</summary>

`$\int_0^\pi \sin x\,dx = [-\cos x]_0^\pi = 1 + 1 = 2$` square units.

</details>

8. Find the area bounded by the curve `$y = \sqrt x$`, the y-axis and the line `$y = 2$`, using horizontal strips.

<details><summary>Answer</summary>

From `$y = \sqrt x$` we get `$x = y^2$`. A horizontal strip has length `$y^2$` and thickness `$dy$`, for `$y$` from 0 to 2.

`$A = \int_0^2 y^2\,dy = \tfrac83$` square units.

</details>

9. Find the area between the curve `$y = x^2 - 4$` and the x-axis.

<details><summary>Answer</summary>

The curve meets the axis at `$x = \pm 2$` and lies below it between them. `$\int_{-2}^{2}(x^2 - 4)dx = 2\left[\tfrac{x^3}{3} - 4x\right]_0^2 = 2\left(\tfrac83 - 8\right) = -\tfrac{32}{3}$`.

Area is positive: `$\tfrac{32}{3}$` square units.

</details>

10. A speed-time graph is `$v = 2t$` m/s for `$0 \le t \le 6$`. Find the distance travelled using area.

<details><summary>Answer</summary>

The area under a straight line from the origin is a triangle: `$\tfrac12 \times 6 \times 12 = 36$` m. (Or `$\int_0^6 2t\,dt = 36$`.)

</details>

## 5-mark questions

11. Find the area of the region bounded by the parabola `$y^2 = 4x$` and the line `$y = x$`.

<details><summary>Answer</summary>

Sketch: the parabola opens right and the line cuts it at `$(0,0)$` and `$(4, 4)$` (from `$y^2 = 4y$`).

Using horizontal strips: left edge `$x = y^2/4$`, right edge `$x = y$`, strip length `$y - y^2/4$`, `$y$` from 0 to 4.

`$A = \int_0^4 \left(y - \tfrac{y^2}{4}\right)dy = \left[\tfrac{y^2}{2} - \tfrac{y^3}{12}\right]_0^4 = 8 - \tfrac{16}{3} = \tfrac83$` square units.

</details>

12. Find the area enclosed by the ellipse `$\dfrac{x^2}{9} + \dfrac{y^2}{4} = 1$`.

<details><summary>Answer</summary>

Here `$a = 3$` and `$b = 2$`. In the first quadrant `$y = \tfrac23\sqrt{9 - x^2}$`.

`$A = 4\int_0^3 \tfrac23\sqrt{9 - x^2}\,dx = \tfrac83\left[\tfrac x2\sqrt{9 - x^2} + \tfrac92\sin^{-1}\tfrac x3\right]_0^3 = \tfrac83\cdot\tfrac92\cdot\tfrac\pi2 = 6\pi$`.

This agrees with the formula `$\pi ab = 6\pi$` square units.

</details>

13. Find the area of the region in the first quadrant bounded by the parabola `$y = 4 - x^2$`, the line `$y = 3x$` and the y-axis.

<details><summary>Answer</summary>

Where they meet: `$4 - x^2 = 3x$`, so `$x^2 + 3x - 4 = 0$` and `$x = 1$` or `$-4$`. In the first quadrant, `$x = 1$`, `$y = 3$`.

For `$0 \le x \le 1$` the parabola is on top, so `$A = \int_0^1 (4 - x^2 - 3x)\,dx = 4 - \tfrac13 - \tfrac32 = \tfrac{13}{6}$` square units.

</details>

14. Find the total area between `$y = x^3 - x$` and the x-axis from `$x = -1$` to `$x = 1$`.

<details><summary>Answer</summary>

The curve crosses the axis at `$x = -1, 0, 1$`. On `$[-1, 0]$`, `$x^3 - x \ge 0$` (above); on `$[0, 1]$` it is below.

`$\int_{-1}^0 (x^3 - x)dx = \left[\tfrac{x^4}{4} - \tfrac{x^2}{2}\right]_{-1}^{0} = 0 - \left(\tfrac14 - \tfrac12\right) = \tfrac14$`.

`$\int_0^1 (x^3 - x)dx = \tfrac14 - \tfrac12 = -\tfrac14$`.

The total area is `$\tfrac14 + \left|-\tfrac14\right| = \tfrac12$` square units. (The plain integral from −1 to 1 would give 0.)

</details>

## Case-based question

**A river bend.** A village map treats a straight canal as the x-axis (1 unit = 100 m). A pond on the map is the region between the x-axis and the curve `$y = 4x - x^2$`, where `$0 \le x \le 4$`.

(a) Find where the curve meets the canal.

(b) Find the area of the pond in square units, and in square metres.

(c) A fish farm covers the part of the pond from `$x = 0$` to `$x = 2$`. What fraction of the pond is it?

(d) Why must the curve's equation be sketched before integrating?

<details><summary>Answer</summary>

(a) `$4x - x^2 = x(4 - x) = 0$` gives `$x = 0$` and `$x = 4$`.

(b) `$A = \int_0^4 (4x - x^2)dx = \left[2x^2 - \tfrac{x^3}{3}\right]_0^4 = 32 - \tfrac{64}{3} = \tfrac{32}{3}$` square units. One square unit is 100 m × 100 m = 10 000 m², so the pond is about `$\tfrac{32}{3} \times 10\,000 \approx 106\,667$` m².

(c) `$\int_0^2 (4x - x^2)dx = 8 - \tfrac83 = \tfrac{16}{3}$`, which is exactly half of `$\tfrac{32}{3}$` (the curve is symmetric about `$x = 2$`).

(d) The sketch shows that the curve stays above the axis between 0 and 4, so no splitting or absolute values are needed, and the limits come from where it meets the canal.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **Assertion (A):** The area enclosed by the curve `$y = \sin x$` and the x-axis from 0 to `$2\pi$` is 0. **Reason (R):** `$\int_0^{2\pi}\sin x\,dx = 0$`.

<details><summary>Answer</summary>(D). R is true, but the area is 4, not 0: the integral subtracts the part below the axis, while area counts it as positive.</details>

16. **Assertion (A):** The area of the ellipse `$x^2/a^2 + y^2/b^2 = 1$` is `$\pi ab$`. **Reason (R):** When `$b = a$` the formula gives the area `$\pi a^2$` of a circle.

<details><summary>Answer</summary>(B). Both are true. R is a check on the formula, but does not explain why the area is πab (that comes from 4∫(b/a)√(a²−x²)dx).</details>

17. **Assertion (A):** The area between `$y = f(x)$` and `$y = g(x)$` is `$\int_a^b [f(x) - g(x)]dx$` whenever `$f \ge g$` on `$[a,b]$`. **Reason (R):** A thin vertical strip has height equal to the difference of the two y-values.

<details><summary>Answer</summary>(A). The strip's height is top minus bottom, and adding strips gives the integral.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="application-of-integrals" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Sketch first, then intersection points, then one strip (top − bottom, or right − left), then integrate, then check sign and size.
- Under a curve: ∫ y dx. Beside it (y-axis): ∫ x dy. Between two curves: ∫ (top − bottom) dx.
- Circle πa², ellipse πab, parabola y² = 4ax cut by x = h: (8/3)√a h^(3/2).
- The integral is signed: split where the curve crosses the x-axis and add absolute values.
- Speed-time graph: area under it is the distance. Always give "square units" (or the real unit).

</div>
