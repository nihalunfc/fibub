---
title: 'Role-playing dimensions: one calendar, many dates'
seoTitle: 'Role-playing dimensions in a data warehouse, with SQL'
summary: 'A return has an order date and a return date, and both point at the same date dimension. Learn to join one dimension twice, give each role its own view, and see how the role you pick changes the answer.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a role-playing dimension?
    choices: ['A dimension that changes over time', 'One dimension table that a fact table joins to more than once, for different meanings', 'A dimension with only two rows']
    ans: 1
    why: dim_date plays "order date" and "return date" for fact_returns. It is one table joined twice, each time in a different role.
  - q: 'How do you join dim_date twice in one query?'
    choices: ['You can''t; make a copy of the table', 'Give each join its own alias, like od and rd, and join each on a different key column', 'Join it once on both keys with OR']
    ans: 1
    why: Each alias is a separate pass over the same table. od joins on order_date_key, rd on return_date_key.
  - q: 'Returns counted by order month look low for December 2025. Why?'
    choices: ['December had no sales', 'Many December orders haven''t been returned yet: their returns will land in January, after the data ends', 'The date dimension is missing December']
    ans: 1
    why: Counting by order date assigns each return to the month of the sale, so recent months keep growing as late returns arrive. Counting by return date is complete but mixes sales from different months.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 6: Order Management (role-playing dimensions)'
  - 'Microsoft Learn, Power BI guidance: Understand star schema and the importance for Power BI https://learn.microsoft.com/en-us/power-bi/guidance/star-schema'
  - 'SQLite documentation: CREATE VIEW https://www.sqlite.org/lang_createview.html'
---

**Module 4 · about 25 minutes · read first: 4.2.** You'll be able to join one dimension more than once with aliases, build a view per role, and explain why "returns in November" has two different right answers.

<div class="bigidea">A role-playing dimension is one dimension table joined to a fact more than once, each join giving it a different meaning, such as order date and return date.</div>

**In everyday terms:** one actor playing two parts in a play. It is the same person on stage, but in each scene the costume tells you which character they are. The alias is the costume.

## 1. Why this matters

Many business events carry several dates: an order is placed, shipped and delivered; a return is bought on one day and brought back on another; an employee is hired and later leaves. Building a separate calendar for each would be a maintenance mess. Instead the warehouse keeps **one** date dimension and lets it play several roles. You'll see this in every Power BI model with more than one date (and in the "inactive relationship" warning that comes with it), so it is worth understanding at the SQL level.

## 2. Two dates on one fact row

Build a small date dimension (the full one is in [Lesson 4.2](/learn/courses/data-modelling/date-dimension/)) and a returns fact with two date keys:

```sql
-- noviz
DROP TABLE IF EXISTS dim_date;
CREATE TABLE dim_date AS
WITH RECURSIVE days(d) AS (
  SELECT '2024-01-01' UNION ALL SELECT date(d, '+1 day') FROM days WHERE d < '2025-12-31'
)
SELECT CAST(strftime('%Y%m%d', d) AS INTEGER) AS date_key,
       d AS full_date,
       CAST(strftime('%Y', d) AS INTEGER) AS year,
       CAST(strftime('%m', d) AS INTEGER) AS month_num,
       substr(d, 1, 7) AS year_month,
       substr('SunMonTueWedThuFriSat', 1 + 3 * CAST(strftime('%w', d) AS INTEGER), 3) AS weekday_name
FROM days;

DROP TABLE IF EXISTS fact_returns;
CREATE TABLE fact_returns AS
SELECT r.return_id, r.order_id, r.product_id,
       CAST(strftime('%Y%m%d', o.order_date) AS INTEGER) AS order_date_key,
       CAST(strftime('%Y%m%d', r.return_date) AS INTEGER) AS return_date_key,
       CAST(julianday(r.return_date) - julianday(o.order_date) AS INTEGER) AS days_to_return,
       r.reason
FROM returns r
JOIN orders o ON o.order_id = r.order_id;

SELECT * FROM fact_returns ORDER BY return_id LIMIT 3;
```

Each of the 204 rows has an `order_date_key` and a `return_date_key`. Both are foreign keys to the same `dim_date`. `days_to_return` is a measure worked out at load time, so nobody has to subtract dates in a report.

## 3. Join the same table twice

