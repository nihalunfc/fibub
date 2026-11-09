---
name: Oil and gas PVT correlations
num: 687
shelf: science
section: petroleum-engineering
title: "PVT correlations calculator: bubble point, Rs, Bo, oil viscosity, gas Z-factor, Bg and gas viscosity"
summary: "Estimate black-oil and natural gas properties from API gravity, gas gravity, GOR, temperature and pressure: Standing and Vasquez-Beggs bubble point, Rs and Bo, Beggs-Robinson viscosity, Z-factor by Dranchuk-Abou-Kassem or Hall-Yarborough with Sutton pseudo-criticals, Bg, gas density and Lee-Gonzalez-Eakin viscosity, with curves against pressure."
status: live
ads: true
order: 687
icon: flask
works: offline
updated: 2026-11-09
related: [decline-curve, gas-law-calculator, phase-diagram-calculator, vapour-pressure-calculator]
sources:
  - "Standing, M. B. (1947), A pressure-volume-temperature correlation for mixtures of California oils and gases, Drilling and Production Practice, API: bubble point, solution GOR and Bo."
  - "Vasquez, M. and Beggs, H. D. (1980), Correlations for fluid physical property prediction, Journal of Petroleum Technology 32(6): Rs, Bo, pb, oil compressibility and undersaturated viscosity. Beggs, H. D. and Robinson, J. R. (1975), Journal of Petroleum Technology 27(9): dead and live oil viscosity."
  - "Sutton, R. P. (1985), SPE 14265: pseudo-critical properties from gas gravity. Wichert, E. and Aziz, K. (1972), Hydrocarbon Processing 51(5): sour gas correction. Dranchuk, P. M. and Abou-Kassem, J. H. (1975), Journal of Canadian Petroleum Technology 14(3), and Hall, K. R. and Yarborough, L. (1973), Oil and Gas Journal 71(25): Z-factor. Lee, A. L., Gonzalez, M. H. and Eakin, B. E. (1966), Journal of Petroleum Technology 18(8): gas viscosity."
  - "The published equations and their fitted constants, written by fibub; checked against an independent Python implementation (SciPy root finding and integration). No tables or charts copied."
  - "Example inputs are made-up round numbers."
flow:
  - { icon: flask, label: "Fluid" }
  - { icon: sliders, label: "Conditions" }
  - { icon: sigma, label: "Correlate" }
  - { icon: chart, label: "Curves" }
---

## What it does

Reservoir engineers need the properties of oil and gas at reservoir pressure and temperature: how much gas is dissolved in the oil, how much the oil swells, how thick it is, and how far the gas departs from an ideal gas. When there is no lab PVT report yet, these come from **published correlations**, equations fitted to many measured crude oils and natural gases. This calculator works them out from five numbers you usually know from a well test: oil gravity (°API), gas gravity, the producing gas-oil ratio, reservoir temperature and pressure.

**Oil**: bubble point pressure, solution GOR (Rs) and formation volume factor (Bo) by **Standing** or **Vasquez-Beggs**; compressibility of undersaturated oil (Vasquez-Beggs); dead and live oil viscosity by **Beggs-Robinson**, with the Vasquez-Beggs rise above the bubble point; and oil density from a mass balance.

**Gas**: pseudo-critical properties from gas gravity (**Sutton**), with the **Wichert-Aziz** correction for CO₂ and H₂S; the **Z-factor** by **Dranchuk-Abou-Kassem** or **Hall-Yarborough** (both fitted to the Standing-Katz chart, solved here by root finding); gas formation volume factor Bg, density, compressibility and viscosity (**Lee-Gonzalez-Eakin**).

## How to use it

1. Enter the oil gravity, gas gravity and the **solution GOR at the bubble point** (for a black oil above its bubble point this is the producing GOR).
2. Enter the reservoir temperature and the pressure you want the properties at. Units can be °F or °C, psia, bar, kPa or MPa, and scf/STB or m³/m³.
3. Choose the oil correlation and the Z-factor method. Vasquez-Beggs also uses the separator pressure and temperature to correct the gas gravity.
4. Read the results, the four curves against pressure (Bo, Rs, oil viscosity and Z) and the table. Download the table as CSV or the whole report as an image, PDF or Word file.

## Worked example

With the made-up inputs (35 °API, gas gravity 0.75, 600 scf/STB, 180 °F, 3,000 psia) and Standing, the bubble point is **2,463 psia**, so at 3,000 psia the oil is undersaturated. Bo at the bubble point is 1.3352 rb/STB and it shrinks to **1.3241 rb/STB** at 3,000 psia with an oil compressibility of 1.41 × 10⁻⁵ 1/psi. The dead oil viscosity is 2.18 cP; live oil at the bubble point is 0.578 cP, rising to **0.609 cP** at 3,000 psia. At 1,000 psia, Rs is 206.2 scf/STB.

For the gas, Sutton gives Tpc = 389.7 °R and Ppc = 656.5 psia, so Tpr = 1.641 and Ppr = 4.570, and Dranchuk-Abou-Kassem gives **Z = 0.8524**. Bg is 0.005140 ft³/scf (0.9155 rb/Mscf) and the gas viscosity is 0.0211 cP. Switching to Vasquez-Beggs moves the bubble point to 2,781 psia, a reminder that correlations disagree by several percent.

## Tips

- Use the correlation developed for oils like yours when you know it; otherwise compare both and treat the spread as uncertainty.
- Near Tpr = 1 (gas close to its critical temperature) the two Z-factor methods differ most; the tool warns you there.
- For gas condensates and volatile oils, black-oil correlations are a poor fit; use an equation of state with a lab analysis.

## FAQ

**Which units are used?** Inputs in your choice of units; Bo in rb/STB (the same as m³/m³), Bg in ft³/scf (the same as m³/sm³) and rb/Mscf, viscosity in cP (mPa·s), density in lb/ft³ and kg/m³. Standard conditions are 14.696 psia and 60 °F.

**Why does oil viscosity rise above the bubble point?** No more gas can dissolve, so extra pressure only compresses the oil, which makes it slightly more viscous.

**Is anything sent anywhere?** No. It all runs in your browser and works offline.
