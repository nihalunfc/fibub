---
title: 'Series solutions: Legendre, Bessel and Hermite'
seoTitle: Legendre, Bessel and Hermite functions | GATE Physics
summary: 'Ordinary and regular singular points, power series and the Frobenius method with its indicial equation, Legendre polynomials (Rodrigues, generating function, recurrences, orthogonality, expansions), associated Legendre functions, Bessel functions and their zeros, Hermite and Laguerre polynomials, and the gamma function.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: For Bessel's equation of order 1/3, what are the indicial roots at x = 0?
    choices: ['+1/3 and −1/3', '0 and 1', '0 and 1/3', '1/3 and 4/3']
    ans: 0
    why: "Putting y = x^s into x²y″ + xy′ + (x² − ν²)y = 0, the lowest power gives s² − ν² = 0, so s = ±ν = ±1/3. They differ by 2/3, not an integer, so J₁/₃ and J₋₁/₃ are two independent series solutions."
  - q: "What is the value of the integral of P₂(x)P₄(x) from −1 to 1?"
    choices: ['0', '2/5', '2/9', '1']
    ans: 0
    why: Different Legendre polynomials are orthogonal on [−1, 1] with weight 1. Only equal indices give a non-zero result, 2/(2n + 1).
  - q: With what weight are J₀(αₖr/a) for different zeros αₖ of J₀ orthogonal on [0, a]?
    choices: ['r', '1', 'e^(−r)', '1/r']
    ans: 0
    why: Bessel's equation in Sturm–Liouville form is (r y′)′ + … , so the weight is r, which is also the area element r dr dφ of the disc the functions live on.
sources:
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapters 7, 14, 15 and 18'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 12'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (2006), chapters 16 and 18'
  - 'NIST Digital Library of Mathematical Functions (dlmf.nist.gov), chapters 5, 10 and 18 (open access)'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to classify the points of a second-order linear equation, run the power-series and Frobenius methods (including the indicial equation and the log case), and use Legendre, Bessel, Hermite and Laguerre functions confidently: their recurrences, generating functions, orthogonality and norms, and how to expand a function in them. Constant-coefficient equations and the basic series method are in the JAM lesson on [differential equations](/learn/courses/iit-jam-physics/differential-equations/); here we go further.

<div class="bigidea">When separation of variables meets a sphere, a cylinder or a parabola-shaped potential, the equations that come out have variable coefficients. Their well-behaved solutions are special functions: polynomials or series that are orthogonal, just like sines and cosines, so any reasonable function can be expanded in them.</div>

## 1. Ordinary and singular points

Write the equation in standard form `$y'' + p(x)y' + q(x)y = 0$`.

- `$x_0$` is an **ordinary point** if `$p$` and `$q$` are analytic there. Then two independent power series `$y = \sum a_k(x - x_0)^k$` exist, converging at least up to the nearest singular point.
- `$x_0$` is a **regular singular point** if `$p$` or `$q$` blows up, but `$(x - x_0)p$` and `$(x - x_0)^2q$` stay analytic. Then at least one **Frobenius** solution `$y = (x - x_0)^s\sum a_k(x - x_0)^k$` exists.
- Otherwise it is an **irregular singular point**, and neither method is guaranteed.

Legendre's equation `$(1 - x^2)y'' - 2xy' + \ell(\ell + 1)y = 0$` has an ordinary point at 0 and regular singular points at `$\pm1$`. Bessel's equation `$x^2y'' + xy' + (x^2 - \nu^2)y = 0$` has a regular singular point at 0. Hermite's equation `$y'' - 2xy' + 2\nu y = 0$` has no finite singular points at all.

## 2. Power series, Frobenius and the indicial equation

**At an ordinary point**, substitute `$y = \sum a_kx^k$`, collect the coefficient of each power and get a **recurrence**. For Hermite's equation, matching `$x^k$`:

```math
a_{k+2} = \frac{2(k - \nu)}{(k + 2)(k + 1)}\,a_k
```

Two free constants `$a_0$`, `$a_1$` start the even and odd series. If `$\nu$` is a non-negative integer, one series stops: a polynomial. Otherwise `$a_{k+2}/a_k \to 2/k$`, the series grows like `$e^{x^2}$`, and the oscillator wavefunction `$ye^{-x^2/2}$` would blow up. Demanding a normalisable state is what forces `$\nu = n$` and gives `$E_n = (n + \tfrac12)\hbar\omega$` ([lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/)).

