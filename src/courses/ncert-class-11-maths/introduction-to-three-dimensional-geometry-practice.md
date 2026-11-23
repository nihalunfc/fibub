---
title: 'Introduction to Three-dimensional Geometry: practice questions'
seoTitle: '3D Geometry Class 11 questions with answers'
summary: 'Practice for Class 11 Three-dimensional Geometry: octants, distance, section formula and centroid, with 1 to 5 mark, case-based and assertion-reason questions.'
minutes: 50
updated: 2026-11-23
quiz:
  - q: 'The distance of (2, −3, 6) from the origin is:'
    choices: ['7', '11', '√11', '5']
    ans: 0
    why: '√(4 + 9 + 36) = √49 = 7.'
  - q: 'The image of (4, −1, 3) in the YZ-plane is:'
    choices: ['(−4, −1, 3)', '(4, 1, 3)', '(4, −1, −3)', '(−4, 1, −3)']
    ans: 0
    why: 'The YZ-plane is x = 0, so only the x-coordinate changes sign.'
  - q: 'The midpoint of (0, 4, −6) and (6, −2, 2) is:'
    choices: ['(3, 1, −2)', '(6, 2, −4)', '(3, 3, −2)', '(−3, 1, 2)']
    ans: 0
    why: 'Average each coordinate: (0 + 6)/2, (4 − 2)/2, (−6 + 2)/2.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 11.** Read the lesson, [Introduction to Three-dimensional Geometry](/learn/courses/ncert-class-11-maths/introduction-to-three-dimensional-geometry/), first. Try each question on paper before you open the answer.

<div class="bigidea">Write the coordinates of each point in a column, subtract carefully, square, add, then take the root. For section problems write the ratio as m : n and say which point is first and which is second before you substitute.</div>

## How to set out answers

1. Write the points as A(x₁, y₁, z₁) and B(x₂, y₂, z₂) before substituting.
2. For distance, write the three differences, then their squares, then the sum.
3. For the section formula, state the ratio and whether it is internal or external.
4. Check by a rough sketch: does the answer lie between the two points when the division is internal?

## 1-mark questions

1. State the coordinates of any two points on the z-axis.
<details><summary>Answer</summary>

`$(0, 0, 3)$` and `$(0, 0, -5)$`. Any point with `$x = 0$` and `$y = 0$`.

</details>

2. In which octant is `$(2, -1, 4)$`?
<details><summary>Answer</summary>

Signs `$(+, -, +)$`: octant IV.

</details>

3. What is the equation of the XY-plane?
<details><summary>Answer</summary>

`$z = 0$`.

</details>

4. Find the distance of `$(3, -4, 12)$` from the origin.
<details><summary>Answer</summary>

`$\sqrt{9 + 16 + 144} = 13$`.

</details>

5. Find the distance of `$(3, 4, 5)$` from the YZ-plane.
<details><summary>Answer</summary>3 (the absolute value of the x-coordinate).</details>

<div class="problem" data-problem="c11m-3d-octant"></div>

## 2-mark and 3-mark questions

6. Find the distance between `$(2, -1, 3)$` and `$(-4, 5, 6)$`. *(2 marks)*
<details><summary>Answer</summary>

Differences: `$-6, 6, 3$`. Distance `$= \sqrt{36 + 36 + 9} = \sqrt{81} = 9$`.

</details>

7. Find the midpoint of the segment joining `$(4, -2, 8)$` and `$(-6, 4, 2)$`. *(2 marks)*
<details><summary>Answer</summary>

`$\left(\dfrac{4 - 6}{2}, \dfrac{-2 + 4}{2}, \dfrac{8 + 2}{2}\right) = (-1, 1, 5)$`.

</details>

8. Find the image of `$(5, -3, 2)$` in the ZX-plane and its distance from the point. *(2 marks)*
<details><summary>Answer</summary>

The ZX-plane is `$y = 0$`, so the image is `$(5, 3, 2)$`. The distance between them is `$2|y| = 6$`.

</details>

