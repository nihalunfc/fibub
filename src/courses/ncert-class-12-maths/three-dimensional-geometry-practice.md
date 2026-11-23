---
title: 'Three Dimensional Geometry: practice questions'
seoTitle: 'Three Dimensional Geometry Class 12 questions with answers'
summary: 'Class 12 3D Geometry practice on direction cosines, lines, angles and shortest distance: 1 to 5 mark, case study and assertion-reason, with answers.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'The direction cosines of the y-axis are:'
    choices: ['0, 1, 0', '1, 0, 0', '0, 0, 1', '1, 1, 1']
    ans: 0
    why: 'The y-axis makes angles 90°, 0° and 90° with the axes; the cosines are 0, 1, 0.'
  - q: 'The lines with direction ratios (2, 3, −1) and (1, −1, −1) are:'
    choices: ['perpendicular', 'parallel', 'at 60°', 'the same']
    ans: 0
    why: '2 − 3 + 1 = 0.'
  - q: 'Parallel lines r = a₁ + λb and r = a₂ + μb are at a distance:'
    choices: ['|(a₂ − a₁) × b| / |b|', '|(a₂ − a₁) · b| / |b|', '|a₂ − a₁|', '0']
    ans: 0
    why: 'The cross product gives the area of the parallelogram; dividing by the base |b| gives the height.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 11 “Three Dimensional Geometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Questions follow the CBSE board pattern (1, 2, 3 and 5 mark, case-based and assertion-reason) as in the CBSE sample question papers; all numbers and stories are original and every answer was checked a second way (by minimising the distance between points on the two lines).'
---

Back to the chapter: [Three Dimensional Geometry](/learn/courses/ncert-class-12-maths/three-dimensional-geometry/).

## How to set out answers

Write what is given (points, direction ratios, `$\vec a$`, `$\vec b$`), name the formula, substitute, and simplify one line at a time. For lines, keep vector form and Cartesian form clearly apart. When a distance or angle comes out, check it makes sense (a distance is never negative; cos of an acute angle is positive).

## 1-mark questions

**Q1.** Write the direction cosines of the y-axis.

<details><summary>Answer</summary>

The y-axis makes angles `$90°, 0°, 90°$` with the axes, so the direction cosines are `$0, 1, 0$`.

</details>

**Q2.** Find the direction ratios of the line through `$(2, -1, 4)$` and `$(5, 3, 16)$`.

<details><summary>Answer</summary>

`$5 - 2,\ 3 + 1,\ 16 - 4 = 3, 4, 12$`.

</details>

**Q3.** Are the lines with direction ratios `$(2, 3, -1)$` and `$(1, -1, -1)$` perpendicular?

<details><summary>Answer</summary>

`$2\cdot1 + 3\cdot(-1) + (-1)(-1) = 2 - 3 + 1 = 0$`. Yes, they are perpendicular.

</details>

**Q4.** Write the vector equation of the line through the point with position vector `$2\hat i - \hat j + \hat k$`, parallel to `$3\hat i + \hat j$`.

<details><summary>Answer</summary>

`$\vec r = (2\hat i - \hat j + \hat k) + \lambda(3\hat i + \hat j)$`.

</details>

## 2-mark and 3-mark questions

**Q5.** Find the direction cosines of the line through `$(1, 2, -3)$` and `$(-2, 6, 9)$`.

<details><summary>Answer</summary>

Direction ratios: `$-3, 4, 12$`. `$\sqrt{9 + 16 + 144} = 13$`. Direction cosines: `$-\dfrac3{13}, \dfrac4{13}, \dfrac{12}{13}$` (or the negatives for the opposite direction).

</details>

**Q6.** Write `$\vec r = (2\hat i - \hat j + 3\hat k) + \lambda(\hat i + 2\hat j - 2\hat k)$` in Cartesian form.

<details><summary>Answer</summary>

The point is `$(2, -1, 3)$` and the direction ratios are `$1, 2, -2$`:

`$\dfrac{x - 2}{1} = \dfrac{y + 1}{2} = \dfrac{z - 3}{-2}$`.

</details>

