---
name: Spectrum peak fitter
num: 951
shelf: science
section: nuclear-and-particle-physics
title: "Spectrum peak fitter: Gaussian peaks on a background, net areas, FWHM and energy calibration for gamma and other spectra"
summary: "Paste or open a spectrum or histogram (counts per channel), mark a region, find or type the peaks, and fit Gaussians on a constant, straight or quadratic background with Poisson weights: centroid, FWHM, net area and their uncertainties, χ²/ν and residuals. Then calibrate channel to energy from known peaks."
status: live
ads: true
order: 7
icon: chart
works: offline
updated: 2026-11-09
related: [counting-statistics, gamma-shielding, calibration-curve, plot-maker, decay-chain, spectrometer-calibration, curve-fitter, uncertainty-calculator]
sources:
  - "Weighted non-linear least squares (Levenberg-Marquardt) with Poisson weights, Gaussian peak area A σ √(2π) and FWHM = 2√(2 ln 2) σ: standard results, for example Knoll, G. F., Radiation Detection and Measurement, and Bevington and Robinson, Data Reduction and Error Analysis for the Physical Sciences."
  - "Checked against SciPy curve_fit (absolute Poisson sigma) on the same spectrum and NumPy polyfit for the calibration, in tests written for this page."
  - "The example spectrum is made up: a falling continuum and four Gaussian peaks with Poisson noise from a fixed seed."
flow:
  - { icon: file, label: "Spectrum" }
  - { icon: target, label: "Peaks" }
  - { icon: curve, label: "Fit" }
  - { icon: ruler, label: "Calibrate" }
---

## What it does

A gamma-ray, X-ray or alpha spectrum (or any histogram) shows peaks sitting on a background. To measure a peak you need its **centroid** (where it is), its **width** (the detector's resolution) and its **net area** (how many counts belong to it, which gives the activity). This page fits each peak in a region with a **Gaussian** on a smooth background:

counts(x) = background(x) + Σ A exp(−(x − μ)² / 2σ²)

by weighted least squares. Each channel is weighted by 1/counts, as Poisson statistics require, so the uncertainties are the counting uncertainties. Overlapping peaks (doublets) are fitted together.

Decide how long to count with [[counting-statistics|counting statistics]], and turn peak areas into activities over time with the [[decay-chain|decay chain calculator]].

## How to use it

1. **Spectrum:** paste counts, one per line (the page numbers the channels 0, 1, 2 …), or two columns (channel or energy, then counts), or **open a file** (CSV, TSV, TXT or Excel, up to 65,536 rows). Nothing is uploaded. The chart shows the whole spectrum, on a log scale if you like.
2. **Region:** type where the region starts and ends. Include some background on both sides of the peaks.
3. **Background:** constant, straight line (usual) or quadratic (for a curved continuum).
4. **Peaks:** type rough positions, separated by commas, or press **Find peaks in the region** (it uses the typical width you give).
5. Read the table: centroid, FWHM and net area with their 1σ uncertainties, and the height. Check the **residual** plot: the points should scatter within ±2σ with no pattern, and χ²/ν should be near 1.
6. **Energy calibration (optional):** give pairs of position and known energy, such as `#1 662` (fitted peak 1 is the 662 keV line) or `180 300`. The table gains energy and FWHM in energy.

## Worked example

The page opens with a made-up 1,024-channel spectrum (137,682 counts) and the region 380 to 460 with peaks near 410 and 425: a close doublet on a sloping background. The fit gives centroids **410.59 ± 0.3** and **425.95 ± 0.43**, FWHM 14.05 and 12.18 channels, and net areas **4610 ± 200** and **2467 ± 190** counts, with χ²/ν = 1.27 on 73 degrees of freedom. The summation net area of the whole region (gross counts minus a straight-line background) is 7038 ± 280, close to the sum of the fitted areas, 7077.4.

Move the region to 150 to 220 and press Find peaks: one peak at **179.991 ± 0.059** with 8986 ± 130 counts. With the calibration pairs `#1 300`, `410.585 662` and `700 1120`, the line is E = 15.5317 + 1.57713 × channel and the peak's FWHM is 14.8 keV.

## Tips

- The fitted area uncertainty includes the background under the peak, which is why it is larger than √(area).
- If χ²/ν is well above 1, look at the residuals: a missing small peak, a curved background, or a low-energy tail (common in germanium detectors) shows up there.
- For activity, divide the net area by the counting time, the efficiency and the emission probability; the counting statistics helper does the detection limits.

## FAQ

**Are the uncertainties scaled by χ²/ν?** No. They come from Poisson statistics alone, as is usual for counting data. If χ²/ν is much larger than 1, the model is incomplete and the true uncertainties are larger.

**Can I fit a whole spectrum at once?** Fit one region at a time; up to 8 peaks per region.

**Is it suitable for regulated measurements?** It is for study and planning, not a substitute for professional judgement or validated spectroscopy software.
