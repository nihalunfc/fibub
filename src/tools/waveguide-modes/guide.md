---
name: Waveguide mode calculator
num: 913
shelf: science
section: electromagnetism
title: "Waveguide cutoff frequency and mode chart: rectangular and circular guides, TE and TM modes"
summary: "Give a rectangular or circular waveguide's size and filling to get the cutoff frequency of every TE and TM mode, the single-mode band, and at your frequency which modes propagate, the guide wavelength, phase and group speed, wave impedance and wall loss."
status: live
ads: true
order: 5
icon: chart
works: offline
updated: 2026-11-09
related: [skin-depth-calculator, capacitor-inductor-calculator, link-budget-calculator]
sources:
  - "Cutoff frequencies, propagation constants, wave impedances and conductor attenuation of TE and TM modes in rectangular and circular waveguides: standard results, for example Pozar, D. M., Microwave Engineering, chapter 3, and Collin, R. E., Foundations for Microwave Engineering."
  - "Bessel functions from their integral representation and their zeros found numerically in the page; no tables of zeros are used."
  - "Wall resistivities are rounded, typical room-temperature values. The starting size, 22.86 × 10.16 mm, is the widely used X-band guide."
  - "Checked against SciPy (jv, jn_zeros, jnp_zeros) and against a numerical power-loss integration of the TE10 and TE11 fields (SciPy quad), written for the tests."
flow:
  - { icon: ruler, label: "Size" }
  - { icon: sliders, label: "Frequency" }
  - { icon: chart, label: "Mode chart" }
  - { icon: table, label: "Modes" }
---

## What it does

A hollow metal pipe carries microwaves only above a **cutoff frequency** set by its size: roughly, half a wavelength has to fit across it. Each field pattern, or **mode**, has its own cutoff. Below the lowest cutoff nothing gets through; between the first and second cutoffs only one mode can travel, which is how waveguides are normally used, since several modes travelling at different speeds would smear signals.

This calculator lists every TE (transverse electric) and TM (transverse magnetic) mode of a **rectangular** or **circular** guide up to a chosen multiple of the lowest cutoff, and at your operating frequency gives, for each mode:

- whether it **propagates** or is **evanescent** (dies away along the guide, in dB per mm);
- the **guide wavelength**, which is longer than the free-space wavelength;
- the **group speed** (how fast energy travels) and the **wave impedance**;
- the **wall loss** in dB per metre from the finite conductivity of the metal (for TE10 in rectangular guides and for every circular mode).

Bessel functions and their zeros, needed for circular guides, are worked out in the page.

## How to use it

1. Choose rectangular or circular and give the inside sizes in mm (for rectangular, a is the wide side).
2. Set the filling's εr (1 for air; a dielectric filling lowers every cutoff by √εr).
3. Type the operating frequency in GHz and pick the wall metal.
4. Read the summary, the mode chart (each mode at its cutoff, filled if it propagates), and the table. Download the table as CSV or the report.

## Worked example

The common X-band guide, 22.86 × 10.16 mm, air-filled, copper walls (rounded ρ), at 10 GHz. The page shows **1 mode propagates at 10 GHz: TE10**. The TE10 cutoff is **6.557 GHz**, the single-mode band runs to 13.11 GHz (TE20), and the usual working band is 8.196 to 12.46 GHz. At 10 GHz the guide wavelength is **39.71 mm** (against 29.98 mm in free space), the group speed 0.7550 c, the wave impedance 499 Ω and the wall loss **0.108 dB/m**. The next mode, TE20, dies away at 1.54 dB per mm.

A circular guide of 20 mm inside diameter has its lowest mode, TE11, cut off at 8.785 GHz, then TM01 at 11.47 GHz.

## Tips

- The loss climbs steeply just above cutoff, which is why the working band starts at about 1.25 times the cutoff.
- Making b smaller than a/2 keeps TE01 above TE20, so the single-mode band is set by TE20 at twice the TE10 cutoff.
- The circular TE01 mode has wall loss that falls as the frequency rises, which once made it a candidate for long-distance links.

## FAQ

**Why is the wave impedance higher than 377 Ω?** For TE modes it is η/√(1 − (fc/f)²), which grows towards infinity at cutoff.

**Can a mode below cutoff still matter?** Yes: near a discontinuity evanescent modes store energy locally, and a short length of guide below cutoff makes a useful attenuator.

**Is anything uploaded?** No. Everything is worked out in your browser.
