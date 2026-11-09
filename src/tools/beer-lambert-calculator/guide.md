---
name: Beer–Lambert calculator
num: 84
shelf: science
section: analytical-chemistry
title: "Beer–Lambert law calculator and UV-Vis spectrum viewer: absorbance, ε, concentration"
summary: "Solve A = εlc for absorbance, molar absorptivity, path length or concentration, convert to transmittance, check the reading is in the reliable range, and view UV-Vis spectra with their maxima."
status: live
ads: true
order: 7
icon: chart
works: offline
updated: 2026-11-08
related: [calibration-curve, solution-calculator, molar-mass-calculator, reaction-kinetics-fitter, plot-maker]
sources:
  - "Example: NADH absorption coefficient at 340 nm (6220 L/(mol·cm)), a standard biochemistry value."
flow:
  - { icon: pencil, label: "3 values" }
  - { icon: calculator, label: "A = εlc" }
  - { icon: chart, label: "Spectrum" }
---

## What it does

The Beer–Lambert law says that the light a solution absorbs grows in a straight line with its concentration: **A = ε l c**. A is the absorbance, ε the molar absorptivity (how strongly the substance absorbs at that wavelength), l the path length through the cell and c the concentration. It is how a spectrophotometer measures concentration, from DNA and protein assays to water testing.

- **Solve for any one value.** Give three of absorbance, ε, path length and concentration. Absorbance can also be entered as percent transmittance, and concentration in mol/L, mmol/L, µmol/L or nmol/L, or as mg/L when you give the molar mass.
- **Reading quality.** Absorbances between about 0.1 and 1 are the most accurate. Below 0.05, noise and the blank dominate. Above 2, less than 1 % of the light gets through and most instruments stop being linear. The tool says which range your reading is in.
- **Spectrum viewer.** Paste a spectrum, or open a CSV or Excel file: wavelength first, then one column per sample. The tool plots every sample as absorbance or transmittance, finds the absorption maxima (λmax), reads the absorbance at any wavelength, and turns it into a concentration with the ε and path length from the calculator.

With several standards, fit the line properly with the [[calibration-curve|calibration curve]] tool; to make up the standards, use the [[solution-calculator]].

## How to use it

1. In the calculator, fill in three values and leave the one you want empty.
2. For spectra, paste the columns with a header row, or press **Open a file** (CSV, TSV, TXT or Excel, with the size and column limits shown beside the button). Say whether the values are absorbance or transmittance.
3. Type the wavelength to read at, usually the λmax of your compound, where ε is known.

## Worked example

NADH absorbs at 340 nm with ε = 6,220 L/(mol·cm); its oxidised form NAD⁺ does not. That is why so many enzyme assays follow NADH at 340 nm. A reading of A = 0.622 in a 1 cm cuvette means

c = A ÷ (ε l) = 0.622 ÷ (6,220 × 1) = 1.00 × 10⁻⁴ mol/L = 0.100 mmol/L.

Transmittance is 10⁻⁰·⁶²² = 23.9 %, well inside the accurate range. Press **Load an example** in the spectrum viewer for a simulated 0.1 mmol/L NADH spectrum. The tool finds the two bands at 259 nm and 340 nm and reads A = 0.622 at 340 nm, giving 0.100 mmol/L again.

## Questions

**My ε is in L/(mol·cm) but my plate reader path is unknown.** For a microplate the path depends on the volume in the well, about 0.55 cm for 200 µL in a standard 96-well plate. Many readers can correct to 1 cm for you. Otherwise, use a calibration curve with standards in the same plate.

**Why does my calibration curve bend at high concentration?** Stray light, the instrument's bandwidth, and molecules sticking together all bend the line above A ≈ 1 to 2. Dilute so the readings fall in the straight part, or use the [calibration curve](/science/calibration-curve/) tool with standards that span your samples.

**Is my data sent anywhere?** No. Files and pasted data stay in your browser.
