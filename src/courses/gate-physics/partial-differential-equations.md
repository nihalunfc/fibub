---
title: Partial differential equations and separation of variables
seoTitle: PDEs and separation of variables | GATE Physics
summary: 'Classifying second-order PDEs as elliptic, parabolic or hyperbolic, separation of variables for the heat, wave and Laplace equations with Fourier sine and cosine series, steady states and transients, decay times and normal modes, d''Alembert''s solution and characteristics, Laplace''s equation in polar, cylindrical and spherical coordinates, and uniqueness.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: On a rod with both ends held at 0, how does the decay rate of the mode sin(nπx/L) depend on n?
    choices: ['As n²', 'As n', 'It does not depend on n', 'As 1/n']
    ans: 0
    why: "Each mode decays as exp(−κ(nπ/L)²t), so the rate is proportional to n². Fine detail in a temperature profile disappears first; this is why the heat equation smooths everything."
  - q: Inside a sphere with surface potential V₀P₂(cos θ) and no charge, how does the potential depend on r?
    choices: ['As r²', 'As r⁻³', 'As r', 'It is constant']
    ans: 0
    why: Separable solutions are r^ℓ P_ℓ and r^−(ℓ+1) P_ℓ. Inside, finiteness at the centre keeps r^ℓ, so V = V₀(r/R)²P₂(cos θ). Outside it would fall as (R/r)³.
  - q: Which equation is hyperbolic?
    choices: ['u_tt + γu_t = c²u_xx', 'u_t = κu_xx', 'u_xx + u_yy = 0', 'u_xx + 2u_xy + 2u_yy = 0']
    ans: 0
    why: "Only the second-order terms decide the type. u_tt − c²u_xx has B² − 4AC = 4c² > 0, and the damping term γu_t changes nothing. The heat equation is parabolic; the last two are elliptic (4 − 8 < 0 for the last one)."
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 13'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 9'
  - 'W. A. Strauss, Partial Differential Equations: An Introduction, 2nd ed. (2008), chapters 1 to 6'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), section 3.3 (separation of variables)'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 65 minutes.** By the end you will be able to classify a second-order PDE, solve the heat, wave and Laplace equations by separation of variables in Cartesian, polar and spherical coordinates, find Fourier coefficients from initial or boundary data, split a problem into a steady state plus transients, read off decay times and mode frequencies, and use d'Alembert's solution and the domain of dependence. Fourier series themselves are in the JAM lesson on [Fourier series](/learn/courses/iit-jam-physics/fourier-series/), and the wave equation on a string in [waves](/learn/courses/iit-jam-physics/waves/).

<div class="bigidea">Separation of variables turns one PDE into several ODEs, one per coordinate, linked by separation constants. The boundary conditions pick out a discrete set of modes; the initial or remaining boundary data fix how much of each mode is present. Linearity lets you add them up.</div>

## 1. Three kinds of equation

For `$Au_{xx} + Bu_{xy} + Cu_{yy} + (\text{lower-order terms}) = 0$`, the discriminant `$B^2 - 4AC$` decides the type:

| `$B^2 - 4AC$` | type | model | behaviour |
|---|---|---|---|
| negative | elliptic | Laplace `$\nabla^2u = 0$` | equilibrium; data on a closed boundary; smooth inside |
| zero | parabolic | heat `$u_t = \kappa u_{xx}$` | diffusion; smooths; infinite signal speed |
| positive | hyperbolic | wave `$u_{tt} = c^2u_{xx}$` | propagation at finite speed along characteristics |

Lower-order terms never change the type: the telegraph equation `$u_{tt} + \gamma u_t = c^2u_{xx}$` is still hyperbolic. With variable coefficients the type can change from region to region (for `$u_{xx} + xu_{yy} = 0$`, elliptic for `$x > 0$`, hyperbolic for `$x < 0$`).

## 2. The heat equation on a rod

`$u_t = \kappa u_{xx}$` on `$0 < x < L$` with `$u(0, t) = u(L, t) = 0$`. Try `$u = X(x)T(t)$`:

```math
\frac{T'}{\kappa T} = \frac{X''}{X} = -k^2
```

Choose a starting pattern and press Play; try insulated ends and the sine modes.

<figure class="fig" data-fig="@math-heat-rod"><figcaption>Notice that sharp features fade fastest, that a sine mode keeps its shape and just shrinks as e^(−Dk²t), and that insulated ends keep the total heat.</figcaption></figure>

Each side depends on a different variable, so both equal a constant. A zero or positive constant gives only `$X \equiv 0$` with two zero ends, so it must be negative. Then `$X = \sin kx$` with `$\sin kL = 0$`, i.e. `$k_n = n\pi/L$`, and `$T = e^{-\kappa k_n^2t}$`:

