---
title: Random variables and probability distributions
seoTitle: Probability distributions for CSIR NET Physics
summary: 'Random variables, mean, variance and moments; the binomial, Poisson, Gaussian, uniform, exponential and Cauchy distributions and the limits that connect them; counting statistics, random walks and the central limit theorem; changing variables, characteristic functions and cumulants; Bayes'' theorem and covariance.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A counter records 900 counts in a fixed time. The fractional uncertainty of this count is about'
    choices: ['3.3%', '0.11%', '30%', '1%']
    ans: 0
    why: 'Counts follow Poisson statistics, so σ = √900 = 30 and the fractional uncertainty is 30/900 = 1/30 ≈ 3.3%.'
  - q: 'A random walker takes 400 independent unit steps, left or right with equal probability. Its rms distance from the start is'
    choices: ['20', '400', '200', '10']
    ans: 0
    why: 'Variances of independent steps add: ⟨x²⟩ = N × 1 = 400, so x_rms = √400 = 20.'
  - q: 'Which distribution has no finite variance, so that the central limit theorem does not apply to it?'
    choices: ['Lorentzian (Cauchy)', 'Poisson', 'Exponential', 'Uniform']
    ans: 0
    why: 'The Lorentzian falls off only as 1/x², so the integral of x² times it diverges. Averages of Cauchy variables stay Cauchy.'
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 15'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (1965), chapter 1'
  - 'P. R. Bevington and D. K. Robinson, Data Reduction and Error Analysis for the Physical Sciences, 3rd ed. (2003), chapters 2 and 3'
  - 'CSIR-UGC NET Physical Sciences syllabus, Mathematical Methods of Physics (probability and random variables)'
---

**Module 2 · about 50 minutes.** By the end you will be able to compute means, variances and probabilities for the standard distributions, know when one turns into another, handle counting statistics and random walks, change variables in a probability density, and use characteristic functions and Bayes' theorem. NET puts one or two of these in Part C and many more in Part A.

<div class="bigidea">Physics is full of randomness that follows strict rules: decays, photon counts, thermal motion, measurement errors. A handful of distributions, and the two limits that join them (Poisson and Gaussian), describe nearly all of it.</div>

## 1. Random variables, mean and variance

A random variable `$X$` takes values with probabilities `$P(x_i)$` (discrete) or a density `$p(x)$` (continuous), normalised to 1. Averages are weighted sums:

```math
\langle f(X)\rangle = \sum_i f(x_i)P(x_i) \quad\text{or}\quad \int f(x)\,p(x)\,dx, \qquad \sigma^2 = \langle X^2\rangle - \langle X\rangle^2
```

Rules that save time: `$\langle aX + b\rangle = a\langle X\rangle + b$`; `$\mathrm{Var}(aX + b) = a^2\mathrm{Var}\,X$`; for **independent** variables `$\langle XY\rangle = \langle X\rangle\langle Y\rangle$` and variances add, for sums and differences alike. The **covariance** `$\langle XY\rangle - \langle X\rangle\langle Y\rangle$` is zero for independent variables, but zero covariance does not prove independence (take `$Y = X^2$` with `$X$` symmetric about 0).

**Worked example.** Uniform on `$[0, a]$`: `$\langle x\rangle = a/2$`, `$\langle x^2\rangle = a^2/3$`, so `$\sigma^2 = a^2/12$`.

## 2. The standard distributions

| Distribution | Formula | Mean | Variance | Where it appears |
|---|---|---|---|---|
| binomial | `$\binom nk p^k(1-p)^{n-k}$` | `$np$` | `$np(1-p)$` | `$n$` yes/no trials |
| Poisson | `$\lambda^ke^{-\lambda}/k!$` | `$\lambda$` | `$\lambda$` | counts of rare independent events |
| Gaussian | `$\frac{1}{\sqrt{2\pi}\sigma}e^{-(x-\mu)^2/2\sigma^2}$` | `$\mu$` | `$\sigma^2$` | sums of many small effects |
| exponential | `$\lambda e^{-\lambda t}$` | `$1/\lambda$` | `$1/\lambda^2$` | waiting times, lifetimes |
| uniform | `$1/(b-a)$` | `$(a+b)/2$` | `$(b-a)^2/12$` | random phases |
| Cauchy | `$\frac{\gamma/\pi}{x^2 + \gamma^2}$` | undefined | infinite | natural line shapes |

