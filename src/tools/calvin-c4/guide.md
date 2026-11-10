---
name: Calvin and C4
num: 1397
shelf: learn
code: L239
section: school-biology
title: "Calvin and C4"
summary: "Count what the Calvin cycle uses and makes for any number of CO₂ fixed: 3-PGA, G3P, ATP, NADPH and glucose. Then compare C3 and C4 plants as the leaf warms or CO₂ changes, with photorespiration, and find where C4 becomes the cheaper way to fix carbon. Class 11, with quick questions."
status: live
ads: false
order: 1397
icon: calculator
works: offline
updated: 2026-11-09
related: [z-scheme, photosynthesis-lab, pigment-spectra]
sources:
  - "Calvin cycle bookkeeping (3 ATP and 2 NADPH per CO₂; 18 ATP and 12 NADPH per glucose), the C4 pathway with PEP carboxylase, oxaloacetate, Kranz anatomy and 2 extra ATP per CO₂, and photorespiration by RuBisCO: general plant biology."
  - "Photorespiration costs (½ CO₂ lost and 3.5 ATP + 2 NADPH per oxygenation, with oxygenations per carboxylation = 2Γ*/C) follow the commonly used biochemical model of leaf photosynthesis. Γ* = 40 ppm × 1.05^(T − 25), and CO₂ at RuBisCO of 0.7 × air (C3) and 10 × air (C4), are rounded made-up teaching values, not measurements."
  - "Checked in the tests by hand: at 25 °C and 420 ppm the C3 leaf needs (3 + 3.5 × 0.2721)/(1 − 0.1361) = 4.575 ATP per CO₂ kept and loses 13.6 % of its carbon; the C4 leaf needs 5.115; the two cost the same at 30.4 °C. Teaching model only. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "CO₂ fixed" }
  - { icon: orbit, label: "Cycle" }
  - { icon: chart, label: "C3 vs C4" }
  - { icon: check, label: "Check" }
---

## What it does

The light reactions make ATP and NADPH; the **Calvin cycle** spends them to turn carbon dioxide into sugar. The page's first part draws the cycle in its three stages and does the bookkeeping for any number of CO₂ molecules:

1. **Carboxylation**: the enzyme **RuBisCO** joins each CO₂ to a 5-carbon sugar, **RuBP**, which splits into two 3-carbon **3-PGA**.
2. **Reduction**: 3-PGA is turned into the sugar **G3P**, using ATP and NADPH.
3. **Regeneration**: most of the G3P is rebuilt into RuBP, using more ATP, so the cycle can turn again. Only one G3P in six leaves to make glucose and other food.

The second part compares **C3 plants** (like wheat and rice) with **C4 plants** (like maize and sugarcane). RuBisCO sometimes grabs O₂ instead of CO₂, which wastes carbon and energy: **photorespiration**. It gets worse as leaves warm up. C4 plants first catch CO₂ with another enzyme, **PEP carboxylase**, and pump it into the bundle sheath cells, so RuBisCO there meets plenty of CO₂. That costs 2 extra ATP per CO₂ but almost stops photorespiration. Slide the temperature and CO₂ and see which way is cheaper.

It fits Class 11 Biology (photosynthesis in higher plants: the Calvin cycle, the C4 pathway and photorespiration). See where the ATP and NADPH come from in [[z-scheme]], and how light, CO₂ and temperature limit the whole process in [[photosynthesis-lab]].

## How to use it

1. Slide **CO₂ molecules fixed** from 1 to 18. The picture and the numbers show RuBP used, 3-PGA made, ATP and NADPH used, G3P leaving and glucose made.
2. In the comparer, slide **Leaf temperature** and **CO₂ in the air**. The graph shows the ATP needed for each CO₂ the leaf keeps, for both kinds of plant, with dots at your temperature; the dashed line is where they cost the same.
3. Read the table: first product, first enzyme, CO₂ at RuBisCO, carbon lost, ATP and NADPH per CO₂.

## Worked example

Fix **6 CO₂**: 6 RuBP take them up and make **12 3-PGA**. Reducing those to 12 G3P uses **12 ATP and 12 NADPH**; rebuilding 6 RuBP from 10 of the G3P uses **6 ATP**. In total **18 ATP and 12 NADPH**, and the 2 G3P that leave make **1 glucose**.

In the comparer at **25 °C and 420 ppm**, the C3 leaf has 294 ppm CO₂ at RuBisCO. In the model Γ* is 40 ppm, so RuBisCO grabs 2 × 40/294 = 0.272 O₂ for every CO₂ and the leaf loses **13.6 %** of the carbon it fixed. Each CO₂ it keeps costs (3 + 3.5 × 0.272)/(1 − 0.136) = **4.57 ATP**. The C4 leaf costs **5.12 ATP**, so the C3 plant is cheaper. Warm the leaf to **40 °C**: the C3 leaf now loses 28.3 % and needs 6.94 ATP, while the C4 leaf needs 5.24. The two cost the same at about **30.4 °C**; at 800 ppm CO₂ that moves up to about 43.6 °C.

## Tips

- "C3" and "C4" are named after the first stable product: 3-PGA has 3 carbons, oxaloacetate has 4.
- Photorespiration needs light and O₂ but makes no ATP and no sugar; it is wasteful, which is why C4 plants do well in hot, bright places.
- The cycle never runs out of RuBP because it rebuilds it; that is why so much G3P goes back round.

## FAQ

**Is this how much a real leaf spends?** Roughly, for the Calvin cycle counts. The photorespiration part uses rounded teaching numbers, so the exact crossover temperature is only a guide.

**Why does higher CO₂ help C3 plants?** More CO₂ at RuBisCO means it grabs O₂ less often, so less carbon is lost.

**What is Kranz anatomy?** In C4 leaves the bundle sheath cells form a ring (a "wreath", Kranz in German) around each vein. The Calvin cycle runs there, behind the mesophyll cells that catch CO₂ first.
