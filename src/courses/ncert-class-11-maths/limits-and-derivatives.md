---
title: Limits and Derivatives
seoTitle: 'Limits and Derivatives Class 11 notes and examples'
summary: 'Class 11 Limits and Derivatives with animations: left and right limits, limit rules, sin x / x, derivatives from first principles, product and quotient rules.'
minutes: 100
updated: 2026-11-23
quiz:
  - q: 'The limit of (x² − 25)/(x − 5) as x → 5 is:'
    choices: ['10', '0', '5', 'does not exist']
    ans: 0
    why: 'Substituting gives 0/0, so factorise: (x − 5)(x + 5)/(x − 5) = x + 5, which tends to 10.'
  - q: 'The limit of sin 4x / x as x → 0 is:'
    choices: ['4', '1', '1/4', '0']
    ans: 0
    why: 'sin 4x / x = 4 · sin 4x / (4x) and sin(u)/u → 1, so the limit is 4.'
  - q: 'The derivative of x³ at x = 2 is:'
    choices: ['12', '8', '6', '3']
    ans: 0
    why: 'd/dx (x³) = 3x², and 3 × 2² = 12.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 12 “Limits and Derivatives” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Newton, I. (c. 1666) and Leibniz, G. W. (1684) on the calculus; the standard limit sin x / x → 1 and the rules of limits and derivatives as in any first calculus text (e.g. Thomas, G. B., Calculus, Pearson). Every numerical example was recomputed in code.'
---

**Maths · Class 11 · Chapter 12 · about 100 minutes.** By the end you will be able to find limits of polynomials, fractions and simple trigonometric expressions, explain what a derivative is as the slope of a tangent or a rate of change, find it from first principles, and use the sum, product and quotient rules with the derivatives of polynomials, sine and cosine.

<div class="bigidea">Calculus rests on one new idea: what a quantity is heading for, even if it never gets there. A limit asks "as x creeps up on a, what does f(x) creep up on?" A derivative uses a limit to answer "how fast is f changing right now?" by shrinking a gap h towards zero. You will find that a derivative is just the slope of the tangent, and speed on a speedometer is a derivative.</div>

## 1. The idea of a limit

You are walking towards a lamp post. After 1 m you have gone half the remaining distance, after another half you have gone three-quarters, then seven-eighths. Your distance from the post keeps shrinking and is heading for zero. The idea of a **limit** is to describe where something is heading, without needing it to arrive.

Take `$f(x) = \dfrac{x^2 - 1}{x - 1}$`. At `$x = 1$` this is `$\dfrac{0}{0}$`: not defined, so the graph has a hole there. But for any `$x$` near 1 you can simplify: `$\dfrac{(x-1)(x+1)}{x-1} = x + 1$`. As `$x$` gets closer to 1 the value gets closer to 2. We write

```math
\lim_{x \to 1} \frac{x^2 - 1}{x - 1} = 2
```

and say "the limit as `$x$` tends to 1 is 2". Use the slider to bring two points in from the left (blue) and from the right (orange). Try the other functions too.

<figure class="fig" data-fig="c11m-lim-approach"><figcaption>Squeeze x in on a from both sides. If both sets of values close in on one number, that number is the limit; if not (|x|/x or 1/x), there is no limit.</figcaption></figure>

The key point: the limit looks only at values **near** `$a$`, never at `$a$` itself. The function may even be undefined at `$a$`, as here.

<!--fig:tool limit-zoom-->

## 2. Left and right limits

You can approach `$a$` from the left (`$x < a$`) or from the right (`$x > a$`). The **left-hand limit** `$\lim_{x \to a^-} f(x)$` and the **right-hand limit** `$\lim_{x \to a^+} f(x)$` may differ. The limit exists only when both exist and are equal.

Imagine a taxi fare that jumps from ₹50 to ₹70 the instant you cross 2 km. Just before 2 km you pay close to ₹50; just after, close to ₹70. There is no single value the fare is heading for at 2 km, so there is no limit there.

