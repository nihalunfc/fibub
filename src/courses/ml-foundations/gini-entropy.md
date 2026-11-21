---
title: 'Purity: Gini impurity and entropy'
seoTitle: 'Gini impurity and entropy explained, worked by hand'
summary: 'To choose its questions a tree must measure how mixed a group is. Gini impurity and entropy both score a pure group 0 and a 50/50 mix highest. Work them out by hand and mix a box to see the two curves.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: A box holds 10 items, all of one class. Its Gini impurity is
    choices: ['0', '0.5', '1']
    ans: 0
    why: 'p = 1, so 1 − 1² − 0² = 0. A pure box has no impurity.'
  - q: 'The Gini impurity of a 50/50 two-class box is:'
    choices: ['0.25', '0.5', '1']
    ans: 1
    why: '1 − 0.5² − 0.5² = 1 − 0.25 − 0.25 = 0.5, the largest possible with two classes.'
  - q: 'Entropy of a 50/50 two-class box, in bits, is:'
    choices: ['0.5', '1', '2']
    ans: 1
    why: '−(0.5 log₂ 0.5 + 0.5 log₂ 0.5) = 1 bit: one fair coin flip of uncertainty.'
---

**Module 5 · about 20 minutes · read first: 1.6, 5.1.** You'll be able to compute Gini impurity and entropy for any group by hand and explain what they measure.

## 1. Why this matters

Every split in a decision tree, random forest and gradient-boosting model is chosen with one of these two numbers. They appear in the settings of every tree library (`criterion="gini"` or `"entropy"`), and entropy is the same quantity that measures information in a message and, as cross-entropy (Lesson 4.3), the loss used to train language models.

## 2. What "pure" means

A box (a group of training rows at a node) is **pure** if every row has the same class. The tree wants boxes as pure as possible, because then its leaf answers are confident and right. So it needs one number for "how mixed": 0 for pure, largest for an even mix.

With two classes, let `$p$` be the share of class 1 in the box.

- **Gini impurity:** `$1 - p^2 - (1-p)^2$`. It is the chance that two rows picked at random (with replacement) from the box have different classes.
- **Entropy:** `$-p \log_2 p - (1-p) \log_2 (1-p)$`, in bits. It is how many yes/no questions, on average, you would need to learn a random row's class.

<!--fig:impurity-curve-->

Both are 0 at `$p = 0$` and `$p = 1$`, and peak at `$p = 0.5$`: 0.5 for Gini, 1 bit for entropy. Their curves have almost the same shape, so they almost always pick the same splits.

## 3. More than two classes

With classes `$1, \dots, K$` at shares `$p_1, \dots, p_K$`, sum over all of them:

```math
\text{Gini} = 1 - \sum_{k=1}^{K} p_k^2, \qquad H = -\sum_{k=1}^{K} p_k \log_2 p_k
```

The maximum grows with `$K$`: an even mix of 4 classes has Gini 0.75 and entropy 2 bits.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** impurity measures how uncertain we are about the class of a random row in the box. A good split lowers it.

**Why Gini is "chance of disagreeing":** pick two rows independently. Both are class `$k$` with probability `$p_k^2$`, so they agree with probability `$\sum_k p_k^2$` and disagree with probability `$1 - \sum_k p_k^2$`.

**Why entropy is "bits":** a class with share `$p_k$` is as surprising as `$-\log_2 p_k$` coin flips (share 1/8 = 3 bits). Entropy is the average surprise:

```math
H = \sum_k p_k \left(-\log_2 p_k\right)
```

**By convention** `$0 \log_2 0 = 0$`, so a class that is absent adds nothing.

**Analogy:** a bag of sweets. A bag of only red ones holds no surprise when you draw; a half-red, half-green bag holds the most.

**Try it:** a box has 8 squares and 2 circles. Gini? Entropy? (`$p = 0.8$`. Gini = 1 − 0.64 − 0.04 = 0.32. Entropy = −0.8 log₂ 0.8 − 0.2 log₂ 0.2 = 0.258 + 0.464 = 0.722 bits.)
</details>

## 4. Worked example

*Made-up numbers.* A node holds 10 emails, 6 spam and 4 normal, so `$p = 0.6$`.

- Gini = 1 − 0.6² − 0.4² = 1 − 0.36 − 0.16 = **0.48**.
- Entropy = −0.6 log₂ 0.6 − 0.4 log₂ 0.4 = 0.6 × 0.737 + 0.4 × 1.322 = 0.442 + 0.529 = **0.971** bits.

Now a question splits them into a left box of 5 (all spam) and a right box of 5 (1 spam, 4 normal):

- Left: pure, Gini 0, entropy 0.
- Right: `$p = 0.2$`, Gini = 1 − 0.04 − 0.64 = 0.32, entropy = 0.722.

Each box holds half the rows, so the weighted impurity after the split is 0.5 × 0 + 0.5 × 0.32 = **0.16** (Gini), or 0.5 × 0 + 0.5 × 0.722 = **0.361** (entropy). The split cut Gini from 0.48 to 0.16. Lesson 5.3 turns that drop into the rule for choosing splits.

## 5. Practice

1. Gini impurity of a box with 3 squares and 1 circle?
2. Which is more mixed: a 70/30 box or a 40/60 box?
3. A box has three classes in equal shares. Find its Gini impurity.

<details>
<summary>Answers</summary>

1. `$p = 0.75$`: 1 − 0.5625 − 0.0625 = 0.375.
2. 40/60, because it is closer to 50/50 (Gini 0.48 against 0.42).
3. 1 − 3 × (1/3)² = 1 − 1/3 ≈ 0.667.
</details>

**Try it on your own data:** the [[small-model-trainer]] grows a tree on your CSV with Gini impurity or entropy; switch between them and see how little the tree changes.

**New words:** *purity*, *Gini impurity*, *entropy*, *bit*, *surprise*.
