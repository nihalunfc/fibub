---
name: Köppen climate classifier
num: 137
shelf: science
section: climatology
title: "Köppen climate classifier and Walter-Lieth climate diagram from monthly temperature and rainfall"
summary: "Type or paste 12 monthly mean temperatures and precipitation totals and get the Köppen-Geiger class (such as Csa, Cfb, BWh or Dfb) with every test explained step by step, plus a Walter-Lieth climate diagram showing the dry and wet months."
status: live
ads: true
order: 1
icon: calendar
works: offline
updated: 2026-11-08
related: [skew-t-sounding, psychrometric-calculator, plot-maker, biodiversity-indices]
sources:
  - "Köppen-Geiger rules: Peel, M. C., Finlayson, B. L. and McMahon, T. A. (2007), Updated world map of the Köppen-Geiger climate classification, Hydrology and Earth System Sciences 11, 1633 to 1644 (the published criteria, written into code by fibub; no maps or data copied)."
  - "Original C/D boundary of −3 °C and the h/k split by the coldest month: Köppen's classification as commonly described in climatology textbooks."
  - "Climate diagram: the layout of Walter and Lieth (1960 to 1967), 10 °C to 20 mm, with precipitation above 100 mm drawn at a tenth of the scale."
  - "All example stations are made up by fibub for illustration; they are not real places."
flow:
  - { icon: table, label: "Months" }
  - { icon: target, label: "Class" }
  - { icon: chart, label: "Diagram" }
  - { icon: download, label: "Download" }
---

## What it does

The **Köppen climate classification** sorts the world's climates into groups using nothing more than the average temperature and precipitation of each month. It is the system behind the familiar codes on climate maps: **Af** for tropical rainforest, **BWh** for hot desert, **Csa** for a Mediterranean climate, **Cfb** for an oceanic one, **Dfb** for a humid continental one, **ET** for tundra.

Give this tool the 12 monthly means for a place and it works out the class, showing every test it applied and the numbers it compared, so you can see exactly why a place is, say, Csb rather than Cfb. It also draws a **Walter-Lieth climate diagram**, the compact chart ecologists and geographers use to show the length of the dry season at a glance.

## How to use it

1. Pick a **made-up example**, or choose **My own data** and paste 12 rows (January to December): the month, the mean temperature and the total precipitation. You can also paste two rows of 12 values, or open a CSV or Excel file. A row for the year or annual total is skipped.
2. Choose **°C and mm** or **°F and inches**.
3. Give a station name and elevation for the diagram if you like.
4. Optional settings:
   - **C and D split.** Peel and colleagues (2007) put the boundary between temperate (C) and continental (D) climates at a coldest month of 0 °C; Köppen's original used −3 °C. Places with a coldest month between the two change class.
   - **Hot or cold dry climates.** By default a dry climate is h (hot) when the mean annual temperature is 18 °C or more. Some maps use the coldest month above 0 °C instead.
   - **Diagram start.** Southern hemisphere diagrams usually start in July so the summer sits in the middle.

## How the class is found

1. **E (polar):** the warmest month is below 10 °C. ET if it is above 0 °C, EF if not. This is checked first so ice caps are not called deserts.
2. **B (dry):** the annual precipitation is below 10 × Pthreshold, where Pthreshold = 2 × mean annual temperature, plus 28 if 70 % or more of the precipitation falls in the summer half, or plus 14 if neither half gets 70 %. BW (desert) below 5 × Pthreshold, otherwise BS (steppe).
3. **A (tropical):** the coldest month is 18 °C or more. Af if every month has 60 mm; Am if the driest month has at least 100 − annual/25 mm; otherwise Aw (or As when the driest month falls in summer).
4. **C or D:** by the coldest month. Second letter: **s** if the driest summer month has under 40 mm and under a third of the wettest winter month; **w** if the driest winter month has under a tenth of the wettest summer month; otherwise **f**. Third letter: **a** if the warmest month reaches 22 °C, **b** if four or more months are above 10 °C, **d** if the coldest month is below −38 °C, otherwise **c**.

The **summer half** is whichever of April–September or October–March is warmer, so the rules work in both hemispheres.

## Reading the Walter-Lieth diagram

Temperature (red) and precipitation (blue) share one chart, with 20 mm of precipitation level with 10 °C. Where the precipitation line drops below the temperature line, the month is **dry** (red dots); above it the month is **wet** (blue hatching). Months above 100 mm are drawn at a tenth of the scale, in solid blue.

## Worked example

The made-up Mediterranean station has a mean annual temperature of 17.5 °C and 550 mm of precipitation, 81 % of it in winter. Pthreshold is 2 × 17.5 = 35 mm, and 550 mm is well above 10 × 35 = 350 mm, so it is not dry. The coldest month is 10 °C (between 0 and 18): **C**. The driest summer month has 2 mm, below 40 mm and below a third of the wettest winter month (95 / 3 = 31.7 mm): **s**. The warmest month is 26 °C: **a**. The result is **Csa, Mediterranean with a hot summer**, and the diagram shows five dry months, May to September.

## FAQ

**Where do I get monthly normals?** National weather services publish 30-year climate normals for their stations. Use the means for 1991–2020 if you can.

**Why does my map show a different class?** Maps use gridded data and sometimes different rules (the −3 °C boundary, As versus Aw, h/k by temperature). Try the options above.
