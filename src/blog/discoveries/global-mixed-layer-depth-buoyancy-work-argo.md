---
title: "Global ocean mixed layer depth from buoyancy work: a new Argo climatology"
summary: "A 2025 Ocean Science study defines the mixed layer by the energy needed to move water, not a fixed threshold. See how threshold choices change the answer on your own CTD cast."
tools: [ctd-cast-viewer, plot-maker]
updated: 2026-11-10
sources:
  - "Moreles E, Romero E, Ramos-Musalem K, Tenorio-Fernandez L (2025), Ocean Science 21: 2019-2039, CC BY 4.0, the paper described here."
  - "Threshold criteria of 0.2 °C and 0.03 kg/m³ from a 10 m reference: de Boyer Montégut et al. (2004), J. Geophys. Res. 109: C12003."
  - "The cast in the worked example is made up by fibub; it is not Argo data."
paper:
  title: "The global ocean mixed layer depth derived from an energy approach based on buoyancy work"
  authors: "Moreles E, Romero E, Ramos-Musalem K, Tenorio-Fernandez L"
  journal: "Ocean Science"
  year: 2025
  doi: "10.5194/os-21-2019-2025"
  url: "https://os.copernicus.org/articles/21/2019/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

The top of the ocean is stirred by wind, waves and cooling into a layer where temperature and salt barely change with depth. How thick that mixed layer is controls how much heat the sea takes from the air, how deep plankton get mixed away from the light, and how carbon reaches deeper water. Most studies find its base with a fixed rule, such as "where the water is 0.2 °C colder than at 10 m". A group of oceanographers has proposed a different rule based on energy, applied it to about two million Argo float profiles, and published a global map in Ocean Science in September 2025. This page explains their idea, and shows with the [[ctd-cast-viewer]] how much the usual thresholds can move the answer on a single cast. You can then plot several casts side by side in the [[plot-maker]].

## What they found

Half of the world ocean has a mixed layer no deeper than about 44 m, while 1 % of it is deeper than 269 m. The deepest value, 1,074 m, sits in the Greenland, Iceland and Norwegian seas, where winter cooling makes surface water heavy enough to sink. The layer is shallow in summer and deep in winter almost everywhere. Across most of the ocean the energy threshold their method settles on is small: below 9.5 J/m³ over three quarters of it, and below 20.8 J/m³ over 95 %. A quality index showed the layer was close to uniform in this energy sense across nearly 97 % of the ocean.

## Why it matters

A fixed temperature step works well in some seas and badly in others. In places where salt, not heat, sets the density, a temperature rule can put the base of the layer far too deep. A density rule copes better, but the right step size still differs from place to place. Climate models are judged partly on how well they reproduce the mixed layer, so a method that behaves the same way everywhere makes those comparisons fairer.

## How they did it

The team used delayed-mode Argo profiles from 2005 to 2023 that passed quality checks, and computed seawater properties with TEOS-10, the international equation of state. Their key quantity is **buoyancy work**: the energy per cubic metre needed to move a parcel of water from a given depth up to the 10 m reference level against the density differences in between. Inside a well-mixed layer that work is almost zero. The base of the layer is where it starts to grow. Rather than fixing one energy value, they linked it to two small density differences (0.015 and 0.0625 kg/m³ of "inhomogeneity"), so the energy threshold itself changes from place to place and month to month. They compared the results with two classic threshold rules and two shape-based methods.

## Check it yourself with fibub

fibub does not compute buoyancy work. The CTD cast viewer uses the threshold rules the paper compares against, and lets you change the steps, which is the quickest way to see the problem the new method tries to solve. The cast below is **made up**: depth in metres, temperature in °C and salinity, for an imaginary autumn station.

```
depth,temperature,salinity
0,14.20,35.10
5,14.20,35.10
10,14.19,35.10
15,14.18,35.11
20,14.16,35.12
25,14.12,35.14
30,14.05,35.16
35,13.90,35.18
40,13.60,35.20
45,13.10,35.22
50,12.50,35.24
60,11.70,35.27
70,11.20,35.29
80,10.90,35.30
100,10.50,35.31
```

1. Paste the table into **Cast data**. The header tells the page the first column is depth.
2. In **Settings**, set **Bin size** to 5 m and **Gradients over** to 5 m, to match the 5 m spacing. Keep the reference depth at 10 m and the linear equation of state at its starting values.
3. Read the facts. With the classic steps (0.2 °C and 0.03 kg/m³) the page gives a mixed layer of **32.0 m by temperature** but **21.5 m by density**. Salinity creeps up from 15 m down, so density starts to rise before temperature falls much.
4. Try the larger density step the paper also uses, 0.125 kg/m³: the density mixed layer moves to **35.0 m**. With a temperature step of 0.5 °C the temperature answer is **38.5 m**.
5. Try smaller steps, 0.1 °C and 0.015 kg/m³: now **27.1 m** and **16.9 m**.
6. Look at the thermocline and N². Both sit at 47.5 m, with temperature falling 0.12 °C per metre and N² of about 2.67 × 10⁻⁴ s⁻², roughly 9.4 cycles per hour.

On this one cast, reasonable rules give a mixed layer anywhere from 17 to 39 m. Smooth profiles like this, with no sharp step at the base, are exactly where fixed thresholds disagree most, and where an energy-based rule tries to give a more consistent answer. To compare stations, export each binned profile as CSV and overlay them in the plot maker.

The viewer's density comes from a simple straight-line equation of state, not TEOS-10, so use it to compare rules and casts rather than for exact densities.

## The fine print

- Coastal zones are not mapped, and Argo coverage is sparse south of 60° S and north of 60° N, so those parts of the map are less certain.
- In high-latitude winters, where profiles are very smooth, the quality index is ambiguous and the mixed layer and threshold are less certain.
- The study does not test how buoyancy work relates to the turbulence that actually mixes the water, or to how long mixing has been active.
- It does not compare against the potential energy anomaly method, a related energy-based measure.
- The layer is defined on seasonal timescales, so it does not resolve daily cycles or storms; it is a reference for averages, not a forecast for a given day.
