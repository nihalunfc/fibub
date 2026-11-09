---
name: Sellmeier fitter
num: 935
shelf: science
section: optics-and-photonics
title: "Sellmeier and Cauchy equation fitter: fit refractive index against wavelength, Abbe number and dispersion"
summary: "Paste or open measured refractive index against wavelength and fit a Sellmeier (1 to 3 terms) or Cauchy equation: coefficients with standard errors, residuals, the index at any wavelength, Abbe number, group index and group-velocity dispersion, with every model compared."
status: live
ads: true
order: 6
icon: curve
works: offline
updated: 2026-11-09
related: [thin-film-coating, lens-ray-tracer, fibre-optic-calculator, plot-maker, spectrometer-calibration, polarisation-calculator, gaussian-beam, curve-fitter, uncertainty-calculator]
sources:
  - "Sellmeier and Cauchy dispersion equations, Abbe number with the d, F and C Fraunhofer lines (587.5618, 486.1327 and 656.2725 nm, general spectroscopic constants), group index and group-velocity dispersion: standard textbook results, for example Born and Wolf, Principles of Optics, and Agrawal, Nonlinear Fiber Optics, chapter 1."
  - "Fitting: separable (variable projection) linear least squares for the B coefficients, Nelder-Mead for the resonances, then Levenberg-Marquardt on the index residuals."
  - "Checked against SciPy least_squares (Sellmeier) and NumPy lstsq (Cauchy) on the same data, and derivatives against SymPy. The example 'glass' is generated from made-up coefficients with made-up noise; no glass catalogue data is copied."
flow:
  - { icon: table, label: "Data" }
  - { icon: curve, label: "Fit" }
  - { icon: sigma, label: "Coefficients" }
  - { icon: download, label: "Download" }
---

## What it does

The refractive index of glass, crystals and liquids changes with wavelength: that is **dispersion**, the reason a prism splits white light. To use a material in a design you need a smooth formula for n(λ) that passes through your measurements. This tool fits the two standard ones:

- **Sellmeier:** n² = 1 + Σ Bᵢ λ² / (λ² − Cᵢ). Each term is a resonance (an absorption) at a wavelength √Cᵢ, usually two in the ultraviolet and one in the infrared. It is physically based and extrapolates well.
- **Cauchy:** n = A + B/λ² + C/λ⁴. Simple and fine across visible light, but it goes wrong further out.

From the fitted curve it gives the index at any wavelength, the **Abbe number**, the **group index**, the **group-velocity dispersion** β₂ and the fibre-optics **dispersion parameter D**.

Use your fitted indices to design a coating in the [[thin-film-coating|thin-film coating calculator]] or to trace rays through a lens in the [[lens-ray-tracer|lens ray tracer]].

## How to use it

1. Paste two columns, **wavelength** and **refractive index**, from a spreadsheet or text file, or press **Open a file** (CSV, TSV, TXT or Excel). A header row is fine.
2. Choose the **wavelength unit**, or let it guess (values above 50 are taken as nm).
3. Pick a **model**. You need more data points than coefficients: 7 or more for a 3-term Sellmeier.
4. Set the wavelength to **evaluate at**. The table at the bottom compares every model on your data.

## What the results mean

- **Residuals** (measured minus fitted) should look like random scatter around zero at about the size of your measurement error. A wave-like pattern means the model is too simple.
- **Standard errors** come from the fit. With visible-only data, the infrared Sellmeier term's B and C are strongly correlated and get large errors, even though the curve itself is well fixed.
- **Abbe number** V_d = (n_d − 1)/(n_F − n_C): high (above about 50) for low-dispersion crown-like glasses, low for flint-like ones.
- **Group index** n − λ dn/dλ sets the speed of a light pulse; **β₂** tells you whether short pulses spread with red ahead (positive, normal dispersion) or blue ahead (negative, anomalous).

## Worked example

The example is a made-up glass: 14 points from 380 to 1,600 nm, generated from invented Sellmeier coefficients with small made-up noise and rounded to five decimals. The 3-term Sellmeier fit leaves an **RMS residual of 1.1 × 10⁻⁵** (largest 1.6 × 10⁻⁵), at the level of the added noise, with resonances at 0.0863, 0.188 and 15.2 µm. It gives **n_d = 1.52968** and an **Abbe number of 49.64**. At 1,550 nm the index is 1.51038, the group index 1.53103 and β₂ = −15.80 fs²/mm (anomalous, D = 12.39 ps/(nm·km)). The comparison table shows the 2-term Sellmeier nine times worse (RMS 9.8 × 10⁻⁵) and the 3-term Cauchy about a hundred times worse (1.0 × 10⁻³): Cauchy cannot follow the index into the infrared.

## FAQ

**Which model should I use?** The simplest one whose residuals look like noise. Sellmeier with 2 or 3 terms for data spanning visible to infrared; Cauchy for a narrow visible range.

**Can I trust it outside my data?** Sellmeier extrapolates sensibly a little way; Cauchy does not. The page marks extrapolated values.

**Is this a glass catalogue?** No: no catalogue data is included. Use your own measurements, or your supplier's certified data for real designs. For study and planning.
