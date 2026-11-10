---
name: Calibration curve
num: 28
shelf: science
section: analytical-chemistry
title: "Calibration curve"
summary: "Paste your standards and get the calibration line, R², limits of detection and quantitation (ICH Q2), and the concentration of each unknown with a 95 % interval."
status: live
ads: true
order: 10
icon: flask
works: offline
updated: 2026-11-08
related: [dose-response, uncertainty-calculator, plot-maker, graph-digitizer]
sources:
  - "Formulas: Miller and Miller, Statistics and Chemometrics for Analytical Chemistry; detection limits as in ICH Q2(R2)."
flow:
  - { icon: table, label: "Standards" }
  - { icon: chart, label: "Fit line" }
  - { icon: flask, label: "Unknowns" }
  - { icon: download, label: "Report" }
---

## What it does

Most lab measurements are not read directly. You measure standards of known concentration, draw a straight line through them, and read your samples off that line. This tool does the whole job: it fits the line, checks it, gives the detection and quantitation limits, and works out each unknown with a confidence interval. It works for UV-Vis, HPLC, GC, ICP, fluorescence, protein assays (Bradford, BCA) and anything else with a straight-line response.

If your standards curve rather than run straight, the [[dose-response|dose-response fitter]] handles a four-parameter curve; for the error on a result worked out from the line, use the [[uncertainty-calculator]].

## How to use it

1. **Paste your standards:** two columns, the concentration and then the response. Copy them straight from Excel or Google Sheets. A header row is fine. If you ran replicates, give each its own line with the same concentration.
2. **Pick a weighting.** Use **None** when the scatter is about the same at every level. Use **1/x** or **1/x²** when the scatter grows with concentration, which is common over two or more orders of magnitude, for example in LC-MS. Without weighting, the high standards then pull the line and the low end is read badly.
3. **Paste your unknowns:** one sample per line, with replicate readings on the same line, for example `Sample B: 13.5 13.7`. Add a dilution factor if you diluted the samples.
4. Read the results, check the residual plot, and download the report (image, PDF or Word) or the results as CSV.

## What each number means

- **Slope ± and intercept ±:** with 95 % confidence limits from Student's t. If the intercept differs significantly from zero, your blank may be contaminated or the response may not be linear near zero.
- **R²:** how much of the variation the line explains. A high R² alone does not prove linearity. Always look at the residuals too.
- **Residual SD (s y/x):** the typical scatter of the standards around the line, in response units.
- **LOD and LOQ:** by ICH Q2, LOD = 3.3 σ / slope and LOQ = 10 σ / slope. σ is the residual SD, or the standard deviation of the intercept if you choose that.
- **Unknowns:** the mean response is turned into a concentration. The 95 % interval comes from Miller and Miller's formula (eq. 5.9, or 5.17 when weighted). It shrinks with more replicates and is smallest near the middle of the line. Results outside the standards, or below the LOD or LOQ, are flagged.

## Worked example

The sample data is the fluorescence example from Miller and Miller's *Statistics and Chemometrics for Analytical Chemistry*. Seven standards from 0 to 12 pg/mL give y = 1.930x + 1.518, with r = 0.99888. A sample reading 2.9 is 0.72 pg/mL ± 0.26 (standard error). One reading 13.5 is 6.21 ± 0.24, and one reading 23.0 is 11.13 ± 0.26. These are the same values as the book. The LOD is 0.74 pg/mL and the LOQ is 2.24 pg/mL, so the first sample is flagged as below the detection limit: it cannot be told apart from a blank.

## Frequently asked questions

**Can I force the line through zero?** Not here, on purpose. Forcing the line through zero hides a blank problem and biases low readings. The intercept test above tells you whether zero is plausible.

**Non-linear or sigmoid response (ELISA)?** Use the [4PL dose-response and ELISA fitter](/science/dose-response/).

**Is my data uploaded?** No. Everything is calculated in your browser, and the page works offline.
