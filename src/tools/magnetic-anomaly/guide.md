---
name: Magnetic anomaly modeller
num: 881
shelf: science
code: T616
section: geophysics-and-seismology
title: "Magnetic anomaly modelling: total-field anomaly of a sphere, horizontal cylinder, thin dyke or prism, with remanence, profile, map and RMS misfit"
summary: "Model the total-field magnetic anomaly of a buried sphere, horizontal cylinder, thin dipping dyke or vertical-sided prism in any field inclination and declination, with optional remanent magnetisation. See the profile and a map, and compare with pasted survey readings by RMS misfit."
status: live
ads: true
order: 881
icon: compass
works: offline
updated: 2026-11-09
related: [gravity-corrections, earthquake-locator, stereonet, plot-maker, gpr-viewer, ves-inversion, utm-converter, cross-section-profile]
sources:
  - "Dipole and 2D line-dipole fields, the thin-sheet integral and the face-by-face (surface pole) solution for a uniformly magnetised prism are standard potential-field results (see Blakely 1995, Potential Theory in Gravity and Magnetic Applications), written by fibub from the physics."
  - "Checked against independent NumPy and SciPy models: a dipole potential differentiated numerically, and point dipoles integrated along strike, over a sheet and through a box."
  - "The field values, body and example readings are made up by fibub. Look up the real main field for a site from a geomagnetic reference model."
flow:
  - { icon: compass, label: "Field" }
  - { icon: sliders, label: "Body" }
  - { icon: chart, label: "Profile" }
  - { icon: check, label: "Misfit" }
---

## What it does

Magnetised rocks, such as magnetite-rich dykes, ore bodies, basalt flows or buried steel, add a small field to the Earth's own. A magnetometer measures the **total-field anomaly ΔT**: how much stronger or weaker the field is than it would be without the body. Because the Earth's field is tilted almost everywhere, the anomaly of even a simple body has a high on one side and a low on the other. This page computes that shape for four classic bodies so you can understand a survey line or check an interpretation:

- **Sphere**: a compact body such as a boulder of ore, a buried drum or a pipe end, behaving as a single dipole.
- **Horizontal cylinder**: a long body crossing the profile at right angles, such as a pipeline, a buried channel or a fold hinge.
- **Thin dyke or sheet**: a tabular body that strikes across the profile, with any dip and any down-dip extent.
- **Vertical prism**: a box with vertical sides, finite in all three directions, for plugs and ore lenses.

The body is magnetised by **induction** (susceptibility χ times the Earth's field) and, if you tick the box, by **remanence**, a magnetisation frozen into the rock with its own direction. The page shows the **Koenigsberger ratio Q**, remanent over induced.

Compare your profile with the gravity over the same ground using the [[gravity-corrections|gravity survey corrections]], and draw the geology beneath it with the [[cross-section-profile|cross-section tool]].

## How to use it

1. Enter the Earth's field: strength F in nT, inclination I (positive downward, as in the northern hemisphere) and declination D. Enter the direction the profile runs, the sensor height and the profile's start and end.
2. Choose the body, its susceptibility in SI units, its position along the profile and its size and depth.
3. Read the high, the low and the peak-to-trough size, look at the profile and the map, and download the profile as CSV.
4. To interpret a survey line, paste or open the readings (distance and ΔT). Adjust the body until the RMS misfit is as small as the noise. The second RMS figure ignores a constant offset, because surveys often sit on a regional level.

## Worked example

The page opens with a field of 50,000 nT at inclination 65° and declination 5°, a north-running profile from −300 to 300 m and a sphere of radius 30 m centred 80 m deep at 0 m, with χ = 0.05 SI. The induced magnetisation is **1.99 A/m**. The anomaly has a **high of +73.2 nT at −18 m**, south of the body because the field dips north, and a **low of −9.7 nT at 80 m**, with a peak to trough of 82.9 nT.

The example readings were made from a sphere 15 m further north, 85 m deep and of radius 32 m, then shifted by 2 nT and given some noise. Against the starting model the RMS misfit is **7.45 nT** (6.94 nT after a level shift). Move the sphere to 15 m, 85 m deep and radius 32 m, and the misfit drops to **2.09 nT**, or **0.69 nT** after the level shift: about the size of the noise.

## Good to know

- The same anomaly can come from different bodies. A deeper, stronger body can look like a shallower, weaker one; use geology and other data to choose.
- The width of the anomaly says most about depth. As a rough rule, the half-width of a sphere's peak is about its depth.
- 2D bodies (cylinder and dyke) are infinitely long across the profile. Use the prism when the body is short.
- Strong remanence can flip an anomaly upside down. Reversed remanence, as in many old basalts, often shows as a low.
- ΔT here is the anomalous field projected on the main field direction, which is what total-field magnetometers record when the anomaly is small compared with F.

## FAQ

**What susceptibility should I use?** It varies a lot: sedimentary rocks are often below 0.001 SI, basalts around 0.01 to 0.1 and magnetite ores much higher. Measure samples if you can.

**Why is the high not over the body?** Except at the magnetic poles, both the magnetisation and the measured component are tilted, so the high moves toward the equator side and a low appears on the pole side.

**Is my data sent anywhere?** No. Everything is worked out on this page and nothing leaves your device.