**At a regular singular point**, put `$y = x^s\sum a_kx^k$` with `$a_0 \ne 0$`. Write `$p_0 = \lim xp$` and `$q_0 = \lim x^2q$`. The lowest power gives the **indicial equation**

```math
s(s - 1) + p_0s + q_0 = 0
```

with roots `$s_1 \ge s_2$` (for real roots). Then:

- `$s_1 - s_2$` **not an integer**: two independent Frobenius series.
- `$s_1 = s_2$`: one series, and the second solution contains `$y_1\ln x$`.
- `$s_1 - s_2$` **a positive integer**: the larger root always works; the smaller may or may not, and if it fails a `$\ln x$` term appears.

**Worked example.** `$2x^2y'' + 3xy' - (1 + x)y = 0$`. Here `$p_0 = \tfrac32$`, `$q_0 = -\tfrac12$`: `$s(s - 1) + \tfrac32s - \tfrac12 = 0$`, i.e. `$2s^2 + s - 1 = 0$`, so `$s = \tfrac12$` or `$-1$`. The difference `$\tfrac32$` is not an integer, so there are two Frobenius series, starting as `$x^{1/2}$` and `$x^{-1}$`.

<div class="meaning">

<dl>
<dt>Ordinary point</dt><dd>coefficients are smooth there; plain power series work</dd>
<dt>Regular singular point</dt><dd>coefficients blow up, but only mildly; a power times a series works</dd>
<dt>Indicial equation</dt><dd>the condition from the lowest power that fixes the leading exponent s</dd>
<dt>Orthogonal with weight w</dt><dd>the integral of f_m f_n w over the interval is zero for m ≠ n</dd>
<dt>Generating function</dt><dd>one closed-form function whose Taylor coefficients are the whole family</dd>
<dt>Physical meaning</dt><dd>Legendre functions are the angular shapes of fields with axial symmetry, Bessel functions the radial shapes of drum and waveguide modes, Hermite functions the oscillator states. The index counts nodes.</dd>
</dl>

</div>

## 3. Legendre polynomials

The polynomial solutions of Legendre's equation with `$\ell = n$` (integer), normalised so `$P_n(1) = 1$`:

```math
P_0 = 1,\quad P_1 = x,\quad P_2 = \tfrac12(3x^2 - 1),\quad P_3 = \tfrac12(5x^3 - 3x),\quad P_4 = \tfrac18(35x^4 - 30x^2 + 3)
```

The toolbox:

- **Rodrigues:** `$P_n = \frac{1}{2^nn!}\frac{d^n}{dx^n}(x^2 - 1)^n$`.
- **Generating function:** `$\frac{1}{\sqrt{1 - 2xt + t^2}} = \sum_n P_n(x)t^n$`. With `$x = \cos\gamma$` and `$t = r_</r_>$` it is the expansion of `$1/|\mathbf r - \mathbf r'|$`, the start of every multipole expansion in electrostatics.
- **Bonnet recurrence:** `$(n + 1)P_{n+1} = (2n + 1)xP_n - nP_{n-1}$`. Equivalently `$xP_n = \frac{(n + 1)P_{n+1} + nP_{n-1}}{2n + 1}$`.
- **Values:** `$P_n(1) = 1$`, `$P_n(-1) = (-1)^n$`, `$P_n(-x) = (-1)^nP_n(x)$`; `$P_{2m+1}(0) = 0$`, `$P_{2m}(0) = (-1)^m\frac{(2m - 1)!!}{(2m)!!}$`.
- **Orthogonality:** `$\int_{-1}^{1}P_mP_n\,dx = \frac{2}{2n + 1}\delta_{mn}$`.

To expand `$f(x) = \sum c_\ell P_\ell(x)$`, multiply by `$P_\ell$` and integrate:

```math
c_\ell = \frac{2\ell + 1}{2}\int_{-1}^{1}f(x)P_\ell(x)\,dx
```

For a polynomial it is faster to rewrite powers: `$x^2 = \tfrac13P_0 + \tfrac23P_2$`, `$x^3 = \tfrac35P_1 + \tfrac25P_3$`.

