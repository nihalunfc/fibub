---
title: 'Calculus refresher: limits, Taylor series and approximations'
seoTitle: Limits, Taylor series and approximations for IIT JAM
summary: 'The calculus every JAM physics question leans on: limits by series instead of guesswork, Taylor and binomial expansions, the first-order approximations physicists use everywhere, when a series converges, and the gamma and Gaussian integrals.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'What is the limit of (1 − cos x)/x² as x → 0?'
    choices: ['1/2', '0', '1', 'It does not exist']
    ans: 0
    why: 'cos x = 1 − x²/2 + x⁴/24 − …, so 1 − cos x = x²/2 − …, and dividing by x² leaves 1/2 as x → 0.'
  - q: 'For a particle with v much smaller than c, what is γ = (1 − v²/c²)^(−1/2) approximately?'
    choices: ['1 + v²/(2c²)', '1 − v²/(2c²)', '1 + v²/c²', '1 + v/(2c)']
    ans: 0
    why: 'Use (1 + u)ⁿ ≈ 1 + nu with u = −v²/c² and n = −1/2. The two minus signs cancel, so γ is slightly bigger than 1, as it must be.'
  - q: 'Which series converges?'
    choices: ['1 − 1/2 + 1/3 − 1/4 + …', '1 + 1/2 + 1/3 + 1/4 + …', '1 + 1/√2 + 1/√3 + …', '1 + 1 + 1 + …']
    ans: 0
    why: 'The alternating harmonic series converges (to ln 2) because the terms shrink to zero with alternating signs. The harmonic series and Σ1/√n diverge even though their terms go to zero.'
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 1: infinite series, power series'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 1'
  - 'G. B. Thomas, Calculus, 14th ed. (2018), chapters on limits and Taylor series'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 40 minutes.** By the end you will be able to find tricky limits in a few lines by expanding in series, write down the Taylor series of the standard functions from memory, make the first-order approximations that turn hard physics into easy physics, tell whether a series converges, and evaluate the gamma and Gaussian integrals that appear in thermal and quantum physics.

<div class="bigidea">Close to any point, a smooth function is a polynomial in disguise. Keep the first term that matters and the rest of physics becomes algebra.</div>

## 1. Why physicists care

Almost every formula you will meet in this course was born as an approximation. The pendulum period `$2\pi\sqrt{L/g}$` assumes `$\sin\theta\approx\theta$`. Classical kinetic energy `$\tfrac12mv^2$` is the first term of `$(\gamma - 1)mc^2$`. Ohm's law, Hooke's law and the ideal gas law are first terms of something more complicated. The tool behind all of them is one idea: **replace a function by the first few terms of its Taylor series.**

JAM tests this in three ways: limits that look like `$0/0$`, "which approximation is correct" questions, and numerical estimates where the exact formula is messy but the first-order one is not.

## 2. Limits: the standard ones and the series method

A limit asks what `$f(x)$` heads towards as `$x$` approaches a point, whether or not `$f$` is defined there. Three limits are worth knowing by heart:

```math
\lim_{x\to0}\frac{\sin x}{x} = 1, \qquad \lim_{x\to0}\frac{e^x - 1}{x} = 1, \qquad \lim_{x\to\infty}\left(1 + \frac ax\right)^{x} = e^a
```

For anything harder, **expand everything in series and keep the first term that does not cancel**. It is faster and safer than L'Hôpital's rule, which often needs three or four rounds of differentiation.

**Worked example.** Find `$\displaystyle\lim_{x\to0}\frac{\tan x - \sin x}{x^3}$`.

1. Expand: `$\tan x = x + x^3/3 + \dots$` and `$\sin x = x - x^3/6 + \dots$`
2. Subtract: the `$x$` terms cancel, leaving `$x^3(1/3 + 1/6) = x^3/2$`.
3. Divide by `$x^3$`: the limit is `$1/2$`.

Notice what would have gone wrong with the "split" idea: `$\tan x/x^3$` and `$\sin x/x^3$` each blow up, so you cannot take their limits separately.

**Indeterminate forms.** `$0/0$`, `$\infty/\infty$`, `$0\times\infty$`, `$\infty - \infty$`, `$1^\infty$`, `$0^0$` and `$\infty^0$` do not have automatic answers. For the last three, take a logarithm first: if `$y = f^g$` then `$\ln y = g\ln f$`, which is a `$0\times\infty$` form you can handle. That is how `$\lim(1 + 3/x)^{2x} = e^6$` and `$\lim_{x\to0}(\cos x)^{1/x^2} = e^{-1/2}$` come out.

Explore any limit visually in the [limit zoom tool](/learn/limit-zoom/), and see a derivative appear as the limit of secant slopes in [derivative slope](/learn/derivative-slope/).

