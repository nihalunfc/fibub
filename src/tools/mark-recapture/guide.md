---
name: Mark-recapture estimator
num: 301
shelf: science
section: ecology
title: "Mark-recapture calculator: Lincoln-Petersen, Chapman and Schnabel population estimates with confidence intervals"
summary: "Estimate the size of an animal population from capture-mark-recapture counts. Two samples give the Lincoln-Petersen and Chapman estimates with Seber's variance and a log-normal, normal or Poisson interval; several samples give the Schnabel estimate with a closed-population check."
status: live
ads: true
order: 301
icon: target
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, sample-size, uncertainty-calculator, occupancy-estimator, distance-sampling, population-growth-models]
sources:
  - "Methods: Lincoln (1930) and Petersen; D. G. Chapman (1951) estimator; G. A. F. Seber, The Estimation of Animal Abundance (2nd ed. 1982) for the variance and adjusted Schnabel estimate; Z. E. Schnabel (1938); A. Chao (1987) and Burnham et al. (1987) for the log-normal interval; C. J. Krebs, Ecological Methodology (2nd ed. 1999) for the Schnabel limits; Robson and Regier (1964) for the 7-recapture rule. Formulas only; no tables are copied."
  - "Checked in the tests against an independent Python implementation using SciPy 1.x (normal, chi-square and t quantiles)."
  - "The examples are made up."
flow:
  - { icon: target, label: "Mark" }
  - { icon: search, label: "Recapture" }
  - { icon: sigma, label: "Estimate N" }
  - { icon: download, label: "Report" }
---

## What it does

Counting every animal in a pond, a field or a forest is rarely possible. Mark-recapture gets round this: you catch some animals, mark them and let them go, then catch again and see what share of the new catch is marked. If 18 of 100 animals in the second catch carry a mark, and you marked 120, the population is roughly 120 × 100 / 18, about 670. This tool does that sum properly and tells you how sure you can be.

- **Two samples** gives the classic **Lincoln-Petersen** estimate M × C / R and the **Chapman** estimate (M+1)(C+1)/(R+1) − 1, which is almost unbiased and still works when no marked animals are recaught. The standard error uses Seber's variance.
- **Several samples (Schnabel)** handles a study with three or more catches, where each catch is checked for marks and the unmarked animals are marked before release. It pools the information from every catch.

## How to use it

1. Pick **Two samples** or **Several (Schnabel)**.
2. For two samples, type **M** (animals marked and released the first time), **C** (animals caught the second time) and **R** (how many of those C already had a mark).
3. For several samples, paste one row per occasion: **caught**, **recaptured**, and optionally **newly marked**. Leave the third column out if you marked and released every unmarked animal. If some died in the trap or were not marked, give the number you actually released with a new mark. You can also open a CSV or Excel file.
4. Choose the **confidence** level. The result, the table and the chart update as you type. Download a CSV of the numbers or a full report as an image, PDF or Word file.

## What each option does

- **Log-normal interval** (the default) works on the animals you have not yet seen, so the lower limit can never fall below the number you actually handled (M + C − R), and the interval is lopsided the way the real uncertainty is.
- **Normal interval** is the Chapman estimate ± z × standard error. It is symmetric and fine when you have many recaptures.
- **Poisson interval** treats the recapture count as a Poisson count and puts its exact limits into the Chapman formula. It suits studies where recaptures are few compared with the catch.
- For **Schnabel**, the interval uses exact Poisson limits on the total recaptures when there are fewer than 50, and a t interval on 1/N otherwise, as in Krebs's Ecological Methodology.

## Worked example

The two-sample example is made up: 120 newts marked, 100 caught a week later, 18 of them marked. The page shows **N ≈ 642 (95 % interval 464 to 943)**. Lincoln-Petersen gives 666.67, the Chapman estimate is 642.21 with a standard error of 119 (a coefficient of variation of 18.5 %), and 202 different newts were handled. Switching to the normal interval gives 409 to 875; the Poisson interval gives 414 to 1,046.

The Schnabel example is five made-up nights of trapping beetles, catching 30, 35, 40, 32 and 38 with 0, 5, 11, 13 and 19 recaptures. Σ(C × Mt) is 10,402 and ΣR is 48, so N ≈ **217 (95 % interval 163 to 294)**; the adjusted estimate is 212.29. The chart shows the share of each catch that was marked against the marks at large, which should be a straight line through zero.

## Tips

- Aim for at least 7 recaptures; the page warns you when there are fewer. More recaptures shrink the interval far more than larger catches with few recaptures.
- Keep the gap between samples short enough that few animals are born, die or move in or out, but long enough for marked animals to mix back in.
- Use marks that will not wear off or change how the animal behaves or survives.

## Frequently asked questions

**Why is the Chapman estimate lower than Lincoln-Petersen?** Lincoln-Petersen tends to overestimate, badly when recaptures are few. Chapman's +1 corrections remove most of that bias.

**What if the chart is curved?** In a Schnabel study, a curve that bends down suggests new unmarked animals are joining (births or immigration) or marked ones are leaving; a curve that bends up suggests trap-happy animals. An open-population model such as Jolly-Seber would then be better.

**Is my data sent anywhere?** No. Everything is worked out in your browser, and the page keeps working offline once loaded.
