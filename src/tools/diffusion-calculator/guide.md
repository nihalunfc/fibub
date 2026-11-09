---
name: Diffusion calculator
num: 851
shelf: science
section: phase-and-thermal-behaviour
title: "Diffusion calculator: Fick's second law, erf profiles, Arrhenius D, carburising case depth and time"
summary: "Work out diffusion in solids with Fick's second law: the erfc profile under a constant surface concentration, a thin-film Gaussian source, or a diffusion couple. Get D from D₀ and Q at any temperature, the case depth for a target concentration, the time to reach a depth, the concentration profile plot, and an optional finite-difference check."
status: live
ads: true
order: 851
icon: calculator
works: offline
updated: 2026-11-09
related: [larson-miller-calculator, stress-strain-analyser]
sources:
  - "The erf, erfc and Gaussian solutions of Fick's second law and the Arrhenius law are textbook forms (Crank, The Mathematics of Diffusion; Shewmon, Diffusion in Solids; Porter and Easterling, Phase Transformations in Metals and Alloys, ch. 2). fibub's code is checked in the tests against SciPy (scipy.special.erf, erfinv, brentq) and a NumPy finite-difference solver."
  - "The example D₀, Q, temperatures and concentrations are made-up round values, not data for any real material."
  - "Nothing you type is sent or stored."
flow:
  - { icon: flask, label: "D(T)" }
  - { icon: sliders, label: "Set-up" }
  - { icon: curve, label: "Profile" }
  - { icon: ruler, label: "Depth" }
---

## What it does

Atoms move through a solid by diffusion, and Fick's second law, ∂C/∂t = D ∂²C/∂x², tells you how a concentration spreads with time. For three common set-ups it has neat closed-form answers, and this page uses them:

- **Constant surface concentration** (carburising, nitriding, doping from a gas): (C − C₀)/(Cₛ − C₀) = erfc(x / 2√(Dt)).
- **Thin film** of a total amount M per unit area, on a surface (diffusing inwards) or inside a body (both ways): a Gaussian, C = C₀ + M/√(πDt) · exp(−x²/4Dt), with half of that for a buried film.
- **Diffusion couple** of two blocks joined at x = 0: C = (C₁ + C₂)/2 + (C₂ − C₁)/2 · erf(x / 2√(Dt)).

The diffusion coefficient comes from the **Arrhenius law** D = D₀ exp(−Q/RT), or you can type it. The page then gives the **diffusion length** √(Dt), the **profile** at a quarter, one and four times your time, the **case depth** where the concentration has fallen to a target, the **time** until a given depth reaches the target, and the concentration at that depth. Tick the **finite-difference check** to solve the same problem numerically on a grid and see how close the two are.

## How to use it

1. Give D₀ and Q (in kJ/mol or eV per atom) and the temperature in °C or K, or switch to "Type D".
2. Pick the situation and type the concentrations (any one unit: wt%, at%, atoms per cm³) and the time.
3. Type a target concentration and a depth. Read the case depth and the time. Download the profile as CSV, or everything as an image, PDF or Word file.

## Worked example

A made-up steel with C₀ = 0.2 wt% carbon is carburised at 1000 °C with the surface held at 1.0 wt%. With D₀ = 2 × 10⁻⁵ m²/s and Q = 140 kJ/mol, **D = 3.608 × 10⁻¹¹ m²/s** at 1273.15 K. After 4 h the diffusion length √(Dt) is **720.8 µm**.

The **case depth** to 0.4 wt% is **1.173 mm**: (0.4 − 0.2)/(1.0 − 0.2) = 0.25 = erfc(z) gives z = 0.8134, and x = 2 × 0.7208 mm × 0.8134. At 0.5 mm the carbon is 0.6990 wt% after 4 h, and it first reached 0.4 wt% there after **43.64 min**. Doubling the case depth takes four times as long, 16 h. Near 1000 °C, D doubles for every 66.7 K warmer.

With the finite-difference check on, the explicit scheme (1235 time steps, r = 0.4) agrees with the erfc curve to within about 0.01 % of the range.

## Tips

- The erfc solution assumes the body is thick compared with √(Dt) and that D does not change with concentration. Real carburising often has a surface reaction limit, so measured surface carbon builds up over time.
- The thin-film Gaussian holds once √(Dt) is much larger than the film; the page warns when it is not.
- Activation energies in eV per atom convert with 1 eV = 96.485 kJ/mol.

## FAQ

**Why does the time go as the square of the depth?** All the solutions depend on x/√(Dt) only, so the same concentration moves to twice the depth in four times the time.

**Why can a depth "never" reach the target in a thin film?** The film's atoms spread out and the total stays fixed, so the concentration at a given depth rises to a peak at t = x²/(2D) and then falls. Targets above that peak are never reached.

**Is my input stored?** No, all the sums happen on this page.
