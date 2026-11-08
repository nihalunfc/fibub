---
name: Redshift calculator
num: 55
shelf: science
section: galactic-and-extragalactic-astronomy
title: "Redshift calculator: z to velocity (relativistic, optical, radio) and where spectral lines land"
summary: "Convert between redshift, velocity in the relativistic, optical and radio conventions, and observed wavelength or frequency of any common spectral line, with the cosmological recession velocity."
status: live
ads: true
order: 12
icon: curve
works: offline
updated: 2026-11-08
related: [cosmology-calculator, magnitude-flux-converter, sky-coordinates, uncertainty-calculator]
flow:
  - { icon: target, label: "Measure" }
  - { icon: sliders, label: "Convention" }
  - { icon: curve, label: "Redshift" }
---

## What it does

Redshift z tells you how much a source's light has been stretched: every wavelength arrives 1 + z times longer than it left. It is the first number you measure from a galaxy spectrum and the way radio astronomers find hydrogen and molecules. Turning it into a velocity is less simple than it looks. There are three conventions in common use, and they disagree badly at high z. This calculator converts between redshift, velocity in each convention, and the observed wavelength or frequency of a spectral line. It lists where all the common lines land, and gives the recession velocity and distance if the redshift comes from cosmic expansion.

## How to use it

1. Choose what you know: the **redshift**, a **velocity**, or where you measured a line, as a **wavelength** or a **frequency**.
2. For a velocity, choose the **convention** it was quoted in. Catalogues of galaxies usually give cz; radio surveys give radio velocities.
3. For a line, type the observed value, pick its unit and pick the line. Choose "Another line" to type any rest value in the same unit.
4. Read the results, the table of where every common line falls, and the chart comparing the conventions.

## The three conventions

- **Relativistic**: the special relativity Doppler formula, 1 + z = √((1 + β)/(1 − β)). It is a real speed through space and never reaches c.
- **Optical**: v = cz. Simple and standard in galaxy catalogues, accurate to about 5 % up to z = 0.1, and above c for z > 1.
- **Radio**: v = c (1 − 1/(1 + z)), which keeps velocity proportional to frequency shift. Used for 21 cm hydrogen and molecular lines.
- **Recession velocity**: for distant galaxies, redshift comes from the expansion of space. The recession velocity is the Hubble constant times today's distance (Planck 2018 cosmology). It passes c at about z = 1.5 without breaking relativity.

## Worked example

A galaxy shows Hα at 689.1 nm, against a rest wavelength of 656.281 nm, so z = 0.0500. Its relativistic velocity is 14,617 km/s, its optical velocity cz is 14,992 km/s and its radio velocity is 14,278 km/s. If the redshift is cosmological, the galaxy is about 219 Mpc away today, receding at about 14,815 km/s, and its light set out roughly 697 million years ago. Its [O III] line appears at about 525.7 nm and its 21 cm line at 1352.7 MHz.

## Frequently asked questions

**Which convention should I use?** The one your field uses, and say so. For a peculiar velocity in a cluster, work out the cluster's redshift first and use the relativistic formula for the difference.

**Are the wavelengths in air or vacuum?** Optical lines are air wavelengths, as usually listed; ultraviolet and radio lines are in vacuum. The difference is about 0.03 % and only matters for precise work.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
