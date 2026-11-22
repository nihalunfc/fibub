---
title: Fourier and Laplace transforms
seoTitle: Fourier and Laplace transforms | GATE Physics
summary: 'Fourier transforms and their conventions, the standard pairs (delta, box, Gaussian, exponential), shift, derivative and convolution rules, Parseval, width and bandwidth, Green''s functions, then Laplace transforms, solving differential and integral equations, initial and final values, Bromwich inversion by residues and causality.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: "With F(k) = ∫ f(x) e^(−ikx) dx, what is the transform of f′(x)?"
    choices: ['ik F(k)', '−ik F(k)', 'F′(k)', 'F(k)/(ik)']
    ans: 0
    why: "Integrating by parts moves the derivative onto e^(−ikx), which brings down −ik, and the minus sign from the parts formula makes it +ik. Derivatives become multiplication by ik."
  - q: "What is the Laplace transform of y′(t)?"
    choices: ['sY(s) − y(0)', 'sY(s)', 'Y(s)/s', 'Y′(s)']
    ans: 0
    why: "Integrating ∫ y′ e^(−st) dt by parts gives [y e^(−st)] from 0 to ∞ plus s∫ y e^(−st) dt, that is −y(0) + sY. The initial value comes in automatically."
  - q: A pulse is made three times narrower in time. What happens to the width of its spectrum?
    choices: ['It becomes three times wider', 'It becomes three times narrower', 'It does not change', 'It becomes nine times wider']
    ans: 0
    why: "f(ax) has transform F(k/a)/|a|: squeezing by a factor 3 in time stretches the spectrum by 3. The product of the two widths is fixed, which is the root of the uncertainty principle."
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapters 7, 8 and 15'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapters 19 and 20'
  - 'R. N. Bracewell, The Fourier Transform and Its Applications, 3rd ed. (2000), chapters 2 to 6'
  - 'E. Kreyszig, Advanced Engineering Mathematics, 10th ed. (2011), chapters 6 and 11'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to transform the standard functions in your head with any convention, use the shift, derivative, convolution and Parseval rules, read widths and line shapes off a spectrum, solve differential and integral equations with the Laplace transform, use the initial and final value theorems, and invert transforms with residues. Fourier series (the periodic case) are in the IIT JAM lesson on [Fourier series](/learn/courses/iit-jam-physics/fourier-series/), and ordinary differential equations in [differential equations](/learn/courses/iit-jam-physics/differential-equations/). Inversion uses [lesson 1.4 on residues](/learn/courses/gate-physics/residues/).

<div class="bigidea">A transform rewrites a function as a sum of pure exponentials. In that language derivatives become multiplication, convolutions become products, and a differential equation becomes algebra.</div>

## 1. From series to transform, and the conventions

A Fourier series writes a periodic function as a sum of harmonics. Let the period grow without bound and the harmonics crowd into a continuum: the sum becomes an integral. In this course

```math
\tilde f(k) = \int_{-\infty}^{\infty}f(x)\,e^{-ikx}\,dx, \qquad f(x) = \frac{1}{2\pi}\int_{-\infty}^{\infty}\tilde f(k)\,e^{ikx}\,dk
```

Press Play, then add terms with the slider and switch between the square, sawtooth and triangle waves.

<figure class="fig" data-fig="@math-fourier-build"><figcaption>Notice that each term is one rotating arm, that the square wave needs only odd harmonics, and that the overshoot near a jump (Gibbs) stays at about 9% however many terms you add.</figcaption></figure>

Books differ in where they put the `$2\pi$` (all in the inverse as here, `$1/\sqrt{2\pi}$` on each side, or `$e^{\mp2\pi i\nu t}$` with no factors at all) and in the sign of the exponent. **The physics is the same; the factors are not**, and exam options are built from exactly those factors. Read the convention in the question before you answer.

## 2. Standard pairs and rules

With the convention above (and `$a > 0$`):

| `$f(x)$` | `$\tilde f(k)$` |
|---|---|
| `$\delta(x - x_0)$` | `$e^{-ikx_0}$` |
| `$1$` | `$2\pi\delta(k)$` |
| box: 1 for `$\lvert x\rvert < a$`, else 0 | `$2\sin(ka)/k$` |
| `$\sin(ax)/(\pi x)$` | box: 1 for `$\lvert k\rvert < a$`, else 0 |
| `$e^{-x^2/2\sigma^2}$` | `$\sqrt{2\pi}\,\sigma\,e^{-\sigma^2k^2/2}$` |
| `$e^{-a\lvert x\rvert}$` | `$2a/(a^2 + k^2)$` (Lorentzian) |
| `$e^{-ax}$` for `$x > 0$`, else 0 | `$1/(a + ik)$` |
| `$\cos k_0x$` | `$\pi[\delta(k - k_0) + \delta(k + k_0)]$` |

