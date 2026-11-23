---
title: Integrals
seoTitle: 'Integrals Class 12 notes: methods and definite integrals'
summary: 'Class 12 Integrals with animations: antiderivatives, substitution, partial fractions, by parts, definite integrals, the fundamental theorem and properties.'
minutes: 110
updated: 2026-11-22
quiz:
  - q: 'The integral of 2x cos(x²) dx is:'
    choices: ['sin(x²) + C', '−sin(x²) + C', 'x² cos(x²) + C', '2 sin(x²) + C']
    ans: 0
    why: 'Put u = x², so du = 2x dx and the integral is ∫cos u du = sin u + C = sin(x²) + C. Differentiate to check: cos(x²) · 2x.'
  - q: 'The value of ∫ from −2 to 2 of (x³ + 3x²) dx is:'
    choices: ['0', '8', '16', '32']
    ans: 2
    why: 'x³ is odd, so its integral over −2 to 2 is 0. The even part 3x² gives 2 ∫₀² 3x² dx = 2 · 8 = 16.'
  - q: 'In integration by parts for ∫ x ln x dx, the best choice is:'
    choices: ['u = x, dv = ln x dx', 'u = ln x, dv = x dx', 'u = 1, dv = x ln x dx', 'u = x ln x, dv = dx']
    ans: 1
    why: 'ILATE: the logarithm comes first, so u = ln x. Then dv = x dx is easy to integrate, and du = dx/x makes the new integral simpler.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 7 “Integrals” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Fundamental theorem of calculus and standard integral forms: Stewart, J., Calculus (Cengage), chapters 4 and 7; Apostol, T. M., Calculus, Volume 1 (Wiley, 1967), chapter 5'
  - 'Simpson and midpoint rule checks in the live problems: Burden, R. L. and Faires, J. D., Numerical Analysis (Cengage), chapter 4'
---

**Maths · Class 12 · Chapter 7 · about 110 minutes.** By the end you will be able to reverse differentiation, use the standard formulas, solve integrals by substitution, partial fractions and parts, understand the definite integral as an area, use the fundamental theorem, and use the properties that make hard definite integrals easy.

<div class="bigidea">Differentiation asks "how fast is it changing here?" Integration asks the opposite: "if I know how fast it changes at every moment, how much has built up?" Distance from a speedometer, water in a tank from the tap's flow, money from a daily rate: all are integrals. The surprising fact is that the build-up is the area under the rate graph, and that area can be found by simply reversing differentiation.</div>

## 1. Integration as the opposite of differentiation

If `$F'(x) = f(x)$` we say `$F$` is an **antiderivative** of `$f$` and write

```math
\int f(x)\,dx = F(x) + C
```

The symbol `$\int$` is a stretched S for "sum". `$f(x)$` is the **integrand**, `$dx$` says the variable is x, and `$C$` is the **constant of integration**.

Why the `$+C$`? Because constants vanish when we differentiate: `$x^2$`, `$x^2 + 5$` and `$x^2 - 100$` all have derivative `$2x$`. Reversing the process, we cannot tell which one we started from, so we write all of them at once.

<figure class="fig" data-fig="c12m-int-family"><figcaption>One integrand, a whole family of curves. Slide C to move the curve up and down, drag the dashed line to compare tangents: every curve has the same slope there. Tick "pass through (1, 2)" to pick the one curve that fits a starting condition.</figcaption></figure>

The picture is the **geometrical meaning**: the indefinite integral is a family of curves, all copies of each other shifted up or down, and `$f(x)$` is the common slope at each `$x$`. A starting condition ("the curve passes through (1, 2)") fixes `$C$`.

<div class="meaning">

<dl>
<dt>∫ f(x) dx</dt><dd>the family of all functions whose derivative is f(x)</dd>
<dt>C</dt><dd>an arbitrary constant: a vertical shift of the whole curve</dd>
<dt>Physical meaning</dt><dd>If f is a speed, F(x) + C is a position. C is where you started: the speed alone cannot tell you that, like a train timetable that gives speeds but not the station you boarded at.</dd>
</dl>

