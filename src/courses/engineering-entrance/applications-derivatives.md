---
title: Applications of derivatives
seoTitle: 'Applications of derivatives: JEE maths'
summary: 'Rate of change and related rates, tangents and normals (with angle between curves, subtangent and subnormal), increasing and decreasing functions with parameters, local and global maxima and minima by the first and second derivative tests, optimisation, approximation by differentials, Rolle and mean value theorems, and counting real roots or proving inequalities with calculus.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The slope of the tangent to y = x³ at x = 2 is:'
    choices: ['6', '8', '12', '4']
    ans: 2
    why: 'dy/dx = 3x² = 12 at x = 2.'
  - q: 'f(x) = x³ − 3x has a local minimum at:'
    choices: ['x = −1', 'x = 0', 'x = 1', 'x = 3']
    ans: 2
    why: 'f′ = 3x² − 3 = 0 at x = ±1. f″ = 6x is positive at x = 1 (minimum) and negative at x = −1 (maximum).'
  - q: 'The radius of a circle grows at 2 cm/s. How fast is its area growing when r = 5 cm?'
    choices: ['10π cm²/s', '20π cm²/s', '25π cm²/s', '4π cm²/s']
    ans: 1
    why: 'A = πr², so dA/dt = 2πr dr/dt = 2π × 5 × 2 = 20π cm²/s.'
sources:
  - 'NCERT Mathematics Class 12 (Application of derivatives): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Differential calculus (applications of derivatives)'
---

**Maths · Class 12 · about 38 minutes.** By the end you will be able to solve related-rates problems, write tangents and normals, find where a function rises and falls, locate maxima and minima, solve optimisation word problems, estimate small changes, and use calculus to count roots and prove inequalities.

<div class="bigidea">The derivative is a rate and a slope at the same time. As a rate it tells how fast one quantity changes when another does; as a slope it tells which way a graph is heading. Where the slope is zero the graph turns, and that is where the largest and smallest values hide.</div>

## 1. Rate of change and related rates

dy/dx is the rate of change of y per unit change of x. When several quantities change with time and are tied by an equation, **differentiate the equation with respect to t**, then put in the numbers. Put in the numbers only **after** differentiating, or the changing quantities turn into constants.

**Worked example.** A 13 m ladder slides down a wall; its foot moves away at 2 m/s. When the foot is 5 m out, the top is 12 m up. From x² + y² = 169: x dx/dt + y dy/dt = 0, so dy/dt = −(5 × 2)/12 = −5/6 m/s. The top falls at 5/6 m/s.

<div class="problem" data-problem="ad-ladder"></div>

Other classics: water filling a cone (use similar triangles to remove r before differentiating), a balloon's volume and surface, a person walking away from a lamp post (similar triangles for the shadow).

## 2. Tangents and normals

At the point (x₁, y₁) on y = f(x), with slope m = f′(x₁):

```math
\text{Tangent: } y - y_1 = m(x - x_1), \qquad \text{Normal: } y - y_1 = -\frac{1}{m}(x - x_1)
```

<div class="meaning">
<dl>
<dt>m</dt><dd>slope of the tangent, dy/dx at the point</dd>
<dt>Normal</dt><dd>the line through the point at right angles to the tangent, slope −1/m</dd>
<dt>Horizontal tangent</dt><dd>m = 0; vertical tangent when dx/dy = 0 (m is infinite)</dd>
<dt>Angle between curves</dt><dd>the angle between their tangents where they meet: tan θ = |(m₁ − m₂)/(1 + m₁m₂)|; they cut <b>orthogonally</b> when m₁m₂ = −1</dd>
<dt>Physical meaning</dt><dd>The tangent is the straight line that best copies the curve near the point; the normal points straight away from the curve.</dd>
</dl>
</div>

Lengths on the x-axis: the **subtangent** is |y₁/m| and the **subnormal** is |y₁m|. For a parabola y² = 4ax, the subnormal is always 2a.

**Tangent from an outside point.** Take the point of contact as (t, f(t)), write the tangent there, and make it pass through the given point; solve for t.

<div class="problem" data-problem="ad-tangent"></div>

## 3. Increasing and decreasing

f is increasing on an interval where f′(x) > 0 and decreasing where f′(x) < 0. (f′ ≥ 0 with equality only at isolated points still gives increasing: x³ is increasing everywhere though f′(0) = 0.) To find the intervals, solve f′(x) = 0, mark the points on a number line, and read the sign of f′ between them.

Slide the vertical line along f, f′ and f″ and read what each graph says about the one above it.

<figure class="fig" data-fig="@math-fdd-stack"><figcaption>Notice that f′ = 0 at the flat points of f, that f″ tells cup from cap there, and that an inflection is where f″ changes sign.</figcaption></figure>

**With a parameter.** "f(x) = x³ + kx² + 3x + 1 is increasing for all x" means f′ = 3x² + 2kx + 3 ≥ 0 for all x, so its discriminant ≤ 0: 4k² − 36 ≤ 0, giving −3 ≤ k ≤ 3.

## 4. Maxima and minima

A **critical point** is where f′ = 0 or f′ does not exist. Move the sliders and watch where the curve turns:

