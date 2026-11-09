---
name: Benchmark dose (BMD) calculator
num: 475
shelf: science
section: toxicology
title: "Benchmark dose calculator: BMD and BMDL for quantal data with log-logistic, Weibull, gamma, multistage and probit models"
summary: "Fit five dose-response models to quantal (yes/no) toxicity data by maximum likelihood, get the benchmark dose at a chosen extra risk and its lower limit (BMDL) by profile likelihood, compare models by AIC and goodness of fit, and plot them."
status: live
ads: false
order: 15
icon: target
works: offline
updated: 2026-11-09
related: [lc50-probit, dose-response, drug-synergy, species-sensitivity, nca-pk, pk-simulator, binding-curve-fitter]
sources:
  - "Benchmark dose method: K. S. Crump, Fundam. Appl. Toxicol. 4 (1984) 854 and Risk Anal. 15 (1995) 79; model forms, parameter restrictions, extra risk, the p ≥ 0.1 adequacy rule and AIC as in US EPA, Benchmark Dose Technical Guidance (EPA/100/R-12/001, 2012) and its BMDS software (checked 2026-11-09; check the official source). AIC: H. Akaike, IEEE Trans. Autom. Control 19 (1974) 716. Formulas only; no data or tables copied."
  - "Fitting written by fibub (Nelder-Mead on bounded transforms, profile likelihood with bisection). Checked in the tests against an independent SciPy implementation (L-BFGS-B with box bounds; SLSQP profile with the BMD as an equality constraint) on the example and 10 random data sets: log-likelihoods to 10⁻¹³, BMDs to 1.3 × 10⁻⁷ and BMDLs to 4 × 10⁻⁸ (relative)."
  - "The example study is made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: curve, label: "5 models" }
  - { icon: target, label: "BMD" }
  - { icon: chart, label: "Compare" }
---

## What it does

The **benchmark dose (BMD)** approach finds the dose that causes a small, defined increase in the chance of an effect (the benchmark response, BMR), using a curve fitted to all the dose groups rather than a single "no observed effect" dose. Its lower confidence limit, the **BMDL**, is the usual point of departure in risk assessment. This page fits the five standard models for quantal data (each animal or subject either shows the effect or not) by maximum likelihood, works out the BMD and BMDL for each, and compares the fits.

It is for study and teaching, not medical advice. Regulatory assessments use the official software and guidance; check the official source.

## How to use it

1. **Paste the data**: one row per dose group with the dose, the number tested and the number affected. Include the control (dose 0) if you have one. Or use **Open a file**.
2. Set the **dose unit** for the labels.
3. Set the **benchmark response** as extra risk, (P(d) − P(0)) ÷ (1 − P(0)). 10 % is the usual default for quantal data; 5 % or 1 % are used for some severe effects, but they extrapolate further below the data.
4. Pick the **multistage degree**: 1 is the quantal-linear model; 2 and 3 allow more curvature.
5. Read the **table**, then use **Show** to plot one model with its BMD and BMDL, or all five together.

## The models

All but probit have a background term g (the response at dose 0, between 0 and 1):

- **Log-logistic**: g + (1 − g) / (1 + e^(−a − b·ln d)), slope b ≥ 1.
- **Weibull**: g + (1 − g)(1 − e^(−β·d^α)), power α ≥ 1.
- **Gamma**: g + (1 − g) × gamma CDF(β·d; α), power α from 1 to 18.
- **Multistage**: g + (1 − g)(1 − e^(−β₁d − β₂d² − …)), all β ≥ 0.
- **Probit**: Φ(a + b·d).

These limits follow the EPA's defaults and stop curves from becoming infinitely steep at zero dose. A parameter sitting on its limit is not counted in the AIC.

## How the BMDL is found

For each trial value of the BMD, the page refits the model with the BMD held fixed (the **profile likelihood**). The BMDL is the lowest BMD whose best log-likelihood is within 2.7055 / 2 of the overall maximum, which gives a one-sided 95 % lower limit (2.7055 is the 90th percentile of χ² with 1 degree of freedom).

## Worked example

A made-up study has 50 animals at 0, 25, 50, 100 and 200 mg/kg-day, with 1, 4, 9, 20 and 37 affected. All five models fit adequately (p ≥ 0.1). The lowest AIC is **Weibull (AIC 215.43)**, so the page shows **Weibull: BMD10 = 34.83 mg/kg-day, BMDL10 = 22.32 mg/kg-day**. The others are close: gamma 35.73 / 22.63, multistage (degree 2) 32.94 / 20.94, log-logistic 37.60 / 25.08, and probit, the worst fit (AIC 216.52, p 0.418), 48.09 / 40.81.

## Tips

- Check the scaled residuals near the BMD: values beyond ±2 there signal a poor local fit even when p is fine.
- A BMD/BMDL ratio above about 5 to 10 means the data pin the BMD down poorly.
- If no model fits, consider dropping the highest dose (it often saturates) and refitting.

## FAQ

**Is the log-likelihood the same as in BMDS?** It is the binomial log-likelihood without the constant term, so AIC differences between models are the same.

**Why is my BMDL missing?** The data may be consistent with a BMD near zero, or the curve never reaches the BMR.

**Is anything uploaded?** No. All fitting runs in this page.
