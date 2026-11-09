---
name: Sensory triangle and duo-trio test analyser
num: 395
shelf: science
section: food-science
title: "Triangle test calculator: exact p-value, critical values, d-prime, power and sample size for triangle, duo-trio, 2-AFC and tetrad tests"
summary: "Analyse a sensory difference test from the number of answers and correct answers: exact one-sided binomial p-value, the fewest correct needed, Thurstonian d′ and the proportion of distinguishers, power and sample size, and a table of critical values worked out for any n. Nothing is uploaded."
status: live
ads: false
order: 395
icon: check
works: offline
updated: 2026-11-09
related: [sample-size, recipe-nutrition-calculator, shelf-life-estimator, yield-trial-anova, hypothesis-tests, brine-calculator, likert-chart]
sources:
  - "Exact binomial test (general statistics). Psychometric functions for d′ in the triangle, duo-trio, 2-AFC and tetrad tests as given by Ennis (1993) and in the sensR package documentation (Christensen and Brockhoff), written out independently. Guessing model for the proportion of distinguishers (Abbott's formula)."
  - "Binomial p-values, critical values, power and sample size checked against scipy.stats.binom; psychometric functions at d′ 0.5, 1, 2 and 3 and their inverses checked against an independent Python version using scipy.integrate.quad and brentq (triangle at d′ 1 gives 0.418, the textbook value)."
  - "Critical values are computed on the page, not copied from a published table. The example panel result is made up."
flow:
  - { icon: pencil, label: "Answers" }
  - { icon: sigma, label: "p-value" }
  - { icon: target, label: "d′" }
  - { icon: table, label: "Table" }
---

## What it does

Difference tests ask a panel whether two products taste, smell or feel different, for example after a change of ingredient or supplier. Each panelist gives one answer that is right or wrong, and the question is whether more of them are right than guessing would give. This page analyses four common designs:

- **Triangle**: three samples, two the same; pick the odd one out. Chance of a correct guess 1/3.
- **Duo-trio**: a reference, then two samples; pick the one that matches it. Chance 1/2.
- **2-AFC** (paired comparison): two samples; pick the one with more of a named attribute (for example sweeter). Chance 1/2.
- **Tetrad** (unspecified): four samples, two of each; sort them into two pairs. Chance 1/3.

For your result it gives:

- The **exact one-sided p-value**: the chance of at least this many correct answers if everyone were guessing, from the binomial distribution.
- The **fewest correct answers** needed for significance at your α.
- The **proportion of distinguishers**, (proportion correct − chance) ÷ (1 − chance), the simple guessing model.
- **d′** (d-prime), the Thurstonian size of the difference. The same products give different proportions correct in different tests, but the same d′, so d′ compares tests fairly.
- **Power and sample size** for a difference you want to be able to find, given as distinguishers or as d′.
- A **table of critical values** for any range of n, worked out exactly on the page.

Plan how many tasters you need with the [[sample-size|sample size calculator]], and the label of the recipe with the [[recipe-nutrition-calculator]].

## Worked example

Press **Use the example**: a made-up triangle test with 36 answers, 18 correct, at α = 0.05. The page shows **Significant: 18 of 36 correct, p = 0.0283**. 18 is exactly the fewest needed with 36 answers. The proportion correct is 50.0 %, the proportion of distinguishers 25.0 ± 12.5 %, and d′ = 1.47 ± 0.44.

For power, a true difference of 30 % distinguishers means a 53.3 % chance of a correct answer (d′ 1.64). With 36 answers the power is 71.6 %; **40 answers** give 80 % power. In the table, a triangle test with 24 answers needs 13 correct at α 0.05.

## Tips

- A result that is not significant does not prove the products are the same. If you want to show similarity, plan the sample size for a small difference with high power.
- Use one answer per panelist, or treat replicates with care: repeated answers from the same person are not independent.
- 2-AFC and tetrad usually need fewer panelists than the triangle for the same d′.

## FAQ

**Why one-sided?** A difference test only asks whether people do better than guessing, never worse.

**Why does power go down sometimes when n goes up?** Answers are whole numbers, so the cut-off jumps in steps. The page reports the smallest n that reaches your power.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
