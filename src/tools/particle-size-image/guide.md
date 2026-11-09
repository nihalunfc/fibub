---
name: Particle size from an image
num: 854
shelf: science
section: microscopy-and-image-analysis
title: "Particle size from a micrograph: equivalent diameter, Feret, circularity and D10, D50, D90"
summary: "Open an SEM, TEM or optical image of particles, calibrate the scale bar and the page finds every particle: threshold, hole filling, a watershed split of touching particles, then area, equivalent diameter, Feret maximum and minimum, circularity and aspect ratio, with edge particles left out, a size histogram and D10, D50 and D90. The image stays in your browser."
status: live
ads: false
order: 854
icon: target
works: offline
updated: 2026-11-09
related: [grain-size-intercept, phase-fraction, uncertainty-calculator]
sources:
  - "Thresholding, hole filling, labelling, the distance transform, the watershed split and the particle measures are written by fibub. The tests check them against SciPy (binary_fill_holes, distance_transform_edt, ConvexHull) and scikit-image 0.26 (label, regionprops, h_maxima and watershed) on a test image, and the D values against numpy.percentile."
  - "Perimeter uses the same 4-neighbour weighted outline estimate as scikit-image; circularity is 4πA/P²."
  - "The example micrograph is drawn by the page: made-up round particles with log-normal sizes at 0.1 µm per pixel."
  - "An image you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Micrograph" }
  - { icon: ruler, label: "Scale" }
  - { icon: target, label: "Particles" }
  - { icon: chart, label: "Sizes" }
---

## What it does

This page measures the size and shape of every particle in a micrograph, the way image-analysis software does, inside your browser.

1. **Threshold.** Pixels brighter (or darker) than a grey level are particle. The automatic level is Otsu's method.
2. **Fill holes.** Hollow particles and bright rims with dark centres become solid.
3. **Ignore specks.** Blobs smaller than a few pixels are noise and are dropped.
4. **Split touching particles.** The distance from every particle pixel to the background is a hill over each particle; where two particles touch the hill dips. A watershed cuts along the dip, starting from peaks that stand at least the *split strength* above the dip (an h-maxima rule), so small bumps on one particle do not split it.
5. **Measure.** For each particle:
   - **Area** and the **equivalent diameter**, the diameter of a circle with the same area, √(4A/π);
   - **Feret maximum and minimum**, the largest and smallest caliper width of its outline;
   - **Circularity** 4πA/P², 1 for a circle and smaller for rough or long shapes;
   - **Aspect ratio**, major ÷ minor axis of the ellipse with the same second moments.
6. **Edge particles.** A particle cut by the edge of the area would be measured too small, so it is left out (grey) unless you untick the box.
7. **Distribution.** A histogram and **D10, D50 and D90**: the diameters below which 10, 50 and 90 % of the particles lie, by number or by area (by area weights each particle by its area, closer to what a laser diffraction instrument reports by volume).

## How to use it

1. Open the image and calibrate: tap both ends of the scale bar and type its length, or type the pixel size.
2. Set the area so the scale bar and data strip are left out.
3. Choose bright or dark particles and check the coloured overlay: every particle should be tinted on its own, with its number.
4. If touching particles are not cut, lower the split strength; if single particles are cut in two, raise it.
5. Tap any particle that is dust or a cluster to leave it out. Download the CSV for every particle, or a report.

## Worked example

The example has 90 made-up round particles at 0.1 µm per pixel (the 100-pixel bar is 10 µm), drawn with log-normal sizes around 3.4 µm; some touch and some are cut by the edges. With the automatic threshold of 89, holes filled, specks under 10 pixels ignored and a split strength of 2 pixels, the page finds all 90, leaves out the 15 cut by the edge of the area and measures 75:

- **D50 = 3.26 µm**, D10 = 2.17 µm and D90 = 4.59 µm (span 0.74). The drawn sizes of those 75 particles give 2.17, 3.25 and 4.58 µm.
- Mean circularity 0.948 and mean aspect ratio 1.01: round, as drawn.

Untick *Split touching particles* and the touching ones are measured as clumps: 78 found, 64 measured and D90 rises to 4.86 µm.

## Tips

- Particles need a few pixels across to be measured well: below about 10 pixels in diameter, shape numbers (circularity, Feret minimum) are rough.
- Do not adjust contrast before opening the image; set the threshold here instead.
- Measure several hundred particles from several images for a size distribution you can report.
- For agglomerates the image shows clusters, not primary particles; the split only helps for particles that touch at a neck.

## FAQ

**Why is circularity under 1 for round particles?** The outline of a shape made of square pixels is a little longer than the true circle, so 4πA/P² reads around 0.9 for well-resolved circles.

**What is the difference between Feret and equivalent diameter?** Feret is a caliper width and depends on direction (maximum and minimum are given); the equivalent diameter comes from the area alone.

**Why are rings cut into pieces?** A hollow particle with its hole kept has a ring-shaped distance hill with several equal peaks, so the split cuts it (scikit-image does the same). Fill the holes, or untick the split for such images.

**Does my image leave the computer?** No. It is read and measured inside this page and is never uploaded or stored.
