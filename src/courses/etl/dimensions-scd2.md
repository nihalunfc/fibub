---
title: 'Dimensions done right: keys, dates and SCD2'
summary: 'Surrogate keys, unknown members, a generated date dimension and SCD2 history, with point-in-time joins and tests that versions cover time with no gaps.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A store moved from region West to region Central on 1 July. With region tracked as SCD2, how do last year's sales by region look?
    choices: ['All in Central', 'West before 1 July and Central from 1 July', 'Split evenly between the two']
    ans: 1
    why: SCD2 keeps one row per version, and each fact points at the version valid when it happened, so history stays as it was.
  - q: Why use half-open intervals [valid_from, valid_to) for SCD2 versions?
    choices: ['They are shorter to type', 'Every moment matches exactly one version, so nothing double-matches at a boundary', 'SQL Server requires them']
    ans: 1
    why: With closed intervals an order at exactly the change time would match both versions and be counted twice.
  - q: A fact row's menu code is not in the dimension yet. What is the best handling?
    choices: ['Drop the row', 'Point it at the unknown member (key −1) and count it on the data quality report', 'Fail the whole load']
    ans: 1
    why: Revenue stays complete, and the gap stays visible until the dimension catches up.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 5 (slowly changing dimension techniques) and Chapter 3 (the date dimension)'
  - 'DuckDB documentation: date functions and generate_series https://duckdb.org/docs/'
  - 'dbt documentation: snapshots https://docs.getdbt.com/docs/build/snapshots'
---

**Module 5 · about 40 minutes · read first: [5.1](/learn/courses/etl/dimensional-modelling-grain/).** You'll be able to give every dimension surrogate keys and an unknown member, generate a date dimension with a fiscal year and a "same weekday last year" column, build an SCD2 dimension from daily snapshots, and test that its versions cover time with no gaps or overlaps.

<div class="bigidea">A dimension that keeps history writes a new row each time something important changes, and every fact points at the row that was true on the day it happened.</div>

## 1. Why this matters

"What was the Classic Burger's price when this order was placed?" "Which region was store R104 in last quarter, before the reorganisation?" Neither question can be answered from a dimension that simply overwrites old values. History in dimensions is the topic that trips up most people in their first BI job, and it is entirely the pipeline's job to get right: a dashboard cannot rebuild history that the warehouse threw away.

The Power BI course shows how a report uses a date table in [A proper date table](/learn/courses/power-bi/date-table/). Here you build that table, and the history-keeping dimensions around it, in the warehouse.

## 2. Surrogate keys and unknown members

- Facts point at dimensions with a **surrogate key**: a plain number the warehouse makes up (`menu_item_key int`), not the code from the source (`menu_item_id = 'BB-0042'`). Source codes get reused, renamed and merged; your key never changes meaning.
- Every dimension has an **unknown** row (key −1, name "Unknown") and, if useful, a **not applicable** row (−2). A fact whose code does not match yet points at −1 instead of being dropped. The data quality report from [Lesson 2.6](/learn/courses/etl/quality-gates/) counts those rows each day.

A surrogate key is like a library's own barcode on a book: the publisher may reprint the book with a new ISBN, but the barcode on the shelf copy stays the same.

Switch between Type 1, 2 and 3 and read the sales-by-city report each time.

<figure class="fig" data-fig="@data-scd-types"><figcaption>Notice which method keeps last year's sales in Pune and which rewrites history.</figcaption></figure>


## 3. The date dimension

One row per date, **generated** (never loaded from a source), covering every date a fact could have plus a few years ahead.

```sql
-- DuckDB flavour
create table dim_date as
select d::date                                   as date_key,
       year(d) as year, quarter(d) as quarter, month(d) as month,
       strftime(d, '%b')                         as month_name,
       isodow(d)                                 as iso_dow,
       strftime(d, '%a')                         as dow_name,
       week(d)                                   as iso_week,
       isodow(d) in (6, 7)                       as is_weekend,
       case when month(d) >= 5 then year(d) + 1 else year(d) end as fiscal_year,  -- fiscal year starts 1 May
       (d - interval 364 day)::date              as same_weekday_last_year        -- 52 weeks back, same weekday
from generate_series(date '2024-01-01', date '2028-12-31', interval 1 day) t(d);
```

Then join in a small **holiday table** you type yourself: public holidays where your stores are, long weekends, local festival weeks. Restaurant and hotel numbers are unreadable without it ("why did Monday drop 30 %?" "It was a holiday.").

`same_weekday_last_year` matters because a Saturday should be compared with a Saturday. 364 days is exactly 52 weeks.

## 4. Slowly changing dimensions

| Type | What happens on a change | Use for |
|---|---|---|
| **SCD 0** | Never changes | Original values: date opened |
| **SCD 1** | Overwrite the old value | Corrections: a typo in a name |
| **SCD 2** | Add a new row with `valid_from`, `valid_to`, `is_current` | Anything you report history by: price, region, brand, manager |
| **SCD 3** | Keep a "previous value" column | One-off reorganisations where people want old and new side by side |

An SCD2 dimension is like a passport history: when you renew, the old passport is not rewritten, it is stamped "valid until" and a new one starts. Any stamp in your travel history belongs to exactly one passport.

<div class="steps" data-fig="dimensions-scd2-versions">
<div class="step"><b>One version.</b> The Classic Burger has key 101, price $6.49, valid from 1 January to 9999-12-31 (meaning "no end yet"), is_current = yes.</div>
<div class="step"><b>A change arrives.</b> The 1 March menu snapshot shows $6.99. The tracked columns' hash differs from yesterday's, so the pipeline closes 101 (valid_to = 1 March) and opens key 214 from 1 March.</div>
<div class="step"><b>Orders find their version.</b> An order on 20 February joins to 101. An order at exactly 1 March 00:00 joins only to 214, because the intervals are half-open: [from, to).</div>
<div class="step"><b>Another change.</b> On 1 July the price becomes $7.29: close 214, open 388. One burger, three rows.</div>
<div class="step"><b>Tests.</b> For each item, every valid_to equals the next valid_from (no gaps, no overlaps), and exactly one row is current.</div>
</div>

