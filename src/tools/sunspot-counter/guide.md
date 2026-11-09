---
name: Sunspot counter
num: 75
shelf: science
section: solar-physics
title: "Sunspot counter: Wolf number, groups and spot areas from your own photo of the Sun"
summary: "Open a white-light photo of the Sun and the tool finds the disc, the spots and the groups, and gives the relative sunspot (Wolf) number with spot areas. Tap to correct anything it got wrong."
status: live
ads: false
order: 21
icon: target
works: offline
updated: 2026-11-08
related: [sun-position-calculator, eclipse-finder, telescope-calculator, fits-viewer, observing-log]
flow:
  - { icon: image, label: "Sun photo" }
  - { icon: search, label: "Find spots" }
  - { icon: calculator, label: "Wolf number" }
---

## What it does

Counting sunspots is one of the longest-running experiments in science. Observers have counted them in the same way since Rudolf Wolf started in 1848, and amateur counts still feed the international record. The **relative sunspot number** is R = k (10 g + s): g is the number of groups, s the number of individual spots, and k a personal factor that matches your telescope and eye to the standard.

This tool does the counting on your own white-light image. It finds the solar disc and measures the limb darkening (the Sun's edge is dimmer than its centre) so that it can be divided out. Then it picks out every region darker than the surrounding surface. Each dark core (umbra) inside a region counts as a spot, and a region without one, a pore or lone penumbra, counts as one. Spots closer together than a chosen distance on the Sun's surface form a group. The distance is measured on the sphere, so spots squeezed together near the edge are not grouped too eagerly. You get R, the groups, and each group's area in millionths of the visible hemisphere, corrected for foreshortening.

Automatic counts are a starting point. Tap any marked spot to leave it out (dust on the sensor, a cloud edge), or tap the disc to add a spot it missed.

To see where the Sun is in the sky when you take the photo, use the [[sun-position-calculator]]; for the next solar eclipse, the [[eclipse-finder]].

## How to use it

1. **Safety first.** Only image the Sun through a certified full-aperture solar filter, or by projection. Never look through an unfiltered instrument.
2. Open the picture: JPEG, PNG or FITS, with the whole disc in the frame. A sharp, well exposed image without clipping works best.
3. Set the **sensitivity**. "High" picks up small pores and faint penumbrae; "low" counts only clear spots.
4. Choose the **grouping distance**. 10° suits most groups; large, sprawling groups may need 15°.
5. Check the marks on the image, correct them by tapping, and note the date. Download the spots as a CSV for your log, or the page as a PNG, PDF or Word file.

## Worked example

The example is a simulated image of a limb-darkened Sun with three spot groups. The tool finds seven dark regions. Three are on the left, where one is a small pore with no umbra, which still counts as one spot. Three are on the right, and one spot sits alone towards the limb. Grouped at 10°, that is g = 3 and s = 7, so R = 10 × 3 + 7 = **37**. Tap the lone spot to leave it out and R drops to 26 (2 groups, 6 spots). Tap it again to bring it back. Tap an empty part of the disc and a hand-added spot (drawn as a square) starts a group of its own.

## Frequently asked questions

**Why does my count differ from the international number?** Seeing, aperture and what counts as a separate spot all vary. That is what the k factor is for: after a few months, divide the international numbers by your own to find yours.

**Can it read the heliographic latitude and longitude?** Not yet: that needs the Sun's orientation (P, B₀ and L₀ angles) and the image's north. The positions given are relative to the disc's centre.

**Does it work with hydrogen-alpha or calcium images?** It is made for white light. In narrow-band images, filaments and plage confuse the count.

**Is my image uploaded?** No. Everything happens in your browser, and the page works offline.
