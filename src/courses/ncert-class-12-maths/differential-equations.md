---
title: Differential Equations
seoTitle: 'Differential Equations Class 12 notes: separable and linear'
summary: 'Class 12 Differential Equations with animations: order and degree, general and particular solutions, slope fields, separable, homogeneous and linear equations.'
minutes: 110
updated: 2026-11-22
quiz:
  - q: 'The order and degree of (d²y/dx²)³ + (dy/dx)⁴ + y = 0 are:'
    choices: ['order 2, degree 3', 'order 2, degree 4', 'order 3, degree 2', 'order 1, degree 4']
    ans: 0
    why: 'The highest derivative is d²y/dx² (order 2) and it is raised to the power 3 (degree 3). The power 4 belongs to a lower derivative and does not matter.'
  - q: 'The solution of dy/dx = 2y with y(0) = 3 is:'
    choices: ['y = 3e^(2x)', 'y = 2e^(3x)', 'y = 3e^(x/2)', 'y = 6x']
    ans: 0
    why: 'Separate: dy/y = 2 dx, so ln y = 2x + C and y = A e^(2x). y(0) = 3 gives A = 3.'
  - q: 'The integrating factor of dy/dx + (2/x) y = x² is:'
    choices: ['x', 'x²', 'e^x', '2x']
    ans: 1
    why: 'IF = e^(∫ 2/x dx) = e^(2 ln x) = x².'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 9 “Differential Equations” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Separable, homogeneous and linear equations, Newton cooling and exponential growth: Boyce, W. E. and DiPrima, R. C., Elementary Differential Equations (Wiley), chapters 1 and 2'
  - 'Slope fields and Euler method: Stewart, J., Calculus (Cengage), section 9.2'
---

**Maths · Class 12 · Chapter 9 · about 110 minutes.** By the end you will be able to read the order and degree of an equation, explain what a general and a particular solution are, and solve first-order equations that are variable separable, homogeneous or linear, including growth, decay and cooling problems.

<div class="bigidea">Nature rarely tells us "the quantity is this much". It tells us how a quantity changes: a hot cup cools faster when it is hotter, a population grows faster when it is bigger. That statement is a differential equation. Solving it means finding the function whose rate of change obeys the rule. The answer is not one curve but a family, and a starting value picks one.</div>

## 1. What is a differential equation?

An equation that contains an unknown function `$y$` of `$x$` and its **derivatives** is a **differential equation**. For example

```math
\frac{dy}{dx} = 2x, \qquad \frac{dy}{dx} + y = x, \qquad \frac{d^2y}{dx^2} + 4y = 0
```

(When it has only one independent variable, it is an *ordinary* differential equation, the only kind in this chapter.) You have already solved the simplest: `$dy/dx = 2x$` has solution `$y = x^2 + C$`, the integral.

**Order** is the order of the highest derivative that appears. **Degree** is the power of that highest derivative, **after** the equation has been made a polynomial in the derivatives (no roots, fractions or functions of derivatives). If it cannot be made a polynomial in the derivatives, the degree is not defined.

<figure class="fig" data-fig="c12m-de-order"><figcaption>Pick an equation: the order and degree are read off. Notice that a power on a lower derivative does not count, that a root must be removed first, and that sin(dy/dx) has no degree.</figcaption></figure>

<div class="problem" data-problem="c12m-de-order"></div>

<div class="myth">

**"Degree is the highest power anywhere in the equation."** Only the power of the **highest-order derivative** counts. In `$(y'')^2 + (y')^5 = 0$` the order is 2 and the degree is 2, not 5.

</div>

## 2. General and particular solutions

A **solution** is a function that, put into the equation, makes it true. A first-order equation has solutions with **one arbitrary constant**: that is the **general solution**. Choosing the constant (for example, by a starting value) gives a **particular solution**.

For `$dy/dx = y$`, every function `$y = Ce^x$` works, since its slope equals its height. If we know `$y(0) = 1$`, then `$C = 1$` and we get the particular solution `$y = e^x$`.

