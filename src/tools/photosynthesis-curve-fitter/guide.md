---
name: Photosynthesis curve fitter
num: 325
shelf: science
code: T240
section: botany-and-plant-science
title: "Photosynthesis light response and A/Ci curve fitting: Amax, quantum yield, Vcmax, Jmax and Rd online"
summary: "Fit leaf gas exchange curves in your browser. Light response curves get a non-rectangular hyperbola with Amax, quantum yield, curvature, dark respiration, light compensation and saturation points. A/Ci curves get the Farquhar-von Caemmerer-Berry model with Vcmax, J, Jmax and Rd, the Rubisco and RuBP-limited parts, and the transition Ci."
status: live
ads: true
order: 325
icon: curve
works: offline
updated: 2026-11-09
related: [enzyme-kinetics-fitter, binding-curve-fitter, dose-response, plot-maker, uncertainty-calculator, curve-fitter, plant-growth-analysis, stomatal-density-counter, leaf-area-analyser]
sources:
  - "Light response: the non-rectangular hyperbola (J. H. M. Thornley, Mathematical Models in Plant Physiology, 1976; B. Marshall and P. V. Biscoe, Journal of Experimental Botany 31, 29-39, 1980). Formula only."
  - "A/Ci: G. D. Farquhar, S. von Caemmerer and J. A. Berry, Planta 149, 78-90 (1980); S. von Caemmerer, Biochemical Models of Leaf Photosynthesis (CSIRO, 2000); T. D. Sharkey et al., Plant, Cell and Environment 30, 1035-1040 (2007) for fitting by limitation. Formulas only."
  - "Preset kinetic constants at 25 °C (general published model parameters, editable): Γ* 42.75 µmol mol⁻¹, Kc 404.9 µmol mol⁻¹, Ko 278.4 mmol mol⁻¹, from C. J. Bernacchi et al., Plant, Cell and Environment 24, 253-259 (2001)."
  - "Checked in the tests against SciPy 1.18: curve_fit for the hyperbola (parameters and standard errors), brentq for the compensation and saturation points, and least_squares with 16 starting points on the min(Ac, Aj) − Rd model for A/Ci, plus brentq for the transition Ci and Jmax."
  - "The example curves are made up."
flow:
  - { icon: table, label: "Paste curve" }
  - { icon: curve, label: "Fit model" }
  - { icon: target, label: "Parameters" }
  - { icon: download, label: "Download" }
---

## What it does

This tool fits the two curves most often measured with a leaf gas exchange system.

**Light response curve.** Net photosynthesis A is measured at a series of light levels (PPFD). The tool fits the **non-rectangular hyperbola**: θA² − (φI + Amax)A + φI·Amax = 0 for gross photosynthesis, minus dark respiration Rd. You get:

- **Amax**: gross photosynthesis at saturating light, and the **maximum net A** (Amax − Rd).
- **Quantum yield φ**: the initial slope, CO₂ fixed per photon.
- **Curvature θ**: how sharply the curve turns from slope to plateau.
- **Rd**: respiration in the dark.
- **Light compensation point**: the light where net A is zero.
- **Light saturation point**: the light where net A reaches a chosen share (75 to 95 %) of its maximum, and **Ik** = Amax ÷ φ.

**A/Ci curve.** Net A is measured at a series of intercellular CO₂ concentrations (Ci). The tool fits the **Farquhar-von Caemmerer-Berry (FvCB)** model: A = min(Ac, Aj) − Rd. At low Ci, photosynthesis is limited by Rubisco (Ac, set by **Vcmax**); at high Ci by the regeneration of RuBP through electron transport (Aj, set by **J**). You get Vcmax, J, Rd, their standard errors, which points are limited by which process, the **transition Ci** and **Jmax**.

Measure the leaf area behind each rate with the [[leaf-area-analyser|leaf area analyser]], and link the curves to growth with the [[plant-growth-analysis|plant growth analysis]].

## How to use it

1. Paste two columns for each curve, or open a CSV, TSV, TXT or Excel file: PPFD and A for the light curve, Ci and A for the A/Ci curve. Header rows are skipped.
2. **Light curve options**: fit θ or fix it (fixing helps when there are few points near the bend), and choose the share of maximum net A used for the saturation point.
3. **A/Ci options**: Γ*, Kc, Ko and O₂ are preset to the values at 25 °C from Bernacchi et al. (2001) and 21 % oxygen. These are general model parameters; enter others for a different leaf temperature or source. **Electrons per CO₂** chooses the RuBP-limited form, 4Ci + 8Γ* (Farquhar et al. 1980) or 4.5Ci + 10.5Γ*. The **split** between the two limits is found automatically, or you can set the Ci below which points are Rubisco-limited.
4. **Jmax**: give the light used during the A/Ci curve, plus α and θ for electron transport (often about 0.3 and 0.7). Jmax is then worked out from J by solving θJ² − (αI + Jmax)J + αI·Jmax = 0.

## How the A/Ci fit works

For any split of the points into a low-Ci, Rubisco-limited part and a high-Ci, RuBP-limited part, the model is linear in Vcmax, J and Rd, so it can be solved exactly by least squares. The tool tries every split with at least two points in each part. It keeps the best fit in which every point really is on the lower of the two curves. That is the same answer as minimising the error of the min(Ac, Aj) model directly, which the tests confirm against SciPy.

## Worked example

The made-up light curve has 12 steps from 0 to 2,000 µmol m⁻² s⁻¹. The fit gives **Amax 21.8 µmol m⁻² s⁻¹** (± 0.25), φ 0.0522, θ 0.789 and **Rd 1.55**. The light compensation point is **30.2 µmol m⁻² s⁻¹** and net A reaches 90 % of its maximum at **1,159 µmol m⁻² s⁻¹**. Fixing θ at 0.7 gives Amax 22.5 and Rd 1.71 instead.

The made-up A/Ci curve has 12 points from Ci 60 to 1,500 µmol mol⁻¹. With the 25 °C constants it gives **Vcmax 68.7**, **J 128.6** and **Rd 1.14 µmol m⁻² s⁻¹**. The lowest 7 points are Rubisco-limited, with the transition at Ci **464.5 µmol mol⁻¹**. At PPFD 1,500 with α 0.3 and θ 0.7, **Jmax is 144.0 µmol m⁻² s⁻¹**.

## Tips

- Give the light curve several points below 200 µmol m⁻² s⁻¹; φ, Rd and the compensation point come from them.
- Give the A/Ci curve at least three points on each side of the bend. A curve that never levels off cannot give J.
- Vcmax and J depend strongly on temperature and on the constants used; report the constants with the results.
- Triose-phosphate (TPU) limitation, where A falls at very high Ci, is not modelled. Leave such points out.

## FAQs

**Is Rd from the A/Ci fit the same as dark respiration?** No. It is respiration in the light, usually lower than respiration in the dark.

**Why are my standard errors large?** Few points near the bend, or a curve that does not reach its plateau, leave the parameters poorly pinned down.

**Is my data uploaded?** No. Everything runs in your browser.
