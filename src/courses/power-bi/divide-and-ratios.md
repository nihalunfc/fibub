---
title: DIVIDE, ratios and percentages
seoTitle: 'DAX DIVIDE function and percentage measures'
summary: Ratios are where many reports go wrong. Use DIVIDE to avoid errors, build measures from other measures, and learn why a ratio of totals is not the average of ratios.
minutes: 14
updated: 2026-11-22
quiz:
  - q: What does DIVIDE([A], [B]) return when [B] is blank or 0?
    choices: ['An error', 'Blank (or the third argument, if given)', 'Infinity']
    ans: 1
    why: DIVIDE handles division by zero safely. With / you get Infinity or an error that shows up in visuals.
  - q: Margin % for a category should be…
    choices: ['the average of each line''s margin %', 'total margin ÷ total sales for that category', 'the sum of each line''s margin %']
    ans: 1
    why: A ratio of totals weights each sale by its size. Averaging line percentages treats a $5 sale like a $500 one.
  - q: Why build Margin % from [Total Margin] and [Total Sales] instead of writing it all in one formula?
    choices: ['It runs slower', 'Each base measure is defined once and reused, so a fix in one place fixes every measure that uses it', 'DAX requires it']
    ans: 1
    why: Building on measures keeps definitions consistent and the code short, which is how professional models are organised.
---

**Module 4 · about 14 minutes · read first: 4.1.** You'll be able to write ratio measures that are correct for any filter.

## 1. Why this matters

Managers think in ratios: margin %, average order value, conversion rate, share of sales. A ratio that's wrong at the total row is the fastest way to lose a manager's trust.

## 2. DIVIDE

`DIVIDE(numerator, denominator, [alternate])` returns blank (or the alternate) when the denominator is 0 or blank. Always use it for measures:

<!--fig:dax-pad m-avg-line-->

See why with a store that has no sales in 2024:

<!--fig:dax-pad m-divide-zero-->

The `/` version shows **Infinity** for Forks Market (its 2024 sales are blank), which would break a chart; DIVIDE leaves it blank. (Use `/` only inside iterators where you know the denominator is never zero; it is slightly faster.)

## 3. Measures built on measures

<!--fig:dax-pad m-margin-pct-->

Each measure is a building block. `Total Margin` reuses `Total Sales` and `Total Cost`; `Margin %` reuses both. If finance changes how cost is worked out, you change `Total Cost` and every measure above it follows.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a ratio for a group is the ratio of the group's totals:

```math
\text{Margin \%}_{\text{group}} = \frac{\sum_{r} \text{Margin}_r}{\sum_{r} \text{Sales}_r} \neq \frac{1}{n}\sum_r \frac{\text{Margin}_r}{\text{Sales}_r}
```

The right side is the average of line percentages, which gives a $5 line the same weight as a $500 line. A measure computes both sums in the current filter context first, then divides, so it's right at every level, including the total row.

**Try it:** two lines, sales 10 and 90, margins 5 and 9. Ratio of totals: 14/100 = 14 %. Average of ratios: (50 % + 10 %)/2 = 30 %. Which describes the business? (14 %.)
</details>

## 4. Worked example

*Average order line value by category.* `Average Line = DIVIDE([Total Sales], [Order Lines])`. Electronics has the highest (the earbuds are $89), Grocery the lowest. At the total row the measure divides total sales by total lines, about $64, which is not the average of the four category averages. That's correct: categories with more lines carry more weight.

## 5. Practice

1. Write `Share of Units` for each store: its units ÷ all units. (You'll need ALL from Lesson 5.3; try it there.)
2. Why does a "Margin %" calculated column summed in a visual show numbers like 3,000 %?
3. Write `Sales per Store` = Total Sales ÷ number of stores with sales.

<details>
<summary>Answers</summary>

1. `DIVIDE([Units], CALCULATE([Units], ALL(Store)))`.
2. It adds up thousands of row-level percentages. Ratios must be measures.
3. `DIVIDE([Total Sales], DISTINCTCOUNT(Sales[StoreKey]))`.
</details>
