---
title: 'Information gain: choosing the best split'
seoTitle: 'Information gain and Gini gain: how trees choose splits'
summary: 'A tree tries every column and every cut, and keeps the one that lowers impurity the most. Slide a cut along twelve customers, watch the gain change, and work a split out by hand.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Information gain is:'
    choices: ['The impurity before the split minus the weighted impurity after it', 'The number of rows in the bigger child', 'The accuracy of the tree']
    ans: 0
    why: 'Gain = impurity(parent) − Σ (child size ÷ parent size) × impurity(child).'
  - q: Why are the children's impurities weighted by their sizes?
    choices: ['So a tiny pure child cannot win on its own', 'To make the numbers smaller', 'Because Gini needs it']
    ans: 0
    why: 'Without weights, splitting off one row would give a "pure" child and look great while the other 99 rows stay just as mixed.'
  - q: A column has values 2, 5, 5, 9. Which thresholds does the tree try?
    choices: ['Every number from 2 to 9', '3.5 and 7 (halfway between neighbouring different values)', 'Only 5']
    ans: 1
    why: Only cuts between different sorted values change which rows go where, so the midpoints 3.5 and 7 are enough.
sources:
  - 'Quinlan (1986), Induction of decision trees, Machine Learning 1, 81-106 https://doi.org/10.1007/BF00116251'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 9.2 (Tree-based methods)'
  - 'scikit-learn user guide: Decision trees, mathematical formulation https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation'
---

**Module 5 · about 25 minutes · read first: 5.2.** You'll be able to compute the gain of a split, find the best threshold for a column by hand, and explain why trees prefer some columns.

<div class="bigidea">A tree tries every question it could ask and keeps the one that leaves the two new groups tidiest, measured as the drop in impurity.</div>

## 1. Why this matters

This is the step that builds every tree, and so every random forest and boosting model: thousands of times per model, the algorithm searches for the split with the largest gain. Knowing it explains why trees love columns with many different values, why they are fast, and where feature importance (Lesson 6.4) comes from.

## 2. The gain of a split

A split sends the `$n$` rows of a parent box into a left child (`$n_L$` rows) and a right child (`$n_R$` rows). The **gain** is how much impurity it removes:

```math
\text{gain} = I(\text{parent}) - \frac{n_L}{n} I(\text{left}) - \frac{n_R}{n} I(\text{right})
```

Here `$I$` is Gini impurity or entropy (Lesson 5.2). With entropy this is called **information gain**; with Gini, often **Gini gain** or "decrease in impurity". The weights `$n_L/n$` and `$n_R/n$` are each child's share of the rows. They stop a tiny child from winning: splitting off a single row makes that row "pure", but it barely changes the big mixed group, so the weighted average hardly drops.

<div class="meaning">

<dl>
<dt>I(parent)</dt><dd>How mixed the group is before the question.</dd>
<dt>n<sub>L</sub>/n, n<sub>R</sub>/n</dt><dd>Each side's share of the rows, used as weights.</dd>
<dt>gain</dt><dd>How much tidier the groups are, on average, after the question. Never negative.</dd>
<dt>Physical meaning</dt><dd>Sorting a pile of mixed laundry with one question ("is it white?"). A good question leaves two piles that are each nearly one kind. The gain is how much sorting that single question did.</dd>
</dl>

</div>

## 3. Searching for the best split

For each column:

1. Sort the rows by that column.
2. Try a threshold halfway between each pair of neighbouring different values.
3. Work out the gain of each.

Keep the best (column, threshold) pair over all columns. Keeping running counts of each class as you move along the sorted list, every threshold costs only a few sums, so this is fast even for millions of rows.

<!--fig:split-search-->

