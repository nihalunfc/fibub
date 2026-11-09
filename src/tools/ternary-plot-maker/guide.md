---
name: Ternary and spider plot maker
num: 124
shelf: science
section: mineralogy-and-petrology
title: "Ternary diagram and spider diagram maker: plot three-part compositions and normalised element patterns online"
summary: "Plot any three-part composition (QFL sandstones, soil texture, mineral end-members, alloys) on a ternary diagram with groups, grid lines and labels, and draw normalised multi-element spider diagrams with Eu/Eu* and (La/Yb)N. Download as PNG, PDF or Word."
status: live
ads: true
order: 1
icon: chart
works: offline
updated: 2026-11-08
related: [mixing-model-calculator, radiometric-age-calculator, isotope-delta-converter, plot-maker]
sources:
  - "Ternary plotting and closure (scaling each row to 100 %): standard geometry and compositional data practice, written by fibub."
  - "Eu/Eu* = Eu_N ÷ √(Sm_N × Gd_N): the usual geometric-mean definition of the europium anomaly, written from the formula."
  - "No normalising tables (chondrite, primitive mantle, MORB) are bundled. Users add the reference values from the source they cite."
  - "Example data, including the \"Reference (made up)\" row, are invented by fibub for illustration."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sliders, label: "Pick corners" }
  - { icon: chart, label: "Plot" }
  - { icon: download, label: "Download" }
---

## What it does

Many things in science are **parts of a whole**. A sandstone is so much quartz, feldspar and rock fragments. A soil is sand, silt and clay. A feldspar is a blend of three end-members. When only the proportions matter, a **ternary diagram** shows each sample as one point inside a triangle, with each corner standing for 100 % of one part.

The second card draws a **spider diagram**: many elements along the bottom, each sample's values divided by a reference composition and plotted on a log scale. Geochemists use it for rare earth elements and trace element patterns, because the shape of the line tells a story about where a rock came from.

To unmix samples into their end members, use the [[mixing-model-calculator]]; for water chemistry, the [[piper-diagram]].

## How to use it

1. Paste or open a table with a header row. The first column is the sample name. Any three number columns can go on the corners, in any unit: counts, percent, ppm or moles. Each row is scaled so its three values add to 100 %.
2. Pick which column sits at the **top**, **bottom left** and **bottom right**.
3. If you have a text column such as site or rock type, choose it under **Colour by**. Each group gets its own colour and marker, and its centre is listed in the table.
4. Choose grid lines every 10, 20 or 25 %, and whether to label points.
5. For a spider diagram, paste elements as columns in the order you want them plotted and samples as rows. Add one row with the reference values you normalise to, taken from the source you cite, and pick it in **Normalise by the row**.

## What you get

- The triangle with grid, tick values and your points, plus a table of each group's centre.
- The centre is the **geometric mean** of the rows, closed to 100 %. For compositions this is a better middle than the plain average, because proportions cannot go below zero.
- A spider diagram with one line per sample. Missing or zero values leave a gap.
- When Eu, Sm and Gd are present, the **Eu/Eu\*** anomaly. When La and Yb are present, **(La/Yb)N**, which shows how steep the pattern is.

## Worked example

All numbers are made up. Four sands from River A average about 72 % quartz, and four from River B about 40 %. The tool puts the River A centre at **71.6 % quartz, 16.5 % feldspar and 11.9 % rock fragments**, and River B at 39.5 / 34.2 / 26.3 %. The two clusters sit well apart on the plot.

In the spider example the made-up granite falls from 100 times the reference at La to 10 times at Lu, with a dip at Eu. The tool gives **Eu/Eu\* 0.60** and **(La/Yb)N 8.4**. The made-up basalt is flat at about 20 times the reference, with Eu/Eu\* 0.99.

## Good to know

- No classification fields (such as the sandstone or soil texture names) are drawn, because those boundaries come from specific published schemes. Note the corners you used and add the fields from your own reference if you need them.
- Real reference values differ between sources. Always say which one you used.
- Rows with a missing or negative value in the chosen columns are skipped and counted.

## FAQ

**Can I plot more than three components?** Choose the three that matter, or add some together in your spreadsheet first (for example quartz plus chert). The plot always shows three.

**Why a log scale on the spider diagram?** Element abundances span several orders of magnitude, and a log scale shows the shape of the pattern evenly.
