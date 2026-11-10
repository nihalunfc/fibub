---
title: "Six Sigma metrics for 17 biochemistry tests: CLIA 2024 vs CLIA 1988 limits"
summary: "A 2025 lab study found that the stricter CLIA 2024 error limits pushed far more routine chemistry tests below 3 sigma. Here is how to work out sigma and run Westgard rules on your own QC data."
tools: [westgard-qc, lab-unit-converter]
updated: 2026-11-10
sources:
  - "Üge M, Aksun S (2025), Six SIGMA-based quality assessment of biochemical analytes: A comparative analysis of clinical laboratory improvement amendments 1988 and 2024 standards, Journal of Medical Biochemistry 44(8): 1779-1787. Open access under the Creative Commons Attribution 4.0 licence, as stated on the PMC article page, checked 2026-11-10."
  - "Westgard JO, Barry PL, Hunt MR, Groth T (1981), A multi-rule Shewhart chart for quality control in clinical chemistry, Clin Chem 27: 493-501."
  - "CLIA proficiency testing acceptance limits: US Code of Federal Regulations, 42 CFR Part 493 (check the official source for current values)."
paper:
  title: "Six SIGMA-based quality assessment of biochemical analytes: A comparative analysis of clinical laboratory improvement amendments 1988 and 2024 standards"
  authors: "Üge M, Aksun S"
  journal: "Journal of Medical Biochemistry"
  year: 2025
  doi: "10.5937/jomb0-58564"
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12967164"
  licence: "CC BY 4.0"
  reviewed: true
---

How good is a lab test? One popular answer is its sigma metric: how many standard deviations of everyday scatter fit inside the error a test is allowed to make. A 2025 study in the *Journal of Medical Biochemistry* worked out sigma for 17 routine chemistry tests twice, once with the old US CLIA 1988 error limits and once with the stricter CLIA 2024 limits. With the new limits, the number of results below 3 sigma (usually called poor) almost tripled. The [[westgard-qc]] tool does both halves of this job on your own control data: it checks runs against the Westgard rules and works out the sigma metric. The [[lab-unit-converter]] helps when your controls and your quality goals use different units.

## What they found

The lab measured each test at two control levels, giving 34 sigma values in all. With the 1988 limits, 14 of the 34 reached 6 sigma or more ("world class") and 5 fell below 3. With the 2024 limits, only 10 reached 6 sigma and 14 fell below 3.

Some tests held up whatever the rule: amylase, HDL cholesterol, creatine kinase (CK) and lactate dehydrogenase (LDH) stayed at 6 sigma or more at both levels. Others dropped sharply, including ALT, glucose, creatinine, triglycerides and AST, while albumin, already weak under the old limits, fell further. The authors traced the main problem for AST, ALT, GGT, albumin and total cholesterol to bias (results sitting off target), and for glucose, calcium and creatinine to imprecision (too much scatter).

## Why it matters

The sigma value decides how hard a lab must work to catch errors. A 6-sigma test can run with one simple rule and two controls. A test near 3 sigma needs several rules, more control runs and a closer look at the method. When the regulator tightens the allowed error, a test that was comfortable can become marginal overnight, even though nothing in the lab changed. The study is a reminder to recalculate sigma whenever the quality goal changes.

## How they did it

The work ran in a public health laboratory in Türkiye from November 2024 to March 2025, on one chemistry analyser with one brand of reagents. Imprecision (CV, the standard deviation as a percentage of the mean) came from five months of daily internal quality control at two levels. Bias came from monthly external quality assessment, comparing the lab with peer labs using the same method.

Sigma was worked out as (TEa − bias) ÷ CV, where TEa is the total allowable error. For tests under 5 sigma they also worked out the quality goal index, bias ÷ (1.5 × CV), which points to bias when it is above about 1.2 and to imprecision when it is below about 0.8. They then suggested Westgard rule sets for each sigma band, from a single 1-3s rule at 6 sigma or more to a five-rule set (1-3s, 2-2s, R-4s, 4-1s, 8x) between 3 and 4 sigma.

## Check it yourself with fibub

The control results below are **our own invented glucose values** in mmol/L, two levels over 20 runs, with a small upward shift from run 16. They are not the paper's data.

```
Run	Level 1	Level 2
1	5.52	16.1
2	5.47	15.8
3	5.58	16.3
4	5.44	15.9
5	5.55	16.0
6	5.61	16.4
7	5.49	15.7
8	5.53	16.2
9	5.40	15.9
10	5.57	16.1
11	5.50	16.0
12	5.46	15.8
13	5.59	16.3
14	5.54	16.1
15	5.48	15.9
16	5.63	16.2
17	5.66	16.5
18	5.62	16.4
19	5.65	16.6
20	5.60	16.3
```

1. Open the Westgard QC tool and paste the table. Keep the unit as mmol/L and *Target mean and SD* on *Typed below*.
2. Type target means `5.50, 16.00` and target SDs `0.07, 0.25`.
3. Keep the classic rule set (1-2s, 1-3s, 2-2s, R-4s, 4-1s, 10x). Runs 1 to 16 pass. Run 17 gives a 1-2s warning (level 1 is 2.29 SD high). Run 18 is rejected by 4-1s: four results in a row, counted across both levels, more than 1 SD high. Run 19 also breaks 2-2s, with both levels above +2 SD at once. A shift that small is easy to miss by eye on a Levey-Jennings chart.
4. Now type a TEa of **10%** and leave bias blank, so the tool works it out from the targets. Level 1 has a CV of 1.33% and a bias of 0.81%, so sigma = (10 − 0.81) ÷ 1.33 = **6.91**. Level 2 (CV 1.56%, bias 0.78%) gives **5.92**.
5. Change TEa to **8%**: sigma drops to **5.41** and **4.64**. At **6%** it is **3.90** and **3.35**. Same data, same analyser, but a tighter goal moves this made-up test from world class to marginal. That is the paper's main point in miniature.

The TEa values here are examples only. Real limits differ by test, country and scheme, so check the official source before you use one. Note also that our CV includes the shifted runs; a lab would usually work out CV from a stable period.

## The fine print

- One laboratory, one analyser and one reagent brand, so other labs may see quite different sigma values.
- Only CLIA limits were compared. Other goals, such as those from biological variation, the German Rilibak or the Australian RCPA, could give other answers.
- Bias came from a limited number of external quality rounds, so it is less certain than the CV.
- This is general education about laboratory quality control. It is not advice on how to run a clinical laboratory, and it says nothing about any person's test results.
