---
name: Image compare
num: 2042
shelf: everyday
code: T925
section: images-icons
title: "Image compare: before and after slider and difference checker"
summary: "Compare two images with a before/after slider, an overlay with adjustable opacity, or a difference view that marks every changed pixel and gives the percent changed. Runs in your browser."
status: live
ads: false
order: 2042
icon: image
works: offline
updated: 2026-11-10
related: [photo-palette, image-resizer, compare-documents]
sources:
  - "Pixel-by-pixel comparison of red, green, blue and alpha values. fibub's own working."
flow:
  - { icon: image, label: "Two images" }
  - { icon: sliders, label: "Pick a view" }
  - { icon: eye, label: "Spot changes" }
---

## What it does

Is the new screenshot the same as the old one? This page puts two images on top of each other so you can see the difference. Drag a line across to wipe between them, fade one over the other, or let it mark every pixel that changed and count them.

Your images are opened in this page only; nothing is uploaded. To shrink or resize an image first, use the [[image-resizer]]; to compare two texts instead, try [[compare-documents]].

## How to use it

1. Choose image A (before) and image B (after). An example pair is shown until you do.
2. Pick **Slider**, **Overlay** or **Difference**.
3. In Slider, drag across the picture or move the slider. In Overlay, change the opacity. In Difference, read the percent changed.
4. **Download this view** saves what you see as a PNG.

## What each setting does

- **Slider**: A shows on the left of the line and B on the right.
- **Overlay**: B is drawn over A; 0% shows only A, 100% only B.
- **Difference**: pixels that changed are red; everything else is faded grey. The percent is changed pixels out of all pixels.
- **Threshold**: how much a pixel's red, green, blue or transparency value (0 to 255) must change before it counts. 16 ignores tiny changes such as JPEG noise; 0 counts every change.
- **Different sizes**: B is scaled to A's width and height, and a note says so. If the shapes differ, B is stretched, so the difference view shows extra change.
- **Very large images** are compared at up to 2,000 pixels on the longest side.

## Worked example

The example is two 200 × 150 pictures of a house. In the second, one 10 × 10 square in the grass is dark blue. That is 100 changed pixels out of 200 × 150 = 30,000, so the difference view says 0.333% of pixels changed, and the square shows in red.

## FAQs

**Why does a re-saved JPEG show changes everywhere?** JPEG compression shifts many pixels slightly. Raise the threshold to 20 or 30 to see only real edits.

**Can I compare a photo with a cropped copy?** Not well: the pixels no longer line up, so most of the picture shows as changed.

**Does it work offline?** Yes. Once the page has loaded it needs no internet.
