---
name: Phase fraction and porosity
num: 855
shelf: science
section: microscopy-and-image-analysis
title: "Phase fraction and porosity from a micrograph: Otsu or colour segmentation, area fractions and error"
summary: "Open a micrograph, split it into up to 4 phases by grey level (automatic Otsu or your own thresholds) or by colours you pick, and get each phase's area fraction and area, porosity, a point-count standard error and a field-to-field confidence interval, with a coloured overlay to check the split. The image stays in your browser."
status: live
ads: false
order: 855
icon: sliders
works: offline
updated: 2026-11-09
related: [grain-size-intercept, gel-densitometry, uncertainty-calculator]
sources:
  - "Segmentation, area fractions, the point count and field statistics are written by fibub. The tests check Otsu and multi-level Otsu thresholds against scikit-image (and an exhaustive float64 search in Python), and the fractions, point counts and field intervals against NumPy and SciPy on a test image; CIELAB colours against scikit-image."
  - "The point-count error and field-to-field interval follow the general statistics of systematic point counting (binomial standard error; Student's t over fields), in the manner of ASTM E562. This page is not the standard and is not affiliated with ASTM."
  - "The example micrograph is drawn by the page: a made-up two-phase structure with round pores at 0.2 µm per pixel."
  - "An image you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Micrograph" }
  - { icon: ruler, label: "Scale" }
  - { icon: sliders, label: "Phases" }
  - { icon: percent, label: "Fractions" }
---

## What it does

The area fraction of a phase in a random section equals its volume fraction in the material (the Delesse principle), so measuring areas on a micrograph tells you how much of each phase, or how much porosity, a sample holds. This page splits the image into phases and counts.

- **Grey-level split.** Two, three or four phases separated by thresholds. Leave the box empty and the thresholds come from **Otsu's method** (for 3 or 4 phases, multi-level Otsu: every split is tried and the one with the biggest between-class variance wins). Or type your own, such as `70, 141`.
- **Colour split.** For stained, colour-etched or false-colour (EDS map) images: pick a typical colour for each phase by tapping the image. Each pixel goes to the nearest picked colour, measured as a CIELAB colour difference ΔE. A tolerance leaves out pixels that match nothing well; they are shown in white and reported as unassigned.
- **Area fractions.** Each phase's share of the classified pixels in the area, and its area in µm² once the scale is set.
- **Porosity.** Choose which phase is the pores and it is shown first.
- **Point count.** A regular grid of points (10 across by default) is read as a manual point count would be: the fraction of points on each phase, with the binomial standard error √(P(1 − P) / N). It tells you how precise a quick manual count would have been.
- **Fields.** The area is cut into tiles (4 across by default). The spread of each phase's fraction between tiles gives a Student-t confidence interval and the relative accuracy, as is done across fields of view. This is the honest error for a structure that is not even across the image.
- **Overlay.** The phases are tinted on the image so you can see at once whether the split follows the structure.

## How to use it

1. Open the micrograph and set the scale (two taps on the scale bar and its length), or type the pixel size.
2. Set the area to leave out the scale bar and data strip.
3. Choose grey or colour, the number of phases, and check the overlay. Adjust the thresholds or picks until the tints follow the phases.
4. Name the phases (darkest first for grey splits) and choose the pores, if any.
5. Read the table and download the CSV, the overlay PNG or a report.

## Worked example

The example is a made-up structure: light and dark grains with round black pores, 720 × 540 pixels at 0.2 µm per pixel (the 100-pixel bar is 20 µm), with the bottom 32-pixel data strip left out of the area. Three-phase Otsu gives thresholds 65 and 147, and the page reports

- **porosity 2.50 %**, the dark phase 26.1 % and the light phase 71.4 % of 14 630 µm², the same as the true made-up fractions to every digit shown;
- a 10 × 7 point grid with pores on 5 of 70 points: 7.14 % ± 3.08 %, which shows how rough a small manual point count is;
- 4 × 3 fields giving the dark phase 26.1 % ± 6.92 % at 95 % (relative accuracy 27 %): the dark grains are large and patchy, so many more fields would be needed for a precise value.

## Tips

- Use the image straight from the microscope, with even lighting and no contrast changes; uneven lighting moves pixels between phases.
- Polishing relief, scratches and pull-outs look like pores. Check the overlay before you trust a porosity.
- Phase boundaries are often a shade between the two phases; a threshold midway between the histogram peaks shares them fairly.
- Measure several fields across the specimen; one image describes one place.

## FAQ

**Why do the point count and the area fraction differ?** The area fraction uses every pixel; the point count uses only the grid points, so it scatters around the area fraction by about its standard error.

**What does relative accuracy mean?** The confidence interval divided by the mean. Around 10 % or better is a common target.

**Does my image leave the computer?** No. It is read and measured inside this page and is never uploaded or stored.
