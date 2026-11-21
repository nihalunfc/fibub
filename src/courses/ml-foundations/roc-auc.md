---
title: Thresholds, ROC curves and AUC
seoTitle: 'ROC curve and AUC explained, with a simulation'
summary: 'The ROC curve shows every threshold at once: true positive rate against false positive rate. The area under it, AUC, scores how well a model ranks positives above negatives. Trace the curve and change how well the groups separate.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: What does an AUC of 0.5 mean?
    choices: ['A perfect model', 'No better than random guessing', 'Half the predictions are wrong']
    ans: 1
    why: The ROC curve of random guessing is the diagonal, whose area is 0.5.
  - q: 'AUC = 0.85 means:'
    choices: ['85 % of predictions are right', 'A random positive gets a higher score than a random negative 85 % of the time', 'Precision is 85 %']
    ans: 1
    why: AUC is the probability that the model ranks a randomly chosen positive above a randomly chosen negative.
  - q: The positive class is only 0.1 % of cases. What can mislead?
    choices: ['A high AUC can hide a low precision', 'Nothing: AUC is always enough', 'Recall cannot be computed']
    ans: 0
    why: The false positive rate divides by the huge number of negatives, so it stays small even with many false alarms. Check precision (or a precision-recall curve) too.
---

**Module 4 · about 25 minutes · read first: 4.5.** You'll be able to draw an ROC curve from scores, read AUC, and pick a threshold from the curve.

## 1. Why this matters

Precision and recall change with the threshold, so one model gives many sets of scores. To compare models fairly, before anyone has chosen a threshold, we need a summary over all of them. The ROC curve and its area (AUC) are that summary, and you'll meet them in nearly every report of a medical test, credit score or fraud model.

## 2. Building the curve

For each possible threshold, compute two rates:

- **True positive rate** (TPR) = recall = TP / (TP + FN): the share of real positives caught.
- **False positive rate** (FPR) = FP / (FP + TN) = 1 − specificity: the share of real negatives wrongly flagged.

Plot TPR (up) against FPR (across). A threshold of 1 flags nothing: the point (0, 0). A threshold of 0 flags everything: (1, 1). The thresholds in between trace a curve from one corner to the other.

<!--fig:roc-curve-->

- **A perfect model** goes straight up to (0, 1), then across: every positive scores above every negative. AUC = 1.
- **Random guessing** follows the diagonal. AUC = 0.5.
- **Real models** bow towards the top-left corner. The more the groups overlap, the closer to the diagonal.

## 3. What AUC means

AUC has a neat meaning: it is the **probability that a randomly chosen positive gets a higher score than a randomly chosen negative**. So it measures how well the model **ranks**, regardless of threshold. Rough guide: 0.5 to 0.7 weak, 0.7 to 0.8 fair, 0.8 to 0.9 good, above 0.9 excellent (and above 0.99, check for leakage, Lesson 7.4).

## 4. Choosing a threshold from the curve

Every point on the curve is a threshold you could pick. Two common ways:

- **Costs:** choose the point where the total cost (missed positives × their cost + false alarms × theirs) is lowest, as in Lesson 4.5.
- **Youden's J:** with no costs known, pick the point furthest above the diagonal, where TPR − FPR is largest.

**A warning for rare classes.** When positives are very rare, FPR divides by an enormous number of negatives, so even thousands of false alarms look like a small FPR, and the ROC curve looks great. Then also look at precision, or at a **precision-recall curve**, which shows the false-alarm problem plainly.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** AUC equals the share of (positive, negative) pairs that the model orders correctly.

**Equation:** with `$n_1$` positives scored `$s_i$` and `$n_0$` negatives scored `$s_j$`,

```math
\text{AUC} = \frac{1}{n_1 n_0} \sum_{i \in \text{pos}} \sum_{j \in \text{neg}} \Big( [\, s_i > s_j \,] + \tfrac{1}{2} [\, s_i = s_j \,] \Big)
```

This is the same number as the area under the ROC curve (and the Mann-Whitney U statistic divided by `$n_1 n_0$`).

**Analogy:** a talent show judge. AUC asks: if you pick one real talent and one dud at random, how often does the judge score the talent higher? It doesn't care where the "pass" line is drawn.

**Try it:** positives scored 0.9 and 0.6; negatives scored 0.7 and 0.2. AUC? (Pairs: 0.9 > 0.7 ✓, 0.9 > 0.2 ✓, 0.6 > 0.7 ✗, 0.6 > 0.2 ✓. AUC = 3/4 = 0.75.)
</details>

## 5. Worked example

*Made-up numbers.* Six patients get risk scores; three really have the condition (P), three don't (N):

| score | 0.95 | 0.80 | 0.70 | 0.55 | 0.40 | 0.10 |
|---|---|---|---|---|---|---|
| truth | P | P | N | P | N | N |

Lower the threshold step by step, one patient at a time:

| flag scores ≥ | TP | FP | TPR | FPR |
|---|---|---|---|---|
| 1.00 | 0 | 0 | 0 | 0 |
| 0.95 | 1 | 0 | 0.33 | 0 |
| 0.80 | 2 | 0 | 0.67 | 0 |
| 0.70 | 2 | 1 | 0.67 | 0.33 |
| 0.55 | 3 | 1 | 1 | 0.33 |
| 0.40 | 3 | 2 | 1 | 0.67 |
| 0.10 | 3 | 3 | 1 | 1 |

The area under these steps: 0.67 × 0.33 (from FPR 0 to 0.33) + 1 × 0.67 (from 0.33 to 1) = 0.22 + 0.67 = **0.89**. Check by pairs: of the 9 (P, N) pairs only one is misordered (the P at 0.55 below the N at 0.70), so AUC = 8/9 ≈ 0.89. The threshold 0.55 catches every case with one false alarm, the best Youden point (TPR − FPR = 0.67).

## 6. Practice

1. Model A has AUC 0.92, model B 0.78. Which ranks better?
2. Why does AUC not depend on the threshold?
3. If you flip a model's scores (use 1 − score), what happens to its AUC?

<details>
<summary>Answers</summary>

1. A: it puts positives above negatives more often.
2. It summarises every threshold at once; it only depends on the order of the scores.
3. It becomes 1 − AUC. A model with AUC 0.2 is a good model used upside down.
</details>

**Try it on your own data:** the [[roc-curve]] tool draws the ROC curve and AUC from your own labels and scores.

**New words:** *ROC curve*, *true positive rate*, *false positive rate*, *AUC*, *Youden's J*, *precision-recall curve*.
