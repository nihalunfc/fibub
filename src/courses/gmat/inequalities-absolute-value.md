---
title: Inequalities and absolute value
seoTitle: 'Inequalities and absolute value for the GMAT'
summary: 'Solving inequalities and when to flip the sign, absolute value as distance on a number line, counting integers that fit, combining ranges, and the squares-and-fractions traps, with an interactive number line.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Solve −2x > 10.'
    choices: ['x > −5', 'x < −5', 'x < 5']
    ans: 1
    why: 'Dividing by −2 flips the sign: x < −5.'
  - q: 'What does |x − 4| ≤ 3 mean?'
    choices: ['1 ≤ x ≤ 7', 'x ≤ 7', '−7 ≤ x ≤ 7']
    ans: 0
    why: 'x is at most 3 away from 4, so from 1 to 7.'
  - q: 'If 2 < x < 5 and 1 < y < 3, what is the range of x − y?'
    choices: ['1 < x − y < 2', '−1 < x − y < 4', '3 < x − y < 8']
    ans: 1
    why: 'Smallest: smallest x minus largest y, 2 − 3 = −1. Largest: 5 − 1 = 4.'
sources:
  - 'OpenStax, Intermediate Algebra 2e (CC BY 4.0), section 2.7 Solve absolute value inequalities: https://openstax.org/books/intermediate-algebra-2e/pages/2-7-solve-absolute-value-inequalities'
  - 'GMAC, GMAT exam structure (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
---

**Module 3 · about 15 minutes.** By the end you will solve inequalities without sign errors and read absolute value as a distance.

<div class="bigidea">An inequality is solved like an equation, with one extra rule: multiplying or dividing by a negative number flips the sign.</div>

## 1. Solving inequalities

Everything works as with equations, except:

- **Multiply or divide by a negative → flip the sign.** −3x &lt; 12 → x &gt; −4. (Check with x = 0: −3(0) = 0 &lt; 12 ✓.)
- **Never multiply by a variable** unless you know its sign: it might be negative.

<div class="steps" data-title="Worked example: largest integer with 7 − 2x > −9">
<div class="step">Subtract 7: −2x &gt; −16.</div>
<div class="step">Divide by −2 <b>and flip</b>: x &lt; 8.</div>
<div class="step">The inequality is strict, so 8 itself fails. Largest integer: <b>7</b>.</div>
</div>

<div class="problem" data-problem="iq-g01"></div>

## 2. Absolute value is distance

<figure class="fig" data-fig="number-line"><figcaption>|x − c| is the distance from x to c. Move the centre and the distance and watch which integers are inside. An open end point is not included; a filled one is.</figcaption></figure>

- |x − c| &lt; d means c − d &lt; x &lt; c + d (closer than d to c).
- |x − c| &gt; d means x &lt; c − d **or** x &gt; c + d (farther than d).
- |x + 2| is the distance to −2, since x + 2 = x − (−2).
- An equation |x − c| = d has two answers: c + d and c − d.

<div class="problem" data-problem="iq-g02"></div>

## 3. Combining ranges

To find the range of x + y, x − y or xy from ranges of x and y, test the **end points**.

- **x + y:** add smallest to smallest and largest to largest.
- **x − y:** smallest x − largest y, then largest x − smallest y.
- **xy:** with negatives possible, try all four corner products.

<div class="problem" data-problem="iq-g03"></div>

<div class="myth">

**"If x &gt; y, then x² &gt; y²."** Only when both are positive. −1 &gt; −3, but 1 &lt; 9. Squares and fractions are where inequality instincts fail; test 0, 1, −1, 1/2 and −1/2 before trusting any rule.

</div>

## 4. Where numbers misbehave

| If | Then | Example |
|---|---|---|
| x &gt; 1 | x² &gt; x | 3² = 9 &gt; 3 |
| 0 &lt; x &lt; 1 | x² &lt; x and 1/x &gt; 1 | (1/2)² = 1/4 |
| x &lt; 0 | x² &gt; 0 &gt; x | (−2)² = 4 |

So "x² &lt; x" means exactly 0 &lt; x &lt; 1.

<div class="keypoints">

- Solve like an equation, but flip the sign when multiplying or dividing by a negative.
- Strict (&lt;, &gt;) excludes the end point; ≤ and ≥ include it.
- |x − c| &lt; d: within d of c. |x − c| &gt; d: farther than d, on either side.
- Range of x − y: smallest − largest to largest − smallest; for products test all corners.
- Squares and fractions break simple rules: test 0, ±1 and ±1/2.

</div>

**Try it:** Choose a form, set the numbers and slide the test value along the line.

<figure class="fig" data-fig="@tp-ineq-line"><figcaption>Open circles leave the end out, closed circles keep it; for |x − c| < d the solution is a single interval around c.</figcaption></figure>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="inequalities" data-exam="gmat" data-mode="practice" data-n="10"></div>

