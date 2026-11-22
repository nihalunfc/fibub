---
title: 'Pie charts and parts of a whole: when they work'
seoTitle: 'When to use a pie chart (and when not to)'
summary: Pie charts show parts of a whole, but only work with two or three clearly different slices. When a pie is fine, when to use bars or a 100 % stacked bar instead, and why 3D pies mislead.
minutes: 10
updated: 2026-11-22
quiz:
  - q: When is a pie chart a reasonable choice?
    choices: ['Comparing 8 similar values', 'Showing a part of a whole with 2 or 3 slices, such as "half"', 'Showing a trend']
    ans: 1
    why: People read halves and quarters in a pie well. Beyond 3 slices, bars are clearer.
  - q: Why are 3D pie charts misleading?
    choices: ['They are too colourful', 'The tilt makes front slices look bigger than back slices of the same size', 'They load slowly']
    ans: 1
    why: Perspective distorts area. The data is flat; the chart should be too.
  - q: Do a pie's slices have to add up to a meaningful whole?
    choices: ['No', 'Yes: they must be parts of one total, like shares of sales', 'Only in Excel']
    ans: 1
    why: A pie of values that don't form a whole (such as growth rates) makes no sense.
---

**Module 2 · about 10 minutes · read first: 2.1.** You'll know when a pie chart is fine, and what to use when it isn't.

## 1. Why this matters

Pie charts are the most argued-about chart. Some designers ban them; managers often ask for them. The truth is in between: a pie works for one job, with few slices, and fails at the rest. Knowing the difference lets you give a manager what they need without a debate.

## 2. The idea in one picture

A pie that works: two slices, one of them about half.

<!--fig:ds-chart pie-two-->

In Lesson 2.1's chooser, compare "Part of a whole" with the 3D pie: the tilt makes Electronics look larger than it is.

## 3. The rules

A pie or doughnut is fine when:

1. The slices are **parts of one whole** (shares of sales, of customers, of budget).
2. There are **two or three** slices, or one slice you want to show against "everything else".
3. The message is a rough share ("about half", "a quarter"), not a precise ranking.

Use something else when:

- There are **more than three slices**, or slices of similar size: use a **sorted bar chart with percentages**.
- You compare shares **across groups or years**: use **100 % stacked bars** side by side (two pies next to each other are very hard to compare).
- You want to show **change**: use a line or bar chart of the share.

Never use 3D, exploded slices, or a legend far from the slices.

<details class="maths" open><summary>Principle</summary>

**Principle:** a pie encodes values as angles and areas, which we judge less accurately than lengths. We do know halves and quarters of a circle well (think of a clock), so pies work for those and fail for "is 17 % bigger than 15 %?".

**Physical meaning:** a quarter of a pie is a right angle, a corner we see every day. A 17 % slice is an odd angle with nothing to compare it to.
</details>

## 4. Worked example

*A manager asks for "a pie of sales by store".* Five stores, 30 % down to 12 %. Three of them (Falls Centre 22 %, Rideau 19 %, Harbour Front 17 %) are close in size, so in a pie they look almost the same.

What to offer instead: "Here's a bar chart with the percentage on each bar: Queen Street leads with 30 %. If you'd like a pie for the slide, West stores vs the rest (51 % vs 49 %) works nicely as one."

## 5. Practice

1. Northbay categories in 2025: Electronics 36 %, Home 28 %, Outdoor 25 %, Grocery 11 %. Pie or bars?
2. You want to show that online sales went from 8 % to 15 % of the total. Which chart?
3. Is a pie of "growth % by store" acceptable?

<details><summary>Answers</summary>

1. Bars (sorted, with %), since there are four slices and three are fairly close. A single 100 % stacked bar is also good.
2. Two 100 % stacked bars (one per year) or a simple line/bar of the share over time.
3. No: growth rates aren't parts of a whole, so they can't be slices.
</details>

Next, Lesson 2.4: tables, cards and small multiples.