<div class="meaning">

<dl>
<dt>λ</dt><dd>the mean number of events in the interval (Poisson), or the rate (exponential)</dd>
<dt>σ</dt><dd>the standard deviation: the typical spread about the mean</dd>
<dt>√N</dt><dd>the counting uncertainty: N counts carry an uncertainty √N, a fraction 1/√N</dd>
<dt>FWHM</dt><dd>full width at half maximum: 2√(2 ln 2) σ ≈ 2.355σ for a Gaussian, 2γ for a Lorentzian</dd>
<dt>Physical meaning</dt><dd>The Poisson law is what you get when many independent nuclei or photons each have a tiny chance to register. Its spread equals its mean, which sets the shot noise of every counting experiment.</dd>
</dl>

</div>

**The two limits.** For large `$n$` and small `$p$` with `$np = \lambda$` fixed, the binomial becomes Poisson. For large mean (`$np(1-p) \gtrsim 10$`, or `$\lambda \gtrsim 10$`), both become Gaussian with the same mean and variance. The Gaussian gives the familiar 68%, 95.5% and 99.7% within `$1\sigma$`, `$2\sigma$`, `$3\sigma$`.

<figure class="fig" data-fig="distribution-explorer"><figcaption>Bars: the binomial distribution. Dots: the Poisson distribution with the same mean. Curve: the Gaussian with the same mean and variance. Make p small and n large to see the Poisson limit; make np(1 − p) large to see everything turn Gaussian.</figcaption></figure>

**Worked example.** 1000 nuclei, each decaying in a minute with probability 0.002. With `$\lambda = 2$`: `$P(0) = e^{-2} = 0.135$`, `$P(1) = 2e^{-2} = 0.271$`, `$P(\geq2) = 1 - 3e^{-2} = 0.594$`. The exact binomial differs only in the fourth decimal place.

<div class="problem" data-problem="poisson-count"></div>

## 3. Counting statistics and the random walk

The waiting time between events of a Poisson process is exponential, and it has **no memory**: `$P(T > s + t\mid T > s) = e^{-\lambda t}$`. That is why a radioactive nucleus has a half-life independent of its age.

A **random walk** of `$N$` independent steps of length `$l$`, each equally likely forward or back, has

```math
\langle x\rangle = 0, \qquad \langle x^2\rangle = Nl^2, \qquad x_{\text{rms}} = l\sqrt N
```

With a bias (probability `$p$` forward, `$q$` back) the mean drifts as `$N(p - q)l$` and the variance is `$4Npql^2$`. Since `$N \propto t$`, `$\langle x^2\rangle \propto t$`: this is diffusion. The probability of ending at `$x = m$` (in units of `$l$`) is binomial, `$\binom{N}{(N+m)/2}2^{-N}$` for the unbiased walk.

**The central limit theorem.** The sum of `$N$` independent, identically distributed variables with finite variance `$\sigma^2$` tends to a Gaussian with variance `$N\sigma^2$`; their mean has standard deviation `$\sigma/\sqrt N$`. It fails for the Cauchy distribution (no finite variance).

**Worked example.** Single readings scatter with `$\sigma = 2$` mm. To get the mean to `$\pm0.2$` mm you need `$N = (2/0.2)^2 = 100$` readings.

<div class="problem" data-problem="gauss-window"></div>

## 4. Changing variables, moments and characteristic functions

If `$y = g(x)$` is one-to-one, probability is conserved in matching intervals: `$p_Y(y)\,|dy| = p_X(x)\,|dx|$`, so

```math
p_Y(y) = p_X(x)\left|\frac{dx}{dy}\right|
```

summed over every `$x$` that gives the same `$y$`. **Example:** `$X$` uniform on `$(0, 1)$` and `$Y = -\ln X$` gives `$p_Y = e^{-y}$`. For `$y = x^2$` with `$x$` Gaussian, both roots `$\pm\sqrt y$` count, giving the `$\chi^2$` density with one degree of freedom.

