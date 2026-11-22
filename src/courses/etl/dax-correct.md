---
title: DAX that is correct, not just working
summary: 'Turn the metric dictionary into DAX measures that stay right in totals, blanks and time comparisons, and prove each one against SQL on the warehouse.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: What does CALCULATE do?
    choices: ['Creates a calculated column', 'Evaluates an expression in a changed filter context', 'Refreshes the model']
    ans: 1
    why: CALCULATE adds, removes or replaces filters, then evaluates the expression under them. It is the most important function in DAX.
  - q: 'Store A: $1,000 from 50 orders. Store B: $3,000 from 100 orders. What should the total average check be?'
    choices: ['$25.00', '$26.67', '$40.00']
    ans: 1
    why: 'Ratio of sums: 4,000 ÷ 150 = $26.67. The average of $20 and $30 ignores that B had twice the orders.'
  - q: Why prefer DIVIDE(a, b) to a / b?
    choices: ['It is always faster', 'It returns BLANK (or a value you choose) instead of an error when b is 0 or blank', 'It rounds the result']
    ans: 1
    why: Safe division keeps visuals clean on days or stores with no orders.
sources:
  - 'Microsoft Learn: DAX function reference (CALCULATE, DIVIDE, time intelligence) https://learn.microsoft.com/dax/'
  - 'Russo, M. and Ferrari, A. (2019), The Definitive Guide to DAX, 2nd edition, Microsoft Press'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 4 (semi-additive facts)'
---

**Module 6 · about 40 minutes, plus the lab · read first: [5.6](/learn/courses/etl/metrics-semantic-layer/), [6.1](/learn/courses/etl/power-bi-models/).** New to DAX? The Power BI course teaches it step by step with a practice editor: [first measures](/learn/courses/power-bi/first-measures/), [filter context](/learn/courses/power-bi/filter-context/), [CALCULATE](/learn/courses/power-bi/calculate/) and [context transition](/learn/courses/power-bi/context-transition/). This lesson assumes those and focuses on what a pipeline engineer must guarantee: that the measures match the metric dictionary and the warehouse, in every cell and in every total.

<div class="bigidea">A measure is a rule, not a number: Power BI runs the same rule again for every cell and for the total, so a ratio must be written as a ratio of sums and then proved against the warehouse.</div>

## 1. Why this matters

DAX is short to write and easy to get subtly wrong. A measure can look right on a card and be wrong in a table, or right per day and wrong per month. When that happens, people do not blame DAX; they blame the data, which means they blame your pipeline. So the engineer who built the marts should also own a small set of **cross-checks**: the same number computed in SQL on the warehouse and in DAX on the model, side by side.

Think of a measure as a recipe card, not a cake. Every cell in a matrix bakes the recipe again with its own ingredients (its filters). The total row is not the cakes stacked up; it is one big cake baked from all the ingredients together.

## 2. Measures from the dictionary

Each entry in your metric dictionary (Lesson 5.6) becomes one measure, with the definition copied into its description:

```dax
Net Sales     = SUM ( fct_order_lines[line_revenue] ) - SUM ( fct_order_lines[discount] )
Orders        = DISTINCTCOUNT ( fct_order_lines[order_id] )
Average Check = DIVIDE ( [Net Sales], [Orders] )          -- ratio of sums at any level, safe divide
Food Cost %   = DIVIDE ( SUM ( fct_order_lines[food_cost] ), [Net Sales] )
```

- Numbers you aggregate are **measures**. Attributes you slice by are **columns**, built in dbt.
- Ratios are always `DIVIDE ( [sum of top], [sum of bottom] )`. Never store a ratio in the fact and average it.
- `DISTINCTCOUNT` recounts at every level, which is exactly what a distinct count needs.

If `Orders` would be cheaper as `COUNTROWS ( fct_orders )`, that is a reason to give the warehouse an order-grain fact (Lesson 5.1), not to write cleverer DAX.

## 3. What the total row really does

<div class="steps">
<div class="step"><b>Each cell.</b> The matrix row for Store A has the filter "store = A". Average Check runs: $1,000 ÷ 50 = $20.00.</div>
<div class="step"><b>The next cell.</b> Store B: $3,000 ÷ 100 = $30.00.</div>
<div class="step"><b>The total cell.</b> The filter on store is gone, so the same rule runs on all rows: total sales $4,000 ÷ total orders 150.</div>
<div class="step"><b>The answer.</b> $26.67. Not $25.00 (the average of the two cells) and not $50.00 (their sum). This is correct, even though it surprises people.</div>
<div class="step"><b>The check.</b> Run <code>select sum(net_sales) / sum(orders) from mart.fct_restaurant_daily</code> for the same stores and dates: $26.67. DAX and SQL agree, so the measure is proved.</div>
</div>

<div class="problem" data-problem="dax-correct-average-check"></div>

When a manager really wants a sum of per-row results ("how many stores met their target"), write that explicitly with an iterator: `SUMX ( VALUES ( dim_restaurant[restaurant_key] ), IF ( [Net Sales] >= [Target], 1 ) )`. Inside an iterator, calling a measure turns the current row into a filter (context transition), which is what makes this work.

## 4. Time intelligence on the pipeline's date table

DAX time functions need a marked date table with every date, no gaps. Your generated `dim_date` (Lesson 5.2) is exactly that, and it already holds the columns DAX finds awkward:

