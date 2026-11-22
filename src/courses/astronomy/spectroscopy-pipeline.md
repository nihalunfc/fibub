---
title: "From raw spectrum to science: a spectroscopy pipeline"
seoTitle: "Reducing a spectrum: calibration step by step | Astronomy"
summary: "A spectrum on the detector is just a smear of counts. Calibrate it, trace and extract it, put a wavelength scale on it with a lamp, correct for the instrument's response, and only then measure lines and velocities."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why take a lamp (arc) spectrum?"
    choices: ["To warm the camera", "To turn pixel positions into wavelengths using known lines", "To measure the star's brightness"]
    ans: 1
    why: "Lamp lines have known lab wavelengths, so they pin the wavelength scale."
  - q: "A wavelength error of 0.1 nm at H-alpha (656 nm) causes a velocity error of about:"
    choices: ["0.5 km/s", "45 km/s", "450 km/s"]
    ans: 1
    why: "Δv = c Δλ/λ = 300,000 × 0.1/656 ≈ 46 km/s."
  - q: "Why correct for the instrument's response with a standard star?"
    choices: ["The detector and grating are more sensitive at some wavelengths, distorting the shape", "To remove cosmic rays", "To find the period"]
    ans: 0
    why: "A star with a known spectrum shows how the system distorts the shape, so it can be divided out."
sources:
  - "Neon line wavelengths in air: NIST Atomic Spectra Database (lab values, used in the figure)"
---

**Module 5 · about 25 minutes · read first: [1.3 Spectral lines: fingerprints of atoms](/learn/courses/astronomy/spectral-lines/), [1.4 The Doppler shift](/learn/courses/astronomy/doppler-shift/), [Sky watching 6.3 Calibration frames: darks, flats and bias](/learn/courses/sky-watching/calibration-frames/) · maths: straight-line fits.** You'll be able to list the steps that turn a raw spectrum into a calibrated one, put a wavelength scale on it, and see how calibration errors become velocity errors.

<div class="bigidea">A spectrum on the detector is just a smear of counts; calibrate it, extract it, put a wavelength scale on it with a lamp, correct for the instrument, and only then measure lines and speeds.</div>

## 1. Why this matters

Spectra give compositions, temperatures and velocities (Module 1), but only after careful reduction. Small, affordable spectrographs now let amateurs measure star types, Doppler shifts of bright binaries and even nova spectra, and archives hold millions of already-reduced spectra. Knowing the pipeline tells you what can go wrong.

## 2. The steps

1. **Calibrate the image**: bias, dark, flat, as for any image ([Sky watching 6.3](/learn/courses/sky-watching/calibration-frames/)).
2. **Trace**: find where the star's spectrum runs across the detector (a curved line, usually).
3. **Extract**: add up the counts across the trace at each position, subtracting the sky beside it.
4. **Wavelength calibrate**: take a lamp spectrum through the same setup; match its lines to their lab wavelengths; fit pixel → wavelength.
5. **Response correction**: divide by the shape seen in a standard star to remove the instrument's colour bias.
6. **Measure**: identify lines, fit their centres, convert shifts to velocities.

<!--fig:wave-cal-->

Things to notice:

- Both the starting wavelength and the scale (nm per pixel) must be right; one alone leaves misses at the ends.
- The velocity only means something once the lamp lines sit on their ticks.

Turn a raw spectrum image into a velocity:

<div class="steps">
<div class="step"><b>Calibrate.</b> Subtract bias and dark, divide by a flat, exactly as for images.</div>
<div class="step"><b>Trace and extract.</b> Follow the bright stripe of starlight across the detector and add up each column into one number: counts per pixel.</div>
<div class="step"><b>Wavelength scale.</b> Take a lamp spectrum (neon, argon or thorium) with known lines. Fit pixel → wavelength, say λ = 400 + 0.1 x nm.</div>
<div class="step"><b>Correct.</b> Divide by the instrument's response, measured on a standard star.</div>
<div class="step"><b>Measure.</b> Fit the H-alpha line centre at 656.50 nm. Shift = 0.22 nm, so the star recedes at 100 km/s.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Dispersion solution** (simplest form, a straight line from pixel `$x$` to wavelength):

