---
title: "Riparian willow carbon uptake from DBH allometric equations"
summary: "A 2025 study fitted DBH equations to 33 dug-up willows along Korean rivers and found the stands take up about 12 t of carbon per hectare a year. Here is how to try the method."
tools: [tree-carbon, field-sampling-planner]
updated: 2026-11-10
sources:
  - "Lim BS et al. (2025), Forests 16(8): 1225, CC BY 4.0, the paper described here."
  - "Power-law allometry (biomass = a × DBH^b), root-to-shoot ratios, a carbon fraction near 0.5 and CO₂ = carbon × 44/12: standard forest inventory methods."
paper:
  title: "Derivation and Application of Allometric Equations to Quantify the Net Primary Productivity (NPP) of the Salix pierotii Miq. Community as a Representative Riparian Vegetation Type"
  authors: "Lim BS, Seok J, Joo SJ, Lim JC, Lee CS"
  journal: "Forests"
  year: 2025
  doi: "10.3390/f16081225"
  url: "https://www.mdpi.com/1999-4907/16/8/1225"
  licence: "CC BY 4.0"
  reviewed: true
---

Willows that crowd riverbanks are easy to overlook in carbon accounts, which usually focus on upland forests. A 2025 study in the journal Forests dug up whole willow trees along three Korean rivers, weighed every part, and built equations that predict a tree's dry weight from its trunk width alone. Applied to dense stands, those equations say the willows add roughly 12 tonnes of carbon per hectare each year. You can run the same kind of sum on your own trees with the [[tree-carbon]] calculator, and plan where to put the plots with the [[field-sampling-planner]].

## What they found

The team studied *Salix pierotii*, a willow that dominates many riverbanks in Korea. From 33 harvested trees they fitted equations of the form biomass = a × DBH^b, where DBH is the trunk diameter at breast height (1.3 m up). The whole-tree equations fitted very well, with R² values from about 0.94 to 0.99 across the three sites. Equations for leaves alone fitted less well.

Using stand counts of about 2,500 to 2,900 trees per hectare, the paper reports a net primary productivity (NPP: the new plant matter made each year) of 11.87 t C per hectare per year on average, with site values from about 5 to 19. A second method, measuring growth rings in trunk slices, gave a higher figure of about 15.7. The authors judge the equation method the better fit for these stands.

## Why it matters

Riverside woodland is often cleared for flood control or farming. If it stores and gains carbon quickly, that is a reason to weigh its value before removing it. Species-specific equations also matter because a general forest equation can be far off for a fast-growing, many-stemmed willow. With a willow equation, others can estimate carbon from a tape measure without cutting more trees.

## How they did it

1. They chose three river sites where this willow is the main tree.
2. They measured the DBH of 33 trees of many sizes, then dug them up and split them into stem, branches, leaves and roots.
3. They weighed each part fresh, dried samples in an oven at 80 °C and worked out dry weights.
4. They fitted the power-law equations on a log–log scale, for each site and for all sites pooled, and checked them with R² and error measures.
5. In two 100 m² permanent plots they counted trees and followed trunk growth to get the yearly gain per tree, then multiplied by the number of trees per hectare.
6. For comparison, they cut trunk discs at set heights, read the growth rings and turned stem volume into biomass with wood density, an expansion factor for branches and leaves, and a root share. In that method the paper reports a mean root-to-above-ground ratio of about 0.24.
7. Carbon was taken as a fixed fraction of dry biomass, following IPCC guidance.

## Check it yourself with fibub

The [[tree-carbon]] page takes one row per tree: an optional name, the DBH now, the height now, and, if you have them, the DBH and height at an earlier visit. Choose the equation **Biomass = a × DBH^b**, which uses DBH only, so the height columns can be left empty.

Here is a worked example with **our own made-up equation and trees**. The coefficients a = 0.12 and b = 2.3 are invented for illustration and are not the paper's willow equation.

| Tree | DBH now (cm) | DBH a year ago (cm) |
|---|---|---|
| W1 | 8 | 7.4 |
| W2 | 10 | 9.3 |
| W3 | 12 | 11.2 |
| W4 | 14 | 13.1 |
| W5 | 16 | 15.0 |

1. Paste the rows as name, DBH now, a blank height, DBH before, a blank height.
2. Set **Years between measurements** to 1.
3. Pick a × DBH^b and type a = 0.12 and b = 2.3.
4. Set the root-to-shoot ratio to 0.25 and the carbon fraction to 0.47.
5. Read the totals. The five trees hold 246 kg of dry biomass (197 kg above ground, 49 kg in roots), which is 116 kg of carbon or **424 kg of CO₂e**. Over the year they took up **61.3 kg of CO₂e**.
6. Open the table of every tree. W2, for example, went from 20.3 kg to 23.9 kg of above-ground biomass, a gain of 7.9 kg of CO₂e once roots and carbon are counted.

To scale up as the paper does, take the mean uptake per tree, 61.3 ÷ 5 = 12.3 kg CO₂e, and multiply by a stand density. With our own round figure of 2,500 trees per hectare, that is about 30.6 t CO₂e per hectare per year, or 8.4 t of carbon (CO₂e × 12/44). This counts wood and roots only. The paper's NPP also includes new leaves each year, so expect a fair comparison to need that extra piece.

Note how strongly b drives the answer: a tree twice as wide holds 2^2.3, about 4.9 times, as much biomass.

## The fine print

- The equations come from 33 trees at three sites of one species. They should not be used for other willows or for trees bigger than those harvested.
- Stand density came from two plots, and the per-hectare figures depend on it directly.
- The two methods gave different NPP, and the paper itself reports slightly different numbers for the ring method in different sections.
- The carbon fraction is a standard factor, not measured on these trees.
- Our worked example is invented. Read the paper for its actual equations before using them.
- This is general science education, not a carbon credit method.
