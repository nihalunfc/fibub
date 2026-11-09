---
name: Ultrasound calculator
num: 973
shelf: science
section: biophysics-and-medical-physics
title: "Ultrasound calculator: acoustic impedance, reflection, attenuation, axial resolution, near field and Doppler shift"
summary: "Work out what happens to an ultrasound pulse: acoustic impedance, how much reflects and transmits at a boundary (also at an angle), attenuation and penetration depth, wavelength and axial resolution, near-field length and beam spread, echo timing, and the Doppler shift with its aliasing limit."
status: live
ads: true
order: 3
icon: target
works: offline
updated: 2026-11-09
related: [mri-bloch-simulator, ct-reconstruction, wave-calculator]
sources:
  - "Acoustic impedance, plane-wave reflection and transmission (normal and oblique, with Snell's law), attenuation in dB/cm/MHz, axial resolution, near-field length D²/4λ, divergence sin θ = 1.22 λ/D, range equation and the Doppler equation: standard diagnostic ultrasound physics, for example Hoskins, P., Martin, K. and Thrush, A. (eds), Diagnostic Ultrasound: Physics and Equipment."
  - "Checked against an independent numpy script written for the tests and the textbook result that soft tissue to air reflects about 99.9 %."
  - "Material values are rounded, illustrative teaching values (not measured data), editable."
flow:
  - { icon: sliders, label: "Probe" }
  - { icon: table, label: "Media" }
  - { icon: target, label: "Boundary" }
  - { icon: chart, label: "Echo" }
---

## What it does

An ultrasound scanner sends short pulses of sound into the body and listens for echoes. How strong an echo is, how deep you can see and how fine a detail you can resolve all follow from a few simple formulas. This calculator puts them in one place: give the probe frequency, the pulse length and size, and the two materials either side of a boundary, and it works out the **acoustic impedance**, the share of the sound **reflected and transmitted**, the **attenuation** on the way down and back, the **resolution**, the **beam shape**, the **timing** and the **Doppler shift**.

## How to use it

1. Enter the **frequency** in MHz, the number of **cycles per pulse**, the **transducer diameter**, the **depth** of the boundary and the system's **dynamic range**.
2. Choose **medium 1** (where the pulse travels) and **medium 2** (beyond the boundary) from the list, or type your own density, speed of sound and attenuation. Typing a value switches that medium to "My own values".
3. Give the **angle of incidence** if the beam meets the boundary at a slant.
4. For **Doppler**, give the speed of the blood or tissue and the angle between beam and flow.
5. Read the four groups of results and the two charts, and download a CSV or a report.

## What the results mean

- **Impedance Z = ρc.** Echoes come from changes in Z. The intensity reflected at normal incidence is ((Z₂ − Z₁)/(Z₂ + Z₁))². Soft tissue against air reflects almost everything, which is why gel is used.
- **Oblique incidence** bends the transmitted beam (Snell's law); beyond the **critical angle** nothing gets through.
- **Attenuation** grows with frequency and depth. The echo has to come back too, so the round trip counts twice. The **half-value layer** halves the intensity; the **deepest useful echo** is where the round-trip loss uses up the dynamic range.
- **Axial resolution** is half the pulse length: shorter pulses and higher frequencies separate closer reflectors along the beam.
- **Near-field length** D²/4λ is where an unfocused disc's beam is narrowest; beyond it the beam spreads by the divergence angle.
- **Highest PRF** keeps one pulse in flight at a time; in pulsed Doppler half of it is the highest shift you can measure without **aliasing**.

## Worked example

With the defaults (5 MHz, 3 cycles, 10 mm disc, a boundary 10 cm deep from average soft tissue to cortical bone, normal incidence) the page shows impedances of **1.632 MRayl** and **7.600 MRayl**, **41.8 %** reflected and 58.2 % transmitted, and a critical angle of **22.64°**. The loss to the boundary is 25 dB one way, so the echo comes back **53.8 dB** down, inside the 60 dB dynamic range. The wavelength is 0.308 mm, the axial resolution **0.462 mm**, the near-field length 8.12 cm and the echo returns after 129.9 µs, allowing a PRF of up to 7.70 kHz. Blood at 50 cm/s at 60° gives a Doppler shift of **1623 Hz**, and speeds up to 119 cm/s can be measured before aliasing.

## Tips

- Try a 10 MHz probe: resolution halves to 0.231 mm but the deepest useful echo drops from 12 cm to 6 cm.
- Set the incidence angle above 22.64° for soft tissue to bone and the boundary becomes a perfect mirror.

## FAQ

**Where do the material values come from?** They are rounded, illustrative values of the kind found in teaching texts. Real tissue varies; type your own if you have measurements.

**Is this a safety tool?** No. It does not compute thermal or mechanical indices or exposure. It is for study and planning, not a substitute for professional judgement.
