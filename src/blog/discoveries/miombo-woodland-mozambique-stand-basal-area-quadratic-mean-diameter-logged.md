---
title: "Logged miombo woodland in Mozambique: stand basal area and mean diameter rechecked"
summary: "A 2025 survey of 34 one-hectare plots in a logging concession in central Mozambique reports 255 stems and 15.43 m² of basal area per hectare. We derive the stand's quadratic mean diameter and rebuild its reverse-J diameter curve."
tools: [forest-inventory-summary, tree-height-basal-area, biodiversity-indices]
updated: 2026-11-24
sources:
  - "Manjate, A., Zahabu, E., Ilstedt, U., Egas, A. and Goodman, R. C. (2025), Structure and Composition of a Selectively Logged Miombo Woodland in Central Mozambique, Forests 16(4): 569, doi:10.3390/f16040569. Licence CC BY (Creative Commons Attribution), checked on the MDPI article page, 2026-11-24. Values used here: 34 permanent plots of 100 × 100 m measured March to June 2022; trees with DBH of 10 cm or more; 8660 live trees; 255 ± 21 stems/ha; basal area 15.43 ± 0.95 m²/ha; above-ground biomass 109.68 Mg/ha; volume about 145 m³/ha; Brachystegia spiciformis 42 % of stems and 58 % of basal area; 57 species; Shannon 2.3, Pielou evenness 0.6; 1231 merchantable trees; annual allowable cut about two trees per hectare."
  - "Quadratic mean diameter and basal area: standard forest mensuration, for example Avery, T. E. and Burkhart, H. E., Forest Measurements, 5th ed. (McGraw-Hill, 2002)."
paper:
  title: "Structure and Composition of a Selectively Logged Miombo Woodland in Central Mozambique"
  authors: "Manjate A, Zahabu E, Ilstedt U, Egas A, Goodman RC"
  journal: "Forests"
  year: 2025
  doi: "10.3390/f16040569"
  url: "https://www.mdpi.com/1999-4907/16/4/569"
  licence: "CC BY 4.0"
  reviewed: true
---

**Miombo** is the dry woodland that covers much of southern Africa, dominated by trees of the genera *Brachystegia*, *Julbernardia* and *Isoberlinia*, and much of it is logged selectively for a handful of valuable species. A 2025 paper in *Forests* measured every tree of 10 cm diameter or more on 34 one-hectare plots in a logging concession in central Mozambique, to see what such a stand looks like after years of selective cutting. This article uses the [[forest-inventory-summary]] and [[tree-height-basal-area]] maths to recheck the headline numbers, work out the stand's **quadratic mean diameter**, which the paper does not give, and rebuild the shape of its diameter distribution. For the species side, the [[biodiversity-indices]] tool turns the same tally into Shannon and evenness values.

## The paper in brief

The authors laid out 34 permanent plots of 100 × 100 m in a 46,239 ha concession, logged since 2005 in 20 annual blocks, and measured **DBH** (diameter at breast height, 1.3 m above the ground) on 8660 live trees in 2022. They report **255 ± 21 stems per hectare**, a **basal area** (the summed cross-section of all trunks at breast height) of **15.43 ± 0.95 m² per hectare**, about 110 tonnes of above-ground biomass and 145 m³ of wood per hectare.

One species dominates: *Brachystegia spiciformis* makes up **42 % of the stems but 58 % of the basal area**, so its trees are larger than average. The stand has 57 species, a Shannon index of 2.3 and a Pielou evenness of 0.6. The diameter distribution is **reverse-J shaped**: many small trees and few large ones, the shape of a woodland that keeps regenerating. Only 1231 trees (14 %) were merchantable, against an annual allowable cut of about two trees per hectare.

## Checked with the tools

**Step 1: the stand's own arithmetic.** These are **recomputations from the numbers in the paper's text**.

| Check | Paper | Tool maths gives |
|---|---|---|
| Stems per hectare | 255 | 8660 trees ÷ 34 ha = 254.7 |
| Basal area of the mean tree | (not given) | 15.43 ÷ 255 = 0.0605 m² |
| Quadratic mean diameter (QMD) | (not given) | **27.8 cm** |
| QMD of *B. spiciformis* | (not given) | 32.6 cm |
| QMD of all other species | (not given) | 23.6 cm |
| Pielou evenness, H ÷ ln S | 0.6 | 2.3 ÷ ln 57 = 0.569 |
| 95 % range of stems per hectare, if ± is a standard error | (not given) | 212 to 298 |
| 95 % range of basal area, if ± is a standard error | (not given) | 13.5 to 17.4 m²/ha |

