---
title: Probability and statistics for physicists
seoTitle: Probability and statistics for physicists | GATE Physics
summary: 'Rules of probability, conditional probability and Bayes'' theorem, counting (including identical particles), the binomial, Poisson, Gaussian, uniform and exponential distributions, moments and characteristic functions, random walks and the central limit theorem, counting statistics, propagation of errors, weighted means, least squares and chi-square.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: A detector records 2500 counts. What is the fractional statistical uncertainty?
    choices: ['2%', '0.04%', '50%', '4%']
    ans: 0
    why: Counts are Poisson, so σ = √2500 = 50 and σ/N = 50/2500 = 2%.
  - q: What is the variance of the number of heads in 100 tosses of a fair coin?
    choices: ['25', '50', '5', '10']
    ans: 0
    why: "Binomial: np(1 − p) = 100 × ½ × ½ = 25. The standard deviation is 5."
  - q: You subtract a background count B from a gross count G. What is the uncertainty of G − B?
    choices: ['√(G + B)', '√(G − B)', '√G − √B', '√G + √B']
    ans: 0
    why: Variances of independent quantities add, whether you add or subtract the quantities themselves. So σ² = G + B.
sources:
  - 'P. R. Bevington and D. K. Robinson, Data Reduction and Error Analysis for the Physical Sciences, 3rd ed. (2003), chapters 1 to 6'
  - 'J. R. Taylor, An Introduction to Error Analysis, 2nd ed. (1997), chapters 3 to 8'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (1965), chapter 1'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 15'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to use conditional probability and Bayes' theorem, count configurations of distinguishable and identical particles, work with the binomial, Poisson, Gaussian, uniform and exponential distributions and know when one approximates another, handle random walks and the central limit theorem, and treat data the way an experimental physicist does: counting errors, error propagation, weighted means, least-squares lines and chi-square. This lesson closes the mathematical physics module and prepares the ground for [statistical mechanics](/learn/courses/iit-jam-physics/second-law-entropy/).

<div class="bigidea">Physics meets probability twice: in nature (radioactive decay, thermal motion, quantum measurement) and in the laboratory (every measurement has a spread). The same few distributions cover almost everything, and the same rule, that variances of independent quantities add, explains √N.</div>

## 1. Rules of probability

For events `$A$` and `$B$`: `$P(A\cup B) = P(A) + P(B) - P(A\cap B)$` and `$P(A\cap B) = P(A|B)P(B)$`. They are **independent** if `$P(A\cap B) = P(A)P(B)$`, i.e. `$P(A|B) = P(A)$`. Mutually exclusive events (`$P(A\cap B) = 0$`) are the opposite of independent: if one happens, the other cannot.

**Bayes' theorem** turns `$P(\text{data}|\text{cause})$` into `$P(\text{cause}|\text{data})$`:

```math
P(C|D) = \frac{P(D|C)\,P(C)}{P(D|C)\,P(C) + P(D|\bar C)\,P(\bar C)}
```

**Worked example.** 1% of samples are contaminated; a test catches 99% of contaminated ones and falsely flags 5% of clean ones. `$P(C|+) = \frac{0.99\times0.01}{0.99\times0.01 + 0.05\times0.99} = \frac16$`. Most alarms are false, because clean samples are 99 times more common.

**Counting.** Arrangements of `$N$` distinguishable objects: `$N!$`; choices of `$k$` from `$N$`: `$\binom Nk$`. For particles in `$g$` single-particle states: distinguishable `$g^N$`; identical bosons `$\binom{N + g - 1}{N}$` (any occupation); identical fermions `$\binom gN$` (at most one per state). Three bosons in three states: 10 configurations; distinguishable: 27; fermions: 1. These counts become Bose–Einstein and Fermi–Dirac statistics. For large `$N$`, **Stirling**: `$\ln N! \approx N\ln N - N$` (the full form `$N! \approx \sqrt{2\pi N}N^Ne^{-N}$` is good to about `$1/12N$`).

## 2. Mean, variance and moments

For a discrete variable `$\langle x\rangle = \sum x_iP_i$`; for a continuous one `$\langle x\rangle = \int xp(x)\,dx$`. The variance `$\sigma^2 = \langle x^2\rangle - \langle x\rangle^2$`. Rules that hold always: `$\langle aX + bY\rangle = a\langle X\rangle + b\langle Y\rangle$`, and

```math
\text{Var}(X + Y) = \text{Var}X + \text{Var}Y + 2\,\text{Cov}(X, Y)
```

with `$\text{Cov} = 0$` for independent variables (the converse is false: `$Y = X^2$` with symmetric `$X$` has zero covariance). So for `$N$` independent copies the variance of the sum is `$N\sigma^2$` and the standard error of the mean is `$\sigma/\sqrt N$`.

