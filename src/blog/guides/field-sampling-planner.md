---
title: "How many soil samples do you need, and where to take them"
summary: "Plan a soil or water survey: sample numbers for an average, an action level or a hot spot, grid spacing, random and stratified layouts, with a worked 1.5 ha example."
tools: [field-sampling-planner, sample-size, non-detects, water-quality-index]
updated: 2026-11-10
sources:
  - "Hot-spot search on square and triangular grids: the geometry of circles and grid nodes, as treated in Gilbert R.O. (1987), Statistical Methods for Environmental Pollution Monitoring, Van Nostrand Reinhold."
  - "Sample size for a mean (t-based confidence interval) and for a one-sided one-sample t test (normal approximation plus ½ z²): standard textbook statistics."
  - "The site and all numbers in the worked example are made up."
---

The field sampling planner answers the two questions at the start of every soil, sediment or groundwater survey: how many samples to take, and where on the site to take them. You give it the outline of the site and the aim of the survey, and it returns a number, a spacing, a map of numbered points and a file of coordinates to take outside. It suits environmental consultants, earth science students and anyone checking a garden or school field. For the statistics in more depth, use the [[sample-size|sample size calculator]]; when lab results come back as "below the detection limit", the [[non-detects|non-detect tool]] handles them, and for water samples the [[water-quality-index]] sums them up.

## What it is

A survey can have three different aims, and each needs a different count.

**Estimating the average.** If the question is "what is the typical level here?", the count depends on how much the values vary and how close you want the answer. Variation is given as the **coefficient of variation (CV)**: the standard deviation divided by the average, as a percentage. The tool solves

n = (t × CV ÷ E)²

where E is the margin of error as a fraction of the average and t comes from Student's t distribution for the chosen confidence.

**Comparing with an action level.** Regulators often set a level above which a site needs clean-up. To show the average is safely below it, the tool uses

n = ((z_α + z_β) × σ ÷ Δ)² + ½ z_α²

with σ the expected standard deviation, Δ the gap between the action level and the expected average, α the risk of calling a dirty site clean, and 1 − β the **power** (the chance of showing a clean site is clean).

**Finding a hot spot.** A spill or buried tank makes a small patch of high values. Here the question is geometry: if a round patch of radius r sits somewhere at random, what is the chance that at least one grid point lands inside it? The tool works this out exactly from the overlap of circles around the grid points, then finds the widest spacing that still gives your chosen chance.

## How to use it

1. Under **Site**, choose **x and y in metres** or **longitude and latitude**, then type or paste the corners of the site boundary in order, one per row. You can also open a boundary file.
2. Under **How many samples**, choose how the number is set: **Giving it myself**, **Estimating the average**, **Comparing with an action level** or **Finding a hot spot**, and fill in the boxes that appear.
3. Pick a **layout**: square grid, triangular grid, stratified random (one random point per square cell) or simple random.
4. Change the **random seed** to move where the grid starts, or press **New random layout** to try the next seed.
5. Read the plan: the points laid out, the spacing, the hot-spot chance, and the map with numbered points in walking order. Open **Sample points (table)** for the list.
6. Press **Download points (CSV)**, or, with longitude and latitude, **Download points for GPS (GPX)** to load into a phone or handheld GPS.

## A worked example

Take a made-up rectangular plot 150 m by 100 m, entered as four corners: (0, 0), (150, 0), (150, 100), (0, 100). Its area is **15,000 m², or 1.5 ha**.

Suppose an old fuel tank may have leaked, and a patch of contamination 8 m in radius would matter. We want an **80 % chance** of hitting it, on a **square grid**.

The tool finds a spacing of **15.8 m**. Each grid point then stands for 15.8 × 15.8 ≈ 250 m² of ground, so the site needs about 15,000 ÷ 250 ≈ **60 samples**. With seed 1, **63 points** fall inside the boundary. A patch of radius **11.2 m** or more (half the diagonal of a grid square, 15.8 ÷ √2) would always be hit.

Switch to a **triangular grid** and the spacing widens to **17.0 m** for the same 80 % chance, still about 60 points on average.

Now suppose the aim is the average instead. Earlier results suggest a CV of **40 %**, and we want the average within **±15 %** at **90 % confidence**. The tool asks for **22 samples**. Check: with t = 1.721 (21 degrees of freedom), (1.721 × 0.40 ÷ 0.15)² ≈ 21.1, rounded up to 22.

To compare with an action level, with a standard deviation of **30 mg/kg**, a gap of **20 mg/kg**, α of **5 %** and **90 % power**, it asks for **21 samples**: ((1.645 + 1.282) × 30 ÷ 20)² + ½ × 1.645² ≈ 19.3 + 1.4 = 20.6, rounded up.

## Where it is used

- **Land contamination surveys** before housing is built on old industrial ground.
- **Agriculture**: grid soil sampling for nutrients and pH before variable-rate fertiliser.
- **Ecology**: placing quadrats or camera traps across a habitat, with stratified random points so they spread out but avoid a regular line.

## Common mistakes

- **Corners out of order.** If the boundary crosses itself the tool stops and says so. List corners going round the edge in one direction.
- **Guessing the CV too low.** Soil data are often very uneven; a pilot round of a few samples gives a far better CV than a guess.
- **Expecting random layouts to find hot spots.** The hot-spot chance is only worked out for grids. Random points leave gaps.
- **Skipping the local rules.** Many regulators set minimum numbers or spacings. Check the official source for your site type.

## Questions people ask

**Why do I get 63 points when the plan says 60?** A grid has a fixed spacing, so the count inside a boundary depends on where it starts. Try a few seeds: the average is close to the number needed.

**Should I use degrees or metres?** Use metres if your site plan already has them. For degrees, the tool flattens the map around the middle of the site, which is fine for sites up to a few tens of kilometres across.
