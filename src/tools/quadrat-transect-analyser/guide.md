---
name: Quadrat and transect analyser
num: 302
shelf: science
section: ecology
title: "Quadrat and line transect calculator: density, frequency, cover and importance value per species"
summary: "Paste quadrat counts and cover, or line-intercept transect measurements, and get density, frequency, cover, relative values and the importance value for every species, with a chart and downloads. Runs in your browser."
status: live
ads: true
order: 302
icon: table
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, plot-maker, tree-carbon, community-ordination, coral-cover-calculator, forest-inventory-summary, distance-sampling]
sources:
  - "Methods: J. T. Curtis and R. P. McIntosh (1951), importance value; R. H. Canfield (1941), line-intercept cover; C. W. Strong (1966), line-intercept density; textbook definitions of density, frequency and cover (e.g. C. J. Krebs, Ecological Methodology, 1999). Formulas only; no tables are copied."
  - "Checked in the tests against an independent calculation of the same data with pandas 2.x."
  - "The examples are made up."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sigma, label: "Per species" }
  - { icon: chart, label: "Importance" }
  - { icon: download, label: "Report" }
---

## What it does

Quadrats and transects are the everyday way to describe vegetation, rocky shores and other places where organisms stay put. This tool turns your field sheet into the standard summary for each species:

- **Density**: individuals per square metre (and per hectare).
- **Frequency**: the share of quadrats or transects in which the species turned up.
- **Cover**: how much of the ground it covers, in %.
- **Relative density, relative frequency and relative cover**: each species' share of the total for all species, in %.
- **Importance value**: the sum of the relative values, out of 300 when all three are measured (Curtis and McIntosh). It ranks species by how much they dominate the community.

Turn the species counts into diversity scores with the [[biodiversity-indices|biodiversity indices calculator]], and compare whole sites with the [[community-ordination|community ordination tool]].

## How to use it

1. Choose **Quadrats** or **Line intercept**.
2. For quadrats, paste one row per species per quadrat: **quadrat name, species, count, % cover**. Leave the count or the cover blank if you did not record it; the tool then works with what you have, and the importance value runs to 200.
3. Enter the **quadrat area** in square metres (a 50 × 50 cm quadrat is 0.25 m²).
4. For line intercept, paste one row per plant that touches the line: **transect name, species, length of line it covers, its widest extent at right angles to the line** (both in metres). The width is optional; it is needed only for density. Enter the **length of each transect**.
5. **Number of quadrats** (or transects) can stay blank. If some quadrats held nothing, enter the full number so they count in density and frequency.
6. Download the table as CSV, or the full report as an image, PDF or Word file. You can also open a CSV or Excel file.

## How each number is worked out

- Quadrats: density = all individuals ÷ (number of quadrats × quadrat area); frequency = quadrats with the species ÷ all quadrats; cover = sum of the % cover ÷ all quadrats (so empty quadrats count as 0 %).
- Line intercept (Canfield): cover = total length of line under the species ÷ total line length. Density (Strong): each plant counts 1 ÷ its width, divided by the total line length, because wide plants are more likely to be crossed by a line.
- A species counts as present in a quadrat if its count or its cover is above zero.

## Worked example

The quadrat example is a made-up lawn survey with eight 0.25 m² quadrats. The page shows **5 species in 8 quadrats; most important: White clover (129.3 of 300)**. White clover had 64 individuals, so its density is 64 ÷ 2 m² = 32 per m²; it was in 5 of 8 quadrats (frequency 62.5 %) with a mean cover of 21.25 %. Its relative density is 52.03 %, relative frequency 25 % and relative cover 52.31 %, which add up to 129.3. Total density is 61.50 per m² (615000 per hectare) and total cover 40.63 %.

The line-intercept example is three made-up 20 m transects through shrubland. **Sagebrush** comes first with an importance value of 141.1 of 300: it was on all three lines and covers 9.667 % of the line. Rabbitbrush has the highest relative density (46.32 %) because its plants are narrow, even though it covers less ground. Total line cover is 16.17 %.

## Tips

- Use the same quadrat size throughout a survey, and enough quadrats that new species stop appearing.
- Cover estimates for different species can add up to more than 100 % where plants overlap in layers.
- Importance values compare species within one survey; they are not meant for comparing different sites with different species lists.

## Frequently asked questions

**Can I use percentage cover classes (Braun-Blanquet or Domin)?** Convert each class to its midpoint percentage first, then paste the numbers.

**Why does frequency depend on quadrat size?** Larger quadrats are more likely to catch a species, so frequency is only comparable between surveys with the same quadrat size.

**Is my data sent anywhere?** No. Everything is worked out in your browser, and the page keeps working offline once loaded.
