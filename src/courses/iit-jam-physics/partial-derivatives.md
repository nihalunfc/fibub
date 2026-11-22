---
title: Partial derivatives, Jacobians and exact differentials
seoTitle: Partial derivatives and exact differentials for IIT JAM
summary: 'How to differentiate functions of several variables, the chain rule, total differentials and error estimates, exact and inexact differentials (why heat and work depend on the path), the cyclic rule, Jacobians, maxima, minima and saddles, and Lagrange multipliers.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'For f(x, y) = x²y + y³, what is ∂f/∂x?'
    choices: ['2xy', '2xy + 3y²', 'x² + 3y²', '2x']
    ans: 0
    why: 'Hold y fixed and differentiate in x: x²y gives 2xy, and y³ is a constant, so it gives 0.'
  - q: 'Which test tells you that M dx + N dy is an exact differential (in a region without holes)?'
    choices: ['∂M/∂y = ∂N/∂x', '∂M/∂x = ∂N/∂y', 'M = N', '∂M/∂x + ∂N/∂y = 0']
    ans: 0
    why: 'If M dx + N dy = dF, then M = ∂F/∂x and N = ∂F/∂y, and equality of mixed partial derivatives gives ∂M/∂y = ∂N/∂x.'
  - q: 'For three variables linked by one equation, what is (∂x/∂y)_z (∂y/∂z)_x (∂z/∂x)_y?'
    choices: ['−1', '1', '0', 'It depends on the equation']
    ans: 0
    why: 'Each factor is minus a ratio of partial derivatives of the constraint; the three ratios cancel and leave (−1)³ = −1. The "cancel the differentials" guess of +1 is the classic trap.'
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 4: partial differentiation'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (2006), chapter 5'
  - 'H. B. Callen, Thermodynamics and an Introduction to Thermostatistics, 2nd ed. (1985), chapter 7 (Maxwell relations and Jacobians)'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 45 minutes.** By the end you will be able to take partial derivatives and use the multivariable chain rule, estimate changes and experimental errors with the total differential, test whether a differential is exact and find its potential, use the reciprocal and cyclic rules that thermodynamics depends on, compute Jacobians, classify stationary points, and solve constrained problems with Lagrange multipliers.

<div class="bigidea">A function of several variables has a different slope in every direction. A partial derivative is the slope when you walk along one axis while everything else stands still.</div>

## 1. Partial derivatives: freeze everything else

For `$f(x, y)$`, the partial derivative `$\partial f/\partial x$` (also written `$f_x$`) is the ordinary derivative in `$x$` with `$y$` treated as a constant:

```math
\frac{\partial f}{\partial x} = \lim_{h\to0}\frac{f(x + h, y) - f(x, y)}{h}
```

Geometrically, slice the surface `$z = f(x, y)$` with the plane `$y = y_0$`: you get a curve, and `$f_x$` is its slope. Slicing with `$x = x_0$` gives `$f_y$`. Move the point below and watch the two slices and their tangent lines.

<figure class="fig" data-fig="partial-slices"><figcaption>Each slice is an ordinary curve; its slope is a partial derivative. Where both slopes vanish (try the centre of the saddle) the point is stationary.</figcaption></figure>

**Mixed partials commute.** If the second partial derivatives are continuous, `$\dfrac{\partial^2f}{\partial x\,\partial y} = \dfrac{\partial^2f}{\partial y\,\partial x}$` (Clairaut's or Schwarz's theorem). This innocent fact is behind exactness, Maxwell's relations and `$\nabla\times\nabla\phi = 0$`.

In thermodynamics the variable held constant matters, so it is written as a subscript: `$(\partial P/\partial T)_V$` means "change `$T$` at fixed `$V$`". For an ideal gas `$(\partial P/\partial T)_V = nR/V$`, but `$(\partial P/\partial T)_S$` is something else entirely.

## 2. The total differential and the chain rule

If `$x$` changes by `$dx$` and `$y$` by `$dy$`, the change in `$f$` is, to first order,

```math
df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy
```

That is a two-variable Taylor series cut after the linear terms. Dividing by `$dt$` gives the **chain rule**: if `$x$` and `$y$` both depend on `$t$`, then `$\dfrac{df}{dt} = f_x\dfrac{dx}{dt} + f_y\dfrac{dy}{dt}$`. Every path by which `$t$` reaches `$f$` contributes one term.

**Implicit differentiation.** On a curve `$F(x, y) = 0$`, `$dF = F_xdx + F_ydy = 0$`, so

```math
\frac{dy}{dx} = -\frac{F_x}{F_y}
```

