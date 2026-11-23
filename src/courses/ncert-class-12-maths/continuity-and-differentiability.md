---
title: Continuity and Differentiability
seoTitle: 'Continuity and Differentiability Class 12 notes'
summary: 'Class 12 Continuity and Differentiability with animations: continuity tests, chain, implicit, parametric and log derivatives, second derivatives, Rolle and MVT.'
minutes: 110
updated: 2026-11-23
quiz:
  - q: 'f(x) = x + 1 for x ≤ 1 and f(x) = 3x − 1 for x > 1. At x = 1, f is:'
    choices: ['continuous', 'discontinuous with a jump', 'discontinuous with a removable hole', 'not defined']
    ans: 0
    why: 'Left-hand limit 1 + 1 = 2, right-hand limit 3 − 1 = 2, and f(1) = 2. All three agree.'
  - q: 'The derivative of sin(x²) with respect to x is:'
    choices: ['2x cos(x²)', 'cos(x²)', '2x sin(x²)', 'cos(2x)']
    ans: 0
    why: 'Chain rule: the outer function sin u gives cos u, the inner u = x² gives 2x, so 2x cos(x²).'
  - q: 'If x = 2t and y = t², then dy/dx equals:'
    choices: ['t', '2t', 't/2', '1/t']
    ans: 0
    why: 'dy/dt = 2t and dx/dt = 2, so dy/dx = 2t/2 = t.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 5 “Continuity and Differentiability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Rolle, M. (1691) and Lagrange, J.-L. (1797) for the two theorems; standard real analysis, e.g. Rudin, Principles of Mathematical Analysis, chapter 5.'
  - 'Every worked example and live problem was recomputed by a numerical derivative (central difference) or a second method.'
---

**Maths · Class 12 · Chapter 5 · about 110 minutes.** By the end you will be able to test a function for continuity and differentiability, differentiate composite, implicit, inverse trigonometric, exponential, logarithmic, power-of-a-function and parametric functions, find second derivatives, and state and use Rolle’s theorem and the mean value theorem.

<div class="bigidea">A continuous function is one you can draw without lifting the pencil. A differentiable function is smoother still: it has a clear tangent everywhere, no sharp corners. Every rule in this chapter is the chain rule in a different costume: when one thing depends on a second thing which depends on a third, the rates of change multiply, like gears.</div>

## 1. Continuity at a point

Imagine walking along the Konkan Railway in the monsoon. At a washed-out bridge the track has a gap: you cannot go on. That gap is a **discontinuity**. A function `$f$` is **continuous at** `$x = a$` when three things agree:

1. `$f(a)$` is defined (the track exists at `$a$`);
2. the **left-hand limit** and the **right-hand limit** both exist and are equal (the two pieces of track approach the same spot);
3. that common limit equals `$f(a)$` (and the pieces actually meet there).

```math
\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = f(a)
```

<div class="meaning">

<dl>
<dt>`$x \to a^-$`</dt><dd>x approaches a from the left (values just below a).</dd>
<dt>`$x \to a^+$`</dt><dd>x approaches a from the right (values just above a).</dd>
<dt>`$\lim f(x)$`</dt><dd>the height the curve is heading to, whether or not the function actually takes that value.</dd>
<dt>Physical meaning</dt><dd>continuous means a small change in x gives only a small change in f(x): no sudden jumps in a temperature reading or a taxi fare meter.</dd>
</dl>

</div>

Zoom into a function near a point and watch both sides, then test your own with the figure below.

<!--fig:tool limit-zoom-->

In this figure the left branch always heads to 3 at x = 2. Move the right branch and the value `$f(2)$` and see which condition breaks.

<figure class="fig" data-fig="c12m-cont-test"><figcaption>Three things must agree at x = 2: the left limit, the right limit and f(2). A mismatch of the two sides is a jump; a missing or wrong f(2) with equal sides is a removable hole.</figcaption></figure>

### Kinds of discontinuity

See a hole being found and mended, one step at a time.