```dax
Net Sales LY  = CALCULATE ( [Net Sales], SAMEPERIODLASTYEAR ( dim_date[date_key] ) )
Net Sales YTD = TOTALYTD ( [Net Sales], dim_date[date_key], "04-30" )         -- fiscal year ends 30 April
Net Sales 7d  = CALCULATE ( [Net Sales], DATESINPERIOD ( dim_date[date_key], MAX ( dim_date[date_key] ), -7, DAY ) )

-- same weekday last year, using the column the pipeline built (364 days back)
Net Sales SWLY =
CALCULATE ( [Net Sales], TREATAS ( VALUES ( dim_date[same_weekday_last_year] ), dim_date[date_key] ) )
YoY % = DIVIDE ( [Net Sales] - [Net Sales SWLY], [Net Sales SWLY] )
```

For restaurants and hotels, **same weekday last year** is usually fairer than the same calendar date: a Saturday compared with a Friday tells you nothing. Building that column once in the warehouse means every tool (Power BI, Metabase, SQL) uses the same rule. The Power BI course covers the standard functions in [year to date](/learn/courses/power-bi/ytd-mtd/) and [last year and growth](/learn/courses/power-bi/last-year-growth/).

## 5. Semi-additive and hotel measures

```dax
Rooms Available  = SUMX ( VALUES ( dim_date[date_key] ), SUM ( dim_hotel[rooms] ) )   -- rooms × nights in context
Room Nights Sold = SUM ( fct_stay_nights[room_nights] )
Occupancy        = DIVIDE ( [Room Nights Sold], [Rooms Available] )
ADR              = DIVIDE ( SUM ( fct_stay_nights[room_revenue] ), [Room Nights Sold] )
RevPAR           = DIVIDE ( SUM ( fct_stay_nights[room_revenue] ), [Rooms Available] )
OTB Latest       = CALCULATE ( SUM ( otb_snapshot[room_nights] ), LASTDATE ( otb_snapshot[as_of_date] ) )
```

`Rooms Available` multiplies rooms by the number of nights in the current filter, so a week counts each room seven times. `OTB Latest` is semi-additive: it adds across hotels but takes only the last snapshot date over time.

<div class="problem" data-problem="dax-correct-occupancy"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a measure is a function of the filter context. A total is not the sum of the rows above it; it is the same function on a bigger context.

**Equation:** for a ratio measure over filter context `$F$`,

```math
r(F) = \frac{\sum_{F} a}{\sum_{F} b}, \qquad r(F_1 \cup F_2) \neq r(F_1) + r(F_2), \qquad r(F_1 \cup F_2) \neq \tfrac{1}{2}\big(r(F_1) + r(F_2)\big)
```

in general. The total is a weighted average of the rows, weighted by their share of `$b$`.

**Analogy:** the density of a mixed drink is total mass over total volume, not the average of the densities of the ingredients.

**Try it:** Store A: $1,000 and 50 orders. Store B: $3,000 and 100 orders. Total average check? ($4,000 ÷ 150 = $26.67.)
</details>

## 6. Prove the measures against SQL

Pick five important measures. For one month and one store, compute each in SQL on the warehouse and in a Power BI matrix (date by store). Record the result in `docs/measure-tests.md`:

| Measure | SQL | DAX | Match? |
|---|---|---|---|
| Net Sales, R104, Sept | `select sum(line_revenue - discount) from mart.fct_order_lines where ...` | matrix total | ✓ |
| Average Check, R104, Sept | `select sum(net_sales) / sum(orders) from mart.fct_restaurant_daily where ...` | matrix total | ✓ |

DAX bugs hide in **totals and blanks**: always check the total row and one day with no sales.

<div class="meaning">

<dl>
<dt>Measure</dt><dd>A formula Power BI runs again for every cell, using that cell's filters.</dd>
<dt>Filter context</dt><dd>The set of filters (slicers, rows, columns) that apply to one cell.</dd>
<dt>CALCULATE</dt><dd>Runs an expression after changing the filters.</dd>
<dt>Ratio of sums</dt><dd>Add up the top, add up the bottom, divide once; the only correct way to total a ratio.</dd>
<dt>Physical meaning</dt><dd>A regional director sees an average check of $25 for her region on one page and $26.67 on another. The first page averaged store values; the second divided sums. With measures written once from the dictionary and proved against SQL, only the correct $26.67 can appear.</dd>
</dl>

</div>

<div class="myth">

**"The total row is wrong because it is not the sum of the rows."** For additive measures the total is the sum. For ratios, distinct counts and semi-additive measures it must not be. If users expect a different total, explain it in the measure's description, or write the explicit iterator they actually want.

</div>

## 7. Try it

1. Build 20 to 25 measures in `_Measures`: restaurant (Net Sales, Orders, Average Check, Items per Order, Food Cost %), time (LY, same weekday LY, YoY %, fiscal YTD, 7-day, 28-day), hotel (Rooms Available, Occupancy, ADR, RevPAR, OTB Latest) and marketing (Spend, ROAS, CPA).
2. Give each a description copied from the metric dictionary and a display folder. Use `DIVIDE`, never `/`. Set format strings in the model.
3. Cross-check five measures against SQL for one month and one store; record them in `docs/measure-tests.md`.
4. In DAX Studio, time one slow measure (a `FILTER` over the whole fact) and rewrite it with a simple column filter inside `CALCULATE`; record both timings.
5. Use `USERELATIONSHIP` to show bookings by created date and by arrival date in one visual.

**What to check:** every measure has a description; five cross-checks pass, including a total row and a blank day; no measure averages a stored ratio. Commit as `feat(powerbi): documented measures with SQL cross-checks`.

<div class="keypoints">

- Write each dictionary metric once as a measure; ratios are DIVIDE of sums, distinct counts use DISTINCTCOUNT.
- The total row runs the same measure on a bigger filter; for ratios it is a weighted average, not a sum or a plain mean.
- Build calendar logic such as same weekday last year in the warehouse's date table, then use it from DAX.
- Prove key measures against SQL on the warehouse, checking totals and empty days.

</div>
