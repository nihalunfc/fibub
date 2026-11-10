---
name: IRT item analysis
num: 726
shelf: science
code: T494
section: psychology-and-psychometrics
title: "IRT calculator online: Rasch (1PL) and 2PL item parameters, curves and ability scores (free)"
summary: "Fit 1PL (Rasch) and 2PL item response models to right/wrong test answers in your browser, by marginal maximum likelihood. Item difficulty and discrimination with standard errors, item characteristic and information curves, and an EAP ability score for every person."
status: live
ads: false
order: 726
icon: curve
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, plot-maker, data-cleaner, item-analysis, factor-analysis, questionnaire-scorer]
sources:
  - "Methods: Birnbaum (1968) two-parameter logistic model; Rasch (1960); marginal maximum likelihood by the EM algorithm of Bock and Aitkin (1981) with Gauss-Hermite quadrature; EAP scoring (Bock and Mislevy 1982)."
  - "Example data: simulated for this page."
flow:
  - { icon: table, label: "Paste 0/1" }
  - { icon: curve, label: "Fit model" }
  - { icon: chart, label: "Curves" }
  - { icon: download, label: "Scores" }
---

## What it does

Item response theory (IRT) describes each test item by how hard it is and how well it separates weaker from stronger test takers, on the same scale as the ability of the people taking the test. This tool fits the two most used models for right/wrong answers:

- **2PL**: each item has a **difficulty b** (the ability at which half the people get it right) and a **discrimination a** (how steep its curve is).
- **1PL (Rasch)**: all items share one discrimination, so they differ only in difficulty. This is the Rasch model, written with the spread of ability as the common slope.

Both are fitted by **marginal maximum likelihood**, the standard method in IRT programs: ability is treated as normally distributed and integrated out with 41-point Gauss-Hermite quadrature, using the EM algorithm of Bock and Aitkin. Standard errors come from the observed information. Each person gets an **EAP** (expected a posteriori) ability score with its standard error. Nothing is uploaded.

Start with classical difficulty and discrimination in the [[item-analysis|item analysis]], and check whether one ability lies behind all the items with the [[factor-analysis|factor analysis]].

## How to use it

1. Paste the scored answers: one row per person, one column per item, **1** for right and **0** for wrong. Leave a cell blank if the person did not see or answer the item; blanks are skipped, not counted as wrong. A header row and an ID column are optional. You can also open a CSV or Excel file.
2. Choose **2PL** or **1PL**. Both are fitted, so the comparison between them is always shown.
3. Read the item table, the curves and the scores, and download the items or the scores as CSV, or the whole report.

## Reading the results

- **b** near 0 is an item of average difficulty; positive is harder. A b beyond ±3 is marked: the item is too easy or too hard for this group.
- **a** above about 1 is a good discriminator. An a below 0.5 is marked: the item tells you little.
- The **information curve** shows where on the ability scale the test measures precisely. The standard error of a score is about 1/√information.
- The **likelihood-ratio test**, AIC and BIC compare the two models. A significant test or a lower AIC favours 2PL; BIC penalises extra parameters more.

## Worked example

The example is 300 simulated test takers and 8 items. The 2PL fit gives Q1 a = 0.495 (SE 0.177) and b = −2.012: an easy item that discriminates poorly, so it is marked. Q2 has a = 1.580 and b = −0.872. The comparison gives χ²(7) = 21.56, p = 0.003, so separate slopes fit better, and AIC agrees (2775.6 for 2PL against 2783.1 for 1PL), while BIC prefers the simpler 1PL (2816.5 against 2834.8). Under the 1PL the common slope is a = 1.108. The first three people answered nothing right and all get an EAP score of −1.562.

## Tips

- IRT needs more data than classical item analysis: a few hundred people for the 2PL is a common minimum, fewer for the 1PL.
- Remove items that everyone (or no one) got right; the tool tells you which ones.
- For multiple-choice items with guessing, a 3PL model is sometimes used, but it needs much more data. Check classical statistics too.

## Frequently asked questions

**Why do people with the same raw score get the same 1PL score but different 2PL scores?** In the 1PL the raw score holds all the information. In the 2PL, right answers on more discriminating items count for more.

**Has this been checked?** Yes: on the example, item parameters, standard errors, the log-likelihood and EAP scores match an independent Python fit (scipy's optimiser on the marginal likelihood with 61 quadrature points) to within 0.00001.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
