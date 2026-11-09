---
name: Location quotients and shift-share
num: 758
shelf: science
section: human-geography-and-urban-studies
title: "Location quotient, shift-share and economic base calculator (free)"
summary: "Paste jobs by industry for a region and a reference area. Get location quotients, a shift-share split into national share, industry mix and regional shift, basic and non-basic jobs, the economic base multiplier and the coefficient of specialisation."
status: live
ads: true
order: 758
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, plot-maker, data-cleaner, gravity-model, catchment-buffer, leontief-multipliers, gini-lorenz, population-pyramid]
sources:
  - "Formulas: location quotient and the economic base (LQ method) as in standard regional economics textbooks; classic shift-share decomposition (Dunn 1960)."
  - "Example data: made up."
flow:
  - { icon: table, label: "Paste jobs" }
  - { icon: percent, label: "LQ" }
  - { icon: chart, label: "Shift-share" }
  - { icon: download, label: "Report" }
---

## What it does

Which industries is a region specialised in, and why did its jobs grow faster or slower than the country's? Regional economists, planners and geography students answer these questions with three classic tools, and this page does all three from one table of jobs by industry:

- **Location quotient (LQ):** the industry's share of regional jobs divided by its share of jobs in the reference area (usually the country or state). An LQ of 2 means the region has twice the usual share; below 1 means less than the usual share.
- **Shift-share analysis:** splits each industry's change in jobs between two years into the **national share** (the change if it had grown at the reference area's overall rate), the **industry mix** (extra growth or loss because that industry grew faster or slower than the whole economy) and the **regional shift** (what is left: the region doing better or worse than the same industry elsewhere). The three always add up to the actual change.
- **Economic base:** jobs above the reference share (where LQ > 1) are counted as **basic**, serving customers outside the region; the rest are **non-basic**. Total jobs divided by basic jobs is the **economic base multiplier**.

It also gives the **coefficient of specialisation**: half the sum of the differences in industry shares, from 0 (the same mix as the reference area) to 1 (nothing in common). Everything runs in your browser; nothing is uploaded.

Follow up the key industries with [[leontief-multipliers|input-output multipliers]], and see how strongly places draw trade or trips from each other with the [[gravity-model]].

## How to use it

1. Paste a table with one row per industry. With two years, the columns are: industry, region year 1, region year 2, reference year 1, reference year 2. With one year, use industry, region, reference. A header row is optional; years in it (such as 2015) are used as labels.
2. Or open a CSV, TSV or Excel file with **Open a file**.
3. Choose which year the basic and non-basic jobs are worked out for (second year by default).
4. Read the summary, the two charts and the table. Download the table as CSV, or the whole report as an image, PDF or Word file.

## Formulas

For industry *i* with regional jobs *e* and reference jobs *E*, totals without a subscript:

- LQ = (e<sub>i</sub> / e) ÷ (E<sub>i</sub> / E)
- National share = e<sub>i,0</sub> × G, where G is the reference area's total growth rate
- Industry mix = e<sub>i,0</sub> × (g<sub>i</sub> − G), with g<sub>i</sub> the industry's growth in the reference area
- Regional shift = e<sub>i,0</sub> × (r<sub>i</sub> − g<sub>i</sub>), with r<sub>i</sub> the industry's growth in the region
- Basic jobs = max(0, e<sub>i</sub> − e × E<sub>i</sub> / E); multiplier = e ÷ total basic jobs

## Worked example

The example is a made-up region of 34,950 jobs in 2015 and 39,200 in 2025, compared with a made-up country. Regional jobs grew by 4,250 (+12.2 %) while the country grew by 8.6 %. Shift-share splits the 4,250 into **+3,002** national share, **−768** industry mix (the region leans on manufacturing and farming, which shrank nationally) and **+2,015** regional shift, most of it from tourism and hospitality (+822). Mining and quarrying has the highest LQ, 3.81 in 2025. The region has 4,706 basic jobs in 2025, so the economic base multiplier is **8.33**, and the coefficient of specialisation is 0.12.

## Tips

- Use the finest industry list you have, the same in every column. Coarse groups hide specialisation and make the LQ method undercount basic jobs.
- The reference area should be the larger economy the region trades within. Leaving the region inside the reference totals is usual and fine.
- A new industry (no jobs in year 1) has no growth rate, so all its jobs go to the regional shift.
- LQ basic jobs are a floor estimate: the method assumes the same spending pattern everywhere and that a region with LQ below 1 exports nothing. Treat the multiplier as a rough guide, not a forecast.

## FAQ

**What LQ counts as a specialisation?** There is no fixed cut-off. Many studies treat LQ above 1.25 as a clear concentration, which the table marks in bold, but small industries can have large LQs from a handful of jobs.

**Why do my shift-share numbers differ from another study?** Some studies use a dynamic version (year by year), or the Esteban-Marquillas extension that splits the regional shift further. This page uses the classic two-year version.

**Can I use earnings or output instead of jobs?** Yes, any count or amount that adds up across industries works, as long as every column uses the same measure.

**Is my data sent anywhere?** No. The numbers stay in this page and are gone when you close it.
