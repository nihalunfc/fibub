---
title: Trigonometric Functions
seoTitle: 'Trigonometric Functions Class 11 notes'
summary: 'Class 11 Trigonometric Functions with animations: radians, the unit circle, graphs, sum and difference formulae, multiple angles and trig equations.'
minutes: 95
updated: 2026-11-23
quiz:
  - q: '72° expressed in radians is:'
    choices: ['2π/5', 'π/5', '3π/5', '72π']
    ans: 0
    why: 'Multiply degrees by π/180: 72π/180 = 2π/5.'
  - q: 'sin 150° equals:'
    choices: ['1/2', '−1/2', '√3/2', '−√3/2']
    ans: 0
    why: '150° is in quadrant II with reference angle 30°. Sine is positive there and sin 30° = 1/2.'
  - q: 'The general solution of sin x = 1/2 is:'
    choices: ['x = nπ + (−1)ⁿ π/6', 'x = nπ ± π/6', 'x = 2nπ ± π/3', 'x = nπ + π/6']
    ans: 0
    why: 'The two solutions in one turn are π/6 and 5π/6, and both are given by nπ + (−1)ⁿ π/6 (n = 0 gives π/6, n = 1 gives 5π/6).'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 3 “Trigonometric Functions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard trigonometry (e.g. Gelfand, I. M. and Saul, M., Trigonometry, Birkhäuser); exact values and every number in the figures were recomputed in code.'
---

**Maths · Class 11 · Chapter 3 · about 95 minutes.** By the end you will be able to measure angles in radians, define sin, cos, tan and the other three on the unit circle, read their signs, domains, ranges and graphs, use the sum, difference and multiple-angle formulae, and solve simple trigonometric equations with general solutions.

<div class="bigidea">Imagine a point going round a circle of radius 1. Its height is the sine of the angle it has turned through, and its sideways position is the cosine. Every formula in this chapter is a fact about that one moving point: how high it is, how far across, and how it behaves when you turn it a bit more. Because circles repeat, trigonometric functions repeat too.</div>

## 1. Angles: degrees and radians

You already measure a turn in **degrees**: one full turn is 360°. Mathematicians prefer **radians**, because they make the formulae simpler. A **radian** is the angle at the centre of a circle that cuts off an arc exactly as long as the radius. Lay the radius along the circle like a bit of string: one string length of arc is 1 radian. Since the circumference is `$2\pi r$`, a full turn holds `$2\pi \approx 6.28$` radians.

```math
2\pi \text{ rad} = 360^\circ \qquad \pi \text{ rad} = 180^\circ \qquad 1 \text{ rad} = \frac{180^\circ}{\pi} \approx 57.3^\circ
```

To change degrees to radians multiply by `$\pi/180$`; to go back multiply by `$180/\pi$`. Slide the angle below and see how many radius-lengths of arc it contains; change the radius to see that the arc length is always `$s = r\theta$`.

<figure class="fig" data-fig="c11m-trig-angle"><figcaption>The angle θ in radians is the number of radius-lengths of arc it cuts off. Each colour change is one radius. The arc length is s = rθ, valid only when θ is in radians.</figcaption></figure>

<div class="meaning">
<dl>
<dt>`$\theta$`</dt><dd>the angle at the centre, in radians.</dd>
<dt>`$r$`</dt><dd>the radius of the circle.</dd>
<dt>`$s = r\theta$`</dt><dd>the length of the arc that the angle cuts off. It only works when `$\theta$` is in radians.</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-trig-radians"></div>

<div class="problem" data-problem="c11m-trig-arc"></div>

<div class="problem" data-problem="c11m-trig-wheel"></div>

Try converting your own angles in the [Radian ruler](/learn/radian-ruler/).

## 2. Trigonometric functions on the unit circle

