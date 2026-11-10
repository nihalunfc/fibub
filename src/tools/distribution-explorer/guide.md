---
name: Probability distribution explorer
num: 563
shelf: science
code: T391
section: statistics
title: "Probability distribution calculator: pdf, cdf, quantiles, shaded probabilities and random samples for 35 distributions"
summary: "Pick a distribution (normal, t, chi-squared, F, beta, gamma, Weibull, binomial, Poisson and 26 more), set its parameters and see the curve with the probability between two values shaded, the quantiles, mean, variance, skewness and kurtosis, and draw seeded random samples. Matches scipy.stats."
status: live
ads: true
order: 563
icon: curve
works: offline
updated: 2026-11-09
related: [sample-size, uncertainty-calculator, plot-maker, reliability-analysis, hypothesis-tests, bootstrap-permutation, bayesian-ab-test, counting-statistics, regression-workbench]
sources:
  - "Formulas are standard textbook results. Methods: Loader's saddle-point binomial and Poisson terms (as in R), Numerical Recipes series and continued fractions for the incomplete gamma and beta functions, Gauss–Legendre quadrature for the Rice and von Mises distributions."
  - "Checked against scipy.stats 1.18.1 for all 35 distributions (density or mass, CDF, survival function and quantiles at several points, and the four moments), and against mpmath at 30 digits where scipy's own far-tail values are slightly off."
flow:
  - { icon: curve, label: "Distribution" }
  - { icon: sliders, label: "Parameters" }
  - { icon: target, label: "Shade a, b" }
  - { icon: table, label: "Quantiles" }
---

## What it does

This is a statistics table and a graphing calculator in one. Choose a probability distribution, type its parameters, and the page shows:

- the **density** (or, for whole-number distributions, the **probability of each value**) with the area you ask about shaded, and its probability to six significant figures;
- the **cumulative distribution** P(X ≤ x);
- **quantiles** (inverse CDF) for any list of probabilities, such as the 2.5 % and 97.5 % points used for 95 % intervals;
- the **mean, variance, standard deviation, skewness, excess kurtosis**, median and support. A moment that does not exist is shown as *undefined* (for example the mean of a Cauchy distribution) or *infinite* (the variance of t with 2 degrees of freedom);
- a **random sample** of up to 100,000 values from a seed you choose, with its histogram drawn over the true curve.

There are 35 distributions. **Continuous:** normal, Student's t, chi-squared, F, beta, gamma, exponential, Weibull, log-normal, Cauchy, logistic, Gumbel, Pareto, uniform, triangular, Laplace, Rayleigh, Rice, von Mises, chi, Maxwell–Boltzmann, inverse gamma, half-normal, generalised extreme value, generalised Pareto, inverse Gaussian and log-logistic. **Whole numbers:** Bernoulli, binomial, Poisson, negative binomial, geometric, hypergeometric, discrete uniform and beta-binomial. Each one has a line saying where it turns up, and each parameter a line saying what it does.

Once you know which distribution fits, run the right test with the [[hypothesis-tests|hypothesis test chooser]] or check your error bars with the [[uncertainty-calculator]].

## How to use it

1. Pick the distribution. The page fills in sensible parameters and sets a and b to the 2.5 % and 97.5 % points.
2. Change the parameters. Under them you see the same distribution written as scipy.stats would take it, which helps when you move to code.
3. Choose what to shade: **between a and b**, **below b**, **above a**, or **outside a to b** (both tails, as in a two-sided p-value).
4. Type the probabilities you want quantiles for, separated by commas.
5. Optionally set the plot range. Download the curve as CSV, or the whole result as an image, PDF or Word file.
6. To simulate, choose how many values and a seed, then press **Draw sample**. The CSV holds the values.

For whole-number distributions the end points count: “between 3 and 9” is P(3 ≤ X ≤ 9), and “above 5” is P(X ≥ 5). For continuous ones it makes no difference.

## Worked example

The page opens on the standard normal with a = −1.96 and b = 1.96. It shows **P(−1.96 < X < 1.96) = 0.950004**, outside 0.0499958, and quantiles −1.95996, 0 and 1.95996 for 0.025, 0.5 and 0.975: the familiar 95 % interval.

Now pick **Binomial** with n = 20 trials and p = 0.3, shade between a = 3 and b = 9: P(3 ≤ X ≤ 9) = 0.916555. The mean is 6, the variance 4.2 and the skewness 0.195180. Switch to **above** with a = 5: P(X ≥ 5) = 0.762492.

For a test statistic, choose **Student's t** with ν = 10 and shade outside −2.228 to 2.228: about 0.05, so 2.228 is the two-sided 5 % critical value (the 0.975 quantile is 2.22814).

## How accurate is it?

Every distribution was checked against scipy.stats at several points, in the tails too: densities, CDFs, upper tails and quantiles agree to at least 9 significant figures (usually 14). Upper tails are worked out directly, not as 1 minus the CDF, so P(X > x) keeps its digits even when it is 10⁻¹⁵. Random samples use a seeded sfc32 generator and pass a Kolmogorov–Smirnov test against the true CDF.

## What it does not do

It does not fit a distribution to your data (try the [reliability analysis](/science/reliability-analysis/) tool for lifetimes), and it has no non-central or multivariate distributions. The von Mises distribution takes angles in radians between μ − π and μ + π.

## Frequently asked questions

**Why is the density above 1?** A density is not a probability; only areas under it are. A narrow curve can be tall.

**Why does the beta or gamma curve shoot up at zero?** With a shape below 1 the density is infinite at 0. The chart cuts the top off so you can still see the rest.

**What is excess kurtosis?** Kurtosis minus 3, so the normal distribution scores 0. Positive means heavier tails than normal.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