A **role-playing dimension** is one dimension table joined to a fact more than once, each join giving it a different meaning. In SQL you simply join it twice with two aliases. Press **Run**, then **Show how it runs**: you will see two separate join steps, one per role.

```sql
-- try
SELECT f.return_id,
       od.full_date AS ordered_on,  od.weekday_name AS ordered_weekday,
       rd.full_date AS returned_on, rd.weekday_name AS returned_weekday,
       f.days_to_return
FROM fact_returns f
JOIN dim_date od ON od.date_key = f.order_date_key
JOIN dim_date rd ON rd.date_key = f.return_date_key
WHERE f.return_id <= 5
```

`od` and `rd` are the same 731 rows, read twice. The alias decides the role. Get the aliases or the ON columns crossed and the query still runs, it just answers a different question. That is the danger of role-playing.

<!--fig:role-playing-dates-->

## 4. One view per role

To make the roles impossible to mix up, warehouses usually publish one **view** per role, with column names that say the role. A view is a saved SELECT that behaves like a table.

```sql
-- noviz
DROP VIEW IF EXISTS order_date;
CREATE VIEW order_date AS
SELECT date_key AS order_date_key, full_date AS order_date, year AS order_year,
       year_month AS order_month, weekday_name AS order_weekday
FROM dim_date;

DROP VIEW IF EXISTS return_date;
CREATE VIEW return_date AS
SELECT date_key AS return_date_key, full_date AS return_date, year AS return_year,
       year_month AS return_month, weekday_name AS return_weekday
FROM dim_date;
```

Now a report reads like plain English, and the join columns have matching names:

```sql
-- try
SELECT rd.return_weekday, COUNT(*) AS returns
FROM fact_returns f
JOIN return_date rd ON rd.return_date_key = f.return_date_key
GROUP BY rd.return_weekday
ORDER BY returns DESC
```

Sunday (38) and Saturday (35) are the busiest days at the returns desk; Tuesday (21) is the quietest. In Power BI the same idea is either one date table with one active and one inactive relationship (switched on with `USERELATIONSHIP` in a measure), or one copy of the date table per role. Copies are simpler for report users, for the same reason the views are.

<div class="meaning">

<dl>
<dt>Role-playing dimension</dt><dd>One dimension used for several foreign keys on the same fact.</dd>
<dt>Alias</dt><dd>A short name for a table in one query (od, rd) so the same table can be joined twice.</dd>
<dt>View</dt><dd>A saved SELECT that behaves like a table; one view per role with role names on its columns.</dd>
<dt>Role</dt><dd>What a date means on the row: when it was bought, when it came back.</dd>
<dt>Physical meaning</dt><dd>The fact row holds two keys into the same dim_date. The query reads dim_date twice, once per key, and each copy gives its columns a different meaning.</dd>
</dl>

</div>

<div class="myth">

**"Returns in November has one right answer."** By order date it is 14; by return date it is 11. Both are right for different questions. Always label which role a chart uses.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Fact with two dates.</b> <table class="lk-tbl"><tr><th>return</th><th>order_date_key</th><th>return_date_key</th></tr><tr><td>1</td><td>20251028</td><td>20251105</td></tr><tr><td>2</td><td>20251110</td><td>20251120</td></tr></table></div>
<div class="step"><b>Join dim_date as od.</b> <table class="lk-tbl"><tr><th>return</th><th>order month</th></tr><tr><td>1</td><td><mark>Oct</mark></td></tr><tr><td>2</td><td><mark>Nov</mark></td></tr></table></div>
<div class="step"><b>Join dim_date again as rd.</b> <table class="lk-tbl"><tr><th>return</th><th>order month</th><th>return month</th></tr><tr><td>1</td><td>Oct</td><td><mark>Nov</mark></td></tr><tr><td>2</td><td>Nov</td><td><mark>Nov</mark></td></tr></table></div>
<div class="step"><b>Count November.</b> <table class="lk-tbl"><tr><th>role</th><th>returns</th></tr><tr><td>by order month</td><td>1</td></tr><tr><td>by return month</td><td>2</td></tr></table></div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-role-month"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a fact row with two date keys holds two separate functions into the same set of days. The dimension is shared; the roles are the functions.

