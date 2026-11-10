---
title: "Surface brightness-colour relation for dwarf stars from ten detached eclipsing binaries"
summary: "A 2025 A&A paper measures masses to 0.3 % and radii to 1.4 % for ten nearby eclipsing binaries, to calibrate how star colour predicts angular size. Rework the masses with fibub."
tools: [radial-velocity-fitter, blackbody-calculator, magnitude-flux-converter]
updated: 2026-11-10
sources:
  - "Graczyk D, Pietrzyński G, Galan C, Miller N, Gieren W et al. (2025), Surface brightness-colour relations of dwarf stars from detached eclipsing binaries - II. Extension of the calibrating sample, Astronomy & Astrophysics 694, A65. Open access under CC BY 4.0, as shown on the publisher's page, checked 2026-11-10."
  - "Masses of a double-lined binary: M sin³ i = 1.0361 × 10⁻⁷ (1 − e²)^1.5 (K₁ + K₂)² K₂ P, with K in km/s, P in days and M in solar masses; a standard relation from Kepler's third law."
  - "Eclipsing binaries and surface brightness-colour relations as a distance method: Pietrzyński G et al. (2019), Nature 567, 200-203 (the distance to the Large Magellanic Cloud)."
paper:
  title: "Surface brightness-colour relations of dwarf stars from detached eclipsing binaries - II. Extension of the calibrating sample"
  authors: "Graczyk D, Pietrzyński G, Galan C, Miller N, Gieren W et al."
  journal: "Astronomy & Astrophysics"
  year: 2025
  doi: "10.1051/0004-6361/202452065"
  url: "https://www.aanda.org/10.1051/0004-6361/202452065"
  licence: "CC BY 4.0"
  reviewed: true
---

How big does a star look from Earth? For all but the nearest giants, the disc is far too small to see, yet astronomers can still predict its angular size from the star's colour and brightness. The rule that does this is called a surface brightness-colour relation, and it is only as good as the stars used to calibrate it. A February 2025 paper in *Astronomy & Astrophysics* adds ten nearby eclipsing binaries, pairs of stars that pass in front of each other, whose sizes and masses can be measured directly. You can rework the mass step with the [[radial-velocity-fitter]], then check each star's brightness and luminosity with the [[blackbody-calculator]] and the [[magnitude-flux-converter]].

## What they found

The ten systems lie within about 800 parsecs, and their stars range from spectral type B9 (hot and blue-white) to K3 (cool and orange). Many pairs are unequal, with the lighter star as little as half the mass of the heavier one, which is just what the calibration needed, since earlier samples leaned towards twin stars. The authors report an average precision of **0.3 %** in mass and **1.4 %** in radius.

They measured temperatures three ways: from the spectra, from fits to the stars' spectral energy distribution (brightness across many colours), and from colour-temperature calibrations. These usually agree within 100 K. In three systems, the orbit's long axis slowly turns, an effect called apsidal motion; for one, AW Columbae, a full turn takes about 16,000 years.

## Why it matters

Once you know a star's true radius and its angular size, its distance follows: distance equals twice the radius divided by the angular diameter. That is how eclipsing binaries in the Large Magellanic Cloud gave one of the best distances in astronomy, a rung on the ladder used to measure the expansion of the universe. The weakest link is the relation that turns colour into angular size, so every well-measured nearby binary tightens it. The same relations are used to size up stars that host planets, where the planet's radius scales with the star's.

## How they did it

Light curves came from the TESS satellite for almost every system and from the K2 mission for some. The team took 129 spectra with the HARPS spectrograph on the ESO 3.6 m telescope between 2017 and 2021. Software separated the two stars' blended spectra, and they fitted the light and velocity curves together with the Wilson-Devinney code, a long-standing model of eclipsing pairs. Reddening came from a three-dimensional dust map and from the strength of interstellar sodium lines, and distances from Gaia parallaxes.

## Check it yourself with fibub

All the numbers below are our own, invented for practice. They are not the paper's data.

**Step 1: the velocity curves.** Here are 14 made-up nights for a double-lined binary: time in days, then the velocity of star 1 and of star 2, in km/s.

```
0.31 63.5 -107.3
0.78 60.3 -101.5
1.42 -2.4 -24.9
2.05 -73.7 62.8
2.63 -89.6 85.1
3.18 -50.7 36.9
3.71 13.9 -44.1
5.12 32.9 -68
5.96 -65 54.1
6.44 -92.1 86.8
7.27 -40.8 22.8
8.83 57.9 -98
9.4 -0.2 -29.1
10.95 -73.1 63.1
```

The [[radial-velocity-fitter]] fits one star at a time, so paste the first two columns (time and star 1), keep the unit on **km/s (binary stars)** and tick **Circular orbit**, because short-period pairs are usually circular. It finds a period of about **4.001 days** and K₁ = **79.96 ± 0.21 km/s**, with a systemic velocity near −12.2 km/s. Now paste time and star 2 instead: P about **4.000 days**, K₂ = **99.23 ± 0.26 km/s**, and the same systemic velocity within errors, a good sign that both stars belong to one system.

**Step 2: the masses.** The mass ratio is K₁/K₂ = 0.806. With P = 4.000 days and e = 0, the relation in our sources gives M₁ sin³ i = 1.0361 × 10⁻⁷ × 179.19² × 99.23 × 4.000 ≈ **1.32 M☉** and M₂ sin³ i ≈ **1.06 M☉**. Eclipses mean the orbit is nearly edge-on; if the light curve says i = 88°, the masses barely change (1.323 and 1.066 M☉). The two stars are about 14.2 solar radii apart.

**Step 3: brightness and size.** Say the light curve also gave radii of 1.40 and 1.05 R☉, the spectra gave 6,500 K and 5,900 K, and Gaia puts the pair at 250 pc. In the [[blackbody-calculator]], type each temperature, radius and distance. Star 1 comes out at about **3.15 L☉**, absolute visual magnitude 3.49 and V = **10.48**; star 2 at about **1.20 L☉**, 4.60 and V = **11.59**. Add the fluxes (the [[magnitude-flux-converter]] helps) and the pair should shine at about V = **10.15**. If your measured magnitude is far off, suspect the reddening or the temperatures.

At 250 pc, star 1's disc spans only about **0.052 milliarcseconds**, and star 2's about 0.039. Turned around, a relation that predicts 0.052 mas for star 1 puts the pair at 2 × 1.40 R☉ ÷ 0.052 mas ≈ 250 pc.

## The fine print

- **Spotted and busy systems.** One pair, CG Sculptoris, has strong starspots that leave residuals in its light curve, and another is part of a wide triple.
- **Temperature scatter.** Methods mostly agree within 100 K, but one system differs by up to 400 K between them.
- **Reddening calibration.** The sodium-line relation the authors derived differs from earlier ones, and the reason is not settled.
- **Ten systems.** The new stars extend the calibrating sample; the relation itself depends on the full set.
- Our velocities, radii and temperatures are invented. For the measured values, read the paper.

## A tool we could build

A surface brightness-colour calculator: type a star's colour and magnitude, pick a published relation, and get its angular diameter, then add a radius to get the distance. It would pair with the radial velocity fitter for eclipsing binaries and with the transit fitter for planet hosts.
