---
name: Heat capacity fitter
num: 964
shelf: science
code: T699
section: condensed-matter-physics
title: "Heat capacity fitter: Debye and Einstein temperatures from measured Cp(T), with the electronic γ and the low-temperature C/T against T² plot"
summary: "Paste or open measured heat capacity against temperature and fit the Debye and Einstein models, with or without an electronic γT term. Get the Debye or Einstein temperature with its standard error, γ, the fit quality of all four models side by side, residuals, and the classic low-temperature C/T against T² line. Download the fit as CSV, image, PDF or Word."
status: live
ads: true
order: 8
icon: chart
works: offline
updated: 2026-11-09
related: [band-structure, trend-analyser, dsc-tga-analyser, plot-maker, uncertainty-calculator, superconductor-calculator, curve-fitter, quantum-statistics, partition-function]
sources:
  - "Debye (1912) and Einstein (1907) models of the lattice heat capacity, the electronic term γT and the low-temperature law C/T = γ + βT² with β = 12π⁴nR/(5θ_D³): standard textbook results, for example Kittel, C., Introduction to Solid State Physics, chapters 5 and 6, and Ashcroft, N. W. and Mermin, N. D., Solid State Physics, chapter 23."
  - "Checked by fibub against SciPy (quad for the Debye integral and curve_fit for the fits, with the same weights) on the made-up example data; R is the exact CODATA value."
  - "The example data are made up: generated from a Debye model with θ = 340 K, γ = 0.7 mJ/(mol·K²) and 1 % random noise. They are not measurements of any material."
flow:
  - { icon: table, label: "Data" }
  - { icon: sliders, label: "Model" }
  - { icon: curve, label: "Fit" }
  - { icon: target, label: "θ and γ" }
---

## What it does

The heat capacity of a solid rises from zero at absolute zero to about 3R per mole of atoms at high temperature (the **Dulong-Petit** limit, about 24.9 J/(mol·K)). How fast it rises depends on how stiff the crystal is, which is summed up in one number: the **Debye temperature θ_D** (or, in the simpler Einstein picture, the **Einstein temperature θ_E**). In metals, conduction electrons add a small term **γT** that dominates at the lowest temperatures.

This tool fits your measured heat capacity with:

- the **Debye model**, where atoms vibrate as sound waves up to a maximum frequency, giving C ∝ T³ at low temperature;
- the **Einstein model**, where every atom vibrates at one frequency, which falls off exponentially at low temperature (and is often a good description of optical phonons);
- each with or without the electronic **γT** term.

It reports the fitted θ (and γ) with standard errors, the fit quality of all four combinations side by side, a residual plot, and the classic **C/T against T²** straight line at low temperature, whose intercept is γ and slope gives θ_D independently.

Fit any other formula to your data with the [[curve-fitter|curve fitter]], and see where the Debye and Einstein models come from with the [[partition-function|partition function calculator]].

## How to use it

1. Paste two columns, temperature in kelvin and heat capacity, or open a CSV, TXT or Excel file. A header row is fine.
2. Pick the **units** of the heat capacity. For J/(g·K), type the molar mass so the tool can convert to J/(mol·K).
3. Give **n**, the atoms per formula unit (1 for an element, 2 for NaCl, 5 for SrTiO₃). The fit keeps the high-temperature limit at 3nR.
4. Choose the main model, whether to include γT, and the **weighting**. Relative weighting (the default) treats each point as equally precise in per cent, which suits data spanning several decades.
5. Optionally narrow the **fit range**, and set the upper temperature for the low-temperature line (it should be well below θ_D/50 for the T³ law to hold).

## Worked example

The page opens with made-up data from 4 to 300 K. The Debye fit with γT and relative weights gives **Debye θ = 340.24 ± 0.39 K, γ = 0.701 ± 0.012 mJ/(mol·K²)**, with residuals of about 0.8 % rms, close to the 1 % noise put into the made-up data. The Einstein model fits far worse (60 % rms on its own, 39 % with γT) because its heat capacity collapses too quickly at low temperature. The low-temperature line through the six points at or below 15 K gives θ_D = **341.31 ± 0.23 K** from the slope and γ = 0.721 ± 0.012 mJ/(mol·K²) from the intercept, agreeing with the full fit.

## Tips

- Leave out γT for insulators. If the fitted γ comes out negative, the data do not support an electronic term.
- Real solids are not perfect Debye solids: θ_D fitted at different temperatures often differs by 10 % or more. Try narrowing the fit range to see how θ drifts.
- Cp measured at constant pressure is a little above Cv at high temperature; the difference is ignored here.

## FAQ

**What do the ± values mean?** One standard error from the least-squares curvature, scaled by the scatter of your residuals. They do not include systematic errors such as addenda or sample mass errors.

**Why does the Einstein model still matter?** Optical phonons in compounds behave much like Einstein oscillators. A Debye term plus Einstein terms is a common model for complex solids; this tool fits one at a time.

**Is this suitable for publication?** It is a careful fitting tool for study and checking. For publication, also report how the data were measured and corrected.
