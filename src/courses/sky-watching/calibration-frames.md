---
title: "Calibration frames: darks, flats and bias"
summary: "Raw astronomical images carry the camera's own faults: hot pixels, glow, vignetting and dust shadows. Dark, flat and bias frames record those faults so you can subtract and divide them out."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "How do you take a dark frame?"
    choices: ["Point at a dark patch of sky", "Same exposure and temperature as the lights, with the telescope covered", "The shortest exposure possible"]
    ans: 1
    why: "Darks record the sensor's own signal for that exposure and temperature, with no light."
  - q: "Why are flats divided rather than subtracted?"
    choices: ["Vignetting and dust reduce light by a fraction, which multiplies the image", "Division is faster", "Flats are always brighter"]
    ans: 0
    why: "A corner that gets 70% of the light has every value multiplied by 0.7; dividing by 0.7 restores it."
  - q: "What must stay the same between your lights and your flats?"
    choices: ["The exposure time", "The optical setup: focus, camera rotation and dust", "The sky"]
    ans: 1
    why: "Flats map the light path; if you move the camera or refocus, the dust shadows and vignetting move too."
sources: []
---

**Module 6 · about 25 minutes · arithmetic on images.** You'll be able to name each calibration frame, take it correctly, and apply the calibration formula.

## 1. Why this matters

Calibration is what separates a measurement from a pretty picture. Professional pipelines ([Astronomy 5.4](/learn/courses/astronomy/spectroscopy-pipeline/)) calibrate every frame before anything else, and photometry ([Astronomy 5.1](/learn/courses/astronomy/aperture-photometry/)) is only as good as its flats. For imagers, calibration removes the faults that no amount of processing can hide.

## 2. The frames

- **Light frames:** your images of the target.
- **Bias frames:** the shortest possible exposures with no light: the camera's fixed electronic offset and pattern.
- **Dark frames:** the same exposure length and sensor temperature as the lights, with the telescope capped: bias plus heat-generated signal (dark current), including **hot pixels** and **amp glow**.
- **Flat frames:** images of an evenly lit surface (twilight sky, a light panel) through the same optical train: they record **vignetting** (darker corners) and **dust shadows** (rings, called "dust donuts" from out-of-focus dust).
- **Flat darks** (or bias): to remove the camera's offset from the flats.

Each kind is combined from many frames (often 20 to 50) into a low-noise **master**.

<!--fig:calib-frames-->

Things to notice:

- Subtracting the dark removes hot pixels and the glow on the right; it doesn't touch the corners or dust rings.
- Dividing by the flat brightens the corners and erases the dust rings. Do both for a clean frame.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the raw value in a pixel is (sky signal × fraction of light reaching that pixel) + dark signal + bias. Undo it in reverse order.

**Calibration formula:**

```math
\text{calibrated} = \frac{\text{light} - \text{dark}}{(\text{flat} - \text{flat dark}) \,/\, \overline{(\text{flat} - \text{flat dark})}}
```

The flat is divided by its own mean so it averages 1, and the calibrated image keeps the original scale.

**Why many frames per master:** combining `$n$` frames cuts their random noise by `$\sqrt n$`. A noisy master dark would add its noise to every light.
</details>

## 3. Worked example

*One pixel in a dusty corner.* The true sky signal is 200 e⁻. The corner gets only 50% of the light because of vignetting and dust, and the dark signal for that exposure is 30 e⁻.

- Raw light: `$200 \times 0.5 + 30 = 130$`.
- Flat (after its own dark): this pixel reads 500 e⁻ where the flat's average is 1,000, so its normalised value is 0.5.
- Calibrated: `$(130 - 30)/0.5 = 200$` e⁻. The true signal is back.

Without the flat, the corner would read 100: half the true brightness, and any photometry there would be off by 0.75 magnitudes.

## 4. Practical tips

- Take flats without moving focus or the camera, ideally the same night.
- Expose flats to about a third to a half of the sensor's full range.
- Build a library of darks for each exposure and temperature if your camera is cooled.
- Many modern cameras have tiny dark current; bias and flats then matter more than darks.

## 5. Practice

1. Raw light 900, dark 100, normalised flat 0.8. What is the calibrated value?
2. You refocused halfway through the night. What should you do about flats?
3. Why can't a dark frame remove dust shadows?

<details>
<summary>Answers</summary>

1. `$(900 - 100)/0.8 = 1000$`.
2. Take flats for each focus position (the dust shadows changed).
3. Dust removes a fraction of the incoming light (it multiplies the signal); a dark frame records only the camera's own signal, which is added.
</details>

**Try it with your own files:** build masters and calibrate frames in your browser with the [[calibration-frames]] tool, then look at the results with the [[fits-viewer]].

**New words:** *light frame*, *bias frame*, *dark frame*, *flat frame*, *master frame*, *hot pixel*, *amp glow*, *vignetting*.