</div>

### Standard formulas

Each line below is a derivative read backwards. You should know them as well as your tables.

```math
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \ (n \ne -1), \qquad \int \frac1x\,dx = \ln|x| + C, \qquad \int e^x\,dx = e^x + C
```

```math
\int \sin x\,dx = -\cos x + C, \quad \int \cos x\,dx = \sin x + C, \quad \int \sec^2 x\,dx = \tan x + C, \quad \int \operatorname{cosec}^2 x\,dx = -\cot x + C
```

```math
\int \sec x\tan x\,dx = \sec x + C, \quad \int \operatorname{cosec} x\cot x\,dx = -\operatorname{cosec} x + C, \quad \int a^x\,dx = \frac{a^x}{\ln a} + C
```

```math
\int \frac{dx}{\sqrt{1-x^2}} = \sin^{-1}x + C, \qquad \int \frac{dx}{1+x^2} = \tan^{-1}x + C, \qquad \int \frac{dx}{x\sqrt{x^2-1}} = \sec^{-1}x + C
```

Two **rules** make them go further: constants come out (`$\int k f = k\int f$`) and sums split (`$\int (f+g) = \int f + \int g$`). There is no rule for a product or a quotient: `$\int fg\,dx$` is **not** `$\int f \cdot \int g$`.

<div class="myth">

**"The integral of a product is the product of the integrals."** Check with `$\int x \cdot x\,dx$`. The true answer is `$x^3/3$`, but the product of the integrals gives `$(x^2/2)(x^2/2) = x^4/4$`. Products need a method (substitution or parts).

</div>

<div class="myth">

**"I can leave out +C."** For an indefinite integral the answer is a family; without `$+C$` it is only one member. (In a definite integral the C cancels, so you do not write it there.)

</div>

Always check an integral by differentiating the answer. If you get the integrand back, you are right. See [Integration technique coach](/learn/integration-coach/) in section 3 for a tool that tells you which method to try.

## 2. Methods of integration: substitution

Many integrals look like the result of the chain rule. If the integrand has a function `$g(x)$` and also (a multiple of) its derivative `$g'(x)$`, substitute `$u = g(x)$`, so `$du = g'(x)\,dx$`.

```math
\int f(g(x))\,g'(x)\,dx = \int f(u)\,du
```

It is a change of ruler: the same area measured with a different variable, in which it looks simple. In the step player, the left picture is the area under `$2x\cos(x^2)$` measured in x, and the right picture is the same area under `$\cos u$`, measured in u. For a definite integral the limits are converted as well, and the two shaded areas are equal.

<div class="steps" data-fig="c12m-int-subst">
<div class="step">Look at the integrand 2x cos(x²). The curve on top is awkward: the x² is trapped inside the cosine, but its derivative 2x is sitting right beside it. That is the clue for substitution.</div>
<div class="step">Choose u = x², the inner function (the one inside another function).</div>
<div class="step">Differentiate: du = 2x dx. The whole piece "2x dx" is replaced by du.</div>
<div class="step">The integral ∫ 2x cos(x²) dx becomes ∫ cos u du. For a definite integral from 0 to b, the limits become u = 0 and u = b² (put each x limit into u = x²). Move the b slider: both shaded areas stay equal.</div>
<div class="step">Integrate in u: ∫ cos u du = sin u + C. The area is sin(b²) − sin 0.</div>
<div class="step">Put x back: the answer is sin(x²) + C. Differentiating gives cos(x²) · 2x, the original integrand.</div>
</div>

**Tips for choosing u.** Try the inner function of a composite, the denominator, or the expression under a root. If `$du$` does not match, adjust with a constant (for `$x\,e^{x^2}$`, `$du = 2x\,dx$` so `$x\,dx = \tfrac12 du$`).

