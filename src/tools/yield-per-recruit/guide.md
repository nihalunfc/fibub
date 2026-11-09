---
name: Yield per recruit and MSY calculator
num: 341
shelf: science
section: fisheries-science
title: "Yield per recruit and MSY calculator: Beverton-Holt F0.1 and Fmax, Schaefer and Fox surplus production models fitted to catch and CPUE"
summary: "Work out Beverton-Holt yield per recruit against fishing mortality and age at first capture, with the reference points F0.1 and Fmax. Then get MSY, BMSY and FMSY from the Schaefer or Fox surplus production model, from your own r and K or fitted to a series of catches and CPUE."
status: live
ads: true
order: 341
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, binding-curve-fitter, sample-size]
sources:
  - "Yield per recruit: R. J. H. Beverton and S. J. Holt (1957), On the Dynamics of Exploited Fish Populations; F0.1: J. A. Gulland and L. K. Boerema (1973). Surplus production: M. B. Schaefer (1954); W. W. Fox (1970), in the Gompertz form rB ln(K/B); observation-error fitting as in M. Hilborn and C. J. Walters (1992), Quantitative Fisheries Stock Assessment, and M. Haddon, Modelling and Quantitative Methods in Fisheries. Method only; no stock data copied."
  - "Checked in the tests against SciPy: yield per recruit by numerical integration of the cohort (scipy.integrate.quad), Fmax and F0.1 by scipy.optimize, and the Schaefer and Fox fits by scipy.optimize.minimize on the same likelihood. All example values are made up."
flow:
  - { icon: sliders, label: "Parameters" }
  - { icon: curve, label: "Yield/R" }
  - { icon: target, label: "F0.1, Fmax" }
  - { icon: chart, label: "MSY" }
---

## What it does

Two classic ways to ask "how hard should this stock be fished?".

**Yield per recruit (Beverton-Holt).** Follow one batch of recruits through life: each year some die naturally (rate M), some are caught (rate F, from the age at first capture tc), and the survivors grow along a von Bertalanffy curve. Fish too lightly and most die of natural causes; fish too hard and they are caught before they have grown. The tool works out the total weight caught per recruit with Beverton and Holt's formula and gives:

- **Fmax**, the fishing mortality that gives the most yield per recruit;
- **F0.1**, the fishing mortality where the curve's slope has fallen to 10 % of its slope at the origin. It gives almost as much yield as Fmax for much less fishing, and is a common precautionary target;
- yield per recruit against F for your tc and one year either side, and against tc at the current F, with the **best age at first capture**.

**Surplus production (Schaefer and Fox).** A stock of biomass B grows by a surplus that is zero when the stock is empty and when it is at its carrying capacity K, and largest in between. Catching exactly that surplus each year is sustainable; the largest such catch is the **maximum sustainable yield (MSY)**, taken at biomass **BMSY** with harvest rate **FMSY**.

- **Schaefer**: surplus = rB(1 − B/K); MSY = rK/4, BMSY = K/2, FMSY = r/2.
- **Fox** (Gompertz form): surplus = rB ln(K/B); MSY = rK/e, BMSY = K/e (37 % of K), FMSY = r.

Give r and K yourself, or **fit** them to a series of yearly catches and a CPUE index: the tool runs the biomass forward from the first year, B(t+1) = B(t) + surplus − catch, and finds the r, K and catchability q (CPUE = q × B) that best match the CPUE on a log scale.

## How to use it

1. **Yield per recruit**: type M, the growth parameters K, t₀ and W∞, the ages at recruitment, first capture and the maximum age (blank for none), and the current F. Yield per recruit comes out in W∞'s unit.
2. **Surplus production**: choose Schaefer or Fox, then either type r and K, or paste one row per year of year, catch and CPUE (leave CPUE blank in years without it). If the stock was already fished before the first year, set the first-year biomass below 1 × K.

## Worked example (made-up values)

With M = 0.3, K = 0.25, t₀ = −0.5, W∞ = 2,500 g, tr = 1, tc = 3 and tλ = 15, **F0.1 = 0.332** (260.4 g per recruit) and **Fmax = 1.07** (297.4 g per recruit). The current F of 0.5 is 1.51 × F0.1 and gives 283.4 g per recruit; at that F the best age at first capture would be about 3.2 years.

The made-up 20-year series of catches (rising to 1,250 t, then falling to 550 t) and CPUE fitted by the Schaefer model gives r = 0.338 and K = 11,503 t, so **MSY = 973 t, BMSY = 5,752 t and FMSY = 0.169**. Biomass at the start of 2025 is 8,666 t, 1.51 × BMSY, and the 2024 harvest rate of 0.065 is 0.38 × FMSY. The Fox model on the same data gives MSY 1,163 t at a lower BMSY of 4,580 t.

## Tips

- Yield per recruit ignores recruitment: fishing at Fmax can shrink spawning stock so much that recruits fall. That is why F0.1 is preferred.
- Surplus production fits need contrast: a CPUE series that falls as catches rise and recovers as they fall. A flat CPUE with steady catches cannot tell r from K.
- r and K are strongly correlated in fits; MSY is usually better determined than either.

## FAQs

**Are there confidence intervals for the fitted MSY?** Not here. Fits like these are usually given intervals by bootstrapping, which this tool does not do.

**Which model should I use?** Schaefer puts BMSY at half of K, Fox at 37 %. Compare their fits and treat the difference as part of the uncertainty.

**Is my data uploaded?** No. Everything runs in your browser.
