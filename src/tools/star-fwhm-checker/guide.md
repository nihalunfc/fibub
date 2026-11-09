---
name: Star FWHM checker
num: 72
shelf: science
section: astrophotography
title: "Star FWHM and HFR checker: focus, tilt, field curvature and tracking from one image"
summary: "Open a star image and measure every star's FWHM, half-flux radius and elongation, with a map across the field that shows focus, sensor tilt, field curvature and tracking errors."
status: live
ads: false
order: 21
icon: target
works: offline
updated: 2026-11-08
related: [fits-viewer, backfocus-calculator, telescope-calculator, sub-exposure-calculator, polar-alignment]
flow:
  - { icon: image, label: "Star image" }
  - { icon: target, label: "Measure" }
  - { icon: check, label: "Diagnose" }
---

## What it does

Sharp, round stars are the goal of every astrophotographer, and the eye is a poor judge of them on a small screen. This tool finds the stars in one of your sub-frames and measures each one: its **FWHM** (full width at half maximum, from a Moffat profile fitted to the star), its **half-flux radius** (HFR, the radius holding half its light, which most capture programs use for autofocus), and how **elongated** it is and in which direction.

It then looks at the whole field. A 3 × 3 map shows the median FWHM in each ninth of the image, and a chart shows FWHM against distance from the centre. From these it reports:

- **Focus and sampling**: the median FWHM in pixels and, with your pixel size and focal length, in arcseconds, and whether stars span a sensible 1.6 to 5 pixels.
- **Tilt**: how much the four corners differ. One soft corner or side usually means the camera is tilted or the focuser sags.
- **Field curvature**: whether the corners are softer than the centre, which points to a missing or wrongly spaced field flattener.
- **Elongation**: whether stars are stretched, and whether they all point the same way (tracking, guiding, wind or flexure), towards the centre (wrong backfocus to a corrector) or around it (curvature or astigmatism).

If the stars are bloated, check your spacing with the [[backfocus-calculator]]; to stack the good frames, use the [[image-stacker]].

## How to use it

1. Open a sub-frame. A raw FITS file straight from the capture program is best, because its pixel values are still linear. PNG and JPEG files work too, but stretching changes the star sizes, so use them only to compare like with like.
2. For a colour camera's raw frame, tick **Bin 2 × 2** so the Bayer checkerboard does not upset the measurement. It is ticked for you when the FITS header names a Bayer pattern.
3. Enter the **pixel size** and **focal length** for sizes in arcseconds. The tool reads them from the FITS header when they are there (XPIXSZ, FOCALLEN).
4. Raise the **detection level** if hot pixels or noise are counted as stars; lower it for a sparse field. Saturated stars are skipped, as are odd objects far wider or narrower than the rest.
5. Download every star's numbers as a CSV, or the whole page as a PNG, PDF or Word file.

## Worked example

The example is a simulated 640 × 420 field of 160 stars, made with a Moffat β of 3.5. The FWHM grows from 3.2 pixels at one corner to 5.6 pixels at the opposite one, and every star is stretched by 1.18 along a line 30° from the x axis, as a slow drift in tracking would do. The tool measures 129 clean stars and finds a median FWHM of 4.36 pixels (4.22″ at 0.97″ per pixel), an HFR of 2.66 pixels and β = 3.6. It reports an elongation of 1.18, all pointing the same way at 29°, which it puts down to tracking. The corners differ by 38 %, so it flags tilt, while the corners as a group are no softer than the centre, so there is no field curvature. That is exactly how the field was made.

## Frequently asked questions

**FWHM or HFR: which should I use?** For focusing either works: both are smallest at best focus. HFR is steadier on faint or undersampled stars; FWHM is the number to compare with seeing and with other people's results.

**Why does my FWHM change through the night?** Seeing changes, the tube cools and focus drifts, and stars low in the sky are blurred by more air. Compare frames taken close together.

**What FWHM is good?** It depends on the seeing and the telescope. From most backyards 2″ to 4″ is typical; well under 2″ needs good seeing and a large aperture.

**Is my image uploaded?** No. Everything runs in your browser, and the page works offline.