<div class="problem" data-problem="c12m-int-subst"></div>

**Useful results by substitution** (worth remembering):

```math
\int \tan x\,dx = \ln|\sec x| + C, \quad \int \cot x\,dx = \ln|\sin x| + C, \quad \int \sec x\,dx = \ln|\sec x + \tan x| + C
```

For example `$\int \tan x\,dx = \int \frac{\sin x}{\cos x}dx$`: put `$u = \cos x$`, `$du = -\sin x\,dx$`, and get `$-\int \frac{du}{u} = -\ln|\cos x| = \ln|\sec x|$`.

**Trig identities first.** Powers of sine and cosine are often tamed by an identity: `$\sin^2 x = \tfrac{1 - \cos 2x}{2}$`, `$\cos^2 x = \tfrac{1 + \cos 2x}{2}$`, and `$\sin A\cos B$` into a sum. So `$\int \sin^2 x\,dx = \tfrac{x}{2} - \tfrac{\sin 2x}{4} + C$`.

### Integrals of the form 1/(x² ± a²) and √

Three standard results (the exam expects you to know them), found by the right substitution or by completing a square:

```math
\int \frac{dx}{x^2 + a^2} = \frac1a \tan^{-1}\frac xa + C, \qquad \int \frac{dx}{x^2 - a^2} = \frac{1}{2a}\ln\left|\frac{x-a}{x+a}\right| + C, \qquad \int \frac{dx}{\sqrt{a^2 - x^2}} = \sin^{-1}\frac xa + C
```

```math
\int \sqrt{a^2 - x^2}\,dx = \frac x2\sqrt{a^2 - x^2} + \frac{a^2}{2}\sin^{-1}\frac xa + C
```

The last one has a picture: the curve `$y = \sqrt{a^2 - x^2}$` is the top of a circle, so the area to x is a triangle plus a sector.

<figure class="fig" data-fig="c12m-int-circle"><figcaption>The area under the quarter circle up to x is a triangle (½·x·√(a²−x²)) plus a sector (½·a²·sin⁻¹(x/a)). The formula and the strips agree for every a and x.</figcaption></figure>

For a quadratic that is not already a sum or difference of squares, **complete the square** first: `$x^2 + 4x + 13 = (x+2)^2 + 9$`, so `$\int \frac{dx}{x^2 + 4x + 13} = \tfrac13 \tan^{-1}\frac{x+2}{3} + C$`. For `$\int \frac{px+q}{ax^2+bx+c}dx$`, write the numerator as `$A$` times the derivative of the denominator plus a constant `$B$`: the first part is a log, the second one of the standard forms above.

<div class="problem" data-problem="c12m-int-arctan"></div>

## 3. Integration using partial fractions

A fraction of polynomials with a factorised denominator can be broken into simpler fractions whose integrals are logarithms. This is how you "undo" adding fractions.

```math
\frac{px + q}{(x-a)(x-b)} = \frac{A}{x-a} + \frac{B}{x-b}
```

**Cover-up trick.** To find A, cover the `$(x - a)$` in the original fraction and put `$x = a$` in what is left. The same gives B. A repeated factor `$(x-a)^2$` needs both `$\frac{A}{x-a}$` and `$\frac{B}{(x-a)^2}$`, and an irreducible quadratic needs `$\frac{Ax + B}{x^2 + px + q}$`. If the top degree is not smaller than the bottom, divide first.

