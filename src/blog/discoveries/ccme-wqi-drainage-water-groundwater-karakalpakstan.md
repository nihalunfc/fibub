---
title: "CCME water quality index for drainage water and groundwater in Uzbekistan"
summary: "A 2025 study scored drainage water and well water in Karakalpakstan with the CCME WQI: drainage water rated Poor for irrigation, groundwater Fair for drinking. Here is how to score your own."
tools: [water-quality-index, non-detects, field-sampling-planner]
updated: 2026-11-10
sources:
  - "Rajabova N, Sherimbetov V, Sadiq R, Aboukila AF (2025), Water 17(15): 2191, CC BY, the paper described here."
  - "Index structure (scope, frequency, amplitude and the five categories): Canadian Council of Ministers of the Environment, Water Quality Index 1.0 (2001). Method only."
paper:
  title: "An Assessment of Collector-Drainage Water and Groundwater—An Application of CCME WQI Model"
  authors: "Rajabova N, Sherimbetov V, Sadiq R, Aboukila AF"
  journal: "Water"
  year: 2025
  doi: "10.3390/w17152191"
  url: "https://www.mdpi.com/2073-4441/17/15/2191"
  licence: "CC BY"
  reviewed: true
---

In the dry south of the Aral Sea basin, farmers reuse the salty water that drains off irrigated fields, and villages drink from shallow wells. A 2025 paper in the journal Water scored both sources with the water quality index of the Canadian Council of Ministers of the Environment (CCME WQI), which turns a year of lab results into one score from 0 to 100. The drainage water came out Poor for irrigating sensitive crops, and the groundwater came out Fair for drinking, with both slipping between 2021 and 2023. The [[water-quality-index]] tool runs the same index on your own results in the browser.

## What they found

The study covers the Amudarya district of Karakalpakstan, in north-west Uzbekistan. The authors report an index of 9.6 in 2021 and 6.2 in 2023 for the collector-drainage water, judged against irrigation guidelines for salt-sensitive crops. Against looser guidelines for salt-tolerant crops the scores were higher, about 31 and 28, but still in the Poor band. Almost every test of salinity, chloride, sodium and the sodium adsorption ratio (SAR, a measure of how much sodium can damage soil structure) broke its limit, and the authors name sodium as the biggest risk.

The groundwater, from 12 observation wells 10 to 25 m deep, scored 77.7 in 2021 and 75.0 in 2023 against the national drinking water standard: Fair. Hardness, dissolved solids and chloride failed, and the first two were rising.

## Why it matters

Decades of cotton irrigation have left salt building up in Karakalpakstan's soils and water. Drainage water is tempting to reuse when river water is short, but water this salty can harm crops and soil. One score lets officials and farmers follow the trend without reading hundreds of lab numbers, and the CCME method works with whatever limits suit each use.

## How they did it

1. The drainage water was sampled monthly from a collecting pond, and the 12 wells in the same years.
2. Six variables went into the drainage index: electrical conductivity (EC, a quick measure of salt), bicarbonate, chloride, sodium, SAR and an EC-adjusted SAR. Eight went into the groundwater index, including pH, nitrate, fluoride, iron, copper and dissolved solids.
3. Drainage results were compared with irrigation guidelines of the Food and Agriculture Organization (FAO); groundwater results with Uzbekistan's drinking water standard, with World Health Organization values alongside.
4. The three CCME factors were worked out in a spreadsheet. 2022 was left out as almost the same as 2021.

## Check it yourself with fibub

The index rests on three factors. **Scope (F1)** is the share of variables that failed at least once. **Frequency (F2)** is the share of all tests that failed. **Amplitude (F3)** grows with how far the failing tests went past their limits. The index is 100 − √(F1² + F2² + F3²) ÷ 1.732.

The paper prints F1, F2 and the normalised sum of excursions for 2021. Putting those into the formula gives back the headline scores, 77.7 and 9.6, so the arithmetic holds up.

Now a worked example with **our own made-up numbers**, not the paper's data. Picture a drainage ditch sampled six times, with these invented objectives: EC at most 3 dS/m, chloride at most 350 mg/L, sodium at most 200 mg/L, SAR at most 9, and pH between 6.5 and 8.4.

| Sample | EC (dS/m) | Cl (mg/L) | Na (mg/L) | SAR | pH |
|---|---|---|---|---|---|
| 1 | 2.1 | 280 | 150 | 6 | 7.6 |
| 2 | 3.4 | 410 | 230 | 10 | 7.9 |
| 3 | 2.8 | 330 | 190 | 8 | 8.1 |
| 4 | 4.2 | 520 | 310 | 13 | 8.6 |
| 5 | 2.5 | 300 | 170 | 7 | 7.8 |
| 6 | 3.1 | 360 | 205 | 9 | 8.0 |

1. In **Objectives**, type one row per variable: the name, the lowest allowed value and the highest allowed value. Leave the lowest blank for EC, chloride, sodium and SAR, since only high values are a problem. Give pH both limits.
2. In **Results**, paste a header row with the same five names, then the six samples.
3. Read the score: **WQI 38 (Poor)**. All 5 variables failed at least once, so F1 = 100 %. 12 of the 30 tests failed, so F2 = 40 %. The failures were mild, so F3 is only 7.85.
4. Open **By variable**. Sodium failed 3 times and its worst result was 1.55 times its limit; pH failed once, only just.
5. Open **Every sample**. Sample 4 fails all five variables. Delete that row and the score climbs to 51 (Marginal), because pH then never fails and F1 drops to 80 %.

With only a handful of variables, one bad day can swing F1 by 20 points; the tool flags scores built on fewer than 4 variables or 4 samples. Results such as "<0.01" are taken at the detection limit; for better averages, see [[non-detects]]. To decide how many wells or dates you need in the first place, try the [[field-sampling-planner]].

## The fine print

- The index depends entirely on the limits chosen. The same water scored 9.6 or about 31 depending on which crop guideline was used.
- Two years of data, from one district, cannot show a firm trend, and the paper describes no statistical test of the change.
- "Fair" in the CCME scheme means the water is usually protected but sometimes threatened; it is not a verdict on whether to drink it. For drinking water decisions, check the official source and your local health authority.
- Our worked example is invented.
