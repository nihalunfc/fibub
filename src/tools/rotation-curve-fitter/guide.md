---
name: Galaxy rotation curve fitter
num: 69
shelf: science
section: galactic-and-extragalactic-astronomy
title: "Galaxy rotation curve fitter: bulge, disc and dark matter halo (NFW or isothermal)"
summary: "Paste a galaxy's rotation curve and fit a bulge, an exponential disc and a dark halo: masses with uncertainties, how much of the galaxy is dark matter, and the halo's total mass."
status: live
ads: true
order: 20
icon: curve
works: offline
updated: 2026-11-08
related: [redshift-calculator, cosmology-calculator, radial-velocity-fitter, plot-maker, uncertainty-calculator]
sources:
  - "Models: Hernquist bulge, Freeman (1970) disc, NFW and pseudo-isothermal halos."
  - "Example data: simulated by fibub."
flow:
  - { icon: table, label: "Speeds" }
  - { icon: curve, label: "Fit model" }
  - { icon: sigma, label: "Dark matter" }
---

## What it does

Stars and gas in a spiral galaxy orbit its centre. How fast they go at each radius, the **rotation curve**, measures how much mass lies inside that radius. If galaxies were made only of the stars we see, speeds would fall off beyond the bright disc, like the planets round the Sun. Instead they stay flat far out. That is the classic evidence for **dark matter**.

This tool fits a three-part mass model to a measured rotation curve. The parts are a central **bulge** (a Hernquist profile), a thin **exponential disc** (Freeman's solution) and a **dark halo**, either the cuspy NFW profile predicted by cold dark matter simulations or a cored pseudo-isothermal sphere. It gives each part's mass and size with uncertainties, plots each part's own contribution, and reports the share of dark matter inside the last measured point. It also gives the radius where the halo starts to outweigh the stars and, for NFW, the halo's total mass M₂₀₀ and concentration.

## How to use it

1. Paste the curve: radius in kiloparsecs, circular speed in km/s and, if you have them, the error of each speed. Columns can be separated by tabs, commas or spaces. **Load the example** fills in a simulated Milky Way-like galaxy.
2. Choose the **dark halo** shape. Tick **No bulge** for late-type or dwarf galaxies.
3. If photometry gives you the disc's **scale length**, type it in. It breaks most of the disc–halo trade-off.
4. Read the fit, check the residuals for any pattern, and download the model curves as a CSV or the page as a PNG, PDF or Word file.

## How it is worked out

Each part adds in quadrature: v² = v²(bulge) + v²(disc) + v²(halo).

- **Hernquist bulge**: v² = G M r / (r + a)².
- **Exponential disc** of mass M and scale length R<sub>d</sub>: v² = 4πGΣ₀R<sub>d</sub>y²[I₀(y)K₀(y) − I₁(y)K₁(y)], with y = R/2R<sub>d</sub>, using modified Bessel functions.
- **NFW halo**: v² = 4πGρ<sub>s</sub>r<sub>s</sub>³[ln(1 + x) − x/(1 + x)]/r, with x = r/r<sub>s</sub>.
- **Pseudo-isothermal halo**: v² = 4πGρ₀r<sub>c</sub>²[1 − (r<sub>c</sub>/r) arctan(r/r<sub>c</sub>)].

The fit minimises χ² over the logarithms of the parameters with a simplex search from several starting points. Uncertainties come from the curvature of χ². G is 4.30091 × 10⁻⁶ kpc (km/s)² per solar mass.

## Worked example

The example galaxy was simulated with a 1.0 × 10¹⁰ M☉ bulge, a 5.0 × 10¹⁰ M☉ disc with a 3.0 kpc scale length, and an NFW halo. Thirty speeds run from 1 to 30 kpc with 4 to 7 km/s noise. With everything free, the fit finds a disc of (5.3 ± 2.7) × 10¹⁰ M☉ with a scale length of 2.95 ± 0.56 kpc. Dark matter is **80 %** of the 3.1 × 10¹¹ M☉ inside 30 kpc, just as in the simulation, and the halo outweighs the stars beyond about 11 kpc. Fixing the scale length at 3.0 kpc shrinks the disc's uncertainty from ±2.7 to ±1.0 × 10¹⁰ M☉. The NFW halo extends to r₂₀₀ ≈ 220 kpc and holds about 1.2 × 10¹² M☉ in all, with concentration 11. A cored isothermal halo fits these data just as well, so these data alone cannot tell a cusp from a core.

## Frequently asked questions

**Why are the uncertainties so large?** A heavier disc and a lighter halo can trace almost the same curve: the disc–halo degeneracy. Photometry, or the "maximum disc" assumption, is needed to pin it down.

**Where do I get data?** The SPARC database of 175 galaxies, papers on individual galaxies, or your own long-slit or 21 cm observations.

**What about gas?** Neutral hydrogen adds its own disc. Here it is absorbed into the stellar disc, which raises the disc mass slightly.

**Does it work offline?** Yes. The fit runs in your browser, and your data never leave your device.
