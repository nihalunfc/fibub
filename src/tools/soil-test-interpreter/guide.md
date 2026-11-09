---
name: Soil test interpreter
num: 382
shelf: science
section: agronomy-and-soil-science
title: "Soil test interpreter: lime requirement to raise pH, and nutrient results against your lab's ranges"
summary: "Work out how much lime raises your soil's pH, from CEC and base saturation, from a buffer capacity, or from your lab's lime factor, scaled to your depth and to your lime's neutralising value and fineness. Then see which nutrients are low, in range or high against the ranges you type."
status: live
ads: true
order: 382
icon: flask
works: offline
updated: 2026-11-09
related: [fertiliser-blend-calculator, irrigation-scheduler, soil-texture-triangle, seeding-rate-calculator, concentration-converter, field-trial-designer]
sources:
  - "Lime from a charge balance: acidity to neutralise (cmol(+)/kg) × soil mass of the layer (depth × bulk density) × 50.04 g CaCO3 per mole of charge (CaCO3 + 2H+ → Ca2+ + CO2 + H2O; standard atomic weights). Effective calcium carbonate equivalent = CCE × fineness efficiency. General soil chemistry, as in standard soil science textbooks."
  - "No agency lime tables, buffer-pH equations or nutrient sufficiency ranges are bundled: users type their own lime factor and their lab's ranges."
  - "Checked against an independent Python calculation (moles of H+ in the layer) and hand-worked examples in the tests. The example soil, lime and ranges are made up and rounded."
flow:
  - { icon: flask, label: "Soil pH" }
  - { icon: calculator, label: "Lime" }
  - { icon: table, label: "Nutrients" }
  - { icon: check, label: "Ratings" }
---

## What it does

A soil test report gives a pH and a list of nutrient results. This page helps you read it in two parts.

**Lime.** Acid soils hold acidity on their clay and organic matter. Lime (calcium carbonate, or a product compared with it) neutralises that acidity: one mole of CaCO₃ takes up two moles of H⁺, so 50.04 g of CaCO₃ neutralises one mole of charge. The page works out how much acidity there is to neutralise in the layer you will mix lime into, turns it into kg of pure CaCO₃ per hectare, and then into tonnes of **your** lime from its neutralising value and fineness.

**Nutrients.** Type each result with the bottom and top of the range your lab or adviser gives, and the page marks it low, in range or high, with a picture of where it sits.

Turn the results into a fertiliser mix with the [[fertiliser-blend-calculator]], and plan watering with the [[irrigation-scheduler]].

## Three ways to work out lime

- **CEC and base saturation**: the charge to neutralise is CEC × (target − present base saturation) ÷ 100, in cmol(+)/kg.
- **pH and buffer capacity**: the buffer capacity (cmol(+)/kg per pH unit, from a titration or your lab) × the pH rise.
- **Your lab's lime factor**: type the tonnes of CaCO₃ per hectare that raise pH by one unit for the depth your lab states; it is scaled to your depth.

The soil mass of the layer is depth × bulk density: 15 cm of soil at 1.3 g/cm³ weighs 1,950 t per hectare. Deeper mixing needs more lime.

## Your lime

**CCE** (calcium carbonate equivalent) is the neutralising value compared with pure calcium carbonate. **Fineness efficiency** is the share fine enough to react in the time you care about. Their product is the **ECCE**. Moisture adds weight that does nothing, so a wet lime needs more tonnes.

## Worked example

The page opens with a made-up soil: CEC 15 cmol(+)/kg, base saturation 60 % and a target of 80 %, limed to 15 cm at a bulk density of 1.3 g/cm³. The charge to neutralise is 3 cmol(+)/kg in 1,950 t/ha of soil, which needs 2,928 kg/ha of pure CaCO₃. The lime has a CCE of 95 % and a fineness efficiency of 85 %, an ECCE of 80.75 %, so you **spread 3.63 t/ha (1.62 tons/acre)**: 29.00 t for the 8 ha field.

In the nutrient part, the made-up results show 3 of 6 in range; phosphorus (12 against 20 to 40 mg/kg: "Low, 60 % of the bottom"), magnesium and organic matter are low.

## FAQ

**Why not use my lab's buffer pH?** Buffer pH methods turn a buffer reading into lime with equations calibrated by each lab or agency for its own soils. Use the lime factor or recommendation your lab gives with that method; type it as the lime factor here to scale it to your depth and lime.

**Where do the ranges come from?** From your lab report or adviser. Ranges depend on the extraction method (for example Olsen or Mehlich-3 for phosphorus), the crop and the region, so the example ranges are only there to show how the page works.

**Can it lower pH?** No; this page only works out lime to raise pH.

**Is my soil test uploaded?** No. Everything runs in your browser and works offline.
