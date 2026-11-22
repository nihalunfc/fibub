---
title: Pivoting rows into columns
seoTitle: 'SQL pivot with CASE WHEN: rows into columns'
summary: 'Turn a long table (one row per department and year) into a wide one (one column per year) with SUM(CASE WHEN ...), the pivot that works in every database. Plus unpivoting back with UNION ALL.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What does SUM(CASE WHEN year = ''2025'' THEN revenue ELSE 0 END) give in a GROUP BY department query?'
    choices: ['Total revenue for all years', 'Each department''s 2025 revenue, as one column', 'The number of 2025 rows']
    ans: 1
    why: 'The CASE keeps 2025 revenue and turns everything else into 0, so the SUM per group adds up 2025 only. One such expression per year makes one column per year.'
  - q: 'To count rows per category instead of summing a value, which works?'
    choices: ['SUM(CASE WHEN ... THEN 1 ELSE 0 END)', 'MAX(CASE WHEN ... THEN 1 END)', 'AVG(CASE WHEN ... THEN 1 END)']
    ans: 0
    why: 'Each matching row adds 1 and every other row adds 0, so the sum is the count. COUNT(CASE WHEN ... THEN 1 END) also works, because COUNT skips NULLs.'
  - q: What is the main drawback of pivoting with CASE?
    choices: ['It only works in SQLite', 'You must write one expression per column, so the columns must be known in advance', 'It cannot handle NULLs']
    ans: 1
    why: 'SQL needs to know the result''s columns before it runs. A new year or category means editing the query, or building the SQL with code (dynamic SQL).'
---

**Module 8 · about 25 minutes · read first: 2.6, 3.2.** You'll be able to turn rows into columns with SUM(CASE WHEN ...), and turn columns back into rows with UNION ALL.

## 1. Why this matters

Databases like **long** tables: one row per department per year. People like **wide** tables: one row per department, one column per year, so they can compare across. Managers ask for "a table with years across the top" every week. You can do it in Excel, but doing it in SQL means the report updates itself and the numbers can't be mistyped.

## 2. Long and wide

Here is revenue in long form: one row for each department and year.

```sql
-- try
SELECT c.department,
       strftime('%Y', o.order_date) AS year,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.department, year
ORDER BY c.department, year
```

Eight rows: four departments × two years. To compare 2024 with 2025 for one department, your eye has to jump between rows. **Pivoting** turns the values of one column (year) into column headings.

## 3. The CASE pivot

The trick: group by the thing you want as rows (department), and for each column you want, write one aggregate with a CASE inside that only lets that column's rows through.

```sql
-- try
SELECT c.department,
       ROUND(SUM(CASE WHEN strftime('%Y', o.order_date) = '2024'
                      THEN i.quantity * i.unit_price * (1 - i.discount) ELSE 0 END), 2) AS rev_2024,
       ROUND(SUM(CASE WHEN strftime('%Y', o.order_date) = '2025'
                      THEN i.quantity * i.unit_price * (1 - i.discount) ELSE 0 END), 2) AS rev_2025
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.department
ORDER BY rev_2025 DESC
```

Four rows, two year columns. Grocery is the biggest department in both years ($20,817.95 then $27,876.18). This pattern is sometimes called **conditional aggregation**, and it works in every SQL database.

To **count** instead of sum, let the CASE produce 1 or 0. Watch it on the mini tables first: press **Show how it runs** and see each order's 1s and 0s land in the city's columns.

```sql
-- try
SELECT c.city,
       SUM(CASE WHEN o.amount >= 40 THEN 1 ELSE 0 END) AS big_orders,
       SUM(CASE WHEN o.amount < 40 THEN 1 ELSE 0 END) AS small_orders
FROM mini_orders o
JOIN mini_customers c ON c.id = o.customer_id
GROUP BY c.city
```

Toronto has three big orders (two kettles and the duvet) and one small one (the bagels); Ottawa has one small order.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a pivot is a grouping followed by splitting one aggregate into several, each restricted to one value of the pivot column. The CASE is a filter that lives *inside* the aggregate instead of in WHERE.