<figure class="fig" data-fig="c11m-lim-onesided"><figcaption>Four graphs around x = 2: a jump (the sides disagree, so no limit), a hole, a misplaced dot and a smooth join. Slide h to push the two dots towards 2.</figcaption></figure>

Notice the two lessons from the "hole" and the "dot moved" graphs: the limit does not care about the value of the function at `$a$`. A function is called **continuous** at `$a$` only if the limit exists and equals `$f(a)$`. (That idea is developed in Class 12.)

<div class="myth">

**"The limit is the value of the function at the point."** Only for smooth, well-behaved functions. In `$\dfrac{x^2-1}{x-1}$` the function has no value at `$x = 1$` but the limit is 2. In "dot moved" the value is 1 while the limit is 4. The limit is about the journey, not the destination.

</div>

## 3. Algebra of limits

When limits exist, they behave exactly as you hope. If `$\lim f = l$` and `$\lim g = m$` as `$x \to a$`:

- `$\lim (f + g) = l + m$` and `$\lim (f - g) = l - m$`
- `$\lim (f \cdot g) = l \cdot m$` and `$\lim (cf) = c\,l$` for a constant `$c$`
- `$\lim \dfrac{f}{g} = \dfrac{l}{m}$`, provided `$m \ne 0$`

For a **polynomial** `$p(x)$`, `$\lim_{x \to a} p(x) = p(a)$`: just substitute. For a **rational function** `$\dfrac{p(x)}{q(x)}$` do the same if `$q(a) \ne 0$`. For example, `$\lim_{x \to 2}(x^2 + 3x) = 4 + 6 = 10$`.

If substituting gives `$\dfrac{0}{0}$`, the fraction hides a common factor. **Cancel it first.** Another trick is to multiply by the conjugate to clear a square root. Step through both:

<div class="steps" data-fig="c11m-lim-factorsteps">
<div class="step">Find the limit as x → 3 of (x² − 9)/(x − 3). Substituting gives 0/0, so rewrite the fraction.</div>
<div class="step">Factorise the top: (x − 3)(x + 3)/(x − 3).</div>
<div class="step">For x near 3 but not equal to 3, cancel (x − 3): x + 3.</div>
<div class="step">Substitute x = 3: the limit is 6.</div>
<div class="step">Second trick: (√(1 + x) − 1)/x as x → 0 is 0/0. Multiply top and bottom by the conjugate √(1 + x) + 1.</div>
<div class="step">The top becomes (1 + x) − 1 = x, so x cancels: 1/(√(1 + x) + 1).</div>
<div class="step">Substitute x = 0: the limit is 1/2.</div>
</div>

<div class="problem" data-problem="c11m-lim-quad"></div>

**A useful pattern.** For any positive integer `$n$`:

```math
\lim_{x \to a} \frac{x^n - a^n}{x - a} = n\,a^{n-1}
```

You can see why for `$n = 3$`: `$x^3 - a^3 = (x - a)(x^2 + ax + a^2)$`, so after cancelling the limit is `$a^2 + a\cdot a + a^2 = 3a^2$`. This formula is the heart of differentiating powers.

<div class="problem" data-problem="c11m-lim-cube"></div>

## 4. Limits of trigonometric functions

The most important trigonometric limit (with `$x$` in **radians**) is

```math
\lim_{x \to 0} \frac{\sin x}{x} = 1
```

Why? On the unit circle, for a small positive angle `$x$`, the straight height `$\sin x$` is a little shorter than the arc `$x$`, which is shorter than the tangent length `$\tan x$`. So `$\sin x < x < \tan x$`. Divide by `$\sin x$`: `$1 < \dfrac{x}{\sin x} < \dfrac{1}{\cos x}$`. As `$x \to 0$`, `$\cos x \to 1$`, so `$\dfrac{x}{\sin x}$` is squeezed between 1 and a number tending to 1. Slide `$x$` towards 0 and watch the three lengths merge.

<figure class="fig" data-fig="c11m-lim-trig"><figcaption>The squeeze: sin x < x < tan x. As x shrinks, the three lengths become almost equal and sin x / x approaches 1.</figcaption></figure>

