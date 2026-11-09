---
name: Irrigation scheduler
num: 383
shelf: science
section: agronomy-and-soil-science
title: "Irrigation scheduler: when and how much to irrigate from daily ET0, rain and soil water (FAO-56 water balance)"
summary: "Paste or open daily reference evapotranspiration (ET0) and rain, describe the soil and crop, and follow the root-zone water balance day by day: when the crop reaches its readily available water, how much to put back, deep drainage after big rain, stress days, and the water to pump."
status: live
ads: true
order: 383
icon: calendar
works: offline
updated: 2026-11-09
related: [et0-calculator, soil-test-interpreter, fertiliser-blend-calculator, soil-texture-triangle, seeding-rate-calculator, rain-gauge-average, station-data-viewer]
sources:
  - "Daily root-zone water balance with a single crop coefficient: total and readily available water, the water stress coefficient Ks, deep percolation and the depletion-fraction adjustment p + 0.04 (5 − ETc): Allen, R. G., Pereira, L. S., Raes, D. and Smith, M. (1998), Crop evapotranspiration, FAO Irrigation and Drainage Paper 56, chapter 8 (equations only; none of its tables or example data are reproduced)."
  - "No soil, crop coefficient or depletion fraction tables are bundled: users type their own values."
  - "Checked against an independent Python implementation on 200 random seasons (with Kc and irrigation columns, adjusted p and both plans): 67,700 daily values agree to 2 × 10⁻¹⁴ mm. The example season, soil and crop are made up, the weather drawn at random by fibub."
flow:
  - { icon: mountain, label: "Soil" }
  - { icon: table, label: "ET0 + rain" }
  - { icon: chart, label: "Balance" }
  - { icon: calendar, label: "Irrigate" }
---

## What it does

Think of the root zone as a tank. It is full at **field capacity** and empty, for the plant, at the **wilting point**. Each day the crop draws water out (its evapotranspiration), and rain and irrigation put water back. This page keeps that account day by day, the "checkbook" method of FAO-56, and tells you when the crop has used the water it can take easily and how much to put back.

- **Total available water**: TAW = 1000 × (field capacity − wilting point) × root depth, in mm.
- **Readily available water**: RAW = p × TAW. While the depletion stays below RAW the crop is not stressed.
- **Crop water use**: ETc = Kc × ET0. Once depletion passes RAW, use falls by the stress factor Ks = (TAW − depletion) ÷ ((1 − p) × TAW).
- Rain or irrigation that would fill the tank above field capacity **drains below the roots** (deep percolation).

Work out the ET0 for each day with the [[et0-calculator|evapotranspiration calculator]], and the soil's needs with the [[soil-test-interpreter]].

## How to use it

1. Type the soil's **field capacity** and **wilting point** (% water by volume), the **root depth**, the crop's **p** and **Kc**, and how dry the soil is on the first day (0 mm = at field capacity).
2. Say how much rain counts, the **trigger** (100 % of RAW irrigates as soon as RAW is used up), any room to leave for rain, and your system's **application efficiency**.
3. Paste or open the daily table: date, ET0 and rain in mm. Optional columns named **Kc** (for a crop that grows through the season) and **irrigation** (what you actually applied) are used if present.

Choose **No irrigation** to see how dry the soil would get from rain alone, with the days of water stress.

## Worked example

The page opens with a made-up 61-day summer starting 1 June: a soil of 30 % and 14 % water by volume with roots to 0.6 m gives TAW = 96 mm and RAW = 48 mm with p = 0.5. With Kc 1.1, 90 % of rain counting above 2 mm, and 80 % efficiency, the field needs **6 irrigations: 305.6 mm net, 382.0 mm applied**, the first on 6 June (52.2 mm net). A 38 mm storm on 21 June overfills the root zone and 10.6 mm drains below the roots. For 10 ha that is 38,195 m³ of water to pump.

With **No irrigation**, the crop would be stressed on 55 of the 61 days and the depletion would end at 93.7 of 96 mm.

## Tips

- **Leave room for rain** in a wet season: refilling to, say, 10 mm below field capacity lets the next shower soak in instead of draining.
- Make ET0 with the [evapotranspiration calculator](/science/et0-calculator/) from your weather data.
- The single Kc folds soil evaporation into one number; after frequent wetting of bare soil, real use can be higher.

## FAQ

**Is this an irrigation recommendation?** It is a water balance from the numbers you type. Check soil moisture in the field and follow your local adviser.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
