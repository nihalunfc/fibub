---
name: Sub-exposure calculator
num: 42
shelf: science
code: T42
section: astrophotography
title: "Sub-exposure calculator for astrophotography: how long should each sub be?"
summary: "Find the shortest sub length that buries your camera's read noise under sky noise, from a test frame or from your sky brightness. Works for one-shot colour, LRGB and narrowband, with a chart of what each length costs."
status: live
ads: true
order: 30
icon: clock
works: offline
updated: 2026-11-08
related: [telescope-calculator, star-trail-exposure, fits-viewer, observing-session]
flow:
  - { icon: camera, label: "Camera" }
  - { icon: moon, label: "Sky" }
  - { icon: clock, label: "Sub length" }
---

## What it does

Deep-sky images are stacks of many shorter exposures ("subs"). Each sub carries the camera's read noise once, so very short subs add a lot of it, while very long subs risk satellites, wind and saturated stars and gain almost nothing. The sweet spot is the shortest sub in which the noise from the sky background is large enough to "swamp" the read noise. This calculator finds it for your camera, sky and filter, and draws how much signal-to-noise every other sub length would give you in the same total time.

Check your sampling first with the [[telescope-calculator]], and then stack the subs with the [[image-stacker]].

## How to use it

1. Type the **read noise** of your camera at the gain you use. Makers publish a chart of read noise against gain. Leave **dark current** at 0 for a cooled camera.
2. Give the **sky signal** in one of two ways:
   - **From a test frame** (best): take one sub, for example 60 s, with the filter you will use. Note the median level of an empty patch of sky and the median of a bias frame (the offset), both in ADU, and the camera's gain in electrons per ADU. If your camera has a 12 or 14-bit sensor but saves 16-bit files, divide the maker's gain by 16 or 4 so it matches the file's numbers.
   - **From sky brightness**: type a sky quality meter reading or a light pollution map value in mag/arcsec², your filter, aperture, focal length, pixel size and quantum efficiency. This is a rough estimate.
3. Choose how much **extra noise** you will accept from read noise. 5 % is the usual choice. It is the same as the "sky noise ≥ 3 × read noise" rule of thumb.

## How it works

Read noise R adds to the shot noise of the sky signal S (electrons per pixel per second) and dark current D. In a sub of length t the noise is √((S + D)t + R²). Allowing it to be at most (1 + p) times the noise without read noise gives

t = R² / ((S + D) × ((1 + p)² − 1)),

so a 5 % penalty needs about 10 R² / S. The chart plots √((S + D)t / ((S + D)t + R²)), the share of the ideal signal-to-noise you reach in a fixed total time.

## Worked example

A cooled colour CMOS camera has 1.5 e⁻ read noise and 0.25 e⁻/ADU. A 60 s test frame shows a sky background of 1250 ADU on an offset of 500 ADU: 750 ADU, or 187.5 electrons, which is 3.125 e⁻ per pixel per second. For 5 % extra noise the shortest sub is 1.5² / (3.125 × 0.1025) = 7.0 s, so anything from about 8 s up works. The 60 s test frame was already 99.4 % efficient. Each colour pixel sees roughly 100 nm of sky, so under the same sky a 7 nm narrowband filter cuts the sky signal about 14-fold, and subs need to be about 100 s or longer.

## Frequently asked questions

**Should I always use the shortest sub?** No, it is the shortest that loses almost nothing. Longer is fine as long as stars do not saturate and your mount tracks well. Short subs also make more files to store and stack.

**Why does narrowband need much longer subs?** The filter blocks most of the sky light, so it takes longer for sky noise to grow past the read noise.

**Is anything uploaded?** No. Everything is worked out in your browser and the page works offline.
