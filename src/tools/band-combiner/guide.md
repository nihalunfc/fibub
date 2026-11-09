---
name: Band combiner
num: 895
shelf: science
section: remote-sensing-and-gis
title: "Band combiner: true and false colour composites from satellite bands, with contrast stretch, in the browser"
summary: "Open a multiband GeoTIFF or one file per band, put any three bands on red, green and blue (true colour, colour infrared, SWIR and more), stretch each band (min-max, percentile clip, standard deviation, histogram equalisation or your own limits, plus gamma), read any pixel's values and save the composite as a full-size PNG. Files never leave your device."
status: live
ads: false
order: 895
icon: image
works: offline
updated: 2026-11-09
related: [spectral-index-calculator, fits-viewer, image-stacker, figure-checker, vector-map-viewer, tissot-explorer, dem-terrain, science-colour-palette]
sources:
  - "Stretches, histogram equalisation, gamma and the composite are written by fibub. The tests check them against NumPy (percentile, mean, standard deviation, histogram) and scikit-image 0.26 (exposure.rescale_intensity, equalize_hist with and without a mask, adjust_gamma) on made-up bands."
  - "Band combinations (true colour, colour infrared, SWIR, agriculture, land and water) and the Sentinel-2 and Landsat 8/9 band numbers are general remote sensing knowledge."
  - "TIFF 6.0 and the GeoTIFF tags: open specifications; the reader is fibub's own (shared with the spectral index calculator)."
  - "The example scene and its reflectance values are made up by fibub for illustration."
  - "Files you open are read on the page only. They are never uploaded or stored."
flow:
  - { icon: image, label: "Bands" }
  - { icon: sliders, label: "Combine" }
  - { icon: eye, label: "Stretch" }
  - { icon: download, label: "PNG" }
---

## What it does

A satellite or drone camera records several **bands**, each one a grey picture of how much light of one colour (or of invisible near and shortwave infrared) the ground reflects. A screen has only three colours. A **band combination** puts any three bands on the screen's red, green and blue, which is how analysts read land cover, crops, water, burn scars and towns at a glance.

Raw bands are usually dark and flat, because most pixels use a small part of the possible values. A **stretch** spreads each band's useful values over the full range from black to full colour. This page does both, from **your own files, on your own device**: nothing is uploaded and the page works offline once loaded.

Turn the bands into vegetation and water indices with the [[spectral-index-calculator]], and lay map features over the scene in the [[vector-map-viewer]].

## How to use it

1. Press **Open band files** and choose one multiband GeoTIFF, or several single-band files of the same size (GeoTIFF, TIFF, PNG or JPEG). Or press **Use the example scene**.
2. Pick a **combination**, or choose which band shows as red, green and blue. The ready-made combinations find bands by name ("Red", "NIR") or, if you choose the sensor, by band number in the file names (Sentinel-2 `B04`, Landsat `B5`).
3. Pick a **stretch** and, if you like, a **gamma**. Each band is stretched from its own values.
4. Tap the picture (or type a row and column) to read that pixel: its value in every band, its map coordinates and the colour it is shown as.
5. Save the composite as a **full-size PNG**, the band statistics as **CSV**, or a report as PNG, PDF or Word.

## The combinations

- **True colour** (red, green, blue): close to what your eye sees, often hazy.
- **Colour infrared** (NIR, red, green): healthy plants reflect a lot of near infrared, so they show bright red; water is dark; towns are blue-grey.
- **Shortwave infrared** (SWIR2, NIR, red): burned ground shows red-brown, plants green; it sees through thin haze.
- **Agriculture** (SWIR1, NIR, blue): growing crops bright green, bare soil mauve.
- **Land and water** (NIR, SWIR1, red): water dark blue to black, land in browns and greens.

## The stretches

- **Minimum to maximum**: the band's lowest value shows black and its highest full colour. One very bright pixel (a roof, a cloud) can leave the rest dark.
- **Percentile clip**: values below the low percentile show black and above the high one full colour. 2 % and 98 % is a common start; it ignores a few extreme pixels.
- **Mean ± k standard deviations**: shows the band from its mean minus k standard deviations to its mean plus k (population standard deviation).
- **Histogram equalisation**: spreads the values so each display level holds about the same number of pixels (a histogram of 256 bins between the band's minimum and maximum, as in scikit-image). It brings out detail but changes colours, so it is for looking, not for comparing scenes.
- **Limits I type**: your own black and full-colour values for each channel, for example to show several scenes with the same stretch.
- **Gamma**: applied after the stretch as stretched^(1/gamma). Above 1 brightens the mid-tones; below 1 darkens them.

## Worked example

Press **Use the example scene**. It is a made-up 240 × 180 pixel scene of 10 m pixels with six bands of reflectance: a lake and a river, forest, crops of different vigour, bare fields, a town and a burn scar. It opens in **colour infrared** with a 2 % to 98 % percentile clip, so the big line reads "R 4, G 3, B 2: NIR / Red / Green". The crops and forest show red, brighter where the made-up vigour is higher; the lake and river are near black; the town is grey-blue and the bare fields pale.

The table shows, for each channel, the band values that map to black and to full colour. Choose **Shortwave infrared** and the burn scar (lower right) turns red-brown. Choose **True colour** and the picture becomes the dull, hazy view the eye would see. The pixel box starts at the centre of the scene (row 90, column 120) and lists all six band values there.

## Tips

- Use the same **Limits I type** for scenes from different dates, so a change in colour means a change on the ground, not in the stretch.
- Surface reflectance products often store whole numbers (such as reflectance × 10,000). The stretch does not mind; the pixel box shows the stored values.
- No-data pixels (the file's no-data value, NaN, or transparent PNG pixels) are skipped by the statistics and saved as transparent.
- For a single band, put it on all three channels for a grey picture.
- For indices such as NDVI, use the [spectral index calculator](/science/spectral-index-calculator/).

## FAQ

**Are my files uploaded?** No. They are read by your browser and stay on your device. Nothing is stored after you close the page.

**Which files work?** GeoTIFF and TIFF (8, 16 or 32-bit, uncompressed, LZW, Deflate or PackBits; not JPEG-compressed or BigTIFF), PNG and JPEG. Single-band files must all be the same size. Sentinel-2 JPEG 2000 files need converting to GeoTIFF first.

**Why do the percentiles say "from up to 4 million pixels"?** On very large bands the percentiles are worked out from up to 4 million values evenly spread through the band, which keeps the page fast and changes the limits very little.

**Does the PNG keep the georeferencing?** No; a PNG has no place for it. The GeoTIFF bands you opened keep it, and the pixel box shows map coordinates.

**Why does equalisation change the colours so much?** Each band is equalised by itself, so the balance between red, green and blue changes. Use a percentile clip when colours matter.
