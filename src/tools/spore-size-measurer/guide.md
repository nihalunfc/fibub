---
name: Spore size measurer
num: 329
shelf: science
section: mycology-and-plant-pathology
title: "Spore size measurer: length, width and Q from a microscope photo"
summary: "Calibrate with a scale bar, measure fungal spores by tapping the ends of their length and width (or fit ellipses automatically), and get mean, SD, range and Q = L/W in the usual mycological form, with a CSV of every spore. The photo stays in your browser."
status: live
ads: false
order: 329
icon: ruler
works: offline
updated: 2026-11-09
related: [hemocytometer, graph-digitizer, uncertainty-calculator]
sources:
  - "The (min–)low–high(–max) × (min–)low–high(–max) µm form with Q = length ÷ width per spore is the usual way spore measurements are written in mycology (described, for example, in Largent, D. L. (1977) How to Identify Mushrooms to Genus I: Macroscopic Features, and in many species descriptions)."
  - "Mean, sample standard deviation and percentiles (linear interpolation) are checked in the tests against NumPy on a made-up set of 10 spores; the moment ellipse (length and width as 4 √ of the second-moment eigenvalues) is checked against scikit-image regionprops (axis_major_length, axis_minor_length) within 1e-9 px."
  - "Otsu, N. (1979) A threshold selection method from gray-level histograms. IEEE Transactions on Systems, Man, and Cybernetics 9, 62–66 (the automatic threshold)."
  - "The example spores are drawn by the page with made-up lengths and widths; the tests check that the fitted sizes come back within 0.03 µm."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Photo" }
  - { icon: ruler, label: "Scale bar" }
  - { icon: pointer, label: "Measure" }
  - { icon: table, label: "L × W, Q" }
---

## What it does

Spore size and shape are among the most useful features for naming fungi. This page measures spores on a microscope photo and writes the result the way species descriptions do:

- **Calibrate.** Tap both ends of the scale bar (or of a stage micrometer photographed at the same settings) and type its length in µm.
- **Measure by tapping.** For each spore tap the two ends of its length, then the two sides of its width. The longer of the two is always taken as the length.
- **Or find them automatically.** The page separates spores from the background with a threshold, fits each patch with the ellipse that has the same spread, and takes its long and short axes as length and width.
- **Summary.** Length × width as (smallest–) middle range (–largest) µm, the mean ± SD, Q = length ÷ width for each spore with its range and mean (Qm), and n.

The photo is read on this page only and is never uploaded.

## How to use it

1. **Photo.** Open a sharp photo at high magnification (usually a 100× oil objective) with the spores lying flat, in water, KOH or Melzer's reagent as your method says.
2. **Scale bar.** The page asks for it first: tap one end, then the other, and type its length.
3. **Measure.** Tap spore after spore (four taps each), or set the limits and press *Find spores*, then use *Remove* to drop any that are clumped, tilted or not spores.
4. **Read the result.** Copy the summary line into your notes, and download the CSV or a report.

## What each option does

- **Spores look darker / lighter.** Brightfield usually shows dark spores on a light background; phase contrast or dark field may show light ones.
- **Threshold.** Blank uses Otsu's automatic threshold; type 0 to 255 to set it by hand.
- **Shortest and longest spore, largest Q.** Patches outside these limits are ignored, which removes dirt, the scale bar, touching pairs (too long) and debris.
- **Middle range.** *Mean ± SD* writes mean − SD to mean + SD between the brackets; *5th to 95th percentile* writes the central 90 % of the measurements, as some authors prefer. The brackets hold the smallest and largest values when they fall outside.

## Worked example

The made-up example has 24 spores drawn at 10 px per µm with a 10 µm scale bar. *Find spores* measures all 24 (the scale bar is left out because it is far too long for its width) and the page shows:

**(9.0–)9.6–11.3(–11.8) × (5.3–)5.6–6.6(–6.8) µm; mean 10.5 ± 0.9 × 6.1 ± 0.5 µm; Q = (1.42–)1.55–1.91(–2.12), Qm = 1.73 ± 0.18; n = 24**

which is exactly the summary of the sizes they were drawn with. Each fitted spore is within 0.03 µm of its drawn length and width.

## Tips

- Measure at least 20 to 30 mature spores from a spore print or one collection, chosen at random, not only the nice ones.
- Leave out the apiculus (the small peg) from the length, as most authors do, and say so.
- Calibrate at the same objective and camera settings as the photo; never trust a scale bar from a different magnification.
- With 1 px ≈ 0.1 µm, a tap error of one pixel is about 1 % of a 10 µm spore. Zoom in on your device for small spores.

## FAQ

**Why is Q given per spore and not as mean length ÷ mean width?** Q describes each spore's shape; averaging the ratios (Qm) is the standard practice and keeps round and long spores apart.

**Can I measure other things?** Yes: conidia, pollen, cells or anything elliptical. The units are whatever the scale bar is in, labelled µm.

**What about spores that touch?** The automatic fit sees touching spores as one long patch and leaves them out through the Q limit. Measure them by tapping, or remove them.