**Equation:** let D be the set of days and F the returns. Two functions o: F → D (order date) and r: F → D (return date). Grouping by month through o gives counts c_o(m) = |{f : month(o(f)) = m}|, through r gives c_r(m) = |{f : month(r(f)) = m}|. Both sum to |F| = 204 over all months, but month by month they differ wherever o(f) and r(f) fall in different months, which happens for 87 of the 204 returns. And r(f) − o(f) = days_to_return ≥ 1 for every row.

**Analogy:** one map of the city, used twice on a delivery note: once to mark where the parcel was picked up, once where it was dropped off. Same map, two pins, two meanings.

**Try it:** a return was ordered on 2025-11-28 and brought back on 2025-12-10. Which month does it count in by order date, and by return date? (November; December.)
</details>

## 5. Worked example: "returns in November"

*Question:* how many returns were there in November 2025?

It depends on the role. By **order date** (returns of things bought in November) or by **return date** (things brought back in November)?

```sql
-- try
SELECT od.order_month AS month,
       COUNT(*) AS returns_by_order_month
FROM fact_returns f
JOIN order_date od ON od.order_date_key = f.order_date_key
WHERE od.order_year = 2025 AND od.order_month >= '2025-10'
GROUP BY od.order_month
```

```sql
-- try
SELECT rd.return_month AS month,
       COUNT(*) AS returns_by_return_month
FROM fact_returns f
JOIN return_date rd ON rd.return_date_key = f.return_date_key
WHERE rd.return_year = 2025 AND rd.return_month >= '2025-10'
GROUP BY rd.return_month
```

November 2025: **14** by order month, **11** by return month. December 2025: **6** by order month, **11** by return month. Both are correct answers to different questions:

- By order month answers "how good were November's sales?" (a quality measure for the products sold). Its recent months are always too low at first: December's orders can still come back in January, after our data ends, so the number will grow.
- By return month answers "how busy was the returns desk?" (a workload measure). It is complete the moment the month ends.

Always label which role a chart uses. "Returns, by month of purchase" removes the argument before it starts.

## 6. Practice

```sql
-- exercise: Black Friday 2025 ran from 2025-11-24 to 2025-11-30. For returns of orders placed that week, show the order month, the return month, and the count.
-- hint: Join dim_date twice (od on order_date_key, rd on return_date_key), filter od.full_date BETWEEN the two dates, GROUP BY both months.
SELECT od.year_month AS ordered, COUNT(*) AS returns
FROM fact_returns f
JOIN dim_date od ON od.date_key = f.order_date_key
GROUP BY od.year_month
-- answer:
SELECT od.year_month AS ordered, rd.year_month AS returned, COUNT(*) AS returns
FROM fact_returns f
JOIN dim_date od ON od.date_key = f.order_date_key
JOIN dim_date rd ON rd.date_key = f.return_date_key
WHERE od.full_date BETWEEN '2025-11-24' AND '2025-11-30'
GROUP BY od.year_month, rd.year_month
```

```sql
-- exercise: How many returns were bought in one calendar year and brought back in another? Show order year, return year and count, only where they differ.
-- hint: Use the order_date and return_date views, GROUP BY order_year, return_year, and keep rows where the two years differ.
SELECT od.order_year, COUNT(*) AS returns
FROM fact_returns f
JOIN order_date od ON od.order_date_key = f.order_date_key
GROUP BY od.order_year
-- answer:
SELECT od.order_year, rd.return_year, COUNT(*) AS returns
FROM fact_returns f
JOIN order_date od ON od.order_date_key = f.order_date_key
JOIN return_date rd ON rd.return_date_key = f.return_date_key
WHERE od.order_year <> rd.return_year
GROUP BY od.order_year, rd.return_year
```

```sql
-- exercise: Show the average days to return for each reason, 1 decimal place, slowest first.
-- hint: No date join needed: days_to_return is already on the fact. AVG, ROUND, GROUP BY reason, ORDER BY the average DESC.
SELECT reason, COUNT(*) AS returns
FROM fact_returns
GROUP BY reason
-- answer:
SELECT reason, ROUND(AVG(days_to_return), 1) AS avg_days
FROM fact_returns
GROUP BY reason
ORDER BY avg_days DESC
```

<div class="keypoints">

- Keep one date dimension and let it play several roles.
- Join it once per role with a different alias.
- Crossed aliases still run but answer a different question.
- Publish one view per role with role names on the columns.
- Label every chart with the role it uses.

</div>

**New words:** *role-playing dimension*, *alias*, *view*, *days_to_return*.
