---
name: Volcano plot and PCA
num: 985
shelf: science
section: metabolomics-and-lipidomics
title: "Volcano plot and PCA for metabolomics data: fold change, Welch t-test, FDR (Benjamini-Hochberg) and principal components"
summary: "Paste or open a metabolite table (peak areas or concentrations, samples in columns) and compare two groups: fold changes, Welch's t-tests, Benjamini-Hochberg FDR q-values and a labelled volcano plot, plus a PCA of all samples with scores, explained variance and the top loadings. Log transforms, missing-value handling and autoscaling or Pareto scaling. Your data stay on your device."
status: live
ads: false
order: 2
icon: chart
works: offline
updated: 2026-11-09
related: [adduct-calculator, trend-analyser, plot-maker]
sources:
  - "Welch's t-test (Welch, 1947) with the Welch–Satterthwaite degrees of freedom; false discovery rate by Benjamini, Y. and Hochberg, Y. (1995), J. R. Stat. Soc. B 57, 289 to 300; principal component analysis with autoscaling or Pareto scaling as used in metabolomics (van den Berg et al., 2006, BMC Genomics 7, 142): used as methods, written by fibub."
  - "Checked against SciPy (scipy.stats.ttest_ind with equal_var=False and scipy.stats.false_discovery_control) and NumPy (SVD for the PCA scores, loadings and explained variance) on the example table. The example data are made up."
flow:
  - { icon: table, label: "Table" }
  - { icon: sigma, label: "Tests" }
  - { icon: chart, label: "Volcano" }
  - { icon: target, label: "PCA" }
---

## What it does

A metabolomics experiment gives a big table: hundreds of metabolites measured in a handful of samples from two or more groups. Two pictures answer the first questions.

- The **volcano plot** asks which metabolites changed. Each point is one metabolite: across is the **log₂ fold change** between the groups, up is the **strength of evidence** (−log₁₀ of the p or q value). Metabolites that changed a lot and convincingly sit in the top corners and are labelled.
- The **PCA** asks whether the samples separate at all. It squeezes all the metabolites into a few **principal components**; samples that are alike sit together on the scores plot, and the **loadings** show which metabolites drive the separation.

The page uses **Welch's t-test**, which does not assume the groups have equal spread, and the **Benjamini–Hochberg** false discovery rate, which keeps the share of false hits under control when hundreds of tests are run. Everything runs in your browser; the table is never uploaded.

## How to use it

1. Paste a table, or open a CSV or Excel file: a header row of **sample names**, then one row per **metabolite** (or choose "Samples in rows"). Groups come from a row called **Group** or from the sample names (Ctrl_1, Ctrl_2 … are group Ctrl).
2. Choose the two **groups** to compare.
3. Choose the **transform** (log₂ is usual), how to treat **missing values**, the **significance rule** (FDR q or raw p, and the fold change) and the **PCA scaling**.
4. Read the volcano plot and the table (sorted by p), then the PCA scores and loadings. Download the full results or the PCA scores as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example has 12 metabolites in 4 control and 4 treated samples, with one missing value (filled with half the smallest kynurenine value). The page shows **4 up, 1 down of 12 metabolites** at FDR q < 0.05 and a fold change of at least 2: lactate (2.70×), succinate (3.35×), hypoxanthine (2.10×) and kynurenine (4.45×) are up, glutamine (0.466×) is down. Citrate is significant (q = 0.033) but changes only 0.80×, so it is not called. The lowest q is 8.3 × 10⁻⁵ (hypoxanthine). In the PCA, **PC1 explains 55.3 %** of the variance and splits the controls from the treated samples; PC2 explains 15.7 % and PC3 10 %.

## Tips

- Normalise for sample amount (for example to total signal or an internal standard) before pasting.
- With three or four samples per group, p-values are fragile; a volcano plot is a guide for follow-up, not proof.
- Pareto scaling keeps big, reliable peaks more important than autoscaling does; try both.

## FAQ

**Why log-transform?** Concentrations are skewed and their spread grows with their size; logs make them closer to normal with equal spread, which the t-test assumes.

**Is my data uploaded?** No. The table and the file are read and analysed in your browser and never leave your device. For study and planning, not a substitute for professional judgement.
