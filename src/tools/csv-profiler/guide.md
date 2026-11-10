---
name: CSV profiler
num: 568
shelf: science
section: data-science-and-machine-learning
title: "CSV profiler"
summary: "Open a CSV or Excel file and see every column at a glance: its type, missing values, unique values, mean, median, SD, quartiles, outliers, histogram or most common values, plus a correlation heatmap. Download the report as a web page, PDF or Word file. Nothing is uploaded."
status: live
ads: false
order: 568
icon: table
works: offline
updated: 2026-11-09
related: [sql-playground, plot-maker, trend-analyser, train-test-splitter, small-model-trainer, embedding-visualiser, data-dictionary, science-file-converter, table-converter]
sources:
  - "Statistics as defined in pandas (describe, skew, kurt, value_counts, duplicated, DataFrame.corr) and numpy's automatic histogram bins; checked against pandas 3.1 and numpy 2.5 on the example and a random table."
  - "The example table of 41 plants is made up for this tool."
flow:
  - { icon: file, label: "Open file" }
  - { icon: table, label: "Columns" }
  - { icon: chart, label: "Charts" }
  - { icon: download, label: "Report" }
---

## What it does

Before you analyse a data set, you need to know what is in it: which columns are numbers, how many cells are empty, whether a typing slip has crept in, which columns move together. This profiler answers those questions for a CSV or Excel file in a few seconds, in your browser. The file is never uploaded.

For the whole table it shows the number of rows and columns, missing cells, rows with a gap and exact duplicate rows, plus a list of **things to check**. For every column it finds the **type** (number, date, yes/no or text) and gives:

- **Present, missing and unique** counts.
- For numbers: **mean, standard deviation, minimum, quartiles, median, maximum, skewness, excess kurtosis**, how many zeros and negative values, and **possible outliers** (values more than 1.5 times the interquartile range beyond the quartiles), with a **histogram**.
- For text, dates and yes/no: the **most common values** with their counts and shares, and the first and last value.

A **correlation heatmap** shows how every pair of number columns moves together, with the strongest pairs listed.

Query the table with the [[sql-playground|SQL playground]], then split it for modelling with the [[train-test-splitter|train/test splitter]].

## How to use it

1. Open a CSV, TSV, text or Excel (.xlsx) file, or paste a table. The first row should hold the column names; if it is all numbers, the columns are called Column 1, Column 2 and so on.
2. Read the overview and the **Things to check** list first.
3. Pick a column under **One column in detail** to see its histogram or its most common values.
4. Choose **Pearson** correlation for straight-line relationships, or **Spearman** for any steadily rising or falling trend. Spearman works on ranks, so one wild value cannot dominate it.
5. Download the column statistics as CSV, or the whole report as a web page (HTML), image, PDF or Word file.

**Histogram bins** are set automatically with the same rule as numpy (the narrower of the Sturges and Freedman-Diaconis widths), or you can fix 10, 20 or 30.

## Worked example

The example is a made-up table of 41 plants. The page shows 41 rows × 8 columns, 5 missing cells and 1 duplicate row (plant P11 appears twice). The column `sown` is found to be a date, `fertilised` a yes/no column, and `region` text with 1 gap and East as its most common value (12 of 40).

`height_cm` has 2 missing values (one empty, one written NA). Its mean is 43.67 cm with an SD of 13.49, but the median is 42 cm: the list flags 2 possible outliers, and the histogram shows one bar far out at 118 cm, a likely slip for 11.8 or 48.0. That one value also pulls the Pearson correlation between height and mass down to 0.540; switch to Spearman and it is 0.845. Fixing or removing the slip is the first job before any analysis.

## Good to know

- Statistics follow pandas: the standard deviation divides by n − 1, quartiles interpolate linearly, and correlations use the rows where both values are present.
- A column with numbers and a few words (such as "n/d") is treated as text, and the list says how many cells to fix.
- Dates are recognised when written year first, such as 2026-03-01 or 2026/3/1 14:30. Other date styles are treated as text, because 03/04 could be March or April.
- Files up to 15 MB, 60 columns and 50,000 rows. The heatmap shows up to 25 number columns.

## What it does not do

It does not change your data, guess at mixed date formats, or test whether a correlation is significant. Clean the data in your spreadsheet or with SQL, then run the profile again.

## Frequently asked questions

**Is my file uploaded?** No. It is read by your browser and nothing is stored or sent anywhere.

**Why is a number column called text?** At least one cell is not a number. The Things to check list shows an example cell.

**What do skewness and kurtosis mean?** Skewness above 0 means a long tail to the right; excess kurtosis above 0 means heavier tails than a normal distribution.
