---
title: SQL the way senior analysts write it
summary: 'Window functions, date spines that show missing days, gaps and islands, cohorts, T-SQL differences and known-answer tests that settle arguments fast.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A moving average uses ROWS BETWEEN 6 PRECEDING AND CURRENT ROW, but some days are missing. What goes wrong?
    choices: ['Nothing', 'It averages the last 7 rows, which can stretch over more than 7 days', 'ROWS is slower than RANGE']
    ans: 1
    why: Rows are not days when days are missing. Join to a date spine first, or use a time-based RANGE window.
  - q: 'Missing days 10, 11, 12 and 20 get row numbers 1 to 4. What is day minus row number for each?'
    choices: ['9, 9, 9, 16: two islands', '10, 11, 12, 20', '9, 10, 11, 16']
    ans: 0
    why: The value stays the same inside a run of consecutive days and jumps between runs.
  - q: What is the T-SQL equivalent of DuckDB's QUALIFY row_number() OVER (...) = 1?
    choices: ['HAVING row_number() = 1', 'Compute row_number in a CTE, then filter WHERE rn = 1 outside it', 'It cannot be done']
    ans: 1
    why: T-SQL has no QUALIFY, so you filter the window result in an outer query.
sources:
  - 'DuckDB documentation: window functions and the QUALIFY clause https://duckdb.org/docs/'
  - 'Microsoft Learn: SELECT - OVER clause (Transact-SQL) https://learn.microsoft.com/sql/t-sql/queries/select-over-clause-transact-sql'
  - 'PostgreSQL documentation: window functions tutorial https://www.postgresql.org/docs/current/tutorial-window.html'
---

**Module 5 · about 45 minutes, plus a long lab · read first: [5.2](/learn/courses/etl/dimensions-scd2/), [4.5](/learn/courses/etl/tsql-for-warehouses/).** You'll be able to write running totals, ranks and period-over-period with window functions, build a date spine that tells "zero" apart from "missing", find streaks with gaps and islands, build a cohort table, and prove each query with a tiny known-answer test.

<div class="bigidea">Senior SQL is not clever SQL: it is one named step per idea, a date spine so missing days are visible, and a ten-row test whose answer you worked out on paper.</div>

## 1. Why this matters

The patterns below show up in BI interviews and every week in real work. As a pipeline engineer you also write them into models that hundreds of people read, so a quiet mistake (a moving average that skips closed days) spreads everywhere. Work them in DuckDB first for fast feedback, then run a few on Azure SQL to learn the T-SQL differences.

SQL fundamentals (SELECT, JOIN, GROUP BY) are not repeated here; fibub's SQL courses will be listed on [all courses](/learn/courses/) when they open. If you know pandas, the same ideas appear in [rolling windows](/learn/courses/pandas/rolling/) and [cohorts](/learn/courses/pandas/cohorts/).

## 2. Window functions

A window function looks at neighbouring rows without collapsing them, like a runner who can see the people just ahead and behind in the queue while staying in place.

```sql
with daily as (
  select restaurant_id, business_date, sum(qty * price) as revenue
  from stg_pos group by all
)
select *,
  sum(revenue) over (partition by restaurant_id order by business_date
                     rows between unbounded preceding and current row)  as running_revenue,
  avg(revenue) over (partition by restaurant_id order by business_date
                     rows between 6 preceding and current row)          as ma7_rows,
  revenue / nullif(lag(revenue, 7) over (partition by restaurant_id order by business_date), 0) - 1
                                                                        as vs_same_weekday_last_week,
  rank() over (partition by business_date order by revenue desc)        as rank_on_day
from daily;
```

- `partition by` restarts the window for each restaurant.
- `rows between 6 preceding and current row` counts **rows**. `range between interval 6 days preceding and current row` counts **time**. They give different answers as soon as a day is missing, which is the next topic.
- `nullif(x, 0)` avoids dividing by zero.

## 3. Date spines: zero or missing?

A moving average over rows silently skips days with no rows. Build a **spine**, every restaurant times every date, and left-join the data to it. Then decide for each empty cell: closed (exclude), not received (flag it), or genuinely zero sales (0).

A spine is like a school register with every pupil's name printed for every day: an empty box stands out, where a list of only the pupils who turned up would hide the absences.

```sql
with spine as (
  select r.restaurant_id, d.date_key as business_date
  from dim_restaurant r
  cross join dim_date d
  where d.date_key between date '2026-09-01' and date '2026-10-29'
    and d.date_key >= r.open_date                        -- no rows before a restaurant opened
)
select s.*, coalesce(t.revenue, 0) as revenue, t.revenue is null as no_data
from spine s left join daily t using (restaurant_id, business_date);
```

<div class="problem" data-problem="senior-sql-spine"></div>

## 4. Gaps and islands

Find runs of consecutive days: a store's silent days, a guest's consecutive stays, a campaign's streak above target.

<div class="steps" data-fig="senior-sql-islands">
<div class="step"><b>The days.</b> Store R107 over 14 days. Days 3, 4, 5, 9, 10 and 13 have no data.</div>
<div class="step"><b>Number them.</b> Keep only the silent days, sorted, and give each a row number: 1, 2, 3, 4, 5, 6.</div>
<div class="step"><b>Subtract.</b> Day minus row number: 2, 2, 2, 5, 5, 7. Inside a run of consecutive days, both go up by one, so the difference stays the same.</div>
<div class="step"><b>Label.</b> That leftover number names each island: 2, 5 and 7. Three separate silences.</div>
<div class="step"><b>Group.</b> GROUP BY the label: days 3 to 5 (3 days), 9 to 10 (2 days), 13 (1 day).</div>
</div>

