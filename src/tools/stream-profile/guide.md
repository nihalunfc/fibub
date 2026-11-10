---
name: Stream profile
num: 890
shelf: science
code: T625
section: geomorphology
title: "Stream profile"
summary: "Trace a channel down a DEM (GeoTIFF or ASCII grid) by steepest descent, or paste a long profile, and get the long profile, a slope-area fit (ks and θ), a chi plot with the best concavity, normalised steepness ksn and knickpoint hints."
status: live
ads: false
order: 890
icon: mountain
works: offline
updated: 2026-11-09
related: [infinite-slope, manning-weir-calculator, dem-terrain, watershed-delineation, rating-curve, grain-size-stats]
sources:
  - "Methods (formulas only, no data copied): stream power and slope-area scaling (Flint 1974; Hack 1957); chi analysis (Perron and Royden 2013); priority-flood pit filling (Barnes, Lehman and Mulla 2014); D8 flow routing (O'Callaghan and Mark 1984); BIC for segment counts (Schwarz 1978)."
  - "Example profile and DEM: synthetic, made up by fibub from Hack's law and a steady-state stream-power profile."
flow:
  - { icon: mountain, label: "DEM or data" }
  - { icon: pointer, label: "Trace" }
  - { icon: curve, label: "χ and slope" }
  - { icon: target, label: "Knickpoints" }
---

## What it does

Rivers record how fast the land is rising and how hard the rock is. At steady state, channel slope S falls with drainage area A as a power law, **S = ks A^−θ**, where θ is the concavity and ks the steepness. This page measures both, from a long profile you paste or from a channel it traces down a digital elevation model (DEM):

- **Tracing on a DEM**: open a GeoTIFF or ESRI ASCII grid and tap where the channel starts. The page fills pits (priority flood), routes water to the steepest of the eight neighbours (D8), works out the drainage area of every cell, and follows the flow path to the edge of the grid. The start can snap to the biggest drainage area within a few cells, so a tap beside the channel lands on it.
- **Long profile**: elevation against distance upstream of the outlet, with knickpoint hints.
- **Slope-area**: local slope against area on log scales, averaged in log bins, and the straight-line fit that gives **ks and θ**.
- **χ plot**: χ = ∫ (A₀/A)^θ dx from the outlet up (Perron and Royden 2013). At steady state elevation is a straight line against χ, and its slope is the **normalised steepness ksn** at the reference concavity θref (with A₀ = 1 m²). χ uses the whole profile instead of noisy local slopes, so it is the steadier measure.
- **Best θ**: the page tries θ from 0.05 to 1.5 and keeps the one that makes the χ plot straightest (largest R²).
- **Knickpoint hints**: places where z against χ is better fitted by two or three separate lines (chosen by BIC), with ksn below and above each.

Pick out the stream network first with [[watershed-delineation]], and look at the hillslopes beside it with the [[dem-terrain|DEM slope and hillshade]] tool.

## How to use it

1. Paste distance, elevation and drainage area (any order of distance: the end with the larger area is the outlet), or choose **Trace on a DEM**, open your DEM and tap the channel head. Check the cell size: degrees are turned into metres for you, feet are not.
2. Set θref (0.45 is a common choice), A₀, and the drainage area where the channel starts, to leave hillslopes out of the fits.
3. Read ksn, the best θ and the slope-area fit, look at the four plots, and download the profile (with slope and χ) as CSV or the report as an image, PDF or Word file.

## Worked example

The example profile is made up: a 30 km river whose area follows Hack's law, with θ = 0.45, ksn 16 in its lower 15 km and 10 above, and ±0.3 m of noise. The page finds a **knickpoint at 15 km upstream, 211 m up, with ksn 16 below and 10 above**, exactly what was built in. A single line through the χ plot gives ksn 11.5 (R² 0.987). Because the lower reach is steeper, the best single θ comes out low (0.33) and the slope-area fit gives θ 0.389: a reminder that a transient knickpoint biases concavity, so fit each segment on its own (raise "channel starts at" or cut the table) before reading θ.

**Use a made-up DEM** draws a winding valley of 160 × 120 cells of 30 m. Tap near its east end to trace the river to the west edge.

## FAQ

**Why are the fits poor near the top?** Close to the divide the "channel" is a hillslope or a colluvial hollow that does not follow S = ks A^−θ. Raise "channel starts at" (often 10⁵ to 10⁶ m²).

**Which DEMs work?** Single-band GeoTIFFs (8, 16, 32-bit integers or 32/64-bit floats; uncompressed, LZW or Deflate) and ESRI ASCII grids, up to 4 million cells. Projected (metres) grids are best.

**Is anything uploaded?** No. The DEM is read and processed in your browser, and nothing leaves your device.
