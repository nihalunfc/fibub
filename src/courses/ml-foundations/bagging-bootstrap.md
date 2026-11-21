---
title: Bagging and bootstrap samples
seoTitle: 'Bagging and bootstrap sampling explained'
summary: 'To get many different models from one dataset, train each on a bootstrap sample: n rows drawn with replacement. About a third of the rows are left out each time, which gives a free test set. Draw samples and count.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'A bootstrap sample of a 1,000-row dataset has:'
    choices: ['1,000 rows, drawn with replacement', '632 rows', '1,000 rows, each used exactly once']
    ans: 0
    why: It has the same size as the data, but some rows appear several times and about 368 do not appear at all.
  - q: 'Bagging stands for:'
    choices: ['Bootstrap aggregating', 'Boosting and gradient', 'Batch averaging']
    ans: 0
    why: Bootstrap samples, a model on each, then aggregate (average or vote) their predictions.
  - q: 'The out-of-bag rows of a tree are:'
    choices: ['Rows with missing values', 'Rows that tree''s bootstrap sample missed, so they can test it', 'The test set']
    ans: 1
    why: The tree never saw them, so they give an honest score without setting aside a separate validation set.
---

**Module 6 · about 20 minutes · read first: 1.6, 6.1.** You'll be able to draw a bootstrap sample, explain the 63 % rule, and describe bagging and out-of-bag scores.

## 1. Why this matters

Lesson 6.1 showed that a crowd of models helps only if they differ. The bootstrap is the simplest way to make many different datasets from one, and it is used far beyond machine learning: statisticians use it to put error bars on almost any estimate. Bagging, the ensemble built on it, is the "random" half of random forests.

## 2. Sampling with replacement

A **bootstrap sample** of `$n$` rows is made by picking a row at random `$n$` times, putting it back each time. So:

- it has the same size as the original data;
- some rows come up twice or more;
- some never come up. These are the **out-of-bag** (OOB) rows.

<!--fig:bootstrap-->

For large `$n$`, about **63.2 %** of the rows appear at least once and 36.8 % are left out. (With only 12 rows the share is a little higher, about 65 %.)

## 3. Bagging

**Bagging** (bootstrap aggregating, Leo Breiman, 1996):

1. Draw `$B$` bootstrap samples (say 100).
2. Train one model on each. Use a model that overfits easily, so each one is different: deep, unpruned trees are ideal.
3. Predict by averaging (numbers) or voting (classes).

Each deep tree has low bias and high variance; averaging keeps the low bias and cuts the variance. Bagging does little for stable models such as linear regression, whose fits barely change from sample to sample.

**Out-of-bag score.** Each row was left out by about a third of the trees. Predict it with just those trees and compare with the truth: over all rows, that gives a test-like score for free, without setting aside a validation set.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** treat the sample as a stand-in for the population, and resample it to see how much a model would change with different data.

**The 63.2 % rule:** a given row is missed by one draw with probability `$1 - 1/n$`, and by all `$n$` draws with probability

```math
\left(1 - \frac{1}{n}\right)^{n} \;\longrightarrow\; e^{-1} \approx 0.368 \quad (n \to \infty)
```

so it is in the sample with probability `$1 - e^{-1} \approx 0.632$`.

**The bagged prediction** for numbers, with models `$f_1, \dots, f_B$`:

```math
\hat{f}_{\text{bag}}(\mathbf{x}) = \frac{1}{B} \sum_{b=1}^{B} f_b(\mathbf{x})
```

**Analogy:** asking 100 friends to each skim a different, partly overlapping, pile of reviews before recommending a film, then going with the most common recommendation.

**Try it:** with `$n = 4$`, what is the chance that a given row is left out of a bootstrap sample? (`$(3/4)^4 = 81/256 \approx 0.316$`.)
</details>

## 4. Worked example

*Made-up numbers.* Five houses with prices (in $1,000s) 200, 220, 250, 300, 500. Three bootstrap samples:

| sample | rows drawn | mean price |
|---|---|---|
| 1 | 200, 200, 250, 300, 500 | 290 |
| 2 | 220, 250, 250, 300, 300 | 264 |
| 3 | 200, 220, 220, 250, 500 | 278 |

The original mean is 294; the three bootstrap means spread from 264 to 290. That spread, worked out over hundreds of samples, is an estimate of how much the mean would move with a new set of five houses: a bootstrap error bar. Sample 2 never drew the $500k house: it is out-of-bag there, and a model trained on sample 2 could be tested on it.

## 5. Practice

1. In the simulation, draw 100 samples. What share of different rows do you get on average?
2. Why do deep trees suit bagging better than shallow ones?
3. What is the out-of-bag score, and why is it useful?

<details>
<summary>Answers</summary>

1. Close to 65 % for 12 rows (`$1 - (11/12)^{12} \approx 0.648$`), heading to 63.2 % for large data.
2. Deep trees change a lot from sample to sample (high variance), which averaging removes; shallow trees are all alike, so their average is no better.
3. Each row is scored only by the trees that did not see it: an honest estimate of test accuracy without a separate validation set.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool draws thousands of bootstrap samples from your own numbers and gives the error bar on their mean.

**New words:** *bootstrap sample*, *sampling with replacement*, *out-of-bag*, *bagging*, *aggregate*.
