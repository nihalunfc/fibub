---
name: Watershed delineation
num: 889
shelf: science
section: geomorphology
title: "Watershed delineation from a DEM: fill sinks, D8 flow, flow accumulation, streams and catchment outline in the browser"
summary: "Open a small DEM (GeoTIFF or ASCII grid, up to 1000 × 1000 cells), tap a stream to place the outlet, and see the area that drains to it: catchment area, perimeter, longest flow path, relief, mean slope, stream length, drainage density and Strahler order. Depressions are filled with Priority-Flood and flow follows D8. Download the outline and streams as GeoJSON, and flow accumulation and direction as GeoTIFF. Files never leave your device."
status: live
ads: false
order: 889
icon: mountain
works: offline
updated: 2026-11-09
related: [dem-terrain, vector-map-viewer, runoff-calculator, unit-hydrograph]
sources:
  - "Depression filling: R. Barnes, C. Lehman and D. Mulla, 'Priority-Flood: an optimal depression-filling and watershed-labeling algorithm for digital elevation models', Computers and Geosciences 62 (2014), the +epsilon variant; written by fibub."
  - "Flow directions: the D8 method of J. F. O'Callaghan and D. M. Mark, 'The extraction of drainage networks from digital elevation data', Computer Vision, Graphics and Image Processing 28 (1984); direction codes as used by ESRI and pysheds."
  - "Stream order: A. N. Strahler, 'Quantitative analysis of watershed geomorphology', Transactions of the American Geophysical Union 38 (1957)."
  - "Slope (for the mean slope): Horn's method, shared with the DEM terrain tool; WGS 84 constants for degree grids."
  - "The example valley is made up by fibub."
flow:
  - { icon: mountain, label: "Open DEM" }
  - { icon: pointer, label: "Tap outlet" }
  - { icon: chart, label: "Watershed" }
  - { icon: download, label: "GeoJSON" }
---

## What it does

A **watershed** (catchment, drainage basin) is all the land that drains to one point on a stream, its **outlet** or pour point. This tool finds it from a digital elevation model, step by step, the way GIS hydrology tools do:

1. **Fill depressions.** Small pits in a DEM are usually errors, and water would get stuck in them. The tool fills them with the Priority-Flood method, raising each filled cell a tiny amount (far below a millimetre) above the cell it drains to, so flat areas drain too.
2. **Flow directions (D8).** Each cell sends its water to whichever of its 8 neighbours is steepest downhill, measured as drop per metre of distance (diagonals are longer).
3. **Flow accumulation.** For every cell, the number of cells whose water passes through it.
4. **Streams.** Cells with more than a threshold number of cells draining through them form the stream network, each segment with its **Strahler order** (two order-1 streams make an order-2 stream, and so on).
5. **Watershed.** Tap the map: the outlet moves to the cell with the most flow nearby (**snapping**, so a tap just beside the stream still lands on it), and every cell that drains to it is shaded and outlined.

## How to use it

1. Press **Open a DEM** and choose a GeoTIFF or ESRI ASCII grid of up to 1 million cells. Crop larger DEMs in a GIS first.
2. Check the **Cell size unit** (degrees for SRTM-style grids; the tool then works out each row's cell size in metres).
3. Set the **stream threshold**: fewer cells show more, smaller streams.
4. Tap a stream on the map. Read the watershed's numbers, then download the outline and streams as GeoJSON for your GIS, or the flow accumulation and flow direction grids as GeoTIFF.

## Worked example

Press **Use the example** to load a made-up valley of 240 × 200 cells of 10 m. The stream threshold starts at 192 cells (1.92 ha), which gives a network up to Strahler order 4. The example outlet is placed where you would tap at row 80, column 66 on the main stream; it snaps to row 84, column 64, where **19,377 cells** drain in, a watershed of **1.938 km²**. Its outline is 6.64 km long, the longest flow path is 2.399 km, heights run from 239.4 to 698.4 m, and the mean slope is 12.8°. Filling raised 6 cells, by at most 0.2 m.

## Limits and choices

- **Size**: up to 1,000,000 cells, so every step stays quick on a phone.
- **Edges and gaps**: cells on the edge of the grid, or next to cells without data, can drain out of the grid (no-data is treated like the sea or the edge). If your watershed touches the edge, part of it may be missing: use a larger DEM.
- **D8** sends all water one way, so on broad, gentle slopes streams run in straight lines at 45° steps. It is the standard method for delineating watersheds and gives the same catchments as other tools.
- **Flats** drain through the tiny epsilon gradient left by filling, toward where they were reached from the outlet. Other tools resolve flats in other ways, so on large flat areas stream lines can differ a little between tools.

## Accuracy

Checked on three synthetic DEMs (with pits, rounded flats and a no-data hole) against an independent Python Priority-Flood and numpy D8: filled heights, flow directions on every cell, flow accumulation and catchments were identical. Against pysheds 0.4: its fill_depressions gave the same filled DEM where no-data was not involved, and on our filled DEM its D8 directions, flow accumulation and Strahler orders matched on every interior cell (pysheds treats the grid edge differently).

## FAQ

**Why did my outlet jump?** Snapping moves it to the cell with the largest flow within the snap distance. Set the snap distance to 0 to use exactly the cell you tap.

**Is the area exact?** It is the sum of the cells in the watershed, so it depends on the DEM's cell size and quality, not on the drawing.
