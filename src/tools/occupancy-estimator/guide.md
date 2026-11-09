---
name: Occupancy estimator
num: 307
shelf: science
section: ecology
title: "Occupancy calculator: estimate site occupancy (psi) and detection probability (p) from repeated surveys"
summary: "Paste detection histories from repeated surveys of your sites and get the single-season occupancy ψ and detection probability p by maximum likelihood (MacKenzie et al. 2002), with confidence intervals, naive versus estimated occupancy, a comparison of constant and survey-specific detection, and how many surveys you need."
status: live
ads: true
order: 307
icon: eye
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, sample-size, uncertainty-calculator]
sources:
  - "Method: D. I. MacKenzie, J. D. Nichols, G. B. Lachman, S. Droege, J. A. Royle and C. A. Langtimm (2002), Estimating site occupancy rates when detection probabilities are less than one, Ecology 83: 2248-2255; D. I. MacKenzie et al., Occupancy Estimation and Modeling (2006) for the conditional occupancy of never-detected sites. Formulas only; no tables are copied."
  - "Checked in the tests against an independent Python fit (SciPy 1.x optimize.minimize with BFGS, a finite-difference Hessian and scipy.stats.norm) of the same data."
  - "The example detection histories are made up."
flow:
  - { icon: table, label: "Histories" }
  - { icon: eye, label: "Detection" }
  - { icon: target, label: "Occupancy" }
  - { icon: download, label: "Report" }
---

## What it does

Not finding a species at a site does not mean it is absent: it may simply have been missed. If you visit each site more than once, the pattern of detections and non-detections tells you how often the species is missed when it is there. This tool fits the single-season occupancy model of MacKenzie et al. (2002) to estimate:

- **Occupancy ψ** (psi): the share of sites the species really occupies.
- **Detection probability p**: the chance of detecting it in one survey of an occupied site.

It compares the estimate with the **naive occupancy** (sites where it was seen ÷ all sites), which is always too low when p is below 1, and it works out how likely each never-detected site is to hold the species anyway.

## How to use it

1. Paste one row per site: an optional **site name**, then **1** (detected) or **0** (not detected) for each survey. Use **-** or **NA** for a survey that was not done; it is left out of that site's likelihood. Compact rows like 0101 also work, and you can open a CSV or Excel file.
2. Choose the **detection model**: the same p for every survey, ψ(.)p(.); a different p for each survey, ψ(.)p(t), useful when surveys differ in weather, season or method; or **Best by AIC**.
3. Choose the **confidence** level. Intervals are worked out on the logit scale, so they stay between 0 and 1.
4. Download the estimates and each site's chance of being occupied as CSV, or the report as an image, PDF or Word file.

## Assumptions

Sites are closed for the season (a site occupied in one survey is occupied in all), detections are not false positives, and sites are independent. Detection is the same at every site (no site covariates in this tool).

## Worked example

The example is 30 made-up sites, each surveyed 4 times, with 3 surveys missed. The species was detected at 15 sites, so naive occupancy is 0.500. The constant-detection model has the lower AIC (121.50, against 123.81 for survey-specific detection, ΔAIC 2.31), and the page shows **ψ = 0.592 (95 % CI 0.353 to 0.794); naive 0.500**. Detection per survey is p = 0.378 (0.241 to 0.539), so an occupied site has a 0.851 chance of being detected at least once in 4 surveys. Each never-detected site still has a 0.178 to 0.258 chance of holding the species (higher where a survey was missed), giving 17.75 expected occupied sites. The chart shows that 7 surveys would be needed for a 95 % chance of detecting the species where it is present.

## Tips

- Plan enough surveys: with p around 0.3 to 0.5, three to six visits per site are typical.
- If ψ comes out at the edge (near 1), the species was found almost everywhere and the standard error is not reliable; the page warns you.
- Keep the survey order the same for every site when using the survey-specific model.

## Frequently asked questions

**Can I add site or survey covariates?** Not in this tool; for covariates use R (unmarked) or the free program PRESENCE.

**What if some sites have fewer surveys?** Mark the missing surveys with - or NA. A site needs at least one survey to count.

**Is my data sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
