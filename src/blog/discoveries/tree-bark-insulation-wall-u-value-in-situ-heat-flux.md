---
title: "Tree bark wall insulation: in situ U-value vs calculated, heat flux method"
summary: "A 2025 study built a test bungalow with oak bark and mineral wool walls and measured their U-values in winter. Here is how to work out a layered wall's U-value yourself."
tools: [heat-conduction, uncertainty-calculator, psychrometric-calculator]
updated: 2026-11-10
sources:
  - "Živković, V., Novosel, A. and Krstić, H. (2025), Innovative Solutions: Comparative Study of Laboratory and In Situ Measurements of Thermal Properties of Bark Insulated Exterior Walls, Buildings 15(5), 810, published 3 March 2025. Open access (CC BY). Details checked on the publisher's page, 2026-11-10."
  - "U = 1 / (Rsi + Σ d/λ + Rse), with Rsi = 0.13 and Rse = 0.04 m²·K/W for walls: the series-resistance method of ISO 6946. Layer conductivities in the example are rounded general values chosen by us."
paper:
  title: "Innovative Solutions: Comparative Study of Laboratory and In Situ Measurements of Thermal Properties of Bark Insulated Exterior Walls"
  authors: "Živković V, Novosel A, Krstić H"
  journal: "Buildings"
  year: 2025
  doi: "10.3390/buildings15050810"
  url: "https://www.mdpi.com/2075-5309/15/5/810"
  licence: "CC BY"
  reviewed: true
---

Bark is a waste product of every sawmill and parquet factory, and it is full of trapped air. A 2025 open-access study in *Buildings* packed 20 cm of shredded oak bark into the walls of a small test bungalow in Zagreb, Croatia, put mineral wool in the other walls, and measured how much heat each wall let through over a week of winter. The bark wall came in at about 0.29 W/m²·K, just under Croatia's limit of 0.30 for outside walls. The same series-resistance sum the authors used to predict the U-value is in the wall mode of the [[heat-conduction]] solver, so you can test bark, wool or any other layer in a minute.

## What they found

The heat flow method, the standard way to measure a wall in place, gave a U-value of about 0.22 W/m²·K for the mineral wool wall and 0.29 W/m²·K for the bark wall. A simpler temperature-based method agreed with it.

The comparison with the design calculation went two different ways. For the bark wall the measured value was within 10 % of the calculated one, a little lower. For the mineral wool wall the measured U-value was about 26 % higher than calculated: the wall lost more heat than the paper sums promised. Gaps between batts, joints, framing or damp can all do that in a real wall, and the authors cite other work showing laboratory and real conductivities can differ by 5 to 50 %.

## Why it matters

The U-value is the heat that flows through one square metre of wall for each degree of difference between inside and outside air. Lower is better. Building codes set a maximum, and designers prove they meet it with a calculation. A study that measures real walls shows how far to trust that calculation. It also tests whether a cheap, local, renewable filler like bark can do the job of a factory-made product. Here it did, though it needs a thicker or denser wall for the same result, since bark conducts heat nearly twice as well as mineral wool.

## How they did it

In the laboratory, three pressed bark boards (25 × 25 × 5 cm, bound with a water-based glue) went into a heat flow meter following ISO 8301. The calculated U-values used ISO 6946: add up the thermal resistance of each layer (thickness divided by conductivity) and of the air films on each face, then take one over the total. On site, sensors on the north-facing walls logged heat flux and temperatures every 10 minutes from 1 to 8 December 2023, following ISO 9869-1, with the inside heated to about 25 °C and the outside averaging about 2 °C.

## Check it yourself with fibub

Open the [[heat-conduction]] solver and stay on **Wall**. The wall below is **our own made-up build-up**, not the one in the paper, and the conductivities are round values we chose.

1. In the layers box, type one layer per line, inside to outside, as name, thickness in mm, conductivity in W/m·K:
   `Plasterboard, 12.5, 0.25`
   `OSB, 15, 0.13`
   `Bark, 200, 0.065`
   `Wood fibreboard, 60, 0.045`
2. Set the inside air to **25 °C** and the outside to **2 °C**. Keep the films at **7.7** and **25** W/m²·K, which are close to the 0.13 and 0.04 m²·K/W surface resistances used in ISO 6946.
3. Set the wall area to **10 m²**.
4. Read the headline: U is about **0.2107 W/m²·K**, a total resistance of about **4.746 m²·K/W** and a heat flux of about **4.85 W/m²**, roughly 1.16 kWh a day through the whole 10 m².
5. Look at the table: the bark carries about 65 % of the resistance, so about two thirds of the 23-degree drop happens across it.
6. Change the bark to **0.09** W/m·K, a deliberately worse value. U rises to about **0.257**. You would need a conductivity of about **0.12** before this wall broke the 0.30 limit.

Now try the gap that showed up for mineral wool. Put `Mineral wool, 200, 0.035` in place of the bark: U falls to about **0.135**. If the real wall lost 26 % more heat than that, the wool would be acting as if its conductivity were about **0.048**, not 0.035. That is how to turn a measured U-value back into an "effective" conductivity, and it shows how a modest installation flaw costs as much as a third of the insulation.

To see how sure a measured U can be, enter the heat flux and temperature errors into the [[uncertainty-calculator]]: U = q ÷ (Ti − To), so a 5 % flux error and a 0.5 K error on a 23 K difference add up to about 5.4 %. The bungalow's inside air was very humid (about 85 %), and the [[psychrometric-calculator]] shows its dew point, which matters for moisture inside walls.

## The fine print

- **One building, one wall of each kind, one week.** The authors call the results preliminary.
- **Different densities.** The lab boards were made at 250 kg/m³, the wall was packed at about 350 kg/m³, so the lab conductivity is not quite the wall's.
- **Wet inside air.** The room was far more humid than normal living conditions, and moisture raises conductivity.
- **Not a finished house.** Finishing layers were still to come, and ageing, weather and settling of loose bark were not studied.
- **Heat storage** was an aim of the work but was not measured directly.
- Our tool treats each layer as uniform and ignores studs and joints (thermal bridges), which a real calculation must add.
