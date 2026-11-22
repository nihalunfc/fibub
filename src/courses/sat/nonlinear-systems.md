---
title: 'Systems with a line and a curve'
seoTitle: 'SAT nonlinear systems: line and parabola or circle'
summary: 'Solve systems where a line meets a parabola or circle by substitution or graphing, find how many crossing points there are with the discriminant, and use the sum-of-solutions shortcut.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'y = x² and y = 9. What are the solutions?'
    choices: ['(3, 9) and (−3, 9)', '(3, 9) only', '(9, 3)']
    ans: 0
    why: 'x² = 9 gives x = 3 or −3; both have y = 9.'
  - q: 'At most how many points can a line and a parabola share?'
    choices: ['2', '1', '3']
    ans: 0
    why: 'Substituting gives a quadratic equation, which has at most 2 solutions.'
  - q: 'After substituting, a system becomes x² − 4x + 4 = 0. How many solutions does the system have?'
    choices: ['One (the line touches the parabola)', 'Two', 'None']
    ans: 0
    why: 'The discriminant is 16 − 16 = 0: one solution, x = 2.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, nonlinear systems (original questions) https://fibub.com/learn/courses/sat/nonlinear-systems/'
---

**Module 3 · about 16 minutes · read first: [2.3](/learn/courses/sat/systems-of-equations/), [3.2](/learn/courses/sat/quadratics/).** By the end you will solve and count the solutions of a system with a line and a curve.

<div class="bigidea">Substitute the line into the curve and you get a quadratic equation. Its solutions are the x-coordinates of the crossing points, and its discriminant tells you whether there are 0, 1 or 2 of them.</div>

## 1. See it first

<figure class="fig" data-fig="graph" data-mode="nonlinear"><figcaption>A parabola y = x² + c and a line. Slide the line: it can miss the curve, touch it once (tangent) or cut it twice.</figcaption></figure>

## 2. Solve by substitution

<div class="steps">
<div class="step"><b>Solve:</b> y = x² − 2x − 3 and y = x + 1.</div>
<div class="step">Both equal y, so set them equal: x² − 2x − 3 = x + 1.</div>
<div class="step">One side zero: x² − 3x − 4 = 0, so (x − 4)(x + 1) = 0.</div>
<div class="step">x = 4 or x = −1. Use the line for y: (4, 5) and (−1, 0).</div>
</div>

<div class="problem" data-problem="ns-g01"></div>

<div class="meaning">

<dl>
<dt>Setting equal</dt><dd>at a crossing point both graphs have the same y for the same x</dd>
<dt>Discriminant of the result</dt><dd>positive: 2 crossings; zero: 1 (the line is tangent); negative: none</dd>
<dt>Physical meaning</dt><dd>A straight line can enter a U shape and leave it again, but it cannot weave in and out more than that, which is why there are never more than two crossings.</dd>
</dl>

</div>

## 3. The sum shortcut

If the question asks for the sum (or product) of the x-coordinates, you do not need the points: after setting equal and tidying to x² + bx + c = 0, the sum is −b and the product is c.

<div class="problem" data-problem="ns-g02"></div>

## 4. Circles and lines

x² + y² = 25 with y = 3: substitute, x² = 16, x = ±4. Circles are covered fully in [Lesson 5.4](/learn/courses/sat/circles/).

<div class="problem" data-problem="ns-g04"></div>

<div class="myth">

**"Found x, so I have the solution."** A solution of a system is a point (x, y). If asked for y, or for the product x·y, put x back into the simpler equation (usually the line).

</div>

<div class="keypoints">

- Set the two expressions for y equal, move everything to one side, and solve the quadratic.
- Each x gives a crossing point; find y from the line.
- Discriminant: 2, 1 or 0 crossing points. "Exactly one solution" means discriminant zero.
- Sum of x-coordinates = −b, product = c (for x² + bx + c = 0).

</div>
