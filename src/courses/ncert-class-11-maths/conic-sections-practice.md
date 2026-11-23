---
title: 'Conic Sections: practice questions'
seoTitle: 'Conic Sections Class 11 questions with answers'
summary: 'Practice for Class 11 Conic Sections: circle, parabola, ellipse and hyperbola, with 1 to 5 mark questions, a case question, assertion-reason and full answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The equation of the circle with centre (0, 0) passing through (3, 4) is:'
    choices: ['x² + y² = 25', 'x² + y² = 5', 'x² + y² = 7', 'x² + y² = 49']
    ans: 0
    why: 'The radius is the distance √(9 + 16) = 5, so x² + y² = r² = 25.'
  - q: 'The length of the latus rectum of the parabola x² = 12y is:'
    choices: ['12', '6', '3', '24']
    ans: 0
    why: 'x² = 4ay with 4a = 12, so the latus rectum is 4a = 12.'
  - q: 'The eccentricity of x²/9 − y²/16 = 1 is:'
    choices: ['5/3', '3/5', '4/3', '7/3']
    ans: 0
    why: 'c² = 9 + 16 = 25, so c = 5 and e = c/a = 5/3.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 10.** Read the lesson, [Conic Sections](/learn/courses/ncert-class-11-maths/conic-sections/), first. Try each question on paper before you open the answer.

<div class="bigidea">For every conic question, first decide which curve it is (look at the signs and the squared variables), then read off a, b and c, and only then answer. Draw a rough sketch with the centre, foci and vertices: it catches most slips.</div>

## How to set out answers

1. Name the curve and write its standard equation.
2. Find a, b (or a alone for a parabola) from the numbers in the question. For an ellipse the larger denominator is `$a^2$`.
3. Use the right relation: ellipse `$c^2 = a^2 - b^2$`, hyperbola `$c^2 = a^2 + b^2$`.
4. State the answer with its coordinates or length, and check it against your sketch.

## 1-mark questions

1. Write the equation of the circle with centre `$(0, 0)$` and radius 6.
<details><summary>Answer</summary>

`$x^2 + y^2 = 36$`.

</details>

2. Find the focus of the parabola `$y^2 = 8x$`.
<details><summary>Answer</summary>

`$4a = 8$`, so `$a = 2$`. The focus is `$(2, 0)$`.

</details>

3. What is the eccentricity of a circle?
<details><summary>Answer</summary>

0, since the two foci join at the centre (`$c = 0$`).

</details>

4. For `$\dfrac{x^2}{16} + \dfrac{y^2}{25} = 1$`, which axis is the major axis?
<details><summary>Answer</summary>

The y-axis, because the larger denominator (25) is under `$y^2$`.

</details>

5. Name the conic `$\dfrac{x^2}{4} - \dfrac{y^2}{9} = 1$`.
<details><summary>Answer</summary>A hyperbola (a minus sign between the squared terms).</details>

<div class="problem" data-problem="c11m-conic-focal"></div>

## 2-mark and 3-mark questions

6. Find the centre and radius of the circle `$x^2 + y^2 - 8x + 6y = 0$`. *(2 marks)*
<details><summary>Answer</summary>

`$2g = -8$` so `$g = -4$`; `$2f = 6$` so `$f = 3$`; `$c = 0$`. Centre `$(-g, -f) = (4, -3)$`, radius `$\sqrt{16 + 9 - 0} = 5$`.

</details>

7. Find the equation of the parabola with focus `$(0, -4)$` and directrix `$y = 4$`. *(2 marks)*
<details><summary>Answer</summary>

The parabola opens downward with `$a = 4$` (the vertex is the origin, midway between focus and directrix). Equation: `$x^2 = -4ay = -16y$`.

</details>

8. Find the foci, vertices and eccentricity of `$\dfrac{x^2}{36} + \dfrac{y^2}{20} = 1$`. *(3 marks)*
<details><summary>Answer</summary>

`$a^2 = 36$`, `$b^2 = 20$`, so `$c^2 = 36 - 20 = 16$`, `$c = 4$`. Foci `$(\pm 4, 0)$`, vertices `$(\pm 6, 0)$`, `$e = c/a = 4/6 = 2/3$`.

</details>

9. Find the equation of the circle with the ends of a diameter at `$(1, 2)$` and `$(7, 10)$`. *(3 marks)*
<details><summary>Answer</summary>

Centre = midpoint `$(4, 6)$`. Radius = half the distance between the ends: `$\tfrac12\sqrt{36 + 64} = 5$`. Equation: `$(x - 4)^2 + (y - 6)^2 = 25$`.

</details>

10. Find the equation of the hyperbola with foci `$(\pm 5, 0)$` and vertices `$(\pm 3, 0)$`. *(3 marks)*
<details><summary>Answer</summary>

`$a = 3$`, `$c = 5$`, so `$b^2 = c^2 - a^2 = 16$`. Equation: `$\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$`.

</details>

<div class="problem" data-problem="c11m-conic-ellipse"></div>

11. Find the length of the latus rectum of the parabola `$y^2 = -20x$` and write the equation of its directrix. *(2 marks)*
<details><summary>Answer</summary>

`$4a = 20$`, so `$a = 5$`. Latus rectum length `$4a = 20$`. It opens left, so the directrix is `$x = 5$`.

