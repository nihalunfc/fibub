---
title: Gradient boosting
seoTitle: 'Gradient boosting explained step by step (XGBoost idea)'
summary: 'Start from the average, then add small trees one at a time, each fitted to the residuals: what the model still gets wrong. This is gradient descent in function space, the idea behind XGBoost and LightGBM. Boost by hand.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In gradient boosting with squared error, each new tree is fitted to:'
    choices: ['The original targets', 'The residuals: target minus the current prediction', 'Random noise']
    ans: 1
    why: For squared error, the negative gradient of the loss is exactly the residual y − F(x).
  - q: 'A smaller learning rate (shrinkage) usually needs:'
    choices: ['More trees, and often gives a better test score', 'Fewer trees', 'Deeper trees']
    ans: 0
    why: Each tree adds a smaller step, so more steps are needed, but the small steps overfit less.
  - q: 'The number of boosting rounds should be chosen by:'
    choices: ['Training error', 'Validation error (stop when it stops falling)', 'Always 100']
    ans: 1
    why: Training error keeps falling forever; validation error turns up when the model starts fitting noise. Early stopping picks the bottom.
sources:
  - 'Friedman (2001), Greedy function approximation: a gradient boosting machine, The Annals of Statistics 29(5), 1189-1232 https://doi.org/10.1214/aos/1013203451'
  - 'Chen and Guestrin (2016), XGBoost: a scalable tree boosting system, Proceedings of KDD 2016, 785-794 https://doi.org/10.1145/2939672.2939785'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 10.10 (Numerical optimization via gradient boosting)'
  - 'scikit-learn user guide: Gradient-boosted trees https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosted-trees'
---

**Module 6 · about 30 minutes · read first: 1.5, 5.4, 6.5.** You'll be able to run gradient boosting by hand for a few rounds, explain residuals as gradients, and set the learning rate, tree depth and number of rounds.

<div class="bigidea">Gradient boosting starts with a rough guess, then adds small trees one at a time, each one a gentle correction aimed at whatever is still wrong.</div>

## 1. Why this matters

Gradient-boosted trees (XGBoost, LightGBM, CatBoost) win most machine-learning competitions on table data and run in production at banks, shops and search engines. If you work with spreadsheets and databases, it is the model you will most likely end up shipping. Under the hood it is just regression trees (Lesson 5.4) and gradient descent (Lesson 1.5), put together.

## 2. Fitting the residuals

For a number to predict, with squared error:

1. Start with a constant: `$F_0(\mathbf{x}) = \bar{y}$`, the average.
2. Work out the **residuals** `$r_i = y_i - F_0(\mathbf{x}_i)$`: what is still unexplained for each row.
3. Fit a small regression tree `$h_1$` to the residuals (not to `$y$`).
4. Update: `$F_1 = F_0 + \eta \, h_1$`, where `$\eta$` (eta) is the **learning rate**, say 0.1.
5. Repeat from step 2 with the new residuals.

Each tree is a small correction. Adding only a fraction `$\eta$` of each one, rather than all of it, leaves room for later trees and overfits less. Think of a golfer: the first shot gets near the hole, each putt aims at what is left, and a careful golfer taps rather than slams.

<div class="steps" data-fig="gradient-boosting-rounds">
<div class="step"><p><b>Round 0: the average.</b> Four houses priced 100, 120, 200 and 220 ($1,000s). Predict 160 for every one.</p></div>
<div class="step"><p><b>The residuals:</b> −60, −40, +40, +60. Small houses are overpriced by the guess, big ones underpriced.</p></div>
<div class="step"><p><b>Round 1.</b> A stump on the residuals splits at size 80: left leaf −50, right leaf +50. Take half a step (η = 0.5): predictions 135 and 185.</p></div>
<div class="step"><p><b>Round 2.</b> New residuals −35, −15, +15, +35. The same split gives leaves −25 and +25; half a step: 122.5 and 197.5.</p></div>
<div class="step"><p><b>The error shrinks every round.</b> Sum of squared residuals: 10,400, then 2,900, then 1,025. Later rounds start fixing smaller details, like the gap between the two small houses.</p></div>
</div>

<!--fig:boost-steps-->

<div class="problem" data-problem="gradient-boosting-round"></div>

## 3. Why "gradient"?

For squared error `$L = \tfrac12 (y - F)^2$`, the slope (derivative) with respect to the prediction `$F$` is `$-(y - F)$`: the residual with a minus sign. So "fit a tree to the residuals and take a step" is the same as "fit a tree to the negative gradient and take a step". It is gradient descent, where the thing being adjusted is the whole prediction function instead of a few weights.

<div class="meaning">

<dl>
<dt>F<sub>m</sub>(x)</dt><dd>The model's prediction after m rounds: the starting average plus all the small corrections so far.</dd>
<dt>r<sub>i</sub></dt><dd>The pseudo-residual of row i: which way, and how far, the loss wants that prediction to move. For squared error it is just y − F.</dd>
<dt>h<sub>m</sub></dt><dd>The small tree fitted to those residuals in round m.</dd>
<dt>η</dt><dd>The learning rate: the fraction of each tree's correction actually used.</dd>
<dt>Physical meaning</dt><dd>Walking downhill in fog. Each tree is one step in the direction that looks steepest from where you stand; the learning rate is the length of your stride. Short strides take longer but rarely overshoot.</dd>
</dl>

