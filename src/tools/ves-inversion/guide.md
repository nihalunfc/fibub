---
name: Resistivity sounding (VES) inversion
num: 883
shelf: science
section: geophysics-and-seismology
title: "VES inversion: Schlumberger and Wenner apparent resistivity, layered-earth forward model and damped least-squares inversion"
summary: "Paste Schlumberger or Wenner sounding readings (AB/2, MN/2, ΔV and I, or apparent resistivity). Get apparent resistivities, a layered-earth model of 2 to 6 layers by damped least-squares inversion, the log-log sounding curve, a resistivity-depth plot, error factors and a CSV."
status: live
ads: true
order: 883
icon: curve
works: offline
updated: 2026-11-09
related: [seismic-refraction, gravity-corrections, pump-test-analyser, darcy-flow-calculator, gpr-viewer, magnetic-anomaly, well-field-drawdown, cross-section-profile]
sources:
  - "Geometric factors, the Pekeris recurrence for the layered-earth kernel and the Hankel-transform forms of the potential (Koefoed 1979, Geosounding Principles) are standard results, written by fibub from the equations."
  - "The linear filter weights were computed by fibub by least squares against exact transform pairs; no published filter coefficients are used. They are checked against the exact image series for two layers and against direct numerical integration with SciPy's Bessel functions."
  - "Inversion: damped least squares (Marquardt-Levenberg) on log resistivities and log thicknesses; checked against SciPy's least_squares on the same data."
  - "The example sounding is made up by fibub."
flow:
  - { icon: table, label: "Readings" }
  - { icon: sliders, label: "Layers" }
  - { icon: curve, label: "Curve fit" }
  - { icon: ruler, label: "Depths" }
---

## What it does

A **vertical electrical sounding** (VES) measures how the resistivity of the ground changes with depth. Current goes in through two outer electrodes (A and B) and the voltage is read between two inner ones (M and N). As the outer electrodes move apart, the current reaches deeper, so a curve of **apparent resistivity** against spacing carries the layering of the ground: dry sand, clay, a water table, bedrock. This page:

- Works out the **geometric factor** K and the apparent resistivity ρa = K ΔV/I for each reading. Schlumberger: K = π(AB/2² − MN/2²) ÷ MN. Wenner: K = 2πa.
- Computes the **forward model**: the sounding curve that a stack of flat layers would give. It uses the layered-earth kernel (the Pekeris recurrence) and evaluates the Hankel transforms with linear filters that fibub computed itself. For Schlumberger readings it uses the real MN length, so the jumps where MN is moved are modelled too.
- **Inverts** the readings: starting from a model, it adjusts the logarithms of every resistivity and thickness by damped least squares (Marquardt-Levenberg) until the model curve matches the readings as well as it can.
- Reports each layer with an **error factor** (×/÷), the depth to each interface, the RMS misfit, and the **longitudinal conductance** S = Σ h/ρ, which is often better fixed than the layers themselves.
- Draws the log-log sounding curve with the model, the resistivity-against-depth column, and lets you download the fit as CSV.

Check the layers against the [[seismic-refraction|seismic refraction interpreter]] on the same line, and if you have found an aquifer, test it with the [[pump-test-analyser]].

## How to use it

1. Choose the array, Schlumberger or Wenner, and whether your columns are field readings (spacings, ΔV in mV and I in mA) or already apparent resistivities.
2. Paste or open the readings, one spacing per line. The help line shows the columns expected.
3. Choose the number of layers. Start with few, and add one only if the fit gets clearly better.
4. Optionally type a starting model (resistivities top down, then thicknesses). Tick *Forward model only* to see the curve of a model without inverting.
5. Read the layers, check the misfit column for outliers, and download the CSV or a report.

## Worked example

The example sounding was made from three made-up layers: 120 Ω·m for 3 m, 25 Ω·m for 12 m, on 400 Ω·m, read with MN/2 = 0.5 m up to AB/2 = 15 m and 5 m beyond, with 2 % noise added. The first reading, AB/2 = 1 m, MN/2 = 0.5 m, has K = 2.356 m and ΔV = 4992 mV at 100 mA, so ρa = **117.6 Ω·m**. Inverting for three layers gives **118.6 Ω·m over 3.13 m, 22.6 Ω·m down to 13.6 m, on 379 Ω·m**, with an RMS misfit of **1.76 %**, the size of the noise. The error factors (×/÷ 1.08 for the middle layer's resistivity, ×/÷ 1.10 for its thickness) show the conductive layer is less certain than its conductance S = 0.491 S.

## Good to know

- **Equivalence**: a thin conductive layer can be swapped for a thicker, less conductive one with the same h/ρ, and the curve barely changes. Likewise a thin resistive layer is fixed only by h·ρ. Treat single layers with care when their error factors are large.
- **Suppression**: a layer much thinner than the one above it may not show at all.
- The model assumes flat layers. Slopes, buried objects or nearby fences and pipes distort the curve, often as a jump between neighbouring readings.
- A step where MN is moved is normal for Schlumberger soundings with finite MN; the model allows for it. If the step is large, check the readings.

## FAQ

**Which is better, Schlumberger or Wenner?** Schlumberger needs fewer electrode moves and copes better with surface variations; Wenner gives stronger signals. Both work here.

**How deep does a sounding see?** Roughly a quarter to a third of AB/2, depending on the layers. The deepest layer here is always taken as infinitely thick.

**Is my data sent anywhere?** No. Everything is worked out on this page and nothing leaves your device.
