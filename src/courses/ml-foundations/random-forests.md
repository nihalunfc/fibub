---
title: Random forests
seoTitle: 'Random forests explained, with a simulation'
summary: 'A random forest grows many deep trees, each on a bootstrap sample and each split choosing from a random handful of columns, then lets them vote. Add trees one by one and watch the jagged boxes smooth into a good boundary.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A random forest adds what to bagging?'
    choices: ['Each split considers only a random subset of the columns', 'Shallower trees', 'Training trees one after another on the errors']
    ans: 0
    why: Random columns at each split make the trees less alike (less correlated), so averaging them helps more.
  - q: Adding more and more trees to a random forest
    choices: ['Eventually overfits badly', 'Levels off: more trees never hurt accuracy, they only cost time', 'Always keeps improving accuracy']
    ans: 1
    why: More trees just make the average more stable. The gain levels off, typically after a few hundred trees.
  - q: 'With 16 columns, the usual default for a classification forest is to try at each split about:'
    choices: ['All 16 columns', '4 columns (the square root)', '1 column']
    ans: 1
    why: √16 = 4 for classification; for regression a common default is a third of the columns or all of them, depending on the library.
sources:
  - 'Breiman (2001), Random forests, Machine Learning 45, 5-32 https://doi.org/10.1023/A:1010933404324'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Chapter 15 (Random forests)'
  - 'scikit-learn user guide: Ensembles, random forests https://scikit-learn.org/stable/modules/ensemble.html#random-forests-and-other-randomized-tree-ensembles'
---

**Module 6 · about 25 minutes · read first: 6.2.** You'll be able to explain how a random forest is built and why the random columns matter, choose its main settings, and read its out-of-bag score.

<div class="bigidea">A random forest is a crowd of deep trees, each shown different rows and, at every question, only a few of the columns, so they disagree in useful ways and their vote is steady.</div>

## 1. Why this matters

The random forest (Leo Breiman, 2001) is the most dependable first model for table data. It needs almost no tuning, handles numbers and categories, copes with useless columns and odd scales, rarely overfits badly, and gives a built-in test score. Many data teams try a random forest before anything else, and keep it more often than you'd expect.

## 2. Two kinds of randomness

A random forest is bagged trees (Lesson 6.2) plus one more trick:

1. **Random rows:** each tree is grown on its own bootstrap sample.
2. **Random columns:** at every split, the tree may only choose among a random handful of `$m$` columns (a fresh handful at each split).

Then all trees vote (classification) or are averaged (regression). The trees are grown deep, with no pruning: each one overfits in its own way, and the vote cancels it out.

Why the random columns? With bagging alone, if one column is very strong, every tree puts it at the top and the trees end up alike. Their mistakes are then correlated, and averaging helps less (Lesson 6.1). Hiding the strong column from some splits forces trees to find other routes, and the forest gets more varied. It is like a quiz team where each member is only allowed to study some of the topics: nobody can copy the best student, so they learn different things.

<!--fig:forest-vote-->

<div class="steps">
<div class="step"><p><b>Tree 1</b> gets its own bootstrap sample of the customers. At its first split it may only look at 4 of the 16 columns, say tenure, region, age and plan.</p></div>
<div class="step"><p><b>It picks the best of those four</b> (tenure), splits, and at the next split draws a new random 4. It keeps going until its leaves are pure.</p></div>
<div class="step"><p><b>Trees 2 to 300</b> do the same with their own samples and their own random columns. The strongest column, contract type, is missing from about three quarters of the first splits, so many trees start somewhere else.</p></div>
<div class="step"><p><b>A new customer arrives.</b> 210 trees say "leaves", 90 say "stays". The forest predicts "leaves" with probability 210 ÷ 300 = 0.70.</p></div>
</div>

<div class="meaning">