```math
u(x, t) = \sum_{n=1}^{\infty}b_n\sin\frac{n\pi x}{L}\,e^{-\kappa n^2\pi^2t/L^2}, \qquad b_n = \frac2L\int_0^Lu(x, 0)\sin\frac{n\pi x}{L}dx
```

Mode `$n$` decays with time constant `$\tau_n = \frac{L^2}{n^2\pi^2\kappa}$`. The `$n^2$` means fine detail disappears first; after a while only the half-sine `$n = 1$` is left.

**Worked example.** A rod at a uniform 100 °C has its ends put into ice. `$b_n = \frac{200}{n\pi}(1 - \cos n\pi)$`: `$\frac{400}{n\pi}$` for odd `$n$`, zero for even. When `$\kappa t/L^2 = 0.1$`, the midpoint is at `$\frac{400}{\pi}e^{-0.987} \approx 47.5$` °C; the `$n = 3$` term adds only `$-0.006$` °C.

**Other end conditions.** Insulated ends (`$u_x = 0$`) give cosines, including `$n = 0$`: a constant that never decays, so the rod ends up at its initial mean temperature. Ends held at different temperatures `$T_1$`, `$T_2$`: first subtract the **steady state** `$u_s = T_1 + (T_2 - T_1)x/L$` (it solves `$u_{xx} = 0$` with the right end values); the remainder has zero ends and decays as above.

<div class="problem" data-problem="pde-rod-cooling"></div>

## 3. The wave equation: modes and d'Alembert

On a string with fixed ends the same separation gives `$\sin(n\pi x/L)$`, but now `$T'' = -c^2k_n^2T$`, so each mode **oscillates** with `$\omega_n = n\pi c/L$`:

```math
u = \sum_n\sin\frac{n\pi x}{L}\left(A_n\cos\omega_nt + B_n\sin\omega_nt\right), \quad A_n = \text{sine coefficients of } u(x, 0), \quad \omega_nB_n = \text{those of } u_t(x, 0)
```

A string plucked at its midpoint has no even harmonics (each has a node there). Released from rest means cosines in time; struck from a straight position means sines, with amplitude = initial velocity coefficient divided by `$\omega_n$`.

On an infinite line, d'Alembert's form is often faster:

```math
u(x, t) = \frac12\big[f(x - ct) + f(x + ct)\big] + \frac{1}{2c}\int_{x - ct}^{x + ct}g(s)\,ds
```

for `$u(x, 0) = f$`, `$u_t(x, 0) = g$`. A bump released from rest splits into two half-height copies. The value at `$(x_0, t_0)$` depends only on data in `$[x_0 - ct_0, x_0 + ct_0]$`, between the two **characteristics** `$x \pm ct = $` const: nothing travels faster than `$c$`.

The figure runs both equations on the same initial profile, mode by mode.

<figure class="fig" data-fig="rod-modes"><figcaption>A profile on [0, L] built from sine modes (thin curves: the first three). Under the heat equation each mode decays as e^(−n²π²κt/L²); under the wave equation each oscillates as cos(nπct/L). Fewer modes cannot reproduce sharp corners.</figcaption></figure>

<div class="meaning">

<dl>
<dt>Separation constant</dt><dd>the common value of two expressions in different variables; boundary conditions decide its sign and allowed values</dd>
<dt>Mode</dt><dd>one separated solution, a shape that keeps its form in time (decaying or oscillating)</dd>
<dt>Steady state</dt><dd>the time-independent solution carrying the non-zero boundary values; the rest is transient</dd>
<dt>Characteristic</dt><dd>a line along which a hyperbolic equation carries information</dd>
<dt>Physical meaning</dt><dd>Diffusion forgets detail at a rate set by length squared over diffusivity; waves keep every mode forever (without damping) and only rearrange their phases.</dd>
</dl>

</div>

## 4. Laplace's equation in a rectangle

`$u_{xx} + u_{yy} = 0$` in `$0 < x < a$`, `$0 < y < b$`, with `$u = 0$` on three sides and `$u(x, b) = f(x)$`. The direction with two zero conditions oscillates; the other gets hyperbolic functions:

```math
u = \sum_nc_n\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a}, \qquad c_n = \frac{f_n}{\sinh(n\pi b/a)}
```

where `$f_n$` are the sine coefficients of `$f$` (`$\sinh$`, not `$\cosh$`, because `$u = 0$` at `$y = 0$`). With several non-zero sides, solve one side at a time and add. **Symmetry shortcut:** in a square with one side at `$V_0$` and three at 0, the centre is at exactly `$V_0/4$`, because the four rotated problems add up to `$u = V_0$` everywhere.

A harmonic function equals its average over any circle inside its domain, so it has no interior maximum or minimum. The Dirichlet problem has exactly one solution; the Neumann problem has one up to a constant, and only if the total outward flux is zero.

## 5. Polar, cylindrical and spherical coordinates

