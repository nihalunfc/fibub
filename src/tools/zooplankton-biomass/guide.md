---
name: Zooplankton biomass
num: 333
shelf: science
code: T248
section: marine-and-freshwater-biology
title: "Zooplankton density and biomass calculator: net tow volume, subsample, counts and length-weight equations"
summary: "Turn a zooplankton net sample into numbers per cubic metre and biomass. Work out the water filtered from the net and tow (or a flowmeter), scale up the counts from the part you counted, and convert measured lengths to mass with your own length-weight equation for each taxon."
status: live
ads: true
order: 333
icon: flask
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, hemocytometer, water-quality-index, sample-size, fish-length-weight, pond-oxygen-budget, coral-cover-calculator]
sources:
  - "Method: standard net-sample calculations (volume filtered from mouth area, distance and efficiency or a flowmeter; scaling from a subsample) and length-weight conversion of zooplankton, as described in R. P. Harris et al. (eds.), ICES Zooplankton Methodology Manual (Academic Press, 2000) and E. McCauley in J. A. Downing and F. H. Rigler (eds.), A Manual on Methods for the Assessment of Secondary Productivity in Fresh Waters (Blackwell, 1984). Formulas only."
  - "No length-weight coefficients are bundled. The example a and b values are made up and labelled illustrative; users enter equations from the source they cite."
  - "Checked in the tests against an independent pandas script (volume, densities, per-taxon mean mass from each animal's length, biomass and totals)."
  - "The example sample is made up."
flow:
  - { icon: ruler, label: "Net, tow" }
  - { icon: table, label: "Counts" }
  - { icon: calculator, label: "Density" }
  - { icon: chart, label: "Biomass" }
---

## What it does

A plankton net hauled through the water catches the animals in a known volume of water. In the lab you usually count only part of the sample (a split or an aliquot) and measure a few animals of each kind. This tool does the arithmetic from there:

1. **Water filtered**: V = π × (mouth diameter ÷ 2)² × tow distance × filtration efficiency. With a flowmeter, the distance is revolutions × metres per revolution.
2. **Density** of each taxon: count ÷ share of the sample counted ÷ V, in individuals per m³ (and per litre).
3. **Individual mass**: each measured animal's length is turned into mass with the **length-weight equation** for its taxon, in one of the three usual forms: ln W = a + b ln L, log₁₀ W = a + b log₁₀ L, or W = a × L^b.
4. **Biomass** of each taxon: density × mean individual mass, and the total for the sample.

Plan your net tows with the [[field-sampling-planner]], and check the water they came from with the [[water-quality-index]].

## How to use it

- **Sample**: choose how you know the volume. For a net tow, give the mouth diameter, the distance towed (the depth for a vertical haul) and the filtration efficiency (100 % if unknown). For a flowmeter, give its revolutions and its calibration in metres per revolution. Or type the volume directly.
- **Share of the sample counted**: as a fraction (1/8 for three Folsom splits), a decimal or a percentage. For an aliquot, give the aliquot volume over the total volume, such as 5/250.
- **Counts and equations**: one row per taxon with the number counted and the a and b of its length-weight equation. Choose the equation form and the units the equations were made for. Equations differ between species, regions and preservation methods. Take them from a source that fits your samples. The example values are made up and only illustrative.
- **Lengths**: one row per measured animal, with its taxon name and length. Names are matched ignoring capitals and spaces at the ends.

You can paste tables or open CSV, TSV, TXT or Excel files for both lists.

## Worked example

The made-up sample comes from a 0.5 m net hauled 10 m with 90 % efficiency: **1.767 m³** of water. One eighth of the sample was counted: 212 calanoid copepods, 57 cladocerans, 340 rotifers and 96 nauplii.

- Copepod density = 212 ÷ (1/8) ÷ 1.767 = **960 ind/m³**. With the illustrative equation ln W = −15.8 + 2.6 ln L (L in µm, W in µg), the six measured copepods (mean 810 µm) weigh 5.09 µg on average, so their biomass is **4,889 µg/m³**.
- The totals are **3,192 ind/m³; biomass 7,433 µg/m³** (7.43 mg/m³).
- The nauplii have no lengths in the example, so the page counts them in the density but warns that they have no biomass.

## Tips

- Measure at least 20 to 30 animals of each common taxon where you can; the mean mass is only as good as the sample of lengths.
- Record whether the equations give dry mass, carbon or wet mass, and keep that unit throughout.
- Preservation in formalin or ethanol shrinks animals and loses mass; some equations are made for preserved animals, others for fresh.
- For a vertical haul, multiply the biomass per m³ by the depth hauled to get biomass per m² of water surface.

## FAQs

**Why not use the mass at the mean length?** Because mass rises faster than length, the mass of an animal of average length is less than the average mass. The tool works out each animal's own mass and averages those.

**What filtration efficiency should I use?** Ideally measure it with flowmeters inside and outside the net. Clean, fine nets in clear water filter close to 100 %; clogging nets less.

**Is my data uploaded?** No. Everything runs in your browser.
