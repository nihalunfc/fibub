---
name: Spread explorer
num: 1384
shelf: learn
code: L239
section: school-maths
title: "Measures of dispersion: drag data points and watch range, mean deviation, variance, standard deviation and CV change"
seoTitle: "Variance, standard deviation and mean deviation explorer"
summary: "Drag the points of two data sets along a number line and watch the range, mean deviation about the mean and median, variance, standard deviation and coefficient of variation change live. Compare two classes with the same mean but different spread, see each deviation as a bar, and open the full working."
status: live
ads: false
order: 1384
icon: chart
works: offline
updated: 2026-11-09
related: [grouped-data-stats, event-algebra, distribution-explorer, sample-space]
sources:
  - "Range, mean deviation, variance and standard deviation (dividing by n) and the coefficient of variation are standard descriptive statistics. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "The example data (two classes' marks, two batters' scores, heights and weights) are made up for teaching; they are not from any survey or book."
  - "Checked against numpy (mean, median, mean absolute deviation, var and std with ddof = 0) and Python's statistics.pstdev for every example."
flow:
  - { icon: table, label: "Data" }
  - { icon: pointer, label: "Drag" }
  - { icon: chart, label: "Spread" }
  - { icon: check, label: "Compare" }
---

## What it does

Two classes can have the same average mark and still be completely different: in one, everybody scored about 50; in the other, half the class scored 20 and half scored 80. The mean cannot tell them apart. **Measures of dispersion** can: they measure how spread out the data are around the middle.

This page shows two data sets as dots on a number line. Drag any dot and every measure updates at once:

- the **range**, largest minus smallest value;
- the **mean deviation** about the mean and about the median: the average distance of the values from the middle;
- the **variance** σ², the average of the squared distances from the mean, and the **standard deviation** σ = √variance;
- the **coefficient of variation** CV = σ / x̄ × 100, which compares spread as a percentage of the mean, so data in different units (or with very different means) can be compared.

Each distance from the mean is drawn as a bar, or as a block whose height grows with the squared distance, so you can see why one far-out point pushes the variance up so much.

It fits the Class 11 maths chapter on statistics, building on the mean, median and mode of grouped data in Class 10 (see [[grouped-data-stats]]). For the shape of whole distributions, go on to the [[distribution-explorer]].

## How to use it

1. Pick an **Example** or type your own numbers into the two boxes (2 to 30 numbers each, separated by commas or spaces).
2. **Drag** any dot sideways along the number line. The box below the picture, the bars and the verdict update as you drag. Values snap to whole numbers.
3. **Show** switches the bars between the distances |x − x̄| (used in the mean deviation) and blocks sized by (x − x̄)² (used in the variance).
4. The table lists every measure for both sets side by side, and the line below it says which set is more variable by its CV.
5. **Show the working** opens a table of x, x − x̄, |x − x̄| and (x − x̄)² for the first set, with the sums divided out.

## Worked example

The page opens on **Same mean, different spread**. Class A is 46, 48, 50, 50, 52, 54, 50 and class B is 20, 35, 50, 50, 65, 80, 50. Both have mean 50 and median 50. But:

| | Class A | Class B |
|---|---|---|
| Range | 8 | 60 |
| Mean deviation about the mean | 1.71 | 12.86 |
| Variance | 5.71 | 321.43 |
| Standard deviation | 2.39 | 17.93 |
| CV | 4.78 % | 35.86 % |

The verdict says class B is more variable, so class A is more consistent. Open the working: class A's squared deviations add up to 40, and 40 ÷ 7 = 5.71, so σ = √5.71 = 2.39.

## Tips

- Adding the same number to every value moves the mean but leaves every spread measure unchanged. Multiplying every value by k multiplies the SD by k and the variance by k².
- The SD is in the same units as the data; the variance is in squared units. The CV has no units, which is why it is the one to use when comparing heights in cm with weights in kg.
- School statistics divides by n. Calculators and spreadsheets often offer a "sample" SD that divides by n − 1; that number is a little bigger.

## FAQ

**Why square the deviations instead of using the mean deviation?** Squares are easier to work with algebraically (no absolute values), and they make the SD fit neatly with the normal distribution later on. The mean deviation is easier to understand, so the page shows both.

**Why does the CV say "mean is 0"?** The CV divides by the mean, so it only makes sense for data whose mean is not zero (usually positive measurements).

**Is my data saved?** No. Everything runs in your browser and nothing is stored or sent. fibub is not part of NCERT; the topics follow the syllabus, but the words, pictures and examples are our own.
