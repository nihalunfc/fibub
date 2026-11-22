---
title: "Aperture photometry: measuring a star's brightness"
seoTitle: "Aperture photometry for beginners | Astronomy"
summary: "Add up the light inside a circle around a star, subtract the sky measured in a ring around it, and compare with stars of known brightness. That simple recipe gives magnitudes good to a few thousandths with care."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why measure the sky in a ring around the star?"
    choices: ["To find the sky level under the star and subtract it", "To find other stars", "To measure the seeing"]
    ans: 0
    why: "Every pixel in the aperture holds star light plus sky glow; the ring tells you how much is sky."
  - q: "Why use the median of the sky ring rather than the mean?"
    choices: ["It is faster", "Faint stars in the ring push the mean up but barely move the median", "The mean is always zero"]
    ans: 1
    why: "The median ignores a few bright pixels, so stray stars don't spoil the sky estimate."
  - q: "Differential photometry compares the target with:"
    choices: ["Stars in the same image", "The Moon", "Last year's catalogue only"]
    ans: 0
    why: "Comparison stars in the same frame went through the same air and clouds, so those effects cancel."
sources:
  - "Howell, S. B. (2006), Handbook of CCD Astronomy, Cambridge University Press (method described, not copied)"
---

**Module 5 · about 25 minutes · sums and logarithms.** You'll be able to measure a star's brightness on an image, choose the aperture and sky ring sizes, and turn counts into a calibrated magnitude using comparison stars.

## 1. Why this matters

Photometry, measuring brightness, is the backbone of a huge amount of research: variable stars, exoplanet transits, supernova light curves, asteroid rotation. It is also where amateurs with modest cameras make real contributions, because careful photometry needs patience more than a big telescope.

## 2. The recipe

1. **Find the star's centre** on a calibrated image ([Sky watching 6.3](/learn/courses/sky-watching/calibration-frames/)).
2. **Aperture**: add up every pixel's counts inside a circle of radius `$r$`.
3. **Sky ring (annulus)**: take the median of pixels in a ring well outside the star.
4. **Subtract**: star counts = aperture sum − (number of aperture pixels × sky per pixel).
5. **Instrumental magnitude**: `$m_\text{inst} = -2.5\log_{10}(\text{counts})$`.
6. **Compare** with stars of known magnitude in the same image.

<!--fig:aperture-sum-->

Things to notice:

- A tiny aperture misses part of the star; a big one adds sky noise. The best signal-to-noise comes near the star's width (FWHM).
- Moving the sky ring onto the star makes the sky too high and the star too faint.

<details class="maths" open>
<summary>Maths and principle</summary>

**Sky-subtracted counts**, with aperture sum `$\Sigma$`, `$n$` pixels and sky `$b$` per pixel:

```math
S = \Sigma - n\,b
```

**Signal-to-noise** ([Sky watching 6.2](/learn/courses/sky-watching/signal-to-noise/)), ignoring read noise and with `$n_\text{sky}$` pixels in the ring:

```math
\text{SNR} = \frac{S}{\sqrt{S + n\,b\,\left(1 + \dfrac{n}{n_\text{sky}}\right)}}
```

**Differential magnitude** against a comparison star `$c$` of known magnitude `$m_c$`:

```math
m = m_c - 2.5\log_{10}\frac{S}{S_c}
```

**Uncertainty in magnitudes**: `$\sigma_m \approx 1.086/\text{SNR}$`.
</details>

## 3. What it means physically

A star's light is spread over several pixels by the air and optics ([Sky watching 3.3](/learn/courses/sky-watching/seeing-transparency/)), so you must gather it all back up. The sky isn't black: air glow, light pollution and moonlight add light to every pixel, including those under the star. Comparing with stars in the same frame is powerful because thin cloud or changing altitude dims all of them by the same fraction, and a ratio cancels it out.

## 4. Worked example

*The target gives 15,400 counts in its aperture of 50 pixels; the sky ring median is 120 counts per pixel. A comparison star of magnitude 11.20 gives 25,000 sky-subtracted counts. What is the target's magnitude?*

```math
S = 15{,}400 - 50\times120 = 9{,}400
```

```math
m = 11.20 - 2.5\log_{10}\frac{9{,}400}{25{,}000} = 11.20 - 2.5\times(-0.425) = 11.20 + 1.06 = 12.26
```

SNR `$\approx 9400/\sqrt{9400 + 6000} = 76$`, so `$\sigma_m \approx 1.086/76 = 0.014$` mag.

## 5. Practice

1. An aperture of 30 pixels sums 8,000 counts; sky is 150 per pixel. What are the star counts and the instrumental magnitude?
2. Why should comparison stars have a similar colour to the target?
3. A measurement has SNR 200. What is its uncertainty in magnitudes?

<details>
<summary>Answers</summary>

1. `$S = 8000 - 4500 = 3500$`; `$m_\text{inst} = -2.5\log_{10}3500 = -8.86$`.
2. The air dims blue light more than red ([Sky watching 2.6](/learn/courses/sky-watching/airmass/)), so stars of different colours would change by different amounts as altitude changes.
3. `$1.086/200 = 0.005$` mag.
</details>

**Try it with real numbers:** open your own images in the [[fits-viewer]], check focus with the [[star-fwhm-checker]], and convert results with the [[magnitude-flux-converter]].

**New words:** *photometry*, *aperture*, *annulus*, *instrumental magnitude*, *differential photometry*, *comparison star*.
