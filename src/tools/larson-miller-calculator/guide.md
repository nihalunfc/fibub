---
name: Larson-Miller creep calculator
num: 849
shelf: science
code: T585
section: mechanical-behaviour
title: "Larson-Miller calculator: creep-rupture master curve, rupture life, Sherby-Dorn, Manson-Haferd and Norton creep law"
summary: "Paste or open creep-rupture tests (temperature, stress, hours) and fit a Larson-Miller master curve with C = 20 or your own C. Predict rupture life and the stress for a design life, compare with Sherby-Dorn and Manson-Haferd, and fit Norton's creep law (n and Q) from minimum creep rates."
status: live
ads: true
order: 849
icon: clock
works: offline
updated: 2026-11-09
related: [stress-strain-analyser, fatigue-sn-calculator, fracture-toughness-calculator, curve-fitter, unit-converter]
sources:
  - "The Larson-Miller, Sherby-Dorn and Manson-Haferd parameters and Norton's law are the textbook forms (Dieter, Mechanical Metallurgy, chapter 13; Dowling, Mechanical Behavior of Materials, chapter 15), written by fibub and checked in the tests against NumPy (polyfit, lstsq) and SciPy (minimize_scalar, Nelder-Mead, brentq)."
  - "The example creep-rupture and creep-rate data are made up by the page from a chosen master curve and Norton law with random scatter; they are not data for any real alloy."
  - "Your data is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Rupture data" }
  - { icon: curve, label: "Master curve" }
  - { icon: clock, label: "Life" }
  - { icon: chart, label: "Norton" }
---

## What it does

Creep tests at high temperature take months or years. To design a boiler tube or turbine part for 100 000 hours, engineers run shorter tests at higher temperatures and combine them with a **time-temperature parameter**: one number that mixes temperature and time so that all tests at the same stress fall on one **master curve**. This page:

- fits the **Larson-Miller parameter** LMP = T (C + log₁₀ t), with T in kelvin and t in hours, as a straight line, quadratic or cubic in log₁₀ σ. C = 20 is the usual convention; the page also finds the C that fits your own data best.
- fits two other classic parameters for comparison: **Sherby-Dorn** P = log₁₀ t − Q/(2.303 RT), with an activation energy Q, and **Manson-Haferd** P = (T − Ta)/(log₁₀ t − log₁₀ ta), whose constants are the point where the lines of equal stress meet. You can type the constants or let the page fit them.
- predicts the **rupture life** at any temperature and stress and the **stress for a design life**, by all three methods side by side.
- fits **Norton's creep law** ε̇ = A σⁿ exp(−Q/RT) to minimum (steady-state) creep rates, giving the stress exponent n and, with tests at two or more temperatures, the activation energy Q.

Each fit reports its scatter as the standard deviation of log₁₀ t between the tests and the curve, so you can see which parameter describes your data best.

Check the short-term strength from a tensile test with the [[stress-strain-analyser|stress-strain curve analyser]], and the effect of cycling loads with the [[fatigue-sn-calculator|fatigue S-N calculator]].

## How to use it

1. Paste temperature, stress and rupture time in hours, or open a CSV or Excel file. Choose °C or K.
2. Pick the polynomial. A quadratic suits most data; use a straight line for few tests.
3. Read the master curve, the best-fit C and the comparison table. The plot shows stress against LMP ÷ 1000, coloured by temperature: points from different temperatures should fall on one curve.
4. Type a temperature, stress and design life to get predictions.
5. For creep rates, paste stress, temperature and minimum creep rate.

## Worked example

The example has 12 made-up tests at 600, 650 and 700 °C. With C = 20 and a quadratic, the master curve is LMP = 26 056 + 1235.8 x − 1383.7 x² (x = log₁₀ σ) with a scatter of **0.077** in log t. The best-fit C is **19.50** (scatter 0.076). Sherby-Dorn fits Q = 417 kJ/mol (scatter 0.077) and Manson-Haferd Ta = 500.8 K, log ta = 14.89 (scatter 0.075).

At 650 °C and 120 MPa, Larson-Miller predicts **33 784 h**, Sherby-Dorn 32 579 h and Manson-Haferd 32 647 h. For a design life of 100 000 h at 600 °C, Larson-Miller allows **178.1 MPa**.

The made-up creep rates give **n = 5.07** and **Q = 284 kJ/mol** (they were drawn with n = 5 and Q = 280 kJ/mol), typical of dislocation creep.

## Tips

- Use only tests that failed by creep (not by oxidation or a test fault), and one heat or product form at a time.
- Extrapolating more than about three times beyond your longest test is risky. Compare the three methods: if they disagree, be cautious.
- Design codes usually take the stress for rupture in 100 000 h, divide by a safety factor, and use the lower bound of the scatter, not the mean.
- n near 1 means diffusion creep; 3 to 8, dislocation creep. A change in n with stress means a change in mechanism, so fit each regime separately.

## FAQ

**Why is C about 20?** Larson and Miller found that, for many steels, lines of equal stress on a plot of log t against 1/T meet near log t = −20 at 1/T = 0. Fitting C to your own data is better when you have enough tests.

**Do I need hours?** Yes, for the parameters: the constants C and log ta depend on the time unit. For Norton's law any rate unit works.

**Is my data uploaded?** No. Everything runs on this page.