The **quadratic mean diameter** is the diameter of the tree of average basal area: QMD = 200 × √(BA ÷ N ÷ π) cm, with BA in m² per hectare and N in stems per hectare. It is the diameter foresters use in stand density rules, because it ties stems and basal area together exactly. A plain average DBH would be smaller, since basal area grows with the square of the diameter. The species figures come from the shares: *B. spiciformis* carries 58 % of the basal area on 42 % of the stems, so its mean tree has 1.38 times the average basal area, and a QMD 1.18 times larger.

Figure 2 shows what the QMD means: at 27.8 cm, every extra 100 stems per hectare adds 6.1 m² of basal area. A stand with the same stems and a 34 cm QMD would carry 23 m² per hectare.

<!-- fig:qmd -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Basal area against stem density for three quadratic mean diameters. The paper's stand, 255 stems and 15.43 m² per hectare, lies on the 27.8 cm line." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Stems, basal area and quadratic mean diameter</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Stems, basal area and quadratic mean diameter</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="186.5" y2="186.5" style="stroke:var(--line)"/><text x="52" y="190.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--line)"/><text x="52" y="145" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="95.5" y2="95.5" style="stroke:var(--line)"/><text x="52" y="99.5" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="180" x2="180" y1="232" y2="236" style="stroke:var(--muted)"/><text x="180" y="249" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="424" x2="424" y1="232" y2="236" style="stroke:var(--muted)"/><text x="424" y="249" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Stems per hectare (DBH ≥ 10 cm)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Basal area (m²/ha)</text><path d="M58 214.7L67.8 213.3L77.5 211.9L87.3 210.6L97 209.2L106.8 207.8L116.6 206.4L126.3 205L136.1 203.7L145.8 202.2L155.6 200.9L165.4 199.5L175.1 198.1L184.9 196.7L194.6 195.3L204.4 194L214.2 192.6L223.9 191.2L233.7 189.8L243.4 188.4L253.2 187L263 185.6L272.7 184.3L282.5 182.9L292.2 181.5L302 180.1L311.8 178.7L321.5 177.4L331.3 175.9L341 174.6L350.8 173.2L360.6 171.8L370.3 170.4L380.1 169L389.8 167.7L399.6 166.3L409.4 164.9L419.1 163.5L428.9 162.1L438.6 160.7L448.4 159.3L458.2 158L467.9 156.6L477.7 155.2L487.4 153.8L497.2 152.4L507 151.1L516.7 149.7L526.5 148.3L536.2 146.9L546 145.5" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><path d="M58 204.4L67.8 202.2L77.5 200L87.3 197.7L97 195.6L106.8 193.3L116.6 191.1L126.3 188.9L136.1 186.7L145.8 184.5L155.6 182.3L165.4 180.1L175.1 177.9L184.9 175.7L194.6 173.4L204.4 171.3L214.2 169L223.9 166.8L233.7 164.6L243.4 162.4L253.2 160.2L263 158L272.7 155.8L282.5 153.6L292.2 151.4L302 149.1L311.8 146.9L321.5 144.7L331.3 142.5L341 140.3L350.8 138.1L360.6 135.9L370.3 133.7L380.1 131.5L389.8 129.3L399.6 127L409.4 124.8L419.1 122.6L428.9 120.4L438.6 118.2L448.4 116L458.2 113.8L467.9 111.6L477.7 109.4L487.4 107.1L497.2 105L507 102.7L516.7 100.6L526.5 98.3L536.2 96.1L546 93.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 190.7L67.8 187.4L77.5 184.1L87.3 180.8L97 177.5L106.8 174.2L116.6 170.8L126.3 167.6L136.1 164.3L145.8 160.9L155.6 157.7L165.4 154.3L175.1 151L184.9 147.7L194.6 144.4L204.4 141.1L214.2 137.8L223.9 134.5L233.7 131.2L243.4 127.9L253.2 124.6L263 121.3L272.7 118L282.5 114.7L292.2 111.4L302 108.1L311.8 104.8L321.5 101.5L331.3 98.1L341 94.9L350.8 91.5L360.6 88.2L370.3 84.9L380.1 81.6L389.8 78.3L399.6 75L409.4 71.7L419.1 68.4L428.9 65.1L438.6 61.8L448.4 58.5L458.2 55.2L467.9 51.9L477.7 48.6L487.4 45.3L497.2 42L507 38.7L516.7 35.3L526.5 32.1L536.2 28.8L546 25.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="247.1" cy="161.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><text x="255.1" y="175.8" text-anchor="start" style="fill:var(--ink)">this stand</text><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/><text x="74" y="40" style="fill:var(--muted)">QMD 22 cm</text><line x1="148.8" x2="160.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="164.8" y="40" style="fill:var(--muted)">QMD 27.8 cm</text><line x1="254" x2="266" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:4 4"/><text x="270" y="40" style="fill:var(--muted)">QMD 34 cm</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Lines of equal quadratic mean diameter, from the basal area of one stem (Tree basal area maths). The paper's stand sits on the 27.8 cm line.</figcaption></figure>
<!-- /fig:qmd -->

