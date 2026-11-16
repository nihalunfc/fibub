---
name: Box plot lab
num: 2232
shelf: learn
code: L332
section: school-maths
title: "Box plot lab: five-number summary, quartiles and outliers"
summary: "Type a list of numbers and see the box plot, the five-number summary, the IQR and any outliers by the 1.5 times IQR rule, with the fences shown so you can see why a value is flagged."
status: live
ads: false
order: 2232
icon: chart
works: offline
updated: 2026-11-16
related: [histogram-builder, spread-explorer, grouped-data-stats]
sources:
  - "Five-number summary, box plots and the 1.5 × IQR outlier rule are standard school statistics (Common Core 6.SP, HS-S-ID.1 and 2). Quartiles are the medians of the lower and upper halves, as US textbooks teach. Checked on hand-worked lists in tests/sci.mjs. The example data are fibub's own."
flow:
  - { icon: pencil, label: "Numbers" }
  - { icon: chart, label: "Box plot" }
  - { icon: table, label: "Summary" }
  - { icon: check, label: "Quiz" }
---

## What it does

A **box plot** squeezes a whole list of numbers into five facts: the smallest value, the first quartile (Q1), the median, the third quartile (Q3) and the largest. The box runs from Q1 to Q3 and holds the middle half of the data, with a line at the median. The **whiskers** reach out to the rest of the values, and any value that sits unusually far out is drawn as a separate dot called an **outlier**.

Paste or type your own numbers and the page works all of this out, with a table that includes the **IQR** (Q3 − Q1) and the fences used to flag outliers. For the shape of the same data, see [[histogram-builder]], and for the mean and standard deviation try [[spread-explorer]].

## How to use it

1. Type or paste at least four numbers, separated by spaces, commas or new lines.
2. Read the median and the middle half in the sentence under the picture.
3. Look at the table for the quartiles, IQR, fences and outliers.
4. Edit a number and watch the box plot update at once.
5. Answer the quiz questions, which use fresh numbers each time.

## What each setting does

- **Numbers box:** the data. Anything that is not a number is ignored.
- **Box:** from Q1 to Q3, so it holds the middle 50% of values.
- **Whiskers:** reach to the lowest and highest values that are not outliers.
- **Outlier dots:** values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR.

## Worked example

Take 12, 15, 17, 18, 20, 21, 22, 24, 25, 27, 30 and 58. The median is 21.5. The lower half has median 17.5 and the upper half has median 26, so the IQR is 8.5. The upper fence is 26 + 1.5 × 8.5 = 38.75, so 58 is an outlier and the upper whisker stops at 30.

## FAQs

**Why do other tools give slightly different quartiles?** There are several methods. This page uses the median-of-halves method taught in most US classes.

**Should I delete outliers?** Not automatically. Check whether it is a typing error or a real, interesting value first.

**What if all values are the same?** The box collapses to a single line and the IQR is 0.
