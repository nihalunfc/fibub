---
name: Cumulative frequency
num: 2269
shelf: learn
code: L355
section: school-maths
title: "Cumulative frequency: curve, median, quartiles and box plot"
summary: "Enter class intervals and frequencies, build the cumulative frequency table, plot the curve and read off the median, quartiles, IQR and percentiles, with the matching box plot underneath."
status: live
ads: false
order: 2269
icon: chart
works: offline
updated: 2026-11-16
related: [box-plot-lab, grouped-data-stats, histogram-builder]
sources:
  - "Cumulative frequency graphs and box plots are standard school statistics. Serves GCSE maths statistics (higher tier), Ontario MDM4U data analysis and Common Core HSS-ID.A.1 and A.2. The straight-line reading uses linear interpolation; the smooth curve is a monotone cubic through the same points so it never goes down. Checked against a hand-worked example in tests/curr-maths.mjs. Pictures are fibub's own."
flow:
  - { icon: table, label: "Classes" }
  - { icon: chart, label: "Curve" }
  - { icon: ruler, label: "Read off" }
  - { icon: check, label: "Quiz" }
---

## What it does

When data is grouped into classes, you cannot see the exact values, but you can still say how many fall below each class boundary. Adding the frequencies up as you go gives the **cumulative frequency**. Plot each total above the **upper** boundary of its class, join the points, and you have a graph that answers questions like "how many are shorter than 170 cm?".

Pick a data set or type your own classes and frequencies. The page builds the table, plots the points, and lets you choose a smooth curve or straight lines. It reads off the median at n ÷ 2, the quartiles at n ÷ 4 and 3n ÷ 4, the interquartile range, and draws the matching box plot under the graph on the same scale. The grouped data itself can be explored with [[grouped-data-stats]] and [[histogram-builder]], and box plots in more detail with [[box-plot-lab]].

## How to use it

1. Choose a data set, or change the boundaries and frequencies in the table.
2. Pick Smooth curve or Straight lines.
3. Read the median, quartiles and IQR. The dashed lines show the reading: across from the height, then down to the axis.
4. In Grade 11 to 12, slide the percentile and type a value to count how many are above it.
5. Answer the quiz, which uses new classes each time.

## What each setting does

- **Classes and frequencies:** the data. Each upper boundary becomes the next class's lower boundary.
- **Cumulative column:** the running total, which is what is plotted.
- **Smooth or straight:** how the points are joined. Both pass through every point.
- **Percentile slider:** the value below which that share of the data lies.
- **Count above:** n minus the cumulative frequency at your value.

## Worked example

Heights of 40 students in classes 140 to 150, 150 to 160 and so on have frequencies 4, 9, 14, 9, 4. The cumulative frequencies are 4, 13, 27, 36, 40. The median is at position 20, between the points (160, 13) and (170, 27), so on a straight line it is 160 + (20 − 13) ÷ 14 × 10 = 165 cm. Q1 is at position 10, about 156.7 cm, and Q3 at position 30, about 173.3 cm. The IQR is about 16.7 cm.

## FAQs

**Why plot at the upper boundary?** The total includes every value up to the top of the class, so that is where the running total is true.

**Is the median exact?** No. The data is grouped, so every reading is an estimate.

**Why does the box plot start at the first boundary?** The real minimum is hidden inside the first class, so the lowest boundary is used as an estimate.