The **characteristic function** `$\phi(k) = \langle e^{ikX}\rangle$` is the Fourier transform of the density. Its Taylor coefficients are the moments, and those of `$\ln\phi$` are the **cumulants** `$\kappa_n$` (`$\kappa_1$` = mean, `$\kappa_2$` = variance). For independent variables, cumulants add.

| Distribution | `$\phi(k)$` | Cumulants |
|---|---|---|
| Gaussian | `$e^{ik\mu - \sigma^2k^2/2}$` | only `$\kappa_1 = \mu$`, `$\kappa_2 = \sigma^2$` |
| Poisson | `$\exp[\lambda(e^{ik} - 1)]$` | all `$\kappa_n = \lambda$` |
| Cauchy | `$e^{-\gamma\vert k\vert}$` | none defined |

Gaussian moments are worth memorising: `$\langle x^{2n}\rangle = (2n-1)!!\,\sigma^{2n}$` for zero mean, so `$\langle x^4\rangle = 3\sigma^4$`, and `$\langle|x|\rangle = \sigma\sqrt{2/\pi}$`.

## 5. Conditional probability and Bayes' theorem

```math
P(A\mid B) = \frac{P(B\mid A)\,P(A)}{P(B)}, \qquad P(B) = P(B\mid A)P(A) + P(B\mid\bar A)P(\bar A)
```

**Worked example.** A detector flags a rare event type (1% of events) with probability 0.99, and wrongly flags 1% of ordinary events. Then `$P(\text{true}\mid\text{flag}) = \dfrac{0.99\times0.01}{0.99\times0.01 + 0.01\times0.99} = 0.5$`. Half the flags are false, because the background is 99 times more common.

<div class="myth">

**"Variances subtract for a difference."** They never do: `$\mathrm{Var}(X - Y) = \mathrm{Var}\,X + \mathrm{Var}\,Y$` for independent `$X$`, `$Y$`, which is why background subtraction makes a signal noisier. A second classic slip: the most probable value, the mean and the median are different numbers for skewed distributions (Maxwell speeds: `$v_p < \langle v\rangle < v_{\text{rms}}$`), and a Poisson count of mean 3 has only a 22% chance of being exactly 3.

</div>

<div class="keypoints">

- `$\sigma^2 = \langle x^2\rangle - \langle x\rangle^2$`; `$\mathrm{Var}(aX + b) = a^2\sigma^2$`; independent variances add for sums and differences.
- Binomial `$np$`, `$np(1-p)$`; Poisson `$\lambda$`, `$\lambda$`; exponential `$1/\lambda$`, `$1/\lambda^2$`; uniform `$(b-a)^2/12$`; Cauchy has no variance.
- Binomial → Poisson (small `$p$`, `$np$` fixed) → Gaussian (large mean). 68 / 95.5 / 99.7% within 1, 2, 3 σ; FWHM = 2.355σ.
- Counting: uncertainty `$\sqrt N$`. Random walk: `$x_{\text{rms}} = l\sqrt N$`. Mean of `$N$` readings: `$\sigma/\sqrt N$`.
- Change of variables: `$p_Y = p_X|dx/dy|$`, summed over all roots.
- `$\phi(k) = \langle e^{ikx}\rangle$`; Gaussian cumulants stop at 2; Poisson cumulants all equal `$\lambda$`.
- Bayes: posterior ∝ likelihood × prior; rare events need very low false-alarm rates.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="probability-distributions" data-exam="net" data-n="10"></div>

**Before this:** lesson 2.2, [group theory](/learn/courses/csir-net-physics/group-theory/). **Next:** lesson 2.4, [numerical methods](/learn/courses/csir-net-physics/numerical-methods/). The same distributions return in statistical physics: see the [GATE lesson on ensembles](/learn/courses/gate-physics/ensembles/) and the [kinetic theory lesson](/learn/courses/iit-jam-physics/kinetic-theory/) for the Maxwell distribution.
