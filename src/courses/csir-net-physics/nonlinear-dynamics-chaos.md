---
title: Nonlinear dynamics and chaos
summary: 'The logistic map from fixed points to chaos: cycles, period doubling, superstable orbits, Feigenbaum''s constants and periodic windows; Lyapunov exponents and the limits of prediction; the Lorenz system and the Hénon map; strange attractors and fractal dimensions; Poincaré sections and the KAM picture of chaos in Hamiltonian systems.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'For the logistic map x → rx(1 − x), the non-zero fixed point is stable for'
    choices: ['1 < r < 3', '0 < r < 1', '3 < r < 3.57', 'r = 4 only']
    ans: 0
    why: 'Its multiplier is f′(x*) = 2 − r, and stability needs |2 − r| < 1, so 1 < r < 3. At r = 3 the first period doubling happens.'
  - q: 'A system has Lyapunov exponent 1 per day. Improving the initial data 1000 times extends the useful forecast by about'
    choices: ['7 days', '1000 days', '3 days', 'It makes no difference']
    ans: 0
    why: 'Errors grow as e^(λt), so the horizon is ln(tolerance/δ₀)/λ. Dividing δ₀ by 1000 adds ln 1000 / 1 ≈ 6.9 days.'
  - q: 'The Koch curve is made of 4 copies of itself, each one-third the size. Its fractal dimension is'
    choices: ['ln 4 / ln 3 ≈ 1.26', '4/3', 'ln 3 / ln 4 ≈ 0.79', '2']
    ans: 0
    why: 'N copies scaled by 1/s give D = ln N / ln s = ln 4 / ln 3 ≈ 1.262.'
sources:
  - 'S. H. Strogatz, Nonlinear Dynamics and Chaos, 2nd ed. (2015), chapters 9 to 12'
  - 'E. Ott, Chaos in Dynamical Systems, 2nd ed. (2002), chapters 1 to 4 and 7'
  - 'M. J. Feigenbaum, "Quantitative universality for a class of nonlinear transformations", J. Stat. Phys. 19, 25 (1978)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Classical Mechanics (non-linear dynamics and chaos)'
---

**Module 3 · about 55 minutes.** By the end you will be able to follow the logistic map from a stable fixed point through period doubling into chaos, compute Lyapunov exponents and prediction horizons, find the fixed points and volume contraction of the Lorenz system and the Hénon map, compute fractal dimensions, and explain what KAM theory says about Hamiltonian chaos.

This lesson continues lesson 3.3, [phase space, fixed points and stability](/learn/courses/csir-net-physics/phase-space-stability/), which explains why a flow in the plane cannot be chaotic.

<div class="bigidea">A simple deterministic rule can produce motion that never repeats and that magnifies every tiny uncertainty exponentially. The way order breaks down, by repeated period doubling, is the same for a huge class of systems, down to the numbers.</div>

## 1. The logistic map

```math
x_{n+1} = f(x_n) = rx_n(1 - x_n), \qquad 0 \leq x \leq 1, \quad 0 < r \leq 4
```

A **fixed point** of a map satisfies `$x^* = f(x^*)$`; it is stable when the **multiplier** `$|f'(x^*)| < 1$` (not `$f' < 0$` as for flows). For the logistic map, `$x^* = 0$` (stable for `$r < 1$`) and `$x^* = 1 - 1/r$`, with `$f'(x^*) = 2 - r$`, stable for `$1 < r < 3$`. At `$r = 2$` the multiplier is zero (**superstable**): errors are squared each step.

At `$r = 3$` the multiplier passes through `$-1$` and a stable **2-cycle** is born (a flip, or period-doubling, bifurcation). Its points solve `$f(f(x)) = x$` without being fixed points:

```math
x_\pm = \frac{(r + 1) \pm\sqrt{(r - 3)(r + 1)}}{2r}, \qquad f'(x_+)f'(x_-) = 4 + 2r - r^2
```

The 2-cycle's multiplier reaches `$-1$` at `$r = 1 + \sqrt6 \approx 3.449$`, giving period 4, then 8 at 3.544, and so on.

**Worked example.** At `$r = 3.2$`: `$x_\pm = (4.2\pm0.9165)/6.4 = 0.7995, 0.5130$`, multiplier `$4 + 6.4 - 10.24 = 0.16$`: stable. The superstable 2-cycle (through `$x = 1/2$`) is at `$r = 1 + \sqrt5 \approx 3.236$`.