**Worked example.** `$\int_{-1}^{1}x^3P_3\,dx$`: only the `$\tfrac25P_3$` part survives, giving `$\frac25\cdot\frac27 = \frac{4}{35}$`. And `$\int_{-1}^{1}xP_2P_3\,dx = \frac35\cdot\frac27 = \frac{6}{35}$`, using `$xP_2 = \frac{3P_3 + 2P_1}{5}$`.

<div class="problem" data-problem="sfn-legendre-coeff"></div>

**Associated Legendre functions** `$P_\ell^m = (1 - x^2)^{m/2}\frac{d^m}{dx^m}P_\ell$` solve the equation with an extra `$-\frac{m^2}{1 - x^2}y$` term, which appears when the field depends on `$\phi$` as `$e^{im\phi}$`. They vanish for `$m > \ell$`, so `$m$` runs from `$-\ell$` to `$\ell$`: `$2\ell + 1$` spherical harmonics `$Y_\ell^m$` for each `$\ell$`, as in [lesson 4.5 on angular momentum](/learn/courses/gate-physics/angular-momentum/).

## 4. Bessel functions

Bessel's equation of order `$\nu$` has indicial roots `$\pm\nu$`. The Frobenius series with `$s = \nu$` is

```math
J_\nu(x) = \sum_{m=0}^{\infty}\frac{(-1)^m}{m!\,\Gamma(m + \nu + 1)}\left(\frac x2\right)^{2m + \nu}
```

Choose m and n, then press Play to see the drum vibrate in that mode.

<figure class="fig" data-fig="@math-bessel-drum"><figcaption>Notice that the colours swap between up and down, that the nodal lines (circles and diameters) never move, and that the rim is always still because kR is a zero of J_m.</figcaption></figure>

so `$J_0(0) = 1$` and `$J_n(0) = 0$` for `$n \ge 1$`. For non-integer `$\nu$`, `$J_{-\nu}$` is a second solution. For integer `$n$`, `$J_{-n} = (-1)^nJ_n$` is not new, and the second solution `$Y_n$` (Neumann) is singular at the origin: `$Y_0 \sim \frac2\pi\ln x$`, `$Y_n \sim -\frac{(n - 1)!}{\pi}\left(\frac2x\right)^n$`. Problems that include the axis keep only `$J_n$`.

- **Generating function:** `$e^{(x/2)(t - 1/t)} = \sum_{n=-\infty}^{\infty}J_n(x)t^n$`.
- **Recurrences:** `$J_{n-1} + J_{n+1} = \frac{2n}{x}J_n$` and `$J_{n-1} - J_{n+1} = 2J_n'$`; so `$J_0' = -J_1$` and `$\frac{d}{dx}[x^nJ_n] = x^nJ_{n-1}$`.
- **Half-integer orders are elementary:** `$J_{1/2} = \sqrt{\frac{2}{\pi x}}\sin x$`, `$J_{-1/2} = \sqrt{\frac{2}{\pi x}}\cos x$`. These give the spherical Bessel functions `$j_\ell$` met in [lesson 1.7](/learn/courses/gate-physics/partial-differential-equations/).
- **Large x:** `$J_n(x) \approx \sqrt{\frac{2}{\pi x}}\cos\left(x - \frac{n\pi}{2} - \frac\pi4\right)$`: a decaying cosine, so infinitely many zeros, spaced by about `$\pi$` far out. The first zeros of `$J_0$` are `$2.405, 5.520, 8.654$`; of `$J_1$`, `$3.832, 7.016$`.
- **Orthogonality on a disc:** if `$\alpha_k$` are zeros of `$J_n$`, then

```math
\int_0^1xJ_n(\alpha_kx)J_n(\alpha_lx)\,dx = \frac12J_{n+1}^2(\alpha_k)\,\delta_{kl}
```

**Worked example.** A drumhead of radius `$a$`, fixed at the rim, has axially symmetric modes `$J_0(kr)$` with `$ka = \alpha_{0k}$`. The second mode is at `$5.520/2.405 = 2.295$` times the fundamental frequency: not 2, which is why a drum does not sound a clear note.

## 5. Hermite, Laguerre and the gamma function

