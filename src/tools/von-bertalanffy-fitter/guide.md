---
name: Von Bertalanffy growth fitter
num: 340
shelf: science
section: fisheries-science
title: "Von Bertalanffy growth curve fitter: L∞, K and t0 from fish length-at-age, with confidence intervals, Ford-Walford plot and φ'"
summary: "Fit the von Bertalanffy growth curve to fish length-at-age data by nonlinear least squares. Get L∞, K and t₀ with standard errors and 95 % intervals, the growth performance index φ', a Ford-Walford plot and charts. Paste ages and lengths or open a CSV or Excel file."
status: live
ads: true
order: 340
icon: curve
works: offline
updated: 2026-11-09
related: [binding-curve-fitter, calibration-curve, trend-analyser, fish-length-weight, yield-per-recruit, curve-fitter, growth-curve-tracker, cpue-trend]
sources:
  - "Von Bertalanffy growth function L(t) = L∞(1 − e^(−K(t − t0))) (L. von Bertalanffy 1938; R. J. H. Beverton and S. J. Holt 1957); Ford-Walford plot (E. Ford 1933; L. A. Walford 1946); growth performance index φ' = log10 K + 2 log10 L∞ (D. Pauly and J. L. Munro 1984, Fishbyte 2: 21). Method only."
  - "Fitting by Levenberg-Marquardt with standard errors from s²(JᵀJ)⁻¹. Checked in the tests against SciPy's scipy.optimize.curve_fit (parameters, standard errors, t intervals) and scipy.stats.linregress (Ford-Walford line). The example fish are made up."
flow:
  - { icon: table, label: "Ages" }
  - { icon: curve, label: "Fit curve" }
  - { icon: sigma, label: "L∞ and K" }
  - { icon: chart, label: "Walford" }
---

## What it does

Most fish grow fast when young and slow down as they approach a maximum size. The **von Bertalanffy growth function** describes this:

L(t) = L∞ × (1 − e^(−K (t − t₀)))

- **L∞** is the asymptotic length, the mean length fish would reach if they lived for ever.
- **K** is the growth coefficient (per year): how quickly length approaches L∞. A fish covers about half the distance to L∞ in ln 2 ÷ K years.
- **t₀** is the theoretical age at which length would be zero; usually slightly negative and of little biological meaning.

The tool fits the curve to your fish by **nonlinear least squares** (Levenberg-Marquardt) and gives each parameter with its **standard error** and **95 % interval** (Student's t). It also gives:

- the **growth performance index φ'** = log₁₀ K + 2 log₁₀ L∞ (L∞ in cm), used to compare growth between stocks and species, because K and L∞ trade off against each other;
- the **Ford-Walford plot**: mean length at age t + 1 against mean length at age t. For von Bertalanffy growth the points lie on a straight line L(t+1) = a + b L(t), giving K = −ln b and L∞ = a ÷ (1 − b), where the line crosses the 1:1 line. It is a quick check and supplies the starting values for the fit.

Get the weight at each length from the [[fish-length-weight|length-weight calculator]], and use the growth curve in the [[yield-per-recruit|yield per recruit calculator]].

## How to use it

1. Paste or open **one row per fish**: age in years and length. Fractional ages are fine.
2. Pick the **length unit** (cm, mm or inches). It labels the results and converts L∞ to cm for φ'.
3. Read L∞, K and t₀, check the curve against the points, and look at the table of mean length by age for systematic misfit.

## Worked example (made-up fish)

Fifty fish aged 1 to 10 years, from 14.7 to 55.3 cm. The fit gives **L∞ = 60.9 cm** (± 3.11; 95 % interval 54.6 to 67.1), **K = 0.212 per year** (± 0.0303; 0.151 to 0.273) and **t₀ = −0.697 years** (± 0.22). The residual standard deviation is 2.45 cm, and **φ' = 2.9**. The Ford-Walford line through the mean lengths at ages 1 to 10, L(t+1) = 12.1 + 0.800 × L(t), gives a close check: L∞ 60.4 cm and K 0.223.

## Tips

- Old, large fish carry most of the information about L∞. With few of them, L∞ is uncertain and strongly correlated with K, which is why φ' is often compared instead.
- Gear that misses small young fish, or only catches the fastest-growing ones, biases the curve. Sample the full size range if you can.
- Compare sexes or stocks by fitting each separately and comparing the intervals.

## FAQs

**Why is t₀ negative?** Larval and juvenile growth does not follow the adult curve, so extrapolating back to length 0 rarely lands at age 0.

**Can I fit weight at age?** Not here; weight follows a related curve with an exponent of about 3.

**Is my data uploaded?** No. Everything runs in your browser.
