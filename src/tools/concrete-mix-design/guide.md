---
name: Concrete mix calculator
num: 649
shelf: science
code: T446
section: civil-and-structural-engineering
title: "Concrete mix design calculator: absolute volume method, batch weights, moisture correction and target strength"
summary: "Work out cement, water, sand and stone per cubic metre and per batch by the absolute volume method, from your own w/c ratio, water, air, coarse aggregate fraction, specific gravities and stockpile moisture. Corrects the batch for wet or dry aggregate and gives the target mean strength f'c + k·s."
status: live
ads: true
order: 649
icon: calculator
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, sample-size, method-validation, rebar-calculator, load-combination-helper, column-buckling, retaining-wall-check, unit-converter]
sources:
  - "Absolute volume method of proportioning concrete, oven-dry aggregate basis with moisture correction (wet mass = dry × (1 + moisture), free water = dry × (moisture − absorption)), as described in general concrete technology textbooks such as Neville, A. M., Properties of Concrete, and Mehta and Monteiro, Concrete: Microstructure, Properties and Materials (method only)."
  - "Target mean strength f'cr = f'c + k·s and the normal distribution: general statistics. The normal curve uses the Abramowitz and Stegun (1964) 7.1.26 approximation."
  - "No values are copied from any design code or its tables (ACI, Eurocode, IS, BS or others). All example inputs are made up or rounded and are editable; the user enters the factors from their own code and tests."
  - "Checked against an independent SciPy calculation written for the tests (root of the absolute-volume sum, scipy.stats.norm)."
flow:
  - { icon: target, label: "Strength" }
  - { icon: sliders, label: "Mix" }
  - { icon: calculator, label: "Volumes" }
  - { icon: table, label: "Batch" }
---

## What it does

Concrete is cement, water, fine aggregate (sand), coarse aggregate (stone) and a little air. The **absolute volume method** is the common way to turn a chosen water/cement ratio and water content into quantities: each ingredient takes up its solid volume (mass ÷ (specific gravity × 1000)), and the sand fills whatever is left of one cubic metre.

This calculator does those sums for you. You enter every factor yourself, from your trial mixes, your materials tests and the mix-design method your local code uses. It gives:

- the **target mean strength** f'cr = f'c + k × s, and the share of results expected below f'c,
- **design masses** per m³ (aggregates oven-dry, water as free water),
- **field batch weights** corrected for the moisture in your stockpiles,
- quantities **per batch** (a trial mix, a mixer load or a truck) and the number of cement bags,
- the mix as a **ratio by mass** (1 : sand : stone), a picture of the volumes and a CSV of the batch weights.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer, and confirm every mix with trial batches and strength tests.

Once the mix is set, work out the bars you need with the [[rebar-calculator|rebar calculator]], and check the design loads with the [[load-combination-helper|load combination helper]].

## How to use it

1. **Target strength.** Type the specified strength f'c, the standard deviation of your plant's test results, and the factor k your rules use. k = 1.65 means about 5 % of results would fall below f'c if strengths spread normally. Some codes add a margin in other ways; follow yours.
2. **Mix.** Enter the w/c ratio and the free water (kg/m³) you chose for the strength, exposure and slump you need, the air content (%), and the coarse aggregate bulk volume fraction with the stone's dry-rodded density. The coarse aggregate mass is fraction × dry-rodded density.
3. **Materials.** Enter the specific gravities of the cement and the oven-dry specific gravities of the aggregates, plus each aggregate's moisture in stock and its absorption, both as % of dry mass.
4. **Batch.** Enter the batch volume and your cement bag mass.

## What each result means

- **Cement** = water ÷ (w/c).
- **Sand** = (1 − volumes of water, cement, air and stone) × SG of sand × 1000. If nothing is left, the calculator says so.
- **Field weights**: aggregate wetter than its absorption carries free water, so you weigh more wet aggregate and add less water. Aggregate drier than its absorption soaks water up, so you add more.
- **Fresh density** is the sum of the design masses; compare it with a measured unit weight.

## Worked example

Made-up inputs (the page opens with these): f'c 30 MPa, s 4 MPa, k 1.65; w/c 0.45, water 180 kg/m³, 2 % air, coarse aggregate fraction 0.6 with a dry-rodded density of 1600 kg/m³; SG 3.15, 2.68 and 2.62; coarse aggregate 1 % moisture and 0.5 % absorption, sand 4 % and 1 %.

- f'cr = 30 + 1.65 × 4 = **36.6 MPa**, with about 4.9 % of results below 30 MPa.
- Cement = 180 ÷ 0.45 = **400 kg**; stone = 0.6 × 1600 = **960 kg**.
- Volumes: water 0.180, cement 0.127, air 0.020, stone 0.358 m³, leaving 0.315 m³ for sand, so sand = **825 kg**. Fresh density 2365 kg/m³; ratio **1 : 2.06 : 2.40**.
- Field: stone 970 kg, sand 858 kg, water **150 kg** (the wet sand brings about 25 kg).
- A 0.05 m³ trial batch: 20 kg cement (0.4 bags of 50 kg), 7.523 kg water, 48.48 kg stone and 42.89 kg sand.

## FAQ

**Why are there no default tables for water or stone content?** Those come from design codes and national methods that differ by country and edition. Use the ones that apply to you; the example values here are made up only to show the sums.

**Can I use SSD (saturated surface-dry) masses?** Enter SSD specific gravities and set absorption to 0; then the moisture you enter is the free moisture above SSD.

**What about fly ash, slag or admixtures?** Split the cementitious content yourself and add their volumes into the cement line, or reduce the water for a water-reducer. A full blended-mix design is beyond this tool.

**Is the strength factor right for my code?** Only you can check that. The calculator just applies f'c + k × s with the values you give.
