---
name: Landmark digitiser and Procrustes analysis
num: 408
shelf: science
section: paleontology
title: "Procrustes analysis online: digitise landmarks on photos, GPA, centroid size and shape PCA in your browser"
summary: "Tap landmarks on your own photos or paste TPS or a table of coordinates, then run a generalised Procrustes analysis: centroid sizes, aligned shapes, Procrustes distances and a PCA of shape with a scores plot and CSV export. Nothing is uploaded."
status: live
ads: false
order: 408
icon: target
works: offline
updated: 2026-11-09
related: [graph-digitizer, plot-maker, biodiversity-indices, artefact-scale-tool]
sources:
  - "Generalised Procrustes analysis as described by Gower (1975) and Rohlf and Slice (1990): centre, scale to unit centroid size, rotate by least squares to the mean, repeat. Tangent-space projection as in Rohlf (1999) and the geomorph R package. TPS format as written by tpsDig (F. J. Rohlf)."
  - "Checked against an independent numpy implementation (SVD rotations) of the full analysis on the example and three random data sets (aligned coordinates, mean shape, distances, tangent coordinates, PCA variances and scores agree to 1e-9 or better), and against scipy.spatial.procrustes for the two-shape fit and every pairwise distance."
  - "The example specimens and their landmarks are made up for this tool."
flow:
  - { icon: image, label: "Photos" }
  - { icon: target, label: "Landmarks" }
  - { icon: shrink, label: "Align (GPA)" }
  - { icon: chart, label: "Shape PCA" }
---

## What it does

Geometric morphometrics compares the shapes of things, such as fossils, bones, teeth, leaves or shells, from **landmarks**: points that can be found on every specimen, like the tip of a snout or the place where two sutures meet. Before shapes can be compared, the differences that are not shape have to be removed: where the specimen sat in the photo, how big it is and which way it was turned. A **generalised Procrustes analysis (GPA)** does exactly that:

1. Each specimen is moved so the centre of its landmarks (the centroid) is at 0, 0.
2. It is scaled to a **centroid size** of 1. Centroid size is the square root of the summed squared distances of the landmarks from the centroid; the tool reports each specimen's original centroid size, which is the usual size measure.
3. Each specimen is rotated to fit the mean shape as closely as possible (least squares). The mean is worked out again, and the rotations repeat until the mean stops changing.

What is left is shape. The tool then shows the **Procrustes distance** of each specimen from the mean shape and runs a **principal component analysis (PCA)** of the aligned shapes, so you can see the main ways the shapes vary and which specimens group together.

Mirror images are never used to improve a fit: a left and a right side count as different shapes, so digitise one side, or mirror them yourself first.

To estimate body mass from the same specimens, use the [[body-mass-estimator|allometric body mass estimator]]; to measure from a photo with a scale bar, the [[artefact-scale-tool|artefact measurement scale tool]].

## How to use it

- **Paste or open landmarks.** TPS files (from tpsDig and many other programs) work as they are: `LM=` with the number of landmarks, one `x y` line per landmark, then `ID=` or `IMAGE=`. `SCALE=` is applied, so centroid sizes come out in real units. Curve points are left out. You can also paste a table with one specimen per row: a name, then x1, y1, x2, y2 and so on.
- **Or digitise your own photos.** Set the number of landmarks, open one photo per specimen and tap the landmarks in the same order on every photo. When a photo has them all, its TPS block is added to the box and the next photo opens. *Undo* removes the last tap. The y axis runs upwards, as in tpsDig. Add a scale (units per pixel) if your photos show a scale bar.
- **Tangent space** projects the aligned shapes onto the flat space that touches the curved shape space at the mean. Most software does this before a PCA; for small variation it changes very little.
- **Groups** colour the plots by the start of each name, up to the first `-` or `_`.

## Worked example

The example has 12 made-up specimens of an invented fossil, 7 landmarks each, from two quarries (A-01 to A-06 and B-01 to B-06), photographed at different sizes and angles. The GPA converges in 3 iterations. A-01 has a centroid size of 269.67 and lies 0.1010 from the mean shape; centroid sizes run from 207.2 to 376.1. The Procrustes variance is 0.007497.

**PC1 holds 76.5 % of the shape variation** and splits the quarries cleanly: every A specimen has a positive PC1 score (A-01 is 0.0890) and every B specimen a negative one (B-05 is −0.0904). Choose *Shape change along PC1* to see what that means: the B shapes are longer from landmark 1 to landmark 5 and narrower across landmarks 3 and 7. PC2 holds only 7.5 %, so it is mostly scatter.

## Downloads

*Aligned coordinates* gives every specimen's Procrustes coordinates with its centroid size and distance, plus the mean shape. *PC scores* gives every component with its variance. *Distance matrix* gives the partial Procrustes distance between every pair of specimens, each pair fitted to each other. Image, PDF and Word give a report with both plots.

## FAQ

**Which distance is this?** The partial Procrustes distance: the square root of the summed squared differences between two shapes at unit centroid size after the best rotation. scipy's `procrustes` reports a disparity that also scales one shape to fit; for two shapes at Procrustes angle ρ, the partial distance is 2 sin(ρ/2) and the disparity is sin²ρ.

**How many components can there be?** At most 2 × landmarks − 4 for 2D data (4 degrees of freedom are used up by position, size and rotation), and at most one fewer than the number of specimens.

**Can I use 3D landmarks?** Not here; this tool is for 2D landmarks.

**Are my photos uploaded?** No. Photos and coordinates stay in your browser, and the tool works offline.