<div class="steps" data-fig="c12m-int-partial">
<div class="step">We want ∫ (3x + 5)/((x + 1)(x + 2)) dx. The black curve is the fraction. It is not a standard form, but the denominator has two simple factors.</div>
<div class="step">Write the fraction as A/(x + 1) + B/(x + 2). The task is to find the numbers A and B.</div>
<div class="step">Cover (x + 1) and put x = −1 in what remains: A = (3(−1) + 5)/(−1 + 2) = 2. The blue curve is 2/(x + 1).</div>
<div class="step">Cover (x + 2) and put x = −2: B = (3(−2) + 5)/(−2 + 1) = 1. The orange curve is 1/(x + 2).</div>
<div class="step">The two pieces add up to the original at every x. Drag the marker: the two coloured bars stack up to the height of the black curve, for example 2/(1+1) + 1/(1+2) = 1.33 at x = 1.</div>
<div class="step">Each piece is now a standard form: ∫ 2/(x+1) dx = 2 ln|x+1| and ∫ 1/(x+2) dx = ln|x+2|. So the integral is 2 ln|x + 1| + ln|x + 2| + C.</div>
</div>

<div class="problem" data-problem="c12m-int-partial"></div>

<!--fig:tool integration-coach-->

## 4. Integration by parts

The product rule `$(uv)' = u'v + uv'$` read backwards gives the method for a product:

```math
\int u\,dv = uv - \int v\,du
```

It does not remove the integral; it swaps a hard one for (hopefully) an easier one. The picture shows why the formula is true: on the curve `$u = g(v)$` the area under the curve and the area beside it together fill the rectangle `$u \times v$`.

<figure class="fig" data-fig="c12m-int-partsrect"><figcaption>Slide the point along the curve. The blue area is ∫u dv and the orange area is ∫v du. Whatever the curve, their sum is the rectangle u·v.</figcaption></figure>

**Which is u?** Use the order **ILATE**: Inverse trig, Logarithm, Algebraic, Trigonometric, Exponential. The function that comes first in this list is u (it gets simpler when differentiated) and the other is dv (it must be something you can integrate).

<div class="steps" data-fig="c12m-int-partssteps">
<div class="step">The problem: ∫ x eˣ dx. A product of x and eˣ, so integration by parts.</div>
<div class="step">By ILATE, an Algebraic function comes before an Exponential, so u = x. Differentiating x gives 1, which is simpler.</div>
<div class="step">What remains is dv = eˣ dx, which we can integrate.</div>
<div class="step">Differentiate u: du = dx. Integrate dv: v = eˣ (no need for + C here).</div>
<div class="step">Apply ∫u dv = uv − ∫v du: x eˣ − ∫ eˣ dx. The new integral is easy.</div>
<div class="step">Finish: x eˣ − eˣ + C = (x − 1)eˣ + C.</div>
<div class="step">Check by differentiating: (x−1)eˣ has derivative eˣ + (x−1)eˣ = x eˣ. The graph shows the definite integral from 0 to 1: the area is exactly 1.</div>
</div>

<div class="problem" data-problem="c12m-int-parts"></div>

**Two tricks.** (1) Integrals of a single log or inverse trig function: write it as `$1 \times$` that function, so `$\int \ln x\,dx = x\ln x - x + C$`. (2) A cycling integral like `$\int e^x \sin x\,dx$`: apply parts twice; the original integral appears again with a minus sign, and you solve for it, getting `$\tfrac{e^x}{2}(\sin x - \cos x) + C$`. And a handy formula to remember:

```math
\int e^x\,[f(x) + f'(x)]\,dx = e^x f(x) + C
```

<div class="myth">

**"Parts always makes it easier."** If you choose u and dv the wrong way round (for example `$u = e^x$`, `$dv = x\,dx$` in `$\int x e^x dx$`) the new integral is worse: `$\int \tfrac{x^2}{2} e^x dx$`. If the new integral gets harder, swap your choice.

</div>

## 5. Definite integrals: area as a limit of sums

To find the area under `$y = f(x)$` from `$x = a$` to `$x = b$`, cut it into `$n$` thin strips. Each is nearly a rectangle with height `$f(x_i)$` and width `$\Delta x = (b-a)/n$`. Adding them gives an approximation, and it gets better as the strips get thinner. The **definite integral** is the value they approach:

