---
title: "From flash to crater: the 2013 lunar impact flash crater measured with LRO"
summary: "A 2025 MNRAS paper finds the 35 m crater left by the brightest lunar impact flash ever filmed and tests crater scaling laws on it. Try the same sums in your browser."
tools: [impact-crater-calculator, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Rizos, J. L., Lara, L. M., Ortiz, J. L. and Madiedo, J. M. (2026), From flash to crater: morphological and spectral analysis of the brightest lunar impact on 2013 September 11 using LRO data, Monthly Notices of the Royal Astronomical Society 545(2), staf2068, published online 21 November 2025. Open access under Creative Commons Attribution, checked on the publisher's page, 2026-11-10."
  - "Crater scaling in the fibub calculator: Collins, Melosh and Marcus (2005). 1 tonne of TNT = 4.184 × 10⁹ J."
paper:
  title: "From flash to crater: morphological and spectral analysis of the brightest lunar impact on 2013 September 11 using LRO data"
  authors: "Rizos JL, Lara LM, Ortiz JL, Madiedo JM"
  journal: "Monthly Notices of the Royal Astronomical Society"
  year: 2026
  doi: "10.1093/mnras/staf2068"
  url: "https://doi.org/10.1093/mnras/staf2068"
  licence: "CC BY 4.0"
  reviewed: true
---

On 11 September 2013, telescopes in Spain filmed a flash on the dark part of the Moon that was briefly as bright as a fairly bright star. It was the brightest lunar impact flash ever recorded. A paper published in *Monthly Notices of the Royal Astronomical Society* in November 2025 finds the crater it left in images from NASA's Lunar Reconnaissance Orbiter (LRO) and measures it in detail. Jose Luis Rizos and colleagues then compare its size with what several crater scaling laws predict. The [[impact-crater-calculator]] lets you run one such law yourself, and the [[uncertainty-calculator]] shows how errors in the impactor's mass and speed carry into its energy. The paper is open access under a Creative Commons Attribution licence.

## What they found

The fresh crater is about 35 metres across from rim to rim and about 4.9 metres deep. Bright, freshly dug material around it spreads over more than 2 kilometres. The authors estimate that this ejecta blanket is only about 2 millimetres thick on average, if spread evenly. In colour images, the slope of the ejecta's spectrum between 321 and 643 nm rose by about 16 % on average in the central part.

They tested three ways of predicting crater size from the impactor, named after Öpik, Gault, and Schmidt and Housen. Gault's version came closest to the crater they actually measured. They also put an upper limit on the **luminous efficiency**, the share of the impact's energy that came out as visible light: below 0.002. And they judge it more than 96 % likely that the impactor was a random (sporadic) meteoroid rather than part of a meteor shower.

## Why it matters

The Moon has no air to burn up small rocks, so every one hits the ground. Watching flashes from Earth is a cheap way to count those impacts, but a flash only tells you how much light came out. Turning light into mass and size relies on the luminous efficiency, and turning size into a crater relies on scaling laws. Both are uncertain. A case where the flash, the impactor estimate and the crater are all measured ties the chain together. That helps predict the hazard to future lunar bases and equipment.

## How they did it

The flash had been filmed and analysed earlier, which gave an impact time, place and estimated mass. The team searched LRO's narrow-angle camera images of that place, taken before and after the date, and found the new crater. They measured its diameter and depth from those images, and studied the ejecta's colour with LRO's wide-angle camera, which takes pictures in several bands from the ultraviolet to the red. For the scaling tests they used the earlier mass estimate of about 450 ± 75 kg and an impact speed of about 17 km/s.

## Check it yourself with fibub

First, a made-up impact of our own. Picture a stony meteoroid 0.40 m across (dense rock, 3000 kg/m³, so about 100 kg) striking the Moon at 20 km/s and 45°.

1. Open the [[impact-crater-calculator]], keep **Crater from impactor**, and choose the **Moon**.
2. Ground: **Sedimentary rock**. Impactor: **Dense rock**. Diameter **0.4** m, speed **20** km/s, angle **45**°.
3. Read the results. The energy is **4.81 tonnes of TNT** (2.01 × 10¹⁰ J). The transient crater is 37.8 m wide and 13.3 m deep, and the final crater is a simple bowl **47.2 m** across.
4. Change the angle to 30° and the crater shrinks to 42.1 m; straight down (90°) gives 53.0 m.

**Now the paper's impactor.** A 450 kg rock at 3000 kg/m³ is about 0.66 m across. Typed in at 17 km/s and 45°, the calculator gives about 15.5 tonnes of TNT and a crater of about **65 m**. The real crater is 35 m, so this rock-target law overshoots by almost a factor of two. Switch to **Impactor from crater**, type a 0.035 km crater at 17 km/s, and it suggests a body only about 0.30 m across, about 42 kg. This is the paper's point in miniature. Loose lunar soil is not solid rock, and the choice of scaling law changes the answer a great deal. The calculator states its own accuracy as about a factor of 1.5 for rocky ground, and has no regolith setting.

**How sure is the energy?** In the [[uncertainty-calculator]], type the formula `E = 0.5 m v^2`. Give m = 100 ± 20 kg and v = 20000 ± 2000 m/s (both made up, as standard uncertainties), with 68 % coverage. The result is 2.0 × 10¹⁰ ± 0.57 × 10¹⁰ J, a 28 % uncertainty. Each input supplies half of it: a 20 % mass error counts once, and a 10 % speed error counts twice because speed is squared.

## The fine print

- **One crater.** A single event cannot fix a scaling law. It is one well-measured point that future flashes can add to.
- **The mass comes from the flash.** The 450 kg estimate depends on an assumed luminous efficiency, so the impactor's mass carries its own uncertainty into every comparison.
- **The thickness is an average.** The 2 mm ejecta figure assumes the material is spread evenly, which real ejecta never is.
- **Angle unknown.** The impact angle was not measured, and as step 4 shows, it changes the crater size noticeably.
- **Our sums, not theirs.** The crater calculator uses one published law (Collins and colleagues, 2005) for solid rock, not the laws the paper compares. The made-up example and the uncertainty example are our own numbers; read the paper for its measurements and error bars.
