---
title: 'Gaps and islands: streaks and missing days'
seoTitle: 'SQL gaps and islands: find streaks and missing dates'
summary: 'Find runs of consecutive days (islands) and the holes between them (gaps) with one neat trick: date minus row number. Practise on Northbay''s online shop, store by store.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In the gaps-and-islands trick, why is date minus ROW_NUMBER() the same for every day in a streak?'
    choices: ['Because ROW_NUMBER restarts every week', 'Both go up by exactly 1 per row inside a streak, so their difference stays fixed', 'Because dates are text']
    ans: 1
    why: 'Inside a streak the date rises by one day and the row number rises by one. Their difference is constant, so it can be used as a group label.'
  - q: Which window function is the simplest way to find gaps between days with sales?
    choices: ['LEAD(order_date) OVER (ORDER BY order_date)', 'RANK() OVER (ORDER BY order_date)', 'SUM(order_date) OVER ()']
    ans: 0
    why: 'LEAD puts the next date beside each date. When the next date is more than one day later, there is a gap between them.'
  - q: 'You want the days a store had no sales at all. What do you need?'
    choices: ['Only the orders table', 'A calendar of every day, LEFT JOINed to the sales', 'GROUP BY order_date']
    ans: 1
    why: 'Days with no sales have no rows in orders. Only a calendar that lists every day can show what is missing.'
---

**Module 8 · about 30 minutes · read first: 6.2, 6.4, 5.5.** You'll be able to find streaks of consecutive days, the gaps between them, and days with no data at all.

## 1. Why this matters

"What is our longest run of days with online sales?", "When was this sensor offline?", "How many days in a row has this user logged in?" These are **gaps-and-islands** problems. They look hard because SQL has no "streak" function, but one short trick solves nearly all of them. It is a classic medium-to-hard interview question, and once you know it you will spot it everywhere.

## 2. Islands and gaps

Picture the days a store had sales as dots on a calendar. An **island** is a run of consecutive days with sales. A **gap** is the run of empty days between two islands. In early March 2024, Northbay's online shop had sales on these days:

```sql
-- try
SELECT DISTINCT order_date
FROM orders
WHERE store_id = 12 AND status = 'completed'
  AND order_date BETWEEN '2024-03-01' AND '2024-03-15'
ORDER BY order_date
```

Eight days. By eye, the islands are 1–2 March, 5 March, 9–11 March and 13–14 March. The query below finds them without looking.

## 3. The trick: date minus row number

Number the days in order with `ROW_NUMBER()`. Inside an island, the date goes up by one day per row, and so does the row number. So **date minus row number** stays the same for the whole island, and jumps when a gap starts. That difference becomes a group label.

Press **Run**, then compare `rn` and `grp` row by row:

```sql
-- try
WITH days AS (
  SELECT DISTINCT order_date
  FROM orders
  WHERE store_id = 12 AND status = 'completed'
    AND order_date BETWEEN '2024-03-01' AND '2024-03-15'
)
SELECT order_date,
       ROW_NUMBER() OVER (ORDER BY order_date) AS rn,
       date(order_date, '-' || ROW_NUMBER() OVER (ORDER BY order_date) || ' days') AS grp
FROM days
ORDER BY order_date
```

1 and 2 March both give `grp` = 29 February. 5 March gives 2 March. 9, 10 and 11 March all give 5 March. The value of `grp` means nothing on its own; it only has to be equal within an island and different between islands. (SQL Server: `DATEADD(day, -ROW_NUMBER() OVER (ORDER BY order_date), order_date)`; PostgreSQL: `order_date - ROW_NUMBER() OVER (ORDER BY order_date)::int` on a DATE column.)

Now group by the label: each group is one island.

```sql
-- try
WITH days AS (
  SELECT DISTINCT order_date
  FROM orders
  WHERE store_id = 12 AND status = 'completed'
    AND order_date BETWEEN '2024-03-01' AND '2024-03-15'
),
labelled AS (
  SELECT order_date,
         date(order_date, '-' || ROW_NUMBER() OVER (ORDER BY order_date) || ' days') AS grp
  FROM days
)
SELECT MIN(order_date) AS starts, MAX(order_date) AS ends, COUNT(*) AS days
FROM labelled
GROUP BY grp
ORDER BY starts
```

Four islands, exactly as we saw by eye. The `DISTINCT` in the first CTE matters: a day with three orders must count once, or the row numbers run ahead of the dates and the trick breaks.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** inside an island, date and row number are both arithmetic sequences with step 1, so their difference is constant. Between islands, the date jumps by more than 1 while the row number still rises by 1, so the difference changes.

