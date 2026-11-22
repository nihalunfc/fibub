---
title: First and second order differential equations
seoTitle: Differential equations for IIT JAM Physics
summary: 'Separable, linear and exact first-order equations, constant-coefficient second-order equations with damping and forcing, resonance and Euler-Cauchy equations: the methods, the physics behind them and the traps JAM sets.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: "For y'' + 2y' + 5y = 0, what does the solution look like?"
    choices: ['A decaying oscillation e^(−x)(A cos 2x + B sin 2x)', 'Pure oscillation A cos 2x + B sin 2x', 'A sum of two decaying exponentials', '(A + Bx)e^(−x)']
    ans: 0
    why: "m² + 2m + 5 = 0 gives m = −1 ± 2i. The real part −1 is the decay, the imaginary part 2 the angular frequency."
  - q: "You try y_p = A e^(2x) for y'' − 4y' + 4y = e^(2x) and get 0 = e^(2x). What went wrong?"
    choices: ['e^(2x) and x e^(2x) already solve the homogeneous equation, so try A x² e^(2x)', 'A must be complex', 'The equation has no particular solution', 'You should try A sin 2x']
    ans: 0
    why: "The auxiliary equation (m − 2)² = 0 has a double root 2, so both e^(2x) and x e^(2x) give zero on the left. Multiply by x once more."
  - q: What is the integrating factor for y' + P(x) y = Q(x)?
    choices: ['exp(∫P dx)', 'exp(∫Q dx)', '∫P dx', '1/P(x)']
    ans: 0
    why: "Multiplying by exp(∫P dx) turns the left side into the derivative of y·exp(∫P dx), which you can integrate directly."
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 8'
  - 'E. Kreyszig, Advanced Engineering Mathematics, 10th ed. (2011), chapters 1 to 3'
  - 'G. F. Simmons, Differential Equations with Applications and Historical Notes, 3rd ed. (2016)'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 45 minutes.** By the end you will be able to recognise which kind of equation you are facing, solve the four first-order types and every constant-coefficient second-order equation JAM can set, read off damping and resonance at a glance, and avoid the classic slips with repeated roots and particular solutions.

<div class="bigidea">A differential equation is a rule for how something changes. Physics is full of them, and almost all exam ones are solved by one trick: guess an exponential, and let the equation tell you its exponent.</div>

## 1. What kind of equation is it?

A differential equation links a function `$y(x)$` with its derivatives. Three labels decide the method:

- **Order**: the highest derivative present. `$y'' + y = 0$` is second order.
- **Degree**: the power of that highest derivative (once there are no fractional powers). `$(y'')^3 + (y')^4 = y$` has order 2 and degree 3; the power 4 on a lower derivative does not count.
- **Linear or not**: linear means `$y$` and its derivatives appear only to the first power, never multiplied together or inside functions like `$\sin y$`. The coefficients may depend on `$x$` freely: `$y'' + x^2y = \sin x$` is linear.

Linearity matters because of **superposition**: for a linear equation with zero right-hand side, any combination `$Ay_1 + By_2$` of solutions is again a solution. That is why every second-order linear equation has a general solution with exactly two constants.

## 2. First-order equations: four types

| Type | Looks like | Method |
|---|---|---|
| Separable | `$y' = f(x)\,g(y)$` | `$\int dy/g(y) = \int f(x)\,dx$` |
| Linear | `$y' + P(x)\,y = Q(x)$` | multiply by `$\mu = e^{\int P\,dx}$`; then `$(\mu y)' = \mu Q$` |
| Exact | `$M\,dx + N\,dy = 0$` with `$M_y = N_x$` | find `$\phi$` with `$\phi_x = M$`, `$\phi_y = N$`; answer `$\phi = C$` |
| Almost exact | `$M_y \ne N_x$` but `$(M_y - N_x)/N$` depends on `$x$` only | integrating factor `$e^{\int (M_y - N_x)/N\,dx}$` |

**Why the integrating factor works.** If `$\mu' = P\mu$`, then by the product rule `$(\mu y)' = \mu y' + P\mu y = \mu(y' + Py)$`. So multiplying the equation by `$\mu$` turns its left side into one exact derivative.

**Worked example.** Solve `$y' + y/x = x^2$` for `$x > 0$` with `$y(1) = 1$`, and find `$y(2)$`.

1. `$P = 1/x$`, so `$\mu = e^{\ln x} = x$`.
2. `$(xy)' = x\cdot x^2 = x^3$`. Integrate: `$xy = x^4/4 + C$`.
3. `$y(1) = 1$` gives `$1 = \tfrac14 + C$`, so `$C = \tfrac34$`.
4. `$y(2) = (4 + \tfrac34)/2 = 2.375$`.

The usual slip is step 2: forgetting to multiply the right side by `$\mu$` as well.

**Physics you should see instantly.** Decay `$\dot N = -\lambda N$` gives `$N = N_0e^{-\lambda t}$` with half-life `$\ln 2/\lambda$`. An RC circuit `$R\dot q + q/C = V$` charges as `$q = CV(1 - e^{-t/RC})$`. Newton's cooling `$\dot T = -k(T - T_a)$`: it is the *excess* over room temperature that decays exponentially, so it halves in equal times.