<div class="steps" data-fig="c12m-cont-holefix">
<div class="step">Take f(x) = (x² − 4)/(x − 2) for x ≠ 2. Its graph looks like a straight line.</div>
<div class="step">Try x = 2: the formula gives 0/0, which is not defined. So f(2) does not exist and the graph has no point at x = 2.</div>
<div class="step">Left-hand limit: for x just below 2 cancel (x − 2) from top and bottom, so f(x) = x + 2, which heads to 4.</div>
<div class="step">Right-hand limit: for x just above 2 it is also x + 2, which heads to 4.</div>
<div class="step">Both limits equal 4, but f(2) is missing. The graph has a single hole at (2, 4): a removable discontinuity.</div>
<div class="step">Define f(2) = 4. Now the left limit, right limit and value all equal 4, so f is continuous at 2.</div>
</div>

- **Removable:** the limit exists but `$f(a)$` is missing or different. A tiny hole. Example: `$\dfrac{x^2-4}{x-2}$` at `$x=2$` heads to 4 but is undefined there; define `$f(2)=4$` and the hole is mended.
- **Jump:** left and right limits both exist but differ (a step, like income-tax slabs or the “greatest integer” function at integers).
- **Infinite:** the function blows up (like `$1/x$` at 0).

Many board questions are “find `$k$` so that `$f$` is continuous”. Equate the two sides and solve for `$k$`.

<figure class="fig" data-fig="c12m-cont-findk"><figcaption>Slide k. When the left side at x = 2 reaches the height 5 that the right side is heading to, the gap closes and f is continuous. Solve 2k + 2 = 5 for k.</figcaption></figure>

<div class="problem" data-problem="c12m-cont-findk"></div>

**Algebra of continuous functions.** If `$f$` and `$g$` are continuous at `$a$` then so are `$f+g$`, `$f-g$`, `$fg$`, `$cf$`, and `$f/g$` (where `$g(a)\ne0$`). A composite `$f(g(x))$` is continuous if `$g$` is continuous at `$a$` and `$f$` is continuous at `$g(a)$`. Polynomials, `$\sin x$`, `$\cos x$`, `$e^x$` and `$|x|$` are continuous everywhere; rational functions are continuous wherever the denominator is not 0.

<div class="myth">

**“If the limit exists, the function is continuous.”** Not enough: `$f(a)$` must exist and equal the limit. The hole in `$\dfrac{x^2-4}{x-2}$` has a limit (4) at `$x = 2$` but the function is not continuous there because `$f(2)$` is not defined.

</div>

## 2. Differentiability

The **derivative** of `$f$` at `$a$` is the limit of the secant slope as the gap `$h$` shrinks:

```math
f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}
```

The limit has to be the **same from both sides**. The next figure draws the secant from the right and from the left. For `$|x|$` at 0 they settle on different slopes (+1 and −1): a sharp corner, so no derivative. For `$x^{1/3}$` at 0 the slope grows without limit (a vertical tangent), so again no derivative.

<figure class="fig" data-fig="c12m-cont-diff"><figcaption>Choose a function and a point. The dashed lines are the secant to the right (one colour) and to the left (the other). Shrink the gap h and see whether the two slopes agree.</figcaption></figure>

A shared figure shows one secant turning into the tangent as the gap closes, and the slope against `$h$`.

<figure class="fig" data-fig="@math-secant-tangent"><figcaption>A secant turns into the tangent as h shrinks. The corner case |x| shows why the two sides must agree.</figcaption></figure>

**Differentiable implies continuous, but not the other way round.** If `$f'(a)$` exists, `$f$` must be continuous at `$a$` (a function with a gap has no tangent there). But `$|x|$` is continuous at 0 and not differentiable there: a corner is continuous but not smooth. Like a road with no breaks (continuous) that still turns a sharp corner (not differentiable).

<div class="myth">

**“Continuous means differentiable.”** The reverse of the true rule. Differentiable ⇒ continuous, but a continuous graph can have corners (`$|x|$` at 0) where no tangent exists.

</div>

## 3. The chain rule

If `$y = f(u)$` and `$u = g(x)$`, then y depends on x through u, and

