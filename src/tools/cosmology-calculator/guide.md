---
name: Cosmology calculator
num: 41
shelf: science
section: galactic-and-extragalactic-astronomy
title: "Cosmology calculator: lookback time, age and distances for any redshift (Planck 2018)"
summary: "Type a redshift and get the age of the universe then, the lookback time, comoving, angular diameter and luminosity distances, kpc per arcsecond and the distance modulus, for Planck 2018, WMAP or your own cosmology."
status: live
ads: true
order: 10
icon: orbit
works: offline
updated: 2026-11-08
related: [sky-coordinates, telescope-calculator, uncertainty-calculator, plot-maker]
sources:
  - "Distance formulas: Hogg (1999), Distance measures in cosmology."
  - "Preset parameters: Planck 2018 and WMAP 9-year published results (two numbers each), and round textbook values."
flow:
  - { icon: target, label: "Redshift" }
  - { icon: sliders, label: "Cosmology" }
  - { icon: ruler, label: "Distances" }
---

## What it does

In an expanding universe, "how far away" has several answers. A galaxy's light set off long ago, the galaxy is much further away now, and the distance you need depends on whether you are turning a flux into a luminosity or an angle into a size. This calculator works them all out from one redshift: the age of the universe now and when the light left, the lookback time, the comoving, angular diameter and luminosity distances, the physical scale in kpc per arcsecond, the distance modulus, the comoving volume, the Hubble rate and the CMB temperature at that redshift. A chart shows how the distances grow with redshift.

To turn a velocity or a spectral line into a redshift first, use the [[redshift-calculator]]; to fit how fast a galaxy spins, the [[rotation-curve-fitter]].

## How to use it

1. Type the **redshift z**, for example 0.05 for a nearby galaxy cluster or 3 for a distant galaxy.
2. Choose a **cosmology**. Planck 2018 is the default. WMAP 9-year and the round textbook values (H0 = 70, Ωm = 0.3) are there too, or type your own.
3. Leave **Flat universe** ticked unless you need curvature. Then ΩΛ is set so everything adds up to 1. Untick it to type ΩΛ yourself; the curvature Ωk is then 1 − Ωm − ΩΛ − Ωr.
4. **Include radiation** adds photons and neutrinos (CMB at 2.7255 K, Neff = 3.046). It matters at high redshift and makes the ages match those published by Planck.
5. Download the results with the chart as PNG, PDF or Word.

## What each number means

- **Lookback time** is how long the light has been travelling.
- **Comoving distance** is where the object is now, measured along the line of sight.
- **Angular diameter distance** turns an angle on the sky into a physical size. It reaches a maximum near z = 1.6 and then falls, so very distant galaxies look larger again.
- **Luminosity distance** turns the flux you measure into the luminosity the object gives out. The distance modulus is 5 log₁₀(D_L / 10 pc).
- **kpc per arcsecond** is the size of one arcsecond at that redshift.
- **Recession velocity** is shown as cz and as a special-relativity Doppler speed. At high redshift neither is a real velocity; use the distances instead.

## Worked example

With Planck 2018 (H0 = 67.66 km/s/Mpc, Ωm = 0.3111, flat) the universe is 13.786 billion years old, matching Planck's 13.787 ± 0.020. A galaxy at z = 3 sent out its light 11.643 billion years ago, when the universe was 2.143 billion years old. It is now 6,504 Mpc away (comoving). Its angular diameter distance is 1,626 Mpc, so one arcsecond spans 7.883 kpc. Its luminosity distance is 26,015 Mpc, a distance modulus of 47.076.

## Frequently asked questions

**How are the results worked out?** By numerical integration of the Friedmann equation, following Hogg's "Distance measures in cosmology" (1999). Checks against exact formulas (matter-only, empty and flat ΛCDM universes) agree to better than 1 part in a million.

**Why do my numbers differ a little from another calculator?** Different defaults: H0, Ωm, whether radiation is included, and whether massive neutrinos are counted. Set the same values and the results agree.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
