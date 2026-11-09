---
name: Langmuir probe analyser
num: 954
shelf: science
section: plasma-physics
title: "Langmuir probe I-V analyser: electron temperature, plasma potential and density from a probe trace"
summary: "Paste or open a Langmuir probe current-voltage trace and get the electron temperature from the exponential region, the floating and plasma potentials, the ion and electron saturation currents and the plasma density worked out two ways, with the fits drawn on the curve."
status: live
ads: true
order: 3
icon: chart
works: offline
updated: 2026-11-09
related: [plasma-parameters, particle-drifts, calibration-curve, plot-maker]
sources:
  - "Single-probe theory: Langmuir and Mott-Smith (1926); standard treatments in Hutchinson, I. H., Principles of Plasma Diagnostics, and Chen, F. F. (2003), Langmuir probe diagnostics (IEEE ICOPS mini-course). Bohm ion flux factor 0.61 = exp(−1/2)."
  - "Checked against an independent NumPy re-implementation of the same fitting steps on the example trace, and against the made-up plasma (Tₑ = 3 eV, n = 10¹⁶ m⁻³, Vp = 12 V) used to generate it."
  - "The example trace is made up: computed from the probe equations with a little added noise."
flow:
  - { icon: file, label: "Trace" }
  - { icon: curve, label: "Fit" }
  - { icon: target, label: "Potentials" }
  - { icon: sigma, label: "Density" }
---

## What it does

A **Langmuir probe** is a small bare wire put into a plasma. Sweeping its voltage and measuring the current gives an I-V curve that holds the plasma's electron temperature, density and potential. This page does the classic analysis in your browser:

1. Fits a straight line to the **ion saturation** part (large negative voltage) and subtracts it, leaving the electron current.
2. Finds the **floating potential** Vf, where the net current is zero.
3. Fits a straight line to ln(electron current) in the **transition region**: the slope is 1/Tₑ, so the electron temperature comes straight out in electronvolts.
4. Finds the **plasma potential** Vp at the knee, where the exponential line meets the electron-saturation line.
5. Works out the **density** twice: from the electron saturation current (¼ n e A v̄) and from the ion saturation current (Bohm, 0.61 n e A √(kTₑ/mᵢ)).

## How to use it

1. Paste two columns, **voltage** and **current**, or use **Open a file** for CSV, TSV, text or Excel. A header row is fine.
2. Choose the **current unit** and the **sign convention**. Many systems plot electron current as positive; if yours is negative, switch it.
3. Give the probe's **collecting area** in mm² and the **gas**, which sets the ion mass.
4. The fit ranges are automatic. If the ln Iₑ plot shows the straight part somewhere else, type the **Te fit from/to** voltages, or the voltage below which the ion line is fitted.

## Worked example

The made-up example is an argon plasma measured with a 2 mm² probe from −40 V to +30 V. The page finds **Tₑ = 2.97 eV**, Vf = −3.38 V and Vp = 12 V. The ion saturation current is 5.22 µA and the electron saturation current 932 µA. The density is **1.01 × 10¹⁶ m⁻³** from the electrons and 9.97 × 10¹⁵ m⁻³ from the ions, a ratio of 1.01, so the trace is consistent. The trace was generated with Tₑ = 3 eV and n = 10¹⁶ m⁻³, so the analysis recovers them within 1 %.

## Tips

- Use the log plot: the straight part should be long and clean. Curvature there means two electron populations or RF pick-up.
- If the two densities disagree by more than a factor of 2, check the area (sheath expansion makes the effective area bigger on small probes) and the gas.
- In a magnetised plasma, trust the ion density and Tₑ more than the electron saturation current.

## FAQ

**Why is the ion current taken at Vf?** The ion line slopes because the sheath grows with voltage. The value at the floating potential is the usual compromise.

**What does Vp − Vf tell me?** For Maxwellian electrons it is Tₑ × ln(√(mᵢ/2πmₑ)/0.61), about 5.2 Tₑ for argon. A very different value suggests a non-Maxwellian plasma or a bad fit.

**Is my data uploaded?** No. Everything runs in your browser.

**Can I rely on it?** It is the standard first analysis, for study and planning; it is not a substitute for professional judgement or more complete probe theories (orbital motion limited, Laframboise).
