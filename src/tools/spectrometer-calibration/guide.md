---
name: Spectrometer calibration
num: 937
shelf: science
section: optics-and-photonics
title: "Spectrometer wavelength calibration: turn a phone photo of a spectrum into wavelengths with known lines"
summary: "Open a photo from a phone or webcam spectrometer, take a brightness profile across the spectrum, find the bright lines, match them to well-known mercury, neon, hydrogen or sodium lines, and fit a pixel-to-wavelength polynomial to get a calibrated spectrum."
status: live
ads: false
order: 8
icon: camera
works: offline
updated: 2026-11-09
related: [spectral-line-identifier, diffraction-patterns, sellmeier-fitter, beer-lambert-calculator, calibration-curve, curve-fitter, uncertainty-calculator, spectrum-peak-fitter, lens-ray-tracer]
sources:
  - "Emission line wavelengths (mercury 404.7, 435.8, 546.1, 577.0 and 579.1 nm; the brightest neon lines; hydrogen Balmer lines; sodium D lines) are general, well-known spectroscopy facts, rounded to 0.1 nm. Fluorescent-lamp phosphor lines (terbium near 487.7 and 542.4 nm, europium near 611.6 nm) are approximate band peaks."
  - "Peak finding with parabolic interpolation and least-squares polynomial calibration: standard methods."
  - "Checked against scipy.signal.find_peaks with the same parabolic refinement and numpy.polyfit, and by recovering the known pixel-to-wavelength map of the made-up example spectrum."
flow:
  - { icon: camera, label: "Photo" }
  - { icon: chart, label: "Profile" }
  - { icon: target, label: "Lines" }
  - { icon: ruler, label: "Wavelengths" }
---

## What it does

A home-made spectrometer (a diffraction grating or a piece of DVD in front of a phone camera) turns light into a rainbow on the photo. The photo only knows **pixels**; this tool turns them into **wavelengths**.

It averages a strip of the photo into a brightness profile, finds the bright lines with sub-pixel precision, matches them to emission lines whose wavelengths are known, and fits a polynomial λ = a₀ + a₁x + a₂x² (+ a₃x³) through them. The result is a formula you can reuse for every later photo taken with the same set-up, and a calibrated spectrum you can download.

Identify the lines in your calibrated spectrum with the [[spectral-line-identifier|spectral line identifier]], and check the grating's angles in the [[diffraction-patterns|diffraction pattern tool]].

## How to use it

1. Photograph the spectrum of a lamp with known lines. A **fluorescent tube or compact fluorescent lamp** is the easiest: it shows the mercury lines at 435.8 and 546.1 nm and a red phosphor line near 611.6 nm. Keep the camera and grating fixed afterwards.
2. **Open the photo** (it never leaves your device). Say whether the spectrum runs left to right or top to bottom.
3. Set the **band**, the strip across the spectrum that is averaged (marked on the photo with dashed lines). Choose **all colours** or one channel, and some **smoothing** for noisy photos.
4. Adjust the **peak threshold** and spacing until each bright line is one peak.
5. Choose the **light source**. **Match automatically** tries every pairing of peaks with lines and keeps the one that fits the most lines; check it and change any peak by hand with its drop-down (— leaves a peak out).
6. Choose the **fit**: a straight line for 2 lines, quadratic (usual for gratings) for 3 or more, cubic only with many lines.

## What the results mean

- **The formula** converts any pixel x along the spectrum into a wavelength.
- **RMS residual:** how far the lines sit from the fitted curve. A few tenths of a nanometre is good for a phone spectrometer.
- **Dispersion:** nanometres per pixel, which sets the finest detail you can see.
- **Range of the photo:** the wavelengths at the two ends of the image.

## Worked example

The example is a made-up fluorescent-lamp-like spectrum, 1,000 pixels long, drawn with the map λ = 380 + 0.32 x + 0.00002 x² nm. The tool finds 8 peaks and matches all 8 to the lamp's lines automatically. The quadratic fit gives back **λ = 380.050 + 0.31955 x + 2.051 × 10⁻⁵ x² nm**, within about 0.1 nm of the true map across the whole photo, with a dispersion of **0.337 nm per pixel** and an RMS residual of 0.120 nm, mostly from the 577.0/579.1 nm mercury pair, which the made-up blur partly merges. A straight-line fit through the same lines is visibly worse, because gratings are not perfectly linear.

## Tips

- Avoid over-exposed photos: flat-topped, white lines move the peak positions. Lower the exposure if you can.
- Turn off "auto" colour and HDR effects on the camera if possible.
- Measure your unknown light with exactly the same set-up, then use the formula on its photo (this tool's CSV gives the wavelength of every pixel).

## FAQ

**Does it store my photo?** No. The photo is read in your browser, never uploaded, and forgotten when you close the page.

**Why are some lines marked approximate?** Phosphor lines are narrow bands, not single atomic lines; their peaks are good to about a nanometre. Mercury, neon, hydrogen and sodium lines are given to 0.1 nm.

**How accurate is it?** For study and planning: a well-made phone spectrometer reaches about 1 nm.
