---
name: Random variable builder
num: 1476
shelf: learn
code: L298
section: school-maths
title: "Random variable and probability distribution calculator: mean, variance, binomial distribution and simulation"
summary: "Build a probability distribution table (or pick coins, dice, drawing without replacement or a binomial with sliders) and get the mean, E(X²), variance and standard deviation with every step, a bar chart with μ and μ ± σ, and a simulation that runs the experiment 10 to 10 000 times so you can watch the average settle on the mean."
status: live
ads: false
order: 1476
icon: chart
works: offline
updated: 2026-11-09
related: [probability-tree, sample-space, binomial-expansion, distribution-explorer]
sources:
  - "Standard school mathematics: discrete random variables, probability distributions, mean (expectation), variance and standard deviation, Bernoulli trials and the binomial distribution. Written for fibub; no textbook text, figures or exercises are used, and the story numbers are made up."
  - "Checked against scipy.stats (binom and hypergeom: probabilities, means and variances) and numpy (sum of two dice). The simulation uses a small seeded random number generator (mulberry32) in the browser."
flow:
  - { icon: table, label: "Make table" }
  - { icon: chart, label: "See bars" }
  - { icon: calculator, label: "Mean, var" }
  - { icon: target, label: "Simulate" }
---

## What it shows

A **random variable** X is a number that depends on chance, such as the number of heads in three tosses. Its **probability distribution** lists each value x it can take with its probability P(X = x); the probabilities are between 0 and 1 and add to 1. Two numbers sum it up:

- the **mean** or expectation, μ = E(X) = Σ x P(x), the long-run average;
- the **variance**, Var(X) = E(X²) − μ², and its square root, the **standard deviation** σ, which measure the spread.

This page builds the table, draws it as bars with μ and the band μ ± σ, shows every step of the working, and runs the experiment many times in your browser so you can watch the average approach μ. It also covers the **binomial distribution**: the number of successes in n independent trials, each with chance p, where P(X = r) = C(n, r) pʳ qⁿ⁻ʳ, the mean is np and the variance is npq.

It follows probability in Class 12 maths (random variables, mean and variance, Bernoulli trials and the binomial distribution). Listing outcomes comes first in [[sample-space]], and conditional chances in the [[probability-tree]]; the coefficients C(n, r) are the ones in [[binomial-expansion]], and the [[distribution-explorer]] goes on to the normal and other distributions.

## How to use it

1. Pick what **X** is: heads in 3 coin tosses, the sum of two dice, sixes in 4 throws, faulty bulbs among 3 drawn from a box of 10 with 2 faulty, a binomial with sliders for n and p, or *my own table*.
2. The table lists x and P(X = x) (as exact fractions for the experiments). In *my own table*, type values and probabilities (fractions such as 1/8 are fine), **Add a row** or remove one with ✕. The page warns you if the probabilities are outside 0 to 1 or do not add to 1. **Edit this as my own table** copies any ready-made table so you can change it.
3. Read the chart and the facts: mean, E(X²), variance and standard deviation, with the sums written out underneath. Binomial cases also show np and npq.
4. Press **10 times**, **100**, **1000** or **10 000** to simulate. Red outlines on the chart show how often each value came up, and the facts compare the average and spread with the theory.

## Worked example

Heads in 3 tosses of a fair coin: X = 0, 1, 2, 3 with probabilities 1/8, 3/8, 3/8, 1/8. Then μ = 0 × 0.125 + 1 × 0.375 + 2 × 0.375 + 3 × 0.125 = **1.5**, E(X²) = 0 + 0.375 + 1.5 + 1.125 = **3**, Var(X) = 3 − 1.5² = **0.75** and σ = √0.75 ≈ **0.866**. The page shows exactly these, and the binomial check np = 3 × 0.5 = 1.5, npq = 0.75 agrees.

For the sum of two dice the page gives μ = **7** and variance **5.8333**. For the faulty bulbs (a draw without replacement, so not binomial), P(X = 0) = P(X = 1) = 56/120 and P(X = 2) = 8/120, giving μ = **0.6**.

## Tips

- The mean need not be a value X can take: 1.5 heads never happens, but it is the average over many tries.
- Doubling every value doubles the mean and multiplies the variance by 4.
- For a binomial with p = 0.5 the bars are symmetric; with small p they lean to the left.

## Check yourself

Five fresh questions: a mean from a table, a binomial probability, a binomial variance, the missing k that makes probabilities add to 1, and a variance by hand. Nothing is saved.

## FAQ

**Is the simulation random?** Yes, but from a seeded generator inside the page, so it is quick and nothing leaves your device. Each press uses a new seed.

**Why is the simulated average not exactly μ?** Chance. With 10 runs it can be far off; with 10 000 it is usually within a few hundredths.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid and is not part of NCERT.
