---
title: Funnels and conversion
seoTitle: 'SQL funnel analysis and conversion rates, with examples'
summary: 'Count how many people or orders reach each step of a process, then work out step and overall conversion with window functions. Two funnels on Northbay: orders from placed to kept, and customers from sign-up to loyal.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A funnel has 1,000 visitors, 200 add to basket and 50 buy. What is the step conversion from basket to purchase?'
    choices: ['5%', '25%', '50%']
    ans: 1
    why: 'Step conversion divides by the step before: 50 ÷ 200 = 25%. Overall conversion divides by the first step: 50 ÷ 1,000 = 5%.'
  - q: Why must each step of a funnel be a subset of the step before?
    choices: ['So the query runs faster', 'Otherwise a later step can contain people who never did the earlier step, and the percentages stop meaning anything', 'Because SQL requires it']
    ans: 1
    why: 'A funnel tells a story of people dropping out. If step 3 counts people who skipped step 2, the drop-off between them is not real.'
  - q: Which window function gives the first step's count on every row, for overall conversion?
    choices: ['LAG(n) OVER (ORDER BY step)', 'FIRST_VALUE(n) OVER (ORDER BY step)', 'ROW_NUMBER() OVER (ORDER BY step)']
    ans: 1
    why: 'FIRST_VALUE returns the value from the first row of the window, so every row can divide by the top of the funnel. LAG gives the row before, for step conversion.'
---

**Module 8 · about 30 minutes · read first: 4.4, 6.4.** You'll be able to build a funnel table in SQL, one row per step, and add step and overall conversion rates.

## 1. Why this matters

A **funnel** is a process that people (or orders) move through in order, losing some at each step: visit → sign up → first order → repeat order. Product, marketing and e-commerce teams live by funnel numbers, because the step with the biggest drop is where effort pays off. The SQL is short once you know the shape, and it is a standard interview question.

## 2. A funnel is a few counts stacked up

Each step is a count of who reached it. Stack the counts with `UNION ALL`, one row per step, and give each step a number so the order is clear. Here is the order funnel: placed → completed → kept (no product returned).

```sql
-- try
SELECT 1 AS step, 'Placed' AS stage, COUNT(*) AS n FROM orders
UNION ALL
SELECT 2, 'Completed', COUNT(*) FROM orders WHERE status = 'completed'
UNION ALL
SELECT 3, 'Kept (no return)', COUNT(*)
FROM orders o
WHERE o.status = 'completed'
  AND NOT EXISTS (SELECT 1 FROM returns r WHERE r.order_id = o.order_id)
ORDER BY step
```

4,064 orders were placed, 3,945 completed and 3,744 kept. Step 3 uses an anti-join ([Lesson 4.4](/learn/courses/sql/anti-join/)): "completed and no matching return".

## 3. Step and overall conversion

Two rates matter:

- **Step conversion**: this step ÷ the step before. It shows where the leaks are.
- **Overall conversion**: this step ÷ the first step. It shows how many make it all the way.

Put the counts in a CTE and use `LAG` for the step before and `FIRST_VALUE` for the top of the funnel.

```sql
-- try
WITH steps AS (
  SELECT 1 AS step, 'Placed' AS stage, COUNT(*) AS n FROM orders
  UNION ALL
  SELECT 2, 'Completed', COUNT(*) FROM orders WHERE status = 'completed'
  UNION ALL
  SELECT 3, 'Kept (no return)', COUNT(*)
  FROM orders o
  WHERE o.status = 'completed'
    AND NOT EXISTS (SELECT 1 FROM returns r WHERE r.order_id = o.order_id)
)
SELECT step, stage, n,
       ROUND(100.0 * n / LAG(n) OVER (ORDER BY step), 1) AS step_pct,
       ROUND(100.0 * n / FIRST_VALUE(n) OVER (ORDER BY step), 1) AS overall_pct
FROM steps
ORDER BY step
```

97.1% of orders complete, 94.9% of completed orders are kept, and 92.1% of all placed orders end up as kept sales.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a funnel is a chain of nested sets, S₁ ⊇ S₂ ⊇ S₃ ⊇ …. Each step adds a condition, and in relational algebra each step is a selection on the one before: S₂ = σ<sub>completed</sub>(S₁), S₃ = σ<sub>no return</sub>(S₂).

**Equation:** step conversion pₖ = |Sₖ| ÷ |Sₖ₋₁|, and overall conversion = |Sₖ| ÷ |S₁| = p₂ × p₃ × … × pₖ. The overall rate is the product of the step rates, which is why a small leak early hurts everything after it.

**Analogy:** a sieve stack. Sand goes through one sieve after another; what reaches the bottom passed every sieve above it.

**Try it:** step rates of 50%, 40% and 50%. What is the overall rate? (0.5 × 0.4 × 0.5 = 10%.) Check the Northbay numbers: 0.971 × 0.949 ≈ 0.921.
</details>

## 4. A customer funnel

