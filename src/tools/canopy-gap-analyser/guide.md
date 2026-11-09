---
name: Canopy gap analyser (hemispherical photos)
num: 338
shelf: science
section: forestry
title: "Hemispherical photo analysis: canopy openness, gap fraction and effective LAI"
summary: "Analyse a fisheye photo taken up through a forest canopy: circular mask, sky versus canopy from the blue channel with Otsu's threshold, gap fraction in zenith rings, canopy openness and effective leaf area index by Miller's formula. The photo stays in your browser."
status: live
ads: false
order: 338
icon: camera
works: offline
updated: 2026-11-09
related: [tree-carbon, spectral-index-calculator, biodiversity-indices]
sources:
  - "Miller, J. B. (1967) A formula for average foliage density. Australian Journal of Botany 15, 141–144 (LAI = 2 ∫ −ln T(θ) cos θ sin θ dθ)."
  - "Ring sums weighted by sin θ Δθ, as in the LAI-2000 plant canopy analyser's method (Welles, J. M. and Norman, J. M. (1991) Instrument for indirect measurement of canopy architecture. Agronomy Journal 83, 818–825); fibub uses equal rings of your choice, not the instrument's ring table."
  - "Otsu, N. (1979) A threshold selection method from gray-level histograms. IEEE Transactions on Systems, Man, and Cybernetics 9, 62–66; using the blue channel for sky follows common practice in hemispherical photography (for example Jonckheere, I. et al. (2004) Agricultural and Forest Meteorology 121, 19–35)."
  - "Ring gap fractions, openness and LAI are checked in the tests against an independent NumPy version on a made-up fisheye picture (agreement to 1e-9), and on an exact made-up canopy with LAI 3, which comes back as 3.00."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: camera, label: "Photo" }
  - { icon: target, label: "Circle" }
  - { icon: sliders, label: "Sky" }
  - { icon: chart, label: "LAI" }
---

## What it does

A fisheye photo taken from the forest floor looking straight up records where sky shows through the canopy. From it you can estimate how open the canopy is and how much leaf area is above you. This page does the core of what dedicated hemispherical-photo programs do:

- **Circle.** The round fisheye image is masked to its circle. Its edge is the horizon (zenith angle 90°) and its centre is straight up.
- **Sky or canopy.** Each pixel inside the circle is sky when its blue value is above a threshold, chosen automatically with Otsu's method or typed by you. Leaves and stems are dark in blue light; sky is bright.
- **Rings.** The circle is split into equal zenith-angle rings, assuming an equidistant lens (angle grows evenly with distance from the centre). Each ring's gap fraction is its share of sky pixels.
- **Results.** Canopy openness (sky as a share of the hemisphere, each pixel weighted by the solid angle it covers), gap fraction (plain share of sky pixels in the circle), and **effective LAI** from Miller's formula.

The photo is read on this page only and is never uploaded.

## How to use it

1. **Photo.** Take the photo with a circular fisheye lens, camera level and pointing straight up, top of the image to north if you can. Use an overcast sky or dawn and dusk, and expose for the sky so it is bright but not burnt out. Open the photo.
2. **Circle.** The page starts with a circle centred in the photo. If your circle is smaller or off centre, press *Tap the centre, then the edge*, or type the centre and radius in pixels.
3. **Sky.** Look at the yellow sky pixels. If small gaps are missed or bright leaves count as sky, type a threshold.
4. **LAI.** Read the effective LAI, openness and the ring table, and download the CSV or a report.

## What each option does

- **Zenith rings.** How many equal rings the circle is cut into. Five rings is common.
- **Rings reach.** 75° leaves out the band near the horizon, where the canopy is seen almost sideways, gaps vanish and errors are largest (the LAI-2000 instrument does the same). 90° uses everything; 60° keeps only the steeper view.
- **Sky threshold.** Blue values above it are sky. A few units either way can change the LAI noticeably, so keep the same rule for every photo you compare.

## Worked example

The made-up example is a 600 px fisheye view through a canopy drawn with randomly placed leaves and a leaf area index of 2.5, so the true gap fraction at zenith angle θ is exp(−1.25 ÷ cos θ). With the automatic threshold (blue > 31), five rings and 75°, the page shows **Effective LAI: 2.51**, canopy openness 10.3 % and a gap fraction of 9.2 %. The rings read 27.5, 25.5, 20.2, 12.7 and 3.9 % gaps, close to the drawn 28.3, 25.9, 20.7, 12.8 and 3.8 %. With the five rings reaching 90° instead, the LAI drops to 2.31, because the outermost ring is wide where the gap fraction changes fastest.

## Tips

- Never shoot with the sun in the frame or with blue sky and white clouds mixed; uneven sky ruins the threshold.
- Use the camera's raw or least-processed image and turn off automatic contrast and sharpening if you can.
- Take several photos per plot at fixed points and average the LAI.
- Effective LAI treats leaves as randomly spread. Real canopies are clumped, so true LAI is usually higher; it also counts stems and branches (plant area index).

## FAQ

**Why is it called effective LAI?** Miller's formula assumes leaves are scattered at random. Clumped foliage lets more light through, so the formula gives a lower "effective" value. Clumping corrections need more detail than one photo gives.

**My lens is not equidistant. Does it matter?** Many fisheye lenses are close to equidistant. Equisolid-angle lenses put the outer rings at slightly different angles; the error is a few percent in the outer rings. The page does not correct for lens type.

**What is the difference between openness and gap fraction?** Gap fraction counts pixels as they are on the photo. Openness weights each pixel by the patch of sky it really covers, so it is the share of the whole sky hemisphere that is open.