<figure class="fig" data-fig="ad-cubic"><figcaption>f(x) = x³ + ax² + bx + c with its tangent at x₀ (dashed), turning points and inflection (black). The lower strip is f′: f rises where f′ is above the axis.</figcaption></figure>

- **First derivative test.** If f′ changes from + to − at c, f has a local maximum; from − to +, a local minimum; no change, neither (a point of inflection like x³ at 0).
- **Second derivative test.** If f′(c) = 0 and f″(c) < 0, local maximum; f″(c) > 0, local minimum; f″(c) = 0, the test says nothing, so go back to the first test.
- **Global (absolute) extremes on [a, b].** Compare f at every critical point inside and at both ends. The largest is the global maximum.
- **Concavity.** f″ > 0: concave up (holds water); f″ < 0: concave down. A **point of inflection** is where concavity changes; for a cubic it is at x = −a/3 (coefficient of x³ being 1), exactly halfway between the turning points.

<div class="myth">

**"f′(c) = 0 means c is a maximum or a minimum."** f(x) = x³ has f′(0) = 0 but keeps rising through 0. And a maximum can occur where f′ does not exist at all, like −|x| at 0. Always check the sign change or use the second derivative.

</div>

## 5. Optimisation

<div class="steps">
<div class="step"><b>Name the quantity</b> to make largest or smallest, and draw a picture.</div>
<div class="step"><b>Write it in one variable</b>, using the given condition (fixed perimeter, fixed volume) to remove the others.</div>
<div class="step"><b>Find the allowed interval</b> for that variable (lengths positive, and so on).</div>
<div class="step"><b>Differentiate, set to zero</b>, and confirm the nature with f″ or by checking the ends of the interval.</div>
</div>

Results worth knowing: of all rectangles with a fixed perimeter, the square has the largest area. A cylinder of fixed volume with the least surface (with lids) has height = diameter. The largest cylinder inside a sphere of radius R has height 2R/√3. An open box from a square sheet of side a is largest when the cut-out squares have side a/6.

<div class="problem" data-problem="ad-box"></div>

## 6. Approximation and small changes

Near x, `$f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x$`. Example: √25.3 ≈ 5 + (1/(2 × 5)) × 0.3 = 5.03. For errors, the relative error in y = xⁿ is n times the relative error in x: a 1% error in the radius gives about a 3% error in a sphere's volume.

Step through, then drag the start x₀ and try a different equation.

<div class="steps" data-fig="@math-newton-steps">
<div class="step"><p><b>A first guess.</b> Pick x₀ and draw the tangent to the curve at that x.</p></div>
<div class="step"><p><b>The next guess.</b> The tangent meets the x-axis at x₁, which is usually closer to the root.</p></div>
<div class="step"><p><b>Repeat.</b> Draw the tangent at x₁; it meets the axis at x₂, closer still.</p></div>
<div class="step"><p><b>Fast.</b> After a few rounds the guesses agree to many digits: the error roughly squares each time.</p></div>
</div>

## 7. Mean value theorems

- **Rolle's theorem.** If f is continuous on [a, b], differentiable on (a, b) and f(a) = f(b), there is a c in (a, b) with f′(c) = 0: a horizontal tangent somewhere.
- **Lagrange's mean value theorem.** Under the first two conditions, there is c with `$f'(c) = \dfrac{f(b) - f(a)}{b - a}$`: somewhere the tangent is parallel to the chord.

## 8. JEE Advanced level: roots and inequalities

**Counting real roots.** Between two consecutive roots of f there is a root of f′ (Rolle). So if f′ has k real roots, f has at most k + 1. For a cubic with turning points at p and q, there are three real roots exactly when f(p) and f(q) have opposite signs. Slide c in the figure to see the count change.

**Inequalities by monotonicity.** To prove eˣ > 1 + x for x ≠ 0, let g(x) = eˣ − 1 − x. Then g(0) = 0 and g′(x) = eˣ − 1 is negative for x < 0 and positive for x > 0, so 0 is the least value of g. Similarly sin x < x for x > 0 and log(1 + x) < x.

**Comparing aᵇ and bᵃ.** Compare (log a)/a with (log b)/b. The function (log x)/x increases up to x = e and decreases after, so `$e^{\pi} > \pi^{e}$` (since e < π, e sits at the peak).

Next: [Applications of derivatives: question types and traps](/learn/courses/engineering-entrance/applications-derivatives-questions/).

<div class="keypoints">

- Related rates: differentiate the linking equation with respect to t first, substitute numbers after.
- Tangent slope m = f′(x₁); normal slope −1/m; curves are orthogonal when m₁m₂ = −1.
- Increasing where f′ > 0; "increasing for all x" for a quadratic f′ means its discriminant ≤ 0.
- Local max: f′ changes + to − (or f″ < 0); local min: − to + (or f″ > 0).
- Global extremes on [a, b]: compare critical points and both ends.
- Optimisation: one variable, its allowed interval, f′ = 0, confirm.
- f(x + Δx) ≈ f(x) + f′(x)Δx; percentage error in xⁿ is n times that in x.
- Cubic has three real roots when f(max) and f(min) have opposite signs.

</div>
