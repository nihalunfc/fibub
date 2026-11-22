---
title: 'Quadratic equations and parabolas'
seoTitle: 'SAT quadratics: solving, vertex form and discriminant'
summary: 'Solve quadratics by factoring, the quadratic formula or graphing; read the vertex, zeros and y-intercept from the three forms of a parabola; and count solutions with the discriminant.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Solve x² − 5x + 6 = 0.'
    choices: ['x = 2 or x = 3', 'x = −2 or x = −3', 'x = 1 or x = 6']
    ans: 0
    why: '(x − 2)(x − 3) = 0, so x = 2 or x = 3.'
  - q: 'What is the vertex of y = −2(x − 1)² + 7?'
    choices: ['(1, 7)', '(−1, 7)', '(1, −7)']
    ans: 0
    why: 'Vertex form y = a(x − h)² + k has vertex (h, k) = (1, 7).'
  - q: 'x² + 4x + 9 = 0 has discriminant 16 − 36 = −20. How many real solutions?'
    choices: ['None', 'One', 'Two']
    ans: 0
    why: 'A negative discriminant means the parabola never reaches the x-axis.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, quadratics (original questions) https://fibub.com/learn/courses/sat/quadratics/'
---

**Module 3 · about 24 minutes · read first: [3.1](/learn/courses/sat/equivalent-expressions/).** By the end you will solve any quadratic equation, sketch its parabola, and answer the SAT's vertex and discriminant questions.

<div class="bigidea">A quadratic makes a U-shaped curve called a parabola. Its solutions are where the curve crosses the x-axis, its vertex is the turning point, and three forms of the same equation each show a different one of these at a glance.</div>

## 1. The parabola

Throw a ball and its path is a parabola. Change a, h and k below. a decides width and whether it opens up or down; h and k move the vertex.

<figure class="fig" data-fig="graph" data-mode="parabola" data-a="1" data-h="1" data-k="-4"><figcaption>y = a(x − h)² + k. The dashed line is the axis of symmetry through the vertex; the dots on the x-axis are the solutions of y = 0. Push k past zero and watch the solutions vanish.</figcaption></figure>

## 2. Three forms, three facts

| Form | Example | Shows you |
|---|---|---|
| Standard: ax² + bx + c | x² − 2x − 8 | the y-intercept (c = −8) |
| Factored: a(x − p)(x − q) | (x + 2)(x − 4) | the zeros (x = −2 and 4) |
| Vertex: a(x − h)² + k | (x − 1)² − 9 | the vertex (1, −9) |

All three are the same parabola. The vertex is halfway between the zeros: (−2 + 4) ÷ 2 = 1.

```math
x_{\text{vertex}} = -\frac{b}{2a}
```

<div class="problem" data-problem="qd-g02"></div>

## 3. Solving: three ways

**Factor** when the numbers are friendly (Lesson 3.1): x² + x − 12 = 0 → (x + 4)(x − 3) = 0 → x = −4 or 3.

**Quadratic formula** always works (it is on the SAT reference sheet):

```math
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

<div class="meaning">

<dl>
<dt>a, b, c</dt><dd>the numbers in ax² + bx + c = 0 (move everything to one side first)</dd>
<dt>b² − 4ac</dt><dd>the <b>discriminant</b>: positive → two solutions, zero → one, negative → none</dd>
<dt>±</dt><dd>gives the two solutions, one with + and one with −</dd>
<dt>Physical meaning</dt><dd>The square root measures how far each solution sits from the vertex's x. If b² − 4ac is negative, the parabola's turning point is on the wrong side of the x-axis and the curve never crosses it.</dd>
</dl>

</div>

**Graph** it in Desmos and click the x-intercepts (Lesson 1.3).

<div class="problem" data-problem="qd-g01"></div>

<div class="problem" data-problem="qd-g06"></div>

## 4. The discriminant questions

<div class="steps">
<div class="step"><b>Question:</b> x² − 6x + c = 0 has exactly one real solution. What is c?</div>
<div class="step">Exactly one solution means b² − 4ac = 0.</div>
<div class="step">(−6)² − 4(1)(c) = 0 → 36 = 4c.</div>
<div class="step"><b>c = 9.</b> Then the equation is (x − 3)² = 0: the parabola just touches the axis at its vertex.</div>
</div>

<div class="problem" data-problem="qd-g04"></div>

## 5. Sums and products of solutions

For ax² + bx + c = 0, the solutions add to −b/a and multiply to c/a. "What is the sum of the solutions of 2x² − 10x + 3 = 0?" → 10/2 = 5, with no solving.

## 6. Projectiles

h = −16t² + 64t + 5 gives a ball's height in feet after t seconds. The top of the flight is the vertex: t = −64 ÷ (2 × −16) = 2 s, height −64 + 128 + 5 = 69 ft. It lands when h = 0.

<div class="problem" data-problem="qd-g05"></div>

<div class="myth">

**"x² = 25 means x = 5."** It also means x = −5, because (−5)² = 25. A quadratic usually has two solutions; questions saying "x > 0" want the positive one.

</div>

<div class="keypoints">

- Standard form shows the y-intercept, factored form the zeros, vertex form the vertex.
- Vertex x = −b/(2a), halfway between the zeros.
- Solve by factoring, the quadratic formula or graphing; move everything to one side first.
- Discriminant b² − 4ac: positive two, zero one, negative no real solutions.
- Sum of solutions −b/a, product c/a.

</div>
