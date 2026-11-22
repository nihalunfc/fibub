---
title: The Dirac delta and Green's functions
seoTitle: The Dirac delta and Green's functions | GATE Physics
summary: 'The Dirac delta as a limit and as a rule under the integral: sifting, scaling, delta of a function, derivatives of the delta, the Fourier representation and the delta in three dimensions; then Green''s functions for boundary value problems, jump conditions and when G fails to exist, causal Green''s functions for oscillators, and the Poisson, screened and heat kernels.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: What is the integral of x² δ(x² − 9) over the whole line?
    choices: ['3', '9', '6', '1.5']
    ans: 0
    why: "δ(x² − 9) = [δ(x − 3) + δ(x + 3)]/6, since |g′| = |2x| = 6 at both roots. The integral is (9 + 9)/6 = 3."
  - q: For G″ = δ(x − x′) with G = 0 at both ends of an interval, which is true at x = x′?
    choices: ['G is continuous and its slope jumps by 1', 'G jumps by 1', 'G and its slope are both continuous', 'G is infinite']
    ans: 0
    why: Integrating G″ = δ across x′ gives a jump of exactly 1 in G′. A jump in G itself would make G″ contain δ′, which is not on the right-hand side, so G is continuous with a kink.
  - q: What is the causal Green's function of dy/dt + ay = f(t)?
    choices: ['θ(t) e^(−at)', 'e^(−a|t|)/2a', 'θ(−t) e^(at)', 'δ(t) e^(−at)']
    ans: 0
    why: "G′ + aG = δ(t) with G = 0 before the kick. Integrating across t = 0 gives G(0⁺) = 1, and for t > 0 the free decay e^(−at) follows."
sources:
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapters 1.11 and 10'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapters 8.11 and 13.8'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (2006), chapters 13 and 21'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), sections 1.5 and 2.3'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to evaluate any integral containing `$\delta(x)$`, `$\delta(g(x))$`, `$\delta'(x)$` or `$\delta^3(\mathbf r)$`, build the Green's function of a second-order boundary value problem from its jump conditions, recognise when it does not exist, and use causal Green's functions to find the response of an oscillator or a first-order system to any force. It uses the transforms of [lesson 1.5](/learn/courses/gate-physics/fourier-laplace-transforms/) and the modes of [lesson 1.7](/learn/courses/gate-physics/partial-differential-equations/).

<div class="bigidea">Any source can be cut into point sources. If you know the response to one point source, the Green's function, the response to any source is the same sum of point responses. The Dirac delta is the mathematical point source.</div>

## 1. The delta as a rule under the integral

`$\delta(x - a)$` is zero away from `$a$`, with unit area, so that for every smooth `$f$`

```math
\int_{-\infty}^{\infty}f(x)\,\delta(x - a)\,dx = f(a)
```

Slide the width ε down towards zero and move the position a.

<figure class="fig" data-fig="@math-delta-limit"><figcaption>Notice that the spike always has area 1 but grows taller and thinner, and that the integral of spike times f closes in on f(a), whatever the spike's shape.</figcaption></figure>

It is not an ordinary function but a limit of narrow, tall functions of unit area: a Gaussian `$\frac{1}{\varepsilon\sqrt\pi}e^{-x^2/\varepsilon^2}$`, a Lorentzian `$\frac{\varepsilon/\pi}{x^2 + \varepsilon^2}$`, a box of width `$2\varepsilon$` and height `$\frac{1}{2\varepsilon}$`, or `$\frac{\sin(x/\varepsilon)}{\pi x}$`. Check the area of any proposed sequence first: `$\frac1\varepsilon e^{-|x|/\varepsilon}$` tends to `$2\delta(x)$`, not `$\delta(x)$`. Because its integral over `$x$` is a pure number, **`$\delta(x)$` has the units of `$1/x$`**.

The rules, each from a substitution or an integration by parts:

