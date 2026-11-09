---
name: Seeding rate calculator
num: 384
shelf: science
section: agronomy-and-soil-science
title: "Seeding rate calculator: kg/ha or lb/acre and seeds per metre of row for a target plant population, and plants from stand counts"
summary: "Turn a target plant population into seeds and kg (or lb) to sow from germination, purity, field emergence and seed weight, with seeds per metre or foot of row and the gap between seeds. Then count plants in a length of row or a frame to see the stand you got and your real establishment."
status: live
ads: true
order: 384
icon: target
works: offline
updated: 2026-11-09
related: [fertiliser-blend-calculator, soil-test-interpreter, sprayer-calibration, irrigation-scheduler, field-trial-designer, yield-trial-anova, plant-growth-analysis]
sources:
  - "Seeds to sow = target plants ÷ (germination × purity × field emergence); seed mass from the thousand-seed weight; seeds per metre of row = seeds per m² × row spacing. General agronomy arithmetic with exact unit conversions (1 acre = 0.40468564224 ha, 1 lb = 0.45359237 kg, 1 ft = 0.3048 m)."
  - "Checked against hand-worked sums in Python, including the standard deviation of stand counts (statistics.stdev). The example values are made up."
flow:
  - { icon: target, label: "Plants" }
  - { icon: percent, label: "Germination" }
  - { icon: calculator, label: "Seed rate" }
  - { icon: ruler, label: "In the row" }
---

## What it does

Sowing by weight alone gives very different stands, because seed lots differ in size and quality. A better way is to start from the **number of plants** you want and work back:

- **Pure live seed** = germination × purity. Only these seeds can grow.
- **Field emergence and survival** is the share of live seeds that become established plants in your field. It depends on the seedbed, soil temperature, moisture, sowing depth, pests and your drill.
- **Seeds to sow** = target plants ÷ (germination × purity × emergence).
- **Seed rate** = seeds × thousand-seed weight (TSW). A lot with big seeds needs more kg for the same number of plants.

The calculator also gives seeds per metre (or foot) of row and the gap between seeds, for setting a drill or planter, and the seed and bags for the whole field.

Set the fertiliser for the same field with the [[fertiliser-blend-calculator]], and check the sprayer with the [[sprayer-calibration|sprayer calibration calculator]].

## How to use it

1. Choose metric or US units, and type the **target plants** per m², hectare, acre or square foot.
2. Copy **germination** and **purity** from the seed tag or test; type your own **field emergence**.
3. Give the seed weight as grams per 1,000 seeds, seeds per kg or seeds per lb.
4. Add the **row spacing** (blank for broadcast seed), the **field area** and the **bag size**, in kg or lb, or as a seed count for seed sold in seed-count units.

## Check the stand

After emergence, count the plants in a measured **length of row** (or inside a **frame** thrown at random) in several places. The page turns the counts into plants per hectare or acre, with the spread between spots, how close you came to the target and your **real establishment**: plants ÷ seeds sown. Use that number as the field emergence next time. In US units it also shows the length of row that makes 1/1000 acre at your row spacing.

## Worked example

The page opens with made-up values: 300 plants/m², 92 % germination, 98 % purity, 85 % field emergence, a TSW of 42 g and 18 cm rows. Only 76.6 % of seeds become plants, so you sow 391 seeds/m²: **164.4 kg/ha**, 70.5 seeds per metre of row, one every 1.42 cm. For 25 ha that is 4,110 kg of seed, 164.4 bags of 25 kg (buy 165).

Five 1 m row counts of 52, 49, 57, 55 and 46 plants give 2,877,778 plants per ha (287.8 per m²), 95.9 % of the target, with a CV of 8.6 % between spots; establishment was 73.5 % of seeds sown.

## FAQ

**What field emergence should I use?** Your own from past stand counts is best. It is lower in cold or dry seedbeds, for small seeds and when sowing late.

**Why is my plant count lower than the target?** Losses to slugs, birds, crusting or seed placement. The establishment figure shows how big they were.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