On the circle `$x^2 + y^2 = 25$` at `$(3, 4)$`: `$dy/dx = -x/y = -3/4$`.

**Error propagation.** Take logs before differentiating a product of powers. For `$g = 4\pi^2L/T^2$`:

```math
\frac{dg}{g} = \frac{dL}{L} - 2\frac{dT}{T} \quad\Longrightarrow\quad \left(\frac{\Delta g}{g}\right)_{\max} = \frac{\Delta L}{L} + 2\frac{\Delta T}{T}
```

For the *maximum* error the sizes always add (assume the worst signs). For independent *random* errors they add in quadrature instead: `$\sqrt{(\Delta L/L)^2 + (2\Delta T/T)^2}$`.

**Worked example.** `$L$` is known to 0.5% and `$T$` to 0.2%. Maximum error in `$g$`: `$0.5 + 2\times0.2 = 0.9\%$`. The period counts double because it is squared.

<div class="problem" data-problem="error-propagation"></div>

## 3. Exact and inexact differentials

A differential `$M\,dx + N\,dy$` is **exact** if it is `$dF$` for some function `$F(x, y)$`. Then its integral between two points is just `$F(\text{end}) - F(\text{start})$`, the same for every path, and zero round any closed loop.

```math
M\,dx + N\,dy \text{ is exact} \iff \frac{\partial M}{\partial y} = \frac{\partial N}{\partial x} \quad\text{(in a region without holes)}
```

Why: if `$M = F_x$` and `$N = F_y$`, the two sides are the two mixed partials of `$F$`.

**Worked example.** Show that `$dF = (2xy + 3)dx + (x^2 + 4y)dy$` is exact and find `$F$` with `$F(0, 0) = 0$`.

1. Test: `$\partial M/\partial y = 2x$` and `$\partial N/\partial x = 2x$`. Exact.
2. Integrate `$M$` in `$x$`: `$F = x^2y + 3x + g(y)$`.
3. Match `$F_y = x^2 + g'(y)$` with `$N = x^2 + 4y$`: `$g = 2y^2$`. So `$F = x^2y + 3x + 2y^2$`.

The classic mistake is to integrate `$M$` in `$x$`, `$N$` in `$y$`, and add: the shared term `$x^2y$` is then counted twice.

<div class="meaning">

<dl>
<dt>Exact (dF)</dt><dd>the change of a state function: its integral depends only on the end points</dd>
<dt>Inexact (đQ, đW)</dt><dd>a small amount of something that depends on the path, not a change of anything</dd>
<dt>Integrating factor</dt><dd>a function that multiplies an inexact differential into an exact one</dd>
<dt>Physical meaning</dt><dd>Internal energy, entropy and enthalpy are state functions (exact). Heat and work are not: for an ideal gas đQ = C<sub>V</sub>dT + (RT/V)dV fails the test, but dividing by T gives dS, which passes. That 1/T is the integrating factor behind the second law.</dd>
</dl>

</div>

<div class="myth">

**"P dV is exact because P and V are state variables."** Wrong. Each of `$P$` and `$V$` is a state function, but `$P\,dV$` is not the change of anything: with `$T$` and `$V$` as variables, `$P\,dV = (nRT/V)dV$` fails the test. That is why the work done in a cycle (the area on a `$PV$` diagram) is not zero, and why engines work. By contrast `$P\,dV + V\,dP = d(PV)$` is exact.

</div>

## 4. The reciprocal and cyclic rules

For three variables linked by one equation `$F(x, y, z) = 0$`, any two can be chosen freely. Two rules follow, and thermodynamics uses them constantly:

```math
\left(\frac{\partial x}{\partial y}\right)_z = \frac{1}{(\partial y/\partial x)_z}, \qquad \left(\frac{\partial x}{\partial y}\right)_z\left(\frac{\partial y}{\partial z}\right)_x\left(\frac{\partial z}{\partial x}\right)_y = -1
```

The minus sign surprises everyone. Check it with `$PV = nRT$`: `$(\partial P/\partial V)_T = -P/V$`, `$(\partial V/\partial T)_P = nR/P$`, `$(\partial T/\partial P)_V = V/nR$`. The product is `$-1$`.

**Worked example.** For one mole of a van der Waals gas, `$(\partial U/\partial V)_T = T(\partial P/\partial T)_V - P$`. With `$P = RT/(V - b) - a/V^2$`: `$(\partial P/\partial T)_V = R/(V - b)$`, so `$(\partial U/\partial V)_T = a/V^2$`. The attraction between molecules makes the internal energy depend on volume; for an ideal gas it would be zero. More on this in [thermodynamic potentials and Maxwell relations](/learn/courses/iit-jam-physics/thermodynamic-potentials/).

