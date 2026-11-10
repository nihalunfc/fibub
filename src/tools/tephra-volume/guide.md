---
name: Tephra volume
num: 887
shelf: science
code: T622
section: volcanology
title: "Tephra volume"
summary: "Work out the volume of a tephra fall deposit from isopach thickness and area: exponential fits with one to three segments, the power law between your limits, and the Weibull fit, with VEI class, mass and dense-rock-equivalent volume, and a plot of thickness against √area."
status: live
ads: true
order: 887
icon: mountain
works: offline
updated: 2026-11-09
related: [eruption-column, grain-size-stats, strat-column, curve-fitter, radiocarbon-calibration]
sources:
  - "Methods (formulas only, no data copied): Pyle (1989) exponential thinning; Fierstein and Nathenson (1992) and Bonadonna and Houghton (2005) multi-segment exponential and power-law integration; Bonadonna and Costa (2012) Weibull function; Newhall and Self (1982) VEI volume classes."
  - "Example isopachs: synthetic, made by fibub from a two-segment exponential with a little noise. Densities: round values, editable."
flow:
  - { icon: table, label: "Isopachs" }
  - { icon: curve, label: "Fits" }
  - { icon: calculator, label: "Volume" }
  - { icon: chart, label: "VEI, plot" }
---

## What it does

Tephra fall deposits thin away from the vent. Mapping lines of equal thickness (isopachs) and measuring the area inside each gives pairs of **thickness T** and **area A**. Plotted as ln T against √A they fall close to straight lines, and integrating the fitted curve gives the deposit's **bulk volume**. This tool fits the three standard models side by side:

- **Exponential** (Pyle 1989), with **one, two or three straight segments** (Fierstein and Nathenson 1992; Bonadonna and Houghton 2005). Segments join where their lines cross and the last one runs to infinity.
- **Power law** T = T<sub>pl</sub> · x<sup>−m</sup> (Bonadonna and Houghton 2005), integrated between a proximal limit **B** and a distal limit **C** that you choose.
- **Weibull** T = θ (x/λ)<sup>n−2</sup> exp(−(x/λ)<sup>n</sup>) (Bonadonna and Costa 2012), with volume 2θλ²/n.

It also gives the **VEI class**, the **mass** for your deposit density and the **dense-rock-equivalent (DRE)** volume.

Turn the eruption rate into a column height with the [[eruption-column|eruption column calculator]], and describe the tephra grains with [[grain-size-stats]].

## How to use it

1. Paste or type one isopach per line: **thickness, then area** (the whole area inside the line). Open a CSV or Excel file if you have one. Pick the units.
2. Choose how many **exponential segments** to fit. The page tries every split and keeps the one with the smallest squared error in ln T.
3. Set the **power-law limits** B and C as √area in km, and the **deposit and magma densities**.
4. Read the volumes, VEI and mass in the table, look at the plot (thickness on a log scale against √area), and download the report or CSV.

## How the volumes are worked out

With x = √A, the volume is V = ∫ T(x) 2x dx from 0 outwards. For one exponential segment T = T₀e<sup>−kx</sup> this is **V = 2T₀/k²**; each segment of a multi-segment fit adds 2T₀/k² [(1 + kx₁)e<sup>−kx₁</sup> − (1 + kx₂)e<sup>−kx₂</sup>] between its ends. The thickness half-distance **b<sub>t</sub> = ln 2 / (k√π)** is shown for each segment. The Weibull parameters are fitted by least squares on ln T (θ is solved exactly for each λ and n, which are searched from many starting points).

## Worked example

The example's nine synthetic isopachs, from 128 cm over 1.5 km² to 0.5 cm over 902.9 km², bend at about 9 km. With **two exponential segments** (split after the fourth isopach, lines crossing at √A = 8.73 km) the bulk volume is **0.0485 km³**, which is **VEI 3**. One segment gives 0.0514 km³ and three give 0.0532 km³. The Weibull fit gives 0.0500 km³ (λ = 10.9 km, n = 1.09), and the power law between 1 and 300 km gives 0.0900 km³, showing how much it depends on its limits. At 1000 kg/m³ the two-segment volume is 4.85 × 10¹⁰ kg, or 0.0194 km³ DRE at 2500 kg/m³.

## Tips

- Fewer than about six isopachs can not support more than one segment; the fits will look fine but the volume beyond the last isopach is a guess.
- When the models disagree a lot, the deposit's distal part is poorly known. Report the range.
- If the Weibull fit "runs off to a power law", your points lie on a straight line on log-log axes; use the power law with sensible limits.

## Frequently asked questions

**Is VEI only about volume?** VEI also uses column height and other observations; this tool assigns the class from bulk tephra volume alone.

**Is my data uploaded?** No. Everything is calculated in your browser and nothing leaves your device.