9. Find the point that divides the join of `$A(1, -2, 4)$` and `$B(7, 4, -2)$` internally in the ratio `$2 : 1$`. *(3 marks)*
<details><summary>Answer</summary>

`$x = \dfrac{2 \cdot 7 + 1 \cdot 1}{3} = 5$`, `$y = \dfrac{2 \cdot 4 + 1 \cdot (-2)}{3} = 2$`, `$z = \dfrac{2 \cdot (-2) + 1 \cdot 4}{3} = 0$`. The point is `$(5, 2, 0)$`.

</details>

10. Show that `$A(0, 7, -10)$`, `$B(1, 6, -6)$` and `$C(4, 9, -6)$` form an isosceles triangle. *(3 marks)*
<details><summary>Answer</summary>

`$AB = \sqrt{1 + 1 + 16} = \sqrt{18}$`, `$BC = \sqrt{9 + 9 + 0} = \sqrt{18}$`, `$AC = \sqrt{16 + 4 + 16} = 6$`.

`$AB = BC$`, so the triangle is isosceles. (Also `$AB^2 + BC^2 = 36 = AC^2$`, so it is right-angled at B.)

</details>

<div class="problem" data-problem="c11m-3d-dist"></div>

11. Find the centroid of the triangle with vertices `$(2, 3, -1)$`, `$(4, -5, 7)$` and `$(0, 8, 3)$`. *(3 marks)*
<details><summary>Answer</summary>

`$\left(\dfrac{2 + 4 + 0}{3}, \dfrac{3 - 5 + 8}{3}, \dfrac{-1 + 7 + 3}{3}\right) = (2, 2, 3)$`.

</details>

12. Find the distance of `$(1, 2, 3)$` from each of the three axes. *(3 marks)*
<details><summary>Answer</summary>

From the x-axis: `$\sqrt{2^2 + 3^2} = \sqrt{13}$`. From the y-axis: `$\sqrt{1^2 + 3^2} = \sqrt{10}$`. From the z-axis: `$\sqrt{1^2 + 2^2} = \sqrt5$`.

</details>

## 5-mark questions

13. Prove that the distance between `$A(x_1, y_1, z_1)$` and `$B(x_2, y_2, z_2)$` is `$\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$`. *(5 marks)*
<details><summary>Answer</summary>

Draw through `$A$` and `$B$` planes parallel to the coordinate planes to make a box with `$AB$` as a diagonal. Its edges are `$p = |x_2 - x_1|$`, `$q = |y_2 - y_1|$` and `$r = |z_2 - z_1|$`.

Let `$C$` be the vertex of the box on the same level as `$A$` and directly below `$B$`. In the right-angled triangle on the floor, `$AC^2 = p^2 + q^2$`.

Triangle `$ACB$` has a right angle at `$C$`, since `$BC$` is vertical, of length `$r$`, and `$AC$` is horizontal. So `$AB^2 = AC^2 + BC^2 = p^2 + q^2 + r^2$`.

Taking the square root gives the formula.

</details>

14. Derive the coordinates of the point `$P$` dividing the segment joining `$A(x_1, y_1, z_1)$` and `$B(x_2, y_2, z_2)$` internally in the ratio `$m : n$`. *(5 marks)*
<details><summary>Answer</summary>

Draw perpendiculars `$AA'$`, `$PP'$`, `$BB'$` from `$A$`, `$P$`, `$B$` to the XY-plane and then from `$A'$`, `$P'$`, `$B'$` to the x-axis, meeting it at `$L$`, `$M$` and `$N$` with x-coordinates `$x_1$`, `$x$` and `$x_2$`.

The parallel lines `$AL$`, `$PM$`, `$BN$` cut the transversals `$AB$` and `$LN$` in the same ratio, so `$LM : MN = AP : PB = m : n$`.

That is `$(x - x_1) : (x_2 - x) = m : n$`, so `$n(x - x_1) = m(x_2 - x)$` and `$x = \dfrac{mx_2 + nx_1}{m + n}$`.

The same argument with the y- and z-axes gives `$y = \dfrac{my_2 + ny_1}{m + n}$` and `$z = \dfrac{mz_2 + nz_1}{m + n}$`.

