---
name: DLS analyser
num: 859
shelf: science
code: T595
section: nanoscience
title: "DLS analyser: z-average, PDI and size distribution from a dynamic light scattering correlation function"
summary: "Paste or open a DLS intensity autocorrelation g2(τ). Get the z-average diameter and polydispersity index by 2nd- or 3rd-order cumulants, and a regularised non-negative (CONTIN-like) size distribution by intensity, volume and number, from your wavelength, angle, refractive index, temperature and viscosity."
status: live
ads: true
order: 859
icon: chart
works: offline
updated: 2026-11-09
related: [nanoparticle-calculator, diffusion-calculator, polymer-molar-mass, centrifuge-calculator, quantum-dot-size, particle-size-image, afm-roughness]
sources:
  - "Cumulant method (Koppel 1972, J. Chem. Phys. 57, 4814; ISO 22412), Stokes–Einstein relation and the scattering vector q = 4πn sin(θ/2)/λ are standard physics. The distribution fit is a non-negative least-squares fit (Lawson and Hanson 1974) with a second-difference smoothing penalty, in the spirit of Provencher's CONTIN (1982); fibub's code is its own."
  - "Viscosity of water from the Kestin, Sokolov and Wakeham (1978) correlation, J. Phys. Chem. Ref. Data 7, 941 (a formula); checked in the tests against IAPWS 2008 to within 0.3 %."
  - "The example correlation function is made up (two lognormal populations with seeded noise). Nothing you paste or open is sent or stored."
flow:
  - { icon: file, label: "g2(τ)" }
  - { icon: sliders, label: "Setup" }
  - { icon: curve, label: "Cumulants" }
  - { icon: chart, label: "Sizes" }
---

## What it does

Dynamic light scattering (DLS) measures how fast the speckle of laser light scattered by particles flickers as they diffuse. The instrument turns that into an intensity autocorrelation function g2(τ), which falls from about 1 + β at short delay times to 1 at long ones. Small particles diffuse fast, so their correlation decays early; large particles decay late. This page takes the correlation function itself, the raw data most instruments can export, and does the analysis openly so you can see every step:

- **Cumulants.** It fits ln(g2 − B) with a polynomial in τ (2nd or 3rd order). The first cumulant Γ is the mean decay rate; the Stokes–Einstein relation turns it into the **z-average diameter**. The second cumulant divided by Γ² is the **polydispersity index (PDI)**.
- **Size distribution.** It splits the decay into many sizes on a log grid, none allowed to be negative, with a penalty on rough shapes, like the CONTIN program. You get the distribution by **intensity**, and converted to **volume** and **number**.
- **Peaks.** Each peak's mean, mode, width and share, for the distribution you pick, and a check that the intensity harmonic mean matches the z-average.

Turn the size into surface area and particle counts with the [[nanoparticle-calculator]], and compare it with sizes measured from images in the [[particle-size-image]] tool.

## How to use it

1. Paste two columns, delay time then correlation, or open a CSV, TXT or Excel file. Say whether τ is in µs, ms or s and whether the second column is g2 or g2 − 1. Pick the baseline: 1 for a normalised g2, or the mean of the last points if your data level off somewhere else.
2. Type the temperature, laser wavelength (633 nm for a red He-Ne laser, 532 nm for green), scattering angle (173° for back-scatter instruments, 90° for side-scatter) and the liquid's refractive index. For water the viscosity is worked out from the temperature; for any other liquid pick "other" and type it.
3. Read the z-average and PDI. Change the fit order or the cut-off (how far down the decay the fit goes) and see how stable the answer is.
4. Look at the distribution. Change the smoothing α and the size range: real peaks stay, artefacts move or vanish.
5. Download the distributions and fits as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example is made up: 85 % of the light from particles near 60 nm and 15 % from particles near 400 nm, in water at 25 °C, measured at 173° with a 633 nm laser. The page gives q = 0.02635 nm⁻¹ and a water viscosity of 0.8901 mPa·s. The 2nd-order cumulant fit uses the first 72 points and gives **z-average 67.83 nm, PDI 0.169**: one number that sits between the two populations, which is why the PDI is moderate. With smoothing 0.01 the intensity distribution shows two peaks, at about **61.9 nm (85.4 %)** and **370 nm (14.6 %)**, close to the made-up truth, and its harmonic mean, 67.79 nm, matches the z-average. By volume and by number the large peak all but disappears, because 400 nm particles scatter so much more light each.

## Tips

- **Dust** shows up as a slow tail or a peak at the largest sizes. Filter the sample and remeasure rather than trust it.
- **Intercept β** well below the usual value for your instrument means a weak signal, too dilute or too concentrated a sample, or misalignment.
- **Volume and number** use Rayleigh weighting (scattered light ∝ d⁶) with no Mie correction, so they are only right for particles much smaller than the wavelength. For larger particles use your instrument's Mie conversion with the particle's refractive index.
- PDI and z-average follow ISO 22412 in spirit, but every instrument picks its own fit range and weights, so small differences from the instrument's report are normal.

## FAQ

**Why do the distribution and the z-average disagree?** They answer different questions. The z-average is one intensity-weighted harmonic mean; the distribution splits the light between sizes. The harmonic mean of the intensity distribution should match the z-average, and the page shows both.

**What does smoothing do?** Recovering a distribution from a decay is ill-posed: many shapes fit the data equally well. The penalty picks the smoothest one that still fits. Too little gives spikes; too much merges real peaks.

**Can I use other liquids?** Yes: type the viscosity in mPa·s and the refractive index at the laser wavelength and temperature.

**Is my data uploaded?** No. Everything runs in your browser.