<figure class="fig" data-fig="c12m-de-family"><figcaption>Click or drag anywhere on the graph: the constant C is worked out so that the curve passes through your point. Switch equations to see exponentials, parabolas, shifted parabolas and circles as the general solution.</figcaption></figure>

<div class="meaning">

<dl>
<dt>General solution</dt><dd>a family of curves, one arbitrary constant for a first-order equation</dd>
<dt>Particular solution</dt><dd>one member of the family, found from a condition such as y(0) = 1 (an initial condition)</dd>
<dt>Physical meaning</dt><dd>The equation is the law ("cools at a rate proportional to the temperature difference"). The general solution is every possible history that obeys it. The initial condition ("the chai was 90 °C at 6 pm") tells you which history actually happened.</dd>
</dl>

</div>

### Seeing a differential equation: slope fields

The equation `$dy/dx = F(x, y)$` says: at the point `$(x, y)$` the curve must have slope `$F(x, y)$`. Draw a tiny tick of that slope at many points and you see the "wind" that the solutions follow. A solution curve is a path that is tangent to every tick it crosses. Different starting points give different curves: the family.

<figure class="fig" data-fig="c12m-de-slopefield"><figcaption>Choose an equation and click anywhere: the curve through that point follows the ticks both forwards and backwards. Notice how curves never cross (one slope per point) and how the pattern gives the family at a glance.</figcaption></figure>

<!--fig:tool slope-field-->