```sql
with flagged as (
  select store_code, business_date,
         business_date - cast(row_number() over (partition by store_code order by business_date) as int) as grp
  from spine_with_flags
  where no_data
)
select store_code, min(business_date) as gap_start, max(business_date) as gap_end, count(*) as days
from flagged
group by store_code, grp
order by days desc;
```

<div class="problem" data-problem="senior-sql-islands"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** in a run of consecutive whole numbers, value minus rank is constant. That constant labels the run.

**Equation:** for sorted days `$d_1 < d_2 < \dots$` with ranks `$r_i = i$`, let `$g_i = d_i - r_i$`. If `$d_{i+1} = d_i + 1$` then `$g_{i+1} = g_i$`; a jump of `$k$` days makes `$g$` jump by `$k - 1$`.

**Analogy:** people walking up a staircase one step per second. Subtract the clock from the step number and everyone who never paused shares the same answer; a pause changes it.

**Where it breaks:** duplicate days give two rows the same day but different ranks. Deduplicate first, or use `dense_rank()`.

**Try it:** days 3, 4, 5, 9, 10. Ranks 1 to 5. Labels? (2, 2, 2, 5, 5: two islands.)
</details>

## 5. Cohorts

Retention by first-purchase month for a loyalty programme, or repeat guests for a hotel:

```sql
with firsts as (
  select customer_id, date_trunc('month', min(order_date)) as cohort from orders group by 1
),
activity as (
  select distinct customer_id, date_trunc('month', order_date) as month from orders
)
select cohort, datediff('month', cohort, month) as month_n, count(*) as active
from firsts join activity using (customer_id)
group by 1, 2
order by 1, 2;
```

Read the result as a triangle: each cohort's row starts at 100 % in month 0 and shows how many came back in month 1, 2, 3. The [statistics course](/learn/courses/statistics/) covers how to tell real changes in retention from noise.

## 6. T-SQL differences to remember

| DuckDB or Postgres | T-SQL (SQL Server, Azure SQL) |
|---|---|
| `limit 10` | `select top (10)` or `offset 0 rows fetch next 10 rows only` |
| `date_trunc('month', d)` | `datetrunc(month, d)` on newer versions, or `datefromparts(year(d), month(d), 1)` |
| `d - interval 7 day` | `dateadd(day, -7, d)` |
| `qualify rn = 1` | compute `rn` in a CTE, filter `where rn = 1` outside |
| `group by all` | list the columns |
| `generate_series(...)` | `generate_series` on newer versions, otherwise a numbers table |

Function availability depends on the SQL Server version and compatibility level: check Microsoft Learn for yours.

## 7. Write SQL like code

- One CTE per step, named for what it holds: `daily_revenue`, `spine`, `with_flags`.
- No `select *` in final models; explicit join conditions.
- **Known-answer tests:** a tiny hand-made input (ten rows) where you can work out the answer on paper, and a test that compares the query's output with it. When an analyst says "your week-on-week number is wrong", the known-answer test settles it in a minute.

<div class="meaning">

<dl>
<dt>Window function</dt><dd>A calculation over neighbouring rows (running total, rank, lag) that keeps every row.</dd>
<dt>ROWS vs RANGE</dt><dd>ROWS counts rows back; RANGE counts time back. They differ when days are missing.</dd>
<dt>Date spine</dt><dd>Every entity times every date, so missing days appear as rows you can flag.</dd>
<dt>Gaps and islands</dt><dd>Finding runs of consecutive values with "value minus row number".</dd>
<dt>Physical meaning</dt><dd>An area manager sees a store's 7-day average looking healthy. In fact the store's tills were silent for three days and the average was taken over the seven days that did report, stretching back two weeks. A spine with a no_data flag turns that into a visible "3 days missing" on the dashboard.</dd>
</dl>

</div>

<div class="myth">

**"A 7-row moving average is a 7-day moving average."** Only if every day has exactly one row. Closed days, late files and new stores break that. Use a spine or a RANGE window, and decide on purpose what an empty day means.

</div>

## 8. Practice

Write each as a `.sql` file with a known-answer test on a ten-row fixture:

1. Running revenue per restaurant, restarting each month.
2. A 7-day moving average with a RANGE window; compare with ROWS on a store with gaps.
3. Same-weekday-last-week % change per restaurant.
4. Top 3 menu items per brand per week, ties included.
5. Each restaurant's best and worst day, with the date.
6. Silent islands for one store.
7. Hotel: runs of consecutive sold-out nights (occupancy on the books ≥ 98 %).
8. Hotel: share of bookings by lead-time bucket (0 to 1, 2 to 7, 8 to 30, 31 to 90, over 90 days) and channel.
9. Ads: the first date each campaign's cumulative spend passed $1,000.
10. Retail: refund rate per store per week, with zero-refund weeks shown as 0, not missing.
11. Pivot channel revenue into columns per brand per week (`pivot` in DuckDB, `case when` in T-SQL).
12. A cohort table for synthetic loyalty customers.

Run five of them on Azure SQL and write down each dialect change.

**What to check:** every known-answer test passes; your ROWS and RANGE moving averages differ on the store with gaps, and you can say which is right; the islands query matches what you count by eye. Commit as `feat(sql): analytical SQL patterns with known-answer tests`.

<div class="keypoints">

- Window functions compute over neighbouring rows without collapsing them; PARTITION BY restarts per entity.
- A date spine makes missing days visible; decide for each whether it is closed, not received or a real zero.
- Gaps and islands: day minus row number is constant inside a run.
- One named CTE per step, no SELECT * in final models, and a known-answer test for every pattern.

</div>
