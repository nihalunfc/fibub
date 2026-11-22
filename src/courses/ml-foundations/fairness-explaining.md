---
title: Fairness and explaining predictions
seoTitle: 'Fairness in machine learning and explaining predictions'
summary: 'A model can be accurate overall and still treat groups differently, because of the data it learned from or how its threshold is set. Move two groups'' thresholds, meet the main fairness measures, and learn to explain one prediction.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'Hardt, Price and Srebro (2016), Equality of opportunity in supervised learning, NeurIPS 29 https://arxiv.org/abs/1610.02413'
  - 'Chouldechova (2017), Fair prediction with disparate impact: a study of bias in recidivism prediction instruments, Big Data 5(2), 153-163 https://doi.org/10.1089/big.2016.0047'
  - 'Kleinberg, Mullainathan and Raghavan (2016), Inherent trade-offs in the fair determination of risk scores https://arxiv.org/abs/1609.05807'
  - 'Lundberg and Lee (2017), A unified approach to interpreting model predictions, NeurIPS 30 https://arxiv.org/abs/1705.07874'
---

**Module 7 · about 25 minutes · read first: 4.5, 6.4.** You'll be able to check a model's errors group by group, name three fairness measures and the trade-off between them, and explain a single prediction.

<div class="bigidea">One overall accuracy can hide a model that is much worse for some people, so check its mistakes group by group, and be able to say why it decided what it did.</div>

## 1. Why this matters

Models now help decide who gets a loan, a job interview, extra medical care or a police visit. A model trained on past decisions learns the past, including its unfairness. And a single number like "92 % accurate" can hide that it is much worse for one group. Rules in the EU, the UK, Quebec and some US states and cities increasingly require that automated decisions can be checked and explained. This is part of the job, not an extra.

## 2. Where unfairness comes from

- **Biased labels:** if past hiring favoured one group, "was hired" is a biased target. The model copies the old habit faithfully.
- **Unequal data:** less or noisier data about a group makes the model less accurate for it, like a doctor who has only ever seen a disease in adults trying to spot it in children.
- **Proxies:** a proxy is a stand-in. Dropping a sensitive column doesn't help if postcode, name or hobbies carry the same information.
- **One threshold for groups that differ:** the same cut-off can mean different error rates for different groups.

Try it: slide the share of positives down to 1% while watching the two curves and the counts.

<figure class="fig" data-fig="@ai-pr-curve"><figcaption>The ROC curve does not move when positives become rare, but the precision-recall curve collapses: a small false-positive rate applied to a huge pile of negatives swamps the few true positives. For rare events, read precision.</figcaption></figure>

## 3. Measuring it

Compute the confusion matrix (Lesson 4.5) separately for each group, then compare:

- **Demographic parity:** the same share of each group gets a "yes".
- **Equal opportunity:** among people who truly qualify, the same share of each group gets a "yes". In other words, equal true positive rates.
- **Equalised odds:** equal true positive rates **and** equal false positive rates.
- **Calibration:** a score of 0.7 means a 70 % chance in every group.

<!--fig:fairness-->

<div class="problem" data-problem="fairness-tpr-gap"></div>

When groups differ in their base rates (how common the outcome is) or in how well the model knows them, these measures **cannot all be equal at once** (Kleinberg, Mullainathan and Raghavan, 2016; Chouldechova, 2017). Choosing which one matters is a decision about values. It belongs to the people responsible for the system, made openly. The data scientist's job is to measure all of them and show the trade-offs.

<div class="myth">

**"We removed the sensitive column, so the model is fair."** Other columns can stand in for it: postcode for ethnicity, career gaps for gender. And even with no proxy at all, a model can simply be less accurate for a group it has seen less data about. Fairness is checked on the model's **outputs**, group by group, not by what columns went in.

</div>

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

## 4. Explaining a prediction

People affected by a decision deserve a reason. Two common kinds of tool:

- **Global** (the whole model): feature importance (Lesson 6.4) and partial dependence plots show what the model relies on overall.
- **Local** (one decision): **SHAP values** split one prediction into a contribution from each column. Start from the average prediction; each column adds or subtracts something; the contributions add up exactly to this case's prediction.

### Watch it happen: explaining one loan decision

<div class="steps">
<div class="step"><p><b>Start from average.</b> Across all applicants, the model's average score is 0.62. Approval needs 0.50.</p></div>
<div class="step"><p><b>Debt-to-income ratio: −0.20.</b> This applicant's debts are high for their income, which pulls the score down to 0.42.</p></div>
<div class="step"><p><b>Recent missed payment: −0.08.</b> Down to 0.34.</p></div>
<div class="step"><p><b>Short credit history: −0.03, steady income: +0.05.</b> Down to 0.31, then up to 0.36.</p></div>
<div class="step"><p><b>The reason.</b> 0.62 − 0.20 − 0.08 − 0.03 + 0.05 = 0.36, below 0.50. The honest explanation: "mainly your debt-to-income ratio, then a recent missed payment."</p></div>
</div>

For a linear model this is easy: each column contributes its weight times (its value minus the average value). For trees and forests, SHAP computes the fair share by averaging over the orders in which columns could be added. That idea comes from game theory and is called the Shapley value.

<div class="problem" data-problem="fairness-shap-linear"></div>

<div class="meaning">

<dl>
<dt>ŷ (y-hat)</dt><dd>the model's decision: 1 for yes, 0 for no</dd>
<dt>P(ŷ = 1 | y = 1, A)</dt><dd>the true positive rate in group A: of the people in A who truly qualify, the share who get a yes</dd>
<dt>E[f]</dt><dd>the average prediction over everyone: the starting point of an explanation</dd>
<dt>φⱼ (phi)</dt><dd>how much column j pushed this one prediction up or down from that average</dd>
<dt>Physical meaning</dt><dd>Fairness asks: if you truly deserve a yes, are your chances the same whoever you are? An explanation answers: of all the things about you, which ones moved your result, and by how much? Both turn a hidden score into something a person can question.</dd>
</dl>

</div>

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

<div class="keypoints">

- Unfairness comes from biased labels, unequal data, proxies, and one threshold for groups that differ.
- Check fairness by computing error rates per group: demographic parity, equal opportunity (equal true positive rates), equalised odds, calibration.
- When groups differ, these measures cannot all be equal at once; choosing between them is an open decision about values.
- SHAP values explain one prediction: contributions from each column that add up from the average prediction to this case.

</div>
