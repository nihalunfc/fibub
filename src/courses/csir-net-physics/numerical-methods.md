---
title: 'Numerical methods: roots, integration and ODEs'
seoTitle: Numerical methods for CSIR NET Physics
summary: 'Bisection, Newton-Raphson, secant and fixed-point iteration with their orders of convergence and failure modes; interpolation and finite differences; trapezoidal, Simpson and Gauss quadrature with error laws and Richardson extrapolation; Euler, Runge-Kutta and symplectic methods for ODEs and their stability; solving linear systems.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Newton-Raphson for f(x) = x² − 3 starts at x₀ = 2. What is x₁?'
    choices: ['1.75', '1.5', '2.25', '1.732']
    ans: 0
    why: 'x₁ = x₀ − f(x₀)/f′(x₀) = 2 − (4 − 3)/4 = 1.75. The true root is 1.7321.'
  - q: 'Halving the step size in the composite trapezoidal rule reduces its error by about'
    choices: ['4 times', '2 times', '16 times', '8 times']
    ans: 0
    why: 'The trapezoidal error is proportional to h², so halving h divides it by 4. Simpson''s rule (h⁴) would gain 16.'
  - q: 'Explicit Euler applied to dy/dt = −100y is stable only if the step h is below'
    choices: ['0.02', '0.01', '0.1', '0.2']
    ans: 0
    why: 'Each step multiplies y by 1 − 100h; we need |1 − 100h| ≤ 1, so h ≤ 2/100 = 0.02.'
sources:
  - 'W. H. Press, S. A. Teukolsky, W. T. Vetterling and B. P. Flannery, Numerical Recipes, 3rd ed. (2007), chapters 3, 4, 9 and 17'
  - 'R. L. Burden and J. D. Faires, Numerical Analysis, 9th ed. (2010), chapters 2 to 5'
  - 'S. S. Sastry, Introductory Methods of Numerical Analysis, 5th ed. (2012)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Mathematical Methods of Physics (elementary computational techniques)'
---

**Module 2 · about 50 minutes.** By the end you will be able to carry out one or two steps of each standard method by hand (which is what NET asks), state how fast each converges, predict how the error changes with the step size, and recognise when a method will fail or go unstable.

<div class="bigidea">Every numerical method replaces the problem by one you can solve exactly: a curve by its tangent, an area by trapezoids or parabolas, a smooth motion by small straight steps. How well the replacement matches the Taylor series decides how fast the error shrinks.</div>

## 1. Finding roots

| Method | Step | Order | Needs |
|---|---|---|---|
| bisection | halve the bracket `$[a, b]$` with `$f(a)f(b) < 0$` | 1 (factor 1/2 per step) | a sign change |
| fixed point | `$x_{n+1} = g(x_n)$` | 1 (factor `$\vert g'(x^*)\vert$`) | `$\vert g'(x^*)\vert < 1$` |
| secant | `$x_{n+1} = x_n - f_n\dfrac{x_n - x_{n-1}}{f_n - f_{n-1}}$` | 1.618 | two starting points |
| Newton-Raphson | `$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$` | 2 | `$f'$` |

The **order** `$p$` means `$|e_{n+1}| \approx C|e_n|^p$`. For Newton, expanding about the root `$r$`:

```math
e_{n+1} \approx \frac{f''(r)}{2f'(r)}\,e_n^2
```

so the number of correct digits roughly doubles each step. Bisection needs `$n > \log_2(L/\epsilon)$` steps to shrink a bracket of length `$L$` below `$\epsilon$`: about 3.3 steps per decimal digit, but it never fails.

**Worked example.** `$\sqrt2$` from `$f = x^2 - 2$`, `$x_0 = 1$`: Newton's step is `$x_{n+1} = \tfrac12(x_n + 2/x_n)$`, giving `$1.5$`, `$1.41667$`, `$1.4142157$`. Errors: `$0.086$`, `$0.0025$`, `$2\times10^{-6}$`: squared each time.

**When Newton fails.** At a double root `$f'(r) = 0$` and convergence drops to linear (for `$f = x^2$`, `$x_{n+1} = x_n/2$`). A bad start can cycle: `$f = x^3 - 2x + 2$` from `$x_0 = 0$` goes `$0, 1, 0, 1, \dots$`. For `$f = x^{1/3}$`, `$x_{n+1} = -2x_n$`: it runs away.