Two more facts follow: `$\lim_{x \to 0}\cos x = 1$` and `$\lim_{x \to 0}\dfrac{1 - \cos x}{x} = 0$`. To use the main limit with other numbers, adjust so that the same expression is inside the sine and underneath:

```math
\lim_{x \to 0} \frac{\sin kx}{x} = k, \qquad \lim_{x \to 0}\frac{\tan x}{x} = 1, \qquad \lim_{x \to 0}\frac{1 - \cos kx}{x^2} = \frac{k^2}{2}
```

<div class="meaning">
<dl>
<dt>`$\sin x / x \to 1$`</dt><dd>for small angles in radians, `$\sin x \approx x$`. This is why a pendulum swings so regularly for small angles.</dd>
<dt>`$k$`</dt><dd>in `$\sin kx / x$` write it as `$k \cdot \sin kx / (kx)$`, then the bracket tends to 1.</dd>
<dt>Degrees</dt><dd>the limit is 1 **only in radians**. In degrees it is `$\pi/180$`.</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-lim-sin"></div>

<div class="problem" data-problem="c11m-lim-cosq"></div>

## 5. Derivatives: how fast is it changing?

A car's odometer tells the distance and the speedometer tells how fast the distance is changing at this moment. Speed at an instant is a **derivative**. To compute it we cannot divide by a zero time, so we use a small gap `$h$`: the average speed over a short stretch from `$x$` to `$x + h$`, then let `$h$` shrink.

On a graph, the average rate of change over a gap is the slope of a **secant** (a line through two points of the curve). When the second point slides towards the first, the secant turns into the **tangent**, and its slope is the derivative.

<figure class="fig" data-fig="@math-secant-tangent"><figcaption>A secant turning into the tangent as the gap h shrinks. The secant slope is the difference quotient; its limit is the derivative.</figcaption></figure>

The **derivative of `$f$` at `$x$`** is defined by

```math
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
```

if the limit exists. It is the slope of the tangent to `$y = f(x)$` at `$x$`, and the instantaneous rate of change of `$f$`. Other notations are `$\dfrac{dy}{dx}$` and `$\dfrac{d}{dx}f(x)$`. Here is the definition at work for `$f(x) = x^2$`:

<div class="steps" data-fig="c11m-lim-firstprin">
<div class="step">Definition: f′(x) = lim (h → 0) [f(x + h) − f(x)] / h. Here f(x) = x².</div>
<div class="step">The difference quotient (the secant slope): [(x + h)² − x²] / h.</div>
<div class="step">Expand: (x² + 2xh + h² − x²) / h.</div>
<div class="step">The x² terms cancel; factor h from the top: h(2x + h) / h.</div>
<div class="step">Cancel h (allowed, since h is near 0 but not equal to 0): 2x + h.</div>
<div class="step">Let h → 0: f′(x) = 2x.</div>
<div class="step">Check: at x = 3 the tangent slope is 6; the secant from 3 to 3.001 has slope 6.001.</div>
</div>

<!--fig:tool derivative-steps-->

Slide the point along the curve below. The top graph shows the curve and its tangent; the bottom graph plots the slope itself. Notice that where the curve rises the slope is positive, where it falls the slope is negative, and at the top of a hill the slope is zero.

<figure class="fig" data-fig="c11m-lim-slope"><figcaption>f and its slope function f′. The dot on the lower graph is the slope of the tangent at the chosen point above.</figcaption></figure>

You can also try the [Derivative slope](/learn/derivative-slope/) tool for any function you like.

<div class="myth">

**"Differentiable means the curve has no gaps."** A curve with no gaps is continuous, but it can still have a sharp corner. `$f(x) = |x|$` has a corner at 0: the slope from the left is `$-1$` and from the right `$+1$`, so there is no single tangent and no derivative at 0. Every differentiable function is continuous, but not the other way round.

</div>

## 6. Rules and standard derivatives

Deriving everything from first principles would be tiring, so we use rules.

