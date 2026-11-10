---
title: "Red supergiant DFK 52: ALMA finds a huge nebula from past mass loss"
summary: "A 2025 open-access ALMA study of the red supergiant DFK 52 found a lopsided cloud of gas and dust up to 50,000 au across. Check its numbers with fibub tools."
tools: [blackbody-calculator, redshift-calculator, radio-telescope-calculator]
updated: 2026-11-10
sources:
  - "Siebert, M. A., De Beck, E., Quintana-Lacaci, G. and Vlemmings, W. H. T. (2025), Stephenson 2 DFK 52: Discovery of an exotic red supergiant in the massive stellar cluster RSGC2, Astronomy & Astrophysics 700, L11, published online 6 August 2025. Open access under the Creative Commons Attribution License (CC BY 4.0), checked on the publisher's page, 2026-11-10."
  - "Rest frequency of the carbon monoxide J = 2–1 line, 230.538 GHz: standard laboratory value. Solar effective temperature 5772 K (IAU 2015)."
paper:
  title: "Stephenson 2 DFK 52: Discovery of an exotic red supergiant in the massive stellar cluster RSGC2"
  authors: "Siebert MA, De Beck E, Quintana-Lacaci G, Vlemmings WHT"
  journal: "Astronomy & Astrophysics"
  year: 2025
  doi: "10.1051/0004-6361/202555975"
  url: "https://www.aanda.org/articles/aa/full_html/2025/08/aa55975-25/aa55975-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Red supergiants are huge, cool stars near the end of their lives, and they lose mass before they explode. An August 2025 letter in *Astronomy & Astrophysics*, open access under CC BY 4.0, used the ALMA radio telescope array to look at one of them, DFK 52, in a cluster of red supergiants about 5.8 kiloparsecs (19,000 light years) away. They found a lopsided cloud of gas and dust up to about 50,000 astronomical units from the star, far bigger than around other well-studied red supergiants, even though DFK 52 itself is not especially bright. The [[blackbody-calculator]] shows how big a star of that brightness must be, and the [[redshift-calculator]] turns a radio line's shift into the speed of the gas.

## What they found

DFK 52 is a red supergiant of type M0, with a luminosity of about 20,000 times the Sun's. That is at the low end for this kind of star, roughly ten times fainter than the famous extreme red supergiants. Yet its surroundings are more dramatic. The ALMA maps show clumps of carbon monoxide (CO) gas reaching about 45,000 au and dust spread over several arcseconds.

The gas has two parts. A slow, roughly round outflow moves at about 10 km/s, which the team links to a present mass loss of about 3 millionths of a solar mass per year. A faster ring-like structure along the star's equator moves at about 27 km/s. The authors read this as a past episode, about 4,000 years ago, when the star shed mass at more than a ten-thousandth of a solar mass per year, at least 30 times faster than now.

## Why it matters

How much mass a red supergiant loses, and when, decides what kind of supernova it becomes. Strong bursts of mass loss shortly before the explosion leave a dense cloud that the blast later runs into. DFK 52 lets astronomers see such a cloud before the explosion. The authors suggest two possible causes for the burst, a short "superwind" or an interaction with a companion star, but cannot yet tell which.

## How they did it

ALMA is an array of dishes in Chile that works at millimetre wavelengths. The team observed with both the main array of 12-metre dishes and the smaller compact array, to catch fine detail and large faint structures at once. They mapped three spectral lines: two forms of CO and silicon monoxide (SiO), along with the dust glow at 1.3 mm.

Each line arrives at a slightly different frequency from its laboratory value because the gas is moving. The shifts across the map give the speed of each part of the cloud. From the SiO line they found the star's own velocity, about 109 km/s away from us. They then built computer models of the outflow to estimate its mass.

## Check it yourself with fibub

**Step 1: how big is the star?** Open the [[blackbody-calculator]] and type a temperature of 3,800 K, a **made-up but typical** value for an M0 supergiant (the paper does not give one). Under **For a star**, try radii until the luminosity reaches about 20,000 Suns. At 325 solar radii the page gives about 19,800 Suns, and at 330 about 20,500. So a star this bright and cool must be roughly 325 times the Sun's radius. The same answer comes from the Stefan-Boltzmann law in solar units: R = √L × (5772/T)²: about 326. Its light peaks at about 763 nm, just past red.

**Step 2: how bright should it look?** Add a distance of 5,800 parsecs. The page gives V of about 9.3 for a dust-free view. The real star is far fainter in visible light, because the dust between us and the cluster blocks most of it.

**Step 3: how fast is the gas?** In the [[redshift-calculator]], choose **Where a line is seen (frequency)**, set the unit to GHz, pick **Another line** and type the CO rest value, 230.538 GHz. Now type a **made-up** observed frequency of 230.454 GHz. With **Velocity convention** set to Radio (the usual choice for radio lines), the page gives a velocity of about **109 km/s**, the same size as the star's own motion in the paper. A gas clump moving 27 km/s faster away from us would show up about 0.021 GHz lower still.

**Step 4: how big does the cloud look?** For small angles, the size in arcseconds is the size in au divided by the distance in parsecs. So 50,000 au at 5,800 pc is about **8.6 arcseconds**: small on the sky, but easily mapped.

**Step 5: can ALMA see the dust?** The paper reports 17.2 mJy of dust glow at 1.3 mm. In the [[radio-telescope-calculator]], type our own rounded settings: 230,000 MHz, 12 m dishes, efficiency 0.7, system temperature 100 K, 12 dishes, two polarisations, 7,500 MHz of bandwidth and 10 minutes. The noise comes out near 0.1 mJy, so the total glow is easy to detect. The faint, spread-out structure is harder, hence the compact array.

## The fine print

- The **distance is the cluster's**, and DFK 52 is assumed to belong to it. A different distance would change the luminosity, the sizes and the masses.
- The **outflow model** reproduces only a small part of the observed CO signal, and misses one side of the ring, so the gas mass is rough.
- **Dust masses** depend on an assumed dust temperature and how dust grains emit.
- Gas in the Milky Way between us and the star **contaminates some CO channels**, which had to be left out.
- The authors say a full classification of the star and its history is not yet possible. Our worked numbers, including the temperature and the observed frequency, are made up or rounded; read the paper for the measured values.
