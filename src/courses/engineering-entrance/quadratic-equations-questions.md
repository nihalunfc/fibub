---
title: 'Quadratic equations and inequalities: question types and traps'
seoTitle: 'Quadratic equations JEE questions: types and traps'
summary: 'Every way entrance exams ask about quadratics: nature of roots, symmetric functions, forming equations, common roots, location of roots with a parameter, range and sign of expressions, sign-scheme inequalities and modulus or greatest-integer equations, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'If one root of x² − 6x + k = 0 is twice the other, k is:'
    choices: ['6', '8', '9', '12']
    ans: 1
    why: 'Roots α and 2α: 3α = 6 gives α = 2, so the roots are 2 and 4 and k = 8.'
  - q: 'x² + 2x + k > 0 for every real x when:'
    choices: ['k > 1', 'k ≥ 1', 'k < 1', 'k > 0']
    ans: 0
    why: 'An upward parabola is always positive when D < 0: 4 − 4k < 0, so k > 1. At k = 1 it touches zero at x = −1.'
  - q: 'The number of real solutions of x² − 5|x| + 6 = 0 is:'
    choices: ['2', '3', '4', '0']
    ans: 2
    why: 'Put t = |x|: t² − 5t + 6 = 0 gives t = 2 or 3, each giving x = ±t: four solutions.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Complex numbers and quadratic equations; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Quadratic equations and inequalities](/learn/courses/engineering-entrance/quadratic-equations/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Quadratic questions reduce to three tools: the discriminant, the sum and product of roots, and a sketch of the parabola. Parameter questions are where JEE separates ranks; the sketch is what solves them.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Nature of roots.</b> Real, equal, rational, complex; for which k. <i>Trap:</i> forgetting a ≠ 0 when the leading coefficient contains k.</div>
<div class="step"><b>2. Symmetric functions of roots.</b> α² + β², α³ + β³, α/β + β/α, αⁿ + βⁿ by recurrence.</div>
<div class="step"><b>3. Relations between roots.</b> One root double the other, roots in a ratio, reciprocal roots, roots differing by a number.</div>
<div class="step"><b>4. Forming equations.</b> With roots α + 1, 1/α, α², and so on: substitute for x.</div>
<div class="step"><b>5. Common roots.</b> Subtract the equations to find the common root, or use the condition.</div>
<div class="step"><b>6. Location of roots.</b> Both roots greater than k, between two numbers, on opposite sides: D, a·f(k), vertex.</div>
<div class="step"><b>7. Sign and range.</b> Always positive (a > 0, D < 0); range of a rational function by the discriminant.</div>
<div class="step"><b>8. Inequalities and special equations.</b> Sign scheme; |x|, [x], √, log and exponential equations that become quadratics.</div>
</div>

## Worked examples

**Example 1 (level 2, nature).** For what k does (k − 1)x² + 2x + 1 = 0 have equal roots? *Solution.* D = 4 − 4(k − 1) = 0 ⇒ k = 2 (and k ≠ 1, which would make it linear). **k = 2.**

**Example 2 (level 3, symmetric).** If α, β are roots of x² − x − 1 = 0, find α⁵ + β⁵. *Solution.* Sₙ = Sₙ₋₁ + Sₙ₋₂ with S₀ = 2, S₁ = 1: S₂ = 3, S₃ = 4, S₄ = 7, **S₅ = 11**.

**Example 3 (level 3, common root).** For what a do x² + ax + 1 = 0 and x² + x + a = 0 have a common root (a ≠ 1)? *Solution.* Subtract: (a − 1)x + (1 − a) = 0 ⇒ x = 1. Put x = 1: 1 + a + 1 = 0 ⇒ **a = −2**.

**Example 4 (level 4, location).** For which k are both roots of x² − 2kx + k² − 1 = 0 greater than 2? *Solution.* D = 4 > 0 always; the roots are k − 1 and k + 1. Both > 2 ⇔ k − 1 > 2 ⇔ **k > 3**. (Check with the three conditions: f(2) = (2 − k)² − 1 > 0 and vertex k > 2 give the same.)

**Example 5 (level 4, range).** Find the range of y = (x² + x + 1)/(x² − x + 1). *Solution.* (y − 1)x² − (y + 1)x + (y − 1) = 0. Real x needs (y + 1)² − 4(y − 1)² ≥ 0 ⇒ (3 − y)(3y − 1) ≥ 0 ⇒ **1/3 ≤ y ≤ 3**.

**Example 6 (level 5, parameter).** Find all a for which x² − 2ax + a + 6 = 0 has both roots in (1, 5). *Solution.* Conditions: D ≥ 0 ⇒ a² − a − 6 ≥ 0 ⇒ a ≤ −2 or a ≥ 3; f(1) = 7 − a > 0 ⇒ a < 7; f(5) = 31 − 9a > 0 ⇒ a < 31/9; vertex 1 < a < 5. Together: **3 ≤ a < 31/9**.

<div class="myth">

**"If the coefficient of x² contains k, it is still a quadratic."** Only when that coefficient is not zero. Questions that say "the equation has real roots" may include the linear case; questions that say "quadratic equation" exclude it. Read which one is asked.

</div>

<div class="meaning">
<dl>
<dt>Three checks</dt><dd>D ≥ 0, sign of a·f(k), vertex −b/2a</dd>
<dt>Recurrence</dt><dd>Sₙ = −(b/a)Sₙ₋₁ − (c/a)Sₙ₋₂</dd>
<dt>Physical meaning</dt><dd>Every parameter question is "slide the parabola until it sits where the question wants it"; the three checks describe that position exactly.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="quadratic-equations" data-mode="practice"></div>

<div class="keypoints">

- Nature of roots from D; keep a ≠ 0 in mind when a has a parameter.
- Symmetric functions from α + β and αβ; powers by the recurrence.
- Common root: subtract the equations to find it.
- Location of roots: D ≥ 0, a·f(k) > 0 and the vertex position.
- Range of (quadratic)/(quadratic): discriminant of the equation in x must be ≥ 0.
- |x| equations: put t = |x| and keep only t ≥ 0.

</div>
