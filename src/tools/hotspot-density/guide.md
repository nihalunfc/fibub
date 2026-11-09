---
name: Hot spot density
num: 768
shelf: science
section: criminology-and-legal-studies
title: "Hot spot map: kernel density (quartic or Gaussian) and Clark–Evans nearest neighbour index for your own points (free)"
summary: "Turn your own point data (x, y or latitude, longitude) into a hot spot map with kernel density estimation. Choose a quartic or Gaussian kernel, a rule-of-thumb or own bandwidth and the cell size; see contours, the top cells or separate peaks, and test for clustering with the Clark–Evans nearest neighbour index. Runs in your browser."
status: live
ads: false
order: 768
icon: target
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, gps-track-analyser]
sources:
  - "Kernel density estimation: Silverman (1986), Density Estimation for Statistics and Data Analysis (quartic/biweight and Gaussian kernels, rule-of-thumb bandwidths); Scott's rule (Scott 1992). Clark and Evans (1954), Distance to nearest neighbor as a measure of spatial relationships in populations. Methods only; no data or tables are copied."
  - "Written by fibub and checked in the tests against scikit-learn (KernelDensity), SciPy (cKDTree, normal distribution) and NumPy."
  - "The example incidents are made up."
flow:
  - { icon: table, label: "Points" }
  - { icon: sliders, label: "Bandwidth" }
  - { icon: target, label: "Hot spots" }
---

## What it does

Hot spot maps show where events bunch together: incidents, calls for service, collisions, complaints, sightings. This tool takes your own list of points and builds a **kernel density estimate (KDE)**: every point spreads a small smooth bump over the area around it, and the bumps are added up on a grid of cells. Where many bumps overlap, density is high. The result is a heat map with contour lines, a list of the highest cells, and a test of whether the points are more **clustered** than chance (the **Clark–Evans nearest neighbour index**). Your file is read in the browser and never uploaded.

## How to use it

1. **Paste or open your points**: one event per row, with x and y in metres (for example from a projected map grid), x and y in any other unit, or latitude and longitude in degrees. A header row with names like *x*, *y*, *lat*, *lon* lets the tool find the columns. Tick **Third column is a weight** if a row stands for several events.
2. **Kernel.** *Quartic* (also called biweight) is the usual choice in crime mapping: a rounded bump that falls to zero at the bandwidth, so the bandwidth is a search radius. *Gaussian* is a bell curve with the bandwidth as its standard deviation; it never quite reaches zero and gives smoother maps.
3. **Bandwidth.** The rule of thumb is 0.9 × min(standard distance, √(1/ln 2) × median distance to the mean centre) × n<sup>−0.2</sup>, a spatial version of Silverman's rule that resists outliers. Scott's rule is the average standard deviation of x and y × n<sup>−1/6</sup>. Or type your own, such as a walking distance that makes sense for your question.
4. **Cell size** sets the grid resolution (blank gives about 150 cells across). Smaller cells give a finer picture, not a different estimate.
5. **Study area** (km² for metres and degrees) is used only for the clustering test; blank uses the box around the points.
6. Read the peak, the map, the top cells or separate peaks, and the Clark–Evans result. Download the top cells or the whole grid as CSV, or the report as PNG, PDF or Word.

## What the numbers mean

- **Density** is events per km² (or per unit²): the kernel sum at the cell centre. Multiply by the cell area for **events in cell**. Over the whole grid the cells add up to the number of events.
- **Clark–Evans R** is the mean distance from each point to its nearest neighbour divided by what a random (Poisson) pattern of the same density would give, 0.5 × √(area / n). R below 1 means clustered, about 1 random, above 1 evenly spread. The z score uses the standard error 0.26136 / √(n² / area).

## Worked example

The made-up example has 120 incidents in a 2 km square: two clusters and some scattered background. With the quartic kernel and the rule-of-thumb bandwidth (**227.6 m**) on 16 m cells, the peak density is **602 events per km² at x 600, y 1416**, in the first cluster. Choose "Separate peaks" to see the second cluster further down the list. The Clark–Evans ratio is **R = 0.747** (z = −5.31, p < 0.001) using the box around the points (3.648 km²): clearly clustered.

## Tips and cautions

- The bandwidth matters far more than the kernel. Report it with the map, and try a smaller and a larger value to see which hot spots are stable.
- KDE shows where events happened, not risk per person: a busy shopping street has more incidents partly because more people are there. Divide by a population or footfall layer before comparing places.
- Clark–Evans has no edge correction; points near the edge of the study area have fewer neighbours, which pushes R up a little. Give the real study area when you know it.
- Duplicate points (many events at one address) pull R down; use a weight column instead.

## Frequently asked questions

**Is my data uploaded?** No. Everything runs in your browser and works offline.

**Can I use latitude and longitude?** Yes. They are turned into metres east and north of the middle of your points, which is accurate across a city or region.
