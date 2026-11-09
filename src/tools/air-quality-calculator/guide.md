---
name: Air quality calculator
num: 116
shelf: science
section: atmospheric-chemistry-and-air-quality
title: "Air quality calculator: ppm to µg/m³ converter, US AQI, India AQI and Canada AQHI"
summary: "Convert gas concentrations between ppm, ppb, µg/m³ and mg/m³ at any temperature and pressure, and work out the US Air Quality Index (with the 2024 PM2.5 breakpoints), India's National AQI and Canada's Air Quality Health Index from your own readings."
status: live
ads: true
order: 1
icon: percent
works: offline
updated: 2026-11-08
related: [gas-law-calculator, psychrometric-calculator, molar-mass-calculator, solution-calculator]
sources:
  - "US AQI breakpoints and method: 40 CFR Part 58 Appendix G, Table 2 (US EPA; PM2.5 breakpoints revised in 2024, in force from 6 May 2024). A US government work. Checked 2026-11-08."
  - "India AQI breakpoints: Central Pollution Control Board, National Air Quality Index (2014). Checked 2026-11-08."
  - "Canada AQHI formula and AQHI+ rule: Environment and Climate Change Canada and provincial AQHI documentation. Checked 2026-11-08."
  - "Gas constant: CODATA (NIST), exact. Molar masses worked out by fibub from IUPAC standard atomic weights."
flow:
  - { icon: convert, label: "Units" }
  - { icon: table, label: "Readings" }
  - { icon: calculator, label: "Index" }
  - { icon: flag, label: "Category" }
---

## What it does

Air pollution is reported in two kinds of unit. **ppm and ppb** count molecules: 1 ppb of a gas is one molecule in a billion molecules of air. **µg/m³ and mg/m³** weigh the gas in a cubic metre of air. Converting between them needs the gas's molar mass and the volume a mole of air fills, which depends on temperature and pressure:

µg/m³ = ppb × molar mass / molar volume, where the molar volume is 24.47 L/mol at 25 °C and 1 atm.

The tool also turns your readings into three official indices:

- **US Air Quality Index (AQI)**, from 0 to 500, with six categories from Good to Hazardous. It uses the breakpoints in US federal rules, including the stricter PM2.5 breakpoints that took effect on 6 May 2024 (Good now ends at 9.0 µg/m³).
- **India National AQI**, from 0 to 500, with six categories from Good to Severe, from the Central Pollution Control Board.
- **Canada Air Quality Health Index (AQHI)**, a 1 to 10+ health-risk scale. It is built from 3-hour averages of NO₂, ozone and PM2.5, plus the AQHI+ rule for wildfire smoke.

Each index is the highest of its pollutant sub-indices, and the tool names the pollutant behind it.

## How to use it

1. **Units.** Choose a gas or type any formula, enter the value and unit, and set the temperature and pressure. You get all four units, the molar mass and the molar volume.
2. **US and India AQI.** Enter the averages you have, each in its own unit, and leave the rest blank. Gas readings are converted at 25 °C. Note the averaging times: the US uses 1-hour NO₂ and SO₂, while India uses 24-hour averages. India's index officially needs at least three pollutants, one of them PM2.5 or PM10.
3. **AQHI.** Enter 3-hour averages of NO₂ and ozone in ppb and PM2.5 in µg/m³. During wildfire smoke, also enter the last hour's PM2.5.

These are calculators for your own readings, not forecasts. Official agencies also apply data-completeness rules and short-term methods such as the US NowCast. Always check the official source for your area.

## Worked example

100 µg/m³ of NO₂ at 25 °C and 1 atm is **53.18 ppb**, and 1 ppm of CO is 1.145 mg/m³.

With PM2.5 at 35.9 µg/m³, PM10 at 60 µg/m³, 8-hour ozone at 60 ppb, NO₂ at 40 ppb and CO at 1.2 ppm, the **US AQI is 102, Unhealthy for sensitive groups**, driven by PM2.5. India's index for the same air is **126, Moderately polluted**, but driven by ozone: 60 ppb is about 118 µg/m³, above India's 100 µg/m³ limit for Satisfactory. India rates the same PM2.5 only 59, Satisfactory, because its PM2.5 bands are wider.

With 3-hour averages of 20 ppb NO₂, 30 ppb ozone and 10 µg/m³ PM2.5, the **AQHI is 4, moderate risk**. If the last hour's PM2.5 jumps to 85 µg/m³ in smoke, AQHI+ gives 9 (high risk), and that is the value published.

## Questions

**Why does µg/m³ change with temperature but ppb does not?** Warm air is less dense, so a cubic metre holds fewer molecules of everything. The share of molecules (ppb) stays the same, but their mass per cubic metre falls.

**Why do the US and India give different numbers for the same air?** Each country sets its own breakpoints from its own health standards and averaging times. Neither number is wrong. They are different scales.

**Is anything sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
