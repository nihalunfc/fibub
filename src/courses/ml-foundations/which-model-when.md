---
title: 'Which model when'
seoTitle: 'Which machine learning model should I use? A simple chooser'
summary: 'A one-page guide to choosing a model: what each one is good at, what it needs, and how to explain it. Answer four questions for a suggested starting point, and learn the rule for picking the simpler of two close models.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'For a table of columns with 50,000 rows, where accuracy matters most, a strong default is:'
    choices: ['Gradient-boosted trees, compared against a linear or logistic baseline', 'A transformer trained from scratch', 'k-means']
    ans: 0
    why: Boosted trees win most competitions on table data. A simple baseline shows how much they really add.
  - q: Two models' cross-validated errors differ by less than one standard error. Which do you choose?
    choices: ['The simpler one', 'Always the more complex one', 'Neither']
    ans: 0
    why: The difference could be chance, and the simpler model is easier to explain, cheaper to run and usually steadier on new data.
  - q: You must explain every loan decision to the customer. A good first choice is
    choices: ['Logistic regression or a shallow tree', 'A 100-layer neural network', 'A random forest of 1,000 trees']
    ans: 0
    why: 'Their reasoning can be read directly: a weight per column, or a few if-then rules.'
---

**Module 11 · about 20 minutes · read first: 7.1, 7.2.** You'll be able to choose a sensible first model for a new problem, name a stronger one to compare against, and use the one-standard-error rule to pick between close models.

## 1. Why this matters

The most common question after a course like this is "which model should I use?". The honest answer is: start simple, compare fairly, and pick the simplest model that is good enough. This lesson turns the whole course into a short guide you can come back to.

## 2. The short guide

| job | start with | then compare | explain with |
|---|---|---|---|
| predict a number | linear regression | random forest, boosted trees | weights; importance |
| yes/no or category | logistic regression | random forest, boosted trees | weights (odds); importance |
| must explain each case | logistic or shallow tree | a pruned tree | weights; the tree's rules |
| find groups | k-means (scaled) | hierarchical clustering | cluster averages |
| too many columns | PCA | — | loadings |
| unusual rows | z-scores | neighbour distance | which column is extreme |
| text, images, sound | a pretrained model | fine-tune a network | examples; attention |

<!--fig:model-chooser-->

Some rules of thumb:

- **Small data** (hundreds of rows): simple models, strong regularisation, cross-validation over a single split.
- **Tables of columns:** trees and boosting usually beat neural networks.
- **Text, images and sound:** start from a pretrained network, never from scratch.
- **When every prediction must be explained** to a customer or regulator, the explanation is part of the job: choose a model whose reasoning can be read.
- **Always** beat a baseline, keep a test set, and look for leakage.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** among models whose scores are within chance of each other, take the simplest.

**One-standard-error rule.** With `$k$`-fold cross-validation, each model has a mean error `$\bar e$` and a standard deviation `$s$` across the folds. The standard error of the mean is

```math
\text{SE} = \frac{s}{\sqrt{k}}
```

Find the model with the lowest `$\bar e_{\min}$`. Then choose the simplest model with

```math
\bar e \le \bar e_{\min} + \text{SE}_{\min}
```

**Analogy:** buying a car. If two cars score the same within the test's margin, you take the cheaper, simpler one to run.

**Try it:** 10 folds, the best model's error is 0.120 with fold standard deviation 0.020. A simpler model scores 0.125. Within one SE? (SE = `$0.020/\sqrt{10} = 0.0063$`; limit 0.1263; yes, choose the simpler one.)
</details>

## 3. Worked example

A bank team predicts which customers will leave, with 5-fold cross-validation on 12,000 rows:

| model | mean error | fold sd | SE = sd/√5 |
|---|---|---|---|
| logistic regression | 0.180 | 0.020 | 0.009 |
| random forest | 0.176 | 0.025 | 0.011 |
| gradient boosting | 0.170 | 0.030 | 0.013 |

The best is boosting, 0.170. Its limit is 0.170 + 0.013 = 0.183. Logistic regression (0.180) is inside it, so the one-standard-error rule picks logistic regression: as good within chance, fast, and each weight can be shown to the customer team. If the business later values every last bit of accuracy, boosting is the documented next step.

## 4. Practice

1. In the chooser, pick "Predict a number", more than 100,000 rows, and no need to explain. What does it suggest, and why?
2. Why is "a transformer trained from scratch" almost never the right first step at work?
3. In the worked example, would the random forest also be within the limit? Why would you still prefer logistic regression?

<details>
<summary>Answers</summary>

1. Linear regression as the baseline, then gradient-boosted trees: with plenty of rows and no explanation needed, the most accurate table model is worth trying.
2. It needs vast data and computing. A pretrained model, adapted, is cheaper and almost always better.
3. Yes (0.176 is under 0.183), but logistic regression is simpler and easier to explain, and the rule picks the simplest model inside the limit.
</details>

**Try it on your own data:** the [[small-model-trainer]] fits a decision tree, logistic regression or k-nearest neighbours to your own CSV, with train and test scores side by side, so you can compare them on the same split.

**New words:** *baseline*, *one-standard-error rule*, *standard error*, *pretrained model*, *model selection*, *interpretability*.
