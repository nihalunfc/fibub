---
name: Calibration interval and drift tracker
num: 691
shelf: science
section: metrology-and-quality
title: "Calibration interval calculator: instrument drift rate, prediction interval and next due date from calibration history"
summary: "Paste or open an instrument's calibration history (date, as-found error, uncertainty) and get the drift rate by regression with its confidence interval, a prediction band, the date the error is expected to reach the tolerance limit, and a calibration interval that meets your reliability target, with optional guard banding."
status: live
ads: true
order: 691
icon: calendar
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, calibration-curve, control-charts, trend-analyser, gauge-rr, sensor-calibration, westgard-qc]
sources:
  - "Least-squares straight line with its prediction interval and the t distribution (standard regression results, e.g. Montgomery and Runger, Applied Statistics and Probability for Engineers)."
  - "The reliability-target approach to calibration intervals follows the ideas in NCSL International RP-1 and ILAC-G24 / OIML D 10 (guidance on the determination of calibration intervals), described in fibub's own words; no text or tables copied."
  - "Checked against scipy.stats.linregress, scipy.stats.t and scipy.optimize.brentq; no code copied. The example history is made up by fibub."
flow:
  - { icon: table, label: "History" }
  - { icon: curve, label: "Drift" }
  - { icon: target, label: "Limit" }
  - { icon: calendar, label: "Due date" }
---

## What it does

Instruments drift. A pressure transmitter, a balance, a thermometer or a torque wrench reads a little further from the truth every month, and the calibration interval decides how far it can wander before someone checks it. Too short wastes money; too long risks measuring with an out-of-tolerance instrument and having to recall the work done with it.

This tool takes the **calibration history** of one instrument and:

- fits a **straight-line drift** of the as-found error against time, with the drift rate's confidence interval and a test of whether the drift is real;
- draws the **prediction band** for the next as-found error;
- finds the date when the drift line, and the prediction band, reach the **tolerance limit**;
- suggests the **next calibration date** that keeps the chance of still being in tolerance at your **reliability target** (for example 95 %), using the t distribution of the prediction;
- optionally applies a **guard band**, pulling the limits in by the latest calibration uncertainty.

Nothing is stored or sent: the history stays on this page and is gone when you close it.

Build each calibration from standards with the [[calibration-curve|calibration curve tool]], and watch day-to-day results with [[control-charts|control charts]].

## How to use it

1. **Paste or open the history**: date, as-found error (reading minus reference, before adjustment) and the expanded uncertainty U of each calibration (optional, drawn as error bars and used for guard banding).
2. **Enter the tolerance limits** (one is enough if the error can only go one way).
3. **Choose the reliability target**: 95 % is common for general instruments; critical ones often use 99 %.
4. Read the suggested date and the facts. "Check an interval" shows the chance of being in tolerance after any interval you are considering.

## Worked example

The made-up history of a pressure transmitter has 9 calibrations from 2019-03-12 to 2024-02-21, with as-found errors rising from 0.01 to 0.19 kPa and U = 0.03 kPa; the tolerance is ±0.25 kPa. The drift is **+0.0361 kPa per year** (95 % CI +0.0308 to +0.0413), clearly significant, with a scatter of s = 0.0106 kPa about the line. The line itself reaches +0.25 kPa on 2025-11-08, but the 95 % prediction band reaches it on 2024-12-20. For 95 % reliability the **next calibration is due by 2025-02-18**, 11.9 months after the last. After 12 months the chance of being in tolerance is 94.9 %, with a predicted error of 0.224 kPa.

## Tips

- Use as-found values only, and only since the last adjustment; an adjustment resets the drift.
- With fewer than 5 calibrations, the prediction band is wide and the interval short. That is the honest answer: the data do not yet support a long interval.
- If the drift is not significant, the interval is limited by the scatter. Consider a longer interval only if many instruments of the same type behave the same way.

## FAQ

**Why does the prediction band reach the limit before the line?** The band includes the uncertainty of the fitted line and the scatter of single calibrations; the reliability target is applied to that, not to the line alone.

**Does it save my instruments?** No. Nothing is saved in your browser or sent anywhere. Download the CSV or report to keep a record.

**Is the interval method official?** It follows the reliability-target idea used in calibration interval guidance, but your quality system decides. For study and planning, not a substitute for professional judgement.