**Step 2: the reverse-J curve.** The plot data are not published in the text, so we **simulated** a 34-plot tally to match it: each tree's DBH is 10 cm plus an exponential tail, the simplest reverse-J shape, with the tail set so that *B. spiciformis* and the other species hit their QMDs above (tail means of 17.5 and 10.9 cm, **our assumption**). Plot totals vary with a standard deviation of 21 × √34 = 122 stems per hectare, reading the paper's ± as a standard error (**our assumption**). Run through the tool's maths, the simulated tally gives 8705 trees, **256 ± 20 stems** and **15.65 ± 1.23 m²** per hectare, a QMD of 27.9 cm, and *B. spiciformis* at 43 % of stems and 59 % of basal area. Figure 1 shows its diameter classes: 137 stems per hectare between 10 and 20 cm, 62 between 20 and 30, then halving about every 10 cm.

<!-- fig:classes -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Reverse-J diameter distribution of a simulated 34-plot tally built to match 255 stems and 15.43 m² per hectare; 137 stems per hectare fall in the 10 to 20 cm class." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated miombo stand: stems per hectare by diameter class</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated miombo stand: stems per hectare by diameter class</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="167" y2="167" style="stroke:var(--line)"/><text x="52" y="171" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="102" y2="102" style="stroke:var(--line)"/><text x="52" y="106" text-anchor="end" style="fill:var(--muted)">100</text><line x1="106.8" x2="106.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="106.8" y="249" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="204.4" x2="204.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="204.4" y="249" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="399.6" x2="399.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="399.6" y="249" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="497.2" x2="497.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="497.2" y="249" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">DBH class midpoint (cm)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Stems per hectare</text><path d="M82.4 53.8L131.2 151.8L180 195L228.8 215.1L277.6 222.8L326.4 227.1L375.2 229.3L424 230.4L472.8 231.1L521.6 231.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M82.4 169.3L131.2 196.6L180 213L228.8 221.1L277.6 225.9L326.4 228.4L375.2 229.7L424 230.7L472.8 231.2L521.6 231.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M82.4 116.4L131.2 187.2L180 213.9L228.8 226L277.6 228.9L326.4 230.7L375.2 231.6L424 231.7L472.8 231.7L521.6 232" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">All trees</text><line x1="148.8" x2="160.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="164.8" y="40" style="fill:var(--muted)">B. spiciformis</text><line x1="275.6" x2="287.6" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><text x="291.6" y="40" style="fill:var(--muted)">Other species</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Diameter classes from the Forest inventory summary's maths, run on a simulated 34-plot tally built to match the paper's stem density, basal area and B. spiciformis shares. Not the paper's trees.</figcaption></figure>
<!-- /fig:classes -->

Our simulated basal area varies more between plots (a coefficient of variation of 46 %) than the paper's ± implies (36 %). That is a real ecological signal: in a natural stand, plots crowded with small stems tend to have fewer big trees, so basal area evens out more than stem counts, while our simulation draws sizes independently of crowding.

