---
title: "Landfill methane by first-order decay: temperature, k and Monte Carlo"
summary: "A 2025 study of a closed landfill near Oaxaca City compared three first-order decay models with a measured methane flow. The simplest one came closest. Here is how to run the model yourself."
tools: [landfill-gas, uncertainty-calculator, air-quality-calculator]
updated: 2026-11-10
sources:
  - "Pérez Belmonte NM, Sandoval Torres S, Belmonte Jiménez SI (2025), Processes 13(12): 3983, CC BY, the paper described here."
  - "First-order decay model for landfill methane: the standard approach in landfill gas and greenhouse gas reporting. Method only."
paper:
  title: "Effect of Temperature on First-Order Decay Models and Uncertainty Analysis for the Prediction of Methane Emissions in a Landfill Located in the Urban Area of Oaxaca City, Mexico"
  authors: "Pérez Belmonte NM, Sandoval Torres S, Belmonte Jiménez SI"
  journal: "Processes"
  year: 2025
  doi: "10.3390/pr13123983"
  url: "https://www.mdpi.com/2227-9717/13/12/3983"
  licence: "CC BY"
  reviewed: true
---

How much methane will a landfill give off, and for how long after it closes? Most answers come from first-order decay models, where every tonne of buried waste releases its methane ever more slowly. A 2025 paper in the journal Processes ran three such models for a landfill that served the Oaxaca City area in southern Mexico, tuned their decay rate for the heat inside the waste, and checked them against one measured gas flow. The plainest model came closest; the best-known one, the US EPA's LandGEM, ran well above the measurement. The [[landfill-gas]] tool runs the same kind of model in your browser, and the [[uncertainty-calculator]] shows how errors in the inputs spread to the answer.

## What they found

The landfill, in Zaachila, covers about 17 hectares, took waste from 24 municipalities and closed in 2022. Gas sampling at the extraction wells in 2020 gave about 3.53 million m³ of methane for that year. The authors' simple first-order model, with its decay rate set for a waste temperature of 48 °C, predicted almost exactly that: about 3.53 million m³. A modified version of the model, which adds a delay before decay starts, predicted more than was measured, and LandGEM gave about 5.3 million m³ for 2022.

Raising the assumed waste temperature from 46 to 48 °C lifted the simple model's 2020 estimate by only about 1 %. A Monte Carlo analysis, which reruns the model 10,000 times with inputs drawn at random from plausible ranges, put the simple model's 2020 value between about 3.1 and 3.9 million m³ (95 % range).

## Why it matters

Methane traps far more heat than carbon dioxide over the first decades after release, and landfills are a major human source of it. Many old sites have patchy records, so estimates rest on models. An overpredicting model can oversize a gas collection project and skew a greenhouse gas inventory.

## How they did it

1. They gathered yearly waste tonnages from 1991 to 2012 and extended them to 2022 with a spreadsheet forecast, from about 53,000 t in 1991 to an estimated 108,000 t in 2022.
2. They set L₀, the total methane a tonne of waste can make, at 100 m³ per tonne, an EPA value.
3. They estimated the decay rate k from the area's yearly rainfall, about 485 mm, which gave roughly 0.026 per year, then adjusted k for temperature with an Arrhenius-type rule.
4. They ran the simple, modified and LandGEM models to 2060 and compared 2020 with the measured flow.
5. They ran the Monte Carlo analysis with triangular and log-normal input ranges.

## Check it yourself with fibub

The [[landfill-gas]] page needs a table of years and tonnes, then k and L₀. Here is a worked example with **our own made-up numbers**, not the paper's data: a small site that took 40,000 t a year from 2000 to 2019, then closed.

1. Paste 20 rows, 2000 to 2019, each with 40000 in the tonnes column.
2. Set **Decay rate k** to 0.026 per year (a dry-climate value close to the paper's) and **Methane potential L₀** to 100 m³/t. The page shows the half-life of the waste: 26.7 years.
3. Leave **Methane in the gas** at 50 %, **Gas volumes at** 0 °C, **Collected** at 0 % and **Oxidised in the cover** at 10 %. Set **Report year** to 2020.
4. Read the result. Methane peaks at about 1.6 million m³ in 2020, the first year after closing. That is about 1,146 t of methane, or an average landfill gas flow of about 366 m³/h. After 10 % oxidation in the cover, about 1,031 t of methane escapes, or 27,846 t CO₂e with the methane warming factor (GWP) of 27.
5. Set **Collected** to 60 %. About 0.96 million m³ is captured, enough for roughly 0.38 MW of electricity at 35 % engine efficiency, and the emissions fall to about 11,139 t CO₂e.
6. Now try k = 0.05, as in a wetter climate. The peak moves to 2019 and rises to about 2.5 million m³. By 2040 the two runs are close (about 0.95 and 0.91 million m³), and by 2069 the slow site still has 17 million m³ of its 80 million m³ to come, against about 4 million m³ for the fast one.

So k shapes the curve far more than a few degrees of temperature. The tool takes k as given, so apply any temperature correction before typing it in.

Watch the gas volume basis too. The paper's measurement was reported at 20 °C, and a cubic metre at 20 °C holds about 7 % less gas than one at 0 °C. The tool offers 0, 15 or 25 °C. To convert methane readings between ppm and mg/m³, use the [[air-quality-calculator]]. To see how a ±30 % doubt in L₀ or k spreads into one year's methane, type the model as `Q = k L0 M exp(-k a)` in the [[uncertainty-calculator]], give each input its doubt (the page offers a triangular range, as the paper used) and run its Monte Carlo check.

## The fine print

- Only one measured value, for one year, was available to test the models, so a close match could partly be luck.
- Waste tonnages after 2012 were forecast, not weighed, and waste makeup was assumed constant.
- k came from a rainfall rule rather than site data, and the 46 to 48 °C waste temperatures are an assumption the paper explains only briefly.
- Our worked example is invented. For reporting, use the k, L₀ and methods your regulator or reporting scheme sets, and check the official source.
