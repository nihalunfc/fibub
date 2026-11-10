---
name: Histogram builder
num: 1286
shelf: learn
section: school-maths
title: "Histogram builder"
summary: "Type a list of numbers and drag the class width and starting point to watch the frequency table, the histogram and the frequency polygon change. See the mean, median, mode and modal class, how far the mean from the table drifts from the true mean, and the combined mean of two groups."
status: live
ads: false
order: 1286
icon: chart
works: offline
updated: 2026-11-09
related: [grouped-data-stats, sample-space, probability-tree]
sources:
  - "Frequency tables, histograms, frequency polygons, mean, median, mode and the combined mean are standard school statistics. Wording, pictures and the made-up example data are fibub's own."
  - "Checked against numpy.histogram, numpy.mean and Python's statistics.median and statistics.multimode on random data sets."
flow:
  - { icon: pencil, label: "Numbers" }
  - { icon: sliders, label: "Class width" }
  - { icon: chart, label: "Histogram" }
  - { icon: calculator, label: "Mean" }
---

## What it does

A long list of numbers is hard to read. Grouping them into **classes** of equal width (30–40, 40–50 and so on) and counting how many fall in each gives a **frequency table**, and drawing a bar for each class gives a **histogram**. Join the middle of the top of each bar and you get a **frequency polygon**. This page does all three from your own numbers and lets you change the grouping with two sliders:

- **Class width (w):** how wide each class is. Too narrow and the picture is spiky; too wide and the shape disappears.
- **Start (a):** where the first class begins. The same data can look quite different when the classes start somewhere else.

Under the picture you get the frequency table with class marks, the exact mean, median and mode of your numbers, the modal class, and the mean estimated from the table alone. A last card finds the **combined mean** of two groups, such as two sections of a class that took the same test.

It fits the Class 9 mathematics chapter on understanding data (frequency tables, histograms, frequency polygons and averages, and combining data sets). For the Class 10 formulas for the mean, median and mode of grouped data, go on to [[grouped-data-stats]]; for chance and outcomes, see [[sample-space]].

## How to use it

1. Type or paste numbers into the box, separated by commas, spaces or new lines, or tap one of the made-up examples.
2. The page picks a tidy width that gives about six classes. Drag the **w** slider, or type any width in the box beside it.
3. Drag the **a** slider to move where the first class starts. It always starts at or below your smallest number.
4. Tick or untick **Bars** and **Frequency polygon** to see either on its own. The dashed green line marks the true mean.
5. Read the table and the averages under the picture. The modal class (the tallest bar) is in bold.

A number exactly on a class boundary goes into the higher class, so 40 is counted in 40–50. This is the usual school rule for continuous classes.

## A worked example

The page starts with 30 made-up test marks. With width 10 starting at 30 the classes and frequencies are 30–40: 2, 40–50: 4, 50–60: 7, 60–70: 9, 70–80: 5, 80–90: 2, 90–100: 1.

- The class marks are 35, 45, 55, 65, 75, 85, 95, and Σ f × mark = 1 860, so the mean from the table is 1 860 ÷ 30 = 62.
- The true mean of the 30 marks is 1 848 ÷ 30 = 61.6, so the table's estimate is off by 0.4.
- The median is 61.5 (halfway between the 15th and 16th marks, 61 and 62). No mark appears twice, so there is no mode, and the modal class is 60–70.
- The frequency polygon starts at 25 and ends at 105 with a frequency of 0, the class marks of the empty classes on either side.

In the combine card, 30 pupils averaging 62 and 20 pupils averaging 70 give (30 × 62 + 20 × 70) ÷ 50 = 3 260 ÷ 50 = 65.2, not 66.

## Check yourself

Four fresh questions each time: a class mark, counting numbers into a class, a mean from a small table and a combined mean. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why do the bars touch?** The classes follow on with no gaps (40–50 ends where 50–60 begins), so the bars do too. In a bar graph of separate things, like favourite fruits, the bars have gaps.

**Why is the mean from the table different from the true mean?** The table only remembers how many numbers are in each class, so it pretends they all sit at the class mark. The narrower the classes, the closer the estimate.

**Can I use classes of different widths?** Not on this page. With unequal widths the bar heights must be scaled so that the bar areas match the frequencies; all classes here have the same width.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and made-up examples. fibub is not part of NCERT.
