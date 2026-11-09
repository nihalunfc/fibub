---
name: Yield trial ANOVA and LSD
num: 386
shelf: science
section: agronomy-and-soil-science
title: "Yield trial ANOVA and LSD calculator: RCBD, CRD and Latin square with CV % and mean separation letters"
summary: "Paste or open your plot yields and get the analysis of variance for a randomised complete block, completely randomised or Latin square trial: F tests with p-values, CV %, standard errors, the LSD at 5 % or 1 % and letters that group the means. Nothing is uploaded."
status: live
ads: false
order: 386
icon: sigma
works: offline
updated: 2026-11-09
related: [field-trial-designer, sample-size, reliability-analysis]
sources:
  - "Sums of squares, F tests, CV % and Fisher's least significant difference are standard methods, as in Gomez and Gomez, Statistical Procedures for Agricultural Research (2nd ed.), chapters 2 and 5. Letters by the insert-and-absorb algorithm of Piepho (2004), Journal of Computational and Graphical Statistics 13: 456-466."
  - "Checked against statsmodels (anova_lm) and scipy (t quantiles) on the example (as RCBD and CRD), a 4 × 4 Latin square and an unbalanced CRD: every sum of squares, F, p-value, CV and LSD."
  - "The example yields are made up."
flow:
  - { icon: pencil, label: "Paste plots" }
  - { icon: sigma, label: "ANOVA" }
  - { icon: chart, label: "LSD letters" }
  - { icon: download, label: "Report" }
---

## What it does

After harvest, every plot of a trial has a yield. The question is whether the treatments really differ, or whether the differences are just plot-to-plot noise. This calculator runs the analysis of variance (ANOVA) used for field trials and then compares the treatment means:

- **ANOVA table**: degrees of freedom, sums of squares, mean squares, the F value and its p-value for treatments, and for blocks, rows and columns where the design has them.
- **CV %**: the coefficient of variation, the square root of the error mean square as a percentage of the grand mean. It tells you how precise the trial was.
- **LSD**: the least significant difference at 5 % or 1 %, LSD = t × √(2 × error mean square ÷ replicates), with t from Student's distribution on the error degrees of freedom. Two means further apart than the LSD differ significantly.
- **Letters**: means that share a letter are not significantly different. The highest mean's group is "a".

Lay out the next trial with the [[field-trial-designer]], and plan its replicates with the [[sample-size|sample size calculator]].

## Designs

- **Randomised complete block (RCBD)**: needs a block column, and every treatment exactly once in every block.
- **Completely randomised (CRD)**: no blocks. Replication can be unequal; then the LSD is worked out for each pair of treatments.
- **Latin square**: needs a row column and a column column, with each treatment once in every row and every column.

The tool checks the layout and says plainly what is wrong (a missing plot, a treatment twice in a block). It does not estimate missing plots.

## How to use it

1. Paste your data, one plot per line, or press **Open a file** for a CSV or Excel sheet. A header row is recognised and the columns are picked from their names; change them with the column menus if needed.
2. Pick the design and the significance level.
3. **Protected LSD** (on by default) separates means only when the treatment F test is significant, which keeps the overall error rate in check. Turn it off to always compare all pairs.
4. Download the means and ANOVA as a CSV, or the full report as an image, PDF or Word file.

## Worked example

Press **Use the example**: five made-up varieties in four blocks, yields in t/ha. As an RCBD the page shows **F = 86.77, p < 0.001** for treatments. The grand mean is 4.445, the error mean square is 0.0149 on 12 degrees of freedom, so the CV is 2.7 % and the LSD at 5 % is 2.179 × √(2 × 0.0149 ÷ 4) = 0.188. Variety B (5.225) gets "a", D (4.775) "b", A (4.300) and E (4.175) share "c", and C (3.750) is "d".

Change the design to CRD and the block differences go into the error: the CV rises to 7.5 %, the LSD to 0.500, and the groups overlap (A is "bc", D is "ab"). That is why blocking pays.

## FAQ

**Which yield unit?** Any. The results are in the same unit as your data.

**What is a good CV?** For yield trials, under about 10 % is good and 10 to 20 % is acceptable; higher usually points to typing errors or a very uneven field.

**Should I use LSD or Tukey?** The LSD is the usual choice for planned comparisons and small sets of treatments. With many treatments it finds more differences by chance; use the 1 % level or a stricter test then.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