Building it from daily snapshots in SQL:

```sql
with snap as (
  select menu_item_id, snapshot_date, item_name, price,
         md5(concat_ws('|', price, category)) as tracked_hash              -- only the SCD2 columns
  from menu_snapshots
),
changes as (
  select *, lag(tracked_hash) over (partition by menu_item_id order by snapshot_date) as prev_hash
  from snap
),
starts as (
  select * from changes where prev_hash is null or prev_hash <> tracked_hash  -- first row or a real change
)
select row_number() over (order by menu_item_id, snapshot_date) as menu_item_key,
       menu_item_id, item_name, price,
       snapshot_date as valid_from,
       coalesce(lead(snapshot_date) over (partition by menu_item_id order by snapshot_date), date '9999-12-31') as valid_to,
       lead(snapshot_date) over (partition by menu_item_id order by snapshot_date) is null as is_current
from starts;
```

(In practice, keep keys stable across rebuilds by building the dimension incrementally or with a dbt snapshot, Lesson [5.4](/learn/courses/etl/dbt-basics/); `row_number()` here is for learning.)

<div class="problem" data-problem="dimensions-scd2-rows"></div>

## 5. Point-in-time joins, and doing them once

```sql
-- the version valid when the order happened
select f.order_id, f.business_date, m.item_name, m.price as list_price_at_order
from fct_order_lines f
join dim_menu_item m
  on m.menu_item_id = f.menu_item_id
 and f.order_ts >= m.valid_from and f.order_ts < m.valid_to;   -- half-open
```

Better still: resolve the right `menu_item_key` **at load time** and store it on the fact row. Reports then join on the key alone, which is simple and fast, and nobody can get the date logic wrong in a dashboard.

<div class="problem" data-problem="dimensions-scd2-list-revenue"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the versions of one natural key must tile time: no gaps, no overlaps.

**Equation:** for versions `$v_1, \dots, v_n$` of key `$k$`, sorted by start,

```math
\text{to}(v_i) = \text{from}(v_{i+1}), \qquad \text{to}(v_n) = \infty
```

With half-open intervals `$[\text{from}, \text{to})$`, every instant `$t$` belongs to exactly one version.

**Analogy:** cutting a ribbon into pieces. Every point of the ribbon is on exactly one piece. Closed intervals `$[a, b]$` would put the cut point on two pieces; a gap leaves a bit of ribbon on none (and the facts there become orphans).

**Try it:** versions [1 Jan, 1 Mar) and [1 Mar, ∞). Which one does an order at 1 March 00:00:00 match? (Only the second.)
</details>

<div class="meaning">

<dl>
<dt>Surrogate key</dt><dd>A number the warehouse makes up for each dimension row; facts store it instead of the source code.</dd>
<dt>Unknown member</dt><dd>The row with key −1 that catches facts whose code has no match yet, so nothing is dropped.</dd>
<dt>SCD2</dt><dd>On a change, close the current row and add a new one, so history stays as it was.</dd>
<dt>Half-open interval</dt><dd>[valid_from, valid_to): includes the start, excludes the end, so boundaries belong to one side only.</dd>
<dt>Physical meaning</dt><dd>Finance asks why last year's West region revenue dropped in this year's report. With region as SCD1, every store that moved was silently relabelled and history was rewritten. With SCD2, last year still shows the stores where they were, and the reorganisation shows up only from the day it happened.</dd>
</dl>

</div>

<div class="myth">

**"Make every column SCD2, just to be safe."** That explodes row counts and confuses people ("why are there three Classic Burgers?"). Ask the business attribute by attribute which ones need history. A typical answer: price, region, brand and manager are SCD2; names and descriptions are SCD1. Keep `is_current` so a slicer can show only today's names while facts keep their historical keys.

</div>

## 6. Try it

1. Generate `dim_date` for 2024 to 2028 with a fiscal year starting 1 May, ISO week and `same_weekday_last_year`. Type a holidays table for two years and join it in.
2. Write a small Python script that changes six menu items' prices on random dates and writes daily snapshots `reference/menu_snapshots/<date>.csv`.
3. Build `dim_menu_item` as SCD2 from the snapshots with the SQL above.
4. Write four tests as queries that must return zero rows: overlapping versions, gaps between versions, items with more or fewer than one current row, and a missing unknown member.
5. Resolve `menu_item_key` on `fct_order_lines` at load time. For one item whose price changed, compare revenue at list price with revenue at actual price paid.

**What to check:** all four tests return zero rows; an order at the exact change time matches one version; the unknown member exists and the data quality report counts facts pointing at it. Commit as `feat(model): date dimension, holidays, SCD2 menu dimension with tests`.

**New words:** *surrogate key*, *natural key*, *unknown member*, *date dimension*, *SCD 0, 1, 2, 3*, *half-open interval*, *point-in-time join*.

<div class="keypoints">

- Facts store surrogate keys; every dimension has an unknown member (−1) so no fact is dropped.
- Generate the date dimension, with fiscal year, holidays and same weekday last year (364 days back).
- SCD1 overwrites, SCD2 adds a row per change with half-open validity, SCD3 keeps a "previous" column.
- Test that SCD2 versions tile time and that exactly one row per item is current. Resolve the version key at load time.

</div>