Press Play to slide the flipped copy of g across f, or choose other shapes.

<figure class="fig" data-fig="@math-conv-slide"><figcaption>Notice that the output at each t is the area of the overlap, so two boxes give a triangle and a decaying g smears f forward in time.</figcaption></figure>

The rules that do most of the work:

- **Shift:** `$f(x - a) \to e^{-ika}\tilde f(k)$` (phase only); **modulation:** `$e^{ik_0x}f(x) \to \tilde f(k - k_0)$`.
- **Scaling:** `$f(ax) \to \tilde f(k/a)/\lvert a\rvert$`.
- **Derivative:** `$f'(x) \to ik\,\tilde f(k)$`; **multiplication by x:** `$xf(x) \to i\,\tilde f'(k)$`.
- **Convolution:** `$(f * g)(x) = \int f(y)g(x - y)\,dy \to \tilde f(k)\,\tilde g(k)$`, and a product goes to a convolution divided by `$2\pi$`.
- **Parseval (Plancherel):** `$\int\lvert\tilde f\rvert^2dk = 2\pi\int\lvert f\rvert^2dx$`.
- **Symmetry:** real `$f$` gives `$\tilde f(-k) = \tilde f(k)^*$`; real and even gives real and even; real and odd gives imaginary and odd.

**Worked example (Parseval as an integration tool).** Evaluate `$\int\frac{dk}{(1 + k^2)^2}$`.

1. `$e^{-\lvert x\rvert}$` has `$\tilde f = \frac{2}{1 + k^2}$`.
2. Parseval: `$\int\frac{4}{(1 + k^2)^2}dk = 2\pi\int e^{-2\lvert x\rvert}dx = 2\pi$`.
3. So the integral is `$\pi/2$`, the same as a residue calculation, with no residues at all.

Go one step further: the box convolved with itself is a triangle, whose transform is `$(2\sin k/k)^2$`; Parseval on the triangle then gives `$\int\frac{\sin^4x}{x^4}dx = \frac{2\pi}{3}$`.

<div class="meaning">

<dl>
<dt>f̃(k)</dt><dd>how much of the wave e^(ikx) is in f: amplitude and phase for each wavenumber</dd>
<dt>|f̃(k)|²</dt><dd>the power spectrum; for a wavefunction, proportional to the momentum distribution (p = ħk)</dd>
<dt>Convolution f * g</dt><dd>f smeared by g: every measured spectrum is the true one convolved with the instrument's response</dd>
<dt>F(s), Laplace</dt><dd>the response to e^(st) for complex s; poles of F are the natural modes e^(s₀t) of the system</dd>
<dt>Physical meaning</dt><dd>A system that is linear and does not change in time treats every exponential separately, so transforming to exponentials diagonalises it, just as eigenvectors diagonalise a matrix.</dd>
</dl>

</div>

## 3. Width and bandwidth

Squeeze a pulse and its spectrum spreads. Try each shape below: the box, the Gaussian and the two-sided exponential all trade width in `$x$` for width in `$k$`.

<figure class="fig" data-fig="pulse-spectrum"><figcaption>A pulse f(x) (top) and its transform F(k) (bottom). Narrower pulses have wider, lower spectra; the area under F(k) stays 2π f(0). Sharp edges give slowly decaying side lobes.</figcaption></figure>

- For the Gaussian, `$\sigma_k = 1/\sigma$`: widths multiply to 1, the smallest possible. With `$p = \hbar k$` and the widths of `$\lvert\psi\rvert^2$` and `$\lvert\tilde\psi\rvert^2$`, this becomes `$\Delta x\,\Delta p = \hbar/2$`.
- **Smoothness controls the tail.** A jump in `$f$` gives `$\tilde f \sim 1/k$` (the box); a kink (jump in `$f'$`) gives `$1/k^2$` (the two-sided exponential); a jump in `$f''$` gives `$1/k^3$`; the infinitely smooth Gaussian decays faster than any power. No non-zero function is confined in both `$x$` and `$k$`.
- **Line shapes.** A signal `$e^{-\gamma t}\cos\omega_0t$` for `$t > 0$` has a Lorentzian power spectrum `$\propto\frac{1}{\gamma^2 + (\omega - \omega_0)^2}$` near `$\omega_0$`, of full width at half maximum `$2\gamma$`: the faster the decay, the broader the line (natural line width).

