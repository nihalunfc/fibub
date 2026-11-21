---
title: 'Information gain: choosing the best split'
seoTitle: 'Information gain and Gini gain: how trees choose splits'
summary: 'A tree tries every column and every cut, and keeps the one that lowers impurity the most. Slide a cut along twelve customers, watch the gain change, and work a split out by hand.'
minutes: 25
updated: 2026-11-21
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
---

**Module 5 · about 25 minutes · read first: 5.2.** You'll be able to compute the gain of a split, find the best threshold for a column by hand, and explain why trees prefer some columns.

## 1. Why this matters

This is the step that builds every tree, and so every random forest and boosting model: thousands of times per model, the algorithm searches for the split with the largest gain. Knowing it explains why trees love columns with many distinct values, why they are fast, and where feature importance (Lesson 6.4) comes from.

## 2. The gain of a split

A split sends the `$n$` rows of a parent box into a left child (`$n_L$` rows) and a right child (`$n_R$` rows). The **gain** is how much impurity it removes:

```math
\text{gain} = I(\text{parent}) - \frac{n_L}{n} I(\text{left}) - \frac{n_R}{n} I(\text{right})
```

where `$I$` is Gini impurity or entropy. With entropy, this is called **information gain**; with Gini, often **Gini gain** or "decrease in impurity". The weights stop a tiny child from winning: splitting off a single row makes that row pure, but it barely changes the big mixed group, so the weighted average hardly drops.

## 3. Searching for the best split

For each column:

1. Sort the rows by that column.
2. Try a threshold halfway between each pair of neighbouring different values.
3. Compute the gain of each.

Keep the best (column, threshold) pair over all columns. With running counts of each class as you move along the sorted list, every threshold costs only a few sums, so this is fast even for millions of rows.

<!--fig:split-search-->

## 4. Stopping

Splitting stops in a box when:

- it is pure (no gain is possible), or
- no split has a gain above a small minimum, or
- a limit is hit: maximum depth, or fewest rows allowed in a leaf (Lesson 5.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** greedy search: at each box, take the split with the largest weighted drop in impurity.

**Information gain** with entropy `$H$` is the mutual information between the split and the class: how many bits of uncertainty about the class the answer to the question removes,

```math
IG = H(Y) - H(Y \mid \text{answer})
```

**A bias to know:** a column with many distinct values (a customer ID, a timestamp) offers many thresholds, so by chance one of them often looks good on training data. Trees can latch on to such columns; drop IDs before training, and see Lesson 6.4.

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

The cut at 6.5 wins, though neither child is pure: two fairly clean halves beat one pure sliver and a messy rest.

## 6. Practice

1. In the simulation, find a cut whose gain is 0. Why is it zero?
2. Why is the gain of a split never negative?
3. A column takes only the values 0 and 1. How many thresholds does the tree try?

<details>
<summary>Answers</summary>

1. The cuts at 0.5 and 12.5 put every customer on one side: nothing changes, so nothing is gained.
2. Impurity is a concave (dome-shaped) curve, so the weighted average of the children's impurities can never be above the parent's (a property of concave functions).
3. One: 0.5.
</details>

**Try it on your own data:** the [[small-model-trainer]] shows the question chosen at each node of a tree grown from your CSV.

**New words:** *information gain*, *Gini gain*, *weighted impurity*, *threshold*, *greedy search*, *mutual information*.
