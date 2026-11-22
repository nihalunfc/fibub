---
title: 'Equivalent expressions: expand, factor, simplify'
seoTitle: 'SAT equivalent expressions: expanding and factoring'
summary: 'Expand brackets with the area model, factor quadratics, use the difference of squares and perfect squares, and check any "which is equivalent" answer in seconds by plugging in a number.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Which is equivalent to (x + 4)(x − 3)?'
    choices: ['x² + x − 12', 'x² − 12', 'x² + 7x − 12']
    ans: 0
    why: 'x² − 3x + 4x − 12 = x² + x − 12.'
  - q: 'Factor x² − 49.'
    choices: ['(x − 7)(x + 7)', '(x − 7)²', '(x − 49)(x + 1)']
    ans: 0
    why: 'A difference of squares: a² − b² = (a − b)(a + b) with a = x, b = 7.'
  - q: '(x + 5)² equals which expression?'
    choices: ['x² + 10x + 25', 'x² + 25', 'x² + 5x + 25']
    ans: 0
    why: '(x + 5)(x + 5) = x² + 5x + 5x + 25. Squaring a sum gives a middle term.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, equivalent expressions (original questions) https://fibub.com/learn/courses/sat/equivalent-expressions/'
---

**Module 3 · about 20 minutes · read first: [2.1](/learn/courses/sat/linear-equations/).** By the end you will expand and factor quadratic expressions, spot special patterns, and check any equivalence question by plugging in a number.

<div class="bigidea">Two expressions are equivalent when they give the same value for every x. Expanding and factoring just rewrite the same quantity in a more useful shape.</div>

## 1. Expanding: the area model

(2x + 3)(x + 4) is the area of a rectangle with sides 2x + 3 and x + 4. Split it into four boxes and add their areas. Change the numbers below and watch all four boxes.

<figure class="fig" data-fig="area-model"><figcaption>Every term of the first bracket multiplies every term of the second: four boxes, four products. The two middle boxes combine into the x term.</figcaption></figure>

<div class="problem" data-problem="ee-g01"></div>

**Subtracting brackets.** A minus in front of a bracket changes every sign inside: 5(x + 2) − 3(x − 4) = 5x + 10 − 3x + 12 = 2x + 22.

<div class="problem" data-problem="ee-g03"></div>

## 2. Factoring: going backwards

To factor x² + bx + c, find two numbers that **multiply to c** and **add to b**.

<div class="steps">
<div class="step"><b>Factor</b> x² − 2x − 15.</div>
<div class="step">We need two numbers that multiply to −15 and add to −2.</div>
<div class="step">Pairs for −15: (1, −15), (−1, 15), (3, −5), (−3, 5). Only 3 and −5 add to −2.</div>
<div class="step">So x² − 2x − 15 = <b>(x + 3)(x − 5)</b>. Check by expanding: x² − 5x + 3x − 15. ✓</div>
</div>

First take out any common factor: 3x² + 6x − 24 = 3(x² + 2x − 8) = 3(x + 4)(x − 2).

## 3. Three patterns to know by sight

```math
a^2 - b^2 = (a - b)(a + b)
```

```math
(a + b)^2 = a^2 + 2ab + b^2 \qquad (a - b)^2 = a^2 - 2ab + b^2
```

<div class="meaning">

<dl>
<dt>a² − b²</dt><dd>a difference of two squares: always splits into (a − b)(a + b)</dd>
<dt>2ab</dt><dd>the middle term of a perfect square: twice the product of the two parts</dd>
<dt>Physical meaning</dt><dd>A square of side a + b is not just a² plus b²: it also contains two a-by-b rectangles. That is where the 2ab comes from (it is the area model with both brackets the same).</dd>
</dl>

</div>

<div class="problem" data-problem="ee-g02"></div>

<div class="problem" data-problem="ee-g05"></div>

## 4. The plug-in check

For "which expression is equivalent to ...?", put a simple number like x = 2 into the original and into each option. Only the equivalent one gives the same value. (Avoid 0 and 1, which can make different expressions match by luck.)

<div class="myth">

**"(x + 3)² = x² + 9."** Try x = 1: (1 + 3)² = 16, but 1 + 9 = 10. Squaring a sum always gives a middle term: (x + 3)² = x² + 6x + 9.

</div>

## 5. How the SAT asks it

- Which expression is equivalent? (Expand, factor, or plug in.)
- "(ax + b)(cx + d) = 6x² + kx − 10. What is k?" Expand and match the x terms.
- Use a pattern: "a + b = 9 and a − b = 3, what is a² − b²?" → 27.
- Factor to find a common factor or to simplify a fraction (Lesson 3.5).

<div class="keypoints">

- Expanding: every term times every term (the area model); collect like terms.
- Factoring x² + bx + c: two numbers that multiply to c and add to b; take out common factors first.
- a² − b² = (a − b)(a + b); (a ± b)² = a² ± 2ab + b².
- Check equivalence by plugging the same number into both expressions.

</div>