```math
\int_a^b f(x)\,dx = \lim_{n\to\infty} \sum_{i=1}^{n} f(x_i)\,\Delta x
```

<figure class="fig" data-fig="c12m-int-riemann"><figcaption>Add n rectangles (or trapezoids) under the curve. Push n up and every sum closes in on the exact value; the small graph shows the error collapsing. Midpoint and trapezoid sums converge much faster than left and right sums.</figcaption></figure>

<!--fig:tool riemann-sums-->

The unit of the answer is "height unit times width unit", so a speed graph gives metres, a flow-rate graph gives litres. Where the curve is below the x-axis, the "height" is negative and that part is subtracted: the definite integral is a **signed area**.

<div class="history">

**Beyond the syllabus.** Evaluating `$\int_a^b f$` directly as a limit of sums, using formulas such as `$\sum k^2$`, is a long method used for proof. The Class 12 board paper asks you to use the fundamental theorem (next section), so check the current CBSE syllabus for this year.

</div>

## 6. The fundamental theorem of calculus

Two beautiful facts connect area and antiderivatives.

**Theorem 1 (area function).** Define `$A(x) = \int_a^x f(t)\,dt$`, the area from a fixed start to a moving end. Then `$A'(x) = f(x)$`. The rate at which the area grows equals the height of the curve: a taller curve piles up area faster.

**Theorem 2 (evaluation).** If `$F$` is any antiderivative of `$f$`, then

```math
\int_a^b f(x)\,dx = F(b) - F(a) = \Big[F(x)\Big]_a^b
```

Drag the slider in the figure: the lower graph is the running area. Its slope at every point equals the height of the upper curve, and changing the start `$a$` only shifts the lower graph, which is the "+C" again. This is why `$C$` cancels in `$F(b) - F(a)$`.

<figure class="fig" data-fig="@math-ftc-accumulator"><figcaption>Slide x: the shaded area is F(x), plotted below. The slope of the lower graph is the height of the upper one, F′ = f. Move the start a to see why the constant C cancels in a definite integral.</figcaption></figure>

**Worked example.** `$\int_1^3 (2x + 1)\,dx = [x^2 + x]_1^3 = (9 + 3) - (1 + 1) = 10$`. A check with a trapezoid: at x = 1 the height is 3, at x = 3 it is 7, width 2, so the area is `$\tfrac{3+7}{2} \times 2 = 10$`. ✓

<div class="problem" data-problem="c12m-int-power"></div>

**Definite integral by substitution.** Change the limits along with the variable, and then you never need to go back to x. For `$\int_0^{\pi/2} \sin^3 x \cos x\,dx$` put `$u = \sin x$`: limits `$0$` and `$1$`, integral `$\int_0^1 u^3 du = \tfrac14$`.

<div class="myth">

**"I changed to u but kept the x limits."** In `$\int_0^2 2x\cos(x^2)\,dx$` with `$u = x^2$` the new limits are `$0^2 = 0$` and `$2^2 = 4$`, so the integral is `$\int_0^4 \cos u\,du = \sin 4$`. Writing `$\int_0^2 \cos u\,du$` is a different (wrong) integral. Either change the limits, or go back to x before putting in the old ones.

</div>

## 7. Properties of definite integrals

These save work and often turn an impossible-looking integral into an easy one.

1. **Reversing limits:** `$\int_a^b f = -\int_b^a f$`.
2. **Splitting:** `$\int_a^b f = \int_a^c f + \int_c^b f$` for any c.
3. **The variable does not matter:** `$\int_a^b f(x)dx = \int_a^b f(t)dt$`.
4. **Reflection:** `$\int_0^a f(x)\,dx = \int_0^a f(a-x)\,dx$`, and more generally `$\int_a^b f(x)\,dx = \int_a^b f(a+b-x)\,dx$`.
5. **The 2a rule:** `$\int_0^{2a} f(x)\,dx = 2\int_0^a f(x)\,dx$` if `$f(2a - x) = f(x)$`, and `0` if `$f(2a-x) = -f(x)$`.
6. **Odd and even:** `$\int_{-a}^{a} f\,dx = 2\int_0^a f\,dx$` if f is even, and `0` if f is odd.

