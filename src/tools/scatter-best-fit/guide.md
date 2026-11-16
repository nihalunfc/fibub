---
name: Best-fit line
num: 2231
shelf: learn
code: L331
section: school-maths
title: "Best-fit line: scatter plot, correlation r and residuals"
summary: "Choose a made-up data set, draw your own line through the dots and compare it with the least-squares best-fit line. See r, r squared and the gaps (residuals) that the best-fit line makes as small as possible."
status: live
ads: false
order: 2231
icon: chart
works: offline
updated: 2026-11-16
related: [linear-explorer, regression-workbench, histogram-builder]
sources:
  - "Scatter plots, lines of best fit, residuals and the correlation coefficient are standard school statistics (Common Core 8.SP and HS-S-ID.6 to 9). The least-squares formulas are checked on hand-worked data in tests/sci.mjs. All three data sets are made up by fibub for teaching."
flow:
  - { icon: pointer, label: "Add dots" }
  - { icon: sliders, label: "Your line" }
  - { icon: chart, label: "Best fit" }
  - { icon: check, label: "Quiz" }
---

## What it does

A **scatter plot** puts one measurement on each axis, so every dot is one person, day or object. If the dots drift upward together, the two things move together. A **line of best fit** sums up that trend in one equation, and it lets you predict a value you did not measure. This page gives you three made-up data sets, a line you can set yourself with two sliders, and the real **least-squares** line to compare with.

The least-squares line is the one that makes the total of the squared gaps (the **residuals**) between the dots and the line as small as possible. The number **r** measures how tightly the dots follow a straight line, from −1 to +1. After this, try [[histogram-builder]] for single sets of numbers or [[regression-workbench]] for your own data.

## How to use it

1. Pick a data set: study time and score, heat and cold drinks, or shoe size and score.
2. Move the slope and intercept sliders until your orange dashed line runs through the middle of the dots.
3. Press "Show best-fit line". The green line and the little vertical gaps appear.
4. Compare the two totals under the graph. Smaller means closer.
5. Tap the graph to add your own dot and see how r and the line change.

## What each setting does

- **Your slope:** how steeply your line rises for each step right.
- **Your intercept:** where your line crosses the vertical axis at x = 0.
- **Show best-fit line:** adds the least-squares line and its residuals.
- **Reset dots:** removes the dots you added.

## Worked example

Take the five points (1, 2), (2, 4), (3, 5), (4, 4) and (5, 5). The means are 3 and 4. The best-fit line is y = 0.6x + 2.2 and r is about 0.77, a fairly strong positive link. At x = 6 the line predicts 5.8.

## FAQs

**Does a high r prove one thing causes the other?** No. Hot weather and cold drink sales move together, but a link in data never proves cause on its own.

**Why squared gaps?** Squaring stops positive and negative gaps from cancelling and makes big misses count more.

**Can I use the line far outside the data?** Be careful. Predicting well beyond the dots (extrapolating) can go badly wrong.
