---
name: Enzyme activity lab
num: 1131
shelf: learn
code: L65
section: school-biology
title: "Enzyme activity lab: temperature, pH, substrate and inhibitors with a starch-iodine spot test"
summary: "Digest starch with amylase or egg white with pepsin and trypsin, and time it with a virtual spot tile. Change temperature, pH, substrate and inhibitors, record your runs and see rate graphs. For Class 10 and 11 biology."
status: live
ads: false
order: 1131
icon: flask
works: offline
updated: 2026-11-09
related: [enzyme-kinetics-fitter, photosynthesis-lab, buffer-recipe-calculator]
sources:
  - "Q10 of 2 for the temperature rise, a sigmoid for heat denaturation, a bell-shaped pH curve and the Michaelis-Menten equation with competitive and non-competitive inhibition: standard textbook ideas, written by fibub."
  - "The enzymes' numbers (top rate 100, Km 2 mM, best pH 6.8, 2 and 8, half-denatured at 44 °C) are made-up round values for teaching, not measurements of real enzymes."
  - "Rates were checked in the tests against a separate Python version of the model, and the best temperature against a brute-force Python grid search."
  - "Drawings are fibub's own simple shapes. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Set up" }
  - { icon: eye, label: "Spot test" }
  - { icon: chart, label: "Graph" }
  - { icon: check, label: "Check" }
---

## What it does

Enzymes are proteins that speed up reactions in living things without being used up. Each one has an **active site** with a shape that fits its substrate, like a key in a lock. This lab lets you run the classic school practical on screen: mix an enzyme with its food, take a drop every half minute, and see when the food has gone.

- **Amylase** (in saliva) breaks starch into sugar. A drop of the mixture on a spot tile of iodine turns blue-black while starch is left and stays orange-brown once it has all been digested.
- **Pepsin** (in the stomach) and **trypsin** (in the small intestine) break down protein. Here a cloudy egg-white mixture turns clear as the protein is digested.

Change the temperature, the pH, and (in Class 11) the amount of substrate and an inhibitor. The ringed drop on the tile shows the first time the food has gone; the rate is 1 ÷ that time. If you want to fit real data from your own practical, use the [[enzyme-kinetics-fitter]]; to see a whole plant's enzymes at work, try the [[photosynthesis-lab]], and to make the buffer that holds a pH steady, the [[buffer-recipe-calculator|buffer recipe calculator]].

## Using it

1. Pick a **Level**. Class 10 keeps the substrate fixed and shows rate = 1 ÷ time. Class 11 adds substrate concentration, inhibitors, and the Michaelis-Menten numbers Vmax and Km.
2. Pick an **enzyme**, then move the **temperature** and **pH** sliders.
3. Tick **Boil the enzyme first** to see what denaturing does, even after cooling.
4. Press **Record this run** after each change. The table builds up like a lab book, and you can download it as a CSV file for a spreadsheet.
5. The **rate graph** shows the rate across temperature, pH (all three enzymes together) or substrate concentration, with a dot for your current setting.

## What the settings do

- **Temperature:** warming makes molecules move faster and meet more often, so the rate roughly doubles every 10 °C. Above about 40 °C in this model the enzyme starts to lose its shape (denatures) and the rate falls quickly. This is why the curve rises slowly and falls steeply.
- **pH:** every enzyme has its own best pH. Too acidic or too alkaline and the active site changes shape. Pepsin works in the acid stomach (pH about 2), amylase in neutral saliva (6.8), trypsin in the alkaline small intestine (8).
- **Substrate (Class 11):** more substrate means more collisions, until every active site is busy. The rate then levels off at **Vmax**. **Km** is the substrate concentration that gives half of Vmax.
- **Inhibitors (Class 11):** a competitive inhibitor looks like the substrate and blocks the active site, so Km goes up but enough substrate still reaches the same Vmax. A non-competitive inhibitor binds elsewhere, so Vmax falls and Km stays the same.

## Worked example

Amylase at 37 °C and pH 6.8 with 10 mM starch: the temperature factor is about 0.94 and the pH factor 1, so Vmax is about 94.3 units a minute. With Km = 2 mM, v = 94.3 × 10 ÷ (2 + 10) = 78.6 units a minute. The starch drops below 5 % of its start after 3.8 minutes, so the first brown drop on the tile is at 4 minutes, and the rate is 1 ÷ 4 = 0.25 per minute. At 60 °C the same mixture is still blue-black after 20 minutes.

## Where this fits in school

Class 10 science (life processes) introduces digestive enzymes: amylase in saliva, pepsin in the stomach and trypsin from the pancreas. Class 11 biology (biomolecules) covers how enzymes work, the effect of temperature, pH and substrate concentration, and competitive inhibition. This page is an independent learning aid. It is not made by or connected with NCERT, and it does not copy any textbook.

## Questions

**Why does boiling stop the enzyme for good?** Heat breaks the weak bonds that hold the protein's shape. Once the active site has lost its shape, cooling does not fold it back, so the substrate no longer fits.

**Why is cold different from hot?** In the cold the enzyme is not damaged; it is just slow because molecules move less. Warm it up and it works again.

**Are these real enzyme numbers?** No. The values are round numbers chosen so the graphs look like the ones in your book. Real times depend on how much enzyme you use, the starch, and the temperature of the tile.

**Is anything saved?** No. Your runs stay on this page until you leave it.