Draw a circle of radius 1 centred at the origin (the **unit circle**). Start at the point (1, 0) and turn anticlockwise through an angle `$\theta$`. The point you arrive at is `$(\cos\theta,\ \sin\theta)$`: its x-coordinate is the **cosine** and its y-coordinate is the **sine**. This works for every angle, even bigger than a full turn or negative (clockwise).

The other four functions come from these two:

```math
\tan\theta = \frac{\sin\theta}{\cos\theta},\quad \cot\theta = \frac{\cos\theta}{\sin\theta},\quad \sec\theta = \frac{1}{\cos\theta},\quad \csc\theta = \frac{1}{\sin\theta}
```

Because the point is on a circle of radius 1, `$x^2 + y^2 = 1$`, giving the basic identity `$\sin^2\theta + \cos^2\theta = 1$`. Dividing by `$\cos^2\theta$` gives `$1 + \tan^2\theta = \sec^2\theta$`, and dividing by `$\sin^2\theta$` gives `$1 + \cot^2\theta = \csc^2\theta$`.

Turn the point (or press play) and watch the graphs of sine and cosine being drawn from the height and the sideways position:

<figure class="fig" data-fig="c11m-trig-circle"><figcaption>The point (cos θ, sin θ) moves round the unit circle. Its height traces the sine graph, its sideways position the cosine graph. Both always stay between −1 and 1.</figcaption></figure>

<!--fig:tool unit-circle-->

### 2.1 Signs in the four quadrants

The x-axis and y-axis cut the plane into four **quadrants**. Sine is the height, so it is positive above the x-axis (quadrants I and II); cosine is the sideways position, so it is positive to the right of the y-axis (I and IV). Tangent is sine over cosine, so it is positive when they have the same sign (I and III). A memory aid: **A**ll **S**ilver **T**ea **C**ups, going anticlockwise from quadrant I: **A**ll positive in I, **S**in in II, **T**an in III, **C**os in IV.

<figure class="fig" data-fig="c11m-trig-quadrants"><figcaption>Slide θ and see which quadrant the point is in and which ratios are positive there (A S T C).</figcaption></figure>

The functions repeat: since turning a full circle brings the point back, `$\sin(\theta + 2\pi) = \sin\theta$` and `$\cos(\theta + 2\pi) = \cos\theta$`. Turning clockwise gives `$\sin(-\theta) = -\sin\theta$` (sine is **odd**) and `$\cos(-\theta) = \cos\theta$` (cosine is **even**).

## 3. Exact values and reference angles

The angles 0°, 30°, 45°, 60° and 90° have exact values that you should know. The pattern for sine is `$\frac{\sqrt0}{2},\frac{\sqrt1}{2},\frac{\sqrt2}{2},\frac{\sqrt3}{2},\frac{\sqrt4}{2}$`, and cosine runs the same list backwards. Choose an angle to see it in a right triangle with hypotenuse 1.

<figure class="fig" data-fig="c11m-trig-special"><figcaption>A right triangle with hypotenuse 1: the side opposite the angle is sin, the side next to it is cos. The table shows all five exact angles; tangent is sin ÷ cos.</figcaption></figure>

For any other angle use its **reference angle**, the acute angle it makes with the x-axis, then fix the sign by the quadrant. For example `$\sin 150°$`: quadrant II, reference angle 30°, sine positive, so `$\sin 150° = \tfrac12$`. And `$\cos 240°$`: quadrant III, reference 60°, cosine negative, so `$-\tfrac12$`.

<div class="problem" data-problem="c11m-trig-value"></div>

<div class="myth">

**"tan 90° = 0" or "tan 90° = ∞".** Neither is quite right: `$\tan 90° = \sin 90° / \cos 90° = 1/0$`, which is **not defined**. The graph of tangent has a vertical asymptote there.

</div>

## 4. Domain, range and graphs

Since sin and cos are the coordinates of a point on the unit circle, their outputs lie in `$[-1, 1]$` for every real angle. The graphs of all six functions are below, with the domain, range and period listed. A function with period `$p$` repeats every `$p$`.