<figure class="fig" data-fig="convergence-race"><figcaption>Root finding: the error of bisection, the secant method and Newton-Raphson for cos x = x on a log scale; Newton's curve plunges, bisection's falls in a straight line. Integration: the error of the trapezoidal and Simpson rules against the number of sub-intervals, with slopes −2 and −4 on log-log axes.</figcaption></figure>

<div class="problem" data-problem="newton-root"></div>

## 2. Interpolation and differences

Through `$n + 1$` points with distinct `$x$` there is exactly one polynomial of degree at most `$n$`. With equally spaced points, Newton's forward-difference form is quickest by hand: `$p(x_0 + sh) = y_0 + s\Delta y_0 + \tfrac{s(s-1)}{2!}\Delta^2y_0 + \dots$`.

Finite differences approximate derivatives, with errors that follow from Taylor series:

```math
f'(x) \approx \frac{f(x+h) - f(x)}{h} + O(h), \qquad f'(x) \approx \frac{f(x+h) - f(x-h)}{2h} + O(h^2), \qquad f''(x) \approx \frac{f(x+h) - 2f(x) + f(x-h)}{h^2} + O(h^2)
```

A smaller `$h$` is not always better: round-off error grows like `$\epsilon/h$`, so the best step for a central difference is about `$(3\epsilon)^{1/3} \sim 10^{-5}$` in double precision.

## 3. Numerical integration

With `$n$` sub-intervals of width `$h = (b - a)/n$`:

```math
T = \frac h2\left[f_0 + 2(f_1 + \dots + f_{n-1}) + f_n\right], \qquad S = \frac h3\left[f_0 + 4f_1 + 2f_2 + 4f_3 + \dots + 4f_{n-1} + f_n\right]
```

<div class="meaning">

<dl>
<dt>Trapezoidal error</dt><dd>−(b − a)h²f″/12: exact for straight lines, error ∝ h²</dd>
<dt>Simpson error</dt><dd>−(b − a)h⁴f⁽⁴⁾/180: exact up to cubics, error ∝ h⁴, needs even n</dd>
<dt>Gauss, n points</dt><dd>exact for polynomials up to degree 2n − 1 (two points ±1/√3 handle cubics)</dd>
<dt>Richardson</dt><dd>for error ∝ h<sup>p</sup>: I ≈ [2<sup>p</sup>A(h/2) − A(h)]/(2<sup>p</sup> − 1)</dd>
<dt>Physical meaning</dt><dd>The power of h tells you the payoff of more work: doubling the points cuts the trapezoidal error 4 times and Simpson's 16 times. For smooth functions, a higher-order rule is almost always the cheaper way to accuracy.</dd>
</dl>

</div>

**Worked example.** `$\int_0^2x^4\,dx = 6.4$`. Simpson with `$h = 1$`: `$\tfrac13(0 + 4 + 16) = 6.667$`, error `$-0.267$`, exactly `$-(2)(1)(24)/180$`. With `$h = 0.5$` the error falls to `$0.0167$`, sixteen times smaller.

**Worked example: Richardson.** Trapezoid for `$\int_0^1x^2\,dx$`: `$T(0.5) = 0.375$`, `$T(0.25) = 0.34375$`. Then `$[4(0.34375) - 0.375]/3 = 1/3$`, exact. Repeating this idea is Romberg integration.

<div class="problem" data-problem="simpson-pi"></div>

## 4. Ordinary differential equations

For `$y' = f(x, y)$` with step `$h$`:

| Method | Step | Local error | Global error |
|---|---|---|---|
| explicit Euler | `$y_{n+1} = y_n + hf(x_n, y_n)$` | `$O(h^2)$` | `$O(h)$` |
| Heun / RK2 | `$k_1 = f(x_n, y_n)$`, `$k_2 = f(x_n + h, y_n + hk_1)$`, `$y_{n+1} = y_n + \tfrac h2(k_1 + k_2)$` | `$O(h^3)$` | `$O(h^2)$` |
| classical RK4 | four slopes, weights 1, 2, 2, 1 over 6 | `$O(h^5)$` | `$O(h^4)$` |