</details>

15. The points `$A(3, 2, -4)$`, `$B(9, 8, -10)$` and `$C(5, 4, -6)$` are given. Show that they are collinear and find the ratio in which `$C$` divides `$AB$`. *(5 marks)*
<details><summary>Answer</summary>

`$AB = \sqrt{36 + 36 + 36} = 6\sqrt3$`, `$AC = \sqrt{4 + 4 + 4} = 2\sqrt3$`, `$CB = \sqrt{16 + 16 + 16} = 4\sqrt3$`.

`$AC + CB = 6\sqrt3 = AB$`, so `$A$`, `$C$`, `$B$` are collinear and `$C$` lies between `$A$` and `$B$`.

`$AC : CB = 2\sqrt3 : 4\sqrt3 = 1 : 2$`: `$C$` divides `$AB$` internally in the ratio `$1 : 2$`. Check with the formula: `$x = \dfrac{1 \cdot 9 + 2 \cdot 3}{3} = 5$` ✓.

</details>

<div class="problem" data-problem="c11m-3d-section"></div>

## Case-based question

A drone starts at the base station `$O(0, 0, 0)$` and flies to a tower top `$T(30, 40, 120)$` (metres: x east, y north, z up). A second drone hovers at `$D(60, 80, 0)$` directly over a field.

(a) How far is the tower top from the base station?
<details><summary>Answer</summary>

`$\sqrt{900 + 1600 + 14400} = \sqrt{16900} = 130$` m.

</details>

(b) How far is the second drone from the base station, and what is its distance from the tower top?
<details><summary>Answer</summary>

`$OD = \sqrt{3600 + 6400} = 100$` m. `$DT = \sqrt{900 + 1600 + 14400} = 130$` m.

</details>

(c) A package is dropped at the point dividing `$OT$` in the ratio `$1 : 2$`. Find its coordinates.
<details><summary>Answer</summary>

`$\left(\dfrac{1 \cdot 30}{3}, \dfrac{1 \cdot 40}{3}, \dfrac{1 \cdot 120}{3}\right) = (10, 40/3, 40)$`, using `$O$` as the first point (weight `$n = 2$` with 0 coordinates) and `$T$` as the second (weight `$m = 1$`).

</details>

(d) What is the height of the second drone above the XY-plane?
<details><summary>Answer</summary>Its z-coordinate is 0, so it is on the XY-plane (the ground).</details>

## Assertion and reason

Options: (A) Both A and R are true and R explains A. (B) Both true but R does not explain A. (C) A is true, R is false. (D) A is false, R is true.

16. **Assertion:** The point `$(3, 0, -2)$` lies in no octant. **Reason:** A point with a zero coordinate lies on a coordinate plane.
<details><summary>Answer</summary>(A). The y-coordinate is 0, so the point is on the ZX-plane, which is a boundary of octants, not inside one.</details>

17. **Assertion:** The distance of `$(3, 4, 5)$` from the x-axis is 5. **Reason:** The distance of `$(x, y, z)$` from the x-axis is `$\sqrt{y^2 + z^2}$`.
<details><summary>Answer</summary>

(D). The reason is true, but it gives `$\sqrt{16 + 25} = \sqrt{41}$`, not 5 (5 is the distance from the z-axis). So A is false.

</details>

18. **Assertion:** A point can divide a segment externally in the ratio `$3 : 3$`. **Reason:** The external section formula has `$m - n$` in the denominator.
<details><summary>Answer</summary>

(D). With `$m = n$` the denominator is 0, so no such point exists: A is false. R is true.

</details>

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="introduction-to-three-dimensional-geometry" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Coordinate planes: `$z = 0$`, `$x = 0$`, `$y = 0$`; a zero coordinate puts a point on a plane, not in an octant.
- Distance from a plane is the absolute value of its coordinate; the mirror image flips one sign.
- `$AB^2 = (x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2$`; collinear means the largest distance is the sum of the other two.
- Section formula: second point with `$m$`, first point with `$n$`, divide by `$m + n$`. Midpoint `$m = n$`; centroid is the average of the vertices.

</div>
