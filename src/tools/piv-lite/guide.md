---
name: PIV lite
num: 961
shelf: science
section: fluid-dynamics
title: "PIV lite: particle image velocimetry from two images, cross-correlation vector field in the browser"
summary: "Open two frames of a seeded flow and get the velocity vector field by FFT cross-correlation of interrogation windows, with sub-pixel peaks, a second pass, outlier detection and replacement, speeds in m/s from the pixel size and frame interval, and a CSV of the vectors. Your images never leave your device."
status: live
ads: false
order: 6
icon: image
works: offline
updated: 2026-11-09
related: [lattice-boltzmann, potential-flow, dimensionless-numbers, image-stacker, boundary-layer, video-motion-tracker, plot-maker, uncertainty-calculator]
sources:
  - "Cross-correlation PIV, Gaussian three-point sub-pixel estimator and window offset: Raffel, M. et al., Particle Image Velocimetry: A Practical Guide (Springer); Westerweel, J. (1997), Measurement Science and Technology 8, 1379 to 1392."
  - "Normalised median test: Westerweel, J. and Scarano, F. (2005), Experiments in Fluids 39, 1096 to 1100."
  - "Checked against an independent NumPy FFT correlation of the same image pair (equal to 10⁻⁵ px) and against made-up image pairs with known shift, vortex and shear flows."
  - "The example image pairs are made up: random particles moved by a known flow."
flow:
  - { icon: image, label: "Two frames" }
  - { icon: sigma, label: "Correlate" }
  - { icon: pointer, label: "Vectors" }
  - { icon: check, label: "Outliers" }
---

## What it does

**Particle image velocimetry** (PIV) measures a whole flow at once. Tiny particles are mixed into the fluid and photographed twice, a short time apart. Cut both pictures into small **interrogation windows**: the particle pattern in each window has moved a little between the frames, and the peak of the **cross-correlation** of the two windows says by how much. One window gives one velocity vector; the whole image gives a vector field.

This page does that in your browser. It uses the FFT to correlate each window, a three-point Gaussian fit to find the peak to a fraction of a pixel, a **second pass** that shifts each window in frame B by the first estimate (which removes the bias towards small displacements), and the **normalised median test** to find and replace bad vectors.

Compare your measured field with a simulated one in the [[lattice-boltzmann|lattice Boltzmann wind tunnel]], and follow single objects frame by frame with the [[video-motion-tracker]].

## How to use it

1. **Open frame A** and **frame B**: two images of the same size (PNG, JPEG, WebP, BMP or GIF, up to 2048 × 2048 pixels). Without them, the page shows a made-up example pair: a vortex, a uniform shift or a shear layer.
2. Choose the **window size**: about 10 particles per window is ideal, and the largest displacement should be under a quarter of the window.
3. Choose the **overlap** (50 % is standard) and the number of **passes**.
4. Optionally give the **pixel size** in micrometres and the **time between frames** in milliseconds to get speeds in m/s.
5. Read the summary, look at the arrows (orange ones were replaced as outliers), and **download the vectors** as CSV.

## Worked example

The page opens on a made-up **vortex** pair of 320 × 240 pixels, spinning at up to 2.5 px per frame. With 32 px windows, 50 % overlap and two passes it finds **19 × 14 = 266 vectors** circling the centre, a mean displacement of (0.00709, −0.0124) px (a vortex has no net drift), a largest displacement of 2.27 px, well within a quarter of the window, and a median correlation peak ratio of 4.39; the median test replaces 1 vector. Choose the made-up **uniform shift**, in which every particle moves 3.3 px right and 1.65 px up, and the mean displacement comes out within a few hundredths of a pixel of (3.3, −1.65). With a pixel size of 10 µm and 1 ms between frames, 1 px per frame is 0.01 m/s.

## Tips

- Aim for particle images 2 to 3 pixels across: smaller ones "peak lock" to whole pixels.
- If many vectors are replaced, try a bigger window, a shorter time between frames, or more seeding.
- Out-of-plane motion, strong shear within a window and reflections all weaken the correlation peak; the peak ratio helps spot them.

## FAQ

**Are my images uploaded?** No. They are read and analysed in this browser tab and never leave your device.

**Why is y positive downwards?** The page uses image rows, as most PIV software does. Flip the sign of v for a y-up frame.

**Is this as good as commercial PIV?** No: there is no image deformation, masking or multi-grid refinement. It is for study and planning, not a substitute for professional judgement or a validated PIV package.