**Step 3: how many plots?** If the ± values are standard errors, stems vary by 48 % from plot to plot and basal area by 36 %. To pin each mean to within ±10 % at 95 % confidence would take about 96 one-hectare plots for stems and 54 for basal area; the 34 plots give about ±17 % for stems and ±13 % for basal area. That is ample for describing the stand, and a useful benchmark for anyone planning a re-measurement.

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/miombo-woodland-mozambique-stand-basal-area-quadratic-mean-diameter-logged.mjs` in fibub's public code. It calls `inventory` from `src/lib/sci/inventory.ts`, the maths behind the [[forest-inventory-summary]], for stems, basal area, standard errors, QMD, species shares and diameter classes; and `basalArea` and `diameterFromBA` from `src/lib/sci/treeheight.ts`, which power the [[tree-height-basal-area]] tool. The t value for the 95 % ranges comes from `tInv` in `src/lib/sci/stats.ts`.

Stem density, basal area, tree count, plot count, species shares, Shannon index and species number come from the paper's text. The exponential diameter tails, the reading of ± as a standard error and the random draws are **our assumptions**; the simulated tally is not the paper's data.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/forest-inventory-summary.mjs` and `tests/sci-tools/tree-height-basal-area.mjs`, checked against independent pandas, SciPy and NumPy calculations:

- A made-up 7-plot tally on 400 m² plots must give 132.14 stems per hectare with a standard error of 27.12, a basal area of 5.386 m² per hectare and a QMD of 22.78 cm.
- The same tally's pine must have 67.86 stems and 3.961 m² per hectare, a QMD of 27.26 cm and 73.5 % of the basal area.
- A 35 cm tree must have a basal area of 0.09621 m², and a 10-tree plot of 400 m² must give 250 stems and 10.60 m² per hectare with a QMD of 23.24 cm.
- New with this article: 255 stems and 15.43 m² per hectare must give a QMD of 27.76 cm, and 42 % of stems with 58 % of basal area a QMD of 32.62 cm.

## Check it yourself

On the [[tree-height-basal-area]] tool, under basal area:

1. Set *From* to **One tree** and type **27.8** in *DBH (cm)*. The basal area is about **0.0607 m²**; times 255 stems that is 15.5 m² per hectare, the paper's stand.

On the [[forest-inventory-summary]], with a small made-up tally in the same reverse-J shape:

2. In *One row per tree: plot, species, DBH, and height if measured*, paste these 20 rows, one tree per line: **A, Brachystegia, 11.1**; **A, Brachystegia, 16.6**; **A, Other, 10.5**; **A, Other, 12.6**; **A, Other, 15.1**; **A, Brachystegia, 24.5**; **A, Brachystegia, 39.3**; **A, Other, 18.5**; **A, Other, 23.5**; **A, Other, 32.7**; **B, Brachystegia, 13.6**; **B, Brachystegia, 20.1**; **B, Other, 11.5**; **B, Other, 13.8**; **B, Other, 16.7**; **B, Brachystegia, 30.4**; **B, Brachystegia, 58.6**; **B, Other, 20.7**; **B, Other, 27.2**; **B, Other, 44.8**.
3. Keep *Units* on **Metric**, *Plot size given as* **Area of each plot**, type **400** in *Plot area (m²)* and **10** in *Diameter class width (cm)*.
4. The headline reads about **Basal area 13.5 m²/ha, 250 stems/ha**, with a *Quadratic mean diameter* of **26.2 cm**, and *Brachystegia* holds about 55 % of the basal area on 40 % of the stems.
5. The diameter class chart falls from the 10 cm class to a few big trees: the reverse-J shape of Figure 1.

## What researchers can use it for

- **Summarise a plot tally in the field**: stems, basal area with standard errors, QMD and species shares in one paste, with the [[forest-inventory-summary]].
- **Fill in a missing QMD** from a paper's stems and basal area per hectare, so stands from different studies can be compared on a density diagram.
- **Check a reverse-J claim**: the diameter class chart shows at once whether small trees are regenerating.
- **Plan re-measurement**: use the plot-to-plot spread to choose how many plots you need, with the [[field-sampling-planner]].
- **Single trees and prism sweeps**: the [[tree-height-basal-area]] tool gives basal area from one diameter, a fixed plot or an angle gauge, and the [[tree-carbon]] tool turns diameters into carbon.

## The fine print

- The stand numbers are from the paper's text; the tree-by-tree data and the per-plot values are not, so Figure 1 is a simulation built to match them.
- The paper does not say whether ± is a standard error or a standard deviation; the 95 % ranges and plot numbers above assume a standard error.
- An exponential tail is a simple stand-in for a reverse-J curve; real miombo stands often have a bump of large *Brachystegia* trees that it does not capture.
- This is one logged stand with no unlogged control in the paper, so the numbers describe its state, not the effect of logging.
