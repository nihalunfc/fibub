---
title: Picking the right visual
seoTitle: 'Which Power BI visual to use: a practical guide'
summary: Match the question to the visual. Cards for one number, bars for comparing, lines for time, matrices for detail, and the visuals to avoid, with Northbay examples.
minutes: 12
updated: 2026-11-22
quiz:
  - q: Which visual best shows monthly sales over two years?
    choices: ['Pie chart', 'Line chart', 'Card']
    ans: 1
    why: Lines show change over time and make trends and seasonality easy to see.
  - q: Which is the best way to compare sales across 12 products?
    choices: ['A sorted bar chart', 'A pie chart with 12 slices', 'A gauge per product']
    ans: 0
    why: People compare lengths far more accurately than angles or areas. Sorting puts the answer at the top.
  - q: When is a table or matrix the right choice?
    choices: ['Never', 'When people need exact values to look up or export', 'For trends']
    ans: 1
    why: Tables are for looking up exact numbers. Use charts to show patterns, tables for detail.
---

**Module 7 · about 12 minutes.** You'll be able to pick a visual from the question it must answer.

## 1. Why this matters

A correct measure on the wrong visual still fails: nobody sees the answer. The [Data storytelling](/learn/courses/data-storytelling/) course goes deep on design; this lesson is the Power BI quick guide.

## 2. Question first, visual second

| The question | Visual in Power BI | Northbay example |
|---|---|---|
| What is the number? | **Card** (or new card visual with several values) | Sales YTD |
| How do items compare? | **Bar chart**, sorted | Sales by store |
| How does it change over time? | **Line chart** (or column chart for few periods) | Sales by month, this year vs last |
| What is it made of? | **Stacked bar** or **100 % stacked bar**; a donut only for 2 or 3 parts | Category share per region |
| Are we on target? | **Bullet-style bar** (bar + target line), or KPI visual | Sales vs target by store |
| How do two measures relate? | **Scatter** | Units vs margin % per product |
| Where? | **Map** or filled map (only if location matters) | Sales by city |
| What are the exact values? | **Table** or **matrix** | Store × month detail |
| What happened between two totals? | **Waterfall** | Last year → this year by category |

## 3. Visuals to be careful with

- **Pie charts with many slices:** angles are hard to compare; more than 3 slices, use bars.
- **Gauges:** take a lot of space for one number; a card with a target comparison says more.
- **3D, doughnuts inside doughnuts, word clouds:** decoration, not information.
- **Dual-axis charts:** two scales let you make any two lines look related. Use with care and label both axes.
- **Tables with 20 columns:** nobody reads them. Show the five that matter, offer the rest through drill through or export.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** people read position along a common scale best, then length, then angle and area, then colour intensity (Cleveland and McGill's ranking of visual encodings). Bars and lines use position and length; pies and bubbles use angle and area.

**Try it:** which is easier to rank: four bars of 31 %, 28 %, 23 %, 18 %, or a pie with the same slices? (The bars.)
</details>

## 4. Worked example

*The Northbay store page.* Top row: four cards (Sales YTD, Pace %, Target YTD, vs Target %). Middle: a line chart of monthly sales, this year against last year. Bottom left: a sorted bar chart of sales by category; bottom right: a matrix of products with Units, Sales and Margin %. One question per visual, in reading order from summary to detail.

## 5. Practice

1. Which visual for "how much of our sales come from weekends, by store"?
2. Your manager asks for a pie chart of 12 products. What do you offer instead, and why?
3. Which visual explains why profit fell from last year to this year?

<details>
<summary>Answers</summary>

1. A 100 % stacked bar per store (weekday vs weekend), or a bar of Weekend % sorted.
2. A sorted bar chart: lengths are easier to compare, and the biggest is at the top.
3. A waterfall: last year's profit, then the positive and negative changes by category, then this year's.
</details>
