---
title: "Tungsten oxide interlayer doubles cycle life of core–shell NMC cathodes"
summary: "A 2026 study put a thin tungsten oxide layer between a nickel-rich core and its shell, and the cathode kept 80 % of its capacity for about twice as many cycles. Here is how to check such cycling data."
tools: [battery-cycling-analyser, impedance-fitter, cyclic-voltammetry]
updated: 2026-11-10
sources:
  - "Tasdemir B et al. (2026), Batteries 12(3): 82, CC BY, the paper described here."
  - "Coulombic efficiency = discharge capacity / charge capacity; retention = capacity on cycle n / capacity on the reference cycle: standard definitions."
paper:
  title: "Improvement of Cycling Stability of Core–Shell Structured Ni-Rich NMC Cathodes by Using a Tungsten Oxide Stabilization Interlayer"
  authors: "Tasdemir B, Krüger S, Sohagiya P, Ray A, Saruhan B"
  journal: "Batteries"
  year: 2026
  doi: "10.3390/batteries12030082"
  url: "https://www.mdpi.com/2313-0105/12/3/82"
  licence: "CC BY"
  reviewed: true
---

Cathodes rich in nickel store a lot of charge, which is why they power many electric cars, but they wear out quickly because their surface reacts with the electrolyte. One fix is a core–shell particle: a nickel-rich core for capacity, wrapped in a shell with less nickel for stability. A team at the German Aerospace Center (DLR) went one step further and put a thin tungsten oxide layer between core and shell. Their paper, in the journal Batteries (2026, CC BY), reports that the extra layer about doubled the cell's useful life in their tests. This page explains it in our own words, and shows how the [[battery-cycling-analyser]] reads the same kind of cycle table. For the resistance side of the story, the [[impedance-fitter|impedance fitter]] and [[cyclic-voltammetry]] pages help.

## What they found

The core was LiNi₀.₉Mn₀.₀₅Co₀.₀₅O₂ (NMC90, 90 % nickel among the metals) and the shell LiNi₀.₆Mn₀.₂Co₀.₂O₂ (NMC622). On their own, the two materials gave about 82 and 119 mAh/g. Built as core and shell, the particle gave about 138 mAh/g, and with the tungsten interlayer about 137 mAh/g, so the layer cost almost no capacity.

The gain came in lifetime. Cycled slowly, the plain core–shell cell fell to 80 % of its starting capacity (a common end-of-life mark, called 80 % state of health) by about cycle 20. The cell with the interlayer held on until about cycle 44. After 50 cycles its impedance was also much lower than that of the plain core–shell cell.

## Why it matters

Nickel-rich cathodes are where much of the push for cheaper, longer-range batteries is heading, since nickel replaces costly cobalt. Anything that slows their decay without losing capacity is worth testing at larger scale. A very thin tungsten layer, made by a simple wet coating and a bake, is the kind of step a factory could add.

## How they did it

1. They made the metal oxalate precursors by co-precipitation with oxalic acid from acetate salts, mixed in lithium acetate, and baked the core at 850 °C for 8 hours.
2. For the interlayer they used ammonium tungstate (1 % by weight) in isopropanol and baked the coated material at 650 °C for 4 hours.
3. They checked structure and surface with X-ray diffraction, electron microscopy and two surface methods, XPS and ion scattering.
4. They built coin cells against lithium metal with a standard carbonate electrolyte and cycled them at C/10 (a full charge in about 10 hours) between 2.7 and 4.2 V at room temperature.
5. They measured impedance, including after 50 cycles.

## Check it yourself with fibub

Cycle counts like "80 % at cycle 44" depend on choices that papers do not always spell out, so it is worth redoing the sums. Here is a worked example with **our own invented numbers**, not the paper's data: two cathode cells read every 5 cycles, capacities in mAh/g.

| Cycle | 1 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cell B charge | 158.0 | 135.1 | 130.6 | 126.6 | 123.1 | 119.6 | 116.6 | 113.6 | 111.6 | 109.2 | 106.6 |
| Cell B discharge | 137.0 | 134.5 | 130.0 | 126.0 | 122.5 | 119.0 | 116.0 | 113.0 | 111.0 | 108.6 | 106.0 |

Steps:

1. Paste three columns, cycle number, charge and discharge, into the first card (or open your cycler's CSV).
2. Set the unit to mAh/g. For a cathode, keep coulombic efficiency as discharge ÷ charge.
3. Leave the reference cycle at 1 and end-of-life retention at 80 %.

For cell B the tool reports a first-cycle efficiency of **86.7 %** (21 mAh/g lost, mostly to surface films), an average coulombic efficiency of **99.49 %** after cycle 1, retention of **77.4 %** at cycle 50, a fade of about 0.45 % per cycle, and **80 % reached at cycle 43**.

Now make a faster-fading cell A from our own numbers too: discharge 138, 131, 124, 117.5, 110, 104, 98, 93, 88, 84 and 80 mAh/g, with the first charge at 160 and later charges 1 mAh/g above discharge. It reaches 80 % at **cycle 20** and keeps only 58.0 % at cycle 50. That is the same "about twice the life" pattern the paper describes.

Next, change the reference cycle to 5, as many papers do after the first few formation cycles. Cell B now reaches 80 % at cycle 47 and cell A at cycle 24. The ratio barely moves, but the headline numbers shift by several cycles, so always say which cycle you counted from.

If you also have one charge curve from early and late in the test, paste each into the dQ/dV card. Peaks that shrink or slide to higher voltage show which part of the cathode is wearing out, a check the paper does not include.

## The fine print

- Only 50 cycles were run, at one slow rate, in coin cells against lithium metal. Full cells with graphite and faster charging can age differently.
- Capacities are well below what nickel-rich materials usually reach; the authors blame lithium carbonate left on the surface.
- No tungsten phase showed up in diffraction, and surface tests suggest a patchy, very thin layer, so how it works is still a hypothesis.
- First-cycle efficiencies are given in a table we do not reproduce here. Read the full paper for the exact values.