<figure class="fig" data-fig="c12m-int-props"><figcaption>Four of these properties as pictures. Choose a property and move its slider: areas split, cancel, flip or double exactly as the rule says.</figcaption></figure>

<!--fig:tool integral-properties-->

**Worked example (the reflection trick).** Let `$I = \int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x}dx$`. By property 4, `$I = \int_0^{\pi/2} \frac{\cos x}{\cos x + \sin x}dx$`. Add the two forms: `$2I = \int_0^{\pi/2} 1\,dx = \tfrac\pi2$`, so `$I = \tfrac\pi4$`, without ever finding an antiderivative.

<div class="problem" data-problem="c12m-int-even"></div>

<div class="myth">

**"Odd and even work for any limits."** `$\int_{-a}^{a}$` only. For `$\int_{-1}^{2} x^3\,dx$` the area from −1 to 1 cancels, but the remaining part from 1 to 2 does not: the answer is `$\tfrac{15}{4} - 0 = \tfrac{15}{4}$`, not 0.

</div>

**Which method?** A short guide: (1) try a standard formula; (2) look for a function and its derivative (substitution); (3) a fraction with a factorised denominator (partial fractions); (4) a product of different types (parts); (5) powers of trig functions (identities); (6) a definite integral with symmetric limits or `$a+b-x$` symmetry (properties). Our [Symbolic algebra](/science/symbolic-algebra/) tool checks any answer you have found.

<div class="keypoints">

- Antiderivative: F' = f. ∫f dx = F + C: a family of curves shifted up or down, with the same slope f(x) at each x. Check any answer by differentiating.
- Standard formulas: xⁿ, 1/x, eˣ, aˣ, sin, cos, sec², cosec², sec·tan, cosec·cot, 1/√(1−x²), 1/(1+x²), 1/(x√(x²−1)). No product rule: ∫fg ≠ ∫f ∫g.
- Substitution: u = inner function, du = its derivative times dx. In a definite integral change the limits too.
- Special forms: ∫dx/(x²+a²) = (1/a) tan⁻¹(x/a), ∫dx/(x²−a²) = (1/2a) ln|(x−a)/(x+a)|, ∫dx/√(a²−x²) = sin⁻¹(x/a), ∫√(a²−x²)dx = (x/2)√(a²−x²) + (a²/2) sin⁻¹(x/a). Complete the square first when needed.
- Partial fractions: split P(x)/((x−a)(x−b)) into A/(x−a) + B/(x−b); cover-up finds A and B. Divide first if the top is as large as the bottom.
- By parts: ∫u dv = uv − ∫v du, u chosen by ILATE. ∫eˣ[f + f'] dx = eˣ f + C.
- Definite integral = limit of sums = signed area; ∫ₐᵇ f = F(b) − F(a). Fundamental theorem: d/dx ∫ₐˣ f(t)dt = f(x).
- Properties: reverse limits flips the sign, split at c, ∫₀ᵃ f(x) = ∫₀ᵃ f(a−x), ∫₋ₐᵃ = 2∫₀ᵃ for even and 0 for odd, ∫₀²ᵃ = 2∫₀ᵃ when f(2a−x) = f(x).

</div>

Going further for JEE/NEET: harder techniques (reduction formulas, Wallis-type integrals, integrals of rational and irrational functions, Leibniz rule and limits of sums) are in [Indefinite integrals (JEE)](/learn/courses/engineering-entrance/indefinite-integrals/) and [Definite integrals and area (JEE)](/learn/courses/engineering-entrance/definite-integrals/).
