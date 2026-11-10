---
title: "JADES-GS-z14-1: a compact, faint galaxy at redshift 14 seen by JWST"
summary: "A 2025 Astrophysical Journal paper confirms JADES-GS-z14-1 at redshift 13.86, a tiny galaxy seen 300 million years after the Big Bang. Work out its age, size and brightness yourself."
tools: [cosmology-calculator, redshift-calculator, magnitude-flux-converter]
updated: 2026-11-10
sources:
  - "Wu, Z. et al. (2025), JADES-GS-z14-1: A Compact, Faint Galaxy at z ≈ 14 with Weak Metal Lines from Extremely Deep JWST MIRI, NIRCam, and NIRSpec Observations, The Astrophysical Journal 992(2), 212, published 17 October 2025. CC BY 4.0, checked on the University of Hertfordshire research record, 2026-11-10."
  - "Planck 2018 cosmology (H0 = 67.66 km/s/Mpc, Ωm = 0.3111), as used by the fibub calculator. Lyman alpha rest wavelength 121.567 nm."
paper:
  title: "JADES-GS-z14-1: A Compact, Faint Galaxy at z ≈ 14 with Weak Metal Lines from Extremely Deep JWST MIRI, NIRCam, and NIRSpec Observations"
  authors: "Wu Z, Eisenstein DJ, Johnson BD, Jakobsen P, Alberts S et al."
  journal: "The Astrophysical Journal"
  year: 2025
  doi: "10.3847/1538-4357/ae01a1"
  url: "https://doi.org/10.3847/1538-4357/ae01a1"
  licence: "CC BY"
  reviewed: true
---

The James Webb Space Telescope keeps pushing the edge of the observable past. In an October 2025 paper in *The Astrophysical Journal*, Zihao Wu and colleagues in the JADES survey team confirm a galaxy called JADES-GS-z14-1 at a redshift of 13.86. They describe it as the faintest galaxy with a measured spectrum at a redshift near 14. It is also very small and nearly free of heavy elements. With the [[cosmology-calculator]] you can turn that one redshift into an age, a distance and a size on the sky, and the [[redshift-calculator]] shows where its light was stretched to. The paper is open access under a CC BY licence.

## What they found

A redshift of 13.86 means the light has been stretched almost 15 times in wavelength on its way to us. The galaxy did not show up as anything bigger than a point in any of 16 NIRCam filters, so the team sets an upper limit of roughly 50 parsecs on its radius. That is tiny: the Milky Way's disc is hundreds of times wider. Fitting models of starlight to its colours gives about 40 million solar masses of stars, forming at around two solar masses a year.

It also lacks strong emission lines from oxygen and carbon. That suggests gas with less than a tenth of the Sun's share of heavy elements. It may also mean that much of its ionising light escapes into space.

## Why it matters

Bright galaxies at redshift 14 were already known, and they surprised many people by being so bright so early. Faint ones are harder to find but tell us what typical galaxies looked like. A small, nearly pristine galaxy is closer to the building blocks that models of the first galaxies predict. How common such galaxies are, and how much ionising light they leak, feeds directly into the question of how the early universe was reionised, when the fog of neutral hydrogen gas between galaxies was cleared.

## How they did it

The observations are among the deepest JWST has made. There were about 56 hours of NIRSpec prism spectroscopy and 70.7 hours of imaging at 7.7 micrometres with the MIRI camera. At this redshift the key feature is the **Lyman break**. Neutral hydrogen soaks up light bluer than the Lyman alpha line, at a rest wavelength of 121.567 nm. So the spectrum drops to nothing below a sharp edge, and where that edge lands gives the redshift. The MIRI image looks at visible light from the galaxy, stretched into the mid-infrared. It found only a tentative glow of about 8 nanojanskys, which limits how strong its oxygen lines can be.

## Check it yourself with fibub

All the numbers below are our own made-up example, a galaxy like this one but invented, apart from step 3, which uses the paper's redshift.

1. **From the break to a redshift.** Open the [[redshift-calculator]], choose **Where a line is seen (wavelength)**, pick Lyman α and type an observed wavelength of **1.70 µm**. Redshift is observed over rest wavelength minus one: 1700 ÷ 121.567 − 1 = **12.98**.
2. **From redshift to time and size.** Type **12.98** in the [[cosmology-calculator]] with Planck 2018 and radiation included. The universe was **0.3285 Gyr** old (about 329 million years). The light has travelled for 13.457 billion years, and one arcsecond spans **3.529 kpc**. A made-up galaxy 80 parsecs in radius would therefore look 0.08 ÷ 3.529 = **0.023 arcseconds** in radius, smaller than one NIRCam pixel (0.031 arcseconds in the short-wavelength channel).
3. **Try the paper's redshift.** Type **13.86** and the calculator gives an age of 0.2997 Gyr, about 300 million years after the Big Bang, with 3.361 kpc per arcsecond. The paper's 50 parsec limit is then about 0.015 arcseconds, which shows why the galaxy looks like a point.
4. **From flux to magnitude.** In the [[magnitude-flux-converter]], type **0.01** µJy (10 nanojanskys, a made-up flux) and read the AB magnitude: **28.90**. Compared with the faintest stars you can see without a telescope, around magnitude 6, that is more than a billion times fainter.
5. **How bright is it really?** The calculator's distance modulus at z = 12.98 is **50.765** mag. For a source with flat brightness per unit frequency, the absolute magnitude is m − DM + 2.5 log₁₀(1 + z) = 28.90 − 50.765 + 2.864 = **−19.0**, a modest galaxy by today's standards.

Change the cosmology to WMAP 9-year and the age at z = 12.98 becomes 0.3341 Gyr. Swapping models moves it by only about 6 million years, small next to the 329 million years themselves.

## The fine print

- **One galaxy.** A single object cannot tell us how common faint, compact galaxies were; the authors present it as one well-studied case.
- **The size is a limit.** The galaxy is unresolved, so "about 50 parsecs" is a ceiling, not a measured size.
- **Weak evidence for metals.** The MIRI signal is only a 2.8-sigma detection, and the emission line strength carries a wide uncertainty, so the low-metal picture is suggestive, not settled.
- **Model-based masses.** Stellar mass and star formation rate come from fitting models to a few colours, and change with the assumptions inside those models.
- **Our numbers are ours.** Apart from the redshift in step 3, the worked example uses made-up values. For the measured fluxes and error bars, read the paper.
