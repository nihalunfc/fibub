---
title: 'Trigonometric functions and identities: question types and traps'
seoTitle: 'Trigonometry JEE questions: types and traps'
summary: 'Every way entrance exams test trigonometric ratios and identities: radians, exact and allied values, periods and graphs, compound and multiple angles, sum-to-product, conditional identities, greatest and least values, and products and sums of cosines, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'tan 20° + tan 25° + tan 20° tan 25° equals:'
    choices: ['0', '1', '√3', '2']
    ans: 1
    why: '20° + 25° = 45°, so (tan 20° + tan 25°)/(1 − tan 20° tan 25°) = 1. Rearranged, tan 20° + tan 25° + tan 20° tan 25° = 1.'
  - q: 'The least value of cos²x − 4 cos x is:'
    choices: ['−4', '−3', '−5', '0']
    ans: 1
    why: 'With t = cos x in [−1, 1], t² − 4t is decreasing on that interval (its vertex is at t = 2, outside it), so the least value is at t = 1: 1 − 4 = −3. Taking −4 from the vertex is the trap.'
  - q: 'The period of |sin x| + |cos x| is:'
    choices: ['2π', 'π', 'π/2', 'π/4']
    ans: 2
    why: 'Shifting x by π/2 swaps |sin x| and |cos x|, so the sum repeats every π/2. The LCM of the two periods (π) is not the smallest period here.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Trigonometry; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Trigonometric functions and identities](/learn/courses/engineering-entrance/trigonometry/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Almost every trigonometry question is one formula used at the right moment: an allied angle to shrink the angle, a compound or double angle to change its shape, sum-to-product to factor, or a substitution to turn it into algebra. Spotting which one is the skill.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Radians and arcs.</b> Convert, then use s = rθ. <i>Trap:</i> using degrees in s = rθ; clock-hand angles move at 0.5° per minute for the hour hand.</div>
<div class="step"><b>2. Exact and allied values.</b> sin 750°, tan(−315°), cos 15°. Reduce by 360°, find the quadrant, then the reference angle. <i>Trap:</i> switching sin to cos at 180°.</div>
<div class="step"><b>3. Given one ratio, find another.</b> Draw the right triangle for the size, the quadrant for the sign. <i>Trap:</i> taking the positive root in every quadrant.</div>
<div class="step"><b>4. Periods and graphs.</b> 2π/|k| for sin kx; π for |sin x|, sin²x; LCM for sums. <i>Trap:</i> the LCM is only a candidate; test smaller values.</div>
<div class="step"><b>5. Compound and multiple angles.</b> tan(A + B) with A + B = 45° or 60° is a classic. <i>Trap:</i> sign of cos 2A in the half-angle formula.</div>
<div class="step"><b>6. Sum to product and products of cosines.</b> Factor sums; fold cos A cos 2A cos 4A with 2 sin A. <i>Trap:</i> forgetting that sin(π − A) = sin A at the last step.</div>
<div class="step"><b>7. Conditional identities.</b> A + B + C = π. Replace A + B by π − C after the first step. <i>Trap:</i> trying to expand every term.</div>
<div class="step"><b>8. Greatest and least values.</b> √(a² + b²) for linear sin and cos; a quadratic in t = sin x on [−1, 1]; AM ≥ GM for sec² and cosec². <i>Trap:</i> using a vertex that lies outside [−1, 1].</div>
<div class="step"><b>9. Series in AP angles and telescoping.</b> Multiply by 2 sin(β/2) or write each term as a difference of cotangents. <i>Trap:</i> wrong count of terms n.</div>
</div>

## Worked examples

**Example 1 (level 3, allied and compound).** Find (1 + tan 1°)(1 + tan 44°). *Solution.* For A + B = 45°, tan A + tan B = 1 − tan A tan B, so (1 + tan A)(1 + tan B) = 1 + (tan A + tan B) + tan A tan B = 2. **Answer 2.** The same idea gives (1 + tan 1°)(1 + tan 2°)…(1 + tan 45°) = 2²³: 22 pairs and the last factor 1 + tan 45° = 2.

**Example 2 (level 4, products).** Find sin 10° sin 30° sin 50° sin 70°. *Solution.* sin 30° = 1/2. For the rest use sin θ sin(60° − θ) sin(60° + θ) = (1/4) sin 3θ with θ = 10°: sin 10° sin 50° sin 70° = (1/4) sin 30° = 1/8. **Answer 1/16.**

**Example 3 (level 4, greatest and least).** Find the range of f(x) = 3 sin²x + 2 sin x cos x + cos²x. *Solution.* Use double angles: sin²x = (1 − cos 2x)/2 and cos²x = (1 + cos 2x)/2. Then f = 2 − cos 2x + sin 2x. The part sin 2x − cos 2x lies in [−√2, √2]. **Range [2 − √2, 2 + √2].**

**Example 4 (level 5, telescoping).** Find the sum of 1/(sin 1° sin 2°) + 1/(sin 2° sin 3°) + … + 1/(sin 44° sin 45°) in terms of cot. *Solution.* sin 1° = sin((k + 1)° − k°), so each term equals (cot k° − cot(k + 1)°)/sin 1°. The sum telescopes to (cot 1° − cot 45°)/sin 1° = **(cot 1° − 1)/sin 1°**.

<div class="myth">

**"tan x is increasing, so tan x is one-one."** Only on each branch, such as (−π/2, π/2). Over its whole domain it repeats every π, so equal tangents do not mean equal angles: tan A = tan B only gives A = nπ + B.

</div>

<div class="meaning">
<dl>
<dt>Reference angle</dt><dd>the acute angle with the x-axis; it gives the size of the ratio</dd>
<dt>√(a² + b²)</dt><dd>the amplitude of a sin x + b cos x</dd>
<dt>Physical meaning</dt><dd>Turn every trigonometric question into a picture (the unit circle) or into algebra (a substitution). Rules on the page are quicker once you can see why they hold.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="trigonometry" data-mode="practice"></div>

<div class="keypoints">

- Reduce the angle, find the quadrant, apply the sign, then use the reference angle.
- A + B = 45° gives (1 + tan A)(1 + tan B) = 2.
- sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ; the cos version gives ¼ cos 3θ.
- Range problems: √(a² + b²) for linear forms; double angles for quadratic forms; keep sin x and cos x in [−1, 1].
- Telescoping: write each term as a difference of tan or cot using sin(B − A).
- The LCM rule for periods gives a candidate, not always the smallest period.

</div>
