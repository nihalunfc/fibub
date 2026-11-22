---
title: 'Trigonometric equations and properties of triangles: question types and traps'
seoTitle: 'Trig equations and triangles JEE questions: traps'
summary: 'Every way entrance exams test trigonometric equations and triangles: general solutions, number and sum of solutions, quadratics in one function, parameters, inequalities, sine and cosine rules, half-angle formulae, area and radii, identities in a triangle and heights and distances, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The number of solutions of tan x = 1 in [0, 3π] is:'
    choices: ['2', '3', '4', '6']
    ans: 1
    why: 'tan x = 1 at x = π/4 + nπ. In [0, 3π] these are π/4, 5π/4 and 9π/4: three solutions, one per period of π.'
  - q: 'In a triangle, if a cos A = b cos B, the triangle is:'
    choices: ['always equilateral', 'isosceles or right-angled', 'always right-angled', 'always obtuse']
    ans: 1
    why: 'By the sine rule, sin A cos A = sin B cos B, so sin 2A = sin 2B. Then 2A = 2B (isosceles) or 2A = π − 2B, that is A + B = π/2 (right-angled).'
  - q: 'For which k does 3 sin x + 4 cos x = k have a solution?'
    choices: ['|k| ≤ 7', '|k| ≤ 5', '|k| ≤ 1', 'all k']
    ans: 1
    why: '3 sin x + 4 cos x = 5 sin(x + α) swings between −5 and 5.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Trigonometry; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Trigonometric equations and properties of triangles](/learn/courses/engineering-entrance/trig-equations-triangles/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Equation questions test whether you see the whole graph, not only the first solution. Triangle questions test whether you pick the right rule and remember the hidden condition A + B + C = π.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. General solution.</b> Bring it to sin x = sin α, cos x = cos α or tan x = tan α. <i>Trap:</i> writing nπ ± α for cosine instead of 2nπ ± α.</div>
<div class="step"><b>2. Number of solutions.</b> Sketch on the interval and count crossings. <i>Trap:</i> counting a root where a denominator (tan, sec) is undefined.</div>
<div class="step"><b>3. Sum of solutions.</b> Pair solutions by symmetry (x and π − x for sine). <i>Trap:</i> missing a solution at an endpoint of a closed interval.</div>
<div class="step"><b>4. Quadratic in one function.</b> Put t = sin x or cos x and solve. <i>Trap:</i> keeping a root with |t| > 1.</div>
<div class="step"><b>5. Parameters and existence.</b> The right side must lie in the range of the left side. <i>Trap:</i> using the range over all reals instead of t in [−1, 1].</div>
<div class="step"><b>6. Inequalities.</b> Read one period off the graph, then add the period. <i>Trap:</i> open or closed ends where the function equals the bound.</div>
<div class="step"><b>7. Solving triangles.</b> Sine rule for angle-side pairs, cosine rule for three sides or the included angle; check the ambiguous case. <i>Trap:</i> taking only the acute value of B.</div>
<div class="step"><b>8. Area and radii.</b> Heron, r = Δ/s, R = abc/4Δ, r₁ = Δ/(s − a). <i>Trap:</i> mixing up r₁ (opposite a) with the others.</div>
<div class="step"><b>9. Identities and shape of a triangle.</b> Turn sides into sines (a = 2R sin A) or angles into sides (cosine rule). <i>Trap:</i> dividing by a factor that can be zero and losing the right-angled case.</div>
<div class="step"><b>10. Heights and distances.</b> One right triangle per observation; eliminate the shared height. <i>Trap:</i> measuring the angle from the vertical.</div>
</div>

## Worked examples

**Example 1 (level 3, sum of solutions).** Find the sum of the solutions of 2 sin²x − 3 sin x + 1 = 0 in [0, 2π]. *Solution.* (2 sin x − 1)(sin x − 1) = 0, so sin x = 1/2 or 1. That gives π/6, 5π/6 and π/2. **Sum = 3π/2.**

**Example 2 (level 4, factorising).** Solve cos x + cos 3x = cos 2x. *Solution.* Sum to product: 2 cos 2x cos x = cos 2x, so cos 2x (2 cos x − 1) = 0. Either cos 2x = 0, giving x = (2n + 1)π/4, or cos x = 1/2, giving x = 2nπ ± π/3. Dividing by cos 2x would have lost the first family.

**Example 3 (level 4, triangle).** In a triangle, a = 2, b = 2√2 and A = 30°. Find all possible values of B. *Solution.* sin B = b sin A / a = 2√2 × (1/2)/2 = 1/√2. Since b sin A = √2 < a = 2 < b, both B = 45° and **B = 135°** work (the second still leaves C = 15° > 0). Two triangles.

**Example 4 (level 5, radii).** Show that in any triangle r₁ + r₂ + r₃ − r = 4R. *Solution.* r₁ + r₂ = Δ[(s − b) + (s − a)]/((s − a)(s − b)) = Δc/((s − a)(s − b)), and r₃ − r = Δ[s − (s − c)]/(s(s − c)) = Δc/(s(s − c)). Adding and putting Δ² = s(s − a)(s − b)(s − c) gives Δc · [s(s − c) + (s − a)(s − b)]/Δ². The bracket simplifies to ab (expand with 2s = a + b + c), so the total is abc/Δ = **4R**.

<div class="myth">

**"If sin A = sin B in a triangle, then A = B."** Inside a triangle, A = π − B is impossible (C would be 0), so here it is true. But sin 2A = sin 2B allows 2A = π − 2B, which is a right triangle. Always check both branches before you reject one.

</div>

<div class="meaning">
<dl>
<dt>Sine rule</dt><dd>a/sin A = b/sin B = c/sin C = 2R</dd>
<dt>Cosine rule</dt><dd>a² = b² + c² − 2bc cos A</dd>
<dt>Physical meaning</dt><dd>The sine rule turns side questions into angle questions and back. Most "shape of the triangle" problems are one application of it followed by a trigonometric equation.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="trig-equations-triangles" data-mode="practice"></div>

<div class="keypoints">

- General solution first, then pick the values in the interval; count crossings on a sketch.
- Factor instead of dividing; check roots after squaring; reject |sin x| > 1.
- Existence: the constant must lie in the range of the expression for allowed x.
- Ambiguous case: if b sin A < a < b, both B and 180° − B give triangles.
- a = 2R sin A turns side identities into angle identities.
- r = Δ/s, R = abc/4Δ, r₁ = Δ/(s − a); r₁ + r₂ + r₃ − r = 4R.

</div>
