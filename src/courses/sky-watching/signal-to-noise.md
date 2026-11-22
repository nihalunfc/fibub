---
title: "Exposure, noise and signal-to-noise"
summary: "Every image is signal plus noise. Photon counts have a natural randomness, the square root of the count, so the signal-to-noise ratio grows only as the square root of exposure time. Dark skies and low read noise help."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A pixel collects 10,000 photo-electrons from a star with no other noise. What is its SNR?"
    choices: ["10", "100", "10,000"]
    ans: 1
    why: "Shot noise is √10,000 = 100, so SNR = 10,000 / 100 = 100."
  - q: "To double the SNR of a sky-limited image, how much longer must you expose?"
    choices: ["Twice as long", "Four times as long", "Eight times as long"]
    ans: 1
    why: "SNR grows as √t in the sky-limited case, so doubling it needs 4 times the time."
  - q: "Why does light pollution hurt even though you subtract the sky level?"
    choices: ["The sky's shot noise remains after subtraction", "It changes star colours", "It heats the camera"]
    ans: 0
    why: "You can subtract the average sky, but not its random fluctuations, which add noise."
sources:
  - "Howell, S. B. (2006), Handbook of CCD Astronomy, 2nd ed., Cambridge University Press (the CCD equation, calibration frames)"
  - "Berry, R. and Burnell, J. (2005), The Handbook of Astronomical Image Processing, 2nd ed., Willmann-Bell"
---