The **characteristic function** `$\phi(k) = \langle e^{ikx}\rangle$` is the Fourier transform of `$p(x)$`; `$\phi(0) = 1$`, moments are its derivatives at 0, and for a sum of independent variables the `$\phi$`s multiply.

<div class="meaning">

<dl>
<dt>σ (standard deviation)</dt><dd>the typical size of the spread about the mean; the square root of the variance</dd>
<dt>Standard error</dt><dd>the spread of a mean of N values, σ/√N</dd>
<dt>Poisson process</dt><dd>independent rare events at a constant average rate, such as decays or photon arrivals</dd>
<dt>Weight 1/σ²</dt><dd>how much a measurement counts in an average; twice as precise means four times the weight</dd>
<dt>χ²/ν</dt><dd>the average squared misfit per degree of freedom, in units of the error bars; about 1 for a good fit</dd>
<dt>Physical meaning</dt><dd>Fluctuations shrink relative to the mean as 1/√N. That is why a gas of 10²³ molecules has a sharp pressure, and why longer counting gives better rates.</dd>
</dl>

</div>

## 3. The distributions you need

| distribution | formula | mean | variance | where it appears |
|---|---|---|---|---|
| binomial | `$\binom nkp^k(1 - p)^{n-k}$` | `$np$` | `$np(1 - p)$` | `$n$` yes/no trials, spins up or down |
| Poisson | `$\frac{\lambda^ke^{-\lambda}}{k!}$` | `$\lambda$` | `$\lambda$` | counts of rare independent events |
| Gaussian | `$\frac{1}{\sigma\sqrt{2\pi}}e^{-(x - \mu)^2/2\sigma^2}$` | `$\mu$` | `$\sigma^2$` | sums of many small effects, measurement errors |
| uniform on `$[a, b]$` | `$\frac{1}{b - a}$` | `$\frac{a + b}{2}$` | `$\frac{(b - a)^2}{12}$` | rounding errors, random phases |
| exponential | `$\lambda e^{-\lambda t}$` | `$1/\lambda$` | `$1/\lambda^2$` | waiting times, lifetimes |

Facts examiners like:

- **Gaussian:** 68.3% within `$1\sigma$`, 95.4% within `$2\sigma$`, 99.7% within `$3\sigma$`; one tail beyond `$2\sigma$` holds 2.3%. FWHM `$= 2\sqrt{2\ln2}\,\sigma \approx 2.355\sigma$`. `$\langle x^4\rangle = 3\sigma^4$`, `$\langle|x - \mu|\rangle = \sigma\sqrt{2/\pi}$`. With fixed mean and variance it has the largest entropy.
- **Poisson:** `$P(0) = e^{-\lambda}$`, `$P(k + 1)/P(k) = \lambda/(k + 1)$` (so the mode is `$\lfloor\lambda\rfloor$`), sums of independent Poissons are Poisson, and detecting each event with probability `$\varepsilon$` gives Poisson with mean `$\varepsilon\lambda$`.
- **Exponential:** no memory; the median (half-life) is `$\tau\ln2$`, below the mean `$\tau$`; the probability of decaying between `$t_1$` and `$t_2$` is `$e^{-t_1/\tau} - e^{-t_2/\tau}$`.

**Limits.** Binomial with `$n \to \infty$`, `$p \to 0$`, `$np = \lambda$` fixed: Poisson. Binomial or Poisson with large mean: Gaussian with the same mean and variance. The figure lets you watch both limits happen.

<figure class="fig" data-fig="distributions"><figcaption>The binomial distribution (bars) against a Poisson distribution with the same mean (dots) and a Gaussian with the same mean and variance (curve). Small p favours Poisson; large n with moderate p favours the Gaussian.</figcaption></figure>

**Worked example.** Two independent sources give 2 and 3 counts per second on average. `$P(\text{exactly 1 count in 1 s}) = 5e^{-5} = 0.034$`, because the total is Poisson with mean 5.

## 4. Random walks and the central limit theorem

A walker takes `$N$` independent steps of length `$L$`, right with probability `$p$`. Each step has mean `$L(2p - 1)$` and variance `$4p(1 - p)L^2$`, so after `$N$` steps

```math
\langle x\rangle = NL(2p - 1), \qquad \sigma_x = 2L\sqrt{Np(1 - p)}
```

For a fair walk, `$\langle x\rangle = 0$` but `$x_{\text{rms}} = L\sqrt N$`: 100 steps of 1 m spread only 10 m. With `$N = t/\Delta t$` this is diffusion, `$\langle x^2\rangle = 2Dt$`, and the distribution of `$x$` becomes the heat kernel of [lesson 1.8](/learn/courses/gate-physics/delta-greens-functions/).

The **central limit theorem** says this is general: the sum of many independent, identically distributed variables with finite variance is approximately Gaussian, whatever the individual distribution. (A Lorentzian has no variance and is the classic exception: averaging Lorentzian data does not narrow it.)