A computer follows the field with small straight steps (Euler's method), a way to solve equations that have no neat formula. The next figure is **beyond the syllabus** but shows how every numerical solver works.

<figure class="fig" data-fig="@math-euler-method"><figcaption>Euler's method: step along the slope, recompute the slope, step again. Smaller steps follow the exact curve more closely.</figcaption></figure>

<!--fig:tool ode-solver-->

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** Forming a differential equation from a family of curves (eliminating the arbitrary constants), and second-order equations, appear in university courses and in JEE. Euler's method above is also an extension. Check the current CBSE syllabus for what is asked this year.

</div>

## 3. Variable separable equations

If the equation can be rearranged so that **all the y terms (with dy) are on one side and all the x terms (with dx) are on the other**, integrate both sides:

```math
\frac{dy}{dx} = f(x)\,g(y) \quad\Longrightarrow\quad \int \frac{dy}{g(y)} = \int f(x)\,dx + C
```

<div class="steps" data-fig="c12m-de-separable">
<div class="step">The equation dy/dx = 2xy with the starting value y(0) = 1. The slope depends on both x and y, but as a product of an x-part and a y-part.</div>
<div class="step">Separate: divide by y and multiply by dx: dy/y = 2x dx. Everything about y is on the left, everything about x on the right (this needs y ≠ 0).</div>
<div class="step">Integrate both sides: ln|y| = x² + C. One constant is enough, because both sides' constants merge into C.</div>
<div class="step">Solve for y: y = A·eˣ², where A = ±e^C is any nonzero constant. The picture shows the family: every curve has the same "shape" and a different height.</div>
<div class="step">Use y(0) = 1: A·e⁰ = 1, so A = 1. The particular solution is y = eˣ², the highlighted curve through (0, 1).</div>
<div class="step">Check: d/dx of eˣ² is 2x·eˣ² = 2x·y. The tangent drawn at x = 0.8 has slope 2xy, exactly as the equation demands.</div>
</div>

<div class="problem" data-problem="c12m-de-sep"></div>

**Worked example.** Solve `$\dfrac{dy}{dx} = \dfrac{x}{y}$`, `$y(0) = 3$`. Separate: `$y\,dy = x\,dx$`. Integrate: `$\tfrac{y^2}{2} = \tfrac{x^2}{2} + C$`, so `$y^2 - x^2 = K$`. With `$y(0) = 3$`, `$K = 9$`: the curves are hyperbolas `$y^2 = x^2 + 9$`.

<div class="myth">

**"I can integrate y dx with respect to x."** The y terms must be moved to the left with dy **before** integrating. You cannot integrate `$2xy\,dx$` as `$x^2 y$`: y is not a constant, it changes with x.

</div>

### Growth and decay: dy/dt = ky

The most important separable equation has a rate **proportional to the amount**: `$dy/dt = ky$`. Separate and integrate: `$\ln y = kt + C$`, so

```math
y = y_0\,e^{kt}
```

where `$y_0$` is the amount at `$t = 0$`. If `$k > 0$`: growth (bacteria in curd, money at compound interest, a population). If `$k < 0$`: decay (radioactive atoms, medicine in the blood). The time to double (or halve) is `$\ln 2 / |k|$`, whatever the starting amount.

<figure class="fig" data-fig="c12m-de-growth"><figcaption>Slide k and the time marker (or press Play). The tangent is steeper where y is larger: the rate is k·y. The doubling time or half-life ln 2/|k| is shown for each choice of k.</figcaption></figure>

<div class="problem" data-problem="c12m-de-growth"></div>

<div class="problem" data-problem="c12m-de-cool"></div>

**Newton's law of cooling** is the same shape with a shifted baseline: the chai cools at a rate proportional to the **difference** from the room temperature `$T_r$`,

```math
\frac{dT}{dt} = -k(T - T_r) \ \Longrightarrow\ T = T_r + (T_0 - T_r)\,e^{-kt}
```

<figure class="fig" data-fig="c12m-de-cooling"><figcaption>A cup of chai at 90 °C. Change the room temperature and k (a steel tumbler has a larger k than a thick clay cup) and see how long it takes to reach a drinkable 60 °C. It never gets colder than the room.</figcaption></figure>

## 4. Homogeneous equations

A function `$F(x, y)$` is **homogeneous of degree 0** if replacing `$x, y$` by `$\lambda x, \lambda y$` leaves it unchanged, which happens exactly when it depends only on the ratio `$y/x$`. A differential equation `$dy/dx = F(x, y)$` is **homogeneous** in that case, for example `$\dfrac{x + y}{x} = 1 + \dfrac yx$`.

The picture explains why: along any straight line through the origin `$y/x$` is constant, so all slope ticks on that line are parallel.

<figure class="fig" data-fig="c12m-de-rays"><figcaption>For dy/dx = (x + y)/x the slope is 1 + y/x. Turn the ray: every tick along it has the same slope, however far from the origin. That is what lets us use the new variable v = y/x.</figcaption></figure>

**Method.** Put `$y = vx$`, so `$\dfrac{dy}{dx} = v + x\dfrac{dv}{dx}$`. The equation becomes separable in `$v$` and `$x$`. Solve it, then replace `$v$` by `$y/x$`.

<div class="steps" data-fig="c12m-de-homog">
<div class="step">The equation dy/dx = (x + y)/x with y(1) = 2. It is not separable as it stands, because x + y mixes the two variables.</div>
<div class="step">Test: (x + y)/x = 1 + y/x depends only on y/x. So it is homogeneous, and the substitution y = vx will work. (The grey rays have the same slope all along.)</div>
<div class="step">Put y = vx, so dy/dx = v + x dv/dx. The equation reads v + x dv/dx = 1 + v. The v on both sides cancels.</div>
<div class="step">What remains is x dv/dx = 1. Separate: dv = dx/x.</div>
<div class="step">Integrate: v = ln|x| + C. Put v = y/x back: y = x(ln|x| + C). The picture shows the family.</div>
<div class="step">Use y(1) = 2: 2 = 1·(0 + C), so C = 2 and the particular solution is y = x(ln x + 2), the highlighted curve through (1, 2).</div>
</div>

<div class="problem" data-problem="c12m-de-homog"></div>

<div class="myth">

**"I can always put y = vx."** It works only when the right side is a function of y/x alone. For `$dy/dx = (x + y + 1)/x$` the extra "+1" breaks the pattern: it is not homogeneous. Test with `$\lambda x, \lambda y$` first.

</div>

## 5. Linear first-order equations

A first-order equation is **linear** when `$y$` and `$dy/dx$` appear only to the first power and are not multiplied together:

```math
\frac{dy}{dx} + P\,y = Q \qquad (P, Q \text{ are functions of } x \text{ only})
```

**Trick: the integrating factor.** Multiply by `$\text{IF} = e^{\int P\,dx}$`. The left side becomes the derivative of a product:

```math
\frac{d}{dx}\big(y\cdot \text{IF}\big) = Q\cdot\text{IF} \quad\Longrightarrow\quad y\cdot\text{IF} = \int Q\cdot\text{IF}\,dx + C
```

Why it works: `$\dfrac{d}{dx}(y\,e^{\int P}) = e^{\int P}\,\dfrac{dy}{dx} + P\,e^{\int P}\,y = e^{\int P}\Big(\dfrac{dy}{dx} + Py\Big)$`, so multiplying by the integrating factor makes the left side a perfect product derivative.

<div class="steps" data-fig="c12m-de-linear">
<div class="step">The equation dy/dx + y = x with y(0) = 2. It has the form dy/dx + Py = Q with P = 1 and Q = x.</div>
<div class="step">The integrating factor is e^(∫P dx) = e^(∫1 dx) = eˣ (no +C needed in P's integral).</div>
<div class="step">Multiply the whole equation by eˣ: eˣ dy/dx + y eˣ = x eˣ. The left side is exactly d/dx(y eˣ).</div>
<div class="step">Integrate both sides. The right side needs integration by parts (Chapter 7): ∫ x eˣ dx = (x − 1)eˣ. So y eˣ = (x − 1)eˣ + C.</div>
<div class="step">Divide by eˣ: y = x − 1 + C e⁻ˣ. The curves all settle onto the line y = x − 1 as x grows, because the e⁻ˣ part dies away.</div>
<div class="step">Use y(0) = 2: 2 = 0 − 1 + C, so C = 3 and y = x − 1 + 3e⁻ˣ.</div>
</div>

<div class="problem" data-problem="c12m-de-linear"></div>

Linear equations also come with `$x$` as the dependent variable: if the equation has the form `$\dfrac{dx}{dy} + P_1 x = Q_1$` with `$P_1, Q_1$` functions of `$y$`, use `$\text{IF} = e^{\int P_1\,dy}$` and solve for `$x$` in terms of `$y$`.

<div class="myth">

**"The integrating factor is e^(P)."** It is `$e^{\int P\,dx}$`, the exponential of the **integral** of P. For `$P = 2/x$`, `$\text{IF} = e^{2\ln x} = x^2$`, not `$e^{2/x}$`.

</div>

## 6. Choosing the method

| Look at the equation | Method |
|---|---|
| Can you write it as (function of y) dy = (function of x) dx? | **Separate** the variables, integrate. |
| Is dy/dx a function of y/x only (all terms the same total degree)? | **Homogeneous**: y = vx. |
| Is it of the form dy/dx + Py = Q? | **Linear**: integrating factor e^(∫P dx). |

A quick **check** for any solution: differentiate your answer and put it back into the equation; and see whether the initial condition is satisfied.

<div class="keypoints">

- Order = highest derivative; degree = its power once the equation is polynomial in the derivatives (not defined if a derivative sits inside sin, log, e^ and so on).
- General solution: arbitrary constants equal to the order (one for first order). Particular solution: constants fixed by initial conditions.
- Slope field: tick of slope F(x, y) at each point; solutions follow the ticks, and different starting points give the family.
- Variable separable: g(y) dy = f(x) dx, integrate both sides. Growth/decay dy/dt = ky gives y = y₀eᵏᵗ, doubling or half-life ln 2/|k|. Cooling: T = Tᵣ + (T₀ − Tᵣ)e^(−kt).
- Homogeneous (depends only on y/x): put y = vx, dy/dx = v + x dv/dx, separate v and x.
- Linear dy/dx + Py = Q: IF = e^(∫P dx), then y·IF = ∫Q·IF dx + C. Also dx/dy + P₁x = Q₁ with IF = e^(∫P₁ dy).

</div>

Going further for JEE/NEET: exact equations, Bernoulli's equation, orthogonal trajectories, forming equations from families of curves and applications in physics and geometry are in [Differential equations (JEE)](/learn/courses/engineering-entrance/differential-equations/).
