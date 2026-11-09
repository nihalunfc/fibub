---
name: Diagnostic test calculator
num: 461
shelf: science
section: epidemiology
title: "Sensitivity, specificity, PPV, NPV and likelihood ratio calculator with Fagan nomogram"
summary: "Sensitivity, specificity, predictive values, likelihood ratios and accuracy from a 2 × 2 table, with exact or Wilson 95 % intervals. Turn a pre-test probability into a post-test probability and see it on a Fagan nomogram."
status: live
ads: false
order: 1
icon: target
works: offline
updated: 2026-11-09
related: [sample-size, reliability-analysis, uncertainty-calculator, method-validation]
sources:
  - "Formulas: Altman and Bland (1994, BMJ 308:1552 and 309:102) for sensitivity, specificity and predictive values; Clopper and Pearson (1934, Biometrika); Wilson (1927, J Am Stat Assoc); Simel, Samsa and Matchar (1991, J Clin Epidemiol 44:763) for likelihood ratio intervals; Glas et al. (2003, J Clin Epidemiol 56:1129) for the diagnostic odds ratio; Youden (1950, Cancer); Fagan (1975, N Engl J Med 293:257) for the nomogram."
  - "Example numbers are made up for teaching."
flow:
  - { icon: table, label: "2×2 table" }
  - { icon: sigma, label: "Accuracy" }
  - { icon: chart, label: "Nomogram" }
---

## What it does

A new test is compared with a reference standard, the best available way of knowing who really has the condition. The results fall into four boxes: true positives, false positives, false negatives and true negatives. This calculator turns those four counts into the numbers every diagnostic accuracy study reports, each with a confidence interval:

- **Sensitivity:** of the people who have the condition, the share the test picks up.
- **Specificity:** of the people who do not, the share the test correctly clears.
- **Positive and negative predictive values (PPV, NPV):** of the people with a positive (or negative) result, the share who really do (or do not) have the condition.
- **Likelihood ratios (LR+ and LR−):** how much a positive or negative result changes the odds of the condition.
- **Accuracy, prevalence in the sample, diagnostic odds ratio and Youden's index.**

It then uses Bayes' theorem to turn a **pre-test probability** into the **post-test probability** after a positive or a negative result, and draws the answer on **Fagan's nomogram**.

For study and teaching, not medical advice. Check with a qualified professional.

To choose the cut-off behind the test, draw a [[roc-curve|ROC curve]]; to turn a treatment effect into a number needed to treat, use the [[nnt-calculator]].

## How to use it

1. Choose **2 × 2 table** and type the four counts, or choose **Sensitivity and specificity** to start from published figures and a prevalence.
2. Pick the **interval method**. *Exact (Clopper-Pearson)* intervals come from the binomial distribution and never cover less than the stated level, so they suit small counts. *Wilson score* intervals are a little narrower and are close to the stated level on average. Likelihood ratios and the diagnostic odds ratio always use the log method.
3. Pick the **confidence level**: 90, 95 or 99 %.
4. Under **Pre-test to post-test probability**, type how likely the condition is before testing in your setting. Leave it blank to use the prevalence.
5. Download the table as CSV, the nomogram as PNG, or a full report as an image, PDF or Word file.

## The formulas

With true positives a, false positives b, false negatives c and true negatives d: sensitivity = a/(a + c), specificity = d/(b + d), PPV = a/(a + b), NPV = d/(c + d), accuracy = (a + d)/n. LR+ = sensitivity/(1 − specificity) and LR− = (1 − sensitivity)/specificity, with limits exp(ln LR ± z·SE), where SE(ln LR+) = √(1/a − 1/(a + c) + 1/b − 1/(b + d)) (Simel and colleagues, 1991). The diagnostic odds ratio is ad/bc with Woolf's log interval. Post-test odds = pre-test odds × LR. On Fagan's nomogram the pre-test scale sits at −logit(p), the likelihood ratio at ln(LR)/2 and the post-test scale at logit(p), so the three points line up.

## Worked example

The made-up example has 84 true positives, 30 false positives, 16 false negatives and 270 true negatives (400 people, 100 with the condition). The page shows sensitivity 84.0 % (exact 95 % interval 75.3 % to 90.6 %), specificity 90.0 % (86.0 % to 93.2 %), PPV 73.7 %, NPV 94.4 %, LR+ 8.4 (5.92 to 11.9) and LR− 0.178. With the sample's prevalence of 25 % as the pre-test probability, a positive result raises the probability to 73.7 % and a negative result lowers it to 5.6 %.

Switch to **Sensitivity and specificity** with 90 %, 95 % and a prevalence of 1 %: out of 1000 people, 9 true positives and 49.5 false positives are expected, so the PPV is only 15.4 % even though the test is good.

## Tips

- Sensitivity and specificity belong to the test (in a given population); predictive values change with prevalence. Do not carry a PPV from a hospital study to a screening programme.
- A likelihood ratio above 10 or below 0.1 changes the probability a lot; one between 0.5 and 2 hardly changes it.
- Report the intervals. A sensitivity of 100 % from 12 cases has a lower exact limit of 73.5 %.

## Frequently asked questions

**Which interval should I report?** Many journals accept either; the STARD guideline asks only that you say which. Exact intervals are the cautious choice for small studies.

**Why is a likelihood ratio shown as ∞ or without an interval?** A box with zero makes a ratio 0 or infinite, and its log interval does not exist. Some authors add 0.5 to every box; this tool shows the plain result instead.

**Is my data stored?** No. Everything is worked out in your browser and nothing is sent anywhere.
