---
name: AFM roughness analyser
num: 861
shelf: science
section: microscopy-and-image-analysis
title: "AFM roughness analyser: Sa, Sq, Ra, Rq, Rz, skewness, kurtosis, line profiles and step height from a height map"
summary: "Open AFM or profilometer height data as a text matrix, an x y z list or a 16-bit greyscale PNG or TIFF. Level it with a plane or polynomial (fitted to the whole image or a reference region) and line-by-line flattening, then get areal Sa, Sq, Ssk, Sku, Sz, profile Ra, Rq, Rsk, Rku, Rz, a dragged line profile, the step height between two regions, a height histogram and a colour map."
status: live
ads: false
order: 861
icon: image
works: offline
updated: 2026-11-09
related: [nanoparticle-calculator, image-stacker, thermal-mismatch-stress, dls-analyser, grain-size-intercept, particle-size-image, lattice-fft, thin-film-thickness, uncertainty-calculator]
sources:
  - "Parameter definitions follow the usual ISO 25178-2 (areal) and ISO 4287 (profile) formulas: arithmetic and root-mean-square heights, skewness, kurtosis, peak, valley and total heights. These are general formulas; fibub's code is its own and checked in the tests against NumPy and SciPy."
  - "The 'AFM hot' colours use the simple r = 2t, g = 2t − ½, b = 2t − 1 ramp. The example surface is made up (seeded noise, a tilt and a 20 nm step)."
  - "Nothing you open is sent or stored."
flow:
  - { icon: file, label: "Heights" }
  - { icon: sliders, label: "Level" }
  - { icon: ruler, label: "Profile" }
  - { icon: sigma, label: "Roughness" }
---

## What it does

An atomic force microscope (AFM), or an optical or stylus profilometer, gives a map of heights. Before you can quote a roughness, the scan's tilt and bow have to be removed, and then the numbers have to be worked out the same way every time. This page does both in your browser:

- **Opens** a matrix of heights (one image row per line, as Gwyddion, NanoScope and most AFM software export as text), an x y z list on a regular grid, or a greyscale PNG or TIFF. For 16-bit PNG and TIFF it reads the full 0 to 65535 levels, not just 256 grey shades. Gwyddion-style "# Width", "# Height" and "# Value units" header lines fill in the scan size and units.
- **Levels** the image: takes off a plane, a 2nd or 3rd order surface, fitted either to the whole image or only to region A (a flat reference area), then optionally flattens each scan line.
- **Areal parameters** for the whole image: Sa, Sq, Ssk, Sku, Sp, Sv and Sz, and the mean of the profile parameters over every row.
- **Line profile**: drag a line on the map (or type its ends) to see the heights along it with Ra, Rq, Rsk, Rku, Rz and Rt.
- **Step height**: drag two regions, A and B; the page gives the difference of their mean heights, with each region's roughness and the standard error.
- **Histogram and colour map**, with downloads of the profile (CSV), the levelled heights (text matrix) and a full report.

Size the particles you see with [[particle-size-image|particle sizing from images]], and check film thickness with the [[thin-film-thickness|thin film thickness tool]].

## How to use it

1. Paste the data or open a file. For text, pick the height unit and type the scan width and height in µm (an x y z list carries its own spacing). For a greyscale image, say what height the full grey scale stands for: read it from the scan's z-range.
2. Choose the levelling. For a film edge or any step, put region A on the flat substrate and fit the plane to region A only; otherwise the step tilts the fit.
3. Pick "Profile line", "Region A" or "Region B" and drag on the map. Open "Type positions" to set exact coordinates.
4. Read the results and download what you need.

## Worked example

The example is a made-up 128 × 128 point scan, 5 × 5 µm, of a grainy film about 0.6 nm rms on a tilted sample, with a 20 nm step on the right third. With a plane fitted to region A only, the page gives **Sa 8.612 nm, Sq 9.308 nm** for the whole image: dominated by the step, so not a roughness of the film. Region A alone has **Sq 0.5738 nm**, the film's real roughness, and the **step height B − A is 20.09 nm**, close to the 20 nm used to make it. Change "Fitted to" to the whole image and the step drops to about 5.7 nm, because the plane tilts to follow the step: a common mistake this page makes easy to see.

## Tips

- Quote the scan size and pixel size with every roughness: values grow with the area scanned.
- Line flattening is good for scan-line jumps but removes real height differences along rows. Use it with care on stepped samples.
- Ssk below zero means valleys dominate (a polished surface with scratches); above zero means peaks dominate (particles on a flat substrate). Sku near 3 is a Gaussian surface.
- No λc filter is applied, so these are unfiltered values. Compare like with like.

## FAQ

**What file should I export?** A text matrix of heights in nm or m, or a 16-bit greyscale TIFF or PNG. Colour pictures of scans are not height data.

**Why is Rz smaller than Rt?** Rz averages the peak-to-valley height of five equal parts of the line; Rt is the single largest over the whole line.

**Is my data uploaded?** No. Files are read in your browser and never leave your device.
