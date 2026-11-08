---
name: Image stacker
num: 76
shelf: science
section: astrophotography
title: "Astrophoto calibration and stacking: darks, flats, bias, star alignment and sigma clipping in your browser"
summary: "Calibrate your light frames with darks, flats and bias, align them on their stars and stack them with a kappa-sigma clipped average that removes satellite trails. Download the result as 32-bit FITS."
status: live
ads: false
order: 22
icon: image
works: offline
updated: 2026-11-08
related: [star-fwhm-checker, fits-viewer, sub-exposure-calculator, telescope-calculator, mosaic-planner]
flow:
  - { icon: image, label: "Frames" }
  - { icon: sliders, label: "Calibrate" }
  - { icon: check, label: "Stack" }
---

## What it does

One long exposure of a faint galaxy is ruined by a single passing plane, and it collects hot pixels, dust shadows and a darkening towards the corners. Astrophotographers instead take many shorter **light frames** and a few kinds of calibration frame, then combine them. This tool does the whole job in your browser:

- **Bias frames** (the shortest exposure, cap on) record the camera's fixed offset. Here they are taken off the flats.
- **Dark frames** (same exposure and temperature as the lights, cap on) record thermal signal, amp glow and **hot pixels**. The master dark is subtracted from each light, and the hot pixels it shows are patched from their neighbours.
- **Flat frames** (an evenly lit field, same focus and camera angle) record **vignetting** and **dust shadows**. Each light is divided by the normalised master flat, which evens them out.
- **Alignment**: the brightest stars of each frame are matched to the first frame's, allowing for a shift and a rotation (from dithering, drift or field rotation). Each frame is then resampled onto the first.
- **Stacking**: a two-pass **kappa-sigma clipped average**. Each pixel is averaged over all frames, leaving out any value further than κ standard deviations from the other frames' values. A satellite or plane trail, a cosmic-ray hit or a stray hot pixel shows up in only one frame, so it disappears.

The result shows how much the background noise dropped (ideally √N for N frames), a histogram of one frame before and after calibration, and each frame's shift, rotation and alignment quality. You can download the stack as a 32-bit floating-point FITS file for further processing, or as a stretched PNG.

## How to use it

1. Choose your light frames and, if you have them, darks, flats and bias frames. FITS is best because its values are linear. JPEG and PNG work for a quick result, but they have already been stretched, so calibration is only approximate.
2. Pick the clipping level: 3 σ suits most sets, 2.5 σ removes more with 15 or more frames, and "plain average" switches clipping off.
3. Press **Calibrate and stack**. Each frame is read, calibrated and aligned in turn, then read again for the clipped average, so memory use stays modest.
4. Compare the stack with a single calibrated frame and a raw frame using the buttons above the picture. All three use the same stretch.

## Worked example

**Run the example** uses eight simulated 360 × 260 light frames of one star field with a faint nebula. Each frame is shifted by up to 8 pixels and turned by up to half a degree. There are four darks with 25 hot pixels, four flats with strong vignetting and a dust shadow, and four bias frames. One light has a bright satellite trail across it. The tool patches the 25 hot pixels, evens out the vignetting, aligns every frame on about 38 stars to better than 0.1 pixel, and stacks them. The background noise falls by about 3 times (√8 is 2.8; interpolation smooths a little more), the nebula stands out, and the satellite trail is gone. In the plain average it would remain as a faint streak.

## Frequently asked questions

**How many frames can it handle?** Up to 100 lights. Frames over 25 megapixels are binned 2 × 2 first. Very large sets are better done in desktop software, but this is fine for a night's set from a small camera.

**Does it debayer colour raw frames?** No. Colour JPEG and PNG frames are stacked channel by channel, and raw one-shot-colour FITS are stacked as they are; debayer the stack afterwards in your editing software.

**Why was a frame left out?** It did not share enough stars with the first frame (clouds, a big jump, or a different target), or it was a different size.

**Is anything uploaded?** No. The frames are read and processed in your browser and never leave your device.
