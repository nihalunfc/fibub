---
name: Fire Weather Index calculator
num: 337
shelf: science
section: forestry
title: "Fire Weather Index (FWI) calculator: Canadian Forest Fire Weather Index System codes FFMC, DMC, DC, ISI, BUI, FWI and DSR from daily weather"
summary: "Run the Canadian Forest Fire Weather Index System over your own daily noon weather (temperature, humidity, wind, rain) from start-up codes. Get the Fine Fuel Moisture Code, Duff Moisture Code, Drought Code, Initial Spread Index, Buildup Index, Fire Weather Index and Daily Severity Rating for every day, with charts. For study and teaching."
status: live
ads: true
order: 337
icon: chart
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, trend-analyser, tree-carbon, wind-chill-heat-index, station-data-viewer, forest-inventory-summary]
sources:
  - "C. E. Van Wagner (1987), Development and structure of the Canadian Forest Fire Weather Index System, Canadian Forestry Service, Forestry Technical Report 35; C. E. Van Wagner and T. L. Pickett (1985), Equations and FORTRAN program for the Canadian Forest Fire Weather Index System, Forestry Technical Report 33; X. Wang, K. R. Anderson and R. D. Suddaby (2015), Updated source code for calculating fire danger indices in the Canadian Forest Fire Weather Index System, Information Report NOR-X-424. The published equations and their coefficients are the method; no tables or data are copied."
  - "Checked in the tests against xclim 1.0 (its Python port of the CFS cffdrs code), day by day over a made-up 150-day series with a long drought and heavy rain, and over the page's made-up example. Not an official fire danger rating."
flow:
  - { icon: table, label: "Weather" }
  - { icon: calendar, label: "Each day" }
  - { icon: calculator, label: "Codes" }
  - { icon: chart, label: "FWI" }
---

## What it does

The **Canadian Forest Fire Weather Index (FWI) System** turns daily weather into numbers that track how dry the forest fuels are and how hard a fire would be to control. It is used across Canada and, adapted, in many other countries. Each day's values depend on yesterday's, so the tool runs the system over your whole series.

Three **moisture codes** follow fuel layers that dry at different speeds:

- **FFMC** (Fine Fuel Moisture Code): litter and fine fuels on the surface; reacts within a day. Above about 85, fine fuels catch easily.
- **DMC** (Duff Moisture Code): loosely packed organic layers a few centimetres deep; reacts over about two weeks.
- **DC** (Drought Code): deep, compact organic layers; reacts over about seven weeks and tracks seasonal drought.

Three **fire behaviour indices** combine them:

- **ISI** (Initial Spread Index): FFMC and wind; how fast a fire would spread.
- **BUI** (Buildup Index): DMC and DC; how much fuel is available to burn.
- **FWI** (Fire Weather Index): ISI and BUI; the overall fire intensity rating.
- **DSR** (Daily Severity Rating): 0.0272 × FWI^1.77, which averages well over a season (the seasonal severity rating).

## How to use it

1. Paste or open your weather: one row per day, in order with no gaps, with the **date** (YYYY-MM-DD) or month number, **noon temperature** (°C), **relative humidity** (%), **wind speed** at 10 m (km/h) and **rain** in the 24 hours to noon (mm). Without dates, pick the month.
2. Set the **start-up codes**: yesterday's FFMC, DMC and DC. At the start of a season (three days after snowmelt) the standard values are 85, 6 and 15. To continue an earlier run, type its last codes.
3. Read the last day's values, the highest and mean FWI, and the charts of the indices and codes. Download the full table as CSV.

The month sets the day-length factors used for the DMC and DC. The tool uses the system's standard factors, which were built for about 46° N.

## Worked example (made-up weather)

Thirty days of June weather, starting from 85, 6 and 15. The first day is hot, dry and breezy (23.1 °C, 22 %, 17 km/h, no rain): FFMC rises to 92.3 and FWI is 13.9. Several rainy days follow, but by **2026-06-11** the FWI peaks at **15.5** (FFMC 88.4, DMC 20.8, DC 64.1, ISI 10.4, BUI 23.0). Heavy rain on the 15th and 20th and cool, damp weather bring it down. On the last day, **2026-06-30, FWI is 9.4**, with FFMC 84.8, DMC 11.9 and DC 50.9. The mean FWI over the month is 4.9 and the seasonal severity rating 0.7.

## Tips

- Use noon local standard time readings (13:00 daylight time), as the system was built for them.
- A missing day breaks the chain. Fill gaps sensibly (for example from a nearby station) rather than skipping them.
- Compare the codes with each other, not only the FWI: a high DC with a low FFMC after rain means deep fuels are still dry.

## FAQs

**Is this an official fire danger rating?** No. It is for study and teaching. Fire agencies use quality-checked stations, their own start-up and overwintering rules, and local danger classes. Always follow your fire agency's ratings and burning restrictions.

**What do the numbers mean in danger classes?** Classes (low, moderate, high, extreme) are set by each agency for its own fuels and region, so the tool does not label them.

**Does it work in the southern hemisphere?** The equations do, but the standard day-length factors are for northern mid-latitudes; adapted factors exist for other latitudes.

**Is my data uploaded?** No. Everything runs in your browser.