**Euler's theorem.** If scaling every variable by `$\lambda$` multiplies `$f$` by `$\lambda^n$` (homogeneous of degree `$n$`), then `$xf_x + yf_y = nf$`. For `$(x^2 + y^2)^{3/2}$`, `$n = 3$`.

## 5. Jacobians: how areas stretch

When you change variables from `$(x, y)$` to `$(u, v)$`, small areas stretch by the **Jacobian**:

```math
\frac{\partial(x, y)}{\partial(u, v)} = \begin{vmatrix} \partial x/\partial u & \partial x/\partial v \\ \partial y/\partial u & \partial y/\partial v \end{vmatrix}, \qquad dx\,dy = \left|\frac{\partial(x, y)}{\partial(u, v)}\right|du\,dv
```

For polar coordinates it is `$r$`; for spherical coordinates `$r^2\sin\theta$`. Two facts save time: the Jacobian of the inverse map is the reciprocal, `$\dfrac{\partial(u, v)}{\partial(x, y)} = 1\Big/\dfrac{\partial(x, y)}{\partial(u, v)}$`, and Jacobians chain like fractions. [Lesson 1.3](/learn/courses/iit-jam-physics/multiple-integrals/) puts them to work in integrals.

**Worked example.** For `$u = xy$`, `$v = y/x$`: `$\dfrac{\partial(u, v)}{\partial(x, y)} = \begin{vmatrix} y & x \\ -y/x^2 & 1/x \end{vmatrix} = \dfrac{2y}{x} = 2v$`, so `$dx\,dy = du\,dv/(2v)$`.

## 6. Maxima, minima and saddles

At a stationary point both first partials vanish. The second derivatives decide what kind it is, through `$D = f_{xx}f_{yy} - f_{xy}^2$`:

| Condition | Type |
|---|---|
| `$D > 0$`, `$f_{xx} > 0$` | local minimum |
| `$D > 0$`, `$f_{xx} < 0$` | local maximum |
| `$D < 0$` | saddle point |
| `$D = 0$` | test says nothing |

**Worked example.** `$f = x^3 - 3x + y^2$`. Stationary points: `$3x^2 - 3 = 0$` and `$2y = 0$`, so `$(\pm1, 0)$`. At `$(1, 0)$`: `$D = 6\times2 = 12 > 0$`, `$f_{xx} > 0$`, a minimum. At `$(-1, 0)$`: `$D = -12$`, a saddle, even though along the `$x$`-axis alone it looks like a maximum.

**Lagrange multipliers.** To make `$f$` stationary while `$g = c$`, set `$\nabla f = \lambda\nabla g$`: at the best point the level curves of `$f$` and `$g$` touch. For the largest `$xyz$` with `$x + y + z = 12$`: `$yz = xz = xy = \lambda$`, so `$x = y = z = 4$` and the maximum is 64. The same method derives the Boltzmann distribution in statistical physics.

<div class="keypoints">

- A partial derivative holds every other variable fixed; in thermodynamics the subscript says which. Mixed partials commute when continuous.
- `$df = f_xdx + f_ydy$` gives the chain rule, implicit slopes `$-F_x/F_y$` and error estimates (take logs; maximum errors add in size).
- `$M\,dx + N\,dy$` is exact when `$\partial M/\partial y = \partial N/\partial x$`; then it has a potential and path-independent integrals. Heat and work are inexact; `$1/T$` makes `$đQ$` exact.
- Reciprocal rule, and the cyclic rule with its `$-1$`.
- Jacobians stretch areas: `$r$` for polar, `$r^2\sin\theta$` for spherical; the inverse map has the reciprocal Jacobian.
- Stationary points: `$D = f_{xx}f_{yy} - f_{xy}^2$` sorts minimum, maximum and saddle. Constraints: `$\nabla f = \lambda\nabla g$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [partial derivatives practice page](/learn/courses/iit-jam-physics/practice/partial-derivatives/).

<div class="qbank" data-bank="physics" data-topics="partial-derivatives" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.1, limits and Taylor series](/learn/courses/iit-jam-physics/calculus-and-series/). **Next:** lesson 1.3, [double and triple integrals](/learn/courses/iit-jam-physics/multiple-integrals/), where Jacobians turn awkward regions into rectangles. The gradient, which packs all the partial derivatives into one vector, is the subject of [lesson 1.5](/learn/courses/iit-jam-physics/vector-calculus/), and exact differentials return as state functions in [the first law](/learn/courses/iit-jam-physics/first-law/).
