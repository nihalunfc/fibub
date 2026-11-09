---
name: Landfill gas estimator
num: 154
shelf: science
section: environmental-engineering
title: "Landfill gas generation estimator: methane and LFG flow by first-order decay, with collection, oxidation and CO2e"
summary: "Estimate the methane and landfill gas a site makes each year from the tonnes of waste placed. Uses the first-order decay model with your decay rate k and methane potential L0. Shows the peak, the gas flow in m³/h, how much a collection system captures, the power it could make, and the methane and CO2-equivalent emitted."
status: live
ads: true
order: 1
icon: flask
works: offline
updated: 2026-11-09
related: [non-detects, air-quality-calculator, unit-hydrograph]
sources:
  - "First-order decay model for landfill methane: the standard approach in landfill gas and greenhouse gas reporting methods. Written by fibub from the model's equation; the yearly totals are exact integrals with waste placed evenly through each year. No tables or default values are copied from any agency's tool."
  - "Methane density from the ideal gas law (molar mass 16.043 g/mol). Lower heating value of methane taken as 50.0 MJ/kg. Global warming potentials of methane (100-year) as published by the IPCC in its Fourth, Fifth and Sixth Assessment Reports, offered as choices."
  - "Checked in the tests against a NumPy brute-force integration (1,000 placement slices per year) and for mass balance. The default k and L0 and the example tonnages are illustrative only."
flow:
  - { icon: table, label: "Tonnes" }
  - { icon: curve, label: "Decay" }
  - { icon: flask, label: "Methane" }
  - { icon: chart, label: "Emissions" }
---

## What it does

Food, paper, wood and garden waste in a landfill rot without air and make **landfill gas**, roughly half methane and half carbon dioxide. Methane is a strong greenhouse gas, a fire and explosion risk, and a fuel worth collecting. This tool estimates how much a site makes, year by year, for as long as you like after it closes.

It uses the **first-order decay** model that most landfill gas and greenhouse gas reporting methods are built on. Each tonne of waste can make L₀ cubic metres of methane in total, released ever more slowly. The rate falls by the same fraction each year, set by the decay rate k. The tool adds up the contribution of every year's waste. The yearly totals are exact, with waste placed evenly through each year, so in the end every tonne releases exactly L₀.

Convert methane readings between ppm and mg/m³ with the [[air-quality-calculator]], and handle readings below the detection limit with [[non-detects|non-detect statistics]].

## How to use it

1. **Waste placed**: a year and the tonnes placed that year, one row per year. Paste them or open a CSV, TXT or Excel file. Years listed twice are added together.
2. **Decay rate k**: how fast the waste breaks down. Wet climates and food waste mean a larger k; dry climates and wood mean a smaller one. The half-life is shown.
3. **Methane potential L₀**: cubic metres of methane per tonne over the waste's whole life.
4. **The defaults (k = 0.05 per year, L₀ = 100 m³/t) are only illustrative.** Use the values your regulator or reporting scheme sets for your climate and waste type.
5. **Methane in the gas**: used to turn methane into total landfill gas flow; 50 % is a common assumption.
6. **Gas volumes at**: the temperature L₀ is quoted at. It sets the methane density used for tonnes.
7. **Collected** and **oxidised in the cover**: the share of methane a gas system captures, and the share of what escapes that soil bacteria in the cover turn into CO₂.
8. **GWP**: the 100-year global warming potential of methane, as your reporting scheme asks.
9. **Report year** and **show until**: the year to summarise, and how far the table and chart run.

## What you get

- The **peak year** and its methane.
- For the report year: methane in m³ and tonnes, the **landfill gas flow in m³/h**, the amount collected and the **electrical power** it could make, and the **methane emitted** and its **CO₂ equivalent**.
- The half-life of the waste, and how much methane is still to come after the last year shown.
- **A chart** of methane generated, collected and emitted, and **a year-by-year table**, with CSV, PDF, PNG and Word downloads.

## Worked example

The made-up site took 50,000 tonnes in 2005, growing 3 % a year until it closed after 2024: 1.34 million tonnes in all. With the illustrative k = 0.05 per year and L₀ = 100 m³/t:

- **Methane peaks at 4.34 million m³ in 2025**, the year after the last waste.
- In 2026 it makes 4.13 million m³ of methane (2,957 t at 0 °C), about 943 m³/h of landfill gas at 50 % methane.
- With no gas collection and 10 % oxidation, 2,661 t of methane is emitted, which is 71,852 t CO₂e at a GWP of 27.
- Collecting 60 % of the methane would run about 0.98 MW of engines at 35 % efficiency.
- The waste's half-life is 13.9 years. About 7.3 million m³ is still to come after 2074.

## Limits

The model is only as good as k, L₀ and the tonnage records. Real sites vary with moisture, temperature, cover and waste mix, so measured gas flows often differ from the estimate by tens of per cent. For a permit, a design or an emissions report, use the method and values your regulator specifies, and check the result against site measurements.

## FAQs

**Why does the peak come after the site closes?** The newest waste is still near its fastest decay, and the older waste is still making gas. Once placement stops, generation starts to fall.

**Does the tool use the 0.1-year steps of some regulatory models?** No. It integrates each year exactly, which gives very similar yearly totals. Small differences against a specific agency's tool are expected.

**Is my data uploaded?** No. Everything runs in your browser.
