---
title: Limits
seoTitle: 'Limits: JEE maths'
summary: 'What a limit means, left and right limits and when a limit exists, the greatest integer and modulus functions, algebra of limits, factorising and rationalising, the standard trigonometric, exponential and logarithmic limits, limits at infinity, the squeeze rule for bounded functions, series expansions, and 1^∞, 0 × ∞ and ∞ − ∞ forms.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'The limit as x → 0 of sin 5x / x is:'
    choices: ['5', '1', '1/5', '0']
    ans: 0
    why: 'sin 5x / x = 5 × (sin 5x / 5x), and sin 5x / 5x → 1. So the limit is 5.'
  - q: 'The limit as x → 2 of (x² − 4)/(x − 2) is:'
    choices: ['4', '0', '2', 'it does not exist']
    ans: 0
    why: 'Factorise: (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2. As x → 2 this tends to 4. The function is undefined at 2, but the limit exists.'
  - q: 'The limit as x → 0 of [x] (greatest integer):'
    choices: ['does not exist', 'is 0', 'is −1', 'is 1']
    ans: 0
    why: 'Just right of 0, [x] = 0; just left of 0, [x] = −1. The left and right limits differ, so the limit does not exist.'
sources:
  - 'NCERT Mathematics Class 11 (Limits and derivatives): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Limit, continuity and differentiability'
---

**Maths · Class 11 · about 36 minutes.** By the end you will be able to decide when a limit exists, remove a 0/0 form by factorising, rationalising or the standard limits, handle limits at infinity and 1^∞ forms, and use series expansions for the harder JEE Advanced limits.

<div class="bigidea">A limit asks where a function is heading, not where it is. f(a) may be undefined, or even different, but if the values close in on one number L from both sides as x approaches a, then L is the limit. Almost all exam limits are 0/0 forms where the work is to cancel the part that is going to zero.</div>

## 1. What a limit means

We write `$\lim_{x\to a} f(x) = L$` when f(x) can be made as close to L as we like by taking x close enough to a, from either side, without x ever being equal to a.

Make the ε band narrower and find a δ that keeps the graph inside it; then switch to the jump.

<figure class="fig" data-fig="@math-epsilon-delta"><figcaption>Notice that a smaller ε needs a smaller δ, and that for the jump no δ works once ε is small, which is exactly why that limit does not exist.</figcaption></figure>

<div class="meaning">
<dl>
<dt>x → a</dt><dd>x gets closer and closer to a, but never equals it</dd>
<dt>LHL, RHL</dt><dd>left-hand limit (x → a⁻, from below) and right-hand limit (x → a⁺, from above)</dd>
<dt>L</dt><dd>the limit: the single value both sides approach</dd>
<dt>Indeterminate form</dt><dd>a shape like 0/0, ∞/∞, 1^∞, 0 × ∞ or ∞ − ∞ that does not tell you the answer by itself</dd>
<dt>Physical meaning</dt><dd>A limit is a prediction from nearby values. That is why calculus can talk about speed at an instant: distance over time is 0/0 at the instant, but the values just before and after close in on one number.</dd>
</dl>
</div>

The limit **exists** only if LHL and RHL both exist and are equal. Check both sides whenever the function changes its rule at a: greatest integer [x], fractional part {x}, modulus |x|, piecewise functions, and expressions like 1/x or e^{1/x} near 0.

<figure class="fig" data-fig="limit-zoom"><figcaption>Each function is undefined at x = 0 (open circle), yet the values at −h and +h close in on one number as h shrinks. Slide h towards 0 and watch the gap fall.</figcaption></figure>

**Greatest integer.** At an integer n, `$\lim_{x\to n^+}[x] = n$` but `$\lim_{x\to n^-}[x] = n - 1$`. At a non-integer, [x] is constant nearby and the limit is just its value.

## 2. Algebra of limits and the first methods

If both limits exist, the limit of a sum, difference, product or quotient (denominator limit not zero) is the sum, difference, product or quotient of the limits. If direct substitution gives a number, that is the answer. If it gives 0/0:

- **Factorise** and cancel the common factor (x − a). Useful: `$\lim_{x\to a}\dfrac{x^n - a^n}{x - a} = na^{n-1}$`.
- **Rationalise** when roots appear: multiply top and bottom by the conjugate, so `$\sqrt{x+4} - 2$` becomes `$x/(\sqrt{x+4} + 2)$`.
- **Substitute** x = a + h to move the limit to h → 0.

<div class="myth">

**"0/0 = 1, because anything divided by itself is 1."** 0/0 is not a number. The limits of x/x, 2x/x and x²/x as x → 0 are 1, 2 and 0: all 0/0 shapes, all different answers. The form tells you to do more work, not what the answer is.

