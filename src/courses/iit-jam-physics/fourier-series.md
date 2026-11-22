---
title: Fourier series
seoTitle: Fourier series for IIT JAM Physics
summary: 'How any periodic signal is built from sines and cosines: the coefficient formulas and where they come from, even and odd shortcuts, half-range series, what happens at jumps (and the Gibbs overshoot), Parseval''s theorem and power, the complex form, and summing famous series.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The Fourier series of f(x) = x on (−π, π) contains which terms?'
    choices: ['Only sine terms', 'Only cosine terms and a constant', 'Both sines and cosines', 'Only a constant']
    ans: 0
    why: 'x is an odd function. x cos nx is odd too, so every cosine coefficient (and the constant) integrates to zero over the symmetric interval.'
  - q: 'At a jump from −1 to +1, what does the Fourier series converge to?'
    choices: ['0, the average of the two sides', '+1', '−1', 'It does not converge there']
    ans: 0
    why: 'Dirichlet''s theorem: at a jump the series converges to the midpoint of the jump, here (−1 + 1)/2 = 0.'
  - q: 'As more terms of the series of a square wave are added, what happens to the overshoot next to each jump?'
    choices: ['It stays about 9% of the jump but gets narrower', 'It shrinks to zero', 'It grows without limit', 'It moves to the middle of the flat part']
    ans: 0
    why: 'That is the Gibbs phenomenon. The overshoot squeezes towards the jump as terms are added, but its height settles near 9% of the jump.'
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 7: Fourier series and transforms'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 19'
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapter 2 (Fourier analysis of periodic motion)'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 45 minutes.** By the end you will be able to find the Fourier series of the standard waves quickly, use symmetry to skip most of the integrals, say what the series does at a jump, explain the Gibbs overshoot, use Parseval's theorem for power and RMS values, switch to the complex form, and evaluate sums like `$\sum1/n^2$` from a series.

<div class="bigidea">Any repeating signal, however jagged, is a sum of pure tones at whole-number multiples of its frequency. The Fourier coefficients say how loud each tone is.</div>

## 1. Building a wave from sines

A function with period `$2\pi$` can be written as

```math
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty}\left(a_n\cos nx + b_n\sin nx\right)
```

Press Play, then add terms with the slider and switch between the square, sawtooth and triangle waves.

<figure class="fig" data-fig="@math-fourier-build"><figcaption>Notice that each term is one rotating arm, that the square wave needs only odd harmonics, and that the overshoot near a jump (Gibbs) stays at about 9% however many terms you add.</figcaption></figure>

Each term repeats every `$2\pi$` (and also at shorter intervals), so the sum does too. The term `$n = 1$` is the **fundamental**; `$n = 2, 3, \dots$` are the **harmonics**. A guitar note, the voltage out of a rectifier, a square clock pulse: all of them are sums like this. Choose a wave below and add harmonics one at a time.

<figure class="fig" data-fig="fourier-gibbs"><figcaption>A handful of terms already gives the shape. Near a jump, the partial sums overshoot by about 9% of the jump however many terms you keep (Gibbs). The triangle wave has no jumps and converges smoothly.</figcaption></figure>

## 2. The coefficients and why they work

The whole method rests on **orthogonality**: over one period, the product of two different members of the set `$\{1, \cos nx, \sin nx\}$` integrates to zero, while a square gives `$\pi$`:

```math
\int_{-\pi}^{\pi}\cos mx\cos nx\,dx = \pi\,\delta_{mn}, \quad \int_{-\pi}^{\pi}\sin mx\sin nx\,dx = \pi\,\delta_{mn}, \quad \int_{-\pi}^{\pi}\sin mx\cos nx\,dx = 0
```

So to pick out one coefficient, multiply the series by that function and integrate: every other term dies.

<div class="steps">
<div class="step"><p><b>Start from the series.</b> f(x) = a₀/2 + Σ(a<sub>n</sub> cos nx + b<sub>n</sub> sin nx).</p></div>
<div class="step"><p><b>Multiply by cos mx.</b> Integrate both sides from −π to π.</p></div>
<div class="step"><p><b>Orthogonality kills the rest.</b> Every sine term and every cosine with n ≠ m integrates to zero. Only a<sub>m</sub> cos² mx survives, giving π a<sub>m</sub>.</p></div>
<div class="step"><p><b>Read off the coefficient.</b> a<sub>m</sub> = (1/π)∫ f(x) cos mx dx. The same with sin mx gives b<sub>m</sub>.</p></div>
<div class="step"><p><b>The constant.</b> With m = 0, cos 0 = 1 integrates to 2π, which is why the series is written with a₀/2: the formula for a<sub>n</sub> then works for n = 0 too, and a₀/2 is the average of f.</p></div>
</div>

