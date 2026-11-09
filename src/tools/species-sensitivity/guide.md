---
name: Species sensitivity distribution
num: 152
shelf: science
section: ecotoxicology
title: "Species sensitivity distribution (SSD) and HC5 calculator: log-normal, log-logistic and model average with bootstrap limits"
summary: "Turn toxicity values for many species into one protective concentration. Fit a species sensitivity distribution (log-normal, log-logistic or their AICc average), read off the HC5 or any other HCp with bootstrap limits, see the fraction of species affected at any concentration, and plot every species on the curve."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-09
related: [lc50-probit, dose-response, flood-frequency]
sources:
  - "Species sensitivity distributions: the standard ecological risk assessment method (Kooijman 1987; Van Straalen and Denneman 1989; Aldenberg and Slob 1993). Model averaging by AICc weights (Burnham and Anderson) as in common SSD practice. Method only; no data or tables are copied."
  - "Fitting, Anderson–Darling statistic and bootstrap written by fibub. Checked in the tests against SciPy (norm.fit, logistic.fit) and a NumPy parametric bootstrap."
  - "The example species, groups and values are made up."
flow:
  - { icon: table, label: "Species" }
  - { icon: curve, label: "Fit curve" }
  - { icon: target, label: "HC5" }
  - { icon: check, label: "Protect" }
---

## What it does

Different species tolerate a chemical very differently: a mayfly may react at a tenth of the concentration that hurts a snail. A **species sensitivity distribution** (SSD) treats the toxicity values of the tested species as a sample from all species. It fits a curve to them and asks: at what concentration would a given share of species be affected?

The answer for 5 % is the **HC5**, the hazardous concentration for 5 % of species. It is the usual starting point for water and soil quality guidelines and for the predicted no-effect concentration in a risk assessment. This tool fits the SSD, gives the HC5 (or any HCp) with confidence limits, and gives the reverse too: the **fraction of species affected** at a concentration you name.

## How to use it

1. **Enter one toxicity value per test**: the species, an optional group (fish, insect, alga), and the value. Paste from a spreadsheet or open a CSV, TXT or Excel file. If a species appears more than once, its values are combined by geometric mean, so each species counts once.
2. **Use one kind of endpoint**: all chronic EC10 or NOEC values, or all acute LC50 values, in one unit. Mixing them makes the curve meaningless.
3. **Model**: log-normal and log-logistic are the two most used shapes. "Average of both" weights them by how well each fits (AICc), which avoids betting on one shape.
4. **Protect (HCp)**: 5 % is the usual choice. List other levels to report as well.
5. **Limits and bootstrap samples**: the limits come from a parametric bootstrap. The tool simulates new data sets from the fitted curve, refits each one and takes the middle 95 % (or 90 %) of the HCp values. The seed is fixed, so the same data always give the same limits; 10,000 samples are steadier but slower.
6. **Fraction affected at**: type a concentration, such as a measured level in a river, to get the share of species expected to be affected (the PAF).

## What you get

- **HCp** with its lower and upper limits. The lower limit is often what a guideline uses when the data are few.
- **A plot** of every species at its rank on a log scale, with both fitted curves and the chosen one in bold.
- **A model comparison**: centre and spread on the log10 scale, log-likelihood, AICc, weight, and the Anderson–Darling A² (smaller means a closer fit).
- **A species table** with each species' value, number of tests and plotting position, plus CSV, PDF, PNG and Word downloads.

## Worked example

The made-up example has 11 species from seven groups. Water flea has two values (12 and 20 µg/L), combined to 15.5 µg/L.

- Log-normal: centre 1.700 and spread 0.486 (log10 units), giving an HC5 of 7.94 µg/L.
- Log-logistic: an HC5 of 6.60 µg/L.
- AICc gives the log-normal 61 % of the weight. The **averaged HC5 is 7.43 µg/L**, with 95 % limits of 2.2 to 22 µg/L.
- At 10 µg/L, about 8 % of species are expected to be affected.
- The HC5 is just below the most sensitive species (mayfly, 8.5 µg/L), so the tool notes that it is an extrapolation.

The wide limits are typical for 11 species. More species, from more groups, narrow them.

## Limits of the method

An SSD assumes the tested species are a fair sample of the species you want to protect, which is rarely quite true. The tails of the curve, where the HC5 lies, are an extrapolation, so models that fit the middle equally well can disagree there. Regulators also apply their own rules on top: minimum species numbers and groups, assessment factors, and which endpoints count. Follow the guideline you work under. This tool is for checking and learning, not a replacement for validated software in a regulatory submission.

## FAQs

**How is this different from the LC50 tool?** The [LC50 probit analysis](/science/lc50-probit/) finds one species' LC50 from a single test. The SSD takes such values for many species and finds the concentration that protects most of them.

**Why the geometric mean for repeated species?** Toxicity values spread on a log scale. The geometric mean is the average on that scale, and it stops a well-studied species from counting many times.

**Why do the bootstrap limits change when I change the number of samples?** Each setting runs a different number of simulations, so the limits move a little. Within one setting they are fixed.

**Is my data uploaded?** No. Everything runs in your browser.