```math
\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}
```

Think of two gears on a cycle: one turn of the pedal turns the chainwheel by a ratio, and that turns the rear wheel by another ratio. The total ratio is the product. For `$y = (2x+1)^3$` let `$u = 2x+1$`: `$dy/du = 3u^2$`, `$du/dx = 2$`, so `$dy/dx = 6(2x+1)^2$`.

<figure class="fig" data-fig="c12m-cont-chain"><figcaption>Two machines in a row. Choose a function and slide x: each machine has its own rate (gear ratio) and the rate of the whole is their product, which matches a direct numerical derivative.</figcaption></figure>

Try your own chain on the gear tool, where you can add a third link.

<!--fig:tool chain-rule-->

<div class="problem" data-problem="c12m-cont-chain"></div>

You will also find [Derivative steps](/learn/derivative-steps/) useful to check each step of a long derivative, and [Derivative slope](/learn/derivative-slope/) to see a slope turn into a derivative.

Standard results you should know by heart:

| function | derivative |
|---|---|
| `$x^n$` | `$nx^{n-1}$` |
| `$\sin x$`, `$\cos x$` | `$\cos x$`, `$-\sin x$` |
| `$\tan x$` | `$\sec^2 x$` |
| `$e^x$` | `$e^x$` |
| `$a^x$` | `$a^x \ln a$` |
| `$\ln x$` | `$1/x$` |

## 4. Implicit functions

Sometimes y is tied to x by an equation in which you cannot easily solve for y, such as `$x^2 + y^2 = 25$`. Do not solve. Differentiate **both sides with respect to x**, remembering that `$y$` depends on `$x$`, so a term like `$y^2$` gives `$2y\,\dfrac{dy}{dx}$` by the chain rule. Then collect the `$dy/dx$` terms and solve.

For the circle: `$2x + 2y\,\dfrac{dy}{dx} = 0$`, so `$\dfrac{dy}{dx} = -\dfrac{x}{y}$`. The tangent at a point is perpendicular to the radius.

<div class="steps" data-fig="c12m-cont-implsteps">
<div class="step">The equation of the circle is x² + y² = 25. We want the slope of the tangent at the point (3, 4) without solving for y.</div>
<div class="step">Differentiate every term of both sides with respect to x.</div>
<div class="step">d/dx(x²) = 2x. For y², y depends on x, so the chain rule gives 2y·(dy/dx). The right side 25 is a constant, so its derivative is 0.</div>
<div class="step">Solve for dy/dx: 2y(dy/dx) = −2x, so dy/dx = −x/y.</div>
<div class="step">Only now substitute the point (3, 4): dy/dx = −3/4. The tangent in the picture has that slope.</div>
</div>

<figure class="fig" data-fig="c12m-cont-implicit"><figcaption>Slide the point round a circle, an ellipse or the curve xy = 6. The tangent turns with the slope that implicit differentiation gives, and is vertical where y = 0 on the circle.</figcaption></figure>

<div class="problem" data-problem="c12m-cont-implicit"></div>

## 5. Derivatives of inverse trigonometric functions

For an inverse function the slopes are reciprocals: mirror a curve in the line `$y = x$` and every tangent of slope `$m$` becomes a tangent of slope `$1/m$`. For `$y = \sin^{-1}x$`: `$x = \sin y$`, so `$1 = \cos y\,\dfrac{dy}{dx}$`, so

```math
\frac{d}{dx}\sin^{-1}x = \frac{1}{\sqrt{1-x^2}}, \quad |x| < 1
```

<figure class="fig" data-fig="c12m-cont-invtrig"><figcaption>The arcsine curve and its mirror image, the sine curve, with their tangents. The two slopes multiply to 1. Near x = 1 the sine curve goes flat, so arcsine becomes steeper and steeper.</figcaption></figure>

The others follow the same way:

```math
\frac{d}{dx}\cos^{-1}x = \frac{-1}{\sqrt{1-x^2}}, \quad \frac{d}{dx}\tan^{-1}x = \frac{1}{1+x^2}, \quad \frac{d}{dx}\cot^{-1}x = \frac{-1}{1+x^2}
```

