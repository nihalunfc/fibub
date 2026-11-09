---
name: Polarisation calculator
num: 936
shelf: science
section: optics-and-photonics
title: "Polarisation calculator: Jones and Mueller calculus, waveplates, polarisers and the Poincaré sphere"
summary: "Send polarised, partly polarised or unpolarised light through polarisers, quarter- and half-wave plates, any retarder, rotators, partial polarisers and depolarisers, and see the output intensity, Stokes vector, Jones vector, ellipse and the path on the Poincaré sphere."
status: live
ads: true
order: 7
icon: compass
works: offline
updated: 2026-11-09
related: [thin-film-coating, gaussian-beam, fibre-optic-calculator, lens-ray-tracer, diffraction-patterns, sellmeier-fitter, bloch-sphere, plot-maker]
sources:
  - "Jones calculus, Stokes parameters, Mueller matrices (M_ij = ½ Tr(J† σᵢ J σⱼ)) and the Poincaré sphere: standard results, for example Goldstein, D., Polarized Light, and Hecht, E., Optics, chapter 8. Handedness follows the IEEE convention, stated on the page."
  - "Checked against an independent NumPy implementation (Mueller matrices built as A (J ⊗ J*) A⁻¹) and against Malus's law; no data tables are used. The example chain is made up."
flow:
  - { icon: sliders, label: "Light in" }
  - { icon: table, label: "Elements" }
  - { icon: compass, label: "Sphere" }
  - { icon: chart, label: "Light out" }
---

## What it does

Light is a wave whose electric field points in a direction across the beam. That direction can stay fixed (**linear** polarisation), spin round (**circular**), trace an ellipse (**elliptical**), or wander randomly (**unpolarised**). Polarisers, waveplates and other elements change it in ways that are easy to get wrong by hand.

This calculator follows the light through a chain of elements with two standard methods:

- **Jones calculus** uses a two-number complex vector (Ex, Ey) for fully polarised light and a 2 × 2 matrix for each element.
- **Mueller calculus** uses the four **Stokes parameters** (S₀ intensity, S₁ horizontal minus vertical, S₂ +45° minus −45°, S₃ right minus left circular) and 4 × 4 matrices, so it also handles partly polarised and unpolarised light and depolarisers.

The state after every element is drawn on the **Poincaré sphere**, where linear states lie on the equator and circular states at the poles. A waveplate turns the point around an axis through the sphere; a polariser jumps it to a point on the equator.

See how coatings change the two polarisations with the [[thin-film-coating|thin-film coating calculator]], and follow a polarised beam into a fibre with the [[fibre-optic-calculator|fibre optic calculator]].

## How to use it

1. Choose the **input polarisation**, or **Elliptical** to set the azimuth ψ (tilt of the ellipse) and the ellipticity angle χ (0 linear, ±45° circular). Set the **degree of polarisation** below 1 for partly polarised light.
2. List the **elements** in order. Angles are measured from horizontal, anticlockwise as you look at the oncoming beam:
   - `polariser 45`: an ideal linear polariser with its transmission axis at 45°;
   - `qwp 0`, `hwp 22.5`: quarter- and half-wave plates with the fast axis at that angle;
   - `retarder 60 30`: any waveplate, retardance 60°, fast axis at 30°;
   - `rotator 30`: optical rotation (sugar solution, Faraday rotator) by 30°;
   - `partial 0.9 0.1 0`: a partial polariser passing 90 % along 0° and 10 % across;
   - `depolariser 0.5`: scrambles half of the polarisation.
3. Read the output state, intensity, Stokes and Jones vectors, the table after each element, and the whole chain's Mueller matrix.
4. The chart turns the **last element** through 180° and shows the output intensity: for a polariser after linear light this is **Malus's law**, I = I₀ cos²θ.

## Worked example

The made-up example starts with horizontal light. A **half-wave plate at 22.5°** turns it to **linear +45°** (a half-wave plate rotates linear light by twice the angle between them). A **quarter-wave plate at 0°** then makes it **right-handed circular** (S₃ = 1, the north pole of the sphere). Finally a **polariser at 30°** passes **50 %** of the light as **linear at 30°**. The sweep chart is flat at 50 %: circular light has no preferred direction, so any polariser angle passes half.

Try `pol 0`, `pol 90` (crossed polarisers: no light) and then put `pol 45` between them: an eighth of unpolarised light (12.5 %) gets through.

## FAQ

**Why is the handedness the opposite of my textbook?** There are two conventions. This page uses the IEEE one (looking along the beam from behind; right-handed means clockwise, S₃ > 0). Many optics texts look into the beam, which swaps the names. The physics is the same.

**Why no Jones vector for partly polarised light?** A Jones vector can only describe fully polarised light; the Stokes vector and Mueller matrices cover everything.

**Are real waveplates like this?** Real ones have a retardance that depends on wavelength and angle of incidence, and polarisers have a finite extinction ratio (use `partial` for that). For study and planning.
