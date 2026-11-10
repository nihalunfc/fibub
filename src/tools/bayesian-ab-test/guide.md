---
name: Bayesian A/B test
num: 564
shelf: science
code: T392
section: statistics
title: "Bayesian A/B test"
summary: "Compare two conversion rates the Bayesian way: the chance B beats A (exact), expected loss, credible intervals for each rate, the difference and the lift. Also update beta, gamma and normal priors with your data and plot prior against posterior."
status: live
ads: true
order: 564
icon: percent
works: offline
updated: 2026-11-09
related: [hypothesis-tests, bootstrap-permutation, sample-size, effect-size-converter, distribution-explorer, experiment-design, randomisation-list]
sources:
  - "Methods: Evan Miller (2015), Formulas for Bayesian A/B testing; Gelman et al., Bayesian Data Analysis (conjugate priors). Example numbers made up."
flow:
  - { icon: pencil, label: "Your counts" }
  - { icon: sliders, label: "Prior" }
  - { icon: percent, label: "P(B > A)" }
  - { icon: chart, label: "Posterior" }
---

## What it does

A classical A/B test answers "would a difference this big be surprising if there were none?". A Bayesian A/B test answers the question people actually ask: **how likely is it that B is better than A, and how much do I risk if I pick it?** Type the visitors and conversions for each version and the tool gives the probability that B beats A, the expected loss of each choice and credible intervals, with a picture of both posterior distributions.

The second mode, **Update a prior**, shows Bayesian updating in its simplest form: a conjugate prior plus data gives a posterior of the same family. It covers proportions (beta-binomial), rates of counts (gamma-Poisson) and means with a known spread (normal-normal), with a table and a plot of prior against posterior.

For a classic p-value on the same data use the [[hypothesis-tests|hypothesis test chooser]], and plan how many visitors or samples you need with the [[sample-size|sample size calculator]].

## How to use it

1. **A/B test:** type visitors and conversions for A and B. Choose a prior: flat Beta(1, 1) (every rate equally likely), Jeffreys Beta(0.5, 0.5), or your own Beta(a, b) built from past tests (for example Beta(2, 18) says "around 10 %, from about 20 visitors' worth of evidence").
2. Set the **loss you can live with**: if picking the leader would cost you less than this many percentage points in the worst cases on average, the tool says it is reasonable to stop.
3. **Update a prior:** pick the model, type the prior's parameters and your data.
4. Choose the credible level, then download the results as a CSV or the report as an image, PDF or Word file.

## The maths

With a Beta(a, b) prior and s conversions out of n, the posterior is Beta(a + s, b + n − s). The probability that B beats A is worked out exactly by Evan Miller's sum when B's first posterior parameter is a whole number, and by numerical integration otherwise. The expected loss of choosing B is E[max(p_A − p_B, 0)], the average shortfall over the cases where A is really better. Intervals for the difference p_B − p_A and the lift p_B / p_A − 1 come from their exact distributions by numerical integration, not by simulation, so the same numbers always give the same answer.

## Worked example

A has 120 conversions from 1,000 visitors and B has 145 from 1,000. With a flat prior, P(B beats A) = 95.02 %. Choosing B risks an expected loss of only 0.0316 percentage points, against 2.53 points for choosing A. B's rate is 2.5 points higher on average, with a 95 % credible interval of −0.475 to 5.47 points; the relative lift is 20.7 % (−3.51 % to 51.3 %).

Updating a Beta(2, 3) prior with 7 successes in 20 trials gives Beta(9, 16): mean 0.36, 95 % interval 0.188 to 0.5532. A Gamma(2, 0.5) prior with 37 events in 12 intervals gives a rate of 3.12 per interval (2.219 to 4.173). A Normal(100, 15) prior and 9 values averaging 112 with σ = 20 give a posterior mean of 110 (SD 6.092).

## Limits

Each visitor must be counted once and the two groups must be independent. Looking at the result every day and stopping when it looks good is less of a problem than with p-values, but the prior still matters for small tests. Up to 1,000,000 visitors per variant. The normal model assumes the spread of single values is known; with an unknown spread use a t-based method instead.

## Frequently asked questions

**Is 95 % "significant"?** There is no fixed cut-off. P(B beats A) is a direct probability; combine it with the expected loss and what a wrong choice costs you.

**Do the numbers match other software?** P(B beats A), expected loss and every interval were checked against numerical integration with scipy to at least seven significant figures.

**Is my data sent anywhere?** No. Everything runs in your browser.

For the classical tests see the [hypothesis test chooser and runner](/science/hypothesis-tests/).