- **Range:** the spike counts only if it lies inside the limits: `$\int_1^2\delta(x)\,dx = 0$`.
- **Products:** `$f(x)\delta(x - a) = f(a)\delta(x - a)$`; in particular `$x\,\delta(x) = 0$`.
- **Scaling:** `$\delta(ax) = \frac{\delta(x)}{|a|}$`, so `$\delta(-x) = \delta(x)$`.
- **Delta of a function:** for simple real roots `$x_i$` of `$g$`,

```math
\delta(g(x)) = \sum_i\frac{\delta(x - x_i)}{|g'(x_i)|}
```

- **Derivatives:** `$\int f\,\delta'(x - a)\,dx = -f'(a)$` and `$\int f\,\delta^{(n)}(x - a)\,dx = (-1)^nf^{(n)}(a)$`.
- **Step function:** `$\theta'(x) = \delta(x)$`.
- **Fourier:** `$\delta(x) = \frac{1}{2\pi}\int_{-\infty}^{\infty}e^{ikx}dk$`, so `$\int e^{-ikx}dx = 2\pi\delta(k)$`.

**Worked examples.** `$\int x^2\delta(x^2 - 4)\,dx = \frac44 + \frac44 = 2$`. `$\int_0^{2\pi}(1 + \theta)\delta(\cos\theta)\,d\theta = (1 + \frac\pi2) + (1 + \frac{3\pi}{2}) = 2 + 2\pi$`, from the two zeros of `$\cos\theta$`, each with `$|\sin\theta| = 1$`. `$\int e^{2x}\delta'(x)\,dx = -2$`.

## 2. The delta in three dimensions

`$\delta^3(\mathbf r - \mathbf r_0) = \delta(x - x_0)\delta(y - y_0)\delta(z - z_0)$` sifts out values in space with no extra Jacobian: `$\int f\,\delta^3(\mathbf r - \mathbf r_0)\,d^3r = f(\mathbf r_0)$`. Its units are length⁻³, so a point charge has density `$\rho = q\,\delta^3(\mathbf r - \mathbf r_0)$`.

The key identity behind Coulomb's and Gauss's laws:

```math
\nabla\cdot\frac{\hat{\mathbf r}}{r^2} = 4\pi\,\delta^3(\mathbf r), \qquad \nabla^2\frac1r = -4\pi\,\delta^3(\mathbf r)
```

Away from the origin both are zero, yet the flux of `$\hat{\mathbf r}/r^2$` through any sphere is `$4\pi$`, so all of the divergence sits at `$r = 0$`. Do not confuse `$\delta^3(\mathbf r)$` with a one-dimensional `$\delta(r - R)$`, which is a thin spherical shell: `$\int r^2\,\delta(r - 2)\,d^3r = 4\pi\int r^4\delta(r - 2)\,dr = 64\pi$`.

<div class="meaning">

<dl>
<dt>δ(x − a)</dt><dd>a unit point source at a: zero width, unit area, units of 1/length</dd>
<dt>Green's function G(x, x′)</dt><dd>the response at x to a unit point source at x′, obeying the problem's boundary conditions</dd>
<dt>Jump condition</dt><dd>what integrating the equation across the source point forces on G or its derivative</dd>
<dt>Causal (retarded)</dt><dd>zero before the source acts</dd>
<dt>Physical meaning</dt><dd>The Coulomb potential, the impulse response of a circuit and the spreading of a drop of heat are all Green's functions. Superposition does the rest.</dd>
</dl>

</div>

## 3. Green's functions for boundary value problems

To solve `$\hat Lu = f(x)$` with homogeneous boundary conditions, find `$G$` with

```math
\hat L\,G(x, x') = \delta(x - x'), \qquad u(x) = \int G(x, x')f(x')\,dx'
```

For a second-order operator `$\frac{d^2}{dx^2} + \ldots$` the recipe is always the same:

<div class="steps">
<div class="step">Away from x′ the equation is homogeneous. Left of x′ take the solution that satisfies the left boundary condition; right of x′ the one that satisfies the right condition.</div>
<div class="step">G is continuous at x = x′ (otherwise G″ would contain δ′).</div>
<div class="step">Integrating the equation across x′: the slope G′ jumps by 1 (divided by the coefficient of the second derivative, if it is not 1).</div>
<div class="step">Two conditions fix the two remaining constants.</div>
</div>

