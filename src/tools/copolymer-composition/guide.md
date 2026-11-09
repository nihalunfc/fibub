---
name: Copolymer composition and reactivity ratio calculator
num: 101
shelf: science
section: polymer-chemistry
title: "Copolymer composition calculator: Mayo–Lewis equation, composition drift and reactivity ratio fitting"
summary: "Copolymer composition from the feed and reactivity ratios (Mayo–Lewis), the azeotropic feed, and how feed and copolymer composition drift with conversion in a batch. Fit r₁ and r₂ to your own data by Fineman–Ross, Kelen–Tüdős and non-linear least squares; paste or open CSV or Excel."
status: live
ads: true
order: 2
icon: curve
works: offline
updated: 2026-11-08
related: [polymer-molar-mass, reaction-kinetics-fitter, calibration-curve, plot-maker, glass-transition-calculator, dsc-tga-analyser]
sources:
  - "Reactivity ratios for 5 monomer pairs: typical literature values (about 60 °C, as listed in the Polymer Handbook), which you can type over."
flow:
  - { icon: flask, label: "Monomers" }
  - { icon: sliders, label: "Feed" }
  - { icon: curve, label: "Composition" }
  - { icon: chart, label: "Drift" }
---

## What it does

When two monomers polymerise together, the chain does not take them up in the same ratio as the feed. Each growing chain end prefers one monomer or the other, and the reactivity ratios say by how much: r₁ = k₁₁/k₁₂ for a chain ending in monomer 1, and r₂ = k₂₂/k₂₁ for one ending in monomer 2. The Mayo–Lewis equation turns these into the copolymer made at any moment:

F₁ = (r₁f₁² + f₁f₂) / (r₁f₁² + 2f₁f₂ + r₂f₂²)

where f₁ is the mole fraction of monomer 1 in the feed and F₁ in the copolymer.

The first card gives:

- **F₁ for your feed**, and whether the copolymer is richer in monomer 1 or 2.
- **Behaviour** from r₁r₂: ideal (random) near 1, alternating near 0, blocky when both ratios exceed 1.
- **The azeotrope**, the one feed whose copolymer has the same composition, when both ratios are below 1 (or both above).
- **Composition drift**: in a batch the faster monomer is used up first, so the feed and the chains being made change as conversion rises. The tool integrates the Skeist equation and plots feed, instantaneous and average copolymer composition against conversion.
- The full **F₁ against f₁ curve**.

The second card **fits reactivity ratios** to your own measurements of feed and copolymer composition at low conversion, by Fineman–Ross, Kelen–Tüdős and non-linear least squares (the type of fit IUPAC recommends), and plots the fitted curve through your points.

Measure the chains you made with the [[polymer-molar-mass|polymer molar mass calculator]], and estimate their glass transition with the [[glass-transition-calculator]].

## How to use it

1. Pick a monomer pair from the list (typical literature values near 60 °C) or type your own r₁ and r₂.
2. Type the feed fraction of monomer 1 and how far in conversion you want to follow the drift.
3. To fit ratios, paste pairs of f₁ and F₁, or open a CSV or Excel file with two columns, then press "Use the fitted values above" to see what they predict.

## Worked example: styrene and methyl methacrylate

With r₁ = 0.52 for styrene and r₂ = 0.46 for MMA, a feed of 30 mol % styrene gives a copolymer with **F₁ = 0.371**: richer in styrene than the feed. Both ratios are below 1, so there is an azeotrope at f₁ = (1 − r₂)/(2 − r₁ − r₂) = **0.529**. By 90 % conversion the feed has fallen to 11.5 % styrene, the chains being made then hold 19.0 %, and the average copolymer is 32.1 %.

For styrene and acrylonitrile (0.40 and 0.04), the same feed uses up all the styrene by about 70 % conversion, after which almost pure polyacrylonitrile forms. That is why SAN is made close to its azeotrope at 61.5 mol % styrene.

The example data in the fitting card are simulated measurements around 0.52 and 0.46 with small errors. Non-linear least squares returns r₁ = 0.516 and r₂ = 0.456.

## Questions

**Why must the data be at low conversion?** The Mayo–Lewis equation gives the instantaneous copolymer. If a run goes far, the feed drifts and the measured copolymer is an average, which biases the ratios.

**Which fit should I report?** Non-linear least squares, or the error-in-variables method if you have estimates of both errors. The linear methods are shown for comparison with older papers.

**Does it handle penultimate effects?** No. It uses the terminal model, which describes most common pairs well.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
