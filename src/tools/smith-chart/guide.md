---
name: Smith chart
num: 633
shelf: science
section: rf-and-communications
title: "Smith chart calculator: reflection coefficient, VSWR, return loss, L-network and stub matching"
summary: "Plot a load impedance on an interactive Smith chart and get the reflection coefficient, VSWR, return loss and mismatch loss, the impedance after any length of line, both L-network matching solutions with part values, and single open or shorted stub matching."
status: live
ads: true
order: 633
icon: target
works: offline
updated: 2026-11-09
related: [antenna-calculator, link-budget-calculator]
sources:
  - "Reflection coefficient, standing-wave ratio, lossless transmission line, L-network and single-stub matching: standard formulas, as in Pozar, Microwave Engineering, chapters 2 and 5; Smith (1939), Transmission line calculator, Electronics 12."
  - "Checked against numpy complex arithmetic, Pozar's example 5.1, and by confirming that every matching solution turns the load into exactly Z0."
  - "The example values are made up by fibub."
flow:
  - { icon: pencil, label: "Load" }
  - { icon: target, label: "Chart" }
  - { icon: sliders, label: "Match" }
---

## What it does

The Smith chart is the map radio and microwave engineers use to see how a load (an antenna, an amplifier input, a cable end) matches a transmission line. Every impedance is a point inside a circle: the centre is a perfect match, the edge is total reflection. This tool plots your load on an interactive chart and works out:

- the **reflection coefficient** Γ (size and angle), **VSWR**, **return loss**, the share of **power reflected** and the **mismatch loss**;
- the impedance seen through any length of **lossless line** (the point turns clockwise round a circle of constant VSWR);
- **L-network matching** with two parts (an inductor and a capacitor), every solution with part values at your frequency;
- **single-stub matching** with an open or shorted stub: where to put it and how long to make it.

Everything is calculated in your browser.

## How to use it

1. Type the **line impedance** Z0 (50 Ω for most RF coax and boards, 75 Ω for TV cable) and the load's **resistance** and **reactance**. Positive reactance is inductive, negative capacitive.
2. Type the **frequency** (for part values and physical lengths), the **line length** in wavelengths and the line's **velocity factor** (0.66 for solid polyethylene coax, about 0.8 for foam, 1 for air).
3. Choose the **matching** method. Tick **Show admittance circles** to add the admittance grid (useful for following shunt parts and stubs).
4. Read the chart: L is the load, the dashed circle is its VSWR circle, the blue arc is the line, and numbered or d1/d2 points show where the matching parts take you.

## Worked example

The page opens with a 60 − j80 Ω load on a 50 Ω line at 2 GHz. Normalised, z = 1.2 − j1.6. Γ = 0.593 at −46.85°, so the **VSWR is 3.911**, the return loss 4.543 dB and 35.1 % of the power is reflected (mismatch loss 1.88 dB). After 0.1 λ of line (0.9893 cm of coax with velocity factor 0.66), the input impedance is 16.86 − j26.99 Ω; |Γ| stays the same and its angle turns to −118.8°.

Two L-networks match it: 0.09272 pF across the load then 6.078 nH in series, or 4.636 nH across the load then 1.042 pF in series. Both give exactly 50 Ω at 2 GHz.

## The formulas

- Γ = (Z − Z0)/(Z + Z0); VSWR = (1 + |Γ|)/(1 − |Γ|); return loss = −20 log₁₀|Γ|; mismatch loss = −10 log₁₀(1 − |Γ|²).
- Lossless line of length ℓ: Zin = Z0 (ZL + jZ0 tan βℓ)/(Z0 + jZL tan βℓ), with β = 2π/λ; equivalently Γ(ℓ) = ΓL e^(−j2βℓ).
- L-network and single-stub formulas as in Pozar, Microwave Engineering, section 5.1 and 5.2.

## FAQ

**Why are there sometimes two and sometimes four L-network solutions?** A load with R > Z0 can only use the "shunt first" layout; a load with R < Z0 can use "series first", and also "shunt first" if its conductance is not above 1/Z0. Each layout has two solutions (one inductor-first, one capacitor-first). Pick the one with practical values, or the one that also blocks DC or passes it, as your circuit needs.

**How long can the stub be?** Adding half a wavelength to the distance or the stub length gives the same match at this frequency, but a narrower bandwidth. The shortest lengths are shown.

**Does it include cable loss?** No, the line is lossless. Loss would spiral the point inwards towards the centre, which makes a long lossy cable look better matched than the load really is.

**How was it checked?** Γ, VSWR, return loss and the line formula were compared with numpy's complex arithmetic. Every matching solution is fed back through the network to confirm it gives exactly Z0, and Pozar's example 5.1 (200 − j100 Ω to 100 Ω at 500 MHz) is reproduced.