See spectra of real signals in fibub's [Fourier visualiser](/science/fourier-visualiser/), the [FFT workbench](/science/fft-workbench/) and the [audio spectrum analyser](/science/audio-spectrum-analyser/).

## 4. Fourier transforms solve differential equations

Since `$d/dx \to ik$`, a linear equation with constant coefficients becomes algebra. **Green's function example:** the decaying solution of `$y'' - a^2y = -\delta(x)$`.

1. Transform: `$(-k^2 - a^2)\tilde y = -1$`, so `$\tilde y = \frac{1}{k^2 + a^2}$`.
2. Invert, by the pair `$e^{-a\lvert x\rvert} \leftrightarrow \frac{2a}{a^2 + k^2}$` or by residues (close above for `$x > 0$`): `$y = \frac{e^{-a\lvert x\rvert}}{2a}$`.
3. Check: `$y'$` jumps from `$+\tfrac12$` to `$-\tfrac12$` at the origin, a jump of `$-1$`, exactly what `$-\delta$` demands.

The solution for any source `$g(x)$` is then the convolution of `$g$` with this Green's function.

## 5. The Laplace transform

For functions that start at `$t = 0$` (initial value problems, switched-on signals), the Laplace transform is the natural tool:

```math
F(s) = \mathcal L\{f\}(s) = \int_0^{\infty}f(t)\,e^{-st}\,dt
```

It exists for large enough `$\text{Re}\,s$` when `$f$` grows at most exponentially and is integrable at `$t = 0$`. So `$e^{5t}\sin t$` and `$t^{-1/2}$` have transforms, while `$e^{t^2}$` and `$1/t$` do not.

| `$f(t)$` | `$F(s)$` |
|---|---|
| `$1$`, `$t^n$`, `$t^a$` (`$a > -1$`) | `$1/s$`, `$n!/s^{n+1}$`, `$\Gamma(a + 1)/s^{a+1}$` |
| `$e^{at}$` | `$1/(s - a)$` |
| `$\sin\omega t$`, `$\cos\omega t$` | `$\omega/(s^2 + \omega^2)$`, `$s/(s^2 + \omega^2)$` |
| `$\sinh\omega t$`, `$\cosh\omega t$` | `$\omega/(s^2 - \omega^2)$`, `$s/(s^2 - \omega^2)$` |
| `$\delta(t - a)$` | `$e^{-as}$` |

Rules:

```math
\mathcal L\{f'\} = sF - f(0), \qquad \mathcal L\{f''\} = s^2F - sf(0) - f'(0), \qquad \mathcal L\Big\{\int_0^tf\Big\} = \frac{F}{s}
```

plus `$e^{at}f \to F(s - a)$`, `$f(t - a)u(t - a) \to e^{-as}F(s)$`, `$tf \to -F'(s)$`, and the convolution `$\int_0^tf(\tau)g(t - \tau)\,d\tau \to FG$`. For a periodic `$f$` of period `$T$`, `$F = \frac{1}{1 - e^{-sT}}\int_0^Tfe^{-st}dt$`. Inverting usually means partial fractions and the table, with completing the square for complex poles: `$\frac{1}{s^2 + 2s + 5} = \frac{1}{(s + 1)^2 + 4} \leftrightarrow \tfrac12e^{-t}\sin2t$`.

## 6. Solving equations with Laplace

**Worked example.** Solve `$y'' + 3y' + 2y = 0$` with `$y(0) = 1$`, `$y'(0) = 0$`.

1. Transform, keeping every initial-value term: `$(s^2Y - s) + 3(sY - 1) + 2Y = 0$`.
2. `$Y = \frac{s + 3}{(s + 1)(s + 2)} = \frac{2}{s + 1} - \frac{1}{s + 2}$`.
3. `$y = 2e^{-t} - e^{-2t}$`. Check: `$y(0) = 1$`, `$y'(0) = -2 + 2 = 0$`.

<div class="problem" data-problem="flt-damped"></div>

**Integral equations** of convolution type collapse too. `$y(t) = t + \int_0^t(t - \tau)y(\tau)\,d\tau$` is `$y = t + t * y$`, so `$Y = \frac{1}{s^2} + \frac{Y}{s^2}$`, `$Y = \frac{1}{s^2 - 1}$` and `$y = \sinh t$`. For driven and damped oscillators in this language, revisit the JAM lesson on [damped and forced oscillations](/learn/courses/iit-jam-physics/damped-forced-oscillations/).

## 7. Limit theorems, inversion and causality

