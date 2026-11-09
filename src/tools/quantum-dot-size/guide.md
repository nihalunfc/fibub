---
name: Quantum dot size (Brus equation)
num: 860
shelf: science
section: nanoscience
title: "Quantum dot size calculator: Brus equation from absorption peak or band gap to diameter, and back"
summary: "Turn a quantum dot's first absorption peak or band gap into its size with the Brus equation, or a size into its gap and peak wavelength, using your own bulk gap, effective masses and dielectric constant. Shows the confinement and Coulomb terms, the exciton Bohr radius, a plot of gap against diameter, and an optional sizing curve of your own."
status: live
ads: true
order: 860
icon: target
works: offline
updated: 2026-11-09
related: [tauc-plot, carrier-concentration, blackbody-calculator, wave-calculator]
sources:
  - "The Brus equation (effective-mass model of a spherical dot with confinement, Coulomb and polarisation terms) and the exciton Bohr radius are standard; the code is written by fibub and checked in the tests against NumPy with scipy.constants and scipy.optimize (brentq, minimize_scalar)."
  - "The example materials (CdSe-like, CdS-like, PbS-like) use rounded values made up to behave like those materials. They are not reference data; type your own. No empirical sizing curve is included: you type your own coefficients."
flow:
  - { icon: flask, label: "Material" }
  - { icon: chart, label: "Peak or gap" }
  - { icon: curve, label: "Brus curve" }
  - { icon: target, label: "Size" }
---
## What it does

A semiconductor crystal only a few nanometres across, a quantum dot, has a larger band gap than the bulk material: squeezing the electron and hole into a small space raises their energy. Smaller dots absorb and glow bluer. The Brus equation puts numbers on this for a spherical dot of radius R:

E(R) = Eg + ħ²π²/(2R²) · (1/mₑ* + 1/mₕ*) − 1.786 e²/(4πε₀εR)

The first term after the bulk gap Eg is the confinement energy; the second is the electron-hole attraction. Brus also gave a small polarisation correction, −0.248 E*Ry, which you can switch on. This page:

- **Size to gap.** Gives the dot's gap and the wavelength of its first absorption peak for a diameter.
- **Gap or peak to size.** Solves the equation backwards, on the small-dot side of the curve, for the radius and diameter.
- **Shows the parts.** The confinement, Coulomb and polarisation terms, the exciton Bohr radius aB = ε(m₀/μ)a₀, and how the dot compares with it.
- **Plots** the gap against diameter, with the bulk gap and twice the Bohr radius marked.
- **Your own sizing curve.** Many labs size dots with an empirical polynomial fitted to microscope sizes. The page does not include any; type the coefficients of the curve you use, and it is shown beside the Brus result.

## How to use it

1. Pick an example material or type your bulk gap, electron and hole effective masses and dielectric constant.
2. Say what you know: the diameter, the gap in eV, or the first absorption peak in nm. Type the value.
3. Read the size or the gap. The plot range is up to you.
4. Optional: type your sizing polynomial D(λ) = c0 + c1λ + c2λ² + … and the wavelength range it is valid for.
5. Download the Brus curve as CSV, or the report as PNG, PDF or Word.

## Worked example

The page opens with the CdSe-like example (Eg = 1.74 eV, mₑ* = 0.13, mₕ* = 0.45, ε = 10.6) and a first absorption peak at 560 nm. That is 1239.84/560 = **2.214 eV**. The Brus equation is solved for R = **2.56 nm**, a **5.12 nm** dot. The confinement term is +0.5688 eV and the Coulomb term −0.0948 eV. The exciton Bohr radius is 5.561 nm, so the dot is well inside the strong-confinement regime (R = 0.46 aB).

## Tips

- The Brus equation is known to overestimate the gap of the smallest dots (below about 2 to 3 nm), because real bands are not parabolic and the walls are not infinitely high. Empirical curves fitted to microscope sizes are usually better for a well-studied material; use the Brus result to compare or for new materials.
- The absorption peak is not the emission peak: emission is shifted a little to the red (the Stokes shift).
- Effective masses and dielectric constants differ between sources. Use the values your field uses, and say which in your methods.

## FAQ

**Why does it say there is no size for my peak?** The peak is at or below the bulk gap, or so close to it that the dot would be larger than the confinement regime. Check the wavelength and the bulk gap.

**Does it work for rods or platelets?** No: the equation is for spheres.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
