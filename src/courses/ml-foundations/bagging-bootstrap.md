---
title: Bagging and bootstrap samples
seoTitle: 'Bagging and bootstrap sampling explained'
summary: 'To get many different models from one dataset, train each on a bootstrap sample: n rows drawn with replacement. About a third of the rows are left out each time, which gives a free test set. Draw samples and count.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Breiman (1996), Bagging predictors, Machine Learning 24, 123-140 https://doi.org/10.1007/BF00058655'
  - 'Efron (1979), Bootstrap methods: another look at the jackknife, The Annals of Statistics 7(1), 1-26 https://doi.org/10.1214/aos/1176344552'
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Sections 5.2 (The bootstrap) and 8.2.1 (Bagging) https://www.statlearning.com/'
---

**Module 6 · about 20 minutes · read first: 1.6, 6.1.** You'll be able to draw a bootstrap sample, explain the 63 % rule, and describe bagging and out-of-bag scores.

<div class="bigidea">From one dataset you can make many slightly different ones by drawing rows at random and putting each back, then train a model on each and let them vote.</div>

## 1. Why this matters

Lesson 6.1 showed that a crowd of models helps only if they differ. The **bootstrap** is the simplest way to make many different datasets from one, and it is used far beyond machine learning: statisticians use it to put error bars on almost any estimate. Bagging, the ensemble built on it, is the "random" half of random forests.

## 2. Sampling with replacement

Imagine writing each row of your data on a ball and putting the balls in a bag. A **bootstrap sample** of `$n$` rows is made by drawing a ball, writing down its row, putting it **back**, and repeating `$n$` times. So:

- it has the same size as the original data;
- some rows come up twice or more;
- some never come up. These are the **out-of-bag** (OOB) rows.

<!--fig:bootstrap-->

For large `$n$`, about **63.2 %** of the rows appear at least once and 36.8 % are left out. (With only 12 rows the share drawn is a little higher, about 65 %.)

<div class="steps">
<div class="step"><p><b>Five houses</b> with prices (in $1,000s) 200, 220, 250, 300, 500. Their mean is 294.</p></div>
<div class="step"><p><b>Draw five times with replacement.</b> Sample 1: 200, 200, 250, 300, 500. The 200 came up twice; the 220 never did. Mean 290.</p></div>
<div class="step"><p><b>Draw again.</b> Sample 2: 220, 250, 250, 300, 300. This time the $500k house is out of the bag. Mean 264.</p></div>
<div class="step"><p><b>And again.</b> Sample 3: 200, 220, 220, 250, 500. Mean 278.</p></div>
<div class="step"><p><b>Read the spread.</b> The means range from 264 to 290. Over hundreds of samples, that spread shows how much the mean would move with a new set of five houses: a bootstrap error bar.</p></div>
</div>

<div class="problem" data-problem="bagging-bootstrap-oob"></div>

## 3. Bagging

**Bagging** (bootstrap aggregating, Leo Breiman, 1996):

1. Draw `$B$` bootstrap samples (say 100).
2. Train one model on each. Use a model that overfits easily, so each one comes out different: deep, unpruned trees are ideal.
3. Predict by averaging (numbers) or voting (classes).

Each deep tree has low bias (it can fit the pattern) and high variance (it changes a lot with the data). Averaging keeps the low bias and cuts the variance. Bagging does little for steady models such as linear regression, whose fits barely change from sample to sample.

<div class="meaning">

<dl>
<dt>B</dt><dd>The number of bootstrap samples, and so the number of models.</dd>
<dt>f<sub>b</sub>(x)</dt><dd>The prediction of the model trained on sample b.</dd>
<dt>(1/B) Σ f<sub>b</sub>(x)</dt><dd>The bagged prediction: the average of all B models.</dd>
<dt>(1 − 1/n)<sup>n</sup> ≈ 0.368</dt><dd>The chance a given row is left out of one sample.</dd>
<dt>Physical meaning</dt><dd>Asking 100 friends to each skim a different, partly overlapping pile of reviews before recommending a film, then going with the most common recommendation. Each friend is a bit unreliable; together they are steady.</dd>
</dl>

</div>

**Out-of-bag score.** Each row was left out by about a third of the trees. Predict it using just those trees and compare with the truth. Over all rows, that gives a test-like score for free, without setting aside a validation set.

<div class="myth">

**"Drawing with replacement just wastes rows: some are repeated and a third are thrown away."** It is the point. The repeats and gaps are what make each sample, and so each model, different. And the rows left out are not wasted: they become a free test set for the models that never saw them.

</div>

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

**Try it:** with `$n = 4$`, what is the chance that a given row is left out of a bootstrap sample? (`$(3/4)^4 = 81/256 \approx 0.316$`.)
</details>

## 4. Worked example

*Made-up numbers.* Five houses with prices (in $1,000s) 200, 220, 250, 300, 500. Three bootstrap samples:

| sample | rows drawn | mean price |
|---|---|---|
| 1 | 200, 200, 250, 300, 500 | 290 |
| 2 | 220, 250, 250, 300, 300 | 264 |
| 3 | 200, 220, 220, 250, 500 | 278 |

The original mean is 294; the three bootstrap means spread from 264 to 290. That spread, worked out over hundreds of samples, estimates how much the mean would move with a new set of five houses: a bootstrap error bar. Sample 2 never drew the $500k house: it is out-of-bag there, and a model trained on sample 2 could be tested on it.

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

<div class="keypoints">

- A bootstrap sample draws n rows with replacement: same size, some rows repeated, about 36.8 % left out.
- Bagging trains one model per bootstrap sample and averages or votes.
- It works best with unstable, high-variance models such as deep trees.
- Rows a model never saw (out-of-bag) give a free, honest test score.

</div>

**Try it on your own data:** the [[bootstrap-permutation]] tool draws thousands of bootstrap samples from your own numbers and gives the error bar on their mean.

**New words:** *bootstrap sample*, *sampling with replacement*, *out-of-bag*, *bagging*, *aggregate*.
