---
name: Binomial lab
num: 2164
shelf: learn
code: L339
section: school-maths
title: "Binomial distribution lab: probabilities and hypothesis tests"
summary: "Set the number of trials and the chance of success, see the bar chart of probabilities and test a claim with a one-tailed binomial hypothesis test."
status: live
ads: false
order: 2164
icon: sliders
works: offline
updated: 2026-11-16
related: [hypothesis-tests, probability-tree, random-variable, normal-distribution-lab]
sources:
  - "Binomial probabilities P(X = k) = nCk × p^k × (1 − p)^(n − k): standard A-level statistics, the same values as printed binomial tables. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "Chart" }
  - { icon: check, label: "Test" }
---

## What it does

A binomial distribution counts the number of successes in a fixed number of independent trials, each with the same chance of success. It is written B(n, p). This lab draws the chart of probabilities for any n up to 50 and any p, and gives P(X = k), P(X ≤ k) and P(X ≥ k) for the k you choose.

The second half runs a one-tailed hypothesis test. You say what chance of success is claimed (the null hypothesis), enter how many successes you observed, choose the direction and a significance level, and the lab gives the probability of a result at least that extreme, the critical region, and whether you would reject the claim. For tests on means and other data, use [[hypothesis-tests]], and for building probabilities step by step see [[probability-tree]] and [[random-variable]]. When n is large, the [[normal-distribution-lab]] shows how the shape becomes bell-shaped.

## How to use it

1. Set the number of trials n and the probability p.
2. Pick a k to see P(X = k), P(X ≤ k) and P(X ≥ k), with the matching bars highlighted.
3. In the test box, enter the number of successes you observed, choose whether you suspect p is higher or lower, and pick a significance level.
4. Read the probability, the critical region and the conclusion.
5. Answer the questions at the bottom.

## What each setting does

- **n**: the number of trials.
- **p**: the chance of success on each trial.
- **k**: the number of successes you are asking about.
- **Observed successes**: what happened in the test.
- **Direction**: whether the test is for p higher than claimed, or lower.
- **Significance level**: how unlikely a result must be before you doubt the claim, usually 5%.

## Worked example

A fair coin is flipped 20 times, so X ~ B(20, 0.5). P(X = 10) = 0.1762 and P(X ≤ 7) = 0.1316. Suppose someone claims a coin is fair, but you suspect it favours heads, and you see 15 heads. P(X ≥ 15) = 0.0207, which is below 5%, so you reject the claim of fairness. The critical region at 5% is X ≥ 15: any result of 15 or more would lead you to reject.

## FAQs

**What are the conditions for a binomial model?** There is a fixed number of trials, each is independent, each has only two outcomes and the chance of success is the same every time.

**Why do we use P(X ≥ 15) and not P(X = 15)?** In a test, we ask how likely a result at least as extreme as the one seen is, under the claim being tested.

**Does rejecting the claim prove it is false?** No. It only says a result this extreme would be unlikely if the claim were true. There is always a small chance of being wrong, which is what the significance level controls.

**What if no value reaches the significance level?** Then the critical region is empty: even the most extreme result is not unlikely enough, and the lab says so.
