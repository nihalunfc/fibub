---
name: Thin-film coating simulator
num: 931
shelf: science
section: optics-and-photonics
title: "Thin-film interference and anti-reflection coating calculator: reflectance against wavelength and angle"
summary: "Stack thin layers on glass and see how much light they reflect and transmit at every wavelength and angle, for s, p or unpolarised light, by the transfer-matrix method: anti-reflection coatings, Bragg mirrors, soap films and thin absorbing layers."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-09
related: [gaussian-beam, beer-lambert-calculator, plot-maker, polarisation-calculator, sellmeier-fitter, lens-ray-tracer, thin-film-thickness, spectrometer-calibration]
sources:
  - "Characteristic (transfer) matrix method for thin-film stacks, tilted admittances for s and p light: Macleod, H. A., Thin-Film Optical Filters (standard textbook result); Born, M. and Wolf, E., Principles of Optics, chapter 1.6."
  - "Refractive indices of MgF₂ (1.38), SiO₂ (1.46), Al₂O₃ (1.63), Ta₂O₅ (2.1), TiO₂ and ZnS (2.35) are rounded, general textbook values for visible light, treated as constant; they are editable starting points, not data for a real coating."
  - "Checked against an independent NumPy calculation with Fresnel coefficients at each interface and propagation matrices (a different formulation), plus closed forms: quarter-wave layer, bare surface, Brewster angle and total internal reflection. The example designs are made up."
flow:
  - { icon: table, label: "Layers" }
  - { icon: sliders, label: "Angle" }
  - { icon: curve, label: "Spectrum" }
  - { icon: download, label: "Download" }
---

## What it does

Light reflected from the top and bottom of a thin layer interferes with itself. If the two reflections are half a wave out of step they cancel, and the surface reflects less; if they are in step they add, and it reflects more. That is why soap bubbles shimmer, why camera lenses look purple-green, and how a stack of alternating layers can make a mirror that reflects more than 99.8 % of one colour.

This simulator works out the reflectance R, transmittance T and absorptance A of any stack of flat layers on a substrate, using the **transfer-matrix (characteristic matrix) method**: each layer is a 2 × 2 matrix built from its index, thickness and the angle of the light inside it, and the product of all of them gives the whole coating. It handles **s and p polarisation** separately, any angle of incidence, and **absorbing layers** through a complex index n − ik.

Get accurate refractive indices for your layers from the [[sellmeier-fitter|Sellmeier fitter]], and see how the coating treats s and p light in the [[polarisation-calculator|polarisation calculator]].

## How to use it

1. Pick a starting design or choose **My own layers**.
2. List the layers from the side the light comes from down to the substrate. Each line is `index thickness` in nanometres, `n k thickness` for an absorbing layer, or a number of **quarter waves** at the design wavelength: `1.38 QW`, `2.1 2QW` (a half wave). You can type a material name instead of the index. `TiO2 QW; SiO2 QW x 8` repeats the pair eight times.
3. Set the **design wavelength** (what QW refers to), the **incident medium** (1 for air, 1.33 for water) and the **substrate** n and k.
4. Choose the **angle of incidence** and the **light**: unpolarised is the average of s (electric field parallel to the surface) and p.
5. Set the **spectrum range** for the chart, the mean and the CSV.

## Worked example

The default is the classic **quarter-half-quarter** broadband anti-reflection coating on crown glass (n 1.52): MgF₂ quarter wave (99.6 nm), Ta₂O₅ half wave (131.0 nm), Al₂O₃ quarter wave (84.4 nm), designed for 550 nm. At normal incidence the page shows **R 0.183 %** (T 99.82 %) at 550 nm, against 4.26 % for bare glass. Across 400 to 800 nm the mean reflectance is 0.525 %, lowest 0.0035 % at 648 nm and highest 4.62 % at 400 nm, where the coating stops working. At 45° the s and p reflectances split to 1.39 % and 0.088 %.

For comparison, a single MgF₂ quarter wave gives 1.26 %, exactly ((1 × 1.52 − 1.38²)/(1 × 1.52 + 1.38²))². The Bragg mirror preset (8 pairs TiO₂/SiO₂) reflects 99.87 % at 550 nm, with a high-reflection band (over 90 %) from about 475 to 654 nm.

## Tips

- A single layer is a perfect anti-reflection coating when its index is √(n₀ × n_substrate): about 1.23 for glass in air, which is why MgF₂ (1.38) leaves about 1.3 %.
- A half-wave layer is "absent" at its design wavelength: the reflectance is the same as bare substrate.
- Tilting a coating moves its features to shorter wavelengths (blue shift) and splits s from p.
- With k > 0 some light is absorbed, so R + T is less than 100 %.

## FAQ

**Why constant indices?** Real materials are dispersive (the index changes with wavelength), and real values depend on how the film was made. Constant, rounded indices keep the tool honest and simple; replace them with your own measured values at the wavelength you care about.

**Does it include the back of the glass?** No. The substrate is treated as infinitely thick, so the result is for the coated front surface only.

**Is this good enough to order a coating?** It is for study and planning, not a substitute for a coating designer's software with measured material data and manufacturing tolerances.
