---
name: Method validation statistics
num: 87
shelf: science
section: analytical-chemistry
title: "Method validation statistics: RSD, recovery, Grubbs outlier test, repeatability and intermediate precision"
summary: "Paste replicate results by day, analyst or instrument: mean, SD, RSD and confidence interval, the Grubbs outlier test, bias and recovery against a true value, repeatability and intermediate precision by ANOVA, and the Horwitz ratio."
status: live
ads: true
order: 9
icon: sigma
works: offline
updated: 2026-11-08
related: [calibration-curve, uncertainty-calculator, chromatography-calculator, titration-curve]
sources:
  - "Grubbs critical values: calculated from the t distribution (as in ASTM E178)."
  - "Horwitz ratio and validation terms: ICH Q2 and ISO 5725."
flow:
  - { icon: table, label: "Replicates" }
  - { icon: target, label: "Outliers" }
  - { icon: sigma, label: "Precision" }
  - { icon: check, label: "Accuracy" }
---

## What it does

Before an analytical method is used for real samples, the lab shows that it is precise (results agree with each other) and accurate (they agree with the truth). ICH Q2(R2), ISO 5725, Eurachem and AOAC all ask for the same handful of numbers, and this tool works them out from your replicate results.

- **Mean, standard deviation, RSD and confidence interval** for each series and for all results together.
- **Grubbs test** for the single most extreme value in each series, two-sided, at 5 % or 1 %. A value is flagged when G is above the critical value. With three or more series, the series means are tested too, as ISO 5725-2 does for laboratory means.
- **Accuracy** against a true value (a certified reference value, the amount spiked, or 100 % of the label claim): recovery with its confidence interval, the bias, and a t-test of whether the bias is real.
- **Repeatability and intermediate precision** from a one-way ANOVA across the series. Repeatability (s_r) is the scatter within a day; intermediate precision (s_I) adds the day-to-day, analyst or instrument effect (s_L). An F-test says whether the series really differ. Series of unequal size are handled.
- **Horwitz ratio (HorRat)**: your RSD divided by the reproducibility RSD that Horwitz's equation predicts at your concentration (Thompson's form: 2·C^−0.1505, capped at 22 % for very low levels).

## How to use it

1. Paste your results, one column per series, with a header row, or open a CSV or Excel file (up to 10 MB and 20 columns). A single column is fine for a repeatability study.
2. Type the true value if you have one. Leave it empty to skip accuracy.
3. Choose 5 % or 1 % for the tests. For the Horwitz check, type the level of the analyte, such as 5 % or 2 mg/kg.
4. Only tick **Leave out values Grubbs flags** when you know the cause, such as a recorded pipetting error. A statistical flag alone is not a reason to delete data; most guides ask you to investigate and report it.
5. Download the summary, the table and the dot plot as a PNG, PDF or Word file.

## Worked example

An assay at 100 % of label claim, six replicates on each of three days. Day 2 has one high result, 103.9.

- Grubbs on day 2: G = (103.9 − 101.18)/1.353 = 2.01, above the 5 % critical value of 1.887 for n = 6, so 103.9 is flagged.
- ANOVA on all 18 results: s_r = 0.823 (RSD 0.82 %), s_L = 0.666, intermediate precision s_I = 1.06 (RSD 1.06 %). F = 4.92 with p = 0.023, so the days differ.
- Recovery 100.33 %, 95 % interval 99.83 to 100.82 %; bias +0.33 with p = 0.18, so no significant bias.

If the 103.9 was a known error and is left out, repeatability drops to RSD 0.31 % and intermediate precision to 0.50 %.

## Questions

**Grubbs or Dixon's Q?** Both look for one extreme value. Grubbs uses the mean and SD and is the test named in ISO 5725 and most current guides. Neither should be used to delete data without a reason.

**Why does intermediate precision need several days?** Repeatability on one day misses things that change between days: calibration, reagents, temperature, the analyst. Three to six series of three to six results each is common.

**Is my data sent anywhere?** No. Everything is worked out in your browser.
