---
name: Darcy flow calculator
num: 128
shelf: science
code: T128
section: hydrogeology
title: "Darcy's law calculator: groundwater flow, seepage velocity, travel time, three-point gradient and Hazen K from grain size"
summary: "Groundwater flow from Darcy's law: flux, discharge, seepage velocity and travel time. Find the hydraulic gradient and flow direction from three or more wells, convert K to intrinsic permeability, and estimate K from a sieve curve (d10, Cu, Cc and Hazen)."
status: live
ads: true
order: 4
icon: compass
works: offline
updated: 2026-11-08
related: [pump-test-analyser, slug-test-analyser, piper-diagram, mixing-model-calculator]
sources:
  - "Darcy's law, seepage velocity, the three-point gradient problem and grain-size statistics (d10, Cu, Cc): standard hydrogeology and soil mechanics, written by fibub from the definitions."
  - "Hazen's rule K = C·d10² with C roughly 40 to 150 (cm/s, cm): general textbook usage; the tool labels it approximate and lets you set C."
  - "Water viscosity from the Vogel-type fit μ = 2.414 × 10⁻⁵ · 10^(247.8/(T − 140)) Pa·s and density from a common approximate formula: general engineering approximations."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: compass, label: "Gradient" }
  - { icon: ruler, label: "Grain size" }
  - { icon: calculator, label: "Darcy's law" }
  - { icon: clock, label: "Travel time" }
---

## What it does

Groundwater moves slowly through the pores of sand, gravel and rock. **Darcy's law** describes how fast: the flow is proportional to how permeable the ground is (the hydraulic conductivity **K**) and to how steeply the water table slopes (the hydraulic gradient **i**). This page puts the everyday groundwater sums in one place:

- **Darcy flow**: the flux q = K·i, the discharge through an area Q = K·i·A, the **seepage velocity** v = q ÷ ne at which the water really moves, and the **travel time** over a distance.
- **Three-point problem**: the gradient and the direction of flow from the water levels in three or more wells.
- **Grain size**: d10, d30 and d60 from a sieve curve, the uniformity and curvature coefficients, and a rough K from **Hazen's rule**.
- **Intrinsic permeability** k, which belongs to the rock alone, from K and the water temperature.

To measure K in the field rather than estimate it, use the [[pump-test-analyser]] or the [[slug-test-analyser]].

## How to use it

1. In the **Darcy flow** card, type K and choose its unit, or pick the Hazen estimate from the grain-size card.
2. Give the gradient as a head drop over a distance, or pick the result from the wells card.
3. Add the flow area (aquifer thickness × width), the effective porosity and a travel distance.
4. For the **three-point problem**, paste each well's name, x (east), y (north) and head in metres. With more than three wells the tool fits the best plane and reports how well it fits.
5. For **grain size**, paste or open sieve sizes in mm with the percent passing.

## Worked example

All numbers are made up. A sand aquifer has K = 10 m/day and the water table drops 0.5 m over 250 m, a gradient of 0.002. With an effective porosity of 0.25, the Darcy flux is 0.02 m/day and the **seepage velocity is 0.08 m/day**. Water takes **17.1 years** to travel 500 m. Through a 100 m² cross-section the discharge is 2 m³/day. At 10 °C that K means an intrinsic permeability of about 1.5 × 10⁻¹¹ m², or 15.5 darcy.

Three monitoring wells with heads of 25.40, 24.95 and 25.10 m give a gradient of **0.0015**, with water flowing towards **71°**, roughly east-north-east.

The example sieve curve gives d10 = 0.129 mm and Cu = 3.76. Hazen's rule with C = 100 then gives K ≈ 14 m/day.

## Good to know

- The seepage velocity is an average. Real water moves faster along the best paths, and dissolved substances can lag behind through sorption.
- Effective porosity is smaller than total porosity, especially in clay, where much of the water is held in place.
- Hazen's rule is a quick check for clean sand, not a substitute for a pumping or slug test.

## FAQ

**Why is the gradient direction given as a bearing?** It is the compass direction the water flows, measured clockwise from north, straight down the slope of the water table.

**Can I use feet?** Choose ft/day for K. Lengths on this page are in metres.
