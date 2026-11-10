---
name: ROC curve
num: 468
shelf: science
section: biostatistics
title: "ROC curve"
summary: "Paste a true outcome and one or two marker values to draw the ROC curve, get the AUC with its DeLong confidence interval, the Youden cut-off, sensitivity, specificity, PPV, NPV and likelihood ratios at every cut-off, and DeLong's test of two markers on the same subjects. Matches scikit-learn."
status: live
ads: false
order: 8
icon: chart
works: offline
updated: 2026-11-09
related: [survival-analysis, sample-size, reliability-analysis, method-validation, plot-maker, calibration-curve]
sources:
  - "Formulas: Hanley and McNeil (1982) Radiology 143:29 (AUC as the Mann-Whitney statistic); DeLong, DeLong and Clarke-Pearson (1988) Biometrics 44:837 (variance and paired test); Sun and Xu (2014) IEEE Signal Processing Letters 21:1389 (fast mid-rank form); Youden (1950) Cancer 3:32."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "ROC curve" }
  - { icon: target, label: "Cut-off" }
  - { icon: download, label: "Report" }
---

## What it does

A blood test, a score or a scan measurement is only useful if it separates people who have a condition from those who do not. The **ROC curve** (receiver operating characteristic) shows how well it does this at every possible cut-off: each point is the **sensitivity** (share of true cases the test catches) against **1 − specificity** (share of people without the condition who are wrongly flagged). The **area under the curve (AUC)** sums this up in one number from 0.5 (no better than a coin toss) to 1 (perfect). This tool draws the curve, gives the AUC with a **DeLong confidence interval**, finds the **Youden cut-off**, lists sensitivity, specificity, PPV, NPV and likelihood ratios at every cut-off, and compares two markers measured on the same people with **DeLong's test**. Everything runs in your browser.

Read the predictive values at your chosen cut-off with the [[diagnostic-test-calculator]], and plan the study size with the [[sample-size|sample size calculator]].

## How to use it

1. Paste or open a file with one row per subject: the **true outcome** (1/0, or two words such as *case* and *control*), then one or two **marker** columns. A header row names the markers.
2. **Has the condition:** which outcome value means the condition is present.
3. **The condition goes with:** *higher values* if a high marker points to the condition (most blood markers), *lower values* if a low one does (for example a low haemoglobin for anaemia).
4. **Level:** 90, 95 or 99 % intervals.
5. With two markers, pick which one the cut-off table shows. Download the table as CSV, or the whole report as an image, PDF or Word file.

## What the numbers mean

- **AUC:** the chance that a randomly chosen person with the condition has a more extreme marker than a randomly chosen person without it; ties count half.
- **DeLong interval:** a standard error that needs no assumption about the shape of the marker's distribution; the interval is AUC ± z × SE, cut at 0 and 1. The p value tests AUC = 0.5.
- **Youden's J** = sensitivity + specificity − 1. The cut-off with the largest J is the one that best balances the two, if misses and false alarms matter equally.
- **PPV and NPV** use the share with the condition in your data, so they change if the prevalence differs where the test is used. **LR+** and **LR−** do not depend on prevalence.
- **DeLong's paired test** compares two AUCs from the same subjects, allowing for the correlation between them.

## Worked example

The example is 60 made-up people, 25 with the condition, each with two markers. The page shows:

- Marker A: **AUC = 0.895** (95 % CI 0.808 to 0.983, SE 0.045).
- Youden cut-off **≥ 44**: sensitivity 0.840, specificity 0.857 (21 of 25 cases caught, 5 of 35 false alarms), J = 0.697, LR+ = 5.88.
- Marker B: AUC = 0.676 (0.532 to 0.820).
- DeLong test: difference 0.219 (0.071 to 0.368), z = 2.892, **p = 0.004**, so marker A discriminates better.

## Tips

- Use the cut-off the same way it will be used in practice: choose it on one data set and check it on another, because the Youden cut-off from the same data is optimistic.
- An AUC below 0.5 usually means the direction is the wrong way round.
- The comparison needs both markers measured on every subject; rows with a blank are left out.

## FAQ

**Why do I get more points than other software?** Every distinct value is a cut-off here (like scikit-learn's roc_curve with drop_intermediate=False). Dropping the in-between points does not change the AUC.

**Is this the same as d′ from signal detection?** No. This is the empirical ROC of a clinical marker, without assuming normal distributions.

**Is my data sent anywhere?** No. Everything is worked out on your device and the page keeps working offline.
