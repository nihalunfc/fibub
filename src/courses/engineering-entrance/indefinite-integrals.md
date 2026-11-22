---
title: Indefinite integrals
seoTitle: 'Indefinite integrals: JEE maths'
summary: 'Antiderivatives and the constant of integration, the standard table, substitution, trigonometric integrals, the special forms with x² ± a², integration by parts (including eˣ[f + f′] and the ILATE order), partial fractions, and finding a function or a curve from its derivative and one point.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: '∫ 1/x dx equals:'
    choices: ['log x + C for all x ≠ 0', 'log|x| + C', '−1/x² + C', 'x⁰/0 + C']
    ans: 1
    why: 'The derivative of log|x| is 1/x on both sides of 0. log x alone only works for x > 0.'
  - q: '∫ eˣ(sin x + cos x) dx equals:'
    choices: ['eˣ sin x + C', 'eˣ cos x + C', 'eˣ(sin x − cos x) + C', '2eˣ sin x + C']
    ans: 0
    why: 'It has the form eˣ[f(x) + f′(x)] with f = sin x, whose integral is eˣ f(x) + C.'
  - q: 'If f′(x) = 2x and f(1) = 4, then f(2) is:'
    choices: ['4', '5', '7', '8']
    ans: 2
    why: 'f(x) = x² + C. f(1) = 1 + C = 4 gives C = 3, so f(2) = 4 + 3 = 7.'
sources:
  - 'NCERT Mathematics Class 12 (Integrals): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Integral calculus'
---

**Maths · Class 12 · about 36 minutes.** By the end you will be able to integrate the standard functions on sight, choose between substitution, parts and partial fractions, handle the x² ± a² family, and use one known value to pin down the constant.

<div class="bigidea">Integration is differentiation run backwards: given the slope at every point, rebuild the curve. The slope alone cannot tell you how high the curve sits, so the answer is a whole family of curves, F(x) + C, each a vertical copy of the others. One extra fact, a single point on the curve, picks out one member.</div>

## 1. Antiderivatives and the constant

F is an **antiderivative** of f if F′(x) = f(x). Then every antiderivative is F(x) + C, and we write `$\int f(x)\,dx = F(x) + C$`. Check any answer by differentiating it: you must get the integrand back.

<figure class="fig" data-fig="int-family"><figcaption>The dashes show the slope f(x) at each point. Each faint curve is F(x) + C for a different C; the bold one goes through the point you choose, which fixes C.</figcaption></figure>

**Finding f from f′.** Integrate, then use the given value: f′(x) = 6x² − 4x + 1 and f(0) = 2 give f(x) = 2x³ − 2x² + x + C, and C = 2. In motion, velocity is the integral of acceleration and position the integral of velocity, each with its own constant from the starting conditions.

## 2. The standard table

| f(x) | ∫ f(x) dx (add + C) |
|---|---|
| xⁿ (n ≠ −1) | xⁿ⁺¹/(n + 1) |
| 1/x | log\|x\| |
| eˣ, aˣ | eˣ, aˣ/log a |
| sin x, cos x | −cos x, sin x |
| sec²x, cosec²x | tan x, −cot x |
| sec x tan x, cosec x cot x | sec x, −cosec x |
| tan x, cot x | log\|sec x\|, log\|sin x\| |
| sec x | log\|sec x + tan x\| |
| cosec x | log\|cosec x − cot x\| |
| 1/√(1 − x²), 1/(1 + x²) | sin⁻¹x, tan⁻¹x |

If ∫ f(x) dx = F(x), then `$\int f(ax + b)\,dx = \tfrac{1}{a}F(ax + b)$`. For example ∫ cos 3x dx = (sin 3x)/3.

<div class="myth">

**"∫ 1/x dx = log x."** That misses every negative x. The derivative of log|x| is 1/x on both sides, so the answer is log|x| + C. The same modulus appears in log|sec x|, log|x − a| and every other log answer.

</div>

## 3. Substitution

If the integrand contains a function and (a multiple of) its derivative, put t = that function:

```math
\int f(g(x))\,g'(x)\,dx = \int f(t)\,dt, \qquad t = g(x)
```

Shortcuts that come from it: `$\int \dfrac{f'(x)}{f(x)}dx = \log|f(x)|$` and `$\int \dfrac{f'(x)}{\sqrt{f(x)}}dx = 2\sqrt{f(x)}$`. Example: ∫ 2x/(x² + 1) dx = log(x² + 1) + C.

**Trigonometric integrals.** Use identities to reach a form you know. sin²x = (1 − cos 2x)/2. For odd powers like sin³x, keep one sin x and turn the rest into cos (put t = cos x). For ∫ 1/(a + b cos x) dx, put t = tan(x/2).

## 4. The x² ± a² family

