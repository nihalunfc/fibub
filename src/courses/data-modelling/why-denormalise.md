---
title: 'Why analytics breaks the rules'
seoTitle: 'Denormalization in data warehouses: why and when'
summary: 'Normal forms make writing safe, but every question needs a pile of joins. See why warehouses repeat data on purpose, build a wide Northbay sales table, and learn the one rule that keeps denormalising safe.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Why can a warehouse afford to repeat values that a till database would normalise?
    choices: ['It is loaded by a controlled process and then only read, so there are no scattered updates to go wrong', 'Warehouses have unlimited storage', 'Repetition makes data more accurate']
    ans: 0
    why: Update anomalies come from many people changing rows. A warehouse is rebuilt or loaded by one process from the normalised source, so repeated values stay consistent.
  - q: Which join is safe to fold into a wide table without changing its row count?
    choices: ['Order lines to products (many lines to one product)', 'Stores to employees (one store to many employees)', 'Any join']
    ans: 0
    why: Following a many-to-one link adds columns but keeps one row per line. Following a one-to-many link copies each line once per match, a fan-out.
  - q: 'What is the main cost of a wide, denormalised table?'
    choices: ['The same text is stored many times and a change must be reloaded into many rows', 'Queries need more joins', 'It cannot be queried with SQL']
    ans: 0
    why: Repetition takes space and makes changes bigger. In return, questions need fewer joins and run faster.
---

**Module 1 · about 25 minutes · read first: 1.2.** You'll be able to explain why warehouses denormalise, build a wide table from normalised sources, measure what it costs, and avoid the fan-out that makes a wide table lie.

## 1. Why this matters

Analysts spend their days writing GROUP BY queries over the same few joins. If every question needs five joins, every question has five chances to go wrong, and dashboards run slowly. Warehouses fix this by joining once, during the load, and storing the result. Knowing when that is safe, and when it quietly doubles your numbers, is a core modelling skill.

## 2. The cost of 3NF when you read

"Sales by region and department in 2025." In Northbay's normalised tables, region lives on `regions`, reached through `stores`, reached through `orders`; department lives on `categories`, reached through `products`. That's six tables:

```sql
-- try
SELECT r.region_name, c.department,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN stores s ON s.store_id = o.store_id
LEFT JOIN regions r ON r.region_id = s.region_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed' AND o.order_date LIKE '2025%'
GROUP BY r.region_name, c.department
ORDER BY r.region_name, c.department
```

It works, but notice the trap on the way: the online store has no region, so an inner join to `regions` would have silently dropped all online sales. The LEFT JOIN keeps them, with a blank region. Every analyst writing this query has to remember that.

## 3. Join once, at load time

*Denormalising* means storing the result of joins so readers don't have to repeat them. Here is a wide table with one row per completed order line and every descriptive column already attached. The blank region is fixed once, for everyone, with COALESCE.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS sales_wide;
CREATE TABLE sales_wide AS
SELECT i.order_id, i.product_id, o.order_date,
       CAST(strftime('%Y', o.order_date) AS INTEGER) AS year,
       o.channel, s.store_name, COALESCE(s.city, 'Online') AS store_city,
       COALESCE(r.region_name, 'Online') AS region_name,
       p.product_name, p.brand, c.category_name, c.department,
       i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN stores s ON s.store_id = o.store_id
