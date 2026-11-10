---
name: Counting statistics helper
num: 950
shelf: science
code: T685
section: nuclear-and-particle-physics
title: "Radiation counting statistics: net count rate, Currie detection limit, MDA, dead time and counting time"
summary: "For Geiger, scintillation and gamma counting: subtract the background with the right uncertainty, decide whether anything was detected (Currie's decision threshold L_C and detection limit L_D), get the activity and minimum detectable activity, exact Poisson limits, dead-time corrections for both detector models, and the best split of counting time."
status: live
ads: true
order: 6
icon: sigma
works: offline
updated: 2026-11-09
related: [decay-calculator, decay-chain, uncertainty-calculator, gamma-shielding, spectrum-peak-fitter, hypothesis-tests, distribution-explorer, sample-size]
sources:
  - "Currie, L. A. (1968), Limits for qualitative detection and quantitative determination, Analytical Chemistry 40, 586 to 593 (decision threshold and detection limit formulas)."
  - "Poisson counting, dead-time models and optimum counting-time division: standard results, for example Knoll, G. F., Radiation Detection and Measurement. Exact Poisson limits: Garwood, F. (1936), Biometrika 28, 437."
  - "Checked against SciPy (normal and chi-square quantiles, Lambert W, root finding) and against Currie's paired-blank forms L_C = 2.33 √B and L_D = 2.71 + 4.65 √B, in tests written for this page."
  - "The example counts are made up."
flow:
  - { icon: calculator, label: "Counts" }
  - { icon: sigma, label: "Net rate" }
  - { icon: target, label: "Detected?" }
  - { icon: clock, label: "Dead time" }
---

## What it does

Radioactive decay is random, so every count has an uncertainty: for N counts the standard deviation is √N. This page does the everyday sums of a counting lab with that in mind.

1. **Net counts and detection limit.** From gross counts (sample plus background) and a separate background count, it gives the net rate with its uncertainty, √(G/t_g² + B/t_b²), and **Currie's** two limits. The **decision threshold** L_C is the net count above which you say "detected", with a false-positive rate α. The **detection limit** L_D is the true net count you would detect with probability 1 − β. With a counting efficiency it also gives the activity and the **minimum detectable activity** (MDA). Exact Poisson limits are shown for the gross and background counts.
2. **Dead-time correction.** A detector is blind for a short time τ after each event. The page corrects a measured rate with the **non-paralysable** model, n = m / (1 − mτ), and the **paralysable** one, m = n e^(−nτ) (solved with the Lambert W function), and plots both.
3. **Counting-time planning.** For expected gross and background rates, the best split of a fixed time is t_sample / t_background = √(R_gross / R_background); the page gives that split, the uncertainty it reaches, and the total time for the uncertainty you want.

Fit the peaks in your gamma spectrum with the [[spectrum-peak-fitter|spectrum peak fitter]], and follow the activity through time with the [[decay-chain|decay chain calculator]].

## How to use it

Type the counts and times (in seconds, minutes or hours; the same unit for both), and optionally the efficiency (counts per particle emitted) and the emission yield (particles per decay). Pick α and β (5 % each is usual) and the confidence for the intervals. The other two cards work on their own.

## Worked example

A made-up sample gives **1,500 counts in 600 s**; the background gives **900 counts in 1,800 s**. The net rate is **2 ± 0.067 per s**, 3.33 %. With no activity, the net count in 600 s would scatter with σ₀ = 20 counts, so L_C = **32.9** and L_D = **68.5 net counts**; the 1,200 net counts are far above L_C, so the page says **detected**. At 25 % efficiency the activity is **8 ± 0.27 Bq** and the MDA is **0.4567 Bq** (27.4 dpm).

A counter reading **20,000 per s** with a **5 µs** dead time is busy 10 % of the time: the true rate is 22,222 per s (non-paralysable) or 22,367 per s (paralysable). With rates of 2.5 and 0.5 per s and 2,400 s in all, count the sample for 1,658 s and the background for 741.6 s to reach 2.34 %; reaching 1 % needs 13,090 s.

## Tips

- Count the background for at least as long as the sample when the sample is weak; the split rule tells you how much longer.
- L_C is for deciding about this measurement; L_D (and the MDA) describe what the method can detect, before you measure.
- Keep dead-time losses below about 10 % when you can; the two models start to disagree above that.

## FAQ

**Why do two "detected" numbers exist?** L_C controls false alarms; L_D controls missed detections. A true signal exactly at L_C would be missed half the time, so L_D is about twice as large.

**Is the normal approximation good enough?** For a few tens of counts or more, yes. For very small counts the exact Poisson limits shown for the gross and background counts are safer.

**Is this enough for a regulatory report?** No. It covers Poisson statistics only. It is for study and planning, not a substitute for professional judgement or your laboratory's validated procedures.
