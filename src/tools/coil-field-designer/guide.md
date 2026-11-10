---
name: Coil field designer
num: 910
shelf: science
code: T645
section: electromagnetism
title: "Helmholtz and Maxwell coil designer: magnetic field, uniformity along the axis and field map (Biot-Savart)"
summary: "Design Helmholtz, Maxwell, anti-Helmholtz or your own set of round coils. Get the exact field at the centre, how long and how wide the uniform region is, a map of the uniformity, the current for a target field, and the wire length, resistance and heat."
status: live
ads: true
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [field-line-plotter, uncertainty-calculator, magnetic-circuit, capacitor-inductor-calculator, skin-depth-calculator, particle-drifts, mri-bloch-simulator]
sources:
  - "Field of a circular current loop in terms of complete elliptic integrals, from the Biot-Savart law: standard result, for example Jackson, J. D., Classical Electrodynamics, section 5.5, and Smythe, W. R., Static and Dynamic Electricity."
  - "Helmholtz pair (separation equal to the radius), Maxwell three-coil arrangement (outer coils of radius R√(4/7) at ±R√(3/7) with 49/64 of the ampere-turns) and anti-Helmholtz spacing √3 R: classical designs, rederived and confirmed numerically for these tests."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022). Resistivities of copper and aluminium are rounded textbook values for room temperature."
  - "Checked against a direct numerical Biot-Savart integral and SciPy's elliptic integrals (ellipk, ellipe) and root finder (brentq), written for the tests. The example coil is made up."
flow:
  - { icon: sliders, label: "Coils" }
  - { icon: calculator, label: "Field" }
  - { icon: ruler, label: "Uniformity" }
  - { icon: chart, label: "Map" }
---

## What it does

Pairs of round coils are the standard way to make a known, even magnetic field in the lab: to cancel the Earth's field around an experiment, to calibrate a magnetometer, to measure e/m of the electron, or to give an MRI phantom or an atom trap a field or a field gradient. This designer works out the field of any set of coaxial round coils exactly, using the Biot-Savart law in its closed form with elliptic integrals, everywhere around the coils and not only on the axis.

Ready-made sets:

- **Helmholtz pair:** two equal coils one radius apart, currents the same way. The field at the centre is as flat as two coils can make it (its second derivative is zero).
- **Maxwell coil:** a centre coil and two smaller ones; with the right sizes and turns, the field is flat to the sixth power of the distance, so the uniform region is much larger.
- **Anti-Helmholtz pair:** currents opposite, √3 R apart: zero field at the centre and an even gradient, as used in magneto-optical traps.
- **Single coil**, or **custom**: type up to 20 coils, each with radius, position, turns, current and, if you like, the size of its winding.

Work out the coil's inductance with the [[capacitor-inductor-calculator]], and when it has an iron core use the [[magnetic-circuit|magnetic circuit solver]].

## How to use it

1. Pick a coil set and give the radius, the turns per coil and the current. For the Maxwell set, the turns you give are those of the centre coil; the outer coils get 49/64 of them.
2. For thick windings, give the winding width and depth: each coil is then spread over a grid of 25 loops, which changes the uniform region slightly.
3. Choose how uniform the field must be (1 %, 0.1 % or 100 ppm). The page reports the stretch of axis, and the radius of the sphere, inside which the field stays that close to its centre value.
4. Optionally give a target field to get the current needed, and the wire diameter and metal for the resistance and heat.
5. Move the probe to read the field anywhere, and download the axis profile as CSV or the whole report.

## Worked example

A made-up Helmholtz pair of radius 10 cm, 100 turns per coil, carrying 1 A. The page shows **B = 0.8992 mT (8.992 gauss) at the centre**, exactly (4/5)^1.5 μ₀NI/R. The field is uniform to 1 % over **±3.14 cm** along the axis, a stretch of 6.27 cm, and to 0.1 % over ±1.73 cm. Wound with 0.8 mm copper wire, the 200 turns use 126 m of wire, about 4.3 Ω, so the pair takes 4.3 V and warms by 4.3 W; the current density of 1.99 A/mm² is comfortable in air. For 2 mT you would need 2.22 A. Switching to the Maxwell set of the same radius, the field at the centre rises to 1.178 mT and the 1 % region along the axis grows to ±4.32 cm.

## Tips

- The uniform region scales with the coil size: to double it, double the radius (and the turns, to keep the field).
- Real coils are never perfectly placed. Try nudging one coil a few millimetres in the custom list to see how sensitive your design is.
- Heat grows with the square of the current. Above about 4 A/mm² coils in air need cooling.

## FAQ

**Why is the uniform sphere smaller than the uniform stretch of axis?** Off the axis the field also tilts and changes in the radial direction, and the sphere has to be uniform in every direction.

**Does it include the Earth's field or iron nearby?** No. The coils are in empty space. The Earth's field is about 0.05 mT, so add it yourself or use it as a reason to choose a stronger field.

**Is anything uploaded?** No. Everything is worked out in your browser.
