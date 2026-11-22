---
title: 'Deep trees overfit: depth limits and pruning'
seoTitle: 'Decision tree overfitting, max depth and pruning explained'
summary: 'Left alone, a tree splits until every leaf is pure and memorises the noise. Limit its depth, set a smallest leaf size, or grow it fully and prune it back. Find the best depth on the two-moons data.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: A tree grown with no limits scores 100 % on training data and 81 % on test data. What happened?
    choices: ['Underfitting', 'Overfitting: it memorised noisy training rows', 'Leakage']
    ans: 1
    why: An unlimited tree splits until every leaf is pure, fitting every noisy point. The gap to the test score is the cost.
  - q: 'Raising the "smallest leaf" setting from 1 to 20 rows makes the tree:'
    choices: ['More complex', 'Simpler, with fewer, bigger leaves', 'Exactly the same']
    ans: 1
    why: No leaf may hold fewer than 20 rows, so the tree cannot carve out boxes round single points.
  - q: 'Cost-complexity pruning picks the subtree that minimises:'
    choices: ['Training error only', 'Training error + α × number of leaves', 'Number of leaves only']
    ans: 1
    why: The penalty α per leaf trades fit against size, like the penalty in ridge regression (Lesson 3.8). α is chosen by cross-validation.
sources:
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Section 8.1.1 (Tree pruning) https://www.statlearning.com/'
  - 'Breiman, Friedman, Olshen and Stone (1984), Classification and Regression Trees, Wadsworth, Chapter 3 (minimal cost-complexity pruning)'
  - 'scikit-learn example: Post pruning decision trees with cost complexity pruning https://scikit-learn.org/stable/auto_examples/tree/plot_cost_complexity_pruning.html'
---

**Module 5 · about 20 minutes · read first: 3.7, 5.3.** You'll be able to spot an overfitted tree, choose its depth and leaf size, and explain how pruning works.

<div class="bigidea">A tree left alone keeps asking questions until it has memorised every training row, noise and all; limits and pruning keep only the questions that pay for themselves.</div>

## 1. Why this matters

A single decision tree is the textbook example of a model that overfits easily. Every tree library has the same few settings to stop it (`max_depth`, `min_samples_leaf`, `ccp_alpha`), and knowing what they do is half of tuning trees. The other half, averaging many trees, is Module 6.

## 2. Why deep trees overfit

A tree can always keep splitting until each leaf holds one class, or one row. Then it gets every training row right, including the noisy ones: a box drawn round a single mislabelled point. It is like a student who memorises last year's exam answers, typos included. On new data those little boxes are wrong more often than right.

<!--fig:tree-depth-->

Watch the lower chart: training accuracy only climbs with depth; test accuracy climbs, levels off, then sags. That is the overfitting curve of Lesson 3.7 again, with depth as the flexibility dial.

## 3. Three ways to stop it

- **Maximum depth.** No path may ask more than `$d$` questions. Simple and common; depths of 3 to 10 are typical for a single tree.
- **Smallest leaf** (or smallest box to split). A leaf must hold at least `$m$` rows, so no box can be drawn round one point. Often the most effective single setting.
- **Pruning.** Grow the full tree, then cut back branches whose splits don't earn their keep, like a gardener trimming a hedge. Because it looks at the whole tree before deciding, it can keep a weak split that leads to a strong one below, which an early stop would miss.

Choose each setting with a validation set or cross-validation (Lessons 7.2 and 7.3), never with the test set.

## 4. Pruning by cost

Cost-complexity pruning gives every leaf a price, `$\alpha$` (alpha). The tree's "cost" is its training error plus `$\alpha$` for each leaf it keeps. A branch survives only if the error it saves is worth more than the leaves it uses.

<div class="steps">
<div class="step"><p><b>A branch with 3 leaves.</b> With it, the tree's training error is 0.10.</p></div>
<div class="step"><p><b>Collapse it into 1 leaf.</b> The training error rises to 0.13: a rise of 0.03. But the tree saves 2 leaves.</p></div>
<div class="step"><p><b>Compare costs.</b> Keeping costs 0.10 + 3α. Collapsing costs 0.13 + α. Collapsing is cheaper when 2α > 0.03.</p></div>
<div class="step"><p><b>The break-even price.</b> α > 0.015: above that price per leaf, the branch is cut.</p></div>
<div class="step"><p><b>Turn the dial.</b> As α rises from 0, weak branches go first, then stronger ones, until only the root is left. Cross-validation picks the α whose tree does best on unseen data.</p></div>
</div>

