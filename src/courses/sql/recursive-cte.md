---
title: 'Recursive CTEs: calendars and org charts'
seoTitle: 'SQL recursive CTE explained: org chart and date series'
summary: 'A recursive CTE builds rows from the rows it just made: a list of every date in a year, or the whole chain of managers from an associate to the CEO. Learn the two parts, how it stops, and two jobs analysts use it for.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What are the two parts of a recursive CTE, joined by UNION ALL?
    choices: ['A starting query (anchor) and a step that uses the CTE''s own name', 'Two SELECTs from different tables', 'A WHERE and a HAVING']
    ans: 0
    why: The anchor makes the first rows. The recursive step reads the rows made last time and makes the next ones, until it makes none.
  - q: What stops a recursive CTE?
    choices: ['It always stops after 100 rows', 'The recursive step returns no new rows, usually because of a WHERE condition or running out of matches', 'The ORDER BY']
    ans: 1
    why: Each round feeds on the previous round's rows. When a round produces nothing, the recursion ends. Forget the condition and it runs forever (or hits a limit).
  - q: Why build a calendar with a recursive CTE before counting daily orders?
    choices: ['So days with no orders still appear, with a count of 0', 'Because orders has no dates', 'To make the query shorter']
    ans: 0
    why: Grouping orders by date only shows days that had orders. A full calendar left-joined to orders shows the empty days as 0.
---

**Module 5 · about 30 minutes · read first: 5.4 and 4.6.** You'll be able to write a recursive CTE, make sure it stops, generate a calendar of dates, and walk a manager hierarchy to any depth.

## 1. Why this matters

Two jobs come up again and again in BI work. First, **filling gaps**: a daily sales chart must show days with no sales as zero, not skip them, so you need a row for every date. Second, **hierarchies**: org charts, product categories inside categories, and parts inside parts, where you don't know in advance how many levels there are. A self-join goes up one level ([Lesson 4.6](/learn/courses/sql/self-join/)); a **recursive CTE** goes up as many as there are.

## 2. The two parts

