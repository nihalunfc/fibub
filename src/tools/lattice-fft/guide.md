---
name: Lattice FFT and d-spacing
num: 857
shelf: science
section: microscopy-and-image-analysis
title: "Lattice FFT: power spectrum, d-spacings and angles from HRTEM or AFM images, with a Bragg filter"
summary: "Open an HRTEM, STEM or AFM image of a lattice, set the scale and pick a square region. The page shows its power spectrum, finds the strongest spots and turns each into a d-spacing and angle (tap any spot to measure it), and makes a filtered image from the spots you choose. The image stays in your browser."
status: live
ads: false
order: 857
icon: search
works: offline
updated: 2026-11-09
related: [grain-size-intercept, particle-size-image, phase-fraction, afm-roughness, electron-diffraction-indexer, xrd-peak-calculator, miller-index-calculator, fft-workbench]
sources:
  - "The FFT (radix 2), the Hann window, zero padding, spot finding, sub-pixel refinement and the Bragg filter are written by fibub. The tests check the FFT and inverse FFT against numpy.fft, the window against numpy.hanning, and the spectrum, spot positions, d-spacings, angles and filtered image against the same steps in NumPy and SciPy on made-up fringes of known spacing."
  - "d = 1 / |g| (the spacing of the lattice planes is the inverse of the spatial frequency of their fringes) is general physics."
  - "The example image is drawn by the page: three made-up sets of fringes 0.25 nm apart at 60° to each other, with noise, at 0.02 nm per pixel."
  - "An image you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Image" }
  - { icon: ruler, label: "Scale" }
  - { icon: target, label: "Spots" }
  - { icon: table, label: "d-spacings" }
---

## What it does

A high-resolution image of a crystal is a sum of fringes, one set for each family of lattice planes. The two-dimensional Fourier transform turns each set into a pair of bright spots: the distance of a spot from the centre is the fringe frequency g, and the lattice spacing is **d = 1 / g**. The direction of the spot is the direction of the planes' normal. This is how d-spacings and the angles between planes are read from HRTEM, STEM and AFM images, for phase identification or to check a zone axis.

This page:

- **Takes a square region** (64 to 1024 pixels) where you tap the image. Its mean is taken away, a **Hann window** fades its edges so they do not draw bright streaks through the spectrum, and it is **padded with zeros** to twice the size to sample the spectrum more finely.
- **Transforms it** with a radix-2 FFT and shows the **log power spectrum**, zero frequency in the middle.
- **Finds the strongest spots** (one of each mirror pair) and refines each centre to a fraction of a spectrum pixel by fitting a parabola to the log power, then gives d, the angle of the planes' normal (counter-clockwise from the image x axis), the angle to the first spot, and the relative strength.
- **Measures any spot you tap** on the spectrum, after moving to the nearest peak.
- **Filters**: keeps the transform within a small radius of the ticked spots (and their mirror spots), removes everything else and transforms back. The result shows the periodic lattice with the noise and amorphous background removed (a Bragg or Fourier filter).

Index the spots you find with the [[electron-diffraction-indexer|electron diffraction indexer]], and compare the spacings with the [[xrd-peak-calculator|XRD peak calculator]].

## How to use it

1. Open the image and set the scale: tap both ends of the scale bar and type its length (here in nm by default), or type the pixel size from the microscope's metadata.
2. Tap the image where the lattice is clearest; the orange square shows the region.
3. Read the spots in the table. Tap any other spot on the spectrum to measure it; the spectrum zoom (2 × by default, the middle half) makes small spots easier to hit.
4. Tick or untick the spots for the filtered image (weak ones start unticked) and change the filter radius. Download the spots CSV, the spectrum, the filtered image or a report.

## Worked example

The example is made up: three sets of fringes 12.5 pixels apart with their normals at 20°, 80° and 140°, plus noise and a slow change of background, at 0.02 nm per pixel (the 100-pixel bar is 2 nm), so the true spacing is 0.25 nm. With a 256-pixel region in the middle, the Hann window and 2 × padding (a 512 × 512 transform), the page finds the three spot pairs first and reports

- **d = 0.2501, 0.2498 and 0.2500 nm** (2.501, 2.498 and 2.500 Å), all within 0.1 % of the true 0.25 nm,
- angles of 140.0°, 80.0° and 20.0°, so 60.0° between neighbouring planes, as for a hexagonal lattice seen down its c axis.

The next three peaks are under 1 % of the strongest: noise, listed but left out of the filter (spots under 5 % start unticked). The spectrum step is 0.0977 nm⁻¹ per pixel, but the parabola fit places each spot much more finely than that.

## Tips

- The calibration limits the accuracy: a scale bar drawn to 2 % gives d to 2 %. For precise work, calibrate on a known lattice in the same session.
- Use a region with many fringes (at least 10 periods across). Bigger regions give sharper spots.
- Spots near the edge of the spectrum are close to the pixel limit (2 pixels per period); spots of fine spacings are more precise in pixels than they look.
- The filtered image is a picture of the chosen frequencies only. It can make lattice-like patterns out of noise if you choose weak spots, so use it to see, not to prove, a structure.

## FAQ

**Why are there two spots for each set of planes?** The image is real, so its transform is symmetric: every spot has a mirror spot through the centre. The table lists one of each pair.

**What angle is reported?** The direction of the planes' normal, counter-clockwise from the image's x axis; the fringes themselves run at right angles to it. Differences between spots are what you compare with the angles between planes.

**Does my image leave the computer?** No. It is read and transformed inside this page and is never uploaded or stored.