<figure class="fig" data-fig="c11m-trig-graphs"><figcaption>The six trigonometric functions from −2π to 2π. Dashed lines are asymptotes where the function is not defined. Slide x to read a value.</figcaption></figure>

| function | domain | range | period |
|---|---|---|---|
| sin x, cos x | all real x | [−1, 1] | 2π |
| tan x | x ≠ (2n+1)π/2 | all real | π |
| cot x | x ≠ nπ | all real | π |
| sec x | x ≠ (2n+1)π/2 | y ≤ −1 or y ≥ 1 | 2π |
| cosec x | x ≠ nπ | y ≤ −1 or y ≥ 1 | 2π |

## 5. Sum and difference of angles

Here is the central result of the chapter, and the figure derives it. Two points on the unit circle at angles A and B are some distance apart. Rotate both by −B: the distance cannot change, but now one point sits at (1, 0) and the other at angle A − B. Computing the distance in both pictures gives the formula.

<div class="steps" data-fig="c11m-trig-compound">
<div class="step">P = (cos A, sin A) and Q = (cos B, sin B). The orange chord PQ is their distance.</div>
<div class="step">Distance formula: PQ² = (cos A − cos B)² + (sin A − sin B)² = 2 − 2(cos A cos B + sin A sin B).</div>
<div class="step">Turn the picture by −B. Q lands on (1, 0) and P on (cos(A−B), sin(A−B)). A turn does not change lengths.</div>
<div class="step">New distance: P′Q′² = (cos(A−B) − 1)² + sin²(A−B) = 2 − 2cos(A−B).</div>
<div class="step">Both are the same chord, so cos(A − B) = cos A cos B + sin A sin B.</div>
<div class="step">Put −B for B: cos(A + B) = cos A cos B − sin A sin B. Then sin(A + B) = cos(90° − A − B) gives sin A cos B + cos A sin B.</div>
</div>

The family of formulae:

```math
\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B,\qquad \cos(A \pm B) = \cos A\cos B \mp \sin A\sin B
```

```math
\tan(A \pm B) = \frac{\tan A \pm \tan B}{1 \mp \tan A\tan B}
```

Use them to get angles like 75° and 15°: `$\sin 75° = \sin(45° + 30°) = \tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt3}{2} + \tfrac{\sqrt2}{2}\cdot\tfrac12 = \tfrac{\sqrt6 + \sqrt2}{4}$`.

<!--fig:tool compound-angle-->

<div class="problem" data-problem="c11m-trig-compound"></div>

<div class="myth">

**"sin(A + B) = sin A + sin B."** Test it with A = B = 30°: the left side is sin 60° = 0.866, the right side is 1/2 + 1/2 = 1. The formula has the mixed products `$\sin A\cos B + \cos A\sin B$`; there is no shortcut.

</div>

### 5.1 Double and triple angles

Putting `$B = A$` in the formulae gives the **double-angle** results (use `$\theta$` for the angle):

```math
\sin 2\theta = 2\sin\theta\cos\theta,\qquad \cos 2\theta = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta
```

```math
\tan 2\theta = \frac{2\tan\theta}{1 - \tan^2\theta},\qquad \sin 3\theta = 3\sin\theta - 4\sin^3\theta,\qquad \cos 3\theta = 4\cos^3\theta - 3\cos\theta
```

An **identity** is true for every angle, so the graphs of its two sides lie on top of each other. Test some below, including two false "identities" that people often guess.

<figure class="fig" data-fig="c11m-trig-identity"><figcaption>Pick an identity: the thick blue curve (left side) is hidden by the orange one (right side) when it is true. The two ✗ cases come apart.</figcaption></figure>

<div class="problem" data-problem="c11m-trig-double"></div>

## 6. Trigonometric equations