A warning about **non-linear** equations: `$y' = y^2$` with `$y(0) = 1$` gives `$y = 1/(1 - x)$`, which blows up at `$x = 1$` even though the equation looks harmless. Linear equations never do that where their coefficients are smooth.

## 3. Second order with constant coefficients

This is the heart of the topic, because it is the equation of every oscillator:

```math
a\,y'' + b\,y' + c\,y = 0
```

Try `$y = e^{mx}$`. Every derivative brings down a factor `$m$`, and `$e^{mx}$` cancels, leaving the **auxiliary (characteristic) equation**:

```math
a\,m^2 + b\,m + c = 0
```

Its two roots decide everything:

| Roots | General solution | Behaviour |
|---|---|---|
| real, different `$m_1 \ne m_2$` | `$Ae^{m_1x} + Be^{m_2x}$` | growth or decay, no oscillation |
| real, equal `$m$` | `$(A + Bx)e^{mx}$` | the borderline case |
| complex `$\alpha \pm i\beta$` | `$e^{\alpha x}(A\cos\beta x + B\sin\beta x)$` | oscillation at `$\beta$`, growing or decaying at rate `$\alpha$` |

The complex case is where Euler's formula ([lesson 1.9](/learn/courses/iit-jam-physics/complex-numbers/)) earns its place: `$e^{(\alpha + i\beta)x} = e^{\alpha x}(\cos\beta x + i\sin\beta x)$`, and the real and imaginary parts are both real solutions.

<div class="meaning">

<dl>
<dt>m (a root)</dt><dd>the growth rate of one basic solution e^(mx)</dd>
<dt>Real part of m</dt><dd>how fast the motion grows (positive) or dies away (negative)</dd>
<dt>Imaginary part of m</dt><dd>the angular frequency of the oscillation</dd>
<dt>Double root</dt><dd>the second solution is x e^(mx), not a second copy of e^(mx)</dd>
<dt>Physical meaning</dt><dd>For a mass on a spring with friction, the roots tell you at once whether it rings, creeps back, or returns as fast as possible without overshooting.</dd>
</dl>

</div>

## 4. The damped oscillator

Write the oscillator equation in the standard physics form, with damping rate `$\gamma$` and natural frequency `$\omega_0$`:

```math
\ddot x + 2\gamma\,\dot x + \omega_0^2\,x = 0, \qquad m = -\gamma \pm \sqrt{\gamma^2 - \omega_0^2}
```

Move the sliders to see the three regimes:

<figure class="fig" data-fig="damping"><figcaption>Underdamped (γ &lt; ω₀): rings inside a shrinking envelope. Critical (γ = ω₀): fastest return with no overshoot. Overdamped (γ &gt; ω₀): creeps back slowly.</figcaption></figure>

- **Underdamped**, `$\gamma < \omega_0$`: `$x = e^{-\gamma t}(A\cos\omega_d t + B\sin\omega_d t)$` with `$\omega_d = \sqrt{\omega_0^2 - \gamma^2}$`. Damping *lowers* the frequency.
- **Critically damped**, `$\gamma = \omega_0$`: `$x = (A + Bt)e^{-\gamma t}$`. Car shock absorbers and meter needles are designed to sit near here.
- **Overdamped**, `$\gamma > \omega_0$`: two negative real roots; the slower one, `$-\gamma + \sqrt{\gamma^2 - \omega_0^2}$`, controls the long creep.

**Worked example.** For `$\ddot x + 2\dot x + 10x = 0$`: `$m^2 + 2m + 10 = 0$` gives `$m = -1 \pm 3i$`. So the motion oscillates at 3 rad/s (not `$\sqrt{10} \approx 3.16$`) and its amplitude falls as `$e^{-t}$`, halving every `$\ln2 \approx 0.69$` s.

Note the factor 2 in `$2\gamma$`: in `$\ddot x + 0.2\dot x + x = 0$` the decay rate is 0.1, not 0.2. Critical damping in `$\ddot x + b\dot x + 9x = 0$` needs `$b = 2\omega_0 = 6$`, and in an LCR circuit `$R = 2\sqrt{L/C}$`.

<div class="problem" data-problem="damped-frequency"></div>

## 5. Forcing: particular solutions and resonance

With a right-hand side, the solution is

```math
y = y_h + y_p
```

where `$y_h$` is the general solution with the right side set to zero (two constants) and `$y_p$` is **any one** solution of the full equation. For exam right-hand sides, guess `$y_p$` of the same shape (**undetermined coefficients**):

| Right side | Try |
|---|---|
| `$e^{kx}$` | `$Ae^{kx}$` |
| polynomial of degree `$n$` | polynomial of degree `$n$` |
| `$\cos\omega x$` or `$\sin\omega x$` | `$A\cos\omega x + B\sin\omega x$` |

**The one rule that catches everyone:** if your guess already solves the homogeneous equation, it gives zero on the left and cannot work. Multiply it by `$x$` (and by `$x$` again if needed).

