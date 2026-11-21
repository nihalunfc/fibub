---
title: 'Accuracy is not enough: precision, recall and F1'
seoTitle: 'Confusion matrix, precision, recall and F1 explained'
summary: 'When one class is rare, accuracy lies. The confusion matrix counts the four kinds of right and wrong answers, and precision, recall and F1 sum them up. Move the threshold on a screening test and watch the trade-off.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: '1,000 emails, 10 are spam. A filter marks nothing as spam. Its accuracy is:'
    choices: ['1 %', '99 %', '0 %']
    ans: 1
    why: It is right on the 990 normal emails. 99 % accuracy, and completely useless. That is why accuracy is not enough.
  - q: 'TP = 30, FP = 10, FN = 20. Precision and recall are:'
    choices: ['Precision 75 %, recall 60 %', 'Precision 60 %, recall 75 %', 'Both 50 %']
    ans: 0
    why: Precision = 30/(30+10) = 0.75. Recall = 30/(30+20) = 0.60.
  - q: For a cancer screening test, which matters most?
    choices: ['Precision: never flag a healthy person', 'Recall: miss as few real cases as possible', 'Accuracy']
    ans: 1
    why: Missing a real case is the costly mistake; a false alarm leads to a second, more careful test.
---

**Module 4 · about 25 minutes · read first: 4.1.** You'll be able to fill in a confusion matrix, compute accuracy, precision, recall, specificity and F1, and choose the right one for a job.

## 1. Why this matters

Most interesting classification problems are **imbalanced**: fraud, disease, machine failure and spam are all rare. A model that always says "no" is highly accurate and worthless. Every serious report of a classifier gives the confusion matrix or the scores built from it, and choosing the wrong score is one of the commonest mistakes in data work.

## 2. The confusion matrix

Compare each prediction with the truth. There are four outcomes:

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** | **True positive** (TP): caught | **False negative** (FN): missed |
| **Actually negative** | **False positive** (FP): false alarm | **True negative** (TN): correctly left alone |

A false positive is also called a **type I error**, a false negative a **type II error**.

<!--fig:threshold-->

## 3. The scores

| Score | Formula | Question it answers |
|---|---|---|
| **Accuracy** | (TP + TN) / all | What share of all answers are right? |
| **Precision** | TP / (TP + FP) | When it says "positive", how often is it right? |
| **Recall** (sensitivity, true positive rate) | TP / (TP + FN) | Of the real positives, what share does it catch? |
| **Specificity** (true negative rate) | TN / (TN + FP) | Of the real negatives, what share does it leave alone? |
| **F1** | 2 × precision × recall / (precision + recall) | One number balancing precision and recall |

Precision and recall pull against each other through the threshold. Lower the threshold: you flag more, catch more real cases (recall up), and raise more false alarms (precision down). Raise it: the reverse.

**Which to use?**

- False alarms are costly (spam filter hiding real mail, a fraud block on a good customer): **precision**.
- Misses are costly (disease screening, safety faults): **recall**.
- Both matter and the positive class is rare: **F1**, or better, look at precision and recall together.
- Classes balanced and both errors cost the same: accuracy is fine.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each score is a ratio of confusion-matrix counts, chosen to answer one question.

**F1** is the **harmonic mean** of precision `$P$` and recall `$R$`:

```math
F_1 = \frac{2}{\frac{1}{P} + \frac{1}{R}} = \frac{2PR}{P + R}
```

The harmonic mean is dragged down by the smaller value, so F1 is high only when **both** are high. Precision 1.0 with recall 0.02 has an ordinary average of 0.51 but an F1 of only 0.04.

**Base rates matter:** with a disease affecting 1 in 100 people, a test with 90 % recall and 95 % specificity flags 0.9 true cases and 4.95 false ones per 100 people tested. Its precision is only `$0.9 / (0.9 + 4.95) \approx 15\%$`: most positives are false alarms, even from a good test.

**Analogy:** a fishing net. Recall is the share of the fish in the lake you catch; precision is the share of your catch that is fish rather than boots and weed.

**Try it:** TP = 40, FP = 10, FN = 40, TN = 910. Find accuracy, precision, recall and F1. (Accuracy 950/1000 = 95 %; precision 40/50 = 0.8; recall 40/80 = 0.5; F1 = 2(0.8)(0.5)/1.3 ≈ 0.62.)
</details>

## 4. Worked example

*Made-up numbers.* A factory model predicts which of 2,000 parts are faulty; 50 really are.

| Threshold | TP | FP | FN | TN | Precision | Recall | F1 |
|---|---|---|---|---|---|---|---|
| 0.8 | 20 | 2 | 30 | 1,948 | 0.91 | 0.40 | 0.56 |
| 0.5 | 35 | 15 | 15 | 1,935 | 0.70 | 0.70 | 0.70 |
| 0.2 | 46 | 120 | 4 | 1,830 | 0.28 | 0.92 | 0.43 |

All three have accuracy between 94 % and 99 %, so accuracy can't choose. A faulty part reaching a customer costs $500; inspecting a part by hand costs $5. Cost at 0.8: 30 × 500 + 22 × 5 = $15,110. At 0.5: 15 × 500 + 50 × 5 = $7,750. At 0.2: 4 × 500 + 166 × 5 = **$2,830**. The cheapest choice is the low threshold, the one with the worst F1. Let the real costs decide.

## 5. Practice

1. A model has precision 0.9 and recall 0.3. In words, what does it do?
2. Compute F1 for precision 0.6 and recall 0.6.
3. Why is accuracy misleading for fraud detection?

<details>
<summary>Answers</summary>

1. When it flags something it is nearly always right, but it misses most real cases. It is too cautious.
2. 0.6 (when P = R, F1 equals them).
3. Fraud is rare, so predicting "no fraud" for everything scores very high accuracy while catching nothing.
</details>

**Try it on your own data:** paste your counts or your labels and scores into the [[confusion-matrix]] tool to get every score at once.

**New words:** *confusion matrix*, *true and false positives and negatives*, *precision*, *recall* or *sensitivity*, *specificity*, *F1*, *imbalanced classes*, *base rate*.