LEFT JOIN regions r ON r.region_id = s.region_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed';
SELECT COUNT(*) AS rows_in_wide FROM sales_wide;
```

Now the same question is one table and a GROUP BY. Press **Show how it runs**: no join step at all.

```sql
-- try
SELECT region_name, department, ROUND(SUM(sales_amount), 2) AS sales
FROM sales_wide
WHERE year = 2025
GROUP BY region_name, department
ORDER BY region_name, department
```

The totals match the six-table query to within a few cents: Ontario South Grocery is $9,352.41 here and $9,352.49 there. The wide table rounds each line before adding, just as a receipt does. Warehouses usually store amounts already rounded the way finance rounds them, so everyone gets the same cents.

## 4. What it costs

Nothing is free. Count how often the word "Grocery" is now stored:

```sql
-- try
SELECT department, COUNT(*) AS times_stored_in_wide
FROM sales_wide
GROUP BY department
```

In `categories` each department name appears on a handful of rows; in `sales_wide` "Grocery" is stored 5,139 times. Two costs follow:

- **Space.** Repeated text takes room. Columnar warehouses (BigQuery, Snowflake, Fabric, DuckDB) compress repeated values very well, so this matters less than it did.
- **Change.** If a store is renamed, every one of its rows must be rewritten. That's fine when one load process owns the table and can rebuild it from the normalised source; it would be a disaster in a till database where many users update rows.

That is the real reason analytics can break the rules: the warehouse is *read-only for users*. The normalised source stays the single place where facts are edited, and the wide table is a copy built from it.

## 5. The one rule: follow many-to-one links only

A wide table stays correct only if each join adds columns without adding rows. That happens when you follow a link from the "many" side to the "one" side: many lines → one order → one store → one region. Each line finds exactly one match.

Go the other way and rows multiply. Each store has several employees. Join them in and every sale is copied once per employee:

```sql
-- try
SELECT COUNT(*) AS rows_after_join, ROUND(SUM(w.sales_amount), 2) AS sales_after_join
FROM sales_wide w
JOIN stores s ON s.store_name = w.store_name
JOIN employees e ON e.store_id = s.store_id
```

The table had 7,112 rows; the join returns 19,485, and the sales total jumps from about $126,600 to $347,075.60, nearly three times the truth. This is called *fan-out* (see [SQL for analysts 4.5](/learn/courses/sql/fan-out/)). Facts at a different grain, like employees or daily targets, belong in their own table, not folded into this one.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a join along a foreign key to a primary key is a *lookup*. It maps each row to exactly one partner, so it is a function and keeps the row count.

**Equation:** if f: lines → products is a function (each line has one product), then |lines ⋈ products| = |lines|. Denormalising stores W = lines ⋈ orders ⋈ stores ⋈ products ⋈ categories, a chain of functions, so |W| = |lines|. If instead each store has k employees, |lines ⋈ employees| = Σ k(store of each line), roughly 3 × |lines| at Northbay.

**Analogy:** writing each pupil's class teacher next to their name is safe: every pupil has one class teacher. Writing all the school's teachers next to each pupil would turn one row into dozens.

**Try it:** a line joins to returns on (order_id, product_id), and each line has at most one return. Does a LEFT JOIN to returns keep the row count? (Yes: at most one match each, and LEFT keeps lines with none.)
</details>

## 6. Worked example

*Question:* which region sold the most Home products in 2025, and how many joins does each design need?

1. In 3NF: order_items → orders → stores → regions, and order_items → products → categories: **5 joins**.
2. In `sales_wide`: **0 joins**:

```sql
-- try
SELECT region_name, ROUND(SUM(sales_amount), 2) AS home_sales
FROM sales_wide
WHERE year = 2025 AND department = 'Home'
GROUP BY region_name
ORDER BY home_sales DESC
```

3. Ontario South leads with **$7,406.43**, just ahead of the online store at $6,855.37. The wide table answered it in one pass with no chance to forget the LEFT JOIN.
4. The middle road, which most warehouses use, is the *star schema*: keep the numbers in one table and the descriptions in a few dimension tables, one join each. You will build one in [Lesson 2.4](/learn/courses/data-modelling/star-schema/).

## 7. Practice

```sql
-- exercise: Using sales_wide, list the 5 brands with the highest 2025 sales, biggest first, rounded to 2 decimals.
-- hint: WHERE year = 2025, GROUP BY brand, ORDER BY the sum DESC, LIMIT 5.
SELECT brand, COUNT(*) AS lines
FROM sales_wide
GROUP BY brand
-- answer:
SELECT brand, ROUND(SUM(sales_amount), 2) AS sales
FROM sales_wide
WHERE year = 2025
GROUP BY brand
ORDER BY sales DESC
LIMIT 5
```

```sql
-- exercise: If Northbay Falls were renamed, how many rows of sales_wide would have to be rewritten? Count them.
-- hint: COUNT(*) with WHERE store_name = 'Northbay Falls'.
SELECT COUNT(*) AS rows_to_rewrite
FROM sales_wide
-- answer:
SELECT COUNT(*) AS rows_to_rewrite
FROM sales_wide
WHERE store_name = 'Northbay Falls'
```

```sql
-- exercise: Show online sales by category for 2024 from sales_wide, biggest first. (In 3NF this needs three joins.)
-- hint: WHERE channel = 'online' AND year = 2024, GROUP BY category_name.
SELECT category_name, ROUND(SUM(sales_amount), 2) AS sales
FROM sales_wide
GROUP BY category_name
ORDER BY sales DESC
-- answer:
SELECT category_name, ROUND(SUM(sales_amount), 2) AS sales
FROM sales_wide
WHERE channel = 'online' AND year = 2024
GROUP BY category_name
ORDER BY sales DESC
```

**New words:** *denormalise*, *wide table*, *lookup join*, *fan-out*, *star schema*.
