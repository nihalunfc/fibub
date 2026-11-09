---
name: Grouped data mean, median and mode
num: 1163
shelf: learn
section: school-maths
title: "Mean, median and mode of grouped data with every step: direct, assumed mean and step deviation, plus ogives"
summary: "Type class intervals and frequencies and get the mean by the direct, assumed-mean and step-deviation methods, the median and the mode with the formulas filled in, and a histogram with less-than and more-than ogives."
status: live
ads: false
order: 1163
icon: chart
works: offline
updated: 2026-11-09
related: [distribution-explorer, grain-size-stats, ap-explorer]
sources:
  - "Standard formulas for grouped data: the three methods for the mean, median = l + ((n/2 − cf)/f)h and mode = l + ((f₁ − f₀)/(2f₁ − f₀ − f₂))h, and the cumulative frequency curves (ogives). Written for fibub."
  - "Median checked against Python's statistics.median_grouped; the three means checked against the plain mean of the class marks for 300 random tables. The example data are made up."
flow:
  - { icon: table, label: "Classes" }
  - { icon: calculator, label: "Mean x3" }
  - { icon: target, label: "Median, mode" }
  - { icon: chart, label: "Ogive" }
---

## What it does

When data are given as **classes** (0–20, 20–40, ...) with how many values fall in each, you cannot see the individual values. The school method treats each class as if all its values sat at the **class mark**, the middle of the class, and uses formulas for the median and mode. This page does the whole working for you, with your numbers in every line:

- a **working table** with class marks x, f·x, deviations d = x − a and u = d/h, and the cumulative frequency cf;
- the **mean** by the direct method, the assumed-mean method and the step-deviation method (they always agree, which is a good check);
- the **median** from the median class and the formula l + ((n/2 − cf)/f) × h;
- the **mode** from the modal class and the formula l + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h;
- a **histogram** with the **less-than** and **more-than ogives**, and the median read off where the ogive reaches n/2.

It follows the Class 10 chapter *statistics* (mean, mode and median of grouped data).

For the shapes of real data distributions, see the [[distribution-explorer]]; for cumulative curves of sieve data, [[grain-size-stats]]. Sums of class marks are an arithmetic progression, as in the [[ap-explorer]].

## How to use it

1. Type one class per line as `lower-upper frequency`, for example `20-40 9`. Commas, colons and "to" also work.
2. Classes must follow on with no gaps. For inclusive classes like 10–19, 20–29, first change them to 9.5–19.5, 19.5–29.5 (the usual textbook step).
3. Optionally type the **assumed mean** a. Leave it empty and the page uses the class mark of the middle class.
4. Read the table, then the three methods, the median and the mode. The median and modal classes are highlighted in the table.
5. Tick the ogives you want under the chart.

## A worked example

The example (made up) is how many minutes 50 students spent on homework: 0–20: 6, 20–40: 9, 40–60: 15, 60–80: 12, 80–100: 8.

- Class marks 10, 30, 50, 70, 90. Σfx = 60 + 270 + 750 + 840 + 720 = 2 640, so the mean is 2 640 / 50 = 52.8.
- With a = 50 and h = 20: u = −2, −1, 0, 1, 2 and Σfu = −12 − 9 + 0 + 12 + 16 = 7, so the mean is 50 + (7/50) × 20 = 52.8 again.
- n/2 = 25. The cumulative frequencies are 6, 15, 30, ..., so the median class is 40–60: median = 40 + ((25 − 15)/15) × 20 ≈ 53.33.
- The modal class is 40–60 (f₁ = 15, f₀ = 9, f₂ = 12): mode = 40 + (6/9) × 20 ≈ 53.33.

## Check yourself

Three fresh questions each time: the mean, the median and the mode of a small random table. Type your answer to 2 decimal places, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why are the answers estimates?** The real values inside each class are unknown, so all three are estimates based on the class marks or on spreading values evenly through a class.

**What if two classes share the highest frequency?** The page uses the first one. The data then have two modes, and the formula gives only one of them.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
