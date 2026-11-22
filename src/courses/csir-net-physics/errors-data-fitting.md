---
title: Measurement, errors and fitting data
summary: 'How NET Part C tests data analysis: random and systematic errors, resolution, standard error, propagation through non-linear and correlated formulas, Gaussian confidence levels, weighted means, least-squares lines with the errors and covariance of slope and intercept, linearising plots, chi-square and goodness of fit, and when (not) to reject a point.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A straight line is fitted to 12 points with known errors and gives χ² = 30. What is the reduced chi-square?'
    choices: ['3.0', '2.5', '2.7', '15']
    ans: 0
    why: 'Two fitted parameters leave ν = 12 − 2 = 10 degrees of freedom, so χ²/ν = 3.0: the points scatter about √3 times more than the error bars allow.'
  - q: 'Two lengths are measured with the same tape, which has an unknown 0.5% scale error. What does that error contribute to the ratio of the lengths?'
    choices: ['Nothing', '0.5%', '0.71%', '1%']
    ans: 0
    why: 'Both readings carry the same factor, which cancels in the ratio. Fully correlated errors must not be added in quadrature.'
  - q: 'A digital meter rounds to whole millivolts. What standard uncertainty does the rounding alone contribute?'
    choices: ['0.29 mV', '0.5 mV', '1 mV', '0.14 mV']
    ans: 0
    why: 'A uniform distribution of full width Δ has standard deviation Δ/√12 = 1/3.46 = 0.29 mV.'
sources:
  - 'P. R. Bevington and D. K. Robinson, Data Reduction and Error Analysis for the Physical Sciences, 3rd ed. (2003), chapters 3, 4, 6, 8 and 11'
  - 'J. R. Taylor, An Introduction to Error Analysis, 2nd ed. (1997), chapters 3, 7, 8, 9 and 12'
  - 'I. G. Hughes and T. P. A. Hase, Measurements and their Uncertainties (2010), chapters 4 to 8'
  - 'JCGM 100:2008, Evaluation of measurement data: Guide to the expression of uncertainty in measurement (GUM), open access from BIPM'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C unit on experimental techniques and data analysis'
---

**Module 7 · about 55 minutes.** By the end you will be able to separate random from systematic errors, quote a result with the right number of figures, propagate uncertainties through any formula (including correlated inputs and stationary points), combine measurements with weights, fit a straight line by least squares and give the errors and covariance of its slope and intercept, choose the right plot to linearise a law, and judge a fit with chi-square. The basic distributions (binomial, Poisson, Gaussian) are in the GATE lesson on [probability and statistics](/learn/courses/gate-physics/probability/); here we use them.

<div class="bigidea">A measurement is a number with a spread. Everything in data analysis follows from two facts: variances of independent quantities add, and the best fit is the one that makes the data most probable, which for Gaussian errors means the smallest chi-square.</div>

## 1. Two kinds of error, and resolution

**Random errors** scatter repeated readings both ways; averaging `$N$` readings shrinks them as `$1/\sqrt N$`. **Systematic errors** push every reading the same way (zero error, calibration, parallax from one side, thermal expansion of a scale); averaging never removes them. Precision is about the spread, accuracy about the offset: a set of readings can be precise and still wrong.

For `$N$` readings `$x_i$`:

```math
\bar x = \frac1N\sum x_i, \qquad s = \sqrt{\frac{\sum(x_i - \bar x)^2}{N - 1}}, \qquad \sigma_{\bar x} = \frac{s}{\sqrt N}
```

The `$N - 1$` appears because `$\bar x$` was fitted to the same data, using up one degree of freedom. The standard deviation `$s$` describes one reading; the standard error `$\sigma_{\bar x}$` describes the mean.

**Resolution.** A scale or display that rounds to steps of `$\Delta$` leaves the true value anywhere in a band of width `$\Delta$`: a uniform distribution with standard deviation `$\Delta/\sqrt{12}$` (0.29 of a step). It adds in quadrature with the statistical error and, when every reading rounds to the same value, it does not average away.

