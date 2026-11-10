---
name: Optical tweezers calibration
num: 974
shelf: science
code: T709
section: biophysics-and-medical-physics
title: "Optical tweezers calibration: trap stiffness from the power spectrum (Lorentzian fit) and equipartition"
summary: "Paste a trapped bead's position record and get the trap stiffness two ways: from the corner frequency of a Lorentzian fitted to the power spectrum (with the aliasing correction for sampled data and Faxén's correction near a surface), and from equipartition. Works in volts too, giving the detector's nm per volt."
status: live
ads: true
order: 4
icon: target
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker, gaussian-beam, fft-workbench, curve-fitter, dls-analyser]
sources:
  - "Power spectrum calibration, the aliased Lorentzian for sampled data, the analytical 1/P fit and the expected scatter of averaged spectra: Berg-Sørensen, K. and Flyvbjerg, H. (2004), Review of Scientific Instruments 75, 594. Equipartition and Stokes drag: standard statistical physics. Faxén's correction: Faxén (1923), as given in Svoboda, K. and Block, S. M. (1994), Annual Review of Biophysics and Biomolecular Structure 23, 247."
  - "Checked against scipy.signal.welch and scipy.optimize.curve_fit on the same record, written for the tests. Boltzmann constant: SI exact value."
  - "The example record is simulated (made up); the water viscosity 0.89 mPa·s is a rounded value."
flow:
  - { icon: file, label: "Record" }
  - { icon: chart, label: "Spectrum" }
  - { icon: curve, label: "Fit" }
  - { icon: target, label: "Stiffness" }
---

## What it does

A bead held in an optical trap jiggles because water molecules keep hitting it, and the trap pulls it back like a spring. The stiffer the trap, the smaller and faster the jiggle. Measuring that motion is the standard way to **calibrate** an optical trap, that is, to find its **stiffness k** (the force per nanometre of displacement), so that the trap can then be used to measure forces.

This page does the two classic calibrations on a recorded position trace:

- **Power spectrum:** the spectrum of a trapped bead's position is a **Lorentzian**, flat at low frequency and falling as 1/f² above the **corner frequency fc**. The stiffness is k = 2π γ fc, where γ = 6πηr is the Stokes drag on the bead. The fit also gives the **diffusion coefficient D**, which should equal kT/γ; if your positions are in volts, comparing the two gives the detector's **sensitivity β** in nm per volt.
- **Equipartition:** the mean thermal energy in the spring is ½kT, so k = kT / ⟨x²⟩. It needs calibrated positions and is spoiled by drift and noise, so it is a useful cross-check.

Size the trapping laser's focus with the [[gaussian-beam|Gaussian beam calculator]], and look at the bead's power spectrum in more detail with the [[fft-workbench]].

## How to use it

1. Paste a position record (one number per line), open a CSV, TSV, text or Excel file, or keep the example. If the first column is time in seconds, the sample rate is set from it; choose the **position column** if there are several.
2. Set the **units** (nm, µm or detector volts) and the **sample rate**.
3. Give the **bead diameter**, **temperature**, **viscosity** and, near a cover glass, the **height** of the bead centre above it (Faxén's correction raises the drag).
4. Choose the **segment length** (longer gives finer frequency steps but fewer averages), how many neighbouring bins to **average**, the **fit range** and the **model**. The aliased model is exact for sampled data and should be your default.
5. Read the stiffness, the fit quality, and the two charts; download the spectrum and fit as CSV, or the report.

## Worked example

The example is a simulated 1 µm bead in water at 25 °C in a trap of 0.02 pN/nm, sampled at 10 kHz for 3.28 s (32,768 samples). Cut into 32 segments of 1024 and averaged in blocks of 4, the aliased Lorentzian fit from 10 to 4000 Hz gives a corner frequency of **380 ± 7.2 Hz** and a stiffness of **0.02003 pN/nm**, with χ²/dof = 1.28. The fitted D of 0.4916 µm²/s matches the expected 0.4907 µm²/s. Equipartition gives **0.01999 pN/nm** from a variance of 205.9 nm² (rms 14.4 nm), within 0.2 % of the spectrum. Switch to the **plain Lorentzian** and the corner frequency is overestimated at 467 Hz (0.0246 pN/nm, χ²/dof 3.67) because the fit runs close to half the sample rate, where aliasing bends the spectrum.

## Tips

- Sample at least 5 to 10 times faster than the corner frequency, and fit well below any detector or anti-aliasing filter roll-off.
- Start the fit above low-frequency drift and building vibration peaks.
- A χ²/dof far above 1 means the model does not describe the data: check for peaks, filtering or a wrong fit range.

## FAQ

**Which value should I trust?** The power spectrum method needs only the drag (bead size and viscosity) and is insensitive to detector calibration; equipartition needs calibrated positions and is biased by noise and drift. Agreement within a few percent is a good sign.

**Do my data leave the computer?** No. Everything is worked out in this page; nothing is uploaded.
