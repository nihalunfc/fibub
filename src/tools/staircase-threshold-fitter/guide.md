---
name: Staircase and threshold fitter
num: 725
shelf: science
section: psychology-and-psychometrics
title: "Psychometric function fitter and adaptive staircase simulator: threshold with bootstrap CI (free)"
summary: "Simulate or run 1-up-2-down, 1-up-3-down and weighted staircases, then fit a logistic, Weibull or cumulative normal psychometric function with guess and lapse rates by maximum likelihood. Get the threshold with a bootstrap 95 % interval."
status: live
ads: true
order: 725
icon: curve
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, plot-maker, dose-response]
sources:
  - "Methods: Levitt (1971) transformed up-down rules; Kaernbach (1991) weighted up-down; Wichmann and Hill (2001) maximum likelihood fitting with lapse rate and parametric bootstrap."
  - "All example data are made up or simulated in the page."
flow:
  - { icon: sliders, label: "Staircase" }
  - { icon: curve, label: "Fit curve" }
  - { icon: target, label: "Threshold" }
  - { icon: download, label: "Report" }
---

## What it does

In psychophysics a **threshold** is the stimulus level a person detects or discriminates on a set share of trials, such as 75 % correct. **Adaptive staircases** find it quickly by making the task harder after correct answers and easier after mistakes. A **psychometric function** fitted to the trials then gives the threshold and the slope with proper error bars. This tool does both: it simulates staircases so you can see how the rules behave, lets you run a real brightness staircase on yourself, and fits any trial data you paste. Nothing is uploaded.

## How to use it

1. Choose **Simulate**, **Try it yourself** or **Fit my data**.
2. **Staircase settings** (simulate and try): the rule, the start level, the step down and step up, whether steps are added or multiplied (log steps, for contrast or intensity), the number of trials and the allowed range. "Halve the steps" makes the staircase settle more finely after the 2nd and 4th reversal (a reversal is a change of direction).
3. **Simulated observer:** the true threshold α, slope β, guess rate γ and lapse rate λ. The simulation shows how close the reversal mean and the fit come to the truth. Change the seed for a fresh run.
4. **Try it yourself:** two grey squares flash and you say which was lighter, with the arrow keys or the buttons. The level is the grey-value difference.
5. **Fit my data:** paste one row per trial (level, 1 or 0) or one row per level (level, number correct, number of trials), or open a CSV or Excel file.
6. **Fit settings:** the curve shape, the guess rate (0.5 for two choices, 1/m for m choices, 0 for yes/no detection), the lapse rate (fixed, or fitted between 0 and 10 %), the % correct that defines the threshold, and the number of bootstrap samples.

## What the numbers mean

- **Threshold:** the level where the fitted curve reaches your % correct. The **95 % interval** comes from a parametric bootstrap: new data are drawn from the fitted curve at your levels and trial numbers, refitted, and the middle 95 % of the thresholds is kept.
- **α and β:** the curve's position and steepness. For the logistic and normal shapes α is the midpoint of the rising part; for the Weibull it is the scale.
- **Deviance:** how far the data are from the curve; roughly, a deviance much larger than its degrees of freedom suggests a poor fit or changing performance.
- **Reversal mean:** the classic quick estimate from a staircase, the average level at the last reversals. A 1-up-2-down staircase aims at 70.7 % correct and 1-up-3-down at 79.4 % (Levitt); a weighted 1-up-1-down aims at step up ÷ (step up + step down).

## Worked example

The "Fit my data" example is a made-up two-choice experiment with 40 trials at each of 8 levels. With a logistic shape, γ = 0.5 and λ fixed at 0, the fit gives α = 4.086 and β = 0.7856, so the **75 % threshold is 4.086**, with a bootstrap interval of about 3.3 to 4.8. The deviance is 2.413 on 6 degrees of freedom, a good fit. Ticking "Fit the lapse rate" gives λ = 0.0397 and moves the threshold to 3.996, because the three top levels sit at 95 % rather than 100 %.

## Tips

- Use multiplied (log) steps for contrast, intensity or duration, where equal ratios matter more than equal differences.
- Staircase data cluster near the target, so the slope is often uncertain. Mix in a few easy trials, or run several interleaved staircases, if you need the slope.
- Fix the lapse rate at a small value (0.01 to 0.02) when you have few trials; fitting it needs plenty of trials at easy levels.

## Frequently asked questions

**Which shape should I use?** The threshold rarely changes much. The Weibull is common for contrast and needs levels above 0; the logistic or normal suit levels in dB or log units.

**Is the brightness test accurate?** No: screens differ, and brightness is not calibrated. It is there to show how a staircase feels and behaves.

**Was the fit checked?** Yes: against SciPy's optimiser on the same likelihood, to six decimal places, and the bootstrap against a NumPy bootstrap.
