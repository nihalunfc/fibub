---
name: Luminescence age calculator
num: 411
shelf: science
section: dating-methods
title: "Luminescence (OSL/TL) age calculator: central age model, dose rate from K, U and Th, water correction and uncertainty"
summary: "Work out an OSL or TL age as equivalent dose ÷ dose rate. Combine aliquot doses with the central age model or a weighted mean, build the dose rate from K, U and Th with your own conversion factors (or from alpha, beta and gamma parts), correct for water, and see the uncertainty budget. Nothing is uploaded."
status: live
ads: true
order: 411
icon: clock
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, radiometric-age-calculator, uncertainty-calculator, decay-calculator, racemisation-age]
sources:
  - "Central age model: Galbraith, R. F., Roberts, R. G., Laslett, G. M., Yoshida, H. and Olley, J. M. (1999), Archaeometry 41(2). Water correction: Zimmerman, D. W. (1971) and Aitken, M. J. (1985), Thermoluminescence Dating. Uncertainty propagation: JCGM 100:2008 (GUM)."
  - "No conversion-factor table is built in: the factors are inputs, prefilled with rough rounded example values that the user is told to replace with the published factors they use."
  - "Checked against an independent maximum-likelihood fit of the central age model with scipy.optimize (dose, overdispersion, standard errors and log-likelihood agree to 1e-8) and against closed-form partial derivatives in numpy for the age and dose-rate uncertainties (both input modes, with and without alpha)."
  - "The example aliquots and sediment values are made up."
flow:
  - { icon: table, label: "Aliquot De" }
  - { icon: flask, label: "K, U, Th" }
  - { icon: calculator, label: "Dose rate" }
  - { icon: clock, label: "Age (ka)" }
---

## What it does

Optically stimulated (OSL) and thermoluminescence (TL) dating measure how long ago mineral grains were last exposed to light or heat. The grains store energy from natural radioactivity around them, so the age is

**age (ka) = equivalent dose De (Gy) ÷ environmental dose rate (Gy/ka)**

This calculator does the sums around that equation:

- **Equivalent dose.** Paste the De of every aliquot or grain with its uncertainty, and combine them with the **central age model** (CAM, Galbraith et al. 1999), an inverse-variance **weighted mean** (with its MSWD) or a plain mean. Or type one value.
- **Dose rate.** Either from **K (%), U (ppm) and Th (ppm)** with conversion factors you enter, an a-value for alpha particles and a beta attenuation factor for grain size, or straight from **alpha, beta and gamma** dose rates. Add the cosmic and any internal dose rate.
- **Water.** Pore water absorbs radiation, so the dry dose rates are divided by (1 + k × W), with W the water mass over the dry mass and k = 1.49, 1.25 and 1.14 for alpha, beta and gamma (editable).
- **Uncertainty.** Every input's standard uncertainty is carried through to the age (first-order, GUM), and a table shows which inputs matter most.

## The central age model

The CAM treats the logarithms of the doses as spread around one central value by their own uncertainties plus an extra **overdispersion** σ (as a fraction). It finds the central dose and σ that best explain the data by repeating two steps until they stop changing. An overdispersion of 10 to 20 % is common for well-bleached sediment; much more can mean partial bleaching or mixing, for which other models (such as the minimum age model) may suit better.

## Conversion factors

The factors that turn concentrations into dose rates are published by specialists and revised from time to time. **This tool has no built-in table.** The boxes are filled with rough, rounded example numbers so that you can try it; replace them with the factors your lab uses and cite their source.

## Worked example

The 24 made-up aliquots give a CAM dose of **44.48 ± 1.11 Gy** with an overdispersion of 10.2 %. (Their weighted mean is 43.70 ± 0.55 Gy, but its MSWD of 3.34 shows the spread is larger than the uncertainties explain, so the CAM is the better summary.)

The made-up sediment has 1.2 ± 0.06 % K, 2.0 ± 0.1 ppm U and 7.5 ± 0.4 ppm Th, 15 ± 5 % water, a cosmic dose rate of 0.15 ± 0.015 Gy/ka, coarse etched grains (a-value 0) and a beta attenuation factor of 0.9 ± 0.02. With the example factors the dose rate is 2.040 ± 0.12 Gy/ka (beta 1.13, gamma 0.764, cosmic 0.15), and the age is **21.81 ± 1.4 ka**. The budget shows that the water content gives 57 % of the age's variance: a better estimate of past water would improve this date most.

## FAQ

**Is the age before today?** Before the year the sample was collected, in thousands of years (ka).

**Why is the uncertainty larger than De's alone?** The dose rate adds its own, especially through water content and the radionuclide concentrations.

**Are systematic and random errors separated?** No; all inputs are combined as independent. Use the budget to see the parts.

**Is my data uploaded?** No. Everything runs in your browser and works offline. For study and planning: it is not a substitute for a dating lab's own procedures and judgement.
