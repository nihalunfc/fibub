---
name: Pendulum lab analyser
num: 902
shelf: science
code: T637
section: classical-mechanics
title: "Pendulum g calculator: fit g from period and length data, with the large-angle correction"
summary: "Paste your pendulum lengths and periods (or times for 10 swings) and get g with its uncertainty from a straight-line fit of T² against L, the exact correction for large swings, an optional unknown-length offset, residuals, and how far the small-angle formula is off at any amplitude."
status: live
ads: true
order: 2
icon: clock
works: offline
updated: 2026-11-09
related: [projectile-drag, uncertainty-calculator, calibration-curve, plot-maker, trend-analyser, video-motion-tracker, coupled-oscillators, moment-of-inertia, lagrangian-helper]
sources:
  - "Simple pendulum period, the exact large-amplitude period 4√(L/g) K(sin(θ₀/2)) and its series 1 + θ₀²/16 + 11θ₀⁴/3072: standard classical mechanics results. Complete elliptic integral by the arithmetic-geometric mean (Abramowitz and Stegun, 17.6)."
  - "Least squares with and without an intercept, standard errors and Student t intervals: standard statistics."
  - "Checked against SciPy (ellipk, linregress, Student t quantiles), NumPy least squares with the full covariance matrix, and a SymPy series expansion."
  - "The example measurements are made up."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sliders, label: "Amplitude" }
  - { icon: chart, label: "Fit T² vs L" }
  - { icon: target, label: "g ± u" }
---

## What it does

The simple pendulum is the classic way to measure the strength of gravity in a school or university lab. For small swings its period is **T = 2π√(L/g)**, so a graph of **T² against L** is a straight line through the origin with slope 4π²/g. This analyser fits that line to your measurements by least squares and gives **g with its standard uncertainty and a 95 % interval**, the residuals, and how your value compares with the one you expect.

It also handles the two things that most often spoil a pendulum result:

- **Large swings.** The small-angle formula is only approximate: at 15° the true period is 0.43 % longer, at 30° 1.74 %. If you give the amplitude, each period is corrected with the exact formula (the complete elliptic integral) before fitting.
- **An unknown length offset.** If you measured to the top of the bob, or the pivot point is uncertain, choose the fit with an extra length δ. It fits T² = 4π²(L + δ)/g, so the offset no longer biases g, and it tells you δ.

Get your swing times from a phone video with the [[video-motion-tracker]], and for a physical pendulum work out its inertia with the [[moment-of-inertia|moment of inertia calculator]].

## How to use it

1. Paste or type one line per length: **length, period** and optionally the **amplitude in degrees**. A header line is fine, and you can open a CSV or Excel file.
2. Choose the **length unit**.
3. If you timed several swings at once (much more accurate), type how many in **full swings** and paste the total times.
4. Give an **amplitude** for rows that have none, or 0 for no correction.
5. Choose the **fit**: through the origin, or with the unknown extra length.
6. The **expected g** is only for comparison (about 9.78 at the equator to 9.83 at the poles, rounded).

The second card is a **large-angle calculator**: for any length and amplitude it shows the small-angle period, the exact period and the series approximation, and a table of the error at amplitudes from 2° to 120°.

## Worked example

The made-up example has six lengths from 0.2 m to 1.2 m, each swung at **15°**. Fitting through the origin, the page shows **g = 9.825 ± 0.017 m/s²** (95 % interval 9.7819 to 9.8685), R² = 0.999924 and an rms period scatter of 5.3 ms. It is +0.15 % from 9.81, within two uncertainties. Without the amplitude correction the same data give **9.7411**: the 15° swing alone moves g by 0.86 %. Switching to the fit with an extra length gives g = 9.827 ± 0.043 m/s² and δ = 0.157 ± 3.4 mm, consistent with zero, so the lengths were measured correctly. In the correction card, a 1 m pendulum at 30° has a small-angle period of 2.0061 s and an exact period of **2.0410 s**, 1.74 % longer.

## Tips

- Time 10 or 20 swings and start counting from "zero" as the bob passes the lowest point, where it moves fastest and the moment is sharpest.
- Measure the length to the **centre** of the bob. If you cannot, use the offset fit.
- Keep the amplitude below about 10°, or record it, and use a dense, small bob so air drag is small.
- If the residuals curve rather than scatter, look for a length-dependent error such as a stretchy string.

## FAQ

**Why fit T² and not T?** T² is proportional to L, so the graph is a straight line whose slope gives g directly.

**How big is the large-angle effect?** About θ₀²/16 (θ₀ in radians): 0.05 % at 5°, 0.19 % at 10°, 1.7 % at 30° and 18 % at 90°.

**What about a real (physical) pendulum?** A large bob or a heavy rod changes the effective length. For a sphere of radius r on a light string, the length becomes L + 2r²/5L; this tool treats the bob as a point.
