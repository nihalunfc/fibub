---
name: Plasma parameter calculator
num: 952
shelf: science
section: plasma-physics
title: "Plasma parameter calculator: Debye length, plasma frequency, gyroradius, collision frequency and beta"
summary: "From density, electron and ion temperatures, magnetic field and the ion, get the Debye length, plasma and cyclotron frequencies, gyroradii, thermal, sound and Alfvén speeds, Coulomb logarithm, collision times and mean free paths, plasma beta and a plain verdict on what kind of plasma it is."
status: live
ads: true
order: 1
icon: calculator
works: offline
updated: 2026-11-09
related: [blackbody-calculator, gas-law-calculator, uncertainty-calculator]
sources:
  - "Formulas: standard plasma physics results, for example Chen, F. F., Introduction to Plasma Physics and Controlled Fusion, and the NRL Plasma Formulary (US Naval Research Laboratory, public domain), which also gives the Coulomb logarithm used here."
  - "Collision times: Braginskii, S. I. (1965), Transport processes in a plasma, Reviews of Plasma Physics 1. Spitzer resistivity coefficient 0.51 for Z = 1."
  - "Constants: CODATA 2018 values (rounded as used in SciPy)."
  - "Checked against the NRL formulary's shortcut formulas and an independent SciPy script written for the tests. The presets are rounded, typical orders of magnitude, not measurements."
flow:
  - { icon: sliders, label: "Plasma" }
  - { icon: ruler, label: "Lengths" }
  - { icon: clock, label: "Frequencies" }
  - { icon: check, label: "Regime" }
---

## What it does

A plasma is a gas hot enough that its atoms have lost electrons, so it is full of free charges. Whether it behaves like a plasma at all, and which physics matters, depends on a handful of numbers that all follow from the density, the temperatures and the magnetic field. This calculator works them all out at once, in SI units, and says in plain words what they mean.

## How to use it

1. Pick a **preset** (a tokamak, a glow discharge, the solar wind, the ionosphere or a plasma etcher) or type your own values. The presets are rounded, typical orders of magnitude, there to show the range.
2. **Electron density** in per m³ or per cm³. The ion density is worked out as nₑ ÷ Z.
3. **Temperatures** as kT in electronvolts or in kelvin (switching the unit converts what you typed). 0 for the ion temperature means cold ions.
4. **Magnetic field** in tesla, gauss or nanotesla; 0 for none.
5. Choose the **ion**, or type its mass in atomic mass units and its charge.
6. Optionally give the **size** of the plasma, to check quasi-neutrality and whether it is collisional, and a **Coulomb logarithm** if you want to fix it.

## What the results mean

- **Debye length λD:** beyond this distance, the charges rearrange to screen out any electric field. A plasma must be much larger than λD.
- **ND, particles in a Debye sphere:** much more than 1 for an ideal plasma. Below 1 the plasma is strongly coupled and these formulas fail.
- **Plasma frequency fpe:** how fast electrons oscillate when pushed. Radio waves below it are reflected, which is why the ionosphere bounces short-wave radio.
- **Cyclotron frequencies and gyroradii:** how fast and in how small a circle charges spiral around the field lines, using the thermal speed √(kT/m).
- **Collision times, frequencies and mean free paths:** from Braginskii's formulas. If the mean free path is longer than the plasma, it is collisionless.
- **Hall parameter ωτ:** above 1, particles circle many times between collisions and are magnetised.
- **Beta:** plasma pressure over magnetic pressure. Fusion devices aim for a few per cent; the solar wind sits near 1.
- **Alfvén and ion sound speeds:** the speeds of the slowest common waves.

## Worked example

The page opens on a tokamak-like plasma (rounded, made up): nₑ = 10²⁰ m⁻³, Tₑ = Tᵢ = 10 keV (10 000 eV), B = 5 T, deuterium. The Debye length is **74.3 µm** and the plasma frequency **89.8 GHz**, with **β = 0.0322**. The electron gyroradius is 47.7 µm and the deuteron gyroradius 2.88 mm. The Coulomb logarithm is 17.1, the electron collision time 201 µs and the electron mean free path 8.44 km, far longer than the 1 m machine, so the core is collisionless. There are 1.72 × 10⁸ electrons in a Debye sphere: an ideal plasma. The Alfvén speed is 7739 km/s and the electron thermal speed 41938 km/s, 14 % of the speed of light.

## Tips

- Densities in cm⁻³ are common in space physics; switch the unit rather than converting by hand.
- For a partly ionised gas, these are the charged particles only; collisions with neutral atoms are not included.
- Very hot electrons (above about 100 keV) need relativistic corrections that are not included.

## FAQ

**Why is my thermal speed different from another book's?** Some books use √(2kT/m) or √(8kT/πm). This page uses √(kT/m), as the NRL formulary does, so gyroradii follow the same convention.

**Which Coulomb logarithm is used?** The NRL formulary's electron-ion formula, which changes form above Tₑ = 10 Z² eV. Type your own value to override it.

**Is this good enough for design?** It gives the right orders of magnitude for study and planning; it is not a substitute for professional judgement or a full model.
