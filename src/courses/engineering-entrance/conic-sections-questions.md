---
title: 'Parabola, ellipse and hyperbola: question types and traps'
seoTitle: 'Conic sections JEE questions: types and traps'
summary: 'Every way entrance exams test conics: basics of each curve, eccentricity and directrices, focal distances and focal chords, tangents and the tangency condition, tangents from a point, normals to a parabola, asymptotes, rectangular hyperbolas, extreme values, parametric forms and conics that meet, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The length of the latus rectum of x²/9 + y²/4 = 1 is:'
    choices: ['8/3', '9/2', '4/3', '4']
    ans: 0
    why: 'Latus rectum = 2b²/a with a² = 9, b² = 4: 2 × 4/3 = 8/3.'
  - q: 'For a point P on x²/25 + y²/16 = 1, PS₁ + PS₂ equals:'
    choices: ['10', '8', '6', '5']
    ans: 0
    why: 'The sum of focal distances on an ellipse is the major axis, 2a = 10, for every point P.'
  - q: 'The tangents at the ends of a focal chord of y² = 8x meet on the line:'
    choices: ['x = −2', 'x = 2', 'y = 0', 'x = 0']
    ans: 0
    why: 'Tangents at t₁, t₂ meet at (at₁t₂, a(t₁ + t₂)). For a focal chord t₁t₂ = −1, so x = −a = −2: the directrix.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry (conic sections); question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Parabola, ellipse and hyperbola](/learn/courses/engineering-entrance/conic-sections/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Conic questions are won by the right representation. Distances to a focus: switch to the directrix. Points on the curve: use the parametric form. Tangents with a slope: use the tangency condition. Pick the form first, then calculate.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Basics.</b> Vertex, focus, directrix, axes, latus rectum from the equation. <i>Trap:</i> the squared variable fixes the axis; with b > a the ellipse is vertical.</div>
<div class="step"><b>2. Eccentricity and directrices.</b> b² = a²(1 − e²) or a²(e² − 1). <i>Trap:</i> using the ellipse relation for a hyperbola.</div>
<div class="step"><b>3. Focal distances.</b> x₁ + a for a parabola; a ± ex₁ for an ellipse; |ex₁ ± a| for a hyperbola. <i>Trap:</i> using the distance formula and getting lost in roots.</div>
<div class="step"><b>4. Focal chords.</b> t₁t₂ = −1; length a(t + 1/t)². <i>Trap:</i> assuming every chord through the axis passes through the focus.</div>
<div class="step"><b>5. Tangents.</b> At a point, at a parameter, or with slope m. <i>Trap:</i> sign of b² in the hyperbola condition.</div>
<div class="step"><b>6. Tangents from a point.</b> Put the point into y = mx + c with the tangency condition: a quadratic in m. <i>Trap:</i> a missing vertical tangent.</div>
<div class="step"><b>7. Normals to a parabola.</b> y = mx − 2am − am³: three normals, m₁ + m₂ + m₃ = 0. <i>Trap:</i> the conormal point must be far enough along the axis (x > 2a) for three real normals.</div>
<div class="step"><b>8. Asymptotes and rectangular hyperbolas.</b> Replace 1 by 0; xy = c² with (ct, c/t). <i>Trap:</i> lines parallel to an asymptote are not tangents.</div>
<div class="step"><b>9. Extreme values.</b> Parametric point and a sin θ + b cos θ, or a tangent parallel to a given line. <i>Trap:</i> using Lagrange-style guesses that miss the endpoint.</div>
<div class="step"><b>10. Conics meeting and finding the equation.</b> Solve together, or build the curve from focus and directrix. <i>Trap:</i> a shifted centre changes the foci and directrices.</div>
</div>

## Worked examples

**Example 1 (level 3, focal chord).** One end of a focal chord of y² = 16x is (16, 16). Find the other end. *Solution.* a = 4, and (at², 2at) = (16, 16) gives t = 2. The other end has t₂ = −1/t = −1/2: (4 × 1/4, 2 × 4 × (−1/2)) = **(1, −4)**.

**Example 2 (level 4, tangents from a point).** Find the tangents from (2, 3) to x²/4 + y²/3 = 1. *Solution.* 4/4 + 9/3 = 4 > 1, so the point is outside. Use y = mx + c with c² = 4m² + 3 and 3 = 2m + c. Then (3 − 2m)² = 4m² + 3, so 9 − 12m = 3 and m = 1/2. Only one slope came out, so the other tangent is vertical: x = 2, which indeed touches the ellipse at (2, 0). **Tangents: y = x/2 + 2 and x = 2.**

**Example 3 (level 4, extreme value).** Find the greatest value of x + y for points on x²/16 + y²/9 = 1. *Solution.* x = 4 cos θ, y = 3 sin θ, so x + y = 4 cos θ + 3 sin θ, whose greatest value is √(16 + 9) = **5**.

**Example 4 (level 5, eccentricities).** A hyperbola and an ellipse x²/25 + y²/16 = 1 share foci, and the hyperbola's eccentricity is 2. Find the hyperbola. *Solution.* For the ellipse, ae = 3 (since 25 − 16 = 9). For the hyperbola, a·2 = 3, so a = 3/2 and b² = a²(e² − 1) = 9/4 × 3 = 27/4. **x²/(9/4) − y²/(27/4) = 1**, that is 4x²/9 − 4y²/27 = 1.

<div class="myth">

**"The tangency condition gives every tangent from a point."** It gives every tangent of the form y = mx + c. A vertical tangent has no slope, so the quadratic in m loses it: when you get only one m from an outside point, look for a vertical tangent.

</div>

<div class="meaning">
<dl>
<dt>Parameter t or θ</dt><dd>one number that names a point on the curve, so conditions become equations in one variable</dd>
<dt>Tangency condition</dt><dd>the relation between m and c that makes y = mx + c touch the curve</dd>
<dt>Physical meaning</dt><dd>A conic is a two-variable curve, but a parameter makes it a one-variable problem. Most long JEE conic questions become short once each point is written as (at², 2at) or (a cos θ, b sin θ).</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="conic-sections" data-mode="practice"></div>

<div class="keypoints">

- Find the axis first: the squared variable, or the larger denominator for an ellipse.
- Focal distance: swap for e × distance to the directrix.
- Focal chord of y² = 4ax: t₁t₂ = −1; other end at −1/t.
- Tangents from a point: a quadratic in m, plus a possible vertical tangent.
- Confocal conics share ae; asymptotes from replacing 1 by 0.
- Extreme values on an ellipse: parametric point and √(a² + b²) type ranges.

</div>