```math
\lambda(x) = \lambda_0 + D\,x
```

Real pipelines fit a polynomial of order 3 to 5 to many lamp lines by least squares (Lesson 5.7).

**Resolution**: a spectrograph's resolving power is `$R = \lambda/\Delta\lambda$`. With `$R = 5000$` at 656 nm, `$\Delta\lambda = 0.13$` nm, and velocities can be measured to a small fraction of `$c/R = 60$` km/s.

**Velocity error from a wavelength error**: `$\sigma_v = c\,\sigma_\lambda/\lambda$`.
</details>

## 3. What it means physically

The grating in a spectrograph spreads light into its colours like a prism, but each instrument spreads it a little differently, and the setup flexes with temperature. The lamp, taken right before or after the star, is a ruler laid alongside your spectrum, made of atoms whose line positions are known exactly. Everything you later claim, such as a planet's tug of a few m/s, depends on how well that ruler is held still.


<div class="meaning">

<dl>
<dt>λ(x) = λ₀ + D x</dt><dd>Dispersion solution: wavelength at pixel x.</dd>
<dt>R = λ / Δλ</dt><dd>Resolving power: how finely the spectrograph separates wavelengths.</dd>
<dt>σ<sub>v</sub> = c σ<sub>λ</sub> / λ</dt><dd>Velocity uncertainty from a wavelength uncertainty.</dd>
<dt>Physical meaning</dt><dd>The lamp is a ruler laid beside the starlight. Without it, a spectrum is a strip of brightness with no numbers on it; with it, each pixel gets a wavelength, and any shift of a line from its laboratory place becomes a speed.</dd>
</dl>

</div>

<div class="myth">

**"A spectrograph shows the true colours of a star."** Raw spectra are tilted by the instrument and the atmosphere: some wavelengths are recorded more efficiently than others. Only after dividing by the response does the shape mean anything physical.

</div>

## 4. Worked example

*Two neon lines, 585.25 nm and 640.22 nm, fall on pixels 172 and 744. What is the dispersion solution, and what wavelength is pixel 760?*

```math
D = \frac{640.22 - 585.25}{744 - 172} = \frac{54.97}{572} = 0.0961\ \text{nm/px}, \qquad \lambda_0 = 585.25 - 0.0961\times172 = 568.72\ \text{nm}
```

```math
\lambda(760) = 568.72 + 0.0961\times760 = 641.76\ \text{nm}
```

## 5. Practice

<div class="problem" data-problem="spectral-resolution"></div>

**More practice** (answers below):

1. With `$D = 0.1$` nm/px, how many pixels does a 30 km/s shift of H-alpha move?
2. Why is the lamp taken through the same slit and grating as the star?
3. What is the resolving power of a spectrograph that just separates lines 0.5 nm apart at 500 nm?

<details>
<summary>Answers</summary>

1. `$\Delta\lambda = 656.3\times30/299{,}792 = 0.066$` nm, so 0.66 pixels. Line centres are fitted to small fractions of a pixel.
2. So the light follows the identical path and lands where the star's light of the same wavelength would.
3. `$R = 500/0.5 = 1000$`.
</details>

<div class="keypoints">

**Key points**

- Steps: calibrate, trace, extract, wavelength-calibrate, flux-calibrate, measure.
- Arc lamps with known lines give the pixel-to-wavelength fit.
- Resolving power R = λ/Δλ sets what can be measured.
- Line centres give radial velocities: σ<sub>v</sub> = c σ<sub>λ</sub>/λ.

</div>

**Try it with real numbers:** identify lines with the [[spectral-line-identifier]], and turn shifts into speeds with the [[redshift-calculator]].

**New words:** *spectral reduction*, *trace*, *extraction*, *wavelength calibration*, *arc lamp*, *dispersion*, *resolving power*.
