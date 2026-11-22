---
title: Metrics, additivity and the semantic layer
summary: 'Write a metric dictionary, aggregate additive, semi-additive and ratio metrics correctly, build same-store sales, and know when a semantic layer pays.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Daily unique customers Monday to Sunday are 300, 280, 310, 290, 350, 400 and 380. How many unique customers for the week?
    choices: ['2,310', '330', 'Unknown from these numbers: recount distinct customers over the whole week']
    ans: 2
    why: The same customer can come on several days. Distinct counts never add up; recompute them at the grain you show.
  - q: A menu item is very popular but has a below-average contribution margin. What is its menu-engineering class?
    choices: ['Star', 'Plowhorse', 'Puzzle']
    ans: 1
    why: Popular with a low margin is a plowhorse. Typical actions are a small price rise or a cheaper recipe.
  - q: Why leave new stores out of same-store sales growth?
    choices: ['Their sales would count as growth even if existing stores did not grow', 'They have no data', 'To make the numbers look better']
    ans: 0
    why: Holding the set of stores fixed measures like-for-like change, not expansion.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 1 and Chapter 4 (additive, semi-additive and non-additive facts)'
  - 'Kasavana, M. L. and Smith, D. I. (1982), Menu Engineering: A Practical Guide to Menu Analysis, Hospitality Publications'
  - 'dbt documentation: the dbt Semantic Layer and MetricFlow https://docs.getdbt.com/docs/build/about-metricflow'
  - 'Cube documentation (open-source semantic layer) https://cube.dev/docs'
---

**Module 5 · about 40 minutes · read first: [5.1](/learn/courses/etl/dimensional-modelling-grain/), [5.4](/learn/courses/etl/dbt-basics/).** You'll be able to write a metric dictionary entry, sort any metric into additive, semi-additive, non-additive or distinct count and aggregate it correctly, build same-store sales and a menu-engineering model in SQL, and decide whether a company needs a separate semantic layer.

<div class="bigidea">Every important number gets one written definition, one formula and one owner, and it is computed in one place, so two dashboards can never show two different "revenues".</div>

## 1. Why this matters

Two dashboards showing two different revenue numbers destroy more trust than any failed pipeline. Usually both numbers are "right": one includes tax, one does not; one uses the business date, one the calendar date. Senior BI people own **definitions**: what each metric means, how it is computed, and where it is computed, once.

A metric dictionary is like the rules sheet for a board game. Without it, every family plays slightly different rules, and arguments start the moment two families play together.

## 2. The metric dictionary

One entry per metric, kept in the repo (as dbt YAML or a Markdown table) and linked from every dashboard:

| Field | Example |
|---|---|
| Name | Net sales |
| Definition | Gross line revenue minus discounts and refunds, excluding tax and tips, by business date |
| Formula | `sum(line_revenue) - sum(discount) - sum(refund_amount)` |
| Additivity | Additive across all dimensions |
| Source model | `fct_order_lines` |
| Owner | Finance signs off; BI implements |
| Caveats | Delivery-platform orders are net of platform fees from October 2026 |

When finance and operations disagree on a definition, do not quietly pick a winner in code. Build both with different names (`net_sales_finance`, `net_sales_ops`), show the bridge between them on one page (Lesson [6.6](/learn/courses/etl/reconciliation/)), and let the owners agree which goes on the executive dashboard.

Tap a value in one or two dimensions and watch the fact rows light up.

<figure class="fig" data-fig="@data-star-slice"><figcaption>Notice that the filter is on the dimension but the numbers come from the fact table.</figcaption></figure>


## 3. Additivity rules

| Class | Examples | How to aggregate |
|---|---|---|
| **Additive** | Revenue, quantity, ad spend, clicks, room nights | `sum` over anything |
| **Semi-additive** | Stock on hand, rooms on the books, active members, cash balance | `sum` across places; **last value or average** over time |
| **Non-additive** | Average check, occupancy, ADR, RevPAR, ROAS, click-through rate, margin % | **ratio of sums** at the level shown |
| **Distinct counts** | Unique customers, unique guests | recount `count(distinct)` at each level; never add daily uniques |

The trap with ratios: the average of daily average checks is not the month's average check. A quiet Tuesday would count as much as a packed Saturday.

<div class="steps">
<div class="step"><b>Two days.</b> Saturday: $12,000 from 800 orders (average check $15.00). Tuesday: $2,000 from 200 orders ($10.00).</div>
<div class="step"><b>The tempting answer.</b> Average the averages: (15 + 10) ÷ 2 = $12.50.</div>
<div class="step"><b>Add the tops.</b> Sales: 12,000 + 2,000 = $14,000.</div>
<div class="step"><b>Add the bottoms.</b> Orders: 800 + 200 = 1,000.</div>
<div class="step"><b>Divide once.</b> $14,000 ÷ 1,000 = $14.00. Store sums in the mart and divide at the level the reader sees.</div>
</div>

<div class="problem" data-problem="metrics-semantic-layer-avg-check"></div>

So in the warehouse, store the **parts** (net sales, orders) in `fct_restaurant_daily`, never a pre-computed daily average check that someone will later average.

## 4. Sector metrics worth knowing

- **Quick-service restaurants:** net sales, orders, average check (net sales ÷ orders), items per order, channel mix, food cost % (food cost ÷ net sales), labour %, and **same-store sales growth**.
- **Menu engineering** (Kasavana and Smith): classify each item by **popularity** (its share of items sold against a threshold of 70 % of an equal share, `$0.7 / n$` for `$n$` items) and **contribution margin** (price minus food cost) against the average. *Stars* are popular with a high margin, *plowhorses* popular with a low margin, *puzzles* unpopular with a high margin, *dogs* unpopular with a low margin.
- **Hotels:** occupancy, ADR, RevPAR, pickup, pace, cancellation rate, length of stay.
- **Retail:** sales per square metre, basket size, units per transaction, sell-through, refund rate, gross margin %.
- **Marketing:** click-through rate, cost per click, cost per acquisition, return on ad spend.