</div>

## 3. The standard limits (as x → 0)

```math
\frac{\sin x}{x} \to 1, \quad \frac{\tan x}{x} \to 1, \quad \frac{1 - \cos x}{x^2} \to \frac12, \quad \frac{e^x - 1}{x} \to 1, \quad \frac{a^x - 1}{x} \to \ln a, \quad \frac{\ln(1+x)}{x} \to 1
```

```math
\lim_{x\to 0}(1 + x)^{1/x} = e, \qquad \lim_{x\to\infty}\left(1 + \frac1x\right)^x = e
```

The x inside must match the x outside. For `$\sin 3x / x$`, write it as `$3 \cdot \tfrac{\sin 3x}{3x} \to 3$`. The trigonometric limits need x in radians.

<div class="problem" data-problem="lim-std"></div>

**Why sin x / x → 1.** For a small angle x in a unit circle, the area of the small triangle, the sector and the big triangle give `$\sin x < x < \tan x$`. Divide by sin x and let x → 0: x/sin x is squeezed between 1 and 1/cos x, both tending to 1.

## 4. Limits at infinity

For a ratio of polynomials as x → ∞, divide top and bottom by the highest power of x in the denominator:

- same degree: the ratio of the leading coefficients;
- top degree lower: 0;
- top degree higher: ±∞ (the limit does not exist as a number).

For `$\sqrt{x^2 + x} - x$` (∞ − ∞), rationalise: it becomes `$x/(\sqrt{x^2+x} + x) \to 1/2$`. Remember that `$\sqrt{x^2} = |x|$`, so as x → −∞ it equals −x: the sign flips.

<div class="problem" data-problem="lim-inf"></div>

**Squeeze (sandwich) rule.** If g(x) ≤ f(x) ≤ h(x) near a and g and h have the same limit L, then f does too. Because |sin| ≤ 1, `$x\sin\tfrac1x \to 0$` as x → 0, and `$\tfrac{\sin x}{x} \to 0$` as x → ∞. A bounded factor times something going to zero goes to zero.

## 5. The 1^∞ form

If f → 1 and g → ∞, then

```math
\lim f(x)^{g(x)} = e^{\lim g(x)\,(f(x) - 1)}
```

**Worked example.** `$\lim_{x\to 0}(\cos x)^{1/x^2}$`. Here f − 1 = cos x − 1 and g = 1/x², so the exponent tends to `$\lim\tfrac{\cos x - 1}{x^2} = -\tfrac12$`. The limit is `$e^{-1/2}$`.

<div class="problem" data-problem="lim-oneinf"></div>

## 6. Series expansions (JEE Advanced)

When standard limits are not enough, replace each function by the first few terms of its series near 0:

```math
\sin x = x - \frac{x^3}{6} + \cdots, \quad \cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \cdots, \quad \tan x = x + \frac{x^3}{3} + \cdots
```

```math
e^x = 1 + x + \frac{x^2}{2} + \cdots, \quad \ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots, \quad (1+x)^n = 1 + nx + \frac{n(n-1)}{2}x^2 + \cdots
```

**Worked example.** `$\lim_{x\to 0}\dfrac{x - \sin x}{x^3}$`. Top = x − (x − x³/6 + …) = x³/6 + …, so the limit is **1/6**. Keep terms up to the power in the denominator, and no further.

**Finding constants.** If `$\lim_{x\to0}\dfrac{a\sin x + bx + x^3}{x^3}$` is finite, the x terms on top must cancel: a + b = 0. Then the top is −ax³/6 + x³ + …, so the limit is 1 − a/6. Questions of the "find a and b" type are all like this.

<div class="myth">

**"I can replace sin x by x everywhere, since sin x ≈ x."** Only when it is a factor of a product or quotient. In x − sin x the x terms cancel, and what is left (x³/6) is exactly the part the shortcut throws away. Use the series with enough terms whenever subtraction is involved.

</div>

<div class="keypoints">

- The limit exists only if LHL = RHL; check both at jumps ([x], {x}, |x|, piecewise, e^{1/x}).
- 0/0: factorise, rationalise, or use a standard limit with matching inner and outer x.
- sin x/x, tan x/x, (eˣ − 1)/x, ln(1 + x)/x → 1; (1 − cos x)/x² → 1/2; (aˣ − 1)/x → ln a.
- At infinity: divide by the highest power in the denominator; √(x²) = |x|.
- Squeeze: bounded × (something going to 0) → 0.
- 1^∞: e^(lim g(f − 1)). Series: keep terms up to the power in the denominator.

</div>
