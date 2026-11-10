---
title: "Potential evapotranspiration method changes water-cycle trends across Europe"
summary: "A 2025 HESS study drove one hydrological model with 12 evapotranspiration formulas for 553 European catchments. The formula changed the trends. See how to compare two yourself."
tools: [et0-calculator, trend-analyser, runoff-calculator]
updated: 2026-11-10
sources:
  - "Thakur V, Markonis Y, Kumar R, Thomson JR, Vargas Godoy MR, Hanel M, Rakovec O (2025), Hydrology and Earth System Sciences 29: 4395-4416, CC BY 4.0, the paper described here."
  - "FAO-56 Penman-Monteith reference evapotranspiration: Allen RG, Pereira LS, Raes D, Smith M (1998), FAO Irrigation and Drainage Paper 56. Hargreaves-Samani (1985) temperature method."
  - "The weather in the worked example is made up by fibub."
paper:
  title: "Unveiling the impact of potential evapotranspiration method selection on trends in hydrological cycle components across Europe"
  authors: "Thakur V, Markonis Y, Kumar R, Thomson JR, Vargas Godoy MR, Hanel M, Rakovec O"
  journal: "Hydrology and Earth System Sciences"
  year: 2025
  doi: "10.5194/hess-29-4395-2025"
  url: "https://hess.copernicus.org/articles/29/4395/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

Potential evapotranspiration (PET) is how much water the air could pull out of wet ground and leaves if water were never short. It is one of the main inputs to every hydrological model, yet there are more than a hundred published formulas for it, some using only temperature and some using sunshine, humidity and wind as well. A team of hydrologists asked a simple question: if you swap the formula, do the trends you find in river flow, soil water and evaporation change? Their answer, published in Hydrology and Earth System Sciences in September 2025, is yes. This page explains it in plain words and shows how to see the effect for yourself with the [[et0-calculator|evapotranspiration calculator]], then test a long series with the [[trend-analyser]].

## What they found

The team ran the same hydrological model for 553 catchments across Europe from 1980 to 2019, twelve times over, each time with a different PET formula. All twelve agreed that PET has been rising, but they disagreed on how fast. Median trends ran up to about 6 mm a year. The Jensen-Haise formula gave the biggest changes, and no single formula was always the lowest.

Actual evaporation followed PET, though less strongly. River flow and total water storage trends mostly agreed whichever formula was used. Significant trends turned up in about 70 % of catchments for actual evaporation, about 33 % for river flow and about 36 % for storage. Summer drove most of the yearly rise in PET. Whether a region looked like it was "intensifying" its water cycle (more rain, evaporation, flow and storage together) depended on the formula chosen.

## Why it matters

Climate impact studies often pick a PET formula by habit or because only temperature data are available. If the formula alone can change a trend's size, or tip a catchment from "no trend" into "significant trend", then the choice needs to be stated and tested, not hidden in the methods. Water managers deciding on reservoirs or irrigation need to know how much of a reported change comes from the climate and how much from the arithmetic.

## How they did it

The twelve formulas fell into three families. Eight were temperature-based, including Thornthwaite, Hamon, Oudin, Hargreaves-Samani and Jensen-Haise. One, Milly-Dunne, was radiation-based. Three were combination methods that weigh radiation against the drying power of the air: Penman-Monteith, Priestley-Taylor and a Penman-Monteith version that lets plants respond to more CO2.

Weather came from the EM-Earth and ERA5-Land datasets. Catchments were sorted by an aridity index, the ratio of mean PET to mean rainfall: 189 were energy-limited (always below 1), 34 water-limited (always above 1) and 330 "mixed", meaning the label itself depended on the formula. Trends were found with the Mann-Kendall test and Sen's slope, for each year and each season.

## Check it yourself with fibub

The evapotranspiration calculator works out daily reference evapotranspiration (ET0) by the FAO-56 Penman-Monteith equation and shows the Hargreaves temperature-only value beside it, so you can watch the two formulas react differently to the same change. The day below is made up.

1. **Set the place.** Latitude 50, elevation 100 m, wind measured at 2 m.
2. **Type the day.** Date 15 July, highest temperature 24 °C, lowest 12 °C. Choose **Dew point** for humidity and type 10 °C. Wind 2 m/s. Sunshine 7 hours.
3. **Read both answers.** The page gives Penman-Monteith ET0 of about **4.14 mm/day** and Hargreaves about **4.68 mm/day**.
4. **Warm the day by 2 °C.** Change the temperatures to 26 °C and 14 °C and leave the dew point at 10 °C, so the air holds the same water and feels drier. Penman-Monteith rises to about **4.59 mm/day** (up about 11 %), Hargreaves to about **4.94 mm/day** (up about 6 %).
5. **Warm it, but with moister air.** Keep 26 °C and 14 °C and raise the dew point to 11.5 °C. Penman-Monteith is now about 4.42 mm/day; Hargreaves stays at 4.94, because it never looks at humidity.
6. **Warm it, with calmer and cloudier weather.** Back to a 10 °C dew point, but wind 1.6 m/s and 6 hours of sun. Penman-Monteith falls to about **4.20 mm/day**, only about 1 % above the cool day, while Hargreaves still says about 6 % more.

The same warming gives an ET0 rise anywhere from about 1 % to 11 % with Penman-Monteith, depending on humidity, wind and cloud, but a fixed 6 % with Hargreaves. Over 40 years, small differences like these add up to different trends. For a real station, paste a daily table, download the daily ET0, add up each year and paste the yearly totals into the trend analyser to read Sen's slope. The other side of a catchment's water balance is what rain runs off; for a small catchment, the [[runoff-calculator]] works out storm runoff depth and peak flow.

## The fine print

- One model (mHM) with its default settings was used; other models or recalibrated ones might respond differently.
- Only twelve of the many PET formulas were tested.
- The weather data are gridded products, and ERA5-Land has known weaknesses for hydrology.
- Results were averaged over catchments and months, and cover one 40-year window.
- Many flow and storage trends were not statistically significant, so conclusions about those are weaker than about evaporation.
- The FAO-56 reference crop is short grass; real crops need a crop coefficient, and irrigation decisions should follow local extension advice.