```sql
-- mart: menu engineering per brand per month (dbt model)
with items as (
  select brand, month, menu_item_key,
         sum(qty) as qty,
         sum(line_revenue - food_cost) / nullif(sum(qty), 0) as cm_per_item
  from {{ ref('fct_order_lines') }} group by all
),
scored as (
  select *, qty * 1.0 / sum(qty) over (partition by brand, month)   as mix,
         count(*) over (partition by brand, month)                  as n_items,
         sum(cm_per_item * qty) over (partition by brand, month)
           / sum(qty) over (partition by brand, month)              as avg_cm
  from items
)
select *,
  case when mix >= 0.7 / n_items and cm_per_item >= avg_cm then 'star'
       when mix >= 0.7 / n_items                          then 'plowhorse'
       when cm_per_item >= avg_cm                         then 'puzzle'
       else 'dog' end as menu_class
from scored;
```

Test it with a hand-made fixture of four items whose classes you worked out on paper.

## 5. Same-store sales

A restaurant group that opens ten new sites will grow total sales even if every old site is shrinking. **Same-store sales** compares only the sites open for the whole of both periods. Add `is_comparable` to `dim_restaurant` (for example, open for at least 13 months) and compute growth over that set only. Write the rule down: how you treat remodels, temporary closures and an extra Saturday in one year.

<div class="problem" data-problem="metrics-semantic-layer-sss"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** same-store growth must compare the same set of stores in both periods.

**Equation:** with `$S$` the stores open for all of both periods and `$R_{s,t}$` store `$s$`'s revenue in period `$t$`,

```math
\text{SSS} = \frac{\sum_{s \in S} R_{s,t}}{\sum_{s \in S} R_{s,t-1}} - 1
```

Total growth uses all stores and mixes in openings and closures.

**Analogy:** a fair experiment holds everything fixed except the thing you measure. Here you hold the set of stores fixed.

**Where it breaks:** remodels, temporary closures and calendar shifts. Adjust or exclude, and state the rule in the dictionary.

**Try it:** last year 10 stores sold $10M. This year those 10 sold $10.3M and 2 new stores sold $1.2M. Same-store growth? Total growth? (3 %; 15 %.)
</details>

## 6. The semantic layer

A **semantic layer** stores metric definitions once, and every tool asks it for "net sales by brand by week" instead of writing its own SQL. Options: the **dbt Semantic Layer** (MetricFlow), **Cube** (open source), **Power BI semantic models** (a dataset with DAX measures is itself a semantic layer in Microsoft shops), and LookML in Looker.

For a medium company with one BI tool, the Power BI model *is* the semantic layer, and a dictionary in git is enough. Add a separate layer when several tools (Power BI, Metabase, notebooks, a chat assistant) must agree on the same numbers. Lesson [6.2](/learn/courses/etl/dax-correct/) writes these definitions as DAX measures.

<div class="meaning">

<dl>
<dt>Metric dictionary</dt><dd>One written entry per metric: definition, formula, additivity, source model, owner, caveats.</dd>
<dt>Semi-additive</dt><dd>Adds up across places but not across time; over time use the last value or an average.</dd>
<dt>Non-additive</dt><dd>A ratio: add up the top and the bottom first, then divide.</dd>
<dt>Same-store sales</dt><dd>Growth measured only on stores open in both whole periods.</dd>
<dt>Semantic layer</dt><dd>One shared place where metrics are defined, which every tool queries.</dd>
<dt>Physical meaning</dt><dd>The chief executive reads 15 % growth on one slide and 3 % on another. With a dictionary, the slide says "total sales +15 %, same-store +3 %", and the board understands that growth came from new sites while existing ones barely moved.</dd>
</dl>

</div>

<div class="myth">

**"Summing daily unique customers gives weekly unique customers."** A regular who visits five times a week would be counted five times. Distinct counts must be recounted at every level: day, week, month. Store the customer key in the fact table, not a daily distinct count.

</div>

## 7. Try it

1. Write `docs/metrics.md` (or dbt `semantic_models` and `metrics` YAML) with 20 metrics across restaurants, hotels, retail and marketing: definition, formula, additivity, source model, owner, caveats.
2. Build `fct_menu_engineering` per brand and month with the SQL above. Test it on a four-item fixture.
3. Build `fct_restaurant_daily` with net sales and orders. Show in the docs that the average of daily average checks differs from the ratio of sums for a month, and explain why.
4. Add `is_comparable` to `dim_restaurant` and a same-store sales model. Generate 400 more days of synthetic history and add two "new" restaurants to the reference file.
5. Optional: define five metrics in Cube or MetricFlow and query them.

**What to check:** every metric has an owner and an additivity class; the menu-engineering fixture gives the classes you worked out by hand; same-store growth excludes the new sites. Commit as `feat(metrics): metric dictionary, menu engineering, same-store sales`.

**New words:** *metric dictionary*, *additive*, *semi-additive*, *non-additive*, *distinct count*, *same-store sales*, *menu engineering*, *contribution margin*, *semantic layer*.

<div class="keypoints">

- One definition, one formula, one owner and one place of computation per metric, written in a dictionary in git.
- Additive metrics sum; semi-additive ones use the last value over time; ratios are ratios of sums; distinct counts are recounted.
- Store the parts of a ratio in the mart (sales and orders), never a pre-averaged ratio.
- Same-store sales holds the set of stores fixed. A separate semantic layer pays off when several tools must agree.

</div>
