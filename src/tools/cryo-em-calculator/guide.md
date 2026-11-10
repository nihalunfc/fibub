---
name: Cryo-EM calculator
num: 188
shelf: science
section: structural-biology
title: "Cryo-EM calculator"
summary: "Work out the pixel size from your camera and magnification (with super-resolution and binning), the Nyquist limit, the dose per Å² and per frame, the electron wavelength and CTF zeros with a CTF plot, a box size for your particle, and a rough particles-to-resolution guide. Everything runs in your browser."
status: live
ads: false
order: 4
icon: curve
works: offline
updated: 2026-11-09
related: [protein-calculator, peptide-mass-calculator, telescope-calculator, centrifuge-calculator, pdb-viewer, ramachandran-plot, crystallisation-screen, lattice-fft]
sources:
  - "Physical constants are CODATA 2018 values (general science facts). The wavelength, CTF, delocalisation and Rosenthal-Henderson formulas are standard textbook physics, written by fibub."
  - "Checked in the tests against an independent Python and NumPy script: the wavelength from the electron's total energy and momentum, CTF zeros found by scanning and bisecting the curve, a brute-force box size search, and a line fit that gives the B-factor back."
  - "The example numbers (camera pixel, magnification, dose rate, Cs, amplitude contrast, defocus, particle size, B-factor and the known particles and resolution) are rounded or made up for this tool, not taken from any one microscope, camera or paper."
flow:
  - { icon: camera, label: "Pixel size" }
  - { icon: sigma, label: "Dose" }
  - { icon: curve, label: "CTF" }
  - { icon: chart, label: "Particles" }
---

## What it does

Planning a cryo-EM data collection, or checking one, means doing the same sums again and again. This page does them together, and every result updates as you type:

- **Pixel size and Nyquist.** The pixel size at the sample is the camera pixel divided by the magnification. Super-resolution mode halves it, binning multiplies it. The Nyquist limit, two pixels, is the finest detail any map from these images can show.
- **Dose.** From the dose rate per camera pixel per second, the exposure time and the number of frames: the dose rate per Å², the total dose, the dose per frame and the electrons per pixel in each frame. Add a target total dose to get the exposure time, or a target dose per frame to get the number of frames.
- **Microscope and CTF.** The electron wavelength at 100, 120, 200 or 300 kV, with the relativistic correction (it is about 12 % shorter at 300 kV than the simple formula gives). From the wavelength, the spherical aberration Cs, the amplitude contrast and the defocus, the contrast transfer function (CTF) is drawn up to Nyquist, with its first zero and the number of zeros. An optional envelope B-factor shows how the signal fades.
- **Box size.** The microscope spreads high-resolution detail out from each particle, by up to λΔf ÷ d + Cs λ³ ÷ d³ at resolution d. The page suggests a box that holds the particle plus that spread on both sides, next to the common 1.5 to 2 times the diameter. Sizes are rounded up to even numbers with only 2, 3 and 5 as factors, which Fourier transforms handle quickly.
- **Particles and resolution.** Rosenthal and Henderson showed that ln N = B ÷ (2d²) + constant: each doubling of the particles gives a smaller gain. From one known point and a B-factor, the page estimates the resolution with more particles and the particles for your target resolution, as a table and a plot.

For the protein's mass and size, use the [[protein-calculator|protein parameter calculator]]; to look at a model built from your map, the [[pdb-viewer]].

## How to use it

1. Type the camera pixel size (in µm) and the magnification, or switch to a calibrated pixel size. Tick super-resolution and choose the binning you process at.
2. Type the dose rate measured with no sample, the exposure time and the number of frames.
3. Choose the voltage and type Cs, the amplitude contrast and the defocus (positive for underfocus).
4. Type your particle's diameter and the resolution you hope for.
5. For the particles guide, type a B-factor and one result you already have: how many particles gave what resolution.

The CTF curve and the particles table can be downloaded as CSV, and the whole page as an image, PDF or Word file.

## Worked example

Press **Use the example** (it is also what the page opens with). The numbers are made up. A camera with 5 µm pixels at 60,000 × gives 0.8333 Å per camera pixel. In super-resolution mode the movie is recorded at 0.4167 Å, and binning by 2 brings it back to **0.8333 Å per pixel, Nyquist 1.667 Å**.

A dose rate of 15 e⁻ per pixel per second is 15 ÷ 0.8333² = 21.6 e⁻/Å²/s, so a 2.5 s exposure gives a total of 54 e⁻/Å². Split into 50 frames, that is 1.08 e⁻/Å² and 50 ms per frame, with 0.75 electrons per camera pixel in each frame.

At 300 kV the wavelength is 0.01969 Å (0.02239 Å without the relativistic correction). With Cs 2.7 mm, amplitude contrast 0.1 and 1.5 µm underfocus, the first CTF zero is at 17.46 Å, and there are 92 zeros up to Nyquist.

For a 150 Å particle at a 3 Å target, the signal spreads up to 106.1 Å on each side, so the suggested box is 450 px (375 Å). The rule of thumb gives 270 to 360 px, smaller and faster but losing some of the 3 Å signal.

With a made-up B-factor of 100 Å² and 20,000 particles giving 4 Å, twice the particles gives 3.619 Å and ten times gives 3.035 Å. Reaching 3 Å needs about 227,000 particles.

## Tips

- Take the dose rate over an empty hole or with the sample out, in the same mode you collect in.
- More defocus gives more contrast at low resolution but spreads the signal further, so it needs a bigger box.
- The B-factor in the particles guide comes from your own data (for example from a plot of 1/d² against ln N over a few subsets). Real data stop improving when something else limits them.

## FAQ

**Why is my pixel size different from the microscope's?** The nominal magnification is often a few per cent off. Calibrate against a sample with a known spacing and use that number.

**Does the CTF sign matter?** The page uses CTF = −sin(χ + φ) with underfocus positive, which is negative near the centre: dark particles on a lighter background. The zeros are the same in every convention.

**Is anything uploaded?** No. All sums run in your browser and the page works offline.
