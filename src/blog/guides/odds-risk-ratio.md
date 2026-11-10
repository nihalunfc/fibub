---
title: "Odds ratio vs risk ratio: read a 2 × 2 table and adjust for confounding"
summary: "How odds ratios and risk ratios are worked out from a 2 × 2 table, which one your study design allows, what the intervals and tests mean, and how Mantel-Haenszel pooling removes a confounder."
tools: [odds-risk-ratio, nnt-calculator, diagnostic-test-calculator, sample-size, meta-analysis]
updated: 2026-11-10
sources:
  - "Standard epidemiology methods: Woolf (1955) log interval for the odds ratio, Katz et al. (1978) for the risk ratio, Fisher's exact test, Mantel and Haenszel (1959) pooling, Breslow and Day (1980) homogeneity test. Explained in fibub's own words."
  - "The worked example numbers are made up for teaching and describe no real study."
---

Did exposed people fall ill more often than unexposed ones? The [[odds-risk-ratio]] calculator answers that from a 2 × 2 table of counts: odds ratio, risk ratio when the design allows it, intervals, tests, and a pooled answer across groups such as age bands. It is for public health students and anyone checking a published table; general education, not medical advice. Plan how many people a study needs with the [[sample-size]] tool before you collect data, and turn a risk difference into a number needed to treat with the [[nnt-calculator]].

## What it is

Every study of this kind can be squeezed into four counts:

- **a**: exposed people who got the outcome
- **b**: exposed people who did not
- **c**: unexposed people who got the outcome
- **d**: unexposed people who did not

**Risk** is the share of a group that gets the outcome. The risk if exposed is a ÷ (a + b), and the risk if unexposed is c ÷ (c + d). The **risk ratio** (RR) divides one by the other. An RR of 2 means the exposed group had twice the risk.

**Odds** compare those who got the outcome with those who did not: a ÷ b for the exposed. The **odds ratio** (OR) is (a × d) ÷ (b × c).

Which one you may use depends on how people entered the study:

- In a **cohort study or trial**, groups are chosen by exposure and followed up. Risks are real, so the RR and the **risk difference** (risk if exposed minus risk if unexposed) make sense.
- In a **case-control study**, people are chosen because they have the outcome (cases) or not (controls). The researcher set the number of cases, so only the OR is valid.

When the outcome is rare, the OR and RR are close.

A **confidence interval** is the range of values the data agree with. If a 95 % interval for a ratio includes 1, the data fit "no difference" too.

A **confounder** is a third factor linked to both the exposure and the outcome. Splitting the data into **strata** (layers, one per level of the confounder) and pooling them by the **Mantel-Haenszel** method gives a ratio adjusted for it.

## How to use it

1. Choose **One table** or **Strata (Mantel-Haenszel)** at the top.
2. Set **Study design** to *Case-control* or *Cohort or trial*. The column headings change to match (Cases and Controls, or Ill and Well).
3. Pick the **Confidence** level: 90 %, 95 % or 99 %.
4. For one table, type the four counts into the grid. For strata, paste one row per stratum (a name, then exposed cases, exposed non-cases, unexposed cases, unexposed non-cases) or open a CSV or Excel file. Tick the continuity correction box if you want a more cautious Mantel-Haenszel test.
5. Read the ratios and tests. With strata you also get the crude value, the Breslow-Day test and a forest plot, which you can save with **Forest plot (PNG)** beside **Results (CSV)**.

## A worked example

A made-up cohort follows 300 adults for one year. 150 live beside a busy road (exposed) and 150 do not. The outcome is a new wheeze.

| | Wheeze | No wheeze | Total |
|---|---|---|---|
| Near the road | 30 | 120 | 150 |
| Away from it | 15 | 135 | 150 |

**Risks:** 30 ÷ 150 = **20.0 %** if exposed, 15 ÷ 150 = **10.0 %** if not.

**Risk ratio:** 20.0 % ÷ 10.0 % = **2**, with a 95 % interval of **1.12 to 3.56**. The risk difference is **10.0 %** (2.0 % to 18.0 %).

**Odds ratio:** (30 × 135) ÷ (120 × 15) = 4,050 ÷ 1,800 = **2.25** (1.16 to 4.38), further from 1 than the RR because wheeze is common here.

**Tests:** Pearson's chi-square is **5.882** (p = 0.015). Fisher's exact test gives p = **0.023**. The smallest expected count is 22.5 people, so the plain chi-square is fine.

Now suppose 80 of the 150 exposed people smoke, against 40 of the 150 unexposed, and smoking also raises the risk of wheeze. Switch to **Strata** and paste:

```
Smokers	20	60	6	34
Non-smokers	10	60	9	101
```

They add up to the table above. Each stratum alone gives an RR of about **1.67** (smokers) and **1.75** (non-smokers). The Mantel-Haenszel RR is **1.70** (0.941 to 3.08), against the crude **2**. The crude value is **17.4 %** higher than the adjusted one, a clear sign of confounding by smoking. The Breslow-Day test (p = 0.989) finds no difference between the strata, so one pooled value is fair. After adjustment the interval includes 1, so the link is much less certain than it first looked.

## Where it is used

- **Outbreak investigations.** Compare people who ate each food with those who did not.
- **Reading papers.** Re-enter a published 2 × 2 table to check a reported ratio and interval.
- **Clinical trials.** The RR and risk difference describe how much a treatment changed an outcome. For pooling many trials, use [[meta-analysis]].
- **Workplace safety and product tests.** Compare injuries between sites, or sign-ups between two versions of a page.

## Common mistakes

- **Reporting a risk ratio from a case-control study.** The design fixes the number of cases, so only the OR is valid. Set the design first.
- **Reading an OR as a risk ratio.** "OR 2.25" is not "2.25 times the risk".
- **Swapping rows.** Exposed goes on the top row; swapping turns the ratio upside down.
- **Trusting chi-square with tiny counts.** If an expected count is below 5, use Fisher's exact or the mid-p test and the exact interval. The page warns you.
- **Pooling strata that disagree.** If Breslow-Day is significant, report each stratum instead.

## Questions people ask

**What does a ratio below 1 mean?** The exposure goes with less of the outcome. An RR of 0.5 means half the risk.

**Does a significant odds ratio prove cause?** No. Bias, chance and unmeasured confounders can all produce a link.

**Why is the exact odds ratio slightly different from ad/bc?** It is estimated in a different way that holds the table's totals fixed. In large studies the two come close together.
