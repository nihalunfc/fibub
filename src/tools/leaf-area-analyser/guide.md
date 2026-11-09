---
name: Leaf area and canopy cover analyser
num: 323
shelf: science
section: botany-and-plant-science
title: "Leaf area meter from a photo or scan, and canopy cover % (excess green)"
summary: "Measure leaf area from a scan or phone photo with a reference square or a scale line, leaf by leaf, or the percentage of a photo covered by green plants. Automatic Otsu threshold you can override. The photo stays in your browser."
status: live
ads: false
order: 323
icon: image
works: offline
updated: 2026-11-09
related: [spectral-index-calculator, biodiversity-indices, tree-carbon, image-resizer, canopy-gap-analyser, stomatal-density-counter, leaf-disease-severity, plant-growth-analysis]
sources:
  - "Otsu, N. (1979) A threshold selection method from gray-level histograms. IEEE Transactions on Systems, Man, and Cybernetics 9, 62–66 (the automatic threshold)."
  - "Woebbecke, D. M. et al. (1995) Color indices for weed identification under various soil, residue, and lighting conditions. Transactions of the ASAE 38, 259–269 (excess green index, 2g − r − b)."
  - "Threshold, connected groups, hole filling and moment ellipses are written by fibub and checked in the tests against scikit-image 0.26 (threshold_otsu, regionprops) and SciPy (ndimage.label, binary_fill_holes) on a made-up test picture: same threshold, same groups pixel for pixel, ellipse axes within 1e-9 px."
  - "The example scan and crop photo are drawn by the page from made-up shapes of known pixel area, and the tests check that the page gets those areas back exactly."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Photo" }
  - { icon: ruler, label: "Scale" }
  - { icon: sliders, label: "Threshold" }
  - { icon: table, label: "Area" }
---

## What it does

This page does the job of a leaf area meter with nothing more than a scanner or a phone camera. It has two modes:

- **Leaf area.** Lay leaves flat on white paper (or a dark cloth) next to a square of known size, scan or photograph them from straight above, and the page counts the leaf pixels. The square tells it how big one pixel is, so leaf area = leaf pixels × area of one pixel. Each leaf is measured on its own and numbered on the photo.
- **Canopy cover.** Open a photo looking down on a crop, lawn or pasture (or straight up into green leaves) and the page reports the percentage of the picture covered by green plants, using the excess green index and an automatic threshold.

Your photo is read on this page only. It is never uploaded, and nothing is kept after you close the tab.

Use the leaf areas in a [[plant-growth-analysis|plant growth analysis]], and count the stomata on the same leaves with the [[stomatal-density-counter|stomatal density counter]].

## How to use it

1. **Photo.** Pick *Leaf area* or *Canopy cover*, then open a photo. Large photos are scaled to 1200 px on the long side; the scale is read on the same picture, so areas still come out right.
2. **Scale (leaf area).** Choose *A reference square in the photo*, type its side (for example 1 cm), tap *Tap the square* and tap inside the square. Or choose *A scale line I draw*, type the length, tap *Draw the scale line* and tap both ends of a ruler or scale bar.
3. **Threshold.** Leave the threshold blank for Otsu's automatic choice, which works well when the background is even. Type a number to override it.
4. **Area.** Read the total, the table of leaves, and download a CSV or an image, PDF or Word report.

## What each option does

- **Background.** *Light*: a pixel is leaf when the smallest of its red, green and blue values is at or below the threshold, so white paper and its shadows drop out while green, yellow and brown leaves stay. *Dark*: a pixel is leaf when the largest of red, green and blue is above the threshold.
- **Threshold.** 0 to 255 for leaf area. For canopy cover it is an excess green value from −1 to 2; green plants are usually above 0.1 and soil, stones and sky near 0.
- **Ignore specks smaller than.** Groups of fewer pixels (dust, soil grains) are not counted as leaves.
- **Fill holes inside leaves.** Off: holes made by insects are left out of the area, as a leaf area meter would. On: they are counted as leaf (the area the leaf had).
- **Colour what is counted.** Shows leaves in blue and the reference square in orange (canopy cover: plant pixels in orange), so you can check the threshold.

## Worked example

The made-up example is a scan at 100 px per cm with a 1 cm black square (10,000 px) and three leaves, one with a hole. With the automatic threshold (56 on a light background) the page shows **Leaf area: 7.195 cm² (3 leaves)**: leaf 1 is 1.728 cm², leaf 2 is 3.206 cm² (its hole of about 0.09 cm² left out) and leaf 3 is 2.261 cm². These are exactly the pixel counts the leaves were drawn with. Tick *Fill holes inside leaves* and the total becomes 7.288 cm².

In *Canopy cover*, the example crop photo shows **Canopy cover: 27.0 %** with an automatic excess green threshold of 0.106, again exactly the share of pixels drawn as plants.

## Tips

- Scan rather than photograph when you can: a scanner gives an even background and no perspective. If you use a phone, hold it parallel to the paper and keep the square at the same height as the leaves.
- Press leaves flat under clear glass or film. Curled leaves read small.
- Use a matt black or coloured square, cut accurately; an error of 2 % in its side is an error of 4 % in every area.
- For canopy cover, avoid strong shadows and photos with the sun in them; take several photos and average them.

## FAQ

**Why does the square have to be separate from the leaves?** The page finds the square as its own group of pixels. If it touches a leaf, the two join and the scale is wrong.

**Can it measure leaves that are not green?** Yes. On a light background anything clearly darker or more coloured than white paper counts, including red, purple and brown leaves.

**How accurate is it?** On a good scan, within about 1 %. The edges of each leaf add or lose half a pixel, so higher resolution helps small leaves most.

**What are length and width in the table?** The axes of the ellipse with the same spread as the leaf, a quick guide to leaf shape rather than a ruler measurement.
