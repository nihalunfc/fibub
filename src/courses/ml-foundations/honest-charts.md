---
title: Summaries and charts that tell the truth
summary: 'Mean or median, histogram or box plot, and how a cut-off axis can turn a 4 % gap into a landslide. Drag an outlier and move an axis to see how summaries and charts mislead, and how to make honest ones.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'Ten people earn about $4,000 a month and one earns $40,000. Which describes a typical person better?'
    choices: ['The mean', 'The median', 'The maximum']
    ans: 1
    why: The one big value pulls the mean up to over $7,000, more than ten of the eleven people earn. The median stays near $4,000.
  - q: Why must a bar chart start at zero?
    choices: ['It is a rule with no reason', 'Readers judge bars by their length, so a cut axis exaggerates differences', 'Zero looks tidier']
    ans: 1
    why: A bar's length stands for the value. Cut the axis and lengths no longer match the values.
  - q: What does the box in a box plot show?
    choices: ['The mean plus and minus one standard deviation', 'The middle 50 % of the data, from the first to the third quartile', 'All the outliers']
    ans: 1
    why: The box runs from Q1 to Q3 (the interquartile range) with a line at the median. Whiskers and dots show the rest.
---

**Module 2 · about 20 minutes · read first: 1.6.** You'll be able to choose between the mean and median, read a histogram and a box plot, and spot four common ways charts mislead.

## 1. Why this matters

Before any model, you look. Looking catches broken data, shows which features might matter, and tells you which model shapes make sense. But summaries and charts can hide things or exaggerate them, sometimes by accident. A good analyst knows the tricks so as to avoid them, and to catch them in other people's reports.

## 2. Mean or median?

<!--fig:mean-median-->

- Use the **median** for skewed data with a long tail: pay, house prices, time on a website, hospital stays.
- Use the **mean** when values are roughly symmetric, or when totals matter (total revenue = mean × number of sales).
- Report both when they differ a lot. The gap itself tells you the data is skewed.

The same goes for spread: the standard deviation is pulled by outliers too. The **interquartile range** (IQR), the distance from the first quartile `$Q_1$` (25 % of values below) to the third `$Q_3$` (75 % below), is the robust partner of the median.

## 3. Four charts worth knowing

| Chart | Shows | Use it for |
|---|---|---|
| **Histogram** | How one number column is spread: bars count values in equal bins | Shape: symmetric, skewed, two peaks, odd spikes |
| **Box plot** | Median, quartiles, whiskers and outliers | Comparing a number across groups |
| **Scatter plot** | Two number columns, one dot per row | Relationships, clusters, outliers (Lesson 2.3) |
| **Bar chart** | A number per category | Counts or totals by group |

Histograms deserve a warning: the bin width changes the picture. Too wide and two peaks merge into one; too narrow and noise looks like structure. Try two or three widths.

## 4. How charts mislead

<!--fig:truncated-axis-->

1. **Cut-off bar axis.** As above. Bars must start at zero.
2. **Stretched or squashed scale.** The same line rises steeply in a tall narrow chart and gently in a wide one. Compare charts only on the same scale.
3. **Cherry-picked range.** Showing sales from the dip in March to the peak in July makes "growth" out of a normal season. Show whole years.
4. **Area and 3-D tricks.** A picture of a coin twice as tall is four times the area and looks four times bigger. 3-D pie charts make the front slice look larger. Use flat bars.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** robust summaries (median, IQR) barely move when a few values go wild; the mean and standard deviation can move without limit.

**Equations:** the quartiles split the sorted data into four equal parts, and

```math
\text{IQR} = Q_3 - Q_1
```

and a value is an outlier if

```math
x < Q_1 - 1.5\,\text{IQR} \quad \text{or} \quad x > Q_3 + 1.5\,\text{IQR}
```

This is Tukey's rule, used to draw the dots beyond a box plot's whiskers.

**Breakdown point:** the share of values you can make arbitrarily wrong before a summary breaks. For the mean it is 0 (one value can drag it anywhere); for the median it is 50 %.

**Analogy:** the median is the middle runner in a race. It doesn't matter how far ahead the winner finishes.

**Try it:** the values 2, 3, 3, 4, 5, 6, 30 have `$Q_1 = 3$`, `$Q_3 = 5.5$`. Is 30 an outlier? (IQR = 2.5, upper fence 5.5 + 3.75 = 9.25, so yes.)
</details>

## 5. Worked example

*Made-up numbers.* A city report says "average commute: 52 minutes". The underlying 1,000 survey answers have a median of 34 minutes. A histogram shows most people between 15 and 50 minutes, plus a group of about 60 people commuting over 3 hours. Those turn out to be people who typed hours and minutes the wrong way round (e.g. "130" for 1 h 30). Fixing them gives a mean of 37 minutes. Two lessons: report the median for skewed data, and always look at the histogram, because the outliers may be data errors rather than real.

## 6. Practice

1. House prices in a town: median $420k, mean $610k. What does the gap tell you?
2. A chart shows bars of 50 and 55 with the axis starting at 45. How many times longer does the second bar look?
3. Find the median and IQR of 1, 3, 4, 7, 8, 9, 12, 20 (use the middle of each half for the quartiles).

<details>
<summary>Answers</summary>

1. Prices are skewed to the right: a few very expensive homes pull the mean up.
2. Lengths 5 and 10: it looks twice as long, though it is only 10 % bigger.
3. Median (7 + 8)/2 = 7.5. Lower half 1, 3, 4, 7: `$Q_1 = 3.5$`. Upper half 8, 9, 12, 20: `$Q_3 = 10.5$`. IQR = 7.
</details>

**Try it on your own data:** try different bin widths in the [[histogram-builder]], compare groups in the [[box-plot-lab]], or get every column's summary at once in the [[csv-profiler]].

**New words:** *skewed*, *quartile*, *interquartile range*, *box plot*, *histogram*, *bin width*, *robust*, *breakdown point*.
