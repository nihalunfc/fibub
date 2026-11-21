---
title: Hyperparameters and tuning
seoTitle: 'Hyperparameter tuning explained: grid and random search'
summary: 'Weights are learned from data; hyperparameters such as tree depth or learning rate are set by you. Search a grid of tree settings with cross-validation, and learn why random search often beats a grid.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: Which of these is a hyperparameter?
    choices: ['The weights of a linear model', 'The maximum depth of a tree', 'The threshold chosen at a tree''s root by the training algorithm']
    ans: 1
    why: You set the maximum depth before training; the weights and split thresholds are learned from the data.
  - q: 'Hyperparameters should be chosen using:'
    choices: ['The test set', 'Validation data or cross-validation on the training set', 'Training accuracy']
    ans: 1
    why: 'Choosing on the test set uses it up: its score is then optimistic. Training accuracy always favours the most complex setting.'
  - q: Why does random search often beat grid search with the same budget?
    choices: ['It tries more distinct values of each hyperparameter, and usually only a few matter', 'It is always exhaustive', 'Random numbers are better']
    ans: 0
    why: A 5 × 5 grid tries only 5 values of the setting that matters; 25 random points try 25 values of it.
---

**Module 7 · about 20 minutes · read first: 7.2.** You'll be able to tell parameters from hyperparameters, run a grid or random search with cross-validation, and avoid tuning on the test set.

## 1. Why this matters

Default settings are fine for a first try, but the gap between default and tuned can be several points of accuracy, which is real money in fraud or demand forecasting. Tuning is also where many quiet mistakes happen: tuning on the test set, or chasing the third decimal of a noisy score.

## 2. Parameters and hyperparameters

- **Parameters** are learned from the data by training: the weights of a linear model, the questions and leaf values of a tree.
- **Hyperparameters** are set before training and control how it learns: tree depth, smallest leaf, number of trees, learning rate, the penalty λ in ridge regression, `$k$` in k-NN.

There is no formula for the best hyperparameters. You try candidates and compare their **validation** scores, best with cross-validation (Lesson 7.2).

## 3. Search strategies

- **Grid search:** pick a few values for each setting and try every combination. Clear, and easy to show as a heat map, but the count multiplies: 5 settings with 5 values each is 3,125 combinations.
- **Random search:** try combinations drawn at random from ranges you choose. With the same budget, it tries more distinct values of each setting. Since usually only one or two settings matter much, it finds good values faster.
- **Smarter searches** (Bayesian optimisation, as in the Optuna library) use earlier results to choose the next try.

<!--fig:tuning-->

Good habits:

- Search on a log scale for rates and penalties (0.001, 0.01, 0.1, 1), not evenly.
- Start wide and coarse; zoom in around the best region.
- When many settings are within noise of the best, pick the simplest (shallower tree, bigger leaf, fewer trees).
- Touch the test set once, at the very end.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** choose the hyperparameters `$\lambda$` that minimise an estimate of test error, computed without the test set.

**The search:** with cross-validated error `$\text{CV}(\lambda)$` from Lesson 7.2,

```math
\hat{\lambda} = \arg\min_{\lambda \in \Lambda} \text{CV}(\lambda)
```

over a set of candidates `$\Lambda$` (a grid, or random draws).

**Why the winner's score is optimistic:** picking the best of many noisy scores favours settings that got lucky on those folds. The more candidates you try, the bigger that optimism. That is why the final score must come from data the search never saw: a held-out test set, or **nested cross-validation** (an outer loop that scores the whole tuning procedure).

**Analogy:** tuning a guitar by ear with a friend listening; the audience (the test set) hears it only at the concert.

**Try it:** a grid has depth in {2, 4, 6, 8} and smallest leaf in {1, 5, 10}, scored by 5-fold cross-validation. How many trees are trained? (4 × 3 = 12 settings × 5 folds = 60 trees, plus 1 final refit.)
</details>

## 4. Worked example

*Made-up numbers.* A forest for loan defaults, 5-fold cross-validated AUC (Lesson 4.6):

| columns per split \ smallest leaf | 1 | 5 | 20 |
|---|---|---|---|
| 2 | 0.861 | 0.866 | 0.859 |
| 4 | 0.868 | **0.871** | 0.864 |
| 8 | 0.862 | 0.865 | 0.860 |

The best cell is 4 columns, leaf 5 (0.871). Its neighbours are within 0.005, about the size of the fold-to-fold spread, so the exact choice barely matters. On the untouched test set the chosen model scores 0.866: a little below its cross-validated score, as expected after picking the best of nine.

## 5. Practice

1. In the simulation, is the best cell clearly better than its neighbours?
2. Why not choose the depth with the highest training accuracy?
3. You try 200 settings and report the best cross-validated score as your model's accuracy. What is wrong?

<details>
<summary>Answers</summary>

1. Usually not: several cells are within a point of it. Any of them is a fine choice.
2. Training accuracy always rises with depth; it would pick the most overfitted tree.
3. The best of 200 noisy scores is optimistic. Report a score on a test set the search never touched (or use nested cross-validation).
</details>

**Try it on your own data:** the [[small-model-trainer]] lets you change a tree's depth and leaf size and see the test score: a one-person grid search.

**New words:** *hyperparameter*, *grid search*, *random search*, *Bayesian optimisation*, *nested cross-validation*, *log scale*.