## 3. Taylor series: a polynomial that copies a function

If `$f$` is smooth near `$a$`, it equals its Taylor series there:

```math
f(a + h) = f(a) + f'(a)\,h + \frac{f''(a)}{2!}h^2 + \frac{f'''(a)}{3!}h^3 + \dots
```

With `$a = 0$` it is called a Maclaurin series. Why does this work? Step through it:

<div class="steps">
<div class="step"><p><b>Guess a polynomial.</b> Suppose f(x) = c₀ + c₁x + c₂x² + c₃x³ + … near x = 0.</p></div>
<div class="step"><p><b>Match the value.</b> Put x = 0: every term but the first vanishes, so c₀ = f(0).</p></div>
<div class="step"><p><b>Match the slope.</b> Differentiate once and put x = 0: c₁ = f′(0).</p></div>
<div class="step"><p><b>Match the curvature.</b> Differentiate twice: 2c₂ = f″(0), so c₂ = f″(0)/2!.</p></div>
<div class="step"><p><b>And so on.</b> Differentiating k times leaves k! c<sub>k</sub>, so c<sub>k</sub> = f<sup>(k)</sup>(0)/k!. Each extra term makes the polynomial agree with f to one more derivative.</p></div>
</div>

The series you must know without thinking:

| Function | Maclaurin series | Converges for |
|---|---|---|
| `$e^x$` | `$1 + x + \dfrac{x^2}{2!} + \dfrac{x^3}{3!} + \dots$` | all `$x$` |
| `$\sin x$` | `$x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \dots$` | all `$x$` |
| `$\cos x$` | `$1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \dots$` | all `$x$` |
| `$\ln(1+x)$` | `$x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \dots$` | `$-1 < x\le1$` |
| `$\dfrac{1}{1-x}$` | `$1 + x + x^2 + x^3 + \dots$` | `$-1 < x < 1$` |
| `$(1+x)^n$` | `$1 + nx + \dfrac{n(n-1)}{2!}x^2 + \dots$` | `$\lvert x\rvert < 1$` (any real `$n$`) |
| `$\tan x$` | `$x + \dfrac{x^3}{3} + \dfrac{2x^5}{15} + \dots$` | `$\lvert x\rvert < \pi/2$` |

`$\sinh x$` and `$\cosh x$` have the same terms as `$\sin x$` and `$\cos x$` but every sign positive. Change the function and the order below and watch the polynomial wrap itself round the curve. For `$\ln(1+x)$` and `$1/(1-x)$`, push "check at x" beyond 1 to see what the radius of convergence means.

<figure class="fig" data-fig="taylor-approx"><figcaption>Higher order means agreement over a wider range, but only inside the radius of convergence. Outside it, more terms make things worse.</figcaption></figure>

<div class="meaning">

<dl>
<dt>f(a)</dt><dd>where the function is: the zeroth-order picture</dd>
<dt>f′(a) h</dt><dd>the straight-line (first-order, linear) correction: the tangent</dd>
<dt>f″(a) h²/2</dt><dd>the bend: it decides whether a minimum is a minimum, and gives the spring constant of small oscillations</dd>
<dt>Radius of convergence</dt><dd>how far from a the series still works; it ends at the nearest point where f misbehaves</dd>
<dt>Physical meaning</dt><dd>Linear laws (Hooke, Ohm) are first-order Taylor terms. Small oscillations are second-order terms. Anharmonic effects, thermal expansion and relativistic corrections are the next terms.</dd>
</dl>

</div>

## 4. The binomial approximation: physics in one line

The single most useful line in this lesson is

```math
(1 + x)^n \approx 1 + nx \qquad (|x|\ll1)
```

It works for **any** real `$n$`: negative, fractional, anything. The trick is to rewrite the quantity so that a "1 + small" appears.

**Worked example.** Far from a ring of charge (radius `$R$`), how does its axial field `$E = kQz/(z^2 + R^2)^{3/2}$` differ from a point charge?

1. Take out the big part: `$(z^2 + R^2)^{3/2} = z^3(1 + R^2/z^2)^{3/2}$`.
2. So `$E = \dfrac{kQ}{z^2}(1 + R^2/z^2)^{-3/2}$`.
3. Binomial with `$n = -3/2$`: `$E\approx\dfrac{kQ}{z^2}\left(1 - \dfrac{3R^2}{2z^2}\right)$`.

Far away it is a point charge, and the first correction weakens it slightly. Examiners love this style; the wrong options usually carry the wrong sign or a missing factor.

**Worked example.** Gravity at height `$h$` is `$g/(1 + h/R)^2\approx g(1 - 2h/R)$`. A 1% drop needs `$2h/R = 0.01$`, so `$h = 0.005R\approx32$` km for the Earth.