**Worked example.** `$G'' = \delta(x - x')$` on `$[0, 1]$`, `$G = 0$` at both ends. Left: `$Ax$`; right: `$B(x - 1)$`. Continuity: `$Ax' = B(x' - 1)$`; jump: `$B - A = 1$`. So `$A = x' - 1$`, `$B = x'$`, and `$G = x_<(x_> - 1)$`. For `$u'' = 1$`: `$u = \int_0^1G\,dx' = \frac{x(x - 1)}{2}$`, which indeed has `$u'' = 1$` and zero ends.

For a string under tension `$T$` the deflection obeys `$-Ty'' = f$`, so `$G = \frac{x_<(L - x_>)}{TL}$`: a tent with its peak under the force. The figure builds spread loads out of these tents.

<figure class="fig" data-fig="green-response"><figcaption>The Green's function of −(y″ + k²y) on [0, 1] with fixed ends, and the response to a spread load built from it. At k = 0 it is a tent x<(1 − x>); as k approaches π it grows without limit.</figcaption></figure>

**When G does not exist.** For `$y'' + k^2y$` on `$[0, L]$` with zero ends,

```math
G(x, x') = \frac{\sin(kx_<)\,\sin\big(k(x_> - L)\big)}{k\sin kL}
```

which blows up when `$kL = n\pi$`. Then `$\sin kx$` solves the homogeneous problem with both end conditions: forcing a string exactly at one of its normal-mode frequencies, resonance. A solution of `$\hat Lu = f$` then exists only if `$f$` is orthogonal to that mode. **Reciprocity:** for self-adjoint operators `$G(x, x') = G(x', x)$`.

<div class="problem" data-problem="dgf-string-load"></div>

## 4. Causal Green's functions

In time, we want the response to a kick at `$t'$` to vanish before `$t'$`. For a first-order system `$\dot y + ay = f$`: `$G(t) = \theta(t)e^{-at}$`, so a step input gives `$y = \frac{1 - e^{-at}}{a}$`.

Press Play to slide the flipped copy of g across f, or choose other shapes.

<figure class="fig" data-fig="@math-conv-slide"><figcaption>Notice that the output at each t is the area of the overlap, so two boxes give a triangle and a decaying g smears f forward in time.</figcaption></figure>

For the damped oscillator `$m\ddot x + m\gamma\dot x + m\omega_0^2x = F(t)$`, the kick changes the velocity by `$1/m$` and leaves the position alone, so for `$t > 0$` it is a free oscillation from `$x = 0$`, `$\dot x = 1/m$`:

```math
G(t) = \theta(t)\,\frac{e^{-\gamma t/2}\sin\omega_1t}{m\omega_1}, \qquad \omega_1 = \sqrt{\omega_0^2 - \gamma^2/4}, \qquad x(t) = \int_{-\infty}^{t}G(t - t')F(t')\,dt'
```

**Worked example.** An undamped oscillator `$\ddot x + 4x = F$` at rest has a constant force 8 switched on at `$t = 0$`: `$x = \int_0^t\frac{\sin2(t - t')}{2}\,8\,dt' = 2(1 - \cos2t)$`. It swings up to 4, twice the static deflection: a suddenly applied load overshoots.

In frequency space, `$\tilde G(\omega) = \frac{1}{m(\omega_0^2 - \omega^2 - i\gamma\omega)}$` (with `$e^{i\omega t}$` in the transform) has its poles at `$\pm\omega_1 - i\gamma/2$`, below the real axis. Closing the contour above for `$t < 0$` encloses nothing, so `$G = 0$` there: causality is the position of the poles ([lesson 1.4](/learn/courses/gate-physics/residues/)).

## 5. Green's functions of the big three operators