**Hermite** (physicists'): `$H_0 = 1$`, `$H_1 = 2x$`, `$H_2 = 4x^2 - 2$`, `$H_3 = 8x^3 - 12x$`, `$H_4 = 16x^4 - 48x^2 + 12$`. Generating function `$e^{2xt - t^2} = \sum H_nt^n/n!$`, Rodrigues `$H_n = (-1)^ne^{x^2}\frac{d^n}{dx^n}e^{-x^2}$`, recurrences `$H_{n+1} = 2xH_n - 2nH_{n-1}$` and `$H_n' = 2nH_{n-1}$`, and

```math
\int_{-\infty}^{\infty}H_mH_ne^{-x^2}dx = 2^nn!\sqrt\pi\,\delta_{mn}
```

**Laguerre:** `$L_0 = 1$`, `$L_1 = 1 - x$`, `$L_2 = \tfrac12(x^2 - 4x + 2)$`, orthonormal with weight `$e^{-x}$` on `$[0, \infty)$`; their associated forms carry the radial part of hydrogen.

**Gamma function:** `$\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}dt$`, with `$\Gamma(x + 1) = x\Gamma(x)$`, `$\Gamma(n + 1) = n!$`, `$\Gamma(\tfrac12) = \sqrt\pi$` and poles at `$0, -1, -2, \ldots$`. It turns Gaussian moments into one line: `$\int_0^\infty x^{2k}e^{-ax^2}dx = \frac{\Gamma(k + \frac12)}{2a^{k + 1/2}}$`. So `$\int_0^\infty x^4e^{-x^2}dx = \frac12\Gamma(\tfrac52) = \frac{3\sqrt\pi}{8}$`.

The figure lets you see orthogonality instead of taking it on trust: the shaded product of two different functions has as much area above the axis as below.

<figure class="fig" data-fig="special-polys"><figcaption>Two members of one family (Legendre, normalised Hermite functions, or J₀ with different zeros) and their weighted product. The readout integrates the product: zero for different indices, the norm for equal ones.</figcaption></figure>

<div class="myth">

**"Orthogonal functions are always orthogonal with weight 1."** Only Legendre (and Fourier) are. Hermite needs `$e^{-x^2}$`, Laguerre `$e^{-x}$`, Chebyshev `$1/\sqrt{1 - x^2}$`, and Bessel functions on a disc need the weight `$x$`. Each weight comes from writing the equation in Sturm–Liouville form `$(py')' + qy + \lambda wy = 0$`; for physical problems it is usually the volume element (`$r\,dr$` on a disc) or the square of a decaying envelope.

</div>

<div class="keypoints">

- Ordinary point: power series. Regular singular point: Frobenius `$x^s\sum a_kx^k$` with `$s(s - 1) + p_0s + q_0 = 0$`. Log terms only for equal roots or roots differing by an integer.
- Polynomial solutions appear when a series terminates; for Hermite that is energy quantisation.
- Legendre: `$P_n(1) = 1$`, parity `$(-1)^n$`, norm `$\frac{2}{2n + 1}$`, `$c_\ell = \frac{2\ell + 1}{2}\int fP_\ell$`, Bonnet recurrence, generating function `$(1 - 2xt + t^2)^{-1/2}$`.
- Bessel: roots `$\pm\nu$`, `$J_n(0) = \delta_{n0}$`, `$J_{-n} = (-1)^nJ_n$`, `$Y_n$` singular at 0, `$J_{n-1} \pm J_{n+1}$` recurrences, `$J_{1/2} = \sqrt{2/\pi x}\sin x$`, weight `$x$` on a disc.
- Hermite: norm `$2^nn!\sqrt\pi$` with weight `$e^{-x^2}$`, `$H_n' = 2nH_{n-1}$`. Laguerre: weight `$e^{-x}$`. `$\Gamma(\tfrac12) = \sqrt\pi$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [special functions practice page](/learn/courses/gate-physics/practice/special-functions/).

<div class="qbank" data-bank="physics" data-topics="special-functions" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.5, Fourier and Laplace transforms](/learn/courses/gate-physics/fourier-laplace-transforms/). **Next:** [lesson 1.7, partial differential equations](/learn/courses/gate-physics/partial-differential-equations/), where these functions appear from separation of variables. Back to the [GATE Physics course home](/learn/courses/gate-physics/).
