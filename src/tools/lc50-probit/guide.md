---
name: LC50 probit analysis
num: 151
shelf: science
section: ecotoxicology
title: "LC50 / EC50 calculator: probit and logit analysis of toxicity tests, with Abbott's correction and fiducial limits"
summary: "Find the LC50 or EC50 from a toxicity test where a number of organisms die or respond at each concentration. Fit a probit or logit line by maximum likelihood, correct for deaths in the control, and get LC10, LC50, LC90 or any other level with 95 % fiducial limits, the slope, a goodness-of-fit test and plots."
status: live
ads: true
order: 1
icon: flask
works: offline
updated: 2026-11-09
related: [dose-response, sample-size, binding-curve-fitter, air-quality-calculator]
sources:
  - "Probit analysis: D. J. Finney, Probit Analysis (Cambridge University Press, 3rd ed. 1971): the model, the heterogeneity factor and the g statistic. Abbott's correction: W. S. Abbott (1925). Fiducial limits from Fieller's theorem (1954). Method only; no tables are copied."
  - "Fitting written by fibub (Fisher scoring with step halving). Checked in the tests against statsmodels 0.15 (binomial GLM with probit and logit links) and SciPy (fixed natural response and Fieller limits)."
  - "The example test is made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: curve, label: "Fit line" }
  - { icon: target, label: "LC50" }
  - { icon: chart, label: "Limits" }
---

## What it does

In an acute toxicity test, groups of organisms (fish, water fleas, insects, seedlings) are exposed to a range of concentrations, and at each one you count how many die or show the effect. The **LC50** is the concentration expected to kill half of them; the **EC50** is the same for an effect other than death, such as immobility. This tool finds it, and any other level such as the LC10 or LC90, from those counts.

It fits the classic **probit** model (or the **logit** model): the share responding follows a normal (or logistic) S-curve against the logarithm of concentration. The fit is by **maximum likelihood**, which treats each count as binomial, so groups of different sizes and concentrations where none or all responded are handled properly.

## How to use it

1. **Enter the test results**: one row per concentration, with the concentration, the number exposed and the number that responded. Add the control as a row with concentration 0. Paste from a spreadsheet or open a CSV, TXT or Excel file.
2. **Model**: probit is the long-standing standard in toxicity testing; logit is a close alternative. They usually agree near the LC50 and differ a little in the tails.
3. **Response**: choose death (LC) or another effect (EC). This only changes the labels.
4. **Natural response**: some organisms die in clean water too. "From the control" takes that rate from the rows at concentration 0 and builds it into the model (Abbott's correction), so the LC50 is the concentration that kills half of those the chemical could kill. You can also assume none, or type a rate.
5. **Limits and levels**: pick 90, 95 or 99 % limits, and list any other levels to report, such as 10, 20, 90.

## What you get

- **LC50 (or EC50)** with its **fiducial limits**, and a table of every level you asked for.
- **The slope** of the line with its standard error. A steep slope means the organisms respond over a narrow range.
- **A goodness-of-fit test** (Pearson χ²). When the scatter between groups is larger than chance allows (p < 0.05), the limits are widened by the **heterogeneity factor** χ²/df and use Student's t, as Finney recommends.
- **Finney's g**. Below 0.4 the limits are reliable; from 0.4 they become wide and lopsided; at 1 or more the slope is not significant and the limits are not defined.
- **Plots**: the S-curve against the observed percentages, and a straight-line check on the probit or logit scale.
- **A table** of observed, Abbott-corrected and fitted percentages, with residuals, plus CSV, PDF, PNG and Word downloads.

## Worked example

The made-up example has a control with 1 death in 20, and six concentrations from 1 to 18 mg/L with 2, 4, 8, 13, 17 and 20 deaths out of 20.

- The natural response is 5 %.
- The probit slope is 2.96 ± 0.51 per tenfold rise.
- The **LC50 is 4.11 mg/L**, with 95 % limits of 3.12 to 5.25 mg/L.
- The LC10 is 1.51 mg/L (0.80 to 2.15). The LC90 is 11.1 mg/L (8.18 to 19.1).
- χ² is 0.87 on 4 df (p = 0.93), so the fit is good. g is 0.11.

Switching to logit gives an LC50 of 4.13 mg/L, almost the same.

## Limits of the method

The natural response is fixed from the control rather than fitted together with the slope. This is the usual practice with a well-sized control, but it ignores the uncertainty in the control rate. With very few control organisms, the limits may be a little too narrow. The model assumes each organism responds independently. Tanks or replicates that differ add extra scatter, which the heterogeneity factor partly allows for. Results outside the tested range are extrapolated and are flagged. This is a calculator for checking and learning. For a test that goes to a regulator, follow the guideline your test was run under and check the result with validated software.

## FAQs

**How is this different from the dose-response tool?** The [dose-response fitter](/science/dose-response/) fits a smooth four-parameter curve to a measured, continuous response such as growth or absorbance. This tool is for counts: how many out of how many responded.

**Why not just draw a line through the percentages?** Groups with 0 % or 100 % response carry information but cannot be put on a probit scale, and small groups are noisier than large ones. Maximum likelihood weights every group by how much it really tells you.

**What are fiducial limits?** They are the confidence limits for a concentration read off a fitted line. They come from Fieller's theorem, which allows for the uncertainty in both the intercept and the slope, so they are not symmetric around the LC50.

**Is my data uploaded?** No. Everything runs in your browser.