An equation like `$\sin x = \tfrac12$` is true only for certain angles. On the graph those are the places where the horizontal line `$y = \tfrac12$` crosses the curve. Because the curve repeats, there are infinitely many, and we describe them all with a **general solution**. The three basic forms (with `$\alpha$` the principal value) are:

```math
\sin x = \sin\alpha \Rightarrow x = n\pi + (-1)^n\alpha,\qquad \cos x = \cos\alpha \Rightarrow x = 2n\pi \pm \alpha,\qquad \tan x = \tan\alpha \Rightarrow x = n\pi + \alpha
```

Here `$n$` is any integer. Drag the horizontal line (change k) and switch between sin, cos and tan:

<figure class="fig" data-fig="c11m-trig-equations"><figcaption>The solutions of sin x = k (or cos, tan) are the crossings of the line y = k with the graph. For |k| greater than 1 the sine and cosine graphs are never reached.</figcaption></figure>

The next player shows where the general solution of `$\sin\theta = \tfrac12$` comes from on the unit circle.

<div class="steps" data-fig="c11m-trig-gensol">
<div class="step">sin θ is the height of the point on the unit circle. We want every point at height 1/2.</div>
<div class="step">Draw the horizontal line y = 1/2. Every crossing with the circle is a solution.</div>
<div class="step">It crosses twice: θ = π/6 (30°) and θ = π − π/6 = 5π/6 (150°), the solutions in one turn.</div>
<div class="step">After a full turn we land on the same points again, so add any whole number of turns, 2nπ.</div>
<div class="step">General solution: θ = π/6 + 2nπ or θ = 5π/6 + 2nπ, n any integer. Check n = 1: 13π/6 = 390°, and sin 390° = 1/2.</div>
<div class="step">One formula for both families: θ = nπ + (−1)ⁿ·π/6. It gives π/6, 5π/6, 13π/6, 17π/6, ... as n = 0, 1, 2, 3, ...</div>
</div>

<div class="problem" data-problem="c11m-trig-smallest"></div>

<div class="myth">

**Calculator answers are only one of the solutions.** Pressing sin⁻¹(1/2) gives just 30°. The equation has infinitely many answers; the calculator gives the principal value, and you must add the repeats yourself. Also, `$\sin x = 2$` has **no** solution, because sine never exceeds 1.

</div>

<div class="history">

- **c. 500 CE:** Aryabhata tabulates sine ("jya") values, and the Sanskrit word later becomes "sine" in Latin.
- **1737:** Leonhard Euler adopts π as the name of the circle constant, and it spreads from his books.
- **1748:** Euler defines the six trigonometric functions through the unit circle, the way you met them here.
- **Today:** sine waves carry your phone's radio signal, music and electricity from the grid.

</div>

<div class="keypoints">

- 180° = π rad; multiply degrees by π/180 for radians. Arc length s = rθ (θ in radians).
- On the unit circle the point at angle θ is (cos θ, sin θ); tan = sin/cos; sin² + cos² = 1.
- Signs: A S T C (All, Sin, Tan, Cos) going anticlockwise from quadrant I; sin is odd, cos is even.
- Exact values at 0°, 30°, 45°, 60°, 90°; other angles use the reference angle and the quadrant sign.
- sin and cos have range [−1, 1] and period 2π; tan and cot have period π; sec and cosec have |value| ≥ 1.
- cos(A − B) = cos A cos B + sin A sin B; sin(A + B) = sin A cos B + cos A sin B; sin 2θ = 2 sin θ cos θ.
- General solutions: sin x = sin α → nπ + (−1)ⁿα; cos x = cos α → 2nπ ± α; tan x = tan α → nπ + α.

</div>

Going further for JEE/NEET: [Trigonometry](/learn/courses/engineering-entrance/trigonometry/) and [Trigonometric equations and triangles](/learn/courses/engineering-entrance/trig-equations-triangles/) have the exam-level identities, conditional identities and equations.
