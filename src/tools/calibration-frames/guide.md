---
name: Calibration frames (bias, dark, flat)
num: 829
shelf: science
section: astrophotography
title: "Calibration frames: make master bias, dark and flat frames and calibrate light frames, with a demo"
summary: "Open bias, dark, flat and light frames (FITS, PNG or JPEG) or load a made-up demo set, combine each kind into a master by mean, median or sigma-clipped mean, and calibrate the lights as (L − D) / normalised (F − B). See the images, histograms and statistics before and after, and download the masters and calibrated lights as FITS."
status: live
ads: false
order: 829
icon: camera
works: offline
updated: 2026-11-09
related: [image-stacker, fits-viewer, star-fwhm-checker, sub-exposure-calculator, telescope-calculator, star-trail-exposure, backfocus-calculator, observing-log]
sources:
  - "Image calibration with bias, dark and flat frames, sigma clipping and the MAD σ are standard methods; the code is written by fibub and checked in the tests against ccdproc 2.5 (Combiner, subtract_bias, subtract_dark, flat_correct) and astropy's sigma_clip and mad_std."
  - "The demo frames are made up by the page (a pretend camera); they are not real data. FITS reading uses fibub's own reader."
flow:
  - { icon: file, label: "Frames" }
  - { icon: sliders, label: "Combine" }
  - { icon: camera, label: "Calibrate" }
  - { icon: chart, label: "Before/after" }
---
## What it does

Every picture from an astronomy camera carries the camera's own marks. **Bias** is the fixed offset and pattern the electronics add to every frame. **Dark current** builds up with exposure time and temperature, and a few **hot pixels** build it up fast. **Vignetting** darkens the corners, and **dust** on the filter or sensor casts soft rings ("dust donuts"). Calibration frames measure all of these so they can be removed:

- **Bias frames**: the shortest possible exposure with the cap on.
- **Dark frames**: the same exposure and temperature as the lights, cap on. They hold bias plus dark current.
- **Flat frames**: an evenly lit, featureless target (a light panel or the twilight sky) through the same optics, focus and filter.
- **Light frames**: your pictures.

This page combines each kind into a **master** and calibrates each light:

calibrated = (L − D) / [(F − B) / mean(F − B)]

Dividing by the normalised flat lifts the vignetted corners and the dust shadows back to the level of the centre. If your darks have a different exposure from the lights, the page can scale them: it subtracts the bias first and scales the dark current, (D − B) × t<sub>L</sub>/t<sub>D</sub>. That needs bias frames and assumes the dark current grows in step with time.

Plan how long each light frame should be with the [[sub-exposure-calculator]], and stack the calibrated frames with the [[image-stacker]].

## Combining frames

- **Mean**: the lowest noise, but one cosmic ray or satellite trail in one frame leaks into the master.
- **Median**: ignores outliers, a little noisier (about 25 % more noise than the mean for many frames).
- **Sigma-clipped mean** (default): for each pixel, values more than κ spreads from the median are left out, the bounds are worked out again from what is left until nothing more changes, and the rest are averaged. With the robust **MAD σ** as the spread this catches single outliers even in 5 to 10 frames; the standard deviation is pulled up by the outlier itself (with 7 frames and κ = 3 it can never reject one).

## How to use it

1. Open your bias, dark, flat and light frames, or load the demo set. FITS is best; exposure times are read from EXPTIME.
2. Choose how to combine and how to normalise the flat, and whether the darks need scaling.
3. Press "Make masters and calibrate". Switch the view between the light before and after and each master.
4. Download the calibrated light and the masters as 32-bit FITS, the statistics as CSV, or a report.

## Worked example

The demo set is a made-up camera: bias about 1000 ADU with a faint column pattern and 8 ADU read noise, 30 hot pixels, vignetting that falls to about 60 % in the corners, a dust donut, a cosmic ray in one dark and a satellite trail in one flat. Nine bias, seven darks, seven flats and two lights of 240 × 160 pixels. With the sigma-clipped mean (κ = 3, MAD σ) the page reports "Centre / corner brightness 1.483 before the flat, 1.005 after; background 1268.61 → 260.48 ADU": the light minus the dark is 48 % brighter in the middle than in the corners, and the flat takes that away. The table shows the master dark's hot pixels as a large maximum, and the histogram's raw peak moves down by the bias and dark level and narrows.

## Tips

- Take 20 or more of each kind if you can; the master's noise falls as one over the square root of the number of frames.
- Flats must be taken without moving the focus or the camera; rotate the camera and they no longer match.
- Keep the masters for the next nights if the temperature and settings match.

## FAQ

**Can I calibrate colour (one-shot colour) frames?** For FITS straight from the camera, calibrate the raw Bayer frames before debayering; each plane is calibrated separately for RGB images.

**Is anything uploaded?** No. All frames are read and processed in your browser.
