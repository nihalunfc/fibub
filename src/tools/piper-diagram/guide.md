---
name: Piper diagram maker
num: 125
shelf: science
section: hydrogeology
title: "Piper diagram and Stiff diagram maker: water chemistry plots, meq/L conversion, ion balance and water type"
summary: "Paste or open major-ion analyses in mg/L, meq/L or mmol/L. Get a Piper diagram with groups, Stiff diagrams, the ion balance error for each sample, the water type (such as Ca-HCO₃ or Na-Cl), the diamond field and total hardness. Download as PNG, PDF or Word."
status: live
ads: true
order: 1
icon: chart
works: offline
updated: 2026-11-08
related: [ternary-plot-maker, mixing-model-calculator, isotope-delta-converter, solution-calculator]
sources:
  - "Piper and Stiff diagram layouts, the meq/L conversion and the ion balance error: standard hydrochemistry methods, written by fibub from the definitions."
  - "Molar masses from the standard atomic weights of the elements (general constants)."
  - "The 20 % water-type rule and the four diamond fields are common rules of thumb, stated on the page; other schemes exist."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: table, label: "Water data" }
  - { icon: calculator, label: "To meq/L" }
  - { icon: chart, label: "Piper plot" }
  - { icon: check, label: "Water type" }
---

## What it does

Every groundwater, river or spring sample carries a handful of **major ions**: calcium, magnesium, sodium and potassium on the positive side, and bicarbonate, sulfate and chloride on the negative side. Their balance tells you a lot about where the water has been. Rain that has soaked through limestone is rich in calcium and bicarbonate. Old, deep water or water near the sea is often rich in sodium and chloride.

A **Piper diagram** shows many samples at once. Each sample appears three times: once in the cation triangle, once in the anion triangle, and once in the diamond above, where the two are combined. Samples of the same kind of water cluster together. A **Stiff diagram** turns each sample into a small shape, so you can compare waters at a glance.

## How to use it

1. Paste or open a table with a header row. Name the ion columns Ca, Mg, Na, K, HCO3, CO3, SO4 and Cl (Ca2+, Calcium or Sulfate also work). K, CO3 and NO3 are optional.
2. If you have alkalinity instead of bicarbonate, name the column Alk. In mg/L it is read as mg/L of CaCO₃.
3. Choose the unit: mg/L, meq/L or mmol/L.
4. Pick a text column (such as site or aquifer) under **Colour by** to colour the groups.

Blank cells and values like "<0.1" (below detection) count as zero.

## What you get

- **meq/L** for every ion: mg/L × charge ÷ molar mass. Piper plots use these, because charges, not masses, balance.
- The **ion balance error**: (cations − anions) ÷ (cations + anions) × 100. Within about ±5 % is usually a sound analysis. A larger error is flagged, and it often means a missing ion or a units mistake.
- The **water type**, naming the cations and then the anions that hold at least 20 % of their side, largest first, such as Ca-Mg-HCO₃.
- The **diamond field**: one of four classic fields split at 50 %.
- **Total hardness** as mg/L of CaCO₃.
- Stiff diagrams for up to 24 samples, on one shared scale.

## Worked example

All values are made up. Sample W1 has Ca 60.1, Mg 14.6, Na 18.4, K 1.95, HCO₃ 244, SO₄ 28.8 and Cl 17.7 mg/L. That is 5.05 meq/L of cations and 5.10 of anions, an ion balance of **−0.5 %**. Calcium and magnesium dominate the cations and bicarbonate the anions, so the tool calls it **Ca-Mg-HCO₃** water with a hardness of **210 mg/L** as CaCO₃.

Deep sample D1 has 207 mg/L Na and 319 mg/L Cl. It comes out as **Na-Cl** water and sits at the right-hand corner of the diamond, far from the shallow wells.

## Good to know

- Use complete analyses. If a major ion was not measured, the balance and the plot will be off.
- The 20 % rule and the 50 % fields are simple conventions. Say which you used when you report a water type.

## FAQ

**Why is K added to Na?** In the classic Piper diagram they share a corner, because potassium is usually small.

**Can I plot nitrate?** It counts in the ion balance and the water type, but the Piper triangles only have three anion corners, so it is left off the plot.