**Reporting.** Round the uncertainty to one or two significant figures, then round the value to the same decimal place: `$g = 9.82 \pm 0.04$` m s⁻², never `$9.8164 \pm 0.0372$`.

<div class="meaning">

<dl>
<dt>standard deviation s</dt><dd>the spread of single readings; it does not shrink with more data</dd>
<dt>standard error σ/√N</dt><dd>the spread you would see in the mean if you repeated the whole experiment</dd>
<dt>Δ/√12</dt><dd>the standard uncertainty from rounding to steps of Δ; the half-step Δ/2 is the worst case, not the standard deviation</dd>
<dt>degrees of freedom</dt><dd>number of data points minus number of parameters fitted to them</dd>
</dl>

</div>

## 2. Propagation of uncertainties

For `$f(x, y, \dots)$` with small, independent errors, expand to first order: `$\delta f = f_x\delta x + f_y\delta y + \dots$`, and since variances of independent terms add,

```math
\sigma_f^2 = \left(\frac{\partial f}{\partial x}\right)^2\sigma_x^2 + \left(\frac{\partial f}{\partial y}\right)^2\sigma_y^2 + 2\frac{\partial f}{\partial x}\frac{\partial f}{\partial y}\,\text{cov}(x, y)
```

The last term vanishes for independent inputs. Two cases cover most problems:

- sums and differences: absolute errors add in quadrature, `$\sigma_{x - y}^2 = \sigma_x^2 + \sigma_y^2$`. Subtracting nearly equal numbers keeps the absolute error but destroys the relative one.
- products of powers `$f = x^ay^b/z^c$`: relative errors add in quadrature, each times its power, `$(\sigma_f/f)^2 = (a\sigma_x/x)^2 + (b\sigma_y/y)^2 + (c\sigma_z/z)^2$`.

**Worked example.** A pendulum of length `$1.000 \pm 0.002$` m makes 50 swings in `$100.0 \pm 0.2$` s. Find `$g = 4\pi^2L/T^2$` and its error.

1. `$T = 2.000 \pm 0.004$` s (the timing error is shared by 50 swings).
2. `$g = 4\pi^2\times1.000/4.000 = 9.870$` m s⁻².
3. `$\sigma_g/g = \sqrt{(0.002)^2 + (2\times0.002)^2} = 4.5\times10^{-3}$`, so `$g = 9.87 \pm 0.04$` m s⁻². The period counts twice because it is squared.

<div class="problem" data-problem="propagate-power"></div>

**When a variable appears twice**, differentiate the whole formula; do not combine "the error of the numerator" with "the error of the denominator". For `$f = x/(x + y)$` with `$x = 2.0 \pm 0.1$`, `$y = 3.0 \pm 0.1$`: `$f_x = y/(x+y)^2 = 0.12$`, `$f_y = -x/(x+y)^2 = -0.08$`, so `$\sigma_f = \sqrt{0.012^2 + 0.008^2} = 0.014$`.

**Correlated errors.** If two lengths are read with the same tape whose scale is off by a factor `$(1 + \epsilon)$`, the ratio `$L_1/L_2$` does not feel `$\epsilon$` at all. Common calibration errors cancel in ratios and add linearly in sums; the covariance term above is how the formula knows.

**When first order fails.** At a stationary point (`$f' = 0$`) or for large relative errors, keep the second-order term: `$\langle f\rangle \approx f(\mu) + \tfrac12f''(\mu)\sigma^2$`. For `$\sin\theta$` near 90°, linear propagation predicts zero spread; the true spread is `$\sigma^2/\sqrt2$` (in radians). The figure lets you see the breakdown.

<figure class="fig" data-fig="error-propagation"><figcaption>Twenty thousand Gaussian values of x pushed through f(x). The histogram is the truth; the curve is what first-order propagation predicts. Increase the spread, or pick cos(x − 1) where the slope is zero, and watch the two part company.</figcaption></figure>

## 3. Combining measurements: the weighted mean

