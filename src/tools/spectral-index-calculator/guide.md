---
name: Spectral index calculator
num: 135
shelf: science
section: remote-sensing-and-gis
title: "NDVI and spectral index calculator for your own GeoTIFF: NDWI, MNDWI, NBR, EVI, SAVI, NDBI, in the browser"
summary: "Open your own multiband GeoTIFF or one file per band. Map the bands, apply the product's scale and offset, and get NDVI, NDWI, MNDWI, NBR, EVI, SAVI, NDBI or your own normalised difference, with a coloured map, histogram, statistics, a threshold area and downloads as GeoTIFF or CSV. Files never leave your device."
status: live
ads: false
order: 1
icon: image
works: offline
updated: 2026-11-08
related: [gps-track-analyser, fits-viewer, biodiversity-indices, plot-maker]
sources:
  - "Index formulas (NDVI, NDWI after McFeeters, MNDWI after Xu, NBR, EVI with its standard coefficients 2.5, 6, 7.5 and 1, SAVI after Huete, NDBI): the published equations, written by fibub; no data tables are copied."
  - "TIFF 6.0 and the GeoTIFF tags (pixel scale, tie point, geokeys): open specifications, reader and writer written by fibub; Deflate uses the fflate library (MIT)."
  - "Pixel areas on geographic grids use a sphere of radius 6 371 008.8 m (IUGG mean radius)."
  - "The example scene and its reflectance values are made up by fibub for illustration."
flow:
  - { icon: image, label: "GeoTIFF" }
  - { icon: sliders, label: "Bands" }
  - { icon: calculator, label: "Index" }
  - { icon: download, label: "Download" }
---

## What it does

Satellites and drones record how much light the ground reflects in several **bands**: blue, green, red, near infrared (NIR) and shortwave infrared (SWIR). Healthy plants reflect a lot of NIR and little red; water absorbs NIR; burned ground reflects more SWIR. A **spectral index** combines two or three bands so these differences stand out.

This tool reads **your own GeoTIFF files** in the browser, works out the index for every pixel, and shows a coloured map, a histogram and statistics. It counts the pixels above or below a threshold and turns them into an area. You can download the index as a 32-bit GeoTIFF that keeps the original georeferencing, so it opens in GIS software, or as a CSV sample.

**Your files stay on this device.** Nothing is uploaded; the page works offline once loaded.

For the plants and animals at the same sites, use [[biodiversity-indices]]; for a GPS track across the area, the [[gps-track-analyser]].

## How to use it

1. Press **Open GeoTIFF files**. Choose one multiband file, or several single-band files of the same size (for example one file per band from a satellite download).
2. Tell the tool which band is blue, green, red, NIR, SWIR1 and SWIR2. You only need the bands your index uses.
3. Enter the **scale and offset** from your product's documentation if the file stores whole numbers instead of reflectance. Leave 1 and 0 otherwise.
4. Pick the index, the colours and a threshold. Read the map, histogram and numbers, and download what you need.

## The indices

- **NDVI** = (NIR − Red) ÷ (NIR + Red): plant cover and vigour. Bare soil is near 0.1 to 0.2; dense green crops 0.6 to 0.9; water is below 0.
- **EVI** = 2.5 × (NIR − Red) ÷ (NIR + 6 Red − 7.5 Blue + 1): like NDVI but saturates less over dense forest. It needs reflectance (0 to 1).
- **SAVI** = (1 + L) × (NIR − Red) ÷ (NIR + Red + L): reduces the effect of bright soil; L = 0.5 suits most places.
- **NDWI** = (Green − NIR) ÷ (Green + NIR) and **MNDWI** = (Green − SWIR1) ÷ (Green + SWIR1): open water is above 0. MNDWI separates water from towns better.
- **NBR** = (NIR − SWIR2) ÷ (NIR + SWIR2): burned areas drop sharply. Compare before and after a fire.
- **NDBI** = (SWIR1 − NIR) ÷ (SWIR1 + NIR): built-up land and bare ground are higher.
- **Custom**: (a − b) ÷ (a + b) for any two bands.

## Worked example

Press **Use the example scene**: a made-up 200 × 150 pixel image of 30 m pixels with a lake, forest, fields, a town, bare soil and a burn scar. With **NDVI** above 0.3, the forest and green fields stand out: 53 % of the pixels, **14.4 km²**. Switch to **NDWI** above 0 to measure the lake (10 %, **2.79 km²**), or to **NBR** below −0.2 to pick out the burn scar alone (5 %, **1.41 km²**).

## Good to know

- Indices only mean what they should on **surface reflectance** (atmospherically corrected) data. Top-of-atmosphere data gives shifted values.
- Clouds, shadows and snow confuse every index; mask them first if you can.
- Areas use the file's own pixel size (projected files in metres, or degrees converted cell by cell). If the file has no georeferencing, enter a pixel size.

## FAQ

**Which files can it open?** Classic TIFF and GeoTIFF with 8, 16 or 32-bit integers or 32 or 64-bit floats, in strips or tiles, uncompressed or compressed with LZW, Deflate or PackBits. BigTIFF and JPEG compression are not supported yet.

**Is anything sent to a server?** No. The page has no upload code; the file is read into memory in your browser and dropped when you close the tab.