| operator (source δ) | condition | Green's function |
|---|---|---|
| `$\nabla^2$` in 3D | vanishes at infinity | `$-\frac{1}{4\pi\lvert\mathbf r - \mathbf r'\rvert}$` |
| `$\nabla^2$` in 2D | (up to a constant) | `$\frac{1}{2\pi}\ln\lvert\mathbf r - \mathbf r'\rvert$` |
| `$-(\nabla^2 - \mu^2)$` in 3D | vanishes at infinity | `$\frac{e^{-\mu r}}{4\pi r}$` (Yukawa, Debye) |
| `$-\frac{d^2}{dx^2} + \mu^2$` on a line | decays | `$\frac{e^{-\mu\lvert x - x'\rvert}}{2\mu}$` |
| `$\partial_t - \kappa\partial_x^2$` | causal | `$\frac{\theta(t)}{\sqrt{4\pi\kappa t}}e^{-x^2/4\kappa t}$` |

The first gives the potential of any charge distribution, `$V = \frac{1}{4\pi\varepsilon_0}\int\frac{\rho(\mathbf r')}{|\mathbf r - \mathbf r'|}d^3r'$`. The heat kernel keeps unit area while spreading, so its height falls as `$t^{-1/2}$` (in `$d$` dimensions, `$t^{-d/2}$`). The [Random walk](/science/random-walk-diffusion/) tool shows the same Gaussian appearing from many small random steps.

**Worked example.** Solve `$-y'' + 4y = e^{-|x|}$` on the line. With `$\mu = 2$`, `$y(0) = \int\frac{e^{-2|x'|}}{4}e^{-|x'|}dx' = \frac14\cdot\frac23 = \frac16$`.

<div class="myth">

**"`$\delta(g(x))$` is just `$\delta(x - x_0)$` at the root."** It carries a weight `$1/|g'(x_0)|$` at every simple root, and every root inside the range counts. `$\delta(2x - 6)$` is `$\frac12\delta(x - 3)$`, and `$\delta(x^2 - 4)$` has two spikes of weight `$\frac14$`. Forgetting the absolute value can even produce a negative weight; a delta always has positive area.

</div>

<div class="keypoints">

- Sifting `$\int f\delta(x - a) = f(a)$`; `$\delta(ax) = \delta/|a|$`; `$\delta(g) = \sum\delta(x - x_i)/|g'(x_i)|$`; `$\int f\delta^{(n)} = (-1)^nf^{(n)}$`; `$\theta' = \delta$`; `$\delta = \frac{1}{2\pi}\int e^{ikx}dk$`. Units of `$1/x$`.
- `$\nabla\cdot(\hat r/r^2) = 4\pi\delta^3$`, `$\nabla^2(1/r) = -4\pi\delta^3$`; `$\delta^3$` needs no Jacobian, `$\delta(r - R)$` does.
- Second-order `$G$`: homogeneous solutions on each side meeting the boundary conditions, `$G$` continuous, `$G'$` jumps by 1. `$G = x_<(x_> - 1)$` for `$d^2/dx^2$` on `$[0, 1]$`.
- `$G$` fails to exist at resonance (a homogeneous solution meets the boundary conditions). Self-adjoint problems are reciprocal.
- Causal: `$\theta(t)e^{-at}$`; oscillator `$\theta(t)\frac{e^{-\gamma t/2}\sin\omega_1t}{m\omega_1}$`; poles below the real axis.
- Kernels: `$-\frac{1}{4\pi r}$`, `$\frac{1}{2\pi}\ln\rho$`, `$\frac{e^{-\mu r}}{4\pi r}$`, `$\frac{e^{-\mu|x|}}{2\mu}$`, heat kernel `$(4\pi\kappa t)^{-1/2}e^{-x^2/4\kappa t}$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [delta and Green's functions practice page](/learn/courses/gate-physics/practice/delta-greens-functions/).

<div class="qbank" data-bank="physics" data-topics="delta-greens-functions" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.7, partial differential equations](/learn/courses/gate-physics/partial-differential-equations/). **Next:** [lesson 1.9, tensors](/learn/courses/gate-physics/tensors/). Delta potentials, with their jump in slope, return in [lesson 4.3](/learn/courses/gate-physics/one-dimensional-potentials/), and the oscillator in quantum form in [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).
