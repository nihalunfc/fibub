---
name: DSC and TGA curve analyser
num: 103
shelf: science
section: polymer-chemistry
title: "DSC and TGA analyser: glass transition, melting enthalpy, crystallinity and mass loss steps from your data"
summary: "Paste or open a DSC scan to get Tg (onset, midpoint, end, ΔCp), melting and crystallisation peaks with onset and enthalpy, and percent crystallinity. Paste a TGA run for the mass loss steps, DTG peaks, T at 5 % loss, residue and which molecule each step lost."
status: live
ads: true
order: 4
icon: chart
works: offline
updated: 2026-11-08
related: [glass-transition-calculator, polymer-molar-mass, molar-mass-calculator, plot-maker]
flow:
  - { icon: table, label: "Scan" }
  - { icon: ruler, label: "Windows" }
  - { icon: curve, label: "Tg, peaks" }
  - { icon: chart, label: "Mass loss" }
---

## What it does

Differential scanning calorimetry (DSC) and thermogravimetric analysis (TGA) are the two everyday thermal methods for polymers, pharmaceuticals and inorganic materials. Instrument software does this analysis, but often only on the instrument computer. This page reads the exported numbers instead, in your browser.

**DSC card.** Paste or open a heating scan as temperature and heat flow (mW with the sample mass, or W/g). Give up to three event windows, each starting and ending on flat baseline:

- **Glass transition:** straight baselines are fitted to the first and last fifth of the window and a tangent is drawn at the steepest point. You get the extrapolated onset and end, the inflection, the midpoint at half height (as in ISO 11357-2 and ASTM E1356), and the step in heat capacity ΔCp.
- **Peak:** a straight baseline joins the window ends. You get the peak temperature, the extrapolated onset (where the tangent at the steepest leading edge meets the baseline), the end set, and the enthalpy in J/g from the area divided by the heating rate. Endotherms and exotherms are told apart from the plot direction you choose.
- **Crystallinity:** the melting enthalpy, less any cold crystallisation seen during the scan, divided by the enthalpy of the 100 % crystalline polymer (12 polymers listed, or your own) and the polymer share of a filled or blended sample.

**TGA card.** Paste or open temperature and mass. The tool works out the derivative curve (DTG), splits the run into steps at the DTG minima, and gives each step's onset, DTG peak, end set and mass loss, plus the temperatures at 5 % and 10 % loss and the final residue. With a starting formula, each step is matched to the loss of a common small molecule.

## How to use it

1. Export the scan from your instrument as text or Excel with two columns: temperature in °C and heat flow (or mass). Paste it, or press "Open a file".
2. Check the heat flow unit, mass, heating rate and which way exotherms point on your instrument's plot.
3. Move the windows so each one starts and ends on baseline. Raise the smoothing for noisy data.

## Worked example

The DSC example is a simulated scan of quenched amorphous PET (10 mg at 10 K/min). The tool finds **Tg 78.0 °C** with ΔCp 0.40 J/(g·K), cold crystallisation at 135 °C releasing 25.0 J/g, and melting at 250 °C taking 40.0 J/g. With ΔH⁰m = 140 J/g for PET, the crystallinity before the scan is (40.0 − 25.0)/140 = **10.7 %**: most of the crystals melting at 250 °C formed during the scan itself.

The TGA example is calcium oxalate monohydrate, the usual test material for TGA. The three steps lose **12.33 %, 19.17 % and 30.12 %**, matched to water, carbon monoxide and carbon dioxide (theory 12.33, 19.17 and 30.12 %), leaving 38.4 % calcium oxide.

## Questions

**Why do my numbers differ a little from the instrument's?** Baseline choice and smoothing move onset temperatures by a degree or so. State the method with the result, and use the same windows for samples you compare.

**Can I analyse a cooling scan?** Paste one segment at a time, heating or cooling, with temperatures in order. The tool stops if the temperature turns back.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
