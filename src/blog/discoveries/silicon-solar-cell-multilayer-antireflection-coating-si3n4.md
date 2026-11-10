---
title: "Si3N4 vs SiO2 antireflection coatings on silicon solar cells"
summary: "A 2025 open-access study measures single-layer SiO2 and Si3N4 antireflection coatings on silicon and simulates multilayer and patterned stacks. Here is how to check the thin-film part yourself."
tools: [thin-film-coating, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Khawaji IH, Sabeeh AH, Ismail T and Abu-Elmaaty BE (2025), Tuning Optical Performance of Silicon Solar Cells with Micro-Structured Multilayer Antireflection Coatings, Applied Sciences 15(6), 3053. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Quarter-wave antireflection condition n₁ = √(n₀nₛ) and normal-incidence reflectance ((n₀ − nₛ)/(n₀ + nₛ))²: standard thin-film optics, for example Macleod, Thin-Film Optical Filters."
  - "Silicon refractive index of about 3.9 near 600 nm: rounded from standard tables (Green and Keevers, 1995)."
paper:
  title: "Tuning Optical Performance of Silicon Solar Cells with Micro-Structured Multilayer Antireflection Coatings"
  authors: "Khawaji I H, Sabeeh A H, Ismail T, Abu-Elmaaty B E"
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app15063053"
  url: "https://www.mdpi.com/2076-3417/15/6/3053"
  licence: "CC BY"
  reviewed: true
---

Bare, polished silicon bounces back about a third of the sunlight that hits it, which is light a solar cell never gets to use. A thin transparent coating on top cuts that loss by making the light reflected from its two surfaces cancel out. A 2025 open-access paper in *Applied Sciences* compares single coatings of silicon dioxide (SiO₂) and silicon nitride (Si₃N₄) made in the lab, then simulates stacks of three layers, flat and patterned. The interference part of this is exactly what the [[thin-film-coating|thin-film coating simulator]] calculates, and the [[uncertainty-calculator]] helps you see how much a few nanometres of thickness error matter.

## What they found

On real silicon samples, a Si₃N₄ film about 90 nm thick brought the reflectance down to about 0.16 per cent at 750 nm, while a similar SiO₂ film only got down to about 9 per cent, at 650 nm. In their device simulations, the single-layer SiO₂ and Si₃N₄ coatings together lifted the short-circuit current from about 25 to 37 mA/cm² and the efficiency from about 12.3 to 18.5 per cent.

The authors then modelled three-layer stacks that add a film of CdSe/ZnS quantum dots and a layer of lithium fluoride (LiF), and versions of those stacks shaped into a grid of tiny cylinders 550 nm apart. In their simulations the patterned stack with Si₃N₄ gave the best result, with an efficiency of about 24.7 per cent.

## Why it matters

Every per cent of light reflected away is a per cent of current lost, so the coating is one of the cheapest places to gain efficiency. Silicon nitride is already the industry standard on most cells, partly because it also protects the silicon surface. The paper is a reminder of why: its refractive index, about 2.0, sits almost exactly where a single coating on silicon wants it. The multilayer and patterned designs aim to keep reflection low over a wider range of colours, not just at one wavelength.

## How they did it

The team grew SiO₂ by heating silicon in oxygen at 1100 °C and deposited Si₃N₄ by plasma-enhanced chemical vapour deposition. Quantum dots went on by mist deposition and LiF by thermal evaporation. They measured reflectance from 350 to 1000 nm with a spectrophotometer and the film indices with an ellipsometer. The multilayer and patterned stacks were studied with a full electromagnetic simulation (finite-difference time-domain, or FDTD) and a separate device simulator that turns absorbed light into current.

## Check it yourself with fibub

The thin-film simulator treats every layer as perfectly flat, so it can check the single coatings and flat stacks, though not the patterned grid. All numbers below are **our own rounded inputs**: silicon as a constant index of **3.9** with **k = 0.02**, a design wavelength of **600 nm**, and a spectrum from **400 to 1000 nm** at normal incidence.

1. Choose "My own layers". Leave the layers box empty to see bare silicon: about **35 per cent** reflected at every wavelength.
2. Type `1.46 QW` (an SiO₂-like quarter wave, which the tool makes **102.7 nm** thick). The lowest reflectance is about **8.6 per cent** at 600 nm, and the average over the range is about **13.7 per cent**. The index is simply too low for silicon.
3. Change it to `2.0 QW` (a nitride-like layer, **75 nm**). Now the reflectance at 600 nm drops to about **0.02 per cent**, because 2.0 is very close to the ideal √(1 × 3.9) ≈ 1.97. But it climbs to about **21 per cent at 400 nm** and **16 per cent at 1000 nm**, so the average is still about **7.2 per cent**.
4. Try two layers, light's side first: `1.4 QW` then `2.3 QW` (about **107 nm** and **65 nm**). The single deep dip becomes a broad, shallow valley, and the average falls to about **1.9 per cent**. This is the idea behind the paper's multilayer designs: trade a perfect zero at one colour for low reflection across many.
5. Set the angle to **60°** with the single 2.0 layer. At 600 nm the reflectance rises to about **7.6 per cent**, a reminder that a cell sees the sun at many angles through the day.

The two measured results in the paper behave just as steps 2 and 3 predict: SiO₂ cannot do better than several per cent on silicon, while Si₃N₄ can reach almost zero near its design wavelength. The exact wavelength of the dip moves with film thickness, which is why a 90 nm film has its minimum further into the red than our 75 nm layer.

## The fine print

Only the single-layer coatings were made and measured; the three-layer and patterned results come from simulation, with the quantum-dot and LiF optical constants taken from earlier studies. The patterned grid was modelled as a perfect, endless array. Some simulated current densities in the paper are high: the best value, about 48 mA/cm², is above the roughly 44 mA/cm² that sunlight can supply to a silicon cell even in theory, so treat the patterned-stack efficiencies as optimistic until someone builds one. Our own check also simplifies things: real silicon's index changes a lot between 400 and 1000 nm, and real cells use textured surfaces rather than flat polished ones.
