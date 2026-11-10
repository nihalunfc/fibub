---
title: "Terfenadine–PVP amorphous solid dispersions: Gordon–Taylor Tg and stability"
summary: "A 2025 Polymers study milled a poorly soluble drug with PVP and found one Tg by DSC but two amorphous phases by dielectric spectroscopy. Here is how to fit Gordon–Taylor yourself."
tools: [glass-transition-calculator, dsc-tga-analyser]
updated: 2026-11-10
sources:
  - "Dudognon E, Bama J-A, Affouard F (2025), Polymers 17(9): 1210, CC BY, the paper described here."
  - "Gordon–Taylor equation, Tg = (w1·Tg1 + k·w2·Tg2)/(w1 + k·w2), and the Couchman–Karasz estimate k = ΔCp2/ΔCp1: standard polymer physics."
paper:
  title: "Exploring the Relationship Between Stability and Dynamics in Polymer-Based Amorphous Solid Dispersions for Pharmaceutical Applications"
  authors: "Dudognon E, Bama J-A, Affouard F"
  journal: "Polymers"
  year: 2025
  doi: "10.3390/polym17091210"
  url: "https://www.mdpi.com/2073-4360/17/9/1210"
  licence: "CC BY"
  reviewed: true
---

Many new medicines dissolve so poorly in water that the body absorbs too little of them. One common fix is to freeze the drug in a disordered, glassy state inside a polymer, an amorphous solid dispersion. The glass dissolves faster than crystals, but it may slowly crystallise again on the shelf. A 2025 paper in Polymers (CC BY) studied a model drug, terfenadine, milled with the polymer PVP. It found that a mixture showing one glass transition can still hide two amorphous phases. Below we explain the work in our own words and show how the [[glass-transition-calculator]] fits and uses the Gordon–Taylor equation. The glass transitions themselves come from heating scans, which the [[dsc-tga-analyser]] reads.

## What they found

Terfenadine and PVP K12 were milled together at five drug loadings from 10 to 90 % by weight. Every mixture came out fully amorphous and showed a single glass transition (Tg), the temperature where a glass softens. Tg rose as more polymer was added, between the drug's value of about 60 °C and the polymer's value close to 100 °C.

The authors fitted the Gordon–Taylor equation to Tg against composition and report a constant of about 0.76. A second estimate from the heat capacity steps, the Couchman–Karasz method, gave about 0.61. The small gap hints at weak attraction between drug and polymer.

The surprise came from dielectric spectroscopy, which follows how fast molecules reorient. At 70 and 90 % drug the main relaxation split in two. The authors read this as two amorphous phases with different drug contents, even though calorimetry saw one Tg. All the mixtures held more drug than PVP can dissolve at room temperature. Only the 90 % mixture crystallised on heating.

## Why it matters

Formulators often take a single Tg as proof that drug and polymer are mixed evenly. This study suggests that is not always enough at high drug loading. A Gordon–Taylor curve is still the standard first check: points well off the curve point to strong interactions or to a mixture that is not homogeneous.

## How they did it

1. Crystalline drug and polymer were co-milled for 10 hours at room temperature. X-ray powder diffraction confirmed they had become amorphous.
2. Modulated DSC at 5 °C/min under nitrogen measured Tg and the heat capacity step on a second heating, after quenching.
3. Dielectric relaxation spectroscopy from 0.1 Hz to 1 MHz, at 80 to 170 °C, followed molecular motion.
4. Annealing at set temperatures, then re-measuring Tg, gave the solubility limit of the drug in the polymer, which was fitted with Flory–Huggins theory.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's. Say a polymer has Tg = 110 °C and an amorphous drug has Tg = 50 °C. A 50:50 mixture measured by DSC gives Tg = 76 °C.

**Step 1: fit k from one measured mixture.** Rearranged, Gordon–Taylor gives k = w1(Tg1 − Tg) / [w2(Tg − Tg2)], in kelvin. With w1 = w2 = 0.5: k = (383.15 − 349.15) / (349.15 − 323.15) = 34 / 26 ≈ **1.31**. With several mixtures, check that each gives about the same k.

**Step 2: the curve.** In the Gordon–Taylor card choose "Your own" for both components. Set component 1 to the polymer (110 °C) and component 2 to the drug (50 °C). Choose "Type a measured k" and enter 1.31. At 50 % drug the tool gives Tg ≈ **76.0 °C**. The Fox estimate, shown for comparison, is 77.5 °C. At 30 % and 70 % drug the curve gives about 88.4 and 64.8 °C.

**Step 3: a storage target.** A common rule of thumb keeps Tg about 50 °C above the storage temperature, so 75 °C for a room at 25 °C. Type 75 as the target. The tool says about **51.7 % drug** is the most that stays above it.

**Step 4: compare estimates.** Suppose your DSC heat capacity steps were 0.30 J/(g·K) for the polymer and 0.45 J/(g·K) for the drug. The Couchman–Karasz k is 0.45 ÷ 0.30 = 1.5. Typing 1.5 gives 63.3 °C at 70 % drug, against 64.8 °C with the fitted k. With densities typed (say 1.20 and 1.25 g/cm³) the Simha–Boyer line shows k ≈ 1.14 for comparison. When the three disagree a lot, suspect interactions or more than one phase.

Use the DSC analyser on each scan to get the midpoint Tg and ΔCp the same way every time. Its Peak window also measures any recrystallisation exotherm on heating.

## The fine print

- One drug and one PVP grade were studied, made by milling only.
- Two phases are an interpretation of dielectric data. Their compositions are estimates and their proportions could not be measured.
- Powder samples and conductivity complicate dielectric spectra.
- The solubility curve rests on few points, and the authors call the Flory–Huggins fit tentative. Read the paper for the exact Tg at each loading.
- This is materials research, not advice about any medicine.
