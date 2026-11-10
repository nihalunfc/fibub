---
title: "Corn cob hard carbon by Joule heating for sodium-ion anodes: ICE and cycling"
summary: "A 2026 study flash-heated corn cob carbon for 40 s at 1300 to 1500 °C; the 1400 °C sample gave 263 mAh/g, 72 % first-cycle efficiency and 91 % retention after 300 cycles."
tools: [battery-cycling-analyser, cyclic-voltammetry]
updated: 2026-11-10
sources:
  - "Coulombic efficiency, capacity retention and the sodiation-first convention for anodes in half cells are standard battery testing practice."
  - "The cycling table in the worked example is made up by fibub; it is not data from the paper."
paper:
  title: "Biomass Corn Cob-Derived Hard Carbons via Joule Heating for Sodium-Ion Storage"
  authors: "Li H, Shi S, Xu B, Zhao X-S"
  journal: "Batteries"
  year: 2026
  doi: "10.3390/batteries12050169"
  url: "https://doi.org/10.3390/batteries12050169"
  licence: "CC BY"
  reviewed: true
---

Sodium-ion batteries need an anode that can hold sodium, and graphite, the usual lithium-ion anode, cannot. Hard carbon, a disordered carbon full of tiny closed pores, is the leading choice, but it is normally made by baking a precursor in a furnace for hours. A May 2026 paper in Batteries made it from corn cobs by Joule heating, passing a large current through the material so it reaches 1300 to 1500 °C in seconds, and reported capacity, first-cycle efficiency and retention over 300 cycles. The [[battery-cycling-analyser]] works out all three from a cycler's per-cycle export, so you can run the same numbers on your own cells and see how much they depend on how you count.

## What they found

The sample heated at 1400 °C did best: a reversible capacity of 263 mAh/g at 0.2 C (here 1 C means 250 mA/g), a first-cycle (initial) coulombic efficiency, or ICE, of 72 %, and 91 % of its capacity kept after 300 cycles at 0.2 C. The 1300 °C sample gave 172 mAh/g with 62 % ICE, and the 1500 °C sample 240 mAh/g with 71 %. In a rate test, the 1400 °C sample still gave about 50 mAh/g at 2 C and recovered to about 263 mAh/g when slowed back to 0.2 C.

The structure changed with temperature in step: the spacing between carbon layers shrank from about 0.40 to 0.37 nm, the surface area fell from about 30 to 21 m²/g, and the closed-pore volume grew. The authors credit the 1400 °C result to a balance of layer spacing and closed pores.

## Why it matters

Corn cobs are a cheap farm waste, and 40 seconds of heating uses far less time and energy than a furnace run. If flash heating can give hard carbon of useful quality, it could cut the cost of a material that sodium-ion batteries need in large amounts.

## How they did it

The cobs were pre-carbonised at 400 °C for 2 h under argon, ball-milled, washed in acid and dried, then Joule-heated for 40 s at 1300, 1400 or 1500 °C under argon. Electrodes of 80 % hard carbon, 10 % carbon black and 10 % binder on copper foil (about 2.3 mg/cm²) were built into coin cells against sodium metal, with 1 M NaClO₄ in carbonate solvents plus 2 % fluoroethylene carbonate.

## Check it yourself with fibub

In a half cell against sodium metal, the hard carbon is filled with sodium first, and the cycler calls that step discharge. The useful capacity is what comes back out on the next charge, so coulombic efficiency is charge ÷ discharge. The table below is **made up**, with capacities in mAh/g:

| Cycle | Charge | Discharge |
|---|---|---|
| 1 | 252 | 360 |
| 2 | 255 | 262 |
| 3 | 254 | 257 |
| 50 | 248 | 249.5 |
| 100 | 243 | 244.2 |
| 150 | 238 | 239.1 |
| 200 | 234 | 235.0 |
| 300 | 226 | 226.8 |

1. Paste the three columns and set *Capacity unit* to mAh/g.
2. Set *Coulombic efficiency is* to charge ÷ discharge. The label mentions lithium, but the same rule applies to sodium half cells.
3. Leave *Reference cycle for retention* at 1 and *End-of-life retention* at 80 %.

The page gives a **first-cycle efficiency of 70.0 %**: 108 mAh/g went into the first discharge and never came back, mostly used up building the solid electrolyte interphase (SEI), the thin film that forms on the carbon. **Retention after 300 cycles is 89.7 %**, the average coulombic efficiency after cycle 1 is **99.12 %**, and 80 % is projected at about cycle 573, marked as extrapolated.

Now change the reference cycle to 2. Retention drops to **88.6 %** and the projected end of life moves to about cycle 546. With cycle 3 as the reference it is **89.0 %**. A retention figure means little unless you know which cycle it is counted from.

There is a second trap in a table like this one. The average coulombic efficiency is taken over the rows you paste, so a table with gaps treats cycle 50 as one cycle among eight, even though it stands for 47. Paste every cycle from the cycler's export for an honest average. Even a small gap from 100 % matters: a full cell that kept 99.5 % on every cycle would have about 22 % of its charge left after 300 cycles (0.995³⁰⁰). A half cell hides this, because the sodium metal on the other side tops up whatever is lost.

The paper also reports b-values of about 0.63 to 0.64 from peak current against scan rate. The scan-rate study in the [[cyclic-voltammetry]] tool fits log peak current against log scan rate; a slope of 0.5 means diffusion-limited storage and 1 means surface-like storage, so values in between suggest a mix.

## The fine print

- All cells were half cells against excess sodium metal, which hides the sodium loss that would limit a full cell.
- First discharge and charge capacities are not listed separately, only the ICE, so the irreversible capacity has to be worked out from figures.
- The loading of about 2.3 mg/cm² is light compared with commercial electrodes; thicker electrodes usually perform worse at high rates.
- 300 cycles at 0.2 C is a short, slow test by industry standards.
- Retention values for the three samples (91 to 92 %) are close, so small differences between them may not be meaningful without repeat cells.
