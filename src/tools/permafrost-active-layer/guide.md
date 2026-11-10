---
name: Active layer
num: 209
shelf: science
code: T209
section: glaciology-and-cryosphere
title: "Active layer"
summary: "Estimate how deep the ground thaws above permafrost in summer (the active layer), or how deep it freezes in winter, with the Stefan equation: thawing or freezing index from daily air temperatures and an n-factor, one to three soil layers, the thaw curve through the season and a sensitivity table."
status: live
ads: true
order: 209
icon: mountain
works: offline
updated: 2026-11-09
related: [glacier-ice, heat-conduction, soil-classification, insect-degree-days, koppen-climate]
sources:
  - "Formula (written into code by fibub, no tables copied): Stefan's solution for a moving freezing or thawing front, Z = √(2 k I / L), as given in permafrost and frozen-ground textbooks, e.g. French, H. M., The Periglacial Environment, and Andersland, O. B. and Ladanyi, B., Frozen Ground Engineering. The layer-by-layer form treats the layers above the front as thermal resistances in series."
  - "Latent heat of fusion of water, 334 kJ/kg (a general physical constant)."
  - "Checked 2026-11-09 by hand and against NumPy: the index of the example year, and the layered depth by numerical integration of the front's energy balance on 200 random one-, two- and three-layer soils (agreement better than 1 part in 10¹¹)."
  - "The daily temperatures in the example are a made-up year, not a real station. The soil values and n-factors are rounded, made-up starting values, not taken from any table; replace them with your own."
flow:
  - { icon: calendar, label: "Daily temps" }
  - { icon: sliders, label: "Soil layers" }
  - { icon: ruler, label: "Thaw depth" }
  - { icon: table, label: "Sensitivity" }
---

## What it does

In permafrost country only the top of the ground thaws each summer. That thawed layer is the **active layer**, and how deep it goes decides where roots, water and buildings can sit. The **Stefan equation** is the classic first estimate of that depth:

Z = √(2 k Iₛ / L)

where **k** is the thermal conductivity of the thawed soil (W/m/K), **Iₛ** the thawing index at the ground surface (degree-days above 0 °C, turned into °C·seconds), and **L** the latent heat needed to melt the ice in a cubic metre of soil, L = ρd × w × 334 kJ/kg from the dry density ρd and the gravimetric water content w. The same equation, with the freezing index and the frozen soil's conductivity, gives the **frost depth** of a winter.

This page works out the index from your daily air temperatures (or takes it typed), applies an **n-factor** to get from air to ground surface, solves **one to three soil layers** one after another, draws the **thaw curve** through the season, and shows a **sensitivity table**. It is for study, not design. To see how heat spreads through a slab step by step, try [[heat-conduction]]; for glacier mass balance and ice flow, [[glacier-ice]]; and to name the soil itself, [[soil-classification]].

## How to use it

1. Pick **Thaw depth (active layer)** or **Frost depth**.
2. Under **Temperatures**, paste daily mean air temperatures in °C, one day per line. A date or day number before each value is fine, and a header line is skipped. For frost depth, paste one winter, from autumn to spring. If you already know the index, choose **The degree-days already** and type it.
3. Set the **n-factor**: the ratio of the surface index to the air index. Moss, plants or snow keep the ground cooler in summer and warmer in winter (n below 1); bare gravel is near 1. Use 1 if your index was measured at the ground surface.
4. Under **Soil**, choose 1, 2 or 3 layers and give each one's thickness, thermal conductivity (thawed and frozen), water content in per cent of dry mass, and dry density. The last layer carries on downwards.

## How the layers are solved

The front first crosses layer 1 just as in the one-soil equation. Once it is deeper, the heat has to pass through every layer above it, so their resistances (thickness ÷ conductivity) add up. Fully thawing layer i takes L h (R + h ÷ 2k) of index, where R is the resistance of the layers above, and the front part-way into a layer comes from the same balance solved as a quadratic. With a single layer this is exactly the plain Stefan equation. The layer table shows the surface index needed to thaw each layer and, for daily data, the day it happens.

## Worked example

The page opens with a made-up year of daily air temperatures and one silty soil: k thawed 1.2 W/m/K, water content 30 %, dry density 1400 kg/m³. The year has **136 days above 0 °C** and a thawing index of **888 °C·days**. With the n-factor of 0.8 the ground surface gets **710 °C·days**. The latent heat is 1400 × 0.30 × 334 000 = **140 MJ/m³** (42 % water by volume), so

Z = √(2 × 1.2 × 710.32 × 86 400 ÷ 140 280 000) = **1.02 m**.

The sensitivity table shows why the soil matters as much as the weather: 20 % more index (or a 20 % higher conductivity) gives 1.12 m, while 20 % more water gives 0.94 m.

Now choose **2** layers. The silt becomes a 0.5 m top layer over a gravelly sand (k 2 W/m/K, 12 % water, 1700 kg/m³). Thawing the silt takes 169 °C·days at the surface, which the example year reaches on **day 184**; the drier sand below thaws faster, and the front ends the summer at **1.52 m**.

Switch to **Frost depth**: the freezing index of the same year is 3440 °C·days, the freezing n-factor 0.6 (snow cover) leaves 2064 °C·days at the surface, and in one frozen silt (k 1.8 W/m/K) the frost goes **2.14 m** deep.

## Tips

- Water content counts twice as much as you might think: wet, peaty ground stays shallow because each cubic metre holds far more ice to melt.
- An organic top layer with a low conductivity insulates the ground below; try 2 layers to see it.
- Download the curve as CSV to compare with probe or thermistor readings through the season.

## FAQ

**Why is my measured active layer shallower?** The Stefan equation ignores the heat used to warm the soil up to 0 °C, so it usually overestimates a little. Fitting the n-factor to one year of measurements is a common way to calibrate it.

**Where do the soil numbers come from?** The starting values are rounded, made-up examples. Use lab or field values for your own soil.

**Is my data uploaded?** No. Everything runs in your browser and keeps working offline.
