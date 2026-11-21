---
title: Fairness and explaining predictions
seoTitle: 'Fairness in machine learning and explaining predictions'
summary: 'A model can be accurate overall and still treat groups differently, because of the data it learned from or how its threshold is set. Move two groups'' thresholds, meet the main fairness measures, and learn to explain one prediction.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'Removing the "gender" column from a hiring model:'
    choices: ['Guarantees the model is fair', 'May not help: other columns (hobbies, past job titles) can act as stand-ins', 'Makes the model illegal']
    ans: 1
    why: Proxies carry the same information. Fairness has to be measured on the outputs, group by group.
  - q: 'Equal opportunity asks that:'
    choices: ['Each group has the same approval rate', 'Qualified people in each group are approved at the same rate (equal true positive rates)', 'Each group has the same accuracy']
    ans: 1
    why: It compares true positive rates across groups. Equal approval rates is a different measure (demographic parity).
  - q: 'A SHAP value for one prediction tells you:'
    choices: ['How much each column pushed this prediction above or below the average prediction', 'The column''s importance over the whole data', 'The probability of the class']
    ans: 0
    why: The contributions add up from the average prediction to this case's prediction.
---

**Module 7 · about 25 minutes · read first: 4.5, 6.4.** You'll be able to check a model's errors group by group, name three fairness measures and the trade-off between them, and explain a single prediction.

## 1. Why this matters

Models now help decide who gets a loan, a job interview, extra medical care or a police visit. A model trained on past decisions learns the past, including its unfairness, and a single number like "92 % accurate" can hide that it is much worse for one group. Rules in the EU, the UK, Quebec and some US states and cities increasingly require that automated decisions can be checked and explained. This is part of the job, not an extra.

## 2. Where unfairness comes from

- **Biased labels:** if past hiring favoured one group, "was hired" is a biased target.
- **Unequal data:** less or noisier data about a group makes the model less accurate for it.
- **Proxies:** dropping a sensitive column doesn't help if postcode, name or hobbies carry the same information.
- **One threshold for groups that differ:** the same cut-off can mean different error rates for different groups.

## 3. Measuring it

Compute the confusion matrix (Lesson 4.5) separately for each group, then compare:

- **Demographic parity:** the same share of each group gets a "yes".
- **Equal opportunity:** among people who truly qualify, the same share of each group gets a "yes" (equal true positive rates).
- **Equalised odds:** equal true positive rates **and** equal false positive rates.
- **Calibration:** a score of 0.7 means a 70 % chance in every group.

<!--fig:fairness-->

When groups differ in their base rates or in how well the model knows them, these measures **cannot all be equal at once** (Kleinberg, Mullainathan and Raghavan, 2016; Chouldechova, 2017). Choosing which one matters is a decision about values, for the people responsible for the system, made openly; the data scientist's job is to measure all of them and show the trade-offs.

## 4. Explaining a prediction

People affected by a decision deserve a reason. Two common tools:

- **Global:** feature importance (Lesson 6.4) and partial dependence plots show what the model relies on overall.
- **Local:** **SHAP values** split one prediction into a contribution from each column: starting from the average prediction, each column adds or subtracts something, and the contributions add up exactly to this case's prediction. "Your score is 0.31 below average: −0.20 from debt-to-income ratio, −0.08 from recent missed payment, −0.03 from short credit history."

For a linear model this is easy: each column contributes its weight times (its value minus the average value). For trees and forests, SHAP computes the fair share by averaging over orders in which columns could be added (an idea from game theory, the Shapley value).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** fairness is measured on outcomes, group by group; explanations attribute one output to its inputs.

**Equal opportunity** for groups A and B, with `$\hat{y}$` the decision and `$y$` the truth:

```math
P(\hat{y} = 1 \mid y = 1, A) = P(\hat{y} = 1 \mid y = 1, B)
```

**Additive explanation:** for a prediction `$f(\mathbf{x})$` with average prediction `$E[f]$`, SHAP gives values `$\phi_1, \dots, \phi_d$` with

```math
f(\mathbf{x}) = E[f] + \sum_{j=1}^{d} \phi_j
```

For a linear model `$f(\mathbf{x}) = b + \sum_j w_j x_j$` with independent columns, `$\phi_j = w_j (x_j - \bar{x}_j)$`.

**Analogy:** splitting a restaurant bill fairly when people joined at different times: Shapley values average each person's added cost over every order they could have arrived in.

**Try it:** a linear score `$0.5 + 0.3 x_1 - 0.2 x_2$`, with averages `$\bar{x}_1 = 1$`, `$\bar{x}_2 = 2$`. For `$x_1 = 3$`, `$x_2 = 1$`, find each column's contribution. (`$\phi_1 = 0.3 \times 2 = 0.6$`; `$\phi_2 = -0.2 \times (-1) = 0.2$`. Average score 0.5 + 0.3 − 0.4 = 0.4; this case 0.4 + 0.8 = 1.2. Check: 0.5 + 0.9 − 0.2 = 1.2.)
</details>

## 5. Worked example

*Made-up numbers.* A loan model, threshold 0.5, tested on 1,000 applicants from each of two groups; 600 in each group would repay.

| group | repayers approved (TPR) | defaulters approved (FPR) | approval rate |
|---|---|---|---|
| A | 534 of 600 = 89 % | 46 of 400 = 12 % | 58 % |
| B | 402 of 600 = 67 % | 134 of 400 = 34 % | 54 % |

Approval rates look similar (58 % against 54 %), so demographic parity is nearly met. But a qualified applicant in group B is turned down a third of the time against about one in nine for group A, and B's defaulters are approved three times as often. The model simply knows less about group B. Better data about B would help everyone; changing B's threshold can match one rate at the cost of the other. The table, not the overall accuracy, is what the decision-makers need to see.

## 6. Practice

1. In the simulation, can you find thresholds that make both the repayers' and the defaulters' approval rates equal across groups?
2. Why is "we removed the sensitive column" not enough?
3. Give one global and one local explanation method.

<details>
<summary>Answers</summary>

1. No: B's curves overlap more, so matching one rate leaves the other apart. That is the trade-off in action.
2. Other columns can act as proxies for it, and the model can still be less accurate for a group. Measure outcomes by group.
3. Global: feature importance or partial dependence. Local: SHAP values for one prediction.
</details>

**Try it on your own data:** the [[confusion-matrix]] tool computes rates from counts; run it once per group to compare true and false positive rates.

**New words:** *fairness*, *proxy*, *demographic parity*, *equal opportunity*, *equalised odds*, *calibration*, *SHAP value*, *Shapley value*.