**Q7.** Find the angle between the lines with direction ratios `$(1, 1, 0)$` and `$(0, 1, 1)$`.

<details><summary>Answer</summary>

`$\cos\theta = \dfrac{|0 + 1 + 0|}{\sqrt2\cdot\sqrt2} = \dfrac12$`, so `$\theta = 60°$`.

</details>

**Q8.** Find the equation of the line through `$(1, 2, 3)$` and `$(3, 2, -1)$` in Cartesian form.

<details><summary>Answer</summary>

Direction ratios: `$2, 0, -4$`, or `$1, 0, -2$`. The `$y$` ratio is 0, so `$y$` stays 2:

`$\dfrac{x - 1}{1} = \dfrac{z - 3}{-2},\quad y = 2$`.

</details>

**Q9.** Show that the lines `$\dfrac{x - 1}{2} = \dfrac{y - 2}{3} = \dfrac{z - 3}{4}$` and `$\dfrac{x - 4}{5} = \dfrac{y - 1}{2} = \dfrac{z}{1}$` intersect, and find the point.

<details><summary>Answer</summary>

A point of the first line: `$(1 + 2s,\ 2 + 3s,\ 3 + 4s)$`. A point of the second: `$(4 + 5t,\ 1 + 2t,\ t)$`.

Equate the `$z$` values: `$3 + 4s = t$`. Put this into the `$y$` equation: `$2 + 3s = 1 + 2(3 + 4s) = 7 + 8s$`, so `$s = -1$` and `$t = -1$`.

Check `$x$`: `$1 + 2(-1) = -1$` and `$4 + 5(-1) = -1$`. They agree, so the lines meet at `$(-1, -1, -1)$`.

</details>

## 5-mark questions

**Q10.** Find the shortest distance between `$\vec r = (\hat i + 2\hat j + \hat k) + \lambda(\hat i - \hat j + \hat k)$` and `$\vec r = (2\hat i - \hat j - \hat k) + \mu(2\hat i + \hat j + 2\hat k)$`.

<details><summary>Answer</summary>

`$\vec a_1 = (1, 2, 1)$`, `$\vec b_1 = (1, -1, 1)$`, `$\vec a_2 = (2, -1, -1)$`, `$\vec b_2 = (2, 1, 2)$`.

`$\vec b_1\times\vec b_2 = \hat i(-2 - 1) - \hat j(2 - 2) + \hat k(1 + 2) = (-3, 0, 3)$`, with magnitude `$3\sqrt2$`.

`$\vec a_2 - \vec a_1 = (1, -3, -2)$`, and `$(1, -3, -2)\cdot(-3, 0, 3) = -3 + 0 - 6 = -9$`.

`$d = \dfrac{|-9|}{3\sqrt2} = \dfrac{3}{\sqrt2} = \dfrac{3\sqrt2}{2} \approx 2.12$` units.

</details>

**Q11.** Find the distance between the parallel lines `$\vec r = (\hat i + 2\hat j - 4\hat k) + \lambda(2\hat i + 3\hat j + 6\hat k)$` and `$\vec r = (4\hat i + 2\hat j - 4\hat k) + \mu(2\hat i + 3\hat j + 6\hat k)$`.

<details><summary>Answer</summary>

The directions are the same, `$\vec b = (2, 3, 6)$`, `$|\vec b| = 7$`. `$\vec a_2 - \vec a_1 = (3, 0, 0)$`.

`$(3, 0, 0)\times(2, 3, 6) = \hat i(0 - 0) - \hat j(18 - 0) + \hat k(9 - 0) = (0, -18, 9)$`, with magnitude `$\sqrt{324 + 81} = 9\sqrt5$`.

`$d = \dfrac{9\sqrt5}{7} \approx 2.87$` units.

</details>

**Q12.** Show that the lines `$\vec r = (\hat i + \hat j - \hat k) + \lambda(3\hat i - \hat j)$` and `$\vec r = (4\hat i + \hat k) + \mu(2\hat i + 3\hat k)$` are skew, and find the shortest distance between them.

<details><summary>Answer</summary>

