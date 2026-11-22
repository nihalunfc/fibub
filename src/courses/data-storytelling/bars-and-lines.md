---
title: 'Bars and lines: the two charts that do most of the work'
seoTitle: 'Bar chart vs line chart: when to use each'
summary: Bar and line charts answer most business questions. When to use each, the rules that make them readable (zero baselines, sorting, horizontal bars, few lines), and common mistakes.
minutes: 12
updated: 2026-11-22
quiz:
  - q: Must a bar chart's value axis start at zero?
    choices: ['Yes: bar length is the value, so a cut axis distorts it', 'No, never', 'Only for money']
    ans: 0
    why: Readers compare lengths. Start at 50,000 and a 9 % rise can look like 160 %.
  - q: When should bar charts be horizontal?
    choices: ['Never', 'When labels are long or there are many categories', 'Only on phones']
    ans: 1
    why: Horizontal bars let long names sit flat and readable instead of slanted.
  - q: When should you NOT sort bars by value?
    choices: ['When the categories have a natural order, like months or weekdays', 'When there are five bars', 'Always sort']
    ans: 0
    why: Time and other ordered categories keep their order; sorting would scramble it.
---

**Module 2 · about 12 minutes · read first: 2.1.** You'll know when to use a bar or a line, and the handful of rules that make each one clear.

## 1. Why this matters

If you only mastered two charts, these would be the ones. Bars compare things; lines show change over time. Together they cover most of what a business report needs. But small choices (sorting, orientation, how many lines) decide whether they are read in two seconds or twenty.

## 2. The idea in one picture

Walk through cleaning up a line chart. Watch what each step removes, and how the message gets clearer.

<!--fig:declutter lines-->

## 3. Rules for bar charts

1. **Start the value axis at zero.** Bar length *is* the value (Lesson 2.5 shows what happens if not).
2. **Sort by value** unless the categories have a natural order (months, age bands, sizes).
3. **Go horizontal** when names are long or there are more than about 7 bars. No slanted labels.
4. **One colour**, plus a highlight colour for the bar you're talking about.
5. **Label the bars directly** and drop the axis when there are few bars.
6. **Thick bars, thin gaps:** gaps about half a bar wide.

## 4. Rules for line charts

1. **Use lines for time** (or another continuous scale). Lines between unrelated categories (stores) imply an order that doesn't exist.
2. **Few lines:** up to about four. More becomes "spaghetti": use small multiples (Lesson 2.4) or highlight one line and grey the rest.
3. **Label lines at their ends** instead of a legend.
4. **The axis may start above zero** for lines, because the eye reads slope, not length. Label it clearly, and don't zoom so far that noise looks like a trend.
5. **Dashed for targets or forecasts**, solid for actuals.

<details class="maths" open><summary>Principle</summary>

**Principle:** a bar encodes a value as length from a baseline; a line encodes change as slope between points. Choose the encoding that matches the question: "how much?" (length) or "how did it change?" (slope).

**Physical meaning:** with a line, your eye follows the direction like a road on a hill: up, down, steep, flat. That's why lines show trends better than columns, which make you compare heights one by one.
</details>

## 5. Worked example

*Northbay monthly sales, 2024 vs 2025.*

- As 24 columns: you can find the biggest month but you have to work to see the pattern.
- As two lines (2025 in blue, 2024 in grey, labelled at the end): you see at once that 2025 is above 2024 in every month except February, and both peak in November and December.

The line chart answers "how did we do through the year?" in one look; the columns answer "which month was biggest?". Pick the one that matches the question.

## 6. Practice

1. A chart shows 9 product categories as vertical columns with slanted names. What two changes would you make?
2. A line chart has 12 lines, one per product. What would you do?
3. Should weekdays (Mon to Sun) be sorted by sales?

<details><summary>Answers</summary>

1. Make it horizontal and sort by value.
2. Grey all lines and highlight the one or two that matter, or use small multiples, or show a bar chart of the change instead.
3. Usually no: keep the natural Monday to Sunday order so the weekly pattern shows.
</details>

Next, Lesson 2.3: pie charts and when they're the right choice.