Funnels of people are more common than funnels of orders. On Northbay: loyalty members → placed a completed order → came back for a second → became regulars (5+ orders) → super-regulars (10+). Count completed orders per customer once, then count how many pass each threshold. Because "10 or more" is inside "5 or more", which is inside "2 or more", the steps are properly nested.

```sql
-- try
WITH per_customer AS (
  SELECT customer_id, COUNT(*) AS orders
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
),
steps AS (
  SELECT 1 AS step, 'Member' AS stage, (SELECT COUNT(*) FROM customers) AS n
  UNION ALL SELECT 2, 'First order', COUNT(*) FROM per_customer
  UNION ALL SELECT 3, 'Second order', SUM(orders >= 2) FROM per_customer
  UNION ALL SELECT 4, '5+ orders', SUM(orders >= 5) FROM per_customer
  UNION ALL SELECT 5, '10+ orders', SUM(orders >= 10) FROM per_customer
)
SELECT step, stage, n,
       ROUND(100.0 * n / LAG(n) OVER (ORDER BY step), 1) AS step_pct,
       ROUND(100.0 * n / FIRST_VALUE(n) OVER (ORDER BY step), 1) AS overall_pct
FROM steps
ORDER BY step
```

`SUM(orders >= 2)` works because in SQLite a true comparison is 1 and false is 0. In SQL Server or PostgreSQL, write `SUM(CASE WHEN orders >= 2 THEN 1 ELSE 0 END)`, or `COUNT(*) FILTER (WHERE orders >= 2)` in PostgreSQL.

## 5. Time-boxed funnels

"Came back eventually" is a weak goal: over two years almost everyone does. Real funnels usually add a time limit: *second order within 90 days of the first*. That needs each customer's first and second order dates, which `ROW_NUMBER` gives you ([Lesson 6.2](/learn/courses/sql/ranking/)).

```sql
-- try
WITH numbered AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date, order_id) AS n
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
)
SELECT customer_id,
       MAX(CASE WHEN n = 1 THEN order_date END) AS first_order,
       MAX(CASE WHEN n = 2 THEN order_date END) AS second_order
FROM numbered
WHERE customer_id <= 5
GROUP BY customer_id
```

From here, the gap is `julianday(second_order) - julianday(first_order)`. Three of these first five customers (1, 3 and 4) came back within 90 days; customer 5 took 99 days.

## 6. Worked example

*Question:* where do Northbay customers drop out?

1. 603 members; 598 placed a completed order (99.2%). The 5 who didn't include the 3 duplicate sign-ups from [Lesson 7.4](/learn/courses/sql/duplicates/).
2. 591 came back for a second order (98.8% of those who ordered). Over two years, nearly everyone returns once.
3. 423 reached 5 orders (71.6% of step 2): this is the biggest drop.
4. Only 41 reached 10 orders (9.7% of step 4).

Insight: "Getting a first and second order is easy; turning occasional shoppers into regulars is where we lose people." The time-boxed version tells a sharper story: only 273 of 598 (45.7%) came back *within 90 days*.

## 7. Practice

```sql
-- exercise: Build the order funnel (placed, completed, kept) separately for each channel: one row per channel with the three counts as columns.
-- hint: Group by channel. Placed is COUNT(*); completed is SUM(status = 'completed'); kept also needs NOT EXISTS on returns inside a CASE or SUM.
SELECT channel, COUNT(*) AS placed
FROM orders
GROUP BY channel
-- answer:
SELECT o.channel,
       COUNT(*) AS placed,
       SUM(o.status = 'completed') AS completed,
       SUM(o.status = 'completed'
           AND NOT EXISTS (SELECT 1 FROM returns r WHERE r.order_id = o.order_id)) AS kept
FROM orders o
GROUP BY o.channel
```

Online keeps 95.1% of completed orders, stores 94.8%: almost the same.

```sql
-- exercise: Build a 3-step customer funnel: members, customers with a completed first order, and customers whose second completed order came within 90 days of the first. Show step, stage and n.
-- hint: Reuse the numbered CTE from section 5, pivot to first_order and second_order per customer, then count rows WHERE julianday(second_order) - julianday(first_order) <= 90.
SELECT 1 AS step, 'Member' AS stage, COUNT(*) AS n FROM customers
-- answer:
WITH numbered AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date, order_id) AS n
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
),
pairs AS (
  SELECT customer_id,
         MAX(CASE WHEN n = 1 THEN order_date END) AS first_order,
         MAX(CASE WHEN n = 2 THEN order_date END) AS second_order
  FROM numbered
  GROUP BY customer_id
)
SELECT 1 AS step, 'Member' AS stage, COUNT(*) AS n FROM customers
UNION ALL
SELECT 2, 'First order', COUNT(*) FROM pairs
UNION ALL
SELECT 3, 'Second within 90 days', COUNT(*) FROM pairs
WHERE julianday(second_order) - julianday(first_order) <= 90
```

**Try it on your own data:** load an events or orders CSV into [[sql-playground]] and stack your own steps; [[plot-maker]] can draw the funnel as bars.

**New words:** *funnel*, *step conversion*, *overall conversion*, *time-boxed funnel*.