**Equation:** for the i-th day dᵢ in sorted order, the label is gᵢ = dᵢ − i. If dᵢ₊₁ = dᵢ + 1 then gᵢ₊₁ = gᵢ (same island). If dᵢ₊₁ = dᵢ + k with k > 1, then gᵢ₊₁ = gᵢ + (k − 1), and k − 1 is exactly the length of the gap. Grouping is then γ<sub>g; MIN(d), MAX(d), COUNT(*)</sub>.

**Analogy:** two runners on a track at the same speed keep the same distance between them. If one stops for a few seconds (a gap), the distance changes and stays changed.

**Try it:** dates 10, 11, 12, 15, 16 with row numbers 1–5. What are the labels? (9, 9, 9, 11, 11: two islands, and the gap is 11 − 9 = 2 days long.)
</details>

## 4. Gaps with LEAD

When you want the gaps themselves, `LEAD` is simpler: put the next sales day beside each sales day, and keep the rows where the next one is more than a day away ([Lesson 6.4](/learn/courses/sql/lag-lead/)).

```sql
-- try
WITH days AS (
  SELECT DISTINCT order_date
  FROM orders
  WHERE store_id = 12 AND status = 'completed'
),
nexts AS (
  SELECT order_date, LEAD(order_date) OVER (ORDER BY order_date) AS next_day
  FROM days
)
SELECT order_date AS last_sale, next_day AS next_sale,
       julianday(next_day) - julianday(order_date) - 1 AS empty_days
FROM nexts
WHERE julianday(next_day) - julianday(order_date) > 1
ORDER BY empty_days DESC, last_sale
LIMIT 5
```

The longest quiet spell online was 6 days, between 15 and 22 August 2024.

## 5. Worked example

*Question:* what was the online shop's longest streak of days with sales?

1. Take the 554 distinct days on which store 12 had a completed order (out of 731 days in 2024–2025).
2. Label each day with date minus row number and group by the label: that gives 127 islands.
3. Sort the islands by length. The longest are **19 days**, twice: 9–27 January 2025 and 13–31 December 2025.

```sql
-- try
WITH days AS (
  SELECT DISTINCT order_date
  FROM orders
  WHERE store_id = 12 AND status = 'completed'
),
labelled AS (
  SELECT order_date,
         date(order_date, '-' || ROW_NUMBER() OVER (ORDER BY order_date) || ' days') AS grp
  FROM days
)
SELECT MIN(order_date) AS starts, MAX(order_date) AS ends, COUNT(*) AS days
FROM labelled
GROUP BY grp
ORDER BY days DESC, starts
LIMIT 5
```

Insight: "Online sales have become nearly daily in busy months; both 19-day runs are in 2025, and one is the holiday season." For a physical store the streaks are much shorter, because Northbay's sample data spreads a few orders a day across eleven stores.

## 6. Practice

```sql
-- exercise: Find each store's longest streak of consecutive days with completed orders. Show store_id and the longest streak in days, longest first (ties by store_id).
-- hint: Add PARTITION BY store_id to the ROW_NUMBER, group islands by store_id and grp, then take MAX of the island lengths per store.
SELECT store_id, COUNT(DISTINCT order_date) AS sales_days
FROM orders
WHERE status = 'completed'
GROUP BY store_id
-- answer:
WITH days AS (
  SELECT DISTINCT store_id, order_date
  FROM orders
  WHERE status = 'completed'
),
labelled AS (
  SELECT store_id, order_date,
         date(order_date, '-' || ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY order_date) || ' days') AS grp
  FROM days
),
islands AS (
  SELECT store_id, grp, COUNT(*) AS len
  FROM labelled
  GROUP BY store_id, grp
)
SELECT store_id, MAX(len) AS longest_streak
FROM islands
GROUP BY store_id
ORDER BY longest_streak DESC, store_id
```

```sql
-- exercise: How many days in 2024 had no completed online order (store 12)? Return one number.
-- hint: Build a calendar of every day in 2024 with WITH RECURSIVE, LEFT JOIN the online sales days, and count the rows where the join found nothing.
SELECT COUNT(DISTINCT order_date) AS days_with_sales
FROM orders
WHERE store_id = 12 AND status = 'completed' AND order_date < '2025-01-01'
-- answer:
WITH RECURSIVE cal(d) AS (
  SELECT '2024-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM cal WHERE d < '2024-12-31'
),
sales AS (
  SELECT DISTINCT order_date
  FROM orders
  WHERE store_id = 12 AND status = 'completed'
)
SELECT COUNT(*) AS days_without_sales
FROM cal
LEFT JOIN sales s ON s.order_date = cal.d
WHERE s.order_date IS NULL
```

**Try it on your own data:** check a log of dates for missing days with [[date-calculator]], or run these queries on your CSV in [[sql-playground]].

**New words:** *island*, *gap*, *streak*, *group label*.
