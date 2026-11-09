---
name: Field sampling planner
num: 158
shelf: science
section: environmental-monitoring
title: "Field sampling planner: how many soil or water samples, grid spacing for hot spots, and random, stratified or grid sample points on your site map"
summary: "Plan where to take field samples. Draw your site boundary, work out how many samples you need (to estimate an average, compare with an action level, or find a hot spot of a given size), and lay the points out on a square or triangular grid, stratified random or simple random. Download the points as CSV or as GPX for a GPS."
status: live
ads: true
order: 4
icon: target
works: offline
updated: 2026-11-09
related: [non-detects, water-quality-index, rain-gauge-average, sample-size]
sources:
  - "Hot-spot geometry: the chance that a grid node falls inside a randomly placed circle, worked out exactly from the area of overlapping circles (the same geometry as Gilbert, Statistical Methods for Environmental Pollution Monitoring, 1987). Written by fibub."
  - "Sample sizes: the standard t-based formula for estimating a mean, and the normal-approximation formula with the ½ z² correction for a one-sample t test against an action level. Textbook statistics."
  - "Checked in the tests against Shapely (area of the union of discs over one grid period) and SciPy (t quantiles). The example site is made up."
flow:
  - { icon: pencil, label: "Boundary" }
  - { icon: calculator, label: "How many" }
  - { icon: target, label: "Lay out" }
  - { icon: download, label: "GPS file" }
---

## What it does

Before a soil, sediment or groundwater survey you need two answers: **how many samples** to take, and **where** to take them. This tool works out both from your site boundary and the goal of the survey, then draws the points on a map and gives you a list to take into the field.

To decide how many samples you need, use the [[sample-size]]; for results that come back below the detection limit, use [[non-detects|non-detect statistics]].

## How to use it

1. **Site boundary.** Paste or open the corners of the site, in order around the edge, as x and y in metres or as longitude and latitude. With degrees the tool works on a flat map around the middle of the site and gives the points back in degrees.
2. **How many samples.** Choose one of four ways:
   - **Giving it myself:** type the number, for example what your budget allows.
   - **Estimating the average:** give the expected coefficient of variation (CV, the standard deviation as a percentage of the average, from earlier data or a pilot), the margin of error you can accept and the confidence level. The tool finds n so that the t-based confidence interval is about ± that margin.
   - **Comparing with an action level:** give the expected standard deviation, the gap between the action level and the average you expect, α (the risk of calling a dirty site clean) and the power. The tool uses the usual formula for a one-sided, one-sample t test.
   - **Finding a hot spot:** give the radius of the smallest round hot spot that matters and the chance you want of landing at least one sample in it. The tool finds the widest grid that still does that.
3. **Layout.** A **square** or **triangular grid** (a triangular grid finds hot spots a little better for the same number of points), **stratified random** (the site is split into square cells with one random point in each, so points are spread out but not on a line), or **simple random**. The seed sets where the grid starts, so the same seed gives the same points; **New random layout** tries another.

## What you get

The number of samples needed and why, how many points landed inside the site, the grid spacing, the chance of hitting a hot spot (or the size of hot spot a grid is sure to find), a map with numbered points in walking order (row by row, turning at the end of each row), and the point list as CSV. With longitude and latitude you can also download a GPX file to load straight into a handheld GPS or phone app.

## Worked example

The made-up site is a 3.87 ha yard. We want a 90 % chance of hitting a round hot spot 12 m in radius, on a triangular grid. The widest grid that does it has points **24.1 m apart**, about 77 points over the site. With seed 1, **73 points** land inside the boundary (the number varies a little with where the grid starts). Any hot spot with a radius of 13.9 m or more is always hit.

Switch to **Estimating the average** with a CV of 60 %, ±20 % margin and 95 % confidence and the tool asks for **37 samples**. **Comparing with an action level** with a standard deviation of 40, a gap of 25, α 5 % and 80 % power asks for **18**.

## FAQs

**Why does the grid give a different number of points to the one needed?** A grid has a fixed spacing, so how many nodes fall inside an odd-shaped site depends on where it starts. On average it matches the number needed.

**Is the hot spot chance right for random layouts?** No. The chance is worked out for a regular grid. Random points leave gaps, so with the same number of points they miss hot spots more often.

**What about long, thin hot spots?** The tool assumes round ones. A long plume needs closer spacing across its short side.

**Does it send my site map anywhere?** No. All the sums and the map run in your browser, and nothing is uploaded.

Check the sampling rules of your regulator or client: many set minimum numbers or spacings for certain kinds of site.
