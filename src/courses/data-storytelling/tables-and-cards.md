---
title: 'Tables, cards and small multiples'
seoTitle: 'When to use a table, a KPI card or small multiples'
summary: Not every answer needs a chart. When a table beats a chart, when a single number card is enough, and how small multiples untangle a spaghetti chart.
minutes: 10
updated: 2026-11-22
quiz:
  - q: When is a table better than a chart?
    choices: ['When readers need to look up exact values', 'When you want to show a trend', 'Never']
    ans: 0
    why: Tables are for looking up; charts are for seeing patterns.
  - q: What are small multiples?
    choices: ['Tiny pie charts', 'A grid of small charts of the same type and scale, one per category', 'Charts with few data points']
    ans: 1
    why: Same chart, same scale, repeated. Easy to compare shapes without tangled lines.
  - q: Why must small multiples share the same scale?
    choices: ['To look tidy', 'So that bigger lines really mean bigger values when comparing panels', 'Power BI requires it']
    ans: 1
    why: Different scales would make a small category look as big as a large one.
---

**Module 2 · about 10 minutes · read first: 2.2.** You'll know when to use a table, a single-number card or a grid of small charts instead of one big chart.

## 1. Why this matters

Analysts sometimes force everything into a chart. But a store manager checking their own number wants a table, a CEO wants one big number, and a buyer comparing seasonal patterns across categories wants small multiples. Picking the right format respects how the reader will use it.

## 2. The idea in one picture

When people need exact values, a well-formatted table is the clearest choice:

<!--fig:ds-chart table-better-->

When you want to compare shapes, small multiples work better than one tangled chart:

<!--fig:ds-chart small-multiples-->

## 3. Which format, when

| Format | Use when | Rules |
|---|---|---|
| **Table** | Readers look up their own row; exact values matter; mixed units | Right-align numbers, same decimals, light row lines, no heavy grid, highlight with colour sparingly |
| **Card** (one number) | One key number, such as total sales or margin % | Label with the period, add a comparison (Module 4) |
| **Small multiples** | Comparing the shape of the same measure across 3 to 12 categories | Same chart type and same axis scale in every panel; order the panels meaningfully |
| **Chart** | Seeing a pattern, ranking or trend | Modules 2 and 3 |

<details class="maths" open><summary>Principle</summary>

**Principle:** charts are for patterns, tables are for lookups. If the reader's question is "what is my number?", give them the number; if it's "how do they compare?", give them a picture.

**Analogy:** a train timetable (table: find your train) vs a route map (picture: see how lines connect). Both are useful; neither replaces the other.
</details>

Try it: switch from one crowded chart to small panels, then change the scale.

<figure class="fig" data-fig="@biz-small-multiples"><figcaption>Notice that shared scales are fair, and separate scales show shape but hide size.</figcaption></figure>

## 4. Worked example

*Four categories' monthly sales in one line chart:* four lines cross each other and the reader has to match colours to a legend. *As small multiples:* four panels, same scale. In seconds you see Outdoor peaks in summer, Electronics jumps at Christmas, Home is steady and Grocery is flat and small. That's a stocking decision made easy.

## 5. Practice

1. Each store manager wants to check their store's sales, target and % vs target. Chart or table?
2. You have 10 products' monthly trends. One chart or small multiples?
3. Small multiple panels each have their own y-axis scale. What's the risk?

<details><summary>Answers</summary>

1. A table (one row per store), maybe with conditional colour on the % column.
2. Small multiples, sorted by total sales, with the same scale.
3. A small product's panel would look as big as the best seller's; readers would compare the wrong thing.
</details>

Next, Lesson 2.5: how charts can mislead, even by accident.
