---
name: Tafel corrosion
num: 105
shelf: science
code: T105
section: electrochemistry-and-battery-science
title: "Tafel corrosion"
summary: "Paste or open a potentiodynamic polarisation scan for Ecorr, icorr and both Tafel slopes by Tafel extrapolation, a Wagner–Traud fit and Stern–Geary (Rp), then the corrosion rate in mm/y and mpy by ASTM G102. Also works out weight-loss coupon rates."
status: live
ads: true
order: 5
icon: chart
works: offline
updated: 2026-11-08
related: [nernst-calculator, electroplating-calculator, cyclic-voltammetry, battery-cycling-analyser, impedance-fitter]
sources:
  - "Rate formula and equivalent weights: ASTM G102 and ASTM G1/G31 methods."
  - "Metal densities: CRC Handbook values."
flow:
  - { icon: table, label: "Scan" }
  - { icon: ruler, label: "Tafel lines" }
  - { icon: target, label: "icorr" }
  - { icon: calculator, label: "mm/year" }
---

## What it does

A metal corroding in a liquid is a short-circuited cell: the metal dissolves (the anodic reaction) as fast as something else, often oxygen or hydrogen ions, is reduced (the cathodic reaction). The current that flows between them, the corrosion current, cannot be measured directly. A polarisation scan pushes the potential a little either side of the corrosion potential, and the shape of the curve reveals it.

From your scan the tool gives three estimates side by side:

- **Tafel extrapolation.** Far enough from the corrosion potential, each branch is a straight line of potential against log current. The tool fits both lines between the two distances you set, and their crossing gives Ecorr and icorr. The slopes are the Tafel constants βa and βc in mV per decade.
- **Wagner–Traud fit.** The whole curve within ±250 mV is fitted with i = icorr[10^(η/βa) − 10^(−η/βc)], which uses the curved part near Ecorr as well.
- **Stern–Geary.** The slope of potential against current within ±10 mV of Ecorr is the polarisation resistance Rp, and icorr = B/Rp with B = βaβc/(2.303(βa + βc)).

The corrosion rate then follows from Faraday's law as written in **ASTM G102**: CR (mm/y) = 3.27 × 10⁻³ × icorr (µA/cm²) × EW / ρ, with the equivalent weight and density of the metal (11 metals and alloys listed). The rate is also given in µm/y, mils per year and as a mass loss per area per day.

The second card does the same for a **weight-loss coupon** test (ASTM G1 and G31).

For the equilibrium potential of the metal, use the [[nernst-calculator]]; for the same electrode's impedance, the [[impedance-fitter|impedance (EIS) fitter]].

## How to use it

1. Export the scan (potential and current) from your potentiostat, then paste it or press "Open a file". Choose the units; if the current is not per area, type the electrode area.
2. Check the Tafel range: start at least 50 to 80 mV away from Ecorr and cover at least one decade of current on each branch.
3. Pick the metal, or type the equivalent weight and density of your alloy.

## Worked example

The example is a simulated scan of steel in neutral salt water, made with Ecorr = −650 mV against SCE, icorr = 10 µA/cm², βa = 60 and βc = 120 mV per decade. The Tafel lines between 80 and 200 mV give icorr 9.92 µA/cm² and slopes of 59.9 and 119.7 mV/decade; the Wagner–Traud fit returns the values the curve was made with. For iron, ASTM G102 turns 10 µA/cm² into **0.116 mm per year** (4.57 mpy).

A steel coupon of 20 cm² that loses 0.0500 g in a week (168 h) is corroding at **0.166 mm per year**.

## Questions

**Why do the three methods disagree?** Real curves bend: oxygen diffusion flattens the cathodic branch, films form on the anodic branch, and solution resistance tilts both. If the lines are short or bent, trust the fit and Rp more, and say which method you used.

**Does it work for pitting?** No. These rates assume even attack over the whole area. Pitting needs a pitting scan and inspection.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
