---
title: 'Purity: Gini impurity and entropy'
seoTitle: 'Gini impurity and entropy explained, worked by hand'
summary: 'To choose its questions a tree must measure how mixed a group is. Gini impurity and entropy both score a pure group 0 and a 50/50 mix highest. Work them out by hand and mix a box to see the two curves.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Shannon (1948), A mathematical theory of communication, Bell System Technical Journal 27(3), 379-423 https://doi.org/10.1002/j.1538-7305.1948.tb01338.x'
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Section 8.1.2 (Gini index and entropy) https://www.statlearning.com/'
  - 'scikit-learn user guide: Decision trees, mathematical formulation (classification criteria) https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation'
---

**Module 5 · about 20 minutes · read first: 1.6, 5.1.** You'll be able to compute Gini impurity and entropy for any group by hand and explain what they measure.

<div class="bigidea">Gini impurity and entropy both answer one question, "how mixed is this group?", with 0 for a pure group and the biggest number for an even mix.</div>

## 1. Why this matters

Every split in a decision tree, random forest and gradient-boosting model is chosen with one of these two numbers. They appear in the settings of every tree library (`criterion="gini"` or `"entropy"`). Entropy is also the quantity that measures information in a message and, as cross-entropy (Lesson 4.3), the loss used to train language models.

## 2. What "pure" means

A box (the group of training rows at a node) is **pure** if every row has the same class. The tree wants boxes as pure as possible, because then its leaf answers are confident and right. So it needs one number for "how mixed": 0 for pure, largest for an even mix.

With two classes, let `$p$` be the share of class 1 in the box.

- **Gini impurity:** `$1 - p^2 - (1-p)^2$`. It is the chance that two rows picked at random from the box (putting the first back before picking the second) have different classes.
- **Entropy:** `$-p \log_2 p - (1-p) \log_2 (1-p)$`, measured in **bits**. It is about how many yes/no questions, on average, you'd need to learn the class of a random row. (`$\log_2$` asks "2 to what power gives this number?": `$\log_2 8 = 3$`.)

<!--fig:impurity-curve-->

Both are 0 at `$p = 0$` and `$p = 1$`, and peak at `$p = 0.5$`: 0.5 for Gini, 1 bit for entropy. Their curves have almost the same shape, so they almost always pick the same splits.

<div class="steps">
<div class="step"><p><b>A box of 10 emails:</b> 6 spam, 4 normal. The share of spam is p = 0.6.</p></div>
<div class="step"><p><b>Square the shares.</b> 0.6² = 0.36 and 0.4² = 0.16. Together 0.52: the chance two random picks agree.</p></div>
<div class="step"><p><b>Gini.</b> 1 − 0.52 = 0.48: the chance two random picks disagree. Close to the 0.5 maximum, so this box is quite mixed.</p></div>
<div class="step"><p><b>Entropy.</b> Spam's surprise is −log₂ 0.6 = 0.737 bits, normal's −log₂ 0.4 = 1.322 bits. Average them by share: 0.6 × 0.737 + 0.4 × 1.322 = 0.971 bits.</p></div>
<div class="step"><p><b>After a good question</b> the box splits into 5 all-spam (Gini 0) and 5 with 1 spam and 4 normal (Gini 0.32). Weighted Gini: 0.16. Much tidier.</p></div>
</div>

<div class="meaning">

<dl>
<dt>p<sub>k</sub></dt><dd>The share of rows in the box that belong to class k.</dd>
<dt>Gini = 1 − Σ p<sub>k</sub>²</dt><dd>The chance that two rows drawn at random (with replacement) are of different classes.</dd>
<dt>H = −Σ p<sub>k</sub> log₂ p<sub>k</sub></dt><dd>Entropy: the average surprise, in bits, when you draw one row and look at its class.</dd>
<dt>Physical meaning</dt><dd>A bag of sweets. A bag of only red ones holds no surprise when you draw one; a half-red, half-green bag holds the most. Gini and entropy are two rulers for that surprise.</dd>
</dl>

</div>

<div class="problem" data-problem="gini-entropy-gini"></div>

## 3. More than two classes

With classes `$1, \dots, K$` at shares `$p_1, \dots, p_K$`, add up over all of them:

```math
\text{Gini} = 1 - \sum_{k=1}^{K} p_k^2, \qquad H = -\sum_{k=1}^{K} p_k \log_2 p_k
```

The maximum grows with `$K$`: an even mix of 4 classes has Gini 0.75 and entropy 2 bits.

<div class="problem" data-problem="gini-entropy-entropy"></div>

<div class="myth">

**"Entropy is better than Gini because it comes from information theory."** In practice they nearly always choose the same split, because their curves have almost the same shape. Gini is a little faster to compute (no logarithms), which is why many libraries use it by default. Pick either and spend your effort on depth and leaf size instead.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** impurity measures how uncertain we are about the class of a random row in the box. A good split lowers it.

**Why Gini is "chance of disagreeing":** pick two rows independently. Both are class `$k$` with probability `$p_k^2$`, so they agree with probability `$\sum_k p_k^2$` and disagree with probability `$1 - \sum_k p_k^2$`.

**Why entropy is "bits":** a class with share `$p_k$` is as surprising as `$-\log_2 p_k$` coin flips (share 1/8 = 3 bits). Entropy is the average surprise:

```math
H = \sum_k p_k \left(-\log_2 p_k\right)
```

**By convention** `$0 \log_2 0 = 0$`, so a class that is absent adds nothing.

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

<div class="keypoints">

- A pure box (one class only) has Gini 0 and entropy 0.
- Gini = 1 − Σ p<sub>k</sub>²: the chance two random rows disagree. Two classes peak at 0.5.
- Entropy = −Σ p<sub>k</sub> log₂ p<sub>k</sub>: the average surprise in bits. Two classes peak at 1 bit.
- The two curves have nearly the same shape, so trees built with either are almost the same.

</div>

**Try it on your own data:** the [[small-model-trainer]] grows a tree on your CSV with Gini impurity or entropy; switch between them and see how little the tree changes.

**New words:** *purity*, *Gini impurity*, *entropy*, *bit*, *surprise*.