<div class="problem" data-problem="logistic-cycle"></div>

## 2. Feigenbaum universality and windows

The period-doubling points `$r_n$` crowd together geometrically:

```math
\delta = \lim_{n\to\infty}\frac{r_n - r_{n-1}}{r_{n+1} - r_n} = 4.6692\ldots, \qquad r_\infty \approx 3.5699
```

The same `$\delta$` (and a second constant `$\alpha = 2.5029$` for the shrinking widths) appears for every smooth map with a single quadratic hump, and in experiments on convecting fluids and electronic circuits. Using it: from `$r_2 = 3.4495$` and `$r_3 = 3.5441$`, the remaining intervals sum to `$(r_3 - r_2)/(\delta - 1) = 0.0258$`, so `$r_\infty \approx 3.570$`.

Beyond `$r_\infty$` chaos is interrupted by **periodic windows**. The biggest, period 3, opens at `$r = 1 + \sqrt8 \approx 3.828$` by a tangent (saddle-node) bifurcation of `$f^3$`; just below it the motion shows **intermittency**, long nearly periodic stretches broken by chaotic bursts. By Sharkovskii's theorem, a period-3 orbit in a continuous map of an interval implies orbits of every period.

<figure class="fig" data-fig="logistic-bifurcation"><figcaption>Top: the long-term values of x for each r (the bifurcation diagram), showing period doubling into chaos and the periodic windows. Bottom: the Lyapunov exponent λ(r): negative on stable cycles, zero at each bifurcation, positive in chaos, and ln 2 at r = 4. Move the slider to read the attractor and λ at any r.</figcaption></figure>

## 3. Lyapunov exponents and prediction

Two orbits starting `$\delta_0$` apart separate as `$\delta_n \approx \delta_0e^{\lambda n}$`. For a one-dimensional map,

```math
\lambda = \lim_{n\to\infty}\frac1n\sum_{i=0}^{n-1}\ln|f'(x_i)|
```

<div class="meaning">

<dl>
<dt>λ &gt; 0</dt><dd>sensitive dependence: chaos</dd>
<dt>λ &lt; 0</dt><dd>orbits converge: a stable fixed point or cycle (λ = ln|multiplier|/period)</dd>
<dt>λ = 0</dt><dd>a bifurcation point, or neutral motion along a flow</dd>
<dt>1/λ</dt><dd>the time for errors to grow by a factor e: the Lyapunov time</dd>
<dt>Physical meaning</dt><dd>A positive exponent means each step reveals new digits of the initial condition: the doubling map 2x mod 1 shifts the binary expansion of x one place per step. Prediction then costs exponentially more precision for each extra step.</dd>
</dl>

</div>

Exact values: the doubling map and the tent map with slope 2 have `$\lambda = \ln2$`; a tent map with slope `$\mu$` has `$\ln\mu$`; the logistic map at `$r = 4$` also has `$\ln2$` (it becomes the tent map under `$x = \sin^2(\pi\theta/2)$`, with invariant density `$1/\pi\sqrt{x(1-x)}$`). At a stable fixed point `$\lambda = \ln|f'(x^*)|$`, e.g. `$\ln0.5 = -0.69$` at `$r = 2.5$`.

The **prediction horizon** for an initial error `$\delta_0$` and tolerance `$a$` is

```math
t_{\text{pred}} \approx \frac{1}{\lambda}\ln\frac{a}{\delta_0}
```

It grows only logarithmically with precision: a million times better data buys `$13.8/\lambda$` more.

<div class="problem" data-problem="chaos-horizon"></div>

## 4. Flows and maps in more dimensions

**The Lorenz system** (a model of convection):

```math
\dot x = \sigma(y - x), \qquad \dot y = rx - y - xz, \qquad \dot z = xy - bz
```

- The divergence is `$-(\sigma + 1 + b)$` everywhere, so volumes shrink as `$e^{-(\sigma+1+b)t}$` (`$e^{-13.67t}$` for `$\sigma = 10$`, `$b = 8/3$`): the attractor has zero volume.
- The origin is stable for `$r < 1$`; at `$r = 1$` a pitchfork creates `$C_\pm = (\pm\sqrt{b(r-1)}, \pm\sqrt{b(r-1)}, r - 1)$`, which lose stability at `$r \approx 24.74$`.
- At `$r = 28$` the Lyapunov exponents are about `$(0.91, 0, -14.57)$`: one positive (chaos), one zero (along the flow), and a sum equal to the divergence.