Results `$x_i \pm \sigma_i$` of the same quantity combine with weights `$w_i = 1/\sigma_i^2$`:

```math
\bar x_w = \frac{\sum w_ix_i}{\sum w_i}, \qquad \sigma_{\bar x_w} = \Big(\sum w_i\Big)^{-1/2}
```

**Worked example.** Three labs report `$4.2 \pm 0.2$`, `$4.6 \pm 0.4$`, `$4.0 \pm 0.1$`. Weights 25, 6.25 and 100 (sum 131.25) give `$\bar x_w = 533.75/131.25 = 4.07$` with error `$131.25^{-1/2} = 0.09$`. The plain average, 4.27, lets the worst measurement count as much as the best. Before averaging, check that the results agree within their errors; if they do not, something systematic is going on.

## 4. Fitting a straight line by least squares

For data `$(x_i, y_i \pm \sigma_i)$` with exact `$x$`, the most probable line `$y = a + bx$` under Gaussian errors minimises

```math
\chi^2 = \sum_i \left(\frac{y_i - a - bx_i}{\sigma_i}\right)^2
```

Drag the points, press 'Add outlier' and watch the line and the squares.

<figure class="fig" data-fig="@math-regress-fit"><figcaption>Notice that the fitted line makes the total of the pink squares smallest, that one far point drags the line towards it, and that r tells how straight the cloud is.</figcaption></figure>

Setting `$\partial\chi^2/\partial a = \partial\chi^2/\partial b = 0$` with equal errors gives, with `$\Delta = N\sum x^2 - (\sum x)^2$`:

```math
b = \frac{N\sum xy - \sum x\sum y}{\Delta}, \qquad a = \bar y - b\bar x, \qquad \sigma_b = \sigma\sqrt{\frac N\Delta}, \qquad \sigma_a = \sigma\sqrt{\frac{\sum x^2}{\Delta}}
```

Three facts save time in the exam: the line passes through the centroid `$(\bar x, \bar y)$`; the residuals add to zero; and `$\text{cov}(a, b) = -\bar x\,\sigma_b^2$`, negative when the data sit at positive `$x$` (a steeper slope pivots the line about the centroid and lowers the intercept). The slope error does not depend on the `$y$` values at all, only on `$\sigma$` and the spread of the `$x$` values: `$\sigma_b = \sigma/\sqrt{\sum(x_i - \bar x)^2}$`. Spread your `$x$` values widely.

If the errors are unknown, estimate them from the scatter: `$s^2 = \sum r_i^2/(N - 2)$` (two parameters fitted). For a line forced through the origin, `$y = kx$`, the result is `$k = \sum xy/\sum x^2$` with `$\sigma_k = \sigma/\sqrt{\sum x^2}$`.

**Worked example.** Fit `$(1, 2.1)$`, `$(2, 3.9)$`, `$(3, 6.2)$`, `$(4, 7.8)$`.

1. `$\sum x = 10$`, `$\sum y = 20.0$`, `$\sum xy = 59.7$`, `$\sum x^2 = 30$`, `$\Delta = 4\times30 - 100 = 20$`.
2. `$b = (4\times59.7 - 10\times20.0)/20 = 1.94$`; `$a = 5.0 - 1.94\times2.5 = 0.15$`.
3. Residuals: `$0.01, -0.13, 0.23, -0.11$` (they sum to zero). `$s^2 = 0.082/2 = 0.041$`, `$s = 0.20$`, so `$\sigma_b = 0.20\sqrt{4/20} = 0.09$`.

<div class="problem" data-problem="ls-slope-error"></div>

**Linearising.** Fit a straight line to the right variables: `$\ln y$` against `$x$` for `$y = Ae^{-kx}$` (slope `$-k$`); `$\ln y$` against `$\ln x$` for `$y = Cx^n$` (slope `$n$`); `$T^2$` against `$L$` for a pendulum; `$\ln\rho$` against `$1/T$` for activated processes. Transforming changes the error bars: for counts `$N$`, `$\sigma_{\ln N} = 1/\sqrt N$`, so points with few counts deserve less weight on a log plot.