**Polar (2D).** `$u = R(r)\Theta(\theta)$` gives `$\Theta = \cos m\theta, \sin m\theta$` (integer `$m$` for a single-valued answer) and `$R = r^m, r^{-m}$` (or `$1, \ln r$` for `$m = 0$`). Inside a disc of radius `$a$` with `$u(a, \theta) = \sum(a_m\cos m\theta + b_m\sin m\theta)$`, each harmonic simply picks up `$(r/a)^m$`. **Worked example:** `$u(a, \theta) = 8\cos2\theta$` gives `$u = 8(r/a)^2\cos2\theta$`, so `$u(a/2, 0) = 2$`.

Choose m and n, then press Play to see the drum vibrate in that mode.

<figure class="fig" data-fig="@math-bessel-drum"><figcaption>Notice that the colours swap between up and down, that the nodal lines (circles and diameters) never move, and that the rim is always still because kR is a zero of J_m.</figcaption></figure>

**Cylindrical.** With `$Z = e^{\pm kz}$` the radial equation is Bessel's equation of order `$m$` in `$kr$`: solutions `$J_m(kr)$` (regular on the axis) and `$Y_m(kr)$`. The Helmholtz equation and a drumhead give the same radial functions with the zeros of `$J_m$` setting the allowed `$k$` ([lesson 1.6](/learn/courses/gate-physics/special-functions/)).

**Spherical, axial symmetry.** `$u = \sum\left(A_\ell r^\ell + B_\ell r^{-(\ell+1)}\right)P_\ell(\cos\theta)$`. Inside a sphere keep `$r^\ell$`, outside keep `$r^{-(\ell+1)}$`, and match the surface data term by term in Legendre polynomials.

**Worked example.** A sphere of radius `$R$` has surface potential `$V_0\cos\theta = V_0P_1$`. Inside, `$V = V_0\frac rR\cos\theta$` (a uniform field); outside, `$V = V_0\frac{R^2}{r^2}\cos\theta$` (a dipole). At `$r = 2R$` on the axis, `$V_0/4$`.

For the Helmholtz equation `$\nabla^2u + k^2u = 0$` in spherical coordinates the radial functions become spherical Bessel functions `$j_\ell(kr)$`, with `$j_0 = \frac{\sin kr}{kr}$`. A hot ball with its surface held at 0 cools through `$j_0$` with `$k = \pi/a$`, four times faster than a slab of thickness `$2a$`.

<div class="myth">

**"The solution of the heat equation is the first Fourier term, so its amplitude is the initial temperature."** The first coefficient of a uniform profile `$U$` is `$4U/\pi \approx 1.27U$`, larger than `$U$` itself: the sine series has to overshoot in the middle to fit a flat profile that drops to zero at the ends. Always compute `$b_1$` from the integral, and subtract the steady state first when the ends are not at zero.

</div>

<div class="keypoints">

- `$B^2 - 4AC$`: negative elliptic, zero parabolic, positive hyperbolic; lower-order terms do not matter.
- Heat on a rod: `$\sin(n\pi x/L)e^{-\kappa n^2\pi^2t/L^2}$`, `$\tau_1 = L^2/(\pi^2\kappa)$`; insulated ends give cosines and a conserved mean; subtract the linear steady state for non-zero ends.
- Waves: `$\omega_n = n\pi c/L$`, coefficients from `$u(x, 0)$` and `$u_t(x, 0)/\omega_n$`; d'Alembert splits pulses; the domain of dependence is `$[x - ct, x + ct]$`.
- Laplace in a rectangle: sines along the two-zero direction, `$\sinh$` across, `$c_n = f_n/\sinh(n\pi b/a)$`. Max and min on the boundary.
- Polar: `$r^{\pm m}e^{\pm im\theta}$`. Cylindrical: `$J_m(kr)$`. Spherical: `$r^\ell$` inside, `$r^{-(\ell+1)}$` outside, times `$P_\ell(\cos\theta)$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [partial differential equations practice page](/learn/courses/gate-physics/practice/partial-differential-equations/).

<div class="qbank" data-bank="physics" data-topics="partial-differential-equations" data-exam="gate" data-n="10"></div>

fibub's [Heat conduction solver](/science/heat-conduction/) and [Standing waves calculator](/science/standing-waves/) let you try other rods and strings. **Before this:** [lesson 1.6, series solutions and special functions](/learn/courses/gate-physics/special-functions/). **Next:** [lesson 1.8, the Dirac delta and Green's functions](/learn/courses/gate-physics/delta-greens-functions/), which solve the same equations with sources. Back to the [GATE Physics course home](/learn/courses/gate-physics/).

**Going on to CSIR NET?** [Numerical methods](/learn/courses/csir-net-physics/numerical-methods/) solves the same equations by finite differences when separation of variables fails.