## 5. Treating data

**Counting.** `$N$` counts have `$\sigma = \sqrt N$`, so 1% precision needs `$10^4$` counts. For a net rate `$G/t_G - B/t_B$`, variances add even though you subtract: `$\sigma = \sqrt{G/t_G^2 + B/t_B^2}$`.

<div class="problem" data-problem="prb-net-rate"></div>

**Propagation of independent errors.**

```math
\sigma_f^2 = \sum_i\left(\frac{\partial f}{\partial x_i}\right)^2\sigma_i^2, \qquad f = x^ay^b \;\Rightarrow\; \frac{\sigma_f}{f} = \sqrt{\left(a\frac{\sigma_x}{x}\right)^2 + \left(b\frac{\sigma_y}{y}\right)^2}
```

**Worked example.** `$x = 2.00 \pm 0.02$`, `$y = 4.0 \pm 0.08$`, `$f = x^2/y = 1$`: `$\frac{\sigma_f}{f} = \sqrt{(2\times1\%)^2 + (2\%)^2} = 2.8\%$`. fibub's [Uncertainty propagation calculator](/science/uncertainty-calculator/) does this for any formula.

**Weighted mean.** Measurements `$x_i \pm \sigma_i$` combine with weights `$w_i = 1/\sigma_i^2$`: `$\bar x = \frac{\sum w_ix_i}{\sum w_i}$`, `$\sigma_{\bar x} = (\sum w_i)^{-1/2}$`. `$10.0 \pm 0.1$` and `$10.6 \pm 0.2$` give `$10.12 \pm 0.09$`.

**Least squares and chi-square.** For `$y = a + bx$` with equal errors, minimising `$\sum(y_i - a - bx_i)^2$` gives

```math
b = \frac{\sum(x_i - \bar x)(y_i - \bar y)}{\sum(x_i - \bar x)^2}, \qquad a = \bar y - b\bar x
```

so the line passes through `$(\bar x, \bar y)$`. With known errors, `$\chi^2 = \sum\left(\frac{y_i - f(x_i)}{\sigma_i}\right)^2$`; for `$\nu$` degrees of freedom (points minus fitted parameters) a good fit has `$\chi^2/\nu \approx 1$`. Much larger means a bad model or underestimated errors; much smaller means overestimated errors.

<div class="myth">

**"Subtracting two measurements cancels their errors."** The values subtract; the uncertainties do not. For independent quantities, `$\text{Var}(X - Y) = \text{Var}X + \text{Var}Y$`, so a small difference of two large, noisy numbers can be very uncertain. That is why weak signals on a big background need long counting times, and why `$\sqrt{400 - 100}$` is the wrong error for a net count of 300.

</div>

<div class="keypoints">

- Independence: `$P(A\cap B) = P(A)P(B)$`. Bayes: `$P(C|D) \propto P(D|C)P(C)$`; rare causes give mostly false alarms.
- Bosons `$\binom{N + g - 1}{N}$`, fermions `$\binom gN$`, distinguishable `$g^N$`. `$\ln N! \approx N\ln N - N$`.
- Binomial `$np$`, `$np(1 - p)$`; Poisson `$\lambda$`, `$\lambda$`; uniform `$(b - a)^2/12$`; exponential mean `$1/\lambda$`, median `$\ln2/\lambda$`; Gaussian 68/95/99.7, FWHM `$2.355\sigma$`, `$\langle x^4\rangle = 3\sigma^4$`.
- Variances of independent quantities add: `$\sigma/\sqrt N$`, `$L\sqrt N$`, `$\sqrt{G + B}$`. Biased walk: `$\sigma = 2L\sqrt{Npq}$`.
- Errors in quadrature with partial derivatives; powers multiply relative errors. Weighted mean with `$1/\sigma^2$`. Least-squares line through `$(\bar x, \bar y)$`; `$\chi^2/\nu \approx 1$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [probability practice page](/learn/courses/gate-physics/practice/probability/).

<div class="qbank" data-bank="physics" data-topics="probability" data-exam="gate" data-n="10"></div>

Try the [Binomial lab](/learn/binomial-distribution-lab/), the [Normal lab](/learn/normal-distribution-lab/) and the [Counting statistics helper](/science/counting-statistics/). **Before this:** [lesson 1.9, tensors](/learn/courses/gate-physics/tensors/). **Next:** Part B begins with [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/); meanwhile, quantum measurement probabilities are in [lesson 4.1](/learn/courses/gate-physics/postulates-operators/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).

**Going on to CSIR NET?** [Random variables and probability distributions](/learn/courses/csir-net-physics/probability-distributions/) and [measurement, errors and fitting data](/learn/courses/csir-net-physics/errors-data-fitting/) take these ideas into Part C.
