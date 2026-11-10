---
name: Meta-analysis
num: 469
shelf: science
code: T320
section: biostatistics
title: "Meta-analysis"
summary: "Pool studies from 2×2 counts (odds ratio, risk ratio, risk difference), means and SDs (mean difference, Hedges' g) or an estimate with its SE or CI. Fixed effect and random effects (DerSimonian-Laird, REML, Paule-Mandel), Q, I², tau², prediction interval, Egger's test, forest and funnel plots. Matches statsmodels."
status: live
ads: false
order: 9
icon: chart
works: offline
updated: 2026-11-09
related: [survival-analysis, roc-curve, sample-size, plot-maker, uncertainty-calculator, reliability-analysis]
sources:
  - "Formulas: DerSimonian and Laird (1986) Controlled Clinical Trials 7:177; Paule and Mandel (1982) J Res NBS 87:377; Viechtbauer (2005) J Educ Behav Stat 30:261 (REML); Higgins and Thompson (2002) Stat Med 21:1539 and Higgins et al. (2003) BMJ 327:557 (I²); Higgins, Thompson and Spiegelhalter (2009) JRSS A 172:137 (prediction interval); Egger et al. (1997) BMJ 315:629; Hedges (1981) J Educ Stat 6:107; Cochrane Handbook for Systematic Reviews of Interventions (effect sizes, zero-cell correction)."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Studies" }
  - { icon: sigma, label: "Pool" }
  - { icon: chart, label: "Forest plot" }
  - { icon: download, label: "Report" }
---

## What it does

A meta-analysis combines the results of several studies of the same question into one overall estimate, weighting each study by how precise it is. This tool works out each study's effect, pools them with a **fixed-effect** and a **random-effects** model, measures how much the studies disagree (**Q**, **I²**, **tau²** and the **prediction interval**), draws a **forest plot** and a **funnel plot**, and runs **Egger's test** for small-study effects. It all runs in your browser and nothing is uploaded.

For time-to-event studies, use [[survival-analysis]]; to plan the size of a new trial, the [[sample-size|sample size calculator]].

## How to use it

1. Choose what each study gives you:
   - **Events:** events and totals in the treated and control groups. Pick the **odds ratio**, **risk ratio** or **risk difference**.
   - **Means:** mean, SD and number in each group. Pick the **mean difference** (same scale in every study) or **Hedges' g** (different scales).
   - **Effect + SE:** any estimate with its standard error, for example a regression coefficient or a log hazard ratio.
   - **Effect + CI:** an estimate with its confidence interval, as most papers report it. Tick **ratios** for odds, risk or hazard ratios so they are pooled on the log scale.
2. Paste the studies (or open a CSV or Excel file), one per row, with the study name first.
3. Choose the **main result** (random or fixed), the **between-study variance** method, the **level**, and the words either side of the line of no effect.
4. Download the forest plot, funnel plot and table as an image, PDF or Word file, or the table as CSV.

## What the numbers mean

- **Fixed effect:** inverse-variance weighted mean, assuming one true effect.
- **Random effects:** each study's true effect may differ; weights are 1 ÷ (variance + tau²). **DerSimonian-Laird** is the classic method-of-moments estimate of tau²; **REML** (restricted maximum likelihood) and **Paule-Mandel** are often preferred.
- **Q** tests whether the studies disagree more than chance; **I²** is the share of the variation that is real disagreement.
- **Prediction interval:** where the true effect of a new, similar study would probably lie (t with k − 2 df).
- **Egger's test:** regresses effect ÷ SE on 1 ÷ SE; an intercept far from zero hints at a lopsided funnel.
- **Zero cells:** a trial with a zero gets 0.5 added to every cell; a trial with no events in either group is left out of ratio measures.

## Worked example

The Events example is 8 made-up trials. With the odds ratio and DerSimonian-Laird random effects the page shows:

- Random effects: **OR 0.648** (95 % CI 0.446 to 0.940), p = 0.022.
- Fixed effect: OR 0.654 (0.497 to 0.860).
- Q = 10.991 on 7 df, p = 0.139; **I² = 36.3 %**; tau² = 0.097 on the log scale.
- 95 % prediction interval 0.265 to 1.580: a new trial could even show harm.
- Egger's intercept −0.691, p = 0.586.

Trial E had no events among the treated, so 0.5 was added to each of its cells.

## Tips

- Pool only studies that ask the same question in similar people.
- With fewer than about 5 studies, tau² is very uncertain; report the fixed-effect result too.
- Egger's test needs about 10 studies to be useful.
- For hazard ratios from papers, use **Effect + CI** with the ratio box ticked.

## FAQ

**Why is my tau² different from statsmodels?** statsmodels' DerSimonian-Laird can return a negative tau²; it is set to zero here, as in the original method and in RevMan and metafor.

**Can I use a random-effects interval with t (Hartung-Knapp)?** Not yet; intervals use the normal distribution.

**Is my data sent anywhere?** No. Everything is worked out on your device and the page keeps working offline.
