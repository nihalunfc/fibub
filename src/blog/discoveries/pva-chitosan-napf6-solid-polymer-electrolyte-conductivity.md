---
title: "PVA–chitosan solid polymer electrolyte with NaPF6: ionic conductivity by EIS"
summary: "A 2025 RSC Advances study raised the ionic conductivity of a PVA–chitosan film by about 4,800 times with sodium hexafluorophosphate. Here is how to get conductivity from an impedance arc yourself."
tools: [impedance-fitter, cyclic-voltammetry]
updated: 2026-11-10
sources:
  - "Cyriac V, Ismayil et al. (2025), RSC Advances, CC BY 3.0, the paper described here."
  - "Ionic conductivity σ = t / (Rb · A) and the parallel-plate capacitance C = ε0 εr A / t: standard electrochemistry and electrostatics."
  - "Vacuum permittivity ε0 = 8.854 × 10⁻¹² F/m: CODATA (NIST)."
paper:
  title: "Sodium hexafluorophosphate mediated enhancement of electrical and electrochemical properties of poly(vinyl alcohol)–chitosan solid polymer electrolytes for EDLCs"
  authors: "Cyriac V, Ismayil, Mishra K, Rao A, Khellouf RA, Masti SP, Noor IM"
  journal: "RSC Advances"
  year: 2025
  doi: "10.1039/d5ra02897c"
  url: "https://pubs.rsc.org/en/content/articlehtml/2025/ra/d5ra02897c"
  licence: "CC BY 3.0"
  reviewed: true
---

A solid polymer electrolyte is a flexible plastic film that lets ions move through it, so it can replace the liquid in a battery or supercapacitor and cannot leak. A 2025 paper in RSC Advances (CC BY 3.0) made such films from two cheap, water-friendly polymers, poly(vinyl alcohol) and chitosan, and loaded them with a sodium salt. The best film conducted ions thousands of times better than the bare blend, and the team built a working supercapacitor with it. Below we explain the work in plain words and show how the [[impedance-fitter]] turns an impedance spectrum into the bulk resistance and conductivity that such papers report. For the same device's voltammograms, the [[cyclic-voltammetry]] tool is the next step.

## What they found

The films were a 60:40 blend of poly(vinyl alcohol) (PVA) and chitosan, with 5 to 40 % by weight of sodium hexafluorophosphate (NaPF6). As the salt went up, the bulk resistance fell from hundreds of kilohms to a few tens of ohms. The paper reports room-temperature conductivity rising from about 1.4 × 10⁻⁸ S/cm without salt to about 6.9 × 10⁻⁵ S/cm at 40 % salt, roughly a 4,800-fold gain. More salt made the films too weak to stand on their own.

Almost all the current was carried by ions rather than electrons (an ionic transference number above 0.98). The best film was stable up to about 3.25 V. A supercapacitor made with it and activated-carbon electrodes reached about 43 F/g and kept most of its capacitance over 4,000 cycles.

## Why it matters

Sodium is plentiful and cheap, and PVA and chitosan are made from widely available raw materials (chitosan comes from crab and shrimp shells). Electrolytes that are solid, flexible and made without harsh solvents could suit low-cost storage. Conductivity is the first number anyone screens, so knowing how it is measured, and how easily it can be misread, matters.

## How they did it

1. Each polymer was dissolved in dilute acetic acid, mixed with the salt and cast as a film, then dried for three days.
2. Infrared spectra and X-ray diffraction tracked how the salt interacted with the polymer chains and how crystalline the films were.
3. Impedance was measured from 50 Hz to 4.5 MHz with a 10 mV signal, between 25 and 100 °C.
4. Equivalent circuits with constant phase elements were fitted to get the bulk resistance, and conductivity followed from the film thickness and electrode area.
5. Transference numbers, a voltage sweep and supercapacitor tests (voltammetry, charge–discharge, cycling) followed.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's data. A film 150 µm thick (0.015 cm) sits between two steel discs of 2.01 cm². Its spectrum shows a squashed semicircle at high frequency and then a steep spike at low frequency, where ions pile up at the blocking steel. Keep only the arc:

| f (Hz) | Z′ (Ω) | Z″ (Ω) |
|---|---|---|
| 4000000 | 195 | −746 |
| 2000000 | 378 | −1340 |
| 1000000 | 803 | −2400 |
| 500000 | 1810 | −4110 |
| 200000 | 5260 | −7080 |
| 100000 | 9940 | −8280 |
| 50000 | 14700 | −7150 |
| 20000 | 18200 | −4200 |
| 10000 | 19300 | −2450 |
| 5000 | 19700 | −1380 |
| 2000 | 20000 | −630 |
| 1000 | 19900 | −343 |

1. Paste the three columns into the spectrum box. Leave the sign setting on Detect.
2. Choose the circuit R(RQ). The fit gives Rs ≈ 24.9 Ω, Rct ≈ 20.03 kΩ, Q ≈ 3.98 × 10⁻¹⁰ F·s^(α−1) and α ≈ 0.88, with an rms error of about 0.2 %. In a film between steel, "Rct" is really the bulk resistance of the polymer, and Rs is mostly the leads and contacts.
3. Look at the comparison table. The ideal R(RC) misses by about 8 %, the bigger circuits have values flagged as not pinned down, and the blocking RQ fails. R(RQ) is the simplest circuit that fits.
4. Type 2.01 in the area box. The effective capacitance of the arc is about 81 pF (40 pF/cm²), with the arc peaking near 98.5 kHz. Ignore the exchange current line: it is meant for an electrode reaction, not a bulk film.

Now the conductivity, by hand: σ = t / (Rb · A) = 0.015 cm ÷ (20,030 Ω × 2.01 cm²) ≈ **3.7 × 10⁻⁷ S/cm**. Using the arc's low-frequency end, Rs + Rct ≈ 20,060 Ω, changes this by less than 0.2 %.

The capacitance is a useful sanity check. For a parallel plate, εr = C·t / (ε0·A) = 81 × 10⁻¹² F × 1.5 × 10⁻⁴ m ÷ (8.854 × 10⁻¹² F/m × 2.01 × 10⁻⁴ m²) ≈ **6.8**, a sensible dielectric constant for a polar polymer. A value of thousands would mean the arc you fitted is not the bulk.

## The fine print

- The film thickness and electrode area are needed for every conductivity value but are not stated in the main text, so the numbers cannot be rebuilt from the paper alone.
- No activation energy was fitted to the temperature data.
- The proposed hydrogen bonding between the salt anion and the polymer is inferred from small infrared shifts.
- The supercapacitor was cycled only from 0 to 1 V, well inside the 3.25 V window, and a few units differ between sections. Read the full paper for exact values.
- One blend ratio and one salt were tested.