- **Constant:** `$\dfrac{d}{dx}(c) = 0$`. A flat line has slope 0.
- **Power rule:** `$\dfrac{d}{dx}(x^n) = n\,x^{n-1}$`. (This is the pattern from section 3 with `$a = x$`.)
- **Constant multiple and sum:** `$(cf)' = c f'$` and `$(f \pm g)' = f' \pm g'$`.
- **Sine and cosine:** `$\dfrac{d}{dx}(\sin x) = \cos x$` and `$\dfrac{d}{dx}(\cos x) = -\sin x$`.
- **Product rule:** `$(uv)' = u'v + uv'$`.
- **Quotient rule:** `$\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}$`, with `$v \ne 0$`.

For example, the slope of `$f(x) = 2x^3 - 5x^2 + 4x$` is `$f'(x) = 6x^2 - 10x + 4$`; at `$x = 1$` this is 0, a flat tangent. From these, `$\tan x$` and the others follow by the quotient rule: `$(\tan x)' = \sec^2 x$`.

<div class="problem" data-problem="c11m-lim-deriv"></div>

**Why the product rule has two terms.** Picture a rectangle whose sides are `$u$` and `$v$`. When `$x$` increases a little, `$u$` grows by `$\Delta u$` and `$v$` by `$\Delta v$`. The area gains two thin strips, `$v\,\Delta u$` and `$u\,\Delta v$`, plus a tiny corner `$\Delta u\,\Delta v$`. Dividing by `$\Delta x$` and shrinking it, the corner vanishes faster than the rest, leaving `$u'v + uv'$`.

<figure class="fig" data-fig="c11m-lim-product"><figcaption>The product rule as area: two strips and a tiny corner. As dx shrinks the corner can be ignored, leaving u′v + uv′.</figcaption></figure>

<div class="problem" data-problem="c11m-lim-product"></div>

**The quotient rule in action.** Differentiate `$\dfrac{x^2 + 1}{x - 1}$`. With `$u = x^2 + 1$` and `$v = x - 1$`: `$u' = 2x$`, `$v' = 1$`, so the derivative is `$\dfrac{2x(x - 1) - (x^2 + 1)}{(x-1)^2} = \dfrac{x^2 - 2x - 1}{(x-1)^2}$`. Be careful with the order on top: it is `$u'v - uv'$`, with the minus sign.

<div class="problem" data-problem="c11m-lim-quot"></div>

<div class="history">

- **c. 1666:** Isaac Newton develops his "fluxions", the rate of change of a flowing quantity (the derivative).
- **1684:** Gottfried Leibniz publishes his version, with the notation `$dy/dx$` that we still use.
- **1830s:** Cauchy gives the limit a careful definition, so that calculus rests on firm ground.
- **Today:** engineers use derivatives to design roads, rockets and recommendation systems.

</div>

<div class="keypoints">

- `$\lim_{x \to a} f(x) = L$` means `$f(x)$` heads for `$L$` as `$x$` nears `$a$` from both sides; it does not depend on `$f(a)$`.
- The limit exists only if the left-hand and right-hand limits are equal.
- Limits add, subtract, multiply and divide (denominator limit not 0); for polynomials just substitute; for 0/0, factorise or rationalise first.
- `$\lim \frac{x^n - a^n}{x - a} = n a^{n-1}$`; `$\lim_{x \to 0}\frac{\sin x}{x} = 1$` (radians); `$\lim_{x\to 0}\frac{1 - \cos x}{x} = 0$`.
- `$f'(x) = \lim_{h \to 0}\frac{f(x+h) - f(x)}{h}$` is the slope of the tangent and the instant rate of change.
- `$(x^n)' = nx^{n-1}$`, `$(\sin x)' = \cos x$`, `$(\cos x)' = -\sin x$`, `$(uv)' = u'v + uv'$`, `$(u/v)' = (u'v - uv')/v^2$`.
- Beyond the syllabus: limits of exponential and logarithmic functions, the chain rule and L'Hôpital's rule come in Class 12 or later.

</div>

Going further for JEE/NEET: [Limits](/learn/courses/engineering-entrance/limits/) and [Applications of derivatives](/learn/courses/engineering-entrance/applications-derivatives/) have the exam-level problems on indeterminate forms, tangents and maxima.
