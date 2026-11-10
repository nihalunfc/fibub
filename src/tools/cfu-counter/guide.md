---
name: CFU counter
num: 195
shelf: science
section: microbiology
title: "CFU counter"
summary: "Count bacterial or yeast colonies on a photo of an agar plate (found automatically, touching colonies split, then fixed by tapping) and turn the counts from your dilution plates into CFU per mL or per g, with an exact Poisson confidence interval and a check that the plates agree. The photo stays in your browser."
status: live
ads: false
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [hemocytometer, solution-calculator, media-recipe-scaler, cell-doubling-time, uncertainty-calculator, growth-curve-od600, counting-statistics, tcid50-calculator]
sources:
  - "The dilution maths (CFU = all colonies on the countable plates ÷ the total volume of sample they received), the exact Poisson interval and the chi-square agreement test are general statistics, written by fibub and checked in the tests against an independent Python script and textbook Poisson limits."
  - "Colony finding (local background, threshold, connected groups, distance-map splitting) is written by fibub; the groups and distance maps are checked against NumPy and brute force on random images."
  - "The example plate is drawn by the page with exactly 142 colonies, and the other plate counts (155, 17 and TNTC) are made up. A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: camera, label: "Plate photo" }
  - { icon: target, label: "Colonies" }
  - { icon: table, label: "Dilutions" }
  - { icon: calculator, label: "CFU/mL" }
---

## What it does

A viable count tells you how many live bacteria (or yeasts) were in a sample: you dilute it in steps, spread a known volume of each dilution on agar, and count the colonies that grow. Each colony grew from one colony-forming unit (CFU). This page does both halves of the job in your browser:

- **Count a plate from a photo.** It evens out the light across the agar, marks every spot that stands out from the nearby agar by more than a threshold, joins the pixels into blobs, ignores specks smaller than a colony, and splits blobs of touching colonies where the distance map has separate peaks. Blue rings show what it found. Tap a missed colony to add it (green), or tap a ring to remove it (red cross).
- **Work out CFU per mL or per g.** Type one line per plate: dilution, volume plated and colonies. Plates inside the countable range (30 to 300 by default) are combined as a weighted mean: all their colonies divided by the total amount of sample they received. A plate that got more sample counts for more, which is the right weighting for counts.
- **Show how sure the number is.** The interval is the exact Poisson interval for the total count. A chi-square test says whether the plates agree as well as counting alone allows; if not, look for a pipetting or mixing problem.

Plan the dilutions with the [[solution-calculator]], and follow the culture over time with the [[growth-curve-od600|growth curve calculator]].

## How to use it

1. **Plate photo.** Take the photo from straight above with the whole dish in view and no glare. Open it, then tap *Set the plate edge* and three points on the rim if the dashed circle is not on the dish.
2. **Colonies.** Check the rings. Open *Colony finding settings* to change the threshold, the smallest and largest colony size in mm (the dish diameter sets the scale), or how much of the rim is left out.
3. **Dilutions.** Type the photo plate's dilution and volume, and add your other plates to the table. Write TNTC for a plate with too many to count.
4. **CFU/mL.** Read the result, the table of plates and the chart, and download a CSV or a PNG, PDF or Word report.

## Worked example

The example plate is drawn by the page with 142 colonies, including 11 pairs of touching colonies; the page finds all 142 (switch off *Split touching colonies* and it finds 131, because each pair counts as one). That plate is a 10⁻⁵ dilution with 0.1 mL spread. The made-up table adds a second 10⁻⁵ plate with 155 colonies, a 10⁻⁴ plate that is TNTC, and a 10⁻⁶ plate with 17.

Only the two 10⁻⁵ plates are in the 30 to 300 range, so the result is (142 + 155) ÷ (0.1 mL × 10⁻⁵ × 2) = 297 ÷ 0.000002 = **1.485 × 10⁸ CFU/mL**, reported as **1.5 × 10⁸ CFU/mL**. The 95 % interval is 1.32 × 10⁸ to 1.66 × 10⁸, and the plates agree well (χ² = 0.569, p = 0.45). Change the range to start at 10 and the 10⁻⁶ plate is used too: 314 colonies on 0.0000021 mL gives 1.495 × 10⁸, still 1.5 × 10⁸ CFU/mL.

## Tips

- Use the countable range your method or lab asks for, and count every plate in it.
- If no plate is in range, the page uses the nearest plate and labels the result *Estimated*.
- For CFU per g, include the first 1 in 10 suspension of the sample in each dilution, and pick *g of sample*.
- Spreading colonies and plate labels can be left out as too big; add their colonies by tapping if they are real.

## FAQ

**Why not average the plates' own results?** A plain average gives a 17-colony plate the same say as a 155-colony plate, though it is far less precise. Pooling the counts weights each plate by how much sample it saw.

**Is the interval the whole uncertainty?** No. It covers the randomness of counting only. Pipetting and dilution errors add to it, which is why replicate plates and the agreement test matter.

**Are my photos uploaded?** No. Everything runs in your browser and nothing is saved.
