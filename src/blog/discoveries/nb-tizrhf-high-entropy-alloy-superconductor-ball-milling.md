---
title: "Ball-milled Nb-Ti-Zr-Hf high-entropy alloy superconducts near 7 K"
summary: "A 2026 open-access study makes a niobium-rich high-entropy alloy by ball milling and finds superconductivity near 7 K with an upper critical field over 6 T. Here is how to check its numbers with free tools."
tools: [superconductor-calculator, heat-capacity-fitter, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Sobota P and Bartz W (2026), Microstructure and Superconductivity of Mechanically Alloyed Nb0.67(TiZrHf)0.33 High-Entropy Alloy, Materials 19(11), 2321. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Ginzburg-Landau relation B_c2 = Φ₀/(2πξ²), the BCS gap 1.764 k_BT_c and the Clogston-Chandrasekhar Pauli limit: standard results, for example Tinkham, Introduction to Superconductivity (1996)."
  - "Low-temperature heat capacity C/T = γ + βT² and θ_D = (12π⁴nR/5β)^(1/3): standard solid-state physics."
paper:
  title: "Microstructure and Superconductivity of Mechanically Alloyed Nb0.67(TiZrHf)0.33 High-Entropy Alloy"
  authors: "Sobota P, Bartz W"
  journal: "Materials"
  year: 2026
  doi: "10.3390/ma19112321"
  url: "https://www.mdpi.com/1996-1944/19/11/2321"
  licence: "CC BY"
  reviewed: true
---

High-entropy alloys mix four or more metals in nearly equal shares, and some of them superconduct. A 2026 open-access paper in *Materials* makes one, Nb₀.₆₇(TiZrHf)₀.₃₃, not by melting but by grinding the pure metal powders together in a ball mill. The powder becomes superconducting at roughly 7 K and stays superconducting in fields above 6 tesla. The [[superconductor-calculator]] turns numbers like these into a coherence length, a type and a set of critical fields in a few seconds, and the [[heat-capacity-fitter]] handles the specific heat side of the story.

## What they found

After milling, almost all of the powder (about 97 per cent) is a single body-centred cubic alloy, with a small amount of tungsten carbide worn off the milling vial and balls. The crystals are tiny, around 21 nm across, and heavily strained.

The authors report that superconductivity sets in between about 6 and 7.5 K. The transition is broad, so they did not quote a single midpoint. From how the onset shifts with magnetic field they estimate an upper critical field at zero temperature of about 6.4 T using the standard Werthamer-Helfand-Hohenberg (WHH) model, and about 7.6 T from a simpler Ginzburg-Landau fit. Both sit well below the Pauli limit of about 12.9 T, the field at which the electrons' spins alone would tear the pairs apart.

Heat capacity gives a Sommerfeld coefficient γ (the electrons' share) of about 4.7 mJ/(mol·K²) and a Debye temperature of roughly 255 to 304 K, depending on how it is fitted. The authors estimate an electron-phonon coupling of about 0.75, which puts the alloy in the moderate-coupling range.

## Why it matters

Niobium-titanium wire is the workhorse of MRI magnets, and high-entropy alloys built around niobium are being studied as tougher, more radiation-tolerant relatives. Most are made by arc melting, which needs high temperatures and careful handling of reactive metals like zirconium and hafnium. Ball milling works at room temperature and could, in principle, be scaled up to make powders for sintered parts or coatings. Showing that a milled powder superconducts at all, and with a sizeable critical field, is a first step.

## How they did it

The team milled niobium, titanium, zirconium and hafnium powders under argon in a planetary mill for 20 hours of active grinding, broken into short bursts with rests so the powder did not overheat. They checked the structure with X-ray diffraction and Rietveld refinement, looked at the grains with an electron microscope, and measured the composition with energy-dispersive X-rays. AC and DC magnetisation from 1.8 to 8 K in fields up to 7 T located the transition, and a heat capacity run down to 1.8 K gave the thermal numbers.

## Check it yourself with fibub

The paper's headline numbers are enough to work out what kind of superconductor this is. Everything below uses **our own rounded inputs**, not the paper's data files.

1. Open the [[superconductor-calculator]]. Set T_c to **7 K** and leave the gap ratio at the weak-coupling value, **3.528**.
2. Choose "I know λ and ξ". To get ξ, invert the Ginzburg-Landau formula B_c2 = Φ₀/(2πξ²). For a round **6.5 T**, ξ = √(Φ₀/(2π × 6.5 T)) ≈ **7.1 nm**. Type that in.
3. The paper does not report a penetration depth. Disordered alloys like this one usually have λ of a few hundred nanometres, so try **250 nm** as a guess.

The calculator then gives:

- Energy gap Δ₀ ≈ **1.06 meV**, and a gap frequency of about **515 GHz**.
- κ = λ/ξ ≈ **35**, far above 0.707, so the alloy is strongly **type II**.
- B_c2(0) ≈ **6.53 T** (it comes back to our input, as it should) and, with the (1 − t²) law, about **4.2 T at 4.2 K**.
- B_c1(0) ≈ **9.4 mT**: vortices start to enter at very low fields.
- Pauli limit ≈ **13.0 T**, close to the paper's 12.9 T, since both are about 1.85 T per kelvin of T_c.
- Depairing current density ≈ **2.3 × 10⁷ A/cm²**.

That last figure is a useful sanity check. The paper reports a critical current density of about 800 kA/cm² (8 × 10⁵ A/cm²) at 1.8 K. Real materials always carry far less than the depairing limit, and here the measured value is about thirty times lower, which fits a granular powder with weak links between grains.

Try changing λ between 150 and 500 nm. B_c2 does not move, because it depends only on ξ, but κ and B_c1 do. That shows which conclusions rest on the paper's data and which rest on our guess.

For the heat capacity, paste C against T in the [[heat-capacity-fitter]] and read the low-temperature line C/T = γ + βT². With **β = 0.12 mJ/(mol·K⁴)** and one atom per formula unit, θ_D = (12π⁴R/5β)^(1/3) ≈ **253 K**, in line with the paper's figure from β. Run the γ and β errors through the [[uncertainty-calculator]] to see how far θ_D can move.

## The fine print

The transition is broad and the anomaly in the heat capacity is smeared, which the authors read as several superconducting fractions with slightly different T_c. Only about 40 per cent of the ideal magnetic shielding appears at 1.8 K, so a good part of the powder may not superconduct, or may be shielded only weakly. Tungsten carbide and surface oxide add to the uncertainty. The critical fields come from susceptibility onsets, and the authors note the Ginzburg-Landau value probably overestimates the field at low temperature. The milling yield was also low, around 40 per cent.