## 5. Judging the fit: chi-square

If the model is right and the errors are honest, each term of `$\chi^2$` is about 1, and the minimum follows a chi-square distribution with `$\nu = N - p$` degrees of freedom: mean `$\nu$`, standard deviation `$\sqrt{2\nu}$`. So

```math
\frac{\chi^2_{\min}}{\nu} \approx 1 \pm \sqrt{2/\nu}
```

Much larger means the errors are underestimated or the model is wrong; much smaller (say 0.2 for `$\nu = 20$`) means the errors are overestimated or the points are not independent. **Always look at the residuals**: random signs mean the model is fine; a smile or a wave means a missing term, whatever `$\chi^2$` says.

<figure class="fig" data-fig="least-squares"><figcaption>Ten points from a known line with Gaussian scatter, fitted by least squares. Change the real scatter and the error bar you claim: χ²/ν follows their ratio squared. Switch to a slightly curved law and the residuals (lower panel) form a smile that no choice of error bar can hide.</figcaption></figure>

**Confidence regions.** For one parameter, the 1σ (68.3%) interval is where `$\chi^2$` rises by 1 from its minimum. For two parameters taken together, the 68.3% region is bounded by `$\Delta\chi^2 = 2.30$`.

**Rejecting data.** Chauvenet's criterion drops a point if fewer than half a point that far out is expected among `$N$`: for `$N = 10$` the threshold is `$|z| > 1.96$`, for `$N = 100$` about 2.8. Use it sparingly and say so; never reject a point just because it spoils a fit.

**Counting time.** To measure a net rate `$R_g - R_b$` in a fixed total time, split the time as `$t_g/t_b = \sqrt{R_g/R_b}$`. With 64 and 16 counts/s, two thirds of the time goes to the source run.

<div class="myth">

**"A χ² close to zero means a perfect experiment."** It means the error bars are too big, or the data were smoothed. An honest fit scatters about its line by about one error bar.

**"Random errors and systematic errors add the same way."** Independent random errors add in quadrature; a systematic error common to several readings is fully correlated and can cancel (in a ratio) or add linearly (in a sum). Treat it through the covariance, not by habit.

</div>

<div class="keypoints">

- Standard error of the mean `$s/\sqrt N$`; resolution adds `$\Delta/\sqrt{12}$` in quadrature; report the value to the decimal place of a one- or two-figure error.
- Propagation: `$\sigma_f^2 = \sum(\partial f/\partial x_i)^2\sigma_i^2 + 2\sum f_if_j\,\text{cov}_{ij}$`; powers multiply relative errors; differentiate the whole formula when a variable appears twice; go to second order at stationary points.
- Weighted mean with `$w = 1/\sigma^2$`; its error `$(\sum w)^{-1/2}$`.
- Least squares: `$b = (N\sum xy - \sum x\sum y)/\Delta$`, line through `$(\bar x, \bar y)$`, `$\sigma_b = \sigma\sqrt{N/\Delta}$`, `$\text{cov}(a, b) = -\bar x\sigma_b^2$`, `$s^2 = \sum r^2/(N - 2)$`.
- `$\chi^2/\nu \approx 1 \pm \sqrt{2/\nu}$`; `$\Delta\chi^2 = 1$` for one parameter, 2.30 for two jointly; residual patterns reveal a wrong model.

</div>

## Practise: exam questions on this lesson

NET Part C style, from definitions to multi-step problems, with full solutions. More on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/). The [Uncertainty propagation calculator](/science/uncertainty-calculator/) and the [Curve fitter](/science/curve-fitter/) check your hand calculations.

<div class="qbank" data-bank="physics" data-topics="errors-data-fitting" data-exam="net" data-n="10"></div>

**Next:** [lesson 7.3](/learn/courses/csir-net-physics/transducers-detectors/) turns physical quantities into the voltages you have just learned to analyse.
