---
name: Stocking density and FCR calculator
num: 401
shelf: science
section: aquaculture
title: "Fish stocking density and FCR calculator: biomass, kg/m³, SGR, feed per day and harvest projection"
summary: "Work out the water volume of a tank or pond, the biomass and stocking density of your fish, how many fish fit a target density, the feed conversion ratio (FCR) and specific growth rate (SGR) over a period, the feed per day at a % of body weight, and when the fish reach harvest weight. Nothing is uploaded."
status: live
ads: true
order: 401
icon: calculator
works: offline
updated: 2026-11-09
related: [growth-curve-tracker, feed-ration-balancer, water-quality-index, pond-oxygen-budget, fish-length-weight, von-bertalanffy-fitter, dissolved-oxygen]
sources:
  - "Standard aquaculture formulas: biomass = number × mean weight; density = biomass ÷ water volume; FCR = feed given ÷ biomass gained; SGR = 100 × (ln final weight − ln initial weight) ÷ days; daily feed = biomass × feeding rate (% body weight). General textbook definitions."
  - "Projection assumes steady exponential growth at the SGR, a steady loss rate, and continuous feeding at a fixed % of body weight (cumulative feed integrated exactly)."
  - "Checked against an independent Python version (numpy), with the cumulative feed checked by numerical integration (scipy.integrate.quad). The example values are made-up round numbers, not recommendations for any species."
flow:
  - { icon: ruler, label: "Tank" }
  - { icon: calculator, label: "Biomass" }
  - { icon: percent, label: "FCR, SGR" }
  - { icon: chart, label: "Harvest" }
---

## What it does

Fish farmers, hatchery staff and aquaculture students keep checking the same few numbers: how much fish is in a tank, how crowded it is, how well the feed is being turned into growth, and when the fish will be ready. This calculator does those sums in three boxes.

1. **Tank or pond, and the fish in it**: water volume of a round or rectangular tank or pond (or a volume you know), **biomass** from the count and mean weight, **stocking density** in kg/m³ (the same number as grams per litre), and the most fish of that size that fit **your target density**.
2. **Growth and feed over a period**: from a start and end count and mean weight, the days and the feed given, it works out the **FCR** (feed conversion ratio, kg of feed per kg of fish gained), the **SGR** (specific growth rate, % per day) and the daily gain per fish. You can add the weight of fish that died so the FCR counts the growth they made.
3. **Feeding and harvest projection**: grows today's fish at a steady SGR, with a feeding rate in % of body weight per day and an optional loss rate, and shows the days to harvest weight, the biomass, density and feed day by day, and when the density passes your target.

Check the oxygen the fish need with the [[pond-oxygen-budget|pond oxygen budget estimator]], and follow their growth with the [[growth-curve-tracker|growth curve tracker]].

## How to use it

Fill in the boxes you need; each works on its own. Use the **water** depth or volume, not the depth of the tank. The projection takes its SGR from the growth box unless you type one. Choose how often the table shows a row, and download the projection as CSV or the whole report as an image, PDF or Word file.

## Worked example

Press **Use the example** (all made-up round numbers). A round tank 4 m across with 1.2 m of water holds 15.08 m³. 1500 fish of 120 g are 180 kg of fish, a density of 11.94 kg/m³. At a target of 40 kg/m³ the tank fits 5,026 fish of that size.

Over the last 60 days the fish grew from 40 g to 120 g (1500 fish to 1470) on 140 kg of feed, with 3 kg of fish lost: a biomass gain of 119.4 kg, so the **FCR is 1.17** and the **SGR 1.831 % per day**.

Fed 2 % of body weight a day, losing 1 % of fish a month and growing at that SGR, the fish reach 400 g in **65.8 days**: about 1,467 fish, 586.9 kg at 38.9 kg/m³, after 452.8 kg of feed. The density stays just under the 40 kg/m³ target. Set the target to 30 and the page warns that the density passes it by day 56.

## Tips

- FCR and SGR depend on species, size, temperature and feed. Compare them with your own past batches rather than with someone else's.
- Fish grow more slowly as they get bigger, so a steady SGR over a long time overestimates growth. Re-measure and update the SGR every few weeks.
- Feeding rate tables differ by species and temperature. Use the rate from your feed supplier or your own records.

## FAQ

**Why do kg/m³ and g/L match?** One cubic metre is 1000 litres and one kilogram is 1000 grams, so the two units are the same number.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