**Module 6 · about 25 minutes · read first: [6.1 Cameras, pixels and image scale](/learn/courses/sky-watching/image-scale/), [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: square roots.** You'll be able to name the sources of noise in an astronomical image, compute signal-to-noise, and work out how exposure, sky and camera affect it.

<div class="bigidea">Every image is signal plus noise; photon counts have a natural randomness equal to the square root of the count, so signal-to-noise grows only as the square root of exposure time, and dark skies and low read noise help.</div>

## 1. Why this matters

Signal-to-noise ratio (SNR) is the single most important number in observational astronomy. It decides whether a faint galaxy shows up, how precise a brightness measurement is ([Astronomy 5.1](/learn/courses/astronomy/aperture-photometry/)) and how long a professional telescope proposal asks for. Once you think in SNR, every choice in imaging becomes a trade you can calculate.

## 2. Where noise comes from

- **Shot noise:** photons arrive at random. If you expect `$N$` on average, you'll get `$N$` give or take `$\sqrt N$` (Poisson statistics). This affects the star *and* the sky glow behind it.
- **Dark current:** heat in the sensor knocks loose electrons even in darkness. Cooling the camera reduces it. It too has shot noise.
- **Read noise:** each time the camera reads a pixel it adds a few electrons of random error, once per frame.

<!--fig:snr-growth-->

Things to notice:

- At short exposures read noise matters; once the sky signal per frame is large, the curve follows √t.
- Raise the sky glow and the same star needs much longer for the same SNR.

Watch signal and noise grow during an exposure:

<div class="steps">
<div class="step"><b>Photons arrive randomly,</b> like raindrops. Collect 100 on average and you get anywhere from about 90 to 110: noise √100 = 10.</div>
<div class="step"><b>Expose 4 times longer.</b> 400 photons, noise √400 = 20. Signal grew 4 times, noise only 2: SNR doubled.</div>
<div class="step"><b>Add sky.</b> A bright sky adds its own photons and its own noise, even though you subtract its average later.</div>
<div class="step"><b>Add the camera.</b> Read noise adds a fixed amount per frame; dark current adds noise that grows with time and temperature.</div>
<div class="step"><b>Example.</b> A star at 50 e⁻/s over 20 pixels with sky 5 e⁻/s per pixel, 60 s: SNR = 3,000 / √(3,000 + 6,000) = 31.6.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**The CCD equation** (simplified). A star gives `$S$` electrons per second over `$n_\text{pix}$` pixels; sky gives `$B$` per second per pixel; dark current `$D$` per second per pixel; read noise `$R$` per pixel per frame; exposure `$t$`:

```math
\text{SNR} = \frac{S t}{\sqrt{S t + n_\text{pix}(B + D)\,t + n_\text{pix} R^2}}
```

**Sky-limited case** (sky term dominates): `$\text{SNR} \approx S\sqrt{t} / \sqrt{n_\text{pix} B}$`, so SNR grows as `$\sqrt t$` and falls as `$1/\sqrt B$`.

**Try it:** a star giving 50 e⁻/s, with 20 pixels of sky at 5 e⁻/s each, no read noise, 60 s: `$\text{SNR} = 3000/\sqrt{3000 + 6000} = 3000/94.9 = 31.6$`.
</details>

Use the steps (or the Frame buttons) to clean the raw frame, and watch the single row of pixels below.

<figure class="fig" data-fig="@astro-ccd-steps"><figcaption>Subtracting bias and dark removes the offset and hot pixels. Dividing by the flat removes vignetting and dust shadows. After both, equal stars read equal counts anywhere on the chip, and the real signal stands above a flat sky.</figcaption></figure>

## 3. What helps

- **Longer total exposure** (one long or many short; Lesson 6.4).
- **Darker sky:** a sky 2.5 times darker (1 mag/arcsec²) is worth about 2.5 times the exposure time in the sky-limited case.
- **Bigger aperture:** more signal per second from the same star.
- **Narrowband filters:** passing only the light of glowing gas (such as hydrogen-alpha) cuts the sky glow enormously, which is why city imagers love them for emission nebulae.
- **Cooling** the camera to cut dark current.


<div class="meaning">

<dl>
<dt>√N</dt><dd>Shot noise: random spread of a count of N photons.</dd>
<dt>SNR = St / √(St + n(B + D)t + nR²)</dt><dd>The CCD equation: star, sky, dark and read noise.</dd>
<dt>SNR ∝ √t</dt><dd>In the sky-limited case, four times the time doubles the SNR.</dd>
<dt>Physical meaning</dt><dd>Catching photons is like counting raindrops in a cup: the number in any minute varies by chance. The variation grows more slowly than the count, so the longer you collect, the smaller the chance part is compared with the total.</dd>
</dl>

</div>

<div class="myth">

**"Subtracting the sky removes its noise."** Subtracting removes the sky's average level but not its random flicker. That noise stays in your image, which is why dark skies make such a difference to faint targets.

</div>

## 4. Worked example

*How long for SNR 50 on a faint star?* Star 10 e⁻/s, sky 20 pixels × 3 e⁻/s each = 60 e⁻/s, read noise ignored (long frames).

```math
50 = \frac{10 t}{\sqrt{10 t + 60 t}} = \frac{10 t}{\sqrt{70 t}} = \frac{10}{\sqrt{70}}\sqrt t = 1.195\sqrt t
```

so `$\sqrt t = 41.8$` and `$t = 1750$` s, about 29 minutes. With a sky four times darker (15 e⁻/s): `$50 = 10t/\sqrt{25t} = 2\sqrt t$`, so `$t = 625$` s, about 10 minutes. The darker site saves two-thirds of the time.

## 5. Practice

<div class="problem" data-problem="ccd-snr"></div>

**More practice** (answers below):

1. You expect 400 photons. What is the shot noise?
2. An image has SNR 20 after 10 minutes, sky-limited. How long for SNR 40?
3. Why does subtracting a constant sky level not remove light pollution's harm?

<details>
<summary>Answers</summary>

1. `$\sqrt{400} = 20$` photons.
2. 4 times longer: 40 minutes.
3. The sky's random fluctuations (shot noise) stay; only its average is removed.
</details>

<div class="keypoints">

- Photon (shot) noise is √N.
- SNR = St / √(St + n(B + D)t + nR²).
- Sky-limited: SNR grows as √t and falls as 1/√B.
- Magnitude error ≈ 1.086 / SNR.

</div>

**Try it with real numbers:** plan exposure lengths for your sky and camera with the [[sub-exposure-calculator]].

**New words:** *signal-to-noise ratio*, *shot noise*, *Poisson statistics*, *dark current*, *read noise*, *sky-limited*, *narrowband filter*.