</details>

## 5-mark questions

12. Derive the equation of the parabola `$y^2 = 4ax$` from the focus-directrix definition. *(5 marks)*
<details><summary>Answer</summary>

Take the focus `$F(a, 0)$` and the directrix `$x = -a$`. Let `$P(x, y)$` be a point of the parabola and `$D$` the foot of the perpendicular from `$P$` to the directrix.

`$PF = PD$` gives `$\sqrt{(x - a)^2 + y^2} = x + a$`.

Squaring: `$(x - a)^2 + y^2 = (x + a)^2$`, so `$x^2 - 2ax + a^2 + y^2 = x^2 + 2ax + a^2$`.

Cancelling: `$y^2 = 4ax$`. The vertex is the origin and the latus rectum (put `$x = a$`) has length `$4a$`.

</details>

13. The ellipse `$9x^2 + 25y^2 = 225$` is given. Find its centre, vertices, foci, eccentricity and latus rectum, and the sum of the distances of any point on it from the two foci. *(5 marks)*
<details><summary>Answer</summary>

Divide by 225: `$\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$`. Centre `$(0, 0)$`, `$a = 5$`, `$b = 3$`.

`$c = \sqrt{25 - 9} = 4$`. Vertices `$(\pm 5, 0)$`, foci `$(\pm 4, 0)$`, `$e = 4/5$`.

Latus rectum `$= 2b^2/a = 18/5$`. The sum of focal distances is `$2a = 10$`.

</details>

14. For the hyperbola `$16x^2 - 9y^2 = 144$`, find the foci, eccentricity, latus rectum and the equations of the asymptotes. *(5 marks)*
<details><summary>Answer</summary>

Divide by 144: `$\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$`, so `$a = 3$`, `$b = 4$`.

`$c = \sqrt{9 + 16} = 5$`: foci `$(\pm 5, 0)$`, `$e = 5/3$`.

Latus rectum `$= 2b^2/a = 32/3$`. Asymptotes `$y = \pm \dfrac{b}{a}x = \pm\dfrac43 x$`.

</details>

<div class="problem" data-problem="c11m-conic-circle"></div>

## Case-based question

A TV company installs a satellite dish whose cross-section is the parabola `$y^2 = 24x$` (x and y in centimetres, the vertex at the origin, opening to the right). The receiver sits at the focus.

(a) How far from the vertex should the receiver be fixed?
<details><summary>Answer</summary>

`$4a = 24$`, so `$a = 6$`: the receiver is 6 cm from the vertex, at `$(6, 0)$`.

</details>

(b) What is the width of the dish at the receiver (the latus rectum)?
<details><summary>Answer</summary>

`$4a = 24$` cm.

</details>

(c) The dish is cut at x = 54 cm. Find its full width at that cut.
<details><summary>Answer</summary>

`$y^2 = 24 \times 54 = 1296$`, so `$y = \pm 36$`. The full width is 72 cm.

</details>

(d) Why does a parabola bring parallel signals to one point?
<details><summary>Answer</summary>Every ray parallel to the axis reflects off the parabola through the focus, because the tangent at each point makes equal angles with the incoming ray and the line to the focus.</details>

## Assertion and reason

Options: (A) Both A and R are true and R explains A. (B) Both true but R does not explain A. (C) A is true, R is false. (D) A is false, R is true.

15. **Assertion:** The ellipse `$\dfrac{x^2}{9} + \dfrac{y^2}{25} = 1$` has its foci on the y-axis. **Reason:** The foci lie along the axis with the larger denominator.
<details><summary>Answer</summary>

(A). Both are true: the larger denominator 25 is under `$y^2$`, `$c = \sqrt{25 - 9} = 4$`, foci `$(0, \pm 4)$`.

</details>

16. **Assertion:** The eccentricity of a hyperbola can be 0.8. **Reason:** For a hyperbola `$c^2 = a^2 + b^2$`.
<details><summary>Answer</summary>

(D). A is false: `$e = c/a > 1$` always. R is true.

</details>

17. **Assertion:** `$x^2 + y^2 - 2x + 4y + 1 = 0$` is a circle of radius 2. **Reason:** For `$x^2 + y^2 + 2gx + 2fy + c = 0$` the radius is `$\sqrt{g^2 + f^2 - c}$`.
<details><summary>Answer</summary>

(A). Here `$g = -1$`, `$f = 2$`, `$c = 1$`, so `$r = \sqrt{1 + 4 - 1} = 2$`. Both are true and R gives the working for A. (Always check that `$g^2 + f^2 - c$` is positive: for `$c = 10$` it would be `$-5$` and there would be no circle.)

</details>

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="conic-sections" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Identify the curve first: same positive coefficients (circle), different positive coefficients (ellipse), opposite signs (hyperbola), one squared variable (parabola).
- Ellipse: larger denominator is `$a^2$`; `$c^2 = a^2 - b^2$`. Hyperbola: `$c^2 = a^2 + b^2$`.
- `$e = c/a$`; latus rectum is `$4a$` for a parabola and `$2b^2/a$` for an ellipse or hyperbola.
- A circle needs `$g^2 + f^2 - c > 0$` to exist.

</div>
