---
title: 'Polynomials and rational expressions'
seoTitle: 'SAT polynomials: zeros, factors, remainder theorem'
summary: 'Find the zeros of a polynomial from its factors, use the remainder and factor theorems instead of long division, read polynomial graphs, and solve rational equations without falling for extraneous answers.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What are the zeros of p(x) = (x − 2)(x + 5)(x − 1)?'
    choices: ['2, −5 and 1', '−2, 5 and −1', '2, 5 and 1']
    ans: 0
    why: 'Each factor is zero when x makes the bracket zero: x − 2 = 0 gives 2, x + 5 = 0 gives −5, x − 1 = 0 gives 1.'
  - q: 'p(3) = 0. What must be true?'
    choices: ['x − 3 is a factor of p(x)', 'x + 3 is a factor of p(x)', 'p has no zeros']
    ans: 0
    why: 'The factor theorem: p(a) = 0 exactly when (x − a) is a factor.'
  - q: 'What is the remainder when p(x) = x² + 4x − 1 is divided by x − 2?'
    choices: ['11', '−5', '0']
    ans: 0
    why: 'Remainder = p(2) = 4 + 8 − 1 = 11.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, polynomials and rational expressions (original questions) https://fibub.com/learn/courses/sat/polynomials-rational/'
---

**Module 3 · about 20 minutes · read first: [3.1](/learn/courses/sat/equivalent-expressions/), [3.2](/learn/courses/sat/quadratics/).** By the end you will move between a polynomial's factors, zeros and graph, and solve equations with fractions safely.

<div class="bigidea">A product is zero only when one of its factors is zero. So once a polynomial is factored, its zeros, and where its graph crosses the x-axis, can be read straight off.</div>

## 1. Factors, zeros and the graph

Slide the three zeros. The polynomial is built from them: p(x) = (x − z₁)(x − z₂)(x − z₃).

<figure class="fig" data-fig="graph" data-mode="cubic"><figcaption>Each factor (x − z) puts a zero at x = z. Move two zeros together and the graph touches the axis there instead of crossing it (a repeated factor).</figcaption></figure>

| Statement | All mean the same thing |
|---|---|
| (x − 4) is a factor of p(x) | p(4) = 0 |
| 4 is a zero of p | the graph crosses or touches the x-axis at x = 4 |

<div class="problem" data-problem="pr-g02"></div>

## 2. The remainder theorem (no long division)

```math
p(x) \div (x - a) \;\text{ leaves remainder }\; p(a)
```

<div class="meaning">

<dl>
<dt>p(a)</dt><dd>the value of the polynomial at x = a</dd>
<dt>remainder 0</dt><dd>(x − a) divides exactly, so it is a factor (the factor theorem)</dd>
<dt>Physical meaning</dt><dd>p(x) = (x − a)·q(x) + R for some quotient q. Put x = a: the first part becomes zero and only R is left, so R = p(a).</dd>
</dl>

</div>

<div class="problem" data-problem="pr-g01"></div>

<div class="problem" data-problem="pr-g05"></div>

## 3. Rational expressions

A rational expression is a fraction with polynomials. Simplify by factoring and cancelling common factors, and remember the original can never have a zero bottom.

(x² − 9)/(x − 3) = (x − 3)(x + 3)/(x − 3) = x + 3, for x ≠ 3.

<div class="problem" data-problem="pr-g04"></div>

## 4. Solving rational equations

<div class="steps">
<div class="step"><b>Solve</b> 6/(x − 1) = 3.</div>
<div class="step">Multiply both sides by (x − 1): 6 = 3(x − 1).</div>
<div class="step">6 = 3x − 3, so 3x = 9 and x = 3.</div>
<div class="step"><b>Check</b> the bottom is not zero: 3 − 1 = 2 ✓. If an answer makes a bottom zero, throw it away (it is "extraneous").</div>
</div>

<div class="problem" data-problem="pr-g03"></div>

<div class="myth">

**"(x + 5) is a factor, so 5 is a zero."** The zero is the x that makes the bracket zero: x + 5 = 0 gives x = −5. Signs flip between a factor and its zero.

</div>

<div class="keypoints">

- Factored form shows the zeros: (x − a) gives the zero x = a.
- p(a) = 0 ⇔ (x − a) is a factor ⇔ the graph meets the x-axis at a.
- The remainder of p(x) ÷ (x − a) is p(a).
- Simplify rational expressions by factoring; multiply through to solve equations, then reject answers that make a bottom zero.

</div>
