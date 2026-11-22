---
title: Feature importance, and what it does not tell you
seoTitle: 'Feature importance explained: impurity vs permutation'
summary: 'Forests report how much each column helped. Learn the two common measures, impurity and permutation importance, and their traps: noise columns that score, copies that split the credit, and importance that is not cause.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Impurity-based importance of a column is:'
    choices: ['Its share of all the impurity removed by splits on it, over all trees', 'Its correlation with the target', 'Its regression weight']
    ans: 0
    why: Every split on the column removes some impurity; add those drops up over all trees and divide by the total.
  - q: Two columns are near copies of each other. Their importances
    choices: ['Both look high', 'Share the credit, so each looks less important than the information really is', 'Are unaffected']
    ans: 1
    why: Trees use one or the other at random, so the credit is split between them.
  - q: '"Square footage has the highest importance" means:'
    choices: ['Making a house bigger causes its price to rise by that much', 'The model leaned on it most for its predictions', 'It is the only column that matters']
    ans: 1
    why: Importance describes the model, not the world. Cause needs an experiment or careful causal analysis (Lesson 2.3).
sources:
  - 'Breiman (2001), Random forests, Machine Learning 45, 5-32 (permutation importance) https://doi.org/10.1023/A:1010933404324'
  - 'Strobl, Boulesteix, Zeileis and Hothorn (2007), Bias in random forest variable importance measures, BMC Bioinformatics 8, 25 https://doi.org/10.1186/1471-2105-8-25'
  - 'scikit-learn user guide: Permutation feature importance https://scikit-learn.org/stable/modules/permutation_importance.html'
---

**Module 6 · about 25 minutes · read first: 2.3, 6.3.** You'll be able to read a feature-importance chart, compute permutation importance by hand, and list the traps before you quote one.

<div class="bigidea">Feature importance tells you which columns the model leaned on, not which ones change the real world, and the cheap version can be fooled by noise.</div>

## 1. Why this matters

"Which factors drive churn?" is often the real question behind a model, and the importance chart is the first thing managers ask for. It is useful, and easy to misread. Knowing the two measures and their traps keeps you from telling a board that the customer ID drives sales.

## 2. Impurity importance

Every split in every tree lowers impurity by some amount (Lesson 5.3). Add up those drops for each column, over all splits and all trees, and divide by the grand total. Each column gets a share, and the shares add to 100 %. It comes free (worked out while training) and is what most libraries show by default.

<!--fig:importance-->

Its traps, all visible in the simulation:

- **Noise gets a sliver.** A column of random numbers still offers thresholds, and deep trees use some of them on training data. Columns with many different values (IDs, timestamps) get the most of this undeserved credit.
- **Copies split the credit.** Two columns that carry the same information share its importance, so each looks half as important.
- **It is measured on training data,** so it reflects what the model memorised as well as what carries over to new data.

## 3. Permutation importance

A more honest measure, for any model, measured on data the model has not seen:

1. Score the trained model on validation data.
2. Shuffle one column's values (which breaks its link with the target), keep everything else, and score again.
3. The drop in score is that column's importance.

<div class="steps">
<div class="step"><p><b>Score the model.</b> A churn forest gets 0.880 accuracy on validation data it never trained on.</p></div>
<div class="step"><p><b>Shuffle one column.</b> Mix up "contract type" between customers, like dealing the values out again at random. The column still looks normal, but it no longer matches anyone.</p></div>
<div class="step"><p><b>Score again.</b> Accuracy falls to 0.792. The drop, 0.088, is contract type's permutation importance.</p></div>
<div class="step"><p><b>Repeat for each column.</b> Shuffling "customer ID" gives 0.879: a drop of 0.001. The model was not really using it on new data.</p></div>
<div class="step"><p><b>Average over a few shuffles</b> to smooth out luck, then rank the columns by their drop.</p></div>
</div>

<div class="meaning">

