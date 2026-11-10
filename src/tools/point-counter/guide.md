---
name: Point counter
num: 873
shelf: science
code: T609
section: mineralogy-and-petrology
title: "Point counter"
summary: "Open a thin-section photo or any image, lay a grid or seeded random points over it and count each point into your own classes with number keys or buttons. Get modal percentages with binomial standard errors, Van der Plas and Tobi 2σ, exact 95 % ranges and CSV files. Works as a plain tally counter without an image."
status: live
ads: false
order: 873
icon: target
works: offline
updated: 2026-11-09
related: [ternary-plot-maker, grain-size-stats, mineral-id-key, cipw-norm, phase-fraction, grain-size-intercept, mineral-formula, coral-cover-calculator]
sources:
  - "Methods (formulas only, no data copied): binomial standard error of a proportion; Van der Plas and Tobi (1965) 2σ precision chart for point counting; Clopper and Pearson (1934) exact and Wilson (1927) score intervals."
  - "Made-up thin section: random Voronoi grains drawn by fibub; its class areas are measured from its own pixels."
flow:
  - { icon: image, label: "Image" }
  - { icon: target, label: "Points" }
  - { icon: pointer, label: "Count" }
  - { icon: percent, label: "Modal %" }
---

## What it does

Point counting is the classic way to measure how much of each mineral or component a rock contains (its **modal composition**): put points over a thin section, say what lies under each one, and the share of points in each class estimates its share of the area. This page does the bookkeeping:

- **Your image**: open a photo of a thin section, a polished slab, an outcrop or anything else. It is drawn in the page and never uploaded.
- **Points**: a regular **grid** (rows × columns) or **random points** from a seed, so the same seed gives the same points again. A margin keeps points off the edges.
- **Counting**: press the class's **key** (1, 2, 3 … or any letter you choose) or tap its button. The page moves to the next point and scrolls to it when you are zoomed in. Tap a point to go back to it, use the arrow keys, and **undo** with Backspace or Ctrl+Z.
- **Results**: count and percentage per class, the binomial **standard error** √(p(1 − p)/N), the **2σ** of Van der Plas and Tobi (1965), an **exact 95 % range** (Clopper-Pearson), and how many points you would need for a target precision. A chart shows the Van der Plas and Tobi lines (2σ against N for proportions from 5 to 50 %) with your classes on it.
- **No image?** The class buttons and keys work as a plain **tally counter**, for counting under the microscope.

Name each mineral first with the [[mineral-id-key|mineral identification key]], then plot the counts on a [[ternary-plot-maker|ternary diagram]] to name the rock.

## How to use it

1. List your classes, one per line: a key, then a name (for example `1 Quartz`).
2. Open an image, or press **Use a made-up thin section** to practise.
3. Choose a grid or random points and press **Place points**. For thin sections, a point spacing larger than the biggest grain avoids counting one grain twice.
4. Count: press keys or tap buttons. The yellow ring marks the current point. Zoom to 2× or 4× on a phone.
5. Read the table, then download the results and the list of every point as CSV, or the report as an image, PDF or Word file.

## Worked example

Say 300 points on a sandstone give 126 quartz. Then p = 126/300 = **42.0 %**, SE = √(0.42 × 0.58 / 300) = **2.85 %**, and 2σ = **5.70 %**: a repeat count would very likely land between about 36 and 48 %. The exact 95 % range is 36.4 to 47.8 %. To get 2σ down to ±2 %, you would need 4 × 0.42 × 0.58 / 0.02² = **2,436 points**. The chart shows the same thing: the 2σ lines fall only with the square root of N, so halving the error takes four times the points.

The made-up thin section has known areas measured from its pixels, shown as "True area %", so you can see how close a 300-point count comes.

## FAQ

**Grid or random?** A grid is the usual choice and spreads the points evenly. Random points avoid lining up with a regular fabric such as laminae.

**Is my image stored?** No. It stays in this page on your device. Counts are lost when you close the page, so download the CSV first.

**Can I count without a photo, at the microscope?** Yes: leave the image out and press the keys as you step the stage. The tally works the same.
