---
name: Concordia plot (U-Pb)
num: 874
shelf: science
section: geochemistry-and-geochronology
title: "U-Pb concordia plot: Wetherill and Tera-Wasserburg diagrams, error ellipses, concordia age, discordia intercepts"
summary: "Paste U-Pb isotope ratios with errors and correlations. Get Wetherill or Tera-Wasserburg concordia diagrams with 2σ error ellipses, the concordia age with its MSWD (Ludwig 1998), upper and lower discordia intercepts by York regression, the weighted mean ²⁰⁶Pb/²³⁸U age, and each analysis's three ages and discordance."
status: live
ads: true
order: 874
icon: curve
works: offline
updated: 2026-11-09
related: [radiometric-age-calculator, decay-calculator, uncertainty-calculator, age-depth-model, plot-maker]
sources:
  - "Decay constants λ238 = 1.55125 × 10⁻¹⁰/yr and λ235 = 9.8485 × 10⁻¹⁰/yr (Jaffey et al. 1971, Physical Review C); ²³⁸U/²³⁵U = 137.818 (Hiess et al. 2012, Science) or 137.88 (Steiger and Jäger 1977). Physical constants."
  - "Concordia age and its MSWDs of concordance and equivalence after Ludwig (1998, Geochimica et Cosmochimica Acta); York et al. (2004) regression for discordia; Wetherill (1956) and Tera and Wasserburg (1972) diagrams. Written by fibub from the equations and checked against an independent NumPy/SciPy implementation."
  - "The example zircon analyses are made up by fibub."
flow:
  - { icon: table, label: "Ratios" }
  - { icon: curve, label: "Concordia" }
  - { icon: target, label: "Intercepts" }
  - { icon: calculator, label: "Ages" }
---

## What it does

Uranium-lead dating uses two clocks in one mineral: ²³⁸U decays to ²⁰⁶Pb and ²³⁵U decays to ²⁰⁷Pb at different rates. If a crystal (usually zircon) has stayed closed, both clocks agree and its two ratios plot on the **concordia** curve. Lead loss or mixing pulls analyses off the curve along a straight **discordia** line. This page:

- Draws the **Wetherill** diagram (²⁰⁷Pb/²³⁵U against ²⁰⁶Pb/²³⁸U) or the **Tera-Wasserburg** diagram (²³⁸U/²⁰⁶Pb against ²⁰⁷Pb/²⁰⁶Pb), with each analysis as a **2σ** (or 95 %) **error ellipse** that includes the error correlation.
- Converts between the two kinds of ratios with their errors and correlation, so you can paste either.
- Calculates the **concordia age** of a group of analyses (Ludwig 1998): their weighted mean point and the age on concordia that fits it best, with the **MSWD** of concordance, of equivalence and of both, and their probabilities.
- Fits a **discordia** line by **York regression** (errors in both ratios and their correlation) and gives its **upper and lower intercepts** with concordia, with errors.
- Gives the **weighted mean ²⁰⁶Pb/²³⁸U age** with MSWD, and each analysis's ²⁰⁶Pb/²³⁸U, ²⁰⁷Pb/²³⁵U and ²⁰⁷Pb/²⁰⁶Pb ages and **discordance**.

Turn single isotope ratios into ages with the [[radiometric-age-calculator|radiometric age calculator]], and place the dated layers in a timeline with the [[age-depth-model|age-depth model]].

## How to use it

1. Choose whether your ratios are **Wetherill** or **Tera-Wasserburg**, and how errors are given (2σ or 1σ, absolute or %).
2. Paste one analysis per line: an optional label, the first ratio, its error, the second ratio, its error, and the error correlation (rho). Or open a CSV or Excel file.
3. Choose the **main result**: discordia intercepts for a lead-loss line, the concordia age for a group of concordant grains, or the weighted mean ²⁰⁶Pb/²³⁸U age for young zircons.
4. Untick analyses to leave them out (they stay grey on the plot). Download the table as CSV, or the report.

## Worked example

The discordant example has eight made-up zircon analyses that mix 1850 Ma crystals with lead loss at 300 Ma. The York fit gives an **upper intercept of 1852.4 ± 6.9 Ma** and a **lower intercept of 307 ± 13 Ma** (2σ). The line's MSWD is 0.59 (probability of fit 0.74), so the scatter is no more than the errors explain. A concordia age of these analyses would make no sense, and the page shows why: its MSWD of concordance is in the thousands. The concordant example (seven analyses near 420 Ma) gives a **concordia age of 418.0 ± 2.4 Ma** with an MSWD of concordance and equivalence of 0.69 (probability 0.77): the analyses agree with each other and with concordia.

## Good to know

- Use ratios corrected for common lead. In the Tera-Wasserburg diagram, uncorrected analyses spread towards the common-lead ²⁰⁷Pb/²⁰⁶Pb on the y axis.
- The errors here are analytical only; decay-constant errors (which matter when comparing with other methods) are not added.
- Isotope ratios of ²³⁸U/²³⁵U: 137.818 is the modern measured value; older work used 137.88. The choice shifts ²⁰⁷Pb/²⁰⁶Pb ages by about 1 Ma.

## FAQ

**Why do the concordia age and the weighted mean ²⁰⁶Pb/²³⁸U age differ?** The concordia age also uses the ²⁰⁷Pb/²³⁵U ratio and the error correlation, so it is usually more precise.

**What if the discordia line misses concordia?** Then there is no intercept on that side: the analyses do not fit a simple two-component mixing.

**Is my data sent anywhere?** No. Everything is worked out on this page.
