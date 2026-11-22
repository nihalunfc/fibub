---
title: Choosing a chart from the question
seoTitle: 'How to choose the right chart for your data'
summary: Pick the chart from the question you are answering, not from the chart menu. Six common questions (compare, trend, target, part of a whole, spread, relationship) and the chart that answers each, with an interactive chooser.
minutes: 14
updated: 2026-11-22
quiz:
  - q: You want to show how monthly sales changed over two years. Which chart?
    choices: ['Pie chart', 'Line chart', 'Scatter plot']
    ans: 1
    why: Lines show change over time; the slope is the change.
  - q: You want to compare sales of 12 products. Which chart?
    choices: ['A sorted horizontal bar chart', 'A pie chart with 12 slices', 'A line chart']
    ans: 0
    why: Bars from a common baseline are the easiest to compare, and sorting shows the ranking.
  - q: You want to see whether price and units sold are related. Which chart?
    choices: ['Stacked bar', 'Scatter plot', 'Card']
    ans: 1
    why: A scatter plot puts one measure on each axis, so a pattern (or no pattern) is visible.
---

**Module 2 · about 14 minutes · read first: 1.3.** You'll be able to pick the right chart for the six most common business questions.

## 1. Why this matters

Reporting tools offer 30 or more chart types, and the easiest mistake is to pick one because it looks interesting. The right chart makes the answer obvious; the wrong one hides it. The good news: six questions cover nearly all business charts, and each has one or two charts that work best.

## 2. The idea in one picture

Pick a question. The left card shows the chart that answers it best, using Northbay's data; the right card shows the chart people often use instead, and why it's worse.

<!--fig:chart-chooser-->

## 3. The six questions

| The question | Best chart | Also fine | Avoid |
|---|---|---|---|
| **Compare items:** which is biggest? | Sorted bar chart (horizontal for long names) | Dot plot | Pie with many slices, 3D bars |
| **Change over time:** how did it move? | Line chart | Columns for a few periods | Many-coloured columns, pies per year |
| **Actual vs target:** are we on track? | Bar with target mark (bullet chart) | Card with a comparison | Gauges |
| **Part of a whole:** what share? | One stacked 100 % bar, or sorted bars with % | Pie or doughnut with 2 or 3 slices | 3D or exploded pies |
| **Spread:** how are values distributed? | Histogram | Box plot | A single average |
| **Relationship:** do two measures move together? | Scatter plot | | Two lines on two axes |

<details class="maths" open><summary>Principle</summary>

**Principle:** people judge some visual differences much more accurately than others. In order, from most to least accurate: position along a common scale, length, angle and slope, area, then colour shade (Cleveland and McGill, 1984). Bars and lines use position and length; pies use angle and area. That's why bars beat pies for comparisons.

**Physical meaning:** your eye compares the ends of two bars against the same baseline almost like a ruler. With two pie slices it has to compare curved wedges at different angles, and it guesses.
</details>

Try it: pick a question, then try every chart on the same data.

<figure class="fig" data-fig="@biz-five-charts"><figcaption>Notice that the best chart is the one where the answer is the easiest thing to see.</figcaption></figure>

## 4. Worked example

*Question from the regional manager: "Did each store hit target?"*

- It's an **actual vs target** question, for 5 stores.
- Best chart: horizontal bars of 2025 sales, sorted, with a black tick for each target, colouring the one store that missed.
- What it shows at a glance: four stores beat target; Forks Market is $122 short (99.6 %).

A table would also work if the manager wants exact numbers (Lesson 2.4), but gauges (five dials) would take a whole slide to say the same thing.

## 5. Practice

1. "What share of 2025 sales came from each region (West, Central, East)?" Which chart?
2. "Is there a weekly pattern in sales?" Which chart?
3. "How do the 12 products rank by margin?" Which chart, and should it be sorted?

<details><summary>Answers</summary>

1. Part of a whole with 3 parts: a single 100 % stacked bar, or a doughnut is acceptable with so few slices.
2. Sales by weekday as columns (Mon to Sun, in order, not sorted), or a line if comparing several weeks.
3. A horizontal bar chart, sorted from highest to lowest margin.
</details>

Next, Lesson 2.2: getting bars and lines right. In Power BI, the same choices are covered in [Choosing visuals](/learn/courses/power-bi/choosing-visuals/).
