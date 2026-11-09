---
name: Uncertainty propagation calculator
num: 25
shelf: science
section: general-physics-lab-helpers
title: "Uncertainty propagation calculator (GUM method, with a Monte Carlo check)"
summary: "Type your formula and your measurements with their uncertainties, or paste repeated readings. Get the result with its uncertainty, which input matters most, and a Monte Carlo check."
status: live
ads: true
order: 10
icon: sigma
works: offline
updated: 2026-11-08
related: [calibration-curve, plot-maker, dose-response]
sources:
  - "Method: the GUM (JCGM 100:2008) and its Monte Carlo supplement (JCGM 101:2008), free from BIPM."
flow:
  - { icon: pencil, label: "Formula" }
  - { icon: ruler, label: "Measurements" }
  - { icon: sigma, label: "Result ± u" }
  - { icon: chart, label: "Check" }
---

## What it does

Every lab report needs it: you measured some quantities, each with an uncertainty, and you combined them in a formula. How uncertain is the answer? This calculator follows the international rules for it, the *Guide to the Expression of Uncertainty in Measurement* (GUM, JCGM 100:2008). It then checks the answer with a Monte Carlo simulation, as the GUM's Supplement 1 (JCGM 101:2008) recommends. It works for any field: physics, chemistry, biology, engineering or metrology.

For the uncertainty of a result read from a calibration line, use the [[calibration-curve|calibration curve]] tool; to show the error bars, the [[plot-maker]].

## How to use it

1. **Type the formula**, for example `g = 4 pi^2 L / T^2`. You can use + − * / ^, brackets, `pi`, and the functions sin, cos, tan, asin, acos, atan, exp, ln (natural log), log (base 10), sqrt and abs. You can leave out the * (`2 pi r` works). Tick **Angles in degrees** if your angles are in degrees.
2. **Fill in each measurement.** The calculator finds the names in your formula and gives each one a row. Pick the kind of uncertainty you have:
   - **± standard uncertainty:** you know the standard uncertainty (one standard deviation), for example from a calibration certificate that states it at k = 1.
   - **± half-width (even chance):** the true value could be anywhere within ± a, such as the last digit of a ruler or a digital display. The standard uncertainty is a/√3.
   - **± half-width (triangular):** values near the middle are more likely. The standard uncertainty is a/√6.
   - **Repeated readings:** paste all your readings. The mean is used as the value, and the standard error of the mean (s/√n) as its uncertainty, with n − 1 degrees of freedom.
3. **Read the result.** The big line is ready to copy into a report, rounded the usual way (the uncertainty to two significant figures, the value to match). Pick 68 %, 95 % or 99 % coverage.

## What the results mean

- **Standard uncertainty u:** the combined standard uncertainty of the result, from the sensitivity of the formula to each input (its partial derivative) times that input's uncertainty, added in quadrature.
- **Coverage factor k and expanded uncertainty:** u is multiplied by k to give an interval that holds the true value with the chosen probability. When some inputs come from only a few readings, k comes from Student's t with the effective degrees of freedom (Welch-Satterthwaite formula), so it is larger than 2 for 95 %.
- **Where the uncertainty comes from:** each input's share of the total. Improve the input with the biggest share first. Halving a small one changes almost nothing.
- **Monte Carlo check:** 200,000 random sets of inputs are drawn from their own distributions, and the formula is worked out for each. If its interval agrees with the formula method, you can trust the result. If not (very curved formulas, or large relative uncertainties), quote the Monte Carlo interval.

## Worked example

A pendulum 1.000 m long, measured with a ruler read to the nearest millimetre (half-width 0.001 m), swings with periods of 2.01, 2.00, 2.02, 1.99 and 2.01 s. The formula g = 4π²L/T² gives g = 9.81 m/s². The standard uncertainty is 0.050 m/s², and 99 % of it comes from the timing. With only five readings, k at 95 % is 2.84, so g = 9.81 ± 0.14 m/s². The Monte Carlo interval, 9.67 to 9.96, agrees. Timing more swings would help. A better ruler would not.

## Frequently asked questions

**Does it handle correlated inputs?** No. It treats inputs as independent, which is right for most lab work. If two inputs share a calibration, combine them into one input first.

**Why does my result differ from the simple "add the percentages" rule?** The quick rule adds relative uncertainties linearly, which overestimates. The GUM adds them in quadrature and uses the actual sensitivity of your formula.

**Is anything sent anywhere?** No. The maths runs in your browser, and nothing you type leaves your device. The page keeps working offline once it has loaded.

**Units?** Keep each input in consistent units. The result comes out in the units your formula implies.