<div class="problem" data-problem="taylor-sqrt"></div>

<div class="myth">

**"If the terms of a series go to zero, the series converges."** Wrong. The harmonic series `$1 + \tfrac12 + \tfrac13 + \dots$` has terms that shrink to zero, but it grows without limit (like `$\ln N$`). Terms going to zero is necessary, never sufficient.

</div>

## 5. Does the series converge?

A series `$\sum a_n$` converges if its partial sums settle to a limit. The tests that settle almost every JAM question:

- **`$p$`-series:** `$\sum1/n^p$` converges only for `$p > 1$`. So `$\sum1/n^2 = \pi^2/6$` converges; `$\sum1/n$` and `$\sum1/\sqrt n$` diverge.
- **Ratio test:** if `$|a_{n+1}/a_n|\to L$`, the series converges for `$L < 1$` and diverges for `$L > 1$` (no verdict at `$L = 1$`). It gives the radius of convergence of a power series.
- **Alternating series:** if the terms alternate in sign and shrink steadily to zero, the series converges, and the error after stopping is smaller than the first term left out.
- **Geometric series:** `$\sum_{n\ge0}r^n = 1/(1-r)$` for `$|r| < 1$`. Differentiating it gives `$\sum nr^n = r/(1-r)^2$`, the trick behind the mean energy of a quantum oscillator.

**Absolute and conditional.** `$1 - \tfrac12 + \tfrac13 - \dots = \ln2$` converges, but `$\sum|a_n|$` does not: the convergence is *conditional*, and reordering the terms can change the sum. Absolutely convergent series can be reordered freely.

## 6. Two integrals you will meet everywhere

**The gamma function.** For `$n > 0$`:

```math
\Gamma(n) = \int_0^\infty x^{n-1}e^{-x}\,dx, \qquad \Gamma(n+1) = n\,\Gamma(n), \qquad \Gamma(n+1) = n!, \qquad \Gamma(\tfrac12) = \sqrt\pi
```

So `$\int_0^\infty x^3e^{-x}dx = 3! = 6$` and `$\int_0^\infty\sqrt x\,e^{-x}dx = \Gamma(3/2) = \sqrt\pi/2$`.

**The Gaussian.** `$\displaystyle\int_{-\infty}^{\infty}e^{-ax^2}dx = \sqrt{\pi/a}$`. Its relatives come from differentiating with respect to `$a$`:

```math
\int_{-\infty}^{\infty}x^2e^{-ax^2}dx = \frac{1}{2a}\sqrt{\frac\pi a}
```

**Worked example.** Find `$\int_0^\infty x^2e^{-x^2}dx$`. The full-line integral with `$a = 1$` is `$\sqrt\pi/2$`; the integrand is even, so half of it is `$\sqrt\pi/4\approx0.443$`. These integrals give the Maxwell speed distribution and the ground state of the harmonic oscillator. Lesson 1.3 shows where `$\sqrt{\pi/a}$` comes from.

<div class="keypoints">

- For a `$0/0$` limit, expand in series and keep the first term that survives; take logs for `$1^\infty$`, `$0^0$` and `$\infty^0$` forms.
- Taylor: `$f(a+h) = \sum f^{(k)}(a)h^k/k!$`. Learn the series of `$e^x$`, `$\sin x$`, `$\cos x$`, `$\ln(1+x)$`, `$1/(1-x)$` and `$(1+x)^n$`, with their ranges.
- `$(1+x)^n\approx1 + nx$` for any real `$n$`: factor out the big part first so that "1 + small" appears.
- Terms going to zero do not make a series converge; `$\sum1/n^p$` needs `$p > 1$`.
- `$\Gamma(n+1) = n!$`, `$\Gamma(\tfrac12) = \sqrt\pi$`, `$\int e^{-ax^2}dx = \sqrt{\pi/a}$` over the whole line.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [calculus practice page](/learn/courses/iit-jam-physics/practice/calculus-and-series/).

<div class="qbank" data-bank="physics" data-topics="calculus-and-series" data-exam="jam" data-n="10"></div>

**Next:** lesson 1.2 extends derivatives to functions of several variables: [partial derivatives, Jacobians and exact differentials](/learn/courses/iit-jam-physics/partial-derivatives/). Taylor series come back in [simple harmonic motion](/learn/courses/iit-jam-physics/simple-harmonic-motion/) (every small oscillation) and in [complex numbers](/learn/courses/iit-jam-physics/complex-numbers/) (Euler's formula). Expand binomials term by term in the [binomial expansion tool](/learn/binomial-expansion/) and plot any function in the [graphing calculator](/science/function-grapher/).