**Worked example.** `$y' = y$`, `$y(0) = 1$`, one step `$h = 0.1$`. Euler: `$1.1$`. Heun: `$1 + 0.05(1 + 1.1) = 1.105$`. RK4: `$1.1051708$`. Exact: `$e^{0.1} = 1.1051709$`.

**Stability.** For the test equation `$y' = -\lambda y$`, Euler multiplies `$y$` by `$1 - \lambda h$` each step, so it blows up unless `$h < 2/\lambda$`, even though the true solution decays. A **stiff** system (one fast mode, slow interesting modes) forces tiny steps on explicit methods. Implicit (backward) Euler, `$y_{n+1} = y_n/(1 + \lambda h)$`, is stable for every `$h$` but needs an equation solve per step for nonlinear `$f$`.

**Long-time mechanics.** Euler applied to the oscillator `$\dot x = v$`, `$\dot v = -x$` multiplies the energy by `$1 + h^2$` every step: orbits spiral outwards. Symplectic methods such as leapfrog (velocity Verlet) keep phase-space area exactly, so their energy error stays bounded for millions of orbits. That is why they are used for planetary and molecular dynamics.

<div class="steps">
<div class="step"><p><b>Velocity Verlet, half kick.</b> v ← v + (h/2) a(x).</p></div>
<div class="step"><p><b>Drift.</b> x ← x + h v.</p></div>
<div class="step"><p><b>Half kick again.</b> v ← v + (h/2) a(x), with the new x.</p></div>
<div class="step"><p><b>Why it works.</b> Each sub-step is an exact canonical map (a shear of phase space), so their product keeps area, like the true flow. Global error is O(h²), but there is no energy drift.</p></div>
</div>

## 5. Linear systems

Gaussian elimination on a dense `$n\times n$` system costs about `$n^3/3$` multiplications (doubling `$n$` costs 8 times as much); partial pivoting keeps round-off under control. Iterative methods (Jacobi, Gauss-Seidel) are cheaper for large sparse systems and are guaranteed to converge when the matrix is **strictly diagonally dominant**, `$|a_{ii}| > \sum_{j\neq i}|a_{ij}|$`. A least-squares straight-line fit has slope `$m = \sum(x_i - \bar x)(y_i - \bar y)/\sum(x_i - \bar x)^2$`.

<div class="myth">

**"Euler's method has error O(h²)."** That is its error per step. Over a fixed interval you take `$1/h$` steps, so the global error is `$O(h)$`: Euler is first order. The same bookkeeping makes RK4 fourth order globally (fifth locally). A second myth: "a smaller step always helps". For explicit methods on stiff problems the step is limited by stability, not accuracy; for numerical derivatives it is limited by round-off.

</div>

<div class="keypoints">

- Orders: bisection 1, secant 1.618, Newton 2 (1 at a multiple root); fixed point converges if `$|g'(x^*)| < 1$`.
- Bisection steps: `$n > \log_2(L/\epsilon)$`.
- Forward difference `$O(h)$`; central differences `$O(h^2)$`.
- Trapezoid `$O(h^2)$`, exact for lines; Simpson `$O(h^4)$`, exact for cubics, even `$n$`; `$n$`-point Gauss exact to degree `$2n - 1$`.
- Richardson: `$[2^pA(h/2) - A(h)]/(2^p - 1)$`.
- Euler `$O(h)$`, Heun `$O(h^2)$`, RK4 `$O(h^4)$` globally. Euler stable for `$y' = -\lambda y$` only if `$h < 2/\lambda$`; backward Euler always.
- Symplectic integrators keep phase-space area and bounded energy error.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="numerical-methods" data-exam="net" data-n="10"></div>

**Before this:** lesson 2.3, [probability distributions](/learn/courses/csir-net-physics/probability-distributions/). **Next:** [module 3](/learn/courses/csir-net-physics/mechanics-roadmap/) begins with lesson 3.2, [canonical transformations and Hamilton-Jacobi theory](/learn/courses/csir-net-physics/hamilton-jacobi/). Background on series and ODEs: [Taylor series](/learn/courses/iit-jam-physics/calculus-and-series/) and [differential equations](/learn/courses/iit-jam-physics/differential-equations/).