<div class="steps">
<div class="step"><p><b>Twelve customers, sorted by visits per month.</b> Six stayed (S), six left (L). Gini of the whole group: 0.5.</p></div>
<div class="step"><p><b>Try a cut at 3.5 visits.</b> Left: 3 customers, all L (Gini 0). Right: 9 customers, 6 S and 3 L (Gini 0.444).</p></div>
<div class="step"><p><b>Weigh and subtract.</b> 3/12 × 0 + 9/12 × 0.444 = 0.333. Gain = 0.5 − 0.333 = 0.167.</p></div>
<div class="step"><p><b>Try a cut at 6.5 visits.</b> Left: 1 S, 5 L (Gini 0.278). Right: 5 S, 1 L (Gini 0.278). Weighted 0.278, gain 0.222.</p></div>
<div class="step"><p><b>Keep the best.</b> 6.5 wins. Two fairly clean halves beat one pure sliver and a messy rest. Then the tree repeats the search inside each half.</p></div>
</div>

<div class="problem" data-problem="information-gain-split"></div>

## 4. Stopping

Splitting stops in a box when:

- it is pure (no gain is possible), or
- no split has a gain above a small minimum, or
- a limit is hit: maximum depth, or the fewest rows allowed in a leaf (Lesson 5.5).

<div class="myth">

**"A column with a big information gain is a real, useful signal."** It may be luck. A column with many different values, such as a customer ID or a timestamp, offers hundreds of possible cuts, and by chance one of them often looks good on the training data. Drop ID-like columns before training, and check importance on held-out data (Lesson 6.4).

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** greedy search: at each box, take the split with the largest weighted drop in impurity.

**Information gain** with entropy `$H$` is the mutual information between the question's answer and the class: how many bits of uncertainty about the class the answer removes,

```math
IG = H(Y) - H(Y \mid \text{answer})
```

**Analogy:** a sorting hat that tries every possible question once and keeps the one after which the two piles are tidiest.

**Try it:** a parent of 8 (4 and 4, Gini 0.5) splits into 4 (3 and 1) and 4 (1 and 3). Gain? (Each child: `$p = 0.75$`, Gini 0.375. Weighted: 0.375. Gain = 0.5 − 0.375 = 0.125.)
</details>

## 5. Worked example

*Made-up numbers,* the same as the simulation. Twelve customers, sorted by visits per month (1 to 12), and whether they stayed (S) or left (L):

| visits | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | L | L | L | S | L | L | S | S | L | S | S | S |

Before splitting: 6 S, 6 L, Gini 0.5.

- **Cut at 3.5:** left 3 (all L): Gini 0. Right 9 (6 S, 3 L): Gini = 1 − (6/9)² − (3/9)² = 1 − 0.444 − 0.111 = 0.444. Weighted: 3/12 × 0 + 9/12 × 0.444 = 0.333. Gain = 0.5 − 0.333 = **0.167**.
- **Cut at 6.5:** left 6 (1 S, 5 L): Gini = 1 − (1/6)² − (5/6)² = 0.278. Right 6 (5 S, 1 L): also 0.278. Weighted: 0.278. Gain = **0.222**.

The cut at 6.5 wins, though neither child is pure.

## 6. Practice

1. In the simulation, find a cut whose gain is 0. Why is it zero?
2. Why is the gain of a split never negative?
3. A column takes only the values 0 and 1. How many thresholds does the tree try?

<details>
<summary>Answers</summary>

1. The cuts at 0.5 and 12.5 put every customer on one side: nothing changes, so nothing is gained.
2. Impurity is a dome-shaped (concave) curve, so the weighted average of the children's impurities can never be above the parent's.
3. One: 0.5.
</details>

<div class="keypoints">

- Gain = impurity before − weighted impurity after; with entropy it is called information gain.
- Weighting by child size stops a tiny pure group from winning.
- The tree tries the midpoints between neighbouring sorted values in every column and keeps the best.
- Columns with many distinct values (IDs, timestamps) can win by luck: drop them.

</div>

**Try it on your own data:** the [[small-model-trainer]] shows the question chosen at each node of a tree grown from your CSV.

**New words:** *information gain*, *Gini gain*, *weighted impurity*, *threshold*, *greedy search*, *mutual information*.