**The Hénon map** `$x' = 1 - ax^2 + y$`, `$y' = bx$` is invertible, with Jacobian determinant `$-b$`: areas shrink by `$|b|$` per step (0.3 at the classic `$a = 1.4$`). Its fixed points solve `$ax^2 + (1 - b)x - 1 = 0$`.

A **Poincaré section** turns a flow into a map by recording each crossing of a surface: a periodic orbit gives a few points, a quasi-periodic orbit a closed curve, a chaotic one a scattered fractal set.

**Worked example.** For `$r = 28$`, `$b = 8/3$`: `$C_\pm$` sit at `$z = 27$`, `$x = y = \pm\sqrt{72} = \pm8.49$`.

## 5. Strange attractors and fractal dimensions

A **strange attractor** combines stretching (which separates orbits) with folding (which keeps them bounded), building a layered, Cantor-like structure of non-integer dimension.

| Measure | Formula | Example |
|---|---|---|
| similarity | `$D = \ln N/\ln s$` for `$N$` copies scaled by `$1/s$` | Cantor set `$\ln2/\ln3 = 0.631$`; Koch `$\ln4/\ln3 = 1.262$`; Sierpinski `$\ln3/\ln2 = 1.585$` |
| box counting | `$N(\epsilon) \propto \epsilon^{-D}$`, `$D = \ln(N_2/N_1)/\ln(\epsilon_1/\epsilon_2)$` | coastlines, attractors |
| Kaplan-Yorke | `$D = j + \sum_{i\leq j}\lambda_i/\vert\lambda_{j+1}\vert$` | Lorenz: `$2 + 0.91/14.57 = 2.06$` |

**Hamiltonian chaos.** Without dissipation there are no attractors (Liouville). An integrable system moves on invariant tori. The **KAM theorem** says that under a small perturbation most tori survive (those with sufficiently irrational frequency ratios), while resonant ones break into island chains and thin chaotic layers. In the standard map the last barrier breaks at `$K \approx 0.97$`, after which chaotic orbits wander through all of phase space.

<div class="myth">

**"Chaos means randomness."** Chaotic systems are fully deterministic: the same initial condition always gives the same orbit. What makes them unpredictable is the exponential growth of the unavoidable error in the initial condition. Equally wrong: "chaos needs many variables". Three ODEs are enough for a flow, and a one-variable map such as `$x \to 4x(1-x)$` is already chaotic, because it is not invertible.

</div>

<div class="keypoints">

- Map fixed point stable if `$|f'(x^*)| < 1$`. Logistic: `$x^* = 1 - 1/r$`, `$f' = 2 - r$`, stable for `$1 < r < 3$`; superstable at `$r = 2$`.
- Period doubling at `$r = 3$`, `$1 + \sqrt6 = 3.449$`, `$3.544$`, ...; `$\delta = 4.669$`, `$r_\infty = 3.5699$`; period-3 window at `$1 + \sqrt8$`.
- 2-cycle: `$x_\pm = [(r+1)\pm\sqrt{(r-3)(r+1)}]/2r$`, multiplier `$4 + 2r - r^2$`.
- `$\lambda = \langle\ln|f'|\rangle$`; doubling, tent(2), logistic(4): `$\ln2$`. Horizon `$t \approx \lambda^{-1}\ln(a/\delta_0)$`.
- Lorenz: contraction `$\sigma + 1 + b$`; `$C_\pm$` at `$z = r - 1$`, `$x = y = \pm\sqrt{b(r-1)}$`; exponents `$(+, 0, -)$`.
- Hénon: area factor `$|b|$`. Chaos in flows needs 3 dimensions; maps can be chaotic in 1.
- `$D = \ln N/\ln s$`; Kaplan-Yorke for attractors. KAM: irrational tori survive small perturbations.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="nonlinear-dynamics-chaos" data-exam="net" data-n="10"></div>

**Before this:** lesson 3.3, [phase space, fixed points and stability](/learn/courses/csir-net-physics/phase-space-stability/). Related: [Hamilton-Jacobi theory and action-angle variables](/learn/courses/csir-net-physics/hamilton-jacobi/) for the integrable systems that KAM perturbs, and [numerical methods](/learn/courses/csir-net-physics/numerical-methods/) for integrating chaotic flows.

**Next:** module 4 begins with the [electromagnetic theory roadmap](/learn/courses/csir-net-physics/em-roadmap/).
