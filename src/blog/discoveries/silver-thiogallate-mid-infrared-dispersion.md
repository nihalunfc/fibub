---
title: "AgGaS2 refractive index to 21 µm, measured with undetected photons"
summary: "A 2026 open-access paper measures how the refractive index of the crystal AgGaS2 changes with wavelength out to 21 µm, without any infrared detector. Here is how, and how to fit dispersion data yourself."
tools: [sellmeier-fitter, curve-fitter, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Zatsepin, E. S., Sabanin, A. S., Badikov, D. V., Kulik, S. P. and Paterova, A. V. (2026), Dispersion Analysis of Silver Thiogallate in a Broad Mid-Infrared Range, Advanced Photonics Research 7(1), e202500267. Open access under the Creative Commons Attribution licence. Details checked on the DOAJ record and the article PDF, 2026-11-10."
  - "Sellmeier equation n² = 1 + Σ Bᵢλ²/(λ² − Cᵢ): standard optics."
paper:
  title: "Dispersion Analysis of Silver Thiogallate in a Broad Mid-Infrared Range"
  authors: "Zatsepin E S, Sabanin A S, Badikov D V, Kulik S P, Paterova A V"
  journal: "Advanced Photonics Research"
  year: 2026
  doi: "10.1002/adpr.202500267"
  url: "https://doi.org/10.1002/adpr.202500267"
  licence: "CC BY"
  reviewed: true
---

To build a laser or frequency converter that works in the mid-infrared, you need to know exactly how a crystal's refractive index changes with wavelength. For silver thiogallate (AgGaS₂), a crystal widely used for this, good data stopped at around 10 µm. A 2026 open-access paper in *Advanced Photonics Research* pushes the measured range out to 21 µm, using pairs of photons so that only visible-to-near-infrared light ever has to be detected. Fitting a smooth formula through index data like this is exactly what the [[sellmeier-fitter|Sellmeier fitter]] does; for the paper's own formula, which has extra terms, use the [[curve-fitter]] with a typed formula.

## What they found

The team reports the ordinary and extraordinary refractive indices of AgGaS₂ (the two indices a crystal of this type has for the two directions of polarisation) across about 7 to 21 µm. They give new dispersion equations for both, with an estimated accuracy of about 0.001 in the index.

Their results agree with the best earlier equations up to roughly 13.7 µm for the extraordinary index and 14.7 µm for the ordinary index. Beyond that, the old equations, which were fitted to data that ended near 10.6 µm, start to drift away from the new measurements. In other words, the earlier formula was being stretched past the data it was built on.

## Why it matters

Mid-infrared light between about 3 and 20 µm is where many molecules absorb, which makes it valuable for gas sensing and chemical analysis. Crystals like AgGaS₂ convert laser light into this range, but only if the light waves inside stay in step, which depends on the refractive index at every wavelength involved. An index that is wrong in the third decimal place can put the best crystal angle off by enough to matter. Reliable numbers out to 21 µm widen the range over which designers can trust their calculations.

## How they did it

The method is a nonlinear interferometer. A near-infrared pump laser (about 784 nm) shines into the crystal, which now and then splits a pump photon into two: a "signal" photon near 810 to 880 nm and an "idler" photon far in the infrared. A mirror sends all three back through the crystal for a second pass. The two chances to make a photon pair interfere, and the pattern of that interference, seen only in the signal light, depends on the idler's wavelength and on how fast each wavelength travels in the crystal.

So a spectrometer and a sensitive camera for near-infrared light are enough to learn about the crystal's behaviour at 15 or 20 µm. The team fitted the measured patterns to work out the indices, leaving out a band around 14 to 16 µm where the spectra were smeared by an effect called polariton scattering.

## Check it yourself with fibub

The paper does not ship its raw data, and its equation form differs from the one in our tool, so here we practise the key lesson, extrapolation, with **made-up data**. We invented a two-term Sellmeier crystal (one resonance in the ultraviolet near 0.3 µm and one in the far infrared near 31.6 µm), worked out its index from 2 to 10 µm, and rounded to four decimals:

```
2   2.3655
3   2.3510
4   2.3437
5   2.3377
6   2.3316
7   2.3249
8   2.3172
9   2.3084
10  2.2982
```

1. Paste the two columns into the [[sellmeier-fitter]]. Leave the unit on *Guess*: values below 50 are read as micrometres.
2. Choose **Sellmeier, 2 terms** and type **18000** nm in *Evaluate at*.
3. The fit leaves an RMS residual of about **1.3 × 10⁻⁵**, the size of our rounding, and finds resonances at **0.300 µm** and **31.7 µm**, close to the ones we invented.
4. The page gives **n = 2.1318 at 18 µm**, flagged as extrapolated. Our invented crystal's true value there is 2.1314. Good.
5. Now look at the comparison table. The one-term Sellmeier and the three-term Cauchy cannot bend the curve down towards the infrared resonance; they give about **2.318** and **2.308** at 18 µm, wrong in the first decimal place, even though they fitted the 2 to 10 µm data with RMS residuals of only about 0.01.

Then add realistic noise. Change the last digit of the points by ±0.001, roughly the accuracy the paper quotes (we used 2.3665, 2.3500, 2.3437, 2.3387, 2.3306, 2.3259, 2.3172, 2.3074, 2.2992). The 2-term fit still looks fine inside the data, but the extrapolated index at 18 µm moves to **2.1377**, an error of 0.006. The standard error on the infrared term's C grows larger than C itself, which is the tool warning you that the far-infrared resonance is poorly pinned down. That is the paper's central point in miniature: to know the index at 18 µm, measure at 18 µm. Use the [[uncertainty-calculator]] to carry an index error through to a quantity you care about.

## The fine print

- **One crystal type, one setup.** The authors argue that growth differences do not change the optics much, but they did not test several crystals.
- **Indirect measurement.** The indices come from fitting interference patterns with known crystal angles and a model of the crystal's optics, so errors in that model feed into the result.
- **A gap in the data.** The region around 14 to 16 µm was left out of the fit.
- **Hard limit at 21 µm.** Strong absorption beyond that stops the method.
- Our data are invented for practice, and our tool uses a different equation form from the paper's. For the measured values and coefficients, read the paper itself.
