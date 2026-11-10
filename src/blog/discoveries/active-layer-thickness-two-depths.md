---
title: "Active-layer thickness from ground temperatures at two depths"
summary: "A 2026 study in The Cryosphere estimates permafrost thaw depth from just two shallow temperature sensors, with no soil lab work. Here is how it works and how to try it."
tools: [permafrost-active-layer, heat-conduction, trend-analyser]
updated: 2026-11-10
sources:
  - "Uxa T, Hrbáček F, Knažková M (2026), The Cryosphere 20: 97-112, CC BY 4.0, the paper described here."
  - "Stefan equation for a thaw front, Z = √(2 k I / L), and latent heat of fusion of water, 334 kJ/kg: standard frozen-ground physics."
  - "All temperatures, depths and soil values in the worked example are made up by fibub."
paper:
  title: "Simple analytical–statistical models (ASMs) for mean annual permafrost table temperature and active-layer thickness estimates"
  authors: "Uxa T, Hrbáček F, Knažková M"
  journal: "The Cryosphere"
  year: 2026
  doi: "10.5194/tc-20-97-2026"
  url: "https://tc.copernicus.org/articles/20/97/2026/"
  licence: "CC BY 4.0"
  reviewed: true
---

Where the ground is frozen all year, only a top slice thaws each summer. That slice is the active layer, and its thickness is one of the main things permafrost scientists track as the Arctic and high mountains warm. Measuring it usually takes a steel probe or a long string of buried sensors. In January 2026 three permafrost researchers showed in The Cryosphere that two shallow sensors are often enough. This page explains the idea and shows how to repeat it with the [[permafrost-active-layer|active layer tool]], then follow a thaw record over the years with the [[trend-analyser]].

## What they found

The authors built two short formulas: one for the active-layer thickness (ALT), one for the mean yearly temperature at the permafrost table, the top of the frozen ground. Both need only the temperatures logged at two depths inside the active layer, for example a shallow sensor and one deeper down.

They tested the models on ground-temperature records from many permafrost sites. The abstract reports that the thaw depth came out with a mean error of about 9 %, and the permafrost table temperature with a mean error below 0.05 °C. Read the paper for how the sites were chosen, which depth pairs worked best and where the method did worse.

## Why it matters

Many old and remote stations have a sensor or two near the surface but no deep string and no lab tests of the soil. A method that needs no thermal conductivity, no water content and no density can turn those records into thaw depths. That means more points on the map and a cheap check on climate models.

## How they did it

The starting point is the Stefan equation, which says the thaw front moves down in proportion to the square root of the heat it has received. That heat is measured as a **thawing index**: the sum, over the summer, of every daily mean temperature above 0 °C, in °C·days.

The thawing index is large near the surface and gets smaller with depth. The team noticed that if you plot each sensor's depth against the square root of its thawing index, the points fall on a straight line. Extend that line to where the index is zero, and you have reached the bottom of the thaw:

ALT = (z₂ √I₁ − z₁ √I₂) ÷ (√I₁ − √I₂)

Here z₁ and z₂ are the sensor depths (m) and I₁ and I₂ their thawing indices (°C·days). The slope of the line stands for the soil: how well it carries heat against how much ice it holds. The authors call it an edaphic (soil) term.

## Check it yourself with fibub

All numbers below are made up.

**Step 1: the two-sensor estimate.** Say a logger at 5 cm gives a summer thawing index of 700 °C·days, and one at 50 cm gives 250 °C·days. The square roots are 26.46 and 15.81. Then

ALT = (0.50 × 26.46 − 0.05 × 15.81) ÷ (26.46 − 15.81) ≈ **1.17 m**.

The slope is (0.50 − 0.05) ÷ (26.46 − 15.81) ≈ 0.042 m per √(°C·day).

**Step 2: turn the slope into a soil.** In the Stefan equation the slope equals √(2 k × 86 400 ÷ L), where k is the thermal conductivity of the thawed soil (W/m/K) and L the heat needed to melt the ice in one cubic metre (J/m³). Pick a made-up silt with 40 % water by dry mass and a dry density of 1200 kg/m³, so L = 1200 × 0.40 × 334 000 ≈ 160 MJ/m³. The slope then asks for k ≈ 1.66 W/m/K.

**Step 3: run the tool.** Keep **Thaw depth (active layer)**. Under **Temperatures**, choose **The degree-days already**, set the n-factor to 1 (we are treating the index as already at the ground surface), and type a thawing index of 764 °C·days, which is what this soil needs to thaw 1.17 m. Under **Soil**, keep one layer with k thawed 1.66, water content 40 and dry density 1200. The tool reports about **1.17 m**, matching step 1.

**Step 4: ask "what if".** The sensitivity table shows what a warmer summer does. Raise the index by 20 % to about 917 °C·days and the depth becomes about **1.28 m**, not 1.40 m, because depth grows with the square root of the index. With a year of daily temperatures pasted instead, the tool draws the thaw curve day by day.

**Step 5: years of records.** Repeat step 1 each summer and paste the depths into the trend analyser for Sen's slope per decade.

The slab-over-time problem in the [[heat-conduction]] tool shows how warmth creeps into a layer.

## The fine print

- The formulas treat the active layer as one even soil. A peat cap over mineral soil, or ice-rich ground near the frozen base, can bias the answer.
- Errors grow where the active layer is thick, where permafrost is close to 0 °C, and where the deeper sensor is far above the frozen ground, because the line has to be extended further.
- A very shallow sensor under moss or an organic layer can mislead, because it can sit in a different soil from the rest of the layer.
- Sideways flow of water and heat in cracked bedrock breaks the one-dimensional picture.
- The "true" depths used to judge the method were themselves estimates from measured records, so the quoted errors include that uncertainty.
