---
title: Hyperparameters and tuning
seoTitle: 'Hyperparameter tuning explained: grid and random search'
summary: 'Weights are learned from data; hyperparameters such as tree depth or learning rate are set by you. Search a grid of tree settings with cross-validation, and learn why random search often beats a grid.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Bergstra and Bengio (2012), Random search for hyper-parameter optimization, Journal of Machine Learning Research 13, 281-305 https://jmlr.org/papers/v13/bergstra12a.html'
  - 'scikit-learn user guide, Tuning the hyper-parameters of an estimator https://scikit-learn.org/stable/modules/grid_search.html'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 7.10'
---

**Module 7 · about 20 minutes · read first: 7.2.** You'll be able to tell parameters from hyperparameters, run a grid or random search with cross-validation, and avoid tuning on the test set.

<div class="bigidea">Some settings the model learns by itself; others you choose before training, and you choose them by trying candidates and comparing fair validation scores.</div>

## 1. Why this matters

Default settings are fine for a first try. But the gap between default and tuned can be several points of accuracy, which is real money in fraud detection or demand forecasting. Tuning is also where many quiet mistakes happen: tuning on the test set, or chasing the third decimal of a noisy score.

## 2. Parameters and hyperparameters

Think of baking bread. The dough rises by itself: you don't place each bubble. But you choose the oven temperature and the baking time before it goes in.

- **Parameters** are like the bubbles: learned from the data by training. Examples: the weights of a linear model, the questions and leaf values of a tree.
- **Hyperparameters** are like the oven settings: set by you before training, and they control *how* it learns. Examples: tree depth, smallest leaf, number of trees, learning rate, the penalty λ (lambda) in ridge regression, `$k$` in k-nearest neighbours.

There is no formula for the best hyperparameters. You try candidates and compare their **validation** scores, best with cross-validation (Lesson 7.2).

### Watch it happen

A tiny grid search: two depths, two leaf sizes, 5-fold cross-validation, accuracy in %.

<div class="steps">
<div class="step"><p><b>List the candidates.</b> Depth 3 or 6; smallest leaf 1 or 10. That is 2 × 2 = 4 settings.</p></div>
<div class="step"><p><b>Score each fairly.</b> Each setting gets a 5-fold cross-validated score, using training data only: depth 3 leaf 1: 81.0; depth 3 leaf 10: 80.6; depth 6 leaf 1: 79.4; depth 6 leaf 10: 82.3.</p></div>
<div class="step"><p><b>Pick the best.</b> Depth 6 with leaf 10 wins at 82.3. Its neighbours are 1 to 3 points behind, more than the fold spread of about 1 point, so the choice is real.</p></div>
<div class="step"><p><b>Refit once.</b> Train depth 6, leaf 10 on all the training data. 4 settings × 5 folds = 20 trees, plus this 1.</p></div>
<div class="step"><p><b>Test once.</b> Score it on the untouched test set: 81.5. A little below 82.3, as expected after picking the best of four.</p></div>
</div>

<div class="problem" data-problem="hyperparameters-grid-count"></div>

## 3. Search strategies

- **Grid search:** pick a few values for each setting and try every combination. Clear, and easy to show as a heat map. But the count multiplies: 5 settings with 5 values each is 3,125 combinations.
- **Random search:** try combinations drawn at random from ranges you choose. With the same budget, it tries more distinct values of each setting. Usually only one or two settings matter much, so it finds good values faster.
- **Smarter searches** (Bayesian optimisation, as in the Optuna library) use earlier results to choose the next try, like a person playing "hotter, colder".

<!--fig:tuning-->

<div class="problem" data-problem="hyperparameters-random-hit"></div>

Good habits:

- Search on a log scale for rates and penalties (0.001, 0.01, 0.1, 1), not evenly. A step from 0.001 to 0.01 matters as much as one from 0.1 to 1.
- Start wide and coarse; zoom in around the best region.
- When many settings are within noise of the best, pick the simplest (shallower tree, bigger leaf, fewer trees).
- Touch the test set once, at the very end.

<div class="meaning">

<dl>
<dt>λ (a hyperparameter setting)</dt><dd>one choice of the oven settings, such as depth 6 and leaf 10</dd>
<dt>Λ (candidates)</dt><dd>all the settings you are willing to try: a grid, or random draws</dd>
<dt>CV(λ)</dt><dd>the cross-validated error of that setting, measured without the test set</dd>
<dt>arg min</dt><dd>"the λ that gives the smallest value": the winner of the search</dd>
<dt>Physical meaning</dt><dd>Tuning is rehearsal. You can rehearse as often as you like in front of friends (validation folds), but the audience (the test set) hears the performance once, and that is the review that counts.</dd>
</dl>

</div>

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

<div class="myth">

**"Keep tuning until the score stops going up."** After a point, the gains you see are luck: with 200 tries, some setting will score well on these particular folds by chance. If several settings are within the fold-to-fold spread, they are a tie. Pick the simplest and stop. The hours are better spent on better data or features.

</div>

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

<div class="keypoints">

- Parameters are learned from data; hyperparameters (depth, learning rate, penalty) are set before training.
- Choose hyperparameters by cross-validated score on the training data, never by test score or training score.
- Grid search tries every combination; random search tries more values of each setting for the same budget and often wins.
- The winner's cross-validated score is a little optimistic; the final score comes from the untouched test set.

</div>
