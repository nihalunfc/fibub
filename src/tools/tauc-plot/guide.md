---
name: Tauc plot band gap
num: 863
shelf: science
section: semiconductors-and-electronics-materials
title: "Tauc plot calculator: optical band gap from UV-Vis absorbance, transmittance or diffuse reflectance, with Urbach energy"
summary: "Open a UV-Vis spectrum and get the optical band gap from a Tauc plot: absorbance, transmittance or diffuse reflectance (Kubelka-Munk) turned into (αhν)^n for direct or indirect transitions, the straight part of the edge found for you or chosen by hand, the gap where the line meets zero or a baseline, with its error and window spread, plus the Urbach energy."
status: live
ads: false
order: 863
icon: chart
works: offline
updated: 2026-11-09
related: [carrier-concentration, beer-lambert-calculator, plot-maker]
sources:
  - "The Tauc relation (αhν)^n ∝ (hν − Eg), the Kubelka-Munk function, the Urbach rule and straight-line fitting with delta-method errors are standard; the code is written by fibub and checked in the tests against NumPy (polyfit with covariance) and exact synthetic spectra with known gaps."
  - "The example spectrum is made up by the page: a 400 nm film with a direct gap of 2.40 eV and a 50 meV Urbach tail, with made-up noise."
  - "A spectrum you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Spectrum" }
  - { icon: sliders, label: "(αhν)ⁿ" }
  - { icon: ruler, label: "Line fit" }
  - { icon: target, label: "Band gap" }
---
## What it does

A semiconductor or insulator lets light through until the photons carry enough energy to lift an electron across the band gap; then it starts to absorb. The Tauc method turns that absorption edge into a number. Near the edge the absorption coefficient α follows (αhν)^n ∝ (hν − Eg), so plotting (αhν)^n against the photon energy hν gives a straight line that meets the energy axis at the gap. This page does it from your own spectrum:

- **Any common reading.** Absorbance, transmittance (per cent or 0 to 1), α itself, or diffuse reflectance from a powder, which goes through the Kubelka-Munk function F(R) = (1 − R)²/2R. Wavelength in nm, energy in eV or wavenumber in cm⁻¹.
- **Transition type.** n = 2 for direct allowed transitions, ½ for indirect allowed, ⅔ and ⅓ for the forbidden ones.
- **Linear region.** Found automatically (the steepest straight stretch, grown while the next points stay on the line) or given as two energies.
- **Band gap with honest error bars.** The x-intercept and its standard error from the fit, plus the window spread: how far the gap moves when the region's ends shift by about 10 %. The spread is usually the larger of the two and the one worth quoting.
- **Baseline.** When the sample absorbs below the gap, the line can cross a straight baseline fitted to the sub-gap part instead of zero.
- **Urbach energy.** The slope of ln α below the gap gives the width of the absorption tail, Eu.

## How to use it

1. Paste or open the spectrum: two columns, wavelength (or energy) then the reading. A header row is fine.
2. Say what each column holds. Give the film thickness if you want α in cm⁻¹; the gap is the same without it.
3. Pick the transition. If you are not sure, try both direct and indirect: the right one usually gives the longer straight part.
4. Check the Tauc plot. If the highlighted region is not the steep straight part of the edge, choose the region yourself.
5. Download the Tauc data as CSV or the report as PNG, PDF or Word.

## Worked example

Press *Use the example*. The page draws a made-up 400 nm film with a direct gap of 2.40 eV and a 50 meV Urbach tail, from 400 to 700 nm, with a little noise. Read as absorbance with n = 2, the page picks 51 points from 2.417 to 2.678 eV and finds **Eg = 2.39932 ± 0.00012 eV** (516.7 nm). The window spread is 2.397 to 2.399 eV, larger than the fitting error, so the page says to quote the spread. The tail from 2.292 to 2.398 eV gives an **Urbach energy of 53.22 ± 0.33 meV**, a little above the 50 meV used to draw it, because the tail joins the edge smoothly.

## Tips

- Very strong absorbance (above about 2.5) is mostly stray light and noise and bends the top of the line; cut it off or set the region by hand.
- Thin films show interference fringes below the gap; they can upset the baseline and the Urbach fit. Choose those regions by hand.
- A Tauc gap is an optical gap. It is not always the same as the gap from electrical measurements or photoluminescence.

## FAQ

**Direct or indirect?** It is a property of the material, not something the plot decides. Use the literature for your material. A long straight stretch with one n and a curved one with the other is a hint, not proof.

**Why is the ± so small?** It only covers the scatter of points around the line. How the region is chosen matters more, which is why the window spread is shown too.

**Is my spectrum uploaded?** No. It is read in your browser and never leaves it.