</div>

That view lets boosting use any loss with a slope. For classification, use log-loss (Lesson 4.3): the negative gradient is `$y - p$`, the label minus the predicted probability. For predictions that must resist outliers, use absolute or Huber loss.

## 4. The settings

- **Learning rate `$\eta$`.** 0.01 to 0.3. Smaller is usually better, and slower.
- **Number of trees.** Set by **early stopping**: watch the validation error each round and stop when it hasn't improved for, say, 50 rounds.
- **Tree depth.** Small trees: 2 to 8 levels. Depth 1 (stumps) models each column on its own; depth 2 allows two-column interactions.
- **Subsampling.** Train each tree on a random 50 to 80 % of rows (and columns), as in a forest: faster, and usually better.

<div class="myth">

**"Training error keeps falling, so more rounds are always better."** Training error always falls with more rounds, because each tree fixes a bit more of the training data, noise included. The validation error falls, flattens, then rises once the trees start chasing noise. Early stopping watches the validation error and stops at its lowest point.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** minimise a loss over functions by repeatedly adding a small tree that points downhill.

**Round `$m$`:** compute the negative gradients ("pseudo-residuals")

```math
r_{i} = -\left.\frac{\partial L(y_i, F)}{\partial F}\right|_{F = F_{m-1}(\mathbf{x}_i)}
```

fit a regression tree `$h_m$` to the pairs `$(\mathbf{x}_i, r_i)$`, and update

```math
F_m(\mathbf{x}) = F_{m-1}(\mathbf{x}) + \eta \, h_m(\mathbf{x})
```

For squared error `$L = \tfrac12 (y - F)^2$`, `$r_i = y_i - F_{m-1}(\mathbf{x}_i)$`, the ordinary residual.

**XGBoost's extras:** it also uses the second derivative (a Newton step), and adds penalties on the number of leaves and the size of leaf values: regularisation (Lesson 3.8) for trees.

**Try it:** a row has `$y = 10$`, and the current prediction is 6. The new tree predicts +3.5 for it and `$\eta = 0.5$`. New prediction? New residual? (6 + 0.5 × 3.5 = 7.75; residual 2.25.)
</details>

## 5. Worked example

*Made-up numbers.* Four houses, one input (size), prices in $1,000s: 100, 120, 200, 220 for sizes 50, 60, 100, 110. Learning rate 0.5, stumps.

- **Round 0:** `$F_0$` = mean = 160. Residuals: −60, −40, 40, 60.
- **Round 1:** the best stump on the residuals splits at size 80: left mean −50, right mean +50. Update: `$F_1$` = 160 + 0.5 × (−50) = 135 for the small houses, 160 + 25 = 185 for the big ones. Residuals: −35, −15, 15, 35.
- **Round 2:** again the best split is at 80, with leaf means −25 and +25. `$F_2$` = 122.5 and 197.5. Residuals: −22.5, −2.5, 2.5, 22.5.
- **Round 3:** the gap between the two groups is now small, so the best stump changes: splitting off the smallest house (size ≤ 55: leaf values −22.5 and +7.5) removes more error than another split at 80.

The training error falls every round: sum of squared residuals 10,400, then 2,900, then 1,025. With a learning rate of 1 the first stump would have jumped straight to 110 and 210; the smaller steps take longer but, on real noisy data, generalise better.

## 6. Practice

1. In the simulation, add 100 trees at learning rate 1 and at 0.1. Which has the lower test error?
2. Why are boosting's trees kept small?
3. What is early stopping, and why is it needed for boosting but not for a random forest?

<details>
<summary>Answers</summary>

1. Usually 0.1: the big steps start chasing noise early, and the test error climbs while the training error keeps falling.
2. Each tree only needs to fix a little; small trees are weak learners that keep each step gentle and stop the model overfitting quickly.
3. Stopping at the round where validation error is lowest. Boosting keeps fitting the training data more closely with every tree and eventually fits noise; a forest's average just settles.
</details>

<div class="keypoints">

- Gradient boosting starts from the average and adds small trees fitted to the residuals.
- Each tree is added at a fraction η (the learning rate) of its full size; smaller η needs more trees and usually generalises better.
- Residuals are the negative gradient of squared error, so boosting is gradient descent on the prediction function; other losses give other pseudo-residuals.
- Choose the number of rounds by early stopping on validation data.

</div>

**Try it on your own data:** the [[regression-workbench]] fits a linear model to your table; its residual plot shows exactly what a first boosting tree would try to fix.

**New words:** *gradient boosting*, *residual*, *pseudo-residual*, *learning rate* (shrinkage), *early stopping*, *XGBoost*, *LightGBM*.
