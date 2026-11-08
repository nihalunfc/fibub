---
name: Glass transition (Tg) calculator
num: 102
shelf: science
section: polymer-chemistry
title: "Glass transition calculator: Fox equation for copolymers, Gordon–Taylor for plasticisers, Flory–Fox for molar mass"
summary: "Estimate the Tg of a random copolymer or miscible blend by the Fox equation and find the monomer ratio for a target Tg. Gordon–Taylor (with Simha–Boyer or your own k, and Kwei q) for a polymer with water or a plasticiser, and Flory–Fox for short chains."
status: live
ads: true
order: 3
icon: curve
works: offline
updated: 2026-11-08
related: [copolymer-composition, polymer-molar-mass, colligative-properties, plot-maker]
sources:
  - "Homopolymer glass transition temperatures: typical literature values, rounded, which you can type over."
flow:
  - { icon: flask, label: "Monomers" }
  - { icon: sliders, label: "Weights" }
  - { icon: sigma, label: "Fox Tg" }
  - { icon: chart, label: "Target" }
---

## What it does

The glass transition temperature, Tg, is where an amorphous polymer changes from hard and glassy to soft and rubbery. For a random copolymer or a blend of polymers that mix completely, Tg sits between the values of the pure components, and simple rules predict where. This page has three cards.

**Copolymer or blend (Fox equation).** Pick up to four monomers or polymers and the weight of each. The Fox equation, 1/Tg = Σ wᵢ/Tgᵢ with temperatures in kelvin, gives the Tg. The table shows each component's weight and mole share (from the repeat unit molar mass), and the plain weight average for comparison. Type a **target Tg** and choose two components to trade: the tool finds the split that hits the target while the others keep their share, and draws Tg against that split. Press "Use this composition" to load it.

**Polymer with a plasticiser or second polymer (Gordon–Taylor).** For two components, Tg = (w₁Tg₁ + k·w₂Tg₂)/(w₁ + k·w₂). The constant k can be estimated from the densities by the Simha–Boyer rule, k = ρ₁Tg₁/(ρ₂Tg₂), or typed from a fit to measured data, which is better. The optional Kwei term q·w₁w₂ describes blends whose components hydrogen-bond to each other. The card gives the Tg, the Fox value for comparison, the water or plasticiser content that brings Tg down to a chosen temperature, and the full curve.

**Molar mass effect (Flory–Fox).** Chain ends bring extra free volume, so short chains have a lower Tg: Tg = Tg∞ − K/Mn. The card shows how far below Tg∞ your sample is and above which molar mass the effect becomes small.

## How to use it

1. Choose a monomer from the list; its homopolymer Tg and repeat unit mass fill in. Type over them if your source gives other values, or choose "Your own".
2. Type the weight parts (they need not add up to 100).
3. For a target, type the Tg you want and the two components to adjust.

## Worked example: an acrylic latex

Methyl methacrylate (Tg 105 °C) with butyl acrylate (−54 °C), 50:50 by weight, gives **Tg ≈ 4.3 °C** by Fox, while the weight average would say 25.5 °C. For a film with a Tg of 20 °C, the tool asks for **60.0 % MMA and 40.0 % BA**. Adding 2 % acrylic acid and keeping it fixed changes that to 58.0 % MMA and 40.0 % BA.

For amorphous sugar (Tg 62 °C) with 5 % water and the published k of 4.7, Gordon–Taylor gives **22.5 °C**: a trace of moisture brings the glass close to room temperature, which is why boiled sweets turn sticky in humid air. About 8.8 % water brings Tg to 0 °C.

For polystyrene with Tg∞ = 100 °C and K = 1 × 10⁵ K·g/mol, chains of Mn 10,000 give 90.0 °C.

## Questions

**How accurate are these?** Usually within 5 to 10 °C for random copolymers. Homopolymer Tg values themselves vary with tacticity, molar mass, moisture and the DSC method, so the listed ones are starting points.

**Why do I see two Tgs on my DSC?** Then the blend has not mixed (two phases), and each phase keeps roughly its own Tg. These equations apply only to a single, mixed phase.

**Does sequence matter?** Yes, for copolymers with a strong alternating tendency, which can deviate from Fox. Block copolymers usually show two Tgs.

**Is anything sent anywhere?** No. Everything is calculated in your browser, and the page works offline once loaded.