<dl>
<dt>B</dt><dd>The number of trees in the forest.</dd>
<dt>m</dt><dd>How many randomly chosen columns each split may look at (often √p for p columns).</dd>
<dt>P̂(y = c | x)</dt><dd>The forest's probability for class c: the average of the trees' answers, which is close to the share of trees voting for c.</dd>
<dt>Physical meaning</dt><dd>A panel of experts who each studied a different selection of case files and were each told to ignore some of the evidence. None is the best expert, but their vote beats any one of them, because their blind spots are in different places.</dd>
</dl>

</div>

<div class="problem" data-problem="random-forests-oob-trees"></div>

## 3. The settings that matter

- **Number of trees.** More is never worse, only slower. A few hundred is usual; stop when the out-of-bag score stops improving.
- **Columns per split, `$m$`.** The main tuning dial. A common default is `$\sqrt{p}$` of the `$p$` columns for classification. Smaller `$m$` means more varied but individually weaker trees.
- **Leaf size or depth.** Usually left deep; a slightly larger smallest leaf can help on noisy data.

Things a forest does not do well: extrapolate beyond the training range (it is made of trees, Lesson 5.4), explain itself in one picture (a hundred trees is not a rule you can print), or handle very wide, sparse data such as raw text as well as linear models do.

<div class="myth">

**"Too many trees will make a random forest overfit."** Adding trees doesn't make any single tree more complex; it only makes the average steadier. Accuracy rises and then levels off. What can overfit is the individual tree settings (leaves that are too small on very noisy data), not the number of trees. Extra trees cost only time.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** average many low-bias, high-variance trees, and make them as uncorrelated as possible so the average removes most of the variance.

**The forest's prediction** with trees `$T_1, \dots, T_B$`: for regression the mean, for classification the average share for each class,

```math
\hat{P}(y = c \mid \mathbf{x}) = \frac{1}{B}\sum_{b=1}^{B} \hat{P}_b(y = c \mid \mathbf{x})
```

**Why fewer columns help:** from Lesson 6.1, the averaged prediction has variance `$\rho \sigma^2 + (1-\rho)\sigma^2 / B$`. As `$B$` grows the second part vanishes; what remains, `$\rho\sigma^2$`, falls as the trees become less correlated, and random columns lower `$\rho$`.

**Try it:** with 25 columns in a classification problem, how many does each split look at by default? (`$\sqrt{25} = 5$`.)
</details>

## 4. Worked example

*Made-up numbers.* A telecom company predicts which customers will leave, with 16 columns and 20,000 rows.

| model | test accuracy | out-of-bag accuracy |
|---|---|---|
| one deep tree | 84.1 % | (none) |
| bagging, 300 trees, all 16 columns per split | 88.6 % | 88.4 % |
| random forest, 300 trees, 4 columns per split | 89.9 % | 89.7 % |

The random columns add 1.3 points over plain bagging. The out-of-bag score lands within 0.2 points of the test score, so for tuning the forest the team could have skipped the separate validation set.

## 5. Practice

1. In the simulation, compare 1 tree with 60. What happens to the shading and the test accuracy?
2. Why are the forest's trees grown deep instead of pruned?
3. Your forest has 500 trees and you raise it to 2,000. What do you expect?

<details>
<summary>Answers</summary>

1. The hard boxes become a smooth gradient of vote shares, and test accuracy rises by several points before levelling off.
2. Deep trees have low bias; their high variance is what the averaging removes. Pruned trees would add bias that averaging can't fix.
3. Almost the same accuracy, four times the training and prediction time.
</details>

<div class="keypoints">

- A random forest = bootstrap samples (random rows) + a random handful of columns at every split + a vote.
- The random columns make the trees less alike, so averaging removes more of their errors.
- More trees never hurt accuracy, only speed; the main dial is the number of columns per split.
- Each row is left out by about a third of the trees, which gives a free out-of-bag score.

</div>

**Try it on your own data:** the [[small-model-trainer]] grows a single tree on your CSV and reports its test accuracy: the baseline a random forest (in Python or R) should beat.

**New words:** *random forest*, *feature subsampling*, *mtry* (columns per split), *out-of-bag score*, *decorrelation*.
