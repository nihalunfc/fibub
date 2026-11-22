---
title: Continuity and differentiability
seoTitle: 'Continuity and differentiability: JEE maths'
summary: 'Continuity at a point and its three kinds of failure, functions with modulus and greatest integer, differentiability through left and right derivatives, counting points of non-differentiability, and every differentiation technique the exams use: chain rule, implicit, parametric, logarithmic, inverse trigonometric substitutions, the derivative of an inverse function, second derivatives and functional equations.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'f(x) = |x − 2| at x = 2 is:'
    choices: ['continuous and differentiable', 'continuous but not differentiable', 'not continuous', 'differentiable but not continuous']
    ans: 1
    why: 'The pieces meet (value 0 from both sides), but the left slope is −1 and the right slope is +1: a corner.'
  - q: 'If x = a cos t and y = a sin t, then dy/dx is:'
    choices: ['tan t', '−cot t', 'cot t', '−tan t']
    ans: 1
    why: 'dy/dt = a cos t, dx/dt = −a sin t, so dy/dx = a cos t ÷ (−a sin t) = −cot t.'
  - q: 'Which statement is always true?'
    choices: ['Continuous implies differentiable', 'Differentiable implies continuous', 'A function with a corner is discontinuous', 'Every polynomial has a corner somewhere']
    ans: 1
    why: 'If the derivative exists at a point, the function must be continuous there. The reverse fails: |x| is continuous at 0 but has no derivative there.'
sources:
  - 'NCERT Mathematics Class 12 (Continuity and differentiability): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Limit, continuity and differentiability'
---

**Maths · Class 12 · about 36 minutes.** By the end you will be able to test continuity and differentiability at any point, find constants that join pieces smoothly, count the corners of functions built from |x| and [x], and differentiate implicit, parametric and power-of-a-function expressions quickly and correctly.

<div class="bigidea">A continuous function can be drawn without lifting the pen. A differentiable function can also be drawn without any sharp turn: zoom in on any point and the graph looks like a straight line. Differentiable is the stronger condition, so every differentiable function is continuous, but a graph can be continuous and still have a corner.</div>

## 1. Continuity at a point

f is **continuous at x = a** when three things agree:

```math
\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = f(a)
```

That is: the left-hand limit (LHL), the right-hand limit (RHL) and the actual value are equal. There are three ways to fail:

| Type | What goes wrong | Example at x = 0 |
|---|---|---|
| Removable | LHL = RHL, but f(a) differs or is undefined | sin x / x, undefined at 0 |
| Jump (first kind) | LHL and RHL both exist but differ | [x], or x/\|x\| |
| Essential (second kind) | a one-sided limit does not exist | sin(1/x), 1/x |

Sums, products, quotients (where the denominator is not 0) and compositions of continuous functions are continuous. Polynomials, sin, cos, eˣ, and log x (for x > 0) are continuous everywhere on their domains.

**Greatest integer and modulus.** [x] jumps at every integer; [g(x)] can only jump where g(x) crosses an integer. |g(x)| is continuous wherever g is. To test [x] at an integer n, use [n − h] = n − 1 and [n + h] = n for small h > 0.

**Finding constants for continuity.** Set LHL = RHL = f(a) and solve. Example: f(x) = (x² − 9)/(x − 3) for x ≠ 3 and f(3) = k is continuous when k = lim (x + 3) = 6.

## 2. Differentiability

The derivative is the limit of the chord slope:

```math
f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}
```

<div class="meaning">
<dl>
<dt>h</dt><dd>a small step away from a, positive or negative</dd>
<dt>RHD</dt><dd>right-hand derivative: the limit with h → 0⁺, the slope as you arrive from the right</dd>
<dt>LHD</dt><dd>left-hand derivative: the limit with h → 0⁻ (equivalently [f(a) − f(a − h)]/h with h → 0⁺)</dd>
<dt>Physical meaning</dt><dd>f is differentiable at a when LHD and RHD exist, are finite and are equal: the curve has one clear direction there. Equal but infinite means a vertical tangent (like ∛x at 0), which is not differentiable.</dd>
</dl>
</div>

Watch the two chords in the figure as you shrink h:

<figure class="fig" data-fig="cd-corner"><figcaption>Left chord (to −h) and right chord (to +h) from the point at x = 0. Differentiable means both chord slopes settle on one finite number.</figcaption></figure>

<div class="myth">

**"If f′(x) has a formula that works on both sides, f is differentiable at the join."** First check that the pieces actually meet. A function with a jump can have equal slopes on both sides and still fail, because it is not even continuous. Continuity first, then the slopes.

</div>

**Joining two pieces smoothly.** For f = g(x) on x ≤ a and h(x) on x > a, differentiability at a needs **two** equations: g(a) = h(a) (continuity) and g′(a) = h′(a) (equal slopes, valid when both pieces are differentiable near a).

<div class="problem" data-problem="cd-constants"></div>