```math
a_n = \frac1\pi\int_{-\pi}^{\pi}f(x)\cos nx\,dx, \qquad b_n = \frac1\pi\int_{-\pi}^{\pi}f(x)\sin nx\,dx
```

For period `$2L$` replace `$nx$` by `$n\pi x/L$` and `$\tfrac1\pi\int_{-\pi}^{\pi}$` by `$\tfrac1L\int_{-L}^{L}$`.

**Symmetry does half the work.** If `$f$` is **even**, every `$b_n = 0$` and `$a_n = \tfrac2\pi\int_0^\pi f\cos nx\,dx$`. If `$f$` is **odd**, every `$a_n = 0$` and `$b_n = \tfrac2\pi\int_0^\pi f\sin nx\,dx$`. Check symmetry before integrating anything.

**Worked example: the square wave.** `$f = +1$` on `$(0, \pi)$`, `$-1$` on `$(-\pi, 0)$`. It is odd, so

```math
b_n = \frac2\pi\int_0^\pi\sin nx\,dx = \frac{2}{n\pi}(1 - \cos n\pi) = \begin{cases} 4/(n\pi) & n \text{ odd} \\ 0 & n \text{ even} \end{cases}
```

and `$f = \dfrac4\pi\left(\sin x + \dfrac{\sin3x}{3} + \dfrac{\sin5x}{5} + \dots\right)$`. Only odd harmonics: a symmetric square wave has no even ones.

<div class="problem" data-problem="square-wave-coeff"></div>

**Worked example: `$f = x$`.** Odd again. `$b_n = \tfrac2\pi\int_0^\pi x\sin nx\,dx = 2(-1)^{n+1}/n$`, so `$x = 2\left(\sin x - \tfrac12\sin2x + \tfrac13\sin3x - \dots\right)$` on `$(-\pi, \pi)$`. Likewise `$x^2 = \dfrac{\pi^2}{3} + 4\sum\dfrac{(-1)^n}{n^2}\cos nx$`.

**Finite series.** A product of sines and cosines is already a finite Fourier series; use identities, not integrals. `$\sin^3x = \tfrac14(3\sin x - \sin3x)$` and `$4\cos^2x = 2 + 2\cos2x$`.

## 3. What happens at a jump

**Dirichlet's theorem.** If `$f$` is piecewise smooth, its Fourier series converges to `$f(x)$` wherever `$f$` is continuous, and to the **average** `$\tfrac12[f(x^-) + f(x^+)]$` at a jump. The ends of the interval count: for `$e^x$` on `$(-\pi, \pi)$` the periodic copy jumps from `$e^\pi$` to `$e^{-\pi}$` at `$x = \pi$`, so the series gives `$\cosh\pi$` there.

**Smoothness and decay.** The smoother the periodic function, the faster its coefficients fall: jumps give `$1/n$` (square wave, sawtooth), corners give `$1/n^2$` (triangle wave, `$|\sin x|$`), a jump only in the second derivative gives `$1/n^3$`. Fast decay means few terms are enough.

<div class="myth">

**"With enough terms the Fourier series of a square wave matches it perfectly everywhere."** Not quite. At every fixed point it does converge, but right next to each jump the partial sums always overshoot by about 9% of the jump (the Gibbs phenomenon). Adding terms only squeezes the overshoot closer to the jump. For a jump from `$-1$` to `$+1$` the peak stays near `$1.18$`. Continuous waves such as the triangle wave have no overshoot at all.

</div>

**Half-range series.** A function given only on `$(0, L)$` can be extended either evenly (giving a pure cosine series) or oddly (a pure sine series). Both match `$f$` inside `$(0, L)$`, but they behave differently at the ends: the sine series of `$f = 1$` gives `$0$` at `$x = 0$`, the average of the jump from `$-1$` to `$1$` in the odd extension. Half-range sine series are exactly the standing-wave modes of a string fixed at both ends.

## 4. Power: Parseval's theorem

The mean square of a periodic function is shared among its harmonics:

```math
\frac{1}{2\pi}\int_{-\pi}^{\pi}f^2\,dx = \left(\frac{a_0}{2}\right)^2 + \frac12\sum_{n=1}^{\infty}\left(a_n^2 + b_n^2\right)
```

Each harmonic carries half its amplitude squared (the average of `$\sin^2$` is `$\tfrac12$`), and cross terms average to zero by orthogonality.

<div class="meaning">

