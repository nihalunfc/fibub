---
name: Likert chart
num: 748
shelf: science
section: sociology-and-survey-research
title: "Likert scale chart maker: diverging stacked bar chart from survey answers (free)"
summary: "Turn agree/disagree survey answers into a diverging stacked bar chart centred on the neutral answer, sorted by agreement, with % agree, medians and means per statement. Paste raw answers or counts; download PNG, SVG and CSV."
status: live
ads: true
order: 748
icon: chart
works: offline
updated: 2026-11-09
related: [reliability-analysis, plot-maker, data-cleaner, sample-size, crosstab-chi-square, questionnaire-scorer, factor-analysis, survey-weighting]
sources:
  - "Method: Likert (1932) rating scales; diverging stacked bar charts as described by Robbins and Heiberger (2011). Example data made up."
flow:
  - { icon: table, label: "Answers" }
  - { icon: sliders, label: "Scale" }
  - { icon: chart, label: "Chart" }
  - { icon: download, label: "PNG/SVG" }
---

## What it does

Likert questions ("Strongly disagree" to "Strongly agree") are the backbone of staff surveys, course evaluations and social research. The clearest way to show them is a **diverging stacked bar chart**: each statement is one bar, disagreeing answers stretch to the left of a centre line, agreeing answers to the right, and the neutral answer sits across the line. Statements people agree with stand out on the right at a glance.

This tool makes that chart from your data, in your browser:

- from **raw answers** (one row per person, one column per statement), as codes 1 to k or as the answer labels, or from a table of **counts** per answer;
- with 4, 5, 6 or 7 answer options and your own labels;
- **sorted** by agreement, by disagreement, by mean, or kept in your order;
- with a summary table: number of answers, % disagree, % neutral, % agree, **median** and mean (SD) for each statement.

Download the chart as **PNG** or **SVG** (vector, for reports and slides), the summary as **CSV**, or everything as an image, PDF or Word report.

Score whole scales with the [[questionnaire-scorer]], and check that the items hang together with the [[reliability-analysis]] tool.

## How to use it

1. Paste your answers or open a CSV or Excel file. Each column header is the statement text. Columns such as an ID are left unticked; tick or untick the statements you want.
2. If you only have totals, choose **Counts per answer** and paste one row per statement with its counts, most negative first.
3. Choose the number of **answer options** and edit the labels if yours differ (separate them with commas). Answers given as labels are matched in any letter case.
4. Pick the order and, if you like, a chart title. Blank answers are skipped.

## Worked example (made-up data)

The sample is a made-up staff survey: 150 people rated 8 statements from 1 (strongly disagree) to 5 (strongly agree). Sorted by agreement, "I feel part of a team" comes first with 72.0 % agree, 7.3 % disagree and a median of 4. At the bottom are "Pay is fair for my role" (22.3 % agree, 58.8 % disagree, median 2, from 148 answers because two were blank) and "Meetings are a good use of time" (20.0 % agree, median 3). "I have the tools I need" splits opinion: 50.3 % agree but 34.9 % disagree.

## How it was checked

The counts, percentages, % agree and % disagree, medians (numpy's median, which averages the two middle answers when the number of answers is even), means and standard deviations (pandas, n − 1) agree with Python for every statement in the example. The chart layout is checked so that the bars of each statement touch, add up to 100 % and put the neutral answer exactly across the centre line.

## Tips

- **Report the percentages and the median.** Likert answers are ordered categories; the mean treats the gaps between them as equal, which they may not be.
- **Keep the same scale for every statement.** Reverse-worded statements should be recoded first so that "agree" always means the favourable answer.
- **Look at the neutral share.** A statement with few disagreements but a large neutral middle is not the same as one people actively endorse.

## Frequently asked questions

**Can I use a scale without a middle option?** Yes: choose 4 or 6 answer options and the bars split at the centre line between the last disagreeing and the first agreeing answer.

**Is my survey data uploaded?** No. Everything runs in your browser and the page keeps working offline.