```math
\int \frac{dx}{x^2 + a^2} = \frac{1}{a}\tan^{-1}\frac{x}{a}, \qquad \int \frac{dx}{x^2 - a^2} = \frac{1}{2a}\log\left|\frac{x - a}{x + a}\right|, \qquad \int \frac{dx}{a^2 - x^2} = \frac{1}{2a}\log\left|\frac{a + x}{a - x}\right|
```

```math
\int \frac{dx}{\sqrt{a^2 - x^2}} = \sin^{-1}\frac{x}{a}, \qquad \int \frac{dx}{\sqrt{x^2 \pm a^2}} = \log\left|x + \sqrt{x^2 \pm a^2}\right|
```

<div class="meaning">
<dl>
<dt>a</dt><dd>a positive constant; complete the square to find it, e.g. x² + 4x + 13 = (x + 2)² + 3², so a = 3 with x replaced by x + 2</dd>
<dt>Linear over quadratic</dt><dd>for (px + q)/(ax² + bx + c), write the top as k(derivative of the bottom) + m; the first part gives a log, the second a standard form</dd>
<dt>Physical meaning</dt><dd>A plus sign under the square gives an inverse tangent (the curve levels off); a minus sign gives a logarithm (it keeps growing).</dd>
</dl>
</div>

Also: `$\int \sqrt{a^2 - x^2}\,dx = \tfrac{x}{2}\sqrt{a^2 - x^2} + \tfrac{a^2}{2}\sin^{-1}\tfrac{x}{a}$`.

## 5. Integration by parts

```math
\int u\,v\,dx = u\int v\,dx - \int\left(u'\int v\,dx\right)dx
```

Choose u as the function that becomes simpler when differentiated, using the **ILATE** order as a guide: Inverse trig, Logarithm, Algebraic, Trigonometric, Exponential (take u from earlier in the list). So in ∫ x eˣ dx, u = x; in ∫ x log x dx, u = log x.

- ∫ log x dx: take u = log x, v = 1, giving x log x − x + C.
- ∫ eˣ sin x dx: apply parts twice; the original integral comes back, then solve for it: eˣ(sin x − cos x)/2 + C.
- **The eˣ shortcut**: `$\int e^x[f(x) + f'(x)]\,dx = e^x f(x) + C$`. Spot f and f′ inside the bracket, as in ∫ eˣ(1/x − 1/x²) dx = eˣ/x + C.

<div class="problem" data-problem="ii-parts"></div>

## 6. Partial fractions

A proper fraction (top degree less than bottom degree) with a factorised bottom splits into simple pieces:

| Bottom has | Pieces |
|---|---|
| (x − a)(x − b) | A/(x − a) + B/(x − b) |
| (x − a)² | A/(x − a) + B/(x − a)² |
| (x − a)(x² + bx + c), quadratic not factorable | A/(x − a) + (Bx + C)/(x² + bx + c) |

Find A by the **cover-up rule**: hide the factor (x − a) and put x = a in what is left. If the fraction is improper, divide first.

<div class="problem" data-problem="ii-partial"></div>

<div class="myth">

**"Two answers that look different means one is wrong."** Antiderivatives can differ by a constant. sin²x + C and −cos²x + C are both correct for ∫ 2 sin x cos x dx, because sin²x and −cos²x differ by exactly 1. Check by differentiating, not by comparing forms.

</div>

## 7. JEE Advanced level: tricks that save minutes

- **Divide by x² for symmetric forms.** ∫ (x² + 1)/(x⁴ + 1) dx: divide top and bottom by x² to get (1 + 1/x²)/((x − 1/x)² + 2), then put t = x − 1/x.
- **∫ 1/(a sin x + b cos x)**: write the bottom as R sin(x + α) with R = √(a² + b²).
- **(a sin x + b cos x)/(c sin x + d cos x)**: write the top as p(bottom) + q(derivative of bottom).
- **Curves from slopes.** "The slope of a curve at (x, y) is 3x² and it passes through (1, 2)": y = x³ + C with C = 1. This is a first differential equation.
- **Constants in a given answer.** If ∫ f dx = A g(x) + B h(x) + C, differentiate the given answer and compare coefficients to find A and B.

Next: [Indefinite integrals: question types and traps](/learn/courses/engineering-entrance/indefinite-integrals-questions/).

<div class="keypoints">

- ∫ f dx = F + C: a family of vertical copies; one point fixes C.
- Check any answer by differentiating it.
- ∫ 1/x dx = log|x| + C; ∫ f(ax + b) dx = F(ax + b)/a.
- Substitution: look for a function and its derivative; ∫ f′/f = log|f|.
- x² + a² gives tan⁻¹; x² − a² gives a log; complete the square first.
- By parts with ILATE; ∫ eˣ[f + f′] dx = eˣf + C.
- Partial fractions by cover-up; divide first if the fraction is improper.

</div>
