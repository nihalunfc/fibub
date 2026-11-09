---
name: Distance sampling
num: 305
shelf: science
section: ecology
title: "Distance sampling calculator: line and point transect density with half-normal and hazard-rate detection functions"
summary: "Estimate animal density from line or point transect distances. Fits half-normal and hazard-rate detection functions by maximum likelihood, picks the best by AIC, and gives the effective strip width or detection radius, density per km² and hectare, and a confidence interval."
status: live
ads: true
order: 305
icon: ruler
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, sample-size, uncertainty-calculator, occupancy-estimator, quadrat-transect-analyser]
sources:
  - "Methods: S. T. Buckland, D. R. Anderson, K. P. Burnham, J. L. Laake, D. L. Borchers and L. Thomas, Introduction to Distance Sampling (Oxford University Press, 2001): detection functions, the likelihood for exact distances, encounter-rate variance, the delta method, the log-normal interval and Satterthwaite degrees of freedom. Hazard-rate model: Hayes and Buckland (1983). Formulas only; no tables are copied."
  - "Checked in the tests against an independent Python fit (SciPy 1.x optimize.minimize, integrate.quad, a finite-difference Hessian and stats.t) of the same data, and against the closed-form half-normal estimate σ² = mean of x² with no truncation."
  - "The examples are made up."
flow:
  - { icon: ruler, label: "Distances" }
  - { icon: curve, label: "Fit g(x)" }
  - { icon: sigma, label: "Density" }
  - { icon: download, label: "Report" }
---

## What it does

In distance sampling you walk a line (or stand at a point) and, for every animal or group you detect, record how far it was from the line or point. Animals far away are more likely to be missed, so a plain count underestimates how many are there. The way detections thin out with distance tells you how many were missed, and this tool turns that into a density.

It fits two standard **detection functions** by maximum likelihood to your exact distances:

- **Half-normal**: g(x) = exp(−x²/2σ²), one parameter.
- **Hazard-rate**: g(x) = 1 − exp(−(x/σ)^−b), with a shape b that allows a flat "shoulder" near the line.

Both assume every animal on the line or point itself is seen (g(0) = 1). From the fit you get the **effective strip width** (lines) or **effective detection radius** (points), the average **detection probability**, and the **density** per km² and per hectare with a log-normal confidence interval (Buckland et al. 2001).

## How to use it

1. Choose **Line transects** or **Point transects**.
2. Paste one row per detection: the name of the line or point, then the distance in metres (perpendicular distance from the line, or straight-line distance from the point). A single column of distances works too. You can also open a CSV or Excel file.
3. For lines, give the **length of each line in km** with the same names. If you give one total length instead, the count variance is assumed Poisson. For points, give the **number of points**; points with no detections count as zeros.
4. Set the **truncation distance w**. Leave it blank to use the farthest detection; trimming the farthest 5 to 10 % of detections usually gives a better fit.
5. Choose the **detection model** (best by AIC, or one of the two) and the **confidence** level.

## What each number means

- **Effective strip width (ESW)**: the half-width of a strip in which, if every animal were seen, you would expect the same count. Density = n ÷ (2 × length × ESW).
- **Effective detection radius**: the same idea for points. Density = n ÷ (number of points × π × EDR²).
- **Encounter rate**: detections per km or per point. Its CV comes from the spread between lines or points when they are named.
- **CI**: log-normal, combining the count and detection-function uncertainty with Satterthwaite degrees of freedom, as in the program Distance.

## Worked example

The line example is made up: six lines totalling 12 km and 61 detections. With w = 50 m, one detection is left out. The half-normal model has the lowest AIC (416.96, against 422.47 for the hazard-rate, ΔAIC 5.51). The page shows **D = 128.9 per km² (95 % CI 91.54 to 181.5)**, or 1.289 per hectare. The effective strip width is 19.4 m ± 1.82 m, so an animal within 50 m has a 0.388 chance of being seen. The encounter rate is 5 per km, with a CV of 12.7 % between lines, and the interval uses 11.7 degrees of freedom.

The point example (also made up) has 26 detections within 80 m at 12 points. The hazard-rate model wins narrowly (ΔAIC 1.06), giving **D = 703.8 per km² (95 % CI 273.2 to 1813)** and an effective detection radius of 31.3 m; the half-normal gives 447.2 per km². When two models fit about equally well but disagree, more detections are needed.

## Tips

- Aim for at least 60 to 80 detections for a reliable detection function.
- Measure distances accurately, especially near the line; rounding to 0 or to round numbers distorts the fit.
- If animals occur in groups, enter one row per group; the density is then of groups, which you multiply by the mean group size.

## Frequently asked questions

**Are adjustment terms or covariates supported?** No. This tool fits the two key functions without adjustment terms, which covers many surveys; for more complex models use the free program Distance or the R package Distance.

**What if animals move away before I see them?** Distance sampling assumes they are recorded at their original position; responsive movement biases the result.

**Is my data sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