```math
\frac{d}{dx}\sec^{-1}x = \frac{1}{|x|\sqrt{x^2-1}}, \quad \frac{d}{dx}\operatorname{cosec}^{-1}x = \frac{-1}{|x|\sqrt{x^2-1}}
```

## 6. Exponential and logarithmic functions

The number `$e \approx 2.718$` is the one base for which `$a^x$` has slope equal to its own height: `$\dfrac{d}{dx}e^x = e^x$`. That is why it describes anything whose growth is proportional to its size, like a bank balance or a virus count. Its inverse `$\ln x$` has derivative `$1/x$` (from the reciprocal-slope idea above). For other bases, `$\dfrac{d}{dx}a^x = a^x\ln a$`.

Watch the slope-to-height ratio stay constant for any base, and see the special base e.

<!--fig:tool e-and-ln-->

Combine with the chain rule: `$\dfrac{d}{dx}e^{3x} = 3e^{3x}$`, `$\dfrac{d}{dx}\ln(x^2+1) = \dfrac{2x}{x^2+1}$`.

## 7. Logarithmic differentiation

When x sits in both the base and the exponent, as in `$x^x$`, or when a product or quotient has many factors, take `$\ln$` of both sides first. Logarithms turn powers into multiples and products into sums, so differentiation becomes easy.

<div class="steps" data-fig="c12m-cont-logdiff">
<div class="step">We want the derivative of y = xˣ for x > 0. The power rule (x to a fixed power) and the exponential rule (a fixed base to the power x) both fail, because x is in both places.</div>
<div class="step">Take natural logarithms of both sides: ln y = ln(xˣ) = x ln x.</div>
<div class="step">Differentiate both sides with respect to x. On the left, d/dx(ln y) = (1/y)·y′ by the chain rule. On the right use the product rule on x · ln x.</div>
<div class="step">That gives (1/y)·y′ = 1·ln x + x·(1/x) = ln x + 1.</div>
<div class="step">Multiply by y = xˣ: y′ = xˣ(ln x + 1). At x = 2 the slope is 4(ln 2 + 1) ≈ 6.77, which matches the tangent drawn.</div>
</div>

<div class="problem" data-problem="c12m-cont-logdiff"></div>

The same plan works for `$y = (\sin x)^x$`, `$y = x^{\sin x}$` and for `$y = \dfrac{(x+1)^3\sqrt{x-2}}{(x+3)^2}$`, where `$\ln y$` splits the big fraction into small pieces.

## 8. Derivatives of functions in parametric form

Sometimes both `$x$` and `$y$` are given through a third variable `$t$`: `$x = f(t)$`, `$y = g(t)$`. A cricket ball’s position is `$(x(t), y(t))$` at time `$t$`. Then, by the chain rule,

```math
\frac{dy}{dx} = \frac{dy/dt}{dx/dt}, \qquad \frac{dx}{dt} \ne 0
```

<figure class="fig" data-fig="c12m-cont-param"><figcaption>A point moves on a circle or on a cycloid (the path of a pebble stuck in a wheel’s tyre). The tangent slope is (dy/dt)/(dx/dt). Press play.</figcaption></figure>

<div class="problem" data-problem="c12m-cont-param"></div>

## 9. Second-order derivatives

The derivative of `$f'$` is the **second derivative** `$f''(x) = \dfrac{d^2y}{dx^2}$`. It tells how fast the slope itself is changing. Think of a car: the first derivative of position is speed, the second is acceleration. For `$y = 2x^3 + 3x^2$`: `$y' = 6x^2 + 6x$`, `$y'' = 12x + 6$`.

For a parametric curve, find `$\dfrac{dy}{dx}$` first, then differentiate it with respect to `$t$` and divide again by `$dx/dt$`: `$\dfrac{d^2y}{dx^2} = \dfrac{d}{dt}\!\left(\dfrac{dy}{dx}\right)\Big/\dfrac{dx}{dt}$`. For the second derivative of an implicit function, differentiate `$dy/dx$` again and replace `$dy/dx$` by its value.

