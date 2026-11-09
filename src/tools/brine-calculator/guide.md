---
name: Brine, cure and fermentation salt calculator
num: 394
shelf: science
section: food-science
title: "Brine calculator: salt for a brine %, salinometer degrees, equilibrium brine for ferments, dry cure and curing salt ppm"
summary: "Work out the salt for a brine by weight (of the brine or of the water), read salinometer degrees, salt a vegetable ferment by the equilibrium method, weigh a dry cure, and turn your own nitrite target into grams of curing salt. Nothing is uploaded."
status: live
ads: false
order: 394
icon: percent
works: offline
updated: 2026-11-09
related: [recipe-nutrition-calculator, shelf-life-estimator, solution-calculator, colligative-properties]
sources:
  - "Arithmetic by weight (general facts): brine % = salt ÷ (salt + water); salt per water = salt ÷ water; ppm = mg per kg. The salinometer scale (0° for water, 100° for saturated brine, about 26.4 % sodium chloride by weight at 15.6 °C / 60 °F) is a general convention."
  - "Checked by hand and with an independent Python calculation (salt for 5 % brine both ways, strength of 60 g in 940 g, salinometer degrees, equilibrium salt, dry cure, cure grams for a ppm and back)."
  - "No salt or nitrite levels are recommended. The example amounts are made up to show the arithmetic; the nitrite target and the cure's nitrite % are always entered by the user."
flow:
  - { icon: pencil, label: "Weights" }
  - { icon: percent, label: "Salt %" }
  - { icon: calculator, label: "Grams" }
  - { icon: download, label: "Download" }
---

## What it does

Brining, fermenting and curing all come down to weighing salt as a percentage of something. The trouble is that recipes mean different things by "a 5 % brine", and curing salt needs care. This page does the arithmetic in five small calculators:

- **Make a brine**: grams of salt for a given weight of water and strength. "% of salt + water" is the strength of the finished brine (salt ÷ whole brine); "% of the water only" is salt ÷ water, which many recipes use and which gives a slightly weaker brine.
- **Check a brine**: the strength of a brine you made, both ways, and in **salinometer degrees** (°SAL), where 100° is saturated brine (about 26.4 % salt by weight at 15.6 °C). You can also turn a salinometer reading into a percentage.
- **Vegetable ferment (equilibrium brine)**: salt as a percentage of the vegetables plus any water, because the salt evens out across both.
- **Dry cure**: salt and sugar as percentages of the meat's weight.
- **Curing salt (nitrite)**: grams of cure for a nitrite target **you** enter, from the sodium nitrite percentage on your cure's label, or the level a planned amount of cure gives.

## How to use it

Weigh everything in grams; 1 ml of water is about 1 g. Fill in the boxes of the calculator you need; results update as you type. Download all results as CSV, or as an image, PDF or Word file.

## Worked example

Press **Use the example** (made-up amounts that show the arithmetic, not recommendations).

- 1000 g of water at 5 % of the brine needs **52.6 g salt**: 52.6 ÷ (52.6 + 1000) = 5 %. That brine is 5.26 % of the water and 18.9 °SAL. At "5 % of the water only" it would be 50 g.
- 60 g of salt in 940 g of water is **6.00 % of the brine**, 6.38 % of the water and 22.7 °SAL.
- 1000 g of vegetables and 500 g of water at 2 % need **30.0 g salt**, which is 1.96 % of everything once the salt is in.
- 2000 g of meat at 2.5 % salt and 1 % sugar needs **50.0 g salt and 20.0 g sugar**.

For the curing salt, only the maths is shown: with numbers chosen just to show the sums, 2000 g of meat, a cure labelled 10 % nitrite and a target of 100 ppm, the page gives 2.00 g cure (200 mg sodium nitrite). 3 g of that cure would give 150 ppm.

## Safety

Sodium nitrite is poisonous in excess, and too little can let dangerous bacteria grow. This page never suggests an amount. Take the target from a tested recipe and the rules where you live, check the official source, and weigh cure on a scale that reads to 0.1 g or better.

## FAQ

**Why are there two ways to give a brine %?** Both are used. The page shows each so you can match your recipe.

**What about a wet cure or injection?** Then the nitrite in the meat depends on how much brine it takes up, which this page does not model.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
