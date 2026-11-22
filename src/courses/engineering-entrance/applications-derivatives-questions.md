---
title: 'Applications of derivatives: question types and traps'
seoTitle: 'Applications of derivatives JEE questions: types'
summary: 'Every way entrance exams ask about applications of derivatives: related rates, tangents and normals, angle between curves, monotonicity with a parameter, local and global extrema, optimisation of areas and volumes, approximation, mean value theorems, number of real roots and inequalities, each with a method and its trap.'
minutes: 27
updated: 2026-11-22
quiz:
  - q: 'The least value of f(x) = x² − 4x + 7 on [0, 5] is:'
    choices: ['3', '7', '12', '0']
    ans: 0
    why: 'f′ = 2x − 4 = 0 at x = 2, inside [0, 5]. f(2) = 3, f(0) = 7, f(5) = 12. The least is 3.'
  - q: 'The curves y = x² and x = y² cut at (1, 1) at an angle θ with tan θ =:'
    choices: ['3/4', '4/3', '1', '0']
    ans: 0
    why: 'Slopes at (1, 1): 2x = 2 and 1/(2y) = 1/2. tan θ = |(2 − 1/2)/(1 + 1)| = 3/4.'
  - q: 'f(x) = x³ + kx is increasing for every real x when:'
    choices: ['k ≥ 0', 'k < 0', 'k = −3', 'all k']
    ans: 0
    why: 'f′ = 3x² + k must be ≥ 0 for all x. Its least value is k (at x = 0), so k ≥ 0.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Differential calculus; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 27 minutes.** Read [Applications of derivatives](/learn/courses/engineering-entrance/applications-derivatives/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Every application question is one of three moves: differentiate a relation in time (rates), read the slope (tangents, monotonicity), or set the slope to zero (extremes). The hard part is setting up the right function in one variable; the calculus is short.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Related rates.</b> Ladders, cones, shadows, balloons. <i>Trap:</i> substituting numbers before differentiating.</div>
<div class="step"><b>2. Tangents and normals.</b> Equations, intercepts, tangents parallel to a line, from an outside point, for parametric curves. <i>Trap:</i> using the normal slope for the tangent.</div>
<div class="step"><b>3. Angle between curves.</b> Find the meeting point, both slopes, then tan θ. <i>Trap:</i> missing a second meeting point.</div>
<div class="step"><b>4. Monotonicity.</b> Intervals of increase; parameter so f is monotonic everywhere. <i>Method:</i> f′ ≥ 0 for all x, often a discriminant condition.</div>
<div class="step"><b>5. Local and global extrema.</b> First and second derivative tests; compare ends of an interval. <i>Trap:</i> forgetting the endpoints or points where f′ does not exist.</div>
<div class="step"><b>6. Optimisation.</b> Boxes, cylinders in spheres, least distance from a point to a curve, fencing. <i>Method:</i> one variable, its interval, f′ = 0.</div>
<div class="step"><b>7. Approximation and errors.</b> f(x + Δx) ≈ f(x) + f′(x)Δx; percentage errors. <i>Trap:</i> degrees instead of radians in trig approximations.</div>
<div class="step"><b>8. Roots and inequalities.</b> Rolle, Lagrange, number of real roots, comparing aᵇ and bᵃ. <i>Method:</i> study a helper function g and its sign.</div>
</div>

## Worked examples

**Example 1 (level 3, related rates with a cone).** Water pours at 4 cm³/s into an inverted cone with height 2 × radius. How fast does the water level rise when it is 4 cm deep? *Solution.* r = h/2, so V = (1/3)π(h/2)²h = πh³/12. dV/dt = (πh²/4) dh/dt. 4 = (π × 16/4) dh/dt, so **dh/dt = 1/π cm/s**.

**Example 2 (level 4, least distance).** Find the points on y² = 4x nearest to (5, 0). *Solution.* Take the point (t², 2t). Square of distance D = (t² − 5)² + 4t². dD/dt = 4t(t² − 5) + 8t = 4t(t² − 3) = 0 at t = 0, ±√3. D(0) = 25, D(±√3) = 4 + 12 = 16. Nearest points **(3, ±2√3)**, distance 4. Check: the normal at those points passes through (5, 0).

**Example 3 (level 4, global extremes).** Find the greatest value of f(x) = 2x³ − 9x² + 12x on [0, 3]. *Solution.* f′ = 6(x − 1)(x − 2): critical points 1 and 2. f(0) = 0, f(1) = 5, f(2) = 4, f(3) = 9. **Greatest value 9, at the end x = 3**, not at the local maximum x = 1.

**Example 4 (level 5, number of roots).** For which k does x³ − 3x + k = 0 have three distinct real roots? *Solution.* f′ = 3x² − 3 = 0 at x = ±1. f(−1) = 2 + k, f(1) = k − 2. Three roots need opposite signs: (k + 2)(k − 2) < 0, so **−2 < k < 2**.

**Example 5 (level 5, inequality).** Show that tan x > x for 0 < x < π/2. *Solution.* g(x) = tan x − x has g(0) = 0 and g′(x) = sec²x − 1 = tan²x > 0 on (0, π/2). So g is increasing and g(x) > g(0) = 0. **tan x > x.**

<div class="myth">

**"The local maximum is the largest value."** A local maximum is only larger than its neighbours. On a closed interval, the global maximum may sit at an endpoint (Example 3), and a function can have a local maximum that is smaller than a local minimum elsewhere, like x + 1/x.

</div>

<div class="meaning">
<dl>
<dt>Critical point</dt><dd>f′ = 0 or f′ undefined</dd>
<dt>Helper function</dt><dd>g = (left side) − (right side) in an inequality; show g stays positive</dd>
<dt>Parametric point</dt><dd>(at², 2at) on y² = 4ax, (a cos θ, b sin θ) on an ellipse: one variable instead of two</dd>
<dt>Physical meaning</dt><dd>At a maximum the quantity has stopped rising and not yet started falling, so its rate of change is zero for an instant.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="applications-derivatives" data-mode="practice"></div>

<div class="keypoints">

- Rates: differentiate first, substitute later; use similar triangles to remove extra variables.
- Angle between curves: tan θ = |(m₁ − m₂)/(1 + m₁m₂)| at each meeting point.
- Monotonic for all x: f′ ≥ 0 everywhere, often a discriminant ≤ 0.
- Global extremes: compare critical points and the ends of the interval.
- Least distance to a curve: use a parametric point and minimise the square of the distance.
- Cubic x³ + px + k has three real roots when f(max)·f(min) < 0.
- Inequalities: helper function, value at the start, sign of its derivative.

</div>
