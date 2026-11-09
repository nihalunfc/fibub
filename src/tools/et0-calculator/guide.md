---
name: Evapotranspiration calculator
num: 143
shelf: science
section: hydrology-and-water-resources
title: "Evapotranspiration calculator: FAO-56 Penman-Monteith ET0 and crop water use from daily weather"
summary: "Work out daily reference evapotranspiration (ET0) with the FAO-56 Penman-Monteith equation from temperature, humidity, wind and sunshine or radiation, with shortcuts when humidity or radiation is missing, Hargreaves for comparison, crop water use with your own Kc, and a daily table you paste or open for a month or years of weather."
status: live
ads: true
order: 4
icon: flask
works: offline
updated: 2026-11-08
related: [runoff-calculator, koppen-climate, flood-frequency, trend-analyser]
sources:
  - "FAO-56 Penman-Monteith reference evapotranspiration and its supporting equations (vapour pressure, extraterrestrial and clear-sky radiation, net long-wave radiation, wind height adjustment, missing-data procedures): Allen, R. G., Pereira, L. S., Raes, D. and Smith, M. (1998), Crop evapotranspiration, FAO Irrigation and Drainage Paper 56 (equations only; none of its tables or example data are reproduced)."
  - "Hargreaves ET0 and radiation from the temperature range: Hargreaves, G. H. and Samani, Z. A. (1985), as given in FAO-56."
  - "No crop coefficients are bundled: users type their own Kc."
  - "Checked against an independent Python version and the open-source pyet 1.5 library in the tests. The example weather is made up, drawn at random by fibub."
flow:
  - { icon: compass, label: "Place" }
  - { icon: calendar, label: "Weather" }
  - { icon: calculator, label: "ET0" }
  - { icon: chart, label: "Crop use" }
---

## What it does

**Evapotranspiration** is the water that leaves the ground as vapour, from the soil surface and through the leaves of plants. Farmers, irrigation engineers and water planners estimate it to know how much water a crop or a catchment needs.

The standard starting point is the **reference evapotranspiration ET0**: the water used each day by a wide, well-watered field of short grass. This tool works it out with the **FAO-56 Penman-Monteith** equation, which balances the sun's energy against the drying power of the air:

- the **energy** part, from net radiation (sunlight in, minus what is reflected and what the ground radiates back);
- the **aerodynamic** part, from the vapour pressure deficit (how dry the air is) and the wind that carries moist air away.

Multiply ET0 by a **crop coefficient Kc** to get the crop's own water use, ETc.

To compare evaporation with rain falling on the same catchment, use the [[rain-gauge-average|rain gauge average]] tool; to classify the climate from monthly means, the [[koppen-climate|Köppen climate classifier]].

## How to use it

1. Give the **latitude** (south negative), the **elevation** and the **height of the wind reading** (weather stations often measure at 10 m; it is converted to 2 m).
2. For **one day**, give the date, the highest and lowest temperatures, the humidity in whichever form you have, the mean wind speed and the hours of bright sunshine or the measured solar radiation.
3. For many days, paste or open a **daily table** with a header. Columns are recognised by name: date, Tmax, Tmin, RH max and RH min (or RH, or dew point), wind, sunshine or solar radiation.
4. Optionally type a **Kc** for your crop and growth stage to see the crop's water use.

## What each setting does

- **Humidity not measured** takes the dew point as the day's lowest temperature, as FAO-56 suggests; it suits humid or irrigated sites and overstates humidity in dry ones.
- **Sunlight not measured** estimates radiation from the temperature range; the coastal setting suits sites near large water bodies.
- **Wind** left blank uses 2 m/s, the FAO-56 world average.

## Worked example

A made-up mid-July day at 43.1° N, 180 m up: 29 °C high, 16.5 °C low, relative humidity between 88 % and 41 %, wind 3.1 m/s at 10 m (2.32 m/s at 2 m) and 10.2 hours of sunshine. The sun at the top of the air gives 40.7 MJ/m²; 24.1 MJ/m² reaches the ground, and net radiation is 14.3 MJ/m². The vapour pressure deficit is 1.29 kPa. **ET0 is 5.53 mm/day**; Hargreaves gives 5.48 mm/day. With Kc = 1.15 (a made-up mid-season value), the crop uses 6.36 mm/day.

## FAQ

**Why is my Hargreaves value different?** Hargreaves uses only temperature and the sun's position, so it misses humidity and wind. It is a useful check when data are short, not a replacement.

**Can I use hourly data?** Not here. FAO-56 has an hourly form with a soil heat flux term; this tool works with daily totals and means, where the soil heat flux is taken as zero.

**Does ET0 tell me when to irrigate?** It is one part of a water balance. Rain, soil water, the crop's stage and the irrigation method all matter; follow your local extension service.
