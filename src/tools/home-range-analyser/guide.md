---
name: Home range analyser
num: 316
shelf: science
code: T231
section: zoology-and-animal-behaviour
title: "Home range calculator: MCP and kernel density from GPS collar data (free)"
summary: "Paste or open GPS collar fixes (time, latitude, longitude) and get 100 % and 95 % minimum convex polygons, kernel density home ranges (95 % and 50 % core), step lengths and turning angles, with a map. Runs in your browser."
status: live
ads: false
order: 316
icon: target
works: offline
updated: 2026-11-09
related: [gps-track-analyser, biodiversity-indices, field-sampling-planner, plot-maker, vector-map-viewer, utm-converter, mark-recapture, ethogram-logger, habitat-connectivity, camera-trap-tagger]
sources:
  - "Reference bandwidth and fixed kernel home range: Worton, B. J. (1989), Ecology 70: 164–168."
  - "Minimum convex polygon and the percentage MCP by distance to the centre: as in Calenge, C. (2006), the adehabitatHR package for R, Ecological Modelling 197: 516–519."
  - "WGS84 ellipsoid constants (a = 6378137 m, f = 1/298.257223563)."
  - "Checked against Python: shapely 2.2 convex hull areas on a pyproj azimuthal equidistant projection, pyproj.Geod geodesic areas, a separate numpy kernel density, and the exact isopleth areas of a single normal kernel."
flow:
  - { icon: table, label: "Paste fixes" }
  - { icon: compass, label: "Project" }
  - { icon: target, label: "Home range" }
  - { icon: download, label: "Download" }
---

## What it does

A home range is the area an animal uses for its normal activities: finding food, resting, raising young. With a GPS collar you get a list of positions (fixes), and this tool turns that list into the standard home range estimates used in animal ecology and wildlife management, plus simple movement statistics. It draws a map of the fixes with the ranges on top. Everything is worked out in your browser: the collar file never leaves your device, and the page works offline once loaded.

This is a different job from the GPS track analyser, which is for hikes and runs (distance, climb and pace). Here the question is how much space an animal uses, and how it moves between fixes.

Clean up the GPS fixes first with the [[gps-track-analyser|GPS track analyser]], and see how habitat patches link up with [[habitat-connectivity|habitat connectivity]].

## How to use it

1. Paste three columns: **time, latitude, longitude**, in decimal degrees, or open a CSV or Excel file from your collar software. With a header row naming the columns (time, lat, lon), the columns can be in any order and extra columns are ignored.
2. Fixes are sorted by time. If the times cannot be read, they are kept in the order given and speeds are left out.
3. Read the areas at the top, check the map, and download the steps or the summary as CSV, or the whole report as an image, PDF or Word file.

## What each option does

- **Kernel bandwidth**: h is the spread (standard deviation, in metres) of the bell-shaped kernel put on each fix. **Reference** uses h ref = √((var x + var y) / 2) × n^(−1/6). It is the usual default, but it smooths a lot when fixes are clumped around a den or a few feeding sites, so ranges come out large. **Set it** lets you choose a smaller or larger h and see how much the answer depends on it.
- **Kernel grid**: the density is worked out on a square grid with this many cells along its longer side. Normal is accurate to a fraction of a percent; fine is slower.
- **Area unit**: hectares or square kilometres (100 ha = 1 km²).

## How it is worked out

Positions are turned into metres east and north of the mean fix, using the WGS84 ellipsoid. The **100 % MCP** is the convex hull of all fixes. The **95 % MCP** leaves out fixes farther from the mean centre than the 95th percentile of those distances. The **kernel density** is the average of the kernels of all fixes; the **95 % isopleth** is the smallest area holding 95 % of it, and the **50 % isopleth** is the core area. **Step length** is the straight line between fixes, and the **turning angle** is the change in direction from one step to the next (positive to the right).

## Worked example

The page opens with a made-up collar: 180 fixes taken every 4 hours for a month, from an animal that moves between a den and a feeding area. It gives a **100 % MCP of 232.4 ha**, a **95 % MCP of 181.7 ha** (171 fixes), and with h ref = 194.5 m a **kernel 95 % home range of 315.2 ha** and a **50 % core area of 86.64 ha**. Steps average 469.9 m (median 400.5 m), and the mean resultant length of the turning angles is 0.093: no preferred turning direction.

## Tips and FAQ

**Why is the kernel range bigger than the MCP?** The kernel spreads each fix over its surroundings, so with the reference bandwidth it adds a margin around the outer fixes. Try a smaller h, or report both.

**How many fixes do I need?** Kernel estimates settle down with about 30 or more independent fixes, and many studies use 50 or more. Fixes taken minutes apart are not independent.

**Can it read fixes that cross the 180° meridian?** No; the page tells you to shift the longitudes first.

**Is my collar data uploaded?** No. Nothing leaves your device.
