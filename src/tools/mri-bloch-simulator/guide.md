---
name: MRI physics simulator
num: 971
shelf: science
code: T706
section: biophysics-and-medical-physics
title: "MRI physics simulator: Bloch equations, T1 and T2 curves, image contrast and k-space to image"
summary: "Step the Bloch equations through spin echo, gradient echo and inversion recovery sequences, see how TR, TE, flip angle and TI set the brightness of each tissue, find the Ernst angle and the inversion time that nulls a tissue, and watch an image appear from k-space with a 2D Fourier transform."
status: live
ads: true
order: 1
icon: sliders
works: offline
updated: 2026-11-09
related: [decay-calculator, plot-maker, ct-reconstruction, ultrasound-calculator, dicom-viewer, fourier-visualiser, bloch-sphere]
sources:
  - "Bloch equations, spin echo, spoiled gradient echo (Ernst) and inversion recovery signal equations, k-space and the 2D Fourier transform: standard MRI physics, for example Haacke, E. M. et al. (1999), Magnetic Resonance Imaging: Physical Principles and Sequence Design, and Hargreaves' Bloch simulation notes (rotation and relaxation matrices)."
  - "Checked against an independent numpy steady-state solver (fixed point of the rotation and relaxation matrices) and numpy.fft, written for the tests."
  - "Tissue T1, T2 and proton density values are rounded and illustrative, editable; the head-like phantom is made up."
flow:
  - { icon: sliders, label: "Sequence" }
  - { icon: table, label: "Tissues" }
  - { icon: chart, label: "Contrast" }
  - { icon: image, label: "k-space" }
---

## What it does

An MRI scanner does not photograph tissue; it measures the radio signal from hydrogen nuclei whose magnetisation has been tipped by radio-frequency pulses. How bright each tissue looks depends on two relaxation times, **T1** (how fast the magnetisation grows back along the main field) and **T2** (how fast the signal in the transverse plane dies away), on its **proton density**, and on the timings the operator chooses.

This simulator works that out in two independent ways. It uses the **closed-form signal equations** for spin echo, spoiled gradient echo and inversion recovery, and it also **steps the Bloch equations** pulse by pulse (rotations for the pulses, exponential relaxation in between) until the signal settles. The two columns in the table agree, which is a good check that the formulas mean what they say. It then builds a made-up head-like image from those signals, takes its **2D Fourier transform** to show the **k-space** the scanner really records, and rebuilds the image from all or part of it.

Open real scans with the [[dicom-viewer]], and compare how CT builds an image in the [[ct-reconstruction|CT reconstruction demo]].

## How to use it

1. Pick a **preset** or choose a **sequence** and type your own **TR** and **TE** (and **flip angle** for gradient echo or **TI** for inversion recovery).
2. Edit the **tissues** if you like: a name, T1 and T2 in milliseconds and a relative proton density from 0 to 1.
3. Read the **signal table**, the T1 recovery and T2 decay curves with TR, TI and TE marked, and the Bloch simulation of the first few repetitions for any tissue.
4. Under **From k-space to image**, keep all of k-space, only its centre, only its edges, or every other line, and compare the rebuilt image with the original.
5. Download the signals or the simulation as CSV, or the whole report as an image, PDF or Word file.

## What each option does

- **Spin echo:** a 90° pulse, then a 180° pulse at TE/2 that refocuses the signal into an echo at TE. Signal = PD × (1 − 2e^(−(TR−TE/2)/T1) + e^(−TR/T1)) × e^(−TE/T2).
- **Spoiled gradient echo:** one pulse of a chosen flip angle per TR. Signal = PD × sin α (1 − E1) / (1 − cos α E1) × e^(−TE/T2), with E1 = e^(−TR/T1). The **Ernst angle**, arccos E1, gives the most signal for each tissue.
- **Inversion recovery:** a 180° pulse flips the magnetisation, and the readout comes TI later. Signal = PD × (1 − 2e^(−TI/T1) + e^(−TR/T1)) × e^(−TE/T2), shown signed. The **null TI** column is the TI at which a tissue gives no signal, which is how fluid-suppressed and fat-suppressed images are made.
- **Only the centre** of k-space keeps the overall brightness and contrast but blurs the image; **only the edges** keeps outlines; **every other line** halves the scan time but folds the image over itself (aliasing).

## Worked example

With the default **T1-weighted spin echo** (TR 500 ms, TE 15 ms) and the rounded tissues, the page shows signals of **0.6307** for the fat-like tissue, **0.2822** grey-matter-like, **0.2744** white-matter-like and **0.1133** fluid-like, so fat is brightest and fluid darkest, as on a real T1-weighted image. Brightness relative to fat is 100, 45, 44 and 18 %. The Bloch simulation of the white-matter-like tissue gives a first echo of 0.846 (it starts fully relaxed) and then 0.392 at every later repetition. Choose the **T2-weighted** preset (TR 4000, TE 100) and the order flips: the fluid-like tissue becomes brightest at 0.5925.

## Tips

- Short TR and short TE give T1 weighting; long TR and long TE give T2 weighting; long TR and short TE give proton density weighting.
- Try the gradient echo preset and change the flip angle around the Ernst angle shown for each tissue: the signal peaks there.
- Changing TI in steps around a tissue's null TI shows its signal passing through zero and changing sign.

## FAQ

**Are these real tissue values?** They are rounded, illustrative numbers of the kind quoted for 1.5 tesla. Real values depend on field strength, method and the person, so edit them.

**Why does the first echo differ from the rest?** The magnetisation starts fully relaxed; after the first repetition it reaches a steady state.

**Is this a scanner protocol tool?** No. It is a teaching model (hard pulses on resonance, perfect spoiling, no flow or diffusion) for study, not a substitute for professional judgement in scan planning or diagnosis.
