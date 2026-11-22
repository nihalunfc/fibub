---
title: "Cameras, pixels and image scale"
summary: "Image scale, in arcseconds per pixel, links your camera to your telescope. Match it to your seeing: about 2 to 3 pixels across a star's blur gives sharp stars without wasting light."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A camera with 3.76 µm pixels on a 400 mm telescope has what image scale?"
    choices: ["about 0.5″/px", "about 1.9″/px", "about 9.4″/px"]
    ans: 1
    why: "206.265 × 3.76 / 400 = 1.94 arcseconds per pixel."
  - q: "Your seeing is 3″ and your image scale 4″/px. What is the problem?"
    choices: ["Oversampled", "Undersampled: stars fall on one pixel and look blocky", "No problem"]
    ans: 1
    why: "The star's blur is smaller than one pixel, so detail is lost."
  - q: "What does a camera pixel measure?"
    choices: ["The colour of light only", "The number of photons (as electrons) that land on it during the exposure", "The temperature of the star"]
    ans: 1
    why: "Each pixel counts photo-electrons; colour comes from filters."
sources: []
---

**Module 6 · about 25 minutes · small angles.** You'll be able to explain how a camera sensor records light, work out image scale and field, and judge whether a camera suits a telescope and your seeing.

## 1. Why this matters

Astrophotography is where amateurs push hardest and where professional methods start. Getting the camera and telescope matched is the first decision, and image scale also sets the precision of measurements: astrometry, photometry and double star measures all depend on it.

## 2. How a sensor records light

A camera sensor is a grid of **pixels**, each a tiny light bucket. Photons knock electrons loose in the silicon (the photoelectric effect); the camera counts them after the exposure. The fraction of photons that become electrons is the **quantum efficiency** (often 50% to 90% today, far above film's few percent). Colour cameras put a mosaic of red, green and blue filters over the pixels; monochrome astronomy cameras take separate exposures through filters.

## 3. Image scale and sampling

The telescope's focal length spreads the sky over the sensor. One pixel then covers a small patch of sky: the **image scale**.

<!--fig:sampling-->

Things to notice:

- A short focal length or big pixels make each pixel cover more sky: wide fields, but stars can collapse to single blocky pixels.
- A long focal length with small pixels spreads each star over many pixels: fine detail if the air allows, but each pixel gets less light.
- Aim for about 2 to 3 pixels across the star's FWHM for your typical seeing (often 1″ to 2″ per pixel for deep-sky imaging).

<details class="maths" open>
<summary>Maths and principle</summary>

**Image scale** for pixel size `$p$` (µm) and focal length `$F$` (mm):

```math
s = 206.265 \times \frac{p}{F} \quad \text{arcseconds per pixel}
```

(206,265 arcseconds in a radian; the 1,000 between µm and mm turns it into 206.265.)

**Field of view** along a sensor side of `$L$` mm: `$\theta \approx 57.3^\circ \times L / F$` (or exactly `$2\arctan(L/2F)$`).

**Sampling:** with star FWHM `$\varepsilon$` (from seeing and optics), aim for

```math
\frac{\varepsilon}{3} \lesssim s \lesssim \frac{\varepsilon}{2}
```

Fewer than about 1.5 pixels across the FWHM is undersampled; more than about 4 oversampled.

**Try it:** 4.63 µm pixels, 1,000 mm: `$s = 206.265 \times 4.63/1000 = 0.95''$`/px. With 2.5″ seeing: 2.6 pixels across. Good.
</details>

## 4. Worked example

*A full-frame camera (36 × 24 mm, 6 µm pixels) on a 600 mm lens, typical seeing 2.5″.*

- Image scale: `$206.265 \times 6 / 600 = 2.06''$`/px; stars span `$2.5/2.06 = 1.2$` pixels: slightly undersampled, so stars look a little blocky at 100% zoom, but fine on a screen.
- Field: `$57.3 \times 36/600 = 3.4^\circ$` by `$57.3 \times 24/600 = 2.3^\circ$`: the whole Andromeda Galaxy fits (Lesson 6.6).

Planetary imagers do the opposite: they use long focal lengths (often with a Barlow lens) to reach about 0.1″ to 0.2″ per pixel, because they catch moments of steady seeing in very short frames.

## 5. Practice

1. Image scale of 2.9 µm pixels at 250 mm?
2. Which focal length gives 1.0″/px with 3.76 µm pixels?
3. Why might a camera good for wide fields be poor for planets?

<details>
<summary>Answers</summary>

1. `$206.265 \times 2.9/250 = 2.39''$`/px.
2. `$F = 206.265 \times 3.76 / 1.0 = 776$` mm.
3. At a wide-field image scale, a planet only a few tens of arcseconds across covers just a few pixels.
</details>

**Try it with real numbers:** work out image scale, field and sampling for your camera and telescope with the [[telescope-calculator]], and measure star FWHM in your own images with the [[star-fwhm-checker]].

**New words:** *pixel*, *quantum efficiency*, *image scale*, *sampling*, *undersampled*, *oversampled*, *Barlow lens*.
