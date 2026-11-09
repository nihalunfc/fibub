---
name: CT reconstruction demo
num: 972
shelf: science
section: biophysics-and-medical-physics
title: "CT reconstruction demo: sinogram and filtered back-projection with ramp, Shepp-Logan, cosine and Hann filters"
summary: "See how a CT scanner turns X-ray projections into a slice: make the sinogram of a made-up object, rebuild it by filtered back-projection, and watch what too few angles, a limited angular range, noise and the choice of filter do to the image."
status: live
ads: true
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [mri-bloch-simulator, decay-calculator, ultrasound-calculator, dicom-viewer, gamma-shielding, fourier-visualiser]
sources:
  - "Radon transform, parallel-beam projections of ellipses and filtered back-projection with the discrete ramp kernel: Kak, A. C. and Slaney, M. (1988), Principles of Computerized Tomographic Imaging, chapter 3 (also free from the authors). Window shapes (sinc, cosine, Hann): standard signal processing."
  - "Checked against an independent numpy implementation (numeric line integrals of the object, numpy.fft filtering, numpy.interp back-projection) written for the tests; they agree to 1e-13."
  - "The test objects are made up for this page."
flow:
  - { icon: target, label: "Object" }
  - { icon: chart, label: "Sinogram" }
  - { icon: sliders, label: "Filter" }
  - { icon: image, label: "Image" }
---

## What it does

A CT scanner never sees the slice it shows you. It measures how much an X-ray beam is weakened along thousands of straight lines through the body, from many directions. Stacking those **projections**, one row per angle, gives the **sinogram** (every point in the body traces a sine wave across it). Turning the sinogram back into an image is called **reconstruction**, and the classic method is **filtered back-projection**: sharpen each projection with a filter, then smear it back across the image along the direction it was taken, and add up all the angles.

This page does all of it in your browser. It works out the projections of a made-up object **exactly** (each part of the object is an ellipse, whose line integrals have a closed formula), reconstructs it with the filter you choose, and compares the result with the true object.

Look at real CT slices with the [[dicom-viewer]], and work out how much radiation a material stops with the [[gamma-shielding|gamma shielding calculator]].

## How to use it

1. Choose an **object**: a made-up head-like slice, a uniform disc, or pairs of small dots for judging resolution.
2. Choose the **image size**, the **number of projection angles** and the **angles covered**.
3. Pick a **reconstruction filter** and, if you like, add **noise** to the projections.
4. Set the **grey window**: the values shown as black and white. Narrow it to bring out small differences, as radiologists do with CT window settings.
5. Compare the object, sinogram and reconstruction, the middle-row profile and the filter curves. Download the sinogram or the profile as CSV, or the report as an image, PDF or Word file.

## What each option does

- **None (plain back-projection):** smearing without filtering blurs every point into a 1/r halo. It shows why the filter is needed.
- **Ramp (Ram-Lak):** boosts each frequency in proportion to itself; exact for perfect data but it also boosts noise.
- **Shepp-Logan, cosine, Hann:** the ramp multiplied by a window that falls off towards the highest frequency, giving smoother, less noisy images that are slightly less sharp. Hann rolls off most.
- **Number of angles:** with N detector bins you need about π/2 × N angles; fewer leaves streaks.
- **Limited angles:** without a full 180° some edges are never seen and smear out.

## Worked example

With the defaults (head-like object, 128 × 128, 90 angles over 180°, ramp filter, no noise) the page shows an error of **0.0688**, that is 6.88 % of the brightest value, mostly at the sharp outer edges. It also says about **202 angles** would sample the image fully. Drop to 12 angles and the error rises to 0.232 with obvious streaks. Cover only 0 to 120° and it is 0.198. Now add **5 % noise**: the ramp filter gives 0.171, Shepp-Logan 0.145, cosine 0.114 and **Hann 0.107**, the smoothest window winning once noise dominates.

## Tips

- Narrow the grey window to 0.1 to 0.45 on the head-like object to see the soft inner details and the streaks.
- Use the small dots with the Hann filter and then the ramp filter to see resolution traded against noise.
- Every row of the sinogram adds up to almost the same total (the object's total attenuation), whatever the angle.

## FAQ

**Is this how real scanners work?** The principle is the same. Real scanners use fan or cone beams, a spectrum of X-ray energies, calibration, and often iterative reconstruction. This is parallel-beam, single energy, with exact projections.

**Why do the values have no units?** The made-up object uses arbitrary attenuation units. Real CT images are shown in Hounsfield units relative to water.

**Can I use this for clinical work?** No. It is for study, not a substitute for professional judgement.