<div class="meaning">

<dl>
<dt>error(T)</dt><dd>How often tree T is wrong on the training data (or its squared error, for numbers).</dd>
<dt>|T|</dt><dd>The number of leaves in tree T: a measure of how complicated it is.</dd>
<dt>α</dt><dd>The price charged per leaf. 0 keeps the full tree; a large α leaves only the root.</dd>
<dt>Physical meaning</dt><dd>Editing an essay. Write it all, then cut every sentence that doesn't pay for the space it takes. α is how strict the editor is.</dd>
</dl>

</div>

<div class="problem" data-problem="pruning-alpha"></div>

<div class="myth">

**"100 % training accuracy shows the tree has learned the data perfectly."** For a tree it shows almost nothing. Any tree with no limits can reach 100 % by memorising, noise included. Only the score on data the tree has never seen tells you whether it has learned something that carries over.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** prefer the smallest tree that fits nearly as well as a big one (Occam's razor, as a penalty).

**Cost-complexity pruning** (used by CART and scikit-learn): for a penalty `$\alpha \ge 0$` per leaf, choose the subtree `$T$` that minimises

```math
C_\alpha(T) = \text{error}(T) + \alpha \, \lvert T \rvert
```

where `$\lvert T \rvert$` is the number of leaves and error is the training misclassification rate (or squared error). At `$\alpha = 0$` the full tree wins; as `$\alpha$` grows, branches are cut one by one until only the root is left. Each `$\alpha$` gives one tree; cross-validation picks `$\alpha$`.

**When is a branch worth keeping?** Collapsing a branch with `$L$` leaves into one leaf raises the error by `$\Delta$` and saves `$L - 1$` leaves. It is pruned once `$\alpha > \Delta / (L - 1)$`.

**Try it:** a branch has 3 leaves; collapsing it to one leaf raises training error from 0.10 to 0.13. For which `$\alpha$` is it pruned? (`$\Delta = 0.03$`, saving 2 leaves: pruned when `$\alpha > 0.015$`.)
</details>

## 5. Worked example

*Made-up numbers.* A churn tree, scored by 5-fold cross-validation:

| max depth | leaves | training accuracy | cross-validated accuracy |
|---|---|---|---|
| 2 | 4 | 78 % | 77 % |
| 4 | 15 | 86 % | 84 % |
| 6 | 41 | 92 % | 83 % |
| none | 212 | 100 % | 76 % |

Depth 4 has the best cross-validated score. Depth 6 is about as good on validation but needs 41 leaves to say it; with "the simplest model within a whisker of the best", choose depth 4. The unlimited tree is the worst of all on new data, despite its perfect training score.

## 6. Practice

1. In the simulation, set depth 14 and smallest leaf 1, then raise the smallest leaf to 15. What happens to training and test accuracy?
2. Why might pruning beat a depth limit?
3. Why is "training accuracy 100 %" a warning, not a boast, for a tree?

<details>
<summary>Answers</summary>

1. Training accuracy falls (no more boxes round single points) while test accuracy holds or rises: less overfitting.
2. A depth limit stops every branch at the same depth. Pruning looks at the finished tree, keeps deep branches where they help and cuts shallow ones where they don't.
3. Any unlimited tree can reach it by memorising, noise included; it says nothing about new data.
</details>

<div class="keypoints">

- Unlimited trees memorise noise: perfect on training data, worse on new data.
- Maximum depth and smallest leaf size stop the tree early; pruning cuts it back after growing.
- Cost-complexity pruning charges α per leaf; a branch is cut when α is more than its error saving per leaf saved.
- Choose depth, leaf size or α by cross-validation, never on the test set.

</div>

**Try it on your own data:** the [[small-model-trainer]] has a maximum depth and a smallest leaf setting; watch training and test accuracy as you change them.

**New words:** *maximum depth*, *minimum leaf size*, *pre-pruning* (early stopping), *post-pruning*, *cost-complexity pruning*.