`$\vec b_1 = (3, -1, 0)$` and `$\vec b_2 = (2, 0, 3)$` are not proportional, so the lines are not parallel.

`$\vec b_1\times\vec b_2 = \hat i(-3 - 0) - \hat j(9 - 0) + \hat k(0 + 2) = (-3, -9, 2)$`, magnitude `$\sqrt{9 + 81 + 4} = \sqrt{94}$`.

`$\vec a_2 - \vec a_1 = (3, -1, 2)$` and its dot with `$(-3, -9, 2)$` is `$-9 + 9 + 4 = 4$`.

The distance is `$\dfrac{4}{\sqrt{94}} \approx 0.41 \neq 0$`, so the lines do not meet. They are skew, at a shortest distance `$\dfrac{4}{\sqrt{94}}$`.

</details>

## Case-based question

**Q13.** Two flight paths are modelled as straight lines (distances in km). Path 1 is `$\vec r = (0, 0, 5) + \lambda(1, 0, 0)$`: due east at a height of 5 km. Path 2 is `$\vec r = (0, 0, 7) + \mu(0, 1, 0)$`: due north at a height of 7 km.

(i) Write the direction ratios of each path. (ii) Find the angle between the paths. (iii) Find the shortest distance between them. (iv) Do the paths cross?

<details><summary>Answer</summary>

(i) Path 1: `$(1, 0, 0)$`; path 2: `$(0, 1, 0)$`.

(ii) `$\cos\theta = \dfrac{|0|}{1\cdot1} = 0$`, so `$\theta = 90°$`.

(iii) `$\vec b_1\times\vec b_2 = (0, 0, 1)$`, magnitude 1. `$\vec a_2 - \vec a_1 = (0, 0, 2)$`, dot product 2. So `$d = 2$` km: the planes fly 2 km apart vertically where they pass.

(iv) The distance is not zero and the directions are not parallel, so the lines are skew: the paths never meet, which is why the planes are safe.

</details>

## Assertion and reason

**Q14.** **Assertion (A):** A line has exactly one set of direction cosines. **Reason (R):** If `$(l, m, n)$` are direction cosines of a line then so are `$(-l, -m, -n)$`. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

<details><summary>Answer</summary>

(d). A is false: a line has two sets of direction cosines, one for each way along it. R is true (it is exactly why A fails).

</details>

**Q15.** **Assertion (A):** The shortest-distance formula for skew lines cannot be used for parallel lines. **Reason (R):** For parallel lines `$\vec b_1\times\vec b_2 = \vec 0$`, so the formula gives `$\dfrac00$`. Choose (a) to (d) as above.

<details><summary>Answer</summary>

(a). Both are true and R explains A: for parallel lines use `$\dfrac{|(\vec a_2 - \vec a_1)\times\vec b|}{|\vec b|}$` instead.

</details>

## Live problems

<div class="problem" data-problem="c12m-3d-skew"></div>

<div class="problem" data-problem="c12m-3d-angle"></div>

<div class="problem" data-problem="c12m-3d-dc"></div>

## More questions

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="three-dimensional-geometry" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Direction cosines: `$l^2 + m^2 + n^2 = 1$`; ratios `$a, b, c$` give `$l = a/\sqrt{a^2+b^2+c^2}$`. Line through two points: ratios = end − start.
- Line: `$\vec r = \vec a + \lambda\vec b$`; Cartesian `$\frac{x-x_1}{p} = \frac{y-y_1}{q} = \frac{z-z_1}{r}$`.
- Angle between lines: `$\cos\theta = \frac{|a_1a_2 + b_1b_2 + c_1c_2|}{|\vec b_1||\vec b_2|}$`; perpendicular if the numerator is 0; parallel if the ratios are proportional.
- Skew lines: `$d = \frac{|(\vec a_2 - \vec a_1)\cdot(\vec b_1\times\vec b_2)|}{|\vec b_1\times\vec b_2|}$`; parallel lines: `$d = \frac{|(\vec a_2 - \vec a_1)\times\vec b|}{|\vec b|}$`; zero distance means the lines meet.

</div>