<div class="problem" data-problem="c12m-cont-second"></div>

## 10. Rolle’s theorem and the mean value theorem

**Mean value theorem (MVT).** If `$f$` is continuous on `$[a, b]$` and differentiable on `$(a, b)$`, there is at least one `$c$` in `$(a, b)$` with

```math
f'(c) = \frac{f(b) - f(a)}{b - a}
```

In words: somewhere in the journey you must have been moving at exactly your **average speed**. A highway speed camera uses this: if you cover 120 km in 1 hour between two toll plazas, at some moment you were doing exactly 120 km/h, even if the speedometer was never looked at. Geometrically, some tangent is parallel to the chord.

**Rolle’s theorem** is the special case `$f(a) = f(b)$`: the chord is flat, so some tangent is horizontal, `$f'(c) = 0$`.

<figure class="fig" data-fig="c12m-cont-mvt"><figcaption>Move a and b. The solid chord joins the ends; the dashed tangents are parallel to it at the points c the theorem promises. When f(a) = f(b) this is Rolle’s theorem.</figcaption></figure>

Both conditions matter: `$|x|$` on `$[-1, 1]$` has `$f(-1) = f(1)$` but no horizontal tangent, because it is not differentiable at 0.

<div class="problem" data-problem="c12m-cont-mvt"></div>

<div class="history">

**Timeline**

<ul class="timeline">
<li><b>1665 and 1675</b> Newton (1665) and Leibniz (1675) independently invent the derivative.</li>
<li><b>1691</b> Michel Rolle states the result that bears his name, for polynomials.</li>
<li><b>1797</b> Joseph-Louis Lagrange gives the mean value theorem in the form you use.</li>
<li><b>1821</b> Augustin-Louis Cauchy defines continuity and the derivative with limits.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** The Cauchy mean value theorem, L’Hôpital’s rule and the formal epsilon-delta definition of a limit are university topics. The picture behind the epsilon-delta game is in the shared figure below. Check the current CBSE syllabus for what is asked this year.

</div>

<figure class="fig" data-fig="@math-epsilon-delta"><figcaption>The epsilon-delta game behind the word “limit”: for every band you ask for, a small enough interval around a works.</figcaption></figure>

<div class="keypoints">

- Continuous at `$a$`: `$\lim_{x\to a^-}f = \lim_{x\to a^+}f = f(a)$`. Kinds of discontinuity: removable, jump, infinite.
- Differentiable at `$a$`: left and right derivatives exist and are equal. Differentiable ⇒ continuous; the converse is false (`$|x|$` at 0).
- Chain rule: `$\dfrac{dy}{dx} = \dfrac{dy}{du}\dfrac{du}{dx}$`. Implicit: differentiate both sides, `$y^2 \to 2y\,y'$`. Parametric: `$\dfrac{dy}{dx} = \dfrac{dy/dt}{dx/dt}$`.
- `$(\sin^{-1}x)' = \dfrac{1}{\sqrt{1-x^2}}$`, `$(\tan^{-1}x)' = \dfrac{1}{1+x^2}$`, `$(e^x)' = e^x$`, `$(a^x)' = a^x\ln a$`, `$(\ln x)' = 1/x$`.
- Logarithmic differentiation for `$x^x$`: take `$\ln$` first, `$y' = x^x(\ln x + 1)$`.
- Second derivative `$\dfrac{d^2y}{dx^2}$`: differentiate twice. Rolle: `$f(a) = f(b) \Rightarrow f'(c) = 0$`. MVT: `$f'(c) = \dfrac{f(b)-f(a)}{b-a}$`.

</div>

Going further for JEE/NEET: limits, standard expansions, higher-order and Leibniz-style derivatives and trickier continuity and differentiability tests are in [Limits (JEE)](/learn/courses/engineering-entrance/limits/) and [Continuity and differentiability (JEE)](/learn/courses/engineering-entrance/continuity-differentiability/).
