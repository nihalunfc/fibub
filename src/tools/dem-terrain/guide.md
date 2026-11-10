---
name: DEM terrain
num: 888
shelf: science
code: T623
section: geomorphology
title: "DEM terrain"
summary: "Open a digital elevation model (GeoTIFF or ESRI ASCII grid) and get slope (Horn's method), aspect, hillshade with your own sun position, and general, profile and plan curvature, as coloured maps with statistics, slope classes and an aspect breakdown. Degree grids such as SRTM are handled with the cell size worked out for each latitude. Download PNG, GeoTIFF or ASCII grid. Files never leave your device."
status: live
ads: false
order: 888
icon: mountain
works: offline
updated: 2026-11-09
related: [spectral-index-calculator, vector-map-viewer, watershed-delineation, stream-profile, infinite-slope, cross-section-profile, snow-slope-tools]
sources:
  - "Slope and aspect: B. K. P. Horn, 'Hill shading and the reflectance map', Proceedings of the IEEE 69 (1981); the 3 × 3 weighted-difference formulas, written by fibub."
  - "Curvature: L. W. Zevenbergen and C. R. Thorne, 'Quantitative analysis of land surface topography', Earth Surface Processes and Landforms 12 (1987), with the general, profile and plan curvature definitions documented for ArcGIS; written by fibub."
  - "Hillshade: the standard Lambertian hillshade formula (illumination from a given azimuth and altitude); written by fibub."
  - "WGS 84 ellipsoid (radii of curvature for degree grids): published defining constants."
  - "TIFF 6.0, GeoTIFF and the ESRI ASCII grid layout: open specifications; reader and writer written by fibub, Deflate by the fflate library (MIT)."
  - "The example valley is made up by fibub."
flow:
  - { icon: mountain, label: "Open DEM" }
  - { icon: sliders, label: "Choose" }
  - { icon: image, label: "See map" }
  - { icon: download, label: "Download" }
---

## What it does

A **digital elevation model (DEM)** is a grid of ground heights. From it you can work out how steep each place is, which way it faces, how it would look lit by a low sun, and whether the ground is convex (ridges, hilltops) or concave (hollows, valley floors). This tool does all of that **in your browser**:

- **Slope** in degrees or percent, by Horn's method: each cell's slope comes from the 3 × 3 cells around it, with the four nearest neighbours weighted twice. This is the method used by gdaldem, ArcGIS and QGIS.
- **Aspect**: the compass direction each slope faces, 0° to 360° clockwise from north; flat cells have none.
- **Hillshade**: the relief lit by a sun at the direction and height you choose, with optional vertical exaggeration.
- **Curvature** after Zevenbergen and Thorne: general (total), profile (along the slope) and plan (across it), with the same signs and units as ArcGIS.
- **Statistics**: lowest and highest point, mean height, mean and median slope, the area in each slope class, and the share of the area facing each compass direction.

Trace where water flows across the same model with [[watershed-delineation]], and draw a profile along any line with the [[cross-section-profile|cross-section tool]].

## How to use it

1. Press **Open a DEM** and choose a GeoTIFF or an ESRI ASCII grid (.asc). The tool reads the cell size and position from the file.
2. Check **Cell size unit** and **Elevation unit**. A DEM in feet on a metre grid would otherwise give slopes about three times too steep.
3. Choose a layer: **Elevation**, **Hillshade**, **Slope**, **Aspect** or **Curvature**. Change the sun direction and height for the hillshade; the usual map setting is 315° (north-west) at 45°.
4. Tap the map to read the height, slope, aspect, hillshade and curvature at that cell.
5. Download the map as a PNG, the layer as a GeoTIFF or ASCII grid that lines up with your DEM, or a report.

## Degree grids

Global DEMs (SRTM, Copernicus, ASTER) are stored in latitude and longitude, with cells of 1 or 3 arc-seconds. A degree of longitude is 111 km at the equator but only 56 km at 60° north, so treating degrees as a fixed length gives wrong slopes. This tool works out each row's cell width and height in metres from the WGS 84 ellipsoid (the radii of curvature at that row's latitude), so slopes are right everywhere. gdaldem instead asks for one fixed scale for the whole grid.

## Edges and gaps

Cells on the edge of the grid, or next to cells without data, use the centre cell's height in place of the missing neighbour (as gdaldem does with -compute_edges). The edges therefore have values too, slightly flatter than the true ground.

## Worked example

Press **Use the example** for a made-up valley of 240 × 200 cells of 10 m (4.8 km²). The heights run from 204.2 m to 714.6 m, so the relief is **510.4 m**. The mean slope is **12.8°** (median 11.7°), and the steepest cell is 30.1°. The slope classes show 35.9 % of the area between 15° and 30°, the steepest class with much ground. Because the valley runs north to south, most slopes face west (33.9 %) or south-west (28.7 %) and east (14.7 %). Tapping the hill top at row 61, column 186 gives a height of 516.6 m, slope 17.8°, facing 294° (north-west).

## Accuracy

Checked against independent numpy code of the same published formulas (ArcGIS's aspect and hillshade conventions) on a projected GeoTIFF with gaps, a tiled Deflate geographic GeoTIFF at 60° north and an ASCII grid: slope, aspect, hillshade and the three curvatures agree to float32 precision (under 0.00002° for slope and aspect). Slope, aspect and general curvature also match xarray-spatial 0.10 on every interior cell. GeoTIFF and ASCII grid downloads open in rasterio (GDAL 3.12) with the original position and coordinate system.

## FAQ

**Why do my slopes look too steep or too flat?** Usually the units: a geographic grid read as metres, or heights in feet. Check the two unit settings.

**What do the curvature numbers mean?** Units are 1/100 per metre of elevation change. General curvature above zero means convex ground; below zero, concave. For profile curvature (ArcGIS sign), negative means the slope gets steeper downhill.
