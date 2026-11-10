---
name: Leaf disease severity
num: 328
shelf: science
code: T243
section: mycology-and-plant-pathology
title: "Leaf disease severity: lesion area % from a leaf photo, with severity classes"
summary: "Measure the share of a leaf covered by lesions, spots or yellowing from a photo, with colour rules you can tune, count the spots, and place the leaf on your own severity class scale. Several leaves averaged, CSV download. The photo stays in your browser."
status: live
ads: false
order: 328
icon: image
works: offline
updated: 2026-11-09
related: [biodiversity-indices, sample-size, spectral-index-calculator, disease-progress-audpc, leaf-area-analyser, spore-size-measurer, field-trial-designer, yield-trial-anova]
sources:
  - "Severity as diseased area ÷ total leaf area × 100 follows the usual definition in plant disease assessment (for example Bock, C. H. et al. (2010) Plant disease severity estimated visually, by digital photography and image analysis, and by hyperspectral imaging. Critical Reviews in Plant Sciences 29, 59–107)."
  - "Otsu, N. (1979) A threshold selection method from gray-level histograms. IEEE Transactions on Systems, Man, and Cybernetics 9, 62–66 (the automatic leaf threshold)."
  - "The colour rules (smallest or largest of R, G and B for the leaf, HSV hue and saturation for healthy tissue) are fibub's own, checked in the tests against a NumPy, scikit-image (rgb2hsv, threshold_otsu) and SciPy (binary_fill_holes, ndimage.label) version on a noisy test leaf: same leaf pixels and spots, lesion pixels within 2 of 10,439."
  - "The example leaf and the example class scale (0, 5, 10, 25, 50, 100 %) are made up; type the scale your protocol uses."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Photo" }
  - { icon: sliders, label: "Colours" }
  - { icon: percent, label: "Severity" }
  - { icon: table, label: "Classes" }
---

## What it does

Disease severity is the share of a leaf's area that shows symptoms. Scoring it by eye is quick but people over- and under-estimate, especially for small spots. This page measures it from a photo:

- **Leaf or background.** On a light background, a pixel is leaf when the smallest of its red, green and blue values is at or below the leaf threshold (white paper is high in all three; green, yellow and brown tissue is not). On a dark background, a pixel is leaf when the largest of the three is above the threshold.
- **Healthy or lesion.** Inside the leaf, a pixel is healthy when its hue (its place on the colour wheel) is in the healthy range and its colour is strong enough. Everything else on the leaf, such as yellow chlorosis, brown or black necrosis and grey mould, counts as lesion.
- **Severity.** Lesion pixels ÷ leaf pixels × 100, the number of separate spots, and the class on the scale you type.
- **Several leaves.** Add each leaf to the list for the mean severity and the mean class.

Your photo is read on this page only and is never uploaded.

Follow the severity through the season with [[disease-progress-audpc|disease progress (AUDPC)]], and measure the leaf itself with the [[leaf-area-analyser]].

## How to use it

1. **Photo.** Lay one leaf flat on white paper (or black card) and photograph it from straight above in even, shadow-free light. Open the photo.
2. **Colours.** Look at the coloured picture: green is healthy, orange is lesion. If healthy pale-green tissue turns orange, lower the first hue or the colour strength; if yellow halos should count as healthy, lower the first hue further.
3. **Severity.** Read the percentage and class. Type your own scale if you use one.
4. **Classes.** Add the leaf to the list, repeat for more leaves, and download the CSV or a report.

## What each option does

- **Leaf threshold.** Blank picks Otsu's automatic threshold; type a number from 0 to 255 if shadows or a tinted background are counted as leaf.
- **Healthy hue range.** 65° to 170° covers most green leaves. Yellow is near 60°, brown and orange near 20 to 40°.
- **Colour strength (saturation).** Grey, white and black tissue has little colour and becomes lesion when it is below this.
- **Smallest spot counted.** Only for the spot count; the severity uses every lesion pixel.
- **Holes count as lesion.** On: holes inside the leaf outline are filled and counted as lesion. Off: holes are left out of the leaf.

## Worked example

The made-up example leaf has 150,781 leaf pixels, and six brown spots drawn on it cover 10,246 of them. With the default settings the page shows **Severity: 6.8 % of the leaf, class 2 (over 5 up to 10 %)**, with 6 spots: the exact share that was drawn.

## Tips

- Use the same light, camera height and background for every leaf you compare.
- Check the coloured picture before trusting a number; leaf veins, glare and dirt can be mistaken for lesions.
- White powdery mildew on a white background may be read as background; use a dark background for white symptoms.
- Assess enough leaves (often 20 or more per plot) and report the mean.

## FAQ

**Is this a diagnosis?** No. The page measures how much of the leaf has abnormal colour. Deciding which disease (or nutrient problem or insect) caused it needs a plant pathologist or a lab.

**Why use classes at all?** Many field protocols record a class rather than a percentage, and some scales are made so each class covers a similar range for the eye. Measuring the percentage first and then placing it in a class gives the same record without the guesswork.

**Does photo size matter?** Not for the percentage. Large photos are scaled down to 1200 px on the long side, which changes pixel counts but not their ratio.