- **Initial value:** `$f(0^+) = \lim_{s\to\infty}sF(s)$`. For `$F = \frac{3s + 1}{s^2 + 2s + 5}$`, `$f(0^+) = 3$`.
- **Final value:** `$\lim_{t\to\infty}f = \lim_{s\to0}sF(s)$`, valid only when every pole of `$sF$` has negative real part. It fails for `$\sin t$` (poles at `$\pm i$`) and for growing functions.
- **Bromwich inversion:** `$f(t) = \frac{1}{2\pi i}\int_{c - i\infty}^{c + i\infty}F(s)e^{st}ds$`, with the line to the right of all poles. Closing to the left for `$t > 0$` gives `$f(t) = \sum\text{Res}[F(s)e^{st}]$` over all poles. So a pole at `$s_0$` contributes `$e^{s_0t}$`: poles in the right half-plane mean growth (instability), on the imaginary axis oscillation, in the left half-plane decay.
- **Laplace and Fourier.** For a causal `$f$` whose Laplace transform converges on the imaginary axis, `$F(i\omega)$` is its Fourier transform in the variable `$\omega$`. `$e^{2t}u(t)$` has a Laplace transform for `$\text{Re}\,s > 2$` but no ordinary Fourier transform.
- **Causality means analyticity.** A response `$\chi(t)$` that vanishes for `$t < 0$` has `$\tilde\chi(\omega) = \int_0^\infty\chi(t)e^{i\omega t}dt$` analytic in the upper half `$\omega$`-plane (there `$e^{i\omega t}$` decays). That analyticity is what links the real and imaginary parts of a susceptibility through the Kramers-Kronig relations.

<div class="myth">

**"The Fourier transform of `$e^{-\lvert x\rvert}$` is `$\frac{1}{1 + k^2}$`."** That is true only with no `$2\pi$` anywhere and a different normalisation. With `$\tilde f = \int fe^{-ikx}dx$` it is `$\frac{2}{1 + k^2}$`; with the symmetric `$1/\sqrt{2\pi}$` convention it is `$\sqrt{2/\pi}\,\frac{1}{1 + k^2}$`. Parseval also changes: `$\int\lvert\tilde f\rvert^2dk = 2\pi\int\lvert f\rvert^2dx$` in this course's convention, with no `$2\pi$` in the symmetric one. Memorise the pairs in one convention and convert, rather than half-remembering several.

</div>

<div class="keypoints">

- `$\tilde f(k) = \int fe^{-ikx}dx$`, `$f = \frac{1}{2\pi}\int\tilde fe^{ikx}dk$`. Check the convention before choosing an option.
- Pairs: `$\delta \to 1$`, box `$\to 2\sin ka/k$`, Gaussian `$\to$` Gaussian (`$\sigma_k = 1/\sigma$`), `$e^{-a\lvert x\rvert} \to 2a/(a^2 + k^2)$`, `$1 \to 2\pi\delta(k)$`.
- Shift gives a phase; derivative gives `$ik$`; convolution gives a product; Parseval `$\int\lvert\tilde f\rvert^2dk = 2\pi\int\lvert f\rvert^2dx$`.
- Narrow in `$x$` means wide in `$k$`; jumps give `$1/k$` tails, kinks `$1/k^2$`. A decay rate `$\gamma$` gives a Lorentzian of FWHM `$2\gamma$`.
- Laplace: `$\mathcal L\{f'\} = sF - f(0)$`, `$\mathcal L\{f''\} = s^2F - sf(0) - f'(0)$`, `$e^{at}f \to F(s - a)$`, delay `$\to e^{-as}F$`, `$tf \to -F'$`, `$\int_0^tf \to F/s$`, convolution `$\to FG$`.
- Initial value `$\lim_{s\to\infty}sF$`; final value `$\lim_{s\to0}sF$` only if the poles of `$sF$` are in the left half-plane. Inversion: sum of residues of `$F(s)e^{st}$`.
- Causal responses are analytic in one half of the complex frequency plane (Kramers-Kronig).

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [Fourier and Laplace transforms practice page](/learn/courses/gate-physics/practice/fourier-laplace-transforms/).

<div class="qbank" data-bank="physics" data-topics="fourier-laplace-transforms" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.4, the residue theorem and real integrals](/learn/courses/gate-physics/residues/). This completes the first block of mathematical physics; the remaining lessons of Module 1, starting with [series solutions: Legendre, Bessel and Hermite](/learn/courses/gate-physics/special-functions/), are listed on the [GATE Physics course home](/learn/courses/gate-physics/), and mixed practice is on the [GATE practice page](/learn/courses/gate-physics/practice/).
