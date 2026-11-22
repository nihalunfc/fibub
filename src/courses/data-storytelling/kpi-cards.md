---
title: Designing KPI cards
seoTitle: 'KPI card design: label, number, comparison, trend'
summary: A good KPI card has a clear label with the period, one big number, one comparison with direction and colour, and a small trend line. How to build one, with a live card builder.
minutes: 10
updated: 2026-11-22
quiz:
  - q: What must a KPI card's label include?
    choices: ['The company logo', 'What is measured and the period, such as "Sales, Feb 2025"', 'The formula']
    ans: 1
    why: Without the period, "$13.4k" could mean a day, a month or a year.
  - q: Should a KPI card's colour show good or bad?
    choices: ['Yes, with a second cue such as an arrow or sign', 'No, use the brand colour', 'Use a different colour per card']
    ans: 0
    why: Colour that means good/bad helps, as long as it is backed up for colour-blind readers.
  - q: What does a sparkline add to a KPI card?
    choices: ['Decoration', 'Context: whether the number is a blip or part of a trend', 'Exact values']
    ans: 1
    why: A tiny trend shows direction over time without a full chart.
---

**Module 4 · about 10 minutes · read first: 4.2.** You'll be able to design a KPI card that answers "how are we doing?" in one glance.

## 1. Why this matters

KPI cards are the first thing people see on a dashboard, usually across the top. A card that shows only "$262k" makes the reader do the work. A card that says "Sales 2025: $262k, ▲ 6.6 % vs target" answers the question before they ask.

## 2. The idea in one picture

Build the best card you can: then turn things off and read what goes missing.

<!--fig:kpi-builder-->

## 3. Anatomy of a good card

1. **Label with the period:** "Sales, 2025" or "Margin %, last 4 weeks".
2. **One big number,** rounded: $262k, not $262,470.15.
3. **One comparison** (two at most), with direction (▲▼), sign (+/−) and the base in small text: "▲ 6.6 % vs target ($246k)".
4. **Meaning colour** on the comparison only: good or needs attention. The big number stays black.
5. **A sparkline** (tiny trend line), with the current point marked.
6. **Consistent layout:** every card the same size and order, so the eye knows where to look.

Avoid: gauges, 3D, icons that carry no information, cards with five comparisons, and colouring the whole card red (people stop seeing it).

<details class="maths" open><summary>Principle</summary>

**Principle:** a card answers three questions in order: *what* (label), *how much* (number), *is that good* (comparison). The trend adds a fourth: *is it getting better*.

**Analogy:** a weather forecast tile: "Toronto, Friday · 4 °C · ▼ 6° colder than today", with a small icon. Everything you need, nothing else.
</details>

Try it: change the sales figure, then switch what it is compared with.

<figure class="fig" data-fig="@biz-baseline-toggle"><figcaption>Notice that the number never changes while the verdict does.</figcaption></figure>

## 4. Worked example

*The February card.* With no comparison, "$13.4k" looks fine. With target: "▼ 7.8 % below target ($14.5k)". With last year too: "▼ 1.8 % below last year ($13.6k)". The trend line shows February as the dip between a good January and a strong March, so it reads as a blip worth checking, not a crisis.

## 5. Practice

1. Improve: a card titled "Revenue" showing "262470.15".
2. A card is green when sales are above target. What happens if 9 of 10 cards are green every week?
3. Which comparison would you put on a "Margin %" card?

<details><summary>Answers</summary>

1. "Sales, 2025 · $262k · ▲ 6.6 % vs target ($246k)" plus a monthly sparkline.
2. People stop looking. Consider whether targets are too easy, or highlight only exceptions (cards that need attention).
3. Usually vs target or vs last year, in percentage points: "▲ 1.2 pts vs last year".
</details>

Next, Lesson 4.4: laying out the whole dashboard.