## 3. Counting points of non-differentiability

- |g(x)| has a corner at each **simple** root of g (where g crosses zero with nonzero slope). At a repeated root, like |x²| or |(x − 1)²|, there is no corner.
- `$|x|^3$`, x|x| and `$|x|\sin x$` are differentiable at 0: the extra factor that vanishes flattens the corner.
- **max and min of two functions** have corners where the graphs cross with different slopes.
- [g(x)] is discontinuous (so not differentiable) where g crosses an integer value, unless the jump is cancelled, as in (x − n)[x] at x = n, which is continuous but not differentiable there.
- **Product rule check**: f(x) = |x − a|·g(x) is differentiable at a exactly when g(a) = 0.

<div class="problem" data-problem="cd-kinks"></div>

## 4. Techniques of differentiation

**Chain rule.** `$\dfrac{d}{dx}f(g(x)) = f'(g(x))\,g'(x)$`: differentiate the outside, keep the inside, multiply by the derivative of the inside.

**Implicit differentiation.** When x and y are mixed, like x³ + y³ = 3axy, differentiate both sides with respect to x, writing dy/dx every time you differentiate something in y, then solve for dy/dx: `$\dfrac{dy}{dx} = \dfrac{ay - x^2}{y^2 - ax}$`.

**Parametric form.** If x = f(t) and y = g(t), then

```math
\frac{dy}{dx} = \frac{dy/dt}{dx/dt}, \qquad \frac{d^2y}{dx^2} = \frac{d}{dt}\left(\frac{dy}{dx}\right) \div \frac{dx}{dt}
```

<div class="problem" data-problem="cd-param"></div>

<div class="myth">

**"The second derivative in parametric form is (d²y/dt²) ÷ (d²x/dt²)."** It is not. Differentiate dy/dx with respect to t, then divide by dx/dt once more. For x = at², y = 2at: dy/dx = 1/t, so d²y/dx² = (−1/t²) ÷ (2at) = −1/(2at³).

</div>

**Logarithmic differentiation.** For y = f(x)^g(x), or long products and quotients, take log first: log y = g log f, so `$\dfrac{dy}{dx} = y\left(g'\log f + g\dfrac{f'}{f}\right)$`. Example: y = xˣ gives dy/dx = xˣ(1 + log x).

**Inverse trigonometric substitutions.** Before differentiating something like `$\tan^{-1}\dfrac{2x}{1-x^2}$`, put x = tan θ: it becomes 2θ = 2tan⁻¹x (for |x| < 1), with derivative 2/(1 + x²). Watch the range: for x > 1 the expression is 2tan⁻¹x − π, with the same derivative.

**Derivative of an inverse function.** If g is the inverse of f, then `$g'(y) = \dfrac{1}{f'(x)}$` where y = f(x). To find g′(5) when f(x) = x³ + x + 3, solve f(x) = 5 (x = 1), then g′(5) = 1/f′(1) = 1/4.

**Second derivatives.** Differentiate twice; in implicit questions substitute dy/dx back in. A classic: if y = sin⁻¹x, then (1 − x²)y″ − xy′ = 0.

## 5. JEE Advanced level: functional equations and limit-defined functions

**Functional equations.** If f(x + y) = f(x) + f(y) for all x, y and f′(0) = k, then putting y = h:

```math
f'(x) = \lim_{h \to 0}\frac{f(x+h) - f(x)}{h} = \lim_{h \to 0}\frac{f(h)}{h} = f'(0) = k
```

so f(x) = kx (since f(0) = 0). Similarly, f(x + y) = f(x)f(y) leads to f(x) = eᵏˣ, and f(xy) = f(x) + f(y) leads to f(x) = k log x. Always find f(0) or f(1) first by putting x = y = 0 or 1.

**Functions defined by a limit.** For example `$f(x) = \lim_{n\to\infty} \dfrac{x^{2n} - 1}{x^{2n} + 1}$` equals −1 for |x| < 1, 0 at |x| = 1 and 1 for |x| > 1. Work out the formula region by region first, then test continuity at the boundaries (here x = ±1, where it jumps).

Next: [Continuity and differentiability: question types and traps](/learn/courses/engineering-entrance/continuity-differentiability-questions/).

<div class="keypoints">

- Continuous at a: LHL = RHL = f(a). Failures are removable, jump or essential.
- Differentiable at a: LHD = RHD, both finite. Differentiable implies continuous, not the reverse.
- To join pieces smoothly, match values and slopes: two equations.
- |g(x)| has corners at simple roots of g; |x − a|g(x) is differentiable at a only if g(a) = 0.
- Parametric: dy/dx = (dy/dt)/(dx/dt); d²y/dx² = d/dt(dy/dx) ÷ dx/dt.
- Use logs for f^g and long products; use trig substitutions before differentiating inverse-trig expressions.
- f(x + y) = f(x) + f(y) with f′(0) = k gives f(x) = kx; find f(0) first.

</div>
