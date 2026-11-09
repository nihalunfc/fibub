---
name: Thin-film thickness from fringes
num: 865
shelf: science
section: semiconductors-and-electronics-materials
title: "Thin film thickness calculator from interference fringes: Swanepoel envelope method, refractive index and fringe counting"
summary: "Work out a thin film's thickness from the interference fringes in its transmittance or reflectance spectrum: Swanepoel's envelope method gives the refractive index at every fringe and the thickness from whole-number orders; with a known index (constant or Cauchy) the fringe positions are enough; or count fringes between two wavelengths."
status: live
ads: false
order: 865
icon: ruler
works: offline
updated: 2026-11-09
related: [tauc-plot, carrier-concentration, wave-calculator, plot-maker]
sources:
  - "The thin-film transmittance formula and envelope method of Swanepoel (1983), interference orders 2nd = mλ, the Cauchy dispersion formula and fringe counting are standard optics; the code is written by fibub and checked in the tests against an independent transfer-matrix calculation, SciPy (find_peaks, CubicSpline) and NumPy."
  - "The example spectrum is made up by the page: a 1000 nm film with n = 2.2 + 3×10⁴/λ² (λ in nm) and weak absorption on a substrate with s = 1.5, with made-up noise."
  - "A spectrum you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Spectrum" }
  - { icon: target, label: "Fringes" }
  - { icon: sigma, label: "Index n" }
  - { icon: ruler, label: "Thickness" }
---
## What it does

Light reflected from the top and bottom of a thin film interferes, so the transmittance or reflectance spectrum of a film a few hundred nanometres to a few micrometres thick goes up and down in fringes. Where the fringes fall depends on the film's thickness d and refractive index n: at every maximum or minimum, 2nd = mλ, with m a whole number at one kind of extremum and a half at the other. This page turns the fringes into a thickness three ways:

- **Swanepoel's envelope method** (transmittance of a film on a thick transparent substrate). The page finds the maxima and minima, draws smooth upper and lower envelopes through them, and gets n at each fringe from N = 2s(T_M − T_m)/(T_M T_m) + (s² + 1)/2 and n = √(N + √(N² − s²)). Neighbouring fringes give a first thickness d₁; each fringe's order is then rounded to a whole (or half) number, and d = mλ/2n from every fringe gives the final thickness and its spread. The orders also give a refined index n₂, and the upper envelope gives the absorption coefficient α where the film absorbs weakly.
- **Fringe positions with a known index.** With n constant or following Cauchy's n = A + B/λ², the positions alone give d, in transmittance or reflectance, at any angle of incidence.
- **Fringe count.** N whole fringes between λ₁ and λ₂ give d = N / (2n(1/λ₁ − 1/λ₂)).

## How to use it

1. Pick the method.
2. Paste or open the spectrum (wavelength in nm or µm, or wavenumber in cm⁻¹ for infrared), and say whether it is transmittance or reflectance, in per cent or 0 to 1.
3. Check the fringes marked on the plot. If noise makes extra ones, raise the window, the smoothing or the smallest-fringe setting; if close fringes are missed, lower them.
4. Give the substrate index (or the bare substrate's transmittance) for the envelope method, or the film index for the others.
5. Read the thickness, check the fringe table, and download the table as CSV or the report as PNG, PDF or Word.

## Worked example

Press *Use the example*. The page draws a made-up 1000 nm film with n = 2.2 + 3×10⁴/λ² on a substrate with s = 1.5, from 500 to 1500 nm, with weak absorption at the blue end and a little noise. It finds 13 fringe extrema; 11 lie inside both envelopes. The first estimate is **d₁ = 1001 ± 10 nm**; with the orders rounded (8.5 at 541.5 nm down to 3.5 at 1266.2 nm) the thickness is **d = 999.5 ± 0.6 nm**. The index comes out as 2.303 at 541.5 nm falling to 2.217 at 1266.2 nm, within 0.005 of the index used to draw the spectrum.

## Tips

- If d₁ and d disagree or the spread is large, the orders are probably off by one: try an order shift of +1 or −1 and keep the one with the smallest spread.
- Swanepoel's formulas need the film's index above the substrate's and fringes that are not damped away; near the absorption edge the indices get poor.
- In reflectance from a film above a lower-index substrate, minima sit at whole orders; untick the index box when the film's index is lower than the substrate's.
- For an infrared (FTIR) spectrum in wavenumbers, choose cm⁻¹ and the page converts.

## FAQ

**Why do the first and last fringes not appear in the table?** The envelope method needs both envelopes at each fringe, and the outermost fringes lie beyond the last fringe of the other kind.

**How accurate is it?** For a good film and spectrum, about 1 % or better. The thickness is only as good as the index, and a rough or wedge-shaped film flattens the fringes.

**Is my spectrum uploaded?** No. It is read in your browser and never leaves it.
