---
name: Rain gauge network average
num: 150
shelf: science
section: hydrology-and-water-resources
title: "Rain gauge network average: catchment rainfall by Thiessen polygons, with weights, map and missing readings"
summary: "Turn point rain gauge readings into one rainfall figure for a whole catchment. Each gauge stands for the part of the catchment closest to it (its Thiessen polygon). Paste or open the boundary and the gauges, with any number of storms or days as columns. Get the areal rainfall, each gauge's area and weight, a map, and a comparison with the plain average. Missing readings redraw the polygons."
status: live
ads: true
order: 7
icon: target
works: offline
updated: 2026-11-09
related: [unit-hydrograph, runoff-calculator, flood-frequency, et0-calculator]
sources:
  - "Thiessen polygon (Voronoi) method for areal rainfall: standard hydrology textbook method (Thiessen, 1911)."
  - "Geometry: half-plane clipping of the catchment polygon (Sutherland–Hodgman) and the shoelace area, written by fibub. Checked in the tests against shapely 2.2 (Voronoi diagram intersected with the catchment)."
  - "Longitude and latitude are projected onto a local flat map (111.32 km per degree of longitude times the cosine of latitude, 110.574 km per degree of latitude). The example catchment, gauges and rain are made up."
flow:
  - { icon: mountain, label: "Boundary" }
  - { icon: target, label: "Gauges" }
  - { icon: compass, label: "Polygons" }
  - { icon: calculator, label: "Average" }
---

## What it does

A rain gauge measures rain at one point, but floods, water balances and runoff models need the rain over a whole **catchment**. If the gauges are spread unevenly, a plain average gives a cluster of gauges in one corner too much say.

The **Thiessen polygon** method fixes this. Every point in the catchment is given to its nearest gauge. Each gauge then stands for its own patch, its Thiessen polygon, and its reading is weighted by that patch's share of the catchment area. The weighted sum is the **areal rainfall**.

Turn the rainfall into a flood hydrograph with the [[unit-hydrograph]], or into a peak flow with the [[runoff-calculator]].

## How to use it

1. **Choose the coordinates**: kilometres, metres, or longitude and latitude. Use the same system for the boundary and the gauges.
2. **Give the catchment boundary** as its corners in order around the edge, one "x, y" per row. You can paste it or open a CSV, TXT or Excel file, for example corners exported from a GIS.
3. **Give the gauges**: an optional name, then x, y, and one or more rain columns. Each column can be a storm, a day or a month.

The tool redraws as you type.

## What you get

- **Catchment rainfall (Thiessen)** for the chosen column, in mm.
- **Plain average** of the gauges, both for all of them and for only those inside the catchment, and the **difference**. A big difference means the gauge spread matters.
- **Catchment area** and **rain volume** (rainfall × area).
- **A map** showing the boundary, each gauge's polygon (darker for more rain) and each reading.
- **A table** of each gauge's rain, cell area and weight.
- **Every column** at once, when you give more than one.
- **A CSV download** of the weights and means.

**Missing readings.** Leave a cell blank when a gauge has no reading. That gauge is dropped for that column only, and the polygons are redrawn without it, so its neighbours take over its area.

**Gauges outside the catchment** still count for any part of the catchment they are nearest to. That is often right for a gauge just over the ridge. A gauge whose cell misses the catchment entirely gets weight 0.

## Worked example

The made-up catchment covers 125 km², with six gauges inside and one (Road Depot) just outside.

For **storm 1**:

- The Thiessen weights run from 22.98 % (School) down to 0.14 % (Road Depot).
- The **catchment rainfall is 31.0 mm**, a volume of about 3.87 million m³.
- The plain average of all seven gauges is 30.6 mm. For the six inside, it is 30.0 mm.

For **storm 2**, School has no reading:

- School's cell is shared out among its neighbours. Mill's weight rises to 24.75 % and North Fell's to 24.86 %.
- The catchment rainfall is 15.8 mm, against a plain average of 16.2 mm.

## FAQs

**Is Thiessen better than a plain average?** Usually, when gauges are unevenly spread. It still ignores hills, which often get more rain. Methods that follow the terrain, such as isohyets drawn by hand or interpolation with elevation, can do better where there is a strong relief effect.

**Can I use longitude and latitude?** Yes. The tool projects them onto a flat map around the middle of your points. That is accurate enough for catchments up to a few hundred kilometres across. For bigger areas, use projected coordinates such as UTM.

**Does the boundary need to be convex?** No. Any simple outline works, as long as it does not cross itself.

**Is my data uploaded?** No. Files open and stay in your browser.