**Equation:** for each department d and year y, cell(d, y) = Σ value · [year = y], where [·] is 1 when true and 0 when false (the Iverson bracket). So γ<sub>department; SUM(value·[year=2024]), SUM(value·[year=2025])</sub>. Adding the columns back together gives the plain total, because the brackets for all years add up to 1 on every row.

**Analogy:** sorting post into pigeonholes. Every letter passes every pigeonhole, but each hole only keeps letters with its own label.

**Try it:** check the Iverson idea on the result above. Is Grocery's rev_2024 + rev_2025 equal to its total revenue? (20,817.95 + 27,876.18 = 48,694.13; run a plain SUM grouped by department to see.)
</details>

## 4. Unpivot: wide back to long

Sometimes the data arrives wide (a spreadsheet with a column per month) and you need it long, to group or chart it. Stack one SELECT per column with `UNION ALL` ([Lesson 4.7](/learn/courses/sql/union/)).

```sql
-- try
WITH wide AS (
  SELECT 'Grocery' AS department, 20817.95 AS rev_2024, 27876.18 AS rev_2025
  UNION ALL SELECT 'Home', 18605.36, 23566.55
)
SELECT department, '2024' AS year, rev_2024 AS revenue FROM wide
UNION ALL
SELECT department, '2025', rev_2025 FROM wide
ORDER BY department, year
```

Other databases have shortcuts. SQL Server and BigQuery have `PIVOT` and `UNPIVOT` operators; PostgreSQL has `crosstab()` in the tablefunc extension. They still need the column list written out, so many analysts stick with CASE because it reads the same everywhere.

## 5. Worked example

*Question:* which return reasons are most common in stores and online?

1. Join returns to orders to get the channel.
2. Group by reason; one counting CASE per channel.
3. Sort by the total.

```sql
-- try
SELECT r.reason,
       SUM(CASE WHEN o.channel = 'store' THEN 1 ELSE 0 END) AS store,
       SUM(CASE WHEN o.channel = 'online' THEN 1 ELSE 0 END) AS online,
       COUNT(*) AS total
FROM returns r
JOIN orders o ON o.order_id = r.order_id
GROUP BY r.reason
ORDER BY total DESC
```

"Wrong size" leads with 45 returns (33 store, 12 online). Online has fewer returns overall because it has fewer orders, so to compare channels fairly you would divide by each channel's order count. Insight: "Sizing problems are our top return reason; better size charts could cut returns."

## 6. Practice

```sql
-- exercise: Show the number of completed orders per channel, with one column for weekdays (Monday to Friday) and one for weekends (Saturday and Sunday).
-- hint: strftime('%w', order_date) gives '0' for Sunday up to '6' for Saturday. Use SUM(CASE WHEN ... IN ('0', '6') THEN 1 ELSE 0 END) for weekends.
SELECT channel, COUNT(*) AS orders
FROM orders
WHERE status = 'completed'
GROUP BY channel
-- answer:
SELECT channel,
       SUM(CASE WHEN strftime('%w', order_date) IN ('0', '6') THEN 0 ELSE 1 END) AS weekday_orders,
       SUM(CASE WHEN strftime('%w', order_date) IN ('0', '6') THEN 1 ELSE 0 END) AS weekend_orders
FROM orders
WHERE status = 'completed'
GROUP BY channel
```

```sql
-- exercise: Pivot the returns by year: one row per reason, with a column for 2024 returns and one for 2025 returns (use return_date).
-- hint: Group returns by reason and add SUM(CASE WHEN strftime('%Y', return_date) = '2024' THEN 1 ELSE 0 END), and the same for 2025.
SELECT reason, COUNT(*) AS returns
FROM returns
GROUP BY reason
-- answer:
SELECT reason,
       SUM(CASE WHEN strftime('%Y', return_date) = '2024' THEN 1 ELSE 0 END) AS returns_2024,
       SUM(CASE WHEN strftime('%Y', return_date) = '2025' THEN 1 ELSE 0 END) AS returns_2025
FROM returns
GROUP BY reason
```

**Try it on your own data:** reshape a CSV in [[sql-playground]], then chart the wide table with [[plot-maker]].

**New words:** *long table*, *wide table*, *pivot*, *unpivot*, *conditional aggregation*.