<dl>
<dt>S</dt><dd>The model's score (say accuracy) on validation data.</dd>
<dt>S<sub>(j)</sub></dt><dd>The score after column j's values are shuffled.</dd>
<dt>PI(j) = S − S<sub>(j)</sub></dt><dd>Permutation importance: how much worse the model does without the real information in column j.</dd>
<dt>Physical meaning</dt><dd>Finding out which players a team relies on by benching them one at a time and watching the score. A player whose absence costs nothing wasn't carrying the team, however busy they looked in training.</dd>
</dl>

</div>

<div class="problem" data-problem="feature-importance-permutation"></div>

A column the model really relies on causes a big drop; a noise column, almost none. Permutation importance still shares the copies problem (shuffle one copy and the model uses the other), so drop or group near-duplicate columns first.

## 4. Importance is not cause

Importance says what the **model** used, not what changes the **outcome**. Ice-cream sales are an important predictor of drownings (both rise in summer, Lesson 2.3); banning ice cream saves nobody. To ask "what if we changed X?", you need an experiment or a causal analysis.

<div class="myth">

**"The top feature is the lever to pull."** A model can lean heavily on a column that changes nothing. If big discounts are given to customers who were already about to leave, "discount size" will predict churn well, and giving everyone bigger discounts may do nothing, or make churn look worse. Importance points at where to look; an experiment tells you what works.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** credit a column with the improvement it brings, either inside the trees (impurity) or on held-out data (permutation).

**Impurity importance** of column `$j$` over a forest of `$B$` trees, where each split `$s$` on column `$j$` has `$n_s$` rows and gain `$\Delta I_s$`:

```math
\text{Imp}(j) = \frac{1}{B} \sum_{b=1}^{B} \sum_{s \in T_b,\; s \text{ splits on } j} \frac{n_s}{n} \Delta I_s
```

then scaled so all columns add to 1.

**Permutation importance** with score `$S$` (say accuracy) on validation data, and `$S_{(j)}$` the score after shuffling column `$j$`:

```math
\text{PI}(j) = S - S_{(j)}
```

usually averaged over several shuffles.

**Try it:** a model scores 0.86 on validation. Shuffling "age" gives 0.84, shuffling "income" 0.71, shuffling "customer ID" 0.86. Rank them. (Income 0.15, age 0.02, ID 0.)
</details>

## 5. Worked example

*Made-up numbers.* A churn forest on validation data (accuracy 0.880):

| column | impurity importance | accuracy after shuffling | permutation importance |
|---|---|---|---|
| contract type | 21 % | 0.792 | 0.088 |
| monthly charge | 30 % | 0.851 | 0.029 |
| tenure (months) | 26 % | 0.836 | 0.044 |
| customer ID | 23 % | 0.879 | 0.001 |

Impurity importance ranks monthly charge first and gives the customer ID nearly a quarter of the credit: it has thousands of different values, so the trees found plenty of lucky splits in it. Permutation importance, measured on new data, puts contract type first and shows the ID is worthless. Drop the ID and retrain.

## 6. Practice

1. In the simulation, how much importance does the house number get, and why is it not zero?
2. Why might "area in square metres" look less important once "area in square feet" is added?
3. A manager reads "discount size is the top feature" as "bigger discounts reduce churn". What would you say?

<details>
<summary>Answers</summary>

1. A few per cent. Deep trees find some splits on it that happen to help on training data.
2. The two carry the same information, so the trees split their use (and the credit) between them.
3. Importance shows the model relies on it, not that it causes anything. Maybe big discounts go to customers who were already about to leave. Test it with an experiment.
</details>

<div class="keypoints">

- Impurity importance adds up each column's impurity drops inside the trees; it is free but measured on training data.
- It over-credits noisy, many-valued columns such as IDs, and splits credit between near-copies.
- Permutation importance shuffles one column on validation data and measures the drop in score.
- Importance describes the model, not cause and effect; use an experiment to learn what a change would do.

</div>

**Try it on your own data:** the [[small-model-trainer]] trains models on your CSV; shuffle one column in a copy of your file and see how much the test score drops, which is permutation importance by hand.

**New words:** *feature importance*, *impurity importance*, *permutation importance*, *high-cardinality column*, *correlated features*.
