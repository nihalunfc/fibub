---
title: "Processing honestly: stretch, colour and what is real"
summary: "Astronomical data are linear and mostly dark; a stretch makes the faint parts visible. Colour comes from filters and is often mapped from invisible wavelengths. Honest processing changes how data look, never what they say."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why does an unstretched (linear) astronomical image look almost black?"
    choices: ["The camera failed", "Faint parts hold a tiny fraction of the bright core's signal, which sets the display range", "Linear images have no colour"]
    ans: 1
    why: "Displayed linearly, values below a few percent of the maximum look black."
  - q: "In the Hubble palette, which colour usually shows oxygen (O III) light?"
    choices: ["Red", "Green", "Blue"]
    ans: 2
    why: "The common SHO mapping puts sulphur in red, hydrogen in green and oxygen in blue."
  - q: "Which step is NOT honest processing?"
    choices: ["Applying the same stretch curve to the whole image", "Removing a satellite trail by rejecting outlier pixels", "Painting in a spiral arm that the data don't show"]
    ans: 2
    why: "Adding detail that isn't in the data turns an image into an illustration."
sources: []
---

**Module 6 · about 25 minutes · functions and curves.** You'll be able to explain linear data and stretching, describe how colour images are made, and tell honest processing from fabrication.

## 1. Why this matters

Astronomical images shape how the public imagines the universe, and professional images are data first. Knowing what each processing step does lets you make beautiful images that are also true, and read other people's images critically.

## 2. Linear data and stretching

A camera records light **linearly**: twice the photons, twice the number. A galaxy's core may be 1,000 times brighter than its outer arms. Shown linearly, with the core set to white, the arms land near black.

A **stretch** is a curve that maps recorded values to display values, lifting faint values much more than bright ones. Common curves: a **gamma** curve (like a phone camera), and the **arcsinh** stretch (linear for faint values, logarithmic for bright ones, which keeps star colours). The **black point** sets which value becomes black.

<!--fig:stretch-curve-->

Things to notice:

- Linear: only the core shows.
- Arcsinh with strength 40: the arms appear, the core is not burnt out.
- Raising the black point too far clips faint data to black: information lost.

<details class="maths" open>
<summary>Maths and principle</summary>

**Stretches** (input `$x$` and output `$y$` from 0 to 1, after subtracting the black point `$b$`: `$x' = (x - b)/(1 - b)$`):

```math
y_\text{gamma} = x'^{1/\gamma}, \qquad y_\text{asinh} = \frac{\operatorname{asinh}(\beta x')}{\operatorname{asinh}\beta}
```

**Why arcsinh:** `$\operatorname{asinh}(z) \approx z$` for small `$z$` and `$\approx \ln(2z)$` for large `$z$`, so faint signal is lifted strongly while bright parts are compressed like magnitudes.

**Colour-preserving stretch:** apply the same factor to R, G and B of each pixel (computed from its total brightness), so a star's colour ratio is kept.

**Try it:** with `$\beta = 40$`, a value of 0.01 becomes `$\operatorname{asinh}(0.4)/\operatorname{asinh}(40) = 0.390/4.382 = 0.089$`: nine times brighter on screen.
</details>

## 3. Where colour comes from

- **Broadband RGB:** red, green and blue filters (or a colour sensor) give roughly natural colour after **colour calibration**, which can use stars of known colour.
- **Narrowband:** filters that pass single emission lines: hydrogen-alpha (656 nm, deep red), oxygen III (501 nm, teal), sulphur II (672 nm, red). Mapping three of them to red, green and blue (the "Hubble palette", SHO) is a **false-colour** image: it shows chemistry, not what the eye would see. Say so in the caption.
- **Invisible light:** infrared, ultraviolet, X-ray and radio images ([Astronomy 1.6](/learn/courses/astronomy/beyond-visible/)) are always mapped to visible colours by choice.

## 4. Honest processing

Fair: calibration, stacking with outlier rejection, a global stretch, colour calibration, gentle noise reduction and sharpening applied evenly, removing gradients from light pollution, and stating what you did.

Not fair: painting or cloning in detail, pasting stars or objects from other images, AI "enhancement" that invents structure, or presenting false colour as natural. If in doubt, describe your steps in the caption, as professional image releases do.

## 5. Worked example

*How much does a stretch lift faint arms?* Core at 0.9, arms at 0.004 above a black point of 0.002.

- Linear display: arms `$(0.004 - 0.002)/0.998 = 0.002$`: 0.2% grey, invisible.
- Arcsinh `$\beta = 100$`: `$\operatorname{asinh}(0.2)/\operatorname{asinh}(100) = 0.199/5.298 = 0.0375$`; with gamma 2.2 on top for display, about 0.22: clearly visible. The core maps to about 0.99: still bright, not clipped.

## 6. Practice

1. Is an image with hydrogen-alpha shown in green "natural colour"?
2. What happens to faint data if the black point is set above their level?
3. Why should the same stretch apply to the whole image?

<details>
<summary>Answers</summary>

1. No: it is false colour (hydrogen-alpha is deep red).
2. They become pure black: the information is clipped away.
3. A local stretch can create or hide structure; a global curve keeps the relative brightness order of every pixel.
</details>

**Try it with your own files:** open FITS images and try linear, log and arcsinh stretches in the [[fits-viewer]].

**New words:** *linear data*, *stretch*, *gamma*, *arcsinh stretch*, *black point*, *colour calibration*, *narrowband*, *false colour*, *Hubble palette*.