**Worked example.** `$y'' + 4y = \sin 2x$. The homogeneous solutions are `$\cos2x$` and `$\sin2x$`, so `$A\sin2x$` fails. Try `$y_p = Bx\cos2x$`: then `$y_p'' + 4y_p = -4B\sin2x$`, so `$B = -\tfrac14$` and `$y_p = -\tfrac14x\cos2x$`. The amplitude grows without limit: this is **resonance**, driving an undamped oscillator at its own frequency.

With damping, the steady response to `$F\cos\omega t$` stays finite:

```math
A(\omega) = \frac{F}{\sqrt{(\omega_0^2 - \omega^2)^2 + (2\gamma\omega)^2}}
```

It peaks at `$\omega = \sqrt{\omega_0^2 - 2\gamma^2}$`, slightly below both `$\omega_0$` and the free damped frequency `$\sqrt{\omega_0^2 - \gamma^2}$`. Three different frequencies, three favourite exam options. Play with a driven oscillator in fibub's [forced oscillations tool](/learn/forced-oscillations/), and check any equation numerically with the [ODE solver](/science/ode-solver/).

When the right side is something like `$\sec x$` or `$\tan x$`, guessing fails; then use **variation of parameters** (`$y_p = -y_1\int y_2 f/W\,dx + y_2\int y_1 f/W\,dx$`, with `$W$` the Wronskian). For `$y'' + y = \sec x$` it gives `$y_p = x\sin x + \cos x\ln|\cos x|$`.

<div class="myth">

**"A repeated root just means I write the same solution twice."** No. `$Ae^{-x} + Be^{-x}$` is really one constant times one function, and it cannot fit two initial conditions. For a double root `$m$` the second solution is `$xe^{mx}$`. The same idea returns with forcing: when the right side matches a homogeneous solution, multiply the trial by `$x$`; when it matches a double root, by `$x^2$` (for `$y'' - 2y' + y = e^x$` the answer is `$\tfrac12x^2e^x$`).

</div>

## 6. Euler-Cauchy equations

When the coefficients are powers of `$x$` matching the order of the derivative,

```math
x^2y'' + a\,x\,y' + b\,y = 0,
```

an exponential no longer fits, but a **power** does: try `$y = x^m$` to get `$m(m - 1) + am + b = 0$`. Distinct roots give `$Ax^{m_1} + Bx^{m_2}$`; a double root gives `$x^m(A + B\ln x)$` (the logarithm plays the role that `$x$` played before).

**Worked example.** `$x^2y'' - 2xy' + 2y = 0$`: `$m(m-1) - 2m + 2 = m^2 - 3m + 2 = 0$`, so `$m = 1, 2$` and `$y = Ax + Bx^2$`. These equations appear in physics whenever a problem has no preferred length scale, such as Laplace's equation in spherical coordinates.

**One step further.** A system of linear equations like `$\dot x = 3x + y$`, `$\dot y = x + 3y$` is solved the same way, with the exponents now the eigenvalues of the matrix ([lesson 1.8](/learn/courses/iit-jam-physics/matrices/)): here 4 and 2.

<div class="keypoints">

- Identify the type first: order, degree, linear or not; then separable, linear (integrating factor `$e^{\int P\,dx}$`) or exact (`$M_y = N_x$`).
- For `$ay'' + by' + cy = 0$` solve `$am^2 + bm + c = 0$`: distinct real roots give exponentials, a double root gives `$(A + Bx)e^{mx}$`, complex roots `$\alpha \pm i\beta$` give `$e^{\alpha x}(A\cos\beta x + B\sin\beta x)$`.
- Damped oscillator `$\ddot x + 2\gamma\dot x + \omega_0^2x = 0$`: under, critical (`$\gamma = \omega_0$`) or overdamped; the damped frequency is `$\sqrt{\omega_0^2 - \gamma^2}$`.
- General solution = homogeneous + one particular. If the trial solves the homogeneous equation, multiply it by `$x$`.
- Undamped driving at `$\omega_0$` grows like `$t\sin\omega_0t$`; with damping the amplitude peaks at `$\sqrt{\omega_0^2 - 2\gamma^2}$`.
- Euler-Cauchy `$x^2y'' + axy' + by = 0$`: try `$x^m$`; a double root brings `$\ln x$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [differential equations practice page](/learn/courses/iit-jam-physics/practice/differential-equations/).

<div class="qbank" data-bank="physics" data-topics="differential-equations" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.6, the integral theorems](/learn/courses/iit-jam-physics/integral-theorems/). **Next:** [lesson 1.8, matrices and eigenvalues](/learn/courses/iit-jam-physics/matrices/), which solves systems of these equations in one go. Oscillators return in the mechanics and waves modules. For GATE and CSIR NET, the GATE Physics course continues with [series solutions (Legendre, Bessel, Hermite)](/learn/courses/gate-physics/special-functions/) and [partial differential equations](/learn/courses/gate-physics/partial-differential-equations/), and CSIR NET adds [numerical methods for ODEs](/learn/courses/csir-net-physics/numerical-methods/).