A recursive CTE has an **anchor** (the starting rows) and a **recursive step** (a query that uses the CTE's own name to make more rows), joined by `UNION ALL`. Start with the smallest possible example, counting to 5:

```sql
-- try
WITH RECURSIVE numbers(n) AS (
  SELECT 1                 -- anchor: the first row
  UNION ALL
  SELECT n + 1             -- step: one more than the last row
  FROM numbers
  WHERE n < 5              -- stop when we reach 5
)
SELECT n FROM numbers
```

It runs in rounds:

- Round 0, the anchor: makes `1`.
- Round 1: the step reads the rows made last round (`1`) and makes `2`.
- Rounds 2 to 4 make `3`, `4` and `5`.
- Round 5: the step reads `5`; `WHERE n < 5` is false, so it makes nothing, and the recursion stops.

The `WHERE` is what makes it stop. Leave it out and the query never ends (SQLite would run until you stop it; SQL Server gives up after 100 rounds by default). SQLite and PostgreSQL write `WITH RECURSIVE`; SQL Server writes just `WITH`.

## 3. A calendar of dates

The same pattern with dates makes a **date spine**: one row per day, with no gaps. `date(d, '+1 day')` is SQLite for "the next day" (SQL Server: `DATEADD(day, 1, d)`; PostgreSQL: `d + 1`).

```sql
-- try
WITH RECURSIVE cal(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM cal WHERE d < '2025-01-14'
)
SELECT d FROM cal
```

Fourteen rows, 1 to 14 January 2025. Now left-join the orders to it, so every day appears even with no orders ([Lesson 4.3](/learn/courses/sql/left-join/)):

```sql
-- try
WITH RECURSIVE cal(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM cal WHERE d < '2025-01-14'
)
SELECT cal.d AS day, COUNT(o.order_id) AS online_orders
FROM cal
LEFT JOIN orders o
  ON o.order_date = cal.d
 AND o.channel = 'online'
GROUP BY cal.d
ORDER BY cal.d
```

1 and 8 January show **0**. Group the orders table on its own and those two days would simply be missing, and a line chart would draw straight across them as if nothing happened. Note that the channel test is in ON, not WHERE, so the empty days survive.

## 4. Walking an org chart

Each employee has a `manager_id`. To find every person's level (CEO = 0, the VPs = 1, and so on), start from the top and repeatedly add the people who report to someone already found:

```sql
-- try
WITH RECURSIVE chart AS (
  SELECT employee_id, name, role, 0 AS depth,
         name AS path
  FROM employees
  WHERE manager_id IS NULL                    -- anchor: the CEO
  UNION ALL
  SELECT e.employee_id, e.name, e.role, c.depth + 1,
         c.path || ' > ' || e.name
  FROM employees e
  JOIN chart c ON e.manager_id = c.employee_id  -- step: their direct reports
)
SELECT depth, name, role, path
FROM chart
WHERE depth <= 2
ORDER BY path
```

- Round 0 finds Morgan Ellis.
- Round 1 finds everyone whose manager is Morgan: Riya Sethi and Tom Becker.
- Round 2 finds everyone who reports to Riya or Tom: the 11 store managers, plus Hana Singh and Olivia Lee.
- Round 3 finds the 22 store staff. Round 4 finds nobody (no one reports to them), so it stops.

This time the stop condition is natural: the join runs out of matches. `path` builds a breadcrumb trail as it goes, and sorting by it prints the chart in tree order. Remove `WHERE depth <= 2` to see all 38 people.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a recursive CTE computes a **fixed point**: start with a set, keep applying a step, and stop when the step adds nothing new.

**Equation:** R₀ = anchor; Rₖ₊₁ = step(Rₖ); result = R₀ ∪ R₁ ∪ R₂ ∪ … until some Rₖ = ∅. For the org chart, step(R) = Employees ⋈_{manager_id = employee_id} R, and the result is the **transitive closure** of "reports to": everyone reachable from the CEO. For numbers it is induction: n = 1 is true, and if n is in the set and n < 5, so is n + 1.

**Analogy:** a phone tree. The head teacher calls two people; each of them calls their own list; and so on, until someone has nobody left to call. Each round only phones the people who were just reached.

**Try it:** how many rounds does the org chart take, and how many people does each find? (Rounds 0 to 3 find 1, 2, 13 and 22 people; round 4 finds none.)
</details>

## 5. Worked example: days without an online order in 2025

*Question:* on how many days of 2025 did the online shop take no orders, and in which months?

```sql
-- try
WITH RECURSIVE cal(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM cal WHERE d < '2025-12-31'
)
SELECT strftime('%m', d) AS month, COUNT(*) AS days_without_online_orders
FROM cal
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.order_date = cal.d AND o.channel = 'online'
)
GROUP BY month
ORDER BY month
```

1. The calendar has 365 rows, one per day of 2025.
2. `NOT EXISTS` keeps the days with no online order ([Lesson 4.4](/learn/courses/sql/anti-join/)).
3. Grouping by month gives the spread. In total there are **45** such days. September is the worst with **9**; November has just **1**, thanks to the Black Friday rush.

Check: online orders fell on 320 different dates in 2025, and 320 + 45 = 365.

## 6. Practice

```sql
-- exercise: Make a list of the first day of every month in 2025 (12 rows), using a recursive CTE.
-- hint: Start at '2025-01-01' and step with date(d, '+1 month') while d < '2025-12-01'.
WITH RECURSIVE months(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM months WHERE d < '2025-01-12'
)
SELECT d FROM months
-- answer:
WITH RECURSIVE months(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 month') FROM months WHERE d < '2025-12-01'
)
SELECT d FROM months
```

```sql
-- exercise: Show the chain of managers above Quinn Brown (employee 32), from Quinn up to the CEO: each person's name and how many levels above Quinn they are (Quinn = 0).
-- hint: Anchor: employee 32 with level 0. Step: join employees m ON m.employee_id = c.manager_id (go up, not down), level + 1. Carry manager_id along.
WITH RECURSIVE up AS (
  SELECT employee_id, name, manager_id, 0 AS level
  FROM employees
  WHERE employee_id = 32
)
SELECT name, level FROM up
-- answer:
WITH RECURSIVE up AS (
  SELECT employee_id, name, manager_id, 0 AS level
  FROM employees
  WHERE employee_id = 32
  UNION ALL
  SELECT m.employee_id, m.name, m.manager_id, u.level + 1
  FROM employees m
  JOIN up u ON m.employee_id = u.manager_id
)
SELECT name, level FROM up
```

```sql
-- exercise: For every day from 24 to 31 December 2025, show the date and the number of orders at store 4 (Northbay Bytown), including days with 0.
-- hint: A calendar CTE from '2025-12-24' to '2025-12-31', LEFT JOIN orders ON o.order_date = cal.d AND o.store_id = 4, then COUNT(o.order_id).
SELECT order_date, COUNT(*) AS orders
FROM orders
WHERE store_id = 4 AND order_date BETWEEN '2025-12-24' AND '2025-12-31'
GROUP BY order_date
-- answer:
WITH RECURSIVE cal(d) AS (
  SELECT '2025-12-24'
  UNION ALL
  SELECT date(d, '+1 day') FROM cal WHERE d < '2025-12-31'
)
SELECT cal.d, COUNT(o.order_id) AS orders
FROM cal
LEFT JOIN orders o ON o.order_date = cal.d AND o.store_id = 4
GROUP BY cal.d
```

**Try it on your own data:** need a date list for a spreadsheet instead? [[date-calculator]] counts days between dates; for a full spine, run the calendar CTE in [[sql-playground]] and download the result.

**New words:** *recursive CTE*, *anchor*, *recursive step*, *date spine*, *fixed point*, *transitive closure*.