<dl>
<dt>a₀/2</dt><dd>the average (DC) level of the signal</dd>
<dt>√(a<sub>n</sub>² + b<sub>n</sub>²)</dt><dd>the amplitude of the n-th harmonic</dd>
<dt>(a<sub>n</sub>² + b<sub>n</sub>²)/2</dt><dd>the share of mean-square power the n-th harmonic carries</dd>
<dt>Physical meaning</dt><dd>The spectrum of a sound is its list of harmonic amplitudes: a clarinet and a flute playing the same note differ only in these numbers. Power and RMS values simply add over harmonics.</dd>
</dl>

</div>

**Worked example.** `$v = 5 + 4\sin\omega t + 3\cos2\omega t$` volts. Mean square `$= 25 + 8 + 4.5 = 37.5$`, so `$V_{\rm rms} = \sqrt{37.5} = 6.12$` V. For the `$\pm1$` square wave, the fundamental alone carries `$\tfrac12(4/\pi)^2 = 8/\pi^2 = 81\%$` of the power.

**Summing series.** Evaluating a series at a clever point, or applying Parseval, gives famous sums. The square wave at `$x = \pi/2$` gives `$1 - \tfrac13 + \tfrac15 - \dots = \pi/4$`. Parseval for the square wave gives `$1 + \tfrac19 + \tfrac1{25} + \dots = \pi^2/8$`. The series of `$x^2$` at `$x = \pi$` gives `$\sum1/n^2 = \pi^2/6$`, and Parseval on it gives `$\sum1/n^4 = \pi^4/90$`.

## 5. The complex form and driven systems

With Euler's formula ([lesson 1.9](/learn/courses/iit-jam-physics/complex-numbers/)) the series becomes tidier:

```math
f(x) = \sum_{n=-\infty}^{\infty}c_ne^{inx}, \qquad c_n = \frac{1}{2\pi}\int_{-\pi}^{\pi}f(x)e^{-inx}\,dx, \qquad c_{\pm n} = \tfrac12(a_n\mp ib_n)
```

For real `$f$`, `$c_{-n} = c_n^*$` and `$c_0$` is the average. This is the form that grows into the Fourier transform when the period becomes infinite.

**Why physicists love it: linear systems.** A linear system (a spring, an LCR circuit) responds to each harmonic separately, so you can solve for one sine at a time and add. An oscillator `$\ddot x + \omega_0^2x = F(t)$` driven by a periodic force responds to harmonic `$n$` with amplitude `$F_n/|\omega_0^2 - n^2\omega^2|$`: it resonates if `$\omega_0$` matches **any** harmonic present. A symmetric square wave at 1 Hz drives a 3 Hz oscillator to resonance but not a 2 Hz one. See [damped and forced oscillations](/learn/courses/iit-jam-physics/damped-forced-oscillations/).

<div class="keypoints">

- `$f = a_0/2 + \sum(a_n\cos nx + b_n\sin nx)$`, `$a_n = \tfrac1\pi\int f\cos nx$`, `$b_n = \tfrac1\pi\int f\sin nx$`; orthogonality makes it work; `$a_0/2$` is the average.
- Even `$f$`: cosines only. Odd `$f$`: sines only. Period `$2L$`: use `$n\pi x/L$` and `$\tfrac1L$`.
- Square wave `$\tfrac4\pi\sum_{\text{odd}}\sin nx/n$`; `$x = 2\sum(-1)^{n+1}\sin nx/n$`; `$x^2 = \pi^2/3 + 4\sum(-1)^n\cos nx/n^2$`.
- At a jump the series gives the average; next to it the Gibbs overshoot stays near 9% of the jump. Jumps give `$1/n$` coefficients, corners `$1/n^2$`.
- Parseval: mean square `$= (a_0/2)^2 + \tfrac12\sum(a_n^2 + b_n^2)$`; RMS values add in quadrature over harmonics.
- Complex form `$c_n = \tfrac1{2\pi}\int fe^{-inx}$`, `$c_{-n} = c_n^*$`. Linear systems respond harmonic by harmonic.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [Fourier series practice page](/learn/courses/iit-jam-physics/practice/fourier-series/).

<div class="qbank" data-bank="physics" data-topics="fourier-series" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.9, complex numbers and Euler's formula](/learn/courses/iit-jam-physics/complex-numbers/). **Next:** module 2 begins with [Newton's laws, inertial and non-inertial frames](/learn/courses/iit-jam-physics/newtons-laws-frames/). Fourier ideas return in [diffraction](/learn/courses/iit-jam-physics/diffraction/), where a far-field pattern is the Fourier transform of the aperture, and in the [Schrödinger equation](/learn/courses/iit-jam-physics/schrodinger-equation/), where box states are a half-range sine series. Draw any wave as a sum of turning arrows in fibub's [Fourier visualiser](/science/fourier-visualiser/). Going on to GATE? The GATE Physics course continues with [Fourier and Laplace transforms](/learn/courses/gate-physics/fourier-laplace-transforms/).
