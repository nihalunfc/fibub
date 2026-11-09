---
name: Walter-Lieth climate diagram maker
num: 900
shelf: science
section: climatology
title: "Walter-Lieth climate diagram maker: dry and humid seasons, frost months (SVG, PNG and PDF)"
summary: "Type, paste or open 12 monthly mean temperatures and precipitation totals, plus the daily maxima, minima and absolute minima if you have them, and get a full Walter-Lieth climate diagram with the dry season, humid season, very wet months and frost months, ready to download as SVG, PNG, PDF or Word."
status: live
ads: true
order: 900
icon: chart
works: offline
updated: 2026-11-09
related: [koppen-climate, wind-chill-heat-index, plot-maker, trend-analyser, station-data-viewer, et0-calculator, energy-balance-model, weather-log]
sources:
  - "Climate diagram conventions: Walter, H. and Lieth, H. (1960 to 1967), Klimadiagramm-Weltatlas, VEB Gustav Fischer, Jena: 10 °C to 20 mm, a tenth of the scale above 100 mm, dotted dry and hatched humid seasons, frost bars (the layout, written into code by fibub; no diagrams or data copied)."
  - "The dry-season logic was checked 2026-11-09 against NumPy dense sampling on 400 random climates."
  - "All example stations are made up by fibub for illustration; they are not real places."
flow:
  - { icon: table, label: "Months" }
  - { icon: chart, label: "Diagram" }
  - { icon: target, label: "Seasons" }
  - { icon: download, label: "Download" }
---

## What it does

A **Walter-Lieth climate diagram** packs a place's whole climate into one small picture, so that climates can be compared at a glance. Ecologists, geographers and biologists use it in field guides, vegetation studies and theses. This page draws the full classic layout from monthly averages:

- The **temperature** curve (red, left scale) and the **precipitation** curve (blue, right scale), on the special scale where **10 °C matches 20 mm**. On this scale, a month is counted as dry when the precipitation curve falls below the temperature curve, the edge of the dry season in Walter's rule of thumb (P < 2T).
- The **dry season** dotted between the curves, and the **humid season** hatched.
- Months with more than **100 mm** drawn **solid**, with the scale above 100 mm squeezed to a tenth (10 °C = 200 mm), so a monsoon does not run off the page.
- **Frost bars** under the month letters: solid where the mean daily minimum is below 0 °C (sure frost), hatched where only the absolute minimum is (probable frost).
- The header with the station name, elevation, period, annual mean temperature and annual precipitation, and a line of extremes (warmest month's mean daily maximum, coldest month's mean daily minimum, absolute minimum).

For the Köppen class of the same data, use the Köppen climate classifier, which also draws a simpler version of this diagram.

Load the station's monthly records with the [[station-data-viewer|station data viewer]], and look for long-term change in them with the [[trend-analyser|trend analyser]].

## How to use it

1. Start from one of the made-up examples, or clear the box and type your own station name, elevation and period.
2. Enter one row per month, January to December: **mean temperature, precipitation**, then optionally **mean daily maximum, mean daily minimum, absolute minimum**. Paste from a spreadsheet, or use **Open a file** for a CSV or Excel file. A header row and a year row are skipped; a month name or number first is fine.
3. Choose **°F and inches** if your data are in those units. The diagram itself is always drawn in °C and mm, as the convention requires.
4. For a station south of the equator, choose **Southern**: the diagram starts in July so that summer sits in the middle.
5. Download the diagram as **SVG** (vector, for posters and papers), or the report with the diagram, the key facts and the monthly table as an image, PDF or Word file.

## Worked example

The first example (Example A, made up) has a mild, wet winter and a hot, dry summer. The page shows:

- Annual mean **17.4 °C** and **601 mm**.
- A dry season of **5 months**, from **late April to late September**, where the dotted area sits between the curves. Five months (May to September) have P < 2T.
- **2 very wet months** (November and December, above 100 mm), drawn solid.
- **0 sure and 3 probable frost months** (December, January and February have absolute minima below 0 °C).
- Warmest month's mean daily maximum **32.4 °C**, coldest month's mean daily minimum **4.5 °C**, absolute minimum **−2.5 °C**.

## How the dry season is found

The curves are drawn as straight lines between the middle of each month, and run on from December into January. The page finds where they cross exactly on those straight pieces and adds up the dry stretches, so a dry season can start or end part way through a month and can run over the new year.

## FAQ

**Why 10 °C to 20 mm?** Walter chose it because, roughly, evaporation then matches rainfall where the curves cross. It is a convention for comparing climates, not a water balance.

**Can I draw a diagram without the minima?** Yes. Without them the frost bars and extremes are left out.

**Where do I get monthly normals?** From your national weather service's climate normals for a station. Check their terms before you publish a diagram made from their data.
